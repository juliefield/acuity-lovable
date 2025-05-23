angularApp.directive("ngUserAgameLeagueViewFull", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/AGAMELEAGUES1/view/userAgameLeagueViewFull.htm?' + Date.now(),
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
         var currentGameList = [];
         let gameThemeList = [];
         var currentRosterList = [];
         var userProfileList = [];
         var currentTeamColorsList = [];


         //TODO: Determine what the base information should be here.
         let baseTeamLogoUrl = a$.debugPrefix() + "/applib/css/images/team-svgs/default-team-icon.svg";
         let baseBackgroundUrl = a$.debugPrefix() + "/3/ng/AgameFlex/images/game-bg-default-lrg.jpg";
         let multiThemeFoundBackgroundUrl = a$.debugPrefix() + "/3/ng/AgameFlex/images/game-bg-default-lrg.jpg";
         let defaultGameIconUrl = a$.debugPrefix() + "/applib/css/images/launch-agame.png";
         let extremeGameLogoUrl = a$.debugPrefix() + "/App_Themes/Acuity3/images/xtreme-logo.png";
         let defaultAvatarUrl = a$.debugPrefix() + "/applib/css/images/empty_headshot.png";
         let hasModule = false;
         let canViewUserNames = true;
         let canViewUserScores = true;
         let includeBenchPlayersInRoster = false;
         let scoringType = "base";

         scope.Initialize = function () {
            HideAll();
            hasModule = appLib.canAccessAGameLeague();
            HandleViewOptions();
            GetBaseScoringType();
            LoadAvaialbleThemes();
         };

         function GetBaseScoringType()
         {
            appLib.getConfigParameterByName("CLIENT_SCORING_CALC_TYPE", function (parameter) {
               if (parameter != null) {
                  scoringType = parameter.ParamValue;
               }
            });
         }

         /*Listing Load*/
         function LoadAvaialbleThemes(forceReload, callback) {
            if (forceReload == null) {
               forceReload = false;
            }

            if (gameThemeList == null || gameThemeList.length == 0 || forceReload == true) {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "flex",
                     cmd: "getAGameThemeList"
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     var returnList = JSON.parse(data.aGameThemeList);
                     gameThemeList.length = 0;
                     gameThemeList = returnList;
                     if (callback != null) {
                        callback(gameThemeList);
                     }
                  }
               });
            }
            else {
               if (callback != null) {
                  callback(gameThemeList);
               }
               else {
                  return;
               }
            }
         }
         function LoadAGameThemeById(themeId) {
            let returnObject = gameThemeList.find(t => t.AGameThemeId == themeId);

            if(returnObject == null)
            {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "flex",
                     cmd: "getAGameThemeById",
                     themeid: themeId
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     returnObject = JSON.parse(data.aGameTheme);
                     gameThemeList.push(returnObject);
                  }
               });
            }
            return returnObject;
         }
         function LoadCurrentUserList(forceReload, gameDate, callback) {
            if (forceReload == null) {
               forceReload = false;
            }
            if(gameDate == null)
            {
               gameDate = new Date().toLocaleDateString();
            }
            let divisionId = a$.gup("divisionId");
            GetCurrentUserGameList(forceReload, gameDate, function (gameList) {
               if(gameList.length == 0)
               {
                  gameList = GetGameOfTheWeekList();
               }
               RenderCurrentUserGameList(gameList, divisionId, callback);
            });
         }
         function HandleViewOptions() {
            appLib.getConfigParameterByName("ANONYMOUS_USERS", function (parameter) {
               if (parameter != null) {
                  canViewUserNames = !(parameter.ParamValue.toUpperCase() == "ON".toUpperCase() ||
                     parameter.ParamValue.toUpperCase() == "YES".toUpperCase() ||
                     parameter.ParamValue.toUpperCase() == "true".toUpperCase());
               }
            });
            appLib.getConfigParameterByName("ANONYMOUS_SCORES", function (parameter) {
               if (parameter != null) {
                  canViewUserScores = !(parameter.ParamValue.toUpperCase() == "ON".toUpperCase() ||
                     parameter.ParamValue.toUpperCase() == "YES".toUpperCase() ||
                     parameter.ParamValue.toUpperCase() == "true".toUpperCase());
               }
            });            
            //Forcing the user scores to be available for anyone but CSRs
            if (legacyContainer?.scope?.TP1Role?.toUpperCase() != "CSR".toUpperCase()) {
               canViewUserScores = true;
            }            
            if (canViewUserScores == false && canViewUserNames == false) {
               console.log("Scores and Names are hidden...why are we rendering anything?");
            }
         }
         function GetCurrentUserGameList(forceReload, gameDate, callback) {
            if (forceReload == null) {
               forceReload = false;
            }
            if(gameDate == null)
            {
               gameDate  = new Date().toLocaleDateString();
            }
            if (currentGameList != null && currentGameList.length > 0 && forceReload == false) {
               if (callback != null) {
                  callback(currentGameList);
               }
               else {
                  return currentGameList;
               }
            }
            else {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "flex",
                     cmd: "getCurrentUserAGamePlayerInfo",
                     userid: legacyContainer.scope.TP1Username,
                     gamedate: gameDate,
                     deepload: true
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let returnList = JSON.parse(data.currentListForUser);
                     currentGameList.length = 0;
                     currentGameList = returnList;
                     if (callback != null) {
                        callback(currentGameList);
                     }
                     else {
                        return currentGameList;
                     }
                  }
               });
            }
         }
         function GetGameOfTheWeekList()
         {
            let returnList = [];
            a$.ajax({
               type: "POST",
               service: "C#",
               async: false,
               data: {
                  lib: "flex",
                  cmd: "getAGameOfTheWeek"
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (data) {
                  returnList = JSON.parse(data.currentListForUser);
               }
            });
            return returnList;
         }
         function GetTeamRoster(leagueId, teamId, weekId, callback) {
            let returnList = currentRosterList.filter(t => t.LeagueId == leagueId && t.TeamId == teamId && t.WeekId == weekId);

            if (returnList == null || returnList.length == 0) {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "flex",
                     cmd: "getCurrentRosterForLeague",
                     leagueid: leagueId,
                     deepload: true
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let dataList = JSON.parse(data.currentDivisionRoster);
                     for (let rIndex = 0; rIndex < dataList.length; rIndex++) {
                        currentRosterList.push(dataList[rIndex]);
                     }
                  }
               });
               returnList = currentRosterList.filter(t => t.LeagueId == leagueId && t.TeamId == teamId && t.WeekId == weekId);
            }

            if (callback != null) {
               callback(returnList);
            }
            else {
               return returnList;
            }

         }
         function RenderCurrentUserGameList(listToRender, leagueId, callback) {
            if (listToRender == null) {
               listToRender = currentGameList;
            }
            if(leagueId != null && leagueId > 0)
            {
               listToRender = listToRender.filter(l => l.LeagueId == leagueId);
            }
            $("#userAgameLeagueViewFullHolder", element).empty();
            let currentGameListHolder = $("<div />");
            let holderBackgroundImageUrl = multiThemeFoundBackgroundUrl;

            if (listToRender != null && listToRender.length > 0) {
               let userGameListHolder = $("<div class=\"user-agame-listing-holder\" />");
               let gameThemeIconUrl = defaultGameIconUrl;
               let currentGameThemeName = "";
               let currentGameThemeDefaultTeamIcon = baseTeamLogoUrl;

               for (let gIndex = 0; gIndex < listToRender.length; gIndex++) {
                  let gameItem = listToRender[gIndex];
                  let gameTheme = null;
                  if(gameItem.ThemeIdSource == null)
                  {
                     gameTheme = LoadAGameThemeById(gameItem.ThemeId);
                  }
                  else
                  {
                     gameTheme = gameItem.ThemeIdSource;
                  }

                  if (gameTheme != null) {
                     if (currentGameThemeName != "" && currentGameThemeName != gameTheme.ThemeTag) {
                        holderBackgroundImageUrl = multiThemeFoundBackgroundUrl;
                     }
                     else {
                        if (gameTheme.ThemeBackgroundImage != null && gameTheme.ThemeBackgroundImage != "") {
                           holderBackgroundImageUrl = gameTheme.ThemeBackgroundImage;
                        }
                        if (gameTheme.ThemeDefaultTeamIcon != null && gameTheme.ThemeDefaultTeamIcon != "") {
                           currentGameThemeDefaultTeamIcon = gameTheme.ThemeDefaultTeamIcon;
                        }

                     }
                     if (currentGameThemeName == "") {
                        currentGameThemeName = gameTheme.ThemeTag;
                     }

                     if (gameTheme.ThemeImage != null && gameTheme.ThemeImage != "") {
                        gameThemeIconUrl = gameTheme.ThemeImage;
                     }
                  }

                  if (gameItem.LeagueType != "Regular") {
                     gameThemeIconUrl = extremeGameLogoUrl;
                  }


                  let gameRowHolder = $("<div class=\"game-matchup-all-data-holder\" />");
                  let gameThemeLogoHolder = $("<div class=\"game-data-common-holder game-logo-holder\" />");
                  let gameMatchupHolder = $("<div class=\"game-data-common-holder game-matchup-data-matchup-holder\" />");
                  let gameSectionHolder = $("<div class=\"game-matchup-data-section-holder\" />");
                  let footerSectionInfoHolder = $("<div class=\"game-matchup-data-footer-section\" />");
                  let guestTeamInfoHolder = $("<div class=\"game-data-all-team-info-holder team-info-holder guest\" />");
                  let homeTeamInfoHolder = $("<div class=\"game-data-all-team-info-holder team-info-holder home\" />");

                  let gameDates = new Date(gameItem.GameStartDate).toLocaleDateString() + " - " + new Date(gameItem.GameEndDate).toLocaleDateString();

                  let gameThemeLogo = $("<img />");
                  gameThemeLogo.attr("src", gameThemeIconUrl);
                  gameThemeLogo.attr("height", "75px"); //TODO: Handle this within css sheets.
                  gameThemeLogoHolder.append(gameThemeLogo);

                  /* Guest Team Column */
                  let guestTeamLogoHolder = $("<div class=\"game-matchup-data-item-holder game-data-logo-holder\" />");                  
                  let guestTeamLogo = $("<object type=\"image/svg+xml\" id=\"teamLogo_" + gameItem.LeagueId + "_" + gameItem.VisitorTeamsId + "\" class=\"guest-team-logo\"  />");
                  let guestTeamLogoSource = currentGameThemeDefaultTeamIcon;
                  let guestTeamColors = GetTeamColors(gameItem.VisitorTeamsId);
                  if(guestTeamColors != null && guestTeamColors.Colors?.length > 0)
                  {
                     AddColorsToObject(guestTeamColors, guestTeamLogo);   
                  }
                  guestTeamLogo.attr("data", guestTeamLogoSource);
                  guestTeamLogoHolder.append(guestTeamLogo);
                  let guestTeamNameHolder = $("<div class=\"game-matchup-data-item-holder game-data-team-name-holder\" />");
                  let guestTeamName = gameItem.AGameTeamName;
                  if(gameItem.VisitorTeamsId != gameItem.TeamId)
                  {
                     guestTeamName = gameItem.OpponentTeamsName;
                  }
                  guestTeamNameHolder.append(guestTeamName);

                  let guestTeamScoreHolder = $("<div class=\"game-matchup-data-item-holder game-data-score-holder\" />");
                  let guestTeamScore = FormatScore(gameItem.VisitorTeamScore, scoringType);
                  guestTeamScoreHolder.append(guestTeamScore);

                  let guestTeamHeader = $("<div />");
                  guestTeamHeader.append(guestTeamScoreHolder);
                  guestTeamHeader.append(guestTeamLogoHolder);
                  guestTeamHeader.append(guestTeamNameHolder);

                  let guestTeamBody = $("<div />");
                  GetTeamRoster(gameItem.LeagueId, gameItem.VisitorTeamsId, gameItem.WeekId, function (rosterList) {
                     RenderGuestTeamRoster(rosterList, guestTeamBody);
                  });

                  let vsHolder = $("<div class=\"game-matchup-data-item-holder game-data-vs-matchup-holder\"/>");
                  vsHolder.append("vs");
                  guestTeamBody.append(vsHolder);

                  guestTeamInfoHolder.append(guestTeamHeader);
                  guestTeamInfoHolder.append(guestTeamBody);
                  /* Guest Team Column END*/

                  /* Home Team Column */
                  let homeTeamLogoHolder = $("<div class=\"game-matchup-data-item-holder game-data-logo-holder\" />");
                  let homeTeamLogo = $("<object type=\"image/svg+xml\" id=\"teamLogo_" + gameItem.LeagueId + "_" + gameItem.HomeTeamsId + "\" class=\"home-team-logo\" />");
                  let homeTeamLogoSource = currentGameThemeDefaultTeamIcon;
                  let homeTeamColors = GetTeamColors(gameItem.HomeTeamsId);
                  if(homeTeamColors != null && homeTeamColors.Colors?.length > 0)
                  {
                     AddColorsToObject(homeTeamColors, homeTeamLogo);
                  }
                  homeTeamLogo.attr("data", homeTeamLogoSource);
                  homeTeamLogoHolder.append(homeTeamLogo);

                  let homeTeamNameHolder = $("<div class=\"game-matchup-data-item-holder game-data-team-name-holder\" />");
                  let homeTeamName = gameItem.AGameTeamName;
                  if(gameItem.HomeTeamsId != gameItem.TeamId)
                  {
                     homeTeamName = gameItem.OpponentTeamsName;
                  }
                  homeTeamNameHolder.append(homeTeamName);

                  let homeTeamScoreHolder = $("<div class=\"game-matchup-data-item-holder game-data-score-holder\" />");
                  let homeTeamScore = FormatScore(gameItem.HomeTeamScore, scoringType);
                  homeTeamScoreHolder.append(homeTeamScore);

                  let homeTeamHeader = $("<div />");
                  homeTeamHeader.append(homeTeamNameHolder);
                  homeTeamHeader.append(homeTeamLogoHolder);
                  homeTeamHeader.append(homeTeamScoreHolder);

                  let homeTeamBody = $("<div />");                  
                  GetTeamRoster(gameItem.LeagueId, gameItem.HomeTeamsId, gameItem.WeekId, function (rosterList) {
                     RenderHomeTeamRoster(rosterList, homeTeamBody);
                  });


                  homeTeamInfoHolder.append(homeTeamHeader);
                  homeTeamInfoHolder.append(homeTeamBody);
                  /* Home Team Column END*/
                  /*Footer Section of Game*/
                  let datesHolder = $("<div class=\"game-matchup-data-item-holder game-data-dates-holder\" />");
                  datesHolder.append(gameDates);
                  footerSectionInfoHolder.append(datesHolder);
                  /*Footer Section of Game END*/

                  gameSectionHolder.append(guestTeamInfoHolder);
                  gameSectionHolder.append(homeTeamInfoHolder);
                  gameSectionHolder.append(footerSectionInfoHolder);

                  gameMatchupHolder.append(gameThemeLogoHolder);
                  gameMatchupHolder.append(gameSectionHolder);

                  gameRowHolder.append(gameMatchupHolder);

                  userGameListHolder.append(gameRowHolder);
                  currentGameListHolder.append(userGameListHolder);
               }
               currentGameListHolder.append(userGameListHolder);
            }
            else {
               currentGameListHolder.append("No current games found for you.");
            }

            //$("#userAgameLeagueViewFullHolder", element).css("background-image", "url('" + holderBackgroundImageUrl + "')");
            $("#userAgameLeagueHolder", element).css("background-image", "url('" + holderBackgroundImageUrl + "')");
            $("#userAgameLeagueViewFullHolder", element).append(currentGameListHolder);
            if(callback != null)
            {
               callback();
            }
            else
            {
               return;
            }
         }

         function RenderHomeTeamRoster(rosterList, objectToRenderTo) {
            RenderTeamRosterForGame(rosterList, objectToRenderTo, false);
         }
         function RenderGuestTeamRoster(rosterList, objectToRenderTo) {
            RenderTeamRosterForGame(rosterList, objectToRenderTo, true);
         }

         function RenderTeamRosterForGame(rosterList, objectToRenderTo, isGuestDisplay, includeBenchPlayers) {
            if (includeBenchPlayers == null) {
               includeBenchPlayers = includeBenchPlayersInRoster;
            }

            $(objectToRenderTo).empty();
            let teamRosterHolder = $("<div class=\"team-roster-left-holder\" />");
            let teamRosterHeader = $("<div class=\"team-roster-header-holder\" />");
            let teamRosterBody = $("<div class=\"team-roster-body-holder\" />");
            let teamRosterFooter = $("<div class=\"team-roster-footer-holder\" />");
            //TODO: Get the information from the configuration or a resource file for languages
            let nameHeaderText = "Team Member";
            let positionHeaderText = "Position";
            let scoreHeaderText = "Score";
            let multiplierHeaderText = "Multiplier";
            let totalHeaderText = "Total";

            let nameHeader = $("<div class=\"roster-header-item\">" + nameHeaderText + "</div>");
            let positionHeader = $("<div class=\"roster-header-item\">" + positionHeaderText + "</div>");
            let scoreHeader = $("<div class=\"roster-header-item\">" + scoreHeaderText + "</div>");
            let multiplierHeader = $("<div class=\"roster-header-item\">" + multiplierHeaderText + "</div>");
            let totalHeader = $("<div class=\"roster-header-item\">" + totalHeaderText + "</div>");

            let rosterHeaderDataRow = $("<div class=\"team-roster-header-container\"  />");
            let teamRosterBodyHolder = $("<div class=\"team-roster-body-container\"  />");

            if (rosterList != null && rosterList.length > 0) {
               rosterList = SortRosterList(rosterList);

               if (isGuestDisplay) {
                  if (canViewUserNames) {
                     rosterHeaderDataRow.append(nameHeader);
                  }

                  rosterHeaderDataRow.append(positionHeader);
                  if (canViewUserScores) {
                     rosterHeaderDataRow.append(scoreHeader);
                     rosterHeaderDataRow.append(multiplierHeader);
                     rosterHeaderDataRow.append(totalHeader);
                  }
               }
               else {
                  if (canViewUserScores) {
                     rosterHeaderDataRow.append(totalHeader);
                     rosterHeaderDataRow.append(multiplierHeader);
                     rosterHeaderDataRow.append(scoreHeader);
                  }
                  rosterHeaderDataRow.append(positionHeader);
                  if (canViewUserNames) {
                     rosterHeaderDataRow.append(nameHeader);
                  }
               }
               for (let rIndex = 0; rIndex < rosterList.length; rIndex++) {
                  let rosterItem = rosterList[rIndex];
                  let teamRosterRow = $("<div class=\"roster-data-row\" />");
                  let nameHolder = $("<div class=\"roster-data-item\" />");
                  let positionHolder = $("<div class=\"roster-data-item\" />");
                  let scoreHolder = $("<div class=\"roster-data-item\" />");
                  let multiplierHolder = $("<div class=\"roster-data-item\" />");
                  let totalHolder = $("<div class=\"roster-data-item\" />");

                  let positionName = rosterItem.Position;
                  let userScore = FormatScore(rosterItem.BalancedScore, scoringType);
                  let multiplier = rosterItem.PositionMultiplier;
                  let userGameScore = FormatScore(rosterItem.UserGameScore, scoringType);

                  if (includeBenchPlayers == true && rosterItem.PlayType != "Team Play") {
                     positionName = " -- Bench -- ";
                     multiplier = "";
                     userGameScore = "";
                  }
                  positionHolder.append(positionName);
                  scoreHolder.append(userScore);
                  multiplierHolder.append(multiplier);
                  totalHolder.append(userGameScore);

                  let userAvatarHolder = $("<div class=\"roster-data-item avatar-holder\" />");
                  let userAvatar = $("<img src=\"" + defaultAvatarUrl + "\" class=\"roster-data-avatar-image\" />");
                  let userName = rosterItem.UserId;
                  let userProfile = GetUserProfile(userName);
                  if (rosterItem.UserId.toLowerCase() == legacyContainer.scope.TP1Username.toLowerCase()) {
                     teamRosterRow.addClass("active");
                  }

                  if (userProfile != null) {
                     if (userProfile.AvatarImageFileName != null && userProfile.AvatarImageFileName != "") {
                        userAvatar.attr("src", a$.scrubAvatarLocation(userProfile.AvatarImageFileName, true));
                     }
                     userName = userProfile.UserFullName;
                  }
                  userAvatarHolder.append(userAvatar);

                  if (isGuestDisplay) {
                     nameHolder.append(userAvatarHolder);
                     nameHolder.append(userName);
                     if (canViewUserNames) {
                        teamRosterRow.append(nameHolder);
                     }
                     teamRosterRow.append(positionHolder);
                     if (canViewUserScores) {
                        teamRosterRow.append(scoreHolder);
                        teamRosterRow.append(multiplierHolder);
                        teamRosterRow.append(totalHolder);
                     }
                  }
                  else {
                     nameHolder.append(userName);
                     nameHolder.append(userAvatarHolder);

                     if (canViewUserScores) {
                        teamRosterRow.append(totalHolder);
                        teamRosterRow.append(multiplierHolder);
                        teamRosterRow.append(scoreHolder);
                     }
                     teamRosterRow.append(positionHolder);
                     if (canViewUserNames) {
                        teamRosterRow.append(nameHolder);
                     }

                  }

                  if (includeBenchPlayers == true || (includeBenchPlayers == false && rosterItem.PlayType == "Team Play")) {
                     teamRosterBodyHolder.append(teamRosterRow);
                  }
               }
            }
            else {
               teamRosterBodyHolder.append("No roster information found.");
            }
            teamRosterHeader.append(rosterHeaderDataRow);
            teamRosterBody.append(teamRosterBodyHolder);

            teamRosterHolder.append(teamRosterHeader);
            teamRosterHolder.append(teamRosterBody);
            teamRosterHolder.append(teamRosterFooter);

            $(objectToRenderTo).append(teamRosterHolder);
         }

         /*Listing Load End*/
         /*Show/Hide/Collapse/Toggle*/
         function HideAll() {
         }
         /*Show/Hide/Collapse/Toggle End*/

         /*Misc Functions*/
         function ColorTeamLogos() {
            let objectItems = $("object", document);
            for (let oIndex = 0; oIndex < objectItems.length; oIndex++) {
               let currentObject = objectItems[oIndex];
               let colors = [$(currentObject).attr("color2"),
               $(currentObject).attr("color1"),
               $(currentObject).attr("color3"),
               $(currentObject).attr("color4"),
               $(currentObject).attr("color5")];

               let pathsForObject = $("path", $(currentObject.contentDocument));
               for (let pIndex = 0; pIndex < pathsForObject.length; pIndex++) {
                  let colorIndex = parseInt(pIndex % 5);

                  let pathObject = pathsForObject[pIndex];

                  let colorValue = colors[colorIndex];
                  if (colorValue != null && colorValue != "") {
                     $(pathObject).attr("fill", colorValue);
                  }

               }
            }
         }
         
         function GetUserProfile(userId) {
            let returnProfile = userProfileList.find(u => u.UserId == userId);
            if (returnProfile == null) {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "userprofile",
                     cmd: "getProfileByUserId",
                     userid: userId
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let profileData = JSON.parse(data.userProfiles);
                     for (let pIndex = 0; pIndex < profileData.length; pIndex++) {
                        if (userProfileList.findIndex(u => u.UserId == profileData[pIndex].UserId) < 0) {
                           userProfileList.push(profileData[pIndex]);
                        }
                        returnProfile = profileData[pIndex];
                     }
                  }
               });
            }
            return returnProfile;
         }
         function GetTeamColors(teamId)
         {
            let returnObject = null;
            if(teamId != null)
            {
               returnObject = currentTeamColorsList.find(t => t.TeamId == teamId);

               if(returnObject == null)
               {
                  returnObject = new Object();
                  a$.ajax({
                     type: "POST",
                     service: "C#",
                     async: false,
                     data: {
                        lib: "selfserve",
                        cmd: "getTeamColorsForAGameTeam",
                        agameteamid: teamId
                     },
                     dataType: "json",
                     cache: false,
                     error: a$.ajaxerror,
                     success: function (data) {
                        let returnColors = JSON.parse(data.teamColors);
                        let colorsCount = returnColors.length;
                        if(colorsCount > 0)
                        {
                           colorsCount > 5 ? colorsCount = 5 : colorsCount;
                           returnObject.TeamId = teamId;
                           returnObject.Colors = [colorsCount];
                           for(let cIndex = 0; cIndex < colorsCount;cIndex++)
                           {
                              returnObject.Colors[cIndex] = returnColors[cIndex];
                           }
                           currentTeamColorsList.push(returnObject);   
                        }
                     }
                  });
               }
   
            }
            return returnObject;
         }
         //TODO: Move this into a more generic file that is more available.
         function FormatScore(scoreToFormat, formatType) {
            let returnValue = scoreToFormat;
            if (formatType == null) {
               formatType = "base";
            }
            switch (formatType.toLowerCase()) {
               case "stddev":
                  returnValue = scoreToFormat.toFixed(4);
                  break;
               default:
                  returnValue = scoreToFormat.toFixed(2);
                  break;
            }
            return returnValue;
         }
         //TODO: Determine how we are going to sort roster lists...
         function SortRosterList(listToSort) {
            let sortedList = listToSort;

            let currentPlayersList = listToSort.filter(t => t.PlayType == "Team Play");
            //TODO:Determine sorting order of information here.4
            currentPlayersList = currentPlayersList.sort((a, b) => {
               if (parseInt(a.PositionMultiplier) < parseInt(b.PositionMultiplier)) {
                  return 1;
               }
               else if (parseInt(a.PositionMultiplier) > parseInt(b.PositionMultiplier)) {
                  return -1;
               }
               else {
                  if (a.Position > b.Position) {
                     return 1;
                  }
                  else if (a.Position < b.Position) {
                     return -1;
                  }
                  else {
                     return 0;
                  }
               }
            });

            let benchPlayersList = listToSort.filter(t => t.PlayType != "Team Play");
            //TODO:Determine sorting order of information here.
            benchPlayersList = benchPlayersList.sort((a, b) => {
               let aProfile = userProfileList.find(u => u.UserId == a.UserId);
               let bProfile = userProfileList.find(u => u.UserId == b.UserId);

               if (aProfile == null) {
                  aProfile = GetUserProfile(a.UserId);
               }
               if (bProfile == null) {
                  bProfile = GetUserProfile(b.UserId);
               }
               if (aProfile != null && bProfile != null) {
                  if (aProfile.LastName < bProfile.LastName) {
                     return -1;
                  }
                  else if (aProfile.LastName > bProfile.LastName) {
                     return 1;
                  }
                  else {
                     if (aProfile.FirstName < bProfile.FirstName) {
                        return 1;
                     }
                     else if (aProfile.FirstName < bProfile.FirstName) {
                        return -1;
                     }
                     else {
                        return 0;
                     }
                  }
               }
            });


            sortedList.length = 0;
            sortedList = currentPlayersList.concat(benchPlayersList);

            return sortedList;
         }
         function AddColorsToObject(colorsObject, objectHolderToReference)
         {
            let colorsArray = colorsObject;

            if(colorsArray.Colors != null && colorsArray.Colors.length > 0)
            {
               let colorsAddedCount = 1;
               for(let cIndex = 0; cIndex < colorsArray.Colors.length;cIndex++)
               {
                  if(colorsArray.Colors[cIndex] != null && colorsArray.Colors[cIndex] != "")
                  {
                     $(objectHolderToReference).attr("color" + colorsAddedCount, colorsArray.Colors[cIndex]);
                     colorsAddedCount++;
                  }
               }
            }
            
         }
         /*Misc Functions END*/

         function WriteNoAccess() {
            $("#userAgameListing", element).empty();
            $("#userAgameListing", element).append("You do not have access to this module.");
         }
         scope.load = function () {
            hasModule = appLib.canAccessAGameLeague();
            scope.Initialize();

            if (hasModule == false) {
               WriteNoAccess();
            }
            else {
               LoadCurrentUserList();
               window.setTimeout(function () {
                  ColorTeamLogos();
               }, 1000);
            }
         };

         scope.load();

         ko.postbox.subscribe("userAgameInfoFullReload", function (forceReload) {
            if (forceReload == true) {
               currentGameList.length = 0;
            }
            scope.load();
         });


         ko.postbox.subscribe("userAgameInfoFullLoad", function () {
            scope.load();
         });
      }
   };
}]);
