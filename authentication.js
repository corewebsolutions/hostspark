let baseURL = "https://xukl-cktx-zcsb.n7e.xano.io/"

document.addEventListener("DOMContentLoaded", function () {

    /* Signup Form Submitted */
    $('#signup-form').on('submit', function (e) {
        e.preventDefault(); // prevent default form submission

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
                console.log('Signup successful:', response);
                alert('Account created successfully!');
                // Optionally store token or redirect here
            },
            error: function (xhr) {
                console.error('Signup failed:', xhr.responseText);
                const err = xhr.responseJSON?.message || 'Signup failed. Please try again.';
                $errorBox.text(err).show();
            }
        });
    });


});