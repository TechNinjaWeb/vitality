window.angular.module('vitalityApp').controller('ProfileEditController', ['$scope', '$sce', 'LoginService', '$rootScope', function($scope, $sce, parse, $rootScope){
	$scope.nav = { left: {}, right: {} };
	
	$rootScope.$emit('pageId', {id: 'profile.edit'});
	
	$scope.nav.title = "Edit Profile";
	$scope.nav.left.sref = 'profile.user';
	$scope.nav.left.icon = $sce.trustAsHtml('<i class="fa fa-lg fa-arrow-left"></i>');
	$scope.nav.right.sref = '';
	$scope.nav.right.icon = $sce.trustAsHtml('');
	
	$scope.saveDetails = function saveDetails(user){

        console.info("Saving User Details", user);
        return parse.saveUserDetails(user);  
    };
}]);