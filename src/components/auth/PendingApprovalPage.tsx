import React from 'react';
import { Building2, Clock, CheckCircle, Mail, Phone } from 'lucide-react';

interface PendingApprovalPageProps {
  userEmail: string;
  onBackToLogin: () => void;
}

export const PendingApprovalPage: React.FC<PendingApprovalPageProps> = ({ userEmail, onBackToLogin }) => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 relative"
      style={{
        backgroundImage: `linear-gradient(rgba(45, 80, 22, 0.85), rgba(45, 80, 22, 0.85)), url('https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-xl mb-4 shadow-lg">
            <Building2 className="w-8 h-8 text-green-700" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Midroc ERP</h1>
          <p className="text-green-100">Construction & Consulting Management</p>
        </div>

        {/* Pending Approval Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          {/* Success Icon */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Created Successfully!</h2>
            <p className="text-gray-600">Your registration is now pending admin approval</p>
          </div>

          {/* Status Information */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-800 mb-2">What happens next?</h3>
                <ul className="text-sm text-yellow-700 space-y-2">
                  <li>• Your account request has been submitted to the administrator</li>
                  <li>• Admin will review your application and verify your credentials</li>
                  <li>• Once approved, you'll receive access to your account</li>
                  <li>• You can then login with your registered email and password</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Registration Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Email:</span>
                <span className="font-medium text-gray-900">{userEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Submitted:</span>
                <span className="font-medium text-gray-900">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-blue-900 mb-2">Need Help?</h4>
            <p className="text-sm text-blue-800 mb-3">
              If you have questions about your account approval, please contact the administrator:
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <span className="text-blue-700">admin@midroc.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600" />
                <span className="text-blue-700">+1 (555) 123-4567</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={onBackToLogin}
              className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors shadow-lg"
            >
              Back to Login
            </button>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already approved? Try logging in with your credentials
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-4">Approval Process</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-900 font-medium">Account Registration</span>
                <span className="text-xs text-green-600 ml-auto">Completed</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-700">Admin Review</span>
                <span className="text-xs text-yellow-600 ml-auto">In Progress</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-gray-500" />
                </div>
                <span className="text-sm text-gray-500">Account Approval</span>
                <span className="text-xs text-gray-500 ml-auto">Pending</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-gray-500" />
                </div>
                <span className="text-sm text-gray-500">Access Granted</span>
                <span className="text-xs text-gray-500 ml-auto">Pending</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
