
document.addEventListener("DOMContentLoaded", function () {

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
        window.location.href = "/sign-up"; // Redirect after login
        if (response.auth_type === "manual" && response.new_user == true) {

        $('#sign-up-manual').click(); // show additional sign up questions
        } else {
        window.location.href = "/welcome"; // Redirect after login
        }
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

