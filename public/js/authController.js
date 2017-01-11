

app.controller("authController", function($scope, $http, $rootScope) {


	$scope.login = function(email, password) {
		var user = {username: email, password: password};

		$http.post('/auth/login', user).then(function(response) {

			if (response.data.success) {
				$('.modal').modal('hide');
		    	$('.modal-backdrop').remove();

				$rootScope.current_user = user.username;

				$scope.authenticated = true;

				$rootScope.$emit("showTopicsAfterLogin",{});
			}
			else {
				$scope.error_message = response.data.error_message;
			}

		});

	}

	$scope.register = function(email, password) {
		var user = {username: email, password: password};

		$http.post('/auth/signup', user).then(function(response) {
			if (response.data.success) {
				$('.modal').modal('hide');
		    	$('.modal-backdrop').remove();

		    	$rootScope.current_user = response.data.username;


				$scope.authenticated = true;
			}
			else {
				$scope.error_message = response.data.error_message;
			}
		})
	}

});