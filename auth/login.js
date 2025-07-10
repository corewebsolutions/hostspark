document.addEventListener("DOMContentLoaded", function () {


    const $loginForm = $('#login-form'); // login form

    //Login form submitted...
    $loginForm.on('submit', function (e) {

        e.preventDefault();


        // Flag this form as active
        setLoadingState(true, this);

        const email = $('#login-email').val().trim();
        const password = $('#login-password').val().trim();

        if (!email || !password) {
        showFormError('Email and password are required.');
        setLoadingState(false);
        return;
        }

        $.ajax({
        url: baseURL + 'api:xAumndFJ/auth/login',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ email, password }),
        success: function (response) {

            localStorage.setItem("authToken", response.authToken);
            userLocalStorageSettings(response);
            setLoadingState(false);

            if (response.user.industry == null) {
                window.location.href = "/auth/onboarding";
            } else {
                window.location.href = "/app/dashboard";
                localStorage.setItem("pageId","dashboard");
            }

        },
        error: function (xhr) {
            const err = xhr.responseJSON?.message || 'Login failed. Please try again.';
            showFormError(err);
            setLoadingState(false);
        }
        });

    });



});