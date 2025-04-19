"use client"

import { useState, useEffect } from "react"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Search, User, MoreVertical, FileText } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Customer {
  customer_id: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  address: string | null
  created_at: string
  status: 'Active' | 'Inactive'
  total_rentals: number
}

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7))
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('/api/customers')
        const data = await response.json()
        
        if (!response.ok) throw new Error(data.error)
        
        setCustomers(data)
      } catch (error) {
        console.error('Error fetching customers:', error)
        toast.error('Failed to load customers')
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  // Filter customers based on search query, month, and status
  const filteredCustomers = customers.filter(customer => {
    const searchTerm = searchQuery.toLowerCase()
    const customerMonth = new Date(customer.created_at).toISOString().slice(0, 7)
    const matchesSearch = 
      customer.first_name.toLowerCase().includes(searchTerm) ||
      customer.last_name.toLowerCase().includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm) ||
      (customer.phone && customer.phone.toLowerCase().includes(searchTerm))
    
    const matchesMonth = selectedMonth === 'all' || customerMonth === selectedMonth
    const matchesStatus = selectedStatus === 'all' || customer.status === selectedStatus

    return matchesSearch && matchesMonth && matchesStatus
  })

  return (
    <DashboardShell>
      <DashboardHeader heading="Customers" text="Manage your customer database">
        <Button asChild className="w-full sm:w-auto">
          <Link href="/dashboard/customers/customer-data/new">
            <Plus className="mr-2 h-4 w-4" /> Add Customer
          </Link>
        </Button>
      </DashboardHeader>

      <div className="space-y-6">
        {/* Search and Filter Section */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 w-full">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search customers..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:flex gap-2 w-full sm:w-auto">
            <Select
              value={selectedMonth}
              onValueChange={setSelectedMonth}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                {Array.from({ length: 12 }, (_, i) => {
                  const date = new Date()
                  date.setMonth(date.getMonth() - i)
                  const value = date.toISOString().slice(0, 7)
                  const label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                  return <SelectItem key={value} value={value}>{label}</SelectItem>
                })}
              </SelectContent>
            </Select>
            <Select
              value={selectedStatus}
              onValueChange={setSelectedStatus}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-lg border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[150px]">
                  <div className="flex items-center">Customer</div>
                </TableHead>
                <TableHead className="min-w-[120px]">
                  <div className="flex items-center">Email</div>
                </TableHead>
                <TableHead className="min-w-[120px]">
                  <div className="flex items-center">Phone</div>
                </TableHead>
                <TableHead className="min-w-[120px]">
                  <div className="flex items-center">Address</div>
                </TableHead>
                <TableHead className="min-w-[100px]">
                  <div className="flex items-center">Member Since</div>
                </TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                      <p className="text-muted-foreground">Loading customers...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    <div className="flex flex-col items-center justify-center py-16">
                      <div className="bg-muted rounded-full p-6 mb-6">
                        <User className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold mb-3">
                        {customers.length === 0 
                          ? "No customers yet"
                          : "No customers match your search"}
                      </h3>
                      <p className="text-muted-foreground mb-6 max-w-md text-center">
                        {customers.length === 0 
                          ? "Start by adding your first customer to your database."
                          : "Try adjusting your search criteria."}
                      </p>
                      {customers.length === 0 && (
                        <Button asChild>
                          <Link href="/dashboard/customers/customer-data/new">
                            <Plus className="mr-2 h-4 w-4" /> Add Customer
                          </Link>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.customer_id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="relative h-8 w-8 rounded-full overflow-hidden">
                          <Avatar>
                            <AvatarFallback className="text-xs">
                              {customer.first_name[0]}{customer.last_name[0]}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{customer.first_name} {customer.last_name}</p>
                          <p className="text-xs text-muted-foreground truncate sm:hidden">
                            {customer.email}
                          </p>
                          <p className="text-xs text-muted-foreground truncate sm:hidden">
                            {customer.phone || '-'}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="truncate max-w-[120px]">{customer.email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="truncate max-w-[120px]">{customer.phone || '-'}</div>
                    </TableCell>
                    <TableCell>
                      <div className="truncate max-w-[120px]">{customer.address || '-'}</div>
                    </TableCell>
                    <TableCell>
                      {new Date(customer.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/customers/customer-data/${customer.customer_id}`}>
                              <FileText className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardShell>
  )
}

