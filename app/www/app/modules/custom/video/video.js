/**
 * Implements hook_field_formatter_view().
 */
function video_field_formatter_view(entity_type, entity, field, instance, langcode, items, display) {
  try {
    var element = {};
    $.each(items, function(delta, item) {
        element[delta] = {
          markup: theme('video', item)
        };
    });
    return element;
  }
  catch (error) { console.log('video_field_formatter_view - ' + error); }
}

/**
 * Themes an video field.
 */
function theme_video(variables) {
  try {
    var html = '';
	kapakresmi = { // Kapak resmi image path -- Kapak resmi varsa üzerine islenecek
	    path:drupalgap_get_path('module', 'video') + '/poster.jpg'
	};
	
    var src = Drupal.settings.site_path + Drupal.settings.base_path + variables.uri;
    if (src.indexOf('public://') != -1) {
      src = src.replace('public://', Drupal.settings.file_public_path + '/');
    }	
	
	var uzanti = src.substr(src.length - 3);
	if (uzanti == "mov" && device.platform == "Android")
	{
		html += '<center><h4>Bu video Android telefonlar için işlenmektedir... Lütfen daha sonra tekrar deneyiniz.</h4></center>';
	}
	else
	{
		html +=  '<center><video width="90%" preload="auto" poster="' + kapakresmi + '" src="' + src + '" controls="controls">Sisteminiz video oynatmaya elverişli değil.</video></center>';
	}

    return html;
  }
  catch (error) { console.log('theme_video - ' + error); }
}



// Holds onto the phonegap getPicture success image data. It is keyed by field
// name, then delta value.
var video_phonegap_camera_options = {};
var duration = 0; // transcode icin


/**
 * Implements hook_field_widget_form().
 * @param {Object} form
 * @param {Object} form_state
 * @param {Object} field
 * @param {Object} instance
 * @param {String} langcode
 * @param {Object} items
 * @param {Number} delta
 * @param {Object} element
 */
