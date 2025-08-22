-- MIDROC ERP Database Schema
-- This file contains all the SQL commands to set up the complete database structure

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =============================================================================
-- USERS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'employee' CHECK (role IN ('admin', 'general_manager', 'project_manager', 'engineer', 'consultant', 'client', 'contractor', 'employee')),
    department TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'rejected', 'inactive')),
    phone TEXT,
    address TEXT,
    hire_date DATE,
    salary DECIMAL(12,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- PROJECTS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed', 'on-hold', 'cancelled')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    budget DECIMAL(15,2) NOT NULL,
    actual_cost DECIMAL(15,2) DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    actual_end_date DATE,
    manager_id UUID REFERENCES users(id),
    client_id UUID REFERENCES users(id),
    location TEXT,
    project_type TEXT DEFAULT 'construction' CHECK (project_type IN ('construction', 'consulting', 'supervision', 'design')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT end_date_after_start_date CHECK (end_date > start_date)
);

CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON projects 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- PROJECT TEAM MEMBERS
-- =============================================================================
CREATE TABLE IF NOT EXISTS project_team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    role TEXT NOT NULL,
    assigned_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

-- =============================================================================
-- PROJECT MILESTONES
-- =============================================================================
CREATE TABLE IF NOT EXISTS project_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    target_date DATE NOT NULL,
    actual_date DATE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'delayed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_project_milestones_updated_at 
    BEFORE UPDATE ON project_milestones 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- PROJECT DESIGNS AND FILES
-- =============================================================================
CREATE TABLE IF NOT EXISTS project_designs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER,
    uploaded_by UUID REFERENCES users(id),
    version INTEGER DEFAULT 1,
    is_latest BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- SUPERVISION REPORTS
-- =============================================================================
CREATE TABLE IF NOT EXISTS supervision_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    supervisor_id UUID REFERENCES users(id),
    report_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'good' CHECK (status IN ('good', 'warning', 'critical')),
    quality_score INTEGER CHECK (quality_score >= 0 AND quality_score <= 100),
    safety_score INTEGER CHECK (safety_score >= 0 AND safety_score <= 100),
    progress_notes TEXT,
    issues TEXT,
    recommendations TEXT,
    weather_conditions TEXT,
    crew_count INTEGER DEFAULT 0,
    equipment_status TEXT,
    material_status TEXT,
    photos JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_supervision_reports_updated_at 
    BEFORE UPDATE ON supervision_reports 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- CONSULTING CONTRACTS
-- =============================================================================
CREATE TABLE IF NOT EXISTS consulting_contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES users(id),
    consultant_id UUID REFERENCES users(id),
    project_id UUID REFERENCES projects(id),
    contract_number TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    contract_value DECIMAL(15,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'completed', 'cancelled', 'on_hold')),
    payment_terms TEXT,
    deliverables TEXT,
    hours_logged DECIMAL(8,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_consulting_contracts_updated_at 
    BEFORE UPDATE ON consulting_contracts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- FINANCIAL TRANSACTIONS
-- =============================================================================
CREATE TABLE IF NOT EXISTS financial_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id),
    contract_id UUID REFERENCES consulting_contracts(id),
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('income', 'expense', 'budget_allocation')),
    category TEXT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    description TEXT,
    transaction_date DATE DEFAULT CURRENT_DATE,
    status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled')),
    reference_number TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- HR RECORDS
-- =============================================================================
CREATE TABLE IF NOT EXISTS hr_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    record_type TEXT NOT NULL CHECK (record_type IN ('training', 'performance_review', 'disciplinary', 'promotion', 'certification')),
    title TEXT NOT NULL,
    description TEXT,
    date_recorded DATE DEFAULT CURRENT_DATE,
    expiry_date DATE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked')),
    score INTEGER CHECK (score >= 0 AND score <= 100),
    notes TEXT,
    attachments JSONB DEFAULT '[]',
    recorded_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- SAFETY INCIDENTS
-- =============================================================================
CREATE TABLE IF NOT EXISTS safety_incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id),
    reported_by UUID REFERENCES users(id),
    incident_date TIMESTAMP WITH TIME ZONE NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('minor', 'moderate', 'major', 'critical')),
    incident_type TEXT NOT NULL,
    location TEXT,
    description TEXT NOT NULL,
    injured_parties TEXT,
    immediate_action TEXT,
    investigation_notes TEXT,
    corrective_actions TEXT,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_safety_incidents_updated_at 
    BEFORE UPDATE ON safety_incidents 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- QUALITY AUDITS
