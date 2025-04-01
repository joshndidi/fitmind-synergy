import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { SubscriptionProvider, useSubscription } from "@/context/SubscriptionContext";
import NavBar from "@/components/NavBar";
import Home from "@/pages/Home";
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

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/dashboard" />;
  return <>{children}</>;
}

function SubscriptionRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { isActive } = useSubscription();
  if (!user) return <Navigate to="/dashboard" />;
  if (!isActive) return <Navigate to="/subscription" />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/workouts" element={<ProtectedRoute><WorkoutPlans /></ProtectedRoute>} />
      <Route path="/templates" element={<ProtectedRoute><WorkoutTemplates /></ProtectedRoute>} />
      <Route path="/workouts/create" element={<ProtectedRoute><WorkoutCreation /></ProtectedRoute>} />
      <Route path="/workouts/:id/edit" element={<ProtectedRoute><WorkoutEdit /></ProtectedRoute>} />
      <Route path="/workout-display/:id" element={<ProtectedRoute><WorkoutDisplay /></ProtectedRoute>} />
      <Route path="/workout-ai" element={<SubscriptionRoute><WorkoutAI /></SubscriptionRoute>} />
      <Route path="/calories" element={<ProtectedRoute><CalorieTracker /></ProtectedRoute>} />
      <Route path="/social" element={<ProtectedRoute><Social /></ProtectedRoute>} />
      <Route path="/achievements" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />
      <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
      <Route path="/workouts/:id/execute" element={<ProtectedRoute><WorkoutExecutionPage /></ProtectedRoute>} />
      <Route path="/stats" element={<ProtectedRoute><WorkoutStatsPage /></ProtectedRoute>} />
      
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
              <div className="min-h-screen bg-background">
                <NavBar />
                <main className="container mx-auto py-8">
                  <AppRoutes />
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
