
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dumbbell, Flame, Clock, BarChart3, Share2, ArrowLeft, Check, Calendar, Trophy } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { useWorkout } from "@/hooks/useWorkout";
import LogWorkoutForm from "@/components/LogWorkoutForm";
import WorkoutCalendar from "@/components/WorkoutCalendar";
import AchievementsDisplay from "@/components/AchievementsDisplay";

const WorkoutDisplay = () => {
  const { id } = useParams<{ id: string }>();
  const [workout, setWorkout] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeExercise, setActiveExercise] = useState<number | null>(null);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState("workout");
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { workouts, logWorkout } = useWorkout();

  useEffect(() => {
    // Simulate an API call to fetch workout data
    setLoading(true);
    setTimeout(() => {
      // First check if we can find the workout in the useWorkout hook
      let found = workouts.find(w => w.id === id);
      
      // If not found in useWorkout, check the mock data
      if (!found) {
        found = mockWorkouts.find(w => w.id === id) || null;
      }
      
      setWorkout(found);
      setLoading(false);
    }, 1000);
  }, [id, workouts]);

  const handleStartWorkout = () => {
    toast.success(`Starting ${workout?.title}`);
    // Set the first exercise as active when starting the workout
    if (workout?.exercises && workout.exercises.length > 0) {
      setActiveExercise(0);
    }
  };

  const handleShare = () => {
    toast.success("Workout shared with friends");
  };

  const handleCompleteExercise = (index: number) => {
    if (!completedExercises.includes(index)) {
      setCompletedExercises([...completedExercises, index]);
      toast.success(`Exercise completed!`);
    }
    
    // Move to next exercise if available
    if (workout?.exercises && index < workout.exercises.length - 1) {
      setActiveExercise(index + 1);
    } else if (workout?.exercises && index === workout.exercises.length - 1) {
      // If this was the last exercise
      setActiveExercise(null);
      
      // Log the completed workout
      if (workout) {
        logWorkout(workout, completedExercises);
        toast.success("Workout completed and logged! Your total weight lifted has been updated.");
      }
    }
  };

  const handleFinishWorkout = () => {
    if (workout) {
      // Log the workout with completed exercises
      logWorkout(workout, completedExercises);
      toast.success("Workout completed and logged! Your total weight lifted has been updated.");
      
      // Reset workout state
      setActiveExercise(null);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="glass-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Dumbbell className="h-16 w-16 text-text-muted opacity-20 mb-4" />
            <h2 className="text-2xl font-bold text-text-light mb-2">Workout Not Found</h2>
            <p className="text-text-muted mb-6">The workout you're looking for doesn't exist or has been removed.</p>
            <Button className="bg-primary text-white" onClick={handleGoBack}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 md:py-8 animate-fade-in">
      <Button 
        variant="ghost" 
        className="mb-4 text-text-light hover:bg-white/5 -ml-2"
        onClick={handleGoBack}
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back
      </Button>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <TabsList className="glass-card">
            <TabsTrigger value="workout" className="data-[state=active]:bg-primary">
              <Dumbbell className="h-4 w-4 mr-2" /> 
              Workout
            </TabsTrigger>
            <TabsTrigger value="log" className="data-[state=active]:bg-primary">
              <Calendar className="h-4 w-4 mr-2" /> 
              Log
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-primary">
              <Trophy className="h-4 w-4 mr-2" /> 
              Achievements
            </TabsTrigger>
          </TabsList>
          
          {activeTab === "workout" && (
            <Button 
              variant="outline" 
              className="border-white/10 text-text-light hover:bg-white/5"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4 mr-2" /> Share
            </Button>
          )}
        </div>
        
        <TabsContent value="workout" className="space-y-6 mt-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-text-light">{workout.title}</h1>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main workout info */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-text-light">Workout Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-text-light mb-6">{workout.description}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="glass-card p-4 flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Flame className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-text-muted text-xs">Calories</p>
                        <p className="text-text-light font-bold">{workout.calories} kcal</p>
                      </div>
                    </div>
                    
                    <div className="glass-card p-4 flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-text-muted text-xs">Duration</p>
                        <p className="text-text-light font-bold">{workout.duration} min</p>
                      </div>
                    </div>
                    
                    <div className="glass-card p-4 flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <BarChart3 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-text-muted text-xs">Intensity</p>
                        <p className="text-text-light font-bold">{workout.intensity}</p>
                      </div>
                    </div>
                  </div>
                  
                  {activeExercise === null ? (
                    <Button 
                      className="w-full bg-primary text-white" 
                      onClick={handleStartWorkout}
                    >
                      Start Workout
                    </Button>
                  ) : (
                    <div className="text-center space-y-2">
                      <p className="text-text-light mb-2">
                        Workout in progress - complete each exercise
                      </p>
                      {completedExercises.length > 0 && (
                        <Button 
                          className="w-full bg-primary/30 hover:bg-primary/40 text-white"
                          onClick={handleFinishWorkout}
                        >
                          Finish Workout Early
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-text-light">Exercise Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {workout.exercises.map((exercise: any, index: number) => (
                      <div 
                        key={index} 
                        className={`glass-card p-4 transition-all duration-300 ${
                          activeExercise === index ? 'ring-2 ring-primary' : 
                          completedExercises.includes(index) ? 'bg-primary/5 border-primary/20' : ''
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            {completedExercises.includes(index) && (
                              <div className="bg-primary/20 p-1 rounded-full mr-2">
                                <Check className="h-4 w-4 text-primary" />
                              </div>
                            )}
                            <h3 className="font-medium text-text-light">{exercise.name}</h3>
                          </div>
                          <span className="text-sm text-primary">{exercise.weight}</span>
                        </div>
                        <div className="flex items-center text-text-muted text-sm mb-3">
                          <span>{exercise.sets} sets</span>
                          <span className="mx-2">•</span>
                          <span>{exercise.reps} reps</span>
                        </div>
                        
                        {activeExercise === index && (
                          <Button 
                            className="w-full mt-2 bg-primary text-white"
                            onClick={() => handleCompleteExercise(index)}
                          >
                            Complete Exercise
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {completedExercises.length === workout.exercises.length && workout.exercises.length > 0 && (
                    <div className="mt-6 p-4 bg-primary/10 rounded-lg text-center">
                      <h3 className="font-bold text-primary mb-2">Workout Complete!</h3>
                      <p className="text-text-light">Great job on finishing your workout.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar */}
            <div className={`space-y-6 ${isMobile ? 'order-first lg:order-last' : ''}`}>
              <Card className="glass-card sticky top-4">
                <CardHeader>
                  <CardTitle className="text-text-light">Quick Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4 text-text-light">
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>Warm up properly before starting</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>Focus on form rather than heavy weights</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>Stay hydrated throughout the workout</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>Rest 1-2 minutes between sets</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>Stretch after completing the workout</span>
                    </li>
                  </ul>
                  
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <h3 className="font-medium text-text-light mb-4">Similar Workouts</h3>
                    <div className="space-y-2">
                      {mockWorkouts
                        .filter(w => w.id !== id)
                        .map((w, i) => (
                          <Button 
                            key={i}
                            variant="outline" 
                            className="w-full justify-start text-left border-white/10 hover:bg-white/5"
                            onClick={() => navigate(`/workout-display/${w.id}`)}
                          >
                            <Dumbbell className="h-4 w-4 mr-2" /> {w.title}
                          </Button>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="log" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 gap-6">
            <LogWorkoutForm />
            <WorkoutCalendar />
          </div>
        </TabsContent>
        
        <TabsContent value="achievements" className="mt-0">
          <AchievementsDisplay />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Mock workout data
const mockWorkouts = [
  {
    id: "1",
    title: "Upper Strength",
    description: "Focus on building upper body strength with compound movements",
    calories: 450,
    duration: 60,
    intensity: "High",
    exercises: [
      { name: "Bench Press", sets: 4, reps: "8-10", weight: "70% 1RM" },
      { name: "Pull-ups", sets: 4, reps: "8-10", weight: "Bodyweight" },
      { name: "Overhead Press", sets: 3, reps: "10-12", weight: "60% 1RM" },
      { name: "Bent-over Row", sets: 3, reps: "10-12", weight: "65% 1RM" },
      { name: "Tricep Dips", sets: 3, reps: "12-15", weight: "Bodyweight" },
      { name: "Bicep Curls", sets: 3, reps: "12-15", weight: "Light" }
    ]
  },
  {
    id: "2",
    title: "Back Workout",
    description: "Comprehensive back workout for strength and definition",
    calories: 400,
    duration: 55,
    intensity: "Medium-High",
    exercises: [
      { name: "Deadlifts", sets: 4, reps: "6-8", weight: "75% 1RM" },
      { name: "Lat Pulldowns", sets: 3, reps: "10-12", weight: "Medium" },
      { name: "Seated Rows", sets: 3, reps: "10-12", weight: "Medium" },
      { name: "Face Pulls", sets: 3, reps: "15-20", weight: "Light" },
      { name: "Hyperextensions", sets: 3, reps: "12-15", weight: "Bodyweight" }
    ]
  },
  {
    id: "3",
    title: "Leg Day",
    description: "Comprehensive leg workout focusing on all major muscle groups",
    calories: 500,
    duration: 60,
    intensity: "High",
    exercises: [
      { name: "Back Squats", sets: 4, reps: "8-10", weight: "70% 1RM" },
      { name: "Romanian Deadlifts", sets: 3, reps: "10-12", weight: "65% 1RM" },
      { name: "Leg Press", sets: 3, reps: "12-15", weight: "Heavy" },
      { name: "Walking Lunges", sets: 3, reps: "10 each leg", weight: "Medium" },
      { name: "Leg Extensions", sets: 3, reps: "15-20", weight: "Light" },
      { name: "Standing Calf Raises", sets: 4, reps: "15-20", weight: "Medium" }
    ]
  },
  {
    id: "4",
    title: "Arm Blaster",
    description: "Focused arm workout for biceps and triceps development",
    calories: 350,
    duration: 45,
    intensity: "Medium",
    exercises: [
      { name: "Barbell Curls", sets: 4, reps: "10-12", weight: "Medium" },
      { name: "Skull Crushers", sets: 4, reps: "10-12", weight: "Medium" },
      { name: "Hammer Curls", sets: 3, reps: "12-15", weight: "Light" },
      { name: "Tricep Pushdowns", sets: 3, reps: "12-15", weight: "Light" },
      { name: "Preacher Curls", sets: 3, reps: "10-12", weight: "Medium" },
      { name: "Overhead Tricep Extension", sets: 3, reps: "12-15", weight: "Light" }
    ]
  },
  {
    id: "5",
    title: "Core Crusher",
    description: "Intensive core workout targeting abs, obliques and lower back",
    calories: 300,
    duration: 30,
    intensity: "Medium-High",
    exercises: [
      { name: "Plank", sets: 3, reps: "60 seconds", weight: "Bodyweight" },
      { name: "Russian Twists", sets: 3, reps: "20 each side", weight: "Light" },
      { name: "Hanging Leg Raises", sets: 3, reps: "12-15", weight: "Bodyweight" },
      { name: "Ab Rollouts", sets: 3, reps: "10-12", weight: "Bodyweight" },
      { name: "Side Planks", sets: 3, reps: "45 seconds each", weight: "Bodyweight" },
      { name: "Superman Holds", sets: 3, reps: "30 seconds", weight: "Bodyweight" }
    ]
  }
];

export default WorkoutDisplay;
