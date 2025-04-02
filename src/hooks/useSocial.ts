import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Post, Comment, Like, UserProfile, Follow, SocialStats } from '@/types/social';

export default function useSocial() {
  const queryClient = useQueryClient();

  // Queries
  const feed = useQuery({
    queryKey: ['social_feed'],
    queryFn: async () => {
      const { data: posts, error } = await supabase
        .from('posts')
        .select(`
          *,
          user:user_profiles(*),
          likes:likes(user_id),
          comments:comments(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return posts as (Post & {
        user: UserProfile;
        likes: Like[];
        comments: Comment[];
      })[];
    }
  });

  const profile = useQuery({
    queryKey: ['social_profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return profile as UserProfile;
    }
  });

  const stats = useQuery({
    queryKey: ['social_stats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: stats, error } = await supabase
        .rpc('get_social_stats', { user_id: user.id });

      if (error) throw error;
      return stats as SocialStats;
    }
  });

  // Mutations
  const createPost = useMutation({
    mutationFn: async (post: Omit<Post, 'id' | 'created_at' | 'updated_at' | 'likes_count' | 'comments_count'>) => {
      const { data, error } = await supabase
        .from('posts')
        .insert(post)
        .select()
        .single();

      if (error) throw error;
      return data as Post;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social_feed'] });
      queryClient.invalidateQueries({ queryKey: ['social_stats'] });
    }
  });

  const deletePost = useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social_feed'] });
      queryClient.invalidateQueries({ queryKey: ['social_stats'] });
    }
  });

  const likePost = useMutation({
    mutationFn: async (postId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('likes')
        .insert({ post_id: postId, user_id: user.id });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social_feed'] });
      queryClient.invalidateQueries({ queryKey: ['social_stats'] });
    }
  });

  const unlikePost = useMutation({
    mutationFn: async (postId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social_feed'] });
      queryClient.invalidateQueries({ queryKey: ['social_stats'] });
    }
  });

  const addComment = useMutation({
    mutationFn: async (comment: Omit<Comment, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('comments')
        .insert(comment)
        .select()
        .single();

      if (error) throw error;
      return data as Comment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social_feed'] });
      queryClient.invalidateQueries({ queryKey: ['social_stats'] });
    }
  });

  const deleteComment = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social_feed'] });
      queryClient.invalidateQueries({ queryKey: ['social_stats'] });
    }
  });

  const followUser = useMutation({
    mutationFn: async (followingId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('follows')
        .insert({ follower_id: user.id, following_id: followingId });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social_profile'] });
      queryClient.invalidateQueries({ queryKey: ['social_stats'] });
    }
  });

  const unfollowUser = useMutation({
    mutationFn: async (followingId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', followingId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social_profile'] });
      queryClient.invalidateQueries({ queryKey: ['social_stats'] });
    }
  });

  const updateProfile = useMutation({
    mutationFn: async (profile: Partial<UserProfile>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_profiles')
        .update(profile)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data as UserProfile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social_profile'] });
    }
  });

  return {
    feed: feed.data,
    profile: profile.data,
    stats: stats.data,
    createPost,
    deletePost,
    likePost,
    unlikePost,
    addComment,
    deleteComment,
    followUser,
    unfollowUser,
    updateProfile
  };
} 