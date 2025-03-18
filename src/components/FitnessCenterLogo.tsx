
import React from "react";
import { Dumbbell } from "lucide-react";

export const FitnessCenterLogo = ({ className }: { className?: string }) => {
  return (
    <div className={`${className} flex items-center justify-center bg-primary/20 p-3 rounded-full`}>
      <Dumbbell className="text-primary" />
    </div>
  );
};
