import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkout } from '@/hooks/useWorkout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { WorkoutPlan } from '@/types/workout';

export default function WorkoutCreation() {
  const navigate = useNavigate();
  const { createWorkoutPlan, addExercisesToWorkoutPlan } = useWorkout();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'strength' as WorkoutPlan['type'],
    duration: '',
    calories: '',
    intensity: 'intermediate' as WorkoutPlan['intensity'],
    exercises: [
      {
        name: '',
        sets: '',
        reps: '',
        weight: '',
        notes: '',
        orderIndex: 0
      }
    ]
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleExerciseChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      exercises: prev.exercises.map((exercise, i) =>
        i === index ? { ...exercise, [name]: value } : exercise
      )
    }));
  };

  const addExercise = () => {
    setFormData((prev) => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        {
          name: '',
          sets: '',
          reps: '',
          weight: '',
          notes: '',
          orderIndex: prev.exercises.length
        }
      ]
    }));
  };

  const removeExercise = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      exercises: prev.exercises
        .filter((_, i) => i !== index)
        .map((exercise, i) => ({ ...exercise, orderIndex: i }))
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const workoutPlan: Omit<WorkoutPlan, 'id' | 'createdAt' | 'updatedAt' | 'userId'> = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        duration: parseInt(formData.duration),
        calories: formData.calories ? parseInt(formData.calories) : undefined,
        intensity: formData.intensity,
        isAiGenerated: false,
        isTemplate: false,
        exercises: []
      };
      const data = await createWorkoutPlan(workoutPlan);
      
      // Add exercises to the workout plan
      const exercises = formData.exercises.map((exercise) => ({
        name: exercise.name,
        sets: parseInt(exercise.sets),
        reps: parseInt(exercise.reps),
        weight: exercise.weight ? parseFloat(exercise.weight) : undefined,
        notes: exercise.notes,
        orderIndex: exercise.orderIndex
      }));
      await addExercisesToWorkoutPlan(data.id, exercises);

      toast.success('Workout plan created successfully');
      navigate('/workouts');
    } catch (error) {
      toast.error('Failed to create workout plan');
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-4xl font-bold mb-8">Create Workout Plan</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Workout Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter workout title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter workout description"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="Enter duration"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="calories">Calories (optional)</Label>
                <Input
                  id="calories"
                  name="calories"
                  type="number"
                  value={formData.calories}
                  onChange={handleInputChange}
                  placeholder="Enter calories"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  required
                >
                  <option value="strength">Strength</option>
                  <option value="cardio">Cardio</option>
                  <option value="flexibility">Flexibility</option>
                  <option value="hiit">HIIT</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="intensity">Intensity</Label>
                <select
                  id="intensity"
                  name="intensity"
                  value={formData.intensity}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  required
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Exercises</CardTitle>
            <Button type="button" onClick={addExercise}>
              Add Exercise
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {formData.exercises.map((exercise, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Exercise {index + 1}</h3>
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeExercise(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`exercise-${index}-name`}>Exercise Name</Label>
                  <Input
                    id={`exercise-${index}-name`}
                    name="name"
                    value={exercise.name}
                    onChange={(e) => handleExerciseChange(e, index)}
                    placeholder="Enter exercise name"
                    required
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`exercise-${index}-sets`}>Sets</Label>
                    <Input
                      id={`exercise-${index}-sets`}
                      name="sets"
                      type="number"
                      value={exercise.sets}
                      onChange={(e) => handleExerciseChange(e, index)}
                      placeholder="Sets"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`exercise-${index}-reps`}>Reps</Label>
                    <Input
                      id={`exercise-${index}-reps`}
                      name="reps"
                      type="number"
                      value={exercise.reps}
                      onChange={(e) => handleExerciseChange(e, index)}
                      placeholder="Reps"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`exercise-${index}-weight`}>Weight (kg)</Label>
                    <Input
                      id={`exercise-${index}-weight`}
                      name="weight"
                      type="number"
                      value={exercise.weight}
                      onChange={(e) => handleExerciseChange(e, index)}
                      placeholder="Weight"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`exercise-${index}-notes`}>Notes</Label>
                  <Textarea
                    id={`exercise-${index}-notes`}
                    name="notes"
                    value={exercise.notes}
                    onChange={(e) => handleExerciseChange(e, index)}
                    placeholder="Enter any notes or instructions"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => navigate('/workouts')}>
            Cancel
          </Button>
          <Button type="submit">Create Workout Plan</Button>
        </div>
      </form>
    </div>
  );
} 