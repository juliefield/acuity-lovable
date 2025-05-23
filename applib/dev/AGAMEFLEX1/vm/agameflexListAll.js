angularApp.directive("ngAgameFlexListAll", ['api', '$compile', '$rootScope', function (api, $compile, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/AGAMEFLEX1/view/agameflexListAll.htm?' + Date.now(),
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
         /* Directive Variables START */
         var defaultGameBoardImage = window.location.protocol + "//" + window.location.hostname + "/3/ng/AGameFlex/images/game-bg-default.jpg";
         var defaultAvatarImage = "";
         var allPossibleFlexGames = [];
         var myAssignedWorkers = [];
         var myAssignedTeams = [];
         var participantCounts = [];
         var userHasAllParticipants = false;

         /* Directive Variables END */
         /* Page Event Handling START */
         document.addEventListener('mousemove', (e) => {
            const sqrs = document.querySelectorAll('.taco-item');

            const mouseX = e.pageX;
            const mouseY = e.pageY;

            sqrs.forEach(sqr => {
               const sqrX = sqr.offsetLeft + 20;
               const sqrY = sqr.offsetTop + 20;

               const diffX = mouseX - sqrX;
               const diffY = mouseY - sqrY;

               const radians = Math.atan2(diffY, diffX);

               const angle = radians * 180 / Math.PI;

               sqr.style.transform = `rotate(${angle}deg)`;
            })

         });
         /* Page Event Handling END */
         /* Directive Handling START */
         function Initialize() {
            DetermineUserGetsAllParticipants();
            LoadMyAssignedThings();
         }
         /* Directive Handling END */

         /* Data Handling START */
         function DetermineUserGetsAllParticipants() {
            switch (legacyContainer.scope.TP1Role.toLowerCase()) {
               case "admin".toLowerCase():
               case "CorpAdmin".toLowerCase():
               case "Management".toLowerCase():
                  userHasAllParticipants = true;
                  break;
            }

         }
         function LoadMyAssignedThings(callback, forceReload) {
            LoadAssignedTeams(function(){
               LoadAssignedWorkers(callback, forceReload);
            }, forceReload);
         }
         function LoadAssignedWorkers(callback, forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (myAssignedWorkers != null && myAssignedWorkers.length > 0 && forceReload == false) {
               if (callback != null) {
                  callback(myAssignedWorkers);
               }
            }
            else {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "selfserve",
                     cmd: "getUsersForTeamBySupervisorUserId",
                     userid: legacyContainer.scope.TP1Username
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     if (data.errormessage != null && data.errormessage != "") {
                        a$.jsonerror(data);
                        return;
                     }
                     else {
                        let myWorkersList = JSON.parse(data.teamUserProfiles);
                        myAssignedWorkers.length = 0;
                        myAssignedWorkers = myWorkersList;
                        if (callback != null) {
                           callback(myWorkersList);
                        }

                     }
                  }
               });
            }
         }
         function LoadAssignedTeams(callback, forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (myAssignedTeams != null && myAssignedTeams.length > 0 && forceReload == false) {
               if (callback != null) {
                  callback(myAssignedTeams);
               }
            }
            else {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "selfserve",
                     cmd: "getMySupervisedTeamsOnly"
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     if (data.errormessage != null && data.errormessage != "") {
                        a$.jsonerror(data);
                        return;
                     }
                     else {
                        let myTeamsList = JSON.parse(data.mySupervisedTeamsList);
                        myAssignedTeams.length = 0;
                        myAssignedTeams = myTeamsList;
                        if (callback != null) {
                           callback(myTeamsList);
                        }

                     }
                  }
               });
            }
         }
         function LoadAllFlexGames(callback, forceReload) {
            GetAllFlexGames(function (gamesList) {
               RenderAllFlexGames(callback, gamesList);
            }, forceReload);
         }
         function GetAllFlexGames(callback, forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (allPossibleFlexGames != null && allPossibleFlexGames.length > 0 && forceReload == false) {
               if (callback != null) {
                  callback(allPossibleFlexGames);
               }
            }
            else {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "flex",
                     cmd: "getGameList",
                     statuslist: "A,P"
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let gameList = JSON.parse(data.gameList);
                     allPossibleFlexGames.length = 0;
                     allPossibleFlexGames = gameList;
                     if (callback != null) {
                        callback(gameList);
                     }
                  }
               });
            }
         }
         /* Data Handling END */
         /* Render Handling START */
         function RenderAllFlexGames(callback, listToRender) {
            if (listToRender == null) {
               listToRender = allPossibleFlexGames;
            }
            let gameListingHolder = $("<div class=\"all-flex-display-game-listing-holder\" />");

            $("#allFlexGamesListingHolder", element).empty();
            if (listToRender != null && listToRender.length > 0) {
               for (let gIndex = 0; gIndex < listToRender.length; gIndex++) {
                  let gameObject = listToRender[gIndex];
                  let gameCardHolder = $("<div class=\"all-flex-display-game-card-holder\" id=\"GameCardHolder_" + gameObject.FlexGameId + "\" />");
                  RenderGameObjectToCard(gameObject, gameCardHolder);

                  gameListingHolder.append(gameCardHolder);
               }
            }
            else {
               gameListingHolder.append("No Active flex games found.");
            }
            $("#allFlexGamesListingHolder", element).append(gameListingHolder);

            if (callback != null) {
               callback();
            }
         }
         function RenderGameObjectToCard(gameObject, renderToObject) {
            let themeTagName = "";
            if (gameObject.ThemeIdSource != null) {
               themeTagName = gameObject.ThemeIdSource.ThemeTagName;
            }

            let gameCard = $("<div class=\"all-game-display-game-card " + themeTagName + "\" />");
            let gameBackgroundHolder = $("<div class=\"all-game-display-game-background-holder " + themeTagName + "\" />");
            let gameInformationHolder = $("<div class=\"all-game-display-game-info-holder " + themeTagName + "\" />");
            let leaderboardHolder = $("<div class=\"all-game-display-leaderboard-holder " + themeTagName + "\" id=\"leaderboardHolder_" + gameObject.FlexGameId + "\" />");
            let gameStatsHolder = $("<div class=\"all-game-display-game-stats " + themeTagName + "\" id=\"allDisplayGameStats_" + gameObject.FlexGameId + "\" />");

            let gameBoardBackgroundImage = gameObject.ThemeIdSource?.ThemeBoardDisplayImageName ||
               gameObject.ThemeIdSource?.ThemeLeaderboardDisplayImageName ||
               defaultGameBoardImage;
            let isPhraseGame = false;
            if (gameObject.ThemeIdSource != null) {
               isPhraseGame = (gameObject.ThemeIdSource.ThemeTypeId == 3)
            }
            if (gameBoardBackgroundImage != null && gameBoardBackgroundImage != "") {
               //gameCard.css("background-image", "url('" + window.location.protocol + "//" + window.location.hostname + gameBoardBackgroundImage + "')");
               gameBackgroundHolder.css("background-image", "url('" + window.location.protocol + "//" + window.location.hostname + gameBoardBackgroundImage + "')");
            }
            gameBackgroundHolder.append("&nbsp;");

            let gameNameHolder = $("<div class=\"all-game-display-game-name-holder " + themeTagName + "\" />");
            let gameName = gameObject.Name;
            gameNameHolder.append(gameName);

            let gameDatesHolder = $("<div class=\"all-game-display-dates-holder " + themeTagName + "\" />");
            let gameDates = new Date(gameObject.GameStartDate).toLocaleDateString() + " - " + new Date(gameObject.GameEndDate).toLocaleDateString();
            gameDatesHolder.append(gameDates);

            let kpiNameHolder = $("<div class=\"all-game-display-kpi-name-holder " + themeTagName + "\" />");
            let fullKpiName = "";
            fullKpiName = gameObject.GameKpiName;
            if (gameObject.SubKpiName != null && gameObject.SubKpiName != "") {
               fullKpiName += " - " + gameObject.SubKpiName;
            }
            kpiNameHolder.append(fullKpiName);

            let gameTypeHolder = $("<div class=\"all-game-display-game-type-holder " + themeTagName + "\" />");
            let gameTypeName = gameObject.GameTypeId;
            if (gameObject.GameTypeIdSource != null) {
               gameTypeName = gameObject.GameTypeIdSource.GameTypeName;
            }
            gameTypeHolder.append(gameTypeName);

            let gameTotalParticipantsHolder = $("<div class=\"all-game-display-total-participants-holder " + themeTagName + "\" />");
            let totalParticpantsLabel = $("<span class=\"all-game-display-total-participants-label\" />");
            let totalParticipantsCountLabel = $("<span class=\"all-game-display-total-participants-count\" />");
            let participantCount = 0;
            let participantCountLabel = "# Agents: ";
            if(gameObject.GameTypeId == 2)
            {
               participantCount = gameObject.ParticipatingTeams.length || 0;
               participantCountLabel = "# Teams: ";
            }
            else
            {
               participantCount = gameObject.GameParticipants.length || 0;
            }
            totalParticpantsLabel.append(participantCountLabel);
            totalParticipantsCountLabel.append(participantCount);

            gameTotalParticipantsHolder.append(totalParticpantsLabel);
            gameTotalParticipantsHolder.append(totalParticipantsCountLabel);


            gameInformationHolder.append(gameNameHolder);
            gameInformationHolder.append(kpiNameHolder);
            gameInformationHolder.append(gameDatesHolder);
            gameInformationHolder.append(gameTypeHolder);
            gameInformationHolder.append(gameTotalParticipantsHolder);

            let leaderboardHeader = $("<div class=\"all-game-display-leaderboard-header " + themeTagName + "\" id=\"leaderboardHeader_" + gameObject.FlexGameId + "\" />");
            let leaderboardUserRankHolder = $("<div class=\"all-game-leaderboard-user-rank-holder header-item inline-item " + themeTagName + "\" />");
            leaderboardUserRankHolder.append("#");
            let leaderboardUserHolder = $("<div class=\"all-game-leaderboard-user-name-holder header-item inline-item " + themeTagName + "\" />");
            leaderboardUserHolder.append("Name");

            let leaderboardUserScoreHolder = $("<div class=\"all-game-leaderboard-user-score-holder header-item inline-item " + themeTagName + "\" />");
            if (isPhraseGame == true) {
               leaderboardUserScoreHolder.append("&nbsp;");
            }
            else {
               leaderboardUserScoreHolder.append("Score");
            }

            leaderboardHeader.append(leaderboardUserRankHolder);
            leaderboardHeader.append(leaderboardUserHolder);
            leaderboardHeader.append(leaderboardUserScoreHolder);

            leaderboardHolder.append(leaderboardHeader);

            let leaderboardDataHolder = $("<div class=\"all-game-display-leaderboard-data-holder " + themeTagName + "\" id=\"leaderboardDataHolder_" + gameObject.FlexGameId + "\" />");

            if (gameObject.GameTypeId == 1) {
               for (let uIndex = 0; uIndex < gameObject.GameLeaderboard.length; uIndex++) {
                  let leaderboardUser = gameObject.GameLeaderboard[uIndex];
                  let leaderboardRow = $("<div class=\"all-game-leaderboard-user-row " + themeTagName + "\" id=\"leaderboardUserRow_" + gameObject.FlexGameId + "_" + leaderboardUser.UserId + "\" />");

                  let leaderboardUserRankHolder = $("<div class=\"all-game-leaderboard-user-rank-holder inline-item " + themeTagName + "\" />");
                  leaderboardUserRankHolder.append(leaderboardUser.StackRank);

                  let leaderboardUserHolder = $("<div class=\"all-game-leaderboard-user-name-holder inline-item " + themeTagName + "\" />");
                  leaderboardUserHolder.append(leaderboardUser.UserIdSource.Name);
                  let leaderboardUserInput = $("<input type=\"hidden\" id=\"leaderboardUser_" + gameObject.FlexGameId + "_" + leaderboardUser.UserId + "\" value=\"" + leaderboardUser.UserId + "\" />");
                  leaderboardUserHolder.append(leaderboardUserInput);

                  let leaderboardUserScoreHolder = $("<div class=\"" + themeTagName + "\" />");

                  if (isPhraseGame == true) {
                     leaderboardUserScoreHolder.addClass("all-game-leaderboard-user-phrase-holder");
                     let userScore = leaderboardUser.BoardPositions || 0;
                     RenderPhraseInformation(gameObject.GamePhraseValue, userScore, leaderboardUserScoreHolder);
                  }
                  else {
                     let itemScore = leaderboardUser.KpiScoreTotal
                     if(gameObject?.ThemeIdSource?.ThemeTypeId == 2)
                     {
                        itemScore = leaderboardUser.BoardPositions || 0;
                     }
                     leaderboardUserScoreHolder.addClass("all-game-leaderboard-user-score-holder");
                     leaderboardUserScoreHolder.addClass("inline-item");
                     leaderboardUserScoreHolder.append(itemScore);
                  }

                  leaderboardRow.append(leaderboardUserRankHolder);
                  leaderboardRow.append(leaderboardUserHolder);
                  leaderboardRow.append(leaderboardUserScoreHolder);

                  leaderboardDataHolder.append(leaderboardRow);
               }
            }
            else if (gameObject.GameTypeId == 2) {
               for (let tIndex = 0; tIndex < gameObject.GameTeamLeaderboard.length; tIndex++) {
                  let leaderboardTeam = gameObject.GameTeamLeaderboard[tIndex];
                  let leaderboardRow = $("<div class=\"all-game-leaderboard-team-row " + themeTagName + "\" id=\"leaderboardTeamRow_" + gameObject.FlexGameId + "_" + leaderboardTeam.TeamId + "\" />");

                  let leaderboardTeamRankHolder = $("<div class=\"all-game-leaderboard-user-rank-holder inline-item " + themeTagName + "\" />");
                  leaderboardTeamRankHolder.append(leaderboardTeam.RankingGamePoints);

                  let leaderboardTeamHolder = $("<div class=\"all-game-leaderboard-user-name-holder inline-item " + themeTagName + "\" />");
                  leaderboardTeamHolder.append(leaderboardTeam.TeamName);
                  let leaderboardTeamInput = $("<input type=\"hidden\" id=\"leaderboardTeam_" + gameObject.FlexGameId + "_" + leaderboardTeam.TeamId + "\" value=\"" + leaderboardTeam.TeamId + "\" />");
                  leaderboardTeamHolder.append(leaderboardTeamInput);

                  let leaderboardTeamScoreHolder = $("<div class=\"" + themeTagName + "\" />");
                  if (isPhraseGame == true) {
                     leaderboardTeamScoreHolder.addClass("all-game-leaderboard-user-phrase-holder");
                     let teamScore = leaderboardTeam.GameScore || 0;
                     RenderPhraseInformation(gameObject.GamePhraseValue, teamScore, leaderboardTeamScoreHolder);
                  }
                  else {
                     leaderboardTeamScoreHolder.addClass("all-game-leaderboard-user-score-holder");
                     leaderboardTeamScoreHolder.addClass("inline-item");

                     let gameScore = leaderboardTeam.GameScore;
                     if (gameScore == 0 && gameObject.ThemeIdSource.ThemeTypeId == 1) {
                        gameScore = leaderboardTeam.TotalKpiScore;
                     }
                     leaderboardTeamScoreHolder.append(gameScore);
                  }

                  leaderboardRow.append(leaderboardTeamRankHolder);
                  leaderboardRow.append(leaderboardTeamHolder);
                  leaderboardRow.append(leaderboardTeamScoreHolder);

                  leaderboardDataHolder.append(leaderboardRow);
               }
            }
            else {
               leaderboardDataHolder.append("Unknown Game Type to build leaderboard for.");
            }
            let gameParticipantLabelHolder = $("<div class=\"all-game-display-participant-label-holder " + themeTagName + "\" />");
            gameParticipantLabelHolder.append("You have <span class=\"all-game-display-user-participant-count-label " + themeTagName + "\" id=\"userParticipantGameCount_" + gameObject.FlexGameId + "\" /> <span id=\"userParticipantGameType_" + gameObject.FlexGameId + "\" /> in this game.");
            gameStatsHolder.append(gameParticipantLabelHolder);

            leaderboardHolder.append(leaderboardHeader);
            leaderboardHolder.append(leaderboardDataHolder);

            gameCard.append(gameBackgroundHolder);
            gameCard.append(gameInformationHolder);
            gameCard.append(gameStatsHolder);
            gameCard.append(leaderboardHolder);

            $(renderToObject).append(gameCard);
         }
         function RenderPhraseInformation(gamePhrase, userCurrentScore, renderToObject) {
            let score = userCurrentScore || 0;
            let renderPhrase = gamePhrase || "";
            let renderOutput = $("<div class=\"all-game-display-phrase-output-holder\"/>");
            for (let lIndex = 0; lIndex < renderPhrase.length; lIndex++) {
               let renderItem = renderPhrase[lIndex];
               if (renderItem != "_") {
                  if (renderItem == " ") {
                     renderItem = "&nbsp;";
                  }
                  else {
                     renderItem = renderItem.toUpperCase()
                  }

                  let scoreItem = $("<span class=\"all-game-display-phrase-base-score-item\">" + renderItem + "</span>");
                  renderOutput.append(scoreItem);
               }
               else {
                  let spaceItem = $("<span class=\"all-game-display-phrase-base-space-item\">&nbsp;</span>");
                  renderOutput.append(spaceItem);
               }
            }

            $(".all-game-display-phrase-base-score-item", $(renderOutput)).each(function (i) {
               while (i < score) {
                  $(this).addClass("phrase-score-item-active");
                  i++;
               }
            });

            $(renderToObject).append(renderOutput);

         }
         function MarkWorkersAsParticipants() {
            $("input[id^='leaderboardUser_']", element).each(function () {
               let id = this.id;
               let userId = id.split("_")[2];
               let gameId = id.split("_")[1];

               let counterObjectIndex = participantCounts.findIndex(g => g.GameId == gameId);
               let gameObject = allPossibleFlexGames.find(g => g.FlexGameId == gameId);

               if (counterObjectIndex < 0) {
                  counterObject = new Object();
                  counterObject.GameId = gameId;
                  counterObject.ParticipantCount = 0;
                  counterObject.TotalPlayerCount = gameObject?.GameParticipants.length || 0;
                  counterObject.ParticipantTeamCount = 0;
                  counterObject.TotalTeamCount = gameObject?.ParticipatingTeams.length || 0;
                  participantCounts.push(counterObject);
                  counterObjectIndex = participantCounts.findIndex(g => g.GameId == gameId);
               }
               let uIndex = myAssignedWorkers.findIndex(u => u.UserId == userId);
               if (uIndex > -1) {
                  $("#GameCardHolder_" + gameId, element).addClass("user-has-participant");
                  $("#leaderboardUserRow_" + gameId + "_" + userId, element).addClass("user-participant-row");
                  participantCounts[counterObjectIndex].ParticipantCount += 1;
               }
            });

            $("input[id^='leaderboardTeam_']", element).each(function () {
               let id = this.id;
               let teamId = id.split("_")[2];
               let gameId = id.split("_")[1];

               let counterObjectIndex = participantCounts.findIndex(g => g.GameId == gameId);
               if (counterObjectIndex < 0) {
                  counterObject = new Object();
                  counterObject.GameId = gameId;
                  counterObject.ParticipantCount = 0;
                  counterObject.TotalPlayerCount = 0;
                  counterObject.ParticipantTeamCount = 0;
                  counterObject.TotalTeamCount = 0;
                  participantCounts.push(counterObject);
                  counterObjectIndex = participantCounts.findIndex(g => g.GameId == gameId);
               }
               let tIndex = myAssignedTeams.findIndex(u => u.TeamId == teamId);
               if (tIndex > -1) {
                  $("#GameCardHolder_" + gameId, element).addClass("user-has-participant");
                  $("#leaderboardTeamRow_" + gameId + "_" + teamId, element).addClass("user-participant-row");
                  participantCounts[counterObjectIndex].ParticipantTeamCount += 1;
               }
            });
            WriteParticipantCountsForGames();
         }
         function WriteParticipantCountsForGames() {
            for (let pIndex = 0; pIndex < participantCounts.length; pIndex++) {
               let participantItem = participantCounts[pIndex];
               let gameId = participantItem.GameId;
               let gameObject = allPossibleFlexGames.find(g => g.FlexGameId == gameId);
               let isTeamGame = false;

               if (gameObject != null) {
                  isTeamGame = (gameObject.GameTypeId == 2);
               }
               let participantTypeText = "agents";
               let participantCount = participantItem.ParticipantCount || 0;

               if (isTeamGame == true) {
                  participantCount = participantItem.ParticipantTeamCount;
                  participantTypeText = "teams";
               }

               $("#userParticipantGameCount_" + gameId, element).empty();
               $("#userParticipantGameCount_" + gameId, element).append(participantCount);

               if (participantCount == 1) {
                  participantTypeText = participantTypeText.slice(0, -1);
               }

               $("#userParticipantGameType_" + gameId, element).empty();
               $("#userParticipantGameType_" + gameId, element).append(participantTypeText);
            }
         }
         /* Render Handling END */
         function WriteNoAccess()
         {
            $("#allFlexGamesListingHolder", element).empty();
            $("#allFlexGamesListingHolder", element).append("You do not have access to view this information.");
         }
         function CanUserAccess()
         {
            return (legacyContainer.scope.TP1Role.toUpperCase() != "CSR".toUpperCase());
         }
         /* Show/Hide Handling START */
         /* Show/Hide Handling END */
         scope.load = function () {
            Initialize();
            let userHasAccess = CanUserAccess();
            if(userHasAccess == true)
            {
               LoadAllFlexGames(function () {
                  MarkWorkersAsParticipants();
               });
            }
            else
            {
               WriteNoAccess();
            }
         };

         ko.postbox.subscribe("LoadAllFlexGameListing", function () {
            scope.load();
         });
         ko.postbox.subscribe("RefreshAllFlexGameListing", function () {
            scope.load();
         });
      }

   };
}]);
