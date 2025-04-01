import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Workout, Exercise, WorkoutType, WorkoutIntensity } from "../types/workout";
import { format } from "date-fns";

// Mock workout data
const mockWorkouts: Workout[] = [
  {
    id: '1',
    title: 'Full Body Strength',
    description: 'A comprehensive full body workout',
    calories: 500,
    duration: 60,
    intensity: 'High',
    exercises: [
      {
        name: 'Bench Press',
        sets: 3,
        reps: '10-12',
        weight: '135lbs',
        duration: 45,
        calories: 150
      },
      {
        name: 'Squats',
        sets: 4,
        reps: '8-10',
        weight: '185lbs',
        duration: 60,
        calories: 200
      }
    ],
    type: 'strength',
    date: new Date().toISOString().split('T')[0],
    totalWeight: 320
  },
  {
    id: '2',
    title: 'Cardio Blast',
    description: 'High intensity cardio workout',
    calories: 400,
    duration: 45,
    intensity: 'High',
    exercises: [
      {
        name: 'Running',
        sets: 1,
        reps: '30min',
        weight: '0',
        duration: 1800,
        calories: 300
      }
    ],
    type: 'cardio',
    date: new Date().toISOString().split('T')[0],
    totalWeight: 0
  }
];

export const useWorkout = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [completedWorkouts, setCompletedWorkouts] = useState<Workout[]>([]);
  const [totalWeightLifted, setTotalWeightLifted] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  
  // Load workout data on mount
  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        // Load from localStorage if available
        const storedWorkouts = localStorage.getItem("workouts");
        const storedCompletedWorkouts = localStorage.getItem("completedWorkouts");
        const storedTotalWeight = localStorage.getItem("totalWeightLifted");
        
        if (storedWorkouts) {
          setWorkouts(JSON.parse(storedWorkouts));
        } else {
          // Use mock data if no stored data exists
          setWorkouts(mockWorkouts);
          localStorage.setItem("workouts", JSON.stringify(mockWorkouts));
        }
        
        if (storedCompletedWorkouts) {
          setCompletedWorkouts(JSON.parse(storedCompletedWorkouts));
        }
        
        if (storedTotalWeight) {
          setTotalWeightLifted(Number(storedTotalWeight));
        }
      } catch (error) {
        console.error('Error loading workouts:', error);
        // Set empty arrays as fallback
        setWorkouts([]);
        setCompletedWorkouts([]);
        setTotalWeightLifted(0);
      } finally {
        setLoading(false);
      }
    };
    
    loadWorkouts();
  }, []);
  
  // Update localStorage when state changes
  useEffect(() => {
    if (workouts.length > 0) {
      localStorage.setItem("workouts", JSON.stringify(workouts));
    }
    
    if (completedWorkouts.length > 0) {
      localStorage.setItem("completedWorkouts", JSON.stringify(completedWorkouts));
    }
    
    localStorage.setItem("totalWeightLifted", totalWeightLifted.toString());
  }, [workouts, completedWorkouts, totalWeightLifted]);
  
  const getWorkoutById = (id: string): Workout | null => {
    const workout = workouts.find(w => w.id === id);
    return workout || null;
  };
  
  const calculateWorkoutWeight = (workout: Workout): number => {
    let totalWeight = 0;
    
    workout.exercises.forEach(exercise => {
      const weight = exercise.weight === "Bodyweight" ? 0 : parseInt(exercise.weight);
      if (!isNaN(weight)) {
        // Calculate weight per exercise: weight × sets × average reps
        const repRange = exercise.reps.includes("-") 
          ? exercise.reps.split("-").map(Number)
          : [parseInt(exercise.reps), parseInt(exercise.reps)];
        
        if (!isNaN(repRange[0])) {
          const avgReps = repRange.length > 1 
            ? (repRange[0] + repRange[1]) / 2 
            : repRange[0];
          
          totalWeight += weight * exercise.sets * avgReps;
        }
      }
    });
    
    return totalWeight;
  };
  
  const completeWorkout = (workout: Workout) => {
    // Mark workout as completed
    const completedWorkout = {
      ...workout,
      completedAt: new Date().toISOString()
    };
    
    setCompletedWorkouts(prev => [...prev, completedWorkout]);
    
    // Calculate and add weight lifted
    const weightLifted = calculateWorkoutWeight(workout);
    setTotalWeightLifted(prev => prev + weightLifted);
    
    toast.success(`You've lifted ${weightLifted.toLocaleString()} lbs in this workout!`);
    
    // Check for achievements
    checkAchievements(totalWeightLifted + weightLifted);
  };
  
  const checkAchievements = (totalWeight: number) => {
    const achievements = [
      { threshold: 5000, name: "Beginner Lifter" },
      { threshold: 25000, name: "Intermediate Lifter" },
      { threshold: 100000, name: "Advanced Lifter" },
      { threshold: 500000, name: "Elite Lifter" },
      { threshold: 1000000, name: "Legendary Lifter" }
    ];
    
    // Find the highest achieved level
    for (let i = achievements.length - 1; i >= 0; i--) {
      if (totalWeight >= achievements[i].threshold) {
        toast.success(`Achievement Unlocked: ${achievements[i].name}!`, {
          duration: 5000
        });
        break;
      }
    }
  };
  
  // New function to save AI-generated workout plan
  const saveAIWorkoutPlan = (plan: any) => {
    const newWorkouts: Workout[] = [];
    
    plan.workouts.forEach((workout: any, index: number) => {
      // Format exercises to match our Exercise type
      const exercises: Exercise[] = workout.exercises.map((ex: any) => ({
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps.toString(),
        weight: ex.weight || "0",
        rest: ex.rest || "60 sec"
      }));
      
      // Generate a random calorie burn based on intensity and duration
      const intensityMultiplier = 
        workout.intensity === "High" ? 12 :
        workout.intensity === "Medium" ? 10 : 8;
      const calories = Math.round(workout.duration * intensityMultiplier);
      
      // Create a workout with today's date + index days
      const today = new Date();
      today.setDate(today.getDate() + index);
      const formattedDate = format(today, 'yyyy-MM-dd');
      
      // Create the new workout object
      const newWorkout: Workout = {
        id: `ai-${Date.now()}-${index}`,
        title: workout.name,
        description: `${plan.overview} - Day ${workout.day}`,
        calories,
        duration: workout.duration,
        intensity: workout.intensity,
        exercises,
        type: workout.name.split(":")[1]?.trim() || "AI Workout",
        date: formattedDate
      };
      
      newWorkouts.push(newWorkout);
    });
    
    // Add the new workouts to the existing workouts
    setWorkouts(prev => [...prev, ...newWorkouts]);
    toast.success(`Added ${newWorkouts.length} workouts to your plan!`);
    
    return newWorkouts;
  };
  
  // Function to get logged workouts for the calendar
  const getLoggedWorkouts = () => {
    return completedWorkouts.map(workout => ({
      ...workout,
      totalWeight: calculateWorkoutWeight(workout)
    }));
  };
  
  // Function to log a custom workout
  const logCustomWorkout = (title: string, exercises: Exercise[]) => {
    const workout: Workout = {
      id: `custom-${Date.now()}`,
      title,
      description: "Custom logged workout",
      calories: exercises.length * 50,
      duration: exercises.length * 5,
      intensity: "Medium",
      exercises,
      type: "custom",
      date: format(new Date(), 'yyyy-MM-dd'),
      completedAt: format(new Date(), 'yyyy-MM-dd')
    };
    
    // Add to completed workouts
    setCompletedWorkouts(prev => [...prev, workout]);
    
    // Calculate and add weight lifted
    const weightLifted = calculateWorkoutWeight(workout);
    setTotalWeightLifted(prev => prev + weightLifted);
    
    toast.success(`Custom workout logged: ${workout.title}!`);
    
    // Check for achievements
    checkAchievements(totalWeightLifted + weightLifted);
  };
  
  // Function to get achievements based on total weight lifted
  const getAchievements = () => {
    const achievements = [
      { 
        id: "beginner",
        name: "Beginner Lifter", 
        description: "Lift your first 5,000 kg total",
        threshold: 5000, 
        icon: "🏋️‍♂️", 
      },
      { 
        id: "intermediate",
        name: "Intermediate Lifter", 
        description: "Lift 25,000 kg total",
        threshold: 25000, 
        icon: "💪", 
      },
      { 
        id: "advanced",
        name: "Advanced Lifter", 
        description: "Lift 100,000 kg total",
        threshold: 100000, 
        icon: "🔥", 
      },
      { 
        id: "elite",
        name: "Elite Lifter", 
        description: "Lift 500,000 kg total",
        threshold: 500000, 
        icon: "⭐", 
      },
      { 
        id: "legendary",
        name: "Legendary Lifter", 
        description: "Lift 1,000,000 kg total",
        threshold: 1000000, 
        icon: "🏆", 
      }
    ];
    
    return achievements.map(achievement => ({
      ...achievement,
      achieved: totalWeightLifted >= achievement.threshold,
      progress: Math.min(1, totalWeightLifted / achievement.threshold)
    }));
  };
  
  return {
    workouts,
    completedWorkouts,
    totalWeightLifted,
    loading,
    getWorkoutById,
    completeWorkout,
    saveAIWorkoutPlan,
    logCustomWorkout,
    getAchievements,
    loggedWorkouts: getLoggedWorkouts()
  };
};

export type { Workout } from "../types/workout";
