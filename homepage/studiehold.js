document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("saveBtn").addEventListener("click", function(event) {
        event.preventDefault(); // Forhindrer standardform sendelse
        console.log("Button clicked!"); // Midlertidig fejlfinding: Kontrollerer, om begivenhedshandleren udløses
        saveDevice();
    });
});

function saveDevice() {
    var HoldID = document.getElementById("HoldID").value;
    var HoldNavn = document.getElementById("HoldNavn").value;

    // Validér om nødvendige felter er udfyldt
    if (HoldID === '' || HoldNavn === '') {
        document.getElementById("message").innerHTML = "Alle felter skal udfyldes";
        return;
    }

    // Lav en AJAX-anmodning til PHP-filen
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "studiehold.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // Vis serverens svar
            document.getElementById("message").innerHTML = xhr.responseText;

            // Refresher inputfelterne
            document.getElementById("HoldID").value = "";
            document.getElementById("HoldNavn").value = "";
        }
    };

    // Send data til serveren
    var data = "HoldID=" + encodeURIComponent(HoldID) + "&HoldNavn=" + encodeURIComponent(HoldNavn);
    xhr.send(data);
}
