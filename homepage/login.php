<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['PersonID']) && isset($_POST['Kode'])) {
        $PersonID = $_POST['PersonID'];
        $Kode = $_POST['Kode'];

        //opretter forbindelse til databasen
        $servername = "host.docker";
        $username = "root";
        $password_db = "Dboa24!!";
        $dbname = "Projekt2";

        $conn = new mysqli($servername, $username, $password_db, $dbname);

        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        $PersonID = $conn->real_escape_string($PersonID);
        $Kode = $conn->real_escape_string($Kode);

        $hashed_Kode = hash('sha256', $Kode);

        // Fetch the user's privileges along with their details
        $sql = "SELECT * FROM Personer WHERE PersonID='$PersonID' AND Kode='$hashed_Kode'";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $_SESSION['user_id'] = $row['PersonID'];
            $_SESSION['Privilegier'] = $row['Privilegier']; // Fetching the 'Privilegier' from the database

            // Check the user's privileges and redirect them accordingly
            if ($_SESSION['Privilegier'] === NULL) {
                echo "Elever kan ikke logge ind!"; // giver en fejl meddelelse hvis en elev prøver at logge ind
                exit();
            } else if ($_SESSION['Privilegier'] == 0) {
                header("Location: forsiden.html"); // Redirect to the homepage for teachers
                exit();
            } else if ($_SESSION['Privilegier'] == 1) {
                header("Location: admin_page.html"); // Redirect to the admin page
                exit();
            }
        } else {
            header("Location: login_error.html"); // Redirect to a login error page
            exit();
        }

        $conn->close();
    }
}
?>