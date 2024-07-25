<?php

// Set CORS headers to allow requests from any origin
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
// Set content type to JSON
header('Content-Type: application/json');

// Database connection parameters
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "med_project";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    // If connection fails, return error response
    $response = array(
        "status" => false,
        "message" => "Connection failed: " . $conn->connect_error
    );
    echo json_encode($response);
    die();
}

$postData = file_get_contents("php://input");
$request = json_decode($postData);

$username = isset($request->username) ? $request->username : null;
$password = isset($request->password) ? $request->password : null;

// Prepare SQL statement to prevent SQL injection
$stmt = $conn->prepare("SELECT * FROM login_info WHERE username=? AND password=?");
$stmt->bind_param("ss", $username, $password);
$stmt->execute();
$result = $stmt->get_result();

// Check if there is a matching user
if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    $d_id = $user['d_id'];

    $response = array(
        "status" => true,
        "message" => "Login successful",
        "d_id" => $d_id
    );
    echo json_encode($response);
} else {
    $response = array(
        "status" => false,
        "message" => "Invalid username or password"
    );
    echo json_encode($response);
}

$stmt->close();
$conn->close();

?>
