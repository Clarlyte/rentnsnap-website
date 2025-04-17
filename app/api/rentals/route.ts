import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const body = await request.json()

    // Create rental record
    const { data, error } = await supabase
      .from('rentals')
      .insert({
        customer_id: body.customer_id,
        start_date: body.start_date,
        end_date: body.end_date,
        status: body.status,
        total_price: body.total_price,
        notes: body.notes
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)

  } catch (error) {
    console.error('Error creating rental:', error)
    return NextResponse.json(
      { error: 'Failed to create rental' },
      { status: 500 }
    )
  }
} 