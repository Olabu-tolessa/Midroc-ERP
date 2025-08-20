export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'general_manager' | 'project_manager' | 'engineer' | 'consultant' | 'employee';
  department?: string;
  avatar?: string;
  permissions?: UserPermissions;
}

export interface UserPermissions {
  canCreateProjects: boolean;
  canEditProjects: boolean;
  canDeleteProjects: boolean;
  canViewAllProjects: boolean;
  canExportData: boolean;
  canManageUsers: boolean;
  canAccessFinance: boolean;
  canAccessHR: boolean;
  canViewReports: boolean;
  canManageSystem: boolean;
}

export interface Project {
  id: string;
  name: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
  budget: number;
  startDate: string;
  endDate: string;
  team: User[];
  description?: string;
  manager: User;
}

export interface DashboardMetrics {
  totalRevenues: number;
  activeProjects: number;
  teamMembers: number;
  pendingTasks: number;
}

export interface Activity {
  id: string;
  type: 'project' | 'hr' | 'finance' | 'system';
  title: string;
  description: string;
  timestamp: string;
  user: string;
}

export interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  type: 'meeting' | 'deadline' | 'review' | 'training';
  participants?: string[];
}