angularApp.directive("ngTotalAuditsCount", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/3/Customization/KM2/view/TotalAuditsCount.htm?' + Date.now(),
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
         let initialData = [];
         let auditCountData = [];
         /* Event Handling START */
         $("#averageAuditsPerDayHolder", element).off("mouseover").on("mouseover", function(){
            ShowStatsHolder();
         });
         $("#averageAuditsPerDayHolder", element).off("mouseout").on("mouseout", function(){
            HideStatsHolder();
         });
         /* Event Handling END */
         function Initialize() {
            HideAll();
            SetDatePickers();
            //RenderDirectiveFooter();
         };
         function SetDatePickers() {
         }
         /* Data Loading START */
         function LoadDirective() {
            HideAll();
            LoadTotalAuditsCount();
         }
         function LoadTotalAuditsCount(callback) {
            GetTotalAuditsCount(function(){
               RenderTotalAuditsCount(null, null);
               if (callback != null) {
                  callback();
               }   
            });
         }
         /* Data Loading END */
         /* Data Pulls START */
         function GetTotalAuditsCount(callback, forceReload) {
            if(forceReload == null)
            {
               forceReload = false;
            }
            if(forceReload == true)
            {
               //TODO: Set the start/end date to the current month to date.
               a$.ajax({
                  type: "GET",
                  service: "C#",
                  async: true,
                  data: {
                     lib: "selfserve",
                     cmd: "getKm2ComplianceDashboardData",
                     startDate: new Date().toLocaleDateString(),
                     endDate: new Date().toLocaleDateString(),
                     // startDate: new Date(startDate).toLocaleDateString(),
                     // endDate: new Date(endDate).toLocaleDateString(),
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (jsonData) {
                     returnData = JSON.parse(jsonData.dashboardDataList);                  
                     initialData.length = 0;
                     initialData = returnData;
                     if (callback != null) {
                        callback(returnData);
                     }
                  }
               });
            }
            else
            {
               if(callback != null)
               {
                  callback();
               }
            }
         }
         /* Data Pulls END */
         /* Data Rendering START */
         function RenderTotalAuditsCount(callback, auditCountList) {
            if (auditCountList == null) {
               auditCountList = initialData;
            }            
            let totalAuditCount = "--";
            $("#totalAuditsFoundCount", element).empty();
            $("#totalAuditsFoundCount", element).removeClass("details-available");
            if (auditCountList != null && auditCountList.length >= 0) {
               totalAuditCount = auditCountList.length || 0;
            }
            $("#totalAuditsFoundCount", element).append(totalAuditCount.toLocaleString());
            RenderAverageCount(null, auditCountList);
            let today = new Date();
            let todayCount = auditCountList.filter(i => new Date(i.EnterDate).toLocaleDateString() == today.toLocaleDateString())?.length || 0;
            if(todayCount > 0)
            {
               let todayCountDisplayHolder = $(`<div class="total-audits-count-today-holder" />`);
               let todayCountHolder = $(`<div class="total-audits-count-today" />`);
               //let todayCountLabel = $(`<div class="today-audits-count-today-label">Entered Today</div>`)
               todayCountHolder.append(`(${todayCount.toLocaleString()})`);
               todayCountDisplayHolder.append(todayCountHolder)
               //todayCountDisplayHolder.append(todayCountLabel);

               $("#totalAuditsFoundCount", element).append("&nbsp;");
               $("#totalAuditsFoundCount", element).append(todayCountDisplayHolder);
            }
   
            ko.postbox.publish("ComplianceLoadComplete", "TotalAudits");
            if (callback != null) {
               callback(auditCountList);
            }
         }
         function RenderAverageCount(callback, dataList){
            $("#lblAveragePerDay", element).empty();
            if(dataList == null)
            {
               dataList = initialData;
            }
            if(dataList == null || dataList.length == 0)
            {
               $("#lblAveragePerDay", element).append("");
               return;
            }
            let auditsPerDay = 0;
            let numberOfDays = 1
            let totalAudits = 0;
            
            let sortedListByDate = dataList.sort((a,b) =>{
               if(new Date(a.EnterDate) < new Date(b.EnterDate))
               {
                  return -1;
               }
               else if(new Date(a.EnterDate) > new Date(b.EnterDate))
               {
                  return 1;
               }
               else
               {
                  return 0;
               }
            });

            let startDate = new Date(sortedListByDate[0].EnterDate);
            let endDate = new Date(sortedListByDate[sortedListByDate.length -1].EnterDate);
            let today = new Date();

            if(endDate > today)
            {
               endDate = today;
            }
            numberOfDays = parseInt(Math.round(Math.abs((endDate - startDate) / (1000 * 60 * 60 * 24))));
            // $("#averagePerDayStatsHolder", element).empty();
            $("#lblDaysInCalculation", element).empty();
            $("#lblStartDateInCalculation", element).empty();
            $("#lblEndDateInCalculation", element).empty();

            $("#lblDaysInCalculation", element).append(`${numberOfDays}`);
            $("#lblStartDateInCalculation", element).append(`${new Date(startDate).toLocaleDateString()}`);
            $("#lblEndDateInCalculation", element).append(`${new Date(endDate).toLocaleDateString()}`);

            if (startDate == endDate) {
               auditsPerDay = dataList.length;
            }
            else {
               totalAudits = dataList.length;
               if (numberOfDays != 0) {
                  auditsPerDay = parseFloat(totalAudits / numberOfDays).toFixed(2);
               }
            }
            $("#lblAveragePerDay", element).append(auditsPerDay.toLocaleString());

            if(callback != null)
            {
               callback();
            }
         }
         // function RenderCallsPerDay(callback, callCountObject) {
         //    let callsPerDay = "--";
         //    $("#callsPerDay", element).empty();
         //    if (callCountObject != null && callCountObject.TotalCalls >= 0) {
         //       callsPerDay = 0;
         //       let totalCalls = callCountObject.TotalCalls || 0;
         //       let startDate = callCountObject.StartDate;
         //       let endDate = callCountObject.EndDate;
         //       let numberOfDays = 1;

         //       if (startDate != null && endDate != null) {
         //          startDate = new Date(startDate);
         //          endDate = new Date(endDate);
         //          numberOfDays = parseInt(Math.round(Math.abs((endDate - startDate) / (1000 * 60 * 60 * 24))));

         //          if (numberOfDays != 0) {
         //             callsPerDay = parseFloat(totalCalls / numberOfDays);
         //          }
         //       }
         //       callsPerDay = callsPerDay.toFixed(2);
         //    }
         //    $("#callsPerDay", element).append(callsPerDay);

         //    if (callback != null) {
         //       callback();
         //    }
         // }
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
         /* Utility Functions END */
         /* Show/Hide START */
         function HideAll() {
            HideStatsHolder();
         }
         function HideStatsHolder()
         {
            $("#averagePerDayStatsHolder",element).hide();
         }
         function ShowStatsHolder()
         {
            $("#averagePerDayStatsHolder",element).show();
         }
         // function HideEditorForm() {
         //    $("#virtualPrizeCatalogEditorFormHolder", element).hide();
         // }
         // function ShowEditorForm() {
         //    $("#virtualPrizeCatalogEditorFormHolder", element).show();
         // }

         /* Show/Hide END */

         scope.load = function () {
            Initialize();
            LoadDirective();
         };
         //TODO: Remove load call when we have a load option in the main page.         
         scope.load();
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