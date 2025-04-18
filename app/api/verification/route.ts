import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const body = await request.json()

    const { 
      rental_id, 
      id_type, 
      id_number, 
      signature_data,
      id_image_url,
      selfie_image_url 
    } = body

    if (!rental_id || !id_type || !id_number || !signature_data) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Store verification data in the database
    const { data, error } = await supabase
      .from('rental_verifications')
      .insert({
        rental_id,
        id_type,
        id_number,
        signature_data,
        id_image_url,
        selfie_image_url,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Verification data saved successfully',
      data
    })

  } catch (error) {
    console.error('Error saving verification data:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save verification data' },
      { status: 500 }
    )
  }
} 