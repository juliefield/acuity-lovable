angularApp.directive("ngUsageAnalyzerGraph", [
  "api",
  "$rootScope",
  function (api, $rootScope) {
    return {
      templateUrl: `${a$.debugPrefix()}/applib/dev/DataAnalysis/view/UsageAnalyzerGraph.htm?${Date.now()}`,
      scope: {
        assoc: "@",
        text: "@",
        details: "@",
        cid: "@",
        filters: "@",
        panel: "@",
        hidetopper: "@",
        toppertext: "@",
        itemtype: "@",
      },
      require: "^ngLegacyContainer",
      link: function (scope, element, attrs, legacyContainer) {
        //TODO: Remove this once we are inside of Acuity Framing.
        let today = new Date();
        let startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        let endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        //let startDate = new Date("1/1/2024");
        //let endDate = new Date("12/31/2024")
        //TODO: Setup some coloring information so that we can dynamically handle some colors within the system.
        /* Directive Variables START */
        let directiveParameters = {
          DataLoadType: "singular", //singular, dynamic
          DataLoadArea: "", //overall, CorpAdmin, management, groupLeader, teamLeader, qa, location,project,team, group
          ShowFilters: false, //true,false
          DisplayTitleText: null,
          DisplayScoring: true,
          LoggedInColor: ["#006600", "#4e53e7", "#bb8fce"], //TODO: Determine how we want to handle these colors
          NotLoggedInColor: ["#990000", "#da9f32", "#e67e22"],
        };
        let directiveData = {
          ChartDataLoadComplete: false,
          StatsDataLoadComplete: false,
          ChartData: [],
          StatsData: [],
          DetailData: [],
          UserLogData: [],
        };
        let lookupDataOptions = {
          Projects: [],
          Locations: [],
          UserProfiles: [],
          AreaLoadFilters: [
            {
              id: "groupLeader",
              RoleText: "Group Leader",
              DisplayText: "Group Leaders",
            },
            {
              id: "teamLeader",
              RoleText: "Team Leader",
              DisplayText: "Team Leaders",
            },
            {
              id: "admin",
              RoleText: "CorpAdmin",
              DisplayText: "Administrators",
            },
            {
              id: "qa",
              RoleText: "Quality Assurance",
              DisplayText: "Quality Assurance",
            },
            { id: "management", RoleText: "Management" },
          ],
        };
        HideAll();
        SetDirectiveParameters(attrs);
        let loadingUrl =
          a$.debugPrefix() + "/applib/css/images/acuity-loading.gif";
        let defaultUserAvatar =
          a$.debugPrefix() + "/jq/avatars/empty_headshot.png";
        /* Directive Variables END */
        /* Directive Events START */
        //$(".loading-image", element).prop("src", loadingUrl);
        $(".btn-close", element)
          .off("click")
          .on("click", function () {
            console.log("Close button clicked.  Do something.");
            HideDetailPopup();
          });
        $(".btn-close-user-log", element)
          .off("click")
          .on("click", function () {
            console.log("User Log Close button clicked.  Do something.");
            HideUserLogPopup();
          });
        /* Directive Events END */
        function Initalize() {
          HideAll();
          CreateDisplayAreas();
          HandleDirectiveParameters();
        }
        function SetDirectiveParameters(attrs) {
          if (attrs.dataLoadType != null || attrs.dataloadtype != null) {
            directiveParameters.DataLoadType =
              attrs.dataLoadType || attrs.dataloadtype;
          }
          if (attrs.dataLoadArea != null || attrs.dataloadarea != null) {
            directiveParameters.DataLoadArea =
              attrs.dataLoadArea || attrs.dataloadarea;
            SetDisplayTypeFilter();
          }
          if (attrs.displayScoring != null || attrs.displayscoring != null) {
            let displayVal = attrs.displayScoring || attrs.displayscoring || "";
            directiveParameters.DisplayScoring =
              displayVal.toLowerCase() == "on".toLowerCase() ||
              displayVal.toLowerCase() == "true".toLowerCase() ||
              displayVal.toLowerCase() == "yes".toLowerCase();
          }
          if (attrs.showFilters != null || attrs.showfilters != null) {
            directiveParameters.ShowFilters =
              attrs.showFilters || attrs.showfilters;
          } else {
            directiveParameters.ShowFilters =
              directiveParameters.DataLoadType.toLowerCase() ==
              "dynamic".toLowerCase();
          }
          let displayTitle = directiveParameters.DataLoadArea || "";
          if (
            attrs.displayTitleText != null ||
            attrs.displaytitletext != null
          ) {
            displayTitle = attrs.displayTitleText || attrs.displaytitletext;
          }

          directiveParameters.DisplayTitleText = displayTitle;
        }
        /* Directive Specific Functions START */
        function HandleDirectiveParameters(callback) {
          let showTitle = false;
          if (directiveParameters.ShowFilters == true) {
            ShowDirectiveFilters();
          } else {
            HideDirectiveFilters();
          }
          if (
            directiveParameters.DataLoadType.toLowerCase() ==
            "dynamic".toLowerCase()
          ) {
            let areaToLoad = $("#directiveFilterDataArea", element).val();
            directiveParameters.ShowFilters = true;
            ShowDirectiveFilters();
            if (areaToLoad != null && areaToLoad != "") {
              directiveParameters.DataLoadArea = areaToLoad;
            }
            showTitle = false;
          }
          if (showTitle == true) {
            RenderDirectiveTitle();
          }
          if (callback != null) {
            callback();
          }
        }
        function CreateDisplayAreas(callback) {
          $("#directiveDataArea", element).empty();
          CreateChartArea();
          CreateTrendArea();
          CreateStatsArea();
          CreateUserMessagingArea();
          if (callback != null) {
            callback();
          }
        }
        function CreateDynamicChartArea(callback, renderToId) {
          let loadArea = directiveParameters.DataLoadArea || null;
          let optionList = [];
          if (loadArea != null) {
            switch (loadArea.toLowerCase()) {
              case "project".toLowerCase():
                optionList = lookupDataOptions.Projects;
                break;
              case "location".toLowerCase():
                optionList = lookupDataOptions.Locations;
                break;
            }
            optionList.forEach(function (listItem) {
              let chartAreaHolder = $(
                `<div class="chart-area-holder dynamic-chart-holder" id="chartArea_${directiveParameters.DataLoadArea}_${listItem.Id}" />`
              );
              let chartDisplayHolder = $(
                `<div class="chart-display-holder dynamic-chart" id="chartDisplayHolder_${directiveParameters.DataLoadArea}_${listItem.Id}" />`
              );
              chartAreaHolder.append(chartDisplayHolder);
              $(`#${renderToId}`, element).append(chartAreaHolder);
            });
          } else {
            //TODO: Determine how we handle not having information to load here.
            //Currently we will just log to the console
            console.info(
              `No dynamic data list found for load area ${directiveParameters.DataLoadArea}. [TODO] Determine message.`
            );
          }
          if (callback != null) {
            callback();
          }
        }
        function CreateSingleChartArea(callback, renderToId, itemId) {
          let chartAreaHolder = $(
            `<div class="chart-area-holder" id="chartArea_${directiveParameters.DataLoadArea}_${itemId}" />`
          );
          let chartDisplayHolder = $(
            `<div class="chart-display-holder" id="chartDisplayHolder_${directiveParameters.DataLoadArea}_${itemId}" />`
          );
          chartAreaHolder.append(chartDisplayHolder);
          $(`#${renderToId}`, element).append(chartAreaHolder);
          if (callback != null) {
            callback();
          }
        }
        function CreateChartArea(callback, renderToId, itemId, isDynamicChart) {
          if (renderToId == null || renderToId == "") {
            renderToId = "directiveDataArea";
          }
          if (itemId == null || itemId == "") {
            itemId = directiveParameters.DataLoadArea;
          }
          if (isDynamicChart == null) {
            isDynamicChart =
              directiveParameters.DataLoadType.toLowerCase() ==
                "dynamic".toLowerCase() || false;
          }
          if (isDynamicChart == true) {
            CreateDynamicChartArea(null, renderToId);
          } else {
            CreateSingleChartArea(null, renderToId, itemId);
          }

          if (callback != null) {
            callback();
          }
        }
        function CreateDynamicStatsArea(callback, renderToId) {
          let loadArea = directiveParameters.DataLoadArea || null;
          if (renderToId == null || renderToId == "") {
            renderToId = "directiveDataArea";
          }
          let optionList = [];
          if (loadArea != null) {
            switch (loadArea.toLowerCase()) {
              case "project".toLowerCase():
                optionList = lookupDataOptions.Projects;
                break;
              case "location".toLowerCase():
                optionList = lookupDataOptions.Locations;
                break;
            }
            optionList.forEach(function (listItem) {
              let optionRenderTo = $(
                `[id='chartArea_${loadArea}_${listItem.Id}']`
              );
              let statsAreaHolder = $(
                `<div class="stats-area-holder" id="statsArea_${directiveParameters.DataLoadArea}_${listItem.Id}" />`
              );
              let statsDisplayHolder = $(
                `<div class="stats-display-holder" id="statsDisplayHolder_${directiveParameters.DataLoadArea}_${listItem.Id}" />`
              );
              let statsDisplayHeader = $(
                `<div class="stats-display-header" id="statsDisplayHeaderHolder_${directiveParameters.DataLoadArea}_${listItem.Id}" />`
              );
              //let headerText = `${directiveParameters.DataLoadArea} - ${listItem.Name}` || null;
              let headerText = `${listItem.Name}` || null;
              let itemScoringText = "Balanced Score"; //TODO: Make more dynamic
              statsDisplayHeader.append(`${itemScoringText} - ${headerText}`);

              RenderLoggedSection(statsDisplayHolder, listItem.Id);
              RenderNotLoggedSection(statsDisplayHolder, listItem.Id);

              statsAreaHolder.append(statsDisplayHolder);
              $(optionRenderTo, $(`#${renderToId}`, element)).append(
                statsAreaHolder
              );
            });
          }
          HideAllStatsArea();
          if (callback != null) {
            callback();
          }
        }
        function CreateSingleStatsArea(callback, renderToId, itemId) {
          let statsAreaHolder = $(
            `<div class="stats-area-holder" id="statsArea_${directiveParameters.DataLoadArea}_${itemId}" />`
          );
          let statsDisplayHolder = $(
            `<div class="stats-display-holder" id="statsDisplayHolder_${directiveParameters.DataLoadArea}_${itemId}" />`
          );
          let statsDisplayHeader = $(
            `<div class="stats-display-header" id="statsDisplayHeaderHolder_${directiveParameters.DataLoadArea}_${itemId}" />`
          );
          let headerText =
            `${directiveParameters.DataLoadArea} - ${itemId}` || null;
          statsDisplayHeader.append(`Balanced Score - ${headerText}`); //TODO: Make more dynamic
          RenderLoggedSection(statsDisplayHolder, itemId);
          RenderNotLoggedSection(statsDisplayHolder, itemId);

          statsAreaHolder.append(statsDisplayHolder);

          +$(`#${renderToId}`, element).append(statsAreaHolder);
          HideAllStatsArea();
          if (callback != null) {
            callback();
          }
        }
        function CreateStatsArea(callback, renderToId, itemId, isDynamicChart) {
          if (directiveParameters.DisplayScoring == false) {
            directiveData.StatDataLoadComplete = true;
          } else {
            if (renderToId == null || renderToId == "") {
              renderToId = "directiveDataArea";
            }
            if (itemId == null || itemId == "") {
              itemId = directiveParameters.DataLoadArea;
            }
            if (isDynamicChart == null) {
              isDynamicChart =
                directiveParameters.DataLoadType.toLowerCase() ==
                  "dynamic".toLowerCase() || false;
            }
            if (isDynamicChart == true) {
              CreateDynamicStatsArea(null, renderToId);
            } else {
              CreateSingleStatsArea(null, renderToId, itemId);
            }
          }
          if (callback != null) {
            callback();
          }
        }
        function CreateDynamicUserMessagingArea(callback, renderToId) {
          if (renderToId == null || renderToId == "") {
            renderToId = "directiveDataArea";
          }
          let loadArea = directiveParameters.DataLoadArea || null;
          let optionList = [];
          if (loadArea != null) {
            switch (loadArea.toLowerCase()) {
              case "project".toLowerCase():
                optionList = lookupDataOptions.Projects;
                break;
              case "location".toLowerCase():
                optionList = lookupDataOptions.Locations;
                break;
            }
            optionList.forEach(function (listItem) {
              let optionRenderTo = $(
                `[id='chartArea_${directiveParameters.DataLoadArea}_${listItem.Id}']`
              );
              let chartLoadingDisplayHolder = $(
                `<div class="chart-loading-message-holder" id="chartLoadingDisplayMessageHolder_${directiveParameters.DataLoadArea}_${listItem.Id}" />`
              );
              let chartLoadingDisplayImage = $(
                `<img src="${loadingUrl}" class="chart-loading-message-image" alt="loading chart" />`
              );
              chartLoadingDisplayHolder.append(chartLoadingDisplayImage);
              $(optionRenderTo, $(`#${renderToId}`, element)).append(
                chartLoadingDisplayHolder
              );
            });
          }
          if (callback != null) {
            callback();
          }
        }
        function CreateSingleUserMessagingArea(callback, renderToId, itemId) {
          let chartLoadingDisplayHolder = $(
            `<div class="chart-loading-message-holder" id="chartLoadingDisplayMessageHolder_${directiveParameters.DataLoadArea}_${itemId}" />`
          );
          let chartLoadingDisplayImage = $(
            `<img src="${loadingUrl}" class="chart-loading-message-image" alt="loading chart" />`
          );
          chartLoadingDisplayHolder.append(chartLoadingDisplayImage);

          $(`#${renderToId}`, element).append(chartLoadingDisplayHolder);
        }
        function CreateUserMessagingArea(
          callback,
          renderToId,
          itemId,
          isDynamicChart
        ) {
          if (renderToId == null || renderToId == "") {
            renderToId = "directiveDataArea";
          }
          if (itemId == null || itemId == "") {
            itemId = directiveParameters.DataLoadArea;
          }
          if (isDynamicChart == null) {
            isDynamicChart =
              directiveParameters.DataLoadType.toLowerCase() ==
                "dynamic".toLowerCase() || false;
          }
          if (isDynamicChart == true) {
            CreateDynamicUserMessagingArea(null, renderToId);
          } else {
            CreateSingleUserMessagingArea(null, renderToId, itemId);
          }
          if (callback != null) {
            callback();
          }
        }
        function CreateTrendArea(callback, renderToId, itemId, isDynamicChart) {
          if (renderToId == null || renderToId == "") {
            renderToId = "directiveDataArea";
          }
          if (itemId == null || itemId == "") {
            itemId = directiveParameters.DataLoadArea;
          }
          if (isDynamicChart == null) {
            isDynamicChart =
              directiveParameters.DataLoadType.toLowerCase() ==
                "dynamic".toLowerCase() || false;
          }
          if (isDynamicChart == true) {
            CreateDynamicTrendArea(null, renderToId);
          } else {
            CreateSingleTrendArea(null, renderToId, itemId);
          }
          if (callback != null) {
            callback();
          }
        }
        function CreateDynamicTrendArea(callback, renderToId) {
          let loadArea = directiveParameters.DataLoadArea || null;
          let optionList = [];
          if (loadArea != null) {
            switch (loadArea.toLowerCase()) {
              case "project".toLowerCase():
                optionList = lookupDataOptions.Projects;
                break;
              case "location".toLowerCase():
                optionList = lookupDataOptions.Locations;
                break;
            }
            optionList.forEach(function (listItem) {
              let optionRenderTo = $(
                `[id='chartArea_${loadArea}_${listItem.Id}']`
              );
              let trendOptionSectionHolder = $(
                `<div class="trend-display-option-section-holder" id="trendOptionDisplay_${loadArea}_${listItem.Id}" />`
              );
              let trendButton = $(
                `<button class="button btn btn-large trend-button" id="showTrend_${loadArea}_${listItem.Id}"><i class="fa fa-arrow-trend-up"></i></button>`
              );
              trendButton.on("click", function () {
                let buttonId = this.id;
                let loadArea = buttonId.split("_")[1];
                let id = buttonId.split("_")[2];
                console.log("Trend Button Clicked.", buttonId);
                alert(`[NYI]: Show Trend information. ${loadArea} : ${id}`);
              });
              trendOptionSectionHolder.append(trendButton);

              $(optionRenderTo, $(`#${renderToId}`, element)).append(
                trendOptionSectionHolder
              );
            });
          } else {
            //TODO: Determine how we handle not having information to load here.
            //Currently we will just log to the console
            console.info(
              `No dynamic data list found for load area ${directiveParameters.DataLoadArea}. [TODO] Determine message.`
            );
          }
          if (callback != null) {
            callback();
          }
        }
        function CreateSingleTrendArea(callback, renderToId, itemId) {
          let trendOptionSectionHolder = $(
            `<div class="trend-display-option-section-holder" id="trendOptionDisplay_${directiveParameters.DataLoadArea}_${itemId}" />`
          );
          let trendButton = $(
            `<button class="button btn btn-large trend-button" id="showTrend_${directiveParameters.DataLoadArea}_${itemId}"><i class="fa fa-arrow-trend-up"></i></button>`
          );
          trendButton.on("click", function () {
            let buttonId = this.id;
            let loadArea = buttonId.split("_")[1];
            let id = buttonId.split("_")[2];
            console.log("Trend Button Clicked.", buttonId);
            alert(`[NYI]: Show Trend information. ${loadArea} : ${id}`);
          });
          trendOptionSectionHolder.append(trendButton);

          $(`#${renderToId}`, element).append(trendOptionSectionHolder);
          if (callback != null) {
            callback();
          }
        }
        /* Directive Specific Functions END */
        /* Directive Rendering Functions START */
        function RenderChartData(callback, renderToId, itemId, dataToRender) {
          let isDynamicChart =
            directiveParameters.DataLoadType.toLowerCase() ==
              "dynamic".toLowerCase() || false;
          let dataLoadArea = directiveParameters.DataLoadArea;
          let titleText = itemId;
          if (isDynamicChart == true) {
            let lookupObject = null;
            switch (dataLoadArea.toLowerCase()) {
              case "location".toLowerCase():
                lookupObject = lookupDataOptions.Locations.find(
                  (i) => i.Id == itemId
                );
                break;
              case "project".toLowerCase():
                lookupObject = lookupDataOptions.Projects.find(
                  (i) => i.Id == itemId
                );
                break;
            }
            if (lookupObject != null) {
              titleText = lookupObject.Name || "";
            }
          }
          if (dataLoadArea.toLowerCase() == "project".toLowerCase()) {
            RenderStackedBarChartData(
              function () {
                if (callback != null) {
                  callback();
                }
              },
              renderToId,
              dataToRender,
              isDynamicChart,
              titleText
            );
          } else {
            RenderPieChartData(
              function () {
                if (callback != null) {
                  callback();
                }
              },
              renderToId,
              dataToRender,
              isDynamicChart,
              titleText
            );
          }
        }
        function RenderStatsData(callback, renderToId, itemId, dataToRender) {
          if (dataToRender == null) {
            dataToRender = directiveData.StatsData.find(
              (i) =>
                i.Type.toLowerCase() ==
                directiveParameters.DataLoadArea.toLowerCase()
            );
          }
          if (dataToRender != null && dataToRender.length > 0) {
            let loggedScore = 0;
            let notLoggedScore = 0;
            let loggedData = dataToRender.find(
              (x) => x.ScoreArea.toLowerCase() == "Logged".toLowerCase()
            );
            let notLoggedData = dataToRender.find(
              (x) => x.ScoreArea.toLowerCase() == "Not Logged".toLowerCase()
            );

            loggedScore = loggedData?.ScoreValue || 0;
            notLoggedScore = notLoggedData?.ScoreValue || 0;

            let bigValue = loggedScore || 0;
            let littleValue = notLoggedScore || 0;
            if (notLoggedScore < loggedScore) {
              bigValue = notLoggedScore;
              littleValue = loggedScore;
            }
            let diffScore = 0;
            if (littleValue != 0) {
              diffScore =
                parseFloat(
                  (bigValue * 1.0 - littleValue * 1.0) /
                    Math.abs(littleValue * 1.0)
                ) * 100.0;
            } else {
              diffScore =
                parseFloat(bigValue * 1.0 - littleValue * 1.0) * 100.0;
            }
            diffScore = diffScore.toFixed(0);
            // if (loggedScore < 0 && notLoggedScore < 0)
            // {
            //   diffScore = parseFloat(((loggedScore * 1.0) - (notLoggedScore * 1.0)) / Math.abs((notLoggedScore * 1.0))) * 100.00;
            // }
            // else if(loggedScore != 0)
            // {
            //   diffScore = parseFloat(((notLoggedScore * 1.0) - (loggedScore * 1.0)) / Math.abs((loggedScore * 1.0))) * 100.00;
            // }
            //Logged info
            if (loggedData != null) {
              $(
                `#statsDisplayLoggedScoreText_${directiveParameters.DataLoadArea}_${itemId}`,
                $(`#${renderToId}`, element)
              ).empty();
              $(
                `#statsDisplayLoggedScoreText_${directiveParameters.DataLoadArea}_${itemId}`,
                $(`#${renderToId}`, element)
              ).append(`${loggedScore.toFixed(4)}`);
              if (loggedScore > notLoggedScore) {
                $(
                  `#statsDisplayLoggedScoreText_${directiveParameters.DataLoadArea}_${itemId}`,
                  $(`#${renderToId}`, element)
                ).append(
                  ` <span class="highlight-diff"> +${Math.abs(
                    diffScore
                  )}%</span> `
                );
              }
              $(
                `#statsDisplayLoggedUserCountText_${directiveParameters.DataLoadArea}_${itemId}`,
                $(`#${renderToId}`, element)
              ).empty();
              $(
                `#statsDisplayLoggedUserCountText_${directiveParameters.DataLoadArea}_${itemId}`,
                $(`#${renderToId}`, element)
              ).append(`${loggedData.TotalUsers} agents`);
            }
            //not Logged info
            if (notLoggedData != null) {
              $(
                `#statsDisplayNotLoggedScoreText_${directiveParameters.DataLoadArea}_${itemId}`,
                $(`#${renderToId}`, element)
              ).empty();
              $(
                `#statsDisplayNotLoggedScoreText_${directiveParameters.DataLoadArea}_${itemId}`,
                $(`#${renderToId}`, element)
              ).append(`${notLoggedScore.toFixed(4)}`);
              if (loggedScore < notLoggedScore) {
                $(
                  `#statsDisplayNotLoggedScoreText_${directiveParameters.DataLoadArea}_${itemId}`,
                  $(`#${renderToId}`, element)
                ).append(
                  ` <span class="highlight-diff"> +${Math.abs(
                    diffScore
                  )}%</span> `
                );
              }
              $(
                `#statsDisplayNotLoggedUserCountText_${directiveParameters.DataLoadArea}_${itemId}`,
                $(`#${renderToId}`, element)
              ).empty();
              $(
                `#statsDisplayNotLoggedUserCountText_${directiveParameters.DataLoadArea}_${itemId}`,
                $(`#${renderToId}`, element)
              ).append(`${notLoggedData.TotalUsers} agents`);
            }
          }
          if (callback != null) {
            callback();
          }
        }
        function RenderDetailData(
          callback,
          dataFilterId,
          listToRender,
          detailType
        ) {
          if (listToRender == null) {
            listToRender = directiveData.DetailData.find(
              (x) =>
                x.Type.toLowerCase() ==
                  directiveParameters.DataLoadArea.toLowerCase() &&
                x.DataItemId == dataFilterId
            );
          }
          $("#usageDetailList", element).empty();
          $("#usageDetailHeaderInfo", element).empty();
          let detailHeaderTextHolder = $(
            `<div class="usage-analyzer-usage-detail-header-holder" />`
          );
          let detailHeaderText = GetDetailHeaderText(
            directiveParameters.DataLoadArea,
            dataFilterId,
            detailType
          );

          detailHeaderTextHolder.append(detailHeaderText);
          $("#usageDetailHeaderInfo", element).append(detailHeaderTextHolder);

          let userListHolder = $(
            `<div class="usage-analyzer-user-list-holder" />`
          );
          let recordCounter = 1;

          listToRender.forEach(function (item) {
            let userRowHolder = $(
              `<div class="usage-analyzer-user-row-holder" />`
            );

            let recordNumberHolder = $(
              `<div class="usage-analyzer-user-data-item-holder record-number" />`
            );
            let userNameHolder = $(
              `<div class="usage-analyzer-user-data-item-holder user-name" />`
            );
            let userStatusHolder = $(
              `<div class="usage-analyzer-user-data-item-holder user-status" />`
            );
            let balancedScoreHolder = $(
              `<div class="usage-analyzer-user-data-item-holder user-balanced-score" />`
            );
            recordNumberHolder.append(recordCounter);

            let userAvatarFile = defaultUserAvatar;
            let userDisplayInfo = item.UserId;
            let userProfileObject = item.UserIdSource;
            let userStatus = "--";

            if (userProfileObject == null) {
              userProfileObject = lookupDataOptions.UserProfiles.find(
                (u) => u.UserId == item.UserId
              );
            }
            if (userProfileObject != null) {
              userAvatarFile =
                a$.debugPrefix() +
                  "/jq/avatars/" +
                  userProfileObject.AvatarImageFileName || defaultUserAvatar;
              userDisplayInfo = `${userProfileObject.UserFullName}`;
              userStatus = GetUserStatusTextFromId(
                userProfileObject.UserStatus
              );

              userRowHolder.addClass(
                `${userStatus.replace("-", "").toLowerCase()}-userrow`
              );

              if (
                userProfileObject.UserStatus == "2" &&
                userProfileObject.InactiveDate != null &&
                userProfileObject.InactiveDate != ""
              ) {
                userStatus += ` (${new Date(
                  userProfileObject.InactiveDate
                ).toLocaleDateString()})`;
              }
            }
            let userAvatarImage = $(
              `<img src="${userAvatarFile}" class="user-avatar-small" />`
            );
            userNameHolder.append(userAvatarImage);

            userNameHolder.append(userDisplayInfo);

            userStatusHolder.append(userStatus);

            let userScore = item.Score || "--";
            balancedScoreHolder.append(userScore);

            userRowHolder.append(recordNumberHolder);
            userRowHolder.append(userNameHolder);
            userRowHolder.append(balancedScoreHolder);
            userRowHolder.append(userStatusHolder);

            userListHolder.append(userRowHolder);

            recordCounter++;
          });
          $("#usageDetailList", element).append(userListHolder);

          if (callback != null) {
            callback();
          }
        }
        function RenderLoggedSection(renderToObject, itemId) {
          let loggedDisplayStatsHolder = $(
            `<div class="stats-display-holder logged-info" id="statsDisplayLogged_${directiveParameters.DataLoadArea}_${itemId}" />`
          );
          let loggedDisplayText = $(
            `<div class="stats-display-holder logged-info-header"/>`
          );
          loggedDisplayText.append("Logged");

          let loggedScoreHolder = $(
            `<div class="stats-display-holder logged-info-score-holder" id="statsDisplayLoggedScore_${directiveParameters.DataLoadArea}_${itemId}" />`
          );
          let loggedDisplayScore = $(
            `<div class="stats-display-holder logged-info-score" id="statsDisplayLoggedScoreText_${directiveParameters.DataLoadArea}_${itemId}" />`
          );
          let overallScore = "--";
          loggedDisplayScore.append(overallScore);

          let loggedUserCountHolder = $(
            `<div class="stats-display-holder logged-info-user-holder" id="statsDisplayLoggedUserCount_${directiveParameters.DataLoadArea}_${itemId}" />`
          );
          let loggedUserCount = $(
            `<div class="stats-display-holder logged-info-user-count" id="statsDisplayLoggedUserCountText_${directiveParameters.DataLoadArea}_${itemId}" />`
          );
          let userCount = 0;
          loggedUserCount.append(`${userCount} agents`);

          loggedScoreHolder.append(loggedDisplayScore);
          loggedUserCountHolder.append(loggedUserCount);

          //loggedUserCountHolder.on("click", function(){
          loggedDisplayStatsHolder.on("click", function () {
            let itemId = this.id;
            let filterValue = itemId.split("_")[2];
            ShowChartLoadingImage();
            GetDetailData(
              function (detailList) {
                RenderDetailData(
                  function () {
                    HideChartLoadingImage();
                    ShowDetailPopup();
                  },
                  filterValue,
                  detailList,
                  "Logged"
                );
              },
              filterValue,
              "Logged"
            );
          });

          loggedDisplayStatsHolder.append(loggedDisplayText);
          loggedDisplayStatsHolder.append(loggedScoreHolder);
          loggedDisplayStatsHolder.append(loggedUserCountHolder);

          $(renderToObject).append(loggedDisplayStatsHolder);
        }
        function RenderNotLoggedSection(renderToObject, itemId) {
          let notLoggedDisplayStatsHolder = $(
            `<div class="stats-display-holder not-logged-info" id="statsDisplayNotLogged_${directiveParameters.DataLoadArea}_${itemId}" />`
          );
          let notLoggedDisplayText = $(
            `<div class="stats-display-holder not-logged-info-header"/>`
          );
          notLoggedDisplayText.append("Not Logged");

          let notLoggedScoreHolder = $(
            `<div class="stats-display-holder not-logged-info-score-holder" id="statsDisplayNotLoggedScore_${directiveParameters.DataLoadArea}_${itemId}" />`
          );
          let notLoggedDisplayScore = $(
            `<div class="stats-display-holder not-logged-info-score" id="statsDisplayNotLoggedScoreText_${directiveParameters.DataLoadArea}_${itemId}" />`
          );
          let overallScore = "--";
          notLoggedDisplayScore.append(overallScore);

          let notLoggedUserCountHolder = $(
            `<div class="stats-display-holder not-logged-info-user-holder" id="statsDisplayNotLoggedUserCount_${directiveParameters.DataLoadArea}_${itemId}" />`
          );
          let notLoggedUserCount = $(
            `<div class="stats-display-holder not-logged-info-user-count" id="statsDisplayNotLoggedUserCountText_${directiveParameters.DataLoadArea}_${itemId}" />`
          );
          let userCount = 0;
          notLoggedUserCount.append(`${userCount} agents`);
          notLoggedScoreHolder.append(notLoggedDisplayScore);
          notLoggedUserCountHolder.append(notLoggedUserCount);

          //notLoggedUserCountHolder.on("click", function(){
          notLoggedDisplayStatsHolder.on("click", function () {
            let itemId = this.id;
            let filterValue = itemId.split("_")[2];
            ShowChartLoadingImage();
            GetDetailData(
              function (detailList) {
                RenderDetailData(
                  function () {
                    HideChartLoadingImage();
                    ShowDetailPopup();
                  },
                  filterValue,
                  detailList,
                  "NotLogged"
                );
              },
              filterValue,
              "NotLogged"
            );
          });

          notLoggedDisplayStatsHolder.append(notLoggedDisplayText);
          notLoggedDisplayStatsHolder.append(notLoggedScoreHolder);
          notLoggedDisplayStatsHolder.append(notLoggedUserCountHolder);

          $(renderToObject).append(notLoggedDisplayStatsHolder);
        }
        function RenderUserLoggedDetailData(
          callback,
          listToRender,
          chartHolderDomElementId
        ) {
          let displayInfoArray = chartHolderDomElementId.split("_");
          if (listToRender == null) {
            listToRender = directiveData.UserLogData.find(
              (i) =>
                i.Type.toLowerCase() == displayInfoArray[1].toLowerCase() &&
                i.DataItemId.toLowerCase() == displayInfoArrayp[2].toLowerCase()
            );
          }

          $("#userLogStatusList", element).empty();
          let counter = 1;
          let userLogStatusListHolder = $(
            `<div class="user-log-status-detail-list-holder" />`
          );

          listToRender.forEach(function (dataItem) {
            let userLogRowHolder = $(
              `<div class="user-log-status-user-log-row" id="userLogRow_${displayInfoArray[1].toLowerCase()}_${
                dataItem.UserId
              }" />`
            );

            let userCountHolder = $(
              `<div class="user-log-status-user-log-item-holder record-number" />`
            );
            let userNameHolder = $(
              `<div class="user-log-status-user-log-item-holder user-name" />`
            );
            let userRoleHolder = $(
              `<div class="user-log-status-user-log-item-holder user-role" />`
            );
            let lastLoginDateHolder = $(
              `<div class="user-log-status-user-log-item-holder user-last-login" />`
            );
            let userStatusHolder = $(
              `<div class="user-log-status-user-log-item-holder user-status" />`
            );

            userCountHolder.append(counter);
            let userDisplayInfo = dataItem.UserId;
            let userRole = "";
            let lastLoginDate = "";
            let userStatus = "--";
            let userProfileObject = dataItem.UserIdSource;
            let userAvatarFile = defaultUserAvatar;

            if (userProfileObject == null) {
              userProfileObject = lookupDataOptions.UserProfiles.find(
                (u) => u.UserId == dataItem.UserId
              );
            }
            if (userProfileObject != null) {
              userAvatarFile =
                a$.debugPrefix() +
                  "/jq/avatars/" +
                  userProfileObject.AvatarImageFileName || defaultUserAvatar;
              userDisplayInfo = `${userProfileObject.UserFullName}`;
              userStatus = GetUserStatusTextFromId(
                userProfileObject.UserStatus
              );
              userRole = userProfileObject.UserRole;
              if (
                userProfileObject.CurrentLoginDate != null &&
                userProfileObject.CurrentLoginDate != ""
              ) {
                lastLoginDate = new Date(
                  userProfileObject.CurrentLoginDate
                ).toLocaleDateString();
              }

              userLogRowHolder.addClass(
                `${userStatus.replace("-", "").toLowerCase()}-userrow`
              );

              if (
                userProfileObject.UserStatus == "2" &&
                userProfileObject.InactiveDate != null &&
                userProfileObject.InactiveDate != ""
              ) {
                userStatus += ` (${new Date(
                  userProfileObject.InactiveDate
                ).toLocaleDateString()})`;
              }
            }
            let userAvatarImage = $(
              `<img src="${userAvatarFile}" class="user-avatar-small" />`
            );
            userNameHolder.append(userAvatarImage);

            userNameHolder.append(userDisplayInfo);
            userRoleHolder.append(userRole);
            lastLoginDateHolder.append(lastLoginDate);
            userStatusHolder.append(userStatus);

            userLogRowHolder.append(userCountHolder);
            userLogRowHolder.append(userNameHolder);
            userLogRowHolder.append(userRoleHolder);
            userLogRowHolder.append(lastLoginDateHolder);
            userLogRowHolder.append(userStatusHolder);

            userLogStatusListHolder.append(userLogRowHolder);

            counter++;
          });

          //$("#userLogStatusList", element).append("Render the user data here. Coming soon&trade;");
          $("#userLogStatusList", element).append(userLogStatusListHolder);
          if (callback != null) {
            callback();
          }
        }
        function RenderUserLogPopupHeaderText(callback, highchartDataPoint) {
          $("#userLogStatusDetailHeaderInfo", element).empty();
          let headerText = "Usage Log Status";
          if (
            highchartDataPoint != null &&
            highchartDataPoint.dataVal != null
          ) {
            let dataOptionsArray = highchartDataPoint.dataVal?.split("_");
            if (dataOptionsArray.length > 0) {
              headerText = GetDetailHeaderText(
                dataOptionsArray[1],
                dataOptionsArray[2],
                highchartDataPoint.dataFilterText
              );
            }
          }
          $("#userLogStatusDetailHeaderInfo", element).append(
            `<h3>${headerText}</h3>`
          );
          if (callback != null) {
            callback();
          }
        }
        /* Directive Rendering Functions END */
        /* Chart Rendering START */
        function RenderPieChartData(
          callback,
          renderToObject,
          chartData,
          isDynamicChart,
          titleText
        ) {
          let loggedInCount = 0;
          let notLoggedInCount = 0;
          if (chartData != null) {
            let logInfoObject = null;
            if (isDynamicChart == true) {
              let id = renderToObject.split("_")[2];
              logInfoObject = chartData.find((i) => i.AreaId == id);
            } else {
              if (
                directiveParameters.DataLoadArea.toLowerCase() !=
                "overall".toLowerCase()
              ) {
                let lookupRoleHandlingObject =
                  lookupDataOptions.AreaLoadFilters.find(
                    (i) =>
                      i.id.toLowerCase() ==
                      directiveParameters.DataLoadArea.toLowerCase()
                  );
                let lookupText = directiveParameters.DataLoadArea;
                if (lookupRoleHandlingObject != null) {
                  lookupText = lookupRoleHandlingObject.RoleText;
                }
                logInfoObject = chartData.find(
                  (i) => i.AreaToLoad.toLowerCase() == lookupText.toLowerCase()
                );
              } else {
                logInfoObject = chartData[0];
              }
            }
            loggedInCount = logInfoObject?.LoggedInCount || 0;
            notLoggedInCount = logInfoObject?.NotLoggedInCount || 0;
          }
          let seriesData = [
            {
              name: "Logged",
              type: "pie",
              data: [
                {
                  name: "Logged in",
                  y: loggedInCount,
                  color: directiveParameters.LoggedInColor[1],
                  dataVal: renderToObject,
                  dataFilterText: "Logged",
                },
                {
                  //name: "Not Logged In",
                  name: "Did not log in",
                  y: notLoggedInCount,
                  color: directiveParameters.NotLoggedInColor[2],
                  dataVal: renderToObject,
                  dataFilterText: "Not Logged",
                },
              ],
              events: {
                click: function (event) {
                  RenderUserLogPopupHeaderText(null, event.point);
                  ShowUserLogPopup();
                  ShowUserLogLoading();
                  GetUserLoggedDetailData(
                    function (loggedDataList) {
                      RenderUserLoggedDetailData(
                        function () {
                          HideUserLogLoading();
                        },
                        loggedDataList,
                        event.point.dataVal
                      );
                    },
                    null,
                    event.point.dataFilterText,
                    event.point
                  );
                },
              },
            },
          ];

          let chartTitle = `${directiveParameters.DisplayTitleText} Usage`;
          if (isDynamicChart == true) {
            //chartTitle = `Agent Usage - ${titleText}`;
            chartTitle = `${titleText}`;
          }
          let chartDefinition = new Object();
          chartDefinition.chart = new Object();
          chartDefinition.title = new Object();
          chartDefinition.xAxis = new Object();
          chartDefinition.yAxis = new Object();
          chartDefinition.credits = new Object();
          chartDefinition.plotOptions = new Object();

          if (directiveParameters.DisplayScoring == false) {
            seriesData[0].type = "pie";
            seriesData[0].innerSize = "50%";
            seriesData[0].data[
              seriesData[0].data.findIndex((i) => i.name == "Logged in")
            ].color = directiveParameters.LoggedInColor[1];
            seriesData[0].data[
              seriesData[0].data.findIndex((i) => i.name == "Did not log in")
            ].color = directiveParameters.NotLoggedInColor[2];
            // seriesData[0].data[seriesData[0].data.findIndex(i => i.name == "Logged In")].color = directiveParameters.LoggedInColor[1];
            // seriesData[0].data[seriesData[0].data.findIndex(i => i.name == "Not Logged In")].color = directiveParameters.NotLoggedInColor[1];
            chartDefinition.plotOptions.pie = new Object();
            chartDefinition.plotOptions.pie.startAngle = -90;
            chartDefinition.plotOptions.pie.endAngle = 90;
            chartDefinition.plotOptions.pie.center = ["50%", "75%"];
            chartDefinition.plotOptions.pie.size = "110%";
          }
          chartDefinition.chart.type = "pie";
          chartDefinition.title.enabled = false;
          chartDefinition.credits.enabled = false;

          chartDefinition.title.text = chartTitle;
          chartDefinition.series = seriesData;

          Highcharts.chart(renderToObject, chartDefinition);

          if (callback != null) {
            callback();
          }
        }
        function RenderStackedBarChartData(
          callback,
          renderToObject,
          chartData,
          isDynamicChart,
          titleText
        ) {
          let loggedInCount = 0;
          let notLoggedInCount = 0;
          if (chartData != null) {
            let logInfoObject = null;
            if (isDynamicChart == true) {
              let id = renderToObject.split("_")[2];
              logInfoObject = chartData.find((i) => i.AreaId == id);
            } else {
              if (
                directiveParameters.DataLoadArea.toLowerCase() !=
                "overall".toLowerCase()
              ) {
                let lookupRoleHandlingObject =
                  lookupDataOptions.AreaLoadFilters.find(
                    (i) =>
                      i.id.toLowerCase() ==
                      directiveParameters.DataLoadArea.toLowerCase()
                  );
                let lookupText = directiveParameters.DataLoadArea;
                if (lookupRoleHandlingObject != null) {
                  lookupText = lookupRoleHandlingObject.RoleText;
                }
                logInfoObject = chartData.find(
                  (i) => i.AreaToLoad.toLowerCase() == lookupText.toLowerCase()
                );
              } else {
                logInfoObject = chartData[0];
              }
            }
            loggedInCount = logInfoObject?.LoggedInCount || 0;
            notLoggedInCount = logInfoObject?.NotLoggedInCount || 0;
          }

          let seriesData = [
            {
              //name: "Not Logged In",
              name: "Did not log in",
              className: "usage-viewer-bar-chart-not-logged-count",
              data: [
                {
                  //name: "Not Logged In",
                  name: "Did not log in",
                  y: notLoggedInCount,
                  color:
                    directiveParameters.NotLoggedInColor[2] ||
                    "var(--table-labels)",
                  dataVal: renderToObject,
                  dataFilterText: "Not Logged",
                },
              ],
              events: {
                click: function (event) {
                  RenderUserLogPopupHeaderText(null, event.point);
                  ShowUserLogPopup();
                  ShowUserLogLoading();
                  GetUserLoggedDetailData(
                    function (loggedDataList) {
                      RenderUserLoggedDetailData(
                        function () {
                          HideUserLogLoading();
                        },
                        loggedDataList,
                        event.point.dataVal
                      );
                    },
                    null,
                    event.point.dataFilterText,
                    event.point
                  );
                },
              },
            },
            {
              name: "Logged in",
              className: "usage-viewer-bar-chart-logged-count",
              data: [
                {
                  name: "Logged in",
                  y: loggedInCount,
                  color:
                    directiveParameters.LoggedInColor[1] ||
                    "var(--bright-green)",
                  dataVal: renderToObject,
                  dataFilterText: "Logged",
                },
              ],
              events: {
                click: function (event) {
                  RenderUserLogPopupHeaderText(null, event.point);
                  ShowUserLogPopup();
                  ShowUserLogLoading();
                  GetUserLoggedDetailData(
                    function (loggedDataList) {
                      RenderUserLoggedDetailData(
                        function () {
                          HideUserLogLoading();
                        },
                        loggedDataList,
                        event.point.dataVal
                      );
                    },
                    null,
                    event.point.dataFilterText,
                    event.point
                  );
                },
              },
            },
          ];
          let chartTitle = `${directiveParameters.DisplayTitleText} Usage`;
          if (isDynamicChart == true) {
            chartTitle = `${titleText}`;
          }
          let chartDefinition = new Object();
          chartDefinition.chart = new Object();
          chartDefinition.title = new Object();
          chartDefinition.credits = new Object();
          chartDefinition.plotOptions = {
            series: {
              stacking: "normal",
              dataLabels: { enabled: true },
            },
          };

          chartDefinition.chart.type = "bar";
          chartDefinition.title.enabled = false;
          chartDefinition.credits.enabled = false;

          chartDefinition.title.text = chartTitle;
          chartDefinition.series = seriesData;
          chartDefinition.xAxis = {
            scrollbar: { enabled: true },
          };
          chartDefinition.yAxis = {
            scrollbar: { enabled: true },
          };
          chartDefinition.legend = {
            enabled: false,
          };

          Highcharts.chart(renderToObject, chartDefinition);

          if (callback != null) {
            callback();
          }
        }
        /* Chart Rendering END */
        /* Show/Hide START */
        function HideAll() {
          HideAllPopups();
          HideAllChartArea();
          HideAllStatsArea();
          //HideDirectiveFilters();
        }
        function HideAllPopups() {
          $(".display-form", element).hide();
        }
        function HideDetailPopup() {
          $("#usageDetailWithScoresForm", element).hide();
        }
        function ShowDetailPopup() {
          HideUserLogPopup();
          $("#usageDetailWithScoresForm", element).show();
        }
        function HideUserLogPopup() {
          $("#userLogStatusNoScoresForm", element).hide();
        }
        function ShowUserLogPopup() {
          HideDetailPopup();
          $("#userLogStatusNoScoresForm", element).show();
        }
        function HideAllChartArea() {
          $(
            `[id^='chartArea_${directiveParameters.DataLoadArea}']`,
            element
          ).hide();
        }
        function HideAllStatsArea() {
          $(
            `[id^='statsArea_${directiveParameters.DataLoadArea}']`,
            element
          ).hide();
        }
        function HideAllChartLoadingImages() {
          $(
            `[id^='chartLoadingDisplayMessageHolder_${directiveParameters.DataLoadArea}']`,
            element
          ).hide();
        }
        function HideChartArea(itemId) {
          $(
            `#chartArea_${directiveParameters.DataLoadArea}_${itemId}`,
            element
          ).hide();
        }
        function ShowChartArea(itemId) {
          $(
            `#chartArea_${directiveParameters.DataLoadArea}_${itemId}`,
            element
          ).show();
        }
        function HideStatsArea(itemId) {
          $(
            `#statsArea_${directiveParameters.DataLoadArea}_${itemId}`,
            element
          ).hide();
        }
        function ShowStatsArea(itemId) {
          $(
            `#statsArea_${directiveParameters.DataLoadArea}_${itemId}`,
            element
          ).show();
        }
        function HideChartLoadingImage(itemId) {
          if (
            directiveData.ChartDataLoadComplete == true &&
            directiveData.StatDataLoadComplete == true
          ) {
            $(
              `#chartLoadingDisplayMessageHolder_${directiveParameters.DataLoadArea}_${itemId}`,
              element
            ).hide();
          }
        }
        function ShowChartLoadingImage(itemId) {
          $(
            `#chartLoadingDisplayMessageHolder_${directiveParameters.DataLoadArea}_${itemId}`,
            element
          ).show();
        }
        function HideDirectiveFilters() {
          $("#directiveFilterHolder", element).hide();
        }
        function ShowDirectiveFilters() {
          $("#directiveFilterHolder", element).show();
        }
        function HideUserLogLoading() {
          $("#userLogDetailLoadingImage", element).hide();
        }
        function ShowUserLogLoading() {
          $("#userLogDetailLoadingImage", element).show();
        }
        /* Show/Hide END */
        /* Data Loading functions START */
        function LoadDirectiveData(callback, forceReload) {
          $(
            `[id^='chartLoadingDisplayMessageHolder_${directiveParameters.DataLoadArea}']`,
            element
          ).each(function () {
            let itemId = this.id.split("_")[2];
            let info = { area: directiveParameters.DataLoadArea, id: itemId };
            let chartRenderToId = `chartDisplayHolder_${directiveParameters.DataLoadArea}_${itemId}`;
            let statsRenderToId = `statsDisplayHolder_${directiveParameters.DataLoadArea}_${itemId}`;

            GetChartData(
              function (chartData) {
                let chartLoadEvent = new CustomEvent("chartDataLoaded", {
                  detail: info,
                });
                window.dispatchEvent(chartLoadEvent);
                RenderChartData(
                  function () {
                    ShowChartArea(itemId);
                  },
                  chartRenderToId,
                  itemId,
                  chartData
                );
              },
              forceReload,
              itemId
            );

            if (directiveParameters.DisplayScoring == true) {
              GetStatsData(
                function (statsData) {
                  let statLoadEvent = new CustomEvent("statDataLoaded", {
                    detail: info,
                  });
                  window.dispatchEvent(statLoadEvent);
                  RenderStatsData(
                    function () {
                      ShowStatsArea(itemId);
                    },
                    statsRenderToId,
                    itemId,
                    statsData
                  );
                },
                forceReload,
                itemId
              );
            } else {
              directiveData.StatDataLoadComplete = true;
            }
          });

          if (callback != null) {
            callback();
          }
        }
        function GetChartData(callback, forceReload, dataFilterId) {
          if (forceReload == null) {
            forceReload = false;
          }
          if (dataFilterId == null) {
            dataFilterId = "";
          }
          let dataLoadType = "Overall";
          switch (directiveParameters.DataLoadArea.toLowerCase()) {
            case "location".toLowerCase():
              dataLoadType = "ByLocation";
              break;
            case "project".toLowerCase():
              dataLoadType = "ByProject";
              break;
            case "admin".toLowerCase():
            case "management".toLowerCase():
            case "groupLeader".toLowerCase():
            case "teamLeader".toLowerCase():
            case "qa".toLowerCase():
              dataLoadType = "ByRole";
              break;
          }
          a$.ajax({
            type: "POST",
            service: "C#",
            async: true,
            data: {
              lib: "selfserve",
              cmd: "getUsageViewerStatsByDataType",
              dataTypeLoad: dataLoadType,
              startDate: new Date(startDate).toLocaleDateString(),
              endDate: new Date(endDate).toLocaleDateString(),
              areaType: dataLoadType,
              areaTypeId: dataFilterId,
              deepLoad: false,
            },
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: function (data) {
              let returnData = JSON.parse(data.usageViewerStatsList);
              if (dataLoadType.toLowerCase() == "ByRole".toLowerCase()) {
                let filterValue = directiveParameters.DataLoadArea;
                let dataOption = lookupDataOptions.AreaLoadFilters.find(
                  (i) => i.id.toLowerCase() == filterValue.toLowerCase()
                );
                if (dataOption != null) {
                  filterValue = dataOption.RoleText;
                }
                returnData = returnData.filter(
                  (i) => i.AreaToLoad.toLowerCase() == filterValue.toLowerCase()
                );
              }
              if (callback != null) {
                callback(returnData);
              } else {
                return returnData;
              }
            },
          });
        }
        function GetStatsData(callback, forceReload, dataFilterId) {
          if (forceReload == null) {
            forceReload = false;
          }
          let areaToLoad = "Overall";
          switch (directiveParameters.DataLoadArea.toLowerCase()) {
            case "location".toLowerCase():
              areaToLoad = "ByLocation";
              break;
            case "project".toLowerCase():
              areaToLoad = "ByProject";
              break;
            case "admin".toLowerCase():
            case "management".toLowerCase():
            case "groupLeader".toLowerCase():
            case "teamLeader".toLowerCase():
            case "qa".toLowerCase():
              areaToLoad = "ByRole";
              break;
          }
          a$.ajax({
            type: "POST",
            service: "C#",
            async: true,
            data: {
              lib: "selfserve",
              cmd: "getUsageViewerBalScoreHeaderStats",
              areaToLoad: areaToLoad,
              startDate: new Date(startDate).toLocaleDateString(),
              endDate: new Date(endDate).toLocaleDateString(),
              dataFilterId: dataFilterId,
              statType: "",
            },
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: function (data) {
              let returnData = JSON.parse(data.usageViewerHeaderStatsList);
              let dataInfo = new Object();
              dataInfo.Type = directiveParameters.DataLoadArea.toLowerCase();
              dataInfo.DataItemId =
                dataFilterId ||
                directiveParameters.DataLoadArea.toLowerCase() ||
                0;
              dataInfo.Data = [...returnData];
              let statsIndex = directiveData.StatsData.findIndex(
                (x) =>
                  x.Type == directiveParameters.DataLoadArea.toLowerCase() &&
                  x.DataItemId == dataFilterId
              );
              if (statsIndex >= 0) {
                directiveData.StatsData[statsIndex] = dataInfo;
              } else {
                directiveData.StatsData.push(dataInfo);
              }
              if (callback != null) {
                callback(returnData);
              } else {
                return returnData;
              }
            },
          });
        }
        function GetDetailData(callback, dataFilterId, statType) {
          if (statType == null) {
            statType = "All";
          }

          let areaToLoad = "Overall";
          switch (directiveParameters.DataLoadArea.toLowerCase()) {
            case "location".toLowerCase():
              areaToLoad = "ByLocation";
              break;
            case "project".toLowerCase():
              areaToLoad = "ByProject";
              break;
            case "admin".toLowerCase():
            case "management".toLowerCase():
            case "groupLeader".toLowerCase():
            case "teamLeader".toLowerCase():
            case "qa".toLowerCase():
              areaToLoad = "ByRole";
              break;
          }
          a$.ajax({
            type: "POST",
            service: "C#",
            async: true,
            data: {
              lib: "selfserve",
              cmd: "getUsageViewerBalScoreDetailStats",
              areaToLoad: areaToLoad,
              startDate: new Date(startDate).toLocaleDateString(),
              endDate: new Date(endDate).toLocaleDateString(),
              dataFilterId: dataFilterId,
              statType: statType,
            },
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: function (data) {
              let returnData = JSON.parse(data.usageViewerDetailStatsList);
              let dataInfo = new Object();
              dataInfo.Type = directiveParameters.DataLoadArea.toLowerCase();
              dataInfo.DataItemId =
                dataFilterId ||
                directiveParameters.DataLoadArea.toLowerCase() ||
                0;
              dataInfo.Data = [...returnData];
              let statsIndex = directiveData.DetailData.findIndex(
                (x) =>
                  x.Type == directiveParameters.DataLoadArea.toLowerCase() &&
                  x.DataItemId == dataFilterId
              );
              if (statsIndex >= 0) {
                directiveData.DetailData[statsIndex] = dataInfo;
              } else {
                directiveData.DetailData.push(dataInfo);
              }
              if (callback != null) {
                callback(returnData);
              } else {
                return returnData;
              }
            },
          });
        }
        function GetUserLoggedDetailData(
          callback,
          dataFilterId,
          statType,
          dataPoint
        ) {
          if (dataFilterId == null) {
            dataFilterId = "";
          }
          let valueInformation = dataPoint.dataVal;
          let valueArray = valueInformation.split("_");

          let dataLoadType = "Overall";
          switch (directiveParameters.DataLoadArea.toLowerCase()) {
            case "location".toLowerCase():
              dataLoadType = "ByLocation";
              dataFilterId = valueArray[2];
              break;
            case "project".toLowerCase():
              dataLoadType = "ByProject";
              dataFilterId = valueArray[2];
              break;
            case "admin".toLowerCase():
            case "management".toLowerCase():
            case "groupLeader".toLowerCase():
            case "teamLeader".toLowerCase():
            case "qa".toLowerCase():
              dataLoadType = "ByRole";
              dataFilterId = valueArray[2];
              break;
          }
          a$.ajax({
            type: "POST",
            service: "C#",
            async: true,
            data: {
              lib: "selfserve",
              cmd: "getUsageViewerUserLogStatusByDataType",
              dataTypeLoad: dataLoadType,
              startDate: new Date(startDate).toLocaleDateString(),
              endDate: new Date(endDate).toLocaleDateString(),
              areaType: dataLoadType,
              areaTypeId: dataFilterId,
              deepLoad: true,
            },
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: function (data) {
              let returnData = JSON.parse(
                data.usageViewerUserLogStatusDetailList
              );
              let filteredData = returnData.filter(
                (i) => i.LogType.toLowerCase() == statType.toLowerCase()
              );

              let dataInfo = new Object();
              dataInfo.Type = directiveParameters.DataLoadArea.toLowerCase();
              dataInfo.DataItemId =
                dataFilterId ||
                directiveParameters.DataLoadArea.toLowerCase() ||
                0;
              dataInfo.Data = [...filteredData];
              let statsIndex = directiveData.UserLogData.findIndex(
                (x) =>
                  x.Type == directiveParameters.DataLoadArea.toLowerCase() &&
                  x.DataItemId == dataFilterId
              );
              if (statsIndex >= 0) {
                directiveData.UserLogData[statsIndex] = dataInfo;
              } else {
                directiveData.UserLogData.push(dataInfo);
              }

              if (callback != null) {
                callback(filteredData);
              } else {
                return returnData;
              }
            },
          });
        }
        /* Data Loading functions END */
        /* Utility functions START */
        function SetDisplayTypeFilter(callback) {
          let filterValue =
            directiveParameters.DataLoadArea.toLowerCase() || "";
          $("#directiveFilterDataArea", element).val(filterValue);
          if (callback != null) {
            callback();
          }
        }
        function SetLookupOptions(lookupObjectList) {
          if (
            lookupObjectList.dataType != null &&
            lookupObjectList.dataType != ""
          ) {
            switch (lookupObjectList.dataType.toLowerCase()) {
              case "location".toLowerCase():
                lookupDataOptions.Locations.length = 0;
                lookupDataOptions.Locations = lookupObjectList.dataObjectsList;
                break;
              case "project".toLowerCase():
                lookupDataOptions.Projects.length = 0;
                lookupDataOptions.Projects = lookupObjectList.dataObjectsList;
                break;
              case "users".toLowerCase():
              case "userProfile".toLowerCase():
              case "userProfiles".toLowerCase():
                lookupDataOptions.UserProfiles.length = 0;
                lookupDataOptions.UserProfiles =
                  lookupObjectList.dataObjectsList;
                break;
            }
          }
        }
        function GetUserStatusTextFromId(statusId) {
          //TODO: Make this function use database information or make it global
          let returnValue = statusId;
          switch (statusId) {
            case "2":
              returnValue = "Inactive";
              break;
            case "7":
              returnValue = "In-Training";
              break;
            case "9":
              returnValue = "LOA";
              break;
            default:
              returnValue = "Active";
              break;
          }
          return returnValue;
        }
        function GetDetailHeaderText(dataAreaType, itemId, dataType) {
          let returnValue = "Logged";
          let dataItemName = "";

          let areaNameObject = lookupDataOptions.AreaLoadFilters.find(
            (i) => i.id.toLowerCase() == itemId.toLowerCase()
          );
          if (areaNameObject != null) {
            dataItemName =
              areaNameObject.DisplayText ||
              areaNameObject.RoleText ||
              areaNameObject.id;
          }
          if (dataType.toLowerCase() == "NotLogged".toLowerCase()) {
            dataType = "Not Logged";
          }
          returnValue = `${dataType}`;
          if (dataItemName != null && dataItemName != "") {
            returnValue = `${dataType} - ${dataItemName}`;
          }
          return returnValue;
        }
        /* Utility functions END */
        scope.load = function () {
          Initalize();
          LoadDirectiveData();
        };
        ko.postbox.subscribe("UsageAnalysisInit", function () {
          HideAll();
          Initalize();
        });
        ko.postbox.subscribe("UsageAnalysisLoad", function () {
          scope.load();
        });
        ko.postbox.subscribe("UsageAnalysisReload", function () {
          LoadDirectiveData(null, true);
        });
        ko.postbox.subscribe(
          "UsageAnalysis_LookupDataLoaded",
          function (dataLookupObjects) {
            HideAll();
            SetLookupOptions(dataLookupObjects);
            CreateDisplayAreas();
          }
        );
        window.addEventListener("chartDataLoaded", function (directiveInfo) {
          if (directiveInfo.detail.area == directiveParameters.DataLoadArea) {
            directiveData.ChartDataLoadComplete = true;
          }
          HideChartLoadingImage(directiveInfo.detail.id);
        });
        window.addEventListener("statDataLoaded", function (directiveInfo) {
          if (directiveInfo.detail.area == directiveParameters.DataLoadArea) {
            directiveData.StatDataLoadComplete = true;
          }
          HideChartLoadingImage(directiveInfo.detail.id);
        });
      },
    };
  },
]);
