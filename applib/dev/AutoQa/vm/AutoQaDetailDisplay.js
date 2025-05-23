angularApp.directive("ngAutoQaDetailDisplay", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/AutoQa/view/AutoQaDetailDisplay.htm?' + Date.now(),
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
         userId: "@"
      },
      require: '^ngLegacyContainer',
      link: function (scope, element, attrs, legacyContainer) {
         HideAll();
         const AI_UserId = "AI.System";
         //let avatarBaseUrl = window.location.protocol + "//" + window.location.hostname + "/applib/css/images/avatars/";
         let defaultAvatarUrl = window.location.protocol + "//" + window.location.hostname + "/jq/avatars/empty_headshot.png";

         let initialData = [];
         let compareData = [];
         let cachedRenderedObjects = {
            projects: [],
            locations: [],
            groups: [],
            teams: [],
            userProfiles: [],
         };
         /* Event Handling START */
         $("#btnRefreshDetails", element).off("click").on("click", function () {
            LoadDetailData(null, true);
         });
         /* Event Handling END */
         function Initialize() {
            $(".directive-information-loading-image", element).prop("src", `${a$.debugPrefix()}/applib/css/images/acuity-loading.gif`);
            cachedRenderedObjects.userProfiles.push({ UserId: "AI.System", UserFullName: "AI User", AvatarImageFileName: "empty_headshot.png" }); //add the fake AI.System User to the users so we can get info.

            $("#currentSortValue", element).val("");
            $("#currentSortOrder", element).val("");

            HideAll();
            SetDatePickers();
            RenderDirectiveFooter();
            StartLookupDataLoad();
         };
         function SetDatePickers() {
         }
         /* Data Loading START */
         function StartLookupDataLoad() {
            //load the projects
            a$.ajax({
               type: "POST",
               service: "C#",
               async: true,
               data: {
                  lib: "selfserve",
                  cmd: "getProjectList",
                  deepLoad: false,
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (data) {
                  let returnData = JSON.parse(data.projectList);
                  returnData.forEach(function (di) {
                     cachedRenderedObjects.projects.push(di);
                  });

               }
            });

            //load the locations
            a$.ajax({
               type: "POST",
               service: "C#",
               async: true,
               data: {
                  lib: "selfserve",
                  cmd: "getLocationList",
                  deepLoad: false,
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (data) {
                  let returnData = JSON.parse(data.locationList);
                  returnData.forEach(function (di) {
                     cachedRenderedObjects.locations.push(returnData);
                  });
               }
            });
            //load the groups
            a$.ajax({
               type: "POST",
               service: "C#",
               async: true,
               data: {
                  lib: "selfserve",
                  cmd: "getGroupList",
                  deepLoad: false,
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (data) {
                  let returnData = JSON.parse(data.groupList);
                  returnData.forEach(function (di) {
                     cachedRenderedObjects.groups.push(di);
                  });
               }
            });
            //load the teams
            a$.ajax({
               type: "POST",
               service: "C#",
               async: true,
               data: {
                  lib: "selfserve",
                  cmd: "getAllTeams",
                  deepLoad: false,
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (data) {
                  let returnData = JSON.parse(data.teamList);
                  returnData.forEach(function (di) {
                     cachedRenderedObjects.teams.push(di);
                  });
               }
            });
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
                  ShowRefreshButton();
               }
            });

         }
         function LoadDirective() {
            HideAll();
            LoadDetailData();
         }
         function LoadDetailData(callback, forceReload) {
            ShowLoadingMessage();
            GetDetailData(function (dataToRender) {
               RenderDetailData(function () {
                  ShowDetailList();
                  HideLoadingMessage();
                  if (callback != null) {
                     callback();
                  } 7
               }, dataToRender);
            }, forceReload);
         }
         /* Data Loading END */
         /* Data Pulls START */
         function GetDetailData(callback, forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (forceReload == false && initialData != null && initialData.length > 0) {
               if (callback != null) {
                  callback(initialData);
               }
               else {
                  return initialData;
               }
            }
            else {
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
                     cmd: "getAutoQaDashboardData",
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
                     let returnData = JSON.parse(data.autoQaDashboardData);
                     initialData = returnData;
                     if (callback != null) {
                        callback(returnData);
                     }
                     else {
                        return returnData;
                     }
                  }
               });
            }
         }
         // function GetCompareData(callback, forceReload) {
         //    if (forceReload == null) {
         //       forceReload = false;
         //    }
         //    if (forceReload == false && compareData != null && compareData.length > 0) {
         //       if (callback != null) {
         //          callback(compareData);
         //       }
         //       else {
         //          return compareData;
         //       }
         //    }
         //    else {
         //       let startDate = null;
         //       let endDate = null;
         //       let projectId = null;
         //       let locationId = null;
         //       let groupId = null;
         //       let teamId = null;
         //       let userId = null;
         //       if (legacyContainer.scope.filters != null) {
         //          startDate = legacyContainer.scope.filters.StartDate;
         //          endDate = legacyContainer.scope.filters.EndDate;
         //          projectId = legacyContainer.scope.filters.Project;
         //          locationId = legacyContainer.scope.filters.Location;
         //          groupId = legacyContainer.scope.filters.Group;
         //          teamId = legacyContainer.scope.filters.Team;
         //          userId = legacyContainer.scope.filters.CSR;
         //       }
         //       if (projectId == "all" || projectId == "each") projectId = null;
         //       if (locationId == "all" || locationId == "each") locationId = null;
         //       if (groupId == "all" || groupId == "each") groupId = null;
         //       if (teamId == "all" || teamId == "each") teamId = null;
         //       if (userId == "all" || userId == "each") userId = null;

         //       a$.ajax({
         //          type: "POST",
         //          service: "C#",
         //          async: true,
         //          data: {
         //             lib: "selfserve",
         //             cmd: "getAutoQaDashboardScoreCompareData",
         //             startDate: startDate,
         //             endDate: endDate,
         //             deepLoad: false,
         //             projectId: projectId,
         //             locationId: locationId,
         //             groupId: groupId,
         //             teamId: teamId,
         //             userId: userId,

         //          },
         //          dataType: "json",
         //          cache: false,
         //          error: a$.ajaxerror,
         //          success: function (data) {
         //             let returnData = JSON.parse(data.autoQaDashboardCompareData);
         //             compareData.length = 0;
         //             compareData = returnData;
         //             if (callback != null) {
         //                callback(returnData);
         //             }
         //             else {
         //                return returnData;
         //             }
         //          }
         //       });
         //    }
         // }
         /* Data Pulls END */
         /* Data Rendering START */
         function RenderDetailData(callback, listToRender) {
            if (listToRender == null) {
               listToRender = initialData;
            }
            $("#autoQaDetailsDisplay", element).empty();
            let detailDataHolder = $(`<div class="data-detail-list-holder" />`);
            let detailDataTableHeaderHolder = $(`<div class="data-detail-table-header-holder" />`);;
            let detailDataTableBodyHolder = $(`<div class="data-detail-table-body-holder" />`);;
            let detailDataTableFooterHolder = $(`<div class="data-detail-table-footer-holder" />`);;

            //header data
            RenderDetailTableHeader(detailDataTableHeaderHolder);
            RenderDetailTableBody(detailDataTableBodyHolder, listToRender);
            RenderDetailTableFooter(detailDataTableFooterHolder);
            //footer data


            detailDataHolder.append(detailDataTableHeaderHolder);
            detailDataHolder.append(detailDataTableBodyHolder);
            detailDataHolder.append(detailDataTableFooterHolder);


            $("#autoQaDetailsDisplay", element).append(detailDataHolder);

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
               $("#directiveTimeFrame", element).append(`${startDate.toLocaleDateString()} through ${endDate.toLocaleDateString()}`);
            }
         }

         function RenderDetailTableHeader(renderToObject) {
            let detailHeaderRowHolder = $(`<div class="data-detail-table-header-row" />`);

            let monitorCounterHolder = $(`<div class="data-detail-column monitor-counter header-item">&nbsp;</div>`);
            let monitorIdHolder = $(`<div class="data-detail-column monitor-id header-item" sortValue="monitorId">Monitor Id</div>`);
            let callDateHolder = $(`<div class="data-detail-column call-date header-item" sortValue="callDate">Call Date</div>`);
            let callIdHolder = $(`<div class="data-detail-column call-id header-item" sortValue="callId">Call Id</div>`);
            let projectHolder = $(`<div class="data-detail-column project header-item">Project</div>`);
            let locationHolder = $(`<div class="data-detail-column location header-item">Location</div>`);
            let groupHolder = $(`<div class="data-detail-column group header-item">Group</div>`);
            let teamHolder = $(`<div class="data-detail-column team header-item">Team</div>`);
            let monitorForHolder = $(`<div class="data-detail-column monitor-for header-item" sortValue="monitorFor">User</div>`);
            let monitorByHolder = $(`<div class="data-detail-column monitor-by header-item" sortValue="monitorBy">Enter By</div>`);
            let monitorDateHolder = $(`<div class="data-detail-column monitor-date header-item" sortValue="monitorDate">Enter On</div>`);
            let daysToMonitorHolder = $(`<div class="data-detail-column days-to-monitor header-item" sortValue="daysToMonitor">Days to Monitor</div>`);
            let monitorScoreHolder = $(`<div class="data-detail-column monitor-score header-item" sortValue="monitorScore">Monitor Score</div>`);
            let buttonsHolder = $(`<div class="data-detail-column button-holder header-item">&nbsp;</div>`);

            let headerArray = [
               monitorIdHolder,
               monitorByHolder,
               monitorDateHolder,
               monitorForHolder,
               callIdHolder,
               callDateHolder,
               projectHolder,
               locationHolder,
               groupHolder,
               teamHolder,
               daysToMonitorHolder,
               monitorScoreHolder,
            ];
            detailHeaderRowHolder.append(monitorCounterHolder);
            let currentSortValue = $("#currentSortValue", element).val();
            let currentSortOrder = $("#currentSortOrder", element).val();
            headerArray.forEach(function (item) {
               let sortValue = $(item).attr('sortvalue');
               if (sortValue != null && sortValue != "") {
                  $(item).addClass("sortable");
                  $(item).prop("sortValue", sortValue);
                  if (currentSortValue == sortValue) {
                     $(item).removeClass("asc-grid desc-grid").addClass(`${currentSortOrder}-grid`);
                  }
               }
               $(item).on("click", function () {
                  SortDataColumn(this);
                  RenderDetailData();
               });
               detailHeaderRowHolder.append(item);
            });
            detailHeaderRowHolder.append(buttonsHolder);

            $(renderToObject).append(detailHeaderRowHolder);
         }
         function RenderDetailTableBody(renderToObject, dataToRender) {
            if (dataToRender == null || dataToRender.length == 0) {
               $(renderToObject).append("No detail records found.");
            }
            else {
               let detailCounter = 1;
               dataToRender.forEach(function (dataItem) {
                  let detailRowHolder = $(`<div class="data-detail-list-row" />`);

                  if (dataItem.MonitorByUserId.toLowerCase() == AI_UserId.toLowerCase()) {
                     detailRowHolder.addClass("enter-by-ai");
                  }

                  let monitorCounterHolder = $(`<div class="data-detail-column monitor-counter">${detailCounter}</div>`);
                  let monitorIdHolder = $(`<div class="data-detail-column monitor-id" keyValue="${dataItem.MonitorId}" />`);
                  monitorLink = $(`<a target="_blank" href="https://${a$.urlprefix(true)}acuityapm.com/monitor/monitor_review.aspx?prefix=${a$.urlprefix().replace(".", "")}&id=${dataItem.MonitorId}" class="auto-qa-link monitor-link" >${dataItem.MonitorId}</a>`);
                  monitorIdHolder.append(monitorLink);
                  let monitorByHolder = $(`<div class="data-detail-column monitor-by" keyValue="${dataItem.MonitorByUserId}"/>`);
                  monitorByHolder.on("click", function () {
                     let userId = $(this).attr("keyValue");
                     console.log(`Display User Profile: ${userId}.`);
                     //alert("Not implmeneted yet. Should display the user profile information.");
                  });
                  RenderUserInformation(dataItem.MonitorByUserId, monitorByHolder);
                  let monitorDateHolder = $(`<div class="data-detail-column monitor-date">${new Date(dataItem.MonitorDate).toLocaleDateString()}</div>`);
                  let monitorForHolder = $(`<div class="data-detail-column monitor-for" keyValue="${dataItem.MonitorForUserId}"/>`);
                  monitorForHolder.on("click", function () {
                     let userId = $(this).attr("keyValue");
                     console.log(`Display User Profile: ${userId}.`);
                     //alert("Not implmeneted yet. Should display the user profile information.");
                  });
                  RenderUserInformation(dataItem.MonitorForUserId, monitorForHolder);

                  let callDateHolder = $(`<div class="data-detail-column call-date">${new Date(dataItem.CallDate).toLocaleDateString()}</div>`);
                  let callIdHolder = $(`<div class="data-detail-column call-id">${dataItem.CallId}</div>`);
                  let projectName = GetProjectName(dataItem.ProjectId);
                  let projectHolder = $(`<div class="data-detail-column project">${projectName}</div>`);
                  let locationName = GetLocationName(dataItem.LocationId);
                  let locationHolder = $(`<div class="data-detail-column location">${locationName}</div>`);
                  let groupName = GetGroupName(dataItem.GroupId);
                  let groupHolder = $(`<div class="data-detail-column group">${groupName}</div>`);
                  let teamName = GetTeamName(dataItem.TeamId);
                  let teamHolder = $(`<div class="data-detail-column team">${teamName}</div>`);
                  let daysToMonitorHolder = $(`<div class="data-detail-column days-to-monitor">${dataItem.DaysToMonitor}</div>`);
                  let monitorScore = $(`<div class="data-detail-column monitor-score">${dataItem.MonitorRawScore}</div>`);
                  let buttonHolder = $(`<div class="data-detail-column button-holder" />`);

                  detailRowHolder.append(monitorCounterHolder);
                  detailRowHolder.append(monitorIdHolder);
                  detailRowHolder.append(monitorByHolder);
                  detailRowHolder.append(monitorDateHolder);
                  detailRowHolder.append(monitorForHolder);
                  detailRowHolder.append(callIdHolder);
                  detailRowHolder.append(callDateHolder);
                  detailRowHolder.append(projectHolder);
                  detailRowHolder.append(locationHolder);
                  detailRowHolder.append(groupHolder);
                  detailRowHolder.append(teamHolder);
                  detailRowHolder.append(daysToMonitorHolder);
                  detailRowHolder.append(monitorScore);
                  detailRowHolder.append(buttonHolder);

                  $(renderToObject).append(detailRowHolder);
                  detailCounter++
               });
            }
         }

         function RenderDetailTableFooter(renderToObject) {
            let detailFooterRowHolder = $(`<div class="data-detail-table-footer-row" />`);
            detailFooterRowHolder.append("&nbsp;");

            $(renderToObject).append(detailFooterRowHolder);
         }

         function RenderUserInformation(userId, renderToObject) {
            let userHolder = $(`<div class="user-data-detail inline-item" />`);
            let userObject = GetUserProfileObject(userId);
            if (userObject != null) {
               let userNameHolder = $(`<div class="user-data-detail-holder inline-item username" />`);
               userNameHolder.append(userObject.UserFullName);
               let avatarFileCleaned = defaultAvatarUrl;
               if (userObject.AvatarImageFileName != "empty_headshot.png") {
                  avatarFileCleaned = Global_CleanAvatarUrl(userObject.AvatarImageFileName);
                  let urlPrefix = a$.urlprefix(true);
                  if (avatarFileCleaned.indexOf("AV_") > -1) {
                     avatarFileCleaned = `https://${urlPrefix}acuityapmr.com/${avatarFileCleaned}`;
                  }
               }
               let userAvatarHolder = $(`<div class="user-data-detail-holder inline-item avatar-holder" />`);
               let userAvatarImage = $(`<img src="${avatarFileCleaned}" alt="${userId} avatar" class="user-avatar" />`);

               userAvatarHolder.append(userAvatarImage);

               userHolder.append(userAvatarHolder);
               userHolder.append(userNameHolder);

            }
            else {
               userHolder.append(userId);
            }

            $(renderToObject).append(userHolder);
         }
         /* Data Rendering END */
         /* Editor Loading START */
         /* Editor Loading END */
         /* Editor Validation & Saving START */
         /* Editor Validation & Saving END */
         /* Sorting Options START */
         function SortDataColumn(columnObject) {
            let sortedData = initialData;
            let sortValue = $(columnObject).prop("sortValue");
            let currentSortValue = $("#currentSortValue", element).val();
            let currentSortOrder = $("#currentSortOrder", element).val();

            if (currentSortValue == sortValue) {
               if (currentSortOrder == "asc") {
                  currentSortOrder = "desc";
               }
               else {
                  currentSortOrder = "asc";
               }
            }
            else {
               currentSortOrder = "asc";
            }

            switch (sortValue.toLowerCase()) {
               case "callDate".toLowerCase():
                  sortedData = sortedData.sort((a, b) => {
                     if (currentSortOrder == "desc") {
                        return new Date(b.CallDate) - new Date(a.CallDate);
                     }
                     else {
                        return new Date(a.CallDate) - new Date(b.CallDate);
                     }
                  });
                  break;
               case "monitorDate".toLowerCase():
                  sortedData = sortedData.sort((a, b) => {
                     if (currentSortOrder == "desc") {
                        return new Date(b.MonitorDate) - new Date(a.MonitorDate);
                     }
                     else {
                        return new Date(a.MonitorDate) - new Date(b.MonitorDate);
                     }
                  });
                  break;
               case "monitorId".toLowerCase():
                  sortedData = sortedData.sort((a, b) => {
                     if (currentSortOrder == "desc") {
                        return b.MonitorId - a.MonitorId;
                     }
                     else {
                        return a.MonitorId - b.MonitorId;
                     }
                  });
                  break;
               case "monitorFor".toLowerCase():
                  sortedData = sortedData.sort((a, b) => {
                     let aUserObject = cachedRenderedObjects.userProfiles.find(u => u.UserId == a.MonitorForUserId) || a.MonitorForUserId;
                     let bUserObject = cachedRenderedObjects.userProfiles.find(u => u.UserId == b.MonitorForUserId) || b.MonitorForUserId;
                     if (aUserObject != null && b.UserObject != null) {
                        if (currentSortOrder == "desc") {
                           return b.UserObject.UserFullName - a.UserObject.UserFullName;
                        }
                        else {
                           return a.UserObject.UserFullName - b.UserObject.UserFullName;
                        }
                     }
                     else {
                        if (currentSortOrder == "desc") {
                           return b.MonitorForUserId - a.MonitorForUserId;
                        }
                        else {
                           return a.MonitorForUserId - b.MonitorForUserId;
                        }
                     }
                  });
                  break;
               case "monitorBy".toLowerCase():
                  sortedData = sortedData.sort((a, b) => {
                     if (currentSortOrder == "desc") {
                        return b.MonitorByUserId - a.MonitorByUserId;
                     }
                     else {
                        return a.MonitorByUserId - b.MonitorByUserId;
                     }
                  });
                  break;
               case "monitorScore".toLowerCase():
                  sortedData = sortedData.sort((a, b) => {
                     if (currentSortOrder == "desc") {
                        return parseFloat(b.MonitorRawScore) - parseFloat(a.MonitorRawScore);
                     }
                     else {
                        if ((a.MonitorRawScore - b.MonitorRawScore) == 0) {
                           return new Date(a.MonitorId) - new Date(b.MonitorId);
                        }
                        else {
                           return parseFloat(a.MonitorRawScore) - parseFloat(b.MonitorRawScore);
                        }

                     }
                  });
                  break;
               case "daysToMonitor".toLowerCase():
                  sortedData = sortedData.sort((a, b) => {
                     if (currentSortOrder == "desc") {
                        return parseFloat(b.DaysToMonitor) - parseFloat(a.DaysToMonitor);
                     }
                     else {
                        return parseFloat(a.DaysToMonitor) - parseFloat(a.DaysToMonitor);
                     }
                  });
                  break;
               case "callId".toLowerCase():
                  sortedData = sortedData.sort((a, b) => {
                     if (currentSortOrder == "desc") {
                        return (b.CallId - a.CallId);
                     }
                     else {
                        return (a.CallId - b.CallId);
                     }
                  });
                  break;

            }

            $("#currentSortValue", element).val(sortValue);
            $("#currentSortOrder", element).val(currentSortOrder);
            $(columnObject).removeClass("asc-grid desc-grid").addClass(`${currentSortOrder}-grid`);

            return sortedData;
         }
         /* Sorting Options END */
         /* Utility Functions START */
         function GetProjectName(projectId) {
            if (projectId == null || projectId <= 0 || projectId == "") {
               return "";
            }
            let returnValue = projectId;
            let projectObject = cachedRenderedObjects.projects.find(i => i.Id == projectId);
            if (projectObject == null) {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "selfserve",
                     cmd: "getProjectById",
                     projectId: projectId,
                     deepLoad: false,
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let returnData = JSON.parse(data.projectObject);
                     cachedRenderedObjects.projects.push(returnData);
                     returnValue = returnData.Name || projectId;
                     console.log(`From Lookup call. (Project [${projectId}])`);

                  }
               });
            }
            if (projectObject != null) {
               returnValue = projectObject.Name;
            }
            return returnValue;
         }
         function GetLocationName(locationId) {
            if (locationId == null || locationId <= 0 || locationId == "") {
               return "";
            }
            let returnValue = locationId;
            let locationObject = cachedRenderedObjects.locations.find(i => i.Id == locationId);
            if (locationObject == null) {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "selfserve",
                     cmd: "getLocationById",
                     locationId: locationId,
                     deepLoad: false,
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let returnData = JSON.parse(data.locationObject);
                     cachedRenderedObjects.locations.push(returnData);
                     returnValue = returnData?.Name || locationId;
                     console.log(`From Lookup call. (Location [${locationId}])`);
                  }
               });
            }
            if (locationObject != null) {
               returnValue = locationObject.Name;
            }
            return returnValue;
         }
         function GetGroupName(groupId) {
            if (groupId == null || groupId <= 0 || groupId == "") {
               return "";
            }
            let returnValue = groupId;
            let groupObject = cachedRenderedObjects.groups.find(i => i.Id == groupId);
            if (groupObject == null) {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "selfserve",
                     cmd: "getGroupById",
                     groupid: groupId,
                     deepLoad: false,
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let returnData = JSON.parse(data.groupObject);
                     cachedRenderedObjects.groups.push(returnData);
                     returnValue = returnData?.Name || groupId;
                     console.log(`From Lookup call. (Team [${groupId}])`);
                  }
               });
            }
            if (groupObject != null) {
               returnValue = groupObject.Name;
            }
            return returnValue;
         }
         function GetTeamName(teamId) {
            if (teamId == null || teamId <= 0 || teamId == "") {
               return "";
            }
            let returnValue = teamId;
            let teamObject = cachedRenderedObjects.teams.find(i => i.Id == teamId);
            if (teamObject == null) {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "selfserve",
                     cmd: "getTeamById",
                     teamid: teamId,
                     deepLoad: false,
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let returnData = JSON.parse(data.team);
                     cachedRenderedObjects.teams.push(returnData);
                     returnValue = returnData?.Name || teamId;
                     console.log(`From Lookup call. (Team [${teamId}])`);
                  }
               });
            }
            if (teamObject != null) {
               returnValue = teamObject.Name;
            }
            return returnValue;
         }

         function GetUserProfileObject(userId) {
            let userObject = cachedRenderedObjects.userProfiles.find(i => i.UserId == userId);
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
                     console.log(`From Lookup call. (User [${userId}])`);
                     return returnData;
                  }
               });
            }
            return userObject;
         }

         /* Utility Functions END */
         /* Show/Hide START */
         function HideAll() {
            HideRefreshButton();
            HideLoadingMessage();
            HideDetailList();
         }
         function HideDetailList() {
            $("#autoQaDetailDisplayHolder", element).hide();
         }
         function ShowDetailList() {
            $("#autoQaDetailDisplayHolder", element).show();
         }
         function HideLoadingMessage() {
            $("#directiveLoading", element).hide();
         }
         function ShowLoadingMessage() {
            $("#directiveLoading", element).show();
         }
         function ShowRefreshButton() {
            $("#btnRefreshDetails", element).show();
         }
         function HideRefreshButton() {
            $("#btnRefreshDetails", element).hide();
         }
         /* Show/Hide END */

         scope.load = function () {
            Initialize();
            LoadDirective();
         };

         ko.postbox.subscribe("autoQaRefresh", function (dataObjects) {
            initialData.length = 0;
            initialData = dataObjects;
            Initialize();
         });

         ko.postbox.subscribe("autoQaLoad", function () {
            initialData.length = 0;
            Initialize();
         });
         ko.postbox.subscribe("autoQaLoad2", function () {
            initialData.length = 0;
            scope.load();
         });
         // ko.postbox.subscribe("autoQaDetailLoad", function (dataObjects) {
         //    initialData.length = 0;
         //    initialData = dataObjects;
         //    scope.load();
         // });
      }
   };
}]);