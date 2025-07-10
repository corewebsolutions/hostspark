document.addEventListener("DOMContentLoaded", function () {

  const $resetPasswordForm = $('#reset-password-form');

  // Get "user" query param as reset_id
  const params = new URLSearchParams(window.location.search);
  const reset_id = params.get("user");

  if (!reset_id) {
    alert("Missing reset token. Please use the link from your email.");
    return;
  }

  $resetPasswordForm.on('submit', function (e) {
    e.preventDefault();

    setLoadingState(true, this);

    const $form = $(this);
    const password = $form.find('[data-api-input="password"]').val().trim();
    const confirmPassword = $form.find('[data-api-input="confirm-password"]').val().trim();

    if (!password || !confirmPassword) {
      showFormError("Please enter and confirm your new password.");
      setLoadingState(false);
      return;
    }

    if (password !== confirmPassword) {
      showFormError("Passwords do not match.");
      setLoadingState(false);
      return;
    }

    $.ajax({
      url: baseURL + 'api:xAumndFJ/reset_password',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ password, reset_id }),
      success: function (response) {

        alert('Password reset successful!');
        setLoadingState(false);
        userLocalStorageSettings();
        localStorage.setItem("pageId","dashboard");
        window.location.href = "/app/dashboard";

      },
      error: function (xhr) {
        const err = xhr.responseJSON?.message || 'Reset failed. Please try again.';
        showFormError(err);
        setLoadingState(false);
      }
    });
  });
});