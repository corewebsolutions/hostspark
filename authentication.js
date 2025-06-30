
document.addEventListener("DOMContentLoaded", function () {

  // check for redirected users after sign up for additional questions
  if (localStorage.getItem("authToken")) { 
    if (localStorage.getItem("authMode")=== "google"){
        $('#sign-up-google').click();
    } else if (localStorage.getItem("authMode")=== "google") {
        $('#sign-up-manual').click();
    }
  }

  const $form = $('#signup-form');
  const $errorBox = $('#login-error');

  $form.on('submit', function (e) {
    e.preventDefault();

    // Flag this form as active
    $form.addClass('submitting');

    const email = $('#signup-email').val().trim();
    const password = $('#signup-password').val().trim();

    $errorBox.stop(true, true).hide();

    if (!email || !password) {
      showFormError('Email and password are required.');
      setLoadingState(false);
      return;
    }

    setLoadingState(true);

    $.ajax({
      url: baseURL + 'api:xAumndFJ/auth/signup',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ email, password }),
      success: function (response) {

        localStorage.setItem("authToken", response.authToken);
        localStorage.setItem("authMode", "manual");
        window.location.href = "/sign-up"; // Redirect after login

        setLoadingState(false);

      },
      error: function (xhr) {
        const err = xhr.responseJSON?.message || 'Signup failed. Please try again.';
        showFormError(err);
        setLoadingState(false);
      }
    });

  });
});

