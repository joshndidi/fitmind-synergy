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
      bronze: { target: 1, title: 'First Workout', description: 'Complete your first workout' },
      silver: { target: 10, title: 'Regular Exerciser', description: 'Complete 10 workouts' },
      gold: { target: 50, title: 'Fitness Enthusiast', description: 'Complete 50 workouts' },
      platinum: { target: 100, title: 'Workout Champion', description: 'Complete 100 workouts' }
    }
  },
  streak: {
    tiers: {
      bronze: { target: 3, title: '3-Day Streak', description: 'Complete workouts for 3 days straight' },
      silver: { target: 7, title: 'Weekly Warrior', description: 'Complete workouts for 7 days straight' },
      gold: { target: 30, title: 'Monthly Momentum', description: 'Complete workouts for 30 days straight' },
      platinum: { target: 365, title: 'Year-Long Grind', description: 'Complete workouts for 365 days straight' }
    }
  },
  total_workouts: {
    tiers: {
      bronze: { target: 5, title: 'Getting Started', description: 'Complete 5 workouts' },
      silver: { target: 25, title: 'Building Consistency', description: 'Complete 25 workouts' },
      gold: { target: 100, title: 'Dedicated Trainer', description: 'Complete 100 workouts' },
      platinum: { target: 500, title: 'Fitness Legend', description: 'Complete 500 workouts' }
    }
  },
  total_exercises: {
    tiers: {
      bronze: { target: 10, title: 'Exercise Explorer', description: 'Try 10 different exercises' },
      silver: { target: 50, title: 'Versatile Athlete', description: 'Try 50 different exercises' },
      gold: { target: 200, title: 'Exercise Expert', description: 'Try 200 different exercises' },
      platinum: { target: 500, title: 'Master of Movement', description: 'Try 500 different exercises' }
    }
  },
  total_duration: {
    tiers: {
      bronze: { target: 60 * 60, title: 'One Hour Trained', description: 'Train for a total of 1 hour' },
      silver: { target: 5 * 60 * 60, title: 'Five Hours Trained', description: 'Train for a total of 5 hours' },
      gold: { target: 24 * 60 * 60, title: 'One Day Trained', description: 'Train for a total of 24 hours' },
      platinum: { target: 7 * 24 * 60 * 60, title: 'One Week Trained', description: 'Train for a total of 1 week' }
    }
  },
  total_calories: {
    tiers: {
      bronze: { target: 1000, title: 'First 1,000 Calories', description: 'Burn 1,000 calories through workouts' },
      silver: { target: 10000, title: '10,000 Calories Burned', description: 'Burn 10,000 calories through workouts' },
      gold: { target: 50000, title: '50,000 Calories Burned', description: 'Burn 50,000 calories through workouts' },
      platinum: { target: 100000, title: '100,000 Calories Burned', description: 'Burn 100,000 calories through workouts' }
    }
  },
  workout_type: {
    tiers: {
      bronze: { target: 2, title: 'Variety Starter', description: 'Try 2 different workout types' },
      silver: { target: 3, title: 'Multi-Discipline', description: 'Try 3 different workout types' },
      gold: { target: 4, title: 'Versatile Training', description: 'Try 4 different workout types' },
      platinum: { target: 5, title: 'All-Rounder', description: 'Try 5 different workout types' }
    }
  },
  exercise_type: {
    tiers: {
      bronze: { target: 5, title: 'Exercise Sampler', description: 'Try 5 different exercise types' },
      silver: { target: 10, title: 'Exercise Explorer', description: 'Try 10 different exercise types' },
      gold: { target: 20, title: 'Exercise Enthusiast', description: 'Try 20 different exercise types' },
      platinum: { target: 30, title: 'Exercise Master', description: 'Try 30 different exercise types' }
    }
  },
  social: {
    tiers: {
      bronze: { target: 1, title: 'Social Butterfly', description: 'Share your first workout' },
      silver: { target: 5, title: 'Community Contributor', description: 'Share 5 workouts' },
      gold: { target: 10, title: 'Social Influencer', description: 'Share 10 workouts' },
      platinum: { target: 20, title: 'Fitness Advocate', description: 'Share 20 workouts' }
    }
  },
  meditation: {
    tiers: {
      bronze: { target: 1, title: 'Mindful Beginner', description: 'Meditate for the first time' },
      silver: { target: 7, title: 'Weekly Zen', description: 'Meditate for 7 days' },
      gold: { target: 30, title: 'Monthly Mindfulness', description: 'Meditate for 30 days' },
      platinum: { target: 365, title: 'Year of Peace', description: 'Meditate for 365 days' }
    }
  }
};
