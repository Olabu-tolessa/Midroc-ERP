import React from 'react';
import { ProjectsOverview } from '../projects/ProjectsOverview';
import { mockProjects } from '../../data/mockData';

export const ProjectManagementModule: React.FC = () => {
  return <ProjectsOverview projects={mockProjects} />;
};