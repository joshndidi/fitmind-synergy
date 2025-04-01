import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Medal, Award } from 'lucide-react';
import { toast } from 'sonner';

interface UserStats {
  id: string;
  username: string;
  avatar_url: string;
  total_workouts: number;
  total_duration: number;
  achievements_completed: number;
  rank: number;
}

export default function Leaderboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'all' | 'month' | 'week'>('all');

  useEffect(() => {
    fetchLeaderboard();
  }, [timeframe]);

  const fetchLeaderboard = async () => {
    try {
      let query = supabase
        .from('profiles')
        .select(`
          id,
          username,
          avatar_url,
          workouts(count),
          workout_logs(duration),
          achievements(count)
        `);

      if (timeframe === 'month') {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        query = query.gte('workout_logs.created_at', startOfMonth.toISOString());
      } else if (timeframe === 'week') {
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        query = query.gte('workout_logs.created_at', startOfWeek.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;

      const formattedUsers = data.map((user, index) => ({
        id: user.id,
        username: user.username,
        avatar_url: user.avatar_url,
        total_workouts: user.workouts[0].count || 0,
        total_duration: user.workout_logs.reduce((acc, log) => acc + (log.duration || 0), 0),
        achievements_completed: user.achievements[0].count || 0,
        rank: index + 1
      }));

      // Sort by total workouts and achievements
      formattedUsers.sort((a, b) => {
        const scoreA = a.total_workouts * 2 + a.achievements_completed;
        const scoreB = b.total_workouts * 2 + b.achievements_completed;
        return scoreB - scoreA;
      });

      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      toast.error('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold">{rank}</span>;
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
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-text-light mb-4">Leaderboard</h1>
        <p className="text-xl text-text-muted">
          See how you stack up against other fitness enthusiasts
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Top Performers</span>
            <div className="flex gap-2">
              <button
                className={`px-3 py-1 rounded-full text-sm ${
                  timeframe === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
                onClick={() => setTimeframe('all')}
              >
                All Time
              </button>
              <button
                className={`px-3 py-1 rounded-full text-sm ${
                  timeframe === 'month'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
                onClick={() => setTimeframe('month')}
              >
                This Month
              </button>
              <button
                className={`px-3 py-1 rounded-full text-sm ${
                  timeframe === 'week'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
                onClick={() => setTimeframe('week')}
              >
                This Week
              </button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  user.id === user?.id ? 'bg-primary/10' : 'bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getRankIcon(user.rank)}
                    <Avatar>
                      <AvatarImage src={user.avatar_url} />
                      <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <p className="font-medium">{user.username}</p>
                    <p className="text-sm text-text-muted">
                      {user.total_workouts} workouts • {user.achievements_completed} achievements
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{user.total_duration} min</p>
                  <p className="text-sm text-text-muted">Total Duration</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
