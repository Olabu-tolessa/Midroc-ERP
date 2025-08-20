import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Building2,
  HardHat,
  FileText,
  BarChart3,
  Activity,
  Target,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardData {
  projects: {
    total: number;
    active: number;
    completed: number;
    onHold: number;
  };
  finance: {
    totalRevenue: number;
    monthlyRevenue: number;
    expenses: number;
    profit: number;
  };
  supervision: {
    totalReports: number;
    criticalIssues: number;
    goodStatus: number;
  };
  consulting: {
    activeContracts: number;
    totalRevenue: number;
    hoursLogged: number;
  };
  team: {
    totalEmployees: number;
    activeProjects: number;
    pendingTasks: number;
  };
}

const DashboardModule: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Mock data - in real app, this would come from Supabase
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      const mockData: DashboardData = {
        projects: {
          total: 24,
          active: 12,
          completed: 8,
          onHold: 4
        },
        finance: {
          totalRevenue: 12500000,
          monthlyRevenue: 850000,
          expenses: 320000,
          profit: 530000
        },
        supervision: {
          totalReports: 156,
          criticalIssues: 3,
          goodStatus: 9
        },
        consulting: {
          activeContracts: 8,
          totalRevenue: 750000,
          hoursLogged: 1240
        },
        team: {
          totalEmployees: 186,
          activeProjects: 12,
          pendingTasks: 47
        }
      };

      setDashboardData(mockData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 bg-gray-200 rounded-xl"></div>
            <div className="h-80 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-gray-500">Failed to load dashboard data</div>
          <button 
            onClick={loadDashboardData}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your projects today
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          <div className="text-2xl font-bold text-green-600">
            {new Date().toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Projects */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Projects</p>
              <p className="text-3xl font-bold">{dashboardData.projects.total}</p>
              <p className="text-blue-100 text-sm mt-2">
                {dashboardData.projects.active} Active, {dashboardData.projects.completed} Completed
              </p>
            </div>
            <Building2 className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold">{formatCurrency(dashboardData.finance.totalRevenue)}</p>
              <div className="flex items-center mt-2">
                <ArrowUpRight className="w-4 h-4 text-green-200" />
                <p className="text-green-100 text-sm ml-1">
                  {formatCurrency(dashboardData.finance.monthlyRevenue)} this month
                </p>
              </div>
            </div>
            <DollarSign className="w-12 h-12 text-green-200" />
          </div>
        </div>

        {/* Team Size */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Team Members</p>
              <p className="text-3xl font-bold">{dashboardData.team.totalEmployees}</p>
              <p className="text-purple-100 text-sm mt-2">
                Working on {dashboardData.team.activeProjects} projects
              </p>
            </div>
            <Users className="w-12 h-12 text-purple-200" />
          </div>
        </div>

        {/* Consulting Revenue */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Consulting Revenue</p>
              <p className="text-3xl font-bold">{formatCurrency(dashboardData.consulting.totalRevenue)}</p>
              <p className="text-orange-100 text-sm mt-2">
                {dashboardData.consulting.activeContracts} active contracts
              </p>
            </div>
            <FileText className="w-12 h-12 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Secondary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Monthly Profit */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Monthly Profit</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(dashboardData.finance.profit)}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <p className="text-green-600 text-sm ml-1">+12.5% from last month</p>
              </div>
            </div>
            <BarChart3 className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        {/* Critical Issues */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Critical Issues</p>
              <p className="text-2xl font-bold text-red-600">{dashboardData.supervision.criticalIssues}</p>
              <p className="text-gray-500 text-sm mt-2">Require immediate attention</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        {/* Hours Logged */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Hours Logged</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(dashboardData.consulting.hoursLogged)}</p>
              <p className="text-gray-500 text-sm mt-2">Consulting hours this quarter</p>
            </div>
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pending Tasks</p>
              <p className="text-2xl font-bold text-yellow-600">{dashboardData.team.pendingTasks}</p>
              <p className="text-gray-500 text-sm mt-2">Across all active projects</p>
            </div>
            <Target className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-600" />
            Recent Activities
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Highway Construction Phase 1 Progress Update</p>
                <p className="text-xs text-gray-600">Foundation work completed - 65% progress</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">New Consulting Contract Signed</p>
                <p className="text-xs text-gray-600">Metro City Development - $280,000</p>
                <p className="text-xs text-gray-500">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Material Delivery Delay Alert</p>
                <p className="text-xs text-gray-600">Urban Development Project - 2 day delay</p>
                <p className="text-xs text-gray-500">6 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Quality Audit Completed</p>
                <p className="text-xs text-gray-600">Bridge Construction - ISO 9001 compliance verified</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Critical Safety Issue Reported</p>
                <p className="text-xs text-gray-600">Bridge Construction - Foundation inspection required</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Project Status Overview */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <HardHat className="w-5 h-5 text-green-600" />
            Project Status Overview
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Active Projects</p>
                  <p className="text-sm text-gray-600">Running on schedule</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-green-600">{dashboardData.projects.active}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Completed</p>
                  <p className="text-sm text-gray-600">Successfully delivered</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-blue-600">{dashboardData.projects.completed}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-gray-900">Planning Phase</p>
                  <p className="text-sm text-gray-600">Design and approval</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-yellow-600">4</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-medium text-gray-900">On Hold</p>
                  <p className="text-sm text-gray-600">Suspended or delayed</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-red-600">{dashboardData.projects.onHold}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {(user?.role === 'admin' || user?.role === 'general_manager') && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors">
              <HardHat className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">New Project</p>
            </button>
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors">
              <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Generate Report</p>
            </button>
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors">
              <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Manage Team</p>
            </button>
            <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-center transition-colors">
              <BarChart3 className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">View Analytics</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardModule;
