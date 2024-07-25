<?php
header('Content-Type: application/json');

if (isset($_GET['assessment_date']) && isset($_GET['p_id'])) {
    $assessment_date = $_GET['assessment_date'];
    $p_id = $_GET['p_id'];
    $tableName = "patient_" . $p_id;

    // Include database connection
    require_once 'dbh.php';

    // Query to fetch assessment details by date
    $query = $conn->prepare("SELECT saltRestrictionDiet, fluidRestrictionDiet, weightMonitoring, alcoholMisuse, behavioralChanges, behavioralChangesNotes, bp, cbg, sleptTime, stoolsPassed FROM $tableName WHERE assessment_date = :assessment_date");
    $query->bindParam(':assessment_date', $assessment_date, PDO::PARAM_STR);
    $query->execute();
    $result = $query->fetch(PDO::FETCH_ASSOC);

    if ($result) {
        echo json_encode($result);
    } else {
        echo json_encode(['error' => 'No assessment found for the given date']);
    }

} else {
    echo json_encode(['error' => 'Missing or invalid parameters']);
}
?>
