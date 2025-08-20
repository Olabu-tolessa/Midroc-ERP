import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2, Download, Calendar, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface SupervisionReport {
  id: string;
  project_id: string;
  project_title: string;
  supervisor_id: string;
  supervisor_name: string;
  report_date: string;
  status: 'good' | 'issues' | 'critical';
  issues: string;
  recommendations: string;
  created_at: string;
}

const SupervisionModule: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<SupervisionReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showNewReportModal, setShowNewReportModal] = useState(false);

  const isAuthorized = user?.role === 'admin' || user?.role === 'general_manager' || user?.role === 'project_manager';

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual Supabase query when DB is set up
      const mockReports: SupervisionReport[] = [
        {
          id: '1',
          project_id: 'p1',
          project_title: 'Highway Construction Phase 1',
          supervisor_id: '2',
          supervisor_name: 'Sarah Mitchell',
          report_date: '2024-01-15',
          status: 'good',
          issues: 'No major issues reported',
          recommendations: 'Continue with current approach',
          created_at: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          project_id: 'p2',
          project_title: 'Urban Development Project',
          supervisor_id: '3',
          supervisor_name: 'Michael Rodriguez',
          report_date: '2024-01-14',
          status: 'issues',
          issues: 'Material delivery delays affecting timeline',
          recommendations: 'Contact suppliers for expedited delivery',
          created_at: '2024-01-14T14:30:00Z'
        },
        {
          id: '3',
          project_id: 'p3',
          project_title: 'Bridge Construction',
          supervisor_id: '2',
          supervisor_name: 'Sarah Mitchell',
          report_date: '2024-01-13',
          status: 'critical',
          issues: 'Safety concerns identified in foundation work',
          recommendations: 'Immediate inspection required, halt work until resolved',
          created_at: '2024-01-13T09:15:00Z'
        }
      ];
      setReports(mockReports);
    } catch (error) {
      console.error('Error loading supervision reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.project_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.supervisor_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'issues': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="w-4 h-4" />;
      case 'issues': return <Clock className="w-4 h-4" />;
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const NewReportModal = () => {
    const [formData, setFormData] = useState({
      project_id: '',
      report_date: new Date().toISOString().split('T')[0],
      status: 'good',
      issues: '',
      recommendations: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        // Here you would save to Supabase
        console.log('Saving new supervision report:', formData);
        setShowNewReportModal(false);
        loadReports(); // Reload reports
      } catch (error) {
        console.error('Error creating report:', error);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
          <h3 className="text-xl font-bold text-gray-900 mb-4">New Supervision Report</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                <select
                  value={formData.project_id}
                  onChange={(e) => setFormData({...formData, project_id: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="">Select Project</option>
                  <option value="p1">Highway Construction Phase 1</option>
                  <option value="p2">Urban Development Project</option>
                  <option value="p3">Bridge Construction</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Report Date</label>
                <input
                  type="date"
                  value={formData.report_date}
                  onChange={(e) => setFormData({...formData, report_date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="good">Good</option>
                <option value="issues">Issues</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Issues</label>
              <textarea
                value={formData.issues}
                onChange={(e) => setFormData({...formData, issues: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                rows={3}
                placeholder="Describe any issues encountered..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recommendations</label>
              <textarea
                value={formData.recommendations}
                onChange={(e) => setFormData({...formData, recommendations: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                rows={3}
                placeholder="Provide recommendations..."
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowNewReportModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Create Report
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Supervision Management</h2>
          <p className="text-gray-600">Monitor project progress and team performance</p>
        </div>
        {isAuthorized && (
          <button
            onClick={() => setShowNewReportModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Report
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          <div className="w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Status</option>
              <option value="good">Good</option>
              <option value="issues">Issues</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid gap-6">
        {filteredReports.map((report) => (
          <div key={report.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{report.project_title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(report.report_date).toLocaleDateString()}
                  </span>
                  <span>Supervisor: {report.supervisor_name}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(report.status)}`}>
                  {getStatusIcon(report.status)}
                  {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Issues</h4>
                <p className="text-gray-600 text-sm">{report.issues}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
                <p className="text-gray-600 text-sm">{report.recommendations}</p>
              </div>
            </div>

            {isAuthorized && (
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-green-600">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {showNewReportModal && <NewReportModal />}
    </div>
  );
};

export default SupervisionModule;
