
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Menu, X, Home, Dumbbell, User, Award, 
  Calendar, LineChart, Settings, LogOut, 
  Moon, MessageSquare, BarChart4, Crown
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useSubscription } from "../context/SubscriptionContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const NavBar = () => {
  const { user, logout } = useAuth();
  const { isActive } = useSubscription();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  const isAdmin = user?.isAdmin;
  
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: <Home className="h-5 w-5" /> },
    { name: "Workouts", href: "/workout-selection", icon: <Dumbbell className="h-5 w-5" /> },
    { name: "Achievements", href: "/achievements", icon: <Award className="h-5 w-5" /> },
    { name: "Progress", href: "/profile", icon: <LineChart className="h-5 w-5" /> },
    { name: "Social", href: "/social", icon: <MessageSquare className="h-5 w-5" /> },
    { name: "Quiet Time", href: "/quiet-time", icon: <Moon className="h-5 w-5" /> },
    { name: "Leaderboard", href: "/leaderboard", icon: <BarChart4 className="h-5 w-5" /> },
    { name: "Calories", href: "/calories", icon: <Calendar className="h-5 w-5" /> },
  ];
  
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };
  
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-black/40 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-primary">
                FitMind
              </Link>
            </div>
          </div>
          
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "nav-link",
                  location.pathname === item.href && "active"
                )}
              >
                {item.icon}
                <span>{item.name}</span>
                {item.name === "Leaderboard" && isActive && (
                  <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full bg-primary/20 text-primary">
                    Live
                  </span>
                )}
              </Link>
            ))}
            
            {isActive && (
              <div className="ml-1 flex-shrink-0">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
                  <Crown className="h-3.5 w-3.5 mr-1" />
                  Premium
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center gap-3">
                {!isActive && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="hidden md:flex border-primary/50 text-primary hover:bg-primary/20"
                    onClick={() => navigate('/subscription')}
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade
                  </Button>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative rounded-full p-1 h-auto">
                      <Avatar className="h-8 w-8">
                        {user.photoURL ? (
                          <AvatarImage src={user.photoURL} />
                        ) : (
                          <AvatarFallback>
                            {getInitials(user.displayName || user.email || "")}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        {user.displayName && (
                          <p className="font-medium">{user.displayName}</p>
                        )}
                        {user.email && (
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        )}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/subscription')}>
                      <Crown className="mr-2 h-4 w-4" />
                      <span>Subscription</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem onClick={() => navigate('/admin')}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Admin</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  className="text-text-light hover:text-primary"
                  onClick={() => navigate('/auth')}
                >
                  Log In
                </Button>
                <Button 
                  className="bg-primary text-white hover:bg-primary/90"
                  onClick={() => navigate('/auth', { state: { signup: true } })}
                >
                  Sign Up
                </Button>
              </div>
            )}
            
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-2">
                    <Menu className="h-6 w-6 text-text-light" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[300px] sm:w-[350px] bg-black/80 backdrop-blur-xl border-white/10">
                  <SheetHeader className="mb-8">
                    <SheetTitle className="text-text-light">FitMind</SheetTitle>
                  </SheetHeader>
                  
                  {user && (
                    <div className="flex items-center gap-3 mb-8 px-1">
                      <Avatar className="h-10 w-10">
                        {user.photoURL ? (
                          <AvatarImage src={user.photoURL} />
                        ) : (
                          <AvatarFallback>
                            {getInitials(user.displayName || user.email || "")}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <p className="font-medium text-text-light">
                          {user.displayName || user.email?.split('@')[0]}
                        </p>
                        {user.email && (
                          <p className="text-xs text-text-muted truncate max-w-[230px]">
                            {user.email}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex flex-col space-y-3 py-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={cn(
                          "flex items-center rounded-md p-2 text-base hover:bg-white/10 transition",
                          location.pathname === item.href 
                            ? "bg-white/10 text-primary" 
                            : "text-text-light"
                        )}
                        onClick={closeMenu}
                      >
                        {item.icon}
                        <span className="ml-3">{item.name}</span>
                      </Link>
                    ))}
                    
                    {!user ? (
                      <div className="pt-4 flex flex-col space-y-3">
                        <Button 
                          variant="outline"
                          className="justify-start border-white/10"
                          onClick={() => {
                            navigate('/auth');
                            closeMenu();
                          }}
                        >
                          Log In
                        </Button>
                        <Button 
                          className="justify-start"
                          onClick={() => {
                            navigate('/auth', { state: { signup: true } });
                            closeMenu();
                          }}
                        >
                          Sign Up
                        </Button>
                      </div>
                    ) : (
                      <div className="pt-4 flex flex-col space-y-3">
                        <Link
                          to="/profile"
                          className="flex items-center rounded-md p-2 text-base text-text-light hover:bg-white/10 transition"
                          onClick={closeMenu}
                        >
                          <User className="h-5 w-5" />
                          <span className="ml-3">Profile</span>
                        </Link>
                        
                        <Link
                          to="/subscription"
                          className="flex items-center rounded-md p-2 text-base text-text-light hover:bg-white/10 transition"
                          onClick={closeMenu}
                        >
                          <Crown className="h-5 w-5" />
                          <span className="ml-3">Subscription</span>
                        </Link>
                        
                        <Button 
                          variant="outline"
                          className="justify-start border-white/10 text-destructive hover:text-destructive"
                          onClick={() => {
                            handleLogout();
                            closeMenu();
                          }}
                        >
                          <LogOut className="h-5 w-5 mr-3" />
                          Log Out
                        </Button>
                        
                        {isAdmin && (
                          <Link
                            to="/admin"
                            className="flex items-center rounded-md p-2 text-base text-text-light hover:bg-white/10 transition mt-4"
                            onClick={closeMenu}
                          >
                            <Settings className="h-5 w-5" />
                            <span className="ml-3">Admin Panel</span>
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
