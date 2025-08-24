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

// Get the resource type
$resource = isset($path_parts[2]) ? $path_parts[2] : '';
$id = isset($path_parts[3]) ? $path_parts[3] : null;

try {
    switch ($resource) {
        case 'supervision_reports':
            handleSupervisionReports($db, $method, $id);
            break;
        case 'quality_safety_reports':
            handleQualitySafetyReports($db, $method, $id);
            break;
        case 'quality_tasks':
            handleQualityTasks($db, $method, $id);
            break;
        default:
            sendErrorResponse('Invalid endpoint', 404);
    }
} catch (Exception $e) {
    sendErrorResponse('Internal server error: ' . $e->getMessage(), 500);
}

// Supervision Reports
function handleSupervisionReports($db, $method, $id) {
    switch ($method) {
        case 'GET':
            if ($id) {
                getSupervisionReport($db, $id);
            } else {
                getSupervisionReports($db);
            }
            break;
        case 'POST':
            createSupervisionReport($db);
            break;
        case 'PUT':
            updateSupervisionReport($db, $id);
            break;
        case 'DELETE':
            deleteSupervisionReport($db, $id);
            break;
        default:
            sendErrorResponse('Method not allowed', 405);
    }
}

function getSupervisionReports($db) {
    $query = "SELECT * FROM supervision_reports ORDER BY created_at DESC";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $reports = $stmt->fetchAll();
    sendSuccessResponse($reports);
}

function getSupervisionReport($db, $id) {
    $query = "SELECT * FROM supervision_reports WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $report = $stmt->fetch();
    
    if (!$report) {
        sendErrorResponse('Supervision report not found', 404);
    }
    
    sendSuccessResponse($report);
}

function createSupervisionReport($db) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $query = "INSERT INTO supervision_reports (project_id, supervisor_id, report_date, status, issues, recommendations) VALUES (:project_id, :supervisor_id, :report_date, :status, :issues, :recommendations)";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':project_id', $data['project_id']);
    $stmt->bindParam(':supervisor_id', $data['supervisor_id']);
    $stmt->bindParam(':report_date', $data['report_date']);
    $stmt->bindParam(':status', $data['status']);
    $stmt->bindParam(':issues', $data['issues']);
    $stmt->bindParam(':recommendations', $data['recommendations']);
    
    if ($stmt->execute()) {
        $data['id'] = $db->lastInsertId();
        sendSuccessResponse($data, 'Supervision report created successfully');
    } else {
        sendErrorResponse('Failed to create supervision report');
    }
}

function updateSupervisionReport($db, $id) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $query = "UPDATE supervision_reports SET project_id = :project_id, supervisor_id = :supervisor_id, report_date = :report_date, status = :status, issues = :issues, recommendations = :recommendations WHERE id = :id";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':project_id', $data['project_id']);
    $stmt->bindParam(':supervisor_id', $data['supervisor_id']);
    $stmt->bindParam(':report_date', $data['report_date']);
    $stmt->bindParam(':status', $data['status']);
    $stmt->bindParam(':issues', $data['issues']);
    $stmt->bindParam(':recommendations', $data['recommendations']);
    
    if ($stmt->execute()) {
        sendSuccessResponse($data, 'Supervision report updated successfully');
    } else {
        sendErrorResponse('Failed to update supervision report');
    }
}

function deleteSupervisionReport($db, $id) {
    $query = "DELETE FROM supervision_reports WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    
    if ($stmt->execute()) {
        sendSuccessResponse(null, 'Supervision report deleted successfully');
    } else {
        sendErrorResponse('Failed to delete supervision report');
    }
}

// Quality Safety Reports
function handleQualitySafetyReports($db, $method, $id) {
    switch ($method) {
        case 'GET':
            if ($id) {
                getQualitySafetyReport($db, $id);
            } else {
                getQualitySafetyReports($db);
            }
            break;
        case 'POST':
            createQualitySafetyReport($db);
            break;
        case 'PUT':
            updateQualitySafetyReport($db, $id);
            break;
        case 'DELETE':
            deleteQualitySafetyReport($db, $id);
            break;
        default:
            sendErrorResponse('Method not allowed', 405);
    }
}

function getQualitySafetyReports($db) {
    $query = "SELECT * FROM quality_safety_reports ORDER BY created_at DESC";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $reports = $stmt->fetchAll();
    
    // Parse JSON fields
    foreach ($reports as &$report) {
        $report['page_info'] = json_decode($report['page_info'], true);
        $report['checklist_items'] = json_decode($report['checklist_items'], true);
    }
    
    sendSuccessResponse($reports);
}

