import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const body = await request.json()

    // Create rental equipment association
    const { data, error } = await supabase
      .from('rental_equipment')
      .insert({
        rental_id: body.rental_id,
        equipment_id: body.equipment_id
      })
      .select()
      .single()

    if (error) throw error
    
    // Update equipment status to rented
    const { error: updateError } = await supabase
      .from('equipment')
      .update({ status: 'Rented' })
      .eq('equipment_id', body.equipment_id)

    if (updateError) throw updateError
    
    return NextResponse.json(data)

  } catch (error) {
    console.error('Error associating equipment with rental:', error)
    return NextResponse.json(
      { error: 'Failed to associate equipment with rental' },
      { status: 500 }
    )
  }
} 