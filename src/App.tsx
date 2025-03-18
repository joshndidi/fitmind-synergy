import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SubscriptionProvider } from "./context/SubscriptionContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import WorkoutSelection from "./pages/WorkoutSelection";
import WorkoutDisplay from "./pages/WorkoutDisplay";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";
import QuietTime from "./pages/QuietTime";
import Achievements from "./pages/Achievements";
import Payments from "./pages/Payments";
import WorkoutAI from "./pages/WorkoutAI";

function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/workout-selection" element={<ProtectedRoute><WorkoutSelection /></ProtectedRoute>} />
            <Route path="/workout-display/:id" element={<ProtectedRoute><WorkoutDisplay /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
            <Route path="/quiet-time" element={<ProtectedRoute><QuietTime /></ProtectedRoute>} />
            <Route path="/achievements" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/workout-ai" element={<ProtectedRoute><WorkoutAI /></ProtectedRoute>} />
          </Routes>
        </Router>
      </SubscriptionProvider>
    </AuthProvider>
  );
}

export default App;
