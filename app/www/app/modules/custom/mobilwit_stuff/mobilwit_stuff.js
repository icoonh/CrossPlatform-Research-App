/****  SCUBA V7 FİKİRSENSİN EDITION - AYKUN HADDELER  ****/

/**
 * Implements hook_install().
 */
function mobilwit_stuff_install() {
  try {
    var css_file_path =
	  drupalgap_get_path('module', 'mobilwit_stuff') + '/fontcss/robotocss.css'; // font library
    drupalgap_add_css(css_file_path);
	css_file_path =
      drupalgap_get_path('module', 'mobilwit_stuff') + '/mobilwit_stuff.css';
    drupalgap_add_css(css_file_path);
	/***css_file_path =
      drupalgap_get_path('module', 'mobilwit_stuff') + '/emoji.css'; // JS Emoji ***/
    drupalgap_add_css(css_file_path);
	
	/***var js_file_path = drupalgap_get_path('module', 'mobilwit_stuff') + '/emoji.js'; // JS EMOJI
	drupalgap_add_js(js_file_path);  ***/
	
    console.log('mobilwit_install - bitti.');
  }
  catch (error) { console.log('mobilwit_install - ' + error); }
}

/*GLOBAL*/
var mobilwit_arg = 0;
var _mobilwit_popup = true;
var _badgesayac = 0;
var _badgesayacgenel = 0;
var _badgesayacozel = 0;
var _kullanici_id = 0;
var _kullanici_rol = 0; /*roleswitcher check*/
var _rolbutonvalue = 0;
var _son_bildirim = 0;
var _son_genel_bildirim = 0;
var _aktif = true;
var _aktifcall = false;
var _nodeaddsayfasi = false;
var intervalID; /*global func*/
var intervalIDactive;
var tekrarengelleme = 0; /*global identifier*/
var _offlinebaglandimi = true;
var ilhamhide = true;

var push = null; // push

/**** JS EMOJI INIT ****/

/***var emoji;***/


var _mesajlar = [
	"Yine bekleriz!",
	"Yeni görevler için yine gel!",
	"Origami'yi sık sık kontrol etmeyi unutma!",
	"Diğerleri görevlerine devam ediyor! Sen de arayı açma!"
	];

	 /***Genel bildirim check***/ /*** YoungnBold v2'de kaldirildi - geri konuldu ***/
  
  function appGenelBildirim() {
      
      if(Drupal.user){ // sadece online ise process olsun
  
            // Modify the currently displayed notification
            drupalgap_loading_message_hide();
	
	var kullanici = Drupal.user;
	var roller = '';
	//dpm(Drupal.user);
	$.each(kullanici.roles, function(rid, value) {
	rid = rid - 2; // rol referanslari 1'den basliyor
	if (rid != 8) // roleswitcher pas gecilsin
	{
	if (roller == '') roller = rid;
	else roller += ',' + rid;
	}
	if (roller == '0' || roller == '7') roller = ''; // authenticated ve yonetici pas gecilsin
	});
	
	if (roller == '') // sadece authenticated ise
	roller = 'all'; // hepsini gorsun
	
	views_datasource_get_view_result('mobile_notifications_flagged/' + roller,{ // goreve eklenen icerikler
	success:function(data) {

	var counter = data.view.count;
	//var tek = 1;
	
	_badgesayacgenel = counter;
	
	$('#anabildirimgenel').empty();
	$('#anabildirimgenel').append(_badgesayacgenel);
	
	$('#anabildirimgenel2').empty();
	$('#anabildirimgenel2').append(_badgesayacgenel);
	
	$('#anabildirimgenel3').empty();
	$('#anabildirimgenel3').append(_badgesayacgenel);
	
	   cordova.plugins.notification.badge.get(function (badgerakamset) {

	var badgerakam = _badgesayacozel + _badgesayacgenel;
	    console.log("appGenelBildirim Badge rakamı 1: " + badgerakam);
            console.log("appGenelBildirim Badge rakamı 2 (badge): " + badgerakamset);
	   
	   if (badgerakam == 0) cordova.plugins.notification.badge.clear();
	   if (badgerakamset > badgerakam){
	   	  var farkbadge = badgerakamset - badgerakam;
	   	  cordova.plugins.notification.badge.decrease(farkbadge); // set etmek yerine decrease diyelim, set daha dusuk bir degere almiyor)
	   }
	   else{
	   	cordova.plugins.notification.badge.set(badgerakam);
	   }

	              console.log("appGenelBildirim Badge rakamı 3 (farkbadge): " + farkbadge);


	   	}); // badge.get sonu 


	   }});
      
                        //console.log("sayaclar appGenelBildirim: ozel - " + _badgesayacozel + " - genel - " + _badgesayacgenel);
	   
	   drupalgap_loading_message_hide();
          
      } // end if drupal user is onine

  };
  
  
  /*** Ozel bildirim check***/
  
  function appAktifLoop() {
       
       if(Drupal.user){
  
            // Modify the currently displayed notification
            drupalgap_loading_message_hide();
	
	//appGenelBildirim();
	
	views_datasource_get_view_result('drupalgap/bildirimlerim/' +  _kullanici_id,{ // goreve eklenen icerikler
	success:function(data) {

	var counter = data.view.count;
	
	//console.log("Badge - " + _badgesayac + " - Counter - " + counter);
	
	//var fark = counter - _badgesayacozel; // bunu sadece appGenelBildirim ile yapalım
	
	_badgesayacozel = counter;
	
	$('#anabildirim').empty();
	$('#anabildirim').append(_badgesayacozel);
	
	$('#anabildirim2').empty();
	$('#anabildirim2').append(_badgesayacozel);
	
	$('#anabildirim3').empty();
	$('#anabildirim3').append(_badgesayacozel);
	
	//cordova.plugins.notification.badge.get(function (badgerakamset) { ... } // // bunu sadece appGenelBildirim ile yapalım

              // cordova.plugins.notification.local.schedule({ badge: badgerakam, sound: null }); // BADGE NOTIFICATION 
	} // success end
	}); // datasource end
       } // log in check end
  };



function mobilwit_stuff_deviceready() {

	codePush.sync(); // cordova-plugin-code-push

	document.addEventListener("resume", function () {
    codePush.sync();
	});
	
	document.addEventListener("pause", onPause, false);
	console.log('mobilwit_stuff_deviceready before try');
	
  try {

  	/***** PUSH INIT  ****/

  	appwit();
	
	/****** Badge notification android translation and small icon *****/
	
	//cordova.plugins.notification.badge.configure({ title: 'FikirSensin\'de %d bildirimin var!' });
	//cordova.plugins.notification.badge.configure({ smallIcon: 'icon' });

      /*var d = new Date();
  
  cordova.plugins.notification.local.schedule({
	id: 10,
	title: "Check-In'den sana mesaj var!",
	text: "Bugün Check-In yaptın mı?",
	every: "day",
                                              firstAt: new Date(d.getFullYear(), d.getMonth(), d.getDate()+1,13,0,0,0),
	icon: drupalgap_get_path('module', 'mobilwit_stuff') + '/icon.png' ,
	smallIcon: drupalgap_get_path('module', 'mobilwit_stuff') + '/icon.png',
	});*/ // todo Bunu tutuyorduk, pushtan sonra degerlendirelim

  
  //intervalID = setInterval(appAktifLoop, 12000); // push notification ile kaldiriyoruz
	
 // splashscreen gitsin
 
	/**** EMOJI INITIATE ****/
 
	/***emoji = new EmojiConvertor();

	emoji.img_sets = {
	'apple'    : {'path' : drupalgap_get_path('module', 'mobilwit_stuff') + '/emoji/', 'sheet' : drupalgap_get_path('module', 'mobilwit_stuff') + '/emoji/sheet_apple_64.png', 'mask' : 1 }
	};

	emoji.use_sheet = true;

	emoji.init_env();

	emoji.colons_mode = false;
	//emoji.replace_mode = 'unified';
    emoji.img_set = 'apple';
	emoji.text_mode = false;***/
	

  } // deviceready try sonu
  catch (error) { console.log('mobilwit_stuff_deviceready - ' + error); }
}

function onPause(){
	appGenelBildirim(); //YoungnBold V2'de kaldirildi - geri konuldu
	appAktifLoop();
}

function mobilwit_updatevar(nid, type) { // referans olacak gorev ve kaydedilecek icerik tipi
   mobilwit_arg = nid; // Update global variable -- gorev ittirme icin uid degeri
   console.log('MOBILWIT ARG: ' + mobilwit_arg);
	if(type == "deneyim")
	drupalgap_goto('node/add/deneyim'/*, {transition:'flow'}*/);
	else if(type == "fotograf")
	drupalgap_goto('node/add/fotograf');
	else if(type == "video")
	drupalgap_goto('node/add/video');
	else if(type == "gif")
	drupalgap_goto('node/add/gif');
	//drupalgap_goto('yakinda', {transition:'flow'});
	else if(type == "g_rev")
	drupalgap_goto('node/add/g_rev');
	else
	drupalgap_goto('introduction'); // olmayan bir icerik eklenmeye calisilirsa
   //drupalgap_goto('addimage'); // Go to add image custom form
}

/**
 * Implements hook_menu().
 */
function mobilwit_stuff_menu() {
  var items = {};
  items['introduction'] = {  	///// Giris sayfası
    title: '<img src="' + drupalgap_get_path('module', 'mobilwit_stuff') + '/scubalogo.png" />',
    page_callback: 'mobilwit_introduction',
	pageshow: 'badge_refresh'
  };
  items['gorev'] = {
        title: l('<img src="' + drupalgap_get_path('module', 'mobilwit_stuff') + '/scubalogo.png" />', '', {reloadPage:true}),
      page_callback:'mobilwit_gorevler',
      pageshow:'mobilwit_gorevler_pageshow',
	  options:{
	reloadPage:true
	  }
  };
  items['gorevler/%'] = { // kategoriler
        title: l('<img src="' + drupalgap_get_path('module', 'mobilwit_stuff') + '/scubalogo.png" />', '', {reloadPage:true}),
      page_callback:'mobilwit_gorevler_2',
	  page_arguments: [1],
      pageshow:'mobilwit_gorevler_pageshow_2',
	  options:{
	reloadPage:true
	  }
  };
  items['ilhamlar'] = {
        title: l('<img src="' + drupalgap_get_path('module', 'mobilwit_stuff') + '/scubalogo.png" />', '', {reloadPage:true}),
      page_callback:'mobilwit_ilhamlar',
      pageshow:'mobilwit_ilhamlar_pageshow',
	  options:{
	reloadPage:true
	  }
  };
  /*items['activitylist/%'] = { // Kalkacak
      title:'Activity List',
      page_callback:'mobilwit_activities_images',
	  page_arguments: [1],
      pageshow:'mobilwit_activities_images_pageshow'
  };*/
  items['renderednode/%'] = { // Override default node pageview - Gorev ve digerleri
        title: l('<img src="' + drupalgap_get_path('module', 'mobilwit_stuff') + '/scubalogo.png" />', '', {reloadPage:true}),
        page_callback: 'mobilwit_node_page_view',
        page_arguments: [1],
        pageshow: 'mobilwit_node_page_view_pageshow',
        title_callback: 'node_page_title',
        title_arguments: [1],
	  options:{
	reloadPage:true
	  }
      };
	/*items['node/%'] = { // Override default node pageview - Gorev
        title: 'Node',
        page_callback: 'mobilwit_node_page_view',
        page_arguments: [1],
        pageshow: 'mobilwit_node_page_view_pageshow',
        title_callback: 'node_page_title',
        title_arguments: [1],
	  options:{
	reloadPage:true
	  }
      };*/
  items['user/%'] = { // Override default user pageview - Kullanici
        title: l('<img src="' + drupalgap_get_path('module', 'mobilwit_stuff') + '/scubalogo.png" />', '', {reloadPage:true}),
        page_callback: 'mobilwit_user_page_view',
        page_arguments: [1],
        pageshow: 'mobilwit_user_page_view_pageshow',
        title_callback: 'user_view_title',
        title_arguments: [1],
	  options:{
	reloadPage:true
	  }
      };
  /*items['renderednode/image/%'] = { // Override default node pageview - Goreve eklenmis resim
        title: 'Node',
        page_callback: 'mobilwit_node_page_view',
        page_arguments: [2],
        pageshow: 'mobilwit_image_node_page_view_pageshow',
        title_callback: 'node_page_title',
        title_arguments: [2]
      };*/
  /*items['node/add/gorev/%'] = { // Override gorev add form with argument
        title: 'Share Image',
        page_callback: 'mobilwit_node_add_page_by_type',
        page_arguments: [3],
	options: {reloadPage: true}
      };*/
  /*items['challenge'] = {
      title:'Scuba',
      page_callback:'mobilwit_gorevler_4',
	  page_arguments: [1],
      pageshow:'mobilwit_gorevler_pageshow_4',
	  options:{
	reloadPage:true
	  }
  };*/
  items['tamamladiklarim'] = {
        title: l('<img src="' + drupalgap_get_path('module', 'mobilwit_stuff') + '/scubalogo.png" />', '', {reloadPage:true}),
      page_callback:'mobilwit_gorevler_3',
	  page_arguments: [1],
      pageshow:'mobilwit_gorevler_pageshow_3',
	  options:{
	reloadPage:true
	  }
  };
  items['kullanicilar'] = {
        title: l('<img src="' + drupalgap_get_path('module', 'mobilwit_stuff') + '/scubalogo.png" />', '', {reloadPage:true}),
      page_callback:'mobilwit_kullanicilar',
      pageshow:'mobilwit_kullanicilar_pageshow'
  };
  /*items['mostliked'] = {
      title:'Scuba',
      page_callback:'mobilwit_mostliked',
      pageshow:'mobilwit_mostliked_pageshow'
  };*/
  items['paylasilanlar'] = {
        title: l('<img src="' + drupalgap_get_path('module', 'mobilwit_stuff') + '/scubalogo.png" />', '', {reloadPage:true}),
      page_callback:'mobilwit_paylasilanlar',
      pageshow:'mobilwit_paylasilanlar_pageshow',
	  options:{
	reloadPage:true
	  }
  };
  items['bildirimlerim'] = {
        title: l('<img src="' + drupalgap_get_path('module', 'mobilwit_stuff') + '/scubalogo.png" />', '', {reloadPage:true}),
      page_callback:'mobilwit_bildirimlerim',
      pageshow:'mobilwit_bildirimlerim_pageshow',
	  options:{
	reloadPage:true
	  }
  };

	  
  return items;
}

function badge_refresh() {
	//cordova.plugins.notification.badge.clear();

	/* var applaunchCount = window.localStorage.getItem('launchCount');

  	if(applaunchCount){
  	console.log("applaunchCount > 0");
  	}
  	else{
  	console.log("applaunchCount doesn't exist...");
  	window.localStorage.setItem('launchCount', 1);
  	toastwitmesaj_1(); // ilk defa kurana help gosterilsin
  	} */ // IOS 8den itibaren localstorage cok sorunlu, sadece temporary olarak kullanilmaya baslanmis

  	var firstlogin = plugins.appPreferences; // apppreferences plugin

  	firstlogin.fetch (function (ok) {
	if (ok === null) {
	console.log("LoggedinBefore key var, deger yok. - FIRSTLOGIN");

	toastwitmesaj_1(); // -----> ilk defa kurana help gosterilsin

	firstlogin.store(function (ok) { // Yeni deger koyalim
	console.log("LoggedinBefore true olarak kaydedildi");
	}, function (err) {
	console.log("LoggedinBefore kaydedilemedi: " + err);
	}, "LoggedinBefore", true);// store bitti, "LoggedinBefore" seceneginin true olmasi gerekir
	} else if (ok == false) {
	console.log("LoggedinBefore key var, deger var (manuel degisim): " + ok);

	   firstlogin.store(function (ok) { // Degeri tekrar true yapalim
	console.log("LoggedinBefore true olarak kaydedildi");
	}, function (err) {
	console.log("LoggedinBefore kaydedilemedi: " + err);
	}, "LoggedinBefore", true);
	} else {
	console.log("LoggedinBefore key var, deger var (daha once login olmus): " + ok);
	}
	}, function (err) {
	console.log("LoggedinBefore key yok (Kullanıcı yeni kurulum yapmış) err içeriği: " + err);

	toastwitmesaj_1(); // ilk defa kurana help gosterilsin

	firstlogin.store(function (ok) {
	console.log("LoggedinBefore true olarak kaydedildi");
	}, function (err) {
	console.log("LoggedinBefore kaydedilemedi: " + err);
	}, "LoggedinBefore", true);// store bitti, "LoggedinBefore", true key ve data eklenmis olmasi gerekir
	}, "LoggedinBefore"); // firstlogin.fetch bitti



	appGenelBildirim(); // YoungnBold v2'de kaldirildi - geri konuldu
	appAktifLoop();
	
	/*if(_kullanici_id != 0)
	{
	var kullanici = Drupal.user;

	$.each(kullanici.roles, function(rid, value) {
	if (rid == 10){ _kullanici_rol = 1; } // roleswitcher
	else if(rid == 3) {_rolbutonvalue = 2;} // ekip degistirme - butondaki value - Ev kadini
	else if(rid == 4) {_rolbutonvalue = 3;} // ekip degistirme - butondaki value - Ogrenci
	else if(rid == 5) {_rolbutonvalue = 4;} // ekip degistirme - butondaki value - Beyaz Yaka
	else if(rid == 11) {_rolbutonvalue = 5;} // ekip degistirme - butondaki value - Memur
	else if(rid == 12) {_rolbutonvalue = 6;} // ekip degistirme - butondaki value - Trendy
	else {_rolbutonvalue = 1;} // ekip degistirme - butondaki value - Admin
	});

	console.log("Kullanıcı id: " + _kullanici_id + "   Kullanıcı rol: " + _kullanici_rol + " Rolbuton: " + _rolbutonvalue);
	}*/ // MMAPP için kalktı
	
	drupalgap_remove_pages_from_dom();
}


/* Baslik Override*/
/**
 * The title call back function for the node view page.
 * @param {Function} callback
 * @param {Number} nid
 */
function node_page_title(callback, nid) {
  try {
    // Try to load the node title, then send it back to the given callback.
    var title = '';
    var node = node_load(nid, {
        success: function(node) {
          if (node && node.title) { title = l('<img src="' + drupalgap_get_path('module', 'mobilwit_stuff') + '/scubalogo.png" />', '', {reloadPage:true}); }
	  if (node.type == 'fotograf' || node.type == 'video' || node.type == 'deneyim' || node.type == 'gif')
	  title = l('<img src="' + drupalgap_get_path('module', 'mobilwit_stuff') + '/scubalogo.png" />', '', {reloadPage:true});
          callback.call(null, title);
        }
    });
  }
  catch (error) { console.log('node_page_title - ' + error); }
}



/*Anasayfa*/

