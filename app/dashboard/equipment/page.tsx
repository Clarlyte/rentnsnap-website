"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search } from "lucide-react"
import Image from "next/image"

export default function EquipmentPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <DashboardShell>
      <DashboardHeader heading="Equipment" text="Manage your equipment inventory">
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Equipment
        </Button>
      </DashboardHeader>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 max-w-sm">
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
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-video bg-muted">
              <Image
                src="/placeholder.svg?height=200&width=300&text=Camera"
                alt="Equipment"
                width={300}
                height={200}
                className="object-cover w-full h-full"
              />
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">Canon EOS R{i}</h3>
                  <p className="text-sm text-muted-foreground">Professional Camera</p>
                </div>
                <Badge variant={i % 2 === 0 ? "default" : "secondary"}>{i % 2 === 0 ? "Available" : "In Use"}</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Daily Rate</span>
                  <span className="font-medium">₱{(1500 + i * 100).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Serial Number</span>
                  <span className="font-medium">CN{i}2345678</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardShell>
  )
}

