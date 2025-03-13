
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SubscriptionProvider } from "./context/SubscriptionContext";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import WorkoutAI from "./pages/WorkoutAI";
import CalorieTracker from "./pages/CalorieTracker";
import Profile from "./pages/Profile";
import WorkoutDisplay from "./pages/WorkoutDisplay";
import Subscription from "./pages/Subscription";
import QuietTime from "./pages/QuietTime";
import Social from "./pages/Social";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import SubscriptionRoute from "./components/SubscriptionRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SubscriptionProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/workout-ai" element={
                  <SubscriptionRoute>
                    <WorkoutAI />
                  </SubscriptionRoute>
                } />
                <Route path="/calorie-tracker" element={
                  <SubscriptionRoute>
                    <CalorieTracker />
                  </SubscriptionRoute>
                } />
                <Route path="/profile" element={<Profile />} />
                <Route path="/workout-display/:id" element={<WorkoutDisplay />} />
                <Route path="/subscription" element={<Subscription />} />
                <Route path="/quiet-time" element={<QuietTime />} />
                <Route path="/social" element={<Social />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SubscriptionProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
