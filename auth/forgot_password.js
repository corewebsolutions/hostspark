document.addEventListener("DOMContentLoaded", function () {

    const $forgotPassForm = $('#forgot-password-form'); // forgot password form

    // Forgot Password form submitted...
    $forgotPassForm.on('submit', function (e) {

        e.preventDefault();

        // Flag this form as active
        setLoadingState(true, this);

        const email = $('[data-api-input="email"]').val().trim();

        $.ajax({
            url: baseURL + 'api:xAumndFJ/forgot_password',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ email }),
            success: function (response) {

                setLoadingState(false);
                showToast('success','Please check your email for the reset link.')

            },
            error: function (xhr) {
                const err = xhr.responseJSON?.message || 'An error has occured. Please try again.';
                showFormError(err);
                setLoadingState(false);
            }
        });

    });


});