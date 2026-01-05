import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplets, User, Shield, Wrench, Mail, Phone, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { toast } from 'sonner';

type AuthMode = 'login' | 'signup';

const roles: { id: UserRole; label: string; description: string; icon: React.ElementType }[] = [
  { id: 'customer', label: 'Car Owner', description: 'Book a wash & earn rewards', icon: User },
  { id: 'operator', label: 'Detailer', description: 'Manage your jobs & tips', icon: Wrench },
  { id: 'admin', label: 'Car Wash Owner', description: 'Run your business', icon: Shield },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [isLoading, setIsLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    name: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedRole === 'operator' && !inviteCode && mode === 'login') {
      toast.error('Please enter your invite code');
      return;
    }

    if (mode === 'signup' && (!formData.email || !formData.phone)) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    login(selectedRole);
    toast.success('Welcome to Track Wash!');
    
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
            <Droplets className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold">TRACK WASH</span>
        </div>

        <Card variant="elevated" className="animate-slide-up">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <CardDescription>
              {mode === 'login' 
                ? 'Sign in to your account'
                : 'Join Nairobi\'s favorite car wash platform'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role Selection */}
              <div className="space-y-3">
                <Label>I am a...</Label>
                <div className="grid gap-2">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                        selectedRole === role.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                        selectedRole === role.id ? 'bg-primary/10' : 'bg-muted'
                      }`}>
                        <role.icon className={`h-5 w-5 ${
                          selectedRole === role.id ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{role.label}</p>
                        <p className="text-xs text-muted-foreground">{role.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Invite Code for Operators */}
              {selectedRole === 'operator' && mode === 'login' && (
                <div className="space-y-2 animate-fade-in">
                  <Label>Invite Code</Label>
                  <Input 
                    placeholder="Enter your invite code"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Get this from your car wash owner</p>
                </div>
              )}

              {/* Signup fields */}
              {mode === 'signup' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Kamau"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (M-Pesa)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+254 712 345 678"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
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
