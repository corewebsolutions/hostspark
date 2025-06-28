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


function setLoadingState(isLoading) {
  // Automatically find the currently submitting form
  const $activeForm = $('form.submitting');

  if (!$activeForm.length) return;

  const $button = $activeForm.find('.loading-button');
  const $text = $button.find('.btn-text');
  const $spinner = $button.find('.btn-spinner');
  const originalText = $button.data('original-text') || $text.text();
  const loadingText = $button.data('loading-text') || 'Loading...';

  if (isLoading) {
    $button.prop('disabled', true).addClass('loading');

    if (!$button.data('original-text')) {
      $button.data('original-text', originalText);
    }

    $text.text(loadingText);
    $spinner.show();
  } else {
    $button.prop('disabled', false).removeClass('loading');
    $text.text(originalText);
    $spinner.hide();
    $activeForm.removeClass('submitting');
  }
}