import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Clock, Dumbbell, Edit2, Trash2, Play } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { WorkoutPlanForm } from "@/components/WorkoutPlanForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  rest: number;
  notes?: string;
}

interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number;
  exercises: Exercise[];
  createdAt: string;
  updatedAt: string;
}

export function WorkoutPlans() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([
    {
      id: "1",
      name: "Full Body Strength",
      description: "A comprehensive full body workout for building strength",
      difficulty: "intermediate",
      duration: 60,
      exercises: [
        {
          id: "1",
          name: "Bench Press",
          sets: 4,
          reps: 8,
          rest: 90,
          notes: "Focus on controlled movement",
        },
        {
          id: "2",
          name: "Squats",
          sets: 4,
          reps: 10,
          rest: 90,
          notes: "Keep back straight",
        },
      ],
      createdAt: "2024-03-20T10:00:00Z",
      updatedAt: "2024-03-20T10:00:00Z",
    },
  ]);
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<WorkoutPlan | null>(null);

  const filteredPlans = workoutPlans.filter((plan) => {
    const matchesSearch = plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === "all" || plan.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  const handleCreatePlan = (data: Omit<WorkoutPlan, "id" | "createdAt" | "updatedAt">) => {
    const newPlan: WorkoutPlan = {
      ...data,
      id: `plan-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setWorkoutPlans([...workoutPlans, newPlan]);
    toast({
      title: "Success",
      description: "Workout plan created successfully",
    });
  };

  const handleUpdatePlan = (data: Omit<WorkoutPlan, "id" | "createdAt" | "updatedAt">) => {
    if (!selectedPlan) return;

    const updatedPlan: WorkoutPlan = {
      ...selectedPlan,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    setWorkoutPlans(workoutPlans.map((plan) =>
      plan.id === selectedPlan.id ? updatedPlan : plan
    ));

    toast({
      title: "Success",
      description: "Workout plan updated successfully",
    });
  };

  const handleDeletePlan = () => {
    if (!planToDelete) return;

    setWorkoutPlans(workoutPlans.filter((plan) => plan.id !== planToDelete.id));
    setPlanToDelete(null);
    toast({
      title: "Success",
      description: "Workout plan deleted successfully",
    });
  };

  const handleStartWorkout = (planId: string) => {
    navigate(`/workouts/${planId}/execute`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500";
      case "intermediate":
        return "bg-yellow-500";
      case "advanced":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Workout Plans</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Create Workout Plan</DialogTitle>
            </DialogHeader>
            <WorkoutPlanForm
              onSubmit={handleCreatePlan}
              onCancel={() => {}}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search plans..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Difficulties</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPlans.map((plan) => (
          <Card key={plan.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
              </div>
              <Badge className={getDifficultyColor(plan.difficulty)}>
                {plan.difficulty}
              </Badge>
            </div>

            <div className="flex items-center text-sm text-muted-foreground mb-4">
              <Clock className="w-4 h-4 mr-1" />
              {plan.duration} minutes
            </div>

            <div className="flex items-center text-sm text-muted-foreground mb-4">
              <Dumbbell className="w-4 h-4 mr-1" />
              {plan.exercises.length} exercises
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedPlan(plan);
                  setIsEditing(true);
                }}
              >
                <Edit2 className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPlanToDelete(plan)}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
              <Button
                size="sm"
                onClick={() => handleStartWorkout(plan.id)}
              >
                <Play className="w-4 h-4 mr-1" />
                Start
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Workout Plan</DialogTitle>
          </DialogHeader>
          {selectedPlan && (
            <WorkoutPlanForm
              initialData={selectedPlan}
              onSubmit={handleUpdatePlan}
              onCancel={() => setIsEditing(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!planToDelete} onOpenChange={() => setPlanToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workout Plan</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this workout plan? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePlan}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 