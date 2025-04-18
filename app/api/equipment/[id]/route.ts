import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// Get equipment details and rental history
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Get equipment details with rental rates
    const { data: equipment, error: equipmentError } = await supabase
      .from('equipment')
      .select(`
        *,
        rental_rates (
          rental_rate_id,
          min_days,
          max_days,
          daily_rate
        )
      `)
      .eq('equipment_id', params.id)
      .single()

    if (equipmentError) throw equipmentError

    // Get rental history
    const { data: rentalHistory, error: historyError } = await supabase
      .from('rental_equipment')
      .select(`
        rental_id,
        rentals (
          rental_id,
          start_date,
          end_date,
          total_price,
          status,
          customers (
            first_name,
            last_name
          )
        )
      `)
      .eq('equipment_id', params.id)
      .order('created_at', { ascending: false })

    if (historyError) throw historyError

    // Format rental history
    const formattedHistory = rentalHistory
      .filter(item => item.rentals) // Filter out any null rentals
      .map(item => ({
        rental_id: item.rentals.rental_id,
        customer_name: `${item.rentals.customers.first_name} ${item.rentals.customers.last_name}`,
        start_date: item.rentals.start_date,
        end_date: item.rentals.end_date,
        amount: item.rentals.total_price,
        status: item.rentals.status
      }))

    return NextResponse.json({
      equipment,
      rental_history: formattedHistory
    })

  } catch (error) {
    console.error('Error fetching equipment details:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch equipment details' },
      { status: 500 }
    )
  }
}

// Update equipment
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const body = await request.json()

    const {
      name,
      type,
      description,
      status,
      quantity_available,
      image_url,
      notes,
      is_active,
      rental_rates
    } = body

    // Update equipment
    const { data: equipment, error: equipmentError } = await supabase
      .from('equipment')
      .update({
        name,
        type,
        description,
        status,
        quantity_available,
        image_url,
        notes,
        is_active,
        updated_at: new Date().toISOString()
      })
      .eq('equipment_id', params.id)
      .select()
      .single()

    if (equipmentError) throw equipmentError

    // Update rental rates if provided
    if (rental_rates && rental_rates.length > 0) {
      // Delete existing rates
      const { error: deleteError } = await supabase
        .from('rental_rates')
        .delete()
        .eq('equipment_id', params.id)

      if (deleteError) throw deleteError

      // Insert new rates
      const { error: ratesError } = await supabase
        .from('rental_rates')
        .insert(
          rental_rates.map((rate: any) => ({
            equipment_id: params.id,
            min_days: rate.min_days,
            max_days: rate.max_days,
            daily_rate: rate.daily_rate
          }))
        )

      if (ratesError) throw ratesError
    }

    return NextResponse.json(equipment)

  } catch (error) {
    console.error('Error updating equipment:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update equipment' },
      { status: 500 }
    )
  }
}

// Delete equipment
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Check if equipment has any active rentals
    const { data: activeRentals, error: checkError } = await supabase
      .from('rental_equipment')
      .select(`
        rental_id,
        rentals!inner (
          rental_id,
          status
        )
      `)
      .eq('equipment_id', params.id)
      .filter('rentals.status', 'in', '("Reserved","Rented")')

    if (checkError) throw checkError

    if (activeRentals && activeRentals.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete equipment that has active or reserved rentals' },
        { status: 400 }
      )
    }

    // Delete in the correct order to handle foreign key constraints
    // 1. Delete rental rates
    const { error: ratesError } = await supabase
      .from('rental_rates')
      .delete()
      .eq('equipment_id', params.id)

    if (ratesError) throw ratesError

    // 2. Delete rental equipment associations
    const { error: rentalEquipError } = await supabase
      .from('rental_equipment')
      .delete()
      .eq('equipment_id', params.id)

    if (rentalEquipError) throw rentalEquipError

    // 3. Finally delete the equipment
    const { error: deleteError } = await supabase
      .from('equipment')
      .delete()
      .eq('equipment_id', params.id)

    if (deleteError) throw deleteError

    return NextResponse.json({ message: 'Equipment deleted successfully' })

  } catch (error) {
    console.error('Error deleting equipment:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete equipment' },
      { status: 500 }
    )
  }
} 