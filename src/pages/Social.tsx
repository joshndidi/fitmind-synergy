import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Comments } from "@/components/Comments";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal, 
  Flag,
  Search,
  Filter,
  Plus
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  comments: Comment[];
  workout?: {
    name: string;
    duration: string;
    exercises: string[];
  };
  achievement?: {
    name: string;
    description: string;
    icon: string;
  };
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
}

interface FitnessUser {
  id: string;
  name: string;
  avatar: string;
  followers: number;
  isFollowing: boolean;
  achievements: number;
  workouts: number;
}

export default function Social() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<FitnessUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());

  // Mock data - replace with actual API calls
  useState(() => {
    const mockPosts: Post[] = [
      {
        id: "1",
        userId: "user1",
        userName: "John Doe",
        userAvatar: "https://github.com/shadcn.png",
        content: "Just completed my morning workout! 💪",
        timestamp: new Date().toISOString(),
        likes: 42,
        isLiked: false,
        comments: [],
        workout: {
          name: "Morning Strength",
          duration: "45 min",
          exercises: ["Bench Press", "Squats", "Deadlifts"],
        },
      },
      {
        id: "2",
        userId: "user2",
        userName: "Jane Smith",
        userAvatar: "https://github.com/shadcn.png",
        content: "New personal record! 🎉",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        likes: 28,
        isLiked: false,
        comments: [],
        achievement: {
          name: "Weight Master",
          description: "Lifted 100kg for the first time",
          icon: "🏋️‍♂️",
        },
      },
    ];

    const mockUsers: FitnessUser[] = [
      {
        id: "user1",
        name: "John Doe",
        avatar: "https://github.com/shadcn.png",
        followers: 1234,
        isFollowing: false,
        achievements: 15,
        workouts: 45,
      },
      {
        id: "user2",
        name: "Jane Smith",
        avatar: "https://github.com/shadcn.png",
        followers: 856,
        isFollowing: true,
        achievements: 12,
        workouts: 38,
      },
    ];

    setPosts(mockPosts);
    setUsers(mockUsers);
  });

  const handleLikePost = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
        : post
    ));
  };

  const handleAddComment = async (postId: string, content: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      userId: "currentUser",
      userName: "You",
      userAvatar: "https://github.com/shadcn.png",
      content,
      timestamp: new Date().toISOString(),
      likes: 0,
      isLiked: false,
    };

    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, comments: [...post.comments, newComment] }
        : post
    ));
  };

  const handleLikeComment = (postId: string, commentId: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? {
            ...post,
            comments: post.comments.map(comment =>
              comment.id === commentId
                ? {
                    ...comment,
                    likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
                    isLiked: !comment.isLiked,
                  }
                : comment
            ),
          }
        : post
    ));
  };

  const handleDeleteComment = (postId: string, commentId: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? {
            ...post,
            comments: post.comments.filter(comment => comment.id !== commentId),
          }
        : post
    ));
  };

  const handleReportComment = (postId: string, commentId: string) => {
    // Implement report functionality
    console.log("Reported comment:", commentId, "from post:", postId);
  };

  const handleSharePost = (postId: string) => {
    // Implement share functionality
    console.log("Sharing post:", postId);
  };

  const handleReportPost = (postId: string) => {
    // Implement report functionality
    console.log("Reported post:", postId);
  };

  const handleFollowUser = (userId: string) => {
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, isFollowing: !user.isFollowing }
        : user
    ));
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return "just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Social Feed</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Post
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="feed" className="w-full">
            <TabsList>
              <TabsTrigger value="feed">Feed</TabsTrigger>
              <TabsTrigger value="discover">Discover</TabsTrigger>
            </TabsList>

            <TabsContent value="feed" className="space-y-6">
              {posts.map((post) => (
                <Card key={post.id} className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <img src={post.userAvatar} alt={post.userName} />
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{post.userName}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatTimestamp(post.timestamp)}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleReportPost(post.id)}>
                              <Flag className="h-4 w-4 mr-2" />
                              Report
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <p className="mt-2">{post.content}</p>

                      {post.workout && (
                        <Card className="mt-4 p-4 bg-muted">
                          <h4 className="font-medium">{post.workout.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Duration: {post.workout.duration}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {post.workout.exercises.map((exercise, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-background rounded-full text-sm"
                              >
                                {exercise}
                              </span>
                            ))}
                          </div>
                        </Card>
                      )}

                      {post.achievement && (
                        <Card className="mt-4 p-4 bg-muted">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{post.achievement.icon}</span>
                            <div>
                              <h4 className="font-medium">{post.achievement.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {post.achievement.description}
                              </p>
                            </div>
                          </div>
                        </Card>
                      )}

                      <div className="flex items-center gap-4 mt-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={post.isLiked ? "text-red-500" : ""}
                          onClick={() => handleLikePost(post.id)}
                        >
                          <Heart className="h-4 w-4 mr-1" />
                          {post.likes}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedPosts(prev => {
                            const newSet = new Set(prev);
                            if (newSet.has(post.id)) {
                              newSet.delete(post.id);
                            } else {
                              newSet.add(post.id);
                            }
                            return newSet;
                          })}
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {post.comments.length}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSharePost(post.id)}
                        >
                          <Share2 className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                      </div>

                      {expandedPosts.has(post.id) && (
                        <div className="mt-4">
                          <Comments
                            postId={post.id}
                            comments={post.comments}
                            onAddComment={(content) => handleAddComment(post.id, content)}
                            onLikeComment={(commentId) => handleLikeComment(post.id, commentId)}
                            onDeleteComment={(commentId) => handleDeleteComment(post.id, commentId)}
                            onReportComment={(commentId) => handleReportComment(post.id, commentId)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="discover">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>

                {filteredUsers.map((user) => (
                  <Card key={user.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <img src={user.avatar} alt={user.name} />
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.followers} followers • {user.achievements} achievements • {user.workouts} workouts
                          </p>
                        </div>
                      </div>
                      <Button
                        variant={user.isFollowing ? "outline" : "default"}
                        onClick={() => handleFollowUser(user.id)}
                      >
                        {user.isFollowing ? "Following" : "Follow"}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Top Users</h2>
            <div className="space-y-4">
              {users.slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-center gap-3">
                  <Avatar>
                    <img src={user.avatar} alt={user.name} />
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.followers} followers
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