function video_field_widget_form(form, form_state, field, instance, langcode,
  items, delta, element) {
  try {
    // Change the item type to a hidden input to hold the file id.
    items[delta].type = 'hidden';

    // Set the default button text, and if a value was provided,
    // overwrite the button text.
    var browse_button_text = 'Video Ekle';
    if (items[delta].value2) { browse_button_text = items[delta].value2; }

    // Place variables into document for PhoneGap image processing.
    var item_id_base = items[delta].id.replace(/-/g, '_');
					console.log('item_id_base - ' + item_id_base);
    var video_field_source = item_id_base + '_videofield_source';
					console.log('video_field_source - ' + video_field_source);
    var videofield_destination_type =
      item_id_base + '_videofield_destination_type';
					console.log('videofield_destination_type - ' + videofield_destination_type);
    var videofield_data = item_id_base + '_videofield_data';
					console.log('videofield_data - ' + videofield_data);
    eval('var ' + video_field_source + ' = null;');
    eval('var ' + videofield_destination_type + ' = null;');
    eval('var ' + videofield_data + ' = null;');
					console.log('videofield_data after eval - ' + videofield_data);
    // Build a videofield widget with PhoneGap. Contains a message
    // div, an image item, a button to add an image, and a button to browse for
    // images.
    var browse_button_id = items[delta].id + '-browse-button';
					console.log('browse_button_id - ' + browse_button_id);
    var html = '<div>' +
      //'<div id="' + items[delta].id + '-videofield-msg"></div>' +
	  '<div id="percentage-videofield-msg2"></div><div class="meter orange"><span id="ft-prog2" style="width: 1%"></span></div>' +
	  '<div id="percentage-videofield-msg"></div><div class="meter orange"><span id="ft-prog" style="width: 1%"></span></div><div id="videobildirim' + items[delta].id + '"></div>' +
      //'<video controls id="' + items[delta].id + '-videofield" style="display: none;" />' +
      /*'<a href="#" data-role="button" data-icon="camera" ' +
        'id="' + items[delta].id + '-button">' +
        button_text +
      '</a>' +*/
      '<a href="#" data-role="button" data-icon="grid" ' +
        'id="' + browse_button_id + '">' +
        browse_button_text +
      '</a>' +
    '</div>';
    // Open extra javascript declaration.
    html += '<script type="text/javascript">';
    // Add device ready listener for PhoneGap camera.
    var event_listener = item_id_base + '_videofield_ready';
    html += '$("#' + drupalgap_get_page_id(
      drupalgap_path_get()) + '").on("pageshow",function(){' +
        'document.addEventListener(' +
        '"deviceready", ' +
        event_listener + ', ' +
        'false);' +
      '});' +
    'function ' + event_listener + '() {' +
      video_field_source + ' = navigator.camera.PictureSourceType;' +
      videofield_destination_type + ' = navigator.camera.DestinationType;' +
    '}';
    // Define error callback function.
    var videofield_error = item_id_base + '_error';
    html += 'function ' + videofield_error + '(message) {' +
      'if (message != "Camera cancelled." && ' +
        'message != "Selection cancelled." && ' +
        'message != "no image selected")' +
      '{' +
        'console.log("' + videofield_error + '");' +
        'drupalgap_alert(message);' +
      '}' +
    '}';
    // Define success callback function.
    var videofield_success = item_id_base + '_success';
    html += 'function ' + videofield_success + '(videoData) {' +
      '_video_phonegap_camera_getPicture_success(' +
      '{field_name:"' + field.field_name + '", ' +
        'video:videoData, id:"' + items[delta].id + '"' +
       '})' +
    '}';
	console.log('items[delta].id - ' + items[delta].id);
    // Determine image quality.
    /*var quality = 50;
    if (drupalgap.settings.camera.quality) {
      quality = drupalgap.settings.camera.quality;
    }*/

    // Add click handler for browse button.
    html += '$("#' + browse_button_id + '").on("click",function(){' +
      'var browse_photo_options = {' +
        //'quality: ' + quality + ',' +
		'mediaType: 1,' + // VIDEO
        'sourceType: ' + video_field_source + '.PHOTOLIBRARY,' +
        'destinationType: ' + videofield_destination_type + '.FILE_URI' +
        //'correctOrientation: true' +
      '};' +
      'navigator.camera.getPicture(' +
        videofield_success + ', ' +
        videofield_error + ', ' +
        'browse_photo_options);' +
    '});';
    // Close extra javascript declaration.
    html += '</script>';
    // Add html to the item's children.
    items[delta].children.push({markup: html});
	
	$('#edit-node-edit-submit').prop("disabled",true); // video eklemeden submit edemesin
  }
  catch (error) { console.log('video_field_widget_form - ' + error); }
}

/**
 * The success callback function used when handling PhoneGap's camera
 * getPicture() call.
 * @param {Object} options
 */
function _video_phonegap_camera_getPicture_success(options) {
  try {

    // Hold on to the image options in the global var.
	
	/*drupalgap.loader = 'saving';
	var videodata = options.video;
	
		console.log("--- before the file entry options.video: " + options.video);
		window.resolveLocalFileSystemURL(options.video, function(fileEntry) {  // Getting video data
		console.log("got image file entry: " + fileEntry.fullPath);
		console.log("got image file entry - full data: " + fileEntry);
		videodata = fileEntry;
		} , function (error) { 
		console.log("failed with error code: " + error.code); 
		} );
		console.log("--- the file entry options.video: " + options.video);
		console.log("--- the file videodata entry fileEntry: " + videodata);
		//options.video = videodata.getFile(); // BURADA BASE 64 ALMALIYIZ*/
		
		console.log("video_phonegap_camera_options[options.field_name] field_name = " + options.field_name);
		console.log("video_phonegap_camera_options[options.field_name] video = " + options.video);
		console.log("video_phonegap_camera_options[options.field_name] id = " + options.id);


	
    video_phonegap_camera_options[options.field_name] = {0: options};
	
	$('#videobildirim' + options.id).empty();
	$('#videobildirim' + options.id).append('<center><h4>Seçtiğiniz videoyu şimdi "Kaydet"e basarak göndermeye başlayabilirsiniz.</h4></center>');
	$('#edit-node-edit-submit').prop("disabled",false); // simdi submit edilebilsin

    // Hide the 'Add image' button and show the 'Upload' button.
    //$('#' + options.id + '-button').hide();
    //$('#' + options.id + '_upload').show();

    // Show the captured photo as a thumbnail. When the photo is loaded, resize
    // it to fit the content area, then show it.
   /*var video_element_id = options.id + '-videofield';
			console.log('video_element_id - ' + video_element_id);
  var video = document.getElementById(video_element_id);
  //var video = options.video;
			console.log('video 6 - ' + video);
    video.src = 'data:video/mp4;base64,' +                            ////// IOS ICIN DEGISECEK
      video_phonegap_camera_options[options.field_name][0].video;
	  console.log('video.src - ' + video.src);
    video.onload = function() {
      //var width = this.width;
      //var height = this.height;
      //var ratio = width / drupalgap_max_width();
      //var new_width = width / ratio;
      //var new_height = height / ratio;
      //image.width = new_width;
      //image.height = new_height;
      $('#' + video_element_id).show();
	  $('#' + video_element_id).append('Video Secildi.');
    };*/
  }
  catch (error) {
    console.log('_video_phonegap_camera_getPicture_success - ' + error);
  }
}

