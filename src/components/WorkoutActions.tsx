import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ListChecks, 
  FilePlus, 
  Calendar, 
  X,
  Dumbbell,
  Save
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import WorkoutCalendar from "./WorkoutCalendar";
import LogWorkoutForm from "./LogWorkoutForm";
import { useWorkout } from "@/hooks/useWorkout";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

type ExerciseInput = {
  name: string;
  sets: number;
  reps: number;
  weight: string;
  rest: string;
};

type WorkoutFormData = {
  title: string;
  description: string;
  duration: number;
  intensity: string;
  calories: number;
};

const WorkoutActions = () => {
  const navigate = useNavigate();
  const { workouts, logCustomWorkout, saveWorkoutPlan } = useWorkout();
  const { user } = useAuth();
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  const [exercises, setExercises] = useState<ExerciseInput[]>([{
    name: "",
    sets: 3,
    reps: 10,
    weight: "",
    rest: "60 seconds"
  }]);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<WorkoutFormData>({
    defaultValues: {
      title: "",
      description: "",
      duration: 30,
      intensity: "Medium",
      calories: 300,
    }
  });

  const handleChoosePlan = () => {
    // Navigate to AI workout page
    navigate("/workout-ai");
  };

  const handleAddPlan = () => {
    // Check if user is logged in
    if (!user) {
      toast.error("Please log in to create a workout plan");
      navigate("/auth");
      return;
    }
    
    // Open the add plan dialog
    setOpenDialog("addPlan");
  };

  const handleLogWorkout = () => {
    // Check if user is logged in
    if (!user) {
      toast.error("Please log in to log a workout");
      navigate("/auth");
      return;
    }
    
    // Open the log workout dialog
    setOpenDialog("logWorkout");
  };

  const closeDialog = () => {
    setOpenDialog(null);
    // Reset the form when closing the dialog
    reset();
    setExercises([{
      name: "",
      sets: 3,
      reps: 10,
      weight: "",
      rest: "60 seconds"
    }]);
  };

  const addExercise = () => {
    setExercises([...exercises, {
      name: "",
      sets: 3,
      reps: 10,
      weight: "",
      rest: "60 seconds"
    }]);
  };

  const updateExercise = (index: number, field: keyof ExerciseInput, value: any) => {
    const updatedExercises = [...exercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]: value
    };
    setExercises(updatedExercises);
  };

  const removeExercise = (index: number) => {
    if (exercises.length === 1) {
      toast.error("You need at least one exercise");
      return;
    }
    const updatedExercises = exercises.filter((_, i) => i !== index);
    setExercises(updatedExercises);
  };

  const onSubmitWorkout = async (data: WorkoutFormData) => {
    // Validate exercises
    const validExercises = exercises.filter(ex => ex.name.trim() !== "");
    
    if (validExercises.length === 0) {
      toast.error("Please add at least one exercise");
      return;
    }

    // Create a unique ID for the workout
    const id = `w${Date.now()}`;
    
    // Create new exercises array with correct type format
    const formattedExercises = validExercises.map(ex => ({
      name: ex.name,
      sets: ex.sets,
      reps: ex.reps.toString(),
      weight: ex.weight || "0",
      rest: ex.rest || "60 sec"
    }));
    
    // Create the new workout
    const newWorkout = {
      id,
      title: data.title,
      description: data.description,
      duration: data.duration,
      intensity: data.intensity as "High" | "Medium" | "Low",
      calories: data.calories,
      exercises: formattedExercises,
      type: "Custom",
      date: new Date().toISOString()
    };
    
    // Save to Supabase using our hook
    const savedId = await saveWorkoutPlan(newWorkout);
    
    // Close the dialog and reset the form
    closeDialog();
    
    // Navigate to the dashboard or the new workout
    if (savedId) {
      navigate(`/workout-display/${savedId}`);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-3 mt-6 w-full justify-center">
        <Button
          onClick={handleChoosePlan}
          className="flex items-center justify-center gap-2"
        >
          <ListChecks className="h-4 w-4" />
          <span className="whitespace-nowrap">Choose Plan</span>
        </Button>
        <Button
          onClick={handleAddPlan}
          className="flex items-center justify-center gap-2"
        >
          <FilePlus className="h-4 w-4" />
          <span className="whitespace-nowrap">Add Plan</span>
        </Button>
        <Button
          onClick={handleLogWorkout}
          className="flex items-center justify-center gap-2"
        >
          <Calendar className="h-4 w-4" />
          <span className="whitespace-nowrap">Log Workout</span>
        </Button>
      </div>

      {/* Add Plan Dialog */}
      <Dialog open={openDialog === "addPlan"} onOpenChange={closeDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-text-light flex items-center justify-between">
              Create Your Own Workout Plan
              <DialogClose className="text-text-muted hover:text-text-light">
                <X size={18} />
              </DialogClose>
            </DialogTitle>
            <DialogDescription className="text-text-muted">
              Design a custom workout plan to track your progress.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmitWorkout)} className="mt-4 space-y-6">
            {/* Workout Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-text-light">Workout Details</h3>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="title">Workout Title</Label>
                  <Input 
                    id="title"
                    placeholder="e.g. Full Body Workout" 
                    {...register("title", { required: "Title is required" })}
                    className="bg-black/40"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                </div>
                
                <div>
                  <Label htmlFor="intensity">Intensity</Label>
                  <Controller
                    name="intensity"
                    control={control}
                    render={({ field }) => (
                      <Select 
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="bg-black/40">
                          <SelectValue placeholder="Select intensity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input 
                    id="duration"
                    type="number" 
                    placeholder="30" 
                    {...register("duration", { 
                      required: "Duration is required",
                      min: { value: 5, message: "Minimum 5 minutes" },
                      max: { value: 180, message: "Maximum 180 minutes" }
                    })}
                    className="bg-black/40"
                  />
                  {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>}
                </div>
                
                <div>
                  <Label htmlFor="calories">Estimated Calories</Label>
                  <Input 
                    id="calories"
                    type="number" 
                    placeholder="300" 
                    {...register("calories", { 
                      required: "Calories estimate is required",
                      min: { value: 50, message: "Minimum 50 calories" }
                    })}
                    className="bg-black/40"
                  />
                  {errors.calories && <p className="text-red-500 text-sm mt-1">{errors.calories.message}</p>}
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description"
                  placeholder="Describe your workout plan" 
                  {...register("description")}
                  className="bg-black/40 min-h-[100px]"
                />
              </div>
            </div>
            
            {/* Exercises Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-text-light">Exercises</h3>
                <Button 
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addExercise}
                  className="flex items-center gap-1"
                >
                  <FilePlus size={16} />
                  Add Exercise
                </Button>
              </div>
              
              <div className="space-y-6">
                {exercises.map((exercise, index) => (
                  <div key={index} className="glass-card p-4 relative">
                    <button
                      type="button"
                      onClick={() => removeExercise(index)}
                      className="absolute top-3 right-3 text-text-muted hover:text-red-500 transition-colors"
                    >
                      <X size={18} />
                    </button>
                    
                    <div className="mb-4">
                      <Label htmlFor={`exercise-${index}-name`}>Exercise Name</Label>
                      <Input
                        id={`exercise-${index}-name`}
                        value={exercise.name}
                        onChange={(e) => updateExercise(index, "name", e.target.value)}
                        placeholder="e.g. Squats"
                        className="bg-black/40"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <Label htmlFor={`exercise-${index}-sets`}>Sets</Label>
                        <Input
                          id={`exercise-${index}-sets`}
                          type="number"
                          value={exercise.sets}
                          onChange={(e) => updateExercise(index, "sets", parseInt(e.target.value) || 0)}
                          min="1"
                          className="bg-black/40"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`exercise-${index}-reps`}>Reps</Label>
                        <Input
                          id={`exercise-${index}-reps`}
                          type="number"
                          value={exercise.reps}
                          onChange={(e) => updateExercise(index, "reps", parseInt(e.target.value) || 0)}
                          min="1"
                          className="bg-black/40"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`exercise-${index}-weight`}>Weight</Label>
                        <Input
                          id={`exercise-${index}-weight`}
                          value={exercise.weight}
                          onChange={(e) => updateExercise(index, "weight", e.target.value)}
                          placeholder="e.g. 20kg or Bodyweight"
                          className="bg-black/40"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`exercise-${index}-rest`}>Rest</Label>
                        <Input
                          id={`exercise-${index}-rest`}
                          value={exercise.rest}
                          onChange={(e) => updateExercise(index, "rest", e.target.value)}
                          placeholder="e.g. 60 seconds"
                          className="bg-black/40"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end gap-3">
              <Button 
                type="button" 
                variant="outline"
                onClick={closeDialog}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="flex items-center gap-2"
              >
                <Save size={16} />
                Save Workout Plan
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Log Workout Dialog */}
      <Dialog open={openDialog === "logWorkout"} onOpenChange={closeDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-text-light flex items-center justify-between">
              Log Your Workout
              <DialogClose className="text-text-muted hover:text-text-light">
                <X size={18} />
              </DialogClose>
            </DialogTitle>
            <DialogDescription className="text-text-muted">
              Keep track of your progress by logging your workouts.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <LogWorkoutForm onSuccess={closeDialog} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WorkoutActions;
