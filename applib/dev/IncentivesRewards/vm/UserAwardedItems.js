angularApp.directive("ngUserAwardedItems", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/IncentivesRewards/view/UserAwardedItems.htm?' + Date.now(),
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
         let userPointsRewardsData = [];
         let availableReferenceOptions = {
            availableRewardOptions: [],
            availableIrpasAreas: [],
            avaialbleIrpasSubareas: [],
            availableIntervalTypes: [],
         };
         /* Event Handling START */
         $("#btnUserAwardedPointsRefresh", element).off("click").on("click", function () {
            console.info("Refreshing data.");
            LoadCurrentUserAwardedItems(null, true);
         });
         /* Event Handling END */
         scope.Initialize = function () {
            HideAll();
            LoadOptionsLists();
         };
         function SetDatePickers() {
         }
         /* Data Loading START */
         function LoadDirective() {
            HideAll();
            LoadCurrentUserAwardedItems();
         }
         function LoadOptionsLists() {
            GetAvailableIrpasAreas();
            GetAvailableIrpasSubAreas();
            GetAvailableIrpasIntervals();
            GetAvailableRewardOptions();
         }
         /* Data Loading END */
         function LoadCurrentUserAwardedItems(callback, forceReload) {
            GetCurrentUserAwardedItems(function (currentUserRewardList) {
               RenderCurrentUserAwardedItems(function () {
                  if (callback != null) {
                     callback();
                  }
               }, currentUserRewardList);
            }, forceReload);
         }
         /* Data Pulls START */
         function GetCurrentUserAwardedItems(callback, forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (userPointsRewardsData != null && userPointsRewardsData.length > 0 && forceReload == false) {
               if (callback != null) {
                  callback(userPointsRewardsData);
               }
            }
            else {
               a$.ajax({
                  type: "GET",
                  service: "C#",
                  async: true,
                  data: {
                     lib: "selfserve",
                     cmd: "getUserAwardedPointsForUser",
                     userid: legacyContainer.scope.TP1Username,
                     deepLoad: false,
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (jsonData) {
                     let returnData = JSON.parse(jsonData.currentUserAwardedPointsList);
                     userPointsRewardsData.length = 0;
                     userPointsRewardsData = returnData;

                     if (callback != null) {
                        callback(returnData);
                     }
                  }
               });
            }
         }
         function GetAvailableIrpasAreas(callback, forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (availableReferenceOptions.availableIrpasAreas != null && availableReferenceOptions.availableIrpasAreas.length > 0 && forceReload == false) {
               if (callback != null) {
                  callback(availableReferenceOptions.availableIrpasAreas);
               }
            }
            else {
               a$.ajax({
                  type: "GET",
                  service: "C#",
                  async: true,
                  data: {
                     lib: "selfserve",
                     cmd: "getAllAvailableIRPASAreas",
                     includeinactive: true,
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (jsonData) {
                     let returnData = JSON.parse(jsonData.availableIrpasAreasList);
                     availableReferenceOptions.availableIrpasAreas.length = 0;
                     availableReferenceOptions.availableIrpasAreas = returnData;
                     if (callback != null) {
                        callback(returnData);
                     }
                  }
               });
            }
         }
         function GetAvailableIrpasSubAreas(callback, forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (availableReferenceOptions.avaialbleIrpasSubareas != null && availableReferenceOptions.avaialbleIrpasSubareas.length > 0 && forceReload == false) {
               if (callback != null) {
                  callback(availableReferenceOptions.avaialbleIrpasSubareas);
               }
            }
            else {
               a$.ajax({
                  type: "GET",
                  service: "C#",
                  async: true,
                  data: {
                     lib: "selfserve",
                     cmd: "getAllAvailableIRPASSubAreas",
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (jsonData) {
                     let returnData = JSON.parse(jsonData.availableIrpasSubAreasList);
                     availableReferenceOptions.avaialbleIrpasSubareas.length = 0;
                     availableReferenceOptions.avaialbleIrpasSubareas = returnData;
                     if (callback != null) {
                        callback(returnData);
                     }
                  }
               });
            }
         }
         function GetAvailableIrpasIntervals(callback, forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }

            if (availableReferenceOptions.availableIntervalTypes != null && availableReferenceOptions.availableIntervalTypes.length > 0 && forceReload == false) {
               if (callback != null) {
                  callback(availableReferenceOptions.availableIntervalTypes);
               }
            }
            else {
               a$.ajax({
                  type: "GET",
                  service: "C#",
                  async: true,
                  data: {
                     lib: "selfserve",
                     cmd: "getAllAvailableIRPASIntervals",
                     includeinactive: true,
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (jsonData) {
                     let returnData = JSON.parse(jsonData.availableIntervalList);
                     availableReferenceOptions.availableIntervalTypes.length = 0;
                     availableReferenceOptions.availableIntervalTypes = returnData;

                     if (callback != null) {
                        callback(returnData);
                     }
                  }
               });
            }
         }
         function GetAvailableRewardOptions(callback, forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (availableReferenceOptions.availableRewardOptions != null && availableReferenceOptions.availableRewardOptions.length > 0 && forceReload == false) {
               if (callback != null) {
                  callback(availableReferenceOptions.availableRewardOptions);
               }
            }
            else {
               a$.ajax({
                  type: "GET",
                  service: "C#",
                  async: true,
                  data: {
                     lib: "selfserve",
                     cmd: "getCurrentIRPASRewardOptions",
                     includeinactive: true,
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (jsonData) {
                     let returnData = JSON.parse(jsonData.currentRewardOptionList);
                     availableReferenceOptions.availableRewardOptions.length = 0;
                     availableReferenceOptions.availableRewardOptions = returnData;
                     if (callback != null) {
                        callback(returnData);
                     }
                  }
               });
            }
         }
         /* Data Pulls END */
         /* Data Rendering START */
         function RenderCurrentUserAwardedItems(callback, listToRender) {
            if (listToRender == null) {
               listToRender = userPointsRewardsData;
            }
            $("#userAwardedItemsPointsList", element).empty();
            $("#lblUserAwardPointsRecordsFound", element).empty();
            let totalRecordsFound = 0;

            let userAwardedPointsListHolder = $(`<div class="user-awarded-items-list-holder" />`);

            if (listToRender != null && listToRender.length > 0) {
               totalRecordsFound = listToRender.length || 0;

               let sortedList = SortUserAwardList(listToRender);

               sortedList.forEach(function (rewardItem) {
                  let awardedItemRow = $(`<div class="user-awarded-points-list-item-row" />`);
                  let awardedOnDateHolder = $(`<div class="user-awarded-points-list-item award-on-date" />`);
                  let awardedQuantityHolder = $(`<div class="user-awarded-points-list-item award-quantity" />`);
                  let awardedPointsHolder = $(`<div class="user-awarded-points-list-item award-points" />`);
                  let awardedForHolder = $(`<div class="user-awarded-points-list-item award-for-big" />`);

                  let rewardOptionName = rewardItem.IrpasRewardOptionId
                  let rewardOptionObject = GetRewardOptionObject(rewardItem.IrpasRewardOptionId);
                  let reoccurringText = "";
                  if (rewardOptionObject != null) {
                     reoccurringText = "";
                     let areaName = rewardOptionObject.IrpasAreaId;
                     let intervalNumber = rewardOptionObject.IntervalNumber;
                     let areaObject = availableReferenceOptions.availableIrpasAreas?.find(area => area.IrpasAreaId == rewardOptionObject.IrpasAreaId);
                     if (areaObject != null) {
                        areaName = areaObject.Name;

                     }
                     let intervalName = rewardOptionObject.IrpasIntervalId;
                     let intervalObject = availableReferenceOptions.availableIntervalTypes?.find(area => area.IrpasIntervalId == rewardOptionObject.IrpasIntervalId);
                     if (intervalObject != null) {
                        intervalName = `${intervalObject.Name}`;
                     }

                     if(rewardOptionObject.IsReoccurring == true)
                     {
                        reoccurringText = " (Reoccurring)";
                     }
                     rewardOptionName = `${areaName} - ${intervalNumber} ${intervalName}${reoccurringText}`;

                  }
                  awardedOnDateHolder.append(`${new Date(rewardItem.AwardDate).toLocaleDateString()}`);
                  awardedQuantityHolder.append(rewardItem.RewardQuantity);
                  awardedPointsHolder.append(rewardItem.PointsAwarded);
                  awardedForHolder.append(rewardOptionName);

                  awardedItemRow.append(awardedOnDateHolder);
                  awardedItemRow.append(awardedQuantityHolder);
                  awardedItemRow.append(awardedPointsHolder);
                  awardedItemRow.append(awardedForHolder);

                  userAwardedPointsListHolder.append(awardedItemRow);
               });
            }
            else {
               userAwardedPointsListHolder.append(`No user points awarded data found.`);
            }

            $("#userAwardedItemsPointsList", element).append(userAwardedPointsListHolder);
            $("#lblUserAwardPointsRecordsFound", element).append(totalRecordsFound);
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
         function SortUserAwardList(listToSort) {
            let sortedList = listToSort;
            sortedList = sortedList.sort((a, b) => {
               if (new Date(a.AwardDate) < new Date(b.AwardDate)) {
                  return 1;
               }
               else if (new Date(a.AwardDate) > new Date(b.AwardDate)) {
                  return -1;
               }
               else {
                  return 0;
               }
            });
            return sortedList;
         }
         /* Sorting Options END */
         /* Utility Functions START */
         function GetRewardOptionObject(rewardOptionId) {
            let returnObject = availableReferenceOptions?.availableRewardOptions.find(ro => ro.IrpasRewardOptionId == rewardOptionId);
            if (returnObject == null) {
               console.log("Reward Option Not found....load in some fashion.");
            }

            return returnObject;
         }
         /* Utility Functions END */
         /* Show/Hide START */
         function HideAll() {
         }
         /* Show/Hide END */

         scope.load = function () {
            scope.Initialize();
            LoadDirective();
         };

         ko.postbox.subscribe("IRPASManagementInit", function () {
            scope.Initialize();
         });
         ko.postbox.subscribe("IRPASManagementLoad", function () {
            //scope.load();
            LoadDirective();
         });
      }
   };
}]);