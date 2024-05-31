$.ajax({
    url: 'fremmøde.php',
    type: 'GET',
    dataType: 'json',
    success: function(data) {
      var tableBody = $('#FremmødeBody');
      tableBody.empty();
      data.forEach(function(item) {
        var row = $('<tr>');
        row.append($('<td>').text(item.Dato));
        row.append($('<td>').text(item.Navn));
        row.append($('<td>').text(item.Lokale));
        row.append($('<td>').text(item.Status ? 'Mødt' : 'Ikke mødt'));
        row.append($('<td>').text(item.Tidspunkt));
        tableBody.append(row);
      });
    },
    error: function(xhr, status, error) {
      console.error(error);
    }
});

// Funktion til at indlæse tilstedeværelse for valgt dato og klasse
function loadTilstedeværelse(sort = false) {
    const classPicker = document.getElementById('VælgKlasse').value;
    const date = document.getElementById('VælgDato').value;
    if (!date || !classPicker) return;

    const currentClass = classData[classPicker];
    const tableBody = document.getElementById('FremmødeBody');
    tableBody.innerHTML = '';

    // Opret en liste af studerendeposter med deres status
    let studentRecords = currentClass.students.map(student => ({
        date: date,
        name: student.name,
        lokale: student.lokale,
        status: currentClass.attendance[date] ? currentClass.attendance[date][student.name].status : "ikkemødt",
        time: currentClass.attendance[date] ? currentClass.attendance[date][student.name].time : ""
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
        const row = document.createElement('tr');
        
        // Opret celle til dato
        const dateCell = document.createElement('td');
        dateCell.textContent = record.date;
        row.appendChild(dateCell);
        
        // Opret celle til studerendenavn
        const nameCell = document.createElement('td');
        nameCell.textContent = record.name;
        row.appendChild(nameCell);

        // Opret celle til lokale nummer
        const lokaleCell = document.createElement('td');
        lokaleCell.textContent = record.lokale;
        row.appendChild(lokaleCell);

        // Opret celle til status (enten mødt eller ikkemødt)
        const statusCell = document.createElement('td');
        const statusIcon = document.createElement('span');
        statusIcon.className = 'status';
        statusIcon.innerHTML = record.status === 'mødt' ? '&#x2714;' : '&#x2716;'; // Flueben eller kryds
        statusIcon.className = record.status === 'mødt' ? 'status mødt' : 'status ikkemødt';
        statusIcon.onclick = () => updateTilstedeværelse(classPicker, date, record.name, record.status === 'mødt' ? 'ikkemødt' : 'mødt');
        statusCell.appendChild(statusIcon);
        row.appendChild(statusCell);

        // Opret celle til tidspunkt
        const timeCell = document.createElement('td');
        timeCell.textContent = record.time;
        row.appendChild(timeCell);

        tableBody.appendChild(row);
    });

    // Opdater studerendevælgeren med studerendeerne fra den valgte klasse
    const studentPicker = document.getElementById('VælgStuderende');
    studentPicker.innerHTML = '<option value="">Vælg studerende</option>';
    currentClass.students.forEach(student => {
        const option = document.createElement('option');
        option.value = student.name;
        option.textContent = student.name;
        studentPicker.appendChild(option);
    });
}

// Funktion til at opdatere tilstedeværelse for en studerende i en bestemt klasse og dato
function updateTilstedeværelse(klasse, date, student, status) {
    const currentTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    if (!classData[klasse].attendance[date]) {
        classData[klasse].attendance[date] = {};
    }
    classData[klasse].attendance[date][student] = {
        status: status,
        time: status === 'mødt' ? currentTime : "",
        lokale: classData[klasse].students.find(s => s.name === student).lokale
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
    const classPicker = document.getElementById('VælgKlasse').value;
    const studentPicker = document.getElementById('VælgStuderende').value;
    if (!studentPicker || !classPicker) return;

    const currentClass = classData[classPicker];
    const tableBody = document.getElementById('FremmødeBody');
    tableBody.innerHTML = '';

    // Find og vis fremmødedetaljer for den valgte studerende
    Object.keys(currentClass.attendance).forEach(date => {
        const attendance = currentClass.attendance[date][studentPicker];
        if (attendance) {
            const row = document.createElement('tr');
            
            // Opret celle til dato
            const dateCell = document.createElement('td');
            dateCell.textContent = date;
            row.appendChild(dateCell);

            // Opret celle til studerendenavn
            const nameCell = document.createElement('td');
            nameCell.textContent = studentPicker;
            row.appendChild(nameCell);

            // Opret celle til lokale nummer
            const lokaleCell = document.createElement('td');
            lokaleCell.textContent = attendance.lokale;
            row.appendChild(lokaleCell);

            // Opret celle til status (enten mødt eller ikkemødt)
            const statusCell = document.createElement('td');
            const statusIcon = document.createElement('span');
            statusIcon.className = 'status';
            statusIcon.innerHTML = attendance.status === 'mødt' ? '&#x2714;' : '&#x2716;'; // Flueben eller kryds
            statusIcon.className = attendance.status === 'mødt' ? 'status mødt' : 'status ikkemødt';
            statusCell.appendChild(statusIcon);
            row.appendChild(statusCell);

            // Opret celle til tidspunkt
            const timeCell = document.createElement('td');
            timeCell.textContent = attendance.time;
            row.appendChild(timeCell);

            tableBody.appendChild(row);
        }
    });
}

// Funktion til at opdatere kalenderdatoen
function updateCalendarDate(change) {
    const datePicker = document.getElementById('VælgDato');
    let currentDate = new Date(datePicker.value);
    currentDate.setDate(currentDate.getDate() + change);
    datePicker.valueAsDate = currentDate;
    loadTilstedeværelse();
}

// Tilføj eventlisteners til pilene for at ændre dato
document.getElementById("prevBtn").addEventListener("click", function() {
    updateCalendarDate(-1);
});

document.getElementById("nextBtn").addEventListener("click", function() {
    updateCalendarDate(1);
});

// Foruddefinerede fremmødedata for forskellige klasser og datoer
const classData = {
    classA: {
        students: [
            {name: "Anna Hansen", lokale: "101"},
            {name: "Peter Jensen", lokale: "101"},
            {name: "Lise Sørensen", lokale: "101"},
            {name: "Mads Nielsen", lokale: "101"}
        ],
        attendance: {
            "2024-05-21": {
                "Anna Hansen": {status: "mødt", time: "08:15", lokale: "101"},
                "Peter Jensen": {status: "mødt", time: "08:17", lokale: "101"},
                "Lise Sørensen": {status: "ikkemødt", time: "", lokale: "101"},
                "Mads Nielsen": {status: "mødt", time: "08:20", lokale: "101"}
            },
            "2024-05-22": {
                "Anna Hansen": {status: "mødt", time: "08:10", lokale: "101"},
                "Peter Jensen": {status: "ikkemødt", time: "", lokale: "101"},
                "Lise Sørensen": {status: "mødt", time: "08:30", lokale: "101"},
                "Mads Nielsen": {status: "mødt", time: "08:25", lokale: "101"}
            }
        }
    },
    classB: {
        students: [
            {name: "Sofie Petersen", lokale: "201"},
            {name: "Jonas Hansen", lokale: "201"},
            {name: "Freja Mikkelsen", lokale: "201"},
            {name: "Oliver Nielsen", lokale: "201"}
        ],
        attendance: {
            "2024-05-21": {
                "Sofie Petersen": {status: "ikkemødt", time: "", lokale: "201"},
                "Jonas Hansen": {status: "mødt", time: "08:10", lokale: "201"},
                "Freja Mikkelsen": {status: "mødt", time: "08:12", lokale: "201"},
                "Oliver Nielsen": {status: "ikkemødt", time: "", lokale: "201"}
            },
            "2024-05-22": {
                "Sofie Petersen": {status: "mødt", time: "08:15", lokale: "201"},
                "Jonas Hansen": {status: "mødt", time: "08:05", lokale: "201"},
                "Freja Mikkelsen": {status: "mødt", time: "08:12", lokale: "201"},
                "Oliver Nielsen": {status: "ikkemødt", time: "", lokale: "201"}
            }
        }
    }
};