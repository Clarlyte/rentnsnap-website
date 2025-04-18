"use client"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function SettingsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Settings" text="Manage your account and application settings" />

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="general" className="flex-1 sm:flex-none">General</TabsTrigger>
          <TabsTrigger value="billing" className="flex-1 sm:flex-none">Billing</TabsTrigger>
          <TabsTrigger value="notifications" className="flex-1 sm:flex-none">Notifications</TabsTrigger>
          <TabsTrigger value="team" className="flex-1 sm:flex-none">Team</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Business Information</CardTitle>
              <CardDescription>Update your business details and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-3">
                <Label htmlFor="businessName">Business Name</Label>
                <Input id="businessName" placeholder="Your business name" defaultValue="Rent n' Snap" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="address">Business Address</Label>
                <Input id="address" placeholder="Your business address" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="phone">Contact Number</Label>
                <Input id="phone" placeholder="Your contact number" />
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Enable dark mode for the application</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Subscription Plan</CardTitle>
              <CardDescription>Manage your subscription and billing details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-6">
                <div>
                  <p className="font-medium">Current Plan</p>
                  <p className="text-sm text-muted-foreground">Professional Plan</p>
                </div>
                <Badge className="mt-2 sm:mt-0">Active</Badge>
              </div>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Next billing date: April 1, 2024</p>
                <Button className="w-full sm:w-auto">Upgrade Plan</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose what notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                "Email notifications for new rentals",
                "SMS alerts for overdue returns",
                "Daily summary reports",
                "Weekly analytics reports",
              ].map((item, i) => (
                <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <Label htmlFor={`notify-${i}`}>{item}</Label>
                  <Switch id={`notify-${i}`} defaultChecked={i < 2} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Manage your team and their permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-6 last:border-0 last:pb-0 gap-4">
                  <div>
                    <p className="font-medium">Team Member {i}</p>
                    <p className="text-sm text-muted-foreground">team{i}@rentnsnap.com</p>
                  </div>
                  <Badge variant={i === 1 ? "default" : "secondary"} className="mt-2 sm:mt-0">{i === 1 ? "Admin" : "Staff"}</Badge>
                </div>
              ))}
              <Button className="w-full sm:w-auto">Add Team Member</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

