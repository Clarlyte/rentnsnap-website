import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { status, voidAmount, cancellationReason, cancelledAt } = await request.json()

    const supabase = createRouteHandlerClient({ cookies })

    // Update the rental first
    const { data: rental, error: rentalError } = await supabase
      .from('rentals')
      .update({
        status,
        void_amount: voidAmount,
        updated_at: new Date().toISOString()
      })
      .eq('rental_id', id)
      .select()
      .single()

    if (rentalError) {
      console.error('Error updating rental:', rentalError)
      throw rentalError
    }

    // If status is Cancelled, create a cancellation record
    if (status === 'Cancelled') {
      const { error: cancellationError } = await supabase
        .from('rental_cancellations')
        .insert({
          rental_id: id,
          void_amount: voidAmount,
          reason: cancellationReason || 'Customer requested cancellation',
          cancelled_at: cancelledAt || new Date().toISOString(),
          created_at: new Date().toISOString()
        })

      if (cancellationError) {
        console.error('Error creating cancellation record:', cancellationError)
        // Rollback rental status if cancellation insert fails
        await supabase
          .from('rentals')
          .update({
            status: 'Reserved',
            void_amount: null,
            updated_at: new Date().toISOString()
          })
          .eq('rental_id', id)

        throw cancellationError
      }
    }

    return NextResponse.json({ 
      message: 'Rental updated successfully',
      rental 
    })
  } catch (error) {
    console.error('Error updating rental:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update rental' },
      { status: 500 }
    )
  }
} 