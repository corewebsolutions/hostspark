document.addEventListener("DOMContentLoaded", function () {

    // check for redirected users after sign up for additional questions...
    if (localStorage.getItem("authToken")) { 
        $('#sign-up-block').hide(); // hide signup form

        if (localStorage.getItem("authMode") === "google") {
          $('#signup-google-user-block').show(); 
          $('#signup-manual-user-block').hide(); 
          } else if (localStorage.getItem("authMode") === "manual") {
          $('#signup-manual-user-block').show(); 
          $('#signup-google-user-block').hide(); 
        }
    } else {
        window.location.href = "/auth/login";
    }

    const $btn = $('[data-button="payment-button"]');

    if (
      !localStorage.getItem('planSelect') || 
      localStorage.getItem('planSelect') == 'price_1RiK1wPAlNurIsgyBfN20Moy'
    ) {
      
      // Update visible text
      $btn.find('.btn-text').text('Continue to Dashboard');

      // Update loading text attribute
      $btn.attr('data-loading-text', 'One Moment...');

    } else {

      // Update visible text
      $btn.find('.btn-text').text('Continue to Payment');
      $btn.attr('data-loading-text', 'One Moment...');

    }


    if (localStorage.getItem("onboarding")) {
        localStorage.setItem('pageId','dashboard');
        window.location.href = '/app/dashboard';
    }

    
    const $onboardingGoogle = $('#signup-google-data-form'); // onboarding form - google users
    const $onboardingManual = $('#signup-manual-data-form'); // onboarding form - manual users

    // Onboarding forms submitted...
    $onboardingGoogle.add($onboardingManual).on('submit', function (e) {

        e.preventDefault();


        const $onboardForm = $(this); // dynamic reference to the submitted form
        setLoadingState(true, this);

        const payload = createPayload($onboardForm);

        let selectedPlan = null; 

        if (localStorage.getItem('planSelect')) {
            selectedPlan = localStorage.getItem('planSelect');
        }
        payload.price_id = selectedPlan;



        $.ajax({
            url: baseURL + 'api:xAumndFJ/onboarding_questions',
            type: 'POST',
            contentType: 'application/json',
            headers: {
                Authorization: "Bearer " + localStorage.authToken,
            },
            data: JSON.stringify(payload),
            success: function (response) {

                userLocalStorageSettings(response);
                localStorage.setItem("planGroup",response.plan_group_id);
                localStorage.setItem("onboarding", 'completed');

                if (response.plan_group_id == 0) { // if starter plan, redirect user to dashboard
                    localStorage.setItem('pageId','dashboard');
                    window.location.href = "/app/dashboard"; 
                } else { // send them to stripe hosted checkout url
                    window.location.href = response.url;
                }



                setLoadingState(false);

            },
            error: function (xhr) {

                const err = xhr.responseJSON?.message || 'Submission failed. Please try again.';
                showFormError(err);
                setLoadingState(false);
            }
        });

        
    });

});

// Button Loader Animation
window.setLoadingState = function(isLoading, formEl) {
  let $form;

  // If a form element is passed in, use it. Otherwise fall back to $('form.submitting')
  if (formEl) {
    $form = $(formEl);
    $form.addClass('submitting'); 
  } else {
    $form = $('form.submitting');
  }

  if (!$form.length) return;

  const $button = $form.find('.loading-button');
  const $text = $button.find('.btn-text');
  const $spinner = $button.find('.btn-spinner');
  const originalText = $button.data('original-text') || $text.text();
  const loadingText = $button.data('loading-text') || 'Loading...';

  if (isLoading) {
    $button.prop('disabled', true).addClass('loading');

    if (!$button.data('original-text')) {
      $button.data('original-text', originalText);
    }

    $text.text(loadingText);
    $spinner.show();
  } else {
    $button.prop('disabled', false).removeClass('loading');
    $text.text(originalText);
    $spinner.hide();
    $form.removeClass('submitting');
  }
};

// Form Dropdown Error Message
window.showFormError = function(message) {
  const $form = $('form.submitting');
  
  if (!$form.length) return;

  const $errorBox = $form.find('[utility-comp="form-error"]');
  const $inner = $errorBox.find('div').first(); // Get the nested <div>

  if (!$errorBox.length || !$inner.length) return;

  $errorBox.stop(true, true).hide();
  $inner.text(message);

  $errorBox
    .slideDown(300)
    .delay(2000)
    .slideUp(300);
}

// Payload Builder from form fields
window.createPayload = function($form) {
  const payload = {};

  $form.find('[data-api-input]').each(function () {
    const key = $(this).attr('data-api-input');
    const value = $(this).val();
    if (key) {
      payload[key] = value;
    }
  });

  return payload;
}