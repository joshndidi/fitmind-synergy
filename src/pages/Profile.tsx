import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dumbbell, Activity, Trophy, Target, Flame, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface UserProfile {
  username: string;
  avatar_url: string;
  bio: string;
  total_workouts: number;
  total_duration: number;
  achievements_completed: number;
  streak: number;
  join_date: string;
}

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          username,
          avatar_url,
          bio,
          created_at,
          workouts(count),
          workout_logs(duration),
          achievements(count),
          streaks(current_streak)
        `)
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      setProfile({
        username: data.username,
        avatar_url: data.avatar_url,
        bio: data.bio || '',
        total_workouts: data.workouts[0].count || 0,
        total_duration: data.workout_logs.reduce((acc, log) => acc + (log.duration || 0), 0),
        achievements_completed: data.achievements[0].count || 0,
        streak: data.streaks[0]?.current_streak || 0,
        join_date: data.created_at,
      });

      setFormData({
        username: data.username,
        bio: data.bio || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: formData.username,
          bio: formData.bio,
        })
        .eq('id', user?.id);

      if (error) throw error;

      setProfile(prev => prev ? {
        ...prev,
        username: formData.username,
        bio: formData.bio,
      } : null);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center">
        <p className="text-text-muted">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-text-light mb-4">Profile</h1>
        <p className="text-xl text-text-muted">
          Manage your profile and view your fitness journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6 mb-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.avatar_url} />
                  <AvatarFallback>{profile.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold text-text-light">{profile.username}</h2>
                  <p className="text-text-muted">Member since {new Date(profile.join_date).toLocaleDateString()}</p>
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleUpdateProfile}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-text-light mb-2">Bio</h3>
                    <p className="text-text-muted">{profile.bio || 'No bio yet'}</p>
                  </div>
                  <Button onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Dumbbell className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Total Workouts</h3>
                  </div>
                  <p className="text-2xl font-bold text-text-light">{profile.total_workouts}</p>
                </div>
                <div className="glass-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Total Duration</h3>
                  </div>
                  <p className="text-2xl font-bold text-text-light">{profile.total_duration} min</p>
                </div>
                <div className="glass-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Achievements</h3>
                  </div>
                  <p className="text-2xl font-bold text-text-light">{profile.achievements_completed}</p>
                </div>
                <div className="glass-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Flame className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Current Streak</h3>
                  </div>
                  <p className="text-2xl font-bold text-text-light">{profile.streak} days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/20">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Joined FitMind</p>
                    <p className="text-sm text-text-muted">
                      {new Date(profile.join_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/20">
                    <Target className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">First Workout</p>
                    <p className="text-sm text-text-muted">
                      {profile.total_workouts > 0 ? 'Completed' : 'Not started yet'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
