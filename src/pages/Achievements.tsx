import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Medal, Target, Flame, Dumbbell, Calendar, Award, Star } from 'lucide-react';
import { toast } from 'sonner';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  progress: number;
  total: number;
  is_completed: boolean;
  completed_at?: string;
}

export default function Achievements() {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select(`
          *,
          user_achievements!inner(
            progress,
            completed_at
          )
        `)
        .eq('user_id', user?.id);

      if (error) throw error;

      const formattedAchievements = data.map(achievement => ({
        id: achievement.id,
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        progress: achievement.user_achievements[0]?.progress || 0,
        total: achievement.total,
        is_completed: achievement.user_achievements[0]?.completed_at !== null,
        completed_at: achievement.user_achievements[0]?.completed_at
      }));

      setAchievements(formattedAchievements);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      toast.error('Failed to load achievements');
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'trophy':
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 'medal':
        return <Medal className="h-6 w-6 text-blue-500" />;
      case 'award':
        return <Award className="h-6 w-6 text-purple-500" />;
      case 'star':
        return <Star className="h-6 w-6 text-orange-500" />;
      case 'target':
        return <Target className="h-6 w-6 text-red-500" />;
      case 'flame':
        return <Flame className="h-6 w-6 text-orange-500" />;
      default:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

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
                    .filter(achievement => category === 'all' || achievement.icon === category)
                    .map(achievement => (
                      <Card key={achievement.id} className={`transition-all duration-300 ${achievement.is_completed ? 'border-primary/50' : ''}`}>
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-lg ${getRarityColor(achievement.icon)} text-white`}>
                              {getIcon(achievement.icon)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-semibold flex items-center gap-2">
                                    {achievement.name}
                                    {achievement.is_completed && (
                                      <Badge variant="secondary" className="ml-2">
                                        Completed
                                      </Badge>
                                    )}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                                </div>
                                <Badge>
                                  {achievement.icon.charAt(0).toUpperCase() + achievement.icon.slice(1)}
                                </Badge>
                              </div>
                              <div className="mt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Progress</span>
                                  <span>{achievement.progress} / {achievement.total}</span>
                                </div>
                                <Progress value={(achievement.progress / achievement.total) * 100} />
                              </div>
                              {achievement.completed_at && (
                                <p className="text-sm text-muted-foreground mt-2">
                                  Earned on {new Date(achievement.completed_at).toLocaleDateString()}
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
                      {achievements.filter(a => a.is_completed).length} / {achievements.length}
                    </span>
                  </div>
                  <Progress 
                    value={(achievements.filter(a => a.is_completed).length / achievements.length) * 100} 
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Rarity Breakdown</h4>
                  <div className="space-y-3">
                    {achievements.map((achievement) => (
                      <div key={achievement.icon} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getRarityColor(achievement.icon)}`} />
                          <span className="capitalize">{achievement.icon}</span>
                        </div>
                        <span>{achievements.filter(a => a.icon === achievement.icon).length}</span>
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
                  .filter(a => a.is_completed)
                  .sort((a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime())
                  .slice(0, 3)
                  .map(achievement => (
                    <div key={achievement.id} className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getRarityColor(achievement.icon)} text-white`}>
                        {getIcon(achievement.icon)}
                      </div>
                      <div>
                        <p className="font-medium">{achievement.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(achievement.completed_at!).toLocaleDateString()}
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
}

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