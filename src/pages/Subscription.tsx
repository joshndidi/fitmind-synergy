import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Crown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/context/SubscriptionContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export default function Subscription() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { isActive, checkSubscription } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already subscribed
  useEffect(() => {
    if (isActive) {
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isActive, navigate, location]);

  const plans = [
    {
      name: 'Monthly',
      price: 5,
      interval: 'month',
      priceId: 'price_1R2I15DahQwjhZ7lQ43FTWel', // Replace with your monthly price ID from Stripe
      features: [
        'AI Food Recognition',
        'Personalized Workout Plans',
        'Progress Tracking',
        'Premium Support'
      ]
    },
    {
      name: 'Yearly',
      price: 50,
      interval: 'year',
      priceId: 'price_1R8SGIDahQwjhZ7l3LRvJGkG', // Replace with your yearly price ID from Stripe
      features: [
        'AI Food Recognition',
        'Personalized Workout Plans',
        'Progress Tracking',
        'Premium Support',
        '2 Months Free'
      ],
      savings: 'Save 17%'
    }
  ];

  const handleSubscribe = async (plan: 'monthly' | 'yearly') => {
    if (!user) {
      toast.error('Please sign in to subscribe');
      return;
    }

    setIsLoading(true);
    try {
      // Create a checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plans[plan].priceId,
          userId: user.id,
          plan: plan
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create checkout session');
      }

      const { sessionUrl } = await response.json();

      if (!sessionUrl) {
        throw new Error('No checkout session URL received');
      }

      // Redirect to Stripe Checkout
      window.location.href = sessionUrl;
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process subscription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Upgrade to Premium</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Get access to all premium features and take your fitness journey to the next level
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {(['monthly', 'yearly'] as const).map((plan) => (
          <Card
            key={plan}
            className={`p-6 space-y-6 relative overflow-hidden ${
              selectedPlan === plan ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedPlan(plan)}
          >
            {plan === 'yearly' && (
              <div className="absolute top-4 right-4">
                <Crown className="h-6 w-6 text-yellow-500" />
              </div>
            )}
            <div className="space-y-2">
              <h3 className="text-2xl font-bold capitalize">{plan} Plan</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">{plans[plan].price}</span>
                <span className="text-muted-foreground">/{plans[plan].interval}</span>
              </div>
              {plans[plan].savings && (
                <div className="text-sm text-green-500 font-medium">
                  {plans[plan].savings}
                </div>
              )}
            </div>

            <ul className="space-y-3">
              {plans[plan].features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              className="w-full"
              size="lg"
              disabled={isLoading}
              onClick={() => handleSubscribe(plan)}
            >
              {isLoading ? 'Processing...' : `Subscribe ${plans[plan].price}/${plans[plan].interval}`}
            </Button>
          </Card>
        ))}
      </div>

      <div className="text-center text-sm text-muted-foreground mt-8">
        <p>Secure payment processing. Cancel anytime.</p>
        <p>VAT may be applicable depending on your location.</p>
      </div>
    </div>
  );
}
