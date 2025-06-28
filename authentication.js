let baseURL = "https://xukl-cktx-zcsb.n7e.xano.io/"

document.addEventListener("DOMContentLoaded", function () {

    $('#signup-form').on('submit', function (e) {
        e.preventDefault();

        const email = $('#signup-email').val().trim();
        const password = $('#signup-password').val().trim();
        const $errorBox = $('#login-error');

        // Reset and hide immediately
        $errorBox.stop(true, true).hide();

        if (!email || !password) {
        showError('Email and password are required.');
        return;
        }

        $.ajax({
        url: baseURL + 'api:xAumndFJ/auth/signup',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ email, password }),
        success: function (response) {
            alert("Account created successfully!");
            // Handle redirect or storage here
        },
        error: function (xhr) {
            console.error('Signup failed:', xhr.responseText);
            const err = xhr.responseJSON?.message || 'Signup failed. Please try again.';
            showError(err);
        }
        });

        // Animate error box show/hide
        function showError(message) {
        $errorBox
            .stop(true, true)
            .hide()                      // Ensure it starts hidden
            .text(message)
            .slideDown(300)             // Slide into view
            .delay(2500)                // Wait 2.5 seconds
            .slideUp(300);              // Slide back up
        }
    });


});