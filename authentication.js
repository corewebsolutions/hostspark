
document.addEventListener("DOMContentLoaded", function () {

    // detect signup and onboarding forms...
    const $form = $('#signup-form'); // signup form 
    const $onboardingGoogle = $('#signup-google-data-form'); // onboarding form - google users
    const $onboardingManual = $('#signup-manual-data-form'); // onboarding form - manual users
    const $forgotPassForm = $('#forgot-password-form'); // forgot password form

    // check for redirected users after sign up for additional questions...
    if (localStorage.getItem("authToken")) { 
        $('#sign-up-block').hide(); // hide signup form

        if (localStorage.getItem("authMode") === "google") {
        $('#signup-google-user-block').show(); 
        $('#signup-manual-user-block').hide(); 
        } else if (localStorage.getItem("authMode") === "manual") {
        $('#signup-manual-user-block').show(); 
        $('#signup-google-user-block').hide(); 
        }
    }

    //Signup form submitted...
    $form.on('submit', function (e) {

        e.preventDefault();


        // Flag this form as active
        setLoadingState(true, this);

        const email = $('#signup-email').val().trim();
        const password = $('#signup-password').val().trim();

        if (!email || !password) {
        showFormError('Email and password are required.');

        return;
        }
        
        $.ajax({
        url: baseURL + 'api:xAumndFJ/auth/signup',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ email, password }),
        success: function (response) {

            localStorage.setItem("authToken", response.authToken);
            localStorage.setItem("authMode", "manual");

            if (response.new_user == false) {
                window.location.href = "/welcome"; 
            } else {
                window.location.href = "/auth/sign-up"; 
            }

            setLoadingState(false);

        },
        error: function (xhr) {
            const err = xhr.responseJSON?.message || 'Signup failed. Please try again.';
            showFormError(err);
            setLoadingState(false);
        }
        });

    });


    // Onboarding forms submitted...
    $onboardingGoogle.add($onboardingManual).on('submit', function (e) {

        e.preventDefault();


        const $onboardForm = $(this); // dynamic reference to the submitted form
        setLoadingState(true, this);

        const payload = createPayload($onboardForm);

        $.ajax({
            url: baseURL + 'api:xAumndFJ/onboarding_questions',
            type: 'POST',
            contentType: 'application/json',
            headers: {
                Authorization: "Bearer " + localStorage.authToken,
            },
            data: JSON.stringify(payload),
            success: function (response) {
            // Handle response if needed
            window.location.href = "/welcome";
            setLoadingState(false);
            },
            error: function (xhr) {
            const err = xhr.responseJSON?.message || 'Submission failed. Please try again.';
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
                alert('Email Sent' + response)

            },
            error: function (xhr) {
                const err = xhr.responseJSON?.message || 'Signup failed. Please try again.';
                showFormError(err);
                setLoadingState(false);
            }
        });

    });


});

