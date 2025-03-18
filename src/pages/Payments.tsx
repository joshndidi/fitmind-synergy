
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Zap, Star } from "lucide-react";
import { createCheckoutSession } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Payments = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubscribe = async (plan: string) => {
    if (!user) {
      toast.error("Please log in to subscribe");
      navigate('/');
      return;
    }

    try {
      setLoading(plan);
      
      // Get the current URL for the redirect
      const redirect_url = window.location.origin + '/subscription';
      
      // Call the Stripe checkout session creation
      const { url } = await createCheckoutSession(plan, redirect_url);
      
      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Failed to process subscription");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Choose Your Fitness Plan</h1>
        <p className="text-muted-foreground">
          Select the subscription that best fits your fitness journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Basic Plan */}
        <Card className="transition-all hover:shadow-lg">
          <CardHeader>
            <Shield className="w-12 h-12 text-blue-500 mb-4" />
            <CardTitle>Basic Plan</CardTitle>
            <CardDescription>Essential fitness tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-4">$9.99<span className="text-lg font-normal text-muted-foreground">/month</span></div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span> Workout tracking
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span> Basic statistics
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span> 5 saved workouts
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full"
              onClick={() => handleSubscribe('basic')}
              disabled={loading !== null}
            >
              {loading === 'basic' ? 'Processing...' : 'Subscribe'}
            </Button>
          </CardFooter>
        </Card>

        {/* Premium Plan */}
        <Card className="border-primary transition-all hover:shadow-lg">
          <CardHeader className="bg-primary text-white rounded-t-lg">
            <Star className="w-12 h-12 text-yellow-300 mb-4" />
            <CardTitle className="text-white">Premium Plan</CardTitle>
            <CardDescription className="text-primary-foreground">Advanced fitness features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-4">$19.99<span className="text-lg font-normal text-muted-foreground">/month</span></div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span> Everything in Basic
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span> AI workout recommendations
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span> Unlimited saved workouts
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span> Detailed progress analytics
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              variant="default" 
              className="w-full bg-primary"
              onClick={() => handleSubscribe('premium')}
              disabled={loading !== null}
            >
              {loading === 'premium' ? 'Processing...' : 'Subscribe'}
            </Button>
          </CardFooter>
        </Card>

        {/* Unlimited Plan */}
        <Card className="transition-all hover:shadow-lg">
          <CardHeader>
            <Zap className="w-12 h-12 text-purple-500 mb-4" />
            <CardTitle>Unlimited Plan</CardTitle>
            <CardDescription>Complete fitness solution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-4">$29.99<span className="text-lg font-normal text-muted-foreground">/month</span></div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span> Everything in Premium
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span> One-on-one coaching
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span> Custom meal plans
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span> Priority support
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => handleSubscribe('unlimited')}
              disabled={loading !== null}
            >
              {loading === 'unlimited' ? 'Processing...' : 'Subscribe'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Payments;
