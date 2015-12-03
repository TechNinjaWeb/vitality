window.angular.module('vitalityApp').controller('TrackerController', ['$scope', '$rootScope', '$sce', 'LoginService', 'JSData', function($scope, $rootScope, $sce, parse, DB){
	$scope.nav = { left: {}, right: {} };
	
	$rootScope.$emit('pageId', {id: 'home.tracker'});
	
	$scope.nav.title = "Tracker";
	$scope.nav.left.sref = 'home.index';
	$scope.nav.left.icon = $sce.trustAsHtml('<i class="fa fa-lg fa-home"></i>');
	$scope.nav.right.sref = '';
	$scope.nav.right.href = '';
	
	$scope.measurements = {};
	
	$scope.save = function(ev, valid) {
		console.log("Valid?", valid, ["event", ev], ["Checked Condition", !valid], ["SaveObj", $scope.measurements]);
		!valid 
			? $rootScope.AlertSystem.show('Enter Required Fields', 'alert-danger')
			: DB.save('Measurements', { type: 'create', conditions: $scope.measurements }).then(function(res){
				// console.info("Saved Ok!", res);
			});
	};
	
	
}]);