"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Camera, ChevronRight, Clock, Download, FileText, Filter, Link as LucideLink, Plus, Search, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { StatCard, CashflowChart, ExpenseCategories } from "@/components/dashboard/dashboard-components"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function DashboardPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedProperty, setSelectedProperty] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // Simulated rental shop data
  const rentalData = {
    rentReceived: 6876.00,
    paymentsInProgress: 2500.00,
    upcomingPayments: 758.82,
    rentOverdue: 1200.00,
    inProgressCount: 2,
    upcomingCount: 2,
    overdueCount: 5,
  }

  // Simulated expense categories for camera rental business
  const expenseCategories = [
    { name: "EQUIPMENT MAINTENANCE", amount: 2500, color: "#2563eb" },
    { name: "INSURANCE", amount: 1800, color: "#60a5fa" },
    { name: "STAFF SALARY", amount: 3500, color: "#93c5fd" },
    { name: "MARKETING", amount: 1200, color: "#bfdbfe" },
    { name: "RENT & UTILITIES", amount: 2000, color: "#dbeafe" },
  ]

  return (
    <DashboardShell>
      <div className="flex flex-col space-y-6 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Hello Jane,</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/dashboard/rentals/create-rental">
              <Plus className="mr-2 h-4 w-4" />
              New Rental
            </Link>
          </Button>
          <Select value={selectedProperty} onValueChange={setSelectedProperty}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select property" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="main">Main Store</SelectItem>
              <SelectItem value="downtown">Downtown Branch</SelectItem>
              <SelectItem value="mall">Mall Kiosk</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="cameras">Cameras</SelectItem>
              <SelectItem value="lenses">Lenses</SelectItem>
              <SelectItem value="accessories">Accessories</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-8">
        {/* Top Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Rent received"
            value={rentalData.rentReceived}
            subtitle="Due this month"
            className="hover:shadow-md transition-shadow"
          />
          <StatCard
            title="Payments in progress"
            value={rentalData.paymentsInProgress}
            count={rentalData.inProgressCount}
            status="in progress"
            className="hover:shadow-md transition-shadow"
          />
          <StatCard
            title="Upcoming payments"
            value={rentalData.upcomingPayments}
            count={rentalData.upcomingCount}
            subtitle="this month"
            className="hover:shadow-md transition-shadow"
          />
          <StatCard
            title="Rent overdue"
            value={rentalData.rentOverdue}
            count={rentalData.overdueCount}
            status="overdue"
            className="hover:shadow-md transition-shadow"
          />
        </div>

        {/* Cashflow Chart */}
        <div className="overflow-hidden rounded-lg border bg-card p-6">
          <CashflowChart
            data={{
              income: 20500,
              expenses: 7830,
              net: 12670,
              dateRange: "1 Jan 2020 - 30 Jan 2022"
            }}
          />
        </div>

        {/* Bottom Section */}
        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-[2fr_1fr]">
          {/* Expense Categories */}
          <div className="rounded-lg border bg-card p-6">
            <ExpenseCategories categories={expenseCategories} />
          </div>

          {/* Right Side Cards */}
          <div className="space-y-6">
            {/* Upgrade Card */}
            <div className="rounded-lg bg-blue-600 p-8 text-white hover:bg-blue-700 transition-colors cursor-pointer">
              <div className="mb-6 text-center">
                <div className="mb-4 text-4xl">⚡</div>
                <h3 className="text-xl font-bold">UPGRADE TO PRO</h3>
              </div>
              <p className="mb-6 text-center text-sm text-blue-100">
                Get access to more units and additional accounting tools like bank feeds to make tax time a breeze!
              </p>
              <Button variant="secondary" className="w-full bg-white text-blue-600 hover:bg-blue-50">
                Upgrade now
              </Button>
            </div>

            {/* Online Rent Collection */}
            <div className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow">
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="font-semibold">Online rent collection</h3>
                <Badge variant="outline" className="w-fit bg-emerald-50 text-emerald-700 border-emerald-200">
                  ENABLED
                </Badge>
              </div>
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
                  <div>
                    <div className="text-sm text-muted-foreground">2 SCHEDULED</div>
                    <div className="text-lg font-semibold">₱870</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">2 PROCESSING</div>
                    <div className="text-lg font-semibold">₱2,300</div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 flex-shrink-0" />
                  <span className="flex-grow">You have enabled online payments for 2/3 of your equipment.</span>
                  <Button variant="link" className="h-auto p-0 text-blue-600 hover:text-blue-700">
                    See all
                  </Button>
                </div>
              </div>
            </div>

            {/* Equipment Status */}
            <div className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow">
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="font-semibold">Equipment Status</h3>
                <Button variant="link" className="h-auto p-0 text-blue-600 hover:text-blue-700 w-fit">
                  View all
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Available</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    45 items
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">In Use</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    23 items
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Maintenance</span>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    5 items
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}

