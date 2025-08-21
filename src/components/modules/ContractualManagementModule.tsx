import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, FileText, Calendar, CheckCircle, Clock, AlertTriangle, Eye, Edit, Trash2, Download, Users, PenTool, UserPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import SignatureCanvas from 'react-signature-canvas';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ContractForm {
  id: string;
  title: string;
  template_type: 'document_acquisition' | 'site_handover_inspection' | 'site_handover';
  client_name: string;
  contractor_name: string;
  project_name: string;
  site_location: string;
  effective_date: string;
  form_data: any;
  client_signature?: string;
  contractor_signature?: string;
  client_signed_at?: string;
  contractor_signed_at?: string;
  client_assigned_to?: string;
  contractor_assigned_to?: string;
  client_user_name?: string;
  contractor_user_name?: string;
  status: 'draft' | 'assigned' | 'pending_signatures' | 'client_signed' | 'fully_signed' | 'completed';
  created_by: string;
  created_by_name: string;
  created_at: string;
}

interface Contract {
  id: string;
  title: string;
  client_name: string;
  contract_type: 'construction' | 'consulting' | 'maintenance' | 'supply';
  value: number;
  start_date: string;
  end_date: string;
  status: 'draft' | 'active' | 'pending_approval' | 'completed' | 'terminated';
  approval_status: 'pending' | 'approved' | 'rejected';
  compliance_checks: {
    legal_review: boolean;
    financial_review: boolean;
    technical_review: boolean;
  };
  milestones: {
    name: string;
    due_date: string;
    status: 'pending' | 'completed' | 'overdue';
  }[];
  created_at: string;
}

const FORM_TEMPLATES = {
  document_acquisition: {
    title: 'Acquisition of Document Form',
    fields: {
      project: '',
      site_location: '',
      client: '',
      contractor: '',
      consultant: '',
      documents: {
        contract_documents_no: '',
        architectural_drawings_no: '',
        structural_drawings_no: '',
        electrical_drawing_no: '',
        sanitary_drawing_no: '',
        mechanical_drawing_no: '',
        bill_of_quantities: '',
        other_no: ''
      }
    }
  },
  site_handover_inspection: {
    title: 'Site Handover Inspection Certificate',
    fields: {
      project: '',
      site_location: '',
      client: '',
      contractor: '',
      consultant: '',
      site_conditions: {
        surface_soil: '',
        surface_water: '',
        surface_slope: '',
        adjacent_construction: '',
        accessibility: ''
      },
      obstructions: {
        trees_and_bushes: '',
        water_supply_lines: '',
        sewer_drainage_lines: '',
        telephone_line: '',
        road_railway_line: '',
        over_ground_structure: '',
        underground_structure: '',
        others: ''
      },
      reference_points: {
        bench_mark: '',
        corner_stone: '',
        border_lines: '',
        water_supply_connection_points: '',
        electric_connection_points: '',
        sewer_drainage_connection_points: ''
      },
      additional_items: ''
    }
  },
  site_handover: {
    title: 'Site Handover Form',
    fields: {
      project: '',
      site_location: '',
      client: '',
      contractor: '',
      consultant: '',
      date: '',
      handover_details: {
        site_description: '',
        handover_date: '',
        work_commencement_date: ''
      }
    }
  }
};

