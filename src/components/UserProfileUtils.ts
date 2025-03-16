
import { User } from "@supabase/supabase-js";
import { ExtendedUser } from "../context/AuthContext";

// Helper functions to safely access user properties
export const getUserDisplayName = (user: User | null): string => {
  if (!user) return "User";
  
  // Cast to ExtendedUser if we've already enhanced it
  const extendedUser = user as ExtendedUser;
  
  // Try to get the display name from our extended property first
  if (extendedUser.displayName) return extendedUser.displayName;
  
  // Fall back to user_metadata if available
  if (user.user_metadata?.full_name) return user.user_metadata.full_name;
  if (user.user_metadata?.name) return user.user_metadata.name;
  
  // Fall back to email or empty string
  return user.email?.split('@')[0] || "User";
};

export const getUserPhotoURL = (user: User | null): string | null => {
  if (!user) return null;
  
  // Cast to ExtendedUser if we've already enhanced it
  const extendedUser = user as ExtendedUser;
  
  // Try to get the photo URL from our extended property first
  if (extendedUser.photoURL) return extendedUser.photoURL;
  
  // Fall back to user_metadata if available
  return user.user_metadata?.avatar_url || null;
};

export const getUserUsername = (user: User | null): string => {
  if (!user) return "user";
  return user.email?.split('@')[0] || "user";
};
