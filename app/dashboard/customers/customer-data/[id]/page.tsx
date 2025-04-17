"use client"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, Download, Edit, Printer, User } from "lucide-react"

export default function RentalPage({ params }: { params: { id: string } }) {
  return (
    <div className="container py-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/rentals">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Rental #{params.id}</h1>
        <Badge>Active</Badge>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="contract">Contract</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
                <CardDescription>Details about the renter</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium">John Doe</h3>
                    <p className="text-sm text-muted-foreground">customer@example.com</p>
                    <p className="text-sm text-muted-foreground">+63 912 345 6789</p>
                  </div>
                </div>
                <Separator />
                <div className="grid gap-2">
                  <div className="grid grid-cols-2">
                    <p className="text-sm font-medium">ID Type</p>
                    <p className="text-sm">Driver's License</p>
                  </div>
                  <div className="grid grid-cols-2">
                    <p className="text-sm font-medium">ID Number</p>
                    <p className="text-sm">N01-23-456789</p>
                  </div>
                  <div className="grid grid-cols-2">
                    <p className="text-sm font-medium">Address</p>
                    <p className="text-sm">123 Main St, Manila, Philippines</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/dashboard/rentals/customer-data/${params.id}`}>
                    <User className="mr-2 h-4 w-4" /> View Customer Profile
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rental Details</CardTitle>
                <CardDescription>Information about this rental</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <div className="grid grid-cols-2">
                    <p className="text-sm font-medium">Rental ID</p>
                    <p className="text-sm">#{params.id}</p>
                  </div>
                  <div className="grid grid-cols-2">
                    <p className="text-sm font-medium">Status</p>
                    <div>
                      <Badge>Active</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2">
                    <p className="text-sm font-medium">Created On</p>
                    <p className="text-sm">March 15, 2023</p>
                  </div>
                </div>
                <Separator />
                <div className="grid gap-2">
                  <div className="grid grid-cols-2">
                    <p className="text-sm font-medium">Start Date</p>
                    <p className="text-sm">March 15, 2023 - 10:00 AM</p>
                  </div>
                  <div className="grid grid-cols-2">
                    <p className="text-sm font-medium">End Date</p>
                    <p className="text-sm">March 18, 2023 - 6:00 PM</p>
                  </div>
                  <div className="grid grid-cols-2">
                    <p className="text-sm font-medium">Duration</p>
                    <p className="text-sm">3 days, 8 hours</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Calendar className="mr-2 h-4 w-4" /> Modify Schedule
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Equipment</CardTitle>
              <CardDescription>Items included in this rental</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
                    <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center">
                      <Image
                        src="/placeholder.svg?height=64&width=64"
                        width={64}
                        height={64}
                        alt="Equipment"
                        className="rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">
                        {i === 1 ? "Canon EOS R5" : i === 2 ? "Canon RF 24-70mm f/2.8L" : "Canon RF 70-200mm f/2.8L"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {i === 1 ? "Professional Mirrorless Camera" : "Professional Zoom Lens"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₱{i === 1 ? "2,500" : i === 2 ? "1,200" : "1,500"}/day</p>
                      <p className="text-sm text-muted-foreground">Serial: CN{i}2345678</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Items: 3</p>
              </div>
              <div className="text-right">
                <p className="font-medium">Total: ₱15,600</p>
                <p className="text-sm text-muted-foreground">For 3 days</p>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="contract" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Rental Agreement</CardTitle>
                  <CardDescription>Contract details and signatures</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" /> Download
                  </Button>
                  <Button variant="outline" size="sm">
                    <Printer className="mr-2 h-4 w-4" /> Print
                  </Button>
                  <Button size="sm">
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-6 space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold">CAMERA EQUIPMENT RENTAL AGREEMENT</h2>
                  <p className="text-muted-foreground">Contract #RNS-{params.id}</p>
                </div>

                <div className="space-y-4">
                  <p>
                    This Equipment Rental Agreement ("Agreement") is made and entered into as of March 15, 2023, by and
                    between:
                  </p>

                  <div className="space-y-2">
                    <p>
                      <strong>LESSOR:</strong> Rent n' Snap, with principal place of business at 123 Camera St, Manila,
                      Philippines ("Rental Company")
                    </p>
                    <p>
                      <strong>LESSEE:</strong> John Doe, residing at 123 Main St, Manila, Philippines ("Renter")
                    </p>
                  </div>

                  <p>
                    The Rental Company agrees to rent to Renter, and Renter agrees to rent from Rental Company, the
                    equipment listed in the attached Equipment List ("Equipment") subject to the terms and conditions of
                    this Agreement.
                  </p>

                  <div className="space-y-2">
                    <p>
                      <strong>1. RENTAL PERIOD</strong>
                    </p>
                    <p>The rental period begins on March 15, 2023 at 10:00 AM and ends on March 18, 2023 at 6:00 PM.</p>
                  </div>

                  <div className="space-y-2">
                    <p>
                      <strong>2. RENTAL FEES</strong>
                    </p>
                    <p>
                      Renter agrees to pay the total sum of ₱15,600 for the rental of the Equipment for the duration
                      specified.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p>
                      <strong>3. SECURITY DEPOSIT</strong>
                    </p>
                    <p>
                      A security deposit of ₱10,000 will be collected prior to the release of the Equipment. The deposit
                      will be refunded upon return of all Equipment in good working condition, subject to any deductions
                      for damage, loss, or late fees.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p>
                      <strong>4. EQUIPMENT CONDITION</strong>
                    </p>
                    <p>
                      Renter acknowledges that Renter has examined the Equipment and that it is in good condition except
                      as otherwise specified. Renter agrees to return the Equipment in the same condition, subject to
                      reasonable wear and tear.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p>
                      <strong>5. RENTER'S RESPONSIBILITY</strong>
                    </p>
                    <p>
                      Renter assumes full responsibility for the Equipment during the rental period. Renter shall be
                      responsible for any damage to or loss of the Equipment, including theft, regardless of cause or
                      fault.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 pt-8">
                  <div className="space-y-4">
                    <p className="font-medium">RENTAL COMPANY:</p>
                    <div className="h-20 border-b border-dashed flex items-end justify-center">
                      <p className="text-sm text-muted-foreground italic">Signature on file</p>
                    </div>
                    <p>Rent n' Snap Representative</p>
                  </div>
                  <div className="space-y-4">
                    <p className="font-medium">RENTER:</p>
                    <div className="h-20 border-b border-dashed flex items-end justify-center">
                      <p className="text-sm text-muted-foreground italic">Digital signature collected</p>
                    </div>
                    <p>John Doe</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>ID Verification</CardTitle>
                <CardDescription>Customer identification document</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="border rounded-lg p-4 w-full max-w-md">
                  <Image
                    src="/placeholder.svg?height=300&width=450&text=ID+Document"
                    width={450}
                    height={300}
                    alt="ID Document"
                    className="rounded-lg border"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">Driver's License verified on March 15, 2023</p>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Digital Signature</CardTitle>
                <CardDescription>Customer's electronic signature</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="border rounded-lg p-4 w-full max-w-md">
                  <Image
                    src="/placeholder.svg?height=200&width=400&text=Digital+Signature"
                    width={400}
                    height={200}
                    alt="Digital Signature"
                    className="rounded-lg border"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">Electronically signed on March 15, 2023 at 9:45 AM</p>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rental History</CardTitle>
              <CardDescription>Timeline of events for this rental</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {[
                  {
                    date: "March 15, 2023 - 9:30 AM",
                    event: "Rental created",
                    description: "Customer initiated rental request",
                  },
                  {
                    date: "March 15, 2023 - 9:45 AM",
                    event: "ID verified",
                    description: "Customer ID was verified and approved",
                  },
                  {
                    date: "March 15, 2023 - 9:50 AM",
                    event: "Contract signed",
                    description: "Customer signed the rental agreement",
                  },
                  {
                    date: "March 15, 2023 - 10:00 AM",
                    event: "Equipment picked up",
                    description: "Customer collected the equipment",
                  },
                  {
                    date: "March 16, 2023 - 2:15 PM",
                    event: "Schedule modification requested",
                    description: "Customer requested to extend rental by 1 day",
                  },
                  {
                    date: "March 16, 2023 - 2:30 PM",
                    event: "Schedule modification approved",
                    description: "Admin approved rental extension",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">
                        {i + 1}
                      </div>
                      {i < 5 && <div className="w-0.5 h-full bg-border mt-2"></div>}
                    </div>
                    <div>
                      <p className="font-medium">{item.event}</p>
                      <p className="text-sm text-muted-foreground">{item.date}</p>
                      <p className="text-sm mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

