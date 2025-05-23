angularApp.directive("ngUserRedeemedPrizes", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/PrizeCatalog/view/UserRedeemedPrizes.htm?' + Date.now(),
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
         /* Test Data START */
         let userRedeemedItems = [];
         let masterCatalogItems = [];

         /* Test Data END */
         HideAll();
         /* Event Handling START */
         $(`input[name="userEarnedDisplay_DisplayType"]`,element).off("change").on("change", function(){
            RenderUserRedeemedItems();
         });
         /* Event Handling END */
         scope.Initialize = function () {
            HideAll();
            // LoadActionOptions();
            // LoadDisplayOptions();
            // WriteSelectedUserCount();
         };

         /* Data Loading START */
         function LoadDirective() {
            LoadRedeemedPrizes();
         }
         function LoadRedeemedPrizes(callback, userId, forceReload) {
            if (userId == null) {
               userId = legacyContainer.scope.TP1Username;
            }
            if (forceReload == null) {
               forceReload = true;
            }
            GetUserRedeemedItems(function (userRedeemedList) {
               RenderUserRedeemedItems(callback, userRedeemedList);
            }, userId, forceReload);
         }
         /* Data Loading END */
         /* Data Pulls START */
         function GetUserRedeemedItems(callback, userId, forceReload) {
            if(userId == null)
            {
               userId == legacyContainer.scope.TP1Username;
            }
            if (forceReload == null) {
               forceReload = false;
            }
            if (userRedeemedItems == null || userRedeemedItems.length == 0 || forceReload == true) {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "flex",
                     cmd: "getVirtualPrizeUserRedemptionsByUserId",
                     userid: userId,
                     deepLoad: true
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let returnData = JSON.parse(data.virtualPrizeUserRedemptionList);
                     userRedeemedItems = returnData;
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
         function RenderUserRedeemedItems(callback, listToRender) {
            if (listToRender == null) {
               listToRender = userRedeemedItems;
            }
            $("#userPrizeRedeemedList").empty();
            let userRedeemedItemsListHolder = $(`<div class="user-prize-redeeemed-list-holder" />`);
            if (listToRender != null && listToRender.length > 0) {
               displayType = $(`input[name="userEarnedDisplay_DisplayType"]:checked`).val() || "grid";

               listToRender.forEach(function (redeemedItem) {
                  let redeemedItemHolder = $(`<div class="user-prize-redeemed-item-holder ${displayType}-item-holder ${displayType}" id="redeemedItemHolder_${redeemedItem.VirtualPrizeUserRedemptionId}" />`);
                  let redeemedItemImageHolder = $(`<div class="user-prize-redeemed-item-image-holder" id="redeemedItemImageHolder_${redeemedItem.VirtualPrizeUserRedemptionId}" />`);
                  let redeemedItemNameHolder = $(`<div class="user-prize-redeemed-item-name-holder" id="redeemedItemNameHolder_${redeemedItem.VirtualPrizeUserRedemptionId}" />`);
                  let redeemedItemDateHolder = $(`<div class="user-prize-redeemed-item-date-holder" id="redeemedItemDateHolder_${redeemedItem.VirtualPrizeUserRedemptionId}" />`);

                  let itemImageUrl = "./images/default.png";
                  let itemThumbnailImageUrl = "./images/default-thumbnail.png"
                  let itemName = redeemedItem.VirtualPrizeUserRedemptionId;
                  if (redeemedItem.VirtualPrizeItemIdSource != null) {
                     itemName = redeemedItem.VirtualPrizeItemIdSource.Name;
                     itemImageUrl = redeemedItem.VirtualPrizeItemIdSource.ImageUrl;
                     itemThumbnailImageUrl = redeemedItem.VirtualPrizeItemIdSource.ThumbnailUrl;
                     if (displayType != "slider") {
                        itemImageUrl = itemThumbnailImageUrl || redeemedItem.VirtualPrizeItemIdSource.ImageUrl;
                     }
                  }
                  let redeemedOnDate = new Date(redeemedItem.RedeemedOnDate).toLocaleDateString();

                  let itemImage = $(`<img src="${itemImageUrl}" id="redeemedItemImage_${redeemedItem.VirtualPrizeUserRedemptionId}" class="user-prize-redeemed-item-image" />`);
                  let itemNameLabel = $(`<div class="user-prize-redeemed-item-name" id="redeemedItemName_${redeemedItem.VirtualPrizeUserRedemptionId}" />`);
                  itemNameLabel.append(itemName);
                  let redeemedOnDateLabel = $(`<div class="user-prize-redeemed-item-date" id="redeemedItemRedeemedOnDate_${redeemedItem.VirtualPrizeUserRedemptionId}" />`);
                  redeemedOnDateLabel.append(redeemedOnDate);
                  redeemedItemImageHolder.append(itemImage);
                  redeemedItemNameHolder.append(itemNameLabel);
                  redeemedItemDateHolder.append(redeemedOnDateLabel);

                  redeemedItemHolder.append(redeemedItemImageHolder);
                  redeemedItemHolder.append(redeemedItemNameHolder);
               redeemedItemHolder.append(redeemedItemDateHolder);

                  userRedeemedItemsListHolder.append(redeemedItemHolder);
               });
            }
            else {
               userRedeemedItemsListHolder.append("No Redeemed Prizes found for user.");
            }
            $("#userPrizeRedeemedList").append(userRedeemedItemsListHolder);

            if (callback != null) {
               callback(userDataToRender);
            }
         }

         /* Data Rendering END */
         /* Show/Hide START */
         function HideAll() {
            //console.info("User Redeemed Prizes: HideAll()");
         }

         /* Show/Hide END */

         scope.load = function (forceInitalize) {
            if (forceInitalize == null) {
               forceInitalize = false;
            }
            if (forceInitalize == true) {
               scope.Initialize();
            }
            LoadDirective();
            ko.postbox.publish("userPrizeWidgetLoadComplete");
         };

         ko.postbox.subscribe("userRedeemedPrizesLoad", function (forceLoad) {
            scope.load(forceLoad);
            ko.postbox.publish("userPrizeWidgetLoadComplete");
         });
         ko.postbox.subscribe("userRedeemedPrizesReload", function () {            
            LoadRedeemedPrizes(null, legacyContainer.scope.TP1Username, true);
            ko.postbox.publish("userPrizeWidgetLoadComplete");
         });
      }
   };
}]);