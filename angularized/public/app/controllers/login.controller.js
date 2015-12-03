window.angular.module('vitalityApp').controller('LoginController', ['$scope', '$rootScope', '$sce', 'LoginService', function($scope, $rootScope, $sce, parse){
	$scope.nav = { left: {}, right: {} };
	
	$rootScope.$emit('pageId', {id: 'home.login'});
	
	$scope.nav.title = "Login";
	$scope.nav.left.sref = 'home.index';
	$scope.nav.left.icon = $sce.trustAsHtml('<i class="fa fa-lg fa-home"></i>');
	$scope.nav.right.sref = '#/account';
	$scope.nav.right.icon = $sce.trustAsHtml('<h6 class="create-account-anchor">Create Account</h6>');
	
	$scope.login = function(username, password) {
		return parse.login(username, password);
	};
	
	$scope.createAccount = function() {
		var userDetails = {
			userName: $scope.userName,
			email: $scope.email,
			password: $scope.password,
			firstName: $scope.firstName,
			lastName: $scope.lastName,
			userAge: $scope.userAge,
			userHeight: $scope.userHeight
		};
		
		var validationName = {
			userName: 'User Name',
			email: 'Email',
			password: 'Password',
			firstName: 'First Name',
			lastName: 'Last Name',
			userAge: 'Age',
			userHeight: 'Height'
		};
		
		console.log("Login", userDetails);
		for (var p in userDetails) {
			if (!userDetails[p]) return window.AlertSystem.show('You Must Enter A Valid ' + validationName[p], 'alert-danger');
			return parse.createUser(userDetails);
		}
	};
	
}]);