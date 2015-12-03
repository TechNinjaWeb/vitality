window.angular.module('vitalityApp').controller('RatemeController', ['$scope', '$rootScope', '$sce', 'LoginService','RatingsService', function($scope, $rootScope, $sce, parse, Ratings){
	$scope.nav = { left: {}, right: {} };
	
	if ($rootScope.pageId == 'home') $rootScope.$emit('pageId', {id: 'rateme.emotional'});
	
	$scope.nav.title = "Rate Me";
	$scope.nav.left.sref = 'home.index';
	$scope.nav.left.icon = $sce.trustAsHtml('<i class="fa fa-lg fa-home"></i>');
	$scope.nav.right.href = '';
	$scope.nav.right.sref = '#/activity/list';
	$scope.nav.right.icon = $sce.trustAsHtml('<span>Skip Rating</span>');
	
	$scope.checked = checked;
    
	$scope.next = function(pageId) {
		var field = pageId.split('.');
		// console.log("Property", field[1], $scope.checkbox);
		return Ratings.next(pageId, { [field[1]]: $scope.checkbox });
	};
	
	$scope.back = function(pageId) {
		return Ratings.back(pageId);
	};
	
	$scope.saveData = function() {
		// console.log("Checkbox Val", $scope.checkbox);
		return Ratings.saveData();
	};
	
	function checked(e, val) {
		// console.log("Checked", e);
		var el = Array.prototype.slice.call(e.target.parentNode.parentNode.children);
           //console.log("ELEMS", el);
          el.forEach(function(i){
            var equal = e.target.parentNode == i;
            // console.log("ARE WE EQUAL?", equal, i);
            if (equal && i.children[1].checked == true) e.target.parentNode.children[1].checked = false;
            if (equal && i.children[1].checked == false) e.target.parentNode.children[1].checked = true;
            if (!equal && i.children[1].checked == true) i.children[1].checked = false;
            if (!equal && i.children[1].checked == false) i.children[1].checked = false;
            if (i.children[1].checked == true) i.children[0].style.color = "green";
            else i.children[0].style.color = "white";
            // else console.log("I'm probably not the same as target, but i still might be checked", i.children[1].checked);
          });
        // console.log("Checked This IDX " + (val - 1), val);
        $scope.checkbox = val;
	}
}]);