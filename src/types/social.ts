export type PostType = 'workout' | 'achievement' | 'milestone';

export interface Post {
  id: string;
  user_id: string;
  type: PostType;
  content: string;
  media_url?: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Like {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  followers_count: number;
  following_count: number;
  created_at: string;
  updated_at: string;
}

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface SocialStats {
  posts_count: number;
  followers_count: number;
  following_count: number;
  total_likes: number;
  total_comments: number;
} 