document.addEventListener("DOMContentLoaded", function () {

    getUserIntegrationStatus(); // load user's integrations

    // Connect Stripe Account
    $('[data-api-button="stripe-connect"]').on('click', function () {

        const $btn = $(this);
        $btn.prop('disabled', true).text('Redirecting To Stripe...');

        $.ajax({
            url: baseURL + 'api:xAumndFJ/connect_stripe_account', 
            type: 'POST',
            headers: {
            Authorization: "Bearer " + localStorage.authToken,
            },
            success: function (response) {

                window.location.href = response; // redirect to Stripe onboarding

            },
            error: function (xhr) {
                const err = xhr.responseJSON?.message || 'Error initiating Stripe Connect.';
                //showFormError(err);
                $btn.prop('disabled', false).text('Connect Stripe');
            }
        });
    });

});

function getUserIntegrationStatus() {


    $.ajax({
        url: baseURL + 'api:r5LJ9mL0/get_user_integrations', 
        type: 'GET',
        headers: {
        Authorization: "Bearer " + localStorage.authToken,
        },
        success: function (response) {

            // stripe
            if (response.is_stripe_connected == true){
                $('[data="stripe-connected"]').show();
            }else {
                $('[data="stripe-connected"]').hide();
            }
            // zoom
            if (response.is_zoom_connected == true){
                $('[data="zoom-connected"]').show();
            }else {
                $('[data="zoom-connected"]').hide();
            }
            // zapier
            if (response.zapier_api_key != null){
                $('[data="zapier-connected"]').show();
            }else {
                $('[data="zapier-connected"]').hide();
            }

        },
        error: function (xhr) {

        }
    });

}