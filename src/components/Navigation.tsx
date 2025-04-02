
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import {
  Home,
  Dumbbell,
  Brain,
  Flame,
  Users,
  Trophy,
  Settings,
  Medal,
  LogOut
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Workouts', href: '/workouts', icon: Dumbbell },
  { name: 'Workout AI', href: '/workout-ai', icon: Brain },
  { name: 'Calories', href: '/calories', icon: Flame },
  { name: 'Social', href: '/social', icon: Users },
  { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
  { name: 'Achievements', href: '/achievements', icon: Medal },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Navigation() {
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="flex flex-col space-y-1">
      {navigation.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              'flex items-center px-4 py-2 text-sm font-medium rounded-md',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </Link>
        );
      })}
      <button
        className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        onClick={handleLogout}
      >
        <LogOut className="mr-3 h-5 w-5" />
        Logout
      </button>
    </nav>
  );
} 