function mobilwit_introduction() { // Ana Sayfa // Artik var


    


  var content = {};
  
	if(_kullanici_id == 0)
	{
	_kullanici_id = Drupal.user.uid; // global
	var kullanici = Drupal.user;

	$.each(kullanici.roles, function(rid, value) {
	if (rid == 10){ _kullanici_rol = 1; } // roleswitcher
	else if(rid == 3) {_rolbutonvalue = 2;} // ekip degistirme - butondaki value - Ev kadini
	else if(rid == 4) {_rolbutonvalue = 3;} // ekip degistirme - butondaki value - Ogrenci
	else if(rid == 5) {_rolbutonvalue = 4;} // ekip degistirme - butondaki value - Beyaz Yaka
	else if(rid == 11) {_rolbutonvalue = 5;} // ekip degistirme - butondaki value - Memur
	else if(rid == 12) {_rolbutonvalue = 6;} // ekip degistirme - butondaki value - Trendy
	else {_rolbutonvalue = 1;} // ekip degistirme - butondaki value - Admin/izleyici
	});

	//console.log("Kullanıcı id: " + _kullanici_id + "   Kullanıcı rol: " + _kullanici_rol + " Rolbuton: " + _rolbutonvalue);
	} // MMAPP için kalktı
	
  	//appGenelBildirim();
	
	/*views_datasource_get_view_result('drupalgap/bildirimlerim/' +  _kullanici_id,{ // goreve eklenen icerikler
	success:function(data) {

	var counter = data.view.count;
	
	var fark = counter - _badgesayacozel;
	
	_badgesayacozel = counter;
	
	$('#anabildirim').empty();
	$('#anabildirim').append(_badgesayacozel);
	
	//$('#anabildirim2').empty();
	//$('#anabildirim2').append(_badgesayacozel);
	
	$('#anabildirim3').empty();
	$('#anabildirim3').append(_badgesayacozel);
	
	$.each(data.nodes, function(index, object){
	  var node = object.node;
	  
	  if (_son_bildirim == 0) {
	  
	//cordova.plugins.notification.local.schedule({
	//id: 10,
	//title: "Tekrar merhaba! Son bildirimin şuydu:",
	//text: node.title,
	//icon: drupalgap_get_path('module', 'mobilwit_stuff') + '/icon.png' ,
	//smallIcon: drupalgap_get_path('module', 'mobilwit_stuff') + '/icon.png',
	//badge: _badgesayacozel+_badgesayacgenel
	//});
	
	//cordova.plugins.notification.badge.set(_badgesayacozel+_badgesayacgenel);
	
	_son_bildirim = node.nid; // son bildirim bilgisini globale atiyoruz
	}
  
	  return false;  
	  });	

	   }});*/
	   
	   
	
	if (_kullanici_rol == 1){ // roleswitcher - Ekip Degistirme - izleyici icin cikmayacak, temelde admin erisimine sahip olacak, icerik erisimi filtrelenecek
	  content['roleswitcher_block'] = {
	markup: '<div class="introtext"><p><strong>Ekibini buradan değiştirebilirsin:</strong></p>' //<div id="roleswitcher"></div></div>'
	};

	content['rolegroup'] = {
	markup: '<center><fieldset data-role="controlgroup" class="roleswitchblok">' + 
	theme('radios', {
	options: {
	1: 'Admin',
	2: 'Lise Öğrencileri', // Liseli
	3: 'Üniversite Öğrencileri', // Üniversiteli
	4: 'Öğrenci Olmayanlar'//, // Beyaz Yaka
	//5: 'Memur',
	//6: 'Trendy'
	},
	value: _rolbutonvalue,
	attributes: {
	onclick: "roleswitch(this)"
	}
	}) + '</fieldset></center>'
	};
	console.log("Render bitti - roleswitcher block");

	} // endif kullanicirole - Ekip Degistirme butonu sonu*/ // YoungnBold icin geri eklendi
	
	
	

  content['my_intro_text'] = {
    markup: '<div class="introtext"><p class="introp"><strong>Origami\'ye hoşgeldin, <em>' + Drupal.user.name +'</em>!</strong><a id="toastwit-buton" href="#" onclick="javascript:toastwitmesaj_1();">?</a></p></div>'
  }; // Toastwit geri geldi - MMAPP
  
  /*content['my_intro_text'] = {
    markup: '<div class="introtext"><p class="introp"><strong>Meeting millennials\'a hoşgeldin, <em>' + Drupal.user.name +'</em>!</strong></p><p>Meeting millennials seni daha iyi tanımak için zevkli ve sana özel görev veren bir uygulamadır.<br>Hemen görevlerine başla, fikirlerini bizimle paylaş, puanları topla!</p></div>'
  };*/
  
  content['toast_wit_mesajlar'] = {
    markup: "<div id='toast1' class='toastwit-mesaj' style='display:none' onclick='javascript:toastwitmesaj_2();' ><p class='toastwit'>Origami'ye hoşgeldin, <span>"+ Drupal.user.name +"</span>!</p><p class='toastwit'><img style='max-width: 40%; padding: 7%;' src='"+ drupalgap_get_path('module', 'toastwit') + "/checkingirl.png' /></p><p class='toastwit'><img style='max-width: 88%;' src='"+ drupalgap_get_path('module', 'toastwit') + "/yardim_1.png' /></p><div class='toastwitdevam'>Başlayalım!</div></div><div id='toast2' class='toastwit-mesaj' style='display:none' onclick='javascript:toastwitmesaj_3();'><p class='toastwit'><img src='"+ drupalgap_get_path('module', 'toastwit') + "/yardim_2.png' /></p><div class='toastwitdevam'>Devam et ></div></div><div id='toast3' class='toastwit-mesaj' style='display:none' onclick='javascript:toastwitmesaj_4();'><p class='toastwit'><img src='"+ drupalgap_get_path('module', 'toastwit') + "/yardim_3.png' /></p><div class='toastwitdevam'>Devam et ></div></div><div id='toast4' class='toastwit-mesaj' style='display:none' onclick='javascript:toastwitmesaj_5();'><p class='toastwit'><img src='"+ drupalgap_get_path('module', 'toastwit') + "/yardim_4.png' /><div class='toastwitdevam'>Devam et ></div></p></div><div id='toast5' class='toastwit-mesaj' style='display:none' onclick='javascript:toastwitmesaj_6();'><p class='toastwit'><img src='"+ drupalgap_get_path('module', 'toastwit') + "/yardim_5.png' /></p><div class='toastwitdevam'>Devam et ></div></div><div id='toast6' class='toastwit-mesaj' style='display:none' onclick='javascript:toastwitmesaj_7();'><p class='toastwit'><img src='"+ drupalgap_get_path('module', 'toastwit') + "/yardim_6.png' /></p><div class='toastwitdevam'>Anladım!</div></div>"
  }; // Toastwit geri geldi - MMAPP
  content['bildirimler_butonlar'] = {
  theme: 'controlgroup',
  items: [
    bl('Bildirimlerim (<span id="anabildirim">' + _badgesayacozel + '</span>)', 'bildirimlerim'),
    bl('Genel Bildirimler (<span id="anabildirimgenel">' + _badgesayacgenel + '</span>)', 'mobile-notifications') // YoungnBold V2'de kaldirildi - geri konuldu
  ]
  };
  content['gorevler_buton'] = {
    markup: '<div class="girisbuton"><a href="#" onclick="javascript:drupalgap_goto(\'gorev\', {options:\'reloadPage:true\'});"><img src="' + drupalgap_get_path('module', 'mobilwit_stuff') + '/giris_buton_dalis.png" /></a></div>'
  };
  content['paylasim_buton'] = {
    markup: '<div class="girisbuton"><a href="#" onclick="javascript:drupalgap_goto(\'paylasilanlar\', {options:\'reloadPage:true\'});"><img src="' + drupalgap_get_path('module', 'mobilwit_stuff') + '/giris_buton_paylasim.png" /></a></div>'
  };
  content['dalgiclar_buton'] = {
    markup: '<div class="girisbuton"><a href="#" onclick="javascript:drupalgap_goto(\'kullanicilar\', {options:\'reloadPage:true\'});"><img src="' + drupalgap_get_path('module', 'mobilwit_stuff') + '/giris_buton_dalgiclar.png" /></a></div>'
  };
  if (_kullanici_rol == 1 && ilhamhide == false){
  content['ilhamlar_buton'] = {
    markup: '<div class="girisbuton"><a href="#" onclick="javascript:drupalgap_goto(\'ilhamlar\',{options:\'reloadPage:true\'});"><img src="' + drupalgap_get_path('module', 'mobilwit_stuff') + '/giris_buton_ilham.png" /></a></div>'
  };
}
  content['profil_buton'] = {
    markup: '<div class="girisbuton"><a href="#" onclick="javascript:drupalgap_goto(\'user\', {options:\'reloadPage:true\'});"><img src="' + drupalgap_get_path('module', 'mobilwit_stuff') + '/giris_buton_profil.png" /></a></div><br><br><br>'
  };
  content['powerwit'] = {
    markup: '<div class="introtext"><p class="introp"><strong>v.2020.7.01<br>Powered by <img src="' + drupalgap_get_path('module', 'mobilwit_stuff') + '/witlogo_final_kucuk.png" /></strong></p>'
  };

  //appAktifLoop();
  
  drupalgap_remove_pages_from_dom();
  if (_offlinebaglandimi == false) _offlinebaglandimi = true; // offline'a dusmeden once online olmus oldugumuzu boyle anliyoruz
  
  /*** Anasayfa Swipe Left ***/
  
  // Set up a swipe handler to be included in the page content.
  
  if (_kullanici_rol == 1 && ilhamhide == false){
    var page_id = drupalgap_get_page_id();
    content['my_swipe_handler'] = {
      markup: drupalgap_jqm_page_event_script_code({
          page_id: page_id,
	  destination: 'gorev',
	  destinationleft:'ilhamlar',
          jqm_page_event: 'pageshow',
          jqm_page_event_callback: 'mobilwit_swipeleft',
          jqm_page_event_args: JSON.stringify({
              page_id: page_id,
	  destination: 'gorev',
	  destinationleft: 'ilhamlar'
          }),
	  
      })
    };
  }
  else{
	  var page_id = drupalgap_get_page_id();
    content['my_swipe_handler'] = {
      markup: drupalgap_jqm_page_event_script_code({
          page_id: page_id,
	  destination: 'gorev',
	  destinationleft:'kullanicilar',
          jqm_page_event: 'pageshow',
          jqm_page_event_callback: 'mobilwit_swipeleft',
          jqm_page_event_args: JSON.stringify({
              page_id: page_id,
	  destination: 'gorev',
	  destinationleft: 'kullanicilar'
          }),
	  
      })
    };
  }
  
  appAktifLoop();
  appGenelBildirim(); // YoungnBold v2'de kaldirildi - geri konuldu

  	//navigator.splashscreen.hide();
  
  //cordova.plugins.notification.badge.set(1);
  
  
  
 
  return content;
}

function mobilwit_yakinda() { // Yakinda
  var content = {};
  content['yakinda_text'] = {
    markup: '<center><p><strong>Merhaba, <em>' + Drupal.user.name +'</em>!</strong></p><p>Bu liste çok yakında ekleniyor!</p></center>' // Last notifications could be listed here - "comments to your pics"
  };
 
  return content;
}

/**Custom Blocks**/

/**
 * Implements hook_block_info().
 */

function mobilwit_stuff_block_info() {
  var blocks = {
    mobilwit_footer: {
      delta: 'mobilwit_footer',
      module: 'mobilwit_stuff'
    }
  };
  return blocks;
}

/**
 * Implements hook_block_view().
 */
 
function mobilwit_stuff_block_view(delta) {
  var content = '';
  if (delta == 'mobilwit_footer') {
    // Show today's date for the block's content.
    // var d = new Date();
    content = '<h4><center>Origami</center></h4>';
  }
  return content;
}

/** ROLESWITCH FLAG **/

function roleswitch(radio){
	// Rol değiştirme işlemi ve bildirim
	
	drupalgap_remove_pages_from_dom(); // viewlar temizlensin
	var page_id = drupalgap_get_page_id('kullanicilar');
	drupalgap_remove_page_from_dom(page_id, { force: true }); // yolcular listesi gitsin
	
	switch ($(radio).val()){
	case '1': // Yönetici ol
	flag_flag('rol_yonetici', '100', 'flag', Drupal.user.uid, true, { // 100 - anasayfa node'u
	entity_type: 'node',
	bundle: 'anasayfa',
	success: function(result) {
	  try {
	console.log('_flag_onclick Rol admin oldu');
	//alert("_flag_onclick Rol admin oldu");
	//drupalgap_alert("Yönetici ekibine geçtin!");
	drupalgap_loading_message_show();
	system_connect({ // Simdi Drupal kullanici bilgilerini bir daha cekelim
	    async: false,
	success:function(result){
	drupalgap_loading_message_show();
	  drupalgap_remove_pages_from_dom();
	  cordova.plugins.notification.badge.clear;
	  badge_refresh();
	  // Place custom code here...
	  /*var msg = Drupal.user.uid == 0 ? 'Hello World' : 'Hello ' + Drupal.user.name;
	  document.getElementById("message").innerHTML = msg;*/
	  console.log("Kullanici yeniden yüklendi.");
	  drupalgap_loading_message_hide();
	  navigator.notification.alert('Admin ekibine geçtin!', null, "Ekip Değişimi", "Kapat"); // APPDE BU OLACAK
	},
	error:function(xhr, status, message) {
	  alert(message);
	}
	}); // kullanici yukleme bitti
	
	
	  }
	  catch (error) { console.log('_flag_onclick Bildirim - error - ' + error); }
	}
	});
	break;
	case '2': // Evkadını ol
	flag_flag('rol_evkadini', '100', 'flag', Drupal.user.uid, true, {
	entity_type: 'node',
	bundle: 'anasayfa',
	success: function(result) {
	  try {
	console.log('_flag_onclick Rol liseli oldu');
	//drupalgap_alert("Ev Kadını ekibine geçtin!");
	
	//alert("_flag_onclick Rol ev kadını oldu");
	//drupalgap_alert("Yönetici ekibine geçtin!");
	drupalgap_loading_message_show();
	system_connect({ // Simdi Drupal kullanici bilgilerini bir daha cekelim
	async: false,
	success:function(result){
	drupalgap_loading_message_show();
	  drupalgap_remove_pages_from_dom();
	  cordova.plugins.notification.badge.clear;
	  badge_refresh();
	  // Place custom code here...
	  /*var msg = Drupal.user.uid == 0 ? 'Hello World' : 'Hello ' + Drupal.user.name;
	  document.getElementById("message").innerHTML = msg;*/
	  console.log("Kullanici yeniden yüklendi.");
	  drupalgap_loading_message_hide();
	  navigator.notification.alert('Lise ekibine geçtin!', null, "Ekip Değişimi", "Kapat"); // APPDE BU OLACAK
	},
	error:function(xhr, status, message) {
	  alert(message);
	}
	}); // kullanici yukleme bitti
	
	  }
	  catch (error) { console.log('_flag_onclick Bildirim - error - ' + error); }
	}
	});
	break;
	case '3': // Öğrenci ol
	flag_flag('rol_ogrenci', '100', 'flag', Drupal.user.uid, true, {
	entity_type: 'node',
	bundle: 'anasayfa',
	success: function(result) {
	  try {
	console.log('_flag_onclick Rol universiteli oldu');
	//drupalgap_alert("Öğrenci ekibine geçtin!");
	//drupalgap_alert("Yönetici ekibine geçtin!");
	
	drupalgap_loading_message_show();
	system_connect({ // Simdi Drupal kullanici bilgilerini bir daha cekelim
	async: false,
	success:function(result){
	drupalgap_loading_message_show();
	  drupalgap_remove_pages_from_dom();
	  cordova.plugins.notification.badge.clear;
	  badge_refresh();
	  // Place custom code here...
	  /*var msg = Drupal.user.uid == 0 ? 'Hello World' : 'Hello ' + Drupal.user.name;
	  document.getElementById("message").innerHTML = msg;*/
	  console.log("Kullanici yeniden yüklendi.");
	  drupalgap_loading_message_hide();
	  navigator.notification.alert('Üniversite ekibine geçtin!', null, "Ekip Değişimi", "Kapat"); // APPDE BU OLACAK
	},
	error:function(xhr, status, message) {
	  alert(message);
	}
	}); // kullanici yukleme bitti

	  }
	  catch (error) { console.log('_flag_onclick Bildirim - error - ' + error); }
	}
	});
	break;
	case '4': // Beyazyaka ol
	flag_flag('rol_beyazyaka', '100', 'flag', Drupal.user.uid, true, {
	entity_type: 'node',
	bundle: 'anasayfa',
	success: function(result) {
	  try {
	console.log('_flag_onclick Rol beyaz yaka oldu');
	//drupalgap_alert("Beyaz Yaka ekibine geçtin!");
	
	//alert("_flag_onclick Rol beyaz yaka oldu");
	//drupalgap_alert("Yönetici ekibine geçtin!");
	drupalgap_loading_message_show();
	system_connect({ // Simdi Drupal kullanici bilgilerini bir daha cekelim
	async: false,
	success:function(result){
	drupalgap_loading_message_show();
	  drupalgap_remove_pages_from_dom();
	  cordova.plugins.notification.badge.clear;
	  badge_refresh();
	  // Place custom code here...
	  /*var msg = Drupal.user.uid == 0 ? 'Hello World' : 'Hello ' + Drupal.user.name;
	  document.getElementById("message").innerHTML = msg;*/
	  console.log("Kullanici yeniden yüklendi.");
	  drupalgap_loading_message_hide();
	  navigator.notification.alert('Beyaz Yaka ekibine geçtin!', null, "Ekip Değişimi", "Kapat"); // APPDE BU OLACAK
	  
	},
	error:function(xhr, status, message) {
	  alert(message);
	}
	}); // kullanici yukleme bitti

	//drupalgap_loading_message_hide();
	
	
	//drupalgap_remove_pages_from_dom();
	//badge_refresh();
	  }
	  catch (error) { console.log('_flag_onclick Bildirim - error - ' + error); }
	}
	});
	break;
	case '5': // Memur ol
	flag_flag('rol_memur', '100', 'flag', Drupal.user.uid, true, {
	entity_type: 'node',
	bundle: 'anasayfa',
	success: function(result) {
	  try {
	console.log('_flag_onclick Rol memur oldu');
	//drupalgap_alert("Beyaz Yaka ekibine geçtin!");
	
	//alert("_flag_onclick Rol beyaz yaka oldu");
	//drupalgap_alert("Yönetici ekibine geçtin!");
	drupalgap_loading_message_show();
	system_connect({ // Simdi Drupal kullanici bilgilerini bir daha cekelim
	async: false,
	success:function(result){
	drupalgap_loading_message_show();
	  drupalgap_remove_pages_from_dom();
	  cordova.plugins.notification.badge.clear;
	  badge_refresh();
	  // Place custom code here...
	  /*var msg = Drupal.user.uid == 0 ? 'Hello World' : 'Hello ' + Drupal.user.name;
	  document.getElementById("message").innerHTML = msg;*/
	  console.log("Kullanici yeniden yüklendi.");
	  drupalgap_loading_message_hide();
	  navigator.notification.alert('Memur ekibine geçtin!', null, "Ekip Değişimi", "Kapat"); // APPDE BU OLACAK
	  
	},
	error:function(xhr, status, message) {
	  alert(message);
	}
	}); // kullanici yukleme bitti

	//drupalgap_loading_message_hide();
	
	
	//drupalgap_remove_pages_from_dom();
	//badge_refresh();
	  }
	  catch (error) { console.log('_flag_onclick Bildirim - error - ' + error); }
	}
	});
	break;
	case '6': // Trendy ol
	flag_flag('rol_trendy', '100', 'flag', Drupal.user.uid, true, {
	entity_type: 'node',
	bundle: 'anasayfa',
	success: function(result) {
	  try {
	console.log('_flag_onclick Rol trendy oldu');
	//drupalgap_alert("Beyaz Yaka ekibine geçtin!");
	
	//alert("_flag_onclick Rol beyaz yaka oldu");
	//drupalgap_alert("Yönetici ekibine geçtin!");
	drupalgap_loading_message_show();
	system_connect({ // Simdi Drupal kullanici bilgilerini bir daha cekelim
	async: false,
	success:function(result){
	drupalgap_loading_message_show();
	  drupalgap_remove_pages_from_dom();
	  cordova.plugins.notification.badge.clear;
	  badge_refresh();
	  // Place custom code here...
	  /*var msg = Drupal.user.uid == 0 ? 'Hello World' : 'Hello ' + Drupal.user.name;
	  document.getElementById("message").innerHTML = msg;*/
	  console.log("Kullanici yeniden yüklendi.");
	  drupalgap_loading_message_hide();
	  navigator.notification.alert('Trendy ekibine geçtin!', null, "Ekip Değişimi", "Kapat"); // APPDE BU OLACAK
	  
	},
	error:function(xhr, status, message) {
	  alert(message);
	}
	}); // kullanici yukleme bitti

	//drupalgap_loading_message_hide();
	
	
	//drupalgap_remove_pages_from_dom();
	//badge_refresh();
	  }
	  catch (error) { console.log('_flag_onclick Bildirim - error - ' + error); }
	}
	});
	break;
	}
	

}

/**  GOREV LISTESI  **/

