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
            if (response.stripe_connection === "not_connected"){
                $('[data="stripe-connected"]').hide();
                $('[data-action-req="stripe"]').hide();
            }else if (response.stripe_connection === "pending_items") {
                $('[data="stripe-connected"]').hide();
                $('[data-action-req="stripe"]').show();
            }else if (response.stripe_connection === "active") {
                $('[data="stripe-connected"]').show();
                $('[data-action-req="stripe"]').hide();
            }

            // zoom
            if (response.zoom_connection === "not_connected"){
                $('[data="zoom-connected"]').hide();
                $('[data-action-req="zoom"]').hide();
            }else if (response.zoom_connection === "pending_items") {
                $('[data="zoom-connected"]').hide();
                $('[data-action-req="zoom"]').show();
            }else if (response.zoom_connection === "active") {
                $('[data="zoom-connected"]').show();
                $('[data-action-req="zoom"]').hide();
            }

        },
        error: function (xhr) {

        }
    });

}