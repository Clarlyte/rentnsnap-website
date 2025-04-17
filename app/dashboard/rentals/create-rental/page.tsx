"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ArrowRight, CalendarIcon, Check, ChevronRight, Search } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function CreateRentalPage() {
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [step, setStep] = useState(1)

  return (
    <div className="container py-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/rentals">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Create New Rental</h1>
      </div>

      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`h-10 w-10 rounded-full ${step >= 1 ? "bg-primary" : "bg-muted"} text-white flex items-center justify-center`}
            >
              {step > 1 ? <Check className="h-5 w-5" /> : "1"}
            </div>
            <span className="font-medium">Customer & Schedule</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <div
              className={`h-10 w-10 rounded-full ${step >= 2 ? "bg-primary" : "bg-muted"} text-white flex items-center justify-center`}
            >
              {step > 2 ? <Check className="h-5 w-5" /> : "2"}
            </div>
            <span className="font-medium">Equipment Selection</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <div
              className={`h-10 w-10 rounded-full ${step >= 3 ? "bg-primary" : "bg-muted"} text-white flex items-center justify-center`}
            >
              {step > 3 ? <Check className="h-5 w-5" /> : "3"}
            </div>
            <span className="font-medium">Verification & Contract</span>
          </div>
        </div>

        {step === 1 && (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
                <CardDescription>Select an existing customer or create a new one</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input placeholder="Search customers..." className="flex-1" />
                  <Button variant="outline" size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="John Doe" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="john@example.com" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="+63 912 345 6789" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea id="address" placeholder="123 Main St, Manila, Philippines" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rental Schedule</CardTitle>
                <CardDescription>Select the rental period</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>Start Date & Time</Label>
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !startDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="9am">9:00 AM</SelectItem>
                        <SelectItem value="10am">10:00 AM</SelectItem>
                        <SelectItem value="11am">11:00 AM</SelectItem>
                        <SelectItem value="12pm">12:00 PM</SelectItem>
                        <SelectItem value="1pm">1:00 PM</SelectItem>
                        <SelectItem value="2pm">2:00 PM</SelectItem>
                        <SelectItem value="3pm">3:00 PM</SelectItem>
                        <SelectItem value="4pm">4:00 PM</SelectItem>
                        <SelectItem value="5pm">5:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>End Date & Time</Label>
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !endDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="9am">9:00 AM</SelectItem>
                        <SelectItem value="10am">10:00 AM</SelectItem>
                        <SelectItem value="11am">11:00 AM</SelectItem>
                        <SelectItem value="12pm">12:00 PM</SelectItem>
                        <SelectItem value="1pm">1:00 PM</SelectItem>
                        <SelectItem value="2pm">2:00 PM</SelectItem>
                        <SelectItem value="3pm">3:00 PM</SelectItem>
                        <SelectItem value="4pm">4:00 PM</SelectItem>
                        <SelectItem value="5pm">5:00 PM</SelectItem>
                        <SelectItem value="6pm">6:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Rental Duration</Label>
                  <div className="p-3 bg-muted rounded-md">
                    <p className="font-medium">3 days, 8 hours</p>
                    <p className="text-sm text-muted-foreground">March 15, 2023 10:00 AM - March 18, 2023 6:00 PM</p>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" placeholder="Any special requirements or notes for this rental" />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="ml-auto" onClick={() => setStep(2)}>
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Equipment Selection</CardTitle>
                <CardDescription>Choose equipment for this rental</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="cameras" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="cameras">Cameras</TabsTrigger>
                    <TabsTrigger value="lenses">Lenses</TabsTrigger>
                    <TabsTrigger value="lighting">Lighting</TabsTrigger>
                    <TabsTrigger value="audio">Audio</TabsTrigger>
                    <TabsTrigger value="accessories">Accessories</TabsTrigger>
                  </TabsList>

                  <div className="flex gap-2 mb-4">
                    <Input placeholder="Search equipment..." className="max-w-sm" />
                    <Button variant="outline" size="icon">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>

                  <TabsContent value="cameras" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Card key={i} className="overflow-hidden">
                          <div className="aspect-video bg-muted flex items-center justify-center">
                            <img
                              src="/placeholder.svg?height=200&width=300&text=Camera"
                              alt="Camera"
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <CardHeader className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-base">Canon EOS R{i}</CardTitle>
                                <CardDescription>Professional Mirrorless Camera</CardDescription>
                              </div>
                              <div className="flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-600 text-xs font-medium">
                                {i}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <div className="grid gap-2">
                              <div className="flex justify-between">
                                <span className="text-sm">Daily Rate</span>
                                <span className="font-medium">₱{1500 + i * 100}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">Status</span>
                                <span className="text-green-600 font-medium">Available</span>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="p-4 pt-0">
                            <Button variant="outline" className="w-full">
                              Add to Rental
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="lenses" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {[1, 2, 3, 4].map((i) => (
                        <Card key={i} className="overflow-hidden">
                          <div className="aspect-video bg-muted flex items-center justify-center">
                            <img
                              src="/placeholder.svg?height=200&width=300&text=Lens"
                              alt="Lens"
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <CardHeader className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-base">
                                  {i === 1
                                    ? "Canon RF 24-70mm f/2.8L"
                                    : i === 2
                                      ? "Canon RF 70-200mm f/2.8L"
                                      : i === 3
                                        ? "Canon RF 15-35mm f/2.8L"
                                        : "Canon RF 50mm f/1.2L"}
                                </CardTitle>
                                <CardDescription>Professional Lens</CardDescription>
                              </div>
                              <div className="flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-600 text-xs font-medium">
                                {i}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <div className="grid gap-2">
                              <div className="flex justify-between">
                                <span className="text-sm">Daily Rate</span>
                                <span className="font-medium">₱{800 + i * 100}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">Status</span>
                                <span className="text-green-600 font-medium">Available</span>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="p-4 pt-0">
                            <Button variant="outline" className="w-full">
                              Add to Rental
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Other tabs would have similar content */}
                  <TabsContent value="lighting">
                    <div className="p-8 text-center text-muted-foreground">
                      Lighting equipment selection will appear here
                    </div>
                  </TabsContent>
                  <TabsContent value="audio">
                    <div className="p-8 text-center text-muted-foreground">
                      Audio equipment selection will appear here
                    </div>
                  </TabsContent>
                  <TabsContent value="accessories">
                    <div className="p-8 text-center text-muted-foreground">Accessories selection will appear here</div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Selected Equipment</CardTitle>
                <CardDescription>Items added to this rental</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Canon EOS R5", type: "Camera", rate: "₱2,500/day" },
                    { name: "Canon RF 24-70mm f/2.8L", type: "Lens", rate: "₱1,200/day" },
                    { name: "Canon RF 70-200mm f/2.8L", type: "Lens", rate: "₱1,500/day" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.type}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p>{item.rate}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <div className="text-right">
                  <p className="font-medium">Total: ₱15,600</p>
                  <p className="text-sm text-muted-foreground">For 3 days</p>
                </div>
                <Button onClick={() => setStep(3)}>
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>ID Verification</CardTitle>
                <CardDescription>Upload customer identification document</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="id-type">ID Type</Label>
                  <Select>
                    <SelectTrigger id="id-type">
                      <SelectValue placeholder="Select ID type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="drivers-license">Driver's License</SelectItem>
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="national-id">National ID</SelectItem>
                      <SelectItem value="company-id">Company ID</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="id-number">ID Number</Label>
                  <Input id="id-number" placeholder="Enter ID number" />
                </div>

                <div className="grid gap-2">
                  <Label>Upload ID Document</Label>
                  <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag and drop your file here, or click to browse
                      </p>
                      <Button variant="outline" size="sm">
                        Choose File
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Digital Signature</CardTitle>
                <CardDescription>Collect customer's electronic signature</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-md p-4 h-40 flex items-center justify-center bg-muted">
                  <p className="text-sm text-muted-foreground">Signature pad will appear here</p>
                </div>

                <div className="flex justify-center">
                  <Button variant="outline" size="sm">
                    Clear Signature
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Rental Summary</CardTitle>
                <CardDescription>Review rental details before finalizing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <h3 className="font-medium mb-2">Customer</h3>
                    <p>John Doe</p>
                    <p className="text-sm text-muted-foreground">john@example.com</p>
                    <p className="text-sm text-muted-foreground">+63 912 345 6789</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Schedule</h3>
                    <p>March 15, 2023 10:00 AM - March 18, 2023 6:00 PM</p>
                    <p className="text-sm text-muted-foreground">3 days, 8 hours</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Total</h3>
                    <p className="text-xl font-bold">₱15,600</p>
                    <p className="text-sm text-muted-foreground">3 items</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Equipment</h3>
                  <div className="space-y-2">
                    {[
                      { name: "Canon EOS R5", type: "Camera", rate: "₱2,500/day", total: "₱7,500" },
                      { name: "Canon RF 24-70mm f/2.8L", type: "Lens", rate: "₱1,200/day", total: "₱3,600" },
                      { name: "Canon RF 70-200mm f/2.8L", type: "Lens", rate: "₱1,500/day", total: "₱4,500" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.type}</p>
                        </div>
                        <div className="text-right">
                          <p>{item.rate}</p>
                          <p className="text-sm text-muted-foreground">{item.total}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button>
                  Create Rental <Check className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

