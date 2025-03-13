
import { useState, useEffect } from "react";

export type Workout = {
  id: string;
  title: string;
  type: string;
  duration: number;
  calories: number;
  date: string;
  intensity: "Low" | "Medium" | "High";
  exercises: Exercise[];
};

export type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  completed: boolean;
};

export const useWorkout = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Mock data
        const mockWorkouts: Workout[] = [
          {
            id: "1",
            title: "Upper Body Strength",
            type: "Strength",
            duration: 45,
            calories: 320,
            date: "Today",
            intensity: "High",
            exercises: [
              { id: "e1", name: "Bench Press", sets: 4, reps: 10, weight: 80, completed: false },
              { id: "e2", name: "Shoulder Press", sets: 3, reps: 12, weight: 30, completed: false },
              { id: "e3", name: "Pull-ups", sets: 3, reps: 8, weight: 0, completed: false },
              { id: "e4", name: "Tricep Extensions", sets: 3, reps: 15, weight: 20, completed: false },
            ],
          },
          {
            id: "2",
            title: "Leg Day",
            type: "Strength",
            duration: 50,
            calories: 450,
            date: "Yesterday",
            intensity: "High",
            exercises: [
              { id: "e5", name: "Squats", sets: 4, reps: 10, weight: 100, completed: true },
              { id: "e6", name: "Leg Press", sets: 3, reps: 12, weight: 150, completed: true },
              { id: "e7", name: "Lunges", sets: 3, reps: 10, weight: 20, completed: true },
              { id: "e8", name: "Calf Raises", sets: 4, reps: 15, weight: 40, completed: true },
            ],
          },
          {
            id: "3",
            title: "Morning Jog",
            type: "Cardio",
            duration: 25,
            calories: 220,
            date: "2 days ago",
            intensity: "Medium",
            exercises: [],
          },
          {
            id: "4",
            title: "Back Workout",
            type: "Strength",
            duration: 40,
            calories: 280,
            date: "3 days ago",
            intensity: "Medium",
            exercises: [
              { id: "e9", name: "Deadlifts", sets: 4, reps: 8, weight: 120, completed: true },
              { id: "e10", name: "Bent Over Rows", sets: 3, reps: 12, weight: 60, completed: true },
              { id: "e11", name: "Lat Pulldowns", sets: 3, reps: 10, weight: 70, completed: true },
            ],
          },
          {
            id: "5",
            title: "Light Cardio",
            type: "Cardio",
            duration: 30,
            calories: 180,
            date: "5 days ago",
            intensity: "Low",
            exercises: [],
          },
        ];
        
        setWorkouts(mockWorkouts);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  const getWorkout = (id: string): Workout | undefined => {
    return workouts.find((workout) => workout.id === id);
  };

  const addWorkout = (workout: Omit<Workout, "id">) => {
    const newWorkout = {
      ...workout,
      id: `workout-${Date.now()}`,
    };
    setWorkouts((prevWorkouts) => [...prevWorkouts, newWorkout]);
    return newWorkout;
  };

  const updateWorkout = (id: string, updates: Partial<Workout>) => {
    setWorkouts((prevWorkouts) =>
      prevWorkouts.map((workout) =>
        workout.id === id ? { ...workout, ...updates } : workout
      )
    );
  };

  const deleteWorkout = (id: string) => {
    setWorkouts((prevWorkouts) =>
      prevWorkouts.filter((workout) => workout.id !== id)
    );
  };

  return {
    workouts,
    loading,
    error,
    getWorkout,
    addWorkout,
    updateWorkout,
    deleteWorkout,
  };
};
