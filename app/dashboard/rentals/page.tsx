"use client"

import { useState, useEffect } from "react"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Plus, Search, Copy, User } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

export default function RentalsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [formLink, setFormLink] = useState("")
  const [rentals, setRentals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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
              </TableRow>
            </TableHeader>
            <TableBody>
              {rentals.map((rental) => (
                <TableRow key={rental.id}>
                  <TableCell>
                    <div className="relative h-12 w-12 rounded-full overflow-hidden bg-muted">
                      {rental.selfieUrl ? (
                        <>
                          <Image
                            src={rental.selfieUrl}
                            alt={`${rental.customerName}'s ID verification`}
                            width={48}
                            height={48}
                            className="h-full w-full object-cover"
                            onError={(e) => handleImageError(e, rental.customerName)}
                            unoptimized
                            priority
                          />
                          <div className="fallback-icon absolute inset-0 bg-muted items-center justify-center" style={{ display: 'none' }}>
                            <User className="h-6 w-6 text-muted-foreground" />
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 bg-muted flex items-center justify-center">
                          <User className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{rental.customerName}</TableCell>
                  <TableCell>{rental.equipment}</TableCell>
                  <TableCell>{rental.startDate}</TableCell>
                  <TableCell>{rental.endDate}</TableCell>
                  <TableCell>
                    <Badge variant={rental.status === "Active" ? "default" : "secondary"}>{rental.status}</Badge>
                  </TableCell>
                  <TableCell>₱{(rental.amount).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardShell>
  )
}

