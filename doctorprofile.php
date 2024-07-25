<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Content-Type: application/json');

include 'dbh.php'; // Include the database connection file

$requestMethod = $_SERVER['REQUEST_METHOD'];
$postData = file_get_contents("php://input");
$request = json_decode($postData);

if ($requestMethod === 'GET') {
    $d_id = isset($_GET['d_id']) ? $_GET['d_id'] : null;

    if ($d_id === null) {
        $response = array(
            "status" => false,
            "message" => "Doctor ID is required"
        );
        echo json_encode($response);
        exit;
    }

    try {
        $stmt = $conn->prepare("SELECT * FROM login_info WHERE d_id=:d_id");
        $stmt->bindParam(':d_id', $d_id, PDO::PARAM_INT);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result) {
            // Ensure the image path is correctly constructed as a URL
            $imagePath = $result['image'];

            $profileData = array(
                "image" => $imagePath,
                "d_id" => $result['d_id'],
                "doctor_name" => $result['doctor_name'],
                "speciality" => $result['speciality'],
                "gender" => $result['gender'],
                "contactNo" => $result['contactNo']
            );

            $response = array(
                "status" => true,
                "message" => "Profile fetched successfully",
                "profile" => $profileData
            );
        } else {
            $response = array(
                "status" => false,
                "message" => "No profile found for the given Doctor ID"
            );
        }

        echo json_encode($response);
    } catch (Exception $e) {
        $response = array(
            "status" => false,
            "message" => "An error occurred: " . $e->getMessage()
        );
        echo json_encode($response);
    }

} elseif ($requestMethod === 'POST') {
    $d_id = isset($request->d_id) ? $request->d_id : null;
    $doctor_name = isset($request->doctor_name) ? $request->doctor_name : null;
    $speciality = isset($request->speciality) ? $request->speciality : null;
    $gender = isset($request->gender) ? $request->gender : null;
    $contactNo = isset($request->contactNo) ? $request->contactNo : null;
    $image = isset($request->image) ? $request->image : null;

    if ($d_id === null) {
        $response = array(
            "status" => false,
            "message" => "Doctor ID is required"
        );
        echo json_encode($response);
        exit;
    }

    try {
        $updateFields = [];
        $updateValues = [];

        if ($doctor_name !== null) {
            $updateFields[] = "doctor_name = :doctor_name";
            $updateValues[':doctor_name'] = $doctor_name;
        }

        if ($speciality !== null) {
            $updateFields[] = "speciality = :speciality";
            $updateValues[':speciality'] = $speciality;
        }

        if ($gender !== null) {
            $updateFields[] = "gender = :gender";
            $updateValues[':gender'] = $gender;
        }

        if ($contactNo !== null) {
            $updateFields[] = "contactNo = :contactNo";
            $updateValues[':contactNo'] = $contactNo;
        }

        if ($image !== null) {
            $updateFields[] = "image = :image";
            $updateValues[':image'] = $image;
        }

        if (!empty($updateFields)) {
            $sql = "UPDATE login_info SET " . implode(", ", $updateFields) . " WHERE d_id = :d_id";
            $stmt = $conn->prepare($sql);
            $updateValues[':d_id'] = $d_id;

            $stmt->execute($updateValues);

            $response = array(
                "status" => true,
                "message" => "Profile updated successfully"
            );
        } else {
            $response = array(
                "status" => false,
                "message" => "No fields to update"
            );
        }

        echo json_encode($response);
    } catch (Exception $e) {
        $response = array(
            "status" => false,
            "message" => "An error occurred: " . $e->getMessage()
        );
        echo json_encode($response);
    }
} else {
    $response = array(
        "status" => false,
        "message" => "Invalid request method"
    );
    echo json_encode($response);
}

$conn = null;
?>
