import React from "react";

export interface QuietTimeSphereProps {
  color: string;
  isPlaying: boolean;
  onClick: () => void;
}

const QuietTimeSphere = ({ color, isPlaying, onClick }: QuietTimeSphereProps) => {
  // Implementation of the QuietTimeSphere component
  return (
    <div
      className={`relative cursor-pointer transition-all duration-500 ease-out ${
        isPlaying ? "scale-110" : "scale-100 hover:scale-105"
      }`}
      onClick={onClick}
      style={{ width: "220px", height: "220px" }}
    >
      <div
        className="absolute inset-0 rounded-full shadow-lg transition-opacity"
        style={{
          background: color,
          opacity: isPlaying ? 0.8 : 0.6,
        }}
      />
      {isPlaying && (
        <div className="absolute inset-2 rounded-full animate-pulse opacity-60" style={{ background: color }} />
      )}
      {isPlaying && (
        <div className="absolute inset-4 rounded-full animate-pulse opacity-40" style={{ background: color }} />
      )}
      {isPlaying && (
        <div className="absolute inset-6 rounded-full animate-pulse opacity-20" style={{ background: color }} />
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-2xl font-bold mb-2">
            {isPlaying ? "Playing" : "Play"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuietTimeSphere;
