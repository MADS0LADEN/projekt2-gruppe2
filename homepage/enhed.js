document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("saveBtn").addEventListener("click", function(event) {
        event.preventDefault(); // Forhindrer standardform sendelse
        console.log("Button clicked!"); // Midlertidig fejlfinding: Kontrollerer, om begivenhedshandleren udløses
        saveDevice();
    });
});

function saveDevice() {
    var DeviceID = document.getElementById("DeviceID").value;
    var Lokale = document.getElementById("Lokale").value;

    // Validér om nødvendige felter er udfyldt
    if (DeviceID === '' || Lokale === '') {
        document.getElementById("message").innerHTML = "Alle felter skal udfyldes";
        return;
    }

    // Lav en AJAX-anmodning til PHP-filen
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "enhed.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // Vis serverens svar
            document.getElementById("message").innerHTML = xhr.responseText;

            // Refresher inputfelterne
            document.getElementById("DeviceID").value = "";
            document.getElementById("Lokale").value = "";
        }
    };

    // Send data til serveren
    var data = "DeviceID=" + encodeURIComponent(DeviceID) + "&Lokale=" + encodeURIComponent(Lokale);
    xhr.send(data);
}
