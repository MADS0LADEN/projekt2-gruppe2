<?php
session_start();

// Tjek om brugeren er logget ind
if (!isset($_SESSION['user_id'])) {
    // Hvis brugeren ikke er logget ind, kan du omdirigere dem til login-siden eller vise en fejlmeddelelse
    echo "Brugeren er ikke logget ind.";
    exit(); // Afslut scriptet for at forhindre yderligere udførelse
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Hent enhedsoplysninger fra POST-anmodningen
    $ID = $_POST['ID'];
    $Navn = $_POST['Navn'];
    $HoldID = $_POST['HoldID'];
    $Kode = $_SESSION['Kode'];

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
    $ID = $conn->real_escape_string($ID);
    $Navn = $conn->real_escape_string($Navn);
    $HoldID = $conn->real_escape_string($HoldID);
    $Kode = $conn->real_escape_string($Kode);

    // Gem enhedsoplysninger i databasen
    $sql = "INSERT INTO Personer (PersonID, Navn, Kode) VALUES ('$ID', '$Navn', '$Kode')";
    $sql_hold = "INSERT INTO HoldID (HoldID) VALUES ('$HoldID')";

    if ($conn->query($sql) === TRUE && $conn->query($sql_hold) === TRUE) {
        echo "Enheden er blevet gemt.";
    } else {
        echo "Fejl ved gemning af enhed: " . $conn->error;
    }

    $conn->close();
} else {
    echo "Ugyldig anmodning.";
}
?>
