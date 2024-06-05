<?php
session_start();

// Tjek om brugeren er logget ind
if (!isset($_SESSION['PersonID'])) {
    header('Location: https://adjms.sof60.dk/login.php');
    exit();
} else {
    // Hent enhedsoplysninger fra POST-anmodningen
    $HoldID = $_POST['HoldID'];
    $HoldNavn = $_POST['HoldNavn'];
    
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
    $HoldID = $conn->real_escape_string($HoldID);
    $HoldNavn = $conn->real_escape_string($HoldNavn);

    // Gem enhedsoplysninger i databasen eller opdater dem hvis HoldID allerede findes
    $sql = "INSERT INTO StudereRetninger (HoldID, HoldNavn) VALUES ('$HoldID', '$HoldNavn') ON DUPLICATE KEY UPDATE HoldNavn='$HoldNavn'";
    
    if ($conn->query($sql) === TRUE) {
        echo "Enheden er blevet gemt.";
    } else {
        echo "Fejl ved gemning af enhed: " . $conn->error;
    }

    $conn->close();
}
?>
