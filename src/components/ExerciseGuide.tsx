import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';

interface ExerciseGuideProps {
  exerciseName: string;
  formTips: string[];
  videoUrl?: string;
  commonMistakes: string[];
  targetMuscles: string[];
}

export function ExerciseGuide({
  exerciseName,
  formTips,
  videoUrl,
  commonMistakes,
  targetMuscles,
}: ExerciseGuideProps) {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const nextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % formTips.length);
  };

  const previousTip = () => {
    setCurrentTipIndex((prev) => (prev - 1 + formTips.length) % formTips.length);
  };

  return (
    <Card className="p-4">
      <Tabs defaultValue="form" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="form">Form Guide</TabsTrigger>
          <TabsTrigger value="muscles">Target Muscles</TabsTrigger>
          <TabsTrigger value="mistakes">Common Mistakes</TabsTrigger>
        </TabsList>

        <TabsContent value="form">
          <div className="space-y-4">
            {videoUrl && (
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                <video
                  src={videoUrl}
                  controls
                  className="w-full h-full object-cover"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
              </div>
            )}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Form Tip {currentTipIndex + 1}</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={previousTip}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={nextTip}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-muted-foreground">{formTips[currentTipIndex]}</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="muscles">
          <div className="space-y-4">
            <h3 className="font-semibold">Target Muscles</h3>
            <ul className="list-disc list-inside space-y-2">
              {targetMuscles.map((muscle, index) => (
                <li key={index} className="text-muted-foreground">{muscle}</li>
              ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="mistakes">
          <div className="space-y-4">
            <h3 className="font-semibold">Common Mistakes to Avoid</h3>
            <ul className="list-disc list-inside space-y-2">
              {commonMistakes.map((mistake, index) => (
                <li key={index} className="text-muted-foreground">{mistake}</li>
              ))}
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
} 