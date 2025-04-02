
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Post, Comment, Like, UserProfile, Follow, SocialStats } from '@/types/social';

export default function useSocial() {
  const queryClient = useQueryClient();

  // Helper for casting database response types
  const mapPost = (postData: any): Post => ({
    id: postData.id,
    user_id: postData.user_id,
    content: postData.content,
    media_url: postData.media_url,
    likes_count: postData.likes_count,
    comments_count: postData.comments_count,
    created_at: postData.created_at,
    updated_at: postData.updated_at
  });

  const mapProfile = (profileData: any): UserProfile => ({
    id: profileData.id,
    username: profileData.username || profileData.display_name,
    full_name: profileData.full_name || profileData.display_name,
    display_name: profileData.display_name,
    avatar_url: profileData.avatar_url,
    bio: profileData.bio,
    followers_count: profileData.followers_count || 0,
    following_count: profileData.following_count || 0,
    created_at: profileData.created_at,
    updated_at: profileData.updated_at
  });

  // Queries
  const feed = useQuery({
    queryKey: ['social_feed'],
    queryFn: async () => {
      const { data: posts, error } = await supabase
        .from('posts')
        .select(`*`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Get profiles and enrich the posts
      const postIds = posts.map(post => post.id);
      const userIds = posts.map(post => post.user_id);
      
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds);
      
      const { data: likes } = await supabase
        .from('post_likes')
        .select('*')
        .in('post_id', postIds);
      
      const { data: comments } = await supabase
        .from('comments')
        .select('*')
        .in('post_id', postIds);
      
      return posts.map(post => {
        const user = profiles?.find(profile => profile.id === post.user_id);
        const postLikes = likes?.filter(like => like.post_id === post.id) || [];
        const postComments = comments?.filter(comment => comment.post_id === post.id) || [];
        
        return {
          ...mapPost(post),
          user: mapProfile(user || {}),
          likes: postLikes,
          comments: postComments
        };
      });
    }
  });

  const profile = useQuery({
    queryKey: ['social_profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return mapProfile(profile);
    }
  });

  const stats = useQuery({
    queryKey: ['social_stats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .rpc('get_social_stats', { user_id: user.id });

      if (error) throw error;
      return data as SocialStats;
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
      return mapPost(data);
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
        .from('post_likes')
        .insert({ post_id: postId, user_id: user.id });

      if (error) throw error;
      
      // Update likes count in posts table
      await supabase
        .from('posts')
        .update({ likes_count: supabase.rpc('increment', { inc: 1 }) })
        .eq('id', postId);
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
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Update likes count in posts table
      await supabase
        .from('posts')
        .update({ likes_count: supabase.rpc('decrement', { dec: 1 }) })
        .eq('id', postId);
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
      
      // Update comments count in posts table
      await supabase
        .from('posts')
        .update({ comments_count: supabase.rpc('increment', { inc: 1 }) })
        .eq('id', comment.post_id);
        
      return data as Comment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social_feed'] });
      queryClient.invalidateQueries({ queryKey: ['social_stats'] });
    }
  });

  const deleteComment = useMutation({
    mutationFn: async (commentData: { commentId: string, postId: string }) => {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentData.commentId);

      if (error) throw error;
      
      // Update comments count in posts table
      await supabase
        .from('posts')
        .update({ comments_count: supabase.rpc('decrement', { dec: 1 }) })
        .eq('id', commentData.postId);
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
        .from('profiles')
        .update({
          display_name: profile.display_name || profile.username || profile.full_name,
          avatar_url: profile.avatar_url,
          bio: profile.bio,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      return mapProfile(data);
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
