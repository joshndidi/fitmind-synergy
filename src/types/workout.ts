
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
