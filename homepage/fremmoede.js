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
                /*Status: currentClass.attendance[VælgDato] ? currentClass.attendance[VælgDato][student.Navn].status : "ikkemødt",
                Tidspunkt: currentClass.attendance[VælgDato] ? currentClass.attendance[VælgDato][student.Navn].time : ""*/
        
            }));
    
            // Sortér studerendeposter så de mødt kommer først, hvis sort er sand
            if (sort) {
                studentRecords.sort((a, b) => {
                    if (a.Status === 'mødt' && b.Status !== 'mødt') return -1;
                    if (a.Status !== 'mødt' && b.Status === 'mødt') return 1;
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

// Funktion til at indlæse tilstedeværelse for valgt dato og klasse
function loadTilstedeværelse(sort = false) {
    const VælgKlasse = document.getElementById('VælgKlasse').value;
    const VælgDato = document.getElementById('VælgDato').value;
    if (!VælgDato || !VælgKlasse) return;

    const currentClass = classData[VælgKlasse];
    const tableBody = document.getElementById('FremmødeBody');
    tableBody.innerHTML = '';
    
    // Opret rækker i tabellen for hver studerende
    studentRecords.forEach(record => {
        const row = document.createElement('tr');
        
        // Opret celle til dato
        const Dato = document.createElement('td');
        Dato.textContent = record.Dato;
        row.appendChild(Dato);
        
        // Opret celle til studerendenavn
        const Navn = document.createElement('td');
        Navn.textContent = record.Navn;
        row.appendChild(Navn);
        
        // Opret celle til lokale nummer
        const Lokale = document.createElement('td');
        Lokale.textContent = record.Lokale;
        row.appendChild(Lokale);
        
        // Opret celle til status (enten mødt eller ikkemødt)
        const Status = document.createElement('td');
        const statusIcon = document.createElement('span');
        statusIcon.className = 'status';
        statusIcon.innerHTML = record.Status === 'mødt' ? '&#x2714;' : '&#x2716;'; // Flueben eller kryds
        statusIcon.className = record.Status === 'mødt' ? 'status mødt' : 'status ikkemødt';
        statusIcon.onclick = () => updateTilstedeværelse(VælgKlasse, VælgDato, record.Navn, record.Status === 'mødt' ? 'ikkemødt' : 'mødt');
        Status.appendChild(statusIcon);
        row.appendChild(Status);
        
        // Opret celle til tidspunkt
        const Tidspunkt = document.createElement('td');
        Tidspunkt.textContent = record.Tidspunkt;
        row.appendChild(Tidspunkt);
        tableBody.appendChild(row); });

        // Opdater studerendevælgeren med studerendeerne fra den valgte klasse
        const VælgStuderende = document.getElementById('VælgStuderende');
        VælgStuderende.innerHTML = '<option value="">Vælg studerende</option>';
        currentClass.students.forEach(student => {
        const option = document.createElement('option');
        option.value = student.Navn;
        option.textContent = student.Navn;
        VælgStuderende.appendChild(option);});
}

// Funktion til at opdatere tilstedeværelse for en studerende i en bestemt klasse og dato
function updateTilstedeværelse(HoldID, Dato, Navn, Status) {
    const currentTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    if (!classData[HoldID].attendance[Dato]) {
        classData[HoldID].attendance[Dato] = {};}
    classData[HoldID].attendance[Dato][Navn] = {
        status: Status,
        time: Status === 'mødt' ? currentTime : "",
        lokale: classData[HoldID].students.find(s => s.Navn === Navn).Lokale 
    };

    // Genindlæs tilstedeværelsesdata for at opdatere visuelle indikatorer
    loadTilstedeværelse();
    console.log(classData); // For debugging purposes
}

// Funktion til at sortere tilstedeværelseslisten
function sortTilstedeværelse() {
    loadTilstedeværelse(true); // Genindlæs og sorter
}

// Funktion til at indlæse fremmødedetaljer for valgt studerende
function loadStudentAttendance() {
    const VælgKlasse = document.getElementById('VælgKlasse').value;
    const VælgStuderende = document.getElementById('VælgStuderende').value;
    if (!VælgStuderende || !VælgKlasse) return;

    const currentClass = classData[VælgKlasse];
    const tableBody = document.getElementById('FremmødeBody');
    tableBody.innerHTML = '';
}

// Tilføj eventlisteners til pilene for at ændre dato
document.getElementById("prevBtn").addEventListener("click", function() {
    updateCalendarDate(-1);
});

document.getElementById("nextBtn").addEventListener("click", function() {
    updateCalendarDate(1);
});

// Funktion til at opdatere kalenderdatoen
function updateCalendarDate(change) {
    const VælgDato = document.getElementById('VælgDato');
    let currentDate = new Date(VælgDato.value);
    currentDate.setDate(currentDate.getDate() + change);
    VælgDato.valueAsDate = currentDate;
    loadTilstedeværelse();
}
