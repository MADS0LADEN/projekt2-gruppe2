$(document).ready(function () {
    // Hent HoldID'er fra StudereRetninger tabellen og tilføj dem til dropdown-menuen
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

    // Lyt efter ændringer i Privilegier dropdown
    $('#Privilegier').on('change', function () {
        var privilegierValue = $(this).val();
        if (privilegierValue === '0' || privilegierValue === '1') {
            $('#Kode').show(); // Vis Kode feltet
        } else {
            $('#Kode').hide(); // Skjul Kode feltet
        }
    });

    // Skjul Kode feltet som standard
    $('#Kode').hide();

    // Lyt efter klik på gem-knappen
    $('#saveBtn').on('click', function () {
        savePerson();
    });
});

// Gem person data via AJAX
function savePerson() {
    var PersonID = $('#PersonID').val();
    var Navn = $('#Navn').val();
    var HoldID = $('#HoldID').val();
    var Privilegier = ($('#Privilegier').val() === '') ? null : $('#Privilegier').val();
    var Kode = $('#Kode').val();

    // Validering af inputfelterne
    if (PersonID === '' || Navn === '' || HoldID === '' || (Privilegier !== null && (Privilegier === '0' || Privilegier === '1') && Kode === '')) {
        $('#message').text('Alle felter skal udfyldes');
        return;
    }

    // Send data til PHP-scriptet for at gemme i databasen
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
        success: function (response) {
            $('#message').text(response.message);
            $('#myForm')[0].reset();
            $('#Kode').hide(); // Skjul Kode feltet efter gemning
        },
        error: function (xhr, status, error) {
            console.error('Fejl ved gemning af person:', error);
        }
    });
}
