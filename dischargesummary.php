<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include 'dbh.php'; // Include the database connection

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    if (isset($_GET['p_id'])) {
        $p_id = $_GET['p_id'];
        $tableName = "patient_" . $p_id;
        
        $sql = "SELECT discharge_summary, date FROM $tableName WHERE discharge_summary IS NOT NULL AND date IS NOT NULL";
        $result = $conn->query($sql);
        
        if ($result) {
            $summaries = array();
            while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
                $summaries[] = $row;
            }
            echo json_encode($summaries);
        } else {
            http_response_code(500);
            echo json_encode(array("error" => "Failed to fetch discharge summaries: " . $conn->errorInfo()[2]));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("error" => "Missing p_id parameter"));
    }

} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $p_id = $data['p_id'] ?? '';
    $discharge_summary = $data['discharge_summary'] ?? '';
    $date = $data['date'] ?? '';

    if ($p_id && $discharge_summary && $date) {
        $tableName = "patient_" . $p_id;
        $sql = "INSERT INTO $tableName (discharge_summary, date) VALUES (:discharge_summary, :date)";
        
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':discharge_summary', $discharge_summary);
        $stmt->bindParam(':date', $date);
        
        if ($stmt->execute()) {
            echo json_encode(array("discharge_summary" => $discharge_summary, "date" => $date));
        } else {
            http_response_code(500);
            echo json_encode(array("error" => "Failed to add new discharge summary: " . $stmt->errorInfo()[2]));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("error" => "Missing required parameters (p_id, discharge_summary, date)"));
    }

} elseif ($method === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);
    $p_id = $data['p_id'] ?? '';
    $discharge_summary = $data['discharge_summary'] ?? '';

    if ($p_id && $discharge_summary) {
        $tableName = "patient_" . $p_id;
        $sql = "DELETE FROM $tableName WHERE discharge_summary = :discharge_summary";
        
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':discharge_summary', $discharge_summary);
        
        if ($stmt->execute()) {
            echo json_encode(array("success" => "Discharge summary deleted successfully"));
        } else {
            http_response_code(500);
            echo json_encode(array("error" => "Failed to delete discharge summary: " . $stmt->errorInfo()[2]));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("error" => "Missing required parameters (p_id, discharge_summary)"));
    }

} else {
    http_response_code(405);
    echo json_encode(array("error" => "Method not allowed"));
}

// Note: PDO connection doesn't require explicit closing
// $conn = null;
?>
