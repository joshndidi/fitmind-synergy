import { useState } from 'react';
import { Post, UserProfile, Comment } from '@/types/social';
import PostCard from './PostCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImagePlus, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SocialFeedProps {
  posts: (Post & {
    user: UserProfile;
    likes: { user_id: string }[];
    comments: Comment[];
  })[];
  onLike: (postId: string) => void;
  onUnlike: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
  onCreatePost: (content: string, mediaUrl?: string) => void;
  className?: string;
}

export default function SocialFeed({
  posts,
  onLike,
  onUnlike,
  onComment,
  onCreatePost,
  className
}: SocialFeedProps) {
  const [newPost, setNewPost] = useState('');
  const [mediaUrl, setMediaUrl] = useState<string>();

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPost.trim()) {
      onCreatePost(newPost.trim(), mediaUrl);
      setNewPost('');
      setMediaUrl(undefined);
    }
  };

  return (
    <div className={cn('flex flex-col space-y-6', className)}>
      <form onSubmit={handleCreatePost} className="flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <Input
            placeholder="What's on your mind?"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="flex-1"
          />
          <Button type="button" variant="outline" size="icon">
            <ImagePlus className="h-4 w-4" />
          </Button>
          <Button type="submit">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {mediaUrl && (
          <div className="relative">
            <img
              src={mediaUrl}
              alt="Post media"
              className="rounded-lg"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => setMediaUrl(undefined)}
            >
              ×
            </Button>
          </div>
        )}
      </form>
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={onLike}
            onUnlike={onUnlike}
            onComment={onComment}
          />
        ))}
      </div>
    </div>
  );
} 