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
          created_at: string
          updated_at: string
          is_ai_generated: boolean
          is_template: boolean
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
          created_at?: string
          updated_at?: string
          is_ai_generated?: boolean
          is_template?: boolean
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
          created_at?: string
          updated_at?: string
          is_ai_generated?: boolean
          is_template?: boolean
        }
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
          order_index: number
          created_at: string
          updated_at: string
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
          order_index: number
          created_at?: string
          updated_at?: string
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
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      completed_workouts: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          type: string
          duration: number
          calories: number
          intensity: string
          exercises: Json
          completed_at: string
          total_weight: number | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          type: string
          duration: number
          calories: number
          intensity: string
          exercises: Json
          completed_at?: string
          total_weight?: number | null
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
          completed_at?: string
          total_weight?: number | null
        }
      }
      exercises: {
        Row: {
          id: string
          name: string
          category: string
          muscle_group: string
          difficulty: "beginner" | "intermediate" | "advanced"
          equipment: string[]
          description: string
          instructions: string[]
          tips: string[]
          variations: string[]
          video_url?: string
          image_url?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          muscle_group: string
          difficulty: "beginner" | "intermediate" | "advanced"
          equipment: string[]
          description: string
          instructions: string[]
          tips: string[]
          variations: string[]
          video_url?: string
          image_url?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          muscle_group?: string
          difficulty?: "beginner" | "intermediate" | "advanced"
          equipment?: string[]
          description?: string
          instructions?: string[]
          tips?: string[]
          variations?: string[]
          video_url?: string
          image_url?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 