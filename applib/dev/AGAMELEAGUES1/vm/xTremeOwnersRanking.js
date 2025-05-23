angularApp.directive("ngXtremeOwnersRanking", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/AGAMELEAGUES1/view/xTremeOwnersRanking.htm?' + Date.now(),
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
         let defaultAvatarUrl = a$.debugPrefix() + "/applib/css/images/empty_headshot.png";
         let leaderboardListData = [];
         let weeksInfoData = [];
         let ownerListData = [];
         let teamColorsListData = [];
         let rankingImages = [
            {rankNumber: 1, imageUrl: "/applib/css/images/powerrank-gold-ribbion.png"},
            {rankNumber: 2, imageUrl: "/applib/css/images/powerrank-silver-ribbion.png"},
            {rankNumber: 3, imageUrl: "/applib/css/images/powerrank-bronze-ribbion.png"},
         ]

         HideAll();
         /* Directive control events section START */
         scope.Initialize = function () {
            HideAll();
         };
         $("#btnLoad", element).off("click").on("click", function () {
            ko.postbox.publish("aGameXtremeLeaderboardLoad");
         });
         $("#btnReload", element).off("click").on("click", function () {
            ko.postbox.publish("aGameXtremeLeaderboardReload");
         });
         $("#btnRulesDisplay", element).off("click").on("click", function () {
            ShowRankingRules();
         });
         $(".button-close-rules", element).off("click").on("click", function () {
            HideRankingRules();
         });
         $("#xtremeRankHeader", element).off("click").on("click", function () {
            SortLeaderboard(null, "rank", this.id);
         });
         $("#xtremeRatingsCountScoreHeader", element).off("click").on("click", function () {
            SortLeaderboard(null, "ratingCount", this.id);
         });
         $("#xtremeRatingScoreHeader", element).off("click").on("click", function () {
            SortLeaderboard(null, "ratingScore", this.id);
         });
         $("#xtremeAttritionScoreHeader", element).off("click").on("click", function () {
            SortLeaderboard(null, "attritionScore", this.id);
         });
         $("#xtremeEngagementScoreHeader", element).off("click").on("click", function () {
            SortLeaderboard(null, "engagementScore", this.id);
         });
         $("#xtremeGameScoreHeader", element).off("click").on("click", function () {
            SortLeaderboard(null, "teamScore", this.id);
         });
         /* Directive control events section END */
         /* Load Information START */
         function LoadXtremeLeaderBoard(callback) {
            GetXtremeLeaderboard(function () {
               $("#sortItem", element).val("");
               $("#sortType", element).val("");
               SortLeaderboard(callback, "rank", "xtremeRankHeader");
            });
         }
         /* Load Information END */
         /* Get Information START */
         function GetXtremeLeaderboard(callback, forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (leaderboardListData != null && leaderboardListData.length > 0 && forceReload == false) {
               if (callback != null) {
                  callback(leaderboardListData);
               }
            }
            else {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "flex",
                     cmd: "getExtremeOwnerLeaderboardGetAll"
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     var returnList = JSON.parse(data.allXtremeOwnerLeaderboardList);
                     leaderboardListData.length = 0;
                     leaderboardListData = returnList;
                     if (callback != null) {
                        callback(returnList);
                     }
                  }
               });

            }
         }
         function GetUserProfileObject(callback, userId) {
            a$.ajax({
               type: "POST",
               service: "C#",
               async: false,
               data: {
                  lib: "selfserve",
                  cmd: "getUserProfile",
                  userid: userId,
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (data) {
                  var returnData = JSON.parse(data.userFullProfile);
                  ownerListData.push(returnData);
                  if (callback != null) {
                     callback(returnData);
                  }
               }
            });
         }
         function GetScheduleDataObject(callback, leagueId) {
            a$.ajax({
               type: "POST",
               service: "C#",
               async: false,
               data: {
                  lib: "flex",
                  cmd: "getScheduleForDivision",
                  divisionId: leagueId
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (data) {
                  let returnData = JSON.parse(data.scheduleList);
                  for (let wIndex = 0; wIndex < returnData.length; wIndex++) {
                     let item = returnData[wIndex];
                     if (weeksInfoData.findIndex(i => i.ScheduleId == item.ScheduleId) < 0) {
                        weeksInfoData.push(item);
                     }
                  }
                  if (callback != null) {
                     callback(weeksInfoData);
                  }
               }
            });
         }
         function GetAGameTeamColors(callback, teamId) {
            let teamColors = null;
            if (teamColorsListData != null && teamColorsListData.length > 0) {
               teamColors = teamColorsListData.find(t => t.TeamId == teamId);
               if (teamColors != null) {
                  if (callback != null) {
                     callback(teamColors);
                  }
                  else {
                     return teamColors;
                  }
               }
            }
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
                  let returnData = JSON.parse(data.teamColors);
                  let colorsData = new Object();
                  colorsData.TeamId = teamId;
                  colorsData.Colors = returnData;

                  if (teamColorsListData.findIndex(t => t.TeamId == teamId) < 0) {
                     teamColorsListData.push(colorsData);
                  }
                  if (callback != null) {
                     callback(colorsData);
                  }
               }
            });
         }
         /* Get Information END */
         /* Render Information START */
         function RenderXtremeLeaderboard(callback, listToRender) {
            if (listToRender == null) {
               listToRender = leaderboardListData;
            }
            let displayType = "OVERALL";
            displayType = $("displayType", element).val() || "OVERALL"
            if(displayType == null || displayType == "")
            {
               displayType = "OVERALL";
            }
            
            $("#leaderboardHolderListing", element).empty();            
            let leaderboardDataHolder = $(`<div class="xtreme-owner-ranking-data-holder" />`);
            if(listToRender != null && listToRender.length > 0)
            {
               RenderLeaderboardHeader(null, -1, leaderboardDataHolder, listToRender, displayType);
            }
            else
            {  
               leaderboardDataHolder = $(`<div class="xtreme-owner-empty" />`);
               leaderboardDataHolder.append("Sorry, there are no power rankings available. Please check back later.");
            }

            $("#leaderboardHolderListing", element).append(leaderboardDataHolder);
            HideAllDetails();
            if (callback != null) {
               callback();
            }
         }         
         function RenderScorecardDetails(detailsList, renderToObject) {
            let scorecardDetailsListHolder = $(`<div class="xtreme-owner-league-details" />`);
            if (detailsList != null && detailsList.length > 0) {
               detailsList = SortList(detailsList, "weekstart");
               for (let dIndex = 0; dIndex < detailsList.length; dIndex++) {
                  let detailItem = detailsList[dIndex];

                  let scorecardDetailsRowHolder = $(`<div class="xtreme-owner-league-details-list-row" />`);
                  let detailPaddingHolder = $(`<div class="xtreme-owner-ranking-item detail-padding" />`);
               
                  let weekNumberHolder = $(`<div class="xtreme-owner-ranking-item week-number" />`);
                  let weekDatesHolder = $(`<div class="xtreme-owner-ranking-item week-dates" />`);
                  let ratingCountHolder = $(`<div class="xtreme-owner-ranking-item perf-rating-count" />`);
                  let performanceRatingHolder = $(`<div class="xtreme-owner-ranking-item perf-rating-score" />`);
                  let attritionHolder = $(`<div class="xtreme-owner-ranking-item attrit-score" />`);
                  let engagementHolder = $(`<div class="xtreme-owner-ranking-item engage-score" />`);
                  let teamScoreHolder = $(`<div class="xtreme-owner-ranking-item team-score" />`);
                  let totalHolder = $(`<div class="xtreme-owner-ranking-item total-score" />`);

                  let weeksInfo = GetWeekDataToRender(detailItem);

                  weekNumberHolder.append(weeksInfo);

                  weekDatesHolder.append(`${new Date(detailItem.WeekStartDate).toLocaleDateString()} - ${new Date(detailItem.WeekEndDate).toLocaleDateString()}`);
                  ratingCountHolder.append(detailItem.PerformanceRatingCount);
                  performanceRatingHolder.append(`${detailItem.PerformanceRatingScore} / ${detailItem.PerformanceRatingMax}`);
                  attritionHolder.append(detailItem.AttritionScore);
                  engagementHolder.append(detailItem.EngagementScore);
                  teamScoreHolder.append(detailItem.TeamPerformanceScore);
                  totalHolder.append(detailItem.TotalScore);

                  scorecardDetailsRowHolder.append(detailPaddingHolder);
                  scorecardDetailsRowHolder.append(weekNumberHolder);
                  scorecardDetailsRowHolder.append(weekDatesHolder);
                  scorecardDetailsRowHolder.append(ratingCountHolder);
                  scorecardDetailsRowHolder.append(performanceRatingHolder);
                  scorecardDetailsRowHolder.append(attritionHolder);
                  scorecardDetailsRowHolder.append(engagementHolder);
                  scorecardDetailsRowHolder.append(teamScoreHolder);
                  scorecardDetailsRowHolder.append(totalHolder);

                  scorecardDetailsListHolder.append(scorecardDetailsRowHolder);
               }
            }
            else {
               scorecardDetailsListHolder.append("No information found.");
            }
            $(renderToObject, element).append(scorecardDetailsListHolder);
         }
         
         function RenderLeaderboardHeader(callback, leagueId, renderToObject, dataList, renderType)
         {
            let leaderboardHeaderHolder = $(`<div class="ranking-leaderboard-league-header-holder" />`);            
            let divisionNameHolder = $(`<div class="xtreme-owner-league-name" />`);
            let divisionName = "All Leagues/Divisions";
            if(leagueId > 0)
            {
               divisionName = `League ${leagueId}`;
               let leagueObject = dataList.find(i => i.LeagueId == leagueId);
               if(leagueObject != null && leagueObject.LeagueIdSource != null)
               {
                  divisionName = leagueObject.LeagueIdSource.DivisionName;
               }
            }
            divisionNameHolder.append(divisionName);
            let filteredDataList = dataList;
            filteredDataList = SortLeaderboardData(filteredDataList, "overall");
            let leader = filteredDataList[0];
            let leaderPoints = leader?.TotalScore || 0;
            
            leaderboardHeaderHolder.append(divisionNameHolder);
            let headerDisplayCountMax = 6;
            let extraTeamCount = 0;
            if(dataList.length < headerDisplayCountMax)
            {
               headerDisplayCountMax = dataList.length;
            }
            else if(dataList.length > headerDisplayCountMax)
            {
               extraTeamCount = (dataList.length - headerDisplayCountMax);
            }

            for(let iIndex = 0; iIndex < headerDisplayCountMax; iIndex++)
            {
               let itemToRender = filteredDataList[iIndex];
               RenderLeaderboardHeaderColumn(itemToRender, leaderPoints, leaderboardHeaderHolder);
            }
            if(extraTeamCount > 0)
            {
               let extraTeamCountHolder = $(`<div class="ranking-leaderboard-extra-teams-found-count-holder"><span class="extra-team-count-label">+${extraTeamCount}</span> Teams</div>`);
               leaderboardHeaderHolder.append(extraTeamCountHolder);
            }
            $(renderToObject, element).append(leaderboardHeaderHolder);

            RenderLeaderboardDetail(callback, leagueId, renderToObject, filteredDataList);
         }
         function RenderLeaderboardHeaderColumn(objectToRender, leaderPointsTotal, renderToObject)
         {
            
            let maxBarHeightInPixels = 200;
            let ownerColumn = $(`<div class="xtreme-league-header-owner-scoring-column" />`);
            let ownerObject = ownerListData.find(u => u.UserId == objectToRender.TeamOwnerUserId);
            if (ownerObject == null) {
               GetUserProfileObject(function (profileObject) {
                  ownerObject = profileObject
               }, objectToRender.TeamOwnerUserId);
            }
            let ownerName = ownerObject?.UserFullName || objectToRender.TeamOwnerUserId;
            ownerAvatarHolder = $(`<div class="xtreme-league-header-owner-avatar-holder" />`);
            let ownerAvatarUrl = ownerObject?.AvatarImageFileName;
            let userAvatarFileName = defaultAvatarUrl;
            if (ownerAvatarUrl != null && ownerAvatarUrl != "" && ownerAvatarUrl != "empty_headshot.png") {
               userAvatarFileName = Global_CleanAvatarUrl(ownerAvatarUrl);
            }
            let userAvatarImage = $(`<img alt="${ownerName} Avatar" height="50" src="${userAvatarFileName}"/>`);
            let ownerNameHolder =  $(`<div class="xtreme-league-header-owner-name-holder" />`);
            let ownerScoreBar = $(`<div class="xtreme-league-header-owner-scoring-bar"/>`);
            let ownerScoreRanking = $(`<div class="xtreme-league-header-owner-ranking-holder">#${objectToRender.OwnerRanking}</div>`);
            let rankImage = rankingImages.find(i => i.rankNumber == objectToRender.OwnerRanking)
            if(rankImage != null)
            {
               ownerScoreRanking = $(`<img alt="${ownerScoreRanking} ribbon" height="50" src="${rankImage.imageUrl}"/>`);;
            }
            ownerAvatarHolder.append(userAvatarImage);

            ownerNameHolder.append(ownerName);
            ownerScoreBar.append(ownerScoreRanking);
            
            let barHeight = 0;
            if(leaderPointsTotal != 0)
            {
               barHeight = (objectToRender.TotalScore / leaderPointsTotal);
            }
            ownerScoreBar.css("height", `${maxBarHeightInPixels * barHeight}px`);
            

            ownerColumn.append(ownerAvatarHolder);
            ownerColumn.append(ownerNameHolder);
            ownerColumn.append(ownerScoreBar);

            $(renderToObject, element).append(ownerColumn);
         }

         function RenderLeaderboardDetail(callback, leagueId, renderToObject, dataList)
         {
            let leaderboardDetailHolder = $(`<div class="xtreme-leaderboard-detail-holder" />`);
            let leaderboardDetailsContainer = $(`<div class="ranking-body-holder" />`);
            RenderLeaderboardDetailColumnHeaders(null, leagueId, leaderboardDetailHolder);
            RenderLeaderboardDetailColumns(leagueId, dataList, leaderboardDetailsContainer);
            
            leaderboardDetailHolder.append(leaderboardDetailsContainer);

            $(renderToObject, element).append(leaderboardDetailHolder);

            if(callback != null)
            {
               callback();
            }
         }
         function RenderLeaderboardDetailColumnHeaders(callback, leagueId, renderToObject){
            let columnHeadersHolder = $(`<div id="xTremeRankingsListingHeader_${leagueId}" class="ranking-header-holder" />`);
            let rankingHeader = $(`<div class="xtreme-owner-ranking-item header-item ranking" id="xtremeRankHeader_${leagueId}">Rank <i class="fa"></i></div>`);
            let ownerNameHeader = $(`<div class="xtreme-owner-ranking-item header-item owner-name" id="xtremeOwnerHeader_${leagueId}">Owner</div>`);
            let perfRatingCountHeader = $(`<div class="xtreme-owner-ranking-item header-item perf-rating-count" id="xtremeRatingsCountScoreHeader_${leagueId}">Ratings <i class="fa"></i></div>`);
            let perfRatingScoreHeader = $(`<div class="xtreme-owner-ranking-item header-item perf-rating-score" id="xtremeRatingScoreHeader_${leagueId}">Agent Rating <i class="fa"></i></div>`);
            let attritHeader = $(`<div class="xtreme-owner-ranking-item header-item attrit-score" id="xtremeAttritionScoreHeader_${leagueId}">Attrition <i class="fa"></i></div>`);
            let engageHeader = $(`<div class="xtreme-owner-ranking-item header-item engage-score" id="xtremeEngagementScoreHeader_${leagueId}">Engagement <i class="fa"></i></div>`);
            let teamScoreHeader = $(`<div class="xtreme-owner-ranking-item header-item team-score" id="xtremeGameScoreHeader_${leagueId}">Game Score <i class="fa"></i></div>`);
            let totalScoreHeader  = $(`<div class="xtreme-owner-ranking-item header-item total-score" id="xtremeTotalScoreHeader_${leagueId}">Total Score</div>`);
            let expanderHeader = $(`<div class="xtreme-owner-ranking-item header-item expander" id="xtremeExpendardHeader_${leagueId}" >&nbsp;</div>`);
            
            let leagueSorterBy = $(`<input type="hidden" id="sortItem_${leagueId}">`);
            let leagueSorterType = $(`<input type="hidden" id="sortType_${leagueId}">`);
            expanderHeader.append(leagueSorterBy);
            expanderHeader.append(leagueSorterType);

            columnHeadersHolder.append(rankingHeader);
            columnHeadersHolder.append(ownerNameHeader);
            columnHeadersHolder.append(perfRatingCountHeader);
            columnHeadersHolder.append(perfRatingScoreHeader);
            columnHeadersHolder.append(attritHeader);
            columnHeadersHolder.append(engageHeader);
            columnHeadersHolder.append(teamScoreHeader);
            columnHeadersHolder.append(totalScoreHeader);
            columnHeadersHolder.append(expanderHeader);

            $(renderToObject, element).append(columnHeadersHolder);

            if(callback != null)
            {
               callback();
            }
         }
         function RenderLeaderboardDetailColumns(leagueId, listToRender, renderToObject)
         {
            let leaderboardDataHolder = $(`<div class="xtreme-owner-ranking-data-holder" />`);
            for (let iIndex = 0; iIndex < listToRender.length; iIndex++) {
                let leaderboardItem = listToRender[iIndex];
               let leaderboardRowHolder = $(`<div class="xtreme-owner-ranking-row" />`);
               if(leaderboardItem.TeamOwnerUserId == legacyContainer.scope.TP1Username)
               {
                  leaderboardRowHolder.addClass("active-user");
               }
               let expanderHolder = $(`<div class="xtreme-owner-ranking-item expander" />`);
               expanderHolder.attr("id", `leaderboardExpander_${leaderboardItem.TeamOwnerUserId}_${leaderboardItem.LeagueId}_${leaderboardItem.OwnerTeamId}`);
               let rankingTrophyHolder = $(`<div class="xtreme-owner-ranking-item ranking-trophy-holder" />`);
               let rankingHolder = $(`<div class="xtreme-owner-ranking-item ranking" />`);
               let ownerNameHolder = $(`<div class="xtreme-owner-ranking-item owner-name" />`);
               let ratingCountHolder = $(`<div class="xtreme-owner-ranking-item perf-rating-count" />`);
               let performanceRatingHolder = $(`<div class="xtreme-owner-ranking-item perf-rating-score" />`);
               let attritionHolder = $(`<div class="xtreme-owner-ranking-item attrit-score" />`);
               let engagementHolder = $(`<div class="xtreme-owner-ranking-item engage-score" />`);
               let teamScoreHolder = $(`<div class="xtreme-owner-ranking-item team-score" />`);
               let totalHolder = $(`<div class="xtreme-owner-ranking-item total-score" />`);

               let detailHolder = $(`<div class="leaderboardDetailsHolder" id="leaderboardDetailsHolder_${leaderboardItem.TeamOwnerUserId}_${leaderboardItem.LeagueId}_${leaderboardItem.OwnerTeamId}" />`);
               RenderScorecardDetails(leaderboardItem.ScorecardDetails, detailHolder);

               let expanderItem = $(`<i class="fa-regular fa-square-plus" id="leaderboardExpanderDisplay_${leaderboardItem.TeamOwnerUserId}_${leaderboardItem.LeagueId}_${leaderboardItem.OwnerTeamId}" />`);

               expanderHolder.off("click").on("click", function () {
                  let id = this.id;
                  let ownerId = id.split("_")[1];
                  let leagueId = id.split("_")[2];
                  let teamId = id.split("_")[3];
                  ToggleDetailsHolder(ownerId, leagueId, teamId);
               });

               expanderHolder.append(expanderItem);

               //rankingHolder.append(leaderboardItem.OwnerRanking);
               rankingHolder.append("&nbsp;");
               let ownerData = GetOwnerDataToRender(leaderboardItem);
               ownerNameHolder.append(ownerData);

               let trophyHolder = $(`<div class="xtreme-owner-ranking-item trophy-holder" />`);
               let trophyImage = `#${leaderboardItem.OwnerRanking}`;
               let rankImage = rankingImages.find(i => i.rankNumber == leaderboardItem.OwnerRanking);
               if(rankImage != null)
               {
                  trophyImage = $(`<img src="${rankImage.imageUrl}" alt="#${leaderboardItem.OwnerRanking}" />`);
               }

               trophyHolder.append(trophyImage);

               rankingTrophyHolder.append(trophyHolder);

               ratingCountHolder.append(leaderboardItem.PerformanceRatingCount);
               performanceRatingHolder.append(`${leaderboardItem.PerformanceRatingScore} / ${leaderboardItem.PerformanceRatingMax}`);
               attritionHolder.append(leaderboardItem.AttritionScore);
               engagementHolder.append(leaderboardItem.EngagementScore);
               teamScoreHolder.append(leaderboardItem.TeamPerformanceScore);
               totalHolder.append(leaderboardItem.TotalScore);

               leaderboardRowHolder.append(rankingTrophyHolder);
               leaderboardRowHolder.append(rankingHolder);
               leaderboardRowHolder.append(ownerNameHolder);
               leaderboardRowHolder.append(ratingCountHolder);
               leaderboardRowHolder.append(performanceRatingHolder);
               leaderboardRowHolder.append(attritionHolder);
               leaderboardRowHolder.append(engagementHolder);
               leaderboardRowHolder.append(teamScoreHolder);
               leaderboardRowHolder.append(totalHolder);
               leaderboardRowHolder.append(expanderHolder);
               leaderboardRowHolder.append(detailHolder);

               leaderboardDataHolder.append(leaderboardRowHolder);
            }
            $(renderToObject, element).append(leaderboardDataHolder);
         }
         /* Render Information END */
         /* Misc Information START */
         function GetOwnerDataToRender(leaderboardItem) {
            let ownerId = leaderboardItem.TeamOwnerUserId;
            let returnInfo = ownerId;

            let ownerObject = ownerListData.find(u => u.UserId == ownerId);

            if (ownerObject == null) {
               GetUserProfileObject(function (profileObject) {
                  ownerObject = profileObject
               }, ownerId);
            }
            let ownerName = ownerObject?.UserFullName || ownerId;
            let ownerAvatarUrl = ownerObject?.AvatarImageFileName;
            let userAvatarFileName = defaultAvatarUrl;

            if (ownerAvatarUrl != null && ownerAvatarUrl != "" && ownerAvatarUrl != "empty_headshot.png") {
               userAvatarFileName = Global_CleanAvatarUrl(ownerAvatarUrl);
            }
            let userAvatarHolder = `<div class="inline-item avatar-holder"><img alt="${ownerName} Avatar" height="25" src="${userAvatarFileName}"/></div>`;

            let teamName = leaderboardItem.OwnerTeamIdSource?.AGameLeagueTeamName || "";

            returnInfo = userAvatarHolder;
            returnInfo += `<div class="inline-item block-name-holder">`;
            returnInfo += `<div class="xtreme-ower-name-holder owner-name-2">${ownerName}</div>`;

            if (teamName != null && teamName != "") {
               returnInfo += `<div class="xtreme-owner-team-name-holder">${teamName}</div>`
            }
            returnInfo += `</div>`;

            return returnInfo;
         }
         function GetWeekDataToRender(leaderboardItem) {
            let weekId = leaderboardItem.WeeksId;
            let returnInfo = weekId;
            let weekObject = weeksInfoData.find(i => i.ScheduleId == weekId);
            if (weekObject == null) {
               GetScheduleDataObject(function (weeksListing) {
                  weekObject = weeksListing.find(i => i.ScheduleId == weekId);
               }, leaderboardItem.LeagueId);
            }
            returnInfo = `Week ${weekObject?.WeekNumber}`;

            return returnInfo;
         }
         function SortList(listToSort, fieldToSort) {
            let sortedList = listToSort;
            switch (fieldToSort.toLowerCase()) {
               case "weekstart".toLowerCase():
                  sortedList = listToSort.sort((a, b) => {
                     if (a.WeekStartDate < b.WeekStartDate) {
                        return -1;
                     }
                     else if (a.WeekStartDate > b.WeekStartDate) {
                        return 1;
                     }
                     else {
                        return 0;
                     }
                  });
                  break;
            }
            return sortedList;
         }

         function SortLeaderboard(callback, itemToSort, itemDisplayId) {
            let sortedList = leaderboardListData;
            let order = "desc";
            let arrowClass = "fa-square-plus";
            if ($("#sortItem", element).val() == itemToSort) {
               let curOrder = $("#sortType", element).val();
               if (curOrder == "desc") {
                  order = "asc";
                  arrowClass = "fa-square-minus";
               }
            }
            $("#sortItem", element).val(itemToSort);
            $("#sortType", element).val(order);

            let aBiggerVal = 1;
            let bBiggerVal = -1;
            if (order == "asc") {
               aBiggerVal = -1;
               bBiggerVal = 1;
            }

            switch (itemToSort.toLowerCase()) {
               case "teamScore".toLowerCase():
                  sortedlist = sortedList.sort((a, b) => {
                     if (a.TeamPerformanceScore > b.TeamPerformanceScore) {
                        return aBiggerVal;
                     }
                     else if (a.TeamPerformanceScore < b.TeamPerformanceScore) {
                        return bBiggerVal;
                     }
                     else {
                        return 0;
                     }
                  });
                  break;
               case "ratingCount".toLowerCase():
                  sortedlist = sortedList.sort((a, b) => {
                     if (a.PerformanceRatingCount > b.PerformanceRatingCount) {
                        return aBiggerVal;
                     }
                     else if (a.PerformanceRatingCount < b.PerformanceRatingCount) {
                        return bBiggerVal;
                     }
                     else {
                        if (a.OwnerRanking < b.OwnerRanking) {
                           return -1
                        }
                        else if (a.OwnerRanking > b.OwnerRanking) {
                           return 1;
                        }
                        else {
                           return 0;
                        }
                     }
                  });
                  break;
               case "ratingScore".toLowerCase():
                  sortedlist = sortedList.sort((a, b) => {
                     if (a.PerformanceRatingScore > b.PerformanceRatingScore) {
                        return aBiggerVal;
                     }
                     else if (a.PerformanceRatingScore < b.PerformanceRatingScore) {
                        return bBiggerVal;
                     }
                     else {
                        if (a.OwnerRanking < b.OwnerRanking) {
                           return -1
                        }
                        else if (a.OwnerRanking > b.OwnerRanking) {
                           return 1;
                        }
                        else {
                           return 0;
                        }
                     }
                  });
                  break;
               case "engagementScore".toLowerCase():
                  sortedlist = sortedList.sort((a, b) => {
                     if (a.EngagementScore > b.EngagementScore) {
                        return aBiggerVal;
                     }
                     else if (a.EngagementScore < b.EngagementScore) {
                        return bBiggerVal;
                     }
                     else {
                        if (a.OwnerRanking < b.OwnerRanking) {
                           return -1
                        }
                        else if (a.OwnerRanking > b.OwnerRanking) {
                           return 1;
                        }
                        else {
                           return 0;
                        }
                     }
                  });
                  break;
               case "attritionScore".toLowerCase():
                  sortedlist = sortedList.sort((a, b) => {
                     if (a.AttritionScore > b.AttritionScore) {
                        return aBiggerVal;
                     }
                     else if (a.AttritionScore < b.AttritionScore) {
                        return bBiggerVal;
                     }
                     else {
                        if (a.OwnerRanking < b.OwnerRanking) {
                           return -1
                        }
                        else if (a.OwnerRanking > b.OwnerRanking) {
                           return 1;
                        }
                        else {
                           return 0;
                        }
                     }
                  });
                  break;
               case "rank".toLowerCase():
                  sortedlist = sortedList.sort((a, b) => {
                     if (a.OwnerRanking > b.OwnerRanking) {
                        return aBiggerVal;
                     }
                     else if (a.OwnerRanking < b.OwnerRanking) {
                        return bBiggerVal;
                     }
                     else {
                        return 0;
                     }
                  });
                  break;
               case "overall".toLowerCase():
               default:
                  sortedlist = sortedList.sort((a, b) => {
                     if (a.OverallRanking > b.OverallRanking) {
                        return aBiggerVal;
                     }
                     else if (a.OverallRanking < b.OverallRanking) {
                        return bBiggerVal;
                     }
                     else {
                        return 0;
                     }
                  });
                  break;
            }
            $(".header-item i", element).each(function () {
               $(this).removeClass("fa-square-plus");
               $(this).removeClass("fa-square-minus");
            });
            RenderXtremeLeaderboard(null, sortedList);
            $("i", $(`#${itemDisplayId}`, element)).addClass(arrowClass);
            if (callback != null) {
               callback();
            }
         }

         function SortLeaderboardData(listToSort, itemToSort) {
            let sortedList = listToSort;
            let aBiggerVal = 1;
            let bBiggerVal = -1;
            // if (order == "asc") {
            //    aBiggerVal = -1;
            //    bBiggerVal = 1;
            // }

            switch (itemToSort.toLowerCase()) {
               case "teamScore".toLowerCase():
                  sortedlist = sortedList.sort((a, b) => {
                     if (a.TeamPerformanceScore > b.TeamPerformanceScore) {
                        return aBiggerVal;
                     }
                     else if (a.TeamPerformanceScore < b.TeamPerformanceScore) {
                        return bBiggerVal;
                     }
                     else {
                        return 0;
                     }
                  });
                  break;
               case "ratingCount".toLowerCase():
                  sortedlist = sortedList.sort((a, b) => {
                     if (a.PerformanceRatingCount > b.PerformanceRatingCount) {
                        return aBiggerVal;
                     }
                     else if (a.PerformanceRatingCount < b.PerformanceRatingCount) {
                        return bBiggerVal;
                     }
                     else {
                        if (a.OwnerRanking < b.OwnerRanking) {
                           return -1
                        }
                        else if (a.OwnerRanking > b.OwnerRanking) {
                           return 1;
                        }
                        else {
                           return 0;
                        }
                     }
                  });
                  break;
               case "ratingScore".toLowerCase():
                  sortedlist = sortedList.sort((a, b) => {
                     if (a.PerformanceRatingScore > b.PerformanceRatingScore) {
                        return aBiggerVal;
                     }
                     else if (a.PerformanceRatingScore < b.PerformanceRatingScore) {
                        return bBiggerVal;
                     }
                     else {
                        if (a.OwnerRanking < b.OwnerRanking) {
                           return -1
                        }
                        else if (a.OwnerRanking > b.OwnerRanking) {
                           return 1;
                        }
                        else {
                           return 0;
                        }
                     }
                  });
                  break;
               case "engagementScore".toLowerCase():
                  sortedlist = sortedList.sort((a, b) => {
                     if (a.EngagementScore > b.EngagementScore) {
                        return aBiggerVal;
                     }
                     else if (a.EngagementScore < b.EngagementScore) {
                        return bBiggerVal;
                     }
                     else {
                        if (a.OwnerRanking < b.OwnerRanking) {
                           return -1
                        }
                        else if (a.OwnerRanking > b.OwnerRanking) {
                           return 1;
                        }
                        else {
                           return 0;
                        }
                     }
                  });
                  break;
               case "attritionScore".toLowerCase():
                  sortedlist = sortedList.sort((a, b) => {
                     if (a.AttritionScore > b.AttritionScore) {
                        return aBiggerVal;
                     }
                     else if (a.AttritionScore < b.AttritionScore) {
                        return bBiggerVal;
                     }
                     else {
                        if (a.OwnerRanking < b.OwnerRanking) {
                           return -1
                        }
                        else if (a.OwnerRanking > b.OwnerRanking) {
                           return 1;
                        }
                        else {
                           return 0;
                        }
                     }
                  });
                  break;
               case "rank".toLowerCase():
                  sortedlist = sortedList.sort((a, b) => {
                     if (a.OwnerRanking > b.OwnerRanking) {
                        return aBiggerVal;
                     }
                     else if (a.OwnerRanking < b.OwnerRanking) {
                        return bBiggerVal;
                     }
                     else {
                        return 0;
                     }
                  });
                  break;
               case "overall".toLowerCase():
               default:
                  sortedlist = sortedList.sort((a, b) => {
                     if (a.OverallRanking > b.OverallRanking) {
                        return aBiggerVal;
                     }
                     else if (a.OverallRanking < b.OverallRanking) {
                        return bBiggerVal;
                     }
                     else {
                        return 0;
                     }
                  });
                  break;
            }
            return sortedList;
         }
         /* Misc Information END */
         /*Show/Hide/Collapse/Toggle*/
         function HideAll() {
            HideRankingRules();
            HideAllDetails();
         }
         function HideAllDetails() {
            $("[id^='leaderboardDetailsHolder_']", element).hide();
         }
         function ToggleDetailsHolder(userId, leagueId, teamId) {
            let isVisible = $(`#leaderboardDetailsHolder_${userId}_${leagueId}_${teamId}`, element).is(":visible");
            if (isVisible == true) {
               HideDetailsHolder(userId, leagueId, teamId);
            }
            else {
               ShowDetailsHolder(userId, leagueId, teamId);
            }
         }
         function HideDetailsHolder(userId, leagueId, teamId) {
            $(`#leaderboardExpanderDisplay_${userId}_${leagueId}_${teamId}`, element).removeClass("fa-square-minus");
            $(`#leaderboardExpanderDisplay_${userId}_${leagueId}_${teamId}`, element).addClass("fa-square-plus");
            $(`#leaderboardDetailsHolder_${userId}_${leagueId}_${teamId}`, element).hide();
         }
         function ShowDetailsHolder(userId, leagueId, teamId) {
            $(`#leaderboardExpanderDisplay_${userId}_${leagueId}_${teamId}`, element).removeClass("fa-square-plus");
            $(`#leaderboardExpanderDisplay_${userId}_${leagueId}_${teamId}`, element).addClass("fa-square-minus");
            $(`#leaderboardDetailsHolder_${userId}_${leagueId}_${teamId}`, element).show();
         }
         function HideRankingRules() {
            $("#leaderboardRankingRulesHolder", element).hide();
         }
         function ShowRankingRules() {
            $("#leaderboardRankingRulesHolder", element).show();
         }
         /*Show/Hide/Collapse/Toggle End*/
         scope.load = function () {
            scope.Initialize();
            LoadXtremeLeaderBoard();
         };
         scope.load();
         ko.postbox.subscribe("aGameXtremeLeaderboardLoad", function () {
            console.log("Loading...");
            scope.load();
         });
         ko.postbox.subscribe("aGameXtremeLeaderboardReload", function () {
            console.log("Reloading...");
            leaderboardListData.length = 0;
            LoadXtremeLeaderBoard();
         });
         ko.postbox.subscribe("Signal", function (so) {
            console.info("Signal Handling.");
         });
      }
   };
}]);
