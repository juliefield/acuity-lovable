angularApp.directive("ngAgameLeagueWager", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/AGAMELEAGUES1/view/aGameLeagueWager.htm?' + Date.now(),
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
         let pendingWagersToShow = 3;
         let daysUntilRosterLockParamValue = 2;
         //TODO: Handle these things somewhere based on the league
         let currentWeekNumber = 0;
         let weeksInLeague = 0;
         let initialWagerAmount = 1000;
         let maxWagerAmount = 250;

         let myCurrentLeagueWagerHeader = null;
         let currentLeague = null;
         let myCurrentWagers = [];
         let myPendingWagers = [];
         let possibleUsers = [];
         let possibleLeagues = [];
         let possibleTeams = [];
         let possibleWeeks = [];
         let wagerStatusOptions = [];
         //TODO: Determine what the base information should be here.
         // let vsBackgroundImageUrl = "";
         // let matchupFooterImageUrl = "";
         // let baseTeamLogoUrl = a$.debugPrefix() + "/applib/css/images/team-svgs/default-team-icon.svg";
         // let baseBackgroundUrl = a$.debugPrefix() + "/3/ng/AgameFlex/images/game-bg-default-leaderboard.jpg";
         // let multiThemeFoundBackgroundUrl = a$.debugPrefix() + "/3/ng/AgameFlex/images/game-bg-default-leaderboard.jpg";
         // let defaultGameIconUrl = a$.debugPrefix() + "/applib/css/images/launch-agame.png";
         // let extremeGameLogoUrl = a$.debugPrefix() + "/App_Themes/Acuity3/images/xtreme-logo.png";
         //let defaultAvatarUrl = a$.debugPrefix() + "/applib/css/images/empty_headshot.png";
         let defaultAvatarUrl = a$.debugPrefix() + "/applib/css/images/acuity-icon.png";
         let misterBusinessAvatarUrl = a$.debugPrefix() + "/applib/css/images/avatars/mrbusiness/pigavatar17.png";
         let misterBusinessAvatarUrl2 = a$.debugPrefix() + "/applib/css/images/avatars/mrbusiness/pigavatar5.png";

         let hasModule = false;         
         HideAll();
         /* Directive control events section START */
         $("#btnLoad", element).off("click").on("click", function () {
            ko.postbox.publish("aGameWagerLoad");
         });
         $("#btnGenerateBook", element).off("click").on("click", function () {
            LogInfo("Starting Data Generation...");
            a$.ajax({
               type: "POST",
               service: "C#",
               async: true,
               data: {
                  lib: "flex",
                  cmd: "generateWagerData"
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
                     LogInfo("Data Generation complete.");
                     alert("Data Generation complete.");
                     ko.postbox.publish("aGameWagerReload", true);
                  }
               }
            });
         });
         $(".btn-close", element).off("click").on("click", function () {
            ClearEditorForm(function () {
               HideEditorForm();
            });
         });
         $("#imgLaunchAGAME", element).off("click").on("click", function () {            
            NavigateToAGameLeague("roster", -1);
         });
         $("#refreshMyBalance", element).off("click").on("click", function () {
            ko.postbox.publish("aGameWagerBalanceReload", true);
         })
         $("#refreshMyPending", element).off("click").on("click", function () {
            ko.postbox.publish("aGameWagerReloadChallenges", true);
         });
         $("#wagerCurrentLeagueTab", element).off("click").on("click", function () {
            let tabId = this.id;
            HandleListingTabClicked(null, tabId);
         });
         $("#wagerHistoricalTab", element).off("click").on("click", function () {
            let tabId = this.id;
            RenderWagers(function () {
               HandleListingTabClicked(null, tabId);
            }, null, "historyLeagueWagersList")
         });
         $("#btnSaveWagerForm", element).off("click").on("click", function () {
            LogInfo("btnSaveWagerForm clicked.");
            SaveEditorForm(function () {
               SendWagerMessage(function () {
                  HideEditorForm();
                  ko.postbox.publish("aGameWagerReload", true);
               });
            });
         });
         // $("#btnRefreshCurrentScore", element).off("click").on("click", function () {
         //    LogInfo("Refresh current scores clicked.");
         //    alert("[Not Implemented]  Will refresh the scores from A-GAME.");
         // });

         /* Directive control events section END */
         scope.Initialize = function () {
            HideAll();
            hasModule = appLib.canAccessAGameLeague();
            LoadAvailableWagerStatus();
            GetRosterLockDays();
            LoadAvailableLeagues(function (leaguesList) {
               if (possibleLeagues == null || possibleLeagues.length == 0) {
                  possibleLeagues = leaguesList;
               }
               SetCurrentLeagueInfo();
            });
            LoadAvailableOwners();
            GetBaseScoringType();
         };
         function GetRosterLockDays()
         {
            appLib.getConfigParameterByName("DAYS_UNTIL_AGAME_ROSTER_LOCK", function(param){
               if(param != null)
               {
                  daysUntilRosterLockParamValue = parseInt(param.ParamValue);
               }
            });
         }
         function CheckRosterLocked(weekStartDate, daysUntilRosterLocked, callback)
         {
            if(daysUntilRosterLocked == null)
            {
               daysUntilRosterLocked = daysUntilRosterLockParamValue;
            }

            a$.ajax({
               type: "POST",
               service: "C#",
               async: false,
               data: {
                  lib: "flex",
                  cmd: "isRosterLocked",
                  weekstartdate: weekStartDate,
                  daysUntilRosterLock: daysUntilRosterLocked
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
                     let returnValue = false;
                     returnValue = JSON.parse(data.rosterLocked);
                     if(callback != null)
                     {
                        callback(returnValue);
                     }
                     else
                     {
                        return returnValue;
                     }
                  }
               }
            });

         }
         function SetCurrentLeagueInfo() {
            currentLeague = GetCurrentLeague();            
            LoadPossibleWeeks(null, true, currentLeague.DivisionId);
            SetCurrentGameWeek();
            SetWeeksInLeague();
         }
         function GetCurrentLeague() {
            let sortedLeagues = possibleLeagues;
            //TODO: Detemrine how we should sort these to get the current league.
            sortedLeagues = sortedLeagues.sort((a, b) => {
               if (a.DivisionId < b.DivisionId) {
                  return 1;
               }
               else if (a.DivisionId > b.DivisionId) {
                  return -1;
               }
               else {
                  return 0;
               }
            });

            return sortedLeagues[0];
         }
         function SetCurrentGameWeek() {
            //get the current week number for the leagues.
            currentWeekNumber = 0;
            let today = new Date().setHours(0,0,0,0); //ensure we use midnight as the time to compare to.
            if (possibleWeeks != null && possibleWeeks.length > 0) {
               possibleWeeks.forEach((weekItem) => {
                  if(weekItem != null)
                  {
                     if (new Date(weekItem.WeekStartDate) <= today && today <= new Date(weekItem.WeekEndDate)) {
                        currentWeekNumber = weekItem.WeekNumber;
                        return currentWeekNumber;
                     }
                  }

               });
               possibleWeeks = possibleWeeks.sort((a, b) => {
                  if (a.WeekNumber < b.WeekNumber) {
                     return -1;
                  }
                  else if (a.WeekNumber > b.WeekNumber) {
                     return 1;
                  }
                  else {
                     return 0;
                  }
               });
               if (new Date(possibleWeeks[possibleWeeks.length - 1].WeekEndDate) <= today) {
                  currentWeekNumber = possibleWeeks[possibleWeeks.length - 1].WeekNumber + 1;
               }
               else if (new Date(possibleWeeks[0].WeekStartDate) > today) {
                  currentWeekNumber = 0;
               }

            }
            return currentWeekNumber;
         }
         function SetWeeksInLeague() {
            //set the number of weeks in the league being rendered.
            weeksInLeague = 8;
         }
         function GetBaseScoringType() {
            appLib.getConfigParameterByName("CLIENT_SCORING_CALC_TYPE", function (parameter) {
               if (parameter != null) {
                  scoringType = parameter.ParamValue;
               }
            });
         }
         /*Listing Load*/
         function LoadAvailableWagerStatus(callback, forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (wagerStatusOptions == null || wagerStatusOptions.length == 0 || forceReload == true) {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "flex",
                     cmd: "getAllWagerStatusOptions"
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
                        let wagerStatusList = JSON.parse(data.wagerStatusList);
                        if (wagerStatusList != null) {
                           wagerStatusOptions.length = 0;
                           for (let dIndex = 0; dIndex < wagerStatusList.length; dIndex++) {
                              wagerStatusOptions.push(wagerStatusList[dIndex]);
                           }
                        }
                        if (callback != null) {
                           callback(wagerStatusOptions);
                        }

                     }
                  }
               });
            }
            else {
               if (callback != null) {
                  callback(wagerStatusOptions);
               }
               else {
                  return wagerStatusOptions;
               }

            }
         }
         function LoadAvailableOwners(callback, forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (possibleUsers == null || possibleUsers.length == 0 || forceReload == true) {
               //Add Mr. Business
               let mrBizProfile = new Object();
               mrBizProfile.UserId = "mrb01";
               mrBizProfile.AvatarImageFileName = misterBusinessAvatarUrl
               mrBizProfile.UserFullName = "Mister Business";
               mrBizProfile.TeamName = "Money Man";
               possibleUsers.push(mrBizProfile);

               //Add Mr. Business - Blind Pigs
               let mrBizProfile2 = new Object();
               mrBizProfile2.UserId = "mrb02";
               mrBizProfile2.AvatarImageFileName = misterBusinessAvatarUrl2
               mrBizProfile2.UserFullName = "Mister Business";
               mrBizProfile2.TeamName = "Blind Pigs";
               possibleUsers.push(mrBizProfile2);
            }
            else {
               if (callback != null) {
                  callback(possibleUsers);
               }
               else {
                  return;
               }
            }
         }
         function LoadAvailableLeagues(callback, forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (possibleLeagues == null || possibleLeagues.length == 0 || forceReload == true) {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "flex",
                     cmd: "getDivisionsByUserId",
                     userId: legacyContainer.scope.TP1Username
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
                        let userDivisions = JSON.parse(data.userDivisionsList);
                        if (userDivisions != null) {
                           possibleLeagues.length = 0;
                           for (let dIndex = 0; dIndex < userDivisions.length; dIndex++) {
                              possibleLeagues.push(userDivisions[dIndex]);
                           }
                        }
                        if (callback != null) {
                           callback(possibleLeagues);
                        }
                     }
                  }
               });
            }
            else {
               if (callback != null) {
                  callback(possibleLeagues);
               }
               else {
                  return possibleLeagues;
               }

            }

         }
         function LoadPossibleWeeks(callback, forceReload, leagueId) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (possibleWeeks == null || possibleWeeks.length == 0 || forceReload == true) {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "flex",
                     cmd: "getScheduleForDivision",
                     divisionid: leagueId
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
                        let returnWeeks = JSON.parse(data.scheduleList);
                        if (returnWeeks != null) {
                           possibleWeeks = returnWeeks;
                        }
                        if (callback != null) {
                           callback(possibleWeeks);
                        }
                     }
                  }
               });
            }
         }
         function GetUserProfileByUserId(userId) {
            let returnProfile = possibleUsers.find(up => up.UserId == userId);
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
                     if (data.errormessage != null && data.errormessage != "") {
                        a$.jsonerror(data);
                        return;
                     }
                     else {
                        let userProfiles = JSON.parse(data.userProfiles);
                        let userProfile = userProfiles.find(u => u.UserId == userId);
                        possibleUsers.push(userProfile);
                        returnProfile = userProfile;
                     }
                  }
               });
            }

            return returnProfile;

         }
         function GetCurrentAGameLeagueById(leagueId) {
            let returnLeague = possibleLeagues.find(l => l.DivisionId == leagueId);
            if (returnLeague == null) {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "flex",
                     cmd: "getAGameDivisionById",
                     divisionid: leagueId,
                     deepload: false
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
                        let returnDivision = JSON.parse(data.returnDivision);
                        possibleLeagues.push(returnDivision);
                        returnLeague = returnDivision;
                     }
                  }
               });
            }
            return returnLeague;
         }
         function GetTeamByTeamId(teamId, leagueId) {
            let returnTeam = possibleTeams.find(t => t.AGameLeagueDivisionTeamId == teamId);
            if (returnTeam == null) {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "flex",
                     cmd: "getTeamsByDivisionId",
                     divisionid: leagueId
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
                        let returnTeams = JSON.parse(data.divisionTeamsList);
                        if (returnTeams.length > 0) {
                           for (let tIndex = 0; tIndex < returnTeams.length; tIndex++) {
                              possibleTeams.push(returnTeams[tIndex]);
                           }
                           returnTeam = possibleTeams.find(t => t.AGameLeagueDivisionTeamId == teamId);
                        }
                     }
                  }
               });
            }
            if(returnTeam == null)
            {
               returnTeam = GetTeamById(teamId);
            }
            return returnTeam;
         }
         function GetTeamById(teamId) {
            let returnTeam = possibleTeams.find(t => t.AGameLeagueDivisionTeamId == teamId);
            if (returnTeam == null) {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "flex",
                     cmd: "getLeagueTeamById",
                     teamId: teamId
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
                        returnTeam = JSON.parse(data.leagueTeam);
                        possibleTeams.push(returnTeam);
                     }
                  }
               });
            }
            return returnTeam;
         }

         function GetWeekByWeekNumber(weekNumber, leagueId) {
            let returnWeek = possibleWeeks.find(w => w.WeekNumber == weekNumber && w.LeagueId == leagueId);
            if (returnWeek == null) {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "flex",
                     cmd: "getScheduleForDivision",
                     divisionid: leagueId
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
                        let returnWeeks = JSON.parse(data.scheduleList);
                        if (returnWeeks.length > 0) {
                           for (let tIndex = 0; tIndex < returnWeeks.length; tIndex++) {
                              possibleWeeks.push(returnWeeks[tIndex]);
                           }
                           returnWeek = possibleWeeks.find(w => w.WeekNumber == weekNumber && w.LeagueId == leagueId);
                        }
                     }
                  }
               });
            }
            return returnWeek;
         }
         /*Listing Load End*/
         /* Wager Methods/Procedures START */
         function LoadMyWagers(callback) {
            GetMyWagers(function (myWagerList) {
               let hasWagers = (
                  (myWagerList != null && myWagerList.length > 0) ||
                  (myCurrentWagers != null && myCurrentWagers.length > 0)
               );

               if (hasWagers == false) {
                  LogInfo("No Wagers found. Setup Failed.");
                  HideAGameWagerHolder();
                  ShowNoWagersFoundHolder();
               }
               else {
                  ShowAGameWagerHolder();
                  HideNoWagersFoundHolder();
                  RenderWagers(callback, myWagerList);
                  LoadMyPendingWagers();
                  RenderMyBalance();
                  RenderHistoricalBalance();
                  RenderCurrentWager();
                  RenderMyRecord("allTimeStatsHolder", true);
                  GetMyAGameBalance(function () {
                     RenderMyBalance();
                  });
               }
               HideLoadingMessage();
            });
         }
         function LoadMyPendingWagers(callback) {
            GetMyPendingWagers(function () {
               RenderMyPendingWagers(null, null);
            });
         }
         function GetPastWagersForLeague(callback, leagueId, teamId) {
            let pastWagersHeader = myCurrentWagers.find(l => l.AGameLeagueId == leagueId && l.AGameTeamId == teamId);
            if (pastWagersHeader != null && pastWagersHeader.AGameWagerDetails != null) {
               $("#pastLeagueDetailHolder_" + leagueId + "_" + teamId).empty();
               let leagueWagers = pastWagersHeader.AGameWagerDetails;
               let leagueWagersAllHolder = $("<div />");
               let leagueWagersHeaderHolder = $("<div class=\"wager-header-row\" />");
               let weekNumberHeaderHolder = $("<div class=\"wager-list-item  wager-week-number\" />");
               weekNumberHeaderHolder.append("Week#");
               let weekDatesHeaderHolder = $("<div class=\"wager-list-item  wager-week-dates\" />");
               weekDatesHeaderHolder.append("Dates");
               let opponentHeaderHolder = $("<div class=\"wager-list-item wager-against-user\" />");
               opponentHeaderHolder.append("Opponent");
               let opponentScoreHeaderHolder = $("<div class=\"wager-list-item wager-opponent-score\" />");
               opponentScoreHeaderHolder.append("Opponent Score");
               let myScoreHeaderHolder = $("<div class=\"wager-list-item wager-my-score\" />");
               myScoreHeaderHolder.append("My Score");
               let wagerAmountHeaderHolder = $("<div class=\"wager-list-item wager-amount\" />");
               wagerAmountHeaderHolder.append("Wager Amount");
               let wagerStatusHeaderHolder = $("<div class=\"wager-list-item wager-status\" />");
               wagerStatusHeaderHolder.append("Status");
               let outcomeHeaderHolder = $("<div class=\"wager-list-item wager-outcome\" />");
               outcomeHeaderHolder.append("Outcome");

               leagueWagersHeaderHolder.append(weekNumberHeaderHolder);
               leagueWagersHeaderHolder.append(weekDatesHeaderHolder);
               leagueWagersHeaderHolder.append(opponentHeaderHolder);
               leagueWagersHeaderHolder.append(opponentScoreHeaderHolder);
               leagueWagersHeaderHolder.append(myScoreHeaderHolder);
               leagueWagersHeaderHolder.append(wagerAmountHeaderHolder);
               leagueWagersHeaderHolder.append(wagerStatusHeaderHolder);
               leagueWagersHeaderHolder.append(outcomeHeaderHolder);

               leagueWagersAllHolder.append(leagueWagersHeaderHolder);

               if (leagueWagers != null && leagueWagers.length > 0) {
                  for (let wIndex = 0; wIndex < leagueWagers.length; wIndex++) {
                     let wagerItem = leagueWagers[wIndex];
                     RenderWagerItemToHolder(wagerItem, leagueWagersAllHolder, true);
                  }
               }
               else {
                  leagueWagers.append("No Wagers found for this league.");
               }

               $("#pastLeagueDetailHolder_" + leagueId + "_" + teamId).append(leagueWagersAllHolder);
            }
            if (callback != null) {
               callback(leagueId);
            }
         }
         function RenderWagerItemToHolder(item, objectToRenderTo, isPastWager) {
            if (isPastWager == null) {
               isPastWager = false;
            }
            let avatarUrl = defaultAvatarUrl;
            let itemRow = $("<div class=\"wager-item-row\" />");
            let wagerWeekNumberHolder = $("<div class=\"wager-list-item wager-week-number\" />");
            let wagerWeekDatesHolder = $("<div class=\"wager-list-item wager-week-dates\" />");
            let wagerAgainstUserHolder = $("<div class=\"wager-list-item wager-against-user\" />");
            let userAvatarImageHolder = $("<div class=\"wager-list-item wager-list-avatar-holder\" />");
            let wagerItemOpponentTeamScoreHolder = $("<div class=\"wager-list-item wager-opponent-score\" />");
            let waterItemMyTeamScoreHolder = $("<div class=\"wager-list-item wager-my-score\" />");
            let wagerItemGameOutcomeHolder = $("<div class=\"wager-list-item wager-outcome\" />");
            let wagerItemWagerAmountHolder = $("<div class=\"wager-list-item wager-amount\" />");
            let wagerItemWagerStatusHolder = $("<div class=\"wager-list-item wager-status\" />");
            let userAvatarImg = $("<img class=\"wager-list-avatar-image small-avatar\" src=\"" + avatarUrl + "\">");

            let weekNumber = item.WeekNumber;
            if (weekNumber < 0) {
               weekNumber = "--";
            }
            wagerWeekNumberHolder.append(weekNumber);

            let weekStartDate = "";
            let weekEndDate = "";
            let weekObject = GetWeekByWeekNumber(weekNumber, item.AGameLeagueId);
            if (weekObject != null) {
               weekStartDate = new Date(weekObject.WeekStartDate).toLocaleDateString();
               weekEndDate = new Date(weekObject.WeekEndDate).toLocaleDateString();
            }
            if (weekStartDate != "" || weekEndDate != "") {
               wagerWeekDatesHolder.append(weekStartDate + " - " + weekEndDate);
            }
            let wagerAgainstProfile = GetUserProfileByUserId(item.WagerAgainstUserId);
            let wagerAgainstUserName = item.WagerAgainstUserId;
            if (wagerAgainstProfile != null) {
               if (wagerAgainstProfile.AvatarImageFileName != "empty_headshot.png") {
                  avatarUrl = Global_CleanAvatarUrl(wagerAgainstProfile.AvatarImageFileName);
               }
               wagerAgainstUserName = wagerAgainstProfile.UserFullName;
            }
            let wagerAgainstTeamName = "";
            if (item.WagerAgainstAGameTeamId >= 0) {
               let wagerAgainstTeamProfile = GetTeamByTeamId(item.WagerAgainstAGameTeamId, item.AGameLeagueId);
               if (wagerAgainstTeamProfile != null) {
                  wagerAgainstTeamName = wagerAgainstTeamProfile.TeamName;
               }
            }

            userAvatarImg.prop("src", avatarUrl);
            userAvatarImageHolder.append(userAvatarImg);
            wagerAgainstUserHolder.append(userAvatarImageHolder);
            wagerAgainstUserHolder.append("&nbsp;");
            wagerAgainstUserHolder.append(wagerAgainstUserName);
            if (wagerAgainstTeamName != null && wagerAgainstTeamName != "") {
               wagerAgainstUserHolder.append("&nbsp;")
               wagerAgainstTeamName = wagerAgainstTeamName.replace("(Blind Team)", "Blind Pigs");
               wagerAgainstUserHolder.append("<div class=\"wager-list-item vs-team-name\">[" + wagerAgainstTeamName + "]</div> ");
            }
            let opponentTeamScore = FormatScore(item.OpponentTeamScore, scoringType);
            let myTeamScore = FormatScore(item.MyTeamScore, scoringType);

            if (isPastWager == false && item.WeekNumber > currentWeekNumber) {
               myTeamScore = "--";
               opponentTeamScore = "--";
            }

            wagerItemOpponentTeamScoreHolder.append(opponentTeamScore);
            waterItemMyTeamScoreHolder.append(myTeamScore);
            let wagerOutcome = item.WagerOutcome;
            let currentWeek = possibleWeeks.find(w => w.Id == item.AGameWeekId && w.LeagueId == item.AGameLeagueId );
            let isRosterLocked = false;
            if(currentWeek != null)
            {
               CheckRosterLocked(new Date(currentWeek.WeekStartDate).toLocaleDateString(), daysUntilRosterLockParamValue, function(returnValue){
                  isRosterLocked = returnValue;
               });
            }
            
            if (isPastWager == false && (item.WeekNumber == (currentWeekNumber + 1) || (item.WeekNumber == currentWeekNumber && isRosterLocked == false))) {
               let canCreateWager = false;
               canCreateWager = ((item.WagerStatusId == null || ((item.WagerStatusChangeUserId != legacyContainer.scope.TP1Username) && item.WagerStatusId != 2)));

               if (canCreateWager == true) {
                  let wagerButton = $("<button id=\"challengeOther_" + item.AGameWagerDetailId + "\"><i class=\"fa fa-coin\"></i></button>");
                  wagerButton.on("click", function () {
                     let buttonId = this.id;
                     let wagerId = buttonId.split("_")[1];
                     HandleChallengeWager(function(){
                        ko.postbox.publish("aGameWagerReloadChallenges", true);
                     }, wagerId, "create");
                  });
                  wagerItemGameOutcomeHolder.append(wagerButton);
               }
               else {
                  let currentWagerStatusString = "Negotiating";
                  wagerOutcome = "negotiating";
                  
                  let wagerStatusObject = GetWagerStatusObjectFromId(item.WagerStatusId);
                  if (wagerStatusObject != null) {
                     currentWagerStatusString = wagerStatusObject.Name;
                  }
                  if (item.WagerStatusId == 2) {
                     wagerOutcome = "accepted";
                  }
                  else if (item.WagerStatusId == 3) {
                     wagerOutcome = "rejected";
                  }
                  else if (item.WagerStatusId == 5) {
                     wagerOutcome = "rejected";
                  }
                  wagerItemGameOutcomeHolder.append(currentWagerStatusString);
               }
            }
            else {
               if (isPastWager == false && item.WeekNumber == currentWeekNumber && isRosterLocked == false) {
                  wagerOutcome = "in progress";
                  itemRow.addClass("active");
                  itemRow.addClass("current-week-row");
               }
               else if (wagerOutcome == null || wagerOutcome == "") {
                  wagerOutcome = "&nbsp;"
               }
               wagerItemGameOutcomeHolder.append(wagerOutcome);
            }
            if (wagerOutcome != null && wagerOutcome != "" && wagerOutcome != "&nbsp;") {
               wagerItemGameOutcomeHolder.addClass("wager-outcome-" + wagerOutcome.replace(" ", "-").toLowerCase());
            }

            let wagerAmount = item.WagerAmount || 0;
            if (item.WagerAmount == null) {
               wagerItemWagerAmountHolder.append("No Wager");
            }
            else {
               wagerItemWagerAmountHolder.append(wagerAmount.toLocaleString("en-US", { style: "currency", currency: "USD" }));
            }
            let wagerStatus = GetWagerStatusNameFromId(item.WagerStatusId);
            if(wagerStatus != "")
            {
               wagerItemWagerStatusHolder.append(wagerStatus);
            }

            itemRow.append(wagerWeekNumberHolder);
            itemRow.append(wagerWeekDatesHolder);
            itemRow.append(wagerAgainstUserHolder);
            itemRow.append(wagerItemOpponentTeamScoreHolder);
            itemRow.append(waterItemMyTeamScoreHolder);
            itemRow.append(wagerItemWagerAmountHolder);
            itemRow.append(wagerItemWagerStatusHolder);
            itemRow.append(wagerItemGameOutcomeHolder);

            $(objectToRenderTo).append(itemRow);
         }
         function GetMyPendingWagers(callback, forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (myPendingWagers != null && myPendingWagers.length > 0 && forceReload == false) {
               if (callback != null) {
                  callback(myPendingWagers);
               }
            }
            else {
               if (myCurrentLeagueWagerHeader != null) {
                  //myPendingWagers = myCurrentLeagueWagerHeader.AGameWagerDetails.filter(w => (w.WeekNumber == currentWeekNumber || w.WeekNumber == (currentWeekNumber + 1) && w.WagerStatusId != null));
                  myPendingWagers = myCurrentLeagueWagerHeader.AGameWagerDetails.filter(w => w.WeekNumber == (currentWeekNumber + 1) && w.WagerStatusId != null);
               }
               else {
                  //myPendingWagers = myCurrentWagers[0]?.AGameWagerDetails.filter(w => (w.WeekNumber == currentWeekNumber || w.WeekNumber == (currentWeekNumber + 1)) && w.WagerStatusId != null);
                  myPendingWagers = myCurrentWagers[0]?.AGameWagerDetails.filter(w => w.WeekNumber == (currentWeekNumber + 1) && w.WagerStatusId != null);
               }
            }

            if (callback != null) {
               callback();
            }
         }
         function RenderMyPendingWagers(callback, listToRender) {
            if (listToRender == null) {
               listToRender = myPendingWagers;
            }
            //Remove the timed out/no wager items out of the possible pending info
            listToRender = listToRender.filter(i => i.WagerStatusId != 5 && i.WagerStatusId != 6);

            let pendingWagersHolder = $("<div />");
            
            if (listToRender != null && listToRender.length > 0) {
               for (let cIndex = 0; cIndex < listToRender.length; cIndex++) {
                  let pendingItem = listToRender[cIndex];
                  let pendingItemHolder = $("<div class=\"pending-wager-row\" />");
                  let avatarUrl = defaultAvatarUrl;

                  let pendingAmountHolder = $("<div class=\"wager-list-item wager-amount\" />");
                  let pendingAmount = pendingItem.WagerAmount || 0;
                  pendingAmountHolder.append(pendingAmount.toLocaleString("en-US", { style: "currency", currency: "USD" }));

                  let pendingWagerChallengerHolder = $("<div class=\"wager-list-item wager-against-user\" />");
                  let otherPersonName = pendingItem.WagerAgainstUserId || "";
                  let otherPersonProfile = GetUserProfileByUserId(pendingItem.WagerAgainstUserId);

                  if (otherPersonProfile != null) {
                     if (otherPersonProfile.AvatarImageFileName != "empty_headshot.png") {
                        avatarUrl = Global_CleanAvatarUrl(otherPersonProfile.AvatarImageFileName);
                     }
                     otherPersonName = otherPersonProfile.UserFullName;
                  }
                  let userAvatarImageHolder = $("<div class=\"wager-list-item wager-list-avatar-holder\" />");
                  let userAvatarImg = $("<img class=\"wager-list-avatar-image small-avatar\" src=\"" + avatarUrl + "\">");
                  userAvatarImageHolder.append(userAvatarImg);
                  pendingWagerChallengerHolder.append(userAvatarImageHolder);
                  pendingWagerChallengerHolder.append("&nbsp;");
                  pendingWagerChallengerHolder.append(otherPersonName);

                  let pendingWagerStatusHolder = $("<div class=\"wager-list-item button-holder\" />");
                  if (pendingItem.WagerStatusId == 2) {
                     let acceptedOn = new Date(pendingItem.WagerStatusDate).toLocaleDateString();
                     let acceptedBy = pendingItem.WagerStatusChangeUserId || "";
                     if (acceptedBy != null && acceptedBy != "") {
                        if (acceptedBy == legacyContainer.scope.TP1Username) {
                           acceptedBy = "(You)";
                        }
                        else {
                           acceptedBy = "(" + otherPersonName + ")";
                        }
                     }
                     let acceptedCheck = $("<span class=\"wager-accepted-holder\"><i class=\"fa fa-check-circle green\" /></span>");
                     pendingWagerStatusHolder.append(acceptedCheck);

                     let acceptedOnHolder = $("<div class=\"wager-list-item wager-accepted-on-holder\" />");
                     acceptedOnHolder.append(acceptedOn);
                     acceptedOnHolder.append("&nbsp;");
                     acceptedOnHolder.append(acceptedBy);

                     pendingWagerStatusHolder.append(acceptedOnHolder);
                  }
                  else if (pendingItem.WagerStatusId == 3) {
                     let pendingItemStatusDate = new Date(pendingItem.WagerStatusDate).toLocaleDateString();
                     let statusChangeBy = pendingItem.WagerStatusChangeUserId || "";
                     if (statusChangeBy != null && statusChangeBy != "") {
                        if (statusChangeBy == legacyContainer.scope.TP1Username) {
                           statusChangeBy = "(You)";
                        }
                        else {
                           statusChangeBy = "(" + otherPersonName + ")";
                        }
                     }
                     let pendingItemStatus = $("<span class=\"wager-rejected-holder\"><i class=\"fa fa-circle-xmark red\" /></span>");
                     pendingWagerStatusHolder.append(pendingItemStatus);

                     let statusChangeOnHolder = $("<div class=\"wager-list-item wager-rejected-on-holder\" />");
                     statusChangeOnHolder.append(pendingItemStatusDate);
                     statusChangeOnHolder.append("&nbsp;");
                     statusChangeOnHolder.append(statusChangeBy);

                     pendingWagerStatusHolder.append(statusChangeOnHolder);
                  }
                  else {
                     if (pendingItem.WagerStatusId == 1 &&
                        pendingItem.WagerStatusChangeUserId != legacyContainer.scope.TP1Username) {
                        let acceptChallengeButton = $("<button id=\"acceptWager_" + pendingItem.AGameWagerDetailId + "\"><i class=\"fa fa-check\"></i></button>");
                        acceptChallengeButton.on("click", function () {
                           let buttonId = this.id;
                           let wagerId = buttonId.split("_")[1];
                           HandleChallengeWager(function () {
                              SendWagerMessage(function () {
                                 ko.postbox.publish("aGameWagerReloadChallenges", true);
                              }, "accept");
                           }, wagerId, "accept");
                        });
                        let rejectChallengeButton = $("<button id=\"rejectWager_" + pendingItem.AGameWagerDetailId + "\"><i class=\"fa fa-close\"></i></button>");
                        rejectChallengeButton.on("click", function () {
                           let buttonId = this.id;
                           let wagerId = buttonId.split("_")[1];
                           HandleChallengeWager(function () {
                              SendWagerMessage(function () {
                                 ko.postbox.publish("aGameWagerReloadChallenges", true);
                              }, "reject");
                           }, wagerId, "reject");
                        });
                        let counterChallengeButton = $("<button id=\"counterWager_" + pendingItem.AGameWagerDetailId + "\"><i class=\"fa fa-reply\"></i></button>");
                        counterChallengeButton.on("click", function () {
                           let buttonId = this.id;
                           let wagerId = buttonId.split("_")[1];
                           HandleChallengeWager(function(){
                              ko.postbox.publish("aGameWagerReloadChallenges", true);
                           }, wagerId, "counter");
                        });
                        if (IsLeagueRosterLocked(pendingItem.WeekNumber) == false) {
                           pendingWagerStatusHolder.append(acceptChallengeButton);
                           pendingWagerStatusHolder.append("&nbsp;");
                           pendingWagerStatusHolder.append(rejectChallengeButton);
                           pendingWagerStatusHolder.append("&nbsp;");
                           pendingWagerStatusHolder.append(counterChallengeButton);
                        }
                     }
                     else {
                        let currentStatus = GetWagerStatusNameFromId(pendingItem.WagerStatusId);
                        pendingWagerStatusHolder.append(currentStatus);                        
                        LogInfo("Waiting on other person to accept or reject.");
                     }
                  }

                  pendingItemHolder.append(pendingWagerChallengerHolder);
                  pendingItemHolder.append(pendingAmountHolder);
                  pendingItemHolder.append(pendingWagerStatusHolder);

                  pendingWagersHolder.append(pendingItemHolder);
               }
            }
            else {
               pendingWagersHolder.append("<div class='p-15'>No Pending Wagers.</div>");
            }

            $("#pendingWagersList", element).empty();
            $("#pendingWagersList", element).append(pendingWagersHolder);

            if (callback != null) {
               callback();
            }

         }
         function GetMyAGameBalance(callback) {
            let returnValue = myCurrentLeagueWagerHeader;
            if (returnValue == null) {
               returnValue = myCurrentWagers[0];
            }
            if (callback != null) {
               callback(returnValue);
            }
            return returnValue;
         }
         function RenderMyBalance(callback, balanceObject) {
            if (balanceObject == null) {
               balanceObject = myCurrentLeagueWagerHeader;
            }
            let myBalance = balanceObject.CurrentBalance || 0;
            let myPendingBalance = balanceObject.PendingBalance || 0;
            let myAvailbleBalance = balanceObject.AvailableBalance || 0;
            let leagueName = balanceObject.AGameLeagueId;
            let leagueProfile = GetCurrentAGameLeagueById(balanceObject.AGameLeagueId);
            if (leagueProfile != null) {
               leagueName = leagueProfile.DivisionName;
            }
            let teamName = balanceObject.AGameTeamId;
            let teamProfile = GetTeamByTeamId(balanceObject.AGameTeamId, balanceObject.AGameLeagueId);
            if (teamProfile != null) {
               teamName = teamProfile.AGameLeagueTeamName;
               if (teamName == null || teamName == "") {
                  teamName = teamProfile.ClientTeamName;
               }
            }

            $("#lblMyBalance", element).text(myBalance.toLocaleString("en-US", { style: "currency", currency: "USD" }));
            $("#lblMyPendingBalance", element).text(myPendingBalance.toLocaleString("en-US", { style: "currency", currency: "USD" }));
            $("#lblMyAvailableBalance", element).text(myAvailbleBalance.toLocaleString("en-US", { style: "currency", currency: "USD" }));
            $("#lblCurrentLeague", element).text(leagueName);
            $("#lblCurrentTeam", element).text(teamName);

            if (callback != null) {
               callback();
            }
         }
         function RenderHistoricalBalance(callback) {
            //let pastWagers = myCurrentWagers.filter(w => w.AGameLeagueId != myCurrentLeagueWagerHeader.AGameLeagueId);

            let totalWinningsAmount = 0;
            let totalLossesAmount = 0;

            for (let pwIndex = 0; pwIndex < myCurrentWagers.length; pwIndex++) {
               let pwItem = myCurrentWagers[pwIndex];
               for (let dIndex = 0; dIndex < pwItem.AGameWagerDetails.length; dIndex++) {
                  switch (pwItem.AGameWagerDetails[dIndex].WagerOutcome.toLowerCase()) {
                     case "win".toLowerCase():
                        totalWinningsAmount += pwItem.AGameWagerDetails[dIndex].WagerAmount;
                        break;
                     case "loss".toLowerCase():
                        totalLossesAmount += pwItem.AGameWagerDetails[dIndex].WagerAmount;
                        break;
                  }
               }
            }

            $("#allTimeWinningsHolder", element).empty();
            $("#allTimeWinningsHolder", element).text(totalWinningsAmount.toLocaleString("en-US", { style: "currency", currency: "USD" }));
            $("#allTimeLossesHolder", element).empty();
            $("#allTimeLossesHolder", element).text(totalLossesAmount.toLocaleString("en-US", { style: "currency", currency: "USD" }));
            if(callback != null)
            {
               callback();
            }
         }
         function RenderMyRecord(renderToObjectId, isAllTime) {
            if (renderToObjectId == null) {
               renderToObjectId = "currentWinLossRecord";
            }
            if (isAllTime == null) {
               isAllTime = false;
            }
            let myWins = GetMyWagerRecord("wins", isAllTime);
            let myLosses = GetMyWagerRecord("lose", isAllTime);
            let myTies = GetMyWagerRecord("tie", isAllTime);;
            let winLossString = "";
            if (myTies > 0) {
               winLossString = "(<span class=\"my-wins-count\">" + myWins + "</span> - <span class=\"my-losses-count\">" + myLosses + "</span> - <span class=\"my-ties-count\">" + myTies + "</span>)";
            }
            else {
               winLossString = "(<span class=\"my-wins-count\">" + myWins + "</span> - <span class=\"my-losses-count\">" + myLosses + "</span>)";
            }
            $("#" + renderToObjectId, element).html(winLossString);
         }
         function GetMyWagers(callback, forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (myCurrentWagers != null && myCurrentWagers.length > 0 && forceReload == false) {
               if (callback != null) {
                  callback(myCurrentWagers);
               }
               return myCurrentWagers;
            }
            else {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: true,
                  data: {
                     lib: "flex",
                     cmd: "getWagersForUser",
                     userId: legacyContainer.scope.TP1Username
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
                        let wagerList = JSON.parse(data.wagerList);
                        myCurrentWagers.length = 0;
                        myCurrentWagers = wagerList;
                        if (callback != null) {
                           callback(wagerList);
                        }
                        return wagerList;
                     }
                  }
               });
            }
         }
         function RenderWagers(callback, listToRender, renderToObjectId) {
            if (renderToObjectId == "historyLeagueWagersList") {
               RenderHistoricalWagers(callback, listToRender);
            }
            else {
               RenderMyWagers(callback, listToRender);
            }
            RenderMyRecord();
            // RenderMyRecord("allTimeStatsHolder", true);

         }
         function RenderMyWagers(callback, wagerHeaderList) {
            if (wagerHeaderList == null) {
               wagerHeaderList = myCurrentWagers;
            }
            // //TODO: find and use the league we are looking at.
            // //For now we will use the first item in the list.
            wagerHeaderList = SortHeaderListDesc(wagerHeaderList);

            let myLeague = wagerHeaderList[0];
            myCurrentLeagueWagerHeader = myLeague;

            let listToRender = myLeague?.AGameWagerDetails;
            listToRender = SortMyWagerList(listToRender);

            let wagerListHolder = $("<div />");
            if (listToRender != null && listToRender.length > 0) {
               for (let iIndex = 0; iIndex < listToRender.length; iIndex++) {
                  let wagerItem = listToRender[iIndex];
                  RenderWagerItemToHolder(wagerItem, wagerListHolder);
               }
            }
            else {
               wagerListHolder.append("No wagers found.");
            }
            $("#currentLeagueWagersList", element).empty();
            $("#currentLeagueWagersList", element).append(wagerListHolder);
            if (callback != null) {
               callback();
            }
         }
         function RenderHistoricalWagers(callback, headerListToRender) {
            if (headerListToRender == null) {
               headerListToRender = myCurrentWagers.filter(h => h.AGameLeagueId != myCurrentLeagueWagerHeader.AGameLeagueId);
            }
            let wagerListHolder = $("<div />");
            if (headerListToRender != null && headerListToRender.length > 0) {
               let headerRow = $("<div class=\"\" />");
               let showAllStatus = $("<input type=\"hidden\" id=\"txtShowAllStatus\" value=\"-1\" />");
               let showHideAllButton = $("<button id=\"btnShowHideAllHistory_0\" class=\"showall-btn\">Show All</button>");

               showHideAllButton.on("click", function () {
                  let curStatus = $("#txtShowAllStatus").val();
                  if (curStatus < 0) {
                     ShowAllHistoryDetails();
                     $("#txtShowAllStatus").val(1);
                     $("#btnShowHideAllHistory_0").text("Hide All");
                  }
                  else {
                     HideAllHistoryDetails();
                     $("#txtShowAllStatus").val(-1);
                     $("#btnShowHideAllHistory_0").text("Show All");
                  }
               });

               headerRow.append(showHideAllButton);
               headerRow.append(showAllStatus);

               wagerListHolder.append(headerRow);
               for (let lIndex = 0; lIndex < headerListToRender.length; lIndex++) {

                  let leagueHeaderItem = headerListToRender[lIndex];
                  let leagueId = leagueHeaderItem.AGameLeagueId;
                  let teamId = leagueHeaderItem.AGameTeamId || 0;
                  let listToRender = leagueHeaderItem.AGameWagerDetails;

                  let leagueRowHolder = $("<div id=\"pastLeague_" + leagueId + "_" + teamId + "\" class=\"wager-list-league-row-holder\" />");
                  let leagueRowExpander = $("<div id=\"pastLeagueExpander_" + leagueId + "_" + teamId + "\"  />");
                  let leagueExpandButton = $("<button id=\"btnLeagueExpander_" + leagueId + "_" + teamId + "\"><i class=\"fa fa-plus\"></i></button>");
                  leagueExpandButton.on("click", function () {
                     let buttonId = this.id;
                     let buttonLeagueId = buttonId.split("_")[1];
                     let buttonTeamId = buttonId.split("_")[2] || 0;
                     GetPastWagersForLeague(function (id) {
                        TogglePastWagersForLeague(id, buttonTeamId);
                     }, buttonLeagueId, buttonTeamId);
                  });

                  leagueRowExpander.append(leagueExpandButton);
                  leagueRowHolder.append(leagueRowExpander);

                  let leagueNameHolder = $("<div class=\"wager-list-item wager-league-name\" />");
                  let leagueName = "League: " + leagueId;
                  let leagueProfile = GetCurrentAGameLeagueById(leagueId);
                  if (leagueProfile != null) {
                     leagueName = leagueProfile.DivisionName;
                  }
                  let teamName = "";
                  let teamProfile = GetTeamByTeamId(teamId, leagueId);
                  if (teamProfile != null) {
                     teamName = teamProfile.AGameLeagueTeamName;
                  }
                  let teamNameHolder = $("<div class=\"wager-list-item wager-team-name\" />");
                  teamNameHolder.append(teamName);

                  let leagueWagerCount = $("<span class=\"wagers-placed-count\" />");
                  leagueWagerCount.append(listToRender.length + " wager(s)");

                  leagueNameHolder.append(leagueName);
                  if (teamName != "") {
                     leagueNameHolder.append("&nbsp;-&nbsp;");
                     leagueNameHolder.append(teamNameHolder);
                  }
                  leagueNameHolder.append(leagueWagerCount);

                  leagueRowHolder.append(leagueNameHolder);

                  let leagueDetailHolder = $("<div class=\"past-wager-detail-holder\" id=\"pastLeagueDetailHolder_" + leagueId + "_" + teamId + "\" />");
                  let leagueDetailsText = "";
                  if (listToRender.length == 0) {
                     leagueDetailsText = "No wagers found for league."
                  }
                  leagueDetailHolder.append(leagueDetailsText);

                  leagueRowHolder.append(leagueDetailHolder);
                  wagerListHolder.append(leagueRowHolder);
               }
            }
            else {
               let noPastWagerMessageHolder = $("<div class=\"no-past-wagers-found\" />");
               noPastWagerMessageHolder.append("<div class='p-15'>No past wager history found.</div>");

               wagerListHolder.append(noPastWagerMessageHolder);
            }

            $("#historyLeagueWagersList", element).empty();
            $("#historyLeagueWagersList", element).append(wagerListHolder);

            HideAllHistoryDetails();
            if (callback != null) {
               callback();
            }
         }
         function SortHeaderListDesc(listToSort) {
            let sortedList = listToSort;
            sortedList = sortedList.sort((a, b) => {
               if (a.AGameLeagueId < b.AGameLeagueId) {
                  return 1;
               }
               else if (a.AGameLeagueId > b.AGameLeagueId) {
                  return -1;
               }
               else {
                  return 0;
               }
            });

            return sortedList;
         }
         function SortMyWagerList(listToSort) {
            let sortedList = listToSort;
            sortedList = sortedList.sort((a, b) => {
               if (a.WeekNumber < b.WeekNumber) {
                  return -1;
               }
               else if (a.WeekNumber > b.WeekNumber) {
                  return 0;
               }
            });
            return sortedList;
         }
         function HandleListingTabClicked(callback, tabId) {
            HideAllListingTabs();
            switch (tabId) {
               case "wagerHistoricalTab":
                  ShowHistoryLeagueWagers();
                  break;
               default:
                  ShowCurrentLeagueWagers();
                  break;
            }
            MarkListingTabActive(tabId);
            if (callback != null) {
               callback();
            }
         }
         function MarkListingTabActive(tabId) {
            $(".listing-tab", element).each(function () {
               $(this).removeClass("active");
            });
            $("#" + tabId, element).addClass("active");
         }
         function RenderCurrentWager(callback, weekNumber, leagueId, teamId) {
            if (weekNumber == null) {
               weekNumber = currentWeekNumber;
            }
            if (leagueId == null) {
               leagueId = myCurrentWagers[0]?.LeagueId || -8888;
            }
            if (teamId == null) {
               teamId = myCurrentWagers[0]?.TeamId || -9999;
            }

            let curWager = myCurrentLeagueWagerHeader.AGameWagerDetails.find(w => w.WeekNumber == weekNumber);
            let currentWagerAgainstUserName = "No wager";
            let currentWagerAmount = 0;
            let userAvatarUrl = defaultAvatarUrl;
            let currentWagerOpponentScore = 0;
            let currentWagerMyScore = 0;
            let theirTeamName = "Their Score";
            let myTeamName = "My Score";
            let userAvatarImageHolder = $("<div class=\"wager-list-item wager-list-avatar-holder\" />");
            let userAvatarImg = $("<img class=\"wager-list-avatar-image small-avatar\" src=\"" + userAvatarUrl + "\">");

            if (curWager != null && weekNumber > 0) {
               let theirTeamProfile = GetTeamByTeamId(curWager.WagerAgainstAGameTeamId);
               if (theirTeamProfile != null) {
                  theirTeamName = theirTeamProfile.TeamName;
               }
               let myTeamProfile = GetTeamByTeamId(curWager.AGameTeamId);
               if (myTeamProfile != null) {
                  myTeamName = myTeamProfile.TeamName;
               }
               if (curWager != null) {
                  currentWagerAgainstUserName = curWager.WagerAgainstUserId;
                  let currentWagerAgainstProfile = GetUserProfileByUserId(curWager.WagerAgainstUserId);
                  if (currentWagerAgainstProfile != null) {
                     if (currentWagerAgainstProfile.AvatarImageFileName != "empty_headshot.png") {
                        userAvatarUrl = Global_CleanAvatarUrl(currentWagerAgainstProfile.AvatarImageFileName);
                     }
                     currentWagerAgainstUserName = currentWagerAgainstProfile.UserFullName;
                  }

                  currentWagerAmount = curWager.WagerAmount;
                  currentWagerMyScore = parseFloat(FormatScore(curWager.MyTeamScore));
                  currentWagerOpponentScore = parseFloat(FormatScore(curWager.OpponentTeamScore));

                  let curWagerStatus = GetWagerStatusNameFromId(curWager.WagerStatusId)?.toLowerCase()?.replace(" ", "-");            
                  if (curWagerStatus != "") {
                     $("#curWagerAmountHolder", element).attr("class", curWagerStatus);
                  }
   
               }
               userAvatarImg.attr("src", userAvatarUrl);
               userAvatarImageHolder.append(userAvatarImg);
            }

            $("#curWagerAgainstUser", element).empty();
            $("#curWagerAgainstUser", element).append(currentWagerAgainstUserName);
            $("#curWagerAgainstUser", element).append("&nbsp;");
            $("#curWagerAgainstUser", element).append(userAvatarImageHolder);

            $("#curWagerAmount", element).empty();
            $("#curWagerAmount", element).append(currentWagerAmount.toLocaleString("en-US", { style: "currency", currency: "USD" }));

            $("#curWagerOpponentGameScore", element).empty();
            $("#curWagerOpponentGameScore", element).append(currentWagerOpponentScore);
            $("#curWagerMyGameScore", element).empty();
            $("#curWagerMyGameScore", element).append(currentWagerMyScore);

            $("#curWagerOpponentGameScoreHolder", element).removeClass("wager-current-leading");
            $("#curWagerMyGameScoreHolder", element).removeClass("wager-current-leading");

            $("#curWagerOponentTeamName", element).empty();
            $("#curWagerOponentTeamName", element).append(theirTeamName);
            $("#curWagerMyTeamName", element).empty();
            $("#curWagerMyTeamName", element).append(myTeamName);


            if (currentWagerOpponentScore > currentWagerMyScore) {
               $("#curWagerOpponentGameScoreHolder", element).addClass("wager-current-leading");
            }
            else if (currentWagerOpponentScore < currentWagerMyScore) {
               $("#curWagerMyGameScoreHolder", element).addClass("wager-current-leading");
            }


            if (callback != null) {
               callback();
            }
         }
         function GetMyWagerRecord(recordStat, allTimeCheck) {
            let returnValue = 0;

            if (allTimeCheck == null) {
               allTimeCheck = false;
            }
            if (recordStat == null) {
               recordStat = "unknown";
            }
            let wagersToCheck = [];
            if (allTimeCheck == true) {
               for (let i = 0; i < myCurrentWagers.length; i++) {
                  for (let j = 0; j < myCurrentWagers[i].AGameWagerDetails.length; j++) {
                     wagersToCheck.push(myCurrentWagers[i].AGameWagerDetails[j]);
                  }
               }
            }
            else {
               wagersToCheck = myCurrentLeagueWagerHeader.AGameWagerDetails;
            }

            switch (recordStat.toLowerCase()) {
               case "win":
               case "wins":
                  returnValue = wagersToCheck.filter(i => i.WagerOutcome?.toLowerCase() == "win".toLowerCase()).length;
                  break;
               case "lose":
               case "loses":
                  returnValue = wagersToCheck.filter(i => i.WagerOutcome?.toLowerCase() == "loss".toLowerCase()).length;
                  break;
               case "tie":
               case "ties":
                  returnValue = wagersToCheck.filter(i => i.WagerOutcome?.toLowerCase() == "tie".toLowerCase()).length;
                  break;
            }


            return returnValue;
         }
         function HandleChallengeWager(callback, wagerId, handleType) {
            let showCreateForm = false;

            if (handleType == null) {
               handleType = "unknown";
            }
            switch (handleType.toLowerCase()) {
               case "accept".toLowerCase():                  
                  DoChallengeAccepted(null, wagerId);
                  break;
               case "reject".toLowerCase():
                  DoChallengeRejected(callback, wagerId);
                  break;
               case "counter".toLowerCase():
                  CounterChallenge(function () {
                     ShowEditorForm();
                  }, wagerId);
               // break;
               case "create".toLowerCase():
                  LoadChallengeWager(wagerId, "create");
                  showCreateForm = true;
                  break;
               default:
                  LogInfo("Unknown Handle Challenge Wager clicked. WagerId: " + wagerId + "[" + handleType + "]");
                  break;
            }
            if (showCreateForm == true) {
               ShowEditorForm();
            }
            else {
               if (callback != null) {
                  callback();
               }
            }
         }
         function SendWagerMessage(callback, wagerType) {
            if (wagerType == null) {
               wagerType = $("#wagerAgainstType", element).val();
            }
            let wagerId = $("#wagerAgainstId", element).val();
            LogInfo("SendWagerMessage - " + wagerType + "\nID:" + wagerId, null);
            if (callback != null) {
               callback();
            }
         }
         /* Wager Methods/Procedures END */
         /* Editor Form Handling START*/
         function LoadChallengeWager(wagerId, wagerType) {
            if (wagerType == null) {
               wagerType = "create";
            }
            let wagerToCreate = myCurrentLeagueWagerHeader.AGameWagerDetails.find(w => w.AGameWagerDetailId == wagerId);
            $("#wagerAgainstId", element).val(wagerId);
            if (wagerToCreate !== null) {
               if (wagerToCreate.WagerAmount != 0) {
                  wagerType = "counter";
               }
               let againstUserName = wagerToCreate.WagerAgainstUserId;
               let againstUserProfile = GetUserProfileByUserId(wagerToCreate.WagerAgainstUserId);

               if (againstUserProfile != null) {
                  againstUserName = againstUserProfile.UserFullName;
               }
               $("#lblWagerAgainstUserId", element).empty();
               $("#lblWagerAgainstUserId", element).append(againstUserName);

               $("#wagerAgainstUserId", element).val(wagerToCreate.WagerAgainstUserId);
               $("#wagerAmount", element).val(wagerToCreate.WagerAmount);
            }
            $("#wagerAgainstType", element).val(wagerType);
         }
         function DoChallengeAccepted(callback, wagerId) {
            a$.ajax({
               type: "POST",
               service: "C#",
               async: false,
               data: {
                  lib: "flex",
                  cmd: "acceptWager",
                  detailId: wagerId
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
                     AddWagerFinalizedSignal(wagerId, "accepted");
                     if (callback != null) {
                        callback();
                     }
                  }
               }
            });
         }
         function DoChallengeRejected(callback, wagerId) {
            a$.ajax({
               type: "POST",
               service: "C#",
               async: false,
               data: {
                  lib: "flex",
                  cmd: "rejectWager",
                  detailId: wagerId
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
                     let poIndex = myPendingWagers.findIndex(o => o.AGameWagerDetailId == wagerId);
                     myPendingWagers[poIndex].WagerOutcome = "rejected";
                     myPendingWagers[poIndex].AcceptedOn = new Date();
                     myPendingWagers[poIndex].StatusChangeBy = legacyContainer.scope.TP1Username;
                     AddWagerFinalizedSignal(wagerId, "rejected");
                     ko.postbox.publish("aGameWagerReloadChallenges");

                     if (callback != null) {
                        callback();
                     }
                  }
               }
            });
         }
         function CounterChallenge(callback, wagerId) {
            LoadChallengeWager(wagerId, "counter");
            if (callback != null) {
               callback();
            }
         }
         function ClearEditorForm(callback) {
            $("#wagerAgainstUserId", element).val("");
            $("#wagerAgainstType", element).val("");
            $("#wagerAgainstId", element).val(-1);
            $("#wagerAmount", element).val(0);
            $(".error-information-holder", element).html("");

            if (callback != null) {
               callback();
            }
         }
         function SaveEditorForm(callback) {
            ValidateWagerForm(function () {
               let objectToSave = CollectWagerDataObject();
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: true,
                  data: {
                     lib: "flex",
                     cmd: "createWager",
                     objectToSave: JSON.stringify(objectToSave)
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
                        AddWagerSignal(objectToSave);
                        if (callback != null) {
                           callback();
                        }
                     }
                  }
               });
            });
         }
         function ValidateWagerForm(callback) {
            $(".error-information-holder", element).empty();

            let wagerAmount = $("#wagerAmount", element).val();
            let formValid = true;
            var errorMessages = [];


            if (wagerAmount == null || wagerAmount == "") {
               errorMessages.push({ message: "Wager Amount Required", fieldclass: "", fieldid: "wagerAmount" });
               formValid = false;
            }
            else if (isNaN(wagerAmount)) {
               errorMessages.push({ message: "Wager Amount must be a number.", fieldclass: "", fieldid: "wagerAmount" });
               formValid = false;
            }
            else if (wagerAmount > maxWagerAmount) {
               errorMessages.push({ message: "Wager Amount can not exceed " + maxWagerAmount, fieldclass: "", fieldid: "wagerAmount" });
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
                  else if (item.fieldid != "") {
                     $("#" + item.fieldid, element).addClass("errorField");
                     $("#" + item.fieldid, element).off("blur").on("blur", function () {
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
         function CollectWagerDataObject() {
            let id = $("#wagerAgainstId", element).val();
            let wagerAmount = $("#wagerAmount", element).val();
            let returnObject = myCurrentLeagueWagerHeader.AGameWagerDetails.find(i => i.AGameWagerDetailId == id);
            returnObject.WagerAmount = wagerAmount;

            return returnObject;
         }
         /* Editor Form Handling END*/
         //TODO: Move the MISC functions to a more common file that can be accessed easily.
         //These functions can be used within the whole application.
         /*MISC Functions*/
         function NavigateToAGameLeague(section, divisionId) {
            LogInfo("Naviate to the A-GAME Section.");
            if (section == null) {
               section = "roster";
            }
            let userRole = legacyContainer.scope.TP1Role;
            ko.postbox.publish("SetNavigation", { type: "AGame", leagueid: divisionId, display: section, role: userRole });
         }
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
         function IsLeagueRosterLocked(weekNumber) {
            let returnValue = false;
            if (weekNumber == currentWeekNumber) {
               //TODO: Determine if the roster is locked.
               //Have to decide where this information comes from.
               returnValue = true;
            }
            return returnValue;
         }
         /*MISC Functions END*/
         /*Show/Hide/Collapse/Toggle*/
         function HideAll() {
            ShowLoadingMessage();
            HideNoWagersFoundHolder();
            HideAGameWagerHolder();
            HideAllListingTabs();
            HideEditorForm();
         }
         function HideAllListingTabs() {
            HideCurrentLeagueWagers();
            HideHistoryLeagueWagers();
         }
         function HideAGameWagerHolder() {
            $("#aGameWagerHolder", element).hide();
         }
         function ShowAGameWagerHolder() {
            $("#aGameWagerHolder", element).show();
         }
         function HideNoWagersFoundHolder() {
            $("#noWagersFoundHolder", element).hide();
         }
         function ShowNoWagersFoundHolder() {
            $("#noWagersFoundHolder", element).show();
         }
         function HideAllHistoryDetails() {
            $("DIV[id^='pastLeagueDetailHolder_']").each(function () {
               $(this).hide();
               let buttonId = this.id;
               let buttonLeagueId = buttonId.split("_")[1];
               let buttonTeamId = buttonId.split("_")[2];
               HidePastLeagueWagers(buttonLeagueId, buttonTeamId);
            });
         }
         function ShowAllHistoryDetails() {
            $("BUTTON[id^='btnLeagueExpander_']").each(function () {
               let buttonId = this.id;
               let buttonLeagueId = buttonId.split("_")[1];
               let buttonTeamId = buttonId.split("_")[2];
               GetPastWagersForLeague(function () {
                  ShowPastLeagueWagers(buttonLeagueId, buttonTeamId);
               }, buttonLeagueId, buttonTeamId);
            });
         }
         function HideCurrentLeagueWagers() {
            $("#currentLeagueWagersTabDataHolder", element).hide();
         }
         function ShowCurrentLeagueWagers() {
            $("#currentLeagueWagersTabDataHolder", element).show();
         }
         function HideHistoryLeagueWagers() {
            $("#historyLeagueWagersTabDataHolder", element).hide();
            $("#historyLeagueWagersList", element).hide();
         }
         function ShowHistoryLeagueWagers() {
            $("#historyLeagueWagersTabDataHolder", element).show();
            $("#historyLeagueWagersList", element).show();
         }
         function TogglePastWagersForLeague(leagueId, teamId) {
            if (teamId == null) {
               teamId = 0;
            }
            let isCurrentlyVisible = $("#pastLeagueDetailHolder_" + leagueId + "_" + teamId).is(":visible");
            if (isCurrentlyVisible) {
               HidePastLeagueWagers(leagueId, teamId);
            }
            else {
               ShowPastLeagueWagers(leagueId, teamId);
            }
         }
         function HidePastLeagueWagers(leagueId, teamId) {
            $("i", $("#btnLeagueExpander_" + leagueId + "_" + teamId)).removeClass("fa-minus");
            $("i", $("#btnLeagueExpander_" + leagueId + "_" + teamId)).addClass("fa-plus");

            $("#pastLeagueDetailHolder_" + leagueId + "_" + teamId).hide();
         }
         function ShowPastLeagueWagers(leagueId, teamId) {
            $("i", $("#btnLeagueExpander_" + leagueId + "_" + teamId)).removeClass("fa-plus");
            $("i", $("#btnLeagueExpander_" + leagueId + "_" + teamId)).addClass("fa-minus");

            $("#pastLeagueDetailHolder_" + leagueId + "_" + teamId).show();

         }
         function HideEditorForm() {
            $("#wagerFormHolder", element).hide();
         }
         function ShowEditorForm() {
            $("#wagerFormHolder", element).show();
         }
         function HideLoadingMessage() {
            $("#userLoadingHolder", element).hide();
         }
         function ShowLoadingMessage(messageText) {
            if(messageText != null && messageText != "")
            {
               $("#userLoadingText", element).empty();
               $("#userLoadingText", element).append(messageText);
            }

            $("#userLoadingHolder", element).show();
         }         
         /*Show/Hide/Collapse/Toggle End*/

         function WriteNoAccess() {
            LogInfo("No Access", "error");
            let noAccessMessageText = "You do not have access to this module.";
            let noAccessMessageHolder = $("<div class=\"no-access-message-holder\"/>");
            let noAccessMessageLabelHolder = $("<div class=\"no-access-label-holder\" />");

            noAccessMessageLabelHolder.append(noAccessMessageText);
            noAccessMessageHolder.append(noAccessMessageLabelHolder);

            $("#noWagersFoundHolder", element).empty();
            $("#noWagersFoundHolder", element).append(noAccessMessageHolder);
         }
         function GetWagerStatusNameFromId(id)
         {
            let returnValue = "";
            let wagerStatusObject = GetWagerStatusObjectFromId(id);
            if(wagerStatusObject != null)
            {
               returnValue = wagerStatusObject.Name;
            }
            return returnValue;
         }
         function GetWagerStatusObjectFromId(id)
         {
            return wagerStatusOptions.find(i => i.AGameWagerStatusId == id);
         }
         function AddWagerSignal(wagerObject)
         {
            let offerType = "initial";
            if(wagerObject.WagerStatusId != null && wagerObject.WagerStatusId != "")
            {
               offerType = "updated";
            }
             a$.ajax({
               type: "POST",
               service: "C#",
               async: true,
               data: {
                  lib: "selfserve",
                  cmd: "addWagerSignal",
                  userId: wagerObject.WagerAgainstUserId,
                  detailId: wagerObject.AGameWagerDetailId,
                  offerType: offerType,
                  offerAmount: wagerObject.WagerAmount
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
                     return;
                  }
               }
            });
         }
         function AddWagerFinalizedSignal(wagerId, offerType)
         {
            let wagerObject = myPendingWagers.find(w => w.AGameWagerDetailId == wagerId);            
             a$.ajax({
               type: "POST",
               service: "C#",
               async: true,
               data: {
                  lib: "selfserve",
                  cmd: "addWagerSignal",
                  userId: wagerObject.WagerAgainstUserId,
                  detailId: wagerId,
                  offerType: offerType,
                  offerAmount: wagerObject.WagerAmount
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
                     return;
                  }
               }
            });
         }
         function ProcessWagerSignal(signalObject)
         {
           $("#refreshMyPending", element).click();
         }
         function LogInfo(dataToLog, logLevel) {
            if (logLevel == "error") {
               console.error(dataToLog);
            }
            else if (logLevel == "object") {
               console.info(JSON.stringify(dataToLog));
            }
            else {
               console.log(dataToLog);
            }
         }

         scope.load = function () {
            ShowLoadingMessage();
            scope.Initialize();
            //Must have both league and wager module to access this feature.
            hasModule = appLib.canAccessAGameLeague() && appLib.canAccessAGameWager();
            if (hasModule == false) {
               WriteNoAccess();
               HideLoadingMessage();
            }
            else {
               LoadMyWagers(function(){
                  HideLoadingMessage();
               });
               $("#wagerCurrentLeagueTab", element).click();
            }
         };
         //TODO: Remove after dev done.
         scope.load();

         ko.postbox.subscribe("aGameWagerReload", function (forceReload) {
            if (forceReload == true) {
               myCurrentWagers.length = 0;
               myPendingWagers.length = 0;
            }
            LoadMyWagers(function () {
               $("#wagerCurrentLeagueTab", element).click();
               HideLoadingMessage();
            });
         });
         ko.postbox.subscribe("aGameWagerLoad", function () {
            scope.load();
         });
         ko.postbox.subscribe("aGameWagerBalanceReload", function (forceReload) {
            myCurrentAGameBalance = null;
            GetMyAGameBalance();
         });
         ko.postbox.subscribe("aGameWagerReloadChallenges", function (forceReload) {
            if (forceReload == true) {
               myCurrentWagers.length = 0;
               myPendingWagers.length = 0;
            }
            LoadMyWagers();
         });

         ko.postbox.subscribe("Signal", function(so) {
            ProcessWagerSignal(so);
        });
      }
   };
}]);
