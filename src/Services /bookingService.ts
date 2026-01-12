import { supabase } from '../lib/supabase'

export interface Booking {
  id: string
  customer_id: string
  vehicle_id: string
  service_id: string
  assigned_detailer_id?: string
  status: 'requested' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'
  amount: number
  scheduled_at?: string
  started_at?: string
  completed_at?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface CreateBookingInput {
  vehicle_id: string
  service_id: string
  amount: number
  scheduled_at?: string
  notes?: string
}

export const bookingService = {
  async createBooking(input: CreateBookingInput): Promise<Booking> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        customer_id: user.id,
        ...input,
        status: 'requested',
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getBookings(filters?: {
    customerId?: string
    detailerId?: string
    status?: string
  }): Promise<Booking[]> {
    let query = supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })

    if (filters?.customerId) {
      query = query.eq('customer_id', filters.customerId)
    }
    if (filters?.detailerId) {
      query = query.eq('assigned_detailer_id', filters.detailerId)
    }
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async updateBookingStatus(
    bookingId: string,
    status: Booking['status'],
    additionalData?: Partial<Booking>
  ): Promise<Booking> {
    const updateData: any = { status, updated_at: new Date().toISOString() }

    if (status === 'in_progress') {
      updateData.started_at = new Date().toISOString()
    } else if (status === 'completed') {
      updateData.completed_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('bookings')
      .update({ ...updateData, ...additionalData })
      .eq('id', bookingId)
      .select()
      .single()

    if (error) throw error

    // Create transaction on completion
    if (status === 'completed' && data.assigned_detailer_id) {
      await this.createTransaction(bookingId, data.assigned_detailer_id, data.amount)
    }

    return data
  },

  async assignDetailer(bookingId: string, detailerId: string): Promise<Booking> {
    const { data, error } = await supabase
      .from('bookings')
      .update({
        assigned_detailer_id: detailerId,
        status: 'assigned',
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookingId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async createTransaction(
    bookingId: string,
    detailerId: string,
    amount: number
  ): Promise<void> {
    const { error } = await supabase.from('transactions').insert({
      booking_id: bookingId,
      detailer_id: detailerId,
      amount,
      status: 'pending',
    })

    if (error) throw error
  },
}
