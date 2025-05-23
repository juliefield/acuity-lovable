angularApp.directive("ngManagerTipsTricks", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/ACUITYADMIN1/view/managerTipsTricks.htm?' + Date.now(),
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
         var currentTipsTricksList = [];
         let availableClients = [];
         let tipsTricksTypeList = [];
         let currentTipsTricksStats = [];
         var dataLoaded = false;
         let possibleStatusList = [
            {code: "A", text: "Active"},
            {code: "I", text: "Inactive"},
         ]

         /* Button Handling Start */
         $("#btnSaveTipsTricks", element).off("click").on("click", function () {
            ValidateEditorForm(function () {
               SaveEditorForm(function () {
                  ClearEditorForm();
                  HideEditorForm();
                  ko.postbox.publish("tipsTricksManagerReload", true);
               });
            });
         });
         $("#btnAddTipTrick", element).off("click").on("click", function () {            
            ClearEditorForm(function () {
               ShowEditorForm();
            });
         });
         $(".btn-close", element).off("click").on("click", function () {
            ClearEditorForm(function () {
               HideEditorForm();
               ko.postbox.publish("tipsTricksManagerReload", false);
            });
         });
         $("#tipsTricks_TypeFilter", element).off("change").on("change", function(){
            RenderCurrentTipsAndTricks();
         });
         $("#tipsTricks_ClientFilter", element).off("change").on("change", function(){
            RenderCurrentTipsAndTricks();
         });
         $("#tipsTricks_Refresh", element).off("click").on("click", function(){
            ko.postbox.publish("tipsTricksManagerReload", true);
         });
         $("#tipsTricks_clearFilter", element).off("click").on("click", function(){
            ClearFilters(function () {
               LoadCurrentTipsAndTricks(function () {
                  HideResourceLoadingMessage();
               });
            });
         });
         /* Button Handling End */
         scope.Initialize = function () {
            HideAll();
            LoadPossibleClients();
            LoadTipsTricksTypes();
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
         function LoadTipsTricksTypes() {
            if (tipsTricksTypeList != null && tipsTricksTypeList.length == 0) {
               a$.ajax({
                  type: "GET",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "selfserve",
                     cmd: "getAllTipsTypes"
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (jsonData) {
                     let returnData = null;
                     if (jsonData.tipsTricksTypeList != null) {
                        returnData = JSON.parse(jsonData.tipsTricksTypeList);
                        tipsTricksTypeList.length = 0;
                        tipsTricksTypeList = returnData;
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
               $("#tipsTricksEditor_Client", element).empty();
               $("#tipsTricksEditor_Client", element).append($("<option />", { value: 0, text: "All Clients" }));
               $("#tipsTricks_ClientFilter", element).empty();
               $("#tipsTricks_ClientFilter", element).append($("<option />", { value: 0, text: "All Clients" }));
               let clientList = availableClients;               
                  appLib.getConfigParameterByName("CLIENT_ID", function(parameter){
                     if(parameter != null)
                     {
                        let clientId = parseInt(parameter.ParamValue);
                        clientList = availableClients.filter(c  => c.ClientNumber == clientId || c.ClientNumber == 0);
                     }
                  });

               for (let cIndex = 0; cIndex < clientList.length; cIndex++) {
                  let clientItem = clientList[cIndex];
                  $("#tipsTricksEditor_Client", element).append($("<option />", { value: clientItem.ClientNumber, text: clientItem.ClientName }));
                  $("#tipsTricks_ClientFilter", element).append($("<option />", { value: clientItem.ClientNumber, text: clientItem.ClientName }));
               }
            }
            if (loadAll == true || loadType == "tipstrickstype" || loadType == "tipstrickstype") {
               $("#tipsTricksEditor_tipsTricksTypeId", element).empty();
               $("#tipsTricksEditor_tipsTricksTypeId", element).append($("<option />"), { text: "Select Type", value: "" });
               $("#tipsTricks_TypeFilter", element).empty();
               $("#tipsTricks_TypeFilter", element).append($("<option />"), { text: "Select Type", value: "" });
               for (let tIndex = 0; tIndex < tipsTricksTypeList.length; tIndex++) {
                  let typeItem = tipsTricksTypeList[tIndex];
                  $("#tipsTricksEditor_tipsTricksTypeId", element).append($("<option />", { value: typeItem.TipsTricksTypeId, text: typeItem.TipsTricksTypeName }));
                  $("#tipsTricks_TypeFilter", element).append($("<option />", { value: typeItem.TipsTricksTypeId, text: typeItem.TipsTricksTypeName }));
               }
            }
         }
         function LoadCurrentStats(callback)
         {
            if(currentTipsTricksStats != null && currentTipsTricksStats.length > 0)
            {
               RenderCurrentTipsStats(null, callback);
            }
            else
            {
               GetCurrentTipsStats(null, function(itemsToRender){
                  RenderCurrentTipsStats(itemsToRender, callback);
               });
            }
         }
         function GetCurrentTipsStats(forceReload, callback)
         {
            if(forceReload == null)
            {
               forceReload = false;
            }
            if(forceReload != true && currentTipsTricksStats.length > 0)
            {
               if(callback != null)
               {
                  callback(currentTipsTricksStats);
               }   
            }
            else
            {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "selfserve",
                     cmd: "getTipsTricksStats"
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let statsList = JSON.parse(data.tipsTricksStats);
                     currentTipsTricksStats.length = 0;
                     currentTipsTricksStats = statsList;
                     if (callback != null) {
                        callback(currentTipsTricksStats);
                     }
                  }
               });
            }
         }
         function RenderCurrentTipsStats(listToRender, callback)
         {
            if(listToRender == null)
            {
               listToRender = currentTipsTricksStats;
            }
            $("#tipsStatsList", element).empty();
            let statsHolder = $("<div class=\"\" />");
            if(listToRender != null && listToRender.length > 0)
            {

               for(let sIndex = 0; sIndex < listToRender.length; sIndex++)
               {
                  let statItem = listToRender[sIndex];
                  let statRowHolder = $("<div class=\"tips-stat-row-holder\" />");
                  let statClientNameHolder = $("<div class=\"tips-stat-item-holder client-name\" />");
                  let clientName = "All Clients";
                  if(statItem.Client != 0)
                  {
                     let clientObject = availableClients.find(i => i.ClientNumber == statItem.Client);
                     if(clientObject != null)
                     {
                        clientName = clientObject.ClientName;
                     }   
                  }
                  statClientNameHolder.append(clientName);

                  let statTipTypeNameHolder = $("<div class=\"tips-stat-item-holder tip-type-name\" />");
                  statTipTypeNameHolder.append(statItem.TipsTricksTypeName);

                  let statTipStatusHolder = $("<div class=\"tips-stat-item-holder tip-status-name\" />");
                  let statusName = GetStatusName(statItem.Status);
                  statTipStatusHolder.append(statusName);

                  let statRecordCountHolder = $("<div class=\"tips-stat-item-holder tip-count-name\" />");
                  statRecordCountHolder.append(statItem.RecordCount);

                  statRowHolder.append(statClientNameHolder);
                  statRowHolder.append(statTipStatusHolder);
                  statRowHolder.append(statTipTypeNameHolder);
                  statRowHolder.append(statRecordCountHolder);


                  statsHolder.append(statRowHolder);
               }   
            }
            else
            {
               statsHolder.append("No stat info found.");
            }

            $("#tipsStatsList", element).append(statsHolder);
            if(callback != null)
            {
               callback();
            }
         }
         function LoadCurrentTipsAndTricks(callback) {
            LoadCurrentStats();
            if (currentTipsTricksList != null && currentTipsTricksList.length > 0) {
               RenderCurrentTipsAndTricks(null, callback);
            }
            else {
               GetCurrentTipsAndTricks(null, function (itemsToRender) {
                  RenderCurrentTipsAndTricks(itemsToRender, callback);
               });
            }
         }         
         function GetCurrentTipsAndTricks(forceReload, callback) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (forceReload != true && currentTipsTricksList.length > 0) {
               if (callback != null) {
                  callback(currentTipsTricksList);
               }
            }
            else {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "selfserve",
                     cmd: "getAvailableTipsAndTricks"
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let tipsAndTricksList = JSON.parse(data.currentTipsAndTricks);
                     currentTipsTricksList.length = 0;
                     currentTipsTricksList = tipsAndTricksList;
                     if (callback != null) {
                        callback(tipsAndTricksList);
                     }
                  }
               });
            }
         }
         function RenderCurrentTipsAndTricks(listToRender, callback) {
            let listToFilter = listToRender;
            $("#tipsTricksTextList", element).empty();
            if (listToFilter == null) {
               listToFilter = currentTipsTricksList;
            }
            let filteredList = ApplyFilters(listToFilter);
            listToRender = SortTipsTricksList(filteredList);

            let tipsAndTricksListingHolder = $("<div class=\"tips-tricks-text-listing-holder\" />");

            if (listToRender != null && listToRender.length > 0) {

               let tipsAndTricksHeaderRowHolder = $("<div class=\"tips-tricks-text-display-list-item-holder header-row\" />");

               let tipsAndTricksIdHeaderHolder = $("<div class=\"tips-tricks-text-item-holder header-item tips-tricks-id\" />");
               tipsAndTricksIdHeaderHolder.append("#");

               let tipsAndTricksClientHeaderHolder = $("<div class=\"tips-tricks-text-item-holder header-item client-name\" />");
               tipsAndTricksClientHeaderHolder.append("Client");

               let tipsAndTricksTypeHeaderHolder = $("<div class=\"tips-tricks-text-item-holder header-item tip-type-name\" />");
               tipsAndTricksTypeHeaderHolder.append("Type");

               let tipsAndTricksStatusHeaderHolder = $("<div class=\"tips-tricks-text-item-holder header-item status-name\" />");
               tipsAndTricksStatusHeaderHolder.append("Status");

               let tipsAndTricksTextHeaderHolder = $("<div class=\"tips-tricks-text-item-holder header-item status-text\" />");
               tipsAndTricksTextHeaderHolder.append("Text");

               let tipsAndTricksActionHolder = $("<div class=\"tips-tricks-text-button-holder header-item button-holder tips-tricks-buttons\" />");
               tipsAndTricksActionHolder.append("Actions");

               tipsAndTricksHeaderRowHolder.append(tipsAndTricksIdHeaderHolder);
               tipsAndTricksHeaderRowHolder.append(tipsAndTricksClientHeaderHolder);
               tipsAndTricksHeaderRowHolder.append(tipsAndTricksTypeHeaderHolder);
               tipsAndTricksHeaderRowHolder.append(tipsAndTricksStatusHeaderHolder);
               tipsAndTricksHeaderRowHolder.append(tipsAndTricksTextHeaderHolder);
               tipsAndTricksHeaderRowHolder.append(tipsAndTricksActionHolder);

               tipsAndTricksListingHolder.append(tipsAndTricksHeaderRowHolder);

               let tipsAndTricksBodyHolder = $("<div class=\"tips-tricks-listing-body-holder\" />");

               for (let ttIndex = 0; ttIndex < listToRender.length; ttIndex++) {
                  let dataItem = listToRender[ttIndex];

                  let tipsAndTricksRowHolder = $("<div class=\"tips-tricks-text-display-list-item-holder\" />");

                  let tipsAndTricksIdHolder = $("<div class=\"tips-tricks-text-item-holder tips-tricks-id\" />");
                  tipsAndTricksIdHolder.append(dataItem.ManagerTipsTricksId);

                  let tipsAndTricksClientHolder = $("<div class=\"tips-tricks-text-item-holder client-name\" />");
                  let clientName = "All Clients";
                  if(dataItem.Client != 0)
                  {
                     clientName = dataItem.Client;
                     let clientObject =  availableClients.find(i => i.ClientNumber == dataItem.Client);
                     if(clientObject != null)
                     {
                        clientName = clientObject.ClientName;
                     }
                  }
                  tipsAndTricksClientHolder.append(clientName);

                  let tipsAndTricksTypeHolder = $("<div class=\"tips-tricks-text-item-holder tip-type-name\" />");
                  let tipsTricksTypeName = dataItem.TipsTricksTypeId;
                  let typeObject = tipsTricksTypeList.find(i => i.TipsTricksTypeId == dataItem.TipsTricksTypeId);
                  if(typeObject != null)
                  {
                     tipsTricksTypeName = typeObject.TipsTricksTypeName;
                  }
                  tipsAndTricksTypeHolder.append(tipsTricksTypeName);

                  let tipsAndTricksStatusHolder = $("<div class=\"tips-tricks-text-item-holder status-name\" />");
                  let statusName = GetStatusName(dataItem.Status);                  
                  tipsAndTricksStatusHolder.append(statusName);

                  let tipsAndTricksTextHolder = $("<div class=\"tips-tricks-text-item-holder tips-tricks-text\" />");
                  tipsAndTricksTextHolder.append(dataItem.ManagerTipsTricksText);

                  let tipsAndTricksButtonHolder = $("<div class=\"tips-tricks-text-button-holder tips-tricks-buttons\" />");

                  let editButton = $("<button class=\"button btn\" id=\"editTipsText_" + dataItem.Id + "\"><i class=\"fa fa-edit\"></i></button>");
                  let deleteButton = $("<button class=\"button btn btn-delete\" id=\"deleteTipsText_" + dataItem.Id + "\"><i class=\"fa fa-trash\"></i></button>");
                  editButton.on("click", function () {
                     let id = this.id;
                     let tipsTricksId = id.split("_")[1];
                     LoadEditorForm(tipsTricksId, function () {
                        ShowEditorForm();
                     });
                  });
                  deleteButton.on("click", function () {
                     let id = this.id;
                     let tipsTricksId = id.split("_")[1];
                     DeleteTipsAndTricks(tipsTricksId, function () {
                        ko.postbox.publish("tipsTricksManagerReload", true);
                        HideResourceLoadingMessage();
                     });
                  });

                  tipsAndTricksButtonHolder.append(editButton);
                  tipsAndTricksButtonHolder.append("&nbsp;");
                  tipsAndTricksButtonHolder.append(deleteButton);

                  tipsAndTricksRowHolder.append(tipsAndTricksIdHolder);
                  tipsAndTricksRowHolder.append(tipsAndTricksClientHolder);
                  tipsAndTricksRowHolder.append(tipsAndTricksTypeHolder);
                  tipsAndTricksRowHolder.append(tipsAndTricksStatusHolder);
                  tipsAndTricksRowHolder.append(tipsAndTricksTextHolder);
                  tipsAndTricksRowHolder.append(tipsAndTricksButtonHolder);

                  tipsAndTricksBodyHolder.append(tipsAndTricksRowHolder);
               }
               tipsAndTricksListingHolder.append(tipsAndTricksBodyHolder);
            }
            else {
               tipsAndTricksListingHolder.append("No items found to match your filter criteria.");
            }
            $("#tipsTricksTextList", element).append(tipsAndTricksListingHolder);

            if (callback != null) {
               callback();
            }
         }         
         function ApplyFilters(listToFilter) {
            if(listToFilter == null)
            {
               listToFilter = currentTipsTricksList;
            }
            let filteredList = listToFilter;
            let typeFilter = $("#tipsTricks_TypeFilter", element).val();
            let clientFilter = $("#tipsTricks_ClientFilter", element).val();
            if(typeFilter != null && typeFilter != "")
            {
               filteredList = filteredList.filter(i => i.TipsTricksTypeId == typeFilter);
            }
            if(clientFilter != null && clientFilter != "" && clientFilter != 0)
            {
               filteredList = filteredList.filter(i => i.Client == clientFilter);
            }

            WriteRecordsFound(filteredList);
            return filteredList;
         }
         function ClearFilters(callback){
            $("#tipsTricks_ClientFilter", element).val("");
            $("#tipsTricks_TypeFilter", element).val("");
            if(callback != null)
            {
               callback();
            }
         }
         function WriteRecordsFound(list)
         {
            let listLength = list?.length || 0;
            $("#lblRecordFoundCount", element).empty();
            $("#lblRecordFoundCount", element).append(listLength);
         }
         function SortTipsTricksList(listToSort) {
            let sortedList = listToSort;
            return sortedList;
         }
         function LoadEditorForm(idToLoad, callback) {
            let tipsItem = currentTipsTricksList.find(i => i.ManagerTipsTricksId == idToLoad);
            if (tipsItem != null) {
               $("#tipsTricksEditor_tipsTricksId", element).val(tipsItem.ManagerTipsTricksId);
               $("#tipsTricksEditor_tipsTricksId", element).attr("readonly", true);
               $("#tipsTricksEditor_tipsTricksText", element).val(tipsItem.ManagerTipsTricksText);
               $("#tipsTricksEditor_tipsTricksStatus", element).val(tipsItem.Status);
               $("#tipsTricksEditor_tipsTricksTypeId", element).val(tipsItem.TipsTricksTypeId);
               $("#tipsTricksEditor_Client", element).val(tipsItem.Client);
            }
            if (callback != null) {
               callback();
            }
         }
         function SaveTipsTricksObject(objectToSave, callback) {
            a$.ajax({
               type: "POST",
               service: "C#",
               async: true,
               data: {
                  lib: "selfserve",
                  cmd: "saveTipsAndTricks",
                  currentTipsTricks: JSON.stringify(objectToSave)
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
                     currentTipsTricksList.length = 0;
                     if (callback != null) {
                        callback(data);
                     }
                  }
               }
            });
         }
         function SetStatus(id, status, callback) {
            a$.ajax({
               type: "POST",
               service: "C#",
               async: true,
               data: {
                  lib: "selfserve",
                  cmd: "setTipsAndTricksStatus",
                  idtoupdate: id,
                  newstatus: status
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
                     ko.postbox.publish("tipsTricksManagerReload", true);
                  }
               }
            });
         }
         function ValidateEditorForm(callback) {
            var formValid = true;
            var errorMessages = [];
            let textValue = $("#tipsTricksEditor_tipsTricksText", element).val();
            let typeValue = $("#tipsTricksEditor_tipsTricksTypeId", element).val();
            if (textValue == null || textValue == "") {
               errorMessages.push({ message: "Text Required", fieldclass: "", fieldid: "tipsTricksEditor_tipsTricksText" });
               formValid = false;
            }
            if(typeValue == null || typeValue == "")
            {
               errorMessages.push({ message: "Type Required", fieldclass: "", fieldid: "tipsTricksEditor_tipsTricksTypeId" });
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
            let tipToSave = CollectFormDataForTipsTricks();
            SaveTipsTricksObject(tipToSave, function () {
               LoadCurrentTipsAndTricks();
               HideEditorForm();
            });
            if (callback != null) {
               callback();
            }
         }
         function DeleteTipsAndTricks(idToDelete, callback) {
            if (confirm("You are about to remove this tip, trick, value, vision or purpose.  In doing so you will not be able to recover this information and you must re-enter it.\nAre you sure?\n\nPress OK to continue or CANCEL to keep the resource.")) {
               let objectToRemove = currentTipsTricksList.find(i => i.ManagerTipsTricksId == idToDelete);
               if(objectToRemove != null)
               {
                  a$.ajax({
                     type: "POST",
                     service: "C#",
                     async: false,
                     data: {
                        lib: "selfserve",
                        cmd: "deleteTipsTrick",
                        tiptrick: JSON.stringify(objectToRemove)
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
                           currentTipsTricksList.length = 0;
                           if (callback != null) {
                              callback(data);
                           }
                        }
                     }
                  });
               }
               else
               {
                  alert("Unable to find item to remove; please try again later.");
                  if (callback != null) {
                     callback();
                  }
               }
            }
         }
         function ClearEditorForm(callback) {
            $("#tipsTricksEditor_tipsTricksText", element).val("");
            $("#tipsTricksEditor_Client", element).val(0);
            $("#tipsTricksEditor_tipsTricksTypeId", element).val("");
            $("#tipsTricksEditor_tipsTricksId", element).val(-1);
            $("#tipsTricksEditor_tipsTricksId", element).attr("readonly", false);
            $("#tipsTricksEditor_tipsTricksStatus", element).val("A");

            $(".error-information-holder", element).empty();
            $(".error-information-holder", element).hide();
            $(".errorField", element).each(function () {
               $(this).removeClass("errorField");
            });

            if (callback != null) {
               callback();
            }
         }
         function CollectFormDataForTipsTricks() {
            let returnObject = new Object();

            returnObject.ManagerTipsTricksId = $("#tipsTricksEditor_tipsTricksId", element).val();
            returnObject.Client = $("#tipsTricksEditor_Client", element).val() || 0;
            returnObject.TipsTricksTypeId = $("#tipsTricksEditor_tipsTricksTypeId", element).val();
            returnObject.ManagerTipsTricksText = $("#tipsTricksEditor_tipsTricksText", element).val();
            returnObject.Status = $("#tipsTricksEditor_tipsTricksStatus", element).val() || "A";
            returnObject.EntDt = new Date().toLocaleDateString();
            returnObject.EntBy = legacyContainer.scope.TP1Username;            
            return returnObject;
         }
         function WriteTipsTricksLoadingMessage(messageToLoad, callback) {
            $("#tipsTicksTextLoadingMessage", element).empty();
            if (messageToLoad != null && messageToLoad != "") {
               $("#tipsTicksTextLoadingMessage", element).append(messageToLoad);
            }
            if (callback != null) {
               callback();
            }
         }
         function GetStatusName(statusCode)
         {
            let returnValue = statusCode;
            let statusData = possibleStatusList.find(i => i.code.toUpperCase() == statusCode.toUpperCase());
            if(statusData != null)
            {
               returnValue = statusData.text;
            }
            return returnValue;
         }
         function HideAll() {
            HideEditorForm();
         }
         function HideTipsTricksLoadingMessage() {
            $("#tipsTicksTextLoadingHolder", element).hide();
         }
         function ShowTipsTricksLoadingMessage() {
            $("#tipsTicksTextLoadingHolder", element).show();
         }
         function ShowEditorForm() {
            $("#tipsTricksFormPanel", element).show();
         }
         function HideEditorForm() {
            $("#tipsTricksFormPanel", element).hide();
         }
         scope.load = function () {
            scope.Initialize();
            LoadCurrentTipsAndTricks();
            HideTipsTricksLoadingMessage();
         };
         ko.postbox.subscribe("tipsTricksManagerReload", function (requireReload) {
            if (requireReload == true) {
               currentTipsTricksList.length = 0;
            }
            WriteTipsTricksLoadingMessage("Reloading information...", function () {
               ShowTipsTricksLoadingMessage();
               window.setTimeout(function () {
                  LoadCurrentTipsAndTricks(function(){
                  HideTipsTricksLoadingMessage();
                  });
               }, 500);
            });
         });
         ko.postbox.subscribe("tipsTricksManagerLoad", function () {
            WriteTipsTricksLoadingMessage("Loading information...", function () {
               ShowTipsTricksLoadingMessage();
               scope.load();
            });
         });
      }
   };
}]);