import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Fetch rentals with all related data in a single query
    const { data: rentals, error } = await supabase
      .from('rentals')
      .select(`
        *,
        customers!rentals_customer_id_fkey (
          first_name,
          last_name,
          email,
          phone
        ),
        rental_equipment (
          equipment (
            name,
            type,
            rental_rates (
              daily_rate
            )
          )
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching rentals:', error)
      throw error
    }

    // Format the data for the frontend
    const formattedRentals = rentals.map(rental => {
      // Get equipment names and their lowest daily rates
      const equipmentList = rental.rental_equipment?.map((re: any) => {
        const equipment = re.equipment
        // Get the lowest daily rate from rental_rates
        const lowestRate = equipment?.rental_rates?.reduce((min: number, rate: any) => 
          rate.daily_rate < min ? rate.daily_rate : min,
          equipment.rental_rates[0]?.daily_rate || 0
        ) || 0
        
        return {
          name: equipment?.name,
          rate: lowestRate
        }
      }) || []

      return {
        id: rental.rental_id,
        customerName: rental.customers ? 
          `${rental.customers.first_name} ${rental.customers.last_name}` : 
          'Unknown Customer',
        customerEmail: rental.customers?.email,
        customerPhone: rental.customers?.phone,
        equipment: equipmentList
          .map((e: { name: string; rate: number }) => e.name)
          .filter(Boolean)
          .join(', ') || 'No equipment',
        startDate: new Date(rental.start_date).toLocaleDateString(),
        endDate: new Date(rental.end_date).toLocaleDateString(),
        status: rental.status,
        amount: rental.total_price
      }
    })

    console.log('Fetched rentals:', formattedRentals)
    return NextResponse.json(formattedRentals)

  } catch (error) {
    console.error('Error handling rental fetch:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch rentals' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const body = await request.json()
    
    console.log('Received rental data:', body)

    // Convert time strings to proper format (e.g., "9am" to "09:00:00")
    const formatTime = (timeStr: string) => {
      const hour = parseInt(timeStr.replace(/[ap]m/, ''))
      const isPM = timeStr.includes('pm')
      const hour24 = isPM ? (hour === 12 ? 12 : hour + 12) : (hour === 12 ? 0 : hour)
      return `${hour24.toString().padStart(2, '0')}:00:00`
    }

    // Parse start and end dates
    const startDateTime = new Date(body.start_date)
    const endDateTime = new Date(body.end_date)
    
    // Format dates for database
    const start_date = startDateTime.toISOString()
    const end_date = endDateTime.toISOString()

    const { data: rental, error: rentalError } = await supabase
      .from('rentals')
      .insert({
        customer_id: body.customer_id,
        start_date,
        end_date,
        status: body.status || 'Pending',
        total_price: body.total_price,
        notes: body.notes,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (rentalError) {
      console.error('Error creating rental:', rentalError)
      throw rentalError
    }

    console.log('Rental created:', rental)
    return NextResponse.json(rental)
  } catch (error) {
    console.error('Error handling rental:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create rental' },
      { status: 500 }
    )
  }
} 