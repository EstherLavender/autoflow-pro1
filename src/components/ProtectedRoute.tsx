import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

type UserRole = 'admin' | 'detailer' | 'customer'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth()

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Not authenticated
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Check status
  if (user.status === 'pending') {
    return <Navigate to="/pending-approval" replace />
  }

  if (user.status === 'suspended') {
    return <Navigate to="/login" replace />
  }

  // Check role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />
  }

  // All checks passed
  return <>{children}</>
}
