import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Settings,
  Droplets,
  LogOut,
  Menu,
  X,
  AlertTriangle,
  Package,
  Gift,
  Wrench
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { cn } from '@/lib/utils';

// Import owner pages (same as admin but without Approvals)
import OwnerDashboard from '@/pages/owner/AdminDashboard';
import UsersPage from '@/pages/owner/UsersPage';
import PaymentsPage from '@/pages/owner/PaymentsPage';
import DisputesPage from '@/pages/owner/DisputesPage';
import ServicesPage from '@/pages/owner/ServicesPage';
import InventoryPage from '@/pages/owner/InventoryPage';
import LoyaltyPage from '@/pages/owner/LoyaltyPage';
import SettingsPage from '@/pages/owner/SettingsPage';

interface NavItem {
  label: string;
  icon: typeof LayoutDashboard;
  href: string;
}

export default function OwnerLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems: NavItem[] = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/owner' },
    { label: 'Services', icon: Wrench, href: '/owner/services' },
    { label: 'Users', icon: Users, href: '/owner/users' },
    { label: 'Payments', icon: CreditCard, href: '/owner/payments' },
    { label: 'Inventory', icon: Package, href: '/owner/inventory' },
    { label: 'Loyalty', icon: Gift, href: '/owner/loyalty' },
    { label: 'Disputes', icon: AlertTriangle, href: '/owner/disputes' },
    { label: 'Settings', icon: Settings, href: '/owner/settings' },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Droplets className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground">TRACK WASH</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </header>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-background/80 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full w-64 bg-sidebar-background border-r border-sidebar-border transition-transform duration-300 lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-5 border-b border-sidebar-border">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                <Droplets className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <span className="font-bold text-sidebar-foreground">TRACK WASH</span>
                <p className="text-xs text-muted-foreground">Owner Dashboard</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                    isActive 
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-sidebar-accent flex items-center justify-center">
                <span className="text-sm font-semibold text-sidebar-accent-foreground">
                  {user?.email?.charAt(0).toUpperCase() || 'O'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user?.full_name || user?.email || 'Car Wash Owner'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  Business Owner
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-muted-foreground hover:text-foreground"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64">
        <div className="p-4 md:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<OwnerDashboard />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/loyalty" element={<LoyaltyPage />} />
            <Route path="/disputes" element={<DisputesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
