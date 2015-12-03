window.angular.module('vitalityApp').controller('GoalsController', ['$scope', '$rootScope', '$sce', 'LoginService', 'JSData', function($scope, $rootScope, $sce, parse, DB){
	$scope.nav = { left: {}, right: {} };
	
	$rootScope.$emit('pageId', {id: 'goals.list'});
	
	$scope.nav.title = "Goal Page";
	$scope.nav.left.sref = 'home.index';
	$scope.nav.left.icon = $sce.trustAsHtml('<i class="fa fa-lg fa-home"></i>');
	$scope.nav.right.sref = '#/goals/list/add';
	$scope.nav.right.icon = $sce.trustAsHtml('<i class="fa fa-lg fa-plus"></i>');
	
	
	$scope.getList = window.getList = function(listName, query) {
	    return DB.getFromList(listName, query);
	};
	
	var goalList = window.goalList = (function() {
	    var list = [];
	    DB.getFromList('Goals', {type: 'findAll', conditions: {}}).then(function(goals){
	        return goals.forEach(function(item){
	           list.push(item); 
	        });
	    });
	    return list;
	}());
	
}]);