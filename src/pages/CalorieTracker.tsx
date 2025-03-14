
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Camera, BarChart3, CheckCircle2, Save } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { useAI } from "../hooks/useAI";
import { Food } from "../types/workout";

const CalorieTracker = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<Food | null>(null);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { analyzeFood, loading, error } = useAI();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setSelectedImage(e.target.result as string);
          setAnalysis(null);
          setSaved(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const takePicture = () => {
    // In a real implementation, this would access the device camera
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage || !imageFile) {
      toast.error("Please select or take a picture of your meal first");
      return;
    }

    setAnalyzing(true);
    
    try {
      const result = await analyzeFood(imageFile);
      
      // Create a Food object with the analysis results
      const foodItem: Food = {
        id: crypto.randomUUID(),
        description: result.description,
        calories: result.calories,
        protein: result.protein,
        carbs: result.carbs,
        fat: result.fat,
        date: new Date().toISOString(),
        imageUrl: selectedImage,
        suggestedAlternatives: result.suggestedAlternatives
      };
      
      setAnalysis(foodItem);
      toast.success("Food analyzed successfully!");
    } catch (err) {
      console.error("Error analyzing food:", err);
      toast.error("Failed to analyze food. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const saveFoodItem = () => {
    if (!analysis) return;
    
    // Get existing food items from localStorage
    const storedFood = localStorage.getItem('foodItems');
    const foodItems: Food[] = storedFood ? JSON.parse(storedFood) : [];
    
    // Add the new food item
    foodItems.push(analysis);
    
    // Save back to localStorage
    localStorage.setItem('foodItems', JSON.stringify(foodItems));
    
    setSaved(true);
    toast.success("Food item saved to your journal!");
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8 text-text-light">Calorie Tracker</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-text-light">Upload Food Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              {selectedImage ? (
                <div className="w-full max-h-64 overflow-hidden rounded-lg">
                  <img 
                    src={selectedImage} 
                    alt="Selected food" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-40 bg-black/20 rounded-lg flex items-center justify-center">
                  <p className="text-text-muted">No image selected</p>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <label className="flex-1">
                  <Button className="w-full bg-primary text-white" variant="outline">
                    <Upload className="mr-2 h-4 w-4" /> Upload Image
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                    ref={fileInputRef}
                  />
                </label>
                
                <Button
                  onClick={takePicture}
                  className="flex-1 bg-primary/10 text-primary hover:bg-primary/20"
                  variant="outline"
                >
                  <Camera className="mr-2 h-4 w-4" /> Take Picture
                </Button>
              </div>
              
              <Button
                onClick={analyzeImage}
                className="w-full bg-primary text-white"
                disabled={!selectedImage || analyzing}
              >
                {analyzing ? (
                  <>
                    <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <BarChart3 className="mr-2 h-4 w-4" /> Analyze Food
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-text-light">Nutritional Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            {analysis ? (
              <div className="space-y-6">
                <p className="text-text-light font-medium break-words line-clamp-2 hover:line-clamp-none">
                  {analysis.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-card p-4">
                    <p className="text-text-muted text-sm">Calories</p>
                    <p className="text-text-light text-xl font-bold truncate">{analysis.calories} kcal</p>
                  </div>
                  
                  <div className="glass-card p-4">
                    <p className="text-text-muted text-sm">Protein</p>
                    <p className="text-text-light text-xl font-bold truncate">{analysis.protein}g</p>
                  </div>
                  
                  <div className="glass-card p-4">
                    <p className="text-text-muted text-sm">Carbs</p>
                    <p className="text-text-light text-xl font-bold truncate">{analysis.carbs}g</p>
                  </div>
                  
                  <div className="glass-card p-4">
                    <p className="text-text-muted text-sm">Fat</p>
                    <p className="text-text-light text-xl font-bold truncate">{analysis.fat}g</p>
                  </div>
                </div>
                
                {analysis.suggestedAlternatives && analysis.suggestedAlternatives.length > 0 && (
                  <div className="mt-4">
                    <p className="text-text-light font-medium mb-2">Healthier Alternatives:</p>
                    <ul className="space-y-1 text-sm text-text-muted">
                      {analysis.suggestedAlternatives.map((alt, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          <span className="break-words">{alt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <Button 
                  className="w-full bg-primary text-white"
                  onClick={saveFoodItem}
                  disabled={saved}
                >
                  {saved ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" /> Saved to Journal
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" /> Save to Food Journal
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <BarChart3 className="h-16 w-16 text-text-muted opacity-20 mb-4" />
                <h3 className="text-text-light text-lg font-medium mb-2">No Analysis Yet</h3>
                <p className="text-text-muted">
                  Upload an image of your food and click "Analyze Food" to get nutritional information
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalorieTracker;
