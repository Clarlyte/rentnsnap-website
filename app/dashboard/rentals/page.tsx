"use client"

import { useState, useEffect } from "react"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Plus, Search, Copy, User, MoreVertical, Ban } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
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

export default function RentalsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [formLink, setFormLink] = useState("")
  const [rentals, setRentals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [cancelDialog, setCancelDialog] = useState(false)
  const [selectedRental, setSelectedRental] = useState<any>(null)
  const [voidAmount, setVoidAmount] = useState("")

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
      <DashboardHeader heading="Rentals" text="Manage your rental bookings">
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

      <div className="space-y-4">
        {/* Search Section */}
        <div className="flex items-center gap-4">
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

        {/* Form Link Section */}
        <div className="bg-muted p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Input
              value={formLink || "Click the copy icon to generate a rental form link"}
              readOnly
              className="flex-1"
            />
            <Button variant="outline" size="icon" onClick={copyFormLink}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Share this link with customers to let them fill in their rental information
          </p>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Verification</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Equipment</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rentals.map((rental) => (
                <TableRow key={rental.rental_id}>
                  <TableCell>
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
                  <TableCell>{rental.customerName}</TableCell>
                  <TableCell>{rental.equipment}</TableCell>
                  <TableCell>{formatDateTime(rental.startDate)}</TableCell>
                  <TableCell>{formatDateTime(rental.endDate)}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        rental.status === "Active" ? "default" : 
                        rental.status === "Cancelled" ? "destructive" : 
                        "secondary"
                      }
                    >
                      {rental.status}
                    </Badge>
                    {rental.status === 'Cancelled' && rental.voidAmount && (
                      <div className="text-sm text-muted-foreground mt-1">
                        Void: ₱{rental.voidAmount.toLocaleString()}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>₱{(rental.amount).toLocaleString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {rental.status !== 'Cancelled' && (
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              console.log('Selected rental for cancellation:', rental)
                              setSelectedRental(rental)
                              setCancelDialog(true)
                            }}
                          >
                            <Ban className="mr-2 h-4 w-4" />
                            Cancel Rental
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
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
          <div className="py-4">
            <label className="text-sm font-medium">
              Void Amount
              <Input
                type="text"
                placeholder="Enter void amount"
                value={voidAmount}
                onChange={(e) => {
                  // Only allow numbers
                  const value = e.target.value.replace(/[^0-9]/g, '')
                  setVoidAmount(value)
                }}
                className="mt-1"
              />
            </label>
            {selectedRental && (
              <div className="mt-2 text-sm text-muted-foreground">
                Rental ID: {selectedRental.rental_id}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setCancelDialog(false)
              setSelectedRental(null)
              setVoidAmount("")
            }}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleCancelRental}
              disabled={!selectedRental?.rental_id || voidAmount === "" || isNaN(parseFloat(voidAmount)) || parseFloat(voidAmount) < 0}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              onMouseEnter={() => {
                console.log('Button state:', {
                  selectedRentalId: selectedRental?.rental_id,
                  voidAmount,
                  isVoidAmountEmpty: voidAmount === "",
                  isVoidAmountNaN: isNaN(parseFloat(voidAmount)),
                  isVoidAmountNegative: parseFloat(voidAmount) < 0,
                  isDisabled: !selectedRental?.rental_id || voidAmount === "" || isNaN(parseFloat(voidAmount)) || parseFloat(voidAmount) < 0
                })
              }}
            >
              Confirm Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  )
}

