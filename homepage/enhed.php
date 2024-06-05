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

    // Gem enhedsoplysninger i databasen
    $sql = "INSERT INTO Devices (DeviceID, Lokale) VALUES ('$DeviceID', '$Lokale')";

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
