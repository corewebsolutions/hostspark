document.addEventListener("DOMContentLoaded", function () {

    // detect signup and onboarding forms...
    const $form = $('#signup-form'); // signup form 
    const $forgotPassForm = $('#forgot-password-form'); // forgot password form
    const $loginForm = $('#login-form'); // login form
  

    //Signup form submitted...
    $form.on('submit', function (e) {

        e.preventDefault();


        // Flag this form as active
        setLoadingState(true, this);

        const email = $('#signup-email').val().trim();
        const password = $('#signup-password').val().trim();
        const plan = localStorage.getItem('planSelected');

        if (!email || !password) {
        showFormError('Email and password are required.');
        setLoadingState(false);
        return;
        }

        $.ajax({
        url: baseURL + 'api:xAumndFJ/auth/signup',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ email, password, plan }),
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
                const err = xhr.responseJSON?.message || 'Signup failed. Please try again.';
                showFormError(err);
                setLoadingState(false);
            }
        });

    });


});

