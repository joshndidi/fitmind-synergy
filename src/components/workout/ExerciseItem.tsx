
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";

type ExerciseProps = {
  exercise: {
    name: string;
    sets: number;
    reps: string;
    weight: string;
  };
  index: number;
  onUpdate: (index: number, field: string, value: any) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
};

const ExerciseItem = ({ exercise, index, onUpdate, onRemove, canRemove }: ExerciseProps) => {
  return (
    <div className="glass-card p-4 space-y-3">
      <div className="flex justify-between">
        <Label className="text-text-light">Exercise {index + 1}</Label>
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemove(index)}
            className="text-destructive hover:text-destructive/90"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <Label htmlFor={`exercise-name-${index}`} className="text-text-muted text-xs mb-1 block">
            Exercise Name
          </Label>
          <Input
            id={`exercise-name-${index}`}
            value={exercise.name}
            onChange={(e) => onUpdate(index, 'name', e.target.value)}
            placeholder="e.g. Bench Press"
          />
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          <div>
            <Label htmlFor={`exercise-sets-${index}`} className="text-text-muted text-xs mb-1 block">
              Sets
            </Label>
            <Input
              id={`exercise-sets-${index}`}
              type="number"
              min="1"
              value={exercise.sets}
              onChange={(e) => onUpdate(index, 'sets', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor={`exercise-reps-${index}`} className="text-text-muted text-xs mb-1 block">
              Reps
            </Label>
            <Input
              id={`exercise-reps-${index}`}
              type="number"
              min="1"
              value={exercise.reps}
              onChange={(e) => onUpdate(index, 'reps', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor={`exercise-weight-${index}`} className="text-text-muted text-xs mb-1 block">
              Weight (kg)
            </Label>
            <Input
              id={`exercise-weight-${index}`}
              type="number"
              min="0"
              step="0.5"
              value={exercise.weight}
              onChange={(e) => onUpdate(index, 'weight', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseItem;
