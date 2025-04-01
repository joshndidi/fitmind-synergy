import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Forward, Check, X, Info, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { WeightTracking } from './WeightTracking';
import { ExerciseGuide } from './ExerciseGuide';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  restTime: number;
  notes?: string;
  completed?: boolean;
  currentSet?: number;
}

interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number;
  exercises: Exercise[];
}

interface WorkoutExecutionProps {
  plan: WorkoutPlan;
  onComplete: (results: {
    planId: string;
    exercises: Record<string, any[]>;
    duration: number;
    completedAt: string;
  }) => void;
  onCancel: () => void;
}

export function WorkoutExecution({ plan, onComplete, onCancel }: WorkoutExecutionProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [exerciseResults, setExerciseResults] = useState<Record<string, any[]>>({});
  const [startTime] = useState(new Date());
  const [showWeightDialog, setShowWeightDialog] = useState(false);
  const [currentExerciseWeights, setCurrentExerciseWeights] = useState<Record<string, number>>({});
  const [showGuideDialog, setShowGuideDialog] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>(plan.exercises);
  const [showNotes, setShowNotes] = useState(false);
  const [showFormGuide, setShowFormGuide] = useState(false);
  const [weight, setWeight] = useState<number | undefined>(undefined);
  const [duration, setDuration] = useState(0);
  const [formTips, setFormTips] = useState<string[]>([]);
  const [exerciseHistory, setExerciseHistory] = useState<Record<string, number[]>>({});

  const currentExercise = exercises[currentExerciseIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      if (isResting) {
        setRestTimeLeft((prev) => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }
      setDuration(Math.floor((new Date().getTime() - startTime.getTime()) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [isResting, startTime]);

  const handleStartRest = () => {
    setIsResting(true);
    setRestTimeLeft(currentExercise.restTime);
  };

  const handleCompleteSet = () => {
    if (weight) {
      updateExerciseHistory(currentExercise.id, weight);
    }
    const currentResults = exerciseResults[currentExercise.id] || [];
    const newResults = [
      ...currentResults,
      {
        set: currentSet,
        reps: currentExercise.reps,
        weight: weight || 0,
        completed: true,
      },
    ];

    setExerciseResults({
      ...exerciseResults,
      [currentExercise.id]: newResults,
    });

    if (currentSet < currentExercise.sets) {
      setCurrentSet(currentSet + 1);
      handleStartRest();
    } else if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentSet(1);
      handleStartRest();
    } else {
      handleCompleteWorkout();
    }
  };

  const handleSkipSet = () => {
    const currentResults = exerciseResults[currentExercise.id] || [];
    const newResults = [
      ...currentResults,
      {
        set: currentSet,
        reps: 0,
        weight: 0,
        completed: false,
      },
    ];

    setExerciseResults({
      ...exerciseResults,
      [currentExercise.id]: newResults,
    });

    if (currentSet < currentExercise.sets) {
      setCurrentSet(currentSet + 1);
      handleStartRest();
    } else if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentSet(1);
      handleStartRest();
    } else {
      handleCompleteWorkout();
    }
  };

  const handleCompleteWorkout = async () => {
    try {
      const endTime = new Date();
      const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

      // Calculate total weight lifted
      const totalWeight = Object.values(exerciseResults).reduce((acc, sets) => {
        return acc + sets.reduce((setAcc, set) => setAcc + (set.weight || 0), 0);
      }, 0);

      // Save completed workout to Supabase
      const { error } = await supabase
        .from('completed_workouts')
        .insert({
          user_id: user?.id,
          title: plan.name,
          description: plan.description,
          type: plan.difficulty,
          duration,
          calories: 0, // TODO: Calculate calories based on exercises
          intensity: plan.difficulty,
          exercises: exerciseResults,
          completed_at: endTime.toISOString(),
          total_weight: totalWeight
        });

      if (error) throw error;

      onComplete({
        planId: plan.id,
        exercises: exerciseResults,
        duration,
        completedAt: endTime.toISOString(),
      });

      toast({
        title: "Workout Completed!",
        description: "Great job! You've completed your workout.",
      });
    } catch (error) {
      console.error('Error saving workout:', error);
      toast({
        title: "Error",
        description: "Failed to save workout results. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const progress = ((currentExerciseIndex * currentExercise.sets + currentSet) /
    (exercises.length * currentExercise.sets)) *
    100;

  const handleWeightUpdate = (exerciseId: string, weight: number) => {
    setCurrentExerciseWeights(prev => ({
      ...prev,
      [exerciseId]: weight
    }));
    setShowWeightDialog(false);
  };

  const getFormTips = (exerciseName: string): string[] => {
    const tips: Record<string, string[]> = {
      "Bench Press": [
        "Keep your back flat against the bench",
        "Grip the bar slightly wider than shoulder width",
        "Lower the bar to your chest with control",
        "Keep your elbows at 45 degrees",
        "Drive your feet into the ground"
      ],
      "Squats": [
        "Keep your chest up and back straight",
        "Knees should track over your toes",
        "Keep your weight in your heels",
        "Breathe out on the way up",
        "Keep your core tight"
      ],
      "Deadlifts": [
        "Keep your back straight",
        "Hinge at your hips",
        "Keep the bar close to your body",
        "Drive through your heels",
        "Keep your shoulders back"
      ]
    };
    return tips[exerciseName] || [];
  };

  const updateExerciseHistory = (exerciseId: string, weight: number) => {
    setExerciseHistory(prev => ({
      ...prev,
      [exerciseId]: [...(prev[exerciseId] || []), weight]
    }));
  };

  const getPersonalBest = (exerciseId: string): number | null => {
    const history = exerciseHistory[exerciseId];
    return history ? Math.max(...history) : null;
  };

  const handleShowFormGuide = () => {
    setFormTips(getFormTips(currentExercise.name));
    setShowFormGuide(true);
  };

  const renderExerciseCard = (exercise: Exercise) => {
    const isCurrentExercise = currentExerciseIndex === exercises.indexOf(exercise);
    const isCompleted = currentExerciseIndex > exercises.indexOf(exercise);
    const currentWeight = currentExerciseWeights[exercise.id] || 0;

    return (
      <div
        key={exercise.id}
        className={`p-4 rounded-lg ${
          isCurrentExercise
            ? "bg-primary text-primary-foreground"
            : isCompleted
            ? "bg-muted"
            : "bg-muted/50"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{exercise.name}</p>
            <p className="text-sm opacity-80">
              {exercise.sets} sets × {exercise.reps} reps
            </p>
          </div>
          <div className="text-right">
            <p className="font-medium">
              {isCurrentExercise
                ? `Set ${currentSet}/${exercise.sets}`
                : isCompleted
                ? "Completed"
                : "Upcoming"}
            </p>
            {currentWeight > 0 && (
              <p className="text-sm opacity-80">
                {currentWeight} kg
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{plan.name}</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setIsPaused(!isPaused)}>
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </Button>
          <Button variant="destructive" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            End Workout
          </Button>
        </div>
      </div>

      <Progress value={progress} className="h-2" />

      <div className="grid gap-6 md:grid-cols-2">
        {renderExerciseCard(currentExercise)}

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Rest Timer</h2>
          <div className="space-y-4">
            {isResting ? (
              <>
                <div className="text-4xl font-bold text-center">
                  {formatTime(restTimeLeft)}
                </div>
                <div className="flex justify-center space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsResting(false)}
                    disabled={isPaused}
                  >
                    Skip Rest
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="text-4xl font-bold text-center">Ready?</div>
                <div className="flex justify-center space-x-4">
                  <Dialog open={showWeightDialog} onOpenChange={setShowWeightDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" disabled={isPaused}>
                        Set Weight
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Set Weight for {currentExercise.name}</DialogTitle>
                      </DialogHeader>
                      <WeightTracking
                        exerciseId={currentExercise.id}
                        exerciseName={currentExercise.name}
                        onWeightUpdate={(weight) => {
                          setWeight(weight);
                          handleWeightUpdate(currentExercise.id, weight);
                          setShowWeightDialog(false);
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                  <Button onClick={handleCompleteSet} disabled={isPaused}>
                    <Check className="w-4 h-4 mr-2" />
                    Complete Set
                  </Button>
                  <Button variant="outline" onClick={handleSkipSet} disabled={isPaused}>
                    <Forward className="w-4 h-4 mr-2" />
                    Skip Set
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="p-4">
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Personal Best</p>
                  <p className="text-xl font-bold">
                    {getPersonalBest(currentExercise.id) || "No record"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="text-xl font-bold">
                    {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, "0")}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShowFormGuide}
                >
                  <Info className="w-4 h-4 mr-2" />
                  Form Guide
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNotes(!showNotes)}
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Notes
                </Button>
              </div>

              {showNotes && currentExercise.notes && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm">{currentExercise.notes}</p>
                </div>
              )}

              {showFormGuide && (
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">Form Tips</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {formTips.map((tip, index) => (
                      <li key={index} className="text-sm">{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Workout Progress</h2>
            <div className="space-y-4">
              {exercises.map((exercise, index) => (
                <div
                  key={exercise.id}
                  className={`p-4 rounded-lg ${
                    index === currentExerciseIndex
                      ? "bg-primary text-primary-foreground"
                      : index < currentExerciseIndex
                      ? "bg-muted"
                      : "bg-muted/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{exercise.name}</p>
                      <p className="text-sm opacity-80">
                        {exercise.sets} sets × {exercise.reps} reps
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {index === currentExerciseIndex
                          ? `Set ${currentSet}/${exercise.sets}`
                          : index < currentExerciseIndex
                          ? "Completed"
                          : "Upcoming"}
                      </p>
                      {exercise.weight && (
                        <p className="text-sm opacity-80">
                          {exercise.weight} kg
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 