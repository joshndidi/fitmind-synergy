import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import { 
  Plus, 
  Trophy, 
  Target, 
  TrendingUp,
  Calendar,
  Dumbbell,
  Medal
} from "lucide-react";

interface WeightEntry {
  date: string;
  weight: number;
  notes?: string;
}

interface PersonalRecord {
  exercise: string;
  weight: number;
  reps: number;
  date: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "weight" | "workout" | "achievement";
  completed: boolean;
}

const mockWeightData: WeightEntry[] = [
  { date: "2024-01-01", weight: 75, notes: "Starting weight" },
  { date: "2024-01-08", weight: 74.5 },
  { date: "2024-01-15", weight: 74 },
  { date: "2024-01-22", weight: 73.5 },
  { date: "2024-01-29", weight: 73 },
];

const mockPersonalRecords: PersonalRecord[] = [
  { exercise: "Bench Press", weight: 100, reps: 5, date: "2024-01-15" },
  { exercise: "Squats", weight: 140, reps: 3, date: "2024-01-20" },
  { exercise: "Deadlift", weight: 180, reps: 1, date: "2024-01-25" },
];

const mockMilestones: Milestone[] = [
  {
    id: "1",
    title: "Weight Goal",
    description: "Reach 70kg",
    date: "2024-03-01",
    type: "weight",
    completed: false,
  },
  {
    id: "2",
    title: "Workout Streak",
    description: "Complete 30 days of workouts",
    date: "2024-02-15",
    type: "workout",
    completed: false,
  },
  {
    id: "3",
    title: "Bench Press PR",
    description: "Bench press 120kg",
    date: "2024-02-01",
    type: "achievement",
    completed: false,
  },
];

export function ProgressTracking() {
  const [newWeight, setNewWeight] = useState("");
  const [weightNotes, setWeightNotes] = useState("");

  const handleAddWeight = () => {
    if (!newWeight) return;
    
    const newEntry: WeightEntry = {
      date: new Date().toISOString().split('T')[0],
      weight: parseFloat(newWeight),
      notes: weightNotes,
    };

    // In a real app, this would update the backend
    console.log("Adding weight entry:", newEntry);
    
    setNewWeight("");
    setWeightNotes("");
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Progress Tracking</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Progress
        </Button>
      </div>

      <Tabs defaultValue="weight" className="w-full">
        <TabsList>
          <TabsTrigger value="weight">Weight</TabsTrigger>
          <TabsTrigger value="records">Personal Records</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
        </TabsList>

        <TabsContent value="weight" className="space-y-6">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Weight Progress</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockWeightData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#8884d8" 
                    name="Weight (kg)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Add Weight Entry</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Weight (kg)</label>
                  <Input
                    type="number"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    placeholder="Enter weight"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Notes</label>
                  <Input
                    value={weightNotes}
                    onChange={(e) => setWeightNotes(e.target.value)}
                    placeholder="Add notes (optional)"
                  />
                </div>
              </div>
              <Button onClick={handleAddWeight}>Add Entry</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="records" className="space-y-6">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Personal Records</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockPersonalRecords}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="exercise" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="weight" fill="#8884d8" name="Weight (kg)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Recent Records</h2>
            <ScrollArea className="h-[200px]">
              <div className="space-y-4">
                {mockPersonalRecords.map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{record.exercise}</p>
                      <p className="text-sm text-muted-foreground">
                        {record.weight}kg × {record.reps} reps
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {new Date(record.date).toLocaleDateString()}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-6">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Milestones</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockMilestones.map((milestone) => (
                <Card key={milestone.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                      {milestone.type === "weight" && <Target className="w-5 h-5" />}
                      {milestone.type === "workout" && <Dumbbell className="w-5 h-5" />}
                      {milestone.type === "achievement" && <Medal className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="font-medium">{milestone.title}</h3>
                      <p className="text-sm text-muted-foreground">{milestone.description}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Due: {new Date(milestone.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button 
                      variant={milestone.completed ? "outline" : "default"}
                      className="w-full"
                    >
                      {milestone.completed ? "Completed" : "Mark Complete"}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 