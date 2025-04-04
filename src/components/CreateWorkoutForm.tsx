
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { WorkoutType, WorkoutIntensity } from '@/types/workout';
import { Plus, Minus } from 'lucide-react';

interface ExerciseForm {
  name: string;
  sets: number;
  reps: number;
  weight: number | null;
  duration: number | null;
  restTime: number;
  orderIndex: number;
  notes: string;
}

interface WorkoutForm {
  title: string;
  description: string;
  type: WorkoutType;
  duration: number;
  intensity: WorkoutIntensity;
  calories: number | null;
  isTemplate: boolean;
}

export default function CreateWorkoutForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [workout, setWorkout] = useState<WorkoutForm>({
    title: '',
    description: '',
    type: 'strength',
    duration: 45,
    intensity: 'intermediate',
    calories: null,
    isTemplate: false
  });
  
  const [exercises, setExercises] = useState<ExerciseForm[]>([{
    name: '',
    sets: 3,
    reps: 10,
    weight: null,
    duration: null,
    restTime: 60,
    orderIndex: 0,
    notes: ''
  }]);

  const handleWorkoutChange = (field: keyof WorkoutForm, value: any) => {
    setWorkout({ ...workout, [field]: value });
  };

  const handleExerciseChange = (index: number, field: keyof ExerciseForm, value: any) => {
    const updatedExercises = [...exercises];
    updatedExercises[index] = { ...updatedExercises[index], [field]: value };
    setExercises(updatedExercises);
  };

  const addExercise = () => {
    setExercises([
      ...exercises,
      {
        name: '',
        sets: 3,
        reps: 10,
        weight: null,
        duration: null,
        restTime: 60,
        orderIndex: exercises.length,
        notes: ''
      }
    ]);
  };

  const removeExercise = (index: number) => {
    if (exercises.length === 1) {
      toast.error('Workout must have at least one exercise');
      return;
    }
    
    const updatedExercises = exercises.filter((_, i) => i !== index);
    // Update order indexes
    updatedExercises.forEach((ex, i) => {
      ex.orderIndex = i;
    });
    
    setExercises(updatedExercises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to create a workout');
      return;
    }
    
    if (!workout.title.trim()) {
      toast.error('Workout title is required');
      return;
    }
    
    if (exercises.some(ex => !ex.name.trim())) {
      toast.error('All exercises must have a name');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Insert workout plan
      const { data: workoutData, error: workoutError } = await supabase
        .from('workout_plans')
        .insert({
          user_id: user.id,
          title: workout.title,
          description: workout.description,
          type: workout.type,
          duration: workout.duration,
          calories: workout.calories || 0,
          intensity: workout.intensity,
          is_ai_generated: false,
          is_template: workout.isTemplate
        })
        .select()
        .single();
        
      if (workoutError) throw workoutError;
      
      // Insert exercises
      const exercisesData = exercises.map(ex => ({
        workout_plan_id: workoutData.id,
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight || 0,
        duration: ex.duration || 0,
        rest_time: ex.restTime,
        notes: ex.notes,
        order_index: ex.orderIndex
      }));
      
      const { error: exercisesError } = await supabase
        .from('workout_exercises')
        .insert(exercisesData);
        
      if (exercisesError) throw exercisesError;
      
      toast.success('Workout created successfully');
      navigate('/workouts');
    } catch (error) {
      console.error('Error creating workout:', error);
      toast.error('Failed to create workout');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Workout Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Workout Title</Label>
            <Input
              id="title"
              value={workout.title}
              onChange={(e) => handleWorkoutChange('title', e.target.value)}
              placeholder="My Custom Workout"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={workout.description}
              onChange={(e) => handleWorkoutChange('description', e.target.value)}
              placeholder="Describe your workout"
              className="min-h-[100px]"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Workout Type</Label>
              <Select 
                value={workout.type} 
                onValueChange={(value) => handleWorkoutChange('type', value as WorkoutType)}
              >
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
            
            <div className="space-y-2">
              <Label htmlFor="intensity">Intensity</Label>
              <Select 
                value={workout.intensity} 
                onValueChange={(value) => handleWorkoutChange('intensity', value as WorkoutIntensity)}
              >
                <SelectTrigger id="intensity">
                  <SelectValue placeholder="Select intensity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={workout.duration}
                onChange={(e) => handleWorkoutChange('duration', parseInt(e.target.value) || 0)}
                min={5}
                placeholder="45"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="calories">Estimated Calories</Label>
              <Input
                id="calories"
                type="number"
                value={workout.calories || ''}
                onChange={(e) => handleWorkoutChange('calories', e.target.value ? parseInt(e.target.value) : null)}
                min={0}
                placeholder="Optional"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="isTemplate"
              checked={workout.isTemplate}
              onChange={(e) => handleWorkoutChange('isTemplate', e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="isTemplate" className="cursor-pointer">Save as template</Label>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Exercises</CardTitle>
          <Button type="button" onClick={addExercise} size="sm">
            <Plus className="mr-1 h-4 w-4" /> Add Exercise
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {exercises.map((exercise, index) => (
            <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Exercise {index + 1}</h3>
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
                
                <div className="space-y-2">
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
                
                <div className="space-y-2">
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
                
                <div className="space-y-2">
                  <Label htmlFor={`exercise-${index}-rest`}>Rest Time (sec)</Label>
                  <Input
                    id={`exercise-${index}-rest`}
                    type="number"
                    value={exercise.restTime}
                    onChange={(e) => handleExerciseChange(index, 'restTime', parseInt(e.target.value) || 60)}
                    min={0}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`exercise-${index}-notes`}>Notes</Label>
                <Textarea
                  id={`exercise-${index}-notes`}
                  value={exercise.notes}
                  onChange={(e) => handleExerciseChange(index, 'notes', e.target.value)}
                  placeholder="Instructions or tips (optional)"
                  className="min-h-[80px]"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      
      <div className="flex justify-end space-x-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate('/workouts')}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Workout'}
        </Button>
      </div>
    </form>
  );
}
