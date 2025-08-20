import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { Navigation } from './components/layout/Navigation';
import DashboardModule from './components/modules/DashboardModule';
import { ProjectManagementModule } from './components/modules/ProjectManagementModule';
import { HRModule } from './components/modules/HRModule';
import { FinanceModule } from './components/modules/FinanceModule';
import { BusinessIntelligenceModule } from './components/modules/BusinessIntelligenceModule';
import { QualityAuditModule } from './components/modules/QualityAuditModule';
import { CRMModule } from './components/modules/CRMModule';
import SupervisionModule from './components/modules/SupervisionModule';
import ConsultingModule from './components/modules/ConsultingModule';
import ContractualManagementModule from './components/modules/ContractualManagementModule';
import UserManagementModule from './components/modules/UserManagementModule';

const AppContent: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [currentModule, setCurrentModule] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-green-200 border-t-green-700 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Midroc ERP System...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        {authMode === 'login' ? (
          <LoginPage onSignupClick={() => setAuthMode('signup')} />
        ) : (
          <SignupPage onLoginClick={() => setAuthMode('login')} />
        )}
      </>
    );
  }

  const renderModule = () => {
    switch (currentModule) {
      case 'dashboard':
        return <DashboardModule />;
      case 'projects':
        return <ProjectManagementModule />;
      case 'supervision':
        return <SupervisionModule />;
      case 'consulting':
        return <ConsultingModule />;
      case 'contracts':
        return <ContractualManagementModule />;
      case 'hr':
        return <HRModule />;
      case 'finance':
        return <FinanceModule />;
      case 'bi':
        return <BusinessIntelligenceModule />;
      case 'qa':
        return <QualityAuditModule />;
      case 'crm':
        return <CRMModule />;
      default:
        return <DashboardModule />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Navigation 
        currentModule={currentModule} 
        onModuleChange={setCurrentModule} 
      />
      <main className="flex-1 ml-64 p-6 lg:p-8">
        {renderModule()}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
