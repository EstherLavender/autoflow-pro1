import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'

// Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import NotFound from './pages/NotFound'
import PendingApprovalPage from './pages/PendingApprovalPage'
import OnboardingRouter from './pages/onboarding/OnboardingRouter'

// Role-specific layouts
import AdminLayout from './components/layout/AdminLayout'
import OwnerLayout from './components/layout/OwnerLayout'
import OperatorLayout from './components/layout/OperatorLayout'
import CustomerLayout from './components/layout/CustomerLayout'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/pending-approval" element={<PendingApprovalPage />} />
          <Route path="/onboarding" element={<OnboardingRouter />} />

          {/* Protected routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/*"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <OwnerLayout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/operator/*"
            element={
              <ProtectedRoute allowedRoles={['detailer']}>
                <OperatorLayout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/*"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CustomerLayout />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
