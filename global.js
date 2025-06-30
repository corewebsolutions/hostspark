// Store base URL Xano
let baseURL = "https://xukl-cktx-zcsb.n7e.xano.io/";

// Button Loader Animation
function setLoadingState(isLoading) {
  const $form = $('form.submitting');
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
}

// Form Dropdown Error Message
function showFormError(message) {
  const $form = $('form.submitting');
  if (!$form.length) return;

  const $errorBox = $form.find('[utility-comp="form-error"]');
  const $inner = $errorBox.find('div').first(); // Get the nested <div>

  if (!$errorBox.length || !$inner.length) return;

  $errorBox.stop(true, true).hide();
  $inner.text(message);

  $errorBox
    .slideDown(300)
    .delay(1500)
    .slideUp(300);
}