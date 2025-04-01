import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trophy, TrendingUp, History } from 'lucide-react';

interface WeightRecord {
  date: string;
  weight: number;
  reps: number;
  notes?: string;
}

interface PersonalRecord {
  weight: number;
  reps: number;
  date: string;
}

interface WeightTrackingProps {
  exerciseId: string;
  exerciseName: string;
  onWeightUpdate: (weight: number) => void;
}

export function WeightTracking({ exerciseId, exerciseName, onWeightUpdate }: WeightTrackingProps) {
  const [currentWeight, setCurrentWeight] = useState<number>(0);
  const [weightHistory, setWeightHistory] = useState<WeightRecord[]>([]);
  const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>([]);
  const [notes, setNotes] = useState<string>('');

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate loading weight history
    const mockHistory: WeightRecord[] = [
      { date: '2024-03-01', weight: 100, reps: 8, notes: 'Felt strong' },
      { date: '2024-03-08', weight: 105, reps: 6, notes: 'Heavy but good' },
      { date: '2024-03-15', weight: 102.5, reps: 7, notes: 'Form check needed' },
    ];
    setWeightHistory(mockHistory);

    // Simulate loading personal records
    const mockPRs: PersonalRecord[] = [
      { weight: 110, reps: 5, date: '2024-02-15' },
      { weight: 105, reps: 8, date: '2024-03-08' },
    ];
    setPersonalRecords(mockPRs);
  }, [exerciseId]);

  const handleWeightSubmit = () => {
    if (currentWeight > 0) {
      const newRecord: WeightRecord = {
        date: new Date().toISOString().split('T')[0],
        weight: currentWeight,
        reps: 0, // This should come from the workout execution
        notes,
      };

      setWeightHistory([...weightHistory, newRecord]);
      onWeightUpdate(currentWeight);
      setNotes('');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="p-4">
      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current">Current</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="records">Records</TabsTrigger>
        </TabsList>

        <TabsContent value="current">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <div className="flex gap-2">
                <Input
                  id="weight"
                  type="number"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(Number(e.target.value))}
                  placeholder="Enter weight"
                />
                <Button onClick={handleWeightSubmit}>Save</Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this set"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="weight" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {weightHistory.map((record, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                <div>
                  <div className="font-medium">{record.weight} kg</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(record.date)} - {record.reps} reps
                  </div>
                </div>
                {record.notes && (
                  <div className="text-sm text-muted-foreground">{record.notes}</div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="records">
          <div className="space-y-4">
            {personalRecords.map((record, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-muted rounded">
                <Trophy className="h-6 w-6 text-yellow-500" />
                <div>
                  <div className="font-medium">{record.weight} kg</div>
                  <div className="text-sm text-muted-foreground">
                    {record.reps} reps - {formatDate(record.date)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
} 