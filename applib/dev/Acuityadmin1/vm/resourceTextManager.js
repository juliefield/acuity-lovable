angularApp.directive("ngResourceTextManager", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/ACUITYADMIN1/view/resourceTextManager.htm?' + Date.now(),
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
         var currentResources = [];
         //TODO: Get the current languages list
         let availableLanguages = [
            { LanguageValue: "en", LanguageText: "English" },
            { LanguageValue: "sp", LanguageText: "Spanish" },
            { LanguageValue: "fr", LanguageText: "French" }
         ];
         
         let availableClients = [];

         var dataLoaded = false;
         scope.Initialize = function () {
            HideAll();
            LoadPossibleClients();
            LoadListOptions("ALL");
         };

         function LoadPossibleClients()
         {
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
               $("#resourceText_Client", element).empty();
               $("#resourceText_Client", element).append($("<option />", { value: 0, text: "All Clients" }));
               $("#resourceText_ClientFilter", element).empty();
               $("#resourceText_ClientFilter", element).append($("<option />", { value: 0, text: "All Clients" }));
               let clientList = availableClients;               
               // if(legacyContainer.scope.TP1Role != "Admin")
               // {
                  appLib.getConfigParameterByName("CLIENT_ID", function(parameter){
                     if(parameter != null)
                     {
                        let clientId = parseInt(parameter.ParamValue);
                        clientList = availableClients.filter(c  => c.ClientNumber == clientId || c.ClientNumber == 0);
                     }
                  });
               //}

               for (let cIndex = 0; cIndex < clientList.length; cIndex++) {
                  let clientItem = clientList[cIndex];
                  $("#resourceText_Client", element).append($("<option />", { value: clientItem.ClientNumber, text: clientItem.ClientName }));
                  $("#resourceText_ClientFilter", element).append($("<option />", { value: clientItem.ClientNumber, text: clientItem.ClientName }));
               }
            }

            if (loadAll == true || loadType == "languages" || loadType == "language") {
               $("#resourceText_ResourceLanguage", element).empty();
               $("#resourceText_ResourceLanguage", element).append($("<option />"), { text: "Select Language", value: "" });
               $("#resourceText_LanguageFilter", element).empty();
               $("#resourceText_LanguageFilter", element).append($("<option />"), { text: "Select Language", value: "" });
               for (let lIndex = 0; lIndex < availableLanguages.length; lIndex++) {
                  let langItem = availableLanguages[lIndex];
                  $("#resourceText_ResourceLanguage", element).append($("<option />", { value: langItem.LanguageValue, text: langItem.LanguageText }));
                  $("#resourceText_LanguageFilter", element).append($("<option />", { value: langItem.LanguageValue, text: langItem.LanguageText }));
               }
            }
         }

         function LoadResourceText(callback) {
            if (currentResources != null && currentResources.length > 0) {
               RenderCurrentResourceTextList(null, callback);
            }
            else {
               GetCurrentResourceTexts(null, function (itemsToRender) {
                  RenderCurrentResourceTextList(itemsToRender, callback);
               });
            }
         }
         function GetCurrentResourceTexts(forceReload, callback) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (forceReload != true && currentResources.length > 0) {
               if (callback != null) {
                  callback(currentResources);
               }
            }
            else {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "selfserve",
                     cmd: "getAllResourcesForClient"
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let resourceList = JSON.parse(data.clientResourceList);
                     currentResources.length = 0;
                     currentResources = resourceList;
                     if (callback != null) {
                        callback(resourceList);
                     }
                  }
               });
            }
         }

         function RenderCurrentResourceTextList(listToRender, callback) {
            let listToFilter = listToRender;
            if (listToFilter == null) {
               listToFilter = currentResources;
            }
            let filteredList = ApplyFilters(listToFilter);
            listToRender = SortResourceList(filteredList);

            let resourceTextListingHolder = $("<div class=\"resource-text-listing-holder\" />");

            if (listToRender != null && listToRender.length > 0) {

               let resourceTextHeaderRowHolder = $("<div class=\"resource-text-display-list-item-holder header-row\" />");

               let resourceKeyHeaderHolder = $("<div class=\"resource-text-item-holder header-item\" />");
               resourceKeyHeaderHolder.append("Key");
               let resourceClientHeaderHolder = $("<div class=\"resource-text-item-holder header-item\" />");
               resourceClientHeaderHolder.append("Client");
               let resourceLanguageHeaderHolder = $("<div class=\"resource-text-item-holder header-item\" />");
               resourceLanguageHeaderHolder.append("Language");
               let resourceTextHeaderHolder = $("<div class=\"resource-text-item-holder header-item\" />");
               resourceTextHeaderHolder.append("Text");
               let resourceActionHeaderHolder = $("<div class=\"resource-text-item-holder header-item button-holder\" />");
               resourceActionHeaderHolder.append("Actions");

               resourceTextHeaderRowHolder.append(resourceKeyHeaderHolder);
               resourceTextHeaderRowHolder.append(resourceClientHeaderHolder);
               resourceTextHeaderRowHolder.append(resourceLanguageHeaderHolder);
               resourceTextHeaderRowHolder.append(resourceTextHeaderHolder);
               resourceTextHeaderRowHolder.append(resourceActionHeaderHolder);

               resourceTextListingHolder.append(resourceTextHeaderRowHolder);

               for (let rtIndex = 0; rtIndex < listToRender.length; rtIndex++) {
                  let resourceItem = listToRender[rtIndex];

                  let resourceTextRowHolder = $("<div class=\"resource-text-display-list-item-holder\" />");

                  let resourceKeyHolder = $("<div class=\"resource-text-item-holder\" />");
                  resourceKeyHolder.append(resourceItem.ResourceKey);

                  let resourceClientHolder = $("<div class=\"resource-text-item-holder\" />");
                  let clientName = "All Clients";
                  if (resourceItem.Client != 0) {
                     clientName = resourceItem.Client;
                     let clientObject = availableClients.find(c => c.ClientNumber == resourceItem.Client);
                     if (clientObject != null) {
                        clientName = clientObject.ClientName;
                     }

                  }
                  resourceClientHolder.append(clientName);

                  let resourceLanguageHolder = $("<div class=\"resource-text-item-holder\" />");
                  let resourceLanguageName = "English";
                  if (resourceItem.ResourceLanguage.toLowerCase() != "en") {
                     resourceLanguageName = resourceItem.ResourceLanguage;
                     let languageObject = availableLanguages.find(l => l.LanguageValue == resourceItem.ResourceLanguage);
                     if (languageObject != null) {
                        resourceLanguageName = languageObject.LanguageText;
                     }
                  }

                  resourceLanguageHolder.append(resourceLanguageName);

                  let resourceTextHolder = $("<div class=\"resource-text-item-holder\" />");
                  resourceTextHolder.append(resourceItem.ResourceText);

                  let resourceButtonHolder = $("<div class=\"resource-text-button-holder\" />");
                  let resourceIdString = resourceItem.ResourceKey + "|" + resourceItem.ResourceLanguage + "|" + resourceItem.Client
                  let editButton = $("<button class=\"button btn\" id=\"editResourceText|" + resourceIdString + "\"><i class=\"fa fa-edit\"></i></button>");
                  let deleteButton = $("<button class=\"button btn btn-delete\" id=\"deleteResourceText|" + resourceIdString + "\"><i class=\"fa fa-trash\"></i></button>");
                  editButton.on("click", function () {
                     let id = this.id;
                     let resourceKey = id.split("|")[1];
                     let language = id.split("|")[2];
                     let clientId = id.split("|")[3];
                     LoadEditorForm(resourceKey, language, clientId, function () {
                        ShowEditorForm();
                     });
                  });
                  deleteButton.on("click", function () {
                     let id = this.id;
                     let resourceKey = id.split("|")[1];
                     let language = id.split("|")[2];
                     let clientId = id.split("|")[3];
                     DeleteResource(resourceKey, language, clientId, function () {
                        ko.postbox.publish("resourceTextManagerReload", true);
                        HideResourceLoadingMessage();
                     });
                  });
                  //TODO: Determine which roles can edit the global values.
                  if((resourceItem.Client == 0 && legacyContainer.scope.TP1Role == "Admin") || resourceItem.Client > 0)
                  {
                     resourceButtonHolder.append(editButton);
                  }
                  if (resourceItem.Client > 0) {
                     resourceButtonHolder.append("&nbsp;&nbsp;");
                     resourceButtonHolder.append(deleteButton);
                  }

                  resourceTextRowHolder.append(resourceKeyHolder);
                  resourceTextRowHolder.append(resourceClientHolder);
                  resourceTextRowHolder.append(resourceLanguageHolder);
                  resourceTextRowHolder.append(resourceTextHolder);
                  resourceTextRowHolder.append(resourceButtonHolder);

                  resourceTextListingHolder.append(resourceTextRowHolder);
               }
            }
            else {
               resourceTextListingHolder.append("No Resource Texts found or setup.");
            }
            $("#resourceTextList", element).empty();
            $("#resourceTextList", element).append(resourceTextListingHolder);

            if (callback != null) {
               callback();
            }
         }
         function LoadEditorForm(keyToLoad, languageToLoad, clientToLoad, callback) {
            let resourceItem = currentResources.find(i => i.ResourceKey == keyToLoad && i.ResourceLanguage == languageToLoad && i.Client == clientToLoad);
            if (resourceItem != null) {
               $("#resourceText_ResourceKey", element).val(resourceItem.ResourceKey);
               $("#resourceText_ResourceKey", element).attr("readonly", true);
               $("#resourceText_ResourceLanguage", element).val(resourceItem.ResourceLanguage);
               $("#resourceText_Client", element).val(resourceItem.Client);
               $("#resourceText_ResourceText", element).val(resourceItem.ResourceText);
            }

            if (callback != null) {
               callback();
            }
         }
         function SaveResourceTextObject(objectToSave, callback) {
            a$.ajax({
               type: "POST",
               service: "C#",
               async: true,
               data: {
                  lib: "selfserve",
                  cmd: "saveResourceText",
                  textResource: JSON.stringify(objectToSave)
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
                     currentResources.length = 0;
                     if (callback != null) {
                        callback(data);
                     }
                  }
               }
            });
         }
         function ValidateEditorForm(callback) {
            var formValid = true;
            var errorMessages = [];
            let keyValue = $("#resourceText_ResourceKey", element).val();
            let textValue = $("#resourceText_ResourceText", element).val();
            let clientValue = $("#resourceText_Client", element).val();
            //let langValue = $("#resourceText_ResourceLanguage", element).val();

            if (keyValue == null || keyValue == "") {
               errorMessages.push({ message: "Key Required", fieldclass: "", fieldid: "resourceText_ResourceKey" });
               formValid = false;
            }
            else if(keyValue.includes("|") || keyValue.includes("~"))
            {
               errorMessages.push({ message: "Key has invalid characters. Only letters, numbers, underscores ['_'] and periods ['.'] are allowed.", fieldclass: "", fieldid: "resourceText_ResourceKey" });
               formValid = false;
            }
            if (textValue == null || textValue == "") {
               errorMessages.push({ message: "Text Required", fieldclass: "", fieldid: "resourceText_ResourceText" });
               formValid = false;
            }
            if (clientValue == 0) {
               if (confirm("You are editing a global value for this key and it will affect all instances of Acuity.  Are you sure you wish to proceed?")) {
                  formValid = formValid;
               }
               else {
                  formValid = false;
               }
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
            let resourceToSave = CollectFormDataForResourceText();
            SaveResourceTextObject(resourceToSave, function () {
               LoadResourceText();
               HideEditorForm();
            });
            if (callback != null) {
               callback();
            }
         }
         function DeleteResource(key, language, client, callback) {
            if (confirm("You are about to remove a resource that you have defined.\nRemoving it will cause the application to revert to the globally assigned text for this language. \nAre you sure?\n\nPress OK to continue or CANCEL to keep the resource.")) {
               let objectToRemove = currentResources.find(i => i.ResourceKey == key && i.ResourceLanguage == language && i.Client == client);
               if(objectToRemove != null)
               {
                  a$.ajax({
                     type: "POST",
                     service: "C#",
                     async: false,
                     data: {
                        lib: "selfserve",
                        cmd: "deleteResourceText",
                        textResource: JSON.stringify(objectToRemove)
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
                           currentResources.length = 0;
                           if (callback != null) {
                              callback(data);
                           }
                        }
                     }
                  });
               }
               else
               {
                  alert("Unable to find resource to remove; please try again later.");
                  if (callback != null) {
                     callback();
                  }
               }
            }
         }
         function ClearEditorForm(callback) {
            $("#resourceText_ResourceKey", element).val("");
            $("#resourceText_ResourceKey", element).removeAttr("readonly");
            $("#resourceText_ResourceLanguage", element).val("en");
            $("#resourceText_Client", element).val(0);
            $("#resourceText_ResourceText", element).val("");

            $(".error-information-holder", element).empty();
            $(".error-information-holder", element).hide();
            $(".errorField", element).each(function () {
               $(this).removeClass("errorField");
            });

            if (callback != null) {
               callback();
            }
         }
         function CollectFormDataForResourceText() {
            let returnObject = new Object();
            returnObject.ResourceKey = $("#resourceText_ResourceKey", element).val();
            returnObject.ResourceLanguage = $("#resourceText_ResourceLanguage", element).val();
            returnObject.Client = $("#resourceText_Client", element).val();
            returnObject.ResourceText = $("#resourceText_ResourceText", element).val();
            return returnObject;
         }
         function ClearFilters(callback) {
            $("#resourceText_KeyFilter", element).val("");
            $("#resourceText_LanguageFilter", element).val("");
            $("#resourceText_ClientFilter", element).val("");
            $("#resourceText_TextFilter", element).val("");
            if (callback != null) {
               callback();
            }
         }
         function ApplyFilters(listToFilter) {
            let resourceKeyFilter = $("#resourceText_KeyFilter", element).val() || "";
            let resourceTextFilter = $("#resourceText_TextFilter", element).val() || "";
            let resourceClientFilter = $("#resourceText_ClientFilter", element).val() || "";
            let resourceLanguageFilter = $("#resourceText_LanguageFilter", element).val() || "";

            let filteredList = listToFilter;            
            if (resourceKeyFilter != "") {
               filteredList = filteredList.filter(r => r.ResourceKey.toLowerCase().includes(resourceKeyFilter.toLowerCase()));
            }
            if (resourceClientFilter != "" && parseInt(resourceClientFilter) != 0) {
               filteredList = filteredList.filter(r => r.Client == parseInt(resourceClientFilter));
            }
            if (resourceLanguageFilter != "") {
               filteredList = filteredList.filter(r => r.ResourceLanguage.toLowerCase().includes(resourceLanguageFilter.toLowerCase()));
            }
            if (resourceTextFilter != "") {
               filteredList = filteredList.filter(r => r.ResourceText.toLowerCase().includes(resourceTextFilter.toLowerCase()));
            }

            return filteredList;
         }
         function SortResourceList(listToSort, fieldToSort) {
            let sortedList = listToSort;
            // switch (fieldToSort?.toLowerCase()) {
            //     case "system":
            //         sortedList = sortedList.sort((a, b) => a.IsSystemValue > b.IsSystemValue ? -1 : 0);
            //         break;
            //     case "name":
            //         sortedList = sortedList.sort((a, b) => a.ParamName > b.ParamName ? 1 : -1);
            //         break;
            //     default:
            //         sortedList = sortedList.sort((a, b) => a.ParamName > b.ParamName ? 1 : -1);
            //         break;
            // }

            return sortedList;
         }
         function WriteResourceLoadingMessage(messageToLoad, callback) {
            $("#resourceTextLoadingMessage", element).empty();
            if (messageToLoad != null && messageToLoad != "") {
               $("#resourceTextLoadingMessage", element).append(messageToLoad);
            }
            if (callback != null) {
               callback();
            }
         }
         function HideAll() {
            HideEditorForm();
         }
         function HideResourceLoadingMessage() {
            $("#resourceTextLoadingHolder", element).hide();
         }
         function ShowResourceLoadingMessage() {
            $("#resourceTextLoadingHolder", element).show();
         }
         function ShowEditorForm() {
            $("#resourceTextFormPanel", element).show();
         }
         function HideEditorForm() {
            $("#resourceTextFormPanel", element).hide();
         }

         scope.load = function () {
            scope.Initialize();

            $("#resourceText_Refresh", element).off("click").on("click", function () {
               WriteResourceLoadingMessage("Applying filters...", function () {
                  ShowResourceLoadingMessage();
                  window.setTimeout(function () {
                     LoadResourceText(function () {
                        HideResourceLoadingMessage();
                     });
                  }, 500);
               });
            });

            $("#resourceText_clearFilter", element).off("click").on("click", function () {
               ClearFilters(function () {
                  LoadResourceText(function () {
                     HideResourceLoadingMessage();
                  });
               });
            });

            $(".btn-close", element).off("click").on("click", function () {
               ClearEditorForm(function () {
                  HideEditorForm();
                  ko.postbox.publish("resourceTextManagerReload", false);
               });
            });

            $("#btnSaveResourceText", element).off("click").on("click", function () {
               ValidateEditorForm(function () {
                  SaveEditorForm(function () {
                     ClearEditorForm();
                     HideEditorForm();
                     ko.postbox.publish("resourceTextManagerReload", true);
                  });
               });
            });
            $("#btnAddResourceText", element).off("click").on("click", function () {
               ClearEditorForm(function () {
                  ShowEditorForm();
               });
            });
            LoadResourceText();
            HideResourceLoadingMessage();
         };

         ko.postbox.subscribe("resourceTextManagerReload", function (requireReload) {
            if (requireReload == true) {
               currentResources.length = 0;
            }
            WriteResourceLoadingMessage(null, function () {
               ShowResourceLoadingMessage();
               window.setTimeout(function () {
                  LoadResourceText(function(){
                     HideResourceLoadingMessage();
                  });
               }, 500);
            });
         });
         ko.postbox.subscribe("resourceTextManagerLoad", function () {
            WriteResourceLoadingMessage(null, function () {
               ShowResourceLoadingMessage();
               scope.load();
            });
         });
      }
   };
}]);