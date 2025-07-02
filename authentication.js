document.addEventListener("DOMContentLoaded", function () {

    // detect signup and onboarding forms...
    const $form = $('#signup-form'); // signup form 
    const $onboardingGoogle = $('#signup-google-data-form'); // onboarding form - google users
    const $onboardingManual = $('#signup-manual-data-form'); // onboarding form - manual users
    const $forgotPassForm = $('#forgot-password-form'); // forgot password form
    const $loginForm = $('#login-form'); // login form

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
    }

    //Signup form submitted...
    $form.on('submit', function (e) {

        e.preventDefault();


        // Flag this form as active
        setLoadingState(true, this);

        const email = $('#signup-email').val().trim();
        const password = $('#signup-password').val().trim();

        if (!email || !password) {
        showFormError('Email and password are required.');
        setLoadingState(false);
        return;
        }

        $.ajax({
        url: baseURL + 'api:xAumndFJ/auth/signup',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ email, password }),
        success: function (response) {

            // hide signup form
            $('#sign-up-block').hide();

            // set local storage
            localStorage.setItem("authMode", "manual");
            localStorage.setItem("authToken", response.authToken);

            // show appropriate onboarding form
            if (localStorage.getItem("authMode") === "manual") {
                $('#signup-manual-user-block').show();
                $('#signup-google-user-block').hide();
            } else if (localStorage.getItem("authMode") === "google") {
                $('#signup-manual-user-block').hide();
                $('#signup-google-user-block').show();
            }

            setLoadingState(false);

        },
        error: function (xhr) {
            const err = xhr.responseJSON?.message || 'Signup failed. Please try again.';
            showFormError(err);
            setLoadingState(false);
        }
        });

    });

    //Login form submitted...
    $loginForm.on('submit', function (e) {

        e.preventDefault();


        // Flag this form as active
        setLoadingState(true, this);

        const email = $('#login-email').val().trim();
        const password = $('#login-password').val().trim();

        if (!email || !password) {
        showFormError('Email and password are required.');
        setLoadingState(false);
        return;
        }

        $.ajax({
        url: baseURL + 'api:xAumndFJ/auth/login',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ email, password }),
        success: function (response) {

            localStorage.setItem("authToken", response.authToken);
            localStorage.setItem("firstName", response.user.first_name);
            localStorage.setItem("lastName", response.user.last_name);
            localStorage.setItem("email", response.user.email);

            setLoadingState(false);
            
            window.location.href = "/app/home";

        },
        error: function (xhr) {
            const err = xhr.responseJSON?.message || 'Signup failed. Please try again.';
            showFormError(err);
            setLoadingState(false);
        }
        });

    });


    // Onboarding forms submitted...
    $onboardingGoogle.add($onboardingManual).on('submit', function (e) {

        e.preventDefault();


        const $onboardForm = $(this); // dynamic reference to the submitted form
        setLoadingState(true, this);

        const payload = createPayload($onboardForm);

        $.ajax({
            url: baseURL + 'api:xAumndFJ/onboarding_questions',
            type: 'POST',
            contentType: 'application/json',
            headers: {
                Authorization: "Bearer " + localStorage.authToken,
            },
            data: JSON.stringify(payload),
            success: function (response) {

                localStorage.setItem("firstName", response.first_name);
                localStorage.setItem("lastName", response.last_name);
                localStorage.setItem("email", response.email);
                if (response.avatar) {
                localStorage.setItem("avatar", response.avatar);
                }

                window.location.href = "/app/home";

                setLoadingState(false);

            },
            error: function (xhr) {

                const err = xhr.responseJSON?.message || 'Submission failed. Please try again.';
                showFormError(err);
                setLoadingState(false);
            }
        });

        
    });


    // Forgot Password form submitted...
    $forgotPassForm.on('submit', function (e) {

        e.preventDefault();


        // Flag this form as active
        setLoadingState(true, this);

        const email = $('[data-api-input="email"]').val().trim();

        $.ajax({
            url: baseURL + 'api:xAumndFJ/forgot_password',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ email }),
            success: function (response) {

                setLoadingState(false);
                alert('Email Sent' + response)

            },
            error: function (xhr) {
                const err = xhr.responseJSON?.message || 'Signup failed. Please try again.';
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