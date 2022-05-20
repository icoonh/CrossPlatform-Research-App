/**************|
 * Development |
 **************/

// Uncomment to clear the app's local storage cache each time the app loads.
//window.localStorage.clear();

// Set to true to see console.log() messages. Set to false when publishing app.
Drupal.settings.debug = true;

/****************************************|
 * Drupal Settings (provided by jDrupal) |
 ****************************************/

/* DRUPAL PATHS */
 
// Site Path (do not use a trailing slash)
Drupal.settings.site_path = 'https://origami.communiwit.com'; // e.g. http://www.example.com

// Default Services Endpoint Path
Drupal.settings.endpoint = 'drupalgap';

// Files Directory Paths (use one or the other)
Drupal.settings.file_public_path = 'sites/default/files';
//Drupal.settings.file_private_path = 'system/files';

// The Default Language Code
Drupal.settings.language_default = 'und';

/* CACHING AND PERFORMANCE */

// Entity Caching
Drupal.settings.cache.entity = {

  /* Globals (will be used if not overwritten below) */
  enabled: false,
  expiration: 60, // # of seconds to cache, set to 0 to cache forever

  /* Entity types */
  entity_types: {

    /* Comments */
    /*comment: {
     bundles: {}
     },*/

    /* Files */
    /*file: {
     bundles: {}
     },*/

    // Nodes
    /*node: {

      // Node Globals (will be used if not overwritten below)
      enabled: true,
      expiration: 120,

      // Content types (aka bundles)
      bundles: {

        article: {
          expiration: 3600
        },
        page: {
          enabled: false
        }

      }
    },*/

    /* Terms */
    /*taxonomy_term: {
     bundles: {}
     },*/

    /* Vocabularies */
    /*taxonomy_vocabulary: {
     bundles: {}
     },*/

    /* Users */
    /*user: {
     bundles: {}
     }*/

  }

};

/* Views Caching */

Drupal.settings.cache.views = {
  enabled: false,
  expiration: 3600
};

/*********************|
 * DrupalGap Settings |
 *********************/

// DrupalGap Mode (defaults to 'web-app')
//  'web-app' - use this mode to build a web application for a browser window
//  'phonegap' - use this mode to build a mobile application with phonegap
drupalgap.settings.mode = 'phonegap';

// Language Files - locale/[language-code].json
drupalgap.settings.locale = {
   /* es: { } */
};

/*************|
 * Appearance |
 *************/

// App Title
drupalgap.settings.title = '<img src="' + drupalgap_get_path('module', 'mobilwit_stuff') + '/scubalogo.png" />';
 
// App Front Page
drupalgap.settings.front = 'introduction';

// Theme
drupalgap.settings.theme = 'mobilwit';

// Logo
drupalgap.settings.logo = 'themes/easystreet3/images/drupalgap.jpg';

// Offline Warning Message. Set to false to hide message.
drupalgap.settings.offline_message = 'Bağlantı bulunamadı! Bir ağa bağlı olduğunuzdan emin olun.';

// Exit app message.
drupalgap.settings.exit_message = 'Origami\'den çıkmayı istiyor musunuz?';

// Loader Animations - http://demos.jquerymobile.com/1.4.0/loader/
drupalgap.settings.loader = {
  enabled: true,
  loading: {
    text: 'Yükleniyor... (Loading)',
    textVisible: true,
    theme: 'b'
  },
  saving: {
    text: 'Kaydediliyor... (Saving)',
    textVisible: true,
    theme: 'b'
  },
  deleting: {
    text: 'Siliniyor... (Deleting)',
    textVisible: true,
    theme: 'b'
  },
  processing: {
    text: 'Dosya işleniyor... (Processing)',
    textVisible: true,
    theme: 'b'
  }
};

/*****************************************|
 * Modules - http://drupalgap.org/node/74 |
 *****************************************/

/** Contributed Modules - www/app/modules **/

//Drupal.modules.contrib['example'] = {};
Drupal.modules.contrib['force_authentication'] = {};
Drupal.modules.contrib['flag'] = {};
Drupal.modules.contrib['entityreference'] = {};
Drupal.modules.contrib['media'] = {};

/** Custom Modules - www/app/modules/custom **/

//Drupal.modules.custom['my_module'] = {};
Drupal.modules.custom['mobilwit_stuff'] = {};
Drupal.modules.custom['toastwit'] = {}; // giriste gosterilecek toast bildirimler
Drupal.modules.custom['offlinewit'] = {}; // offline davranis bicimi
Drupal.modules.custom['mobile_notifications'] = {};
Drupal.modules.custom['push_notf_wit'] = {};
//Drupal.modules.custom['video'] = {};

/***************************************|
 * Menus - http://drupalgap.org/node/85 |
 ***************************************/
drupalgap.settings.menus = {}; // Do not remove this line.

// User Menu Anonymous
drupalgap.settings.menus['user_menu_anonymous'] = {
  options: menu_popup_get_default_options(),
  links: [
    {
      title: 'Login',
      path: 'user/login',
      options: {
        attributes: {
          'data-theme': 'b'
        }
      }
    }/*,
    {
      title: 'Create new account',
      path: 'user/register',
      options: {
        attributes: {
          'data-icon': 'plus'
        }
      }
    }*/
  ]
};

