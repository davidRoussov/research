



app.run( function($rootScope, $location) {

  $rootScope.$emit("refreshTopics",{});

   $rootScope.$watch(function() { 
      return $location.path(); 
    },
    function(url){  

      $(".active").removeClass("active");

      switch(url) {
        case "/":

          $("a[href='/']").parent().addClass("active"); // making view menu button highlighted

          break;
        case "/view":

          $("a[href='/#!/view']").parent().addClass("active"); // making view menu button highlighted

          break;
        case "/notes":

          $("a[href='/#!/notes']").parent().addClass("active"); // making notes menu button highlighted

          break;
        case "/recommendations":

          $("a[href='/#!/recommendations']").parent().addClass("active"); // making recommendations menu button highlighted

          break;
        default:
          console.log("invalid url: X" + url + "X");
      }



    });
});

app.config(function($routeProvider){
  $routeProvider
    .when('/', {
      templateUrl: 'add.html',
      controller: 'addResearchController'
    })
    .when('/view', {
      templateUrl: 'view.html',
      controller: 'viewResearchController'
    })
    .when('/notes', {
      templateUrl: 'notes.html',
      controller: 'researchNotesController'
    })
    .when('/recommendations', {
      templateUrl: 'recommendations.html',
      controller: 'researchRecommendationsController'
    })
});

app.directive("contenteditable", function() {
  return {
    restrict: "A",
    require: "ngModel",
    link: function(scope, element, attrs, ngModel) {

      function read() {
        ngModel.$setViewValue(element.html());
      }

      ngModel.$render = function() {
        element.html(ngModel.$viewValue || "");
      };

      element.bind("blur keyup change", function() {
        scope.$apply(read);
      });
    }
  };
});

app.directive('pressEnter', function() {
  return function($scope, element, attrs) {
    element.bind("keydown keypress", function(event) {

      if (event.which === 13) {
        $scope.$apply(function() {
          $scope.$eval(attrs.pressEnter);
        });

      }
    });
  };
});

function hideModal() {
  $('.modal').modal('hide');
  $('.modal-backdrop').remove();
}