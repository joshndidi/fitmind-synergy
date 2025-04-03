
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthForm from "../components/AuthForm";
import { Dumbbell, Brain } from "lucide-react";

const Index = () => {
  const [authType, setAuthType] = useState<"login" | "signup">("login");
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
    
    // Simulate loading for smooth animation only if not actually loading auth
    if (!loading) {
      setTimeout(() => {
        setLoaded(true);
      }, 100);
    }
  }, [user, navigate, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8 sm:py-12">
      <div className={`w-full max-w-4xl mx-auto transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
          {/* Left side - App info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4 md:mb-6">
              <Dumbbell className="h-8 w-8 md:h-10 md:w-10 text-primary" />
              <span className="font-bold text-2xl md:text-3xl text-text-light">FitMind</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 md:mb-6 text-gradient">
              Fitness meets mindfulness
            </h1>
            
            <p className="text-text-muted mb-6 md:mb-8 text-base md:text-lg">
              Transform your body and mind with our AI-powered workouts,
              nutrition tracking, and mental wellness tools.
            </p>
            
            <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
              <div className="flex items-center gap-3 glass-card p-3">
                <div className="bg-primary/20 p-2 rounded-full shrink-0">
                  <Dumbbell className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-text-light">Smart Workouts</h3>
                  <p className="text-text-muted text-sm">AI-generated plans tailored to your goals</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 glass-card p-3">
                <div className="bg-primary/20 p-2 rounded-full shrink-0">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-text-light">Mental Wellness</h3>
                  <p className="text-text-muted text-sm">Relaxation and focus with guided sessions</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Auth form */}
          <div className="flex-1">
            <div className="bg-black/30 backdrop-blur-xl p-3 rounded-2xl border border-white/5 mb-4 md:mb-6">
              <div className="flex">
                <button
                  className={`flex-1 py-2 md:py-3 rounded-lg font-medium transition-colors ${
                    authType === "login"
                      ? "bg-primary text-white"
                      : "text-text-muted hover:text-text-light"
                  }`}
                  onClick={() => setAuthType("login")}
                >
                  Sign In
                </button>
                <button
                  className={`flex-1 py-2 md:py-3 rounded-lg font-medium transition-colors ${
                    authType === "signup"
                      ? "bg-primary text-white"
                      : "text-text-muted hover:text-text-light"
                  }`}
                  onClick={() => setAuthType("signup")}
                >
                  Create Account
                </button>
              </div>
            </div>
            
            <AuthForm type={authType} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
