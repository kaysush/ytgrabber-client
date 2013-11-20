$(document).tooltip();
$(document).ready(function(){
	
	/* DOM variables */
	var _status = $("#status")
	var _response = $("#response")
	var _loader = $("#loader")
	var _download = $("#download")
	var _title = $("#title")
	var _image = $("#thumbnail")
	_download.button()
	
	_loader.hide()
	_status.hide()
	_response.hide()
	_title.hide()
	_image.hide()
	_download.click(function(event){

		_image.removeAttr("src")
		_image.hide()
		_title.empty()
		_title.hide()
		_response.empty()
		_response.hide()
			
		event.preventDefault()
		var url = $("#yturl").val()
		var url_regex = /(https?:\/\/)?(www.)?(youtube.com\/watch\?v=)?([a-zA-Z0-9_-]{11})/i;
		if(url_regex.test(url)) {
			_download.hide()
			_loader.show()
			_status.show()
			_status.html("Loading Please wait...")
			/* Do the matching */
			var matches = url_regex.exec(url)
			/* Extract the video_id from the URL */
			var vid = matches[4]

			/* The callback when the call to API is successful */
			success = function(data , response){
				_loader.hide()
				_download.show()
				console.log(response)
				data = JSON.stringify(data)
				var obj = $.parseJSON(data)
				if(!obj.error){
				var links = obj.link
				var html = ""
				/* Iterate over entire reponse and create HTML output for rendering */
				for(var link in links) {
					var format = links[link].type.format
					var quality = links[link].type.quality
					var download_url = links[link].url
					html += "<a href = '"+download_url+"'>" + format +"/" + quality + "</a><br/>"

				}
				_image.attr("src" , obj.thumbnailUrl)
				_image.show()
				_title.text(obj.title)
				_title.show();
				_response.show()
				_response.html(html)
				_status.show()
				_status.html("Done :)")
			} else {
				var error_message = decodeURIComponent(obj.error.error_message)
				error_meesage = error_message.replace(/\+/g , " ")
				_image.removeAttr("src")
				_image.hide()
				_title.empty()
				_title.hide()
				_response.empty()
				_response.hide()
				_status.html(error_message)
			}
				
			}

			/* Callback in case error in calling API */
			error = function(jqxhr , textStatus , errorThrown) {
				_response.html(errorThrown)
				_status.html(textStatus)
			}

			/* Make the actual call to API */
			callMashape(vid , success , error )

		} else {
			_status.show()
			_status.html("Malformed Url!!!")
		}
	})
})


/*
* Make a call to Mashape API.
* @param vid Video ID of the video to be downloaded
* @param success callback for successful call
* @param error callback for call with errors
*/
callMashape = function(vid , success , error) {
	var full_url = "https://ytgrabber.p.mashape.com/app/get/" +vid
	console.log(full_url)
	$.ajax({
		type : "GET",
		url : full_url ,
		headers : {'X-Mashape-Authorization': 'pehaywcpwrkczccqnyomdrnklqg4lv'},
		dataType : 'json',
		success : success , 
		error : error


	})
}