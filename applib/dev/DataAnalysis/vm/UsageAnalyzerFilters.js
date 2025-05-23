angularApp.directive("ngUsageAnalyzerFilters", [
   "api",
   "$rootScope",
   function (api, $rootScope) {
      return {
         templateUrl: `${a$.debugPrefix()}/applib/dev/DataAnalysis/view/UsageAnalyzerFilters.htm?${Date.now()}`,
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
            /* Directive Variables START */
            let lookupDataOptions = {
               Projects: [],
               Locations: [],
               Groups: [],
               Teams: [],
               UserProfiles: [],
               // AreaLoadFilters: [
               //    { id: "groupLeader", RoleText: "Group Leader" },
               //    { id: "teamLeader", RoleText: "Team Leader" },
               //    { id: "admin", RoleText: "CorpAdmin" },
               //    { id: "qa", RoleText: "Quality Assurance" },
               // ],
            };
            HideAll();
            let loadingUrl = a$.debugPrefix() + "/applib/css/images/acuity-loading.gif";
            /* Directive Variables END */
            /* Directive Events START */
            $("#btnApplyUsageAnalyzerFilters", element).off("click").on("click", function () {
               let filtersToApply = GetSelectedFiltersToApply();
               ko.postbox.publish("UsageAnalysis_ApplyFilters", filtersToApply);
            });
            $("#btnClearUsageAnalyzerFilters", element).off("click").on("click", function () {
               ResetFilters(function () {
                  let filtersToApply = GetSelectedFiltersToApply();
                  ko.postbox.publish("UsageAnalysis_ApplyFilters", filtersToApply);
               });
            });
            $(".showAddToFilterButton", element).off("click").on("click", function () {
               let buttonValue = $(this).attr("dataValue");
               LoadFilterSelectionPanel(function () {
                  ShowSelectionPanel();
               }, buttonValue);
            });
            $("#btnAddSelectedFilter", element).off("click").on("click", function () {
               AddSelectedFilters(function () {
                  ClearFilterSelectionPanel();
                  HideSelectionPanel();
               });
            });
            $("#btnClearCurrentFilters", element).off("click").on("click", function () {
               ClearAllCurrentSelectedFilters();
            });
            $(".btn-close", element).off("click").on("click", function () {
               ClearFilterSelectionPanel(function () {
                  HideSelectionPanel();
               });

            });
            $("#usageAnalyzerFilter_IncludeInactives", element).off("change").on("change", function(){
               console.log("include inactive items clicked.  Do Something.");
            });
            /* Directive Events END */
            function Initalize() {
               HideAll();
            }
            /* Directive Specific Functions START */
            function LoadDirectiveData(callback, forceReload) {
               console.log("LoadDirectiveData(callback, forceReload)");
               if (callback != null) {
                  callback();
               }
            }
            /* Directive Specific Functions END */
            /* Data Loading functions START */
            function LoadProjectOptions(callback, forceReload) {
               GetProjectOptions(function (dataList) {
                  RenderProjectOptions(callback, dataList);
               }, forceReload);
            }
            function LoadLocationOptions(callback, forceReload) {
               GetLocationOptions(function (dataList) {
                  RenderLocationOptions(callback, dataList);
               }, forceReload);
            }
            function LoadGroupOptions(callback, forceReload) {
               GetGroupOptions(function (dataList) {
                  RenderGroupOptions(callback, dataList);
               }, forceReload);
            }
            function LoadTeamOptions(callback, forceReload) {
               GetTeamOptions(function (dataList) {
                  RenderTeamOptions(callback, dataList);
               }, forceReload);
            }
            function ClearAllCurrentSelectedFilters(callback) {
               let filterType = $("#filterApplyArea", element).val();
               $("[id^='chkFilterOption_']", element).each(function (item) {
                  $(this).prop("checked", false);
               });
               let item = null;
               switch (filterType?.toLowerCase()) {
                  case "project":
                     item = $(`#usageAnalyzerFilterSelected_Project`, element);
                     break;
                  case "location":
                     item = $(`#usageAnalyzerFilterSelected_Location`, element);
                     break;
                  case "group":
                     item = $(`#usageAnalyzerFilterSelected_Group`, element);
                     break;
                  case "team":
                     item = $(`#usageAnalyzerFilterSelected_Team`, element);
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
            //TODO: Determine if we really need these "GET" functions.
            //TODO: Can use to load data from the database when we do not have look up options.
            function GetProjectOptions(callback, forceReload, includeInactives) {
               if(includeInactives == null)
               {
                  includeInactives = false;
               }
               let returnList = lookupDataOptions.Projects.filter(i => i.Status == "A" || includeInactives == true);

               if (callback != null) {
                  callback(returnList);
               }
               return returnList;
            }
            function GetLocationOptions(callback, forceReload, includeInactives) {
               let returnList = lookupDataOptions.Locations.filter(i => i.Status == "A" || includeInactives == true);;
               if (callback != null) {
                  callback(returnList);
               }
               return returnList;
            }
            function GetGroupOptions(callback, forceReload, includeInactives) {
               let returnList = lookupDataOptions.Groups.filter(i => i.Status == "A" || includeInactives == true);;
               if (callback != null) {
                  callback(returnList);
               }
               return returnList;
            }
            function GetTeamOptions(callback, forceReload, includeInactives) {
               let returnList = lookupDataOptions.Teams.filter(i => i.Status == "A" || includeInactives == true);;
               if (callback != null) {
                  callback(returnList);
               }
               return returnList;
            }
            /* Data Loading functions END */
            /* Directive Rendering Functions START */
            function RenderCurrentFilterInformation(callback, filterArea) {
               if (filterArea == null) {
                  filterArea = "";
               }
               let currentProjectsSelected = $("#usageAnalyzerFilterSelected_Project", element).val();
               let currentProjectsSelectedListText = "All";

               if (currentProjectsSelected != null && currentProjectsSelected != "") {
                  let selectedTextArray = [];
                  let selectedArray = currentProjectsSelected.split(",");
                  selectedArray.forEach(function (item) {
                     let projectObject = lookupDataOptions.Projects.find(i => i.Id == item);
                     if (projectObject != null) {
                        selectedTextArray.push(projectObject.Name.trim());
                     }
                  });
                  currentProjectsSelectedListText = selectedTextArray.join(", ");
               }
               $("#usageAnalyzerFilter_Project", element).empty();
               $("#usageAnalyzerFilter_Project", element).append(currentProjectsSelectedListText);

               let currentLocationsSelected = $("#usageAnalyzerFilterSelected_Location", element).val();
               let currentLocationsSelectedListText = "All";
               if (currentLocationsSelected != null && currentLocationsSelected != "") {
                  let selectedTextArray = [];
                  let selectedArray = currentLocationsSelected.split(",");
                  selectedArray.forEach(function (item) {
                     let locationObject = lookupDataOptions.Locations.find(i => i.Id == item);
                     if (locationObject != null) {
                        selectedTextArray.push(locationObject.Name.trim());
                     }
                  });
                  currentLocationsSelectedListText = selectedTextArray.join(", ");
               }
               $("#usageAnalyzerFilter_Location", element).empty();
               $("#usageAnalyzerFilter_Location", element).append(currentLocationsSelectedListText);

               let currentGroupsSelected = $("#usageAnalyzerFilterSelected_Group", element).val();
               let currentGroupsSelectedListText = "All";
               if (currentGroupsSelected != null && currentGroupsSelected != "") {
                  let selectedTextArray = [];
                  let selectedArray = currentGroupsSelected.split(",");
                  selectedArray.forEach(function (item) {
                     let groupObject = lookupDataOptions.Groups.find(i => i.Id == item);
                     let groupName = item;
                     if (groupObject != null) {
                        groupName = groupObject.Name.trim();
                        let projectObject = FindProjectObject(null, groupObject);
                        let projectName = "";
                        if (projectObject != null && projectObject.Id > 0) {
                           projectName = projectObject.Name;
                           groupName = `${projectName} - ${groupObject.Name.trim()}`;
                        }
                     }
                     selectedTextArray.push(groupName.trim());
                  });
                  currentGroupsSelectedListText = selectedTextArray.join(", ");
               }
               $("#usageAnalyzerFilter_Group", element).empty();
               $("#usageAnalyzerFilter_Group", element).append(currentGroupsSelectedListText);


               let currentTeamsSelected = $("#usageAnalyzerFilterSelected_Team", element).val();
               let currentTeamsSelectedListText = "All";
               if (currentTeamsSelected != null && currentTeamsSelected != "") {
                  let selectedTextArray = [];
                  let selectedArray = currentTeamsSelected.split(",");
                  selectedArray.forEach(function (item) {
                     let teamObject = lookupDataOptions.Teams.find(i => i.Id == item);
                     if (teamObject != null) {
                        selectedTextArray.push(teamObject.Name.trim());
                     }
                  });
                  currentTeamsSelectedListText = selectedTextArray.join(", ");
               }
               $("#usageAnalyzerFilter_Team", element).empty();
               $("#usageAnalyzerFilter_Team", element).append(currentTeamsSelectedListText);

               // let currentUsersSelected = $("#compDashboardCurrentFilterSelected_Users", element).val();
               // let currentUserSelectedListText = "All";
               // if (currentUsersSelected != null && currentUsersSelected != "") {
               //    let selectedTextArray = [];
               //    let selectedArray = currentUsersSelected.split(",");
               //    selectedArray.forEach(function (item) {
               //       let userObject = possibleFilterOptionObjects.userProfiles.find(i => i.Id == item);
               //       if (userObject != null) {
               //          selectedTextArray.push(userObject.Name.trim());
               //       }
               //    });
               //    currentUserSelectedListText = selectedTextArray.join(", ");
               // }
               // $("#usageAnalyzerFilter_Users", element).empty();
               // $("#usageAnalyzerFilter_Users", element).append(currentUserSelectedListText);

               if (callback != null) {
                  callback();
               }
            }
            function RenderProjectOptions(callback, listToRender) {
               if (listToRender == null) {
                  listToRender = lookupDataOptions.Projects;
               }
               let currentProjectsSelected = $("#usageAnalyzerFilterSelected_Project", element).val();
               let currentProjectsArray = currentProjectsSelected.split(",");

               $("#filterPanelSelectionOptionListHolder", element).empty();
               $("#filterPanelSelectionHolderAreaName", element).empty();
               $("#filterPanelSelectionHolderAreaName", element).append("Project");
               
               listToRender = SortOptionsList(listToRender);
               listToRender.forEach(function (filterItem) {
                  let selectionRow = $(`<div class="filter-panel-row" />`);
                  if(filterItem.Status == "I")
                  {
                     selectionRow.addClass("inactive-item-holder");
                  }
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
               });
               if (callback != null) {
                  callback();
               }
            }
            function RenderLocationOptions(callback, listToRender) {
               if (listToRender == null) {
                  listToRender = lookupDataOptions.Locations;
               }
               let currentLocationsSelected = $("#usageAnalyzerFilterSelected_Location", element).val();
               let currentSelectionArray = currentLocationsSelected.split(",");

               $("#filterPanelSelectionOptionListHolder", element).empty();
               $("#filterPanelSelectionHolderAreaName", element).empty();

               $("#filterPanelSelectionHolderAreaName", element).append("Location");
               listToRender = SortOptionsList(listToRender);
               listToRender.forEach(function (filterItem) {
                  let selectionRow = $(`<div class="filter-panel-row" />`);
                  if(filterItem.Status == "I")
                  {
                     selectionRow.addClass("inactive-item-holder");
                  }
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
               });
               if (callback != null) {
                  callback();
               }
            }
            function RenderGroupOptions(callback, listToRender) {
               if (listToRender == null) {
                  listToRender = lookupDataOptions.Groups;
               }
               let currentGroupSelected = $("#usageAnalyzerFilterSelected_Group", element).val();
               let currentSelectionArray = currentGroupSelected.split(",");

               $("#filterPanelSelectionOptionListHolder", element).empty();
               $("#filterPanelSelectionHolderAreaName", element).empty();

               $("#filterPanelSelectionHolderAreaName", element).append("Groups");
               listToRender = SortOptionsList(listToRender);
               listToRender.forEach(function (filterItem) {
                     let selectionRow = $(`<div class="filter-panel-row" />`);
                     if(filterItem.Status == "I")
                     {
                        selectionRow.addClass("inactive-item-holder");
                     }
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
               });
               if (callback != null) {
                  callback();
               }
            }
            function RenderTeamOptions(callback, listToRender) {
               if (listToRender == null) {
                  listToRender = lookupDataOptions.Teams;
               }
               let currentTeamsSelected = $("#usageAnalyzerFilterSelected_Team", element).val();
               let currentSelectionArray = currentTeamsSelected.split(",");

               $("#filterPanelSelectionOptionListHolder", element).empty();
               $("#filterPanelSelectionHolderAreaName", element).empty();

               $("#filterPanelSelectionHolderAreaName", element).append("Team");
               listToRender = SortOptionsList(listToRender);
               listToRender.forEach(function (filterItem) {
                     let selectionRow = $(`<div class="filter-panel-row" />`);
                     if(filterItem.Status == "I")
                     {
                        selectionRow.addClass("inactive-item-holder");
                     }
                     let optionHolder = $(`<div class="filter-panel-item option-holder" />`)
                     let nameHolder = $(`<div class="filter-panel-item name-holder" />`);
                     let displayNameWithFormatting = filterItem.Name;
                     let displayName = filterItem.Name;
                     let groupObject = FindGroupObject(null, filterItem);
                     if (groupObject != null) {
                        displayNameWithFormatting = `<b>${filterItem.Name}</b> <i>(${groupObject.Name})</i> `;
                        displayName = ` ${filterItem.Name} (${groupObject.Name})`;
                        let projectObject = FindProjectObject(null, groupObject);
                        if (projectObject != null) {
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
               });
               if (callback != null) {
                  callback();
               }
            }
            /* Directive Rendering Functions END */
            /* Editor Loading START */
            function LoadFilterSelectionPanel(callback, area, forceReload) {
               let includeInactives = $("#usageAnalyzerFilter_IncludeInactives", element).is(":checked") || false;
               $("#filterApplyArea", element).val(area);
               switch (area?.toLowerCase()) {
                  case "project":
                     LoadProjectOptions(callback, forceReload, includeInactives);
                     break;
                  case "location":
                     LoadLocationOptions(callback, forceReload, includeInactives);
                     break;
                  case "group":
                     LoadGroupOptions(callback, forceReload, includeInactives);
                     break;
                  case "team":
                     LoadTeamOptions(callback, forceReload, includeInactives);
                     break;
               }
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
                     item = $(`#usageAnalyzerFilterSelected_Project`, element);
                     break;
                  case "location":
                     item = $(`#usageAnalyzerFilterSelected_Location`, element);
                     break;
                  case "group":
                     item = $(`#usageAnalyzerFilterSelected_Group`, element);
                     break;
                  case "team":
                     item = $(`#usageAnalyzerFilterSelected_Team`, element);
                     break;
                  // case "users":
                  //    item = $(`#usageAnalyzerFilterSelected_Users`, element);
                  //    break;
               }
               if (item != null) {
                  $(item).val(selectedArray.join(","));
               }
               RenderCurrentFilterInformation();
               if (callback != null) {
                  callback();
               }
            }
            /* Editor Loading END */
            /* Chart Rendering START */
            /* Chart Rendering END */
            /* Show/Hide START */
            function HideAll() {
               HideSelectionPanel();
            }
            function HideSelectionPanel() {
               $("#filterPanelSelectionHolder", element).hide();
            }
            function ShowSelectionPanel() {
               $("#filterPanelSelectionHolder", element).show();
            }
            /* Show/Hide END */
            /* Utility functions START */
            function SetLookupOptions(lookupObjectList) {               
               if (lookupObjectList.dataType != null && lookupObjectList.dataType != "") {
                  switch (lookupObjectList.dataType.toLowerCase()) {
                     case "project".toLowerCase():
                     case "projects".toLowerCase():
                        lookupDataOptions.Projects.length = 0;
                        lookupDataOptions.Projects = lookupObjectList.dataObjectsList;
                        break;
                     case "location".toLowerCase():
                     case "locations".toLowerCase():
                        lookupDataOptions.Locations.length = 0;
                        lookupDataOptions.Locations = lookupObjectList.dataObjectsList;
                        break;
                     case "group".toLowerCase():
                     case "groups".toLowerCase():
                        lookupDataOptions.Groups.length = 0;
                        lookupDataOptions.Groups = lookupObjectList.dataObjectsList;
                        break;
                     case "team".toLowerCase():
                     case "teams".toLowerCase():
                        lookupDataOptions.Teams.length = 0;
                        lookupDataOptions.Teams = lookupObjectList.dataObjectsList;
                        break;
                     case "users".toLowerCase():
                     case "userProfile".toLowerCase():
                     case "userProfiles".toLowerCase():
                        lookupDataOptions.UserProfiles.length = 0;
                        lookupDataOptions.UserProfiles = lookupObjectList.dataObjectsList;
                        break;
                  }
               }
            }
            function GetSelectedFiltersToApply() {
               let returnObject = {
                  Projects: null,
                  Locations: null,
                  Groups: null,
                  Teams: null,
                  Users: null,
                  Roles: null,
                  //IncludeInactives: false,
               };
               //usageAnalyzerFilter_Project
               let projectIdSelected = $("#usageAnalyzerFilterSelected_Project", element).val();
               returnObject.Projects = projectIdSelected;
               //usageAnalyzerFilter_Location
               let locationIdSelected = $("#usageAnalyzerFilterSelected_Location", element).val();
               returnObject.Locations = locationIdSelected;
               //usageAnalyzerFilter_Group
               let groupIdSelected = $("#usageAnalyzerFilterSelected_Group", element).val();
               returnObject.Groups = groupIdSelected;
               //usageAnalyzerFilter_Team
               let teamIdSelected = $("#usageAnalyzerFilterSelected_Team", element).val();
               returnObject.Teams = teamIdSelected;
               //usageAnalyzerFilter_IncludeInactives               
               // let includeInactives = $("#usageAnalyzerFilter_IncludeInactives", element).is(":checked") || false;
               // returnObject.IncludeInactives = includeInactives;
               return returnObject;
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
                  if (lookupDataOptions.Projects.findIndex(p => p.Id == returnObject.Id) < 0) {
                     lookupDataOptions.Projects.push(returnObject);
                  }
               }
               else if (lookupDataOptions.Projects != null && lookupDataOptions.Projects.length > 0) {
                  returnObject = lookupDataOptions.Projects.find(p => p.Id == currentDisplayObject.ProjectId);
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
                        if (lookupDataOptions.Projects.findIndex(p => p.Id == returnData.Id) < 0) {
                           lookupDataOptions.Projects.push(returnData);
                        }
                        returnObject = returnData;
                     }
                  });
               }
               if (callback != null) {
                  callback(returnObject);
               }
               return returnObject;
            }
            function FindGroupObject(callback, currentDisplayObject) {
               let returnObject = null;
               if (currentDisplayObject != null && currentDisplayObject.GroupIdSource != null) {
                  returnObject = currentDisplayObject.GroupIdSource;
                  if (lookupDataOptions.Groups.findIndex(p => p.Id == returnObject.Id) < 0) {
                     lookupDataOptions.Groups.push(returnObject);
                  }
               }
               else if (lookupDataOptions.Groups != null && lookupDataOptions.Groups.length > 0) {
                  returnObject = lookupDataOptions.Groups.find(p => p.Id == currentDisplayObject.GroupId);
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
                        if (lookupDataOptions.Groups.findIndex(p => p.Id == returnData.Id) < 0) {
                           lookupDataOptions.Groups.push(returnData);
                        }
                        returnObject = returnData;
                     }
                  });
               }
               if (callback != null) {
                  callback(returnObject);
               }
               return returnObject;
            }
            function ResetFilters(callback)
            {
               $("#usageAnalyzerFilterSelected_Project", element).val("");
               $("#usageAnalyzerFilterSelected_Location", element).val("");
               $("#usageAnalyzerFilterSelected_Group", element).val("");
               $("#usageAnalyzerFilterSelected_Team", element).val("");
               RenderCurrentFilterInformation();
               if(callback != null)
               {
                  callback();
               }
            }
            /* Utility functions END */
            /* Sorting Options START */
            function SortOptionsList(listToSort) {
               let sortedList = listToSort;
               sortedList = sortedList.sort((a, b) => {
                  if (a.Name < b.Name) {
                     return -1;
                  }
                  else if (a.Name > b.Name) {
                     return 1;
                  }
                  else {
                     return 0;
                  }
               });
               return sortedList;
            }
            /* Sorting Options END */
            scope.load = function () {
               Initalize();
               //LoadDirectiveData();
            };
            ko.postbox.subscribe("UsageAnalysisInit", function () {
               HideAll();
               Initalize();
            });
            ko.postbox.subscribe("UsageAnalysisLoad", function () {
               //scope.load();
            });
            ko.postbox.subscribe("UsageAnalysisReload", function () {
               //LoadDirectiveData(null, true);
            });
            ko.postbox.subscribe("UsageAnalysis_LookupDataLoaded", function (dataLookupObjects) {
               HideAll();
               SetLookupOptions(dataLookupObjects);
            }
            );
         },
      };
   },
]);

   