import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Crown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const plans = [
  {
    name: 'Monthly Premium',
    price: '£5',
    interval: 'month',
    priceId: 'price_1Q2W3E4R5T6Y7U8I9O0P', // Replace with your actual Stripe price ID for monthly plan
    features: [
      'AI-Powered Workout Generation',
      'Personalized Nutrition Plans',
      'Progress Tracking',
      'Premium Support',
      'Access to All Features'
    ]
  },
  {
    name: 'Yearly Premium',
    price: '£50',
    interval: 'year',
    priceId: 'price_1Q2W3E4R5T6Y7U8I9O1', // Replace with your actual Stripe price ID for yearly plan
    features: [
      'AI-Powered Workout Generation',
      'Personalized Nutrition Plans',
      'Progress Tracking',
      'Premium Support',
      'Access to All Features'
    ],
    savings: 'Save 17%'
  }
];

export default function Subscription() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    // Check for success or cancel URL parameters
    const params = new URLSearchParams(location.search);
    if (params.get('success')) {
      toast.success('Subscription successful! Welcome to premium.');
      navigate('/dashboard');
    }
    if (params.get('canceled')) {
      toast.error('Subscription canceled. You can try again anytime.');
    }
  }, [location, navigate]);

  const handleSubscribe = async (priceId: string, plan: string) => {
    if (!user) {
      toast.error('Please log in to subscribe');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId: user.id,
          plan,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create checkout session');
      }

      if (!data.url) {
        throw new Error('No checkout URL received');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create checkout session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-text-light mb-4">Upgrade to Premium</h1>
        <p className="text-xl text-text-muted">
          Unlock all features and take your fitness journey to the next level
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {plans.map((plan) => (
          <Card key={plan.name} className="relative">
            {plan.savings && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                  {plan.savings}
                </span>
              </div>
            )}
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                {plan.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <span className="text-3xl font-bold text-text-light">{plan.price}</span>
                <span className="text-text-muted">/{plan.interval}</span>
              </div>
              <ul className="space-y-4 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span className="text-text-muted">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                onClick={() => handleSubscribe(plan.priceId, plan.interval)}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Subscribe Now'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
