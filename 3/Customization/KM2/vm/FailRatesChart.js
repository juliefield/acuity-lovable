angularApp.directive("ngFailRatesChart", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/3/Customization/KM2/view/FailRatesChart.htm?' + Date.now(),
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
         let hasDetails = false;
         SetAttrValues(attrs);
         let initialData = [];
         let failRatesData = [];
         /* Event Handling START */
         /* Event Handling END */
         function Initialize() {
            HideAll();
            SetDatePickers();
            //RenderDirectiveFooter();
         };
         function SetDatePickers() {
         }
         function SetAttrValues(attrs)
         {
            if(attrs.dataType != null || attrs.datatype != null)
            {
               dataLoadType = (attrs.dataType || attrs.datatype);
            }
            if(attrs.hasDetails != null || attrs.hasdetails != null)
            {
               hasDetails = (attrs.hasDetails || attrs.hasDetails);
            }
         }
         /* Data Loading START */
         function LoadDirective() {
            HideAll();
            LoadRatesChart();
         }
         function LoadRatesChart()
         {
            GetRatesChartData(function(rateChartData){
               RenderRatesChartData(null, rateChartData);
            });
         }
         /* Data Loading END */
         /* Data Pulls START */
         function GetRatesChartData(callback, forceReload) {
            if(forceReload == null)
               {
                  forceReload = false;
               }
               if(forceReload == false && initialData != null && initialData.length > 0)
               {
                  if(callback != null)
                  {
                     callback(initialData);
                  }
               }
               else
               {
                  console.log("Load some chart data.");
                  if(callback != null)
                  {
                     callback(initialData);
                  }
               }
         }
         /* Data Pulls END */
         /* Data Rendering START */
         function RenderRatesChartData(callback, dataForRendering){
            if(dataForRendering == null)
               {
                  dataForRendering = initialData;
               }
               let categoriesList = [];
               let seriesData = []
               seriesData.push({
                  name: "Location Fail Rate",
                  data: [],
                  className: "compliance-customize-dashboard-rates-data-series-failed",
                  dataLabels: {
                     enabled: true,
                  },
               });
               let chartTitle = "";
               dataForRendering.forEach(function (data) {
                  if (categoriesList.findIndex(c => c.LocationId == data.LocationId) < 0) {
                     let locationDataObject = {
                        LocationId: data.LocationId,
                        LocationName: data.LocationName,
                     };
                     categoriesList.push(locationDataObject);
                  }
               });
               //sort the categories.
               categoriesList = categoriesList.sort((a,b) => {
                  if(a.LocationName < b.LocationName) {
                     return -1;
                  }
                  else if (a.LocationName > b.LocationName) {
                     return 1;
                  }
                  else 
                  {
                     return 0;
                  }
               });
               categoriesList.forEach(function (cat) {
                  let locationFailData = dataForRendering.filter(m => m.LocationId == cat.LocationId && m.Rating?.toLowerCase() == "Fail".toLowerCase())?.length;
                  let locationTotalData = dataForRendering.filter(m => m.LocationId == cat.LocationId)?.length;
                  let locationFailCalcPct = 0;
                  if(locationTotalData != 0)
                  {
                     locationFailCalcPct = parseFloat(((locationFailData / locationTotalData)* 100.00)).toFixed(1);
                  }
                  seriesData.find(s => s.name == "Location Fail Rate").data.push(parseFloat(locationFailCalcPct) || 0);
               });
               let finalCategories = [];
               categoriesList.forEach(function(item){
                  let locationName = item.LocationId;
                  if(item.LocationName != null && item.LocationName != "")
                  {
                     locationName = item.LocationName;
                  }
                  finalCategories.push(locationName);
               })
               let chartDef = {};
               chartDef.chart = {
                  type: "column",
                  zoomType: "xy",
               };               
               chartDef.title = {
                  text: chartTitle,
                  enabled: false,
               };               
               chartDef.series = seriesData;
               chartDef.xAxis = {
                  categories: finalCategories,
                  scrollbar: {
                     enabled: true,
                  },
               };
               chartDef.yAxis = {
                  title: "Failure Rate",
                  scrollbar: {
                     enabled: true,
                  },
               };
               chartDef.legend = {
                  enabled: false,
                  layout: "horizontal",
                  align: "center",
                  verticalAlign: "bottom",
                  floating: false,
               };
               chartDef.plotOptions = {
                  series: {
                     dataLabels: {
                        align: "center",
                        verticalAlign: "top",
                        enabled: true,
                        format: "{point.y: .1f}%",
                     },
                     point: {
                        events: {
                           click: function(event){
                              LoadSummaryChartDetails(null, this);
                           }
                        },
                     },
                  },
               };
               chartDef.tooltip = {
                  //format: "{point.y: .1f}%",
               };
               chartDef.credits = {
                  enabled: false,
               }
               $("#failRateChart", element).each(function(){
                  Highcharts.chart(this, chartDef);
               });
               ko.postbox.publish("ComplianceLoadComplete", `ChartLoad_failRatesLocation` );
               if(callback != null)
               {
                  callback();
               }
         }
         // function RenderDirectiveFooter() {
         //    let startDate = null;
         //    let endDate = null;

         //    if (legacyContainer.scope.filters != null) {
         //       startDate = new Date(legacyContainer.scope.filters.StartDate);
         //       endDate = new Date(legacyContainer.scope.filters.EndDate);
         //    }
         //    $("#directiveTimeFrame", element).empty();
         //    if (startDate != null && endDate != null) {
         //       $("#directiveTimeFrame", element).append(`${startDate.toLocaleDateString()} through ${endDate.toLocaleDateString()}`);
         //    }
         // }
         /* Data Rendering END */
         /* Editor Loading START */
         /* Editor Loading END */
         /* Editor Validation & Saving START */         
         /* Editor Validation & Saving END */
         /* Sorting Options START */
         /* Sorting Options END */
         /* Utility Functions START */         
         function LoadSummaryChartDetails(callback, chartPointObject) {
            ShowDetailsLoading();
            window.setTimeout(function(){
               FindSummaryChartDetails(function(chartDetailData)
               {
                  RenderSummaryChartDetails(function(){
                     HideDetailsLoading();
                     if(callback != null)
                     {
                        callback();
                     }
                  }, chartDetailData);
               }, chartPointObject);
            }, 500);
         }

          function FindSummaryChartDetails(callback, chartPointObject)
          {
            let returnData = initialData;
            returnData = returnData.filter(i=>i.LocationName.toLowerCase() == chartPointObject.category?.toLowerCase());
            if(callback != null)
            {
               callback(returnData);
            }
         }
         function RenderSummaryChartDetails(callback, dataToRender)
         {
             let headerText = "Summary Details";
            if(dataToRender != null && dataToRender.length > 0)
            {
               let firstObject = dataToRender[0];
               headerText = `Summary Details for ${firstObject.LocationName}`;
            }
            let detailsData = {
               type: `auditsummary-location-fail-complete`,
               headerText: headerText,
               filteredData: dataToRender,
               detailRecords: dataToRender,
               //detailRecords: initialData,
            };
            ko.postbox.publish("km2ComplianceDashboardDetailsLoad", detailsData);
            if(callback != null)
            {
               callback();
            }
         }
         /* Utility Functions END */
         /* Show/Hide START */
         function HideAll() {
            HideDetailsLoading();
         }
         // function HideEditorForm() {
         //    $("#virtualPrizeCatalogEditorFormHolder", element).hide();
         // }
         // function ShowEditorForm() {
         //    $("#virtualPrizeCatalogEditorFormHolder", element).show();
         // }

         function ShowDetailsLoading()
         {
            $("#chartLoadingMessage", element).show();
         }
         function HideDetailsLoading()
         {
            $("#chartLoadingMessage", element).hide();
         }


         /* Show/Hide END */

         scope.load = function () {
            Initialize();
            LoadDirective();
         };
         ko.postbox.subscribe("km2ComplianceDashboardReload", function (params) {
            console.log("Dashboard Refresh/Reload called.");
            if (params != null) {
               if (params.filters != null) {
                  //set filter information here.
               }
               if (params.data != null) {
                  //set data to load here.
               }
            }
            LoadDirective();
         });
         ko.postbox.subscribe("km2ComplianceDashboardLoad", function (params) {            
            initialData.length = 0;
            if (params != null) {
               if (params.filters != null) {
                  //set filter information here.
               }
               if (params.data != null) {
                  initialData = params.data;
               }
            }
            scope.load();
         });
         ko.postbox.subscribe("km2ComplianceDashboardApplyFilter", function (dataObjects) {
            console.log("Dashboard Apply Filter called.");
            // initialData.length = 0;
            // initialData = dataObjects;
            scope.load();
         });
      }
   };
}]);