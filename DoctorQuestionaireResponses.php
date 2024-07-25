<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require 'dbh.php';

// Get the POST data
$postData = json_decode(file_get_contents("php://input"), true);

// Check if p_id is present and valid
if (!isset($postData['p_id'])) {
    echo json_encode(array("success" => false, "message" => "Invalid data: p_id missing"));
    exit;
}

// Extract patient ID from the POST data
$p_id = $postData['p_id'];
$tableName = "patient_" . $p_id;

try {
    // Prepare the SQL statement to fetch responses sorted by response_time
    $stmt = $conn->prepare("SELECT * FROM $tableName ORDER BY response_time DESC");
    $stmt->execute();
    $responses = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Send success response with responses data
    echo json_encode(array("success" => true, "responses" => $responses));
} catch (PDOException $e) {
    // Handle database errors
    echo json_encode(array("success" => false, "message" => $e->getMessage()));
} finally {
    // Close the connection
    $conn = null;
}
?>
