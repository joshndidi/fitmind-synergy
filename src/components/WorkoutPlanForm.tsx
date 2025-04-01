import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  rest: number;
  notes?: string;
}

interface WorkoutPlanFormProps {
  initialData?: {
    name: string;
    description: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    duration: number;
    exercises: Exercise[];
  };
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function WorkoutPlanForm({ initialData, onSubmit, onCancel }: WorkoutPlanFormProps) {
  const { toast } = useToast();
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">(
    initialData?.difficulty || "beginner"
  );
  const [duration, setDuration] = useState(initialData?.duration || 30);
  const [exercises, setExercises] = useState<Exercise[]>(initialData?.exercises || []);

  const handleAddExercise = () => {
    const newExercise: Exercise = {
      id: `exercise-${Date.now()}`,
      name: "",
      sets: 3,
      reps: 12,
      rest: 60,
    };
    setExercises([...exercises, newExercise]);
  };

  const handleRemoveExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleExerciseChange = (index: number, field: keyof Exercise, value: any) => {
    const updatedExercises = [...exercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]: value,
    };
    setExercises(updatedExercises);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(exercises);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setExercises(items);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a workout plan name",
        variant: "destructive",
      });
      return;
    }

    if (exercises.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one exercise",
        variant: "destructive",
      });
      return;
    }

    if (exercises.some((ex) => !ex.name.trim())) {
      toast({
        title: "Error",
        description: "Please fill in all exercise names",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      name,
      description,
      difficulty,
      duration,
      exercises,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Workout Plan Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter workout plan name"
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter workout plan description"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="difficulty">Difficulty Level</Label>
            <Select value={difficulty} onValueChange={(value: any) => setDifficulty(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              min={1}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Exercises</Label>
          <Button type="button" variant="outline" size="sm" onClick={handleAddExercise}>
            <Plus className="w-4 h-4 mr-2" />
            Add Exercise
          </Button>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="exercises">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {exercises.map((exercise, index) => (
                  <Draggable key={exercise.id} draggableId={exercise.id} index={index}>
                    {(provided) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="p-4"
                      >
                        <div className="flex items-start gap-4">
                          <div {...provided.dragHandleProps} className="mt-2">
                            <GripVertical className="w-4 h-4 text-muted-foreground" />
                          </div>

                          <div className="flex-1 space-y-4">
                            <div>
                              <Label>Exercise Name</Label>
                              <Input
                                value={exercise.name}
                                onChange={(e) =>
                                  handleExerciseChange(index, "name", e.target.value)
                                }
                                placeholder="Enter exercise name"
                              />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <Label>Sets</Label>
                                <Input
                                  type="number"
                                  value={exercise.sets}
                                  onChange={(e) =>
                                    handleExerciseChange(index, "sets", Number(e.target.value))
                                  }
                                  min={1}
                                />
                              </div>

                              <div>
                                <Label>Reps</Label>
                                <Input
                                  type="number"
                                  value={exercise.reps}
                                  onChange={(e) =>
                                    handleExerciseChange(index, "reps", Number(e.target.value))
                                  }
                                  min={1}
                                />
                              </div>

                              <div>
                                <Label>Rest (seconds)</Label>
                                <Input
                                  type="number"
                                  value={exercise.rest}
                                  onChange={(e) =>
                                    handleExerciseChange(index, "rest", Number(e.target.value))
                                  }
                                  min={0}
                                />
                              </div>
                            </div>

                            <div>
                              <Label>Notes (optional)</Label>
                              <Textarea
                                value={exercise.notes || ""}
                                onChange={(e) =>
                                  handleExerciseChange(index, "notes", e.target.value)
                                }
                                placeholder="Enter exercise notes"
                              />
                            </div>
                          </div>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveExercise(index)}
                            className="mt-2"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Workout Plan</Button>
      </div>
    </form>
  );
} 