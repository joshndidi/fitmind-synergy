
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile, updateUserProfile } from "@/components/UserProfileUtils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger
} from "@/components/ui/tabs";

type ProfileData = {
  display_name: string;
  bio: string;
  fitness_goal: string;
  weight: number | null;
  height: number | null;
};

export default function Settings() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData>({
    display_name: '',
    bio: '',
    fitness_goal: '',
    weight: null,
    height: null,
  });
  
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await getUserProfile(user!);
      
      if (error) {
        toast.error("Failed to load profile data");
        return;
      }
      
      if (data) {
        setProfileData({
          display_name: data.display_name || user?.email?.split('@')[0] || '',
          bio: data.bio || '',
          fitness_goal: data.fitness_goal || '',
          weight: data.weight || null,
          height: data.height || null,
        });
      }
    } catch (error) {
      console.error("Error loading profile data:", error);
      toast.error("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileDataChange = (field: keyof ProfileData, value: any) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      
      const { success, error } = await updateUserProfile(user.id, {
        display_name: profileData.display_name,
        bio: profileData.bio,
        fitness_goal: profileData.fitness_goal,
        weight: profileData.weight,
        height: profileData.height,
      });
      
      if (!success) {
        throw error || new Error("Failed to update profile");
      }
      
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotifications = () => {
    toast.success("Notification settings saved");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>
                  Update your personal information and fitness goals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={profileData.display_name}
                    onChange={(e) => handleProfileDataChange('display_name', e.target.value)}
                    placeholder="Your display name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => handleProfileDataChange('bio', e.target.value)}
                    placeholder="Tell us about yourself"
                    className="min-h-[100px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fitnessGoal">Fitness Goal</Label>
                  <Textarea
                    id="fitnessGoal"
                    value={profileData.fitness_goal}
                    onChange={(e) => handleProfileDataChange('fitness_goal', e.target.value)}
                    placeholder="What are your fitness goals?"
                    className="min-h-[100px]"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={profileData.weight || ''}
                      onChange={(e) => handleProfileDataChange('weight', e.target.value ? parseInt(e.target.value) : null)}
                      placeholder="Optional"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={profileData.height || ''}
                      onChange={(e) => handleProfileDataChange('height', e.target.value ? parseInt(e.target.value) : null)}
                      placeholder="Optional"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveProfile} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Manage how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Enable Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about your workout plans and progress
                    </p>
                  </div>
                  <Switch
                    checked={isNotificationsEnabled}
                    onCheckedChange={setIsNotificationsEnabled}
                  />
                </div>
                
                {isNotificationsEnabled && (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Workout Reminders</h4>
                        <p className="text-sm text-muted-foreground">
                          Receive reminders about upcoming scheduled workouts
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Achievement Alerts</h4>
                        <p className="text-sm text-muted-foreground">
                          Get notified when you reach a fitness milestone
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Weekly Summary</h4>
                        <p className="text-sm text-muted-foreground">
                          Receive a weekly summary of your activity and progress
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveNotifications} disabled={isSaving}>
                  Save Notification Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
