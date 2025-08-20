import React, { useState } from 'react';
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
  Archive
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { User } from '../../types';

const UserManagementModule: React.FC = () => {
  const { user, pendingUsers, activeUsers, approveUser, rejectUser, createUser, refreshUsers } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'active' | 'pending' | 'create'>('active');
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const isAdmin = user?.role === 'admin' || user?.role === 'general_manager';

  // Refresh users data when component mounts
  React.useEffect(() => {
    refreshUsers();
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

  const getFilteredUsers = (userList: User[]) => {
    return userList.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.role.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  };

  const filteredActiveUsers = getFilteredUsers(activeUsers);
  const filteredPendingUsers = getFilteredUsers(pendingUsers);

  const newRequestsToday = pendingUsers.filter(u => {
    const today = new Date().toDateString();
    const userDate = new Date(u.created_at || '').toDateString();
    return today === userDate;
  }).length;

  const CreateUserModal = () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      role: 'employee',
      department: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      const result = await createUser(formData);

      if (result.success) {
        setNotification({
          type: 'success',
          message: result.message || `User ${formData.name} has been created successfully and can now login.`
        });

        setShowCreateModal(false);
        setFormData({
          name: '',
          email: '',
          password: '',
          role: 'employee',
          department: ''
        });
      } else {
        setNotification({
          type: 'error',
          message: result.message || 'Failed to create user. Please try again.'
        });
      }

      setTimeout(() => setNotification(null), 3000);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-2xl">
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Create New User Account</h3>
            
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
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
                    required
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
                    placeholder="e.g., Construction Management"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Temporary Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="User should change this on first login"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  User will be required to change this password on first login.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const ActiveUsersTab = () => (
    <div className="space-y-4">
      {filteredActiveUsers.length === 0 ? (
        <div className="p-12 text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Users Found</h3>
          <p className="text-gray-600">No users match your search criteria.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {filteredActiveUsers.map((activeUser) => (
            <div key={activeUser.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center border-2 border-green-300">
                    <span className="text-green-700 font-bold text-lg">
                      {activeUser.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-lg font-semibold text-gray-900">{activeUser.name}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(activeUser.role)}`}>
                        {formatRoleName(activeUser.role)}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        Active
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {activeUser.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Joined: {new Date(activeUser.created_at || '').toLocaleDateString()}
                      </div>
                    </div>
                    {activeUser.department && (
                      <div className="mt-1 text-sm text-gray-500">
                        Department: {activeUser.department}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    className="inline-flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                  >
                    <Eye className="w-4 h-4" />
                    View Profile
                  </button>
                  {activeUser.id !== user?.id && (
                    <button
                      className="inline-flex items-center gap-2 px-3 py-1 text-sm text-red-600 hover:text-red-800"
                    >
                      <Archive className="w-4 h-4" />
                      Deactivate
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const PendingUsersTab = () => (
    <div className="space-y-4">
      {filteredPendingUsers.length === 0 ? (
        <div className="p-12 text-center">
          <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Approvals</h3>
          <p className="text-gray-600">
            {pendingUsers.length === 0 
              ? "All user registrations have been processed."
              : "No users match your search criteria."
            }
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {filteredPendingUsers.map((pendingUser) => (
            <div key={pendingUser.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center border-2 border-gray-300">
                    <span className="text-gray-700 font-bold text-lg">
                      {pendingUser.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-lg font-semibold text-gray-900">{pendingUser.name}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(pendingUser.role)}`}>
                        {formatRoleName(pendingUser.role)}
                      </span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Pending
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {pendingUser.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Requested: {new Date(pendingUser.created_at || '').toLocaleDateString()}
                      </div>
                    </div>
                    {pendingUser.department && (
                      <div className="mt-1 text-sm text-gray-500">
                        Department: {pendingUser.department}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleApprove(pendingUser.id, pendingUser.name)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <UserCheck className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(pendingUser.id, pendingUser.name)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <UserX className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

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
          <p className="text-gray-600">Manage user accounts, approvals, and access control</p>
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
            <Users className="w-8 h-8 text-green-600" />
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
              <p className="text-2xl font-bold text-blue-600">{newRequestsToday}</p>
            </div>
            <UserCheck className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{activeUsers.length + pendingUsers.length}</p>
            </div>
            <Activity className="w-8 h-8 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search users by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
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

        <div className="p-6">
          {activeTab === 'active' && <ActiveUsersTab />}
          {activeTab === 'pending' && <PendingUsersTab />}
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && <CreateUserModal />}

      {/* Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">User Management Guidelines</h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p><strong>• Create User:</strong> Directly create approved accounts with preferred roles</p>
          <p><strong>• Approve Requests:</strong> Review and approve user registration requests</p>
          <p><strong>• Active Users:</strong> View and manage all approved and active users</p>
          <p><strong>• Role Management:</strong> Assign appropriate roles based on responsibilities</p>
          <p className="mt-3 text-blue-700">
            <strong>Security Note:</strong> Admin-created accounts are immediately active. Self-registered accounts require approval.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserManagementModule;
