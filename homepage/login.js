$(document).ready(function(){
    $("#loginForm").submit(function(e){
        e.preventDefault();
        
        $.ajax({
            type: "POST",
            url: "login.php",
            data: $("#loginForm").serialize(),
            success: function(response){
                $("#message").html(response);
                if (response.includes("Godkendt")) {
                    // Hvis godkendt, omdiriger til forside.html
                    window.location.href = "forside.html";
                }
            }
        });
    });
});
