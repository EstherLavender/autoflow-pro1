import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AdminOnboarding from './AdminOnboarding';
import OperatorOnboarding from './OperatorOnboarding';
import CustomerOnboarding from './CustomerOnboarding';

export default function OnboardingRouter() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Show role-specific onboarding
  switch (user.role) {
    case 'admin':
      return <AdminOnboarding />;
    case 'detailer':
      return <OperatorOnboarding />;
    case 'customer':
      return <CustomerOnboarding />;
    default:
      return <Navigate to="/login" replace />;
  }
}
