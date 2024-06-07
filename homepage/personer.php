<?php
// Opret forbindelse til databasen
$servername = "192.168.15.24"; // Serverens IP-adresse
$username = "root"; // Brugernavn til databasen
$password_db = "Dboa24!!"; // Adgangskode til databasen
$dbname = "Projekt2"; // Navnet på databasen

// Opretter en ny forbindelse til databasen
$conn = new mysqli($servername, $username, $password_db, $dbname);

// Tjekker forbindelsen til databasen
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error); // Afslutter scriptet, hvis der er en forbindelsesfejl
}

// Sætter indholdstypen for responsen til JSON
header('Content-Type: application/json');

// Tjekker om anmodningen er en POST-anmodning
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Tjekker om de nødvendige POST-parametre er sat
    if (isset($_POST['PersonID'], $_POST['Navn'], $_POST['HoldID'], $_POST['Kode'])) {
        // Renser input for at undgå SQL-injection
        $PersonID = $conn->real_escape_string($_POST['PersonID']);
        $Navn = $conn->real_escape_string($_POST['Navn']);
        $HoldID = $conn->real_escape_string($_POST['HoldID']);
        $Kode = hash('sha256', $conn->real_escape_string($_POST['Kode'])); // Krypterer kode med SHA-256

        // Tjekker om Privilegier er sendt fra formularen, og sætter det til 'NULL' hvis det er tomt
        $Privilegier = ($_POST['Privilegier'] === '') ? 'NULL' : "'" . $conn->real_escape_string($_POST['Privilegier']) . "'";

        // SQL-sætning til at indsætte persondata i databasen
        $sql = "INSERT INTO Personer (PersonID, Navn, Privilegier, Kode) VALUES ('$PersonID', '$Navn', $Privilegier, '$Kode')";

        // Udfører SQL-sætningen
        if ($conn->query($sql) === TRUE) {
            // SQL-sætning til at indsætte HoldID i Personer_StudereRetninger tabellen
            $sqlStudereRetninger = "INSERT INTO Personer_StudereRetninger (PersonID, HoldID) VALUES ('$PersonID', '$HoldID')";
            if ($conn->query($sqlStudereRetninger) === TRUE) {
                echo json_encode(["message" => "Personen er blevet gemt."]); // Returnerer succesbesked som JSON
            } else {
                echo json_encode(["message" => "Fejl ved gemning af HoldID: " . $conn->error]); // Returnerer fejlbesked ved fejl i SQL-sætning
            }
        } else {
            echo json_encode(["message" => "Fejl ved gemning af person: " . $conn->error]); // Returnerer fejlbesked ved fejl i SQL-sætning
        }
    } else {
        echo json_encode(["message" => "Ufuldstændige oplysninger."]); // Returnerer fejlbesked hvis ikke alle nødvendige data er sendt
    }
} elseif (isset($_GET['action']) && $_GET['action'] == 'getHoldID') { // Tjekker om der er en GET-anmodning med action=getHoldID
    // SQL-sætning til at hente HoldID'er
    $sql = "SELECT HoldID FROM StudereRetninger";
    $result = $conn->query($sql);

    $holdIDs = array();
    if ($result->num_rows > 0) {
        // Tilføjer hver HoldID til et array
        while ($row = $result->fetch_assoc()) {
            $holdIDs[] = $row['HoldID'];
        }
        echo json_encode($holdIDs); // Returnerer HoldID'er som JSON
    } else {
        echo json_encode(["message" => "Ingen HoldID'er fundet."]); // Returnerer fejlbesked hvis ingen HoldID'er findes
    }
}
?>