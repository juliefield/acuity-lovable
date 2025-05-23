angularApp.directive("ngVirtualMentorTextManager", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/ACUITYADMIN1/view/VirtualMentorTextManager.htm?' + Date.now(),
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
         var currentSuggestionTexts = [];
         let availableClients = [];

         /* Buttons handling START */
         $("#suggestionText_Refresh", element).off("click").on("click", function () {
            WriteSuggestionTextLoadingMessage("Applying filters...", function () {
               ShowSuggestionTextLoadingMessage();
               window.setTimeout(function () {
                  LoadSuggestionText(function () {
                     HideSuggestionTextLoadingMessage();
                  });
               }, 500);
            });
         });
         $("#suggestionText_clearFilter", element).off("click").on("click", function () {
            ClearFilters(function () {
               LoadSuggestionText(function () {
                  HideSuggestionTextLoadingMessage();
               });
            });
         });
         $(".btn-close", element).off("click").on("click", function () {
            ClearEditorForm(function () {
               ClearPreviewText();
               HideEditorForm();
               ko.postbox.publish("virtualMentorTextManagerReload", false);
            });
         });
         $("#btnSaveVmText", element).off("click").on("click", function () {
            ValidateEditorForm(function () {
               SaveEditorForm(function () {
                  ClearEditorForm();
                  HideEditorForm();
                  ko.postbox.publish("virtualMentorTextManagerReload", true);
               });
            });
         });
         $("#btnAddSuggestionText", element).off("click").on("click", function () {
            ClearEditorForm(function () {
               ShowEditorForm();
            });
         });
         $("#suggestionText_BaseString", element).off("blur").on("blur", function () {
            let isCurrentVisible = $("#yourPreviewText", element).is(":visible");
            if (isCurrentVisible == true) {
               LoadPreviewText(function () {
                  ShowPreviewText();
               });
            }
         });
         $("#btnPreviewText", element).off("click").on("click", function () {
            let isCurrentVisible = $("#yourPreviewText", element).is(":visible");
            if (isCurrentVisible == true) {
               ClearPreviewText(function () {
                  HidePreviewText();
               });
            }
            else {
               LoadPreviewText(function () {
                  ShowPreviewText();
               });
            }
         });
         $("#btnShowTokens", element).off("click").on("click", function () {
            let isCurrentVisible = $("#tokenListHolder", element).is(":visible");
            if (isCurrentVisible == true) {
               HideTokenList();
            }
            else {
               ShowTokenList();
            }
         });
         $("#lblShowPriorityLevels", element).off("click").on("click", function(){
            TogglePriorityLevels();
         });
         $(".btn-close-popup", element).off("click").on("click", function(){
            HidePriorityLevels();
         });
         $("#lblPriorityLevel", element).off("click").on("click", function(){
            TogglePriorityLevels();
         });
         /* Buttons handling END */

         scope.Initialize = function () {
            HideAll();
            LoadPossibleClients();
            LoadListOptions("ALL");
         };

         function LoadPossibleClients() {
            if (availableClients != null && availableClients.length == 0) {
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
                        availableClients.length = 0;
                        availableClients = returnData;
                     }
                     return returnData;
                  }
               });
            }
         }

         function LoadListOptions(loadType) {
            if (loadType == null || loadType == "") {
               loadType = "all";
            }
            let loadAll = (loadType.toLowerCase() == "all") || false;
            loadType = loadType.toLowerCase();

            if (loadAll == true || loadType == "clients" || loadType == "client") {
               $("#suggestionText_Client", element).empty();
               $("#suggestionText_Client", element).append($("<option />", { value: 0, text: "All Clients" }));
               $("#suggestionText_ClientFilter", element).empty();
               $("#suggestionText_ClientFilter", element).append($("<option />", { value: 0, text: "All Clients" }));
               let clientList = availableClients;
               // if(legacyContainer.scope.TP1Role != "Admin")
               // {
               appLib.getConfigParameterByName("CLIENT_ID", function (parameter) {
                  if (parameter != null) {
                     let clientId = parseInt(parameter.ParamValue);
                     clientList = availableClients.filter(c => c.ClientNumber == clientId || c.ClientNumber == 0);
                  }
               });
               //}

               for (let cIndex = 0; cIndex < clientList.length; cIndex++) {
                  let clientItem = clientList[cIndex];
                  $("#suggestionText_Client", element).append($("<option />", { value: clientItem.ClientNumber, text: clientItem.ClientName }));
                  $("#suggestionText_ClientFilter", element).append($("<option />", { value: clientItem.ClientNumber, text: clientItem.ClientName }));
               }
            }

            if (loadAll == true || loadType == "languages" || loadType == "language") {
               $("#suggestionText_PriorityLevel", element).empty();
               $("#suggestionText_PriorityLevel", element).append($("<option />"), { text: "Select Priority Level", value: "" });
               $("#suggestionText_PriorityLevelFilter", element).empty();
               $("#suggestionText_PriorityLevelFilter", element).append($("<option />"), { text: "Select Priority Level", value: "" });
               for (let lIndex = 100; lIndex >= 0; lIndex--) {
                  $("#suggestionText_PriorityLevel", element).append($("<option />", { value: lIndex, text: lIndex }));
                  $("#suggestionText_PriorityLevelFilter", element).append($("<option />", { value: lIndex, text: lIndex }));
               }
            }
         }

         function LoadSuggestionText(callback) {
            if (currentSuggestionTexts != null && currentSuggestionTexts.length > 0) {
               RenderCurrentSuggestionTextList(null, callback);
            }
            else {
               GetCurrentSuggestionTexts(null, function (itemsToRender) {
                  RenderCurrentSuggestionTextList(itemsToRender, callback);
               });
            }
         }
         function GetCurrentSuggestionTexts(forceReload, callback) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (forceReload != true && currentSuggestionTexts.length > 0) {
               if (callback != null) {
                  callback(currentSuggestionTexts);
               }
            }
            else {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "selfserve",
                     cmd: "getAllSuggestionsForClient"
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let suggestionList = JSON.parse(data.clientSuggestionTextList);
                     currentSuggestionTexts.length = 0;
                     currentSuggestionTexts = suggestionList;
                     if (callback != null) {
                        callback(suggestionList);
                     }
                  }
               });
            }
         }

         function RenderCurrentSuggestionTextList(listToRender, callback) {
            let listToFilter = listToRender;
            if (listToFilter == null) {
               listToFilter = currentSuggestionTexts;
            }
            let filteredList = ApplyFilters(listToFilter);
            listToRender = SortSuggestionList(filteredList);

            let suggestionTextListingHolder = $("<div class=\"suggestion-text-listing-holder\" />");
            if (listToRender != null && listToRender.length > 0) {

               // let suggestionTextHeaderRowHolder = $("<div class=\"suggestion-text-display-list-item-holder header-row\" />");

               // let suggestionIdHeaderHolder = $("<div class=\"suggestion-text-header-holder suggestion-text-id\" />");
               // suggestionIdHeaderHolder.append("Id");
               // // let suggestionClientHeaderHolder = $("<div class=\"suggestion-text-header-holder suggestion-text-client\" />");
               // // suggestionClientHeaderHolder.append("Client");
               // let suggestionPriorityLevelHeaderHolder = $("<div class=\"suggestion-text-header-holder suggestion-text-priority-level\" />");
               // suggestionPriorityLevelHeaderHolder.append("Priority Level");
               // let priorityLevelButton = $("<label class=\"priority-level-show-button\"><i class=\"fas fa-question-circle\" aria-hidden=\"true\"></i></label>");
               // priorityLevelButton.on("click", function(){
               //    ShowPriorityLevels();
               // });
               // suggestionPriorityLevelHeaderHolder.append("&nbsp;&nbsp;");
               // suggestionPriorityLevelHeaderHolder.append(priorityLevelButton);
               // let suggestionIsActiveHeaderHolder = $("<div class=\"suggestion-text-header-holder suggestion-text-is-active\" />");
               // suggestionIsActiveHeaderHolder.append("Active?");
               // let suggestionTextHeaderHolder = $("<div class=\"suggestion-text-header-holder suggestion-text-base-string \" />");
               // suggestionTextHeaderHolder.append("Base Text");

               // let suggestionTextActionHeaderHolder = $("<div class=\"suggestion-text-header-holder suggestion-text-button-holder\" />");
               // suggestionTextActionHeaderHolder.append("Actions");

               // suggestionTextHeaderRowHolder.append(suggestionIdHeaderHolder);
               // //suggestionTextHeaderRowHolder.append(suggestionClientHeaderHolder);
               // suggestionTextHeaderRowHolder.append(suggestionPriorityLevelHeaderHolder);
               // suggestionTextHeaderRowHolder.append(suggestionTextHeaderHolder);
               // suggestionTextHeaderRowHolder.append(suggestionIsActiveHeaderHolder);
               // suggestionTextHeaderRowHolder.append(suggestionTextActionHeaderHolder);
               
               // suggestionTextListingHolder.append(suggestionTextHeaderRowHolder);


               for (let rtIndex = 0; rtIndex < listToRender.length; rtIndex++) {
                  let suggestionItem = listToRender[rtIndex];

                  let suggestionTextRowHolder = $("<div class=\"suggestion-text-display-list-item-holder\" />");

                  let suggestionIdHolder = $("<div class=\"suggestion-text-item-holder suggestion-text-id\" />");
                  suggestionIdHolder.append(suggestionItem.Id);

                  let suggestionClientHolder = $("<div class=\"suggestion-text-item-holder suggestion-text-client\" />");
                  let clientName = "All Clients";
                  if (suggestionItem.Client != 0) {
                     clientName = suggestionItem.Client;
                     let clientObject = availableClients.find(c => c.ClientNumber == suggestionItem.Client);
                     if (clientObject != null) {
                        clientName = clientObject.ClientName;
                     }

                  }
                  suggestionClientHolder.append(clientName);

                  let suggestionPriorityLevelHolder = $("<div class=\"suggestion-text-item-holder suggestion-text-priority-level\" />");
                  let priorityLevel = suggestionItem.PriorityLevel;
                  suggestionPriorityLevelHolder.append(priorityLevel);

                  let suggestionTextHolder = $("<div class=\"suggestion-text-item-holder suggestion-text-base-string\" />");
                  let baseString = ParseHtmlIn(suggestionItem.SidekickCoachingSuggestionTextBaseString);
                  
                  baseString = baseString.substr(0, 256);
                  suggestionTextHolder.append(baseString);

                  let suggestionIsActiveHolder = $("<div class=\"suggestion-text-item-holder suggestion-text-is-active\" />");
                  let isActiveText = "YES";
                  if(suggestionItem.IsActive == false)
                  {
                     isActiveText = "NO";
                  }

                  suggestionIsActiveHolder.append(isActiveText);

                  let suggestionButtonHolder = $("<div class=\"suggestion-text-button-holder button-holder\" />");
                  //let suggestionIdString = suggestionItem.suggestionKey + "|" + suggestionItem.suggestionLanguage + "|" + suggestionItem.Client
                  let suggestionIdString = suggestionItem.Id;
                  let editButton = $("<button class=\"button btn\" id=\"editsuggestionText|" + suggestionIdString + "\"><i class=\"fa fa-edit\"></i></button>");
                  // let deleteButton = $("<button class=\"button btn btn-delete\" id=\"deletesuggestionText|" + suggestionIdString + "\"><i class=\"fa fa-trash\"></i></button>");
                  editButton.on("click", function () {
                     let id = this.id;
                     let suggestionId = id.split("|")[1];
                     LoadEditorForm(suggestionId, function () {
                        ShowEditorForm();
                     });
                  });
                  //TODO: Determine which roles can edit the global values.
                  // if ((suggestionItem.Client == 0 && legacyContainer.scope.TP1Role == "Admin") || suggestionItem.Client > 0) {
                  if (legacyContainer.scope.TP1Role == "Admin"){
                     suggestionButtonHolder.append(editButton);
                  }

                  suggestionTextRowHolder.append(suggestionIdHolder);
                  suggestionTextRowHolder.append(suggestionPriorityLevelHolder);
                  suggestionTextRowHolder.append(suggestionClientHolder);
                  suggestionTextRowHolder.append(suggestionTextHolder);
                  suggestionTextRowHolder.append(suggestionIsActiveHolder);
                  suggestionTextRowHolder.append(suggestionButtonHolder);

                  suggestionTextListingHolder.append(suggestionTextRowHolder);
               }
            }
            else {
               suggestionTextListingHolder.append("No Suggestion Texts found.");
            }

            $("#suggestionTextList", element).empty();
            $("#suggestionTextList", element).append(suggestionTextListingHolder);

            if (callback != null) {
               callback();
            }
         }
         function LoadEditorForm(keyToLoad, callback) {
            HidePreviewText();
            let suggestionItem = currentSuggestionTexts.find(i => i.Id == keyToLoad);
            if (suggestionItem != null) {
               $("#suggestionText_SidekickCoachingSuggestionTextId", element).val(suggestionItem.SidekickCoachingSuggestionTextId);
               $("#suggestionText_SidekickCoachingSuggestionTextId", element).attr("readonly", true);
               $("#suggestionText_PriorityLevel", element).val(suggestionItem.PriorityLevel);
               $("#suggestionText_Client", element).val(suggestionItem.Client);
               let baseString = ParseHtmlIn(suggestionItem.SidekickCoachingSuggestionTextBaseString);
               $("#suggestionText_BaseString", element).val(baseString);
               $("#suggestionText_IsActive", element).prop("checked", suggestionItem.IsActive);
            }
            if (callback != null) {
               callback();
            }
         }
         function SaveVirtualMentorTextObject(objectToSave, callback) {
            WriteSuggestionTextLoadingMessage("Saving suggestion text...");
            window.setTimeout(function () {
               a$.ajax({
                  type: "GET",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "selfserve",
                     cmd: "saveSuggestionText",
                     suggestionText: JSON.stringify(objectToSave)
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
                        currentSuggestionTexts.length = 0;
                     }
                     if (callback != null) {
                        callback();
                     }
                  }
               });
            }, 500);
         }
         function ValidateEditorForm(callback) {
            var formValid = true;
            var errorMessages = [];
            let idValue = $("#suggestionText_SidekickCoachingSuggestionTextId", element).val();
            let baseTextValue = $("#suggestionText_BaseString", element).val();            
            //let clientValue = $("#suggestionText_Client", element).val();
            let priorityLevel = $("#suggestionText_PriorityLevel", element).val();

            if (idValue == null || idValue == "") {
               errorMessages.push({ message: "Id Required", fieldclass: "", fieldid: "suggestionText_SidekickCoachingSuggestionTextId" });
               formValid = false;
            }
            if (priorityLevel == null || priorityLevel == "") {
               errorMessages.push({ message: "Priority Level Required", fieldclass: "", fieldid: "suggestionText_PriorityLevel" });
               formValid = false;
            }
            else if (priorityLevel < 0 || priorityLevel > 100) {
               errorMessages.push({ message: "Priority Level Must be between 0 and 100", fieldclass: "", fieldid: "suggestionText_PriorityLevel" });
               formValid = false;
            }
            if (baseTextValue == null || baseTextValue == "") {
               errorMessages.push({ message: "Text Required", fieldclass: "", fieldid: "suggestionText_BaseString" });
               formValid = false;
            }
            // if (clientValue == 0) {
            //    if (confirm("You are editing a global value for this key and it will affect all instances of Acuity.  Are you sure you wish to proceed?")) {
            //       formValid = formValid;
            //    }
            //    else {
            //       formValid = false;
            //    }
            // }
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
            let resourceToSave = CollectFormDataForVirtualMentorText();
            SaveVirtualMentorTextObject(resourceToSave, function () {
               LoadSuggestionText();
               HideEditorForm();
            });
            if (callback != null) {
               callback();
            }
         }
         function ClearEditorForm(callback) {
            $("#suggestionText_SidekickCoachingSuggestionTextId", element).val(-1);
            $("#suggestionText_SidekickCoachingSuggestionTextId", element).removeAttr("readonly");
            $("#suggestionText_PriorityLevel", element).val("");
            $("#suggestionText_Client", element).val(0);
            $("#suggestionText_BaseString", element).val("");

            $(".error-information-holder", element).empty();
            $(".error-information-holder", element).hide();
            $(".errorField", element).each(function () {
               $(this).removeClass("errorField");
            });

            if (callback != null) {
               callback();
            }
         }
         function CollectFormDataForVirtualMentorText() {
            let returnObject = new Object();

            returnObject.SidekickCoachingSuggestionTextId = $("#suggestionText_SidekickCoachingSuggestionTextId", element).val();            
            //Currently everything is global in suggestion texts and there is no client specific options.
            //returnObject.Client = 0;
            returnObject.Client = $("#suggestionText_Client", element).val();
            returnObject.CoachingLevelId = GetCoachingLevelFromPriorityLevel($("#suggestionText_PriorityLevel", element).val());
            returnObject.SidekickCoachingSuggestionTextBaseString = ParseHtmlOut($("#suggestionText_BaseString", element).val());
            returnObject.IsActive = $("#suggestionText_IsActive", element).is(":checked");

            return returnObject;
         }
         function ParseHtmlOut(inputString)
         {
            let fixedString = inputString;
            fixedString = fixedString.replaceAll("<", "&lt;");
            fixedString = fixedString.replaceAll(">", "&gt;");
            return fixedString;
         }
         function ParseHtmlIn(inputString)
         {
            let fixedString = inputString;
            fixedString = fixedString.replaceAll("&lt;", "<");
            fixedString = fixedString.replaceAll("&gt;", ">");
            return fixedString;
         }
         function ClearFilters(callback) {
            $("#suggestionText_PriorityLevelFilter", element).val("");
            $("#suggestionText_ClientFilter", element).val("");
            $("#suggestionText_TextFilter", element).val("");
            if (callback != null) {
               callback();
            }
         }
         function GetCoachingLevelFromPriorityLevel(priorityLevelValue) {
            let returnValue = 100;
            if (priorityLevelValue == null || priorityLevelValue == "") {
               priorityLevelValue = $("#suggestionText_PriorityLevel", element).val() || 0;
            }

            returnValue = (100 - parseInt(priorityLevelValue));

            return returnValue;

         }
         /* Preview Handling START */
         function LoadPreviewText(callback) {
            let previewScoringInfo = GetMrBScoringInfoForPreview();
            let textToPreview = $("#suggestionText_BaseString", element).val() || "";
            textToPreview = ReplaceTokensInTextForPreview(textToPreview, previewScoringInfo);

            $("#previewTextLabel", element).empty();
            $("#previewTextLabel", element).append(textToPreview);
            if (callback != null) {
               callback();
            }
         }
         function GetMrBScoringInfoForPreview() {
            let returnObject = new Object();
            returnObject.SuggestedAction = "COACH";
            returnObject.UserFullName = "Mr. Business";
            returnObject.UserId = "mrb01";
            returnObject.KpiName = "OINKERS";
            returnObject.KpiScore = 9.532;
            return returnObject;
         }
         function ReplaceTokensInTextForPreview(text, scoringObject) {
            let returnText = text;

            returnText = returnText.replaceAll(new RegExp("{suggestedaction}", "gi"), scoringObject.SuggestedAction);
            returnText = returnText.replaceAll(new RegExp("{userfullname}", "gi"), scoringObject.UserFullName);
            returnText = returnText.replaceAll(new RegExp("{userId}", "gi"), scoringObject.UserId);
            //returnText = returnText.replace("{userid}", scoringObject.UserId);            
            returnText = returnText.replaceAll(new RegExp("{kpiname}", "gi"), scoringObject.KpiName);
            returnText = returnText.replaceAll(new RegExp("{kpiscore}", "gi"), scoringObject.KpiScore);

            return returnText;
         }
         function ClearPreviewText(callback) {
            $("#previewTextLabel", element).empty();
            if (callback != null) {
               callback();
            }
         }
         /* Preview Handling END */
         /* Token List handling START */

         /* Token List handling END */
         function ApplyFilters(listToFilter) {

            let suggestionTextFilter = $("#suggestionText_TextFilter", element).val() || "";
            let suggestionClientFilter = $("#suggestionText_ClientFilter", element).val() || "";
            let priorityLevelFilter = $("#suggestionText_PriorityLevelFilter", element).val() || "";
            
            let filteredList = listToFilter;

            if (priorityLevelFilter != "") {
               filteredList = filteredList.filter(r => r.PriorityLevel == parseInt(priorityLevelFilter));
            }
            if (suggestionClientFilter != "" && parseInt(suggestionClientFilter) != 0) {
               filteredList = filteredList.filter(r => r.Client == parseInt(suggestionClientFilter));
            }
            if (suggestionTextFilter != "") {
               filteredList = filteredList.filter(r => r.SidekickCoachingSuggestionTextBaseString?.toLowerCase().includes(suggestionTextFilter.toLowerCase()));
            }

            return filteredList;
         }
         function SortSuggestionList(listToSort, fieldToSort) {
            let sortedList = listToSort;
            switch (fieldToSort?.toLowerCase()) {
               case "id":
                  sortedList = sortedList.sort((a, b) => a.Id > b.Id ? -1 : 0);
                  break;
               default:
                  sortedList = sortedList.sort((a, b) => a.PriorityLevel < b.PriorityLevel ? 1 : -1);
                  break;
            }

            return sortedList;
         }
         function WriteSuggestionTextLoadingMessage(messageToLoad, callback) {
            $("#suggestionTextLoadingHolder", element).empty();
            if (messageToLoad != null && messageToLoad != "") {
               $("#suggestionTextLoadingHolder", element).append(messageToLoad);
            }
            if (callback != null) {
               callback();
            }
         }
         function HideAll() {
            HidePriorityLevels();
            HideEditorForm();
            HidePreviewText();
            HideTokenList();
         }
         function HideSuggestionTextLoadingMessage() {
            $("#suggestionTextLoadingHolder", element).hide();
         }
         function ShowSuggestionTextLoadingMessage() {
            $("#suggestionTextLoadingHolder", element).show();
         }
         function ShowEditorForm() {
            $("#vmTextFormPanel", element).show();
         }
         function HideEditorForm() {
            $("#vmTextFormPanel", element).hide();
         }
         function ShowPreviewText() {
            $("#yourPreviewText", element).show();
         }
         function HidePreviewText() {
            $("#yourPreviewText", element).hide();
         }
         function HideTokenList() {
            $("#tokenListHolder", element).hide();
         }
         function ShowTokenList() {
            $("#tokenListHolder", element).show();
         }
         function TogglePriorityLevels()
         {
            let isVisible = $("#vmPriorityLevels", element).is(":visible") || false;
            if(isVisible == false)
            {
               ShowPriorityLevels();
            }
            else
            {
               HidePriorityLevels();
            }
            return;
         }
         function HidePriorityLevels()
         {
            $("#vmPriorityLevels", element).hide();
         }
         function ShowPriorityLevels()
         {
            $("#vmPriorityLevels", element).show();
         }

         scope.load = function () {
            scope.Initialize();
            HideAll();
            LoadSuggestionText();
            HideSuggestionTextLoadingMessage();
         };

         ko.postbox.subscribe("virtualMentorTextManagerReload", function (requireReload) {
            if (requireReload == true) {
               currentSuggestionTexts.length = 0;
            }
            WriteSuggestionTextLoadingMessage(null, function () {
               ShowSuggestionTextLoadingMessage();
               window.setTimeout(function () {
                  LoadSuggestionText(function () {
                     HideSuggestionTextLoadingMessage();
                  });
               }, 500);
            });
         });
         ko.postbox.subscribe("virtualMentorTextManagerLoad", function () {
            WriteSuggestionTextLoadingMessage(null, function () {
               ShowSuggestionTextLoadingMessage();
               scope.load();
            });
         });
      }
   };
}]);