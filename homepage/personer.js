function saveDevice() {
    var ID = document.getElementById("ID").value;
    var Navn = document.getElementById("Navn").value;
    var Kode = document.getElementById("Kode").value;

    // Validér om nødvendige felter er udfyldt
    if (ID === '' || Navn === '' || Kode === '') {
        document.getElementById("message").innerHTML = "Alle felter skal udfyldes";
        return;
    }

    // Lav en AJAX-anmodning til PHP-filen
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "Personer.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // Vis serverens svar
            document.getElementById("message").innerHTML = xhr.responseText;

            // Refresher inputfelterne
            document.getElementById("ID").value = "";
            document.getElementById("Navn").value = "";
            document.getElementById("Kode").value = "";
        }
    };

    // Send data til serveren
    var data = "ID=" + encodeURIComponent(ID) + "&Navn=" + encodeURIComponent(Navn) + "&Kode=" + encodeURIComponent(Kode);
    xhr.send(data);
}