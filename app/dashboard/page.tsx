"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Camera, ChevronRight, Clock, Download, FileText, Filter, Link as LucideLink, Plus, Search, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { StatCard } from "@/components/dashboard/dashboard-components"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface RentalData {
  rental_id: string
  customerName: string
  equipment: string
  startDate: string
  endDate: string
  status: string
  amount: number
}

interface EquipmentData {
  equipment_id: string
  name: string
  type: string
  status: string
}

export default function DashboardPage() {
  const [rentals, setRentals] = useState<RentalData[]>([])
  const [equipment, setEquipment] = useState<EquipmentData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // Fetch rentals and equipment data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        
        // Fetch rentals
        const rentalsResponse = await fetch('/api/rentals')
        const rentalsData = await rentalsResponse.json()
        if (!rentalsResponse.ok) throw new Error('Failed to fetch rentals')
        setRentals(rentalsData)

        // Fetch equipment
        const equipmentResponse = await fetch('/api/equipment')
        const equipmentData = await equipmentResponse.json()
        if (!equipmentResponse.ok) throw new Error('Failed to fetch equipment')
        setEquipment(equipmentData)

      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Calculate dashboard metrics
  const calculateMetrics = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const activeRentals = rentals.filter(rental => rental.status === 'Active')
    const reservedRentals = rentals.filter(rental => rental.status === 'Reserved')
    const completedRentals = rentals.filter(rental => rental.status === 'Completed')

    const totalRevenue = completedRentals.reduce((sum, rental) => sum + rental.amount, 0)
    const activeRevenue = activeRentals.reduce((sum, rental) => sum + rental.amount, 0)
    const upcomingRevenue = reservedRentals.reduce((sum, rental) => sum + rental.amount, 0)

    const availableEquipment = equipment.filter(eq => eq.status === 'Available').length
    const inUseEquipment = equipment.filter(eq => eq.status === 'In Use').length
    const maintenanceEquipment = equipment.filter(eq => eq.status === 'Maintenance').length

    return {
      totalRevenue,
      activeRevenue,
      upcomingRevenue,
      activeCount: activeRentals.length,
      reservedCount: reservedRentals.length,
      availableEquipment,
      inUseEquipment,
      maintenanceEquipment
    }
  }

  const metrics = calculateMetrics()

  // Get upcoming returns (next 7 days)
  const getUpcomingReturns = () => {
    const today = new Date()
    const nextWeek = new Date(today)
    nextWeek.setDate(today.getDate() + 7)

    return rentals
      .filter(rental => {
        const endDate = new Date(rental.endDate)
        return rental.status === 'Active' && endDate >= today && endDate <= nextWeek
      })
      .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
  }

  return (
    <DashboardShell>
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl sm:text-2xl font-semibold">Dashboard Overview</h1>
        <div className="w-full sm:w-auto">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Equipment Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {Array.from(new Set(equipment.map(eq => eq.type))).map(type => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-6">
        {/* Top Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Revenue"
            value={metrics.totalRevenue}
            subtitle="From completed rentals"
            className="hover:shadow-md transition-shadow"
          />
          <StatCard
            title="Active Rentals"
            value={metrics.activeRevenue}
            count={metrics.activeCount}
            status="in progress"
            className="hover:shadow-md transition-shadow"
          />
          <StatCard
            title="Reserved Rentals"
            value={metrics.upcomingRevenue}
            count={metrics.reservedCount}
            subtitle="upcoming"
            className="hover:shadow-md transition-shadow"
          />
          <StatCard
            title="Available Equipment"
            value={metrics.availableEquipment}
            count={equipment.length}
            subtitle="total equipment"
            className="hover:shadow-md transition-shadow"
          />
        </div>

        {/* Bottom Section */}
        <div className="grid gap-6 lg:grid-cols-[1fr_300px] xl:grid-cols-[2fr_1fr]">
          {/* Recent Activity */}
          <div className="rounded-lg border bg-card p-4 sm:p-6">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="font-semibold text-lg">Recent Activity</h3>
              <Button variant="link" asChild className="h-auto p-0">
                <Link href="/dashboard/rentals">View all rentals</Link>
              </Button>
            </div>
            <div className="space-y-4">
              {rentals.slice(0, 5).map(rental => (
                <div key={rental.rental_id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 last:border-0 gap-2">
                  <div className="min-w-0 flex-1 pr-4">
                    <p className="font-medium line-clamp-1">{rental.customerName}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">{rental.equipment}</p>
                  </div>
                  <Badge variant={
                    rental.status === 'Active' ? 'default' :
                    rental.status === 'Completed' ? 'secondary' :
                    'outline'
                  }>
                    {rental.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side Cards */}
          <div className="space-y-6">
            {/* Equipment Status */}
            <div className="rounded-lg border bg-card p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="font-semibold text-lg">Equipment Status</h3>
                <Button variant="link" asChild className="h-auto p-0">
                  <Link href="/dashboard/equipment">View all</Link>
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Available</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {metrics.availableEquipment} items
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">In Use</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {metrics.inUseEquipment} items
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Maintenance</span>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    {metrics.maintenanceEquipment} items
                  </Badge>
                </div>
              </div>
            </div>

            {/* Upcoming Returns */}
            <div className="rounded-lg border bg-card p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="font-semibold text-lg">Upcoming Returns</h3>
                <Button variant="link" asChild className="h-auto p-0">
                  <Link href="/dashboard/calendar">View calendar</Link>
                </Button>
              </div>
              <div className="space-y-4">
                {getUpcomingReturns().map(rental => (
                  <div key={rental.rental_id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="min-w-0 flex-1 pr-4">
                      <p className="text-sm font-medium line-clamp-1">{rental.customerName}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {new Date(rental.endDate).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      Due soon
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}

