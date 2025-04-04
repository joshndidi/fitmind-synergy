
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkout } from '@/hooks/useWorkout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Dumbbell, Clock, Calendar, Plus, ArrowRight } from 'lucide-react';
import LogWorkoutForm from '@/components/LogWorkoutForm';
import { WorkoutPlan, WorkoutType } from '@/types/workout';

export default function WorkoutSelection() {
  const navigate = useNavigate();
  const { workoutPlans, loading } = useWorkout();
  const [showLogDialog, setShowLogDialog] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'all' | 'templates' | 'custom'>('all');
  const [filteredWorkouts, setFilteredWorkouts] = useState<WorkoutPlan[]>([]);
  
  useEffect(() => {
    if (workoutPlans) {
      filterWorkouts(selectedTab);
    }
  }, [workoutPlans, selectedTab]);
  
  const filterWorkouts = (tab: 'all' | 'templates' | 'custom') => {
    switch (tab) {
      case 'templates':
        setFilteredWorkouts(workoutPlans.filter(wp => wp.isTemplate));
        break;
      case 'custom':
        setFilteredWorkouts(workoutPlans.filter(wp => !wp.isTemplate && !wp.isAiGenerated));
        break;
      case 'all':
      default:
        setFilteredWorkouts(workoutPlans);
        break;
    }
  };
  
  const getWorkoutTypeIcon = (type: WorkoutType) => {
    switch (type) {
      case 'strength':
        return <Dumbbell className="h-5 w-5 text-blue-500" />;
      case 'cardio':
        return <Clock className="h-5 w-5 text-red-500" />;
      case 'flexibility':
        return <ArrowRight className="h-5 w-5 text-green-500" />;
      default:
        return <Dumbbell className="h-5 w-5 text-primary" />;
    }
  };
  
  const handleCloseLogDialog = () => {
    setShowLogDialog(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Workouts</h1>
          <p className="text-muted-foreground mt-1">Start a workout or log a completed session</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Dialog open={showLogDialog} onOpenChange={setShowLogDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Log Workout
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-full">
              <DialogHeader>
                <DialogTitle>Log Your Workout</DialogTitle>
              </DialogHeader>
              <LogWorkoutForm onSuccess={handleCloseLogDialog} />
            </DialogContent>
          </Dialog>
          
          <Button onClick={() => navigate('/create-workout')}>
            <Plus className="mr-2 h-4 w-4" />
            Create Plan
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={selectedTab} onValueChange={(v) => setSelectedTab(v as any)}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Workouts</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="custom">My Workouts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkouts.length === 0 ? (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">No workouts found</p>
                <Button onClick={() => navigate('/create-workout')} className="mt-4">
                  Create Your First Workout
                </Button>
              </div>
            ) : (
              filteredWorkouts.map((workout) => (
                <WorkoutCard 
                  key={workout.id} 
                  workout={workout} 
                  onSelect={() => navigate(`/workout/${workout.id}`)} 
                />
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="templates" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkouts.length === 0 ? (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">No template workouts found</p>
              </div>
            ) : (
              filteredWorkouts.map((workout) => (
                <WorkoutCard 
                  key={workout.id} 
                  workout={workout} 
                  onSelect={() => navigate(`/workout/${workout.id}`)} 
                />
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="custom" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkouts.length === 0 ? (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">No custom workouts found</p>
                <Button onClick={() => navigate('/create-workout')} className="mt-4">
                  Create Custom Workout
                </Button>
              </div>
            ) : (
              filteredWorkouts.map((workout) => (
                <WorkoutCard 
                  key={workout.id} 
                  workout={workout} 
                  onSelect={() => navigate(`/workout/${workout.id}`)} 
                />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface WorkoutCardProps {
  workout: WorkoutPlan;
  onSelect: () => void;
}

function WorkoutCard({ workout, onSelect }: WorkoutCardProps) {
  const getWorkoutTypeIcon = (type: WorkoutType) => {
    switch (type) {
      case 'strength':
        return <Dumbbell className="h-5 w-5 text-blue-500" />;
      case 'cardio':
        return <Clock className="h-5 w-5 text-red-500" />;
      case 'flexibility':
        return <ArrowRight className="h-5 w-5 text-green-500" />;
      default:
        return <Dumbbell className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>{workout.title}</CardTitle>
          {getWorkoutTypeIcon(workout.type)}
        </div>
        <CardDescription className="line-clamp-2">
          {workout.description || `A ${workout.intensity} ${workout.type} workout`}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Duration</p>
            <p className="font-medium">{workout.duration} mins</p>
          </div>
          <div>
            <p className="text-muted-foreground">Intensity</p>
            <p className="font-medium capitalize">{workout.intensity}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Exercises</p>
            <p className="font-medium">{workout.exercises.length}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Type</p>
            <p className="font-medium capitalize">{workout.type}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onSelect} className="w-full">
          Start Workout
        </Button>
      </CardFooter>
    </Card>
  );
}
