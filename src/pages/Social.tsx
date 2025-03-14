
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { MessageSquare, Heart, Share2, User, ImagePlus, Send } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

const Social = () => {
  const { user } = useAuth();
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: {
        name: "Sarah Thompson",
        avatar: null,
        username: "sarah_fitness"
      },
      content: "Just completed a 5K run in 22 minutes! Personal best 🏃‍♀️ #Running #PersonalRecord",
      image: "https://images.unsplash.com/photo-1486218119243-13883505764c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      timestamp: "2 hours ago",
      likes: 42,
      comments: 8,
      liked: false
    },
    {
      id: 2,
      user: {
        name: "Michael Chen",
        avatar: null,
        username: "mike_lifts"
      },
      content: "New deadlift PR! 315 lbs x 5 reps. The journey continues. #Strength #Deadlift #GymLife",
      image: null,
      timestamp: "5 hours ago",
      likes: 28,
      comments: 5,
      liked: true
    },
    {
      id: 3,
      user: {
        name: "Jasmine Rodriguez",
        avatar: null,
        username: "jas_wellness"
      },
      content: "Morning meditation session followed by smoothie bowl. Starting the day right with mindfulness and nutrition. #Wellness #Meditation",
      image: "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      timestamp: "Yesterday",
      likes: 36,
      comments: 4,
      liked: false
    }
  ]);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) {
      toast.error("Please enter something to post");
      return;
    }

    const newPostObj = {
      id: Date.now(),
      user: {
        name: user?.displayName || user?.email?.split('@')[0] || "User",
        avatar: user?.photoURL,
        username: user?.email?.split('@')[0] || "user"
      },
      content: newPost,
      image: null,
      timestamp: "Just now",
      likes: 0,
      comments: 0,
      liked: false
    };

    setPosts([newPostObj, ...posts]);
    setNewPost("");
    toast.success("Post shared successfully!");
  };

  const toggleLike = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const shareProgress = () => {
    toast.success("Your progress has been shared with your followers!");
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8 text-text-light">Social Feed</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - profile and trending */}
        <div className="space-y-8">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Avatar className="h-12 w-12 border-2 border-primary/20">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || ""} />
                ) : (
                  <User className="h-6 w-6" />
                )}
              </Avatar>
              <div>
                <CardTitle className="text-text-light text-lg">
                  {user?.displayName || user?.email?.split('@')[0] || "User"}
                </CardTitle>
                <p className="text-text-muted text-sm">@{user?.email?.split('@')[0] || "user"}</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 divide-x divide-white/10 text-center py-2">
                <div className="px-2">
                  <p className="text-text-light font-bold">248</p>
                  <p className="text-text-muted text-xs">Posts</p>
                </div>
                <div className="px-2">
                  <p className="text-text-light font-bold">582</p>
                  <p className="text-text-muted text-xs">Followers</p>
                </div>
                <div className="px-2">
                  <p className="text-text-light font-bold">312</p>
                  <p className="text-text-muted text-xs">Following</p>
                </div>
              </div>
              
              <Button
                className="w-full bg-primary text-white mt-4"
                onClick={shareProgress}
              >
                <Share2 className="h-4 w-4 mr-2" /> Share Your Progress
              </Button>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-text-light">Trending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["#MondayMotivation", "#FitnessFriday", "#MindfulnessMatters", "#StrengthTraining", "#NutritionTips"].map((tag, idx) => (
                  <div key={idx} className="glass-card-hover p-3">
                    <p className="text-primary font-medium">{tag}</p>
                    <p className="text-text-muted text-xs">{1200 - (idx * 183)} posts</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Center column - posts */}
        <div className="lg:col-span-2 space-y-8">
          {/* Create post */}
          <Card className="glass-card">
            <CardContent className="pt-6">
              <form onSubmit={handlePostSubmit}>
                <div className="flex gap-4 mb-4">
                  <Avatar className="h-10 w-10 border-2 border-primary/20">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || ""} />
                    ) : (
                      <User className="h-6 w-6" />
                    )}
                  </Avatar>
                  <textarea
                    className="flex-1 bg-black/40 border border-white/10 rounded-lg p-3 text-text-light"
                    placeholder="Share your fitness journey..."
                    rows={3}
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-white/10 text-text-light hover:bg-white/5"
                  >
                    <ImagePlus className="h-4 w-4 mr-2" /> Add Image
                  </Button>
                  
                  <Button
                    type="submit"
                    className="bg-primary text-white"
                  >
                    <Send className="h-4 w-4 mr-2" /> Post
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          {/* Posts feed */}
          {posts.map((post) => (
            <Card key={post.id} className="glass-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-10 w-10 border-2 border-primary/20">
                    {post.user.avatar ? (
                      <img src={post.user.avatar} alt={post.user.name} />
                    ) : (
                      <User className="h-6 w-6" />
                    )}
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-text-light">{post.user.name}</h3>
                    <p className="text-text-muted text-xs">@{post.user.username} • {post.timestamp}</p>
                  </div>
                </div>
                
                <p className="text-text-light mb-4">{post.content}</p>
                
                {post.image && (
                  <div className="mb-4 rounded-lg overflow-hidden">
                    <img 
                      src={post.image} 
                      alt="Post" 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}
                
                <div className="flex border-t border-white/10 pt-4 mt-4">
                  <Button
                    variant="ghost"
                    className={`flex-1 ${post.liked ? 'text-primary' : 'text-text-muted'}`}
                    onClick={() => toggleLike(post.id)}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${post.liked ? 'fill-primary' : ''}`} />
                    {post.likes}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    className="flex-1 text-text-muted"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {post.comments}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    className="flex-1 text-text-muted"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Social;
