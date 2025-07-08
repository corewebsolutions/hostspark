document.addEventListener("DOMContentLoaded", function () {

    let baseURL = "https://xukl-cktx-zcsb.n7e.xano.io/";

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
    } else {
        window.location.href = "/auth/login";
    }

    if (localStorage.getItem('planSelect') !== 'price_1RiK1wPAlNurIsgyBfN20Moy') {

    const $btn = $('[data-button="payment-button"]');
      
    // Update visible text
    $btn.find('.btn-text').text('Continue to Payment');

    // Update loading text attribute
    $btn.attr('data-loading-text', 'One Moment...');
    }
    
    const $onboardingGoogle = $('#signup-google-data-form'); // onboarding form - google users
    const $onboardingManual = $('#signup-manual-data-form'); // onboarding form - manual users

    // Onboarding forms submitted...
    $onboardingGoogle.add($onboardingManual).on('submit', function (e) {

        e.preventDefault();


        const $onboardForm = $(this); // dynamic reference to the submitted form
        setLoadingState(true, this);

        const payload = createPayload($onboardForm);

        // Add selected plan from localStorage
        const selectedPlan = localStorage.getItem("planSelect");
        if (selectedPlan) {
        payload.plan_price_id = selectedPlan;
        }


        $.ajax({
            url: baseURL + 'api:xAumndFJ/onboarding_questions',
            type: 'POST',
            contentType: 'application/json',
            headers: {
                Authorization: "Bearer " + localStorage.authToken,
            },
            data: JSON.stringify(payload),
            success: function (response) {

                localStorage.setItem("firstName", response.user.first_name);
                localStorage.setItem("lastName", response.user.last_name);
                localStorage.setItem("email", response.user.email);
                if (response.avatar) {
                localStorage.setItem("avatar", response.user.avatar);
                }

                window.location.href = response.url; // stripe hosted checkout

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