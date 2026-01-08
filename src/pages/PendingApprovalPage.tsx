import { useNavigate } from 'react-router-dom';
import { Clock, LogOut, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

export default function PendingApprovalPage() {
  const navigate = useNavigate();
  const { user, logout, refreshUser } = useAuth();

  // Check approval status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      refreshUser();
    }, 5000);

    return () => clearInterval(interval);
  }, [refreshUser]);

  // Redirect if approved
  useEffect(() => {
    if (user?.status === 'active' && user?.onboardingStatus === 'complete') {
      const routes = {
        admin: '/admin',
        operator: '/operator',
        customer: '/customer',
      };
      navigate(routes[user.role], { replace: true });
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleMessage = () => {
    switch (user?.role) {
      case 'admin':
        return 'Your car wash owner account is under review. Our team will verify your details and activate your account within 24-48 hours.';
      case 'operator':
        return 'Your detailer account is awaiting approval from a car wash owner. They will review your profile and grant you access.';
      default:
        return 'Your account is pending approval.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--gradient-hero)' }}>
      <div className="w-full max-w-md">
        <Card variant="elevated" className="text-center">
          <CardHeader>
            <div className="mx-auto h-16 w-16 rounded-full bg-warning/10 flex items-center justify-center mb-4">
              <Clock className="h-8 w-8 text-warning" />
            </div>
            <CardTitle className="text-2xl">Pending Approval</CardTitle>
            <CardDescription className="text-base mt-2">
              {getRoleMessage()}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Account:</strong> {user?.email || user?.phone}
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Role:</strong> {user?.role === 'admin' ? 'Car Wash Owner' : user?.role === 'operator' ? 'Detailer' : 'Customer'}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Button 
                variant="outline" 
                onClick={refreshUser}
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Check Status
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="w-full"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Need help? Contact us at support@trackwash.co.ke
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
