
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Clock, BarChart3, Dumbbell, ArrowLeft, CheckCircle2, Flame, Timer, User, Activity, Calendar, Camera, Settings, Trophy, BarChart2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useWorkout } from "../hooks/useWorkout";
import { toast } from "sonner";
import { WorkoutPlan, WorkoutExercise, Workout, Exercise } from "../types/workout";
import WorkoutActions from "../components/WorkoutActions";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar } from "@/components/ui/avatar";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from "../hooks/use-mobile";

interface ProfileStats {
  totalWorkouts: number;
  totalWeight: number;
  streak: number;
  achievements: number;
}

const WorkoutDisplay = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getWorkoutById, completeWorkout, workoutPlans } = useWorkout();
  const isMobile = useIsMobile();
  
  const [workout, setWorkout] = useState<WorkoutPlan | null>(null);
  const [completed, setCompleted] = useState<boolean[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isWorkoutComplete, setIsWorkoutComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isWorkoutInProgress, setIsWorkoutInProgress] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(0);

  // Load workout and progress
  useEffect(() => {
    const loadWorkout = async () => {
      setLoading(true);
      
      if (workoutPlans.length === 0) {
        // No workouts available at all
        navigate("/dashboard");
        toast.error("No workouts available. Create one in Workout AI.");
        return;
      }
      
      // Determine which workout to display
      let targetWorkout: WorkoutPlan | null = null;
      
      // Try to find the specific workout if ID is provided
      if (id) {
        targetWorkout = await getWorkoutById(id);
      }
      
      // If no ID provided or workout not found, use the first one
      if (!targetWorkout) {
        targetWorkout = workoutPlans[0];
        if (id) {
          toast.info("Requested workout not found, showing first available workout");
        }
      }
      
      setWorkout(targetWorkout);
      
      // Load saved progress from localStorage
      const savedProgressKey = `workout-progress-${targetWorkout.id}`;
      const savedProgress = localStorage.getItem(savedProgressKey);
      
      if (savedProgress) {
        const parsedProgress = JSON.parse(savedProgress);
        setCompleted(parsedProgress);
        
        // Check if all exercises are completed
        if (parsedProgress.every((item: boolean) => item === true)) {
          setIsWorkoutComplete(true);
        }
      } else {
        setCompleted(new Array(targetWorkout.exercises.length).fill(false));
      }
      
      setLoading(false);
    };

    // Small delay to ensure workouts are loaded
    const timer = setTimeout(() => {
      loadWorkout();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [id, navigate, getWorkoutById, workoutPlans]);

  // Save progress when completed state changes
  useEffect(() => {
    if (workout && completed.length > 0) {
      const progressKey = `workout-progress-${workout.id}`;
      localStorage.setItem(progressKey, JSON.stringify(completed));
    }
  }, [completed, workout]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isWorkoutInProgress && !isResting) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else if (isResting && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorkoutInProgress, isResting, restTimer]);

  const handleExerciseComplete = (index: number) => {
    const newCompleted = [...completed];
    newCompleted[index] = !newCompleted[index];
    setCompleted(newCompleted);
    
    // If all exercises are completed, mark the workout as complete
    if (newCompleted.every(item => item === true)) {
      setIsWorkoutComplete(true);
    } else {
      setIsWorkoutComplete(false);
    }
  };

  const handleCompleteWorkout = () => {
    if (workout) {
      const today = new Date().toISOString().split('T')[0];
      
      // Create an array of Exercise objects from WorkoutExercise objects
      const exercisesConverted: Exercise[] = workout.exercises.map(ex => ({
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps.toString(), // Convert number to string to match Exercise type
        weight: ex.weight ? ex.weight.toString() : '0',
        duration: ex.duration,
        calories: 0,
        rest: ex.rest || `${ex.restTime}s` || '60s'
      }));
      
      completeWorkout({
        id: workout.id,
        title: workout.title,
        description: workout.description || 'Completed workout',
        calories: workout.calories || 0,
        duration: workout.duration,
        intensity: workout.intensity === 'beginner' ? 'Low' : 
                  workout.intensity === 'intermediate' ? 'Medium' : 'High',
        exercises: exercisesConverted,
        type: workout.type,
        date: today,
        completedAt: new Date().toISOString(),
        totalWeight: workout.exercises.reduce(
          (sum, ex) => sum + (ex.weight || 0),
          0
        ),
      });
      
      toast.success("Workout completed! Great job!");
      
      // Clear progress after completing
      const progressKey = `workout-progress-${workout.id}`;
      localStorage.removeItem(progressKey);
      
      navigate("/dashboard");
    }
  };

  const startWorkout = () => {
    setIsWorkoutInProgress(true);
    setTimer(0);
  };

  const startRest = () => {
    setIsResting(true);
    setRestTimer(workout?.exercises[currentExerciseIndex].restTime || 60);
  };

  const endRest = () => {
    setIsResting(false);
    if (workout && currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex((prev) => prev + 1);
    } else {
      completeWorkoutSession();
    }
  };

  const completeWorkoutSession = async () => {
    if (!workout) return;
    
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Convert WorkoutExercise to Exercise format
      const exercisesConverted: Exercise[] = workout.exercises.map(ex => ({
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps.toString(), // Convert number to string
        weight: ex.weight ? ex.weight.toString() : '0',
        duration: ex.duration,
        calories: 0,
        rest: ex.rest || `${ex.restTime}s` || '60s'
      }));
      
      const completedWorkout: Workout = {
        id: workout.id,
        title: workout.title,
        description: workout.description || 'Completed workout',
        type: workout.type,
        duration: timer,
        calories: workout.calories || 0,
        intensity: workout.intensity === 'beginner' ? 'Low' : 
                  workout.intensity === 'intermediate' ? 'Medium' : 'High',
        exercises: exercisesConverted,
        date: today,
        completedAt: new Date().toISOString(),
        totalWeight: workout.exercises.reduce(
          (sum, ex) => sum + (ex.weight || 0),
          0
        )
      };

      await completeWorkout(completedWorkout);
      toast.success('Workout completed!');
      navigate('/workouts');
    } catch (error) {
      toast.error('Failed to complete workout');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="page-container flex flex-col items-center justify-center min-h-[80vh]">
        <div className="glass-card p-8 text-center max-w-md">
          <Dumbbell className="mx-auto h-12 w-12 text-primary mb-4" />
          <h2 className="text-xl font-bold text-text-light mb-3">No Workout Found</h2>
          <p className="text-text-muted mb-6">We couldn't find the workout you're looking for.</p>
          
          {/* Add the Workout Actions even when no workout is found */}
          <WorkoutActions />
          
          <button 
            onClick={() => navigate("/dashboard")}
            className="btn-secondary w-full mt-4"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentExercise = workout.exercises[currentExerciseIndex];
  const progress = ((currentExerciseIndex + 1) / workout.exercises.length) * 100;

  return (
    <div className="page-container pb-20">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-text-muted hover:text-text-light transition-colors mb-6"
      >
        <ArrowLeft size={18} className="mr-2" />
        Back
      </button>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left side - Workout details */}
        <div className="w-full lg:w-1/3">
          <div className="glass-card p-4 md:p-6 sticky top-24">
            <h1 className="text-xl md:text-2xl font-bold text-text-light mb-3 break-words">{workout?.title}</h1>
            <p className="text-sm md:text-base text-text-muted mb-4 line-clamp-3">{workout?.description}</p>
            
            <div className="flex flex-wrap gap-2 md:gap-3 mb-4 md:mb-6">
              <Badge className="bg-primary/20 text-primary border-none px-2 py-1 md:px-3 md:py-1.5 flex items-center gap-1.5 text-xs md:text-sm">
                <Clock size={14} />
                {workout?.duration} min
              </Badge>
              <Badge className="bg-primary/20 text-primary border-none px-2 py-1 md:px-3 md:py-1.5 flex items-center gap-1.5 text-xs md:text-sm">
                <BarChart3 size={14} />
                {workout?.intensity}
              </Badge>
              <Badge className="bg-primary/20 text-primary border-none px-2 py-1 md:px-3 md:py-1.5 flex items-center gap-1.5 text-xs md:text-sm">
                <Dumbbell size={14} />
                {workout?.calories || 0} cal
              </Badge>
            </div>
            
            {workout && (
              <div className="space-y-3">
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-text-muted">Progress</span>
                  <span className="text-text-light">
                    {completed.filter(Boolean).length}/{workout.exercises.length}
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2.5">
                  <div
                    className="bg-primary h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${(completed.filter(Boolean).length / workout.exercises.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {isWorkoutComplete && (
              <button
                onClick={handleCompleteWorkout}
                className="btn-primary w-full mt-4 md:mt-6 flex items-center justify-center gap-2 text-sm md:text-base py-2 md:py-2.5"
              >
                <CheckCircle2 size={18} />
                Complete Workout
              </button>
            )}
            
            {/* Add the Workout Actions */}
            <div className="mt-4">
              <WorkoutActions />
            </div>
          </div>
        </div>
        
        {/* Right side - Exercise list */}
        <div className="w-full lg:w-2/3">
          <div className="glass-card p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-text-light mb-4 md:mb-6">Exercises</h2>
            
            {workout && (
              <div className="space-y-4 md:space-y-6 max-h-[60vh] overflow-y-auto pr-1 md:pr-2">
                {workout.exercises.map((exercise: WorkoutExercise, index: number) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-3 md:p-4 transition-colors ${
                      completed[index]
                        ? "border-primary/30 bg-primary/5"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2 md:mb-3">
                      <h3 className="text-base md:text-lg font-medium text-text-light break-words">
                        {index + 1}. {exercise.name}
                      </h3>
                      <button
                        onClick={() => handleExerciseComplete(index)}
                        className={`p-1 rounded-full transition-colors flex-shrink-0 ml-2 ${
                          completed[index]
                            ? "text-primary bg-primary/20"
                            : "text-text-muted bg-white/10 hover:bg-white/20"
                        }`}
                      >
                        <CheckCircle2 size={18} />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 md:gap-3 text-xs md:text-sm">
                      <div className="bg-white/5 p-2 md:p-3 rounded-lg">
                        <div className="text-text-muted mb-1">Sets</div>
                        <div className="text-text-light font-medium">{exercise.sets}</div>
                      </div>
                      <div className="bg-white/5 p-2 md:p-3 rounded-lg">
                        <div className="text-text-muted mb-1">Reps</div>
                        <div className="text-text-light font-medium">{exercise.reps}</div>
                      </div>
                      <div className="bg-white/5 p-2 md:p-3 rounded-lg">
                        <div className="text-text-muted mb-1">Weight</div>
                        <div className="text-text-light font-medium text-sm md:text-base truncate">
                          {exercise.weight || 'Bodyweight'}
                        </div>
                      </div>
                    </div>
                    
                    {exercise.rest && (
                      <div className="mt-2 md:mt-3 text-xs md:text-sm text-text-muted">
                        Rest: {exercise.rest}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {!isWorkoutInProgress ? (
        <Card className="mt-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg md:text-xl">Workout Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 text-sm md:text-base line-clamp-2">{workout?.description}</p>
            
            {workout && (
              <div className="space-y-2 md:space-y-4 max-h-64 overflow-y-auto pr-1">
                {workout.exercises.map((exercise: WorkoutExercise, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 md:p-4 border rounded-lg"
                  >
                    <div className="overflow-hidden min-w-0 flex-1">
                      <h3 className="font-medium text-sm md:text-base truncate">{exercise.name}</h3>
                      <p className="text-xs md:text-sm text-muted-foreground truncate">
                        {exercise.sets} sets × {exercise.reps} reps
                        {exercise.weight && ` × ${exercise.weight}kg`}
                      </p>
                    </div>
                    <Timer className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            )}
            
            <Button
              className="w-full mt-4 md:mt-6"
              onClick={startWorkout}
            >
              Start Workout
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="mt-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg md:text-xl">Current Exercise</CardTitle>
          </CardHeader>
          <CardContent>
            {workout && (
              <div className="text-center space-y-4 md:space-y-6">
                <h2 className="text-xl md:text-3xl font-bold break-words">
                  {workout.exercises[currentExerciseIndex].name}
                </h2>
                <div className="grid grid-cols-3 gap-2 md:gap-4">
                  <div className="text-center">
                    <p className="text-xs md:text-sm text-muted-foreground">Sets</p>
                    <p className="text-lg md:text-2xl font-bold">
                      {workout.exercises[currentExerciseIndex].sets}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs md:text-sm text-muted-foreground">Reps</p>
                    <p className="text-lg md:text-2xl font-bold">
                      {workout.exercises[currentExerciseIndex].reps}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs md:text-sm text-muted-foreground">Weight</p>
                    <p className="text-lg md:text-2xl font-bold truncate">
                      {workout.exercises[currentExerciseIndex].weight || 'BW'}
                    </p>
                  </div>
                </div>

                {isResting ? (
                  <div className="space-y-2 md:space-y-4">
                    <h3 className="text-lg md:text-xl font-semibold">Rest Time</h3>
                    <p className="text-2xl md:text-4xl font-bold">
                      {Math.floor(restTimer / 60)}:
                      {(restTimer % 60).toString().padStart(2, '0')}
                    </p>
                    <Button
                      variant="outline"
                      onClick={endRest}
                      disabled={restTimer > 0}
                      className="px-3 py-1 md:px-4 md:py-2 text-sm md:text-base"
                    >
                      Skip Rest
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={startRest}
                    className="px-4 py-2 md:px-6 md:py-3 text-sm md:text-base"
                  >
                    Start Rest
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WorkoutDisplay;
