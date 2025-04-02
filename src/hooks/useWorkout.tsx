
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  Workout, 
  Exercise, 
  WorkoutType, 
  WorkoutIntensity, 
  WorkoutPlan, 
  WorkoutExercise 
} from "../types/workout";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";

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
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
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
          setWorkoutPlans(JSON.parse(storedWorkouts));
        } else {
          // Use mock data if no stored data exists
          setWorkoutPlans(mockWorkouts.map(w => ({
            id: w.id,
            userId: 'user123',
            title: w.title,
            description: w.description,
            type: w.type,
            duration: w.duration,
            calories: w.calories,
            intensity: w.intensity as WorkoutIntensity,
            createdAt: new Date().toISOString(),
            isAiGenerated: false,
            isTemplate: false,
            exercises: w.exercises.map((ex, i) => ({
              id: `ex-${i}`,
              name: ex.name,
              sets: ex.sets,
              reps: parseInt(ex.reps) || 10,
              weight: parseInt(ex.weight) || 0,
              duration: ex.duration,
              restTime: 60,
              notes: '',
              orderIndex: i,
              createdAt: new Date().toISOString()
            }))
          })));
          localStorage.setItem("workouts", JSON.stringify(mockWorkouts));
        }
        
        if (storedCompletedWorkouts) {
          setCompletedWorkouts(JSON.parse(storedCompletedWorkouts));
        }
        
        if (storedTotalWeight) {
          setTotalWeightLifted(Number(storedTotalWeight));
        }

        await fetchWorkoutPlans();
        await fetchCompletedWorkouts();
      } catch (error) {
        console.error('Error loading workouts:', error);
        // Set empty arrays as fallback
        setWorkoutPlans([]);
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
    if (workoutPlans.length > 0) {
      localStorage.setItem("workouts", JSON.stringify(workoutPlans));
    }
    
    if (completedWorkouts.length > 0) {
      localStorage.setItem("completedWorkouts", JSON.stringify(completedWorkouts));
    }
    
    localStorage.setItem("totalWeightLifted", totalWeightLifted.toString());
  }, [workoutPlans, completedWorkouts, totalWeightLifted]);

  const fetchWorkoutPlans = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: workoutPlansData, error: workoutPlansError } = await supabase
        .from('workout_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (workoutPlansError) throw workoutPlansError;

      // Fetch exercises for each workout plan
      const workoutPlansWithExercises = await Promise.all(workoutPlansData.map(async (plan) => {
        const { data: exercisesData, error: exercisesError } = await supabase
          .from('workout_exercises')
          .select('*')
          .eq('workout_plan_id', plan.id)
          .order('order_index', { ascending: true });

        if (exercisesError) throw exercisesError;

        const exercises: WorkoutExercise[] = exercisesData.map(exercise => ({
          id: exercise.id,
          name: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
          weight: exercise.weight,
          duration: exercise.duration,
          restTime: exercise.rest_time,
          notes: exercise.notes,
          orderIndex: exercise.order_index || 0,
          createdAt: exercise.created_at
        }));

        return {
          id: plan.id,
          userId: plan.user_id,
          title: plan.title,
          description: plan.description || '',
          type: plan.type as WorkoutType,
          duration: plan.duration,
          calories: plan.calories || 0,
          intensity: plan.intensity as WorkoutIntensity,
          createdAt: plan.created_at,
          updatedAt: plan.updated_at,
          isAiGenerated: plan.is_ai_generated,
          isTemplate: plan.is_template || false,
          exercises
        };
      }));

      setWorkoutPlans(workoutPlansWithExercises);
    } catch (error) {
      console.error('Error fetching workout plans:', error);
    }
  };

  const fetchCompletedWorkouts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('completed_workouts')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (error) throw error;

      const mappedWorkouts: Workout[] = data.map(row => ({
        id: row.id,
        title: row.title,
        description: row.description || '',
        type: row.type as WorkoutType,
        duration: row.duration,
        calories: row.calories || 0,
        intensity: row.intensity as WorkoutIntensity,
        exercises: Array.isArray(row.exercises) ? row.exercises.map((ex: any) => ({
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps.toString(),
          weight: ex.weight?.toString() || '0',
          rest: ex.rest?.toString() || '60',
          duration: ex.duration,
          calories: ex.calories || 0
        })) : [],
        date: row.completed_at.split('T')[0],
        completedAt: row.completed_at,
        totalWeight: row.total_weight || 0
      }));

      setCompletedWorkouts(mappedWorkouts);

      // Calculate total weight lifted
      const total = data?.reduce((sum, workout) => {
        return sum + (workout.total_weight || 0);
      }, 0) || 0;
      setTotalWeightLifted(total);
    } catch (error) {
      console.error('Error fetching completed workouts:', error);
    }
  };
  
  const getWorkoutById = async (id: string): Promise<WorkoutPlan | undefined> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return undefined;

      const { data: plan, error: planError } = await supabase
        .from('workout_plans')
        .select('*')
        .eq('id', id)
        .single();

      if (planError) throw planError;

      const { data: exercisesData, error: exercisesError } = await supabase
        .from('workout_exercises')
        .select('*')
        .eq('workout_plan_id', id)
        .order('order_index', { ascending: true });

      if (exercisesError) throw exercisesError;

      const exercises: WorkoutExercise[] = exercisesData.map(exercise => ({
        id: exercise.id,
        name: exercise.name,
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weight,
        duration: exercise.duration,
        restTime: exercise.rest_time,
        notes: exercise.notes,
        orderIndex: exercise.order_index || 0,
        createdAt: exercise.created_at
      }));

      return {
        id: plan.id,
        userId: plan.user_id,
        title: plan.title,
        description: plan.description || '',
        type: plan.type as WorkoutType,
        duration: plan.duration,
        calories: plan.calories || 0,
        intensity: plan.intensity as WorkoutIntensity,
        createdAt: plan.created_at,
        updatedAt: plan.updated_at,
        isAiGenerated: plan.is_ai_generated,
        isTemplate: plan.is_template || false,
        exercises
      };
    } catch (error) {
      console.error('Error fetching workout by id:', error);
      return undefined;
    }
  };

  const createWorkoutPlan = async (plan: Omit<WorkoutPlan, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('workout_plans')
        .insert([{
          user_id: user.id,
          title: plan.title,
          description: plan.description,
          type: plan.type,
          duration: plan.duration,
          calories: plan.calories,
          intensity: plan.intensity,
          is_ai_generated: plan.isAiGenerated || false,
          is_template: plan.isTemplate || false
        }])
        .select()
        .single();

      if (error) throw error;

      const newPlan: WorkoutPlan = {
        id: data.id,
        userId: data.user_id,
        title: data.title,
        description: data.description || '',
        type: data.type as WorkoutType,
        duration: data.duration,
        calories: data.calories || 0,
        intensity: data.intensity as WorkoutIntensity,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        isAiGenerated: data.is_ai_generated,
        isTemplate: data.is_template || false,
        exercises: []
      };

      if (plan.exercises && plan.exercises.length > 0) {
        await addExercisesToWorkoutPlan(data.id, plan.exercises);
        const { data: exercises } = await supabase
          .from('workout_exercises')
          .select('*')
          .eq('workout_plan_id', data.id);
        
        newPlan.exercises = exercises?.map(ex => ({
          id: ex.id,
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight,
          duration: ex.duration,
          restTime: ex.rest_time,
          notes: ex.notes,
          orderIndex: ex.order_index || 0,
          createdAt: ex.created_at
        })) || [];
      }

      setWorkoutPlans(prev => [newPlan, ...prev]);
      return data;
    } catch (error) {
      console.error('Error creating workout plan:', error);
      throw error;
    }
  };

  const updateWorkoutPlan = async (id: string, plan: Partial<WorkoutPlan>) => {
    try {
      const { data, error } = await supabase
        .from('workout_plans')
        .update({
          title: plan.title,
          description: plan.description,
          type: plan.type,
          duration: plan.duration,
          calories: plan.calories,
          intensity: plan.intensity,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedPlan: WorkoutPlan = {
        id: data.id,
        userId: data.user_id,
        title: data.title,
        description: data.description || '',
        type: data.type as WorkoutType,
        duration: data.duration,
        calories: data.calories || 0,
        intensity: data.intensity as WorkoutIntensity,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        isAiGenerated: data.is_ai_generated,
        isTemplate: data.is_template || false,
        exercises: []
      };

      if (plan.exercises) {
        // First, remove existing exercises
        await supabase
          .from('workout_exercises')
          .delete()
          .eq('workout_plan_id', id);
        
        // Then add new ones
        await addExercisesToWorkoutPlan(id, plan.exercises);
        
        // Fetch updated exercises
        const { data: exercises } = await supabase
          .from('workout_exercises')
          .select('*')
          .eq('workout_plan_id', id);
        
        updatedPlan.exercises = exercises?.map(ex => ({
          id: ex.id,
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight,
          duration: ex.duration,
          restTime: ex.rest_time,
          notes: ex.notes,
          orderIndex: ex.order_index || 0,
          createdAt: ex.created_at
        })) || [];
      }

      setWorkoutPlans(prev => prev.map(w => w.id === id ? updatedPlan : w));
      return data;
    } catch (error) {
      console.error('Error updating workout plan:', error);
      throw error;
    }
  };

  const deleteWorkoutPlan = async (id: string) => {
    try {
      const { error } = await supabase
        .from('workout_plans')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setWorkoutPlans(prev => prev.filter(w => w.id !== id));
    } catch (error) {
      console.error('Error deleting workout plan:', error);
      throw error;
    }
  };

  const completeWorkout = async (workout: Workout) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('completed_workouts')
        .insert([{
          user_id: user.id,
          title: workout.title,
          description: workout.description,
          type: workout.type,
          duration: workout.duration,
          calories: workout.calories,
          intensity: workout.intensity,
          exercises: workout.exercises,
          completed_at: new Date().toISOString(),
          total_weight: workout.totalWeight
        }])
        .select()
        .single();

      if (error) throw error;

      const completedWorkout: Workout = {
        id: data.id,
        title: data.title,
        description: data.description,
        type: data.type as WorkoutType,
        duration: data.duration,
        calories: data.calories,
        intensity: data.intensity as WorkoutIntensity,
        exercises: Array.isArray(data.exercises) ? data.exercises : [],
        date: data.completed_at.split('T')[0],
        completedAt: data.completed_at,
        totalWeight: data.total_weight || 0
      };

      setCompletedWorkouts(prev => [completedWorkout, ...prev]);

      // Update total weight lifted
      setTotalWeightLifted(prev => prev + (workout.totalWeight || 0));
    } catch (error) {
      console.error('Error completing workout:', error);
      throw error;
    }
  };

  const saveAIWorkoutPlan = async (plan: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('workout_plans')
        .insert([{
          user_id: user.id,
          title: plan.title,
          description: plan.description,
          type: plan.type,
          duration: plan.duration,
          calories: plan.calories,
          intensity: plan.intensity,
          is_ai_generated: true,
          is_template: false
        }])
        .select()
        .single();

      if (error) throw error;
      
      const newPlan: WorkoutPlan = {
        id: data.id,
        userId: data.user_id,
        title: data.title,
        description: data.description || '',
        type: data.type as WorkoutType,
        duration: data.duration,
        calories: data.calories || 0,
        intensity: data.intensity as WorkoutIntensity,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        isAiGenerated: data.is_ai_generated,
        isTemplate: data.is_template || false,
        exercises: []
      };
      
      setWorkoutPlans(prev => [newPlan, ...prev]);
      return data;
    } catch (error) {
      console.error('Error saving AI workout plan:', error);
      throw error;
    }
  };

  const logCustomWorkout = async (title: string, exercises: Exercise[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const workout: Workout = {
        id: `custom-${Date.now()}`,
        title,
        description: 'Custom workout',
        exercises,
        completedAt: new Date().toISOString(),
        totalWeight: exercises.reduce((sum, ex) => sum + (parseFloat(ex.weight) || 0), 0),
        duration: exercises.reduce((sum, ex) => sum + (ex.duration || 0), 0),
        calories: exercises.reduce((sum, ex) => sum + (ex.calories || 0), 0),
        intensity: 'Medium',
        type: 'custom',
        date: new Date().toISOString().split('T')[0]
      };

      const { data, error } = await supabase
        .from('completed_workouts')
        .insert([{
          user_id: user.id,
          title: workout.title,
          description: workout.description,
          type: workout.type,
          duration: workout.duration,
          calories: workout.calories,
          intensity: workout.intensity,
          exercises: workout.exercises,
          completed_at: new Date().toISOString(),
          total_weight: workout.totalWeight
        }])
        .select()
        .single();

      if (error) throw error;
      
      const completedWorkout: Workout = {
        id: data.id,
        title: data.title,
        description: data.description,
        type: data.type as WorkoutType,
        duration: data.duration,
        calories: data.calories,
        intensity: data.intensity as WorkoutIntensity,
        exercises: Array.isArray(data.exercises) ? data.exercises : [],
        date: data.completed_at.split('T')[0],
        completedAt: data.completed_at,
        totalWeight: data.total_weight || 0
      };
      
      setCompletedWorkouts(prev => [completedWorkout, ...prev]);
      setTotalWeightLifted(prev => prev + (workout.totalWeight || 0));
      return data;
    } catch (error) {
      console.error('Error logging custom workout:', error);
      throw error;
    }
  };

  const getAchievements = () => {
    const achievements = [
      {
        id: 'first-workout',
        title: 'First Workout',
        description: 'Complete your first workout',
        icon: '🏋️',
        progress: completedWorkouts.length > 0 ? 1 : 0,
        target: 1,
        completed: completedWorkouts.length > 0,
        user_id: 'user123',
        type: 'workout_completed' as const,
        tier: 'bronze' as const
      },
      {
        id: 'weight-milestone',
        title: 'Weight Milestone',
        description: 'Lift 1000kg in total',
        icon: '💪',
        progress: Math.min(1, totalWeightLifted / 1000),
        target: 1000,
        completed: totalWeightLifted >= 1000,
        user_id: 'user123',
        type: 'total_weight' as const,
        tier: 'bronze' as const
      },
      {
        id: 'streak',
        title: 'Workout Streak',
        description: 'Complete workouts for 7 days straight',
        icon: '🔥',
        progress: 0,
        target: 7,
        completed: false,
        user_id: 'user123',
        type: 'streak' as const,
        tier: 'bronze' as const
      }
    ];

    return achievements;
  };

  const addExercisesToWorkoutPlan = async (workoutPlanId: string, exercises: Omit<WorkoutExercise, 'id' | 'createdAt'>[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('workout_exercises')
        .insert(exercises.map(exercise => ({
          workout_plan_id: workoutPlanId,
          name: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
          weight: exercise.weight,
          duration: exercise.duration,
          rest_time: exercise.restTime,
          notes: exercise.notes,
          order_index: exercise.orderIndex
        })))
        .select();

      if (error) throw error;

      // Update the workout plan in state
      setWorkoutPlans(prev => prev.map(plan => {
        if (plan.id === workoutPlanId) {
          const updatedExercises = data.map(row => ({
            id: row.id,
            name: row.name,
            sets: row.sets,
            reps: row.reps,
            weight: row.weight,
            duration: row.duration,
            restTime: row.rest_time,
            notes: row.notes,
            orderIndex: row.order_index || 0,
            createdAt: row.created_at
          }));

          return {
            ...plan,
            exercises: [...plan.exercises, ...updatedExercises]
          };
        }
        return plan;
      }));

      return data;
    } catch (error) {
      console.error('Error adding exercises to workout plan:', error);
      throw error;
    }
  };

  return {
    workoutPlans,
    completedWorkouts,
    totalWeightLifted,
    loading,
    getWorkoutById,
    createWorkoutPlan,
    updateWorkoutPlan,
    deleteWorkoutPlan,
    completeWorkout,
    saveAIWorkoutPlan,
    logCustomWorkout,
    getAchievements,
    addExercisesToWorkoutPlan,
    loggedWorkouts: completedWorkouts
  };
};

export { Workout, WorkoutPlan, WorkoutExercise };
