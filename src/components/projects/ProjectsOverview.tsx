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
      // Create DOCX document
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              text: "MIDROC ERP - PROJECT EXPORT REPORT",
              heading: HeadingLevel.TITLE,
            }),
            new Paragraph({
              text: "",
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Project Information",
                  bold: true,
                  size: 28,
                }),
              ],
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
                  text: "Project ID: ",
                  bold: true,
                }),
                new TextRun({
                  text: project.id,
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
                  text: project.status.toUpperCase(),
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
                  text: project.priority.toUpperCase(),
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
                  text: "Budget: ",
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
                  text: "Timeline: ",
                  bold: true,
                }),
                new TextRun({
                  text: `${project.startDate} to ${project.endDate}`,
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
            new Paragraph({
              children: [
                new TextRun({
                  text: "Format: ",
                  bold: true,
                }),
                new TextRun({
                  text: "Construction Project Report (DOCX)",
                }),
              ],
            }),
            new Paragraph({
              text: "",
            }),
            new Paragraph({
              text: `© ${new Date().getFullYear()} Midroc Construction & Consulting`,
              alignment: "center",
            }),
          ],
        }],
      });

      // Generate and save the document
      const buffer = await Packer.toBuffer(doc);
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
      saveAs(blob, `${project.name.replace(/\s+/g, '_')}_Project_Report.docx`);

      setNotification({
        type: 'success',
        message: `Project "${project.name}" exported as DOCX document!`
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Error exporting project:', error);
      setNotification({
        type: 'error',
        message: 'Failed to export project. Please try again.'
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleDeleteProject = (project: Project) => {
    if (window.confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone.`)) {
      deleteProject(project.id);
      setNotification({
        type: 'success',
        message: `Project "${project.name}" has been deleted successfully.`
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleUploadDesign = (project: Project) => {
    if (user?.role === 'admin' || user?.role === 'general_manager') {
      setSelectedProjectForUpload(project);
      setShowUploadModal(true);
    } else {
      setNotification({
        type: 'error',
        message: 'Only General Managers and Admins can upload design files.'
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const UploadDesignModal = () => {
    const [dragActive, setDragActive] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

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
      } else {
        setNotification({
          type: 'error',
          message: 'Please upload only JPG or PDF files.'
        });
        setTimeout(() => setNotification(null), 3000);
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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Upload Design Files - {selectedProjectForUpload?.name}
          </h3>

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? 'border-green-500 bg-green-50' : 'border-gray-300'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
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
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 cursor-pointer inline-block"
            >
              Browse Files
            </label>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-3">Selected Files:</h4>
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {file.type === 'application/pdf' ? (
                        <FileText className="w-6 h-6 text-red-600" />
                      ) : (
                        <FileImage className="w-6 h-6 text-blue-600" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-600">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-6">
            <button
              onClick={() => {
                setShowUploadModal(false);
                setSelectedProjectForUpload(null);
                setUploadedFiles([]);
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={uploadedFiles.length === 0}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
          notification.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Construction Project Management</h1>
          <p className="text-gray-600">Manage and track all construction and consulting projects</p>
        </div>
        {(user?.role === 'admin' || user?.role === 'general_manager') && (
          <button 
            onClick={() => setShowNewProjectModal(true)}
            className="bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Construction Project
          </button>
        )}
      </div>

      {/* Statistics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg shadow-lg">
          <div className="text-2xl font-bold">{projectStats.total}</div>
          <div className="text-blue-100 text-sm">Total Construction Projects</div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg shadow-lg">
          <div className="text-2xl font-bold">{projectStats.active}</div>
          <div className="text-green-100 text-sm">Active Construction</div>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 rounded-lg shadow-lg">
          <div className="text-2xl font-bold">{projectStats.planning}</div>
          <div className="text-yellow-100 text-sm">Design & Planning</div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg shadow-lg">
          <div className="text-2xl font-bold">{projectStats.completed}</div>
          <div className="text-purple-100 text-sm">Completed Projects</div>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-lg shadow-lg">
          <div className="text-2xl font-bold">{projectStats.onHold}</div>
          <div className="text-red-100 text-sm">Suspended Projects</div>
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
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="planning">Planning</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
          </select>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
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
                    <div className="flex -space-x-2">
                      {project.team.slice(0, 3).map((member, index) => (
                        <div
                          key={index}
                          className="w-8 h-8 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center border-2 border-white text-xs font-medium text-green-700"
                          title={member.name}
                        >
                          {member.name.charAt(0)}
                        </div>
                      ))}
                      {project.team.length > 3 && (
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border-2 border-white text-xs font-medium text-gray-600">
                          +{project.team.length - 3}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleViewProject(project)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors" 
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {(user?.role === 'admin' || user?.role === 'general_manager' || user?.role === 'project_manager') && (
                        <button 
                          onClick={() => handleEditProject(project)}
                          className="p-1 text-gray-400 hover:text-green-600 transition-colors" 
                          title="Edit Project"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {(user?.role === 'admin' || user?.role === 'general_manager') && (
                        <button 
                          onClick={() => handleManageProject(project)}
                          className="p-1 text-gray-400 hover:text-purple-600 transition-colors" 
                          title="Manage Project"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                      )}
                      {(user?.role === 'admin' || user?.role === 'general_manager') && (
                        <button
                          onClick={() => handleUploadDesign(project)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Upload Design"
                        >
                          <Upload className="w-4 h-4" />
                        </button>
                      )}
                      {(user?.role === 'admin' || user?.role === 'general_manager' || user?.role === 'project_manager') && (
                        <button
                          onClick={() => handleExportProject(project)}
                          className="p-1 text-gray-400 hover:text-orange-600 transition-colors"
                          title="Export DOCX"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                      {user?.role === 'admin' && (
                        <button 
                          onClick={() => handleDeleteProject(project)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors" 
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showNewProjectModal && (
        <NewProjectModal 
          onClose={() => setShowNewProjectModal(false)}
          onSave={(projectData) => {
            addProject(projectData);
            setShowNewProjectModal(false);
            setNotification({
              type: 'success',
              message: `Project "${projectData.name}" created successfully!`
            });
            setTimeout(() => setNotification(null), 3000);
          }}
        />
      )}

      {showDetailsModal && selectedProject && (
        <ProjectDetailsModal 
          project={selectedProject}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedProject(null);
          }}
        />
      )}

      {showEditModal && selectedProject && (
        <EditProjectModal 
          project={selectedProject}
          onClose={() => {
            setShowEditModal(false);
            setSelectedProject(null);
          }}
          onSave={(updatedProject) => {
            updateProject(updatedProject);
            setShowEditModal(false);
            setSelectedProject(null);
            setNotification({
              type: 'success',
              message: `Project "${updatedProject.name}" updated successfully!`
            });
            setTimeout(() => setNotification(null), 3000);
          }}
        />
      )}

      {showUploadModal && <UploadDesignModal />}
    </div>
  );
};
