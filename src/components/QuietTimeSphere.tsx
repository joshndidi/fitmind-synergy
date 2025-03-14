
import { useState, useEffect } from "react";

type SphereColor = "green" | "blue" | "purple";

type QuietTimeSphereProps = {
  initialColor?: SphereColor;
  onColorChange?: (color: SphereColor) => void;
};

const QuietTimeSphere = ({
  initialColor = "blue",
  onColorChange,
}: QuietTimeSphereProps) => {
  const [color, setColor] = useState<SphereColor>(initialColor);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Define color to tailwind class mapping
  const colorClasses = {
    green: "bg-sphere-green",
    blue: "bg-sphere-blue",
    purple: "bg-sphere-purple",
  };

  // Define color to music type mapping
  const colorToMusic = {
    green: "Meditation",
    blue: "Calm Focus",
    purple: "Deep Sleep",
  };

  const handleClick = () => {
    // Cycle through colors: green -> blue -> purple -> green
    const nextColor: Record<SphereColor, SphereColor> = {
      green: "blue",
      blue: "purple",
      purple: "green",
    };
    
    const newColor = nextColor[color];
    setColor(newColor);
    setIsAnimating(true);
    
    // Call onColorChange prop if provided
    if (onColorChange) {
      onColorChange(newColor);
    }
    
    // Toggle play state
    setIsPlaying(!isPlaying);
  };

  // Reset animation state after animation completes
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  return (
    <div className="flex flex-col items-center">
      <div
        className={`
          w-32 h-32 md:w-40 md:h-40 rounded-full shadow-lg cursor-pointer 
          ${colorClasses[color]} 
          transition-all duration-600 ease-out 
          ${isAnimating ? "scale-110" : "scale-100"}
          ${isPlaying ? "animate-pulse-slow" : ""}
          flex items-center justify-center
          hover:scale-105
        `}
        onClick={handleClick}
      >
        <div className="absolute w-28 h-28 md:w-36 md:h-36 rounded-full bg-white/10 backdrop-blur-sm"></div>
        <div className="z-10 text-white text-center">
          <p className="font-medium">{colorToMusic[color]}</p>
          <p className="text-xs opacity-70">{isPlaying ? "Playing" : "Tap to Play"}</p>
        </div>
      </div>
      <p className="mt-4 text-text-muted text-sm">
        {isPlaying ? `Now Playing: ${colorToMusic[color]} Music` : "Click the sphere to play music"}
      </p>
    </div>
  );
};

export default QuietTimeSphere;
