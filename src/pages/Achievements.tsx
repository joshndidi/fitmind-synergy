
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Award, Dumbbell, Flame, Clock, Trophy, Target } from "lucide-react";
import { toast } from "sonner";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  total: number;
  unlocked: boolean;
}

const Achievements = () => {
  const { user } = useAuth();
  const [workoutCount, setWorkoutCount] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserStats();
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      generateAchievements();
    }
  }, [workoutCount, totalWeight, user]);

  const fetchUserStats = async () => {
    try {
      setLoading(true);

      // Get workout count
      const { count: workoutCountResult, error: countError } = await supabase
        .from('workout_logs')
        .select('*', { count: 'exact' })
        .eq('user_id', user?.id);

      if (countError) throw countError;

      // Get total weight lifted
      const { data: workouts, error: workoutsError } = await supabase
        .from('workout_logs')
        .select('total_weight')
        .eq('user_id', user?.id);

      if (workoutsError) throw workoutsError;

      // Calculate total weight from all workouts
      const calculatedTotalWeight = workouts.reduce((sum, workout) => sum + (workout.total_weight || 0), 0);

      setWorkoutCount(workoutCountResult || 0);
      setTotalWeight(calculatedTotalWeight);
    } catch (error) {
      console.error('Error fetching user stats:', error);
      toast.error('Failed to load your achievements');
    } finally {
      setLoading(false);
    }
  };

  const generateAchievements = () => {
    const achievementsList: Achievement[] = [
      {
        id: 'first-workout',
        title: 'First Steps',
        description: 'Complete your first workout',
        icon: <Award className="h-8 w-8 text-yellow-500" />,
        progress: Math.min(workoutCount, 1),
        total: 1,
        unlocked: workoutCount >= 1
      },
      {
        id: 'five-workouts',
        title: 'Getting Consistent',
        description: 'Complete 5 workouts',
        icon: <Dumbbell className="h-8 w-8 text-blue-500" />,
        progress: Math.min(workoutCount, 5),
        total: 5,
        unlocked: workoutCount >= 5
      },
      {
        id: 'ten-workouts',
        title: 'Workout Warrior',
        description: 'Complete 10 workouts',
        icon: <Flame className="h-8 w-8 text-orange-500" />,
        progress: Math.min(workoutCount, 10),
        total: 10,
        unlocked: workoutCount >= 10
      },
      {
        id: 'weight-milestone-1',
        title: 'Weight Lifter',
        description: 'Lift a total of 1,000 kg across all workouts',
        icon: <Trophy className="h-8 w-8 text-purple-500" />,
        progress: Math.min(totalWeight, 1000),
        total: 1000,
        unlocked: totalWeight >= 1000
      },
      {
        id: 'weight-milestone-2',
        title: 'Heavy Lifter',
        description: 'Lift a total of 5,000 kg across all workouts',
        icon: <Trophy className="h-8 w-8 text-indigo-500" />,
        progress: Math.min(totalWeight, 5000),
        total: 5000,
        unlocked: totalWeight >= 5000
      },
      {
        id: 'weight-milestone-3',
        title: 'Strength Master',
        description: 'Lift a total of 10,000 kg across all workouts',
        icon: <Trophy className="h-8 w-8 text-rose-500" />,
        progress: Math.min(totalWeight, 10000),
        total: 10000,
        unlocked: totalWeight >= 10000
      },
    ];

    setAchievements(achievementsList);
  };

  if (!user) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Trophy className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Sign In to View Achievements</h2>
            <p className="text-muted-foreground">
              Log in to track your fitness achievements and milestones.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Your Achievements</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Workouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Dumbbell className="h-8 w-8 text-primary mr-3" />
              <span className="text-3xl font-bold">{workoutCount}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Weight Lifted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-primary mr-3" />
              <span className="text-3xl font-bold">{totalWeight.toLocaleString()} kg</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Achievements Unlocked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Award className="h-8 w-8 text-primary mr-3" />
              <span className="text-3xl font-bold">
                {achievements.filter(a => a.unlocked).length}/{achievements.length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {achievements.map((achievement) => (
          <Card 
            key={achievement.id} 
            className={`transition-all ${
              achievement.unlocked 
                ? "border-primary" 
                : "opacity-75"
            }`}
          >
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className={`rounded-full p-2 ${achievement.unlocked ? "bg-primary/10" : "bg-muted"}`}>
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold">{achievement.title}</h3>
                    {achievement.unlocked && (
                      <Badge variant="outline" className="border-green-500 text-green-500">Unlocked</Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">{achievement.description}</p>
                  
                  <div className="w-full bg-secondary rounded-full h-2.5 mb-1">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Progress: {achievement.progress}/{achievement.total}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
