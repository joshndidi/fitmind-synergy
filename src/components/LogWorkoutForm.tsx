
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { CalendarIcon, Plus, Minus } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface LogExercise {
  name: string;
  setsCompleted: number;
  repsCompleted: number;
  weightUsed?: number;
  durationCompleted?: number;
}

interface WorkoutPlanOption {
  id: string;
  title: string;
  exercises: {
    name: string;
    sets: number;
    reps: number;
    weight?: number;
    duration?: number;
  }[];
}

interface LogWorkoutFormProps {
  onSuccess?: () => void;
}

export default function LogWorkoutForm({ onSuccess }: LogWorkoutFormProps) {
  const { user } = useAuth();
  const [date, setDate] = useState<Date>(new Date());
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlanOption[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [duration, setDuration] = useState<number>(0);
  const [caloriesBurned, setCaloriesBurned] = useState<number | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [exercises, setExercises] = useState<LogExercise[]>([{
    name: '',
    setsCompleted: 3,
    repsCompleted: 10,
    weightUsed: undefined,
    durationCompleted: undefined
  }]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWorkoutPlans();
    }
  }, [user]);

  const fetchWorkoutPlans = async () => {
    try {
      setIsLoadingPlans(true);
      // Fetch user's workout plans
      const { data: plans, error } = await supabase
        .from('workout_plans')
        .select(`
          id,
          title,
          workout_exercises (
            name,
            sets,
            reps,
            weight,
            duration
          )
        `)
        .eq('user_id', user?.id);

      if (error) throw error;

      const formattedPlans = plans.map((plan: any) => ({
        id: plan.id,
        title: plan.title,
        exercises: plan.workout_exercises.map((ex: any) => ({
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight,
          duration: ex.duration
        }))
      }));

      setWorkoutPlans(formattedPlans);
    } catch (error) {
      console.error('Error fetching workout plans:', error);
      toast.error('Failed to load workout plans');
    } finally {
      setIsLoadingPlans(false);
    }
  };

  const handlePlanChange = (planId: string) => {
    setSelectedPlanId(planId);
    
    if (planId) {
      const plan = workoutPlans.find(p => p.id === planId);
      if (plan) {
        // Pre-fill exercises from the selected plan
        const planExercises = plan.exercises.map(ex => ({
          name: ex.name,
          setsCompleted: ex.sets,
          repsCompleted: ex.reps,
          weightUsed: ex.weight,
          durationCompleted: ex.duration
        }));
        
        setExercises(planExercises);
      }
    }
  };

  const addExercise = () => {
    setExercises([...exercises, {
      name: '',
      setsCompleted: 3,
      repsCompleted: 10,
      weightUsed: undefined,
      durationCompleted: undefined
    }]);
  };

  const removeExercise = (index: number) => {
    if (exercises.length === 1) {
      toast.error('Workout must have at least one exercise');
      return;
    }
    
    const updatedExercises = exercises.filter((_, i) => i !== index);
    setExercises(updatedExercises);
  };

  const handleExerciseChange = (index: number, field: keyof LogExercise, value: any) => {
    const updatedExercises = [...exercises];
    updatedExercises[index] = { ...updatedExercises[index], [field]: value };
    setExercises(updatedExercises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to log a workout');
      return;
    }
    
    if (exercises.some(ex => !ex.name.trim())) {
      toast.error('All exercises must have a name');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const totalWeight = exercises.reduce((sum, ex) => sum + (ex.weightUsed || 0) * ex.setsCompleted * ex.repsCompleted, 0);
      
      // Format exercises for storage
      const formattedExercises = exercises.map(ex => ({
        exerciseName: ex.name,
        setsCompleted: ex.setsCompleted,
        repsCompleted: ex.repsCompleted,
        weightUsed: ex.weightUsed || 0,
        durationCompleted: ex.durationCompleted || 0
      }));
      
      // Insert the workout log
      const { error } = await supabase
        .from('completed_workouts')
        .insert({
          user_id: user.id,
          workout_plan_id: selectedPlanId || null,
          title: selectedPlanId 
            ? workoutPlans.find(p => p.id === selectedPlanId)?.title || 'Workout' 
            : 'Custom Workout',
          duration: duration,
          calories: caloriesBurned || 0,
          exercises: formattedExercises,
          completed_at: date.toISOString(),
          total_weight: totalWeight
        });
        
      if (error) throw error;
      
      toast.success('Workout logged successfully');
      
      // Reset form
      setDate(new Date());
      setSelectedPlanId('');
      setDuration(0);
      setCaloriesBurned(null);
      setNotes('');
      setExercises([{
        name: '',
        setsCompleted: 3,
        repsCompleted: 10,
        weightUsed: undefined,
        durationCompleted: undefined
      }]);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error logging workout:', error);
      toast.error('Failed to log workout');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="workoutPlan">Workout Plan (Optional)</Label>
            <Select 
              value={selectedPlanId} 
              onValueChange={handlePlanChange}
            >
              <SelectTrigger id="workoutPlan">
                <SelectValue placeholder="Select a workout plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Custom Workout</SelectItem>
                {isLoadingPlans ? (
                  <SelectItem value="" disabled>Loading plans...</SelectItem>
                ) : (
                  workoutPlans.map(plan => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              value={duration || ''}
              onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
              min={1}
              placeholder="How long was your workout?"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="calories">Calories Burned (optional)</Label>
            <Input
              id="calories"
              type="number"
              value={caloriesBurned || ''}
              onChange={(e) => setCaloriesBurned(e.target.value ? parseInt(e.target.value) : null)}
              min={0}
              placeholder="Estimated calories burned"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes">Notes (optional)</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How was your workout? Any achievements or challenges?"
            className="min-h-[100px]"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Exercises</h3>
          <Button 
            type="button" 
            size="sm" 
            onClick={addExercise}
          >
            <Plus className="mr-1 h-4 w-4" /> Add Exercise
          </Button>
        </div>
        
        <div className="space-y-4">
          {exercises.map((exercise, index) => (
            <div 
              key={index} 
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Exercise {index + 1}</h4>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeExercise(index)}
                >
                  <Minus className="h-4 w-4 text-red-500" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`exercise-${index}-name`}>Exercise Name</Label>
                <Input
                  id={`exercise-${index}-name`}
                  value={exercise.name}
                  onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                  placeholder="e.g. Bench Press"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`exercise-${index}-sets`}>Sets Completed</Label>
                  <Input
                    id={`exercise-${index}-sets`}
                    type="number"
                    value={exercise.setsCompleted}
                    onChange={(e) => handleExerciseChange(index, 'setsCompleted', parseInt(e.target.value) || 0)}
                    min={1}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`exercise-${index}-reps`}>Reps Completed</Label>
                  <Input
                    id={`exercise-${index}-reps`}
                    type="number"
                    value={exercise.repsCompleted}
                    onChange={(e) => handleExerciseChange(index, 'repsCompleted', parseInt(e.target.value) || 0)}
                    min={1}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`exercise-${index}-weight`}>Weight Used (kg)</Label>
                  <Input
                    id={`exercise-${index}-weight`}
                    type="number"
                    value={exercise.weightUsed || ''}
                    onChange={(e) => handleExerciseChange(index, 'weightUsed', e.target.value ? parseInt(e.target.value) : undefined)}
                    min={0}
                    placeholder="Optional"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`exercise-${index}-duration`}>Duration (sec)</Label>
                  <Input
                    id={`exercise-${index}-duration`}
                    type="number"
                    value={exercise.durationCompleted || ''}
                    onChange={(e) => handleExerciseChange(index, 'durationCompleted', e.target.value ? parseInt(e.target.value) : undefined)}
                    min={0}
                    placeholder="Optional"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Log Workout'}
        </Button>
      </div>
    </form>
  );
}
