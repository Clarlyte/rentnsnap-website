"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { toast } from "sonner"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

interface CustomerFormData {
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
}

interface SelectedEquipment {
  equipment_id: string
  name: string
  type: string
  daily_rate: number
}

export default function CreateRentalPage() {
  const router = useRouter()
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [startTime, setStartTime] = useState<string>("09:00")
  const [endTime, setEndTime] = useState<string>("17:00")
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [customerData, setCustomerData] = useState<CustomerFormData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: ""
  })
  
  const [selectedEquipment, setSelectedEquipment] = useState<SelectedEquipment[]>([])
  const [notes, setNotes] = useState("")
  const [equipment, setEquipment] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const calculateDuration = () => {
    if (!startDate || !endDate || !startTime || !endTime) return null;
    
    const startDateTime = new Date(startDate);
    const [startHours, startMinutes] = startTime.split(':');
    startDateTime.setHours(parseInt(startHours), parseInt(startMinutes), 0);

    const endDateTime = new Date(endDate);
    const [endHours, endMinutes] = endTime.split(':');
    endDateTime.setHours(parseInt(endHours), parseInt(endMinutes), 0);

    const durationMs = endDateTime.getTime() - startDateTime.getTime();
    const durationHours = durationMs / (1000 * 60 * 60);
    const days = Math.floor(durationHours / 24);
    const hours = Math.round(durationHours % 24);

    return {
      days,
      hours,
      startDateTime,
      endDateTime,
      formattedStart: format(startDateTime, "PPP p"),
      formattedEnd: format(endDateTime, "PPP p")
    };
  };

  const handleCustomerChange = (field: keyof CustomerFormData, value: string) => {
    setCustomerData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddEquipment = (item: any) => {
    // Find the lowest daily rate from the rental rates
    const lowestRate = item.rental_rates.reduce((min: number, rate: any) => 
      rate.daily_rate < min ? rate.daily_rate : min, 
      item.rental_rates[0].daily_rate
    )

    const equipmentItem = {
      equipment_id: item.equipment_id,
      name: item.name,
      type: item.type,
      daily_rate: lowestRate
    }
    setSelectedEquipment(prev => {
      // Check if equipment is already selected
      if (prev.some(e => e.equipment_id === item.equipment_id)) {
        toast.error('This equipment is already added to the rental')
        return prev
      }
      return [...prev, equipmentItem]
    })
  }

  const handleRemoveEquipment = (equipmentId: string) => {
    setSelectedEquipment(prev => prev.filter(item => item.equipment_id !== equipmentId))
  }

  const calculateTotalPrice = () => {
    if (!startDate || !endDate || !startTime || !endTime) return 0;
    
    const startDateTime = new Date(startDate);
    const [startHours, startMinutes] = startTime.split(':');
    startDateTime.setHours(parseInt(startHours), parseInt(startMinutes), 0);

    const endDateTime = new Date(endDate);
    const [endHours, endMinutes] = endTime.split(':');
    endDateTime.setHours(parseInt(endHours), parseInt(endMinutes), 0);

    // Calculate duration in days, including partial days
    const durationInHours = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60);
    const durationInDays = Math.ceil(durationInHours / 24);

    return selectedEquipment.reduce((total, item) => total + (item.daily_rate * durationInDays), 0);
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      // 1. Create or get customer
      const customerResponse = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerData)
      })

      if (!customerResponse.ok) {
        const error = await customerResponse.json()
        throw new Error(error.error || 'Failed to create customer')
      }

      const { customer_id } = await customerResponse.json()

      // 2. Create rental record
      const startDateTime = startDate ? new Date(startDate) : null
      const endDateTime = endDate ? new Date(endDate) : null

      if (!startDateTime || !endDateTime) {
        throw new Error('Invalid dates')
      }

      // Set the time components using 24-hour format
      const [startHours, startMinutes] = startTime.split(':')
      startDateTime.setHours(parseInt(startHours), parseInt(startMinutes), 0)
      
      const [endHours, endMinutes] = endTime.split(':')
      endDateTime.setHours(parseInt(endHours), parseInt(endMinutes), 0)

      const rentalData = {
        customer_id,
        start_date: startDateTime.toISOString(),
        end_date: endDateTime.toISOString(),
        status: "Reserved",
        total_price: calculateTotalPrice(),
        notes
      }

      const rentalResponse = await fetch("/api/rentals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rentalData)
      })

      if (!rentalResponse.ok) {
        const error = await rentalResponse.json()
        throw new Error(error.error || 'Failed to create rental')
      }

      const { rental_id } = await rentalResponse.json()

      // 3. Create rental equipment records
      const equipmentPromises = selectedEquipment.map(equipment => 
        fetch("/api/rental-equipment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rental_id,
            equipment_id: equipment.equipment_id
          })
        })
      )

      await Promise.all(equipmentPromises)

      toast.success("Rental created successfully!")
      router.push("/dashboard/rentals")
      
    } catch (error) {
      console.error("Error creating rental:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create rental. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Fetch equipment on component mount
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await fetch('/api/equipment')
        const data = await response.json()
        setEquipment(data)
      } catch (error) {
        console.error('Error fetching equipment:', error)
        toast.error('Failed to load equipment')
      } finally {
        setLoading(false)
      }
    }
    fetchEquipment()
  }, [])

  // Replace the time selection JSX with 24-hour format input
  const TimeSelect = ({ value, onChange }: { value: string, onChange: (time: string) => void }) => (
    <Input
      type="time"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-[120px]"
    />
  );

  return (
    <DashboardShell>
      <div className="container max-w-7xl mx-auto py-4 sm:py-6">
        <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
          <Link href="/dashboard/rentals">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold">Create New Rental</h1>
        </div>

        <div className="grid gap-4 sm:gap-6">
          <div className="flex items-center justify-between overflow-x-auto pb-2 sm:pb-0">
            <div className="flex items-center gap-2 sm:gap-4 min-w-max">
              <div
                className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full ${step >= 1 ? "bg-primary" : "bg-muted"} text-white flex items-center justify-center`}
              >
                {step > 1 ? <Check className="h-4 w-4" /> : "1"}
              </div>
              <span className="font-medium text-sm sm:text-base">Customer & Schedule</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <div
                className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full ${step >= 2 ? "bg-primary" : "bg-muted"} text-white flex items-center justify-center`}
              >
                {step > 2 ? <Check className="h-4 w-4" /> : "2"}
              </div>
              <span className="font-medium text-sm sm:text-base">Equipment Selection</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <div
                className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full ${step >= 3 ? "bg-primary" : "bg-muted"} text-white flex items-center justify-center`}
              >
                {step > 3 ? <Check className="h-4 w-4" /> : "3"}
              </div>
              <span className="font-medium text-sm sm:text-base">Verification & Contract</span>
            </div>
          </div>

          {step === 1 && (
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                  <CardDescription>Select an existing customer or create a new one</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Search customers..." 
                      className="flex-1" 
                    />
                    <Button variant="outline" size="icon">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="first_name">First Name</Label>
                      <Input 
                        id="first_name" 
                        value={customerData.first_name}
                        onChange={(e) => handleCustomerChange("first_name", e.target.value)}
                        placeholder="John" 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input 
                        id="last_name" 
                        value={customerData.last_name}
                        onChange={(e) => handleCustomerChange("last_name", e.target.value)}
                        placeholder="Doe" 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email"
                        type="email"
                        value={customerData.email}
                        onChange={(e) => handleCustomerChange("email", e.target.value)}
                        placeholder="john@example.com" 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone"
                        value={customerData.phone}
                        onChange={(e) => handleCustomerChange("phone", e.target.value)}
                        placeholder="+63 912 345 6789" 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea 
                        id="address"
                        value={customerData.address}
                        onChange={(e) => handleCustomerChange("address", e.target.value)}
                        placeholder="123 Main St, Manila, Philippines" 
                      />
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
                      <TimeSelect value={startTime} onChange={setStartTime} />
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
                      <TimeSelect value={endTime} onChange={setEndTime} />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label>Rental Duration</Label>
                    <div className="p-3 bg-muted rounded-md">
                      {calculateDuration() ? (
                        <>
                          <p className="font-medium">
                            {calculateDuration()?.days} days
                            {calculateDuration()?.hours > 0 ? `, ${calculateDuration()?.hours} hours` : ''}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {calculateDuration()?.formattedStart} - {calculateDuration()?.formattedEnd}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">Select start and end dates to see duration</p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea 
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any special requirements or notes for this rental" 
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="ml-auto" 
                    onClick={() => setStep(2)}
                    disabled={!customerData.first_name || !startDate || !endDate || !startTime || !endTime}
                  >
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-4 sm:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Equipment Selection</CardTitle>
                  <CardDescription>Choose equipment for this rental</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="cameras" className="space-y-4">
                    <TabsList className="w-full overflow-x-auto">
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

                    {loading ? (
                      <div className="p-8 text-center">
                        <p className="text-muted-foreground">Loading equipment...</p>
                      </div>
                    ) : (
                      <TabsContent value="cameras" className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {equipment
                            .filter(item => item.type === 'camera')
                            .map((item) => (
                              <Card key={item.id} className="overflow-hidden">
                                <div className="aspect-video bg-muted">
                                  {item.image_url ? (
                                    <img
                                      src={item.image_url}
                                      alt={item.name}
                                      className="object-cover w-full h-full"
                                    />
                                  ) : (
                                    <div className="flex items-center justify-center h-full">
                                      <p className="text-muted-foreground">No image</p>
                                    </div>
                                  )}
                                </div>
                                <CardHeader className="p-4">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <CardTitle className="text-base">{item.name}</CardTitle>
                                      <CardDescription>{item.description}</CardDescription>
                                    </div>
                                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-600 text-xs font-medium">
                                      {item.quantity_available}
                                    </div>
                                  </div>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                  <div className="grid gap-2">
                                    <div className="flex justify-between">
                                      <span className="text-sm">Daily Rate</span>
                                      <span className="font-medium">₱{item.daily_rate}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm">Status</span>
                                      <span className="text-green-600 font-medium">
                                        {item.status}
                                      </span>
                                    </div>
                                  </div>
                                </CardContent>
                                <CardFooter className="p-4 pt-0">
                                  <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => handleAddEquipment(item)}
                                    disabled={item.status !== 'Available'}
                                  >
                                    Add to Rental
                                  </Button>
                                </CardFooter>
                              </Card>
                            ))}
                        </div>
                      </TabsContent>
                    )}

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
                    {selectedEquipment.map((item, i) => (
                      <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.type}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <p>₱{item.daily_rate}/day</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                            onClick={() => handleRemoveEquipment(item.equipment_id)}
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
                    <p className="font-medium">Total: ₱{calculateTotalPrice()}</p>
                    <p className="text-sm text-muted-foreground">
                      For {endDate && startDate
                        ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
                        : 0} days
                    </p>
                  </div>
                  <Button
                    onClick={() => setStep(3)}
                    disabled={selectedEquipment.length === 0}
                  >
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
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
                <CardContent className="space-y-4 sm:space-y-6">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <h3 className="font-medium mb-2">Customer</h3>
                      <p>{customerData.first_name} {customerData.last_name}</p>
                      <p className="text-sm text-muted-foreground">{customerData.email}</p>
                      <p className="text-sm text-muted-foreground">{customerData.phone}</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Schedule</h3>
                      {calculateDuration() ? (
                        <>
                          <p>{calculateDuration()?.formattedStart} - {calculateDuration()?.formattedEnd}</p>
                          <p className="text-sm text-muted-foreground">
                            {calculateDuration()?.days} days
                            {calculateDuration()?.hours > 0 ? `, ${calculateDuration()?.hours} hours` : ''}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">Schedule not set</p>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Total</h3>
                      <p className="text-xl font-bold">₱{calculateTotalPrice()}</p>
                      <p className="text-sm text-muted-foreground">
                        For {endDate && startDate
                          ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
                          : 0} days
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Equipment</h3>
                    <div className="space-y-2">
                      {selectedEquipment.map((item, i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{item.type}</p>
                          </div>
                          <div className="text-right">
                            <p>₱{item.daily_rate}/day</p>
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
                  <Button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Creating Rental..."
                    ) : (
                      <>
                        Create Rental <Check className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  )
}

