
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ExerciseItem from "./ExerciseItem";

type Exercise = {
  name: string;
  sets: number;
  reps: string;
  weight: string;
};

interface ExerciseManagerProps {
  exercises: Exercise[];
  setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>;
}

const ExerciseManager = ({ exercises, setExercises }: ExerciseManagerProps) => {
  const addExercise = () => {
    setExercises([...exercises, { name: "", sets: 1, reps: "10", weight: "0" }]);
  };
  
  const removeExercise = (index: number) => {
    if (exercises.length > 1) {
      setExercises(exercises.filter((_, i) => i !== index));
    }
  };
  
  const updateExercise = (index: number, field: string, value: any) => {
    const updatedExercises = [...exercises];
    updatedExercises[index] = { 
      ...updatedExercises[index], 
      [field]: field === 'name' ? value : field === 'sets' ? Number(value) : String(value)
    };
    setExercises(updatedExercises);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-text-light">Exercises</label>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={addExercise}
          className="border-white/10"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Exercise
        </Button>
      </div>
      
      <div className="space-y-4">
        {exercises.map((exercise, index) => (
          <ExerciseItem
            key={index}
            exercise={exercise}
            index={index}
            onUpdate={updateExercise}
            onRemove={removeExercise}
            canRemove={exercises.length > 1}
          />
        ))}
      </div>
    </div>
  );
};

export default ExerciseManager;
