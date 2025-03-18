
import React, { useState, useEffect, useRef } from 'react';

export type QuietTimeSphereProps = {
  isPlaying: boolean;
  audioSource: string;
  volume: number;
};

const QuietTimeSphere = ({ isPlaying, audioSource, volume }: QuietTimeSphereProps) => {
  const [rotation, setRotation] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    let animationFrame: number;
    
    const rotate = () => {
      setRotation(prev => (prev + 0.1) % 360);
      animationFrame = requestAnimationFrame(rotate);
    };
    
    if (isPlaying) {
      animationFrame = requestAnimationFrame(rotate);
    }
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isPlaying]);
  
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Audio playback error:", error);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, audioSource]);
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = audioSource;
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Audio playback error:", error);
        });
      }
    }
  }, [audioSource, isPlaying]);
  
  return (
    <div className="relative w-60 h-60 mx-auto">
      <div 
        className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-primary/70 flex items-center justify-center"
        style={{ 
          transform: `rotate(${rotation}deg)`,
          boxShadow: isPlaying ? '0 0 30px 5px rgba(var(--primary-rgb), 0.3)' : 'none',
          transition: 'box-shadow 0.5s ease-in-out'
        }}
      >
        <div className="absolute inset-2 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center">
          <div className="text-4xl">
            {isPlaying ? '🎵' : '🔇'}
          </div>
        </div>
      </div>
      <audio ref={audioRef} loop />
    </div>
  );
};

export { QuietTimeSphere };
export default QuietTimeSphere;
