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
  const $steps = document.querySelectorAll('.app-vertical-tabs__button');
  let activeIndex = -1;

  // Find the current step index
  $steps.forEach((step, index) => {
    if (step.classList.contains('w--current')) {
      activeIndex = index;
    }
  });

  // Loop and apply classes
  $steps.forEach((step, index) => {
    const number = step.querySelector('.step-number');
    const line = step.querySelector('.app-vertical-tabs__process-line');
    const text = step.querySelector('.step-title');

    // Reset first
    if (number) number.classList.remove('active');
    if (line) line.classList.remove('active');
    if (text) text.classList.remove('active');

    if (index <= activeIndex) {
      if (number) number.classList.add('active');
      if (text) text.classList.add('active'); 
    }

    if (index < activeIndex && line) {
      line.classList.add('active');
    }
  });
}

