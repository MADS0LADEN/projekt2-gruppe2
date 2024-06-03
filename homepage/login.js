$(document).ready(function(){
    $("#loginForm").submit(function(e){
        e.preventDefault();
        
        $.ajax({
            type: "POST",
            url: "login.php",
            data: $("#loginForm").serialize(),
            dataType: "json",
            success: function(response){
                if (response.status === "success") {
                    window.location = response.redirect;
                } else {
                    $("#message").html(response.message);
                    $("#message").css("color", "white"); // Gør beskedfeltet hvidt
                }
            },
            error: function(xhr, status, error){
                console.error("An error occurred: " + status + " " + error);
                $("#message").html("An error occurred: " + xhr.responseText);
                $("#message").css("color", "white"); // Gør beskedfeltet hvidt
            }
        });
    });
});
