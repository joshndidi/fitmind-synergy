
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
  X 
} from "lucide-react";
import { useState, useEffect } from "react";

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
    { name: "Workout AI", path: "/workout-ai", icon: <Brain size={20} /> },
    { name: "Calorie Tracker", path: "/calorie-tracker", icon: <Activity size={20} /> },
    { name: "Profile", path: "/profile", icon: <User size={20} /> },
    { name: "Workouts", path: "/workout-display/1", icon: <Dumbbell size={20} /> },
    { name: "Subscription", path: "/subscription", icon: <CreditCard size={20} /> },
    { name: "Quiet Time", path: "/quiet-time", icon: <Music size={20} /> },
    { name: "Social", path: "/social", icon: <Users size={20} /> },
    { name: "Leaderboard", path: "/leaderboard", icon: <Award size={20} /> },
  ];

  return (
    <nav className={`sticky top-0 z-50 backdrop-blur-xl transition-all duration-300 ${scrolled ? 'bg-black/60 shadow-lg' : 'bg-black/30'}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <Dumbbell className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl text-text-light">FitMind</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${
                  location.pathname === link.path ? "active" : ""
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
            <button onClick={handleLogout} className="btn-secondary">
              Logout
            </button>
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
                  className={`nav-link ${
                    location.pathname === link.path ? "active" : ""
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              ))}
              <button onClick={handleLogout} className="btn-secondary mt-4">
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
