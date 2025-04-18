import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const body = await request.json()

    const { rental_id, idType, idNumber, signature } = body

    // Store verification data in the database
    const { data, error } = await supabase
      .from('rental_verifications')
      .insert({
        rental_id,
        id_type: idType,
        id_number: idNumber,
        signature_data: signature,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      message: 'Verification data saved successfully',
      data
    })

  } catch (error) {
    console.error('Error saving verification data:', error)
    return NextResponse.json(
      { error: 'Failed to save verification data' },
      { status: 500 }
    )
  }
} 