angularApp.directive("ngAutoQaTrending", [
  "api",
  "$rootScope",
  function (api, $rootScope) {
    return {
      templateUrl:
        a$.debugPrefix() +
        "/applib/dev/AutoQa/view/AutoQaTrending.htm?" +
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
        let currentTrendingData = [];
        let currentTrendSettings = {
          trend: "",
          timeframe: "",
        };
        const AI_UserId = "AI.System"; //TODO: Make this some sort of system wide thing.

        //TODO: Determine how we want to manage these options
        let trendingOptions = [
          {
            value: "huVai_MonitorScore",
            text: "Team Member vs. AI Score",
            status: "A",
            isDefault: true,
            displayOrder: 0,
            scoringType: 1,
            chartTitleFormat: "Team Member vs. AI Monitor Score",
          },
          {
            value: "huVai_MonitorDiff",
            text: "Team Member vs. AI Diff",
            status: "A",
            isDefault: false,
            displayOrder: 0,
            scoringType: 1,
            chartTitleFormat:
              "Team Member vs. AI Monitor Average Score Difference",
          },
          {
            value: "monitorsPerTimeframe",
            text: "Monitors Count",
            status: "A",
            isDefault: false,
            displayOrder: 10,
            scoringType: 2,
            chartTitleFormat: "Monitors per {timeframe}",
          },
        ];
        let timeframeOptions = [
          {
            value: "daily",
            text: "Last {trendItems}  days",
            status: "A",
            isDefault: false,
            displayOrder: 20,
            trendItems: 30,
            categoryLabelFormat: "{month}/{day}/{year}",
            timeFrameDisplay: "Day",
          },
          {
            value: "weekly",
            text: "Last {trendItems} weeks",
            status: "A",
            isDefault: false,
            displayOrder: 10,
            trendItems: 12,
            categoryLabelFormat: "{month}/{day}/{year}",
            timeFrameDisplay: "Week",
          },
          {
            value: "month",
            text: "Last {trendItems} months",
            status: "A",
            isDefault: true,
            displayOrder: 0,
            trendItems: 12,
            categoryLabelFormat: "{month}/{year}",
            timeFrameDisplay: "Month",
          },
        ];
        /* Event Handling START */
        $("#btnRefreshTrendingChart", element)
          .off("click")
          .on("click", function () {
            LoadAutoQaTrendingChart(null, true);
          });
        $("#trendingChart_Timeframe", element)
          .off("change")
          .on("change", function () {
            LoadAutoQaTrendingChart(null, true);
          });
        $("#trendingChart_TrendType", element)
          .off("change")
          .on("change", function () {
            LoadAutoQaTrendingChart(null, false);
          });
        /* Event Handling END */
        function Initialize() {
          $(".directive-information-loading-image", element).prop(
            "src",
            `${a$.debugPrefix()}/applib/css/images/acuity-loading.gif`
          );
          HideAll();
          SetDatePickers();
          LoadDropdownOptions();
          SetDefaultTrendChartOptions();
          RenderDirectiveFooter();
        }
        function SetDatePickers() {}
        /* Data Loading START */
        function LoadDirective() {
          HideAll();
          LoadAutoQaTrendingChart();
        }
        function LoadDropdownOptions(callback) {
          //Timeframe options
          $("#trendingChart_Timeframe", element).empty();

          $("#trendingChart_Timeframe", element).append(
            $(`<option> -- Select Timeframe -- </option>`)
          );
          timeframeOptions = timeframeOptions.sort(
            (a, b) => parseInt(a.displayOrder) - parseInt(b.displayOrder)
          );
          trendingOptions = trendingOptions.sort(
            (a, b) => parseInt(a.displayOrder) - parseInt(b.displayOrder)
          );

          timeframeOptions.forEach(function (timeframe) {
            if (timeframe.status == "A") {
              let timeFrameText = timeframe.text;
              timeFrameText = timeFrameText.replace(
                "{trendItems}",
                timeframe.trendItems
              );

              let selectOption = $(
                `<option value="${timeframe.value}">${timeFrameText}</option>`
              );
              $("#trendingChart_Timeframe", element).append(selectOption);
            }
          });
          //trend options
          $("#trendingChart_TrendType", element).empty();
          $("#trendingChart_TrendType", element).append(
            $(`<option> -- Select Trend -- </option>`)
          );

          trendingOptions.forEach(function (trendOption) {
            if (trendOption.status == "A") {
              let selectOption = $(
                `<option value="${trendOption.value}">${trendOption.text}</option>`
              );
              $("#trendingChart_TrendType", element).append(selectOption);
            }
          });

          if (callback != null) {
            callback();
          }
        }
        function LoadAutoQaTrendingChart(callback, forceReload) {
          ShowLoadingMessage();
          GetAutoQaTrendingChart(function (trendData) {
            RenderQmTrendChart(() => {
              ShowTrendingChart();
              HideLoadingMessage();
              if (callback != null) {
                callback();
              }
            });
          }, forceReload);
        }
        /* Data Loading END */
        /* Data Pulls START */
        function GetAutoQaTrendingChart(callback, forceReload) {
          if (forceReload == null) {
            forceReload = false;
          }
          $("#autoQaTrending", element).empty();

          let selectedTrend = $("#trendingChart_TrendType", element).val();
          let selectedTimeframe = $("#trendingChart_Timeframe", element).val();
          if (
            forceReload == false &&
            (selectedTimeframe != currentTrendSettings.timeframe ||
              selectedTrend != currentTrendSettings.trend)
          ) {
            forceReload = true; //trend or timeframe has changed, then force a reload
          }
          currentTrendSettings.timeframe = selectedTimeframe;
          currentTrendSettings.trend = selectedTrend;

          let trendType = selectedTimeframe;
          let trendCount = 12;

          let timeFrameObject = timeframeOptions.find(
            (i) => i.value == selectedTimeframe
          );

          if (timeFrameObject != null) {
            trendCount = timeFrameObject.trendItems;
          }

          if (
            forceReload == false &&
            currentTrendingData != null &&
            currentTrendingData.length > 0
          ) {
            if (callback != null) {
              callback(currentTrendingData);
            } else {
              return currentTrendingData;
            }
          } else {
            let trendCommand = "getQMDashboardStatsTrendData";
            //TODO: Determine the various command information based on the trend type and all of that fun stuff.
            let trendDate = null;
            let projectId = null;
            let locationId = null;
            let groupId = null;
            let teamId = null;
            let userId = null;
            if (legacyContainer.scope.filters != null) {
              trendDate = legacyContainer.scope.filters.EndDate;
              projectId = legacyContainer.scope.filters.Project;
              locationId = legacyContainer.scope.filters.Location;
              groupId = legacyContainer.scope.filters.Group;
              teamId = legacyContainer.scope.filters.Team;
              userId = legacyContainer.scope.filters.CSR;
            }
            currentTrendingData.length = 0;

            a$.ajax({
              type: "POST",
              service: "C#",
              async: true,
              data: {
                lib: "selfserve",
                cmd: trendCommand,
                trendDate: trendDate,
                trendType: trendType,
                trendCount: trendCount,
                //yAxisType: yAxisType,
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
                let returnData = JSON.parse(data.qmDashboardStatsTrendData);
                currentTrendingData = returnData;
                if (callback != null) {
                  callback(returnData);
                } else {
                  return returnData;
                }
              },
            });
          }
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
        function RenderAutoQaChart(callback, dataForRendering) {
          let xAxisSlots = 0;
          let seriesList = [];
          let seriesData = [];
          let categoryLabelFormatTemplate = "{month}/{year}";
          //get all of the series information we have to filter for.
          dataForRendering.forEach(function (data) {
            let maxSort = data.DataSortOrder;
            if (maxSort > xAxisSlots) {
              xAxisSlots = maxSort;
            }
            let sIndex = seriesList.findIndex((s) => s == data.SeriesName);
            if (sIndex < 0) {
              seriesList.push(data.SeriesName);
            }
          });
          //check our X-Axis information
          let timeFrameObject = timeframeOptions.find(
            (i) => i.value == $("#trendingChart_Timeframe", element).val()
          );
          if (timeFrameObject != null) {
            if (timeFrameObject.trendItem > xAxisSlots) {
              xAxisSlots = timeFrameObject.trendItems;
            }
            categoryLabelFormatTemplate =
              timeFrameObject.categoryLabelFormat || "{month}/{year}";
          }
          let categoriesList = [];
          for (let iCounter = 0; iCounter < xAxisSlots; iCounter++) {
            categoriesList.push(null);
          }

          seriesList.forEach(function (seriesName) {
            let dataToProcess = dataForRendering.filter(
              (data) => data.SeriesName == seriesName
            );
            let dataInfo = new Object();
            dataInfo.name = seriesName;
            dataInfo.data = [];
            for (let iCounter = 0; iCounter < xAxisSlots; iCounter++) {
              dataInfo.data.push(null);
            }
            if (
              seriesName != null &&
              (seriesName.toLowerCase() == "all".toLowerCase() ||
                seriesName.toLowerCase() == "overall".toLowerCase())
            ) {
              dataInfo.color = "var(--autoqa-overall-color)";
              dataInfo.dashStyle = "Dash";
            } else {
              dataInfo.color = "var(--" + seriesName.toLowerCase() + "-color)";
              dataInfo.dashStyle = "Solid";
            }
            for (let dIndex = 0; dIndex < dataToProcess.length; dIndex++) {
              let dataPoint = dataToProcess[dIndex];
              dataInfo.data[dataPoint.DataSortOrder - 1] = parseFloat(
                parseFloat(dataPoint.YValue)?.toFixed(2)
              );
              if (categoriesList[dataPoint.DataSortOrder - 1] == null) {
                let categoryLabel = dataPoint.XValue;
                if (!isNaN(new Date(categoryLabel))) {
                  let tempLabel = new Date(categoryLabel);
                  categoryLabel = categoryLabelFormatTemplate;
                  categoryLabel = categoryLabel.replace(
                    "{year}",
                    tempLabel.getFullYear()
                  );
                  categoryLabel = categoryLabel.replace(
                    "{month}",
                    tempLabel.getMonth() + 1
                  );
                  categoryLabel = categoryLabel.replace(
                    "{day}",
                    tempLabel.getDate()
                  );
                }
                //return ;
                categoriesList[dataPoint.DataSortOrder - 1] = categoryLabel;
              }
            }
            seriesData.push(dataInfo);
          });

          let chartDef = {};
          chartDef.chart = new Object();
          chartDef.chart.type = "line";
          chartDef.chart.zoomType = "xy";
          chartDef.title = new Object();
          chartDef.title.text = GetChartTitle();
          chartDef.series = seriesData;
          chartDef.xAxis = new Object();
          chartDef.xAxis.title = "";
          chartDef.xAxis.type = "category";
          chartDef.xAxis.categories = categoriesList;
          chartDef.yAxis = new Object();
          chartDef.yAxis.title = "Score";
          chartDef.legend = new Object();
          chartDef.legend.layout = "vertical";
          chartDef.legend.align = "right";
          chartDef.legend.verticalAlign = "middle";
          chartDef.legend.floating = false;
          chartDef.plotOptions = new Object();
          chartDef.plotOptions.series = new Object();
          chartDef.plotOptions.series.connectNulls = true;
          chartDef.plotOptions.series.dataLabels = new Object();
          chartDef.plotOptions.series.dataLabels.enabled = true;
          chartDef.credits = new Object();
          chartDef.credits.enabled = false;
          // chartDef.plotOptions.series.dataLabels.format = GetChartValuesDisplayFormat();
          // chartDef.tooltip = new Object();
          // chartDef.tooltip.useHTML = true;
          // chartDef.tooltip.formatter = function () {
          //    return GetTooltipFormatter(this);
          // }

          Highcharts.chart(`autoQaTrending`, chartDef);

          if (callback != null) {
            callback();
          }
        }
        function RenderQmTrendChart(callback, dataToRender) {
          if (dataToRender == null) {
            dataToRender = currentTrendingData;
          }
          let xAxisSlots = 0;
          let trendDisplayType = $("#trendingChart_TrendType", element).val();
          let seriesData = [];
          let categoriesList = [];

          if (dataToRender == null || dataToRender.length == 0) {
            console.log(
              "No trend data information found.  Determine how to alert user of this information."
            );
            $("#autoQaTrending", element).empty();
            $("#autoQaTrending", element).append("No trend information found.");
            if (callback != null) {
              callback();
            }
            return;
          }
          dataToRender = dataToRender.sort((a, b) => {
            return a.RowNumber - b.RowNumber;
          });
          if (dataToRender.length > xAxisSlots) {
            xAxisSlots = dataToRender.length;
          }

          let allSeriesInfo = new Object();
          allSeriesInfo.name = "All";
          allSeriesInfo.data = [];
          allSeriesInfo.color = "var(--autoqa-overall-color)";
          allSeriesInfo.dashStyle = "Dash";

          let humanSeriesInfo = new Object();
          humanSeriesInfo.name = "Team Member";
          humanSeriesInfo.data = [];
          humanSeriesInfo.color = "var(--human-color)";
          humanSeriesInfo.dashStyle = "Solid";

          let aiSeriesInfo = new Object();
          aiSeriesInfo.name = "AI";
          aiSeriesInfo.data = [];
          aiSeriesInfo.color = "var(--ai-color)";
          aiSeriesInfo.dashStyle = "Solid";

          for (let i = 0; i < xAxisSlots; i++) {
            allSeriesInfo.data.push(null);
            humanSeriesInfo.data.push(null);
            aiSeriesInfo.data.push(null);
          }
          let hasOneGraphItem = false;
          let seriesCounter = 0;
          dataToRender.forEach((dataItem) => {
            if (
              categoriesList.findIndex(
                (i) => i.toLowerCase() == dataItem.SeriesName.toLowerCase()
              ) < 0
            ) {
              categoriesList.push(dataItem.SeriesName);
            }

            switch (trendDisplayType.toLowerCase()) {
              case "monitorsPerTimeframe".toLowerCase():
                allSeriesInfo.data[seriesCounter] = parseFloat(
                  parseFloat(dataItem.TotalMonitors)?.toFixed(2)
                );
                humanSeriesInfo.data[seriesCounter] = parseFloat(
                  parseFloat(dataItem.UserEnteredMonitorCount)?.toFixed(2)
                );
                aiSeriesInfo.data[seriesCounter] = parseFloat(
                  parseFloat(dataItem.AiEnteredMonitorCount)?.toFixed(2)
                );
                break;
              case "huVai_MonitorDiff".toLowerCase():
                let diffValue =
                  parseFloat(
                    parseFloat(dataItem.UserEnteredAverageScore)?.toFixed(2)
                  ) -
                  parseFloat(
                    parseFloat(dataItem.AiEnteredAverageScore)?.toFixed(2)
                  );
                allSeriesInfo.data[seriesCounter] = parseFloat(
                  diffValue?.toFixed(2)
                );
                allSeriesInfo.dashStyle = "Solid";
                hasOneGraphItem = true;
                //parseFloat(parseFloat(dataItem.TotalMonitors)?.toFixed(2));
                // humanSeriesInfo.data[seriesCounter] = parseFloat(parseFloat(dataItem.UserEnteredMonitorCount)?.toFixed(2));
                // aiSeriesInfo.data[seriesCounter] = parseFloat(parseFloat(dataItem.AiEnteredMonitorCount)?.toFixed(2));
                break;
              default:
                allSeriesInfo.data[seriesCounter] = parseFloat(
                  parseFloat(dataItem.TotalMonitorAverageScore)?.toFixed(2)
                );
                humanSeriesInfo.data[seriesCounter] = parseFloat(
                  parseFloat(dataItem.UserEnteredAverageScore)?.toFixed(2)
                );
                aiSeriesInfo.data[seriesCounter] = parseFloat(
                  parseFloat(dataItem.AiEnteredAverageScore)?.toFixed(2)
                );
                break;
            }

            seriesCounter++;
          });

          seriesData.push(allSeriesInfo);
          if (!hasOneGraphItem) {
            seriesData.push(humanSeriesInfo);
            seriesData.push(aiSeriesInfo);
          }

          let chartDef = {};
          chartDef.chart = new Object();
          chartDef.chart.type = "line";
          chartDef.chart.zoomType = "xy";
          chartDef.title = new Object();
          chartDef.title.text = GetChartTitle();
          chartDef.series = seriesData;
          chartDef.xAxis = new Object();
          chartDef.xAxis.title = "";
          chartDef.xAxis.type = "category";
          chartDef.xAxis.categories = categoriesList;
          chartDef.yAxis = new Object();
          chartDef.yAxis.title = "Score";
          chartDef.legend = new Object();
          chartDef.legend.layout = "vertical";
          chartDef.legend.align = "right";
          chartDef.legend.verticalAlign = "middle";
          chartDef.legend.floating = false;
          chartDef.plotOptions = new Object();
          chartDef.plotOptions.series = new Object();
          chartDef.plotOptions.series.connectNulls = true;
          chartDef.plotOptions.series.dataLabels = new Object();
          chartDef.plotOptions.series.dataLabels.enabled = true;
          chartDef.credits = new Object();
          chartDef.credits.enabled = false;
          // chartDef.plotOptions.series.dataLabels.format = GetChartValuesDisplayFormat();
          // chartDef.tooltip = new Object();
          // chartDef.tooltip.useHTML = true;
          // chartDef.tooltip.formatter = function () {
          //    return GetTooltipFormatter(this);
          // }

          Highcharts.chart(`autoQaTrending`, chartDef);

          if (callback != null) {
            callback();
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
        function SetDefaultTrendChartOptions() {
          //Trending options
          let defaultTrending = trendingOptions.find(
            (i) => i.isDefault == true
          );
          if (defaultTrending != null) {
            $("#trendingChart_TrendType", element).val(defaultTrending.value);
          }
          //TimeFrame
          let defaultTimeframe = timeframeOptions.find(
            (i) => i.isDefault == true
          );
          if (defaultTimeframe != null) {
            $("#trendingChart_Timeframe", element).val(defaultTimeframe.value);
          }
        }
        function GetChartTitle() {
          let formattedTitle = "";

          if (currentTrendSettings != null) {
            let trendObject = trendingOptions.find(
              (i) => i.value == currentTrendSettings.trend
            );
            let timeframeObject = timeframeOptions.find(
              (i) => i.value == currentTrendSettings.timeframe
            );

            if (trendObject != null) {
              formattedTitle = trendObject.chartTitleFormat;
            }
            if (timeframeObject != null) {
              formattedTitle = formattedTitle.replace(
                "{timeframe}",
                timeframeObject.timeFrameDisplay
              );
            }
          }

          return formattedTitle;
        }
        // function GetChartValuesDisplayFormat() {
        //    if (true) {
        //       appLib.getConfigParameterByName("CLIENT_SCORING_CALC_TYPE", function (returnParam) {
        //          if (returnParam != null && returnParam.ParamValue.toLowerCase() == "stddev") {
        //             return "{point.y: .4f}";
        //          }
        //       });
        //    }
        //    return "{point.y: .2f}";
        // }
        // function GetTooltipFormatter(item) {
        //    let returnString = "<b>" + item.series.name + "</b>&nbsp;&nbsp; <i>" + appLib.FormatScore(item.y) + "</i>";
        //    return returnString;
        // }
        /* Utility Functions END */
        /* Show/Hide START */
        function HideAll() {
          HideLoadingMessage();
          HideTrendingChart();
        }
        function HideTrendingChart() {
          $("#mainChartHolder", element).hide();
        }
        function ShowTrendingChart() {
          $("#mainChartHolder", element).show();
        }
        function HideLoadingMessage() {
          $("#directiveLoading", element).hide();
        }
        function ShowLoadingMessage() {
          $("#directiveLoading", element).show();
        }

        /* Show/Hide END */

        scope.load = function () {
          Initialize();
          LoadDirective();
        };

        ko.postbox.subscribe("autoQaRefresh", function (dataObjects) {
          initialData.length = 0;
          initialData = dataObjects;
          LoadDirective();
        });
        ko.postbox.subscribe("autoQaLoad", function (dataObjects) {
          initialData.length = 0;
          initialData = dataObjects;
          scope.load();
        });
        ko.postbox.subscribe("autoQaTrendingLoad", function () {
          //TODO: Determind what input information we will need to load data.
          scope.load();
        });
        ko.postbox.subscribe(
          "qmDashboardLoadData",
          function (dataStatsObjects) {
            initialData.length = 0;
            initialData = dataStatsObjects;
            currentTrendingData.length = 0;
            scope.load();
          }
        );
        // ko.postbox.subscribe("userPrizeCatalogAdminLoad", function (forceLoad) {
        //    scope.load(forceLoad);
        //    ko.postbox.publish("userPrizeWidgetLoadComplete");
        // });
      },
    };
  },
]);
