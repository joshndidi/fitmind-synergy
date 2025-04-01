
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkout } from "@/hooks/useWorkout";
import { Progress } from "@/components/ui/progress";
import { Award, Trophy, Dumbbell, Flame, Calendar, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const Achievements = () => {
  const { completedWorkouts, totalWeightLifted, getAchievements } = useWorkout();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState<any[]>([]);
  
  useEffect(() => {
    setAchievements(getAchievements());
  }, [totalWeightLifted, getAchievements]);
  
  // Calculate workout streaks (days in a row)
  const calculateStreak = () => {
    if (completedWorkouts.length === 0) return 0;
    
    let streak = 1;
    let maxStreak = 1;
    
    // Sort workouts by date (newest first)
    const sortedWorkouts = [...completedWorkouts].sort((a, b) => {
      return new Date(b.completedDate || b.date).getTime() - 
             new Date(a.completedDate || a.date).getTime();
    });
    
    // Get unique dates (one workout per day counts)
    const uniqueDates = [...new Set(sortedWorkouts.map(w => 
      new Date(w.completedDate || w.date).toDateString()
    ))];
    
    // Calculate streak
    for (let i = 1; i < uniqueDates.length; i++) {
      const current = new Date(uniqueDates[i]);
      const prev = new Date(uniqueDates[i-1]);
      
      // Check if days are consecutive
      const diffTime = Math.abs(prev.getTime() - current.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        streak++;
        maxStreak = Math.max(maxStreak, streak);
      } else {
        streak = 1;
      }
    }
    
    return maxStreak;
  };
  
  // Calculate total stats
  const totalWorkouts = completedWorkouts.length;
  const totalCalories = completedWorkouts.reduce((sum, w) => sum + w.calories, 0);
  const streak = calculateStreak();
  
  // Additional achievements
  const additionalAchievements = [
    {
      id: "workouts10",
      name: "Workout Warrior",
      description: "Complete 10 workouts",
      threshold: 10,
      icon: <Dumbbell className="w-8 h-8 text-primary" />,
      achieved: totalWorkouts >= 10,
      progress: Math.min(1, totalWorkouts / 10)
    },
    {
      id: "calories5000",
      name: "Calorie Crusher",
      description: "Burn 5,000 calories total",
      threshold: 5000,
      icon: <Flame className="w-8 h-8 text-primary" />,
      achieved: totalCalories >= 5000,
      progress: Math.min(1, totalCalories / 5000)
    },
    {
      id: "streak3",
      name: "Consistency King",
      description: "Achieve a 3-day workout streak",
      threshold: 3,
      icon: <Calendar className="w-8 h-8 text-primary" />,
      achieved: streak >= 3,
      progress: Math.min(1, streak / 3)
    }
  ];
  
  // Combine all achievements
  const allAchievements = [...achievements, ...additionalAchievements];
  
  // Prompt to login if not authenticated
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 animate-fade-in">
        <h1 className="text-3xl font-bold mb-8 text-text-light">Achievements</h1>
        
        <Card className="glass-card text-center py-10">
          <CardContent>
            <Trophy className="w-16 h-16 mx-auto mb-4 text-primary opacity-50" />
            <h2 className="text-2xl font-bold text-text-light mb-4">Login to Track Your Achievements</h2>
            <p className="text-text-muted mb-6">
              Create an account to start tracking your fitness achievements and milestones.
            </p>
            <Button onClick={() => navigate("/auth")} className="bg-primary text-white px-6">
              Login or Sign Up
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8 text-text-light">Achievements</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted">Total Workouts</p>
                <p className="text-3xl font-bold text-text-light">{totalWorkouts}</p>
              </div>
              <div className="p-4 bg-primary/10 rounded-full">
                <Dumbbell className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted">Weight Lifted</p>
                <p className="text-3xl font-bold text-text-light">{totalWeightLifted.toLocaleString()} lbs</p>
              </div>
              <div className="p-4 bg-primary/10 rounded-full">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted">Best Streak</p>
                <p className="text-3xl font-bold text-text-light">{streak} days</p>
              </div>
              <div className="p-4 bg-primary/10 rounded-full">
                <Flame className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allAchievements.map(achievement => (
          <Card 
            key={achievement.id}
            className={`glass-card transition-all ${
              achievement.achieved 
                ? 'border-primary/30 bg-primary/5' 
                : 'glass-card-hover'
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-full ${
                  achievement.achieved ? 'bg-primary/20' : 'bg-white/10'
                }`}>
                  {achievement.icon || <Award className="w-8 h-8 text-primary" />}
                </div>
                <div className="ml-4">
                  <h3 className="font-bold text-text-light text-lg">{achievement.name}</h3>
                  <p className="text-text-muted text-sm">{achievement.description}</p>
                </div>
                {achievement.achieved && (
                  <Star className="ml-auto h-5 w-5 text-yellow-500" fill="currentColor" />
                )}
              </div>
              
              <div className="mt-2">
                <div className="flex justify-between text-sm text-text-muted mb-1">
                  <span>Progress</span>
                  <span>{Math.round(achievement.progress * 100)}%</span>
                </div>
                <Progress value={achievement.progress * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
