
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Search, MapPin, Users, ChevronDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import LeaderboardFilters from "../components/LeaderboardFilters";
import { useAuth } from "../context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useWorkout } from "@/hooks/useWorkout";
import { toast } from "sonner";
import LocationProfileForm from "@/components/LocationProfileForm";
import { getUserDisplayName } from "@/components/UserProfileUtils";

// Define leaderboard entry type
type LeaderboardEntry = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  country: string | null;
  province: string | null;
  total_weight: number;
  workout_count: number;
};

const Leaderboard = () => {
  const { user } = useAuth();
  const { totalWeightLifted } = useWorkout();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentFilter, setCurrentFilter] = useState<"global" | "continent" | "country" | "region" | "city" | "nearby">("global");
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const itemsPerPage = 10;

  // Load leaderboard data
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from("leaderboard_data")
          .select("*");
        
        // Apply location filters
        if (currentFilter === "country" && userProfile?.country) {
          query = query.eq("country", userProfile.country);
        } else if (currentFilter === "region" && userProfile?.province) {
          query = query
            .eq("country", userProfile.country)
            .eq("province", userProfile.province);
        }
        
        // Apply search filter
        if (searchTerm) {
          query = query.or(`display_name.ilike.%${searchTerm}%,country.ilike.%${searchTerm}%,province.ilike.%${searchTerm}%`);
        }
        
        // Fetch total count for pagination
        const { count } = await query.count();
        
        // Fetch paginated data
        const { data, error } = await query
          .order("total_weight", { ascending: false })
          .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);
        
        if (error) throw error;
        
        if (count) {
          setTotalPages(Math.ceil(count / itemsPerPage));
        }
        
        setLeaderboardData(data || []);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
        toast.error("Failed to load leaderboard data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboardData();
  }, [currentFilter, searchTerm, userProfile, currentPage, refreshTrigger]);
  
  // Load user's profile and location
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        
        if (error) throw error;
        
        setUserProfile(data);
        
        // If no country is set, prompt user to set location
        if (!data.country && user && !locationDialogOpen) {
          setLocationDialogOpen(true);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    
    fetchUserProfile();
  }, [user, refreshTrigger]);
  
  // Get user's position in leaderboard
  const getUserRank = () => {
    if (!user || leaderboardData.length === 0) return null;
    
    const index = leaderboardData.findIndex(entry => entry.id === user.id);
    if (index >= 0) {
      return index + 1 + (currentPage - 1) * itemsPerPage;
    }
    
    return null;
  };
  
  // Filter leaderboard data based on search term
  const filteredData = leaderboardData.filter(entry => 
    (entry.display_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (entry.country || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (entry.province || "").toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get top 3 for highlight
  const topThree = leaderboardData.slice(0, 3);

  const handleLocationUpdated = () => {
    setLocationDialogOpen(false);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8 text-text-light">Leaderboard</h1>
      
      <Dialog open={locationDialogOpen} onOpenChange={setLocationDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Set Your Location</DialogTitle>
            <DialogDescription>
              Please set your location to view region-specific leaderboards
            </DialogDescription>
          </DialogHeader>
          <LocationProfileForm onSuccess={handleLocationUpdated} />
        </DialogContent>
      </Dialog>
      
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
                <h3 className="font-bold text-text-light text-lg">{entry.display_name || "Anonymous"}</h3>
                {entry.country && (
                  <div className="flex items-center gap-1 text-text-muted text-sm">
                    <MapPin className="h-3 w-3" /> 
                    {entry.province ? `${entry.province}, ${entry.country}` : entry.country}
                  </div>
                )}
                <div className="mt-2">
                  <span className="text-primary font-bold">{entry.total_weight.toLocaleString()} kg</span>
                  <span className="text-text-muted text-sm ml-2">({entry.workout_count} workouts)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Location profile update button */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-text-light">
              <MapPin className="h-5 w-5" />
              Your Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userProfile?.country ? (
              <div className="mb-4">
                <p className="text-text-light font-medium">
                  {userProfile.province ? `${userProfile.province}, ${userProfile.country}` : userProfile.country}
                </p>
              </div>
            ) : (
              <p className="text-text-muted mb-4">No location set</p>
            )}
            <DialogTrigger asChild>
              <Button 
                onClick={() => setLocationDialogOpen(true)}
                variant="outline"
                className="w-full"
              >
                {userProfile?.country ? "Update Location" : "Set Location"}
              </Button>
            </DialogTrigger>
          </CardContent>
        </Card>
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
        {user && (
          <div className="glass-card p-4 flex items-center gap-4 mb-6 border border-primary/30">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {getUserRank() || "?"}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center">
                <h3 className="font-bold text-text-light">
                  {getUserDisplayName(user)}
                </h3>
                <span className="ml-2 px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full">You</span>
              </div>
              <div className="text-text-muted text-sm">Your current position</div>
            </div>
            
            <div className="text-right">
              <p className="text-primary font-bold">{totalWeightLifted.toLocaleString()} kg</p>
              <p className="text-text-muted text-sm">
                {userProfile?.country || (
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-sm text-primary"
                    onClick={() => setLocationDialogOpen(true)}
                  >
                    Set location
                  </Button>
                )}
              </p>
            </div>
          </div>
        )}
        
        {/* Location filter info */}
        <div className="mb-4 flex items-center gap-2">
          <Users className="h-4 w-4 text-text-muted" />
          <span className="text-text-muted">
            {currentFilter === "global" ? "Global Rankings" : 
             currentFilter === "country" && userProfile?.country ? `Rankings for ${userProfile.country}` :
             currentFilter === "region" && userProfile?.province ? `Rankings for ${userProfile.province}, ${userProfile.country}` :
             "Select a filter"}
          </span>
          
          {!userProfile?.country && currentFilter !== "global" && (
            <Button 
              variant="link" 
              className="text-primary text-sm p-0 h-auto"
              onClick={() => setLocationDialogOpen(true)}
            >
              Set your location
            </Button>
          )}
        </div>
        
        {/* Full leaderboard table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="text-text-muted border-b border-white/10">
                <TableHead className="py-3 px-4 text-left">Rank</TableHead>
                <TableHead className="py-3 px-4 text-left">Name</TableHead>
                <TableHead className="py-3 px-4 text-left">Location</TableHead>
                <TableHead className="py-3 px-4 text-right">Total Weight</TableHead>
                <TableHead className="py-3 px-4 text-right">Workouts</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-text-muted">
                    Loading leaderboard data...
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-text-muted">
                    {searchTerm 
                      ? `No results found for "${searchTerm}"` 
                      : "No leaderboard data available for this filter"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((entry, index) => {
                  const rank = (currentPage - 1) * itemsPerPage + index + 1;
                  const isCurrentUser = user && entry.id === user.id;
                  
                  return (
                    <TableRow 
                      key={entry.id} 
                      className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                        isCurrentUser ? 'bg-primary/5' : ''
                      }`}
                    >
                      <TableCell className="py-4 px-4">
                        <div className="flex items-center">
                          <span className="font-bold text-text-light">{rank}</span>
                          {rank <= 3 && (
                            <span className="ml-2">
                              {rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}
                            </span>
                          )}
                          {isCurrentUser && (
                            <span className="ml-2 px-1.5 py-0.5 bg-primary/20 text-primary text-xs rounded-full">
                              You
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-4 font-medium text-text-light">
                        {entry.display_name || "Anonymous"}
                      </TableCell>
                      <TableCell className="py-4 px-4 text-text-muted">
                        {entry.country ? (
                          entry.province ? `${entry.province}, ${entry.country}` : entry.country
                        ) : (
                          <span className="text-text-muted/50">Not specified</span>
                        )}
                      </TableCell>
                      <TableCell className="py-4 px-4 text-right font-bold text-primary">
                        {entry.total_weight.toLocaleString()} kg
                      </TableCell>
                      <TableCell className="py-4 px-4 text-right text-text-muted">
                        {entry.workout_count}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                // Calculate which page numbers to show
                const pagesToShow = 5;
                const pageNumbers = [];
                
                if (totalPages <= pagesToShow) {
                  // If total pages is less than or equal to pagesToShow, show all pages
                  for (let i = 1; i <= totalPages; i++) {
                    pageNumbers.push(i);
                  }
                } else {
                  // Always show first page
                  pageNumbers.push(1);
                  
                  // Calculate middle pages
                  const middleStart = Math.max(2, currentPage - 1);
                  const middleEnd = Math.min(totalPages - 1, currentPage + 1);
                  
                  // Add ellipsis if needed
                  if (middleStart > 2) {
                    pageNumbers.push('...');
                  }
                  
                  // Add middle pages
                  for (let i = middleStart; i <= middleEnd; i++) {
                    pageNumbers.push(i);
                  }
                  
                  // Add ellipsis if needed
                  if (middleEnd < totalPages - 1) {
                    pageNumbers.push('...');
                  }
                  
                  // Always show last page
                  pageNumbers.push(totalPages);
                }
                
                // Only render for appropriate indices
                if (i < pageNumbers.length) {
                  const page = pageNumbers[i];
                  
                  // Handle ellipsis
                  if (page === '...') {
                    return (
                      <PaginationItem key={`ellipsis-${i}`}>
                        <span className="px-4 py-2">...</span>
                      </PaginationItem>
                    );
                  }
                  
                  // Handle regular page numbers
                  return (
                    <PaginationItem key={`page-${page}`}>
                      <PaginationLink
                        isActive={currentPage === page}
                        onClick={() => setCurrentPage(page as number)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                
                return null;
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
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
