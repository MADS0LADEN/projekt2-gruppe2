<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['email']) && isset($_POST['password'])) {
        $email = $_POST['email'];
        $password = $_POST['password'];

        //opretter forbindelse til databasen
        $servername = "79.171.148.172";
        $username = "remote_vand";
        $password_db = "Dboa24vand!";
        $dbname = "vandlog";

        $conn = new mysqli($servername, $username, $password_db, $dbname);

        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        $email = $conn->real_escape_string($email);
        $password = $conn->real_escape_string($password);

        $hashed_password = hash('sha256', $password);

        $sql = "SELECT * FROM user_list WHERE email='$email' AND password='$hashed_password'";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            // Brugeren er godkendt, omdiriger som før
            $row = $result->fetch_assoc();
            $_SESSION['user_id'] = $row['user_id'];
            $_SESSION['email'] = $row['email'];
            echo "Godkendt";
            exit();
        } else {
            echo "Fejl i mail eller kodeord.";
        }

        $conn->close();
    }
}
?>