
import { Dumbbell, Calendar, Flame, Clock } from "lucide-react";
import { format } from "date-fns";

type WorkoutCardProps = {
  title: string;
  type: string;
  duration: number;
  calories: number;
  date: string;
  intensity: "Low" | "Medium" | "High";
  onClick?: () => void;
};

const WorkoutCard = ({
  title,
  type,
  duration,
  calories,
  date,
  intensity,
  onClick,
}: WorkoutCardProps) => {
  // Map intensity to color
  const intensityColor = {
    Low: "bg-green-500/20 text-green-400",
    Medium: "bg-yellow-500/20 text-yellow-400",
    High: "bg-red-500/20 text-red-400",
  }[intensity];

  // Format the date to dd/MM/yyyy
  const formattedDate = format(new Date(date), 'dd/MM/yyyy');

  return (
    <div 
      className="glass-card-hover transform transition-all duration-300 hover:scale-[1.02] cursor-pointer"
      onClick={onClick}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-text-light">{title}</h3>
            <p className="text-text-muted text-sm">{type}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${intensityColor}`}>
            {intensity} Intensity
          </span>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="flex flex-col items-center p-2 bg-white/5 rounded-lg">
            <Clock size={18} className="text-text-muted mb-1" />
            <span className="text-text-light font-medium">{duration} min</span>
            <span className="text-xs text-text-muted">Duration</span>
          </div>
          
          <div className="flex flex-col items-center p-2 bg-white/5 rounded-lg">
            <Flame size={18} className="text-primary mb-1" />
            <span className="text-text-light font-medium">{calories}</span>
            <span className="text-xs text-text-muted">kcal</span>
          </div>
          
          <div className="flex flex-col items-center p-2 bg-white/5 rounded-lg">
            <Calendar size={18} className="text-text-muted mb-1" />
            <span className="text-text-light font-medium">{formattedDate}</span>
            <span className="text-xs text-text-muted">Date</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutCard;