function mobilwit_gorevler() {
  var content = {};

   var kullanici = Drupal.user;
	var roller = '';
	//dpm(Drupal.user);
	$.each(kullanici.roles, function(rid, value) {
	rid = rid - 2; // rol referanslari 1'den basliyor
	if (rid != 8 && rid != 11) // roleswitcher ve izleyici pas gecilsin
	{
	if (roller == '') roller = rid;
	else roller += ',' + rid;
	}
	if (roller == '0' || roller == '7') roller = ''; // authenticated ve yonetici pas gecilsin
    });
	
	if (roller == '') // sadece authenticated ise
	roller = 'all'; // hepsini gorsun
  
  
  if (roller == 'all'){ // icgoru sayfasi sadece adminlere gosterilecek
	  content['horizontalmenu'] = {
	markup: '<div id="challengebar" ><div onclick="javascript:drupalgap_goto(\'gorev\', {options:\'reloadPage:true\'})" class="challengebutton aktifsayfa">Görevlerim</div><div onclick="javascript:drupalgap_goto(\'paylasilanlar\', {options:\'reloadPage:true\'})" class="challengebutton">Paylaşımlar</div><div onclick="javascript:drupalgap_goto(\'kullanicilar\', {options:\'reloadPage:true\'})" class="challengebutton">Katılımcılar</div><div onclick="javascript:drupalgap_goto(\'ilhamlar\', {options:\'reloadPage:true\'})" class="challengebutton ">İçgörü</div></div>',
	  };
  }
  else{
	  content['horizontalmenu'] = {
	markup: '<div id="challengebar" ><div onclick="javascript:drupalgap_goto(\'gorev\', {options:\'reloadPage:true\'})" class="challengebutton aktifsayfa">Görevlerim</div><div onclick="javascript:drupalgap_goto(\'paylasilanlar\', {options:\'reloadPage:true\'})" class="challengebutton">Paylaşımlar</div><div onclick="javascript:drupalgap_goto(\'kullanicilar\', {options:\'reloadPage:true\'})" class="challengebutton">Katılımcılar</div></div>',
	  };
  }
	  
	  
  content['gorevler'] = {
    theme: 'view',
	format: 'ul',
	format_attributes: {
    'data-inset': 'true'
	},
    items: [],
    attributes: {
      id: 'gorevler_listing'
    }
  };
  content['gorevler_atananlar'] = {
    theme: 'view',
	format: 'ul',
	format_attributes: {
    'data-inset': 'true'
	},
    items: [],
    attributes: {
      id: 'gorevler_listing_atananlar'
    }
  };
  /*content['gorevpopup'] = {
	markup: '<div data-role="popup" id="gorevtextpop"><p>Önümüzdeki 3 ay amacımız seni ısındırmak, o yüzden cok basit dalışların var. Önümüzdeki 3 ay kadınların dünyasını şekillendiren büyük dinamikleri anlamaya çalışacagız.</p></div>'
  }*/
  var page_id = drupalgap_get_page_id();
  content['my_swipe_handler'] = {
      markup: drupalgap_jqm_page_event_script_code({
          page_id: page_id,
	  destination: 'paylasilanlar',
	  destinationleft:'introduction',
          jqm_page_event: 'pageshow',
          jqm_page_event_callback: 'mobilwit_swipeleft',
          jqm_page_event_args: JSON.stringify({
              page_id: page_id,
	  destination: 'paylasilanlar',
	  destinationleft:'introduction'
          }),
	  
      })
    };

  
  return content;
}

function mobilwit_gorevler_pageshow() {

	var kullanici = Drupal.user;
	var roller = '';
	//dpm(Drupal.user);
	$.each(kullanici.roles, function(rid, value) {
	rid = rid - 2; // rol referanslari 1'den basliyor
	if (rid != 8 && rid != 11) // roleswitcher ve izleyici pas gecilsin
	{
	if (roller == '') roller = rid;
	else roller += ',' + rid;
	}
	if (roller == '0' || roller == '7') roller = ''; // authenticated ve yonetici pas gecilsin
    });
	
	if (roller == '') // sadece authenticated ise
	roller = 'all'; // hepsini gorsun
	
	console.log("roller - " + roller);
	
  views_datasource_get_view_result('drupalgap/gorevler/' + roller,{
    success:function(data) {
      var items = [];
	  var hepsibitikmi = 0;
      $.each(data.nodes, function(index, object){
          var node = object.node;
	  if(node.bitirmismi == "bitirmemis")
	  {
	  hepsibitikmi++;
          var image = {
            path:node.field_g_rev_tan_t_c_resmi.src
          };
          var image_html = theme('image', image);
	if (node.field_atan_lan_kullan_c_)
	var name_html = '<div class="banner">' + image_html + '<h6 class="challengebanner">'+ node.field_atan_lan_kullan_c_ +' - özel görev</h6><h2 class="bannerbaslik">' + node.title + '</h2><h3 class="puan">' + node.field_puanint + '</h3></div>';
	else
	var name_html = '<div class="banner">' + image_html + '<h2 class="bannerbaslik">' + node.title + '</h2><h3 class="puan">' + node.field_puanint + '</h3></div>'; // Checkmark status buraya gelecek
          if(object.node.type == 'ara_t_rma') // Webform ise
          	var item = l(name_html, 'node/' + node.nid);
           else 
           	var item = l(name_html, 'renderednode/' + node.nid, {reloadPage:true});
          items.push(item);
	  }
      }); // each sonu
	  
	  if(hepsibitikmi == 0) // kullanici butun gorevleri bitirmisse
	  {
	  var item = '<div class="gorevlerbitti"><p>Sana verdiğimiz bütün görevleri yapmışsın! :-)</p><p>Bitirmiş olduğun görevleri buradan görebilirsin:</p><div class="girisbuton"><a href="#" onclick="javascript:drupalgap_goto(\'user\', {options:\'reloadPage:true\'});"><img src="' + drupalgap_get_path('module', 'mobilwit_stuff') + '/giris_buton_profil.png" /></a></div></div>';
	  items.push(item);
	  }
      drupalgap_item_list_populate("#gorevler_listing", items);
	/*var wrapper = document.getElementById('hwrapper');
	var myScroll = new IScroll(wrapper, {eventPassthrough: true, scrollX: true, scrollY: false, preventDefault: false});*/
	/*if (_mobilwit_popup){
	$( "#gorevtextpop" ).popup();
	$( "#gorevtextpop" ).popup( "open" );
	_mobilwit_popup = false;
	}*/
                                   //console.log("Dalis sayfasi popup check......");
    }
  });
	
  views_datasource_get_view_result('drupalgap/atananlar/' + kullanici.uid,{
    success:function(data) {
      var items = [];
      $.each(data.nodes, function(index, object){
          var node = object.node;
          var image = {
            path:node.field_g_rev_tan_t_c_resmi.src
          };
          var image_html = theme('image', image);
	  if (node.field_atan_lan_kullan_c_)
	var name_html = '<div class="banner">' + image_html + '<h6 class="challengebanner">'+ node.field_atan_lan_kullan_c_ +' - özel görev</h6><h2 class="bannerbaslik">' + node.title + '</h2><h3 class="puan">' + node.field_puanint + '</h3></div>'
	  else
	var name_html = '<div class="banner">' + image_html + '<h2 class="bannerbaslik">' + node.title + '</h2><h3 class="puan">' + node.field_puanint + '</h3></div>'; // Checkmark status buraya gelecek
          var item = l(name_html, 'renderednode/' + node.nid, {reloadPage:true});
          items.push(item);
      });
	  if (items.length == 0)
	items.push("<br>");
	  
	drupalgap_item_list_populate("#gorevler_listing_atananlar", items);
	
	/*var wrapper = document.getElementById('hwrapper6'); // horizontal scroll
	var myScroll = new IScroll(wrapper, {eventPassthrough: true, scrollX: true, scrollY: false, preventDefault: false});*/
    }
  });
  
  //dpm(drupalgap.menu_links);
  
  //drupalgap_remove_pages_from_dom();
  
}



/*** KATEGORILI GOREVLER ***/

/* function mobilwit_gorevler_2(arg) {
  var content = {};

  if( arg == 1){
  content['horizontalmenu'] = {
	markup: '<div id="challengebar" ><div onclick="javascript:drupalgap_goto(\'challenge\')" class="challengebutton">Bana Atanılan Dalışlar <span id="challengecount"></span></div><div onclick="javascript:drupalgap_goto(\'kullanicilar\')" class="challengebutton">Tüm Kullanıcılar</div><div onclick="javascript:drupalgap_goto(\'paylasilanlar\')" class="challengebutton">Tüm Paylaşılanlar</div><div onclick="javascript:drupalgap_goto(\'mostliked\')" class="challengebutton ">En Çok Beğenilenler</div></div>' +
	'<div id="hwrapper' + arg + '">'+
	'<table id="horinavbar">'+
            '<tr>'+
                '<td href=# onclick="javascript:drupalgap_goto(\'gorev\')">Tüm Dalışlar</td>'+
                '<td href=# onclick="javascript:drupalgap_goto(\'gorevler/1\')" class="aktifsayfa">Günlük Rutin</td>'+
	'<td href=# onclick="javascript:drupalgap_goto(\'gorevler/2\')">Alışveriş</td>'+
	'<td href=# onclick="javascript:drupalgap_goto(\'gorevler/3\')">Medya</td>'+
	'<td href=# onclick="javascript:drupalgap_goto(\'gorevler/4\')">Çamaşır Yıkama Alışkanlıkları</td>'+
	//'<td href=# onclick="javascript:drupalgap_goto(\'challenge\')">Challenge</td>'+
	'<td href=# onclick="javascript:drupalgap_goto(\'tamamladiklarim\')">Tamamladıklarım</td>'+
           '</tr>'+
        '</table></div>',
  };
  }
  else if ( arg == 2){
  content['horizontalmenu'] = {
	markup: '<div id="challengebar" ><div onclick="javascript:drupalgap_goto(\'challenge\')" class="challengebutton">Bana Atanılan Dalışlar <span id="challengecount"></span></div><div onclick="javascript:drupalgap_goto(\'kullanicilar\')" class="challengebutton">Tüm Kullanıcılar</div><div onclick="javascript:drupalgap_goto(\'paylasilanlar\')" class="challengebutton">Tüm Paylaşılanlar</div><div onclick="javascript:drupalgap_goto(\'mostliked\')" class="challengebutton ">En Çok Beğenilenler</div></div>' +
	'<div id="hwrapper' + arg + '">'+
	'<table id="horinavbar">'+
            '<tr>'+
                '<td href=# onclick="javascript:drupalgap_goto(\'gorev\')">Tüm Dalışlar</td>'+
                '<td href=# onclick="javascript:drupalgap_goto(\'gorevler/1\')" >Günlük Rutin</td>'+
	'<td href=# onclick="javascript:drupalgap_goto(\'gorevler/2\')" class="aktifsayfa">Alışveriş</td>'+
	'<td href=# onclick="javascript:drupalgap_goto(\'gorevler/3\')">Medya</td>'+
	'<td href=# onclick="javascript:drupalgap_goto(\'gorevler/4\')">Çamaşır Yıkama Alışkanlıkları</td>'+
	//'<td href=# onclick="javascript:drupalgap_goto(\'challenge\')">Challenge</td>'+
	'<td href=# onclick="javascript:drupalgap_goto(\'tamamladiklarim\')">Tamamladıklarım</td>'+
           '</tr>'+
        '</table></div>',
  };
  }
  else if ( arg == 3){
  content['horizontalmenu'] = {
	markup: '<div id="challengebar" ><div onclick="javascript:drupalgap_goto(\'challenge\')" class="challengebutton">Bana Atanılan Dalışlar <span id="challengecount"></span></div><div onclick="javascript:drupalgap_goto(\'kullanicilar\')" class="challengebutton">Tüm Kullanıcılar</div><div onclick="javascript:drupalgap_goto(\'paylasilanlar\')" class="challengebutton">Tüm Paylaşılanlar</div><div onclick="javascript:drupalgap_goto(\'mostliked\')" class="challengebutton ">En Çok Beğenilenler</div></div>' +
	'<div id="hwrapper' + arg + '">'+
	'<table id="horinavbar">'+
            '<tr>'+
                '<td href=# onclick="javascript:drupalgap_goto(\'gorev\')">Tüm Dalışlar</td>'+
                '<td href=# onclick="javascript:drupalgap_goto(\'gorevler/1\')" >Günlük Rutin</td>'+
	'<td href=# onclick="javascript:drupalgap_goto(\'gorevler/2\')" >Alışveriş</td>'+
	'<td href=# onclick="javascript:drupalgap_goto(\'gorevler/3\')" class="aktifsayfa">Medya</td>'+
	'<td href=# onclick="javascript:drupalgap_goto(\'gorevler/4\')">Çamaşır Yıkama Alışkanlıkları</td>'+
	//'<td href=# onclick="javascript:drupalgap_goto(\'challenge\')">Challenge</td>'+
	'<td href=# onclick="javascript:drupalgap_goto(\'tamamladiklarim\')">Tamamladıklarım</td>'+
           '</tr>'+
        '</table></div>',
 };
  }
  else{
  content['horizontalmenu'] = {
	markup: '<div id="challengebar" ><div onclick="javascript:drupalgap_goto(\'challenge\')" class="challengebutton">Bana Atanılan Dalışlar <span id="challengecount"></span></div><div onclick="javascript:drupalgap_goto(\'kullanicilar\')" class="challengebutton">Tüm Kullanıcılar</div><div onclick="javascript:drupalgap_goto(\'paylasilanlar\')" class="challengebutton">Tüm Paylaşılanlar</div><div onclick="javascript:drupalgap_goto(\'mostliked\')" class="challengebutton ">En Çok Beğenilenler</div></div>' +
	'<div id="hwrapper' + arg + '">'+
	'<table id="horinavbar">'+
            '<tr>'+
                '<td href=# onclick="javascript:drupalgap_goto(\'gorev\')">Tüm Dalışlar</td>'+
                '<td href=# onclick="javascript:drupalgap_goto(\'gorevler/1\')" >Günlük Rutin</td>'+
	'<td href=# onclick="javascript:drupalgap_goto(\'gorevler/2\')" >Alışveriş</td>'+
	'<td href=# onclick="javascript:drupalgap_goto(\'gorevler/3\')">Medya</td>'+
	'<td href=# onclick="javascript:drupalgap_goto(\'gorevler/4\')" class="aktifsayfa">Çamaşır Yıkama Alışkanlıkları</td>'+
	//'<td href=# onclick="javascript:drupalgap_goto(\'challenge\')">Challenge</td>'+
	'<td href=# onclick="javascript:drupalgap_goto(\'tamamladiklarim\')">Tamamladıklarım</td>'+
           '</tr>'+
        '</table></div>',
  };
  }
  content['gorevler'] = {
    theme: 'view',
	format: 'ul',
	format_attributes: {
    'data-inset': 'true'
	},
    items: [],
    attributes: {
      id: 'gorevler_listing_' + arg
    }
  };

  
  return content;
}

function mobilwit_gorevler_pageshow_2(arg) {

	var kullanici = Drupal.user;
	var roller = '';
	//dpm(Drupal.user);
	$.each(kullanici.roles, function(rid, value) {
	rid = rid - 2; // rol referanslari 1'den basliyor
	if (roller == '') roller = rid;
	else roller += ',' + rid;
	
	if (roller == '0') roller = ''; // authenticated pas gecilsin
    });
	
	if (roller == '') // sadece authenticated ise
	roller = 'all'; // hepsini gorsun
	
	console.log("roller - " + roller);

  views_datasource_get_view_result('drupalgap/gorevler/' + roller + '/' + arg,{
    success:function(data) {
      var items = [];
      $.each(data.nodes, function(index, object){
          var node = object.node;
          var image = {
            path:node.field_g_rev_tan_t_c_resmi.src
          };
          var image_html = theme('image', image);
	  if (node.field_atan_lan_kullan_c_)
	var name_html = '<div class="banner">' + image_html + '<h6 class="challengebanner">'+ node.field_atan_lan_kullan_c_ +' - (' + node.name + ' tarafından)</h6><h2 class="bannerbaslik">' + node.title + '</h2><h3 class="puan">' + node.field_puanint + ' puan</h3></div>'
	  else
	var name_html = '<div class="banner">' + image_html + '<h2 class="bannerbaslik">' + node.title + '</h2><h3 class="puan">' + node.field_puanint + ' puan</h3></div>'; // Checkmark status buraya gelecek
          var item = l(name_html, 'renderednode/' + node.nid, {reloadPage:true});
          items.push(item);
      });
      drupalgap_item_list_populate("#gorevler_listing_" + arg, items);
	var wrapper = document.getElementById('hwrapper'+arg);
	var myScroll = new IScroll(wrapper, {eventPassthrough: true, scrollX: true, scrollY: false, preventDefault: false});
    },
  });
}*/



/**  GOREV LISTESI - TAMAMLADIKLARIM **/

/*function mobilwit_gorevler_3() {
  var content = {};

  content['horizontalmenu'] = {
	markup: '<div id="challengebar" ><div onclick="javascript:drupalgap_goto(\'challenge\')" class="challengebutton">Bana Atanılan Dalışlar <span id="challengecount"></span></div><div onclick="javascript:drupalgap_goto(\'kullanicilar\')" class="challengebutton">Tüm Kullanıcılar</div><div onclick="javascript:drupalgap_goto(\'paylasilanlar\')" class="challengebutton">Tüm Paylaşılanlar</div><div onclick="javascript:drupalgap_goto(\'mostliked\')" class="challengebutton ">En Çok Beğenilenler</div></div>' +
	'<div id="hwrapper5">'+
	'<table id="horinavbar">'+
            '<tr>'+
                '<td href=# onclick="javascript:drupalgap_goto(\'gorev\')">Tüm Dalışlar</td>'+
                '<td href=# onclick="javascript:drupalgap_goto(\'gorevler/1\')">Günlük Rutin</td>'+
	'<td href=# onclick="javascript:drupalgap_goto(\'gorevler/2\')">Alışveriş</td>'+
	'<td href=# onclick="javascript:drupalgap_goto(\'gorevler/3\')">Medya</td>'+
	'<td href=# onclick="javascript:drupalgap_goto(\'gorevler/4\')">Çamaşır Yıkama Alışkanlıkları</td>'+
	//'<td href=# onclick="javascript:drupalgap_goto(\'challenge\')">Challenge</td>'+
	'<td href=# onclick="javascript:drupalgap_goto(\'tamamladiklarim\')" class="aktifsayfa">Tamamladıklarım</td>'+
           '</tr>'+
        '</table></div>',
  };
  content['gorevler'] = {
    theme: 'view',
	format: 'ul',
	format_attributes: {
    'data-inset': 'true'
	},
    items: [],
    attributes: {
      id: 'gorevler_listing_tamamladiklarim'
    }
  };

  
  return content;
}

function mobilwit_gorevler_pageshow_3() {

	var kullanici = Drupal.user;
	
  views_datasource_get_view_result('drupalgap/tamamladiklarim/' + kullanici.uid,{
    success:function(data) {
      var items = [];
      $.each(data.nodes, function(index, object){
          var node = object.node;
          var image = {
            path:node.field_g_rev_tan_t_c_resmi.src
          };
          var image_html = theme('image', image);
	  if (node.field_atan_lan_kullan_c_)
	var name_html = '<div class="banner">' + image_html + '<h6 class="challengebanner">'+ node.field_atan_lan_kullan_c_ +' - özel görev</h6><h2 class="bannerbaslik">' + node.title + '</h2><h3 class="puan">' + node.field_puanint + ' puan cepte!</h3></div>'
	  else
	var name_html = '<div class="banner">' + image_html + '<h2 class="bannerbaslik">' + node.title + '</h2><h3 class="puan">' + node.field_puanint + ' puan cepte!</h3></div>'; // Checkmark status buraya gelecek
          var item = l(name_html, 'renderednode/' + node.nid, {reloadPage:true});
          items.push(item);
      });
	  if (items.length == 0)
	items.push("<center><p>Henüz bitmesi onaylanmış bir göreviniz yok...</p></center>");
	  
	drupalgap_item_list_populate("#gorevler_listing_tamamladiklarim", items);
	
	var wrapper = document.getElementById('hwrapper5'); // horizontal scroll
	var myScroll = new IScroll(wrapper, {eventPassthrough: true, scrollX: true, scrollY: false, preventDefault: false});
    },
  });
}*/



/**  GOREV LISTESI - BANA ATANANLAR  **/

