import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import PendingApprovalPage from "./pages/PendingApprovalPage";
import OnboardingRouter from "./pages/onboarding/OnboardingRouter";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ServicesPage from "./pages/admin/ServicesPage";
import InventoryPage from "./pages/admin/InventoryPage";
import PaymentsPage from "./pages/admin/PaymentsPage";
import LoyaltyPage from "./pages/admin/LoyaltyPage";
import ApprovalsPage from "./pages/admin/ApprovalsPage";

// Operator Pages
import OperatorDashboard from "./pages/operator/OperatorDashboard";

// Customer Pages
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import BookServicePage from "./pages/customer/BookServicePage";
import RewardsPage from "./pages/customer/RewardsPage";
import GaragesPage from "./pages/customer/GaragesPage";
import WashPage from "./pages/customer/WashPage";

const queryClient = new QueryClient();

// Protected route wrapper with onboarding & approval checks
function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if onboarding is complete
  if (user.onboardingStatus === 'incomplete') {
    return <Navigate to="/onboarding" replace />;
  }

  // Check if pending approval (for admin/operator)
  if (user.status === 'pending' && (user.role === 'admin' || user.role === 'operator')) {
    return <Navigate to="/pending-approval" replace />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    // Redirect to their own dashboard instead of home
    const routes = {
      admin: '/admin',
      operator: '/operator',
      customer: '/customer',
    };
    return <Navigate to={routes[user.role]} replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/onboarding" element={<OnboardingRouter />} />
      <Route path="/pending-approval" element={<PendingApprovalPage />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/services" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <ServicesPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/inventory" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <InventoryPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/payments" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <PaymentsPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/loyalty" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <LoyaltyPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/approvals" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <ApprovalsPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/staff" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/analytics" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/settings" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      
      {/* Operator Routes */}
      <Route path="/operator" element={
        <ProtectedRoute allowedRoles={['operator']}>
          <OperatorDashboard />
        </ProtectedRoute>
      } />
      <Route path="/operator/completed" element={
        <ProtectedRoute allowedRoles={['operator']}>
          <OperatorDashboard />
        </ProtectedRoute>
      } />
      
      {/* Customer Routes */}
      <Route path="/customer" element={
        <ProtectedRoute allowedRoles={['customer']}>
          <CustomerDashboard />
        </ProtectedRoute>
      } />
      <Route path="/customer/vehicles" element={
        <ProtectedRoute allowedRoles={['customer']}>
          <CustomerDashboard />
        </ProtectedRoute>
      } />
      <Route path="/customer/book" element={
        <ProtectedRoute allowedRoles={['customer']}>
          <BookServicePage />
        </ProtectedRoute>
      } />
      <Route path="/customer/history" element={
        <ProtectedRoute allowedRoles={['customer']}>
          <CustomerDashboard />
        </ProtectedRoute>
      } />
      <Route path="/customer/rewards" element={
        <ProtectedRoute allowedRoles={['customer']}>
          <RewardsPage />
        </ProtectedRoute>
      } />
      <Route path="/customer/garages" element={
        <ProtectedRoute allowedRoles={['customer']}>
          <GaragesPage />
        </ProtectedRoute>
      } />
      <Route path="/customer/wash" element={
        <ProtectedRoute allowedRoles={['customer']}>
          <WashPage />
        </ProtectedRoute>
      } />
      
      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
