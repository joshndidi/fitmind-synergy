
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, TrendingUp, Calendar, Dumbbell, Award, ChevronRight } from "lucide-react";
import { useWorkout, Workout } from "../hooks/useWorkout";
import WorkoutCard from "../components/WorkoutCard";
import { toast } from "sonner";

const Dashboard = () => {
  const { workouts, loading } = useWorkout();
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Calculate stats
  const totalWorkouts = workouts.length;
  const totalDuration = workouts.reduce((sum, workout) => sum + workout.duration, 0);
  const totalCalories = workouts.reduce((sum, workout) => sum + workout.calories, 0);
  
  // Get recent workouts
  const recentWorkouts = [...workouts].sort((a, b) => {
    const dateOrder = { "Today": 0, "Yesterday": 1 };
    const aValue = dateOrder[a.date as keyof typeof dateOrder] ?? 2;
    const bValue = dateOrder[b.date as keyof typeof dateOrder] ?? 2;
    return aValue - bValue;
  }).slice(0, 3);

  const handleWorkoutClick = (workout: Workout) => {
    if (workout && workout.id) {
      navigate(`/workout-display/${workout.id}`);
    } else {
      toast.error("Unable to open workout. Please try another one.");
    }
  };

  // Handle Start Workout button click
  const handleStartWorkout = () => {
    if (workouts.length > 0 && workouts[0].id) {
      navigate(`/workout-display/${workouts[0].id}`);
    } else {
      toast.error("No workouts available. Create one in Workout AI.");
      navigate("/workout-ai");
    }
  };

  return (
    <div className={`page-container transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-light mb-2">Welcome Back</h1>
        <p className="text-text-muted">Track your fitness journey and mental wellness</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-slide-in">
        <div className="glass-card p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-text-muted mb-1">Total Workouts</p>
              <h3 className="text-2xl font-bold text-text-light">{totalWorkouts}</h3>
            </div>
            <div className="p-2 rounded-full bg-primary/20">
              <Dumbbell className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>
        
        <div className="glass-card p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-text-muted mb-1">Minutes Active</p>
              <h3 className="text-2xl font-bold text-text-light">{totalDuration}</h3>
            </div>
            <div className="p-2 rounded-full bg-primary/20">
              <Activity className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>
        
        <div className="glass-card p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-text-muted mb-1">Calories Burned</p>
              <h3 className="text-2xl font-bold text-text-light">{totalCalories}</h3>
            </div>
            <div className="p-2 rounded-full bg-primary/20">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>
        
        <div className="glass-card p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-text-muted mb-1">Current Streak</p>
              <h3 className="text-2xl font-bold text-text-light">3 days</h3>
            </div>
            <div className="p-2 rounded-full bg-primary/20">
              <Award className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Workout Plan Section */}
      <div className="mb-8 animate-slide-in" style={{ animationDelay: "0.1s" }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-text-light">Today's Plan</h2>
          <button 
            className="text-primary flex items-center gap-1"
            onClick={() => navigate("/workout-ai")}
          >
            <span>View All</span>
            <ChevronRight size={16} />
          </button>
        </div>
        
        {workouts.length > 0 ? (
          <div className="glass-card p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center mb-2">
                  <Calendar className="mr-2 h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-text-light">
                    {workouts[0].title}
                  </h3>
                </div>
                <p className="text-text-muted mb-4">
                  {workouts[0].exercises.length} exercises · {workouts[0].duration} minutes · {workouts[0].intensity} intensity
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {workouts[0].exercises.slice(0, 4).map((exercise, index) => (
                    <span key={index} className="px-3 py-1 text-xs rounded-full bg-white/10 text-text-light">
                      {exercise.name}
                    </span>
                  ))}
                </div>
              </div>
              
              <button 
                className="btn-primary whitespace-nowrap"
                onClick={handleStartWorkout}
              >
                Start Workout
              </button>
            </div>
          </div>
        ) : (
          <div className="glass-card p-8 text-center">
            <p className="text-text-muted mb-4">No workout planned for today.</p>
            <button 
              className="btn-primary"
              onClick={() => navigate("/workout-ai")}
            >
              Create Workout Plan
            </button>
          </div>
        )}
      </div>

      {/* Recent Workouts */}
      <div className="mb-8 animate-slide-in" style={{ animationDelay: "0.2s" }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-text-light">Recent Workouts</h2>
          <button 
            className="text-primary flex items-center gap-1"
            onClick={() => navigate("/profile")}
          >
            <span>View All</span>
            <ChevronRight size={16} />
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : recentWorkouts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentWorkouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                title={workout.title}
                type={workout.type}
                duration={workout.duration}
                calories={workout.calories}
                date={workout.date}
                intensity={workout.intensity}
                onClick={() => handleWorkoutClick(workout)}
              />
            ))}
          </div>
        ) : (
          <div className="glass-card p-8 text-center">
            <p className="text-text-muted mb-4">No workout history found.</p>
            <button 
              className="btn-primary"
              onClick={() => navigate("/workout-ai")}
            >
              Start Your First Workout
            </button>
          </div>
        )}
      </div>

      {/* Jogging Progress */}
      <div className="animate-slide-in" style={{ animationDelay: "0.3s" }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-text-light">Jogging Progress</h2>
          <span className="text-text-muted text-sm">Last 7 days</span>
        </div>
        
        <div className="glass-card p-5">
          <div className="grid grid-cols-7 gap-3 mb-4">
            {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-xs text-text-muted mb-2">{day}</span>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-full h-20 relative rounded-t-sm ${
                      [2, 4, 5].includes(i) ? "bg-primary" : "bg-white/10"
                    }`}
                    style={{
                      height: `${[0, 30, 60, 0, 45, 80, 0][i]}px`,
                    }}
                  ></div>
                  <span className="text-xs text-text-muted mt-1">
                    {[0, 1.2, 3.5, 0, 2.4, 5.1, 0][i]} km
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t border-white/10">
            <div>
              <p className="text-text-muted">Total Distance</p>
              <p className="text-xl font-bold text-text-light">12.2 km</p>
            </div>
            <div>
              <p className="text-text-muted">Avg. Pace</p>
              <p className="text-xl font-bold text-text-light">5:42 /km</p>
            </div>
            <div>
              <p className="text-text-muted">Calories</p>
              <p className="text-xl font-bold text-text-light">765</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
