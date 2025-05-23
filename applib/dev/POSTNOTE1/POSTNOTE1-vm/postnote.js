
angularApp.directive("postnote", ['api', function (api) {
    return {
        templateUrl: "../applib/dev/POSTNOTE1/POSTNOTE1-view/postnote.htm?" + Date.now(),
        scope: {
            text: "@",
            details: "@"
        },
        link: function (scope, element, attrs, legacyContainer) {

            //In the future, the text & details could be pulled from a database by ID or something.
            scope.notetext = scope.text;
            scope.detailstext = (typeof scope.details == "undefined") ? "No details text" : scope.details;

            //Details - Modal
            scope.detailsvisible = false;
            scope.detailsshowing = function () {
                return scope.detailsvisible;
            }
            scope.showdetails = function (show) {
                scope.detailsvisible = show;
            }

        }
    }
} ]);