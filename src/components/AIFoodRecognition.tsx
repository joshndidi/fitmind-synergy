import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Loader2, Upload, Camera } from 'lucide-react';
import { toast } from 'sonner';

interface FoodRecognitionResult {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  confidence: number;
}

export function AIFoodRecognition({ onFoodRecognized }: { onFoodRecognized: (food: FoodRecognitionResult) => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<FoodRecognitionResult | null>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setResult(null);

    // Process image
    await processImage(file);
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Here you would implement the camera capture logic
      // For now, we'll just show a message
      toast.info('Camera capture feature coming soon!');
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      toast.error('Failed to access camera');
    }
  };

  const processImage = async (file: File) => {
    setIsLoading(true);
    try {
      // Convert image to base64
      const base64Image = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      // Call AI service (replace with your actual API endpoint)
      const response = await fetch('/api/recognize-food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Image }),
      });

      if (!response.ok) {
        throw new Error('Failed to recognize food');
      }

      const data = await response.json();
      setResult(data);
      onFoodRecognized(data);
      toast.success('Food recognized successfully!');
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Failed to recognize food. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">AI Food Recognition</h3>
        <p className="text-sm text-muted-foreground">
          Upload a photo of your food to get nutritional information
        </p>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="food-image-upload"
          />
          <label
            htmlFor="food-image-upload"
            className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Food preview"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-8 h-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Click to upload or drag and drop
                </span>
              </div>
            )}
          </label>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={handleCameraCapture}
          className="h-32 w-32"
        >
          <Camera className="w-8 h-8" />
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Analyzing image...</span>
        </div>
      )}

      {result && (
        <div className="space-y-2">
          <h4 className="font-medium">{result.name}</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Calories:</span>
              <span className="ml-2">{result.calories}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Protein:</span>
              <span className="ml-2">{result.protein}g</span>
            </div>
            <div>
              <span className="text-muted-foreground">Carbs:</span>
              <span className="ml-2">{result.carbs}g</span>
            </div>
            <div>
              <span className="text-muted-foreground">Fat:</span>
              <span className="ml-2">{result.fat}g</span>
            </div>
            <div className="col-span-2">
              <span className="text-muted-foreground">Serving Size:</span>
              <span className="ml-2">{result.servingSize}</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
} 