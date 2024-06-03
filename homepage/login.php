<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Håndter kun POST-anmodninger
    if (isset($_POST['PersonID'], $_POST['Kode'])) {
        $PersonID = $_POST['PersonID'];
        $Kode = $_POST['Kode'];

        // Log received data for debugging
        error_log("Received PersonID: $PersonID");

        $servername = "192.168.15.24";
        $username = "root";
        $password_db = "Dboa24!!";
        $dbname = "Projekt2";

        $conn = new mysqli($servername, $username, $password_db, $dbname);

        if ($conn->connect_error) {
            error_log("Connection failed: " . $conn->connect_error);
            echo json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]);
            exit();
        }

        $hashed_Kode = hash('sha256', $Kode);

        $sql = "SELECT PersonID, Privilegier FROM Personer WHERE PersonID=? AND Kode=? LIMIT 1";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $PersonID, $hashed_Kode);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows == 1) {
            $row = $result->fetch_assoc();
            $_SESSION['PersonID'] = $row['PersonID'];
            $_SESSION['Privilegier'] = $row['Privilegier'];

            if ($_SESSION['Privilegier'] === NULL) {
                echo json_encode(["status" => "error", "message" => "Elever kan ikke logge ind!"]);
                exit();
            } else if ($_SESSION['Privilegier'] == 0) {
                echo json_encode(["status" => "success", "redirect" => "fremmøde.html"]);
                exit();
            } else if ($_SESSION['Privilegier'] == 1) {
                echo json_encode(["status" => "success", "redirect" => "adminpage.html"]);
                exit();
            }
        } else {
            echo json_encode(["status" => "error", "message" => "Login failed: Invalid credentials."]);
            exit();
        }

        $conn->close();
    } else {
        // Håndter manglende legitimationsoplysninger
        echo json_encode(["status" => "error", "message" => "Login failed: Missing credentials."]);
        exit();
    }
} else {
    // Håndter ugyldig anmodningsmetode
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
    exit();
}
?>
