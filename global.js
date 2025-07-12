// Store base URL Xano
let baseURL = "https://xukl-cktx-zcsb.n7e.xano.io/";
let loaderAnimation = null;


function authUser() {

  if (localStorage.authToken == null) {
    //run code if they are not logged in
    alert("You are not logged in");
    window.location.href = "/auth/login";
  } else {
    initApp();
  }



}

function initApp() {

  // load time-select options in forms for event (start and end)
  document.querySelectorAll('.dropdown-options[data-type="time"]').forEach(dropdown => {
    generateTimeOptions(dropdown, true);
  });

  // Auto-select user's time zone if it matches
  const detectedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  document.querySelectorAll('.custom-dropdown[data-key="timezone"]').forEach(dropdown => {
    const selected = dropdown.querySelector('.dropdown-selected');
    const input = dropdown.querySelector('.dropdown-hidden-input');
    const options = dropdown.querySelectorAll('.dropdown-option');

    options.forEach(option => {
      if (option.getAttribute('data-value') === detectedTimeZone) {
        selected.textContent = option.textContent;
        if (input) input.value = detectedTimeZone;
      }
    });
  });

  // handle lottie loader
  const container = document.getElementById('lottie-loader');

  if (container) {
    loaderAnimation = lottie.loadAnimation({
      container: container,
      renderer: 'svg',
      loop: true,
      autoplay: false,
      path: 'https://cdn.prod.website-files.com/685d6bd609529912897b9e0d/6871e51081428b13e9e2d62f_lottieflow-loading-08-142227-easey.json' 
    });
      // Speed up the animation
      loaderAnimation.setSpeed(1);
  }

  authMe();
  urlRouting();
  loadCurrentPage();
  dropDownNavigation();
  logOutUser();
  ajaxErrorHandler();
  loadUserAvatarSettings();

}

// Toast
window.showToast = function (type, message) {
  const $toast = $('.toast');

  // Set background color
  if (type === 'success') {
    $toast.css('background-color', '#03d37e');
  } else if (type === 'error') {
    $toast.css('background-color', '#ff5050');
  } else {
    console.warn('Invalid toast type');
    return;
  }

  // Set message
  $toast.find('div').text(message);

  // Slide down
  $toast
    .stop(true, true)
    .css('display', 'flex')
    .animate({ bottom: '0px' }, 400)
    .delay(2500) 
    .animate({ bottom: '-100px' }, 400);
};

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

// URL Router
function urlRouting() {

  // Attach click handlers to all nav links
  const navLinks = document.querySelectorAll('.primary-nav-link');

  navLinks.forEach((link) => {
    const navLinkId = link.id;

    link.addEventListener('click', (e) => {
      e.preventDefault(); // prevent default anchor behavior

      const targetPath = `/app/${navLinkId}`;
      history.pushState(navLinkId, null, targetPath);

      localStorage.setItem('pageId', navLinkId);
      localStorage.removeItem('pageRefreshParam');

      $('.primary-nav-link').removeClass('active-tab');
      $(`#${navLinkId}`).addClass('active-tab');
    });
  });

  // Handle back/forward browser events
  window.addEventListener('popstate', function (event) {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const state = event.state;

    const routeMatch = (segment) => path.includes(`/app/${segment}`) && id;

    if (routeMatch('event')) {
      localStorage.setItem('pageId', 'event');
      localStorage.setItem('pageRefreshParam', id);
      $('#event').click();

    } else if (routeMatch('ticket')) {
      localStorage.setItem('pageId', 'ticket');
      localStorage.setItem('pageRefreshParam', id);
      $('#ticket').click();

    } else if (routeMatch('attendee')) {
      localStorage.setItem('pageId', 'attendee');
      localStorage.setItem('pageRefreshParam', id);
      $('#attendee').click();

    } else if (state) {
      localStorage.setItem('pageId', state);
      localStorage.removeItem('pageRefreshParam');
      $(`#${state}`).click();
    }
  });
}
 
