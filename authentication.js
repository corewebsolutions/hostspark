let baseURL = "https://xukl-cktx-zcsb.n7e.xano.io/";

document.addEventListener("DOMContentLoaded", function () {
  const $form = $('#signup-form');
  const $submitBtn = $form.find('input[type="submit"]');
  const originalBtnText = $submitBtn.val();
  const $errorBox = $('#login-error');

  $form.on('submit', function (e) {
    e.preventDefault();

    const email = $('#signup-email').val().trim();
    const password = $('#signup-password').val().trim();

    $errorBox.stop(true, true).hide();

    if (!email || !password) {
      showError('Email and password are required.');
      return;
    }

    // Show loading state
    showLoading(true);

    $.ajax({
      url: baseURL + 'api:xAumndFJ/auth/signup',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ email, password }),
      success: function (response) {
        alert("Account created successfully!");
        // Reset button
        showLoading(false);
        // Optionally redirect here
      },
      error: function (xhr) {
        const err = xhr.responseJSON?.message || 'Signup failed. Please try again.';
        showError(err);
        showLoading(false);
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

    function showLoading(isLoading) {
      if (isLoading) {
        $submitBtn.prop('disabled', true);
        $submitBtn.val('Creating Your Account...');
        $submitBtn.addClass('loading');
      } else {
        $submitBtn.prop('disabled', false);
        $submitBtn.val(originalBtnText);
        $submitBtn.removeClass('loading');
      }
    }
  });
});