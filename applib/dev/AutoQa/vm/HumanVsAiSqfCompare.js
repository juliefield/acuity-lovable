angularApp.directive("ngHumanVsAiSqfCompare", [
  "api",
  "$rootScope",
  function(api, $rootScope) {
    return {
      templateUrl:
        a$.debugPrefix() +
        "/applib/dev/AutoQa/view/HumanVsAISQFCompare.htm?" +
        Date.now(),
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
        userId: "@",
      },
      require: "^ngLegacyContainer",
      link: function(scope, element, attrs, legacyContainer) {
        HideAll();
        let lookupOptions = {
          monitors: [],
          userProfiles: [],
        };
        let displayThresholds = [
          {
            MinValue: 0.0,
            MaxValue: 10.00,
            DisplayClassName: "normal",
          },
          {
            MinValue: 10.01,
            MaxValue: 25.01,
            DisplayClassName: "border-warning",
          },
          {
            MinValue: 25.01,
            MaxValue: 50.0,
            DisplayClassName: "warning",
          },
          {
            MinValue: 50.01,
            MaxValue: 80.00,
            DisplayClassName: "error",
          },
          {
            MinValue: 80.01,
            MaxValue: 1000000,
            DisplayClassName: "major-error",
          },
        ];
        let questionData = [];
        let monitorStatsData = [];
        let monitorHistoryList = [];
        let questionRationaleList = [];
        let sqfCode = 0;
        let monitorsPerPageDiplayCount = 50;

        /* Event Handling START */
        $(".btn-close", element).on("click", function() {
          //TODO: Remove the current information from the popup
          ClearPopupPanel();
          HideFullPopupPanel();
        });
        $(".btn-close-monitor-list", element).on("click", function() {
          ClearMonitorListingPanel();
          HideMonitorListDisplayPanel();
        });
        /* Event Handling END */
        function Initialize() {
          HideAll();
          SetDatePickers();
          LoadPossibleMonitors(null, true);
          $("#monitorListingPerPageItemCount", element).val(
            monitorsPerPageDiplayCount
          );
        }
        function SetDatePickers() { }
        /* Data Loading START */
        function LoadDirective() {
          HideAll();
          ShowOverallLoadingPanel();
          $("#currentMonitorLoadedNameLabel", element).empty();
          let monitorName = GetMonitorName(sqfCode);
          $("#currentMonitorLoadedNameLabel", element).append(monitorName);
          let forceReload = true;

          GetComparisonInformation(function() {
            HideOverallLoadingPanel();
          }, forceReload);
        }
        function LoadPossibleMonitors(callback, forceReload) {
          GetPossibleMonitors(function() {
            if (callback != null) {
              callback();
            }
          }, forceReload);
        }

        function GetPossibleMonitors(callback, forceReload) {
          if (
            lookupOptions != null &&
            lookupOptions.monitors != null &&
            lookupOptions.monitors.length > 0 &&
            forceReload == false
          ) {
            if (callback != null) {
              callback(lookupOptions.monitors);
            } else {
              return lookupOptions.monitors;
            }
          } else {
            a$.ajax({
              type: "POST",
              service: "C#",
              async: false,
              data: {
                lib: "selfserve",
                cmd: "getAllMonitorSqfCodes",
                deepLoad: false,
              },
              dataType: "json",
              cache: false,
              error: a$.ajaxerror,
              success: function(data) {
                let returnData = JSON.parse(data.monitorSqfCodeList);
                lookupOptions.monitors.length = 0;
                returnData.forEach(function(item) {
                  lookupOptions.monitors.push(item);
                });
                if (callback != null) {
                  callback(returnData);
                } else {
                  return returnData;
                }
              },
            });
          }
        }
        function LoadMonitorDisplayPanel(
          callback,
          questionId,
          area,
          responseText
        ) {
          WriteMonitorListBreadcrumbs(questionId, area, responseText);
          GetMonitorList(
            function(dataToRender) {
              RenderPaginationData(null, dataToRender);
              RenderMonitorList(function() {
                GetQuestionRationaleList(
                  function(rationaleList) {
                    RenderResponseRationaleForQuestion(function() {
                      ShowSuggestionsSection();
                      HideMonitorLoadingPanel();
                      if (callback != null) {
                        callback();
                      }
                    }, rationaleList, area);
                  },
                  questionId,
                  responseText
                );
              }, dataToRender);
            },
            questionId,
            area,
            responseText
          );
        }
        function GetComparisonInformation(callback, forceReload) {
          let allGetCompleteStates = {
            StatsComplete: false,
            QuestionInfoComplete: false,
          };
          ShowOverallLoadingPanel();
          GetGeneralStatsForSqfCode(function() {
            RenderGeneralStatsForSqfCode(function() {
              HideOverallLoadingPanel();
              allGetCompleteStates.StatsComplete = true;
            });
          }, forceReload);
          ShowOverallLoadingPanel();
          GetQuestionInformationForSqfCode(function(questionStatData) {
            RenderQuestionComparisonList(function() {
              HideOverallLoadingPanel();
              allGetCompleteStates.QuestionInfoComplete = true;
            }, questionStatData);
          }, forceReload);

          if (allGetCompleteStates.StatsComplete == true && allGetCompleteStates.QuestionInfoComplete == true) {
            if (callback != null) {
              callback();
            }
          }
        }
        function GetGeneralStatsForSqfCode(callback, forceReload) {

          if (forceReload == null) {
            forceReload = false;
          }
          if (
            monitorStatsData != null &&
            monitorStatsData.length > 0 &&
            forceReload == false
          ) {
            if (callback != null) {
              callback(monitorStatsData);
            } else {
              return monitorStatsData;
            }
          } else {
            let startDate = null;
            let endDate = null;
            let projectId = null;
            let locationId = null;
            let groupId = null;
            let teamId = null;
            let userId = null;
            if (legacyContainer.scope.filters != null) {
              startDate = legacyContainer.scope.filters.StartDate;
              endDate = legacyContainer.scope.filters.EndDate;
              projectId = legacyContainer.scope.filters.Project;
              locationId = legacyContainer.scope.filters.Location;
              groupId = legacyContainer.scope.filters.Group;
              teamId = legacyContainer.scope.filters.Team;
              userId = legacyContainer.scope.filters.CSR;
            }
            if (projectId == "all" || projectId == "each") projectId = null;
            if (locationId == "all" || locationId == "each") locationId = null;
            if (groupId == "all" || groupId == "each") groupId = null;
            if (teamId == "all" || teamId == "each") teamId = null;
            if (userId == "all" || userId == "each") userId = null;


            a$.ajax({
              type: "POST",
              service: "C#",
              async: true,
              data: {
                lib: "selfserve",
                cmd: "getMonitorHistoryStatsForSqfCode",
                sqfCode: sqfCode,
                startDate: startDate,
                endDate: endDate
              },
              dataType: "json",
              cache: false,
              error: a$.ajaxerror,
              success: function(data) {
                let returnData = JSON.parse(data.monitorHistoryStats);
                monitorStatsData.length = 0;
                monitorStatsData = returnData;
                if (callback != null) {
                  callback(returnData);
                } else {
                  return returnData;
                }
              },
            });
          }
        }

        function GetQuestionInformationForSqfCode(callback, forceReload) {
          if (forceReload == null) {
            forceReload = false;
          }
          let startDate = null;
          let endDate = null;
          let projectId = null;
          let locationId = null;
          let groupId = null;
          let teamId = null;
          let userId = null;
          if (legacyContainer.scope.filters != null) {
            startDate = legacyContainer.scope.filters.StartDate;
            endDate = legacyContainer.scope.filters.EndDate;
            projectId = legacyContainer.scope.filters.Project;
            locationId = legacyContainer.scope.filters.Location;
            groupId = legacyContainer.scope.filters.Group;
            teamId = legacyContainer.scope.filters.Team;
            userId = legacyContainer.scope.filters.CSR;
          }
          //TODO: Clean this up to make it better??
          //TODO: Handle the each/all values in the filters.
          //need to determine how the "each" value differs on the display
          if (projectId == "all" || projectId == "each") projectId = null;
          if (locationId == "all" || locationId == "each") locationId = null;
          if (groupId == "all" || groupId == "each") groupId = null;
          if (teamId == "all" || teamId == "each") teamId = null;
          if (userId == "all" || userId == "each") userId = null;

          a$.ajax({
            type: "POST",
            service: "C#",
            async: true,
            data: {
              lib: "selfserve",
              cmd: "getMonitorHistoryQuestionStatsForSqfCode",
              sqfCode: sqfCode,
              startDate: startDate,
              endDate: endDate,
              projectId: projectId,
              locationId: locationId,
              groupId: groupId,
              teamId: teamId,
              userId: userId,
            },
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: function(data) {
              let returnData = JSON.parse(data.monitorHistoryQuestionStats);
              questionData.length = 0;
              questionData = returnData;
              if (callback != null) {
                callback(returnData);
              } else {
                return returnData;
              }
            },
          });
        }
        function GetMonitorIdsForRationale(callback, qstName, answerText, rationaleText) {
          a$.ajax({
            type: "POST",
            service: "C#",
            async: false,
            data: {
              lib: "selfserve",
              cmd: "getMonitorIdsForRationaleText",
              qstName: qstName,
              answerText: JSON.stringify(answerText),
              rationaleText: JSON.stringify(rationaleText),
            },
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: function(data) {
              let returnData = JSON.parse(data.monitorIdForRationale);
              if (callback != null) {
                callback(returnData);
              } else {
                return [...returnData];
              }
            },
          });
        }
        /* Data Loading END */
        /* Data Pulls START */
        function GetMonitorList(callback, questionId, area, responseText) {
          let startDate = null;
          let endDate = null;
          let projectId = null;
          let locationId = null;
          let groupId = null;
          let teamId = null;
          let userId = null;
          if (legacyContainer.scope.filters != null) {
            startDate = legacyContainer.scope.filters.StartDate;
            endDate = legacyContainer.scope.filters.EndDate;
            projectId = legacyContainer.scope.filters.Project;
            locationId = legacyContainer.scope.filters.Location;
            groupId = legacyContainer.scope.filters.Group;
            teamId = legacyContainer.scope.filters.Team;
            userId = legacyContainer.scope.filters.CSR;
          }
          if (projectId == "all" || projectId == "each") projectId = null;
          if (locationId == "all" || locationId == "each") locationId = null;
          if (groupId == "all" || groupId == "each") groupId = null;
          if (teamId == "all" || teamId == "each") teamId = null;
          if (userId == "all" || userId == "each") userId = null;

          a$.ajax({
            type: "POST",
            service: "C#",
            async: true,
            data: {
              lib: "selfserve",
              cmd: "getMonitorHistoryInformationForBuckets",
              sqfCode: sqfCode,
              qstName: questionId,
              loadType: area,
              loadValue: responseText,
              startDate: startDate,
              endDate: endDate,
              projectId: projectId,
              locationId: locationId,
              groupId: groupId,
              teamId: teamId,
              userId: userId,
            },
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: function(data) {
              let returnData = JSON.parse(
                data.qmDashboardMonitorHistoryInfoList
              );
              monitorHistoryList.length = 0;
              monitorHistoryList = returnData;
              if (callback != null) {
                callback(returnData);
              } else {
                return returnData;
              }
            },
          });
        }
        function GetQuestionRationaleList(callback, questionId, responseText) {
          let startDate = null;
          let endDate = null;
          let projectId = null;
          let locationId = null;
          let groupId = null;
          let teamId = null;
          let userId = null;
          if (legacyContainer.scope.filters != null) {
            startDate = legacyContainer.scope.filters.StartDate;
            endDate = legacyContainer.scope.filters.EndDate;
            projectId = legacyContainer.scope.filters.Project;
            locationId = legacyContainer.scope.filters.Location;
            groupId = legacyContainer.scope.filters.Group;
            teamId = legacyContainer.scope.filters.Team;
            userId = legacyContainer.scope.filters.CSR;
          }
          if (projectId == "all" || projectId == "each") projectId = null;
          if (locationId == "all" || locationId == "each") locationId = null;
          if (groupId == "all" || groupId == "each") groupId = null;
          if (teamId == "all" || teamId == "each") teamId = null;
          if (userId == "all" || userId == "each") userId = null;

          a$.ajax({
            type: "POST",
            service: "C#",
            async: true,
            data: {
              lib: "selfserve",
              cmd: "getRationaleListForMonitorQuestion",
              sqfCode: sqfCode,
              qstName: questionId,
              answerText: responseText,
              startDate: startDate,
              endDate: endDate,
              projectId: projectId,
              locationId: locationId,
              groupId: groupId,
              teamId: teamId,
              userId: userId,
            },
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: function(data) {
              let returnData = JSON.parse(data.rationaleList);
              questionRationaleList.length = 0;
              questionRationaleList = returnData;
              if (callback != null) {
                callback(returnData);
              } else {
                return returnData;
              }
            },
          });
        }
        //
        /* Data Pulls END */
        /* Data Rendering START */
        function RenderQuestionComparisonList(callback, listToRender) {
          if (listToRender == null) {
            listToRender = questionData;
          }
          $("#monitorQuestionComparisonListHolder", element).empty();
          let questionComparisonHolder = $(
            `<div class="question-comparison-holder" />`
          );
          RenderQuestionComparisonTableHeader(null, questionComparisonHolder);
          RenderQuestionComparisonTableBody(
            null,
            questionComparisonHolder,
            listToRender
          );
          RenderQuestionComparisonTableFooter(null, questionComparisonHolder);

          $("#monitorQuestionComparisonListHolder", element).append(
            questionComparisonHolder
          );
          if (callback != null) {
            callback();
          }
        }
        function RenderQuestionComparisonTableHeader(callback, renderToObject) {
          let comparisonTableHeaderHolder = $(
            `<div class="comparison-table-header-holder" />`
          );
          let questionNumberHolder = $(
            `<div class="comparison-data-item question-number header-item" />`
          );
          let questionTextHolder = $(
            `<div class="comparison-data-item question-text header-item" />`
          );
          let teamMemberStatsHolder = $(
            `<div class="comparison-data-item team-member-stats header-item" />`
          );
          let aiStatsHolder = $(
            `<div class="comparison-data-item ai-stats header-item" />`
          );
          let diffStatsHolder = $(
            `<div class="comparison-data-item diff-stats header-item" />`
          );
          let totalStatsHolder = $(
            `<div class="comparison-data-item total-stats header-item" />`
          );
          let buttonHolder = $(
            `<div class="comparison-data-item button-holder header-item" />`
          );

          questionNumberHolder.append(`#`);
          questionTextHolder.append(`Question Text`);
          teamMemberStatsHolder.append("Team Member Stats");
          aiStatsHolder.append("AI Stats");
          diffStatsHolder.append("Stats Difference");
          totalStatsHolder.append("Overall Stats");
          buttonHolder.append("&nbsp;");

          comparisonTableHeaderHolder.append(questionNumberHolder);
          comparisonTableHeaderHolder.append(questionTextHolder);
          comparisonTableHeaderHolder.append(teamMemberStatsHolder);
          comparisonTableHeaderHolder.append(aiStatsHolder);
          comparisonTableHeaderHolder.append(diffStatsHolder);
          comparisonTableHeaderHolder.append(totalStatsHolder);
          comparisonTableHeaderHolder.append(buttonHolder);

          $(renderToObject).append(comparisonTableHeaderHolder);
          if (callback != null) {
            callback();
          }
        }
        function RenderQuestionComparisonTableBody(
          callback,
          renderToObject,
          listToRender
        ) {
          if (listToRender == null) {
            listToRender = questionData;
          }
          let comparisonTableBodyHolder = $(
            `<div class="comparison-table-body-holder" />`
          );
          listToRender.forEach(function(questionItem) {
            let questionRowHolder = $(
              `<div class="comparison-question-row-holder" id="PossibleQuestionRow_${questionItem.DisplayOrder}" sqfCode="${questionItem.SqfCode}" />`
            );
            let questionNumberHolder = $(
              `<div class="comparison-data-item question-number" id="PossibleQuestionNumber_${questionItem.DisplayOrder}" sqfCode="${questionItem.SqfCode}" />`
            );
            questionNumberHolder.append(
              `${questionItem.DisplayOrder} (${questionItem.QstName})`
            );
            let questionTextHolder = $(
              `<div class="comparison-data-item question-text" id="PossibleQuestionText_${questionItem.DisplayOrder}" sqfCode="${questionItem.SqfCode}" />`
            );
            questionTextHolder.append(questionItem.Text);
            let teamMemberStatsHolder = $(
              `<div class="comparison-data-item team-member-stats-item team-member-stats" sqfCode="${questionItem.SqfCode}" />`
            );
            RenderResponseInformationForQuestion(
              null,
              teamMemberStatsHolder,
              "Manual",
              questionItem.PossibleResponses
            );
            let aiStatsHolder = $(
              `<div class="comparison-data-item ai-stats-item ai-stats" sqfCode="${questionItem.SqfCode}" />`
            );
            RenderResponseInformationForQuestion(
              null,
              aiStatsHolder,
              "AI",
              questionItem.PossibleResponses
            );
            let diffStatsHolder = $(
              `<div class="comparison-data-item diff-stats" sqfCode="${questionItem.SqfCode}" />`
            );
            RenderResponseDiffInformationForQuestion(
              null,
              diffStatsHolder,
              questionItem.PossibleResponses
            );
            let totalStatsHolder = $(
              `<div class="comparison-data-item total-stats-item total-stats" sqfCode="${questionItem.SqfCode}" />`
            );
            RenderResponseInformationForQuestion(
              null,
              totalStatsHolder,
              "Overall",
              questionItem.PossibleResponses
            );

            let buttonHolder = $(
              `<div class="comparison-data-item button-holder" sqfCode="${questionItem.SqfCode}" />`
            );
            let actionButton1 = $(
              `<button class="button btn action-button"><i class="fa-solid fa-pen-to-square"></i></button>`
            );
            let actionButton2 = $(
              `<button class="button btn action-button btn-delete"><i class="fa-solid fa-trash-can"></i></button>`
            );
            let actionButton3 = $(
              `<button class="button btn action-button"><i class="fa-solid fa-arrow-rotate-right"></i></button>`
            );

            actionButton1.on("click", function() {
              alert("COMING SOON.\nAction 1");
              console.log("Do Action 1");
            });
            actionButton2.on("click", function() {
              alert(`COMING SOON.\nAction 2`);
              console.log("Do Action 2");
            });
            actionButton3.on("click", function() {
              alert("COMING SOON.\nAction 3");
              console.log("Do Action 3");
            });

            buttonHolder.append(actionButton1);
            buttonHolder.append("&nbsp;");
            buttonHolder.append(actionButton2);
            buttonHolder.append("&nbsp;");
            buttonHolder.append(actionButton3);

            questionRowHolder.append(questionNumberHolder);
            questionRowHolder.append(questionTextHolder);
            questionRowHolder.append(teamMemberStatsHolder);
            questionRowHolder.append(aiStatsHolder);
            questionRowHolder.append(diffStatsHolder);
            questionRowHolder.append(totalStatsHolder);
            questionRowHolder.append(buttonHolder);

            comparisonTableBodyHolder.append(questionRowHolder);
          });

          $(renderToObject).append(comparisonTableBodyHolder);

          if (callback != null) {
            callback();
          }
        }
        function RenderQuestionComparisonTableFooter(callback, renderToObject) {
          let comparisonTableFooterHolder = $(
            `<div class="comparison-table-footer-holder" />`
          );
          comparisonTableFooterHolder.append("&nbsp;");
          $(renderToObject).append(comparisonTableFooterHolder);
          if (callback != null) {
            callback();
          }
        }
        function RenderGeneralStatsForSqfCode(callback) {
          let monitorStatus = "--";
          let totalMonitors = 0;
          let mostRecentEntryDate = null;
          let firstEntryDate = null;
          let overallAverageScore = "--";
          let aiAverageScore = "--";
          let aiEntries = "--";
          let manualEntryAverageScore = "--";
          let manualEntries = "--";
          let totalMonitorsInTimeframe = 0;
          let timeframeMonitorAverageScore = "--";

          if (monitorStatsData != null) {
            let overallDataObject = monitorStatsData.find(
              (i) =>
                i.Area.toLowerCase() == "Overall".toLowerCase() &&
                i.SqfCode == sqfCode
            );
            if (overallDataObject != null) {
              monitorStatus = overallDataObject.MonitorStatus;
              totalMonitors = overallDataObject.TotalMonitorCount;
              totalMonitorsInTimeframe =
                overallDataObject.MonitorCountForTimeFrame;

              if (overallDataObject.MonitorForTimeFrameAverageScore != null) {
                timeframeMonitorAverageScore =
                  overallDataObject.MonitorForTimeFrameAverageScore.toFixed(2);
              }

              if (overallDataObject.OverallAverageScore != null) {
                overallAverageScore =
                  overallDataObject.OverallAverageScore.toFixed(2);
              }
              if (overallDataObject.MostRecentEntryDate != null) {
                mostRecentEntryDate = new Date(
                  overallDataObject.MostRecentEntryDate
                ).toLocaleDateString();
              }
              if (overallDataObject.FirstEntryDate != null) {
                firstEntryDate = new Date(
                  overallDataObject.FirstEntryDate
                ).toLocaleDateString();
              }
            }
            let aiDataObject = monitorStatsData.find(
              (i) => i.Area.toLowerCase() == "AI".toLowerCase()
            );
            if (aiDataObject != null) {
              aiAverageScore = aiDataObject.OverallAverageScore?.toFixed(2);
              aiEntries = aiDataObject.TotalMonitorCount;
            }
            let manualDataObject = monitorStatsData.find(
              (i) => i.Area.toLowerCase() == "Manual".toLowerCase()
            );
            if (manualDataObject != null) {
              manualEntryAverageScore =
                manualDataObject.OverallAverageScore?.toFixed(2);
              manualEntries = manualDataObject.TotalMonitorCount;
            }
          }
          $("#lblMonitorStatusData", element).empty();
          $("#lblMonitorStatusData", element).append(monitorStatus);
          // $("#lblTotalMonitorCount", element).empty();
          // $("#lblTotalMonitorCount", element).append(totalMonitors);
          $("#lblManualEntryMonitorCount", element).empty();
          $("#lblManualEntryMonitorCount", element).append(
            `${manualEntries} (avg. score ${manualEntryAverageScore}%)`
          );
          $("#lblAiEntryMonitorCount", element).empty();
          $("#lblAiEntryMonitorCount", element).append(
            `${aiEntries} (avg. score ${aiAverageScore}%)`
          );

          $("#lblMonitorRecentEntryDate", element).empty();
          $("#lblMonitorRecentEntryDate", element).append(mostRecentEntryDate);

          $("#lblMonitorFirstEntryDate", element).empty();
          $("#lblMonitorFirstEntryDate", element).append(firstEntryDate);

          // $("#lblMonitorOverallAverageScore", element).empty();
          // $("#lblMonitorOverallAverageScore", element).append(
          //   `${overallAverageScore}%`,
          // );
          $("#lblTotalMonitorsInTimeframe", element).empty();
          $("#lblTotalMonitorsInTimeframe", element).append(
            `${totalMonitorsInTimeframe} (avg. Score ${timeframeMonitorAverageScore}%)`
          );
          $("#lblAllTimeMonitorsEntered", element).empty();
          $("#lblAllTimeMonitorsEntered", element).append(
            `${totalMonitors} (avg. Score ${overallAverageScore}%)`
          );
          if (callback != null) {
            callback();
          }
        }
        function RenderMonitorList(callback, listToRender) {
          if (listToRender == null) {
            listToRender = monitorHistoryList;
          }
          $("#monitorListingHolder", element).empty();
          let monitorsAvailableHolding = $(
            `<div class="monitors-information-listing-holder data-detail-list-holder" />`
          );
          let sortedList = SortMonitorListArray(listToRender, "Score");

          sortedList.forEach(function(monitorHistoryItem) {
            let monitorHistoryRow = $(
              `<div class="monitor-history-information-row data-detail-list-row" id="monitorHistoryRow_${monitorHistoryItem.MonitorId}" monitorId="${monitorHistoryItem.MonitorId}" />`
            );

            let monitorLink = $(
              `<a target="_blank" href="https://${a$.urlprefix(
                true
              )}acuityapm.com/monitor/monitor_review.aspx?prefix=${a$
                .urlprefix()
                .replace(".", "")}&id=${monitorHistoryItem.MonitorId
              }" class="auto-qa-link monitor-link" >${monitorHistoryItem.MonitorId
              }</a>`
            );
            let monitorIdHolder = $(
              `<div class="data-detail-column monitor-link" />`
            );
            monitorIdHolder.append(monitorLink);

            let monitorForHolder = $(
              `<div class="data-detail-column agent-name" />`
            );
            let monitorForName = monitorHistoryItem.AgentUserId;
            //TODO: Add avatar in.
            if (monitorHistoryItem.AgentUserIdSource != null) {
              monitorForName =
                monitorHistoryItem.AgentUserIdSource.UserFullName;
            }
            monitorForHolder.append(monitorForName);

            let monitorEvaluatorNameHolder = $(
              `<div class="data-detail-column evaluator-name" />`
            );
            let evaluatorName = monitorHistoryItem.EvaluatorUserId;
            //TODO: Add avatar in.
            if (monitorHistoryItem.EvaluatorUserIdSource != null) {
              evaluatorName =
                monitorHistoryItem.EvaluatorUserIdSource.UserFullName;
            }
            monitorEvaluatorNameHolder.append(evaluatorName);

            let monitorScoreHolder = $(
              `<div class="data-detail-column monitor-score" />`
            );
            monitorScoreHolder.append(
              `${monitorHistoryItem.MonitorScore.toFixed(2)}%`
            );

            let monitorCallIdHolder = $(
              `<div class="data-detail-column call-id" />`
            );
            monitorCallIdHolder.append(monitorHistoryItem.CallId);
            let monitorCallDateHolder = $(
              `<div class="data-detail-column call-date" />`
            );
            monitorCallDateHolder.append(
              new Date(monitorHistoryItem.CallDate).toLocaleDateString()
            );
            let monitorEntryDateHolder = $(
              `<div class="data-detail-column monitor-enter-date" />`
            );
            monitorEntryDateHolder.append(
              new Date(monitorHistoryItem.EnterDate).toLocaleDateString()
            );

            monitorHistoryRow.append(monitorIdHolder);
            monitorHistoryRow.append(monitorEntryDateHolder);
            monitorHistoryRow.append(monitorScoreHolder);
            monitorHistoryRow.append(monitorForHolder);
            monitorHistoryRow.append(monitorEvaluatorNameHolder);
            monitorHistoryRow.append(monitorCallDateHolder);
            monitorHistoryRow.append(monitorCallIdHolder);

            monitorsAvailableHolding.append(monitorHistoryRow);
          });

          $("#monitorListingHolder", element).append(monitorsAvailableHolding);
          if (callback != null) {
            callback();
          }
        }
        function RenderResponseInformationForQuestion(
          callback,
          renderToObject,
          areaToRender,
          possibleResponseObject
        ) {
          possibleResponseObject.forEach(function(responseOption) {
            let responseOptionHolder = $(
              `<div class="possible-response-item-holder" />`
            );
            let responseOptionTextHolder = $(
              `<div class="possible-response-text-holder" />`
            );
            responseOptionTextHolder.append(responseOption.Text);
            let responseOptionValueHolder = $(
              `<div class="possible-response-value-holder" />`
            );
            let valueDataObject = responseOption.StatValues.find(
              (stat) =>
                stat.StatArea.toLowerCase() == areaToRender.toLowerCase()
            );
            let removeLinkOption = false;
            let responseOptionValueLink = $(
              `<a class="possible-response-value-link" qstNum="${responseOption.QstName}" area="${areaToRender}" resp="${responseOption.Text}" />`
            );
            let displayValue = 0.0;
            if (valueDataObject != null) {
              displayValue = valueDataObject.PercentageValueFormatted;
              if (valueDataObject.PercentageValueFormatted == null) {
                displayValue = "--";
                removeLinkOption = true;
              }
            }
            if (removeLinkOption == true) {
              responseOptionValueLink = $(
                `<div class="possible-response-value-link" />`
              );
            } else {
              responseOptionValueLink.on("click", function() {
                let questionId = $(this).attr("qstNum");
                let area = $(this).attr("area");
                let responseText = $(this).attr("resp");
                ShowMonitorListDisplayPanel();
                ShowMonitorLoadingPanel();
                LoadMonitorDisplayPanel(null, questionId, area, responseText);
              });
            }
            responseOptionValueLink.append(displayValue);

            responseOptionValueHolder.append(responseOptionValueLink);

            responseOptionHolder.append(responseOptionTextHolder);
            responseOptionHolder.append(responseOptionValueHolder);

            $(renderToObject).append(responseOptionHolder);
          });
          if (callback != null) {
            callback();
          }
        }
        function RenderResponseDiffInformationForQuestion(
          callback,
          renderToObject,
          possibleResponseObject
        ) {
          possibleResponseObject.forEach(function(responseOption) {
            let threshholdLevelClass = "";

            let responseOptionHolder = $(
              `<div class="possible-response-item-holder" />`
            );
            let responseOptionTextHolder = $(
              `<div class="possible-response-text-holder" />`
            );
            responseOptionTextHolder.append(responseOption.Text);
            let responseOptionValueHolder = $(
              `<div class="possible-response-value-holder" />`
            );
            let valueDataObject = responseOption.StatValues.find(
              (stat) => stat.StatArea.toLowerCase() == "Manual".toLowerCase()
            );

            let displayValue = 0.0;
            if (valueDataObject != null) {
              threshholdLevelClass = GetDifferenceThreshholdLevel(
                Math.abs(valueDataObject.DiffValueRaw)
              );
              responseOptionHolder.addClass(threshholdLevelClass);
              displayValue = valueDataObject.DiffValueFormatted;
            }
            responseOptionValueHolder.append(displayValue);

            responseOptionHolder.append(responseOptionTextHolder);
            responseOptionHolder.append(responseOptionValueHolder);

            $(renderToObject).append(responseOptionHolder);
          });

          if (callback != null) {
            callback();
          }
        }
        function WriteMonitorListBreadcrumbs(question, area, response) {
          $("#monitorListingBreadcrumbs", element).empty();

          let breadcrumbHolder = $(
            `<div class="monitor-list-breadcrumb-holder ${area.toLowerCase()}-stats-item" />`
          );
          let questionText = question;
          let questionObject = questionData.find((i) => i.QstName == question);
          if (questionObject != null) {
            questionText = questionObject.Text;
          }
          breadcrumbHolder.append(
            `(${area} Entry) - "<i>${questionText}</i>" > "<b>${response}</b>"`
          );

          $("#monitorListingBreadcrumbs", element).append(breadcrumbHolder);
        }
        function RenderPaginationData(callback, listData) {
          console.log("RenderPaginationData(callback, listData)");
          // let totalRecordsFound = listData?.length || 0;
          // $("#monitorListingRecordCountDisplay", element).empty();
          // $("#monitorListingRecordCountDisplay", element).append(`${totalRecordsFound} Records found.`);

          // let totalPages = CalculateTotalPages(totalRecordsFound);
          // $("#lblMonitorListingTotalPages", element).empty();
          // $("#lblMonitorListingTotalPages", element).append(totalPages);

          // let currentPage = 1;
          // $("#txtMonitorListingCurrentPageNumber", element).empty();
          // $("#txtMonitorListingCurrentPageNumber", element).val(currentPage);

          //DetermineCurrentPage
          if (callback != null) {
            callback();
          }
        }
        function RenderResponseRationaleForQuestion(callback, listToRender, responseType) {
          if (listToRender == null) {
            listToRender = questionRationaleList?.filter(
              (i) => i.SqfCode == sqfCode
            );
          }
          $("#reasonSuggestionsInformationHolder", element).empty();
          if (responseType.toLowerCase() != "Manual".toLowerCase()) {
            listToRender.forEach(function(rationaleItem) {
              let rationaleItemRow = $(`<div class="rationale-text-item-row-holder" />`); 1
              let rationaleTextHolder = $(`<div class="rationale-text-data-item rationale-text" />`);
              rationaleTextHolder.append(rationaleItem.RationaleText);
              let rationaleCounterHolder = $(`<div class="rationale-text-data-item rationale-count" />`);
              rationaleCounterHolder.append(rationaleItem.RationaleCount);
              let rationaleSelectionHolder = $(`<div class="rationale-text-data-item rationale-selector" id="rationaleSelector_${rationaleItem.RecordId}" />`);
              let rationaleSelectionDisplay = $(`<i class="fa-regular fa-circle"  id="rationaleSelectorDisplay_${rationaleItem.RecordId}">&nbsp;</i>`);

              rationaleSelectionHolder.on("click", function() {
                let buttonId = this.id;
                let recordId = buttonId.split("_")[1];
                FindAndMarkRationaleInformation(null, recordId);

              });

              rationaleSelectionHolder.append(rationaleSelectionDisplay);

              rationaleItemRow.append(rationaleTextHolder);
              rationaleItemRow.append(rationaleCounterHolder);
              rationaleItemRow.append(rationaleSelectionHolder);

              $("#reasonSuggestionsInformationHolder", element).append(rationaleItemRow);
            });
          }
          else {
            $("#reasonSuggestionsInformationHolder", element).append("Rationale information not available for Manual entry types.");
          }

          if (callback != null) {
            callback();
          }
        }
        /* Data Rendering END */
        /* Editor Loading START */
        /* Editor Loading END */
        /* Editor Validation & Saving START */
        /* Editor Validation & Saving END */
        /* Sorting Options START */
        /* Sorting Options END */
        /* Utility Functions START */
        function ClearPopupPanel(callback) {
          $("#monitorQuestionComparisonListHolder", element).empty();
          $("#currentMonitorLoadedNameLabel", element).empty();
          $("#monitorListingRecordCountDisplay", element).empty();

          ClearMonitorStatsPanel();
          ClearMonitorListingPanel();

          if (callback != null) {
            callback();
          }
        }
        function GetMonitorName(sqfCodeToLoad) {
          let monitorName = "";
          let monitorObject = lookupOptions.monitors?.find(
            (i) => i.SqfCode == sqfCodeToLoad
          );
          monitorName = monitorObject?.SqfName || sqfCodeToLoad;
          return monitorName;
        }
        function ClearMonitorStatsPanel() {
          $("#lblMonitorStatusData", element).empty();
          $("#lblTotalMonitorCount", element).empty();
          $("#lblManualEntryMonitorCount", element).empty();
          $("#lblAiEntryMonitorCount", element).empty();
          $("#lblMonitorRecentEntryDate", element).empty();
          $("#lblMonitorFirstEntryDate", element).empty();
          $("#lblMonitorOverallAverageScore", element).empty();
          $("#lblManualEntryMonitorCount", element).empty();
          $("#lblTotalMonitorsInTimeframe", element).empty();
          $("#lblAllTimeMonitorsEntered", element).empty();

          $("#lblMonitorStatusData", element).append("--");
          $("#lblTotalMonitorCount", element).append("--");
          $("#lblMonitorRecentEntryDate", element).append("--");
          $("#lblMonitorFirstEntryDate", element).append("--");
          $("#lblMonitorOverallAverageScore", element).append("--");
          $("#lblManualEntryMonitorCount", element).append("--");
          $("#lblTotalMonitorsInTimeframe", element).append("--");
          $("#lblAllTimeMonitorsEntered", element).append("--");
          // monitorStatsData.length = 0;
          // monitorHistoryList.length =0;
        }
        function ClearMonitorListingPanel(callback) {
          $("#monitorListingHolder", element).empty();
          $("#reasonSuggestionsInformationHolder", element).empty();
          if (callback != null) {
            callback();
          }
        }
        function GetDifferenceThreshholdLevel(diffValue) {
          let returnDisplayClass = "normal";
          if (diffValue != null) {
            diffValue = parseFloat(diffValue).toFixed(2);
          }
          let displayThreshholdLevel = displayThresholds.find(
            (i) => i.MinValue <= diffValue && diffValue <= i.MaxValue
          );
          if (displayThreshholdLevel != null) {
            returnDisplayClass = displayThreshholdLevel.DisplayClassName;
          }
          return returnDisplayClass;
        }
        function SortMonitorListArray(listToSort, sortBy) {
          let sortedList = listToSort;
          sortedList = sortedList.sort((a, b) => {
            return a.MonitorScore - b.MonitorScore;
          });
          return sortedList;
        }
        function CalculateTotalPages(recordCount) {
          if (recordCount == 0) {
            return 0;
          }
          let selectedPerPageDisplay = parseInt(
            $("#monitorListingPerPageItemCount", element).val()
          );
          if (recordCount <= selectedPerPageDisplay) {
            return 1;
          } else {
            return Math.ceil(recordCount / selectedPerPageDisplay);
          }
        }

        function FindAndMarkRationaleInformation(callback, recordId) {
          let rationaleObject = questionRationaleList?.find(i => i.RecordId == recordId);
          let monitorIdList = [];
          if (rationaleObject != null) {
            GetMonitorIdsForRationale(function(monData) {
              monData.forEach(function(m) {
                monitorIdList.push(m);
              });
            }, rationaleObject.QstName, rationaleObject.AnswerText, rationaleObject.RationaleText);
          }
          let displayId = `rationaleSelectorDisplay_${recordId}`;
          if ($(`[id='${displayId}']`).hasClass("fa-circle")) {
            $(`[id='${displayId}']`).removeClass("fa-circle");
            $(`[id='${displayId}']`).addClass("fa-circle-check");

            let rValue = parseInt(Math.floor(Math.random() * 256));
            let gValue = parseInt(Math.floor(Math.random() * 256));
            let bValue = parseInt(Math.floor(Math.random() * 256));
            let coloring = `rgba(${rValue}, ${gValue}, ${bValue}, 1)`;
            $(`[id='${displayId}']`).css("color", coloring);

            for (let mIndex = 0; mIndex < monitorIdList.length; mIndex++) {
              let monId = monitorIdList[mIndex];
              $(`#monitorHistoryRow_${monId}`, element).css("background-color", coloring);
            }
          }
          else if ($(`[id='${displayId}']`).hasClass("fa-circle-check")) {
            $(`[id='${displayId}']`).removeClass("fa-circle-check");
            $(`[id='${displayId}']`).addClass("fa-circle");
            $(`[id='${displayId}']`).css("color", "var(--slate)");
            for (let mIndex = 0; mIndex < monitorIdList.length; mIndex++) {
              let monId = monitorIdList[mIndex];
              $(`#monitorHistoryRow_${monId}`, element).css("background-color", "");
            }
          }

          if (callback != null) {
            callback();
          }
        }
        /* Utility Functions END */
        /* Show/Hide START */
        function HideAll() {
          HideFullPopupPanel();
          HideMonitorListDisplayPanel();
          HideOverallLoadingPanel();
          HideMonitorLoadingPanel();
          HideSuggestionsSection();
        }
        function HideFullPopupPanel() {
          $("#sqfComparisonHolderPopupPanel", element).hide();
        }
        function ShowFullPopupPanel() {
          $("#sqfComparisonHolderPopupPanel", element).show();
        }
        function HideMonitorListDisplayPanel() {
          $("#sqfComparisonMonitorListDisplayPanel", element).hide();
        }
        function ShowMonitorListDisplayPanel() {
          $("#sqfComparisonMonitorListDisplayPanel", element).show();
        }
        function HideOverallLoadingPanel() {
          $("#comparisonToolOverallLoadingPanel", element).hide();
        }
        function ShowOverallLoadingPanel() {
          $("#comparisonToolOverallLoadingPanel", element).show();
        }
        function HideMonitorLoadingPanel() {
          $("#comparisonToolMonitorLoadingPanel", element).hide();
        }
        function ShowMonitorLoadingPanel() {
          $("#comparisonToolMonitorLoadingPanel", element).show();
        }
        function HideSuggestionsSection() {
          $("#reasonSuggestionsInformationHolder", element).hide();
        }
        function ShowSuggestionsSection() {
          $("#reasonSuggestionsInformationHolder", element).show();
        }
        /* Show/Hide END */
        scope.load = function() {
          Initialize();
          LoadDirective();
        };
        ko.postbox.subscribe("autoQaLoad", function() {
          Initialize();
          monitorStatsData.length = 0;
          monitorHistoryList.length = 0;
          questionData.length = 0;
        });
        ko.postbox.subscribe("qmDashboardLoadData", function() {
          Initialize();
          monitorStatsData.length = 0;
          monitorHistoryList.length = 0;
          questionData.length = 0;
        });
        ko.postbox.subscribe(
          "HumanAICompareSqfCode",
          function(reportingSqfCode) {
            sqfCode = reportingSqfCode;
            monitorStatsData.length = 0;
            monitorHistoryList.length = 0;
            questionData.length = 0;
            questionRationaleList.length = 0;
            LoadDirective();
            ShowFullPopupPanel();
          }
        );
      },
    };
  },
]);
