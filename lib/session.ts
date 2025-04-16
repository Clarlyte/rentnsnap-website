import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

export async function getCurrentUser() {
  const supabase = createServerComponentClient<Database>({ cookies })

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return null
    }

    return session.user
  } catch (error) {
    console.error("Error:", error)
    return null
  }
}
