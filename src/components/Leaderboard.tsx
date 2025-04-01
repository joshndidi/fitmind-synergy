import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Trophy, 
  Medal, 
  Target, 
  Dumbbell,
  Flame,
  Users,
  Star,
  TrendingUp,
  Calendar
} from "lucide-react";

interface LeaderboardEntry {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  score: number;
  rank: number;
  category: "workouts" | "strength" | "streak" | "achievements";
  period: "daily" | "weekly" | "monthly" | "allTime";
}

const mockGlobalLeaderboard: LeaderboardEntry[] = [
  {
    id: "1",
    userId: "user1",
    userName: "John Doe",
    userAvatar: "https://github.com/shadcn.png",
    score: 2500,
    rank: 1,
    category: "workouts",
    period: "weekly"
  },
  {
    id: "2",
    userId: "user2",
    userName: "Jane Smith",
    userAvatar: "https://github.com/shadcn.png",
    score: 2300,
    rank: 2,
    category: "workouts",
    period: "weekly"
  },
  {
    id: "3",
    userId: "user3",
    userName: "Mike Johnson",
    userAvatar: "https://github.com/shadcn.png",
    score: 2100,
    rank: 3,
    category: "workouts",
    period: "weekly"
  }
];

const mockFriendLeaderboard: LeaderboardEntry[] = [
  {
    id: "1",
    userId: "user1",
    userName: "John Doe",
    userAvatar: "https://github.com/shadcn.png",
    score: 2500,
    rank: 1,
    category: "workouts",
    period: "weekly"
  },
  {
    id: "2",
    userId: "user2",
    userName: "Jane Smith",
    userAvatar: "https://github.com/shadcn.png",
    score: 2300,
    rank: 2,
    category: "workouts",
    period: "weekly"
  }
];

const categories = [
  { id: "workouts", name: "Workouts", icon: <Dumbbell className="w-5 h-5" /> },
  { id: "strength", name: "Strength", icon: <Flame className="w-5 h-5" /> },
  { id: "streak", name: "Streak", icon: <Target className="w-5 h-5" /> },
  { id: "achievements", name: "Achievements", icon: <Medal className="w-5 h-5" /> }
];

const periods = [
  { id: "daily", name: "Daily", icon: <Calendar className="w-5 h-5" /> },
  { id: "weekly", name: "Weekly", icon: <Calendar className="w-5 h-5" /> },
  { id: "monthly", name: "Monthly", icon: <Calendar className="w-5 h-5" /> },
  { id: "allTime", name: "All Time", icon: <TrendingUp className="w-5 h-5" /> }
];

export function Leaderboard() {
  const [selectedCategory, setSelectedCategory] = useState("workouts");
  const [selectedPeriod, setSelectedPeriod] = useState("weekly");
  const [selectedView, setSelectedView] = useState<"global" | "friends">("global");

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-yellow-500";
      case 2:
        return "text-gray-400";
      case 3:
        return "text-amber-700";
      default:
        return "text-muted-foreground";
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-700" />;
      default:
        return <Star className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const currentLeaderboard = selectedView === "global" ? mockGlobalLeaderboard : mockFriendLeaderboard;

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <div className="flex gap-2">
          <Button
            variant={selectedView === "global" ? "default" : "outline"}
            onClick={() => setSelectedView("global")}
          >
            <Users className="w-4 h-4 mr-2" />
            Global
          </Button>
          <Button
            variant={selectedView === "friends" ? "default" : "outline"}
            onClick={() => setSelectedView("friends")}
          >
            <Star className="w-4 h-4 mr-2" />
            Friends
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {selectedView === "global" ? "Global" : "Friends"} Leaderboard
              </h2>
              <div className="flex gap-2">
                {periods.map((period) => (
                  <Button
                    key={period.id}
                    variant={selectedPeriod === period.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedPeriod(period.id)}
                  >
                    {period.icon}
                    <span className="ml-2">{period.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.icon}
                  <span className="ml-2">{category.name}</span>
                </Button>
              ))}
            </div>

            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {currentLeaderboard.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-4 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`text-xl font-bold ${getRankColor(entry.rank)}`}>
                        #{entry.rank}
                      </div>
                      <div className="flex items-center gap-3">
                        <img
                          src={entry.userAvatar}
                          alt={entry.userName}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-medium">{entry.userName}</p>
                          <p className="text-sm text-muted-foreground">
                            {entry.score} points
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getRankIcon(entry.rank)}
                      <Badge variant="secondary">
                        {entry.category}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Your Stats</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Current Rank</p>
                <p className="text-2xl font-bold">#15</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Points</p>
                <p className="text-2xl font-bold">1,850</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Weekly Streak</p>
                <p className="text-2xl font-bold">5 days</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Weekly Challenges</h2>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-medium">Most Workouts</h3>
                <p className="text-sm text-muted-foreground">
                  Complete the most workouts this week
                </p>
                <div className="mt-2">
                  <Badge variant="secondary">Active</Badge>
                </div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-medium">Strength Challenge</h3>
                <p className="text-sm text-muted-foreground">
                  Set new personal records
                </p>
                <div className="mt-2">
                  <Badge variant="secondary">Active</Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 