/*function mobilwit_gorevler_4() {
  var content = {};

  content['horizontalmenu'] = {
	markup: '<div id="challengebar" ><div onclick="javascript:drupalgap_goto(\'challenge\')" class="challengebutton aktifsayfa">Bana Atanılan Dalışlar <span id="challengecount"></span></div><div onclick="javascript:drupalgap_goto(\'kullanicilar\')" class="challengebutton">Tüm Kullanıcılar</div><div onclick="javascript:drupalgap_goto(\'paylasilanlar\')" class="challengebutton">Tüm Paylaşılanlar</div><div onclick="javascript:drupalgap_goto(\'mostliked\')" class="challengebutton ">En Çok Beğenilenler</div></div>' +
	'<div id="hwrapper6">'+
	'<table id="horinavbar">'+
            '<tr>'+
                '<td href=# onclick="javascript:drupalgap_goto(\'gorev\')">Tüm Dalışlar</td>'+
                '<td href=# onclick="javascript:drupalgap_goto(\'gorevler/1\')">Günlük Rutin</td>'+
	'<td href=# onclick="javascript:drupalgap_goto(\'gorevler/2\')">Alışveriş</td>'+
	'<td href=# onclick="javascript:drupalgap_goto(\'gorevler/3\')">Medya</td>'+
	'<td href=# onclick="javascript:drupalgap_goto(\'gorevler/4\')">Çamaşır Yıkama Alışkanlıkları</td>'+
	//'<td href=# onclick="javascript:drupalgap_goto(\'challenge\')">Challenge</td>'+
	'<td href=# onclick="javascript:drupalgap_goto(\'tamamladiklarim\')">Tamamladıklarım</td>'+
           '</tr>'+
        '</table></div>',
  };
  content['gorevler'] = {
    theme: 'view',
	format: 'ul',
	format_attributes: {
    'data-inset': 'true'
	},
    items: [],
    attributes: {
      id: 'gorevler_listing_atananlar'
    }
  };

  
  return content;
}

function mobilwit_gorevler_pageshow_4() {

	var kullanici = Drupal.user;
	
  views_datasource_get_view_result('drupalgap/atananlar/' + kullanici.uid,{
    success:function(data) {
      var items = [];
      $.each(data.nodes, function(index, object){
          var node = object.node;
          var image = {
            path:node.field_g_rev_tan_t_c_resmi.src
          };
          var image_html = theme('image', image);
	  if (node.field_atan_lan_kullan_c_)
	var name_html = '<div class="banner">' + image_html + '<h6 class="challengebanner">'+ node.field_atan_lan_kullan_c_ +' - özel görev</h6><h2 class="bannerbaslik">' + node.title + '</h2><h3 class="puan">' + node.field_puanint + ' puan</h3></div>'
	  else
	var name_html = '<div class="banner">' + image_html + '<h2 class="bannerbaslik">' + node.title + '</h2><h3 class="puan">' + node.field_puanint + ' puan</h3></div>'; // Checkmark status buraya gelecek
          var item = l(name_html, 'renderednode/' + node.nid, {reloadPage:true});
          items.push(item);
      });
	  if (items.length == 0)
	items.push("<center><p>Üzgünüz, henüz kimse size görev atamamış...</p></center>");
	  
	drupalgap_item_list_populate("#gorevler_listing_atananlar", items);
	
	var wrapper = document.getElementById('hwrapper6'); // horizontal scroll
	var myScroll = new IScroll(wrapper, {eventPassthrough: true, scrollX: true, scrollY: false, preventDefault: false});
    },
  });
}*/


/**  KULLANICI LISTESI  **/

function mobilwit_kullanicilar() {
  var content = {};

  var kullanici = Drupal.user;
	var roller = '';
	//dpm(Drupal.user);
	$.each(kullanici.roles, function(rid, value) {
	rid = rid - 2; // rol referanslari 1'den basliyor
	if (rid != 8 && rid != 11) // roleswitcher ve izleyici pas gecilsin
	{
	if (roller == '') roller = rid;
	else roller += ',' + rid;
	}
	if (roller == '0' || roller == '7') roller = ''; // authenticated ve yonetici pas gecilsin
    });
	
	if (roller == '') // sadece authenticated ise
	roller = 'all'; // hepsini gorsun
  
  
  if (roller == 'all' && ilhamhide == false){ // icgoru sayfasi sadece adminlere gosterilecek
	  content['horizontalmenu'] = {
	markup: '<div id="challengebar" ><div onclick="javascript:drupalgap_goto(\'gorev\', {options:\'reloadPage:true\'})" class="challengebutton">Görevlerim</div><div onclick="javascript:drupalgap_goto(\'paylasilanlar\', {options:\'reloadPage:true\'})" class="challengebutton">Paylaşımlar</div><div onclick="javascript:drupalgap_goto(\'kullanicilar\', {options:\'reloadPage:true\'})" class="challengebutton aktifsayfa">Katılımcılar</div><div onclick="javascript:drupalgap_goto(\'ilhamlar\', {options:\'reloadPage:true\'})" class="challengebutton ">İçgörü</div></div>',
	  };
	  
	  var page_id = drupalgap_get_page_id();
	  content['my_swipe_handler'] = {
      markup: drupalgap_jqm_page_event_script_code({
          page_id: page_id,
	  destination: 'ilhamlar',
	  destinationleft: 'paylasilanlar',
          jqm_page_event: 'pageshow',
          jqm_page_event_callback: 'mobilwit_swipeleft',
          jqm_page_event_args: JSON.stringify({
              page_id: page_id,
	  destination: 'ilhamlar',
	  destinationleft:'paylasilanlar'
          }),
	  
      })
    };
  }
  else{
	  content['horizontalmenu'] = {
	markup: '<div id="challengebar" ><div onclick="javascript:drupalgap_goto(\'gorev\', {options:\'reloadPage:true\'})" class="challengebutton">Görevlerim</div><div onclick="javascript:drupalgap_goto(\'paylasilanlar\', {options:\'reloadPage:true\'})" class="challengebutton">Paylaşımlar</div><div onclick="javascript:drupalgap_goto(\'kullanicilar\', {options:\'reloadPage:true\'})" class="challengebutton aktifsayfa">Katılımcılar</div></div>',
	  };
	  
	  var page_id = drupalgap_get_page_id();
	  content['my_swipe_handler'] = {
      markup: drupalgap_jqm_page_event_script_code({
          page_id: page_id,
	  destination: 'introduction',
	  destinationleft: 'paylasilanlar',
          jqm_page_event: 'pageshow',
          jqm_page_event_callback: 'mobilwit_swipeleft',
          jqm_page_event_args: JSON.stringify({
              page_id: page_id,
	  destination: 'introduction',
	  destinationleft: 'paylasilanlar'
          }),
	  
      })
    };
  }
  
  
  content['kullanicilar'] = {
    theme: 'view',
	format: 'ul',
	format_attributes: {
    'data-inset': 'true'
	},
    items: [],
    attributes: {
      id: 'kullanicilar_listing'
    }
  };
    content['listeloading'] = {
	markup: '<div id="listeloading" class="gorev_eklenenler" style="display:block; width:90%; padding: 5%; text-align: center;"><img id="listeloader" src="' + drupalgap_get_path('module', 'mobilwit_stuff') + '/liste_loader.gif" /></div>',
  };
  
  

  //drupalgap_remove_pages_from_dom();
  return content;
}

function mobilwit_kullanicilar_pageshow() {
	
  views_datasource_get_view_result('drupalgap/kullanicilar',{
    success:function(data) {
	//tekrarengelleme++;	// global identifier - tekrar engelleme
      var items = [];
	  console.log("Kullanici success function:");
	  //dpm(data);
      $.each(data.users, function(index, object){
          var user = object.user;
	  
	  // var image_html = '<div class="profilcontain"><img id="profilresmiliste_'+ user.uid +'_' + tekrarengelleme + '" class="profilresmiliste" src="' + drupalgap_get_path('module', 'mobilwit_stuff') + '/kullanicidefault_80.png" /></div>';
	  
	  if(user.field_kullan_c_resmi2.src) // bos degilse
	  {
	  var image_html = '<div class="profilcontain"><img id="profilresmiliste_'+ user.uid +'_' + '" class="profilresmiliste" src="' + user.field_kullan_c_resmi2.src + '" /></div>';
	  }
	  else //default resim
	  {
	  var image_html = '<div class="profilcontain"><img id="profilresmiliste_'+ user.uid +'_' + '" class="profilresmiliste" src="' + drupalgap_get_path('module', 'mobilwit_stuff') + '/kullanicidefault_80.png" /></div>';
	  }
	
	  var puan_html = 0;
	  if (user.field_user_puan != '') puan_html = user.field_user_puan;
	  
	//var name_html = '<div class="userbanner">' + image_html + '<h6 class="challengebanner2">'+ user.field_pozisyonu +'</h6><h2 class="bannerbaslik2">' + user.field_ad_soyad_ + '</h2><h3 class="puan2">' + puan_html + ' puan</h3></div>';
	
	var kapak_style = '';
	
	if(user.field_kapak_resmi2.src) // bos degilse
	  {
	  var kapak_style = 'style= "background: url(\'' + user.field_kapak_resmi2.src + '\') no-repeat center center; background-size: cover;"';
	  }
	
	var name_html = '<div class="userbanner" ' + kapak_style + '>' + image_html + '<h6 class="challengebanner2">'+ user.field_pozisyonu +'</h6><h2 class="bannerbaslik2">' + user.field_ad_soyad_ + '</h2></div>';
	
          var item = l(name_html, 'user/' + user.uid, {reloadPage:true});
          items.push(item);
	  //console.log("kullanici sayfasi item: " + item);
	  
	/*views_datasource_get_view_result('drupalgap/profilresmi/' + user.uid,{ // profil resimleri -- representative node (view) sayesinde gerek kalmadi
	success:function(data) {
	//var items = [];
	var counter = data.view.count;
	if(counter == 0) { return }; // sistemi yormaya gerek yok
	$.each(data.nodes, function(index, object){

	  var tempresim = object.node.field_kullan_c_resmi2_1.src;
	  
	  if (counter > 0) counter--;
	  if (counter==0){
	$('#profilresmiliste_' + object.node.uid +'_' + tekrarengelleme).attr("src", tempresim);
	//console.log("Eklenen resim alanı: "+ object.node.uid +'_' + tekrarengelleme);
	  }
	});
	   }});*/
	  
      });
	  
	  //console.log("Kullanıcı listesi - prior to populate");
	  
	  drupalgap_item_list_populate("#kullanicilar_listing", items);
	  
	  //console.log("Kullanıcı listesi - prior to populate 3");
	  
	  $( "#listeloading" ).hide(); // yukleme gifi kapansin
      
	/*var wrapper = document.getElementById('hwrapper7');
	var myScroll = new IScroll(wrapper, {eventPassthrough: true, scrollX: true, scrollY: false, preventDefault: false});*/
	
    }
  });
}


/**  TUM PAYLASILANLAR  **/

function mobilwit_paylasilanlar() {
  var content = {};

  var kullanici = Drupal.user;
	var roller = '';
	//dpm(Drupal.user);
	$.each(kullanici.roles, function(rid, value) {
	rid = rid - 2; // rol referanslari 1'den basliyor
	if (rid != 8 && rid != 11) // roleswitcher ve izleyici pas gecilsin
	{
	if (roller == '') roller = rid;
	else roller += ',' + rid;
	}
	if (roller == '0' || roller == '7') roller = ''; // authenticated ve yonetici pas gecilsin
    });
	
	if (roller == '') // sadece authenticated ise
	roller = 'all'; // hepsini gorsun
  
  
  if (roller == 'all' && ilhamhide == false){ // icgoru sayfasi sadece adminlere gosterilecek
	  content['horizontalmenu'] = {
	markup: '<div id="challengebar" ><div onclick="javascript:drupalgap_goto(\'gorev\', {options:\'reloadPage:true\'})" class="challengebutton">Görevlerim</div><div onclick="javascript:drupalgap_goto(\'paylasilanlar\', {options:\'reloadPage:true\'})" class="challengebutton aktifsayfa">Paylaşımlar</div><div onclick="javascript:drupalgap_goto(\'kullanicilar\', {options:\'reloadPage:true\'})" class="challengebutton">Katılımcılar</div><div onclick="javascript:drupalgap_goto(\'ilhamlar\', {options:\'reloadPage:true\'})" class="challengebutton ">İçgörü</div></div>'
	  };
  }
  else{
	  content['horizontalmenu'] = {
	markup: '<div id="challengebar" ><div onclick="javascript:drupalgap_goto(\'gorev\', {options:\'reloadPage:true\'})" class="challengebutton">Görevlerim</div><div onclick="javascript:drupalgap_goto(\'paylasilanlar\', {options:\'reloadPage:true\'})" class="challengebutton aktifsayfa">Paylaşımlar</div><div onclick="javascript:drupalgap_goto(\'kullanicilar\', {options:\'reloadPage:true\'})" class="challengebutton">Katılımcılar</div></div>'
	  };
  }
  
  content['paylasilanlar'] = {
    theme: 'view',
	format: 'ul',
	format_attributes: {
    'data-inset': 'true'
	},
    items: [],
    attributes: {
      id: 'paylasilanlar_listing'
    }
  };
  content['listeloading'] = {
	markup: '<div id="listeloading_paylasilanlar" class="tum_eklenenler" style="display:block; width:90%; padding: 5%; text-align: center;"><img id="listeloader" src="' + drupalgap_get_path('module', 'mobilwit_stuff') + '/liste_loader.gif" /></div>',
  };
  
  var page_id = drupalgap_get_page_id();
  content['my_swipe_handler'] = {
      markup: drupalgap_jqm_page_event_script_code({
          page_id: page_id,
	  destination: 'kullanicilar',
	  destinationleft: 'gorev',
          jqm_page_event: 'pageshow',
          jqm_page_event_callback: 'mobilwit_swipeleft',
          jqm_page_event_args: JSON.stringify({
              page_id: page_id,
	  destination: 'kullanicilar',
	  destinationleft: 'gorev'
          }),
	  
      })
    };

  
  return content;
}

function mobilwit_paylasilanlar_pageshow() {
	
	var kullanici = Drupal.user;
	var roller = '';
	//dpm(Drupal.user);
	$.each(kullanici.roles, function(rid, value) {
	rid = rid - 2; // rol referanslari 1'den basliyor
	if (rid != 8) // roleswitcher pas gecilsin
	{
	if (roller == '') roller = rid;
	else roller += ',' + rid;
	}
	if (roller == '0' || roller == '7') roller = ''; // authenticated ve yonetici pas gecilsin
    });
	
	if (roller == '') // sadece authenticated ise
	roller = 'all'; // hepsini gorsun
	
	views_datasource_get_view_result('drupalgap/goreve-eklenenler/all/' + roller ,{ // goreve eklenen icerikler
	success:function(data) {
	//var items = [];
	var counter = data.view.count;
	if (counter == 0)
	var templist = '<div class="eklenenler-bos-liste"><p>Henüz kimse bir ekleme yapmamış...</p></div>';
	else {
	var templist = '<ul id="gorev_eklenenler_listesi">';
	$.each(data.nodes, function(index, object){
	
	  var imagenode = object.node;
	  //var imagegallery_html = '<img src="' + imagenode.field_kullan_c_resmi.src + '" />'; // kullanici resmi
	  
	 // var imagegallery_html = '<img class="profilthumb2_'+ imagenode.uid +'" src="' + drupalgap_get_path('module', 'mobilwit_stuff') + '/kullanicidefault_80.png" />'; // placeholder
	  
	  // View birlestirip json yaratinca drupal view newline ve quote escape characterlerini halledemiyor
	  
	  var json = imagenode.view.replace('"\n', '');
	  json = json.replace('\n "', '');
	  json = json.replace(/(\r\n|\n|\r)/gm,''); // newline removal
	  json = json.replace('\"', '"');
	  json = json.replace(/\s+/g,''); // space removal
	  
	  json = JSON.parse(json); // object yaratilsin
	  
	  //console.log("eklenenler view değeri (json) : ");
	  //dpm(json);
	  
	  if(json.view.count > 0) // kullanici resmi varsa
	var imagegallery_html = '<img class="profilthumb2_'+ imagenode.uid +'" src="' + json.nodes[0].node.field_kullan_c_resmi2.src + '" />'; // profil resmi
	  else // kullanici resmi yoksa
	var imagegallery_html = '<img class="profilthumb2_'+ imagenode.uid +'" src="' + drupalgap_get_path('module', 'mobilwit_stuff') + '/kullanicidefault_80.png" />'; // placeholder
	  
	  
	  //Kullanici resimlerini al -- Representative node ile bir yol bul.
	  /*views_datasource_get_view_result('drupalgap/profilresmi/' + imagenode.uid,{ // gorevi tamamlayan kullanicilar listesi view call
	success:function(data) {
	//var items = [];
	var counter = data.view.count;
	if(counter == 0) { return }; // sistemi yormaya gerek yok
	$.each(data.nodes, function(index, object){

	  var tempresim = object.node.field_kullan_c_resmi2_1.src; // yuvarlak resim ayari
	  
	  if (counter > 0) counter--;
	  if (counter==0){	
	  
	$('.profilthumb2_' + object.node.uid).each(function() {
	$(this).attr("src", tempresim);
	});
	  }
	});
	   }});*/

	  templist += '<li><a href=# onclick="javascript:drupalgap_goto(\'user/' + imagenode.uid + '\', {options:\'reloadPage:true\'})"><div class="gorev-bitiren-user">' +imagegallery_html + '</div></a><div class="eklenen-aktivite"><a href=# onclick="javascript:drupalgap_goto(\'node/' + imagenode.nid + '\', {options:\'reloadPage:true\'})"> ' + imagenode.field_ad_soyad_ + ' bir ' + imagenode.type + ' ekledi. <br>Görev: <em>'+ imagenode.field_gorev_ba_lant_s__1 +'</em><br>(' + imagenode.count + ' <img class="likeikonu" src="' + drupalgap_get_path('module', 'mobilwit_stuff') + '/liked_turuncu.png" />)';
	  
	 /* if(imagenode.onay==1) // ----->  Fikirsensin icin geri kondu
	  templist += '<img id="onaylanma_'+ imagenode.uid +'" class="onaylanma" src="' + drupalgap_get_path('module', 'mobilwit_stuff') + '/onay.png" />';
	  else
	  templist += '<img id="onaylanma_'+ imagenode.uid +'" class="onaylanma" src="' + drupalgap_get_path('module', 'mobilwit_stuff') + '/onay0.png" />';*/
 
	  templist += '(' + imagenode.comment_count + ' <img class="commentikonu" src="' + drupalgap_get_path('module', 'mobilwit_stuff') + '/comment_sayi.png" />)';
	  templist +='</a></div></li>';
	  
	  if (counter > 0) counter--;
	  if (counter==0){
	//dpm(gallerycontent);;
	templist += '</ul><br><br>'; // liste sonucu	
	  }}
	);
	}// else bitti

	$('#paylasilanlar_listing').append(templist);
	
	$( "#listeloading_paylasilanlar" ).hide(); // yukleme gifi kapansin
	/*var wrapper = document.getElementById('hwrapper8');*
	var myScroll = new IScroll(wrapper, {eventPassthrough: true, scrollX: true, scrollY: false, preventDefault: false});*/
	   }});

}


/** BILDIRIM CLICK FONKSIYONU - FLAG **/

function bildirimgit(bildirimnid, bildirimflag, kullaniciuid, fieldyol){

	if (bildirimflag == 0)
	  {
	flag_flag('okundu', bildirimnid, 'flag', kullaniciuid, true, {
	entity_type: 'node',
	bundle: 'bildirim',
	success: function(result) {
	  try {
	console.log('_flag_onclick Bildirim - flag - ' + bildirimnid);
	//appGenelBildirim();
	//appAktifLoop();
	cordova.plugins.notification.badge.decrease(1);
	  }
	  catch (error) { console.log('_flag_onclick Bildirim - error - ' + error); }
	}
	}); // flag_flag bitti
	  }
    
    if(fieldyol == 0){
        $('#bildirimlerim_listing').empty();
        mobilwit_bildirimlerim_pageshow();
    }
    else{
        drupalgap_goto('renderednode/' + fieldyol, {options:'reloadPage:true'} );
    }

}

/**  TUM BILDIRIMLERIM  **/

