import { useState } from 'react';
import { Car, Mail, Phone, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { toast } from 'sonner';

type AuthMode = 'login' | 'signup';
type LoginMethod = 'email' | 'phone';

const roleDescriptions = {
  admin: 'Manage your business, staff, and analytics',
  operator: 'Handle daily jobs and service tasks',
  customer: 'Track your vehicles and services',
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [method, setMethod] = useState<LoginMethod>('phone');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    name: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    login(selectedRole);
    toast.success(`Welcome! Logged in as ${selectedRole}`);
    
    // Navigate to appropriate dashboard
    const routes: Record<UserRole, string> = {
      admin: '/admin',
      operator: '/operator',
      customer: '/customer',
    };
    navigate(routes[selectedRole]);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--gradient-hero)' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center shadow-glow">
            <Car className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold">X402 CareCare</span>
        </div>

        <Card variant="elevated" className="animate-slide-up">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <CardDescription>
              {mode === 'login' 
                ? 'Sign in to manage your car business'
                : 'Start your free trial today'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role Selection */}
              <div className="space-y-2">
                <Label>I am a...</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(['customer', 'operator', 'admin'] as UserRole[]).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setSelectedRole(role)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                        selectedRole === role
                          ? 'bg-primary text-primary-foreground border-primary shadow-md'
                          : 'bg-card border-border hover:border-primary/50'
                      }`}
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  {roleDescriptions[selectedRole]}
                </p>
              </div>

              {/* Login Method Toggle */}
              <div className="flex rounded-lg bg-muted p-1">
                <button
                  type="button"
                  onClick={() => setMethod('phone')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${
                    method === 'phone' ? 'bg-card shadow-sm' : ''
                  }`}
                >
                  <Phone className="h-4 w-4" />
                  Phone
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('email')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${
                    method === 'email' ? 'bg-card shadow-sm' : ''
                  }`}
                >
                  <Mail className="h-4 w-4" />
                  Email
                </button>
              </div>

              {/* Name (Signup only) */}
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Kamau"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              )}

              {/* Phone/Email Input */}
              {method === 'phone' ? (
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+254 712 345 678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              )}

              <Button 
                type="submit" 
                variant="hero" 
                size="lg" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  type="button"
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  className="text-primary font-medium hover:underline"
                >
                  {mode === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Button variant="ghost" onClick={() => navigate('/')}>
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
