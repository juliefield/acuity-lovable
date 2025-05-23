angularApp.directive("ngHumanVsAiScoreCompare", [
  "api",
  "$rootScope",
  function (api, $rootScope) {
    return {
      templateUrl:
        a$.debugPrefix() +
        "/applib/dev/AutoQa/view/HumanVsAiScoreCompare.htm?" +
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
      link: function (scope, element, attrs, legacyContainer) {
        HideAll();
        let initialData = [];
        let userEntryData = [];
        let cachedRenderedObjects = {
          projects: [],
          locations: [],
          groups: [],
          teams: [],
          userProfiles: [],
        };
        /* Page Level data information START */
        const defaultLoadingImageUrl = `${a$.debugPrefix()}/applib/css/images/acuity-loading.gif`;
        /* Page Level data information END */
        /* Event Handling START */
        /* Event Handling END */
        function Initialize() {
          $(".directive-information-loading-image", element).prop(
            "src",
            defaultLoadingImageUrl
          );
          $("#currentSortValue", element).val("");
          $("#currentSortOrder", element).val("");

          HideAll();
          SetDatePickers();
          RenderDirectiveFooter();
        }
        function SetDatePickers() {}
        /* Data Loading START */
        function LoadDirective() {
          HideAll();
          LoadHumanVsAiInformation();
        }
        function LoadHumanVsAiInformation(callback, forceReload) {
          ShowLoadingMessage();
          GetHumanVsAiCompareInformation(function (data) {
            RenderHumanVsAiCompareInformation(function () {
              HideLoadingMessage();
              if (callback != null) {
                callback();
              }
            }, data);
          }, forceReload);
        }
        function LoadMonitorFormInformation(callback, sqfCodeToLoad) {
          GetMonitorFormUserEntryInformation(function (dataToRender) {
            RenderMonitorFormInformation(function () {
              if (callback != null) {
                callback();
              }
            }, sqfCodeToLoad);
          }, sqfCodeToLoad);
        }

        /* Data Loading END */
        /* Data Pulls START */
        function GetHumanVsAiCompareInformation(callback, forceReload) {
          if (forceReload == null) {
            forceReload = false;
          }
          if (
            forceReload == false &&
            initialData != null &&
            initialData.length > 0
          ) {
            if (callback != null) {
              callback(initialData);
            } else {
              return initialData;
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
                cmd: "getAutoQaDashboardScoreCompareData",
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
              success: function (data) {
                let returnData = JSON.parse(data.autoQaDashboardCompareData);
                initialData = returnData;
                if (callback != null) {
                  callback(returnData);
                } else {
                  return returnData;
                }
              },
            });
          }
        }
        function GetMonitorFormUserEntryInformation(callback, sqfCode) {
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
              cmd: "getQMDashboardUserFormEntryStats",
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
            success: function (data) {
              let returnData = JSON.parse(data.userEntryStatsList);
              userEntryData = returnData;
              if (callback != null) {
                callback(returnData);
              } else {
                return returnData;
              }
            },
          });
        }
        /* Data Pulls END */
        /* Data Rendering START */
        function RenderDirectiveFooter() {
          let startDate = null;
          let endDate = null;

          if (legacyContainer.scope.filters != null) {
            startDate = new Date(legacyContainer.scope.filters.StartDate);
            endDate = new Date(legacyContainer.scope.filters.EndDate);
          }

          $("#directiveTimeFrame", element).empty();
          if (startDate != null && endDate != null) {
            $("#directiveTimeFrame", element).append(
              `${startDate.toLocaleDateString()} through ${endDate.toLocaleDateString()}`
            );
          }
        }
        function RenderHumanVsAiCompareInformation(callback, listToRender) {
          if (listToRender == null) {
            listToRender = initialData;
          }
          $("#humanVsAiScoreCompareDisplay", element).empty();
          let detailDataHolder = $(`<div class="data-detail-list-holder" />`);
          let detailDataTableHeaderHolder = $(
            `<div class="data-detail-table-header-holder" />`
          );
          let detailDataTableBodyHolder = $(
            `<div class="data-detail-table-body-holder" />`
          );
          let detailDataTableFooterHolder = $(
            `<div class="data-detail-table-footer-holder" />`
          );

          //header data
          RenderDetailTableHeader(detailDataTableHeaderHolder);
          RenderDetailTableBody(detailDataTableBodyHolder, listToRender);
          RenderDetailTableFooter(detailDataTableFooterHolder);
          //footer data

          detailDataHolder.append(detailDataTableHeaderHolder);
          detailDataHolder.append(detailDataTableBodyHolder);
          detailDataHolder.append(detailDataTableFooterHolder);

          $("#humanVsAiScoreCompareDisplay", element).append(detailDataHolder);
          HideAllMonitorFormInputDetails();
          if (callback != null) {
            callback();
          }
        }
        function RenderDetailTableHeader(renderToObject) {
          let detailHeaderRowHolder = $(
            `<div class="data-detail-table-header-row" />`
          );

          // let recordDatesHolder = $(`<div class="data-detail-column assessment-date header-item" sortValue="startDate">Assessment Dates</div>`);
          let monitorNameHolder = $(
            `<div class="data-detail-column assessment-date header-item" sortValue="monitorName">Monitor</div>`
          );
          let totalAssessmentsHolder = $(
            `<div class="data-detail-column total-assessment-count header-item" sortValue="totalAssessments">Total Monitors</div>`
          );
          let overallAverageScoreHolder = $(
            `<div class="data-detail-column overall-assessment-score header-item" sortValue="averageScore">Overall Avg. Score</div>`
          );
          let humanAssessmentsCountHolder = $(
            `<div class="data-detail-column human-assessment-count header-item" sortValue="humanAssessmentCount">Team Member Entered Monitors</div>`
          );
          let humanAssessmentsAverageScoreHolder = $(
            `<div class="data-detail-column human-assessment-avg-score header-item" sortValue="humanAssessmentAvgScore">Team Member Entered Avg. Score</div>`
          );
          let aiAssessmentsCountHolder = $(
            `<div class="data-detail-column ai-assessment-count header-item" sortValue="aiAssessmentCount">AI Entered Monitors</div>`
          );
          let aiAssessmentsAverageScoreHolder = $(
            `<div class="data-detail-column ai-assessment-avg-score header-item" sortValue="aiAssessmentAvgScore">AI Entered Avg. Score</div>`
          );
          let humanVsAiScoreDiffHolder = $(
            `<div class="data-detail-column human-vs-ai-score-diff header-item" sortValue="humanVsAiScoreDiff">Score Diff</div>`
          );
          //let buttonsHolder = $(`<div class="data-detail-column button-holder header-item">&nbsp;</div>`);

          let headerArray = [
            monitorNameHolder,
            // recordDatesHolder,
            totalAssessmentsHolder,
            overallAverageScoreHolder,
            humanAssessmentsCountHolder,
            humanAssessmentsAverageScoreHolder,
            aiAssessmentsCountHolder,
            aiAssessmentsAverageScoreHolder,
            humanVsAiScoreDiffHolder,
          ];

          let currentSortValue = $("#currentSortValue", element).val();
          let currentSortOrder = $("#currentSortOrder", element).val();

          headerArray.forEach(function (item) {
            let sortValue = $(item).attr("sortvalue");
            if (sortValue != null && sortValue != "") {
              $(item).addClass("sortable");
              $(item).prop("sortValue", sortValue);
              if (currentSortValue == sortValue) {
                $(item)
                  .removeClass("asc-grid desc-grid")
                  .addClass(`${currentSortOrder}-grid`);
              }
            }
            $(item).on("click", function () {
              SortDataColumn(this);
              RenderHumanVsAiCompareInformation();
            });
            detailHeaderRowHolder.append(item);
          });

          $(renderToObject).append(detailHeaderRowHolder);
        }
        function RenderDetailTableBody(renderToObject, dataToRender) {
          if (dataToRender == null || dataToRender.length == 0) {
            $(renderToObject).append("No detail records found.");
          } else {
            dataToRender.forEach(function (dataItem) {
              let detailRowHolder = $(`<div class="data-detail-list-row" />`);
              // let recordDatesHolder = $(`<div class="data-detail-column assessment-date" />`);
              // if (dataItem.StartDate != null && dataItem.EndDate != null) {
              //    recordDatesHolder.append(`${new Date(dataItem.StartDate).toLocaleDateString()} - ${new Date(dataItem.EndDate).toLocaleDateString()}`);
              // }
              let monitorExpanderHolder = $(
                `<div class="data-detail-column monitor-expander-holder" />`
              );
              let monitorExpanderButton = $(
                `<button class="button btn expander-button" id="btnMonitorExpanderButton_${dataItem.SqfCode}"><i class="fa fa-plus" id="expanderIndication_${dataItem.SqfCode}"></i></button>`
              );
              monitorExpanderButton.on("click", function () {
                let buttonId = this.id;
                let sqfCode = buttonId.split("_")[1];
                WriteMonitorInformationFormLoading(function () {
                  ToggleMonitorFormInfo(function () {
                    LoadMonitorFormInformation(null, sqfCode);
                  }, sqfCode);
                }, sqfCode);
              });
              monitorExpanderHolder.append(monitorExpanderButton);
              let monitorName = dataItem.MonitorName;

              let monitorNameHolder = $(
                `<div class="data-detail-column assessment-date" />`
              );
              monitorNameHolder.append(monitorName);
              // if (
              //   legacyContainer.scope.TP1Role.toLowerCase() ==
              //   "Admin".toLowerCase()
              // ) {
                //if (dataItem.SqfCode == 11 || dataItem.SqfCode == 4) {
                  let viewButton = $(
                    `<button id="btnViewSqfComparisonInfo_${dataItem.SqfCode}" class="detail-btn"><i class="fa-regular fa-window-restore"></i></button>`
                  );
                  viewButton.on("click", function () {
                    let btnId = this.id;
                    let sqfCode = btnId.split("_")[1];
                    ko.postbox.publish("HumanAICompareSqfCode", sqfCode);
                  });
                  monitorNameHolder.append("&nbsp;");
                  monitorNameHolder.append(viewButton);
                //}
              // }

              let totalAssessmentsHolder = $(
                `<div class="data-detail-column total-assessment-count">${dataItem.TotalAssessments}</div>`
              );
              let overallAverageScoreHolder = $(
                `<div class="data-detail-column overall-assessment-score">${dataItem.OverallAverageScore?.toFixed(
                  2
                )}</div>`
              );
              let humanAssessmentsCountHolder = $(
                `<div class="data-detail-column human-assessment-count">${dataItem.HumanAssessmentsCount}</div>`
              );
              let humanAssessmentScore =
                dataItem.HumanAssessmentAverageScore?.toFixed(2) || "--";

              let humanAssessmentsAverageScoreHolder = $(
                `<div class="data-detail-column human-assessment-avg-score">${humanAssessmentScore}</div>`
              );
              let aiAssessmentsCountHolder = $(
                `<div class="data-detail-column ai-assessment-count">${dataItem.AiAssessmentsCount}</div>`
              );
              let aiAssessmentScore =
                dataItem.AiAssessmentAverageScore?.toFixed(2) || "--";
              let aiAssessmentsAverageScoreHolder = $(
                `<div class="data-detail-column ai-assessment-avg-score">${aiAssessmentScore}</div>`
              );
              let humanVsAiScoreDiffHolder = $(
                `<div class="data-detail-column human-vs-ai-score-diff" />`
              );

              let monitorFormInputDetailsHolder = $(
                `<div class="monitor-detail-row-holder" id="monitorDetailRowHolder_${dataItem.SqfCode}" />`
              );
              //TODO: Handle the agent information for this form.
              monitorFormInputDetailsHolder.append("&nbsp;");

              if (dataItem.IsAiHigherScore == true) {
                humanVsAiScoreDiffHolder.addClass("ai-better-score-vs-human");
              }

              let scoreDiffValue = Math.abs(
                dataItem.AiVsHumanAverageScoreDiff
              )?.toFixed(2);
              if (
                dataItem.HumanAssessmentAverageScore == null ||
                dataItem.AiAssessmentAverageScore == null
              ) {
                scoreDiffValue = "N/A";
              }
              humanVsAiScoreDiffHolder.append(scoreDiffValue);

              detailRowHolder.append(monitorExpanderHolder);
              detailRowHolder.append(monitorNameHolder);
              // detailRowHolder.append(recordDatesHolder);
              detailRowHolder.append(totalAssessmentsHolder);
              detailRowHolder.append(overallAverageScoreHolder);
              detailRowHolder.append(humanAssessmentsCountHolder);
              detailRowHolder.append(humanAssessmentsAverageScoreHolder);
              detailRowHolder.append(aiAssessmentsCountHolder);
              detailRowHolder.append(aiAssessmentsAverageScoreHolder);
              detailRowHolder.append(humanVsAiScoreDiffHolder);

              detailRowHolder.append(`<br>`);
              detailRowHolder.append(monitorFormInputDetailsHolder);

              $(renderToObject).append(detailRowHolder);
            });
          }
        }
        function RenderDetailTableFooter(renderToObject) {
          let detailFooterRowHolder = $(
            `<div class="data-detail-table-footer-row" />`
          );
          detailFooterRowHolder.append("&nbsp;");

          $(renderToObject).append(detailFooterRowHolder);
        }
        function RenderMonitorFormInformation(callback, sqfCode) {
          let dataToRender = userEntryData.filter(
            (i) =>
              i.SqfCode == sqfCode &&
              i.EnterByUserId != null &&
              i.EnterByUserId != ""
          );
          let monitorInformationHolder = $(
            `<div class="monitor-user-entry-information-holder" />`
          );
          if (dataToRender.length == 0) {
            monitorInformationHolder.append(
              "No User Entry Information Found.<br>"
            );
          } else {
            RenderMonitorFormDetailTableHeader(monitorInformationHolder);
            RenderMonitorFormDetailTableBody(
              monitorInformationHolder,
              dataToRender
            );
            RenderMonitorFormDetailTableFooter(monitorInformationHolder);
          }
          $(`#monitorDetailRowHolder_${sqfCode}`).empty();
          $(`#monitorDetailRowHolder_${sqfCode}`).append(
            monitorInformationHolder
          );

          if (callback != null) {
            callback();
          }
        }
        function RenderMonitorFormDetailTableHeader(renderToObject) {
          let detailHeaderRowHolder = $(
            `<div class="data-sub-detail-table-header-row" />`
          );
          let teamMemberNameHolder = $(
            `<div class="data-sub-detail-column user-name header-item">Team Member</div>`
          );
          let totalAssessmentsHolder = $(
            `<div class="data-sub-detail-column total-assessment-count header-item">Total Monitors</div>`
          );
          let averageScoreHolder = $(
            `<div class="data-sub-detail-column average-score header-item">Average Score</div>`
          );

          detailHeaderRowHolder.append(teamMemberNameHolder);
          detailHeaderRowHolder.append(totalAssessmentsHolder);
          detailHeaderRowHolder.append(averageScoreHolder);

          $(renderToObject).append(detailHeaderRowHolder);
        }
        function RenderMonitorFormDetailTableBody(
          renderToObject,
          dataToRender
        ) {
          let detailBodyHolder = $(
            `<div class="data-sub-detail-table-body-holder" />`
          );
          dataToRender.forEach(function (dataItem) {
            let detailRowHolder = $(
              `<div class="data-sub-detail-table-row-holder" />`
            );
            let teamMemberNameHolder = $(
              `<div class="data-sub-detail-column user-name" />`
            );
            let totalAssessmentsHolder = $(
              `<div class="data-sub-detail-column total-assessment-count" />`
            );
            let averageScoreHolder = $(
              `<div class="data-sub-detail-column average-score" />`
            );

            let userName = dataItem.EnterByUserId;
            if (dataItem.EnterByUserIdSource != null) {
              userName = dataItem.EnterByUserIdSource.UserFullName;
            } else {
              userName =
                GetUserProfileObject(dataItem.EnterByUserId)?.UserFullName ||
                dataItem.EnterByUserId;
            }

            teamMemberNameHolder.append(userName);
            totalAssessmentsHolder.append(dataItem.TotalMonitors);
            averageScoreHolder.append(dataItem.AverageScore?.toFixed(2) || 0.0);

            detailRowHolder.append(teamMemberNameHolder);
            detailRowHolder.append(totalAssessmentsHolder);
            detailRowHolder.append(averageScoreHolder);

            detailBodyHolder.append(detailRowHolder);
          });

          $(renderToObject).append(detailBodyHolder);
        }
        function RenderMonitorFormDetailTableFooter(renderToObject) {
          let detailFooterRowHolder = $(
            `<div class="data-sub-detail-table-footer-row" />`
          );
          detailFooterRowHolder.append("");

          $(renderToObject).append(detailFooterRowHolder);
        }
        /* Data Rendering END */
        /* Editor Loading START */
        /* Editor Loading END */
        /* Sorting Options START */
        function SortDataColumn(columnObject) {
          let sortedData = initialData;
          let sortValue = $(columnObject).prop("sortValue");
          let currentSortValue = $("#currentSortValue", element).val();
          let currentSortOrder = $("#currentSortOrder", element).val();

          if (currentSortValue == sortValue) {
            if (currentSortOrder == "asc") {
              currentSortOrder = "desc";
            } else {
              currentSortOrder = "asc";
            }
          } else {
            currentSortOrder = "asc";
          }

          switch (sortValue.toLowerCase()) {
            // case "startDate".toLowerCase():
            //    sortedData = sortedData.sort((a, b) => {
            //       if (currentSortOrder == "desc") {
            //          return new Date(b.StartDate) - new Date(a.StartDate);
            //       }
            //       else {
            //          return new Date(a.EndDate) - new Date(b.EndDate);
            //       }
            //    });
            //    break;
            case "monitorName".toLowerCase():
              sortedData = sortedData.sort((a, b) => {
                if (currentSortOrder == "desc") {
                  return b.MonitorName - a.MonitorName;
                } else {
                  return a.MonitorName - b.MonitorName;
                }
              });
              break;
            case "totalAssessments".toLowerCase():
              sortedData = sortedData.sort((a, b) => {
                if (currentSortOrder == "desc") {
                  return b.TotalAssessments - a.TotalAssessments;
                } else {
                  return a.TotalAssessments - b.TotalAssessments;
                }
              });
              break;
            case "humanAssessmentCount".toLowerCase():
              sortedData = sortedData.sort((a, b) => {
                if (currentSortOrder == "desc") {
                  return b.HumanAssessmentsCount - a.HumanAssessmentsCount;
                } else {
                  return a.HumanAssessmentsCount - b.HumanAssessmentsCount;
                }
              });
              break;
            case "humanAssessmentAvgScore".toLowerCase():
              sortedData = sortedData.sort((a, b) => {
                if (currentSortOrder == "desc") {
                  return (
                    b.HumanAssessmentAverageScore -
                    a.HumanAssessmentAverageScore
                  );
                } else {
                  return (
                    a.HumanAssessmentAverageScore -
                    b.HumanAssessmentAverageScore
                  );
                }
              });
              break;
            case "aiAssessmentCount".toLowerCase():
              sortedData = sortedData.sort((a, b) => {
                if (currentSortOrder == "desc") {
                  return b.AiAssessmentsCount - a.AiAssessmentsCount;
                } else {
                  return a.AiAssessmentsCount - b.AiAssessmentsCount;
                }
              });
              break;
            case "aiAssessmentAvgScore".toLowerCase():
              sortedData = sortedData.sort((a, b) => {
                if (currentSortOrder == "desc") {
                  return (
                    b.AiAssessmentAverageScore - a.AiAssessmentAverageScore
                  );
                } else {
                  return (
                    a.AiAssessmentAverageScore - b.AiAssessmentAverageScore
                  );
                }
              });
              break;
            case "humanVsAiScoreDiff".toLowerCase():
              sortedData = sortedData.sort((a, b) => {
                if (currentSortOrder == "desc") {
                  return (
                    b.AiVsHumanAverageScoreDiff - a.AiVsHumanAverageScoreDiff
                  );
                } else {
                  return (
                    a.AiVsHumanAverageScoreDiff - b.AiVsHumanAverageScoreDiff
                  );
                }
              });
              break;
            case "averageScore".toLowerCase():
              sortedData = sortedData.sort((a, b) => {
                if (currentSortOrder == "desc") {
                  return b.OverallAverageScore - a.OverallAverageScore;
                } else {
                  return a.OverallAverageScore - b.OverallAverageScore;
                }
              });
              break;
          }

          $("#currentSortValue", element).val(sortValue);
          $("#currentSortOrder", element).val(currentSortOrder);
          $(columnObject)
            .removeClass("asc-grid desc-grid")
            .addClass(`${currentSortOrder}-grid`);

          return sortedData;
        }
        /* Sorting Options END */
        /* Utility Functions START */
        function ToggleMonitorFormInfo(callback, sqfCode) {
          $(`#expanderIndication_${sqfCode}`, element).removeClass("fa-minus");
          $(`#expanderIndication_${sqfCode}`, element).removeClass("fa-plus");

          if ($(`#monitorDetailRowHolder_${sqfCode}`, element).is(":visible")) {
            HideMonitorFormEntryInfo(sqfCode);
          } else {
            ShowMonitorFormEntryInfo(sqfCode);
          }
          if (callback != null) {
            callback();
          }
        }
        function WriteMonitorInformationFormLoading(callback, sqfCode) {
          $(`#monitorDetailRowHolder_${sqfCode}`).empty();
          $(`#monitorDetailRowHolder_${sqfCode}`).append(
            `<img src="${defaultLoadingImageUrl}" height="50" />`
          );
          $(`#monitorDetailRowHolder_${sqfCode}`).append("LOADING DATA...");
          if (callback != null) {
            callback();
          }
        }
        function GetUserProfileObject(userId) {
          let userObject = cachedRenderedObjects.userProfiles.find(
            (i) => i.UserId == userId
          );
          if (userObject == null) {
            a$.ajax({
              type: "POST",
              service: "C#",
              async: false,
              data: {
                lib: "selfserve",
                cmd: "getUserProfile",
                userid: userId,
                deepLoad: false,
              },
              dataType: "json",
              cache: false,
              error: a$.ajaxerror,
              success: function (data) {
                let returnData = JSON.parse(data.userFullProfile);
                userObject = returnData;
                cachedRenderedObjects.userProfiles.push(returnData);
                return returnData;
              },
            });
          }
          return userObject;
        }
        /* Utility Functions END */
        /* Show/Hide START */
        function HideAll() {
          HideLoadingMessage();
        }
        function HideLoadingMessage() {
          $("#directiveLoading", element).hide();
        }
        function ShowLoadingMessage() {
          $("#directiveLoading", element).show();
        }
        function HideAllMonitorFormInputDetails() {
          $(".monitor-detail-row-holder", element).hide();
        }
        function HideMonitorFormEntryInfo(id) {
          $(`#expanderIndication_${id}`, element).addClass("fa-plus");
          $(`#monitorDetailRowHolder_${id}`, element).hide();
        }
        function ShowMonitorFormEntryInfo(id) {
          $(`#expanderIndication_${id}`, element).addClass("fa-minus");
          $(`#monitorDetailRowHolder_${id}`, element).show();
        }
        /* Show/Hide END */

        scope.load = function () {
          Initialize();
          LoadDirective();
        };
        ko.postbox.subscribe("autoQaLoad", function (dataObjects) {
          initialData.length = 0;
          userEntryData.length = 0;
          scope.load();
        });
        ko.postbox.subscribe("autoQaRefresh", function (dataObjects) {
          initialData.length = 0;
          userEntryData.length = 0;
          LoadDirective();
        });
        ko.postbox.subscribe("qmDashboardLoadData", function (dataStats) {
          initialData.length = 0;
          userEntryData.length = 0;
          userEntryData = dataStats;
          scope.load();
        });
        ko.postbox.subscribe("AutoQA_HumanVsAI_Load", function () {
          initialData.length = 0;
          userEntryData.length = 0;
          scope.load();
        });
      },
    };
  },
]);
