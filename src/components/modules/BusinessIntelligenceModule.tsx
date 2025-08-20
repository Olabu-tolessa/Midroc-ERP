import React from 'react';
import { BarChart3, PieChart, LineChart, Activity } from 'lucide-react';

export const BusinessIntelligenceModule: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Construction Analytics</h1>
        <p className="text-gray-600">Project analytics, performance reports, and insights</p>
      </div>

      {/* BI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Project Metrics</p>
              <p className="text-2xl font-bold text-gray-900">2.8K</p>
            </div>
            <BarChart3 className="w-10 h-10 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Progress Reports</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
            </div>
            <PieChart className="w-10 h-10 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Site Dashboards</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
            <LineChart className="w-10 h-10 text-purple-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Site Managers</p>
              <p className="text-2xl font-bold text-gray-900">18</p>
            </div>
            <Activity className="w-10 h-10 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-lg transition-all cursor-pointer transform hover:scale-105">
          <h3 className="text-lg font-semibold mb-4">Project Progress Trends</h3>
          <div 
            onClick={() => alert('Opening detailed progress analytics...')}
            className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center hover:from-blue-100 hover:to-blue-200 transition-all"
          >
            <div className="text-center">
              <LineChart className="w-16 h-16 text-blue-600 mx-auto mb-2" />
              <p className="text-blue-600 font-medium">Progress Analytics</p>
              <p className="text-blue-500 text-sm mt-1">Click to view details</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-lg transition-all cursor-pointer transform hover:scale-105">
          <h3 className="text-lg font-semibold mb-4">Resource Allocation</h3>
          <div 
            onClick={() => alert('Opening resource allocation dashboard...')}
            className="h-64 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center hover:from-green-100 hover:to-green-200 transition-all"
          >
            <div className="text-center">
              <PieChart className="w-16 h-16 text-green-600 mx-auto mb-2" />
              <p className="text-green-600 font-medium">Resource Distribution</p>
              <p className="text-green-500 text-sm mt-1">Click to view details</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Analytics Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Analytics Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => alert('Generating comprehensive analytics report...')}
            className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105"
          >
            <BarChart3 className="w-6 h-6 mx-auto mb-2" />
            Generate Report
          </button>
          <button 
            onClick={() => alert('Opening performance dashboard...')}
            className="p-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105"
          >
            <Activity className="w-6 h-6 mx-auto mb-2" />
            Performance Dashboard
          </button>
          <button 
            onClick={() => alert('Exporting analytics data...')}
            className="p-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-105"
          >
            <PieChart className="w-6 h-6 mx-auto mb-2" />
            Export Data
          </button>
        </div>
      </div>
    </div>
  );
};