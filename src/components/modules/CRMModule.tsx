import React from 'react';
import { UserCheck, Users, Phone, Mail } from 'lucide-react';

export const CRMModule: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Client Relations Management</h1>
        <p className="text-gray-600">Manage construction clients, contracts, and relationships</p>
      </div>

      {/* CRM Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Clients</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
            </div>
            <Users className="w-10 h-10 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Project Proposals</p>
              <p className="text-2xl font-bold text-gray-900">28</p>
            </div>
            <UserCheck className="w-10 h-10 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Site Visits</p>
              <p className="text-2xl font-bold text-gray-900">45</p>
            </div>
            <Phone className="w-10 h-10 text-orange-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Contract Updates</p>
              <p className="text-2xl font-bold text-gray-900">89</p>
            </div>
            <Mail className="w-10 h-10 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Customer List */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Clients</h3>
        <div className="space-y-4">
          {[
            { name: 'Stockholm Municipality', contact: 'Erik Andersson', email: 'erik@stockholm.se', status: 'Active' },
            { name: 'Malmö Development Corp', contact: 'Anna Larsson', email: 'anna@malmo-dev.se', status: 'Contract' },
            { name: 'Göteborg Housing Ltd', contact: 'Lars Nilsson', email: 'lars@gbg-housing.se', status: 'Active' },
            { name: 'Nordic Infrastructure', contact: 'Maria Johansson', email: 'maria@nordic-infra.se', status: 'Proposal' },
          ].map((customer, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-lg transition-all cursor-pointer transform hover:scale-105">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">{customer.name}</h4>
                  <p className="text-sm text-gray-600">{customer.contact} • {customer.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  customer.status === 'Active' ? 'bg-green-100 text-green-800' :
                  customer.status === 'Contract' ? 'bg-blue-100 text-blue-800' :
                  customer.status === 'Proposal' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {customer.status}
                </span>
                <button 
                  onClick={() => alert(`Opening ${customer.name} client profile...`)}
                  className="px-3 py-1 bg-green-700 text-white rounded hover:bg-green-800 text-sm transition-all transform hover:scale-105"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* CRM Actions */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button 
            onClick={() => alert('Adding new client...')}
            className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-all transform hover:scale-105"
          >
            Add New Client
          </button>
          <button 
            onClick={() => alert('Generating client report...')}
            className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-all transform hover:scale-105"
          >
            Generate Report
          </button>
          <button 
            onClick={() => alert('Opening contract management...')}
            className="px-6 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-all transform hover:scale-105"
          >
            Manage Contracts
          </button>
        </div>
      </div>
    </div>
  );
};