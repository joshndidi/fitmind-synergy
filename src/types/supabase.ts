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
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string | null
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
          calories: number | null
          created_at: string
          date: string | null
          duration: number | null
          id: string
          intensity: string | null
          title: string | null
          total_weight: number | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          calories?: number | null
          created_at?: string
          date?: string | null
          duration?: number | null
          id?: string
          intensity?: string | null
          title?: string | null
          total_weight?: number | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          calories?: number | null
          created_at?: string
          date?: string | null
          duration?: number | null
          id?: string
          intensity?: string | null
          title?: string | null
          total_weight?: number | null
          type?: string | null
          user_id?: string | null
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
          created_at: string
          id: string
          image_url: string | null
          name: string | null
          type: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string | null
          type?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string | null
          type?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          country: string | null
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          is_admin: boolean | null
          province: string | null
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
          is_admin?: boolean | null
          province?: string | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          is_admin?: boolean | null
          province?: string | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
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
      workout_plans: {
        Row: {
          created_at: string
          duration: number | null
          exercises: Json | null
          id: string
          intensity: string | null
          is_ai_generated: boolean | null
          title: string | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          duration?: number | null
          exercises?: Json | null
          id?: string
          intensity?: string | null
          is_ai_generated?: boolean | null
          title?: string | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          duration?: number | null
          exercises?: Json | null
          id?: string
          intensity?: string | null
          is_ai_generated?: boolean | null
          title?: string | null
          type?: string | null
          user_id?: string | null
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
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & { step: { Row: { started_at: string; ended_at: string; }; Insert: { started_at: string; ended_at: string; }; Update: { started_at: string; ended_at: string; }; }; })
    | { schema: string; table: string },
  TableName extends PublicTableNameOrOptions extends { schema: string; table: string }
    ? PublicTableNameOrOptions["table"]
    : Extract<keyof Database["public"]["Tables"], string>
> = PublicTableNameOrOptions extends { schema: string; table: string }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] & { step: { Row: { started_at: string; ended_at: string; }; Insert: { started_at: string; ended_at: string; }; Update: { started_at: string; ended_at: string; }; }; })[TableName]["Row"]
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] & { step: { Row: { started_at: string; ended_at: string; }; Insert: { started_at: string; ended_at: string; }; Update: { started_at: string; ended_at: string; }; }; })
    ? (Database["public"]["Tables"] & { step: { Row: { started_at: string; ended_at: string; }; Insert: { started_at: string; ended_at: string; }; Update: { started_at: string; ended_at: string; }; }; })[TableName]["Row"]
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: string; table: string },
  TableName extends PublicTableNameOrOptions extends { schema: string; table: string }
    ? PublicTableNameOrOptions["table"]
    : Extract<keyof Database["public"]["Tables"], string>
> = PublicTableNameOrOptions extends { schema: string; table: string }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName]["Insert"]
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][TableName]["Insert"]
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: string; table: string },
  TableName extends PublicTableNameOrOptions extends { schema: string; table: string }
    ? PublicTableNameOrOptions["table"]
    : Extract<keyof Database["public"]["Tables"], string>
> = PublicTableNameOrOptions extends { schema: string; table: string }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName]["Update"]
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][TableName]["Update"]
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: string; name: string },
  EnumName extends PublicEnumNameOrOptions extends { schema: string; name: string }
    ? PublicEnumNameOrOptions["name"]
    : Extract<keyof Database["public"]["Enums"], string>
> = PublicEnumNameOrOptions extends { schema: string; name: string }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][EnumName]
    : never

// Add leaderboard data type
export interface LeaderboardEntry {
  id: string;
  display_name: string;
  avatar_url: string;
  country: string | null;
  province: string | null;
  total_weight: number;
  workout_count: number;
}
