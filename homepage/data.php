<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Tjek for eksisterende session og hent brugeroplysninger
    if (isset($_SESSION['user_id'])) {
        $user_id = $_SESSION['user_id'];

        // Opret forbindelse til user_info for at få placement og device_id
        $servername = "79.171.148.172";
        $username = "remote_vand";
        $password_db = "Dboa24vand!";
        $dbname = "vandlog";

        $conn = new mysqli($servername, $username, $password_db, $dbname);

        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        // Hent placement og device_id baseret på user_id
        $sql_info = "SELECT placement, device_id FROM user_info WHERE user_id='$user_id'";
        $result_info = $conn->query($sql_info);

        if ($result_info->num_rows > 0) {
            $row_info = $result_info->fetch_assoc();
            $placement = $row_info['placement'];
            $device_id = $row_info['device_id'];

            // Opret forbindelse til tabel med samme navn som device_id
            $table_name = "data_table_" . $device_id;

            // Hent data baseret på enhed, startdato og slutdato (tilpas dette baseret på din databasestruktur)
            $sql_data = "SELECT * FROM $table_name";
            $result_data = $conn->query($sql_data);

            // Konverter resultatet til et JSON-format og send det til klienten
            if ($result_data) {
                $data = $result_data->fetch_all(MYSQLI_ASSOC);
                echo json_encode($data);
            } else {
                echo "Fejl ved hentning af data fra databasen";
            }
        } else {
            echo "Fejl ved hentning af placement og device_id";
        }

        $conn->close();
    }
}
?>
