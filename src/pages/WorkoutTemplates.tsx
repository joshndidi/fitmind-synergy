import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dumbbell, Timer, Target, Users, Flame, Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface WorkoutTemplate {
  id: string;
  name: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number;
  focus: string[];
  equipment: string[];
  exercises: {
    name: string;
    sets: number;
    reps: string;
    rest: number;
  }[];
}

const templates: WorkoutTemplate[] = [
  {
    id: "1",
    name: "Full Body Strength",
    description: "A comprehensive full-body workout targeting all major muscle groups.",
    difficulty: "intermediate",
    duration: 60,
    focus: ["strength", "muscle growth"],
    equipment: ["dumbbells", "barbell", "bodyweight"],
    exercises: [
      { name: "Squats", sets: 4, reps: "8-12", rest: 90 },
      { name: "Bench Press", sets: 4, reps: "8-12", rest: 90 },
      { name: "Deadlifts", sets: 3, reps: "6-8", rest: 120 },
      { name: "Pull-ups", sets: 3, reps: "8-12", rest: 90 },
      { name: "Shoulder Press", sets: 3, reps: "10-12", rest: 60 },
    ],
  },
  {
    id: "2",
    name: "HIIT Cardio Blast",
    description: "High-intensity interval training for maximum calorie burn and cardiovascular fitness.",
    difficulty: "advanced",
    duration: 30,
    focus: ["cardio", "endurance"],
    equipment: ["bodyweight", "kettlebell"],
    exercises: [
      { name: "Burpees", sets: 4, reps: "30s", rest: 30 },
      { name: "Mountain Climbers", sets: 4, reps: "45s", rest: 15 },
      { name: "Jump Squats", sets: 4, reps: "30s", rest: 30 },
      { name: "High Knees", sets: 4, reps: "45s", rest: 15 },
      { name: "Plank to Push-up", sets: 4, reps: "30s", rest: 30 },
    ],
  },
  {
    id: "3",
    name: "Beginner's Foundation",
    description: "Perfect for those new to working out, focusing on proper form and basic movements.",
    difficulty: "beginner",
    duration: 45,
    focus: ["strength", "form"],
    equipment: ["bodyweight", "dumbbells"],
    exercises: [
      { name: "Bodyweight Squats", sets: 3, reps: "10-12", rest: 60 },
      { name: "Push-ups (Knee)", sets: 3, reps: "8-10", rest: 60 },
      { name: "Plank", sets: 3, reps: "30s", rest: 60 },
      { name: "Dumbbell Rows", sets: 3, reps: "10-12", rest: 60 },
      { name: "Bird Dogs", sets: 3, reps: "10 each side", rest: 60 },
    ],
  },
];

export function WorkoutTemplates() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTemplates = templates.filter((template) => {
    const matchesDifficulty = selectedDifficulty === "all" || template.difficulty === selectedDifficulty;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDifficulty && matchesSearch;
  });

  const handleUseTemplate = (template: WorkoutTemplate) => {
    // In a real app, this would create a new workout based on the template
    toast({
      title: "Template Applied",
      description: "The workout template has been added to your workouts.",
    });
    navigate("/workouts");
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Workout Templates</h1>
            <p className="text-muted-foreground">Choose from pre-made workout plans or create your own</p>
          </div>
          <Button onClick={() => navigate("/workouts/create")}>
            Create Custom Workout
          </Button>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search templates..."
              className="w-full px-4 py-2 rounded-md border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 rounded-md border"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
          >
            <option value="all">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{template.name}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant={template.difficulty === "beginner" ? "secondary" : 
                      template.difficulty === "intermediate" ? "default" : "destructive"}>
                      {template.difficulty}
                    </Badge>
                    <Badge variant="outline">
                      <Timer className="w-4 h-4 mr-1" />
                      {template.duration} min
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      <span className="text-sm font-medium">Focus:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {template.focus.map((f) => (
                        <Badge key={f} variant="outline">{f}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Dumbbell className="w-4 h-4" />
                      <span className="text-sm font-medium">Equipment:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {template.equipment.map((e) => (
                        <Badge key={e} variant="outline">{e}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4" />
                      <span className="text-sm font-medium">Exercises:</span>
                    </div>
                    <ScrollArea className="h-[100px]">
                      <div className="space-y-2">
                        {template.exercises.map((exercise, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span>{exercise.name}</span>
                            <span className="text-muted-foreground">
                              {exercise.sets} × {exercise.reps}
                            </span>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </CardContent>
              <div className="p-4 border-t">
                <Button className="w-full" onClick={() => handleUseTemplate(template)}>
                  <Copy className="w-4 h-4 mr-2" />
                  Use Template
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 