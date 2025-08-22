import React, { useState } from 'react';
import {
  HardHat,
  Plus,
  Edit,
  Eye,
  Settings,
  Download,
  Search,
  Filter,
  Trash2,
  CheckCircle,
  AlertCircle,
  Upload,
  FileImage,
  FileText
} from 'lucide-react';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType } from 'docx';
import { saveAs } from 'file-saver';
import { Project } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { NewProjectModal } from './NewProjectModal';
import { ProjectDetailsModal } from './ProjectDetailsModal';
import { EditProjectModal } from './EditProjectModal';
import { addProject, updateProject, deleteProject } from '../../data/mockData';

interface ProjectsOverviewProps {
  projects: Project[];
}

export const ProjectsOverview: React.FC<ProjectsOverviewProps> = ({ projects }) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedProjectForUpload, setSelectedProjectForUpload] = useState<Project | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'planning':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'on-hold':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleViewProject = (project: Project) => {
    setSelectedProject(project);
    setShowDetailsModal(true);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setShowEditModal(true);
  };

  const handleManageProject = (project: Project) => {
    setNotification({
      type: 'success',
      message: `Managing project: ${project.name}. Advanced project settings opened.`
    });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleExportProject = async (project: Project) => {
    try {
      const doc = new Document({
        creator: "Midroc ERP System",
        title: `Construction Project Report - ${project.name}`,
        description: `Detailed report for construction project: ${project.name}`,
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "MIDROC CONSTRUCTION PROJECT REPORT",
                  bold: true,
                  size: 36,
                }),
              ],
              heading: HeadingLevel.TITLE,
            }),
            new Paragraph({
              text: "",
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Project Details",
                  bold: true,
                  size: 32,
                }),
              ],
              heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Project Name: ",
                  bold: true,
                }),
                new TextRun({
                  text: project.name,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Status: ",
                  bold: true,
                }),
                new TextRun({
                  text: project.status.charAt(0).toUpperCase() + project.status.slice(1),
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Priority: ",
                  bold: true,
                }),
                new TextRun({
                  text: project.priority.charAt(0).toUpperCase() + project.priority.slice(1),
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Progress: ",
                  bold: true,
                }),
                new TextRun({
                  text: `${project.progress}%`,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Contract Value: ",
                  bold: true,
                }),
                new TextRun({
                  text: formatCurrency(project.budget),
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Start Date: ",
                  bold: true,
                }),
                new TextRun({
                  text: new Date(project.startDate).toLocaleDateString(),
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "End Date: ",
                  bold: true,
                }),
                new TextRun({
                  text: new Date(project.endDate).toLocaleDateString(),
                }),
              ],
            }),
            new Paragraph({
              text: "",
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Project Manager",
                  bold: true,
                  size: 28,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Name: ",
                  bold: true,
                }),
                new TextRun({
                  text: project.manager.name,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Email: ",
                  bold: true,
                }),
                new TextRun({
                  text: project.manager.email,
                }),
              ],
            }),
            new Paragraph({
              text: "",
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Construction Team (${project.team.length} members)`,
                  bold: true,
                  size: 28,
                }),
              ],
            }),
            ...project.team.map(member =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: `• ${member.name} (${member.role}) - ${member.department} - ${member.email}`,
                  }),
                ],
              })
            ),
            new Paragraph({
              text: "",
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Project Description",
                  bold: true,
                  size: 28,
                }),
              ],
            }),
            new Paragraph({
              text: project.description || 'No description provided',
            }),
            new Paragraph({
              text: "",
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Export Information",
                  bold: true,
                  size: 28,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Export Date: ",
                  bold: true,
                }),
                new TextRun({
                  text: new Date().toLocaleString(),
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Generated by: ",
                  bold: true,
                }),
                new TextRun({
                  text: "Midroc ERP System",
                }),
              ],
            }),
          ],
        }],
      });

      const blob = await Packer.toBlob(doc);
      const fileName = `${project.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_construction_report.docx`;
      saveAs(blob, fileName);

      setNotification({
        type: 'success',
        message: `Construction project report for "${project.name}" has been exported successfully!`
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Export error:', error);
      setNotification({
        type: 'error',
        message: 'Failed to export project report. Please try again.'
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleDeleteProject = async (project: Project) => {
    if (!window.confirm(`Are you sure you want to delete the construction project "${project.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      deleteProject(project.id);
      setNotification({
        type: 'success',
        message: `Construction project "${project.name}" has been deleted successfully.`
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Delete error:', error);
      setNotification({
        type: 'error',
        message: 'Failed to delete project. Please try again.'
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleUploadDesigns = (project: Project) => {
    setSelectedProjectForUpload(project);
    setShowUploadModal(true);
  };

  const handleCreateProject = async (projectData: any) => {
    try {
      addProject(projectData);
      setShowNewProjectModal(false);
      setNotification({
        type: 'success',
        message: `New construction project "${projectData.name}" has been created successfully!`
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Create project error:', error);
      setNotification({
        type: 'error',
        message: 'Failed to create project. Please try again.'
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleUpdateProject = async (projectData: any) => {
    try {
      updateProject(projectData);
      setShowEditModal(false);
      setSelectedProject(null);
      setNotification({
        type: 'success',
        message: `Construction project "${projectData.name}" has been updated successfully!`
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Update project error:', error);
      setNotification({
        type: 'error',
        message: 'Failed to update project. Please try again.'
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  // File Upload Modal Component
  const FileUploadModal = () => {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const files = Array.from(e.dataTransfer.files).filter(file =>
        file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'application/pdf'
      );

      if (files.length > 0) {
        setUploadedFiles(prev => [...prev, ...files]);
      }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []).filter(file =>
        file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'application/pdf'
      );

      if (files.length > 0) {
        setUploadedFiles(prev => [...prev, ...files]);
      }
    };

    const removeFile = (index: number) => {
      setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
      if (uploadedFiles.length === 0) {
        setNotification({
          type: 'error',
          message: 'Please select files to upload.'
        });
        setTimeout(() => setNotification(null), 3000);
        return;
      }

      try {
        // Here you would upload to Supabase storage
        // For now, we'll simulate the upload
        console.log('Uploading files for project:', selectedProjectForUpload?.name);
        console.log('Files:', uploadedFiles);

        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        setNotification({
          type: 'success',
          message: `${uploadedFiles.length} design file(s) uploaded successfully to project "${selectedProjectForUpload?.name}"`
        });

        setShowUploadModal(false);
        setSelectedProjectForUpload(null);
        setUploadedFiles([]);
        setTimeout(() => setNotification(null), 3000);
      } catch (error) {
        console.error('Upload error:', error);
        setNotification({
          type: 'error',
          message: 'Failed to upload files. Please try again.'
        });
        setTimeout(() => setNotification(null), 3000);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
            Upload Design Files - {selectedProjectForUpload?.name}
          </h3>

          <div
            className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-colors ${
              dragActive ? 'border-green-500 bg-green-50' : 'border-gray-300'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-base sm:text-lg font-medium text-gray-900 mb-2">
              Drop design files here or click to browse
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Support for JPG and PDF formats only
            </p>
            <input
              type="file"
              multiple
              accept=".jpg,.jpeg,.pdf"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="bg-green-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-green-700 cursor-pointer inline-block text-sm sm:text-base"
            >
              Browse Files
            </label>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-3">Selected Files:</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {file.type === 'application/pdf' ? (
                        <FileText className="w-6 h-6 text-red-600 flex-shrink-0" />
                      ) : (
                        <FileImage className="w-6 h-6 text-blue-600 flex-shrink-0" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 truncate">{file.name}</p>
                        <p className="text-sm text-gray-600">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-800 flex-shrink-0 ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
            <button
              onClick={() => {
                setShowUploadModal(false);
                setSelectedProjectForUpload(null);
                setUploadedFiles([]);
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={uploadedFiles.length === 0}
              className="px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
            >
              Upload Files
            </button>
          </div>
        </div>
      </div>
    );
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const projectStats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    planning: projects.filter(p => p.status === 'planning').length,
    completed: projects.filter(p => p.status === 'completed').length,
    onHold: projects.filter(p => p.status === 'on-hold').length,
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-3 sm:p-4 rounded-lg shadow-lg flex items-center gap-2 max-w-sm ${
          notification.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {notification.type === 'success' ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />}
          <span className="text-sm">{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Construction Project Management</h1>
          <p className="text-gray-600 text-sm sm:text-base">Manage and track all construction and consulting projects</p>
        </div>
        {(user?.role === 'admin' || user?.role === 'general_manager') && (
          <button 
            onClick={() => setShowNewProjectModal(true)}
            className="bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-800 transition-colors text-sm sm:text-base whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Construction Project</span>
            <span className="sm:hidden">New Project</span>
          </button>
        )}
      </div>

      {/* Statistics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 sm:p-4 rounded-lg shadow-lg">
          <div className="text-xl sm:text-2xl font-bold">{projectStats.total}</div>
          <div className="text-blue-100 text-xs sm:text-sm">Total Projects</div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-3 sm:p-4 rounded-lg shadow-lg">
          <div className="text-xl sm:text-2xl font-bold">{projectStats.active}</div>
          <div className="text-green-100 text-xs sm:text-sm">Active</div>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-3 sm:p-4 rounded-lg shadow-lg">
          <div className="text-xl sm:text-2xl font-bold">{projectStats.planning}</div>
          <div className="text-yellow-100 text-xs sm:text-sm">Planning</div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-3 sm:p-4 rounded-lg shadow-lg">
          <div className="text-xl sm:text-2xl font-bold">{projectStats.completed}</div>
          <div className="text-purple-100 text-xs sm:text-sm">Completed</div>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-3 sm:p-4 rounded-lg shadow-lg col-span-2 sm:col-span-1">
          <div className="text-xl sm:text-2xl font-bold">{projectStats.onHold}</div>
          <div className="text-red-100 text-xs sm:text-sm">On Hold</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div className="relative sm:w-auto">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="planning">Planning</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
          </select>
        </div>
      </div>

      {/* Projects - Mobile Cards / Desktop Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Construction Project</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Priority</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Progress</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Contract Value</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Timeline</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Construction Team</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center border border-green-300">
                        <HardHat className="w-5 h-5 text-green-700" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{project.name}</div>
                        <div className="text-sm text-gray-500">Project Manager: {project.manager.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getPriorityColor(project.priority)}`}>
                      {project.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-600 to-green-700 h-2 rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-12">{project.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(project.budget)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div>{new Date(project.startDate).toLocaleDateString()}</div>
                      <div className="text-gray-500">to {new Date(project.endDate).toLocaleDateString()}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div>{project.team.length} members</div>
                      <div className="text-gray-500">Led by {project.manager.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewProject(project)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {(user?.role === 'admin' || user?.role === 'general_manager' || user?.role === 'project_manager') && (
                        <button
                          onClick={() => handleEditProject(project)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit Project"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleExportProject(project)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Export Project"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      {(user?.role === 'admin' || user?.role === 'general_manager') && (
                        <button
                          onClick={() => handleManageProject(project)}
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Manage Project"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden divide-y divide-gray-200">
          {filteredProjects.map((project) => (
            <div key={project.id} className="p-4 space-y-3">
              {/* Project Header */}
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center border border-green-300 flex-shrink-0">
                  <HardHat className="w-6 h-6 text-green-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{project.name}</h3>
                  <p className="text-sm text-gray-500">PM: {project.manager.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getPriorityColor(project.priority)}`}>
                      {project.priority}
                    </span>
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Progress:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-600 to-green-700 h-2 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-900">{project.progress}%</span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Budget:</span>
                  <div className="font-medium text-gray-900">{formatCurrency(project.budget)}</div>
                </div>
                <div>
                  <span className="text-gray-500">Start Date:</span>
                  <div className="font-medium text-gray-900">{new Date(project.startDate).toLocaleDateString()}</div>
                </div>
                <div>
                  <span className="text-gray-500">Team:</span>
                  <div className="font-medium text-gray-900">{project.team.length} members</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => handleViewProject(project)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                {(user?.role === 'admin' || user?.role === 'general_manager' || user?.role === 'project_manager') && (
                  <button
                    onClick={() => handleEditProject(project)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleExportProject(project)}
                  className="p-2 text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                  title="Export"
                >
                  <Download className="w-4 h-4" />
                </button>
                {(user?.role === 'admin' || user?.role === 'general_manager') && (
                  <button
                    onClick={() => handleManageProject(project)}
                    className="p-2 text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                    title="Manage"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <HardHat className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or create a new project.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showNewProjectModal && (
        <NewProjectModal
          isOpen={showNewProjectModal}
          onClose={() => setShowNewProjectModal(false)}
          onSubmit={handleCreateProject}
        />
      )}

      {showDetailsModal && selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedProject(null);
          }}
          onEdit={() => {
            setShowDetailsModal(false);
            setShowEditModal(true);
          }}
          onUploadDesigns={() => {
            setShowDetailsModal(false);
            handleUploadDesigns(selectedProject);
          }}
        />
      )}

      {showEditModal && selectedProject && (
        <EditProjectModal
          project={selectedProject}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedProject(null);
          }}
          onSubmit={handleUpdateProject}
        />
      )}

      {showUploadModal && <FileUploadModal />}
    </div>
  );
};
