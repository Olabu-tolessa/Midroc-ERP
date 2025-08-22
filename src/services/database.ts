import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Project, User } from '../types';

// Database Tables Interface
export interface DatabaseProject {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
  budget: number;
  start_date: string;
  end_date: string;
  manager_id: string;
  client_id: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseUser {
  id: string;
  email: string;
  name: string;
  role: string;
  department: string;
  status: 'active' | 'pending' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface SupervisionReport {
  id: string;
  project_id: string;
  supervisor_id: string;
  report_date: string;
  status: 'good' | 'warning' | 'critical';
  issues: string;
  recommendations: string;
  created_at: string;
}

export interface ConsultingContract {
  id: string;
  client_id: string;
  consultant_id: string;
  contract_value: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'completed' | 'cancelled';
  description: string;
  created_at: string;
}

// Database Service Class
export class DatabaseService {
  
  // Projects
  static async getProjects(): Promise<Project[]> {
    if (!isSupabaseConfigured) {
      // Return mock data when Supabase is not configured
      return this.getMockProjects();
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          manager:users!projects_manager_id_fkey(id, name, email),
          client:users!projects_client_id_fkey(id, name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(this.transformDatabaseProjectToProject);
    } catch (error) {
      console.error('Error fetching projects:', error);
      return this.getMockProjects();
    }
  }

  static async createProject(projectData: Partial<DatabaseProject>): Promise<DatabaseProject | null> {
    if (!isSupabaseConfigured) {
      console.log('Mock: Creating project', projectData);
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          ...projectData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating project:', error);
      return null;
    }
  }

  static async updateProject(id: string, updates: Partial<DatabaseProject>): Promise<DatabaseProject | null> {
    if (!isSupabaseConfigured) {
      console.log('Mock: Updating project', id, updates);
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating project:', error);
      return null;
    }
  }

  static async deleteProject(id: string): Promise<boolean> {
    if (!isSupabaseConfigured) {
      console.log('Mock: Deleting project', id);
      return true;
    }

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      return false;
    }
  }

  // Users
  static async getUsers(): Promise<DatabaseUser[]> {
    if (!isSupabaseConfigured) {
      return this.getMockUsers();
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      return this.getMockUsers();
    }
  }

  static async getPendingUsers(): Promise<DatabaseUser[]> {
    if (!isSupabaseConfigured) {
      return this.getMockPendingUsers();
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching pending users:', error);
      return this.getMockPendingUsers();
    }
  }

  static async approveUser(userId: string): Promise<boolean> {
    if (!isSupabaseConfigured) {
      console.log('Mock: Approving user', userId);
      return true;
    }

    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error approving user:', error);
      return false;
    }
  }

  static async rejectUser(userId: string): Promise<boolean> {
    if (!isSupabaseConfigured) {
      console.log('Mock: Rejecting user', userId);
      return true;
    }

    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error rejecting user:', error);
      return false;
    }
  }

  // Supervision Reports
  static async getSupervisionReports(projectId?: string): Promise<SupervisionReport[]> {
    if (!isSupabaseConfigured) {
      return this.getMockSupervisionReports();
    }

    try {
      let query = supabase
        .from('supervision_reports')
        .select('*')
        .order('report_date', { ascending: false });

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching supervision reports:', error);
      return this.getMockSupervisionReports();
    }
  }

