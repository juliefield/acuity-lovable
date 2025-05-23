angularApp.directive("ngTopUserPoints", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/IncentivesRewards/view/topUserPoints.htm?' + Date.now(),
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
         let defaultAvatarFile = window.location.protocol + "//" + window.location.hostname + "/jq/avatars/empty_headshot.png";
         let initialUserRewardsSummary = [];
         let currentUserProfiles = [];
         /* Event Handling START */
         /* Event Handling END */
         scope.Initialize = function () {
            HideAll();
         };
         function SetDatePickers() {
         }
         /* Data Loading START */
         function LoadDirective(callback, forceReload) {
            HideAll();
            LoadCurrentUserRewards(callback, forceReload);
         }
         /* Data Loading END */
         function LoadCurrentUserRewards(callback, forceReload) {
            GetCurrentUserRewardsSummary(function (currentUserRewardList) {
               RenderCurrentUserRewardsSummary(function () {
                  if (callback != null) {
                     callback();
                  }
               }, currentUserRewardList);
            }, forceReload);
         }
         /* Data Pulls START */
         function GetCurrentUserRewardsSummary(callback, forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (initialUserRewardsSummary != null && initialUserRewardsSummary.length > 0 && forceReload == false) {
               if (callback != null) {
                  callback(initialUserRewardsSummary);
               }
            }
            else {
               a$.ajax({
                  type: "GET",
                  service: "C#",
                  async: true,
                  data: {
                     lib: "selfserve",
                     cmd: "getIRPASUserRewardsSummary"
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (jsonData) {
                     returnData = JSON.parse(jsonData.userRewardSummaryList);
                     initialUserRewardsSummary.length = 0;
                     initialUserRewardsSummary = returnData;
                     if (callback != null) {
                        callback(returnData);
                     }
                  }
               });
            }
         }
         /* Data Pulls END */
         /* Data Rendering START */
         function RenderCurrentUserRewardsSummary(callback, listToRender) {
            if (listToRender == null) {
               listToRender = initialUserRewardsSummary;
            }
            $("#topUserPointsAwardList", element).empty();
            let topUserPointsHolder = $(`<div class="top-user-points-list-holder" />`);
            if (listToRender == null || listToRender.length == 0) {
               let userPointsNoDataRowHolder = $(`<div class="top-user-points-list-item-row no-data-found" />`);
               userPointsNoDataRowHolder.append("No Users with points earned found.");

               topUserPointsHolder.append(userPointsNoDataRowHolder);
            }
            else {
               listToRender = listToRender.sort((a, b) => {
                  if (a.TotalPointsEarned < b.TotalPointsEarned) {
                     return 1;
                  }
                  else if (a.TotalPointsEarned > b.TotalPointsEarned) {
                     return -1;
                  }
                  else {
                     if (a.UserId < b.UserId) {
                        return -1;
                     }
                     else if (a.UserId > b.UserId) {
                        return 1;
                     }
                     else {
                        return 0;
                     }
                  }
               });
               let maxRecordDisplayCount = 20;
               if (listToRender.length < maxRecordDisplayCount) {
                  maxRecordDisplayCount = listToRender.length;
               }

               for (let iIndex = 0; iIndex < maxRecordDisplayCount; iIndex++) {
                  let userRewardSummaryItem = listToRender[iIndex];

                  let userPointsRowHolder = $(`<div class="top-user-points-list-item-row" />`);
                  let userPointsUserNameHolder = $(`<div class="top-user-points-list-item user-name" id="userNameHolder_${userRewardSummaryItem.UserId}" replaceUserId="${userRewardSummaryItem.UserId}" />`);
                  let userPointsUserTotalPointsHolder = $(`<div class="top-user-points-list-item user-total-points" />`);
                  let userDisplayName = userRewardSummaryItem.UserId;
                  let avatarImageName = defaultAvatarFile;
                  let userObject = GetUserProfileObject(userRewardSummaryItem.UserId);

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
                  let avatarImage = $(`<img src="${avatarImageName}" alt="${userDisplayName} Avatar" class="small-line-avatar-image" replaceUserId="${userRewardSummaryItem.UserId}" />`);
                  userPointsUserNameHolder.append(avatarImage);
                  userPointsUserNameHolder.append("&nbsp;");
                  userPointsUserNameHolder.append(userDisplayName);

                  userPointsUserTotalPointsHolder.append(`${userRewardSummaryItem.TotalPointsEarned}`);

                  userPointsRowHolder.append(userPointsUserNameHolder);
                  userPointsRowHolder.append(userPointsUserTotalPointsHolder);

                  topUserPointsHolder.append(userPointsRowHolder);
               }
            }

            $("#topUserPointsAwardList", element).append(topUserPointsHolder);
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
            let userObject = currentUserProfiles.find(i => i.UserId == userId);
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
         /* Utility Functions END */
         /* Show/Hide START */
         function HideAll() {
            HideLoadingMessage();
         }
         function ShowLoadingMessage() {
            $("#topUserPointsLoadingMessage", element).show();
         }
         function HideLoadingMessage() {
            $("#topUserPointsLoadingMessage", element).hide();
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
            initialUserRewardsSummary.length = 0;
            LoadDirective();
         });
         ko.postbox.subscribe("IRPASManagementReload", function (forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }
            LoadDirective(null, forceReload);
         });
         ko.postbox.subscribe("IRPAS_AvailableUserProfileLoaded", function(IrpasReferenceObject){
            currentUserProfiles.length = 0;
            currentUserProfiles = IrpasReferenceObject.AvailableUserProfiles.data;
            RenderFullUserProfileObjects();
         });
      }
   };
}]);