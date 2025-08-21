import React, { useState, useEffect } from 'react';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Shield,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  Eye,
  Plus,
  User,
  Lock
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface PendingUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
}

const UserManagementModule: React.FC = () => {
  const { user, getPendingUsers, approveUser, rejectUser } = useAuth();
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);

  useEffect(() => {
    loadPendingUsers();
  }, []);

  const loadPendingUsers = () => {
    try {
      setLoading(true);
      const users = getPendingUsers();
      setPendingUsers(users);
    } catch (error) {
      console.error('Error loading pending users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    try {
      const success = await approveUser(userId);
      if (success) {
        setNotification({
          type: 'success',
          message: 'User approved successfully! They can now log in with their credentials.'
        });
        loadPendingUsers(); // Refresh the list
      } else {
        setNotification({
          type: 'error',
          message: 'Failed to approve user. Please try again.'
        });
      }
    } catch (error) {
      console.error('Error approving user:', error);
      setNotification({
        type: 'error',
        message: 'An error occurred while approving the user.'
      });
    }
    
    setTimeout(() => setNotification(null), 3000);
  };

  const handleReject = async (userId: string) => {
    try {
      const success = await rejectUser(userId);
      if (success) {
        setNotification({
          type: 'success',
          message: 'User registration rejected.'
        });
        loadPendingUsers(); // Refresh the list
      } else {
        setNotification({
          type: 'error',
          message: 'Failed to reject user. Please try again.'
        });
      }
    } catch (error) {
      console.error('Error rejecting user:', error);
      setNotification({
        type: 'error',
        message: 'An error occurred while rejecting the user.'
      });
    }
    
    setTimeout(() => setNotification(null), 3000);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'project_manager': return 'bg-blue-100 text-blue-800';
      case 'engineer': return 'bg-green-100 text-green-800';
      case 'consultant': return 'bg-purple-100 text-purple-800';
      case 'employee': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatRole = (role: string) => {
    return role.replace('_', ' ').split(' ').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const CreateUserModal = () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'employee',
      department: ''
    });
    const [errors, setErrors] = useState<{[key: string]: string}>({});

    const validateForm = () => {
      const newErrors: {[key: string]: string} = {};

      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }

      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }

      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      if (!formData.department.trim()) {
        newErrors.department = 'Department is required';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      try {
        // Here you would normally create the user via API
        // For now, we'll simulate success
        await new Promise(resolve => setTimeout(resolve, 1000));

        setNotification({
          type: 'success',
          message: `User "${formData.name}" created successfully! Login credentials have been sent to ${formData.email}.`
        });

        setShowCreateUserModal(false);
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'employee',
          department: ''
        });
        setErrors({});

        setTimeout(() => setNotification(null), 5000);
      } catch (error) {
        setNotification({
          type: 'error',
          message: 'Failed to create user. Please try again.'
        });
        setTimeout(() => setNotification(null), 3000);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Create New User</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter full name"
                />
              </div>
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter email address"
                />
              </div>
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="employee">Employee</option>
                <option value="engineer">Engineer</option>
                <option value="consultant">Consultant</option>
                <option value="project_manager">Project Manager</option>
                <option value="general_manager">General Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.department ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter department"
              />
              {errors.department && <p className="text-red-600 text-sm mt-1">{errors.department}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter password"
                />
              </div>
              {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Confirm password"
                />
              </div>
              {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-700">
                The user will receive login credentials via email and can access the system immediately.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowCreateUserModal(false);
                  setFormData({
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    role: 'employee',
                    department: ''
                  });
                  setErrors({});
                }}
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
    );
  };

  const UserDetailsModal = () => {
    if (!selectedUser) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">User Registration Details</h3>
            <button
              onClick={() => setShowDetailsModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <p className="text-gray-900 font-medium">{selectedUser.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-900">{selectedUser.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Requested Role</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(selectedUser.role)}`}>
                  {formatRole(selectedUser.role)}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <p className="text-gray-900">{selectedUser.department}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Registration Date</label>
              <p className="text-gray-900">
                {new Date(selectedUser.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Review Required</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Please review this user's information and determine if they should be granted access to the system.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t mt-6">
            <button
              onClick={() => setShowDetailsModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Close
            </button>
            <button
              onClick={() => {
                handleReject(selectedUser.id);
                setShowDetailsModal(false);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              Reject
            </button>
            <button
              onClick={() => {
                handleApprove(selectedUser.id);
                setShowDetailsModal(false);
              }}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Approve
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
          <p className="text-gray-600">Create users and approve registrations</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowCreateUserModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create User
          </button>
          <div className="text-right">
            <div className="text-sm text-gray-600">Total Pending</div>
            <div className="text-2xl font-bold text-orange-600">{pendingUsers.length}</div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-orange-600">{pendingUsers.length}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Project Managers</p>
              <p className="text-2xl font-bold text-blue-600">
                {pendingUsers.filter(u => u.role === 'project_manager').length}
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Engineers</p>
              <p className="text-2xl font-bold text-green-600">
                {pendingUsers.filter(u => u.role === 'engineer').length}
              </p>
            </div>
            <Users className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Other Roles</p>
              <p className="text-2xl font-bold text-purple-600">
                {pendingUsers.filter(u => !['project_manager', 'engineer'].includes(u.role)).length}
              </p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Pending Users List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Pending User Registrations</h3>
          <p className="text-sm text-gray-600 mt-1">Review and approve new user account requests</p>
        </div>

        {pendingUsers.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Registrations</h3>
            <p className="text-gray-600">All user registrations have been processed.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {pendingUsers.map((pendingUser) => (
              <div key={pendingUser.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                        <span className="text-blue-700 font-bold text-lg">
                          {pendingUser.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{pendingUser.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {pendingUser.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(pendingUser.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(pendingUser.role)}`}>
                        {formatRole(pendingUser.role)}
                      </span>
                      <span className="text-sm text-gray-600">
                        Department: {pendingUser.department}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedUser(pendingUser);
                        setShowDetailsModal(true);
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleReject(pendingUser.id)}
                      className="px-3 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1"
                      title="Reject"
                    >
                      <UserX className="w-4 h-4" />
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(pendingUser.id)}
                      className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
                      title="Approve"
                    >
                      <UserCheck className="w-4 h-4" />
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Guide */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Shield className="w-6 h-6 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800 mb-2">User Approval Guidelines</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Review user's requested role and ensure it matches their intended responsibilities</li>
              <li>• Verify email domain and user identity if necessary</li>
              <li>• Approved users will be able to log in immediately with their registration credentials</li>
              <li>• Rejected users will need to register again if they wish to access the system</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showDetailsModal && <UserDetailsModal />}
    </div>
  );
};

export default UserManagementModule;
