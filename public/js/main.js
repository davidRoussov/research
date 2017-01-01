var app = angular.module('app', ['ngRoute']);

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


