document.addEventListener("DOMContentLoaded", function () {

    $('#create-event').on('click', function () { // click handler for step nav
        $("#event-details-nav-button").click();
    });

    updateStepNumberActiveState();

    // Re-run after a delay when tab changes
    $('.app-vertical-tabs__button').on('click', function () {
    setTimeout(() => {
        updateStepNumberActiveState();
    }, 50); // Wait for Webflow to apply `w--current`
    });


});


function updateStepNumberActiveState() {
  // Get all steps in order
  const $steps = $('.app-vertical-tabs__button');
  let activeIndex = -1;

  // First, find the current active step index
  $steps.each(function (index) {
    if ($(this).hasClass('w--current')) {
      activeIndex = index;
    }
  });

  // Now update each step based on position
  $steps.each(function (index) {
    const $step = $(this);
    const $number = $step.find('.step-number');
    const $line = $step.find('.app-vertical-tabs__process-line');

    // Reset all classes first
    $number.removeClass('active');
    $line.removeClass('active');

    if (index < activeIndex) {
      // Previous step – fill line
      $line.addClass('active');
    } else if (index === activeIndex) {
      // Current step – highlight number
      $number.addClass('active');
    }
    // Future steps remain inactive
  });
}
