<?php
session_start();

// Tjek om brugeren er logget ind
if (!isset($_SESSION['PersonID'])) {
    header('Location: https://adjms.sof60.dk/login.php');
    exit();
}

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
    if (isset($_POST['PersonID'], $_POST['Navn'], $_POST['HoldID'], $_POST['Privilegier'], $_POST['Kode'])) {
        $PersonID = $conn->real_escape_string($_POST['PersonID']);
        $Navn = $conn->real_escape_string($_POST['Navn']);
        $HoldID = $conn->real_escape_string($_POST['HoldID']);
        $Privilegier = $conn->real_escape_string($_POST['Privilegier']);
        $Kode = $conn->real_escape_string($_POST['Kode']);

        $sqlPerson = "INSERT INTO Personer (PersonID, Navn, Privilegier, Kode) VALUES ('$PersonID', '$Navn', '$Privilegier', '$Kode')";
        $sqlStudereRetninger = "INSERT INTO Personer_StudereRetninger (PersonID, HoldID) VALUES ('$PersonID', '$HoldID')";

        if ($conn->query($sqlPerson) === TRUE && $conn->query($sqlStudereRetninger) === TRUE) {
            echo json_encode(["message" => "Personen er blevet gemt."]);
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
    }
    echo json_encode($holdIDs);
} else {
    echo json_encode(["message" => "Ugyldig anmodning."]);
}

$conn->close();
?>
