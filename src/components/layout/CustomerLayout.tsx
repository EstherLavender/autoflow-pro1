import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Droplets,
  LogOut,
  Menu,
  X,
  Home,
  CalendarPlus,
  History,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { cn } from '@/lib/utils';

// Import customer pages
import CustomerDashboard from '@/pages/customer/CustomerDashboard';
import BookServicePage from '@/pages/customer/BookServicePage';
import GaragesPage from '@/pages/customer/GaragesPage';
import RewardsPage from '@/pages/customer/RewardsPage';
import WashPage from '@/pages/customer/WashPage';

interface NavItem {
  label: string;
  icon: typeof Home;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Home', icon: Home, href: '/customer' },
  { label: 'Book Service', icon: CalendarPlus, href: '/customer/book' },
  { label: 'History', icon: History, href: '/customer/history' },
  { label: 'Profile', icon: User, href: '/customer/profile' },
];

export default function CustomerLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <Droplets className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-bold text-sm text-foreground">TRACK WASH</span>
              <p className="text-xs text-muted-foreground">Welcome back!</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            <div className="hidden md:flex items-center gap-3">
              <span className="text-sm font-medium text-foreground">{user?.email || user?.phone}</span>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>

            <div className="md:hidden h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              <span className="text-xs font-semibold text-foreground">
                {user?.email?.charAt(0).toUpperCase() || 'C'}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-border p-3 space-y-1 animate-slide-up bg-card">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                    isActive 
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 w-full"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        )}
      </header>

      {/* Desktop Navigation */}
      <nav className="hidden md:block sticky top-[57px] z-40 bg-card border-b border-border">
        <div className="container flex items-center gap-1 py-2 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                  isActive 
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="container py-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
        </div>

        {/* Page Content */}
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-all min-w-[60px]",
                  isActive 
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}