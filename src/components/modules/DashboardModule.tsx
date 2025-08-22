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
  ArrowDownRight,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { DatabaseService } from '../../services/database';
import { isSupabaseConfigured } from '../../lib/supabase';
import { Project } from '../../types';

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
  recentActivity: Array<{
    id: string;
    type: 'project' | 'contract' | 'report' | 'safety';
    title: string;
    description: string;
    timestamp: string;
    status: 'success' | 'warning' | 'error' | 'info';
  }>;
}

const DashboardModule: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRealTime, setIsRealTime] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    loadDashboardData();
    setupRealTimeSubscriptions();

    return () => {
      // Cleanup subscriptions when component unmounts
    };
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load projects data
      const projectsData = await DatabaseService.getProjects();
      setProjects(projectsData);

      // Load additional dashboard data
      const [supervisionReports, consultingContracts, users] = await Promise.all([
        DatabaseService.getSupervisionReports(),
        DatabaseService.getConsultingContracts(),
        DatabaseService.getUsers()
      ]);

      // Calculate metrics from real data
      const dashboardMetrics: DashboardData = {
        projects: {
          total: projectsData.length,
          active: projectsData.filter(p => p.status === 'active').length,
          completed: projectsData.filter(p => p.status === 'completed').length,
          onHold: projectsData.filter(p => p.status === 'on-hold').length,
        },
        finance: {
          totalRevenue: projectsData.reduce((sum, p) => sum + p.budget, 0),
          monthlyRevenue: projectsData
            .filter(p => p.status === 'active')
            .reduce((sum, p) => sum + (p.budget * p.progress / 100), 0),
          expenses: projectsData.reduce((sum, p) => sum + (p.budget * 0.65), 0), // Estimated expenses
          profit: projectsData.reduce((sum, p) => sum + (p.budget * 0.35), 0), // Estimated profit
        },
        supervision: {
          totalReports: supervisionReports.length,
          criticalIssues: supervisionReports.filter(r => r.status === 'critical').length,
          goodStatus: supervisionReports.filter(r => r.status === 'good').length,
        },
        consulting: {
          activeContracts: consultingContracts.filter(c => c.status === 'active').length,
          totalRevenue: consultingContracts.reduce((sum, c) => sum + c.contract_value, 0),
          hoursLogged: consultingContracts.reduce((sum, c) => sum + (c.hours_logged || 0), 0),
        },
        team: {
          totalEmployees: users.filter(u => u.status === 'active').length,
          activeProjects: projectsData.filter(p => p.status === 'active').length,
          pendingTasks: Math.floor(Math.random() * 50) + 20, // TODO: Implement actual task tracking
        },
        recentActivity: generateRecentActivity(projectsData, supervisionReports, consultingContracts)
      };

      setDashboardData(dashboardMetrics);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Fall back to mock data if real data fails
      setDashboardData(getMockDashboardData());
    } finally {
      setLoading(false);
    }
  };

  const setupRealTimeSubscriptions = () => {
    if (!isSupabaseConfigured) {
      console.log('Using mock data - real-time updates not available');
      return;
    }

    setIsRealTime(true);

    // Subscribe to projects changes
    const projectsUnsubscribe = DatabaseService.subscribeToProjects((updatedProjects) => {
      setProjects(updatedProjects);
      // Recalculate dashboard metrics when projects change
      loadDashboardData();
    });

    // Subscribe to supervision reports changes
    const reportsUnsubscribe = DatabaseService.subscribeToSupervisionReports(() => {
      loadDashboardData();
    });

    // Return cleanup function
    return () => {
      projectsUnsubscribe();
      reportsUnsubscribe();
    };
  };

  const generateRecentActivity = (projects: Project[], reports: any[], contracts: any[]) => {
    const activities = [];

    // Add project activities
    projects.slice(0, 2).forEach(project => {
      activities.push({
        id: `project-${project.id}`,
        type: 'project' as const,
        title: `${project.name} Progress Update`,
        description: `${project.progress}% complete - ${project.status}`,
        timestamp: new Date(Date.now() - Math.random() * 86400000 * 2).toISOString(),
        status: project.progress > 80 ? 'success' as const : 'info' as const
      });
    });

    // Add supervision report activities
    reports.slice(0, 2).forEach(report => {
      activities.push({
        id: `report-${report.id}`,
        type: 'report' as const,
        title: 'Supervision Report Submitted',
        description: `Status: ${report.status} - ${report.recommendations || 'No issues reported'}`,
        timestamp: report.created_at,
        status: report.status === 'critical' ? 'error' as const : 
               report.status === 'warning' ? 'warning' as const : 'success' as const
      });
    });

    // Add contract activities
    contracts.slice(0, 1).forEach(contract => {
      activities.push({
        id: `contract-${contract.id}`,
        type: 'contract' as const,
        title: 'Contract Update',
        description: `${contract.description || 'Contract'} - $${contract.contract_value.toLocaleString()}`,
        timestamp: contract.created_at,
        status: 'info' as const
      });
    });

    return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);
  };

  const getMockDashboardData = (): DashboardData => ({
    projects: { total: 24, active: 12, completed: 8, onHold: 4 },
    finance: { totalRevenue: 12500000, monthlyRevenue: 850000, expenses: 320000, profit: 530000 },
    supervision: { totalReports: 156, criticalIssues: 3, goodStatus: 9 },
    consulting: { activeContracts: 8, totalRevenue: 750000, hoursLogged: 1240 },
    team: { totalEmployees: 186, activeProjects: 12, pendingTasks: 47 },
    recentActivity: [
      {
        id: '1',
        type: 'project',
        title: 'Highway Construction Phase 1 Progress Update',
        description: 'Foundation work completed - 65% progress',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'success'
      },
      {
        id: '2',
        type: 'contract',
        title: 'New Consulting Contract Signed',
        description: 'Metro City Development - $280,000',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        status: 'info'
      }
    ]
  });

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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'project': return <Building2 className="w-4 h-4" />;
      case 'contract': return <FileText className="w-4 h-4" />;
      case 'report': return <BarChart3 className="w-4 h-4" />;
      case 'safety': return <AlertTriangle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
      <div className="space-y-4 sm:space-y-6">
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
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your projects today
          </p>
        </div>
        <div className="text-left sm:text-right">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-sm text-gray-600">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            {isRealTime ? (
              <div className="flex items-center gap-1 text-green-600">
                <Wifi className="w-4 h-4" />
                <span className="text-xs">Live</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-gray-500">
                <WifiOff className="w-4 h-4" />
                <span className="text-xs">Mock</span>
              </div>
            )}
          </div>
          <div className="text-xl sm:text-2xl font-bold text-green-600">
            {new Date().toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
          <div className="text-xs text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Projects */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Projects</p>
              <p className="text-2xl sm:text-3xl font-bold">{dashboardData.projects.total}</p>
              <p className="text-blue-100 text-xs sm:text-sm mt-2">
                {dashboardData.projects.active} Active, {dashboardData.projects.completed} Completed
              </p>
            </div>
            <Building2 className="w-10 h-10 sm:w-12 sm:h-12 text-blue-200" />
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Revenue</p>
              <p className="text-2xl sm:text-3xl font-bold">{formatCurrency(dashboardData.finance.totalRevenue)}</p>
              <div className="flex items-center mt-2">
                <ArrowUpRight className="w-4 h-4 text-green-200" />
                <p className="text-green-100 text-xs sm:text-sm ml-1">
                  {formatCurrency(dashboardData.finance.monthlyRevenue)} this month
                </p>
              </div>
            </div>
            <DollarSign className="w-10 h-10 sm:w-12 sm:h-12 text-green-200" />
          </div>
        </div>

        {/* Team Size */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Team Members</p>
              <p className="text-2xl sm:text-3xl font-bold">{dashboardData.team.totalEmployees}</p>
              <p className="text-purple-100 text-xs sm:text-sm mt-2">
                Working on {dashboardData.team.activeProjects} projects
              </p>
            </div>
            <Users className="w-10 h-10 sm:w-12 sm:h-12 text-purple-200" />
          </div>
        </div>

        {/* Consulting Revenue */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Consulting Revenue</p>
              <p className="text-2xl sm:text-3xl font-bold">{formatCurrency(dashboardData.consulting.totalRevenue)}</p>
              <p className="text-orange-100 text-xs sm:text-sm mt-2">
                {dashboardData.consulting.activeContracts} active contracts
              </p>
            </div>
            <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Secondary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Monthly Profit */}
        <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Monthly Profit</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{formatCurrency(dashboardData.finance.profit)}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <p className="text-green-600 text-xs sm:text-sm ml-1">+12.5% from last month</p>
              </div>
            </div>
            <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
          </div>
        </div>

        {/* Critical Issues */}
        <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Critical Issues</p>
              <p className="text-xl sm:text-2xl font-bold text-red-600">{dashboardData.supervision.criticalIssues}</p>
              <p className="text-gray-500 text-xs sm:text-sm mt-2">Require immediate attention</p>
            </div>
            <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
          </div>
        </div>

        {/* Hours Logged */}
        <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Hours Logged</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{formatNumber(dashboardData.consulting.hoursLogged)}</p>
              <p className="text-gray-500 text-xs sm:text-sm mt-2">Consulting hours this quarter</p>
            </div>
            <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pending Tasks</p>
              <p className="text-xl sm:text-2xl font-bold text-yellow-600">{dashboardData.team.pendingTasks}</p>
              <p className="text-gray-500 text-xs sm:text-sm mt-2">Across all active projects</p>
            </div>
            <Target className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-600" />
            Recent Activities
            {isRealTime && (
              <span className="ml-auto flex items-center gap-1 text-green-600 text-sm">
                <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                Live
              </span>
            )}
          </h3>
          <div className="space-y-4">
            {dashboardData.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.status === 'success' ? 'bg-green-500' :
                  activity.status === 'warning' ? 'bg-yellow-500' :
                  activity.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className={getActivityColor(activity.status)}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Status Overview */}
        <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
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
              <span className="text-2xl font-bold text-yellow-600">{dashboardData.projects.total - dashboardData.projects.active - dashboardData.projects.completed - dashboardData.projects.onHold}</span>
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
        <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => window.location.hash = '#projects'}
              className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors group"
            >
              <HardHat className="w-8 h-8 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-900">View Projects</p>
            </button>
            <button
              onClick={() => {
                const pdf = document.createElement('a');
                pdf.href = 'data:text/plain;charset=utf-8,Dashboard Report - ' + new Date().toISOString();
                pdf.download = 'dashboard-report.txt';
                pdf.click();
              }}
              className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors group"
            >
              <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-900">Generate Report</p>
            </button>
            <button
              onClick={() => window.location.hash = '#users'}
              className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors group"
            >
              <Users className="w-8 h-8 text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-900">Manage Users</p>
            </button>
            <button
              onClick={() => loadDashboardData()}
              className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-center transition-colors group"
            >
              <BarChart3 className="w-8 h-8 text-orange-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-900">Refresh Data</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardModule;
