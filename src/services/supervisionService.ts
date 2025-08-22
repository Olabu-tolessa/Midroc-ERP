import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface SupervisionReport {
  id: string;
  project_id: string;
  supervisor_id: string;
  report_date: string;
  status: string;
  issues: string;
  recommendations: string;
  created_at: string;
}

export interface QualitySafetyReport {
  id: string;
  project_id: string;
  project_title: string;
  inspector_id: string;
  inspector_name: string;
  inspection_date: string;
  inspection_type: string;
  document_number: string;
  page_info: {
    project_name: string;
    consultant: string;
    contractor: string;
    section: string;
    date: string;
  };
  checklist_items: Array<{
    section: string;
    items: Array<{
      id: string;
      description: string;
      checked: boolean;
      comments?: string;
    }>;
  }>;
  checked_by?: string;
  checked_by_signature?: string;
  checked_by_date?: string;
  approved_by?: string;
  approved_by_signature?: string;
  approved_by_date?: string;
  assigned_to?: string;
  assigned_to_name?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface QualityTask {
  id: string;
  title: string;
  description?: string;
  type: string;
  category: string;
  assigned_to?: string;
  assigned_to_name?: string;
  project_id?: string;
  project_name?: string;
  checkpoints: Array<{
    id: string;
    title: string;
    description: string;
    completed: boolean;
    completed_at?: string;
    completed_by?: string;
  }>;
  created_by: string;
  created_by_name: string;
  due_date?: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
}

// Supervision Report operations
export const supervisionService = {
  async getSupervisionReports(): Promise<SupervisionReport[]> {
    if (!isSupabaseConfigured) {
      return []; // Return empty array if Supabase not configured
    }

    const { data, error } = await supabase
      .from('supervision_reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching supervision reports:', error);
      throw error;
    }

    return data || [];
  },

  async createSupervisionReport(report: Omit<SupervisionReport, 'id' | 'created_at'>): Promise<SupervisionReport> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('supervision_reports')
      .insert(report)
      .select()
      .single();

    if (error) {
      console.error('Error creating supervision report:', error);
      throw error;
    }

    return data;
  },

  async updateSupervisionReport(id: string, updates: Partial<SupervisionReport>): Promise<SupervisionReport> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('supervision_reports')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating supervision report:', error);
      throw error;
    }

    return data;
  },

  async deleteSupervisionReport(id: string): Promise<void> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured');
    }

    const { error } = await supabase
      .from('supervision_reports')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting supervision report:', error);
      throw error;
    }
  }
};

// Quality Safety Report operations
export const qualitySafetyService = {
  async getQualitySafetyReports(): Promise<QualitySafetyReport[]> {
    if (!isSupabaseConfigured) {
      return []; // Return empty array if Supabase not configured
    }

    const { data, error } = await supabase
      .from('quality_safety_reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching quality safety reports:', error);
      throw error;
    }

    return data || [];
  },

  async createQualitySafetyReport(report: Omit<QualitySafetyReport, 'id' | 'created_at' | 'updated_at'>): Promise<QualitySafetyReport> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('quality_safety_reports')
      .insert(report)
      .select()
      .single();

    if (error) {
      console.error('Error creating quality safety report:', error);
      throw error;
    }

    return data;
  },

  async updateQualitySafetyReport(id: string, updates: Partial<QualitySafetyReport>): Promise<QualitySafetyReport> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('quality_safety_reports')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating quality safety report:', error);
      throw error;
    }

    return data;
  },

  async deleteQualitySafetyReport(id: string): Promise<void> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured');
    }

    const { error } = await supabase
      .from('quality_safety_reports')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting quality safety report:', error);
      throw error;
    }
  }
};

// Quality Task operations
export const qualityTaskService = {
  async getQualityTasks(): Promise<QualityTask[]> {
    if (!isSupabaseConfigured) {
      return []; // Return empty array if Supabase not configured
    }

    const { data, error } = await supabase
      .from('quality_tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching quality tasks:', error);
      throw error;
    }

    return data || [];
  },

  async createQualityTask(task: Omit<QualityTask, 'id' | 'created_at' | 'updated_at'>): Promise<QualityTask> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('quality_tasks')
      .insert(task)
      .select()
      .single();

    if (error) {
      console.error('Error creating quality task:', error);
      throw error;
    }

    return data;
  },

  async updateQualityTask(id: string, updates: Partial<QualityTask>): Promise<QualityTask> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('quality_tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating quality task:', error);
      throw error;
    }

    return data;
  },

  async deleteQualityTask(id: string): Promise<void> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured');
    }

    const { error } = await supabase
      .from('quality_tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting quality task:', error);
      throw error;
    }
  },

  async toggleCheckpoint(taskId: string, checkpointId: string, completed: boolean, completedBy?: string): Promise<QualityTask> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured');
    }

    // First get the current task
    const { data: currentTask, error: fetchError } = await supabase
      .from('quality_tasks')
      .select('*')
      .eq('id', taskId)
      .single();

    if (fetchError || !currentTask) {
      throw new Error('Task not found');
    }

    // Update the specific checkpoint
    const updatedCheckpoints = currentTask.checkpoints.map((checkpoint: any) => {
      if (checkpoint.id === checkpointId) {
        return {
          ...checkpoint,
          completed,
          completed_at: completed ? new Date().toISOString() : null,
          completed_by: completed ? completedBy : null,
        };
      }
      return checkpoint;
    });

    // Calculate overall task status
    const completedCount = updatedCheckpoints.filter((cp: any) => cp.completed).length;
    const totalCount = updatedCheckpoints.length;
    let status = 'pending';
    
    if (completedCount === 0) {
      status = 'pending';
    } else if (completedCount === totalCount) {
      status = 'completed';
    } else {
      status = 'in_progress';
    }

    return this.updateQualityTask(taskId, {
      checkpoints: updatedCheckpoints,
      status,
    });
  }
};

// Real-time subscriptions
export const subscribeToSupervisionReports = (callback: (reports: SupervisionReport[]) => void) => {
  if (!isSupabaseConfigured) return () => {};

  const subscription = supabase
    .channel('supervision-reports-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'supervision_reports',
      },
      () => {
        supervisionService.getSupervisionReports().then(callback);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
};

export const subscribeToQualitySafetyReports = (callback: (reports: QualitySafetyReport[]) => void) => {
  if (!isSupabaseConfigured) return () => {};

  const subscription = supabase
    .channel('quality-safety-reports-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'quality_safety_reports',
      },
      () => {
        qualitySafetyService.getQualitySafetyReports().then(callback);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
};

export const subscribeToQualityTasks = (callback: (tasks: QualityTask[]) => void) => {
  if (!isSupabaseConfigured) return () => {};

  const subscription = supabase
    .channel('quality-tasks-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'quality_tasks',
      },
      () => {
        qualityTaskService.getQualityTasks().then(callback);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
};
