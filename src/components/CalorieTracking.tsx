import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  Search,
  Filter,
  Clock,
  Utensils,
  Apple,
  Beef,
  Fish,
  Wheat,
  Milk,
  Cookie,
  Trash2,
  Edit2
} from "lucide-react";

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: "breakfast" | "lunch" | "dinner" | "snack";
  time: string;
}

interface MealPlan {
  id: string;
  name: string;
  description: string;
  meals: FoodItem[];
  totalCalories: number;
}

const mockFoodItems: FoodItem[] = [
  {
    id: "1",
    name: "Oatmeal with Banana",
    calories: 350,
    protein: 12,
    carbs: 65,
    fat: 8,
    category: "breakfast",
    time: "08:00"
  },
  {
    id: "2",
    name: "Chicken Salad",
    calories: 450,
    protein: 35,
    carbs: 25,
    fat: 22,
    category: "lunch",
    time: "12:30"
  },
  {
    id: "3",
    name: "Greek Yogurt",
    calories: 150,
    protein: 15,
    carbs: 8,
    fat: 5,
    category: "snack",
    time: "15:00"
  },
  {
    id: "4",
    name: "Salmon with Vegetables",
    calories: 550,
    protein: 45,
    carbs: 30,
    fat: 28,
    category: "dinner",
    time: "19:00"
  }
];

const mockMealPlans: MealPlan[] = [
  {
    id: "1",
    name: "Weight Loss Plan",
    description: "Balanced meals for sustainable weight loss",
    meals: mockFoodItems,
    totalCalories: 1500
  },
  {
    id: "2",
    name: "Muscle Gain Plan",
    description: "High protein meals for muscle growth",
    meals: [],
    totalCalories: 2500
  }
];

const dailyCalorieGoal = 2000;
const currentCalories = mockFoodItems.reduce((sum, item) => sum + item.calories, 0);
const progress = (currentCalories / dailyCalorieGoal) * 100;

export function CalorieTracking() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredFoodItems = mockFoodItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Calorie Tracking</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Food
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Daily Calories</span>
                <span>{currentCalories}/{dailyCalorieGoal} kcal</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Today's Meals</h2>
              <div className="flex gap-2">
                <Input
                  placeholder="Search foods..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48"
                />
                <Button variant="outline">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {filteredFoodItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-background rounded-full">
                      {item.category === "breakfast" && <Apple className="w-5 h-5" />}
                      {item.category === "lunch" && <Utensils className="w-5 h-5" />}
                      {item.category === "dinner" && <Beef className="w-5 h-5" />}
                      {item.category === "snack" && <Cookie className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.calories} kcal • {item.protein}g protein • {item.carbs}g carbs • {item.fat}g fat
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Meal Plans</h2>
            <div className="space-y-4">
              {mockMealPlans.map((plan) => (
                <div key={plan.id} className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                  <div className="mt-2">
                    <Badge variant="secondary">
                      {plan.totalCalories} kcal/day
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Nutrition Goals</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Protein</span>
                  <span>120g / 150g</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Carbs</span>
                  <span>200g / 250g</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Fat</span>
                  <span>50g / 70g</span>
                </div>
                <Progress value={71} className="h-2" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 