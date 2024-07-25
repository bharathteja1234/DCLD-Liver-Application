<?php
include 'dbh.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['status' => false, 'error' => 'No data received']);
    exit;
}

$doctor_name = $data['doctorName'] ?? null;
$gender = $data['gender'] ?? null;
$speciality = $data['speciality'] ?? null;
$contactNo = $data['contactNo'] ?? null;
$doctor_id = $data['doctorId'] ?? null;
$username = $data['username'] ?? null;
$password = $data['password'] ?? null;

if (!$doctor_name || !$doctor_id || !$username || !$password) {
    echo json_encode(['status' => false, 'error' => 'Missing required fields']);
    exit;
}

try {
    $sql = "INSERT INTO login_info (d_id, doctor_name, gender, speciality, contactNo, username, password) VALUES (:doctor_id, :doctor_name, :gender, :speciality, :contactNo, :username, :password)";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':doctor_id', $doctor_id);
    $stmt->bindParam(':doctor_name', $doctor_name);
    $stmt->bindParam(':gender', $gender);
    $stmt->bindParam(':speciality', $speciality);
    $stmt->bindParam(':contactNo', $contactNo);
    $stmt->bindParam(':username', $username);
    $stmt->bindParam(':password', $password);

    $response = array();

    if ($stmt->execute()) {
        $response['status'] = true;
    } else {
        $response['status'] = false;
        $response['error'] = 'Insert query failed';
    }

    echo json_encode($response);
} catch (PDOException $e) {
    echo json_encode(['status' => false, 'error' => $e->getMessage()]);
}
?>
