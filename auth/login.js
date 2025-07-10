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
            localStorage.setItem("authMode", response.user.auth_mode);
            localStorage.setItem("firstName", response.user.first_name);
            localStorage.setItem("lastName", response.user.last_name);
            localStorage.setItem("email", response.user.email);
            if (response.user.avatar){
                localStorage.setItem("avatar", response.user.avatar);
            }

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