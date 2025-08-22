import React from 'react';
import { Users, UserPlus, Calendar, TrendingUp } from 'lucide-react';

export const HRModule: React.FC = () => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Human Resources</h1>
        <p className="text-gray-600 text-sm sm:text-base">Manage construction teams, engineers, and consultants</p>
      </div>

      {/* HR Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Construction Team</p>
              <p className="text-2xl font-bold text-gray-900">85</p>
            </div>
            <Users className="w-10 h-10 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">New Engineers</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <UserPlus className="w-10 h-10 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Safety Training</p>
              <p className="text-2xl font-bold text-gray-900">18</p>
            </div>
            <Calendar className="w-10 h-10 text-orange-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Safety Score</p>
              <p className="text-2xl font-bold text-gray-900">98%</p>
            </div>
            <TrendingUp className="w-10 h-10 text-purple-600" />
          </div>
        </div>
      </div>

      {/* HR Content */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Team Management</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium">Construction Team Directory</h4>
                <p className="text-sm text-gray-600">View and manage all team members</p>
              </div>
            </div>
            <button 
              onClick={() => alert('Opening Construction Team Directory...')}
              className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-all transform hover:scale-105"
            >
              Manage
            </button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium">Engineer Recruitment</h4>
                <p className="text-sm text-gray-600">Hire engineers and construction specialists</p>
              </div>
            </div>
            <button 
              onClick={() => alert('Opening Engineer Recruitment Portal...')}
              className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-all transform hover:scale-105"
            >
              Manage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
