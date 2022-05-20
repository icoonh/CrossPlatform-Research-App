/**
 * Implements DrupalGap's template_info() hook.
 */
function mobilwit_info() {
  try {
    var theme = {
      "name":"mobilwit",
      "regions":{
        "header":{
          "attributes":{
            "data-role":"header",
            'data-theme': 'a',
          }
        },
        "content":{
          "attributes":{
            "data-role":"content"
          }
        },
        "sub_navigation":{
          "attributes":{
            "data-role":"navbar"
          }
        },
        "navigation":{
          "attributes":{
            "data-role":"navbar"
          }
		 },
        "footer":{
          "attributes":{
            "data-role":"footer",
            'data-theme': 'a',
            'data-position': 'fixed'
          }
        }
      }
    };
    return theme;
  }
  catch (error) { drupalgap_error(error); }
}

