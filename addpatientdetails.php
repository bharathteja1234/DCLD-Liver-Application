<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database connection
$host = 'localhost';
$dbUsername = 'root';
$dbPassword = '';
$dbName = 'ihms';

$conn = new mysqli($host, $dbUsername, $dbPassword, $dbName);

if ($conn->connect_error) {
    die('Connection Failed: ' . $conn->connect_error);
}

// Validate required fields
$requiredFields = ['p_id', 'username', 'password', 'name', 'contactNo', 'age', 'gender', 'disease', 'admittedOn', 'dischargeOn', 'Treatment_Given', 'Course_in_Hospital'];
foreach ($requiredFields as $field) {
    if (empty($_POST[$field])) {
        echo json_encode(['success' => false, 'message' => "Field $field is required"]);
        exit;
    }
}

$p_id = $_POST['p_id'];
$username = $_POST['username'];
$password = $_POST['password'];
$name = $_POST['name'];
$contactNo = $_POST['contactNo'];
$age = $_POST['age'];
$gender = $_POST['gender'];
$disease = $_POST['disease'];
$admittedOn = date('Y-m-d', strtotime($_POST['admittedOn']));
$dischargeOn = date('Y-m-d', strtotime($_POST['dischargeOn']));
$Treatment_Given = $_POST['Treatment_Given'];
$Course_in_Hospital = $_POST['Course_in_Hospital'];

// Handling the image file upload
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $imageTmpPath = $_FILES['image']['tmp_name'];
    $imageName = $_FILES['image']['name'];
    $imageSize = $_FILES['image']['size'];
    $imageType = $_FILES['image']['type'];
    $imageExt = pathinfo($imageName, PATHINFO_EXTENSION);
    $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];

    if (in_array($imageExt, $allowedExtensions)) {
        $uploadFileDir = 'upload_files/';
        $destPath = $uploadFileDir . $imageName;

        if (move_uploaded_file($imageTmpPath, $destPath)) {
            $imageUrl = $destPath;
        } else {
            echo json_encode(['success' => false, 'message' => 'Error moving the uploaded file']);
            exit;
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid file extension']);
        exit;
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Image file is required']);
    exit;
}

// SQL query to insert data into the database
$sql = "INSERT INTO addpatientdetails (p_id, username, password, name, contactNo, age, gender, disease, admittedOn, dischargeOn, Treatment_Given, Course_in_Hospital, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
if ($stmt === false) {
    echo json_encode(['success' => false, 'message' => 'SQL statement preparation failed']);
    exit;
}

$stmt->bind_param('ssssissssssss', $p_id, $username, $password, $name, $contactNo, $age, $gender, $disease, $admittedOn, $dischargeOn, $Treatment_Given, $Course_in_Hospital, $imageUrl);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Error inserting data']);
}

$stmt->close();
$conn->close();
?>
