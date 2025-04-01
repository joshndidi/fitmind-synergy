import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkout } from "@/hooks/useWorkout";
import { useSubscription } from "@/context/SubscriptionContext";
import { Dumbbell, Plus, Brain, Calendar, Edit2, Trash2, MoreVertical } from "lucide-react";
import WorkoutCard from "@/components/WorkoutCard";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WorkoutPlan } from "@/types/workout";

const WorkoutSelection = () => {
  const navigate = useNavigate();
  const { workoutPlans, loading, deleteWorkoutPlan } = useWorkout();
  const { isActive } = useSubscription();
  const [userWorkouts, setUserWorkouts] = useState<WorkoutPlan[]>([]);
  const [aiWorkouts, setAiWorkouts] = useState<WorkoutPlan[]>([]);

  useEffect(() => {
    // Separate AI-generated workouts from user-created ones
    if (workoutPlans.length > 0) {
      const ai = workoutPlans.filter(w => w.isAiGenerated);
      const user = workoutPlans.filter(w => !w.isAiGenerated);
      setAiWorkouts(ai);
      setUserWorkouts(user);
    }
  }, [workoutPlans]);

  const handleCreatePlan = () => {
    navigate("/workout/create");
  };

  const handleEditPlan = (id: string) => {
    navigate(`/workout/edit/${id}`);
  };

  const handleDeletePlan = async (id: string) => {
    try {
      await deleteWorkoutPlan(id);
      toast.success('Workout deleted successfully');
    } catch (error) {
      toast.error('Failed to delete workout');
      console.error('Error deleting workout:', error);
    }
  };

  const handleSelectWorkout = (id: string) => {
    navigate(`/workout-display/${id}`);
  };

  const getCompletionPercentage = (workoutId: string) => {
    // Check localStorage for workout progress
    const savedProgressKey = `workout-progress-${workoutId}`;
    const savedProgress = localStorage.getItem(savedProgressKey);
    
    if (savedProgress) {
      const parsedProgress = JSON.parse(savedProgress);
      const completed = parsedProgress.filter(Boolean).length;
      const total = parsedProgress.length;
      return Math.round((completed / total) * 100);
    }
    
    return 0;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-light mb-2">Workout Plans</h1>
        <p className="text-text-muted">Choose a workout plan or create a new one</p>
      </div>

      {/* AI-Generated Workouts Section */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-text-light flex items-center gap-2">
            <Brain size={20} className="text-primary" />
            AI-Generated Workouts
          </h2>
          <Button
            onClick={() => navigate("/workout-ai")}
            variant="outline"
            className="flex items-center gap-2"
            disabled={!isActive}
          >
            <Plus size={16} />
            Create AI Plan
          </Button>
        </div>

        {!isActive && (
          <Card className="glass-card mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/20 p-3 rounded-full">
                  <Brain size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-text-light mb-1">Premium Feature</h3>
                  <p className="text-text-muted">
                    Subscribe to FitMind Premium to access AI-generated workout plans
                  </p>
                </div>
                <Button
                  className="ml-auto"
                  onClick={() => navigate("/subscription")}
                >
                  Subscribe
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {isActive && aiWorkouts.length === 0 ? (
          <Card className="glass-card mb-6">
            <CardContent className="pt-6 pb-6 text-center">
              <Brain size={48} className="text-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-text-light mb-2">No AI Workouts Yet</h3>
              <p className="text-text-muted mb-4">
                Create your first AI-generated workout plan tailored to your fitness goals.
              </p>
              <Button onClick={() => navigate("/workout-ai")}>Create AI Plan</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiWorkouts.map((workout) => (
              <div key={workout.id} className="relative">
                <WorkoutCard
                  title={workout.title}
                  type={workout.type}
                  duration={workout.duration}
                  calories={workout.calories}
                  date={workout.createdAt}
                  intensity={workout.intensity}
                  onClick={() => handleSelectWorkout(workout.id)}
                />
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-text-muted mb-1">
                    <span>Progress</span>
                    <span>{getCompletionPercentage(workout.id)}%</span>
                  </div>
                  <Progress value={getCompletionPercentage(workout.id)} className="h-1.5" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User-Created Workouts Section */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-text-light flex items-center gap-2">
            <Dumbbell size={20} className="text-primary" />
            Your Custom Workouts
          </h2>
          <Button
            onClick={handleCreatePlan}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Create Custom Plan
          </Button>
        </div>

        {userWorkouts.length === 0 ? (
          <Card className="glass-card mb-6">
            <CardContent className="pt-6 pb-6 text-center">
              <Dumbbell size={48} className="text-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-text-light mb-2">No Custom Workouts Yet</h3>
              <p className="text-text-muted mb-4">
                Create your own custom workout plan to track your progress.
              </p>
              <Button onClick={handleCreatePlan}>
                Create Custom Plan
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userWorkouts.map((workout) => (
              <div key={workout.id} className="relative group">
                <WorkoutCard
                  title={workout.title}
                  type={workout.type}
                  duration={workout.duration}
                  calories={workout.calories}
                  date={workout.createdAt}
                  intensity={workout.intensity}
                  onClick={() => handleSelectWorkout(workout.id)}
                />
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-text-muted mb-1">
                    <span>Progress</span>
                    <span>{getCompletionPercentage(workout.id)}%</span>
                  </div>
                  <Progress value={getCompletionPercentage(workout.id)} className="h-1.5" />
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditPlan(workout.id)}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDeletePlan(workout.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Log Your Workout Section */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-text-light flex items-center gap-2">
            <Calendar size={20} className="text-primary" />
            Recent Workouts
          </h2>
          <Button
            onClick={() => navigate("/dashboard", { state: { openDialog: "logWorkout" } })}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Log Workout
          </Button>
        </div>
        
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Calendar size={48} className="text-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-text-light mb-2">Track Your Workouts</h3>
              <p className="text-text-muted mb-4">
                Log your workouts to track your progress and achievements.
              </p>
            </div>
          </CardContent>
          <CardFooter className="border-t border-white/10 pt-4">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate("/dashboard", { state: { openDialog: "logWorkout" } })}
            >
              Log New Workout
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default WorkoutSelection;
