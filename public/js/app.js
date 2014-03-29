var app = angular.module('gradame', [
  'ui.router', 
  //'ui.router.compat',
  'google-maps',
  'ngResource']);
  
  
app.config(['$stateProvider', '$urlRouterProvider', 
	//'$locationProvider', 
	function ($stateProvider, $urlRouterProvider ) {
		$stateProvider
			.state('home', {
				url : '',
				templateUrl: '/views/home.html'
			})
			.state('home-dash', {
				url : '/',
				templateUrl: '/views/home.html'
			})
			.state('login', {
				url : '/login',
				templateUrl: '/views/login.html',
				controller: 'AuthCtrl'
			})
			.state('register', {
				url : '/register',
				templateUrl: '/views/register.html',
				controller: 'AuthCtrl'
			})
			.state('profile', {
				url : '/profile',
				templateUrl: '/views/profile.html'
			})
			.state('signals', {
				url : '/signals',
				templateUrl: '/views/signals.html',
				controller: 'SignalsCtrl'
			})
			.state('signals-new', {
				url : '/signals/new',
				templateUrl: '/views/signals.new.html',
				controller: 'SignalsCtrl'
			})
			.state("otherwise", { url : '/'});
		
		//$locationProvider.html5Mode(true);
	}
]);