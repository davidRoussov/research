
app.controller("authController", function($scope, $http, $rootScope) {

	$scope.login = function(email, password) {
		var user = {username: email, password: password};

		$http.post('/auth/login', user).then(function(response) {

			if (response.data.success) {
				$('.modal').modal('hide');
		    	$('.modal-backdrop').remove();

				$rootScope.current_user = user.username;

				$scope.authenticated = true;

				$rootScope.$emit("refreshTopics",{});

				$(".user-input").val("");
			}
			else {
				$scope.error_message = response.data.error_message;
			}

		});

	}

	$scope.register = function(email, password, password2) {
		if (password !== password2) {
			$scope.error_message = "passwords do not match";
			return;
		}

		var user = {username: email, password: password};

		$http.post('/auth/signup', user).then(function(response) {
			if (response.data.success) {
				hideModal();

		    	$rootScope.current_user = user.username;

				$scope.authenticated = true;

				$(".user-input").val("");
			}
			else {
				$scope.error_message = response.data.error_message;
			}
		})
	}

	$scope.signout = function() {

		$rootScope.current_user = null;

		$scope.authenticated = false;

		$rootScope.$emit("refreshTopics",{});
	}

});