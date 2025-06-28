let baseURL = "https://xukl-cktx-zcsb.n7e.xano.io/";

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
      showError('Email and password are required.');
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
        alert("Account created successfully!");
        setLoadingState(false);
      },
      error: function (xhr) {
        const err = xhr.responseJSON?.message || 'Signup failed. Please try again.';
        showError(err);
        setLoadingState(false);
      }
    });

    function showError(message) {
      $errorBox
        .stop(true, true)
        .hide()
        .text(message)
        .slideDown(300)
        .delay(4000)
        .slideUp(300);
    }
  });
});

