document.addEventListener("DOMContentLoaded", function () {

    // Connect Stripe Account
    $('[data-api-button="stripe-connect"]').on('click', function () {


        const $btn = $(this);
        $btn.prop('disabled', true).text('Redirecting...');

        $.ajax({
            url: baseURL + 'api:xAumndFJ/connect_stripe_account', // your backend endpoint
            type: 'POST',
            headers: {
            Authorization: "Bearer " + localStorage.authToken,
            },
            success: function (response) {
            if (response.url) {
                window.location.href = response.url; // redirect to Stripe onboarding
            } else {
                alert("Unable to connect to Stripe. Please try again.");
                $btn.prop('disabled', false).text('Connect Stripe');
            }
            },
            error: function (xhr) {
                const err = xhr.responseJSON?.message || 'Error initiating Stripe Connect.';
                //showFormError(err);
                $btn.prop('disabled', false).text('Connect Stripe');
            }
        });
    });


});