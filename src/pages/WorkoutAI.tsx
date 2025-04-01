import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkout } from '@/hooks/useWorkout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { WorkoutType, WorkoutIntensity, WorkoutPlan } from '@/types/workout';
import { Brain, Dumbbell, Timer } from 'lucide-react';

export default function WorkoutAI() {
  const navigate = useNavigate();
  const { saveAIWorkoutPlan } = useWorkout();
  const [isGenerating, setIsGenerating] = useState(false);
  const [preferences, setPreferences] = useState({
    type: 'strength' as WorkoutType,
    intensity: 'intermediate' as WorkoutIntensity,
    duration: 45,
    focus: '',
    equipment: 'any'
  });

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      
      // This is where you would integrate with an AI service
      // For now, we'll create a sample workout plan
      const workoutPlan: WorkoutPlan = {
        id: `ai-${Date.now()}`,
        userId: 'user-id', // This would come from auth
        title: `AI ${preferences.type.charAt(0).toUpperCase() + preferences.type.slice(1)} Workout`,
        description: `A ${preferences.intensity} ${preferences.type} workout focusing on ${preferences.focus || 'full body'}.`,
        type: preferences.type,
        duration: preferences.duration,
        intensity: preferences.intensity,
        isAiGenerated: true,
        isTemplate: false,
        exercises: [
          {
            id: `ex-${Date.now()}-1`,
            name: 'Push-ups',
            sets: 3,
            reps: 12,
            weight: 0,
            orderIndex: 0,
            restTime: 60,
            createdAt: new Date().toISOString()
          },
          {
            id: `ex-${Date.now()}-2`,
            name: 'Squats',
            sets: 4,
            reps: 15,
            weight: 0,
            orderIndex: 1,
            restTime: 90,
            createdAt: new Date().toISOString()
          },
          {
            id: `ex-${Date.now()}-3`,
            name: 'Plank',
            sets: 3,
            reps: 1,
            duration: 60,
            orderIndex: 2,
            restTime: 60,
            createdAt: new Date().toISOString()
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await saveAIWorkoutPlan(workoutPlan);
      toast.success('Workout plan generated successfully!');
      navigate(`/workouts/${workoutPlan.id}`);
    } catch (error) {
      toast.error('Failed to generate workout plan');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto py-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold flex items-center gap-2">
          <Brain className="h-8 w-8" />
          AI Workout Generator
        </h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Workout Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Workout Type</Label>
              <Select
                value={preferences.type}
                onValueChange={(value: WorkoutType) =>
                  setPreferences(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="strength">Strength Training</SelectItem>
                  <SelectItem value="cardio">Cardio</SelectItem>
                  <SelectItem value="hiit">HIIT</SelectItem>
                  <SelectItem value="flexibility">Flexibility</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Intensity Level</Label>
              <Select
                value={preferences.intensity}
                onValueChange={(value: WorkoutIntensity) =>
                  setPreferences(prev => ({ ...prev, intensity: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Duration (minutes)</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[preferences.duration]}
                  onValueChange={([value]) =>
                    setPreferences(prev => ({ ...prev, duration: value }))
                  }
                  min={15}
                  max={90}
                  step={5}
                  className="flex-1"
                />
                <span className="w-12 text-right">{preferences.duration}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Focus Area (optional)</Label>
              <Input
                placeholder="e.g., upper body, core, legs"
                value={preferences.focus}
                onChange={(e) =>
                  setPreferences(prev => ({ ...prev, focus: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Available Equipment</Label>
              <Select
                value={preferences.equipment}
                onValueChange={(value) =>
                  setPreferences(prev => ({ ...prev, equipment: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Equipment</SelectItem>
                  <SelectItem value="minimal">Minimal Equipment</SelectItem>
                  <SelectItem value="bodyweight">Bodyweight Only</SelectItem>
                  <SelectItem value="gym">Full Gym</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-2 p-4 rounded-lg bg-primary/10">
                <Dumbbell className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Type</p>
                  <p className="text-lg">{preferences.type}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-4 rounded-lg bg-primary/10">
                <Timer className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Duration</p>
                  <p className="text-lg">{preferences.duration} minutes</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-4 rounded-lg bg-primary/10">
                <Brain className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Intensity</p>
                  <p className="text-lg">{preferences.intensity}</p>
                </div>
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate Workout Plan'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
