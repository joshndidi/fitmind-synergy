
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { ExtendedUser } from "../context/AuthContext";

export const getUserProfile = async (user: User): Promise<ExtendedUser> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('display_name, avatar_url, bio, fitness_goal')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return {
        ...user,
        displayName: user.email?.split('@')[0] || 'User',
        isAdmin: false,
      };
    }

    return {
      ...user,
      displayName: data.display_name || user.email?.split('@')[0] || 'User',
      isAdmin: false,
    };
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return {
      ...user,
      displayName: user.email?.split('@')[0] || 'User',
      isAdmin: false,
    };
  }
};

export const updateUserProfile = async (userId: string, profileData: any) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        ...profileData,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error updating profile:', error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    return { success: false, error };
  }
};
