angularApp.directive("ngUserTrophy", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/USERBADGE1/view/userTrophy.htm?' + Date.now(),
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
         var baseTrophiesUrl = window.location.protocol + "//" + window.location.hostname + "/applib/css/images/trophy/";
         var defaultAvatarUrl = window.location.protocol + "//" + window.location.hostname + "/jq/avatars/empty_headshot.png";
         var possibleTrophies = [];
         var possibleUsers = [];
         var userTrophiesInformation = [];
         var possibleFlexGames = [];
         var possibleAGameLeagues = [];

         scope.Initialize = function () {
            HideAll();
            SetDatePickers();
            LoadAvailableTrophies();
            LoadAvailableGameList(function () {
               LoadFilterOptions(true);
            });
            LoadAvailableUserProfiles(function () {
               LoadFilterOptions(true);
            });
         };
         function SetDatePickers() {
            $("#userTrophyManager_EarnedDate", element).datepicker();
         }
         function HideAll() {
            HideUserPanel();
            HideAddTrophiesPanel();
         }
         function LoadFilterOptions(activeOnly) {
            if (activeOnly == null) {
               activeOnly = true;
            }
            if (possibleTrophies.length > 0) {
               let trophiesToLoad = possibleTrophies;
               if (activeOnly) {
                  trophiesToLoad = possibleTrophies.filter(x => x.IsActive == true);
               }
               $("#userTrophies_trophyFilter", element).empty();
               $("#userTrophies_trophyFilter", element).append($("<option value=\"\">Select Trophy</option>"));
               $("#userTrophyManager_TrophyId", element).empty();
               $("#userTrophyManager_TrophyId", element).append($("<option value=\"\">Select Trophy</option>"));
               for (let bc = 0; bc < trophiesToLoad.length; bc++) {
                  let trophies = trophiesToLoad[bc];
                  let listItem = $("<option />");
                  let managerListItem = $("<option />");
                  listItem.val(trophies.TrophyId);
                  listItem.text(trophies.TrophyName);
                  managerListItem.val(trophies.TrophyId);
                  managerListItem.text(trophies.TrophyName);

                  $("#userTrophies_trophyFilter", element).append(listItem);
                  $("#userTrophyManager_TrophyId", element).append(managerListItem);
               }
            }
            if (possibleUsers.length > 0) {
               let usersToLoad = possibleUsers;
               if (activeOnly) {
                  usersToLoad = possibleUsers.filter(x => x.UserStatus != "2");
               }
               $("#userTrophies_usersFilter", element).empty();
               $("#userTrophies_usersFilter", element).append($("<option value=\"\">Select User</option>"));
               for (let uc = 0; uc < usersToLoad.length; uc++) {
                  let userProfile = usersToLoad[uc];
                  let listItem = $("<option />");
                  listItem.val(userProfile.UserId);;
                  listItem.text(userProfile.UserFullName);
                  $("#userTrophies_usersFilter", element).append(listItem);
               }
            }
            LoadGameOptionsLists();
         }
         function LoadGameOptionsLists() {
            LoadAvailableGameList();
            LoadAvailableAGameLeagues();
            if (possibleFlexGames.length > 0) {
               let gamesToLoad = possibleFlexGames;
               $("#userTrophyManager_FlexGameId", element).empty();
               $("#userTrophyManager_FlexGameId", element).append($("<option value=\"\">Select Game</option>"));
               for (let gc = 0; gc < gamesToLoad.length; gc++) {
                  let game = gamesToLoad[gc];
                  let listItem = $("<option />");
                  listItem.val(game.FlexGameId);
                  let gameName = game.GameName;
                  if (game.Status == "O") //archived games
                  {
                     gameName += " (ARCHIVED)";
                  }
                  listItem.text(gameName);

                  $("#userTrophyManager_FlexGameId", element).append(listItem);
               }
            }
            if (possibleAGameLeagues.length > 0) {
               let gamesToLoad = possibleAGameLeagues;
               $("#userTrophyManager_AGameDivisionId", element).empty();
               $("#userTrophyManager_AGameDivisionId", element).append($("<option value=\"\">Select A-GAME</option>"));
               for (let gc = 0; gc < gamesToLoad.length; gc++) {
                  let game = gamesToLoad[gc];
                  let listItem = $("<option />");
                  listItem.val(game.AGameDivisionId);
                  let gameName = game.DivisionName;
                  listItem.text(gameName);

                  $("#userTrophyManager_AGameDivisionId", element).append(listItem);
               }
            }

         }
         function LoadAvailableTrophies(callback) {
            a$.ajax({
               type: "GET",
               service: "C#",
               async: false,
               data: {
                  lib: "selfserve",
                  cmd: "getAllAvailableTrophies",
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
                     if (jsonData.trophiesList != null) {
                        returnData = JSON.parse(jsonData.trophiesList);
                        possibleTrophies.length = 0;
                        possibleTrophies = returnData;
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
         function LoadAvailableGameList(callback) {
            if (possibleFlexGames != null && possibleFlexGames.length > 0) {
               if (callback != null) {
                  callback();
               }
               return;
            }
            else {
               a$.ajax({
                  type: "GET",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "flex",
                     cmd: "getGameList",
                     statusList: "C,F",
                     sort: "name"
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
                        if (jsonData.gameList != null) {
                           returnData = JSON.parse(jsonData.gameList);
                           possibleFlexGames.length = 0;
                           possibleFlexGames = returnData;
                        }
                        if (callback != null) {
                           callback(returnData);
                        }
                        return;
                     }
                  }
               });
            }
         }
         function LoadTrophiesForUser(userId, callback) {
            a$.ajax({
               type: "GET",
               service: "C#",
               async: true,
               data: {
                  lib: "selfserve",
                  cmd: "getTrophiesForUser",
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
                     userTrophiesInformation.length = 0;
                     if (jsonData.userTrophyList != null) {
                        returnData = JSON.parse(jsonData.userTrophyList);
                        RenderUserTrophiesCount(returnData.length);
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
         function LoadUserTrophiesData(callback) {
            let userId = $("#userTrophies_usersFilter", element).val();
            if (userId != null && userId != "") {
               LoadAvailableAGameLeagues(userId);
               LoadAvailableGameList();
               LoadTrophiesForUser(userId, function (userTrophiesData) {
                  let selectedTrophiesId = -1;
                  let trophies = [];
                  selectedTrophiesId = $("#userTrophies_trophiesFilter", element).val();
                  userTrophiesInformation.length = 0;
                  userTrophiesInformation = userTrophiesData;
                  $("#userTrophies_EarnedListHolder", element).empty();
                  if (selectedTrophiesId > 0) {
                     trophies = userTrophiesInformation.filter(x => x.TrophyId == selectedTrophiesId);
                  }
                  else {
                     trophies = userTrophiesInformation;
                  }
                  // let selectedGroup = "";
                  // selectedGroup = $("#userTrophies_groupFilter", element).val();
                  // if(selectedGroup != "")
                  // {
                  //    trophies = trophies.filter(x => x.TrophiesIdSource?.TrophiesGroupingName == selectedGroup);
                  // }
                  trophies = trophies.sort(function (a, b) {
                     if (a.EarnedDate > b.EarnedDate) {
                        return -1;
                     }
                     else if (a.EarnedDate < b.EarnedDate) {
                        return 1;
                     }
                     return 0;
                  });
                  RenderTrophiesData(trophies);
               });
               RenderUserData(userId);
               ShowUserPanel();
            }
            if (callback != null) {
               callback();
            }
         }
         function LoadAvailableAGameLeagues(userId, callback) {
            if (userId == null || userId == "") {
               userId = $("#userTrophies_usersFilter", element).val();
            }
            if (possibleAGameLeagues != null && possibleAGameLeagues.length > 0) {
               if (callback != null) {
                  callback(possibleAGameLeagues);
               }
               return;
            }
            else {
               a$.ajax({
                  type: "GET",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "flex",
                     cmd: "getDivisionsByUserId",
                     userid: userId
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
                        let returnData = JSON.parse(jsonData.userDivisionsList);
                        possibleAGameLeagues.length = 0;
                        for (let i = 0; i < returnData.length; i++) {
                           possibleAGameLeagues.push(returnData[i]);
                        }
                        if (callback != null) {
                           callback(possibleAGameLeagues);
                        }
                     }
                  }
               });

            }
         }
         function RenderTrophiesData(trophiesList) {
            let trophiesInformationHolder = $("<div />");
            if (trophiesList != null) {
               if (Array.isArray(trophiesList)) {
                  if (trophiesList.length > 0) {
                     for (let bc = 0; bc < trophiesList.length; bc++) {
                        let trophiesItem = trophiesList[bc];
                        RenderTrophiesItem(trophiesItem, trophiesInformationHolder);
                     }
                  }
               }
               else {
                  RenderTrophiesItem(trophiesList, trophiesInformationHolder);
               }
            }
            $("#userTrophies_EarnedListHolder", element).empty();
            $("#userTrophies_EarnedListHolder", element).append(trophiesInformationHolder);
         }
         function ClearUserDataInformation() {
            $("#user-avatar", element).prop("src", defaultAvatarUrl);
            $("#user-full-name", element).empty();
            $("#user-trophies-count", element).empty();
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
            //$("#user-trophies-count", element).append(trophiesCount);
         }
         function RenderTrophiesItem(itemToRender, objectToAddTo) {
            let trophyDataHolder = $("<div class=\"user-trophy-row-item-holder\" />");
            let trophyItem = $(itemToRender)[0];
            let trophyImageHolder = $("<div class=\"user-trophy-item-holder user-trophy-image\"/>");
            let trophyImage = $("<img />");
            let trophyNameHolder = $("<div class=\"user-trophy-item-holder user-trophy-name\" />");
            let trophyEarnedHolder = $("<div class=\"user-trophy-item-holder user-trophy-date\" />");
            let trophyAwardForHolder = $("<div class=\"user-trophy-item-holder user-trophy-award-for\" />");
            let trophyPositionHolder = $("<div class=\"user-trophy-item-holder user-trophy-position-status\" />");
            let trophyButtonHolder = $("<div class=\"user-trophy-item-holder user-trophy-button-holder\" />");

            let trophyName = "No Trophy Name";
            let trophyImageUrl = "empty-trophy.png";
            let trophyEarnedDate = "";
            let userPosition = 0;
            let totalPositions = 0;
            let positionString = "";
            let gameName = "&nbsp;";
            let trophyButton = $("<button class=\"user-trophy-button btn-delete\"  title=\"Delete\" id=\"RemoveButton_" + trophyItem.UserTrophyId + "\"><i class=\"fa fa-trash\"></i></button>");
            trophyButton.off("click").on("click", function () {
               let buttonId = this.id;
               let id = buttonId.split("_")[1];
               RemoveUserTrophies(id, function () {
                  LoadUserTrophiesData();
               });
            });
            if (trophyItem.TrophyIdSource != null) {
               trophyName = trophyItem.TrophyIdSource.TrophyName;
               trophyImageUrl = trophyItem.TrophyIdSource.ImageUrl;
               trophyEarnedDate = new Date(trophyItem.EarnedDate).toLocaleDateString();
            }
            userPosition = parseInt(trophyItem.AwardPosition);
            totalPositions = parseInt(trophyItem.TotalPositions);
            if (userPosition != 0 && totalPositions != 0) {
               positionString = userPosition + " of " + totalPositions;
            }
            else {
               positionString = "&nbsp;";
            }
            if (trophyItem.FlexGameId != null && trophyItem.FlexGameId != 0) {
               let game = Global_GetFlexGameInformation(trophyItem.FlexGameId);
               if (game != null) {
                  gameName = game.GameName;
               }
            }
            trophyNameHolder.append(trophyName);

            trophyImage.prop("src", baseTrophiesUrl + trophyImageUrl);
            trophyImage.width(75);
            trophyImageHolder.append(trophyImage);

            trophyEarnedHolder.append(trophyEarnedDate);

            trophyAwardForHolder.append(gameName);

            trophyPositionHolder.append(positionString);

            trophyButtonHolder.append(trophyButton);

            trophyDataHolder.append(trophyImageHolder);
            trophyDataHolder.append(trophyNameHolder);
            trophyDataHolder.append(trophyEarnedHolder);
            trophyDataHolder.append(trophyAwardForHolder);
            trophyDataHolder.append(trophyPositionHolder);
            trophyDataHolder.append(trophyButtonHolder);

            $(objectToAddTo).append(trophyDataHolder);
         }
         function RenderUserTrophiesCount(userTotalTrophiesCount) {
            $("#user-trophy-count", element).empty();
            $("#user-trophy-count", element).append(userTotalTrophiesCount);
         }
         function LoadAddTrophiesToUser(callback) {
            let selectedUserId = $("#userTrophies_usersFilter", element).val();
            let user = possibleUsers.find(x => x.UserId == selectedUserId);
            let userFullName = "";
            if (user != null) {
               userFullName = user.UserFullName;
            }
            $("#userTrophyManager_AssignTo", element).val(selectedUserId);
            $("#userTrophyManager_AssignToReadOnlyLabel", element).text(userFullName);
            LoadGameOptionsLists();
            if (callback != null) {
               callback();
            }
            return;
         }
         function LoadSelectedTrophiesImage(trophyId) {
            let trophy = possibleTrophies.find(x => x.TrophyId == trophyId);
            let imageUrl = baseTrophiesUrl + "empty-trophy.png";
            if (trophy != null && trophy.ImageUrl != null && trophy.ImageUrl != "") {
               imageUrl = baseTrophiesUrl + trophy.ImageUrl;
            }
            $("#userTrophyManager_TrophyImage", element).prop("src", imageUrl);
            $("#userTrophyManager_TrophyImage", element).height(150);
         }
         function ValidateForm(callback) {
            var formValid = true;
            let errorMessages = [];
            let trophyId = $("#userTrophyManager_TrophyId", element).val();
            let awardPosition = $("#userTrophyManager_AwardPosition", element).val();
            let totalPositions = $("#userTrophyManager_TotalPosition", element).val();
            let earnedDate = $("#userTrophyManager_EarnedDate", element).val();

            if (trophyId == null || trophyId == "") {
               errorMessages.push({ message: "Trophy is Required.", fieldclass: "", fieldid: "userTrophyManager_TrophyId" });
               formValid = false;
            }
            if (earnedDate == null || earnedDate == "") {
               errorMessages.push({ message: "Date is Required.", fieldclass: ".user-trophies-manager-earned-date", fieldid: "" });
               formValid = false;
            }
            else {
               if (new Date(earnedDate) > new Date()) {
                  errorMessages.push({ message: "Date must be before today.", fieldclass: ".user-trophies-maanger-earned-date", fieldid: "" });
                  formValid = false;
               }
            }
            if (awardPosition == null || awardPosition == "") {
               errorMessages.push({ message: "Award Position is Required.", fieldclass: ".user-trophies-manager-award-position", fieldid: "" });
               formValid = false;
            }
            else {
               if (parseInt(awardPosition) < 0) {
                  errorMessages.push({ message: "Award Position must be at least 0.", fieldclass: ".user-trophies-manager-award-position", fieldid: "" });
                  formValid = false;
               }
            }
            if (totalPositions == null || totalPositions == "") {
               errorMessages.push({ message: "Total Position is Required.", fieldclass: ".user-trophies-manager-total-position", fieldid: "" });
               formValid = false;
            }
            else {
               if (parseInt(totalPositions) < 0) {
                  errorMessages.push({ message: "Total Positions must be at least 0.", fieldclass: ".user-trophies-manager-total-position", fieldid: "" });
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
         function SaveTrophiesForm(callback) {
            let trophiesDataToSave = new Object();
            trophiesDataToSave.UserTrophiesId = -1;
            trophiesDataToSave.TrophyId = parseInt($("#userTrophyManager_TrophyId", element).val());
            trophiesDataToSave.UserId = $("#userTrophyManager_AssignTo", element).val();
            trophiesDataToSave.EarnedDate = new Date($("#userTrophyManager_EarnedDate", element).val());
            let gameId = parseInt($("#userTrophyManager_FlexGameId", element).val());
            if (gameId != null && gameId != 0) {
               trophiesDataToSave.FlexGameId = gameId;
            }
            let aGameDivisionId = parseInt($("#userTrophyManager_AGameDivisionId", element).val());
            if (aGameDivisionId != null && aGameDivisionId != 0) {
               trophiesDataToSave.AGameLeagueId = aGameDivisionId;
            }
            trophiesDataToSave.AwardPosition = parseInt($("#userTrophyManager_AwardPosition", element).val());
            trophiesDataToSave.TotalPositions = parseInt($("#userTrophyManager_TotalPosition", element).val());
            trophiesDataToSave.EntDt = new Date();
            trophiesDataToSave.EntBy = legacyContainer.scope.TP1Username;

            a$.ajax({
               type: "GET",
               service: "C#",
               async: true,
               data: {
                  lib: "selfserve",
                  cmd: "assignTrophyToUser",
                  trophyData: JSON.stringify(trophiesDataToSave)
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
         function RemoveUserTrophies(userTrophyId, callback) {
            if (confirm("You are about to remove this trophy.\nClick OK to continue with removal.")) {
               a$.ajax({
                  type: "GET",
                  service: "C#",
                  async: true,
                  data: {
                     lib: "selfserve",
                     cmd: "removeUserTrophies",
                     usertrophyid: userTrophyId
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
            $("#userTrophyManager_AssignToReadOnlyLabel", element).empty();
            $("#userTrophyManager_AssignTo", element).val("");
            $("#userTrophyManager_TrophyId", element).val("");
            $("#userTrophyManager_EarnedDate", element).val("");
            $("#userTrophyManager_TrophiesImage", element).prop("src", "");
            $("#userTrophyManager_AwardPosition", element).val("0");
            $("#userTrophyManager_TotalPosition", element).val("0");
            $(".error-information-holder", element).empty();
            $(".error-information-holder", element).hide();

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
         function ShowAddTrophiesPanel(callback) {
            $("#userTrophyManagementPanel", element).show();
            if (callback != null) {
               callback();
            }
            return;
         }
         function HideAddTrophiesPanel(callback) {
            $("#userTrophyManagementPanel", element).hide();
            if (callback != null) {
               callback();
            }
            return;
         }
         scope.load = function () {
            scope.Initialize();
            LoadFilterOptions();
            $("#userTrophies_usersFilter", element).off("change").on("change", function () {
               possibleAGameLeagues.length = 0;
               LoadUserTrophiesData();
            });

            $("#userTrophies_trophiesFilter", element).off("change").on("change", function () {
               LoadUserTrophiesData();
            });
            // $("#userTrophies_groupFilter", element).off("change").on("change", function(){
            //    LoadUserTrophiesData();
            // });
            $("#btnAddUserTrophy", element).off("click").on("click", function () {
               LoadAddTrophiesToUser(function () {
                  ShowAddTrophiesPanel();
               });
            });
            $(".btn-close", element).off("click").on("click", function () {
               ClearForm(function () {
                  HideAddTrophiesPanel();
               });
            });
            $("#btnSave", element).off("click").on("click", function () {
               ValidateForm(function () {
                  SaveTrophiesForm(function () {
                     ClearForm();
                     LoadUserTrophiesData();
                     HideAddTrophiesPanel();
                  });
               });
            });
            $("#userTrophyManager_TrophyId", element).off("change").on("change", function () {
               let value = $(this).val();
               LoadSelectedTrophiesImage(value);
            });

         };
         scope.load2 = function () {
            HideAll();
         }
         scope.load2();
         //scope.load();
         ko.postbox.subscribe("LoadUserTrophiesForm", function () {
            ClearUserDataInformation();
            RenderTrophiesData(null);
            scope.load();
         });
      }
   };
}]);