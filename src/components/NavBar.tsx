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

  // Don't render the navbar if user is not logged in
  if (!user) {
    return null;
  }

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled ? "bg-black/60 backdrop-blur-lg shadow-lg" : "bg-black/30"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <Dumbbell className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl text-text-light">FitMind</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/dashboard"
              className={cn(
                "text-sm font-medium transition-colors",
                location.pathname === "/dashboard"
                  ? "text-primary"
                  : "text-text-muted hover:text-text-light"
              )}
            >
              Dashboard
            </Link>
            <Link
              to="/workouts"
              className={cn(
                "text-sm font-medium transition-colors",
                location.pathname === "/workouts"
                  ? "text-primary"
                  : "text-text-muted hover:text-text-light"
              )}
            >
              Workouts
            </Link>
            <Link
              to="/workout-ai"
              className={cn(
                "text-sm font-medium transition-colors",
                location.pathname === "/workout-ai"
                  ? "text-primary"
                  : "text-text-muted hover:text-text-light"
              )}
            >
              AI Workouts
            </Link>
            <Link
              to="/calories"
              className={cn(
                "text-sm font-medium transition-colors",
                location.pathname === "/calories"
                  ? "text-primary"
                  : "text-text-muted hover:text-text-light"
              )}
            >
              Calories
            </Link>
            <Link
              to="/social"
              className={cn(
                "text-sm font-medium transition-colors",
                location.pathname === "/social"
                  ? "text-primary"
                  : "text-text-muted hover:text-text-light"
              )}
            >
              Social
            </Link>
            <Link
              to="/achievements"
              className={cn(
                "text-sm font-medium transition-colors",
                location.pathname === "/achievements"
                  ? "text-primary"
                  : "text-text-muted hover:text-text-light"
              )}
            >
              Achievements
            </Link>
            <Link
              to="/leaderboard"
              className={cn(
                "text-sm font-medium transition-colors",
                location.pathname === "/leaderboard"
                  ? "text-primary"
                  : "text-text-muted hover:text-text-light"
              )}
            >
              Leaderboard
            </Link>
            <Link
              to="/profile"
              className={cn(
                "text-sm font-medium transition-colors",
                location.pathname === "/profile"
                  ? "text-primary"
                  : "text-text-muted hover:text-text-light"
              )}
            >
              Profile
            </Link>
            <Link
              to="/settings"
              className={cn(
                "text-sm font-medium transition-colors",
                location.pathname === "/settings"
                  ? "text-primary"
                  : "text-text-muted hover:text-text-light"
              )}
            >
              Settings
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-text-muted hover:text-text-light"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-text-muted hover:text-text-light"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2 bg-black/60 backdrop-blur-lg rounded-lg mt-2">
            <Link
              to="/dashboard"
              className={cn(
                "block px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                location.pathname === "/dashboard"
                  ? "bg-primary/10 text-primary"
                  : "text-text-muted hover:bg-accent hover:text-text-light"
              )}
            >
              Dashboard
            </Link>
            <Link
              to="/workouts"
              className={cn(
                "block px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                location.pathname === "/workouts"
                  ? "bg-primary/10 text-primary"
                  : "text-text-muted hover:bg-accent hover:text-text-light"
              )}
            >
              Workouts
            </Link>
            <Link
              to="/workout-ai"
              className={cn(
                "block px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                location.pathname === "/workout-ai"
                  ? "bg-primary/10 text-primary"
                  : "text-text-muted hover:bg-accent hover:text-text-light"
              )}
            >
              AI Workouts
            </Link>
            <Link
              to="/calories"
              className={cn(
                "block px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                location.pathname === "/calories"
                  ? "bg-primary/10 text-primary"
                  : "text-text-muted hover:bg-accent hover:text-text-light"
              )}
            >
              Calories
            </Link>
            <Link
              to="/social"
              className={cn(
                "block px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                location.pathname === "/social"
                  ? "bg-primary/10 text-primary"
                  : "text-text-muted hover:bg-accent hover:text-text-light"
              )}
            >
              Social
            </Link>
            <Link
              to="/achievements"
              className={cn(
                "block px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                location.pathname === "/achievements"
                  ? "bg-primary/10 text-primary"
                  : "text-text-muted hover:bg-accent hover:text-text-light"
              )}
            >
              Achievements
            </Link>
            <Link
              to="/leaderboard"
              className={cn(
                "block px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                location.pathname === "/leaderboard"
                  ? "bg-primary/10 text-primary"
                  : "text-text-muted hover:bg-accent hover:text-text-light"
              )}
            >
              Leaderboard
            </Link>
            <Link
              to="/profile"
              className={cn(
                "block px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                location.pathname === "/profile"
                  ? "bg-primary/10 text-primary"
                  : "text-text-muted hover:bg-accent hover:text-text-light"
              )}
            >
              Profile
            </Link>
            <Link
              to="/settings"
              className={cn(
                "block px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                location.pathname === "/settings"
                  ? "bg-primary/10 text-primary"
                  : "text-text-muted hover:bg-accent hover:text-text-light"
              )}
            >
              Settings
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
