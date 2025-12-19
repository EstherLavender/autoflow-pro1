import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { WalletProvider } from "@/context/WalletContext";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ServicesPage from "./pages/admin/ServicesPage";
import InventoryPage from "./pages/admin/InventoryPage";
import PaymentsPage from "./pages/admin/PaymentsPage";
import LoyaltyPage from "./pages/admin/LoyaltyPage";
import OffRampPage from "./pages/admin/OffRampPage";

// Operator Pages
import OperatorDashboard from "./pages/operator/OperatorDashboard";

// Customer Pages
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import BookServicePage from "./pages/customer/BookServicePage";
import RewardsPage from "./pages/customer/RewardsPage";
import InvoicesPage from "./pages/customer/InvoicesPage";
import NotificationsPage from "./pages/customer/NotificationsPage";
import DiagnosePage from "./pages/customer/DiagnosePage";
import GaragesPage from "./pages/customer/GaragesPage";
import WashPage from "./pages/customer/WashPage";

const queryClient = new QueryClient();

// Protected route wrapper
function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      
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
      <Route path="/admin/off-ramp" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <OffRampPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/loyalty" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <LoyaltyPage />
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
      <Route path="/customer/invoices" element={
        <ProtectedRoute allowedRoles={['customer']}>
          <InvoicesPage />
        </ProtectedRoute>
      } />
      <Route path="/customer/notifications" element={
        <ProtectedRoute allowedRoles={['customer']}>
          <NotificationsPage />
        </ProtectedRoute>
      } />
      <Route path="/customer/diagnose" element={
        <ProtectedRoute allowedRoles={['customer']}>
          <DiagnosePage />
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
      <Route path="/customer/rescue" element={
        <ProtectedRoute allowedRoles={['customer']}>
          <CustomerDashboard />
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
      <WalletProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </WalletProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
