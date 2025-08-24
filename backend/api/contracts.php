<?php
require_once '../config/database.php';
require_once '../config/cors.php';

setCorsHeaders();
setJsonHeaders();

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];
$request_uri = $_SERVER['REQUEST_URI'];

// Parse the path to get the endpoint
$path = parse_url($request_uri, PHP_URL_PATH);
$path_parts = explode('/', trim($path, '/'));

// Get the resource type (contracts or contract_forms)
$resource = isset($path_parts[2]) ? $path_parts[2] : '';
$id = isset($path_parts[3]) ? $path_parts[3] : null;

try {
    switch ($resource) {
        case 'contracts':
            handleContracts($db, $method, $id);
            break;
        case 'contract_forms':
            handleContractForms($db, $method, $id);
            break;
        default:
            sendErrorResponse('Invalid endpoint', 404);
    }
} catch (Exception $e) {
    sendErrorResponse('Internal server error: ' . $e->getMessage(), 500);
}

function handleContracts($db, $method, $id) {
    switch ($method) {
        case 'GET':
            if ($id) {
                getContract($db, $id);
            } else {
                getContracts($db);
            }
            break;
        case 'POST':
            createContract($db);
            break;
        case 'PUT':
            updateContract($db, $id);
            break;
        case 'DELETE':
            deleteContract($db, $id);
            break;
        default:
            sendErrorResponse('Method not allowed', 405);
    }
}

function handleContractForms($db, $method, $id) {
    switch ($method) {
        case 'GET':
            if ($id) {
                getContractForm($db, $id);
            } else {
                getContractForms($db);
            }
            break;
        case 'POST':
            createContractForm($db);
            break;
        case 'PUT':
            updateContractForm($db, $id);
            break;
        case 'DELETE':
            deleteContractForm($db, $id);
            break;
        default:
            sendErrorResponse('Method not allowed', 405);
    }
}

// Contract CRUD operations
function getContracts($db) {
    $query = "SELECT * FROM contracts ORDER BY created_at DESC";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $contracts = $stmt->fetchAll();
    
    // Parse JSON fields
    foreach ($contracts as &$contract) {
        $contract['compliance_checks'] = json_decode($contract['compliance_checks'], true);
        $contract['milestones'] = json_decode($contract['milestones'], true);
    }
    
    sendSuccessResponse($contracts);
}

function getContract($db, $id) {
    $query = "SELECT * FROM contracts WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $contract = $stmt->fetch();
    
    if (!$contract) {
        sendErrorResponse('Contract not found', 404);
    }
    
    $contract['compliance_checks'] = json_decode($contract['compliance_checks'], true);
    $contract['milestones'] = json_decode($contract['milestones'], true);
    
    sendSuccessResponse($contract);
}

function createContract($db) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $query = "INSERT INTO contracts (title, client_name, contract_type, value, start_date, end_date, status, approval_status, compliance_checks, milestones, created_by, created_by_name) VALUES (:title, :client_name, :contract_type, :value, :start_date, :end_date, :status, :approval_status, :compliance_checks, :milestones, :created_by, :created_by_name)";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':title', $data['title']);
    $stmt->bindParam(':client_name', $data['client_name']);
    $stmt->bindParam(':contract_type', $data['contract_type']);
    $stmt->bindParam(':value', $data['value']);
    $stmt->bindParam(':start_date', $data['start_date']);
    $stmt->bindParam(':end_date', $data['end_date']);
    $stmt->bindParam(':status', $data['status']);
    $stmt->bindParam(':approval_status', $data['approval_status']);
    $stmt->bindParam(':compliance_checks', json_encode($data['compliance_checks']));
    $stmt->bindParam(':milestones', json_encode($data['milestones']));
    $stmt->bindParam(':created_by', $data['created_by']);
    $stmt->bindParam(':created_by_name', $data['created_by_name']);
    
    if ($stmt->execute()) {
        $data['id'] = $db->lastInsertId();
        sendSuccessResponse($data, 'Contract created successfully');
    } else {
        sendErrorResponse('Failed to create contract');
    }
}

