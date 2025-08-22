import React, { useState } from 'react';
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
  FileText,
  Menu,
  X,
  ChevronDown
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
  { id: 'qa', name: 'Quality & Safety', icon: Shield },
  { id: 'crm', name: 'Client Relations', icon: UserCheck },
];

export const Navigation: React.FC<NavigationProps> = ({ currentModule, onModuleChange }) => {
  const { user, logout, canAccessModule } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleModuleChange = (moduleId: string) => {
    onModuleChange(moduleId);
    setIsMobileMenuOpen(false); // Close mobile menu after selection
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const availableModules = modules.filter(module => canAccessModule(module.id));

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-lg border-b border-gray-200 px-4 py-3 flex items-center justify-between relative z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-8 bg-white rounded-lg flex items-center justify-center shadow-md border">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fa277c4669d86451fa82a2c1c19c543ba%2F7073ebd30eee4e56929e82612bb1ae92?format=webp&width=800"
              alt="Midroc Investment Group"
              className="h-full w-auto object-contain"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">MIDROC ERP</h1>
            <p className="text-xs text-gray-600">Construction & Consulting</p>
          </div>
        </div>

        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-gray-700" />
          ) : (
            <Menu className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed top-0 left-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Mobile Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-10 bg-white rounded-lg flex items-center justify-center shadow-md border">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fa277c4669d86451fa82a2c1c19c543ba%2F7073ebd30eee4e56929e82612bb1ae92?format=webp&width=800"
                alt="Midroc Investment Group"
                className="h-full w-auto object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">MIDROC ERP</h1>
              <p className="text-sm text-gray-600">Construction & Consulting</p>
            </div>
          </div>

          {/* User Profile */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center border-2 border-blue-300">
                  <span className="text-blue-700 font-bold text-lg">
                    {user?.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-600 capitalize">{user?.role.replace('_', ' ')}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-xs text-green-600 font-medium">Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="space-y-1 px-4">
            {availableModules.map((module) => {
              const Icon = module.icon;
              const isActive = currentModule === module.id;

              return (
                <button
                  key={module.id}
                  onClick={() => handleModuleChange(module.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 shadow-sm'
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
            <div className="px-6 mt-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-700 font-medium">Employee Access</p>
                <p className="text-xs text-blue-600 mt-1">
                  Limited module access based on your role. Contact admin for additional permissions.
                </p>
              </div>
            </div>
          )}
        </nav>

        {/* Mobile Logout */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex bg-white shadow-lg h-screen w-64 fixed left-0 top-0 flex-col border-r border-gray-200">
        {/* Desktop Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-16 h-12 bg-white rounded-lg flex items-center justify-center shadow-md p-1 border">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fa277c4669d86451fa82a2c1c19c543ba%2F7073ebd30eee4e56929e82612bb1ae92?format=webp&width=800"
                alt="Midroc Investment Group"
                className="h-full w-auto object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">MIDROC ERP</h1>
              <p className="text-sm text-gray-600">Construction & Consulting</p>
            </div>
          </div>
        </div>

        {/* Desktop User Info */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100">
          <div className="relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="w-full group"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center border-2 border-green-300 cursor-pointer transform transition-all hover:scale-110 hover:shadow-lg">
                    <span className="text-green-700 font-bold text-lg">
                      {user?.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-gray-900 group-hover:text-green-700 transition-colors">{user?.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 capitalize">{user?.role.replace('_', ' ')}</span>
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        <span className="text-xs text-green-600 font-medium">Online</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-green-600 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </div>
            </button>

            {/* Profile Dropdown */}
            {isProfileDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <div className="text-xs font-bold text-gray-700">Projects</div>
                      <div className="text-sm font-semibold text-gray-800">
                        {user?.role === 'admin' || user?.role === 'general_manager' ? '12' : '3'}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <div className="text-xs font-bold text-gray-700">Tasks</div>
                      <div className="text-sm font-semibold text-gray-800">
                        {user?.role === 'admin' || user?.role === 'general_manager' ? '28' : '8'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Navigation Menu */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="space-y-1">
            {availableModules.map((module) => {
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

        {/* Desktop Logout */}
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
    </>
  );
};
