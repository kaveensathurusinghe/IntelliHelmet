<?php
$workers_Fname = $_POST['workers_Fname'];
$workers_Lname = $_POST['workers_Lname'];
$gender = $_POST['gender'];
$email = $_POST['email'];
$password = $_POST['password'];
$contact_number = $_POST['contact_number'];

// Database connection
$conn = new mysqli('localhost', 'root', '', 'intellihelmet');
if ($conn->connect_error) {
    die("Connection Failed: " . $conn->connect_error);
}

// Prepare the SQL statement with placeholders
$stmt = $conn->prepare("INSERT INTO workers_info (workers_Fname, workers_Lname, gender, email, password, contact_number) VALUES (?, ?, ?, ?, ?, ?)");
if (!$stmt) {
    die("Prepare failed: " . $conn->error);
}

// Bind parameters and execute the statement
$stmt->bind_param("sssssi", $workers_Fname, $workers_Lname, $gender, $email, $password, $contact_number);
if (!$stmt->execute()) {
    die("Execute failed: " . $stmt->error);
}

echo "Registration successful...";

// Close the statement and database connection
$stmt->close();
$conn->close();
?>
