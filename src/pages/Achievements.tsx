
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkout } from "@/hooks/useWorkout";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

type Achievement = {
  id: string;
  name: string;
  description: string;
  threshold: number;
  icon: string;
  achieved: boolean;
  progress: number;
};

const AchievementBadge = ({ achievement }: { achievement: Achievement }) => {
  return (
    <div 
      className={`glass-card-hover p-4 ${achievement.achieved ? 'border-primary/40' : ''}`}
    >
      <div className="text-center mb-2">
        <span className="text-3xl">{achievement.icon}</span>
      </div>
      
      <h3 className="font-bold text-center mb-1">
        {achievement.name}
      </h3>
      
      <p className="text-text-muted text-sm text-center mb-3">
        {achievement.description}
      </p>
      
      <div className="relative h-2 bg-black/20 rounded-full overflow-hidden mb-2">
        <div 
          className={`absolute left-0 top-0 h-full ${achievement.achieved ? 'bg-primary' : 'bg-primary/40'}`}
          style={{ width: `${achievement.progress * 100}%` }}
        />
      </div>
      
      <div className="text-center">
        {achievement.achieved ? (
          <Badge className="bg-primary text-white">Achieved</Badge>
        ) : (
          <span className="text-xs text-muted-foreground">
            {Math.round(achievement.progress * 100)}% complete
          </span>
        )}
      </div>
    </div>
  );
};

export default function Achievements() {
  const { user } = useAuth();
  const { getAchievements, totalWeightLifted } = useWorkout();
  const [profile, setProfile] = useState<any>(null);
  const [locationTitles, setLocationTitles] = useState<{
    country: string;
    province: string;
    city: string;
  }>({
    country: 'Your Country',
    province: 'Your State/Province',
    city: 'Your City'
  });
  
  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);
  
  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
        
      if (error) throw error;
      
      setProfile(data);
      setLocationTitles({
        country: data.country || 'Your Country',
        province: data.province || 'Your State/Province',
        city: data.city || 'Your City'
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };
  
  const liftingAchievements = getAchievements();
  
  const workoutAchievements = [
    {
      id: 'first-workout',
      name: "First Workout",
      description: "Complete your first workout",
      threshold: 1,
      icon: "🏋️‍♂️",
      achieved: totalWeightLifted > 0,
      progress: totalWeightLifted > 0 ? 1 : 0
    },
    {
      id: 'workout-streak',
      name: "Workout Streak",
      description: "Complete workouts 3 days in a row",
      threshold: 3,
      icon: "🔥",
      achieved: false,
      progress: 0.33
    },
    {
      id: 'diverse-training',
      name: "Diverse Training",
      description: "Try all workout types",
      threshold: 4,
      icon: "🌟",
      achieved: false,
      progress: 0.5
    },
    {
      id: 'early-bird',
      name: "Early Bird",
      description: "Complete 5 workouts before 8 AM",
      threshold: 5,
      icon: "🌅",
      achieved: false,
      progress: 0.2
    },
    {
      id: 'night-owl',
      name: "Night Owl",
      description: "Complete 5 workouts after 8 PM",
      threshold: 5,
      icon: "🌙",
      achieved: false,
      progress: 0.6
    }
  ];
  
  const locationAchievements = [
    {
      id: 'local-hero',
      name: `${locationTitles.city} Hero`,
      description: `Top 10 in ${locationTitles.city}`,
      threshold: 1,
      icon: "🏆",
      achieved: false,
      progress: 0.7
    },
    {
      id: 'regional-champion',
      name: `${locationTitles.province} Champion`,
      description: `Top 50 in ${locationTitles.province}`,
      threshold: 1,
      icon: "🥇",
      achieved: false,
      progress: 0.3
    },
    {
      id: 'national-competitor',
      name: `${locationTitles.country} Competitor`,
      description: `Top 100 in ${locationTitles.country}`,
      threshold: 1,
      icon: "🏅",
      achieved: false,
      progress: 0.1
    },
    {
      id: 'global-athlete',
      name: "Global Athlete",
      description: "Top 1000 worldwide",
      threshold: 1,
      icon: "🌍",
      achieved: false,
      progress: 0.05
    }
  ];

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Achievements</h1>
        <p className="text-lg text-muted-foreground">
          Track your progress and earn badges as you reach fitness milestones
        </p>
      </div>
      
      <Tabs defaultValue="lifting">
        <TabsList className="mb-6">
          <TabsTrigger value="lifting">Lifting</TabsTrigger>
          <TabsTrigger value="workouts">Workouts</TabsTrigger>
          <TabsTrigger value="location">Location Rankings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="lifting">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Lifting Achievements</span>
                <span className="text-primary text-lg">
                  {totalWeightLifted.toLocaleString()} kg
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {liftingAchievements.map((achievement) => (
                  <AchievementBadge key={achievement.id} achievement={achievement} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="workouts">
          <Card>
            <CardHeader>
              <CardTitle>Workout Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {workoutAchievements.map((achievement) => (
                  <AchievementBadge key={achievement.id} achievement={achievement} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="location">
          <Card>
            <CardHeader>
              <CardTitle>Location-Based Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {locationAchievements.map((achievement) => (
                  <AchievementBadge key={achievement.id} achievement={achievement} />
                ))}
              </div>
              
              {(!profile?.country || !profile?.province) && (
                <div className="mt-6 p-4 bg-muted rounded-lg text-center">
                  <p className="mb-2">Update your location in settings to track location-based achievements!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
