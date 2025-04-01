import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { SubscriptionProvider, useSubscription } from "@/context/SubscriptionContext";
import NavBar from "@/components/NavBar";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import WorkoutSelection from "@/pages/WorkoutSelection";
import WorkoutCreation from "@/pages/WorkoutCreation";
import WorkoutEdit from "@/pages/WorkoutEdit";
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

const queryClient = new QueryClient();

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      {user ? (
        <>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workouts" element={<WorkoutSelection />} />
          <Route path="/workout/:id" element={<WorkoutExecutionPage />} />
          <Route path="/exercises" element={<WorkoutCreation />} />
          <Route path="/calories" element={<CalorieTracker />} />
          <Route path="/subscription" element={<Subscription />} />
          
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
        </>
      ) : (
        <Route path="*" element={<Navigate to="/" replace />} />
      )}
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
                <NavBar />
                <main className="container mx-auto px-4 py-8 pt-20">
                  <div className="glass-card p-6 rounded-2xl">
                    <AppRoutes />
                  </div>
                </main>
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
