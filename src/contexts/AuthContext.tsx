import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { User } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DatabaseService, DatabaseUser } from '../services/database';

interface PendingUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface AuthContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signup: (name: string, email: string, password: string, role: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
  hasPermission: (permission: string) => boolean;
  hasRole: (roles: string[]) => boolean;
  canAccessModule: (module: string) => boolean;
  getPendingUsers: () => Promise<PendingUser[]>;
  approveUser: (userId: string) => Promise<boolean>;
  rejectUser: (userId: string) => Promise<boolean>;
  refreshUser: () => Promise<void>;
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
    'manage_crm',
    'approve_users'
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
    'create_projects',
    'edit_projects',
    'upload_designs',
    'export_data',
    'manage_supervision',
    'view_analytics',
    'manage_crm'
  ],
  engineer: [
    'view_projects',
    'upload_designs',
    'export_data',
    'manage_supervision',
    'quality_audit'
  ],
  consultant: [
    'view_projects',
    'manage_consulting',
    'upload_designs',
    'export_data',
    'view_analytics'
  ],
  client: [
    'view_projects',
    'export_data',
    'manage_crm'
  ],
  contractor: [
    'view_projects',
    'upload_designs',
    'manage_supervision'
  ],
  employee: [
    'view_projects'
  ]
};

// Module access configuration
const MODULE_ACCESS = {
  dashboard: ['admin', 'general_manager', 'project_manager', 'engineer', 'consultant', 'client', 'contractor', 'employee'],
  projects: ['admin', 'general_manager', 'project_manager', 'engineer', 'consultant', 'client', 'contractor', 'employee'],
  supervision: ['admin', 'general_manager', 'project_manager', 'engineer', 'contractor'],
  consulting: ['admin', 'general_manager', 'consultant'],
  contracts: ['admin', 'general_manager', 'project_manager'],
  users: ['admin', 'general_manager'],
  hr: ['admin', 'general_manager'],
  finance: ['admin', 'general_manager'],
  qa: ['admin', 'general_manager', 'engineer'],
  crm: ['admin', 'general_manager', 'project_manager', 'consultant', 'client']
};

