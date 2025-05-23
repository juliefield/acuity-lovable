angularApp.directive("ngReportAdmin", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/ACUITYADMIN1/view/reportAdmin.htm?' + Date.now(),
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
         var canEditClientAccess = false;
         var canEditRoleAccess = false;
         var canEditUserAccess = false;

         var possibleClients = [];
         var possibleUsers = [];
         //TODO: Handle the possible roles?
         var possibleRoles = ["Admin", "CorpAdmin", "CSR", "Team Leader", "Group Leader", "Management", "Quality Assurance"];
         var possibleProjects = [];
         var possibleGroups = [];
         var possibleTeams = [];
         var possibleReports = [];

         var currentAssignedClients = [];
         var currentAssignedUsers = [];
         var currentAssignedRoles = [];
         var currentAssignedProjects = [];
         var currentAssignedGroups = [];
         var currentAssignedTeams = [];

         scope.Initialize = function () {
            HideAll();
            SetDatePickers();
            SetAccessLevels();
            GetPossibleReports();
            GetPossibleClients();
            GetPossibleUsers(function () {
               LoadPossibleUsers();
            });
            LoadPossibleClients();
            LoadPossibleRoles();
            LoadPossibleReports();
            LoadFilterOptions();
            //LoadPossibleUsers();
            //LoadPossibleProjects();
            //LoadPossibleGroups();
            //loadPossibleTeams();
         };
         function SetDatePickers() {
            //$("#fulfillmentManagerForm_PrizeFulfillmentDate", element).datepicker();
         }
         function SetAccessLevels() {
            canEditClientAccess = (legacyContainer.scope.TP1Role == "Admin");
            canEditRoleAccess = (legacyContainer.scope.TP1Role == "Admin" || legacyContainer.scope.TP1Role == "CorpAdmin");
            canEditUserAccess = (legacyContainer.scope.TP1Role == "Admin" || legacyContainer.scope.TP1Role == "CorpAdmin" || legacyContainer.scope.TP1Role == "Management");
         }
         function HideAll() {
         }
         function LoadFilterOptions(loadArea, callback) {
            if (loadArea == null) {
               loadArea = "ALL";
            }
            if (loadArea == "ALL" || loadArea == "client") {
               $("#clientSelectorFilter", element).empty();
               $("#clientSelectorFilter", element).append("<option value=\"\">Select Client</option>");
               $("#clientSelectorFilter", element).append("<option value=\"0\">No Assigned Client (Global Reports)</option>");

               if (possibleClients != null && possibleClients.length > 0) {
                  for (let cc = 0; cc < possibleClients.length; cc++) {
                     let clientItem = possibleClients[cc];
                     let clientSelectorItem = $("<option />");
                     clientSelectorItem.val(clientItem.ClientNumber);
                     clientSelectorItem.text(clientItem.Name);
                     $("#clientSelectorFilter", element).append(clientSelectorItem);
                  }
               }
            }

            if (callback != null) {
               callback();
            }
         }
         function GetPossibleReports(forceReload, callback) {
            let returnData = null;
            if (forceReload == null) {
               forceReload = true;
            }
            if (possibleReports != null && possibleReports.length > 0 && forceReload != true) {
               returnData = possibleReports;
               if (callback != null) {
                  callback(returnData);
               }
            }
            else {
               a$.ajax({
                  type: "GET",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "selfserve",
                     cmd: "getAllReports"
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (jsonData) {
                     let returnData = null;
                     if (jsonData.reportsList != null) {
                        returnData = JSON.parse(jsonData.reportsList);
                        possibleReports.length = 0;
                        possibleReports = returnData;
                     }
                     if (callback != null) {
                        callback(returnData);
                     }
                     return;
                  }
               });

            }
         }
         function GetPossibleClients(callback) {
            if (possibleClients != null && possibleClients.length == 0) {
               a$.ajax({
                  type: "GET",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "selfserve",
                     cmd: "getAllClients"
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (jsonData) {
                     let returnData = null;
                     if (jsonData.acuityClientsList != null) {
                        returnData = JSON.parse(jsonData.acuityClientsList);
                        possibleClients.length = 0;
                        possibleClients = returnData;

                     }
                     if (callback != null) {
                        callback(returnData);
                     }
                     return;
                  }
               });
            }
         }
         function GetPossibleUsers(callback) {
            WriterUserLoadingMessage("Getting possible users...");
            if (possibleUsers != null && possibleUsers.length == 0) {
               a$.ajax({
                  type: "GET",
                  service: "C#",
                  async: true,
                  data: {
                     lib: "userprofile",
                     cmd: "getAllProfiles",
                     deepLoad: false
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (jsonData) {
                     let returnData = null;
                     if (jsonData.userProfiles != null) {
                        returnData = JSON.parse(jsonData.userProfiles);
                        possibleUsers.length = 0;
                        possibleUsers = returnData;
                     }
                     if (callback != null) {
                        callback();
                     }
                     return;
                  }
               });
            }
            else {
               if (callback != null) {
                  callback();
               }
            }

         }
         function LoadPossibleClients(callback) {
            let clientSelectionHolder = $("<div />");
            BuildClientSelectionOptions(clientSelectionHolder);
            $("#possibleClientListHolder", element).empty();
            $("#possibleClientListHolder", element).append(clientSelectionHolder);
            if (callback != null) {
               callback();
            }
         }
         function LoadPossibleReports(reportsToRender, callback) {
            if (reportsToRender == null) {
               reportsToRender = possibleReports;
            }
            $("#reportSelectorFilter", element).empty();
            $("#reportSelectorFilter", element).append("<option value=\"\">Select Report</option>");

            if (reportsToRender != null && reportsToRender.length > 0) {
               for (let rc = 0; rc < reportsToRender.length; rc++) {
                  let reportDataItem = reportsToRender[rc];
                  let selectionItem = $("<option />");
                  selectionItem.val(reportDataItem.Id);
                  if (reportDataItem.Allow != null && reportDataItem.Allow.includes("\|")) {
                     selectionItem.text(" **** " + reportDataItem.ReportDesc + " **** ");
                  }
                  else {
                     selectionItem.text(reportDataItem.ReportDesc);
                  }
                  $("#reportSelectorFilter", element).append(selectionItem);
               }
            }
            if (callback != null) {
               callback();
            }
         }
         function LoadPossibleUsers(callback) {
            let userSelectionHolder = $("<div class=\"user-profile-selection-list-item-holder\" />");
            BuildUserSelectionOptions(userSelectionHolder);
            $("#possibleUserListHolder", element).empty();
            $("#possibleUserListHolder", element).append(userSelectionHolder);
            HideUserLoadingMessage();
            if (callback != null) {
               callback();
            }
         }
         function BuildClientSelectionOptions(renderToObject) {
            for (let rc = 0; rc < possibleClients.length; rc++) {
               let clientItem = possibleClients[rc];

               let clientSelectionItemHolder = $("<div />");

               let clientSelectionCheckbox = $("<input type=\"checkbox\" id=\"clientSelectionItem_" + clientItem.ClientNumber + "\" value=\"" + clientItem.ClientNumber + "\" />");
               clientSelectionItemHolder.append(clientSelectionCheckbox);

               if (canEditClientAccess == true) {
                  clientSelectionCheckbox.on("change", function () {
                     HandleClientSelectionChange(this);
                  });
               }
               else {
                  clientSelectionItemHolder.addClass("no-access");
                  clientSelectionCheckbox.attr("disabled", true);
               }
               let clientSelectionNameHolder = $("<span />");
               clientSelectionNameHolder.append(clientItem.Name);


               clientSelectionItemHolder.append(clientSelectionNameHolder);

               $(renderToObject).append(clientSelectionItemHolder);
            }
         }
         function LoadPossibleRoles(callback) {
            let roleSelectionHolder = $("<div />");

            BuildRoleSelectionOptions(roleSelectionHolder);

            $("#possibleRoleListHolder", element).empty();
            $("#possibleRoleListHolder", element).append(roleSelectionHolder);

            if (callback != null) {
               callback();
            }
         }
         function FilterPossibleReports(clientNumber, callback) {
            if (clientNumber == null || clientNumber == "") {
               clientNumber = -1;
            }
            let returnArray = possibleReports.filter(x => (x.ClientNumber == clientNumber) || clientNumber == -1);
            if (callback != null) {
               callback(returnArray);
            }
            else {
               return returnArray;
            }
         }
         function BuildRoleSelectionOptions(renderToObject) {
            for (let rc = 0; rc < possibleRoles.length; rc++) {
               let roleItem = possibleRoles[rc];
               let roleItemValue = roleItem.replace(" ", "");

               let roleSelectionItemHolder = $("<div />");

               let roleSelectionCheckbox = $("<input type=\"checkbox\" id=\"roleSelectionItem_" + roleItemValue + "\" value=\"" + roleItem + "\" />");
               if (canEditRoleAccess == true) {
                  roleSelectionCheckbox.on("change", function () {
                     HandleRoleSelectionChange(this);
                  });
               }
               else {
                  roleSelectionCheckbox.addClass("no-access");
                  roleSelectionCheckbox.attr("disabled", true);
               }
               let roleSelectionNameHolder = $("<span />");
               roleSelectionNameHolder.append(roleItem);

               roleSelectionItemHolder.append(roleSelectionCheckbox);
               roleSelectionItemHolder.append(roleSelectionNameHolder);

               $(renderToObject).append(roleSelectionItemHolder);
            }
         }
         function BuildUserSelectionOptions(renderToObject) {
            WriterUserLoadingMessage("Building user list...");
            let includeInactiveUsers = $("#includeInactiveUsersForAccess", element).is(":checked");

            for (let rc = 0; rc < possibleUsers.length; rc++) {
               let userItem = possibleUsers[rc];
               let userId = userItem.UserId;
               let userFullName = userItem.UserFullName;
               let userNameWithId = userFullName + " (<i>" + userId + "</i>)";
               let isActiveUser = userItem.UserStatus != 2;

               if (isActiveUser || includeInactiveUsers == true) {
                  let userSelectionItemHolder = $("<div class=\"user-profile-selection-list-item\" />");
                  if (isActiveUser == false) {
                     userSelectionItemHolder.addClass("inactive-user");
                  }

                  let userSelectionCheckbox = $("<input type=\"checkbox\" id=\"userSelectionItem_" + userId + "\" value=\"" + userId + "\" />");

                  if (canEditUserAccess == true) {
                     userSelectionCheckbox.on("change", function () {
                        HandleUserSelectionChange(this);
                     });
                  }
                  else {
                     userSelectionCheckbox.addClass("no-access");
                     userSelectionCheckbox.attr("disabled", true);
                  }
                  let userSelectionNameHolder = $("<span />");
                  userSelectionNameHolder.append(userNameWithId);

                  userSelectionItemHolder.append(userSelectionCheckbox);
                  userSelectionItemHolder.append(userSelectionNameHolder);

                  $(renderToObject).append(userSelectionItemHolder);
               }

            }
            HideUserLoadingMessage();
         }

         function HandleClientSelectionChange(item) {
            let itemChecked = $(item).is(":checked");
            let itemValue = $(item).val();

            let currentString = $("#clientAllowStringInfo", element).val();
            let currentArray = [];
            if (currentString != null && currentString != "") {
               currentArray = currentString.split(",");
            }
            let valuesArray = HandleValueWithArray(itemValue, itemChecked, currentArray);

            $("#clientAllowStringInfo", element).val(valuesArray.join(","));
            BuildNewValuesArrays();
         }
         function HandleRoleSelectionChange(item) {
            let itemChecked = $(item).is(":checked");
            let itemValue = $(item).val();

            let currentString = $("#roleAllowStringInfo", element).val();
            let currentArray = [];
            if (currentString != null && currentString != "") {
               currentArray = currentString.split(",");
            }
            let valuesArray = HandleValueWithArray(itemValue, itemChecked, currentArray);

            $("#roleAllowStringInfo", element).val(valuesArray.join(","));
            BuildNewValuesArrays();
         }
         function HandleUserSelectionChange(item) {
            let itemChecked = $(item).is(":checked");
            let itemValue = $(item).val();

            let currentString = $("#userAllowStringInfo", element).val();
            let currentArray = [];
            if (currentString != null && currentString != "") {
               currentArray = currentString.split(",");
            }
            let valuesArray = HandleValueWithArray(itemValue, itemChecked, currentArray);

            $("#userAllowStringInfo", element).val(valuesArray.join(","));
            BuildNewValuesArrays();
         }
         function HandleValueWithArray(value, isChecked, arrayToManage) {
            let currentArray = arrayToManage;

            if (currentArray.length > 0) {
               if (isChecked == true && !currentArray.includes(value)) {
                  if (value != null && value != "") {
                     currentArray.push(value);
                  }
               }
               else if (isChecked == false && currentArray.includes(value)) {
                  for (let i = 0; i < currentArray.length; i++) {
                     if (currentArray[i] === value) {
                        currentArray.splice(i, 1);
                     }
                  }
               }
            }
            else {
               if (value != null && value != "") {
                  currentArray.push(value);
               }
            }
            return currentArray;
         }
         function HandleReportSelectedInformation(reportId, callback) {
            $("#clientAllowStringInfo", element).val("");
            $("#roleAllowStringInfo", element).val("");
            $("#userAllowStringInfo", element).val("");
            let reportData = possibleReports.find(x => x.ReportId == reportId);
            let cidInfo = reportId;
            let currentAllow = "";
            let currentDisallow = "";
            if (reportData != null) {
               cidInfo = reportData.ReportName;
               currentAllow = reportData.Allow;
               currentDisallow = reportData.Disallow;
            }
            //TODO: Handle the current OR situations...will ignore those items currently.
            if (currentAllow != "" && !currentAllow.includes("\|")) {
               let allowArray = currentAllow.split("\/");
               if (allowArray.length == 3) {
                  $("#clientAllowStringInfo", element).val(allowArray[0]);
                  $("#roleAllowStringInfo", element).val(allowArray[2]);
                  $("#userAllowStringInfo", element).val(allowArray[1]);
               }
            }
            MarkCurrentAllowItems();
            $("#reportSelectedCIDName", element).empty();
            $("#reportSelectedCIDName", element).append(cidInfo);
            $("#originalAllowString", element).val(currentAllow);

            if (callback != null) {
               callback();
            }
            else {
               return;
            }
         }
         function MarkCurrentAllowItems() {

            let clientAllowsArray = $("#clientAllowStringInfo", element).val().split(",");
            if (clientAllowsArray.length > 0) {
               clientAllowsArray.forEach(function (value) {
                  $("#clientSelectionItem_" + value, element).prop("checked", true);
               });
            }
            //roles
            let rolesAllowArray = $("#roleAllowStringInfo", element).val().split(",");
            if (rolesAllowArray.length > 0) {
               rolesAllowArray.forEach(function (value) {
                  value = value.replace(" ", "");
                  $("#roleSelectionItem_" + value, element).prop("checked", true);
               });
            }
            //users
            let usersAllowArray = $("#userAllowStringInfo", element).val().split(",");
            if (usersAllowArray.length > 0) {
               usersAllowArray.forEach(function (value) {
                  $("#userSelectionItem_" + value, element).prop("checked", true);
               });
            }
         }
         function BuildNewValuesArrays() {
            let baseString = "{client}/{user}/{role}";
            let clientValues = $("#clientAllowStringInfo", element).val();
            let roleValues = $("#roleAllowStringInfo", element).val();
            let userValues = $("#userAllowStringInfo", element).val();

            baseString = baseString.replace("{client}", clientValues);
            baseString = baseString.replace("{user}", userValues);
            baseString = baseString.replace("{role}", roleValues);

            BuildCountersValues();
            $("#newAllowString", element).val(baseString);
         }
         function BuildCountersValues() {
            $("#foundClientAccessCounter", element).empty();
            $("#foundRoleAccessCounter", element).empty();
            $("#foundUserAccessCounter", element).empty();

            let clientCount = 0;
            clientCount = $("input[id^='clientSelectionItem_']:checked", element).length;
            let roleCount = 0;
            roleCount = $("input[id^='roleSelectionItem_']:checked", element).length;
            let userCount = 0;
            userCount = $("input[id^='userSelectionItem_']:checked", element).length;


            let clientCounterHolder = $(" <span />");
            clientCounterHolder.append("(" + clientCount + ")");
            let roleCounterHolder = $(" <span />");
            roleCounterHolder.append("(" + roleCount + ")");
            let userCounterHolder = $(" <span />");
            userCounterHolder.append("(" + userCount + ")");

            $("#foundClientAccessCounter", element).append(clientCounterHolder);
            $("#foundRoleAccessCounter", element).append(roleCounterHolder);
            $("#foundUserAccessCounter", element).append(userCounterHolder);

         }
         function ClearFilters(callback) {
            $("#clientSelectorFilter", element).val("");
            $("#reportSelectorFilter", element).val("");

            $("#clientSelectorFilter", element).change();

            if (callback != null) {
               callback();
            }
         }

         function ValidateForm(callback) {
            $(".error-information-holder", element).empty();

            let formValid = true;
            let errorMessages = [];
            let reportId = $("#reportSelectorFilter", element).val();


            if (reportId == null || reportId == "") {
               errorMessages.push({ message: "Select a report.", fieldclass: "", fieldid: "#reportSelectorFilter" });
               formValid = false;

            }

            if (formValid) {
               HideErrorMessageHolder();
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
                     $(item.fieldid, element).addClass("errorField");
                     $(item.fieldid, element).off("blur").on("blur", function () {
                        $(this).removeClass("errorField");
                     });
                  }
               }
               if (messageString != "") {
                  messageString += "</ul>";
                  $(".error-information-holder", element).html(messageString);
                  ShowErrorMessageHolder();
               }
            }
         }
         function SaveReportAdminForm(callback) {
            console.log("SaveReportAdminForm()");
            alert("Not yet implemented.");
            if (callback != null) {
               callback();
            }

         }

         function UncheckAllCheckboxes(callback) {
            $("input[type='checkbox']", element).each(function () {
               $(this).prop("checked", false);
            });
         }
         function WriterUserLoadingMessage(messageToWrite) {
            $("#userLoadingMessage", element).empty();
            $("#userLoadingMessage", element).append(messageToWrite);
            ShowUserLoadingMessage();
         }
         function ShowUserLoadingMessage() {
            $("#userLoadingHolder", element).show();
         }
         function HideUserLoadingMessage() {
            $("#userLoadingHolder", element).hide();
         }
         function ShowErrorMessageHolder() {
            $(".error-information-holder", element).show();
         }
         function HideErrorMessageHolder() {
            $(".error-information-holder", element).hide();
         }

         scope.load = function () {
            scope.Initialize();
            $("#clientSelectorFilter", element).off("change").on("change", function () {
               UncheckAllCheckboxes();
               let clientNumber = $("#clientSelectorFilter", element).val();
               FilterPossibleReports(clientNumber, function (reportList) {
                  LoadPossibleReports(reportList);
               });
               $("#reportSelectorFilter", element).change();
               BuildNewValuesArrays()
            });
            $("#reportSelectorFilter", element).off("change").on("change", function () {
               UncheckAllCheckboxes();
               let reportId = $("#reportSelectorFilter", element).val();
               HandleReportSelectedInformation(reportId);
               BuildNewValuesArrays()
            });
            $("#reportAdmin_RefreshList", element).off("click").on("click", function () {
               ko.postbox.publish("reportAdminRefresh");
            });
            $("#reportAdmin_ClearFilters", element).off("click").on("click", function () {
               ClearFilters(function () {
                  $("#clientSelectorFilter", element).change();
                  $("#reportSelectorFilter", element).change();
               });
            });
            $("#includeInactiveUsersForAccess", element).off("change").on("change", function () {
               WriterUserLoadingMessage("Refreshing list...");
               window.setTimeout(function () {
                  LoadPossibleUsers();
               }, 500);
            });
            $("#btnSave", element).off("click").on("click", function () {
               ValidateForm(function () {
                  SaveReportAdminForm(function () {
                     $("#reportSelectorFilter", element).change();
                  });
               });
            });
         };

         ko.postbox.subscribe("reportAdminLoad", function () {
            scope.load();
         });
         ko.postbox.subscribe("reportAdminRefresh", function () {
            console.log("Handle refresh of the admin piece.");
            alert("Not yet implemented.");
            UncheckAllCheckboxes();
            BuildNewValuesArrays();
         });
      }
   };
}]);