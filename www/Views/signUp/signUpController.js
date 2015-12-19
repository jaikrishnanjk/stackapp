
myApp.controller('signUpController', function($scope, $rootScope,$location, $http, $window,GPlusAuthService,
$q,$localStorage){
	var templocal=[];
	$scope.submitForm = function () {
			$scope.submitted = true;

			if ($scope.userForm.$valid) {
				var data={};
				data.username=$scope.user.username;
				data.password=$scope.user.password;
				data.confirmPassword=$scope.user.confirmPassword;
				data.email=$scope.user.email;
				data.contactno=$scope.user.contactno;
				if($localStorage.data !=undefined)
				{
					if($localStorage.data.email == data.email)
					{
						alert("user already exist plse signIn");
						$window.location.href="#/applicationData";
					}
					else{
						// alert("User Details saved succesfully");
						for (var val in $localStorage.data)
						{
							if($localStorage.data[val].username)
							{
						templocal.push($localStorage.data[val]);
							}
					    }
					templocal.push(data);
					$localStorage.data=templocal;
					
					$window.location.href="#/applicationData";
					}
					
				
				}
				else{
					for (var val in $localStorage.data)
						{
							if($localStorage.data[val].username)
							{
						templocal.push($localStorage.data[val]);
							}
					    }
					templocal.push(data);
					$localStorage.data=templocal;
					
					$window.location.href="#/applicationData";
				}
				
			}
			else {
				console.log("Please correct errors!");
			}
    };
	
		$scope.getFBLikes = function() {
		 var getPartialFBLikes = function(likesSoFar, defered, next) {
		var api = "/me/likes";
		if (next) {
		api = next;
		}
		FB.api(api, {
		limit : 10000
		}, function(response) {
		if (!response || response.error) {
		defered.reject();
		return;
		}
		if (typeof (response.paging) != 'undefined'
		&& typeof (response.paging.next) != 'undefined') {
		getPartialFBLikes(likesSoFar.concat(response.data),
		defered, response.paging.next);
		return;
		}
		defered.resolve(likesSoFar.concat(response.data));
		});
		};
		var defered = $q.defer();
		getPartialFBLikes([], defered);
		return defered.promise; 
	};
	/*Get Facebook likes for user ends here*/
	
	/*Parsing data and storing user registration details for Facebook Signup*/
	$scope.facebooklogin = function(facebookDetails) {
		//console.log('login');
		//console.log(angular.toJson($scope.fbdata));
		
		//Parsing data before passing to various API - Added by Haripriya
		var datauser = {};
		
		datauser.countryName = null;
		datauser.countryPublish = 1;
		
		datauser.stateName = null;
		datauser.statePublish = 1;
		var fbdata=JSON.parse($scope.fbdata);
		
		console.log("fbdata "+fbdata)	
	};
		$scope.initiateFBLogin = function()
	{
		//console.log('Facebook Login');
		FB.login(
		function(loginResponse) {
			//console.log("FB loginResponse = ", JSON
					//.stringify(loginResponse));
			if (typeof (loginResponse.authResponse) == 'undefined') {
				return;
			} else if (loginResponse.status != 'connected') {
				return;
			}
			FB.api('/me',function(response) {
			console.log("respons e"+angular.toJson(response));
							

							});
		},
		{
			scope : 'user_events,user_birthday,email,user_friends,publish_actions,read_friendlists,rsvp_event,user_status,user_hometown,user_relationships,user_likes'
		});
	}; 
	 $scope.login = function () {
                if (window.cordova.platformId == "browser") {
                    var appId = '707301922670886';
                    facebookConnectPlugin.browserInit(appId);
                }
                facebookConnectPlugin.login( ["email"], 
                    function (response) { console.log(JSON.stringify(response)) },
                    function (response) { console.log(JSON.stringify(response)) });
            }
			
				
	/* GPlus Registration for Member*/
	$scope.signIn = function() {
				/**
				* @name $scope.signIn
				* @function
				* @memberOf userSignUpController
				* @description Initiates series of calls. Google Signin-> readProfile -> google Login/signup API -> Details dialog / Dashboard 
				*/
				
				//console.log("GPlusLoginController.signIn : called. ");
				GPlusAuthService
				.signIn()
				.then(
				function(authResult) {
				GPlusAuthService
				.readProfile()
				.then(
				function(profile) {
				if (profile.error) {
				return;
				}
				console.log(angular.toJson(profile));
				var data = {};
				data.firstName = profile.name.givenName;
				$rootScope.getUserName=profile.name.givenName;
				//console.log('BeforeN:',$rootScope.firstName);
				data.lastName = profile.name.familyName;
				data.sex = profile.gender;
				data.imageUrl = profile.image.url;
				$rootScope.userImg=profile.image.url;
				//console.log('BeforeI:',$rootScope.imageUrl);
				var birth = profile.birthday;
				if(typeof birth != 'undefined'){
				if(birth!=null && birth!=''){
				birth = birth.substr(0,birth.indexOf('-'));
				if(birth == '0000'){
				data.dob = '';
				}else{
				data.dob = profile.birthday;
				}
				}else{
				data.dob = '';
				}
				}else{
				data.dob = '';
				}
				if(typeof profile.relationshipStatus != 'undefined'){
				if(profile.relationshipStatus != null || profile.relationshipStatus != ''){
				if(profile.relationshipStatus.toUpperCase() === 'single'.toUpperCase()){
				data.relationshipStatus = profile.relationshipStatus;
				}else if(profile.relationshipStatus.toUpperCase() === 'In a relationship'.toUpperCase()){
				data.relationshipStatus = profile.relationshipStatus;
				}else if(profile.relationshipStatus.toUpperCase() === 'Engaged'.toUpperCase()){
				data.relationshipStatus = profile.relationshipStatus;
				}else if(profile.relationshipStatus.toUpperCase() === 'Married'.toUpperCase()){
				data.relationshipStatus = profile.relationshipStatus;
				}else{
				data.relationshipStatus = 'Others';
				}
				}
				}
				if (profile.emails) {
				for ( var i = 0; i < profile.emails.length; i++) {
				var email = profile.emails[i];
				if (email.type == 'account') {
				data.email = email.value;
				$rootScope.email = data.email;
				break;
				}
				}
				}
				if (profile.placesLived) {
				for ( var i = 0; i < profile.placesLived.length; i++) {
				var currentCity = profile.placesLived[i];
				data.city = currentCity.value;
				}
				}
				if (!data.email) {
				$scope.message = 'Cannot read email to sign in/sign up!';
				return;
				}
				if(typeof $rootScope.locationInfo!=="undefined"){
				if ($rootScope.locationInfo.country.name == 'India') {
				data.country = $rootScope.locationInfo.country.name;
				} else {
				data.country = 'India';
				}
				}
				
				//Parsing data before passing to UserExists API - Added by Haripriya
				var data1={};
				data1.userEmailID = data.email;
				data1.userLoginVia = 'GPlus';
				
				//Check User with same email id and login via mode exists or not - Added by Haripriya
				
				
				});
				});
				
		};
	
 });
