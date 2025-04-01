import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/context/SubscriptionContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CheckCircle, Loader2 } from 'lucide-react';

export default function SubscriptionSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { checkSubscription } = useSubscription();

  useEffect(() => {
    const activateSubscription = async () => {
      const sessionId = searchParams.get('session_id');
      if (!sessionId || !user) {
        toast.error('Invalid subscription session');
        navigate('/subscription');
        return;
      }

      try {
        // In a real app, you would verify the session with Stripe
        // For now, we'll just update the subscription status
        const { error } = await supabase
          .from('subscriptions')
          .upsert({
            user_id: user.id,
            status: 'active',
            stripe_session_id: sessionId,
            start_date: new Date().toISOString(),
            end_date: new Date(
              new Date().setMonth(new Date().getMonth() + 1)
            ).toISOString(),
          });

        if (error) {
          console.error('Supabase error:', error);
          throw new Error('Failed to update subscription status');
        }

        // Refresh subscription status
        await checkSubscription();
        
        toast.success('Subscription activated successfully!');
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } catch (error) {
        console.error('Error activating subscription:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to activate subscription');
        navigate('/subscription');
      }
    };

    activateSubscription();
  }, [searchParams, user, navigate, checkSubscription]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <CheckCircle className="h-16 w-16 text-green-500" />
      <h1 className="text-3xl font-bold">Thank you for subscribing!</h1>
      <p className="text-muted-foreground">
        Your subscription is being activated...
      </p>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Please wait...</span>
      </div>
    </div>
  );
} 