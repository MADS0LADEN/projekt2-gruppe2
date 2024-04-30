function saveDevice() {
    var device_id = document.getElementById("device_id").value;
    var placement = document.getElementById("placement").value;

    // Validér om nødvendige felter er udfyldt
    if (device_id === '' || placement === '') {
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
            document.getElementById("device_id").value = "";
            document.getElementById("placement").value = "";
        }
    };

    // Send data til serveren
    var data = "device_id=" + encodeURIComponent(device_id) + "&placement=" + encodeURIComponent(placement);
    xhr.send(data);
}