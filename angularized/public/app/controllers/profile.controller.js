window.angular.module('vitalityApp').controller('ProfileController', ['$scope', '$rootScope', '$sce', 'LoginService', function($scope, $rootScope, $sce, parse){
	$scope.nav = { left: {}, right: {} };
	
	$rootScope.$emit('pageId', {id: 'profile.user'});
	
	$scope.nav.title = "Profile Page";
	$scope.nav.left.sref = 'home.index';
	$scope.nav.left.icon = $sce.trustAsHtml('<i class="fa fa-lg fa-home"></i>');
	$scope.nav.right.sref = '';
	$scope.nav.right.href = '#/profile/edit';
	
	
	$scope.logout = function() {
		return parse.logout();
	};
	
}]);