angularApp.directive("ngClientsCount", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/3/Customization/KM2/view/ClientsCount.htm?' + Date.now(),
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
         let clientCountData = [];
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
            LoadClientCount();
         }
         function LoadClientCount(callback) {
            GetClientCount(function (clientCountObject) {
               RenderClientCount(null, clientCountObject);               
               if (callback != null) {
                  callback();
               }
            });
         }
         /* Data Loading END */
         /* Data Pulls START */

         function GetClientCount(callback, forceReload) {
            //if (forceReload == true || auditorCountData == null || auditorCountData.length == 0) {
            if (initialData != null && initialData.length > 0) {
               let projectObjects = [];
               initialData.forEach(function (data) {                  
                  if (data.ProjectId != null && data.ProjectId != "") {
                     //TODO: Handle the actual project information
                     if(projectObjects.findIndex(p => p == data.ProjectId) < 0)
                     {
                        projectObjects.push(data.ProjectId);
                        // projectData = GetProjectObject(data.ProjectId);
                        // if(projectData != null)
                        // {
                        //    projectObjects.push(projectData);
                        // }
                     }
                  }
               });
               clientCountData = {
                  TotalClientCount: projectObjects.length,
                  ClientNames: projectObjects,
               };
            }
            else {
               //TODO: Call the database to get the information.
               clientCountData = {
                  TotalClientCount: 0,
                  ClientNames: [],
               };
            }
            // }
            // else {
            if (callback != null) {
               callback(clientCountData);
            }
            else {
               return clientCountData;
            }
            // }
         }
         /* Data Pulls END */
         /* Data Rendering START */
         function RenderClientCount(callback, clientCountObject) {
            if (clientCountObject == null) {
               clientCountObject = clientCountData;
            }
            let totalClientCount = "--";
            $("#TotalClientsCount", element).empty();
            $("#TotalClientsCount", element).removeClass("details-available");
            if (clientCountObject != null && clientCountObject.TotalClientCount >= 0) {
               totalClientCount = clientCountObject.TotalClientCount;
               $("#TotalClientsCount", element).addClass("details-available");
               $("#TotalClientsCount", element).off("click").on("click", function(){
                  let detailsData = {
                     type: "clients",
                     headerText: "Clients with Audits",
                     filteredData: clientCountObject.ClientNames,
                     detailRecords: initialData,
                  };
                  ko.postbox.publish("km2ComplianceDashboardDetailsLoad", detailsData);
               });
            }
            $("#TotalClientsCount", element).append(totalClientCount);
            ko.postbox.publish("ComplianceLoadComplete", "ClientCounts");
            if (callback != null) {
               callback(clientCountObject);
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