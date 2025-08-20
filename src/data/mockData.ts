import { Project, User, DashboardMetrics, Activity, Alert, Event } from '../types';

// Mock Users
export const mockUsers: User[] = [
  { 
    id: '1', 
    name: 'John Anderson', 
    email: 'john.anderson@midroc.com', 
    role: 'admin', 
    department: 'Administration',
    permissions: {
      canCreateProjects: true,
      canEditProjects: true,
      canDeleteProjects: true,
      canViewAllProjects: true,
      canExportData: true,
      canManageUsers: true,
      canAccessFinance: true,
      canAccessHR: true,
      canViewReports: true,
      canManageSystem: true
    }
  },
  { 
    id: '2', 
    name: 'Sarah Mitchell', 
    email: 'sarah.mitchell@midroc.com', 
    role: 'general_manager', 
    department: 'Construction Management',
    permissions: {
      canCreateProjects: true,
      canEditProjects: true,
      canDeleteProjects: true,
      canViewAllProjects: true,
      canExportData: true,
      canManageUsers: true,
      canAccessFinance: true,
      canAccessHR: true,
      canViewReports: true,
      canManageSystem: false
    }
  },
  { 
    id: '3', 
    name: 'Michael Rodriguez', 
    email: 'michael.rodriguez@midroc.com', 
    role: 'project_manager', 
    department: 'Highway Construction',
    permissions: {
      canCreateProjects: true,
      canEditProjects: true,
      canDeleteProjects: false,
      canViewAllProjects: true,
      canExportData: true,
      canManageUsers: false,
      canAccessFinance: false,
      canAccessHR: false,
      canViewReports: true,
      canManageSystem: false
    }
  },
  { 
    id: '4', 
    name: 'Emma Thompson', 
    email: 'emma.thompson@midroc.com', 
    role: 'consultant', 
    department: 'Urban Planning',
    permissions: {
      canCreateProjects: false,
      canEditProjects: true,
      canDeleteProjects: false,
      canViewAllProjects: false,
      canExportData: true,
      canManageUsers: false,
      canAccessFinance: false,
      canAccessHR: false,
      canViewReports: true,
      canManageSystem: false
    }
  },
  { 
    id: '5', 
    name: 'David Chen', 
    email: 'david.chen@midroc.com', 
    role: 'engineer', 
    department: 'Structural Engineering',
    permissions: {
      canCreateProjects: false,
      canEditProjects: true,
      canDeleteProjects: false,
      canViewAllProjects: false,
      canExportData: false,
      canManageUsers: false,
      canAccessFinance: false,
      canAccessHR: false,
      canViewReports: false,
      canManageSystem: false
    }
  }
];

// Mock Projects
export let mockProjects: Project[] = [
  {
    id: '1',
    name: 'Stockholm Highway Extension Project',
    status: 'active',
    priority: 'critical',
    progress: 75,
    budget: 2500000,
    startDate: '2024-01-15',
    endDate: '2024-12-30',
    manager: mockUsers[2],
    team: [mockUsers[2], mockUsers[3], mockUsers[4]],
    description: 'Major highway infrastructure project connecting Stockholm suburbs'
  },
  {
    id: '2',
    name: 'Malmö Urban Development Consulting',
    status: 'active',
    priority: 'high',
    progress: 60,
    budget: 850000,
    startDate: '2024-02-01',
    endDate: '2024-09-15',
    manager: mockUsers[3],
    team: [mockUsers[3], mockUsers[4], mockUsers[1]],
    description: 'Comprehensive urban planning and development consultation for Malmö city center'
  },
  {
    id: '3',
    name: 'Göteborg Commercial Building Complex',
    status: 'planning',
    priority: 'high',
    progress: 25,
    budget: 4200000,
    startDate: '2024-03-01',
    endDate: '2025-02-28',
    manager: mockUsers[1],
    team: [mockUsers[1], mockUsers[2], mockUsers[4]],
    description: 'Multi-story commercial building complex with sustainable design features'
  },
  {
    id: '4',
    name: 'Bridge Infrastructure Assessment',
    status: 'completed',
    priority: 'medium',
    progress: 100,
    budget: 320000,
    startDate: '2023-11-01',
    endDate: '2024-01-31',
    manager: mockUsers[4],
    team: [mockUsers[4], mockUsers[2]],
    description: 'Structural assessment and maintenance planning for regional bridge network'
  },
  {
    id: '5',
    name: 'Residential Housing Development',
    status: 'on-hold',
    priority: 'high',
    progress: 30,
    budget: 1800000,
    startDate: '2024-01-01',
    endDate: '2024-11-30',
    manager: mockUsers[1],
    team: [mockUsers[1], mockUsers[3]],
    description: 'Sustainable residential housing development with modern amenities'
  }
];

