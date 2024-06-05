$(document).ready(function () {
    $.ajax({
        url: 'Personer.php?action=getHoldID',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            var holdIDSelect = $('#HoldID');
            response.forEach(function (HoldID) {
                holdIDSelect.append('<option value="' + HoldID + '">' + HoldID + '</option>');
            });
        },
        error: function (xhr, status, error) {
            console.error('Fejl ved hentning af HoldID:', error);
        }
    });

    $('#saveBtn').on('click', function() {
        saveDevice();
    });
});

function saveDevice() {
    var PersonID = document.getElementById("PersonID").value;
    var Navn = document.getElementById("Navn").value;
    var HoldID = document.getElementById("HoldID").value;
    var Privilegier = document.getElementById("Privilegier").value;
    var Kode = document.getElementById("Kode").value;

    if (PersonID === '' || Navn === '') {
        document.getElementById("message").innerHTML = "Alle felter skal udfyldes";
        return;
    }

    $.ajax({
        url: 'Personer.php',
        type: 'POST',
        data: {
            PersonID: PersonID,
            Navn: Navn,
            HoldID: HoldID,
            Privilegier: Privilegier,
            Kode: Kode
        },
        success: function(response) {
            document.getElementById("message").innerHTML = response.message;
            $('#myForm')[0].reset();
        },
        error: function(xhr, status, error) {
            console.error('Fejl ved gemning af person:', error);
        }
    });
}
