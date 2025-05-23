angularApp.directive("ngMyTeamMemberDisplayInfo", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/TeamDashboard1/view/myTeamMemberDisplayInfo.htm?' + Date.now(),
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
         let avatarBaseUrl = window.location.protocol + "//" + window.location.hostname + "/applib/css/images/avatars/";
         let defaultAvatarUrl = window.location.protocol + "//" + window.location.hostname + "/jq/avatars/empty_headshot.png";
         let userIdToLoad = null;
         let currentUserObject = null;
         let userChartData = [];
         let userCoachingData = [];
         let coachesList = [];
         //chart stuffs start
         let defaultMinValue = 0;
         let defaultMaxValue = 0;
         let gChartDisplayType = null;
         //chart stuffs end

         /* Event Handling START */
         
         /* Event Handling END */
         scope.Initialize = function () {
            HideAll();
            GetMinMaxDefaultValues();
         };
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
         /* Data Loading START */
         function LoadUserSelectedInformation(callback, userId, forceReload)
         {
            if(userId == null && currentUserObject != null)
            {
               userId = currentUserObject.UserId;
               RenderBasicUserInformation(null, userId);
               LoadUserKpiChartingData(null, userId, forceReload)            
               LoadUserCoachingData(null, userId, forceReload);
            }
            
         }
         function LoadUserCoachingData(callback, userId, forceReload)
         {
            GetUserCoachingData(function(listToRender){
               RenderUserCoachingData(callback, listToRender)
            }, userId, forceReload);
         }
         function LoadUserKpiChartingData(callback, userId, forceReload)
         {
            GetUserKpiChartingData(function(chartData){
               RenderUserKpiChart(callback, chartData);
            }, userId, forceReload);
         }
         /* Data Loading END */
         /* Data Pulls START */
         function GetUserCoachingData(callback, userId, forceReload)
         {
            if(forceReload == null)
            {
               forceReload = false;
            }
            if(userId == null)
            {
               userId = userIdToLoad;
            }
            if(userCoachingData != null && userCoachingData.length > 0 && forceReload == false)            
            {
               if(callback != null)
               {
                  callback(userCoachingData);
               }
            }
            else
            {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "userprofile",
                     cmd: "getAllJournalEntriesForUser",
                     userid: userId,
                     deepload: false
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     try{
                        let returnData = JSON.parse(data.userJournalEntries);
                        userCoachingData.length = 0;
                        for (let i = 0; i < returnData.length; i++) {
                           userCoachingData.push(returnData[i]);
                        }
                        if (callback != null) {
                           callback(returnData);
                        }
                     }
                     catch(e) {
                        console.error(e);
                        console.error("ERR:\n" + JSON.stringify(e));
                        console.info("ERROR IN COACHING\n");
                        console.info(JSON.stringify(data.userJournalEntries));
                        console.info(data.userJournalEntries);
                        if(callback != null)
                        {
                           callback(userCoachingData);
                        }
                     }
                  }
               });
            }
         }
         function GetUserKpiChartingData(callback, userId, forceReload, startDate, endDate, projectId, groupId)
         {
            if(startDate == null)
            {
               startDate = legacyContainer.scope.filters.StartDate;
            }
            if(endDate == null)
            {
               endDate = legacyContainer.scope.filters.EndDate;
            }
            if(projectId == null)
            {
               projectId = legacyContainer.scope.filters.Project;
            }
            if(projectId == null || projectId == "")
            {
               projectId = 1;
            }
            if(groupId == null)
            {
               groupId = legacyContainer.scope.filters.Group;
            }
            if(groupId == null || groupId == "")
            {
               groupId = 0;
            }
            let includePreviousMonthData = false;
         // if(userChartData != null && userChartData.length > 0 && forceReload == false)            
            // {
            //    if(callback != null)
            //    {
            //       callback(userChartData);
            //    }
            // }
            // else
            // {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "userprofile",
                     cmd: "getUserPerformanceStats",
                     userid: userId,
                     projectid: projectId,
                     displaytype: "Scored",
                     kpionly: true,
                     includepreviousmonth: includePreviousMonthData,
                     charttype: 0,
                     groupid: groupId
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                        if (data.performanceStatsList != null) {
                           returnData = JSON.parse(data.performanceStatsList).filter(g => g.ProjectId == projectId && (g.GroupId == groupId || groupId == 0));
                           if(includePreviousMonthData == false)
                           {
                              returnData = returnData.filter(i => i.SeriesAssignment == 1);
                           }
                           userChartData = returnData;
                        }
                        if (callback != null) {
                           callback(returnData);
                        }   
                  }
               });
            //}
         }
         /* Data Pulls END */
         /* Data Rendering START */
         function RenderBasicUserInformation(callback)
         {
            let userId = userIdToLoad || "";
            let userDisplayName = userIdToLoad || "";
            if(currentUserObject != null)
            {
               userId = currentUserObject.UserId;
               userDisplayName = currentUserObject.UserFullName;
            }

            $("#lblUserId", element).text(userDisplayName);
            $("#txtUserIdLoaded", element).val(userId);
         }
         function RenderUserKpiChart(callback, dataToLoad)
         {
            RenderBarChart("userCurrentKpiBarChart", dataToLoad, false, "", false);
            if(callback != null)
            {
               callback();
            }
         }
         function RenderUserCoachingData(callback, listToRender)
         {
            if(listToRender == null)
            {
               listToRender = userCoachingData;
            }
            $("#userCoachingData", element).empty();
            $("#userSidekickRecordsFound",element).empty();
            $("#userSidekickRecordsFound",element).text(listToRender.length);
            let coachingRecordsOverviewHolder = $(`<div class="user-display-coaching-all-holder" />`);
            for(let cIndex =0; cIndex < listToRender.length; cIndex++)
            {
               let journalObject = listToRender[cIndex];

               let coachingRowHolder = $(`<div class="user-display-coaching-row" />`);
               let recordDateHolder = $(`<div class="user-display-coaching-item date-holder" />`);
               let recordTypeHolder = $(`<div class="user-display-coaching-item record-type-holder" />`);
               let coachNameHolder =  $(`<div class="user-display-coaching-item coach-name-holder" />`);
               let coachingButtonsHolder =  $(`<div class="user-display-coaching-item button-holder" />`);

               recordDateHolder.append(new Date(journalObject.RecDate).toLocaleDateString());
               recordTypeHolder.append(journalObject.Reason);
               let coachName = journalObject.EntBy;
               coachName = GetCoachName(coachName);
               coachNameHolder.append(coachName);

               coachingButtonsHolder.append("GO");

               coachingRowHolder.append(recordDateHolder);
               coachingRowHolder.append(recordTypeHolder);
               coachingRowHolder.append(coachNameHolder);
               coachingRowHolder.append(coachingButtonsHolder);

               coachingRecordsOverviewHolder.append(coachingRowHolder);
            }

            $("#userCoachingData", element).append(coachingRecordsOverviewHolder);
            if(callback != null)
            {
               callback();
            }
         }
         /* Data Rendering END */
         /* Data Handling START */
         function GetCoachName(userIdToFind)
         {
            let returnValue = userIdToFind;
            let coachObject = coachesList.find(u => u.UserId == userIdToFind);

            if(coachObject == null)
            {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "selfserve",
                     cmd: "getUserProfile",
                     userid: userIdToFind
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let returnData = JSON.parse(data.userFullProfile);
                     coachesList.push(returnData);
                     coachObject = returnData;
                  }
               });
            }
            if(coachObject != null)
            {
               returnValue = coachObject.UserFullName;
            }
            return returnValue;
         }
         /* Data Handling END */
         /* Chart Rendering START */
         function RenderBarChart(chartHolderId, chartData, includeSubKpi, chartTitle, includePreviousMonth) {
            let minYValue = defaultMinValue;
            let maxYValue = defaultMaxValue;

            let totalIntervals = 100;
            let seriesData = [];
            var categoryList = [];
            var chartDisplay = "column"; //GetChartDisplayOption();
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

                     //gSeriesData.push(globalDataItem);

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
            chartObject.chart.height = 175;
            chartObject.chart.width = null;
            chartObject.title = new Object();
            chartObject.title.text = chartTitle;
            chartObject.series = seriesData;
            chartObject.xAxis = new Object();            
            //chartObject.xAxis.type = "category";
            chartObject.xAxis.categories = [""];            
            chartObject.yAxis = new Object();
            //chartObject.yAxis.min = minYValue;
            //chartObject.yAxis.max = maxYValue;
            //chartObject.yAxis.tickInterval = Math.ceil((maxYValue - minYValue) / totalIntervals);
            //chartObject.yAxis.rotation = 270;
            chartObject.yAxis.title = new Object();
            chartObject.yAxis.title.text = "Score";
            chartObject.legend = new Object();
            chartObject.legend.floating = false;
            chartObject.legend.layout = "vertical";
            chartObject.legend.align = "left";
            chartObject.legend.verticalAlign = "bottom";
            // chartObject.legend.layout = "horizontal";
            // chartObject.legend.align = "center";
            // chartObject.legend.verticalAlign = "bottom";
            //chartObject.legend.height = 50;            
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
         function RenderChart(chartHolderId, chartJson) {
            Highcharts.chart(chartHolderId, chartJson);
         }
         function GetTooltipFormatter(item, chartType) {
            if (item == null) {
               return "<b>No tooltip data found.</b>";
            }            
            let returnString = "<div><hr><b>" + item.series.name + "</b>&nbsp;&nbsp; <i>" + appLib.FormatScore(item.y) + "</i><hr></div>";
            return returnString;

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
         /* Chart Rendering END */
         /* Hide/Show START */
         function HideAll() {
            HideUserChart();
            HideUserCoachingList();
         }
         function ShowUserChart()
         {
            $("#userKpiChart", element).show();
         }
         function HideUserChart()
         {
            $("#userKpiChart", element).hide();
         }
         function ShowUserCoachingList()
         {
            $("#userCoachingData", element).show();
         }
         function HideUserCoachingList()
         {
            $("#userCoachingData", element).show();
         }
         /* Hide/Show END */
         /* User Message Writing START */
         /* User Message Writing END */
         scope.load = function () {
            //console.info("TeamMemberDisplay: scope.load()");
            scope.Initialize();
            LoadUserSelectedInformation();
         };
         ko.postbox.subscribe("myTeamOverviewUserScoreToggle", function (userToRenderObject) {
            let userId = "";
            currentUserObject = null;
            userIdToLoad = null;
            userChartData.length = 0;
            userCoachingData.length = 0;
            if(userToRenderObject != null)
            {
               userIdToLoad = userToRenderObject.UserId;
               currentUserObject = userToRenderObject;
            }
            scope.load();
         });
         ko.postbox.subscribe("ResetDirective", function(){
            userChartData.length = 0;
            userCoachingdata.length = 0;
            RenderUserKpiChart();
            RenderUserCoachingData();
         });
      }
   };
}]);