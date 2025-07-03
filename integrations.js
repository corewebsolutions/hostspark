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
                $('.integration-button.stripe').text('Continue Stripe Setup');
            }else if (response.stripe_connection === "active") {
                $('[data="stripe-connected"]').show();
                $('[data-action-req="stripe"]').hide();
            }

            // zoom
            if (response.zoom_connection === "not_connected") {
            $('[data="zoom-connected"]').hide();
            $('[data-action-req="zoom"]').hide();
            $('#zoom-integration-button')
                .attr(
                'href',
                'https://zoom.us/oauth/authorize?response_type=code&client_id=qvUnchNxSuax82ydEYhA&redirect_uri=https://host-spark.webflow.io/zoom-sign-in'
                )
                .off('click'); // remove disconnect behavior if previously bound
            } else if (response.zoom_connection === "pending_items") {
            $('[data="zoom-connected"]').hide();
            $('[data-action-req="zoom"]').show();
            } else if (response.zoom_connection === "active") {
            $('[data="zoom-connected"]').show();
            $('[data-action-req="zoom"]').hide();
            $('.zoom-connect-text').text("Disconnect");
            $('#zoom-connect-icon').text("");
            $('#zoom-integration-button')
                .attr('href', '')
                .off('click') 
                .on('click', function (e) {
                e.preventDefault();
                disconnectZoom();
                });
            }

        },
        error: function (xhr) {

        }
    });

}

function disconnectZoom() {

    $.ajax({
    url: baseURL + 'api:xAumndFJ/zoom_disconnect', 
    type: 'POST',
    headers: {
    Authorization: "Bearer " + localStorage.authToken,
    },
    success: function (response) {

        alert('Zoom disconnected!');
        getUserIntegrationStatus(); 
        showToast('success', 'Zoom has been successfully disconnected.');
        
    },
    error: function (xhr) {

    }
});

}

