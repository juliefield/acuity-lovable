angularApp.directive("ngQuizQuestionManagement", [
  "api",
  "$rootScope",
  function (api, $rootScope) {
    return {
      templateUrl: a$.debugPrefix() + "/applib/dev/Quizing/view/QuizQuestionManagement.htm?" + Date.now(),
      scope: {
        assoc: "@",
        text: "@",
        details: "@",
        cid: "@",
        filters: "@",
        panel: "@",
        hidetopper: "@",
        toppertext: "@",
        displayLimitedData: "@",
        addonlyDisplay: "@",
        tempReferenceKey: "@",
        userId: "@",
      },
      require: "^ngLegacyContainer",
      link: function (scope, element, attrs, legacyContainer) {
        /* Event Handling START */
        $("#btnTest")
          .off("click")
          .on("click", function () {
            console.log("Button Test clicked.");
          });
        /* Event Handling END */
        function Initialize() {
          HideAll();
        }
        /* Data Loading START */
        function LoadDirective() {
          HideAll();
          console.log("QuizQuestionManagement.LoadDirective()");
        }
        /* Data Loading END */
        /* Data Pulls START */
        /* Data Pulls END */
        /* Data Rendering START */
        /* Data Rendering END */
        /* Show/Hide START */
        function HideAll() {
          console.log("QuizQuestionManagement.HideAll()");
        }
        /* Show/Hide END */

        scope.load = function () {
          console.log("🚀  |  quizQuestionManagement.js:51  |  scope.load()");
          Initialize();
          LoadDirective();
        };
        scope.load();
      },
    };
  },
]);
