angularApp.directive("ngUsageAnalyzerFull", [
  "api",
  "$rootScope",
  function (api, $rootScope) {
    return {
      templateUrl: `${a$.debugPrefix()}/applib/dev/DataAnalysis/view/UsageAnalyzerFull.htm?${Date.now()}`,
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
        let monthsToLoad = 12; //TODO: Turn this into something that we can handle.
        //TODO: Setup some coloring information so that we can dynamically handle some colors within the system.
        /* Directive Variables START */
        let directiveParameters = {
          DataLoadArea: "", //overall, CorpAdmin, management, groupLeader, teamLeader, qa, location,project,team, group
          DisplayTitleText: null,
          //DisplayScoring: true,
          LoggedInColor: ["#006600", "#4e53e7", "#bb8fce"], //TODO: Determine how we want to handle these colors
          NotLoggedInColor: ["#990000", "#da9f32", "#e67e22"],
          AvailableSections: {
            TrendChart: true,
            ScoringComparision: true,
            UserDetails: true,
          },
          ScoringPrecision: 2,
        };
        let directiveData = {
          ChartDataLoadComplete: false,
          StatsDataLoadComplete: false,
          ChartData: [],
          StatsData: [],
          DetailData: [],
          ShowAllUserFilteredOption: false,
          DataQualifierFilters: {
            ProjectIdList: "",
            LocationIdList: "",
            GroupIdList: "",
            TeamIdList: "",
          },
          //AllUserFilteredData: [],
        };
        let lookupDataOptions = {
          Projects: [],
          Locations: [],
          Groups: [],
          Teams: [],
          UserProfiles: [],
          AreaLoadFilters: [
            { id: "groupLeader", RoleText: "Group Leader" },
            { id: "teamLeader", RoleText: "Team Leader" },
            { id: "admin", RoleText: "CorpAdmin" },
            { id: "qa", RoleText: "Quality Assurance" },
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
        /* Directive Events END */
        function Initalize() {
          HideAll();
          CreateDisplayAreas();
        }
        function SetDirectiveParameters(attrs) {
          if (attrs.dataLoadArea != null || attrs.dataloadarea != null) {
            directiveParameters.DataLoadArea =
              attrs.dataLoadArea || attrs.dataloadarea;
          }
          let displayTitle = directiveParameters.DataLoadArea || "";
          if (
            attrs.displayTitleText != null ||
            attrs.displaytitletext != null
          ) {
            displayTitle = attrs.displayTitleText || attrs.displaytitletext;
          }
          SetScoringPrecisionForClient();
          directiveParameters.DisplayTitleText = displayTitle;
        }
        /* Directive Specific Functions START */
        function CreateDisplayAreas() {
          $("#usageAnalyzerDisplayList", element).empty();
          switch (directiveParameters.DataLoadArea.toLowerCase()) {
            case "location".toLowerCase():
              lookupDataOptions.Locations.forEach(function (loc) {
                let locationRenderToObject = $(
                  `<div id="locationListItemHolder_${loc.Id}" class="usage-analyzer-list-item-row-holder location-list-item" />`
                );
                CreateLoadingSection(null, locationRenderToObject, loc);
                CreateStatsSection(null, locationRenderToObject, loc);
                CreateTrendChartSection(null, locationRenderToObject, loc);
                CreateUserDetailSection(null, locationRenderToObject, loc);
                $("#usageAnalyzerDisplayList", element).append(
                  locationRenderToObject
                );
              });
              break;
            case "project".toLowerCase():
              lookupDataOptions.Projects.forEach(function (proj) {
                let projectRenderToObject = $(
                  `<div id="projectListItemHolder_${proj.Id}" class="usage-analyzer-list-item-row-holder project-list-item" />`
                );
                CreateLoadingSection(null, projectRenderToObject, proj);
                CreateStatsSection(null, projectRenderToObject, proj);
                CreateTrendChartSection(null, projectRenderToObject, proj);
                CreateUserDetailSection(null, projectRenderToObject, proj);
                $("#usageAnalyzerDisplayList", element).append(
                  projectRenderToObject
                );
              });
              break;
            case "group".toLowerCase():
              lookupDataOptions.Groups.forEach(function (grp) {
                let groupRenderToObject = $(
                  `<div id="groupListItemHolder_${grp.Id}" class="usage-analyzer-list-item-row-holder group-list-item" />`
                );
                CreateLoadingSection(null, groupRenderToObject, grp);
                CreateStatsSection(null, groupRenderToObject, grp);
                CreateTrendChartSection(null, groupRenderToObject, grp);
                CreateUserDetailSection(null, groupRenderToObject, grp);
                $("#usageAnalyzerDisplayList", element).append(
                  groupRenderToObject
                );
              });
              break;
            case "team".toLowerCase():
              lookupDataOptions.Teams.forEach(function (team) {
                let teamRenderToObject = $(
                  `<div id="teamListItemHolder_${team.Id}" class="usage-analyzer-list-item-row-holder team-list-item" />`
                );
                CreateLoadingSection(null, teamRenderToObject, team);
                CreateStatsSection(null, teamRenderToObject, team);
                CreateTrendChartSection(null, teamRenderToObject, team);
                CreateUserDetailSection(null, teamRenderToObject, team);
                $("#usageAnalyzerDisplayList", element).append(
                  teamRenderToObject
                );
              });
              break;
            default:
              let singularRenderToObject = $(
                `<div id="${directiveParameters.DataLoadArea.toLowerCase()}ListItemHolder_${directiveParameters.DataLoadArea.toLowerCase()}" class="usage-analyzer-list-item-row-holder ${directiveParameters.DataLoadArea.toLowerCase()}-list-item" />`
              );
              CreateLoadingSection(null, singularRenderToObject, null);
              CreateStatsSection(null, singularRenderToObject, null);
              CreateTrendChartSection(null, singularRenderToObject, null);
              CreateUserDetailSection(null, singularRenderToObject, null);
              $("#usageAnalyzerDisplayList", element).append(
                singularRenderToObject
              );
              // if (
              //   directiveParameters.DataLoadArea.toLowerCase() ==
              //   "overall-qualified"
              // ) {
              //   $("#usageAnalyzerDisplayList", element).hide();
              // }
              break;
          }
          HideAllUserDetailListingSections();
        }
        function LoadDirectiveData(callback, forceReload) {
          // if (
          //   directiveParameters.DataLoadArea.toLowerCase() ==
          //     "overall-qualified" &&
          //   (directiveData.DataQualifierFilters.ProjectIdList == null ||
          //     directiveData.DataQualifierFilters.ProjectIdList == "") &&
          //   (directiveData.DataQualifierFilters.LocationIdList == null ||
          //     directiveData.DataQualifierFilters.LocationIdList == "") &&
          //   (directiveData.DataQualifierFilters.GroupIdList == null ||
          //     directiveData.DataQualifierFilters.GroupIdList == "") &&
          //   (directiveData.DataQualifierFilters.TeamIdList == null ||
          //     directiveData.DataQualifierFilters.TeamIdList == "")
          // ) {
          //   $("#usageAnalyzerDisplayList", element).hide();
          // } else {
          //   $("#usageAnalyzerDisplayList", element).show();
          // }

          //handle trend chart data
          $(
            `[id^='dataItemTrendChartSection_${directiveParameters.DataLoadArea.toLowerCase()}_']`,
            element
          ).each(function () {
            let itemId = this.id.split("_")[2];
            let eventInfo = {
              area: directiveParameters.DataLoadArea,
              id: itemId,
              parentRenderItemId: this.id,
            };
            GetTrendChartData(
              function (chartDataList) {
                let trendChartLoadEvent = new CustomEvent(
                  "usageViewFull_ChartDataLoaded",
                  { detail: eventInfo }
                );
                window.dispatchEvent(trendChartLoadEvent);
                RenderTrendChart(
                  function () {
                    HideSectionLoadingImage(itemId);
                  },
                  chartDataList,
                  itemId
                );
              },
              forceReload,
              itemId
            );
          });
          $(
            `[id^='dataItemStatsSection_${directiveParameters.DataLoadArea.toLowerCase()}_']`,
            element
          ).each(function () {
            let itemId = this.id.split("_")[2];
            let eventInfo = {
              area: directiveParameters.DataLoadArea,
              id: itemId,
              parentRenderItemId: this.id,
            };
            GetStatsData(
              function (currentStatsObject) {
                let statChartLoadEvent = new CustomEvent(
                  "usageViewFull_StatDataLoaded",
                  { detail: eventInfo }
                );
                window.dispatchEvent(statChartLoadEvent);
                RenderStatsData(
                  function () {
                    HideSectionLoadingImage(itemId);
                  },
                  currentStatsObject,
                  itemId
                );
              },
              forceReload,
              itemId
            );
            //usageViewFull_StatDataLoaded [event]
          });
          if (callback != null) {
            callback();
          }
        }
        /* Directive Specific Functions END */
        /* Data Loading functions START */
        function GetStatsData(callback, forceReload, itemId) {
          if (forceReload == null) {
            forceReload = false;
          }
          let returnObject = null;
          let chartCommand = "";
          let dataQualifierFilters = GetFilterQualifiers();
          if (returnObject == null) {
            switch (directiveParameters.DataLoadArea.toLowerCase()) {
              case "location":
                chartCommand = "getCurrentStatsForLocation";
                break;
              case "project":
                chartCommand = "getUsageTrendForProject";
                break;
              case "group":
                chartCommand = "getUsageTrendForGroup";
                break;
              case "team":
                chartCommand = "getUsageTrendForTeam";
                break;
              case "overall":
                chartCommand = "getOverallUsageTrend";
                break;
              // case "overall-qualified":
              //   chartCommand = "getOverallUsageTrendQualified";
              //   break;
            }
            if (chartCommand != "") {
              a$.ajax({
                type: "POST",
                service: "C#",
                async: false,
                data: {
                  lib: "selfserve",
                  cmd: chartCommand,
                  startDate: new Date(startDate).toLocaleDateString(),
                  endDate: new Date(endDate).toLocaleDateString(),
                  monthsToLoad: 0,
                  areaToLoadId: itemId,
                  deepLoad: false,
                  dataQualifierFilters: JSON.stringify(dataQualifierFilters),
                },
                dataType: "json",
                cache: false,
                error: a$.ajaxerror,
                success: function (data) {
                  let returnData = null;
                  switch (directiveParameters.DataLoadArea.toLowerCase()) {
                    case "location":
                      returnData = JSON.parse(data.currentStatItem);
                      break;
                    default:
                      returnData = JSON.parse(data.usageTrendList)[0];
                      break;
                  }
                  directiveData.StatsData.length = 0;
                  directiveData.StatsData.push(returnData);
                  returnObject = returnData;
                },
              });
            } else {
              returnObject = [];
            }
          }
          if (callback != null) {
            callback(returnObject);
          } else {
            return returnObject;
          }
        }
        function GetTrendChartData(callback, forceReload, itemId) {
          let chartCommand = "";
          if (forceReload == null) {
            forceReload = false;
          }
          let dataQualifierFilters = GetFilterQualifiers();
          monthsToLoad = 12;
          let areaToLoad = itemId;
          switch (directiveParameters.DataLoadArea.toLowerCase()) {
            case "location":
              chartCommand = "getUsageTrendForLocation";
              break;
            case "project":
              chartCommand = "getUsageTrendForProject";
              break;
            case "group":
              chartCommand = "getUsageTrendForGroup";
              break;
            case "team":
              chartCommand = "getUsageTrendForTeam";
              break;
            case "overall":
              chartCommand = "getOverallUsageTrend";
              break;
            // case "overall-qualified":
            //   chartCommand = "getOverallUsageTrendQualified";
            //   areaToLoad = JSON.stringify(dataQualifierFilters);
            //   monthsToLoad = 12;
            //   break;
          }

          //TODO: Handle the lack of a forced reload...aka read from cached data if we have any.
          if (chartCommand != "") {
            a$.ajax({
              type: "POST",
              service: "C#",
              async: true,
              data: {
                lib: "selfserve",
                cmd: chartCommand,
                startDate: new Date(startDate).toLocaleDateString(),
                endDate: new Date(endDate).toLocaleDateString(),
                monthsToLoad: monthsToLoad,
                areaToLoadId: areaToLoad,
                deepLoad: false,
                dataQualifierFilters: JSON.stringify(dataQualifierFilters),
              },
              dataType: "json",
              cache: false,
              error: a$.ajaxerror,
              success: function (data) {
                let returnData = JSON.parse(data.usageTrendList);
                directiveData.ChartData.length = 0;
                directiveData.ChartData = [...returnData];
                if (callback != null) {
                  callback(returnData);
                } else {
                  return returnData;
                }
              },
            });
          } else {
            if (callback != null) {
              callback([]);
            } else {
              return [];
            }
          }
        }
        function GetUserDetailData(callback, forceReload, itemId, dataTypeId) {
          let areaToLoad = "Overall";
          switch (directiveParameters.DataLoadArea.toLowerCase()) {
            case "location":
              areaToLoad = "ByLocation";
              break;
            case "project":
              areaToLoad = "ByProject";
              break;
            case "group":
              areaToLoad = "ByGroup";
              break;
            case "team":
              areaToLoad = "ByTeam";
              break;
          }
          a$.ajax({
            type: "POST",
            service: "C#",
            async: true,
            data: {
              lib: "selfserve",
              cmd: "getUsageViewerBalScoreDetailStats",
              startDate: new Date(startDate).toLocaleDateString(),
              endDate: new Date(endDate).toLocaleDateString(),
              areaToLoad: areaToLoad,
              dataFilterId: itemId,
              statType: dataTypeId,
              deepLoad: false,
            },
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: function (data) {
              let returnData = JSON.parse(data.usageViewerDetailStatsList);
              let itemIndex = directiveData.DetailData.findIndex(
                (i) => i.DataType == dataTypeId
              );
              if (itemIndex > -1) {
                directiveData.DetailData[itemIndex].Data.length = 0;
                directiveData.DetailData[itemIndex].Data = [...returnData];
              } else {
                directiveData.DetailData.push({
                  DataType: dataTypeId,
                  Data: [...returnData],
                });
              }
              if (callback != null) {
                callback(returnData);
              } else {
                return returnData;
              }
            },
          });
        }
        /* Data Loading functions END */
        /* Directive Rendering Functions START */
        function CreateLoadingSection(
          callback,
          renderToObject,
          objectReferenceInfo
        ) {
          let currentItemId = directiveParameters.DataLoadArea.toLowerCase();
          let itemName = directiveParameters.DataLoadArea.toLowerCase();
          if (objectReferenceInfo != null) {
            currentItemId = objectReferenceInfo.Id;
            itemName = objectReferenceInfo.Name;
          }
          let itemLoadingSectionDisplayHolder = $(
            `<div id="dataItemLoadingSection_${directiveParameters.DataLoadArea.toLowerCase()}_${currentItemId}" class="loading-section-item-holder" />`
          );
          let itemLoadingImage = $(
            `<img src="${loadingUrl}" alt="Loading ${directiveParameters.DataLoadArea.toLowerCase()} ${itemName} Image" class="acuity-loading-data-image-small" />`
          );
          itemLoadingSectionDisplayHolder.append(itemLoadingImage);
          itemLoadingSectionDisplayHolder.append(`Loading Data...`);
          $(renderToObject).append(itemLoadingSectionDisplayHolder);

          if (callback != null) {
            callbacK();
          }
        }
        function CreateStatsSection(
          callback,
          renderToObject,
          objectReferenceInfo
        ) {
          let currentItemId = directiveParameters.DataLoadArea.toLowerCase();
          //let itemName = directiveParameters.DataLoadArea.toLowerCase();
          let itemName =
            directiveParameters.DisplayTitleText ||
            directiveParameters.DataLoadArea ||
            "-- STATS --";
          if (objectReferenceInfo != null) {
            currentItemId = objectReferenceInfo.Id;
            itemName = objectReferenceInfo.Name;
          }

          let itemStatsDetailSection = $(
            `<div id="dataItemStatsSection_${directiveParameters.DataLoadArea.toLowerCase()}_${currentItemId}" class="usage-analyzer-stats-section-holder ${directiveParameters.DataLoadArea.toLowerCase()}-stats-section" />`
          );

          $(renderToObject).append(itemStatsDetailSection);

          if (callback != null) {
            callbacK();
          }
        }
        function CreateTrendChartSection(
          callback,
          renderToObject,
          objectReferenceInfo
        ) {
          let currentItemId = directiveParameters.DataLoadArea.toLowerCase();
          if (objectReferenceInfo != null) {
            currentItemId = objectReferenceInfo.Id;
          }
          let itemTrendChartSectionHolder = $(
            `<div id="dataItemTrendChartSection_${directiveParameters.DataLoadArea.toLowerCase()}_${currentItemId}" class="usage-analyzer-chart-section-holder  ${directiveParameters.DataLoadArea.toLowerCase()}-chart-section" />`
          );
          $(renderToObject).append(itemTrendChartSectionHolder);
          if (callback != null) {
            callbacK();
          }
        }
        function CreateUserDetailSection(
          callback,
          renderToObject,
          objectReferenceInfo
        ) {
          let currentItemId = directiveParameters.DataLoadArea.toLowerCase();
          if (objectReferenceInfo != null) {
            currentItemId = objectReferenceInfo.Id;
          }
          let userDetailListSectionHolder = $(
            `<div id="dataItemUserDetailListSection_${directiveParameters.DataLoadArea.toLowerCase()}_${currentItemId}" class="usage-analyzer-user-detail-section-holder  ${directiveParameters.DataLoadArea.toLowerCase()}-detail-stats-section" />`
          );
          let userDetailListSectionHeader = $(
            `<div class="user-detail-user-list-table-section-header" />`
          );

          userDetailListSectionHeader.append(
            `<div id="dataItemUserDetailTitle_${directiveParameters.DataLoadArea.toLowerCase()}_${currentItemId}" class="usage-analyzer-user-title-holder" />`
          );

          let toggleButton = $(
            `<button id="toggleDisplayButton_${directiveParameters.DataLoadArea.toLowerCase()}_${currentItemId}" class="button btn btn-toggle"><i class="fa fa-close"></i></button>`
          );
          toggleButton.on("click", function () {
            let id = this.id;
            let itemId = id.split("_")[2];
            ToggleUserDetailListingSection(itemId);
          });

          let downloadButton = $(
            `<button id="downloadUsageListOption_${directiveParameters.DataLoadArea.toLowerCase()}_${currentItemId}" downloadType="${directiveParameters.DataLoadArea.toLowerCase()}" itemId="${currentItemId}" listType="" class="button btn btn-download-list"><i class="fa fa-download"></i></button>`
          );
          downloadButton.on("click", function () {
            let id = this.id; //button ID
            let downloadType = $(this).attr("downloadType"); //the type
            let itemId = $(this).attr("itemId"); //the id or "overall"
            let listType = $(this).attr("listType"); //logged/not logged
            DoFileDownload(
              function (filename) {
                alert(`Download of file ${filename} complete.`);
              },
              listType,
              itemId
            );
          });
          userDetailListSectionHeader.append(downloadButton);
          userDetailListSectionHeader.append(toggleButton);

          userDetailListSectionHolder.append(userDetailListSectionHeader);

          let userHeaderHolderRow = $(
            `<div id="dataItemUserDetailListHeader_${directiveParameters.DataLoadArea.toLowerCase()}_${currentItemId}" class="usage-analyzer-user-detail-header-item-row" />`
          );
          let userHeaderRecordCountColumn = $(
            `<div class="usage-analyzer-data-item header-item record-number">#</div>`
          );
          let userHeaderUserNameColumn = $(
            `<div class="usage-analyzer-data-item header-item user-name" id="detailColumnUserName_${directiveParameters.DataLoadArea.toLowerCase()}_${currentItemId}" sort="username" renderType="">User</div>`
          );
          let userHeaderUserRoleColumn = $(
            `<div class="usage-analyzer-data-item header-item user-role">Role</div>`
          );
          let userHeaderUserStatusColumn = $(
            `<div class="usage-analyzer-data-item header-item user-status">Status</div>`
          );
          let userHeaderUserScoreColumn = $(
            `<div class="usage-analyzer-data-item header-item user-score" id="detailColumnUserScore_${directiveParameters.DataLoadArea.toLowerCase()}_${currentItemId}" sort="score" renderType="">Score</div>`
          );

          userHeaderUserNameColumn.on("click", function () {
            let sortColumn = $(this).attr("sort");
            let renderType = $(this).attr("renderType");
            HandleDetailSortClick(this.id, sortColumn, renderType);
          });
          userHeaderUserScoreColumn.on("click", function () {
            let sortColumn = $(this).attr("sort");
            let renderType = $(this).attr("renderType");
            HandleDetailSortClick(this.id, sortColumn, renderType);
          });

          userHeaderHolderRow.append(userHeaderRecordCountColumn);
          userHeaderHolderRow.append(userHeaderUserNameColumn);
          userHeaderHolderRow.append(userHeaderUserRoleColumn);
          userHeaderHolderRow.append(userHeaderUserStatusColumn);
          userHeaderHolderRow.append(userHeaderUserScoreColumn);

          userDetailListSectionHolder.append(userHeaderHolderRow);

          let userDetailListHolder = $(
            `<div id="dataItemUserDetailList_${directiveParameters.DataLoadArea.toLowerCase()}_${currentItemId}" class="usage-analyzer-user-detail-list-section-holder" />`
          );
          userDetailListSectionHolder.append(userDetailListHolder);

          $(renderToObject).append(userDetailListSectionHolder);
          HideUserDetailListingSection(currentItemId);
          if (callback != null) {
            callbacK();
          }
        }
        function RenderStatsData(callback, objectToRender, itemId) {
          if (objectToRender == null) {
            objectToRender = GetStatsData(null, false, itemId);
          }
          let itemStatsDetailSection = $(
            `#dataItemStatsSection_${directiveParameters.DataLoadArea.toLowerCase()}_${itemId}`,
            element
          );
          itemStatsDetailSection.empty();
          let loggedPerformancePercent = 0;
          let loggedSection = $(
            `<div id="dataItemStatsLoggedSectionHolder_${directiveParameters.DataLoadArea.toLowerCase()}_${itemId}" class="logged-not-logged-data-holder logged-section-holder logged-not-logged-data-holder--positive" />`
          );
          let notLoggedSection = $(
            `<div id="dataItemStatsNotLoggedSectionHolder_${directiveParameters.DataLoadArea.toLowerCase()}_${itemId}" class="logged-not-logged-data-holder not-logged-section-holder" />`
          );
          let itemName =
            directiveParameters.DisplayTitleText ||
            directiveParameters.DataLoadArea ||
            "";
          let lookupObject = null;
          let assignedProjectName = "";
          let assignedLocationName = "";
          switch (directiveParameters.DataLoadArea.toLowerCase()) {
            case "location":
              lookupObject = lookupDataOptions.Locations.find(
                (i) => i.LocationId == itemId
              );
              break;
            case "project":
              lookupObject = lookupDataOptions.Projects.find(
                (i) => i.ProjectId == itemId
              );
              break;
            case "group":
              lookupObject = lookupDataOptions.Groups.find(
                (i) => i.GroupId == itemId
              );
              break;
            case "team":
              lookupObject = lookupDataOptions.Teams.find(
                (i) => i.TeamId == itemId
              );
              break;
            case "overall":
              itemName = "All Users";
              lookupObject = null;
              break;
          }
          if (lookupObject != null) {
            switch (directiveParameters.DataLoadArea.toLowerCase()) {
              case "location":
                itemName = lookupObject.Name?.trim();
                break;
              case "project":
                itemName = lookupObject.Name?.trim();
                break;
              case "group":
                {
                  let projectName =
                    lookupDataOptions.Projects.find(
                      (i) => i.ProjectId == lookupObject.ProjectId
                    )?.Name?.trim() || "";
                  let locationName =
                    lookupDataOptions.Locations.find(
                      (i) => i.LocationId == lookupObject.LocationId
                    )?.Name?.trim() || "";
                  itemName = lookupObject.Name?.trim();
                  if (projectName != null && projectName != "") {
                    itemName = `${lookupObject.Name} (${projectName})`;
                    //assignedProjectName = projectName;
                  }
                  if (locationName != null && locationName != "") {
                    assignedLocationName = locationName;
                  }
                }
                break;
              case "team":
                {
                  let projectName =
                    lookupDataOptions.Projects.find(
                      (i) => i.ProjectId == lookupObject.ProjectId
                    )?.Name?.trim() || "";
                  if (projectName != null && projectName != "") {
                    itemName = `${lookupObject.Name} (${projectName})`;
                    assignedProjectName = projectName;
                  }
                  let groupObject = lookupDataOptions.Groups.find(
                    (i) => i.GroupId == lookupObject.GroupId
                  );
                  assignedLocationName =
                    lookupDataOptions.Locations.find(
                      (i) => i.LocationId == groupObject?.LocationId
                    )?.Name?.trim() || "";
                  let groupName = groupObject?.Name?.trim() || "";
                  itemName = lookupObject.Name?.trim();
                  if (groupName != null && groupName != "") {
                    itemName = `${lookupObject.Name} (${groupName})`;
                  }
                }
                break;
            }
          }

          let itemAssignmentInformationHolder = $(
            `<div class="usage-analyzer-item-assignment-information-holder" id="itemAssignmentInformation_${directiveParameters.DataLoadArea.toLowerCase()}_${itemId}" />`
          );
          if (assignedProjectName != null && assignedProjectName != "") {
            let assignedProjectNameHolder = $(
              `<div class="usage-analyzer-assigned-item-holder project-name" />`
            );
            assignedProjectNameHolder.append(`Project: ${assignedProjectName}`);
            itemAssignmentInformationHolder.append(assignedProjectNameHolder);
          }
          if (assignedLocationName != null && assignedLocationName != "") {
            let assignedLocationNameHolder = $(
              `<div class="usage-analyzer-assigned-item-holder location-name" />`
            );
            assignedLocationNameHolder.append(
              `Location: ${assignedLocationName}`
            );
            itemAssignmentInformationHolder.append(assignedLocationNameHolder);
          }

          if (objectToRender != null) {
            loggedPerformancePercent =
              `+${objectToRender?.DifferenceScorePercentage?.toFixed(2)}%` || 0;
            if (objectToRender?.DifferenceScorePercentage < 0) {
              loggedPerformancePercent =
                `${objectToRender?.DifferenceScorePercentage?.toFixed(2)}%` ||
                0;
            }
            let loggedScore =
              objectToRender?.LoggedBalancedScore?.toFixed(
                directiveParameters.ScoringPrecision
              ) || 0;
            //let loggedAgentCount = objectToRender?.LoggedCount || 0;
            let loggedAgentCount =
              objectToRender?.AgentLoggedCount ||
              objectToRender?.LoggedCount ||
              0;
            let notLoggedScore =
              objectToRender?.NotLoggedBalancedScore?.toFixed(
                directiveParameters.ScoringPrecision
              ) || 0;
            let notLoggedAgentCount =
              objectToRender?.AgentNotLoggedCount ||
              objectToRender?.NotLoggedCount ||
              0;
            let totalAgentsCalc = loggedAgentCount + notLoggedAgentCount;

            let loggedAgentPct =
              totalAgentsCalc != 0
                ? parseFloat(loggedAgentCount / totalAgentsCalc) * 100
                : 0;
            let notLoggedAgentPct =
              totalAgentsCalc != 0
                ? parseFloat(notLoggedAgentCount / totalAgentsCalc) * 100
                : 0;
            // let notLoggedAgentCount = objectToRender?.NotLoggedCount || 0;
            // let loggedTotalUserCount = objectToRender.TotalUserCount || 0;
            //let notLoggedTotalUserCount = objectToRender.NotLoggedTotalUserCount || 0;

            loggedSection.append(
              `<div class="logged-not-logged-scoring-name-holder">Balanced Score</div>`
            );
            loggedSection.append(
              `<div class="logged-not-logged-score-holder">${loggedScore}</div>`
            );
            loggedSection.append(
              `<div class="logged-not-logged-header-holder">Logged in</div>`
            );
            loggedSection.append(
              `<div class="logged-not-logged-agent-count-holder">${loggedAgentCount} Agents</div>`
            );
            loggedSection.append(
              `<div class="logged-not-logged-agent-percentage-holder">${loggedAgentPct?.toFixed(
                1
              )}%</div>`
            );

            //loggedSection.append(`<div class="logged-not-logged-total-user-count-holder">${loggedTotalUserCount} Total Users</div>`);

            loggedSection.on("click", function () {
              let id = this.id;
              let itemId = id.split("_")[2];
              let dataLoadType = "Logged";
              GetUserDetailData(
                function (listToRender) {
                  RenderUserDetailData(
                    function (itemId) {
                      ShowUserDetailListingSection(itemId);
                    },
                    itemId,
                    dataLoadType,
                    listToRender
                  );
                },
                false,
                itemId,
                dataLoadType
              );
            });

            //notLoggedSection.append(`<div class="logged-not-logged-header-holder">Not Logged In</div>`);
            notLoggedSection.append(
              `<div class="logged-not-logged-scoring-name-holder">Balanced Score</div>`
            );
            notLoggedSection.append(
              `<div class="logged-not-logged-score-holder">${notLoggedScore}</div>`
            );
            notLoggedSection.append(
              `<div class="logged-not-logged-header-holder">Did not log in</div>`
            );
            notLoggedSection.append(
              `<div class="logged-not-logged-agent-count-holder">${notLoggedAgentCount} Agents</div>`
            );
            notLoggedSection.append(
              `<div class="logged-not-logged-agent-percentage-holder">${notLoggedAgentPct?.toFixed(
                1
              )}%</div>`
            );
            //notLoggedSection.append(`<div class="logged-not-logged-total-user-count-holder">${notLoggedTotalUserCount} Total Users</div>`);

            notLoggedSection.on("click", function () {
              let id = this.id;
              let itemId = id.split("_")[2];
              let dataLoadType = "Not Logged";
              GetUserDetailData(
                function (listToRender) {
                  RenderUserDetailData(
                    function (itemId) {
                      ShowUserDetailListingSection(itemId);
                    },
                    itemId,
                    dataLoadType,
                    listToRender
                  );
                },
                false,
                itemId,
                dataLoadType
              );
            });
          } else {
            loggedPerformancePercent = "--";

            loggedSection.append(
              `<div class="logged-not-logged-scoring-name-holder">Balanced Score</div>`
            );
            loggedSection.append(
              `<div class="logged-not-logged-score-holder">--</div>`
            );
            loggedSection.append(
              `<div class="logged-not-logged-header-holder">Logged in</div>`
            );
            loggedSection.append(
              `<div class="logged-not-logged-agent-count-holder">-- Agents</div>`
            );

            notLoggedSection.append(
              `<div class="logged-not-logged-scoring-name-holder">Balanced Score</div>`
            );
            notLoggedSection.append(
              `<div class="logged-not-logged-score-holder">--</div>`
            );
            notLoggedSection.append(
              `<div class="logged-not-logged-header-holder">Did not log in</div>`
            );
            notLoggedSection.append(
              `<div class="logged-not-logged-agent-count-holder">-- Agents</div>`
            );
          }

          let statsScoreHolder = $(
            `<div class="usage-analyzer-stats-section-info-text-holder" />`
          );
          let itemScoreHolder = $(
            `<div class="usage-analyzer-stats-item-score-holder" />`
          );
          itemScoreHolder.append(`${loggedPerformancePercent}`);

          itemScoreHolder.append(`<br />`);
          itemScoreHolder.append(
            `<span class="usage-analyzer-stats-text">Average performance of agents that logged in vs. agents that did not.</span>`
          );

          statsScoreHolder.append(itemScoreHolder);

          itemStatsDetailSection.append(
            `<div class="usage-analyzer-stats-section-header-text-holder">${itemName}</div>`
          );
          itemStatsDetailSection.append(statsScoreHolder);
          itemStatsDetailSection.append(loggedSection);
          itemStatsDetailSection.append(notLoggedSection);
          itemStatsDetailSection.append(
            `<div class="usage-analyzer-notes-section-holder">Agents without scores are not included within the scoring values or counts.</div>`
          );
          itemStatsDetailSection.append(itemAssignmentInformationHolder);

          if (callback != null) {
            callback();
          }
        }
        function RenderUserDetailData(
          callback,
          itemId,
          renderType,
          dataListToRender
        ) {
          if (dataListToRender == null) {
            dataListToRender =
              directiveData.DetailData.find((i) => i.DataType == renderType)
                ?.Data || [];
          }
          let sortColumn = $("#currentSortColumn", element).val();
          let sortOrder = $("#currentSortOrder", element).val();
          if (sortColumn == "") {
            sortColumn = "score";
            dataListToRender = SortDetailData(
              dataListToRender,
              sortColumn,
              sortOrder
            );
          }
          $(
            `#dataItemUserDetailTitle_${directiveParameters.DataLoadArea.toLowerCase()}_${itemId}`
          ).empty();
          $(
            `#dataItemUserDetailTitle_${directiveParameters.DataLoadArea.toLowerCase()}_${itemId}`
          ).append(
            `<div class="usage-analyzer-user-detail-header-type-text-holder">${renderType}</div>`
          );

          let renderTo = $(
            `#dataItemUserDetailList_${directiveParameters.DataLoadArea.toLowerCase()}_${itemId}`,
            element
          );
          renderTo.empty();

          let parentItem = $(
            `#dataItemUserDetailListSection_${directiveParameters.DataLoadArea.toLowerCase()}_${itemId}`,
            element
          );
          let downloadButton = $(
            `#downloadUsageListOption_${directiveParameters.DataLoadArea.toLowerCase()}_${itemId}`,
            parentItem
          );

          let userScoreHeader = $(
            `#detailColumnUserScore_${directiveParameters.DataLoadArea.toLowerCase()}_${itemId}`,
            parentItem
          );
          let userNameHeader = $(
            `#detailColumnUserName_${directiveParameters.DataLoadArea.toLowerCase()}_${itemId}`,
            parentItem
          );

          downloadButton.attr("listType", renderType);
          userScoreHeader.attr("renderType", renderType);
          userNameHeader.attr("renderType", renderType);

          let recordCounter = 1;

          dataListToRender.forEach(function (dataItem) {
            let userDetailRowHolder = $(
              `<div id="dataItemUserDetailRow_${directiveParameters.DataLoadArea.toLowerCase()}_${itemId}" class="usage-analyzer-user-detail-item-row" />`
            );

            let userDetailRecordCountColumn = $(
              `<div class="usage-analyzer-data-item data-item record-number" />`
            );
            let userDetailUserNameColumn = $(
              `<div class="usage-analyzer-data-item data-item user-name" />`
            );
            let userDetailUserRoleColumn = $(
              `<div class="usage-analyzer-data-item data-item user-role" />`
            );
            let userDetailUserStatusColumn = $(
              `<div class="usage-analyzer-data-item data-item user-status" />`
            );
            let userDetailUserScoreColumn = $(
              `<div class="usage-analyzer-data-item data-item user-score" />`
            );

            let userNameDisplay = dataItem.UserId;
            let userRole = "--";
            let userStatus = "--";
            let userScore =
              dataItem.Score.toFixed(directiveParameters.ScoringPrecision) ||
              0.0;
            let userAvatarFile = defaultUserAvatar;
            let userDisplayInfo = dataItem.UserId;

            let userProfileObject = dataItem.UserIdSource;
            if (userProfileObject == null) {
              userProfileObject = lookupDataOptions.UserProfiles.find(
                (i) => i.UserId == dataItem.UserId
              );
            }
            if (userProfileObject != null) {
              userRole = userProfileObject.UserRole;
              let userStatusText = GetUserStatusTextFromId(
                userProfileObject.UserStatus
              );
              userDetailRowHolder.addClass(
                `user-status-row-type-${userStatusText
                  .replace(" ", "-")
                  .toLowerCase()}`
              );
              userStatus = userStatusText;
              if (
                userProfileObject.UserStatus == "2" &&
                userProfileObject.InactiveDate != null &&
                userProfileObject.InactiveDate != ""
              ) {
                userStatus += ` (${new Date(
                  userProfileObject.InactiveDate
                ).toLocaleDateString()})`;
              }
              userAvatarFile =
                a$.debugPrefix() +
                  "/jq/avatars/" +
                  userProfileObject.AvatarImageFileName || defaultUserAvatar;

              userDisplayInfo = userProfileObject.UserFullName;
            }
            let userAvatarImage = $(
              `<img src="${userAvatarFile}" class="user-avatar-small" />`
            );

            userDetailRecordCountColumn.append(recordCounter);
            userDetailUserNameColumn.append(userAvatarImage);
            userDetailUserNameColumn.append(userDisplayInfo);
            userDetailUserRoleColumn.append(userRole);
            userDetailUserStatusColumn.append(userStatus);
            userDetailUserScoreColumn.append(userScore);

            userDetailRowHolder.append(userDetailRecordCountColumn);
            userDetailRowHolder.append(userDetailUserNameColumn);
            userDetailRowHolder.append(userDetailUserRoleColumn);
            userDetailRowHolder.append(userDetailUserStatusColumn);
            userDetailRowHolder.append(userDetailUserScoreColumn);

            renderTo.append(userDetailRowHolder);

            recordCounter++;
          });
          if (callback != null) {
            callback(itemId);
          }
        }
        /* Directive Rendering Functions END */
        /* Chart Rendering START */
        function RenderTrendChart(callback, listToRender, itemId) {
          let chartRenderToId = `dataItemTrendChartSection_${directiveParameters.DataLoadArea.toLowerCase()}_${itemId}`;

          if (chartRenderToId != null) {
            //TODO: (cdj) Determine the series and category data so that we can show information in a valid manner.
            //TODO: (cdj) Determine how we want to handle colors for the graphs.
            let seriesData = [
              {
                name: "Logged In",
                data: [listToRender.length],
                rawData: [listToRender.length],
                DataObjectRef: [listToRender.length],
                color: directiveParameters.LoggedInColor[1],
              },
              {
                name: "Logged In Balanced Score",
                data: [listToRender.length],
                rawData: [listToRender.length],
                DataObjectRef: [listToRender.length],
                //color: directiveParameters.LoggedInColor[1],
                color: "var(--bright-green)",
              },
              {
                //name: "Not Logged In",
                name: "Did not log in",
                data: [listToRender.length],
                rawData: [listToRender.length],
                DataObjectRef: [listToRender.length],
                color: directiveParameters.NotLoggedInColor[2],
              },
              {
                //name: "Not Logged Balanced Score",
                name: "Did not log in Balanced Score",
                data: [listToRender.length],
                rawData: [listToRender.length],
                DataObjectRef: [listToRender.length],
                color: "var(--table-labels)",
              },
              {
                //name: "Logged vs. Not Logged Difference",
                name: "Logged vs. Did not log in Difference",
                data: [listToRender.length],
                rawData: [listToRender.length],
                DataObjectRef: [listToRender.length],
                color: "var(--brand-blue)",
                dashStyle: "ShortDot",
              },
            ];

            let categoryData = [];
            let counter = 0;
            listToRender = SortTrendChartDataArrayLowHigh(listToRender);
            listToRender.forEach(function (item) {
              let itemDate = new Date(item.StartDate);
              if (itemDate != null) {
                let categoryTextKey = `${itemDate.toLocaleString("en-US", {
                  month: "long",
                })} - ${itemDate.toLocaleString("en-US", { year: "numeric" })}`;
                let categoryIndex = categoryData.findIndex(
                  (i) => i == categoryTextKey
                );
                if (categoryIndex < 0) {
                  categoryData.push(categoryTextKey);
                }
              } else {
                categoryData.push(null);
              }
              let loggedCountPct =
                parseFloat(item.LoggedCount / item.TotalUserCount).toFixed(4) *
                  100 || 0;
              let loggedBalScoreValuePct =
                parseFloat(
                  item.LoggedBalancedScore / item.MaxPossibleBalancedScore
                ).toFixed(4) * 100 || 0;
              let notLoggedCountPct =
                parseFloat(item.NotLoggedCount / item.TotalUserCount).toFixed(
                  4
                ) * 100 || 0;
              let notLoggedBalScoreValuePct =
                parseFloat(
                  item.NotLoggedBalancedScore / item.MaxPossibleBalancedScore
                ).toFixed(4) * 100 || 0;
              let diffScorePct =
                parseFloat(item.DifferenceScorePercentage).toFixed(4) || 0;

              //Logged %
              seriesData[0].data[counter] = parseFloat(
                loggedCountPct.toFixed(2)
              );
              seriesData[0].rawData[counter] = item.LoggedCount;
              //Logged Diff Score
              seriesData[1].data[counter] = parseFloat(
                loggedBalScoreValuePct.toFixed(2)
              );
              //Not Logged %
              seriesData[2].data[counter] = parseFloat(
                notLoggedCountPct.toFixed(2)
              );
              seriesData[2].rawData[counter] = item.NotLoggedCount;
              //Not Logged Diff Score
              seriesData[3].data[counter] = parseFloat(
                notLoggedBalScoreValuePct.toFixed(2)
              );
              //diff percentage
              seriesData[4].data[counter] = parseFloat(diffScorePct);

              //Push the data objects to a holder to use later where necessary.
              for (let dIndex = 0; dIndex < 5; dIndex++) {
                seriesData[dIndex].DataObjectRef[counter] = item;
              }
              counter++;
            });
            let lookupObject = null;
            let chartTitleText = null;
            switch (directiveParameters.DataLoadArea.toLowerCase()) {
              case "project":
                lookupObject = lookupDataOptions.Projects.find(
                  (i) => i.ProjectId == itemId
                );
                //chartTitleText = lookupObject.Name;
                break;
              case "location":
                lookupObject = lookupDataOptions.Locations.find(
                  (i) => i.LocationId == itemId
                );
                break;
              case "group":
                lookupObject = lookupDataOptions.Groups.find(
                  (i) => i.GroupId == itemId
                );
                break;
              case "team":
                lookupObject = lookupDataOptions.Teams.find(
                  (i) => i.TeamId == itemId
                );
                break;
              case "overall":
                lookupObject = null;
                //chartTitleText = "All Users";
                break;
            }
            // if (lookupObject != null) {
            //    chartTitleText = lookupObject.Name;
            // }
            //TODO: Configure the chart definitions once we have all of the data and the look/feel.
            let chartDef = {};
            chartDef.chart = {
              type: "line",
              zoomType: "xy",
            };
            chartDef.title = {
              text: chartTitleText,
            };
            chartDef.plotOptions = {
              series: {
                marker: {
                  lineWidth: 1,
                },
              },
            };
            chartDef.xAxis = {
              categories: categoryData,
              gridLineWidth: 1,
              tickWidth: 0,
              title: {
                text: "Month",
              },
            };
            chartDef.yAxis = {
              gridLineWidth: 1,
              tickWidth: 1,
              title: {
                text: "Score",
              },
            };
            chartDef.series = seriesData;
            chartDef.credits = false;
            //TODO: Handle the hover information.
            chartDef.tooltip = {
              useHTML: true,
              formatter: function () {
                let returnString = BuildTooltipFromSeriesData(this);
                return returnString;
              },
            };

            Highcharts.chart(chartRenderToId, chartDef);
          }
          if (callback != null) {
            callback();
          }
        }
        /* Chart Rendering END */
        /* Show/Hide START */
        function HideAll() {
          HideAllSectionLoadingImages();
          HideAllUserDetailListingSections();
        }
        function HideAllSectionLoadingImages() {
          $(
            `[id^='dataItemLoadingSection_${directiveParameters.DataLoadArea.toLowerCase()}_']`,
            element
          ).hide();
        }
        function HideAllUserDetailListingSections() {
          $(
            `[id^='dataItemUserDetailListSection_${directiveParameters.DataLoadArea.toLowerCase()}_']`,
            element
          ).hide();
        }
        function HideSectionLoadingImage(itemId) {
          if (
            directiveData.ChartDataLoadComplete == true &&
            directiveData.StatsDataLoadComplete == true
          ) {
            $(
              `#dataItemLoadingSection_${directiveParameters.DataLoadArea.toLowerCase()}_${itemId}`,
              element
            ).hide();
          }
        }
        function ShowSectionLoadingImage(itemId) {
          $(
            `#dataItemLoadingSection_${directiveParameters.DataLoadArea.toLowerCase()}_${itemId}`,
            element
          ).show();
        }
        function ToggleUserDetailListingSection(itemId) {
          let isVisible = $(
            `#dataItemUserDetailListSection_${directiveParameters.DataLoadArea.toLowerCase()}_${itemId}`,
            element
          ).is(":visible");
          if (isVisible == true) {
            HideUserDetailListingSection(itemId);
          } else {
            ShowUserDetailListingSection(itemId);
          }
        }
        function HideUserDetailListingSection(itemId) {
          $(
            `#dataItemUserDetailListSection_${directiveParameters.DataLoadArea.toLowerCase()}_${itemId}`,
            element
          ).hide();
        }
        function ShowUserDetailListingSection(itemId) {
          $(
            `#dataItemUserDetailListSection_${directiveParameters.DataLoadArea.toLowerCase()}_${itemId}`,
            element
          ).show();
        }
        /* Show/Hide END */
        /* Utility functions START */
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
              case "group".toLowerCase():
                lookupDataOptions.Groups.length = 0;
                lookupDataOptions.Groups = lookupObjectList.dataObjectsList;
                break;
              case "team".toLowerCase():
                lookupDataOptions.Teams.length = 0;
                lookupDataOptions.Teams = lookupObjectList.dataObjectsList;
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
        function SortTrendChartDataArrayLowHigh(arrayToSort) {
          let sortedArray = arrayToSort;

          sortedArray = sortedArray.sort((a, b) => {
            if (new Date(a.StartDate) < new Date(b.StartDate)) {
              return -1;
            } else if (new Date(a.StartDate) > new Date(b.StartDate)) {
              return 1;
            } else {
              if (new Date(a.EndDate) < new Date(b.EndDate)) {
                return -1;
              } else if (new Date(a.EndDate) > new Date(b.EndDate)) {
                return 1;
              } else {
                return 0;
              }
            }
          });

          return sortedArray;
        }
        function BuildTooltipFromSeriesData(dataObject) {
          let dataIndex = dataObject.series.data.findIndex(
            (d) => d.category == dataObject.key
          );

          let dataRefObject = $(
            dataObject.series.options.DataObjectRef[dataIndex]
          )[0];
          let refId =
            dataRefObject?.ObjectTypeReferenceId.toString().toLowerCase();

          let areaLoadedName = $(
            ".usage-analyzer-stats-section-header-text-holder",
            $(
              `#dataItemStatsSection_${directiveParameters.DataLoadArea.toLowerCase()}_${refId}`
            )
          )
            .text()
            .trim();
          let seriesName = dataObject.series.name;

          let userCountLabel = "Agent Count";

          if (
            directiveParameters.DataLoadArea.toLowerCase() ==
            "overall".toLowerCase()
          ) {
            userCountLabel = "All Users";
          }
          let moreDataHolder = `<span>`;

          switch (seriesName.toLowerCase()) {
            case "Logged In".toLowerCase():
              moreDataHolder += `<b>${dataObject.y}%</b> Logged in<br>`;
              moreDataHolder += `<b>${userCountLabel}</b>: ${
                dataRefObject?.LoggedCount || 0
              } of ${dataRefObject?.TotalUserCount || 0}<br>`;
              break;
            case "Logged In Balanced Score".toLowerCase():
              moreDataHolder += `<b>Balanced Score</b>: ${
                dataRefObject?.LoggedBalancedScore?.toFixed(
                  directiveParameters.ScoringPrecision
                ) || 0
              } of ${dataRefObject?.MaxPossibleBalancedScore || 0}<br>`;
              moreDataHolder += `<b>${userCountLabel}</b>: ${
                dataRefObject?.LoggedCount || 0
              } of ${dataRefObject?.TotalUserCount || 0}<br>`;
              // moreDataHolder += `<b>Diff</b>: ${dataRefObject?.DifferenceScorePercentage}%<br>`;
              break;
            case "Not Logged In".toLowerCase():
            case "Did not log in".toLowerCase():
              moreDataHolder += `<b>${dataObject.y}%</b> Did not log in<br>`;
              moreDataHolder += `<b>${userCountLabel}</b>: ${
                dataRefObject?.NotLoggedCount || 0
              } of ${dataRefObject?.TotalUserCount || 0}<br>`;
              break;
            case "Not Logged In Balanced Score".toLowerCase():
            case "Did not log in Balanced Score".toLowerCase():
            case "Not Logged Balanced Score".toLowerCase():
            case "Did not log in Balanced Score".toLowerCase():
              moreDataHolder += `<b>Balanced Score</b>: ${
                dataRefObject?.NotLoggedBalancedScore?.toFixed(
                  directiveParameters.ScoringPrecision
                ) || 0
              } of ${dataRefObject?.MaxPossibleBalancedScore || 0}<br>`;
              moreDataHolder += `<b>${userCountLabel}</b>: ${
                dataRefObject?.NotLoggedCount || 0
              } of ${dataRefObject?.TotalUserCount || 0}<br>`;
              // moreDataHolder += `<b>Diff</b>: ${(-dataRefObject?.DifferenceScorePercentage)}%<br>`;
              break;
            case "Logged vs. Not Logged Difference".toLowerCase():
            case "Logged vs. Did not log in Difference".toLowerCase():
              moreDataHolder += `<b>Total Agent Count</b>: ${
                dataRefObject?.TotalUserCount || 0
              }<br>`;
              moreDataHolder += `<b>Logged in Balanced Score</b>: ${
                dataRefObject?.LoggedBalancedScore?.toFixed(
                  directiveParameters.ScoringPrecision
                ) || 0
              }<br>`;
              moreDataHolder += `<b>Did Not Log in Balanced Score</b>: ${
                dataRefObject?.NotLoggedBalancedScore?.toFixed(
                  directiveParameters.ScoringPrecision
                ) || 0
              }<br>`;
              moreDataHolder += `<b>Diff</b>: ${
                dataRefObject?.DifferenceScorePercentage?.toFixed(2) || 0
              }%<br>`;
              break;
          }
          moreDataHolder += `</span>`;
          let returnString = `<span class="usage-viewer-hover-chart-display-information">`;
          returnString += `<b>${areaLoadedName}</b>: <b>${seriesName}</b><br>`;
          returnString += `<hr/><span><i>${dataObject.key}</i></span><hr/>`;
          returnString += moreDataHolder;
          returnString += `<br>`;
          returnString += `</span>`;
          return returnString;
        }
        function ApplyFilters(filterObject) {
          if (filterObject.Projects != null && filterObject.Projects != "") {
            let projFilterArray = filterObject.Projects.split(",");
            $("[id^='projectListItemHolder_']", element).hide();
            projFilterArray.forEach(function (projectId) {
              $(`#projectListItemHolder_${projectId}`, element).show();
            });
          } else {
            $("[id^='projectListItemHolder_']", element).show();
          }
          if (filterObject.Locations != null && filterObject.Locations != "") {
            let locationFilterArray = filterObject.Locations.split(",");
            $("[id^='locationListItemHolder_']", element).hide();
            locationFilterArray.forEach(function (locationId) {
              $(`#locationListItemHolder_${locationId}`, element).show();
            });
          } else {
            $("[id^='locationListItemHolder_']", element).show();
          }
          if (filterObject.Groups != null && filterObject.Groups != "") {
            let groupFilterArray = filterObject.Groups.split(",");
            $("[id^='groupListItemHolder_']", element).hide();
            groupFilterArray.forEach(function (groupId) {
              $(`#groupListItemHolder_${groupId}`, element).show();
            });
          } else {
            $("[id^='groupListItemHolder_']", element).show();
          }
          if (filterObject.Teams != null && filterObject.Teams != "") {
            let teamFilterArray = filterObject.Teams.split(",");
            $("[id^='teamListItemHolder_']", element).hide();
            teamFilterArray.forEach(function (teamId) {
              $(`#teamListItemHolder_${teamId}`, element).show();
            });
          } else {
            $("[id^='teamListItemHolder_']", element).show();
          }

          directiveData.ShowAllUserFilteredOption =
            filterObject.Projects != null &&
            filterObject.Projects != "" &&
            filterObject.Locations != null &&
            filterObject.Locations != "" &&
            filterObject.Groups != null &&
            filterObject.Groups != "" &&
            filterObject.Teans != null &&
            filterObject.Teams != "";
        }
        function SetDataFilters(callback, filterObject) {
          directiveData.DataQualifierFilters.ProjectIdList =
            filterObject.Projects || null;
          directiveData.DataQualifierFilters.LocationIdList =
            filterObject.Locations || null;
          directiveData.DataQualifierFilters.GroupIdList =
            filterObject.Groups || null;
          directiveData.DataQualifierFilters.TeamIdList =
            filterObject.Teams || null;
          if (callback != null) {
            callback(filterObject);
          }
          return filterObject;
        }
        function GetFilterQualifiers() {
          return directiveData.DataQualifierFilters;
        }
        function SetScoringPrecisionForClient() {
          appLib.getConfigParameterByName(
            "CLIENT_SCORING_CALC_TYPE",
            function (param) {
              if (param?.ParamValue?.toLowerCase() == "StdDev".toLowerCase()) {
                directiveParameters.ScoringPrecision = 4;
              }
            }
          );
        }
        function DoFileDownload(callback, fileType, itemId) {
          let currentDetailData = directiveData?.DetailData?.find(
            (i) => i.DataType.toLowerCase() == fileType.toLowerCase()
          )?.Data;
          let dataToDownload = [];
          dataToDownload.push(
            `"UserId","User Name","Log Type", "Score", "Start Date", "End Date"`
          );
          currentDetailData.forEach(function (dataItem) {
            let userObject = lookupDataOptions.UserProfiles.find(
              (i) => i.UserId == dataItem.UserId
            );
            let userFullName = "";
            if (userObject != null) {
              userFullName = userObject.UserFullName;
            }
            let downloadData = `"${
              dataItem.UserId
            }","${userFullName}","${fileType}","${dataItem.Score}","${new Date(
              dataItem.StartDate
            ).toLocaleDateString()}","${new Date(
              dataItem.EndDate
            ).toLocaleDateString()}"`;
            dataToDownload.push(downloadData);
          });

          let fileDateToday = new Date();
          let fileDateInfo = `${fileDateToday.getFullYear()}${fileDateToday.getMonth()}${fileDateToday.getDate()}${fileDateToday.getHours()}${fileDateToday.getMinutes()}${fileDateToday.getSeconds()}`;
          let fileNameToDownload = `UsagePerformance_${fileType}_${legacyContainer.scope.TP1Username.toLowerCase()}_${fileDateInfo}`;
          let form = document.createElement("form");
          form.setAttribute("method", "POST");
          form.setAttribute("action", "/jq/DownloadGrid.ashx");
          form.setAttribute("target", "_blank");
          let downloadTypeInput = document.createElement("input");
          downloadTypeInput.setAttribute("type", "hidden");
          downloadTypeInput.setAttribute("name", "downloadtype");
          downloadTypeInput.setAttribute("value", "csv");
          form.appendChild(downloadTypeInput);
          let fileNameInput = document.createElement("input");
          fileNameInput.setAttribute("type", "hidden");
          fileNameInput.setAttribute("name", "downloadfilename");
          fileNameInput.setAttribute("value", fileNameToDownload);
          form.appendChild(fileNameInput);
          let downloadDataInput = document.createElement("input");
          downloadDataInput.setAttribute("type", "hidden");
          downloadDataInput.setAttribute("name", "csvBuffer");
          downloadDataInput.setAttribute("value", dataToDownload.join("\n"));
          form.appendChild(downloadDataInput);
          document.body.appendChild(form);
          //force download of file.
          form.submit();
          if (callback != null) {
            callback(fileNameToDownload);
          }
        }
        function HandleDetailSortClick(itemClickedId, column, renderType) {
          //let dataLoadType = itemClickedId.split("_")[1];
          let itemId = itemClickedId.split("_")[2];

          let currentSortColumn = $("#currentSortColumn", element).val();
          let currentSortOrder = $("#currentSortOrder", element).val();

          let dataArray = directiveData.DetailData?.find(
            (i) => i.DataType.toLowerCase() == renderType.toLowerCase()
          )?.Data;

          let sortColumn = currentSortColumn;
          let sortOrder = currentSortOrder;

          if (column.toLowerCase() != currentSortColumn.toLowerCase()) {
            sortColumn = column;
            sortOrder = "ASC";
          } else if (column.toLowerCase() == currentSortColumn.toLowerCase()) {
            if (currentSortOrder.toLowerCase() == "ASC".toLowerCase()) {
              sortOrder = "DESC";
            } else {
              sortOrder = "ASC";
            }
          }

          dataArray = SortDetailData(dataArray, sortColumn, sortOrder);
          RenderUserDetailData(null, itemId, renderType, dataArray);
        }
        function SortDetailData(arrayToSort, sortColumn, sortOrder) {
          if (sortColumn == null) {
            sortColumn = "Score";
          }
          if (sortOrder == null) {
            sortOrder = "ASC";
          }

          let sortedArray = arrayToSort;
          if (sortedArray != null) {
            $("#currentSortColumn", element).val(sortColumn);
            $("#currentSortOrder", element).val(sortOrder);

            sortOrder = sortOrder.toLowerCase();
            sortColumn = sortColumn.toLowerCase();
            switch (sortColumn.toLowerCase()) {
              case "username":
                sortedArray = sortedArray.sort((a, b) => {
                  let aUserName = a.UserId;
                  let bUserName = b.UserId;
                  let aUserObject = lookupDataOptions.UserProfiles.find(i => i.UserId == a.UserId);
                  let bUserObject = lookupDataOptions.UserProfiles.find(i => i.UserId == b.UserId);

                  if(aUserObject != null)
                  {
                     aUserName = aUserObject.UserFullName;
                  }
                  if(bUserObject != null)
                  {
                     bUserName = bUserObject.UserFullName;
                  }

                  if (aUserName > bUserName) {
                     return sortOrder == "ASC".toLowerCase() ? 1 : -1;
                   } else if (aUserName < bUserName) {
                     return sortOrder == "ASC".toLowerCase() ? -1 : 1;
                   } else {
                     return 0;
                   }
                });
                break;
              default:
                sortedArray = sortedArray.sort((a, b) => {
                  if (a.Score > b.Score) {
                    return sortOrder == "ASC".toLowerCase() ? 1 : -1;
                  } else if (a.Score < b.Score) {
                    return sortOrder == "ASC".toLowerCase() ? -1 : 1;
                  } else {
                    return 0;
                  }
                });
                break;
            }
          }
          return sortedArray;
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
          //scope.load();
        });
        ko.postbox.subscribe("UsageAnalysisReload", function () {
          LoadDirectiveData(null, true);
        });
        ko.postbox.subscribe("UsageAnalysisOverviewLoad", function () {
          scope.load();
        });
        ko.postbox.subscribe(
          "UsageAnalysis_LookupDataLoaded",
          function (dataLookupObjects) {
            HideAll();
            SetLookupOptions(dataLookupObjects);
            CreateDisplayAreas();
          }
        );
        ko.postbox.subscribe(
          "UsageAnalysis_ApplyFilters",
          function (filtersObject) {
            SetDataFilters(function () {
              ApplyFilters(filtersObject);
            }, filtersObject);
            // if (
            //   directiveParameters.DataLoadArea.toLowerCase() ==
            //   "overall-qualified"
            // ) {
            //   LoadDirectiveData(null, true);
            // }
          }
        );
        window.addEventListener(
          "usageViewFull_ChartDataLoaded",
          function (directiveInfo) {
            if (directiveInfo.detail.area == directiveParameters.DataLoadArea) {
              directiveData.ChartDataLoadComplete = true;
            }
            HideSectionLoadingImage(directiveInfo.detail.id);
          }
        );
        window.addEventListener(
          "usageViewFull_StatDataLoaded",
          function (directiveInfo) {
            if (directiveInfo.detail.area == directiveParameters.DataLoadArea) {
              directiveData.StatsDataLoadComplete = true;
            }
            HideSectionLoadingImage(directiveInfo.detail.id);
          }
        );
      },
    };
  },
]);
