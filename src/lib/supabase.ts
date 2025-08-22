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
      contracts: {
        Row: {
          id: string
          title: string
          client_name: string
          contract_type: string
          value: number
          start_date: string
          end_date: string
          status: string
          approval_status: string
          compliance_checks: any
          milestones: any[]
          created_by: string
          created_by_name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          client_name: string
          contract_type: string
          value: number
          start_date: string
          end_date: string
          status?: string
          approval_status?: string
          compliance_checks?: any
          milestones?: any[]
          created_by: string
          created_by_name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          client_name?: string
          contract_type?: string
          value?: number
          start_date?: string
          end_date?: string
          status?: string
          approval_status?: string
          compliance_checks?: any
          milestones?: any[]
          created_by?: string
          created_by_name?: string
          created_at?: string
          updated_at?: string
        }
      }
      contract_forms: {
        Row: {
          id: string
          title: string
          template_type: string
          client_name: string
          contractor_name: string | null
          project_name: string | null
          site_location: string | null
          effective_date: string | null
          form_data: any
          client_signature: string | null
          contractor_signature: string | null
          client_signed_at: string | null
          contractor_signed_at: string | null
          client_assigned_to: string | null
          contractor_assigned_to: string | null
          client_user_name: string | null
          contractor_user_name: string | null
          status: string
          created_by: string
          created_by_name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          template_type: string
          client_name: string
          contractor_name?: string | null
          project_name?: string | null
          site_location?: string | null
          effective_date?: string | null
          form_data?: any
          client_signature?: string | null
          contractor_signature?: string | null
          client_signed_at?: string | null
          contractor_signed_at?: string | null
          client_assigned_to?: string | null
          contractor_assigned_to?: string | null
          client_user_name?: string | null
          contractor_user_name?: string | null
          status?: string
          created_by: string
          created_by_name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          template_type?: string
          client_name?: string
          contractor_name?: string | null
          project_name?: string | null
          site_location?: string | null
          effective_date?: string | null
          form_data?: any
          client_signature?: string | null
          contractor_signature?: string | null
          client_signed_at?: string | null
          contractor_signed_at?: string | null
          client_assigned_to?: string | null
          contractor_assigned_to?: string | null
          client_user_name?: string | null
          contractor_user_name?: string | null
          status?: string
          created_by?: string
          created_by_name?: string
          created_at?: string
          updated_at?: string
        }
      }
      quality_safety_reports: {
        Row: {
          id: string
          project_id: string
          project_title: string
          inspector_id: string
          inspector_name: string
          inspection_date: string
          inspection_type: string
          document_number: string
          page_info: any
          checklist_items: any[]
          checked_by: string | null
          checked_by_signature: string | null
          checked_by_date: string | null
          approved_by: string | null
          approved_by_signature: string | null
          approved_by_date: string | null
          assigned_to: string | null
          assigned_to_name: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          project_title: string
          inspector_id: string
          inspector_name: string
          inspection_date: string
          inspection_type: string
          document_number: string
          page_info?: any
          checklist_items?: any[]
          checked_by?: string | null
          checked_by_signature?: string | null
          checked_by_date?: string | null
          approved_by?: string | null
          approved_by_signature?: string | null
          approved_by_date?: string | null
          assigned_to?: string | null
          assigned_to_name?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          project_title?: string
          inspector_id?: string
          inspector_name?: string
          inspection_date?: string
          inspection_type?: string
          document_number?: string
          page_info?: any
          checklist_items?: any[]
          checked_by?: string | null
          checked_by_signature?: string | null
          checked_by_date?: string | null
          approved_by?: string | null
          approved_by_signature?: string | null
          approved_by_date?: string | null
          assigned_to?: string | null
          assigned_to_name?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      quality_tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          type: string
          category: string
          assigned_to: string | null
          assigned_to_name: string | null
          project_id: string | null
          project_name: string | null
          checkpoints: any[]
          created_by: string
          created_by_name: string
          due_date: string | null
          status: string
          priority: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          type: string
          category: string
          assigned_to?: string | null
          assigned_to_name?: string | null
          project_id?: string | null
          project_name?: string | null
          checkpoints?: any[]
          created_by: string
          created_by_name: string
          due_date?: string | null
          status?: string
          priority?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          type?: string
          category?: string
          assigned_to?: string | null
          assigned_to_name?: string | null
          project_id?: string | null
          project_name?: string | null
          checkpoints?: any[]
          created_by?: string
          created_by_name?: string
          due_date?: string | null
          status?: string
          priority?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
