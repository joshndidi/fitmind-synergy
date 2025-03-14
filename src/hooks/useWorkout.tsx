
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
  reps: number | string;
  weight: number | string;
  completed: boolean;
};

export type LoggedWorkout = {
  id: string;
  workoutId: string;
  date: Date;
  title: string;
  totalWeight: number;
  exercises: {
    name: string;
    sets: number;
    reps: number;
    weight: number;
    completed: boolean;
  }[];
};

export const useWorkout = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loggedWorkouts, setLoggedWorkouts] = useState<LoggedWorkout[]>([]);
  const [totalWeightLifted, setTotalWeightLifted] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load logged workouts and total weight from localStorage on initial render
  useEffect(() => {
    try {
      const savedLoggedWorkouts = localStorage.getItem('loggedWorkouts');
      if (savedLoggedWorkouts) {
        const parsed = JSON.parse(savedLoggedWorkouts);
        // Convert string dates back to Date objects
        const formattedWorkouts = parsed.map((workout: any) => ({
          ...workout,
          date: new Date(workout.date),
        }));
        setLoggedWorkouts(formattedWorkouts);
      }

      const savedTotalWeight = localStorage.getItem('totalWeightLifted');
      if (savedTotalWeight) {
        setTotalWeightLifted(Number(savedTotalWeight));
      }
    } catch (err) {
      console.error("Error loading saved workouts:", err);
    }
  }, []);

  // Save logged workouts and total weight to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('loggedWorkouts', JSON.stringify(loggedWorkouts));
      localStorage.setItem('totalWeightLifted', totalWeightLifted.toString());
    } catch (err) {
      console.error("Error saving workouts:", err);
    }
  }, [loggedWorkouts, totalWeightLifted]);

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
          {
            id: "6",
            title: "Arm Day",
            type: "Strength",
            duration: 40,
            calories: 280,
            date: "6 days ago",
            intensity: "High",
            exercises: [
              { id: "e12", name: "Bicep Curls", sets: 4, reps: 12, weight: 15, completed: false },
              { id: "e13", name: "Hammer Curls", sets: 3, reps: 10, weight: 12, completed: false },
              { id: "e14", name: "Tricep Pushdowns", sets: 4, reps: 15, weight: 25, completed: false },
              { id: "e15", name: "Overhead Tricep Extension", sets: 3, reps: 12, weight: 20, completed: false },
            ],
          },
          {
            id: "7",
            title: "Core Workout",
            type: "Strength",
            duration: 30,
            calories: 200,
            date: "1 week ago",
            intensity: "Medium",
            exercises: [
              { id: "e16", name: "Crunches", sets: 3, reps: 20, weight: 0, completed: false },
              { id: "e17", name: "Plank", sets: 3, reps: "60 sec", weight: 0, completed: false },
              { id: "e18", name: "Russian Twists", sets: 3, reps: 15, weight: 10, completed: false },
              { id: "e19", name: "Leg Raises", sets: 3, reps: 15, weight: 0, completed: false },
            ],
          },
          {
            id: "8",
            title: "Full Body Workout",
            type: "Strength",
            duration: 60,
            calories: 500,
            date: "1 week ago",
            intensity: "High",
            exercises: [
              { id: "e20", name: "Deadlifts", sets: 4, reps: 8, weight: 120, completed: false },
              { id: "e21", name: "Bench Press", sets: 4, reps: 10, weight: 80, completed: false },
              { id: "e22", name: "Squats", sets: 4, reps: 10, weight: 100, completed: false },
              { id: "e23", name: "Pull-ups", sets: 3, reps: 8, weight: 0, completed: false },
              { id: "e24", name: "Shoulder Press", sets: 3, reps: 10, weight: 30, completed: false },
            ],
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

  // Log a completed workout
  const logWorkout = (workout: Workout, completedExercises: number[]) => {
    // Calculate total weight lifted in this workout
    let workoutTotalWeight = 0;
    
    const completedExercisesList = workout.exercises
      .filter((_, index) => completedExercises.includes(index))
      .map(exercise => {
        // Normalize weight and reps to numbers
        const weight = typeof exercise.weight === 'string' ? 
          parseFloat(exercise.weight.replace(/[^\d.]/g, '')) || 0 : 
          exercise.weight;
          
        const reps = typeof exercise.reps === 'string' ? 
          parseFloat(exercise.reps.replace(/[^\d.]/g, '')) || 0 : 
          exercise.reps;
          
        // Calculate total weight for this exercise (weight × sets × reps)
        const exerciseTotalWeight = weight * exercise.sets * reps;
        workoutTotalWeight += exerciseTotalWeight;
        
        return {
          ...exercise,
          completed: true,
          weight: typeof weight === 'number' ? weight : 0,
          reps: typeof reps === 'number' ? reps : 0
        };
      });
    
    // Create a new logged workout entry
    const newLoggedWorkout: LoggedWorkout = {
      id: `log-${Date.now()}`,
      workoutId: workout.id,
      date: new Date(),
      title: workout.title,
      totalWeight: workoutTotalWeight,
      exercises: completedExercisesList,
    };
    
    // Update state
    setLoggedWorkouts(prev => [...prev, newLoggedWorkout]);
    setTotalWeightLifted(prev => prev + workoutTotalWeight);
    
    return newLoggedWorkout;
  };

  // Log a custom workout
  const logCustomWorkout = (
    title: string, 
    exercises: { name: string; sets: number; reps: number; weight: number }[]
  ) => {
    // Calculate total weight
    let workoutTotalWeight = 0;
    
    const processedExercises = exercises.map(exercise => {
      const exerciseTotalWeight = exercise.weight * exercise.sets * exercise.reps;
      workoutTotalWeight += exerciseTotalWeight;
      
      return {
        ...exercise,
        completed: true
      };
    });
    
    // Create logged workout
    const newLoggedWorkout: LoggedWorkout = {
      id: `custom-${Date.now()}`,
      workoutId: 'custom',
      date: new Date(),
      title,
      totalWeight: workoutTotalWeight,
      exercises: processedExercises,
    };
    
    // Update state
    setLoggedWorkouts(prev => [...prev, newLoggedWorkout]);
    setTotalWeightLifted(prev => prev + workoutTotalWeight);
    
    return newLoggedWorkout;
  };

  // Get achievements based on total weight lifted
  const getAchievements = () => {
    const weightMilestones = [
      { id: 'beginner', name: 'Beginner Lifter', description: 'Lift your first 1,000 kg', threshold: 1000, icon: '🏋️' },
      { id: 'intermediate', name: 'Intermediate Lifter', description: 'Lift 5,000 kg total', threshold: 5000, icon: '💪' },
      { id: 'advanced', name: 'Advanced Lifter', description: 'Lift 10,000 kg total', threshold: 10000, icon: '🔥' },
      { id: 'expert', name: 'Expert Lifter', description: 'Lift 25,000 kg total', threshold: 25000, icon: '⭐' },
      { id: 'master', name: 'Master Lifter', description: 'Lift 50,000 kg total', threshold: 50000, icon: '🏆' },
      { id: 'elite', name: 'Elite Lifter', description: 'Lift 100,000 kg total', threshold: 100000, icon: '👑' },
    ];
    
    return weightMilestones.map(milestone => ({
      ...milestone,
      achieved: totalWeightLifted >= milestone.threshold,
      progress: Math.min(totalWeightLifted / milestone.threshold, 1),
    }));
  };

  return {
    workouts,
    loggedWorkouts,
    totalWeightLifted,
    loading,
    error,
    getWorkout,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    logWorkout,
    logCustomWorkout,
    getAchievements
  };
};
