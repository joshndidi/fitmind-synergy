
export type Exercise = {
  name: string;
  sets: number;
  reps: string;
  weight: string;
  rest?: string;
};

export type Workout = {
  id: string;
  title: string;
  description: string;
  calories: number;
  duration: number;
  intensity: string;
  exercises: Exercise[];
  type: string;
  date: string;
};

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
