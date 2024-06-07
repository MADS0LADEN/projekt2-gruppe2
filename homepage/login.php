<?php
session_start();

// Tjek om anmodningsmetoden er POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Håndter kun POST-anmodninger
    if (isset($_POST['PersonID'], $_POST['Kode'])) {
        $PersonID = $_POST['PersonID'];
        $Kode = $_POST['Kode'];

        // Log modtaget data til fejlfinding
        error_log("Modtaget PersonID: $PersonID");

        // Databaseforbindelsesoplysninger
        $servername = "192.168.15.24";
        $username = "root";
        $password_db = "Dboa24!!";
        $dbname = "Projekt2";

        // Opret forbindelse til databasen
        $conn = new mysqli($servername, $username, $password_db, $dbname);

        // Tjek om forbindelsen fejlede
        if ($conn->connect_error) {
            error_log("Forbindelse mislykkedes: " . $conn->connect_error);
            echo json_encode(["status" => "error", "message" => "Forbindelse mislykkedes: " . $conn->connect_error]);
            exit();
        }

        // Hash den modtagne kode
        $hashed_Kode = hash('sha256', $Kode);

        // SQL forespørgsel for at finde brugeren
        $sql = "SELECT PersonID, Privilegier FROM Personer WHERE PersonID=? AND Kode=? LIMIT 1";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $PersonID, $hashed_Kode);
        $stmt->execute();
        $result = $stmt->get_result();
        
        // Tjek om brugeren blev fundet
        if ($result->num_rows == 1) {
            $row = $result->fetch_assoc();
            $_SESSION['PersonID'] = $row['PersonID'];
            $_SESSION['Privilegier'] = $row['Privilegier'];

            // Tjek brugerens privilegier
            if ($_SESSION['Privilegier'] === NULL) {
                echo json_encode(["status" => "error", "message" => "Elever kan ikke logge ind!"]);
                exit();
            } else if ($_SESSION['Privilegier'] == 0) {
                echo json_encode(["status" => "success", "redirect" => "fremmoede.html"]);
                exit();
            } else if ($_SESSION['Privilegier'] == 1) {
                echo json_encode(["status" => "success", "redirect" => "adminpage.html"]);
                exit();
            }
        } else {
            // Hvis legitimationsoplysningerne er ugyldige
            echo json_encode(["status" => "error", "message" => "Login mislykkedes: Ugyldige legitimationsoplysninger."]);
            exit();
        }

        // Luk databaseforbindelsen
        $conn->close();
    } else {
        // Håndter manglende legitimationsoplysninger
        echo json_encode(["status" => "error", "message" => "Login mislykkedes: Manglende legitimationsoplysninger."]);
        exit();
    }
} else {
    // Håndter ugyldig anmodningsmetode
    echo json_encode(["status" => "error", "message" => "Ugyldig anmodningsmetode."]);
    exit();
}
?>
