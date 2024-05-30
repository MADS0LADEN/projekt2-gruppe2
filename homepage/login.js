$(document).ready(function(){
    $("#loginForm").submit(function(e){
        e.preventDefault();
        
        $.ajax({
            type: "POST",
            url: "login.php",
            data: $("#loginForm").serialize(),
            dataType: "json", // Forvent et JSON-svar
            success: function(response){
                if (response.status === "success") {
                    // Hvis det er en succes, omdiriger til den angivne side
                    window.location = response.redirect;
                } else {
                    // Ellers, vis fejlmeddelelsen
                    $("#message").html(response.message);
                }
            }
        });
    });
});