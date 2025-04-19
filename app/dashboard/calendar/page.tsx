"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Copy } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { addDays, isSameDay, isWithinInterval } from "date-fns"

interface RentalEvent {
  id: string
  customerName: string
  equipment: Array<{
    id: string
    name: string
  }>
  startDate: Date
  endDate: Date
  status: string
  color?: string
}

interface EquipmentRentals {
  name: string
  rentals: RentalEvent[]
}

interface RentalsByEquipment {
  [key: string]: EquipmentRentals
}

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [formLink, setFormLink] = useState("")
  const [loading, setLoading] = useState(true)
  const [todaySchedule, setTodaySchedule] = useState<RentalEvent[]>([])
  const [upcomingReturns, setUpcomingReturns] = useState<RentalEvent[]>([])
  const [rentalsByEquipment, setRentalsByEquipment] = useState<RentalsByEquipment>({})
  const [colorMap, setColorMap] = useState<{ [key: string]: string }>({})
  const [events, setEvents] = useState<RentalEvent[]>([])

  const getCustomerColor = useCallback((customerName: string) => {
    if (colorMap[customerName]) return colorMap[customerName]
    
    const colors = [
      'var(--primary)',
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#96CEB4',
      '#D4A373',
      '#E9C46A',
      '#F4A261',
    ]
    
    const existingColors = Object.values(colorMap)
    const availableColors = colors.filter(color => !existingColors.includes(color))
    
    const newColor = availableColors.length > 0 
      ? availableColors[0] 
      : colors[Object.keys(colorMap).length % colors.length]
    
    setColorMap(prev => ({ ...prev, [customerName]: newColor }))
    return newColor
  }, [colorMap])

  const getRentalForDate = (date: Date, rentals: RentalEvent[]) => {
    return rentals.find(rental => 
      isWithinInterval(date, { 
        start: new Date(rental.startDate), 
        end: new Date(rental.endDate) 
      })
    )
  }

  const getDayContent = (day: Date, rentals: RentalEvent[]) => {
    // Convert the input day to midnight for proper comparison
    const targetDate = new Date(day)
    targetDate.setHours(0, 0, 0, 0)

    const rental = rentals.find(rental => {
      const startDate = new Date(rental.startDate)
      const endDate = new Date(rental.endDate)
      startDate.setHours(0, 0, 0, 0)
      endDate.setHours(0, 0, 0, 0)
      
      return targetDate >= startDate && targetDate <= endDate
    })

    if (!rental) {
      return (
        <div className="h-8 w-8 flex items-center justify-center text-foreground hover:bg-muted rounded-sm mx-auto">
          {day.getDate()}
        </div>
      )
    }

    return (
      <div
        className="h-8 w-8 flex items-center justify-center text-white rounded-sm mx-auto"
        style={{ 
          backgroundColor: rental.status === 'Reserved' ? '#FF9800' : '#2196F3',
          opacity: rental.status === 'Reserved' ? '0.8' : '1'
        }}
      >
        {day.getDate()}
      </div>
    )
  }

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/calendar')
        const data = await response.json()
        
        if (!response.ok) throw new Error(data.error)
        
        // Sort equipment by name to ensure consistent order
        const sortedEquipment = Object.entries(data.rentalsByEquipment as RentalsByEquipment)
          .sort(([nameA], [nameB]) => nameA.localeCompare(nameB))
          .reduce((acc, [key, value]: [string, EquipmentRentals]) => {
            // Add color to rentals
            if (value.rentals && Array.isArray(value.rentals)) {
              value.rentals.forEach((rental: RentalEvent) => {
                rental.color = getCustomerColor(rental.customerName)
              })
            }
            acc[key] = value
            return acc
          }, {} as RentalsByEquipment)
        
        setTodaySchedule(data.todaySchedule)
        setUpcomingReturns(data.upcomingReturns)
        setRentalsByEquipment(sortedEquipment)
      } catch (error) {
        console.error('Error fetching calendar data:', error)
        toast.error('Failed to load calendar data')
      } finally {
        setLoading(false)
      }
    }

    fetchCalendarData()
  }, [])

  const generateFormLink = () => {
    const token = Math.random().toString(36).substring(2, 15)
    const link = `${window.location.origin}/dashboard/rentals/create-rental?token=${token}`
    setFormLink(link)
    return link
  }

  const copyFormLink = () => {
    if (!formLink) {
      const link = generateFormLink()
      navigator.clipboard.writeText(link)
    } else {
      navigator.clipboard.writeText(formLink)
    }
    toast.success("Rental form link copied! Ready to be shared with customers.", {
      description: "The link has been copied to your clipboard. You can now share it with your customers.",
      duration: 5000,
    })
  }

  // Calculate days until return
  const getDaysUntil = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const returnDate = new Date(date)
    returnDate.setHours(0, 0, 0, 0)
    const diffTime = returnDate.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  // Add function to get upcoming rentals
  const getUpcomingRentals = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return Object.values(rentalsByEquipment)
      .flatMap(eq => eq.rentals)
      .filter(rental => {
        const startDate = new Date(rental.startDate)
        startDate.setHours(0, 0, 0, 0)
        return startDate > today && rental.status === 'Reserved'
      })
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
  }

  // Add function to get active returns
  const getActiveReturns = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return Object.values(rentalsByEquipment)
      .flatMap(eq => eq.rentals)
      .filter(rental => {
        const endDate = new Date(rental.endDate)
        return endDate > today && rental.status === 'Active'
      })
      .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
  }

  // Get days until start
  const getDaysUntilStart = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const startDate = new Date(date)
    startDate.setHours(0, 0, 0, 0)
    const diffTime = startDate.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  // Add function to get incoming returns
  const getIncomingReturns = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return Object.values(rentalsByEquipment)
      .flatMap(eq => eq.rentals)
      .filter(rental => {
        const endDate = new Date(rental.endDate)
        endDate.setHours(0, 0, 0, 0)
        return endDate > today && (rental.status === 'Active' || rental.status === 'Reserved')
      })
      .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
  }

  // Add a function to get rental dates for modifiers
  const getRentalDates = (rentals: RentalEvent[]) => {
    return rentals.map(rental => ({
      from: new Date(rental.startDate),
      to: new Date(rental.endDate)
    }))
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Calendar" text="View and manage rental schedules">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/dashboard/rentals/create-rental">
              <Plus className="mr-2 h-4 w-4" /> New Rental
            </Link>
          </Button>
          <Button variant="outline" onClick={copyFormLink} title="Copy rental form link" className="w-full sm:w-auto">
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </DashboardHeader>

      <div className="grid gap-4 md:gap-6 md:grid-cols-[1fr] lg:grid-cols-[2fr_1fr]">
        <div className="grid gap-3 sm:gap-4 auto-rows-min grid-cols-1">
          {loading ? (
            <Card className="w-full">
              <CardContent className="p-4">
                <div className="text-center text-muted-foreground">Loading calendars...</div>
              </CardContent>
            </Card>
          ) : Object.entries(rentalsByEquipment).length === 0 ? (
            <Card className="w-full">
              <CardContent className="p-4">
                <div className="text-center text-muted-foreground">No equipment found. Add some equipment to view calendars.</div>
              </CardContent>
            </Card>
          ) : (
            // Ensure consistent order by using sorted entries
            Object.entries(rentalsByEquipment)
              .sort(([nameA], [nameB]) => nameA.localeCompare(nameB))
              .map(([equipmentId, { name, rentals }]) => (
                <Card key={equipmentId} className="w-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-center">{name}</CardTitle>
                  </CardHeader>
                  <CardContent className="px-0 pb-0 pt-0">
                    <div className="w-full flex justify-center">
                      <Calendar 
                        mode="single" 
                        selected={undefined}
                        onSelect={setDate} 
                        className="w-full"
                        classNames={{
                          root: "w-full",
                          months: "w-full",
                          month: "w-full space-y-4",
                          caption: "relative flex items-center justify-center pt-1 pb-2",
                          caption_label: "text-sm font-medium mx-auto",
                          nav: "space-x-1 flex items-center bg-transparent",
                          nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute top-1",
                          nav_button_previous: "left-1",
                          nav_button_next: "right-1",
                          table: "w-full border-collapse space-y-1",
                          head_row: "grid grid-cols-7 gap-1",
                          head_cell: "text-muted-foreground font-medium text-[0.8rem] flex items-center justify-center h-9",
                          row: "grid grid-cols-7 gap-1",
                          cell: "h-9 relative p-0 focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent flex items-center justify-center",
                          day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:rounded-sm",
                          day_today: "bg-accent/50 rounded-sm",
                          day_selected: "rounded-sm",
                          day_range_middle: "rounded-none",
                          day_hidden: "invisible",
                        }}
                        components={{
                          DayContent: ({ date: day }) => getDayContent(day, rentals)
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </div>

        <div className="space-y-3 sm:space-y-4">
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">Today&apos;s Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {loading ? (
                <div className="text-center text-muted-foreground">Loading schedule...</div>
              ) : todaySchedule.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {todaySchedule.map((rental) => (
                    <div key={rental.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 sm:pb-4 last:border-0 last:pb-0">
                      <div className="space-y-1">
                        <p className="font-medium text-sm sm:text-base">{rental.customerName}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {rental.equipment.map(e => e.name).join(', ')}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {new Date(rental.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <Badge variant={rental.status === 'Reserved' ? 'default' : 'secondary'} className="w-fit">
                        {rental.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground">No rentals scheduled for today</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">Upcoming Rentals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {loading ? (
                <div className="text-center text-muted-foreground">Loading upcoming rentals...</div>
              ) : getUpcomingRentals().length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {getUpcomingRentals().map((rental) => (
                    <div key={rental.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 sm:pb-4 last:border-0 last:pb-0">
                      <div className="space-y-1">
                        <p className="font-medium text-sm sm:text-base">{rental.customerName}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {rental.equipment.map(e => e.name).join(', ')}
                        </p>
                        <div className="flex flex-col gap-0.5">
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Start: {new Date(rental.startDate).toLocaleString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric',
                              hour: '2-digit', 
                              minute: '2-digit'
                            })}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            (Starts in {getDaysUntilStart(rental.startDate)} day{getDaysUntilStart(rental.startDate) !== 1 ? 's' : ''})
                          </p>
                        </div>
                      </div>
                      <Badge className="w-fit">Reserved</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground">No upcoming rentals</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">Incoming Returns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {loading ? (
                <div className="text-center text-muted-foreground">Loading returns...</div>
              ) : getIncomingReturns().length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {getIncomingReturns().map((rental) => (
                    <div key={rental.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 sm:pb-4 last:border-0 last:pb-0">
                      <div className="space-y-1">
                        <p className="font-medium text-sm sm:text-base">{rental.customerName}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {rental.equipment.map(e => e.name).join(', ')}
                        </p>
                        <div className="flex flex-col gap-0.5">
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Return: {new Date(rental.endDate).toLocaleString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric',
                              hour: '2-digit', 
                              minute: '2-digit'
                            })}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            (Due in {getDaysUntil(rental.endDate)} day{getDaysUntil(rental.endDate) !== 1 ? 's' : ''})
                          </p>
                        </div>
                      </div>
                      <Badge variant={rental.status === 'Active' ? 'secondary' : 'default'} className="w-fit">
                        {rental.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground">No incoming returns</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
