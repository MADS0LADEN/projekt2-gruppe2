$(document).ready(function() {
    // Skjul tabellen ved start
    $('#FremmødeBody').hide();

    var valgtKlasse = {};

    // Event listeners for dropdown-menuerne og datoen
    $('#VælgKlasse').on('change', function() {
        valgtKlasse = $(this).val();
        if (valgtKlasse !== '') {
            $('#FremmødeBody').show(); // Vis tabellen kun hvis en klasse er valgt
            fetchData();
        } else {
            $('#FremmødeBody').hide(); // Skjul tabellen hvis ingen klasse er valgt
        }
    });

    $('#VælgStuderende').on('change', function() {
        loadStudentAttendance();
    });

    $('#VælgDato').on('change', function() {
        fetchData(); // Kald fetchData, når datoen ændres
    });

    // Event listener for søgeknappen
    $('#SøgBtn').on('click', function() {
        søgElev();
    });

    // Initial kald for at hente data
    fetchData();

    // Funktion til at hente data og opdatere tabellen
    function fetchData() {
        var valgtDato = $('#VælgDato').val();
        var valgtKlasse = $('#VælgKlasse').val();
        var valgtStuderende = $('#VælgStuderende').val();

        // Tilføj en betingelse for at kontrollere, om en studerende er valgt
        var dataToSend = { Dato: valgtDato, klasse: valgtKlasse };
        if (valgtStuderende !== '') {
            dataToSend.studerende = valgtStuderende;
        }
        // AJAX-anmodning
        $.ajax({
            url: 'fremmoede.php',
            method: 'GET',
            dataType: 'json',
            data: dataToSend,
            success: function(data) {
                if (data.error) {
                    alert(data.error);
                    return;
                }

                // Opdater dropdown-menuen for klasser
                var selectKlasse = $('#VælgKlasse');
                selectKlasse.empty();
                selectKlasse.append('<option value="">Alle klasser</option>');
                $.each(data.klasser, function(index, klasse) {
                    selectKlasse.append('<option value="' + klasse + '">' + klasse + '</option>');
                });

                // Genvælg den tidligere valgte klasse
                selectKlasse.val(valgtKlasse);

                // Opdater dropdown-menuen for studerende kun hvis en klasse er valgt
                var selectStuderende = $('#VælgStuderende');
                selectStuderende.empty();
                selectStuderende.append('<option value="">Alle studerende</option>');
                if (valgtKlasse !== '') {
                    $.each(data.studerende, function(index, studerende) {
                        selectStuderende.append('<option value="' + studerende + '">' + studerende + '</option>');
                    });
                }
                // Genvælg den tidligere valgte studerende
                selectStuderende.val(valgtStuderende);

                // Vis registeringsdata i tabellen
                visRegisteringsdata(data.registeringer);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert('Fejl ved hentning af data: ' + textStatus);
            }
        });
    }

    // Funktion til at opdatere tabellen med registreringsdata
    function visRegisteringsdata(registeringer) {
        var tbody = $('#FremmødeBody');
        tbody.empty();

        $.each(registeringer, function(index, row) {
            var tr = $('<tr>');
            tr.append('<td>' + row.Dato + '</td>');
            tr.append('<td>' + row.Navn + '</td>');
            tr.append('<td>' + row.Lokale + '</td>');

            // Tilføj en celle til status med grønt flueben eller rødt kryds
            var statusCell = $('<td>');
            if (row.Status == 0) {
                statusCell.html('<span style="color: green;">&#x2714;</span>'); // Grønt flueben
            } else if (row.Status == 1) {
                statusCell.html('<span style="color: red;">&#x2716;</span>'); // Rødt kryds
            }
            tr.append(statusCell);

            tr.append('<td>' + row.Tidspunkt + '</td>');
            tbody.append(tr);
        });
    }

    // Event listeners for pilene
    $('#prevBtn').on('click', function() {
        skiftDato(-1); // Skift til forrige dag
    });

    $('#nextBtn').on('click', function() {
        skiftDato(1); // Skift til næste dag
    });

    function skiftDato(ændring) {
        var valgtDato = new Date($('#VælgDato').val());
        valgtDato.setDate(valgtDato.getDate() + ændring);
        $('#VælgDato').val(valgtDato.toISOString().split('T')[0]);
        fetchData(); // Kald fetchData, når datoen ændres
    }

    // Funktion til at søge efter en elev og vise information
    function søgElev() {
        var elevNavn = $('#SøgElev').val().toLowerCase();
        var valgtDato = $('#VælgDato').val();
        var valgtKlasse = $('#VælgKlasse').val();

        if (elevNavn === '') {
            alert('Indtast venligst et elevnavn.');
            return;
        }

        var dataToSend = { Dato: valgtDato, klasse: valgtKlasse, studerende: elevNavn };

        $.ajax({
            url: 'fremmoede.php',
            method: 'GET',
            dataType: 'json',
            data: dataToSend,
            success: function(data) {
                if (data.error) {
                    alert(data.error);
                    return;
                }

                // Filtrer registeringsdata for den søgte elev
                var filteredData = data.registeringer.filter(function(row) {
                    return row.Navn.toLowerCase() === elevNavn;
                });

                if (filteredData.length > 0) {
                    visRegisteringsdata(filteredData);
                } else {
                    alert('Ingen data fundet for denne elev.');
                    $('#FremmødeBody').empty();
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert('Fejl ved hentning af data: ' + textStatus);
            }
        });
    }

    // Funktion til at indlæse tilstedeværelse for valgt dato og klasse
    function loadStudentAttendance() {
        var valgtDato = $('#VælgDato').val();
        var valgtKlasse = $('#VælgKlasse').val();
        var valgtStuderende = $('#VælgStuderende').val();

        var dataToSend = { Dato: valgtDato, klasse: valgtKlasse, studerende: valgtStuderende };

        $.ajax({
            url: 'fremmoede.php',
            method: 'GET',
            dataType: 'json',
            data: dataToSend,
            success: function(data) {
                if (data.error) {
                    alert(data.error);
                    return;
                }

                // Vis registeringsdata for den valgte studerende
                visRegisteringsdata(data.registeringer);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert('Fejl ved hentning af data: ' + textStatus);
            }
        });
    }
});
