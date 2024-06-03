$(document).ready(function() {
    loadTilstedeværelse();
});

function loadTilstedeværelse(sort = false) {
    $.ajax({
        url: 'fremmoede.php',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            let tbody = $('#FremmødeBody');
            tbody.empty();
            let studentRecords = data.map(item => ({
                Dato: item.Dato,
                Navn: item.Navn,
                Lokale: item.Lokale,
                Status: item.Status ? 'Mødt' : 'Ikke mødt',
                Tidspunkt: item.Tidspunkt
            }));

            if (sort) {
                studentRecords.sort((a, b) => {
                    if (a.Status === 'Mødt' && b.Status !== 'Mødt') return -1;
                    if (a.Status !== 'Mødt' && b.Status === 'Mødt') return 1;
                    return 0;
                });
            }

            studentRecords.forEach(record => {
                var row = $('<tr>');
                row.append($('<td>').text(record.Dato));
                row.append($('<td>').text(record.Navn));
                row.append($('<td>').text(record.Lokale));
                row.append($('<td>').text(record.Status));
                row.append($('<td>').text(record.Tidspunkt));
                tbody.append(row);
            });
        },
        error: function(xhr, status, error) {
            console.error(error);
        }
    });
}

function sortTilstedeværelse() {
    loadTilstedeværelse(true);
}

document.getElementById("prevBtn").addEventListener("click", function() {
    updateCalendarDate(-1);
});

document.getElementById("nextBtn").addEventListener("click", function() {
    updateCalendarDate(1);
});

function updateCalendarDate(change) {
    const VælgDato = document.getElementById('VælgDato');
    let currentDate = new Date(VælgDato.value);
    currentDate.setDate(currentDate.getDate() + change);
    VælgDato.valueAsDate = currentDate;
    loadTilstedeværelse();
}
