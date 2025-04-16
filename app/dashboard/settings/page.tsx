import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { UserSettingsForm } from "@/components/dashboard/user-settings-form"

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account settings",
}

export default async function SettingsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Settings" text="Manage your account settings" />
      <div className="grid gap-10">
        <UserSettingsForm user={{ id: user.id, email: user.email || "" }} />
      </div>
    </DashboardShell>
  )
}
