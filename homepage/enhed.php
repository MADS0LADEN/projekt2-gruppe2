<?php
session_start();

// Tjek om brugeren er logget ind
if (!isset($_SESSION['PersonID'])) {
    header('Location: https://adjms.sof60.dk/login.php');
    exit();
} else { // Tilføjelse af startkrølle parentes her

    // Hent enhedsoplysninger fra POST-anmodningen
    $DeviceID = $_POST['DeviceID'];
    $Lokale = $_POST['Lokale'];
    
    // Opret forbindelse til databasen
    $servername = "192.168.15.24";
    $username = "root";
    $password_db = "Dboa24!!";
    $dbname = "Projekt2";

    $conn = new mysqli($servername, $username, $password_db, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Undgå SQL-injektion
    $DeviceID = $conn->real_escape_string($DeviceID);
    $Lokale = $conn->real_escape_string($Lokale);

    // Gem enhedsoplysninger i databasen eller opdater dem hvis DeviceID allerede findes
    $sql = "INSERT INTO Devices (DeviceID, Lokale) VALUES ('$DeviceID', '$Lokale') ON DUPLICATE KEY UPDATE Lokale='$Lokale'";
    
    // Midlertidig echo for at kontrollere SQL-forespørgsel
    echo "SQL-forespørgsel: " . $sql;

    if ($conn->query($sql) === TRUE) {
        echo "Enheden er blevet gemt.";
    } else {
        echo "Fejl ved gemning af enhed: " . $conn->error;
    }

    $conn->close();
} // Luk startkrølle parentes her
?>
