import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, FileText, Calendar, CheckCircle, Clock, AlertTriangle, Eye, Edit, Trash2, Download, Users, PenTool } from 'lucide-react';
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
  status: 'draft' | 'pending_signatures' | 'client_signed' | 'fully_signed' | 'completed';
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
  const [selectedForm, setSelectedForm] = useState<ContractForm | null>(null);
  const [activeTab, setActiveTab] = useState<'contracts' | 'forms'>('contracts');
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
          client_signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAA',
          status: 'client_signed',
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
    const [isSigningMode, setIsSigningMode] = useState(false);

    const clearSignature = () => {
      sigCanvas.current?.clear();
    };

    const saveSignature = () => {
      if (!selectedForm) return;
      
      const signatureData = sigCanvas.current?.toDataURL();
      if (!signatureData) return;

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

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Digital Signature - {signingAs === 'client' ? 'Client' : 'Contractor'}
          </h3>
          
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
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
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

    const renderFormContent = () => {
      switch (selectedForm.template_type) {
        case 'document_acquisition':
          return (
            <div className="space-y-6" ref={formRef}>
              {/* Header */}
              <div className="border border-gray-300 p-4 bg-white">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-green-100 rounded flex items-center justify-center">
                      <span className="text-green-700 font-bold">LOGO</span>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold">Gubalafto Consulting Architects & Engineers P.L.C</h2>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">Document No: GCAE/COF/001</div>
                    <div className="text-sm">Issue No: 1</div>
                    <div className="text-sm">Page: 1 of 1</div>
                  </div>
                </div>
                
                <div className="bg-gray-100 p-2 text-center">
                  <h3 className="font-bold">Acquisition of Document Form</h3>
                </div>
                
                <div className="flex justify-between mt-2">
                  <div className="text-sm">Effective Date: {selectedForm.effective_date}</div>
                </div>
              </div>

              {/* Form Content */}
              <div className="border border-gray-300 p-6 bg-white">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><strong>PROJECT:</strong> {selectedForm.project_name}</div>
                    <div><strong>SITE LOCATION:</strong> {selectedForm.site_location}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><strong>CLIENT:</strong> {selectedForm.client_name}</div>
                    <div><strong>CONTRACTOR:</strong> {selectedForm.contractor_name}</div>
                  </div>
                  
                  <div className="mt-6">
                    <p>This is to acknowledge that I have received the following set of documents concerning the project:</p>
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <div className="flex">
                      <span className="w-8">1.</span>
                      <span>Contract Documents No. ________________________________</span>
                    </div>
                    <div className="flex">
                      <span className="w-8">2.</span>
                      <span>Architectural Drawings No. ________________________________</span>
                    </div>
                    <div className="flex">
                      <span className="w-8">3.</span>
                      <span>Structural Drawings No. ________________________________</span>
                    </div>
                    <div className="flex">
                      <span className="w-8">4.</span>
                      <span>Electrical Drawing No. ________________________________</span>
                    </div>
                    <div className="flex">
                      <span className="w-8">5.</span>
                      <span>Sanitary Drawing No. ________________________________</span>
                    </div>
                    <div className="flex">
                      <span className="w-8">6.</span>
                      <span>Mechanical Drawing No. ________________________________</span>
                    </div>
                    <div className="flex">
                      <span className="w-8">7.</span>
                      <span>Bill of Quantities ________________________________ Pages</span>
                    </div>
                    <div className="flex">
                      <span className="w-8">8.</span>
                      <span>Other No. ________________________________</span>
                    </div>
                  </div>
                  
                  <div className="mt-8 grid grid-cols-2 gap-8">
                    <div className="text-center">
                      <div className="border-b border-gray-400 pb-2 mb-2">
                        <strong>DOCUMENT HANDED OVER</strong>
                      </div>
                      {selectedForm.client_signature && (
                        <img src={selectedForm.client_signature} alt="Client Signature" className="max-h-16 mx-auto mb-2" />
                      )}
                      <div className="border-b border-gray-300 mb-1"></div>
                      <div className="text-sm">Signature & Date</div>
                    </div>
                    <div className="text-center">
                      <div className="border-b border-gray-400 pb-2 mb-2">
                        <strong>DOCUMENT RECEIVED BY</strong>
                      </div>
                      {selectedForm.contractor_signature && (
                        <img src={selectedForm.contractor_signature} alt="Contractor Signature" className="max-h-16 mx-auto mb-2" />
                      )}
                      <div className="border-b border-gray-300 mb-1"></div>
                      <div className="text-sm">Signature & Date</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        
        case 'site_handover_inspection':
          return (
            <div className="space-y-6" ref={formRef}>
              <div className="border border-gray-300 p-4 bg-white">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-green-100 rounded flex items-center justify-center">
                      <span className="text-green-700 font-bold">LOGO</span>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold">Gubalafto Consulting Architects & Engineers P.L.C</h2>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">Document No: GCAE/COF/003</div>
                    <div className="text-sm">Issue No: 1</div>
                    <div className="text-sm">Page: 1 of 2</div>
                  </div>
                </div>
                
                <div className="bg-gray-100 p-2 text-center">
                  <h3 className="font-bold">Site Handover Inspection Certificate</h3>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div><strong>PROJECT:</strong> {selectedForm.project_name}</div>
                  <div><strong>SITE LOCATION:</strong> {selectedForm.site_location}</div>
                  <div><strong>CLIENT:</strong> {selectedForm.client_name}</div>
                  <div><strong>CONTRACTOR:</strong> {selectedForm.contractor_name}</div>
                </div>
                
                <div className="mt-6 space-y-4">
                  <div>
                    <h4 className="font-bold">1. Site</h4>
                    <ul className="ml-6 space-y-1">
                      <li>• Surface soil ________________________________</li>
                      <li>• Surface water ________________________________</li>
                      <li>• Surface slope ________________________________</li>
                      <li>• Adjacent construction ________________________________</li>
                      <li>• Accessibility ________________________________</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-bold">2. Obstructions</h4>
                    <ul className="ml-6 space-y-1">
                      <li>• Trees and bushes ________________________________</li>
                      <li>• Water supply lines ________________________________</li>
                      <li>• Sewer/drainage lines ________________________________</li>
                      <li>• Telephone line ________________________________</li>
                      <li>• Road/railway line ________________________________</li>
                      <li>• Over ground structure ________________________________</li>
                      <li>• Underground structure ________________________________</li>
                      <li>• Others ________________________________</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-bold">3. Reference</h4>
                    <ul className="ml-6 space-y-1">
                      <li>• Bench mark ________________________________</li>
                      <li>• Corner stone ________________________________</li>
                      <li>• Border lines ________________________________</li>
                      <li>• Water supply connection points ________________________________</li>
                      <li>• Electric connection points ________________________________</li>
                      <li>• Sewer drainage connection points ________________________________</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-bold">4. Additional items/comments:</h4>
                    <div className="border border-gray-300 p-2 min-h-[80px]"></div>
                  </div>
                </div>
                
                <div className="mt-8 grid grid-cols-2 gap-8">
                  <div className="text-center">
                    <div className="border-b border-gray-400 pb-2 mb-2">
                      <strong>Supervisor</strong>
                    </div>
                    {selectedForm.client_signature && (
                      <img src={selectedForm.client_signature} alt="Supervisor Signature" className="max-h-16 mx-auto mb-2" />
                    )}
                    <div className="border-b border-gray-300 mb-1">Name</div>
                    <div className="border-b border-gray-300 mb-1">Signature</div>
                  </div>
                  <div className="text-center">
                    <div className="border-b border-gray-400 pb-2 mb-2">
                      <strong>Contractors</strong>
                    </div>
                    {selectedForm.contractor_signature && (
                      <img src={selectedForm.contractor_signature} alt="Contractor Signature" className="max-h-16 mx-auto mb-2" />
                    )}
                    <div className="border-b border-gray-300 mb-1">Name</div>
                    <div className="border-b border-gray-300 mb-1">Signature</div>
                  </div>
                </div>
              </div>
            </div>
          );
        
        case 'site_handover':
          return (
            <div className="space-y-6" ref={formRef}>
              <div className="border border-gray-300 p-4 bg-white">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-green-100 rounded flex items-center justify-center">
                      <span className="text-green-700 font-bold">LOGO</span>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold">Gubalafto Consulting Architects & Engineers P.L.C</h2>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">Document No: GCAE/COF/002</div>
                    <div className="text-sm">Issue No: 1</div>
                    <div className="text-sm">Page: 1 of 2</div>
                  </div>
                </div>
                
                <div className="bg-gray-100 p-2 text-center">
                  <h3 className="font-bold">Site Handover Form</h3>
                  <div className="text-sm">(HANDOVER OF THE WORK SITE FOR CONSTRUCTION)</div>
                </div>
                
                <div className="mt-4 space-y-3">
                  <div><strong>PROJECT:</strong> {selectedForm.project_name}</div>
                  <div><strong>SITE LOCATION:</strong> {selectedForm.site_location}</div>
                  <div><strong>CLIENT:</strong> {selectedForm.client_name}</div>
                  <div><strong>CONTRACTOR:</strong> {selectedForm.contractor_name}</div>
                  <div><strong>DATE:</strong> {selectedForm.effective_date}</div>
                </div>
                
                <div className="mt-6">
                  <p>The site for the construction of ________________________________ has been officially handed over to the contractor ________________________________ by the client ________________________________ on this _____ day of ________________. In the presence of the CONSULTANT.</p>
                </div>
                
                <div className="mt-4">
                  <p>The contractor hereby acknowledges the taking over of the work with all its explanation clearly defined in the specification and drawings. The contractor also acknowledges that the commencement date of the work shall be the _____ day of ________________.</p>
                </div>
                
                <div className="mt-6">
                  <p><strong>IN WITNESS THEREOF THIS DOCUMENT HAS BEEN SIGNED BY ALL PRESENT IN FOUR COPIES ONE OF WHICH FOR THE CLIENT, ONE FOR THE CONTRACTOR, TWO FOR THE CONSULTANT.</strong></p>
                </div>
                
                <div className="mt-8 grid grid-cols-2 gap-8">
                  <div className="text-center">
                    <div className="border-b border-gray-400 pb-2 mb-4">
                      <strong>FOR THE CLIENT</strong>
                    </div>
                    {selectedForm.client_signature && (
                      <img src={selectedForm.client_signature} alt="Client Signature" className="max-h-16 mx-auto mb-2" />
                    )}
                    <div className="border-b border-gray-300 mb-1"></div>
                  </div>
                  <div className="text-center">
                    <div className="border-b border-gray-400 pb-2 mb-4">
                      <strong>FOR THE CONTRACTOR</strong>
                    </div>
                    {selectedForm.contractor_signature && (
                      <img src={selectedForm.contractor_signature} alt="Contractor Signature" className="max-h-16 mx-auto mb-2" />
                    )}
                    <div className="border-b border-gray-300 mb-1"></div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <div className="text-center border-b border-gray-400 pb-2 mb-4">
                    <strong>WITNESSES</strong>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>Name</div>
                    <div>Representing</div>
                    <div>Signature</div>
                  </div>
                  <div className="space-y-2 mt-2">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="border-b border-gray-300">1 ________________</div>
                      <div className="border-b border-gray-300">________________</div>
                      <div className="border-b border-gray-300">________________</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="border-b border-gray-300">2 ________________</div>
                      <div className="border-b border-gray-300">________________</div>
                      <div className="border-b border-gray-300">________________</div>
                    </div>
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
                  selectedForm.status === 'pending_signatures' ? 'bg-yellow-100 text-yellow-800' :
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

            {/* Form Content */}
            <div className="mb-6">
              {renderFormContent()}
            </div>

            {/* Signature Actions */}
            <div className="border-t pt-6">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  {!selectedForm.client_signature && (
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
                  {!selectedForm.contractor_signature && (
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
      case 'pending_signatures': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
          <h2 className="text-2xl font-bold text-gray-900">Contractual Management</h2>
          <p className="text-gray-600">Manage contracts and form templates</p>
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
            <button
              onClick={() => setShowNewContractModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Contract
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('contracts')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'contracts'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Contracts
          </button>
          <button
            onClick={() => setActiveTab('forms')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'forms'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Contract Forms
          </button>
        </nav>
      </div>

      {/* Contract Forms Tab */}
      {activeTab === 'forms' && (
        <div className="space-y-4">
          {contractForms.map((form) => (
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
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(form.status)}`}>
                    {form.status.replace('_', ' ').charAt(0).toUpperCase() + form.status.replace('_', ' ').slice(1)}
                  </span>
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
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Existing contracts content for contracts tab */}
      {activeTab === 'contracts' && (
        <div className="text-center py-12 text-gray-500">
          Standard contracts will be displayed here
        </div>
      )}

      {/* Modals */}
      {showNewFormModal && <CreateFormModal />}
      {showFormDetailsModal && <FormDetailsModal />}
      {showSigningModal && <SigningModal />}
    </div>
  );
};

export default ContractualManagementModule;
