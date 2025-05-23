angularApp.directive("ngUserRequiredActions", [
  "api",
  "$rootScope",
  function (api, $rootScope) {
    return {
      templateUrl:
        a$.debugPrefix() +
        "/applib/dev/USERDASHBOARD1/view/UserRequiredActions.htm?" +
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
        let userRequireActionsInitComplete = false;
        let dataObjects = {
          availableActionsList: [],
          availableFormsList: [],
          formsDetailList: [],
        };
        let lookupObjects = {
          DataLoaded: {
            Projects: false,
            Locations: false,
            Groups: false,
              UserProfiles: false,
          },
          Projects: [],
          Locations: [],
          Groups: [],
          Teams: [],
          UserProfiles: [],
        }
        let loadingUrl = a$.debugPrefix() + "/applib/css/images/acuity-loading.gif";
        let defaultUserAvatar = a$.debugPrefix() + "/jq/avatars/empty_headshot.png";
        // let dataLoadType = null;
        // SetAttrValues(attrs);
        /* Event Handling START */
        $(".btn-close", element)
          .off("click")
          .on("click", function () {
            MarkItemActive(null, "", "data-area-status-item-holder");
            HideEditorForm();
          });
        $("#btnRefreshRequiredActions", element).off("click").on("click", function(){
          LoadDataInformation(true);
        })
        /* Event Handling END */
        scope.Initialize = function () {
          HideAll();
          LoadLookupObjects();
        };
        function SetDatePickers() { }
        // function SetAttrValues(attrs) {
        //    if (attrs.userRequiredActionType != null || attrs.userrequiredactiontype != null) {
        //       dataLoadType = (attrs.userRequiredActionType || attrs.userrequiredactiontype);
        //    }
        // }
        /* Data Loading START */
        function LoadDirective() {
          HideAll();
          LoadDataInformation();
        }
        /* Data Loading END */
        function LoadDataInformation(forceReload) {
          if(forceReload == null)
          {
            forceReload = false;
          }
          GetAvailableDataAreas(function (dataToRender) {
            RenderAvailableDataAreas(null, dataToRender);
          }, forceReload);
        }
        function LoadDataAreaStatusCounts(callback, areaKeyToLoad) {
          GetDataAreaStatusCounts(function (dataToRender) {
            RenderDataAreaStatusCounts(function () {
              ShowDataAreaStatusCounts(areaKeyToLoad);
            }, dataToRender, areaKeyToLoad);
          }, areaKeyToLoad);
        }
        function LoadLookupObjects(forceReload) {
          if(forceReload == null)
          {
            forceReload = false;
          }
          LoadAvailableProjects(null, forceReload);
          LoadAvailableLocations(null, forceReload);
          LoadAvailableGroups(null, forceReload);
          LoadAvailableUserProfiles(null, forceReload);

          userRequireActionsInitComplete = (
            lookupObjects.DataLoaded.Projects == true
            && lookupObjects.DataLoaded.Locations == true
            && lookupObjects.DataLoaded.Groups == true
            && lookupObjects.DataLoaded.UserProfiles == true
           );
        }
        function LoadAvailableProjects(callback, forceReload) {
          if (lookupObjects.Projects == null || lookupObjects.Projects.length == 0 || forceReload == true) {
            a$.ajax({
              type: "POST",
              service: "C#",
              async: false,
              data: {
                lib: "selfserve",
                cmd: "getProjectListForUser",
                deepLoad: false,
              },
              dataType: "json",
              cache: false,
              error: a$.ajaxerror,
              success: function (data) {
                let returnData = JSON.parse(data.projectList);
                lookupObjects.Projects.length = 0;
                lookupObjects.Projects = [...returnData];
                lookupObjects.DataLoaded.Projects = true;
                if (callback != null) {
                  callback(returnData);
                } else {
                  return returnData;
                }
              },
            });
          }
          else
          {
            if (callback != null) {
              callback(lookupObjects.Projects);
            } else {
              return lookupObjects.Projects;
            }
          }
        }
        function LoadAvailableLocations(callback, forceReload) {
          if (lookupObjects.Locations == null || lookupObjects.Locations.length == 0 || forceReload == true) {
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
                lookupObjects.Locations.length = 0;
                lookupObjects.Locations = [...returnData];
                lookupObjects.DataLoaded.Locations = true;
                if (callback != null) {
                  callback(returnData);
                } else {
                  return returnData;
                }
              },
            });
          }
          else {
            if (callback != null) {
              callback(lookupObjects.Locations);
            } else {
              return lookupObjects.Locations;
            }
          }
        }
        function LoadAvailableGroups(callback, forceReload) {
          if (lookupObjects.Groups == null || lookupObjects.Groups.length == 0 || forceReload == true) {
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
                lookupObjects.Groups.length = 0;
                lookupObjects.Groups = [...returnData];
                lookupObjects.DataLoaded.Groups = true;
                if (callback != null) {
                  callback(returnData);
                } else {
                  return returnData;
                }
              },
            });
          }
          else {
            if (callback != null) {
              callback(lookupObjects.Groups);
            } else {
              return lookupObjects.Groups;
            }
          }
        }
        // function LoadAvailableTeams(callback, forceReload) {
        //   if (lookupObjects.Teams == null || lookupObjects.Teams.length == 0 || forceReload == true) {
        //     a$.ajax({
        //       type: "POST",
        //       service: "C#",
        //       async: true,
        //       data: {
        //         lib: "selfserve",
        //         cmd: "getTeamList",
        //       },
        //       dataType: "json",
        //       cache: false,
        //       error: a$.ajaxerror,
        //       success: function (data) {
        //         let returnData = JSON.parse(data.teamList);
        //         lookupObjects.Teams.length = 0;
        //         lookupObjects.Teams = [...returnData];
        //         lookupObjects.DataLoaded.Teams = true;
        //         if (callback != null) {
        //           callback(returnData);
        //         } else {
        //           return returnData;
        //         }
        //       },
        //     });
        //   }
        // }
        function LoadAvailableUserProfiles(callback, forceReload) {
          if (lookupObjects.UserProfiles == null || lookupObjects.UserProfiles.length == 0 || forceReload == true) {
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
                lookupObjects.UserProfiles.length = 0;
                lookupObjects.UserProfiles = [...returnData];
                lookupObjects.DataLoaded.UserProfiles = true;
                if (callback != null) {
                  callback(returnData);
                } else {
                  return returnData;
                }
              },
            });
          }

        }
        function LoadUserProfile(userId)
        {
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
                let userIndex = lookupObjects.UserProfiles.findIndex(i => i.UserId == userId);
                if(userIndex < 0)
                {
                  lookupObjects.UserProfiles.push(returnData);
                }
                return returnData;
              },
            });
        }
        /* Data Pulls START */
        function GetAvailableDataAreas(callback, forceReload) {
          if (forceReload == null) {
            forceReload = false;
          }
          if (
            dataObjects.availableActionsList != null &&
            dataObjects.availableActionsList.length > 0 &&
            forceReload == false
          ) {
            if (callback != null) {
              callback(dataObjects.availableActionsList);
            } else {
              return dataObjects.availableActionsList;
            }
          } else {
            //TODO: Handle the data call to the database to get the information
            a$.ajax({
              type: "POST",
              service: "C#",
              async: true,
              data: {
                lib: "selfserve",
                cmd: "getAllUserRequiredActions",
                userId: legacyContainer.scope.TP1Username,
                deepLoad: false,
              },
              dataType: "json",
              cache: false,
              error: a$.ajaxerror,
              success: function (data) {
                if (data.errormessage != null && data.errormessage == "true") {
                  a$.jsonerror(data);
                  return;
                }
                else {
                  let returnData = JSON.parse(data.userRequiredActionsList);
                  dataObjects.availableActionsList.length = 0;
                  dataObjects.availableActionsList = [...returnData];
                  if (callback != null) {
                    callback(dataObjects.availableActionsList);
                  }
                }
              }
            });

          }
        }
        function GetDataAreaStatusCounts(callback, idToLoad) {
          a$.ajax({
            type: "POST",
            service: "C#",
            async: true,
            data: {
              lib: "selfserve",
              cmd: "getUserRequiredActionStatusForUser",
              userId: legacyContainer.scope.TP1Username,
              actionId: idToLoad,
              deepLoad: false,
            },
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: function (data) {
              if (data.errormessage != null && data.errormessage == "true") {
                a$.jsonerror(data);
                return;
              } else {
                let returnData = JSON.parse(data.requiredActionStatusList);
                dataObjects.availableFormsList.length = 0;
                dataObjects.availableFormsList = [...returnData];
                if (callback != null) {
                  callback(dataObjects.availableFormsList);
                }
              }
            },
          });
        }
        function GetDataAreaStatusDetail(callback, idToLoad, sqfCode) {
          a$.ajax({
            type: "POST",
            service: "C#",
            async: false,
            data: {
              lib: "selfserve",
              cmd: "getUserRequiredActionStatusDetailsForUser",
              userId: legacyContainer.scope.TP1Username,
              actionId: idToLoad,
              sqfCode: sqfCode,
              deepLoad: false,
            },
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: function (data) {
              if (data.errormessage != null && data.errormessage == "true") {
                a$.jsonerror(data);
                return;
              } else {
                let returnData = JSON.parse(data.requiredActionStatusDetailList);
                dataObjects.formsDetailList.length = 0;
                dataObjects.formsDetailList = [...returnData];
                if (callback != null) {
                  callback(dataObjects.formsDetailList);
                }
              }
            },
          });
        }
        /* Data Pulls END */
        /* Data Rendering START */
        function RenderAvailableDataAreas(callback, dataToRender) {
          if (dataToRender == null) {
            dataToRender = dataObjects.availableActionsList;
          }
          $("#userRequiredActionsListHolder", element).empty();
          $("#userRequiredActionsDetailListHolder", element).empty();

          if (dataToRender == null || dataToRender.length == 0) {
            let noUserRequiredActionsHolder = $(`<div class="no-user-actions-required-actions-holder" />`);
            let noActionsFoundLabel = $(`<div class="no-user-required-actions-found-label-1">You are all caught up!</div>`);
            let noActionsFoundLabel2 = $(`<div class="no-user-required-actions-found-label-2">No required actions found for you.</div>`);

            noUserRequiredActionsHolder.append(noActionsFoundLabel);
            noUserRequiredActionsHolder.append(noActionsFoundLabel2);

            $("#userRequiredActionsDetailListHolder", element).append(noUserRequiredActionsHolder);
          }
          else {
            let userActionDataItemHolder = $(`<div class="available-bucket-data-holder" />`);
            let holderClass = "user-required-action-information-holder";

            dataToRender.forEach(function (userActionDataItem) {
              let userActionDataListItem = $(`<div class="${holderClass}" id="userRequiredActionHolder_${userActionDataItem.Id}" />`);
              let userActionDetailStatusListHolder = $(`<div class="available-bucket-data-status-list-holder" id="userRequiredActionActionStatusHolder_${userActionDataItem.Id}" actionId="${userActionDataItem.Id}" actionText="${userActionDataItem.StatusText}" />`);

              userActionDataListItem.on("click", function () {
                HideAllDataAreaStatusCounts();
                HideEditorForm();
                let itemId = this.id;
                let actionId = itemId.split("_")[1];
                let actionText = $(this).attr("actionText");
                //let actionId = $(this).attr("actionId");

                MarkItemActive(null, this.id, holderClass);
                LoadDataAreaStatusCounts(function () {
                  ShowDataAreaStatusCounts(actionId);
                }, actionId);

              });
              let userActionCountHolder = $(`<div class="user-required-action-counter-holder" />`);
              userActionCountHolder.append(userActionDataItem.RecordCount);

              let userActionNameHolder = $(`<div class="user-required-action-type-holder" />`);
              userActionNameHolder.append(userActionDataItem.Name);

              userActionDataListItem.append(userActionCountHolder);
              userActionDataListItem.append(userActionNameHolder);

              userActionDataItemHolder.append(userActionDataListItem);

              $("#userRequiredActionsDetailListHolder", element).append(userActionDetailStatusListHolder);
            });
            $("#userRequiredActionsListHolder", element).append(userActionDataItemHolder);
            HideAllDataAreaStatusCounts();
          }

          if (callback != null) {
            callback();
          }
        }
        function RenderDataAreaStatusCounts(callback, listToRender, areaKey) {
          if (listToRender == null) {
            listToRender = dataObjects.availableFormsList.filter(i => i.actionId == areaKey);
          }

          $(`#userRequiredActionActionStatusHolder_${areaKey}`, element).empty();

          let dataAreaStatusHolder = $(`<div class="data-area-status-list-holder" />`);
          let holderClass = "data-area-status-item-holder";
          listToRender.forEach(function (statusItem) {
            let dataAreaStatusItemHolder = $(`<div class="${holderClass}" id="dataAreaStatusItemHolder_${statusItem.Id}_${statusItem.SqfCode}" statusId="${statusItem.Id}" sqfCode="${statusItem.SqfCode}" />`);

            let statusNameHolder = $(`<div class="data-area-status-item status-name" />`);
            statusNameHolder.append(statusItem.Name);

            let statusCountHolder = $(`<div class="data-area-status-item status-count" />`);
            statusCountHolder.append(statusItem.RecordCount);

            dataAreaStatusItemHolder.on("click", function (event) {
              let statusId = $(this).attr("statusId");
              let sqfCode = $(this).attr("sqfCode");
              MarkItemActive(null, this.id, holderClass);
              LoadEditorForm(function () {
                ShowEditorForm();
              }, statusId, sqfCode);
              event.stopPropagation();
            });

            dataAreaStatusItemHolder.append(statusCountHolder);
            dataAreaStatusItemHolder.append(statusNameHolder);

            dataAreaStatusHolder.append(dataAreaStatusItemHolder);
          });

          $(`#userRequiredActionActionStatusHolder_${areaKey}`, element).append(dataAreaStatusHolder);

          if (callback != null) {
            callback();
          }
        }
        function RenderEditorForm(callback, listToRender, statusId, sqfCode) {
          RenderEditorHeader(statusId, sqfCode);
          RenderEditorDetail(listToRender);
          RenderEditorFooter(listToRender.length);
          if (callback != null) {
            callback();
          }
        }
        function RenderEditorHeader(statusId, sqfCode) {
          console.log("RenderEditorHeader()");
          let statusText = statusId;
          let formText = sqfCode;

          let statusObject = dataObjects.availableActionsList.find(i => i.Id == statusId);
          let formObject = dataObjects.availableFormsList.find(i => i.Id == statusId && i.SqfCode == sqfCode);

          if (statusObject != null) {
            statusText = statusObject.Name || "";
          }
          if (formObject != null) {
            formText = formObject.Name || "";
          }
          $("#formNameSelectedLabel", element).empty();
          $("#formNameSelectedLabel", element).append(formText);

          $("#statusSelectedLabel", element).empty();
          $("#statusSelectedLabel", element).append(statusText);
        }
        function RenderEditorDetail(listToRender) {
          $("#requiredActionsDetailList", element).empty();

          let monitorListDetailHolder = $('<div class="monitor-list-detail-holder" />');
          let prefix = appLib.urlprefix();
          listToRender.forEach(function (monitorItem) {

            let monitorRowHolder = $(`<div class="monitor-item-row-holder" id="monitorDetailRow_${monitorItem.MonitorId}" />`);
            //TODO: Determine the layout of information we need.
            let monitorIdHolder = $(`<div class="user-required-action-item-holder data-item" id="monitorIdHolder_${monitorItem.MonitorId}" monitorId="${monitorItem.MonitorId}" />`);
            let monitorDateHolder = $(`<div class="user-required-action-item-holder data-item" />`);
            let agentDisplayHolder = $(`<div class="user-required-action-item-holder data-item" />`);
            let supervisorDisplayHolder = $(`<div class="user-required-action-item-holder data-item" />`);
            let projectDisplayHolder = $(`<div class="user-required-action-item-holder data-item" />`);
            let locationDisplayHolder = $(`<div class="user-required-action-item-holder data-item" />`);
            let groupDisplayHolder = $(`<div class="user-required-action-item-holder data-item" />`);
            let agentScoreHolder = $(`<div class="user-required-action-item-holder data-item" />`);


            let monitorIdLink = $(`<a href="https://${prefix}acuityapm.com/monitor/monitor_review.aspx?origin=report&id=${monitorItem.MonitorId}" target="_blank">${monitorItem.MonitorId}</a>`);

            monitorIdHolder.append(monitorIdLink);
            let agentUserObject = GetUserObject(monitorItem.AgentUserId);
            let userAvatarFileUrl = defaultUserAvatar;
            let userFullName = monitorItem.AgentUserId;
            let agentDisplayInformation = $(`<div class="user-data-display-information" />`);
            let agentAvatarHolder = $(`<div class="user-avatar-holder small-avatar" />`);

            if(agentUserObject != null)
            {
              userAvatarFileUrl = a$.debugPrefix() + "/jq/avatars/" + agentUserObject.AvatarImageFileName || defaultUserAvatar;
              userFullName = agentUserObject.UserFullName;
            }

            let agentAvatar = $(`<img src="${userAvatarFileUrl}" alt="${userFullName} avatar" class="user-avatar small-avatar">`);

            agentAvatarHolder.append(agentAvatar);

            agentDisplayInformation.append(agentAvatarHolder);
            agentDisplayInformation.append(userFullName);
            agentDisplayHolder.append(agentDisplayInformation);

            let supervisorUserObject = GetUserObject(monitorItem.SupervisorUserId);
            let supervisorAvatarFileUrl = defaultUserAvatar;
            let supervisorFullName = monitorItem.SupervisorUserId;
            let supervisorDisplayInformation = $(`<div class="user-data-display-information" />`);
            let supervisorAvatarHolder = $(`<div class="supervisor-user-avatar-holder small-avatar" />`);
            if(supervisorUserObject != null)
              {
                supervisorAvatarFileUrl = a$.debugPrefix() + "/jq/avatars/" + supervisorUserObject.AvatarImageFileName || defaultUserAvatar;
                supervisorFullName = supervisorUserObject.UserFullName;
              }

            let supervisorAvatar = $(`<img src="${supervisorAvatarFileUrl}" alt="${supervisorFullName} avatar" class="supervisor-user-avatar small-avatar">`);
            supervisorAvatarHolder.append(supervisorAvatar);

            supervisorDisplayInformation.append(supervisorAvatarHolder);
            supervisorDisplayInformation.append(supervisorFullName);

            supervisorDisplayHolder.append(supervisorDisplayInformation);

            if(monitorItem.FormReleaseDate != null)
            {
              monitorDateHolder.append(new Date(monitorItem.FormReleaseDate).toLocaleDateString());
            }
            else
            {
              monitorDateHolder.append("N/A");
            }
            //monitorDateHolder.append(new Date(monitorItem.FormReleaseDate).toLocaleDateString());
            agentScoreHolder.append(monitorItem.ScoreRating);
            let projectName = GetProjectName(monitorItem.ProjectId);
            let locationName = GetLocationName(monitorItem.LocationId);
            let groupName = GetGroupName(monitorItem.GroupId);

            projectDisplayHolder.append(projectName);
            locationDisplayHolder.append(locationName);
            groupDisplayHolder.append(groupName);

            monitorRowHolder.append(monitorIdHolder);
            monitorRowHolder.append(monitorDateHolder);
            monitorRowHolder.append(agentDisplayHolder);
            monitorRowHolder.append(supervisorDisplayHolder);
            monitorRowHolder.append(projectDisplayHolder);
            monitorRowHolder.append(locationDisplayHolder);
            monitorRowHolder.append(groupDisplayHolder);
            monitorRowHolder.append(agentScoreHolder);

            monitorListDetailHolder.append(monitorRowHolder);
          });

          $("#requiredActionsDetailList", element).append(monitorListDetailHolder);
        }
        function RenderEditorFooter(recordCount) {
          //TODO: Determine what we want to write here.  record count at a minimum?
          $("#requiredActionsRecordsFoundCount", element).empty();
          $("#requiredActionsRecordsFoundCount", element).append(recordCount);
        }
        /* Data Rendering END */
        /* Editor Loading START */
        function LoadEditorForm(callback, idToLoad, sqfCode) {
          console.log(`LoadEditorForm(callback, ${idToLoad}, ${sqfCode})`);
          GetDataAreaStatusDetail(function (dataList) {
            RenderEditorForm(function () {
              ShowEditorForm();
              if (callback != null) {
                callback();
              }
            }, dataList, idToLoad, sqfCode);
          }, idToLoad, sqfCode);
        }
        /* Editor Loading END */
        /* Editor Validation & Saving START */
        /* Editor Validation & Saving END */
        /* Sorting Options START */
        /* Sorting Options END */
        /* Utility Functions START */
        function MarkItemActive(callback, itemId, itemClass) {
          $(`.${itemClass}`, element).removeClass("active");
          if (itemId != null && itemId != "") {
            $(`#${itemId}`, element).addClass("active");
          }
          if (callback != null) {
            callback();
          }
        }
        function GetProjectName(projectId)
        {
          let returnValue = projectId;
          let projectObject = lookupObjects.Projects.find(p => p.ProjectId == projectId);
          if(projectObject != null)
          {
            returnValue = projectObject.Name || projectObject.ProjectDesc || "";
          }
          return returnValue;
        }
        function GetLocationName(locationId)
        {
          let returnValue = locationId;
          let locationObject = lookupObjects.Locations.find(l => l.LocationId == locationId);
          if(locationObject != null)
          {
            returnValue = locationObject.Name || locationObject.LocationName;
          }
          return returnValue;
        }
        function GetGroupName(groupId)
        {
          let returnValue = groupId;
          let groupObject = lookupObjects.Groups.find(l => l.GroupId == groupId);
          if(groupObject != null)
          {
            returnValue = groupObject.Name || groupObject.GroupName;
          }
          return returnValue;
        }
        function GetUserObject(userId)
        {
          let returnObject = lookupObjects.UserProfiles.find(u => u.UserId == userId) || null;
          if(returnObject == null)
          {
            LoadUserProfile(userId);
            returnObject = lookupObjects.UserProfiles.find(u => u.UserId == userId) || null;
          }
          return returnObject;
        }
        function CheckLookupLoadComplete(callback)
        {
          console.log("CheckLookupLoadComplete(callback)");
          if(callback != null)
          {
            callbacK();
          }
        }
        /* Utility Functions END */
        /* Show/Hide START */
        function HideAll() {
          HideEditorForm();
        }
        function HideEditorForm() {
          $("#userRequiredActionsEditorForm", element).hide();
        }
        function ShowEditorForm() {
          $("#userRequiredActionsEditorForm", element).show();
        }
        function HideAllDataAreaStatusCounts() {
          $(".available-bucket-data-status-list-holder").hide();
        }
        function HideDataAreaStatusCounts(dataAreaKey) {
          $(`#userRequiredActionActionStatusHolder_${dataAreaKey}`, element).hide();
        }
        function ShowDataAreaStatusCounts(dataAreaKey) {
          $(`#userRequiredActionActionStatusHolder_${dataAreaKey}`, element).show();
        }
        /* Show/Hide END */

        scope.load = function () {
          console.log("Directive: UserRequiredActions Load()");
          scope.Initialize();
          LoadDirective();
        };
        ko.postbox.subscribe("userDashboardInit", function () {
          scope.Initialize();
        });
        ko.postbox.subscribe("userDashboardLoad", function () {
          if (userRequireActionsInitComplete == true) {
            LoadDirective();
          }
          else {
            scope.load();
          }
        });
      },
    };
  },
]);
