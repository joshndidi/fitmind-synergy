
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ListChecks, 
  FilePlus, 
  Calendar, 
  X,
  Save
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";
import LogWorkoutForm from "./LogWorkoutForm";

const WorkoutActions = () => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  const handleChoosePlan = () => {
    // Navigate to AI workout page
    navigate("/workout-ai");
  };

  const handleAddPlan = () => {
    // Navigate to custom workout creation page
    navigate("/create-workout");
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
      <div className="flex flex-col md:flex-row gap-3 mt-6 w-full justify-center">
        <Button
          onClick={handleChoosePlan}
          className="flex items-center justify-center gap-2"
        >
          <ListChecks className="h-4 w-4" />
          <span className="whitespace-nowrap">Choose Plan</span>
        </Button>
        <Button
          onClick={handleAddPlan}
          className="flex items-center justify-center gap-2"
        >
          <FilePlus className="h-4 w-4" />
          <span className="whitespace-nowrap">Create Workout</span>
        </Button>
        <Button
          onClick={handleLogWorkout}
          className="flex items-center justify-center gap-2"
        >
          <Calendar className="h-4 w-4" />
          <span className="whitespace-nowrap">Log Workout</span>
        </Button>
      </div>

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
