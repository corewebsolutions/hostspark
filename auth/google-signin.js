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
        code: code,
        plan: localStorage.getItem('planSelect')
      },
      success: function (response) {

          if (response.authToken) { // if user is authenticated
            
            userLocalStorageSettings(response);

            if (response.new_user == false && response.user.industry != null ) {
                localStorage.setItem("pageId","dashboard");
                window.location.href = "/app/dashboard"; 
            } else {
                window.location.href = "/auth/onboarding"; 
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
