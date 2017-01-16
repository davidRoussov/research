
app.controller("addResearchController", function($scope, $http, $timeout, $rootScope) {

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
			$scope.showFailureAlert = true;
			return;
		}

		var username = $rootScope.current_user;

		var json = {
			action: "insertNewResearch",
			username: username,
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

			$scope.showSuccessAlert = true;


		});
	}

	$scope.clearAddResearchForm = function() {
		$("#inputLink").val('');
		$("#inputTitle").val('');
		$("#inputDate").val('');
		$("#inputSource").val('');
		$("#inputSummary").val('');

		$scope.showSuccessAlert = false;
	}

	$scope.closeSuccessAlert = function() { $scope.showSuccessAlert = false; }
	$scope.closeFailureAlert = function() { $scope.showFailureAlert = false; }

});