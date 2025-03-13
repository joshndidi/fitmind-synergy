
import { Check, X } from "lucide-react";
import { useSubscription } from "../context/SubscriptionContext";
import { useState } from "react";
import { Button } from "./ui/button";

type SubscriptionPlan = {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: { text: string; available: boolean }[];
};

type SubscriptionCardProps = {
  plan: SubscriptionPlan;
};

const SubscriptionCard = ({ plan }: SubscriptionCardProps) => {
  const { isActive, subscribe, cancel, loading, status, expiryDate } = useSubscription();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = async () => {
    setIsProcessing(true);
    try {
      await subscribe();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    setIsProcessing(true);
    try {
      await cancel();
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="glass-card p-6 md:p-8 max-w-md mx-auto">
      <div className="text-center mb-6">
        <span className="inline-block px-3 py-1 rounded-full bg-primary/30 text-primary text-xs font-medium mb-2">
          {plan.name}
        </span>
        <h3 className="text-2xl font-bold text-text-light mb-2">FitMind Premium</h3>
        <div className="flex justify-center items-baseline">
          <span className="text-3xl font-extrabold text-text-light">{plan.price}</span>
          <span className="text-text-muted ml-1">/{plan.period}</span>
        </div>
        <p className="text-text-muted mt-2">{plan.description}</p>
      </div>

      <ul className="space-y-3 mb-6">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center">
            {feature.available ? (
              <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
            ) : (
              <X className="h-5 w-5 text-text-muted mr-3 flex-shrink-0" />
            )}
            <span className={feature.available ? "text-text-light" : "text-text-muted"}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      {isActive ? (
        <div className="space-y-4">
          <p className="text-center text-text-muted text-sm">
            Your subscription is active until {formatDate(expiryDate)}
          </p>
          <Button
            onClick={handleCancel}
            disabled={isProcessing || loading}
            variant="outline"
            className="w-full"
          >
            {isProcessing || loading ? "Processing..." : "Cancel Subscription"}
          </Button>
        </div>
      ) : (
        <Button
          onClick={handleSubscribe}
          disabled={isProcessing || loading}
          variant="default"
          className="w-full bg-primary hover:bg-primary/90"
        >
          {isProcessing || loading ? "Processing..." : "Subscribe Now"}
        </Button>
      )}
    </div>
  );
};

export default SubscriptionCard;
