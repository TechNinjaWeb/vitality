window.angular.module('vitalityApp').controller('ProgressController', ['$scope', '$sce', 'LoginService', '$rootScope', function($scope, $sce, parse, $rootScope){
	$scope.nav = { left: {}, right: {} };
	
	$rootScope.$emit('pageId', {id: 'progress'});
	
	$scope.nav.title = "Progress Page";
	$scope.nav.left.sref = 'profile.user';
	$scope.nav.left.icon = $sce.trustAsHtml('<i class="fa fa-lg fa-arrow-left"></i>');
	$scope.nav.right.sref = '';
	$scope.nav.right.icon = $sce.trustAsHtml('');
	
}]);