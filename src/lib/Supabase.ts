// Mock Supabase client - not used, keeping for compatibility
export const supabase = {
  from: (table: string) => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: null, error: null }),
    update: () => Promise.resolve({ data: null, error: null }),
    delete: () => Promise.resolve({ data: null, error: null }),
  }),
};

export type UserRole = 'admin' | 'detailer' | 'customer'
export type UserStatus = 'pending' | 'active' | 'suspended'

export interface User {
  id: string
  email: string
  role: UserRole
  status: UserStatus
  full_name?: string
  phone?: string
  created_at: string
  updated_at: string
}
