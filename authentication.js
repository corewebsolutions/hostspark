let baseURL = "https://xukl-cktx-zcsb.n7e.xano.io/"

document.addEventListener("DOMContentLoaded", function () {

    // Destroy Webflow form handling (including password restrictions)
    if (window.Webflow && typeof Webflow.destroy === "function") {
      Webflow.destroy();
    }


    $('#signup-form').on('submit', function (e) {
      e.preventDefault();

      const email = $('#signup-email').val().trim();
      const password = $('#signup-password').val().trim();
      const $errorBox = $('#login-error');

      $errorBox.hide();

      if (!email || !password) {
        $errorBox.text('Email and password are required.').show();
        return;
      }

      $.ajax({
        url: baseURL + 'api:xAumndFJ/auth/signup',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ email, password }),
        success: function (response) {
          alert("Account created successfully!");
          // handle success (e.g. redirect, token store)
        },
        error: function (xhr) {
          console.error('Signup failed:', xhr.responseText);
          const err = xhr.responseJSON?.message || 'Signup failed. Please try again.';
          $errorBox.text(err).show();
        }
      });
    });


});