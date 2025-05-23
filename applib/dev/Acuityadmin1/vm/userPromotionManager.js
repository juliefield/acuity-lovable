angularApp.directive("ngUserPromotionManager", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/ACUITYADMIN1/view/userPromotionManager.htm?' + Date.now(),
      scope: {
         assoc: "@",
         text: "@",
         details: "@",
         cid: "@",
         filters: "@",
         panel: "@",
         hidetopper: "@",
         toppertext: "@"
      },
      require: '^ngLegacyContainer',
      link: function (scope, element, attrs, legacyContainer) {
         HideAll();
         let windowRefreshTiming = 50;
         let displayTime_Default = 10000;
         var maxUserDisplayCount = 1000;
         var maxPromotedUserDisplayCount = 100;
         var defaultAvatarUrl = window.location.protocol + "//" + window.location.hostname + "/jq/avatars/empty_headshot.png";
         let avatarBaseUrl = window.location.protocol + "//" + window.location.hostname + "/applib/css/images/avatars/";
         let availableUsers = [];
         let promotedUsers = [];
         let availableProjects = [];
         let availableLocations = [];
         let availableGroups = [];
         let availableSupervisors = [];
         let availablePositions = [
            { id: "CSR", name: "Agent", status: "A" },
            { id: "Team Leader", name: "Team Leader", status: "A" },
            { id: "Group Leader", name: "Group Leader", status: "A" },
            { id: "Management", name: "Management", status: "A" },
            { id: "CorpAdmin", name: "Admin", status: "A" },
            { id: "Quality Assurance", name: "Quality Assurance", status: "A" },
         ];

         /* Event Handling START */
         $("#currentListProjectIdFilter", element).off("change").on("change", function () {
            availableUsers.length = 0;
         });
         $("#currentListLocationIdFilter", element).off("change").on("change", function () {
            availableUsers.length = 0;
         });
         $("#currentListGroupIdFilter", element).off("change").on("change", function () {
            availableUsers.length = 0;
         });
         $("#currentListFilterPosition", element).off("change").on("change", function () {
            availableUsers.length = 0;
         });
         $("#currentListFilterFirstName", element).off("change").on("change", function () {
            availableUsers.length = 0;
         });
         $("#currentListFilterLastName", element).off("change").on("change", function () {
            availableUsers.length = 0;
         });
         $("#btnSavePromotion", element).off("click").on("click", function () {
            ValidateForm(function () {
               WriteUserMessage("Adding information to list...", "page");
               window.setTimeout(function () {
                  SaveForm(function () {
                     ClearForm();
                     HideForm();
                     RenderAvailableUsers(function () {
                        HideCurrentAreaMessageDisplay();
                     });
                     RenderCurrentPromotedUsers(function () {
                        HidePromotionAreaMessageDisplay();
                     });
                  });
               }, windowRefreshTiming);
            });
         });
         $(".btn-close", element).off("click").on("click", function () {
            ClearForm(function () {
               HideForm();
            });
         });
         $("#btnDoPromotions", element).off("click").on("click", function () {
            if (confirm(`You are about to handle promotions for ${promotedUsers.length} individuals.\nAre you sure?\nPress OK to continue or CANCEL to not do promotions.`)) {
               WriteUserMessage("Handling promotion information...", "promotion");
               window.setTimeout(function () {
                  DoPromotions(function () {
                     LoadAvailableUsers(function () {
                        HideCurrentAreaMessageDisplay();
                     }, true);
                     LoadCurrentPromotedUsers(function () {
                        HidePromotionAreaMessageDisplay();
                     }, true);
                  });
               }, windowRefreshTiming);
            }
         });
         $("#btnCurrentListApplyFilter", element).off("click").on("click", function () {
            WriteUserMessage("Applying filters...", "current");
            $("#currentUsersList", element).empty();
            window.setTimeout(function () {
               GetAvailableUsersCount(function (count) {
                  if (count > maxUserDisplayCount) {
                     HideCurrentAreaMessageDisplay();
                     RenderTooManyUsersFound(function () {
                        HideCurrentAreaMessageDisplay();
                     }, count, "currentUsersList");
                  }
                  else {
                     if (availableUsers == null || availableUsers.length == 0) {
                        GetAvailableUsers(function () {
                           ApplyCurrentListFilter(function (filteredUserList) {
                              WriteUserMessage("Filters applied.  Writing user information for your viewing pleasure...", "current");
                              RenderAvailableUsers(function () {
                                 ShowUserCountDisplay();
                                 HideCurrentAreaMessageDisplay();
                              }, filteredUserList);
                           });
                        }, true);
                     }
                     else {
                        ApplyCurrentListFilter(function (filteredUserList) {
                           WriteUserMessage("Filters applied.  Writing user information for your viewing pleasure...", "current");
                           RenderAvailableUsers(function () {
                              ShowUserCountDisplay();
                              HideCurrentAreaMessageDisplay();
                           }, filteredUserList);
                        });
                     }
                  }
               });
            }, windowRefreshTiming);
         });
         $("#btnCurrentListClearFilter", element).off("click").on("click", function () {
            ClearCurrentListFilter(function () {
               HideUserCountDisplay();
               $("#btnCurrentListApplyFilter", element).click();
            });
         });
         /* Event Handling END */

         scope.Initialize = function () {
            HideAll();
            SetDatePickerFields();
            LoadPositionsList();
            LoadAvailableProjects(function (projectList) {
               RenderProjectList(null, projectList);
            });
            LoadAvailableLocations(function (locationList) {
               RenderLocationList(null, locationList);
            });
            LoadAvailableGroups(function (groupList) {
               RenderGroupList(null, groupList);
            });
            LoadAvailableSupervisors(function (supervisorList) {
               RenderSupervisorList(null, supervisorList);
            });
         };

         function SetDatePickerFields() {
            $(".new-position-date", element).datepicker();
         }
         function LoadPositionsList() {
            $("#userNewPosition", element).empty();
            $("#userNewPosition", element).append($(`<option />`, { value: "", text: "" }));

            //currentListFilterPosition
            $("#currentListFilterPosition", element).empty();
            $("#currentListFilterPosition", element).append($(`<option />`, { value: "", text: "" }));

            //promotionListFilterPosition
            $("#promotionListFilterPosition", element).empty();
            $("#promotionListFilterPosition", element).append($(`<option />`, { value: "", text: "" }));

            availablePositions.forEach(function (item) {
               if (item.status == "A") {
                  let positionOption = $(`<option />`, { value: item.id, text: item.name });
                  $("#userNewPosition", element).append(positionOption);

                  let currentPositionOption = $(`<option />`, { value: item.id, text: item.name });
                  $("#currentListFilterPosition", element).append(currentPositionOption);

                  let possiblePositionOption = $(`<option />`, { value: item.id, text: item.name });
                  $("#promotionListFilterPosition", element).append(possiblePositionOption);

               }
            });
         }
         /* Data Loading START */
         function LoadAvailableProjects(callback, forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }
            GetAvailableProjects(function (projectList) {
               if (callback != null) {
                  callback(projectList)
               }
               return projectList;
            }, forceReload);
         }
         function LoadAvailableLocations(callback, forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }
            GetAvailableLocations(function (locationList) {
               if (callback != null) {
                  callback(locationList)
               }
               return locationList;
            }, forceReload);
         }
         function LoadAvailableGroups(callback, forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }
            GetAvailableGroups(function (groupList) {
               if (callback != null) {
                  callback(groupList)
               }
               return groupList;
            }, forceReload);
         }
         function LoadAvailableSupervisors(callback, forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }
            GetAvailableSupervisors(function (supervisorList) {
               if (callback != null) {
                  callback(supervisorList)
               }
               return supervisorList;
            }, forceReload);
         }
         function LoadAvailableUsers(callback, forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }
            let userCount = 0;
            GetAvailableUsersCount(function (val) {
               userCount = val;
            });
            if (userCount > maxUserDisplayCount) {
               HideCurrentAreaMessageDisplay();
               RenderTooManyUsersFound(callback, userCount, "currentUsersList");
            }
            else {
               WriteUserMessage("Collecting users...", "current");
               window.setTimeout(function () {
                  GetAvailableUsers(function (userList) {
                     WriteUserMessage("Found users.  Starting writing to screen...", "current");
                     window.setTimeout(function () {
                        RenderAvailableUsers(callback, userList);
                     }, windowRefreshTiming);
                  }, forceReload);
               }, windowRefreshTiming);
            }

         }
         function LoadCurrentPromotedUsers(callback, forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }
            GetCurrentPromotedUsers(function (userList) {
               if (userList == null) {
                  userList = promotedUsers;
               }
               if (userList.length > maxPromotedUserDisplayCount) {
                  HidePromotionAreaMessageDisplay();
                  RenderTooManyUsersFound(callback, userList.length, "currentPromotionList");
               }
               else {
                  RenderCurrentPromotedUsers(callback, userList);
               }

            }, forceReload);
         }
         function LoadUserLists() {
            LoadAvailableUsers(function () {
               HideCurrentAreaMessageDisplay();
            });
            LoadCurrentPromotedUsers(function () {
               HidePromotionAreaMessageDisplay();
            });
         }
         /* Data Loading END */
         /* Data pulls START */
         function GetAvailableProjects(callback, forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (availableProjects != null && availableProjects.length > 0 && forceReload == false) {
               if (callback != null) {
                  callback(availableProjects);
               }
            }
            else {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "selfserve",
                     cmd: "getProjectList"
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let returnData = JSON.parse(data.projectList);
                     availableProjects.length = 0;
                     for (let i = 0; i < returnData.length; i++) {
                        availableProjects.push(returnData[i]);
                     }
                     if (callback != null) {
                        callback(returnData);
                     }
                  }
               });
            }
         }
         function GetAvailableLocations(callback, forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (availableLocations != null && availableLocations.length > 0 && forceReload == false) {
               if (callback != null) {
                  callback(availableLocations);
               }
            }
            else {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "selfserve",
                     cmd: "getLocationList"
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let returnData = JSON.parse(data.locationList);
                     availableLocations.length = 0;
                     for (let i = 0; i < returnData.length; i++) {
                        availableLocations.push(returnData[i]);
                     }
                     if (callback != null) {
                        callback(returnData);
                     }
                  }
               });
            }
         }
         function GetAvailableGroups(callback, forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (availableGroups != null && availableGroups.length > 0 && forceReload == false) {
               if (callback != null) {
                  callback(availableGroups);
               }
            }
            else {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "selfserve",
                     cmd: "getGroupList"
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let returnData = JSON.parse(data.groupList);
                     availableGroups.length = 0;
                     for (let i = 0; i < returnData.length; i++) {
                        availableGroups.push(returnData[i]);
                     }
                     if (callback != null) {
                        callback(returnData);
                     }
                  }
               });
            }
         }

         function GetAvailableSupervisors(callback, forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (availableSupervisors != null && availableSupervisors.length > 0 && forceReload == false) {
               if (callback != null) {
                  callback(availableSupervisors);
               }
            }
            else {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "selfserve",
                     cmd: "getSupervisorList",
                     userid: legacyContainer.scope.TP1Username,
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let returnData = JSON.parse(data.userProfileList);
                     availableSupervisors.length = 0;
                     for (let i = 0; i < returnData.length; i++) {
                        availableSupervisors.push(returnData[i]);
                     }
                     if (callback != null) {
                        callback(returnData);
                     }
                  }
               });
            }
         }
         function GetAvailableUsersCount(callback) {
            WriteUserMessage("Checking count of users based on criteria...", "current", 10000);
            let projectId = parseInt($("#currentListProjectIdFilter", element).val()) || -1;
            let locationId = parseInt($("#currentListLocationIdFilter", element).val()) || -1;
            let groupId = parseInt($("#currentListGroupIdFilter", element).val()) || -1;
            let firstName = $("#currentListFilterFirstName", element).val();
            let lastName = $("#currentListFilterLastName", element).val();
            let role = $("#currentListFilterPosition", element).val();
            a$.ajax({
               type: "POST",
               service: "C#",
               async: false,
               data: {
                  lib: "selfserve",
                  cmd: "GetFoundProfileCountForPromotionList",
                  projectid: projectId,
                  locationid: locationId,
                  groupid: groupId,
                  teamid: null,
                  supervisoruserid: null,
                  firstname: firstName,
                  lastname: lastName,
                  role: role
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (data) {
                  let returnData = parseInt(data.profileCount);
                  if (returnData == null) {
                     returnData = 0
                  }
                  if (callback != null) {
                     callback(returnData);
                  }
               }
            });
         }

         function GetAvailableUsers(callback, forceReload) {
            WriteUserMessage("Finding users based on criteria...", "current", 15000);
            $("#currentUsersList", element).empty();
            window.setTimeout(function () {
               let projectId = parseInt($("#currentListProjectIdFilter", element).val()) || -1;
               let locationId = parseInt($("#currentListLocationIdFilter", element).val()) || -1;
               let groupId = parseInt($("#currentListGroupIdFilter", element).val()) || -1;
               let firstName = $("#currentListFilterFirstName", element).val();
               let lastName = $("#currentListFilterLastName", element).val();
               let role = $("#currentListFilterPosition", element).val();

               if (forceReload == null) {
                  forceReload = false;
               }
               if (availableUsers != null && availableUsers.length > 0 && forceReload == false) {
                  if (callback != null) {
                     callback(availableUsers);
                  }
               }
               else {
                  a$.ajax({
                     type: "POST",
                     service: "C#",
                     async: true,
                     data: {
                        lib: "selfserve",
                        cmd: "getProfilesForPromotionList",
                        projectid: projectId,
                        locationid: locationId,
                        groupid: groupId,
                        teamid: null,
                        supervisoruserid: null,
                        firstname: firstName,
                        lastname: lastName,
                        role: role
                     },
                     dataType: "json",
                     cache: false,
                     error: a$.ajaxerror,
                     success: function (data) {
                        let returnData = JSON.parse(data.availableProfilesList);

                        availableUsers.length = 0;
                        for (let i = 0; i < returnData.length; i++) {
                           availableUsers.push(returnData[i]);
                        }
                        if (callback != null) {
                           callback(returnData);
                        }
                     }
                  });
               }
            }, 100);
         }
         function GetCurrentPromotedUsers(callback, forceReload) {
            WriteUserMessage("Getting list of current items...", "promotion");
            window.setTimeout(function () {
               if (forceReload == null) {
                  forceReload = false;
               }
               if (promotedUsers != null && promotedUsers.length > 0 && forceReload == false) {
                  if (callback != null) {
                     callback(promotedUsers);
                  }
               }
               else {
                  a$.ajax({
                     type: "POST",
                     service: "C#",
                     async: false,
                     data: {
                        lib: "selfserve",
                        cmd: "GetPendingPromotionRequests",
                     },
                     dataType: "json",
                     cache: false,
                     error: a$.ajaxerror,
                     success: function (data) {
                        let returnData = JSON.parse(data.pendingPromotionRequests);
                        promotedUsers.length = 0;
                        for (let i = 0; i < returnData.length; i++) {
                           promotedUsers.push(returnData[i]);
                        }
                        if (callback != null) {
                           callback(returnData);
                        }
                     }
                  });
               }
            }, windowRefreshTiming);
         }
         /* Data pulls END */
         /* Data Rendering START */
         function RenderProjectList(callback, listToRender) {
            if (listToRender == null) {
               listToRender = availableProjects;
            }

            listToRender = SortProjectList(listToRender, null);

            $("#newPositionProjectId", element).empty();
            $("#newPositionProjectId", element).append($(`<option />`, { value: "", text: "" }));

            $("#currentListProjectIdFilter", element).empty();
            $("#currentListProjectIdFilter", element).append($(`<option />`, { value: "", text: "" }));

            $(listToRender).each(function () {
               if (this.Status == "A") {
                  let projectOption = $(`<option />`, { value: this.Id, text: this.Name });
                  $("#newPositionProjectId", element).append(projectOption);

                  let projectFilterOption = $(`<option />`, { value: this.Id, text: this.Name });
                  $("#currentListProjectIdFilter", element).append(projectFilterOption);
               }
            });
            if (callback != null) {
               callback();
            }
         }
         function RenderLocationList(callback, listToRender) {
            if (listToRender == null) {
               listToRender = availableLocations;
            }
            listToRender = SortLocationList(listToRender, null);
            $("#newPositionLocationId", element).empty();
            $("#newPositionLocationId", element).append($(`<option />`, { value: "", text: "" }));

            $("#currentListLocationIdFilter", element).empty();
            $("#currentListLocationIdFilter", element).append($(`<option />`, { value: "", text: "" }));
            $(listToRender).each(function () {
               if (this.Status == "A") {
                  let locationOption = $(`<option />`, { value: this.Id, text: this.Name });
                  $("#newPositionLocationId", element).append(locationOption);

                  let locationFilterOption = $(`<option />`, { value: this.Id, text: this.Name });
                  $("#currentListLocationIdFilter", element).append(locationFilterOption);
               }
            });
            if (callback != null) {
               callback();
            }
         }
         function RenderGroupList(callback, listToRender) {
            if (listToRender == null) {
               listToRender = availableGroups;
            }
            listToRender = SortGroupList(listToRender, null);

            $("#currentListGroupIdFilter", element).empty();
            $("#currentListGroupIdFilter", element).append($(`<option />`, { value: "", text: "" }));

            $(listToRender).each(function () {
               if (this.Status == "A") {
                  let groupFilterOption = $(`<option />`, { value: this.Id, text: this.Name });
                  $("#currentListGroupIdFilter", element).append(groupFilterOption);
               }
            });
            if (callback != null) {
               callback();
            }
         }
         function RenderSupervisorList(callback, listToRender) {
            if (listToRender == null) {
               listToRender = availableSupervisors;
            }
            listToRender = SortUserProfilesList(listToRender, "firstname");
            $("#newPositionSupervisorUserId", element).empty();
            $("#newPositionSupervisorUserId", element).append($(`<option />`, { value: "", text: "" }));
            $(listToRender).each(function () {
               let supervisorOption = $(`<option />`, { value: this.UserId, text: this.Name });
               $("#newPositionSupervisorUserId", element).append(supervisorOption);
            });
            if (callback != null) {
               callback();
            }
         }
         function RenderAvailableUsers(callback, listToRender) {
            WriteUserMessage("Displaying available users...", "current");
            window.setTimeout(function () {
               if (listToRender == null) {
                  listToRender = availableUsers;
               }
               listToRender = SortUserProfilesList(listToRender, "firstname");
               $("#currentUsersList", element).empty();
               $("#currentUserListCount", element).empty();
               $("#currentUserListCount", element).text(listToRender.length);

               for (let uIndex = 0; uIndex <= listToRender.length; uIndex++) {
                  let userObject = listToRender[uIndex];
                  if (userObject != null) {
                     let userCurrentPosition = userObject?.UserRole;
                     let positionObject = availablePositions.find(u => u.id == userObject.UserRole);

                     if (positionObject != null) {
                        userCurrentPosition = positionObject.name;
                     }

                     let userHolder = $(`<div class="user-promotion-user-row-holder" />`);

                     let userAvatarHolder = $(`<div class="user-promotion-inline-item user-avatar-holder" />`);
                     let userAvatarUrl = defaultAvatarUrl;
                     if (userObject.AvatarImageFileName != "empty_headshot.png") {
                        userAvatarUrl = Global_CleanAvatarUrl(userObject.AvatarImageFileName);
                     }

                     let userAvatar = $(`<img id="userAvatar_${userObject.UserId}" class="user-avatar" src="${userAvatarUrl}" alt=" ${userObject.UserFullName} Avatar" width="25" />`);
                     userAvatarHolder.append(userAvatar);

                     let userNameHolder = $(`<div class="user-promotion-inline-item user-full-name-holder" />`);
                     userNameHolder.append(`${userObject.UserFullName} (${userObject.UserId})`);

                     let userCurrentPositionHolder = $(`<div class="user-promotion-inline-item user-current-position-holder" />`);
                     userCurrentPositionHolder.append(userCurrentPosition);

                     let userButtonHolder = $(`<div class="user-promotion-inline-item button-holder user-promotion-button-holder" />`);

                     let isOnCurrentPromoList = (promotedUsers.findIndex(pu => pu.UserId == userObject.UserId) > -1);

                     if (isOnCurrentPromoList == false) {
                        let userPromoteButton = $(`<button id="btnPromoteUser_${userObject.UserId}" class="button btn promote-user-button">Promote</button>`);

                        userPromoteButton.on("click", function () {
                           console.log(`Promote button clicked for ${this.id}`);
                           let buttonId = this.id;
                           let userId = buttonId.split("_")[1]
                           LoadForm(function () {
                              ShowForm();
                           }, userId);
                        });

                        userButtonHolder.append(userPromoteButton);
                     }
                     else {
                        userButtonHolder.append("Already on list");
                     }


                     userHolder.append(userAvatarHolder);
                     userHolder.append(userNameHolder);
                     userHolder.append(userCurrentPositionHolder);
                     userHolder.append(userButtonHolder);

                     $("#currentUsersList", element).append(userHolder);
                  }
               }
               ShowUserCountDisplay();
               if (callback != null) {
                  callback();
               }
            }, windowRefreshTiming);
         }
         function RenderCurrentPromotedUsers(callback, listToRender) {
            window.setTimeout(function () {
               if (listToRender == null) {
                  listToRender = promotedUsers;
               }
               let removedFromAvailable = false;
               $("#currentPromotionList", element).empty();
               if (listToRender.length == 0) {
                  $("#currentPromotionList", element).append("No current users found for promotions.");
               }
               else {
                  for (let uIndex = 0; uIndex < listToRender.length; uIndex++) {
                     let userPromotionObject = listToRender[uIndex];

                     let availableUserIndex = availableUsers.find(au => au.UserId == userPromotionObject.UserId);
                     if (availableUserIndex > -1) {
                        //let availUserObject = avaialableUsers.splice(availableUserIndex, 1)[0];
                        //remove the user from the available list.
                        availableUsers.splice(availableUserIndex, 1);
                        removedFromAvailable = true;
                     }

                     let userCurrentPosition = userPromotionObject.CurrentPosition;
                     let userNewPosition = userPromotionObject.NewPosition;
                     let positionObject = availablePositions.find(u => u.id == userPromotionObject.CurrentPosition);
                     if (positionObject != null) {
                        userCurrentPosition = positionObject.name;
                     }
                     let newPositionObject = availablePositions.find(u => u.id == userPromotionObject.NewPosition);
                     if (newPositionObject != null) {
                        userNewPosition = newPositionObject.name;
                     }

                     let userPotionSwitchText = $(`<span class="user-promotion-inline-item">&nbsp;<i class="fa fa-arrow-right-long" />&nbsp;</span>`);

                     let userHolder = $(`<div class="user-promotion-user-row-holder" />`);

                     let userAvatarHolder = $(`<div class="user-promotion-inline-item user-avatar-holder" />`);

                     let userAvatarUrl = defaultAvatarUrl;
                     let userDisplayName = userPromotionObject.UserId;
                     if (userPromotionObject.UserIdSource != null) {
                        if (userPromotionObject.UserIdSource.AvatarImageFileName != null && userPromotionObject.UserIdSource.AvatarImageFileName != "empty_headshot.png") {
                           userAvatarUrl = Global_CleanAvatarUrl(userPromotionObject.UserIdSource.AvatarImageFileName);
                        }
                        userDisplayName = userPromotionObject.UserIdSource.UserFullName;
                     }

                     let userAvatar = $(`<img id="userAvatar_${userPromotionObject.UserId}" class="user-avatar" src="${userAvatarUrl}" alt="${userDisplayName} Avatar" width="25" />`);
                     userAvatarHolder.append(userAvatar);

                     let userNameHolder = $(`<div class="user-promotion-inline-item user-full-name-holder" />`);
                     userNameHolder.append(`${userDisplayName} (${userPromotionObject.UserId})`);

                     let userPositionHolder = $(`<div class="user-promotion-inline-item user-positions-holder" />`);
                     userPositionHolder.append(userCurrentPosition);
                     userPositionHolder.append(userPotionSwitchText);
                     userPositionHolder.append(userNewPosition);

                     let userPromotionDateHolder = $(`<div class="user-promotion-inline-item user-promotion-date-holder" />`);
                     let userPromotionDate = new Date().toLocaleDateString();
                     if (userPromotionObject.NewPositionDate != null) {
                        userPromotionDate = new Date(userPromotionObject.NewPositionDate).toLocaleDateString();
                     }

                     userPromotionDateHolder.append(userPromotionDate);

                     let userButtonHolder = $(`<div class="user-promotion-inline-item user-promotion-button-holder" />`);
                     let removeUserButton = $(`<button id="btnRemoveUserPromotion_${userPromotionObject.UserId}" class="button btn remove-user-promotions-button"><i class="fa fa-minus" /></button>`);

                     removeUserButton.on("click", function () {
                        let buttonId = this.id;
                        let userId = buttonId.split("_")[1]
                        let userObjectIndex = promotedUsers.findIndex(u => u.UserId == userId);
                        let userDisplayName = userId;
                        if (promotedUsers[userObjectIndex].UserIdSource != null) {
                           userDisplayName = promotedUsers[userObjectIndex].UserIdSource.Name;
                        }
                        if (confirm(`You are about to remove the promotion for ${userDisplayName}.\nAre you sure?\nPress OK to confirm or CANCEL to leave.`)) {
                           RemovePromotionRequest(function () {
                              LoadAvailableUsers();
                              RenderCurrentPromotedUsers(function () {
                                 HidePromotionAreaMessageDisplay();
                              });
                           }, userId);
                        }
                     });
                     userButtonHolder.append(removeUserButton);

                     userHolder.append(userAvatarHolder);
                     userHolder.append(userNameHolder);
                     userHolder.append(userPositionHolder);
                     userHolder.append(userPromotionDateHolder);
                     userHolder.append(userButtonHolder);

                     $("#currentPromotionList", element).append(userHolder);
                  }

               }
               if (removedFromAvailable) {
                  RenderAvailableUsers();
               }
               if (callback != null) {
                  callback();
               }
            }, windowRefreshTiming);
         }
         function RenderTooManyUsersFound(callback, listCount, renderMessageToObjectId) {
            let messageText = `There are ${listCount} records that were found; this is too many.  Please use filters to narrow your search to limit the users to ${maxUserDisplayCount}.`;
            let tooManyUsersMessageHolder = $(`<div class="too-many-users-found-message-holder" />`);
            tooManyUsersMessageHolder.append(messageText);

            $(`#${renderMessageToObjectId}`, element).empty();
            $(`#${renderMessageToObjectId}`, element).append(tooManyUsersMessageHolder);
            HideUserCountDisplay();
            if (callback != null) {
               callback();
            }

         }
         /* Data Rendering END */
         /* Data Handling START */
         function SortUserProfilesList(listToSort, sortField) {
            if (sortField == null || sortField == "") {
               sortField = "lastname";
            }
            let sortedList = listToSort;
            switch (sortField.toUpperCase()) {
               case "lastname".toUpperCase():
                  sortedList = $(sortedList).sort((a, b) =>
                     (a.LastName > b.LastName) ? 1 :
                        (a.LastName === b.LastName) ? ((a.FirstName < b.FirstName) ? 1 : -1) :
                           -1);
                  break;
               case "firstname".toUpperCase():
                  sortedList = $(sortedList).sort((a, b) =>
                     (a.FirstName > b.FirstName) ? 1 :
                        (a.FirstName === b.FirstName) ? ((a.LastName < b.LastName) ? 1 : -1) :
                           -1);
                  break;
            }
            return sortedList;
         }
         function SortGroupList(listToSort, sortField)
         {
            if(sortField == null || sortField == "")
            {
               sortField = "groupname";
            }
            let sortedList = listToSort;
            
            switch(sortField.toLowerCase())
            {
               case "groupname":
                  sortedList = $(sortedList).sort((a,b) => (a.Name > b.Name) ? 1 :
                  (a.Name < b.Name) ? -1 : 0);
                  break;               
            }
            return sortedList;
         }
         function SortLocationList(listToSort, sortField)
         {
            if(sortField == null || sortField == "")
            {
               sortField = "locationname";
            }
            let sortedList = listToSort;
            switch(sortField.toLowerCase())
            {
               case "locationname":
                  sortedList = $(sortedList).sort((a,b) => (a.Name > b.Name) ? 1 :
                  (a.Name < b.Name) ? -1 : 0);
                  break;               
            }
            return sortedList;
         }
         
         function SortProjectList(listToSort, sortField)
         {
            if(sortField == null || sortField == "")
            {
               sortField = "projectname";
            }
            let sortedList = listToSort;
            switch(sortField.toLowerCase())
            {
               case "projectname":
                  sortedList = $(sortedList).sort((a,b) => (a.Name > b.Name) ? 1 :
                  (a.Name < b.Name) ? -1 : 0);
                  break;               
            }
            return sortedList;
         }
         function LoadForm(callback, userId) {
            let userObject = availableUsers.find(u => u.UserId == userId);
            if (userObject == null) {
               userObject = promotedUsers.find(u => u.UserId == userId);
            }
            if (userObject != null) {
               $("#txtUserNameToPromote", element).val(userObject.UserId);
               $("#lblUserNameToPromote", element).text(userObject.UserFullName);
               let positionName = userObject.UserRole;
               let posObject = availablePositions.find(p => p.id == userObject.UserRole);
               if (posObject != null) {
                  positionName = posObject.name;
               }
               $("#lblCurrentPosition", element).append(positionName);
            }
            if (callback != null) {
               callback();
            }
         }
         function ClearForm(callback) {
            $("#txtUserNameToPromote", element).val("");
            $("#lblUserNameToPromote", element).text("");
            $("#lblCurrentPosition", element).empty();
            $("#userNewPosition", element).val("");
            $("#promotionDate", element).val("");
            $("#newPositionProjectId", element).val("");
            $("#newPositionLocationId", element).val("");
            $("#newPositionSupervisorUserId", element).val("");

            $(".error-information-holder", element).empty();
            $(".error-information-holder", element).html("");
            $(".error-information-holder", element).hide();
            $(".errorField", element).each(function () {
               $(this).removeClass("errorField");
            });


            if (callback != null) {
               callback();
            }
         }
         function SaveForm(callback) {
            let userId = $("#txtUserNameToPromote", element).val();
            let userObjectIndex = availableUsers.findIndex(u => u.UserId == userId);
            let userObject = null;
            if (userObjectIndex > -1) {
               //userObject = availableUsers.splice(userObjectIndex, 1)[0];
               userObject = availableUsers[userObjectIndex];
            }
            let userPromotionRequestObject = BuildPromotionRequestObject(userId, userObject);
            promotedUsers.push(userPromotionRequestObject);

            if (callback != null) {
               callback();
            }
         }
         function ValidateForm(callback) {
            let formValid = true;
            let errorMessages = [];
            let newPositionSelected = $("#userNewPosition", element).val();
            let newPositionDate = $("#promotionDate", element).val();
            let newProjectId = $("#newPositionProjectId", element).val();
            let newLocationId = $("#newPositionLocationId", element).val();
            let newSupervisorUserId = $("#newPositionSupervisorUserId", element).val();


            if (newPositionSelected == null || newPositionSelected == "") {
               errorMessages.push({ message: "New Position Required", fieldclass: "", fieldid: "userNewPosition" });
               formValid = false;
            }
            if (newPositionDate == null || newPositionDate == "") {
               errorMessages.push({ message: "Start Date of New Position Required", fieldclass: "", fieldid: "promotionDate" });
               formValid = false;
            }
            if (newProjectId == null || newProjectId == "") {
               errorMessages.push({ message: "Project Required", fieldclass: "", fieldid: "newPositionProjectId" });
               formValid = false;
            }
            if (newLocationId == null || newLocationId == "") {
               errorMessages.push({ message: "Location Required", fieldclass: "", fieldid: "newPositionLocationId" });
               formValid = false;
            }
            if (newSupervisorUserId == null || newSupervisorUserId == "") {
               errorMessages.push({ message: "New Supervisor Required", fieldclass: "", fieldid: "newPositionSupervisorUserId" });
               formValid = false;
            }

            if (formValid) {
               if (callback != null) {
                  callback();
               }
            }
            else {
               var messageString = "";
               if (errorMessages.length > 0) {
                  messageString += "<i class=\"fas fa-exclamation-triangle\"></i> <strong>Correct the following errors:</strong> <ul>";
               }
               for (var m = 0; m < errorMessages.length; m++) {
                  let item = errorMessages[m];

                  messageString += "<li>" + item.message + "</li>";
                  if (item.fieldclass != "") {
                     $(item.fieldclass, element).addClass("errorField");
                     $(item.fieldclass, element).off("blur").on("blur", function () {
                        $(this).removeClass("errorField");
                     });
                  }
                  else if (item.fieldid != "") {
                     $("#" + item.fieldid, element).addClass("errorField");
                     $("#" + item.fieldid, element).off("blur").on("blur", function () {
                        $(this).removeClass("errorField");
                     });
                  }
               }
               if (messageString != "") {
                  messageString += "</ul>";

                  $(".error-information-holder", element).html(messageString);
                  $(".error-information-holder", element).show();
               }

            }
         }
         function DoPromotions(callback) {
            if (promotedUsers != null && promotedUsers.length > 0) {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "selfserve",
                     cmd: "SavePromotionRequestList",
                     promotionRequestList: JSON.stringify(promotedUsers),
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     if (callback != null) {
                        callback();
                     }
                  }
               });
            }
            else {
               alert("No user promotions to save.");
               if (callback != null) {
                  callback();
               }
            }
         }
         function BuildPromotionRequestObject(userId, currentUserObject) {
            let projectId = $("#newPositionProjectId", element).val();
            let locationId = $("#newPositionLocationId", element).val();
            let newPosition = $("#userNewPosition", element).val();
            let newPositionDate = $("#promotionDate", element).val();
            let newSupervisorUserId = $("#newPositionSupervisorUserId", element).val();

            let returnObject = promotedUsers.find(u => u.UserId == userId);

            if (returnObject == null) {
               returnObject = new Object();
               returnObject.UserPromotionRequestId = -1;
               returnObject.UserId = userId;
               returnObject.CurrentPosition = currentUserObject?.UserRole || "";
               returnObject.IsRequestComplete = false;
               returnObject.RequestCompleteDate = null;
               returnObject.EntBy = legacyContainer.scope.TP1Username;
            }
            else {
               returnObject.UpdBy = legacyContainer.scope.TP1Username;
               returnObject.UpdDt = new Date();
            }
            if (currentUserObject != null) {
               returnObject.UserIdSource = currentUserObject;
            }

            returnObject.ProjectId = projectId;
            returnObject.LocationId = locationId;
            returnObject.NewPosition = newPosition;
            returnObject.NewPositionDate = new Date(newPositionDate).toLocaleDateString();
            returnObject.NewSupervisorUserId = newSupervisorUserId;
            returnObject.RequestedByUserId = legacyContainer.scope.TP1Username;
            returnObject.RequestedOn = new Date().toLocaleDateString();

            return returnObject;

         }
         function RemovePromotionRequest(callback, userId) {
            let userObjectIndex = promotedUsers.findIndex(u => u.UserId == userId);
            let requestObject = promotedUsers.splice(userObjectIndex, 1)[0];

            if (requestObject.UserPromotionRequestId > 0) {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "selfserve",
                     cmd: "RemovePendingPromotionRequest",
                     idToRemove: requestObject.UserPromotionRequestId,
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     availableUsers.length = 0;
                     promotedUsers.length = 0;
                     let newPendingList = JSON.parse(data.pendingPromotionRequests);
                     for (let i = 0; i < newPendingList.length; i++) {
                        promotedUsers.push(newPendingList[i]);
                     }

                     if (callback != null) {
                        callback();
                     }
                  }
               });
            }

         }
         /* Data Handling END */
         /* Filter Handling START */
         function ClearCurrentListFilter(callback) {
            $("#currentListProjectIdFilter", element).val("");
            $("#currentListLocationIdFilter", element).val("");
            $("#currentListGroupIdFilter", element).val("");
            $("#currentListFilterFirstName", element).val("");
            $("#currentListFilterLastName", element).val("");
            $("#currentListFilterPosition", element).val("");

            if (callback != null) {
               callback();
            }
         }
         function ApplyCurrentListFilter(callback, listToFilter) {
            WriteUserMessage("Applying filters to user list...", "current");
            window.setTimeout(function () {
               if (listToFilter == null) {
                  listToFilter = availableUsers;
               }
               let filteredList = listToFilter;

               let firstNameFilter = $("#currentListFilterFirstName", element).val() || "";
               let lastNameFilter = $("#currentListFilterLastName", element).val() || "";
               let positionFilter = $("#currentListFilterPosition", element).val() || "";

               if (firstNameFilter != "") {
                  filteredList = filteredList.filter(x => x.FirstName.toLowerCase().includes(firstNameFilter.toLowerCase()));
               }
               if (lastNameFilter != "") {
                  filteredList = filteredList.filter(x => x.LastName.toLowerCase().includes(lastNameFilter.toLowerCase()));
               }
               if (positionFilter != "") {
                  filteredList = filteredList.filter(x => x.UserRole == positionFilter);
               }
               if (callback != null) {
                  callback(filteredList);
               }
            }, windowRefreshTiming);
         }

         function ClearPromotionListFilter(callback) {
            // $("#promotionListFilterFirstName", element).val("");
            // $("#promotionListFilterLastName", element).val("");
            // $("#promotionListFilterPosition", element).val("");
            if (callback != null) {
               callback();
            }
         }
         function ApplyPromotionListFilter(callback, listToFilter) {
            if (listToFilter == null) {
               listToFilter = promotedUsers;
            }
            let filteredList = listToFilter;

            // let firstNameFilter = $("#promotionListFilterFirstName", element).val();
            // let lastNameFilter = $("#promotionListFilterLastName", element).val();
            // let positionFilter = $("#promotionListFilterPosition", element).val();

            // if(firstNameFilter != "")
            // {
            //    filteredList = filteredList.filter(x => x.FirstName.toLowerCase().includes(firstNameFilter.toLowerCase()));
            // }
            // if(lastNameFilter != "")
            // {
            //    filteredList = filteredList.filter(x => x.LastName.toLowerCase().includes(lastNameFilter.toLowerCase()));
            // }
            // if(positionFilter != "")
            // {
            //    filteredList = filteredList.filter(x => x.NewPosition == positionFilter);
            // }

            if (callback != null) {
               callback(filteredList);
            }
         }
         /* Filter Handling END */
         /* User Message Writing START */
         function WriteUserMessage(messageString, messageArea, timeout) {
            let messageLabelObject = $("#usermessageLabel_Overall", element);
            let showFunction = ShowPageMessageDisplay;
            switch (messageArea.toLowerCase()) {
               case "current".toLowerCase():
                  messageLabelObject = $("#usermessageLabel_Current", element);
                  showFunction = ShowCurrentAreaMessageDisplay;
                  break;
               case "promotion".toLowerCase():
                  messageLabelObject = $("#usermessageLabel_Promote", element);
                  showFunction = ShowPromotionAreaMessageDisplay;
                  break;
            }
            messageLabelObject.empty();
            messageLabelObject.append(messageString);

            if (showFunction != null) {
               showFunction();
            }

         }
         /* User Message Writing END */
         /* Hide/Show START */
         function HideAll(callback) {
            HideForm();
            HideUserCountDisplay();
            HidePageMessageDisplay();
            HideCurrentAreaMessageDisplay();
            HidePromotionAreaMessageDisplay();
            if (callback != null) {
               callback();
            }
         }
         function ShowForm() {
            $("#promotionFormHolder", element).show();
         }
         function HideForm() {
            $("#promotionFormHolder", element).hide();
         }
         function HideUserCountDisplay() {
            $("#userCountDisplayHolder", element).hide();
         }
         function ShowUserCountDisplay() {
            $("#userCountDisplayHolder", element).show();
         }
         function ShowPageMessageDisplay(timeToDisplay) {
            if (timeToDisplay == null) {
               timeToDisplay = displayTime_Default;
            }
            $("#userMessagingHolder_OverallPage", element).show();
            window.setTimeout(function () {
               HidePageMessageDisplay();
            }, timeToDisplay);
         }
         function HidePageMessageDisplay() {
            $("#userMessagingHolder_OverallPage", element).hide();
         }
         function ShowCurrentAreaMessageDisplay(timeToDisplay) {
            if (timeToDisplay == null) {
               timeToDisplay = displayTime_Default;
            }
            $("#userMessagingHolder_CurrentArea", element).show();
            window.setTimeout(function () {
               HideCurrentAreaMessageDisplay();
            }, timeToDisplay);
         }
         function HideCurrentAreaMessageDisplay() {
            $("#userMessagingHolder_CurrentArea", element).hide();
         }
         function ShowPromotionAreaMessageDisplay(timeToDisplay) {
            if (timeToDisplay == null) {
               timeToDisplay = displayTime_Default;
            }
            $("#userMessagingHolder_PromoteArea", element).show();
            window.setTimeout(function () {
               HidePromotionAreaMessageDisplay();
            }, timeToDisplay);
         }
         function HidePromotionAreaMessageDisplay() {
            $("#userMessagingHolder_PromoteArea", element).hide();
         }
         /* Hide/Show END */
         scope.load = function () {
            scope.Initialize();
            LoadUserLists();
         };
         //scope.load();
         ko.postbox.subscribe("UserPromotionManagerLoad", function () {
            scope.load();
         });
      }
   };
}]);