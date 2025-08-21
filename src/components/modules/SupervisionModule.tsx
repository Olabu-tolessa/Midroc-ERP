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
  const [showQSSignModal, setShowQSSignModal] = useState(false);
  const [showQSAssignModal, setShowQSAssignModal] = useState(false);
  const [selectedQSReport, setSelectedQSReport] = useState<QualitySafetyReport | null>(null);
  const [signingAs, setSigningAs] = useState<'checker' | 'approver'>('checker');
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
      // Mock data for Quality & Safety reports (Structural Design Checklist format)
      const mockQSReports: QualitySafetyReport[] = [
        {
          id: 'qs1',
          project_id: 'p1',
          project_title: 'Highway Construction Phase 1',
          inspector_id: '5',
          inspector_name: 'David Chen',
          inspection_date: '2024-01-15',
          inspection_type: 'structural_design',
          document_number: 'GCAE/COE/004',
          page_info: { current: 1, total: 3 },
          checklist_items: [
            {
              section_number: 1,
              section_title: 'General requirements',
              items: [
                { criteria: 'Correspondence of details to the results of statical analysis', checked: true, not_required: false, remark: '' },
                { criteria: 'Completeness of dimensions and designations needed for checking the structural components', checked: true, not_required: false, remark: '' },
                { criteria: 'Completeness of dimensions and designations for connections and with reference to other relevant drawings where necessary', checked: false, not_required: false, remark: 'Missing connection details on sheet 3' },
                { criteria: 'Appropriateness of scales used for the structural drawings', checked: true, not_required: false, remark: '' },
                { criteria: 'Amendments to affected drawings due to alterations or modifications', checked: true, not_required: false, remark: '' }
              ]
            },
            {
              section_number: 2,
              section_title: 'Foundation details',
              items: [
                { criteria: 'Foundation plan showing the foundation layout including layout of columns, grade beams, shear walls, slabs, etc and with complete dimensions and designations', checked: true, not_required: false, remark: '' },
                { criteria: 'Sections for foundations and all relevant details and reinforcements, complete with dimensions and levels and provision of lean concrete', checked: false, not_required: false, remark: 'Lean concrete specification missing' },
                { criteria: 'Longitudinal section with reinforcements indicating beam location, dimensions and level', checked: true, not_required: false, remark: '' }
              ]
            }
          ],
          checked_by: 'David Chen',
          approved_by: 'Sarah Mitchell',
          assigned_to: '5',
          assigned_to_name: 'David Chen',
          status: 'in_progress',
          created_at: '2024-01-15T10:00:00Z'
        },
        {
          id: 'qs2',
          project_id: 'p2',
          project_title: 'Urban Development Project',
          inspector_id: '5',
          inspector_name: 'David Chen',
          inspection_date: '2024-01-14',
          inspection_type: 'structural_design',
          document_number: 'GCAE/COE/005',
          page_info: { current: 1, total: 2 },
          checklist_items: [
            {
              section_number: 1,
              section_title: 'General requirements',
              items: [
                { criteria: 'Correspondence of details to the results of statical analysis', checked: true, not_required: false, remark: '' },
                { criteria: 'Completeness of dimensions and designations needed for checking the structural components', checked: true, not_required: false, remark: '' },
                { criteria: 'Completeness of dimensions and designations for connections and with reference to other relevant drawings where necessary', checked: true, not_required: false, remark: '' }
              ]
            }
          ],
          checked_by: 'David Chen',
          checked_by_signature: 'signed',
          checked_by_date: '2024-01-14T14:30:00Z',
          approved_by: 'Sarah Mitchell',
          approved_by_signature: 'signed',
          approved_by_date: '2024-01-14T15:00:00Z',
          assigned_to: '5',
          assigned_to_name: 'David Chen',
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
      inspection_type: 'structural_design',
      document_number: `GCAE/COE/${String(Date.now()).slice(-3)}`,
      page_info: { current: 1, total: 3 },
      checklist_items: [
        {
          section_number: 1,
          section_title: 'General requirements',
          items: [
            { criteria: 'Correspondence of details to the results of statical analysis', checked: false, not_required: false, remark: '' },
            { criteria: 'Completeness of dimensions and designations needed for checking the structural components', checked: false, not_required: false, remark: '' },
            { criteria: 'Completeness of dimensions and designations for connections and with reference to other relevant drawings where necessary', checked: false, not_required: false, remark: '' },
            { criteria: 'Appropriateness of scales used for the structural drawings', checked: false, not_required: false, remark: '' },
            { criteria: 'Amendments to affected drawings due to alterations or modifications', checked: false, not_required: false, remark: '' },
            { criteria: 'Essential notes on drawings specifying material strength (Example - concrete, steel grade etc), cover to reinforcements, notes to details, bar overlaps, foundation depths, earthworks, fills and compaction standards', checked: false, not_required: false, remark: '' }
          ]
        },
        {
          section_number: 2,
          section_title: 'Foundation details',
          items: [
            { criteria: 'Foundation plan showing the foundation layout including layout of columns, grade beams, shear walls, slabs, etc and with complete dimensions and designations', checked: false, not_required: false, remark: '' },
            { criteria: 'Sections for foundations and all relevant details and reinforcements, complete with dimensions and levels and provision of lean concrete', checked: false, not_required: false, remark: '' },
            { criteria: 'Longitudinal section with reinforcements indicating beam location, dimensions and level', checked: false, not_required: false, remark: '' },
            { criteria: 'Indicating diameter, length, shape and lap of re-bars for longitudinal section, size and spacing of stirrups and supplementary reinforcements where necessary', checked: false, not_required: false, remark: '' }
          ]
        },
        {
          section_number: 3,
          section_title: 'Beams',
          items: [
            { criteria: 'Sections along beams where necessary and all relevant details and reinforcements complete with dimensions and details of stirrups', checked: false, not_required: false, remark: '' },
            { criteria: 'Longitudinal section with reinforcements indicating column/wall location, dimensions and level', checked: false, not_required: false, remark: '' },
            { criteria: 'Indicating diameter, length, shape and lap of re-bars for longitudinal section, size and spacing of stirrups and supplementary reinforcements where necessary', checked: false, not_required: false, remark: '' }
          ]
        },
        {
          section_number: 4,
          section_title: 'Columns and reinforced concrete walls',
          items: [
            { criteria: 'Longitudinal section with reinforcements indicating column/wall location, dimensions and level', checked: false, not_required: false, remark: '' },
            { criteria: 'Indicating diameter, length, shape and lap of re-bars for longitudinal section, size and spacing of stirrups and supplementary reinforcements where necessary', checked: false, not_required: false, remark: '' },
            { criteria: 'Sections along column/wall height where necessary and all relevant details and reinforcements complete with dimensions and details of stirrups', checked: false, not_required: false, remark: '' }
          ]
        }
      ],
      checked_by: user?.name || '',
      approved_by: '',
      assigned_to: ''
    });

    const updateChecklistItem = (sectionIndex: number, itemIndex: number, field: string, value: any) => {
      const updatedChecklist = [...formData.checklist_items];
      updatedChecklist[sectionIndex].items[itemIndex] = {
        ...updatedChecklist[sectionIndex].items[itemIndex],
        [field]: value
      };
      setFormData({...formData, checklist_items: updatedChecklist});
    };

    const calculateCompletionScore = () => {
      let totalItems = 0;
      let checkedItems = 0;
      formData.checklist_items.forEach(section => {
        section.items.forEach(item => {
          if (!item.not_required) {
            totalItems++;
            if (item.checked) checkedItems++;
          }
        });
      });
      return totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;
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
          document_number: formData.document_number,
          page_info: formData.page_info,
          checklist_items: formData.checklist_items,
          checked_by: formData.checked_by,
          approved_by: formData.approved_by,
          assigned_to: formData.assigned_to,
          status: formData.assigned_to ? 'assigned' : 'draft',
          created_at: new Date().toISOString()
        };

        setQualitySafetyReports(prev => [...prev, newReport]);
        setShowNewQSModal(false);
      } catch (error) {
        console.error('Error creating quality & safety report:', error);
      }
    };

    // Get available users for assignment
    const getAvailableUsers = () => {
      const createdUsers = JSON.parse(localStorage.getItem('erp_created_users') || '[]');
      const mockUsers = [
        { id: '1', name: 'John Anderson', email: 'admin@midroc.com', role: 'admin' },
        { id: '2', name: 'Sarah Mitchell', email: 'gm@midroc.com', role: 'general_manager' },
        { id: '3', name: 'Michael Rodriguez', email: 'pm@midroc.com', role: 'project_manager' },
        { id: '4', name: 'Emma Thompson', email: 'consultant@midroc.com', role: 'consultant' },
        { id: '5', name: 'David Chen', email: 'engineer@midroc.com', role: 'engineer' }
      ];
      return [...mockUsers, ...createdUsers].filter(u => u.role === 'engineer' || u.role === 'project_manager');
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">New Structural Design Checklist</h3>

            {/* Basic Info Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-4 gap-4 mb-6">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Document No.</label>
                  <input
                    type="text"
                    value={formData.document_number}
                    onChange={(e) => setFormData({...formData, document_number: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="GCAE/COE/004"
                  />
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assign to</label>
                  <select
                    value={formData.assigned_to}
                    onChange={(e) => setFormData({...formData, assigned_to: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Select Engineer</option>
                    {getAvailableUsers().map(user => (
                      <option key={user.id} value={user.id}>{user.name} ({user.role})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Professional Checklist Table */}
              <div className="border-2 border-gray-800 bg-white">
                {/* Header */}
                <div className="bg-gray-100 border-b-2 border-gray-800 p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="bg-green-600 text-white p-2 text-xs font-bold">AMI</div>
                      <div className="text-xs">
                        <div className="font-bold">Company Name:</div>
                        <div>Gobalaffo Consulting Architects & Engineers P.L.C</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold">Document No.</div>
                      <div className="text-red-600 font-bold">{formData.document_number}</div>
                    </div>
                    <div className="text-right text-xs">
                      <div>Effective Date: {formData.inspection_date}</div>
                      <div>Issue No: 1</div>
                      <div>Page: {formData.page_info.current} of {formData.page_info.total}</div>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div className="bg-gray-200 border-b-2 border-gray-800 py-3 text-center">
                  <h2 className="text-xl font-bold">Structural Design Checklist</h2>
                </div>

                {/* Project Name Field */}
                <div className="border-b border-gray-400 p-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">Project Name:</span>
                    <div className="border-b border-gray-800 flex-1 min-h-[1.5rem] px-2">
                      {formData.project_id === 'p1' ? 'Highway Construction Phase 1' :
                       formData.project_id === 'p2' ? 'Urban Development Project' :
                       formData.project_id === 'p3' ? 'Bridge Construction' : ''}
                    </div>
                  </div>
                </div>

                {/* Checklist Table */}
                <table className="w-full">
                  <thead>
                    <tr className="bg-yellow-200">
                      <th className="border border-gray-800 px-2 py-2 w-12 text-sm font-bold">No</th>
                      <th className="border border-gray-800 px-4 py-2 text-sm font-bold">Criteria</th>
                      <th className="border border-gray-800 px-2 py-2 w-20 text-sm font-bold">Checked</th>
                      <th className="border border-gray-800 px-2 py-2 w-24 text-sm font-bold">Not required</th>
                      <th className="border border-gray-800 px-4 py-2 w-32 text-sm font-bold">Remark</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.checklist_items.map((section, sectionIndex) => (
                      <React.Fragment key={sectionIndex}>
                        {/* Section Header */}
                        <tr>
                          <td className="border border-gray-800 px-2 py-2 font-bold text-center bg-gray-50">
                            {section.section_number}
                          </td>
                          <td className="border border-gray-800 px-4 py-2 font-bold bg-gray-50" colSpan={4}>
                            {section.section_title}
                          </td>
                        </tr>
                        {/* Section Items */}
                        {section.items.map((item, itemIndex) => (
                          <tr key={itemIndex} className="hover:bg-gray-50">
                            <td className="border border-gray-800 px-2 py-2 text-center text-sm"></td>
                            <td className="border border-gray-800 px-4 py-2 text-sm">
                              {item.criteria}
                            </td>
                            <td className="border border-gray-800 px-2 py-2 text-center">
                              <input
                                type="checkbox"
                                checked={item.checked}
                                onChange={(e) => updateChecklistItem(sectionIndex, itemIndex, 'checked', e.target.checked)}
                                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                              />
                            </td>
                            <td className="border border-gray-800 px-2 py-2 text-center">
                              <input
                                type="checkbox"
                                checked={item.not_required}
                                onChange={(e) => updateChecklistItem(sectionIndex, itemIndex, 'not_required', e.target.checked)}
                                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                              />
                            </td>
                            <td className="border border-gray-800 px-2 py-2">
                              <input
                                type="text"
                                value={item.remark}
                                onChange={(e) => updateChecklistItem(sectionIndex, itemIndex, 'remark', e.target.value)}
                                className="w-full px-2 py-1 text-xs border-0 focus:ring-0 focus:outline-none bg-transparent"
                                placeholder="Enter remarks..."
                              />
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>

                {/* Signature Section */}
                <div className="border-t-2 border-gray-800 p-4">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold">Checked by:</span>
                        <input
                          type="text"
                          value={formData.checked_by}
                          onChange={(e) => setFormData({...formData, checked_by: e.target.value})}
                          className="flex-1 border-b border-gray-800 focus:outline-none"
                          placeholder="Name"
                        />
                      </div>
                      <div className="mt-4">
                        <span className="text-sm text-gray-600">Signature:</span>
                        <div className="border-b border-gray-300 mt-1 h-8"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold">Approved by:</span>
                        <input
                          type="text"
                          value={formData.approved_by}
                          onChange={(e) => setFormData({...formData, approved_by: e.target.value})}
                          className="flex-1 border-b border-gray-800 focus:outline-none"
                          placeholder="Name"
                        />
                      </div>
                      <div className="mt-4">
                        <span className="text-sm text-gray-600">Signature:</span>
                        <div className="border-b border-gray-300 mt-1 h-8"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Completion Score */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-blue-800">Completion Score:</span>
                  <span className={`text-2xl font-bold ${
                    calculateCompletionScore() >= 90 ? 'text-green-600' :
                    calculateCompletionScore() >= 70 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {calculateCompletionScore()}%
                  </span>
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
                  Create Checklist
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const QSSignatureModal = () => {
    const sigCanvas = useRef<SignatureCanvas>(null);

    const clearSignature = () => {
      sigCanvas.current?.clear();
    };

    const saveSignature = () => {
      if (!selectedQSReport) return;

      const signatureData = sigCanvas.current?.toDataURL();
      if (!signatureData) return;

      const updatedReport = {
        ...selectedQSReport,
        ...(signingAs === 'checker' ? {
          checked_by_signature: signatureData,
          checked_by_date: new Date().toISOString(),
          status: selectedQSReport.approved_by_signature ? 'approved' : 'completed'
        } : {
          approved_by_signature: signatureData,
          approved_by_date: new Date().toISOString(),
          status: 'approved'
        })
      };

      setQualitySafetyReports(prev => prev.map(report =>
        report.id === selectedQSReport.id ? updatedReport as QualitySafetyReport : report
      ));

      setShowQSSignModal(false);
      setSelectedQSReport(null);
    };

    if (!selectedQSReport) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Digital Signature - {signingAs === 'checker' ? 'Checked by' : 'Approved by'}
          </h3>

          <div className="space-y-4">
            <div className="border-2 border-gray-300 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Sign below:</p>
              <div className="border border-gray-200 rounded">
                <SignatureCanvas
                  ref={sigCanvas}
                  canvasProps={{
                    width: 400,
                    height: 200,
                    className: 'signature-canvas w-full'
                  }}
                  backgroundColor="white"
                />
              </div>
            </div>

            <div className="flex justify-between gap-3">
              <button
                onClick={clearSignature}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Clear
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowQSSignModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={saveSignature}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Save Signature
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const QSAssignmentModal = () => {
    const [assignTo, setAssignTo] = useState('');

    const getAvailableUsers = () => {
      const createdUsers = JSON.parse(localStorage.getItem('erp_created_users') || '[]');
      const mockUsers = [
        { id: '1', name: 'John Anderson', email: 'admin@midroc.com', role: 'admin' },
        { id: '2', name: 'Sarah Mitchell', email: 'gm@midroc.com', role: 'general_manager' },
        { id: '3', name: 'Michael Rodriguez', email: 'pm@midroc.com', role: 'project_manager' },
        { id: '4', name: 'Emma Thompson', email: 'consultant@midroc.com', role: 'consultant' },
        { id: '5', name: 'David Chen', email: 'engineer@midroc.com', role: 'engineer' }
      ];
      return [...mockUsers, ...createdUsers].filter(u => u.role === 'engineer' || u.role === 'project_manager');
    };

    const handleAssign = () => {
      if (!selectedQSReport || !assignTo) return;

      const assignedUser = getAvailableUsers().find(u => u.id === assignTo);
      const updatedReport = {
        ...selectedQSReport,
        assigned_to: assignTo,
        assigned_to_name: assignedUser?.name || '',
        status: 'assigned' as const
      };

      setQualitySafetyReports(prev => prev.map(report =>
        report.id === selectedQSReport.id ? updatedReport : report
      ));

      setShowQSAssignModal(false);
      setSelectedQSReport(null);
      setAssignTo('');
    };

    if (!selectedQSReport) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Assign Checklist to Engineer</h3>

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-700">
                <strong>Checklist:</strong> {selectedQSReport.project_title} - {selectedQSReport.document_number}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Engineer</label>
              <select
                value={assignTo}
                onChange={(e) => setAssignTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="">Select Engineer</option>
                {getAvailableUsers().map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.role.replace('_', ' ')}) - {user.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-700">
                The assigned engineer will be able to complete the checklist and submit it for approval.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setShowQSAssignModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleAssign}
              disabled={!assignTo}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Assign Checklist
            </button>
          </div>
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
                    <span className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {report.document_number}
                    </span>
                    {report.assigned_to_name && (
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        Assigned to: {report.assigned_to_name}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                    report.status === 'approved' ? 'bg-green-100 text-green-800' :
                    report.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    report.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                    report.status === 'assigned' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {report.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                    {report.status === 'completed' && <Clock className="w-3 h-3" />}
                    {report.status === 'in_progress' && <AlertTriangle className="w-3 h-3" />}
                    {report.status === 'assigned' && <Users className="w-3 h-3" />}
                    {report.status === 'draft' && <Edit className="w-3 h-3" />}
                    {report.status.replace('_', ' ').charAt(0).toUpperCase() + report.status.replace('_', ' ').slice(1)}
                  </span>
                </div>
              </div>

              {/* Checklist Summary */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-3">Checklist Sections</h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {report.checklist_items.map((section, index) => {
                    const checkedCount = section.items.filter(item => item.checked || item.not_required).length;
                    const totalCount = section.items.length;
                    const score = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

                    return (
                      <div key={index} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold text-sm text-blue-600">{section.section_number}.</span>
                          <span className="font-medium text-sm">{section.section_title}</span>
                        </div>
                        <div className="text-xs text-gray-600">{checkedCount}/{totalCount} items completed</div>
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

              {/* Signature Status */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Signature Status</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${report.checked_by_signature ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span>Checked by: {report.checked_by}</span>
                    {report.checked_by_date && (
                      <span className="text-gray-500">({new Date(report.checked_by_date).toLocaleDateString()})</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${report.approved_by_signature ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span>Approved by: {report.approved_by}</span>
                    {report.approved_by_date && (
                      <span className="text-gray-500">({new Date(report.approved_by_date).toLocaleDateString()})</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex gap-2">
                  {isAuthorized && report.status === 'draft' && (
                    <button
                      className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                      title="Assign to Engineer"
                    >
                      Assign
                    </button>
                  )}
                  {report.status === 'assigned' && report.assigned_to === user?.id && (
                    <button
                      className="px-3 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700"
                      title="Start Checklist"
                    >
                      Start
                    </button>
                  )}
                  {(report.status === 'in_progress' || report.status === 'completed') && (
                    <button
                      className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                      title="Sign Checklist"
                    >
                      Sign
                    </button>
                  )}
                </div>

                <div className="flex gap-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600" title="View Details">
                    <Eye className="w-4 h-4" />
                  </button>
                  {isAuthorized && report.status === 'approved' && (
                    <>
                      <button className="p-2 text-gray-400 hover:text-red-600" title="Download PDF">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-blue-600" title="Download DOC">
                        <FileText className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  {isAuthorized && (
                    <button className="p-2 text-gray-400 hover:text-red-600" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
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
