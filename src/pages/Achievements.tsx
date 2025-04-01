import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Medal, Target, Flame, Dumbbell, Calendar, Award, Star } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  progress: number;
  total: number;
  completed: boolean;
  category: 'workout' | 'strength' | 'cardio' | 'consistency';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  dateEarned?: string;
}

const Achievements = () => {
  const [achievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first workout',
      icon: <Trophy className="h-6 w-6" />,
      progress: 1,
      total: 1,
      completed: true,
      category: 'workout',
      rarity: 'common',
      dateEarned: '2024-03-15'
    },
    {
      id: '2',
      title: 'Strength Master',
      description: 'Lift 1000kg total weight',
      icon: <Dumbbell className="h-6 w-6" />,
      progress: 850,
      total: 1000,
      completed: false,
      category: 'strength',
      rarity: 'epic'
    },
    {
      id: '3',
      title: 'Consistency King',
      description: 'Complete workouts for 30 consecutive days',
      icon: <Flame className="h-6 w-6" />,
      progress: 12,
      total: 30,
      completed: false,
      category: 'consistency',
      rarity: 'legendary'
    },
    {
      id: '4',
      title: 'Cardio Champion',
      description: 'Run a total of 100km',
      icon: <Target className="h-6 w-6" />,
      progress: 75,
      total: 100,
      completed: false,
      category: 'cardio',
      rarity: 'rare'
    },
    {
      id: '5',
      title: 'Early Bird',
      description: 'Complete 10 morning workouts',
      icon: <Calendar className="h-6 w-6" />,
      progress: 10,
      total: 10,
      completed: true,
      category: 'consistency',
      rarity: 'common',
      dateEarned: '2024-03-10'
    },
    {
      id: '6',
      title: 'Weight Warrior',
      description: 'Set 5 personal records in strength exercises',
      icon: <Award className="h-6 w-6" />,
      progress: 3,
      total: 5,
      completed: false,
      category: 'strength',
      rarity: 'rare'
    }
  ]);

  const stats = {
    totalAchievements: achievements.length,
    completedAchievements: achievements.filter(a => a.completed).length,
    rarity: {
      common: achievements.filter(a => a.rarity === 'common').length,
      rare: achievements.filter(a => a.rarity === 'rare').length,
      epic: achievements.filter(a => a.rarity === 'epic').length,
      legendary: achievements.filter(a => a.rarity === 'legendary').length
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-500';
      case 'rare':
        return 'bg-blue-500';
      case 'epic':
        return 'bg-purple-500';
      case 'legendary':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto py-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold flex items-center gap-2">
          <Trophy className="h-8 w-8" />
          Achievements
        </h1>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-12">
        <div className="md:col-span-8">
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="workout">Workout</TabsTrigger>
              <TabsTrigger value="strength">Strength</TabsTrigger>
              <TabsTrigger value="cardio">Cardio</TabsTrigger>
              <TabsTrigger value="consistency">Consistency</TabsTrigger>
            </TabsList>

            {['all', 'workout', 'strength', 'cardio', 'consistency'].map((category) => (
              <TabsContent key={category} value={category}>
                <div className="grid gap-4 grid-cols-1">
                  {achievements
                    .filter(achievement => category === 'all' || achievement.category === category)
                    .map(achievement => (
                      <Card key={achievement.id} className={`transition-all duration-300 ${achievement.completed ? 'border-primary/50' : ''}`}>
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-lg ${getRarityColor(achievement.rarity)} text-white`}>
                              {achievement.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-semibold flex items-center gap-2">
                                    {achievement.title}
                                    {achievement.completed && (
                                      <Badge variant="secondary" className="ml-2">
                                        Completed
                                      </Badge>
                                    )}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                                </div>
                                <Badge>
                                  {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
                                </Badge>
                              </div>
                              <div className="mt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Progress</span>
                                  <span>{achievement.progress} / {achievement.total}</span>
                                </div>
                                <Progress value={(achievement.progress / achievement.total) * 100} />
                              </div>
                              {achievement.dateEarned && (
                                <p className="text-sm text-muted-foreground mt-2">
                                  Earned on {new Date(achievement.dateEarned).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div className="md:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Achievement Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span>Total Progress</span>
                    <span className="font-medium">
                      {stats.completedAchievements} / {stats.totalAchievements}
                    </span>
                  </div>
                  <Progress 
                    value={(stats.completedAchievements / stats.totalAchievements) * 100} 
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Rarity Breakdown</h4>
                  <div className="space-y-3">
                    {Object.entries(stats.rarity).map(([rarity, count]) => (
                      <div key={rarity} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getRarityColor(rarity)}`} />
                          <span className="capitalize">{rarity}</span>
                        </div>
                        <span>{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Medal className="h-5 w-5" />
                Recent Unlocks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements
                  .filter(a => a.completed)
                  .sort((a, b) => new Date(b.dateEarned!).getTime() - new Date(a.dateEarned!).getTime())
                  .slice(0, 3)
                  .map(achievement => (
                    <div key={achievement.id} className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getRarityColor(achievement.rarity)} text-white`}>
                        {achievement.icon}
                      </div>
                      <div>
                        <p className="font-medium">{achievement.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(achievement.dateEarned!).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Achievements; 