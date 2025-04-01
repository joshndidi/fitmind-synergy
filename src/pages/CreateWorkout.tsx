import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { WorkoutForm } from '@/components/WorkoutForm';
import { useWorkout } from '@/hooks/useWorkout';
import { toast } from 'sonner';
import { CreateWorkoutPlanInput, UpdateWorkoutPlanInput } from '@/types/workout';

export default function CreateWorkout() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { createWorkoutPlan, updateWorkoutPlan, workoutPlans, loading } = useWorkout();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const workout = id ? workoutPlans.find((w) => w.id === id) : undefined;

  const handleSubmit = async (data: CreateWorkoutPlanInput | UpdateWorkoutPlanInput) => {
    try {
      setIsSubmitting(true);
      if (id) {
        await updateWorkoutPlan(id, data as UpdateWorkoutPlanInput);
        toast.success('Workout updated successfully');
      } else {
        await createWorkoutPlan(data as CreateWorkoutPlanInput);
        toast.success('Workout created successfully');
      }
      navigate('/workouts');
    } catch (error) {
      toast.error('Failed to save workout');
      console.error('Error saving workout:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-light mb-2">
          {id ? 'Edit Workout' : 'Create New Workout'}
        </h1>
        <p className="text-text-muted">
          {id
            ? 'Update your workout details and exercises'
            : 'Create a new workout plan with exercises'}
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <WorkoutForm
          onSubmit={handleSubmit}
          initialData={workout}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
} 