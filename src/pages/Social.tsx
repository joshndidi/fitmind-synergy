import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share2, MoreVertical, ThumbsUp } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface Post {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  likes: number;
  comments: number;
  user: {
    username: string;
    avatar_url: string;
  };
}

export default function Social() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          user:profiles(username, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim()) {
      toast.error('Please enter some content');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            content: newPost,
            user_id: user?.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setPosts([data, ...posts]);
      setNewPost('');
      setIsCreatingPost(false);
      toast.success('Post created successfully');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('post_likes')
        .upsert([
          {
            post_id: postId,
            user_id: user?.id,
          },
        ]);

      if (error) throw error;

      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1 }
          : post
      ));
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error('Failed to like post');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-text-light">Social Feed</h1>
        <Button onClick={() => setIsCreatingPost(true)}>Create Post</Button>
      </div>

      {isCreatingPost && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <Textarea
              placeholder="What's on your mind?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="mb-4"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreatingPost(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePost} disabled={loading}>
                {loading ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={post.user.avatar_url} />
                  <AvatarFallback>{post.user.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">{post.user.username}</CardTitle>
                  <p className="text-sm text-text-muted">
                    {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-text-light mb-4">{post.content}</p>
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2"
                  onClick={() => handleLike(post.id)}
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>{post.likes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.comments}</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
