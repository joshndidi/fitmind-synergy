import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Workout, Exercise } from "../types/workout";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

// Mock workout data for users who aren't logged in or for initial load
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
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [completedWorkouts, setCompletedWorkouts] = useState<Workout[]>([]);
  const [totalWeightLifted, setTotalWeightLifted] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  
  // Load workout data on mount or when user changes
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      if (user) {
        try {
          // Fetch user's workout plans from Supabase
          const { data: workoutPlans, error: workoutError } = await supabase
            .from('workout_plans')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (workoutError) throw workoutError;
          
          // Map the database workouts to our Workout type
          const formattedWorkouts: Workout[] = workoutPlans.map(plan => ({
            id: plan.id,
            title: plan.title,
            description: plan.description || '',
            type: plan.type,
            date: format(new Date(plan.created_at), 'yyyy-MM-dd'),
            calories: plan.calories,
            duration: plan.duration,
            intensity: plan.intensity as "High" | "Medium" | "Low",
            exercises: plan.exercises as Exercise[],
            completionStatus: plan.completion_status || {}
          }));
          
          setWorkouts(formattedWorkouts);
          
          // Fetch user's completed workouts
          const { data: completed, error: completedError } = await supabase
            .from('completed_workouts')
            .select('*')
            .order('completed_at', { ascending: false });
          
          if (completedError) throw completedError;
          
          // Calculate total weight lifted
          let totalWeight = 0;
          const formattedCompleted: Workout[] = completed.map(workout => {
            if (workout.total_weight) {
              totalWeight += workout.total_weight;
            }
            
            return {
              id: workout.id,
              title: workout.title,
              description: 'Completed workout',
              type: 'Completed',
              date: format(new Date(workout.completed_at), 'yyyy-MM-dd'),
              completedDate: format(new Date(workout.completed_at), 'yyyy-MM-dd'),
              calories: workout.calories,
              duration: workout.duration,
              intensity: 'Medium',
              exercises: workout.exercises as Exercise[],
              totalWeight: workout.total_weight
            };
          });
          
          setCompletedWorkouts(formattedCompleted);
          setTotalWeightLifted(totalWeight);
        } catch (error) {
          console.error('Error fetching workout data:', error);
          toast.error('Failed to load your workout data');
          
          // Fall back to mock data if database fetch fails
          setWorkouts(mockWorkouts);
        }
      } else {
        // Use mock data for non-authenticated users
        setWorkouts(mockWorkouts);
        
        // Try to load from localStorage as fallback for non-logged in users
        const storedCompletedWorkouts = localStorage.getItem("completedWorkouts");
        const storedTotalWeight = localStorage.getItem("totalWeightLifted");
        
        if (storedCompletedWorkouts) {
          setCompletedWorkouts(JSON.parse(storedCompletedWorkouts));
        }
        
        if (storedTotalWeight) {
          setTotalWeightLifted(Number(storedTotalWeight));
        }
      }
      
      // Add loading state management
      setTimeout(() => {
        setLoading(false);
      }, 500);
    };
    
    loadData();
  }, [user]);
  
  // Save completed workouts to localStorage for non-logged in users
  useEffect(() => {
    if (!user && completedWorkouts.length > 0) {
      localStorage.setItem("completedWorkouts", JSON.stringify(completedWorkouts));
      localStorage.setItem("totalWeightLifted", totalWeightLifted.toString());
    }
  }, [completedWorkouts, totalWeightLifted, user]);
  
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
  
  const saveWorkoutPlan = async (workout: Workout) => {
    if (!user) {
      // For non-authenticated users, just add to state
      setWorkouts(prev => [...prev, workout]);
      toast.success('Workout plan created!');
      return workout.id;
    }
    
    try {
      // Extract exercises and convert to the right format for the database
      const { id, date, completedDate, ...workoutData } = workout;
      
      // Insert the workout plan into Supabase
      const { data, error } = await supabase
        .from('workout_plans')
        .insert({
          title: workoutData.title,
          description: workoutData.description,
          type: workoutData.type,
          intensity: workoutData.intensity,
          duration: workoutData.duration,
          calories: workoutData.calories,
          exercises: workoutData.exercises,
          is_ai_generated: workout.id.startsWith('ai-'),
          user_id: user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Add the new workout to the state with the database ID
      const newWorkout = {
        ...workout,
        id: data.id
      };
      
      setWorkouts(prev => [newWorkout, ...prev]);
      toast.success('Workout plan saved to your account!');
      return data.id;
    } catch (error) {
      console.error('Error saving workout plan:', error);
      toast.error('Failed to save workout plan');
      return null;
    }
  };
  
  const completeWorkout = async (workout: Workout) => {
    // Calculate weight lifted
    const weightLifted = calculateWorkoutWeight(workout);
    
    if (user) {
      try {
        // Save completed workout to Supabase
        const { error } = await supabase
          .from('completed_workouts')
          .insert({
            user_id: user.id,
            workout_plan_id: workout.id.includes('-') ? null : workout.id, // Only store DB IDs
            title: workout.title,
            exercises: workout.exercises,
            duration: workout.duration,
            calories: workout.calories,
            total_weight: weightLifted
          });
        
        if (error) throw error;
        
        // Update workout completion status if it's a saved workout
        if (!workout.id.includes('-')) {
          const { error: updateError } = await supabase
            .from('workout_plans')
            .update({
              completion_status: { completed: true, completedAt: new Date().toISOString() }
            })
            .eq('id', workout.id);
          
          if (updateError) console.error('Error updating completion status:', updateError);
        }
        
        // Add to state as well
        const completedWorkout = {
          ...workout,
          completedDate: new Date().toISOString(),
          totalWeight: weightLifted
        };
        
        setCompletedWorkouts(prev => [completedWorkout, ...prev]);
        setTotalWeightLifted(prev => prev + weightLifted);
        
        toast.success(`You've lifted ${weightLifted.toLocaleString()} lbs in this workout!`);
        
        // Check for achievements
        checkAchievements(totalWeightLifted + weightLifted);
      } catch (error) {
        console.error('Error completing workout:', error);
        toast.error('Failed to record completed workout');
      }
    } else {
      // For non-authenticated users, use the localStorage approach
      const completedWorkout = {
        ...workout,
        completedDate: new Date().toISOString()
      };
      
      setCompletedWorkouts(prev => [...prev, completedWorkout]);
      setTotalWeightLifted(prev => prev + weightLifted);
      
      toast.success(`You've lifted ${weightLifted.toLocaleString()} lbs in this workout!`);
      
      // Check for achievements
      checkAchievements(totalWeightLifted + weightLifted);
    }
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
  
  // Function to save AI-generated workout plan
  const saveAIWorkoutPlan = async (plan: any) => {
    const newWorkouts: Workout[] = [];
    
    for (let i = 0; i < plan.workouts.length; i++) {
      const workout = plan.workouts[i];
      
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
      today.setDate(today.getDate() + i);
      const formattedDate = format(today, 'yyyy-MM-dd');
      
      // Create the new workout object
      const newWorkout: Workout = {
        id: `ai-${Date.now()}-${i}`,
        title: workout.name,
        description: `${plan.overview} - Day ${workout.day}`,
        calories,
        duration: workout.duration,
        intensity: workout.intensity,
        exercises,
        type: workout.name.split(":")[1]?.trim() || "AI Workout",
        date: formattedDate
      };
      
      // Save to Supabase if user is logged in
      if (user) {
        await saveWorkoutPlan(newWorkout);
      }
      
      newWorkouts.push(newWorkout);
    }
    
    // If user is not logged in, add directly to state
    if (!user) {
      setWorkouts(prev => [...prev, ...newWorkouts]);
    }
    
    toast.success(`Added ${newWorkouts.length} workouts to your plan!`);
    
    return newWorkouts;
  };
  
  // Function to get logged workouts for the calendar
  const getLoggedWorkouts = () => {
    return completedWorkouts.map(workout => ({
      ...workout,
      totalWeight: workout.totalWeight || calculateWorkoutWeight(workout)
    }));
  };
  
  // Function to log a custom workout
  const logCustomWorkout = async (title: string, exercises: Exercise[]) => {
    const workout: Workout = {
      id: `custom-${Date.now()}`,
      title,
      description: "Custom logged workout",
      calories: exercises.length * 50,
      duration: exercises.length * 5,
      intensity: "Medium",
      exercises,
      type: "Custom",
      date: format(new Date(), 'yyyy-MM-dd'),
      completedDate: format(new Date(), 'yyyy-MM-dd')
    };
    
    // Calculate weight lifted
    const weightLifted = calculateWorkoutWeight(workout);
    
    if (user) {
      try {
        // Save directly to completed_workouts in Supabase
        const { error } = await supabase
          .from('completed_workouts')
          .insert({
            user_id: user.id,
            title: workout.title,
            exercises: workout.exercises,
            duration: workout.duration,
            calories: workout.calories,
            total_weight: weightLifted
          });
        
        if (error) throw error;
        
        // Add to state with calculated weight
        const completedWorkout = {
          ...workout,
          totalWeight: weightLifted
        };
        
        setCompletedWorkouts(prev => [completedWorkout, ...prev]);
        setTotalWeightLifted(prev => prev + weightLifted);
        
        toast.success(`Custom workout logged: ${workout.title}!`);
        
        // Check for achievements
        checkAchievements(totalWeightLifted + weightLifted);
      } catch (error) {
        console.error('Error logging custom workout:', error);
        toast.error('Failed to log workout');
      }
    } else {
      // For non-authenticated users, just use local state
      setCompletedWorkouts(prev => [...prev, workout]);
      setTotalWeightLifted(prev => prev + weightLifted);
      toast.success(`Custom workout logged: ${workout.title}!`);
      checkAchievements(totalWeightLifted + weightLifted);
    }
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
  
  // Update progress of a workout
  const updateWorkoutProgress = async (workoutId: string, progress: boolean[]) => {
    if (!user) {
      // For non-authenticated users, store in localStorage
      const progressKey = `workout-progress-${workoutId}`;
      localStorage.setItem(progressKey, JSON.stringify(progress));
      return true;
    }
    
    try {
      const { error } = await supabase
        .from('workout_plans')
        .update({
          completion_status: {
            progress,
            lastUpdated: new Date().toISOString()
          }
        })
        .eq('id', workoutId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating workout progress:', error);
      toast.error('Failed to save progress');
      return false;
    }
  };
  
  // Get progress for a workout
  const getWorkoutProgress = async (workoutId: string): Promise<boolean[] | null> => {
    if (!user) {
      // For non-authenticated users, get from localStorage
      const progressKey = `workout-progress-${workoutId}`;
      const savedProgress = localStorage.getItem(progressKey);
      return savedProgress ? JSON.parse(savedProgress) : null;
    }
    
    try {
      const { data, error } = await supabase
        .from('workout_plans')
        .select('completion_status')
        .eq('id', workoutId)
        .single();
      
      if (error) throw error;
      
      // Handle different types of completion_status
      if (data.completion_status && typeof data.completion_status === 'object') {
        return (data.completion_status as any).progress || null;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching workout progress:', error);
      return null;
    }
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
    loggedWorkouts: getLoggedWorkouts(),
    saveWorkoutPlan,
    updateWorkoutProgress,
    getWorkoutProgress
  };
};

export type { Workout } from "../types/workout";