// User Menu Authenticated
drupalgap.settings.menus['user_menu_authenticated'] = {
  options: menu_popup_get_default_options(),
  links: [/*
    {
      title: 'My Account',
      path: 'user',
      options: {
        attributes: {
          'data-icon': 'user',
          'class': 'ui-btn ui-btn-icon-right'
        }
      }
    },
    {
      title: 'Logout',
      path: 'user/logout',
      options: {
        attributes: {
          'data-icon': 'delete'
        }
      }
    }*/
  ]
};

// Main Menu
/*drupalgap.settings.menus['main_menu'] = {
  options: menu_popup_get_default_options(),
  links: [
    {
      title:'Content',
      path:'node',
      options:{
        attributes: {
          'data-icon': 'star',
          'class': 'ui-btn ui-btn-icon-right'
        }
      }
    },
    {
      title:'Taxonomy',
      path:'taxonomy/vocabularies',
      options:{
        attributes:{
          'data-icon':'grid'
        }
      }
    },
    {
      title:'Users',
      path:'user-listing',
      options:{
        attributes:{
          'data-icon':'info'
        }
      }
    }
  ]
};*/

/****************************************|
 * Blocks - http://drupalgap.org/node/83 |
 ****************************************/
drupalgap.settings.blocks = {}; // Do not remove this line.

// Easy Street 3 Theme Blocks
drupalgap.settings.blocks.mobilwit= {
  header:{
    title:{}
  },
  content:{
    messages: {},
    main:{}
  },
  /*footer:{
    //powered_by:{}
  //mobilwit_footer:{}
  },*/
  sub_navigation:{
    main_menu:{
      roles:{
        value:['authenticated user'],
        mode:'include',
      }
    }
  /*main_menu_auth:{
      roles:{
        value:['authenticated user'],
        mode:'include',
      }
    }*/
    //primary_local_tasks:{},
  },
  navigation:{
    user_menu_anonymous:{
      roles:{
        value:['anonymous user'],
        mode:'include',
      }
    },
    user_menu_authenticated:{
      roles:{
        value:['authenticated user'],
        mode:'include',
      }
    }
  },
  footer:{ }
  
};

/****************************************************|
 * Region Menu Links - http://drupalgap.org/node/173 |
 ****************************************************/
drupalgap.settings.menus.regions = {}; // Do not remove this line.

// Header Region Links
drupalgap.settings.menus.regions['header'] = {
  links:[
    /* Home Button */
	{
      title:'',
      path:'',
      options:{
        reloadPage:true,
        attributes:{
          "data-icon":"home",
          "class":"ui-btn-right",
		  'data-iconpos': 'notext'
        }
      },
      pages:{
        value:[''],
        mode:"exclude"
      }
    },
    /*{ // yerine ustteki home butonu konuldu
      title:'',
      path:'user',
      options:{
        attributes:{
          "data-icon":"user",
          "class":"ui-btn-right",
		  'data-iconpos': 'notext'
        }
      },
      pages:{
        value:[''],
        mode:"exclude"
      }
    },*/
    /* Back Button */ /* eski haline getirdik */
    {
      title:'',
	  //path:'',
      options:{
        attributes:{
          "data-icon":"back",
          "class":"ui-btn-left",
		  'data-iconpos': 'notext',
          "onclick":"javascript:drupalgap_back();"
        }
      },
      pages:{
        value:[''],
        mode:"exclude"
      }
    }//,
    /* Back Button */ /* node page fix anasayfaya donus */
    /*{
      title:'',
	  path:'introduction',
      options:{
        attributes:{
          "data-icon":"back",
          "class":"ui-btn-left",
		  'data-iconpos': 'notext',
        }
      },
      pages:{
        value:['node/*'],
        mode:"include"
      }
    }*/
	
	/* **Kapatma dugmesi** */
	/*{
      title:'Exit',
      options:{
        attributes:{
          "data-icon":"delete",
          "class":"ui-btn-right",
          "onclick":"javascript:showConfirm();"
        }
      },
      pages:{
        value:[''], //Giris sayfasinda gorunecek, IOS icin cikarilacak!!!
        mode:"include"
      }
    }*/
  ]
};

// Footer Region Links
/*drupalgap.settings.menus.regions['footer'] = {
  links: [
    // Back Button 
    {
      options: {
        attributes: {
          'data-icon': 'back',
          'data-iconpos': 'notext',
          'class': 'ui-btn-right',
          'onclick': 'javascript:drupalgap_back();'
        }
      },
      pages: {
        value: [''],
        mode: 'exclude'
      }
    }
  ]
};*/

/*********|
 * Camera |
 **********/
drupalgap.settings.camera = {
  quality: 100
};

/***********************|
 * Performance Settings |
 ***********************/
drupalgap.settings.cache = {}; // Do not remove this line.

// Theme Registry - Set to true to load the page.tpl.html contents from cache.
drupalgap.settings.cache.theme_registry = true;

