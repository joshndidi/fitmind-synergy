import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { WorkoutExecution } from "@/components/WorkoutExecution";
import { useToast } from "@/components/ui/use-toast";

// Define local types to avoid conflicts with imported types
interface ExecutionExercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  restTime: number; // Ensuring this property exists to match Exercise type
  rest?: number;
  notes?: string;
  orderIndex?: number; // Adding optional orderIndex to match WorkoutExercise
  completed?: boolean;
  currentSet?: number;
}

interface ExecutionWorkoutPlan {
  id: string;
  name: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number;
  exercises: ExecutionExercise[];
  createdAt?: string;
  updatedAt?: string;
}

export function WorkoutExecutionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [workoutPlan, setWorkoutPlan] = useState<ExecutionWorkoutPlan | null>(null);

  // In a real application, you would fetch the workout plan from your backend
  // For now, we'll use a mock workout plan
  useEffect(() => {
    const mockPlan: ExecutionWorkoutPlan = {
      id: "1",
      name: "Full Body Strength",
      description: "A comprehensive full body workout for building strength",
      difficulty: "intermediate",
      duration: 60,
      exercises: [
        {
          id: "1",
          name: "Bench Press",
          sets: 4,
          reps: 8,
          restTime: 90,
          notes: "Focus on controlled movement",
        },
        {
          id: "2",
          name: "Squats",
          sets: 4,
          reps: 10,
          restTime: 90,
          notes: "Keep back straight",
        },
        {
          id: "3",
          name: "Deadlifts",
          sets: 3,
          reps: 6,
          restTime: 120,
          notes: "Maintain proper form",
        },
      ],
      createdAt: "2024-03-20T10:00:00Z",
      updatedAt: "2024-03-20T10:00:00Z",
    };
    setWorkoutPlan(mockPlan);
  }, [id]);

  const handleComplete = async (results: any) => {
    try {
      // In a real application, you would save the workout results to your backend
      console.log("Workout completed:", results);
      
      toast({
        title: "Success",
        description: "Workout completed successfully!",
      });

      // Navigate back to the workout plans page
      navigate("/workouts");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save workout results. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    navigate("/workouts");
  };

  if (!workoutPlan) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Loading workout plan...</h1>
        </div>
      </div>
    );
  }

  return (
    <WorkoutExecution
      plan={workoutPlan as any} // Using type assertion as a temporary solution
      onComplete={handleComplete}
      onCancel={handleCancel}
    />
  );
}
