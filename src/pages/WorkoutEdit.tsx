import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useWorkout } from '@/hooks/useWorkout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function WorkoutEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getWorkoutPlan, updateWorkoutPlan } = useWorkout();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    difficulty: '',
    exercises: [
      {
        name: '',
        sets: '',
        reps: '',
        weight: '',
        notes: ''
      }
    ]
  });

  useEffect(() => {
    const loadWorkoutPlan = async () => {
      try {
        const plan = await getWorkoutPlan(id!);
        if (plan) {
          setFormData({
            name: plan.name,
            description: plan.description,
            duration: plan.duration.toString(),
            difficulty: plan.difficulty,
            exercises: plan.exercises.map((exercise) => ({
              name: exercise.name,
              sets: exercise.sets.toString(),
              reps: exercise.reps.toString(),
              weight: exercise.weight.toString(),
              notes: exercise.notes || ''
            }))
          });
        }
      } catch (error) {
        toast.error('Failed to load workout plan');
        navigate('/workouts');
      }
    };

    loadWorkoutPlan();
  }, [id, getWorkoutPlan, navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index?: number
  ) => {
    const { name, value } = e.target;
    if (typeof index === 'number') {
      setFormData((prev) => ({
        ...prev,
        exercises: prev.exercises.map((exercise, i) =>
          i === index ? { ...exercise, [name]: value } : exercise
        )
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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
          notes: ''
        }
      ]
    }));
  };

  const removeExercise = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateWorkoutPlan(id!, {
        name: formData.name,
        description: formData.description,
        duration: parseInt(formData.duration),
        difficulty: formData.difficulty,
        exercises: formData.exercises.map((exercise) => ({
          name: exercise.name,
          sets: parseInt(exercise.sets),
          reps: parseInt(exercise.reps),
          weight: parseFloat(exercise.weight),
          notes: exercise.notes
        }))
      });
      toast.success('Workout plan updated successfully');
      navigate('/workouts');
    } catch (error) {
      toast.error('Failed to update workout plan');
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-4xl font-bold mb-8">Edit Workout Plan</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Workout Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter workout name"
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
                <Label htmlFor="difficulty">Difficulty</Label>
                <Input
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  placeholder="Enter difficulty"
                  required
                />
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
                    onChange={(e) => handleInputChange(e, index)}
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
                      onChange={(e) => handleInputChange(e, index)}
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
                      onChange={(e) => handleInputChange(e, index)}
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
                      onChange={(e) => handleInputChange(e, index)}
                      placeholder="Weight"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`exercise-${index}-notes`}>Notes</Label>
                  <Textarea
                    id={`exercise-${index}-notes`}
                    name="notes"
                    value={exercise.notes}
                    onChange={(e) => handleInputChange(e, index)}
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
          <Button type="submit">Update Workout Plan</Button>
        </div>
      </form>
    </div>
  );
} 