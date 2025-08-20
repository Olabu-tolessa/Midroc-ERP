import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{success: boolean, message?: string}>;
  signup: (name: string, email: string, password: string, role: string) => Promise<{success: boolean, message?: string}>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  hasPermission: (permission: string) => boolean;
  hasRole: (roles: string[]) => boolean;
  canAccessModule: (module: string) => boolean;
  pendingUsers: User[];
  approveUser: (userId: string) => void;
  rejectUser: (userId: string) => void;
  createUser: (userData: {name: string, email: string, password: string, role: string, department: string}) => Promise<{success: boolean, message?: string}>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Role-based permissions configuration
const ROLE_PERMISSIONS = {
  admin: [
    'view_all_modules',
    'create_projects',
    'edit_projects',
    'delete_projects',
    'manage_users',
    'upload_designs',
    'export_data',
    'approve_contracts',
    'manage_supervision',
    'manage_consulting',
    'manage_finances',
    'view_analytics',
    'manage_hr',
    'quality_audit',
    'manage_crm'
  ],
  general_manager: [
    'view_all_modules',
    'create_projects',
    'edit_projects',
    'upload_designs',
    'export_data',
    'approve_contracts',
    'manage_supervision',
    'manage_consulting',
    'manage_finances',
    'view_analytics',
    'manage_hr',
    'quality_audit',
    'manage_crm'
  ],
  project_manager: [
    'view_projects',
    'edit_assigned_projects',
    'export_data',
    'create_supervision_reports',
    'view_consulting',
    'view_finances',
    'view_analytics_limited',
    'view_hr_limited',
    'quality_audit_limited'
  ],
  consultant: [
    'view_consulting',
    'manage_own_contracts',
    'create_time_logs',
    'view_projects_limited',
    'export_own_data'
  ],
  engineer: [
    'view_projects_limited',
    'create_supervision_reports',
    'view_consulting_limited',
    'quality_audit_limited'
  ],
  employee: [
    'view_dashboard',
    'view_own_tasks',
    'view_projects_limited'
  ]
};

// Module access configuration
const MODULE_ACCESS = {
  dashboard: ['admin', 'general_manager', 'project_manager', 'consultant', 'engineer', 'employee'],
  projects: ['admin', 'general_manager', 'project_manager', 'engineer'],
  supervision: ['admin', 'general_manager', 'project_manager', 'engineer'],
  consulting: ['admin', 'general_manager', 'consultant'],
  contracts: ['admin', 'general_manager'],
  users: ['admin', 'general_manager'],
  hr: ['admin', 'general_manager'],
  finance: ['admin', 'general_manager'],
  bi: ['admin', 'general_manager', 'project_manager'],
  qa: ['admin', 'general_manager', 'project_manager', 'engineer'],
  crm: ['admin', 'general_manager', 'consultant']
};

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Anderson',
    email: 'admin@midroc.com',
    role: 'admin',
    department: 'Administration',
    approved: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Sarah Mitchell',
    email: 'gm@midroc.com',
    role: 'general_manager',
    department: 'Construction Management',
    approved: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Michael Rodriguez',
    email: 'pm@midroc.com',
    role: 'project_manager',
    department: 'Highway Construction',
    approved: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'Emma Thompson',
    email: 'consultant@midroc.com',
    role: 'consultant',
    department: 'Urban Planning',
    approved: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    name: 'David Chen',
    email: 'engineer@midroc.com',
    role: 'engineer',
    department: 'Structural Engineering',
    approved: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '6',
    name: 'Lisa Johnson',
    email: 'employee@midroc.com',
    role: 'employee',
    department: 'General Construction',
    approved: true,
    created_at: '2024-01-01T00:00:00Z'
  }
];

// Pending users waiting for approval
const pendingUsersList: User[] = [];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingUsers, setPendingUsers] = useState<User[]>(pendingUsersList);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('erp_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{success: boolean, message?: string}> => {
    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === 'password') {
      if (!foundUser.approved) {
        setLoading(false);
        return { success: false, message: 'Your account is pending approval. Please contact the administrator.' };
      }
      setUser(foundUser);
      localStorage.setItem('erp_user', JSON.stringify(foundUser));
      setLoading(false);
      return { success: true };
    }

    setLoading(false);
    return { success: false, message: 'Invalid email or password' };
  };

  const signup = async (name: string, email: string, password: string, role: string): Promise<{success: boolean, message?: string}> => {
    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    const existingPendingUser = pendingUsers.find(u => u.email === email);

    if (existingUser || existingPendingUser) {
      setLoading(false);
      return { success: false, message: 'User with this email already exists' };
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role: role as 'admin' | 'general_manager' | 'project_manager' | 'engineer' | 'consultant' | 'employee',
      department: 'General',
      approved: false,
      created_at: new Date().toISOString()
    };

    // Add to pending users list instead of approved users
    setPendingUsers(prev => [...prev, newUser]);
    setLoading(false);
    return { success: true, message: 'Account created successfully! Please wait for admin approval before logging in.' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('erp_user');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    const userPermissions = ROLE_PERMISSIONS[user.role as keyof typeof ROLE_PERMISSIONS] || [];
    return userPermissions.includes(permission);
  };

  const hasRole = (roles: string[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const canAccessModule = (module: string): boolean => {
    if (!user) return false;
    const allowedRoles = MODULE_ACCESS[module as keyof typeof MODULE_ACCESS] || [];
    return allowedRoles.includes(user.role);
  };

  const approveUser = (userId: string) => {
    const userToApprove = pendingUsers.find(u => u.id === userId);
    if (userToApprove) {
      const approvedUser = { ...userToApprove, approved: true };
      mockUsers.push(approvedUser);
      setPendingUsers(prev => prev.filter(u => u.id !== userId));
    }
  };

  const rejectUser = (userId: string) => {
    setPendingUsers(prev => prev.filter(u => u.id !== userId));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        loading,
        hasPermission,
        hasRole,
        canAccessModule,
        pendingUsers,
        approveUser,
        rejectUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (undefined === context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