/**
 * On an entity edit form, this removes an image file from the server, then from
 * the form elements and user interface.
 */
function _video_field_widget_form_remove_image() {
  try {
    alert('_video_field_widget_form_remove_image');
  }
  catch (error) {
    console.log('_video_field_widget_form_remove_image - ' + error);
  }
}

/**
 * Given an entity type and optional bundle name, this will return an array
 * containing any image field names present, false otherwise.
 * @param {String} entity_type
 * @param {String} bundle
 * @return {Object}
 */
function video_fields_present_on_entity_type(entity_type, bundle) {
  try {
    var results = [];
    var fields = drupalgap_field_info_instances(entity_type, bundle);
    if (!fields) { return false; }
    $.each(fields, function(name, field) {
	console.log('results push - field.widget.type = ' + field.widget.type + ' name = ' + name);
        if (field.widget &&
          field.widget.type &&
          field.widget.type == 'video_upload'
        ) {
          results.push(name);
        }
    });
	
	console.log('video_fields_present_on_entity_type - Results.length = ' + results.length );
	
    if (results.length == 0) { 
		return false; 
	}
    return results;
  }
  catch (error) {
    console.log('video_fields_present_on_entity_type - ' + error);
  }
}

/**
 * Implements hook_form_alter().
 * @param {Object} form
 * @param {Object} form_state
 * @param {String} form_id
 */
function video_form_alter(form, form_state, form_id) {
  try {
    // Make potential alterations to any entity edit form that has an image
    // field element(s).
    if (form.entity_type) {
      var bundle = form.bundle;
      var video_fields =
        video_fields_present_on_entity_type(form.entity_type, bundle);
      if (video_fields) {
        // Attach the image field names to the form for later reference.
        form.video_fields = video_fields;
        // For each image field, create a place for it in the global var.
        if ($.isArray(video_fields)) {
          $.each(video_fields, function(index, name) {
              video_phonegap_camera_options[name] = {0: null};
          });
        }
      }
    }
  }
  catch (error) { console.log('video_form_alter - ' + error); }
}

/**
 * Given an image style name and image uri, this will return the absolute URL
 * that can be used as a src value for an img element.
 * @param {String} style_name
 * @param {String} path
 * @return {String}
 */
function video_style_url(style_name, path) {
  try {
    var src =
      Drupal.settings.site_path + Drupal.settings.base_path + path;
    if (src.indexOf('public://') != -1) {
      src = src.replace(
        'public://',
        Drupal.settings.file_public_path +
          '/styles/' +
          style_name +
          '/public/'
      );
    }
    else if (src.indexOf('private://') != -1) {
      src = src.replace(
        'private://',
        Drupal.settings.file_private_path +
          '/styles/' +
          style_name +
          '/private/'
      );
    }
    return src;
  }
  catch (error) { console.log('video_style_url - ' + error); }
}

/**
 * An internal function used to upload images to the server, retreive their file
 * id and then populate the corresponding form element's value with the file id.
 * @param {Object} form
 * @param {Object} form_state
 * @param {Object} options
 */
