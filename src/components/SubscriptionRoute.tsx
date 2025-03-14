
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSubscription } from "../context/SubscriptionContext";

const SubscriptionRoute = ({ children }: { children: ReactNode }) => {
  const { isActive, loading } = useSubscription();
  const location = useLocation();

  // If still loading, show a loading spinner
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not subscribed, redirect to subscription page
  if (!isActive) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center glass-card p-8">
        <h2 className="text-2xl font-bold mb-4 text-text-light">
          Premium Feature
        </h2>
        <p className="text-text-muted mb-6 text-center max-w-md">
          This feature requires an active subscription. Subscribe to FitMind Premium for just £5 per month to access all AI-powered features.
        </p>
        <Navigate to="/subscription" state={{ from: location }} replace />
      </div>
    );
  }

  // If subscribed, show the children
  return <>{children}</>;
};

export default SubscriptionRoute;
