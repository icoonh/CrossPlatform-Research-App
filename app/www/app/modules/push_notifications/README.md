# push_notifications

The Push Notifications module for DrupalGap helps users to send push messages from their Drupal website to devices.

## Installation

Before getting started, make sure you're running the latest versions of:

- PhoneGap/Cordova
- Android SDK(s)
- iOS/xCode

### Push Notifications Module for DrupalGap

First, download and extract this module so it lives here:

`app/modules/push_notifications`

Add it to the `settings.js` file:

`Drupal.modules.contrib['push_notifications'] = {};`

### PhoneGap Plugin Push

Then install the `PhoneGap Plugin Push`

https://github.com/phonegap/phonegap-plugin-push

```
cordova plugin add phonegap-plugin-push
cordova plugin save
```

#### Android Notes

You may have to run this command if you're having issues building for an Android device:

`android update sdk --no-ui --filter "extra"`

#### iOS Notes

You'll need to be running at least `cordova-ios@4.0.1` to get the build to compile proplery for iOS. To see your current version of the iOS platform:

`cordova platform ios`

Then if it isn't running at least `4.0.1`, then run this command:

`cordova platform update ios@4.0.1`

### Setting up a Platform(s)

Next, follow these steps for your desired platform(s):

#### Android

1. Go to https://console.cloud.google.com/home/dashboard
2. Create a new project (or use an existing one)
3. On the `Dashboard`, click `Enable and manage APIs`
4. Enable the `Google Cloud Messaging for Android` API
5. Once enabled, click `Go to Credentials`
6. Under `Where will you be calling the API from?` choose `Web server`
7. Click `What credentials do I need?`
8. Enter a `Name` for your web server
9. Click `Create API key`
10. Copy the API key and set it aside

#### iOS

> High level overview

```
cd ~/Desktop
openssl pkcs12 -clcerts -nokeys -out apns-dev-cert.pem -in apns-dev-cert.p12 
openssl pkcs12 -nocerts -out apns-dev-key.pem -in apns-dev-key.p12 
cat apns-dev-cert.pem apns-dev-key.pem > apns-dev.pem
scp apns-dev.pem me@example.com:~/
```

### Push Notifications Module for Drupal

1. Download and enable the Push Notifications module for Drupal: https://www.drupal.org/project/push_notifications
2. In Drupal, go to `admin/config/services/push_notifications/configure`
3. For Android, paste in the API key you generated earlier into this form
4. Click `Save configuration`
5. Go to `admin/structure/services/list/drupalgap/resources`
6. Check the box next to `push_notifications` to enable its `create` and `delete` resources
7. Click `Save`
8. Flush all of Drupal's caches

BEGIN: THIS SECTION MIGHT NOT BE NEEDED

Next, we'll head back to the Google Cloud Platform API (if you're working with Android)...

1. Go to https://console.cloud.google.com
2. Click on the `Credentials` button in the sidebar menu for your project
3. Click the `New credentials` button
4. Select `API key`
5. Click `Android key`
6. Enter a `Name` for your key, e.g. `example.com`
7. Click the `+ Add package name and fingerprint` button
8. Enter the `Package name`, which can be found as the value of the `package` attribute in the `manifest` element in the `AndroidManifest.xml` file
9. Open a terminal window and navigate to the root of your cordova project
10. Run this command: `keytool -genkey -v -keystore example.keystore -alias example -keyalg RSA -keysize 2048 -validity 10000`
11. Follow all the prompts and take note of the password you enter, because you'll need it later
12. Run this command: `keytool -exportcert -alias example -keystore example.keystore -list -v`
13. Copy the `SHA1` fingerprint
14. Go back to the Google window and paste in the `SHA1` fingerprint
15. Click `Create`, then copy the API key that is shown

END: THIS SECTION MIGHT NOT BE NEEDED

### Get an Android Sender ID

Next, get the `senderID` by...

1. Go to https://console.developers.google.com/home/dashboard
2. On your project's dashboard, you should see the `ID`
3. Click on the down arrow next to the `ID`
4. Copy the `Project number`, this will go into your `settings.js` file

### Adding config to settings.js

Next, add this to your app's `settings.js` file, using the `Project number` from above as the `senderID` below:

```
drupalgap.settings.push_notifications = {
  android: {
    senderID: "12345679"
  },
  ios: {
    alert: "true",
    badge: "true",
    sound: "true"
  },
  windows: {}
};
```

That's it, finally. You're now ready to send a push notification. Compile the app to a mobile device to test it out.

## Usage

### Sending a Push Notification

In Drupal, first go to `admin/config/services/push_notifications` and verify that a token has been registered for your
desired device(s). If there is a token registered, then go to  `admin/config/services/push_notifications/message` and
fill out the form to send a push notification to your desired platform(s).