function createQualitySafetyReport($db) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $query = "INSERT INTO quality_safety_reports (project_id, project_title, inspector_id, inspector_name, inspection_date, inspection_type, document_number, page_info, checklist_items, assigned_to, assigned_to_name, status) VALUES (:project_id, :project_title, :inspector_id, :inspector_name, :inspection_date, :inspection_type, :document_number, :page_info, :checklist_items, :assigned_to, :assigned_to_name, :status)";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':project_id', $data['project_id']);
    $stmt->bindParam(':project_title', $data['project_title']);
    $stmt->bindParam(':inspector_id', $data['inspector_id']);
    $stmt->bindParam(':inspector_name', $data['inspector_name']);
    $stmt->bindParam(':inspection_date', $data['inspection_date']);
    $stmt->bindParam(':inspection_type', $data['inspection_type']);
    $stmt->bindParam(':document_number', $data['document_number']);
    $stmt->bindParam(':page_info', json_encode($data['page_info']));
    $stmt->bindParam(':checklist_items', json_encode($data['checklist_items']));
    $stmt->bindParam(':assigned_to', $data['assigned_to']);
    $stmt->bindParam(':assigned_to_name', $data['assigned_to_name']);
    $stmt->bindParam(':status', $data['status']);
    
    if ($stmt->execute()) {
        $data['id'] = $db->lastInsertId();
        sendSuccessResponse($data, 'Quality safety report created successfully');
    } else {
        sendErrorResponse('Failed to create quality safety report');
    }
}

// Quality Tasks
function handleQualityTasks($db, $method, $id) {
    switch ($method) {
        case 'GET':
            if ($id) {
                getQualityTask($db, $id);
            } else {
                getQualityTasks($db);
            }
            break;
        case 'POST':
            createQualityTask($db);
            break;
        case 'PUT':
            updateQualityTask($db, $id);
            break;
        case 'DELETE':
            deleteQualityTask($db, $id);
            break;
        default:
            sendErrorResponse('Method not allowed', 405);
    }
}

function getQualityTasks($db) {
    $query = "SELECT * FROM quality_tasks ORDER BY created_at DESC";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $tasks = $stmt->fetchAll();
    
    // Parse JSON fields
    foreach ($tasks as &$task) {
        $task['checkpoints'] = json_decode($task['checkpoints'], true);
    }
    
    sendSuccessResponse($tasks);
}

function createQualityTask($db) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $query = "INSERT INTO quality_tasks (title, description, type, category, assigned_to, assigned_to_name, project_id, project_name, checkpoints, created_by, created_by_name, due_date, status, priority) VALUES (:title, :description, :type, :category, :assigned_to, :assigned_to_name, :project_id, :project_name, :checkpoints, :created_by, :created_by_name, :due_date, :status, :priority)";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':title', $data['title']);
    $stmt->bindParam(':description', $data['description']);
    $stmt->bindParam(':type', $data['type']);
    $stmt->bindParam(':category', $data['category']);
    $stmt->bindParam(':assigned_to', $data['assigned_to']);
    $stmt->bindParam(':assigned_to_name', $data['assigned_to_name']);
    $stmt->bindParam(':project_id', $data['project_id']);
    $stmt->bindParam(':project_name', $data['project_name']);
    $stmt->bindParam(':checkpoints', json_encode($data['checkpoints']));
    $stmt->bindParam(':created_by', $data['created_by']);
    $stmt->bindParam(':created_by_name', $data['created_by_name']);
    $stmt->bindParam(':due_date', $data['due_date']);
    $stmt->bindParam(':status', $data['status']);
    $stmt->bindParam(':priority', $data['priority']);
    
    if ($stmt->execute()) {
        $data['id'] = $db->lastInsertId();
        sendSuccessResponse($data, 'Quality task created successfully');
    } else {
        sendErrorResponse('Failed to create quality task');
    }
}

function updateQualityTask($db, $id) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $setParts = [];
    $params = [':id' => $id];
    
    $allowedFields = ['title', 'description', 'type', 'category', 'assigned_to', 'assigned_to_name', 'project_id', 'project_name', 'checkpoints', 'due_date', 'status', 'priority'];
    
    foreach ($allowedFields as $field) {
        if (isset($data[$field])) {
            $setParts[] = "$field = :$field";
            if ($field === 'checkpoints') {
                $params[":$field"] = json_encode($data[$field]);
            } else {
                $params[":$field"] = $data[$field];
            }
        }
    }
    
    if (empty($setParts)) {
        sendErrorResponse('No valid fields to update');
    }
    
    $query = "UPDATE quality_tasks SET " . implode(', ', $setParts) . " WHERE id = :id";
    $stmt = $db->prepare($query);
    
    if ($stmt->execute($params)) {
        sendSuccessResponse($data, 'Quality task updated successfully');
    } else {
        sendErrorResponse('Failed to update quality task');
    }
}
?>
