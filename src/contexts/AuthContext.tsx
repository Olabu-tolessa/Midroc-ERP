import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, role: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Anderson',
    email: 'admin@midroc.com',
    role: 'admin',
    department: 'Administration'
  },
  {
    id: '2',
    name: 'Sarah Mitchell',
    email: 'gm@midroc.com',
    role: 'general_manager',
    department: 'Construction Management'
  },
  {
    id: '3',
    name: 'Michael Rodriguez',
    email: 'pm@midroc.com',
    role: 'project_manager',
    department: 'Highway Construction'
  },
  {
    id: '4',
    name: 'Emma Thompson',
    email: 'consultant@midroc.com',
    role: 'consultant',
    department: 'Urban Planning'
  },
  {
    id: '5',
    name: 'David Chen',
    email: 'engineer@midroc.com',
    role: 'engineer',
    department: 'Structural Engineering'
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('erp_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === 'password') {
      setUser(foundUser);
      localStorage.setItem('erp_user', JSON.stringify(foundUser));
      setLoading(false);
      return true;
    }
    
    setLoading(false);
    return false;
  };

  const signup = async (name: string, email: string, password: string, role: string): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role: role as 'admin' | 'general_manager' | 'project_manager' | 'engineer' | 'consultant' | 'employee',
      department: 'General'
    };
    
    mockUsers.push(newUser);
    setUser(newUser);
    localStorage.setItem('erp_user', JSON.stringify(newUser));
    setLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('erp_user');
  };

  return (
    <AuthContext.Provider 
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        loading
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