function mobilwit_bildirimlerim() {
  var content = {};

  content['baslik_bildirimlerim'] = {
	markup: '<h4 class="bildirimh4">Bildirimlerim (<span id="anabildirim2">'+ _badgesayacozel +'</span>)</h4>'
  };
  content['paylasilanlar'] = {
    theme: 'view',
	format: 'ul',
	format_attributes: {
    'data-inset': 'true'
	},
    items: [],
    attributes: {
      id: 'bildirimlerim_listing'
    }
  };

  
  return content;
}

function mobilwit_bildirimlerim_pageshow() {
	
	var kullanici = Drupal.user;
	
	views_datasource_get_view_result('drupalgap/bildirimlertum/' +  kullanici.uid,{ // goreve eklenen icerikler
	success:function(data) {
	//var items = [];
	var counter = data.view.count;
	
	$('#anabildirim2').empty();
	$('#anabildirim2').append(_badgesayacozel);
	
	if (counter == 0)
	var templist = '<div class="eklenenler-bos-liste"><p>Şu an bir bildirim bulunmamaktadır...</p></div>';
	else {
	var templist = '<ul id="bildirimlerim_listesi">';
	$.each(data.nodes, function(index, object){
	
	  var stronghtml = '';
	  var stronghtmlend = '';
	  var classdummy = '';
	  var imagenode = object.node;
	  
	  if (imagenode.flagged == 0) {
	stronghtml = '<strong>';
	stronghtmlend = '</strong>';
	  classdummy = ' class = "yenibildirim" ';
	  }

	  //templist += '<li' + classdummy + '><a href=# onclick="javascript:drupalgap_goto(\'renderednode/' + imagenode.field_yol + '\')">' +
                                   
                                   if(imagenode.field_yol > 0){
                                    /*nothing*/
                                   }
                                   else
                                   {
                                   imagenode.field_yol = 0;
                                   }
	  
	  templist += '<li' + classdummy + '><a href=# onclick="javascript:bildirimgit('+ imagenode.nid +', '+ imagenode.flagged +', ' + kullanici.uid + ', '+ imagenode.field_yol +')">' +
	  stronghtml + imagenode.body; // Bildirim mesaji -> Bildirim sayfasi
	  
	  templist += stronghtmlend + '</a>' + '</li>';
	  
	  /*if (imagenode.flagged == 0)
	  {
	flag_flag('okundu', imagenode.nid, 'flag', kullanici.uid, true, {
	entity_type: 'node',
	bundle: 'bildirim',
	success: function(result) {
	  try {
	console.log('_flag_onclick Bildirim - flag - ' + imagenode.nid);
	  }
	  catch (error) { console.log('_flag_onclick Bildirim - error - ' + error); }
	}
	}); // flag_flag bitti
	  }*/
	  
	  if (counter > 0) counter--;
	  if (counter==0){
	//dpm(gallerycontent);;
	templist += '</ul><br><br>'; // liste sonucu	
	  }}
	);
	}// else bitti

	$('#bildirimlerim_listing').append(templist);
	
	   }});

}


/**  EN COK BEGENILENLER  **/

/*function mobilwit_mostliked() {
  var content = {};

  content['horizontalmenu'] = {
	markup: '<div id="challengebar" ><div onclick="javascript:drupalgap_goto(\'challenge\')" class="challengebutton">Bana Atanılan Dalışlar <span id="challengecount"></span></div><div onclick="javascript:drupalgap_goto(\'kullanicilar\')" class="challengebutton">Tüm Kullanıcılar</div><div onclick="javascript:drupalgap_goto(\'paylasilanlar\')" class="challengebutton">Tüm Paylaşılanlar</div><div onclick="javascript:drupalgap_goto(\'mostliked\')" class="challengebutton aktifsayfa">En Çok Beğenilenler</div></div>'+
	'<div id="hwrapper9">'+
	'<table id="horinavbar">'+
            '<tr>'+
                '<td href=# onclick="javascript:drupalgap_goto(\'gorev\')">Tüm Dalışlar</td>'+
                '<td href=# onclick="javascript:drupalgap_goto(\'gorevler/1\')">Günlük Rutin</td>'+
	'<td href=# onclick="javascript:drupalgap_goto(\'gorevler/2\')">Alışveriş</td>'+
	'<td href=# onclick="javascript:drupalgap_goto(\'gorevler/3\')">Medya</td>'+
	'<td href=# onclick="javascript:drupalgap_goto(\'gorevler/4\')">Çamaşır Yıkama Alışkanlıkları</td>'+
	//'<td href=# onclick="javascript:drupalgap_goto(\'challenge\')">Challenge</td>'+
	'<td href=# onclick="javascript:drupalgap_goto(\'tamamladiklarim\')">Tamamladıklarım</td>'+
           '</tr>'+
        '</table></div>',
  };
  content['mostliked'] = {
    theme: 'view',
	format: 'ul',
	format_attributes: {
    'data-inset': 'true'
	},
    items: [],
    attributes: {
      id: 'mostliked_listing'
    }
  };

  
  return content;
}

function mobilwit_mostliked_pageshow() {

	views_datasource_get_view_result('drupalgap/mostliked',{ // goreve eklenen icerikler
	success:function(data) {
	//var items = [];
	var counter = data.view.count;
	if (counter == 0)
	var templist = '<div class="eklenenler-bos-liste"><p>Henuz kimse bir ekleme yapmamis.</p></div>';
	else {
	var templist = '<ul id="gorev_eklenenler_listesi">';
	$.each(data.nodes, function(index, object){
	
	  var imagenode = object.node;
	  //var imagegallery_html = '<img src="' + imagenode.field_kullan_c_resmi.src + '" />'; // kullanici resmi
	  
	  var imagegallery_html = '<img id="profilthumb2_'+ imagenode.uid +'" src="' + drupalgap_get_path('module', 'mobilwit_stuff') + '/kullanicidefault.png" />'; // placeholder
	  
	  //Kullanici resimlerini al
	  views_datasource_get_view_result('drupalgap/profilresmi/' + imagenode.uid,{ // gorevi tamamlayan kullanicilar listesi view call
	success:function(data) {
	//var items = [];
	var counter = data.view.count;
	if(counter == 0) { return }; // sistemi yormaya gerek yok
	$.each(data.nodes, function(index, object){

	  var tempresim = object.node.field_kullan_c_resmi2_1.src; // yuvarlak resim ayari
	  
	  if (counter > 0) counter--;
	  if (counter==0){
	$('#profilthumb2_' + object.node.uid).attr("src", tempresim);
	  }
	});
	   }});

	  templist += '<li><a href=# onclick="javascript:drupalgap_goto(\'user/' + imagenode.uid + '\')"><div class="gorev-bitiren-user">' +imagegallery_html + '</div></a><div class="eklenen-aktivite"><a href=# onclick="javascript:drupalgap_goto(\'node/' + imagenode.nid + '\')"> ' + imagenode.field_ad_soyad_ + ' tarafından eklenilen ' + imagenode.type + ' ' + imagenode.count + ' kere beğenildi.</a></div></li>';
	  
	  if (counter > 0) counter--;
	  if (counter==0){
	//dpm(gallerycontent);;
	templist += '</ul><br><br>'; // liste sonucu	
	  }}
	);
	}// else bitti
	
	//drupalgap_item_list_populate("#mostliked_listing", items);
	$('#mostliked_listing').append(templist);
	var wrapper = document.getElementById('hwrapper9');
	var myScroll = new IScroll(wrapper, {eventPassthrough: true, scrollX: true, scrollY: false, preventDefault: false});
	   }});
}*/

/**  ILHAM LISTESI  **/

function mobilwit_ilhamlar() {
  var content = {};
  content['horizontalmenu'] = {
	markup: '<div id="challengebar" ><div onclick="javascript:drupalgap_goto(\'gorev\', {options:\'reloadPage:true\'})" class="challengebutton">Görevlerim</div><div onclick="javascript:drupalgap_goto(\'paylasilanlar\', {options:\'reloadPage:true\'})" class="challengebutton ">Paylaşımlar</div><div onclick="javascript:drupalgap_goto(\'kullanicilar\', {options:\'reloadPage:true\'})" class="challengebutton">Katılımcılar</div><div onclick="javascript:drupalgap_goto(\'ilhamlar\', {options:\'reloadPage:true\'})" class="challengebutton aktifsayfa">İçgörü</div></div>'
  };
  content['ilhamlar'] = {
    theme: 'view',
	format: 'ul',
	format_attributes: {
    'data-inset': 'true'
	},
    items: [],
    attributes: {
      id: 'ilhamlar_listing'
    }
  };
  
  var page_id = drupalgap_get_page_id();
  content['my_swipe_handler'] = {
      markup: drupalgap_jqm_page_event_script_code({
          page_id: page_id,
	  destination: 'introduction',
	  destinationleft: 'kullanicilar',
          jqm_page_event: 'pageshow',
          jqm_page_event_callback: 'mobilwit_swipeleft',
          jqm_page_event_args: JSON.stringify({
              page_id: page_id,
	  destination: 'introduction',
	  destinationleft: 'kullanicilar'
          }),
	  
      })
    };
  return content;
}

function mobilwit_ilhamlar_pageshow() {
  views_datasource_get_view_result('drupalgap/ilhamlar',{
    success:function(data) {
      var items = [];
      $.each(data.nodes, function(index, object){
          var node = object.node;
          var image = {
            path:node.field_i_lham_tan_t_c_resim.src
          };
          var image_html = theme('image', image);	  
          var name_html = '<div class="banner">' + image_html + '<h2 class="bannerbaslik">' + node.title + '</h2><div class="ilham_like">' + node.count + ' <img style="padding-left: 2px;" src="' + drupalgap_get_path('module', 'mobilwit_stuff') + '/liked.png" /></div></div>'; // Checkmark status buraya gelecek
          var item = l(name_html, 'node/' + node.nid);
          items.push(item);
      });
      drupalgap_item_list_populate("#ilhamlar_listing", items);
    },
  });
}

/**
 * Page callback for rendernode/%. - Gorev
 * @param {Number} nid
 * @return {Object}
 */
function mobilwit_user_page_view(uid) {
  try {
    if (uid) {
      var content = {
        container: _drupalgap_entity_page_container('user', uid, 'view')
      };
      return content;
    }
    else { drupalgap_error('No user id provided!'); }
  }
  catch (error) { console.log('mobilwit_node_page_view - ' + error); }
}

/*** KULLANICI SAYFASI ***/

/**
 * jQM pageshow handler for rendernode/% pages. -- KULLANICI SAYFASI
 * @param {Number} nid
 */
function mobilwit_user_page_view_pageshow(uid) {
  try {
    user_load(uid, {
        success: function(account) {

          // Build the user display. - kullanici
	  
	  // Eğer kendi sayfasına bakıyorsa profilimi düzenle butonu
	  
	  var userpage = '';
	  
	  
	  kapakresmi = { // Kapak resmi image path -- Kapak resmi varsa üzerine islenecek
	    path:drupalgap_get_path('module', 'mobilwit_stuff') + '/kapakgeneric.jpg'
	};
	  
	  
	  kullaniciresmi = { // Kapak resmi image path
	    path:drupalgap_get_path('module', 'mobilwit_stuff') + '/kullanicidefault.png'
	};
	  
	  
	  // kullanici adi
	  
	  var kullaniciadi = account.name;
	  if (account.field_ad_soyad_.und)
	kullaniciadi = account.field_ad_soyad_.und[0].value;
	  
	  // kullanici pozisyonu
	  
	  var kullanicipozisyonu = '';
	  if (account.field_pozisyonu.und)
	kullanicipozisyonu = account.field_pozisyonu.und[0].value;
	  
	  // puan
	  
	  var kullanicipuan = 0;
	  if (account.field_user_puan.und)
	kullanicipuan = account.field_user_puan.und[0].value;
	
	  
	  // gorev ittime butonu
	  
	  var gorevittirmehtml = '';
	  var bildirimbutonu = '';
	  if (account.uid != Drupal.user.uid) // kendisi değilse görev ittirebilsin
	gorevittirmehtml = '';//gorevittirmehtml = '<div class="gorevittir"><a href=# id="gorev_ittir_buton" onclick="javascript: mobilwit_updatevar(' + account.uid + ', \'g_rev\')">Görev<br>Ata!</a></div>';
	  else
	bildirimbutonu = '<div class="gorevittir"><a href=# id="gorev_ittir_buton" onclick="javascript: drupalgap_goto(\'mobile-notifications\', {options:\'reloadPage:true\'});">Genel Bildirimler<br>(<span id="anabildirimgenel2">' + _badgesayacgenel +'</span>)</a></div>';
	  	bildirimbutonu += '<div class="gorevittir"><a href=# id="gorev_ittir_buton" onclick="javascript: drupalgap_goto(\'bildirimlerim\', {options:\'reloadPage:true\'});">Bildirimlerim<br>(<span id="anabildirim3">' + _badgesayacozel + '</span>)</a></div>';

	  // Bio
	  
	  var userbio = 'Bu kullanıcı henüz kendi hakkında bir şeyler yazmamış.';
	  if (account.field_hakk_nda.und)
	userbio = account.field_hakk_nda.und[0].value;
	  
	  // Ust kisim html
	  
	  userpage += '<div id="user-'+ account.uid +'" class="profilsayfasi">'+
	'<div class="header">'+
	'<div class="kunye" id="kunye_'+ account.uid +'" style="background-image:url('+ kapakresmi.path +');">'+
	'<div class="profilresmi" id="profilresmi_' + account.uid + '"><img src="' + kullaniciresmi.path + '" /></div>'+
	'<div class="kimlik">'+
	'<div class="isim">' + kullaniciadi + '</div>'+
	'<div class="pozisyon">' + kullanicipozisyonu + '</div>';
	if (account.uid == Drupal.user.uid) // kendisiyse editleyebilsin
	userpage +='<div class="editprofil"><a href=# onclick="javascript:drupalgap_goto(\'user/'+ account.uid +'/edit\');">Bilgilerimi düzenle</a></div>';
	
	 userpage +='</div>';
	 
	if(kullanicipuan > 0) {	userpage += '<div class="puantoplam">' + kullanicipuan + ' puan</div>'; } // puan 0 ise gozukmesin
	
	userpage +='</div>'+
	bildirimbutonu + // kendi sayfasiysa gorunecek
	gorevittirmehtml + // kendi sayfasiysa bos string
	'<div class="bio">' + userbio;
	if (account.uid == Drupal.user.uid)	
	userpage += '<br><br><h4 class="checkintamambaslik">Yaptığım Görevler</h4></div>';
	else 
	userpage += '<br><br><h4 class="checkintamambaslik">Görev Geçmişi</h4></div>';
	userpage +='</div>'+
	'<ul id="bitengorevpanel-'+ account.uid +'" class="gorevpanel"></ul>'+ // yaptigi gorevler - ekledikleri - kendisine verilen gorevler
	'</div>';
	
	var build = {
            theme: 'user_profile',
            // @todo - is this line of code doing anything?
            account: account,
            // @todo - this is a core field and should by fetched from entity.js
            title: {markup: ''},
            content: {markup: userpage}
	};
	  
	  _drupalgap_entity_page_container_inject('user', account.uid, 'view', build);
	  
	  /*Kapak Resmi ve Kullanici Resmi*/
	  
	  views_datasource_get_view_result('drupalgap/kapakresmi/' + uid,{ // gorevi tamamlayan kullanicilar listesi view call
	success:function(data) {
	//var items = [];
	var counter = data.view.count;
	if(counter == 0) { return }; // sistemi yormaya gerek yok
	$.each(data.nodes, function(index, object){

	  var tempkapak = object.node.field_kapak_resmi2.src;
	  
	  if (counter > 0) counter--;
	  if (counter==0){
	$('#kunye_' + uid).css("background-image", "url(" + tempkapak + ")");
	$('#kunye_' + uid).css("background-size", "cover");
	$('#kunye_' + uid).css("background-position", "center center");
	  }
	});
	   }});
	   
	views_datasource_get_view_result('drupalgap/profilresmi/' + uid,{ // gorevi tamamlayan kullanicilar listesi view call
	success:function(data) {
	//var items = [];
	var counter = data.view.count;
	if(counter == 0) { return }; // sistemi yormaya gerek yok
	$.each(data.nodes, function(index, object){

	  var tempresim = object.node.field_kullan_c_resmi2.src;
	  
	  if (counter > 0) counter--;
	  if (counter==0){
	$('#profilresmi_' + uid).empty();
	$('#profilresmi_' + uid).append('<img src="' + tempresim + '" />');
	
	  }
	});
	   }});
	  
	  var useractivity = '';
	  
	  // Panel
	  // --Yaptığı görevler
	  // --Ekledikleri
	  // --Challenge
	  
	  // Tamamladigi gorevler
	
	  views_datasource_get_view_result('drupalgap/tamamladiklarim/' + uid,{
	success:function(data) {
	  var items = [];
	  $.each(data.nodes, function(index, object){
	  var node = object.node;
	  var image = {
	path:node.field_g_rev_tan_t_c_resmi.src
	  };
	  var image_html = theme('image', image);
	  if (node.field_atan_lan_kullan_c_)
	var name_html = '<div class="banner">' + image_html + '<h6 class="challengebanner">'+ node.field_atan_lan_kullan_c_ +' - özel görev</h6><h2 class="bannerbaslik">' + node.title + '</h2><h3 class="puan">' + node.field_puanint + '</h3></div>';
	  else
	var name_html = '<div class="banner">' + image_html + '<h2 class="bannerbaslik">' + node.title + '</h2><h3 class="puan">' + node.field_puanint + '</h3></div>';
	  var item = l(name_html, 'renderednode/' + node.nid, {reloadPage:true});
	  items.push(item);
	  });
	  if (items.length == 0)
	items.push("<center><p>Bu kullanıcı henüz bir görev tamamlamamış.</p></center>");
	  
	drupalgap_item_list_populate("#bitengorevpanel-"+uid, items);

	}
	  });
	}
    });
	
	appAktifLoop();
	// appGenelBildirim(); // YoungnBold v2'de kaldirildi
	
  }
  catch (error) { console.log('mobilwit_user_view_pageshow - ' + error); }
  
  // Pull to refresh baslangic
  // Set aside the thresholds so they can be reset later.
/*var _scrollSupressionThreshold = $.event.special.swipe.scrollSupressionThreshold;
var _horizontalDistanceThreshold = $.event.special.swipe.horizontalDistanceThreshold;
var _verticalDistanceThreshold = $.event.special.swipe.verticalDistanceThreshold;

// Adjust the thresholds for a vertical swipe.
$.event.special.swipe.scrollSupressionThreshold = 5;
$.event.special.swipe.horizontalDistanceThreshold = 1;
$.event.special.swipe.verticalDistanceThreshold = 128;

// Listen for the swipe event...
$('#' + drupalgap_get_page_id() + ' div[data-role="header"]').on("swipe", function() {

  // Reset thresholds.
  $.event.special.swipe.scrollSupressionThreshold = _scrollSupressionThreshold;
  $.event.special.swipe.horizontalDistanceThreshold = _horizontalDistanceThreshold;
  $.event.special.swipe.verticalDistanceThreshold = _verticalDistanceThreshold;

  // Reload the current page.
  drupalgap_goto(drupalgap_path_get(), { reloadPage: true });

}); // Pull to refresh son*/

} // User end

/**
 * Page callback for rendernode/%. - Gorev
 * @param {Number} nid
 * @return {Object}
 */
function mobilwit_node_page_view(nid) {
  try {
    if (nid) {
      var content = {
        container: _drupalgap_entity_page_container('node', nid, 'view')
      };
      return content;
    }
    else { drupalgap_error('No node id provided!'); }
  }
  catch (error) { console.log('mobilwit_node_page_view - ' + error); }
}

/**
 * jQM pageshow handler for rendernode/% pages. -- Mobilwit Edition Gorev
 * @param {Number} nid
 */
