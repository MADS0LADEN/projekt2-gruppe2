<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Tjek om brugeren er logget ind
    if (!isset($_SESSION['Personer'])) {
        // Hvis brugeren ikke er logget ind, vis en fejlmeddelelse
        echo "Brugeren er ikke logget ind.";
        exit();
    }

    // Hent enhedsoplysninger fra POST-anmodningen
    $device_id = $_POST['HoldID'];
    $placement = $_POST['HoldNavn'];
    

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

    // Gem enhedsoplysninger i databasen
    $sql = "INSERT INTO StudereRetninger (HoldID, HoldNavn) VALUES ('$HoldID', '$HoldNavn')";

    if ($conn->query($sql) === TRUE) {
        echo "Enheden er blevet gemt.";
    } else {
        echo "Fejl ved gemning af enhed: " . $conn->error;
    }

    $conn->close();
} else {
    echo "Ugyldig anmodning.";
}
?>
