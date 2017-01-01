app.controller("researchRecommendationsController", function($scope) {

	$(".active").removeClass("active"); // removing top bar menu navigation highlighting
	$("a[href='/#!/recommendations']").parent().addClass("active"); // making recommendations menu button highlighted


});