function mobilwit_node_page_view_pageshow(nid) {
  try {
	  console.log('node_load 2020');
    node_load(nid, {
        success: function(node) {
	console.log('node_load 2020 success');
	dpm(node);
	 /***if (node.body.length > 0) node.body.und[0].value = emoji.replace_colons(node.body.und[0].value); // emoji display***/
	 
	 console.log('node_load 2020 success 2');
	
	if (node.type == 'g_rev') {  /*** GOREV SAYFASI ***/
          // Build the node display. - gorev
	  //console.log('node_load gorev icinde');
	  
	  var title_html = '';
	  
	  if (node.field_challenge.und)
	{
	//console.log('challenge secili');
	if (node.field_challenge.und[0].value == 1)
	{
	console.log('challenge secili 2');
	title_html += '<h5 id="challengeinfo"><span id="atayan' + node.nid + '"></span> tarafından <span id="atanan' + node.nid + '"></span> verildi.</h5>'
	//console.log("target_id: " + node.field_atan_lan_kullan_c_.und[0].target_id);
	user_load(node.field_atan_lan_kullan_c_.und[0].target_id, { success: function(user){ $('#atanan'+ node.nid).append(user.name + " kullanıcısına");}});
	user_load(node.uid, { success: function(user){ $('#atayan'+ node.nid).append(user.name); }});
	//title_html += '<h3>' + atayan +' tarafından '+ atanilan +' kullanıcısına verildi.</h3>'
	}
	}
	
	  //console.log('gorev_resmi');
	  if (node.field_g_rev_tan_t_c_resmi.und)
	  {
	  
	  var image = { // Gorev resmi image path
	path:drupalgap_image_path(node.field_g_rev_tan_t_c_resmi.und[0].uri)
	  };
	}
	else{
	var image = { // Gorev resmi image path
	path:drupalgap_get_path('module', 'mobilwit_stuff') + '/butongeneric.jpg'
	  };
	}
	  
	  // tepede image
	  // image uzerinde baslik
	  //console.log('node title');
	  title_html += '<h2 class="icerik-baslik">' + node.title + '</h2>';
	  var baslik_html = '<div class="mobilwit-activity-img"><img src="'+ image.path +'" />' + title_html + '</div>'; /*theme('image', image);*/

	  // puan (baslik/banner altinda sol ust)
	  
	  console.log('puan check');
	  if(node.field_puanint.und)
	var puan_html = '<div class="gorev-puan"><img src="' + drupalgap_get_path('module', 'mobilwit_stuff') + '/puangorevbg.png" /><span>' + node.field_puanint.und[0].value + ' puan</span></div>';
	  else var puan_html = '';
	  
	  console.log('puan html - ' + puan_html);
	  
	  // Once bos container
	  var tamamlayan_html = '<div id="tamamlayan-liste' + nid + '" class="tamamlayan-liste"></div>'; // Append edilecek container
	  var middle_html = '<div id="gorev_govde' + nid + '" class="gorev_govde"></div>'; // Append edilecek container
	  var bottom_html = '<div id="gorev_eklenenler' + nid + '" class="gorev_eklenenler"><img id="listeloader" src="' + drupalgap_get_path('module', 'mobilwit_stuff') + '/liste_loader.gif" /></div>'; // Append edilecek container
	  
	  
	  var rendered = baslik_html + puan_html + tamamlayan_html + middle_html + bottom_html;
	  
	  // Container taratma (view call sonuclarini kaybetmemek icin)
	  var build = {
            theme: 'node',
            // @todo - is this line of code doing anything?
            node: node,
            // @todo - this is a core field and should by fetched from entity.js
            title: {markup: ''},
            content: {markup: rendered}
          };
	  
	  _drupalgap_entity_page_container_inject('node', node.nid, 'view', build); // DOM sayfa container'i
	  
	  if (node.field_tamamlayan_kullan_c_lar.und){ // Gorevi bitiren kullanici varsa

	views_datasource_get_view_result('drupalgap/gorevler-bitirenler/' + nid,{ // gorevi tamamlayan kullanicilar listesi view call
	success:function(data) {
	//var items = [];
	//var counter = data.view.count;
	var countertotal = data.view.count;
	var counter = 5; // 5 kisi gosterelim
	var templist = '<ul id="gorev_user_bitirenler">';
	$.each(data.users, function(index, object){
	
	  if (counter==0){ return } // artik islem yapmasin 
	
	  var imagenode = object.user;
	  //var imagegallery_html = theme('image', userimagehtml);
	  var imagegallery_html = '<img id="profilthumb_'+ imagenode.Uid +'" src="' + drupalgap_get_path('module', 'mobilwit_stuff') + '/kullanicidefault.png" />'; // placeholder
	  
	  //Kullanici resimlerini al
	  views_datasource_get_view_result('drupalgap/profilresmi/' + imagenode.Uid,{ // gorevi tamamlayan kullanicilar listesi view call
	success:function(data) {
	//var items = [];
	var counter2 = data.view.count;
	if(counter2 == 0) { return }; // sistemi yormaya gerek yok
	$.each(data.nodes, function(index, object){

	  var tempresim = object.node.field_kullan_c_resmi2_1.src; // yuvarlak resim ayari
	  
	  if (counter2 > 0) counter2--;
	  if (counter2==0){
	$('#profilthumb_' + object.node.uid).attr("src", tempresim);
	  }
	});
	   }});

	  templist += '<li><a href=# onclick="javascript:drupalgap_goto(\'user/' + imagenode.Uid + '\', {options:\'reloadPage:true\'})"><div class="gorev-bitiren-user">' +imagegallery_html + '</div></a></li>';
	  
	  if (counter > 0) {
	  counter--;
	  countertotal--;
	  }
	  if (counter==0){
	  if (countertotal > 0){
	templist += '</ul><div><p>...ve ' + countertotal + ' yolcu daha!</p></div>'; // liste sonucu
	$('#tamamlayan-liste' + nid).append(templist);
	} // daha fazla tamamlayan varsa
	else{ // 5 veya daha az tamamlayan varsa
	templist += '</ul>'; // liste sonucu
	$('#tamamlayan-liste' + nid).append(templist);
	} // each bitsin
	  }
	});
	   }});
	} // if sonu
	
	
	  else // Gorevi bitiren kullanici yoksa
	$('#tamamlayan-liste' + nid).append('<div class="bitirenler-minilist-bos">Bu görevi ilk tamamlayan sen olabilirsin!</div>');
	
	var kullanici = Drupal.user;
	var roller = '';
	//dpm(Drupal.user);
	$.each(kullanici.roles, function(rid, value) {
	rid = rid - 2; // rol referanslari 1'den basliyor
	if (rid == 11) // roleswitcher ve izleyici pas gecilsin
	{
	roller = 'izleyici';
	}
    });
	  
	 
	  var body_html = '<div class="mobilwit-activity-body">' + node.body.und[0].value + '</div><center><div class="hatirlatma-markup"><br><strong>Bu görevi yaptın mı? O halde kanıtla!</strong><br><br></div></center>'; // statik html
	  
	  // Foto ekle - Video ekle - Deneyim ekle (nav buton list) --> referenced node add
	  
	  if (node.field_g_rev_durumu.und[0].value == 1)
	  {	  // gorev acik
	  var ekleme_html = '<center><div data-role="controlgroup" data-type="horizontal"> <a href="#" onclick="mobilwit_updatevar(' + nid + ', \'fotograf\')" class="ui-btn ui-corner-all">Fotoğraf<br> Ekle</a>'; // Fotograf
	  ekleme_html += '<a href="#" onclick="mobilwit_updatevar(' + nid + ', \'video\')" class="ui-btn ui-corner-all">Video<br>Ekle</a>'; // Video
	  //ekleme_html += '<a href="#" onclick="mobilwit_updatevar(' + nid + ', \'gif\')" class="ui-btn ui-corner-all">Gif<br>Ekle</a>'; // Gif
	  ekleme_html = ekleme_html + '<a href="#" onclick="mobilwit_updatevar(' + nid + ', \'deneyim\')" class="ui-btn ui-corner-all">Deneyim<br>Ekle</a> </div></center>'; // Yolculuk - Deneyim

	  }
	  else //gorev kapali
	  {
	  ekleme_html='<div class="gorev-bitis" style="text-align: center; padding: 10px;">Bu göreve katılımlar sonlandı.<br>Diğer görevlere göz atmaya ne dersin?</div>';
	  }
	  
	  if (roller == 'izleyici'){
	  ekleme_html='<div class="gorev-bitis" style="text-align: center; padding: 10px;">Bu görev için yapılmış paylaşımları aşağıdan izleyebilirsin.</div>';
	  }
	  // Benim eklediklerim (eklenenler view - arg = current user)
	  // Son eklenenler (eklenenler view - noarg - son 10 tanesi

	  // Render - build asamasi
	  
	  //build.content.markup = build.content.markup + body_html + ekleme_html;
	  rendered = body_html + ekleme_html;
	  
	  $('#gorev_govde' + nid).append(rendered).trigger("create");
	  
	  views_datasource_get_view_result('drupalgap/goreve-eklenenler/' + nid,{ // goreve eklenen icerikler
	success:function(data) {
	//var items = [];
	var counter = data.view.count;
	if (counter == 0)
	var templist = '<div class="eklenenler-bos-liste"><p>Henüz kimse bir ekleme yapmamış.</p></div>';
	else {
	var templist = '<ul id="gorev_eklenenler_listesi">';
	$.each(data.nodes, function(index, object){
	
	  var imagenode = object.node;
	  
	  //Kullanici resimlerini al
	  // View birlestirip json yaratinca drupal view newline ve quote escape characterlerini halledemiyor
	  
	  var json = imagenode.view.replace('"\n', '');
	  json = json.replace('\n "', '');
	  json = json.replace(/(\r\n|\n|\r)/gm,''); // newline removal
	  json = json.replace('\"', '"');
	  json = json.replace(/\s+/g,''); // space removal
	  
	  json = JSON.parse(json); // object yaratilsin
	  
	  //console.log("eklenenler view değeri (json) : ");
	  //dpm(json);
	  
	  if(json.view.count > 0) // kullanici resmi varsa
	var imagegallery_html = '<img class="profilthumb2_'+ imagenode.uid +'" src="' + json.nodes[0].node.field_kullan_c_resmi2.src + '" />'; // profil resmi
	  else // kullanici resmi yoksa
	var imagegallery_html = '<img class="profilthumb2_'+ imagenode.uid +'" src="' + drupalgap_get_path('module', 'mobilwit_stuff') + '/kullanicidefault_80.png" />'; // placeholder
	  
	  templist += '<li><a href=# onclick="javascript:drupalgap_goto(\'user/' + imagenode.uid + '\', {options:\'reloadPage:true\'})"><div class="gorev-bitiren-user">' +imagegallery_html + '</div></a><div class="eklenen-aktivite"><a href=# onclick="javascript:drupalgap_goto(\'node/' + imagenode.nid + '\', {options:\'reloadPage:true\'})"> ' + imagenode.field_ad_soyad_ + ' bir ' + imagenode.type + ' ekledi.<br>(' + imagenode.count + ' <img class="likeikonu" src="' + drupalgap_get_path('module', 'mobilwit_stuff') + '/liked_turuncu.png" />)';
	  
	 /* if(imagenode.onay==1) // ----->  Fikirsensin icin geri eklendi
	  templist += '<img id="onaylanma_'+ imagenode.uid +'" class="onaylanma" src="' + drupalgap_get_path('module', 'mobilwit_stuff') + '/onay.png" />';
	  else
	  templist += '<img id="onaylanma_'+ imagenode.uid +'" class="onaylanma" src="' + drupalgap_get_path('module', 'mobilwit_stuff') + '/onay0.png" />';*/
 
	  templist += '(' + imagenode.comment_count + ' <img class="commentikonu" src="' + drupalgap_get_path('module', 'mobilwit_stuff') + '/comment_sayi.png" />)';
	  templist +='</a></div></li>';
	  
	  
	  if (counter > 0) counter--;
	  if (counter==0){
	//dpm(gallerycontent);;
	templist += '</ul><br><br>'; // liste sonucu	
	  }}
	);
	}// else bitti
	
	$('#gorev_eklenenler' + nid).empty(); // remove loader
	$('#gorev_eklenenler' + nid).append(templist);
	   }});
	  
	  
	} // if - gorev

	else{
	//history.back();
	console.log("History dökümü");
	dpm(history);
	drupalgap_goto('node/' + node.nid, {options:'reloadPage:true'});
	//drupalgap_remove_pages_from_dom(); // dogru bir hareket mi?
	// back tusu icin fix
	//history.pop(); // boyle bir sey yok
	var page_id = drupalgap_get_page_id(drupalgap.back_path.pop());
	drupalgap_remove_page_from_dom(page_id);
	
	}
	
	}
    });
  }
  catch (error) { console.log('mobilwit_gallery_node_page_view_pageshow - ' + error); }
}


/*** BACK RELOAD BILDIRIM FIX ***/

/*----------function drupalgap_back() {
  try {
    if ($('.ui-page-active').attr('id') == drupalgap.settings.front) {
      var msg = 'Exit ' + drupalgap.settings.title + '?';
      if (drupalgap.settings.exit_message) {
        msg = drupalgap.settings.exit_message;
      }
      drupalgap_confirm(msg, {
          confirmCallback: _drupalgap_back_exit
      });
	  //drupalgap_goto('introduction', {reloadPage:true}); // exit yerine anasayfaya gitsin
    }
    else { _drupalgap_back(); }
  }
  catch (error) { console.log('drupalgap_back' + error); }
}--------*/

/*----------function _drupalgap_back() {
  try {
  var hedefyol = drupalgap.back_path.pop();
	  if (hedefyol == 'mobile-notifications' || hedefyol == 'bildirimlerim')
	  {
	console.log("Bildirim sayfası refresh edilecek.");----------*/
	/*var options = {};
	var router_path = drupalgap_get_menu_link_router_path(hedefyol);
	var page_id = drupalgap_get_page_id(hedefyol);
	drupalgap_remove_page_from_dom(page_id, { force: true });
	options.reloadingPage = true;
	
	drupalgap_goto_generate_page_and_go( // yeniden sayfa yapılacak
	  hedefyol,
	  page_id,
	  options,
	  drupalgap.menu_links[router_path]
	);*/
	/*var page_id = drupalgap_get_page_id(drupalgap.back_path.pop());
	drupalgap_remove_page_from_dom(page_id);*/
	//drupalgap.back_path.pop();
	/*page_id = drupalgap_get_page_id(drupalgap.back_path.pop());
	drupalgap_remove_page_from_dom(page_id);
	history.back();*/
	//drupalgap.back_path.pop();
	//history.go(-2); // iki geri bir ileri - dirty fix
	 // iki ust satir bir onceki cozumdu
	/*--------drupalgap_goto(hedefyol, {reloadPage:true});
	drupalgap_remove_pages_from_dom();	
	  }
	  else if ($('.ui-page-active').attr('id') == 'mobile_notifications' || $('.ui-page-active').attr('id') == 'bildirimlerim')
	      {
	if(hedefyol != 'introduction')
	{
	drupalgap_goto('introduction', {reloadPage:true});
	console.log("Anasayfaya gidiyor - Reload True - Back Fonksiyonu - hedefyol: " + hedefyol);
	}
	else
	{
	drupalgap.back = true;
	history.back();
	drupalgap_path_set(hedefyol);
	console.log("Anasayfaya gidiyor - Normal Back Fonksiyonu - hedefyol: " + hedefyol);
	}
	
	  }
	  else
	  {	  
	drupalgap.back = true;
	history.back();
	drupalgap_path_set(hedefyol);
	  }
  }
  catch (error) { console.log('drupalgap_back' + error); }
}---------*/ // ***   bu ---- kisimlar son halleriydi   ***



/*Resim Ekleme*/

/**
* Custom callback to capture argument for node edit - IMAGE
*/

function mobilwit_node_add_page_by_type(reference_id){ // Buna gerek olmayabilir
    mobilwit_arg = reference_id;
	console.log('Mobilwit arg callback - ' + mobilwit_arg );
	drupalgap_goto('node/add/gorev', {reloadPage:true}); 
}

/**
 * Implements hook_form_alter().
 */
function mobilwit_stuff_form_alter(form, form_state, form_id) {
  //alert(form_id); //To see the id of a form on page
  //dpm(form);
  try {
    if (form_id == 'node_edit') { // Deneyim, fotograf, video, gif icin
	//dpm(form);
	if(form.bundle != 'g_rev'){
	  //form.elements.title.name = "Başlık";
	  //form.elements.title.title = "Başlık";
	  
	  form.prefix = '<div data-role="collapsible" data-inset="false"><h3>Görevi görmek için tıkla</h3><p><span id="' + form_id + mobilwit_arg + '"></span></p></div><br><br>';
	  
	  node_load(mobilwit_arg, {success:function(node){
	 $('#' + form_id + mobilwit_arg).append( node.body.und[0].value );
	 console.log("görev sorusu forma eklendi: " + node.body.und[0].value);
	  }
	});
	  
	  form.elements.title.type = "hidden";
	  var d = new Date();
	  form.elements.title.default_value = form.bundle + "_" + Drupal.user.uid + "_" + d.valueOf();
	  form.elements.title.required = false;
	  if(form.bundle == "fotograf" || form.bundle == "deneyim" || form.bundle == "video" || form.bundle == "gif"){
	  
	  form.elements.field_gorev_ba_lant_s_.type = "hidden";
	  form.elements.field_onay.type = "hidden";
	  form.elements.field_gorev_ba_lant_s_.und[0].default_value = mobilwit_arg; // passing value as default value (Gorev)
	  form.elements.submit.value = "Kaydet";
	  form.buttons.cancel.title = "Vazgeç";
	  /***form.validate.push('emoji_cevirme');***/
	  form.submit.push('eklenen_icerik_submit');
	  
	  if(form.bundle == "video"){
	  //form.elements.submit.disabled = true; // video secilmeden submit edilemesin -- video js modülü kaldırıldı, media icin gerek yok
	  }
	  
	  }
	  if(form.bundle == "kapak_resmi" || form.bundle == "kullan_c_resmi"){
	form.submit.push('profil_degisiklik_submit');
	//form.action ='user/' + Drupal.user.uid;
	form.action = drupalgap.settings.front;
	form.elements.submit.value = "Kaydet";
	form.buttons.cancel.title = "Vazgeç";
	  }
	  form.action = drupalgap.settings.front;
	  //form.submit.push('mobilwit_stuff_image_submit'); // Clear DOM...
	  //dpm(form);
	  }
	  if(form.bundle == 'g_rev'){ // Gorev icin
	  //dpm(Drupal.user);
	  console.log(form.elements.field_g_rev_tan_t_c_resmi.und[0].children);
	form.elements.title.name = "Başlık";
	form.elements.title.title = "Başlık";
	//form.elements.field_g_rev_tan_t_c_resmi.type = "hidden";
	//form.elements.field_g_rev_tan_t_c_resmi.und[0].children = "";
	form.elements.field_tamamlayan_kullan_c_lar.type = "hidden";
	form.elements.field_quarter.type = "hidden";
	form.elements.field_challenge.type = "hidden";
	form.elements.field_challenge.und[0].default_value = true;
	form.elements.field_atan_lan_kullan_c_.type = "hidden";
	form.elements.field_puanint.type = "hidden";
	form.elements.body.title = "Görev Açıklaması";
	form.elements.field_atan_lan_kullan_c_.und[0].default_value = mobilwit_arg;
	//form.elements.field_ekip.type = "hidden";
	//form.elements.field_kategori.type = "hidden";
	form.elements.submit.value = "Görev ata!";
	form.buttons.cancel.title = "Vazgeç";
	//form.action ='drupalgap_goto(\'kullanicilar\');';
	form.submit.push('ittirilen_gorev_submit');
	//form.action = drupalgap.settings.front;
	form.action ='drupalgap_goto(\'user/' + mobilwit_arg.und[0] + '\');';
	  }
    }
	else if (form_id == 'comment_edit') {
	  //dpm(form);
	  form.prefix = "<h2>Yorum Ekle</h2>"
	  form.elements.name.type = "hidden";
	  form.elements.submit.value = "Kaydet";
	  form.elements.comment_body.title = "";
	 /*** form.validate.push('emoji_cevirme_comment');***/
	  //form.elements.subject.title = "Başlık";
	  //form.action = 'renderednode/image/' + form.elements.nid.default_value;
	  //form.submit.push('mobilwit_stuff_image_submit'); // Refresh page
	}
	else if (form_id == 'user_profile_form') {
	  //dpm(form.elements);
	  form.prefix = '<button type="button" id="edit-user-profile-form-kullanici-resim" onclick="drupalgap_goto(\'node/add/kullan_c_resmi\')" class=" ui-btn ui-shadow ui-corner-all">Profil Resmimi Değiştir</button>' + '<button type="button" id="edit-user-profile-form-kullanici-kapak" onclick="drupalgap_goto(\'node/add/kapak_resmi\')" class=" ui-btn ui-shadow ui-corner-all">Kapak Resmimi Değiştir</button>';
	  form.elements.name.title = "Kullanıcı Adı";
	  form.elements.mail.title = "E-posta";
	  form.elements.current_pass.title = "Mevcut Şifre";
	  form.elements.current_pass.description = "E-postanızı ve/veya şifrenizi değiştirmek için lütfen şifrenizi girin.";
	  form.elements.pass_pass1.title = "Şifre";
	  form.elements.pass_pass2.title = "Şifre - Tekrar";
	  form.elements.pass_pass2.description = "Mevcut şifrenizi değiştirmek için lütfen yeni şifrenizi bir kere daha girin.";
	  form.elements.field_kullanici_puan.type = "hidden";
        form.elements.field_user_puan.type = "hidden";
	  form.elements.submit.value = "Değişiklikleri Kaydet";
	  form.buttons.cancel.title = "Vazgeç";
	  /*form.buttons['kullanici_resim'] = {
        title: 'Profil Resmimi Değiştir',
        attributes: {
          onclick: "drupalgap_goto('node/add/kullan_c_resmi')"
        }
      };
	  form.buttons['kullanici_kapak'] = {
        title: 'Kapak Resmimi Değiştir',
        attributes: {
          onclick: "drupalgap_goto('node/add/kapak_resmi')"
        }
      };*/
	  form.buttons['kullanici_logout'] = {
        title: 'Origami\'den Çıkış',
        attributes: {
          onclick: "drupalgap_goto('user/logout')"
        }
      };
	  //console.log(form.elements); // profile
	  //dpm(form);
	}
	else if (form_id == 'user_login_form'){
	form.elements.submit.value = "Giriş Yap!";
	form.elements.name.title = 'Kullanıcı Adı';
	form.elements.pass.title = 'Şifre';
	form.buttons['forgot_password'].title = 'Şifremi unuttum';
	}
	else if (form_id == 'webform_form'){
	form.elements.submit.value = "Kaydet";
	//form.submit.push('webform_alert_submit');
	
	}
	else {
	form.elements.submit.value = "Kaydet";
	//form.buttons.cancel.title = "Vazgeç";
	}
  }
  catch (error) { console.log('my_module_form_alter - ' + error); }
}

