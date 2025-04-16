'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

// Password strength requirements
const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  hasUpperCase: true,
  hasLowerCase: true,
  hasNumber: true,
  hasSpecialChar: true,
}

export function useAuth() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [session, setSession] = useState<any>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    // Set up session listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
    })

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const validatePassword = (password: string): { isValid: boolean; error?: string } => {
    if (password.length < PASSWORD_REQUIREMENTS.minLength) {
      return { isValid: false, error: `Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters long` }
    }
    if (PASSWORD_REQUIREMENTS.hasUpperCase && !/[A-Z]/.test(password)) {
      return { isValid: false, error: 'Password must contain at least one uppercase letter' }
    }
    if (PASSWORD_REQUIREMENTS.hasLowerCase && !/[a-z]/.test(password)) {
      return { isValid: false, error: 'Password must contain at least one lowercase letter' }
    }
    if (PASSWORD_REQUIREMENTS.hasNumber && !/\d/.test(password)) {
      return { isValid: false, error: 'Password must contain at least one number' }
    }
    if (PASSWORD_REQUIREMENTS.hasSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return { isValid: false, error: 'Password must contain at least one special character' }
    }
    return { isValid: true }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      router.refresh()
      router.push('/dashboard')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during sign in')
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      setError(null)

      // Validate password strength
      const { isValid, error: passwordError } = validatePassword(password)
      if (!isValid) {
        throw new Error(passwordError)
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        throw error
      }

      return { success: true }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during sign up')
      return { success: false, error }
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        throw error
      }

      router.refresh()
      router.push('/')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during sign out')
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        throw error
      }

      return { success: true }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during password reset')
      return { success: false, error }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    signIn,
    signUp,
    signOut,
    resetPassword,
    isLoading,
    error,
    session,
    user: session?.user ?? null,
  }
} 