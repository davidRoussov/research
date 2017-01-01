app.controller("viewResearchController", function($scope, $rootScope, $http) {

	$(".active").removeClass("active"); // removing top bar menu navigation highlighting
	$("a[href='/#!/view']").parent().addClass("active"); // making view menu button highlighted


	// user clicks topic checkbox, topics.js goes to here, to get the topic and show it on screen
	$rootScope.$on('viewTopic', function(event, topicID) {

		$http.get("/api/topics/" + topicID).then(function(response) {

		});


	});


});

