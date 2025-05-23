angularApp.config(function ($routeProvider) {
    
    $routeProvider
    
    .when('#sidekick', {
        // templateUrl: "../applib/dev/Sidekick1/Sidekick1-view/sidekick.htm?" + Date.now(),
        // controller: 'sideKickController'
    })
    
    .when('#performance-review', {
        // templateUrl: '../applib/dev/PerfReview1/PerfReview1-view/performance-review.htm?' + Date.now(),
        // controller: 'perfReviewController'
    })    
});

var getCurrentHash = function() {
  var a = window.location.hash;
  if (!a) {
    currentHash = "#sidekick";
  } else {
    currentHash = a;
  }
  return currentHash;
}
var removeHide = function (div) {
  if ($(div).hasClass("ng-hide")) {
    $(div).removeClass("ng-hide");
  }  
}
var addHide = function (div) {
  if (!$(div).hasClass("ng-hide")) {
    $(div).addClass("ng-hide");
  }
}
var showHide = function(show,hide) {
  removeHide(show);
  addHide(hide);
}
var checkHashSetView = function() {
  getCurrentHash();
  if (currentHash === '#sidekick') {
    showHide(currentHash,"#performance-review");
  } else if (currentHash === '#performance-review') {
    showHide(currentHash,"#sidekick");
  }
}
$( document ).ready(function() {
    checkHashSetView();
});
window.addEventListener('hashchange', function() {    
    checkHashSetView();          
});