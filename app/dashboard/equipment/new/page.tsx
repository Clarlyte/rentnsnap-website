"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EquipmentForm } from "@/components/dashboard/equipment-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default function NewEquipmentPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Add New Equipment" text="Add a new piece of equipment to your inventory">
        <Button variant="outline" asChild>
          <Link href="/dashboard/equipment">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Link>
        </Button>
      </DashboardHeader>

      <Card>
        <CardHeader>
          <CardTitle>Equipment Details</CardTitle>
          <CardDescription>
            Add a new piece of equipment to your inventory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EquipmentForm />
        </CardContent>
      </Card>
    </DashboardShell>
  )
} 