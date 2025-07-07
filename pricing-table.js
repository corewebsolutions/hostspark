document.addEventListener("DOMContentLoaded", function () {

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
    $('#launch-button').attr('data-plan', 'launch-annual');
    $('#growth-button').attr('data-plan', 'growth-annual');
    $('#scale-button').attr('data-plan', 'scale-annual');
  });

  // Monthly pricing clicked
  $('#monthly-pricing').on('click', function () {
    $('.plan-freq').text('month');
    // Update price text
    $('[data="launch-price"]').text('29/');
    $('[data="growth-price"]').text('109/');
    $('[data="scale-price"]').text('329/');

    // Set data-plan attributes for monthly
    $('#launch-button').attr('data-plan', 'launch-monthly');
    $('#growth-button').attr('data-plan', 'growth-monthly');
    $('#scale-button').attr('data-plan', 'scale-monthly');
  });

    // User selects plan...
    $('[data="plan-button"]').on('click', function () {
    // Get the value from the data-plan attribute
    const selectedPlan = $(this).attr('data-plan');
    const planName = $(this).attr('plan-name');

    // Store it in localStorage
    localStorage.setItem('planSelect', selectedPlan);

    // Redirect with query param
    window.location.href = "/auth/sign-up";
    });

});