window.angular.module('vitalityApp').controller('CreateAccountController', ['$scope', '$rootScope', '$sce', function($scope, $rootScope, $sce){
	$scope.nav = { left: {}, right: {} };
	
	$rootScope.$emit('pageId', {id: 'home.account'});
	
	$scope.nav.title = "Accounts";
	$scope.nav.left.sref = 'home.index';
	$scope.nav.left.icon = $sce.trustAsHtml('<i class="fa fa-lg fa-home"></i>');
	$scope.nav.right.sref = '#/login';
	$scope.nav.right.icon = $sce.trustAsHtml('<h6 class="login-anchor">Login</h6>');
	
}]);