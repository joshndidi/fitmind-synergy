import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Workout, WorkoutPlan, WorkoutExercise } from '@/types/workout';
import { Database } from '@/types/supabase';

type WorkoutPlanRow = Database['public']['Tables']['workout_plans']['Row'];
type CompletedWorkoutRow = Database['public']['Tables']['completed_workouts']['Row'];

export const useWorkout = () => {
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [completedWorkouts, setCompletedWorkouts] = useState<Workout[]>([]);
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
          type: plan.type,
          duration: plan.duration,
          calories: plan.calories || 0,
          intensity: plan.intensity,
          createdAt: plan.created_at,
          updatedAt: plan.updated_at,
          isAiGenerated: plan.is_ai_generated,
          isTemplate: plan.is_template,
          exercises: exercises.map(exercise => ({
            id: exercise.id,
            name: exercise.name,
            sets: exercise.sets,
            reps: exercise.reps,
            weight: exercise.weight,
            duration: exercise.duration,
            restTime: exercise.rest_time,
            notes: exercise.notes,
            orderIndex: exercise.order_index,
            createdAt: exercise.created_at
          }))
        };
      }));

      setWorkoutPlans(workoutPlansWithExercises);
    } catch (error) {
      console.error('Error fetching workout plans:', error);
    } finally {
      setLoading(false);
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
      setCompletedWorkouts(data.map(row => ({
        id: row.id,
        title: row.title,
        description: row.description,
        type: row.type,
        duration: row.duration,
        calories: row.calories,
        intensity: row.intensity as 'High' | 'Medium' | 'Low',
        exercises: row.exercises.map((ex: any) => ({
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps.toString(),
          weight: ex.weight?.toString() || '0',
          rest: ex.rest?.toString() || '60',
          duration: ex.duration,
          calories: ex.calories || 0
        })),
        date: row.completed_at.split('T')[0],
        completedAt: row.completed_at,
        totalWeight: row.total_weight || 0
      })));

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
        type: plan.type,
        duration: plan.duration,
        calories: plan.calories || 0,
        intensity: plan.intensity,
        createdAt: plan.created_at,
        updatedAt: plan.updated_at,
        isAiGenerated: plan.is_ai_generated,
        isTemplate: plan.is_template,
        exercises: exercises.map(exercise => ({
          id: exercise.id,
          name: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
          weight: exercise.weight,
          duration: exercise.duration,
          restTime: exercise.rest_time,
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
          is_ai_generated: plan.isAiGenerated,
          is_template: plan.isTemplate
        }])
        .select()
        .single();

      if (error) throw error;
      setWorkoutPlans(prev => [{
        id: data.id,
        userId: data.user_id,
        title: data.title,
        description: data.description || '',
        type: data.type,
        duration: data.duration,
        calories: data.calories || 0,
        intensity: data.intensity,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        isAiGenerated: data.is_ai_generated,
        isTemplate: data.is_template,
        exercises: []
      }, ...prev]);
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
      setWorkoutPlans(prev => prev.map(w => w.id === id ? {
        id: data.id,
        userId: data.user_id,
        title: data.title,
        description: data.description || '',
        type: data.type,
        duration: data.duration,
        calories: data.calories || 0,
        intensity: data.intensity,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        isAiGenerated: data.is_ai_generated,
        isTemplate: data.is_template,
        exercises: []
      } : w));
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
      setCompletedWorkouts(prev => [{
        id: data.id,
        title: data.title,
        description: data.description,
        type: data.type,
        duration: data.duration,
        calories: data.calories,
        intensity: data.intensity as 'High' | 'Medium' | 'Low',
        exercises: data.exercises.map((ex: any) => ({
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps.toString(),
          weight: ex.weight?.toString() || '0',
          rest: ex.rest?.toString() || '60',
          duration: ex.duration,
          calories: ex.calories || 0
        })),
        date: data.completed_at.split('T')[0],
        completedAt: data.completed_at,
        totalWeight: data.total_weight || 0
      }, ...prev]);

      // Update total weight lifted
      setTotalWeightLifted(prev => prev + (workout.totalWeight || 0));
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
      setWorkoutPlans(prev => [{
        id: data.id,
        userId: data.user_id,
        title: data.title,
        description: data.description || '',
        type: data.type,
        duration: data.duration,
        calories: data.calories || 0,
        intensity: data.intensity,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        isAiGenerated: data.is_ai_generated,
        isTemplate: data.is_template,
        exercises: []
      }, ...prev]);
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
      setCompletedWorkouts(prev => [{
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
      }, ...prev]);
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
        completed: completedWorkouts.length > 0
      },
      {
        id: 'weight-milestone',
        title: 'Weight Milestone',
        description: 'Lift 1000kg in total',
        icon: '💪',
        completed: totalWeightLifted >= 1000
      },
      {
        id: 'streak',
        title: 'Workout Streak',
        description: 'Complete workouts for 7 days straight',
        icon: '🔥',
        completed: false // TODO: Implement streak tracking
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
            exercises: data.map(row => ({
              id: row.id,
              name: row.name,
              sets: row.sets,
              reps: row.reps,
              weight: row.weight,
              duration: row.duration,
              restTime: row.rest_time,
              notes: row.notes,
              orderIndex: row.order_index,
              createdAt: row.created_at
            }))
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
    addExercisesToWorkoutPlan
  };
}; 