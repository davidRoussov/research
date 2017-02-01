
app.controller("addResearchController", function($scope, $http, $timeout, $rootScope) {

	$("a[href='/']").parent().addClass("active"); // making view menu button highlighted

	$scope.submitNewResearch = function(link, title, date, source, summary) {

		// looping over checkboxes to see which topics the research is to be submitted for
		var topicIDs = [];
		$(".topic-checkbox").each(function() {
			var checked = $(this).is(":checked")
			if (checked) {
				topicIDs.push($(this).parent().parent().parent().attr("id"));
			}
		});

		if (topicIDs.length === 0) {
			$scope.showFailureAlert = true;
			return;
		}


		// prepending http:// to link if it doesn't already contain it
		if (link && !link.match(/^[a-zA-Z]+:\/\//))
		{
		    link = 'http://' + link;
		}

		// replace newlines /n with html line breaks <br>
		try {
			summary = summary.replace(/\r?\n/g, '<br />');
		} catch (err) {};

		var userID = localStorage.getItem("userID");
		if (!userID) return;

		var json = {
			action: "insertNewResearch",
			userID: userID,
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

			// refreshing client list of research currently being displayed
			var doc = response.data.research;
			for (let i = 0; i < $rootScope.topics.length; i++) {
				for (let j = 0; j < topicIDs.length; j++) {
					if ($rootScope.topics[i]._id == topicIDs[j]) {
						if ($rootScope.topics[i].researches) {
							$rootScope.topics[i].researches.push(doc);
						} else {
							$rootScope.topics[i].researches = [doc];
						}
					}
				}
			}



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