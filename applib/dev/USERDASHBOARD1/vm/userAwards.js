angularApp.directive("ngUserAwards", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/USERDASHBOARD1/view/userAwards.htm?' + Date.now(),
      scope: {
         assoc: "@",
         text: "@",
         details: "@",
         cid: "@",
         filters: "@",
         panel: "@",
         hidetopper: "@",
         toppertext: "@"
      },
      require: '^ngLegacyContainer',
      link: function (scope, element, attrs, legacyContainer) {
         HideAll();
         var userId = legacyContainer.scope.TP1Username;
         var baseBadgesUrl = window.location.protocol + "//" + window.location.hostname + "/applib/css/images/badges/";
         var baseClientBadgesUrl = window.location.protocol + "//" + window.location.hostname;
         var baseTrophyUrl = window.location.protocol + "//" + window.location.hostname + "/applib/css/images/trophy/";
         var defaultBadgeUrl = window.location.protocol + "//" + window.location.hostname + "/applib/css/images/badges/placeholder-badge.png";
         var myPoints = [];
         var myBadges = [];
         var myTrophies = [];
         var myFlexGames = [];
         var myAGameDivisions = [];
         var clientUploadedImageKey = "/UPLOADS/";//TODO: Change to a config parameter
         var currentUsers = [];
         //var possibleTrophies = [];
         let possibleSeasons = [];
         let myCustomPoints = [];
         let currentSeasonCode = null;

         /* Directive Events Handling START */
         $("#myTotalPoints", element).off("click").on("click", function () {
            ToggleMyPointsDetails();
         });
         $("#showAllAvailableBadges", element).off("click").on("click", function () {
            DisplayAllAvailableBadges();
         });
         $("#closeAvailableBadgesPanel", element).off("click").on("click", function () {
            HideAllAvailableBadgesPanel();
         });
         $("#pointsbtn", element).off("click").on("click", function () {
            let itemId = this.id;
            HideAllContentPanels();
            ShowPointsContentPanel();
            AddActiveClass(itemId);
         });
         $("#badgesbtn", element).off("click").on("click", function () {
            let itemId = this.id;
            HideAllContentPanels();
            ShowBadgesContentPanel();
            AddActiveClass(itemId);
         });
         $("#trophybtn", element).off("click").on("click", function () {
            let itemId = this.id;
            HideAllContentPanels();
            ShowTrophiesContentPanel();
            AddActiveClass(itemId);
         });
         $("#btnRedeemPoints", element).off("click").on("click", function () {
            let link = HandleRedeemLink();
            document.location.href = link;
         });
         $("#btnRefreshPoints", element).off("click").on("click", function () {
            ko.postbox.publish("UserAwardsReload", true);
         });
         $("#customPointsbtn", element).off("click").on("click", function(){
            let itemId = this.id;
            HideAllContentPanels();
            ShowCustomPointsContentPanel();
            AddActiveClass(itemId);
         });
         $("#customPointsSeasonSelector", element).off("change").on("change", function(){
            RenderMyCustomPoints();
         });
         $("#closeAvailableTrophyPanel", element).off("click").on("click", function(){
            HideFullTrophyDisplay();
         });
         /* Directive Events Handling END */
         function Initalize() {
            myFlexGames.length = 0;
            HideAllAvailableBadgesPanel();
            LoadAllAvailableSeasons();
            //LoadAllAvailableTrophies();
         }

         function LoadAllAwards() {
            LoadMyPoints(function (pointsArrayToDisplay) {
               RenderMyPoints(pointsArrayToDisplay);
            });
            LoadMyBadges(function (badgesToDisplay) {
               RenderMyBadges(badgesToDisplay);
            });
            LoadMyTrophies(function (trophiesToDisplay) {
               RenderMyTrophies(trophiesToDisplay);
            });
            LoadMyCustomPoints();
            SetActiveItem();
         }
         function LoadAllAvailableSeasons()
         {
            GetAvailableSeasons(function(seasonsList){
               SetCurrentSeason(null, seasonsList);
               RenderAvailableSeasons(null, seasonsList);
            });
         }
         // function LoadAllAvailableTrophies(callback)
         // {
         //    a$.ajax({
         //       type: "GET",
         //       service: "C#",
         //       async: true,
         //       data: {
         //          lib: "selfserve",
         //          cmd: "getAllAvailableTrophies"
         //       },
         //       dataType: "json",
         //       cache: false,
         //       error: a$.ajaxerror,
         //       success: function (jsonData) {
         //          if (jsonData.errormessage != null && jsonData.errormessage == true) {
         //             a$.jsonerror(jsonData);
         //             //TODO: Determine if we still show something with an error here?
         //             return;
         //          }
         //          else {
         //             let returnData = JSON.parse(jsonData.trophiesList);
         //             possibleTrophies.length = 0;

         //             for(let i = 0; i < returnData.length; i++)
         //             {
         //                possibleTrophies.push(returnData[i]);
         //             }
         //             if (callback != null) {
         //                callback(returnData);
         //             }
         //             return;

         //          }
         //       }
         //    });
         //    return;
         // }
         function LoadMyCustomPoints(callback)
         {
            $("#customPointsSeasonSelector", element).val(currentSeasonCode);
            GetMyCustomPoints(function(list){
               RenderMyCustomPoints(callback, list);
            });
         }
         function LoadMyPoints(callback) {
            a$.ajax({
               type: "GET",
               service: "C#",
               async: true,
               data: {
                  lib: "selfserve",
                  cmd: "getPointsForUser",
                  userid: userId,
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (jsonData) {
                  if (jsonData.errormessage != null && jsonData.errormessage == true) {
                     a$.jsonerror(jsonData);
                     //TODO: Determine if we still show something with an error here?
                     return;
                  }
                  else {
                     let returnData = null;
                     myPoints.length = 0;

                     if (jsonData.userPointsList != null) {
                        returnData = JSON.parse(jsonData.userPointsList);
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
         function RenderMyPoints(pointsArrayToDisplay, callback) {
            let totalPoints = 0;
            let pointsDetailHolder = $("<div class=\"total-points-detail-holder\" />");
            if (pointsArrayToDisplay == null) {
               pointsArrayToDisplay = myPoints;
            }

            if (pointsArrayToDisplay == null || pointsArrayToDisplay.length == 0) {
               pointsDetailHolder.append("Currently no credits found.");
               pointsDetailHolder.addClass("total-points-none");
               $(".dashboard-awardsbox_points").addClass("dashboard-awardsbox_points-none");
            }
            else {
               totalPoints = GetTotalPointsForUser(pointsArrayToDisplay);
               let maxAmountToDisplay = 10;
               if (pointsArrayToDisplay.length <= maxAmountToDisplay) {
                  maxAmountToDisplay = pointsArrayToDisplay.length;
               }
               for (let pc = 0; pc < maxAmountToDisplay; pc++) {
                  let dataItem = pointsArrayToDisplay[pc];
                  let pointsHistoryItem = $("<div class=\"points-item-detail-history-item-holder\" />");
                  let pointsDateAssignedHolder = $("<span class=\"points-item-assigned-date-holder\" />");
                  pointsDateAssignedHolder.append(new Date(dataItem.PointsValueDate).toLocaleDateString());
                  let pointsAssignedByHolder = $("<span class=\"points-item-assigned-by-holder\"/>");
                  let awardByName = dataItem.AwardedBy;
                  let user = GetUserByUserName(dataItem.AwardedBy);
                  if (user != null) {
                     awardByName = user.UserFullName;
                  }
                  pointsAssignedByHolder.append(awardByName);
                  let pointsGameInfo = $("<span class=\"points-item-game-data\" />");
                  let gameName = "Awarded Points";

                  let pointsValueHolder = $("<span class=\"points-item-points-value-holder\"/>");
                  if (dataItem.PointsValue < 0) {
                     pointsValueHolder.addClass("red-ledger-value");
                     pointsGameInfo.addClass("red-ledger-value");

                     gameName = "Redeption";
                     if (dataItem.PrizeOptionIdSource != null) {
                        gameName = "Redemption: " + dataItem.PrizeOptionIdSource.PrizeOptionName;
                     }
                  }
                  else {
                     if (dataItem.FlexGameId != null) {
                        let game = GetFlexGameInformation(dataItem.FlexGameId);
                        if (game != null) {
                           gameName = game.GameName;
                        }
                     }

                     if (dataItem.BadgeIdSource != null) {
                        gameName = "Badge Earned: " + dataItem.BadgeIdSource.BadgeName;
                     }
                  }
                  pointsGameInfo.append(gameName);
                  pointsValueHolder.append(dataItem.PointsValue);

                  pointsHistoryItem.append(pointsDateAssignedHolder);
                  pointsHistoryItem.append(pointsAssignedByHolder);
                  pointsHistoryItem.append(pointsGameInfo);
                  pointsHistoryItem.append(pointsValueHolder);

                  pointsDetailHolder.append(pointsHistoryItem);
               }
            }

            $("#totalPointsHolder", element).empty();
            $("#totalPointsHolder", element).append(totalPoints);

            $("#myPointsHolder", element).empty();
            $("#myPointsHolder", element).append(pointsDetailHolder);

            if (callback != null) {
               callback();
            }
            return;
         }

         function GetTotalPointsForUser(array) {
            let returnValue = 0;
            for (let pc = 0; pc < array.length; pc++) {
               let dataItem = array[pc];
               if (dataItem != null) {
                  returnValue += dataItem.PointsValue;
               }
            }
            return returnValue;
         }
         function LoadMyBadges(callback) {

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
                  if (jsonData.errormessage != null && jsonData.errormessage == true) {
                     a$.jsonerror(jsonData);
                     //TODO: Determine if we still show something with an error here?
                     return;
                  }
                  else {

                     let returnData = null;
                     myBadges.length = 0;

                     if (jsonData.userBadgesList != null) {
                        returnData = JSON.parse(jsonData.userBadgesList);
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
         function RenderMyBadges(badgesArrayToDisplay, callback) {
            let totalBadgesCount = 0;
            let badgesListHolder = $("<div class=\"my-badges-list-holder\" />");

            if (badgesArrayToDisplay == null) {
               badgesArrayToDisplay = myBadges;
            }
            if (badgesArrayToDisplay == null || badgesArrayToDisplay.length == 0) {
               badgesListHolder.append("Currently no badges found.");
            }
            else {
               let currentGroupingName = "";

               totalBadgesCount = badgesArrayToDisplay.length;

               for (let bc = 0; bc < badgesArrayToDisplay.length; bc++) {
                  let dataItem = badgesArrayToDisplay[bc];
                  let badgeLevel = 1;
                  let badgeImageUrl = "placeholder-badge.png";
                  isNewGroup = false;

                  if (dataItem.BadgeIdSource != null) {
                     if (currentGroupingName != dataItem.BadgeIdSource.BadgeGroupingName) {
                        currentGroupingName = dataItem.BadgeIdSource.BadgeGroupingName;
                     }
                     badgeLevel = dataItem.BadgeIdSource.BadgeLevel;
                     if (dataItem.BadgeIdSource.ImageUrl != null && dataItem.BadgeIdSource.ImageUrl != "") {
                        badgeImageUrl = dataItem.BadgeIdSource.ImageUrl;
                     }
                  }
                  let badgeHolder = $("<div class=\"current-badges-holder\" />");
                  let badgesImageHolder = $("<div class=\"my-badges-images-holder\" />");
                  let badgesImage = $("<img class=\"stacked-badge-image badge-level-" + badgeLevel + " current-level\"/>");
                  badgesImage.prop("src", baseBadgesUrl + badgeImageUrl);
                  badgesImage.height(75);
                  badgesImage.prop("alt", "Badge Level " + badgeLevel);

                  badgesImageHolder.append(badgesImage);

                  let badgeNameHolder = $("<div class=\"my-badge-name-holder\" />");
                  badgeNameHolder.append(dataItem.Name);

                  let badgeLevelEarnedHolder = $("<div class=\"my-badge-level-earned-holder\" />");
                  badgeLevelEarnedHolder.append("Level: ");
                  badgeLevelEarnedHolder.append(badgeLevel);

                  let badgeEarnedDateHolder = $("<div class=\"my-badge-date-earned-holder\"/>");
                  badgeEarnedDateHolder.append(new Date(dataItem.EarnedDate).toLocaleDateString());

                  badgeHolder.append(badgesImageHolder);
                  badgeHolder.append(badgeNameHolder);
                  badgeHolder.append(badgeLevelEarnedHolder);
                  badgeHolder.append(badgeEarnedDateHolder);

                  badgesListHolder.append(badgeHolder);
               }
            }
            $("#totalBadges", element).empty();
            $("#totalBadges", element).append(totalBadgesCount);
            $("#myBadgesHolder", element).empty();
            $("#myBadgesHolder", element).append(badgesListHolder);

            if (callback != null) {
               callback();
            }
            return;
         }

         function GetUserByUserName(userName) {
            let returnObject = currentUsers.find(u => u.UserId == userName);
            if (returnObject == null) {
               a$.ajax({
                  type: "GET",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "selfserve",
                     cmd: "getUserProfile",
                     userid: userName
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (jsonData) {
                     if (jsonData.errormessage != null && jsonData.errormessage == true) {
                        a$.jsonerror(jsonData);
                        //TODO: Determine if we still show something with an error here?
                        return;
                     }
                     else {

                        var userReturn = JSON.parse(jsonData.userFullProfile);
                        currentUsers.push(userReturn);
                        returnObject = userReturn;
                        return returnObject;
                     }
                  }
               });
               return returnObject;
            }
            else {
               return returnObject;
            }
         }

         function LoadAllBadges(callback) {
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
                  if (jsonData.errormessage != null && jsonData.errormessage == true) {
                     a$.jsonerror(jsonData);
                     //TODO: Determine if we still show something with an error here?
                     return;
                  }
                  else {

                     let returnData = null;
                     if (jsonData.badgesList != null) {
                        returnData = JSON.parse(jsonData.badgesList);
                     }
                     if (callback != null) {
                        callback(returnData);
                     }
                     return;
                  }
               }
            });
         }
         function RenderAllBadges(badgeListToDisplay, callback) {
            $("#allAvailableBadgesHolder", element).empty();
            let badgeListHolder = $("<div class=\"all-badges-list-holder\"/>");
            for (let bc = 0; bc < badgeListToDisplay.length; bc++) {
               let imageUrl = "placeholder-badge.png";

               let badgeItem = badgeListToDisplay[bc];
               if (badgeItem.ImageUrl != null && badgeItem.ImageUrl != "") {
                  imageUrl = badgeItem.ImageUrl;
               }
               let badgeImageSource = "";

               if (imageUrl.toUpperCase().includes(clientUploadedImageKey.toUpperCase())) {
                  badgeImageSource = baseClientBadgesUrl + imageUrl;
               }
               else {
                  badgeImageSource = baseBadgesUrl + imageUrl;
               }

               let badgeHolder = $("<div class=\"all-badges-item\" />");
               let badgeNameHolder = $("<div class=\"badge-name\" />");
               let badgeDescriptionHolder = $("<div class=\"badge-description\" />");
               let badgeImageHolder = $("<img />");
               badgeImageHolder.prop("src", badgeImageSource);

               badgeImageHolder.height(75);

               badgeNameHolder.append(badgeItem.BadgeName);

               badgeHolder.append(badgeImageHolder);
               badgeHolder.append(badgeNameHolder);
               if (badgeItem.BadgeDesc != null && badgeItem.BadgeDesc != "") {
                  badgeDescriptionHolder.append(badgeItem.BadgeDesc);
                  badgeHolder.append(badgeDescriptionHolder);
               }
               badgeListHolder.append(badgeHolder);
            }
            $("#allAvailableBadgesHolder", element).append(badgeListHolder);

            if (callback != null) {
               callback();
            }
            return;
         }
         function LoadMyTrophies(callback) {
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
                  if (jsonData.errormessage != null && jsonData.errormessage == true) {
                     a$.jsonerror(jsonData);
                     //TODO: Determine if we still show something with an error here?
                     return;
                  }
                  else {

                     let returnData = null;
                     myTrophies.length = 0;
                     if (jsonData.userTrophyList != null) {
                        returnData = JSON.parse(jsonData.userTrophyList);
                        myTrophies = returnData;
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
         function RenderMyTrophies(trophiesArrayToDisplay, callback) {
            let trophyListHolder = $("<div class=\"my-trophy-list-holder\" />");
            if (trophiesArrayToDisplay == null) {
               trophiesArrayToDisplay = myTrophies;

            }
            let totalTrophyCount = 0;
            if (trophiesArrayToDisplay == null || trophiesArrayToDisplay.length == 0) {
               trophyListHolder.append("Currently no trophies found.");
               trophyListHolder.addClass("total-trophies-none");
            }
            else {

               totalTrophyCount = trophiesArrayToDisplay.length;

               trophiesArrayToDisplay = SortTrophyArray(trophiesArrayToDisplay);

               for (let tc = 0; tc < trophiesArrayToDisplay.length; tc++) {
                  let trophyImageUrl = "silver-trophy.png";

                  let dataItem = trophiesArrayToDisplay[tc];
                  let positionName = "";

                  if (dataItem.TrophyIdSource != null) {
                     if (dataItem.TrophyIdSource.ImageUrl != null && dataItem.TrophyIdSource.ImageUrl != "") {
                        trophyImageUrl = dataItem.TrophyIdSource.ImageUrl;
                        positionName = dataItem.TrophyIdSource.DisplayName;
                     }
                  }

                  let trophyHolder = $("<div class=\"current-trophies-holder\" />");
                  let trophyImageHolder = $(`<div class=\"my-trophies-images-holder\" id="trophyImageHolder_${dataItem.UserTrophyId}" />`);
                  let trophyImage = $("<img />");
                  trophyImage.prop("src", baseTrophyUrl + trophyImageUrl);
                  trophyImage.height(95);

                  trophyImageHolder.append(trophyImage);

                  let trophyGameNameHolder = $("<div class=\"my-trophy-game-name-holder\" />");
                  let gameName = "";
                  if (dataItem.FlexGameId != null) {
                     let gameInfo = GetFlexGameInformation(dataItem.FlexGameId);
                     if (gameInfo != null) {
                        gameName = gameInfo.GameName;
                     }
                  }

                  if(dataItem.AGameLeagueId != null)
                  {
                     let aGameInfo = GetAGameDivisionInformation(dataItem.AGameLeagueId);
                     if(aGameInfo != null)
                     {
                         gameName = aGameInfo.DivisionName;
                     }
                  }
                  if (gameName != "") {
                     trophyGameNameHolder.append("<div class=\"my-trophy-game-name-label\">" + gameName + "</div>");
                  }
                  if (positionName != "") {
                     trophyGameNameHolder.append("<div class=\"my-trophy-position-name-label\">" + positionName + "</div>");
                  }
                  trophyGameNameHolder.append("Position: ");
                  trophyGameNameHolder.append(dataItem.AwardPosition);

                  let trophyWonHolder = $("<div class=\"my-trophy-won-holder\" />");
                  trophyWonHolder.append("");
                  trophyWonHolder.append(new Date(dataItem.EarnedDate).toLocaleDateString());

                  $(trophyImageHolder).on("click", function(){
                     let id = this.id;
                     let userTrophyId = id.split("_")[1];
                     RenderUserTrophyFull(null, userTrophyId);


                  });

                  trophyHolder.append(trophyImageHolder);
                  trophyHolder.append(trophyGameNameHolder);
                  trophyHolder.append(trophyWonHolder);

                  trophyListHolder.append(trophyHolder)
               }
            }
            $("#totalTrophies", element).empty();
            $("#totalTrophies", element).append(totalTrophyCount);
            $("#myTrophiesHolder", element).empty();
            $("#myTrophiesHolder", element).append(trophyListHolder);


            if (callback != null) {
               callback();
            }
            return;
         }
         function GetFlexGameInformation(gameId, callback) {
            let game = myFlexGames.find(g => g.FlexGameId == gameId);
            if (game == null) {
               game = LoadFlexGameDataFromDatabase(gameId);
            }

            if (callback != null) {
               callback(game);
            }
            return game;
         }
         function GetAGameDivisionInformation(aGameDivisionId, callback)
         {
            let aGameDivision = myAGameDivisions.find(g => g.DivisionId == aGameDivisionId);
            if(aGameDivision == null)
            {
               aGameDivision = LoadAGameDivisionDataFromDatabase(aGameDivisionId);
            }
            if(callback != null)
            {
               callback(aGameDivision);
            }
            return aGameDivision;
         }
         function LoadFlexGameDataFromDatabase(gameId) {
            let returnData = null;
            a$.ajax({
               type: "GET",
               service: "C#",
               async: false,
               data: {
                  lib: "flex",
                  cmd: "getGameById",
                  gameid: gameId
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (jsonData) {
                  if (jsonData.errormessage != null && jsonData.errormessage == true) {
                     a$.jsonerror(jsonData);
                     //TODO: Determine if we still show something with an error here?
                     return;
                  }
                  else {

                     if (jsonData.gameList != null) {
                        returnData = JSON.parse(jsonData.gameList);
                        myFlexGames.push(returnData);
                     }
                  }
               }
            });
            return returnData;
         }
         function LoadAGameDivisionDataFromDatabase(divisionId) {
            let returnData = null;
            a$.ajax({
               type: "GET",
               service: "C#",
               async: false,
               data: {
                  lib: "flex",
                  cmd: "getAGameDivisionById",
                  divisionid: divisionId,
                  deepload: false
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (jsonData) {
                  if (jsonData.errormessage != null && jsonData.errormessage == true) {
                     a$.jsonerror(jsonData);
                     //TODO: Determine if we still show something with an error here?
                     return;
                  }
                  else {

                     if (jsonData.returnDivision != null) {
                        returnData = JSON.parse(jsonData.returnDivision);
                        myAGameDivisions.push(returnData);
                     }
                  }
               }
            });
            return returnData;
         }
         function DisplayAllAvailableBadges() {
            LoadAllBadges(function (badgesList) {
               RenderAllBadges(badgesList, function () {
                  ShowAllAvailableBadgesPanel();
               });
            });
         }
         function SortTrophyArray(listToSort, callback)
         {
            let sortedList = listToSort;
            sortedList.sort((a,b)=>{
               if(new Date(a.EarnedDate) < new Date(b.EarnedDate))
               {
                  return 1;
               }
               else if(new Date(a.EarnedDate) > new Date(b.EarnedDate))
               {
                  return -1;
               }
               else
               {
                  if(a.DisplayName < b.DisplayName)
                  {
                     return -1;
                  }
                  else if (a.DisplayName > b.DisplayName)
                  {
                     return 1;
                  }
                  else
                  {
                     return 0;
                  }
               }
            });
            return sortedList;

         }

         function GetMyCustomPoints(callback, forceReload)
         {
            if(forceReload == null)
            {
               forceReload = false;
            }
            if(myCustomPoints != null && myCustomPoints.length > 0 && forceReload == false)
            {
               if(callback != null)
               {
                  callback(myCustomPoints);
               }
               else
               {
                  return myCustomPoints;
               }
            }
            else
            {
               a$.ajax({
                  type: "GET",
                  service: "C#",
                  async: true,
                  data: {
                     lib: "flex",
                     cmd: "getAllCustomPointsRecordsForUser",
                     userid: legacyContainer.scope.TP1Username,
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (jsonData) {
                     if (jsonData.errormessage != null && jsonData.errormessage == true) {
                        a$.jsonerror(jsonData);
                        return;
                     }
                     else {
                        let returnData = JSON.parse(jsonData.userCustomPointsList);
                        myCustomPoints.length = 0;
                        myCustomPoints = returnData;
                        if (callback != null) {
                           callback(returnData);
                        }
                        return;
                     }
                  }
               });
            }
         }
         function RenderMyCustomPoints(callback, listToRender)
         {
            if(listToRender == null)
            {
               listToRender = myCustomPoints;
            }
            let currentSeasonTotalPoints = 0;
            GetCurrentSeasonCustomPoints(function(val){
               currentSeasonTotalPoints = val;
            });
            $("#totalCustomPoints", element).empty();
            $("#totalCustomPoints", element).append(currentSeasonTotalPoints);

            $("#myCustomPointsHolder", element).empty();
            let customPointsDisplayHolder = $(`<div class="custom-point-display-holder" />`);
            let seasonSelected = $("#customPointsSeasonSelector", element).val();
            let filteredList = listToRender;
            if(seasonSelected != null && seasonSelected != "")
            {
               filteredList = listToRender.filter(i => i.GameAwardSeason == seasonSelected);
            }
            //filter ouit the list based on the season
            if(filteredList != null && filteredList.length > 0)
            {
               for(let pIndex = 0; pIndex < filteredList.length; pIndex++)
               {
                  let pointsItem = filteredList[pIndex];

                  let customPointsDisplayRow = $(`<div class="custom-points-detail-history-item-holder" />`);

                  let customPointsDateHolder = $(`<span class="custom-points-item-date-holder" />`);
                  let customPointsSeasonHolder = $(`<span class="custom-points-item-season-holder" />`);
                  let customPointsAssignedForHolder = $(`<span class="custom-points-item-award-for-holder" />`);
                  let customPointsAssignedPointsHolder = $(`<span class="custom-points-item-points-value-holder" />`);

                  customPointsDateHolder.append(new Date(pointsItem.GamePointsAssignedOnDate).toLocaleDateString());
                  let seasonName = pointsItem.GameAwardSeason;
                  if(seasonName != null && seasonName != "")
                  {
                     let seasonObject = possibleSeasons.find(s => s.SeasonCode == pointsItem.GameAwardSeason);
                     if(seasonObject != null)
                     {
                        seasonName = seasonObject.SeasonDesc;
                     }
                  }
                  customPointsSeasonHolder.append(seasonName);
                  customPointsAssignedForHolder.append(pointsItem.GamePointsAssignedFor);
                  customPointsAssignedPointsHolder.append(pointsItem.GamePointsAwarded);

                  customPointsDisplayRow.append(customPointsDateHolder);
                  customPointsDisplayRow.append(customPointsSeasonHolder);
                  customPointsDisplayRow.append(customPointsAssignedForHolder);
                  customPointsDisplayRow.append(customPointsAssignedPointsHolder);

                  customPointsDisplayHolder.append(customPointsDisplayRow);

               }
            }
            else
            {
               customPointsDisplayHolder.append("No custom credits found.");
            }

            $("#myCustomPointsHolder", element).append(customPointsDisplayHolder);
            if(callback != null)
            {
               callback();
            }
         }
         function GetCurrentSeasonCustomPoints(callback)
         {
            a$.ajax({
               type: "GET",
               service: "C#",
               async: false,
               data: {
                  lib: "flex",
                  cmd: "getCurrentSeasonPointsForUser",
                  userid: legacyContainer.scope.TP1Username,
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (jsonData) {
                  if (jsonData.errormessage != null && jsonData.errormessage == true) {
                     a$.jsonerror(jsonData);
                     return;
                  }
                  else {
                     let returnValue = parseInt(jsonData.currentUserPoints);
                     if (callback != null) {
                        callback(returnValue);
                     }
                  }
               }
            });
         }
         function GetAvailableSeasons(callback, forceReload)
         {
            if(forceReload == null)
            {
               forceReload = false;
            }
            if(possibleSeasons != null && possibleSeasons.length > 0 && forceReload == false)
            {
               if(callback != null)
               {
                  callback(possibleSeasons);
               }
            }
            else
            {
               a$.ajax({
                  type: "GET",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "flex",
                     cmd: "getAllCustomAwardPointsSeasons",
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (jsonData) {
                     if (jsonData.errormessage != null && jsonData.errormessage == true) {
                        a$.jsonerror(jsonData);
                        return;
                     }
                     else {
                        let returnData = JSON.parse(jsonData.currentSeasonsList);
                        possibleSeasons.length = 0;
                        possibleSeasons = returnData;
                        if (callback != null) {
                           callback(possibleSeasons);
                        }
                     }
                  }
               });
            }
         }
         function RenderAvailableSeasons(callback, listToRender)
         {
            if(listToRender == null)
            {
               listToRender = possibleSeasons;
            }
            $("#customPointsSeasonSelector", element).empty();
            $("#customPointsSeasonSelector", element).append($(`<option value="">(All Seasons - All Credits Earned)</option>`));

            for(let sIndex = 0; sIndex < listToRender.length; sIndex++)
            {
               let seasonItem = listToRender[sIndex];
               let optionItem = $(`<option value="${seasonItem.SeasonCode}">${seasonItem.SeasonDesc}</option>`);
               $("#customPointsSeasonSelector", element).append(optionItem);
            }

            if(callback != null)
            {
               callback();
            }
         }
         function SetCurrentSeason(callback, seasonList)
         {
            if(seasonList == null)
            {
               seasonList = possibleSeasons
            }
            let today = new Date();

            for(let sIndex = 0; sIndex < seasonList.length; sIndex++)
            {
               let seasonItem = seasonList[sIndex];
               if(new Date(seasonItem.SeasonStartDate) <= today && today <= new Date(seasonItem.SeasonEndDate))
               {
                  currentSeasonCode = seasonItem.SeasonCode;
               }
            }
            if(callback != null)
            {
               callback(seasonList);
            }
         }
         function RenderUserTrophyFull(callback, userTrophyIdToRender)
         {
            $("#trophyDisplayHolder", element).empty();
            //debugger;
            if(userTrophyIdToRender != null)
            {
               let fullTrophyDisplayHolder = $(`<div />`);

               let userTrophyObject = myTrophies.find(t => t.UserTrophyId == userTrophyIdToRender);
               if(userTrophyObject != null && userTrophyObject.TrophyIdSource != null)
               {

                  let trophyImg = $(`<img src="${baseTrophyUrl + userTrophyObject.TrophyIdSource.ImageUrl}" height="500px" />`);
                  fullTrophyDisplayHolder.append(trophyImg);

                  $("#trophyDisplayHolder", element).append(fullTrophyDisplayHolder);
                  ShowFullTrophyDisplay();
               }
            }
            if(callback != null)
            {
               callback();
            }
         }
         function HideAll()
         {
            HideAllAvailableBadgesPanel();
            HideAllContentPanels();
            HideCustomPointsContentPanel();
            HideFullTrophyDisplay();
         }
         function HideAllAvailableBadgesPanel() {
            $("#allAvailableBadgesPanel", element).hide();
         }
         function ShowAllAvailableBadgesPanel() {
            $("#allAvailableBadgesPanel", element).show();
         }
         function HideAllContentPanels() {
            $("#points-content", element).hide();
            $("#badges-content", element).hide();
            $("#trophies-content", element).hide();
            HideCustomPointsContentPanel();
         }
         function ShowPointsContentPanel() {
            $("#points-content", element).show();
         }
         function ShowBadgesContentPanel() {
            $("#badges-content", element).show();
         }
         function ShowTrophiesContentPanel() {
            $("#trophies-content", element).show();
         }
         function AddActiveClass(idToActivate) {
            $('li.active').removeClass('active');
            $("#" + idToActivate).addClass('active');
         }
         function ShowCustomPointsContentPanel()
         {
            $("#custom-points-content", element).show();
         }
         function HideCustomPointsContentPanel()
         {
            $("#custom-points-content", element).hide();
         }
         function HandleRedeemLink() {
            var prefixInfo = a$.gup("prefix");
            var hrefLocation = a$.debugPrefix() + "/3/ng/PrizeRedemption/default.aspx?area=redeem";
            if (prefixInfo != null && prefixInfo != "") {
               hrefLocation += "&prefix=" + prefixInfo;
            }
            return hrefLocation;
         }
         function SetActiveItem()
         {
            let hasCustomAwards = false;
            appLib.getConfigParameterByName("CUSTOM_POINTS_AWARD_FOR_GAMES", function (returnParameter) {
               if (returnParameter != null) {
                   hasCustomAwards = (returnParameter.ParamValue.toUpperCase() == "On".toUpperCase());
               }
           });
           if(hasCustomAwards)
           {
               $("#customPointsbtn", element).show();
               $("#customPointsbtn", element).click();
           }
           else
           {
               $("#customPointsbtn", element).hide();
               $("#pointsbtn", element).click();
           }
         }
         function ShowFullTrophyDisplay()
         {
            $("#userTrophyEarnedDisplayPanel", element).show();
         }
         function HideFullTrophyDisplay()
         {
            $("#userTrophyEarnedDisplayPanel", element).hide();
         }
         scope.load = function () {
            console.log("Directive: UserAwards Load()");
            Initalize();
            let loadingUrl = a$.debugPrefix() + "/applib/css/images/acuity-loading.gif"
            LoadAllAwards();
         }
         HideAll();

         ko.postbox.subscribe("UserAwardsReload", function(forceReload){
            if(forceReload == true)
            {
               myPoints.length = 0;
               myBadges.length = 0;
               myTrophies.length = 0;
               myCustomPoints.length = 0;
            }
            LoadAllAwards();
         });
         ko.postbox.subscribe("UserAwardsLoad", function (item) {
            scope.load();
         });
      }
   }
}]);
