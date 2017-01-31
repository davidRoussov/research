var app = angular.module('app', ['ngRoute', 'ui']);

app.controller("init", function($rootScope, $http) {


	// // getting topics
	// var userID = localStorage.getItem("userID");
	// if (userID) {

	
	// 	var json = {
	// 		action: "getTopics", 
	// 		userID: userID
	// 	}

	// 	$http.post("/api/topics", json).then(function(response) {

	// 		if (response.data.notopics)  {
	// 			return;
	// 		}

	// 		else {
	// 			$rootScope.topics = response.data;
	// 		}

	// 	});



	// }








});