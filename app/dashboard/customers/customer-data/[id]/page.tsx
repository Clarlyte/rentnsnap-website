"use client"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, Download, Edit, Printer, User } from "lucide-react"
import Link from "next/link"

export default function CustomerDataPage({ params }: { params: { id: string } }) {
  return (
    <DashboardShell>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/customers">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Customer #{params.id}</h1>
        <Badge>Active</Badge>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="rentals">Rentals</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Customer's personal details</CardDescription>
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
                <Button variant="outline" className="w-full">
                  <Edit className="mr-2 h-4 w-4" /> Edit Information
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rental History</CardTitle>
                <CardDescription>Customer's rental activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <div className="grid grid-cols-2">
                    <p className="text-sm font-medium">Total Rentals</p>
                    <p className="text-sm">12</p>
                  </div>
                  <div className="grid grid-cols-2">
                    <p className="text-sm font-medium">Active Rentals</p>
                    <div>
                      <Badge>2</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2">
                    <p className="text-sm font-medium">Total Spent</p>
                    <p className="text-sm">₱60,000</p>
                  </div>
                </div>
                <Separator />
                <div className="grid gap-2">
                  <div className="grid grid-cols-2">
                    <p className="text-sm font-medium">Last Rental</p>
                    <p className="text-sm">March 15, 2023</p>
                  </div>
                  <div className="grid grid-cols-2">
                    <p className="text-sm font-medium">Next Rental</p>
                    <p className="text-sm">April 1, 2023</p>
                  </div>
                  <div className="grid grid-cols-2">
                    <p className="text-sm font-medium">Member Since</p>
                    <p className="text-sm">January 1, 2023</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Calendar className="mr-2 h-4 w-4" /> View All Rentals
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rentals" className="space-y-4">
          {/* Rental history content will go here */}
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          {/* Documents content will go here */}
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

