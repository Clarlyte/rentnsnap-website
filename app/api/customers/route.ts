import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const body = await request.json()
    
    // Check if customer already exists by email
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('customer_id')
      .eq('email', body.email)
      .single()

    if (existingCustomer) {
      // Update existing customer
      const { data, error } = await supabase
        .from('customers')
        .update({
          full_name: body.full_name,
          phone: body.phone,
          address: body.address,
          updated_at: new Date().toISOString()
        })
        .eq('customer_id', existingCustomer.customer_id)
        .select()
        .single()

      if (error) throw error
      return NextResponse.json(data)
    }

    // Create new customer
    const { data, error } = await supabase
      .from('customers')
      .insert({
        full_name: body.full_name,
        email: body.email,
        phone: body.phone,
        address: body.address
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)

  } catch (error) {
    console.error('Error handling customer:', error)
    return NextResponse.json(
      { error: 'Failed to process customer' },
      { status: 500 }
    )
  }
} 