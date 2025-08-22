-- Create contract_forms table for storing contract form data with templates and signatures
CREATE TABLE IF NOT EXISTS contract_forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    template_type TEXT NOT NULL,
    client_name TEXT NOT NULL,
    contractor_name TEXT,
    project_name TEXT,
    site_location TEXT,
    effective_date DATE,
    form_data JSONB NOT NULL DEFAULT '{}',
    client_signature TEXT, -- Base64 signature data
    contractor_signature TEXT, -- Base64 signature data
    client_signed_at TIMESTAMPTZ,
    contractor_signed_at TIMESTAMPTZ,
    client_assigned_to TEXT,
    contractor_assigned_to TEXT,
    client_user_name TEXT,
    contractor_user_name TEXT,
    status TEXT NOT NULL DEFAULT 'draft',
    created_by TEXT NOT NULL,
    created_by_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create contracts table for contract records
CREATE TABLE IF NOT EXISTS contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    client_name TEXT NOT NULL,
    contract_type TEXT NOT NULL,
    value DECIMAL(15,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    approval_status TEXT NOT NULL DEFAULT 'pending',
    compliance_checks JSONB NOT NULL DEFAULT '{}',
    milestones JSONB NOT NULL DEFAULT '[]',
    created_by TEXT NOT NULL,
    created_by_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create quality_safety_reports table for supervision quality audits
CREATE TABLE IF NOT EXISTS quality_safety_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id TEXT NOT NULL,
    project_title TEXT NOT NULL,
    inspector_id TEXT NOT NULL,
    inspector_name TEXT NOT NULL,
    inspection_date DATE NOT NULL,
    inspection_type TEXT NOT NULL,
    document_number TEXT NOT NULL,
    page_info JSONB NOT NULL DEFAULT '{}',
    checklist_items JSONB NOT NULL DEFAULT '[]',
    checked_by TEXT,
    checked_by_signature TEXT,
    checked_by_date TIMESTAMPTZ,
    approved_by TEXT,
    approved_by_signature TEXT,
    approved_by_date TIMESTAMPTZ,
    assigned_to TEXT,
    assigned_to_name TEXT,
    status TEXT NOT NULL DEFAULT 'in_progress',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create quality_tasks table for quality audit tasks
CREATE TABLE IF NOT EXISTS quality_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,
    category TEXT NOT NULL,
    assigned_to TEXT,
    assigned_to_name TEXT,
    project_id TEXT,
    project_name TEXT,
    checkpoints JSONB NOT NULL DEFAULT '[]',
    created_by TEXT NOT NULL,
    created_by_name TEXT NOT NULL,
    due_date DATE,
    status TEXT NOT NULL DEFAULT 'pending',
    priority TEXT NOT NULL DEFAULT 'medium',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_contract_forms_updated_at 
    BEFORE UPDATE ON contract_forms 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contracts_updated_at 
    BEFORE UPDATE ON contracts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quality_safety_reports_updated_at 
    BEFORE UPDATE ON quality_safety_reports 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quality_tasks_updated_at 
    BEFORE UPDATE ON quality_tasks 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contract_forms_status ON contract_forms(status);
CREATE INDEX IF NOT EXISTS idx_contract_forms_created_by ON contract_forms(created_by);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);
CREATE INDEX IF NOT EXISTS idx_quality_safety_reports_project_id ON quality_safety_reports(project_id);
CREATE INDEX IF NOT EXISTS idx_quality_safety_reports_status ON quality_safety_reports(status);
CREATE INDEX IF NOT EXISTS idx_quality_tasks_assigned_to ON quality_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_quality_tasks_status ON quality_tasks(status);
