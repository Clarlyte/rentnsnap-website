"use client"

import { useState, useEffect } from "react"
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

interface Rental {
  rental_id: string;
  customerName: string;
  equipment: string;
  startDate: string;
  endDate: string;
  status: string;
  amount: number;
}

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [formLink, setFormLink] = useState("")
  const [loading, setLoading] = useState(true)
  const [todaySchedule, setTodaySchedule] = useState<RentalEvent[]>([])
  const [upcomingReturns, setUpcomingReturns] = useState<RentalEvent[]>([])
  const [rentalsByEquipment, setRentalsByEquipment] = useState<RentalsByEquipment>({})
  const [colorMap, setColorMap] = useState<{ [key: string]: string }>({})
  const [events, setEvents] = useState<any[]>([])

  const getCustomerColor = (customerName: string) => {
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
  }

  const getRentalForDate = (date: Date, rentals: RentalEvent[]) => {
    return rentals.find(rental => 
      isWithinInterval(date, { 
        start: new Date(rental.startDate), 
        end: new Date(rental.endDate) 
      })
    )
  }

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const response = await fetch('/api/rentals')
        const data = await response.json()
        
        if (!response.ok) throw new Error(data.error)
        
        // Filter out cancelled rentals and map to calendar events
        const activeRentals = data.filter((rental: Rental) => rental.status !== 'Cancelled')
        const events = activeRentals.map((rental: Rental) => ({
          id: rental.rental_id,
          title: `${rental.customerName} - ${rental.equipment}`,
          start: new Date(rental.startDate),
          end: new Date(rental.endDate),
          status: rental.status,
          amount: rental.amount,
          customerName: rental.customerName,
          equipment: rental.equipment
        }))
        
        setEvents(events)
      } catch (error) {
        console.error('Error fetching rentals:', error)
        toast.error('Failed to load rentals')
      }
    }

    fetchRentals()
  }, [])

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        const response = await fetch('/api/calendar')
        const data = await response.json()
        
        if (!response.ok) throw new Error(data.error)
        
        const processedRentals = data.rentalsByEquipment
        Object.values(processedRentals).forEach((equipment: any) => {
          if (equipment.rentals && Array.isArray(equipment.rentals)) {
            equipment.rentals.forEach((rental: RentalEvent) => {
              rental.color = getCustomerColor(rental.customerName)
            })
          }
        })
        
        setTodaySchedule(data.todaySchedule)
        setUpcomingReturns(data.upcomingReturns)
        setRentalsByEquipment(processedRentals)
      } catch (error) {
        console.error('Error fetching calendar data:', error)
        toast.error('Failed to load calendar data')
      } finally {
        setLoading(false)
      }
    }

    fetchCalendarData()
  }, [])

  const getDayContent = (day: Date, rentals: RentalEvent[]) => {
    const rental = getRentalForDate(day, rentals)
    if (!rental) {
      return (
        <div className="h-full w-full flex items-center justify-center">
          {day.getDate()}
        </div>
      )
    }

    return (
      <div
        className="h-full w-full flex items-center justify-center text-white"
        style={{ backgroundColor: rental.color }}
      >
        {day.getDate()}
      </div>
    )
  }

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

  return (
    <DashboardShell>
      <DashboardHeader heading="Calendar" text="View and manage rental schedules">
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/dashboard/rentals/create-rental">
              <Plus className="mr-2 h-4 w-4" /> New Rental
            </Link>
          </Button>
          <Button variant="outline" onClick={copyFormLink} title="Copy rental form link">
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </DashboardHeader>

      <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
        <div className="grid gap-4 auto-rows-min grid-cols-1 lg:grid-cols-2">
          {loading ? (
            <Card className="lg:col-span-2">
              <CardContent className="py-8">
                <div className="text-center text-muted-foreground">Loading calendars...</div>
              </CardContent>
            </Card>
          ) : Object.entries(rentalsByEquipment).length === 0 ? (
            <Card className="lg:col-span-2">
              <CardContent className="py-8">
                <div className="text-center text-muted-foreground">No equipment found. Add some equipment to view calendars.</div>
              </CardContent>
            </Card>
          ) : (
            Object.entries(rentalsByEquipment).map(([equipmentId, { name, rentals }]) => (
              <Card key={equipmentId} className="w-full">
                <CardHeader>
                  <CardTitle>{name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar 
                    mode="single" 
                    selected={date} 
                    onSelect={setDate} 
                    className="rounded-md border w-full"
                    components={{
                      DayContent: ({ date: day }) => getDayContent(day, rentals)
                    }}
                  />
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center text-muted-foreground">Loading schedule...</div>
              ) : todaySchedule.length > 0 ? (
                <div className="space-y-4">
                  {todaySchedule.map((rental) => (
                    <div key={rental.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium">{rental.customerName}</p>
                        <p className="text-sm text-muted-foreground">
                          {rental.equipment.map(e => e.name).join(', ')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(rental.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <Badge variant={rental.status === 'Reserved' ? 'default' : 'secondary'}>
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
            <CardHeader>
              <CardTitle>Upcoming Rentals</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center text-muted-foreground">Loading upcoming rentals...</div>
              ) : getUpcomingRentals().length > 0 ? (
                <div className="space-y-4">
                  {getUpcomingRentals().map((rental) => (
                    <div key={rental.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium">{rental.customerName}</p>
                        <p className="text-sm text-muted-foreground">
                          {rental.equipment.map(e => e.name).join(', ')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Starts in {getDaysUntilStart(rental.startDate)} day{getDaysUntilStart(rental.startDate) !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <Badge>Reserved</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground">No upcoming rentals</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Incoming Returns</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center text-muted-foreground">Loading returns...</div>
              ) : getIncomingReturns().length > 0 ? (
                <div className="space-y-4">
                  {getIncomingReturns().map((rental) => (
                    <div key={rental.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium">{rental.customerName}</p>
                        <p className="text-sm text-muted-foreground">
                          {rental.equipment.map(e => e.name).join(', ')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Due in {getDaysUntil(rental.endDate)} day{getDaysUntil(rental.endDate) !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <Badge variant={rental.status === 'Active' ? 'secondary' : 'default'}>
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

