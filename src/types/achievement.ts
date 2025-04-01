export type AchievementType = 
  | 'workout_completed'
  | 'streak'
  | 'total_workouts'
  | 'total_exercises'
  | 'total_duration'
  | 'total_calories'
  | 'workout_type'
  | 'exercise_type'
  | 'social'
  | 'meditation';

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
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AchievementProgress {
  type: AchievementType;
  current: number;
  target: number;
  tier: AchievementTier;
  completed: boolean;
}

export interface AchievementDefinition {
  type: AchievementType;
  tiers: {
    [key in AchievementTier]: {
      title: string;
      description: string;
      target: number;
      icon: string;
    };
  };
}

export const ACHIEVEMENT_DEFINITIONS: Record<AchievementType, AchievementDefinition> = {
  workout_completed: {
    type: 'workout_completed',
    tiers: {
      bronze: {
        title: 'First Workout',
        description: 'Complete your first workout',
        target: 1,
        icon: '🏃‍♂️'
      },
      silver: {
        title: 'Regular Exerciser',
        description: 'Complete 10 workouts',
        target: 10,
        icon: '🏃‍♂️'
      },
      gold: {
        title: 'Workout Warrior',
        description: 'Complete 50 workouts',
        target: 50,
        icon: '🏃‍♂️'
      },
      platinum: {
        title: 'Fitness Legend',
        description: 'Complete 100 workouts',
        target: 100,
        icon: '🏃‍♂️'
      }
    }
  },
  streak: {
    type: 'streak',
    tiers: {
      bronze: {
        title: 'Getting Started',
        description: 'Maintain a 3-day workout streak',
        target: 3,
        icon: '🔥'
      },
      silver: {
        title: 'Consistent',
        description: 'Maintain a 7-day workout streak',
        target: 7,
        icon: '🔥'
      },
      gold: {
        title: 'Dedicated',
        description: 'Maintain a 30-day workout streak',
        target: 30,
        icon: '🔥'
      },
      platinum: {
        title: 'Unstoppable',
        description: 'Maintain a 100-day workout streak',
        target: 100,
        icon: '🔥'
      }
    }
  },
  total_workouts: {
    type: 'total_workouts',
    tiers: {
      bronze: {
        title: 'Beginner',
        description: 'Complete 5 total workouts',
        target: 5,
        icon: '📊'
      },
      silver: {
        title: 'Intermediate',
        description: 'Complete 25 total workouts',
        target: 25,
        icon: '📊'
      },
      gold: {
        title: 'Advanced',
        description: 'Complete 100 total workouts',
        target: 100,
        icon: '📊'
      },
      platinum: {
        title: 'Master',
        description: 'Complete 500 total workouts',
        target: 500,
        icon: '📊'
      }
    }
  },
  total_exercises: {
    type: 'total_exercises',
    tiers: {
      bronze: {
        title: 'Exercise Explorer',
        description: 'Complete 10 different exercises',
        target: 10,
        icon: '💪'
      },
      silver: {
        title: 'Exercise Expert',
        description: 'Complete 25 different exercises',
        target: 25,
        icon: '💪'
      },
      gold: {
        title: 'Exercise Master',
        description: 'Complete 50 different exercises',
        target: 50,
        icon: '💪'
      },
      platinum: {
        title: 'Exercise Legend',
        description: 'Complete 100 different exercises',
        target: 100,
        icon: '💪'
      }
    }
  },
  total_duration: {
    type: 'total_duration',
    tiers: {
      bronze: {
        title: 'Time Builder',
        description: 'Accumulate 60 minutes of workout time',
        target: 60,
        icon: '⏱️'
      },
      silver: {
        title: 'Time Master',
        description: 'Accumulate 300 minutes of workout time',
        target: 300,
        icon: '⏱️'
      },
      gold: {
        title: 'Time Champion',
        description: 'Accumulate 1000 minutes of workout time',
        target: 1000,
        icon: '⏱️'
      },
      platinum: {
        title: 'Time Legend',
        description: 'Accumulate 5000 minutes of workout time',
        target: 5000,
        icon: '⏱️'
      }
    }
  },
  total_calories: {
    type: 'total_calories',
    tiers: {
      bronze: {
        title: 'Calorie Burner',
        description: 'Burn 500 calories in workouts',
        target: 500,
        icon: '🔥'
      },
      silver: {
        title: 'Calorie Master',
        description: 'Burn 2500 calories in workouts',
        target: 2500,
        icon: '🔥'
      },
      gold: {
        title: 'Calorie Champion',
        description: 'Burn 10000 calories in workouts',
        target: 10000,
        icon: '🔥'
      },
      platinum: {
        title: 'Calorie Legend',
        description: 'Burn 50000 calories in workouts',
        target: 50000,
        icon: '🔥'
      }
    }
  },
  workout_type: {
    type: 'workout_type',
    tiers: {
      bronze: {
        title: 'Type Explorer',
        description: 'Try 2 different workout types',
        target: 2,
        icon: '🎯'
      },
      silver: {
        title: 'Type Expert',
        description: 'Try 4 different workout types',
        target: 4,
        icon: '🎯'
      },
      gold: {
        title: 'Type Master',
        description: 'Try 6 different workout types',
        target: 6,
        icon: '🎯'
      },
      platinum: {
        title: 'Type Legend',
        description: 'Try all workout types',
        target: 8,
        icon: '🎯'
      }
    }
  },
  exercise_type: {
    type: 'exercise_type',
    tiers: {
      bronze: {
        title: 'Exercise Explorer',
        description: 'Try 3 different exercise types',
        target: 3,
        icon: '💪'
      },
      silver: {
        title: 'Exercise Expert',
        description: 'Try 5 different exercise types',
        target: 5,
        icon: '💪'
      },
      gold: {
        title: 'Exercise Master',
        description: 'Try 8 different exercise types',
        target: 8,
        icon: '💪'
      },
      platinum: {
        title: 'Exercise Legend',
        description: 'Try all exercise types',
        target: 12,
        icon: '💪'
      }
    }
  },
  social: {
    type: 'social',
    tiers: {
      bronze: {
        title: 'Social Butterfly',
        description: 'Share 1 workout',
        target: 1,
        icon: '🦋'
      },
      silver: {
        title: 'Social Expert',
        description: 'Share 5 workouts',
        target: 5,
        icon: '🦋'
      },
      gold: {
        title: 'Social Master',
        description: 'Share 10 workouts',
        target: 10,
        icon: '🦋'
      },
      platinum: {
        title: 'Social Legend',
        description: 'Share 25 workouts',
        target: 25,
        icon: '🦋'
      }
    }
  },
  meditation: {
    type: 'meditation',
    tiers: {
      bronze: {
        title: 'Mindful Beginner',
        description: 'Complete 5 minutes of meditation',
        target: 5,
        icon: '🧘‍♂️'
      },
      silver: {
        title: 'Mindful Explorer',
        description: 'Complete 30 minutes of meditation',
        target: 30,
        icon: '🧘‍♂️'
      },
      gold: {
        title: 'Mindful Master',
        description: 'Complete 120 minutes of meditation',
        target: 120,
        icon: '🧘‍♂️'
      },
      platinum: {
        title: 'Mindful Legend',
        description: 'Complete 300 minutes of meditation',
        target: 300,
        icon: '🧘‍♂️'
      }
    }
  }
}; 