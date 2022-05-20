/*** Toastwit - App icinde toast ile tanitim ***/ // PLUGIN ILE OLMUYOR
function toastwit_install() {
  try {
    var css_file_path =
      drupalgap_get_path('module', 'toastwit') + '/toastwit.css';
    drupalgap_add_css(css_file_path);
    console.log('toastwit install - bitti.');
  }
  catch (error) { console.log('toastwit_install - ' + error); }
}

function toastwitmesaj_1(){
  // ilk mesaj
  //$('.toastwit-mesaj').stop().fadeIn(400).delay(3000).fadeOut(400); //fade out after 3 seconds
  $('#toast1').stop().fadeIn(400);
}

function toastwitmesaj_2(){

  /*if(_kullanici_rol == 1)
  {
    $('#toast1').stop().fadeOut(400);
    $('#toast2').stop().fadeIn(400);
  }
  else // ekip degistirmeyi sadece roleswitcherlar gorsun
  {*/
    $('#toast1').stop().fadeOut(400);
    $('#toast3').stop().fadeIn(400);
 /* }*/ // MMAPP - ekip degistirme olmayacak
  
}

function toastwitmesaj_3(){
  $('#toast2').stop().fadeOut(400);
  $('#toast3').stop().fadeIn(400);
}

function toastwitmesaj_4(){
  $('#toast3').stop().fadeOut(400);
  $('#toast4').stop().fadeIn(400);
}

function toastwitmesaj_5(){
  $('#toast4').stop().fadeOut(400);
  $('#toast5').stop().fadeIn(400);
}

function toastwitmesaj_6(){
  $('#toast5').stop().fadeOut(400);
  $('#toast6').stop().fadeIn(400);
}

function toastwitmesaj_7(){ // sonuncu tip kapansin
  $('#toast6').stop().fadeOut(400);
}


/**** PHONEGAP TOAST PLUGIN OLMADI, ICINE HTML KABUL ETMIYOR ****/

