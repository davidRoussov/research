
app.controller("addResearchController", function($scope, $http) {

	$(".active").removeClass("active"); // removing top bar menu navigation highlighting
	$("a[href='/']").parent().addClass("active"); // making add menu button highlighted

	$scope.submitNewResearch = function(link, title, date, source, summary) {

		// looping over checkboxes to see which topics the research is to be submitted for
		var topicIDs = [];
		$(".oneTopic").each(function() {
			var checked = $(this).children().first().children().first().is(":checked");
			if (checked) {
				topicIDs.push($(this).attr("id"));
			}
		});

		if (topicIDs.length === 0) {
			console.log("NO TOPICS WERE SELECTED!");
			return;
		}

		var json = {
			action: "insertNewResearch",
			document: {
				topicIDs: topicIDs,
				link: link,
				title: title,
				date: date,
				source: source,
				summary: summary,
				submissiontime: new Date()
			}

		}

		$http.post('/api/research', json).then(function(response) {
			console.log(response.data);
		});
	}

});