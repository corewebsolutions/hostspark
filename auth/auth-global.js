let baseURL = "https://xukl-cktx-zcsb.n7e.xano.io/";

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
