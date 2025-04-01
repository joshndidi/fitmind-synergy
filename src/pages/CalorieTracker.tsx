import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Food } from '@/types/workout';
import { Flame, Plus, Utensils, Scale, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function CalorieTracker() {
  const [meals, setMeals] = useState<Food[]>([]);
  const [newMeal, setNewMeal] = useState<Partial<Food>>({
    description: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    date: format(new Date(), 'yyyy-MM-dd')
  });

  const handleAddMeal = () => {
    if (!newMeal.description || !newMeal.calories) {
      toast.error('Please fill in the required fields');
      return;
    }

    const meal: Food = {
      id: `meal-${Date.now()}`,
      description: newMeal.description,
      calories: newMeal.calories || 0,
      protein: newMeal.protein || 0,
      carbs: newMeal.carbs || 0,
      fat: newMeal.fat || 0,
      date: newMeal.date || format(new Date(), 'yyyy-MM-dd')
    };

    setMeals(prev => [...prev, meal]);
    setNewMeal({
      description: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      date: format(new Date(), 'yyyy-MM-dd')
    });
    toast.success('Meal added successfully');
  };

  const handleDeleteMeal = (id: string) => {
    setMeals(prev => prev.filter(meal => meal.id !== id));
    toast.success('Meal deleted');
  };

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
  const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFat = meals.reduce((sum, meal) => sum + meal.fat, 0);

  return (
    <div className="container mx-auto py-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold flex items-center gap-2">
          <Utensils className="h-8 w-8" />
          Calorie Tracker
        </h1>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-12">
        <div className="md:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>Add Meal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      placeholder="What did you eat?"
                      value={newMeal.description}
                      onChange={(e) => setNewMeal(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Calories</Label>
                    <Input
                      type="number"
                      placeholder="Calories"
                      value={newMeal.calories || ''}
                      onChange={(e) => setNewMeal(prev => ({ ...prev, calories: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Protein (g)</Label>
                    <Input
                      type="number"
                      placeholder="Protein"
                      value={newMeal.protein || ''}
                      onChange={(e) => setNewMeal(prev => ({ ...prev, protein: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Carbs (g)</Label>
                    <Input
                      type="number"
                      placeholder="Carbs"
                      value={newMeal.carbs || ''}
                      onChange={(e) => setNewMeal(prev => ({ ...prev, carbs: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Fat (g)</Label>
                    <Input
                      type="number"
                      placeholder="Fat"
                      value={newMeal.fat || ''}
                      onChange={(e) => setNewMeal(prev => ({ ...prev, fat: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                </div>

                <Button onClick={handleAddMeal} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Meal
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Today's Meals</h2>
            <div className="space-y-4">
              {meals.map((meal) => (
                <Card key={meal.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{meal.description}</h3>
                        <div className="text-sm text-muted-foreground mt-1">
                          {meal.calories} calories · {meal.protein}g protein · {meal.carbs}g carbs · {meal.fat}g fat
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteMeal(meal.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {meals.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No meals added yet. Start tracking your nutrition!
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="md:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-primary" />
                    <span>Calories</span>
                  </div>
                  <span className="font-medium">{totalCalories}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scale className="h-4 w-4 text-primary" />
                    <span>Protein</span>
                  </div>
                  <span className="font-medium">{totalProtein}g</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scale className="h-4 w-4 text-primary" />
                    <span>Carbs</span>
                  </div>
                  <span className="font-medium">{totalCarbs}g</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scale className="h-4 w-4 text-primary" />
                    <span>Fat</span>
                  </div>
                  <span className="font-medium">{totalFat}g</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Nutrition Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Daily Calorie Goal</Label>
                  <Input type="number" placeholder="e.g., 2000" />
                </div>
                <div>
                  <Label>Macronutrient Split</Label>
                  <Select defaultValue="balanced">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="balanced">Balanced (40/30/30)</SelectItem>
                      <SelectItem value="lowcarb">Low Carb (50/30/20)</SelectItem>
                      <SelectItem value="highprotein">High Protein (40/40/20)</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">Save Goals</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
