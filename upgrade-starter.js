document.addEventListener("DOMContentLoaded", function () {

  // Set data-plan attributes for monthly

  $('#launch-button').attr('data-plan', 'price_1RiK2gPAlNurIsgyVXJICBxm');
  $('#growth-button').attr('data-plan', 'price_1RiK3TPAlNurIsgyCdyEWI3R');
  $('#scale-button').attr('data-plan', 'price_1RiK4GPAlNurIsgyRWDRQOl1');

  // Toggle active class for subscription frequency (monthly or annual)
  $('.frequency-button').on('click', function () {
    $('.frequency-button').removeClass('active');
    $(this).addClass('active');
  });

  // Annual pricing clicked
  $('#annual-pricing').on('click', function () {
    $('.plan-freq').text('year');
    // Update price text
    $('[data="launch-price"]').text('290/');
    $('[data="growth-price"]').text('1,090/');
    $('[data="scale-price"]').text('3,290/');

    // Set data-plan attributes for annual
  
    $('#launch-button').attr('data-plan', 'price_1RiK7MPAlNurIsgySEpHbwX2');
    $('#growth-button').attr('data-plan', 'price_1RiK8aPAlNurIsgynfsjnV3P');
    $('#scale-button').attr('data-plan', 'price_1RiK9GPAlNurIsgytOJzkdlw');
  });

  // Monthly pricing clicked
  $('#monthly-pricing').on('click', function () {
    $('.plan-freq').text('month');
    // Update price text
    $('[data="launch-price"]').text('29/');
    $('[data="growth-price"]').text('109/');
    $('[data="scale-price"]').text('329/');

    // Set data-plan attributes for monthly
  
    $('#launch-button').attr('data-plan', 'price_1RiK2gPAlNurIsgyVXJICBxm');
    $('#growth-button').attr('data-plan', 'price_1RiK3TPAlNurIsgyCdyEWI3R');
    $('#scale-button').attr('data-plan', 'price_1RiK4GPAlNurIsgyRWDRQOl1');
  });

    // User selects plan...
    $('[data="plan-button"]').on('click', function () {
    // Get the value from the data-plan attribute
    const selectedPlan = $(this).attr('data-plan');

    $.ajax({
        url: baseURL + 'api:xAumndFJ/upgrade_starter_plan', 
        type: 'POST',
        headers: {
        Authorization: "Bearer " + localStorage.authToken,
        },
        data: {
            price_id: selectedPlan
        },
        success: function (response) {

            window.location.href = response; // redirect to Stripe portal

        },
        error: function (xhr) {
            const err = xhr.responseJSON?.message || 'Error initiating Stripe Connect.';
            //showFormError(err);
            $btn.prop('disabled', false).text('Connect Stripe');
        }
    });

    });

});