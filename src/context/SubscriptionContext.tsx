
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export type SubscriptionContextType = {
  isActive: boolean;
  subscribe: () => Promise<void>;
  cancel: () => Promise<void>;
  loading: boolean;
  isLoading: boolean; // Added for ProtectedRoute
  status: string | null;
  expiryDate: Date | null;
  checkSubscription: () => Promise<void>; // Added for success page
};

const SubscriptionContext = createContext<SubscriptionContextType>({
  isActive: false,
  subscribe: async () => {},
  cancel: async () => {},
  loading: false,
  isLoading: false, // Added
  status: null,
  expiryDate: null,
  checkSubscription: async () => {}, // Added
});

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);

  useEffect(() => {
    if (user) {
      checkSubscription();
    } else {
      setIsActive(false);
      setLoading(false);
      setStatus(null);
      setExpiryDate(null);
    }
  }, [user]);

  const checkSubscription = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (error) {
        console.error("Error checking subscription:", error);
        setIsActive(false);
        setStatus(null);
        setExpiryDate(null);
        return;
      }

      if (data) {
        setIsActive(data.status === "active");
        setStatus(data.status);
        setExpiryDate(data.current_period_end ? new Date(data.current_period_end) : null);
      } else {
        setIsActive(false);
        setStatus(null);
        setExpiryDate(null);
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
      setIsActive(false);
      setStatus(null);
      setExpiryDate(null);
    } finally {
      setLoading(false);
    }
  };

  const subscribe = async () => {
    if (!user) {
      toast.error("Please sign in to subscribe");
      return;
    }

    try {
      setLoading(true);
      
      // This is a placeholder for a Stripe checkout session creation
      // In a real application, you would create a Stripe checkout session
      // and redirect the user to the Stripe checkout page
      
      // Simulate a successful subscription for now
      const { error } = await supabase
        .from("subscriptions")
        .upsert({
          user_id: user.id,
          plan: "premium",
          status: "active",
          stripe_customer_id: `cus_${Math.random().toString(36).substring(2, 12)}`,
          stripe_subscription_id: `sub_${Math.random().toString(36).substring(2, 12)}`,
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        });

      if (error) throw error;

      await checkSubscription();
      toast.success("Subscription created successfully!");
    } catch (error: any) {
      console.error("Error creating subscription:", error);
      toast.error(error.message || "Failed to create subscription");
    } finally {
      setLoading(false);
    }
  };

  const cancel = async () => {
    if (!user) {
      toast.error("Please sign in to cancel your subscription");
      return;
    }

    try {
      setLoading(true);
      
      // This is a placeholder for a Stripe subscription cancellation
      // In a real application, you would cancel the Stripe subscription
      
      // Simulate a successful cancellation for now
      const { error } = await supabase
        .from("subscriptions")
        .update({ status: "inactive" })
        .eq("user_id", user.id);

      if (error) throw error;

      await checkSubscription();
      toast.success("Subscription cancelled successfully!");
    } catch (error: any) {
      console.error("Error cancelling subscription:", error);
      toast.error(error.message || "Failed to cancel subscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        isActive,
        subscribe,
        cancel,
        loading,
        isLoading: loading, // Alias for compatibility
        status,
        expiryDate,
        checkSubscription, // Added for success page
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => useContext(SubscriptionContext);
