var app = angular.module('app', ['ngRoute', 'ui']);

app.run( function($rootScope, $location) {
   $rootScope.$watch(function() { 
      return $location.path(); 
    },
    function(url){  

      // switch(url) {
      //   case "/":
      //     console.log("add");
      //     break;
      //   case "/view":
      //     console.log("view");
      //     break;
      //   case "/notes":
      //     console.log("notes");
      //     break;
      //   case "/recommendations":
      //     console.log("recommendations");
      //     break;
      //   default:
      //     console.log("invalid url: " + url);
      // }



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
    });
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

