<?php
// Start session
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Tjek om brugeren er logget ind
    if (!isset($_SESSION['user_id'])) {
        echo "Brugeren er ikke logget ind.";
        exit();
    }
}    
// Hent enhedsoplysninger fra POST-anmodningen#
$user_id = $_SESSION['user_id'];

// Databaseforbindelsesoplysninger
$servername = "79.171.148.172";
$username = "remote_vand";
$password_db = "Dboa24vand!";
$dbname = "vandlog";

// Opret forbindelse til databasen
$conn = new mysqli($servername, $username, $password_db, $dbname);

// Tjek for forbindelsesfejl
if ($conn->connect_error) {
    die("Databaseforbindelse mislykkedes: " . $conn->connect_error);
}

try {
    // Håndter POST-anmodning
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        if (isset($_POST['action'])) {
            if ($_POST['action'] === 'fetchDevices') {
                $sql = "SELECT DISTINCT device_id, placement FROM user_info WHERE user_id=$user_id";
                $result = $conn->query($sql);
                if ($result) {
                    $devices = array();
                
                    // Fetch data and store in an associative array
                    while ($row = $result->fetch_assoc()) {
                        $devices[] = array(
                            'id' => $row['device_id'],
                            'placement' => $row['placement']
                        );
                    }
                
                    // Return the JSON response
                    echo json_encode($devices);
                } else {
                    echo "Fejl ved hentning af enheder: " . $conn->error;
                }
            }
            // Hent grafdata eller rådata for en bestemt enhed
            elseif ($_POST['action'] === 'fetchGrafData' || $_POST['action'] === 'fetchRawData') {
                $device_id = $conn->real_escape_string($_POST['device_id']);

                // Tjek om enheden eksisterer i user_info tabellen
                $stmt = $conn->prepare("SELECT device_id FROM user_info WHERE device_id = ?");
                $stmt->bind_param("s", $device_id);
                $stmt->execute();
                $result = $stmt->get_result();

                if ($result->num_rows > 0) {
                    $user_info = $device_id;

                    // Hent grafdata! 
                    if ($_POST['action'] === 'fetchGrafData') {
                        $grafData = fetchGrafData($conn, $device_id);
                        $jsonGrafData = json_encode($grafData);

                        if ($jsonGrafData === false) {
                            // Håndter JSON-kodningsfejl
                            echo "Fejl ved JSON-kodning af grafdata: " . json_last_error_msg();
                        } else {
                            echo $jsonGrafData;
                        }
                    } elseif ($_POST['action'] === 'fetchRawData') {
                        $rawData = fetchRawData($conn, $device_id);
                        $jsonRawData = json_encode($rawData);

                        if ($jsonRawData === false) {
                            // Håndter JSON-kodningsfejl
                            echo "Fejl ved JSON-kodning af rå data: " . json_last_error_msg();
                        } else {
                            echo $jsonRawData;
                        }
                    }
                } else {
                    echo "Ingen enhed fundet med det angivne device_id: $device_id";
                }
            }
        }
    }
} catch (Exception $e) {
    echo "Fejl: " . $e->getMessage();
}


// Funktion til at hente rådata fra en tabel
function fetchRawData($conn, $device_id) {
    $sql = "SELECT Dato, Temperatur_Pipe, Temperatur_Rum, TempDiff FROM `$device_id`";
    $result = $conn->query($sql);

    $rawData = array();

    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $rawData[] = array_map('htmlspecialchars', $row);
        }
    } else {
       echo "Fejl ved hentning af rå data fra tabel $device_id: " . $conn->error;
    }

    // Returner JSON-formateret data
    return json_encode($rawData);
}


// Funktion til at hente rådata fra en tabel
function fetchGrafData($conn, $device_id) {
    $sql = "SELECT Dato, TempDiff FROM `$device_id`";
    $result = $conn->query($sql);

    $rawData = array();

    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $rawData[] = array_map('htmlspecialchars', $row);
        }
    } else {
       echo "Fejl ved hentning af rå data fra tabel $device_id: " . $conn->error;
    }

    // Returner JSON-formateret data
    return json_encode($rawData);
}

// Luk databaseforbindelsen
$conn->close();
?>
