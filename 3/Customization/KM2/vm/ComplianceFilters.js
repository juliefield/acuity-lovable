angularApp.directive("ngComplianceFilters", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/3/Customization/KM2/view/ComplianceFilters.htm?' + Date.now(),
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
         let hasAccess = false;
         let possibleFilterOptionObjects = {
            projects: [],
            locations: [],
            groups: [],
            teams: [],
            userProfiles: [],
         };
         /* Event Handling START */
         $(".btn-close", element).off("click").on("click", function () {
            ClearFilterSelectionPanel(function () {
               HideFilterSelectionPanel();
            });
         });
         $("#btnAddSelectedFilter", element).off("click").on("click", function () {
            AddSelectedFilters(function () {
               ClearFilterSelectionPanel();
               HideFilterSelectionPanel();
            });
         });
         $("#btnClearCurrentFilters", element).off("click").on("click", function () {
            ClearAllCurrentSelectedFilters();
            //btnClearCurrentFilters
         });
         $(".showAddToFilterButton", element).off("click").on("click", function () {
            let buttonValue = $(this).attr("dataValue");
            LoadFilterSelectionPanel(function () {
               ShowFilterSelectionPanel();
            }, buttonValue);
         });
         $("#btnApplyFilter", element).off("click").on("click", function () {
            ko.postbox.publish("ComplianceDashboardStartLoad");
            ko.postbox.publish("km2ComplianceFiltersChanged", true);
         });
         $("#btnClearFilter", element).off("click").on("click", function () {
            ResetFilters(function () {
               ko.postbox.publish("ComplianceDashboardStartLoad");
               ko.postbox.publish("km2ComplianceFiltersChanged", true);
            });
         });
         /* Event Handling END */
         function Initialize() {
            HideAll();
            SetDatePickers();
            CanAccess(function () {
               GetProjectOptions();
               //RenderDirectiveFooter();
            });
         };
         function SetDatePickers() {
            $(".date-input").datepicker();
         }
         /* Data Loading START */
         function BarebonesLoad()
         {
            SetDatePickers();
            LoadCurrentMonthDates();
            LoadLargeSetOptions();
         }
         function LoadLargeSetOptions()
         {
            GetProjectOptions();
            GetGroupOptions();
            GetTeamOptions();
         }
         function LoadDirective() {
            HideAll();
            LoadFilterOptions();
         }
         function LoadFilterOptions() {
            RenderCurrentFilterInformation();
            LoadCurrentMonthDates();
         }
         function LoadProjectOptions() {
            GetProjectOptions(function (dataList) {
               RenderProjectOptions(null, dataList);
            })
         }
         function LoadLocationOptions() {
            GetLocationOptions(function (dataList) {
               RenderLocationOptions(null, dataList);
            })
         }
         function LoadGroupOptions() {
            GetGroupOptions(function (dataList) {
               RenderGroupOptions(null, dataList);
            });
         }
         function LoadTeamOptions() {
            GetTeamOptions(function (dataList) {
               RenderTeamOptions(null, dataList);
            });
         }
         function LoadAuditorOptions() {
            GetAuditorOptions(function (dataList) {
               RenderAuditorOptions(null, dataList);
            });
         }
         function LoadCurrentMonthDates() {
            let currentStart = $("#compDashboardFilter_StartDate", element).val();
            let currentEnd =  $("#compDashboardFilter_EndDate", element).val();
            let today = new Date();
            let thisMonth = today.getMonth();
            let thisYear = today.getFullYear();
            let monthStart = new Date(thisYear, thisMonth, 1);
            let monthEnd = new Date(thisYear, thisMonth + 1, 0);

            if(currentStart != null && currentStart != "")
            {
               monthStart = new Date(currentStart);
            }
            if(currentEnd != null && currentEnd != "")
            {
               monthEnd = new Date(currentEnd);
            }
            $("#compDashboardFilter_StartDate", element).val(monthStart.toLocaleDateString());
            $("#compDashboardFilter_EndDate", element).val(monthEnd.toLocaleDateString());
         }
         /* Data Loading END */
         /* Filtered Data Pulls START */
         function LoadComplianceData(callback) {
            let startDate = $("#compDashboardFilter_StartDate", element).val();
            let endDate = $("#compDashboardFilter_EndDate", element).val();
            let today = new Date();
            let thisMonth = today.getMonth();
            let thisYear = today.getFullYear();

            if (startDate == null || startDate == "") {
               startDate = new Date(thisYear, thisMonth, 1);
            }
            if (endDate == null || endDate == "") {
               endDate = new Date(thisYear, thisMonth + 1, 0);
            }

            a$.ajax({
               type: "GET",
               service: "C#",
               async: true,
               data: {
                  lib: "selfserve",
                  cmd: "getKm2ComplianceDashboardData",
                  startDate: new Date(startDate).toLocaleDateString(),
                  endDate: new Date(endDate).toLocaleDateString(),
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (jsonData) {
                  returnData = JSON.parse(jsonData.dashboardDataList);
                  if (callback != null) {
                     callback(returnData);
                  }
                  return returnData;
               }
            });
         }
         function LoadComplianceLoginData(callback) {
            let returnData = [];
            let startDate = $("#compDashboardFilter_StartDate", element).val();
            let endDate = $("#compDashboardFilter_EndDate", element).val();
            let today = new Date();
            let thisMonth = today.getMonth();
            let thisYear = today.getFullYear();

            if (startDate == null || startDate == "") {
               startDate = new Date(thisYear, thisMonth, 1);
            }
            if (endDate == null || endDate == "") {
               endDate = new Date(thisYear, thisMonth + 1, 0);
            }
            a$.ajax({
               type: "GET",
               service: "C#",
               async: true,
               data: {
                  lib: "selfserve",
                  cmd: "getKm2ComplianceDashboardLoginData",
                  startDate: new Date(startDate).toLocaleDateString(),
                  endDate: new Date(endDate).toLocaleDateString(),
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (jsonData) {
                  returnData = JSON.parse(jsonData.dashboardLoginDataList);
                  if (callback != null) {
                     callback(returnData);
                  }
                  return returnData;
               }
            });
         }
         function ApplyFilters(callback, dataToFilter) {
            let filteredData = dataToFilter;
            let tempFilterData = [];

            let projectIdList = $("#compDashboardCurrentFilterSelected_Project", element).val();
            if (projectIdList != null && projectIdList != "") {
               tempFilterData.length = 0;
               projectIdList.split(",").forEach(function (id) {
                  filteredData.filter(i => i.ProjectId == parseInt(id)).forEach(function (item) {
                     tempFilterData.push(item);
                  });
               });
            }


            if (tempFilterData.length > 0) {
               filteredData.length = 0;
               filteredData.push(...tempFilterData);
               tempFilterData.length = 0;
            }


            let locationIdList = $("#compDashboardCurrentFilterSelected_Location", element).val();
            if (locationIdList != null && locationIdList != "") {
               tempFilterData.length = 0;
               locationIdList.split(",").forEach(function (id) {
                  filteredData.filter(i => i.LocationId == parseInt(id)).forEach(function (item) {
                     tempFilterData.push(item);
                  });
               });
            }

            if (tempFilterData.length > 0) {
               filteredData.length = 0;
               filteredData.push(...tempFilterData);
               tempFilterData.length = 0;
            }
            let groupIdList = $("#compDashboardCurrentFilterSelected_Group", element).val();
            if (groupIdList != null && groupIdList != "") {
               tempFilterData.length = 0;
               groupIdList.split(",").forEach(function (id) {
                  filteredData.filter(i => i.GroupId == parseInt(id)).forEach(function (item) {
                     tempFilterData.push(item);
                  });
               });
            }

            if (tempFilterData.length > 0) {
               filteredData.length = 0;
               filteredData.push(...tempFilterData);
               tempFilterData.length = 0;
            }
            let teamIdList = $("#compDashboardCurrentFilterSelected_Team", element).val();
            if (teamIdList != null && teamIdList != "") {
               tempFilterData.length = 0;
               teamIdList.split(",").forEach(function (id) {
                  filteredData.filter(i => i.TeamId == parseInt(id)).forEach(function (item) {
                     tempFilterData.push(item);
                  });
               });
            }

            if (tempFilterData.length > 0) {
               filteredData.length = 0;
               filteredData.push(...tempFilterData);
               tempFilterData.length = 0;
            }

            let userIdList = $("#compDashboardCurrentFilterSelected_Users", element).val();
            if (userIdList != null && userIdList != "") {
               tempFilterData.length = 0;
               userIdList.split(",").forEach(function (id) {
                  filteredData.filter(i => i.EvaluatorUserId == id || i.UserId == id).forEach(function (item) {
                     tempFilterData.push(item);
                  });
               });
            }

            if (tempFilterData.length > 0) {
               filteredData.length = 0;
               filteredData.push(...tempFilterData);
               tempFilterData.length = 0;
            }

            if (callback != null) {
               callback(filteredData);
            }
            else {
               return filteredData;
            }
         }

         // function LoadComplianceDisputeData(callback)
         // {
         //    let returnData = [];

         //    if(callback != null)
         //    {
         //       callback(returnData);
         //    }
         // }
         /* Filtered Data Pulls END */
         /* Data Pulls START */
         function GetProjectOptions(callback, forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (forceReload == false && possibleFilterOptionObjects.projects != null && possibleFilterOptionObjects.projects.length > 0) {
               if (callback != null) {
                  callback(possibleFilterOptionObjects.projects);
               }
            }
            else {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: true,
                  data: {
                     lib: "selfserve",
                     cmd: "getProjectList",
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let returnData = JSON.parse(data.projectList);
                     possibleFilterOptionObjects.projects.length = 0;
                     possibleFilterOptionObjects.projects = returnData;
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
         function GetLocationOptions(callback, forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (forceReload == false && possibleFilterOptionObjects.locations != null && possibleFilterOptionObjects.locations.length > 0) {
               if (callback != null) {
                  callback(possibleFilterOptionObjects.locations);
               }
            }
            else {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: true,
                  data: {
                     lib: "selfserve",
                     cmd: "getLocationList",
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let returnData = JSON.parse(data.locationList);
                     possibleFilterOptionObjects.locations.length = 0;
                     possibleFilterOptionObjects.locations = returnData;
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
         function GetGroupOptions(callback, forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (forceReload == false && possibleFilterOptionObjects.groups != null && possibleFilterOptionObjects.groups.length > 0) {
               if (callback != null) {
                  callback(possibleFilterOptionObjects.groups);
               }
            }
            else {
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
                     possibleFilterOptionObjects.groups.length = 0;
                     possibleFilterOptionObjects.groups = returnData;
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
         function GetTeamOptions(callback, forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (forceReload == false && possibleFilterOptionObjects.teams != null && possibleFilterOptionObjects.teams.length > 0) {
               if (callback != null) {
                  callback(possibleFilterOptionObjects.teams);
               }
            }
            else {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: true,
                  data: {
                     lib: "selfserve",
                     cmd: "getTeamList",
                     deepLoad: false,
                     excldeIneligible: false,
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let returnData = JSON.parse(data.teamList);
                     possibleFilterOptionObjects.teams.length = 0;
                     possibleFilterOptionObjects.teams = returnData;
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
         function GetAuditorOptions(callback, forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (forceReload == false && possibleFilterOptionObjects.userProfiles != null && possibleFilterOptionObjects.userProfiles.length > 0) {
               if (callback != null) {
                  callback(possibleFilterOptionObjects.userProfiles);
               }
            }
            else {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: true,
                  data: {
                     lib: "selfserve",
                     cmd: "getKm2ComplianceAuditors",
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let returnData = JSON.parse(data.auditorList);
                     possibleFilterOptionObjects.userProfiles.length = 0;
                     possibleFilterOptionObjects.userProfiles = returnData;
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
         /* Data Pulls END */
         /* Data Rendering START */
         function RenderProjectOptions(callback, listToRender) {
            if (listToRender == null) {
               listToRender = possibleFilterOptionObjects.projects;
            }
            let currentProjectsSelected = $("#compDashboardCurrentFilterSelected_Project", element).val();
            let currentProjectsArray = currentProjectsSelected.split(",");

            $("#filterPanelSelectionOptionListHolder", element).empty();
            $("#filterPanelSelectionHolderAreaName", element).empty();

            $("#filterPanelSelectionHolderAreaName", element).append("Project");
            listToRender = SortOptionsList(listToRender);
            listToRender.forEach(function (filterItem) {
               if (filterItem.ModelId == 1 && filterItem.Status == "A") {
                  let selectionRow = $(`<div class="filter-panel-row" />`);
                  let optionHolder = $(`<div class="filter-panel-item option-holder" />`)
                  let checkboxOption = $(`<input type="checkbox" id="chkFilterOption_${filterItem.Id}" value="${filterItem.Id}" valText="${filterItem.Name}" />`);
                  if (currentProjectsArray.findIndex(i => i == filterItem.Id) > -1) {
                     checkboxOption.prop("checked", true);
                  }
                  let nameHolder = $(`<div class="filter-panel-item name-holder" />`);

                  optionHolder.append(checkboxOption);
                  nameHolder.append(filterItem.Name);

                  selectionRow.append(optionHolder);
                  selectionRow.append(nameHolder);
                  $("#filterPanelSelectionOptionListHolder", element).append(selectionRow);
               }
            });
            if (callback != null) {
               callback();
            }
         }
         function RenderLocationOptions(callback, listToRender) {
            if (listToRender == null) {
               listToRender = possibleFilterOptionObjects.locations;
            }
            let currentLocationsSelected = $("#compDashboardCurrentFilterSelected_Location", element).val();
            let currentSelectionArray = currentLocationsSelected.split(",");

            $("#filterPanelSelectionOptionListHolder", element).empty();
            $("#filterPanelSelectionHolderAreaName", element).empty();

            $("#filterPanelSelectionHolderAreaName", element).append("Location");
            listToRender = SortOptionsList(listToRender);
            listToRender.forEach(function (filterItem) {
               if (filterItem.Status == "A") {
                  let selectionRow = $(`<div class="filter-panel-row" />`);
                  let optionHolder = $(`<div class="filter-panel-item option-holder" />`)
                  let checkboxOption = $(`<input type="checkbox" id="chkFilterOption_${filterItem.Id}" value="${filterItem.Id}" valText="${filterItem.Name}" />`);
                  if (currentSelectionArray.findIndex(i => i == filterItem.Id) > -1) {
                     checkboxOption.prop("checked", true);
                  }
                  let nameHolder = $(`<div class="filter-panel-item name-holder" />`);

                  optionHolder.append(checkboxOption);
                  nameHolder.append(filterItem.Name);

                  selectionRow.append(optionHolder);
                  selectionRow.append(nameHolder);
                  $("#filterPanelSelectionOptionListHolder", element).append(selectionRow);
               }
            });
            if (callback != null) {
               callback();
            }
         }
         function RenderGroupOptions(callback, listToRender) {
            if (listToRender == null) {
               listToRender = possibleFilterOptionObjects.groups;
            }
            let currentGroupSelected = $("#compDashboardCurrentFilterSelected_Group", element).val();
            let currentSelectionArray = currentGroupSelected.split(",");

            $("#filterPanelSelectionOptionListHolder", element).empty();
            $("#filterPanelSelectionHolderAreaName", element).empty();

            $("#filterPanelSelectionHolderAreaName", element).append("LOB");
            listToRender = SortOptionsList(listToRender);
            listToRender.forEach(function (filterItem) {
               if (filterItem.Status == "A") {
                  let selectionRow = $(`<div class="filter-panel-row" />`);
                  let optionHolder = $(`<div class="filter-panel-item option-holder" />`)
                  let projectName = "";
                  let projectObject = FindProjectObject(null, filterItem);
                  if (projectObject != null) {
                     projectName = projectObject.Name;
                  }
                  let displayName = `${filterItem.Name} (${projectName})`;

                  if (projectName == null || projectName == "") {
                     displayName = filterItem.Name;
                  }
                  let checkboxOption = $(`<input type="checkbox" id="chkFilterOption_${filterItem.Id}" value="${filterItem.Id}" valText="${displayName}" />`);
                  if (currentSelectionArray.findIndex(i => i == filterItem.Id) > -1) {
                     checkboxOption.prop("checked", true);
                  }
                  let displayNameWithFormatting = `<b>${filterItem.Name}</b> (<i>${projectName}</i>)`;
                  if (projectName == null || projectName == "") {
                     displayNameWithFormatting = filterItem.Name;
                  }
                  let nameHolder = $(`<div class="filter-panel-item name-holder" />`);

                  optionHolder.append(checkboxOption);
                  nameHolder.append(displayNameWithFormatting);

                  selectionRow.append(optionHolder);
                  selectionRow.append(nameHolder);
                  $("#filterPanelSelectionOptionListHolder", element).append(selectionRow);
               }
            });
            if (callback != null) {
               callback();
            }
         }
         function RenderTeamOptions(callback, listToRender) {
            if (listToRender == null) {
               listToRender = possibleFilterOptionObjects.teams;
            }
            let currentTeamsSelected = $("#compDashboardCurrentFilterSelected_Team", element).val();
            let currentSelectionArray = currentTeamsSelected.split(",");

            $("#filterPanelSelectionOptionListHolder", element).empty();
            $("#filterPanelSelectionHolderAreaName", element).empty();

            $("#filterPanelSelectionHolderAreaName", element).append("Team");
            listToRender = SortOptionsList(listToRender);
            listToRender.forEach(function (filterItem) {
               if (filterItem.Status == "A") {
                  let selectionRow = $(`<div class="filter-panel-row" />`);
                  let optionHolder = $(`<div class="filter-panel-item option-holder" />`)
                  let nameHolder = $(`<div class="filter-panel-item name-holder" />`);
                  let displayNameWithFormatting = filterItem.Name;
                  let displayName = filterItem.Name;
                  let groupObject = FindGroupObject(null, filterItem);
                  if(groupObject != null)
                  {
                     displayNameWithFormatting = `<b>${filterItem.Name}</b> <i>(${groupObject.Name})</i> `;
                     displayName = ` ${filterItem.Name} (${groupObject.Name})`;
                     let projectObject = FindProjectObject(null, groupObject);
                     if(projectObject != null)
                     {
                        displayNameWithFormatting = `<b>${filterItem.Name}</b> <i>(${projectObject.Name} - ${groupObject.Name})</i> `;
                        displayName = `${filterItem.Name} (${projectObject.Name} - ${groupObject.Name}) `;
                     }
                  }
                  let checkboxOption = $(`<input type="checkbox" id="chkFilterOption_${filterItem.Id}" value="${filterItem.Id}" valText="${displayName}" />`);
                  if (currentSelectionArray.findIndex(i => i == filterItem.Id) > -1) {
                     checkboxOption.prop("checked", true);
                  }

                  optionHolder.append(checkboxOption);                  
                  nameHolder.append(displayNameWithFormatting);

                  selectionRow.append(optionHolder);
                  selectionRow.append(nameHolder);
                  $("#filterPanelSelectionOptionListHolder", element).append(selectionRow);
               }
            });
            if (callback != null) {
               callback();
            }
         }
         function RenderAuditorOptions(callback, listToRender) {
            if (listToRender == null) {
               listToRender = possibleFilterOptionObjects.userProfiles;
            }
            let currentAuditorsSelected = $("#compDashboardCurrentFilterSelected_Users", element).val();
            let currentSelectionArray = currentAuditorsSelected.split(",");

            $("#filterPanelSelectionOptionListHolder", element).empty();
            $("#filterPanelSelectionHolderAreaName", element).empty();
            $("#filterPanelSelectionHolderAreaName", element).append("Users");
            listToRender = SortOptionsList(listToRender);
            listToRender.forEach(function (filterItem) {
               if (filterItem.Status == "A") {
                  let selectionRow = $(`<div class="filter-panel-row" />`);
                  let optionHolder = $(`<div class="filter-panel-item option-holder" />`)
                  let checkboxOption = $(`<input type="checkbox" id="chkFilterOption_${filterItem.Id}" value="${filterItem.Id}" valText="${filterItem.Name}" />`);
                  if (currentSelectionArray.findIndex(i => i == filterItem.Id) > -1) {
                     checkboxOption.prop("checked", true);
                  }

                  let nameHolder = $(`<div class="filter-panel-item name-holder" />`);

                  optionHolder.append(checkboxOption);
                  nameHolder.append(filterItem.Name);

                  selectionRow.append(optionHolder);
                  selectionRow.append(nameHolder);
                  $("#filterPanelSelectionOptionListHolder", element).append(selectionRow);
               }
            });
            if (callback != null) {
               callback();
            }
         }
         function RenderCurrentFilterInformation(callback, filterArea) {
            if (filterArea == null) {
               filterArea = "";
            }
            let currentProjectsSelected = $("#compDashboardCurrentFilterSelected_Project", element).val();
            let currentProjectsSelectedListText = "All";

            if (currentProjectsSelected != null && currentProjectsSelected != "") {
               let selectedTextArray = [];
               let selectedArray = currentProjectsSelected.split(",");
               selectedArray.forEach(function (item) {
                  let projectObject = possibleFilterOptionObjects.projects.find(i => i.Id == item);
                  if (projectObject != null) {
                     selectedTextArray.push(projectObject.Name.trim());
                  }
               });
               currentProjectsSelectedListText = selectedTextArray.join(", ");
            }
            $("#compDashboardCurrentFilter_Project", element).empty();
            $("#compDashboardCurrentFilter_Project", element).append(currentProjectsSelectedListText);

            let currentLocationsSelected = $("#compDashboardCurrentFilterSelected_Location", element).val();
            let currentLocationsSelectedListText = "All";
            if (currentLocationsSelected != null && currentLocationsSelected != "") {
               let selectedTextArray = [];
               let selectedArray = currentLocationsSelected.split(",");
               selectedArray.forEach(function (item) {
                  let locationObject = possibleFilterOptionObjects.locations.find(i => i.Id == item);
                  if (locationObject != null) {
                     selectedTextArray.push(locationObject.Name.trim());
                  }
               });
               currentLocationsSelectedListText = selectedTextArray.join(", ");
            }
            $("#compDashboardCurrentFilter_Location", element).empty();
            $("#compDashboardCurrentFilter_Location", element).append(currentLocationsSelectedListText);

            let currentGroupsSelected = $("#compDashboardCurrentFilterSelected_Group", element).val();
            let currentGroupsSelectedListText = "All";
            if (currentGroupsSelected != null && currentGroupsSelected != "") {
               let selectedTextArray = [];
               let selectedArray = currentGroupsSelected.split(",");
               selectedArray.forEach(function (item) {
                  let groupObject = possibleFilterOptionObjects.groups.find(i => i.Id == item);
                  let groupName = item;
                  if (groupObject != null) {
                     
                     groupName = groupObject.Name.trim();
                     let projectObject = FindProjectObject(null, groupObject);
                     let projectName = "";
                     if(projectObject != null && projectObject.Id > 0)
                     {
                        projectName = projectObject.Name;
                        groupName = `${projectName} - ${groupObject.Name.trim()}`;
                     }
                  }
                  selectedTextArray.push(groupName.trim());
               });
               currentGroupsSelectedListText = selectedTextArray.join(", ");
            }
            $("#compDashboardCurrentFilter_Group", element).empty();
            $("#compDashboardCurrentFilter_Group", element).append(currentGroupsSelectedListText);


            let currentTeamsSelected = $("#compDashboardCurrentFilterSelected_Team", element).val();
            let currentTeamsSelectedListText = "All";
            if (currentTeamsSelected != null && currentTeamsSelected != "") {
               let selectedTextArray = [];
               let selectedArray = currentTeamsSelected.split(",");
               selectedArray.forEach(function (item) {
                  let teamObject = possibleFilterOptionObjects.teams.find(i => i.Id == item);
                  if (teamObject != null) {
                     selectedTextArray.push(teamObject.Name.trim());
                  }
               });
               currentTeamsSelectedListText = selectedTextArray.join(", ");
            }
            $("#compDashboardCurrentFilter_Team", element).empty();
            $("#compDashboardCurrentFilter_Team", element).append(currentTeamsSelectedListText);

            let currentUsersSelected = $("#compDashboardCurrentFilterSelected_Users", element).val();
            let currentUserSelectedListText = "All";
            if (currentUsersSelected != null && currentUsersSelected != "") {
               let selectedTextArray = [];
               let selectedArray = currentUsersSelected.split(",");
               selectedArray.forEach(function (item) {
                  let userObject = possibleFilterOptionObjects.userProfiles.find(i => i.Id == item);
                  if (userObject != null) {
                     selectedTextArray.push(userObject.Name.trim());
                  }
               });
               currentUserSelectedListText = selectedTextArray.join(", ");
            }
            $("#compDashboardCurrentFilter_Users", element).empty();
            $("#compDashboardCurrentFilter_Users", element).append(currentUserSelectedListText);

            if (callback != null) {
               callback();
            }
         }
         /* Data Rendering END */
         /* Editor Loading START */
         function LoadFilterSelectionPanel(callback, area) {
            $("#filterApplyArea", element).val(area);

            switch (area?.toLowerCase()) {
               case "project":
                  LoadProjectOptions();
                  break;
               case "location":
                  LoadLocationOptions();
                  break;
               case "group":
                  LoadGroupOptions();
                  break;
               case "team":
                  LoadTeamOptions();
                  break;
               case "users":
                  LoadAuditorOptions();
                  break;
            }
            if (callback != null) {
               callback();
            }
         }
         function ClearAllCurrentSelectedFilters(callback) {
            let filterType = $("#filterApplyArea", element).val();
            $("[id^='chkFilterOption_']", element).each(function (item) {
               $(this).prop("checked", false);
            });
            let item = null;
            switch (filterType?.toLowerCase()) {
               case "project":
                  item = $(`#compDashboardCurrentFilterSelected_Project`, element);
                  break;
               case "location":
                  item = $(`#compDashboardCurrentFilterSelected_Location`, element);
                  break;
               case "group":
                  item = $(`#compDashboardCurrentFilterSelected_Group`, element);
                  break;
               case "team":
                  item = $(`#compDashboardCurrentFilterSelected_Team`, element);
                  break;
               case "users":
                  item = $(`#compDashboardCurrentFilterSelected_Users`, element);
                  break;
            }
            if (item != null) {
               item.val("");
            }
            RenderCurrentFilterInformation();
            if (callback != null) {
               callback();
            }
         }
         function AddSelectedFilters(callback) {
            let filterType = $("#filterApplyArea", element).val();

            let selectedArray = [];
            $("[id^='chkFilterOption_']", element).each(function (item) {
               let checked = $(this).is(":checked");
               if (checked == true) {
                  let value = $(this).prop("value");
                  let valText = $(this).attr("valText");

                  selectedArray.push(value);
               }
            });
            let item = null;
            switch (filterType?.toLowerCase()) {
               case "project":
                  item = $(`#compDashboardCurrentFilterSelected_Project`, element);
                  break;
               case "location":
                  item = $(`#compDashboardCurrentFilterSelected_Location`, element);
                  break;
               case "group":
                  item = $(`#compDashboardCurrentFilterSelected_Group`, element);
                  break;
               case "team":
                  item = $(`#compDashboardCurrentFilterSelected_Team`, element);
                  break;
               case "users":
                  item = $(`#compDashboardCurrentFilterSelected_Users`, element);
                  break;
            }
            if (item != null) {
               item.val(selectedArray.join(","));
            }
            RenderCurrentFilterInformation();
            if (callback != null) {
               callback();
            }
         }
         /* Editor Loading END */
         /* Editor Validation & Saving START */
         /* Editor Validation & Saving END */
         /* Sorting Options START */
         function SortOptionsList(listToSort)
         {
            let sortedList = listToSort;
            sortedList = sortedList.sort((a,b) => {
               if(a.Name < b.Name)
               {
                  return -1;
               }
               else if(a.Name > b.Name)
               {
                  return 1;
               }
               else
               {
                  return 0;
               }
            });
            return sortedList;
         }
         /* Sorting Options END */
         /* Utility Functions START */
         function CanAccess(callback) {
            hasAccess = false;
            if (callback != null) {
               callback();
            }
         }
         function ResetFilters(callback) {
            $("#filterApplyArea", element).val("");
            $(`#compDashboardCurrentFilterSelected_Project`, element).val("");
            $(`#compDashboardCurrentFilterSelected_Location`, element).val("");
            $(`#compDashboardCurrentFilterSelected_Group`, element).val("");
            $(`#compDashboardCurrentFilterSelected_Team`, element).val("");
            $(`#compDashboardCurrentFilterSelected_Users`, element).val("");
            LoadCurrentMonthDates();
            RenderCurrentFilterInformation();

            if (callback != null) {
               callback();
            }
         }
         function ClearFilterSelectionPanel(callback) {
            $("#filterApplyArea", element).val("");
            $("#filterPanelSelectionOptionListHolder", element).empty();
            $("#filterPanelSelectionHolderAreaName", element).empty();

            if (callback != null) {
               callback();
            }
         }
         function FindProjectObject(callback, currentDisplayObject) {
            let returnObject = null;
            if (currentDisplayObject != null && currentDisplayObject.ProjectIdSource != null) {
               returnObject = currentDisplayObject.ProjectIdSource;
               if (possibleFilterOptionObjects.projects.findIndex(p => p.Id == returnObject.Id) < 0) {
                  possibleFilterOptionObjects.projects.push(returnObject);
               }
            }
            else if (possibleFilterOptionObjects.projects != null && possibleFilterOptionObjects.projects.length > 0) {
               returnObject = possibleFilterOptionObjects.projects.find(p => p.Id == currentDisplayObject.ProjectId);
            }
            if (returnObject == null) {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "selfserve",
                     cmd: "getProjectById",
                     projectid: currentDisplayObject.ProjectId || -1,
                     deepload: false,
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let returnData = JSON.parse(data.projectObject);
                     if (possibleFilterOptionObjects.projects.findIndex(p => p.Id == returnData.Id) < 0) {
                        possibleFilterOptionObjects.projects.push(returnData);
                     }
                     returnObject = returnData;
                  }
               });
            }
            if(callback != null)
            {
               callback(returnObject);
            }
            return returnObject;
         }
         function FindGroupObject(callback, currentDisplayObject)
         {
            let returnObject = null;
            if (currentDisplayObject != null && currentDisplayObject.GroupIdSource != null) {
               returnObject = currentDisplayObject.GroupIdSource;
               if (possibleFilterOptionObjects.groups.findIndex(p => p.Id == returnObject.Id) < 0) {
                  possibleFilterOptionObjects.groups.push(returnObject);
               }
            }
            else if (possibleFilterOptionObjects.groups != null && possibleFilterOptionObjects.groups.length > 0) {
               returnObject = possibleFilterOptionObjects.groups.find(p => p.Id == currentDisplayObject.GroupId);
            }
            if (returnObject == null) {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "selfserve",
                     cmd: "getGroupById",
                     groupid: currentDisplayObject.GroupId || -1,
                     deepload: false,
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let returnData = JSON.parse(data.groupObject);
                     if (possibleFilterOptionObjects.groups.findIndex(p => p.Id == returnData.Id) < 0) {
                        possibleFilterOptionObjects.groups.push(returnData);
                     }
                     returnObject = returnData;
                  }
               });
            }
            if(callback != null)
            {
               callback(returnObject);
            }
            return returnObject;
         }
         /* Utility Functions END */
         /* Show/Hide START */
         function HideAll() {
            HideFilterSelectionPanel();
         }
         function HideFilterSelectionPanel() {
            $("#filterPanelSelectionHolder", element).hide();
         }
         function ShowFilterSelectionPanel() {
            $("#filterPanelSelectionHolder", element).show();
         }
         // function HideEditorForm() {
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
         //TODO: Remove once the load functions have been propertly handled.
         // scope.load();
         ko.postbox.subscribe("km2ComplianceFiltersChanged", function (forceLoad) {
            if (forceLoad == null) {
               forceLoad = false;
            }
            RenderCurrentFilterInformation(function () {
               LoadComplianceData(function (foundData) {
                  ApplyFilters(function (filteredData) {
                     let dataObj = {
                        data: filteredData,
                     };
                     if (forceLoad == true) {
                        scope.load();
                     }
                     ko.postbox.publish("km2ComplianceDashboardLoad", dataObj);
                  }, foundData);
               });
               LoadComplianceLoginData(function (foundData) {
                  ApplyFilters(function (filteredData) {
                     let dataObj = {
                        data: filteredData,
                     };
                     if (forceLoad == true) {
                        scope.load();
                     }
                     ko.postbox.publish("km2ComplianceDashboardLoginLoad", dataObj);
                  }, foundData);

               });
            });
         });
         ko.postbox.subscribe("km2ComplianceDashboardLoad", function(){
            BarebonesLoad();
         });
         //    console.log("Dashboard Apply Filter called.");
         //    // initialData.length = 0;
         //    // initialData = dataObjects;
         //    scope.load();
         // });
      }
   };
}]);