function _video_field_form_process(form, form_state, options) {
  try {
    // @todo - this needs mutli value field support (delta)
    var lng = language_default();
    var processed_a_video = false;
	$('#edit-node-edit-submit').prop("disabled",true);
	$('#edit-node-edit-cancel').prop("disabled",true);
	$('#edit-node-edit-field-video-und-0-value-browse-button').prop("disabled",true);
	$('#edit-node-edit-field-video-und-0-value-browse-button').val("Video yukleniyor...");
	var statusDom1 = document.querySelector('#percentage-videofield-msg');
	statusDom1.innerHTML = "Video dönüştürülüyor...";
	
	console.log('_video_field_form_process - EACH BASLIYOR');
    $.each(form.video_fields, function(index, name) {
      // Skip empty images.
      if (!video_phonegap_camera_options[name][0]) { return false; }
      // Skip image fields that already have their file id set.
      if (form_state.values[name][lng][0] != '') { return false; }
      // Create a unique file name using the UTC integer value.
	  
	  console.log('_video_field_form_process - form_state.values[name][lng][0] - ' + form_state.values[name][lng][0]);
	  console.log('_video_field_form_process - video_phonegap_camera_options[name][0] - ' + video_phonegap_camera_options[name][0]);
	  
      var d = new Date();
      var video_file_name = Drupal.user.uid + '_' + d.valueOf() + '.mp4';       //// IOS ICIN DEGISECEK .mov
	  var mimetype = "video/mp4";
	  
	  // Depending on the device, a few examples are:
		//   - "Android"
		//   - "BlackBerry"
		//   - "iOS"
		//   - "webOS"
		//   - "WinCE"
		//   - "Tizen"
	  
	  //if(device.platform == "iOS") {
	  //video_file_name = Drupal.user.uid + '_' + d.valueOf() + '.mov';
	  //mimetype = "video/mov";
	  //}
	  
	  
	  VideoEditor.transcodeVideo( // video kucultme ve mp4 yapma
          function(resultvid){console.log('Transcode Success - ' + resultvid);
		  
			console.log('video_phonegap_camera_options[name][0].video - ' + video_phonegap_camera_options[name][0].video);
		
				var file = {
						file: {
						  //file: video_phonegap_camera_options[name][0].video, // simdilik dummy yukleyecegiz
						  file: video_phonegap_camera_options[name][0].video,
						  filename: video_file_name,
						  filepath: 'public://kullanicivideo/' + video_file_name
						}
					  };
					  
				
						if (!empty(Drupal.settings.file_private_path)) {
						file.file.filepath = 'private://' + video_file_name;
					  }
					  // Change the loader mode to saving, and save the file.
					  drupalgap.loader = 'saving';
					  //processed_a_video = true;
					  
					   // Build the data for the file create resource. If it's private, adjust
      // the filepath.
	  
			  
			  
			  
			  
			  
			  
			  file_save(file, {
				  async: false,
				  success: function(result) {
					try {
					  
					  // Asil upload burada olacak - Filetransfer
								drupalgap.loader = 'saving';
								
								setTimeout(function(){
								var ft = new FileTransfer();
								
								var options2 = new FileUploadOptions();
									options2.fileKey="file";
									options2.params={};
									options2.fileName=video_file_name;
									options2.mimeType= mimetype;
									options2.params.fileName=options2.fileName;
									options2.chunkedMode=true;
									
									console.log('try upload filename - ' + options2.fileName);
									
								var statusDom = document.querySelector('#percentage-videofield-msg');
								
								ft.onprogress = function(progressEvent) {
									if (progressEvent.lengthComputable) {
										var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
										statusDom.innerHTML = perc + "% yuklendi...";
										document.getElementById("ft-prog").style.width = perc + '%';
										//console.log('perc -' + document.getElementById("ft-prog").value);
									} else {
										if(statusDom.innerHTML == "") {
											statusDom.innerHTML = "Yukleniyor";
										} else {
											statusDom.innerHTML += ".";
										}
									}
								}; // ft.onprogress
									
								//ft.upload(video_phonegap_camera_options[name][0].video, encodeURI("http://xxx.com/upload/upload.php"),
								ft.upload(String(resultvid), encodeURI("http://xxx/upload/upload.php"), // upload transcode result
									function(result2){
											console.log('upload success - ' + result2);
											//processed_a_video = true;
											var element_id = drupalgap_form_get_element_id(name, form.id);
											$('#' + element_id).val(result.fid);
											form_state.values[name][lng][0] = result.fid;
											statusDom.innerHTML = "";
											if (options.success) { options.success(); }
										},
									function(error){console.log('upload failure - ' + error); alert("Video yüklerken bir sorun oluştu.");}, options2);
									}, 100); // settimeout bitis
								
						  
						  //if (options.success) { options.success(); }
					  
					}
					catch (error) {
					  console.log('_video_field_form_process - success - ' + error);
					}
				  }
			  });
		  
		  },
          function(result){console.log('Transcode Failure - ' + result);},
				{
					fileUri: video_phonegap_camera_options[name][0].video, // the path to the video on the device
					outputFileName: video_file_name, // the file name for the transcoded video
					outputFileType: VideoEditorOptions.OutputFileType.MPEG4,
					optimizeForNetworkUse: VideoEditorOptions.OptimizeForNetworkUse.YES,
					saveToLibrary: true, // optional, defaults to true
					deleteInputFile: false, // optional (android only), defaults to false
					maintainAspectRatio: true, // optional, defaults to true
					width: 640, // optional, see note below on width and height
					height: 640, // optional, see notes below on width and height
					videoBitrate: 1000000, // optional, bitrate in bits, defaults to 1 megabit (1000000)
					audioChannels: 2, // optional, number of audio channels, defaults to 2
					audioSampleRate: 44100, // optional, sample rate for the audio, defaults to 44100
					audioBitrate: 128000, // optional, audio bitrate for the video in bits, defaults to 128 kilobits (128000)
					progress: function(info) {
						console.log('transcodeVideo progress callback, info: ' + info);
						
						// info on android will be shell output from android-ffmpeg-java
						// info on ios will be a number from 0 to 100
						
						var statusDom = document.querySelector('#percentage-videofield-msg2');
								
								if(device.platform == "iOS") { 
									
									statusDom.innerHTML = info + "% hazırlandı...";
									document.getElementById("ft-prog2").style.width = info + '%';
									
									return; // the code below is for android
								}

								// for android this arithmetic below can be used to track the progress
								// of ffmpeg by using info provided by the android-ffmpeg-java shell output
								// this is a modified version of http://stackoverflow.com/a/17314632/1673842

								// get duration of source
								
								
								
								if (!duration) {
									var matches = (info) ? info.match(/Duration: (.*?), start:/) : [];
									if (matches && matches.length > 0) {
										var rawDuration = matches[1];
										// convert rawDuration from 00:00:00.00 to seconds.
										var ar = rawDuration.split(":").reverse();
										duration = parseFloat(ar[0]);
										if (ar[1]) duration += parseInt(ar[1]) * 60;
										if (ar[2]) duration += parseInt(ar[2]) * 60 * 60;  
									}
									return;
								}

								// get the time
								var matches = info.match(/time=(.*?) bitrate/g);

								if (matches && matches.length > 0) {
									var time = 0;
									var progress = 0;
									var rawTime = matches.pop();
									rawTime = rawTime.replace('time=', '').replace(' bitrate', '');

									// convert rawTime from 00:00:00.00 to seconds.
									var ar = rawTime.split(":").reverse();
									time = parseFloat(ar[0]);
									if (ar[1]) time += parseInt(ar[1]) * 60;
									if (ar[2]) time += parseInt(ar[2]) * 60 * 60;

									//calculate the progress
									progress = Math.round((time / duration) * 100);

									var progressObj = {
										duration: duration,
										current: time,
										progress: progress
									};

									console.log('progressObj: ' + JSON.stringify(progressObj, null, 2));

									/* update your progress indicator here with above values ... */
									
									statusDom.innerHTML = progress + "% dönüştürüldü...";
									document.getElementById("ft-prog2").style.width = progress + '%';
								}
					}
				}
			);
			
			
	  
	  
     
			  
			  
			      // If no images were processed, we need to continue onward anyway.
				//if (!processed_a_video && options.success) { options.success(); }
				//if (!processed_a_video && options.success) { options.success(); }
		
		
		} );

  }
  catch (error) { console.log('_video_field_form_validate - ' + error); }
}