myApp.directive('ngCompare', function () {
    return {
        require: 'ngModel',
        link: function (scope, currentEl, attrs, ctrl) {
            var comparefield = document.getElementsByName(attrs.ngCompare)[0]; //getting first element
            compareEl = angular.element(comparefield);

            //current field key up
            currentEl.on('keyup', function () {
                if (compareEl.val() != "") {
                    var isMatch = currentEl.val() === compareEl.val();
                    ctrl.$setValidity('compare', isMatch);
                    scope.$digest();
                }
            });

            //Element to compare field key up
            compareEl.on('keyup', function () {
                if (currentEl.val() != "") {
                    var isMatch = currentEl.val() === compareEl.val();
                    ctrl.$setValidity('compare', isMatch);
                    scope.$digest();
                }
            });
        }
    }
});
(function() {
	var po = document.createElement('script');
	po.type = 'text/javascript';
	po.async = true;
	po.src = 'https://plus.google.com/js/client:plusone.js';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(po, s);
})();

/**
* @class test.indexApp.GPlusAuthService
* @memberOf test.indexApp
* @description Service for Google Login and readProfile.
*/
myApp
.factory(
"GPlusAuthService",
function($q, $window) {
	/**
	* @name signIn
	* @function
	* @memberOf GPlusAuthService
	* @description Initiates Google Signin. 
	* @returns promise of authResult when signin is successful.
	*/
	var signIn;
	signIn = function() {
	//console.log("GPlusAuthService.signIn : called. ");
	var defered = $q.defer();
	$window.signinCallback = function(authResult) {
	//console
	//.log("signinCallback : authResult['access_token']="
	//+ authResult['access_token']);
	//console
	//.log("signinCallback : authResult['status']['method']="
	//+ authResult['status']['method']);
	/* if (authResult['access_token']) { */
	if (authResult['status']['signed_in']
	&& authResult['status']['method'] == 'PROMPT') {
	$window.signinCallback = null;
	defered.resolve(authResult);
	}
	};
	gapi.auth
	.signIn({
	clientid : "681315531196-s2igg9m06v6gkkqr3p1mf74fokqi2pho.apps.googleusercontent.com",
	cookiepolicy : "single_host_origin",
	requestvisibleactions : "http://schemas.google.com/AddActivity",
	scope : "https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.profile.emails.read https://www.googleapis.com/auth/plus.profiles.read",
	callback : "signinCallback"
	});
	return defered.promise;
	};
	/**
	* @name readProfile
	* @function
	* @memberOf test.indexApp.GPlusAuthService
	* @description Fetches the profile details of signed in google user. 
	* @returns promise of profile.
	*/
	var readProfile = function() {
	var defered = $q.defer();
	gapi.client.load('plus', 'v1', function() {
	if (gapi.client.plus) {
	var request = gapi.client.plus.people.get({
	'userId' : 'me'
	});
	request.execute(function(profile) {
	defered.resolve(profile);
	});
	} else {
	defered.resolve({
	error : "Error loading Google Plus Client"
	});
	}
	});
	return defered.promise;
	};
	return {
	signIn : signIn,
	readProfile : readProfile
	};
});
