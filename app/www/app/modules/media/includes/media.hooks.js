/**
 * Implements hook_field_widget_form().
 * @param {Object} form
 * @param {Object} form_state
 * @param {Object} field
 * @param {Object} instance
 * @param {String} langcode
 * @param {Object} items
 * @param {Number} delta
 * @param {Object} element
 */
function image_field_widget_form(form, form_state, field, instance, langcode,
                                 items, delta, element) {
  try {
    // replace core widget form
    media_field_widget_form(form, form_state, field, instance, langcode, items, delta, element);
  }
  catch (error) {
    console.log('image_field_widget_form - ' + error);
  }
}

/**
 * Implements hook_field_widget_form().
 */
function file_field_widget_form(form, form_state, field, instance, langcode, items, delta, element) {
  try {
    // replace core widget form
    media_field_widget_form(form, form_state, field, instance, langcode, items, delta, element);
  }
  catch (error) {
    console.log('file_field_widget_form - ' + error);
  }
}
//# sourceURL=media.hooks.js
