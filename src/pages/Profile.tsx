
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dumbbell, Activity, Trophy, Target, Flame, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileData {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  fitness_goal: string | null;
  created_at: string;
}

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [stats, setStats] = useState({
    total_workouts: 0,
    total_duration: 0,
    achievements_completed: 0,
    streak: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    display_name: '',
    bio: '',
    fitness_goal: '',
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchWorkoutStats();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
        return;
      }

      if (data) {
        setProfile(data);
        setFormData({
          display_name: data.display_name || '',
          bio: data.bio || '',
          fitness_goal: data.fitness_goal || '',
        });
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkoutStats = async () => {
    try {
      if (!user) return;

      // Fetch completed workouts count
      const { data: workoutsData, error: workoutsError } = await supabase
        .from('completed_workouts')
        .select('id, duration')
        .eq('user_id', user.id);

      if (workoutsError) throw workoutsError;

      const totalWorkouts = workoutsData?.length || 0;
      const totalDuration = workoutsData?.reduce((sum, workout) => sum + (workout.duration || 0), 0) || 0;

      setStats({
        total_workouts: totalWorkouts,
        total_duration: totalDuration,
        achievements_completed: 0, // This would come from an achievements table
        streak: 0, // This would need to be calculated based on workout frequency
      });
    } catch (error) {
      console.error('Error fetching workout stats:', error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: formData.display_name,
          bio: formData.bio,
          fitness_goal: formData.fitness_goal,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      setProfile(prev => prev ? {
        ...prev,
        display_name: formData.display_name,
        bio: formData.bio,
        fitness_goal: formData.fitness_goal,
      } : null);
      
      setIsEditing(false);
      toast.success('Profile updated successfully');
      fetchProfile(); // Refresh profile data
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

  // If no profile found but user exists, show a message
  if (!profile && user) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-light">Profile</h1>
          <p className="text-xl text-text-muted mt-2">
            Your profile is being set up...
          </p>
        </div>
        <Button onClick={fetchProfile} className="mx-auto block">
          Refresh
        </Button>
      </div>
    );
  }

  // If no user, show a message
  if (!user) {
    return (
      <div className="text-center p-4">
        <p className="text-text-muted">Please sign in to view your profile</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-text-light">Profile</h1>
        <p className="text-xl text-text-muted mt-2">
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
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
                <Avatar className="h-24 w-24 mx-auto sm:mx-0">
                  <AvatarImage src={profile?.avatar_url || ''} />
                  <AvatarFallback>
                    {profile?.display_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left">
                  <h2 className="text-2xl font-bold text-text-light">
                    {profile?.display_name || user.email?.split('@')[0] || 'User'}
                  </h2>
                  <p className="text-text-muted">
                    Member since {new Date(profile?.created_at || Date.now()).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="display_name">Display Name</Label>
                    <Input
                      id="display_name"
                      value={formData.display_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
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
                  <div className="space-y-2">
                    <Label htmlFor="fitness_goal">Fitness Goal</Label>
                    <Input
                      id="fitness_goal"
                      value={formData.fitness_goal}
                      onChange={(e) => setFormData(prev => ({ ...prev, fitness_goal: e.target.value }))}
                    />
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
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
                    <p className="text-text-muted">{profile?.bio || 'No bio yet'}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-text-light mb-2">Fitness Goal</h3>
                    <p className="text-text-muted">{profile?.fitness_goal || 'No fitness goal set'}</p>
                  </div>
                  <Button onClick={() => setIsEditing(true)} className="mt-4">
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
                  <p className="text-2xl font-bold text-text-light">{stats.total_workouts}</p>
                </div>
                <div className="glass-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Total Duration</h3>
                  </div>
                  <p className="text-2xl font-bold text-text-light">{stats.total_duration} min</p>
                </div>
                <div className="glass-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Achievements</h3>
                  </div>
                  <p className="text-2xl font-bold text-text-light">{stats.achievements_completed}</p>
                </div>
                <div className="glass-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Flame className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Current Streak</h3>
                  </div>
                  <p className="text-2xl font-bold text-text-light">{stats.streak} days</p>
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
                      {new Date(profile?.created_at || Date.now()).toLocaleDateString()}
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
                      {stats.total_workouts > 0 ? 'Completed' : 'Not started yet'}
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
