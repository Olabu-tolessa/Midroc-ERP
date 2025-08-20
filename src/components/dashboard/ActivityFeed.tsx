import React from 'react';
import { Clock, User, FolderKanban, DollarSign, AlertTriangle } from 'lucide-react';
import { Activity } from '../../types';

interface ActivityFeedProps {
  activities: Activity[];
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'project':
      return FolderKanban;
    case 'finance':
      return DollarSign;
    case 'hr':
      return User;
    default:
      return AlertTriangle;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case 'project':
      return 'text-blue-600 bg-blue-100';
    case 'finance':
      return 'text-green-600 bg-green-100';
    case 'hr':
      return 'text-purple-600 bg-purple-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = getActivityIcon(activity.type);
          const colorClass = getActivityColor(activity.type);
          
          return (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colorClass}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-600">{activity.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">{activity.timestamp}</span>
                  <span className="text-xs text-gray-500">by {activity.user}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};