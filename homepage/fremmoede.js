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
        sortTilstedeværelse();
    });

    $('#VælgDato').on('change', function() {
        fetchData(); // Kald fetchData, når datoen ændres
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
            tr.append('<td>' + row.Status + '</td>');
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

    // Funktion til at indlæse tilstedeværelse for valgt dato og klasse
    function loadTilstedeværelse(sort = false) {
        const valgtKlasse = $('#VælgKlasse option:selected').text();
        const Dato = $('#VælgDato').val();
        if (!Dato || !valgtKlasse) return;

        const tableBody = $('#FremmødeBody');
        tableBody.empty();

        // Tilføj en betingelse for at sikre, at valgtKlasse er defineret og har students
        if (valgtKlasse && valgtKlasse.students) {

            // Opret en liste af studerendeposter med deres status
            let studentRecords = valgtKlasse.students.map(student => ({
                date: Dato,
                name: student.Navn,
                lokale: student.Lokale,
                status: student.Status,
                time: student.Tidspunkt,
            }));

            // Sortér studerendeposter så de mødt kommer først, hvis sort er sand
            if (sort) {
                studentRecords.sort((a, b) => {
                    if (a.status === 'mødt' && b.status !== 'mødt') return -1;
                    if (a.status !== 'mødt' && b.status === 'mødt') return 1;
                    return 0;
                });
            }

            // Opret rækker i tabellen for hver studerende
            studentRecords.forEach(record => {
                const row = $('<tr>');

                // Opret celle til dato
                const DatoCell = $('<td>').text(record.date);
                row.append(DatoCell);

                // Opret celle til studerendenavn
                const NavnCell = $('<td>').text(record.name);
                row.append(NavnCell);

                // Opret celle til lokale nummer
                const LokaleCell = $('<td>').text(record.lokale);
                row.append(LokaleCell);

                // Opret celle til status (enten mødt eller ikkemødt)
                const StatusCell = $('<td>');
                const statusIcon = $('<span>').addClass('status').html(record.status === 'mødt' ? '&#x2714;' : '&#x2716;');
                statusIcon.addClass(record.status === 'mødt' ? 'status mødt' : 'status ikkemødt');
                statusIcon.click(() => updateTilstedeværelse(VælgKlasse, Dato, record.name, record.status === 'mødt' ? 'ikkemødt' : 'mødt'));
                StatusCell.append(statusIcon);
                row.append(StatusCell);

                // Opret celle til tidspunkt
                const TidspunktCell = $('<td>').text(record.time);
                row.append(TidspunktCell);

                tableBody.append(row);
            });

            // Opdater studerendevælgeren med studerendeerne fra den valgte klasse
            const VælgStuderende = $('#VælgStuderende');
            VælgStuderende.empty();
            VælgStuderende.append('<option value="">Vælg studerende</option>');
            valgtKlasse.students.forEach(student => {
                const option = $('<option>').val(student.Navn).text(student.Navn);
                VælgStuderende.append(option);
            });
        }
    }

    // Funktion til at opdatere tilstedeværelse for en studerende i en bestemt klasse og dato
    function updateTilstedeværelse(valgtKlasse, Dato, valgtStuderende, Status) {
        const currentTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
        if (!valgtKlasse[klasse].attendance[Dato]) {
            valgtKlasse[klasse].attendance[Dato] = {};
        }
        valgtKlasse[klasse].attendance[Dato][studerende] = {
            status: Status,
            time: Status === 'mødt' ? currentTime : "",
            lokale: valgtKlasse[klasse].students.find(s => s.Navn === valgtStuderende).Lokale
        };

        console.log(valgtKlasse); // For debugging purposes
    }

    // Funktion til at sortere tilstedeværelseslisten
    function sortTilstedeværelse() {
        loadTilstedeværelse(true); // Genindlæs og sorter
    }

    // Funktion til at indlæse tilstedeværelse for valgt dato, klasse og studerende
    function loadStudentAttendance() {
        const valgtKlasse = $('#VælgKlasse').val();
        const valgtStuderende = $('#VælgStuderende').val();
        const valgtDato = $('#VælgDato').val();
        
        if (!valgtKlasse || !valgtStuderende || !valgtDato) return;
        
        $.ajax({
            url: 'fremmoede.php',
            method: 'GET',
            dataType: 'json',
            data: { klasse: valgtKlasse, studerende: valgtStuderende, Dato: valgtDato },
            success: function(data) {
                if (data.error) {
                    alert(data.error);
                    return;
                }

                // Opdater tabellen med den valgte studerendes tilstedeværelse
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
            tr.append('<td>' + row.Status + '</td>');
            tr.append('<td>' + row.Tidspunkt + '</td>');
            tbody.append(tr);
        });
    }

    // Event listener for ændring i den valgte studerende
    $('#VælgStuderende').on('change', function() {
        loadStudentAttendance();
    });

    $(document).ready(function() {
        var Admin = true; // Skift dette til den logik, der bestemmer, om brugeren er logget ind som admin eller ej
    
        // Vis tilbageknap, hvis brugeren er logget ind som admin
        if (Admin) {
            $('#tilbageBtn').show();
        }
    
        // Event listener for tilbageknap
        $('#tilbageBtn').on('click', function() {
            // Omdiriger brugeren til admin-siden
            window.location.href = 'adminpage.html'; // Erstat 'adminpage.php' med den faktiske URL til din admin-side
        });
    
        // Resten af din eksisterende kode...
    });
    

});
