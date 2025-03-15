
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Clock, BarChart3, Dumbbell, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useWorkout } from "../hooks/useWorkout";
import { toast } from "sonner";
import { Workout, Exercise } from "../types/workout";

const WorkoutDisplay = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getWorkoutById, completeWorkout, workouts } = useWorkout();
  
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [completed, setCompleted] = useState<boolean[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isWorkoutComplete, setIsWorkoutComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Load workout and progress
  useEffect(() => {
    const loadWorkout = () => {
      setLoading(true);
      
      if (workouts.length === 0) {
        // No workouts available at all
        navigate("/dashboard");
        toast.error("No workouts available. Create one in Workout AI.");
        return;
      }
      
      // Determine which workout to display
      let targetWorkout: Workout | null = null;
      
      // Try to find the specific workout if ID is provided
      if (id) {
        targetWorkout = getWorkoutById(id);
      }
      
      // If no ID provided or workout not found, use the first one
      if (!targetWorkout) {
        targetWorkout = workouts[0];
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
  }, [id, navigate, getWorkoutById, workouts]);

  // Save progress when completed state changes
  useEffect(() => {
    if (workout && completed.length > 0) {
      const progressKey = `workout-progress-${workout.id}`;
      localStorage.setItem(progressKey, JSON.stringify(completed));
    }
  }, [completed, workout]);

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
      completeWorkout(workout);
      toast.success("Workout completed! Great job!");
      
      // Clear progress after completing
      const progressKey = `workout-progress-${workout.id}`;
      localStorage.removeItem(progressKey);
      
      navigate("/dashboard");
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
          <button 
            onClick={() => navigate("/workout-ai")}
            className="btn-primary w-full mb-4"
          >
            Create New Workout
          </button>
          <button 
            onClick={() => navigate("/dashboard")}
            className="btn-secondary w-full"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container pb-20">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-text-muted hover:text-text-light transition-colors mb-6"
      >
        <ArrowLeft size={18} className="mr-2" />
        Back
      </button>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left side - Workout details */}
        <div className="w-full md:w-1/3">
          <div className="glass-card p-6 sticky top-24">
            <h1 className="text-2xl font-bold text-text-light mb-4">{workout.title}</h1>
            <p className="text-text-muted mb-4">{workout.description}</p>
            
            <div className="flex flex-wrap gap-3 mb-6">
              <Badge className="bg-primary/20 text-primary border-none px-3 py-1.5 flex items-center gap-1.5">
                <Clock size={14} />
                {workout.duration} min
              </Badge>
              <Badge className="bg-primary/20 text-primary border-none px-3 py-1.5 flex items-center gap-1.5">
                <BarChart3 size={14} />
                {workout.intensity}
              </Badge>
              <Badge className="bg-primary/20 text-primary border-none px-3 py-1.5 flex items-center gap-1.5">
                <Dumbbell size={14} />
                {workout.calories} cal
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
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
            
            {isWorkoutComplete && (
              <button
                onClick={handleCompleteWorkout}
                className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={18} />
                Complete Workout
              </button>
            )}
          </div>
        </div>
        
        {/* Right side - Exercise list */}
        <div className="w-full md:w-2/3">
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-text-light mb-6">Exercises</h2>
            
            <div className="space-y-6">
              {workout.exercises.map((exercise: Exercise, index: number) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 transition-colors ${
                    completed[index]
                      ? "border-primary/30 bg-primary/5"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-medium text-text-light">
                      {index + 1}. {exercise.name}
                    </h3>
                    <button
                      onClick={() => handleExerciseComplete(index)}
                      className={`p-1 rounded-full transition-colors ${
                        completed[index]
                          ? "text-primary bg-primary/20"
                          : "text-text-muted bg-white/10 hover:bg-white/20"
                      }`}
                    >
                      <CheckCircle2 size={20} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="bg-white/5 p-3 rounded-lg">
                      <div className="text-text-muted mb-1">Sets</div>
                      <div className="text-text-light font-medium">{exercise.sets}</div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg">
                      <div className="text-text-muted mb-1">Reps</div>
                      <div className="text-text-light font-medium">{exercise.reps}</div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg">
                      <div className="text-text-muted mb-1">Weight</div>
                      <div className="text-text-light font-medium">{exercise.weight || 'Bodyweight'}</div>
                    </div>
                  </div>
                  
                  {exercise.rest && (
                    <div className="mt-3 text-sm text-text-muted">
                      Rest: {exercise.rest}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutDisplay;
