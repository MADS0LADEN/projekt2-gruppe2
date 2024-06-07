<?php
session_start(); // Starter en ny session eller genoptager en eksisterende

// Tjek om brugeren er logget ind
if (!isset($_SESSION['PersonID'])) {
    // Hvis ikke, omdiriger til login-siden
    header('Location: https://adjms.sof60.dk/login.php');
    exit(); // Stopper yderligere eksekvering af scriptet
} else {
    // Hvis brugeren er logget ind, fortsæt

    // Hent enhedsoplysninger fra POST-anmodningen
    $HoldID = $_POST['HoldID']; // Henter HoldID fra POST-data
    $HoldNavn = $_POST['HoldNavn']; // Henter HoldNavn fra POST-data
    
    // Opret forbindelse til databasen
    $servername = "192.168.15.24"; // Databasens serveradresse
    $username = "root"; // Databasens brugernavn
    $password_db = "Dboa24!!"; // Databasens adgangskode
    $dbname = "Projekt2"; // Databasens navn

    // Opretter forbindelse til MySQL-databasen
    $conn = new mysqli($servername, $username, $password_db, $dbname);

    // Tjekker forbindelsen
    if ($conn->connect_error) {
        // Hvis forbindelsen fejler, stop og vis fejlmeddelelse
        die("Connection failed: " . $conn->connect_error);
    }

    // Undgå SQL-injektion
    $HoldID = $conn->real_escape_string($HoldID); // Renser HoldID for at undgå SQL-injektion
    $HoldNavn = $conn->real_escape_string($HoldNavn); // Renser HoldNavn for at undgå SQL-injektion

    // Gem enhedsoplysninger i databasen eller opdater dem hvis HoldID allerede findes
    $sql = "INSERT INTO StudereRetninger (HoldID, HoldNavn) VALUES ('$HoldID', '$HoldNavn') ON DUPLICATE KEY UPDATE HoldNavn='$HoldNavn'";
    // SQL-kommando til at indsætte eller opdatere data
    
    if ($conn->query($sql) === TRUE) {
        // Hvis SQL-kommandoen udføres korrekt, vis besked
        echo "Enheden er blevet gemt.";
    } else {
        // Hvis der opstår en fejl under udførelsen, vis fejlmeddelelse
        echo "Fejl ved gemning af enhed: " . $conn->error;
    }

    // Lukker forbindelsen til databasen
    $conn->close();
}
?>