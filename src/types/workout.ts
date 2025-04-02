export type WorkoutType = 'strength' | 'cardio' | 'flexibility' | 'hiit' | 'custom';
export type WorkoutIntensity = 'Low' | 'Medium' | 'High';

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  weight: string;
  duration?: number;
  calories?: number;
  rest?: string;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  restTime?: number;
  notes?: string;
  orderIndex: number;
  createdAt: string;
}

export interface Workout {
  id: string;
  title: string;
  description?: string;
  type: WorkoutType;
  duration: number;
  calories?: number;
  intensity: WorkoutIntensity;
  exercises: Exercise[];
  date: string;
  completedAt?: string;
  totalWeight?: number;
}

export interface WorkoutPlan {
  id: string;
  userId: string;
  title: string;
  description?: string;
  type: WorkoutType;
  duration: number;
  calories?: number;
  intensity: WorkoutIntensity;
  createdAt: string;
  updatedAt?: string;
  isAiGenerated: boolean;
  isTemplate: boolean;
  exercises: WorkoutExercise[];
}

export type Food = {
  id: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string;
  imageUrl?: string;
  suggestedAlternatives?: string[];
};

export interface WorkoutLogExercise {
  id: string;
  exerciseName: string;
  setsCompleted: number;
  repsCompleted: number;
  weightUsed?: number;
  durationCompleted?: number;
  notes?: string;
  createdAt: string;
}

export interface WorkoutLog {
  id: string;
  userId: string;
  workoutPlanId?: string;
  date: string;
  duration: number;
  caloriesBurned?: number;
  notes?: string;
  createdAt: string;
  exercises: WorkoutLogExercise[];
}

export interface CreateWorkoutPlanInput {
  title: string;
  description?: string;
  type: WorkoutType;
  duration: number;
  calories?: number;
  intensity: WorkoutIntensity;
  isAiGenerated?: boolean;
  isTemplate?: boolean;
  exercises: Omit<WorkoutExercise, 'id' | 'createdAt'>[];
}

export interface CreateWorkoutLogInput {
  workoutPlanId?: string;
  date: string;
  duration: number;
  caloriesBurned?: number;
  notes?: string;
  exercises: Omit<WorkoutLogExercise, 'id' | 'createdAt'>[];
}

export interface UpdateWorkoutPlanInput {
  title?: string;
  description?: string;
  type?: WorkoutType;
  duration?: number;
  calories?: number;
  intensity?: WorkoutIntensity;
  exercises?: Omit<WorkoutExercise, 'id' | 'createdAt'>[];
}

export interface UpdateWorkoutLogInput {
  date?: string;
  duration?: number;
  caloriesBurned?: number;
  notes?: string;
  exercises?: Omit<WorkoutLogExercise, 'id' | 'createdAt'>[];
}
