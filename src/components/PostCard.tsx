import { useState } from 'react';
import { Post, UserProfile, Comment } from '@/types/social';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface PostCardProps {
  post: Post & {
    user: UserProfile;
    likes: { user_id: string }[];
    comments: Comment[];
  };
  onLike: (postId: string) => void;
  onUnlike: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
  onDelete?: (postId: string) => void;
  className?: string;
}

export default function PostCard({
  post,
  onLike,
  onUnlike,
  onComment,
  onDelete,
  className
}: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      onUnlike(post.id);
      setIsLiked(false);
    } else {
      onLike(post.id);
      setIsLiked(true);
    }
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      onComment(post.id, comment.trim());
      setComment('');
    }
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={post.user.avatar_url} />
            <AvatarFallback>
              {post.user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{post.user.full_name}</p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{post.content}</p>
        {post.media_url && (
          <img
            src={post.media_url}
            alt="Post media"
            className="mt-4 rounded-lg"
          />
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'flex items-center space-x-2',
              isLiked && 'text-red-500'
            )}
            onClick={handleLike}
          >
            <Heart className="h-4 w-4" />
            <span>{post.likes_count}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="h-4 w-4" />
            <span>{post.comments_count}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center space-x-2">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
        {showComments && (
          <div className="w-full space-y-4">
            <form onSubmit={handleComment} className="flex space-x-2">
              <Input
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <Button type="submit">Post</Button>
            </form>
            <div className="space-y-4">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.user_id} />
                    <AvatarFallback>
                      {comment.user_id.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 rounded-lg bg-muted p-2">
                    <p className="text-sm">{comment.content}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
} 