  static async createSupervisionReport(reportData: Partial<SupervisionReport>): Promise<SupervisionReport | null> {
    if (!isSupabaseConfigured) {
      console.log('Mock: Creating supervision report', reportData);
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('supervision_reports')
        .insert([{
          ...reportData,
          created_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating supervision report:', error);
      return null;
    }
  }

  // Consulting Contracts
  static async getConsultingContracts(): Promise<ConsultingContract[]> {
    if (!isSupabaseConfigured) {
      return this.getMockConsultingContracts();
    }

    try {
      const { data, error } = await supabase
        .from('consulting_contracts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching consulting contracts:', error);
      return this.getMockConsultingContracts();
    }
  }

  // Real-time subscriptions
  static subscribeToProjects(callback: (projects: Project[]) => void) {
    if (!isSupabaseConfigured) {
      console.log('Mock: Setting up projects subscription');
      return () => {}; // Return empty unsubscribe function
    }

    const subscription = supabase
      .channel('projects_channel')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'projects' },
        async () => {
          const projects = await this.getProjects();
          callback(projects);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }

  static subscribeToUsers(callback: (users: DatabaseUser[]) => void) {
    if (!isSupabaseConfigured) {
      console.log('Mock: Setting up users subscription');
      return () => {};
    }

    const subscription = supabase
      .channel('users_channel')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'users' },
        async () => {
          const users = await this.getUsers();
          callback(users);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }

  static subscribeToSupervisionReports(callback: (reports: SupervisionReport[]) => void) {
    if (!isSupabaseConfigured) {
      console.log('Mock: Setting up supervision reports subscription');
      return () => {};
    }

    const subscription = supabase
      .channel('supervision_reports_channel')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'supervision_reports' },
        async () => {
          const reports = await this.getSupervisionReports();
          callback(reports);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }

  // Helper methods
  private static transformDatabaseProjectToProject(dbProject: any): Project {
    return {
      id: dbProject.id,
      name: dbProject.name,
      description: dbProject.description,
      status: dbProject.status,
      priority: dbProject.priority,
      progress: dbProject.progress,
      budget: dbProject.budget,
      startDate: dbProject.start_date,
      endDate: dbProject.end_date,
      manager: dbProject.manager || { id: dbProject.manager_id, name: 'Unknown', email: '' },
      client: dbProject.client || { id: dbProject.client_id, name: 'Unknown', email: '' },
      team: [], // TODO: Implement team relationship
      milestones: [], // TODO: Implement milestones relationship
    };
  }

  // Mock data methods (fallback when Supabase is not configured)
  private static getMockProjects(): Project[] {
    return [
      {
        id: '1',
        name: 'Highway Construction Phase 1',
        description: 'Major highway construction project connecting city centers',
        status: 'active',
        priority: 'high',
        progress: 65,
        budget: 2500000,
        startDate: '2024-01-15',
        endDate: '2024-12-15',
        manager: { id: '1', name: 'Michael Rodriguez', email: 'pm@midroc.com' },
        client: { id: '2', name: 'Department of Transportation', email: 'dot@gov.com' },
        team: [
          { id: '3', name: 'David Chen', role: 'Lead Engineer', department: 'Engineering', email: 'engineer@midroc.com' },
          { id: '4', name: 'Sarah Wilson', role: 'Safety Coordinator', department: 'Safety', email: 'safety@midroc.com' },
        ],
        milestones: [
          { id: '1', title: 'Foundation Complete', date: '2024-03-15', completed: true },
          { id: '2', title: 'Structural Framework', date: '2024-06-15', completed: true },
          { id: '3', title: 'Surface Installation', date: '2024-09-15', completed: false },
        ],
      },
    ];
  }

  private static getMockUsers(): DatabaseUser[] {
    return [
      {
        id: '1',
        email: 'admin@midroc.com',
        name: 'John Anderson',
        role: 'admin',
        department: 'Administration',
        status: 'active',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ];
  }

  private static getMockPendingUsers(): DatabaseUser[] {
    return [
      {
        id: '2',
        email: 'newuser@midroc.com',
        name: 'Jane Smith',
        role: 'engineer',
        department: 'Engineering',
        status: 'pending',
        created_at: '2024-01-10T00:00:00Z',
        updated_at: '2024-01-10T00:00:00Z',
      },
    ];
  }

  private static getMockSupervisionReports(): SupervisionReport[] {
    return [
      {
        id: '1',
        project_id: '1',
        supervisor_id: '1',
        report_date: '2024-01-15',
        status: 'good',
        issues: 'No major issues observed',
        recommendations: 'Continue with current pace',
        created_at: '2024-01-15T00:00:00Z',
      },
    ];
  }

  private static getMockConsultingContracts(): ConsultingContract[] {
    return [
      {
        id: '1',
        client_id: '1',
        consultant_id: '2',
        contract_value: 150000,
        start_date: '2024-01-01',
        end_date: '2024-06-01',
        status: 'active',
        description: 'Urban planning consultation for downtown development',
        created_at: '2024-01-01T00:00:00Z',
      },
    ];
  }
}
