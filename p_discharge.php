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

// Get the username and password from the request
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

if (isset($request->username) && isset($request->password)) {
    $username = $request->username;
    $password = $request->password;

    // Fetch p_id and discharge summary based on username and password
    $sql = "SELECT p_id, dischargesummary FROM p_login WHERE username = '$username' AND password = '$password'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $p_id = $row['p_id'];
        $dischargeSummary = $row['dischargesummary'];
        echo json_encode(array('p_id' => $p_id, 'dischargesummary' => $dischargeSummary));
    } else {
        echo json_encode(array('error' => 'Patient not found'));
    }
} else {
    echo json_encode(array('error' => 'Username and password not provided'));
}

$conn->close();
?>