// Function to add new project
export const addProject = (project: Project) => {
  mockProjects.push(project);
};

// Function to update project
export const updateProject = (updatedProject: Project) => {
  const index = mockProjects.findIndex(p => p.id === updatedProject.id);
  if (index !== -1) {
    mockProjects[index] = updatedProject;
  }
};

// Function to delete project
export const deleteProject = (projectId: string) => {
  mockProjects = mockProjects.filter(p => p.id !== projectId);
};

// Dashboard Metrics
export const mockMetrics: DashboardMetrics = {
  totalRevenues: 12750000,
  activeProjects: 12,
  teamMembers: 85,
  pendingTasks: 34
};

// Recent Activities
export const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'project',
    title: 'Highway Project Milestone Completed',
    description: 'Stockholm Highway Extension Project reached 75% completion',
    timestamp: '2 hours ago',
    user: 'Sarah Mitchell'
  },
  {
    id: '2',
    type: 'hr',
    title: 'New Engineer Onboarded',
    description: 'Alex Larsson joined the Structural Engineering team',
    timestamp: '4 hours ago',
    user: 'HR System'
  },
  {
    id: '3',
    type: 'finance',
    title: 'Construction Budget Approved',
    description: 'Q2 construction budget of $2.5M approved for highway project',
    timestamp: '6 hours ago',
    user: 'Finance Team'
  },
  {
    id: '4',
    type: 'project',
    title: 'Engineering Tasks Assigned',
    description: '8 new structural analysis tasks assigned to Malmö project',
    timestamp: '8 hours ago',
    user: 'John Anderson'
  },
  {
    id: '5',
    type: 'system',
    title: 'Midroc ERP Update',
    description: 'Construction ERP system updated to version 3.2.1',
    timestamp: '1 day ago',
    user: 'System'
  }
];

// System Alerts
export const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Construction Budget Alert',
    description: 'Göteborg Building Complex project is approaching budget limit',
    timestamp: '1 hour ago'
  },
  {
    id: '2',
    type: 'info',
    title: 'Equipment Maintenance',
    description: 'Heavy machinery maintenance scheduled for this weekend',
    timestamp: '3 hours ago'
  },
  {
    id: '3',
    type: 'success',
    title: 'Safety Inspection Completed',
    description: 'Weekly safety inspection completed for all active sites',
    timestamp: '12 hours ago'
  }
];

// Upcoming Events
export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Highway Project Review Meeting',
    date: 'Today, 3:00 PM',
    type: 'meeting',
    participants: ['Sarah Mitchell', 'Michael Rodriguez']
  },
  {
    id: '2',
    title: 'Urban Planning Deadline',
    date: 'Tomorrow, 5:00 PM',
    type: 'deadline'
  },
  {
    id: '3',
    title: 'Safety Training Session',
    date: 'Friday, 10:00 AM',
    type: 'training',
    participants: ['All Construction Staff']
  },
  {
    id: '4',
    title: 'Quarterly Construction Review',
    date: 'Next Monday, 9:00 AM',
    type: 'review',
    participants: ['Management Team']
  }
];