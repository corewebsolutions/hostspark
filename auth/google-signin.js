document.addEventListener("DOMContentLoaded", function () {

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) {
      alert("Missing Google code. Try signing in again.");
      return;
    }
    $.ajax({
    url:  baseURL + "api:xAumndFJ/google_auth",
    type: "POST",
    data: {
      code: code
    },
    success: function (response) {

        if (response.authToken) { // if user is authenticated
          localStorage.setItem("authToken", response.authToken);
          localStorage.setItem("authMode", "google");
          localStorage.setItem("firstName", response.user.first_name);
          localStorage.setItem("lastName", response.user.last_name);
          localStorage.setItem("email", response.user.email);

          if (response.new_user == false) {
              window.location.href = "/app/home"; 
          } else {
              window.location.href = "/auth/sign-up"; 
          }
          
        } else {
          alert("Login failed. Please try again.");
        }

    },
      error: function (xhr, status, error) {

        console.error("OAuth Error:", error);
        alert("Something went wrong during login.")

      }
  	});
    
});
