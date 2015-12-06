window.angular.module('vitalityApp').controller('ActivityController', ['$scope', '$rootScope', '$sce', 'JSData', function($scope, $rootScope, $sce, DB){
	$scope.nav = { left: {}, right: {} };
	
	$scope.nav.title = "Activities";
	$scope.nav.left.sref = 'home.index';
	$scope.nav.left.icon = $sce.trustAsHtml('<i class="fa fa-lg fa-home"></i>');
	$scope.nav.right.href = '';
	
	if ($rootScope.pageId.indexOf('rateme') >= 0) $scope.$emit('pageId', {id: 'activity'});
	// Define Navigation Btns By State
	if ($rootScope.pageId == 'activity') {
		$scope.nav.right.sref = '#/activity/create';
		$scope.nav.right.icon = $sce.trustAsHtml('<i class="fa fa-lg fa-plus"></i>');
	} else if ($rootScope.pageId == 'activity.list') {
		$scope.nav.right.sref = '#/activity/create';
		$scope.nav.right.icon = $sce.trustAsHtml('<i class="fa fa-lg fa-plus"></i>');
	}
	
	if ($rootScope.pageId == 'activity.list') DB.list.ActivityList.findAll().then(function(list){
		console.log(["Performed Find on Activity List", list]);	
		// $scope.activityList = list;
		$scope.activityList = [{
			item: 'blah bla',
			trackBy: 1,
			type: 2
		}];
	});
	
	$scope.navigateTo = function(state) {
    	$scope.$emit('pageId', {id: state});
    	$scope.$emit('sendTo', state);
	};
	
}])
.controller('ActivityCreateController', ['$scope', '$rootScope', '$sce', 'JSData', function($scope, $rootScope, $sce, DB){
	$scope.nav = { left: {}, right: {} };
	
	$scope.nav.title = "Create An Activity";
	$scope.nav.left.sref = 'activity.list';
	$scope.nav.left.icon = $sce.trustAsHtml('<i class="fa fa-lg fa-arrow-left"></i>');
	$scope.nav.right.href = '#';
	$scope.nav.right.sref = '';
	$scope.nav.right.icon = $sce.trustAsHtml('<i data-ng-click="" class="fa fa-lg fa-check"></i>');	
	
	$scope.list = [];
	
	if ($rootScope.pageId == 'activity.list') $scope.$emit('pageId', {id: 'activity.create'});
	
	$scope.addStep = function() {
		$scope.list.push({});
		console.log("Add Step", $scope.list);
	};
	
	$scope.removeStep = function(idx) {
		$scope.list.splice(idx, 1);
		console.log("Removing IDX - " + idx, $scope.list);
	};
	
	$scope.saveActivity = function() {
		console.log("Instructions to save", $scope.lsit);
	};
}]);