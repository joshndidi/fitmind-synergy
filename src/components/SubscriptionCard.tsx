
import { Check } from "lucide-react";
import { useSubscription } from "../context/SubscriptionContext";
import { useState } from "react";

const SubscriptionCard = () => {
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

  const features = [
    "AI-powered workout planning",
    "Image-based calorie tracking",
    "Personalized nutrition advice",
    "Advanced performance analytics",
    "Exclusive premium content",
  ];

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="glass-card p-6 md:p-8">
      <div className="text-center mb-6">
        <span className="inline-block px-3 py-1 rounded-full bg-primary/30 text-primary text-xs font-medium mb-2">
          Premium
        </span>
        <h3 className="text-2xl font-bold text-text-light mb-2">FitMind Premium</h3>
        <div className="flex justify-center items-baseline">
          <span className="text-3xl font-extrabold text-text-light">£5</span>
          <span className="text-text-muted ml-1">/month</span>
        </div>
      </div>

      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
            <span className="text-text-light">{feature}</span>
          </li>
        ))}
      </ul>

      {isActive ? (
        <div className="space-y-4">
          <p className="text-center text-text-muted text-sm">
            Your subscription is active until {formatDate(expiryDate)}
          </p>
          <button
            onClick={handleCancel}
            disabled={isProcessing}
            className="btn-secondary w-full"
          >
            {isProcessing ? "Processing..." : "Cancel Subscription"}
          </button>
        </div>
      ) : (
        <button
          onClick={handleSubscribe}
          disabled={isProcessing}
          className="btn-primary w-full"
        >
          {isProcessing ? "Processing..." : "Subscribe Now"}
        </button>
      )}
    </div>
  );
};

export default SubscriptionCard;
