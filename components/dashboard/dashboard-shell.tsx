import type React from "react"
import { DashboardNav } from "./dashboard-nav"
import { MainNav } from "./main-nav"
import { UserNav } from "./user-nav"

interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <MainNav />
          <UserNav />
        </div>
      </header>
      <div className="container mx-auto flex-1 px-4 sm:px-6 lg:px-8">
        <div className="grid flex-1 gap-12 md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr]">
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

