
/**
 * Calculate total weight lifted for a workout
 */
export const calculateTotalWeight = (exercises: { 
  weight: string; 
  reps: string; 
  sets: number 
}[]) => {
  let totalWeight = 0;
  
  exercises.forEach(exercise => {
    const weight = parseFloat(exercise.weight);
    const reps = parseInt(exercise.reps);
    
    if (!isNaN(weight) && !isNaN(reps)) {
      totalWeight += weight * exercise.sets * reps;
    }
  });
  
  return totalWeight;
};

/**
 * Validate workout form data
 */
export const validateWorkoutForm = (
  title: string, 
  exercises: { name: string }[], 
  user: any | null
) => {
  if (!title.trim()) {
    return "Please enter a workout title";
  }
  
  if (exercises.some(ex => !ex.name.trim())) {
    return "Please enter a name for each exercise";
  }

  if (!user) {
    return "You must be logged in to log workouts";
  }
  
  return null; // No error
};
