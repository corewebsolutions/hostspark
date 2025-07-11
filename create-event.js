document.addEventListener("DOMContentLoaded", function () {


  $('#create-event').on('click', function () { // click handler for step nav
    $("#event-details-nav-button").click();
  });

  updateStepNumberActiveState(); // initiate step navigation

  $('.app-vertical-tabs__button').on('click', function () { // click handler for step nav
    setTimeout(() => {
      updateStepNumberActiveState();
    }, 50);
  });



});



// Nav Steps Functionality
function updateStepNumberActiveState() {
    $('.step-number').removeClass('active');
    $('.app-vertical-tabs__process-line').removeClass('active');
    $('.app-vertical-tabs__button.w--current').each(function () {
      $(this).find('.step-number').addClass('active');
      $(this).find('.app-vertical-tabs__process-line').addClass('active');
    });
}