function checkPassword() {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;
    var resultMessage = document.getElementById("result");

    if (password === confirmPassword) {
        resultMessage.style.color = "green";
        resultMessage.innerHTML = "OK";
        
        // Send data to server if passwords match
        sendToServer(email, password);
    } else {
        resultMessage.style.color = "red";
        resultMessage.innerHTML = "Adgangskoden er forkert.";
    }
}

function sendToServer(email, password) {
    // Create a new XMLHttpRequest object
    var xhr = new XMLHttpRequest();
    
    // Define the request method, URL, and set it to asynchronous
    xhr.open("POST", "nybruger.php", true);
    
    // Set the request header to send JSON data
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    
    // Define the data to be sent as JSON
    var data = JSON.stringify({
        email: email,
        password: password
    });

    // Send the request with the JSON data
    xhr.send(data);
}