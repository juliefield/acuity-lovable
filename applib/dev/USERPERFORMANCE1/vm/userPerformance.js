angularApp.directive("ngUserPerformance", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/USERPERFORMANCE1/view/userPerformance.htm?' + Date.now(),
      scope: {
         assoc: "@",
         text: "@",
         details: "@",
         cid: "@",
         filters: "@",
         panel: "@",
         hidetopper: "@",
         toppertext: "@",
         itemtype: "@"
      },
      require: '^ngLegacyContainer',
      link: function (scope, element, attrs, legacyContainer) {
         let loadingUrl = a$.debugPrefix() + "/applib/css/images/acuity-loading.gif"
         $("#userPerformanceLoadingImage", element).attr("src", loadingUrl);
         let defaultMinValue = 0;
         let defaultMaxValue = 0;
         var kpiColorAssignments = [];
         var subKpiColorAssignments = [];
         let gChartDisplayType = null;
         var gSeriesData = [];
         let curChartData = [];
         /* Directive Events START */
         $("#displayScale", element).off("change").on("change", function () {
            console.log("Display Scale Changed.");
            GetChartData();
         });
         $("#chartTypeDisplaySelector", element).off("change").on("change", function () {
            console.log("Chart Type Changed.");
            HandleChartTypeChange($(this).val(), function () {
               GetChartData();
            });
         });
         $("#includeSubKpiInChart", element).off("change").on("change", function () {
            console.log("Include Sub KPI Changed.");
            GetChartData();
         });
         $("#includePreviousMonth", element).off("change").on("change", function () {
            console.log("Include Previous Month Changed.");
            GetChartData();
         });
         $("#kpiSelectionOption", element).off("change").on("change", function () {
            console.log("KPI Selected Changed.");
            WriteUserPerformanceMessage("Loading Kpi chart data...");
            ShowUserMessage();
            ClearSubKpiToDisplay();
            window.setTimeout(function(){
               GetChartData();
            },100);
         });
         $("#chartDisplaySelector", element).off("change").on("change", function () {
            console.log("Chart Display Changed.");
            HandleDisplayTypeChange($(this).val(), function () {
               GetChartData();
            })
         });
         $("#connectNullBreaks", element).off("change").on("change", function () {
            console.log("Null Breaks Changed.");
            GetChartData();
         });
         /* Directive Events END */
         //TODO: Determine the color array that we want to use.
         //Should this be loaded on a client basis or do we have
         //set information that we will use.
         var availableColors = [
            "#2e961e",
            "#f2aaf0",
            "#14555c",
            "#e3d054",
            "#aeaeae",
            "#FF00FF",
            "#000099"
         ];
         var availableSubColors = [
            "lightorange",
            "lightyellow",
            "lightpurple",
            "lightcyan"
         ]
         function Initalize() {
            //pull information from the highcharts theme information
            //only if we have the theme data.
            if (Highcharts?.theme?.colors != null) {
               availableColors = Highcharts.theme.colors;
            }
            GetMinMaxDefaultValues();
            scope.KpiList = [];
            MarkDefaults();
            HideUserMessage();
            //HideChartTypeOption();
            GetKpiList(function (kpiData) {
               AssignKpiDataColors(kpiData, function (kpiData) {
                  LoadKpiList(kpiData, function () {
                     WriteUserPerformanceMessage("Loading Kpi List data...");
                     ShowUserMessage();
                     $("#kpiSelectionOption", element).val("0");
                     $("#kpiSelectionOption", element).change();
                     HideUserMessage();
                  });
               });
            });
            GetSubKpiList(function (subKpiData) {
               AssignSubKpiDataColors(subKpiData, function () {
                  HideUserMessage();
               });
            });
         }
         function GetMinMaxDefaultValues() {
            appLib.getConfigParameterByName("MIN_SCORE_VALUE", function (parameter) {
               if (parameter != null) {
                  defaultMinValue = parseInt(parameter.ParamValue);
               }
            });
            appLib.getConfigParameterByName("MAX_SCORE_VALUE", function (parameter) {
               if (parameter != null) {
                  defaultMaxValue = parseInt(parameter.ParamValue);
               }
            });

         }
         function MarkDefaults() {
            // let automaticPreviousMonthCheckValue = 15; //TODO: Set a config parameter for this?
            // let today = new Date();

            $("#chartDisplaySelector", element).val("singluarKpi");
            $("#kpiSelectionOption", element).val("0");
            $("#chartTypeDisplaySelector", element).val("trend");
            $("#displayScale", element).val("Scored");
            //$("#includePreviousMonth", element).prop("checked", true);
            $("#connectNullBreaks", element).prop("checked", true);

            // if (today.getDate() < automaticPreviousMonthCheckValue) {
            //   $("#includePreviousMonth", element).prop("checked", true);
            // }

            //Change defaults per Greg 5/12
            // $("#chartTypeDisplaySelector", element).val("column");
            // $("#kpiSelectionOption", element).val("");
            // $("#includePreviousMonth", element).prop("checked", false);
            // $("#displayScale", element).val("Scored");
            // $("#chartDisplaySelector", element).val("allKpi");
            // $("#connectNullBreaks", element).prop("checked", true);
            //HideKpiSection();
            //HideConnectBreakOptions();
            // window.setTimeout(function(){
            //    //$("#chartDisplaySelector", element).change();
            //    $("#kpiSelectionOption", element).change();
            // }, 100);

         }
         function GetKpiList(callback) {
            a$.ajax({
               type: "GET",
               service: "C#",
               async: true,
               data: {
                  lib: "selfserv",
                  cmd: "getKpiListForUser",
                  userid: legacyContainer.scope.TP1Username,
                  deepLoad: true,
                  includeBalancedScore: true
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (jsonData) {
                  if (jsonData.errormessage != null && jsonData.errormessage == "true") {
                     a$.jsonerror(jsonData);
                     return;
                  }
                  else {
                     let returnData = null;
                     WriteUserPerformanceMessage("Collecting Kpi Data...");
                     try {
                        if (jsonData.kpiList != null) {
                           returnData = JSON.parse(jsonData.kpiList);
                        }
                        if (callback != null) {
                           callback(returnData);
                        }
                     }
                     catch (ex) {
                        let errorData = new Object();
                        errorData.errormessage = true
                        errorData.msg = "Error loading KPI/Sub-KPI data.  Returned data list caused a JSON error.";
                        a$.jsonerror(errorData);
                        if(callback != null)
                        {
                           callback();
                        }
                     }
                  }
               }
            });
            return;
         }
         function GetSubKpiList(callback) {
            let returnData = [];
            //TODO: Determine how to collect the SUBKPI information

            if (callback != null) {
               callback(returnData);
            }
            return returnData;
         }
         function AssignKpiDataColors(kpiDataList, callback) {
            var colorAssignedCount = 0;
            for (let kpiCounter = 0; kpiCounter < kpiDataList.length; kpiCounter++) {
               let colorAssignment = kpiColorAssignments.find(x => x.id == kpiDataList[kpiCounter].MqfNumber && x.subId == kpiDataList[kpiCounter].SubTypeId);
               if (colorAssignment == null) {
                  let colorItem = new Object();
                  colorItem.id = kpiDataList[kpiCounter].MqfNumber;
                  colorItem.value = availableColors[colorAssignedCount];
                  colorAssignedCount++;
                  if (colorAssignedCount > availableColors.length) {
                     //console.info("Out of available colors for charting.  Recycling colors.");
                     colorAssignedCount = 0;
                  }
                  kpiColorAssignments.push(colorItem);
               }
            }
            if (callback != null) {
               callback(kpiDataList);
            }
            return kpiDataList;
         }
         function AssignSubKpiDataColors(subKpiDataList, callback) {
            var colorAssignedCount = 0;
            for (let counter = 0; counter < subKpiDataList.length; counter++) {
               if (subKpiDataList[counter] != null && subKpiDataList[counter].SubTypeId != null && supKpiDataList[counter].SubTypeId != 0) {
                  let assignedColor = subKpiColorAssignments.find(x => x.id == subKpiData[counter].MqfNumber && x.subId == subKpiData[counter].SubTypeId)
                  if (assignedColor == null) {
                     let colorItem = new Object();
                     colorItem.id = subKpiDataList[counter].MqfNumber;
                     colorItem.subId = subKpiDataList[counter].SubTypeId;
                     colorItem.value = availableSubColors[colorAssignedCount];
                     colorAssignedCount++;
                     if (colorAssignedCount > availableSubColors.length) {
                        colorAssignedCount = 0;
                     }
                  }
               }
            }
            if (callback != null) {
               callback(subKpiDataList);
            }
            return;
         }
         function LoadKpiList(kpiList, callback) {
            if (kpiList == null) {
               kpiList = scope.KpiList;
            }
            $("#kpiSelectionOption", element).empty();
            let sortedList = [];
            kpiList.forEach(function(kpiItem){
               let dataItem = {
                  dataObject: kpiItem,
                  name: "",
                  value: null,
               };
               let itemName = kpiItem.Name || "";
               if(kpiItem.ProjectIdSource != null){
                  itemName = `${kpiItem.ProjectIdSource.Name} - ${kpiItem.Name}`;
               }
               dataItem.name = itemName,
               dataItem.value = kpiItem.MqfNumber;

               sortedList.push(dataItem);
            });
            sortedList = sortedList.sort((a,b) => {
               if(a.name > b.name)
               {
                  return 1;
               }
               else if(a.name < b.name)
               {
                  return -1;
               }
               else
               {
                  return 0;
               }
            });

            sortedList.forEach(function(listItem){
               let optionItem = $("<option />");
               optionItem.val(listItem.value);
               optionItem.text(listItem.name);
               $("#kpiSelectionOption", element).append(optionItem);
            });

            //let sortedList = kpiList;
            // if (kpiList != null) {
            //    for (let i = 0; i < sortedList.length; i++) {
            //       let kpiItem = sortedList[i];
            //       let optionItem = $("<option />");
            //       let itemName = kpiItem.Name || "";
            //       //add the project name if we have something.
            //       if (kpiItem.ProjectIdSource != null) {
            //          itemName = kpiItem.ProjectIdSource.Name + " - " + kpiItem.Name;
            //       }
            //       optionItem.val(kpiItem.MqfNumber);

            //       optionItem.text(itemName);
            //       $("#kpiSelectionOption", element).append(optionItem);
            //    }
            // }
            if (callback != null) {
               callback();
            }
            return;
         }
         function GetChartData() {
            var includeSubKpiInChart = $("#includeSubKpiInChart", element).prop("checked");
            var includePreviousMonthData = $("#includePreviousMonth", element).prop("checked");
            var renderType = $("#chartDisplaySelector", element).val();
            var projectId = $("#projectIdToLoad", element).val();
            var groupId = $("#groupIdToLoad", element).val();
            if(groupId == null || groupId < 0 || groupId == "")
            {
               groupId = 0;
            }
            WriteUserPerformanceMessage("Refreshing Chart Data...");
            LoadChartData(includeSubKpiInChart, includePreviousMonthData, projectId, groupId, function (chartData) {
               WriteUserPerformanceMessage("Arranging Chart Data...");
               ParseChartData(chartData, includeSubKpiInChart, renderType,groupId, function (parsedChartData, chartTitle) {
                  WriteUserPerformanceMessage("Drawing Chart Data...");
                  RenderChartData(parsedChartData, includeSubKpiInChart, chartTitle, includePreviousMonthData, function () {
                     let subKpiToLoad = $("#subKpiToShow", element).val();
                     MarkSubKpiInBarChart(subKpiToLoad);
                  });
                  HideUserMessage();
               });
            });
         }
         function LoadChartData(includeSubKpi, includePreviousMonthData, projectIdToUse, groupId,  callback) {
            ShowUserMessage();
            if (includeSubKpi == null) {
               includeSubKpi = false;
            }
            let userId = legacyContainer.scope.TP1Username;
            let projectId = -1;
            let includePreviousMonth = includePreviousMonthData;
            let displayType = GetDisplayByOption();
            let chartTypeValue = GetChartDisplayOption();
            let chartType = 0;
            if (projectIdToUse != null && projectIdToUse != "") {
               projectId = parseInt(projectIdToUse);
            }
            if (chartTypeValue == "trend") {
               chartType = 2;
            }
            curChartData.length = 0;
            if(projectId > 0)
            {
               a$.ajax({
                  type: "GET",
                  service: "C#",
                  async: true,
                  data: {
                     lib: "userprofile",
                     cmd: "getUserPerformanceStats",
                     userid: userId,
                     projectid: projectId,
                     displaytype: displayType,
                     kpionly: !includeSubKpi,
                     includepreviousmonth: includePreviousMonth,
                     charttype: chartType,
                     groupid: groupId
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (jsonData) {
                     if (jsonData.errormessage != null && jsonData.errormessage == "true") {
                        a$.jsonerror(jsonData);
                        return;
                     }
                     else {
                        let returnData = null;
                        WriteUserPerformanceMessage("Parsing the data...");
                        if (jsonData.performanceStatsList != null) {
                           returnData = JSON.parse(jsonData.performanceStatsList).filter(g => g.ProjectId == projectId && (g.GroupId == groupId || groupId == 0));
                           if(includePreviousMonthData == false)
                           {
                              returnData = returnData.filter(i => i.SeriesAssignment == 1);
                           }
                           curChartData = returnData;
                        }
                        if (callback != null) {
                           callback(returnData);
                        }
                     }
                  }
               });
            }
            else
            {
               console.log("No Project to load.  Continuing on.");
               if(callback != null)
               {
                  callback();
               }
            }
            return;
         }
         function ParseChartData(allChartData, includeSubKpiInChart, renderType, groupId, callback) {

            if (includeSubKpiInChart == null) {
               includeSubKpiInChart = false;
            }
            let returnInformation = [];
            let chartTitle = "";
            let projectName = "";
            let groupName = "";
            if (allChartData != null && allChartData.length > 0) {
               projectName = allChartData[0]?.ProjectName;
            }
            if(groupId == null || groupId < 0 || groupId == "")
            {
               groupId = 0
            }
            if(groupId > 0)
            {
               groupName = allChartData[0]?.GroupName;
            }
            if (allChartData != null) {
               switch (renderType) {
                  case "singluarKpi":
                     let mqfNumber = 0;
                     mqfNumber = $("#kpiSelectionOption", element).val();
                     chartTitle = "Single KPI";
                     if (allChartData.length > 0) {
                        chartTitle = projectName;
                     }
                     returnInformation = allChartData.filter(x => x.MqfNumber == mqfNumber);
                     if (returnInformation != null && returnInformation.length > 0 &&
                        returnInformation[0].SeriesName != null && returnInformation[0].SeriesName != "") {

                        chartTitle += " - " + returnInformation[0].SeriesName;
                     }
                     break;
                  default:
                     //returnInformation = allChartData.filter(x => x.SubTypeId ==  0 && ((allSeries == false && item.SeriesAssignment == 1) || allSeries == true));
                     if (includeSubKpiInChart == true) {
                        returnInformation = allChartData;
                     }
                     else {
                        returnInformation = allChartData.filter(x => x.SubTypeId == 0);
                     }
                     chartTitle = "All KPIs";
                     if (projectName != null && projectName != "") {
                        chartTitle += " - " + projectName;
                     }
                     if(groupName != null && groupName != "")
                     {
                        chartTitle += " " + groupName;
                     }
                  break;
               }
            }
            if (callback != null) {
               callback(returnInformation, chartTitle);
            }
            return;
         }
         function RenderChartData(dataToRender, includeSubKpi, chartTitle, includePreviousMonth, callback) {
            gSeriesData.length = 0; //clear out the global data holder.
            chartType = GetChartDisplayOption();
            let connectNulls = GetConnectNullsOption();
            switch (chartType) {
               case "line":
                  dataToRender = SortChartData(dataToRender);
                  RenderLineChart("chartHolder", dataToRender, includeSubKpi, chartTitle, connectNulls);
                  break;
               case "trend":
                  dataToRender = SortChartData(dataToRender);
                  RenderTrendChart("chartHolder", dataToRender, includeSubKpi, chartTitle, includePreviousMonth, connectNulls);
                  break;
               case "bar":
               case "column":
                  dataToRender = SortChartData(dataToRender);
                  RenderBarChart("chartHolder", dataToRender, includeSubKpi, chartTitle, includePreviousMonth);
                  break;
            }
            if (callback != null) {
               callback();
            }
            return;
         }
         function RedrawChart() {
            var chart = $("#chartHolder", element).highcharts();
            chart.redraw();
         }
         function SortChartData(dataToSort) {
            let sortedData = dataToSort;
            sortedData = dataToSort.sort(function (a, b) {
               if (a.ProjectId > b.ProjectId) {
                  return -1;
               }
               else if (a.ProjectId < b.ProjectId) {
                  return 1;
               }
               else if (a.ProjectId == b.ProjectId) {
                  if (a.MqfWeight > b.MqfWeight) {
                     return -1;
                  }
                  else if (a.MqfWeight < b.MqfWeight) {
                     return 1;
                  }
                  else {
                     if (new Date(a.StartDate) < new Date(b.StartDate)) {
                        return -1
                     }
                     else if (new Date(a.StartDate) > new Date(b.StartDate)) {
                        return 1;
                     }
                     else {
                        if(a.SeriesName > b.SeriesName)
                        {
                           return 1;
                        }
                        else if(a.SeriesName < b.SeriesName)
                        {
                           return -1;
                        }
                        else
                        {
                           return 0;
                        }
                     }

                  }
               }
            });
            return sortedData;
         }
         function DetermineBarColorForScore(yMaxValue, kpiScore) {
            let returnValue = legacyContainer.scope.getKPIColorRGB(kpiScore).color;
            if (returnValue == null || returnValue == "white") {
               appLib.getConfigParameterByName("DEFAULT_COLOR_1", function (returnParam) {
                  if (returnParam != null) {
                     returnValue = returnParam.ParamValue;
                  }
               });
            }
            return returnValue;
         }
         function GetChartValuesDisplayFormat() {
            let returnDisplayType = "{point.y: .2f}";
            if (gChartDisplayType == null) {
               gChartDisplayType = "{point.y: .2f}";
               appLib.getConfigParameterByName("CLIENT_SCORING_CALC_TYPE", function (returnParam) {
                  if (returnParam != null && returnParam.ParamValue.toLowerCase() == "stddev") {
                     gChartDisplayType = "{point.y: .4f}";
                  }
               });
            }
            returnDisplayType = gChartDisplayType;
            return returnDisplayType;
         }
         function RenderBarChart(chartHolderId, chartData, includeSubKpi, chartTitle, includePreviousMonth) {
            let minYValue = defaultMinValue;
            let maxYValue = defaultMaxValue;

            let totalIntervals = 100;
            let seriesData = [];
            var categoryList = [];
            var chartDisplay = GetChartDisplayOption();
            if (chartData != null && chartData.length > 0) {
               for (let kpiCounter = 0; kpiCounter < chartData.length; kpiCounter++) {
                  let dataItem = chartData[kpiCounter];

                  if (includeSubKpi || (!includeSubKpi && dataItem.SubTypeId == 0)) {
                     let dataInfo = new Object();
                     let dataPointColor = "green";
                     var seriesName = dataItem.SeriesName;
                     // if(dataItem.GroupName != null && dataItem.GroupName != "")
                     // {
                     //    seriesName += " " + dataItem.GroupName;
                     // }
                     if (includePreviousMonth == true) {
                        if (dataItem.SeriesAssignment == 1) {
                           seriesName += " (Current Month)";
                        }
                        else if (dataItem.SeriesAssignment == 2) {
                           seriesName += " (Previous Month)";
                        }
                     }

                     dataInfo.name = seriesName; //dataItem.SeriesName;
                     dataInfo.data = [];
                     dataInfo.colorByPoint = false;
                     dataInfo.type = chartDisplay;
                     //dataPointColor = DetermineBarColorForScore(maxYValue, dataItem.SeriesValue);
                     dataInfo.color = DetermineBarColorForScore(maxYValue, dataItem.SeriesValue);

                     dataInfo.data.push({
                        name: seriesName, //dataItem.SeriesName,
                        y: dataItem.SeriesValue
                     });

                     let globalDataItem = new Object();
                     globalDataItem.Index = new Date(dataItem.EndDate).getDate();
                     globalDataItem.Series = seriesName;
                     globalDataItem.MqfNumber = dataItem.MqfNumber;
                     globalDataItem.SubTypeId = dataItem.SubTypeId;
                     globalDataItem.ItemDate = new Date(dataItem.StartDate).toLocaleDateString();
                     globalDataItem.RawData = dataItem;

                     gSeriesData.push(globalDataItem);

                     if (dataItem.SeriesValue > maxYValue) {
                        maxYValue = dataItem.SeriesValue;
                     }
                     seriesData.push(dataInfo);
                  }
               }
            }
            else {
               seriesData.push({ name: "No Data", y: 0 });
            }
            //TODO: Make chart object a little more generic where necessary.
            let chartObject = new Object();
            chartObject.chart = new Object();
            chartObject.chart.type = chartDisplay;
            chartObject.chart.zoomType = "xy";
            chartObject.title = new Object();
            chartObject.title.text = chartTitle;
            chartObject.series = seriesData;
            chartObject.xAxis = new Object();
            //chartObject.xAxis.type = "category";
            chartObject.xAxis.categories = [""];
            chartObject.yAxis = new Object();
            // chartObject.yAxis.min = minYValue;
            // chartObject.yAxis.max = maxYValue;
            //chartObject.yAxis.tickInterval = Math.ceil((maxYValue - minYValue) / totalIntervals);
            //chartObject.yAxis.rotation = 270;
            chartObject.yAxis.title = new Object();
            chartObject.yAxis.title.text = "Score";
            chartObject.legend = new Object();
            chartObject.legend.floating = false;
            chartObject.legend.layout = "horizontal";
            chartObject.legend.align = "center";
            chartObject.legend.verticalAlign = "bottom";
            chartObject.legend.height = 100;
            //chartObject.legend.alignColumns = "false";
            chartObject.plotOptions = new Object();
            chartObject.plotOptions.series = new Object();
            chartObject.plotOptions.series.dataLabels = new Object();
            chartObject.plotOptions.series.dataLabels.enabled = true;
            chartObject.plotOptions.series.dataLabels.format = GetChartValuesDisplayFormat();
            //chartObject.plotOptions.series.pointWidth = 100;
            //chartObject.plotOptions.series.maxPointWidth = 200;
            //chartObject.drilldown = new Object();
            chartObject.tooltip = new Object();
            chartObject.tooltip.useHTML = true;
            chartObject.tooltip.formatter = function () {
               return GetTooltipFormatter(this, "bar");
            }

            RenderChart(chartHolderId, chartObject);
         }
         function RenderTrendChart(chartHolderId, chartData, includeSubKpi, chartTitle, includePreviousMonth, connectNulls) {
            //TODO: Determine what the min/max values are for each client.
            //These should be in the configuration parameters table?
            let minYValue = defaultMinValue;
            let maxYValue = defaultMaxValue;
            let totalIntervals = 100;
            let seriesData = [];
            var categoryList = [];

            for (let i = 1; i < 32; i++) {
               categoryList.push(i.toString());
            }
            if (chartData != null && chartData.length > 0) {
               for (let kpiCounter = 0; kpiCounter < chartData.length; kpiCounter++) {
                  let dataItem = chartData[kpiCounter];
                  let seriesColor = "#99CCFF"; //TODO: Determine a default color for the line points.
                  let seriesColorItem = kpiColorAssignments.find(x => x.id == dataItem.MqfNumber);
                  if (seriesColorItem != null) {
                     seriesColor = seriesColorItem.value;
                  }

                  if (includeSubKpi || (!includeSubKpi && dataItem.SubTypeId == 0)) {
                     if (includeSubKpi) {
                        let subSeriesColorItem = subKpiColorAssignments.find(x => x.id == dataItem.MqfNumber && x.subId == dataItem.SubTypeId);
                        if (subSeriesColorItem != null) {
                           sieriesColor = subSeriesColorItem.value;
                        }
                     }
                     let dataInfo = new Object();
                     dataInfo.dashStyle = "Solid";
                     dataInfo.color = seriesColor;
                     let seriesName = dataItem.SeriesName;
                     if (includePreviousMonth == true) {
                        if (dataItem.SeriesAssignment == 1) {
                           seriesName += " (Current Month)";
                        }
                        else if (dataItem.SeriesAssignment == 2) {
                           seriesName += " (Previous Month)";
                           dataInfo.dashStyle = "Dash";
                        }
                     }
                     let itemIndex = seriesData.findIndex(x => x.name == seriesName);
                     if (itemIndex > -1) {
                        dataInfo = seriesData[itemIndex];
                     }
                     else {
                        dataInfo.name = seriesName;
                        dataInfo.data = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
                        //dataInfo.data.length = 31;
                     }

                     let dataIndex = (new Date(dataItem.EndDate).getDate() - 1);
                     dataInfo.data[dataIndex] = dataItem.SeriesValue;

                     let globalDataItem = new Object();
                     globalDataItem.Index = new Date(dataItem.EndDate).getDate();
                     globalDataItem.Series = seriesName;
                     globalDataItem.MqfNumber = dataItem.MqfNumber;
                     globalDataItem.SubTypeId = dataItem.SubTypeId;
                     globalDataItem.ItemDate = new Date(dataItem.StartDate).toLocaleDateString();
                     globalDataItem.RawData = dataItem;

                     gSeriesData.push(globalDataItem);

                     if (dataItem.SeriesValue > maxYValue) {
                        maxYValue = dataItem.SeriesValue;
                     }

                     if (itemIndex == -1) {
                        seriesData.push(dataInfo);
                     }
                     else {
                        seriesData[itemIndex] = dataInfo;
                     }
                  }
               }

            }
            //TODO: Make chart object a little more generic where necessary.`~~
            let chartObject = new Object();
            chartObject.chart = new Object();
            chartObject.chart.type = "line";
            chartObject.chart.zoomType = "xy";
            chartObject.title = new Object();
            chartObject.title.text = chartTitle;
            chartObject.series = seriesData;
            chartObject.xAxis = new Object();
            chartObject.xAxis.categories = categoryList;
            chartObject.yAxis = new Object();
            // chartObject.yAxis.min = minYValue;
            // chartObject.yAxis.max = maxYValue;
            // chartObject.yAxis.tickInterval = Math.ceil((maxYValue - minYValue) / totalIntervals);
            //chartObject.yAxis.rotation = 270;
            chartObject.yAxis.title = new Object();
            chartObject.yAxis.title.text = "Score";
            chartObject.legend = new Object();
            chartObject.legend.layout = "horizontal";
            chartObject.legend.align = "center";
            chartObject.legend.verticalAlign = "bottom";
            chartObject.legend.floating = false;
            chartObject.plotOptions = new Object();
            chartObject.plotOptions.series = new Object();
            chartObject.plotOptions.series.connectNulls = connectNulls;
            chartObject.plotOptions.series.dataLabels = new Object();
            chartObject.plotOptions.series.dataLabels.enabled = true;
            chartObject.plotOptions.series.dataLabels.format = GetChartValuesDisplayFormat();
            chartObject.tooltip = new Object();
            chartObject.tooltip.useHTML = true;
            chartObject.tooltip.formatter = function () {
               return GetTooltipFormatter(this, "line");

            }
            RenderChart(chartHolderId, chartObject);
         }
         function RenderLineChart(chartHolderId, chartData, includeSubKpi, chartTitle, connectNulls) {
            console.log("RenderLineChart()");
         }
         function RenderChart(chartHolderId, chartJson) {
            Highcharts.chart(chartHolderId, chartJson);
         }
         function GetDisplayByOption() {
            let returnValue = $("#displayScale", element).val();
            if (returnValue.trim() == "") {
               returnValue = "Scored";
               $("#displayScale", element).val("Scored");
            }
            return returnValue;
         }
         function GetChartDisplayOption() {
            let returnValue = $("#chartTypeDisplaySelector", element).val();
            if (returnValue.trim() == "") {
               returnValue = "column";
               $("#chartTypeDisplaySelector", element).val("column");
            }
            return returnValue;
         }
         function GetTooltipFormatter(item, chartType) {
            if (item == null) {
               return "<b>No tooltip data found.</b>";
            }
            let dateText = item.x || "";
            let dataItem = gSeriesData.find(i => i.Index == item.key && i.Series == item.series.name);
            if (dataItem == null) {
               dataItem = gSeriesData.find(i => i.Series == item.series.name);
            }
            if (dataItem != null) {
               if (dataItem.ItemDate != null && dataItem.ItemDate != "") {
                  dateText = new Date(dataItem.ItemDate).toLocaleDateString();
                  switch (chartType.toLowerCase()) {
                     case "bar":
                        if (dataItem.RawData != null) {
                           dateText = new Date(dataItem.RawData.StartDate).toLocaleDateString() + "-" + new Date(dataItem.RawData.EndDate).toLocaleDateString();
                        }
                        break;
                  }
               }
            }
            let returnString = "<i>" + dateText + "</i><hr><b>" + item.series.name + "</b>&nbsp;&nbsp; <i>" + appLib.FormatScore(item.y) + "</i>";
            return returnString;

         }
         function HandleDisplayTypeChange(value, callback) {
            ClearSubKpiToDisplay();
            if (value == "allKpi") {
               HideKpiSection();
            }
            else {
               ShowKpiSection();
            }
            if (callback != null) {
               callback();
            }
            return;
         }
         function HandleChartTypeChange(value, callback) {
            if (value == "column" || value == "bar") {
               HideConnectBreakOptions();
            }
            else {
               ShowConnectBreakOptions();
            }
            if (callback != null) {
               callback();
            }
            return;
         }
         function GetConnectNullsOption() {
            return $("#connectNullBreaks", element).prop("checked");
         }
         function HideUserMessage() {
            $("#userMessageHolder", element).hide();
         }
         function ShowUserMessage() {
            $("#userMessageHolder", element).show();
         }
         function HideFilters() {
            $("#chartOptionsFilters", element).hide();
         }
         function ShowFilters() {
            $("#chartOptionsFilters", element).show();
         }
         function HideChartTypeOption() {
            $("#chartTypeDisplaySelector", element).hide();
         }
         function ShowChartTypeOption() {
            $("#chartTypeDisplaySelector", element).show();
         }
         function HideKpiSection() {
            $("#kpiFilterHolder", element).hide();
         }
         function ShowKpiSection() {
            $("#kpiFilterHolder", element).show();
         }
         function HideConnectBreakOptions() {
            $("#connectBreaksOptionHolder", element).hide();
         }
         function ShowConnectBreakOptions() {
            $("#connectBreaksOptionHolder", element).show();
         }
         function WriteUserPerformanceMessage(messageText, callback) {
            console.log(`UserPerformance Message: ${messageText}`);
            HideUserMessage();
            $("#userPerformanceLoadingMessage", element).empty();
            $("#userPerformanceLoadingMessage", element).html(messageText);
            ShowUserMessage();
            if (callback != null) {
               callback();
            }
      }
         function MarkSubKpiInBarChart(subKpiNameToFind) {
            var subName = subKpiNameToFind;
            var chart = $("#chartHolder", element).highcharts();
            var series = chart.series;
            for (let i = 0; i < chart.series.length; i++) {
               let isVisible = (series[i].name == subName) || (series[i].name.toLowerCase().includes(" overall")) || (subKpiNameToFind == "");
               series[i].setVisible(isVisible);
            }
            chart.redraw();
         }
         function ClearSubKpiToDisplay() {
            $("#subKpiToShow", element).val("");
         }
         function WriteNoAccess() {
            HideFilters();
            HideUserMessage();
            $("#chartHolder", element).empty();
            $("#chartHolder", element).append("You do not have access to this information.");
         }
         scope.load = function (callback) {
            console.log("Directive: UserPerformance Load() with callback");
            ShowUserMessage();
            Initalize();
            GetChartData(function () {
               HideUserMessage();
               if (callback != null) {
               }
            });
         }

         scope.load(function () {
            console.log("Directive: UserPerformance Load()");
            HideUserMessage();
         });

         ko.postbox.subscribe("RedrawCharts", function () {

            //TODO: Handle this better and use cached information.
            GetChartData(function () {
               HideUserMessage();
               if (callback != null) {
               }
            });
         });
         ko.postbox.subscribe("UserPerformanceLoad", function (itemType) {
            // LoadEvents();
            // gItemType = itemType;
            // HandleLoads(true);
            scope.load();
         });
         ko.postbox.subscribe("UserPerformanceLoadProjectKpi", function (publishInfoObject) {
            ShowUserMessage("Loading analysis data...");
            $("#projectIdToLoad", element).val(publishInfoObject.ProjectId);
            $("#groupIdToLoad", element).val(publishInfoObject.GroupId) || 0;

            $("#chartDisplaySelector", element).val("singularKpi");
            $("#chartTypeDisplaySelector", element).val("trend");
            $("#displayScale", element).val("Scored");
            //$("#includePreviousMonth", element).prop("checked", true);
            $("#includePreviousMonth", element).prop("checked", false);
            $("#connectNullBreaks", element).prop("checked", true);

            ShowKpiSection();
            ShowConnectBreakOptions();
            let hasKpiSelectionChanged = false;

            if (publishInfoObject.MqfNumber < 0) {
               $("#kpiSelectionOption", element).val(0);
               hasKpiSelectionChanged = true;
            }
            else {
               $("#chartDisplaySelector", element).val("singluarKpi");
               $("#kpiSelectionOption", element).val(publishInfoObject.MqfNumber);
               ShowKpiSection();
            }

            if (publishInfoObject.SubTypeId != null) {
               $("#includeSubKpiInChart", element).prop("checked", true);
               $("#subKpiToShow", element).val(publishInfoObject.KpiName);
               $("#includeSubKpiInChart", element).change();
            }
            else {
               ClearSubKpiToDisplay();
               hasKpiSelectionChanged = true;

            }
            if(hasKpiSelectionChanged)
            {
               window.setTimeout(function(){
                  $("#kpiSelectionOption", element).change();
               }, 100);
            }
         });
         scope.$on("userDashboardLoad", function () {
            scope.load();
         });
      }
   }
}]);
