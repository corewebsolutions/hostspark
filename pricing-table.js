document.addEventListener("DOMContentLoaded", function () {

  // Set data-plan attributes for monthly
  $('#starter-button').attr('data-plan', 'price_1RiK1wPAlNurIsgyBfN20Moy');
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
    $('#starter-button').attr('data-plan', 'price_1RiK1wPAlNurIsgyBfN20Moy');
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
    $('#starter-button').attr('data-plan', 'price_1RiK1wPAlNurIsgyBfN20Moy');
    $('#launch-button').attr('data-plan', 'price_1RiK2gPAlNurIsgyVXJICBxm');
    $('#growth-button').attr('data-plan', 'price_1RiK3TPAlNurIsgyCdyEWI3R');
    $('#scale-button').attr('data-plan', 'price_1RiK4GPAlNurIsgyRWDRQOl1');
  });

    // User selects plan...
    $('[data="plan-button"]').on('click', function () {
    // Get the value from the data-plan attribute
    const selectedPlan = $(this).attr('data-plan');

    // Store it in localStorage
    localStorage.setItem('planSelect', selectedPlan);

    // Redirect with query param
    window.location.href = "/auth/sign-up";
    });

});