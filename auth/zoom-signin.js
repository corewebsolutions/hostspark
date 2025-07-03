document.addEventListener("DOMContentLoaded", function () {
  // Step 1: Get the `code` from Zoom redirect URL
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  if (!code) {
    alert("Zoom authorization code missing.");
    return;
  }

  // Step 2: Send code to your Xano backend for secure token exchange
  $.ajax({
    url: baseURL + "api:xAumndFJ/zoom_oauth_redirect",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({ code: code }),
    success: function (response) {
      console.log("Zoom connection successful:", response);
      alert("Zoom connected successfully!");
      // Optional: Redirect to dashboard or another page
      // window.location.href = "/dashboard";
    },
    error: function (xhr, status, error) {
      console.error("Zoom OAuth Error:", error);
      alert("Something went wrong while connecting your Zoom account.");
    }
  });

  // Step 3: Clean up the URL by removing the query string (optional)
  if (window.history.replaceState) {
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState(null, null, cleanUrl);
  }
});