angularApp.directive("ngUserPoints", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/USERBADGE1/view/userPoints.htm?' + Date.now(),
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
         var basePointsUrl = window.location.protocol + "//" + window.location.hostname + "/applib/css/images/points/";
         var defaultAvatarUrl = window.location.protocol + "//" + window.location.hostname + "/jq/avatars/empty_headshot.png";
         var possibleUsers = [];
         var userPointsInformation = [];
         var possibleGames = [];
         var possibleBadges = [];

         scope.Initialize = function () {
            HideAll();
            SetDatePickers();
            LoadAvailableFlexGames();
            LoadAvailableBadges();
            LoadAvailableUserProfiles(function () {
               LoadFilterOptions(true);
            });

         };
         function SetDatePickers() {
            $("#userPointsManager_AwardDate", element).datepicker();
         }
         function HideAll() {
            HideUserPanel();
            HideAddPointsPanel();
         }
         function LoadFilterOptions(activeOnly) {
            if (activeOnly == null) {
               activeOnly = true;
            }
            if (possibleUsers.length > 0) {
               let usersToLoad = possibleUsers;
               if (activeOnly) {
                  usersToLoad = possibleUsers.filter(x => x.UserStatus != "2");
               }
               $("#userPoints_usersFilter", element).empty();
               $("#userPoints_usersFilter", element).append($("<option value=\"\">Select User</option>"));
               for (let uc = 0; uc < usersToLoad.length; uc++) {
                  let userProfile = usersToLoad[uc];
                  let listItem = $("<option />");
                  listItem.val(userProfile.UserId);;
                  listItem.text(userProfile.UserFullName);
                  $("#userPoints_usersFilter", element).append(listItem);
               }
            }
         }
         function LoadAvailableFlexGames(callback) {
            a$.ajax({
               type: "POST",
               service: "C#",
               async: true,
               data: {
                  lib: "flex",
                  cmd: "getGameList",
                  statuslist: "F"
               },
               dataType: "json",
               cache: false,
               error: function (response) {
                  a$.ajaxerror(response);
               },
               success: function (jsonData) {
                  if (jsonData.errormessage != null && jsonData.errormessage == "true") {
                     a$.jsonerror(jsonData);
                     return;
                  }
                  else {

                     possibleGames.length = 0;
                     if (jsonData.gameList != null) {
                        possibleGames = JSON.parse(jsonData.gameList);
                     }
                     if (callback != null) {
                        callback();
                     }
                  }
               }
            });

         }
         function LoadAvailableBadges(callback) {
            a$.ajax({
               type: "GET",
               service: "C#",
               async: true,
               data: {
                  lib: "selfserve",
                  cmd: "getAllAvailableBadges",
                  deepLoad: true
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (jsonData) {
                  if (jsonData.errormessage != null && jsonData.errormessage == "true") {
                     a$.jsonerror(jsonData);
                     return;
                  }
                  else {

                     let returnData = null;
                     if (jsonData.badgesList != null) {
                        returnData = JSON.parse(jsonData.badgesList);
                        possibleBadges.length = 0;
                        possibleBadges = returnData;
                     }
                     if (callback != null) {
                        callback(returnData);
                     }
                     return;
                  }
               }
            });
         }
         function LoadAvailableUserProfiles(callback) {
            a$.ajax({
               type: "GET",
               service: "C#",
               async: true,
               data: {
                  lib: "userprofile",
                  cmd: "getAllProfiles",
                  deepLoad: true
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (jsonData) {
                  if (jsonData.errormessage != null && jsonData.errormessage == "true") {
                     a$.jsonerror(jsonData);
                     return;
                  }
                  else {

                     let returnData = null;
                     if (jsonData.userProfiles != null) {
                        returnData = JSON.parse(jsonData.userProfiles);
                        possibleUsers.length = 0;
                        possibleUsers = returnData;
                     }
                     if (callback != null) {
                        callback(returnData);
                     }
                     return;
                  }
               }
            });
         }
         function LoadPointsForUser(userId, callback) {
            a$.ajax({
               type: "GET",
               service: "C#",
               async: true,
               data: {
                  lib: "selfserve",
                  cmd: "getPointsForUser",
                  userid: userId,
                  deepLoad: true
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (jsonData) {
                  if (jsonData.errormessage != null && jsonData.errormessage == "true") {
                     a$.jsonerror(jsonData);
                     return;
                  }
                  else {

                     let returnData = null;
                     userPointsInformation.length = 0;
                     if (jsonData.userPointsList != null) {
                        returnData = JSON.parse(jsonData.userPointsList);
                        RenderTotalUserPoints(returnData);
                     }
                     if (callback != null) {
                        callback(returnData);
                     }
                     return;
                  }
               }
            });
            return;
         }
         function LoadUserPointsData(callback) {
            let userId = $("#userPoints_usersFilter", element).val();
            if (userId != null && userId != "") {
               LoadPointsForUser(userId, function (userPointsData) {
                  let selectedPointsId = -1;
                  let points = [];
                  selectedPointsId = $("#userPoints_pointsFilter", element).val();
                  userPointsInformation.length = 0;
                  userPointsInformation = userPointsData;
                  $("#userPoints_EarnedListHolder", element).empty();
                  if (selectedPointsId > 0) {
                     points = userPointsInformation.filter(x => x.PointsId == selectedPointsId);
                  }
                  else {
                     points = userPointsInformation;
                  }
                  let selectedGroup = "";
                  selectedGroup = $("#userPoints_groupFilter", element).val();
                  if (selectedGroup != "") {
                     points = points.filter(x => x.PointsIdSource?.PointsGroupingName == selectedGroup);
                  }
                  points = points.sort(function (a, b) {
                     if (a.EarnedDate > b.EarnedDate) {
                        return -1;
                     }
                     else if (a.EarnedDate < b.EarnedDate) {
                        return 1;
                     }
                     return 0;
                  });
                  RenderPointsData(points);
               });
               RenderUserData(userId);
               ShowUserPanel();
            }
            if (callback != null) {
               callback();
            }
         }
         function RenderPointsData(pointsList) {
            let pointsInformationHolder = $("<div />");
            if (pointsList != null) {
               if (Array.isArray(pointsList)) {
                  if (pointsList.length > 0) {
                     for (let bc = 0; bc < pointsList.length; bc++) {
                        let pointsItem = pointsList[bc];
                        RenderPointsItem(pointsItem, pointsInformationHolder);
                     }
                  }
               }
               else {
                  RenderPointsItem(pointsList, pointsInformationHolder);
               }
            }
            $("#userPoints_EarnedListHolder", element).empty();
            $("#userPoints_EarnedListHolder", element).append(pointsInformationHolder);
         }
         function ClearUserDataInformation() {
            $("#user-avatar", element).prop("src", defaultAvatarUrl);
            $("#user-full-name", element).empty();
            $("#user-points-count", element).empty();
         }
         function RenderUserData(userId) {
            $("#user-full-name", element).empty();

            let user = possibleUsers.find(u => u.UserId == userId)
            let avatarImageUrl = defaultAvatarUrl;
            let userFullName = "No user information found.";
            if (user != null) {
               userFullName = user.UserFullName;
               if (user.AvatarImageFileName != "empty_headshot.png") {
                  avatarImageUrl = Global_CleanAvatarUrl(user.AvatarImageFileName);
               }
            }
            $("#user-avatar", element).prop("src", avatarImageUrl);
            $("#user-avatar", element).width(130);
            $("#user-full-name", element).append(userFullName);
         }
         function RenderPointsItem(itemToRender, objectToAddTo) {
            let pointsDataHolder = $("<div class=\"user-points-row-item-holder\" />");
            let pointsItem = $(itemToRender)[0];
            let pointsDateHolder = $("<div class=\"user-points-item-holder user-points-date\" />");
            let pointsAwardedByHolder = $("<div class=\"user-points-item-holder user-points-award-by\" />");
            let pointsAwardFromHolder = $("<div class=\"user-points-item-holder user-points-award-from\" />");
            let pointsHolder = $("<div class=\"user-points-item-holder user-points-points\"/>");
            let pointsButtonHolder = $("<div class=\"user-points-item-holder user-points-button-holder\" />");
            let pointsEarnedDate = "";

            if (pointsItem.PointsValueDate != null) {
               pointsEarnedDate = new Date(pointsItem.PointsValueDate).toLocaleDateString();
            }

            let awardByName = pointsItem.UserId;
            let awardFromName = "&nbsp;";
            let pointsButton = $("<button class=\"user-points-button btn-delete\" title=\"Delete\" id=\"RemoveButton_" + pointsItem.UserPointsId + "\"><i class=\"fa fa-trash\"></i></button>");
            pointsButton.off("click").on("click", function () {
               let buttonId = this.id;
               let id = buttonId.split("_")[1];
               RemoveUserPoints(id, function () {
                  LoadUserPointsData();
               });
            });
            if (pointsItem.AwardedBySource != null) {
               awardByName = BuildFullNameWithAvatar(pointsItem.AwardedBySource);
            }

            if (pointsItem.PointsValue < 0) {
               pointsHolder.addClass("red-ledger-holder");
               pointsAwardFromHolder.addClass("red-ledger-holder");
               awardFromName = "Redemption";
               if (pointsItem.PrizeOptionIdSource != null) {
                  awardFromName += ": " + pointsItem.PrizeOptionIdSource.PrizeOptionName;
               }
            }
            else {
               awardFromName = "Points Awarded";

               if (pointsItem.FlexGameId != null) {
                  if (pointsItem.FlexGameIdSource != null) {
                     awardFromName = pointsItem.FlexGameIdSource.Name;
                  }
                  else {
                     awardFromName = GetFlexGameName(pointsItem.FlexGameId);
                  }

               }

               if (pointsItem.BadgeId != null) {
                  awardFromName = "Badge Earned";
                  if (pointsItem.BadgeIdSource != null) {
                     awardFromName += ": " + pointsItem.BadgeIdSource.BadgeName;
                  }
               }
            }

            pointsDateHolder.append(pointsEarnedDate);
            pointsAwardedByHolder.append(awardByName);

            pointsAwardFromHolder.append(awardFromName);
            pointsHolder.append(pointsItem.PointsValue);
            pointsButtonHolder.append(pointsButton);

            pointsDataHolder.append(pointsDateHolder);
            pointsDataHolder.append(pointsAwardedByHolder);
            pointsDataHolder.append(pointsAwardFromHolder);
            pointsDataHolder.append(pointsHolder);
            pointsDataHolder.append(pointsButtonHolder);

            $(objectToAddTo).append(pointsDataHolder);
         }

         function RenderTotalUserPoints(userPointsArray) {
            let totalUserPoints = 0.00;
            $("#user-points-count", element).empty();
            for (let pc = 0; pc < userPointsArray.length; pc++) {
               let userPointsItem = userPointsArray[pc];
               totalUserPoints += userPointsItem.PointsValue;
            }
            $("#user-points-count", element).append(totalUserPoints);
         }
         function BuildFullNameWithAvatar(userProfileObject) {
            let returnValue = $("<span />");
            let avatarImageUrl = defaultAvatarUrl;
            let avatarImage = $("<img>");
            let displayName = userProfileObject.UserFullName;
            if (userProfileObject.AvatarImageFileName != "empty_headshot.png") {
               avatarImageUrl = Global_CleanAvatarUrl(userProfileObject.AvatarImageFileName);
            }
            avatarImage.prop("src", avatarImageUrl);
            avatarImage.height(20);
            returnValue.append(avatarImage);
            returnValue.append(displayName);

            return returnValue;
         }
         function GetFlexGameName(gameId) {
            let returnValue = "";
            let game = Global_GetFlexGameInformation(gameId);
            if (game != null) {
               returnValue = game.GameName;
            }
            return returnValue;
         }
         function LoadAddPointsToUser(callback) {
            let selectedUserId = $("#userPoints_usersFilter", element).val();
            let user = possibleUsers.find(x => x.UserId == selectedUserId);
            let userFullName = "";
            if (user != null) {
               userFullName = user.UserFullName;
            }
            $("#userPointsManager_AssignTo", element).val(selectedUserId);
            $("#userPointsManager_AssignToReadOnlyLabel", element).text(userFullName);
            LoadSelectionOptions("ALL");
            if (callback != null) {
               callback();
            }
            return;
         }
         function LoadSelectionOptions(areaToLoad) {
            areaToLoad = areaToLoad.toUpperCase();

            if (areaToLoad == "ALL" || areaToLoad == "FLEXGAMES") {
               $("#userPointsManager_FlexGameId", element).empty();
               $("#userPointsManager_FlexGameId", element).append("<option>Select Game</option>");
               for (let gc = 0; gc < possibleGames.length; gc++) {
                  let gameItem = possibleGames[gc];
                  let listItem = $("<option />");
                  listItem.val(gameItem.FlexGameId);
                  listItem.text(gameItem.GameName);
                  $("#userPointsManager_FlexGameId", element).append(listItem);
               }
            }
            if (areaToLoad == "ALL" || areaToLoad == "BADGES") {
               $("#userPointsManager_BadgeId", element).empty();
               $("#userPointsManager_BadgeId", element).append("<option>Select Badge</option>");
               for (let gc = 0; gc < possibleBadges.length; gc++) {
                  let badgeItem = possibleBadges[gc];
                  let listItem = $("<option />");
                  listItem.val(badgeItem.BadgeId);
                  listItem.text(badgeItem.BadgeName);
                  $("#userPointsManager_BadgeId", element).append(listItem);
               }
            }
         }
         function ValidateForm(callback) {
            var formValid = true;
            let errorMessages = [];
            let awardDate = $("#userPointsManager_AwardDate", element).val();
            let points = $("#userPointsManager_PointsAssigned", element).val();

            if (awardDate == null || awardDate == "") {
               errorMessages.push({ message: "Date is Required.", fieldclass: ".user-points-maanger-award-date", fieldid: "" });
               formValid = false;
            }
            else {
               if (new Date(awardDate) > new Date()) {
                  errorMessages.push({ message: "Date must be before today.", fieldclass: ".user-points-maanger-award-date", fieldid: "" });
                  formValid = false;
               }
            }
            if (points == null || points == "") {
               errorMessages.push({ message: "Points are Required.", fieldclass: ".user-points-maanger-points", fieldid: "" });
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
               }
               if (messageString != "") {
                  messageString += "</ul>";

                  $(".error-information-holder", element).html(messageString);
                  $(".error-information-holder", element).show();
               }
            }
         }
         function SavePointsForm(callback) {
            let pointsDataToSave = new Object();
            pointsDataToSave.UserPointsId = -1;
            pointsDataToSave.UserId = $("#userPointsManager_AssignTo", element).val();
            pointsDataToSave.PointsValue = parseFloat($("#userPointsManager_PointsAssigned", element).val());
            pointsDataToSave.PointsValueDate = new Date($("#userPointsManager_AwardDate", element).val());
            let flexGameId = $("#userPointsManager_FlexGameId", element).val();
            let badgeId = $("#userPointsManager_BadgeId", element).val();
            if (flexGameId != null && flexGameId != "") {
               pointsDataToSave.FlexGameId = parseInt(flexGameId);
            }
            if (badgeId != null && badgeId != "") {
               pointsDataToSave.BadgeId = parseInt(badgeId);
            }
            pointsDataToSave.AwardedBy = legacyContainer.scope.TP1Username;
            pointsDataToSave.EntDt = new Date();
            pointsDataToSave.EntBy = legacyContainer.scope.TP1Username;

            a$.ajax({
               type: "GET",
               service: "C#",
               async: true,
               data: {
                  lib: "selfserve",
                  cmd: "assignPointsToUser",
                  pointsData: JSON.stringify(pointsDataToSave)
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (jsonData) {
                  if (jsonData.errormessage != null && jsonData.errormessage == "true") {
                     a$.jsonerror(jsonData);
                     return;
                  }
                  else {

                     ClearForm();
                     ko.postbox.publish("UserAwardsLoad");
                     if (callback != null) {
                        callback();
                     }
                     return;
                  }
               }
            });
         }
         function RemoveUserPoints(userPointsId, callback) {
            if (confirm("You are about to remove points.\nClick OK to continue with removal.")) {
               a$.ajax({
                  type: "GET",
                  service: "C#",
                  async: true,
                  data: {
                     lib: "selfserve",
                     cmd: "removeUserPoints",
                     userpointsid: userPointsId
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (jsonData) {
                     if (jsonData.errormessage != null && jsonData.errormessage == "true") {
                        a$.jsonerror(jsonData);
                        return;
                     }
                     else {

                        ko.postbox.publish("UserAwardsLoad");
                        if (callback != null) {
                           callback();
                        }
                        return;
                     }
                  }
               });
            }
         }
         function ClearForm(callback) {
            $("#userPointsManager_AssignToReadOnlyLabel", element).empty();
            $("#userPointsManager_AssignTo", element).val("");
            $("#userPointsManager_PointsAssigned", element).val("");
            $("#userPointsManager_AwardDate", element).val("");
            $(".error-information-holder", element).empty();

            if (callback != null) {
               callback();
            }
            return;
         }
         function ShowUserPanel(callback) {
            $(".user-holder", element).show();
            if (callback != null) {
               callback();
            }
            return;
         }
         function HideUserPanel(callback) {
            $(".user-holder", element).hide();
            if (callback != null) {
               callback();
            }
            return;
         }
         function ShowAddPointsPanel(callback) {
            $("#userPointsManagementPanel", element).show();
            if (callback != null) {
               callback();
            }
            return;
         }
         function HideAddPointsPanel(callback) {
            $("#userPointsManagementPanel", element).hide();
            if (callback != null) {
               callback();
            }
            return;
         }
         scope.load = function () {
            scope.Initialize();
            LoadFilterOptions();
            $("#userPoints_usersFilter", element).off("change").on("change", function () {
               LoadUserPointsData();
            });
            $("#btnAddUserPoints", element).off("click").on("click", function () {
               LoadAddPointsToUser(function () {
                  ShowAddPointsPanel();
               });
            });
            $(".btn-close", element).off("click").on("click", function () {
               ClearForm(function () {
                  HideAddPointsPanel();
               });
            });
            $("#btnSave", element).off("click").on("click", function () {
               ValidateForm(function () {
                  SavePointsForm(function () {
                     LoadUserPointsData();
                     HideAddPointsPanel();
                  });
               });
            });
            $("#userPointsManager_PointsId", element).off("change").on("change", function () {
               let value = $(this).val();
               LoadSelectedPointsImage(value);
            });
         };
         scope.load2 = function () {
            HideAll();
         }
         scope.load2();
         //scope.load();

         ko.postbox.subscribe("LoadUserPointsForm", function () {
            scope.load();
         });
      }
   };
}]);