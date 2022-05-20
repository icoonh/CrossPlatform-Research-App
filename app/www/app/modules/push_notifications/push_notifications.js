var push = null;

function push_notifications_register() {

  // Initializes the plugin.
  push = PushNotification.init(drupalgap.settings.push_notifications);

  // Set up the registration, notification and error handlers.
  push.on('registration', function(data) {
    push_notifications_register_device_token(data.registrationId);
  });

  push.on('notification', function(data) {

    // data.message,
    // data.title,
    // data.count,
    // data.sound,
    // data.image,
    // data.additionalData


    // @TODO this would be a great spot for a hook.

    // Display the push notification.
    drupalgap_alert(data.message, {
      title: drupalgap.settings.title,
      buttonName: 'OK'
    });

  });

  push.on('error', function(e) { drupalgap_alert(e.message); });
}
/**
 * Implements hook_services_postprocess().
 */
function push_notifications_services_postprocess(options, result) {
  try {
    // When an authenticated user is connected, register a token.
    if (options.service == 'system' && options.resource == 'connect') {
      console.log("push_notifications Drupal.user.uid = " + Drupal.user.uid);
      if (Drupal.user.uid) { push_notifications_register(); 
        }
    }
    // When a user logs out, delete the token.
    else if (options.service == 'user' && options.resource == 'logout') {
      push_notifications_delete_device_token();
    }
  }
  catch (error) {
    console.log('push_notifications_services_postprocess - ' + error);
  }
}

function push_notifications_register_device_token(token) {
  var push_token = localStorage.getItem('push_notifications_token');
  if (push_token === null || push_token != token) {
    var data = {
      'token': token,
      'type': push_notifications_platform_token(device.platform),
    };
    // give other modules a chance to react to registering a push notification
    module_invoke_all('push_notifications_register');
    push_notifications_create(data, {
      success: function(result) {
        if (result['success'] == 1) {
          localStorage.setItem("push_notifications_token", token);
        }
      }
    });
  }
}

function push_notifications_delete_device_token() {
  var push_token = localStorage.getItem('push_notifications_token');
  if (push_token != null) {
    push_notifications_delete(push_token, {
      success: function(result) {
        if (result['success'] == 1) {
          window.localStorage.removeItem("push_notifications_token");
        }
      }
    });
  }
}

function push_notifications_create(data, options) {
  try {
    options.method = 'POST';
    options.path = 'push_notifications';
    options.service = 'push_notifications';
    options.resource = 'push_notifications';
    options.data = JSON.stringify(data);
    Drupal.services.call(options);
  }
  catch (error) {
    console.log('push_notifications_create - ' + data);
  }
}
function push_notifications_delete(token, options) {
  try {
    options.method = 'DELETE';
    options.path = 'push_notifications/' + token;
    options.service = 'push_notifications';
    options.resource = 'push_notifications';
    Drupal.services.call(options);
  }
  catch (error) {
    console.log('push_notifications_delete - ' + token);
  }
}

function push_notifications_platform_token(platform) {
  var token;
  switch (platform) {
    case "iOS":
      token = 'ios';
      break;
    case "Android":
      token = 'android';
      break;
    default:
      token = null;
      break;
  }
  return token;
}
