import { useEffect, useState } from 'react';
import { WorkoutStats } from '@/components/WorkoutStats';

interface WorkoutHistory {
  date: string;
  duration: number;
  exercises: number;
  totalWeight: number;
  caloriesBurned: number;
}

interface ExerciseStats {
  name: string;
  maxWeight: number;
  totalSets: number;
  totalReps: number;
  lastPerformed: string;
}

export function WorkoutStatsPage() {
  const [history, setHistory] = useState<WorkoutHistory[]>([]);
  const [exerciseStats, setExerciseStats] = useState<ExerciseStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockHistory: WorkoutHistory[] = [
      {
        date: '2024-03-15',
        duration: 75,
        exercises: 6,
        totalWeight: 2500,
        caloriesBurned: 450,
      },
      {
        date: '2024-03-13',
        duration: 60,
        exercises: 5,
        totalWeight: 2200,
        caloriesBurned: 380,
      },
      {
        date: '2024-03-10',
        duration: 90,
        exercises: 8,
        totalWeight: 2800,
        caloriesBurned: 520,
      },
    ];

    const mockExerciseStats: ExerciseStats[] = [
      {
        name: 'Bench Press',
        maxWeight: 100,
        totalSets: 24,
        totalReps: 192,
        lastPerformed: '2024-03-15',
      },
      {
        name: 'Squats',
        maxWeight: 120,
        totalSets: 20,
        totalReps: 160,
        lastPerformed: '2024-03-13',
      },
      {
        name: 'Deadlifts',
        maxWeight: 140,
        totalSets: 18,
        totalReps: 144,
        lastPerformed: '2024-03-10',
      },
    ];

    // Simulate API call
    setTimeout(() => {
      setHistory(mockHistory);
      setExerciseStats(mockExerciseStats);
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Workout Statistics</h1>
      <WorkoutStats history={history} exerciseStats={exerciseStats} />
    </div>
  );
} 