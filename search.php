<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'dbh.php';

// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET['p_id'])) {
    $p_id = $_GET['p_id'];

    $sql = "SELECT p_id, username, name, age, contactNo, disease, gender, admittedOn, dischargeOn, Treatment_Given, Course_in_Hospital, image FROM p_login WHERE p_id = :p_id";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':p_id', $p_id);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result) {
        echo json_encode($result);
    } else {
        echo json_encode(["error" => "No user found"]);
    }
} else {
    echo json_encode(["error" => "Invalid request method or missing p_id"]);
}
?>
