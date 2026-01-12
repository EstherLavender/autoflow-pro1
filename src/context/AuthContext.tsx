import React, { createContext, useContext, useEffect, useState } from 'react'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { supabase, User } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  supabaseUser: SupabaseUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, role: string, fullName: string) => Promise<void>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data as User
  }

  const refreshUser = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    
    if (authUser) {
      const profile = await fetchUserProfile(authUser.id)
      setUser(profile)
      setSupabaseUser(authUser)
    } else {
      setUser(null)
      setSupabaseUser(null)
    }
  }

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        try {
          const profile = await fetchUserProfile(session.user.id)
          setUser(profile)
          setSupabaseUser(session.user)
        } catch (error) {
          console.error('Error fetching user profile:', error)
        }
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          try {
            const profile = await fetchUserProfile(session.user.id)
            setUser(profile)
            setSupabaseUser(session.user)
          } catch (error) {
            console.error('Error fetching user profile:', error)
          }
        } else {
          setUser(null)
          setSupabaseUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error

    const profile = await fetchUserProfile(data.user.id)
    setUser(profile)
    setSupabaseUser(data.user)
  }

  const signUp = async (
    email: string,
    password: string,
    role: string,
    fullName: string
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error
    if (!data.user) throw new Error('No user returned')

    // Create user profile
    const { error: profileError } = await supabase.from('users').insert({
      id: data.user.id,
      email,
      role,
      full_name: fullName,
      status: 'pending',
    })

    if (profileError) throw profileError
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
    setSupabaseUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, supabaseUser, loading, signIn, signUp, signOut, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
