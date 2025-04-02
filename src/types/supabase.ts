
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      achievements: {
        Row: {
          id: string
          user_id: string
          type: string
          tier: string
          title: string
          description: string
          icon: string
          progress: number
          target: number
          completed: boolean
          completed_at?: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          tier: string
          title: string
          description: string
          icon: string
          progress: number
          target: number
          completed: boolean
          completed_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          tier?: string
          title?: string
          description?: string
          icon?: string
          progress?: number
          target?: number
          completed?: boolean
          completed_at?: string
          created_at?: string
        }
        Relationships: []
      }
      calories: {
        Row: {
          calories: number | null
          created_at: string
          date: string | null
          description: string | null
          id: string
          name: string | null
          user_id: string | null
        }
        Insert: {
          calories?: number | null
          created_at?: string
          date?: string | null
          description?: string | null
          id?: string
          name?: string | null
          user_id?: string | null
        }
        Update: {
          calories?: number | null
          created_at?: string
          date?: string | null
          description?: string | null
          id?: string
          name?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calories_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      completed_achievements: {
        Row: {
          achievement_id: string | null
          created_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          achievement_id?: string | null
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          achievement_id?: string | null
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "completed_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "completed_achievements_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      completed_workouts: {
        Row: {
          id: string
          user_id: string
          title: string
          description?: string
          type: string
          duration: number
          calories: number
          intensity: string
          exercises: Json
          total_weight: number
          completed_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string
          type: string
          duration: number
          calories?: number
          intensity: string
          exercises: Json
          total_weight?: number
          completed_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          type?: string
          duration?: number
          calories?: number
          intensity?: string
          exercises?: Json
          total_weight?: number
          completed_at?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "completed_workouts_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      exercise_sets: {
        Row: {
          created_at: string
          exercise_id: string | null
          id: string
          reps: number | null
          weight: number | null
          workout_id: string | null
        }
        Insert: {
          created_at?: string
          exercise_id?: string | null
          id?: string
          reps?: number | null
          weight?: number | null
          workout_id?: string | null
        }
        Update: {
          created_at?: string
          exercise_id?: string | null
          id?: string
          reps?: number | null
          weight?: number | null
          workout_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercise_sets_exercise_id_fkey"
            columns: ["exercise_id"]
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_sets_workout_id_fkey"
            columns: ["workout_id"]
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          }
        ]
      }
      exercises: {
        Row: {
          id: string
          name: string
          type: string
          category: string
          muscle_group: string
          difficulty: string
          equipment: string[]
          image_url: string | null
          video_url: string | null
          description: string | null
          instructions: string[] | null
          tips: string[] | null
          variations: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          type?: string
          category?: string
          muscle_group?: string
          difficulty?: string
          equipment?: string[]
          image_url?: string | null
          video_url?: string | null
          description?: string | null
          instructions?: string[] | null
          tips?: string[] | null
          variations?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          category?: string
          muscle_group?: string
          difficulty?: string
          equipment?: string[]
          image_url?: string | null
          video_url?: string | null
          description?: string | null
          instructions?: string[] | null
          tips?: string[] | null
          variations?: string[] | null
          created_at?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          id: string
          user_id: string
          content: string
          created_at: string
          updated_at: string
          likes_count: number
          comments_count: number
          media_url?: string
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          created_at?: string
          updated_at?: string
          likes_count?: number
          comments_count?: number
          media_url?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          created_at?: string
          updated_at?: string
          likes_count?: number
          comments_count?: number
          media_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      comments: {
        Row: {
          id: string
          post_id: string
          user_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      post_likes: {
        Row: {
          id: string
          post_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_likes_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      follows: {
        Row: {
          id: string
          follower_id: string
          following_id: string
          created_at: string
        }
        Insert: {
          id?: string
          follower_id: string
          following_id: string
          created_at?: string
        }
        Update: {
          id?: string
          follower_id?: string
          following_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_following_id_fkey"
            columns: ["following_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          weight: number | null
          height: number | null
          fitness_goal: string | null
          country: string | null
          province: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          weight?: number | null
          height?: number | null
          fitness_goal?: string | null
          country?: string | null
          province?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          weight?: number | null
          height?: number | null
          fitness_goal?: string | null
          country?: string | null
          province?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      quiet_time_notes: {
        Row: {
          content: string | null
          created_at: string
          id: string
          title: string | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          title?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          title?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiet_time_notes_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      subscriptions: {
        Row: {
          cancel_at: string | null
          cancel_at_period_end: boolean | null
          created: string
          currency: string | null
          ended_at: string | null
          id: string
          metadata: Json | null
          price_id: string | null
          quantity: number | null
          status: string | null
          stripe_customer_id: string | null
          stripe_price_id: string | null
          stripe_product_id: string | null
          updated: string | null
          user_id: string
        }
        Insert: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          created?: string
          currency?: string | null
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          updated?: string | null
          user_id: string
        }
        Update: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          created?: string
          currency?: string | null
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          updated?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      workout_exercises: {
        Row: {
          id: string
          workout_plan_id: string
          name: string
          sets: number
          reps: number
          weight: number | null
          duration: number | null
          rest_time: number | null
          notes: string | null
          order_index: number | null
          created_at: string
        }
        Insert: {
          id?: string
          workout_plan_id: string
          name: string
          sets: number
          reps: number
          weight?: number | null
          duration?: number | null
          rest_time?: number | null
          notes?: string | null
          order_index?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          workout_plan_id?: string
          name?: string
          sets?: number
          reps?: number
          weight?: number | null
          duration?: number | null
          rest_time?: number | null
          notes?: string | null
          order_index?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_exercises_workout_plan_id_fkey"
            columns: ["workout_plan_id"]
            referencedRelation: "workout_plans"
            referencedColumns: ["id"]
          }
        ]
      }
      workout_logs: {
        Row: {
          id: string
          user_id: string
          title: string
          type: string
          duration: number
          exercises: Json
          calories: number | null
          total_weight: number
          completed_at: string
          created_at: string
          workout_plan_id: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          type: string
          duration: number
          exercises: Json
          calories?: number | null
          total_weight?: number
          completed_at?: string
          created_at?: string
          workout_plan_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          type?: string
          duration?: number
          exercises?: Json
          calories?: number | null
          total_weight?: number
          completed_at?: string
          created_at?: string
          workout_plan_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_logs_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_logs_workout_plan_id_fkey"
            columns: ["workout_plan_id"]
            referencedRelation: "workout_plans"
            referencedColumns: ["id"]
          }
        ]
      }
      workout_plans: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          type: string
          duration: number
          calories: number | null
          intensity: string
          exercises: Json
          created_at: string
          updated_at: string | null
          is_ai_generated: boolean
          is_template: boolean | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          type: string
          duration: number
          calories?: number | null
          intensity: string
          exercises?: Json
          created_at?: string
          updated_at?: string | null
          is_ai_generated?: boolean
          is_template?: boolean | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          type?: string
          duration?: number
          calories?: number | null
          intensity?: string
          exercises?: Json
          created_at?: string
          updated_at?: string | null
          is_ai_generated?: boolean
          is_template?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_plans_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      workouts: {
        Row: {
          created_at: string
          date: string | null
          duration: number | null
          exercise_ids: string[] | null
          id: string
          intensity: string | null
          name: string | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          date?: string | null
          duration?: number | null
          exercise_ids?: string[] | null
          id?: string
          intensity?: string | null
          name?: string | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          date?: string | null
          duration?: number | null
          exercise_ids?: string[] | null
          id?: string
          intensity?: string | null
          name?: string | null
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workouts_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_leaderboard_data: {
        Args: Record<PropertyKey, never>
        Returns: (
          {
            id: string
            display_name: string
            avatar_url: string
            country: string
            province: string
            total_weight: number
            workout_count: number
          }[]
        )
      }
      get_social_stats: {
        Args: {
          user_id: string
        }
        Returns: {
          posts_count: number
          followers_count: number
          following_count: number
          total_likes: number
          total_comments: number
        }
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type LeaderboardEntry = Database['public']['Functions']['get_leaderboard_data']['Returns'][number];
export type SocialStats = Database['public']['Functions']['get_social_stats']['Returns'];

