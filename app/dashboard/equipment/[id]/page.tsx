"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import Link from "next/link"

interface RentalRate {
  rental_rate_id: string
  min_days: number
  max_days: number
  daily_rate: number
}

interface Equipment {
  equipment_id: string
  name: string
  type: string
  description: string
  status: string
  quantity_available: number
  image_url: string
  notes: string
  is_active: boolean
  rental_rates: RentalRate[]
}

export default function EditEquipmentPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [equipment, setEquipment] = useState<Equipment | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
    status: "",
    quantity_available: 1,
    image_url: "",
    notes: "",
    is_active: true,
    rental_rates: [] as RentalRate[]
  })

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await fetch(`/api/equipment/${params.id}`)
        const data = await response.json()
        
        if (!response.ok) throw new Error(data.error)
        
        setEquipment(data.equipment)
        setFormData({
          name: data.equipment.name,
          type: data.equipment.type,
          description: data.equipment.description || "",
          status: data.equipment.status,
          quantity_available: data.equipment.quantity_available,
          image_url: data.equipment.image_url || "",
          notes: data.equipment.notes || "",
          is_active: data.equipment.is_active,
          rental_rates: data.equipment.rental_rates || []
        })
      } catch (error) {
        console.error('Error fetching equipment:', error)
        toast.error('Failed to load equipment details')
      } finally {
        setLoading(false)
      }
    }

    fetchEquipment()
  }, [params.id])

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/equipment/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      
      if (!response.ok) throw new Error(data.error)
      
      toast.success('Equipment updated successfully')
      router.push('/dashboard/equipment')
    } catch (error) {
      console.error('Error updating equipment:', error)
      toast.error('Failed to update equipment')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/equipment/${params.id}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      
      if (!response.ok) throw new Error(data.error)
      
      toast.success('Equipment deleted successfully')
      router.push('/dashboard/equipment')
    } catch (error) {
      console.error('Error deleting equipment:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete equipment')
    }
  }

  if (loading) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Edit Equipment" text="Loading equipment details..." />
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-muted rounded w-1/4" />
                <div className="h-10 bg-muted rounded" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-10 bg-muted rounded" />
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <DashboardHeader 
        heading="Edit Equipment" 
        text="Update equipment details"
      >
        <div className="flex gap-2">
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/dashboard/equipment/${params.id}/history`}>
              View History
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Equipment</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the equipment
                  and remove it from our records.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DashboardHeader>

      <Card>
        <CardHeader>
          <CardTitle>Equipment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Input
                id="type"
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Reserved">Reserved</SelectItem>
                  <SelectItem value="In Repair">In Repair</SelectItem>
                  <SelectItem value="Retired">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity Available</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={formData.quantity_available}
                onChange={(e) => handleInputChange('quantity_available', parseInt(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={formData.image_url}
                onChange={(e) => handleInputChange('image_url', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
              />
            </div>
          </form>
        </CardContent>
      </Card>
    </DashboardShell>
  )
} 