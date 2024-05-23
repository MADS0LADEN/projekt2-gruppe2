<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Tjek om brugeren er logget ind
    if (!isset($_SESSION['user_id'])) {
        echo "Brugeren er ikke logget ind.";
        exit();
    }

    // Hent enhedsoplysninger fra POST-anmodningen
    $device_id = $_POST['device_id'];
    $placement = $_POST['placement'];
    $user_id = $_SESSION['user_id'];

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
    $device_id = $conn->real_escape_string($device_id);
    $placement = $conn->real_escape_string($placement);

    // Gem enhedsoplysninger i databasen
    $sql = "INSERT INTO user_info (user_id, device_id, placement) VALUES ('$user_id', '$device_id', '$placement')";

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
