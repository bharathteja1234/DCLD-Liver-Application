<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'dbh.php';

// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $input_data = file_get_contents("php://input");
    $data = json_decode($input_data, true);

    if (isset($data['p_id'], $data['username'], $data['name'], $data['age'], $data['contactNo'], $data['disease'], $data['gender'], $data['admittedOn'], $data['dischargeOn'], $data['Treatment_Given'], $data['Course_in_Hospital'])) {
        $p_id = $data['p_id'];
        $username = $data['username'];
        $name = $data['name'];
        $age = $data['age'];
        $contactNo = $data['contactNo'];
        $disease = $data['disease'];
        $gender = $data['gender'];
        $admittedOn = $data['admittedOn'];
        $dischargeOn = $data['dischargeOn'];
        $Treatment_Given = $data['Treatment_Given']; // New field
        $Course_in_Hospital = $data['Course_in_Hospital']; // New field

        $sql = "UPDATE p_login SET username = :username, name = :name, age = :age, contactNo = :contactNo, disease = :disease, gender = :gender, admittedOn = :admittedOn, dischargeOn = :dischargeOn, Treatment_Given = :Treatment_Given, Course_in_Hospital = :Course_in_Hospital WHERE p_id = :p_id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':age', $age);
        $stmt->bindParam(':contactNo', $contactNo);
        $stmt->bindParam(':disease', $disease);
        $stmt->bindParam(':gender', $gender);
        $stmt->bindParam(':admittedOn', $admittedOn);
        $stmt->bindParam(':dischargeOn', $dischargeOn);
        $stmt->bindParam(':Treatment_Given', $Treatment_Given); // Bind Treatment_Given
        $stmt->bindParam(':Course_in_Hospital', $Course_in_Hospital); // Bind Course_in_Hospital
        $stmt->bindParam(':p_id', $p_id);

        if ($stmt->execute()) {
            if ($stmt->rowCount() > 0) {
                $fetch_sql = "SELECT * FROM p_login WHERE p_id = :p_id";
                $fetch_stmt = $conn->prepare($fetch_sql);
                $fetch_stmt->bindParam(':p_id', $p_id);
                $fetch_stmt->execute();
                $result = $fetch_stmt->fetch(PDO::FETCH_ASSOC);

                if ($result) {
                    echo json_encode($result);
                } else {
                    echo json_encode(["error" => "Patient details not found after update"]);
                }
            } else {
                echo json_encode(["error" => "No changes made to patient details"]);
            }
        } else {
            echo json_encode(["error" => "Failed to update patient details"]);
        }
    } else {
        echo json_encode(["error" => "Missing required fields"]);
    }
} else {
    echo json_encode(["error" => "Invalid request method"]);
}
?>
