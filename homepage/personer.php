<?php
// Opret forbindelse til databasen
$servername = "192.168.15.24";
$username = "root";
$password_db = "Dboa24!!";
$dbname = "Projekt2";

$conn = new mysqli($servername, $username, $password_db, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Håndter anmodninger
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['PersonID'], $_POST['Navn'], $_POST['HoldID'], $_POST['Kode'])) {
        $PersonID = $conn->real_escape_string($_POST['PersonID']);
        $Navn = $conn->real_escape_string($_POST['Navn']);
        $HoldID = $conn->real_escape_string($_POST['HoldID']);
        $Kode = hash('sha256', $conn->real_escape_string($_POST['Kode'])); // Krypter kode med SHA-256

        // Check om Privilegier er blevet sendt fra formularen
        $Privilegier = ($_POST['Privilegier'] === '') ? 'NULL' : "'" . $conn->real_escape_string($_POST['Privilegier']) . "'";

        $sql = "INSERT INTO Personer (PersonID, Navn, Privilegier, Kode) VALUES ('$PersonID', '$Navn', $Privilegier, '$Kode')";

        if ($conn->query($sql) === TRUE) {
            // Indsæt HoldID i Personer_StudereRetninger tabellen
            $sqlStudereRetninger = "INSERT INTO Personer_StudereRetninger (PersonID, HoldID) VALUES ('$PersonID', '$HoldID')";
            if ($conn->query($sqlStudereRetninger) === TRUE) {
                echo json_encode(["message" => "Personen er blevet gemt."]);
            } else {
                echo json_encode(["message" => "Fejl ved gemning af HoldID: " . $conn->error]);
            }
        } else {
            echo json_encode(["message" => "Fejl ved gemning af person: " . $conn->error]);
        }
    } else {
        echo json_encode(["message" => "Ufuldstændige oplysninger."]);
    }
} elseif (isset($_GET['action']) && $_GET['action'] == 'getHoldID') {
    $sql = "SELECT HoldID FROM StudereRetninger";
    $result = $conn->query($sql);

    $holdIDs = array();
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $holdIDs[] = $row['HoldID'];
        }
        echo json_encode($holdIDs);
    } else {
        echo json_encode(["message" => "Ingen HoldID'er fundet."]);
    }
}
?>
