'use strict';

// Settings the app dependencies
var app = angular.module('angular-boilerplate', [
	'templates-main'
]);

app.config(function ($routeProvider) {
	$routeProvider
		.when('/', { templateUrl: 'views/home.html', controller: 'HomeCtrl' })
		.otherwise({
			redirectTo: '/'
		});
});
