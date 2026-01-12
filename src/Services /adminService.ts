import { supabase } from '../lib/supabase'
import { User, UserStatus } from '../lib/supabase'

export const adminService = {
  async getPendingUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async updateUserStatus(userId: string, status: UserStatus): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async approveUser(userId: string): Promise<User> {
    return this.updateUserStatus(userId, 'active')
  },

  async rejectUser(userId: string): Promise<void> {
    // Delete user from auth and users table
    const { error } = await supabase.auth.admin.deleteUser(userId)
    if (error) throw error
  },

  async suspendUser(userId: string): Promise<User> {
    return this.updateUserStatus(userId, 'suspended')
  },

  async getStats() {
    const [
      { count: totalBookings },
      { count: pendingUsers },
      { count: activeDetailers },
      { data: recentBookings },
    ] = await Promise.all([
      supabase.from('bookings').select('*', { count: 'exact', head: true }),
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'detailer').eq('status', 'active'),
      supabase.from('bookings').select('*').order('created_at', { ascending: false }).limit(10),
    ])

    return {
      totalBookings: totalBookings || 0,
      pendingUsers: pendingUsers || 0,
      activeDetailers: activeDetailers || 0,
      recentBookings: recentBookings || [],
    }
  },
}
