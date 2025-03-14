
import { useState } from "react";

// Type for workout generation
export type WorkoutPlanInput = {
  days: number;
  focus: string;
  experience: "beginner" | "intermediate" | "advanced";
  equipment: "full" | "minimal" | "none";
  duration: number;
};

// Type for calorie tracking
export type CalorieTrackingResult = {
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  suggestedAlternatives?: string[];
};

export const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock function to generate workout plan
  const generateWorkoutPlan = async (input: WorkoutPlanInput) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call to an AI service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response based on input
      const { days, focus, experience, equipment, duration } = input;
      
      // Generate mock workout plan
      let workoutPlan = {
        overview: `${days}-Day ${focus} workout plan for ${experience} with ${equipment} equipment. Each workout is approximately ${duration} minutes.`,
        workouts: [] as any[],
      };
      
      // Generate workouts based on focus and days
      const focusToWorkouts: Record<string, string[]> = {
        "Strength": ["Upper Body", "Lower Body", "Full Body", "Push", "Pull", "Legs"],
        "Cardio": ["HIIT", "Steady State", "Intervals", "Tabata", "Circuit"],
        "Weight Loss": ["Full Body HIIT", "Cardio Circuit", "Metabolic Conditioning", "Tabata"],
        "Muscle Building": ["Chest & Triceps", "Back & Biceps", "Legs & Shoulders", "Upper Body", "Lower Body"],
      };
      
      const workoutTypes = focusToWorkouts[focus] || focusToWorkouts["Strength"];
      
      // Create workouts for each day
      for (let i = 0; i < days; i++) {
        const workoutType = workoutTypes[i % workoutTypes.length];
        
        workoutPlan.workouts.push({
          day: i + 1,
          name: `Day ${i + 1}: ${workoutType}`,
          exercises: generateExercises(workoutType, experience, equipment),
          duration: duration,
          intensity: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)],
        });
      }
      
      return workoutPlan;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Helper to generate exercises
  const generateExercises = (workoutType: string, experience: string, equipment: string) => {
    const exerciseCount = experience === "beginner" ? 4 : experience === "intermediate" ? 6 : 8;
    const exercises = [];
    
    // Map workout type to potential exercises
    const typeToExercises: Record<string, string[]> = {
      "Upper Body": ["Bench Press", "Push Ups", "Shoulder Press", "Pull Ups", "Dips", "Bicep Curls", "Tricep Extensions"],
      "Lower Body": ["Squats", "Deadlifts", "Lunges", "Leg Press", "Calf Raises", "Leg Extensions", "Leg Curls"],
      "Full Body": ["Deadlifts", "Squats", "Push Ups", "Pull Ups", "Shoulder Press", "Lunges", "Planks"],
      "Push": ["Bench Press", "Shoulder Press", "Incline Press", "Dips", "Push Ups", "Tricep Extensions"],
      "Pull": ["Pull Ups", "Rows", "Lat Pulldowns", "Face Pulls", "Bicep Curls", "Reverse Flyes"],
      "Legs": ["Squats", "Deadlifts", "Lunges", "Leg Press", "Calf Raises", "Hip Thrusts", "Leg Extensions"],
      "HIIT": ["Burpees", "Mountain Climbers", "Jump Squats", "High Knees", "Box Jumps", "Battle Ropes"],
      "Steady State": ["Running", "Cycling", "Swimming", "Rowing", "Elliptical"],
      "Chest & Triceps": ["Bench Press", "Incline Press", "Chest Flyes", "Dips", "Tricep Extensions", "Close Grip Bench"],
      "Back & Biceps": ["Pull Ups", "Rows", "Lat Pulldowns", "Face Pulls", "Bicep Curls", "Hammer Curls"],
      "Legs & Shoulders": ["Squats", "Lunges", "Shoulder Press", "Lateral Raises", "Front Raises", "Calf Raises"],
    };
    
    // Get possible exercises based on workout type
    const possibleExercises = typeToExercises[workoutType] || typeToExercises["Full Body"];
    
    // Shuffle exercises
    const shuffled = [...possibleExercises].sort(() => 0.5 - Math.random());
    
    // Take the number of exercises based on experience level
    const selectedExercises = shuffled.slice(0, exerciseCount);
    
    // Create exercise objects
    for (const exercise of selectedExercises) {
      const sets = experience === "beginner" ? 3 : experience === "intermediate" ? 4 : 5;
      const reps = Math.floor(Math.random() * 6) + 8; // 8-13 reps
      
      exercises.push({
        name: exercise,
        sets,
        reps,
        rest: "60-90 sec",
      });
    }
    
    return exercises;
  };

  // Mock function to analyze food image
  const analyzeFood = async (image: File) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would upload the image to an AI service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock responses
      const mockFoods = [
        {
          description: "Grilled chicken breast with steamed broccoli and brown rice",
          calories: 420,
          protein: 35,
          carbs: 45,
          fat: 12,
        },
        {
          description: "Salmon fillet with mixed vegetables and quinoa",
          calories: 490,
          protein: 32,
          carbs: 38,
          fat: 24,
        },
        {
          description: "Greek yogurt with berries, honey, and granola",
          calories: 310,
          protein: 18,
          carbs: 52,
          fat: 8,
          suggestedAlternatives: ["Use sugar-free honey to reduce calories by 30"],
        },
        {
          description: "Beef burger with fries",
          calories: 850,
          protein: 40,
          carbs: 78,
          fat: 42,
          suggestedAlternatives: ["Opt for a turkey burger to save 150 calories", "Choose a side salad instead of fries to save 300 calories"],
        },
        {
          description: "Caesar salad with grilled chicken",
          calories: 380,
          protein: 28,
          carbs: 15,
          fat: 24,
          suggestedAlternatives: ["Ask for dressing on the side to save 120 calories"],
        },
      ];
      
      // Return a random mock food analysis
      return mockFoods[Math.floor(Math.random() * mockFoods.length)];
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    generateWorkoutPlan,
    analyzeFood,
    loading,
    error,
  };
};