/*****

function toastwitmesaj_1(){
  //ilk girildiginde ya da yardim butonuna basildigindaki ilk toast mesajimiz

    window.plugins.toast.showWithOptions(// start of toast1
    {
    message: "<p class='toastwit'>Checkin'e hoşgeldin, <strong>"+ Drupal.user.name +"</strong>,<br>seni aramızda görmekten çok mutluyuz!</p>",
    duration: "long",
    position: "center",
    styling: {
      opacity: 0.95, // 0.0 (transparent) to 1.0 (opaque). Default 0.8
      backgroundColor: '#75aad6', // make sure you use #RRGGBB. Default #333333
      cornerRadius: 10, // minimum is 0 (square). iOS default 20, Android default 100
      horizontalPadding: 60, // iOS default 16, Android default 50
      verticalPadding: 40 // iOS default 12, Android default 30
    }
  },function(result){ // Toast 1 success
      //result.event tap edilme yoluyla touch olarak gelir. normal suresi bittiyse event tanimli olmuyor.

        //burada toast bittikten sonra olacaklar yer aliyor
        if (result && result.event) {
        console.log("The toast was tapped");
        console.log("Event: " + result.event); // will be defined, with a value of "touch" when it was tapped by the user
        console.log("Message: " + result.message); // will be equal to the message you passed in
        //console.log("data.foo: " + result.data.foo); // .. retrieve passed in data here
        } else {
          console.log("The toast 1 has been shown");
        }

    if (_kullanici_rol == 1) toastwitmesaj_2(); // admine ozel tanitim mesaji
    else toastwitmesaj_3();

    }// Toast 1 success end

  );// end of toast1

}


function toastwitmesaj_2(){
  //Toast 2 - admin ise

    window.plugins.toast.showWithOptions(// start of toast1
    {
    message: "<p class='toastwit'>Bu alanda ekibini değiştirebilirsin.</p>",
    duration: "long",
    position: "top",
    styling: {
      opacity: 0.95, // 0.0 (transparent) to 1.0 (opaque). Default 0.8
      backgroundColor: '#75aad6', // make sure you use #RRGGBB. Default #333333
      cornerRadius: 5, // minimum is 0 (square). iOS default 20, Android default 100
      horizontalPadding: 40, // iOS default 16, Android default 50
      verticalPadding: 30 // iOS default 12, Android default 30
    }
  },function(result){ // Toast 1 success
      //result.event tap edilme yoluyla touch olarak gelir. normal suresi bittiyse event tanimli olmuyor.

        //burada toast bittikten sonra olacaklar yer aliyor
        if (result && result.event) {
        console.log("The toast was tapped");
        console.log("Event: " + result.event); // will be defined, with a value of "touch" when it was tapped by the user
        console.log("Message: " + result.message); // will be equal to the message you passed in
        //console.log("data.foo: " + result.data.foo); // .. retrieve passed in data here
        } else {
          console.log("The toast 2 has been shown");
        }

        toastwitmesaj_3();

    }// Toast 1 success end

  );// end of toast1

}



function toastwitmesaj_3(){
  //Toast 3

    window.plugins.toast.showWithOptions(// start of toast1
    {
    message: "<p class='toastwit'>Bu alanda:</p><ul class='toastwit'><li>Check-In'lerini ziyaret edebilir,</li><li>Ekibindeki tüm yolculuklara göz atabilir,</li><li>Yolculuk ekibini ziyaret edebilir,</li><li>Bir mola verip zihnini tazeleyebilir,</li><li>Kendi profiline gidebilirsin.</li></ul>",
    duration: "long",
    position: "bottom",
    styling: {
      opacity: 0.95, // 0.0 (transparent) to 1.0 (opaque). Default 0.8
      backgroundColor: '#75aad6', // make sure you use #RRGGBB. Default #333333
      cornerRadius: 5, // minimum is 0 (square). iOS default 20, Android default 100
      horizontalPadding: 40, // iOS default 16, Android default 50
      verticalPadding: 30 // iOS default 12, Android default 30
    }
  },function(result){ // Toast 1 success
      //result.event tap edilme yoluyla touch olarak gelir. normal suresi bittiyse event tanimli olmuyor.

        //burada toast bittikten sonra olacaklar yer aliyor
        if (result && result.event) {
        console.log("The toast was tapped");
        console.log("Event: " + result.event); // will be defined, with a value of "touch" when it was tapped by the user
        console.log("Message: " + result.message); // will be equal to the message you passed in
        //console.log("data.foo: " + result.data.foo); // .. retrieve passed in data here
        toastwitmesaj_4();
        } else {
          console.log("The toast 3 has been shown");
        }

        

    }// Toast 1 success end

  );// end of toast1

}

function toastwitmesaj_4(){
  //Toast 3

    window.plugins.toast.showWithOptions(// start of toast1
    {
    message: "<p class='toastwit'>Bu açıklamaları tekrar görmek için buradaki 'Yardım' butonuna tıklayabilirsin.</p>",
    duration: "long",
    position: "top",
    styling: {
      opacity: 0.95, // 0.0 (transparent) to 1.0 (opaque). Default 0.8
      backgroundColor: '#75aad6', // make sure you use #RRGGBB. Default #333333
      cornerRadius: 5, // minimum is 0 (square). iOS default 20, Android default 100
      horizontalPadding: 40, // iOS default 16, Android default 50
      verticalPadding: 30 // iOS default 12, Android default 30
    }
  },function(result){ // Toast 1 success
      //result.event tap edilme yoluyla touch olarak gelir. normal suresi bittiyse event tanimli olmuyor.

        //burada toast bittikten sonra olacaklar yer aliyor
        if (result && result.event) {
        console.log("The toast was tapped");
        console.log("Event: " + result.event); // will be defined, with a value of "touch" when it was tapped by the user
        console.log("Message: " + result.message); // will be equal to the message you passed in
        //console.log("data.foo: " + result.data.foo); // .. retrieve passed in data here
        toastwitmesaj_5();
        } else {
          console.log("The toast 4 has been shown");
        }

        

    }// Toast 1 success end

  );// end of toast1

}

function toastwitmesaj_4(){
  //Toast 3

    window.plugins.toast.showWithOptions(// start of toast1
    {
    message: "<h3 class='toastwit'>Şimdi ilk Check-In'ini yapabilirsin!</h3>",
    duration: "long",
    position: "top",
    styling: {
      opacity: 0.95, // 0.0 (transparent) to 1.0 (opaque). Default 0.8
      backgroundColor: '#55aa42', // make sure you use #RRGGBB. Default #333333
      cornerRadius: 5, // minimum is 0 (square). iOS default 20, Android default 100
      horizontalPadding: 40, // iOS default 16, Android default 50
      verticalPadding: 30 // iOS default 12, Android default 30
    }
  },function(result){ // Toast 1 success
      //result.event tap edilme yoluyla touch olarak gelir. normal suresi bittiyse event tanimli olmuyor.

        //burada toast bittikten sonra olacaklar yer aliyor
        if (result && result.event) {
        console.log("The toast was tapped");
        console.log("Event: " + result.event); // will be defined, with a value of "touch" when it was tapped by the user
        console.log("Message: " + result.message); // will be equal to the message you passed in
        //console.log("data.foo: " + result.data.foo); // .. retrieve passed in data here
        } else {
          console.log("The toast 5 has been shown");
        }

        //toastwitmesaj_6();

    }// Toast 1 success end

  );// end of toast1

}



/**** ORNEK FONKSIYON *****

window.plugins.toast.showWithOptions(// start of toast1
    {
    message: "Checkin'e hoşgeldin, kullanıcı,<br>seni aramızda görmekten çok mutluyuz!",
    duration: "long",
    position: "center",
    styling: {
      opacity: 0.9, // 0.0 (transparent) to 1.0 (opaque). Default 0.8
      backgroundColor: '#75aad6', // make sure you use #RRGGBB. Default #333333
      cornerRadius: 5, // minimum is 0 (square). iOS default 20, Android default 100
      horizontalPadding: 40, // iOS default 16, Android default 50
      verticalPadding: 30 // iOS default 12, Android default 30
    }
  },function(result){ // Toast 1 success
      //result.event tap edilme yoluyla touch olarak gelir. normal suresi bittiyse event tanimli olmuyor.

        //burada toast bittikten sonra olacaklar yer aliyor

    }// Toast 1 success end

  );// end of toast1

  ****** ORNEK FONKSIYON ******/