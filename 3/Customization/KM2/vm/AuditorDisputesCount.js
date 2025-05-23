angularApp.directive("ngAuditorDisputesCount", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/3/Customization/KM2/view/AuditorDisputesCount.htm?' + Date.now(),
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
         let dataLoadType = null;         
         let disputeData = [];
         let detailHeaderText = "";
         SetDataLoadType(attrs);
         
         /* Event Handling START */
         /* Event Handling END */
         function Initialize() {
            HideAll();
            SetDatePickers();
            SetDisputesTypeLabel();
            //RenderDirectiveFooter();
         };         
         function SetDatePickers() {
         }
         function SetDataLoadType(attrs)
         {
            if(attrs.dataType != null || attrs.datatype != null)
            {
               dataLoadType = (attrs.dataType || attrs.datatype);
            }
         }
         function GetDisputesTypeLabel()
         {
            let dataLoadTypeLabel = "";
            switch(dataLoadType)
            {
               case "pending":
                  dataLoadTypeLabel = "Pending Disputes";
                  break;
               case "valid":
                  dataLoadTypeLabel = "Valid Disputes";
                  break;
            }
            return dataLoadTypeLabel;
         }
         function SetDisputesTypeLabel()
         {
            $("#disputesCountTypeLabel", element).empty();            
            let dataLoadTypeLabel = GetDisputesTypeLabel();
            $("#disputesCountTypeLabel", element).append(dataLoadTypeLabel);
         }
         /* Data Loading START */
         function LoadDirective() {
            HideAll();
            LoadDisputesCount();
         }
         function LoadDisputesCount(callback, forceReload) {            
            GetDisputesCount(function (disputesList) {
               RenderDisputesCount(function(){
                  if (callback != null) {
                     callback();
                  }   
               }, disputesList, dataLoadType);
            }, forceReload, null);
         }
         /* Data Loading END */
         /* Data Pulls START */
         function GetDisputesCount(callback, forceReload, disputeType){
            if(forceReload == null)
            {
               forceReload = false;
            }
            if(disputeType == null)
            {
               disputeType = dataLoadType;
            }
            let disputeData = [];
            switch(disputeType.toLowerCase())
            {
               case "pending".toLowerCase():
                  //disputeData = initialData.filter(m => m.FormStatus?.toLowerCase() == "Pending QA Dispute".toLowerCase());
                  disputeData = GetPendingQaDisputeData();
                  break;
               case "valid".toLowerCase():
                  disputeData = initialData.filter(m => m.Rating?.toLowerCase() == "Dispute Valid".toLowerCase());
                  break;
            }
            if(callback != null)
            {
               callback(disputeData);
            }
         }
         function GetPendingQaDisputeData()
         {
            //always get the most recent dispute data information.
            let returnData = [];
            a$.ajax({
               type: "GET",
               service: "C#",
               async: false,
               data: {
                  lib: "selfserve",
                  cmd: "getKm2ComplinacePendingQaDisputesData",
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (jsonData) {
                  returnData = JSON.parse(jsonData.dashboardDataList);
               }
            });
            return returnData;
         }
         /* Data Pulls END */
         /* Data Rendering START */
         function RenderDisputesCount(callback, dataToRender, displayType) {
            if(dataToRender == null)
            {
               dataToRender = disputeData;
            }
            if(displayType == null)
            {
               displayType = dataLoadType;
            }
            let disputesCount = "--";            
            $("#TotalDisputesCount", element).empty();
            $("#TotalDisputesCount", element).removeClass("details-available");
            
            if(dataToRender != null && dataToRender.length > 0)
            {
               disputesCount = dataToRender.length || 0;
               $("#TotalDisputesCount", element).addClass("details-available");
               $("#TotalDisputesCount", element).off("click").on("click", function(){
                  let detailsData = {
                     type: `disputeDetails-${displayType}`,
                     headerText: `${GetDisputesTypeLabel()}: Detail`,
                     filteredData: dataToRender,
                     detailRecords: initialData,
                  };
                  ko.postbox.publish("km2ComplianceDashboardDetailsLoad", detailsData);
               });
            }

            $("#TotalDisputesCount", element).append(disputesCount);
            ko.postbox.publish("ComplianceLoadComplete", `DisputesCount${displayType}`);

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
         //scope.load();
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
            //console.log("Dashboard Apply Filter called.");
            // initialData.length = 0;
            // initialData = dataObjects;
            scope.load();
         });
      }
   };
}]);
