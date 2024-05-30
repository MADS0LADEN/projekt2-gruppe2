<?php
session_start();
session_unset(); // fjerner alle session variabler
session_destroy(); // ødelægger sessionen

header("Location: index.html"); // omdirigerer brugeren til login siden
exit();
?>