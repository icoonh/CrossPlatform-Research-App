/**
 * 
 * Mobile Notifications: Add Push Notifications plugin support
 * ===========================================================
 * 
 * Install PhushPlugin from: https://github.com/phonegap-build/PushPlugin
 * 
 * Carlos Espino 2014
 * http://carlosespino.guatiza.org
 * 
 **/


/**
 * Config values
 */
var registration_url = 'http://xxx/drupalgap/push_notifications';
var get_token_url = "http://xxx/services/session/token";
var sender_id = "xxx";

/**
 * Load include js files
 */
function _mobile_notifications_dynamicJSload(url)
{
    var script = document.createElement('script');
    script.type = "text/javascript";
    if (script.readyState)
    {
        script.onreadystatechange = function(){
            if (script.readyState == "complete" || script.readyState == "loaded"){
                script.onreadystatechange = null;
            }
        };
    }
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

/**
* Implements hook_menu().
*/
/*function mobile_notifications_menu() { // ORIGINAL
  var items = {};
  items['mobile-notifications'] = {
    title: 'Genel Bildirimler',
    page_callback: 'mobile_notifications_notifications_page',
    options:{reloadPage:true},
  };
  return items;
}*/

function mobile_notifications_menu() { // ICOON
  var items = {};
  items['mobile-notifications'] = {
    title: l('<img src="' + drupalgap_get_path('module', 'mobilwit_stuff') + '/scubalogo.png" />', ''),
    page_callback: 'mobile_notifications_callback',
    pageshow:'mobile_notifications_pageshow',
    options:{reloadPage:true},
  };
  return items;
}

/**
* The callback for the mobile_notifications page.
*/
function mobile_notifications_notifications_page() {
  try {
    var content = {};
    content['mobile_notifications'] = {
      theme: 'view',
      format: 'table',
      format_attributes: {
				'border': '0px',
				'cellpadding': '10px',
				'cellspacing': '0px',
				'wdith': '100%',
			},
      path: 'mobile-notifications',
      row_callback: 'mobile_notifications_notifications_list_row',
      empty_callback: 'mobile_notifications_list_empty',
      attributes: {
        id: 'mobile_notifications_list_view'
      }
    };
	_badgesayacgenel = 0; // Icoon
												$('#anabildirimgenel').empty();
												$('#anabildirimgenel').append(_badgesayacgenel);
												
												$('#anabildirimgenel2').empty();
												$('#anabildirimgenel2').append(_badgesayacgenel);
    return content;
  }
  catch (error) { console.log('mobile_notifications - ' + error); }
}

/**
 * The row callback to render a single row.
 */
/*function mobile_notifications_notifications_list_row(view, row) {
  try {
		console.log("Mobile Test");
		dpm(row);
		attachment = '';
		if( row.Attachment){
			if( row.Attachment.length > 0 ){
				attachment =  ' - ' + l('view', 'node/'+ row.Attachment);
			}}
			content = '<td><div class="ui-body ui-body-a ui-corner-all">' + 
									'<h3>' + row.title + '</h3>' + 
									'<div>' + row.Message + '</div>' +
									'<div>'+  row.Posted + attachment + '</div>' +
								'</div></td>';
		

    return content;
  }
  catch (error) { console.log('mobile_notifications - ' + error); }
}*/


/*** MOBILE NOTIFICATION FIX - ICOON ***/

/**
 * The row callback to render a single row.
 */
function mobile_notifications_notifications_list_row(view, row) {
  try {
		console.log("Mobile Test");
		dpm(row);
		attachment = '';
		if( row.Ek){
			if( row.Ek.length > 0 ){
			var attachment ='<button type="button" id="baglanti_mobil" onclick="drupalgap_goto(\'renderednode/'+ row.Ek +'\')" class=" ui-btn ui-shadow ui-corner-all">Bağlantıya Git!</button>';
				//attachment =  ' - ' + l('Bağlantıya Git!', 'renderednode/'+ row.Ek);
			}}
			content = '<td><div class="ui-body ui-body-a ui-corner-all">' + 
									'<div>' + row.title + '<span class="mobiletarih"> (' + row.Posted  +')</span></div>' + 
									'<div>' + row.İleti + '</div><div>' + attachment + '</div>' +
								'</div></td>';
		

    return content;
  }
  catch (error) { console.log('mobile_notifications - ' + error); }
}

/**
 * Empty view callback
 */
function mobile_notifications_list_empty(view) {
  try {
    return 'Üzgünüz, hiç bir bildiriminiz yok.';
  }
  catch (error) { console.log('mobile_notifications - ' + error); }
}

/**
 * Implements hook_deviceready().
 */
function mobile_notifications_deviceready() {
	try{
		pushNotification = window.plugins.pushNotification;
			if (device.platform == 'android' || device.platform == 'Android' || device.platform == 'amazon-fireos' ) {
				pushNotification.register(successHandler, errorHandler, {"senderID":sender_id,"ecb":"onNotification"});
			}
			else {
				pushNotification.register(tokenHandler, errorHandler, {"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});
			}
	}
	catch(err){
		console.log('Push notification error'+err.message);
	}
}	

/**
 * handle APNS notifications for iOS
 */
function onNotificationAPN(e) {
		if (e.alert) {
			 navigator.notification.alert(e.alert);
		}

		if (e.sound) {
			var snd = new Media(e.sound);
			snd.play();
		}

		if (e.badge) {
			pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
		}
}

/**
 * handle GCM notifications for Android
 */
function onNotification(e) {
	switch( e.event ){
		case 'registered':
			if ( e.regid.length > 0 ){
				registerInServer(e.regid);
			}
			break;

		case 'message':
			if (e.foreground){
				navigator.notification.beep(1);
			}
			//drupalgap_goto('mobile-notifications', {reloadPage:true});
			break;

	case 'error':
		console.log('Push notification error:' + e.msg );
		break;

	default:
		console.log('EVENT -> Unknown, an event was received and we do not know what it is');
		break;
	}
}

function tokenHandler (result) {
		console.log('token: '+ result);
		// Your iOS push server needs to know the token before it can push to this device
		// here is where you might want to send it the token for later use.
}

function successHandler (result) {
		console.log('success:'+ result);
}

function errorHandler (error) {
		console.log('error:' + error );
}

function registerInServer(regid){
	$.ajax({
		url:get_token_url,
		type:"get",
		dataType:"text",
		error:function (jqXHR, textStatus, errorThrown) {
			console.log(textStatus);
		},
		success: function (token) {
			//Send session token, device id and device type to push_notifications drupal module
			$.ajax({
				url: registration_url,
				type: "post",
				dataType: "json",
				data: { 'token': regid , 'type':'android' },
				beforeSend: function (request) {
					request.setRequestHeader("X-CSRF-Token", token);
				},
				error: function (jqXHR, textStatus, errorThrown) {
					console.log(errorThrown);
				},
				success: function (data) {
					console.log(data);
				}
			});
		}
	});
}

_mobile_notifications_dynamicJSload('app/modules/custom/mobile_notifications/PushNotification.js');
