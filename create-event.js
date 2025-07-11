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
  const $steps = $('.app-vertical-tabs__button');
  let activeIndex = -1;

  // Find the current step index
  $steps.each(function (index) {
    if ($(this).hasClass('w--current')) {
      activeIndex = index;
    }
  });

  // Loop through steps and apply classes
  $steps.each(function (index) {
    const $step = $(this);
    const $number = $step.find('.step-number');
    const $line = $step.find('.app-vertical-tabs__process-line');

    // Reset first
    $number.removeClass('active');
    $line.removeClass('active');

    if (index <= activeIndex) {
      // Active or previous step: highlight both number and line
      $number.addClass('active');
    }

    if (index < activeIndex) {
      // Only previous steps get the line filled
      $line.addClass('active');
    }
  });
}
