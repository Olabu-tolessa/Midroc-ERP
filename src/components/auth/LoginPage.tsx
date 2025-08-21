import React, { useState, useEffect } from 'react';
import { Building2, Lock, Mail, ArrowRight, UserPlus, AlertCircle, Eye, EyeOff, Shield, Briefcase } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface LoginPageProps {
  onSignupClick: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSignupClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isFormFocused, setIsFormFocused] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState('');
  const { login, loading } = useAuth();

  const demoAccounts = [
    { email: 'admin@midroc.com', role: 'Admin', access: 'Full Access', icon: Shield },
    { email: 'gm@midroc.com', role: 'General Manager', access: 'Management Access', icon: Briefcase },
    { email: 'pm@midroc.com', role: 'Project Manager', access: 'Project Access', icon: Building2 },
    { email: 'consultant@midroc.com', role: 'Consultant', access: 'Consulting Access', icon: UserPlus },
    { email: 'engineer@midroc.com', role: 'Engineer', access: 'Technical Access', icon: Building2 },
    { email: 'client@midroc.com', role: 'Client', access: 'Project Tracking & Contract Signing', icon: Briefcase },
    { email: 'contractor@midroc.com', role: 'Contractor', access: 'Project Execution & Contract Signing', icon: Building2 },
    { email: 'employee@midroc.com', role: 'Employee', access: 'Limited Access', icon: UserPlus },
  ];

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

  const handleDemoSelect = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password');
    setSelectedDemo(demoEmail);
    setError('');
  };

  const handleQuickLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password');
    setSelectedDemo(demoEmail);
    setError('');

    const result = await login(demoEmail, 'password');
    if (!result.success) {
      setError(result.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background with construction theme */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-green-900"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(34, 197, 94, 0.05) 0%, transparent 50%)
          `
        }}
      />

      {/* Floating geometric shapes for construction theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-16 h-16 border-2 border-green-400/20 rotate-45 animate-pulse" />
        <div className="absolute top-40 right-20 w-12 h-12 bg-green-400/10 rotate-12 animate-bounce" style={{ animationDuration: '3s' }} />
        <div className="absolute bottom-40 left-20 w-20 h-20 border border-green-400/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 right-10 w-14 h-14 bg-green-400/5 transform rotate-45 animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }} />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 items-center">

          {/* Left Column - Branding and Demo Accounts */}
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center justify-center w-40 h-24 bg-white/95 backdrop-blur-sm rounded-2xl mb-6 shadow-2xl p-3 hover:scale-105 transition-transform duration-300">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fa277c4669d86451fa82a2c1c19c543ba%2F7073ebd30eee4e56929e82612bb1ae92?format=webp&width=800"
                  alt="Midroc Investment Group"
                  className="h-full w-auto object-contain"
                />
              </div>
              <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                MIDROC ERP
              </h1>
              <p className="text-xl text-green-100 mb-2">Construction & Consulting Management</p>
              <p className="text-green-200/80">Streamline your construction projects with advanced enterprise solutions</p>
            </div>

            {/* Quick Access Demo Accounts */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">
              <h3 className="font-bold text-white mb-4 text-lg flex items-center gap-2">
                <Building2 className="w-5 h-5 text-green-400" />
                Quick Access Demo Accounts
              </h3>
              <div className="grid gap-3">
                {demoAccounts.slice(0, 4).map((account) => {
                  const Icon = account.icon;
                  return (
                    <button
                      key={account.email}
                      onClick={() => handleQuickLogin(account.email)}
                      disabled={loading}
                      className={`w-full p-3 rounded-xl border transition-all duration-300 text-left group hover:scale-[1.02] ${
                        selectedDemo === account.email
                          ? 'bg-green-600/20 border-green-400/50 text-white'
                          : 'bg-white/5 border-white/20 text-green-100 hover:bg-white/10 hover:border-green-400/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center group-hover:bg-green-600/30 transition-colors">
                          <Icon className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm">{account.role}</div>
                          <div className="text-xs opacity-80">{account.access}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 text-xs text-green-200/60 text-center">
                Password: <span className="font-mono bg-white/10 px-2 py-1 rounded">password</span>
              </div>
            </div>
          </div>

          {/* Right Column - Login Form */}
          <div className="max-w-md mx-auto w-full">
            <div className={`bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 transition-all duration-500 ${
              isFormFocused ? 'scale-[1.02] shadow-green-500/20' : ''
            }`}>

              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                <p className="text-gray-600">Sign in to access your construction management dashboard</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setIsFormFocused(true)}
                      onBlur={() => setIsFormFocused(false)}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-600/20 focus:border-green-600 transition-all duration-300 text-gray-900 placeholder-gray-500"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setIsFormFocused(true)}
                      onBlur={() => setIsFormFocused(false)}
                      className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-600/20 focus:border-green-600 transition-all duration-300 text-gray-900 placeholder-gray-500"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-3 text-red-600 text-sm bg-red-50 border border-red-200 p-4 rounded-xl animate-slideIn">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-[1.02] group"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In to Dashboard</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="h-px bg-gray-300 flex-1" />
                  <span className="text-gray-500 text-sm font-medium">New to MIDROC?</span>
                  <div className="h-px bg-gray-300 flex-1" />
                </div>
                <button
                  onClick={onSignupClick}
                  className="inline-flex items-center gap-2 text-green-700 font-semibold hover:text-green-800 transition-colors hover:scale-105 transform duration-200"
                >
                  <UserPlus className="w-5 h-5" />
                  Create New Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
