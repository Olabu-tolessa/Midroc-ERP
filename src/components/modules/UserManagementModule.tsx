import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Mail,
  Calendar,
  Shield,
  Search,
  Filter,
  Plus,
  UserPlus,
  Activity,
  Archive,
  Edit,
  Trash2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { User } from '../../types';

const UserManagementModule: React.FC = () => {
  const { user, pendingUsers, approveUser, rejectUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'active' | 'pending' | 'create'>('active');
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeUsers, setActiveUsers] = useState<User[]>([]);

  const isAdmin = user?.role === 'admin' || user?.role === 'general_manager';

  useEffect(() => {
    // Load active users (mock data - in real app would come from Supabase)
    const mockActiveUsers: User[] = [
      {
        id: '1',
        name: 'John Anderson',
        email: 'admin@midroc.com',
        role: 'admin',
        department: 'Administration',
        approved: true,
        created_at: '2024-01-01T00:00:00Z'
      },
      {
        id: '2',
        name: 'Sarah Mitchell',
        email: 'gm@midroc.com',
        role: 'general_manager',
        department: 'Construction Management',
        approved: true,
        created_at: '2024-01-01T00:00:00Z'
      },
      {
        id: '3',
        name: 'Michael Rodriguez',
        email: 'pm@midroc.com',
        role: 'project_manager',
        department: 'Highway Construction',
        approved: true,
        created_at: '2024-01-01T00:00:00Z'
      },
      {
        id: '4',
        name: 'Emma Thompson',
        email: 'consultant@midroc.com',
        role: 'consultant',
        department: 'Urban Planning',
        approved: true,
        created_at: '2024-01-01T00:00:00Z'
      },
      {
        id: '5',
        name: 'David Chen',
        email: 'engineer@midroc.com',
        role: 'engineer',
        department: 'Structural Engineering',
        approved: true,
        created_at: '2024-01-01T00:00:00Z'
      },
      {
        id: '6',
        name: 'Lisa Johnson',
        email: 'employee@midroc.com',
        role: 'employee',
        department: 'General Construction',
        approved: true,
        created_at: '2024-01-01T00:00:00Z'
      }
    ];
    setActiveUsers(mockActiveUsers);
  }, []);

  if (!isAdmin) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600">Only administrators can access user management.</p>
        </div>
      </div>
    );
  }

  const handleApprove = (userId: string, userName: string) => {
    approveUser(userId);
    setNotification({
      type: 'success',
      message: `${userName} has been approved and can now login.`
    });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleReject = (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to reject ${userName}'s account request?`)) {
      rejectUser(userId);
      setNotification({
        type: 'success',
        message: `${userName}'s account request has been rejected.`
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'general_manager': return 'bg-purple-100 text-purple-800';
      case 'project_manager': return 'bg-blue-100 text-blue-800';
      case 'engineer': return 'bg-green-100 text-green-800';
      case 'consultant': return 'bg-yellow-100 text-yellow-800';
      case 'employee': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatRoleName = (role: string) => {
    return role.replace('_', ' ').split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const CreateUserModal = () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      role: 'employee',
      department: '',
      password: 'password123' // Default password
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const newUser: User = {
          id: Date.now().toString(),
          name: formData.name,
          email: formData.email,
          role: formData.role as any,
          department: formData.department,
          approved: true,
          created_at: new Date().toISOString()
        };

        // Add to active users
        setActiveUsers(prev => [...prev, newUser]);
        
        setNotification({
          type: 'success',
          message: `User ${formData.name} has been created successfully.`
        });
        
        setShowCreateModal(false);
        setFormData({
          name: '',
          email: '',
          role: 'employee',
          department: '',
          password: 'password123'
        });
      } catch (error) {
        setNotification({
          type: 'error',
          message: 'Failed to create user. Please try again.'
        });
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-2xl">
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Create New User</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="admin">Administrator</option>
                    <option value="general_manager">General Manager</option>
                    <option value="project_manager">Project Manager</option>
                    <option value="engineer">Engineer</option>
                    <option value="consultant">Consultant</option>
                    <option value="employee">Employee</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g. Construction Management"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Password</label>
                <input
                  type="text"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">User can change this password after first login</p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const filteredActiveUsers = activeUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredPendingUsers = pendingUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const todayRequests = pendingUsers.filter(u => {
    const today = new Date().toDateString();
    const userDate = new Date(u.created_at || '').toDateString();
    return today === userDate;
  }).length;

  return (
    <div className="p-6 space-y-6">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
          notification.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage active users, approvals, and create new accounts</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Create User
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-green-600">{activeUsers.length}</p>
            </div>
            <UserCheck className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
              <p className="text-2xl font-bold text-orange-600">{pendingUsers.length}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New Requests Today</p>
              <p className="text-2xl font-bold text-blue-600">{todayRequests}</p>
            </div>
            <Activity className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-purple-600">{activeUsers.length + pendingUsers.length}</p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('active')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'active'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Active Users ({activeUsers.length})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pending'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pending Approval ({pendingUsers.length})
            </button>
          </nav>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'active' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Users</h3>
              {filteredActiveUsers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No active users found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredActiveUsers.map((activeUser) => (
                    <div key={activeUser.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center border-2 border-green-300">
                          <span className="text-green-700 font-bold text-sm">
                            {activeUser.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-semibold text-gray-900">{activeUser.name}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(activeUser.role)}`}>
                              {formatRoleName(activeUser.role)}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {activeUser.email}
                            </div>
                            {activeUser.department && (
                              <span>{activeUser.department}</span>
                            )}
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Joined: {new Date(activeUser.created_at || '').toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-green-600 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          Active
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'pending' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Approvals</h3>
              {filteredPendingUsers.length === 0 ? (
                <div className="text-center py-8">
                  <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">
                    {pendingUsers.length === 0 
                      ? "No pending approvals"
                      : "No users match your search criteria"
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredPendingUsers.map((pendingUser) => (
                    <div key={pendingUser.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center border-2 border-yellow-300">
                          <span className="text-yellow-700 font-bold text-sm">
                            {pendingUser.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-semibold text-gray-900">{pendingUser.name}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(pendingUser.role)}`}>
                              {formatRoleName(pendingUser.role)}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {pendingUser.email}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Requested: {new Date(pendingUser.created_at || '').toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleApprove(pendingUser.id, pendingUser.name)}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          <UserCheck className="w-3 h-3" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(pendingUser.id, pendingUser.name)}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                        >
                          <UserX className="w-3 h-3" />
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">User Management Guidelines</h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p><strong>• Active Users:</strong> Users who have been approved and can login to the system</p>
          <p><strong>• Pending Approval:</strong> New registrations waiting for admin approval</p>
          <p><strong>• Create User:</strong> Directly create new users with immediate access</p>
          <p><strong>• Default Password:</strong> New users should change their password on first login</p>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && <CreateUserModal />}
    </div>
  );
};

export default UserManagementModule;
