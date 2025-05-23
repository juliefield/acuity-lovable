angularApp.directive("ngDataManagerOptions", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/ACUITYADMIN1/view/dataManagerOptions.htm?' + Date.now(),
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
         const ENDING_MESSAGE_DISPLAY_TIMING = 3000;
         var allAvailableApis = [];
         var possibleKpis = [];
         var possibleUsers = [];
         var currentApiStatus = [];
         var currentImportList = [];
         var possibleAGameDivisions = [];

         var baseLoadingImageUrl = a$.debugPrefix() + "/applib/css/images/acuity-loading.gif";

         scope.Initialize = function () {
            HideAll();
            SetDatePickers();
            LoadAvailableUsers(null, function () {
               LoadSelectionList("user");
            });
            LoadAvailableKpis(null, function () {
               LoadSelectionList("kpi");
            });
            LoadAGameDivisions(null, function(){
               LoadSelectionList("agame");
            });
            LoadAvailableApis();
            LoadPossibleApiList();
            LoadCurrentClientIngrations();
         };

         function SetDatePickers() {
            //$("#fulfillmentManagerForm_PrizeFulfillmentDate", element).datepicker();
            $("#testDataStartDate", element).datepicker();
            $("#testDataEndDate", element).datepicker();
            $("#aGameDateToScore", element).datepicker();

         }

         function LoadSelectionList(areaToLoad) {
            if (areaToLoad == null) {
               areaToLoad = "all";
            }
            else {
               areaToLoad = areaToLoad.toLowerCase();
            }

            let loadAll = (areaToLoad == "all");
            if (areaToLoad == "user" || loadAll) {
               $("#testDataUserFor", element).empty();
               $("#testDataUserFor", element).append($("<option />", { text: "All Users", value: "ALL" }));
               let userList = SortUserList(null, "firstname");
               for (let uIndex = 0; uIndex < userList.length; uIndex++) {
                  let user = userList[uIndex];
                  $("#testDataUserFor", element).append($("<option />", { text: user.UserFullName, value: user.UserId }));
               }
            }
            if (areaToLoad == "kpi" || loadAll) {
               $("#testDataKpi", element).empty();
               $("#testDataKpi", element).append($("<option />", { text: "All KPIs", value: "ALL" }));
               let kpiList = SortKpiList(null, null);
               for (let kIndex = 0; kIndex < kpiList.length; kIndex++) {
                  let kpiItem = kpiList[kIndex];
                  $("#testDataKpi", element).append($("<option />", { text: kpiItem.Text, value: kpiItem.MqfNumber }));
               }
            }
            if(areaToLoad == "agame" || loadAll)
            {
               $("#aGameDivisionToScore", element).empty();
               $("#aGameDivisionToScore", element).append($("<option />", { text: "All Divisions", value: "-1" }));
               for(let dIndex = 0; dIndex < possibleAGameDivisions.length; dIndex++)
               {
                  let divisionItem = possibleAGameDivisions[dIndex];
                  $("#aGameDivisionToScore", element).append($("<option />", { text: divisionItem.DivisionName, value: divisionItem.DivisionId }));
               }
            }
         }
         function LoadAvailableApis() {
            allAvailableApis.push({ Value: "genesys", Name: "GeneSys" });
            allAvailableApis.push({ Value: "five9", Name: "five9" });
            allAvailableApis.push({ Value: "ftp", Name: "FTP" });
            // allAvailableApis.push({ Value: "livevox", Name: "LiveVox" });
            allAvailableApis.push({ Value: "smartsurvey", Name: "Smart Survey" });
            //allAvailableApis.push({ Value: "snowflake", Name: "Snowflake" });
            allAvailableApis.push({ Value: "zendesk", Name: "ZenDesk" });
            // allAvailableApis.push({ Value: "convoso", Name: "Convoso" });

            allAvailableApis = allAvailableApis.sort((a, b) => { a.Name < b.Name ? -1 : 0 });
         }
         function LoadPossibleApiList() {
            $("#apiToChange", element).empty();
            let emptyOption = $("<option />", { value: "", text: "Select API" });
            $("#apiToChange", element).append(emptyOption);

            for (let aIndex = 0; aIndex < allAvailableApis.length; aIndex++) {
               let apiItem = allAvailableApis[aIndex];
               let apiOption = $("<option />", { value: apiItem.Value, text: apiItem.Name });

               $("#apiToChange", element).append(apiOption);
            }
         }
         function DoUserBadgeAssignments(callback) {
            a$.ajax({
               type: "GET",
               service: "C#",
               async: true,
               data: {
                  lib: "selfserve",
                  cmd: "doUserBageAutomation"
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (jsonData) {
                  if (jsonData.errormessage != null && jsonData.errormessage == "true") {
                     a$.jsonerror(jsonData);
                     return;
                  }
                  else {

                     if (callback != null) {
                        callback();
                     }
                  }
               }
            });
         }
         function DoUserPointsAssignments(callback) {
            a$.ajax({
               type: "GET",
               service: "C#",
               async: true,
               data: {
                  lib: "selfserve",
                  cmd: "doAllPointsAssignmentForEarnedBadges"
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (jsonData) {
                  if (jsonData.errormessage != null && jsonData.errormessage == "true") {
                     a$.jsonerror(jsonData);
                     return;
                  }
                  else {

                     if (callback != null) {
                        callback();
                     }
                  }
               }
            });
         }
         function DoTrophyAssignments(callback) {

            if (callback != null) {
               callback();
            }
            // a$.ajax({
            //    type: "GET",
            //    service: "C#",
            //    async: true,
            //    data: {
            //       lib: "selfserv",
            //       cmd:"doAllUserTrophyEarnings"
            //    },
            //    dataType: "json",
            //    cache: false,
            //    error: a$.ajaxerror,
            //    success: function (jsonData) {
            //       if (callback != null) {
            //          callback();
            //       }
            //    }
            // });
         }
         function DoFlexScoring(callback) {
            alert("Not yet implemented.");
            if (callback != null) {
               callback();
            }
            // a$.ajax({
            //    type: "GET",
            //    service: "C#",
            //    async: true,
            //    data: {
            //       lib: "flex",
            //       cmd:"doAutomatedScoring"
            //    },
            //    dataType: "json",
            //    cache: false,
            //    error: a$.ajaxerror,
            //    success: function (jsonData) {
            //       if (callback != null) {
            //          callback();
            //       }
            //    }
            // });
         }
         function DoBudgetAssignments(callback) {
            let budgetDateVal = $("#budgetMonthDate", element).val() || null;
            let budgetDate = null;
            if (budgetDateVal != null && budgetDateVal != "") {
               budgetDate = new Date(budgetDateVal).toLocaleDateString("en-US");
            }
            a$.ajax({
               type: "GET",
               service: "C#",
               async: true,
               data: {
                  lib: "selfserve",
                  cmd: "generateUserBudgets",
                  budgetdate: budgetDate
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

                     let returnData = data;
                     let budgetInfoCreated = false;
                     if (returnData != null) {
                        budgetInfoCreated = new Boolean(returnData.budgetsGenerated);
                     }
                     let returnObject = { successful: budgetInfoCreated, value: budgetInfoCreated, message: "", data: returnData };

                     if (budgetInfoCreated == false) {
                        returnObject.message = "Budget information not created.";
                     }
                     else {
                        returnObject.message = "Budgets have been created.";
                     }
                     if (callback != null) {
                        callback(returnObject);
                     }
                  }
               }
            });
         }
         function DoGoalProcessing(callback) {
            a$.ajax({
               type: "GET",
               service: "C#",
               async: true,
               data: {
                  lib: "userprofile",
                  cmd: "processGoalData"
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

                     if (callback != null) {
                        callback();

                     }
                  }
               }
            });
         }
         function ClearBudgetInput() {
            $("#budgetMonthDate", element).val("");
         }
         function StartUserBadgeAssignments(callback) {
            WriteUserMessage("Running User Badge Assignments", $("#UserBadgeAssignmentMessages", element), true);
            DisableStartButton("btnRunUserBadgeAssignment");
            DoUserBadgeAssignments(callback);
         }
         function StartUserPointsAssignments(callback) {
            WriteUserMessage("Running User Credits Assignments", $("#UserPointsAssignmentMessages", element), true);
            DisableStartButton("btnRunUserPointsAssignment");
            DoUserPointsAssignments(callback)
         }
         function StartUserTrophyAssignments(callback) {
            WriteUserMessage("Running User Trophy Assignments", $("#UserTrophyAssignmentMessages", element), true);
            DisableStartButton("btnRunUserTrophyAssignment");
            DoTrophyAssignments(callback);
         }
         function StartFlexAutomatedScoring(callback) {
            WriteUserMessage("Running Flex Scoring", $("#FlexAutomatedScoringMessages", element), true);
            DisableStartButton("btnRunFlexAutomatedScoring");
            DoFlexScoring(callback);
         }
         function StartAutomatedBudgetAssignment(callback) {
            WriteUserMessage("Assigning Monthly Budgets", $("#budgetAssignmentMessages", element), true);
            DisableStartButton("btnMonthlyBudgetAssignment");
            DoBudgetAssignments(callback);
         }
         function StartRandomTestDataGeneration(callback) {
            WriteUserMessage("Generating random user test data...", $("#testDataMessages", element), true);
            DisableStartButton("btnTestDataGenerate");
            DoGenerateRandomTestData(callback);
         }
         function StartGoalProcessing(callback) {
            WriteUserMessage("Doing Goal Processing...", $("#goalExecutionMessages", element), true);
            DisableStartButton("btnStartGoalProcessing");
            DoGoalProcessing(callback);
         }
         function CompleteUserBadgeAssignments() {
            WriteUserMessage("User Badge Assignments Complete.", $("#UserBadgeAssignmentMessages", element), false);
            EnableStartButton("btnRunUserBadgeAssignment");
            EndUserMessageDisplay("UserBadgeAssignmentMessages");
         }
         function CompleteUserPointsAssignments() {
            WriteUserMessage("User Credits Assignments Complete.", $("#UserPointsAssignmentMessages", element), false);
            EnableStartButton("btnRunUserPointsAssignment");
            EndUserMessageDisplay("UserPointsAssignmentMessages");
         }
         function CompleteUserTrophyAssignments() {
            WriteUserMessage("Trophy Assignment Complete.", $("#UserTrophyAssignmentMessages", element), false);
            EnableStartButton("btnRunUserTrophyAssignment");
            EndUserMessageDisplay("UserTrophyAssignmentMessages");
         }
         function CompleteFlexAutomatedScoring() {
            WriteUserMessage("Flex Scoring Complete.", $("#FlexAutomatedScoringMessages", element), false);
            EnableStartButton("btnRunFlexAutomatedScoring");
            EndUserMessageDisplay("FlexAutomatedScoringMessages");
         }
         function CompleteAutomatedBudgetAssignment(statusInfo) {
            WriteUserMessage("Budget Assignment Complete!", $("#budgetAssignmentMessages", element), false);
            EnableStartButton("btnMonthlyBudgetAssignment");
            ClearBudgetInput();
            EndUserMessageDisplay("budgetAssignmentMessages");
         }
         function CompleteGoalProcessing() {
            WriteUserMessage("Goal Processing Complete!", $("#goalExecutionMessages", element), false);
            EnableStartButton("btnStartGoalProcessing");
            EndUserMessageDisplay("goalExecutionMessages");
         }
         function CompleteRandomTestDataGeneration() {
            WriteUserMessage("Random Test Data Generation Complete.", $("#testDataMessages", element), false);
            EnableStartButton("btnTestDataGenerate");
            EndUserMessageDisplay("testDataMessages");
         }
         function DisableStartButton(buttonName, callback) {
            $("#" + buttonName, element).prop("disabled", true);
            $("#" + buttonName, element).addClass("running");

         }
         function EnableStartButton(buttonName, callback) {
            $("#" + buttonName, element).prop("disabled", false);
            $("#" + buttonName, element).removeClass("running");

         }
         function WriteUserMessage(messageToWrite, messageHolderObject, includeLoadingImage) {

            if (includeLoadingImage == null) {
               includeLoadingImage = false;
            }
            let message = messageToWrite;
            if (includeLoadingImage) {
               let messageImage = "<img src=\"" + baseLoadingImageUrl + "\" height=\"25\" /> ";
               message = messageImage + message;
            }
            $(messageHolderObject).empty();
            $(messageHolderObject).append(message);
            $(messageHolderObject).show();
         }
         function EndUserMessageDisplay(messageHolderId, timing) {
            if (timing == null) {
               timing = ENDING_MESSAGE_DISPLAY_TIMING;
            }
            let messageHolderObject = $("#" + messageHolderId, element);
            $(messageHolderObject).fadeOut(timing, "swing", function () {
               WriteUserMessage("", messageHolderObject, false);
            });

         }
         /*User Handling*/
         function LoadAvailableUsers(forceReload, callback) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (possibleUsers != null && possibleUsers.length > 0 && forceReload == false) {
               if (callback != null) {
                  callback(possibleUsers);
               }
            }
            else {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: true,
                  data: {
                     lib: "selfserv",
                     cmd: "getAllProfiles"
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
                        var userList = JSON.parse(data.allProfilesList);
                        possibleUsers.length = 0;
                        possibleUsers = userList;
                        if (callback != null) {
                           callback(userList);
                        }
                     }
                  }
               });
            }
         }

         function SortUserList(listToSort, fieldToSort) {
            if (listToSort == null) {
               listToSort = possibleUsers;
            }
            let sortedUserList = listToSort;
            if (sortedUserList != null) {
               switch (fieldToSort?.toLowerCase()) {
                  case "firstname":
                     sortedUserList = sortedUserList.sort((a, b) => {
                        if (a.FirstName.toLowerCase() < b.FirstName.toLowerCase()) {
                           return -1;
                        }
                        if (a.FirstName.toLowerCase() > b.FirstName.toLowerCase()) {
                           return 1;
                        }
                        if (a.FirstName.toLowerCase() == b.FirstName.toLowerCase()) {
                           if (a.LastName.toLowerCase() < b.LastName.toLowerCase()) {
                              return -1;
                           }
                           if (a.LastName.toLowerCase() > b.LastName.toLowerCase()) {
                              return 1;
                           }
                           if (a.LastName.toLowerCase() == b.LastName.toLowerCase()) {
                              return 0;
                           }
                        }
                     });
                     break;
                  case "lastname":
                     sortedUserList = sortedUserList.sort((a, b) => {
                        if (a.LastName.toLowerCase() < b.LastName.toLowerCase()) {
                           return -1;
                        }
                        if (a.LastName.toLowerCase() > b.LastName.toLowerCase()) {
                           return 1;
                        }
                        if (a.LastName.toLowerCase() == b.LastName.toLowerCase()) {
                           if (a.FirstName.toLowerCase() < b.FirstName.toLowerCase()) {
                              return -1;
                           }
                           if (a.FirstName.toLowerCase() > b.FirstName.toLowerCase()) {
                              return 1;
                           }
                           if (a.FirstName.toLowerCase() == b.FirstName.toLowerCase()) {
                              return 0;
                           }
                        }
                     });
                     break;
                  default:
                     sortedUserList = sortedUserList.sort((a, b) => {
                        if (a.UserId.toLowerCase() < b.UserId.toLowerCase()) {
                           return -1;
                        }
                        if (a.UserId.toLowerCase() > b.UserId.toLowerCase()) {
                           return 1;
                        }
                        if (a.UserId.toLowerCase() == b.UserId.toLowerCase()) {
                           return 0;
                        }
                     });
                     break;
               }
            }

            return sortedUserList;
         }
         /*User Handling End*/
         /*KPI Handling*/

         function LoadAvailableKpis(forceReload, callback) {

            if (forceReload == null) {
               forceReload = false;
            }
            if (possibleKpis != null && possibleKpis.length > 0 && forceReload == false) {
               if (callback != null) {
                  callback(possibleKpis);
               }
            }
            else {
               a$.ajax({
                  type: "GET",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "flex",
                     cmd: "getPossibleScoringAreas",
                     userId: legacyContainer.scope.TP1Username
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (jsonData) {
                     if (jsonData.errormessage != null && jsonData.errormessage == "true") {
                        a$.jsonerror(jsonData);
                        return;
                     }
                     else {
                        let returnData = null;
                        if (jsonData.scoringAreaList != null) {
                           returnData = JSON.parse(jsonData.scoringAreaList);
                           possibleKpis.length = 0;
                           possibleKpis = returnData;
                        }
                        if (callback != null) {
                           callback(returnData);
                        }
                        return;
                     }
                  }
               });
            }
         }
         function SortKpiList(listToSort, fieldToSort) {
            if (listToSort == null) {
               listToSort = possibleKpis;
            }
            let sortedUserList = listToSort;
            if (sortedUserList != null) {
               switch (fieldToSort?.toLowerCase()) {
                  default:
                     sortedUserList = sortedUserList.sort((a, b) => {
                        if (a.Text.toLowerCase() < b.Text.toLowerCase()) {
                           return -1;
                        }
                        if (a.Text.toLowerCase() > b.Text.toLowerCase()) {
                           return 1;
                        }
                        if (a.Text.toLowerCase() == b.Text.toLowerCase()) {
                           return 0;
                        }
                     });
                     break;
               }
            }

            return sortedUserList;
         }
         /*KPI Handling End*/
         /*Api Information Handling*/


         function HandleApiOptionChange() {
            let apiOptionValue = $("#apiToChange", element).val();
            LoadApiInfoForm(apiOptionValue, function () {
               LoadCurrentApiDataForClient(apiOptionValue);
            });
         }
         function LoadApiInfoForm(data, callback) {
            let hasAdditionalInfo = false;
            let additionalInfoHolder = $("<div />");
            switch (data.toLowerCase()) {
               case "five9":
               case "ftp":
               case "smartsurvey":
               case "zendesk":
               case "convoso":
               case "genesys":
                  hasAdditionalInfo = true;
                  LoadAdditionalInfoFormPortion(data, additionalInfoHolder);
                  break;
            }
            $("#additionalApiInformationHolder", element).empty();
            if (hasAdditionalInfo) {

               $("#additionalApiInformationHolder", element).append(additionalInfoHolder);
            }
            if (callback != null) {
               callback();
            }
         }
         function LoadAdditionalInfoFormPortion(areaToLoad, renderToObject) {
            let additionalFormFields = $("<div />");
            switch (areaToLoad.toLowerCase()) {
               case "five9":
                  let voTokenHolder = $("<div />");
                  let voTokenInput = $("<input type=\"textbox\" id=\"voToken\" />");
                  voTokenHolder.append("VO Token: ");
                  voTokenHolder.append(voTokenInput);
                  additionalFormFields.append(voTokenHolder);
                  break;
               case "ftp":
                  let ftpHolder = $("<div />");
                  let ftpInput = $("<input type=\"textbox\" id=\"ftpAddress\" />");
                  ftpHolder.append("FTP Address: ");
                  ftpHolder.append(ftpInput);
                  additionalFormFields.append(ftpHolder);
                  break;
               case "smartsurvey":
                  let authTokenHolder = $("<div />");
                  let authTokenInput = $("<input type=\"textbox\" id=\"authToken\" />");
                  let authTokenSecretInput = $("<input type=\"textbox\" id=\"authTokenSecret\" />");
                  authTokenHolder.append("Auth Token: ");
                  authTokenHolder.append(authTokenInput);
                  authTokenHolder.append("<br />");
                  authTokenHolder.append("Auth Token Secret: ");
                  authTokenHolder.append(authTokenSecretInput);
                  additionalFormFields.append(authTokenHolder);
                  break;
               case "zendesk":
                  let authTokenHolderZD = $("<div />");
                  let authTokenInputZD = $("<input type=\"textbox\" id=\"authToken\" />");
                  authTokenHolderZD.append("Auth Token: ");
                  authTokenHolderZD.append(authTokenInputZD);
                  additionalFormFields.append(authTokenHolderZD);
                  break;
               case "convoso":
                  let apiTokenHolder = $("<div />");
                  let apiTokenInput = $("<input type=\"textbox\" id=\"apiToken\" />");
                  apiTokenHolder.append("API Token: ");
                  apiTokenHolder.append(apiTokenInput);
                  additionalFormFields.append(apiTokenHolder);
                  break;
               case "genesys":
                  let geneSysTokenHolder = $("<div />");
                  let geneSysTokenInput = $("<input type=\"textbox\" id=\"geneSysToken\" />");
                  let geneSysToken2Input = $("<input type=\"textbox\" id=\"geneSysToken2\" />");
                  geneSysTokenHolder.append("GeneSys Token 1: ");
                  geneSysTokenHolder.append(geneSysTokenInput);
                  geneSysTokenHolder.append("<br />");
                  geneSysTokenHolder.append("GeneSys Token 2: ");
                  geneSysTokenHolder.append(geneSysToken2Input);
                  additionalFormFields.append(geneSysTokenHolder);
                  break;

            }
            $(renderToObject).append(additionalFormFields);
         }
         function LoadCurrentClientIngrations(forceReload, callback) {
            GetCurrentIntegrationsForClient(forceReload, function (apiList) {
               RenderCurrentIntegrationsForClient(apiList, function () {
                  if (callback != null) {
                     callback();
                  }
               })
            });
         }
         function GetCurrentIntegrationsForClient(forceReload, callback) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (currentApiStatus != null && currentApiStatus.length > 0 && forceReload == false) {
               if (callback != null) {
                  callback(currentApiStatus);
               }
            }
            else {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "selfserv",
                     cmd: "getCurrentIntegrationListForClient"
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

                        var currentIntegrationList = JSON.parse(data.currentClientIntegrations);
                        currentApiStatus.length = 0;
                        currentApiStatus = currentIntegrationList;
                        if (callback != null) {
                           callback(currentIntegrationList);
                        }
                     }
                  }
               });
            }
         }
         function RenderCurrentIntegrationsForClient(listToRender, callback) {
            if (listToRender == null) {
               listToRender = currentApiStatus;
            }
            $("#currentApiIntegrationsList", element).empty();
            let apiIntegrationHolder = $("<div class=\"api-integrations-list-holder\" />");
            if (listToRender != null && listToRender.length > 0) {
               for (let aIndex = 0; aIndex < listToRender.length; aIndex++) {
                  let item = listToRender[aIndex];
                  let availableIndex = allAvailableApis.findIndex(i => i.Value == item.ApiName);
                  if (availableIndex > -1) {
                     let apiIntegrationRow = $("<div class=\"api-integration-list-row\" />");
                     let apiNameHolder = $("<div class=\"api-integration-list-item current-api-name\" />");
                     let apiName = allAvailableApis[availableIndex].Name || item.ApiName;
                     apiNameHolder.append(apiName);

                     let apiStatusHolder = $("<div class=\"api-integration-list-item current-api-status\" />");
                     let statusImage = $("<i class=\"fa fa-circle-xmark red-check\"></i>");
                     if (item.HasApiIntegrationInfo == true) {
                        statusImage = $("<i class=\"fa fa-circle-check green-check\"></i>");
                     }
                     apiStatusHolder.append(statusImage);

                     apiIntegrationRow.append(apiNameHolder);
                     apiIntegrationRow.append(apiStatusHolder);

                     apiIntegrationHolder.append(apiIntegrationRow);
                  }

               }
            }
            else {
               apiIntegrationHolder.append("No Integration Information found.");
            }
            $("#currentApiIntegrationsList", element).append(apiIntegrationHolder);
            if (callback != null) {
               callback();
            }
         }
         function GetCurrentApiDataForClient(apiDataToLoad, callback) {
            a$.ajax({
               type: "GET",
               service: "C#",
               async: false,
               data: {
                  lib: "selfserve",
                  cmd: "getCurrentApiDataForClient",
                  api: apiDataToLoad

               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (jsonData) {
                  if (jsonData.errormessage != null && jsonData.errormessage == "true") {
                     a$.jsonerror(jsonData);
                     return;
                  }
                  else {
                     let data = JSON.parse(jsonData.apiData);
                     if (callback != null) {
                        callback(data);
                     }
                  }
               }
            });
         }
         function LoadCurrentApiDataForClient(apiDataToLoad, callback) {
            GetCurrentApiDataForClient(apiDataToLoad, function (apiData) {
               LoadClientApiToForm(apiData, apiDataToLoad);
               if (callback != null) {
                  callback();
               }
            });
         }
         function LoadClientApiToForm(apiData, apiSection) {
            $("#apiUsername", element).val(apiData.UserName);
            $("#apiPassword", element).val(apiData.Password);
            let id = -1;
            switch (apiSection) {
               case "genesys":
                  id = apiData.GeneSysApiClientDataId;
                  $("#geneSysToken", element).val(apiData.GeneSysToken);
                  $("#geneSysToken2", element).val(apiData.GeneSysToken2);
                  break;
               case "five9":
                  id = apiData.Five9ClientKeyid;
                  $("#voToken", element).val(apiData.VoToken);
                  break;
               case "ftp":
                  id = apiData.FtpApiClientDataId;
                  $("#ftpAddress", element).val(apiData.FtpAddress);
                  break;
               case "zendesk":
                  id = apiData.ZenDeskClientKeyId;
                  $("#authToken", element).val(apiData.AuthToken);
                  break;
               case "smartsurvey":
                  id = apiData.SmartSurveyApiId;
                  $("#authToken", element).val(apiData.AuthToken);
                  $("#authTokenSecret", element).val(apiData.AuthTokenSecret);
                  break;
            }

            $("#existingApiId", element).val(id);
         }
         function ValidateApiManagementForm(callback) {
            let isValidForm = true;
            if (isValidForm == true) {
               if (callback != null) {
                  callback();
               }
            }
            else {
               console.log("Validate of API failed.  No validation rules setup.");
            }
         }
         function SaveApiManagementForm(callback) {
            let apiDataOptionToSave = $("#apiToChange", element).val();
            let objectToSave = BuildApiDataObjectToSave(apiDataOptionToSave);
            a$.ajax({
               type: "GET",
               service: "C#",
               async: false,
               data: {
                  lib: "selfserve",
                  cmd: "saveApiIntegrationForClient",
                  api: apiDataOptionToSave,
                  objectData: JSON.stringify(objectToSave)
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

                     if (callback != null) {
                        callback();

                     }
                  }
               }
            });
         }
         function BuildApiDataObjectToSave(apiOptionToBuild) {
            let returnObject = new Object();
            let id = $("#existingApiId", element).val();
            returnObject.Client = -1;
            returnObject.UserName = $("#apiUsername", element).val();
            returnObject.Password = $("#apiPassword", element).val();

            switch (apiOptionToBuild.toLowerCase()) {
               case "five9":
                  returnObject.Five9ClientKeyId = id;
                  returnObject.VoToken = $("#voToken", element).val();
                  break;
               case "ftp":
                  returnObject.FtpApiClientDataId = id;
                  returnObject.FtpAddress = $("#ftpAddress", element).val();
                  break;
               case "smartsurvey":
                  returnObject.SmartSurveyApiId = id;
                  returnObject.AuthToken = $("#authToken", element).val();
                  returnObject.AuthTokenSecret = $("#authTokenSecret", element).val();
                  break;
               case "zendesk":
                  returnObject.ZenDeskClientKeyId = id;
                  returnObject.AuthToken = $("#authToken", element).val();
                  break;
               case "convoso":
                  //
                  returnObject.ConvosoApiClientDataId = id;
                  returnObject.ApiToken = $("#apiToken", element).val();
                  break;
               case "genesys":
                  returnObject.GeneSysApiClientDataId = id;
                  returnObject.GeneSysToken = $("#geneSysToken", element).val();
                  returnObject.GeneSysToken2 = $("#geneSysToken2", element).val();
                  break;
               case "livevox":
                  returnObject.LiveVoxClientKeyId = id;
                  break;
               default:
                  returnObject.Id = id;
                  break;
            }
            return returnObject;
         }
         function ClearApiManagementForm(callback) {
            $("#existingApiId", element).val(-1);
            $("#apiToChange", element).val("");
            $("#apiUsername", element).val("");
            $("#apiPassword", element).val("");
            $("#additionalApiInformationHolder", element).empty();
            if (callback != null) {
               callback();
            }
         }
         /*Api Information Handling End*/
         /*Generate Random Data*/
         function ConfirmGenerateTestData(callback) {
            if (confirm("Are you sure?")) {
               callback();
            }
         }
         function DoGenerateRandomTestData(callback) {
            let testDataStartDate = $("#testDataStartDate", element).val();
            let testDataEndDate = $("#testDataEndDate", element).val();
            let testDataKpi = $("#testDataKpi", element).val();
            let testDataUser = $("#testDataUserFor", element).val();
            console.log("Generate random test data here. [" + testDataStartDate + "|" + testDataEndDate + "|" + testDataKpi + "|" + testDataUser + "]");

            a$.ajax({
               type: "POST",
               service: "C#",
               async: true,
               data: {
                  lib: "selfserv",
                  cmd: "generateRandomTestData",
                  startdate: testDataStartDate,
                  enddate: testDataEndDate,
                  userid: testDataUser,
                  kpinumber: testDataKpi
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

                     if (callback != null) {
                        callback();
                     }
                  }
               }
            });
         }
         /*Generate Random Data End*/
         /*Scoring Calls*/
         function StartScoringCalculations(callback) {
            WriteUserMessage("Performing scoring calculations...", $("#scoringExecutionMessages", element), true);
            DisableStartButton("btnStartDailyScoring");
            DoScoringCalculations(callback);
         }
         function DoScoringCalculations(callback) {
            alert("Not yet implemented.");
            //while in development...pause so we can ensure things are working as intended.
            window.setTimeout(function () {
               if (callback != null) {
                  callback();
               }
            }, 10000);
         }
         function CompleteScoringCalculations() {
            WriteUserMessage("Scoring complete!", $("#scoringExecutionMessages", element), false);
            EnableStartButton("btnStartDailyScoring");
            EndUserMessageDisplay("scoringExecutionMessages", ENDING_MESSAGE_DISPLAY_TIMING);
            // window.setTimeout(function () {
            //    WriteUserMessage("", $("#scoringExecutionMessages", element), false);
            // }, ENDING_MESSAGE_DISPLAY_TIMING);
         }
         /*Scoring Calls End*/
         /*Import Information*/
         function LoadImportInformation(forceReload, callback) {
            if (forceReload == null) {
               forceReload = false;
            }
            GetImportInformation(forceReload, function (dataList) {
               RenderImportInformation(dataList, callback);
            });
         }
         function GetImportInformation(forceReload, callback) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (currentImportList != null && currentImportList.length > 0 && forceReload == false) {
               if (callback != null) {
                  callback(currentImportList);
               }
            }
            else {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "selfserv",
                     cmd: "getImportInformation"
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

                        var importList = JSON.parse(data.importList);
                        currentImportList.length = 0;
                        currentImportList = importList;
                        if (callback != null) {
                           callback(importList);
                        }
                     }
                  }
               });
            }

         }
         function RenderImportInformation(listToRender, callback) {
            $("#dataManagerImportStats", element).empty();
            let importListHolder = $("<div />");

            if (listToRender != null && listToRender.length > 0) {
               for (let iIndex = 0; iIndex < listToRender.length; iIndex++) {
                  let item = listToRender[iIndex];

                  let importInfoRow = $("<div class=\"import-information-list-item-row\" />");
                  let importItemNameHolder = $("<div class=\"import-information-item-holder import-name\" />");
                  let importItemStatusHolder = $("<div class=\"import-information-item-holder import-status\" />");
                  let importItemImportForDatesHolder = $("<div class=\"import-information-item-holder import-for-dates\" />");
                  let importItemCompleteOnDateHolder = $("<div class=\"import-information-item-holder import-complete-date\" />");

                  let importAreaName = FormatExecutionName(item.ExecutionStepName);
                  importItemNameHolder.append(importAreaName);

                  importItemStatusHolder.append(item.ExecutionStatus);
                  let datesFor = new Date(item.ImportStartDateValue).toLocaleDateString() + " - " + new Date(item.ImportEndDateValue).toLocaleDateString();
                  let compDate = "";
                  if (item.ExecutionEndDateTime != null) {
                     let execCompTime = new Date(item.ExecutionEndDateTime);
                     compDate = execCompTime.toLocaleDateString() + " @ " + execCompTime.toLocaleTimeString();

                  }
                  importItemImportForDatesHolder.append(datesFor);
                  importItemCompleteOnDateHolder.append(compDate);

                  importInfoRow.append(importItemNameHolder);
                  importInfoRow.append(importItemStatusHolder);
                  importInfoRow.append(importItemImportForDatesHolder);
                  importInfoRow.append(importItemCompleteOnDateHolder);

                  importListHolder.append(importInfoRow);
               }
            }
            else {
               importListHolder.append("No Import information found.");
            }

            $("#dataManagerImportStats", element).append(importListHolder);

            if (callback != null) {
               callback();
            }
         }
         function FormatExecutionName(areaName) {
            let formattedName = areaName;
            switch (areaName.toLowerCase()) {
               case "calllog":
                  formattedName = "Calls";
                  break;
               case "campaigndata":
                  formattedName = "Campaigns";
                  break;
               case "rosterimport":
                  formattedName = "Roster";
                  break;
               case "statoptions":
                  formattedName = "User Stats";
                  break;
               case "usercampaigns":
                  formattedName = "User Campaigns";
                  break;
               case "userworkstats":
                  formattedName = "Worker Stats";
                  break;
               case "zendesksatisfaction":
                  formattedName = "Zendesk Satisfaction";
                  break;
               case "zendeskticket":
                  formattedName = "Zendesk Tickets";
                  break;

            }

            return formattedName;
         }
         /*Import Information END*/
         /*A-GAME Scoring Execution*/
         function StartAGameScoring(callback)
         {
            WriteUserMessage("Starting A-GAME Scoring...", $("#agameScoringMessages", element), true);
            DisableStartButton("btnAGameScoring");
            DoAGameScoring(callback);
         }
         function CompleteAGameScoring(callback)
         {
            WriteUserMessage("A-GAME Scoring Complete.", $("#agameScoringMessages", element), false);
            EnableStartButton("btnAGameScoring");
            ResetAGameScoringForm();
            EndUserMessageDisplay("agameScoringMessages");
         }
         function ResetAGameScoringForm()
         {
            $("#aGameDivisionToScore", element).val(-1);
         }
         function ValidateAGameScoringForm(callback)
         {
            let isValidForm = true;
            if (isValidForm == true) {
               if (callback != null) {
                  callback();
               }
            }
            else {
               console.log("No validation setup for AGame Scoring form.");               
            }
         }
         function DoAGameScoring(callback)
         {
            console.log("DoAGameScoring.");
            ValidateAGameScoringForm(function(){               
               let divisionId = parseInt($("#aGameDivisionToScore", element).val());
               let dateToScore = $("#aGameDateToScore", element).val();

               if(dateToScore == null || dateToScore == "")
               {
                  dateToScore = new Date(); 
               }

                ScoreAGameDivision(divisionId, dateToScore, callback);
            });
         }
          function ScoreAGameDivision(divisionId, dateToScore, callback)
          {
              a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: true,
                  data: {
                      lib: "flex",
                      cmd: "doAGameDivisionScoring",
                      divisionid: divisionId,
                      scoringdate: new Date(dateToScore).toLocaleDateString()
                  },
                  dataType: "json",
                  cache: false,
                  error: function() {
                      a$.ajaxerror();
                        return;
                  },
                  success: function (data) {
                      if (data.errormessage != null && data.errormessage == "true") {
                          a$.jsonerror(data);
                          if(callback != null)
                          {
                              callback();
                          }
                          return;
                      }
                      else {
                          if (callback != null) {
                              callback();
                          }
                      }
                  }
              });
          }
          function LoadAGameDivisions(forceReload, callback)
          {
              if (forceReload == null) {
                  forceReload = false;
              }
              if (possibleUsers != null && possibleAGameDivisions.length > 0 && forceReload == false) {
                  if (callback != null) {
                      callback(possibleAGameDivisions);
                  }
              }
              else {
                  a$.ajax({
                      type: "POST",
                      service: "C#",
                      async: true,
                      data: {
                          lib: "flex",
                          cmd: "getAGameDivisionsForClient"
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
                              var divisionList = JSON.parse(data.divisionList);
                              possibleAGameDivisions.length = 0;
                              possibleAGameDivisions = divisionList;
                              if (callback != null) {
                                  callback(divisionList);
                              }
                          }
                      }
                  });
              }
          }

         /*A-GAME Scoring Execution END*/
         function HideAll() {
            HideApiManagementForm();
         }

         function HideApiManagementForm() {
            $("#apiInformationManagementForm", element).hide();
         }
         function ShowApiManagementForm() {
            $("#apiInformationManagementForm", element).show();

         }

         scope.load = function () {
            scope.Initialize();
            currentApiStatus.length = 0;
            $("#btnRunUserBadgeAssignment", element).off("click").on("click", function () {
               StartUserBadgeAssignments(function () {
                  CompleteUserBadgeAssignments();
               });
            });
            $("#btnRunUserPointsAssignment", element).off("click").on("click", function () {
               StartUserPointsAssignments(function () {
                  CompleteUserPointsAssignments();
               });
            });
            $("#btnRunUserTrophyAssignment", element).off("click").on("click", function () {
               StartUserTrophyAssignments(function () {
                  CompleteUserTrophyAssignments();
               });
            });
            $("#btnRunFlexAutomatedScoring", element).off("click").on("click", function () {
               StartFlexAutomatedScoring(function () {
                  CompleteFlexAutomatedScoring();
               });
            });
            $("#btnMonthlyBudgetAssignment", element).off("click").on("click", function () {
               StartAutomatedBudgetAssignment(function (statusInformation) {
                  CompleteAutomatedBudgetAssignment(statusInformation);
               });
            });
            $("#btnChangeApiInformation", element).off("click").on("click", function () {
               ShowApiManagementForm();
            });
            $("#apiToChange", element).off("change").on("change", function () {
               HandleApiOptionChange();
            });
            $(".btn-cancel-api", element).off("click").on("click", function () {
               ClearApiManagementForm(function () {
                  HideApiManagementForm();
               });
            });
            $("#btnSaveApiInformation", element).off("click").on("click", function () {
               ValidateApiManagementForm(function () {
                  SaveApiManagementForm(function () {
                     ClearApiManagementForm();
                     HideApiManagementForm();
                  });
               });
            });
            $("#btnTestDataGenerate", element).off("click").on("click", function () {
               if (a$.urlprefix() == "www.") {
                  if (legacyContainer.scope.TP1Username == "cjarboe") {
                     ConfirmGenerateTestData(function () {
                        StartRandomTestDataGeneration(function () {
                           CompleteRandomTestDataGeneration();
                        });
                     });
                  }
                  else {
                     console.log("Not available to the user.");
                     alert("This functionality is not available to you.");
                  }
               }
               else {
                  console.log("Not available to the client.  Only Acuity has this functionality.");
               }

            });
            $("#btnStartDailyScoring", element).off("click").on("click", function () {
               StartScoringCalculations(function () {
                  CompleteScoringCalculations();
               });
            });
            $("#btnStartGoalProcessing", element).off("click").on("click", function () {
               StartGoalProcessing(function () {
                  CompleteGoalProcessing();
               });
            });
            $("#btnRefreshImportInfo", element).off("click").on("click", function(){
               LoadImportInformation(true);
            });
            $("#btnAGameScoring", element).off("click").on("click", function(){
               StartAGameScoring(function(){
                  CompleteAGameScoring();
               });
            });

            LoadImportInformation();
         };

         ko.postbox.subscribe("DataManagerOptionsLoad", function () {
            scope.load();
         });
         ko.postbox.subscribe("DataManagerOptionsReload", function () {
            scope.load();
         });
         ko.postbox.subscribe("DataManagerImportInformationReload", function () {
            LoadImportInformation(true);
         });
      }
   };
}]);
