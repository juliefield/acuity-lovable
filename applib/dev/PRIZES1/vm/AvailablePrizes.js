angularApp.directive("ngAvailablePrizes", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/PRIZES1/view/AvailablePrizes.htm?' + Date.now(),
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
         var possiblePrizeOptions = [];
         var clientUploadedImageKey = "/UPLOADS/";//TODO: Change to a config parameter
         var userTotalPoints = -1;

         scope.Initialize = function () {
            HideConfirmationBox();
            
         };

         function GetTotalPointsForUser(callback)
         {
            a$.ajax({
               type: "GET",
               service: "C#",
               async: false,
               data: {
                  lib:"selfserve",
                  cmd: "getTotalPointsForUser",
                  userid: legacyContainer.scope.TP1Username
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function(jsonData){                  
                  userTotalPoints = parseFloat(jsonData.userTotalPoints);                  
                  if(callback != null)
                  {
                     callback(userTotalPoints);
                  }                  
                  return userTotalPoints;
               }
            });
         }
         function LoadAllPossiblePrizes(callback)
         {
            let includeGlobalOptions = false; //TODO: Set to a config parameter or some other manner?

            a$.ajax({
               type: "GET",
               service: "C#",
               async: true,
               data: {
                  lib:"selfserve",
                  cmd: "getPrizeOptionsList",
                  includeinactive:false,
                  includeglobaloptions: includeGlobalOptions
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function(jsonData){
                  let returnData = null;
                  possiblePrizeOptions.length = 0;
                  if(jsonData.prizeOptionsList != null)
                  {
                     returnData = JSON.parse(jsonData.prizeOptionsList);
                     possiblePrizeOptions = returnData;
                  }
                  if(callback != null)
                  {
                     callback(returnData);
                  }
                  return;
               }
            });
         }
         function RenderAllPossiblePrizes(listToRender, callback)
         {
            GetTotalPointsForUser();
            if(listToRender == null)
            {
               listToRender = possiblePrizeOptions;
            }
            listToRender = listToRender.filter(i => i.PointsValue > 0);

            let possiblePrizeHolder = $("<div class=\"possible-prize-holder\" />");

            for(let pc = 0; pc < listToRender.length; pc++)
            {
               let prizeItem = listToRender[pc];

               RenderPossiblePrizeItem(prizeItem, possiblePrizeHolder);
            }
         
            $("#possiblePrizeOptionsHolder", element).empty();
            $("#possiblePrizeOptionsHolder", element).append(possiblePrizeHolder);

            if(callback != null)
            {
               callback();
            }
            return;
         }
         function RenderPossiblePrizeItem(itemToRender, objectToRenderTo, callback)
         {
            if(itemToRender != null)
            {
               let prizeItemHolder = $("<div class=\"available-prize-item-holder\" />");
               
               let userCanPurchase = (parseFloat(itemToRender.PointsValue) <= parseFloat(userTotalPoints));               
               let prizeItemImageHolder = $("<div class=\"available-prize-item-image-holder\" />");
               let prizeItemImage = $("<img class=\"available-prize-item-image\" />");
               let prizeImageUrl = itemToRender.PrizeImageUrl;
               let prizeImageSource = GetImageUrl(prizeImageUrl);               
               prizeItemImage.prop("src", prizeImageSource);
               prizeItemImage.height(75);

               if(itemToRender.PrizeOptionDesc != null && itemToRender.PrizeOptionDesc != "")
               {
                  prizeItemImage.attr("title", itemToRender.PrizeOptionDesc);
               }

               let prizeItemNameHolder = $("<div class=\"available-prize-item-name-holder\" />");
               prizeItemNameHolder.append(itemToRender.PrizeOptionName);
               // let prizeItemDescHolder = $("<div class=\"available-prize-item-desc-holder\" />");
               // prizeItemDescHolder.append(itemToRender.PrizeOptionDesc);

               let prizeItemCostHolder = $("<div class=\"available-prize-item-cost-holder\" />");
               let prizeCostHolder = $("<span class=\"prize-item-cost-label\" />");
               prizeCostHolder.append(itemToRender.PointsValue + " Credits");
               let prizeItemMoneyValueHolder = $("<div class=\"prize-item-money-value-holder\" />");
               let prizeMoneyValueHolder = $("<span class=\"prize-item-money-value-label\" />");
               if(itemToRender.MonetaryValue != null)
               {
                  prizeMoneyValueHolder.append("Value: " + itemToRender.MonetaryValue.toLocaleString("en-US", { style: "currency", currency: "USD" }));
               }
               
               prizeItemCostHolder.append(prizeCostHolder);

               prizeItemMoneyValueHolder.append(prizeMoneyValueHolder);

               let prizeItemButtonHolder = $("<div class=\"available-prize-item-button-holder\" />");
               let redeemPrizeButton = $("<button id=\"RedeemPrize_" + itemToRender.PrizeOptionId + "\" class=\"btn button btn-redeem-prize\" />");
               redeemPrizeButton.text("Redeem");

               redeemPrizeButton.off("click").on("click", function(){
                  let buttonId = this.id;
                  let id = buttonId.split("_")[1];
                  LoadPrizeConfirmation(id, function(){
                     ShowConfirmationBox();
                  });                  
               });
               if(userCanPurchase == true)
               {
                  prizeItemButtonHolder.append(redeemPrizeButton);
               }
               else
               {
                  prizeItemButtonHolder.append("<span class=\"lack-of-points\">Earn more points.</span>");
                  prizeItemHolder.addClass("lack-of-points");
               }

               prizeItemImageHolder.append(prizeItemImage);

               prizeItemHolder.append(prizeItemImageHolder);
               prizeItemHolder.append(prizeItemNameHolder);
               prizeItemHolder.append(prizeItemCostHolder);
               prizeItemHolder.append(prizeItemMoneyValueHolder);
               prizeItemHolder.append(prizeItemButtonHolder);

               
               $(objectToRenderTo).append(prizeItemHolder);   
            }
            if(callback != null)
            {
               callback();
            }
            return;
         }
         function LoadPrizeConfirmation(id, callback)
         {
            $("#confirmPrize_PrizePointCost", element).val(0);
            $("#confirmPrize_PrizePointCostLabel", element).text("");            
            $("#confirmPrize_PrizeImage", element).prop("src", defaultPrizeUrl);
            $("#confirmPrize_PrizeName", element).text("");
            $("#confirmPrize_PrizeDesc", element).text("");
            $("#confirmPrize_PrizeOptionId", element).val(-1);

            let prizeItem = possiblePrizeOptions.find(prize => prize.PrizeOptionId == id);
            if(prizeItem != null)
            {
               $("#confirmPrize_PrizePointCost", element).val(prizeItem.PointsValue);
               $("#confirmPrize_PrizePointCostLabel", element).text(prizeItem.PointsValue);
               let imageUrlSource = GetImageUrl(prizeItem.PrizeImageUrl);
               $("#confirmPrize_PrizeImage", element).prop("src", imageUrlSource);
               $("#confirmPrize_PrizeName", element).text(prizeItem.PrizeOptionName);
               if(prizeItem.PrizeOptionDesc != null)
               {
                  $("#confirmPrize_PrizeDesc", element).text(prizeItem.PrizeOptionDesc);
               }
               $("#confirmPrize_PrizeOptionId", element).val(id);      
            }

            if(callback != null)
            {
               callback();
            }
         }
         
         function GetImageUrl(currentValue)
         {
            let returnUrl = defaultPrizeUrl;

            if(currentValue.toUpperCase().includes(clientUploadedImageKey.toUpperCase()))
            {
               returnUrl = baseClientPrizeUrl + currentValue;
            }
            else
            {
               returnUrl = basePrizeUrl + currentValue;
            }

            return returnUrl;
         }

         function SavePrizeConfirmation(callback)
         {
            let prizeOptionId = $("#confirmPrize_PrizeOptionId", element).val();
            let pointsValue = $("#confirmPrize_PrizePointCost", element).val();
            let userPointsObject = new Object();
            userPointsObject.UserPointsId = -1;
            userPointsObject.UserId = legacyContainer.scope.TP1Username;
            userPointsObject.PointsValue = -1 * parseFloat(pointsValue);
            userPointsObject.PointsValueDate = new Date();
            userPointsObject.AwardedBy = legacyContainer.scope.TP1Username;
            userPointsObject.PrizeOptionId = parseInt(prizeOptionId);
            userPointsObject.EntDt = new Date();
            userPointsObject.EntBy = legacyContainer.scope.TP1Username;

            a$.ajax({
               type: "GET",
               service: "C#",
               async: true,
               data: {
                  lib:"selfserve",
                  cmd: "assignPointsToUser",
                  pointsData: JSON.stringify(userPointsObject)
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function(jsonData){
                  //TODO: Should we have some sort of "refresh" function that we can just call?
                  ko.postbox.publish("UserPointsLedgerRefresh");
                  ko.postbox.publish("FulfillmentManagerRefresh");
                  ko.postbox.publish("AvailablePrizesRefresh");
                  //ko.postbox.publish("AvailablePrizesRefresh");

                  if(callback != null)
                  {
                     callback();
                  }
                  return;
               }
            });
         }

         function HideConfirmationBox()
         {
            $("#PointsSpendConfirmationHolder", element).hide();
         }
         function ShowConfirmationBox()
         {
            $("#PointsSpendConfirmationHolder", element).show();
         }

         scope.load = function () {
            scope.Initialize();
            
            LoadAllPossiblePrizes(function(prizeList){
               RenderAllPossiblePrizes(prizeList);
            });
            $("#btnConfirmPrizeRedeem", element).off("click").on("click", function(){
               SavePrizeConfirmation(function(){
                  HideConfirmationBox();
               });
               
            });
            $(".btn-redeem-confirmation-close", element).off("click").on("click", function(){
               console.log("Handle close options here.");
               HideConfirmationBox();
            });
         };
         scope.load();

         ko.postbox.subscribe("AvailablePrizesLoad", function(){
            scope.load();
         });
         ko.postbox.subscribe("AvailablePrizesRefresh", function(){
            scope.load();
         });
      }
   };
}]);