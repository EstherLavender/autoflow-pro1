import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Car,
  LogOut,
  Menu,
  X,
  ClipboardList,
  History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  icon: typeof LayoutDashboard;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'My Jobs', icon: ClipboardList, href: '/operator' },
  { label: 'Completed', icon: History, href: '/operator/completed' },
];

interface OperatorLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export default function OperatorLayout({ children, title, subtitle }: OperatorLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <Car className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-bold text-sm">TRACK WASH</span>
              <p className="text-xs text-muted-foreground">Detailer</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
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

            <Button variant="ghost" size="icon-sm" className="sm:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center ml-2">
              <span className="text-xs font-semibold text-accent-foreground">
                {user?.email?.charAt(0).toUpperCase() || 'O'}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="sm:hidden border-t border-border p-3 space-y-1 animate-slide-up">
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

      {/* Main Content */}
      <main className="container py-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{title}</h1>
          {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
        </div>

        {/* Page Content */}
        {children}
      </main>
    </div>
  );
}
