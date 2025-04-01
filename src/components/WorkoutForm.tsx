import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { WorkoutType, WorkoutIntensity, WorkoutExercise } from '@/types/workout';

const exerciseSchema = z.object({
  name: z.string().min(1, 'Exercise name is required'),
  sets: z.number().min(1, 'Sets must be at least 1'),
  reps: z.number().min(1, 'Reps must be at least 1'),
  weight: z.number().optional(),
  duration: z.number().optional(),
  restTime: z.number().optional(),
  notes: z.string().optional(),
});

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  type: z.enum(['strength', 'cardio', 'flexibility', 'hiit', 'custom'] as const),
  duration: z.number().min(1, 'Duration must be at least 1 minute'),
  calories: z.number().optional(),
  intensity: z.enum(['beginner', 'intermediate', 'advanced'] as const),
  exercises: z.array(exerciseSchema).min(1, 'At least one exercise is required'),
});

interface WorkoutFormProps {
  onSubmit: (data: z.infer<typeof formSchema>) => Promise<void>;
  initialData?: {
    title: string;
    description?: string;
    type: WorkoutType;
    duration: number;
    calories?: number;
    intensity: WorkoutIntensity;
    exercises: WorkoutExercise[];
  };
  isSubmitting?: boolean;
}

export function WorkoutForm({ onSubmit, initialData, isSubmitting }: WorkoutFormProps) {
  const [exercises, setExercises] = useState<WorkoutExercise[]>(
    initialData?.exercises || []
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      type: initialData?.type || 'strength',
      duration: initialData?.duration || 30,
      calories: initialData?.calories || 0,
      intensity: initialData?.intensity || 'beginner',
      exercises: initialData?.exercises || [],
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    await onSubmit({
      ...data,
      exercises,
    });
  };

  const addExercise = () => {
    setExercises([
      ...exercises,
      {
        id: `temp-${Date.now()}`,
        name: '',
        sets: 3,
        reps: 12,
        orderIndex: exercises.length,
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index: number, field: keyof WorkoutExercise, value: any) => {
    const newExercises = [...exercises];
    newExercises[index] = {
      ...newExercises[index],
      [field]: value,
    };
    setExercises(newExercises);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter workout title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter workout description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select workout type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="strength">Strength</SelectItem>
                    <SelectItem value="cardio">Cardio</SelectItem>
                    <SelectItem value="flexibility">Flexibility</SelectItem>
                    <SelectItem value="hiit">HIIT</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="intensity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Intensity</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select intensity" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="calories"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimated Calories</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Exercises</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addExercise}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Exercise
            </Button>
          </div>

          {exercises.map((exercise, index) => (
            <div
              key={exercise.id}
              className="p-4 border rounded-lg space-y-4"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Exercise {index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExercise(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      value={exercise.name}
                      onChange={(e) =>
                        updateExercise(index, 'name', e.target.value)
                      }
                    />
                  </FormControl>
                </FormItem>

                <FormItem>
                  <FormLabel>Sets</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      value={exercise.sets}
                      onChange={(e) =>
                        updateExercise(index, 'sets', Number(e.target.value))
                      }
                    />
                  </FormControl>
                </FormItem>

                <FormItem>
                  <FormLabel>Reps</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      value={exercise.reps}
                      onChange={(e) =>
                        updateExercise(index, 'reps', Number(e.target.value))
                      }
                    />
                  </FormControl>
                </FormItem>

                <FormItem>
                  <FormLabel>Weight (kg)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      value={exercise.weight || ''}
                      onChange={(e) =>
                        updateExercise(
                          index,
                          'weight',
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                    />
                  </FormControl>
                </FormItem>

                <FormItem>
                  <FormLabel>Duration (seconds)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      value={exercise.duration || ''}
                      onChange={(e) =>
                        updateExercise(
                          index,
                          'duration',
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                    />
                  </FormControl>
                </FormItem>

                <FormItem>
                  <FormLabel>Rest Time (seconds)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      value={exercise.restTime || ''}
                      onChange={(e) =>
                        updateExercise(
                          index,
                          'restTime',
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                    />
                  </FormControl>
                </FormItem>
              </div>

              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    value={exercise.notes || ''}
                    onChange={(e) =>
                      updateExercise(index, 'notes', e.target.value)
                    }
                  />
                </FormControl>
              </FormItem>
            </div>
          ))}
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Workout'}
        </Button>
      </form>
    </Form>
  );
} 