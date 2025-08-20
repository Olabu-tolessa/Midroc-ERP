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
  Filter
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const UserManagementModule: React.FC = () => {
  const { user, pendingUsers, approveUser, rejectUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const isAdmin = user?.role === 'admin' || user?.role === 'general_manager';

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

  const filteredUsers = pendingUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

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
          <p className="text-gray-600">Approve pending user registrations and manage accounts</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <p className="text-2xl font-bold text-blue-600">
                {pendingUsers.filter(u => {
                  const today = new Date().toDateString();
                  const userDate = new Date(u.created_at || '').toDateString();
                  return today === userDate;
                }).length}
              </p>
            </div>
            <UserCheck className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-green-600">
                {pendingUsers.length + 6}
              </p>
            </div>
            <Users className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search pending users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Pending Users List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Pending Account Approvals</h3>
          <p className="text-sm text-gray-600 mt-1">
            Review and approve user registration requests
          </p>
        </div>

        {filteredUsers.length === 0 ? (
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
            {filteredUsers.map((pendingUser) => (
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

      {/* Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">User Approval Guidelines</h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p><strong>• Project Managers:</strong> Verify they have relevant project management experience</p>
          <p><strong>• Engineers:</strong> Ensure they have appropriate technical qualifications</p>
          <p><strong>• Consultants:</strong> Check their consulting expertise and specialization</p>
          <p><strong>• Employees:</strong> Verify they are legitimate team members</p>
          <p className="mt-3 text-blue-700">
            <strong>Note:</strong> Admin and General Manager accounts can only be created by existing administrators through the user management system.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserManagementModule;
