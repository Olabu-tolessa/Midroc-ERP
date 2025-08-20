import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Plus, 
  User, 
  Calendar, 
  Eye, 
  Edit, 
  Trash2,
  CheckSquare,
  Square,
  Target,
  Users,
  FileText,
  Search
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface QualityTask {
  id: string;
  title: string;
  description: string;
  type: 'standard' | 'custom';
  category: 'safety' | 'quality' | 'environmental' | 'compliance';
  assigned_to: string;
  assigned_to_name: string;
  project_id: string;
  project_name: string;
  checkpoints: {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    completed_at?: string;
    completed_by?: string;
  }[];
  created_by: string;
  created_by_name: string;
  due_date: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
}

const STANDARD_TASKS = [
  {
    title: 'Site Safety Inspection',
    description: 'Comprehensive safety inspection of construction site',
    category: 'safety',
    checkpoints: [
      { title: 'Personal Protective Equipment Check', description: 'Verify all workers have proper PPE' },
      { title: 'Scaffold Safety Inspection', description: 'Check scaffold stability and safety measures' },
      { title: 'Equipment Safety Verification', description: 'Inspect all machinery and tools' },
      { title: 'Emergency Exit Accessibility', description: 'Ensure all emergency exits are clear' },
      { title: 'First Aid Station Check', description: 'Verify first aid supplies are available' },
      { title: 'Fire Safety Equipment', description: 'Check fire extinguishers and safety equipment' }
    ]
  },
  {
    title: 'Quality Control Inspection',
    description: 'Material and workmanship quality verification',
    category: 'quality',
    checkpoints: [
      { title: 'Material Quality Check', description: 'Verify materials meet specifications' },
      { title: 'Workmanship Standards', description: 'Check work quality against standards' },
      { title: 'Measurement Verification', description: 'Verify dimensions and measurements' },
      { title: 'Documentation Review', description: 'Check all quality documentation' },
      { title: 'Testing Results Verification', description: 'Review all test results' }
    ]
  },
  {
    title: 'Environmental Compliance Check',
    description: 'Environmental regulations and compliance verification',
    category: 'environmental',
    checkpoints: [
      { title: 'Waste Management Check', description: 'Verify proper waste disposal' },
      { title: 'Noise Level Monitoring', description: 'Check noise levels compliance' },
      { title: 'Dust Control Measures', description: 'Verify dust control systems' },
      { title: 'Water Management', description: 'Check water usage and drainage' },
      { title: 'Environmental Documentation', description: 'Review environmental permits' }
    ]
  },
  {
    title: 'ISO 9001 Compliance Audit',
    description: 'ISO 9001 quality management system audit',
    category: 'compliance',
    checkpoints: [
      { title: 'Document Control', description: 'Verify document management system' },
      { title: 'Process Compliance', description: 'Check process adherence to standards' },
      { title: 'Training Records', description: 'Verify staff training documentation' },
      { title: 'Corrective Actions', description: 'Review corrective action procedures' },
      { title: 'Management Review', description: 'Check management review processes' },
      { title: 'Customer Satisfaction', description: 'Review customer feedback processes' }
    ]
  }
];

