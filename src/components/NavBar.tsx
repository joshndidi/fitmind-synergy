import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSubscription } from "../context/SubscriptionContext";
import {
  Home,
  BarChart3,
  Settings,
  LogOut,
  Brain,
  CreditCard,
  Trophy
} from 'lucide-react';

const NavBar = () => {
  const { user, logout } = useAuth();
  const { isActive } = useSubscription();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const routes = [
    {
      name: "Home",
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: "Workout AI",
      href: "/workout-ai",
      icon: <Brain className="h-5 w-5" />,
      premium: true,
    },
    {
      name: "Leaderboard",
      href: "/leaderboard",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      name: "Achievements",
      href: "/achievements",
      icon: <Trophy className="h-5 w-5" />,
    },
    {
      name: "Subscription",
      href: "/payments",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      name: "Settings",
      href: "/profile",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <nav className="glass-card fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0">
              <h1 className="font-bold text-xl text-text-light">FitMind</h1>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {routes.map((route) => (
                  <NavLink
                    key={route.name}
                    to={route.href}
                    className={({ isActive }) =>
                      `text-text-muted hover:bg-white/5 hover:text-white px-3 py-2 rounded-md text-sm font-medium 
                      ${isActive ? 'bg-primary/10 text-primary' : ''}
                      ${route.premium && !isActive ? 'opacity-50 cursor-not-allowed' : ''}`
                    }
                    style={route.premium && !isActive ? { pointerEvents: 'none' } : {}}
                  >
                    <div className="flex items-center gap-2">
                      {route.icon}
                      <span>{route.name}</span>
                    </div>
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <button
                onClick={handleLogout}
                className="bg-white/10 hover:bg-white/20 text-text-muted hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                <div className="flex items-center gap-2">
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </div>
              </button>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="bg-white/10 rounded-md p-2 inline-flex items-center justify-center text-text-muted hover:text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className={`${isOpen ? 'block' : 'none'} md:hidden`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {routes.map((route) => (
            <NavLink
              key={route.name}
              to={route.href}
              className={({ isActive }) =>
                `text-text-muted hover:bg-white/5 hover:text-white block px-3 py-2 rounded-md text-base font-medium
                ${isActive ? 'bg-primary/10 text-primary' : ''}
                ${route.premium && !isActive ? 'opacity-50 cursor-not-allowed' : ''}`
              }
              style={route.premium && !isActive ? { pointerEvents: 'none' } : {}}
            >
              <div className="flex items-center gap-2">
                {route.icon}
                <span>{route.name}</span>
              </div>
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="text-text-muted hover:bg-white/5 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            <div className="flex items-center gap-2">
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
