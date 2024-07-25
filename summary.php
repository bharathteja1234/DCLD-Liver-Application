<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include 'dbh.php'; // Include the database connection

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    if (isset($_GET['p_id']) && isset($_GET['discharge_summary']) && isset($_GET['date'])) {
        $p_id = $_GET['p_id'];
        $discharge_summary = $_GET['discharge_summary'];
        $date = $_GET['date'];
        $tableName = "patient_" . $p_id;

        $sql = "SELECT summary FROM $tableName WHERE discharge_summary = :discharge_summary AND date = :date";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':discharge_summary', $discharge_summary);
        $stmt->bindParam(':date', $date);
        $stmt->execute();

        $summary = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($summary) {
            echo json_encode($summary);
        } else {
            http_response_code(404);
            echo json_encode(array("error" => "Discharge summary not found"));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("error" => "Missing required parameters (p_id, discharge_summary, date)"));
    }
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $p_id = $data['p_id'] ?? '';
    $summary = $data['summary'] ?? '';
    $date = $data['date'] ?? '';

    if ($p_id && $summary && $date) {
        $tableName = "patient_" . $p_id;
        $sql = "UPDATE $tableName SET summary = :summary WHERE discharge_summary = :discharge_summary AND date = :date";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':summary', $summary);
        $stmt->bindParam(':discharge_summary', $data['discharge_summary']);
        $stmt->bindParam(':date', $date);

        if ($stmt->execute()) {
            echo json_encode(array("success" => "Discharge summary updated successfully"));
        } else {
            http_response_code(500);
            echo json_encode(array("error" => "Failed to update discharge summary: " . $stmt->errorInfo()[2]));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("error" => "Missing required parameters (p_id, summary, date)"));
    }
} else {
    http_response_code(405);
    echo json_encode(array("error" => "Method not allowed"));
}
?>
