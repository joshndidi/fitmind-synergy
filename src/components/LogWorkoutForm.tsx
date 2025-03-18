
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { toast } from "sonner";
import { useWorkout } from "@/hooks/useWorkout";
import { useAuth } from "../context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import WorkoutFormHeader from "./workout/WorkoutFormHeader";
import WorkoutDatePicker from "./workout/WorkoutDatePicker";
import ExerciseManager from "./workout/ExerciseManager";
import LoadingButton from "./workout/LoadingButton";
import { calculateTotalWeight, validateWorkoutForm } from "@/utils/workoutCalculations";

const LogWorkoutForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { logCustomWorkout } = useWorkout();
  const { user } = useAuth();
  const [date, setDate] = useState<Date>(new Date());
  const [title, setTitle] = useState("");
  const [exercises, setExercises] = useState([
    { name: "", sets: 1, reps: "10", weight: "0" },
  ]);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationError = validateWorkoutForm(title, exercises, user);
    if (validationError) {
      toast.error(validationError);
      return;
    }
    
    setLoading(true);
    
    try {
      // Calculate total weight
      const totalWeight = calculateTotalWeight(exercises);
      
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
          
          <ExerciseManager 
            exercises={exercises}
            setExercises={setExercises}
          />
          
          <LoadingButton
            loading={loading}
            loadingText="Logging Workout..."
            buttonText="Log Workout"
            className="w-full bg-primary text-white"
          />
        </form>
      </CardContent>
    </Card>
  );
};

export default LogWorkoutForm;
