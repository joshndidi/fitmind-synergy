
import { useState } from "react";
import { Brain, Dumbbell, Clock, BarChart, Plus, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAI, WorkoutPlanInput } from "../hooks/useAI";
import { toast } from "sonner";

const WorkoutAI = () => {
  const [step, setStep] = useState(1);
  const [workoutPlan, setWorkoutPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { generateWorkoutPlan } = useAI();
  const navigate = useNavigate();
  
  // Form states
  const [formData, setFormData] = useState<WorkoutPlanInput>({
    days: 4,
    focus: "Strength",
    experience: "intermediate",
    equipment: "full",
    duration: 45,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "days" || name === "duration" ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const plan = await generateWorkoutPlan(formData);
      setWorkoutPlan(plan);
      setStep(2);
      toast.success("Workout plan generated successfully!");
    } catch (error) {
      toast.error("Failed to generate workout plan");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlan = () => {
    // In a real app, this would save the plan to a database
    toast.success("Workout plan saved to your account!");
    navigate("/dashboard");
  };

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-light mb-2">AI Workout Planner</h1>
        <p className="text-text-muted">Create personalized workout plans based on your goals and preferences</p>
      </div>

      {step === 1 ? (
        <div className="glass-card p-6 md:p-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-full bg-primary/20">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-text-light">Create Your Plan</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-text-light mb-2 font-medium">How many days can you train per week?</label>
              <input
                type="range"
                name="days"
                min="1"
                max="7"
                value={formData.days}
                onChange={handleInputChange}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between mt-1 text-text-muted text-sm">
                <span>1 day</span>
                <span>{formData.days} days</span>
                <span>7 days</span>
              </div>
            </div>
            
            <div>
              <label className="block text-text-light mb-2 font-medium">What's your primary focus?</label>
              <select
                name="focus"
                value={formData.focus}
                onChange={handleInputChange}
                className="input-field w-full"
              >
                <option value="Strength">Strength</option>
                <option value="Cardio">Cardio</option>
                <option value="Weight Loss">Weight Loss</option>
                <option value="Muscle Building">Muscle Building</option>
              </select>
            </div>
            
            <div>
              <label className="block text-text-light mb-2 font-medium">Experience Level</label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="input-field w-full"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            
            <div>
              <label className="block text-text-light mb-2 font-medium">Available Equipment</label>
              <select
                name="equipment"
                value={formData.equipment}
                onChange={handleInputChange}
                className="input-field w-full"
              >
                <option value="full">Full Gym</option>
                <option value="minimal">Minimal (Home Setup)</option>
                <option value="none">Bodyweight Only</option>
              </select>
            </div>
            
            <div>
              <label className="block text-text-light mb-2 font-medium">Workout Duration (minutes)</label>
              <input
                type="range"
                name="duration"
                min="15"
                max="90"
                step="5"
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between mt-1 text-text-muted text-sm">
                <span>15 min</span>
                <span>{formData.duration} min</span>
                <span>90 min</span>
              </div>
            </div>
            
            <button 
              type="submit" 
              className="btn-primary w-full flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></div>
                  <span>Generating Plan...</span>
                </>
              ) : (
                <>
                  <Brain size={18} />
                  <span>Generate Workout Plan</span>
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          <div className="glass-card p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-full bg-primary/20">
                <BarChart className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-text-light">Your AI Generated Plan</h2>
            </div>
            
            <p className="text-text-light mb-6">{workoutPlan?.overview}</p>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="bg-white/10 px-4 py-2 rounded-lg flex items-center gap-2">
                <Dumbbell size={18} className="text-primary" />
                <span className="text-text-light">{formData.focus}</span>
              </div>
              
              <div className="bg-white/10 px-4 py-2 rounded-lg flex items-center gap-2">
                <Clock size={18} className="text-primary" />
                <span className="text-text-light">{formData.duration} min</span>
              </div>
              
              <div className="bg-white/10 px-4 py-2 rounded-lg flex items-center gap-2">
                <Brain size={18} className="text-primary" />
                <span className="text-text-light capitalize">{formData.experience}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {workoutPlan?.workouts.map((workout: any, index: number) => (
                <div key={index} className="border border-white/10 rounded-lg p-4">
                  <h3 className="font-bold text-text-light mb-2">{workout.name}</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm text-text-muted mb-4">
                    <div>Duration: {workout.duration} min</div>
                    <div>Intensity: {workout.intensity}</div>
                  </div>
                  
                  <div className="space-y-3">
                    {workout.exercises.map((exercise: any, exIndex: number) => (
                      <div key={exIndex} className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                        <div>
                          <p className="text-text-light">{exercise.name}</p>
                          <p className="text-text-muted text-sm">
                            {exercise.sets} sets × {exercise.reps} reps
                          </p>
                        </div>
                        <span className="text-text-muted text-sm">{exercise.rest} rest</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                onClick={() => setStep(1)}
                className="btn-secondary flex-1 flex items-center justify-center gap-2"
              >
                <ArrowRight size={18} className="rotate-180" />
                <span>Adjust Plan</span>
              </button>
              
              <button
                onClick={handleSavePlan}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                <span>Save Plan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutAI;
