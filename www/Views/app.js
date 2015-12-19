var myApp = angular.module('myApp', [ 'ngRoute','ngStorage','ngAnimate','ui.bootstrap']);

myApp.config(function($routeProvider)
{
$routeProvider
.when('/', {
	templateUrl : 'Views/signIn/signIn.html',
	controller : 'signUpController'
})
.when('/signUp', {
	templateUrl : 'Views/signUp/signUp.html',
	controller : 'signUpController'
}).otherwise({
	redirectTo : '/'
});

});
