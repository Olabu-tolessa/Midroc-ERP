import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jqjggacoexmigwirpuek.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxamdnYWNvZXhtaWd3aXJwdWVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4Njc1MzQsImV4cCI6MjA3MTQ0MzUzNH0.cq-LZpubcQG9Of1h4c3OsWH03BIpJFbZZ7dWyvTQRnE'

// Check if we have real Supabase credentials
export const isSupabaseConfigured = supabaseUrl !== 'https://jqjggacoexmigwirpuek.supabase.co' &&
  supabaseKey !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxamdnYWNvZXhtaWd3aXJwdWVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4Njc1MzQsImV4cCI6MjA3MTQ0MzUzNH0.cq-LZpubcQG9Of1h4c3OsWH03BIpJFbZZ7dWyvTQRnE' &&
                                   supabaseUrl.includes('supabase.co')

// Create Supabase client with fallback configuration
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: isSupabaseConfigured,
    detectSessionInUrl: isSupabaseConfigured
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
