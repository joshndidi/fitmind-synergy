
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Dumbbell, Calendar, Activity, Zap, Award } from 'lucide-react';
import { useWorkout } from "@/hooks/useWorkout";
import { useAuth } from "../context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Achievements = () => {
  const { user } = useAuth();
  const { completedWorkouts, totalWeightLifted } = useWorkout();
  const [streakCount, setStreakCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (user) {
      calculateStreak();
    } else {
      setLoading(false);
    }
  }, [user, completedWorkouts]);
  
  const calculateStreak = async () => {
    try {
      const { data, error } = await supabase
        .from('workout_logs')
        .select('completed_at')
        .eq('user_id', user?.id)
        .order('completed_at', { ascending: false });
        
      if (error) throw error;
      
      // Simple streak calculation
      let streak = 0;
      let currentDate = new Date();
      
      if (data && data.length > 0) {
        // Sort dates in descending order
        const sortedDates = data
          .map(item => new Date(item.completed_at))
          .sort((a, b) => b.getTime() - a.getTime());
          
        // Check for consecutive days
        let prevDate: Date | null = null;
        
        for (const date of sortedDates) {
          // Format to date string to ignore time
          const dateStr = date.toDateString();
          const currentDateStr = currentDate.toDateString();
          
          if (prevDate === null) {
            // First date in streak
            if (dateStr === currentDateStr || 
                dateStr === new Date(currentDate.getTime() - 86400000).toDateString()) {
              streak = 1;
              prevDate = date;
            } else {
              // First workout is not from today or yesterday, no streak
              break;
            }
          } else {
            const prevDateStr = prevDate.toDateString();
            const expectedPrevDateStr = new Date(date.getTime() + 86400000).toDateString();
            
            if (prevDateStr === expectedPrevDateStr) {
              // Dates are consecutive
              streak++;
              prevDate = date;
            } else {
              // Streak is broken
              break;
            }
          }
        }
      }
      
      setStreakCount(streak);
      setLoading(false);
    } catch (error) {
      console.error('Error calculating streak:', error);
      setLoading(false);
    }
  };
  
  const achievements = [
    {
      name: "First Workout",
      icon: <Trophy className="h-12 w-12 text-yellow-500" />,
      description: "Complete your first workout",
      progress: Math.min(completedWorkouts.length, 1),
      total: 1,
      achieved: completedWorkouts.length >= 1,
      color: "bg-yellow-500"
    },
    {
      name: "Consistency Champion",
      icon: <Calendar className="h-12 w-12 text-green-500" />,
      description: "Maintain a 5-day workout streak",
      progress: Math.min(streakCount, 5),
      total: 5,
      achieved: streakCount >= 5,
      color: "bg-green-500"
    },
    {
      name: "Weight Warrior",
      icon: <Dumbbell className="h-12 w-12 text-blue-500" />,
      description: "Lift 1000kg total weight",
      progress: Math.min(totalWeightLifted, 1000),
      total: 1000,
      achieved: totalWeightLifted >= 1000,
      color: "bg-blue-500"
    },
    {
      name: "Workout Master",
      icon: <Activity className="h-12 w-12 text-purple-500" />,
      description: "Complete 10 workouts",
      progress: Math.min(completedWorkouts.length, 10),
      total: 10,
      achieved: completedWorkouts.length >= 10,
      color: "bg-purple-500"
    },
    {
      name: "Iron Legend",
      icon: <Award className="h-12 w-12 text-red-500" />,
      description: "Lift 5000kg total weight",
      progress: Math.min(totalWeightLifted, 5000),
      total: 5000,
      achieved: totalWeightLifted >= 5000,
      color: "bg-red-500"
    },
    {
      name: "Dedication Master",
      icon: <Zap className="h-12 w-12 text-amber-500" />,
      description: "Complete 30 workouts",
      progress: Math.min(completedWorkouts.length, 30),
      total: 30,
      achieved: completedWorkouts.length >= 30,
      color: "bg-amber-500"
    }
  ];
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8 text-text-light">Achievements</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement, index) => (
          <Card 
            key={index} 
            className={`glass-card ${achievement.achieved ? 'border-2 border-primary/30' : ''} hover:shadow-lg transition-all`}
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-text-light">{achievement.name}</CardTitle>
              <div className={`p-2 rounded-full ${achievement.achieved ? 'bg-primary/20' : 'bg-gray-800'}`}>
                {achievement.icon}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-text-muted">{achievement.description}</div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-light">Progress</span>
                  <span className="text-text-light">
                    {achievement.progress} / {achievement.total}
                  </span>
                </div>
                <Progress 
                  value={(achievement.progress / achievement.total) * 100} 
                  className={`h-2 ${achievement.achieved ? achievement.color : ''}`}
                />
              </div>
              
              {achievement.achieved && (
                <div className="mt-2 text-center">
                  <span className="inline-block px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                    Achievement Unlocked!
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
