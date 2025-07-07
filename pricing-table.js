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

    // Set data-api-button attributes for annual
    $('#launch-button').attr('data-api-button', 'launch-annual');
    $('#growth-button').attr('data-api-button', 'growth-annual');
    $('#scale-button').attr('data-api-button', 'scale-annual');
  });

  // Monthly pricing clicked
  $('#monthly-pricing').on('click', function () {
    $('.plan-freq').text('month');
    // Update price text
    $('[data="launch-price"]').text('29/');
    $('[data="growth-price"]').text('109/');
    $('[data="scale-price"]').text('329/');

    // Set data-api-button attributes for monthly
    $('#launch-button').attr('data-api-button', 'launch-monthly');
    $('#growth-button').attr('data-api-button', 'growth-monthly');
    $('#scale-button').attr('data-api-button', 'scale-monthly');
  });

});