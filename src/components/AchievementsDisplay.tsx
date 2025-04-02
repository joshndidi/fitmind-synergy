
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWorkout } from "@/hooks/useWorkout";

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
      
      <h3 className="font-bold text-text-light text-center mb-1">
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
          <span className="text-xs text-text-muted">
            {Math.round(achievement.progress * 100)}% complete
          </span>
        )}
      </div>
    </div>
  );
};

const AchievementsDisplay = () => {
  const { getAchievements, totalWeightLifted } = useWorkout();
  const achievements = getAchievements();
  
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-text-light flex justify-between items-center">
          <span>Lifting Achievements</span>
          <span className="text-primary text-lg">
            {totalWeightLifted.toLocaleString()} kg
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <AchievementBadge key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementsDisplay;
