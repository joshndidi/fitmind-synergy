
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CreateWorkoutForm from '@/components/CreateWorkoutForm';

export default function CreateCustomWorkout() {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Custom Workout</h1>
          <p className="text-lg text-muted-foreground">
            Design your own workout routine with custom exercises, sets, reps, and rest times
          </p>
        </div>
        
        <CreateWorkoutForm />
      </div>
    </div>
  );
}
