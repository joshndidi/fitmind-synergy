import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";

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
      const storedSubscription = localStorage.getItem(`subscription_${user.id}`);
      if (storedSubscription) {
        const subscription = JSON.parse(storedSubscription);
        setStatus(subscription.status);
        setExpiryDate(subscription.expiryDate ? new Date(subscription.expiryDate) : null);
      } else {
        setStatus("none");
        setExpiryDate(null);
      }
    } else {
      setStatus("none");
      setExpiryDate(null);
    }
  }, [user]);

  const isActive = status === "active" && expiryDate ? new Date() < new Date(expiryDate) : false;

  const subscribe = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Mock subscription process - in a real app, this would call a payment API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cancel = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Mock cancellation process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatus("cancelled");
      
      // Update in localStorage but keep the expiry date
      localStorage.setItem(
        `subscription_${user.id}`, 
        JSON.stringify({
          status: "cancelled",
          expiryDate: expiryDate?.toISOString()
        })
      );
      
    } catch (err: any) {
      setError(err.message);
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
