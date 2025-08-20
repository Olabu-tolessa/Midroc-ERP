import React, { useState, useEffect } from 'react';
import { Plus, Search, FileText, Calendar, CheckCircle, Clock, AlertTriangle, Eye, Edit, Trash2, Download } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface Contract {
  id: string;
  title: string;
  client_name: string;
  contract_type: 'construction' | 'consulting' | 'maintenance' | 'supply';
  value: number;
  start_date: string;
  end_date: string;
  status: 'draft' | 'active' | 'pending_approval' | 'completed' | 'terminated';
  approval_status: 'pending' | 'approved' | 'rejected';
  compliance_checks: {
    legal_review: boolean;
    financial_review: boolean;
    technical_review: boolean;
  };
  milestones: {
    name: string;
    due_date: string;
    status: 'pending' | 'completed' | 'overdue';
  }[];
  created_at: string;
}

const ContractualManagementModule: React.FC = () => {
  const { user } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showNewContractModal, setShowNewContractModal] = useState(false);

  const isAuthorized = user?.role === 'admin' || user?.role === 'general_manager';

  useEffect(() => {
    loadContracts();
  }, []);

  const loadContracts = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual Supabase query when DB is set up
      const mockContracts: Contract[] = [
        {
          id: '1',
          title: 'Highway Construction Phase 1',
          client_name: 'Ministry of Transport',
          contract_type: 'construction',
          value: 5500000,
          start_date: '2024-01-15',
          end_date: '2024-12-31',
          status: 'active',
          approval_status: 'approved',
          compliance_checks: {
            legal_review: true,
            financial_review: true,
            technical_review: true
          },
          milestones: [
            { name: 'Site Preparation', due_date: '2024-03-01', status: 'completed' },
            { name: 'Foundation Work', due_date: '2024-06-01', status: 'pending' },
            { name: 'Road Surface', due_date: '2024-10-01', status: 'pending' }
          ],
          created_at: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          title: 'Urban Planning Consultation',
          client_name: 'Metro City Council',
          contract_type: 'consulting',
          value: 280000,
          start_date: '2024-02-01',
          end_date: '2024-08-31',
          status: 'pending_approval',
          approval_status: 'pending',
          compliance_checks: {
            legal_review: true,
            financial_review: false,
            technical_review: true
          },
          milestones: [
            { name: 'Initial Assessment', due_date: '2024-03-15', status: 'pending' },
            { name: 'Design Phase', due_date: '2024-06-15', status: 'pending' }
          ],
          created_at: '2024-01-20T00:00:00Z'
        },
        {
          id: '3',
          title: 'Equipment Supply Contract',
          client_name: 'Construction Plus Ltd',
          contract_type: 'supply',
          value: 1200000,
          start_date: '2024-01-01',
          end_date: '2024-06-30',
          status: 'active',
          approval_status: 'approved',
          compliance_checks: {
            legal_review: true,
            financial_review: true,
            technical_review: true
          },
          milestones: [
            { name: 'Initial Delivery', due_date: '2024-02-15', status: 'completed' },
            { name: 'Bulk Delivery', due_date: '2024-04-15', status: 'overdue' }
          ],
          created_at: '2024-01-01T00:00:00Z'
        }
      ];
      setContracts(mockContracts);
    } catch (error) {
      console.error('Error loading contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.client_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    const matchesType = typeFilter === 'all' || contract.contract_type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'terminated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getApprovalStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMilestoneStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'overdue': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const totalValue = contracts.reduce((sum, contract) => sum + contract.value, 0);
  const activeContracts = contracts.filter(c => c.status === 'active').length;
  const pendingApprovals = contracts.filter(c => c.approval_status === 'pending').length;

  const NewContractModal = () => {
    const [formData, setFormData] = useState({
      title: '',
      client_name: '',
      contract_type: 'construction',
      value: '',
      start_date: '',
      end_date: '',
      description: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        // Here you would save to Supabase
        console.log('Saving new contract:', formData);
        setShowNewContractModal(false);
        loadContracts(); // Reload contracts
      } catch (error) {
        console.error('Error creating contract:', error);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
          <h3 className="text-xl font-bold text-gray-900 mb-4">New Contract</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contract Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                <input
                  type="text"
                  value={formData.client_name}
                  onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contract Type</label>
                <select
                  value={formData.contract_type}
                  onChange={(e) => setFormData({...formData, contract_type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="construction">Construction</option>
                  <option value="consulting">Consulting</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="supply">Supply</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contract Value</label>
              <input
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({...formData, value: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="0"
                required
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowNewContractModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Create Contract
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
          <h2 className="text-2xl font-bold text-gray-900">Contractual Management</h2>
          <p className="text-gray-600">Manage contract lifecycle and compliance</p>
        </div>
        {isAuthorized && (
          <button
            onClick={() => setShowNewContractModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Contract
          </button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">${totalValue.toLocaleString()}</p>
            </div>
            <FileText className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Contracts</p>
              <p className="text-2xl font-bold text-gray-900">{activeContracts}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
              <p className="text-2xl font-bold text-gray-900">{pendingApprovals}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Contracts</p>
              <p className="text-2xl font-bold text-gray-900">{contracts.length}</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search contracts..."
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
              <option value="draft">Draft</option>
              <option value="pending_approval">Pending Approval</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>
          <div className="w-48">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Types</option>
              <option value="construction">Construction</option>
              <option value="consulting">Consulting</option>
              <option value="maintenance">Maintenance</option>
              <option value="supply">Supply</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contracts Grid */}
      <div className="grid gap-6">
        {filteredContracts.map((contract) => (
          <div key={contract.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{contract.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <span>Client: {contract.client_name}</span>
                  <span className="capitalize">{contract.contract_type.replace('_', ' ')}</span>
                  <span>${contract.value.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(contract.start_date).toLocaleDateString()} - {new Date(contract.end_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
                  {contract.status.replace('_', ' ').charAt(0).toUpperCase() + contract.status.replace('_', ' ').slice(1)}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getApprovalStatusColor(contract.approval_status)}`}>
                  {contract.approval_status.charAt(0).toUpperCase() + contract.approval_status.slice(1)}
                </span>
              </div>
            </div>

            {/* Compliance Checks */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Compliance Checks</h4>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  {contract.compliance_checks.legal_review ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-yellow-600" />
                  )}
                  <span className="text-sm text-gray-600">Legal Review</span>
                </div>
                <div className="flex items-center gap-2">
                  {contract.compliance_checks.financial_review ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-yellow-600" />
                  )}
                  <span className="text-sm text-gray-600">Financial Review</span>
                </div>
                <div className="flex items-center gap-2">
                  {contract.compliance_checks.technical_review ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-yellow-600" />
                  )}
                  <span className="text-sm text-gray-600">Technical Review</span>
                </div>
              </div>
            </div>

            {/* Milestones */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Milestones</h4>
              <div className="space-y-2">
                {contract.milestones.map((milestone, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      {getMilestoneStatusIcon(milestone.status)}
                      <span className="text-sm font-medium">{milestone.name}</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {new Date(milestone.due_date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
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

      {showNewContractModal && <NewContractModal />}
    </div>
  );
};

export default ContractualManagementModule;
