
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Trophy, Dumbbell, Calendar, Activity, Brain } from 'lucide-react';
import { useWorkout } from "@/hooks/useWorkout";
import { useAuth } from "../context/AuthContext";
import AchievementsDisplay from '@/components/AchievementsDisplay';

const Achievements = () => {
  const { user } = useAuth();
  const { completedWorkouts, totalWeightLifted, getAchievements } = useWorkout();
  const achievements = getAchievements();
  const [streakData, setStreakData] = useState({ current: 0, longest: 0 });

  useEffect(() => {
    calculateStreaks();
  }, [completedWorkouts]);

  const calculateStreaks = () => {
    // Add real streak calculation logic based on completedWorkouts
    // This is a simplified version
    setStreakData({
      current: Math.min(14, completedWorkouts.length),
      longest: Math.max(14, completedWorkouts.length)
    });
  };

  const statCards = [
    {
      title: "Total Workouts",
      value: completedWorkouts.length,
      icon: <Dumbbell className="h-6 w-6 text-primary" />,
      description: "Completed workouts"
    },
    {
      title: "Weight Lifted",
      value: `${totalWeightLifted.toLocaleString()} kg`,
      icon: <Trophy className="h-6 w-6 text-primary" />,
      description: "Total weight lifted"
    },
    {
      title: "Current Streak",
      value: `${streakData.current} days`,
      icon: <Calendar className="h-6 w-6 text-primary" />,
      description: "Consecutive days active"
    },
    {
      title: "Longest Streak",
      value: `${streakData.longest} days`,
      icon: <Activity className="h-6 w-6 text-primary" />,
      description: "Best active streak"
    },
  ];

  const personalBests = [
    { exercise: "Bench Press", weight: "100 kg", date: "2023-09-15" },
    { exercise: "Squat", weight: "150 kg", date: "2023-09-10" },
    { exercise: "Deadlift", weight: "180 kg", date: "2023-09-20" },
    { exercise: "Shoulder Press", weight: "70 kg", date: "2023-09-05" }
  ];

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-2 text-text-light">Achievements</h1>
      <p className="text-text-muted mb-8">Track your progress and celebrate your milestones</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Card key={index} className="glass-card hover:bg-white/5 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-text-muted text-sm">{stat.title}</p>
                  <p className="text-text-light text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-text-muted text-xs mt-1">{stat.description}</p>
                </div>
                <div className="p-2 rounded-full bg-primary/10">
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Lifting Achievements */}
      <div className="mb-8">
        <AchievementsDisplay />
      </div>

      {/* Workout Milestones */}
      <Card className="glass-card mb-8">
        <CardHeader>
          <CardTitle className="text-text-light flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" /> Workout Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "First Workout", icon: <Dumbbell />, completed: completedWorkouts.length > 0, date: "Aug 15, 2023" },
              { title: "10 Workouts", icon: <Dumbbell />, completed: completedWorkouts.length >= 10, date: "Sep 5, 2023" },
              { title: "30 Workouts", icon: <Trophy />, completed: completedWorkouts.length >= 30, date: "Oct 12, 2023" },
              { title: "5-Day Streak", icon: <Calendar />, completed: streakData.longest >= 5, date: "Sep 10, 2023" },
              { title: "14-Day Streak", icon: <Calendar />, completed: streakData.longest >= 14, date: "Nov 1, 2023" },
              { title: "30-Day Streak", icon: <Trophy />, completed: streakData.longest >= 30, date: "Locked" }
            ].map((milestone, index) => (
              <div 
                key={index} 
                className={`glass-card p-4 text-center ${milestone.completed ? 'border-primary/40' : 'opacity-70'}`}
              >
                <div className={`p-3 rounded-full mx-auto w-fit mb-2 ${milestone.completed ? 'bg-primary/20' : 'bg-white/10'}`}>
                  <div className={milestone.completed ? 'text-primary' : 'text-text-muted'}>
                    {React.cloneElement(milestone.icon as React.ReactElement, { size: 24 })}
                  </div>
                </div>
                <h3 className="font-medium text-text-light mb-1">{milestone.title}</h3>
                <div className="flex justify-center items-center gap-2">
                  {milestone.completed ? (
                    <>
                      <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded">Completed</span>
                      <span className="text-text-muted text-xs">{milestone.date}</span>
                    </>
                  ) : (
                    <span className="text-text-muted text-xs">Not yet achieved</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Personal Bests */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-text-light flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" /> Personal Bests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-text-muted border-b border-white/10">
                  <th className="py-3 px-4 text-left">Exercise</th>
                  <th className="py-3 px-4 text-right">Best Weight</th>
                  <th className="py-3 px-4 text-right">Date Achieved</th>
                </tr>
              </thead>
              <tbody>
                {personalBests.map((best, index) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 font-medium text-text-light">{best.exercise}</td>
                    <td className="py-4 px-4 text-right text-primary font-bold">{best.weight}</td>
                    <td className="py-4 px-4 text-right text-text-muted">{best.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Achievements;
