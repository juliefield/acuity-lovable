angularApp.directive("ngCurrentPointsAwardChart", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/IncentivesRewards/view/currentPointsAwardChart.htm?' + Date.now(),
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
         let availableIrpsaAreas = [];
         let availableIntervalTypes = [];         
         let initialChartData = [];
         /* Event Handling START */         
         /* Event Handling END */
         scope.Initialize = function () {
            HideAll();
         };
         function SetDatePickers() {
         }
         /* Data Loading START */
         function LoadDirective() {
            HideAll();
            LoadChartData();
         }
         /* Data Loading END */
         function LoadChartData(callback, forceReload)
         {
            GetChartData(function(dataToRender){
               RenderChartData(function(){                  
                  if(callback != null)
                  {
                     callback();
                  }
               }, dataToRender);
            }, forceReload);
         }
         /* Data Pulls START */
         function GetChartData(callback, forceReload)
         {
            if(forceReload == null)
            {
               forceReload = false;
            }
            let returnData = initialChartData;
            if(callback != null)
            {
               callback(returnData);
            }
         }
         /* Data Pulls END */
         /* Data Rendering START */
         function RenderChartData(callback, dataToRender)
         {
            if(dataToRender == null)
            {
               dataToRender = initialChartData;
            }
            //Exclude the reoccurring items
            dataToRender = dataToRender.filter(i => i.IsReoccurring == false); 

            let intervalMin = 1;
            let intervalMax = 1;
            let seriesData =  [];

            dataToRender.forEach(function(item){            
               if(parseInt(item.IntervalNumber) > intervalMax)
               {
                  intervalMax = parseInt(item.IntervalNumber);
               }
            });
            // if(intervalMax < 400)
            // {
            //    intervalMax = 400;
            // }

            dataToRender.forEach(function(item){
               let seriesName = item.IrpasAreaId;
               let areaObject = availableIrpsaAreas.find(i => i.IrpasAreaId == item.IrpasAreaId);               
               if(areaObject != null)
               {
                  seriesName = areaObject.Name;
                  // if(item.SubAreaName != null)
                  // {
                  //    seriesName = `${areaObject.Name} - ${item.SubAreaName}`
                  // }
               }
               
               if(seriesData.findIndex(s => s.name == seriesName) < 0)
               {
                  let dataArray = [];
                  dataArray.length = intervalMax;

                  seriesData.push({
                     name: seriesName,
                     data: dataArray,
                  });
               }

               let seriesDataItem = {
                  x: item.IntervalNumber,
                  y: item.IntervalAmount,
               };               
               seriesData[seriesData.findIndex(s => s.name == seriesName)].data[item.IntervalNumber-1] = seriesDataItem;
            });
            //add total information to the series data.
            let totalDataArray = [];
            totalDataArray.length = intervalMax;
            let itemTotalAmount = 0;

            for(let tIndex = 0; tIndex < intervalMax; tIndex++)
            {
               let itemsObject = initialChartData.filter(i => i.IntervalNumber == (tIndex+1));               
               itemsObject.forEach(function(item){
                  itemTotalAmount += item.IntervalAmount;
               });

               totalDataArray[tIndex] = {
                  x: tIndex+1,
                  y: itemTotalAmount,
               };
            }
            //TODO: Handle a way to include/exclude the total by day in the data.
            let includeTotalData = false;
            if(includeTotalData == true)
            {
               seriesData.push({
                  name: "Total",
                  data: totalDataArray,
                  color: `#C0C0C0`,
                  dashStyle: `Dash`,
                  dataLabels: {
                     enabled: true,
                  },
               });
            }

            //fill all of the data items with an x value
            seriesData.forEach(function(seriesItem){
               for(let dIndex = 0; dIndex < seriesItem.data.length; dIndex++)
               {
                  if(seriesItem.data[dIndex] == null)
                  {
                     seriesItem.data[dIndex] = {x: dIndex+1, y: 0};
                  }
               }
            });

            let chartDef = {
               chart: {
                  type:"line",
                  zoomType:"xy",
                  scrollablePlotArea: {
                     minWidth: 750,
                     scrollPositionX: 1
                 }
               },
               title: {
                  text:"Points Award Chart",
               },
               xAxis: {
                  title: {
                     text:"Days",
                  },
                  scrollbar: {
                     enabled: true,
                  },
               },
               yAxis: {
                  title: {
                     text:"Points Awarded",
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
               },
            };
            Highcharts.chart("currentPointsAwardChart", chartDef)

            if(callback != null)
            {
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
         /* Utility Functions END */
         /* Show/Hide START */
         function HideAll() {
         }
         /* Show/Hide END */

         scope.load = function (forceInitalize) {
            scope.Initialize();
            LoadDirective();
         };

         ko.postbox.subscribe("CurrentIRPADataLoaded", function (data) {
            initialChartData.length = 0;
            initialChartData = data;
            scope.load()            
         });
         ko.postbox.subscribe("CurrentIRPADataLoaded_Areas", function(data){
            availableIrpsaAreas.length = 0;
            availableIrpsaAreas = data;
            LoadDirective();
         });
         ko.postbox.subscribe("CurrentIRPADataLoaded_SubAreas", function(data){
            // availableIrpsaAreas.length = 0;
            // availableIrpsaAreas = data;
            LoadDirective();
         });
         ko.postbox.subscribe("CurrentIRPADataLoaded_Intervals", function(data){
            // availableIntervalTypes.length = 0;
            // availableIntervalTypes = data;
            LoadDirective();
         });
         
      }
   };
}]);