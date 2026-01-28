import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  LayoutGrid,
  CalendarDays,
  CreditCard,
  Receipt,
  User,
  LogOut,
  ExternalLink,
  FolderKanban,
} from 'lucide-react';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { cn } from '@/lib/utils';
import logo from '/Geek247 Logo.png';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/portal' },
  { icon: FolderKanban, label: 'Projects', path: '/portal/projects' },
  { icon: LayoutGrid, label: 'Services', path: '/portal/services' },
  { icon: CalendarDays, label: 'Book Meeting', path: '/portal/book-meeting' },
  { icon: CreditCard, label: 'Subscriptions', path: '/portal/subscriptions' },
  { icon: Receipt, label: 'Payments', path: '/portal/payments' },
  { icon: User, label: 'Profile', path: '/portal/profile' },
];

export function PortalSidebar() {
  const location = useLocation();
  const { signOut } = useUserAuth();

  const isActive = (path: string) => {
    if (path === '/portal') return location.pathname === '/portal';
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <Link to="/portal" className="flex items-center">
          <img src={logo} alt="Geek247" className="h-12 w-auto" />
        </Link>
        <p className="text-xs text-muted-foreground mt-2">Customer Portal</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
              isActive(item.path)
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-border space-y-1">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <ExternalLink className="w-5 h-5" />
          View Website
        </Link>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
