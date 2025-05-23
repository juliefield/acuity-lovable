angularApp.directive("ngExecutiveScoring", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/EXECDASHBOARD1/view/executiveScoring.htm?' + Date.now(),
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
         let currentScoringData = [];
         const nullScoreDisplayValue = "--";
         const noScoreFoundMessage = "No Scores found.";
         let default1Color = "white";

         scope.Initialize = function () {
            HideAll();
         };

         function LoadCurrentScoringData(forceReload, callback) {
            WriteUserMessage("Loading Current scores...");
            GetCurrentScoringData(forceReload, function (scoringList) {
               RenderCurrentScoringData(scoringList, function () {
                  HideUserMessage();
                  if (callback != null) {
                     callback();
                  }
               });
            });
         }
         
         function GetCurrentScoringData(forceReload, callback) {
            if (forceReload == null) {
               forceReload = false;
            }

            if (!forceReload && currentScoringData != null && currentScoringData.length > 0) {
               if (callback != null) {
                  callback(currentScoringData);
               }
               else {
                  return currentScoringData;
               }
            }
            else {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: true,
                  data: {
                     lib: "selfserve",
                     cmd: "getAllDashboardData",
                     deepload: false
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let currentScoreList = JSON.parse(data.allDashboardData);
                     currentScoringData.length = 0;
                     currentScoringData = currentScoreList;
                     if (callback != null) {
                        callback(currentScoreList);
                     }
                  }
               });
            }
         }
         function RenderCurrentScoringData(listToRender, callback) {
            WriteUserMessage("Rendering current scoring data...");
            if (listToRender == null) {
               listToRender = currentScoringData;
            }
            RenderOverallProjectScore(listToRender);
            $("#eachProjectScore", element).empty();

            let currentProjectScoringHolder = $("<div />");
            if (listToRender != null && listToRender.length > 0) {
               RenderEachProjectScoreData(listToRender, currentProjectScoringHolder);
            }
            else {
               currentProjectScoringHolder.append("No Project data found.");
            }
            $("#eachProjectScore", element).append(currentProjectScoringHolder);

            HideUserMessage();
            HideAllProjectScoringItems();
            if (callback != null) {
               callback();
            }
         }

         function RenderOverallProjectScore(listToSearch) {
            if (listToSearch == null || listToSearch.length == 0) {
               listToSearch = currentScoringData;
            }

            let overallProjectScoreObject = listToSearch.find(p => p.ProjectId == 0 && p.LocationId == null && p.GroupId == null && p.TeamId == null && p.MqfNumber == 0);
            if (overallProjectScoreObject != null) {
               $("#overallProjectScore", element).empty();
               let overallScore = overallProjectScoreObject.ScoreValue;
               $("#overallProjectScore", element).append(overallScore.toFixed(2));
            }

         }

         function RenderEachProjectScoreData(listToRender, objectToRenderTo) {
            if (listToRender == null) {
               listToRender = currentScoringData;
            }

            let curProjectBalancedScores = listToRender.filter(p => p.ProjectId > 0 && p.LocationId == null && p.GroupId == null && p.TeamId == null && p.MqfNumber == 0);
            let projectColor = "white";
            let currentProjectId = 0;

            for (let pIndex = 0; pIndex < curProjectBalancedScores.length; pIndex++) {
               projectColor = "white";
               let projItem = curProjectBalancedScores[pIndex];
               if(projItem.ScoreValue != null)
               {
                  projectColor = legacyContainer.scope.getKPIColorRGB(projItem.ScoreValue).color;
               }
               let projectHolder = $("<div id=\"executiveDashboardProjectHolder_" + projItem.ProjectId + "\" class=\"exec-dashboard-project-info-holder\" />");
               projectHolder.css("background-color", projectColor);

               let projectNameHolder = $("<div class=\"exec-dashboard-data-item-holder project-name\" />");
               projectNameHolder.append(projItem.ProjectName);

               let projectBalScoreHolder = $("<div class=\"exec-dashboard-data-item-holder project-bal-score\" />");
               let projBalScore = projItem.ScoreValue;

               if (projBalScore != null) {
                  projectBalScoreHolder.append(projBalScore.toFixed(2));
               }
               else {
                  projectBalScoreHolder.append(nullScoreDisplayValue);
               }
               let moreStatsHolder = $("<div />");

               let projectLocationStatsHolder = $("<div class=\"exec-dashboard-data-item-holder location-stats-holder\" id=\"executiveDashboardLocationStatsHolder_" + projItem.ProjectId + "\" />");
               AppendLocationStatsToProject(projItem.ProjectId, listToRender, projectLocationStatsHolder);

               let projectGroupStatsHolder = $("<div class=\"exec-dashboard-data-item-holder group-stats-holder\" id=\"executiveDashboardGroupStatsHolder_" + projItem.ProjectId + "\" />");
               AppendGroupStatsToProject(projItem.ProjectId, listToRender, projectGroupStatsHolder);

               let projectTeamStatsHolder = $("<div class=\"exec-dashboard-data-item-holder team-stats-holder\" id=\"executiveDashboardTeamStatsHolder_" + projItem.ProjectId + "\" />");
               AppendTeamStatsToProject(projItem.ProjectId, listToRender, projectTeamStatsHolder);

               moreStatsHolder.append(projectLocationStatsHolder);
               moreStatsHolder.append(projectGroupStatsHolder);
               moreStatsHolder.append(projectTeamStatsHolder);

               let optionsHolder = $("<div />");

               let locationClicker = $("<a id=\"locationClicker_" + projItem.ProjectId + "\">Location</a>");
               locationClicker.on("click", function () {
                  let buttonId = this.id;
                  let id = buttonId.split("_")[1];
                  ToggleScoringSectionForProject("location", id);
               });

               let groupClicker = $("<a id=\"groupClicker_" + projItem.ProjectId + "\">Group</a>");
               groupClicker.on("click", function () {
                  let buttonId = this.id;
                  let id = buttonId.split("_")[1];
                  ToggleScoringSectionForProject("group", id);
               });

               let teamClicker = $("<a id=\"teamClicker_" + projItem.ProjectId + "\">Team</a>");
               teamClicker.on("click", function () {
                  let buttonId = this.id;
                  let id = buttonId.split("_")[1];
                  ToggleScoringSectionForProject("team", id);
               });

               optionsHolder.append(locationClicker);
               optionsHolder.append("&nbsp;|&nbsp;");
               optionsHolder.append(groupClicker);
               optionsHolder.append("&nbsp;|&nbsp;");
               optionsHolder.append(teamClicker);


               projectHolder.append(projectNameHolder);
               projectHolder.append(projectBalScoreHolder);
               projectHolder.append(optionsHolder);
               projectHolder.append(moreStatsHolder);

               $(objectToRenderTo).append(projectHolder);
            }

         }

         function AppendLocationStatsToProject(idToCheck, listToRender, objectToRenderTo) {
            if (listToRender == null) {
               listToRender = currentScoringData;
            }
            let currentLocationBalScores = listToRender.filter(p => p.ProjectId == idToCheck && p.LocationId != null && p.GroupId == null && p.TeamId == null && p.MqfNumber == 0);
            let locationHolderData = $("<div class=\"all-stats-data-holder-location\" />");
            if (currentLocationBalScores.length > 0) {
               for (let lIndex = 0; lIndex < currentLocationBalScores.length; lIndex++) {
                  let locationItem = currentLocationBalScores[lIndex];

                  let locationHolderRow = $("<div class=\"exec-dashboard-location-item-row\" />");
                  let locationNameHolder = $("<div class=\"exec-dashboard-sub-item-holder location-name\" />");
                  let locationScoreHolder = $("<div class=\"exec-dashboard-sub-item-holder location-bal-score\" />");

                  let locationName = locationItem.LocationName;
                  locationNameHolder.append(locationName);

                  let locationScore = locationItem.ScoreValue;
                  if (locationScore != null) {
                     locationScoreHolder.append(locationScore.toFixed(2));
                  }
                  else {
                     locationScoreHolder.append(nullScoreDisplayValue);
                  }

                  locationHolderRow.append(locationNameHolder);
                  locationHolderRow.append(locationScoreHolder);

                  locationHolderData.append(locationHolderRow);
               }
            }
            else {
               locationHolderData.append(noScoreFoundMessage);
            }
            $(objectToRenderTo).append(locationHolderData);
         }

         function AppendGroupStatsToProject(idToCheck, listToRender, objectToRenderTo) {
            if (listToRender == null) {
               listToRender = currentScoringData;
            }

            let currentGroupBalScores = listToRender.filter(p => p.ProjectId == idToCheck && p.LocationId != null && p.GroupId != null && p.TeamId == null && p.MqfNumber == 0);
            let groupHolderData = $("<div class=\"all-stats-data-holder-group\" />");

            if (currentGroupBalScores.length > 0) {
               for (let gIndex = 0; gIndex < currentGroupBalScores.length; gIndex++) {
                  let groupItem = currentGroupBalScores[gIndex];

                  let groupHolderRow = $("<div class=\"exec-dashboard-group-item-row\" />");
                  let groupNameHolder = $("<div class=\"exec-dashboard-sub-item-holder group-name\" />");
                  let groupScoreHolder = $("<div class=\"exec-dashboard-sub-item-holder group-bal-score\" />");

                  let groupName = groupItem.GroupName + " - " + groupItem.LocationName;
                  groupNameHolder.append(groupName);

                  let groupScore = groupItem.ScoreValue;
                  if (groupScore != null) {
                     groupScoreHolder.append(groupScore.toFixed(2));
                  }
                  else {
                     groupScoreHolder.append(nullScoreDisplayValue);
                  }

                  groupHolderRow.append(groupNameHolder);
                  groupHolderRow.append(groupScoreHolder);

                  groupHolderData.append(groupHolderRow);
               }

            }
            else {
               groupHolderData.append(noScoreFoundMessage);
            }


            $(objectToRenderTo).append(groupHolderData);
         }
         function AppendTeamStatsToProject(idToCheck, listToRender, objectToRenderTo) {
            if (listToRender == null) {
               listToRender = currentScoringData;
            }

            let currentTeamBalScores = listToRender.filter(p => p.ProjectId == idToCheck && p.LocationId != null && p.GroupId != null && p.TeamId != null && p.MqfNumber == 0);
            let teamHolderData = $("<div class=\"all-stats-data-holder-team\" />");

            if (currentTeamBalScores.length > 0) {
               for (let tIndex = 0; tIndex < currentTeamBalScores.length; tIndex++) {
                  let teamItem = currentTeamBalScores[tIndex];

                  let teamHolderRow = $("<div class=\"exec-dashboard-team-item-row\" />");
                  let teamNameHolder = $("<div class=\"exec-dashboard-sub-item-holder team-name\" />");
                  let teamScoreHolder = $("<div class=\"exec-dashboard-sub-item-holder team-bal-score\" />");

                  let teamName = teamItem.TeamName + " - " + teamItem.GroupName + " - " + teamItem.LocationName;
                  teamNameHolder.append(teamName);

                  let teamScore = teamItem.ScoreValue;
                  if (teamScore != null) {
                     teamScoreHolder.append(teamScore.toFixed(2));
                  }
                  else {
                     teamScoreHolder.append(nullScoreDisplayValue);
                  }

                  teamHolderRow.append(teamNameHolder);
                  teamHolderRow.append(teamScoreHolder);

                  teamHolderData.append(teamHolderRow);
               }

            }
            else {
               teamHolderData.append(noScoreFoundMessage);
            }

            $(objectToRenderTo).append(teamHolderData);
         }
         function WriteUserMessage(messageToWrite) {
            $("#dashboardLoadingHolder", element).empty();
            $("#dashboardLoadingHolder", element).append(messageToWrite);
            ShowUserMessage();
         }

         function HideAll() {
            HideUserMessage();
         }

         function HideAllProjectScoringItems() {
            $("[id*='StatsHolder_']", element).each(function () {
               $(this).hide();
            });
         }

         function HideUserMessage() {
            $("#dashboardLoadingHolder", element).hide();
         }
         function ShowUserMessage() {
            $("#dashboardLoadingHolder", element).show();
         }
         function ToggleScoringSectionForProject(section, projectId) {
            switch (section) {
               case "location":
                  ToggleLocationScoringForProject(projectId);
                  break;
               case "group":
                  ToggleGroupScoringForProject(projectId);
                  break;
               case "team":
                  ToggleTeamScoringForProject(projectId);
                  break;
            }

         }
         function ToggleLocationScoringForProject(projectId) {
            if ($("#executiveDashboardLocationStatsHolder_" + projectId, element).is(":visible") == true) {
               HideLocationScoringForProject(projectId);
            }
            else {
               ShowLocationScoringForProject(projectId);
            }
         }
         function HideLocationScoringForProject(projectId) {
            $("#executiveDashboardLocationStatsHolder_" + projectId, element).hide();
         }
         function ShowLocationScoringForProject(projectId) {
            $("#executiveDashboardLocationStatsHolder_" + projectId, element).show();
         }

         function ToggleGroupScoringForProject(projectId) {
            if ($("#executiveDashboardGroupStatsHolder_" + projectId, element).is(":visible") == true) {
               HideGroupScoringForProject(projectId);
            }
            else {
               ShowGroupScoringForProject(projectId);
            }
         }
         function HideGroupScoringForProject(projectId) {
            $("#executiveDashboardGroupStatsHolder_" + projectId, element).hide();
         }
         function ShowGroupScoringForProject(projectId) {
            $("#executiveDashboardGroupStatsHolder_" + projectId, element).show();
         }
         function ToggleTeamScoringForProject(projectId) {
            if ($("#executiveDashboardTeamStatsHolder_" + projectId, element).is(":visible") == true) {
               HideTeamScoringForProject(projectId);
            }
            else {
               ShowTeamScoringForProject(projectId);
            }
         }
         function HideTeamScoringForProject(projectId) {
            $("#executiveDashboardTeamStatsHolder_" + projectId, element).hide();
         }
         function ShowTeamScoringForProject(projectId) {
            $("#executiveDashboardTeamStatsHolder_" + projectId, element).show();
         }

         scope.load = function () {
            scope.Initialize();

            LoadCurrentScoringData();
         };
         ko.postbox.subscribe("executiveScoringLoad", function () {
            scope.load();
         });
      }
   };
}]);