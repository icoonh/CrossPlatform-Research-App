var force_authentication_front_page;

/**
 * Implements hook_install().
 */
function force_authentication_install() {
  try {
    force_authentication_front_page = drupalgap.settings.front;
  }
  catch (error) { console.log('force_authentication_install - ' + error); }
}

function logoutkenGeriGitme(e) { // back butonu icin prevent
  e.preventDefault();
}

/**
 * Implements hook_services_request_pre_postprocess_alter().
 */
 function force_authentication_services_request_pre_postprocess_alter(options, result) {
  try {
    // On a system connect preprocess, there is no guarantee the Drupal.user
    // object is accurate yet, so we need to look at the user object bundled in
    // the result instead.
    
    // Whenever a system connect is performed, check for anonymous users, if
    // they are anonymous, set the front page to the user login form.
    if (options.service == 'system' && options.resource == 'connect' &&
      result.user.uid == 0
    ) {
      drupalgap.settings.front = 'user/login';
	  document.removeEventListener("backbutton", drupalgap_back, false);
	  document.addEventListener("backbutton", logoutkenGeriGitme, false);
    }
  }
  catch (error) {
    console.log('force_authentication_services_request_pre_postprocess_alter - ' + error);
  }
}

/**
 * Implements hook_services_postprocess().
 */
function force_authentication_services_postprocess(options, result) {
  try {
    // When the user login service resource is successful, set the front page
    // back to its original value.
    if (options.service == 'user') {
      if (options.resource == 'login') {
        drupalgap.settings.front = force_authentication_front_page;
	    document.removeEventListener("backbutton", logoutkenGeriGitme, false);
	    document.addEventListener("backbutton", drupalgap_back, false); // back butonu tekrar aktif olsun - ANDROID
      }
      else if (options.resource == 'logout') {
        drupalgap.settings.front = 'user/login';
      }
    }
  }
  catch (error) {
    console('force_authentication_services_postprocess - ' + error);
  }
}

