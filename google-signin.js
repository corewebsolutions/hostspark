
document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) {
      alert("Missing Google code. Try signing in again.");
      return;
    }
    $.ajax({
    url: "https://x8ki-letl-twmt.n7.xano.io/api:xAumndFJ/google-login",
    type: "POST",
    data: {
      code: code
    },
    success: function (response) {
        if (response.authToken) {
          localStorage.setItem("authToken", response.authToken);
          window.location.href = "/welcome"; // Redirect after login
        } else {
          alert("Login failed. Please try again.");
        }
    },
      error: function (xhr, status, error) {
        console.error("OAuth Error:", error);
        alert("Something went wrong during login.");
      }
  	});
});
