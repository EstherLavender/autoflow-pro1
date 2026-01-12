import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplets, User, Shield, Wrench, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

type AuthMode = 'login' | 'signup';
type UserRole = 'customer' | 'detailer' | 'admin';

const roles: { id: UserRole; label: string; description: string; icon: React.ElementType }[] = [
  { id: 'customer', label: 'Car Owner', description: 'Book a wash & earn rewards', icon: User },
  { id: 'detailer', label: 'Detailer', description: 'Manage your jobs & tips', icon: Wrench },
  { id: 'admin', label: 'Car Wash Owner', description: 'Run your business', icon: Shield },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
    name: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        // Validate signup fields
        if (!formData.email || !formData.password || !formData.name) {
          toast.error('Please fill in all fields');
          setIsLoading(false);
          return;
        }

        await signUp(formData.email, formData.password, selectedRole, formData.name, formData.phone);
        
        if (selectedRole === 'customer') {
          toast.success('Account created! Welcome to AutoFlow Pro 🎉');
          navigate('/customer');
        } else {
          toast.success('Account created! Awaiting admin approval.');
          navigate('/pending-approval');
        }
      } else {
        // Login
        if (!formData.email || !formData.password) {
          toast.error('Please enter your email and password');
          setIsLoading(false);
          return;
        }

        await signIn(formData.email, formData.password);
        toast.success('Welcome back!');
        
        // Navigation is handled by the router based on user role
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Something went wrong';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
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
                : "Join Nairobi's favorite car wash platform"
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role Selection - Only for signup */}
              {mode === 'signup' && (
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
              )}

              {/* Login/Signup fields */}
              <div className="space-y-4">
                {mode === 'signup' && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Kamau"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={mode === 'login' ? 'Enter your password' : 'Choose a password (min 6 characters)'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    minLength={6}
                    required
                  />
                </div>
                
                {mode === 'signup' && (
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+254 712 345 678"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                )}
              </div>

              {/* Demo accounts hint */}
              {mode === 'login' && (
                <div className="bg-muted/50 p-3 rounded-lg text-xs text-muted-foreground">
                  <p className="font-medium mb-1">Demo account:</p>
                  <p>👑 Admin: admin@autoflow.com</p>
                  <p>🔑 Password: admin123</p>
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