const ContractualManagementModule: React.FC = () => {
  const { user } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [contractForms, setContractForms] = useState<ContractForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showNewContractModal, setShowNewContractModal] = useState(false);
  const [showNewFormModal, setShowNewFormModal] = useState(false);
  const [showFormDetailsModal, setShowFormDetailsModal] = useState(false);
  const [showSigningModal, setShowSigningModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedForm, setSelectedForm] = useState<ContractForm | null>(null);
  const [activeTab, setActiveTab] = useState<'contracts' | 'forms'>('forms');
  const [showCreateContractModal, setShowCreateContractModal] = useState(false);
  const [signingAs, setSigningAs] = useState<'client' | 'contractor'>('client');

  const isAuthorized = user?.role === 'admin' || user?.role === 'general_manager';
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Mock contract data
      const mockContracts: Contract[] = [
        {
          id: '1',
          title: 'Highway Construction Phase 1',
          client_name: 'Ministry of Transport',
          contract_type: 'construction',
          value: 5500000,
          start_date: '2024-01-15',
          end_date: '2024-12-31',
          status: 'active',
          approval_status: 'approved',
          compliance_checks: {
            legal_review: true,
            financial_review: true,
            technical_review: true
          },
          milestones: [
            { name: 'Site Preparation', due_date: '2024-03-01', status: 'completed' },
            { name: 'Foundation Work', due_date: '2024-06-01', status: 'pending' }
          ],
          created_at: '2024-01-01T00:00:00Z'
        }
      ];

      // Mock form data
      const mockForms: ContractForm[] = [
        {
          id: 'f1',
          title: 'Highway Project - Document Acquisition',
          template_type: 'document_acquisition',
          client_name: 'Ministry of Transport',
          contractor_name: 'Midroc Construction',
          project_name: 'Highway Construction Phase 1',
          site_location: 'Addis Ababa - Adama Highway',
          effective_date: '2024-01-15',
          form_data: FORM_TEMPLATES.document_acquisition.fields,
          client_assigned_to: '7',
          contractor_assigned_to: '8',
          client_user_name: 'Ahmed Mohammed',
          contractor_user_name: 'Sara Wilson',
          status: 'assigned',
          created_by: '1',
          created_by_name: 'John Anderson',
          created_at: '2024-01-10T00:00:00Z'
        }
      ];

      setContracts(mockContracts);
      setContractForms(mockForms);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const AssignModal = () => {
    const [assignData, setAssignData] = useState({
      client_assigned_to: '',
      contractor_assigned_to: '',
      client_user_name: '',
      contractor_user_name: ''
    });

    const mockUsers = [
      { id: '7', name: 'Ahmed Mohammed', email: 'ahmed@client.com', role: 'client' },
      { id: '8', name: 'Sara Wilson', email: 'sara@contractor.com', role: 'contractor' },
      { id: '9', name: 'Mike Johnson', email: 'mike@midroc.com', role: 'project_manager' },
      { id: '10', name: 'Lisa Chen', email: 'lisa@consultant.com', role: 'consultant' }
    ];

    const handleAssign = () => {
      if (!selectedForm) return;

      const updatedForm = {
        ...selectedForm,
        client_assigned_to: assignData.client_assigned_to,
        contractor_assigned_to: assignData.contractor_assigned_to,
        client_user_name: mockUsers.find(u => u.id === assignData.client_assigned_to)?.name || '',
        contractor_user_name: mockUsers.find(u => u.id === assignData.contractor_assigned_to)?.name || '',
        status: 'assigned' as const
      };

      setContractForms(prev => prev.map(form => 
        form.id === selectedForm.id ? updatedForm : form
      ));

      setShowAssignModal(false);
      setSelectedForm(updatedForm);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Assign Form for Signing</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assign Client</label>
              <select
                value={assignData.client_assigned_to}
                onChange={(e) => setAssignData({...assignData, client_assigned_to: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="">Select Client User</option>
                {mockUsers.filter(u => u.role === 'client' || u.role === 'project_manager').map(user => (
                  <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assign Contractor</label>
              <select
                value={assignData.contractor_assigned_to}
                onChange={(e) => setAssignData({...assignData, contractor_assigned_to: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="">Select Contractor User</option>
                {mockUsers.filter(u => u.role === 'contractor' || u.role === 'project_manager').map(user => (
                  <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                ))}
              </select>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-700">
                Assigned users will be able to sign this form according to their assigned role.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setShowAssignModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleAssign}
              disabled={!assignData.client_assigned_to || !assignData.contractor_assigned_to}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Assign Users
            </button>
          </div>
        </div>
      </div>
    );
  };

  const CreateFormModal = () => {
    const [formData, setFormData] = useState({
      template_type: 'document_acquisition',
      client_name: '',
      contractor_name: '',
      project_name: '',
      site_location: '',
      effective_date: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      const newForm: ContractForm = {
        id: Date.now().toString(),
        title: `${formData.project_name} - ${FORM_TEMPLATES[formData.template_type as keyof typeof FORM_TEMPLATES].title}`,
        template_type: formData.template_type as any,
        client_name: formData.client_name,
        contractor_name: formData.contractor_name,
        project_name: formData.project_name,
        site_location: formData.site_location,
        effective_date: formData.effective_date,
        form_data: JSON.parse(JSON.stringify(FORM_TEMPLATES[formData.template_type as keyof typeof FORM_TEMPLATES].fields)),
        status: 'draft',
        created_by: user?.id || '',
        created_by_name: user?.name || '',
        created_at: new Date().toISOString()
      };

      setContractForms(prev => [...prev, newForm]);
      setShowNewFormModal(false);

      // Show the newly created form details
      setSelectedForm(newForm);
      setShowFormDetailsModal(true);

      // Reset form
      setFormData({
        template_type: 'document_acquisition',
        client_name: '',
        contractor_name: '',
        project_name: '',
        site_location: '',
        effective_date: new Date().toISOString().split('T')[0]
      });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Create Contract Form</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Form Template</label>
              <select
                value={formData.template_type}
                onChange={(e) => setFormData({...formData, template_type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="document_acquisition">Acquisition of Document Form</option>
                <option value="site_handover_inspection">Site Handover Inspection Certificate</option>
                <option value="site_handover">Site Handover Form</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                <input
                  type="text"
                  value={formData.project_name}
                  onChange={(e) => setFormData({...formData, project_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site Location</label>
                <input
                  type="text"
                  value={formData.site_location}
                  onChange={(e) => setFormData({...formData, site_location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                <input
                  type="text"
                  value={formData.client_name}
                  onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contractor Name</label>
                <input
                  type="text"
                  value={formData.contractor_name}
                  onChange={(e) => setFormData({...formData, contractor_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Effective Date</label>
              <input
                type="date"
                value={formData.effective_date}
                onChange={(e) => setFormData({...formData, effective_date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowNewFormModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Create Form
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const SigningModal = () => {
    const sigCanvas = useRef<SignatureCanvas>(null);

    const clearSignature = () => {
      sigCanvas.current?.clear();
    };

    const saveSignature = () => {
      if (!selectedForm) return;
      
      const signatureData = sigCanvas.current?.toDataURL();
      if (!signatureData) return;

      // Check if user is authorized to sign as the selected role
      const canSignAsClient = user?.id === selectedForm.client_assigned_to;
      const canSignAsContractor = user?.id === selectedForm.contractor_assigned_to;

      if (signingAs === 'client' && !canSignAsClient) {
        alert('You are not authorized to sign as client for this form.');
        return;
      }

      if (signingAs === 'contractor' && !canSignAsContractor) {
        alert('You are not authorized to sign as contractor for this form.');
        return;
      }

      const updatedForm = {
        ...selectedForm,
        ...(signingAs === 'client' ? {
          client_signature: signatureData,
          client_signed_at: new Date().toISOString(),
          status: selectedForm.contractor_signature ? 'fully_signed' : 'client_signed'
        } : {
          contractor_signature: signatureData,
          contractor_signed_at: new Date().toISOString(),
          status: selectedForm.client_signature ? 'fully_signed' : 'pending_signatures'
        })
      };

      setContractForms(prev => prev.map(form => 
        form.id === selectedForm.id ? updatedForm as ContractForm : form
      ));

      setShowSigningModal(false);
      setSelectedForm(updatedForm as ContractForm);
    };

    if (!selectedForm) return null;

    const canSignAsClient = user?.id === selectedForm.client_assigned_to;
    const canSignAsContractor = user?.id === selectedForm.contractor_assigned_to;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Digital Signature - {signingAs === 'client' ? 'Client' : 'Contractor'}
          </h3>
          
          {/* Authorization Check */}
          {signingAs === 'client' && !canSignAsClient && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-700">
                You are not authorized to sign as client for this form.
              </p>
            </div>
          )}

          {signingAs === 'contractor' && !canSignAsContractor && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-700">
                You are not authorized to sign as contractor for this form.
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div className="border-2 border-gray-300 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Sign below:</p>
              <div className="border border-gray-200 rounded">
                <SignatureCanvas
                  ref={sigCanvas}
                  canvasProps={{
                    width: 400,
                    height: 200,
                    className: 'signature-canvas w-full'
                  }}
                  backgroundColor="white"
                />
              </div>
            </div>
            
            <div className="flex justify-between gap-3">
              <button
                onClick={clearSignature}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Clear
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSigningModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={saveSignature}
                  disabled={
                    (signingAs === 'client' && !canSignAsClient) || 
                    (signingAs === 'contractor' && !canSignAsContractor)
                  }
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Signature
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const exportToPDF = async (form: ContractForm) => {
    if (!formRef.current) return;

    try {
      const canvas = await html2canvas(formRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`${form.title.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const FormDetailsModal = () => {
    if (!selectedForm) return null;

    const canSignAsClient = user?.id === selectedForm.client_assigned_to;
    const canSignAsContractor = user?.id === selectedForm.contractor_assigned_to;

    const renderFormContent = () => {
      switch (selectedForm.template_type) {
        case 'site_handover':
          return (
            <div className="space-y-6" ref={formRef}>
              {/* Professional Header */}
              <div className="bg-white border-2 border-gray-800">
                {/* Top Header Bar */}
                <div className="bg-green-600 text-white px-4 py-2 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-1 rounded">
                      <span className="text-green-600 font-bold text-sm">MIG</span>
                    </div>
                    <div>
                      <div className="font-bold text-sm">Company Name:</div>
                      <div className="text-sm">Midroc Consulting Architects & Engineers P.L.C</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">Document No.</div>
                    <div className="font-bold">GCAE/COF/002</div>
                  </div>
                </div>

                {/* Form Title Header */}
                <div className="bg-gray-100 px-4 py-2 border-b border-gray-800">
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-lg">Site Handover Form</div>
                    <div className="text-right text-sm">
                      <div>Effective Date: {selectedForm.effective_date}</div>
                      <div className="grid grid-cols-2 gap-4 mt-1">
                        <div>Issue No: 1</div>
                        <div>Page: 1 of 2</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    (HANDOVER OF THE WORK SITE FOR THE CONSTRUCTION)
                  </div>
                </div>

                {/* Form Content */}
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div><strong>PROJECT:</strong> {selectedForm.project_name}</div>
                      <div><strong>SITE LOCATION:</strong> {selectedForm.site_location}</div>
                      <div><strong>CLIENT:</strong> {selectedForm.client_name}</div>
                    </div>
                    <div className="space-y-2">
                      <div><strong>CONTRACTOR:</strong> {selectedForm.contractor_name}</div>
                      <div><strong>CONSULTANT:</strong> Midroc Consulting Architects & Engineers P.L.C</div>
                      <div><strong>DATE:</strong> {selectedForm.effective_date}</div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <p>The site for the construction of <u>{selectedForm.project_name}</u> has been officially handed over to the contractor <u>{selectedForm.contractor_name}</u> by the client <u>{selectedForm.client_name}</u> on this <u>{new Date().getDate()}</u> day of <u>{new Date().toLocaleDateString('en-US', { month: 'long' })}</u>. In the presence of the CONSULTANT.</p>
                    
                    <p>The contractor hereby acknowledges the taking over of the work with all its explanation clearly defined in the specification and drawings. The contractor also acknowledges that the commencement date of the work shall be the <u>{new Date(selectedForm.effective_date).getDate()}</u> day of <u>{new Date(selectedForm.effective_date).toLocaleDateString('en-US', { month: 'long' })}</u>.</p>
                    
                    <p className="font-bold">IN WITNESS THEREOF THIS DOCUMENT HAS BEEN SIGNED BY ALL PRESENT IN FOUR COPIES ONE OF WHICH FOR THE CLIENT, ONE FOR THE CONTRACTOR, TWO FOR THE CONSULTANT.</p>
                  </div>

                  {/* Signature Section */}
                  <div className="mt-8 grid grid-cols-2 gap-8">
                    <div className="text-center border border-gray-400 p-4">
                      <div className="font-bold border-b border-gray-400 pb-2 mb-4">FOR THE CLIENT</div>
                      {selectedForm.client_signature && (
                        <img src={selectedForm.client_signature} alt="Client Signature" className="max-h-16 mx-auto mb-2" />
                      )}
                      <div className="border-b border-gray-300 mb-2 min-h-[2rem]"></div>
                    </div>
                    <div className="text-center border border-gray-400 p-4">
                      <div className="font-bold border-b border-gray-400 pb-2 mb-4">FOR THE CONTRACTOR</div>
                      {selectedForm.contractor_signature && (
                        <img src={selectedForm.contractor_signature} alt="Contractor Signature" className="max-h-16 mx-auto mb-2" />
                      )}
                      <div className="border-b border-gray-300 mb-2 min-h-[2rem]"></div>
                    </div>
                  </div>

                  {/* Witnesses Section */}
                  <div className="mt-8">
                    <div className="text-center font-bold border-b border-gray-400 pb-2 mb-4">WITNESSES</div>
                    <div className="border border-gray-400">
                      <div className="grid grid-cols-3 gap-0 bg-gray-100 font-bold text-center">
                        <div className="border-r border-gray-400 p-2">Name</div>
                        <div className="border-r border-gray-400 p-2">Representing</div>
                        <div className="p-2">Signature</div>
                      </div>
                      <div className="grid grid-cols-3 gap-0">
                        <div className="border-r border-gray-400 p-2 h-12">1 ________________</div>
                        <div className="border-r border-gray-400 p-2 h-12">________________</div>
                        <div className="p-2 h-12">________________</div>
                      </div>
                      <div className="grid grid-cols-3 gap-0 border-t border-gray-400">
                        <div className="border-r border-gray-400 p-2 h-12">2 ________________</div>
                        <div className="border-r border-gray-400 p-2 h-12">________________</div>
                        <div className="p-2 h-12">________________</div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex justify-center gap-4 mt-8 pt-4 border-t border-gray-400">
                    <button className="px-6 py-2 bg-gray-500 text-white rounded">Cancel</button>
                    <button className="px-6 py-2 bg-blue-600 text-white rounded">Submit Contract</button>
                  </div>
                </div>
              </div>
            </div>
          );
        
        default:
          return <div>Form template not found</div>;
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">{selectedForm.title}</h3>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  selectedForm.status === 'fully_signed' ? 'bg-green-100 text-green-800' :
                  selectedForm.status === 'client_signed' ? 'bg-blue-100 text-blue-800' :
                  selectedForm.status === 'assigned' ? 'bg-yellow-100 text-yellow-800' :
                  selectedForm.status === 'pending_signatures' ? 'bg-orange-100 text-orange-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedForm.status.replace('_', ' ').charAt(0).toUpperCase() + selectedForm.status.replace('_', ' ').slice(1)}
                </span>
                <button
                  onClick={() => setShowFormDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Assignment Info */}
            {selectedForm.status !== 'draft' && (
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Assignment Details</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
                  <div>
                    <strong>Client Assigned to:</strong> {selectedForm.client_user_name || 'Not assigned'}
                  </div>
                  <div>
                    <strong>Contractor Assigned to:</strong> {selectedForm.contractor_user_name || 'Not assigned'}
                  </div>
                </div>
              </div>
            )}

            {/* Form Content */}
            <div className="mb-6">
              {renderFormContent()}
            </div>

            {/* Actions */}
            <div className="border-t pt-6">
              <div className="flex justify-between items-center">
                {/* Assignment and Signing Actions */}
                <div className="flex gap-2">
                  {isAuthorized && selectedForm.status === 'draft' && (
                    <button
                      onClick={() => {
                        setShowAssignModal(true);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      Assign for Signing
                    </button>
                  )}
                  
                  {selectedForm.status !== 'draft' && !selectedForm.client_signature && canSignAsClient && (
                    <button
                      onClick={() => {
                        setSigningAs('client');
                        setShowSigningModal(true);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                      <PenTool className="w-4 h-4" />
                      Sign as Client
                    </button>
                  )}
                  
                  {selectedForm.status !== 'draft' && !selectedForm.contractor_signature && canSignAsContractor && (
                    <button
                      onClick={() => {
                        setSigningAs('contractor');
                        setShowSigningModal(true);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                    >
                      <PenTool className="w-4 h-4" />
                      Sign as Contractor
                    </button>
                  )}
                </div>
                
                {/* Export and Close Actions */}
                <div className="flex gap-2">
                  {isAuthorized && selectedForm.status === 'fully_signed' && (
                    <button
                      onClick={() => exportToPDF(selectedForm)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Export PDF
                    </button>
                  )}
                  <button
                    onClick={() => setShowFormDetailsModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'fully_signed': return 'bg-green-100 text-green-800';
      case 'client_signed': return 'bg-blue-100 text-blue-800';
      case 'assigned': return 'bg-yellow-100 text-yellow-800';
      case 'pending_signatures': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter forms based on user role
  const filteredForms = contractForms.filter(form => {
    if (isAuthorized) {
      return true; // Admin/GM can see all forms
    }
    
    // Regular users can only see forms assigned to them
    return form.client_assigned_to === user?.id || form.contractor_assigned_to === user?.id;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Contract Forms</h2>
          <p className="text-gray-600">Manage contract forms and digital signatures</p>
        </div>
        {isAuthorized && (
          <div className="flex gap-2">
            <button
              onClick={() => setShowNewFormModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Form
            </button>
          </div>
        )}
      </div>

      {/* Contract Forms List */}
      <div className="space-y-4">
        {filteredForms.map((form) => (
          <div key={form.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{form.title}</h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Client:</span>
                    <span className="font-medium">{form.client_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Contractor:</span>
                    <span className="font-medium">{form.contractor_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{new Date(form.effective_date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Project: {form.project_name} | Location: {form.site_location}
                </div>
                
                {/* Assignment Info */}
                {form.status !== 'draft' && (
                  <div className="mt-3 text-sm">
                    <div className="flex gap-4">
                      <span className="text-gray-600">
                        Client Assigned: <span className="font-medium text-blue-600">{form.client_user_name || 'Not assigned'}</span>
                      </span>
                      <span className="text-gray-600">
                        Contractor Assigned: <span className="font-medium text-green-600">{form.contractor_user_name || 'Not assigned'}</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(form.status)}`}>
                  {form.status.replace('_', ' ').charAt(0).toUpperCase() + form.status.replace('_', ' ').slice(1)}
                </span>
                
                {/* Action Buttons */}
                <div className="flex gap-1">
                  {isAuthorized && form.status === 'draft' && (
                    <button
                      onClick={() => {
                        setSelectedForm(form);
                        setShowAssignModal(true);
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                      title="Assign for Signing"
                    >
                      Assign
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      setSelectedForm(form);
                      setShowFormDetailsModal(true);
                    }}
                    className="p-2 text-gray-400 hover:text-blue-600"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {isAuthorized && (
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
                          setContractForms(prev => prev.filter(f => f.id !== form.id));
                        }
                      }}
                      className="p-2 text-gray-400 hover:text-red-600"
                      title="Delete Form"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {showNewFormModal && <CreateFormModal />}
      {showFormDetailsModal && <FormDetailsModal />}
      {showSigningModal && <SigningModal />}
      {showAssignModal && <AssignModal />}
    </div>
  );
};

export default ContractualManagementModule;
