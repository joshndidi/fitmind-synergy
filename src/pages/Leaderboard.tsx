
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Search, MapPin } from "lucide-react";
import LeaderboardFilters from "../components/LeaderboardFilters";
import { useAuth } from "../context/AuthContext";

// Mock leaderboard data
const leaderboardData = [
  { id: 1, name: "Alex Johnson", location: "London, UK", totalWeight: 24500, workouts: 32, avatar: null },
  { id: 2, name: "Maria Garcia", location: "Madrid, Spain", totalWeight: 22800, workouts: 28, avatar: null },
  { id: 3, name: "David Kim", location: "Seoul, South Korea", totalWeight: 21200, workouts: 30, avatar: null },
  { id: 4, name: "Sarah Williams", location: "New York, USA", totalWeight: 19800, workouts: 25, avatar: null },
  { id: 5, name: "Mohammed Al-Fayez", location: "Dubai, UAE", totalWeight: 18500, workouts: 27, avatar: null },
  { id: 6, name: "Elena Petrova", location: "Moscow, Russia", totalWeight: 17900, workouts: 23, avatar: null },
  { id: 7, name: "Carlos Mendoza", location: "Mexico City, Mexico", totalWeight: 17200, workouts: 24, avatar: null },
  { id: 8, name: "Tiffany Chen", location: "Singapore", totalWeight: 16800, workouts: 22, avatar: null },
  { id: 9, name: "James Wilson", location: "Sydney, Australia", totalWeight: 16500, workouts: 21, avatar: null },
  { id: 10, name: "Fatima Nkosi", location: "Cape Town, South Africa", totalWeight: 16200, workouts: 20, avatar: null },
];

const Leaderboard = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentFilter, setCurrentFilter] = useState<"global" | "continent" | "country" | "region" | "city" | "nearby">("global");
  
  // Filter leaderboard data based on search term
  const filteredData = leaderboardData.filter(entry => 
    entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get user's position in leaderboard (mock data)
  const userPosition = 42;
  const userTotalWeight = 8750;
  
  // Get top 3 for highlight
  const topThree = leaderboardData.slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8 text-text-light">Leaderboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
        {/* Top 3 Cards */}
        {topThree.map((entry, index) => (
          <Card key={entry.id} className={`glass-card ${index === 0 ? 'lg:col-span-2' : ''}`}>
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`h-16 w-16 rounded-full flex items-center justify-center text-2xl font-bold 
                ${index === 0 ? 'bg-yellow-500/20 text-yellow-500' : 
                  index === 1 ? 'bg-gray-400/20 text-gray-400' : 
                  'bg-amber-700/20 text-amber-700'}`}
              >
                {index === 0 ? (
                  <Trophy className="h-8 w-8" />
                ) : (
                  <Medal className="h-8 w-8" />
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold text-text-light text-lg">{entry.name}</h3>
                <div className="flex items-center gap-1 text-text-muted text-sm">
                  <MapPin className="h-3 w-3" /> {entry.location}
                </div>
                <div className="mt-2">
                  <span className="text-primary font-bold">{entry.totalWeight.toLocaleString()} kg</span>
                  <span className="text-text-muted text-sm ml-2">({entry.workouts} workouts)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Leaderboard filters & search */}
      <div className="glass-card p-6 mb-8">
        <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
          <LeaderboardFilters 
            currentFilter={currentFilter} 
            onFilterChange={setCurrentFilter} 
          />
          
          <div className="flex items-center glass-card px-3 py-2 max-w-md w-full lg:w-auto">
            <Search className="h-5 w-5 text-text-muted mr-2" />
            <input
              type="text"
              placeholder="Search users or locations..."
              className="bg-transparent border-none flex-1 text-text-light focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* User's position */}
        <div className="glass-card p-4 flex items-center gap-4 mb-6 border border-primary/30">
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {userPosition}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center">
              <h3 className="font-bold text-text-light">
                {user?.displayName || user?.email?.split('@')[0] || "You"}
              </h3>
              <span className="ml-2 px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full">You</span>
            </div>
            <div className="text-text-muted text-sm">Your current position</div>
          </div>
          
          <div className="text-right">
            <p className="text-primary font-bold">{userTotalWeight.toLocaleString()} kg</p>
            <p className="text-text-muted text-sm">17 workouts</p>
          </div>
        </div>
        
        {/* Full leaderboard table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-text-muted border-b border-white/10">
                <th className="py-3 px-4 text-left">Rank</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Location</th>
                <th className="py-3 px-4 text-right">Total Weight</th>
                <th className="py-3 px-4 text-right">Workouts</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((entry, index) => (
                <tr key={entry.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <span className="font-bold text-text-light">{index + 1}</span>
                      {index < 3 && (
                        <span className="ml-2">
                          {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 font-medium text-text-light">{entry.name}</td>
                  <td className="py-4 px-4 text-text-muted">{entry.location}</td>
                  <td className="py-4 px-4 text-right font-bold text-primary">{entry.totalWeight.toLocaleString()} kg</td>
                  <td className="py-4 px-4 text-right text-text-muted">{entry.workouts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredData.length === 0 && (
          <div className="text-center py-8">
            <p className="text-text-muted">No results found for "{searchTerm}"</p>
          </div>
        )}
      </div>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-text-light">How Rankings Work</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-text-muted mb-6">
            The leaderboard rankings are calculated based on the total weight lifted across all your workouts.
            This is calculated by multiplying the weight by the number of reps for each exercise.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-4">
              <h3 className="font-medium text-text-light mb-2">Weight x Reps</h3>
              <p className="text-text-muted text-sm">Each exercise's total is calculated by multiplying the weight by the number of reps completed.</p>
            </div>
            
            <div className="glass-card p-4">
              <h3 className="font-medium text-text-light mb-2">Regular Updates</h3>
              <p className="text-text-muted text-sm">Leaderboards are updated in real-time as users complete and log their workouts.</p>
            </div>
            
            <div className="glass-card p-4">
              <h3 className="font-medium text-text-light mb-2">Location Based</h3>
              <p className="text-text-muted text-sm">Filter by location to see how you rank globally or against people in your area.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboard;
