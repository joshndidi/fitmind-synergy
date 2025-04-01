import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { BarChart3, User, Activity, Calendar, Camera, Settings, Trophy, BarChart2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProfileStats {
  totalWorkouts: number;
  totalWeight: number;
  streak: number;
  achievements: number;
}

const Profile = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || "",
    bio: "Fitness enthusiast focused on strength training and mental wellness",
    height: "180",
    weight: "75",
    age: "30",
    gender: "male",
    fitnessLevel: "intermediate",
    goal: "Build muscle and improve mental focus"
  });

  const stats: ProfileStats = {
    totalWorkouts: 48,
    totalWeight: 5280,
    streak: 12,
    achievements: 8
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    setEditing(false);
    toast.success("Profile updated successfully");
  };

  const handleUpdateProfile = () => {
    // Here you would typically make an API call to update the profile
    toast.success('Profile updated successfully');
  };

  return (
    <div className="container mx-auto py-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold flex items-center gap-2">
          <User className="h-8 w-8" />
          Profile
        </h1>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-12">
            <div className="md:col-span-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
                        {user?.photoURL ? (
                          <img src={user.photoURL} alt={user.displayName || ""} />
                        ) : (
                          <User className="w-16 h-16 text-primary" />
                        )}
                      </div>
                      <Button
                        size="icon"
                        className="absolute bottom-0 right-0 rounded-full"
                        variant="outline"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                    <h2 className="mt-4 text-xl font-semibold">{formData.displayName || user?.email?.split('@')[0] || "User"}</h2>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="text-center p-4 rounded-lg bg-primary/10">
                      <div className="text-2xl font-bold">{stats.totalWorkouts}</div>
                      <div className="text-sm text-muted-foreground">Workouts</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-primary/10">
                      <div className="text-2xl font-bold">{stats.streak}</div>
                      <div className="text-sm text-muted-foreground">Day Streak</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-8">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input
                        value={formData.displayName}
                        onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={user?.email || ""}
                        onChange={(e) => {
                          // Handle email change
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Height (cm)</Label>
                      <Input
                        type="number"
                        value={formData.height}
                        onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Weight (kg)</Label>
                      <Input
                        type="number"
                        value={formData.weight}
                        onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Age</Label>
                      <Input
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Fitness Level</Label>
                      <Select
                        value={formData.fitnessLevel}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, fitnessLevel: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button className="w-full" onClick={handleUpdateProfile}>
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="stats">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart2 className="h-5 w-5" />
                  Workout Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Workouts</span>
                    <span className="font-bold">{stats.totalWorkouts}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Weight Lifted</span>
                    <span className="font-bold">{stats.totalWeight}kg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Current Streak</span>
                    <span className="font-bold">{stats.streak} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Achievements Earned</span>
                    <span className="font-bold">{stats.achievements}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Activity Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Activity calendar visualization would go here
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'First Workout', description: 'Complete your first workout', completed: true },
                  { name: 'Weight Milestone', description: 'Lift 1000kg total', completed: true },
                  { name: 'Streak Master', description: 'Maintain a 7-day streak', completed: true },
                  { name: 'Variety King', description: 'Try all workout types', completed: false },
                  { name: 'Early Bird', description: 'Complete 5 morning workouts', completed: true },
                  { name: 'Consistency', description: 'Work out 20 times in a month', completed: false }
                ].map((achievement, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      achievement.completed ? 'bg-primary/10 border-primary/20' : 'bg-muted/10 border-muted/20'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Trophy className={`h-4 w-4 ${achievement.completed ? 'text-primary' : 'text-muted-foreground'}`} />
                      <h3 className="font-medium">{achievement.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Notification Preferences</Label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Notifications</SelectItem>
                    <SelectItem value="important">Important Only</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Unit System</Label>
                <Select defaultValue="metric">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metric">Metric (kg, cm)</SelectItem>
                    <SelectItem value="imperial">Imperial (lbs, in)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full">Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Profile;
