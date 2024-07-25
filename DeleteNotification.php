<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require 'dbh.php';

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);
    $notificationId = $data['p_id'];

    try {
        $stmt = $conn->prepare("DELETE FROM notification_table WHERE p_id = :p_id");
        $stmt->bindParam(':p_id', $notificationId, PDO::PARAM_INT);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            echo json_encode(array("success" => true));
        } else {
            echo json_encode(array("success" => false, "message" => "Notification not found"));
        }
    } catch (PDOException $e) {
        echo json_encode(array("success" => false, "message" => $e->getMessage()));
    } finally {
        $conn = null;
    }
} else {
    echo json_encode(array("success" => false, "message" => "Invalid request method"));
}
?>
