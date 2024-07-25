<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once 'dbh.php'; // Adjust this according to your database connection

// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Handle GET request to fetch medications
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $p_id = $_REQUEST['p_id'] ?? '';

    if (empty($p_id)) {
        echo json_encode(['error' => 'Missing p_id']);
        exit;
    }

    try {
        // Fetch medications from patient_p_id table, excluding those with null duration
        $tableName = "patient_" . $p_id;
        $sql = "SELECT course, duration FROM $tableName WHERE duration IS NOT NULL";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $medications = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($medications);
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Failed to fetch medications: ' . $e->getMessage()]);
    }
}

// Handle POST request to add medication
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (empty($data['course']) || empty($data['duration'])) {
        echo json_encode(['error' => 'Missing course or duration']);
        exit;
    }

    $p_id = $data['p_id'] ?? '';

    if (empty($p_id)) {
        echo json_encode(['error' => 'Missing p_id']);
        exit;
    }

    try {
        // Insert new medication into patient_p_id table
        $tableName = "patient_" . $p_id;
        $sql = "INSERT INTO $tableName (course, duration) VALUES (:course, :duration)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':course', $data['course']);
        $stmt->bindParam(':duration', $data['duration']);
        $stmt->execute();

        // Retrieve the inserted row
        $lastInsertId = $conn->lastInsertId();
        $sqlFetch = "SELECT course, duration FROM $tableName WHERE id = :id";
        $stmtFetch = $conn->prepare($sqlFetch);
        $stmtFetch->bindParam(':id', $lastInsertId);
        $stmtFetch->execute();
        $newMedication = $stmtFetch->fetch(PDO::FETCH_ASSOC);

        echo json_encode($newMedication);
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Failed to add medication: ' . $e->getMessage()]);
    }
}

// Handle DELETE request to delete medication
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (empty($data['course'])) {
        echo json_encode(['error' => 'Missing course']);
        exit;
    }

    $p_id = $data['p_id'] ?? '';

    if (empty($p_id)) {
        echo json_encode(['error' => 'Missing p_id']);
        exit;
    }

    try {
        // Delete medication from patient_p_id table
        $tableName = "patient_" . $p_id;
        $sql = "DELETE FROM $tableName WHERE course = :course";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':course', $data['course']);
        $stmt->execute();

        echo json_encode(['success' => 'Medication deleted successfully']);
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Failed to delete medication: ' . $e->getMessage()]);
    }
}
?>
