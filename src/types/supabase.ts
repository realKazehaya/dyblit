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
      profiles: {
        Row: {
          id: string
          free_fire_id: string
          nickname: string | null
          nickname_changes: number
          diamonds: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          free_fire_id: string
          nickname?: string | null
          nickname_changes?: number
          diamonds?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          free_fire_id?: string
          nickname?: string | null
          nickname_changes?: number
          diamonds?: number
          created_at?: string
          updated_at?: string
        }
      }
      withdrawals: {
        Row: {
          id: string
          profile_id: string
          amount: number
          status: 'pending' | 'processing' | 'completed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          amount: number
          status?: 'pending' | 'processing' | 'completed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          amount?: number
          status?: 'pending' | 'processing' | 'completed'
          created_at?: string
          updated_at?: string
        }
      }
      promocodes: {
        Row: {
          id: string
          code: string
          diamonds: number
          max_uses: number
          current_uses: number
          created_at: string
          expires_at: string | null
        }
        Insert: {
          id?: string
          code: string
          diamonds: number
          max_uses: number
          current_uses?: number
          created_at?: string
          expires_at?: string | null
        }
        Update: {
          id?: string
          code?: string
          diamonds?: number
          max_uses?: number
          current_uses?: number
          created_at?: string
          expires_at?: string | null
        }
      }
      promocode_uses: {
        Row: {
          id: string
          profile_id: string
          promocode_id: string
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          promocode_id: string
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          promocode_id?: string
          created_at?: string
        }
      }
    }
  }
}