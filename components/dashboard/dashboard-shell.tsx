"use client"

import { useState } from "react"
import type React from "react"
import { DashboardNav } from "./dashboard-nav"
import { MainNav } from "./main-nav"
import { UserNav } from "./user-nav"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            >
              {isMobileNavOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
            <MainNav />
          </div>
          <UserNav />
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden",
          isMobileNavOpen ? "block" : "hidden"
        )}
        onClick={() => setIsMobileNavOpen(false)}
      />

      {/* Mobile Navigation Sidebar */}
      <div
        className={cn(
          "fixed top-16 left-0 z-30 h-[calc(100vh-4rem)] w-3/4 max-w-sm bg-background border-r transform transition-transform duration-200 ease-in-out md:hidden",
          isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <DashboardNav />
      </div>

      <div className="container mx-auto flex-1 px-4 sm:px-6 lg:px-8">
        <div className="grid flex-1 gap-12 md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr]">
          {/* Desktop Navigation */}
          <aside className="hidden w-[200px] flex-col md:flex lg:w-[240px] pt-8">
            <DashboardNav />
          </aside>
          <main className="flex w-full flex-1 flex-col overflow-hidden py-8 md:pl-6 lg:pl-8">
            <div className="mx-auto w-full max-w-7xl space-y-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

