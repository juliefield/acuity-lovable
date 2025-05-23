angularApp.directive("ngUserRewardsDisplay", [
  "api",
  "$rootScope",
  function (api, $rootScope) {
    return {
      templateUrl:
        a$.debugPrefix() +
        "/applib/dev/IncentivesRewards/view/UserRewardsDisplay.htm?" +
        Date.now(),
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
        userId: "@",
      },
      require: "^ngLegacyContainer",
      link: function (scope, element, attrs, legacyContainer) {
        HideAll();
        let dataLoadType = null;
        let defaultAvatarFile =
          window.location.protocol +
          "//" +
          window.location.hostname +
          "/jq/avatars/empty_headshot.png";
        SetAttrValues(attrs);
        let userRewardsReferenceObjects = {
          UserProfiles: [],
          RewardOptions: [],
          IntervalOptions: [],
          AreaOptions: [],
          SubAreaOptions: [],
        };
        let initialUserRewards = [];
        /* Event Handling START */
        /* Event Handling END */
        scope.Initialize = function () {
          HideAll();
        };
        function SetDatePickers() {}
        function SetAttrValues(attrs) {
          if (attrs.rewardsType != null || attrs.rewardstype != null) {
            dataLoadType = attrs.rewardsType || attrs.rewardstype;
          }
        }
        /* Data Loading START */
        function LoadDirective() {
          HideAll();
          LoadUserRewards();
        }
        /* Data Loading END */
        function LoadUserRewards(callback) {
          GetUserRewards(function (upcomingUserRewardList) {
            RenderUserRewards(function () {
              if (callback != null) {
                callback();
              }
            }, upcomingUserRewardList);
          });
        }
        /* Data Pulls START */
        function GetUserRewards(callback, forceReload) {
          if (forceReload == null) {
            forceReload = false;
          }
          let userCommand = "";
          let postboxCommand = "";
          switch (dataLoadType.toLowerCase()) {
            case "awardedToday".toLowerCase():
              userCommand = "getIRPASUserRewardsForToday";
              break;
            case "upcoming".toLowerCase():
              userCommand = "getUpcomingIRPASUserRewards";
              break;
          }
          if (userCommand != "") {
            a$.ajax({
              type: "POST",
              service: "C#",
              async: true,
              data: {
                lib: "selfserv",
                cmd: userCommand,
              },
              dataType: "json",
              cache: false,
              error: a$.ajaxerror,
              success: function (data) {
                let returnData = JSON.parse(data.userRewardsList);
                initialUserRewards.length = 0;
                initialUserRewards = returnData;
                if (postboxCommand != null && postboxCommand != "") {
                  ko.postbox.publish(postboxCommand, returnData);
                }
                if (callback != null) {
                  callback(returnData);
                }
              },
            });
          }
        }
        /* Data Pulls END */
        /* Data Rendering START */
        function RenderUserRewards(callback, listToRender) {
          RenderUserRewardsHeader();
          RenderUserRewardsBody(null, listToRender);
          RenderUserRewardsFooter();

          if (callback != null) {
            callback();
          }
        }
        function RenderUserRewardsHeader(callback) {
          $("#userRewardsAwardHeader", element).empty();

          let awardsHeaderHolder = $(
            `<div class="user-rewards-display-header-holder" />`
          );
          let directiveHeaderLabel = "";
          switch (dataLoadType.toLowerCase()) {
            case "awardedToday".toLowerCase():
              directiveHeaderLabel = "Awarded Today";
              awardsHeaderHolder.append(
                `<div class="user-rewards-list-item-row">`
              );
              awardsHeaderHolder.append(
                `<div class="user-rewards-list-item header-item user-name">User</div>`
              );
              awardsHeaderHolder.append(
                `<div class="user-rewards-list-item header-item area-name">Area</div>`
              );
              awardsHeaderHolder.append(
                `<div class="user-rewards-list-item header-item award-amount">Amount</div>`
              );
              awardsHeaderHolder.append(`</div>`);
              break;
            case "upcoming".toLowerCase():
              directiveHeaderLabel = "Upcoming Rewards";
              awardsHeaderHolder.append(
                `<div class="user-rewards-list-item-row">`
              );
              awardsHeaderHolder.append(
                `<div class="user-rewards-list-item header-item user-name">User</div>`
              );
              awardsHeaderHolder.append(
                `<div class="user-rewards-list-item header-item area-name">Area</div>`
              );
              awardsHeaderHolder.append(
                `<div class="user-rewards-list-item header-item days-until">Days Until Reward</div>`
              );
              awardsHeaderHolder.append(
                `<div class="user-rewards-list-item header-item award-amount">Amount</div>`
              );
              awardsHeaderHolder.append(`</div>`);
              break;
          }
          $("#userRewardsAwardHeader", element).append(awardsHeaderHolder);

          $("#userRewardsHeaderText", element).empty();
          $("#userRewardsHeaderText", element).append(directiveHeaderLabel);

          if (callback != null) {
            callback();
          }
        }
        function RenderUserRewardsBody(callback, listToRender) {
          if (listToRender == null) {
            listToRender = initialUserRewards;
          }
          let dataTypeDataList = listToRender;
          let today = new Date();
          switch (dataLoadType.toLowerCase()) {
            case "awardedToday".toLowerCase():
              dataTypeDataList = listToRender.filter(
                (i) =>
                  new Date(i.AwardDate).toLocaleDateString() ==
                  today.toLocaleDateString()
              );
              break;
            case "upcoming".toLowerCase():
              dataTypeDataList = listToRender.filter(
                (i) => new Date(i.AwardDate) > today
              );
              dataTypeDataList = SortUserRewardsData(dataTypeDataList);
              break;
          }
          $("#lblRecordsFound", element).empty();
          $("#userRewardsAwardList", element).empty();
          $("#lblDisplayRecordCount", element).empty();
          let displayCounter = 0;
          let maxDisplayRecords = 25;
          let awardsBodyHolder = $(
            `<div class="user-rewards-display-body-holder" />`
          );

          if (dataTypeDataList == null || dataTypeDataList.length == 0) {
            let noRewardsMessage = "No User Rewards records found.";
            let userPointsNoDataRowHolder = $(
              `<div class="user-rewards-list-item-row no-data-found" />`
            );

            switch (dataLoadType.toLowerCase()) {
              case "awardedToday".toLowerCase():
                noRewardsMessage = "No users awarded points today.";
                break;
              case "upcoming".toLowerCase():
                noRewardsMessage = "No upcoming users awarded points found.";
                break;
            }

            userPointsNoDataRowHolder.append(noRewardsMessage);
            awardsBodyHolder.append(userPointsNoDataRowHolder);
          } else {
            dataTypeDataList.forEach(function (dataItem) {
              if (displayCounter < maxDisplayRecords) {
                let dataRowHolder = $(
                  `<div class="user-rewards-list-item-row" />`
                );
                let avatarImageName = defaultAvatarFile;
                let userDisplayName = dataItem.UserId;
                let userObject = GetUserProfileObject(dataItem.UserId);
                if (userObject != null) {
                  userDisplayName = userObject.UserFullName;
                  if (userObject.AvatarImageFileName != "empty_headshot.png") {
                    avatarImageName = Global_CleanAvatarUrl(
                      userObject.AvatarImageFileName
                    );
                  }
                }
                let avatarImage = $(
                  `<img src="${avatarImageName}" alt="${userDisplayName} Avatar" class="small-line-avatar-image" />`
                );

                let optionName = dataItem.IrpasRewardOptionId;
                let rewardOptionObject =
                  userRewardsReferenceObjects.RewardOptions.find(
                    (i) => i.Id == dataItem.IrpasRewardOptionId
                  );

                if (rewardOptionObject != null) {
                  let areaObject = userRewardsReferenceObjects.AreaOptions.find(
                    (a) => a.Id == rewardOptionObject.IrpasAreaId
                  );
                  if (areaObject != null) {
                    optionName = areaObject.Name;
                  }
                }

                let userNameHolder = $(
                  `<div class="user-rewards-list-item user-name" id="userNameHolder_${dataItem.UserId}" replaceUserId="${dataItem.UserId}" />`
                );
                userNameHolder.append(avatarImage);
                userNameHolder.append("&nbsp;");
                userNameHolder.append(userDisplayName);

                let optionNameHolder = $(
                  `<div class="user-rewards-list-item area-name" />`
                );
                optionNameHolder.append(optionName);

                let awardAmountHolder = $(
                  `<div class="user-rewards-list-item award-amount" />`
                );
                awardAmountHolder.append(dataItem.PointsAwarded);

                dataRowHolder.append(userNameHolder);
                dataRowHolder.append(optionNameHolder);
                switch (dataLoadType.toLowerCase()) {
                  case "upcoming".toLowerCase():
                    let diff = Math.round(
                      Math.ceil(
                        Math.abs(new Date(dataItem.AwardDate) - today) /
                          (24 * 60 * 60 * 1000)
                      )
                    );
                    dataRowHolder.append(
                      `<div class="user-rewards-list-item days-until">${parseInt(
                        diff
                      )}</div>`
                    );
                    break;
                }
                dataRowHolder.append(awardAmountHolder);

                awardsBodyHolder.append(dataRowHolder);
                displayCounter++;
              }
            });
            $("#lblRecordsFound", element).append(dataTypeDataList.length);
          }

          $("#userRewardsAwardList", element).append(awardsBodyHolder);
          if (dataTypeDataList.length > maxDisplayRecords) {
            $("#lblDisplayRecordCount", element).append(
              `(${displayCounter} displayed)`
            );
          }
          if (callback != null) {
            callback();
          }
        }
        function RenderUserRewardsFooter(callback) {
          // $("#userRewardsAwardFooter", element).empty();
          // $("#userRewardsAwardFooter", element).append("&nbsp;");

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
        function SortUserRewardsData(listToSort) {
          let sortedData = listToSort;
          switch (dataLoadType.toLowerCase()) {
            case "upcoming".toLowerCase():
              sortedData = sortedData.sort((a, b) => {
                if (new Date(a.AwardDate) < new Date(b.AwardDate)) {
                  return -1;
                } else if (new Date(a.AwardDate) > new Date(b.AwardDate)) {
                  return 1;
                } else {
                  if (a.IntervalId < b.IntervalId) {
                    return -1;
                  } else if (a.IntervalId > b.IntervalId) {
                    return 1;
                  } else {
                    if (a.UserId < b.UserId) {
                      return -1;
                    } else if (a.UserId > b.UserId) {
                      return 1;
                    } else {
                      return 0;
                    }
                  }
                }
              });
              break;
          }
          return sortedData;
        }
        /* Sorting Options END */
        /* Utility Functions START */
        function GetUserProfileObject(userId) {
          let userObject = userRewardsReferenceObjects.UserProfiles.find(
            (i) => i.UserId == userId
          );
          return userObject;
        }
        function RenderFullUserProfileObjects() {
          $("[id^='userNameHolder_']", element).each(function () {
            let userId = $(this).attr("replaceUserId");

            if (userId != null && userId != "") {
              let avatarImageName = defaultAvatarFile;
              let userDisplayName = userId;
              let userObject = GetUserProfileObject(userId);
              if (userObject != null) {
                userDisplayName = userObject.UserFullName;
                avatarImageName = userObject.AvatarImageFileName;
                if (avatarImageName != "empty_headshot.png") {
                  avatarImageName = Global_CleanAvatarUrl(
                    userObject.AvatarImageFileName
                  );
                } else if (avatarImageName == "empty_headshot.png") {
                  avatarImageName = defaultAvatarFile;
                }
              }
              let avatarImage = $(
                `<img src="${avatarImageName}" alt="${userDisplayName} Avatar" class="small-line-avatar-image" />`
              );
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
          $("#userRewardsLoadingMessage", element).show();
        }
        function HideLoadingMessage() {
          $("#userRewardsLoadingMessage", element).hide();
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
          userRewardsReferenceObjects.RewardOptions.length = 0;
          initialUserRewards.length = 0;
          //scope.load();
          LoadDirective();
        });
        ko.postbox.subscribe("IRPASManagementReload", function (forceReload) {
          if (forceReload == null) {
            forceReload = false;
          }
          if (forceReload) {
            userRewardsReferenceObjects.RewardOptions.length = 0;
            initialUserRewards.length = 0;
          }
          LoadDirective();
        });
        ko.postbox.subscribe(
          "IRPASManagementUserDataLoaded",
          function (dataObjects) {
            initialUserRewards.length = 0;
            initialUserRewards = dataObjects;
            LoadDirective();
          }
        );
        ko.postbox.subscribe(
          "IRPASManagementRewardOptionsLoaded",
          function (dataObjects) {
            userRewardsReferenceObjects.RewardOptions.length = 0;
            userRewardsReferenceObjects.RewardOptions = dataObjects;
            LoadDirective();
          }
        );
        ko.postbox.subscribe(
          "CurrentIRPADataLoaded_Areas",
          function (dataObjects) {
            userRewardsReferenceObjects.AreaOptions.length = 0;
            userRewardsReferenceObjects.AreaOptions = dataObjects;
            LoadDirective();
          }
        );
        ko.postbox.subscribe(
          "CurrentIRPADataLoaded_SubAreas",
          function (dataObjects) {
            userRewardsReferenceObjects.SubAreaOptions.length = 0;
            userRewardsReferenceObjects.SubAreaOptions = dataObjects;
            LoadDirective();
          }
        );
        // ko.postbox.subscribe("CurrentIRPADataLoaded_Intervals", function (dataObjects) {
        //    userRewardsReferenceObjects.IntervalOptions.length = 0;
        //    userRewardsReferenceObjects.IntervalOptions = dataObjects;
        //    LoadDirective();
        // });
        ko.postbox.subscribe(
          "IRPAS_AvailableUserProfileLoaded",
          function (IrpasReferenceObject) {
            userRewardsReferenceObjects.UserProfiles.length = 0;
            userRewardsReferenceObjects.UserProfiles =
              IrpasReferenceObject.AvailableUserProfiles.data;
            RenderFullUserProfileObjects();
          }
        );
        ko.postbox.subscribe(
          "IRPAS_AvailableIntervalsLoaded",
          function (IrpasReferenceObject) {
            userRewardsReferenceObjects.IntervalOptions.length = 0;
            userRewardsReferenceObjects.IntervalOptions =
              IrpasReferenceObject.AvailableIntervals.data;
            LoadDirective();
            //RenderIntervalObjects();
          }
        );
      },
    };
  },
]);
