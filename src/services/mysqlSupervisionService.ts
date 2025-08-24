// MySQL API-based supervision service
const API_BASE_URL = 'http://localhost/midroc-erp/backend/api';

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

// HTTP helper function
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}/${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Supervision Report operations
export const supervisionService = {
  async getSupervisionReports(): Promise<SupervisionReport[]> {
    try {
      const response = await apiRequest('supervision_reports');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching supervision reports:', error);
      return [];
    }
  },

  async createSupervisionReport(report: Omit<SupervisionReport, 'id' | 'created_at'>): Promise<SupervisionReport> {
    const response = await apiRequest('supervision_reports', {
      method: 'POST',
      body: JSON.stringify(report),
    });
    return response.data;
  },

  async updateSupervisionReport(id: string, updates: Partial<SupervisionReport>): Promise<SupervisionReport> {
    const response = await apiRequest(`supervision_reports/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return response.data;
  },

  async deleteSupervisionReport(id: string): Promise<void> {
    await apiRequest(`supervision_reports/${id}`, {
      method: 'DELETE',
    });
  }
};

// Quality Safety Report operations
export const qualitySafetyService = {
  async getQualitySafetyReports(): Promise<QualitySafetyReport[]> {
    try {
      const response = await apiRequest('quality_safety_reports');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching quality safety reports:', error);
      return [];
    }
  },

  async createQualitySafetyReport(report: Omit<QualitySafetyReport, 'id' | 'created_at' | 'updated_at'>): Promise<QualitySafetyReport> {
    const response = await apiRequest('quality_safety_reports', {
      method: 'POST',
      body: JSON.stringify(report),
    });
    return response.data;
  },

  async updateQualitySafetyReport(id: string, updates: Partial<QualitySafetyReport>): Promise<QualitySafetyReport> {
    const response = await apiRequest(`quality_safety_reports/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return response.data;
  },

  async deleteQualitySafetyReport(id: string): Promise<void> {
    await apiRequest(`quality_safety_reports/${id}`, {
      method: 'DELETE',
    });
  }
};

// Quality Task operations
export const qualityTaskService = {
  async getQualityTasks(): Promise<QualityTask[]> {
    try {
      const response = await apiRequest('quality_tasks');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching quality tasks:', error);
      return [];
    }
  },

  async createQualityTask(task: Omit<QualityTask, 'id' | 'created_at' | 'updated_at'>): Promise<QualityTask> {
    const response = await apiRequest('quality_tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
    return response.data;
  },

  async updateQualityTask(id: string, updates: Partial<QualityTask>): Promise<QualityTask> {
    const response = await apiRequest(`quality_tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return response.data;
  },

  async deleteQualityTask(id: string): Promise<void> {
    await apiRequest(`quality_tasks/${id}`, {
      method: 'DELETE',
    });
  },

  async toggleCheckpoint(taskId: string, checkpointId: string, completed: boolean, completedBy?: string): Promise<QualityTask> {
    // First get the current task
    const currentTask = await this.getTaskById(taskId);
    if (!currentTask) {
      throw new Error('Task not found');
    }

    // Update the specific checkpoint
    const updatedCheckpoints = currentTask.checkpoints.map((checkpoint) => {
      if (checkpoint.id === checkpointId) {
        return {
          ...checkpoint,
          completed,
          completed_at: completed ? new Date().toISOString() : undefined,
          completed_by: completed ? completedBy : undefined,
        };
      }
      return checkpoint;
    });

    // Calculate overall task status
    const completedCount = updatedCheckpoints.filter((cp) => cp.completed).length;
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
  },

  async getTaskById(id: string): Promise<QualityTask | null> {
    try {
      const response = await apiRequest(`quality_tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching quality task:', error);
      return null;
    }
  }
};

// Real-time subscriptions (polling-based)
export const subscribeToSupervisionReports = (callback: (reports: SupervisionReport[]) => void) => {
  const interval = setInterval(async () => {
    try {
      const reports = await supervisionService.getSupervisionReports();
      callback(reports);
    } catch (error) {
      console.error('Error in supervision reports subscription:', error);
    }
  }, 10000); // Poll every 10 seconds

  return () => clearInterval(interval);
};

export const subscribeToQualitySafetyReports = (callback: (reports: QualitySafetyReport[]) => void) => {
  const interval = setInterval(async () => {
    try {
      const reports = await qualitySafetyService.getQualitySafetyReports();
      callback(reports);
    } catch (error) {
      console.error('Error in quality safety reports subscription:', error);
    }
  }, 10000);

  return () => clearInterval(interval);
};

export const subscribeToQualityTasks = (callback: (tasks: QualityTask[]) => void) => {
  const interval = setInterval(async () => {
    try {
      const tasks = await qualityTaskService.getQualityTasks();
      callback(tasks);
    } catch (error) {
      console.error('Error in quality tasks subscription:', error);
    }
  }, 10000);

  return () => clearInterval(interval);
};
