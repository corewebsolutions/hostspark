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
  const steps = document.querySelectorAll('.app-vertical-tabs__button');
  let activeIndex = -1;

  steps.forEach((step, index) => {
    if (step.classList.contains('w--current')) {
      activeIndex = index;
    }
  });

  steps.forEach((step, index) => {
    const wrapper = step.querySelector('.step-text'); // outer wrapper
    const number = wrapper?.querySelector('.step-number');
    const label = wrapper?.querySelectorAll('.step-text')[1]; // second .step-text inside
    const line = step.querySelector('.app-vertical-tabs__process-line');

    // Reset
    number?.classList.remove('active');
    label?.classList.remove('active');
    line?.classList.remove('active');

    if (index <= activeIndex) {
      number?.classList.add('active');
      label?.classList.add('active');
    }

    if (index < activeIndex) {
      line?.classList.add('active');
    }
  });
}
