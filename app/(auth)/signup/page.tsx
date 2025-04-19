import { Metadata } from "next"
import Link from "next/link"
import { Camera } from "lucide-react"
import { UserRegisterForm } from "@/components/auth/user-register-form"

export const metadata: Metadata = {
  title: "Sign Up - Rent n&apos; Snap",
  description: "Create your account",
}

export default function SignUpPage() {
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
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email below to create your account
          </p>
        </div>
        <UserRegisterForm />
        <div className="text-center text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-gold-400 hover:text-gold-500">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
} 