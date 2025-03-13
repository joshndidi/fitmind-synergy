
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Camera, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

const CalorieTracker = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<null | {
    description: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }>(null);
  const { user } = useAuth();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setSelectedImage(e.target.result as string);
          setAnalysis(null);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const takePicture = () => {
    // In a real implementation, this would access the device camera
    toast.info("Camera functionality would open here");
  };

  const analyzeImage = () => {
    if (!selectedImage) {
      toast.error("Please select or take a picture of your meal first");
      return;
    }

    setAnalyzing(true);
    
    // Simulate AI analysis with a timeout
    setTimeout(() => {
      // Mock AI response
      const mockAnalysis = {
        description: "Grilled chicken breast with steamed broccoli and brown rice",
        calories: 450,
        protein: 35,
        carbs: 45,
        fat: 12
      };
      
      setAnalysis(mockAnalysis);
      setAnalyzing(false);
      toast.success("Food analyzed successfully!");
    }, 2000);
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
                <p className="text-text-light font-medium">{analysis.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-card p-4">
                    <p className="text-text-muted text-sm">Calories</p>
                    <p className="text-text-light text-2xl font-bold">{analysis.calories} kcal</p>
                  </div>
                  
                  <div className="glass-card p-4">
                    <p className="text-text-muted text-sm">Protein</p>
                    <p className="text-text-light text-2xl font-bold">{analysis.protein}g</p>
                  </div>
                  
                  <div className="glass-card p-4">
                    <p className="text-text-muted text-sm">Carbs</p>
                    <p className="text-text-light text-2xl font-bold">{analysis.carbs}g</p>
                  </div>
                  
                  <div className="glass-card p-4">
                    <p className="text-text-muted text-sm">Fat</p>
                    <p className="text-text-light text-2xl font-bold">{analysis.fat}g</p>
                  </div>
                </div>
                
                <Button className="w-full bg-primary text-white">
                  Save to Food Journal
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
