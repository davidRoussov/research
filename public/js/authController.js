
app.controller("authController", function($scope, $http, $rootScope) {

	// checking local storage for user id
	var userID = localStorage.getItem("userID");
	if (userID != null) {
	  $scope.authenticated = true;
	  $scope.username = localStorage.getItem("username");
	}

	$scope.login = function(email, password) {
		var user = {username: email, password: password};

		$http.post('/auth/login', user).then(function(response) {

			if (response.data.success) {
				
				hideModal();





				// setting HTML5 web storage
		    	var userID = response.data.user._id;
		    	var username = response.data.user.username;

		    	localStorage.setItem("userID", userID);
		    	localStorage.setItem("username", username)

		    	$scope.username = username;





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



				// setting HTML5 web storage
		    	var userID = response.data.user._id;
		    	var username = response.data.user.username;

		    	localStorage.setItem("userID", userID);
		    	localStorage.setItem("username", username)

		    	$scope.username = username;





				$scope.authenticated = true;

				$(".user-input").val("");
			}
			else {
				$scope.error_message = response.data.error_message;
			}
		})
	}

	$scope.signout = function() {

		$scope.username = null;

		$scope.authenticated = false;

		localStorage.removeItem("userID");
		localStorage.removeItem("username");

		$rootScope.topics = [];
	}

	$scope.searchResearch = function(event, request) {

		console.log(event);

		// this is for detecting user pressing enter to submit
		if (event.type == "keypress") {
			var keyCode = event.keyCode;	
			if (keyCode != 13) {
				return;
			}
		}

		var userID = localStorage.getItem("userID");

		var json = {
			action: "searchResearch",
			request: request,
			userID
		}

		$http.post('/api/research', json).then(function(response) {
			$rootScope.researches = response.data.matches;
		});

	}




});