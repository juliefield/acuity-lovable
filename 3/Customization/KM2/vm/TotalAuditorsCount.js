angularApp.directive("ngTotalAuditorsCount", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/3/Customization/KM2/view/TotalAuditorsCount.htm?' + Date.now(),
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
         let auditorCountData = [];
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
            LoadTotalAuditorsCount();
         }
         function LoadTotalAuditorsCount(callback) {
            GetTotalAuditorsCount(function (auditorCountObject) {
               RenderTotalAuditorsCount(null, auditorCountObject);
            });

         }
         /* Data Loading END */
         /* Data Pulls START */
         function GetTotalAuditorsCount(callback, forceReload) {
            if (initialData != null && initialData.length > 0) {
               let auditorUserIds = [];
               initialData.forEach(function (data) {
                  if (data.EvaluatorUserId != null && data.EvaluatorUserId != "") {
                     if (auditorUserIds.findIndex(i => i == data.EvaluatorUserId) < 0) {
                        auditorUserIds.push(data.EvaluatorUserId);
                     }
                  }
               });
               auditorCountData = {
                  TotalAuditorCount: auditorUserIds.length,
                  AuditorUserIds: auditorUserIds,
               };
            }
            else {
               auditorCountData = {
                  TotalAuditorCount: 0,
                  AuditorUserIds: [],
               };
            }
            if (callback != null) {
               callback(auditorCountData);
            }
            else {
               return auditorCountData;
            }
            
         }
         /* Data Pulls END */
         /* Data Rendering START */
         function RenderTotalAuditorsCount(callback, auditorCountObject) {
            if (auditorCountObject == null) {
               auditorCountObject = auditorCountData;
            }
            let totalAuditorCount = "--";
            $("#TotalAuditorsCount", element).empty();
            $("#TotalAuditorsCount", element).removeClass("details-available");
            if (auditorCountObject != null && auditorCountObject.TotalAuditorCount >= 0) {
               totalAuditorCount = auditorCountObject.TotalAuditorCount;
               $("#TotalAuditorsCount", element).addClass("details-available");
               $("#TotalAuditorsCount", element).off("click").on("click", function(){
                  let detailsData = {
                     type: "auditorCount",
                     headerText: "Auditors",
                     filteredData: auditorCountObject.AuditorUserIds,
                     detailRecords: initialData,
                  };
                  ko.postbox.publish("km2ComplianceDashboardDetailsLoad", detailsData);
               });
            }
            $("#TotalAuditorsCount", element).append(totalAuditorCount);
            ko.postbox.publish("ComplianceLoadComplete", "TotalAuditors");
            if (callback != null) {
               callback(auditorCountObject);
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
         ko.postbox.subscribe("km2ComplianceDashboardApplyFilter", function (params) {

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
      }
   };
}]);