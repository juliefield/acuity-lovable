angularApp.directive("ngMyTeamManager", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/ACUITYADMIN1/view/myTeamManager.htm?' + Date.now(),
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
         HideEditorForm();
         /* directive variables START */
         let windowRefreshTiming = 500;
         let displayTime_Default = 5000;
         //let displayTime_shortRunning = 7500;
         //let displayTime_MediumRunning = 15000;
         let displayTime_LongRunning = 60000;
         var defaultAvatarUrl = window.location.protocol + "//" + window.location.hostname + "/jq/avatars/empty_headshot.png";

         let myTeamUsersList = [];
         let userPoolList = [];
         let otherTeamsUserList = [];
         let possibleTeamsList = [];
         let futureMoveRequests = [];
         let myTeamOptionsList = [];
         let myAdminTeamOptionsList = [];
         let possibleProjectsList = [];
         let possibleGroupsList = [];
         let possibleLocationsList = [];
         /* directive variables END */

         /* Events Start */
         $("#instructions", element).off("click").on("click", function () {
            ToggleInstructions();
         });
         $("#close-instructions", element).off("click").on("click", function () {
            ToggleInstructions();
         });
         $("#myTeamSelector", element).off("change").on("change", function () {
            WriteUserMessage("Loading new team information...", 5000);
            window.setTimeout(function () {
               HandleMyTeamSelectionChange(function () {
                  $("#btnFilterUserPoolList", element).click();
                  $("#btnClearOtherTeamFilter", element).click();
                  HideUserMessage();
               });
            }, windowRefreshTiming);
         });

         //    ko.postbox.publish("myTeamManagerLoad");
         // });
         $("#otherTeamProjectIdFilter", element).off("change").on("change", function () {
            HandleFilterChange(function () {
               LimitFilterListItems();
            }, "project");
         });
         $("#otherTeamLocationIdFilter", element).off("change").on("change", function () {
            HandleFilterChange(function () {
               LimitFilterListItems();
            }, "location");
         });
         $("#otherTeamGroupIdFilter", element).off("change").on("change", function () {
            HandleFilterChange(function () {
               LimitFilterListItems();
            }, "group");

         });
         $(".btn-close", element).off("click").on("click", function () {
            ClearEditorForm(function () {
               HideEditorForm();
            });
         });
         $("#btnSaveEditorForm", element).off("click").on("click", function () {
            ValidateEditorForm(function () {
               ConfirmEditorAction(function () {
                  SaveEditorForm(function () {
                     ClearEditorForm();
                     HideEditorForm();

                     ko.postbox.publish("myTeamManagerReload");
                  });
               });
            });
         });
         $("#btnFilterUserPoolList", element).off("click").on("click", function () {
            WriteUserPoolLoadingMessage("Loading users in the pool based on your filters...", displayTime_LongRunning);
            window.setTimeout(function () {
               GetPoolUsersListing(function (poolUsers) {
                  RenderPoolUserListing(function () {
                     HideUserMessage();
                     HideShowUserPoolListLoading();
                  }, poolUsers);
               }, true);
            }, windowRefreshTiming);
         });
         $("#btnClearUserPoolFilter", element).off("click").on("click", function () {
            $("#poolUserFirstName", element).val("");
            $("#poolUserLastName", element).val("");
            $("#btnFilterUserPoolList", element).click();
         });
         $("#btnRefreshUserPoolList", element).off("click").on("click", function () {
            userPoolList.length = 0;
            LoadUserPoolList();
         });
         $("#btnFilterOtherTeamList", element).off("click").on("click", function () {
            WriteOtherTeamLoadingMessage("Applying filters to other teams..", 5000);
            $("#otherTeamListHolder", element).empty();
            window.setTimeout(function () {
               GetOtherTeamsUsersListing(function (otherUsers) {
                  RenderOtherTeamUserListing(function () {
                     HideUserMessage();
                     HideOtherTeamListLoader();
                  }, otherUsers);
               });
            }, windowRefreshTiming);
         });
         $("#btnClearOtherTeamFilter", element).off("click").on("click", function () {
            otherTeamsUserList.length = 0;
            HandleFilterChange(function () {
               HideUserMessage();
               $("#btnFilterOtherTeamList", element).click();
            }, "all");
         });
         $("#btnRefreshMyTeam", element).off("click").on("click", function(){
            console.log("Refresh My Team Clicked.");
            scope.load();
         });
         /* Events End */

         scope.Initialize = function () {
            HideAll();
            SetDatePickerFields();
            let isUserAdminUser = isAdminUser();
            LoadMyTeamsOptionList(function (myTeamList) {
               if (isUserAdminUser == true) {
                  LoadMyAdminTeamsOptionsList();
               }
               LoadMyTeamsOptions(null, myTeamList);
            });
            LoadFutureMoveRequests();
            LoadAllFilterLists();


         };

         function SetDatePickerFields() {
            $("#userTeamEffectiveDate", element).datepicker();
         }
         /* Data Loading Functions START */
         function LoadAllFilterLists(callback) {
            LoadPossibleProjects(function () {
               LoadProjectsListFilter();
            });
            LoadPossibleLocations(function () {
               LoadLocationOptionsFilterList();
            });
            LoadPossibleGroups(function () {
               LoadGroupOptionsFilterList();
            });
            LoadPossibleTeams(function () {
               LoadTeamOptionsFilterList();
            });

            if (callback != null) {
               callback();
            }
         }
         function LoadFutureMoveRequests(callback) {
            a$.ajax({
               type: "POST",
               service: "C#",
               async: false,
               data: {
                  lib: "selfserve",
                  // cmd: "GetFutureMoveRequestsForSupervisor",
                  // userid: legacyContainer.scope.TP1Username //TODO: Use filter options?
                  cmd: "GetFutureMoveRequests",
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (data) {
                  let returnData = JSON.parse(data.futureTeamMovesList);
                  futureMoveRequests.length = 0;
                  for (let i = 0; i < returnData.length; i++) {
                     futureMoveRequests.push(returnData[i]);
                  }
                  if (callback != null) {
                     callback(returnData);
                  }
               }
            });
         }
         function LoadMyTeamsOptionList(callback) {
            if (myTeamOptionsList != null && myTeamOptionsList.length > 0) {
               if (callback != null) {
                  callback(myTeamOptionsList);
               }
               else {
                  return myTeamOptionsList;
               }
            }
            else {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "selfserve",
                     cmd: "getMySupervisedTeamsOnly",
                     userid: legacyContainer.scope.TP1Username //TODO: Use filter options?
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let returnData = JSON.parse(data.mySupervisedTeamsList);                     
                     myTeamOptionsList.length = 0;
                     for (let i = 0; i < returnData.length; i++) {
                        myTeamOptionsList.push(returnData[i]);
                     }
                     if (callback != null) {
                        callback(returnData);
                     }
                  }
               });
            }
         }
         function LoadMyAdminTeamsOptionsList(callback) {
            if (myAdminTeamOptionsList != null && myAdminTeamOptionsList.length > 0) {
               if (callback != null) {
                  callback(myAdminTeamOptionsList);
               }
               else {
                  return myAdminTeamOptionsList;
               }
            }
            else {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "selfserve",
                     cmd: "getTeamListExcludeProfile",
                     deepLoad: false,
                     excludeIneligile: false
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let returnData = JSON.parse(data.teamList)
                     myAdminTeamOptionsList.length = 0;
                     for (let i = 0; i < returnData.length; i++) {
                        myAdminTeamOptionsList.push(returnData[i]);
                     }
                     if (callback != null) {
                        callback(myAdminTeamOptionsList);
                     }
                  }
               });
            }

         }
         function LoadPossibleProjects(callback, forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }

            if (possibleProjectsList != null && possibleProjectsList.length > 0 && forceReload == false) {
               if (callback != null) {
                  callback(possibleProjectsList);
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
                     possibleProjectsList.length = 0;
                     for (let i = 0; i < returnData.length; i++) {
                        possibleProjectsList.push(returnData[i]);
                     }
                     if (callback != null) {
                        callback(returnData);
                     }
                  }
               });
            }
         }
         function LoadPossibleLocations(callback, forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }

            if (possibleLocationsList != null && possibleLocationsList.length > 0 && forceReload == false) {
               if (callback != null) {
                  callback(possibleLocationsList);
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
                     possibleLocationsList.length = 0;
                     for (let i = 0; i < returnData.length; i++) {
                        possibleLocationsList.push(returnData[i]);
                     }
                     if (callback != null) {
                        callback(returnData);
                     }
                  }
               });
            }
         }
         function LoadPossibleGroups(callback, forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }

            if (possibleGroupsList != null && possibleGroupsList.length > 0 && forceReload == false) {
               if (callback != null) {
                  callback(possibleGroupsList);
               }
            }
            else {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "selfserve",
                     cmd: "getGroupList",
                     deepLoad: false
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let returnData = JSON.parse(data.groupList);
                     possibleGroupsList.length = 0;
                     for (let i = 0; i < returnData.length; i++) {
                        possibleGroupsList.push(returnData[i]);
                     }
                     if (callback != null) {
                        callback(returnData);
                     }
                  }
               });
            }
         }
         function LoadPossibleTeams(callback) {
            a$.ajax({
               type: "POST",
               service: "C#",
               async: false,
               data: {
                  lib: "selfserve",
                  cmd: "getAllOtherTeams",
                  userid: legacyContainer.scope.TP1Username //TODO: Use filter options?
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (data) {
                  let returnData = JSON.parse(data.otherTeamsList);
                  possibleTeamsList.length = 0;
                  for (let i = 0; i < returnData.length; i++) {
                     possibleTeamsList.push(returnData[i]);
                  }

                  if (callback != null) {
                     callback(returnData);
                  }
               }
            });
            //
         }
         function LoadMyTeamsOptions(callback, teamList) {
            if (teamList == null) {
               teamList = myTeamOptionsList;
            }
            teamList = SortTeamList(teamList, null);
            myAdminTeamOptionsList = SortTeamList(myAdminTeamOptionsList, null);

            $("#myTeamSelector", element).empty();
            $("#myTeamSelector", element).append($('<option />', { value: "", text: "---- My Teams ----" }));

            for (let tIndex = 0; tIndex < teamList.length; tIndex++) {
               let teamItem = teamList[tIndex];
               let teamName = teamItem.TeamNameWithProject;
               if (teamName == null || teamName == "") {
                  teamName = teamItem.TeamName;
               }
               $("#myTeamSelector", element).append($('<option />', { value: teamItem.TeamId, text: teamName }));
            }
            if (myAdminTeamOptionsList != null && myAdminTeamOptionsList.length > 0) {
               $("#myTeamSelector", element).append($('<option />', { value: -2, text: "---- Other Teams ----" }));
               for (let atIndex = 0; atIndex < myAdminTeamOptionsList.length; atIndex++) {
                  let adminTeamItem = myAdminTeamOptionsList[atIndex];
                  let teamName = adminTeamItem.TeamNameWithProject;
                  if (teamName == null || teamName == "") {
                     teamName = adminTeamItem.TeamName;
                  }
                  $("#myTeamSelector", element).append($('<option />', { value: adminTeamItem.TeamId, text: teamName }));
               }
            }

            if (teamList.length == 1) {
               $("#myTeamSelector", element).val(teamList[0].TeamId);
            }
            if (callback != null) {
               callback();
            }
         }
         function LoadUserListings(callback) {
            WriteUserMessage("Loading listings...", displayTime_Default);
            window.setTimeout(function () {
               GetMyTeamListing(function (myTeamList) {
                  RenderMyTeamListing(function () {
                     //HideUserMessage();
                  }, myTeamList);
               });
               LoadPoolUsersListing(function () {
                  //HideUserMessage();
               });
               LoadOtherTeamsUsersListings(function () {
                  //HideUserMessage();
               });
               if (callback != null) {
                  callback();
               }
            }, windowRefreshTiming);
         }
         function LoadPoolUsersListing(callback, forceReload) {
            WriteUserPoolLoadingMessage("Getting Users in pool...", displayTime_Default);
            GetPoolUsersListing(function (poolUsers) {
               let userCount = poolUsers.length || 0;
               RenderUserCount(userCount, "usersInPoolCount");
               RenderPoolUserListing(function () {
                  HideShowUserPoolListLoading();
                  if (callback != null) {
                     callback();
                  }
               }, poolUsers);
            }, forceReload);
         }
         function LoadOtherTeamsUsersListings(callback) {
            GetOtherTeamsUsersListing(function (otherUsers) {
               RenderOtherTeamUserListing(callback, otherUsers);
            });

         }
         function GetMyTeamListing(callback, forceReload) {
            WriteUserMessage("Getting my team listing...", displayTime_LongRunning);
            if (forceReload == null) {
               forceReload = false;
            }

            if (myTeamUsersList != null && myTeamUsersList.length > 0 && forceReload == false) {
               if (callback != null) {
                  callback(myTeamUsersList);
               }
               return myTeamUsersList;
            }
            else {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "selfserve",
                     cmd: "getUsersForTeamBySupervisorUserId",
                     userid: legacyContainer.scope.TP1Username //TODO: Use filter options?
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let returnData = JSON.parse(data.teamUserProfiles);
                     myTeamUsersList.length = 0;
                     for (let i = 0; i < returnData.length; i++) {
                        myTeamUsersList.push(returnData[i]);
                     }

                     if (callback != null) {
                        callback(returnData);
                     }
                  }
               });
            }
         }
         function LoadUserPoolList() {
            WriteUserPoolLoadingMessage("Loading User Pool List...", displayTime_LongRunning);
            window.setTimeout(function () {
               GetPoolUsersListing(function (poolUsers) {
                  RenderPoolUserListing(function () {
                     HideUserMessage();
                     HideShowUserPoolListLoading();
                  }, poolUsers);
               });
            }, windowRefreshTiming);
         }
         function GetPoolUsersListing(callback, forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }
            WriteUserMessage("Getting available pool users..");
            let poolUserFirstNameFilter = $("#poolUserFirstName", element).val();
            let poolUserLastNameFilter = $("#poolUserLastName", element).val();
            if (userPoolList != null && userPoolList.length > 0 && forceReload == false) {
               if (callback != null) {
                  callback(userPoolList);
               }
            }
            else {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "selfserve",
                     cmd: "getUsersInPool",
                     poolUserFirstName: poolUserFirstNameFilter,
                     poolUserLastName: poolUserLastNameFilter
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let returnData = JSON.parse(data.poolUserProfiles);
                     userPoolList.length = 0;
                     for (let i = 0; i < returnData.length; i++) {
                        userPoolList.push(returnData[i]);
                     }
                     if (callback != null) {
                        callback(returnData);
                     }
                  }
               });
            }
         }
         function GetOtherTeamsUsersListing(callback) {
            let otherTeamIdFilter = $("#otherTeamUserTeamIdFilter", element).val();
            let otherTeamFirstNameFilter = $("#otherTeamUserFirstNameFilter", element).val();
            let otherTeamLastNameFilter = $("#otherTeamUserLastNameFilter", element).val();

            if (otherTeamIdFilter == null || otherTeamIdFilter == "") {
               otherTeamIdFilter = -1;
            }
            if (otherTeamIdFilter == -1 && otherTeamFirstNameFilter == "" && otherTeamLastNameFilter == "") {
               if (callback != null) {
                  callback(null);
               }
            }
            else {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "selfserve",
                     cmd: "getUsersFromOtherTeams",
                     otherteamId: otherTeamIdFilter,
                     otherteamFirstName: otherTeamFirstNameFilter,
                     otherTeamLastName: otherTeamLastNameFilter
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let returnData = JSON.parse(data.otherTeamUserProfiles);
                     otherTeamsUserList.length = 0;
                     for (let i = 0; i < returnData.length; i++) {
                        otherTeamsUserList.push(returnData[i]);
                     }
                     if (callback != null) {
                        callback(returnData);
                     }
                  }
               });
            }
         }
         function LoadUsersByTeamId(callback, teamIdToLoad) {
            a$.ajax({
               type: "POST",
               service: "C#",
               async: false,
               data: {
                  lib: "selfserve",
                  cmd: "getTeamById",
                  teamid: teamIdToLoad,
                  deepLoad: true
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (data) {
                  let returnData = JSON.parse(data.team);
                  if (returnData.AssignedUsers != null && returnData.AssignedUsers.length > 0) {
                     myTeamUsersList.length = 0;
                     for (let i = 0; i < returnData.AssignedUsers.length; i++) {
                        myTeamUsersList.push(returnData.AssignedUsers[i]);
                     }
                  }
                  if (callback != null) {
                     callback(returnData.AssignedUsers);
                  }
               }
            });
         }
         function HandleMyTeamSelectionChange(callback) {
            let teamId = $("#myTeamSelector", element).val();
            LoadUsersByTeamId(function (teamList) {
               teamList = SortUserProfilesList(teamList, "lastname");
               RenderMyTeamListing(callback, teamList);
            }, teamId);


         }
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
         function SortTeamList(listToSort, sortField)
         {
            if(sortField == null || sortField == "")
            {
               sortField = "teamname";
            }
            let sortedList = listToSort;
            switch(sortField.toLowerCase())
            {
               case "teamname":
                  sortedList = $(sortedList).sort((a,b) => (a.Name > b.Name) ? 1 :
                  (a.Name < b.Name) ? -1 : 0);
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
         /* Data Loading Functions END */
         /* Filtering Options List Loading START */
         function LoadProjectsListFilter(callback) {
            $("#otherTeamProjectIdFilter", element).empty();
            $("#otherTeamProjectIdFilter", element).append($('<option />', { value: "", text: "" }));
            let projectsListToRender = possibleProjectsList;
            projectsListToRender = SortProjectList(projectsListToRender, null);

            if (projectsListToRender != null && projectsListToRender.length > 0) {
               for (var i = 0; i < projectsListToRender.length; i++) {
                  var item = projectsListToRender[i];
                  $("#otherTeamProjectIdFilter", element).append($('<option />', { value: item.ProjectId, text: item.Name }));
               }
            }
            if (callback != null) {
               callback();
            }
         }
         function LoadLocationOptionsFilterList(callback, listToRender, selectedId) {
            if (listToRender == null) {
               listToRender = possibleLocationsList;
            }
            listToRender = SortLocationList(listToRender, null);

            $("#otherTeamLocationIdFilter", element).empty();
            $("#otherTeamLocationIdFilter", element).append($('<option />', { value: "", text: "" }));
            if (listToRender != null && listToRender.length > 0) {

               for (var i = 0; i < listToRender.length; i++) {
                  var item = listToRender[i];
                  $("#otherTeamLocationIdFilter", element).append($('<option />', { value: item.LocationId, text: item.Name }));
               }
            }
            if (selectedId != null) {
               $("#otherTeamLocationIdFilter", element).val(selectedId);
            }
            if (callback != null) {
               callback();
            }
         }
         function LoadGroupOptionsFilterList(callback, listToRender, selectedId) {
            if (listToRender == null) {
               listToRender = possibleGroupsList;
            }
            listToRender = SortGroupList(listToRender, null);

            $("#otherTeamGroupIdFilter", element).empty();
            $("#otherTeamGroupIdFilter", element).append($('<option />', { value: "", text: "" }));
            if (listToRender != null && listToRender.length > 0) {
               for (var i = 0; i < listToRender.length; i++) {
                  var item = listToRender[i];
                  $("#otherTeamGroupIdFilter", element).append($('<option />', { value: item.GroupId, text: item.GroupName }));
               }
            }
            if (selectedId != null) {
               $("#otherTeamGroupIdFilter", element).val(selectedId);
            }
            if (callback != null) {
               callback();
            }
         }
         function LoadTeamOptionsFilterList(callback, listToRender, selectedId) {
            if (listToRender == null) {
               listToRender = possibleTeamsList;
            }
            listToRender = SortTeamList(listToRender, null);

            $("#otherTeamUserTeamIdFilter", element).empty();
            $("#otherTeamUserTeamIdFilter", element).append($('<option />', { value: "", text: "" }));

            if (listToRender != null && listToRender.length > 0) {
               for (var i = 0; i < listToRender.length; i++) {
                  var item = listToRender[i];
                  let teamName = item.TeamNameWithProject;
                  if (teamName == null || teamName == "") {
                     teamName = item.TeamName;
                  }
                  $("#otherTeamUserTeamIdFilter", element).append($('<option />', { value: item.TeamId, text: teamName }));
               }
            }
            if (selectedId != null) {
               $("#otherTeamUserTeamIdFilter", element).val(selectedId);
            }
            if (callback != null) {
               callback();
            }
         }
         function HandleFilterChange(callback, filterChanged) {
            let changeArray = ["otherTeamUserTeamIdFilter"];
            switch (filterChanged.toLowerCase()) {
               case "location".toLowerCase():
                  changeArray.push("otherTeamGroupIdFilter");
                  break;
               case "project".toLowerCase():
                  changeArray.push("otherTeamGroupIdFilter");
                  changeArray.push("otherTeamLocationIdFilter");
                  break;
               case "all".toLowerCase():
                  changeArray.push("otherTeamGroupIdFilter");
                  changeArray.push("otherTeamLocationIdFilter");
                  changeArray.push("otherTeamProjectIdFilter");
                  changeArray.push("otherTeamUserFirstNameFilter");
                  changeArray.push("otherTeamUserLastNameFilter");
                  break;
            }
            changeArray.forEach(function (id) {
               $("#" + id, element).val("");
            });
            if (callback != null) {
               callback();
            }
         }
         function LimitFilterListItems() {
            let projectIdFilter = $("#otherTeamProjectIdFilter", element).val();
            let locationIdFilter = $("#otherTeamLocationIdFilter", element).val();
            let groupIdFilter = $("#otherTeamGroupIdFilter", element).val();
            let teamIdFilter = $("#otherTeamUserTeamIdFilter", element).val();

            if (projectIdFilter == "") {
               projectIdFilter = -1;
            }
            if (locationIdFilter == "") {
               locationIdFilter = -1;
            }
            if (groupIdFilter == "") {
               groupIdFilter = -1;
            }
            let locationFilteredList = possibleLocationsList.filter(l => l.IsActive == true || l.Status != "I");
            let groupFilteredList = possibleGroupsList.filter(g => g.IsActive == true && (g.ProjectId == projectIdFilter || projectIdFilter == -1) && (g.LocationId == locationIdFilter || locationIdFilter == -1))
            let teamFilteredList = possibleTeamsList.filter(t => t.IsActive == true && (t.ProjectId == projectIdFilter || projectIdFilter == -1) && (t.GroupId == groupIdFilter || groupIdFilter == -1));

            LoadLocationOptionsFilterList(null, locationFilteredList, locationIdFilter);
            LoadGroupOptionsFilterList(null, groupFilteredList, groupIdFilter);
            LoadTeamOptionsFilterList(null, teamFilteredList, teamIdFilter);
         }
         /* Filtering Options List Loading END */
         /* Render Functions START */
         function RenderUserDataToListing(dataObject, objectToRenderTo, includeTeamName, isMyTeamMember, isFromOtherTeam) {
            if (includeTeamName == null) {
               includeTeamName = false;
            }
            if (isMyTeamMember == null) {
               isMyTeamMember = false;
            }
            if (isFromOtherTeam == null) {
               isFromOtherTeam = false;
            }

            let userListingItem = $("<div class=\"user-listing-item\" />");

            let userNameHolder = $("<div class=\"inline-item user-full-name\" />");
            let userName = `${dataObject.UserFullName} (${dataObject.UserId})`;
            let userAvatarHolder = $("<div class=\"inline-item avatar-holder\" />");
            let userAvatar = $("<img alt=\"" + dataObject.UserFullName + " Avatar\" height=\"25\"/>");
            let userAvatarFileName = defaultAvatarUrl;
            let futureMoveHolder = $("<div class=\"inline-item future-move-holder\" />");
            futureMoveHolder.append("&nbsp;");

            if (dataObject.AvatarImageFileName != null && dataObject.AvatarImageFileName != "" && dataObject.AvatarImageFileName != "empty_headshot.png") {
               userAvatarFileName = Global_CleanAvatarUrl(dataObject.AvatarImageFileName);
            }
            userAvatar.prop("src", userAvatarFileName);
            userAvatarHolder.append(userAvatar);

            userNameHolder.append(userAvatarHolder);
            userNameHolder.append(userName);

            let futureMoveObject = futureMoveRequests.find(u => u.UserId == dataObject.UserId);
            if (futureMoveObject != null) {

               let currentSelectedTeamId = $("#myTeamSelector", element).val();

               //futureMoveHolder.empty();
               let futureMoveAction = futureMoveObject.FutureMoveAction;
               let futureMoveDate = new Date(futureMoveObject.EffectiveDate).toLocaleDateString();
               let futureMoveText = "";

               let newTeamObject = possibleTeamsList.find(t => t.TeamId == futureMoveObject.NewTeamId);
               let currentTeamObject = possibleTeamsList.find(t => t.TeamId == futureMoveObject.CurrentTeamId);

               if (newTeamObject == null) {
                  newTeamObject = myTeamOptionsList.find(t => t.TeamId == futureMoveObject.NewTeamId);
               }
               if (currentTeamObject == null) {
                  currentTeamObject = myTeamOptionsList.find(t => t.TeamId == futureMoveObject.CurrentTeamId);
               }
               let newTeamName = "Team";
               if (newTeamObject != null) {
                  newTeamName = newTeamObject.TeamName;
               }
               let currentTeamName = "Team";
               if (currentTeamObject != null) {
                  currentTeamName = currentTeamObject.TeamName;
               }

               switch (futureMoveAction.toLowerCase()) {
                  case "leave".toLowerCase():
                  case "leaving".toLowerCase():
                     futureMoveText = "Leaving " + currentTeamName;
                     break;
                  case "join".toLowerCase():
                  case "joining".toLowerCase():
                     if (currentSelectedTeamId == futureMoveObject.NewTeamId) {
                        futureMoveText = "Joining your team";
                     }
                     else {

                        futureMoveText = "Joining " + newTeamName;
                     }
                     break;
                  default:
                     futureMoveText = futureMoveAction.toLowerCase();
                     break;
               }

               futureMoveText += " (" + futureMoveDate + ")";
               futureMoveHolder.addClass(futureMoveAction.toLowerCase());
               futureMoveHolder.append(futureMoveText);
            }

            let userButtonHolder = $("<div class=\"inline-item button-holder\" />");
            if (isMyTeamMember == true) {
               let removeUserButton = $("<button id=\"removeTeamUser_" + dataObject.UserId + "\">Remove</button>");
               $(removeUserButton).on("click", function () {
                  let buttonId = this.id;
                  let userId = buttonId.split("_")[1];
                  LoadEditorForm(function () {
                     ShowEditorForm();
                  }, "Remove", userId);
               });
               userButtonHolder.append(removeUserButton);
            }
            else {
               let addUserButton = $("<button id=\"addUserToMyTeam_" + dataObject.UserId + "\">Add</button>");
               let actionType = "Add";
               if (isFromOtherTeam == true) {
                  actionType = "AddFromOtherTeam";
               }
               $(addUserButton).on("click", function () {
                  let buttonId = this.id;
                  let userId = buttonId.split("_")[1];
                  LoadEditorForm(function () {
                     ShowEditorForm();
                  }, actionType, userId);
               });
               userButtonHolder.append(addUserButton);
            }
            let otherTeamNameHolder = null;

            if (includeTeamName == true) {
               otherTeamNameHolder = $("<div class=\"inline-item team-name\" />");
               let teamName = "";
               if (dataObject.Teams != null && dataObject.Teams.length > 0) {
                  let teamProfile = dataObject.Teams.find(t => new Date(t.RemovedFromTeamDate) > new Date());
                  if (teamProfile != null && teamProfile.TeamIdSource != null) {
                     teamName = teamProfile.TeamIdSource.TeamName;
                  }
                  else {
                     teamName = teamProfile.TeamId;
                  }
               }
               otherTeamNameHolder.append(teamName);
            }

            userListingItem.append(userNameHolder);
            if (otherTeamNameHolder != null) {
               userListingItem.append(otherTeamNameHolder);
            }
            userListingItem.append(futureMoveHolder);
            userListingItem.append(userButtonHolder);


            $(objectToRenderTo).append(userListingItem);
         }
         function RenderMyTeamListing(callback, listToRender) {
            if (listToRender == null) {
               listToRender = myTeamUsersList;
            }
            let myTeamListHolder = $("<div />");
            if (listToRender != null && listToRender.length > 0) {
               for (let uIndex = 0; uIndex < listToRender.length; uIndex++) {
                  RenderUserDataToListing(listToRender[uIndex], myTeamListHolder, false, true);
               }
            }
            else {
               let noMyTeamUsersHolder = $("<div class=\"no-users-found-for-listing\" />");
               noMyTeamUsersHolder.append("No Users found for your team.");
               myTeamListHolder.append(noMyTeamUsersHolder);
            }
            $("#myTeamListHolder", element).empty();
            $("#myTeamListHolder", element).append(myTeamListHolder);
            if (callback != null) {
               callback();
            }

         }
         function RenderPoolUserListing(callback, listToRender) {
            if (listToRender == null) {
               listToRender = userPoolList;
            }
            let poolListHolder = $("<div />");
            if (listToRender != null && listToRender.length > 0) {
               for (let uIndex = 0; uIndex < listToRender.length; uIndex++) {
                  RenderUserDataToListing(listToRender[uIndex], poolListHolder, false, false);
               }
            }
            else {
               let noTeamUsersHolder = $("<div class=\"no-users-found-for-listing\" />");
               noTeamUsersHolder.append("No Users found in pool.");
               poolListHolder.append(noTeamUsersHolder);
            }
            $("#userPoolListHolder", element).empty();
            $("#userPoolListHolder", element).append(poolListHolder);
            if (callback != null) {
               callback();
            }

         }
         function RenderOtherTeamUserListing(callback, listToRender) {
            if (listToRender == null) {
               listToRender = otherTeamsUserList;
            }
            let otherTeamIdFilter = $("#otherTeamUserTeamIdFilter", element).val();
            let otherTeamFirstNameFilter = $("#otherTeamUserFirstNameFilter", element).val();
            let otherTeamLastNameFilter = $("#otherTeamUserLastNameFilter", element).val();
            let otherTeamListingHolder = $("<div />");

            if (otherTeamIdFilter == "" && otherTeamFirstNameFilter == "" && otherTeamLastNameFilter == "") {
               const filterErrorMessage = "You need to select a team or supply filtering in the first or last name fields in order to retrieve users.";
               let selectFilterHolder = $("<div class=\"select-team-for-listing user-information-message\" />");
               selectFilterHolder.append(filterErrorMessage);
               otherTeamListingHolder.append(selectFilterHolder);
            }
            else {
               if (listToRender != null && listToRender.length > 0) {
                  for (let uIndex = 0; uIndex < listToRender.length; uIndex++) {
                     RenderUserDataToListing(listToRender[uIndex], otherTeamListingHolder, true, false, true);
                  }
               }
               else {
                  let noTeamUsersHolder = $("<div class=\"no-users-found-for-listing user-information-message\" />");
                  noTeamUsersHolder.append("No Users found other teams.");
                  otherTeamListingHolder.append(noTeamUsersHolder);
               }
            }

            $("#otherTeamListHolder", element).empty();
            $("#otherTeamListHolder", element).append(otherTeamListingHolder);
            if (callback != null) {
               callback();
            }
         }
         function RenderUserCount(valueToRender, idToRenderTo) {
            $("#" + idToRenderTo, element).empty();
            $("#" + idToRenderTo, element).append(valueToRender);
         }
         /* Render Functions END */
         /* Form Editing Options START */
         function LoadEditorForm(callback, editorType, userId) {
            if (editorType == null) {
               editorType = "Add";
            }
            let userProfile = FindUserProfile(userId);
            if (userProfile != null) {
               $("#userTeamUserIdLabel", element).empty();
               $("#userTeamUserIdLabel", element).text(userProfile.UserFullName);
               //userTeamUserIdLabel
            }
            $("#userTeamUserId", element).val(userId);
            $("#userTeamFormAction", element).val(editorType);

            if (callback != null) {
               callback();
            }
         }
         function ConfirmEditorAction(callback) {
            let userId = $("#userTeamUserId", element).val();
            let actionType = $("#userTeamFormAction", element).val();
            let effectiveDate = $("#userTeamEffectiveDate", element).val();
            let confirmMessage = null;
            let userName = null;
            if (effectiveDate != null && effectiveDate != "") {
               effectiveDate = new Date(effectiveDate).toLocaleDateString();
            }

            let userProfile = FindUserProfile(userId);
            if (userProfile != null) {
               userName = userProfile.UserFullName;
            }
            switch (actionType.toLowerCase()) {
               case "add".toLowerCase():
                  confirmMessage = "You are about to add " + userName + " to your team. \nPress OK to continue or CANCEL to not proceed.";
                  break;
               case "AddFromOtherTeam".toLowerCase():
                  confirmMessage = "You are about to add " + userName + " to your team.  It will take effect " + effectiveDate + ".\nPress OK to continue or CANCEL to not proceed.";
                  break;
               case "remove".toLowerCase():
                  confirmMessage = "You are about to remove " + userName + " from your team.  It will take effect " + effectiveDate + ".\nPress OK to continue or CANCEL to not proceed.";
                  break;
            }
            if (confirmMessage != null) {
               if (confirm(confirmMessage)) {
                  if (callback != null) {
                     callback();
                  }
                  else {
                     return true;
                  }
               }
            }
            else {
               alert("Error determining what action you want to take.");
            }
         }
         function ValidateEditorForm(callback) {
            $(".error-information-holder", element).empty();
            let formValid = true;
            var errorMessages = [];
            let validDate = $("#userTeamEffectiveDate", element).val();

            if (validDate == null || validDate == "") {
               errorMessages.push({ message: "Effective Date Required.", fieldclass: "", fieldid: "userTeamEffectiveDate" });
               formValid = false;
            }

            if (formValid == true) {
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
         function SaveEditorForm(callback) {

            let userMessageText = "Processing adding user to your team.";
            let teamId = -1;
            let userId = $("#userTeamUserId", element).val();
            let actionType = $("#userTeamFormAction", element).val();
            let effectiveDate = $("#userTeamEffectiveDate", element).val();
            let myTeamId = $("#myTeamSelector", element).val();

            let actionToTake = "AddUserToTeam";
            if (actionType.toLowerCase() == "remove".toLowerCase()) {
               actionToTake = "RemoveUserFromTeam";
               userMessageText = "Processing removal of  user from your team.";
            }
            else if (actionType.toLowerCase() == "AddFromOtherTeam".toLowerCase()) {
               actionToTake = "AddUserFromOtherTeam";
            }
            WriteUserMessage(userMessageText);
            a$.ajax({
               type: "POST",
               service: "C#",
               async: false,
               data: {
                  lib: "selfserve",
                  cmd: actionToTake,
                  userid: userId,
                  teamId: teamId,
                  effectivedate: new Date(effectiveDate).toLocaleDateString(),
                  myTeamId: myTeamId
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (data) {
                  HideUserMessage();
                  if (callback != null) {
                     callback();
                  }
               }
            });

         }
         function ClearEditorForm(callback) {
            $("#userTeamUserId", element).val("");
            $("#userTeamEffectiveDate", element).val("");
            $("#userTeamFormAction", element).val("");

            $("input,select", element).each(function () {
               $(this).removeClass("errorField");
            });
            $(".error-information-holder", element).empty();
            $(".error-information-holder", element).hide();
            if (callback != null) {
               callback();
            }
         }
         /* Form Editing Options END */
         /* Show/Hide Functions START */
         function HideAll(callback) {
            HideUserMessage();
            HideEditorForm();
            HideOtherTeamListLoader();
            HideShowUserPoolListLoading();
            HideInstructions();
         }
         function ShowEditorForm() {
            $(".form-holder", element).show();
         }
         function HideEditorForm() {
            $(".form-holder", element).hide();
         }
         function ShowUserMessage(timeToDisplay) {
            if (timeToDisplay == null) {
               timeToDisplay = displayTime_Default;
            }
            $("#userMessageHolder", element).show();
            window.setTimeout(function () {
               HideUserMessage();
            }, timeToDisplay);
         }
         function HideUserMessage() {
            $("#userMessageHolder", element).hide();
         }
         function HideOtherTeamListLoader() {
            $("#otherTeamListLoader", element).hide();
         }
         function ShowOtherTeamListLoader(timeToDisplay) {
            if (timeToDisplay == null) {
               timeToDisplay = displayTime_Default;
            }
            $("#otherTeamListLoader", element).show();
            window.setTimeout(function () {
               HideOtherTeamListLoader();
            }, timeToDisplay);
         }
         function HideShowUserPoolListLoading() {
            $("#userPoolListLoader", element).hide();
         }
         function ShowUserPoolListLoading(timeToDisplay) {
            if (timeToDisplay == null) {
               timeToDisplay = displayTime_Default;
            }
            $("#userPoolListLoader", element).show();
            window.setTimeout(function () {
               HideShowUserPoolListLoading();
            }, timeToDisplay);
         }
         function ToggleInstructions() {
            let isVisible = $("#instructions_popup", element).is(":visible");
            if (isVisible === true) {
               HideInstructions();
            }
            else {
               ShowInstructions();
            }
         }
         function HideInstructions() {
            $("#instructions_popup", element).hide();
         }
         function ShowInstructions() {
            $("#instructions_popup", element).show();
         }
         /* Show/Hide Functions END */
         /* Utility Functions START */
         function isAdminUser() {
            let returnValue = false;
            switch (legacyContainer.scope.TP1Role.toLowerCase()) {
               //TODO: Determine what  is a user admin here that can administer other teams.               
               case "Admin".toLowerCase():
               case "CorpAdmin".toLowerCase():
               case "Management".toLowerCase():
                  returnValue = true;
                  break;
            }
            return returnValue;
         }
         function FindUserProfile(userId) {
            let userProfile = null;
            //look in my team for a profile
            userProfile = myTeamUsersList.find(u => u.UserId == userId);
            //no profile, use the pool list
            if (userProfile == null) {
               userProfile = userPoolList.find(u => u.UserId == userId);
            }
            //still no profile, look in the other teams list
            if (userProfile == null) {
               userProfile = otherTeamsUserList.find(u => u.UserId == userId);
            }
            return userProfile;
         }
         function WriteUserMessage(messageToWrite, timeout) {
            $("#userMessageText", element).empty();
            $("#userMessageText", element).append(messageToWrite);
            ShowUserMessage(timeout);
         }
         function WriteOtherTeamLoadingMessage(messageToWrite, timeout) {
            $("#otherTeamListLoaderMessage", element).empty();
            $("#otherTeamListLoaderMessage", element).append(messageToWrite);
            ShowOtherTeamListLoader(timeout);
         }
         function WriteUserPoolLoadingMessage(messageToWrite, timeout) {
            $("#userPoolListLoaderMessage", element).empty();
            $("#userPoolListLoaderMessage", element).append(messageToWrite);
            ShowUserPoolListLoading(timeout);
         }
         /* Utility Functions END */
         /* Signal Handling Function START */
         function ProcessTeamManagerSignal(signalObject)
         {
            if(signalObject != null && signalObject.route == "userpoolmanager")
            {
               let signalInfo = JSON.parse(signalObject.info);
               if(signalInfo != null)
               {
                  switch(signalInfo.UserMoveType.toLowerCase())
                  {
                     case "claim".toLowerCase():
                        HandleUserClaimed(function(){
                           ko.postbox.publish("myTeamManagerRefreshPool");
                        }, signalInfo);
                        break;
                     case "dropped".toLowerCase():
                        HandleUserDropped(function(){
                           ko.postbox.publish("myTeamManagerRefreshPool");
                        }, signalInfo);
                        break;
                  }
               }
            }
         }
         function HandleUserClaimed(callback, signalInfo)
         {
            console.log("Claim Info to Process:" + JSON.stringify(signalInfo));
            ko.postbox.publish("myTeamManagerReload");
            if(callback != null)
            {
               callback();
            }
         }
         function HandleUserDropped(callback, signalInfo)
         {
            console.log("HandleUserDropped()");
            console.log("UserDropped info to process: " + JSON.stringify(signalInfo));
            ko.postbox.publish("myTeamManagerReload");
            if(callback != null)
            {
               callback();
            }
         }
         /* Signal Handling Function END */
         scope.load = function () {
            scope.Initialize();
            LoadUserListings(function () {
               HideUserMessage();
            });
         };

         ko.postbox.subscribe("myTeamManagerReload", function () {
            WriteUserMessage("Moving users around...");
            userPoolList.length = 0;
            myTeamUsersList.length = 0;
            window.setTimeout(function () {
               LoadFutureMoveRequests();
               HandleMyTeamSelectionChange(function () {
                  LoadPoolUsersListing();
                  LoadOtherTeamsUsersListings();
                  HideUserMessage();
               });
            }, windowRefreshTiming);
         });
         ko.postbox.subscribe("myTeamManagerLoad", function () {
            WriteUserMessage("Loading lists...", displayTime_LongRunning);
            window.setTimeout(function () {
               scope.load();
            }, displayTime_LongRunning);
         });
         ko.postbox.subscribe("myTeamManagerRefreshPool", function(){
            WriteUserMessage("Checking the pool...");
            userPoolList.length = 0;
            window.setTimeout(function () {
               LoadPoolUsersListing(function(){
                  HideUserMessage();
               }, true);
            }, windowRefreshTiming);
         });
         ko.postbox.subscribe("Signal", function(so){
            ProcessTeamManagerSignal(so);
         });
      }
   };
}]);
