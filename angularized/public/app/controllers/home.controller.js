window.angular.module('vitalityApp').controller('HomeController', ['$scope', '$rootScope', function($scope, $rootScope){
	$scope.nav = {};
	$scope.nav.title = "Home Page";
	$scope.nav.srefLeft = "./home";
	$scope.nav.srefRight = "./rateme/emotion";
	
	$rootScope.$emit('pageId', {id: 'home'});

	$scope.nav = {
		home: {
			sref: 'home.index',
			href: '',
			title: 'Home Page'
		},
		login: {
			sref: 'home.login',
			href: '',
			title: 'Login Page'
		},
		create: {
			sref: 'home.create',
			href: '',
			title: 'Create An Account'
		}
	};
	
	
}]);