import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Trophy, 
  Medal, 
  Star, 
  Target, 
  Dumbbell,
  Flame,
  Award,
  Lock,
  CheckCircle2
} from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: "workout" | "strength" | "streak" | "social" | "special";
  icon: string;
  progress: number;
  maxProgress: number;
  reward: {
    type: "badge" | "title" | "theme";
    value: string;
  };
  unlocked: boolean;
  dateUnlocked?: string;
}

const mockAchievements: Achievement[] = [
  {
    id: "1",
    title: "First Workout",
    description: "Complete your first workout",
    category: "workout",
    icon: "🎯",
    progress: 1,
    maxProgress: 1,
    reward: {
      type: "badge",
      value: "First Steps"
    },
    unlocked: true,
    dateUnlocked: "2024-01-01"
  },
  {
    id: "2",
    title: "Strength Master",
    description: "Reach 100kg on bench press",
    category: "strength",
    icon: "💪",
    progress: 80,
    maxProgress: 100,
    reward: {
      type: "title",
      value: "Strength Master"
    },
    unlocked: false
  },
  {
    id: "3",
    title: "30 Day Streak",
    description: "Complete workouts for 30 days straight",
    category: "streak",
    icon: "🔥",
    progress: 15,
    maxProgress: 30,
    reward: {
      type: "badge",
      value: "Dedicated"
    },
    unlocked: false
  },
  {
    id: "4",
    title: "Social Butterfly",
    description: "Get 100 followers",
    category: "social",
    icon: "🦋",
    progress: 45,
    maxProgress: 100,
    reward: {
      type: "theme",
      value: "Social"
    },
    unlocked: false
  },
  {
    id: "5",
    title: "Workout Warrior",
    description: "Complete 100 workouts",
    category: "workout",
    icon: "⚔️",
    progress: 75,
    maxProgress: 100,
    reward: {
      type: "badge",
      value: "Warrior"
    },
    unlocked: false
  }
];

const categoryIcons = {
  workout: <Dumbbell className="w-5 h-5" />,
  strength: <Flame className="w-5 h-5" />,
  streak: <Target className="w-5 h-5" />,
  social: <Star className="w-5 h-5" />,
  special: <Award className="w-5 h-5" />
};

export function AchievementSystem() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredAchievements = selectedCategory === "all"
    ? mockAchievements
    : mockAchievements.filter(achievement => achievement.category === selectedCategory);

  const totalAchievements = mockAchievements.length;
  const unlockedAchievements = mockAchievements.filter(a => a.unlocked).length;
  const progress = (unlockedAchievements / totalAchievements) * 100;

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Achievements</h1>
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span className="text-lg font-semibold">
            {unlockedAchievements}/{totalAchievements}
          </span>
        </div>
      </div>

      <Card className="p-4 mb-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </Card>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <Button
          variant={selectedCategory === "all" ? "default" : "outline"}
          onClick={() => setSelectedCategory("all")}
        >
          All
        </Button>
        {Object.keys(categoryIcons).map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
          >
            {categoryIcons[category as keyof typeof categoryIcons]}
            <span className="ml-2 capitalize">{category}</span>
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((achievement) => (
          <Card key={achievement.id} className="p-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">{achievement.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{achievement.title}</h3>
                  {achievement.unlocked ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {achievement.description}
                </p>
                <div className="mt-2">
                  <Badge variant="secondary">
                    {achievement.reward.type === "badge" && "🏆"}
                    {achievement.reward.type === "title" && "👑"}
                    {achievement.reward.type === "theme" && "🎨"}
                    {achievement.reward.value}
                  </Badge>
                </div>
                {achievement.unlocked && achievement.dateUnlocked && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Unlocked: {new Date(achievement.dateUnlocked).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            {!achievement.unlocked && (
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{achievement.progress}/{achievement.maxProgress}</span>
                </div>
                <Progress 
                  value={(achievement.progress / achievement.maxProgress) * 100} 
                  className="h-2"
                />
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
} 