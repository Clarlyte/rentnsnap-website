import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const body = await request.json()

    console.log('Creating rental-equipment association:', body)

    if (!body.rental_id || !body.equipment_id) {
      throw new Error('Missing required fields: rental_id and equipment_id are required')
    }

    // Create rental equipment association
    const { data, error: insertError } = await supabase
      .from('rental_equipment')
      .insert({
        rental_id: body.rental_id,
        equipment_id: body.equipment_id,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting rental equipment:', insertError)
      throw insertError
    }
    
    // Update equipment status to Reserved
    const { error: updateError } = await supabase
      .from('equipment')
      .update({ status: 'Reserved' })
      .eq('equipment_id', body.equipment_id)

    if (updateError) {
      console.error('Error updating equipment status:', updateError)
      throw updateError
    }

    console.log('Rental equipment association created:', data)
    return NextResponse.json(data)

  } catch (error) {
    console.error('Error associating equipment with rental:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to associate equipment with rental' },
      { status: 500 }
    )
  }
} 