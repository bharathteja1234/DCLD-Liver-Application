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
    $sql = "SELECT assessment_date, saltRestrictionDiet FROM $tableName ORDER BY assessment_date ASC";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    
    $responses = [];
    $index = 1;
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        if (!empty($row['assessment_date']) && $row['assessment_date'] !== '0000-00-00 00:00:00.000000' && !empty($row['saltRestrictionDiet'])) {
            $responses[] = ["response" => "Daily Assessment Response: $index Date: " . $row['assessment_date']];
            $index++;
        }
    }
    
    echo json_encode($responses);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}

$conn = null;
?>
