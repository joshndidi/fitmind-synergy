
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useWorkout } from "@/hooks/useWorkout";
import { useAuth } from "../context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const LogWorkoutForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { logCustomWorkout } = useWorkout();
  const { user } = useAuth();
  const [date, setDate] = useState<Date>(new Date());
  const [title, setTitle] = useState("");
  const [exercises, setExercises] = useState([
    { name: "", sets: 1, reps: "10", weight: "0" },
  ]);
  const [loading, setLoading] = useState(false);
  
  const addExercise = () => {
    setExercises([...exercises, { name: "", sets: 1, reps: "10", weight: "0" }]);
  };
  
  const removeExercise = (index: number) => {
    if (exercises.length > 1) {
      setExercises(exercises.filter((_, i) => i !== index));
    }
  };
  
  const updateExercise = (index: number, field: string, value: any) => {
    const updatedExercises = [...exercises];
    updatedExercises[index] = { 
      ...updatedExercises[index], 
      [field]: field === 'name' ? value : field === 'sets' ? Number(value) : String(value)
    };
    setExercises(updatedExercises);
  };

  // Calculate total weight lifted for this workout
  const calculateTotalWeight = () => {
    let totalWeight = 0;
    
    exercises.forEach(exercise => {
      const weight = parseFloat(exercise.weight);
      const reps = parseInt(exercise.reps);
      
      if (!isNaN(weight) && !isNaN(reps)) {
        totalWeight += weight * exercise.sets * reps;
      }
    });
    
    return totalWeight;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!title.trim()) {
      toast.error("Please enter a workout title");
      return;
    }
    
    if (exercises.some(ex => !ex.name.trim())) {
      toast.error("Please enter a name for each exercise");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to log workouts");
      return;
    }
    
    setLoading(true);
    
    try {
      // Calculate total weight
      const totalWeight = calculateTotalWeight();
      
      // Add to workout state first
      logCustomWorkout(title, exercises);
      
      // Save to database
      const { error } = await supabase
        .from('workout_logs')
        .insert([
          {
            user_id: user.id,
            title: title,
            exercises: exercises,
            total_weight: totalWeight,
            calories: exercises.length * 50,
            completed_at: format(date, 'yyyy-MM-dd')
          }
        ]);
      
      if (error) throw error;
      
      toast.success("Workout logged successfully!");
      
      // Reset form
      setTitle("");
      setExercises([{ name: "", sets: 1, reps: "10", weight: "0" }]);
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error logging workout:", error.message);
      toast.error("Failed to log workout");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-text-light">Log Custom Workout</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-text-light">
                Workout Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Workout"
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-text-light">Workout Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left border-white/10",
                      !date && "text-text-muted"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 pointer-events-auto">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-text-light">Exercises</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addExercise}
                className="border-white/10"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Exercise
              </Button>
            </div>
            
            <div className="space-y-4">
              {exercises.map((exercise, index) => (
                <div key={index} className="glass-card p-4 space-y-3">
                  <div className="flex justify-between">
                    <Label className="text-text-light">Exercise {index + 1}</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExercise(index)}
                      className="text-destructive hover:text-destructive/90"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`exercise-name-${index}`} className="text-text-muted text-xs mb-1 block">
                        Exercise Name
                      </Label>
                      <Input
                        id={`exercise-name-${index}`}
                        value={exercise.name}
                        onChange={(e) => updateExercise(index, 'name', e.target.value)}
                        placeholder="e.g. Bench Press"
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Label htmlFor={`exercise-sets-${index}`} className="text-text-muted text-xs mb-1 block">
                          Sets
                        </Label>
                        <Input
                          id={`exercise-sets-${index}`}
                          type="number"
                          min="1"
                          value={exercise.sets}
                          onChange={(e) => updateExercise(index, 'sets', e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`exercise-reps-${index}`} className="text-text-muted text-xs mb-1 block">
                          Reps
                        </Label>
                        <Input
                          id={`exercise-reps-${index}`}
                          type="number"
                          min="1"
                          value={exercise.reps}
                          onChange={(e) => updateExercise(index, 'reps', e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`exercise-weight-${index}`} className="text-text-muted text-xs mb-1 block">
                          Weight (kg)
                        </Label>
                        <Input
                          id={`exercise-weight-${index}`}
                          type="number"
                          min="0"
                          step="0.5"
                          value={exercise.weight}
                          onChange={(e) => updateExercise(index, 'weight', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-primary text-white"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging Workout...
              </span>
            ) : (
              "Log Workout"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LogWorkoutForm;
