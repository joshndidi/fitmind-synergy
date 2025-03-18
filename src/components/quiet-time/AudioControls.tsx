
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Music, Volume2 } from "lucide-react";
import { QuietTimeSphere } from "@/components/QuietTimeSphere";

type AudioControlsProps = {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  volume: number;
  setVolume: (volume: number) => void;
  audioSource: string;
  setAudioSource: (source: string) => void;
}

const audioOptions = [
  { name: "Ambient", src: "/assets/ambient.mp3" },
  { name: "Meditation", src: "/assets/meditation.mp3" },
  { name: "Nature", src: "/assets/nature-sounds.mp3" }
];

export const AudioControls = ({
  isPlaying,
  setIsPlaying,
  volume,
  setVolume,
  audioSource,
  setAudioSource
}: AudioControlsProps) => {
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <QuietTimeSphere isPlaying={isPlaying} audioSource={audioSource} volume={volume} />
      
      <div className="mt-8 space-y-6 w-full max-w-md">
        <div className="flex justify-center">
          <Button 
            className={`${isPlaying ? 'bg-destructive text-white' : 'bg-primary text-white'} rounded-full w-16 h-16 flex items-center justify-center`}
            onClick={togglePlayback}
          >
            {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Volume2 className="mr-2 text-text-muted" />
              <span className="text-text-light">Volume</span>
            </div>
            <span className="text-text-light">{volume}%</span>
          </div>
          <Slider
            value={[volume]}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => setVolume(value[0])}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center">
            <Music className="mr-2 text-text-muted" />
            <span className="text-text-light">Audio Tracks</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {audioOptions.map((option) => (
              <Button
                key={option.name}
                variant={audioSource === option.src ? "default" : "outline"}
                className={audioSource === option.src ? "bg-primary text-white" : "border-white/10"}
                onClick={() => setAudioSource(option.src)}
              >
                {option.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
