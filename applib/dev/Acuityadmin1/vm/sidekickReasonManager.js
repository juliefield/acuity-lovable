angularApp.directive("ngSidekickReasonManager", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/ACUITYADMIN1/view/sidekickReasonManager.htm?' + Date.now(),
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

         var hasSidekickModule = false;
         var currentReasonsList = [];
         var qaSubFormOptions = [];
         var qaFormOptions = [];
         var clientNumber = -1;

         scope.Initialize = function () {
            HideAll();
            HandleBottomButtons();
            GetPossibleQaFormOptions();
            GetPossibleSubFormOptions();
            SetClientNumber();
            LoadList("ALL");
         };
         function SetClientNumber() {
            appLib.getConfigParameterByName("CLIENT_ID", function (returnParameter) {
               clientNumber = parseInt(returnParameter.ParamValue);
            });
         }
         function GetPossibleQaFormOptions(callback) {
            a$.ajax({
               type: "POST",
               service: "C#",
               async: false,
               data: {
                  lib: "selfserv",
                  cmd: "getAllQaForms"
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (data) {
                  var qaFormOptionsList = JSON.parse(data.qaFormList);
                  qaFormOptions.length = 0;
                  qaFormOptions = qaFormOptionsList;
                  if (callback != null) {
                     callback(qaFormOptionsList);
                  }
               }
            });
         }
         function GetPossibleSubFormOptions(callback) {
            a$.ajax({
               type: "POST",
               service: "C#",
               async: false,
               data: {
                  lib: "selfserv",
                  cmd: "getAllQaSubFormOptions"
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (data) {
                  var qaSubFormListOptions = JSON.parse(data.qaSubFormOptionsList);
                  qaSubFormOptions.length = 0;
                  qaSubFormOptions = qaSubFormListOptions;
                  if (callback != null) {
                     callback(qaSubFormOptions);
                  }
               }
            });
         }

         function LoadList(listToLoad, callback) {
            let loadAll = false;
            if (listToLoad == null) {
               listToLoad == "ALL";

            }

            listToLoad = listToLoad.toUpperCase();
            loadAll = (listToLoad == "ALL");
            if (listToLoad == "QAFORM" || loadAll == true) {
               $("#qaFormId", element).empty();
               $("#qaFormId", element).append($("<option />", { value: "", text: "Select QA Form" }));
               for (let sfIndex = 0; sfIndex < qaFormOptions.length; sfIndex++) {
                  let item = qaFormOptions[sfIndex];
                  let formOptionItem = $("<option />", { value: item.Id, text: item.Name });
                  $("#qaFormId", element).append(formOptionItem);
               }
            }
            if (listToLoad == "QASUBFORM" || loadAll == true) {
               $("#qaSubFormPage", element).empty();
               $("#qaSubFormPage", element).append($("<option />", { value: "", text: "Select QA Sub Form Option" }));
               for (let sfIndex = 0; sfIndex < qaSubFormOptions.length; sfIndex++) {
                  let item = qaSubFormOptions[sfIndex];
                  let formOptionItem = $("<option />", { value: item.Id, text: item.Name });
                  $("#qaSubFormPage", element).append(formOptionItem);
               }
            }

            if (callback != null) {
               callback();
            }
         }

         function HandleBottomButtons() {
            appLib.getConfigParameterByName("MODULE_SIDEKICK", function (returnParameter) {
               if (returnParameter != null) {
                  hasSidekickModule = (returnParameter.ParamValue.toUpperCase() == "On".toUpperCase());
               }
            });
            if (hasSidekickModule == true) {
               ShowBottomButtons();
            }
            else {
               HideBottomButtons();
            }
         }

         function HandleSidekickReasonsListLoad(forceReload, callback) {
            WriteReasonLoadingMessage("Loading Sidekick Reason information...");
            GetSidekickReasonList(forceReload, function (listData) {
               let listToRender = listData;
               listToRender = FilterSidekickReasonList(listToRender);
               listToRender = SortSidekickReasonList(listToRender);
               WriteReasonLoadingMessage("Rendering Sidekick Reason items...");
               RenderSidekickReasonList(listToRender, function () {
                  HideReasonLoadingMessage();
                  if (callback != null) {
                     callback();
                  }
               });
            });
         }
         function GetSidekickReasonList(forceReload, callback) {
            if (forceReload == null) {
               forceReload = false;
            }

            if (currentReasonsList != null && currentReasonsList.length > 0 && forceReload == false) {
               if (callback != null) {
                  callback(currentReasonsList);
               }
            }
            else {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: true,
                  data: {
                     lib: "selfserv",
                     cmd: "getAllSidekickReasons"
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     var reasonsList = JSON.parse(data.SidekickReasonsList);
                     currentReasonsList.length = 0;
                     currentReasonsList = reasonsList;
                     if (callback != null) {
                        callback(reasonsList);
                     }
                  }
               });
            }
         }
         function RenderSidekickReasonList(listToRender, callback) {
            if (listToRender == null) {
               listToRender = currentReasonsList;
            }
            $("#reasonListHolder", element).empty();
            let listingHolder = $("<div />");

            if (listToRender != null && listToRender.length > 0) {
               for (let rIndex = 0; rIndex < listToRender.length; rIndex++) {
                  let reasonItem = listToRender[rIndex];
                  let isActive = (reasonItem.IsActive == true);
                  let isGlobalItem = (reasonItem.ClientNumber == 0);

                  let reasonItemRow = $("<div class=\"sidekick-reason-row-holder\" />");
                  if (isActive == false) {
                     reasonItemRow.addClass("reason-inactive");
                  }
                  let reasonCodeHolder = $("<div class=\"inline-item sidekick-reason-code\" />");
                  reasonCodeHolder.append(reasonItem.SidekickReasonCode);

                  let reasonNameHolder = $("<div class=\"inline-item sidekick-reason-name\" id=\"reasonName_" + reasonItem.SidekickReasonId + "\" />");
                  reasonNameHolder.append(reasonItem.SidekickReasonName);

                  if (reasonItem.SidekickReasonDescription != null && reasonItem.SidekickReasonDescription != "") {
                     let reasonDescHolder = $("<div class=\"sidekick-reason-description description-popup\" id=\"reasonDescription_" + reasonItem.SidekickReasonId + "\" />");
                     reasonDescHolder.append(reasonItem.SidekickReasonDescription);

                     reasonNameHolder.append(reasonDescHolder);

                     reasonNameHolder.on("click", function () {
                        let nameId = this.id;
                        let descId = nameId.split("_")[1];
                        ToggleReasonDescription(descId);
                     }).mouseenter(function () {
                        $(this).addClass("has-description");
                     }).mouseleave(function () {
                        $(this).removeClass("has-description");
                     });
                  }

                  let reasonStatusHolder = $("<div class=\"inline-item sidekick-reason-status\" />");
                  let reasonStatusText = "<i class=\"fa-sharp fa-solid fa-circle txt-green\"></i> Active";
                  if (!isActive) {
                     reasonStatusText = "<i class=\"fa-duotone fa-circle\"></i> Inactive";
                  }
                  reasonStatusHolder.append(reasonStatusText);

                  let reasonButtonHolder = $("<div class=\"inline-item sidekick-reason-buttons\" />");

                  if (!isGlobalItem) {
                     let editButton = $("<button class=\"btn button btn-edit\" id=\"editReason_" + reasonItem.SidekickReasonId + "\"><i class=\"fas fa-edit\"></i></button>");
                     editButton.attr("title", "Edit Reason");


                     reasonButtonHolder.append(editButton);
                     editButton.on("click", function () {
                        let buttonId = this.id;
                        let reasonId = buttonId.split("_")[1];
                        LoadEditorForm(reasonId, function () {
                           ShowEditorForm();
                        });
                     });

                     reasonButtonHolder.append("&nbsp;");
                  }
                  let cloneButton = $("<button class=\"btn button btn-clone\" id=\"cloneReason_" + reasonItem.SidekickReasonId + "\"><i class=\"fa fa-copy\"></i></button>");
                  if (isGlobalItem) {
                     cloneButton.attr("title", "Customize this reason");
                  }
                  else {
                     cloneButton.attr("title", "Clone this reason");
                  }



                  cloneButton.on("click", function () {
                     let buttonId = this.id;
                     let reasonId = buttonId.split("_")[1];
                     LoadEditorForCopy(reasonId, function () {
                        ShowEditorForm();
                     });
                  });

                  reasonButtonHolder.append("&nbsp;");
                  reasonButtonHolder.append(cloneButton);

                  reasonItemRow.append(reasonCodeHolder);
                  reasonItemRow.append(reasonNameHolder);
                  reasonItemRow.append(reasonStatusHolder);
                  reasonItemRow.append(reasonButtonHolder);

                  listingHolder.append(reasonItemRow);
               }
            }
            else {
               listingHolder.append("No Sidekick Reasons found.");
            }
            $("#reasonListHolder", element).append(listingHolder);

            HideAllReasonDescriptions(-1);
            if (callback != null) {
               callback();
            }
         }
         function FilterSidekickReasonList(listToFilter) {
            let filteredList = listToFilter;
            let reasonCodeFilter = $("#sidekickReasonManager_CodeFilter", element).val() || "";
            let reasonNameFilter =  $("#sidekickReasonManager_NameFilter", element).val() || "";
            
            if(reasonCodeFilter != "")
            {
               filteredList = filteredList.filter(r => r.SidekickReasonCode.toLowerCase().includes(reasonCodeFilter.toLowerCase()));
            }
            if(reasonNameFilter != "")
            {
               filteredList = filteredList.filter(r => r.SidekickReasonName.toLowerCase().includes(reasonNameFilter.toLowerCase()));
            }
            
            return filteredList;
         }
         function SortSidekickReasonList(listToSort, fieldToSort) {
            let sortedList = listToSort;
            //console.log("SortSidekickReasonList()");
            return sortedList;
         }
         function ClearFilters(callback)
         {
            $("#sidekickReasonManager_CodeFilter", element).val("");
            $("#sidekickReasonManager_NameFilter", element).val("");

            if(callback != null)
            {
               callback();
            }
         }
         /*Editor Form*/
         function LoadEditorForm(sidekickReasonId, callback) {
            if (sidekickReasonId == null) {
               sidekickReasonId = -1;
            }
            let reasonItem = currentReasonsList.find(i => i.SidekickReasonId == sidekickReasonId);
            if (reasonItem != null) {
               $("#sidekickReasonId", element).val(sidekickReasonId);
               $("#reasonCode", element).val(reasonItem.SidekickReasonCode);
               $("#reasonCode", element).prop("readonly", true);
               $("#reasonCode", element).prop("disabled", true);
               $("#reasonCode", element).off("blur");
               $("#reasonName", element).val(reasonItem.SidekickReasonName);
               $("#reasonDescription", element).val(reasonItem.SidekickReasonDescription);
               $("#qaSubFormPage", element).val(reasonItem.QASubformPage);
               $("#qaFormId", element).val(reasonItem.QAFormId);
               $("#isActive", element).prop("checked", CheckIfIsYesOption(reasonItem.IsActive));
               $("#askForRating", element).prop("checked", CheckIfIsYesOption(reasonItem.AskForRating));
               $("#displayGoals", element).prop("checked", CheckIfIsYesOption(reasonItem.DisplayGoals));
               $("#displayDeliveredBy", element).prop("checked", CheckIfIsYesOption(reasonItem.DisplayDeliveredBy));
               $("#displayNotes", element).prop("checked", CheckIfIsYesOption(reasonItem.DisplayNotes));
               $("#displayFollowup", element).prop("checked", CheckIfIsYesOption(reasonItem.DisplayFollowup));
               $("#offerNew", element).prop("checked", CheckIfIsYesOption(reasonItem.OfferNew));
               $("#countToAgentTouchGoals", element).prop("checked", CheckIfIsYesOption(reasonItem.AgentGoalCount));
               $("#countToAgentRecognition", element).prop("checked", CheckIfIsYesOption(reasonItem.AgentRecognitionCount));
               $("#countAsCoaching", element).prop("checked", CheckIfIsYesOption(reasonItem.CoachingCount));
               $("#excludeFromUserDashboard", element).prop("checked", CheckIfIsYesOption(reasonItem.ExcludeFromUserDashboard));
            }
            if (callback != null) {
               callback();
            }
         }
         function LoadEditorForCopy(reasonIdToCopy, callback) {
            LoadEditorForm(reasonIdToCopy, function () {
               //reset the reason id to something to add new to.
               $("#sidekickReasonId", element).val(-1);               
               $("#reasonCode", element).on("blur", function(){
                  IsReasonCodeAvailable();
               });
               $("#reasonCode", element).prop("readonly", false);
               $("#reasonCode", element).prop("disabled", false);
               $("#reasonCode", element).blur();

               if (callback != null) {

                  callback();
               }
            });

         }
         function ClearEditorForm(callback) {
            $("#sidekickReasonId", element).val(-1);
            $("#reasonCode", element).val("");
            $("#reasonCode", element).prop("readonly", false);
            $("#reasonCode", element).prop("disabled", false);
            $("#reasonCode", element).off("blur").on("blur", function () {
               IsReasonCodeAvailable();
            });
            $("#reasonName", element).val("");
            $("#reasonDescription", element).val("");
            $("#qaSubFormPage", element).val("");
            $("#qaFormId", element).val("");
            $("#isActive", element).prop("checked", false);
            $("#askForRating", element).prop("checked", false);
            $("#displayGoals", element).prop("checked", false);
            $("#displayDeliveredBy", element).prop("checked", false);
            $("#displayNotes", element).prop("checked", false);
            $("#displayFollowup", element).prop("checked", false);
            $("#offerNew", element).prop("checked", false);
            $("#countToAgentTouchGoals", element).prop("checked", false);
            $("#countToAgentRecognition", element).prop("checked", false);
            $("#countAsCoaching", element).prop("checked", false);
            $("#excludeFromUserDashboard", element).prop("checked", false);
            if (callback != null) {
               callback();
            }
         }
         function ValidateEditorForm(callback) {
            var formValid = true;
            var errorMessages = [];
            let sidekickReasonId = $("#sidekickReasonId", element).val();
            let sidekickReasonCode = $("#reasonCode", element).val();
            let sidekickReasonName = $("#reasonName", element).val();

            if (sidekickReasonCode == null || sidekickReasonCode == "") {
               errorMessages.push({ message: "Code is required.", fieldclass: "", fieldid: "reasonCode" });
               formValid = false;
            }
            else {
               if (sidekickReasonId <= 0 && IsReasonCodeAvailable(sidekickReasonCode) == false) {
                  errorMessages.push({ message: "Code is already in use.  These must be unique.", fieldclass: "", fieldid: "reasonCode" });
                  formValid = false;
               }
            }
            if (sidekickReasonName == null || sidekickReasonName == "") {
               errorMessages.push({ message: "Name is required.", fieldclass: "", fieldid: "reasonName" });
               formValid = false;
            }

            if (formValid) {
               if (callback != null) {
                  callback();
               }
            } else {
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
            var objectToSave = CollectSidekickReasonForm();            
            SaveSidekickReason(objectToSave, function(){
               callback();
            });
         }
         function SaveSidekickReason(sidekickReasonObject, callback)
         {
            a$.ajax({
               type: "POST",
               service: "C#",
               async: false,
               data: {
                  lib: "selfserv",
                  cmd: "saveSidekickReason",
                  sidekickreason: JSON.stringify(sidekickReasonObject)
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function () {
                  if (callback != null) {
                     callback();
                  }
               }
            });
         }
         function CollectSidekickReasonForm() 
         {
            let returnObject = new Object();

            returnObject.SidekickReasonId = parseInt($("#sidekickReasonId", element).val());
            returnObject.ClientNumber = clientNumber;

            returnObject.SidekickReasonCode = $("#reasonCode", element).val();
            returnObject.SidekickReasonName = $("#reasonName", element).val();
            returnObject.SidekickReasonDescription = $("#reasonDescription", element).val();

            returnObject.AskForRating = ConvertCheckboxCheckedToYesNoValue("askForRating");
            returnObject.DisplayGoals = ConvertCheckboxCheckedToYesNoValue("displayGoals");
            returnObject.DisplayDeliveredBy = ConvertCheckboxCheckedToYesNoValue("displayDeliveredBy");
            returnObject.DisplayNotes = ConvertCheckboxCheckedToYesNoValue("displayNotes");
            returnObject.DisplayFollowup = ConvertCheckboxCheckedToYesNoValue("displayFollowup");
            returnObject.OfferNew = ConvertCheckboxCheckedToYesNoValue("offerNew");            
            returnObject.AgentGoalCount = ConvertCheckboxCheckedToYesNoValue("countToAgentTouchGoals");
            returnObject.AgentRecognitionCount = ConvertCheckboxCheckedToYesNoValue("countToAgentRecognition");
            returnObject.CoachingCount = ConvertCheckboxCheckedToYesNoValue("countAsCoaching");
            returnObject.ExcludeFromUserDashboard = ConvertCheckboxCheckedToYesNoValue("excludeFromUserDashboard");

            returnObject.QASubformPage = $("#qaSubFormPage", element).val();
            let qaFormId = $("#qaFormId", element).val();
            if(qaFormId == "" || qaFormId < 0)
            {
               qaFormId = null;
            }
            returnObject.QAFormId = parseInt(qaFormId);

            returnObject.IsActive = $("#isActive", element).is(":checked");
            returnObject.EntDt = new Date().toLocaleDateString();
            returnObject.EntBy = legacyContainer.scope.TP1Username;
            returnObject.UpdDt = new Date().toLocaleDateString();
            returnObject.UpdBy = legacyContainer.scope.TP1Username;
            
            return returnObject;

         }
         /*Editor Form End*/
         /*Hide-Show-Toggle Options*/
         function HideAll() {
            HideEditorForm();
         }
         function WriteReasonLoadingMessage(messageToWrite) {
            $("#sidekickReasonLoadingHolder", element).empty();
            $("#sidekickReasonLoadingHolder", element).append(messageToWrite);
            ShowReasonLoadingMessage();
         }
         function HideReasonLoadingMessage() {
            $("#sidekickReasonLoadingHolder", element).hide();
         }
         function ShowReasonLoadingMessage() {
            $("#sidekickReasonLoadingHolder", element).show();
         }
         function HideEditorForm() {
            $("#sidekickReasonEditorFormPanel", element).hide();
         }
         function ShowEditorForm() {

            $("#sidekickReasonEditorFormPanel", element).show();
         }
         function HideBottomButtons() {
            $(".bottom-buttons", element).hide();
         }
         function ShowBottomButtons() {
            $(".bottom-buttons", element).show();
         }
         function HideAllReasonDescriptions(id) {
            $(".sidekick-reason-description", element).each(function () {
               if (this.id != "reasonDescription_" + id) {
                  $(this).hide();
               }
            });
         }
         function ToggleReasonDescription(currentId) {
            if (currentId == null) {
               currentId = -1;
            }
            let itemHolder = $("#reasonDescription_" + currentId, element);
            HideAllReasonDescriptions(currentId);
            if (itemHolder.is(":visible") == true) {
               itemHolder.fadeOut(2500);
            }
            else {
               itemHolder.fadeIn(1000);
            }
         }
         function HideReasonDescription(id) {
            $("#reasonDescription_" + id, element).hide();
         }
         function ShowReasonDescription(id) {
            $("#reasonDescription_" + id, element).show();
         }
         /*Hide-Show-Toggle Options END*/
         /*Utility Functions and Handling*/
         function CheckIfIsYesOption(value) {
            let isValidYes = false;
            if (value != null) {
               let validYesValues = ["YES", "Y", "ON", "TRUE", true];
               if (typeof value != "boolean") {
                  value = value.toUpperCase();
               }
               let validIndex = validYesValues.findIndex(i => i == value);
               isValidYes = (validIndex > -1);
            }
            return isValidYes;
         }
         function ConvertCheckboxCheckedToYesNoValue(checkboxIdToCheck)
         {
            var returnValue = "No";
            if ($("#" + checkboxIdToCheck, element).is(":checked"))
            {
               returnValue = "Yes";
            }
            return returnValue;
         }
         function IsReasonCodeAvailable(codeToCheck) {
            if (codeToCheck == null || codeToCheck == "") {
               codeToCheck = $("#reasonCode", element).val();
            }
            let isValidReason = false;
            let reasonIndex = currentReasonsList.findIndex(r => r.SidekickReasonCode == codeToCheck && r.ClientNumber == clientNumber);
            isValidReason = (reasonIndex < 0);
            MarkCodeAvailability(isValidReason);

            return isValidReason;
         }
         function MarkCodeAvailability(isAvailable) {
            $(".sidekick-reason-code-available", element).removeClass("green-check");
            $(".sidekick-reason-code-available", element).removeClass("red-check");
            $(".sidekick-reason-code-available", element).addClass("yellow-check");
            $(".sidekick-reason-code-available", element).empty();

            let reasonStatus = "Code not available";

            $(".sidekick-reason-code-available", element).removeClass("green-check");
            $(".sidekick-reason-code-available", element).removeClass("red-check");
            $(".sidekick-reason-code-available", element).removeClass("yellow-check");
            $(".sidekick-reason-code-available", element).empty();

            if (isAvailable) {
               $(".sidekick-reason-code-available", element).addClass("green-check");
               $(".sidekick-reason-code-available", element).addClass("fa-check-circle");
               $(".sidekick-reason-code-available", element).removeClass("fa-times-circle");
               $("#btnSave", element).removeAttr("disabled");
               reasonStatus = "Available";
            }
            else {
               //mark red
               $(".sidekick-reason-code-available", element).addClass("red-check");
               $(".sidekick-reason-code-available", element).addClass("fa-times-circle");
               $(".sidekick-reason-code-available", element).removeClass("fa-check-circle");
               $("#btnSave", element).attr("disabled", true);
            }
            $(".sidekick-reason-code-available", element).append("<b class=\"sidekick-reason-code-available-status\"> " + reasonStatus + "</b>");
         }

         /*Utility Functions and Handling END*/
         scope.load = function () {
            scope.Initialize();
            $(".btn-close", element).off("click").on("click", function () {
               ClearEditorForm(function () {
                  HideEditorForm();
                  ko.postbox.publish("sidekickReasonReload", false);
               });
            });
            $("#sidekickReasonManager_refresh", element).off("click").on("click", function () {
               WriteReasonLoadingMessage("Applying filters..");
               window.setTimeout(function () {
                  HandleSidekickReasonsListLoad(false, function(){
                     HideReasonLoadingMessage();
                  });
               }, 500);
            });
            $("#sidekickReasonManager_clearFilter", element).off("click").on("click", function () {
               WriteReasonLoadingMessage("Clearing filters and reloading list...");
               window.setTimeout(function () {
                  ClearFilters(function(){
                     HandleSidekickReasonsListLoad(false, function(){
                        HideReasonLoadingMessage();
                     });
                  });
               }, 500);
            });
            $("#btnAddNewSidekickReason", element).off("click").on("click", function () {
               ClearEditorForm(function () {
                  LoadEditorForm(null, function () {
                     ShowEditorForm();
                  });
               });
            });
            $("#btnSave", element).off("click").on("click", function () {
               ValidateEditorForm(function () {
                  SaveEditorForm(function () {
                     ClearEditorForm();
                     HideEditorForm();
                     ko.postbox.publish("sidekickReasonReload", true);
                  });
               });
            });
            $("#reasonCode", element).off("blur").on("blur", function () {
               IsReasonCodeAvailable();
            });

            HandleSidekickReasonsListLoad();
         };

         ko.postbox.subscribe("sidekickReasonReload", function (requireReload) {
            if (requireReload == true) {
               currentReasonsList.length = 0;
            }
            WriteReasonLoadingMessage("Reloading Data...");
            window.setTimeout(function () {
               HandleSidekickReasonsListLoad(requireReload);
            }, 500);
         });

         ko.postbox.subscribe("sidekickReasonLoad", function () {
            scope.load();
         });
      }
   };
}]);