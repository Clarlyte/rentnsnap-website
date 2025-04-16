import { Metadata } from "next"
import Link from "next/link"
import { Camera } from "lucide-react"
import { UserAuthForm } from "@/components/auth/user-auth-form"

export const metadata: Metadata = {
  title: "Login - Rent n' Snap",
  description: "Login to your account",
}

export default function LoginPage() {
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
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to sign in to your account
          </p>
        </div>
        <UserAuthForm />
        <div className="text-center text-sm">
          Don't have an account?{' '}
          <Link href="/signup" className="text-gold-400 hover:text-gold-500">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
} 