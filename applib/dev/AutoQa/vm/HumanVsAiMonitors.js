angularApp.directive("ngHumanVsAiMonitors", [
  "api",
  "$rootScope",
  function (api, $rootScope) {
    return {
      templateUrl:
        a$.debugPrefix() +
        "/applib/dev/AutoQa/view/HumanVsAiMonitors.htm?" +
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
        const AI_UserId = "AI.System";
        let initialData = [];
        //AI_USERNAME_LIST
        let aiUserList = [AI_UserId];
        SetAiUserList(aiUserList);
        let cachedRenderedObjects = {
          projects: [],
          locations: [],
          groups: [],
          teams: [],
          userProfiles: [],
        };
        let evaluatorUserIdList = [];
        /* Page Level data information START */

        /* Page Level data information END */
        /* Event Handling START */
        $("#btnRefreshHumanVsAI", element)
          .off("click")
          .on("click", function () {
            LoadHumanVsAiInformation(null, true);
          });
        /* Event Handling END */
        function Initialize() {
          $(".directive-information-loading-image", element).prop(
            "src",
            `${a$.debugPrefix()}/applib/css/images/acuity-loading.gif`
          );
          HideAll();
          SetDatePickers();
          RenderDirectiveFooter();
          StartLookupDataLoad();
        }
        function SetDatePickers() {}
        function SetAiUserList(arrayListToFill) {
          appLib.getConfigParameterByName("AI_USERNAME_LIST", function (param) {
            let uidArray = param.ParamValue.split(",");
            uidArray.forEach((uid) => {
              if (
                arrayListToFill.findIndex(
                  (i) => i.toLowerCase() == uid.toLowerCase()
                ) < 0
              ) {
                arrayListToFill.push(uid);
              }
            });
          });
        }
        /* Data Loading START */
        function StartLookupDataLoad() {
          //load the user profiles
          a$.ajax({
            type: "POST",
            service: "C#",
            async: true,
            data: {
              lib: "selfserve",
              cmd: "getAllProfiles",
              deepLoad: false,
            },
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: function (data) {
              let returnData = JSON.parse(data.allProfilesList);
              returnData.forEach(function (di) {
                cachedRenderedObjects.userProfiles.push(di);
              });
            },
          });
        }
        function LoadDirective() {
          HideAll();
          LoadHumanVsAiInformation();
        }
        function LoadHumanVsAiInformation(callback, forceReload) {
          ShowLoadingMessage();
          GetHumanVsAiInformation(function (data) {
            RenderHumanVsAiInformation(function () {
              HideLoadingMessage();
              if (callback != null) {
                callback();
              }
            }, data);
          }, forceReload);
        }

        /* Data Loading END */
        /* Data Pulls START */
        function GetHumanVsAiInformation(callback, forceReload) {
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
            if (legacyContainer.scope.filters != null) {
              startDate = legacyContainer.scope.filters.StartDate;
              endDate = legacyContainer.scope.filters.EndDate;
              projectId = legacyContainer.scope.filters.Project;
              locationId = legacyContainer.scope.filters.Location;
              groupId = legacyContainer.scope.filters.Group;
              teamId = legacyContainer.scope.filters.Team;
              userId = legacyContainer.scope.filters.CSR;
            }
            a$.ajax({
              type: "POST",
              service: "C#",
              async: true,
              data: {
                lib: "selfserve",
                //cmd: "getAutoQaDashboardData",
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
                //let returnData = JSON.parse(data.autoQaDashboardData);
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
        function RenderHumanVsAiInformation(callback, dataToRender) {
          if (dataToRender == null) {
            dataToRender = initialData;
          }
          RenderHumanVsAiChart(null, dataToRender);
          RenderHumanVsAiScoring(null, dataToRender);
          if (callback != null) {
            callback();
          }
        }
        function RenderHumanVsAiChart(callback, dataForRendering) {
          if (dataForRendering == null) {
            dataForRendering = initialData;
          }

          let filtersObject = GetFilterArrays();

          let overallDataObject = dataForRendering.find(
            (i) =>
              filtersObject.ProjectId.includes(i.ProjectId) &&
              filtersObject.LocationId.includes(i.LocationId) &&
              filtersObject.GroupId.includes(i.GroupId) &&
              filtersObject.TeamId.includes(i.TeamId) &&
              (i.UserId == "" || i.UserId == null || i.UserId == 0)
          );
          //let overallDataObject = dataForRendering.find((i) => i.ProjectId <= 0 && i.LocationId <= 0 && i.GroupId <= 0 && i.TeamId <= 0 && (i.UserId == 0 || i.UserId == null || i.UserId == ""));
          //let humanDataObjectList = dataForRendering.filter((i) => i.ProjectId <= 0 && i.LocationId <= 0 && i.GroupId <= 0 && i.TeamId <= 0 && i.UserId != "" && aiUserList.findIndex(x => x == i.UserId) < 0);
          let humanDataObjectList = dataForRendering.filter(
            (i) =>
              filtersObject.ProjectId.includes(i.ProjectId) &&
              filtersObject.LocationId.includes(i.LocationId) &&
              filtersObject.GroupId.includes(i.GroupId) &&
              filtersObject.TeamId.includes(i.TeamId) &&
              //i.UserId != "" &&
              aiUserList.findIndex((x) => x == i.UserId) < 0
          );
          let humanSeries = [];
          humanDataObjectList.forEach((humanScore) => {
            humanSeries.push({
              name:
                GetUserProfileObject(humanScore.UserId)?.UserFullName ||
                humanScore.UserId,
              color: "var(--human-color)",
              y: humanScore?.UserEnteredMonitorCount || 0,
            });
          });
          let aiSeries = [];
          aiSeries.push({
            name: "AI",
            color: "var(--ai-color)",
            y: overallDataObject?.AiEnteredMonitorCount || 0,
          });

          let combinedData = aiSeries.concat(humanSeries);

          let seriesData = [
            {
              name: "",
              data: combinedData,
            },
          ];
          let chartDef = {};
          chartDef.chart = new Object();
          chartDef.chart.type = "pie";
          chartDef.title = new Object();
          chartDef.title.text = "";
          chartDef.series = seriesData;
          chartDef.legend = new Object();
          chartDef.legend.layout = "vertical";
          chartDef.legend.align = "right";
          chartDef.legend.verticalAlign = "middle";
          chartDef.legend.floating = false;
          chartDef.plotOptions = new Object();
          chartDef.plotOptions.series = new Object();
          chartDef.plotOptions.series.allowPointSelect = true;
          chartDef.plotOptions.series.dataLabels = new Object();
          chartDef.plotOptions.series.dataLabels.enabled = true;
          chartDef.plotOptions.series.dataLabels.distance = 20;
          chartDef.plotOptions.series.dataLabels.format = "{point.name}";
          chartDef.credits = new Object();
          chartDef.credits.enabled = false;
          Highcharts.chart(`humanVsAiChart`, chartDef);

          if (callback != null) {
            callback();
          }
        }
        function RenderHumanVsAiScoring(callback, dataForRendering) {
          if (dataForRendering == null) {
            dataForRendering = initialData;
          }
          let filtersObject = GetFilterArrays();

          //  let overallDataObject = dataForRendering.find(
          //    (i) =>
          //      i.ProjectId <= 0 &&
          //      i.LocationId <= 0 &&
          //      i.GroupId <= 0 &&
          //      i.TeamId <= 0 &&
          //      (i.UserId == 0 || i.UserId == null || i.UserId == "")
          //  );
          let overallDataObject = dataForRendering.find(
            (i) =>
              filtersObject.ProjectId.includes(i.ProjectId) &&
              filtersObject.LocationId.includes(i.LocationId) &&
              filtersObject.GroupId.includes(i.GroupId) &&
              filtersObject.TeamId.includes(i.TeamId) &&
              (i.UserId == "" || i.UserId == null || i.UserId == 0)
          );

          let nonAiEntryUserNames = FindAllNonAiUsers(dataForRendering);

          // let humanDataFiltered = FilterDataForComparison(dataForRendering, "human");
          // let aiDataFiltered = FilterDataForComparison(dataForRendering, "ai");

          // let humanAverageScore = GetAverageScore(humanDataFiltered);
          // let aiAverageScore = GetAverageScore(aiDataFiltered);
          let humanEvalutorCount = nonAiEntryUserNames.length;
          $("#humanVsAiScoringList", element).empty();
          let humanScoringRow = $(`<div class="human-v-ai-scoring-row" />`);
          humanScoringRow.append(
            $(
              `<div class="human-v-ai-stats-item scorer-type">Team Members (${humanEvalutorCount})</div>`
            )
          );
          humanScoringRow.append(
            $(
              `<div class="human-v-ai-stats-item score">${
                overallDataObject?.UserEnteredAverageScore?.toFixed(2) || 0.0
              }%</div>`
            )
          );
          humanScoringRow.append(
            $(
              `<div class="human-v-ai-stats-item monitor-count">${
                overallDataObject?.UserEnteredMonitorCount || 0
              }</div>`
            )
          );

          // humanScoringRow.append($(`<div class="human-v-ai-stats-item scorer-type">Human (${evaluatorUserIdList.length})</div>`));
          // humanScoringRow.append($(`<div class="human-v-ai-stats-item score">${humanAverageScore.toFixed(2)}%</div>`));
          // humanScoringRow.append($(`<div class="human-v-ai-stats-item monitor-count">${humanDataFiltered.length}</div>`));
          // let humanFilterButtonHolder = $(`<div class="human-v-ai-stats-item plus-minus" />`);
          // humanFilterButtonHolder.append("&nbsp;");
          // // let humanFilterButton = $(`<button id="btnHandleFilter_Human" filterOption="human" class="button btn filter-button"><i class="fa fa-filter"></i></button>`);
          // // humanFilterButton.on("click", function(){
          // //    let filterOption = $(this).attr("filterOption");
          // //    ApplyFilterButtonClicked(null, filterOption);
          // // });
          // // humanFilterButtonHolder.append(humanFilterButton);
          // humanScoringRow.append(humanFilterButtonHolder);

          let aiScoringRow = $(`<div class="human-v-ai-scoring-row" />`);
          aiScoringRow.append(
            $(`<div class="human-v-ai-stats-item scorer-type">AI</div>`)
          );
          aiScoringRow.append(
            $(
              `<div class="human-v-ai-stats-item score">${
                overallDataObject?.AiEnteredAverageScore?.toFixed(2) || 0.0
              }%</div>`
            )
          );
          aiScoringRow.append(
            $(
              `<div class="human-v-ai-stats-item monitor-count">${
                overallDataObject?.AiEnteredMonitorCount || 0
              }</div>`
            )
          );

          // aiScoringRow.append($(`<div class="human-v-ai-stats-item scorer-type">AI</div>`));
          // aiScoringRow.append($(`<div class="human-v-ai-stats-item score">${aiAverageScore.toFixed(2)}%</div>`));
          // aiScoringRow.append($(`<div class="human-v-ai-stats-item monitor-count">${aiDataFiltered.length}</div>`));
          // let aiFilterButtonHolder = $(`<div class="human-v-ai-stats-item plus-minus" />`);
          // aiFilterButtonHolder.append("&nbsp;");
          // aiScoringRow.append(aiFilterButtonHolder);

          $("#humanVsAiScoringList", element).append(humanScoringRow);
          $("#humanVsAiScoringList", element).append(aiScoringRow);

          $("#lblTotalMonitors", element).text(
            overallDataObject?.TotalMonitors || 0
          );
          //$("#lblTotalMonitors", element).text(initialData.length);

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
        /* Sorting Options START */
        /* Sorting Options END */
        /* Utility Functions START */
        function GetUserProfileObject(userId) {
          let userObject = cachedRenderedObjects.userProfiles.find(
            (i) => i.UserId == userId
          );
          if (userObject == null) {
            a$.ajax({
              type: "POST",
              service: "C#",
              async: false,
              data: {
                lib: "selfserve",
                cmd: "getUserProfile",
                userid: userId,
                deepLoad: false,
              },
              dataType: "json",
              cache: false,
              error: a$.ajaxerror,
              success: function (data) {
                let returnData = JSON.parse(data.userFullProfile);
                userObject = returnData;
                cachedRenderedObjects.userProfiles.push(returnData);
                return returnData;
              },
            });
          }
          return userObject;
        }
        function FindAllNonAiUsers(listToFilter) {
          if (listToFilter == null) {
            listToFilter = initialData;
          }

          let returnList = [];
          listToFilter.forEach((item) => {
            if (
              item.UserId != null &&
              item.UserId != "" &&
              item.UserId != 0 &&
              returnList.findIndex((i) => i == item.UserId) < 0 &&
              aiUserList.findIndex((i) => i == item.UserId) < 0
            ) {
              returnList.push(item.UserId);
            }
          });

          return returnList;
        }
        /* Utility Functions END */
        /* Show/Hide START */
        function HideAll() {
          HideLoadingMessage();
        }
        function HideLoadingMessage() {
          $("#directiveLoading", element).hide();
        }
        function ShowLoadingMessage() {
          $("#directiveLoading", element).show();
        }

        /* Show/Hide END */

        scope.load = function () {
          Initialize();
          LoadDirective();
        };
        ko.postbox.subscribe("autoQaLoad", function (dataObjects) {
          initialData.length = 0;
          initialData = dataObjects;
          scope.load();
        });
        ko.postbox.subscribe("autoQaRefresh", function (dataObjects) {
          initialData.length = 0;
          initialData = dataObjects;
          LoadDirective();
        });
        ko.postbox.subscribe(
          "qmDashboardLoadData",
          function (dataStatsObjects) {
            initialData.length = 0;
            initialData = dataStatsObjects;
            scope.load();
          }
        );
        ko.postbox.subscribe("AutoQA_HumanVsAI_Load", function () {
          scope.load();
          //ko.postbox.publish("userPrizeWidgetLoadComplete");
        });
      },
    };
  },
]);
