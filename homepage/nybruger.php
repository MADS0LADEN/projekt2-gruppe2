<?php
$servername = "79.171.148.172";
$username = "remote_vand";
$password_db = "Dboa24vand!";
$dbname = "vandlog";
$tablename = "user_list";

// Get the raw POST data
$data = file_get_contents("php://input");

// Decode the JSON data
$decoded_data = json_decode($data);

// Extract email and password from the decoded data
$email = $decoded_data->email;
$password = hash("sha256", $decoded_data->password);

// Create a connection to the MySQL server
$conn = new mysqli($servername, $username, $password_db, $dbname);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Insert data into the database
$sql = "INSERT INTO $tablename (email, password) VALUES ('$email', '$password')";

if ($conn->query($sql) === TRUE) {
    echo "Data inserted successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

// Close the database connection
$conn->close();
?>