function updateContract($db, $id) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $query = "UPDATE contracts SET title = :title, client_name = :client_name, contract_type = :contract_type, value = :value, start_date = :start_date, end_date = :end_date, status = :status, approval_status = :approval_status, compliance_checks = :compliance_checks, milestones = :milestones WHERE id = :id";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':title', $data['title']);
    $stmt->bindParam(':client_name', $data['client_name']);
    $stmt->bindParam(':contract_type', $data['contract_type']);
    $stmt->bindParam(':value', $data['value']);
    $stmt->bindParam(':start_date', $data['start_date']);
    $stmt->bindParam(':end_date', $data['end_date']);
    $stmt->bindParam(':status', $data['status']);
    $stmt->bindParam(':approval_status', $data['approval_status']);
    $stmt->bindParam(':compliance_checks', json_encode($data['compliance_checks']));
    $stmt->bindParam(':milestones', json_encode($data['milestones']));
    
    if ($stmt->execute()) {
        sendSuccessResponse($data, 'Contract updated successfully');
    } else {
        sendErrorResponse('Failed to update contract');
    }
}

function deleteContract($db, $id) {
    $query = "DELETE FROM contracts WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    
    if ($stmt->execute()) {
        sendSuccessResponse(null, 'Contract deleted successfully');
    } else {
        sendErrorResponse('Failed to delete contract');
    }
}

// Contract Form CRUD operations
function getContractForms($db) {
    $query = "SELECT * FROM contract_forms ORDER BY created_at DESC";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $forms = $stmt->fetchAll();
    
    // Parse JSON fields
    foreach ($forms as &$form) {
        $form['form_data'] = json_decode($form['form_data'], true);
    }
    
    sendSuccessResponse($forms);
}

function getContractForm($db, $id) {
    $query = "SELECT * FROM contract_forms WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $form = $stmt->fetch();
    
    if (!$form) {
        sendErrorResponse('Contract form not found', 404);
    }
    
    $form['form_data'] = json_decode($form['form_data'], true);
    
    sendSuccessResponse($form);
}

function createContractForm($db) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $query = "INSERT INTO contract_forms (title, template_type, client_name, contractor_name, project_name, site_location, effective_date, form_data, status, created_by, created_by_name) VALUES (:title, :template_type, :client_name, :contractor_name, :project_name, :site_location, :effective_date, :form_data, :status, :created_by, :created_by_name)";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':title', $data['title']);
    $stmt->bindParam(':template_type', $data['template_type']);
    $stmt->bindParam(':client_name', $data['client_name']);
    $stmt->bindParam(':contractor_name', $data['contractor_name']);
    $stmt->bindParam(':project_name', $data['project_name']);
    $stmt->bindParam(':site_location', $data['site_location']);
    $stmt->bindParam(':effective_date', $data['effective_date']);
    $stmt->bindParam(':form_data', json_encode($data['form_data']));
    $stmt->bindParam(':status', $data['status']);
    $stmt->bindParam(':created_by', $data['created_by']);
    $stmt->bindParam(':created_by_name', $data['created_by_name']);
    
    if ($stmt->execute()) {
        $data['id'] = $db->lastInsertId();
        sendSuccessResponse($data, 'Contract form created successfully');
    } else {
        sendErrorResponse('Failed to create contract form');
    }
}

function updateContractForm($db, $id) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $setParts = [];
    $params = [':id' => $id];
    
    // Build dynamic update query based on provided fields
    $allowedFields = ['title', 'template_type', 'client_name', 'contractor_name', 'project_name', 'site_location', 'effective_date', 'form_data', 'client_signature', 'contractor_signature', 'client_signed_at', 'contractor_signed_at', 'client_assigned_to', 'contractor_assigned_to', 'client_user_name', 'contractor_user_name', 'status'];
    
    foreach ($allowedFields as $field) {
        if (isset($data[$field])) {
            $setParts[] = "$field = :$field";
            if ($field === 'form_data') {
                $params[":$field"] = json_encode($data[$field]);
            } else {
                $params[":$field"] = $data[$field];
            }
        }
    }
    
    if (empty($setParts)) {
        sendErrorResponse('No valid fields to update');
    }
    
    $query = "UPDATE contract_forms SET " . implode(', ', $setParts) . " WHERE id = :id";
    $stmt = $db->prepare($query);
    
    if ($stmt->execute($params)) {
        sendSuccessResponse($data, 'Contract form updated successfully');
    } else {
        sendErrorResponse('Failed to update contract form');
    }
}

function deleteContractForm($db, $id) {
    $query = "DELETE FROM contract_forms WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    
    if ($stmt->execute()) {
        sendSuccessResponse(null, 'Contract form deleted successfully');
    } else {
        sendErrorResponse('Failed to delete contract form');
    }
}
?>
