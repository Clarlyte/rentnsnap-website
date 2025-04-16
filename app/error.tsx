"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center justify-center flex-1 px-4 py-16 text-center">
        <div className="max-w-md space-y-6">
          <h1 className="text-6xl font-bold text-destructive">Error</h1>
          <h2 className="text-3xl font-bold">Something went wrong</h2>
          <p className="text-muted-foreground">An unexpected error occurred. Please try again later.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button onClick={reset}>Try again</Button>
            <Button asChild variant="outline">
              <Link href="/">Go back home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
