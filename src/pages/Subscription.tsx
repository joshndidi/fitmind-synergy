
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Dumbbell } from "lucide-react";
import SubscriptionCard from "../components/SubscriptionCard";
import { useAuth } from "../context/AuthContext";

const Subscription = () => {
  const { user } = useAuth();
  
  const premiumPlan = {
    id: "premium",
    name: "Premium",
    price: "£5",
    period: "month",
    description: "Unlock the full potential of your fitness and mental wellness",
    features: [
      { text: "Track workouts and progress", available: true },
      { text: "Calculate weight lifted", available: true },
      { text: "View leaderboard rankings", available: true },
      { text: "AI Workout Generator", available: true },
      { text: "AI Calorie Tracker", available: true },
      { text: "Advanced analytics and insights", available: true },
      { text: "Unlimited workout history", available: true },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-4 text-text-light">Premium Subscription</h1>
      <p className="text-text-muted mb-8 max-w-3xl">
        Upgrade your fitness journey with AI-powered features and personalized recommendations.
      </p>
      
      <div className="mb-12">
        <SubscriptionCard plan={premiumPlan} />
      </div>
      
      <div className="glass-card p-6 mb-12">
        <h2 className="text-2xl font-bold mb-6 text-text-light">Why Go Premium?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex gap-4">
            <div className="bg-primary/10 p-3 h-fit rounded-full">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-text-light mb-2">AI-Powered Workouts</h3>
              <p className="text-text-muted">
                Our AI analyzes your goals, fitness level, and availability to create customized workout plans
                that adapt as you progress. Get the perfect workout for your specific needs.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-primary/10 p-3 h-fit rounded-full">
              <Dumbbell className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-text-light mb-2">AI Calorie Tracker</h3>
              <p className="text-text-muted">
                Simply take a photo of your meal and our AI will analyze its nutritional content,
                providing accurate calorie, protein, carbs, and fat estimates to help you stay on track.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-text-light">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {[
            {
              question: "How do I cancel my subscription?",
              answer: "You can cancel your subscription at any time from your account settings. Your premium features will remain active until the end of your billing period."
            },
            {
              question: "Is there a free trial for premium features?",
              answer: "We occasionally offer free 7-day trials for new users. Check your email for special promotions or contact our support team."
            },
            {
              question: "Will I lose my data if I downgrade?",
              answer: "No, all your workout history and data will be preserved. However, you'll lose access to premium features like AI workout generation."
            }
          ].map((faq, index) => (
            <div key={index} className="glass-card p-4">
              <h3 className="text-lg font-medium text-text-light mb-2">{faq.question}</h3>
              <p className="text-text-muted">{faq.answer}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Subscription;
