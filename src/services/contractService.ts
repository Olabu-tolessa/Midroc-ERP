import { supabase, isSupabaseConfigured } from '../lib/supabase';

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

// Contract operations
export const contractService = {
  async getContracts(): Promise<Contract[]> {
    if (!isSupabaseConfigured) {
      return []; // Return empty array if Supabase not configured
    }

    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching contracts:', error);
      throw error;
    }

    return data || [];
  },

  async createContract(contract: Omit<Contract, 'id' | 'created_at' | 'updated_at'>): Promise<Contract> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('contracts')
      .insert(contract)
      .select()
      .single();

    if (error) {
      console.error('Error creating contract:', error);
      throw error;
    }

    return data;
  },

  async updateContract(id: string, updates: Partial<Contract>): Promise<Contract> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('contracts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating contract:', error);
      throw error;
    }

    return data;
  },

  async deleteContract(id: string): Promise<void> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured');
    }

    const { error } = await supabase
      .from('contracts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting contract:', error);
      throw error;
    }
  }
};

// Contract Form operations
export const contractFormService = {
  async getContractForms(): Promise<ContractForm[]> {
    if (!isSupabaseConfigured) {
      return []; // Return empty array if Supabase not configured
    }

    const { data, error } = await supabase
      .from('contract_forms')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching contract forms:', error);
      throw error;
    }

    return data || [];
  },

  async createContractForm(form: Omit<ContractForm, 'id' | 'created_at' | 'updated_at'>): Promise<ContractForm> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('contract_forms')
      .insert(form)
      .select()
      .single();

    if (error) {
      console.error('Error creating contract form:', error);
      throw error;
    }

    return data;
  },

  async updateContractForm(id: string, updates: Partial<ContractForm>): Promise<ContractForm> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('contract_forms')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating contract form:', error);
      throw error;
    }

    return data;
  },

  async deleteContractForm(id: string): Promise<void> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured');
    }

    const { error } = await supabase
      .from('contract_forms')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting contract form:', error);
      throw error;
    }
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

    // Update status if both signatures are present
    const currentForm = await this.getContractFormById(id);
    if (currentForm) {
      const hasClientSig = signature.type === 'client' || currentForm.client_signature;
      const hasContractorSig = signature.type === 'contractor' || currentForm.contractor_signature;
      
      if (hasClientSig && hasContractorSig) {
        updates.status = 'signed';
      } else {
        updates.status = 'partially_signed';
      }
    }

    return this.updateContractForm(id, updates);
  },

  async getContractFormById(id: string): Promise<ContractForm | null> {
    if (!isSupabaseConfigured) {
      return null;
    }

    const { data, error } = await supabase
      .from('contract_forms')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching contract form:', error);
      return null;
    }

    return data;
  }
};

// Real-time subscriptions
export const subscribeToContracts = (callback: (contracts: Contract[]) => void) => {
  if (!isSupabaseConfigured) return () => {};

  const subscription = supabase
    .channel('contracts-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'contracts',
      },
      () => {
        // Refetch contracts when changes occur
        contractService.getContracts().then(callback);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
};

export const subscribeToContractForms = (callback: (forms: ContractForm[]) => void) => {
  if (!isSupabaseConfigured) return () => {};

  const subscription = supabase
    .channel('contract-forms-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'contract_forms',
      },
      () => {
        // Refetch contract forms when changes occur
        contractFormService.getContractForms().then(callback);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
};
