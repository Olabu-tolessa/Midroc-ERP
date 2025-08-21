import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2, Download, Calendar, AlertTriangle, CheckCircle, Clock, Shield, HardHat, FileText, Users, MapPin, Zap } from 'lucide-react';
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

interface QualitySafetyReport {
  id: string;
  project_id: string;
  project_title: string;
  inspector_id: string;
  inspector_name: string;
  inspection_date: string;
  inspection_type: 'structural_design' | 'quality' | 'safety' | 'combined';
  document_number: string;
  page_info: {
    current: number;
    total: number;
  };
  checklist_items: {
    section_number: number;
    section_title: string;
    items: {
      criteria: string;
      checked: boolean;
      not_required: boolean;
      remark: string;
    }[];
  }[];
  checked_by: string;
  checked_by_signature?: string;
  checked_by_date?: string;
  approved_by: string;
  approved_by_signature?: string;
  approved_by_date?: string;
  assigned_to?: string;
  assigned_to_name?: string;
  status: 'draft' | 'assigned' | 'in_progress' | 'completed' | 'approved';
  created_at: string;
}

const SupervisionModule: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<SupervisionReport[]>([]);
  const [qualitySafetyReports, setQualitySafetyReports] = useState<QualitySafetyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showNewReportModal, setShowNewReportModal] = useState(false);
  const [showNewQSModal, setShowNewQSModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'supervision' | 'quality_safety'>('supervision');

  const isAuthorized = user?.role === 'admin' || user?.role === 'general_manager' || user?.role === 'project_manager';

  useEffect(() => {
    loadReports();
    loadQualitySafetyReports();
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

  const loadQualitySafetyReports = async () => {
    try {
      // Mock data for Quality & Safety reports
      const mockQSReports: QualitySafetyReport[] = [
        {
          id: 'qs1',
          project_id: 'p1',
          project_title: 'Highway Construction Phase 1',
          inspector_id: '5',
          inspector_name: 'David Chen',
          inspection_date: '2024-01-15',
          inspection_type: 'combined',
          checklist_items: [
            {
              category: 'Personal Protective Equipment',
              items: [
                { description: 'Hard hats worn by all personnel', status: 'pass' },
                { description: 'Safety vests visible and clean', status: 'pass' },
                { description: 'Steel-toed boots worn', status: 'fail', notes: 'Two workers wearing regular shoes' }
              ]
            },
            {
              category: 'Site Safety',
              items: [
                { description: 'Proper barriers around excavation', status: 'pass' },
                { description: 'Emergency exits clearly marked', status: 'pass' },
                { description: 'First aid station accessible', status: 'pass' }
              ]
            },
            {
              category: 'Quality Control',
              items: [
                { description: 'Material quality meets specifications', status: 'pass' },
                { description: 'Workmanship according to standards', status: 'pass' },
                { description: 'Measurements within tolerance', status: 'fail', notes: 'Foundation depth 5cm short' }
              ]
            }
          ],
          overall_score: 75,
          critical_issues: ['Foundation depth below specification', 'PPE compliance issue'],
          recommendations: ['Immediate correction of foundation depth', 'Mandatory PPE training for all workers'],
          photos: [],
          status: 'requires_action',
          created_at: '2024-01-15T10:00:00Z'
        },
        {
          id: 'qs2',
          project_id: 'p2',
          project_title: 'Urban Development Project',
          inspector_id: '5',
          inspector_name: 'David Chen',
          inspection_date: '2024-01-14',
          inspection_type: 'safety',
          checklist_items: [
            {
              category: 'Personal Protective Equipment',
              items: [
                { description: 'Hard hats worn by all personnel', status: 'pass' },
                { description: 'Safety vests visible and clean', status: 'pass' },
                { description: 'Steel-toed boots worn', status: 'pass' }
              ]
            },
            {
              category: 'Equipment Safety',
              items: [
                { description: 'Machinery properly maintained', status: 'pass' },
                { description: 'Safety guards in place', status: 'pass' },
                { description: 'Emergency stop buttons functional', status: 'pass' }
              ]
            }
          ],
          overall_score: 95,
          critical_issues: [],
          recommendations: ['Continue current safety practices'],
          photos: [],
          status: 'approved',
          created_at: '2024-01-14T14:30:00Z'
        }
      ];
      setQualitySafetyReports(mockQSReports);
    } catch (error) {
      console.error('Error loading quality & safety reports:', error);
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.project_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.supervisor_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredQSReports = qualitySafetyReports.filter(report => {
    const matchesSearch = report.project_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.inspector_name.toLowerCase().includes(searchTerm.toLowerCase());
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

  const NewQualitySafetyModal = () => {
    const [formData, setFormData] = useState({
      project_id: '',
      inspection_date: new Date().toISOString().split('T')[0],
      inspection_type: 'combined',
      checklist_items: [
        {
          category: 'Personal Protective Equipment',
          items: [
            { description: 'Hard hats worn by all personnel', status: 'pass' as const, notes: '' },
            { description: 'Safety vests visible and clean', status: 'pass' as const, notes: '' },
            { description: 'Steel-toed boots worn', status: 'pass' as const, notes: '' },
            { description: 'Eye protection used when required', status: 'pass' as const, notes: '' }
          ]
        },
        {
          category: 'Site Safety',
          items: [
            { description: 'Proper barriers around excavation', status: 'pass' as const, notes: '' },
            { description: 'Emergency exits clearly marked', status: 'pass' as const, notes: '' },
            { description: 'First aid station accessible', status: 'pass' as const, notes: '' },
            { description: 'Fire extinguishers available and inspected', status: 'pass' as const, notes: '' }
          ]
        },
        {
          category: 'Equipment Safety',
          items: [
            { description: 'Machinery properly maintained', status: 'pass' as const, notes: '' },
            { description: 'Safety guards in place', status: 'pass' as const, notes: '' },
            { description: 'Emergency stop buttons functional', status: 'pass' as const, notes: '' },
            { description: 'Electrical equipment properly grounded', status: 'pass' as const, notes: '' }
          ]
        },
        {
          category: 'Quality Control',
          items: [
            { description: 'Material quality meets specifications', status: 'pass' as const, notes: '' },
            { description: 'Workmanship according to standards', status: 'pass' as const, notes: '' },
            { description: 'Measurements within tolerance', status: 'pass' as const, notes: '' },
            { description: 'Documentation complete and accurate', status: 'pass' as const, notes: '' }
          ]
        }
      ],
      critical_issues: '',
      recommendations: ''
    });

    const updateChecklistItem = (categoryIndex: number, itemIndex: number, field: string, value: any) => {
      const updatedChecklist = [...formData.checklist_items];
      updatedChecklist[categoryIndex].items[itemIndex] = {
        ...updatedChecklist[categoryIndex].items[itemIndex],
        [field]: value
      };
      setFormData({...formData, checklist_items: updatedChecklist});
    };

    const calculateScore = () => {
      let totalItems = 0;
      let passedItems = 0;
      formData.checklist_items.forEach(category => {
        category.items.forEach(item => {
          if (item.status !== 'na') {
            totalItems++;
            if (item.status === 'pass') passedItems++;
          }
        });
      });
      return totalItems > 0 ? Math.round((passedItems / totalItems) * 100) : 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const newReport: QualitySafetyReport = {
          id: Date.now().toString(),
          project_id: formData.project_id,
          project_title: formData.project_id === 'p1' ? 'Highway Construction Phase 1' :
                        formData.project_id === 'p2' ? 'Urban Development Project' : 'Bridge Construction',
          inspector_id: user?.id || '',
          inspector_name: user?.name || '',
          inspection_date: formData.inspection_date,
          inspection_type: formData.inspection_type as any,
          checklist_items: formData.checklist_items,
          overall_score: calculateScore(),
          critical_issues: formData.critical_issues.split('\n').filter(issue => issue.trim()),
          recommendations: formData.recommendations.split('\n').filter(rec => rec.trim()),
          photos: [],
          status: calculateScore() >= 80 ? 'approved' : 'requires_action',
          created_at: new Date().toISOString()
        };

        setQualitySafetyReports(prev => [...prev, newReport]);
        setShowNewQSModal(false);
      } catch (error) {
        console.error('Error creating quality & safety report:', error);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-bold text-gray-900 mb-4">New Quality & Safety Inspection</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Inspection Date</label>
                <input
                  type="date"
                  value={formData.inspection_date}
                  onChange={(e) => setFormData({...formData, inspection_date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Inspection Type</label>
                <select
                  value={formData.inspection_type}
                  onChange={(e) => setFormData({...formData, inspection_type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="quality">Quality Only</option>
                  <option value="safety">Safety Only</option>
                  <option value="combined">Quality & Safety</option>
                </select>
              </div>
            </div>

            {/* Checklist Items */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-gray-900">Inspection Checklist</h4>
              {formData.checklist_items.map((category, categoryIndex) => (
                <div key={categoryIndex} className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                    {category.category === 'Personal Protective Equipment' && <HardHat className="w-5 h-5" />}
                    {category.category === 'Site Safety' && <Shield className="w-5 h-5" />}
                    {category.category === 'Equipment Safety' && <Zap className="w-5 h-5" />}
                    {category.category === 'Quality Control' && <CheckCircle className="w-5 h-5" />}
                    {category.category}
                  </h5>
                  <div className="space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="bg-white rounded p-3 border">
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <div className="font-medium text-sm text-gray-800 mb-2">{item.description}</div>
                            <div className="flex gap-4">
                              {(['pass', 'fail', 'na'] as const).map(status => (
                                <label key={status} className="flex items-center gap-2 text-sm">
                                  <input
                                    type="radio"
                                    name={`item-${categoryIndex}-${itemIndex}`}
                                    value={status}
                                    checked={item.status === status}
                                    onChange={(e) => updateChecklistItem(categoryIndex, itemIndex, 'status', e.target.value)}
                                    className="w-4 h-4 text-green-600"
                                  />
                                  <span className={`capitalize ${
                                    status === 'pass' ? 'text-green-600' :
                                    status === 'fail' ? 'text-red-600' : 'text-gray-600'
                                  }`}>
                                    {status === 'na' ? 'N/A' : status}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                          <div className="w-64">
                            <input
                              type="text"
                              placeholder="Notes..."
                              value={item.notes || ''}
                              onChange={(e) => updateChecklistItem(categoryIndex, itemIndex, 'notes', e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-green-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Score Display */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-blue-800">Overall Score:</span>
                <span className={`text-2xl font-bold ${
                  calculateScore() >= 90 ? 'text-green-600' :
                  calculateScore() >= 70 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {calculateScore()}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Critical Issues (one per line)</label>
                <textarea
                  value={formData.critical_issues}
                  onChange={(e) => setFormData({...formData, critical_issues: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  rows={4}
                  placeholder="List any critical issues that require immediate attention..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recommendations (one per line)</label>
                <textarea
                  value={formData.recommendations}
                  onChange={(e) => setFormData({...formData, recommendations: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  rows={4}
                  placeholder="Provide recommendations for improvements..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowNewQSModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Create Inspection Report
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
          <p className="text-gray-600">Monitor project progress, quality assurance, and safety</p>
        </div>
        {isAuthorized && (
          <div className="flex gap-2">
            {activeTab === 'supervision' && (
              <button
                onClick={() => setShowNewReportModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Report
              </button>
            )}
            {activeTab === 'quality_safety' && (
              <button
                onClick={() => setShowNewQSModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New QS Inspection
              </button>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('supervision')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'supervision'
              ? 'border-green-500 text-green-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <FileText className="w-4 h-4" />
          Supervision Reports ({filteredReports.length})
        </button>
        <button
          onClick={() => setActiveTab('quality_safety')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'quality_safety'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <Shield className="w-4 h-4" />
          Quality & Safety ({filteredQSReports.length})
        </button>
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
              {activeTab === 'supervision' ? (
                <>
                  <option value="good">Good</option>
                  <option value="issues">Issues</option>
                  <option value="critical">Critical</option>
                </>
              ) : (
                <>
                  <option value="approved">Approved</option>
                  <option value="requires_action">Requires Action</option>
                  <option value="rejected">Rejected</option>
                </>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'supervision' ? (
        /* Supervision Reports Grid */
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
      ) : (
        /* Quality & Safety Reports Grid */
        <div className="grid gap-6">
          {filteredQSReports.map((report) => (
            <div key={report.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{report.project_title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(report.inspection_date).toLocaleDateString()}
                    </span>
                    <span>Inspector: {report.inspector_name}</span>
                    <span className="capitalize flex items-center gap-1">
                      {report.inspection_type === 'quality' && <CheckCircle className="w-4 h-4" />}
                      {report.inspection_type === 'safety' && <Shield className="w-4 h-4" />}
                      {report.inspection_type === 'combined' && <HardHat className="w-4 h-4" />}
                      {report.inspection_type.replace('_', ' & ')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    report.overall_score >= 90 ? 'bg-green-100 text-green-800' :
                    report.overall_score >= 70 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {report.overall_score}% Score
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                    report.status === 'approved' ? 'bg-green-100 text-green-800' :
                    report.status === 'requires_action' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {report.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                    {report.status === 'requires_action' && <AlertTriangle className="w-3 h-3" />}
                    {report.status === 'rejected' && <AlertTriangle className="w-3 h-3" />}
                    {report.status.replace('_', ' ').charAt(0).toUpperCase() + report.status.replace('_', ' ').slice(1)}
                  </span>
                </div>
              </div>

              {/* Checklist Summary */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-3">Inspection Summary</h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {report.checklist_items.map((category, index) => {
                    const passCount = category.items.filter(item => item.status === 'pass').length;
                    const totalCount = category.items.filter(item => item.status !== 'na').length;
                    const score = totalCount > 0 ? Math.round((passCount / totalCount) * 100) : 0;

                    return (
                      <div key={index} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          {category.category === 'Personal Protective Equipment' && <HardHat className="w-4 h-4" />}
                          {category.category === 'Site Safety' && <Shield className="w-4 h-4" />}
                          {category.category === 'Equipment Safety' && <Zap className="w-4 h-4" />}
                          {category.category === 'Quality Control' && <CheckCircle className="w-4 h-4" />}
                          <span className="font-medium text-sm">{category.category}</span>
                        </div>
                        <div className="text-xs text-gray-600">{passCount}/{totalCount} items</div>
                        <div className={`text-sm font-medium ${
                          score >= 90 ? 'text-green-600' :
                          score >= 70 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {score}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Critical Issues & Recommendations */}
              {(report.critical_issues.length > 0 || report.recommendations.length > 0) && (
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  {report.critical_issues.length > 0 && (
                    <div>
                      <h4 className="font-medium text-red-800 mb-2 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        Critical Issues
                      </h4>
                      <ul className="text-sm text-red-700 space-y-1">
                        {report.critical_issues.map((issue, index) => (
                          <li key={index} className="flex items-start gap-1">
                            <span className="text-red-500 mt-1">•</span>
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {report.recommendations.length > 0 && (
                    <div>
                      <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        Recommendations
                      </h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        {report.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-1">
                            <span className="text-blue-500 mt-1">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

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
      )}

      {showNewReportModal && <NewReportModal />}
      {showNewQSModal && <NewQualitySafetyModal />}
    </div>
  );
};

export default SupervisionModule;
