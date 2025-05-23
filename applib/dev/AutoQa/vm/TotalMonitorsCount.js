angularApp.directive("ngTotalMonitorsCount", [
  "api",
  "$rootScope",
  function (api, $rootScope) {
    return {
      templateUrl:
        a$.debugPrefix() +
        "/applib/dev/AutoQa/view/TotalMonitorsCount.htm?" +
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
        let initialData = [];
        let todayDataStats = null;
        /* Event Handling START */
        /* Event Handling END */
        function Initialize() {
          HideAll();
          SetDatePickers();
          RenderDirectiveFooter();
        }
        function SetDatePickers() {}
        /* Data Loading START */
        function LoadDirective() {
          HideAll();
          LoadTotalMonitorsCount();
        }
        function LoadTotalMonitorsCount(callback) {
          ResetDirective();
          GetTotalMonitorCount(function (monitorStatsData) {
            GetMonitorStatsForToday(function () {
              RenderTotalMonitorCount(function () {
                RenderMonitorsPerDay(null, monitorStatsData);
                if (callback != null) {
                  callback();
                }
              }, monitorStatsData);
            }, true);
          });
        }
        /* Data Loading END */
        /* Data Pulls START */
        function GetTotalMonitorCount(callback, filtersObject) {
          //TODO: Handle some way to check if there is something already loading
          if (initialData == null || initialData.length == 0) {
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
          } else {
            if (callback != null) {
              callback(initialData);
            } else {
              return initialData;
            }
          }
        }
        function GetMonitorStatsForToday(callback, forceReload, filtersObject) {
          if (forceReload == null) {
            forceReload = false;
          }
          if (todayDataStats == null || forceReload == true) {
            let startDate = new Date();
            let endDate = new Date(
              startDate.getFullYear(),
              startDate.getMonth(),
              startDate.getDate() + 1
            );
            let projectId = null;
            let locationId = null;
            let groupId = null;
            let teamId = null;
            let userId = null;
            if (filtersObject != null) {
              projectId = filtersObject.Project;
              locationId = filtersObject.Location;
              groupId = filtersObject.Group;
              teamId = filtersObject.Team;
              userId = filtersObject.CSR;
            } else {
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
                startDate: new Date(startDate).toLocaleDateString(),
                endDate: new Date(endDate).toLocaleDateString(),
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
                todayDataStats = null;
                let filtersObject = GetFilterArraysLocal();
                let todayFullStats = returnData.find(
                  (i) =>
                    filtersObject.ProjectId.includes(i.ProjectId) &&
                    filtersObject.LocationId.includes(i.LocationId) &&
                    filtersObject.GroupId.includes(i.GroupId) &&
                    filtersObject.TeamId.includes(i.TeamId) &&
                    (i.UserId == "" || i.UserId == null || i.UserId == 0)
                );

                if (todayFullStats != null) {
                  todayDataStats = todayFullStats;
                }
                if (callback != null) {
                  callback(returnData);
                } else {
                  return returnData;
                }
              },
            });
          }
          //todayDataStats
        }

        /* Data Pulls END */
        /* Data Rendering START */
        function RenderTotalMonitorCount(callback, monitorData) {
          let totalMonitorCount = 0;

          if (monitorData == null) {
            monitorData = initialData;
          }

          let dataRecord = null;
          let filterObject = GetFilterArrays();

          dataRecord = monitorData.find(
            (i) =>
              filterObject.ProjectId.includes(i.ProjectId) &&
              filterObject.LocationId.includes(i.LocationId) &&
              filterObject.GroupId.includes(i.GroupId) &&
              filterObject.TeamId.includes(i.TeamId) &&
              (i.UserId == null || i.UserId == "" || i.UserId == 0)
          );

          totalMonitorCount = dataRecord?.TotalMonitors || 0;

          $("#totalMonitorsCount", element).empty();
          $("#totalMonitorsCount", element).append(totalMonitorCount);

          let totalMonitorsToday = todayDataStats?.TotalMonitors || 0;
          $("#monitorsCountToday", element).removeClass("zero-monitors");
          $("#monitorsCountToday", element).empty();
          $("#monitorsCountToday", element).append(`(${totalMonitorsToday})`);
          if (totalMonitorsToday == 0) {
            $("#monitorsCountToday", element).addClass("zero-monitors");
          }
          if (callback != null) {
            callback();
          }
        }
        function RenderMonitorsPerDay(callback, overallDataObject) {
          if (overallDataObject == null) {
            overallDataObject = initialData;
          }
          $("#monitorsPerDay", element).empty();
          let monitorsPerDay = 0;
          let numberOfDays = 1;
          let totalMonitors = 0;

          let startDate = new Date(legacyContainer.scope.filters.StartDate);
          let endDate = new Date(legacyContainer.scope.filters.EndDate);
          let today = new Date();
          if (endDate > today) {
            endDate = today;
          }
          numberOfDays = parseInt(
            Math.round(Math.abs((endDate - startDate) / (1000 * 60 * 60 * 24)))
          );
          let filterObject = GetFilterArrays();

          let monitorStatObject = overallDataObject.find(
            (i) =>
              filterObject.ProjectId.includes(i.ProjectId) &&
              filterObject.LocationId.includes(i.LocationId) &&
              filterObject.GroupId.includes(i.GroupId) &&
              filterObject.TeamId.includes(i.TeamId) &&
              (i.UserId == null || i.UserId == "" || i.UserId == 0)
          );
          // let monitorStatObject = overallDataObject.find(
          //   (i) =>
          //     i.ProjectId == 0 &&
          //     i.LocationId == 0 &&
          //     i.GroupId == 0 &&
          //     i.TeamId == 0 &&
          //     (i.UserId == null || i.UserId == 0 || i.UserId == "")
          // );1
          if (monitorStatObject != null) {
            totalMonitors = monitorStatObject.TotalMonitors;
            if (numberOfDays != 0) {
              monitorsPerDay = parseFloat(totalMonitors / numberOfDays);
            }
          }
          $("#monitorsPerDay", element).append(monitorsPerDay.toFixed(2));
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
        function ResetDirective() {
          $("#totalMonitorsCount", element).empty();
          $("#monitorsCountToday", element).removeClass("zero-monitors");
          $("#monitorsCountToday", element).empty();
        }
        //TODO: Remove this and use a singular function.
        //Possibly create some sort of QMDashboard handler
        function GetFilterArraysLocal() {
          let returnArraysObject = {
            ProjectId: [],
            LocationId: [],
            GroupId: [],
            TeamId: [],
            UserId: [],
          };
          let projectId = legacyContainer.scope.filters.Project;
          let locationId = legacyContainer.scope.filters.Location;
          let groupId = legacyContainer.scope.filters.Group;
          let teamId = legacyContainer.scope.filters.Team;

          if (projectId == "all" || projectId == "each" || projectId == "") {
            returnArraysObject.ProjectId.push(0);
          } else if (projectId.indexOf(",") > 0) {
            projectId.split(",").forEach((i) => {
              returnArraysObject.ProjectId.push(parseInt(i));
            });
          } else {
            returnArraysObject.ProjectId.push(parseInt(projectId));
          }
          if (locationId == "all" || locationId == "each" || locationId == "") {
            returnArraysObject.LocationId.push(0);
          } else if (locationId.indexOf(",") > 0) {
            //returnArraysObject.LocationId = locationId.split(",");
            locationId.split(",").forEach((i) => {
              returnArraysObject.LocationId.push(parseInt(i));
            });
          } else {
            returnArraysObject.LocationId.push(parseInt(locationId));
          }
          if (groupId == "all" || groupId == "each" || groupId == "") {
            returnArraysObject.GroupId.push(0);
          } else if (groupId.indexOf(",") > 0) {
            //returnArraysObject.GroupId = groupId.split(",");
            groupId.split(",").forEach((i) => {
              returnArraysObject.GroupId.push(parseInt(i));
            });
          } else {
            returnArraysObject.GroupId.push(parseInt(groupId));
          }
          if (teamId == "all" || teamId == "each" || teamId == "") {
            returnArraysObject.TeamId.push(0);
          } else if (teamId.indexOf(",") > 0) {
            //returnArraysObject.TeamId = teamId.split(",");
            teamId.split(",").forEach((i) => {
              returnArraysObject.TeamId.push(parseInt(i));
            });
          } else {
            returnArraysObject.TeamId.push(parseInt(teamId));
          }
          return returnArraysObject;
        }
        /* Utility Functions END */
        /* Show/Hide START */
        function HideAll() {}
        /* Show/Hide END */

        scope.load = function () {
          Initialize();
          LoadDirective();
        };

        ko.postbox.subscribe("autoQaRefresh", function (dataObjects) {
          initialData.length = 0;
          LoadDirective();
        });
        ko.postbox.subscribe("autoQaLoad", function (dataObjects) {
          initialData.length = 0;

          scope.load();
        });
        ko.postbox.subscribe(
          "qmDashboardLoadData",
          function (dataStatsObjects) {
            initialData.length = 0;
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
