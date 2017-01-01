
app.controller("addResearchController", function($scope) {

	$(".active").removeClass("active"); // removing top bar menu navigation highlighting
	$("a[href='/']").parent().addClass("active"); // making add menu button highlighted

});