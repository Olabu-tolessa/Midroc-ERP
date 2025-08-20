import React from 'react';
import { Calendar, Clock, Users } from 'lucide-react';
import { Event } from '../../types';

interface UpcomingEventsProps {
  events: Event[];
}

const getEventIcon = (type: string) => {
  switch (type) {
    case 'meeting':
      return Users;
    case 'deadline':
      return Clock;
    default:
      return Calendar;
  }
};

const getEventColor = (type: string) => {
  switch (type) {
    case 'meeting':
      return 'text-blue-600 bg-blue-100';
    case 'deadline':
      return 'text-red-600 bg-red-100';
    case 'training':
      return 'text-green-600 bg-green-100';
    default:
      return 'text-purple-600 bg-purple-100';
  }
};

export const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
      <div className="space-y-4">
        {events.map((event) => {
          const Icon = getEventIcon(event.type);
          const colorClass = getEventColor(event.type);
          
          return (
            <div key={event.id} className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{event.title}</p>
                <p className="text-sm text-gray-600">{event.date}</p>
                <p className="text-xs text-gray-500 capitalize">{event.type}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};