-- ================================================
-- MIDROC ERP Database Setup for MySQL/XAMPP
-- Database: midroc
-- ================================================

-- Create database
CREATE DATABASE IF NOT EXISTS `midroc` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `midroc`;

-- ================================================
-- Table: users
-- ================================================
CREATE TABLE `users` (
  `id` varchar(36) NOT NULL DEFAULT (UUID()),
  `email` varchar(255) NOT NULL UNIQUE,
  `name` varchar(255) NOT NULL,
  `role` enum('admin','general_manager','project_manager','consultant','engineer','client','contractor','employee') NOT NULL,
  `department` varchar(100) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_users_email` (`email`),
  KEY `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Table: projects
-- ================================================
CREATE TABLE `projects` (
  `id` varchar(36) NOT NULL DEFAULT (UUID()),
  `title` varchar(255) NOT NULL,
  `description` text,
  `status` enum('draft','active','on_hold','completed','cancelled') NOT NULL DEFAULT 'draft',
  `priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `budget` decimal(15,2) NOT NULL DEFAULT 0.00,
  `progress` int NOT NULL DEFAULT 0 CHECK (`progress` >= 0 AND `progress` <= 100),
  `manager_id` varchar(36) NOT NULL,
  `client_id` varchar(36) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_projects_status` (`status`),
  KEY `idx_projects_manager` (`manager_id`),
  KEY `idx_projects_client` (`client_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Table: contracts
-- ================================================
CREATE TABLE `contracts` (
  `id` varchar(36) NOT NULL DEFAULT (UUID()),
  `title` varchar(255) NOT NULL,
  `client_name` varchar(255) NOT NULL,
  `contract_type` enum('construction','consulting','maintenance','supply') NOT NULL,
  `value` decimal(15,2) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` enum('draft','active','pending_approval','completed','terminated') NOT NULL DEFAULT 'draft',
  `approval_status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `compliance_checks` json DEFAULT NULL,
  `milestones` json DEFAULT NULL,
  `created_by` varchar(36) NOT NULL,
  `created_by_name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_contracts_status` (`status`),
  KEY `idx_contracts_type` (`contract_type`),
  KEY `idx_contracts_created_by` (`created_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Table: contract_forms
-- ================================================
CREATE TABLE `contract_forms` (
  `id` varchar(36) NOT NULL DEFAULT (UUID()),
  `title` varchar(255) NOT NULL,
  `template_type` enum('document_acquisition','site_handover_inspection','site_handover') NOT NULL,
  `client_name` varchar(255) NOT NULL,
  `contractor_name` varchar(255) DEFAULT NULL,
  `project_name` varchar(255) DEFAULT NULL,
  `site_location` varchar(500) DEFAULT NULL,
  `effective_date` date DEFAULT NULL,
  `form_data` json DEFAULT NULL,
  `client_signature` text DEFAULT NULL,
  `contractor_signature` text DEFAULT NULL,
  `client_signed_at` timestamp NULL DEFAULT NULL,
  `contractor_signed_at` timestamp NULL DEFAULT NULL,
  `client_assigned_to` varchar(36) DEFAULT NULL,
  `contractor_assigned_to` varchar(36) DEFAULT NULL,
  `client_user_name` varchar(255) DEFAULT NULL,
  `contractor_user_name` varchar(255) DEFAULT NULL,
  `status` enum('draft','assigned','pending_signatures','client_signed','signed','completed') NOT NULL DEFAULT 'draft',
  `created_by` varchar(36) NOT NULL,
  `created_by_name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_contract_forms_status` (`status`),
  KEY `idx_contract_forms_template` (`template_type`),
  KEY `idx_contract_forms_created_by` (`created_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Table: supervision_reports
-- ================================================
CREATE TABLE `supervision_reports` (
  `id` varchar(36) NOT NULL DEFAULT (UUID()),
  `project_id` varchar(36) NOT NULL,
  `supervisor_id` varchar(36) NOT NULL,
  `report_date` date NOT NULL,
  `status` enum('good','issues','critical') NOT NULL,
  `issues` text DEFAULT NULL,
  `recommendations` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_supervision_reports_project` (`project_id`),
  KEY `idx_supervision_reports_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Table: quality_safety_reports
-- ================================================
CREATE TABLE `quality_safety_reports` (
  `id` varchar(36) NOT NULL DEFAULT (UUID()),
  `project_id` varchar(36) NOT NULL,
  `project_title` varchar(255) NOT NULL,
  `inspector_id` varchar(36) NOT NULL,
  `inspector_name` varchar(255) NOT NULL,
  `inspection_date` date NOT NULL,
  `inspection_type` enum('structural_design','quality','safety','combined') NOT NULL,
  `document_number` varchar(100) NOT NULL,
  `page_info` json DEFAULT NULL,
  `checklist_items` json DEFAULT NULL,
  `checked_by` varchar(36) DEFAULT NULL,
  `checked_by_signature` text DEFAULT NULL,
  `checked_by_date` timestamp NULL DEFAULT NULL,
  `approved_by` varchar(36) DEFAULT NULL,
  `approved_by_signature` text DEFAULT NULL,
  `approved_by_date` timestamp NULL DEFAULT NULL,
  `assigned_to` varchar(36) DEFAULT NULL,
  `assigned_to_name` varchar(255) DEFAULT NULL,
  `status` enum('draft','in_progress','reviewed','approved','rejected') NOT NULL DEFAULT 'draft',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_quality_safety_reports_project` (`project_id`),
  KEY `idx_quality_safety_reports_status` (`status`),
  KEY `idx_quality_safety_reports_inspector` (`inspector_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Table: quality_tasks
-- ================================================
CREATE TABLE `quality_tasks` (
  `id` varchar(36) NOT NULL DEFAULT (UUID()),
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `type` enum('checklist','inspection','audit','review') NOT NULL,
  `category` varchar(100) NOT NULL,
  `assigned_to` varchar(36) DEFAULT NULL,
  `assigned_to_name` varchar(255) DEFAULT NULL,
  `project_id` varchar(36) DEFAULT NULL,
  `project_name` varchar(255) DEFAULT NULL,
  `checkpoints` json DEFAULT NULL,
  `created_by` varchar(36) NOT NULL,
  `created_by_name` varchar(255) NOT NULL,
  `due_date` date DEFAULT NULL,
  `status` enum('pending','in_progress','completed','cancelled') NOT NULL DEFAULT 'pending',
  `priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_quality_tasks_status` (`status`),
  KEY `idx_quality_tasks_assigned` (`assigned_to`),
  KEY `idx_quality_tasks_project` (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Table: project_designs
-- ================================================
CREATE TABLE `project_designs` (
  `id` varchar(36) NOT NULL DEFAULT (UUID()),
  `project_id` varchar(36) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_url` varchar(500) NOT NULL,
  `file_type` varchar(50) NOT NULL,
  `uploaded_by` varchar(36) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_project_designs_project` (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Table: consulting_contracts
-- ================================================
CREATE TABLE `consulting_contracts` (
  `id` varchar(36) NOT NULL DEFAULT (UUID()),
  `client_id` varchar(36) NOT NULL,
  `consultant_id` varchar(36) NOT NULL,
  `contract_value` decimal(15,2) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` enum('draft','active','completed','terminated') NOT NULL DEFAULT 'draft',
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_consulting_contracts_client` (`client_id`),
  KEY `idx_consulting_contracts_consultant` (`consultant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Insert Default Users
-- ================================================
INSERT INTO `users` (`id`, `email`, `name`, `role`, `department`, `password_hash`) VALUES
('1', 'admin@midroc.com', 'John Anderson', 'admin', 'Administration', '$2b$10$defaulthash'),
('2', 'gm@midroc.com', 'Sarah Mitchell', 'general_manager', 'Management', '$2b$10$defaulthash'),
('3', 'pm@midroc.com', 'Michael Rodriguez', 'project_manager', 'Projects', '$2b$10$defaulthash'),
('4', 'consultant@midroc.com', 'Emma Thompson', 'consultant', 'Consulting', '$2b$10$defaulthash'),
('5', 'engineer@midroc.com', 'David Chen', 'engineer', 'Engineering', '$2b$10$defaulthash'),
('6', 'employee@midroc.com', 'Lisa Johnson', 'employee', 'General', '$2b$10$defaulthash'),
('7', 'client@midroc.com', 'Ahmed Hassan', 'client', 'External', '$2b$10$defaulthash'),
('8', 'contractor@midroc.com', 'Mohamed Ali', 'contractor', 'External', '$2b$10$defaulthash');

-- ================================================
-- Insert Sample Projects
-- ================================================
INSERT INTO `projects` (`id`, `title`, `description`, `status`, `priority`, `start_date`, `end_date`, `budget`, `progress`, `manager_id`, `client_id`) VALUES
('p1', 'Highway Construction Phase 1', 'Major highway construction project connecting Addis Ababa to Adama', 'active', 'high', '2024-01-15', '2024-12-31', 5500000.00, 35, '3', '7'),
('p2', 'Urban Development Project', 'Mixed-use development in central Addis Ababa', 'active', 'medium', '2024-02-01', '2024-11-30', 3200000.00, 20, '3', '7'),
('p3', 'Bridge Construction', 'New bridge construction over Blue Nile River', 'on_hold', 'high', '2024-03-01', '2025-02-28', 8900000.00, 15, '3', '7');

-- ================================================
-- Insert Sample Contract Forms
-- ================================================
INSERT INTO `contract_forms` (`id`, `title`, `template_type`, `client_name`, `contractor_name`, `project_name`, `site_location`, `effective_date`, `status`, `created_by`, `created_by_name`) VALUES
('f1', 'Highway Project - Document Acquisition', 'document_acquisition', 'Ministry of Transport', 'Midroc Construction', 'Highway Construction Phase 1', 'Addis Ababa - Adama Highway', '2024-01-15', 'assigned', '1', 'John Anderson'),
('f2', 'Urban Development - Site Handover', 'site_handover', 'Addis Ababa City Administration', 'Midroc Construction', 'Urban Development Project', 'Central Addis Ababa', '2024-02-01', 'draft', '1', 'John Anderson');

-- ================================================
-- Insert Sample Supervision Reports
-- ================================================
INSERT INTO `supervision_reports` (`id`, `project_id`, `supervisor_id`, `report_date`, `status`, `issues`, `recommendations`) VALUES
('sr1', 'p1', '2', '2024-01-15', 'good', 'No major issues reported', 'Continue with current approach'),
('sr2', 'p2', '3', '2024-01-14', 'issues', 'Material delivery delays affecting timeline', 'Contact suppliers for expedited delivery'),
('sr3', 'p3', '2', '2024-01-13', 'critical', 'Safety concerns identified in foundation work', 'Immediate inspection required, halt work until resolved');

-- ================================================
-- Indexes for Performance
-- ================================================
CREATE INDEX idx_projects_dates ON projects(start_date, end_date);
CREATE INDEX idx_contracts_dates ON contracts(start_date, end_date);
CREATE INDEX idx_contract_forms_dates ON contract_forms(effective_date);
CREATE INDEX idx_supervision_reports_date ON supervision_reports(report_date);
CREATE INDEX idx_quality_safety_reports_date ON quality_safety_reports(inspection_date);

-- ================================================
-- Views for Easy Data Access
-- ================================================

-- Active Projects with Manager Info
CREATE VIEW `active_projects_view` AS
SELECT 
    p.id,
    p.title,
    p.description,
    p.status,
    p.priority,
    p.start_date,
    p.end_date,
    p.budget,
    p.progress,
    u_manager.name as manager_name,
    u_client.name as client_name
FROM projects p
LEFT JOIN users u_manager ON p.manager_id = u_manager.id
LEFT JOIN users u_client ON p.client_id = u_client.id
WHERE p.status = 'active';

-- Contract Forms with Status Summary
CREATE VIEW `contract_forms_summary` AS
SELECT 
    template_type,
    status,
    COUNT(*) as count,
    DATE(created_at) as date_created
FROM contract_forms
GROUP BY template_type, status, DATE(created_at);

-- Quality Tasks Summary
CREATE VIEW `quality_tasks_summary` AS
SELECT 
    status,
    priority,
    COUNT(*) as task_count,
    assigned_to_name
FROM quality_tasks
GROUP BY status, priority, assigned_to_name;
