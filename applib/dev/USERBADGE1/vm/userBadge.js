angularApp.directive("ngUserBadge", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/USERBADGE1/view/userBadge.htm?' + Date.now(),
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
         var baseBadgesUrl = window.location.protocol + "//" + window.location.hostname + "/applib/css/images/badges/";
         var defaultAvatarUrl = window.location.protocol + "//" + window.location.hostname + "/jq/avatars/empty_headshot.png";
         var possibleBadges = [];
         var possibleUsers = [];
         var userBadgeInformation = [];
         var possibleKpiOptions = [];

         scope.Initialize = function () {
            HideAll();
            SetDatePickers();
            LoadAvailableKpi();
            LoadAvailableBadges();
            LoadAvailableUserProfiles(function () {
               LoadFilterOptions(true);
            });
         };
         function HideAll() {
            HideUserPanel();
            HideAddBadgePanel();
            HideUserInformation();
         }
         function SetDatePickers() {
            $("#userBadgeManager_EarnedDate", element).datepicker();
         }
         function LoadFilterOptions(activeOnly) {
            if (activeOnly == null) {
               activeOnly = true;
            }
            if (possibleBadges.length > 0) {
               let badgesToLoad = possibleBadges;
               if (activeOnly) {
                  badgesToLoad = possibleBadges.filter(x => x.IsActive == true);
               }
               $("#userBadges_badgeFilter", element).empty();
               $("#userBadges_badgeFilter", element).append($("<option value=\"\">Select Badge</option>"));
               $("#userBadges_groupFilter", element).empty();
               $("#userBadges_groupFilter", element).append($("<option value=\"\">Select Group</option>"));
               $("#userBadgeManager_BadgeId", element).empty();
               $("#userBadgeManager_BadgeId", element).append($("<option value=\"\">Select Badge</option>"));
               for (let bc = 0; bc < badgesToLoad.length; bc++) {
                  let badge = badgesToLoad[bc];
                  let badgeName = badge.BadgeName;
                  let listItem = $("<option />");
                  let managerListItem = $("<option />");
                  let groupListItem = $("<option />");
                  if (badge.RelatedMqfNumber != null && badge.RelatedMqfNumber != "") {
                     let kpiOption = possibleKpiOptions.find(x => x.MqfNumber == badge.RelatedMqfNumber);
                     if (kpiOption != null) {
                        badgeName += " (" + kpiOption.Text + ")";
                     }

                  }

                  listItem.val(badge.BadgeId);
                  listItem.text(badgeName);

                  managerListItem.val(badge.BadgeId);
                  managerListItem.text(badgeName);

                  let groupingName = badge.BadgeGroupingName;
                  let exists = false;
                  exists = ($("#userBadges_groupFilter option", element).filter(function (i, o) { return o.value === groupingName; }).length > 0);
                  if (exists != true) {
                     groupListItem.val(groupingName);
                     groupListItem.text(groupingName);
                     $("#userBadges_groupFilter", element).append(groupListItem);
                  }

                  $("#userBadges_badgeFilter", element).append(listItem);
                  $("#userBadgeManager_BadgeId", element).append(managerListItem);


               }
            }
            if (possibleUsers.length > 0) {
               let usersToLoad = possibleUsers;
               if (activeOnly) {
                  usersToLoad = possibleUsers.filter(x => x.UserStatus != "2");
               }
               $("#userBadges_usersFilter", element).empty();
               $("#userBadges_usersFilter", element).append($("<option value=\"\">Select User</option>"));
               for (let uc = 0; uc < usersToLoad.length; uc++) {
                  let userProfile = usersToLoad[uc];
                  let listItem = $("<option />");
                  listItem.val(userProfile.UserId);;
                  listItem.text(userProfile.UserFullName);
                  $("#userBadges_usersFilter", element).append(listItem);
               }
            }
         }
         function LoadAvailableKpi(callback) {
            a$.ajax({
               type: "GET",
               service: "C#",
               async: true,
               data: {
                  lib: "flex",
                  cmd: "getPossibleScoringAreas",
                  userId: legacyContainer.scope.TP1Username
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
                     if (jsonData.scoringAreaList != null) {
                        returnData = JSON.parse(jsonData.scoringAreaList);
                        possibleKpiOptions.length = 0;
                        possibleKpiOptions = returnData;
                        LoadFilterOptions();
                     }
                     if (callback != null) {
                        callback(returnData);
                     }
                     return;
                  }
               }
            });
         }
         function LoadAvailableBadges(callback) {
            a$.ajax({
               type: "GET",
               service: "C#",
               async: false,
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
         function LoadBadgesForUser(userId, callback) {
            a$.ajax({
               type: "GET",
               service: "C#",
               async: true,
               data: {
                  lib: "selfserve",
                  cmd: "getBadgesForUser",
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
                     userBadgeInformation.length = 0;
                     if (jsonData.userBadgesList != null) {
                        returnData = JSON.parse(jsonData.userBadgesList);
                        RenderUserBadgeCount(returnData.length);
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
         function LoadUserBadgeData(callback) {
            let userId = $("#userBadges_usersFilter", element).val();
            $("#userBadges_EarnedListHolder", element).empty();
            if (userId != null && userId != "") {
               LoadBadgesForUser(userId, function (userBadgeData) {
                  let selectedBadgeId = -1;
                  let badges = [];
                  selectedBadgeId = $("#userBadges_badgeFilter", element).val();
                  userBadgeInformation.length = 0;
                  userBadgeInformation = userBadgeData;
                  if (selectedBadgeId > 0) {
                     badges = userBadgeInformation.filter(x => x.BadgeId == selectedBadgeId);
                  }
                  else {
                     badges = userBadgeInformation;
                  }
                  let selectedGroup = "";
                  selectedGroup = $("#userBadges_groupFilter", element).val();
                  if (selectedGroup != "") {
                     badges = badges.filter(x => x.BadgeIdSource?.BadgeGroupingName == selectedGroup);
                  }
                  badges = badges.sort(function (a, b) {
                     if (a.EarnedDate > b.EarnedDate) {
                        return -1;
                     }
                     else if (a.EarnedDate < b.EarnedDate) {
                        return 1;
                     }
                     return 0;
                  });
                  RenderBadgeData(badges);
               });
               RenderUserData(userId);
               ShowUserPanel();
            }

            if (callback != null) {
               callback();
            }
         }
         function RenderBadgeData(badgeList) {
            let badgeInformationHolder = $("<div />");
            if (badgeList != null) {
               if (Array.isArray(badgeList)) {
                  if (badgeList.length > 0) {
                     for (let bc = 0; bc < badgeList.length; bc++) {
                        let badgeItem = badgeList[bc];
                        RenderBadgeItem(badgeItem, badgeInformationHolder);
                     }
                  }
               }
               else {
                  RenderBadgeItem(badgeList, badgeInformationHolder);
               }
            }
            $("#userBadges_EarnedListHolder", element).empty();
            $("#userBadges_EarnedListHolder", element).append(badgeInformationHolder);
         }
         function ClearUserDataInformation() {
            $("#user-avatar", element).prop("src", defaultAvatarUrl);
            $("#user-full-name", element).empty();
            $("#user-badge-count", element).empty();
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
            //$("#user-badge-count", element).append(badgeCount);
         }
         function RenderBadgeItem(itemToRender, objectToAddTo) {
            let badgeDataHolder = $("<div class=\"user-badge-row-item-holder\" />");
            let badgeItem = $(itemToRender)[0];
            let badgeImageHolder = $("<div class=\"user-badge-item-holder user-badge-image\"/>");
            let badgeImage = $("<img />");
            let badgeNameHolder = $("<div class=\"user-badge-item-holder user-badge-name\" />");
            let badgeEarnedHolder = $("<div class=\"user-badge-item-holder user-badge-date\" />");
            let badgeButtonHolder = $("<div class=\"user-badge-item-holder user-badge-button-holder\" />");

            let badgeName = "No Badge Name";
            let badgeImageUrl = "placeholder-badge.png";
            let badgeEarnedDate = "";
            let badgeButton = $("<button class=\"user-badge-button btn-delete\"  title=\"Delete\" id=\"RemoveButton_" + badgeItem.UserBadgeId + "\"><i class=\"fa fa-trash\"></i></button>");
            badgeButton.off("click").on("click", function () {
               let buttonId = this.id;
               let id = buttonId.split("_")[1];
               RemoveUserBadge(id, function () {
                  LoadUserBadgeData();
               });
            });
            if (badgeItem.BadgeIdSource != null) {
               badgeName = badgeItem.BadgeIdSource.BadgeName;
               if (badgeItem.BadgeIdSource != null) {
                  let kpiOption = possibleKpiOptions.find(x => x.MqfNumber == badgeItem.BadgeIdSource.RelatedMqfNumber);
                  if (kpiOption != null) {
                     badgeName += " (" + kpiOption.Text + ")";
                  }
               }
               badgeImageUrl = badgeItem.BadgeIdSource.ImageUrl;
               badgeEarnedDate = new Date(badgeItem.EarnedDate).toLocaleDateString();
            }
            badgeNameHolder.append(badgeName);

            badgeImage.prop("src", baseBadgesUrl + badgeImageUrl);
            badgeImage.height(75);
            badgeImageHolder.append(badgeImage);

            badgeEarnedHolder.append(badgeEarnedDate);

            badgeButtonHolder.append(badgeButton);

            badgeDataHolder.append(badgeImageHolder);
            badgeDataHolder.append(badgeNameHolder);
            badgeDataHolder.append(badgeEarnedHolder);
            badgeDataHolder.append(badgeButtonHolder);

            $(objectToAddTo).append(badgeDataHolder);
         }
         function RenderUserBadgeCount(userTotalBadgeCount) {
            $("#user-badge-count", element).empty();
            $("#user-badge-count", element).append(userTotalBadgeCount);
         }
         function LoadAddBadgeToUser(callback) {
            let selectedUserId = $("#userBadges_usersFilter", element).val();
            let user = possibleUsers.find(x => x.UserId == selectedUserId);
            let userFullName = "";
            if (user != null) {
               userFullName = user.UserFullName;
            }
            $("#userBadgeManager_AssignTo", element).val(selectedUserId);
            $("#userBadgeManager_AssignToReadOnlyLabel", element).text(userFullName);

            if (callback != null) {
               callback();
            }
            return;
         }
         function LoadSelectedBadgeImage(badgeId) {
            let badge = possibleBadges.find(x => x.BadgeId == badgeId);
            let imageUrl = baseBadgesUrl + "placeholder-badge.png";
            if (badge != null && badge.ImageUrl != null && badge.imageUrl != "") {
               imageUrl = baseBadgesUrl + badge.ImageUrl;
            }
            $("#userBadgeManager_BadgeImage", element).prop("src", imageUrl);
         }
         function ValidateForm(callback) {
            var formValid = true;
            let errorMessages = [];
            let earnedDate = $("#userBadgeManager_EarnedDate", element).val();

            if (earnedDate == null || earnedDate == "") {
               errorMessages.push({ message: "Date is Required.", fieldclass: ".user-badge-manager-earned-date", fieldid: "" });
               formValid = false;
            }
            else {
               if (new Date(earnedDate) > new Date()) {
                  errorMessages.push({ message: "Date must be before today.", fieldclass: ".user-badge-manager-earned-date", fieldid: "" });
                  formValid = false;
               }
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
         function SaveBadgeForm(callback) {
            let badgeDataToSave = new Object();
            badgeDataToSave.UserBadgeId = -1;
            badgeDataToSave.BadgeId = parseInt($("#userBadgeManager_BadgeId", element).val());
            badgeDataToSave.UserId = $("#userBadgeManager_AssignTo", element).val();
            badgeDataToSave.EarnedDate = new Date($("#userBadgeManager_EarnedDate", element).val());
            badgeDataToSave.EntDt = new Date();
            badgeDataToSave.EntBy = legacyContainer.scope.TP1Username;

            a$.ajax({
               type: "GET",
               service: "C#",
               async: true,
               data: {
                  lib: "selfserve",
                  cmd: "assignBadgeToUser",
                  badgeData: JSON.stringify(badgeDataToSave)
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
                     if (callback != null) {
                        callback();
                     }
                     return;
                  }
               }
            });
         }
         function RemoveUserBadge(userBadgeId, callback) {
            if (confirm("You are about to remove this badge.\nClick OK to continue with removal.")) {
               a$.ajax({
                  type: "GET",
                  service: "C#",
                  async: true,
                  data: {
                     lib: "selfserve",
                     cmd: "removeUserBadge",
                     userbadgeid: userBadgeId
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
            $("#userBadgeManager_AssignToReadOnlyLabel", element).empty();
            $("#userBadgeManager_AssignTo", element).val("");
            $("#userBadgeManager_BadgeId", element).val("");
            $("#userBadgeManager_EarnedDate", element).val("");
            $("#userBadgeManager_BadgeImage", element).prop("src", "");
            $(".error-information-holder", element).empty();

            if (callback != null) {
               callback();
            }
            return;
         }
         function RunBadgeAutomation(callback) {
            a$.ajax({
               type: "GET",
               service: "C#",
               async: true,
               data: {
                  lib: "selfserve",
                  cmd: "doUserBageAutomation"
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

                     if (callback != null) {
                        callback();
                     }
                     return;
                  }
               }
            });
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
         function ShowAddBadgePanel(callback) {
            $("#userBadgeManagementPanel", element).show();
            if (callback != null) {
               callback();
            }
            return;
         }
         function HideAddBadgePanel(callback) {
            $("#userBadgeManagementPanel", element).hide();
            if (callback != null) {
               callback();
            }
            return;
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

         scope.load = function () {
            scope.Initialize();
            LoadFilterOptions();
            $("#userBadges_usersFilter", element).off("change").on("change", function () {
               LoadUserBadgeData();
            });

            $("#userBadges_badgeFilter", element).off("change").on("change", function () {
               LoadUserBadgeData();
            });
            $("#userBadges_groupFilter", element).off("change").on("change", function () {
               LoadUserBadgeData();
            });
            $("#btnAddUserBadge", element).off("click").on("click", function () {
               LoadAddBadgeToUser(function () {
                  ShowAddBadgePanel();
               });
            });
            $(".btn-close", element).off("click").on("click", function () {
               ClearForm(function () {
                  HideAddBadgePanel();
               });
            });
            $("#btnSave", element).off("click").on("click", function () {
               ValidateForm(function () {
                  SaveBadgeForm(function () {
                     LoadUserBadgeData();
                     HideAddBadgePanel();
                  });
               });
            });
            $("#userBadgeManager_BadgeId", element).off("change").on("change", function () {
               let value = $(this).val();
               LoadSelectedBadgeImage(value);
            });
         };
         scope.load2 = function () {
            HideAll();
         }
         scope.load2();
         //scope.load();
         ko.postbox.subscribe("UserBadgesLoad", function () {
            if (possibleUsers.length == 0) {
               scope.load();
            }
            else {
               LoadUserBadgeData();
            }
         });
         ko.postbox.subscribe("UserBadgesRefresh", function () {
            LoadUserBadgeData(function () {
               HideUserInformation();
            });
         });
      }
   };
}]);