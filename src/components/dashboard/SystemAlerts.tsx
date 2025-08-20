import React from 'react';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { Alert } from '../../types';

interface SystemAlertsProps {
  alerts: Alert[];
}

const getAlertIcon = (type: string) => {
  switch (type) {
    case 'success':
      return CheckCircle;
    case 'error':
      return XCircle;
    case 'warning':
      return AlertTriangle;
    default:
      return Info;
  }
};

const getAlertColor = (type: string) => {
  switch (type) {
    case 'success':
      return 'text-green-600 bg-green-100 border-green-200';
    case 'error':
      return 'text-red-600 bg-red-100 border-red-200';
    case 'warning':
      return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    default:
      return 'text-blue-600 bg-blue-100 border-blue-200';
  }
};

export const SystemAlerts: React.FC<SystemAlertsProps> = ({ alerts }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">System Alerts</h3>
      <div className="space-y-3">
        {alerts.map((alert) => {
          const Icon = getAlertIcon(alert.type);
          const colorClass = getAlertColor(alert.type);
          
          return (
            <div key={alert.id} className={`border rounded-lg p-3 ${colorClass}`}>
              <div className="flex items-start gap-3">
                <Icon className="w-5 h-5 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{alert.title}</p>
                  <p className="text-sm opacity-90">{alert.message}</p>
                  <p className="text-xs opacity-75 mt-1">{alert.timestamp}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};