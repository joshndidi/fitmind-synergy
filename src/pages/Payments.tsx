
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, CreditCard, Info, Lock, Star } from "lucide-react";
import { useSubscription } from "@/context/SubscriptionContext";
import { toast } from "sonner";

const PricingCard = ({ 
  title, 
  price, 
  features, 
  isPopular, 
  isActive, 
  onSubscribe 
}: { 
  title: string; 
  price: string; 
  features: string[]; 
  isPopular?: boolean; 
  isActive?: boolean;
  onSubscribe: () => void;
}) => {
  return (
    <Card className={`glass-card relative ${isPopular ? 'border-primary/40' : ''} ${isActive ? 'ring-2 ring-primary' : ''}`}>
      {isPopular && (
        <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
          <span className="bg-primary text-white text-xs px-3 py-1 rounded-full">Popular</span>
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-text-light flex justify-between items-center">
          {title}
          {isActive && (
            <span className="text-sm text-primary bg-primary/10 px-2 py-1 rounded-md">Active Plan</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-text-light">${price}</span>
          <span className="text-text-muted">/month</span>
        </div>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-text-light text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          className={`w-full ${isActive ? 'bg-gray-600 hover:bg-gray-500' : 'bg-primary'}`}
          onClick={onSubscribe}
          disabled={isActive}
        >
          {isActive ? 'Current Plan' : 'Subscribe'}
        </Button>
      </CardFooter>
    </Card>
  );
};

const PaymentForm = ({ plan, onCancel }: { plan: string; onCancel: () => void }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { setIsActive } = useSubscription();

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      setIsActive(true);
      toast.success("Subscription activated successfully!");
      
      // Save subscription info to local storage to persist
      localStorage.setItem("subscription_active", "true");
      localStorage.setItem("subscription_plan", plan);
      localStorage.setItem("subscription_date", new Date().toISOString());
    }, 2000);
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-text-light">Complete Your Purchase</CardTitle>
        <p className="text-text-muted text-sm mt-2">
          You're subscribing to the {plan} plan
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-text-muted block mb-1">Name on Card</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="input-field w-full"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-text-muted block mb-1">Card Number</label>
            <div className="relative">
              <input
                type="text"
                required
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="4242 4242 4242 4242"
                maxLength={19}
                className="input-field w-full pl-10"
              />
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-text-muted block mb-1">Expiry Date</label>
              <input
                type="text"
                required
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                placeholder="MM/YY"
                maxLength={5}
                className="input-field w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-text-muted block mb-1">CVC</label>
              <input
                type="text"
                required
                value={cvc}
                onChange={(e) => setCvc(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="123"
                maxLength={3}
                className="input-field w-full"
              />
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-primary/10 rounded-md text-sm">
            <Info className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
            <p className="text-text-light">
              This is a demo payment form. Use card number <span className="font-mono">4242 4242 4242 4242</span> with any future expiry date and CVC.
            </p>
          </div>
          
          <div className="flex items-center justify-between pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="border-white/10"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-white rounded-full mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" /> 
                  Pay Securely
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

const Payments = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const { isActive } = useSubscription();
  
  const plans = [
    {
      title: "Basic",
      price: "9.99",
      features: [
        "Unlimited workout tracking",
        "Basic nutrition tracking",
        "Community support",
        "Progress tracking"
      ],
      isPopular: false
    },
    {
      title: "Premium",
      price: "19.99",
      features: [
        "Everything in Basic",
        "AI workout plan generation",
        "Advanced performance analytics",
        "Nutrition meal planning",
        "Priority support"
      ],
      isPopular: true
    },
    {
      title: "Elite",
      price: "29.99",
      features: [
        "Everything in Premium",
        "Personal coaching sessions",
        "Custom exercise library",
        "Recovery optimization",
        "Weekly progress reports",
        "Exclusive workout content"
      ],
      isPopular: false
    }
  ];
  
  const handleSubscribe = (plan: string) => {
    setSelectedPlan(plan);
  };
  
  const handleCancel = () => {
    setSelectedPlan(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-2 text-text-light">Subscription Plans</h1>
      <p className="text-text-muted mb-8">Choose the plan that fits your fitness journey</p>
      
      {selectedPlan ? (
        <div className="max-w-md mx-auto">
          <PaymentForm plan={selectedPlan} onCancel={handleCancel} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {plans.map((plan) => (
              <PricingCard
                key={plan.title}
                title={plan.title}
                price={plan.price}
                features={plan.features}
                isPopular={plan.isPopular}
                isActive={isActive && plan.title === "Premium"}
                onSubscribe={() => handleSubscribe(plan.title)}
              />
            ))}
          </div>
          
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-text-light flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Why Subscribe to FitMind Premium?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: "AI Workout Plans",
                    description: "Get personalized workout plans created by AI based on your goals and experience."
                  },
                  {
                    title: "Advanced Analytics",
                    description: "Detailed insights on your performance, progress tracking, and improvement suggestions."
                  },
                  {
                    title: "Premium Features",
                    description: "Access to all premium features including meal planning and recovery optimization."
                  },
                  {
                    title: "Support Health Research",
                    description: "A portion of your subscription supports mental health and fitness research."
                  }
                ].map((feature, index) => (
                  <div key={index} className="glass-card p-4">
                    <h3 className="font-medium text-text-light mb-2">{feature.title}</h3>
                    <p className="text-text-muted text-sm">{feature.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Payments;
