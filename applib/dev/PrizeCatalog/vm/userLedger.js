angularApp.directive("ngUserLedger", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/PrizeCatalog/view/UserLedger.htm?' + Date.now(),
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
         let loggedUserData = [];
         let possibleCreditTypes = [];
         /* Event Handling START */
         /* Event Handling END */
         scope.Initialize = function () {
            HideAll();
            LoadPossibleCreditTypes();
            // LoadDisplayOptions();
            // WriteSelectedUserCount();
         };

         /* Data Loading START */
         function LoadDirective()
         {
            HideAll();
            LoadLedger()
         }
         function LoadPossibleCreditTypes()
         {
            GetPossibleCreditTypes();
         }
         function LoadLedger(callback, forceReload)
         {
            GetUserPrizeLedger(function(userLedgerInfoData) {
               RenderUserPrizeLedger(null, userLedgerInfoData);
            }, legacyContainer.scope.TP1Username, forceReload);
         }
         /* Data Loading END */
         /* Data Pulls START */
         function GetPossibleCreditTypes(callback, forceReload)
         {
            if(forceReload == null)
            {
               forceReload = false;
            }
            if(forceReload == true || possibleCreditTypes == null || possibleCreditTypes.length == 0)
            {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: true,
                  data: {
                     lib: "flex",
                     cmd: "getAllUserCreditsForTypes"
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let returnData = JSON.parse(data.userCreditsForTypeList);
                     possibleCreditTypes = returnData;
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
         function GetUserPrizeLedger(callback, userId, forceReload)
         {
            if(forceReload == null)
            {
               forceReload = false;
            }

            if(userId == null)
            {
               userId = legacyContainer.scope.TP1Username;
            }
            if(forceReload == true || loggedUserData == null || loggedUserData.length == 0)
            {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "flex",
                     cmd: "getVirtualPrizeUserLedgerByUserId",
                     userid: userId,
                     deepLoad: true
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let returnData = JSON.parse(data.virtualPrizeUserLedgerList);
                     loggedUserData = returnData;
                     if (callback != null) {
                        callback(returnData);
                     }
                     else {
                        return returnData;
                     }
                  }
               });
            }
            else
            {
               if (callback != null) {
                  callback(loggedUserData);
               }
               else {
                  return loggedUserData;
               }
            }
         }
         /* Data Pulls END */
         /* Data Rendering START */
         function RenderUserPrizeLedger(callback, userDataToRender){
            console.log("RenderUserPrizeLedger()");
            if(userDataToRender == null)
            {
               userDataToRender = loggedUserData;
            }
            $("#userPrizeLedgerList").empty();
            let userPrizeLedgerListHolder = $(`<div class="user-prize-ledger-list-holder" />`);
            let userCurrentTotalPoints = 0;
            let userTotalBasePointsEarned = 0;


            if(userDataToRender != null && userDataToRender.length > 0)
            {
               userDataToRender.forEach(function(ledgerItem){
                  let userPrizeLedgerRow = $(`<div class="user-prize-ledger-list-row" id="userPrizeLedgerRow_${ledgerItem.VirtualPrizeUserLedgerId}" />`);
                  let dateEarnedHolder = $(`<div class="user-prize-ledger-item date-earned" id="userPrizeLedgerDateEarned_${ledgerItem.VirtualPrizeUserLedgerId}" />`);
                  let earnedTypeHolder = $(`<div class="user-prize-ledger-item earned-type" id="userPrizeLedgerEarnedType${ledgerItem.VirtualPrizeUserLedgerId}" />`);
                  let pointsEarnedHolder = $(`<div class="user-prize-ledger-item points-earned" id="userPrizeLedgerPointsEarned_${ledgerItem.VirtualPrizeUserLedgerId}" />`);
                  let pointsMultiplierHolder = $(`<div class="user-prize-ledger-item points-multiplier" id="userPrizeLedgerPointsEarned_${ledgerItem.VirtualPrizeUserLedgerId}" />`);
                  let totalPointsEarnedHolder = $(`<div class="user-prize-ledger-item total-points-earned" id="userPrizeLedgerPointsEarned_${ledgerItem.VirtualPrizeUserLedgerId}" />`);

                  let prizeDate = "";
                  let earnedTypeText = "wwwww";
                  let pointsEarnedValue = 0;
                  let pointsMultiplierValue = "x1";
                  let totalPointsEarnedValue = 0;
                  let isExpenseType = false;

                  prizeDate = new Date(ledgerItem.UserEarnedCreditsDate).toLocaleDateString();
                  earnedTypeText = ledgerItem.UserCreditsForTypeId;
                  let earnedTypeObject = ledgerItem.UserCreditsForTypeIdSource;
                  if(ledgerItem.UserCreditsForTypeIdSource != null)
                  {
                     earnedTypeObject = ledgerItem.UserCreditsForTypeIdSource;
                  }
                  else
                  {
                     earnedTypeObject = possibleCreditTypes.find(i => i.UserCreditsForTypeId == ledgerItem.UserCreditsForTypeId);
                  }

                  if(earnedTypeObject != null)
                  {
                     earnedTypeText = earnedTypeObject.UserCreditsForTypeName;
                     isExpenseType = earnedTypeObject.IsExpenseType;
                  }
                  pointsEarnedValue = ledgerItem.UserCreditsValue;
                  if(isExpenseType)
                  {
                     pointsEarnedValue = -pointsEarnedValue;
                  }

                  pointsMultiplierValue = `x${ledgerItem.UserCreditsMultiplier}`;
                  totalPointsEarnedValue = (pointsEarnedValue * ledgerItem.UserCreditsMultiplier);

                  userTotalBasePointsEarned += pointsEarnedValue;
                  userCurrentTotalPoints += totalPointsEarnedValue;

                  dateEarnedHolder.append(prizeDate);
                  earnedTypeHolder.append(earnedTypeText);
                  pointsEarnedHolder.append(pointsEarnedValue);
                  pointsMultiplierHolder.append(pointsMultiplierValue);
                  totalPointsEarnedHolder.append(totalPointsEarnedValue);

                  userPrizeLedgerRow.append(dateEarnedHolder);
                  userPrizeLedgerRow.append(earnedTypeHolder);
                  userPrizeLedgerRow.append(pointsEarnedHolder);
                  userPrizeLedgerRow.append(pointsMultiplierHolder);
                  userPrizeLedgerRow.append(totalPointsEarnedHolder);

                  userPrizeLedgerListHolder.append(userPrizeLedgerRow);
               });
            }            
            else
            {
               let noInformationFoundHolder = $(`<div class="no-user-ledger-info no-records-holder" />`);
               noInformationFoundHolder.append(`No Prize Ledger information found.`);

               userPrizeLedgerListHolder.append(noInformationFoundHolder);
            }
            $("#userPrizeLedgerList").append(userPrizeLedgerListHolder);
            RenderCurrentUserPointsInformation(userCurrentTotalPoints, userTotalBasePointsEarned)
            if(callback != null)
            {
               callback(userDataToRender);
            }
         }

         function RenderCurrentUserPointsInformation(totalPoints, baseTotalPoints)
         {
            let userPrizeLedgerRow = $(`<div class="user-prize-ledger-list-row totals-row" id="userPrizeLedgerTotalsRow_-1" />`);
            let dateEarnedHolder = $(`<div class="user-prize-ledger-item date-earned" id="userPrizeLedgerDateEarned_-1" />`);
            let earnedTypeHolder = $(`<div class="user-prize-ledger-item earned-type" id="userPrizeLedgerEarnedType_-1" />`);
            let pointsEarnedHolder = $(`<div class="user-prize-ledger-item points-earned" id="userPrizeLedgerPointsEarned_-1" />`);
            let pointsMultiplierHolder = $(`<div class="user-prize-ledger-item points-multiplier" id="userPrizeLedgerPointsEarned_-1" />`);
            let totalPointsEarnedHolder = $(`<div class="user-prize-ledger-item total-points-earned" id="userPrizeLedgerPointsEarned_-1" />`);

            dateEarnedHolder.append("Totals");
            earnedTypeHolder.append("&nbsp;");
            pointsEarnedHolder.append(baseTotalPoints);
            pointsMultiplierHolder.append("&nbsp;");
            totalPointsEarnedHolder.append(totalPoints);

            userPrizeLedgerRow.append(dateEarnedHolder);
            userPrizeLedgerRow.append(earnedTypeHolder);
            userPrizeLedgerRow.append(pointsEarnedHolder);
            userPrizeLedgerRow.append(pointsMultiplierHolder);
            userPrizeLedgerRow.append(totalPointsEarnedHolder);

            $("#userPrizeLedgerTotal").empty();
            $("#userPrizeLedgerTotal").append(userPrizeLedgerRow);
         }
         /* Data Rendering END */
         /* Show/Hide START */
         function HideAll()
         {
            console.info("User Ledger: HideAll()");
         }
         /* Show/Hide END */
         
         scope.load = function (forceInitalize) {
            if(forceInitalize == null)
            {
               forceInitalize = false;
            }
            if(forceInitalize == true)
            {
               scope.Initialize();
            }
            LoadDirective();
            ko.postbox.publish("userPrizeWidgetLoadComplete");
         };

         ko.postbox.subscribe("userPrizesRedeemedLedgerLoad", function (forceLoad) {
            scope.load(forceLoad);
            ko.postbox.publish("userPrizeWidgetLoadComplete");
         });         
         ko.postbox.subscribe("userPrizesRedeemedLedgerReload", function () {            
            LoadLedger(null, true);
            ko.postbox.publish("userPrizeWidgetLoadComplete");
         });
      }
   };
}]);