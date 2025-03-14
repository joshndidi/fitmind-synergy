import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

type SubscriptionStatus = "none" | "active" | "cancelled" | "expired";

type SubscriptionContextType = {
  status: SubscriptionStatus;
  expiryDate: Date | null;
  isActive: boolean;
  subscribe: () => Promise<void>;
  cancel: () => Promise<void>;
  loading: boolean;
  error: string | null;
};

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
};

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [status, setStatus] = useState<SubscriptionStatus>("none");
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for stored subscription status on initial load or user change
  useEffect(() => {
    if (user) {
      loadUserSubscription();
    } else {
      setStatus("none");
      setExpiryDate(null);
    }
  }, [user]);

  const loadUserSubscription = async () => {
    if (!user) return;
    
    // First check local storage for cached data
    const storedSubscription = localStorage.getItem(`subscription_${user.id}`);
    if (storedSubscription) {
      try {
        const subscription = JSON.parse(storedSubscription);
        setStatus(subscription.status);
        setExpiryDate(subscription.expiryDate ? new Date(subscription.expiryDate) : null);
      } catch (err) {
        console.error("Error parsing stored subscription:", err);
      }
    }
    
    // In a real app, this would call your backend API to get the current subscription status
    // For demo purposes, we're just using localStorage
    try {
      setLoading(true);
      
      // Mock API call - in a real app, you would fetch from your backend
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // If we have a valid subscription in localStorage, we're done
      if (storedSubscription) {
        return;
      }
      
      // Otherwise set default values
      setStatus("none");
      setExpiryDate(null);
      
    } catch (err: any) {
      console.error("Error loading subscription:", err);
      setError(err.message || "Failed to load subscription status");
    } finally {
      setLoading(false);
    }
  };

  const isActive = status === "active" && expiryDate ? new Date() < new Date(expiryDate) : false;

  const subscribe = async () => {
    if (!user) {
      toast.error("You must be logged in to subscribe");
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Mock payment processing - in a real app, this would redirect to a payment provider
      // like Stripe, PayPal, etc.
      toast.info("Processing payment...");
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Set subscription for one month from now
      const newExpiryDate = new Date();
      newExpiryDate.setMonth(newExpiryDate.getMonth() + 1);
      
      setStatus("active");
      setExpiryDate(newExpiryDate);
      
      // Store in localStorage
      localStorage.setItem(
        `subscription_${user.id}`, 
        JSON.stringify({
          status: "active",
          expiryDate: newExpiryDate.toISOString()
        })
      );
      
      toast.success("Subscription activated successfully!");
      
    } catch (err: any) {
      console.error("Error processing subscription:", err);
      setError(err.message || "Failed to process subscription");
      toast.error("Subscription failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cancel = async () => {
    if (!user) {
      toast.error("You must be logged in to manage subscriptions");
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Mock cancellation process - in a real app, this would call your backend API
      // which would then communicate with your payment provider
      toast.info("Processing cancellation...");
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStatus("cancelled");
      
      // Update in localStorage but keep the expiry date
      localStorage.setItem(
        `subscription_${user.id}`, 
        JSON.stringify({
          status: "cancelled",
          expiryDate: expiryDate?.toISOString()
        })
      );
      
      toast.success("Subscription cancelled. You'll have access until the end of your billing period.");
      
    } catch (err: any) {
      console.error("Error cancelling subscription:", err);
      setError(err.message || "Failed to cancel subscription");
      toast.error("Cancellation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const value = {
    status,
    expiryDate,
    isActive,
    subscribe,
    cancel,
    loading,
    error
  };

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
};
