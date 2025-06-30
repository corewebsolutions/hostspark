
document.addEventListener("DOMContentLoaded", function () {

    // detect signup and onboarding forms...
    const $form = $('#signup-form');
    const $onboardingGoogle = $('#signup-google-data-form');
    const $onboardingManual = $('#signup-manual-data-form');

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
        setLoadingState(true);

        // Flag this form as active
        $form.addClass('submitting');

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
        data: JSON.stringify({ email, password }),
        success: function (response) {

            localStorage.setItem("authToken", response.authToken);
            localStorage.setItem("authMode", "manual");
            window.location.href = "/sign-up"; // Redirect after login

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
        setLoadingState(true);

        const $onboardForm = $(this); // dynamic reference to the submitted form
        $onboardForm .addClass('submitting');

        const payload = createPayload($form);

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
});

