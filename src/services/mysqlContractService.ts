// MySQL API-based contract service
const API_BASE_URL = 'http://localhost/midroc-erp/backend/api';

export interface Contract {
  id: string;
  title: string;
  client_name: string;
  contract_type: string;
  value: number;
  start_date: string;
  end_date: string;
  status: string;
  approval_status: string;
  compliance_checks: {
    legal_review: boolean;
    financial_review: boolean;
    technical_review: boolean;
  };
  milestones: Array<{
    id: string;
    title: string;
    date: string;
    status: string;
  }>;
  created_by: string;
  created_by_name: string;
  created_at: string;
  updated_at: string;
}

export interface ContractForm {
  id: string;
  title: string;
  template_type: string;
  client_name: string;
  contractor_name?: string;
  project_name?: string;
  site_location?: string;
  effective_date?: string;
  form_data: any;
  client_signature?: string;
  contractor_signature?: string;
  client_signed_at?: string;
  contractor_signed_at?: string;
  client_assigned_to?: string;
  contractor_assigned_to?: string;
  client_user_name?: string;
  contractor_user_name?: string;
  status: string;
  created_by: string;
  created_by_name: string;
  created_at: string;
  updated_at: string;
}

// HTTP helper function
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}/${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Contract operations
export const contractService = {
  async getContracts(): Promise<Contract[]> {
    try {
      const response = await apiRequest('contracts');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching contracts:', error);
      return [];
    }
  },

  async createContract(contract: Omit<Contract, 'id' | 'created_at' | 'updated_at'>): Promise<Contract> {
    const response = await apiRequest('contracts', {
      method: 'POST',
      body: JSON.stringify(contract),
    });
    return response.data;
  },

  async updateContract(id: string, updates: Partial<Contract>): Promise<Contract> {
    const response = await apiRequest(`contracts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return response.data;
  },

  async deleteContract(id: string): Promise<void> {
    await apiRequest(`contracts/${id}`, {
      method: 'DELETE',
    });
  }
};

// Contract Form operations
export const contractFormService = {
  async getContractForms(): Promise<ContractForm[]> {
    try {
      const response = await apiRequest('contract_forms');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching contract forms:', error);
      return [];
    }
  },

  async createContractForm(form: Omit<ContractForm, 'id' | 'created_at' | 'updated_at'>): Promise<ContractForm> {
    const response = await apiRequest('contract_forms', {
      method: 'POST',
      body: JSON.stringify(form),
    });
    return response.data;
  },

  async updateContractForm(id: string, updates: Partial<ContractForm>): Promise<ContractForm> {
    const response = await apiRequest(`contract_forms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return response.data;
  },

  async deleteContractForm(id: string): Promise<void> {
    await apiRequest(`contract_forms/${id}`, {
      method: 'DELETE',
    });
  },

  async assignContractForm(id: string, assignments: {
    client_assigned_to?: string;
    client_user_name?: string;
    contractor_assigned_to?: string;
    contractor_user_name?: string;
  }): Promise<ContractForm> {
    return this.updateContractForm(id, assignments);
  },

  async signContractForm(id: string, signature: {
    type: 'client' | 'contractor';
    signature: string;
    signed_at: string;
  }): Promise<ContractForm> {
    const updates: Partial<ContractForm> = {};
    
    if (signature.type === 'client') {
      updates.client_signature = signature.signature;
      updates.client_signed_at = signature.signed_at;
    } else {
      updates.contractor_signature = signature.signature;
      updates.contractor_signed_at = signature.signed_at;
    }

    // Update status based on signature completion
    const currentForm = await this.getContractFormById(id);
    if (currentForm) {
      const hasClientSig = signature.type === 'client' || currentForm.client_signature;
      const hasContractorSig = signature.type === 'contractor' || currentForm.contractor_signature;
      
      if (hasClientSig && hasContractorSig) {
        updates.status = 'signed';
      } else {
        updates.status = 'client_signed';
      }
    }

    return this.updateContractForm(id, updates);
  },

  async getContractFormById(id: string): Promise<ContractForm | null> {
    try {
      const response = await apiRequest(`contract_forms/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching contract form:', error);
      return null;
    }
  }
};

// Real-time updates simulation (WebSocket would be better for production)
export const subscribeToContracts = (callback: (contracts: Contract[]) => void) => {
  const interval = setInterval(async () => {
    try {
      const contracts = await contractService.getContracts();
      callback(contracts);
    } catch (error) {
      console.error('Error in contracts subscription:', error);
    }
  }, 10000); // Poll every 10 seconds

  return () => clearInterval(interval);
};

export const subscribeToContractForms = (callback: (forms: ContractForm[]) => void) => {
  const interval = setInterval(async () => {
    try {
      const forms = await contractFormService.getContractForms();
      callback(forms);
    } catch (error) {
      console.error('Error in contract forms subscription:', error);
    }
  }, 10000); // Poll every 10 seconds

  return () => clearInterval(interval);
};
