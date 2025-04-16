'use client'

import { Camera } from 'lucide-react'
import Link from 'next/link'

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] px-4">
        <div className="flex flex-col space-y-2 text-center">
          <div className="flex items-center justify-center gap-2">
            <Camera className="h-6 w-6 text-gold-400" />
            <span className="text-2xl font-bold">
              Rent n' <span className="text-gold-400">Snap</span>
            </span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
          <p className="text-sm text-muted-foreground">
            We've sent you a verification link. Please check your email to verify your account.
          </p>
        </div>
        <div className="text-center text-sm">
          <Link href="/login" className="text-gold-400 hover:text-gold-500">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
} 