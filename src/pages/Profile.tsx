
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { BarChart3, User, Activity, Calendar, Camera } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useWorkout } from "@/hooks/useWorkout";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const { user } = useAuth();
  const { completedWorkouts, totalWeightLifted } = useWorkout();
  const [editing, setEditing] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    displayName: user?.displayName || "",
    bio: "Fitness enthusiast focused on strength training and mental wellness",
    height: "175", // cm
    weight: "70", // kg
    goal: "Build muscle and improve mental focus"
  });

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
        
      if (error) throw error;
      
      setUserProfile(data);
      
      // Update form data with profile info
      setFormData(prev => ({
        ...prev,
        displayName: data?.display_name || user?.displayName || user?.email?.split('@')[0] || "",
        bio: data?.bio || prev.bio,
        height: data?.height?.toString() || prev.height,
        weight: data?.weight?.toString() || prev.weight,
        goal: data?.fitness_goal || prev.goal
      }));
      
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching profile:', error.message);
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          display_name: formData.displayName,
          bio: formData.bio,
          height: parseInt(formData.height),
          weight: parseInt(formData.weight),
          fitness_goal: formData.goal,
          updated_at: new Date().toISOString()
        });
        
      if (error) throw error;
      
      toast.success("Profile updated successfully");
      setEditing(false);
      fetchUserProfile();
    } catch (error: any) {
      console.error('Error updating profile:', error.message);
      toast.error("Failed to update profile");
    }
  };

  // Calculate workout stats
  const getTotalCalories = () => {
    return completedWorkouts.reduce((total, workout) => total + workout.calories, 0);
  };

  const getCurrentStreak = () => {
    // Simplified streak calculation
    return Math.min(14, completedWorkouts.length);
  };

  const stats = [
    { label: "Workouts", value: completedWorkouts.length.toString(), icon: <Activity className="h-5 w-5 text-primary" /> },
    { label: "Calories Burned", value: getTotalCalories().toLocaleString(), icon: <BarChart3 className="h-5 w-5 text-primary" /> },
    { label: "Streak", value: `${getCurrentStreak()} days`, icon: <Calendar className="h-5 w-5 text-primary" /> },
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8 text-text-light">Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info Card */}
        <Card className="glass-card lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-text-light">Personal Information</CardTitle>
            <Button 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary/10"
              onClick={() => setEditing(!editing)}
            >
              {editing ? "Cancel" : "Edit Profile"}
            </Button>
          </CardHeader>
          <CardContent>
            {editing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col items-center mb-6">
                  <Avatar className="h-24 w-24 border-4 border-primary/20">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt={formData.displayName} />
                    ) : (
                      <User className="h-12 w-12" />
                    )}
                  </Avatar>
                  <Button variant="ghost" className="mt-2 text-primary">
                    <Camera className="h-4 w-4 mr-2" /> Change Photo
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-text-muted">Display Name</label>
                    <input
                      type="text"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleChange}
                      className="input-field w-full mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-text-muted">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={3}
                      className="input-field w-full mt-1"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-text-muted">Height (cm)</label>
                      <input
                        type="number"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                        className="input-field w-full mt-1"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-text-muted">Weight (kg)</label>
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        className="input-field w-full mt-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-text-muted">Fitness Goal</label>
                    <input
                      type="text"
                      name="goal"
                      value={formData.goal}
                      onChange={handleChange}
                      className="input-field w-full mt-1"
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full bg-primary text-white">
                  Save Changes
                </Button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col items-center mb-6">
                  <Avatar className="h-24 w-24 border-4 border-primary/20">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt={formData.displayName} />
                    ) : (
                      <User className="h-12 w-12" />
                    )}
                  </Avatar>
                  <h2 className="mt-4 text-xl font-semibold text-text-light">
                    {formData.displayName || user?.email?.split('@')[0] || "User"}
                  </h2>
                  <p className="text-text-muted">{user?.email}</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-text-muted">Bio</h3>
                    <p className="text-text-light mt-1">{formData.bio}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-text-muted">Height</h3>
                      <p className="text-text-light mt-1">{formData.height} cm</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-text-muted">Weight</h3>
                      <p className="text-text-light mt-1">{formData.weight} kg</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-text-muted">Fitness Goal</h3>
                    <p className="text-text-light mt-1">{formData.goal}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Stats Card */}
        <Card className="glass-card h-fit">
          <CardHeader>
            <CardTitle className="text-text-light">Fitness Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-4 glass-card-hover p-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-text-muted text-sm">{stat.label}</p>
                    <p className="text-text-light text-xl font-bold">{stat.value}</p>
                  </div>
                </div>
              ))}
              
              <Button 
                className="w-full bg-primary text-white"
                onClick={() => window.location.href = '/achievements'}
              >
                View Detailed Stats
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Achievements Card */}
        <Card className="glass-card lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-text-light">Recent Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {getAchievements().filter(a => a.achieved).slice(0, 4).map((achievement, index) => (
                <div key={index} className="glass-card-hover p-4 text-center">
                  <div className="bg-primary/10 p-3 rounded-full mx-auto mb-3 w-fit">
                    <div className="text-3xl">{achievement.icon}</div>
                  </div>
                  <h3 className="text-text-light font-medium">{achievement.name}</h3>
                  <p className="text-text-muted text-sm">{achievement.description}</p>
                </div>
              ))}
              
              {getAchievements().filter(a => a.achieved).length === 0 && (
                <div className="col-span-4 text-center py-8">
                  <p className="text-text-muted">Complete workouts to earn achievements!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
