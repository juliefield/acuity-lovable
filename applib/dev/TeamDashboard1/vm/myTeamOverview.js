angularApp.directive("ngMyTeamOverview", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/TeamDashboard1/view/myTeamOverview.htm?' + Date.now(),
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
         let idealTeamSize = 25;
         let percentFormatter = new Intl.NumberFormat("en-US", { style: 'percent' });
         let avatarBaseUrl = window.location.protocol + "//" + window.location.hostname + "/applib/css/images/avatars/";
         let defaultAvatarUrl = window.location.protocol + "//" + window.location.hostname + "/jq/avatars/empty_headshot.png";
         let emptySeatAvatarUrl = window.location.protocol + "//" + window.location.hostname + "/applib/css/images/avatars/mrbusiness/pigavatar17.png";
         let myTeamMembers = [];
         let myTeam = null;
         let teamMemberCoachingInfo = [];
         let myTeamMembersBalScores = [];
         let myTeamMemberScores = [];
         let emptySeatBarColor = "var(--light-gray)";
         let teamMemberDisplayTypes = [
            { value: "tenureOldNew", text: "Hire Date (oldest to newest)", IsActive: true },
            { value: "tenureNewOld", text: "Hire Date (newest to oldest)", IsActive: true },
            // {value: "balScoreHighLow", text: "Balanced Score - High to Low", IsActive: true},
            // {value: "balScoreLowHigh", text: "Balanced Score - Low to High", IsActive: true},
            // {value: "oldestCoach", text: "Oldest coaching first", IsActive: true},
            // {value: "recentCoach", text: "Most recent coaching first", IsActive: true},
            { value: "memberNameAtoZ", text: "Member Last Name A to Z", IsActive: true },
            { value: "memberNameZtoA", text: "Member Last Name Z to A", IsActive: true },
         ];
         let teamMemberActionOptions = [
            { value: "message", text: "Message User", IsActive: true, RequireConfirmation: false },
            { value: "flex", text: "Create Flex Game", IsActive: true, RequireConfirmation: false },
            { value: "removeFromTeam", text: "Remove From Team", IsActive: true, RequireConfirmation: true },
         ];
         /* Event Handling START */
         $("#teamOverviewTeamDisplayOrder", element).off("change").on("change", function () {
            $("#myTeamMembersKpiPopups", element).empty();
            LoadMyTeam(null, false, null);
         });
         $("#btnDoUserAction", element).off("click").on("click", function () {
            let selectedAction = $("#selectedUserAction", element).val();
            PerformUserAction(null, selectedAction)
         });
         $("#btnClearSelectedUsers", element).off("click").on("click", function () {
            RemoveAllUsersSelected();
         });
         //dev only button
         // $("#btnLoad", element).off("click").on("click", function () {
         //    let teamId = parseInt($("#devTeamId", element).val());
         //    LoadMyTeam(function(){               
         //       ko.postbox.publish("myCoachingSuggestionsLoad", teamId);
         //       ko.postbox.publish("myTeamOverviewUserScoreToggle", null);
         //       ko.postbox.publish("myTeamMovesLoad", teamId);
         //    }, true, teamId);
         // });

         $("#btnRefreshTeamList", element).off("click").on("click", function () {
            ko.postbox.publish("myTeamOverviewReload", false);
         });
         /* Event Handling END */
         scope.Initialize = function () {
            HideAll();
            LoadActionOptions();
            LoadDisplayOptions();
            WriteSelectedUserCount();
         };

         /* Data Loading START */
         function LoadDisplayOptions() {
            $("#teamOverviewTeamDisplayOrder", element).empty();
            $("#teamOverviewTeamDisplayOrder", element).append($("<option>", { value: "", text: "(Default)" }));
            $(teamMemberDisplayTypes).each(function () {
               if (this.IsActive == true) {
                  $("#teamOverviewTeamDisplayOrder", element).append($("<option>", { value: this.value, text: this.text }));
               }
            });
         }
         function LoadActionOptions() {
            $("#selectedUserAction", element).empty();
            $("#selectedUserAction", element).append($("<option>", { value: "", text: "" }));
            $(teamMemberActionOptions).each(function () {
               if (this.IsActive == true) {
                  $("#selectedUserAction", element).append($("<option>", { value: this.value, text: this.text }));
               }
            });
         }
         function LoadMyTeam(callback, forceReload, teamId) {
            if (forceReload == null) {
               forceReload = false;
            }

            if (teamId == null) {
               teamId = legacyContainer.scope.filters.Team;
            }
            if (teamId == null || teamId == "" || teamId.toLowerCase() == "each".toLowerCase() || teamId.toLowerCase() == "all".toLowerCase()) {
               if (callback != null) {
                  callback(null);
               }
               return false;
            }
            RenderMyTeamInformation(null, teamId);
            GetMyTeamMembers(function (foundTeamMembers) {
               RenderMyTeamMembers(function () {
                  LoadKpiScoresForUserList(callback, foundTeamMembers, myTeam.ProjectId, forceReload);
               }, foundTeamMembers);
            }, forceReload, teamId);
         }
         function LoadKpiScoresForUserList(callback, userList, projectId, forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }
            $(userList).each(function () {
               let userId = this.UserId;
               GetKpiScoresForUser(function (kpiList) {
                  RenderKpiScoresForUser(callback, kpiList, userId);
               }, userId, projectId, forceReload);
            });
         }
         /* Data Loading END */
         /* Data Pulls START */
         function GetMyTeamMembers(callback, forceReload, teamId) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (myTeamMembers != null && myTeamMembers.length > 0 && forceReload == false) {
               if (callback != null) {
                  callback(myTeamMembers);
               }
               return;
            }
            else {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "selfserve",
                     cmd: "getUsersForTeam",
                     teamid: teamId,
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let returnData = JSON.parse(data.usersOnTeamList);
                     myTeamMembers.length = 0;
                     for (let i = 0; i < returnData.length; i++) {
                        myTeamMembers.push(returnData[i]);
                     }
                     if (callback != null) {
                        callback(returnData);
                     }
                  }
               });
            }
         }
         function GetCoachingInfoForUser(userId) {
            let returnObject = null;
            if (teamMemberCoachingInfo != null && teamMemberCoachingInfo.length > 0) {
               returnObject = teamMemberCoachingInfo.find(u => u.UserId == userId);
            }
            if (returnObject == null) {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "userprofile",
                     cmd: "getCoachingInformationForUser",
                     userid: userId
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     try {
                        let returnData = JSON.parse(data.userJournalInfo);
                        if (returnData != null) {
                           teamMemberCoachingInfo.push(returnData);
                           returnObject = returnData;
                        }
                     }
                     catch (e) {
                        console.error(e);
                        console.error("ERR:\n" + JSON.stringify(e));
                        console.info("ERROR IN COACHING\n");
                        console.info(JSON.stringify(data.userJournalInfo));
                     }
                  }
               });
            }

            return returnObject;
         }
         function GetUserBalancedScore(userId) {
            let returnObject = null

            if (myTeamMembersBalScores != null && myTeamMembersBalScores.length > 0) {
               returnObject = myTeamMembersBalScores.find(u => u.UserId == userId);
            }
            if (returnObject == null) {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "userprofile",
                     cmd: "getCurrentScoreForKpi",
                     userid: userId,
                     mqfnumber: 0,
                     subtypeid: 0
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let returnData = JSON.parse(data.currentScoringInfo);
                     if (returnData != null) {
                        myTeamMembersBalScores.push(returnData);
                        returnObject = returnData;
                     }
                  }
               });
            }

            return returnObject;
         }
         function GetMyTeamInformation(callback, teamId) {
            a$.ajax({
               type: "POST",
               service: "C#",
               async: false,
               data: {
                  lib: "selfserve",
                  cmd: "getTeamById",
                  teamid: teamId,
                  deepLoad: false
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (data) {
                  let returnData = JSON.parse(data.team);
                  myTeam = returnData;
                  if (callback != null) {
                     callback(returnData);
                  }
                  else {
                     return returnData;
                  }
               }
            });
         }
         function GetKpiScoresForUser(callback, userId, projectId, forceReload) {
            let returnList = null;

            if (forceReload == null) {
               forceReload = false;
            }
            if (projectId == null) {
               projectId = myTeam.ProjectId;
            }
            if (myTeamMemberScores != null && myTeamMemberScores.length > 0 && forceReload == false) {
               returnList = myTeamMemberScores.filter(i => i.UserId == userId);
               if (callback != null) {
                  callback(returnList);
               }
            }
            else {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "userprofile",
                     cmd: "getKpiScoreForUserAndProject",
                     userid: userId,
                     projectid: projectId
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (jsonData) {
                     if (jsonData.errormessage != null && (jsonData.errormessage == true || jsonData.errormessage == "true")) {
                        a$.jsonerror(jsonData);
                        return;
                     }
                     else {
                        let kpiScores = JSON.parse(jsonData.userProjectKpiScores);
                        for (let kIndex = 0; kIndex < kpiScores.length; kIndex++) {
                           let scoreItem = kpiScores[kIndex];
                           let curIndex = myTeamMemberScores.findIndex(i => i.UserId == userId && i.MqfNumber == scoreItem.MqfNumber && i.SubTypeId == scoreItem.SubTypeId);
                           if (curIndex < 0) {
                              myTeamMemberScores.push(scoreItem);
                           }
                        }
                        if (callback != null) {
                           callback(kpiScores);
                        }
                     }
                  }
               });
            }
         }

         /* Data Pulls END */
         /* Data Rendering START */
         function RenderMyTeamInformation(callback, teamId) {
            let teamName = `Team: ${teamId}`;
            if (myTeam == null) {
               GetMyTeamInformation(null, teamId);
            }
            $("#teamOverviewTeamName", element).empty();

            if (myTeam != null) {
               teamName = myTeam.TeamName;
            }
            else {
               console.log("No Team information found to render.");
            }

            $("#teamOverviewTeamName", element).append(teamName);
            if (callback != null) {
               callback();
            }
         }
         function RenderMyTeamMembers(callback, listToRender) {
            let teamSizeOverage = 0;
            let maxMembers = idealTeamSize;

            if (listToRender == null) {
               listToRender = myTeamMembers;
            }
            $("#myTeamMembersDisplay", element).empty();

            if (listToRender.length > idealTeamSize) {
               teamSizeOverage = listToRender.length - idealTeamSize;
               maxMembers = listToRender.length;
            }
            $("#lblCurrentUserCount", element).text(listToRender.length);
            if (teamSizeOverage > 0) {
               $("#lblAvailableSeatCount", element).text(`None - Over by ${teamSizeOverage}`);
            }
            else {
               $("#lblAvailableSeatCount", element).text((idealTeamSize - listToRender.length));
            }
            listToRender = SortUserTeamMembersList(listToRender);
            let tmpUserId = "";
            for (let uIndex = 0; uIndex < maxMembers; uIndex++) {
               //let teamMemberObject = listToRender[uIndex];
               let userObject = null;
               if (uIndex < listToRender.length) {
                  userObject = listToRender[uIndex];
               }
               let userHolder = $(`<div class="my-team-user-holder" />`);

               let userDisplayObject = $(`<div class="my-team-user-display-data">`);

               let userScoreColorBar = $(`<div class="my-team-user-scoring-color-bar">`);
               //userScoreColorBar.append("&nbsp;");
               let userSelectionHolder = $(`<div class="my-team-user-selection-holder">`);
               let userAvatarHolder = $(`<div class="my-team-user-avatar-holder">`);
               let userNameHolder = $(`<div class="my-team-user-name-holder">`);
               let userBalancedScoreHolder = $(`<div class="my-team-user-balanced-score-holder">`);
               let userCoachingInfoHolder = $(`<div class="my-team-user-coaching-info-holder">`);

               let userKpiOptionsDotHolder = $(`<div class="my-team-user-kpi-options-holder" id="kpiUserScoreDotHolder|emptySeat${uIndex}" />`);
               let userBalancedScore = -10000000000;
               let userDisplayName = "Empty Seat";
               let userAvatar = $(`<img src="${emptySeatAvatarUrl}" class="user-avatar-image" alt="Empty Seat" >`);
               let avatarFileCleaned = defaultAvatarUrl;
               //let userBarBackgroundColor = legacyContainer.scope.getKPIColorRGB(0).color;
               let userBarBackgroundColor = emptySeatBarColor;
               let userScoreObject = null;

               if (userObject != null && userObject.UserId != null) {
                  userScoreObject = GetUserBalancedScore(userObject.UserId);
               }
               if (userObject != null) {
                  tmpUserId = userObject.UserId;

                  userKpiOptionsDotHolder.attr("id", `kpiUserScoreDotHolder|${userObject.UserId}`);
                  userHolder.attr("id", `userHolderObject|${userObject.UserId}`);
                  userDisplayObject.attr("id", `userDisplayObject|${userObject.UserId}`);
                  userCoachingInfoHolder.attr("id", `userCoachingInfoObject|${userObject.UserId}`);

                  if (userObject.AvatarImageFileName != "empty_headshot.png") {
                     avatarFileCleaned = Global_CleanAvatarUrl(userObject.AvatarImageFileName);
                     let urlPrefix = a$.gup("prefix");
                     if (avatarFileCleaned.indexOf("AV_") > -1) {
                        avatarFileCleaned = `https://${urlPrefix}.acuityapmr.com/${avatarFileCleaned}`;
                     }
                  }
                  userAvatar = $(`<img src="${avatarFileCleaned}" class="user-avatar-image" alt="${userObject.UserFullName} Avatar" id="userAvatar_${userObject.UserId}" >`);
                  userDisplayName = userObject.UserFullName;

                  if (userScoreObject != null) {
                     let userScore = userScoreObject.ScoredValue;
                     userBarBackgroundColor = legacyContainer.scope.getKPIColorRGB(userScore).color;
                     userBalancedScore = userScoreObject.ScoredValue;
                  }
                  let lastCoachOn = null;
                  let daysSinceCoach = 0;
                  let coachInfo = GetCoachingInfoForUser(userObject.UserId);
                  if (coachInfo != null) {
                     lastCoachOn = coachInfo.MostRecentJournalDate;
                     daysSinceCoach = coachInfo.DaysSinceLastEntry;
                  }
                  if (lastCoachOn != null) {
                     userCoachingInfoHolder.append(`Last Coach: ${new Date(lastCoachOn).toLocaleDateString()}<br />${daysSinceCoach} days`);
                  }
                  else {
                     userCoachingInfoHolder.append(`Never Coached<br/>&nbsp;`);
                  }
                  let userSelectionCheckbox = $(`<input type="checkbox" id="userSelected|${userObject.UserId}" />`);
                  userSelectionCheckbox.on("click", function () {
                     let id = this.id;
                     let userId = id.split("|")[1];
                     HandleSelectedUser(userId);
                  });
                  userSelectionHolder.append(userSelectionCheckbox);
                  userHolder.on("click", function () {
                     let holderId = this.id;
                     let userId = holderId.split("|")[1];
                     HandleUserClick(userId);
                     let userObject = myTeamMembers.find(u => u.UserId == userId);
                     ko.postbox.publish("myTeamOverviewUserScoreToggle", userObject);
                     ko.postbox.publish("MarkUserInformation", userId);
                  });

               }
               else {

                  userCoachingInfoHolder.append("&nbsp;<br/>&nbsp;");
               }

               userScoreColorBar.css("background-color", userBarBackgroundColor);

               userAvatarHolder.append(userAvatar);
               userNameHolder.append(userDisplayName);
               if (userBalancedScore > -10000000000) {
                  userBalancedScoreHolder.append(userBalancedScore);
                  userKpiOptionsDotHolder.append("Loading...");
               }
               else {
                  userBalancedScoreHolder.append("&nbsp;");
                  userKpiOptionsDotHolder.append("&nbsp;");
               }
               userScoreColorBar.append(userBalancedScoreHolder);

               userKpiOptionsDotHolder.append("&nbsp;");
               userDisplayObject.append(userScoreColorBar);
               userDisplayObject.append(userSelectionHolder);
               userDisplayObject.append(userAvatarHolder);
               userDisplayObject.append(userNameHolder);
               //userDisplayObject.append(userBalancedScoreHolder);
               userDisplayObject.append(userCoachingInfoHolder);
               userDisplayObject.append(`<hr />`);
               userDisplayObject.append(userKpiOptionsDotHolder);
               userHolder.append(userDisplayObject);
               $("#myTeamMembersDisplay").append(userHolder);
            }
            if (callback != null) {
               callback();
            }
         }
         function RenderKpiScoresForUser(callback, listToRender, userId) {
            $(`#kpiUserScoreDotHolder|${userId}`, element).empty();
            if (listToRender == null) {
               listToRender = myTeamMemberScores.filter(i => i.UserId == userId);
            }
            listToRender = listToRender.filter(i => i.SubTypeId == 0);
            if (listToRender != null && listToRender.length > 0) {
               listToRender = SortKpiList(listToRender);

               for (let kIndex = 0; kIndex < listToRender.length; kIndex++) {
                  let kpiScoreItem = listToRender[kIndex];
                  let kpiDotItem = $(`<div class="user-kpi-dot-item" id="kpiDotItem|${userId}|${kpiScoreItem.MqfNumber}" />`);
                  let dotColor = legacyContainer.scope.getKPIColorRGB(kpiScoreItem.ScoredValue).color;
                  kpiDotItem.css("background-color", dotColor);
                  if (kpiScoreItem.WeightFactor > 0) {
                     kpiDotItem.addClass("weighted");
                  }
                  kpiDotItem.append("&nbsp;");
                  kpiDotItem.on("click", function () {
                     let id = this.id;
                     let userId = id.split("|")[1];
                     let mqfNumber = id.split("|")[2];
                     ToggleDotDisplay(userId, mqfNumber);
                  });
                  $(`#kpiUserScoreDotHolder|${userId}`, element).append(kpiDotItem);
                  RenderUserKpiScorePopupItem(callback, kpiScoreItem, userId);
               }
            }
            else {
               $(`#kpiUserScoreDotHolder|${userId}`).append("No Scores Found");
               if (callback != null) {
                  callback();
               }
            }
         }
         function RenderUserKpiScorePopupItem(callback, itemToRender, userId) {
            let userKpiPopupItemHolder = $(`<div class="user-kpi-data-popup-holder" id="userKpiScorePopupItem|${userId}|${itemToRender.MqfNumber}"></div>`);
            let popupButtonHolderHeader = $(`<div class="user-kpi-data-popup-button-holder button-holder" />`);
            let popupCloseButton = $(`<button class="button close-btn"><i class="fa fa-close"></i></button>`);
            popupCloseButton.on("click", function () {
               HideAllDotDataDisplays();
               HideDotDataPopup();
            });
            popupButtonHolderHeader.append(popupCloseButton);

            let userObject = myTeamMembers.find(u => u.UserId == userId);
            let userName = userId;
            let avatarFileCleaned = defaultAvatarUrl;
            if (userObject != null) {
               if (userObject.AvatarImageFileName != "empty_headshot.png") {
                  avatarFileCleaned = Global_CleanAvatarUrl(userObject.AvatarImageFileName);
                  let urlPrefix = a$.gup("prefix");
                  if (avatarFileCleaned.indexOf("AV_") > -1) {
                     avatarFileCleaned = `https://${urlPrefix}.acuityapmr.com/${avatarFileCleaned}`;
                  }
               }
               userName = userObject.UserFullName;
            }
            userAvatar = $(`<img src="${avatarFileCleaned}" class="user-avatar-image" alt="${userName} Avatar" id="userAvatar|${userId}" >`);
            let userDataHolder = $(`<div class="user-kpi-data-popup-user-info-holder" />`);
            let userHeaderData = $(`<div />`);
            let userHeaderAvatarHolder = $(`<span class="user-kpi-data-popup-user-avatar" />`);
            userHeaderAvatarHolder.append(userAvatar);
            let userHeaderNameHolder = $(`<span class="user-kpi-data-popup-user-name" />`);
            userHeaderNameHolder.append(`${userName}`);

            let userKpiScoreHolder = $(`<span class="user-kpi-data-popup-user-score-holder" />`);
            userKpiScoreHolder.append(`<b>${itemToRender.KpiName}: ${itemToRender.ScoredValue}</b>`);

            let userKpiChartHolder = $(`<div class="user-kpi-data-popup-trend-chart-holder" />`);
            userKpiChartHolder.append("30 day user trend chart here.");
            let userKpiRankingInfoHolder = $(`<div class="user-kpi-data-popup-user-rank-holder" />`);
            userKpiRankingInfoHolder.append("Project Rank: 8888 of 8888 | ");
            userKpiRankingInfoHolder.append("Location Rank: 888 of 888 <br> ");
            userKpiRankingInfoHolder.append("Group Rank: 88 of 88 | ");
            userKpiRankingInfoHolder.append("Team Rank: 8 of 8 <br>");

            userHeaderData.append(userHeaderAvatarHolder);
            userHeaderData.append(userHeaderNameHolder);
            userHeaderData.append(userKpiScoreHolder);

            userDataHolder.append(userHeaderData);
            userDataHolder.append(userKpiRankingInfoHolder);

            userKpiPopupItemHolder.append(popupButtonHolderHeader);
            userKpiPopupItemHolder.append(userDataHolder);
            userKpiPopupItemHolder.append(userKpiChartHolder);

            $("#myTeamMembersKpiPopups", element).append(userKpiPopupItemHolder);
            userKpiPopupItemHolder.hide();

            if (callback != null) {
               callback();
            }
         }
         /* Data Rendering END */
         /* Data Handling START */
         // function GetLastCoachingDateForUser(userId)
         // {
         //    let returnValue = null;

         //    return returnValue;
         // }
         function SortUserTeamMembersList(listToSort) {
            if (listToSort == null) {
               listToSort = myTeamMembers;
            }
            let sortType = $("#teamOverviewTeamDisplayOrder", element).val();
            let sortedList = listToSort;
            switch (sortType) {
               case "tenureNewOld":
                  sortedList = sortedList.sort((a, b) => {
                     if (a.EnterDate < b.EnterDate) {
                        return 1;
                     }
                     else if (a.EnterDate > b.EnterDate) {
                        return -1;
                     }
                     else {
                        if (a.LastName < b.LastName) {
                           return -1;
                        }
                        else if (a.LastName > b.LastName) {
                           return 1;
                        }
                        else {
                           if (a.FirstName < b.FirstName) {
                              return -1;
                           }
                           else if (a.FirstName > b.FirstName) {
                              return 1;
                           }
                           else {
                              return 0;
                           }
                        }
                     }
                  });
                  break;
               case "memberNameAtoZ":
                  sortedList = sortedList.sort((a, b) => {
                     if (a.LastName < b.LastName) {
                        return -1;
                     }
                     else if (a.LastName > b.LastName) {
                        return 1;
                     }
                     else {
                        if (a.FirstName < b.FirstName) {
                           return -1;
                        }
                        else if (a.FirstName > b.FirstName) {
                           return 1;
                        }
                        else {
                           return 0;
                        }
                     }
                  });
                  break;
               case "memberNameZtoA":
                  sortedList = sortedList.sort((a, b) => {
                     if (a.LastName < b.LastName) {
                        return 1;
                     }
                     else if (a.LastName > b.LastName) {
                        return -1;
                     }
                     else {
                        if (a.FirstName < b.FirstName) {
                           return -1;
                        }
                        else if (a.FirstName > b.FirstName) {
                           return 1;
                        }
                        else {
                           return 0;
                        }
                     }
                  });
                  break;
               case "tenureOldNew":
               default:
                  sortedList = sortedList.sort((a, b) => {
                     if (a.EnterDate < b.EnterDate) {
                        return -1;
                     }
                     else if (a.EnterDate > b.EnterDate) {
                        return 1;
                     }
                     else {
                        if (a.LastName < b.LastName) {
                           return -1;
                        }
                        else if (a.LastName > b.LastName) {
                           return 1;
                        }
                        else {
                           if (a.FirstName < b.FirstName) {
                              return -1;
                           }
                           else if (a.FirstName > b.FirstName) {
                              return 1;
                           }
                           else {
                              return 0;
                           }
                        }
                     }
                  });
                  break;
            }

            return sortedList;
         }
         function SortKpiList(listToSort) {
            let sortedList = listToSort;
            sortedList = sortedList.sort((a, b) => {
               if (a.WeightFactor > b.WeightFactor) {
                  return -1;
               }
               else if (a.WeightFactor < b.WeightFactor) {
                  return 1;
               }
               else {
                  if (a.KpiName > b.KpiName) {
                     return 1;
                  }
                  else if (a.KpiName < b.KpiName) {
                     return -1;
                  }
                  else {
                     return 0;
                  }
               }
            })
            return sortedList;
         }
         function PerformUserAction(callback, actionToPerform) {
            if (actionToPerform != null && actionToPerform != "") {
               switch (actionToPerform.toLowerCase()) {
                  case "removeFromTeam".toLowerCase():
                     let selectedUserCount = 88888;
                     if (confirm(`You are about to remove ${selectedUserCount} number of members on your team.  The system will use today as the date to remove the members.\nAre you sure?\n\nPress OKAY to continue, or CANCEL to not have this action occur.`) == true) {
                        console.log("Remove the users from the team.");
                        //TODO: Determine what needs to happen here.
                     }
                     else {
                        return false;
                     }
                     break;
                  case "message".toLowerCase():
                     console.log("Message the users selected.");
                     break;
                  case "flex".toLowerCase():
                     console.log("Perform create flex game options.");
                     break;
                  default:
                     console.log("Handle user action options.");
                     break;
               }
            }
            alert("[NYI] Handle of action not implemeneted..");
            if (callback != null) {
               callback();
            }
         }
         /* Data Handling END */
         /* Hide/Show START */
         function HideAll() {
            HideDotDataPopup();
            HideAllDotDataDisplays();
         }
         function HandleUserClick(userId) {
            $(".my-team-user-holder", element).removeClass("active");
            $(`#userHolderObject|${userId}`, element).addClass("active");
         }
         function HideAllDotDataDisplays() {
            $(".user-kpi-data-popup-holder", element).hide();
            // $("[id^='kpiDotDataItem_']", element).each(function () {
            //    $(this).hide();
            // });
         }
         function ToggleDotDisplay(userId, mqfNumber) {
            HideAllDotDataDisplays();
            ShowDotDataDisplay(userId, mqfNumber);
         }
         function HideDotDataPopup() {
            $(".user-kpi-data-popup-display-holder", element).hide();
         }
         function ShowDotDataPopup() {
            $(".user-kpi-data-popup-display-holder", element).show();
         }
         function HideDotDataDisplay() {
            HideAllDotDataDisplays();
            HideDotDataPopup();
         }
         function ShowDotDataDisplay(userId, mqfNumber) {
            HideAllDotDataDisplays();
            ShowDotDataPopup();
            $(`#userKpiScorePopupItem|${userId}|${mqfNumber}`, element).show();
         }

         /* Hide/Show END */
         /* MISC Function START */
         function HandleSelectedUser() {
            CollectSelectedUserCount(function (userCount) {
               WriteSelectedUserCount(userCount);
            });
         }
         function CollectSelectedUserCount(callback) {
            let checkedCount = 0;
            $("[id^='userSelected|']", element).each(function () {
               let userId = this.id.split("|")[1];

               if ($(this).is(":checked")) {
                  console.log("Determine what do do when we have a selected user.");
                  MarkUserSelected(userId);
                  checkedCount++;
               }
               else {
                  RemoveUserSelected(userId);
               }
            });
            if (callback != null) {
               callback(checkedCount);
            }
            else {
               return checkedCount;
            }
         }
         function MarkUserSelected(userId) {
            $(`#userHolderObject|${userId}`, element).addClass("selected-user");
         }
         function RemoveUserSelected(userId) {
            $(`#userHolderObject|${userId}`, element).removeClass("selected-user");
         }
         function RemoveAllUsersSelected() {
            $("id[^=userSelected|]", element).each(function () {
               this.prop("checked", false);
               let userId = this.id.split("|")[1];
               RemoveUserSelected(userId);
            });
         }

         /* MISC Function END */
         /* User Message Writing START */
         function WriteSelectedUserCount(userCount) {
            if (userCount == null) {
               userCount = 0;
            }
            $("#selectedUserCountDataLabel", element).empty();
            $("#selectedUserCountDataLabel", element).append(userCount);
         }
         /* User Message Writing END */
         function ClearPreviousControlDataLoaded() {
            ko.postbox.publish("ResetDirective");
         }
         scope.load = function () {
            //console.info("scope.load()");
            scope.Initialize();
            //let teamId = legacyContainer.scope.filters.Team;
            // LoadMyTeam(function(){
            //    ko.postbox.publish("myCoachingSuggestionsLoad", teamId);
            //    ko.postbox.publish("myTeamOverviewUserScoreToggle", null);
            //    ko.postbox.publish("myTeamMovesLoad", teamId);
            // }, true, teamId);
         };
         scope.load();

         ko.postbox.subscribe("myTeamOverviewReload", function (forceReload) {
            let teamId = legacyContainer.scope.filters.Team;
            if (forceReload == null) {
               forceReload = false;
            }
            LoadMyTeam(function () {
               ko.postbox.publish("myCoachingSuggestionsLoad", teamId);
               ko.postbox.publish("myTeamOverviewUserScoreToggle", null);
               ko.postbox.publish("myTeamMovesLoad", teamId);
            }, forceReload, teamId);
         });
         ko.postbox.subscribe("myTeamOverviewLoad", function () {
            scope.load();
         });
         ko.postbox.subscribe("Filters", function (value) {
            let teamId = legacyContainer.scope.filters.Team;
            ClearPreviousControlDataLoaded();
            LoadMyTeam(function () {
               ko.postbox.publish("myCoachingSuggestionsLoad", teamId);
               ko.postbox.publish("myTeamOverviewUserScoreToggle", null);
               ko.postbox.publish("myTeamMovesLoad", teamId);
            }, true, teamId);
         });
         ko.postbox.subscribe("ResetDirective", function () {
            myTeam = null;
            myTeamMembers.length = 0;
            teamMemberCoachingInfo.length = 0;
            myTeamMemberScores.length = 0;
            myTeamMemberScores.length = 0;
            ko.postbox.publish("myTeamOverviewReload", true);
         });

      }
   };
}]);