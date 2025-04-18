import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

interface RentalData {
  rental_id: string
  rentals: {
    start_date: string
    end_date: string
    status: string
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const body = await request.json()

    console.log('Creating rental-equipment association:', body)

    if (!body.rental_id || !body.equipment_id) {
      throw new Error('Missing required fields: rental_id and equipment_id are required')
    }

    // Get the rental dates
    const { data: rental, error: rentalError } = await supabase
      .from('rentals')
      .select('start_date, end_date')
      .eq('rental_id', body.rental_id)
      .single()

    if (rentalError) {
      console.error('Error fetching rental:', rentalError)
      throw rentalError
    }

    // Check if equipment is available for the time slot
    const { data: existingRentals, error: checkError } = await supabase
      .from('rental_equipment')
      .select(`
        rental_id,
        rentals!inner (
          start_date,
          end_date,
          status
        )
      `)
      .eq('equipment_id', body.equipment_id)
      .neq('rentals.status', 'Cancelled')
      .neq('rentals.status', 'Completed')

    if (checkError) {
      console.error('Error checking equipment availability:', checkError)
      throw checkError
    }

    // Check for time slot conflicts
    const hasConflict = (existingRentals as unknown as RentalData[]).some(existing => {
      const existingStart = new Date(existing.rentals.start_date)
      const existingEnd = new Date(existing.rentals.end_date)
      const newStart = new Date(rental.start_date)
      const newEnd = new Date(rental.end_date)

      return !(newEnd <= existingStart || newStart >= existingEnd)
    })

    if (hasConflict) {
      return NextResponse.json(
        { error: 'Equipment is not available for the selected time slot' },
        { status: 400 }
      )
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