
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useWorkout } from "@/hooks/useWorkout";
import { useAuth } from "../context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import WorkoutFormHeader from "./workout/WorkoutFormHeader";
import WorkoutDatePicker from "./workout/WorkoutDatePicker";
import ExerciseItem from "./workout/ExerciseItem";

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
      <WorkoutFormHeader />
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
              <WorkoutDatePicker date={date} onDateChange={(newDate) => newDate && setDate(newDate)} />
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
                <ExerciseItem
                  key={index}
                  exercise={exercise}
                  index={index}
                  onUpdate={updateExercise}
                  onRemove={removeExercise}
                  canRemove={exercises.length > 1}
                />
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
