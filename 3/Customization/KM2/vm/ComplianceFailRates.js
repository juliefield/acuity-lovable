angularApp.directive("ngComplianceFailRates", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/3/Customization/KM2/view/ComplianceFailRates.htm?' + Date.now(),
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
         let failRateData = [];    
         /* Event Handling START */
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
            LoadComplianceFailRate();
         }
         function LoadComplianceFailRate(callback) {
            GetComplianceFailRate(function(complianceData){
               RenderComplianceFailRate(function(){
                  if (callback != null) {
                     callback();
                  }
               },complianceData);
            });
         }
         /* Data Loading END */
         /* Data Pulls START */
         function GetComplianceFailRate(callback, forceReload) {            
            if(forceReload == null)
            {
               forceReload = false;
            }
            let returnData = initialData.filter(i => i.Rating?.toLowerCase() == "fail".toLowerCase());
            failRateData.length = 0;
            failRateData = [... returnData];
            if(callback != null)
            {
               callback(returnData);
            }
         }
         /* Data Pulls END */
         /* Data Rendering START */
         function RenderComplianceFailRate(callback, dataToRender)
         {
            if(dataToRender == null)
            {
               dataToRender = initialData?.filter(i => i.Rating?.toLowerCase() == "fail".toLowerCase());
            }
            $("#ComplianceFailRate", element).empty();
            let failedCount = dataToRender.length;
            let totalMonitors = initialData.length || 0;            
            let failRate = 0;
            let complianceRate  = "--";
            if(totalMonitors > 0)
            {
               failRate = (failedCount / totalMonitors);
               complianceRate = new Intl.NumberFormat('en-US', {
                  style:'percent',
                  maximumFractionDigits: 1,
                  minimumFractionDigits: 1,
               }).format(failRate);
            }
            $("#ComplianceFailRate", element).append(complianceRate);
            
            ko.postbox.publish("ComplianceLoadComplete", "FailRatesCount");
            if (callback != null) {
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
         /* Utility Functions END */
         /* Show/Hide START */
         function HideAll() {

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
                  initialData = params.data;
               }
            }
            LoadDirective();
         });
         ko.postbox.subscribe("km2ComplianceDashboardLoad", function (params) {
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