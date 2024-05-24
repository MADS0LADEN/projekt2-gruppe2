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
    $Kode = $_SESSION['Kode'];

    // Opret forbindelse til databasen
    $servername = "host.docker.internal";
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
    $Kode = $conn->real_escape_string($Kode);

    // Gem enhedsoplysninger i databasen
    $sql = "INSERT INTO Personer (PersonID, Navn, Kode) VALUES ('$ID', '$Navn', '$Kode')";

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
