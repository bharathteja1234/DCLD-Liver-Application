<?php
require 'dbh.php';

if (!isset($_GET['p_id']) || !isset($_GET['course'])) {
    http_response_code(400);
    echo 'Missing p_id or course';
    exit;
}

$p_id = $_GET['p_id'];
$course = $_GET['course'];

$tableName = "patient_" . $p_id;

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        $medicine = $input['medicine'];
        $medicine_duration = $input['medicine_duration'];
        $frequency = $input['frequency'];
        $guidelines = $input['guidelines'];

        $sql = "INSERT INTO $tableName (course, medicine, medicine_duration, frequency, guidelines)
                VALUES (:course, :medicine, :medicine_duration, :frequency, :guidelines)";
        
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':course', $course);
        $stmt->bindParam(':medicine', $medicine);
        $stmt->bindParam(':medicine_duration', $medicine_duration);
        $stmt->bindParam(':frequency', $frequency);
        $stmt->bindParam(':guidelines', $guidelines);

        if ($stmt->execute()) {
            $input['id'] = $conn->lastInsertId();
            echo json_encode($input);
        } else {
            http_response_code(500);
            echo 'Error: Failed to insert data';
        }
    } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo 'Missing id';
            exit;
        }

        $id = $_GET['id'];
        $sql = "DELETE FROM $tableName WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':id', $id);

        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo 'Error: Failed to delete data';
        }
    } else {
        $sql = "SELECT * FROM $tableName WHERE course = :course";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':course', $course);
        $stmt->execute();

        $prescriptions = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($prescriptions);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo 'Error: ' . $e->getMessage();
}

$conn = null; // Close the connection
?>
