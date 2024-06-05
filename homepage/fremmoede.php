<?php
session_start();

$servername = "192.168.15.24";
$username = "root";
$password_db = "Dboa24!!";
$dbname = "Projekt2";

$conn = new mysqli($servername, $username, $password_db, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Hent klasser
$sql_klasse = "SELECT HoldID, HoldNavn FROM StudereRetninger";
$result_klasse = $conn->query($sql_klasse);
$klasser = [];
if ($result_klasse->num_rows > 0) {
    while ($row = $result_klasse->fetch_assoc()) {
        $klasser[] = $row;
    }
}

// Hent studerende
$sql_studerende = "SELECT Personer.PersonID, Personer.Navn 
                   FROM Personer 
                   JOIN Personer_StudereRetninger ON Personer.PersonID = Personer_StudereRetninger.PersonID";
$result_studerende = $conn->query($sql_studerende);
$studerende = [];
if ($result_studerende->num_rows > 0) {
    while ($row = $result_studerende->fetch_assoc()) {
        $studerende[] = $row;
    }
}

// Hent registreringer
$sql = "SELECT Reg.Dato, Per.Navn, Dev.Lokale, Reg.Status, DATE_FORMAT(Reg.Dato, '%H:%i') AS Tidspunkt
                FROM Registeringer Reg
                JOIN Personer Per ON Reg.PersonID = Per.PersonID
                JOIN Devices Dev ON Reg.DeviceID = Dev.DeviceID
                WHERE Reg.PersonID = ?";
$result = $conn->query($sql);
$data = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}
$conn->close();

header('Content-Type: application/json');
echo json_encode(['data' => $data, 'klasser' => $klasser, 'studerende' => $studerende]);
?>
