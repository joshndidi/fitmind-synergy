import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWorkout } from "../hooks/useWorkout";
import { 
  Activity, 
  Home, 
  Brain, 
  User, 
  Dumbbell, 
  CreditCard, 
  Music, 
  Users, 
  Award, 
  Menu, 
  X,
  Shield,
  Trophy,
  Medal,
  Settings,
  Flame,
  LayoutTemplate,
  BarChart
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const NavBar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: <Home size={20} /> },
    { name: "Workouts", path: "/workouts", icon: <Dumbbell size={20} /> },
    { name: "Templates", path: "/templates", icon: <LayoutTemplate size={20} /> },
    { name: "Workout AI", path: "/workout-ai", icon: <Brain size={20} /> },
    { name: "Calories", path: "/calories", icon: <Flame size={20} /> },
    { name: "Social", path: "/social", icon: <Users size={20} /> },
    { name: "Achievements", path: "/achievements", icon: <Medal size={20} /> },
    { name: "Leaderboard", path: "/leaderboard", icon: <Trophy size={20} /> },
    { name: "Stats", path: "/stats", icon: <BarChart size={20} /> },
    { name: "Profile", path: "/profile", icon: <User size={20} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={20} /> },
  ];

  return (
    <nav className={`sticky top-0 z-50 backdrop-blur-xl transition-all duration-300 ${scrolled ? 'bg-black/60 shadow-lg' : 'bg-black/30'}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <Dumbbell className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl text-text-light">FitMind</span>
            {user?.isAdmin && (
              <div className="flex items-center ml-2 bg-amber-600 text-white text-xs px-2 py-1 rounded-full">
                <Shield size={12} className="mr-1" />
                <span>Admin</span>
              </div>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  location.pathname === link.path
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                )}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Mobile Navigation Toggle */}
          <button 
            className="md:hidden text-text-light"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="md:hidden pt-4 pb-2 animate-fade-in">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    location.pathname === link.path
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              ))}
              <Button variant="ghost" size="sm" onClick={handleLogout} className="mt-4">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
