import React from 'react';
import { Shield, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

export const QualityAuditModule: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quality & Safety Management</h1>
        <p className="text-gray-600">Construction quality control and safety compliance</p>
      </div>

      {/* QA Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Safety Inspections</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
            </div>
            <Shield className="w-10 h-10 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Compliance Rate</p>
              <p className="text-2xl font-bold text-gray-900">98%</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Safety Incidents</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
            <AlertTriangle className="w-10 h-10 text-orange-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Reviews</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <Clock className="w-10 h-10 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Audit List */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Safety Inspections</h3>
        <div className="space-y-4">
          {[
            { name: 'Site Safety Inspection', status: 'passed', date: '2024-01-15', score: '98%' },
            { name: 'Equipment Safety Check', status: 'passed', date: '2024-01-12', score: '95%' },
            { name: 'Structural Quality Audit', status: 'issues', date: '2024-01-10', score: '85%' },
            { name: 'Environmental Compliance', status: 'pending', date: '2024-01-08', score: 'Pending' },
          ].map((audit, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-lg transition-all cursor-pointer transform hover:scale-105">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  audit.status === 'passed' ? 'bg-green-100' :
                  audit.status === 'issues' ? 'bg-orange-100' : 'bg-gray-100'
                }`}>
                  {audit.status === 'passed' && <CheckCircle className="w-5 h-5 text-green-600" />}
                  {audit.status === 'issues' && <AlertTriangle className="w-5 h-5 text-orange-600" />}
                  {audit.status === 'pending' && <Clock className="w-5 h-5 text-gray-600" />}
                </div>
                <div>
                  <h4 className="font-medium">{audit.name}</h4>
                  <p className="text-sm text-gray-600">{audit.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{audit.score}</p>
                <p className="text-sm text-gray-600 capitalize">{audit.status}</p>
                <button 
                  onClick={() => alert(`Opening ${audit.name} details...`)}
                  className="mt-2 px-3 py-1 bg-green-700 text-white rounded text-xs hover:bg-green-800 transition-all"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Quality Actions */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button 
            onClick={() => alert('Scheduling new safety inspection...')}
            className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-all transform hover:scale-105"
          >
            Schedule Inspection
          </button>
          <button 
            onClick={() => alert('Generating safety compliance report...')}
            className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-all transform hover:scale-105"
          >
            Generate Report
          </button>
          <button 
            onClick={() => alert('Opening incident management...')}
            className="px-6 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-all transform hover:scale-105"
          >
            Manage Incidents
          </button>
        </div>
      </div>
    </div>
  );
};