// Load Current Page
function loadCurrentPage() {

  /* This function loads the correct screen if the user refreshes a page */
  let currentPage = localStorage.getItem("pageId");
  setTimeout(() => {
    $("#" + currentPage).click(); // open tab of page id
    history.pushState(currentPage, null, "/app/" + currentPage); // log history and update url

    // Check if the currentPage is "profile," "property," or "unit"
    if (["event", "ticket", "attendee"].includes(currentPage)) {
      // Get the value from local storage
      let pageRefreshParam = localStorage.getItem("pageRefreshParam");

      // Add the URL parameter to the history
      history.pushState(
        currentPage,
        null,
        "/app/" + currentPage + "?id=" + pageRefreshParam
      );
    }
  }, 100);


}

// Logout Functionality
function logOutUser() {

  $("#logout-button").on("click", function () {

  localStorage.clear();
  window.location.href = "/auth/login";

});

}

// Global Network Error Handling
function ajaxErrorHandler() {

    /* Global Ajax Errors Handling */
    $(document).ajaxError(function(event, jqXHR, settings, thrownError) {

      // Retrieve the error code and response text
      var errorCode = jqXHR.status;
      var errorMessage = jqXHR.responseText;


      // Try to parse the responseText to JSON if the API response is JSON
      try {
          var responseJson = JSON.parse(jqXHR.responseText);
          errorMessage = responseJson.message || responseJson.error || errorMessage;
      } catch (e) {
          // responseText wasn't JSON, use the raw responseText
      }

      console.log("Parsed Error Message: " + errorMessage);

      // Check if the error is a 401 Unauthorized or 500 with the specific message
      if ((errorCode === 401 && (errorMessage.includes("This token is expired.") || errorMessage.includes("Invalid token"))) || 
          (errorCode === 500 && errorMessage.includes("Unable to locate auth: extras.user_id"))) {

          alert('Session Expired');
          logOutUser();
          
      } else if (errorMessage.includes("Unable to locate auth: extras.user_id")) {
          alert('Unable to Authenticate User');
          logOutUser();

      } else {

          alert("An error has occured. Please try again.");

          // Prepare the error data as a single JSON object
          var errorData = JSON.stringify({
            endpoint: settings.url,
            error_code: errorCode,
            error_message: errorMessage,
            status: jqXHR.statusText,
            response: parseJsonSafe(jqXHR.responseText),
            request: settings.data ? parseJsonSafe(settings.data) : null,
            user: localStorage.userId
          });

        // Send the error data to your server
        $.ajax({
            type: "POST",
            url: baseURL + "api:LmBMPU1T/record_error",
            contentType: "application/json",
            data: errorData, // Send the stringified JSON object
            success: function(response) {

            },
            error: function(response) {

            }
        });
      }


    });

}

// Dropdown Navigation
function dropDownNavigation() {

  $('#top-nav-account-settings').on('click', function (e) {
    e.preventDefault();
    localStorage.setItem("pageId", "account-settings");
    localStorage.removeItem("pageRefreshParam");
    history.pushState("account-settings", null, "/app/account-settings");
    $('#account-settings').click();
  });

  $('#top-nav-support').on('click', function (e) {
    e.preventDefault();
    localStorage.setItem("pageId", "support");
    localStorage.removeItem("pageRefreshParam");
    history.pushState("support", null, "/app/support");
    $('#support').click();
  });

  $('#top-nav-feedback').on('click', function (e) {
    e.preventDefault();
    localStorage.setItem("pageId", "feedback");
    localStorage.removeItem("pageRefreshParam");
    history.pushState("feedback", null, "/app/feedback");
    $('#feedback').click();
  });

}

