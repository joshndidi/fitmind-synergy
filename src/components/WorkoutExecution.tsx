import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWorkout } from '@/hooks/useWorkout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2, Play, Pause, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

export function WorkoutExecution() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getWorkoutById, completeWorkout } = useWorkout();
  const [loading, setLoading] = useState(true);
  const [workout, setWorkout] = useState<any>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [completedSets, setCompletedSets] = useState<Record<number, number>>({});
  const [totalWeight, setTotalWeight] = useState(0);

  useEffect(() => {
    const loadWorkout = async () => {
      if (!id) return;
      
      try {
        const workoutData = await getWorkoutById(id);
        
        if (!workoutData) {
          toast.error('Workout not found');
          navigate('/workouts');
          return;
        }
        
        setWorkout(workoutData);
        
        // Initialize completed sets
        const initialCompletedSets: Record<number, number> = {};
        workoutData.exercises.forEach((_: any, index: number) => {
          initialCompletedSets[index] = 0;
        });
        setCompletedSets(initialCompletedSets);
        
      } catch (error) {
        console.error('Error loading workout:', error);
        toast.error('Failed to load workout');
      } finally {
        setLoading(false);
      }
    };
    
    loadWorkout();
  }, [id, navigate, getWorkoutById]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (!isPaused && !isResting) {
      intervalId = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    } else if (!isPaused && isResting) {
      intervalId = setInterval(() => {
        setRestTimer(prevTimer => {
          if (prevTimer <= 1) {
            setIsResting(false);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPaused, isResting]);

  const startWorkout = () => {
    setIsPaused(false);
  };

  const pauseWorkout = () => {
    setIsPaused(true);
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(prevIndex => prevIndex + 1);
    }
  };

  const handlePreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prevIndex => prevIndex - 1);
    }
  };

  const handleCompleteSet = () => {
    const currentExercise = workout.exercises[currentExerciseIndex];
    const updatedCompletedSets = { ...completedSets };
    
    if (updatedCompletedSets[currentExerciseIndex] < currentExercise.sets) {
      updatedCompletedSets[currentExerciseIndex]++;
      setCompletedSets(updatedCompletedSets);
      
      // Add weight to total
      const exerciseWeight = currentExercise.weight || 0;
      const reps = currentExercise.reps || 0;
      setTotalWeight(prevTotal => prevTotal + (exerciseWeight * reps));
      
      // If all sets for this exercise are completed
      if (updatedCompletedSets[currentExerciseIndex] >= currentExercise.sets) {
        // Check if there's another exercise
        if (currentExerciseIndex < workout.exercises.length - 1) {
          // Start rest period before moving to next exercise
          const restTimeInSeconds = currentExercise.restTime || 60;
          setRestTimer(restTimeInSeconds);
          setIsResting(true);
        }
      } else {
        // Rest between sets
        const restTimeInSeconds = currentExercise.restTime || 60;
        setRestTimer(restTimeInSeconds);
        setIsResting(true);
      }
    }
  };

  const handleCompleteWorkout = async () => {
    try {
      // Check if all sets are completed
      let allCompleted = true;
      for (let i = 0; i < workout.exercises.length; i++) {
        if (completedSets[i] < workout.exercises[i].sets) {
          allCompleted = false;
          break;
        }
      }
      
      if (!allCompleted) {
        const confirm = window.confirm('You have not completed all sets. Do you still want to finish the workout?');
        if (!confirm) return;
      }
      
      // Format workout for completion
      const completedWorkout = {
        id: workout.id,
        title: workout.title,
        description: workout.description || '',
        type: workout.type,
        duration: Math.floor(timer / 60),
        calories: workout.calories || Math.floor(timer / 60 * 5), // Estimate calories
        intensity: workout.intensity,
        exercises: workout.exercises.map((ex: any, i: number) => ({
          name: ex.name,
          sets: completedSets[i],
          reps: ex.reps.toString(),
          weight: (ex.weight || 0).toString(),
          rest: ex.restTime ? `${ex.restTime}s` : '60s'
        })),
        date: new Date().toISOString().split('T')[0], // Add the required date field
        totalWeight: totalWeight
      };
      
      await completeWorkout(completedWorkout);
      
      toast.success('Workout completed successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing workout:', error);
      toast.error('Failed to complete workout');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p>Loading workout...</p>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="text-center py-12">
        <p>Workout not found</p>
        <Button onClick={() => navigate('/workouts')} className="mt-4">
          Return to Workouts
        </Button>
      </div>
    );
  }

  const currentExercise = workout.exercises[currentExerciseIndex];
  const progress = Object.values(completedSets).reduce((a: any, b: any) => a + b, 0) / 
                  workout.exercises.reduce((a: any, ex: any) => a + ex.sets, 0) * 100;

  return (
    <div className="container mx-auto py-6 px-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{workout.title}</span>
            <span className="text-lg font-normal">{formatTime(timer)}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm">Overall Progress</span>
              <span className="text-sm">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          {isPaused ? (
            <Button onClick={startWorkout} className="w-full" size="lg">
              <Play className="mr-2 h-4 w-4" /> Start Workout
            </Button>
          ) : (
            <Button onClick={pauseWorkout} variant="outline" className="w-full" size="lg">
              <Pause className="mr-2 h-4 w-4" /> Pause
            </Button>
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handlePreviousExercise}
                    disabled={currentExerciseIndex === 0}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <span>Exercise {currentExerciseIndex + 1} of {workout.exercises.length}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleNextExercise}
                    disabled={currentExerciseIndex === workout.exercises.length - 1}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
                
                {isResting && (
                  <span className="text-amber-500">
                    Rest: {formatTime(restTimer)}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{currentExercise?.name || 'No exercise'}</h3>
                <p className="text-lg mb-4">
                  {currentExercise?.sets || 0} sets × {currentExercise?.reps || 0} reps
                  {currentExercise?.weight ? ` × ${currentExercise.weight} kg` : ''}
                </p>
                
                {currentExercise?.notes && (
                  <p className="text-muted-foreground italic mb-4">{currentExercise.notes}</p>
                )}
                
                <div className="flex justify-center space-x-2 mb-4">
                  {Array.from({ length: currentExercise?.sets || 0 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        (completedSets[currentExerciseIndex] || 0) > i 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
                
                <Button 
                  onClick={handleCompleteSet}
                  disabled={isPaused || isResting || (completedSets[currentExerciseIndex] || 0) >= (currentExercise?.sets || 0)}
                  size="lg"
                >
                  <Check className="mr-2 h-5 w-5" />
                  Complete Set {(completedSets[currentExerciseIndex] || 0) + 1}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Workout Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium">{workout.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Intensity</p>
                  <p className="font-medium">{workout.intensity}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Weight</p>
                  <p className="font-medium">{totalWeight} kg</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">{formatTime(timer)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estimated Calories</p>
                  <p className="font-medium">{Math.floor(timer / 60 * 5)} kcal</p>
                </div>
                
                <Button 
                  onClick={handleCompleteWorkout} 
                  className="w-full"
                  variant="default"
                >
                  Finish Workout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
