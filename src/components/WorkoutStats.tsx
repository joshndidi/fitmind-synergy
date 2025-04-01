import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, TrendingUp, Award, Clock } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

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

interface WorkoutStatsProps {
  history: WorkoutHistory[];
  exerciseStats: ExerciseStats[];
}

export function WorkoutStats({ history, exerciseStats }: WorkoutStatsProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const calculateProgress = () => {
    const currentWeek = history.slice(-7);
    const previousWeek = history.slice(-14, -7);

    const currentTotal = currentWeek.reduce((sum, workout) => sum + workout.totalWeight, 0);
    const previousTotal = previousWeek.reduce((sum, workout) => sum + workout.totalWeight, 0);

    return ((currentTotal - previousTotal) / previousTotal) * 100;
  };

  return (
    <Card className="p-4">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="exercises">Exercises</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold">Total Workouts</h3>
              </div>
              <p className="text-2xl font-bold mt-2">{history.length}</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold">Weekly Progress</h3>
              </div>
              <p className="text-2xl font-bold mt-2">
                {calculateProgress().toFixed(1)}%
              </p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold">Total Weight Lifted</h3>
              </div>
              <p className="text-2xl font-bold mt-2">
                {history.reduce((sum, workout) => sum + workout.totalWeight, 0)} kg
              </p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold">Avg. Duration</h3>
              </div>
              <p className="text-2xl font-bold mt-2">
                {formatDuration(
                  Math.round(
                    history.reduce((sum, workout) => sum + workout.duration, 0) / history.length
                  )
                )}
              </p>
            </Card>
          </div>
          <div className="h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="totalWeight" stroke="#8884d8" />
                <Line type="monotone" dataKey="caloriesBurned" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <div className="space-y-4">
            {history.map((workout, index) => (
              <Card key={index} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{formatDate(workout.date)}</h3>
                    <p className="text-sm text-muted-foreground">
                      {workout.exercises} exercises • {formatDuration(workout.duration)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{workout.totalWeight} kg</p>
                    <p className="text-sm text-muted-foreground">
                      {workout.caloriesBurned} calories
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="exercises">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={exerciseStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="maxWeight" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-4">
            {exerciseStats.map((exercise, index) => (
              <Card key={index} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{exercise.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {exercise.totalSets} sets • {exercise.totalReps} reps
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{exercise.maxWeight} kg</p>
                    <p className="text-sm text-muted-foreground">
                      Last: {formatDate(exercise.lastPerformed)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
} 