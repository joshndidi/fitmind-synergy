
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import "./App.css";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";
import Profile from "./pages/Profile";
import WorkoutSelection from "./pages/WorkoutSelection";
import WorkoutDisplay from "./pages/WorkoutDisplay";
import WorkoutAI from "./pages/WorkoutAI";
import QuietTime from "./pages/QuietTime";
import Leaderboard from "./pages/Leaderboard";
import Social from "./pages/Social";
import CalorieTracker from "./pages/CalorieTracker";
import Subscription from "./pages/Subscription";
import Achievements from "./pages/Achievements";
import ProtectedRoute from "./components/ProtectedRoute";
import SubscriptionRoute from "./components/SubscriptionRoute";
import { AuthProvider } from "./context/AuthContext";
import { SubscriptionProvider } from "./context/SubscriptionContext";

function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/workout-selection" element={<WorkoutSelection />} />
              <Route path="/workout-display/:id" element={<WorkoutDisplay />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route 
                path="/workout-ai" 
                element={
                  <SubscriptionRoute>
                    <WorkoutAI />
                  </SubscriptionRoute>
                } 
              />
              <Route path="/quiet-time" element={<QuietTime />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/social" element={<Social />} />
              <Route path="/calories" element={<CalorieTracker />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          <Toaster position="top-right" />
        </Router>
      </SubscriptionProvider>
    </AuthProvider>
  );
}

export default App;
