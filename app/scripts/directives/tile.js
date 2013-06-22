'use strict';

angular.module('angular-boilerplate')
.directive('tile', function() {
	return {
		restrict: 'E',
		scope: {
			title: '=title',
			type: '=type'
		},
		template:
			'<div class="tile {{type}} {{big}}">' +
				'<span class="name">{{title}}</span>' +
			'</div>',
		link: function(scope, elem, attrs) {
			scope.big = typeof attrs.big !== 'undefined' ? 'big' : '';
		},
		replace: false
	};
});