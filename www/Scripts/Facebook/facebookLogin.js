//Facebook Login - This file contains the APPID to connect to facebook
/* 
window.initiateFBLogin = function() {
	
			
		}; */

	window.fbAsyncInit = function() {
			FB.init({
				appId : '707301922670886',
				version : 'v2.0',
				status : false,
				xfbml : true
			});
	};

	(function(d, s, id) {
			var js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) {
				return;
			}
			js = d.createElement(s);
			js.id = id;
			js.src = "//connect.facebook.net/en_US/all.js";
			fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));

	function logout() {
			//document.getElementById('login').style.display = "none";
	}	
	
//Facebook Login ends here
	
