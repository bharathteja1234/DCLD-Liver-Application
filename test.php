<?php
require 'dbh.php';

// Check if the connection is established
if ($conn) {
    echo "Database connection successful";
} else {
    echo "Database connection failed";
}
?>
