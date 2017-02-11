
app.controller("addResearchController", function($scope, $http, $timeout, $rootScope) {



	$("a[href='/']").parent().addClass("active"); // making view menu button highlighted

	var currentInputs = JSON.parse(localStorage.getItem("rs-userWrites"));
	if (currentInputs) {
		$scope.userWritesLink = currentInputs.inputLink;
		$scope.userWritesTitle = currentInputs.inputTitle;
		$scope.userWritesDate = currentInputs.inputDate;
		$scope.userWritesSource = currentInputs.inputSource;
		$scope.userWritesSummary = currentInputs.inputSummary;
	}






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
		$scope.userWritesLink = "";
		$scope.userWritesTitle = "";
		$scope.userWritesDate = "";
		$scope.userWritesSource = "";
		$scope.userWritesSummary = "";

		localStorage.removeItem("rs-userWrites");

		$scope.showSuccessAlert = false;
	}

	$scope.closeSuccessAlert = function() { $scope.showSuccessAlert = false; }
	$scope.closeFailureAlert = function() { $scope.showFailureAlert = false; }

	$scope.userWrites = function(event) {
		var id = $(event.target).attr("id");

		var currentInputs = JSON.parse(localStorage.getItem("rs-userWrites"));
		if (!currentInputs) {
			currentInputs = {};
		}

		switch(id) {
			case 'inputLink':
				currentInputs.inputLink = $scope.userWritesLink;
				break;
			case 'inputTitle':
				currentInputs.inputTitle = $scope.userWritesTitle;
				break;
			case 'inputDate':
				currentInputs.inputDate = $scope.userWritesDate;
				break;
			case 'inputSource':
				currentInputs.inputSource = $scope.userWritesSource;
				break;
			case 'inputSummary':
				currentInputs.inputSummary = $scope.userWritesSummary;
				break;
			default:
				console.log('error: invalid input field id: ' + id);
				return;
		}

		localStorage.setItem("rs-userWrites", JSON.stringify(currentInputs));

	}




});