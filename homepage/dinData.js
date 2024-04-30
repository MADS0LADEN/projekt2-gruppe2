$(document).ready(function () {
    // Funktion til at skjule og vise relevante containere#
    function skiftVisning(grafVisning) {
        if (grafVisning) {
            // Skjul data-container og vis graf-container
            $("#dataContainer").hide();
            $("#grafContainer").show();
            fetchGrafData(chart);
        } else {
            // Skjul graf-container og vis data-container
            $("#grafContainer").hide();
            $("#dataContainer").show();
            fetchRawData();
        }
    }

    // Hent enheder ved indlæsning af siden
    fetchDevices();

    // Initialiserer knaptryk for "Graf" og "Data"
    $("#grafButton").click(function () {
        skiftVisning(true);
    });

    $("#dataButton").click(function () {
        skiftVisning(false);
    });

    // Funktion til at hente enheder fra serveren
    function fetchDevices() {
        $.ajax({
            type: "POST",
            url: "dinData.php",
            data: { action: "fetchDevices" },
            success: function (response) {
                var devices = JSON.parse(response);
    
                // Tøm dropdown-menuen før tilføjelse af nye options
                $("#deviceDropdown").empty();
    
                // Loop gennem enheder og opret en option for hver
                devices.forEach(function (device) {
                    // Opret en option og tilføj den til dropdown-menuen
                    var option = $("<option>")
                        .attr("data-id", device.id)
                        .attr("placement", device.placement)
                        .text(device.placement);
    
                    $("#deviceDropdown").append(option);
                });
            }
        });
    }

    // Funktion til at hente grafdata for en bestemt enhed
    function fetchGrafData(chart) {
        // Hent den valgte enhed og dens ID fra dropdown-menuen
        var valgtEnhedId = $("#deviceDropdown option:selected").data("id");
    
        $.ajax({
            type: "POST",
            url: "dinData.php", 
            data: { action: "fetchGrafData", device_id: valgtEnhedId },
            success: function (respons) {
                // Log responsen til konsollen
                console.log("Respons fra serveren:", respons);
    
                // Forsøg at analysere responsen som JSON
                try {
                    var temperaturData = JSON.parse(respons);
    
                    // Behandle responsen og opdater data i grafen
                    updateChartData(chart, temperaturData);
    
                    // Opdater menuens label med den valgte placering
                    $("#selectedPlacementLabel").text("Valgt device_id: " + valgtEnhedId);
                } catch (error) {
                    console.error("Fejl ved JSON-analyse:", error);
                }
            },
            error: function (xhr, status, error) {
                console.error("Fejl ved AJAX-anmodning:", status, error);
            }
        });
    }

    // Funktion til at opdatere data i CanvasJS-grafen
    function updateChartData(chart, jsonData) {
        try {
            // Konverter JSON-strengen til et JavaScript-objekt
            var data = JSON.parse(jsonData);
    
            // Opdater data for TempDiff-linjen i grafen
            chart.options.data[0].dataPoints = data.map(function(item) {
                return { x: new Date(item.Dato), y: parseFloat(item.TempDiff) };
            });
    
            // Gengiver grafen
            chart.render();
        } catch (error) {
            console.error("Fejl ved JSON-analyse:", error);
        }
    }
    
    // Opret et objekt til CanvasJS-grafen
    var chart = new CanvasJS.Chart("grafContainer", {
        animationEnabled: true,
        title: {
            text: $("#deviceDropdown option:selected").data("placement")
        },
        axisX: {
            title: "Klokken",
            hour12: false,
            valueFormatString: "DD MMM HH:mm",
            interval: 15,
            intervalType: "minute"
        },
        axisY: {
            title: "Temperatur forskel",
            includeZero: true
        },
        data: [
            {
                type: "line",
                name: $("#deviceDropdown option:selected").data("placement"),
                xValueType: "dateTime",
                dataPoints: []
            }
        ]
    });

    function fetchRawData() {
    var valgtEnhedId = $("#deviceDropdown option:selected").data("id");

        $.ajax({
            type: "POST",
            url: "dinData.php",
            data: { action: "fetchRawData", device_id: valgtEnhedId },
            success: function (response) {
                try {
                    // Forsøg at parse JSON
                    var rawData = JSON.parse(response);

                    // Log den parsede data til konsollen for inspektion
                    console.log(rawData);

                    var tableBody = $("#dataTableBody");
                    // Fjern eksisterende rækker i tabellen
                    tableBody.empty();

                    // Kontroller om rawData er en streng, og konverter den til en array, hvis det er tilfældet
                    if (typeof rawData === 'string') {
                        try {
                            rawData = JSON.parse(rawData);
                        } catch (error) {
                            console.error('Fejl ved parsing af JSON-streng:', error);
                            return; // Stop funktionen, hvis der opstår en fejl
                        }
                    }

                    // Tjek igen om rawData er en array
                    if (Array.isArray(rawData)) {
                        // Omvend arrayet for at vise det nyeste data øverst
                        rawData = rawData.reverse();

                        // Indsæt nye rækker baseret på det omvendte rawData
                        rawData.forEach(function (rowData) {
                            var row = $("<tr>");

                            // Tilføj celler til hver række baseret på kolonnerne
                            $("<td>").text(rowData['Dato']).appendTo(row);
                            $("<td>").text(rowData['Temperatur_Pipe']).appendTo(row);
                            $("<td>").text(rowData['Temperatur_Rum']).appendTo(row);
                            $("<td>").text(rowData['TempDiff']).appendTo(row);

                            // Indsæt rækken i tabellen
                            row.appendTo(tableBody);
                        });
                    } else {
                        console.error('RawData er ikke en array.');
                    }

                    // Vis data-container
                    $("#dataContainer").show();
                } 
                catch (error) {
                    // Håndter fejl ved parsing af JSON
                    console.error("Fejl ved parsing af JSON: " + error);
                }
            },
            error: function (xhr, status, error) {
                // Håndter fejl ved AJAX-anmodning
                console.error("AJAX-fejl: " + status + " - " + error);
            }
        });
    }
});
