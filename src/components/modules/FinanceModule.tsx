import React from 'react';
import { DollarSign, TrendingUp, CreditCard, FileText } from 'lucide-react';

export const FinanceModule: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Construction Finance</h1>
        <p className="text-gray-600">Project budgets, contracts, and financial reporting</p>
      </div>

      {/* Finance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Contract Value</p>
              <p className="text-2xl font-bold text-gray-900">$12.8M</p>
            </div>
            <DollarSign className="w-10 h-10 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Project Profit</p>
              <p className="text-2xl font-bold text-gray-900">+18%</p>
            </div>
            <TrendingUp className="w-10 h-10 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Material Costs</p>
              <p className="text-2xl font-bold text-gray-900">$8.2M</p>
            </div>
            <CreditCard className="w-10 h-10 text-red-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Contracts</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
            <FileText className="w-10 h-10 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Finance Content */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Project Financials</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border rounded-lg hover:shadow-lg transition-all cursor-pointer transform hover:scale-105 bg-gradient-to-br from-green-50 to-green-100">
            <h4 className="font-medium mb-2">Project Receivables</h4>
            <p className="text-2xl font-bold text-green-600">$2,850,000</p>
            <p className="text-sm text-gray-600">Pending client payments</p>
            <button 
              onClick={() => alert('Opening Receivables Management...')}
              className="mt-3 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-all text-sm"
            >
              View Details
            </button>
          </div>
          <div className="p-6 border rounded-lg hover:shadow-lg transition-all cursor-pointer transform hover:scale-105 bg-gradient-to-br from-red-50 to-red-100">
            <h4 className="font-medium mb-2">Supplier Payables</h4>
            <p className="text-2xl font-bold text-red-600">$1,250,000</p>
            <p className="text-sm text-gray-600">Material & equipment costs</p>
            <button 
              onClick={() => alert('Opening Payables Management...')}
              className="mt-3 px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-all text-sm"
            >
              View Details
            </button>
          </div>
        </div>
        
        {/* Additional Finance Actions */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button 
            onClick={() => alert('Generating Financial Report...')}
            className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-all transform hover:scale-105"
          >
            Generate Report
          </button>
          <button 
            onClick={() => alert('Opening Budget Planning...')}
            className="px-6 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-all transform hover:scale-105"
          >
            Budget Planning
          </button>
          <button 
            onClick={() => alert('Opening Contract Management...')}
            className="px-6 py-2 bg-orange-700 text-white rounded-lg hover:bg-orange-800 transition-all transform hover:scale-105"
          >
            Manage Contracts
          </button>
        </div>
      </div>
    </div>
  );
};