import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Achievement, AchievementType, AchievementTier, AchievementProgress } from '@/types/achievement';
import { ACHIEVEMENT_DEFINITIONS } from '@/types/achievement';

export default function useAchievement() {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(true);

  // Fetch user's achievements
  const { data: achievements, isLoading: isLoadingAchievements } = useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Achievement[];
    }
  });

  // Fetch achievement progress
  const { data: progress, isLoading: isLoadingProgress } = useQuery({
    queryKey: ['achievement_progress'],
    queryFn: async () => {
      const { data: workoutLogs } = await supabase
        .from('workout_logs')
        .select('*');

      const { data: exercises } = await supabase
        .from('workout_exercises')
        .select('*');

      const { data: workoutTypes } = await supabase
        .from('workout_plans')
        .select('type')
        .order('type');

      const { data: exerciseTypes } = await supabase
        .from('workout_exercises')
        .select('type')
        .order('type');

      const uniqueWorkoutTypes = [...new Set(workoutTypes?.map(wt => wt.type) || [])];
      const uniqueExerciseTypes = [...new Set(exerciseTypes?.map(et => et.type) || [])];

      const progress: Record<AchievementType, AchievementProgress> = {
        workout_completed: {
          type: 'workout_completed',
          current: workoutLogs?.length || 0,
          target: ACHIEVEMENT_DEFINITIONS.workout_completed.tiers.platinum.target,
          tier: 'bronze',
          completed: false
        },
        streak: {
          type: 'streak',
          current: calculateStreak(workoutLogs || []),
          target: ACHIEVEMENT_DEFINITIONS.streak.tiers.platinum.target,
          tier: 'bronze',
          completed: false
        },
        total_workouts: {
          type: 'total_workouts',
          current: workoutLogs?.length || 0,
          target: ACHIEVEMENT_DEFINITIONS.total_workouts.tiers.platinum.target,
          tier: 'bronze',
          completed: false
        },
        total_exercises: {
          type: 'total_exercises',
          current: exercises?.length || 0,
          target: ACHIEVEMENT_DEFINITIONS.total_exercises.tiers.platinum.target,
          tier: 'bronze',
          completed: false
        },
        total_duration: {
          type: 'total_duration',
          current: calculateTotalDuration(workoutLogs || []),
          target: ACHIEVEMENT_DEFINITIONS.total_duration.tiers.platinum.target,
          tier: 'bronze',
          completed: false
        },
        total_calories: {
          type: 'total_calories',
          current: calculateTotalCalories(workoutLogs || []),
          target: ACHIEVEMENT_DEFINITIONS.total_calories.tiers.platinum.target,
          tier: 'bronze',
          completed: false
        },
        workout_type: {
          type: 'workout_type',
          current: uniqueWorkoutTypes.length,
          target: ACHIEVEMENT_DEFINITIONS.workout_type.tiers.platinum.target,
          tier: 'bronze',
          completed: false
        },
        exercise_type: {
          type: 'exercise_type',
          current: uniqueExerciseTypes.length,
          target: ACHIEVEMENT_DEFINITIONS.exercise_type.tiers.platinum.target,
          tier: 'bronze',
          completed: false
        },
        social: {
          type: 'social',
          current: 0, // TODO: Implement social sharing tracking
          target: ACHIEVEMENT_DEFINITIONS.social.tiers.platinum.target,
          tier: 'bronze',
          completed: false
        },
        meditation: {
          type: 'meditation',
          current: 0, // TODO: Implement meditation tracking
          target: ACHIEVEMENT_DEFINITIONS.meditation.tiers.platinum.target,
          tier: 'bronze',
          completed: false
        }
      };

      // Update tiers based on progress
      Object.keys(progress).forEach((type) => {
        const achievementType = type as AchievementType;
        const current = progress[achievementType].current;
        const definition = ACHIEVEMENT_DEFINITIONS[achievementType];

        if (current >= definition.tiers.platinum.target) {
          progress[achievementType].tier = 'platinum';
          progress[achievementType].completed = true;
        } else if (current >= definition.tiers.gold.target) {
          progress[achievementType].tier = 'gold';
        } else if (current >= definition.tiers.silver.target) {
          progress[achievementType].tier = 'silver';
        }
      });

      return progress;
    }
  });

  // Create achievement
  const createAchievement = useMutation({
    mutationFn: async (achievement: Omit<Achievement, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('achievements')
        .insert([achievement])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      queryClient.invalidateQueries({ queryKey: ['achievement_progress'] });
    }
  });

  // Update achievement
  const updateAchievement = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Achievement> & { id: string }) => {
      const { data, error } = await supabase
        .from('achievements')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      queryClient.invalidateQueries({ queryKey: ['achievement_progress'] });
    }
  });

  // Delete achievement
  const deleteAchievement = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('achievements')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      queryClient.invalidateQueries({ queryKey: ['achievement_progress'] });
    }
  });

  // Check and update achievements
  const checkAchievements = async () => {
    if (!progress) return;

    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) return;

    Object.entries(progress).forEach(([type, data]) => {
      const achievementType = type as AchievementType;
      const definition = ACHIEVEMENT_DEFINITIONS[achievementType];
      const currentTier = data.tier as AchievementTier;

      // Check if user has already achieved this tier
      const existingAchievement = achievements?.find(
        a => a.type === achievementType && a.tier === currentTier
      );

      if (!existingAchievement && data.completed) {
        const tierData = definition.tiers[currentTier];
        createAchievement.mutate({
          user_id: userId,
          type: achievementType,
          tier: currentTier,
          title: tierData.title,
          description: tierData.description,
          icon: tierData.icon,
          progress: data.current,
          target: tierData.target,
          completed: true,
          completed_at: new Date().toISOString()
        });
      }
    });
  };

  useEffect(() => {
    if (!isLoadingAchievements && !isLoadingProgress) {
      checkAchievements();
      setLoading(false);
    }
  }, [achievements, progress, isLoadingAchievements, isLoadingProgress]);

  return {
    achievements,
    progress,
    loading,
    createAchievement,
    updateAchievement,
    deleteAchievement,
    checkAchievements
  };
}

// Helper functions
function calculateStreak(workoutLogs: any[]): number {
  if (!workoutLogs.length) return 0;

  const sortedLogs = [...workoutLogs].sort((a, b) => 
    new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
  );

  let streak = 1;
  let currentDate = new Date(sortedLogs[0].completed_at);
  currentDate.setHours(0, 0, 0, 0);

  for (let i = 1; i < sortedLogs.length; i++) {
    const logDate = new Date(sortedLogs[i].completed_at);
    logDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((currentDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      streak++;
      currentDate = logDate;
    } else {
      break;
    }
  }

  return streak;
}

function calculateTotalDuration(workoutLogs: any[]): number {
  return workoutLogs.reduce((total, log) => total + (log.duration || 0), 0);
}

function calculateTotalCalories(workoutLogs: any[]): number {
  return workoutLogs.reduce((total, log) => total + (log.calories_burned || 0), 0);
} 