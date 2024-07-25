<?php

// Set CORS headers to allow requests from any origin
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
// Set content type to JSON
header('Content-Type: application/json');

// Include the database connection file
include 'dbh.php';

$postData = file_get_contents("php://input");
$request = json_decode($postData);

$username = isset($request->username) ? $request->username : null;
$password = isset($request->password) ? $request->password : null;

if ($username === null || $password === null) {
    $response = array(
        "status" => false,
        "message" => "Username and password are required"
    );
    echo json_encode($response);
    exit;
}

// Prepare SQL statement to prevent SQL injection
$stmt = $conn->prepare("SELECT * FROM p_login WHERE username = :username AND password = :password");
$stmt->bindParam(':username', $username);
$stmt->bindParam(':password', $password);
$stmt->execute();
$result = $stmt->fetch(PDO::FETCH_ASSOC);

if ($result) {
    $p_id = $result['p_id']; // Assuming 'id' is the column name for the patient's ID

    // If user exists, return success response along with p_id
    $response = array(
        "status" => true,
        "message" => "Login successful",
        "p_id" => $p_id
    );
    echo json_encode($response);
} else {
    // If user does not exist, return error response
    $response = array(
        "status" => false,
        "message" => "Invalid username or password"
    );
    echo json_encode($response);
}

$conn = null;

?>