// Mock users for fallback when Supabase is not configured
const MOCK_USERS = [
  { id: '1', email: 'admin@midroc.com', password: 'password', name: 'John Anderson', role: 'admin', department: 'Administration' },
  { id: '2', email: 'gm@midroc.com', password: 'password', name: 'Sarah Mitchell', role: 'general_manager', department: 'Construction Management' },
  { id: '3', email: 'pm@midroc.com', password: 'password', name: 'Michael Rodriguez', role: 'project_manager', department: 'Highway Construction' },
  { id: '4', email: 'consultant@midroc.com', password: 'password', name: 'Emma Thompson', role: 'consultant', department: 'Urban Planning' },
  { id: '5', email: 'engineer@midroc.com', password: 'password', name: 'David Chen', role: 'engineer', department: 'Structural Engineering' },
  { id: '6', email: 'client@midroc.com', password: 'password', name: 'Robert Johnson', role: 'client', department: 'Metro Development Authority' },
  { id: '7', email: 'contractor@midroc.com', password: 'password', name: 'Lisa Davis', role: 'contractor', department: 'Construction Operations' },
  { id: '8', email: 'employee@midroc.com', password: 'password', name: 'James Wilson', role: 'employee', department: 'General Operations' }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    if (!isSupabaseConfigured) {
      // Use mock authentication
      const savedUser = localStorage.getItem('mockUser');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
      return;
    }

    try {
      // Get initial session
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setSupabaseUser(session?.user ?? null);

      if (session?.user) {
        await loadUserProfile(session.user.id);
      }

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setSession(session);
          setSupabaseUser(session?.user ?? null);

          if (session?.user) {
            await loadUserProfile(session.user.id);
          } else {
            setUser(null);
          }
        }
      );

      return () => subscription.unsubscribe();
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async (userId: string) => {
    try {
      if (!isSupabaseConfigured) return;

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading user profile:', error);
        return;
      }

      setUser({
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role,
        department: data.department
      });
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    if (!isSupabaseConfigured) {
      // Mock authentication
      const mockUser = MOCK_USERS.find(u => u.email === email && u.password === password);
      if (mockUser) {
        const user: User = {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          role: mockUser.role,
          department: mockUser.department
        };
        setUser(user);
        localStorage.setItem('mockUser', JSON.stringify(user));
        return { success: true };
      } else {
        return { success: false, message: 'Invalid email or password' };
      }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          return { success: false, message: 'Invalid email or password' };
        }
        return { success: false, message: error.message };
      }

      if (data.user) {
        await loadUserProfile(data.user.id);
        return { success: true };
      }

      return { success: false, message: 'Authentication failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'An unexpected error occurred' };
    }
  };

  const signup = async (name: string, email: string, password: string, role: string): Promise<{ success: boolean; message?: string }> => {
    if (!isSupabaseConfigured) {
      // Mock signup - add to pending users
      console.log('Mock signup:', { name, email, role });
      return { 
        success: true, 
        message: 'Account created successfully! Please wait for admin approval before signing in.' 
      };
    }

    try {
      // First create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          }
        }
      });

      if (authError) {
        return { success: false, message: authError.message };
      }

      // Then create the user profile with pending status
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert([{
            id: authData.user.id,
            email,
            name,
            role,
            status: 'pending'
          }]);

        if (profileError) {
          console.error('Error creating user profile:', profileError);
        }
      }

      return { 
        success: true, 
        message: 'Account created successfully! Please wait for admin approval before signing in.' 
      };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, message: 'An unexpected error occurred during registration' };
    }
  };

  const logout = async (): Promise<void> => {
    if (!isSupabaseConfigured) {
      // Mock logout
      setUser(null);
      localStorage.removeItem('mockUser');
      return;
    }

    try {
      await supabase.auth.signOut();
      setUser(null);
      setSupabaseUser(null);
      setSession(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const refreshUser = async (): Promise<void> => {
    if (!isSupabaseConfigured || !supabaseUser) return;
    await loadUserProfile(supabaseUser.id);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    const rolePermissions = ROLE_PERMISSIONS[user.role as keyof typeof ROLE_PERMISSIONS] || [];
    return rolePermissions.includes(permission);
  };

  const hasRole = (roles: string[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const canAccessModule = (module: string): boolean => {
    if (!user) return false;
    const moduleAccess = MODULE_ACCESS[module as keyof typeof MODULE_ACCESS] || [];
    return moduleAccess.includes(user.role);
  };

  const getPendingUsers = async (): Promise<PendingUser[]> => {
    try {
      const users = await DatabaseService.getPendingUsers();
      return users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        department: u.department || '',
        created_at: u.created_at,
        status: u.status as 'pending' | 'approved' | 'rejected'
      }));
    } catch (error) {
      console.error('Error getting pending users:', error);
      return [];
    }
  };

  const approveUser = async (userId: string): Promise<boolean> => {
    try {
      const success = await DatabaseService.approveUser(userId);
      if (success && isSupabaseConfigured) {
        // Also update auth status if needed
        // This would typically involve enabling the user's auth account
      }
      return success;
    } catch (error) {
      console.error('Error approving user:', error);
      return false;
    }
  };

  const rejectUser = async (userId: string): Promise<boolean> => {
    try {
      const success = await DatabaseService.rejectUser(userId);
      if (success && isSupabaseConfigured) {
        // Also disable the user's auth account if needed
      }
      return success;
    } catch (error) {
      console.error('Error rejecting user:', error);
      return false;
    }
  };

  const isAuthenticated = !!user;

  const value: AuthContextType = {
    user,
    supabaseUser,
    session,
    login,
    signup,
    logout,
    isAuthenticated,
    loading,
    hasPermission,
    hasRole,
    canAccessModule,
    getPendingUsers,
    approveUser,
    rejectUser,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
