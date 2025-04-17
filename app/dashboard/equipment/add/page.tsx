"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus, Trash } from "lucide-react"
import { toast } from "sonner"

interface RentalRate {
  min_days: string
  max_days: string
  daily_rate: string
}

interface EquipmentFormData {
  name: string
  type: string
  description: string
  quantity_available: string
  status: string
  image_url?: string
  rental_rates: RentalRate[]
}

export default function AddEquipmentPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<EquipmentFormData>({
    name: "",
    type: "",
    description: "",
    quantity_available: "1",
    status: "available",
    rental_rates: [{ min_days: "1", max_days: "", daily_rate: "" }]
  })

  const handleChange = (field: keyof Omit<EquipmentFormData, "rental_rates">, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleRateChange = (index: number, field: keyof RentalRate, value: string) => {
    setFormData(prev => {
      const newRates = [...prev.rental_rates]
      newRates[index] = { ...newRates[index], [field]: value }
      return { ...prev, rental_rates: newRates }
    })
  }

  const addRate = () => {
    setFormData(prev => ({
      ...prev,
      rental_rates: [...prev.rental_rates, { min_days: "", max_days: "", daily_rate: "" }]
    }))
  }

  const removeRate = (index: number) => {
    if (formData.rental_rates.length === 1) {
      toast.error("You must have at least one rental rate")
      return
    }
    setFormData(prev => ({
      ...prev,
      rental_rates: prev.rental_rates.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      // Validate form data
      if (!formData.name || !formData.type || !formData.quantity_available) {
        toast.error("Please fill in all required fields")
        return
      }

      // Validate rental rates
      const hasInvalidRates = formData.rental_rates.some(rate => 
        !rate.min_days || !rate.daily_rate || 
        parseInt(rate.min_days) < 1 || 
        parseInt(rate.daily_rate) < 1
      )

      if (hasInvalidRates) {
        toast.error("Please fill in all rental rates correctly")
        return
      }

      // Convert numeric strings to numbers and format data
      const equipmentData = {
        name: formData.name,
        type: formData.type,
        description: formData.description,
        quantity_available: parseInt(formData.quantity_available),
        status: formData.status,
        image_url: formData.image_url,
        rental_rates: formData.rental_rates.map(rate => ({
          min_days: parseInt(rate.min_days),
          max_days: rate.max_days ? parseInt(rate.max_days) : null,
          daily_rate: parseFloat(rate.daily_rate)
        }))
      }

      const response = await fetch("/api/equipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(equipmentData)
      })

      if (!response.ok) {
        throw new Error("Failed to add equipment")
      }

      toast.success("Equipment added successfully!")
      router.push("/dashboard/equipment")
      
    } catch (error) {
      console.error("Error adding equipment:", error)
      toast.error("Failed to add equipment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardShell>
      <div className="container max-w-2xl mx-auto py-4 sm:py-6">
        <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
          <Link href="/dashboard/equipment">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold">Add New Equipment</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Equipment Details</CardTitle>
            <CardDescription>Enter the details of the new equipment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Equipment Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="e.g., Canon G7X Mark III"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="type">Equipment Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select equipment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="camera">Camera</SelectItem>
                    <SelectItem value="lens">Lens</SelectItem>
                    <SelectItem value="lighting">Lighting</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="accessory">Accessory</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Enter equipment description"
                  rows={4}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity Available *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity_available}
                  onChange={(e) => handleChange("quantity_available", e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="maintenance">Under Maintenance</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  type="url"
                  value={formData.image_url || ""}
                  onChange={(e) => handleChange("image_url", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-sm text-muted-foreground">
                  Enter a URL for the equipment image. Leave blank to use default placeholder.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Rental Rates *</Label>
                <Button type="button" variant="outline" size="sm" onClick={addRate}>
                  <Plus className="h-4 w-4 mr-2" /> Add Rate
                </Button>
              </div>
              
              <div className="space-y-4">
                {formData.rental_rates.map((rate, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="grid gap-2 flex-1">
                      <Label>Minimum Days</Label>
                      <Input
                        type="number"
                        min="1"
                        value={rate.min_days}
                        onChange={(e) => handleRateChange(index, "min_days", e.target.value)}
                        placeholder="1"
                      />
                    </div>
                    <div className="grid gap-2 flex-1">
                      <Label>Maximum Days</Label>
                      <Input
                        type="number"
                        min={parseInt(rate.min_days) + 1 || ""}
                        value={rate.max_days}
                        onChange={(e) => handleRateChange(index, "max_days", e.target.value)}
                        placeholder="Optional"
                      />
                    </div>
                    <div className="grid gap-2 flex-1">
                      <Label>Daily Rate (₱)</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={rate.daily_rate}
                        onChange={(e) => handleRateChange(index, "daily_rate", e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="mt-8"
                      onClick={() => removeRate(index)}
                    >
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Set different daily rates based on rental duration. Leave maximum days empty for unlimited duration.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/equipment")}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding Equipment..." : "Add Equipment"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardShell>
  )
} 