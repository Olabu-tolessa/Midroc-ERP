import React, { useState } from 'react';
import { Building2, Lock, Mail, User, ArrowRight, LogIn, AlertCircle, Shield, HardHat, Eye, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SignupPageProps {
  onLoginClick: () => void;
  onSignupSuccess?: (email: string) => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onLoginClick, onSignupSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'employee'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { signup, loading } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const result = await signup(formData.name, formData.email, formData.password, formData.role);
    if (result.success) {
      setSuccess(result.message || 'Account created successfully!');
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'employee'
      });

      // Trigger success callback after a short delay to show success message
      setTimeout(() => {
        if (onSignupSuccess) {
          onSignupSuccess(formData.email);
        }
      }, 2000);
    } else {
      setError(result.message || 'Registration failed. Please try again.');
    }
  };

  const roleOptions = [
    { value: 'project_manager', label: 'Project Manager', icon: Building2, desc: 'Manage construction projects' },
    { value: 'engineer', label: 'Engineer', icon: HardHat, desc: 'Technical supervision & design' },
    { value: 'consultant', label: 'Consultant', icon: Eye, desc: 'Advisory & consulting services' },
    { value: 'client', label: 'Client', icon: User, desc: 'Project tracking & contracts' },
    { value: 'contractor', label: 'Contractor', icon: Shield, desc: 'Project execution' },
    { value: 'employee', label: 'Employee', icon: User, desc: 'General access' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex flex-col lg:flex-row">
      {/* Left Panel - Engineering Branding */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-blue-600/20"></div>
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1920&h=1080')`,
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
                <p className="text-lg text-blue-100">Join Our Team</p>
              </div>
            </div>
            
            <h2 className="text-4xl xl:text-5xl font-bold mb-6 leading-tight">
              Shape the Future of
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent"> Construction</span>
            </h2>
            
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Join thousands of engineering professionals using MIDROC ERP to deliver 
              world-class construction and consulting projects.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span className="text-lg">Advanced project management tools</span>
            </div>
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span className="text-lg">Real-time collaboration platform</span>
            </div>
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span className="text-lg">ISO certified quality assurance</span>
            </div>
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span className="text-lg">Comprehensive reporting & analytics</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-lg">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-4 border border-white/20">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fa277c4669d86451fa82a2c1c19c543ba%2F7073ebd30eee4e56929e82612bb1ae92?format=webp&width=800"
                alt="Midroc Investment Group"
                className="h-12 w-auto object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Join MIDROC ERP</h1>
            <p className="text-blue-100">Create your professional account</p>
          </div>

          {/* Signup Card */}
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
            {/* Card Header */}
            <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4">
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
                <p className="text-gray-600">Join the engineering excellence platform</p>
              </div>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="px-6 sm:px-8 pb-6 sm:pb-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Professional Role
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {roleOptions.map((role) => {
                    const Icon = role.icon;
                    return (
                      <label
                        key={role.value}
                        className={`cursor-pointer p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                          formData.role === role.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={role.value}
                          checked={formData.role === role.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5" />
                          <div>
                            <div className="font-medium">{role.label}</div>
                            <div className="text-sm text-gray-500">{role.desc}</div>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Admin and General Manager accounts are created by existing administrators
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Password"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Confirm"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-3 text-red-600 text-sm bg-red-50 border border-red-200 p-4 rounded-xl">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-3 text-green-600 text-sm bg-green-50 border border-green-200 p-4 rounded-xl">
                  <CheckCircle className="w-5 h-5" />
                  <span>{success}</span>
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
                    <span>Create Account</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="text-center pt-4 border-t border-gray-200">
                <span className="text-gray-600">Already have an account? </span>
                <button
                  type="button"
                  onClick={onLoginClick}
                  className="text-blue-600 font-semibold hover:text-blue-700 inline-flex items-center gap-1 hover:underline"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
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
