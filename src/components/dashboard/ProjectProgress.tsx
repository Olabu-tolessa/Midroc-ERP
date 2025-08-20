import React from 'react';
import { Project } from '../../types';

interface ProjectProgressProps {
  projects: Project[];
}

export const ProjectProgress: React.FC<ProjectProgressProps> = ({ projects }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'planning':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-blue-500';
      case 'on-hold':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Progress</h3>
      <div className="space-y-4">
        {projects.slice(0, 5).map((project) => (
          <div key={project.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(project.status)}`} />
                <span className="text-sm font-medium text-gray-900">{project.name}</span>
              </div>
              <span className="text-sm text-gray-600">{project.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${getStatusColor(project.status)}`}
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};