window.showLoader = function () {

  $('.primary-content').fadeOut(500, 'swing');
  
  setTimeout(() => {
    $('#global-loader').fadeIn(600, 'swing');
    if (typeof loaderAnimation?.play === 'function') {
      loaderAnimation.play();
    }
  }, 200); // overlap by starting loader fade in after 200ms
};

window.hideLoader = function () {
  // Delay before starting to fade out loader (adjust this as needed)
  setTimeout(() => {
    // Start fading out the loader
    $('#global-loader').fadeOut(500, 'swing');

    // Slight overlap: begin fading content in shortly after
    setTimeout(() => {
      $('.primary-content').fadeIn(600, 'swing');
    }, 200); // Content fades in while loader is still fading out

    // Stop Lottie after full loader fade-out
    setTimeout(() => {
      if (typeof loaderAnimation?.stop === 'function') {
        loaderAnimation.stop();
      }
    }, 550); // Just after fadeOut completes (500ms)
  }, 750); // ← initial delay before hiding loader starts
};


function userLocalStorageSettings(response) {

  localStorage.setItem("firstName", response.user.first_name);
  localStorage.setItem("lastName", response.user.last_name);
  localStorage.setItem("email", response.user.email);
  localStorage.setItem("planId", response.user.stripe_plan_id);
  if (response.user.avatar){
  localStorage.setItem("avatar", response.user.avatar);
  }

}

// Load User Avatar/Info
function loadUserAvatarSettings() {

  const firstName = localStorage.getItem('firstName') || '';
  const lastName = localStorage.getItem('lastName') || '';
  const avatar = localStorage.getItem('avatar');

  const fullName = `${firstName} ${lastName}`.trim();

  //  Update full name in all elements with data=user_name
  $('[data=user_name]').text(fullName);
  $('[data=first_name]').text(firstName);

  //  Handle avatar display
  const $avatarImg = $('[data=avatar]');
  const $avatarFallback = $('[data=avatar-fallback]');

  if (avatar != null) {
    $avatarImg.attr('src', avatar).css('display', 'block');
    $avatarFallback.css('display', 'none');
  } else {
    $avatarImg.css('display', 'none');
    const initials =
      (firstName.charAt(0) || '') + (lastName.charAt(0) || '');
    $avatarFallback.text(initials.toUpperCase()).css('display', 'flex');
  }

  // show upgrade pro tools block - bottom left
  if (localStorage.getItem('planId') == 'e15f9227-0254-4b70-8401-ba31cd9cd911') {
    $('.starter-upgrade-block').show();
  } else {
    $('.starter-upgrade-block').remove();
  }
  
}

function authMe() {

  showLoader();
  $.ajax({
    url: baseURL + 'api:xAumndFJ/auth/me',
    type: 'GET',
    contentType: 'application/json',
      headers: {
      Authorization: "Bearer " + localStorage.authToken,
    },
    success: function (response) {

        localStorage.setItem('planId', response.price_id);
        localStorage.setItem('planGroup', response.group_id);

        $('.plan-name-nav').text(response.name);

        if (response.group_id == 0) {
          $('.starter-upgrade-block').css('display','flex');
          $('.plan-counter').remove();

        } else {
          $('.starter-upgrade-block').remove();
          $('.plan-counter').css('display','flex');
        }

        hideLoader();

    },
    error: function (xhr) {
        const err = xhr.responseJSON?.message || 'Login failed. Please try again.';
        setLoadingState(false);
        localStorage.clear();
        window.location.href = "/auth/login";
    }
  });

}

// generate 15 min increment time options for form fields
function generateTimeOptions(dropdownEl) {
  const formatTime = (h, m) => {
    const h12 = h % 12 || 12;
    const ampm = h < 12 ? 'AM' : 'PM';
    return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const value = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
      const option = document.createElement('div');
      option.className = 'dropdown-option';
      option.setAttribute('data-value', value);
      option.textContent = formatTime(h, m);
      dropdownEl.appendChild(option);
    }
  }
}
