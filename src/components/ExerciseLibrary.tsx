
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Info, 
  Play, 
  Bookmark,
  Share2,
  ChevronRight,
  Plus,
  User,
  Dumbbell,
  Settings,
  Activity
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

// Define Exercise type based on our database schema
interface Exercise {
  id: string;
  name: string;
  type: string;
  category: string;
  muscle_group: string;
  difficulty: string;
  equipment: string[];
  image_url: string | null;
  video_url: string | null;
  description: string | null;
  instructions: string[] | null;
  tips: string[] | null;
  variations: string[] | null;
  created_at: string;
}

const categories = ["All", "Strength", "Cardio", "Flexibility", "Balance"] as const;
const muscleGroups = ["All", "Chest", "Back", "Legs", "Shoulders", "Arms", "Core"] as const;
const difficulties = ["All", "Beginner", "Intermediate", "Advanced"] as const;

const difficultyColors: Record<string, string> = {
  beginner: "bg-green-100 text-green-800",
  intermediate: "bg-yellow-100 text-yellow-800",
  advanced: "bg-red-100 text-red-800"
};

const equipmentIcons: Record<string, JSX.Element> = {
  bodyweight: <User className="w-4 h-4" />,
  dumbbell: <Dumbbell className="w-4 h-4" />,
  barbell: <Dumbbell className="w-4 h-4" />,
  kettlebell: <Dumbbell className="w-4 h-4" />,
  machine: <Settings className="w-4 h-4" />,
  resistance: <Activity className="w-4 h-4" />
};

export function ExerciseLibrary() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<typeof categories[number]>("All");
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<typeof muscleGroups[number]>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showVideo, setShowVideo] = useState<string | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('exercises')
        .select('*');

      if (error) throw error;
      setExercises(data as Exercise[] || []);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      toast({
        title: "Error",
        description: "Failed to load exercises. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || exercise.category === selectedCategory;
    const matchesMuscleGroup = selectedMuscleGroup === "All" || exercise.muscle_group === selectedMuscleGroup;
    const matchesDifficulty = !selectedDifficulty || exercise.difficulty === selectedDifficulty;
    const matchesEquipment = !selectedEquipment || (exercise.equipment && exercise.equipment.includes(selectedEquipment));

    return matchesSearch && matchesCategory && matchesMuscleGroup && matchesDifficulty && matchesEquipment;
  });

  const uniqueEquipment = Array.from(
    new Set(exercises.flatMap((exercise) => exercise.equipment || []))
  );

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Exercise Library</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Exercise
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Filters</h2>
            
            <div className="space-y-4">
              <div>
                <Label>Search</Label>
                <Input
                  placeholder="Search exercises..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Category</Label>
                <Select 
                  value={selectedCategory} 
                  onValueChange={(value: typeof categories[number]) => setSelectedCategory(value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Muscle Group</Label>
                <Select 
                  value={selectedMuscleGroup} 
                  onValueChange={(value: typeof muscleGroups[number]) => setSelectedMuscleGroup(value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select muscle group" />
                  </SelectTrigger>
                  <SelectContent>
                    {muscleGroups.map((group) => (
                      <SelectItem key={group} value={group}>
                        {group}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Difficulty</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Button
                    variant={selectedDifficulty === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDifficulty(null)}
                  >
                    All
                  </Button>
                  <Button
                    variant={selectedDifficulty === "beginner" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDifficulty("beginner")}
                  >
                    Beginner
                  </Button>
                  <Button
                    variant={selectedDifficulty === "intermediate" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDifficulty("intermediate")}
                  >
                    Intermediate
                  </Button>
                  <Button
                    variant={selectedDifficulty === "advanced" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDifficulty("advanced")}
                  >
                    Advanced
                  </Button>
                </div>
              </div>

              <div>
                <Label>Equipment</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Button
                    variant={selectedEquipment === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedEquipment(null)}
                  >
                    All
                  </Button>
                  {uniqueEquipment.map((equipment) => (
                    <Button
                      key={equipment}
                      variant={selectedEquipment === equipment ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedEquipment(equipment)}
                    >
                      {equipmentIcons[equipment as keyof typeof equipmentIcons] || null}
                      <span className="ml-2 capitalize">{equipment}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="md:col-span-3">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExercises.map((exercise) => (
                <Card key={exercise.id} className="overflow-hidden">
                  {exercise.image_url && (
                    <div className="relative h-48">
                      <img
                        src={exercise.image_url}
                        alt={exercise.name}
                        className="w-full h-full object-cover"
                      />
                      {exercise.video_url && (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="absolute bottom-2 right-2"
                          onClick={() => setShowVideo(exercise.video_url)}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Watch Demo
                        </Button>
                      )}
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{exercise.name}</h3>
                      {exercise.difficulty && (
                        <Badge className={difficultyColors[exercise.difficulty] || ""}>
                          {exercise.difficulty}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {exercise.description?.slice(0, 100)}
                      {exercise.description && exercise.description.length > 100 ? '...' : ''}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {exercise.equipment && exercise.equipment.map((item) => (
                        <Badge key={item} variant="secondary">
                          {equipmentIcons[item as keyof typeof equipmentIcons] || null}
                          <span className="ml-1 capitalize">{item}</span>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        {exercise.muscle_group}
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedExercise(exercise)}
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{exercise.name}</DialogTitle>
                          </DialogHeader>
                          <ScrollArea className="h-[600px] pr-4">
                            <div className="space-y-6">
                              <div>
                                <h4 className="font-semibold mb-2">Description</h4>
                                <p>{exercise.description}</p>
                              </div>

                              {exercise.instructions && exercise.instructions.length > 0 && (
                                <div>
                                  <h4 className="font-semibold mb-2">Instructions</h4>
                                  <ol className="list-decimal list-inside space-y-2">
                                    {exercise.instructions.map((instruction, index) => (
                                      <li key={index}>{instruction}</li>
                                    ))}
                                  </ol>
                                </div>
                              )}

                              {exercise.tips && exercise.tips.length > 0 && (
                                <div>
                                  <h4 className="font-semibold mb-2">Tips</h4>
                                  <ul className="list-disc list-inside space-y-2">
                                    {exercise.tips.map((tip, index) => (
                                      <li key={index}>{tip}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {exercise.variations && exercise.variations.length > 0 && (
                                <div>
                                  <h4 className="font-semibold mb-2">Variations</h4>
                                  <ul className="list-disc list-inside space-y-2">
                                    {exercise.variations.map((variation, index) => (
                                      <li key={index}>{variation}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {exercise.video_url && (
                                <div>
                                  <h4 className="font-semibold mb-2">Video Guide</h4>
                                  <Button 
                                    variant="outline" 
                                    className="w-full"
                                    onClick={() => setShowVideo(exercise.video_url)}
                                  >
                                    <Play className="w-4 h-4 mr-2" />
                                    Watch Video
                                  </Button>
                                </div>
                              )}
                            </div>
                          </ScrollArea>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {showVideo && (
        <Dialog open={!!showVideo} onOpenChange={() => setShowVideo(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Exercise Demonstration</DialogTitle>
            </DialogHeader>
            <div className="aspect-video">
              <iframe
                src={showVideo}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
