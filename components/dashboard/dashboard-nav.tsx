"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar, Camera, FileText, Home, Settings, Users } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Calendar",
    href: "/dashboard/calendar",
    icon: Calendar,
  },
  {
    title: "Rentals",
    href: "/dashboard/rentals",
    icon: FileText,
  },
  {
    title: "Customers",
    href: "/dashboard/customers",
    icon: Users,
  },
  {
    title: "Equipment",
    href: "/dashboard/equipment",
    icon: Camera,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="grid items-start gap-2 py-6 px-2">
      {navItems.map((item) => {
        const isActive = item.href === "/dashboard" 
          ? pathname === "/dashboard" // Exact match for dashboard
          : pathname.startsWith(`${item.href}/`) || pathname === item.href // For other pages

        return (
          <Link key={item.href} href={item.href}>
            <Button
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-[calc(100%-8px)] justify-start group rounded-md mx-1",
                isActive && "bg-gold-500/10 text-gold-400 hover:bg-gold-500/20"
              )}
            >
              <item.icon className={cn(
                "mr-2 h-4 w-4 transition-colors",
                isActive ? "text-gold-400" : "group-hover:text-gold-400"
              )} />
              {item.title}
            </Button>
          </Link>
        )
      })}
    </nav>
  )
}