/***function emoji_cevirme(form, form_state) {
   console.log('FORM ICERIKLERI - EMOJI to COLON: ');
   //dpm(form_state);
   //form_state.values.body.und[0] = "Validation aşamasında değiştirildi!";
   emoji.text_mode = true;
   emoji.colons_mode = true;
   form_state.values.body.und[0] = emoji.replace_unified(form_state.values.body.und[0]);
   emoji.text_mode = false;
   emoji.colons_mode = false;
}***/

/***function emoji_cevirme_comment(form, form_state) {
   console.log('FORM ICERIKLERI - EMOJI to COLON: ');
   dpm(form_state);
   //form_state.values.body.und[0] = "Validation aşamasında değiştirildi!";
   emoji.text_mode = true;
   emoji.colons_mode = true;
   form_state.values.comment_body.und[0] = emoji.replace_unified(form_state.values.comment_body.und[0]);
   emoji.text_mode = false;
   emoji.colons_mode = false;
}***/

function eklenen_icerik_submit(form, form_state) {
  //alert('Tebrikler! Katılımınız onay sürecine girdi!');
   
   //form.elements.body.value = emoji.replace_unified(form.elements.body.value);
   navigator.notification.alert('Tebrikler! Katılımınız sistemimize kaydedildi!', null, "Tebrikler!", "Kapat"); // APPDE BU OLACAK
}

function ittirilen_gorev_submit(form, form_state) {
  //alert('Check-In kaydedildi. Gerisi ona kalmış.');
  navigator.notification.alert('Görev kaydedildi. Gerisi ona kalmış.', null, "İşlem başarılı.", "Kapat"); // APPDE BU OLACAK
  //drupalgap_goto('user/' + mobilwit_arg.und[0] + '/');
  //alert(mobilwit_arg.und[0]);
}

function profil_degisiklik_submit(form, form_state) {
  //alert('Yeni resim kaydedildi.');
  navigator.notification.alert('Yeni resim kaydedildi.', null, "İşlem başarılı.", "Kapat"); // APPDE BU OLACAK
}

function webform_alert_submit(form, form_state) {
  //alert('Yeni resim kaydedildi.');
  navigator.notification.alert('Cevapların başarıyla kaydedildi.', null, "Teşekkürler!.", "Kapat"); // APPDE BU OLACAK
}

/*function mobilwit_stuff_image_submit(form, form_state) {
  //drupalgap_remove_page_from_dom('node_edit'); // Removing page from DOM, it stays there after submission for some reason...
  drupalgap_goto('renderednode/image/' + form.elements.nid.default_value, {'form_submission': true, transition:'flow'});
}*/


/***
****     BU KISIM UPDATELER ILE KALKABILIR - DEGISEBILIR - TODO: AYRI MODULDE TOPLA
****/

/**** DEBUG ****/

/*** ENTITY REFERENCE LINK DUZELTME ***/

function entityreference_field_formatter_view(entity_type, entity, field, instance, langcode, items, display) {

  try {
    var element = {};
    $.each(items, function(delta, item) {
	if (item['entity_type'] == 'node')
	{
	element[delta] = {
	  theme: 'button_link',
	  text: item[entity_primary_key_title(item['entity_type'])],
	  path: 'renderednode/' + item['target_id']
	};
	}
	else {
	element[delta] = {
	  theme: 'button_link',
	  text: item[entity_primary_key_title(item['entity_type'])],
	  path: item['entity_type'] + '/' + item['target_id']
	};
	}
    });
    return element;
  }
  catch (error) { console.log('entityreference_field_formatter_view - ' + error); }
}

function drupalgap_field_info_instances_add_to_form(entity_type, bundle,
  form, entity) {
  try {
    // Grab the field info instances for this entity type and bundle.
	// console.log('Başlıyor - ' + bundle); // 
    var fields = drupalgap_field_info_instances(entity_type, bundle);
	// dpm(fields); //
    // If there is no bundle, pull the fields out of the wrapper.
    //if (!bundle) { fields = fields[entity_type]; }
    // Use the default language, unless the entity has one specified.
    var language = language_default();
    //if (entity && entity.language) { language = entity.language; } // Language default olarak kalsin, [tr][delta] kısmında loop cokuyor *** FIX *** 
	console.log('Language - ' + language);
    // Iterate over each field in the entity and add it to the form. If there is
    // a value present in the entity, then set the field's form element default
    // value equal to the field value.
    if (fields) {
      $.each(fields, function(name, field) {
	  // console.log('EACH baslangic - ' + name); //
	  dpm (field); //
        // The user registration form is a special case, in that we only want
        // to place fields that are set to display on the user registration
        // form. Skip any fields not set to display.
	//console.log('EACH form-.id - ' + form.id + ' -- field.settings.user_register_form - ' + field.settings.user_register_form);
        if (form.id == 'user_register_form' &&
          !field.settings.user_register_form) {
          return;
        }
        var field_info = drupalgap_field_info_field(name);
	//console.log('field info - ' + name); //
	//dpm (field_info); //
        if (field_info) {
          form.elements[name] = {
            type: field_info.type,
            title: field.label,
            required: field.required,
            description: field.description
          };
	  //console.log('form.elements '+ name); //
          if (!form.elements[name][language]) {
            form.elements[name][language] = {};
          }
	  //dpm(form.elements[name]); //
          var default_value = field.default_value;
          var delta = 0;
          var cardinality = parseInt(field_info.cardinality);
          if (cardinality == -1) {
            cardinality = 1; // we'll just add one element for now, until we
                             // figure out how to handle the 'add another
                             // item' feature.
          }
	  // dpm(entity); //
          if (entity && entity[name] && entity[name].length != 0) {
            for (var delta = 0; delta < cardinality; delta++) {
              // @TODO - is this where we need to use the idea of the
              // value_callback property present in Drupal's FAPI? That way
              // each element knows how to map the entity data to its element
              // value property.
              if (
                entity[name][language][delta] &&
                typeof entity[name][language][delta].value !== 'undefined'
              ) { default_value = entity[name][language][delta].value; }
              // If the default_value is null, set it to an empty string.
              if (default_value == null) { default_value = ''; }
              // @todo - It appears not all fields have a language code to use
              // here, for example taxonomy term reference fields don't!
              form.elements[name][language][delta] = {
                value: default_value
              };
              // Place the field item onto the element.
              if (entity[name][language][delta]) {
                form.elements[name][language][delta].item =
                  entity[name][language][delta];
              }
            }
          }
        }
      });
    }
  }
  catch (error) {
    console.log('drupalgap_field_info_instances_add_to_form - ' + error);
  }
}



/**
****** RESIM YUKLEME - RESIZE ******* image.js override
**/

function image_field_widget_form(form, form_state, field, instance, langcode,
  items, delta, element) {
  try {
  
	
    // Change the item type to a hidden input to hold the file id.
    items[delta].type = 'hidden';

    // If we already have an image for this item, show it.
    if (typeof items[delta].item !== 'undefined' && items[delta].item.fid) {
      // Set the hidden input's value equal to the file id.
      items[delta].value = items[delta].item.fid;
      // Show the image on the form, the file name as a link to the actual file,
      // the file size, and a remove button.
      var path = drupalgap_image_path(items[delta].item.uri);
      // @TODO - show the filesize.
      // @TODO - show the remove button.
      var html = theme('image', { path: path }) +
        '<div class="filename">' +
          l(items[delta].item.filename, path, { InAppBrowser: true }) +
        '</div>';
        /*theme('button_link', {
            text: 'Remove',
            path: null,
            attributes: {
              onclick: "_image_field_widget_form_remove_image()",
              'data-icon': 'delete',
              'data-iconpos': 'right'
            }
        });*/
        //'<div class="filesize">(' + items[delta].item.filesize + ')</div>';
      // Add html to the item's children.
      items[delta].children.push({markup: html});
      return; // No further processing required.  // NEDEN???
    }
	
	/*if (form.id == 'user_profile_form' && element.name == 'picture') {
      field = { field_name: 'picture' };
    }*/
	
	/*if (form.id == 'user_profile_form') {
      field = { field_name: element.name };
    }
	console.log('element.name - image.js - ' + element.name);*/

    // Set the default button text, and if a value was provided,
    // overwrite the button text.
    var button_text = 'Yeni Fotoğraf Çek';
    if (items[delta].value) { button_text = items[delta].value; }
    var browse_button_text = 'Albümden Seç';
    if (items[delta].value2) { browse_button_text = items[delta].value2; }

    // Place variables into document for PhoneGap image processing.
    var item_id_base = items[delta].id.replace(/-/g, '_');
    var image_field_source = item_id_base + '_imagefield_source';
    var imagefield_destination_type =
      item_id_base + '_imagefield_destination_type';
    var imagefield_data = item_id_base + '_imagefield_data';
    eval('var ' + image_field_source + ' = null;');
    eval('var ' + imagefield_destination_type + ' = null;');
    eval('var ' + imagefield_data + ' = null;');
    // Build an imagefield widget with PhoneGap. Contains a message
    // div, an image item, a button to add an image, and a button to browse for
    // images.
    var browse_button_id = items[delta].id + '-browse-button';
    var html = '<div>' +
      '<div id="' + items[delta].id + '-imagefield-msg"></div>' +
      '<img id="' + items[delta].id + '-imagefield" style="display: none;" />' +
      '<a href="#" data-role="button" data-icon="camera" ' +
        'id="' + items[delta].id + '-button">' +
        button_text +
      '</a>' +
      '<a href="#" data-role="button" data-icon="grid" ' +
        'id="' + browse_button_id + '">' +
        browse_button_text +
      '</a>' +
    '</div>';
    // Open extra javascript declaration.
    html += '<script type="text/javascript">';
    // Add device ready listener for PhoneGap camera.
    var event_listener = item_id_base + '_imagefield_ready';
    html += '$("#' + drupalgap_get_page_id(
      drupalgap_path_get()) + '").on("pageshow",function(){' +
        'document.addEventListener(' +
        '"deviceready", ' +
        event_listener + ', ' +
        'false);' +
      '});' +
    'function ' + event_listener + '() {' +
      image_field_source + ' = navigator.camera.PictureSourceType;' +
      imagefield_destination_type + ' = navigator.camera.DestinationType;' +
    '}';
    // Define error callback function.
    var imagefield_error = item_id_base + '_error';
    html += 'function ' + imagefield_error + '(message) {' +
      'if (message != "Camera cancelled." && ' +
        'message != "Selection cancelled." && ' +
        'message != "no image selected")' +
      '{' +
        'console.log("' + imagefield_error + '");' +
        'drupalgap_alert(message);' +
      '}' +
    '}';
    // Define success callback function.
    var imagefield_success = item_id_base + '_success';
	//console.log('field - imagefield bilgileri');
	//dpm(field); // user profile sayfasinda burasi null geliyor
	
	if (form.id == 'user_profile_form' && element.name != 'picture') { // Cok dirty bir fix denemesi
      field = { field_name: element.name };
    }
	
	console.log('field - if user profile edit page - imagefield bilgileri');
	dpm(field);
	
    html += 'function ' + imagefield_success + '(imageData) {' +
      '_image_phonegap_camera_getPicture_success(' +
      '{field_name:"' + field.field_name + '", ' +
        'image:imageData, id:"' + items[delta].id + '"' +
       '})' +
    '}';
    // Determine image quality. // RESIM AYARLARI BURADA DEGISTI - Cordova ayarlari uzerinden
    var quality = 50;
    if (drupalgap.settings.camera.quality) {
      quality = drupalgap.settings.camera.quality;
    }
    // Add click handler for photo button.
    html += '$("#' + items[delta].id + '-button").on("click",function(){' +
      'var photo_options = {' +
        'quality: ' + quality + ',' +
        'destinationType: ' + imagefield_destination_type + '.DATA_URL,' +
        'correctOrientation: true,' +
	'targetWidth:' + 800 +', targetHeight:' + 800 +
      '};' +
      'navigator.camera.getPicture(' +
        imagefield_success + ', ' +
        imagefield_error + ', ' +
        'photo_options);' +
    '});';
    // Add click handler for browse button.
    html += '$("#' + browse_button_id + '").on("click",function(){' +
      'var browse_photo_options = {' +
        'quality: ' + quality + ',' +
        'sourceType: ' + image_field_source + '.PHOTOLIBRARY,' +
        'destinationType: ' + imagefield_destination_type + '.DATA_URL,' +
        'correctOrientation: true,' +
	'targetWidth:' + 800 +', targetHeight:' + 800 +
      '};' +
      'navigator.camera.getPicture(' +
        imagefield_success + ', ' +
        imagefield_error + ', ' +
        'browse_photo_options);' +
    '});';
    // Close extra javascript declaration.
    html += '</script>';
    // Add html to the item's children.
    items[delta].children.push({markup: html});
  }
  catch (error) { console.log('image_field_widget_form - ' + error); }
}

/*** MOBILE NOTIFICATION FIX ***/



/* Node edit baslik fix */

/**
 * Title call back function for node/add/[type].
 * @param {Function} callback
 * @param {String} type
 * @return {Object}
 */
function node_add_page_by_type_title(callback, type) {
  try {
    var title = '';
    return callback.call(null, title);
  }
  catch (error) { console.log('node_add_page_by_type_title - ' + error); }
}

/*** YORUMLAR TEMA OVERRIDE ***/

/**
 * Theme's a comment container.
 * @param {Object} variables
 * @return {String}
 */
function theme_comments(variables) {
  try {
    // Set the container id and append default attributes.
    variables.attributes.id = comments_container_id(variables.node.nid);
    variables.attributes['class'] += 'comments ';
    //variables.attributes['data-role'] = 'collapsible-set'; // collapsible set olmasini istemiyoruz
    // Open the container.
    var html = '<div ' + drupalgap_attributes(variables.attributes) + '>';
    // Show a comments title if there are any comments.
    if (variables.node.comment_count > 0) { html += '<h4>Yorumlar</h4>'; }
    // If the comments are already rendered, show them.
    if (variables.comments) { html += variables.comments; }
    // Close the container and return the html.
    html += '</div>';
    return html;
  }
  catch (error) { console.log('theme_comments - ' + error); }
}

/**
 * Theme's a comment.
 * @param {Object} variables
 * @return {String}
 */
function theme_comment(variables) {
  try {
    var comment = variables.comment;
	dpm(comment);
    // Set the container id and append default attributes.
    variables.attributes.id = comment_container_id(comment.cid);
    variables.attributes['class'] += 'comment ';
    //variables.attributes['data-role'] = 'collapsible';
    variables.attributes['data-collapsed'] = 'false';
    var html = '<div ' + drupalgap_attributes(variables.attributes) + '>';
    var comment_content = '';
    // Any user picture?
    // @TODO - the user picture doesn't use an image style here, it uses the
    // original picture uploaded by the user, which can be varying sizes.
    var picture = '';
    if (comment.picture_uri) {
      picture += theme(
        'image', { path: drupalgap_image_path(comment.picture_uri) }
      );
    }
    // Comment date.
    var created = new Date(comment.created * 1000);
    created = created.toLocaleDateString();
    // Append comment extra fields and content. The user info will be rendered
    // as a list item link.
    var author = picture +
        //'<h3>' + comment.name + '</h3>' +
        '<p>' + comment.name + ' - <br>' + created + ':</p>';
    //author = l(author, 'user/' + comment.uid);
	author = '<a href="#" onclick="javascript:drupalgap_goto(\'user/' + comment.uid + '\');" class="ui-btn">' + author + '</a>'; // jquery override
	
    comment_content +=
      //'<h2>' + comment.subject + '</h2>' +
      '<ul data-role="listview" data-inset="true">' +
        '<li class="yorumlist" style="display: flex;">' + author + '<div class="comment_body">' + /*emoji.replace_colons(*/comment.comment_body.und[0].value/*)*/ + '</div>' + '</li>' + // JS EMOJI FIX - asıl burada
      '</ul>';
    html += comment_content;
    // Add an edit link if necessary.
    if (user_access('administer comments')) {
      html += theme('button_link', {
          text: 'Edit',
          path: 'comment/' + comment.cid + '/edit',
          attributes: {
            'data-icon': 'gear'
          }
      });
    }
    // Close the container and return the html.
    html += '</div>';
    return html;
  }
  catch (error) { console.log('theme_comment - ' + error); }
}


/*** JS EMOJI FIX ***/

