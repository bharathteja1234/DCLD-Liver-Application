<?php
header('Content-Type: application/json');
include 'dbh.php';

$p_id = filter_input(INPUT_GET, 'p_id', FILTER_SANITIZE_NUMBER_INT);
if (!$p_id) {
    echo json_encode(["error" => "Invalid patient ID"]);
    exit();
}

$tableName = "patient_" . $p_id;

try {
    $sql = "SELECT response_time, response, questions, type FROM $tableName ORDER BY response_time ASC";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $responses = [];
    $index = 1;
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        if (!empty($row['response_time']) && $row['response_time'] !== '0000-00-00 00:00:00.000000' && !empty($row['response'])) {
            $responses[] = ["response" => "Questionnaire Response: $index Date: " . $row['response_time']];
            $index++;
        }
    }
    
    echo json_encode($responses);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}

$conn = null;
?>
