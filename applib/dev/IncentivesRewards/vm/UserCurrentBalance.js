angularApp.directive("ngUserCurrentBalance", [
  "api",
  "$rootScope",
  function (api, $rootScope) {
    return {
      templateUrl:
        a$.debugPrefix() +
        "/applib/dev/IncentivesRewards/view/UserCurrentBalance.htm?" +
        Date.now(),
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
        HideAll();
        //let defaultAvatarFile = window.location.protocol + "//" + window.location.hostname + "/jq/avatars/empty_headshot.png";
        let userRewardsSummary = [];
        /* Event Handling START */
        /* Event Handling END */
        scope.Initialize = function () {
          HideAll();
        };
        function SetDatePickers() {}
        /* Data Loading START */
        function LoadDirective(callback, forceReload) {
          HideAll();
          LoadCurrentUserPoints(callback, forceReload);
        }
        /* Data Loading END */
        function LoadCurrentUserPoints(callback, forceReload) {
          GetCurrentUserBalance(function (currentUserRewardSummary) {
            ko.postbox.publish(
              "CurrentUserBalanceLoaded",
              currentUserRewardSummary,
            );
            RenderCurrentUserBalance(function () {
              if (callback != null) {
                callback();
              }
            }, currentUserRewardSummary);
          }, forceReload);
        }
        /* Data Pulls START */
        function GetCurrentUserBalance(callback, forceReload) {
          if (forceReload == null) {
            forceReload = false;
          }
          if (
            userRewardsSummary != null &&
            userRewardsSummary.length > 0 &&
            forceReload == false
          ) {
            if (callback != null) {
              callback(userRewardsSummary);
            }
          } else {
            a$.ajax({
              type: "GET",
              service: "C#",
              async: true,
              data: {
                lib: "selfserve",
                cmd: "getIRPASUserRewardsSummaryForUser",
                userid: legacyContainer.scope.TP1Username,
                deepLoad: false,
              },
              dataType: "json",
              cache: false,
              error: a$.ajaxerror,
              success: function (jsonData) {
                let returnData = JSON.parse(jsonData.userRewardSummaryList);
                userRewardsSummary.length = 0;
                userRewardsSummary = returnData;
                if (callback != null) {
                  callback(returnData);
                }
              },
            });
          }
        }
        /* Data Pulls END */
        /* Data Rendering START */
        function RenderCurrentUserBalance(callback, listToRender) {
          if (listToRender == null) {
            listToRender = userRewardsSummary;
          }
          $("#lblCurrentUserPointsTotal", element).empty();
          $("#lblCurrentUserPointsEarned", element).empty();
          $("#lblCurrentUserPointsClaimed", element).empty();

          let totalEarned = 0;
          let totalClaimed = 0;

          userRewardsSummary.forEach(function (summaryItem) {
            totalEarned += summaryItem.TotalPointsEarned || 0;
            totalClaimed += summaryItem.TotalPointsUsed || 0;
          });

          let currentUserPointsTotal = totalEarned - totalClaimed;

          $("#lblCurrentUserPointsTotal", element).append(
            currentUserPointsTotal,
          );
          $("#lblCurrentUserPointsEarned", element).append(totalEarned);
          $("#lblCurrentUserPointsClaimed", element).append(totalClaimed);

          if (callback != null) {
            callback();
          }
        }
        /* Data Rendering END */
        /* Editor Loading START */
        /* Editor Loading END */
        /* Editor Validation & Saving START */
        /* Editor Validation & Saving END */
        /* Sorting Options START */
        /* Sorting Options END */
        /* Utility Functions START */
        /* Utility Functions END */
        /* Show/Hide START */
        function HideAll() {}
        /* Show/Hide END */

        scope.load = function () {
          scope.Initialize();
          LoadDirective();
        };
        ko.postbox.subscribe("IRPASManagementInit", function () {
          scope.Initialize();
        });
        ko.postbox.subscribe("IRPASManagementLoad", function () {
          //scope.load();
          LoadDirective();
        });
        ko.postbox.subscribe(
          "IRPASManagementUserBalanceReload",
          function (forceReload) {
            userRewardsSummary.length = 0;
            LoadDirective(null, forceReload);
          },
        );
      },
    };
  },
]);

