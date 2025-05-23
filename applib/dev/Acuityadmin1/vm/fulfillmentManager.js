angularApp.directive("ngFulfillmentManager", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/ACUITYADMIN1/view/fulfillmentManager.htm?' + Date.now(),
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
         var basePrizeUrl = window.location.protocol + "//" + window.location.hostname + "/applib/css/images/prizes/";
         var baseClientPrizeUrl = window.location.protocol + "//" + window.location.hostname;
         var defaultAvatarUrl = window.location.protocol + "//" + window.location.hostname + "/jq/avatars/empty_headshot.png";
         var defaultPrizeUrl = window.location.protocol + "//" + window.location.hostname + "/applib/css/images/prizes/prize-placeholder.png";
         var clientUploadedImageKey = "/UPLOADS/";//TODO: Change to a config parameter
         var allFulfillmentItems = [];
         var possibleUserProfiles = [];
         var possibleFilterUserProfiles = [];
         var possibleFilterPrizes = [];

         scope.Initialize = function () {
            HideAll();
            SetDatePickers();
            LoadPossibleFulfillmentUsers();
         };
         function SetDatePickers() {
            $("#fulfillmentManagerForm_PrizeFulfillmentDate", element).datepicker();
         }
         function HideAll()
         {
            HideFulfillmentManagerForm();
            HideUserInformation();
         }
         function LoadAllFulfillmentItems(callback) {
            let activeOnlyItems = false;
            a$.ajax({
               type: "GET",
               service: "C#",
               async: false,
               data: {
                  lib: "selfserve",
                  cmd: "getAllFulfillmentItems",
                  activeonlyitems: activeOnlyItems
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (jsonData) {
                  let fulfillmentList = JSON.parse(jsonData.fulfillmentList);
                  allFulfillmentItems = fulfillmentList;
                  LoadFilterLists("ALL");
                  if (callback != null) {
                     callback(fulfillmentList);
                  }
                  return fulfillmentList;
               }
            });
         }
         function LoadPossibleFulfillmentUsers(callback) {
            a$.ajax({
               type: "GET",
               service: "C#",
               async: true,
               data: {
                  lib: "selfserve",
                  cmd: "getNonCSRProfiles"
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (jsonData) {
                  let returnData = JSON.parse(jsonData.profilesList);
                  possibleUserProfiles = returnData;
                  if (callback != null) {
                     callback(returnData);
                  }
                  return returnData;
               }
            });
         }
         function LoadFilterLists(areaToLoad, callback) {
            let filterList = [];
            if (areaToLoad.toUpperCase() == "ALL".toUpperCase() || areaToLoad == "USERS".toUpperCase()) {
               filterList.length = 0;
               if (allFulfillmentItems != null && allFulfillmentItems.length > 0) {
                  filterList = allFulfillmentItems.filter(x => x.AwardedBySource != null);
                  $(filterList).each(function () {
                     if (possibleFilterUserProfiles.findIndex(x => x.UserId == this.UserId) < 0) {
                        possibleFilterUserProfiles.push(this.AwardedBySource);
                     }
                  });
               }
               filterList = possibleFilterUserProfiles;
               $("#fulfillmentManager_UserFilter", element).empty();
               $("#fulfillmentManager_UserFilter", element).append("<option value=\"\">Select User</option>");
               for (let cnt = 0; cnt < filterList.length; cnt++) {
                  let item = filterList[cnt];
                  let listItem = $("<option />");
                  listItem.val(item.UserId);
                  listItem.text(item.UserFullName);
                  $("#fulfillmentManager_UserFilter", element).append(listItem);
               }
            }
            if (areaToLoad.toUpperCase() == "ALL".toUpperCase() || areaToLoad.toUpperCase() == "ITEMS".toUpperCase()) {
               filterList.length = 0;
               if (allFulfillmentItems != null && allFulfillmentItems.length > 0) {
                  filterList = allFulfillmentItems.filter(x => x.PrizeOptionIdSource != null);
                  $(filterList).each(function () {
                     if (possibleFilterPrizes.findIndex(x => x.PrizeOptionId == this.PrizeOptionId) < 0) {
                        possibleFilterPrizes.push(this.PrizeOptionIdSource);
                     }
                  });
               }
               filterList = possibleFilterPrizes;
               $("#fulfillmentManager_ItemFilter", element).empty();
               $("#fulfillmentManager_ItemFilter", element).append("<option value=\"\">Select Item</option>");
               for (let cnt = 0; cnt < filterList.length; cnt++) {
                  let item = filterList[cnt];
                  let listItem = $("<option />");
                  listItem.val(item.PrizeOptionId);
                  listItem.text(item.PrizeOptionName);
                  $("#fulfillmentManager_ItemFilter", element).append(listItem);
               }
            }
            if (callback != null) {
               callback();
            }
         }
         function RenderFulfillmentList(listToRender, callback) {
            if (listToRender == null) {
               listToRender = allFulfillmentItems;
            }
            let fulfillmentListHolder = $("<div class=\"fulfillment-list-items-holder\" />");
            fulfillmentListHolder.append("<div class=\"fulfillment-list-items-none-found\">No fulfillment items found.</div>");
            if(listToRender.length > 0)
            {
               fulfillmentListHolder.empty();
               for (let fc = 0; fc < listToRender.length; fc++) {
                  RenderFulfillmentItem(listToRender[fc], fulfillmentListHolder);
               }
            }

            $("#fulfillmentManager_ListHolder", element).empty();
            $("#fulfillmentManager_ListHolder", element).append(fulfillmentListHolder);            
            if(callback != null)
            {
               callback();
            }
         }
         function RenderFulfillmentItem(itemToRender, objectToRenderTo, callback) {
            let fulfillmentItemRow = $("<div class=\"fulfillment-list-item-row\" />");

            let fulfillmentItemDateHolder = $("<div class=\"fulfillment-manager-item-holder date-earned\" />");
            let fulfillmentItemUserHolder = $("<div class=\"fulfillment-manager-item-holder user-name\" />");
            let fulfillmentItemItemHolder = $("<div class=\"fulfillment-manager-item-holder fulfillment-item-name\" />");
            let fulfillmentItemFulfillDateHolder = $("<div class=\"fulfillment-manager-item-holder fulfilled-date\" />");
            let fulfillmentItemFulfillByHolder = $("<div class=\"fulfillment-manager-item-holder fulfilled-by\" />");
            let fulfillmentItemButtonHolder = $("<div class=\"fulfillment-manager-item-holder actions-options\" />");

            let fulfillByMeTodayButton = $("<button id=\"QuickMark_" + itemToRender.UserPointsId + "\">Mark Fulfilled Today By Me</button>");
            fulfillByMeTodayButton.off("click").on("click", function () {
               let buttonId = this.id;
               let id = buttonId.split("_")[1];
               QuickmarkItemFulfilled(id, function () {
                  WriteUserInformation("Item Marked as fulfilled.", 10000);
                  LoadAllFulfillmentItems(function () {
                     RenderFulfillmentList();
                  });
               });
            });
            let fulfillmentOtherButton = $("<button id=\"MarkFulfilled_" + itemToRender.UserPointsId + "\">Set as Fulfilled</button>");
            fulfillmentOtherButton.off("click").on("click", function () {
               let buttonId = this.id;
               let id = buttonId.split("_")[1];

               LoadFulfillmentManagerForm(id, function () {
                  ShowFulfillmentManagerForm();
               });

            });
            let userInformationHolder = $("<div class=\"fulfillment-manager-user-data-holder\" />");
            let userNameWithAvatar = BuildFullNameWithAvatar(itemToRender.UserIdSource, itemToRender.UserId);

            userInformationHolder.append(userNameWithAvatar);

            let pointsValueDate = new Date(itemToRender.PointsValueDate).toLocaleDateString();

            let itemNameWithImageHolder = $("<div class=\"fulfillment-manager-item-name-image-holder\" />");
            let itemUrl = defaultPrizeUrl;
            let itemName = itemToRender.PrizeOptionId;

            if (itemToRender.PrizeOptionIdSource != null) {
               itemUrl = GetImageUrl(itemToRender.PrizeOptionIdSource.PrizeImageUrl);
               itemName = itemToRender.PrizeOptionIdSource.PrizeOptionName;
            }
            let itemImage = $("<img class=\"fulfillment-manager-item-image\" />");
            itemImage.prop("src", itemUrl);
            itemImage.height(30);

            let itemNameHolder = $("<span class=\"fulfillment-manager-item-name-holder\" />");
            itemNameHolder.append(itemName);

            itemNameWithImageHolder.append(itemImage);
            itemNameWithImageHolder.append(itemNameHolder);

            let fulfillmentDate = "";
            let fulfillmentBy = "";
            if (itemToRender.PrizeFulfillmentDate != null) {
               fulfillmentDate = new Date(itemToRender.PrizeFulfillmentDate).toLocaleDateString();
            }

            if (itemToRender.PrizeFulfillmentBy != null && itemToRender.PrizeFulfillmentBy != "") {
               fulfillmentBy = itemToRender.PrizeFulfillmentBy;

               if (itemToRender.PrizeFulfillmentBySource != null) {
                  fulfillmentBy = BuildFullNameWithAvatar(itemToRender.PrizeFulfillmentBySource, itemToRender.PrizeFulfillmentBy);
               }
            }

            fulfillmentItemDateHolder.append(pointsValueDate);
            fulfillmentItemUserHolder.append(userInformationHolder);
            fulfillmentItemItemHolder.append(itemNameWithImageHolder);

            if (fulfillmentDate != null && fulfillmentDate != "") {
               fulfillmentItemFulfillDateHolder.append(fulfillmentDate);
               fulfillmentItemFulfillByHolder.append(fulfillmentBy);
            }
            else {
               fulfillmentItemFulfillDateHolder.append("&nbsp;");
               fulfillmentItemFulfillByHolder.append("&nbsp;");

               fulfillmentItemButtonHolder.append(fulfillmentOtherButton);
               fulfillmentItemButtonHolder.append("&nbsp;&nbsp;");
               fulfillmentItemButtonHolder.append(fulfillByMeTodayButton);
            }


            fulfillmentItemRow.append(fulfillmentItemDateHolder);
            fulfillmentItemRow.append(fulfillmentItemUserHolder);
            fulfillmentItemRow.append(fulfillmentItemItemHolder);
            fulfillmentItemRow.append(fulfillmentItemFulfillDateHolder);
            fulfillmentItemRow.append(fulfillmentItemFulfillByHolder);
            fulfillmentItemRow.append(fulfillmentItemButtonHolder);

            $(objectToRenderTo).append(fulfillmentItemRow);
         }
         function BuildFulfilledByList() {
            $("#fulfillmentManagerForm_PrizeFulfillmentBy", element).empty();
            $("#fulfillmentManagerForm_PrizeFulfillmentBy", element).append("<option>Select User</option>");

            for (let upc = 0; upc < possibleUserProfiles.length; upc++) {
               let userProfile = possibleUserProfiles[upc];
               let listItem = $("<option />");
               listItem.val(userProfile.UserId);
               listItem.text(userProfile.UserFullName);

               $("#fulfillmentManagerForm_PrizeFulfillmentBy", element).append(listItem);
            }
         }
         function LoadFulfillmentManagerForm(id, callback) {
            BuildFulfilledByList();

            let fulfillmentItem = allFulfillmentItems.find(i => i.UserPointsId == id);

            $("#fulfillmentManagerForm_PrizeFulfillmentBy", element).val(legacyContainer.scope.TP1Username);
            $("#fulfillmentManagerForm_PrizeFulfillmentDate", element).val(new Date().toLocaleDateString());

            if (fulfillmentItem != null) {
               let prizeImageUrl = defaultPrizeUrl;
               let prizeNameHolder = $("<div class=\"fulfillment-manager-form-prize-name\" />");
               if (fulfillmentItem.PrizeOptionIdSource != null) {
                  prizeImageUrl = GetImageUrl(fulfillmentItem.PrizeOptionIdSource.PrizeImageUrl);
                  prizeNameHolder.append(fulfillmentItem.PrizeOptionIdSource.PrizeOptionName);
               }
               let prizeImage = $("<img class=\"fulfillment-manager-form-prize-image\" />");
               prizeImage.prop("src", prizeImageUrl);
               prizeImage.height(75);//set default height.

               $("#fulfillmentManagerForm_PrizeOptionHolder", element).empty();
               $("#fulfillmentManagerForm_PrizeOptionHolder", element).append(prizeImage);
               $("#fulfillmentManagerForm_PrizeOptionHolder", element).append(prizeNameHolder);


               $("#fulfillmentManagerForm_UserPointsId", element).val(id);

               if (callback != null) {
                  callback();
               }
            }
         }

         function ValidateFulfillmentManagerForm(callback) {

            var formValid = true;
            let errorMessages = [];
            let fulfilledBy = $("#fulfillmentManagerForm_PrizeFulfillmentBy", element).val();
            let fulfilledOnDate = $("#fulfillmentManagerForm_PrizeFulfillmentDate", element).val();

            if (fulfilledOnDate == null || fulfilledOnDate == "") {
               errorMessages.push({ message: "Fulfillment Date is Required.", fieldclass: "", fieldid: "fulfillmentManagerForm_PrizeFulfillmentBy" });
               formValid = false;
            }
            else {
               if (new Date(fulfilledOnDate) > new Date()) {
                  errorMessages.push({ message: "Fulfillment Date must be before today.", fieldclass: "", fieldid: "fulfillmentManagerForm_PrizeFulfillmentBy" });
                  formValid = false;
               }
            }
            if (fulfilledBy == null || fulfilledBy == "") {
               errorMessages.push({ message: "Fulfilled By is Required.", fieldclass: "", fieldid: "fulfillmentManagerForm_PrizeFulfillmentDate" });
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
                  if (item.fieldid != "") {
                     $("#" + item.fieldd, element).addClass("errorField");
                     $("#" + item.fieldd, element).off("blur").on("blur", function () {
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
         function SaveFulfillmentManagerForm(callback) {
            let id = parseInt($("#fulfillmentManagerForm_UserPointsId", element).val());
            let fulfillBy = $("#fulfillmentManagerForm_PrizeFulfillmentBy", element).val();
            let fulfillDate = new Date($("#fulfillmentManagerForm_PrizeFulfillmentDate", element).val());

            if (fulfillBy == null || fulfillBy == "") {
               fulfillBy = legacyContainer.scope.TP1Username;
            }

            let objectToSave = new Object();
            objectToSave.UserPointsId = id;
            objectToSave.PrizeFulfillmentBy = fulfillBy;
            objectToSave.PrizeFulfillmentDate = fulfillDate;
            objectToSave.UpdDt = new Date();
            objectToSave.UpdBy = legacyContainer.scope.TP1Username;

            MarkItemFulfilled(objectToSave, callback);
         }
         function QuickmarkItemFulfilled(idToMark, callback) {
            let objectToSave = new Object();
            objectToSave.UserPointsId = idToMark;
            objectToSave.PrizeFulfillmentBy = legacyContainer.scope.TP1Username;
            objectToSave.PrizeFulfillmentDate = new Date();
            MarkItemFulfilled(objectToSave, callback);

         }
         function MarkItemFulfilled(objectToMark, callback) {
            a$.ajax({
               type: "GET",
               service: "C#",
               async: false,
               data: {
                  lib: "selfserve",
                  cmd: "markItemFulfilled",
                  itemToFulfill: JSON.stringify(objectToMark)
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (jsonData) {
                  //refresh the prize manager information
                  ko.postbox.publish("refreshPointsPrizeData");
                  if (callback != null) {
                     callback();
                  }
               }
            });
         }
         function ApplyFilters(callback)
         {
            WriteUserInformation("Filtering list...", 3000);
            let userIdFilter = null;
            let itemIdFilter = null;            
            let filteredItems = [];

            if($("#fulfillmentManager_UserFilter", element).val() != "")
            {
               userIdFilter = $("#fulfillmentManager_UserFilter", element).val();
            }
            if($("#fulfillmentManager_ItemFilter", element).val() != "")
            {
               itemIdFilter = $("#fulfillmentManager_ItemFilter", element).val();
            }            
            itemStatus = $("#fulfillmentManager_ItemStatus", element).val();
            filteredItems = allFulfillmentItems;
            filteredItems = filteredItems.filter(x => x.UserId == userIdFilter || userIdFilter == null);
            filteredItems = filteredItems.filter(x => x.PrizeOptionId == itemIdFilter || itemIdFilter == null);

            if(itemStatus != null && itemStatus != "")
            {
               if(itemStatus == "open")
               {
                  filteredItems = filteredItems.filter(x => x.PrizeFulfillmentDate == null);
               }
               else if (itemStatus == "fulfilled")
               {
                  filteredItems = filteredItems.filter(x => x.PrizeFulfillmentDate != null);
               }
            }            
            RenderFulfillmentList(filteredItems, callback);
         }
         function ClearFilters(callback) {
            $("#fulfillmentManager_UserFilter", element).val("");
            $("#fulfillmentManager_ItemFilter", element).val("");
            $("#fulfillmentManager_ItemStatus", element).val("");
            if (callback != null) {
               callback();
            }
         }
         function WriteUserInformation(message, displayTiming, callback) {
            if (displayTiming == null) {
               displayTiming = 5000;
            }

            $(".user-information-holder", element).empty();
            $(".user-information-holder", element).append(message);

            ShowUserInformation(displayTiming);
            if (callback != null) {
               callback();
            }
         }

         function HideUserInformation(callback) {
            $(".user-information-holder", element).hide();
            if (callback != null) {
               callback();
            }
         }
         function ShowUserInformation(displayForTiming, callback) {
            var currentDisplayStatus = $(".user-information-holder").css("display");
            $(".user-information-holder", element).show();

            if (displayForTiming != null) {
               window.setTimeout(function () {
                  HideUserInformation();
               }, displayForTiming);
            }

            if (callback != null) {
               callback();
            }
         }
         function HideFulfillmentManagerForm() {
            $("#FulfillmentManagerForm", element).hide();
         }
         function ShowFulfillmentManagerForm() {
            $("#FulfillmentManagerForm", element).show();
         }

         function GetImageUrl(currentValue) {
            let returnUrl = defaultPrizeUrl;

            if (currentValue.toUpperCase().includes(clientUploadedImageKey.toUpperCase())) {
               returnUrl = baseClientPrizeUrl + currentValue;
            }
            else {
               returnUrl = basePrizeUrl + currentValue;
            }

            return returnUrl;
         }
         function BuildFullNameWithAvatar(userProfileObject, defaultName) {
            let returnValue = $("<span />");
            let avatarImageUrl = defaultAvatarUrl;
            let avatarImage = $("<img>");
            let displayName = defaultName;
            if (userProfileObject != null) {
               displayName = userProfileObject.UserFullName;
               if (userProfileObject.AvatarImageFileName != "empty_headshot.png") {
                  avatarImageUrl = Global_CleanAvatarUrl(userProfileObject.AvatarImageFileName);
               }
            }

            avatarImage.prop("src", avatarImageUrl);
            avatarImage.height(20);
            returnValue.append(avatarImage);
            returnValue.append(displayName);

            return returnValue;
         }

         scope.load = function () {
            WriteUserInformation("Initializing fulfillment manager...");
            scope.Initialize();
            WriteUserInformation("Loading All Fulilment data...");
            LoadAllFulfillmentItems(function () {
               WriteUserInformation("Rendering data...");
               RenderFulfillmentList(null, function(){
                  HideUserInformation();
               });
            });
            $("#fulfillmentManager_UserFilter", element).off("change").on("change", function(){
               ApplyFilters(function(){
                  HideUserInformation();
               });
            });
            $("#fulfillmentManager_ItemFilter", element).off("change").on("change", function(){
               ApplyFilters(function(){
                  HideUserInformation();
               });
            });
            $("#fulfillmentManager_ItemStatus", element).off("change").on("change", function(){               
               ApplyFilters(function(){
                  HideUserInformation();
               });
            });

            $("#fulfillmentManager_RefreshList", element).off("click").on("click", function () {
               WriteUserInformation("Refreshing Fulfillment list...", 3000);
               LoadAllFulfillmentItems(function () {
                  RenderFulfillmentList();
                  HideUserInformation();
               });
            });
            $("#fulfilmentManager_ClearFilters", element).off("click").on("click", function () {
               ClearFilters(function () {
                  WriteUserInformation("Reloading list...", 3000);
                  LoadAllFulfillmentItems(function () {
                     RenderFulfillmentList();
                     HideUserInformation();
                  });
               })
            });
            $("#btnSaveFulfillmentManagerForm", element).off("click").on("click", function () {
               ValidateFulfillmentManagerForm(function () {
                  SaveFulfillmentManagerForm(function () {
                     WriteUserInformation("Item set to fulfilled.", 10000);
                     LoadAllFulfillmentItems(function () {
                        RenderFulfillmentList();
                     });
                     HideFulfillmentManagerForm();
                  });
               });
            });
            $(".btn-close", element).off("click").on("click", function () {
               HideFulfillmentManagerForm();
            });
         };
         scope.load2 = function(){
            HideAll();
         }
         scope.load2();
         //scope.load();
         ko.postbox.subscribe("FulfillmentManagerLoad", function(){
            WriteUserInformation("Loading fulfillment manager...", 10000);
            scope.load();
         });
         ko.postbox.subscribe("FulfillmentManagerRefresh", function(){
            //TODO: Determine what we need to refresh
            //for now we will just load data.
            scope.load();
         });
      }
   };
}]);