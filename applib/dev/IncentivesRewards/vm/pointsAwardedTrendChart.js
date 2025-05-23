angularApp.directive("ngPointsAwardedTrendChart", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/IncentivesRewards/view/PointsAwardedTrendChart.htm?' + Date.now(),
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
         let dataLoadType = null;
         SetAttrValues(attrs);
         let initialTrendChartData = [];
         let upcomingColorValue = "green";
         /* Event Handling START */
         /* Event Handling END */
         scope.Initialize = function () {
            HideAll();
          SetDatePickers()
         };
         function SetDatePickers() {
         }
         function SetAttrValues(attrs) {
            if (attrs.chartType != null || attrs.charttype != null) {
               dataLoadType = (attrs.chartType || attrs.charttype);
            }
         }
         /* Data Loading START */
         function LoadDirective(callback, forceReload) {
            HideAll();
            LoadChartData(callback, forceReload);
         }
         /* Data Loading END */
         function LoadChartData(callback, forceReload) {
            //GetChartData(callback, forceReload);
            let includeFuture = true;
            GetChartData(function (dataToRender) {
               RenderChartData(function () {
                  if (callback != null) {
                     callback();
                  }
               }, dataToRender,includeFuture);
            }, forceReload, includeFuture);
         }
         /* Data Pulls START */
         function GetChartData(callback, forceReload, includeFuture) {
            if (forceReload == null) {
               forceReload = false;
            }
            if(includeFuture == null)
            {
               includeFuture = false;
            }
            let dataCommand = "getIRPASPointsByDay";
            let postboxCommand = null;
            switch (dataLoadType.toLowerCase()) {
               case "perDay".toLowerCase():
                  dataCommand = "getIRPASPointsByDay";
                  postboxCommand = "IRPASRewardsToday";
                  break;
               case "perMonth".toLowerCase():
                  dataCommand = "getIRPASPointsByMonth";
                  break;
            }
            a$.ajax({
               type: "POST",
               service: "C#",
               async: true,
               data: {
                  lib: "selfserv",
                  cmd: dataCommand,
                  includeFuture: includeFuture,
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (data) {
                  let returnData = JSON.parse(data.totalPointsAwarded);
                  initialTrendChartData.length = 0;
                  initialTrendChartData = returnData;
                  if(postboxCommand != null)
                  {
                     let summaryData = [... returnData];
                     ko.postbox.publish(postboxCommand, summaryData);
                  }
                  if (callback != null) {
                     callback(returnData);
                  }
               }
            });
            if (callback != null) {
               callback(returnData);
            }
         }
         /* Data Pulls END */
         /* Data Rendering START */
         function RenderChartData(callback, dataToRender, includeUpcoming) {
            if (dataToRender == null) {
               dataToRender = initialTrendChartData;
            }
            if(includeUpcoming == null)
            {
               includeUpcoming = false;
            }
            if (dataToRender != null && dataToRender.length > 0) {
               let seriesData = [];
               let seriesRecordCount = 30;
               let chartTitle = "Points Awarded";
               let categoriesList = [];
               let chartDataObjectInfo = null;
               let upcomingCount = 7;
               switch (dataLoadType.toLowerCase()) {
                  case "perDay".toLowerCase():
                     chartTitle = "Points Awarded Per Day";
                     chartDataObjectInfo = GetDailyTrendChartSeriesCategoryData(dataToRender, seriesRecordCount, upcomingCount);
                     break;
                  case "perMonth".toLowerCase():
                     chartTitle = "Points Awarded Per Month";
                     seriesRecordCount = 13;
                     chartDataObjectInfo = GetMonthlyTrendChartSeriesCategoryData(dataToRender, seriesRecordCount, upcomingCount);
                     break;
               }
               if (chartDataObjectInfo != null) {
                  if(chartDataObjectInfo.series.length > 0)
                  {
                     seriesData = chartDataObjectInfo.series;
                  }
                  if(chartDataObjectInfo.categories.length > 0)
                  {
                     categoriesList = chartDataObjectInfo.categories;
                  }
               }
               let chartDef = {
                  chart: {
                     type: "line",
                     zoomType: "xy",
                     scrollablePlotArea: {
                        minWidth: 400,
                        scrollPositionX: 1
                    }
                  },
                  title: {
                     text: chartTitle,
                  },
                  xAxis: {
                     title: {
                        text: "Date",
                     },
                     scrollbar: {
                        enabled: true,
                     },
                     categories: categoriesList,
                  },
                  yAxis: {
                     title: {
                        text: "Points Awarded",
                     },
                     scrollbar: {
                        enabled: true,
                     },
                  },
                  plotOptions: {
                     dataLabels: {
                        enabled: false,
                     },
                     series: {
                        dataLabels: {
                           enabled: false,
                        },
                        connectNulls: true,
                        scrollbar: {
                           enabled: true,
                        },
                     },
                  },
                  series: seriesData,
                  credits: {
                     enabled: false,
                  }
               };


               let chartToObject = $("#pointsAwardedTrendChart", element)[0];
               if (chartToObject != null) {
                  Highcharts.chart(chartToObject, chartDef);
               }
               else {
                  console.error("CHART TO OBJECT NOT FOUND.");
                  Highcharts.chart("pointsAwardedTrendChart", chartDef);
               }
            }
            if (callback != null) {
               callback();
            }
         }
         function GetDailyTrendChartSeriesCategoryData(dataToRender, seriesRecordCount, upcomingCount) {
            if(upcomingCount == null)
            {
               upcomingCount = 0;
            }
            let returnData = {
               categories: [],
               series: [],
            };
            if (dataToRender[0]?.RecordType != null) {
               let categoriesList = [];
               let seriesData = [];
               let possibleSeriesNamesList = [];
               categoriesList.length = seriesRecordCount;

               //setup a list of items to filter and push to the data to display for the chart
               dataToRender.forEach(function (item) {
                  if (possibleSeriesNamesList.findIndex(i => i == item.RecordType) < 0) {
                     possibleSeriesNamesList.push(item.RecordType);
                  }
               });
               //set the categories information
               for (let counter = 0; counter < seriesRecordCount; counter++) {
                  let today = new Date();
                  let tempDate = today.setDate(today.getDate() - (seriesRecordCount - counter));
                  categoriesList[counter] = new Date(tempDate).toLocaleDateString();
               }

               if(upcomingCount > 0)
               {
                  for(let counter = 0; counter < upcomingCount; counter++)
                  {
                     let today = new Date();
                     let tempDate = today.setDate(today.getDate() + counter);
                     categoriesList.push(new Date(tempDate).toLocaleDateString());
                  }
               }
               possibleSeriesNamesList.forEach(function (seriesName) {
                  let seriesDefaultArray = [];
                  seriesDefaultArray.length = seriesRecordCount;
                  let initSeriesData = {
                     name: seriesName,
                     data: seriesDefaultArray,
                     series: {
                        line: {
                           zIndex: 1,
                        }
                     },
                  }
                  let dataPointsForSeries = dataToRender.filter(i => i.RecordType == seriesName);

                  for(let catIndex = 0; catIndex < categoriesList.length; catIndex++)
                  {
                     let pointsForDate = 0;
                     let allPoints = dataPointsForSeries.filter(i => new Date(i.AwardDate).toLocaleDateString() == new Date(categoriesList[catIndex]).toLocaleDateString());
                     allPoints.forEach(function(data){
                        pointsForDate += parseFloat(data.TotalPoints);
                     });
                      if(new Date(categoriesList[catIndex]) == new Date())
                      {
                        initSeriesData.data[catIndex] = pointsForDate;
                      }
                     if(seriesName.toLowerCase() != "Upcoming".toLowerCase() && new Date(categoriesList[catIndex]) > new Date())
                     {
                        initSeriesData.data[catIndex] = null;
                     }
                     else {
                        initSeriesData.data[catIndex] = pointsForDate;
                     }
                     initSeriesData.series.line.zIndex = (catIndex+1);
                  }
                  if(seriesName.toLowerCase() == "Upcoming".toLowerCase())
                  {
                     initSeriesData.color = upcomingColorValue;
                     initSeriesData.dashStyle = "ShortDash";
                     initSeriesData.series.line.zIndex = 0;

                     for(let sIndex = 0; sIndex < initSeriesData.data.length; sIndex++)
                     {
                        if(initSeriesData.data[sIndex] <= 0)
                        {
                           initSeriesData.data[sIndex] = null;
                        }
                     }
                     let todayAward = initialTrendChartData.find(i=> new Date(i.AwardDate).toLocaleDateString() == new Date().toLocaleDateString());
                     let todayIndex = categoriesList.findIndex(i => new Date(i).toLocaleDateString() == new Date().toLocaleDateString());
                     if(todayIndex >= 0 && todayAward != null)
                     {
                        initSeriesData.data[todayIndex] = parseFloat(todayAward.TotalPoints);
                     }
                  }
                  seriesData.push(initSeriesData);
               });

               returnData.categories = categoriesList;
               returnData.series = seriesData;
            }
            return returnData;
         }
         function GetMonthlyTrendChartSeriesCategoryData(dataToRender, seriesRecordCount, upcomingCount) {
            if(upcomingCount == null)
            {
               upcomingCount = 0;
            }
            let returnData = {
               categories: [],
               series: [],
            };

            if (dataToRender[0]?.RecordType != null) {
               let categoriesList = [];
               let seriesData = [];
               let possibleSeriesNamesList = [];
               categoriesList.length = seriesRecordCount;

               //setup a list of items to filter and push to the data to display for the chart
               dataToRender.forEach(function (item) {
                  if (possibleSeriesNamesList.findIndex(i => i == item.RecordType) < 0) {
                     possibleSeriesNamesList.push(item.RecordType);
                  }
               });
               //set the categories information
               for (let counter = 0; counter < seriesRecordCount; counter++) {
                  let today = new Date();
                  let tempDate = new Date(today.setMonth(today.getMonth() - (seriesRecordCount-(counter+1))));

                  let tempCat = new Date(tempDate.getFullYear(), tempDate.getMonth(), 1);

                  categoriesList[counter] = tempCat.toLocaleDateString();
               }
               possibleSeriesNamesList.forEach(function (seriesName) {
                  let seriesDefaultArray = [];
                  seriesDefaultArray.length = seriesRecordCount;
                  let initSeriesData = {
                     name: seriesName,
                     data: seriesDefaultArray,
                  }
                  let dataPointsForSeries = dataToRender.filter(i => i.RecordType == seriesName);

                  for(let catIndex = 0; catIndex < categoriesList.length; catIndex++)
                  {
                     let pointsForDate = 0;
                     let allPoints = dataPointsForSeries.filter(i => new Date(i.AwardDate).toLocaleDateString() == new Date(categoriesList[catIndex]).toLocaleDateString());
                     allPoints.forEach(function(data){
                        pointsForDate += parseFloat(data.TotalPoints);
                     });
                     initSeriesData.data[catIndex] = pointsForDate;
                  }
                  seriesData.push(initSeriesData);
               });

               returnData.categories = categoriesList;
               returnData.series = seriesData;
            }
            return returnData;
         }

         /* Data Rendering END */
         /* Editor Loading START */
         /* Editor Loading END */
         /* Editor Validation & Saving START */
         /* Editor Validation & Saving END */
         /* Sorting Options START */
         /* Sorting Options END */
         /* Utility Functions START */
         /* Utility Functions END */
         /* Show/Hide START */
         function HideAll() {
         }
         /* Show/Hide END */
         scope.load = function () {
            scope.Initialize();
            LoadDirective(null, true);
         };

         ko.postbox.subscribe("CurrentIRPADataLoaded", function () {
            initialTrendChartData.length = 0;
            scope.load();
         });
         // ko.postbox.subscribe("CurrentIRPADataLoaded_Areas", function(data){
         //    availableIrpsaAreas.length = 0;
         //    availableIrpsaAreas = data;
         //    LoadDirective();
         // });
         // ko.postbox.subscribe("CurrentIRPADataLoaded_SubAreas", function(data){
         //    // availableIrpsaAreas.length = 0;
         //    // availableIrpsaAreas = data;
         //    LoadDirective();
         // });
         // ko.postbox.subscribe("CurrentIRPADataLoaded_Intervals", function(data){
         //    availableIntervalTypes.length = 0;
         //    availableIntervalTypes = data;
         //    LoadDirective();
         // });
      }
   };
}]);
