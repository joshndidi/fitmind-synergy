
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Flame, Clock, BarChart3, Share2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

// Mock workout data
const workouts = [
  {
    id: "1",
    title: "Upper Strength",
    description: "Focus on building upper body strength with compound movements",
    calories: 450,
    duration: 60,
    intensity: "High",
    exercises: [
      { name: "Bench Press", sets: 4, reps: "8-10", weight: "70% 1RM" },
      { name: "Pull-ups", sets: 4, reps: "8-10", weight: "Bodyweight" },
      { name: "Overhead Press", sets: 3, reps: "10-12", weight: "60% 1RM" },
      { name: "Bent-over Row", sets: 3, reps: "10-12", weight: "65% 1RM" },
      { name: "Tricep Dips", sets: 3, reps: "12-15", weight: "Bodyweight" },
      { name: "Bicep Curls", sets: 3, reps: "12-15", weight: "Light" }
    ]
  },
  {
    id: "2",
    title: "Back Workout",
    description: "Comprehensive back workout for strength and definition",
    calories: 400,
    duration: 55,
    intensity: "Medium-High",
    exercises: [
      { name: "Deadlifts", sets: 4, reps: "6-8", weight: "75% 1RM" },
      { name: "Lat Pulldowns", sets: 3, reps: "10-12", weight: "Medium" },
      { name: "Seated Rows", sets: 3, reps: "10-12", weight: "Medium" },
      { name: "Face Pulls", sets: 3, reps: "15-20", weight: "Light" },
      { name: "Hyperextensions", sets: 3, reps: "12-15", weight: "Bodyweight" }
    ]
  }
];

const WorkoutDisplay = () => {
  const { id } = useParams<{ id: string }>();
  const [workout, setWorkout] = useState<(typeof workouts)[0] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate an API call to fetch workout data
    setLoading(true);
    setTimeout(() => {
      const found = workouts.find(w => w.id === id) || null;
      setWorkout(found);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleStartWorkout = () => {
    toast.success(`Starting ${workout?.title}`);
  };

  const handleShare = () => {
    toast.success("Workout shared with friends");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="glass-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Dumbbell className="h-16 w-16 text-text-muted opacity-20 mb-4" />
            <h2 className="text-2xl font-bold text-text-light mb-2">Workout Not Found</h2>
            <p className="text-text-muted mb-6">The workout you're looking for doesn't exist or has been removed.</p>
            <Button className="bg-primary text-white" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-text-light">{workout.title}</h1>
        <Button 
          variant="outline" 
          className="border-white/10 text-text-light hover:bg-white/5"
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4 mr-2" /> Share
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main workout info */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-text-light">Workout Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-text-light mb-6">{workout.description}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="glass-card p-4 flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Flame className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-text-muted text-xs">Calories</p>
                    <p className="text-text-light font-bold">{workout.calories} kcal</p>
                  </div>
                </div>
                
                <div className="glass-card p-4 flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-text-muted text-xs">Duration</p>
                    <p className="text-text-light font-bold">{workout.duration} min</p>
                  </div>
                </div>
                
                <div className="glass-card p-4 flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-text-muted text-xs">Intensity</p>
                    <p className="text-text-light font-bold">{workout.intensity}</p>
                  </div>
                </div>
              </div>
              
              <Button className="w-full bg-primary text-white" onClick={handleStartWorkout}>
                Start Workout
              </Button>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-text-light">Exercise Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workout.exercises.map((exercise, index) => (
                  <div key={index} className="glass-card p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-text-light">{exercise.name}</h3>
                      <span className="text-sm text-primary">{exercise.weight}</span>
                    </div>
                    <div className="flex items-center text-text-muted text-sm">
                      <span>{exercise.sets} sets</span>
                      <span className="mx-2">•</span>
                      <span>{exercise.reps} reps</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-8">
          <Card className="glass-card sticky top-4">
            <CardHeader>
              <CardTitle className="text-text-light">Quick Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4 text-text-light">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Warm up properly before starting</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Focus on form rather than heavy weights</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Stay hydrated throughout the workout</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Rest 1-2 minutes between sets</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Stretch after completing the workout</span>
                </li>
              </ul>
              
              <div className="mt-6 pt-6 border-t border-white/10">
                <h3 className="font-medium text-text-light mb-4">Similar Workouts</h3>
                {workouts
                  .filter(w => w.id !== id)
                  .map((w, i) => (
                    <Button 
                      key={i}
                      variant="outline" 
                      className="w-full justify-start text-left mb-2 border-white/10 hover:bg-white/5"
                      onClick={() => window.location.href = `/workout-display/${w.id}`}
                    >
                      <Dumbbell className="h-4 w-4 mr-2" /> {w.title}
                    </Button>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WorkoutDisplay;
