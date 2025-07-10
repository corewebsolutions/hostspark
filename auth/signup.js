document.addEventListener("DOMContentLoaded", function () {


    
    const $form = $('#signup-form'); // Add this line to define $form

    //Signup form submitted...
    $form.on('submit', function (e) {

        e.preventDefault();

        setLoadingState(true, this);

        let price_id = null; // Declare the variable outside the blocks

        if (localStorage.getItem('planSelect')) {
            price_id = localStorage.getItem('planSelect');
        }

        const email = $('#signup-email').val().trim();
        const password = $('#signup-password').val().trim();
        

        if (!email || !password) {
        showFormError('Email and password are required.');
        setLoadingState(false);
        return;
        }

        $.ajax({
        url: baseURL + 'api:xAumndFJ/auth/signup',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ email, password, price_id }),
        success: function (response) {

            // hide signup form
            $('#sign-up-block').hide();

            // set local storage
            localStorage.setItem("authMode", "manual");
            localStorage.setItem("authToken", response.authToken);

            // Redirect with query param
            window.location.href = "/auth/onboarding";

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