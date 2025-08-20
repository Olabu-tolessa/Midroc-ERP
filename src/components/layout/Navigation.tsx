import React from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  DollarSign,
  BarChart3,
  Shield,
  UserCheck,
  LogOut,
  Building2,
  HardHat,
  Eye,
  Briefcase,
  FileText
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface NavigationProps {
  currentModule: string;
  onModuleChange: (module: string) => void;
}

const modules = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { id: 'projects', name: 'Construction Projects', icon: HardHat },
  { id: 'supervision', name: 'Supervision', icon: Eye },
  { id: 'consulting', name: 'Consulting', icon: Briefcase },
  { id: 'contracts', name: 'Contract Management', icon: FileText },
  { id: 'users', name: 'User Management', icon: Users },
  { id: 'hr', name: 'Human Resources', icon: Users },
  { id: 'finance', name: 'Finance', icon: DollarSign },
  { id: 'bi', name: 'Business Intelligence', icon: BarChart3 },
  { id: 'qa', name: 'Quality & Safety', icon: Shield },
  { id: 'crm', name: 'Client Relations', icon: UserCheck },
];

export const Navigation: React.FC<NavigationProps> = ({ currentModule, onModuleChange }) => {
  const { user, logout, canAccessModule } = useAuth();

  return (
    <div className="bg-white shadow-lg h-screen w-64 fixed left-0 top-0 flex flex-col border-r border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-700 to-green-800 rounded-lg flex items-center justify-center shadow-md">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Midroc ERP</h1>
            <p className="text-sm text-gray-600">Construction & Consulting</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center border-2 border-green-300 cursor-pointer transform transition-all hover:scale-110 hover:shadow-lg">
              <span className="text-green-700 font-bold text-lg">
                {user?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex-1 cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-900 group-hover:text-green-700 transition-colors">{user?.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 capitalize">{user?.role.replace('_', ' ')}</span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span className="text-xs text-green-600 font-medium">Online</span>
                </div>
              </div>
              <div className="text-green-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Profile Stats */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="bg-white/50 rounded-lg p-2 text-center">
            <div className="text-xs font-bold text-green-700">Projects</div>
            <div className="text-sm font-semibold text-gray-800">
              {user?.role === 'admin' || user?.role === 'general_manager' ? '12' : '3'}
            </div>
          </div>
          <div className="bg-white/50 rounded-lg p-2 text-center">
            <div className="text-xs font-bold text-green-700">Tasks</div>
            <div className="text-sm font-semibold text-gray-800">
              {user?.role === 'admin' || user?.role === 'general_manager' ? '28' : '8'}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-4">
        <div className="space-y-1">
          {modules.filter(module => canAccessModule(module.id)).map((module) => {
            const Icon = module.icon;
            const isActive = currentModule === module.id;

            return (
              <button
                key={module.id}
                onClick={() => onModuleChange(module.id)}
                className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
                  isActive
                    ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-r-4 border-green-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{module.name}</span>
              </button>
            );
          })}
        </div>

        {/* Role-based access notice */}
        {user?.role === 'employee' && (
          <div className="px-6 mt-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-700 font-medium">Employee Access</p>
              <p className="text-xs text-blue-600 mt-1">
                Limited module access based on your role. Contact admin for additional permissions.
              </p>
            </div>
          </div>
        )}
      </nav>

      {/* Logout */}
      <div className="p-6 border-t border-gray-200">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};
