/*** Offlinewit - Offline sayfa gosterimi ***/ // Drupalgap bu konuda out of box cok kotu, fix modulu
function offlinewit_install() {
  try {
    var css_file_path =
      drupalgap_get_path('module', 'offlinewit') + '/offlinewit.css';
    drupalgap_add_css(css_file_path);
    console.log('offlinewit install - bitti.');
  }
  catch (error) { console.log('offlinewit_install - ' + error); }
}

function offlinekenGeriGitme(e) { // back butonu icin prevent
  e.preventDefault();
}

function offlinewitPage(){
      //navigator.notification.alert('Internet bağlantınız sağlanamadı.', null, "Bağlantı hatası", "Kapat");
	  document.removeEventListener("backbutton", drupalgap_back, false);
	  document.addEventListener("backbutton", offlinekenGeriGitme, false); // back butonu calismasin - ANDROID
      drupalgap_goto('offline');
    }


function offlinewitPageBack(){
	
	var drupalgap_path = drupalgap_path_get();
	var page_id = drupalgap_get_page_id(drupalgap_path); // su anki sayfanin id'si
	
	console.log("Offlinewit - Şu anki sayfa: " + page_id);

	if (page_id == 'offline') {
           
      //navigator.notification.alert('Internet bağlantınız tekrar sağlandı!', null, "Bağlantı kuruldu", "Kapat");
	  document.removeEventListener("backbutton", offlinekenGeriGitme, false);
	  document.addEventListener("backbutton", drupalgap_back, false); // back butonu tekrar aktif olsun - ANDROID

        console.log("backpath değeri: " + drupalgap.back_path); 
		


      if(drupalgap.back_path && drupalgap.back_path != '') drupalgap_back(); // history'ye bakiyoruz, gecmis varsa offlinedan bir onceye don
      else{
              document.addEventListener("offline", offlinewitPage, false);

              document.addEventListener("online", offlinewitPageBack, false);

              drupalgap_goto(''); // ilk defa online oluyorsak anasayfaya git
        }
	  } // genel if, bu fonksiyon sadece offline sayfasindayken calissin
    }




/**** Deviceready hook ****/



function offlinewit_deviceready() {

  try{

/**
 * Her touch hareketinde kontrol edilecek, eger kullanici kopmussa offline sayfa gosterilecek
 * Herhangi bir not found eventinde de / server erisilemiyor durumunda da kill edip offline sayfaya yonlendirmeliyiz
 */

 // Karmasaya gerek yok, bu sekilde halledebiliyoruz

    document.addEventListener("offline", offlinewitPage, false);

    document.addEventListener("online", offlinewitPageBack, false);

  } // deviceready try sonu
    catch (error) { console.log('offlinewit_deviceready - ' + error); }
    console.log("offlinewit event listener'lar eklendi");
  }


/**
 * Call back for the offline page.
 * @return {Object}
 */
function system_offline_page() {
  try {
    var content = {
      'message': {
        'markup': "<h2>BAĞLANTI KURULAMADI :(</h2><img style='max-width: 40%;' src='"+ drupalgap_get_path('module', 'offlinewit') + "/checkingirl_2.png' />" +
          "<p>" + "Şu anda Origami ile bağlantı kurulamıyor.<br>Lütfen internet bağlantınızı kontrol edin.</p>" 
           //+ '<p>' + Drupal.settings.site_path + '</p>'
      },
      'try_again': {
        'theme': 'button',
        'text': t('Tekrar Dene'),
        'attributes': {
          'onclick': 'javascript:offline_try_again_wit();'
        }
      },
      'footer': {
        'markup': '<p class="footerofflinewit">Cihazınızın bağlantısını kontrol edip tekrar deneyin.</p>'
      }
    };
	
	document.removeEventListener("backbutton", drupalgap_back, false); // Her ihtimale karsi
	document.addEventListener("backbutton", offlinekenGeriGitme, false); // Her ihtimale karsi
	
    return content;
  }
  catch (error) { console.log('system_offline_page - ' + error); }
}

/**
 * When the 'try again' button is clicked, check for a connection and if it has
 * one make a call to system connect then go to the front page, otherwise just
 * inform user the device is still offline.
 * @return {*}
 */
function offline_try_again_wit() {
  try {
    var connection = drupalgap_check_connection();
    if (drupalgap.online) {
      system_connect({
        success: function() {
          navigator.notification.alert('Internet bağlantınız tekrar sağlandı!', null, "Bağlantı kuruldu", "Kapat");
          console.log("backpath değeri: " + drupalgap.back_path);
          if(drupalgap.back_path && drupalgap.back_path != '') drupalgap_back(); // mobilwitstuff check degerine bakiyoruz, offlinedan bir onceye don
          else {
              document.addEventListener("offline", offlinewitPage, false);

              document.addEventListener("online", offlinewitPageBack, false);

              drupalgap_goto(''); // ilk defa online oluyorsak anasayfaya git
            }
        } // success!
      });
    }
    else {
      var msg = t('Üzgünüz, hala bağlantınız yok...') + ' (' + connection + ')';
      drupalgap_alert(msg, {
          title: 'Bağlantı Kurulamadı'
      });
      return false;
    }
  }
  catch (error) { console.log('offline_try_again_wit - ' + error); }
}