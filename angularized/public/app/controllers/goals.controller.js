window.angular.module('vitalityApp').controller('GoalsController', ['$scope', '$rootScope', '$sce', 'JSData', function($scope, $rootScope, $sce, DB){
	$scope.nav = { left: {}, right: {} };
	
	$rootScope.$emit('pageId', {id: 'goals.list'});
	
	$scope.nav.title = "Goal Page";
	$scope.nav.left.sref = 'home.index';
	$scope.nav.left.icon = $sce.trustAsHtml('<i class="fa fa-lg fa-home"></i>');
	$scope.nav.right.sref = '#/goals/list/add';
	$scope.nav.right.icon = $sce.trustAsHtml('<i class="fa fa-lg fa-plus"></i>');
	
	
	$scope.getList = window.getList = function(listName, query) {

	};
	
	
	
}]);