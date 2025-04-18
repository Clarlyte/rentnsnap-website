import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // First, get all equipment
    const { data: equipment, error: equipmentError } = await supabase
      .from('equipment')
      .select('equipment_id, name')
      .eq('is_active', true)

    if (equipmentError) {
      throw equipmentError
    }

    // Fetch rentals with customer and equipment details
    const { data: rentals, error } = await supabase
      .from('rentals')
      .select(`
        *,
        customers!rentals_customer_id_fkey (
          first_name,
          last_name
        ),
        rental_equipment (
          equipment_id,
          equipment (
            name,
            type
          )
        )
      `)
      .order('start_date', { ascending: true })

    if (error) {
      console.error('Error fetching calendar rentals:', error)
      throw error
    }

    // Format rentals into calendar events and group by equipment
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const formattedRentals = rentals.map(rental => ({
      id: rental.rental_id,
      customerName: rental.customers ? 
        `${rental.customers.first_name} ${rental.customers.last_name}` : 
        'Unknown Customer',
      equipment: rental.rental_equipment
        ?.map((re: { equipment_id: string; equipment?: { name: string; type: string } }) => ({
          id: re.equipment_id,
          name: re.equipment?.name
        })) || [],
      startDate: new Date(rental.start_date),
      endDate: new Date(rental.end_date),
      status: rental.status
    }))

    // Group rentals by equipment
    const rentalsByEquipment = equipment.reduce((acc: any, eq) => {
      acc[eq.equipment_id] = {
        name: eq.name,
        rentals: formattedRentals.filter(rental => 
          rental.equipment.some((e: { id: string }) => e.id === eq.equipment_id)
        )
      }
      return acc
    }, {})

    // Split rentals into today's schedule and upcoming returns
    const todaySchedule = formattedRentals.filter(rental => {
      const rentalDate = new Date(rental.startDate)
      rentalDate.setHours(0, 0, 0, 0)
      return rentalDate.getTime() === today.getTime()
    })

    const upcomingReturns = formattedRentals.filter(rental => {
      const endDate = new Date(rental.endDate)
      return endDate > today && rental.status === 'Reserved'
    }).sort((a, b) => a.endDate.getTime() - b.endDate.getTime())

    return NextResponse.json({
      todaySchedule,
      upcomingReturns,
      rentalsByEquipment
    })

  } catch (error) {
    console.error('Error handling calendar fetch:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch calendar data' },
      { status: 500 }
    )
  }
} 