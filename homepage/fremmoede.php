<?php
session_start();

/*if ($_SERVER["REQUEST_METHOD"] == "GET") {
    // Tjek om brugeren er logget ind
    if (!isset($_SESSION['user_id'])) {
        header('Content-Type: application/json');
        echo json_encode(["error" => "Brugeren er ikke logget ind."]);
        exit();
    }*/

    // Opretter forbindelse til databasen
    $servername = "adjms.sof60.dk";
    $username = "root";
    $password_db = "Dboa24!!";
    $dbname = "Projekt2";
    $port = "3200";

    // Opret forbindelse
    $conn = new mysqli($servername, $username, $password_db, $dbname, $port);

    // Tjek forbindelsen
    if ($conn->connect_error) {
        header('Content-Type: application/json');
        echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
        exit();
    }
    
    // SQL til at hente klasser
    $sql_klasse = "SELECT HoldNavn FROM StudereRetninger";
    $result_klasse = $conn->query($sql_klasse);

    if ($result_klasse->num_rows > 0) {
    // Output data for hver række
    while($row = $result_klasse->fetch_assoc()) {
        echo "<option value='".$row["HoldNavn"]."'>".$row["HoldNavn"]."</option>";
    }
    } else {
    echo "0 resultater";
    }

    // SQL til at hente studerende
    $sql_studerende = "SELECT Navn FROM Personer JOIN Personer_StudereRetninger ON Personer.PersonID = Personer_StudereRetninger.PersonID";
    $result_studerende = $conn->query($sql_studerende);

    if ($result_studerende->num_rows > 0) {
    // Output data for hver række
    while($row = $result_studerende->fetch_assoc()) {
        echo "<option value='".$row["Navn"]."'>".$row["Navn"]."</option>";
    }
    } else {
    echo "0 resultater";
    }

    $sql = "SELECT Reg.Dato, Per.Navn, Dev.Lokale, Reg.Status, DATE_FORMAT(Reg.Dato, '%H:%i') AS Tidspunkt
            FROM Registeringer Reg
            JOIN Personer Per ON Reg.PersonID = Per.PersonID
            JOIN Devices Dev ON Reg.DeviceID = Dev.DeviceID";
    
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

?>
