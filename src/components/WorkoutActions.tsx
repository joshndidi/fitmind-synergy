
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ListChecks, 
  FilePlus, 
  Calendar, 
  X
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";
import WorkoutCalendar from "./WorkoutCalendar";
import LogWorkoutForm from "./LogWorkoutForm";
import { useWorkout } from "@/hooks/useWorkout";

const WorkoutActions = () => {
  const navigate = useNavigate();
  const { workouts } = useWorkout();
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  const handleChoosePlan = () => {
    // Navigate to AI workout page
    navigate("/workout-ai");
  };

  const handleAddPlan = () => {
    // Open the add plan dialog
    setOpenDialog("addPlan");
  };

  const handleLogWorkout = () => {
    // Open the log workout dialog
    setOpenDialog("logWorkout");
  };

  const closeDialog = () => {
    setOpenDialog(null);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-3 mt-6">
        <Button
          onClick={handleChoosePlan}
          className="flex-1 bg-primary text-white"
        >
          <ListChecks className="mr-2 h-4 w-4" />
          Choose Plan
        </Button>
        <Button
          onClick={handleAddPlan}
          className="flex-1 bg-primary text-white"
        >
          <FilePlus className="mr-2 h-4 w-4" />
          Add Plan
        </Button>
        <Button
          onClick={handleLogWorkout}
          className="flex-1 bg-primary text-white"
        >
          <Calendar className="mr-2 h-4 w-4" />
          Log Workout
        </Button>
      </div>

      {/* Choose Plan Dialog - we'll just navigate to the workout-ai page */}

      {/* Add Plan Dialog */}
      <Dialog open={openDialog === "addPlan"} onOpenChange={closeDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-text-light flex items-center justify-between">
              Create Your Own Workout Plan
              <DialogClose className="text-text-muted hover:text-text-light">
                <X size={18} />
              </DialogClose>
            </DialogTitle>
            <DialogDescription className="text-text-muted">
              Create a custom workout plan to track your progress.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-center text-text-muted my-8">
              Feature coming soon! In the meantime, you can:
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button 
                className="flex-1"
                onClick={() => {
                  closeDialog();
                  navigate("/workout-ai");
                }}
              >
                Create AI Workout
              </Button>
              <Button 
                className="flex-1" 
                variant="outline"
                onClick={closeDialog}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Log Workout Dialog */}
      <Dialog open={openDialog === "logWorkout"} onOpenChange={closeDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-text-light flex items-center justify-between">
              Log Your Workout
              <DialogClose className="text-text-muted hover:text-text-light">
                <X size={18} />
              </DialogClose>
            </DialogTitle>
            <DialogDescription className="text-text-muted">
              Keep track of your progress by logging your workouts.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <LogWorkoutForm onSuccess={closeDialog} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WorkoutActions;
