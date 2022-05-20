A DrupalGap module that sends anonymous users to the App's login page when the
app first loads. Also send users back to the login page when they logout.

Installation
============

Place this module in the app/modules folder and add this to the settings.js file:

`
Drupal.modules.contrib['force_authentication'] = {};
`

Setup
=====

It is up to you to make sure no blocks are visible on the user login and
registration pages within your app. That way, app users can't navigate away from
the login or registration pages within your app. Block visibility settings are
specified in your settings.js file.

To learn more about themes, regions and blocks, visit the DrupalGap getting
started guide: http://www.drupalgap.org/get-started
