import React from 'react';
import { Building2, Clock, Mail, ArrowLeft, CheckCircle, Shield } from 'lucide-react';

interface PendingApprovalPageProps {
  userEmail: string;
  onBackToLogin: () => void;
}

export const PendingApprovalPage: React.FC<PendingApprovalPageProps> = ({ 
  userEmail, 
  onBackToLogin 
}) => {
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
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-32 h-20 bg-white rounded-xl mb-4 shadow-lg p-2">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fa277c4669d86451fa82a2c1c19c543ba%2F7073ebd30eee4e56929e82612bb1ae92?format=webp&width=800"
              alt="Midroc Investment Group"
              className="h-full w-auto object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Registration Submitted</h1>
          <p className="text-green-100">Your account is pending approval</p>
        </div>

        {/* Pending Approval Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          <div className="text-center space-y-6">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
            </div>

            {/* Success Message */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Account Created Successfully!
              </h2>
              <p className="text-gray-600">
                Your registration has been submitted and is now pending admin approval.
              </p>
            </div>

            {/* User Email */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-center gap-2 text-gray-700">
                <Mail className="w-5 h-5" />
                <span className="font-medium">{userEmail}</span>
              </div>
            </div>

            {/* Status Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-left">
                  <h3 className="font-medium text-blue-800 mb-1">What happens next?</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Your registration is being reviewed by our administrators</li>
                    <li>• You will receive an email notification once approved</li>
                    <li>• After approval, you can log in with your credentials</li>
                    <li>• This process typically takes 24-48 hours</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="text-left">
                  <h3 className="font-medium text-yellow-800 mb-1">Security Notice</h3>
                  <p className="text-sm text-yellow-700">
                    All user registrations require admin approval to ensure system security 
                    and proper access control.
                  </p>
                </div>
              </div>
            </div>

            {/* Back to Login Button */}
            <button
              onClick={onBackToLogin}
              className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </button>

            {/* Help Text */}
            <div className="text-center text-sm text-gray-500">
              <p>
                Need help? Contact your system administrator or 
                <br />
                email us at{' '}
                <a 
                  href="mailto:admin@midroc.com" 
                  className="text-green-700 hover:text-green-800 font-medium"
                >
                  admin@midroc.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
