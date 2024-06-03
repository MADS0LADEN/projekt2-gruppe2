<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    // Tjek om brugeren er logget ind
    if (!isset($_SESSION['user_id'])) {
        header('Content-Type: application/json');
        echo json_encode(["error" => "Brugeren er ikke logget ind."]);
        exit();
    }

    // Opretter forbindelse til databasen
    $servername = "192.168.15.24";
    $username = "root";
    $password_db = "Dboa24!!";
    $dbname = "Projekt2";

    // Opret forbindelse
    $conn = new mysqli($servername, $username, $password_db, $dbname);

    // Tjek forbindelsen
    if ($conn->connect_error) {
        header('Content-Type: application/json');
        echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
        exit();
    }

    $sql = "SELECT Registreringer.Dato, Personer.Navn, Registreringer.Lokale, Registreringer.Status, DATE_FORMAT(Registreringer.Dato, '%H:%i') AS Tidspunkt
            FROM Registreringer 
            JOIN Personer_StudereRetninger ON Registreringer.PersonID = Personer_StudereRetninger.PersonID
            JOIN Personer ON Personer_StudereRetninger.PersonID = Personer.PersonID";
    
    $result = $conn->query($sql);
    
    $data = [];
    if ($result->num_rows > 0) {
        // Output data for hver række
        while($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
    } else {
        header('Content-Type: application/json');
        echo json_encode(["error" => "0 resultater"]);
        exit();
    }
    
    $conn->close();
    
    header('Content-Type: application/json');
    echo json_encode($data);
}
?>
