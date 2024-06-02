<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Tjek om brugeren er logget ind
    if (!isset($_SESSION['user_id'])) {
        echo "Brugeren er ikke logget ind.";
        exit();
    }

    // Hent enhedsoplysninger fra POST-anmodningen
    $ID = $_POST['ID'];
    $Navn = $_POST['Navn'];
    $HoldID = $_POST['HoldID'];
    $Kode = $_SESSION['Kode'];

    // Opret forbindelse til databasen
    $servername = "mariadb";
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
    $sql = "INSERT INTO HoldID (HoldID) VALUES ('$HoldID')"

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
