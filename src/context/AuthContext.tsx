import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "../integrations/supabase/client";
import { toast } from "sonner";

// Extended User type that includes properties we use throughout the app
export interface ExtendedUser extends User {
  displayName?: string | null;
  photoURL?: string | null;
  isAdmin?: boolean;
}

type AuthContextType = {
  user: ExtendedUser | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to enhance the user object with additional properties
  const enhanceUser = (originalUser: User | null): ExtendedUser | null => {
    if (!originalUser) return null;
    
    // Check for admin email - using multiple conditions for flexibility
    const isAdmin = originalUser.email === "admin@admin.com" || 
                    originalUser.email === "admin@example.com";
    
    return {
      ...originalUser,
      displayName: originalUser.user_metadata?.full_name || originalUser.email?.split('@')[0] || null,
      photoURL: originalUser.user_metadata?.avatar_url || null,
      isAdmin: isAdmin
    };
  };

  useEffect(() => {
    // Check for active session on initial load
    const getInitialSession = async () => {
      try {
        setLoading(true);
        
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (session) {
          setSession(session);
          setUser(enhanceUser(session.user));
        }
      } catch (error: any) {
        console.error("Error getting initial session:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log("Auth state changed:", _event, session);
        setSession(session);
        setUser(enhanceUser(session?.user ?? null));
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Special admin user check (keeping this for quick admin access)
      if ((email === "admin@admin.com" || email === "admin") && password === "admin") {
        // Create a mock admin user session
        const mockAdminUser: ExtendedUser = {
          id: "admin-user-id",
          email: "admin@admin.com",
          displayName: "Admin",
          isAdmin: true,
          // Adding minimal required User properties
          app_metadata: {},
          user_metadata: { isAdmin: true },
          aud: "authenticated",
          created_at: new Date().toISOString()
        };
        
        setUser(mockAdminUser);
        toast.success("Logged in as admin");
        return;
      }
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Logged in successfully");
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard'
        }
      });
      
      if (error) {
        throw error;
      }
      
      // Toast message will show after redirect back
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // First create the user account
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Set email confirmation to true so user can sign in immediately
          emailRedirectTo: window.location.origin + '/dashboard',
          data: {
            email_confirmed: true
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      // If user was created successfully, immediately sign them in
      if (data.user) {
        console.log("User created successfully:", data.user);
        
        // Sign in the user immediately after signup
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) {
          throw signInError;
        }
        
        // Check if sign-in was successful
        if (signInData.session) {
          console.log("User signed in successfully:", signInData.session);
          toast.success("Account created and logged in successfully!");
        } else {
          toast.success("Account created! Please check your email for confirmation.");
        }
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast.success("Logged out successfully");
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    error,
    login,
    loginWithGoogle,
    logout,
    signup
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
