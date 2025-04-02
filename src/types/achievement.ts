
export type AchievementType = 
  'workout_completed' | 
  'streak' | 
  'total_workouts' | 
  'total_exercises' | 
  'total_duration' | 
  'total_calories' | 
  'workout_type' | 
  'exercise_type' | 
  'social' | 
  'meditation';

export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface Achievement {
  id: string;
  user_id: string;
  type: AchievementType;
  tier: AchievementTier;
  title: string;
  description: string;
  icon: string;
  progress: number;
  target: number;
  completed: boolean;
  completed_at?: string;
  name?: string; // Added for compatibility
  threshold?: number; // Added for compatibility
  achieved?: boolean; // Added for compatibility
}

export interface AchievementProgress {
  type: AchievementType;
  current: number;
  target: number;
  tier: AchievementTier;
  completed: boolean;
}

export const ACHIEVEMENT_DEFINITIONS = {
  workout_completed: {
    tiers: {
      bronze: { target: 1, title: 'First Workout', description: 'Complete your first workout', icon: '🏋️‍♂️' },
      silver: { target: 10, title: 'Regular Exerciser', description: 'Complete 10 workouts', icon: '💪' },
      gold: { target: 50, title: 'Fitness Enthusiast', description: 'Complete 50 workouts', icon: '🔥' },
      platinum: { target: 100, title: 'Workout Champion', description: 'Complete 100 workouts', icon: '🏆' }
    }
  },
  streak: {
    tiers: {
      bronze: { target: 3, title: '3-Day Streak', description: 'Complete workouts for 3 days straight', icon: '📅' },
      silver: { target: 7, title: 'Weekly Warrior', description: 'Complete workouts for 7 days straight', icon: '🔄' },
      gold: { target: 30, title: 'Monthly Momentum', description: 'Complete workouts for 30 days straight', icon: '📊' },
      platinum: { target: 365, title: 'Year-Long Grind', description: 'Complete workouts for 365 days straight', icon: '🗓️' }
    }
  },
  total_workouts: {
    tiers: {
      bronze: { target: 5, title: 'Getting Started', description: 'Complete 5 workouts', icon: '🏁' },
      silver: { target: 25, title: 'Building Consistency', description: 'Complete 25 workouts', icon: '📈' },
      gold: { target: 100, title: 'Dedicated Trainer', description: 'Complete 100 workouts', icon: '⚡' },
      platinum: { target: 500, title: 'Fitness Legend', description: 'Complete 500 workouts', icon: '👑' }
    }
  },
  total_exercises: {
    tiers: {
      bronze: { target: 10, title: 'Exercise Explorer', description: 'Try 10 different exercises', icon: '🔍' },
      silver: { target: 50, title: 'Versatile Athlete', description: 'Try 50 different exercises', icon: '🔄' },
      gold: { target: 200, title: 'Exercise Expert', description: 'Try 200 different exercises', icon: '🧠' },
      platinum: { target: 500, title: 'Master of Movement', description: 'Try 500 different exercises', icon: '🎯' }
    }
  },
  total_duration: {
    tiers: {
      bronze: { target: 60 * 60, title: 'One Hour Trained', description: 'Train for a total of 1 hour', icon: '⏱️' },
      silver: { target: 5 * 60 * 60, title: 'Five Hours Trained', description: 'Train for a total of 5 hours', icon: '⏳' },
      gold: { target: 24 * 60 * 60, title: 'One Day Trained', description: 'Train for a total of 24 hours', icon: '🕰️' },
      platinum: { target: 7 * 24 * 60 * 60, title: 'One Week Trained', description: 'Train for a total of 1 week', icon: '⌛' }
    }
  },
  total_calories: {
    tiers: {
      bronze: { target: 1000, title: 'First 1,000 Calories', description: 'Burn 1,000 calories through workouts', icon: '🔥' },
      silver: { target: 10000, title: '10,000 Calories Burned', description: 'Burn 10,000 calories through workouts', icon: '💪' },
      gold: { target: 50000, title: '50,000 Calories Burned', description: 'Burn 50,000 calories through workouts', icon: '⚡' },
      platinum: { target: 100000, title: '100,000 Calories Burned', description: 'Burn 100,000 calories through workouts', icon: '🚀' }
    }
  },
  workout_type: {
    tiers: {
      bronze: { target: 2, title: 'Variety Starter', description: 'Try 2 different workout types', icon: '🔄' },
      silver: { target: 3, title: 'Multi-Discipline', description: 'Try 3 different workout types', icon: '🔄' },
      gold: { target: 4, title: 'Versatile Training', description: 'Try 4 different workout types', icon: '🔄' },
      platinum: { target: 5, title: 'All-Rounder', description: 'Try 5 different workout types', icon: '🔄' }
    }
  },
  exercise_type: {
    tiers: {
      bronze: { target: 5, title: 'Exercise Sampler', description: 'Try 5 different exercise types', icon: '🔄' },
      silver: { target: 10, title: 'Exercise Explorer', description: 'Try 10 different exercise types', icon: '🔄' },
      gold: { target: 20, title: 'Exercise Enthusiast', description: 'Try 20 different exercise types', icon: '🔄' },
      platinum: { target: 30, title: 'Exercise Master', description: 'Try 30 different exercise types', icon: '🔄' }
    }
  },
  social: {
    tiers: {
      bronze: { target: 1, title: 'Social Butterfly', description: 'Share your first workout', icon: '📱' },
      silver: { target: 5, title: 'Community Contributor', description: 'Share 5 workouts', icon: '👥' },
      gold: { target: 10, title: 'Social Influencer', description: 'Share 10 workouts', icon: '🌟' },
      platinum: { target: 20, title: 'Fitness Advocate', description: 'Share 20 workouts', icon: '🏆' }
    }
  },
  meditation: {
    tiers: {
      bronze: { target: 1, title: 'Mindful Beginner', description: 'Meditate for the first time', icon: '🧘‍♂️' },
      silver: { target: 7, title: 'Weekly Zen', description: 'Meditate for 7 days', icon: '🧘‍♀️' },
      gold: { target: 30, title: 'Monthly Mindfulness', description: 'Meditate for 30 days', icon: '✨' },
      platinum: { target: 365, title: 'Year of Peace', description: 'Meditate for 365 days', icon: '☮️' }
    }
  }
};