export const QualityAuditModule: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const [tasks, setTasks] = useState<QualityTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<QualityTask | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const isAdmin = user?.role === 'admin' || user?.role === 'general_manager';
  const isProjectManager = user?.role === 'project_manager';

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      // Mock data - replace with Supabase query
      const mockTasks: QualityTask[] = [
        {
          id: '1',
          title: 'Site Safety Inspection',
          description: 'Comprehensive safety inspection of construction site',
          type: 'standard',
          category: 'safety',
          assigned_to: '3',
          assigned_to_name: 'Michael Rodriguez',
          project_id: 'p1',
          project_name: 'Highway Construction Phase 1',
          checkpoints: [
            { id: 'c1', title: 'Personal Protective Equipment Check', description: 'Verify all workers have proper PPE', completed: true, completed_at: '2024-01-15T10:00:00Z', completed_by: 'Michael Rodriguez' },
            { id: 'c2', title: 'Scaffold Safety Inspection', description: 'Check scaffold stability and safety measures', completed: true, completed_at: '2024-01-15T10:30:00Z', completed_by: 'Michael Rodriguez' },
            { id: 'c3', title: 'Equipment Safety Verification', description: 'Inspect all machinery and tools', completed: false },
            { id: 'c4', title: 'Emergency Exit Accessibility', description: 'Ensure all emergency exits are clear', completed: false },
            { id: 'c5', title: 'First Aid Station Check', description: 'Verify first aid supplies are available', completed: false },
            { id: 'c6', title: 'Fire Safety Equipment', description: 'Check fire extinguishers and safety equipment', completed: false }
          ],
          created_by: '1',
          created_by_name: 'John Anderson',
          due_date: '2024-01-20',
          status: 'in_progress',
          priority: 'high',
          created_at: '2024-01-14T00:00:00Z'
        },
        {
          id: '2',
          title: 'Custom Electrical Safety Check',
          description: 'Custom electrical safety inspection for new installation',
          type: 'custom',
          category: 'safety',
          assigned_to: '3',
          assigned_to_name: 'Michael Rodriguez',
          project_id: 'p2',
          project_name: 'Urban Development Project',
          checkpoints: [
            { id: 'c7', title: 'Electrical Panel Inspection', description: 'Check main electrical panels', completed: true, completed_at: '2024-01-16T09:00:00Z', completed_by: 'Michael Rodriguez' },
            { id: 'c8', title: 'Wiring Safety Check', description: 'Verify all wiring is properly installed', completed: false },
            { id: 'c9', title: 'Ground Fault Protection', description: 'Test GFCI outlets and protection', completed: false }
          ],
          created_by: '1',
          created_by_name: 'John Anderson',
          due_date: '2024-01-18',
          status: 'in_progress',
          priority: 'critical',
          created_at: '2024-01-15T00:00:00Z'
        }
      ];
      setTasks(mockTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressPercentage = (checkpoints: QualityTask['checkpoints']) => {
    const completed = checkpoints.filter(cp => cp.completed).length;
    return Math.round((completed / checkpoints.length) * 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'safety': return 'bg-red-50 text-red-700 border-red-200';
      case 'quality': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'environmental': return 'bg-green-50 text-green-700 border-green-200';
      case 'compliance': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const toggleCheckpoint = (taskId: string, checkpointId: string) => {
    if (!user) return;

    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Allow admin, general_manager, project_manager, or the assigned user to toggle
    const canToggle = user.role === 'admin' ||
                      user.role === 'general_manager' ||
                      user.role === 'project_manager' ||
                      user.id === task.assigned_to;

    if (!canToggle) {
      return;
    }

    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const updatedCheckpoints = task.checkpoints.map(cp => {
          if (cp.id === checkpointId) {
            return {
              ...cp,
              completed: !cp.completed,
              completed_at: !cp.completed ? new Date().toISOString() : undefined,
              completed_by: !cp.completed ? user?.name : undefined
            };
          }
          return cp;
        });

        const progress = getProgressPercentage(updatedCheckpoints);
        const newStatus = progress === 100 ? 'completed' : progress > 0 ? 'in_progress' : 'pending';

        return {
          ...task,
          checkpoints: updatedCheckpoints,
          status: newStatus
        };
      }
      return task;
    }));
  };

  const CreateTaskModal = () => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      category: 'safety',
      assigned_to: '',
      project_id: '',
      due_date: '',
      priority: 'medium',
      template: ''
    });
    const [customCheckpoints, setCustomCheckpoints] = useState<{ title: string; description: string }[]>([]);

    const handleTemplateSelect = (templateTitle: string) => {
      const template = STANDARD_TASKS.find(t => t.title === templateTitle);
      if (template) {
        setFormData({
          ...formData,
          title: template.title,
          description: template.description,
          category: template.category,
          template: templateTitle
        });
        setCustomCheckpoints(template.checkpoints);
      }
    };

    const addCustomCheckpoint = () => {
      setCustomCheckpoints([...customCheckpoints, { title: '', description: '' }]);
    };

    const updateCheckpoint = (index: number, field: string, value: string) => {
      const updated = [...customCheckpoints];
      updated[index] = { ...updated[index], [field]: value };
      setCustomCheckpoints(updated);
    };

    const removeCheckpoint = (index: number) => {
      setCustomCheckpoints(customCheckpoints.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      const newTask: QualityTask = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        type: formData.template ? 'standard' : 'custom',
        category: formData.category as any,
        assigned_to: formData.assigned_to,
        assigned_to_name: 'Michael Rodriguez', // Mock PM name
        project_id: formData.project_id,
        project_name: 'Highway Construction Phase 1', // Mock project name
        checkpoints: customCheckpoints.map((cp, index) => ({
          id: `cp_${Date.now()}_${index}`,
          title: cp.title,
          description: cp.description,
          completed: false
        })),
        created_by: user?.id || '',
        created_by_name: user?.name || '',
        due_date: formData.due_date,
        status: 'pending',
        priority: formData.priority as any,
        created_at: new Date().toISOString()
      };

      setTasks(prev => [...prev, newTask]);
      setShowCreateModal(false);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'safety',
        assigned_to: '',
        project_id: '',
        due_date: '',
        priority: 'medium',
        template: ''
      });
      setCustomCheckpoints([]);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Create Quality & Safety Task</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Template Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Use Standard Template (Optional)
                </label>
                <select
                  value={formData.template}
                  onChange={(e) => handleTemplateSelect(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Create Custom Task</option>
                  {STANDARD_TASKS.map(template => (
                    <option key={template.title} value={template.title}>{template.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="safety">Safety</option>
                    <option value="quality">Quality</option>
                    <option value="environmental">Environmental</option>
                    <option value="compliance">Compliance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assign to PM</label>
                  <select
                    value={formData.assigned_to}
                    onChange={(e) => setFormData({...formData, assigned_to: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  >
                    <option value="">Select Project Manager</option>
                    <option value="3">Michael Rodriguez</option>
                    <option value="4">Sarah Mitchell</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              {/* Checkpoints */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">Task Checkpoints</label>
                  <button
                    type="button"
                    onClick={addCustomCheckpoint}
                    className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                  >
                    Add Checkpoint
                  </button>
                </div>
                <div className="space-y-3">
                  {customCheckpoints.map((checkpoint, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3">
                      <div className="grid grid-cols-2 gap-3 mb-2">
                        <input
                          type="text"
                          placeholder="Checkpoint title"
                          value={checkpoint.title}
                          onChange={(e) => updateCheckpoint(index, 'title', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          required
                        />
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Checkpoint description"
                            value={checkpoint.description}
                            onChange={(e) => updateCheckpoint(index, 'description', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => removeCheckpoint(index)}
                            className="px-2 py-2 text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={customCheckpoints.length === 0}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const TaskDetailsModal = () => {
    if (!selectedTask) return null;

    const progress = getProgressPercentage(selectedTask.checkpoints);
    const canEdit = user?.role === 'admin' ||
                    user?.role === 'general_manager' ||
                    user?.role === 'project_manager' ||
                    user?.id === selectedTask.assigned_to;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedTask.title}</h3>
                <p className="text-gray-600 mt-1">{selectedTask.description}</p>
                <div className="flex items-center gap-4 mt-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedTask.category)}`}>
                    {selectedTask.category.charAt(0).toUpperCase() + selectedTask.category.slice(1)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTask.status)}`}>
                    {selectedTask.status.replace('_', ' ').charAt(0).toUpperCase() + selectedTask.status.replace('_', ' ').slice(1)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedTask.priority)}`}>
                    {selectedTask.priority.charAt(0).toUpperCase() + selectedTask.priority.slice(1)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowTaskModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm font-bold text-gray-900">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-600 h-3 rounded-full transition-all" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Task Info */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Assignment Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Assigned to:</span>
                    <span className="font-medium">{selectedTask.assigned_to_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Project:</span>
                    <span className="font-medium">{selectedTask.project_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Due Date:</span>
                    <span className="font-medium">{new Date(selectedTask.due_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created by:</span>
                    <span className="font-medium">{selectedTask.created_by_name}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Task Statistics</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Checkpoints:</span>
                    <span className="font-medium">{selectedTask.checkpoints.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completed:</span>
                    <span className="font-medium text-green-600">{selectedTask.checkpoints.filter(cp => cp.completed).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Remaining:</span>
                    <span className="font-medium text-orange-600">{selectedTask.checkpoints.filter(cp => !cp.completed).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium capitalize">{selectedTask.type}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkpoints */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Task Checkpoints</h4>
              <div className="space-y-3">
                {selectedTask.checkpoints.map((checkpoint) => (
                  <div key={checkpoint.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => canEdit && toggleCheckpoint(selectedTask.id, checkpoint.id)}
                        disabled={!canEdit}
                        className={`mt-1 ${canEdit ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                      >
                        {checkpoint.completed ? (
                          <CheckSquare className="w-5 h-5 text-green-600" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      <div className="flex-1">
                        <h5 className={`font-medium ${checkpoint.completed ? 'text-green-700 line-through' : 'text-gray-900'}`}>
                          {checkpoint.title}
                        </h5>
                        <p className="text-sm text-gray-600 mt-1">{checkpoint.description}</p>
                        {checkpoint.completed && checkpoint.completed_at && (
                          <div className="mt-2 text-xs text-green-600">
                            ✓ Completed by {checkpoint.completed_by} on {new Date(checkpoint.completed_at).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t mt-6">
              <button
                onClick={() => setShowTaskModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
              {canEdit && selectedTask.status !== 'completed' && (
                <button
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  onClick={() => {
                    // Additional actions for PM
                  }}
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => t.status === 'overdue').length
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quality & Safety Management</h1>
          <p className="text-gray-600">Task-based quality control and safety compliance</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Task
          </button>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{taskStats.total}</p>
            </div>
            <Target className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{taskStats.inProgress}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{taskStats.completed}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{taskStats.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{taskStats.overdue}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          <div className="w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <div className="w-48">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Categories</option>
              <option value="safety">Safety</option>
              <option value="quality">Quality</option>
              <option value="environmental">Environmental</option>
              <option value="compliance">Compliance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => {
          const progress = getProgressPercentage(task.checkpoints);
          const canEdit = isProjectManager || user?.id === task.assigned_to;
          
          return (
            <div key={task.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(task.category)}`}>
                      {task.category}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${task.type === 'standard' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                      {task.type}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{task.description}</p>
                  
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Assigned to:</span>
                      <span className="font-medium">{task.assigned_to_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Due:</span>
                      <span className="font-medium">{new Date(task.due_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Project:</span>
                      <span className="font-medium">{task.project_name}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                    {task.status.replace('_', ' ').charAt(0).toUpperCase() + task.status.replace('_', ' ').slice(1)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Progress ({task.checkpoints.filter(cp => cp.completed).length}/{task.checkpoints.length})
                  </span>
                  <span className="text-sm font-bold text-gray-900">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      progress === 100 ? 'bg-green-600' : progress > 0 ? 'bg-blue-600' : 'bg-gray-400'
                    }`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Checkpoints Preview */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Checkpoints:</h4>
                <div className="space-y-2">
                  {task.checkpoints.slice(0, 3).map((checkpoint) => (
                    <div key={checkpoint.id} className="flex items-center gap-2 text-sm">
                      {checkpoint.completed ? (
                        <CheckSquare className="w-4 h-4 text-green-600" />
                      ) : (
                        <Square className="w-4 h-4 text-gray-400" />
                      )}
                      <span className={checkpoint.completed ? 'text-green-700 line-through' : 'text-gray-700'}>
                        {checkpoint.title}
                      </span>
                    </div>
                  ))}
                  {task.checkpoints.length > 3 && (
                    <div className="text-sm text-gray-500">
                      +{task.checkpoints.length - 3} more checkpoints
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setSelectedTask(task);
                    setShowTaskModal(true);
                  }}
                  className="p-2 text-gray-400 hover:text-blue-600"
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                {isAdmin && (
                  <button
                    className="p-2 text-gray-400 hover:text-green-600"
                    title="Edit Task"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                )}
                {isAdmin && (
                  <button
                    className="p-2 text-gray-400 hover:text-red-600"
                    title="Delete Task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      {showCreateModal && <CreateTaskModal />}
      {showTaskModal && <TaskDetailsModal />}
    </div>
  );
};
