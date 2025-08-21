import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if we have real Supabase credentials
export const isSupabaseConfigured = !!(supabaseUrl && supabaseKey && supabaseUrl.includes('supabase.co'))

// Create Supabase client only if configured, otherwise create a mock client
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : createClient('https://example.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4YW1wbGUiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MjQ3ODc3NCwiZXhwIjoxOTU4MDU0Nzc0fQ.example', {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    })

// Database schemas
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: string
          department: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role: string
          department: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: string
          department?: string
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          title: string
          description: string
          status: string
          priority: string
          start_date: string
          end_date: string
          budget: number
          progress: number
          manager_id: string
          client_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          status: string
          priority: string
          start_date: string
          end_date: string
          budget: number
          progress?: number
          manager_id: string
          client_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          status?: string
          priority?: string
          start_date?: string
          end_date?: string
          budget?: number
          progress?: number
          manager_id?: string
          client_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      project_designs: {
        Row: {
          id: string
          project_id: string
          file_name: string
          file_url: string
          file_type: string
          uploaded_by: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          file_name: string
          file_url: string
          file_type: string
          uploaded_by: string
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          file_name?: string
          file_url?: string
          file_type?: string
          uploaded_by?: string
          created_at?: string
        }
      }
      supervision_reports: {
        Row: {
          id: string
          project_id: string
          supervisor_id: string
          report_date: string
          status: string
          issues: string
          recommendations: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          supervisor_id: string
          report_date: string
          status: string
          issues: string
          recommendations: string
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          supervisor_id?: string
          report_date?: string
          status?: string
          issues?: string
          recommendations?: string
          created_at?: string
        }
      }
      consulting_contracts: {
        Row: {
          id: string
          client_id: string
          consultant_id: string
          contract_value: number
          start_date: string
          end_date: string
          status: string
          description: string
          created_at: string
        }
        Insert: {
          id?: string
          client_id: string
          consultant_id: string
          contract_value: number
          start_date: string
          end_date: string
          status: string
          description: string
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          consultant_id?: string
          contract_value?: number
          start_date?: string
          end_date?: string
          status?: string
          description?: string
          created_at?: string
        }
      }
    }
  }
}
