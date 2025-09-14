import { NavLink } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/lib/utils';
import {
  Users,
  ClipboardList,
  Clock,
  Calendar,
  Stethoscope,
  CreditCard,
  TrendingUp,
  BarChart3,
  Settings
} from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { to: '/patients', label: 'Patients', icon: Users },
  { to: '/intake', label: 'Intake', icon: ClipboardList },
  { to: '/waiting-room', label: 'Waiting Room', icon: Clock },
  { to: '/calendar', label: 'Calendar', icon: Calendar },
  { to: '/clinical', label: 'Clinical', icon: Stethoscope },
  { to: '/billing', label: 'Billing', icon: CreditCard },
  { to: '/expenses', label: 'Expenses', icon: TrendingUp },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin', label: 'Admin', icon: Settings, adminOnly: true },
];

export default function Sidebar() {
  const { profile } = useAppStore();
  
  const filteredNavItems = navItems.filter(item => 
    !item.adminOnly || profile?.role === 'admin'
  );

  return (
    <aside className="w-64 bg-card border-r medical-shadow h-full">
      <nav className="p-6 space-y-2">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground'
                )
              }
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}