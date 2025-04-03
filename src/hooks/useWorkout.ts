
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Workout, 
  WorkoutPlan, 
  WorkoutExercise, 
  Exercise,
  WorkoutType,
  WorkoutIntensity 
} from '@/types/workout';
import { Database } from '@/types/supabase';

type WorkoutPlanRow = Database['public']['Tables']['workout_plans']['Row'];
type CompletedWorkoutRow = Database['public']['Tables']['completed_workouts']['Row'];

export const useWorkout = () => {
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [completedWorkouts, setCompletedWorkouts] = useState<Workout[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [totalWeightLifted, setTotalWeightLifted] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkoutPlans();
    fetchCompletedWorkouts();
  }, []);

  const fetchWorkoutPlans = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: workoutPlans, error: workoutPlansError } = await supabase
        .from('workout_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (workoutPlansError) throw workoutPlansError;

      // Fetch exercises for each workout plan
      const workoutPlansWithExercises = await Promise.all(workoutPlans.map(async (plan) => {
        const { data: exercises, error: exercisesError } = await supabase
          .from('workout_exercises')
          .select('*')
          .eq('workout_plan_id', plan.id)
          .order('order_index', { ascending: true });

        if (exercisesError) throw exercisesError;

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
          exercises: exercises.map(exercise => ({
            id: exercise.id,
            name: exercise.name,
            sets: exercise.sets,
            reps: exercise.reps,
            weight: exercise.weight,
            duration: exercise.duration,
            restTime: exercise.rest_time,
            rest: exercise.rest_time ? `${exercise.rest_time}s` : '60s',
            notes: exercise.notes,
            orderIndex: exercise.order_index,
            createdAt: exercise.created_at
          }))
        };
      }));

      setWorkoutPlans(workoutPlansWithExercises);
      
      // Also convert to Workout format for compatibility
      const convertedWorkouts = workoutPlansWithExercises.map(plan => ({
        id: plan.id,
        title: plan.title,
        description: plan.description || '',
        calories: plan.calories || 0,
        duration: plan.duration,
        intensity: mapIntensity(plan.intensity),
        type: plan.type,
        date: new Date().toISOString().split('T')[0],
        exercises: plan.exercises.map(ex => ({
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps.toString(),
          weight: ex.weight?.toString() || '0',
          duration: ex.duration,
          rest: ex.rest
        })),
      }));
      
      setWorkouts(convertedWorkouts);
    } catch (error) {
      console.error('Error fetching workout plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const mapIntensity = (intensity: WorkoutIntensity): "High" | "Medium" | "Low" => {
    switch (intensity) {
      case 'advanced': return 'High';
      case 'intermediate': return 'Medium';
      case 'beginner': return 'Low';
      default: return 'Medium';
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
      
      const convertedWorkouts = data.map(row => ({
        id: row.id,
        title: row.title,
        description: row.description || '',
        type: row.type as WorkoutType,
        duration: row.duration,
        calories: row.calories,
        intensity: row.intensity as "High" | "Medium" | "Low",
        exercises: row.exercises ? (row.exercises as any[]).map((ex: any) => ({
          name: ex.name || ex.exerciseName,
          sets: ex.sets || ex.setsCompleted,
          reps: (ex.reps || ex.repsCompleted).toString(),
          weight: (ex.weight || ex.weightUsed || 0).toString(),
          rest: ex.rest || '60s',
          duration: ex.duration,
          calories: ex.calories || 0
        })) : [],
        date: row.completed_at.split('T')[0],
        completedAt: row.completed_at,
        totalWeight: row.total_weight || 0
      }));
      
      setCompletedWorkouts(convertedWorkouts);

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

      const { data: exercises, error: exercisesError } = await supabase
        .from('workout_exercises')
        .select('*')
        .eq('workout_plan_id', id)
        .order('order_index', { ascending: true });

      if (exercisesError) throw exercisesError;

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
        exercises: exercises.map(exercise => ({
          id: exercise.id,
          name: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
          weight: exercise.weight,
          duration: exercise.duration,
          restTime: exercise.rest_time,
          rest: exercise.rest_time ? `${exercise.rest_time}s` : '60s',
          notes: exercise.notes,
          orderIndex: exercise.order_index,
          createdAt: exercise.created_at
        }))
      };
    } catch (error) {
      console.error('Error fetching workout by id:', error);
      return undefined;
    }
  };

  // Alias for compatibility with older code
  const getWorkoutPlan = getWorkoutById;

  const createWorkoutPlan = async (plan: CreateWorkoutPlanInput) => {
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
          is_ai_generated: plan.isAiGenerated,
          is_template: plan.isTemplate || false
        }])
        .select()
        .single();

      if (error) throw error;
      
      if (plan.exercises && plan.exercises.length > 0) {
        const exerciseData = plan.exercises.map((ex, index) => ({
          workout_plan_id: data.id,
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight,
          duration: ex.duration,
          rest_time: ex.restTime,
          notes: ex.notes,
          order_index: ex.orderIndex || index
        }));
        
        const { error: exerciseError } = await supabase
          .from('workout_exercises')
          .insert(exerciseData);
          
        if (exerciseError) throw exerciseError;
      }
      
      // Add to workoutPlans state
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
        exercises: plan.exercises.map((ex, index) => ({
          id: `temp-${index}`, // Temporary ID until we fetch the real ones
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight,
          duration: ex.duration,
          restTime: ex.restTime,
          rest: ex.restTime ? `${ex.restTime}s` : '60s',
          notes: ex.notes,
          orderIndex: ex.orderIndex || index,
          createdAt: new Date().toISOString()
        }))
      };
      
      setWorkoutPlans(prev => [newPlan, ...prev]);
      
      // Also add to workouts for compatibility
      const newWorkout: Workout = {
        id: data.id,
        title: data.title,
        description: data.description || '',
        calories: data.calories || 0,
        duration: data.duration,
        intensity: mapIntensity(data.intensity as WorkoutIntensity),
        type: data.type as WorkoutType,
        date: new Date().toISOString().split('T')[0],
        exercises: plan.exercises.map(ex => ({
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps.toString(),
          weight: ex.weight?.toString() || '0',
          duration: ex.duration,
          rest: ex.restTime ? `${ex.restTime}s` : '60s'
        }))
      };
      
      setWorkouts(prev => [newWorkout, ...prev]);
      
      return data;
    } catch (error) {
      console.error('Error creating workout plan:', error);
      throw error;
    }
  };

  const updateWorkoutPlan = async (id: string, plan: UpdateWorkoutPlanInput) => {
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
      
      // If exercises are included, update them
      if (plan.exercises && plan.exercises.length > 0) {
        // First delete existing exercises
        const { error: deleteError } = await supabase
          .from('workout_exercises')
          .delete()
          .eq('workout_plan_id', id);
          
        if (deleteError) throw deleteError;
        
        // Then add new ones
        const exerciseData = plan.exercises.map((ex, index) => ({
          workout_plan_id: id,
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight,
          duration: ex.duration,
          rest_time: ex.restTime,
          notes: ex.notes,
          order_index: ex.orderIndex || index
        }));
        
        const { error: exerciseError } = await supabase
          .from('workout_exercises')
          .insert(exerciseData);
          
        if (exerciseError) throw exerciseError;
      }
      
      // Update the state
      setWorkoutPlans(prev => prev.map(w => {
        if (w.id === id) {
          return {
            ...w,
            ...plan,
            updatedAt: new Date().toISOString()
          };
        }
        return w;
      }));
      
      // Also update workouts for compatibility
      setWorkouts(prev => prev.map(w => {
        if (w.id === id) {
          return {
            ...w,
            title: plan.title || w.title,
            description: plan.description || w.description,
            type: plan.type || w.type,
            duration: plan.duration || w.duration,
            calories: plan.calories || w.calories,
            intensity: plan.intensity ? mapIntensity(plan.intensity) : w.intensity,
            exercises: plan.exercises ? plan.exercises.map(ex => ({
              name: ex.name,
              sets: ex.sets,
              reps: ex.reps.toString(),
              weight: ex.weight?.toString() || '0',
              duration: ex.duration,
              rest: ex.restTime ? `${ex.restTime}s` : '60s'
            })) : w.exercises
          };
        }
        return w;
      }));
      
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
      setWorkouts(prev => prev.filter(w => w.id !== id));
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
      
      const newCompletedWorkout: Workout = {
        id: data.id,
        title: data.title,
        description: data.description,
        type: data.type as WorkoutType,
        duration: data.duration,
        calories: data.calories,
        intensity: data.intensity as "High" | "Medium" | "Low",
        exercises: data.exercises.map((ex: any) => ({
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps.toString(),
          weight: ex.weight?.toString() || '0',
          rest: ex.rest?.toString() || '60s',
          duration: ex.duration,
          calories: ex.calories || 0
        })),
        date: data.completed_at.split('T')[0],
        completedAt: data.completed_at,
        totalWeight: data.total_weight || 0
      };
      
      setCompletedWorkouts(prev => [newCompletedWorkout, ...prev]);

      // Update total weight lifted
      setTotalWeightLifted(prev => prev + (workout.totalWeight || 0));
      
      return data;
    } catch (error) {
      console.error('Error completing workout:', error);
      throw error;
    }
  };

  const saveAIWorkoutPlan = async (plan: WorkoutPlan) => {
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
      
      // Add to workoutPlans state
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
        isTemplate: data.is_template,
        exercises: []
      };
      
      setWorkoutPlans(prev => [newPlan, ...prev]);
      
      // Also add to workouts for compatibility
      const newWorkout: Workout = {
        id: data.id,
        title: data.title,
        description: data.description || '',
        calories: data.calories || 0,
        duration: data.duration,
        intensity: mapIntensity(data.intensity as WorkoutIntensity),
        type: data.type as WorkoutType,
        date: new Date().toISOString().split('T')[0],
        exercises: []
      };
      
      setWorkouts(prev => [newWorkout, ...prev]);
      
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
      
      const newCompletedWorkout: Workout = {
        id: data.id,
        title: data.title,
        description: data.description,
        type: data.type,
        duration: data.duration,
        calories: data.calories,
        intensity: data.intensity,
        exercises: data.exercises as Exercise[],
        date: data.completed_at.split('T')[0],
        completedAt: data.completed_at,
        totalWeight: data.total_weight || 0
      };
      
      setCompletedWorkouts(prev => [newCompletedWorkout, ...prev]);
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
        id: 'beginner',
        name: "Beginner Lifter", 
        description: "Lift your first 5,000 kg total",
        threshold: 5000, 
        icon: "🏋️‍♂️", 
        achieved: totalWeightLifted >= 5000,
        progress: Math.min(1, totalWeightLifted / 5000)
      },
      {
        id: 'intermediate',
        name: "Intermediate Lifter", 
        description: "Lift 25,000 kg total",
        threshold: 25000, 
        icon: "💪", 
        achieved: totalWeightLifted >= 25000,
        progress: Math.min(1, totalWeightLifted / 25000)
      },
      {
        id: 'advanced',
        name: "Advanced Lifter", 
        description: "Lift 100,000 kg total",
        threshold: 100000, 
        icon: "🔥", 
        achieved: totalWeightLifted >= 100000,
        progress: Math.min(1, totalWeightLifted / 100000)
      },
      {
        id: 'elite',
        name: "Elite Lifter", 
        description: "Lift 500,000 kg total",
        threshold: 500000, 
        icon: "⭐", 
        achieved: totalWeightLifted >= 500000,
        progress: Math.min(1, totalWeightLifted / 500000)
      },
      {
        id: 'legendary',
        name: "Legendary Lifter", 
        description: "Lift 1,000,000 kg total",
        threshold: 1000000, 
        icon: "🏆", 
        achieved: totalWeightLifted >= 1000000,
        progress: Math.min(1, totalWeightLifted / 1000000)
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
          return {
            ...plan,
            exercises: [
              ...plan.exercises,
              ...data.map(row => ({
                id: row.id,
                name: row.name,
                sets: row.sets,
                reps: row.reps,
                weight: row.weight,
                duration: row.duration,
                restTime: row.rest_time,
                rest: row.rest_time ? `${row.rest_time}s` : '60s',
                notes: row.notes,
                orderIndex: row.order_index,
                createdAt: row.created_at
              }))
            ]
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
  
  // Get logged workouts for calendar
  const getLoggedWorkouts = () => {
    return completedWorkouts.map(workout => ({
      ...workout
    }));
  };

  return {
    workoutPlans,
    completedWorkouts,
    workouts, // For compatibility with old code
    totalWeightLifted,
    loading,
    getWorkoutById,
    getWorkoutPlan, // Alias for compatibility
    createWorkoutPlan,
    updateWorkoutPlan,
    deleteWorkoutPlan,
    completeWorkout,
    saveAIWorkoutPlan,
    logCustomWorkout,
    getAchievements,
    addExercisesToWorkoutPlan,
    loggedWorkouts: getLoggedWorkouts() // For compatibility with WorkoutCalendar
  };
};

export type { Workout, WorkoutPlan, WorkoutExercise } from "@/types/workout";
