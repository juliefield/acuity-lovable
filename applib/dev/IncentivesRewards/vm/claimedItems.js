angularApp.directive("ngClaimedItems", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/IncentivesRewards/view/claimedItems.htm?' + Date.now(),
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
         let dataLoadType = null;
         let defaultAvatarFile = window.location.protocol + "//" + window.location.hostname + "/jq/avatars/empty_headshot.png";
         SetAttrValues(attrs);
         let initialClaimedItems = [];
         let userRewardsReferenceObjects = {
            UserProfiles: [],
            RewardOptions: [],
            IntervalOptions: [],
            AreaOptions: [],
            SubAreaOptions: [],
         };
         /* Event Handling START */
         $("#btnRefreshClaimedItems", element).off("click").on("click", function(){
            RenderClaimedItems();
         });
         /* Event Handling END */
         scope.Initialize = function () {
            HideAll();
         };
         function SetDatePickers() {
         }
         function SetAttrValues(attrs) {
            if (attrs.itemClaimType != null || attrs.itemclaimtype != null) {
               dataLoadType = (attrs.rewardsTyitemClaimTypepe || attrs.itemclaimtype);
            }
         }
         /* Data Loading START */
         function LoadDirective() {
            HideAll();
            LoadClaimedItems();
         }
         /* Data Loading END */
         function LoadClaimedItems(callback, forceReload) {
            GetClaimedItems(function (claimedItemsList) {
               RenderClaimedItems(function () {
                  if (callback != null) {
                     callback();
                  }
               }, claimedItemsList);
            }, forceReload);
         }
         /* Data Pulls START */
         function GetClaimedItems(callback, forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }
            if(forceReload == true)
            {
               initialClaimedItems.length = 0;
            }
            let claimCommand = "";
            switch(dataLoadType.toLowerCase()) {
               case "recentClaimed".toLowerCase():
                  claimCommand = "getRecentClaimedItems";
                  break;
               case "mostClaimed".toLowerCase():
                  claimCommand = "getMostClaimedItems";
                  break;
               case "userClaimed".toLowerCase():
                  claimCommand = "getClaimedItemsForUser"
                  break;
            }
            if(claimCommand != null && claimCommand != "")
            {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: true,
                  data: {
                     lib: "selfserv",
                     cmd: claimCommand,
                     userid: legacyContainer.scope.TP1Username,
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let returnData = JSON.parse(data.claimedItemsList);
                     initialClaimedItems.length = 0;
                     initialClaimedItems = returnData;
                     if (callback != null) {
                        callback(returnData);
                     }
                  }
               });
            }
         }
         /* Data Pulls END */
         /* Data Rendering START */
         function RenderClaimedItems(callback, listToRender) {
            if (listToRender == null) {
               listToRender = initialClaimedItems;
            }
            RenderClaimedItemsHeader();
            RenderClaimedItemsBody(function(){
               RenderFullUserProfileObjects();
            });
            RenderClaimedItemsFooter();
            
            if (callback != null) {
               callback();
            }
         }
         function RenderClaimedItemsHeader(callback) {
            $("#claimedItemsHeader", element).empty();

            let claimedItemsHeaderHolder = $(`<div class="claimed-items-display-header-holder" />`);
            let directiveHeaderLabel = "";
            switch (dataLoadType.toLowerCase()) {
               case "recentClaimed".toLowerCase():
                  directiveHeaderLabel = "Recent Claimed Items";
                  claimedItemsHeaderHolder.append(`<div class="claimed-items-list-header-row">`);
                  claimedItemsHeaderHolder.append(`<div class="claimed-items-list-item header-item user-name">User</div>`);
                  claimedItemsHeaderHolder.append(`<div class="claimed-items-list-item header-item item-name">Item</div>`);
                  claimedItemsHeaderHolder.append(`<div class="claimed-items-list-item header-item claim-value">Value</div>`);
                  claimedItemsHeaderHolder.append(`<div class="claimed-items-list-item header-item claim-date">Date</div>`);
                  break;
               case "mostClaimed".toLowerCase():
                  directiveHeaderLabel = "Most Claimed Items";
                  claimedItemsHeaderHolder.append(`<div class="claimed-items-list-header-row">`);
                  claimedItemsHeaderHolder.append(`<div class="claimed-items-list-item header-item item-name">Item</div>`);
                  claimedItemsHeaderHolder.append(`<div class="claimed-items-list-item header-item number-claimed"># Claimed</div>`);
                  claimedItemsHeaderHolder.append(`<div class="claimed-items-list-item header-item claim-value">Value</div>`);
                  break;
               case "userClaimed".toLowerCase():
                  directiveHeaderLabel = "User Claimed Items";
                  claimedItemsHeaderHolder.append(`<div class="claimed-items-list-item header-item item-name">Item</div>`);
                  claimedItemsHeaderHolder.append(`<div class="claimed-items-list-item header-item claim-date">Date</div>`);
                  claimedItemsHeaderHolder.append(`<div class="claimed-items-list-item header-item number-claimed"># Claimed</div>`);
                  claimedItemsHeaderHolder.append(`<div class="claimed-items-list-item header-item claim-value">Value</div>`);
                  claimedItemsHeaderHolder.append(`<div class="claimed-items-list-item header-item total-claim-value">Total Value</div>`);
                  break;
            }
            claimedItemsHeaderHolder.append(`</div>`);

            $("#claimedItemsHeader", element).append(claimedItemsHeaderHolder);

            $("#claimedItemsHeaderText", element).empty();
            $("#claimedItemsHeaderText", element).append(directiveHeaderLabel);

            if (callback != null) {
               callback();
            }
         }
         function RenderClaimedItemsBody(callback, listToRender) {
            if (listToRender == null) {
               listToRender = initialClaimedItems;
            }
            $("#claimedItemsList", element).empty();
            let claimedItemsBodyHolder = $(`<div class="claimed-items-display-body-holder" />`);

            if (listToRender == null || listToRender.length == 0) {
               let noRecordsMessage = "No claimed items records found.";
               let claimedItemsNoDataRowHolder = $(`<div class="claimed-items-list-item-row no-data-found" />`);

               switch (dataLoadType.toLowerCase()) {
                  case "recentClaimed".toLowerCase():
                     noRecordsMessage = "No recent claims found."
                     break;
                  case "mostClaimed".toLowerCase():
                     noRecordsMessage = "No most claimed items found."
                     break;
               }

               claimedItemsNoDataRowHolder.append(noRecordsMessage);
               claimedItemsBodyHolder.append(claimedItemsNoDataRowHolder);
            }
            else {
               let itemEachValue = 0;
               listToRender.forEach(function (dataItem) {
                  let rowHolder = $(`<div class="claimed-items-list-body-row" />`);
                  //claimedItemsBodyHolder.append(`<div class="claimed-items-list-body-row">`);
                  let itemValue = 0;
                  itemEachValue = dataItem.ItemEachValue || 0;
                  switch (dataLoadType.toLowerCase()) {
                     case "recentClaimed".toLowerCase():
                        itemValue = dataItem.DollarValue || 0;
                        rowHolder.append(`<div class="claimed-items-list-item user-name" id="userNameHolder_${dataItem.UserId}" replaceUserId="${dataItem.UserId}">${dataItem.UserId}</div>`);
                        rowHolder.append(`<div class="claimed-items-list-item item-name">${dataItem.ClaimedItemName}</div>`);
                        rowHolder.append(`<div class="claimed-items-list-item claim-value">${itemValue.toLocaleString("en-US", { style: "currency", currency: "USD",})}</div>`);
                        rowHolder.append(`<div class="claimed-items-list-item claim-date">${new Date(dataItem.ClaimedOnDate).toLocaleDateString()}</div>`);
                        break;
                     case "mostClaimed".toLowerCase():                        
                        itemValue = dataItem.ItemTotalValue || 0;
                        rowHolder.append(`<div class="claimed-items-list-item item-name">${dataItem.ItemName}</div>`);
                        rowHolder.append(`<div class="claimed-items-list-item number-claimed">${dataItem.TotalClaimed}</div>`);
                        rowHolder.append(`<div class="claimed-items-list-item claim-value">${itemValue.toLocaleString("en-US", { style: "currency", currency: "USD",})}</div>`);
                        break;
                     case "userClaimed".toLowerCase():
                        itemValue = dataItem.DollarValue || 0;
                        rowHolder.append(`<div class="claimed-items-list-item item-name">${dataItem.ClaimedItemName}</div>`);
                        rowHolder.append(`<div class="claimed-items-list-item claim-date">${new Date(dataItem.ClaimedOnDate).toLocaleDateString()}</div>`);                        
                        rowHolder.append(`<div class="claimed-items-list-item number-claimed">${dataItem.ClaimedQuantity}</div>`);
                        rowHolder.append(`<div class="claimed-items-list-item claim-value">${itemValue.toLocaleString("en-US", { style: "currency", currency: "USD",})}</div>`);
                        rowHolder.append(`<div class="claimed-items-list-item claim-value">${(itemValue * dataItem.ClaimedQuantity).toLocaleString("en-US", { style: "currency", currency: "USD",})}</div>`);
                        break;
                  }
                  claimedItemsBodyHolder.append(rowHolder);
               });
            }
            $("#claimedItemsList", element).append(claimedItemsBodyHolder);

            if (callback != null) {
               callback();
            }
         }
         function RenderClaimedItemsFooter(callback) {
            $("#claimedItemsFooter", element).empty();
            $("#claimedItemsFooter", element).append("&nbsp;");

            if (callback != null) {
               callback();
            }
         }
         /* Data Rendering END */
         /* Editor Loading START */
         /* Editor Loading END */
         /* Editor Validation & Saving START */
         /* Editor Validation & Saving END */
         /* Sorting Options START */
         /* Sorting Options END */
         /* Utility Functions START */
         function GetUserProfileObject(userId) {
            let userObject = userRewardsReferenceObjects.UserProfiles.find(i => i.UserId == userId);
            return userObject;
         }
         function RenderFullUserProfileObjects()
         {
            $("[id^='userNameHolder_']", element).each(function(){
               let userId = $(this).attr("replaceUserId");
               
               if(userId != null && userId != "")
               {
                  let avatarImageName = defaultAvatarFile;
                  let userDisplayName = userId;
                  let userObject = GetUserProfileObject(userId);
                  if (userObject != null) {
                     userDisplayName = userObject.UserFullName;
                     avatarImageName = userObject.AvatarImageFileName;
                     if (avatarImageName != "empty_headshot.png") {
                        avatarImageName = Global_CleanAvatarUrl(userObject.AvatarImageFileName);
                     }
                     else if (avatarImageName == "empty_headshot.png") {
                        avatarImageName = defaultAvatarFile;
                     }
                  }
                  let avatarImage = $(`<img src="${avatarImageName}" alt="${userDisplayName} Avatar" class="small-line-avatar-image" />`);
                  $(this).empty();
                  $(this).append(avatarImage);
                  $(this).append("&nbsp;");
                  $(this).append(userDisplayName);
               }
            });
         }
         function ProcessClaimSignal(signalObject)
         {
            console.log("ProcessClaimSignal()");
            if(signalObject.route != null && signalObject.route.toLowerCase() == "irpasClaim".toLowerCase())
            {
               console.log("IRPAS Claim processing.");
               initialClaimedItems.length = 0;
               ko.postbox.publish("IRPASManagementReload", true);
            }
         }
         /* Utility Functions END */
         /* Show/Hide START */
         function HideAll() {
            HideLoadingMessage();
         }
         function ShowLoadingMessage() {
            $("#claimedItemsLoadingMessage", element).show();
         }
         function HideLoadingMessage() {
            $("#claimedItemsLoadingMessage", element).hide();
         }
         /* Show/Hide END */
         scope.load = function () {
            scope.Initialize();
            LoadDirective();
         };
         //scope.load();

         ko.postbox.subscribe("IRPASManagementInit", function () {
            scope.Initialize();
         });
         ko.postbox.subscribe("IRPASManagementLoad", function () {
            LoadDirective();
            //scope.load();
         });
         ko.postbox.subscribe("IRPASManagementReload", function (forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }
            LoadClaimedItems(null, forceReload);
         });
         ko.postbox.subscribe("IRPAS_AvailableUserProfileLoaded", function(IrpasReferenceObject){
            userRewardsReferenceObjects.UserProfiles.length = 0;
            userRewardsReferenceObjects.UserProfiles =  IrpasReferenceObject.AvailableUserProfiles.data;
            RenderFullUserProfileObjects();
         });
         // ko.postbox.subscribe("IRPASUserClaimedItemComplete", function(claimedObject){
         //    alert("Claimed Item Complete Loading...");
         //    initialClaimedItems.length = 0;
         //    LoadClaimedItems(null, true);
         //    //ko.postbox.publish("AcuityNotifierHandle", {notifyType:"irpasClaimedItem", objectData: claimedObject});
         // });
         ko.postbox.subscribe("Signal", function (so) {            
            ProcessClaimSignal(so);
         });
      }
   };
}]);