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

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        const response = await fetch('/api/calendar')
        const data = await response.json()
        
        if (!response.ok) throw new Error(data.error)
        
        setTodaySchedule(data.todaySchedule)
        setUpcomingReturns(data.upcomingReturns)
        setRentalsByEquipment(data.rentalsByEquipment)
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
                    modifiers={{
                      booked: rentals.map(rental => new Date(rental.startDate))
                    }}
                    modifiersStyles={{
                      booked: { backgroundColor: 'var(--primary)', color: 'white' }
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
              <CardTitle>Upcoming Returns</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center text-muted-foreground">Loading returns...</div>
              ) : upcomingReturns.length > 0 ? (
                <div className="space-y-4">
                  {upcomingReturns.map((rental) => (
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
                      <Badge>Active</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground">No upcoming returns</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}