-- =============================================================================
CREATE TABLE IF NOT EXISTS quality_audits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id),
    auditor_id UUID REFERENCES users(id),
    audit_date DATE NOT NULL DEFAULT CURRENT_DATE,
    audit_type TEXT NOT NULL CHECK (audit_type IN ('internal', 'external', 'regulatory')),
    standards TEXT, -- ISO standards, building codes, etc.
    overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
    findings TEXT,
    non_conformities TEXT,
    recommendations TEXT,
    corrective_actions TEXT,
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('planned', 'in_progress', 'completed', 'follow_up_required')),
    next_audit_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_quality_audits_updated_at 
    BEFORE UPDATE ON quality_audits 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- CRM CLIENTS
-- =============================================================================
CREATE TABLE IF NOT EXISTS crm_clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    company_name TEXT NOT NULL,
    industry TEXT,
    company_size TEXT CHECK (company_size IN ('startup', 'small', 'medium', 'large', 'enterprise')),
    website TEXT,
    primary_contact_name TEXT,
    primary_contact_email TEXT,
    primary_contact_phone TEXT,
    billing_address TEXT,
    shipping_address TEXT,
    tax_id TEXT,
    credit_limit DECIMAL(15,2),
    payment_terms INTEGER DEFAULT 30,
    status TEXT DEFAULT 'active' CHECK (status IN ('prospect', 'active', 'inactive', 'blacklisted')),
    lead_source TEXT,
    assigned_manager UUID REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_crm_clients_updated_at 
    BEFORE UPDATE ON crm_clients 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- SYSTEM NOTIFICATIONS
-- =============================================================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'error', 'success')),
    related_entity_type TEXT, -- 'project', 'user', 'contract', etc.
    related_entity_id UUID,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- User indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- Project indexes
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_manager_id ON projects(manager_id);
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_start_date ON projects(start_date);
CREATE INDEX IF NOT EXISTS idx_projects_end_date ON projects(end_date);

-- Project team indexes
CREATE INDEX IF NOT EXISTS idx_project_team_project_id ON project_team_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_team_user_id ON project_team_members(user_id);

-- Supervision report indexes
CREATE INDEX IF NOT EXISTS idx_supervision_reports_project_id ON supervision_reports(project_id);
CREATE INDEX IF NOT EXISTS idx_supervision_reports_supervisor_id ON supervision_reports(supervisor_id);
CREATE INDEX IF NOT EXISTS idx_supervision_reports_date ON supervision_reports(report_date);

-- Consulting contract indexes
CREATE INDEX IF NOT EXISTS idx_consulting_contracts_client_id ON consulting_contracts(client_id);
CREATE INDEX IF NOT EXISTS idx_consulting_contracts_consultant_id ON consulting_contracts(consultant_id);
CREATE INDEX IF NOT EXISTS idx_consulting_contracts_status ON consulting_contracts(status);

-- Financial transaction indexes
CREATE INDEX IF NOT EXISTS idx_financial_transactions_project_id ON financial_transactions(project_id);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_date ON financial_transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_type ON financial_transactions(transaction_type);

-- Notification indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE supervision_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE consulting_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- SAMPLE DATA INSERT (for testing)
-- =============================================================================

-- Insert sample admin user
INSERT INTO users (id, email, name, role, department, status) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'admin@midroc.com', 'John Anderson', 'admin', 'Administration', 'active')
ON CONFLICT (email) DO NOTHING;

-- Insert sample project manager
INSERT INTO users (id, email, name, role, department, status) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'pm@midroc.com', 'Michael Rodriguez', 'project_manager', 'Construction Management', 'active')
ON CONFLICT (email) DO NOTHING;

-- Insert sample client
INSERT INTO users (id, email, name, role, department, status) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'client@midroc.com', 'Department of Transportation', 'client', 'Government', 'active')
ON CONFLICT (email) DO NOTHING;

-- Insert sample project
INSERT INTO projects (id, name, description, status, priority, progress, budget, start_date, end_date, manager_id, client_id) VALUES
('650e8400-e29b-41d4-a716-446655440000', 'Highway Construction Phase 1', 'Major highway construction project connecting city centers', 'active', 'high', 65, 2500000.00, '2024-01-15', '2024-12-15', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002')
ON CONFLICT (id) DO NOTHING;