function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return 'n/a';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

/**
 * Implements hook_assemble_form_state_into_field().
 * @param {Object} entity_type
 * @param {String} bundle
 * @param {String} form_state_value
 * @param {Object} field
 * @param {Object} instance
 * @param {String} langcode
 * @param {Number} delta
 * @param {Object} field_key
 * @return {*}
 */
function video_assemble_form_state_into_field(entity_type, bundle,
  form_state_value, field, instance, langcode, delta, field_key) {
  try {
    field_key.value = 'fid';
    return form_state_value;
  }
  catch (error) {
    console.log('video_assemble_form_state_into_field - ' + error);
  }
}

/***
****   ***  FORM.INC.JS override - icoon
***/


function _drupalgap_form_submit(form_id) {
  try {
    // Load the form from local storage.
    var form = drupalgap_form_local_storage_load(form_id);
    if (!form) {
      var msg = '_drupalgap_form_submit - failed to load form: ' + form_id;
      drupalgap_alert(msg);
      return false;
    }

    // Assemble the form state values.
    var form_state = drupalgap_form_state_values_assemble(form);

    // Clear out previous form errors.
    drupalgap.form_errors = {};

    // Build the form validation wrapper function.
    var form_validation = function() {
      try {

        // Call the form's validate function(s), if any.
        $.each(form.validate, function(index, function_name) {
            var fn = window[function_name];
            fn.apply(null, Array.prototype.slice.call([form, form_state]));
        });

        // Call drupalgap form's api validate.
        _drupalgap_form_validate(form, form_state);

        // If there were validation errors, show the form errors and stop the
        // form submission. Otherwise submit the form.
        if (!jQuery.isEmptyObject(drupalgap.form_errors)) {
          var html = '';
          $.each(drupalgap.form_errors, function(name, message) {
			  if(message == 'Boş bırakılan comment_body alanı zorunludur.')
					message = 'Neden boş bir yorum gönderesiniz ki?';
			  html += message + '\n\n';
          });
          //drupalgap_alert("TEST test TEST");
		    navigator.notification.alert("Şöyle bir şey var:\n\n" + html, null, "Bi dakka!", "Anladım, teşekkürler");
        }
        else { form_submission(); }
      }
      catch (error) {
        console.log('_drupalgap_form_submit - form_validation - ' + error);
      }
    };

    // Build the form submission wrapper function.
    var form_submission = function() {
      try {
        // Call the form's submit function(s), if any.
        $.each(form.submit, function(index, function_name) {
            var fn = window[function_name];
            fn.apply(null, Array.prototype.slice.call([form, form_state]));
        });
        // Remove the form from local storage.
        // @todo - we can't do this here because often times a form's submit
        // handler makes asynchronous calls (i.e. user login) and although the
        // form validated, server side may say the input was invalid, so the
        // user will still be on the form, except we already removed the form.
        //drupalgap_form_local_storage_delete(form_id);
      }
      catch (error) {
        console.log('_drupalgap_form_submit - form_submission - ' + error);
      }
    };

    // Get ready to validate and submit the form, but first...

    // If this is an entity form, and there is an image field on the form, we
    // need to asynchronously process the image field, then continue onward
    // with normal form validation and submission.
	
	console.log('_drupalgap_form_submit - Video submit validation asamasi 1 - ' + form.entity_type);
	console.log('_drupalgap_form_submit - Video submit validation asamasi t/f - ' + image_fields_present_on_entity_type(form.entity_type, form.bundle));
	console.log('_drupalgap_form_submit - Video submit validation asamasi t/f - ' + video_fields_present_on_entity_type(form.entity_type, form.bundle));
	
    if (form.entity_type &&
      image_fields_present_on_entity_type(form.entity_type, form.bundle)
    ) {
		console.log('_drupalgap_form_submit - Image submit validation asamasi');
      _image_field_form_process(form, form_state, {
          success: form_validation
      });
    }
	else if (form.entity_type &&   // Video field
      video_fields_present_on_entity_type(form.entity_type, form.bundle)
    ) {
		console.log('_drupalgap_form_submit - Video submit validation asamasi');
      _video_field_form_process(form, form_state, {
          success: form_validation
      });
    }
    else {
      // There were no image fields on the form, proceed normally with form
      // validation, which will in turn process the submission if there are no
      // validation errors.
	  /*alert("Lütfen bir video seçin.");
	  $('#edit-node-edit-submit').prop("disabled",false);
	  $('#edit-node-edit-cancel').prop("disabled",false);
	  $('#edit-node-edit-field-video-und-0-value-browse-button').prop("disabled",false);*/
      form_validation();
    }
  }
  catch (error) { console.log('_drupalgap_form_submit - ' + error); }
}

