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

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

function SubscriptionRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { isActive } = useSubscription();
  
  if (!user) {
    return <Navigate to="/" />;
  }
  
  if (!isActive) {
    return <Navigate to="/subscription" />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/workouts" element={
        <ProtectedRoute>
          <WorkoutSelection />
        </ProtectedRoute>
      } />
      
      <Route path="/workout-ai" element={
        <SubscriptionRoute>
          <WorkoutAI />
        </SubscriptionRoute>
      } />
      
      <Route path="/calories" element={
        <ProtectedRoute>
          <CalorieTracker />
        </ProtectedRoute>
      } />
      
      <Route path="/social" element={
        <ProtectedRoute>
          <Social />
        </ProtectedRoute>
      } />
      
      <Route path="/achievements" element={
        <ProtectedRoute>
          <Achievements />
        </ProtectedRoute>
      } />
      
      <Route path="/leaderboard" element={
        <ProtectedRoute>
          <Leaderboard />
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
      
      <Route path="/subscription" element={
        <ProtectedRoute>
          <Subscription />
        </ProtectedRoute>
      } />
      
      <Route path="/workout-templates" element={
        <ProtectedRoute>
          <WorkoutTemplates />
        </ProtectedRoute>
      } />
      
      <Route path="/workout-plans" element={
        <ProtectedRoute>
          <WorkoutPlans />
        </ProtectedRoute>
      } />
      
      <Route path="/workout-execution/:id" element={
        <ProtectedRoute>
          <WorkoutExecutionPage />
        </ProtectedRoute>
      } />
      
      <Route path="/workout-stats/:id" element={
        <ProtectedRoute>
          <WorkoutStatsPage />
        </ProtectedRoute>
      } />
      
      {/* Catch all route */}
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
