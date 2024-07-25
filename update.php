<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "med_project";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the raw POST data
$input_data = file_get_contents("php://input");

// Decode the JSON data
$data = json_decode($input_data, true);

// Assuming you receive the username and other patient details via JSON input
$username = $data['username'];
$name = $data['name'];
$age = $data['age'];
$contactNo = $data['contactNo'];
$disease = $data['disease'];
$gender = $data['gender'];
$admittedOn = $data['admittedOn'];
$dischargeOn = $data['dischargeOn'];

// Update patient details in the database
$sql = "UPDATE p_login SET name = ?, age = ?, contactNo = ?, disease = ?, gender = ?, admittedOn = ?, dischargeOn = ? WHERE username = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sissssss", $name, $age, $contactNo, $disease, $gender, $admittedOn, $dischargeOn, $username);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo json_encode(["success" => "Patient details updated successfully"]);
} else {
    echo json_encode(["error" => "Failed to update patient details"]);
}

$stmt->close();
$conn->close();
?>
