angularApp.directive("ngUserPointsLedger", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/PRIZES1/view/UserPointsLedger.htm?' + Date.now(),
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
         // var defaultAvatarUrl = window.location.protocol + "//" + window.location.hostname + "/jq/avatars/empty_headshot.png";
         var allUserPoints = [];
         var userTotalPoints = -1;

         scope.Initialize = function () {
            GetTotalPointsForUser();
            LoadUserPoints(function(){
               RenderUserPoints();
            });
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
                  WriteUserTotalPoints(userTotalPoints);
                  if(callback != null)
                  {
                     callback(userTotalPoints);
                  }                  
                  return userTotalPoints;
               }
            });
         }
         function LoadUserPoints(callback)
         {
            a$.ajax({
               type: "GET",
               service: "C#",
               async: true,
               data: {
                  lib:"selfserve",
                  cmd: "getPointsForUser",
                  userid: legacyContainer.scope.TP1Username,
                  deepLoad: true
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function(jsonData){
                  let returnData = null;
                  allUserPoints.length = 0;
                  if(jsonData.userPointsList != null)
                  {
                     returnData = JSON.parse(jsonData.userPointsList);
                     allUserPoints = returnData;
                  }
                  if(callback != null)
                  {
                     callback(returnData);
                  }
                  return;
               }
            });
         }
         function RenderUserPoints(arrayToRender, callback)
         {
            $("#userPointsListHolder", element).empty();
            let userPointsHolderObject = $("<div class=\"all-user-points-item-listing-holder\" />");
            if(arrayToRender == null)
            {
               arrayToRender = allUserPoints;
            }
            $("#userLedger_UserPointsCount", element).text(arrayToRender.length);

            for(let upc = 0; upc < arrayToRender.length; upc++)
            {
               RenderUserPointsItem(arrayToRender[upc], userPointsHolderObject);
            }

            $("#userPointsListHolder", element).append(userPointsHolderObject);

            if(callback != null)
            {
               callback();
            }
         }
         function RenderUserPointsItem(itemToRender, objectToRenderTo, callback)
         {
            let userPointsLineItemHolder = $("<div class=\"user-points-line-item\" />");
            
            let userPointsDateHolder = $("<div class=\"user-points-item-holder user-points-date\" />");
            let userPointsAwardByHolder = $("<div class=\"user-points-item-holder user-points-award-by\" />");
            let userPointsPointsAwarded = $("<div class=\"user-points-item-holder user-points-awarded-points\" />");
            let userPointsAwardReasonHolder = $("<div class=\"user-points-item-holder user-points-award-reason\" />");

            userPointsPointsAwarded.append(itemToRender.PointsValue);

            let userPointsDate = new Date(itemToRender.PointsValueDate).toLocaleDateString();
            userPointsDateHolder.append(userPointsDate);

            let awardedBy = itemToRender.AwardBy;
            
            if(itemToRender.AwardedBySource != null)
            {
               awardedBy = itemToRender.AwardedBySource.UserFullName;
            }
            userPointsAwardByHolder.append(awardedBy);


            let awardReasonText = "Awarded Points";
            if(itemToRender.PointsValue < 0)
            {
               userPointsPointsAwarded.addClass("red-ledger");
               userPointsAwardReasonHolder.addClass("red-ledger");
               awardReasonText = "Redemption";               
               if(itemToRender.PrizeOptionIdSource != null)
               {
                  awardReasonText += ": " + itemToRender.PrizeOptionIdSource.PrizeOptionName;
               }
            }
            else
            {
               if(itemToRender.FlexGameId != null)
               {
                  awardReasonText = "Flex Game Award";
                  if(itemToRender.FlexGameIdSource != null)
                  {
                     awardReasonText += ": " + itemToRender.FlexGameIdSource.Name;
                  }
               }
               if(itemToRender.BadgeId != null)
               {
                  awardReasonText = "Badge Earned"
                  if(itemToRender.BadgeIdSource != null)
                  {
                     awardReasonText += ": " + itemToRender.BadgeIdSource.BadgeName;
                  }
               }

            }
            userPointsAwardReasonHolder.append(awardReasonText);

            userPointsLineItemHolder.append(userPointsDateHolder);
            userPointsLineItemHolder.append(userPointsAwardByHolder);
            userPointsLineItemHolder.append(userPointsAwardReasonHolder);
            userPointsLineItemHolder.append(userPointsPointsAwarded);
            
            $(objectToRenderTo).append(userPointsLineItemHolder);

            if(callback != null)
            {
               callback();
            }
         }
         function WriteUserTotalPoints(value)
         {
            $("#userLedger_TotalPointsAvailable", element).empty();
            $("#userLedger_TotalPointsAvailable", element).text(value);
         }
         function TogglePointsActivityButton()
         {
            let button = $("#btnUserPointsHistory", element);
            let buttonText = button?.text();

            if($(".user-points_container", element).hasClass("active"))
            {
               buttonText = "Hide Credits Activity";
            }
            else
            {
               buttonText = "View Credits Activity";
            }

            if(button != null && button.hasClass("active"))
            {
               button.removeClass("active");
            }
            else
            {
               button.addClass("active");
            }
            button?.text(buttonText);
         }
         function ToggleLedger()
         {
            let isVisible = $(".user-points_container", element).hasClass("active");
            if(isVisible == true)
            {
               HidePointsLedger();
            }
            else
            {
               ShowPointsLedger();
            }
            TogglePointsActivityButton();
         }
         function ShowPointsLedger()
         {
            $(".user-points_container", element).addClass("active");
         }
         function HidePointsLedger()
         {
            $(".user-points_container", element).removeClass("active");
         }

         scope.load = function () {
            scope.Initialize();

            $(".user-points_historybtn", element).off("click").on("click", function(){            
               ToggleLedger();
            });
         };

         scope.load();

         ko.postbox.subscribe("UserPointsLedgerLoad", function(){
            scope.load();
         });
         ko.postbox.subscribe("UserPointsLedgerRefresh", function(){
            scope.load();
         });
      }
   };

   
}]);