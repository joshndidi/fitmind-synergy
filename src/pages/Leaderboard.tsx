
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Medal, Award, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UserStats {
  id: string;
  display_name: string;
  avatar_url: string;
  total_weight: number;
  workout_count: number;
  country: string | null;
  province: string | null;
  city: string | null;
  rank: number;
}

export default function Leaderboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'all' | 'month' | 'week'>('all');
  const [locationFilter, setLocationFilter] = useState<'world' | 'country' | 'province'>('world');
  const [userProfile, setUserProfile] = useState<{country: string | null, province: string | null, city: string | null}>({
    country: null,
    province: null,
    city: null
  });
  
  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);
  
  useEffect(() => {
    fetchLeaderboard();
  }, [timeframe, locationFilter, userProfile]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('country, province, city')
        .eq('id', user?.id)
        .single();
        
      if (error) throw error;
      
      setUserProfile({
        country: data.country,
        province: data.province,
        city: data.city
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('profiles')
        .select(`
          id,
          display_name,
          avatar_url,
          country,
          province,
          city,
          (
            SELECT SUM(total_weight)
            FROM completed_workouts
            WHERE user_id = profiles.id
            ${timeframe === 'month' ? 'AND completed_at > date_trunc(\'month\', now())' : ''}
            ${timeframe === 'week' ? 'AND completed_at > date_trunc(\'week\', now())' : ''}
          ) as total_weight,
          (
            SELECT COUNT(*)
            FROM completed_workouts
            WHERE user_id = profiles.id
            ${timeframe === 'month' ? 'AND completed_at > date_trunc(\'month\', now())' : ''}
            ${timeframe === 'week' ? 'AND completed_at > date_trunc(\'week\', now())' : ''}
          ) as workout_count
        `)
        .order('total_weight', { ascending: false })
        .limit(100);
        
      // Apply location filters if needed
      if (locationFilter === 'country' && userProfile.country) {
        query = query.eq('country', userProfile.country);
      } else if (locationFilter === 'province' && userProfile.province) {
        query = query.eq('province', userProfile.province);
      }

      const { data, error } = await query;

      if (error) throw error;

      const formattedUsers = data
        .filter(user => user.total_weight !== null)
        .map((user, index) => ({
          id: user.id,
          display_name: user.display_name || 'Anonymous User',
          avatar_url: user.avatar_url,
          total_weight: user.total_weight || 0,
          workout_count: user.workout_count || 0,
          country: user.country,
          province: user.province,
          city: user.city,
          rank: index + 1
        }));

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

  const getLocationName = () => {
    switch (locationFilter) {
      case 'country':
        return userProfile.country || 'Your Country';
      case 'province':
        return userProfile.province || 'Your State/Province';
      default:
        return 'Global';
    }
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Leaderboard</h1>
          <p className="text-xl text-muted-foreground">
            See how you stack up against other fitness enthusiasts
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between flex-wrap gap-4">
              <span>Top Performers</span>
              <div className="flex flex-wrap gap-2 sm:gap-4">
                <Select 
                  value={locationFilter} 
                  onValueChange={(value: 'world' | 'country' | 'province') => setLocationFilter(value)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Filter by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="world">Global</SelectItem>
                    <SelectItem value="country" disabled={!userProfile.country}>Country</SelectItem>
                    <SelectItem value="province" disabled={!userProfile.province}>State/Province</SelectItem>
                  </SelectContent>
                </Select>
                <Tabs defaultValue="all" value={timeframe} onValueChange={(v) => setTimeframe(v as any)}>
                  <TabsList>
                    <TabsTrigger value="all">All Time</TabsTrigger>
                    <TabsTrigger value="month">This Month</TabsTrigger>
                    <TabsTrigger value="week">This Week</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-primary" />
              <span className="font-medium">{getLocationName()} Rankings</span>
            </div>
            <div className="space-y-4">
              {users.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No data available for this selection
                </div>
              ) : (
                users.map((userData) => (
                  <div
                    key={userData.id}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      userData.id === user?.id ? 'bg-primary/10' : 'bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8">
                        {getRankIcon(userData.rank)}
                      </div>
                      <Avatar>
                        <AvatarImage src={userData.avatar_url || ''} />
                        <AvatarFallback>{userData.display_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{userData.display_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {userData.country || ''} {userData.province ? `• ${userData.province}` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{userData.total_weight.toLocaleString()} kg</p>
                      <p className="text-sm text-muted-foreground">{userData.workout_count} workouts</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
