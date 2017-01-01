app.controller("researchNotesController", function($scope) {

	$(".active").removeClass("active"); // removing top bar menu navigation highlighting
	$("a[href='/#!/notes']").parent().addClass("active"); // making notes menu button highlighted


});