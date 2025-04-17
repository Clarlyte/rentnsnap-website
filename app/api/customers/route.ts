import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    const { data: customers, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching customers:', error)
      throw error
    }

    return NextResponse.json(customers)
  } catch (error) {
    console.error('Error handling customers fetch:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch customers' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const body = await request.json()
    
    console.log('Received customer data:', body)

    // Validate required fields
    if (!body.first_name || !body.last_name || !body.email) {
      return NextResponse.json(
        { error: 'First name, last name, and email are required' },
        { status: 400 }
      )
    }
    
    // Create new customer with required fields
    const { data: customer, error: insertError } = await supabase
      .from('customers')
      .insert({
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        phone: body.phone || null,
        address: body.address || null,
        id_type: null,
        id_number: null,
        verified: false,
        notes: body.notes || null,
        membership_level: 'standard',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error creating customer:', insertError)
      throw insertError
    }

    console.log('Customer created:', customer)
    return NextResponse.json(customer)
  } catch (error) {
    console.error('Error handling customer:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to handle customer' },
      { status: 500 }
    )
  }
} 