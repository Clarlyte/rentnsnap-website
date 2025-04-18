import { Metadata } from "next"
import Link from "next/link"
import { Camera } from "lucide-react"
import { UserAuthForm } from "@/components/auth/user-auth-form"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Login - Rent n&apos; Snap",
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
              Rent n&apos; <span className="text-gold-400">Snap</span>
            </span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to sign in to your account
          </p>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <UserAuthForm />
        </Suspense>
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href="/register"
            className="hover:text-brand underline underline-offset-4"
          >
            Don&apos;t have an account? Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
} 