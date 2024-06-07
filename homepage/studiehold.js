// Lytter efter at DOM'en (Document Object Model) er fuldt indlæst
document.addEventListener("DOMContentLoaded", function() {
    // Tilføjer en klik-hændelseslytter til knappen med id "saveBtn"
    document.getElementById("saveBtn").addEventListener("click", function(event) {
        event.preventDefault(); // Forhindrer standardform sendelse, så siden ikke genindlæses
        console.log("Button clicked!"); // Logger til konsollen for fejlfinding
        saveDevice(); // Kalder funktionen saveDevice
    });
});

// Funktionen saveDevice håndterer indsamling og afsendelse af data
function saveDevice() {
    // Henter værdierne fra inputfelterne med id'erne "HoldID" og "HoldNavn"
    var HoldID = document.getElementById("HoldID").value;
    var HoldNavn = document.getElementById("HoldNavn").value;

    // Tjekker om de nødvendige felter er udfyldt
    if (HoldID === '' || HoldNavn === '') {
        // Hvis et eller begge felter er tomme, vises en besked til brugeren
        document.getElementById("message").innerHTML = "Alle felter skal udfyldes";
        return; // Afslutter funktionen tidligt, hvis valideringen fejler
    }

    // Opretter en ny AJAX-anmodning
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "studiehold.php", true); // Konfigurerer anmodningen til at være en POST-anmodning til "studiehold.php"
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // Sætter indholdstypen for anmodningen

    // Definerer, hvad der skal ske, når anmodningens tilstand ændres
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // Når anmodningen er fuldført og serveren har svaret med status 200 (OK)
            document.getElementById("message").innerHTML = xhr.responseText; // Viser serverens svar i elementet med id "message"

            // Nulstiller inputfelterne
            document.getElementById("HoldID").value = "";
            document.getElementById("HoldNavn").value = "";
        }
    };

    // Forbereder data til at blive sendt med anmodningen
    var data = "HoldID=" + encodeURIComponent(HoldID) + "&HoldNavn=" + encodeURIComponent(HoldNavn);
    xhr.send(data); // Sender anmodningen med data til serveren
}