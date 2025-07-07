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
    $('#launch-button').attr('data-plan', 'launch-annual').attr('plan-name', 'Launch - Annual Plan');
    $('#growth-button').attr('data-plan', 'growth-annual').attr('plan-name', 'Growth - Annual Plan');
    $('#scale-button').attr('data-plan', 'scale-annual').attr('plan-name', 'Scale - Annual Plan');
  });

  // Monthly pricing clicked
  $('#monthly-pricing').on('click', function () {
    $('.plan-freq').text('month');
    // Update price text
    $('[data="launch-price"]').text('29/');
    $('[data="growth-price"]').text('109/');
    $('[data="scale-price"]').text('329/');

    // Set data-plan attributes for monthly
    $('#launch-button').attr('data-plan', 'launch-monthly').attr('plan-name', 'Launch - Monthly Plan');
    $('#growth-button').attr('data-plan', 'growth-monthly').attr('plan-name', 'Growth - Monthly Plan');
    $('#scale-button').attr('data-plan', 'scale-monthly').attr('plan-name', 'Scale - Monthly Plan');
  });

    // User selects plan...
    $('[data="plan-button"]').on('click', function () {
    // Get the value from the data-plan attribute
    const selectedPlan = $(this).attr('data-plan');
    const planName = $(this).attr('plan-name');

    // Store it in localStorage
    localStorage.setItem('planSelect', selectedPlan);
    localStorage.setItem('planName', planName);

    // Redirect with query param
    window.location.href = "/auth/sign-up";
    });

});