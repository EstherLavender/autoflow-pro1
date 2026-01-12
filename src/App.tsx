import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'

// Pages
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import PendingApprovalPage from './pages/PendingApprovalPage'
import UnauthorizedPage from './pages/UnauthorizedPage'
import SuspendedPage from './pages/SuspendedPage'

// Role-specific layouts
import AdminLayout from './layouts/AdminLayout'
import DetailerLayout from './layouts/DetailerLayout'
import CustomerLayout from './layouts/CustomerLayout'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/pending-approval" element={<PendingApprovalPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/suspended" element={<SuspendedPage />} />

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
            path="/detailer/*"
            element={
              <ProtectedRoute allowedRoles={['detailer']}>
                <DetailerLayout />
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

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
