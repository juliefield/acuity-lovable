angularApp.directive("ngMonitorScoreDisplay", [
  "api",
  "$rootScope",
  function (api, $rootScope) {
    return {
      templateUrl:
        a$.debugPrefix() +
        "/applib/dev/AutoQa/view/MonitorScoreDisplay.htm?" +
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
        let alertValue = 150.01;
        let initialData = [];
        let dataLoadType = null;
        SetDataLoadType(attrs);
        const AI_UserId = "AI.System";
        /* Event Handling START */
        /* Event Handling END */
        function Initialize() {
          HideAll();
          SetDatePickers();
          RenderDirectiveFooter();
        }
        function SetDataLoadType(attrs) {
          if (attrs.dataType != null || attrs.datatype != null) {
            dataLoadType = attrs.dataType || attrs.datatype;
          }
        }
        function SetDatePickers() {}
        /* Data Loading START */
        function LoadDirective() {
          HideAll();
          SetHeaderLabel();
          LoadHumanVsAiQualityScore();
        }
        function LoadHumanVsAiQualityScore(callback, forceReload) {
          GetHumanVsAiQualityScore(function (dataToRender) {
            RenderHumanVsAiQualityScore(null, dataToRender);
            RenderAverageDaysToScore(null, dataToRender);
            if (callback != null) {
              callback();
            }
          }, forceReload);
        }
        /* Data Loading END */
        /* Data Pulls START */
        function GetHumanVsAiQualityScore(
          callback,
          forceReload,
          filtersObject
        ) {
          if (forceReload == null) {
            forceReload = false;
          }
          if (
            forceReload == false &&
            initialData != null &&
            initialData.length > 0
          ) {
            if (callback != null) {
              callback(initialData);
            } else {
              return initialData;
            }
          } else {
            let startDate = null;
            let endDate = null;
            let projectId = null;
            let locationId = null;
            let groupId = null;
            let teamId = null;
            let userId = null;
            if (filtersObject != null) {
              startDate = filtersObject.StartDate;
              endDate = filtersObject.EndDate;
              projectId = filtersObject.Project;
              locationId = filtersObject.Location;
              groupId = filtersObject.Group;
              teamId = filtersObject.Team;
              userId = filtersObject.CSR;
            } else {
              startDate = $.cookie("StartDate");
              endDate = $.cookie("EndDate");
              projectId = $.cookie("Project");
              locationId = $.cookie("Location");
              groupId = $.cookie("Group");
              teamId = $.cookie("Team");
              userId = $.cookie("CSR");
            }
            //TODO: Clean this up to make it better??
            //TODO: Handle the each/all values in the filters.
            //need to determine how the "each" value differs on the display
            if (projectId == "all" || projectId == "each") projectId = null;
            if (locationId == "all" || locationId == "each") locationId = null;
            if (groupId == "all" || groupId == "each") groupId = null;
            if (teamId == "all" || teamId == "each") teamId = null;
            if (userId == "all" || userId == "each") userId = null;

            a$.ajax({
              type: "POST",
              service: "C#",
              async: true,
              data: {
                lib: "selfserve",
                cmd: "getQMDashboardStatsData",
                startDate: startDate,
                endDate: endDate,
                deepLoad: false,
                projectId: projectId,
                locationId: locationId,
                groupId: groupId,
                teamId: teamId,
                userId: userId,
              },
              dataType: "json",
              cache: false,
              error: a$.ajaxerror,
              success: function (data) {
                let returnData = JSON.parse(data.qmDashboardStatsData);
                initialData = returnData;
                if (callback != null) {
                  callback(returnData);
                } else {
                  return returnData;
                }
              },
            });
          }
        }
        /* Data Pulls END */
        /* Data Rendering START */
        function RenderHumanVsAiQualityScore(callback, scoreDataObject) {
          let averageQualityScore = "--";
          let displayType = "human";
          if (dataLoadType != null) {
            displayType = dataLoadType;
          }
          if (scoreDataObject == null) {
            scoreDataObject = initialData;
          }
          let filtersObject = GetFilterArrays();

          // displayObject = scoreDataObject.find(
          //   (i) =>
          //     i.ProjectId == 0 &&
          //     i.LocationId == 0 &&
          //     i.GroupId == 0 &&
          //     i.TeamId == 0 &&
          //     (i.UserId == "" || i.UserId == null || i.UserId == 0)
          // );
          let displayObject = scoreDataObject.find(
            (i) =>
              filtersObject.ProjectId.includes(i.ProjectId) &&
              filtersObject.LocationId.includes(i.LocationId) &&
              filtersObject.GroupId.includes(i.GroupId) &&
              filtersObject.TeamId.includes(i.TeamId) &&
              (i.UserId == "" || i.UserId == null || i.UserId == 0)
          );
          if (displayObject != null) {
            averageQualityScore = 0;
            switch (displayType.toLowerCase()) {
              case "ai":
                averageQualityScore =
                  displayObject.AiEnteredAverageScore?.toFixed(2);
                break;
              case "human":
                averageQualityScore =
                  displayObject.UserEnteredAverageScore?.toFixed(2);
                break;
              default:
                averageQualityScore = displayObject.AverageScore?.toFixed(2);
                break;
            }
          }
          $(".monitor-score-directive-holder", element).removeClass(
            "alert-error-scoring"
          );
          if (averageQualityScore > alertValue) {
            $(".monitor-score-directive-holder", element).addClass(
              "alert-error-scoring"
            );
          }
          $("#averageMonitorScore", element).empty();
          $("#averageMonitorScore", element).append(averageQualityScore);
          if (callback != null) {
            callback();
          }
        }
        function RenderAverageDaysToScore(callback, scoreDataObject) {
          $("#averageDaysToMonitor", element).empty();
          let averageDaysToScoreMonitor = "--";
          let displayType = "human";
          if (dataLoadType != null) {
            displayType = dataLoadType;
          }

          if (scoreDataObject == null) {
            scoreDataObject = initialData;
          }
          let filtersObject = GetFilterArrays();

          displayObject = scoreDataObject.find(
            (i) =>
              filtersObject.ProjectId.includes(i.ProjectId) &&
              filtersObject.LocationId.includes(i.LocationId) &&
              filtersObject.GroupId.includes(i.GroupId) &&
              filtersObject.TeamId.includes(i.TeamId) &&
              (i.UserId == "" || i.UserId == null || i.UserId == 0)
          );
          // displayObject = scoreDataObject.find(
          //   (i) =>
          //     i.ProjectId == 0 &&
          //     i.LocationId == 0 &&
          //     i.GroupId == 0 &&
          //     i.TeamId == 0 &&
          //     (i.UserId == "" || i.UserId == null || i.UserId == 0)
          // );

          if (displayObject == null) {
            console.log(
              "Display Object Null",
              displayObject,
              JSON.stringify(displayObject),
              "\n",
              JSON.stringify(scoreDataObject)
            );
          }
          switch (displayType.toLowerCase()) {
            case "ai":
              averageDaysToScoreMonitor =
                displayObject?.AiAverageDaysToMonitor?.toFixed(2) || 0;
              break;
            case "human":
              averageDaysToScoreMonitor =
                displayObject?.UserAverageDaysToMonitor?.toFixed(2) || 0;
              break;
            default:
              averageDaysToScoreMonitor =
                displayObject?.AverageDaysToMonitor?.toFixed(2) || 0;
              break;
          }
          $("#averageDaysToMonitor", element).append(averageDaysToScoreMonitor);
          if (callback != null) {
            callback();
          }
        }

        function RenderDirectiveFooter() {
          let startDate = null;
          let endDate = null;

          if (legacyContainer.scope.filters != null) {
            startDate = new Date(legacyContainer.scope.filters.StartDate);
            endDate = new Date(legacyContainer.scope.filters.EndDate);
          }

          $("#directiveTimeFrame", element).empty();
          if (startDate != null && endDate != null) {
            $("#directiveTimeFrame", element).append(
              `${startDate.toLocaleDateString()} through ${endDate.toLocaleDateString()}`
            );
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
        function SetHeaderLabel() {
          let dataLoadTypeText = "All";

          if (dataLoadType != null) {
            switch (dataLoadType.toLowerCase()) {
              case "human":
                dataLoadTypeText = "Team Member";
                break;
              case "ai":
                dataLoadTypeText = "AI";
                break;
            }
            $("#monitorQualityScoreTypeLabel", element).empty();
            $("#monitorQualityScoreTypeLabel", element).append(
              dataLoadTypeText
            );
          }
        }
        // }
        /* Utility Functions END */
        /* Show/Hide START */
        function HideAll() {}
        // function HideEditorForm() {1
        //    $("#virtualPrizeCatalogEditorFormHolder", element).hide();
        // }
        // function ShowEditorForm() {
        //    $("#virtualPrizeCatalogEditorFormHolder", element).show();
        // }

        /* Show/Hide END */

        scope.load = function () {
          Initialize();
          LoadDirective();
        };
        ko.postbox.subscribe("autoQaRefresh", function (dataObjects) {
          initialData.length = 0;
          initialData = dataObjects;
          LoadDirective();
        });
        ko.postbox.subscribe("autoQaLoad", function (dataObjects) {
          initialData.length = 0;
          initialData = dataObjects;
          scope.load();
        });
        ko.postbox.subscribe(
          "qmDashboardLoadData",
          function (dataStatsObjects) {
            initialData.length = 0;
            initialData = dataStatsObjects;
            scope.load();
          }
        );
        // ko.postbox.subscribe("userPrizeCatalogAdminLoad", function (forceLoad) {
        //    scope.load(forceLoad);
        //    ko.postbox.publish("userPrizeWidgetLoadComplete");
        // });
      },
    };
  },
]);
