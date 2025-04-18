"use client"

import { useState, useEffect } from "react"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Camera } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface Equipment {
  equipment_id: string
  name: string
  type: string
  description: string
  status: string
  quantity_available: number
  image_url: string
  rental_rates: Array<{
    rental_rate_id: string
    min_days: number
    max_days: number
    daily_rate: number
  }>
}

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await fetch('/api/equipment')
        const data = await response.json()
        
        if (!response.ok) throw new Error(data.error)
        
        console.log('Fetched equipment:', data)
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

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === "all" || item.type === selectedType
    return matchesSearch && matchesType
  })

  const equipmentTypes = ["all", ...Array.from(new Set(equipment.map(item => item.type)))]

  return (
    <DashboardShell>
      <DashboardHeader heading="Equipment" text="Manage your rental equipment">
        <Button asChild className="w-full sm:w-auto">
          <Link href="/dashboard/equipment/new">
            <Plus className="mr-2 h-4 w-4" /> Add Equipment
          </Link>
        </Button>
      </DashboardHeader>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 w-full">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search equipment..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Equipment type" />
            </SelectTrigger>
            <SelectContent>
              {equipmentTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-video bg-muted" />
                <CardHeader className="space-y-3">
                  <div className="h-4 w-2/3 bg-muted rounded" />
                  <div className="h-3 w-1/2 bg-muted rounded" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-3 w-full bg-muted rounded" />
                    <div className="h-3 w-3/4 bg-muted rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredEquipment.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="flex flex-col items-center justify-center">
                <div className="bg-muted rounded-full p-6 mb-6">
                  <Camera className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-3">
                  {equipment.length === 0 
                    ? "No equipment added yet"
                    : "No equipment matches your search"}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  {equipment.length === 0 
                    ? "Start by adding your first piece of equipment to your inventory."
                    : "Try adjusting your search or filter criteria."}
                </p>
                {equipment.length === 0 && (
                  <Button asChild>
                    <Link href="/dashboard/equipment/new">
                      <Plus className="mr-2 h-4 w-4" /> Add Equipment
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEquipment.map((item) => (
              <Card key={item.equipment_id} className="overflow-hidden flex flex-col">
                <div className="aspect-video bg-muted">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Camera className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{item.name}</CardTitle>
                      <CardDescription className="min-h-[20px]">{item.description}</CardDescription>
                    </div>
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-600 text-xs font-medium">
                      {item.quantity_available}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Status</span>
                    <span className={`font-medium ${
                      item.status === 'Available' ? 'text-green-600' : 
                      item.status === 'Rented' ? 'text-orange-600' :
                      item.status === 'In Repair' ? 'text-yellow-600' :
                      item.status === 'Reserved' ? 'text-blue-600' :
                      'text-red-600'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  {item.rental_rates?.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm">Daily Rate</span>
                      <span className="font-medium">
                        From ₱{Math.min(...item.rental_rates.map(rate => rate.daily_rate))}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm">Type</span>
                    <span className="font-medium capitalize">{item.type}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-4">
                  <Button variant="outline" className="flex-1" asChild>
                    <Link href={`/dashboard/equipment/${item.equipment_id}`}>
                      Edit
                    </Link>
                  </Button>
                  <Button variant="outline" className="flex-1" asChild>
                    <Link href={`/dashboard/equipment/${item.equipment_id}/history`}>
                      View History
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  )
}

