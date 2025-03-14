
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Workout, Exercise } from "../types/workout";

// Mock workout data
const mockWorkouts: Workout[] = [
  {
    id: "w1",
    title: "Upper Body Power",
    description: "Focus on building strength in your chest, back, and arms with this intense workout.",
    type: "Strength",
    date: new Date().toISOString(),
    calories: 350,
    duration: 45,
    intensity: "High",
    exercises: [
      { name: "Bench Press", sets: 4, reps: "8-10", weight: "135 lbs", rest: "90 sec" },
      { name: "Pull Ups", sets: 3, reps: "8-12", weight: "Bodyweight", rest: "60 sec" },
      { name: "Shoulder Press", sets: 3, reps: "10-12", weight: "60 lbs", rest: "60 sec" },
      { name: "Bent Over Rows", sets: 3, reps: "10-12", weight: "95 lbs", rest: "60 sec" },
      { name: "Tricep Dips", sets: 3, reps: "12-15", weight: "Bodyweight", rest: "45 sec" },
      { name: "Bicep Curls", sets: 3, reps: "12-15", weight: "30 lbs", rest: "45 sec" }
    ]
  },
  {
    id: "w2",
    title: "Lower Body Focus",
    description: "Build strength and size in your legs with this comprehensive lower body workout.",
    type: "Strength",
    date: new Date().toISOString(),
    calories: 400,
    duration: 50,
    intensity: "High",
    exercises: [
      { name: "Squats", sets: 4, reps: "8-10", weight: "185 lbs", rest: "90 sec" },
      { name: "Romanian Deadlifts", sets: 3, reps: "10-12", weight: "135 lbs", rest: "75 sec" },
      { name: "Leg Press", sets: 3, reps: "12-15", weight: "225 lbs", rest: "60 sec" },
      { name: "Walking Lunges", sets: 3, reps: "12 each leg", weight: "30 lbs", rest: "60 sec" },
      { name: "Calf Raises", sets: 4, reps: "15-20", weight: "120 lbs", rest: "45 sec" },
      { name: "Leg Extensions", sets: 3, reps: "12-15", weight: "90 lbs", rest: "45 sec" }
    ]
  },
  {
    id: "w3",
    title: "Core & HIIT",
    description: "Combine core strengthening with high-intensity intervals for maximum calorie burn.",
    type: "HIIT",
    date: new Date().toISOString(),
    calories: 320,
    duration: 30,
    intensity: "Medium",
    exercises: [
      { name: "Plank", sets: 3, reps: "45 sec hold", weight: "Bodyweight", rest: "30 sec" },
      { name: "Mountain Climbers", sets: 3, reps: "30 sec", weight: "Bodyweight", rest: "15 sec" },
      { name: "Russian Twists", sets: 3, reps: "16 total", weight: "25 lbs", rest: "30 sec" },
      { name: "Burpees", sets: 3, reps: "10", weight: "Bodyweight", rest: "45 sec" },
      { name: "Bicycle Crunches", sets: 3, reps: "20 total", weight: "Bodyweight", rest: "30 sec" },
      { name: "Jump Squats", sets: 3, reps: "12", weight: "Bodyweight", rest: "30 sec" }
    ]
  },
  {
    id: "w4",
    title: "Arms Blast",
    description: "Isolate and strengthen your biceps, triceps, and forearms with this targeted workout.",
    type: "Isolation",
    date: new Date().toISOString(),
    calories: 250,
    duration: 40,
    intensity: "Medium",
    exercises: [
      { name: "Barbell Curls", sets: 3, reps: "10-12", weight: "50 lbs", rest: "60 sec" },
      { name: "Skull Crushers", sets: 3, reps: "10-12", weight: "45 lbs", rest: "60 sec" },
      { name: "Hammer Curls", sets: 3, reps: "12-15", weight: "25 lbs", rest: "45 sec" },
      { name: "Tricep Pushdowns", sets: 3, reps: "12-15", weight: "40 lbs", rest: "45 sec" },
      { name: "Preacher Curls", sets: 3, reps: "10-12", weight: "35 lbs", rest: "60 sec" },
      { name: "Overhead Tricep Extensions", sets: 3, reps: "12-15", weight: "20 lbs", rest: "45 sec" }
    ]
  },
  {
    id: "w5",
    title: "Full Body Circuit",
    description: "Hit every major muscle group with this efficient full-body workout.",
    type: "Circuit",
    date: new Date().toISOString(),
    calories: 380,
    duration: 45,
    intensity: "High",
    exercises: [
      { name: "Dumbbell Thrusters", sets: 3, reps: "12", weight: "25 lbs each", rest: "30 sec" },
      { name: "Renegade Rows", sets: 3, reps: "10 each side", weight: "20 lbs each", rest: "30 sec" },
      { name: "Goblet Squats", sets: 3, reps: "15", weight: "50 lbs", rest: "30 sec" },
      { name: "Push-ups", sets: 3, reps: "15", weight: "Bodyweight", rest: "30 sec" },
      { name: "Kettlebell Swings", sets: 3, reps: "15", weight: "35 lbs", rest: "30 sec" },
      { name: "Plank to Push-up", sets: 3, reps: "10 total", weight: "Bodyweight", rest: "30 sec" }
    ]
  }
];

export const useWorkout = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [completedWorkouts, setCompletedWorkouts] = useState<Workout[]>([]);
  const [totalWeightLifted, setTotalWeightLifted] = useState<number>(0);
  
  // Load workout data on mount
  useEffect(() => {
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
      completedDate: new Date().toISOString()
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
  
  return {
    workouts,
    completedWorkouts,
    totalWeightLifted,
    getWorkoutById,
    completeWorkout
  };
};
