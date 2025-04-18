"use client"

import { useState, useEffect } from "react"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Plus, Search, Copy, User, MoreVertical, Ban, FileText, CalendarIcon } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function RentalsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [formLink, setFormLink] = useState("")
  const [rentals, setRentals] = useState<any[]>([])
  const [filteredRentals, setFilteredRentals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [cancelDialog, setCancelDialog] = useState(false)
  const [selectedRental, setSelectedRental] = useState<any>(null)
  const [voidAmount, setVoidAmount] = useState("")
  const [selectedMonth, setSelectedMonth] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedEquipmentType, setSelectedEquipmentType] = useState("all")
  const [equipmentTypes, setEquipmentTypes] = useState<string[]>([])

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

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const response = await fetch('/api/rentals')
        const data = await response.json()
        
        if (!response.ok) throw new Error(data.error)
        
        console.log('Received rentals data:', data)
        setRentals(data)
      } catch (error) {
        console.error('Error fetching rentals:', error)
        toast.error('Failed to load rentals')
      } finally {
        setLoading(false)
      }
    }

    fetchRentals()
  }, [])

  useEffect(() => {
    const fetchEquipmentTypes = async () => {
      try {
        const response = await fetch('/api/equipment')
        const data = await response.json()
        if (!response.ok) throw new Error(data.error)
        
        const types = Array.from(new Set(data.map((item: any) => item.type))) as string[]
        setEquipmentTypes(types)
      } catch (error) {
        console.error('Error fetching equipment types:', error)
      }
    }

    fetchEquipmentTypes()
  }, [])

  // Filter rentals based on search and filters
  useEffect(() => {
    let filtered = [...rentals]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(rental => 
        rental.customerName.toLowerCase().includes(query) ||
        rental.equipment.toLowerCase().includes(query) ||
        rental.rental_id.toLowerCase().includes(query)
      )
    }

    // Month filter
    if (selectedMonth !== 'all') {
      filtered = filtered.filter(rental => {
        const rentalMonth = new Date(rental.startDate).toISOString().slice(0, 7)
        return rentalMonth === selectedMonth
      })
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(rental => rental.status === selectedStatus)
    }

    // Equipment type filter
    if (selectedEquipmentType !== 'all') {
      filtered = filtered.filter(rental => 
        rental.equipment.toLowerCase().includes(selectedEquipmentType.toLowerCase())
      )
    }

    setFilteredRentals(filtered)
  }, [searchQuery, selectedMonth, selectedStatus, selectedEquipmentType, rentals])

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, customerName: string) => {
    console.error(`Error loading image for ${customerName}:`, e)
    const imgElement = e.target as HTMLImageElement
    imgElement.style.display = 'none'
    const fallbackDiv = imgElement.nextElementSibling as HTMLElement
    if (fallbackDiv?.classList.contains('fallback-icon')) {
      fallbackDiv.style.display = 'flex'
    }
  }

  const handleCancelRental = async () => {
    if (!selectedRental?.rental_id || voidAmount === "") {
      toast.error('Please enter a void amount')
      return
    }

    const numericVoidAmount = parseFloat(voidAmount)
    if (isNaN(numericVoidAmount) || numericVoidAmount < 0) {
      toast.error('Please enter a valid void amount')
      return
    }

    try {
      console.log('Selected rental:', selectedRental)
      const response = await fetch(`/api/rentals/${selectedRental.rental_id}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'Cancelled',
          void_amount: numericVoidAmount,
          cancellation_reason: 'Customer requested cancellation',
          cancelled_at: new Date().toISOString()
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel rental')
      }
      
      // Update the rental in the local state
      setRentals(prev => prev.map(rental => 
        rental.rental_id === selectedRental.rental_id 
          ? { 
              ...rental, 
              status: 'Cancelled', 
              voidAmount: numericVoidAmount,
              cancelled_at: new Date().toISOString()
            }
          : rental
      ))

      toast.success('Rental cancelled successfully')
      setCancelDialog(false)
      setSelectedRental(null)
      setVoidAmount("")
    } catch (error) {
      console.error('Error cancelling rental:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to cancel rental')
    }
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Rentals" text="Manage your rental bookings" />

      <div className="space-y-6">
        {/* Form Link Section */}
        <div className="bg-muted p-8 rounded-lg">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-1 w-full">
              <Input
                value={formLink || "Click the copy icon to generate a rental form link"}
                readOnly
                className="w-full bg-background"
              />
            </div>
            <Button 
              variant="outline" 
              onClick={copyFormLink} 
              className="min-w-[120px] h-10"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy Link
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Share this link with customers to let them fill in their rental information
          </p>
        </div>

        {/* Search and Filters Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search rentals..."
                  className="pl-9 h-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-4 flex-col sm:flex-row sm:w-auto w-full">
              <Select
                value={selectedMonth}
                onValueChange={setSelectedMonth}
              >
                <SelectTrigger className="w-full sm:w-[180px] h-12">
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
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full sm:w-[180px] h-12">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Reserved">Reserved</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedEquipmentType} onValueChange={setSelectedEquipmentType}>
                <SelectTrigger className="w-full sm:w-[180px] h-12">
                  <SelectValue placeholder="Equipment Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {equipmentTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="rounded-lg border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden sm:table-cell">ID Verification</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Equipment</TableHead>
                <TableHead className="hidden md:table-cell">Start Date</TableHead>
                <TableHead className="hidden md:table-cell">End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Amount</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                      <p className="text-muted-foreground">Loading rentals...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredRentals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    <div className="flex flex-col items-center justify-center py-16">
                      <div className="bg-muted rounded-full p-6 mb-6">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold mb-3">No rentals yet</h3>
                      <p className="text-muted-foreground mb-6 max-w-md text-center">
                        Start by creating your first rental or share the rental form link with customers.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button asChild>
                          <Link href="/dashboard/rentals/create-rental">
                            <Plus className="mr-2 h-4 w-4" /> Create Rental
                          </Link>
                        </Button>
                        <Button variant="outline" onClick={copyFormLink}>
                          <Copy className="mr-2 h-4 w-4" /> Copy Form Link
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredRentals.map((rental) => (
                  <TableRow key={rental.rental_id}>
                    <TableCell className="hidden sm:table-cell">
                      <div className="relative h-12 w-12 rounded-full overflow-hidden bg-muted">
                        {rental.selfieUrl ? (
                          <>
                            <Image
                              key={`${rental.rental_id}-image`}
                              src={rental.selfieUrl}
                              alt={`${rental.customerName}'s ID verification`}
                              width={48}
                              height={48}
                              className="h-full w-full object-cover"
                              onError={(e) => handleImageError(e, rental.customerName)}
                              unoptimized
                              priority
                            />
                            <div 
                              key={`${rental.rental_id}-fallback`}
                              className="fallback-icon absolute inset-0 bg-muted items-center justify-center" 
                              style={{ display: 'none' }}
                            >
                              <User className="h-6 w-6 text-muted-foreground" />
                            </div>
                          </>
                        ) : (
                          <div 
                            key={`${rental.rental_id}-default`}
                            className="absolute inset-0 bg-muted flex items-center justify-center"
                          >
                            <User className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="sm:hidden">
                          <div className="relative h-8 w-8 rounded-full overflow-hidden bg-muted">
                            {rental.selfieUrl ? (
                              <Image
                                src={rental.selfieUrl}
                                alt={`${rental.customerName}'s ID verification`}
                                width={32}
                                height={32}
                                className="h-full w-full object-cover"
                                onError={(e) => handleImageError(e, rental.customerName)}
                                unoptimized
                              />
                            ) : (
                              <div className="absolute inset-0 bg-muted flex items-center justify-center">
                                <User className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">{rental.customerName}</p>
                          <p className="text-sm text-muted-foreground sm:hidden">
                            {formatDateTime(rental.startDate)} - {formatDateTime(rental.endDate)}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{rental.equipment}</TableCell>
                    <TableCell className="hidden md:table-cell">{formatDateTime(rental.startDate)}</TableCell>
                    <TableCell className="hidden md:table-cell">{formatDateTime(rental.endDate)}</TableCell>
                    <TableCell>
                      <Badge variant={rental.status === 'Active' ? 'default' : rental.status === 'Completed' ? 'secondary' : 'outline'}>
                        {rental.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">₱{rental.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/rentals/${rental.rental_id}`}>
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          {rental.status === 'Active' && (
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedRental(rental)
                                setCancelDialog(true)
                              }}
                            >
                              Cancel Rental
                            </DropdownMenuItem>
                          )}
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

      <Dialog open={cancelDialog} onOpenChange={setCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Rental</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this rental? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="voidAmount">Void Amount</Label>
              <Input
                id="voidAmount"
                type="number"
                placeholder="Enter void amount"
                value={voidAmount}
                onChange={(e) => setVoidAmount(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCancelRental}>
              Confirm Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  )
}

