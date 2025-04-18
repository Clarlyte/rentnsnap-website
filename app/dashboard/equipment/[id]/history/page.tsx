"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import Link from "next/link"

interface RentalHistory {
  rental_id: string
  customer_name: string
  start_date: string
  end_date: string
  amount: number
  status: string
}

export default function EquipmentHistoryPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true)
  const [equipment, setEquipment] = useState<{ name: string }>({ name: "" })
  const [rentalHistory, setRentalHistory] = useState<RentalHistory[]>([])

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`/api/equipment/${params.id}`)
        const data = await response.json()
        
        if (!response.ok) throw new Error(data.error)
        
        setEquipment({ name: data.equipment.name })
        setRentalHistory(data.rental_history)
      } catch (error) {
        console.error('Error fetching rental history:', error)
        toast.error('Failed to load rental history')
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [params.id])

  if (loading) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Rental History" text="Loading rental history..." />
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-muted rounded w-1/4" />
                <div className="h-10 bg-muted rounded" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-10 bg-muted rounded" />
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <DashboardHeader 
        heading={`Rental History - ${equipment.name}`} 
        text="View all rentals for this equipment"
      >
        <Button variant="outline" asChild>
          <Link href={`/dashboard/equipment/${params.id}`}>
            Edit Equipment
          </Link>
        </Button>
      </DashboardHeader>

      <Card>
        <CardHeader>
          <CardTitle>All Rentals</CardTitle>
        </CardHeader>
        <CardContent>
          {rentalHistory.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              No rental history found
            </div>
          ) : (
            <div className="space-y-4">
              {rentalHistory.map((rental) => (
                <div key={rental.rental_id} className="border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{rental.customer_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(rental.start_date).toLocaleDateString()} - {new Date(rental.end_date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={rental.status === 'Reserved' ? 'default' : 'secondary'}>
                      {rental.status}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium">₱{rental.amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardShell>
  )
} 