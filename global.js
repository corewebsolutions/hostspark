// Store base URL Xano
let baseURL = "https://xukl-cktx-zcsb.n7e.xano.io/";

document.addEventListener("DOMContentLoaded", function() {

  if (localStorage.authToken == null) {
    //run code if they are not logged in
    alert("You are not logged in");
    window.location.href = "/auth/login";
  } else {
    authUser();
  }

});

function authUser() {

  showLoader();

  $.ajax({
    url: baseURL + "api:xAumndFJ/auth/me",
    type: "GET",
    headers: {
      'Content-Type': "application/json",
      'Authorization': "Bearer " + localStorage.authToken
    },
    success: function (data) {

      initApp();
      hideLoader();
    },
    error: function (error) {
      window.location.href = "/auth/login";
    }
  });

}

function initApp() {

  urlRouting();
  loadCurrentPage();
  dropDownNavigation();
  logOutUser();
  ajaxErrorHandler();
  loadUserAvatar();

}

// Toast
window.showToast = function (type, message) {
  const $toast = $('.toast');

  // Set background color
  if (type === 'success') {
    $toast.css('background-color', '#24B372');
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
    .animate({ top: '0px' }, 400)
    .delay(2500) 
    .animate({ top: '-100px' }, 400);
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

// Load User Avatar/Info
function loadUserAvatar() {

  const firstName = localStorage.getItem('firstName') || '';
  const lastName = localStorage.getItem('lastName') || '';
  const avatar = localStorage.getItem('avatar');

  const fullName = `${firstName} ${lastName}`.trim();

  // 1. Update full name in all elements with data=user_name
  $('[data=user_name]').text(fullName);
  $('[data=first_name]').text(firstName);

  // 2. Handle avatar display
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
  
}

// Global Loader Control
window.showLoader = function () {
  const $loader = $('.loader');

  if (!$loader.length) return;

  $loader.stop(true, true).css('opacity', 0).show().animate(
    { opacity: 1 },
    400, // duration
    'easeOutQuad' // easing (requires jQuery UI for named eases, otherwise default to 'swing')
  );
};

window.hideLoader = function () {
  const $loader = $('.loader');

  if (!$loader.length) return;

  $loader.stop(true, true).animate(
    { opacity: 0 },
    400,
    'easeOutQuad',
    function () {
      $loader.hide();
    }
  );
};


