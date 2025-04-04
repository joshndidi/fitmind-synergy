
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { SubscriptionProvider } from "@/context/SubscriptionContext";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import WorkoutSelection from "@/pages/WorkoutSelection";
import WorkoutCreation from "@/pages/WorkoutCreation";
import WorkoutDisplay from "@/pages/WorkoutDisplay";
import WorkoutAI from "@/pages/WorkoutAI";
import CalorieTracker from "@/pages/CalorieTracker";
import Social from "@/pages/Social";
import Achievements from "@/pages/Achievements";
import Leaderboard from "@/pages/Leaderboard";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Subscription from "@/pages/Subscription";
import { WorkoutTemplates } from "@/pages/WorkoutTemplates";
import NotFound from "@/pages/NotFound";
import { WorkoutPlans } from "@/pages/WorkoutPlans";
import { WorkoutExecutionPage } from "@/pages/WorkoutExecutionPage";
import { WorkoutStatsPage } from "@/pages/WorkoutStatsPage";
import NutritionPage from "@/pages/nutrition";
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import CreateCustomWorkout from "@/pages/CreateCustomWorkout";

const queryClient = new QueryClient();

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/" />;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={!user ? <Index /> : <Navigate to="/dashboard" />} />
      
      <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/workouts" element={<WorkoutSelection />} />
        <Route path="/workout/:id" element={<WorkoutExecutionPage />} />
        <Route path="/exercises" element={<WorkoutCreation />} />
        <Route path="/create-workout" element={<CreateCustomWorkout />} />
        <Route path="/calories" element={<CalorieTracker />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/social" element={<Social />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/workout-templates" element={<WorkoutTemplates />} />
        <Route path="/workout-plans" element={<WorkoutPlans />} />
        <Route path="/workout-stats" element={<WorkoutStatsPage />} />
        
        {/* Protected AI Features */}
        <Route
          path="/nutrition"
          element={
            <ProtectedRoute>
              <NutritionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workout-ai"
          element={
            <ProtectedRoute>
              <WorkoutAI />
            </ProtectedRoute>
          }
        />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SubscriptionProvider>
          <Router>
            <TooltipProvider>
              <div className="min-h-screen bg-gradient-dark">
                <AppRoutes />
                <Toaster />
              </div>
            </TooltipProvider>
          </Router>
        </SubscriptionProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
