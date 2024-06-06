<?php
$servername = "192.168.15.24";
$username = "root";
$password = "Dboa24!!";
$dbname = "Projekt2";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Hent klasser fra StudereRetninger
    $sqlKlasse = "SELECT HoldNavn FROM StudereRetninger";
    $stmtKlasse = $conn->prepare($sqlKlasse);
    $stmtKlasse->execute();
    $klasser = $stmtKlasse->fetchAll(PDO::FETCH_COLUMN);

    // Hent studerende baseret på den valgte klasse, hvis en klasse er valgt
    $whereClause = '';
    if(isset($_GET['klasse']) && !empty($_GET['klasse'])) {
        $klasse = $_GET['klasse'];
        $whereClause = " WHERE sr.HoldNavn = '$klasse'";
    }

    // Hent studerende fra Personer baseret på klasse (hvis en klasse er valgt)
    $sqlStuderende = "SELECT p.Navn FROM Personer p 
                      INNER JOIN Personer_StudereRetninger psr ON p.PersonID = psr.PersonID
                      INNER JOIN StudereRetninger sr ON psr.HoldID = sr.HoldID" . $whereClause;
    $stmtStuderende = $conn->prepare($sqlStuderende);
    $stmtStuderende->execute();
    $studerende = $stmtStuderende->fetchAll(PDO::FETCH_COLUMN);

    // Hent registeringer kun for den valgte klasse
    $sqlRegisteringer = "
    SELECT 
        DATE(r.Dato) AS Dato,
        p.Navn,
        r.Status,
        TIME(r.Dato) AS Tidspunkt,
        d.Lokale
    FROM Registeringer r
    JOIN Kort k ON r.KortID = k.KortID
    JOIN Personer p ON k.PersonID = p.PersonID
    JOIN Devices d ON r.DeviceID = d.DeviceID
    JOIN Personer_StudereRetninger psr ON p.PersonID = psr.PersonID
    JOIN StudereRetninger sr ON psr.HoldID = sr.HoldID
    " . $whereClause . "
    ORDER BY STR_TO_DATE(Dato, '%Y-%m-%d') DESC, STR_TO_DATE(Tidspunkt, '%H:%i:%s') DESC, Navn ASC";
    $stmtRegisteringer = $conn->prepare($sqlRegisteringer);
    $stmtRegisteringer->execute();
    $registeringer = $stmtRegisteringer->fetchAll(PDO::FETCH_ASSOC);

    // Returner data som JSON
    echo json_encode(["klasser" => $klasser, "studerende" => $studerende, "registeringer" => $registeringer]);
} catch(PDOException $e) {
    echo json_encode(["error" => "Fejl ved hentning: " . $e->getMessage()]);
}
?>
