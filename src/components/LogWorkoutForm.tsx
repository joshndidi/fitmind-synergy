
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { CalendarIcon, Plus, Minus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { WorkoutPlan, WorkoutType } from '@/types/workout';

interface LogWorkoutFormProps {
  onSuccess: () => void;
}

interface LoggedExercise {
  name: string;
  sets: number;
  reps: number;
  weight: number | null;
}

export default function LogWorkoutForm({ onSuccess }: LogWorkoutFormProps) {
  const { user } = useAuth();
  const [date, setDate] = useState<Date>(new Date());
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<WorkoutType>('strength');
  const [duration, setDuration] = useState(45);
  const [caloriesBurned, setCaloriesBurned] = useState<number | null>(null);
  const [exercises, setExercises] = useState<LoggedExercise[]>([
    { name: '', sets: 3, reps: 10, weight: null }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedWorkouts, setSavedWorkouts] = useState<WorkoutPlan[]>([]);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);

  // Fetch user's saved workouts
  useEffect(() => {
    if (user) {
      fetchSavedWorkouts();
    }
  }, [user]);

  const fetchSavedWorkouts = async () => {
    try {
      const { data, error } = await supabase
        .from('workout_plans')
        .select('id, title, description, type, duration, intensity, created_at, updated_at, is_ai_generated, is_template')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match WorkoutPlan type
      const formattedWorkouts: WorkoutPlan[] = (data || []).map(workout => ({
        id: workout.id,
        userId: user?.id || '',
        title: workout.title,
        description: workout.description || '',
        type: workout.type as WorkoutType,
        duration: workout.duration,
        calories: 0,
        intensity: workout.intensity as any,
        createdAt: workout.created_at,
        updatedAt: workout.updated_at,
        isAiGenerated: workout.is_ai_generated,
        isTemplate: workout.is_template || false,
        exercises: []
      }));
      
      setSavedWorkouts(formattedWorkouts);
    } catch (error) {
      console.error('Error fetching saved workouts:', error);
    }
  };

  const handleAddExercise = () => {
    setExercises([...exercises, { name: '', sets: 3, reps: 10, weight: null }]);
  };

  const handleRemoveExercise = (index: number) => {
    if (exercises.length === 1) {
      toast.error('Workout must have at least one exercise');
      return;
    }
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleExerciseChange = (index: number, field: keyof LoggedExercise, value: any) => {
    const updatedExercises = [...exercises];
    updatedExercises[index] = { ...updatedExercises[index], [field]: value };
    setExercises(updatedExercises);
  };

  const handleSelectWorkout = async (workoutId: string) => {
    setSelectedWorkoutId(workoutId);
    
    try {
      // Fetch workout details
      const { data: workoutData, error: workoutError } = await supabase
        .from('workout_plans')
        .select('*')
        .eq('id', workoutId)
        .single();
        
      if (workoutError) throw workoutError;
      
      // Fetch exercises for this workout
      const { data: exercisesData, error: exercisesError } = await supabase
        .from('workout_exercises')
        .select('*')
        .eq('workout_plan_id', workoutId)
        .order('order_index', { ascending: true });
        
      if (exercisesError) throw exercisesError;
      
      // Set form data from fetched workout
      setTitle(workoutData.title);
      setDescription(workoutData.description || '');
      setType(workoutData.type as WorkoutType);
      setDuration(workoutData.duration);
      setCaloriesBurned(workoutData.calories);
      
      // Map exercises
      if (exercisesData && exercisesData.length > 0) {
        setExercises(
          exercisesData.map(ex => ({
            name: ex.name,
            sets: ex.sets,
            reps: ex.reps,
            weight: ex.weight
          }))
        );
      }
      
    } catch (error) {
      console.error('Error loading workout details:', error);
      toast.error('Failed to load workout details');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to log a workout');
      return;
    }
    
    if (!title) {
      toast.error('Workout title is required');
      return;
    }
    
    if (exercises.some(ex => !ex.name)) {
      toast.error('All exercises must have a name');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Calculate total weight lifted
      const totalWeight = exercises.reduce((total, ex) => {
        return total + (ex.weight || 0) * ex.sets * ex.reps;
      }, 0);
      
      // Prepare exercise data
      const exercisesData = exercises.map(ex => ({
        name: ex.name,
        sets_completed: ex.sets,
        reps_completed: ex.reps,
        weight_used: ex.weight || 0
      }));
      
      // Insert workout log
      const { error } = await supabase
        .from('workout_logs')
        .insert({
          user_id: user.id,
          title: title,
          exercises: exercisesData,
          completed_at: date.toISOString(),
          total_weight: totalWeight,
          calories: caloriesBurned
        });
        
      if (error) throw error;
      
      toast.success('Workout logged successfully');
      onSuccess();
      
    } catch (error) {
      console.error('Error logging workout:', error);
      toast.error('Failed to log workout');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <Label htmlFor="date">Date</Label>
            <div className="relative flex items-center mt-1">
              <Input
                id="date"
                type="text"
                value={format(date, 'PPP')}
                readOnly
                className="pr-10"
              />
              <CalendarIcon className="absolute right-3 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="mt-2">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                className="border rounded-md p-3"
              />
            </div>
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <Label htmlFor="savedWorkout">Use Saved Workout (Optional)</Label>
            <Select onValueChange={handleSelectWorkout}>
              <SelectTrigger id="savedWorkout">
                <SelectValue placeholder="Select a saved workout" />
              </SelectTrigger>
              <SelectContent>
                {savedWorkouts.map(workout => (
                  <SelectItem key={workout.id} value={workout.id}>
                    {workout.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Workout Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Morning Strength Training"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="type">Workout Type</Label>
            <Select value={type} onValueChange={(value) => setType(value as WorkoutType)}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="strength">Strength</SelectItem>
                <SelectItem value="cardio">Cardio</SelectItem>
                <SelectItem value="flexibility">Flexibility</SelectItem>
                <SelectItem value="hiit">HIIT</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
              min={1}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="calories">Calories Burned (optional)</Label>
            <Input
              id="calories"
              type="number"
              value={caloriesBurned || ''}
              onChange={(e) => setCaloriesBurned(e.target.value ? parseInt(e.target.value) : null)}
              min={0}
              placeholder="Optional"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="description">Notes (optional)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="How did the workout feel? Any achievements or difficulties?"
            className="min-h-[100px]"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Exercises</h3>
          <Button type="button" variant="outline" size="sm" onClick={handleAddExercise}>
            <Plus className="h-4 w-4 mr-1" /> Add Exercise
          </Button>
        </div>
        
        {exercises.map((exercise, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Exercise {index + 1}</h4>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => handleRemoveExercise(index)}
              >
                <Minus className="h-4 w-4 text-red-500" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor={`exercise-${index}-name`}>Exercise Name</Label>
                <Input
                  id={`exercise-${index}-name`}
                  value={exercise.name}
                  onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                  placeholder="e.g. Bench Press"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor={`exercise-${index}-sets`}>Sets</Label>
                <Input
                  id={`exercise-${index}-sets`}
                  type="number"
                  value={exercise.sets}
                  onChange={(e) => handleExerciseChange(index, 'sets', parseInt(e.target.value) || 0)}
                  min={1}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor={`exercise-${index}-reps`}>Reps</Label>
                <Input
                  id={`exercise-${index}-reps`}
                  type="number"
                  value={exercise.reps}
                  onChange={(e) => handleExerciseChange(index, 'reps', parseInt(e.target.value) || 0)}
                  min={1}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor={`exercise-${index}-weight`}>Weight (kg)</Label>
              <Input
                id={`exercise-${index}-weight`}
                type="number"
                value={exercise.weight || ''}
                onChange={(e) => handleExerciseChange(index, 'weight', e.target.value ? parseInt(e.target.value) : null)}
                min={0}
                placeholder="Optional"
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Log Workout'}
        </Button>
      </div>
    </form>
  );
}
