
import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const AiFeatureComingSoon = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-primary/10 p-3 rounded-full mb-4">
        <Crown className="h-10 w-10 text-primary" />
      </div>
      
      <h1 className="text-2xl md:text-3xl font-bold mb-4">
        Premium Feature
      </h1>
      
      <p className="text-text-muted max-w-md mb-6">
        This advanced AI feature is available exclusively for premium subscribers. 
        Upgrade your plan to access personalized AI-powered workouts and nutrition guidance.
      </p>
      
      <Button 
        onClick={() => navigate('/subscription')}
        className="px-6"
      >
        Upgrade to Premium
      </Button>
    </div>
  );
};
