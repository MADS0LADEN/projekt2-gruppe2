<?php
// Start sessionen
session_start();

// Tjek om brugeren er logget ind ved at kontrollere session variablen 'PersonID'
if (!isset($_SESSION['PersonID'])) {
    // Hvis ikke logget ind, omdiriger til login side
    header('Location: https://adjms.sof60.dk/login.php');
    exit(); // Stopper yderligere script eksekvering
} else { // Hvis brugeren er logget ind, fortsæt

    // Hent enhedsoplysninger fra POST-anmodningen
    $DeviceID = $_POST['DeviceID'];
    $Lokale = $_POST['Lokale'];
    
    // Database forbindelsesoplysninger
    $servername = "192.168.15.24";
    $username = "root";
    $password_db = "Dboa24!!";
    $dbname = "Projekt2";

    // Opret forbindelse til databasen
    $conn = new mysqli($servername, $username, $password_db, $dbname);

    // Tjek for forbindelsesfejl
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error); // Stopper scriptet og viser fejlmeddelelse
    }

    // Rens input for at undgå SQL-injektion
    $DeviceID = $conn->real_escape_string($DeviceID);
    $Lokale = $conn->real_escape_string($Lokale);

    // SQL-forespørgsel til at indsætte eller opdatere enhedsoplysninger
    $sql = "INSERT INTO Devices (DeviceID, Lokale) VALUES ('$DeviceID', '$Lokale') ON DUPLICATE KEY UPDATE Lokale='$Lokale'";
    
    // Midlertidig echo for at kontrollere SQL-forespørgsel
    echo "SQL-forespørgsel: " . $sql;

    // Udfør SQL-forespørgslen
    if ($conn->query($sql) === TRUE) {
        echo "Enheden er blevet gemt."; // Succesmeddelelse
    } else {
        echo "Fejl ved gemning af enhed: " . $conn->error; // Fejlmeddelelse
    }

    // Luk databaseforbindelsen
    $conn->close();
} // Afslutning på logget ind tjek
?>