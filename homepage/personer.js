$(document).ready(function () {
    // Hent HoldID'er fra StudereRetninger tabellen og tilføj dem til dropdown-menuen
    $.ajax({
        url: 'Personer.php?action=getHoldID', // Angiver URL'en til PHP-scriptet med en GET-parameter for handlingen
        type: 'GET', // Anvender GET-metoden til anmodningen
        dataType: 'json', // Forventer JSON-format som svar
        success: function (response) { // Funktion der kaldes ved succesfuld anmodning
            var holdIDSelect = $('#HoldID'); // Finder dropdown-menuen for HoldID
            response.forEach(function (HoldID) { // Itererer over hvert HoldID i svaret
                holdIDSelect.append('<option value="' + HoldID + '">' + HoldID + '</option>'); // Tilføjer HoldID som en option i dropdown-menuen
            });
        },
        error: function (xhr, status, error) { // Funktion der kaldes ved fejl i anmodningen
            console.error('Fejl ved hentning af HoldID:', error); // Logger fejlen til konsollen
        }
    });

    // Lyt efter ændringer i Privilegier dropdown
    $('#Privilegier').on('change', function () { // Tilføjer en event listener for ændringer på Privilegier dropdown
        var privilegierValue = $(this).val(); // Henter den valgte værdi fra dropdown-menuen
        if (privilegierValue === '0' || privilegierValue === '1') { // Tjekker om den valgte værdi er '0' eller '1'
            $('#Kode').show(); // Viser Kode inputfeltet
        } else {
            $('#Kode').hide(); // Skjuler Kode inputfeltet
        }
    });

    // Skjul Kode feltet som standard
    $('#Kode').hide(); // Skjuler Kode inputfeltet når siden indlæses

    // Lyt efter klik på gem-knappen
    $('#saveBtn').on('click', function () { // Tilføjer en event listener for klik på gem-knappen
        savePerson(); // Kalder funktionen savePerson når knappen klikkes
    });
});

// Gem person data via AJAX
function savePerson() {
    var PersonID = $('#PersonID').val(); // Henter værdien fra PersonID inputfeltet
    var Navn = $('#Navn').val(); // Henter værdien fra Navn inputfeltet
    var HoldID = $('#HoldID').val(); // Henter den valgte værdi fra HoldID dropdown-menuen
    var Privilegier = ($('#Privilegier').val() === '') ? null : $('#Privilegier').val(); // Henter den valgte værdi fra Privilegier dropdown-menuen, eller sætter den til null hvis ingen værdi er valgt
    var Kode = $('#Kode').val(); // Henter værdien fra Kode inputfeltet

    // Validering af inputfelterne
    if (PersonID === '' || Navn === '' || HoldID === '' || (Privilegier !== null && (Privilegier === '0' || Privilegier === '1') && Kode === '')) {
        $('#message').text('Alle felter skal udfyldes'); // Viser en fejlbesked hvis valideringen fejler
        return; // Afslutter funktionen tidligt hvis valideringen fejler
    }

    // Send data til PHP-scriptet for at gemme i databasen
    $.ajax({
        url: 'Personer.php', // Angiver URL'en til PHP-scriptet
        type: 'POST', // Anvender POST-metoden til anmodningen
        data: { // Data der sendes med anmodningen
            PersonID: PersonID,
            Navn: Navn,
            HoldID: HoldID,
            Privilegier: Privilegier,
            Kode: Kode
        },
        success: function (response) { // Funktion der kaldes ved succesfuld anmodning
            $('#message').text(response.message); // Viser serverens svarbesked
            $('#myForm')[0].reset(); // Nulstiller formen
            $('#Kode').hide(); // Skjuler Kode inputfeltet efter gemning
        },
        error: function (xhr, status, error) { // Funktion der kaldes ved fejl i anmodningen
            console.error('Fejl ved gemning af person:', error); // Logger fejlen til konsollen
        }
    });
}