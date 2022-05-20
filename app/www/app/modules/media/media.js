/**
 * Implements hook_install().
 * This hook is used by modules that need to execute custom code when the module
 * is loaded. Note, the Drupal.user object is not initialized at this point, and
 * always appears to be an anonymous user.
 */
function media_install() {
  try {
    drupalgap_add_js('app/modules/media/includes/media.fields.js');
    drupalgap_add_js('app/modules/media/includes/media.theme.js');
    drupalgap_add_js('app/modules/media/includes/media.helpers.js');
    drupalgap_add_js('app/modules/media/includes/media.hooks.js');
  }
  catch (error) { console.log('media_install - ' + error); }
}
//# sourceURL=media.js