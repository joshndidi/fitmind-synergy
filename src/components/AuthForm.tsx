
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type AuthFormProps = {
  type: "login" | "signup";
};

const AuthForm = ({ type }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, signup, loginWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  
  // Check if user is already authenticated and redirect if necessary
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      if (type === "login") {
        const id = toast.loading("Signing in...");
        const { error } = await login(email, password);
        toast.dismiss(id);
        
        if (error) {
          toast.error(error.message || "Failed to sign in");
          return;
        }
        
        toast.success("Signed in successfully!");
        // The useEffect above will handle navigation once user state updates
      } else {
        const id = toast.loading("Creating account...");
        const { error } = await signup(email, password);
        toast.dismiss(id);
        
        if (error) {
          toast.error(error.message || "Failed to create account");
          return;
        }
        
        toast.success("Account created successfully!");
        // The useEffect above will handle navigation once user state updates
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast.error(error.message || "Authentication failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      // Redirection is handled by Supabase
    } catch (error: any) {
      console.error("Google login error:", error);
      toast.error(error.message || "Google login failed");
    }
  };

  const handleAdminLogin = async () => {
    try {
      setIsSubmitting(true);
      const id = toast.loading("Logging in as admin...");
      await login("admin@admin.com", "admin");
      toast.dismiss(id);
      // The useEffect above will handle navigation once user state updates
    } catch (error: any) {
      console.error("Admin login error:", error);
      toast.error(error.message || "Admin login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card w-full max-w-md p-4 sm:p-8 mx-auto animate-fade-in">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-text-light">
        {type === "login" ? "Sign In" : "Create Account"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-muted mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="input-field w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-text-muted mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="input-field w-full"
            required
          />
        </div>
        
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </span>
          ) : (
            type === "login" ? "Sign In" : "Create Account"
          )}
        </Button>
      </form>
      
      <div className="mt-4 sm:mt-6">
        <p className="text-text-muted text-sm mb-3 sm:mb-4">or</p>
        
        <div className="space-y-2 sm:space-y-3">
          <Button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
            variant="secondary"
            className="w-full flex items-center justify-center gap-2"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span>Continue with Google</span>
          </Button>
          
          {type === "login" && (
            <Button
              type="button"
              onClick={handleAdminLogin}
              disabled={isSubmitting}
              variant="outline"
              className="w-full flex items-center justify-center gap-2 text-xs sm:text-sm"
            >
              <Shield size={16} />
              <span>Admin access (admin@admin.com / admin)</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
