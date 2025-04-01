import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AIFoodRecognition } from '@/components/AIFoodRecognition';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  timestamp: string;
}

export default function NutritionPage() {
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [dailyGoal, setDailyGoal] = useState(2000); // Default daily calorie goal

  const handleFoodRecognized = (food: any) => {
    const newEntry: FoodEntry = {
      id: Date.now().toString(),
      ...food,
      timestamp: new Date().toISOString(),
    };
    setFoodEntries(prev => [...prev, newEntry]);
    toast.success('Food added to tracker');
  };

  const handleDeleteEntry = (id: string) => {
    setFoodEntries(prev => prev.filter(entry => entry.id !== id));
    toast.success('Food entry removed');
  };

  const totalCalories = foodEntries.reduce((sum, entry) => sum + entry.calories, 0);
  const totalProtein = foodEntries.reduce((sum, entry) => sum + entry.protein, 0);
  const totalCarbs = foodEntries.reduce((sum, entry) => sum + entry.carbs, 0);
  const totalFat = foodEntries.reduce((sum, entry) => sum + entry.fat, 0);

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold">Nutrition Tracker</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Daily Summary</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Daily Goal</label>
                <Input
                  type="number"
                  value={dailyGoal}
                  onChange={(e) => setDailyGoal(Number(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Calories Left</label>
                <div className="text-2xl font-bold mt-1">
                  {dailyGoal - totalCalories}
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Protein</label>
                <div className="text-lg font-semibold">{totalProtein}g</div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Carbs</label>
                <div className="text-lg font-semibold">{totalCarbs}g</div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Fat</label>
                <div className="text-lg font-semibold">{totalFat}g</div>
              </div>
            </div>
          </Card>

          <AIFoodRecognition onFoodRecognized={handleFoodRecognized} />
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Today's Food Log</h2>
          <div className="space-y-4">
            {foodEntries.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No food entries yet. Use the AI recognition or add manually.
              </div>
            ) : (
              foodEntries.map(entry => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-3 bg-accent/50 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{entry.name}</h3>
                    <div className="text-sm text-muted-foreground">
                      {entry.calories} cal · {entry.protein}g protein · {entry.carbs}g carbs · {entry.fat}g fat
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Serving: {entry.servingSize}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteEntry(entry.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
} 