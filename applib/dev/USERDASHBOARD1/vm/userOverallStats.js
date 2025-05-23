angularApp.directive("ngUserOverallStats", [
  "api",
  "$compile",
  "$rootScope",
  function (api, $compile, $rootScope) {
    return {
      templateUrl: a$.debugPrefix() + "/applib/dev/USERDASHBOARD1/view/userOverallStats.htm?" + Date.now(),
      scope: {
        assoc: "@",
        text: "@",
        details: "@",
        cid: "@",
        filters: "@",
        panel: "@",
        hidetopper: "@",
        toppertext: "@",
      },
      require: "^ngLegacyContainer",
      link: function (scope, element, attrs, legacyContainer) {
        HideAll();

        var rankItemsToDisplay = ["Team", "Location", "Project"];
        var topSpotMessages = ["You are on top.", "Keeping that top spot you are!", "You are the BESTEST!", "Nobody taking your spot!", "You are the Ruler and nobody can take your place!"];
        let loadingUrl = a$.debugPrefix() + "/applib/css/images/acuity-loading.gif";
        var userId = legacyContainer.scope.TP1Username;
        var maxPossibleScoreValue = 10;
        var minPossibleScoreValue = 1;
        var gUserDashboardData = null;
        var configParameters = [];
        var currentUserKpiScores = [];
        let scoringType = "base";
        let loopCounter = 0;
        let gTipTrickOfDay = null;
        let tipCycle = [];
        let hasTeam = false;
        let hasCredits = false;
        let isGameParticipant = false;
        let currentTeamScore = null;
        let gameCycle = [];
        let allPossibleGames = {
          Flex:[],
          Leagues: [],
          Ongoing: [],
        }
        let gameStatusOptions = {
          Flex: [],
          Leagues: [],
          Ongoing: [],
        }

        /*Buttons in the directive*/
        $(".edit-avatar-btn").on("click", function () {
          SetAvatarCheck();
          ko.postbox.publish("SetNavigation", { type: "PlayerSetup" });
          $.cookie("refreshAvatar", true);
          return false;
        });
        $("#toggleSwitchTop", element)
          .off("click")
          .on("click", function () {
            GetUserKpiScores(true, function (kpiScores) {
              gUserDashboardData.KpiScores.length = 0;
              for (let i = 0; i < kpiScores.length; i++) {
                gUserDashboardData.KpiScores.push(kpiScores[i]);
              }
              RenderUserProjectScores(function () {
                DisplayTopItems();
              });
            });
          });
        $("#toggleSwitchBottom", element)
          .off("click")
          .on("click", function () {
            GetUserKpiScores(true, function (kpiScores) {
              gUserDashboardData.KpiScores.length = 0;
              for (let i = 0; i < kpiScores.length; i++) {
                gUserDashboardData.KpiScores.push(kpiScores[i]);
              }
              RenderUserProjectScores(function () {
                DisplayBottomItems();
              });
            });
          });
        $("#toggleSwitchAll", element)
          .off("click")
          .on("click", function () {
            GetAllUserKpiScores(true, function (kpiScores) {
              gUserDashboardData.KpiScores.length = 0;
              for (let i = 0; i < kpiScores.length; i++) {
                gUserDashboardData.KpiScores.push(kpiScores[i]);
              }
              RenderUserProjectScores(function () {
                DisplayAllItems();
              });
            });
          });
        $("#btnRedeemPoints_OverallStats", element)
          .off("click")
          .on("click", function () {
            var prefixInfo = a$.gup("prefix");
            var hrefLocation = a$.debugPrefix() + "/3/ng/PrizeRedemption/default.aspx?area=redeem";
            if (prefixInfo != null && prefixInfo != "") {
              hrefLocation += "&prefix=" + prefixInfo;
            }
            document.location.href = hrefLocation;
          });
          $("#btnParticipatingInGamePrevious", element).off("click").on("click", function(){
            let currentIndex = parseInt($("#currentGameParticipantDisplayIndex", element).val());
            let nextIndexToDisplay = (currentIndex - 1);
            if(nextIndexToDisplay < 0)
            {
              nextIndexToDisplay = (gameCycle.length -1);
            }
            $("#currentGameParticipantDisplayIndex", element).val(nextIndexToDisplay);
            RenderGameParticipantHolder();
          });
          $("#btnParticipatingInGameNext", element).off("click").on("click", function(){
            let currentIndex = parseInt($("#currentGameParticipantDisplayIndex", element).val()) || 0;
            let nextIndexToDisplay = (currentIndex +1);
            if(nextIndexToDisplay >= gameCycle.length)
            {
              nextIndexToDisplay = 0;
            }
            $("#currentGameParticipantDisplayIndex", element).val(nextIndexToDisplay);
            RenderGameParticipantHolder();
          });
        /*Buttons in the directive END*/
        function Initalize() {
          /*
          TODO: Handle the game participant information for the user.
          For dev force that the user is a participant so that we can
          work with the information
           */
          isGameParticipant = true;
          $("#KpiLoadingImage", element).attr("src", loadingUrl);
          GetAllConfigParameters(function () {
            SetConfigValues();
          });
          LoadGameStatusOptions();
          LoadAllPossibleGameObjects();
          HandleTipOfDay();
        }
        function SetAvatarCheck() {
          $.cookie("refreshAvatar", false, { expires: 1 });
          loopCounter = 0; //reset the too long counter.
          let avatarRefreshHandle = window.setInterval(function () {
            let refreshAvatar = $.cookie("refreshAvatar") || false;
            if (refreshAvatar == "true") {
              gUserDashboardData.UserProfile = null;
              GetMyUserProfile(false, function (profile) {
                gUserDashboardData.UserProfile = profile;
                let currentAvatar = $("#user-dashboard-avatar-holder", element).prop("src");
                let newUserAvatar = profile.AvatarImageFile;
                let currentAvatarInfo = currentAvatar.split("/");
                let newAvatarInfo = newUserAvatar.split("/");
                let newFile = newAvatarInfo[newAvatarInfo.length - 1];
                let currentFile = currentAvatarInfo[currentAvatarInfo.length - 1];
                if (newFile != currentFile || loopCounter > 60) {
                  if (loopCounter > 60) {
                    console.log("User took too long; automatically do the update.");
                  }
                  RenderOverallStats();
                  $.cookie("refreshAvatar", false);
                  window.clearInterval(avatarRefreshHandle);
                  avatarRefreshHandle = null;
                } else {
                  loopCounter++;
                }
              });
            }
          }, 5000);
        }
        function GetAllConfigParameters(callback) {
          a$.ajax({
            type: "POST",
            service: "C#",
            async: false,
            data: {
              lib: "selfserve",
              cmd: "getConfigParameters",
            },
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: function (data) {
              if (data.errormessage != null && (data.errormessage == true || data.errormessage == "true")) {
                a$.jsonerror(data);
                //TODO: Determine if we still show something with an error here?
                return;
              } else {
                var parameters = $.parseJSON(data.configParameters);
                if (configParameters.length == 0) {
                  if (parameters != null) {
                    for (var i = 0; i < parameters.length; i++) {
                      configParameters.push(parameters[i]);
                    }
                  }
                }
                if (callback != null) {
                  callback();
                }
              }
            },
          });
        }
        function SetConfigValues() {
          let maxValue = configParameters.find((i) => i.ParamName == "MAX_SCORE_VALUE");
          let minValue = configParameters.find((i) => i.ParamName == "MIN_SCORE_VALUE");
          let scoringObject = configParameters.find((i) => i.ParamName == "CLIENT_SCORING_CALC_TYPE");

          if (maxValue != null) {
            maxPossibleScoreValue = parseInt(maxValue.ParamValue) || 10;
          }
          if (minValue != null) {
            minPossibleScoreValue = parseInt(minValue.ParamValue) || 1;
          }
          if (scoringObject != null) {
            scoringType = scoringObject.ParamValue || "base";
          }
          let hasAwardsConfigParam = configParameters.find((i) => i.ParamName == "MODULE_AWARDS_AND_PRIZES");
          if (hasAwardsConfigParam != null) {
            hasCredits = hasAwardsConfigParam.ParamValue.toLowerCase() == "Yes".toLowerCase() || hasAwardsConfigParam.ParamValue.toLowerCase() == "on".toLowerCase() || hasAwardsConfigParam.ParamValue.toLowerCase() == "true".toLowerCase();
          }
        }
        // function CanViewRankingItems() {
        //   let canView = false;
        //   switch (legacyContainer.scope.TP1Role.toLowerCase()) {
        //     case "csr":
        //       // case "team leader":
        //       // case "tl":
        //       // case "group leader":
        //       // case "gl":
        //       canView = true;
        //   }
        //   return canView;
        // }
        function GatherDashboardInformation(forcedReload, callback) {
          if (forcedReload == true || gUserDashboardData == null) {
            gUserDashboardData = new Object();
            gUserDashboardData.UserProfile = null;
            hasTeam = false;
            GetMyUserProfile(false, function (profile) {
              gUserDashboardData.UserProfile = profile;
            });
            hasTeam = gUserDashboardData.UserProfile?.CurrentTeamId != null && gUserDashboardData.UserProfile?.CurrentTeamId != "";
            if (hasTeam == true) {
              GetUserCurrentTeamScore(function (userScore) {
                RenderTeamScoreHolderData(null, userScore);
              }, gUserDashboardData.UserProfile?.CurrentTeamId);
            }
            LoadUserCredits();
            LoadGameParticipantHolder();
            gUserDashboardData.KpiScores = [];
            GetUserKpiScores(true, function (kpiScores) {
              gUserDashboardData.KpiScores.length = 0;
              for (let i = 0; i < kpiScores.length; i++) {
                gUserDashboardData.KpiScores.push(kpiScores[i]);
              }
              RenderUserProjectScores();
            });
          }

          if (callback != null) {
            callback();
          }
        }
        function LoadGameStatusOptions()
        {
          a$.ajax({
            type: "POST",
            service: "C#",
            async: false,
            data: {
              lib: "flex",
              cmd: "getFlexStatusList",
            },
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: function (data) {
              if (data.errormessage != null && (data.errormessage == true || data.errormessage == "true")) {
                a$.jsonerror(data);
                return;
              } else {
                let returnData = $.parseJSON(data.statusList);
                gameStatusOptions.Flex.length = 0;
                gameStatusOptions.Flex = [...returnData];
              }
            },
          });
          //Leagues Status Options
          gameStatusOptions.Leagues.length = 0;
          gameStatusOptions.Leagues.push(
            {Id: "A", Code: "A",Text: "Active",},
            {Id: "I", Code: "I",Text: "Inactive",},
          );
          //Ongoing Status Options
          gameStatusOptions.Ongoing.length = 0;
          gameStatusOptions.Ongoing.push(
            {Id: "A", Code: "A",Text: "Active",},
            {Id: "I", Code: "I",Text: "Inactive",},
          );
        }
        function LoadKpiScoresForUserByProjectId(projectId, groupId, callback) {
          let foundScores = [];
          if (groupId == null || groupId < 0) {
            groupId = 0;
          }
          let renderToItem = $("#projectKpiScoresHolder_" + projectId + "_" + groupId, element);
          ShowKpiLoader();
          if (currentUserKpiScores != null) {
            foundScores = currentUserKpiScores.filter((s) => parseInt(s.ProjectId) == parseInt(projectId));
          }
          if (foundScores != null && foundScores.length > 0) {
            RenderUserKpiScores(foundScores, renderToItem, groupId);
            ToggleKpiScores(projectId, groupId);
            HideKpiLoader();
          } else {
            a$.ajax({
              type: "POST",
              service: "C#",
              async: true,
              data: {
                lib: "userprofile",
                cmd: "getKpiScoreForUserAndProject",
                userid: userId,
                projectid: projectId,
              },
              dataType: "json",
              cache: false,
              error: a$.ajaxerror,
              success: function (jsonData) {
                if (jsonData.errormessage != null && (jsonData.errormessage == true || jsonData.errormessage == "true")) {
                  a$.jsonerror(jsonData);
                  return;
                } else {
                  let kpiScores = JSON.parse(jsonData.userProjectKpiScores);
                  if (kpiScores != null && kpiScores.length > 0) {
                    currentUserKpiScores = kpiScores.filter((x) => x.ProjectId == projectId);
                  }
                  renderToItem = $("#projectKpiScoresHolder_" + projectId + "_" + groupId, element);
                  RenderUserKpiScores(kpiScores, renderToItem, groupId);
                  ToggleKpiScores(projectId, groupId);
                  HideKpiLoader();
                  if (callback != null) {
                    callback();
                  }
                }
              },
            });
          }
        }
        function LoadUserCredits(callback) {
          if (hasCredits == true) {
            GetUserCredits(function (creditsArray) {
              RenderUserCreditsTotal(function (userTotal) {
                DisplayCreditsHolder();
                if (callback != null) {
                  callback();
                }
              }, creditsArray);
            });
          } else {
            console.log("Client does not have user credits turned on.");
          }
        }
        function LoadGameParticipantHolder(callback) {
          console.log("LoadUsergamesparticipating()");
          GetGameParticipatinHolderData(function (gameList) {
            PushParticipantGameListForCycling(gameList);
            RenderGameParticipantHolder(function () {
              if(isGameParticipant == true)
              {
                ShowGameParticipantHolder();
              }
              if (callback != null) {
                callback();
              }
            });
          });
        }
        function LoadAllPossibleGameObjects(callback)
        {
          console.log("LoadAllPossibleGames()");
          GetAllFlexGames();
          GetAllAgameLeagueGames();
          GetAllOngoingGames();
          if(callback != null)
          {
            callback();
          }

        }
        function GetUserCredits(callback) {
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
                return;
              } else {
                let returnData = null;
                if (jsonData.userPointsList != null) {
                  returnData = JSON.parse(jsonData.userPointsList);
                }
                if (callback != null) {
                  callback(returnData);
                }
                return;
              }
            },
          });
          return;
        }
        function GetMyUserProfile(isAsyncCall, callback) {
          if (isAsyncCall == null) {
            isAsyncCall = true;
          }
          a$.ajax({
            type: "POST",
            service: "C#",
            async: isAsyncCall,
            data: {
              lib: "userprofile",
              cmd: "getUserData",
              userid: userId,
            },
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: function (jsonData) {
              if (jsonData.errormessage != null && (jsonData.errormessage == true || jsonData.errormessage == "true")) {
                a$.jsonerror(jsonData);
                //TODO: Determine if we still show something with an error here?
                return;
              } else {
                let userProfile = jsonData.userinfo;
                if (callback != null) {
                  callback(userProfile);
                } else {
                  return userProfile;
                }
              }
            },
          });
        }
        function GetTipOfDay(callback) {
          if (gTipTrickOfDay != null) {
            if (callback != null) {
              callback(gTipTrickOfDay);
            } else {
              return gTipTrickOfDay;
            }
          } else {
            a$.ajax({
              type: "POST",
              service: "C#",
              async: false,
              data: {
                lib: "selfserve",
                cmd: "getRandomTipAndTrick",
              },
              dataType: "json",
              cache: false,
              error: a$.ajaxerror,
              success: function (data) {
                if (data.errormessage != null && (data.errormessage == true || data.errormessage == "true")) {
                } else {
                  var randomTip = $.parseJSON(data.randomTip);
                  gTipTrickOfDay = randomTip;
                  if (callback != null) {
                    callback(randomTip);
                  }
                }
              },
            });
          }
        }
        function GetUserKpiScores(isAsyncCall, callback) {
          $("#KpiLoaderText", element).empty();
          $("#KpiLoaderText", element).html("Collecting KPI's for user...");
          ShowKpiLoader();
          let userKpiScores = [];
          if (isAsyncCall == null) {
            isAsyncCall = true;
          }
          a$.ajax({
            type: "POST",
            service: "C#",
            async: isAsyncCall,
            data: {
              lib: "userprofile",
              cmd: "getAllKpiScoreForUser",
              userid: userId,
              loadallkpis: false,
            },
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: function (jsonData) {
              if (jsonData.errormessage != null && (jsonData.errormessage == true || jsonData.errormessage == "true")) {
                a$.jsonerror(jsonData);
                //TODO: Determine if we still show something with an error here?
                return;
              } else {
                let kpiScores = JSON.parse(jsonData.currentKpiScores);
                if (callback != null) {
                  callback(kpiScores);
                } else {
                  return kpiScores;
                }
              }
            },
          });
        }
        function GetAllUserKpiScores(isAsyncCall, callback) {
          $("#KpiLoaderText", element).empty();
          $("#KpiLoaderText", element).html("Collecting KPI's for user...");
          ShowKpiLoader();
          let userKpiScores = [];
          if (isAsyncCall == null) {
            isAsyncCall = true;
          }
          a$.ajax({
            type: "POST",
            service: "C#",
            async: isAsyncCall,
            data: {
              lib: "userprofile",
              cmd: "getAllKpiScoreForUser",
              userid: userId,
              loadallkpis: true,
            },
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: function (jsonData) {
              if (jsonData.errormessage != null && (jsonData.errormessage == true || jsonData.errormessage == "true")) {
                a$.jsonerror(jsonData);
                //TODO: Determine if we still show something with an error here?
                return;
              } else {
                let kpiScores = JSON.parse(jsonData.currentKpiScores);
                if (callback != null) {
                  callback(kpiScores);
                } else {
                  return kpiScores;
                }
              }
            },
          });
        }
        function GetProjectsForUserToRenderList(data) {
          let projectList = [];
          $.each(data, function (i, item) {
            if (projectList.findIndex((i) => i.ProjectId == item.ProjectId) < 0) {
              projectList.push(item);
            }
          });

          return projectList;
        }
        function GetUserCurrentTeamScore(callback, teamId) {
          a$.ajax({
            type: "POST",
            service: "C#",
            async: false,
            data: {
              lib: "userprofile",
              cmd: "getUserCurrentTeamScoreForDashboard",
              userid: userId,
              teamid: teamId,
            },
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: function (jsonData) {
              if (jsonData.errormessage != null && (jsonData.errormessage == true || jsonData.errormessage == "true")) {
                a$.jsonerror(jsonData);
                return;
              } else {
                let userCurrentTeamScore = JSON.parse(jsonData.userCurrentTeamScore);
                currentTeamScore = userCurrentTeamScore;

                if (callback != null) {
                  callback(userCurrentTeamScore);
                }
              }
            },
          });
        }
        function GetGameParticipatinHolderData(callback){
          let userId = legacyContainer.scope.TP1Username;
          a$.ajax({
            type: "GET",
            service: "C#",
            async: true,
            data: {
              lib: "flex",
              cmd: "getCurrentUserGamesParticipatingIn",
              userId: userId,
            },
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: function (jsonData) {
              if (jsonData.errormessage != null && jsonData.errormessage == true) {
                a$.jsonerror(jsonData);
                return;
              } else {
                let returnData = null;
                if (jsonData.userParticipatingGamesList != null) {
                  returnData = JSON.parse(jsonData.userParticipatingGamesList);
                }
                if (callback != null) {
                  callback(returnData);
                }
                return;
              }
            },
          });
        }
        function GetAllFlexGames(){
          allPossibleGames.Flex.length = 0;
          a$.ajax({
            type: "GET",
            service: "C#",
            async: false,
            data: {
              lib: "flex",
              cmd: "getGameListForClient",
            },
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: function (jsonData) {
              if (jsonData.errormessage != null && jsonData.errormessage == true) {
                a$.jsonerror(jsonData);
                return;
              } else {
                let returnData = JSON.parse(jsonData.gameList);
                allPossibleGames.Flex.length = 0;
                allPossibleGames.Flex = [...returnData];
                return;
              }
            },
          });
        }
        function GetAllAgameLeagueGames(){
          allPossibleGames.Leagues.length = 0;

          a$.ajax({
            type: "GET",
            service: "C#",
            async: false,
            data: {
              lib: "flex",
              cmd: "getCurrentUserAGamePlayerInfo",
              userid: legacyContainer.scope.TP1Username,
              gameDate: new Date().toLocaleDateString(),
            },
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: function (jsonData) {
              if (jsonData.errormessage != null && jsonData.errormessage == true) {
                a$.jsonerror(jsonData);
                return;
              } else {
                let returnData = JSON.parse(jsonData.currentListForUser);
                allPossibleGames.Leagues.length = 0;
                allPossibleGames.Leagues = [...returnData];
                return;
              }
            },
          });


        }

        function GetAllOngoingGames(){
          console.log("GetAllOngoingGames()");
          allPossibleGames.Ongoing.length = 0;
        }
        function HandleTipOfDay() {
          GetTipOfDay(function (tipToRender) {
            RenderTipOfDay(tipToRender);
          });
        }
        function HandleNextTip(tipId) {
          let curTipIndex = tipCycle.findIndex((i) => i.ManagerTipsTricksId == tipId);
          if (curTipIndex >= 0) {
            if (curTipIndex + 1 <= tipCycle.length) {
              gTipTrickOfDay = tipCycle[curTipIndex + 1];
            } else {
              tipCycle.push(gTipTrickOfDay);
              gTipTrickOfDay = null;
            }
          } else {
            tipCycle.push(gTipTrickOfDay);
            gTipTrickOfDay = null;
          }
          HandleTipOfDay();
        }
        function HandlePreviousTip(tipId) {
          let curTipIndex = tipCycle.findIndex((i) => i.ManagerTipsTricksId == tipId);
          if (curTipIndex < 0) {
            tipCycle.push(gTipTrickOfDay);
            curTipIndex = tipCycle.findIndex((i) => i.ManagerTipsTricksId == tipId);
          }
          if (curTipIndex >= 1) {
            if (curTipIndex - 1 >= 0) {
              gTipTrickOfDay = tipCycle[curTipIndex - 1];
            } else {
              gTipTrickOfDay = tipCycle[0];
            }
          }
          HandleTipOfDay();
        }
        function RenderOverallStats() {
          let userFullName = userId;
          let userAvatar = a$.debugPrefix() + "/jq/avatars/empty_headshot.png";
          let userGroupName = "";
          let userTeamName = "";
          let userLocationName = "";

          if (gUserDashboardData != null) {
            if (gUserDashboardData.UserProfile != null) {
              userFullName = gUserDashboardData.UserProfile.FullName;
              if (gUserDashboardData.UserProfile.AvatarImageFile != null && gUserDashboardData.UserProfile.AvatarImageFile != "") {
                userAvatar = a$.debugPrefix() + "/jq/avatars/" + gUserDashboardData.UserProfile.AvatarImageFile;
              }
              userGroupName = gUserDashboardData.UserProfile.GroupName;
              userTeamName = gUserDashboardData.UserProfile.TeamName;
              userLocationName = gUserDashboardData.UserProfile.LocationName;
            }
          }
          $(".user-dashboard-fullname", element).empty();
          $(".user-dashboard-fullname", element).text(userFullName);
          $("#user-dashboard-avatar-holder", element).attr("src", userAvatar);
          $("#user-dashboard-avatar-holder", element).attr("alt", userFullName);
          $(".user-dashboard-teamname", element).text(userTeamName);
        }
        function RenderUserProjectScores(callback) {
          ShowKpiLoader();
          $("#KpiLoaderText", element).html("Rendering KPI's for user...");
          let NumberofOverallScores = 0;
          let scoresHolder = $("<ul />");
          let noKpiScoresFoundMessage = "No KPI Scores found for user.";
          let userBalancedScoreValue = "N/A";

          let userRoleHasBalancedScore =
            legacyContainer.scope.TP1Role.toUpperCase() == "CSR".toUpperCase() || legacyContainer.scope.TP1Role.toUpperCase() == "Team Leader".toUpperCase() || legacyContainer.scope.TP1Role.toUpperCase() == "Group Leader".toUpperCase();

          if (gUserDashboardData != null && gUserDashboardData.KpiScores != null) {
            SortUserKpiScores(gUserDashboardData.KpiScores);
            let projectList = gUserDashboardData.KpiScores;
            NumberofOverallScores = projectList.length || 0;

            if (NumberofOverallScores == 0) {
              scoresHolder.append("<li>" + noKpiScoresFoundMessage + "</li>");
            } else {
              RenderUserProjectList(projectList, scoresHolder, userRoleHasBalancedScore);
            }
          } else {
            scoresHolder.append("<li>" + noKpiScoresFoundMessage + "</li>");
          }

          $(".kpi-block", element).empty();
          $(".kpi-block", element).append(scoresHolder);
          HideAllScoringHolders();
          SetToggleSwitchesDisplay(NumberofOverallScores);
          ExpandFirstProjectInList();

          $("#KpiLoaderText", element).empty();
          HideKpiLoader();
          if (callback != null) {
            callback();
          }
        }
        function RenderUserProjectList(listToRender, objectToRenderTo, userRoleHasBalancedScore) {
          if (userRoleHasBalancedScore == null) {
            userRoleHasBalancedScore = false;
          }
          $(objectToRenderTo).empty();
          $.each(listToRender, function (i, item) {
            let scoreTypeLevel = item.ScoreTypeLevel;
            let dotValue = "okay";
            let scoreValue = appLib.FormatScore(item.ScoredValue, scoringType);
            let standardvalue = appLib.FormatScore(item.StandardValue, scoringType);
            let userBalancedScoreValue = "N/A";
            let groupId = item.GroupId || 0;

            let scoreItemHolder = $('<li id="projectScoreDetails_' + item.ProjectId + "_" + groupId + '" />');
            scoreItemHolder.addClass("user-dashboard-kpi-scoretype-" + scoreTypeLevel.toLowerCase());
            let teamsArray = [...new Set(listToRender.map((x) => x.TeamId))];
            if (userRoleHasBalancedScore == true) {
              let balScoreObject = listToRender.find((i) => (i.GroupSupervisorUserId == legacyContainer.scope.TP1Username || i.TeamSupervisorUserId == legacyContainer.scope.TP1Username) && i.MqfNumber == 0 && i.ProjectId == item.ProjectId);

              if (balScoreObject != null) {
                userBalancedScoreValue = appLib.FormatScore(balScoreObject.ScoredValue, scoringType);
              } else {
                if (teamsArray.length <= 1) {
                  if (item.MqfNumber == 0) {
                    if (userRoleHasBalancedScore == true) {
                      userBalancedScoreValue = scoreValue;
                    }
                  }
                }
              }
            }
            $(".user-dashboard-user-balancedscore", element).text(userBalancedScoreValue);
            $("#user-dashboard-overall-score-holder", element).show();
            scoreItemHolder.addClass("kpi-block_overall");

            let projectNameHolder = $('<span class="kpi-project-name-holder" />');
            let nameExpander = $('<span class="item-expandard" id="projectKpiProjectNameExpander_' + item.ProjectId + "_" + groupId + '" />');
            nameExpander.append('<i class="fa fa-plus"></i> &nbsp;');

            let kpiDetailsHolder = $('<div class="kpi-details"/>');
            let kpiNumbers = $('<div class="kpi-numbers">');
            let kpiScore = $('<div class="kpi-score" title="Scored" />');
            kpiScore.append(scoreValue);
            kpiNumbers.append(kpiScore);
            let kpiDotColor = legacyContainer.scope.getKPIColorRGB(scoreValue).color;
            if (kpiDotColor == null || kpiDotColor == "white") {
              appLib.getConfigParameterByName("DEFAULT_COLOR_1", function (returnParam) {
                if (returnParam != null) {
                  kpiDotColor = returnParam.ParamValue;
                }
              });
            }
            var kpiDot = $('<div class="kpi-dot" style="background-color:' + kpiDotColor + '" ></div>');

            let kpiScoringHolder = $('<div class="user-dashboard-kpi-score-holder" id="projectKpiScoresHolder_' + item.ProjectId + "_" + groupId + '"  />');
            kpiScoringHolder.append("&nbsp;");

            kpiDetailsHolder.append(kpiNumbers);
            kpiDetailsHolder.append(kpiDot);

            scoreItemHolder.off("click").on("click", function () {
              let id = this.id;
              let projectId = id.split("_")[1];
              let groupId = id.split("_")[2];
              let scoringDataObject = { ProjectId: projectId, GroupId: groupId };
              ko.postbox.publish("LoadUserKpiScoring", scoringDataObject);
            });
            let projectName = item.ProjectName;

            projectNameHolder.append(nameExpander);
            projectNameHolder.append(projectName);
            if (groupId > 0) {
              let additionalProjectInfoHolder = $('<div class="kpi-detail-group-name-holder" />');
              additionalProjectInfoHolder.append(item.LocationName + " > " + item.GroupName);
              projectNameHolder.append(additionalProjectInfoHolder);
            }

            scoreItemHolder.append(projectNameHolder);
            scoreItemHolder.append(kpiDetailsHolder);

            $(objectToRenderTo).append(scoreItemHolder);
            $(objectToRenderTo).append(kpiScoringHolder);
          });
        }
        function RenderUserKpiScores(listToRender, objectToRenderTo, groupId, callback) {
          if (groupId == null || groupId < 0) {
            groupId = 0;
          }
          $(objectToRenderTo).empty();
          if (listToRender != null && listToRender.length > 0) {
            var currentMqfNumber = -1;
            var subItemCount = 0;
            var currentGroupId = -1;
            let filteredListForGroup = listToRender.filter((gi) => parseInt(gi.GroupId) == parseInt(groupId) || groupId == 0);
            filteredListForGroup = SortUserKpiScores(filteredListForGroup);
            for (let i = 0; i < filteredListForGroup.length; i++) {
              let scoreItem = filteredListForGroup[i];
              subItemCount = 0;
              let scoredValue = appLib.FormatScore(scoreItem.ScoredValue, scoringType);
              let standardValue = appLib.FormatScore(scoreItem.StandardValue, scoringType);
              let kpiName = scoreItem.KpiName;
              let subKpiName = scoreItem.SubTypeName;
              let groupName = scoreItem.GroupName;
              let weightFactor = scoreItem.WeightFactor;
              let scoreTypeLevel = scoreItem.ScoreTypeLevel;
              if (groupId == 0 && scoreItem.GroupId != null && scoreItem.GroupId != 0) {
                groupId = scoreItem.GroupId;
              }
              //let itemGroupId = scoreItem.GroupId || 0;
              subItemCount = filteredListForGroup.filter((i) => i.MqfNumber == scoreItem.MqfNumber && i.GroupId == scoreItem.GroupId).length;
              let kpiItemHolder = $('<li id="kpiDetailsHolder_' + scoreItem.ProjectId + "_" + scoreItem.MqfNumber + "_" + groupId + '" />');
              kpiItemHolder.addClass("user-dashboard-kpi-scoretype-" + scoreTypeLevel.toLowerCase());

              let kpiDetailsHolder = $('<div class="kpi-details"/>');
              let kpiNumbers = $('<div class="kpi-numbers">');
              let kpiScore = $('<div class="kpi-score" title="Scored" />');
              kpiScore.append(scoredValue);
              let kpiStandard = $('<div class="kpi-raw" title="Standard" />');
              kpiStandard.append(standardValue);

              let kpiDotColor = legacyContainer.scope.getKPIColorRGB(scoredValue).color;
              if (kpiDotColor == null || kpiDotColor == "white") {
                appLib.getConfigParameterByName("DEFAULT_COLOR_1", function (returnParam) {
                  if (returnParam != null) {
                    kpiDotColor = returnParam.ParamValue;
                  }
                });
              }
              let kpiDot = $('<div class="kpi-dot' + "\" style='background-color:" + kpiDotColor + ";' ><div class=\"pulse-ring" + "\" style='background-color:" + kpiDotColor + ";border-color:" + kpiDotColor + "' ></div></div>");

              kpiNumbers.append(kpiScore);
              kpiNumbers.append(kpiStandard);

              kpiDetailsHolder.append(kpiNumbers);
              kpiDetailsHolder.append(kpiDot);
              let kpiNameHolder = $('<span class="kpi-detail-name-holder" />');
              let kpiWeightHolder = $('<span class="kpi-detail-weight-holder" />');
              let kpiGroupNameHolder = $('<div class="kpi-detail-group-name-holder" />');

              kpiWeightHolder.append(" (" + weightFactor.toLocaleString("en-US", { style: "percent", maximumSignificantDigits: 2 }) + ")");

              // if (groupName != null && groupName != "") {
              //    kpiGroupNameHolder.append("<i>" + groupName + "</i>");
              // }
              kpiNameHolder.append(kpiName);
              kpiNameHolder.append(kpiWeightHolder);
              kpiNameHolder.append(kpiGroupNameHolder);
              currentGroupId = -1;
              if (subItemCount > 1) {
                let kpiNameExpander = $('<span class="kpi-item-name-holder" />');
                let kpiExpander = $('<span class="item-expander" id="kpiNameExpander_' + scoreItem.ProjectId + "_" + scoreItem.MqfNumber + "_" + groupId + '" />');
                kpiExpander.append('<i class="fa fa-plus"></i> &nbsp;');

                kpiNameExpander.append(kpiExpander);

                kpiNameHolder.empty();
                kpiNameHolder.append(kpiNameExpander);
                kpiNameHolder.append(kpiName);
                kpiNameHolder.append(kpiWeightHolder);
                kpiNameHolder.append(kpiGroupNameHolder);

                kpiExpander.on("click", function () {
                  let id = this.id;
                  let projectId = id.split("_")[1];
                  let mqfNumber = id.split("_")[2];
                  let groupId = id.split("_")[3];
                  ToggleSubKpiScores(projectId, mqfNumber, groupId);
                });

                let subKpiInfoHolder = $('<div class="user-dashboard-subKpi-list-holder" id="projectSubKpiScoresHolder_' + scoreItem.ProjectId + "_" + scoreItem.MqfNumber + "_" + groupId + '" />');
                let subItemsToRenderToListHolder = $("<ul />");

                let subItemsToRender = filteredListForGroup.filter((x) => x.MqfNumber == scoreItem.MqfNumber && x.SubTypeId != 0);

                if (subItemsToRender != null && subItemsToRender.length > 0) {
                  RenderUserSubKpiScores(subItemsToRender, subItemsToRenderToListHolder);
                  subKpiInfoHolder.append(subItemsToRenderToListHolder);
                }
                if (currentMqfNumber != scoreItem.MqfNumber && currentGroupId != scoreItem.GroupId) {
                  let overallItem = filteredListForGroup.find((x) => x.MqfNumber == scoreItem.MqfNumber && x.SubTypeId == 0);
                  let scoreValue = -1;
                  let standardValue = "--";
                  if (overallItem != null) {
                    scoreValue = appLib.FormatScore(overallItem.ScoredValue, scoringType); //overallItem.ScoredValue.toFixed(2);
                    standardValue = appLib.FormatScore(overallItem.StandardValue, scoringType); //overallItem.StandardValue.toFixed(2);
                  }
                  //rebuild the scoring information
                  kpiScore.empty();
                  kpiScore.append(scoreValue);
                  kpiStandard.empty();
                  kpiStandard.append(standardValue);

                  kpiNumbers.empty();
                  kpiNumbers.append(kpiScore);
                  kpiNumbers.append(kpiStandard);

                  kpiDetailsHolder.empty();

                  kpiDetailsHolder.append(kpiNumbers);
                  kpiDetailsHolder.append(kpiDot);

                  //kpiItemHolder.append(kpiName);
                  kpiItemHolder.append(kpiNameHolder);
                  kpiItemHolder.append(kpiDetailsHolder);
                  kpiItemHolder.append(subKpiInfoHolder);

                  $(objectToRenderTo).append(kpiItemHolder);
                  currentMqfNumber = scoreItem.MqfNumber;
                  currentGroupId = scoreItem.GroupId || -1;
                }
              } else {
                kpiItemHolder.off("click").on("click", function () {
                  let id = this.id;
                  let nameArray = id.split("_");
                  let projectId = nameArray[1];
                  let mqfNumber = nameArray[2];
                  let groupId = nameArray[3];
                  let kpiClickedInfo = { ProjectId: projectId, MqfNumber: mqfNumber, GroupId: groupId };
                  ko.postbox.publish("UserPerformanceLoadProjectKpi", kpiClickedInfo);
                });

                //kpiItemHolder.append(kpiName);
                kpiItemHolder.append(kpiNameHolder);
                kpiItemHolder.append(kpiDetailsHolder);
                $(objectToRenderTo).append(kpiItemHolder);
              }
            }
            HideAllSubKpiScoringHolders();
            currentMqfNumber = -1;
          } else {
            $(objectToRenderTo).append("No Kpi Scoring information found.");
          }
          if (callback != null) {
            callback();
          }
          return;
        }
        function RenderUserSubKpiScores(listToRender, objectToRenderTo, callback) {
          if (listToRender != null && listToRender.length > 0) {
            for (let ic = 0; ic < listToRender.length; ic++) {
              let subItem = listToRender[ic];
              let itemName = subItem.KpiName;
              let subKpiName = subItem.SubTypeName;
              let scoredValue = appLib.FormatScore(subItem.ScoredValue, scoringType); //subItem.ScoredValue.toFixed(2);;
              let standardValue = appLib.FormatScore(subItem.StandardValue, scoringType); //subItem.StandardValue.toFixed(2);
              let groupId = -1;

              let subItemHolder = $('<li id="subKpiHolder_' + subItem.ProjectId + "_" + subItem.MqfNumber + "_" + subItem.SubTypeId + "_" + groupId + '" />');
              if (subKpiName != null && subKpiName != "") {
                itemName += " - " + subKpiName;
              }
              subItemHolder.on("click", function () {
                let id = this.id;
                let nameArray = id.split("_");
                let projectId = nameArray[1];
                let mqfNumber = nameArray[2];
                let subTypeId = nameArray[3];
                let groupId = nameArray[4];
                let subKpiClickInfo = { ProjectId: projectId, MqfNumber: mqfNumber, GroupId: groupId, SubTypeId: subTypeId, KpiName: itemName, SubTypeName: subKpiName };
                ko.postbox.publish("UserPerformanceLoadProjectKpi", subKpiClickInfo);
              });
              let kpiDetailsHolder = $('<div class="kpi-details" />');
              let kpiNumbers = $('<div class="kpi-numbers">');
              let kpiScore = $('<div class="kpi-score" title="Scored" />');
              kpiScore.append(scoredValue);
              let kpiStandard = $('<div class="kpi-raw" title="Standard" />');
              kpiStandard.append(standardValue);
              //let kpiDot = $("<div class=\"kpi-dot" + "\" style='background-color:" + legacyContainer.scope.getKPIColorRGB(scoredValue).color + "' ></div>");
              let kpiDotColor = legacyContainer.scope.getKPIColorRGB(subItem.ScoredValue).color;
              if (kpiDotColor == null || kpiDotColor == "white") {
                appLib.getConfigParameterByName("DEFAULT_COLOR_1", function (returnParam) {
                  if (returnParam != null) {
                    kpiDotColor = returnParam.ParamValue;
                  }
                });
              }
              let kpiDot = $('<div class="kpi-dot' + "\" style='background-color:" + kpiDotColor + ";' ><div class=\"pulse-ring" + "\" style='background-color:" + kpiDotColor + ";border-color:" + kpiDotColor + "' ></div></div>");

              kpiNumbers.append(kpiScore);
              kpiNumbers.append(kpiStandard);

              kpiDetailsHolder.append(kpiNumbers);
              kpiDetailsHolder.append(kpiDot);

              subItemHolder.append(itemName);
              subItemHolder.append(kpiDetailsHolder);

              $(objectToRenderTo).append(subItemHolder);
            }
          } else {
            $(objectToRenderTo).append("No Sub-kpi data found.");
          }

          if (callback != null) {
            callback();
          }
          return;
        }
        function RenderTeamScoreHolderData(callback, userScoreToDisplay) {
          HideTeamScoreHolder();

          if (userScoreToDisplay == null) {
            userScoreToDisplay = currentTeamScore;
          }
          if (hasTeam == true) {
            if (userScoreToDisplay == null) {
              userScoreToDisplay = "";
            }
            $("#userCurrentTeamScore", element).empty();
            $("#userCurrentTeamScore", element).append(userScoreToDisplay);

            ShowTeamScoreHolder();
          }

          if (callback != null) {
            callback();
          }
        }
        function RenderGameParticipantHolder(callback) {

          $("#gameParticipationHolder", element).empty();
          let currentDisplayIndex = $("#currentGameParticipantDisplayIndex", element).val();
          if(currentDisplayIndex == null || currentDisplayIndex <= 0)
          {
            gameIndexToDisplay = 0;
          }
          let gameListHolder = $(`<div id="gameParticipantGameListHolder" class="game-participant-full-list-item-holder" />`);
          let gameItem = gameCycle[currentDisplayIndex];
          let gameObject = null;
          let gameStatus ="Active";

          if(gameItem.GameType.toLowerCase() == "Flex".toLowerCase())
          {
            gameObject = allPossibleGames.Flex.find(i => i.FlexGameId == gameItem.GameId);
            gameStatusObject = gameStatusOptions.Flex.find(s => s.Code == gameItem.GameStatus);
            if(gameStatusObject != null) {
              gameStatus = gameStatusObject.Name;
            }
          }
          else if(gameItem.GameType.toLowerCase() == "Leagues".toLowerCase() || gameItem.GameType.toLowerCase() == "xTreme".toLowerCase())
          {
             gameObject = allPossibleGames.Leagues.find(i => i.LeagueId == gameItem.GameId);
          }
          else if(gameItem.GameType.toLowerCase() == "System".toLowerCase())
          {
              gameObject = allPossibleGames.Ongoing.find(i => i.GameId == gametemI.GameId);
          }
          if(gameObject != null)
          {
            let gameId = gameObject.Id || gameObject.LeagueId || -1;
            let gameName = gameObject.Name || gameObject.LeagueName;
            let themeTagName = gameObject.ThemeIdSource?.ThemeTagName;

            let backgroundImageUrl = gameObject.ThemeIdSource?.ThemeBoardDisplayImageName ||
              gameObject.ThemeIdSource?.ThemeLeaderboardDisplayImageName ||
              gameObject.ThemeIdSource?.ThemeBackgroundImage;
            let gameTypeName = gameObject.ThemeIdSource?.ThemeTypeIdSource?.Name || gameItem.GameType;

            let gameItemHolder = $(`<div id="gameItemHolder_${gameId}" class="game-participant-item-holder ${themeTagName}" gameId="${gameId}" gameNumber="${currentDisplayIndex}" />`);
            let gameItemPanel = $(`<div id="gameItemPanel_${gameId}" class="game-participant-item-panel-holder ${themeTagName}" gameId="${gameId}" />`);

            let gameThemeHolder = $(`<div class="${themeTagName}" />`);
            gameThemeHolder.append("&nbsp;");

            if (backgroundImageUrl != null && backgroundImageUrl != "") {
                gameItemPanel.css("background-image",`url(${window.location.protocol}//${window.location.hostname}${backgroundImageUrl})`);
            }
            let gameNameHolder = $(`<div class="${themeTagName}" />`);
            gameNameHolder.append(gameName);
            let gameStatusHolder = $(`<div class="${themeTagName}" />`);
            gameStatusHolder.append(gameStatus);
            let gameTypeHolder = $(`<div class="${themeTagName}" />`);
            gameTypeHolder.append(gameTypeName);

            gameItemPanel.append(gameThemeHolder);
            gameItemPanel.append(gameStatusHolder);
            gameItemPanel.append(gameNameHolder);
            gameItemPanel.append(gameTypeHolder);


            gameItemHolder.append(gameItemPanel);

            gameListHolder.append(gameItemHolder);
          }
          else
          {
            gameListHolder.append("&nbsp;");
            console.log("🚀  |  userOverallStats.js:1105  |  RenderGameParticipantHolder  |  gameItem:", gameItem, " | [ERROR] - NO GAME INFORMATION FOUND.");
          }

          $("#gameParticipationHolder", element).append(gameListHolder);

          if (callback != null) {
            callback();
          }
        }
        function RenderTipOfDay(tipToRender) {
          HideTipOfDay();
          if (legacyContainer.scope.TP1Role != "CSR") {
            if (tipToRender == null) {
              tipToRender = gTipTrickOfDay;
            }
            RenderTipOfdayToScreen(tipToRender);
            ShowTipOfDay();
          } else if (legacyContainer.scope.TP1Role == "CSR") {
            gTipTrickOfDay = null;
          }
        }
        function RenderTipOfdayToScreen(tipToRender, callback) {
          if (tipToRender == null) {
            tipToRender = gTipTrickOfDay;
          }
          $("#tipTrickHolder", element).empty();
          if (tipToRender != null) {
            let tipHolder = $('<div class="manager-tip-trick-tip-holder tipoftheday" />');
            let tipImageHolder = $('<div class="manager-tip-trick-image-holder tipoftheday_col1" />');
            let tipInfoHolder = $('<div class="manager-tip-trick-info-holder tipoftheday_col2" />');

            let tipTitleHolder = $('<div class="manager-tip-trick-title-holder tipoftheday_headliner" />');
            let tipTextHolder = $('<div class="manager-tip-trick-text-holder tipoftheday_copy" />');

            let imageSource = a$.debugPrefix() + "/applib/css/images/tipoftheday-mrb.png";

            let tipImage = $('<img src="' + imageSource + '" class="manager-tip-trick-of-day-image tipoftheday_img" />');
            tipImageHolder.append(tipImage);

            let tipTitle = $('<label class="tip-trick-text-title" />');
            tipTitle = "PRO TIP";
            if (tipToRender.ManagerTipsTricksId > 0) {
              tipTitle += " #" + tipToRender.ManagerTipsTricksId;
            }
            let tipButtonHolder = $('<div class="manager-tip-trick-button-holder cycle-tip-holder" />');
            let nextTipButton = $('<button class="" id="nextTip_' + tipToRender.ManagerTipsTricksId + '"><i class="fa-solid fa-caret-right"></i></button>');
            nextTipButton.on("click", function () {
              let id = this.id;
              let tipId = id.split("_")[1];
              HandleNextTip(tipId);
            });
            let prevTipButton = $('<button class="" id="prevTip_' + tipToRender.ManagerTipsTricksId + '"><i class="fa-solid fa-caret-left"></i></button>');
            prevTipButton.on("click", function () {
              let id = this.id;
              let tipId = id.split("_")[1];
              HandlePreviousTip(tipId);
            });
            tipButtonHolder.append(prevTipButton);
            tipButtonHolder.append(nextTipButton);

            tipTitleHolder.append(tipTitle);
            tipTitleHolder.append(tipButtonHolder);

            let tipText = $('<label class="manager-tip-trick-text" />');
            tipText.append(tipToRender?.ManagerTipsTricksText);

            tipTextHolder.append(tipText);

            tipInfoHolder.append(tipTitleHolder);
            tipInfoHolder.append(tipTextHolder);

            tipHolder.append(tipImageHolder);
            tipHolder.append(tipInfoHolder);

            $("#tipTrickHolder", element).append(tipHolder);
          }
          if (callback != null) {
            callback();
          }
        }
        function RenderUserCreditsTotal(callback, userArray) {
          let userCreditsTotal = CalculateTotalCreditsForUser(userArray);
          $("#userTotalCredits", element).empty();
          $("#userTotalCredits", element).append(userCreditsTotal);

          if (callback != null) {
            callback(userCreditsTotal);
          }
          return userCreditsTotal;
        }
        /* Show/Hide/Toggle Options START */
        function HideAll() {
          HideTeamScoreHolder();
          HideGameParticipantHolder();
          HideCreditsHolder();
          HideTipOfDay();
          HideRankingItems();
          HideAllScoringHolders();
          SetToggleSwitchesDisplay(0);
        }
        function HideKpiLoader() {
          $("#KpiLoader", element).hide();
        }
        function ShowKpiLoader() {
          $("#KpiLoader", element).show();
        }
        function HideAllScoringHolders() {
          $(".user-dashboard-kpi-score-holder", element).each(function () {
            $(this).hide();
          });
        }
        function HideAllSubKpiScoringHolders() {
          $(".user-dashboard-subKpi-list-holder", element).each(function () {
            $(this).hide();
          });
        }
        function ForceKpiScoresToShow(projectId, groupId) {
          if (groupId == null || groupId < 0) {
            groupId = 0;
          }
          ShowKpiScores(projectId, groupId);
          ToggleExpander(projectId, -1, true, groupId);
        }
        function ToggleKpiScores(projectId, groupId) {
          if (groupId == null || groupId < 0) {
            groupId = 0;
          }
          let scoreHolderItem = $("#projectKpiScoresHolder_" + projectId + "_" + groupId, element);
          if (scoreHolderItem != null && scoreHolderItem.is(":visible") == true) {
            HideKpiScores(projectId, groupId);
          } else {
            ShowKpiScores(projectId, groupId);
          }
          ToggleExpander(projectId, -1, null, groupId);
        }
        function ToggleExpander(projectId, mqfNumber, forceDisplay, groupId) {
          if (groupId == null || groupId < 0) {
            groupId = 0;
          }
          let projectNameExpander = null;
          let isCurrentlyVisible = false;
          if (forceDisplay == null) {
            forceDisplay = false;
          }
          if (mqfNumber == null || mqfNumber <= 0) {
            projectNameExpander = $("#projectKpiProjectNameExpander_" + projectId + "_" + groupId, element);
            isCurrentlyVisible = $("#projectKpiScoresHolder_" + projectId + "_" + groupId, element).is(":visible");
          } else {
            projectNameExpander = $("#kpiNameExpander_" + projectId + "_" + mqfNumber + "_" + groupId, element);
            isCurrentlyVisible = $("#projectSubKpiScoresHolder_" + projectId + "_" + mqfNumber + "_" + groupId, element).is(":visible");
          }
          if (projectNameExpander != null) {
            if (forceDisplay == true) {
              $("i", projectNameExpander).removeClass("fa-plus");
              $("i", projectNameExpander).addClass("fa-minus");
            } else {
              if ($("i", projectNameExpander).hasClass("fa-plus")) {
                $("i", projectNameExpander).removeClass("fa-plus");
                $("i", projectNameExpander).addClass("fa-minus");
              } else {
                $("i", projectNameExpander).removeClass("fa-minus");
                $("i", projectNameExpander).addClass("fa-plus");
              }
            }
          }
        }
        function ShowKpiScores(projectId, groupId) {
          if (groupId == null || groupId < 0) {
            groupId = 0;
          }
          $("#projectKpiScoresHolder_" + projectId + "_" + groupId, element).show();
          let publishInfo = {
            ProjectId: projectId,
            MqfNumber: 0,
            GroupId: groupId,
          };
          ko.postbox.publish("UserPerformanceLoadProjectKpi", publishInfo);
        }
        function HideKpiScores(projectId, groupId) {
          $("#projectKpiScoresHolder_" + projectId + "_" + groupId, element).hide();
        }
        function ToggleSubKpiScores(projectId, mqfNumber, groupId) {
          if (groupId == null) {
            groupId = 0;
          }
          let scoreHolderItem = $("#projectSubKpiScoresHolder_" + projectId + "_" + mqfNumber + "_" + groupId, element);
          if (scoreHolderItem != null && scoreHolderItem.is(":visible") == true) {
            HideSubKpiScores(projectId, mqfNumber, groupId);
          } else {
            ShowSubKpiScores(projectId, mqfNumber, groupId);
          }
          ToggleExpander(projectId, mqfNumber, null, groupId);
        }
        function ShowSubKpiScores(projectId, mqfNumber, groupId) {
          if (groupId == null) {
            groupid = 0;
          }
          $("#projectSubKpiScoresHolder_" + projectId + "_" + mqfNumber + "_" + groupId, element).show();
        }
        function HideSubKpiScores(projectId, mqfNumber, groupId) {
          if (groupId == null) {
            groupid = 0;
          }
          $("#projectSubKpiScoresHolder_" + projectId + "_" + mqfNumber + "_" + groupId, element).hide();
        }
        function ShowTeamScoreHolder() {
          $("#userDashboardOverallTeamScoreHolder", element).show();
        }
        function HideTeamScoreHolder() {
          $("#userDashboardOverallTeamScoreHolder", element).hide();
        }
        function ShowCreditsHolder() {
          $("#userDashboardOverallCreditsHolder", element).show();
        }
        function HideCreditsHolder() {
          $("#userDashboardOverallCreditsHolder", element).hide();
        }
        function ShowGameParticipantHolder() {
          console.log("ShowGameParticipantHolder()");
          $("#gameParticipationHolder", element).show();
        }
        function HideGameParticipantHolder() {
          $("#gameParticipationHolder", element).hide();
        }
        function SetToggleSwitchesDisplay(projectCount) {
          if (projectCount == null) {
            projectCount = gUserDashboardData?.KpiScores?.length || 0;
          }

          if (projectCount > 10) {
            $("#kpiToggleSwitch", element).show();
            DisplayTopItems();
          } else {
            $("#kpiToggleSwitch", element).hide();
          }
        }
        function ShowTipOfDay() {
          $("#tipTrickHolder", element).show();
        }
        function HideTipOfDay() {
          $("#tipTrickHolder", element).hide();
        }
        function HideRankingItems() {
          $(".relative-rank-label", element).hide();
          $(".user-deashboard_rankbox", element).hide();
        }
        function ShowRankingItems() {
          $(".relative-rank-label", element).show();
          $(".user-deashboard_rankbox", element).show();
        }
        /* Show/Hide/Toggle Options END */
        function MarkActiveDisplay(itemToMark) {
          $("#toggleSwitchBottom").removeClass("active");
          $("#toggleSwitchTop").removeClass("active");
          $("#toggleSwitchAll").removeClass("active");
          switch (itemToMark.toLowerCase()) {
            case "bottom":
              $("#toggleSwitchBottom").addClass("active");
              break;
            case "all":
              $("#toggleSwitchAll").addClass("active");
              break;
            default:
              $("#toggleSwitchTop").addClass("active");
              break;
          }
        }
        function DisplayTopItems() {
          HideAllScoringHolders();
          HideAllSubKpiScoringHolders();
          $(".user-dashboard-kpi-scoretype-bottom", element).hide();
          $(".user-dashboard-kpi-scoretype-top", element).show();
          ExpandFirstProjectInList();
          MarkActiveDisplay("top");
        }
        function DisplayBottomItems() {
          HideAllScoringHolders();
          HideAllSubKpiScoringHolders();
          $(".user-dashboard-kpi-scoretype-top", element).hide();
          $(".user-dashboard-kpi-scoretype-bottom", element).show();
          ExpandFirstProjectInList();
          MarkActiveDisplay("bottom");
        }
        function DisplayAllItems() {
          HideAllScoringHolders();
          HideAllSubKpiScoringHolders();
          $(".user-dashboard-kpi-scoretype-bottom", element).hide();
          $(".user-dashboard-kpi-scoretype-top", element).show();
          ExpandFirstProjectInList();
          MarkActiveDisplay("all");
        }
        function DisplayCreditsHolder(callback) {
          HideCreditsHolder();
          if (hasCredits == true) {
            ShowCreditsHolder();
          }
          if (callback != null) {
            callback();
          }
        }
        function DisplayGameParticipationsHolder(callback)
        {
          HideGameParticipantHolder();
          if(isGameParticipant == true){
            ShowGameParticipantHolder();
          }
          if(callback != null){
            callback();
          }
        }
        function RenderInformation(callback) {
          RenderOverallStats();
          RenderTeamScoreHolderData();
          DisplayCreditsHolder();
          DisplayGameParticipationsHolder();
          if (callback != null) {
            callback();
          }
        }
        function ExpandFirstProjectInList() {
          $("[id^='projectKpiProjectNameExpander_']:visible", element).first().click();
        }
        function SortUserKpiScores(arrayToSort) {
          let sortedList = arrayToSort;
          sortedList = arrayToSort.sort(function (a, b) {
            if ((a.ProjectName != null && a.ProjectName) < (b.ProjectName != null && b.ProjectName)) {
              return -1;
            } else if ((a.ProjectName != null && a.ProjectName) > (b.ProjectName != null && b.ProjectName)) {
              return 1;
            } else if (a.ProjectId == b.ProjectId) {
              if (a.WeightFactor > b.WeightFactor) {
                return -1;
              } else if (a.WeightFactor < b.WeightFactor) {
                return 1;
              } else {
                if (new Date(a.TeamStartDate) < new Date(b.TeamStartDate)) {
                  return -1;
                } else if (new Date(a.TeamStartDate) > new Date(b.TeamStartDate)) {
                  return 1;
                } else {
                  if (a.KpiName > b.KpiName) {
                    return 1;
                  } else if (a.KpiName < b.KpiName) {
                    return -1;
                  } else {
                    return 0;
                  }
                }
              }
            }
          });
          return sortedList;
        }
        function CalculateTotalCreditsForUser(array) {
          let returnValue = 0;
          for (let pc = 0; pc < array.length; pc++) {
            let dataItem = array[pc];
            if (dataItem != null) {
              returnValue += dataItem.PointsValue;
            }
          }
          return returnValue;
        }
        function PushParticipantGameListForCycling(gameList)
        {
          if(gameList != null && gameList.length > 0){
            gameList.forEach(function(gameParticipant){
              if(gameCycle.findIndex(i => i.GameId == gameParticipant.GameId && i.GameType == gameParticipant.GameType) < 0)
              {
                gameCycle.push(gameParticipant);
              }
            });
          }
          gameCycle = gameCycle.sort((a,b)=>{
            return (a.DisplayOrder - b.DisplayOrder);
          })
        }

        scope.load = function (callback) {
          Initalize();
          GatherDashboardInformation(false, function () {
            RenderInformation(function () {
              ExpandFirstProjectInList();
            });
          });
        };
        ko.postbox.subscribe("RefreshAvatar", function () {
          gUserDashboardData.UserProfile = null;
          GetMyUserProfile(false, function (profile) {
            gUserDashboardData.UserProfile = profile;
            RenderOverallStats();
            $.cookie("refreshAvatar", false);
          });
        });
        ko.postbox.subscribe("LoadUserOverallStats", function () {
          scope.load();
        });
        ko.postbox.subscribe("LoadUserKpiScoring", function (dataParametersObject) {
          LoadKpiScoresForUserByProjectId(dataParametersObject.ProjectId, dataParametersObject.GroupId, function () {
            ForceKpiScoresToShow(dataParametersObject.ProjectId, dataParametersObject.GroupId);
          });
        });
        ko.postbox.subscribe("userDashboardInit", function () {
          Initalize();
        });
        ko.postbox.subscribe("userDashboardLoad", function () {
          scope.load();
        });
      },
    };
  },
]);