function node_page_view_pageshow(nid) {
  try {
    node_load(nid, {
        success: function(node) {
          // By this point the node's content has been assembled into an html
          // string. This is because when a node is retrieved from the server,
          // we use a services post processor to render its content.
          // @see entity_services_request_pre_postprocess_alter()
          // Does anyone want to take over the rendering of this content type?
          // Any implementors of hook_node_page_view_alter_TYPE()?
          // @TODO this should probably be moved up to the entity level.
          var hook = 'node_page_view_alter_' + node.type;
          var modules = module_implements(hook);
          if (modules.length > 0) {
            if (modules.length > 1) {
              var msg = 'node_page_view_pageshow - WARNING - there is more ' +
                'than one module implementing hook_' + hook + '(), we will ' +
                'use the first one: ' + modules[0];
              console.log(msg);
            }
            var function_name = modules[0] + '_' + hook;
            var fn = window[function_name];
            fn(node, {
                success: function(content) {
                  _drupalgap_entity_page_container_inject(
                    'node', node.nid, 'view', content
                  );
                }
            });
            return;
          }
          // Build a done handler which will inject the given build into the page container. If there was a success
          // callback attached to the page options call it.
          var done = function(build) {
            _drupalgap_entity_page_container_inject(
                'node', node.nid, 'view', build
            );
            if (drupalgap.page.options.success) { drupalgap.page.options.success(node); }
          };
          // Figure out the title, and watch for translation.
          var default_language = language_default();
          var node_title = node.title;
          if (node.title_field && node.title_field[default_language]) {
            node_title = node.title_field[default_language][0].safe_value;
          }
          // Build the node display. Set the node onto the build so it makes it to the theme layer variables.
	  
	 /*** console.log("node_load - emoji replace colons start");
	  console.log("emoji: " + emoji);***/
	  
          var build = {
            'theme': 'node',
            'node': node,
            // @todo - this is a core field and should by fetched from entity.js
            'title': { markup: node_title },
            'content': { markup: /*emoji.replace_colons(*/node.content/*)*/ } // JS EMOJI FIX
          };
	  
	  /***console.log("node_load - emoji replace colons end");***/
	  
          // If comments are undefined, just inject the page.
          if (typeof node.comment === 'undefined') { done(build); }
          // If the comments are closed (1) or open (2), show the comments.
          else if (node.comment != 0) {
            if (node.comment == 1 || node.comment == 2) {
              // Render the comment form, so we can add it to the content later.
              var comment_form = '';
              if (node.comment == 2) {
                comment_form = drupalgap_get_form(
                  'comment_edit',
                  { nid: node.nid },
                  node
                );
              }
              // If there are any comments, load them.
              if (node.comment_count != 0) {
                var query = {
                  parameters: {
                    nid: node.nid
                  }
                };
                comment_index(query, {
                    success: function(results) {
                      try {
                        // Render the comments.
                        var comments = '';
                        for (var index in results) {
                            if (!results.hasOwnProperty(index)) { continue; }
                            var comment = results[index];
                            comments += theme('comment', { comment: comment });
                        }
                        build.content.markup += theme('comments', {
                            node: node,
                            comments: comments
                        });
                        // If the comments are open, show the comment form.
                        if (node.comment == 2 && user_access('post comments')) {
                          build.content.markup += comment_form;
                        }
                        // Finally, inject the page.
                        done(build);
                      }
                      catch (error) {
                        var msg = 'node_page_view_pageshow - comment_index - ' +
                          error;
                        console.log(msg);
                      }
                    },
                    error: function(xhr, status, msg) {
                      if (drupalgap.page.options.error) { drupalgap.page.options.error(xhr, status, msg); }
                    }
                });
              }
              else {
                // There weren't any comments, append an empty comments wrapper
                // and show the comment form if comments are open, then inject
                // the page.
                if (node.comment == 2) {
                  build.content.markup += theme('comments', { node: node });
                  if (user_access('post comments')) { build.content.markup += comment_form; }
                }
                done(build);
              }
            }
          }
          else {
            // Comments are hidden (0), append an empty comments wrapper to the
            // content and inject the content into the page.
            build.content.markup += theme('comments', { node: node });
            done(build);
          }
        },
      error: function(xhr, status, msg) {
        if (drupalgap.page.options.error) { drupalgap.page.options.error(xhr, status, msg); }
      }
    });
  }
  catch (error) { console.log('node_page_view_pageshow - ' + error); }
}



/*** FLAG ve LIKE FIX ***/

/**
 * Implements hook_entity_post_render_content().
 */
function flag_entity_post_render_content(entity, entity_type, bundle) {
  try {
    // Since flag isn't a field, we'll just prepend it to the entity content.
    if (entity_type == 'node') {
      var flags = flag_get_entity_flags(entity_type, bundle);
      if (!flags) { return; }
      var entity_id = entity[entity_primary_key(entity_type)];
      var html = '';
      var page_id = drupalgap_get_page_id();
      $.each(flags, function(fid, flag) {
          var container_id = flag_container_id(flag.name, entity_id);
          html += '<div id="' + container_id + '"></div>' +
            drupalgap_jqm_page_event_script_code(
              {
                page_id: page_id,
                jqm_page_event: 'pageshow',
                jqm_page_event_callback: '_flag_pageshow',
                jqm_page_event_args: JSON.stringify({
                    fid: fid,
                    entity_id: entity_id,
                    entity_type: entity_type,
                    bundle: bundle
                })
              },
              flag.fid
            );
      });
      entity.content = '<div class="eklenengovde ui-corner-all ui-shadow">' + entity.content + '</div>' + '<div id="icerikyazar' + entity_id + '" class="begenen-liste ui-corner-all ui-shadow"></div>' + '<div id="begenen-liste' + entity_id + '" class="begenen-liste ui-corner-all ui-shadow"></div>' + html; // Override satiri - flag icerigin altinda ve commentin uzerinde kaliyor bu sekilde
	  
      user_load(entity.uid, { success: function(user){ $('#icerikyazar' + entity_id).append('<a href=# onclick="javascript:drupalgap_goto(\'user/' + entity.uid + '\', {options:\'reloadPage:true\'})">Bunu ekleyen: ' + user.name + '</a>' ); }});
	  
	  if(bundle == 'deneyim' || bundle == 'fotograf' || bundle == 'video' || bundle == 'gif' || bundle == 'i_lham')
	  {
	
	views_datasource_get_view_result('drupalgap/begenenler/' + entity_id,{ // icerigi begenen kullanicilar listesi view call
	success:function(data) {
	//var items = [];
	var counter = data.view.count;
	$('#begenen-liste' + entity_id).empty();
	var baslikhtm = '';
	if(counter > 0)
	  baslikhtm = '<h4>Bunu kimler beğendi?</h4>';
	var templist = baslikhtm + '<ul id="gorev_user_bitirenler">';
	
	if(counter == 0)
	{
	  templist = '<h4>Bu içeriği henüz kimse beğenmemiş.</h4>';
	  $('#begenen-liste' + entity_id).append(templist);
	  return false;
	  }
	
	$.each(data.nodes, function(index, object){
	
	  var imagenode = object.node;
	  //var imagegallery_html = theme('image', userimagehtml);
	  var imagegallery_html = '<img id="profilthumb' + entity_id + '_'+ imagenode.uid +'" src="' + drupalgap_get_path('module', 'mobilwit_stuff') + '/kullanicidefault.png" />'; // placeholder
	  
	  //Kullanici resimlerini al
	  views_datasource_get_view_result('drupalgap/profilresmi/' + imagenode.uid,{ // gorevi tamamlayan kullanicilar listesi view call
	success:function(data) {
	//var items = [];
	var counter = data.view.count;
	if(counter == 0) { return }; // sistemi yormaya gerek yok
	$.each(data.nodes, function(index, object){

	  var tempresim = object.node.field_kullan_c_resmi2_1.src; // yuvarlak resim ayari
	  
	  if (counter > 0) counter--;
	  if (counter==0){
	$('#profilthumb' + entity_id + '_' + object.node.uid).attr("src", tempresim);
	  }
	});
	   }});

	  templist += '<li><a href=# onclick="javascript:drupalgap_goto(\'user/' + imagenode.uid + '\', {options:\'reloadPage:true\'})"><div class="gorev-bitiren-user">' +imagegallery_html + '</div></a></li>';
	  
	  if (counter > 0) counter--;
	  if (counter==0){
	templist += '</ul>'; // liste sonucu
	$('#begenen-liste' + entity_id).append(templist);
	  }
	});
	   }});
	
	  }
    }
  }
  catch (error) {
    console.log('flag_entity_post_render_content - ' + error);
  }
}


/*** NODE SUBMIT FIX***/

/**
 * Given a form, form_state and entity, this will call the appropriate service
 * resource to create or update the entity.
 * @param {Object} form
 * @param {Object} form_state
 * @param {Object} entity
 * @return {*}
 */
function drupalgap_entity_form_submit(form, form_state, entity) {
  try {

    // Grab the primary key name for this entity type.
    var primary_key = entity_primary_key(form.entity_type);

    // Determine if we are editing an entity or creating a new one.
    var editing = false;
    if (entity[primary_key] && entity[primary_key] != '') {
      editing = true;
    }

    // Let's set up the api call arguments.
    var call_arguments = {};

    // Setup the success call back to go back to the entity page view.
    call_arguments.success = function(result) {
      try {
        // If no one has provided a form.action to submit this form to,
        // by default we'll try to redirect to [entity-type]/[entity-id] to view
        // the entity. For taxonomy, we replace the underscore with a forward
        // slash in the path.
        var destination = form.action;
        if (!destination) {
          var prefix = form.entity_type;
          if (prefix == 'taxonomy_vocabulary' || prefix == 'taxonomy_term') {
            prefix = prefix.replace('_', '/');
          }
	  if (prefix == 'node') { // Fix ifi
            prefix = prefix.replace('node', 'renderednode');
          }
          destination = prefix + '/' + result[primary_key];
        }
        drupalgap_goto(destination, {'form_submission': true});
      }
      catch (error) {
        console.log('drupalgap_entity_form_submit - success - ' + error);
      }
    };

    // Setup the error call back.
    call_arguments.error = function(xhr, status, message) {
      try {
        // If there were any form errors, display them in an alert.
        var msg = _drupalgap_form_submit_response_errors(form, form_state, xhr,
          status, message);
        if (msg) { drupalgap_alert(msg); }
      }
      catch (error) {
        console.log('drupalgap_entity_form_submit - error - ' + error);
      }
    };

    // Change the jQM loader mode to saving.
    drupalgap.loader = 'saving';

    // Depending on if we are creating a new entity, or editing an existing one,
    // call the appropriate service resource.
    var crud = 'create';
    if (editing) {
      crud = 'update';
      // Remove the entity from local storage.
      // @todo This should be moved to jDrupal.
      window.localStorage.removeItem(
        entity_local_storage_key(form.entity_type, entity[primary_key])
      );
    }
    var fn = window[
      services_get_resource_function_for_entity(form.entity_type, crud)
    ];
    fn(entity, call_arguments);
  }
  catch (error) { console.log('drupalgap_entity_form_submit - ' + error); }
}


/** GENEL BILDIRIM CLICK FONKSIYONU - FLAG **/ /*** YoungnBold V2'de kaldirildi - geri konuldu ***/

function bildirimgenelgit(bildirimnid, bildirimflag, kullaniciuid, fieldyol){
	
	console.log("Bildirimgenelgit - başladı");
	
	if (bildirimflag == 0)
	  {
	flag_flag('okundu_genel', bildirimnid, 'flag', kullaniciuid, true, {
	entity_type: 'node',
	bundle: 'drupalgap_mobile_notifications',
	success: function(result) {
	  try {
	console.log('_flag_onclick Mobile Notification - flag - ' + bildirimnid);
	 appGenelBildirim();  // YoungnBold v2'de kaldirildi - geri konuldu
	appAktifLoop();
	  }
	  catch (error) { console.log('_flag_onclick Mobile Notification - error - ' + error); }
	}
	}); // flag_flag bitti
	  }	 
    
    if(fieldyol > 0)
    {
	console.log("Bildirimgenelgit - renderednode aşaması başlıyor");
	drupalgap_goto('renderednode/' + fieldyol, {options:'reloadPage:true'} );
    }
    else{
        // refresh 
        $('#bildirimlerim_listing_genel').empty();
        mobile_notifications_pageshow();
    }
}


/*** MOBILE NOTIFICATIONS TEMASI (Genel bildirimler) ***/ /***YoungnBold v2'de kaldirildi, sonra geri konuldu ***/

function mobile_notifications_callback() {
  var content = {};

  content['baslik_bildirimlerim'] = {
	markup: '<h4 class="bildirimh4">Genel bildirimler (<span id="anabildirimgenel3">'+ _badgesayacozel +'</span>)</h4>'
  };
  content['paylasilanlar'] = {
    theme: 'view',
	format: 'ul',
	format_attributes: {
    'data-inset': 'true'
	},
    items: [],
    attributes: {
      id: 'bildirimlerim_listing_genel'
    }
  };
  return content;
}


function mobile_notifications_pageshow() {
	
	var kullanici = Drupal.user;
	var roller = '';
	//dpm(Drupal.user);
	$.each(kullanici.roles, function(rid, value) {
	rid = rid - 2; // rol referanslari 1'den basliyor
	if (rid != 8) // roleswitcher ve izleyici pas gecilsin
	{
	if (roller == '') roller = rid;
	else roller += ',' + rid;
	}
	if (roller == '0' || roller == '7') roller = ''; // authenticated ve yonetici pas gecilsin
	if (roller == '11') roller = 'izleyici'; // izleyici icin update gerekiyor - YAPILACAK
    });
	
	if (roller == '') // sadece authenticated ise
	roller = 'all'; // hepsini gorsun
	
	$('#anabildirimgenel3').empty();
	$('#anabildirimgenel3').append(_badgesayacgenel);
	
	views_datasource_get_view_result('mobile-notifications/' + roller,{ // goreve eklenen icerikler
	success:function(data) {
	//var items = [];
	var counter = data.view.count;
	
	if (counter == 0)
	var templist = '<div class="eklenenler-bos-liste"><p>Şu an bir bildirim bulunmamaktadır...</p></div>';
	else {
	var templist = '<ul id="bildirimlerim_listesi">';
	$.each(data.nodes, function(index, object){
	
	  var stronghtml = '';
	  var stronghtmlend = '';
	  var classdummy = '';
	  
	  var imagenode = object.node;
	  
	  if (imagenode.flagged == 0) {
	stronghtml = '<strong>';
	stronghtmlend = '</strong>';
	classdummy = ' class = "yenibildirim" ';
	  }

	  //templist += '<li' + classdummy + '><a href=# onclick="javascript:drupalgap_goto(\'renderednode/' + imagenode.Ek + '\')">' + stronghtml + imagenode.title; // Bildirim mesaji -> Bildirim sayfasi
                                   
                                   if(imagenode.Ek > 0){
                                   }
                                   else{
                                   imagenode.Ek = 0;
                                   }
	  
	  templist += '<li' + classdummy + '><a href=# onclick="javascript:bildirimgenelgit('+ imagenode.nid +', '+ imagenode.flagged +', ' + kullanici.uid + ', '+ imagenode.Ek +')">' + stronghtml + imagenode.title; // Bildirim mesaji -> Bildirim sayfasi
	  
	  templist += stronghtmlend + '</a></li>';
	  
	  /*if (imagenode.flagged == 0)
	  {
	flag_flag('okundu_genel', imagenode.nid, 'flag', kullanici.uid, true, {
	entity_type: 'node',
	bundle: 'drupalgap_mobile_notifications',
	success: function(result) {
	  try {
	console.log('_flag_onclick Mobile Notification - flag - ' + imagenode.nid);
	  }
	  catch (error) { console.log('_flag_onclick Mobile Notification - error - ' + error); }
	}
	}); // flag_flag bitti
	  }*/
	
	
	  if (counter > 0) counter--;
	  if (counter==0){
	//dpm(gallerycontent);;
	templist += '</ul><br><br>'; // liste sonucu	
	  }}
	);
	}// else bitti

	$('#bildirimlerim_listing_genel').append(templist);
	
	//_badgesayacgenel = 0;
	
	   }});
	   
	/*_badgesayacgenel = 0; // Icoon
	
	$('#anabildirimgenel').empty();
	$('#anabildirimgenel').append(_badgesayacgenel);
	
	$('#anabildirimgenel2').empty();
	$('#anabildirimgenel2').append(_badgesayacgenel);*/

}

/*** FORM VALIDATE ALERT FIX ***/

/**
 * An internal function used by the DrupalGap forms api to validate all the
 * elements on a form.
 * @param {Object} form
 * @param {Object} form_state
 */
function _drupalgap_form_validate(form, form_state) {
  try {
    $.each(form.elements, function(name, element) {
        if (name == 'submit') { return; }
        if (element.required) {
          var valid = true;
          var value = null;
          if (element.is_field) {
          	console.log("--> --> Printing form_state... <-- <--");
          	dpm(form_state);
            value = form_state.values[name][language_default()][0];
          }
          else { value = form_state.values[name]; }
          // Check for empty values.
          if (empty(value)) { valid = false; }
          // Validate a required select list.
          else if (
            element.type == 'select' && element.required && value == ''
          ) { valid = false; }
          else if (element.type == 'checkboxes' && element.required) {
            var has_value = false;
            $.each(form_state.values[name], function(key, value) {
                if (value) { has_value = true; return false; }
            });
            if (!has_value) { valid = false; }
          }
          if (!valid) {
            var field_title = name;
            if (element.title) { field_title = element.title; }
            drupalgap_form_set_error(
              name,
              'Boş bırakılan ' + field_title + ' alanı zorunludur.'
            );
          }
        }
    });
  }
  catch (error) { console.log('_drupalgap_form_validate - ' + error); }
}


/*** USER EDIT FIX (user.js) ***/

/**
 * Implements hook_menu().
 * @return {Object}
 */
function user_menu() {
    var items = {
      'user': {
        'page_callback': 'user_page'
      },
      'user/login': {
        'title': 'Giriş Yap',
        'page_callback': 'drupalgap_get_form',
        'page_arguments': ['user_login_form'],
        options: {reloadPage: true}
      },
      'user/logout': {
        'title': 'Çıkış',
        'page_callback': 'user_logout_callback',
        'pagechange': 'user_logout_pagechange',
        options: {reloadPage: true}
      },
      'user/register': {
        'title': 'Kaydol',
        'page_callback': 'drupalgap_get_form',
        'page_arguments': ['user_register_form'],
        'access_callback': 'user_register_access',
        options: {reloadPage: true}
      },
      'user/%': {
        title: 'Hesabım',
        title_callback: 'user_view_title',
        title_arguments: [1],
        page_callback: 'user_view',
        pageshow: 'user_view_pageshow',
        page_arguments: [1]
      },
      'user/%/view': {
        'title': t('View'),
        'type': 'MENU_DEFAULT_LOCAL_TASK',
        'weight': -10
      },
      'user/%/edit': {
        'title': 'Düzenle',
        'page_callback': 'entity_page_edit',
        'pageshow': 'entity_page_edit_pageshow',
        'page_arguments': ['user_profile_form', 'user', 1],
        'access_callback': 'user_edit_access',
        'access_arguments': [1],
        'weight': 0,
        'type': 'MENU_LOCAL_TASK',
        options: {reloadPage: true}
      },
      'user-listing': {
        'title': 'Kullanıcılar',
        'page_callback': 'user_listing',
        'access_arguments': ['access user profiles'],
        'pageshow': 'user_listing_pageshow'
      }
    };
    items['user/password'] = {
      title: t('Yeni Şifre Talebi'),
      page_callback: 'drupalgap_get_form',
      page_arguments: ['user_pass_form']
    };
    return items;
}

/**
 * The user logout page callback.
 * @return {String}
 */
function user_logout_callback() {
  drupalgap_remove_pages_from_dom();
  return '<br><br><center><p>' + t('Çıkış Yapılıyor') + '...</p></center>';
}

function user_logout_pagechange() {
  try {
    user_logout({
      success: function(data) {
        drupalgap_goto(drupalgap.settings.front);
        drupalgap_remove_pages_from_dom();
	//navigator.app.exitApp();
      }
    });
  }
  catch (error) { console.log('user_logout_pagechange - ' + error); }
}



/**** PUSH NOTIFICATION ****/


function appwit() { // modulden buraya uyarladik

  // Initializes the plugin.
  push = PushNotification.init({
            "android": {
                "senderID": "xxx"
            },
            "ios": {
              "alert": "true", 
              "badge": "true", 
              "sound": "true"//,      //Burayı daha sonra gelistirelim
              //"categories" : {
              //  "icerikgoster" : {
              //    "yes": {
              //      "callback": "appwit.icerigegit"
              //    }
              //  }
              //}
            }, 
            "windows": {} 
        });

  // Set up the registration, notification and error handlers.
          push.on('registration', function(data) {
            console.log("PushNotf - Registration Event...");
            push_notifications_register_device_token(data.registrationId);
          });


        push.on('notification', function(data) {

            // data.message,
            // data.title,
            // data.count,
            // data.sound,
            // data.image,
            // data.additionalData


            // @TODO buraya app aktifken mesaj geldiginde bir say yapabiliriz
            console.log("PushNotf - Notifikasyon!");
            cordova.plugins.notification.badge.increase();
            push.finish(function() {
                console.log("PushNotf - Notifikasyon - Finish!");
            });

            // Display the push notification.
	  drupalgap_alert(data.message, {
	title: "Bir Bildirimin Var!",
	buttonName: 'OK'
	  });
            });



        push.on('error', function(e) { drupalgap_alert(e.message); });
}

/**
 * A swiperight handler function for the simple page.
 */
function mobilwit_swipeleft(options) {
  try {
    $('#' + options.page_id).on('swipeleft', function(event) {
        drupalgap_goto(options.destination, {transition:'slide'});
    });
	$('#' + options.page_id).on('swiperight', function(event) {
        drupalgap_goto(options.destinationleft, {transition:'flip'});
    });
  }
  catch (error) { console.log('mobilwit_swipeleft - ' + error); }
}