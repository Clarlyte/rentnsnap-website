"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Plus, Search } from "lucide-react"

export default function RentalsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <DashboardShell>
      <DashboardHeader heading="Rentals" text="Manage your rental records">
        <Link href="/create-rental">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add New Rental
          </Button>
        </Link>
      </DashboardHeader>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search rentals..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rental ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Equipment</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                <TableCell>
                  <Link href={`/rental/${i}`} className="text-blue-500 hover:underline">
                    #RNT{String(i).padStart(4, "0")}
                  </Link>
                </TableCell>
                <TableCell>Customer {i}</TableCell>
                <TableCell>Canon EOS R5 + 24-70mm Lens</TableCell>
                <TableCell>2024-03-{i}</TableCell>
                <TableCell>2024-03-{i + 3}</TableCell>
                <TableCell>
                  <Badge variant={i % 2 === 0 ? "default" : "secondary"}>{i % 2 === 0 ? "Active" : "Pending"}</Badge>
                </TableCell>
                <TableCell>₱{(1500 * i).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardShell>
  )
}

