
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useSubscription } from "@/context/SubscriptionContext";
import { AiFeatureComingSoon } from "@/components/AiFeatureComingSoon";

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

export const SubscriptionRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const { subscription, loading: subscriptionLoading } = useSubscription();
  const { user, loading: userLoading } = useAuth();
  
  // Extend user type with isAdmin property
  const isAdmin = user?.email?.endsWith('@admin.com') || false;

  // While loading, show a loading indicator
  if (userLoading || subscriptionLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // For admin-only routes, check if the user is an admin
  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  // If subscription check is required and user doesn't have a subscription, show coming soon page
  if (!subscription?.isPro && !isAdmin) {
    return <AiFeatureComingSoon />;
  }

  // User has required subscription or is an admin, render the protected content
  return <>{children}</>;
};
