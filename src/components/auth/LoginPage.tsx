import React, { useState } from 'react';
import { Building2, Lock, Mail, ArrowRight, UserPlus, AlertCircle, Shield, HardHat, Eye } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface LoginPageProps {
  onSignupClick: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSignupClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const result = await login(email, password);
    if (!result.success) {
      setError(result.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex flex-col lg:flex-row">
      {/* Left Panel - Engineering Branding */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-blue-600/20"></div>
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1920&h=1080')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
        
        <div className="relative z-10 flex flex-col justify-center p-12 xl:p-16 text-white">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                <HardHat className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">MIDROC ERP</h1>
                <p className="text-lg text-blue-100">Engineering Excellence</p>
              </div>
            </div>
            
            <h2 className="text-4xl xl:text-5xl font-bold mb-6 leading-tight">
              Advanced Construction & 
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent"> Consulting</span> Management
            </h2>
            
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Streamline your construction projects with our comprehensive ERP solution. 
              Manage projects, supervise quality, and drive engineering excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Building2 className="w-8 h-8 text-green-400 mb-3" />
              <h3 className="font-semibold mb-2">Project Management</h3>
              <p className="text-sm text-blue-100">Complete project lifecycle management</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Eye className="w-8 h-8 text-blue-400 mb-3" />
              <h3 className="font-semibold mb-2">Quality Supervision</h3>
              <p className="text-sm text-blue-100">Real-time monitoring and reporting</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Shield className="w-8 h-8 text-purple-400 mb-3" />
              <h3 className="font-semibold mb-2">Safety Compliance</h3>
              <p className="text-sm text-blue-100">ISO certified quality assurance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-4 border border-white/20">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fa277c4669d86451fa82a2c1c19c543ba%2F7073ebd30eee4e56929e82612bb1ae92?format=webp&width=800"
                alt="Midroc Investment Group"
                className="h-12 w-auto object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">MIDROC ERP</h1>
            <p className="text-blue-100">Engineering Management Platform</p>
          </div>

          {/* Login Card */}
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
            {/* Card Header */}
            <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-2">
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                <p className="text-gray-600">Sign in to access your engineering dashboard</p>
              </div>
            </div>

            {/* Demo Credentials - Collapsible */}
            <div className="px-6 sm:px-8 pb-6">
              <details className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                <summary className="cursor-pointer p-4 font-semibold text-blue-800 hover:bg-blue-100 rounded-lg transition-colors">
                  🔐 Demo Accounts (Click to expand)
                </summary>
                <div className="px-4 pb-4 text-sm text-blue-700 space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="bg-white/50 rounded p-2">
                      <p><span className="font-medium">Admin:</span> admin@midroc.com</p>
                      <p><span className="font-medium">GM:</span> gm@midroc.com</p>
                      <p><span className="font-medium">PM:</span> pm@midroc.com</p>
                      <p><span className="font-medium">Engineer:</span> engineer@midroc.com</p>
                    </div>
                    <div className="bg-white/50 rounded p-2">
                      <p><span className="font-medium">Consultant:</span> consultant@midroc.com</p>
                      <p><span className="font-medium">Client:</span> client@midroc.com</p>
                      <p><span className="font-medium">Contractor:</span> contractor@midroc.com</p>
                      <p><span className="font-medium">Employee:</span> employee@midroc.com</p>
                    </div>
                  </div>
                  <p className="text-center font-medium text-blue-800 bg-blue-100 rounded p-2">
                    Password for all accounts: <code className="bg-blue-200 px-1 rounded">password</code>
                  </p>
                </div>
              </details>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="px-6 sm:px-8 pb-6 sm:pb-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-3 text-red-600 text-sm bg-red-50 border border-red-200 p-4 rounded-xl">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="text-center pt-4 border-t border-gray-200">
                <span className="text-gray-600">Don't have an account? </span>
                <button
                  type="button"
                  onClick={onSignupClick}
                  className="text-blue-600 font-semibold hover:text-blue-700 inline-flex items-center gap-1 hover:underline"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account</span>
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 text-white/70">
            <p className="text-sm">
              © 2024 MIDROC Investment Group. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
