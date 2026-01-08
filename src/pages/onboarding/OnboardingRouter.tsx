import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AdminOnboarding from './AdminOnboarding';
import OperatorOnboarding from './OperatorOnboarding';
import CustomerOnboarding from './CustomerOnboarding';

export default function OnboardingRouter() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If onboarding is already complete, redirect to appropriate page
  if (user.onboardingStatus === 'complete') {
    if (user.status === 'pending') {
      return <Navigate to="/pending-approval" replace />;
    }
    
    const routes = {
      admin: '/admin',
      operator: '/operator',
      customer: '/customer',
    };
    return <Navigate to={routes[user.role]} replace />;
  }

  // Show role-specific onboarding
  switch (user.role) {
    case 'admin':
      return <AdminOnboarding />;
    case 'operator':
      return <OperatorOnboarding />;
    case 'customer':
      return <CustomerOnboarding />;
    default:
      return <Navigate to="/login" replace />;
  }
}
