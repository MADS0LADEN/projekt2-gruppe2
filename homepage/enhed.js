// Tilføjer en event listener, der venter på at DOM'en er fuldt indlæst
document.addEventListener("DOMContentLoaded", function() {
    // Når DOM'en er indlæst, tilføjes en event listener til "saveBtn" knappen, der reagerer på klik
    document.getElementById("saveBtn").addEventListener("click", function(event) {
        event.preventDefault(); // Forhindrer standard handlingen for en knap i et formular (at sende formularen)
        console.log("Button clicked!"); // Logger til konsollen for fejlfinding
        saveDevice(); // Kalder funktionen saveDevice, når knappen klikkes
    });
});

// Funktionen saveDevice håndterer logikken for at gemme en enhed
function saveDevice() {
    // Henter værdierne fra inputfelterne med ID'erne "DeviceID" og "Lokale"
    var DeviceID = document.getElementById("DeviceID").value;
    var Lokale = document.getElementById("Lokale").value;

    // Tjekker om de nødvendige felter er udfyldt
    if (DeviceID === '' || Lokale === '') {
        // Hvis ikke, vises en besked til brugeren
        document.getElementById("message").innerHTML = "Alle felter skal udfyldes";
        return; // Afslutter funktionen tidligt, hvis felterne ikke er udfyldt
    }

    // Opretter en ny AJAX-anmodning
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "enhed.php", true); // Konfigurerer anmodningen til at være en POST-anmodning til "enhed.php"
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // Sætter indholdstypen for anmodningen

    // Definerer hvad der skal ske, når serverens svar modtages
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // Opdaterer elementet med ID "message" med svaret fra serveren
            document.getElementById("message").innerHTML = xhr.responseText;

            // Nulstiller inputfelterne
            document.getElementById("DeviceID").value = "";
            document.getElementById("Lokale").value = "";
        }
    };

    // Forbereder dataene, der skal sendes med anmodningen
    var data = "DeviceID=" + encodeURIComponent(DeviceID) + "&Lokale=" + encodeURIComponent(Lokale);
    xhr.send(data); // Sender anmodningen med dataene til serveren
}