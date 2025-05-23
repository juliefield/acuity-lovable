angularApp.directive("ngIrpasFilter", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/IncentivesRewards/view/IrpasFilter.htm?' + Date.now(),
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
         let hasAccess = false;
         let possibleIrpasFilterOptionObjects = {
            areas: [],
            subareas: [],
            intervals: [],
         };
         /* Event Handling START */
         $("#btnIrpasApplyFilter", element).off("click").on("click", function () {
            alert("Not Implemented");
            // ko.postbox.publish("startload");
            // ko.postbox.publish("filterchange", true);
         });
         $("#btnIrpasClearFilter", element).off("click").on("click", function () {
            ResetFilters(function () {
               alert("Not fully implemented");
               // ko.postbox.publish("startload");
               // ko.postbox.publish("filterchange", true);
            });
         });
         /* Event Handling END */
         function Initialize() {
            HideAll();
            SetDatePickers();
            GetAreaOptions();
         };
         function SetDatePickers() {
         }
         /* Data Loading START */
         function LoadDirective() {
            HideAll();
            LoadFilterOptions();
         }
         function LoadFilterOptions() {
            LoadAreaOptions();
            LoadSubAreaOptions();
            LoadIntervalOptions();
         }
         function LoadAreaOptions() {
            GetAreaOptions(function (dataList) {
               RenderAreaOptions(null, dataList);
            })
         }
         function LoadSubAreaOptions(){
            GetSubAreaOptions(function(dataList){
               RenderSubAreaOptions(null, dataList);
            });
         }
         function LoadIntervalOptions(){
            GetIntervalOptions(function(dataList){
               RenderIntervalOptions(null, dataList);
            });
         }

         /* Data Loading END */
         /* Filtered Data Pulls START */
         function ApplyFilters(callback, dataToFilter) {
            if (callback != null) {
               callback(filteredData);
            }
            else {
               return filteredData;
            }
         }
         // function LoadComplianceDisputeData(callback)
         // {
         //    let returnData = [];

         //    if(callback != null)
         //    {
         //       callback(returnData);
         //    }
         // }
         /* Filtered Data Pulls END */
         /* Data Pulls START */
         function GetAreaOptions(callback, forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (forceReload == false && possibleIrpasFilterOptionObjects.areas != null && possibleIrpasFilterOptionObjects.areas.length > 0) {
               if (callback != null) {
                  callback(possibleIrpasFilterOptionObjects.areas);
               }
            }
            else {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: true,
                  data: {
                     lib: "selfserve",
                     cmd: "getAllAvailableIRPASAreas",
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let returnData = JSON.parse(data.availableIrpasAreasList);
                     possibleIrpasFilterOptionObjects.areas.length = 0;
                     possibleIrpasFilterOptionObjects.areas = returnData;
                     if (callback != null) {
                        callback(returnData);
                     }
                     else {
                        return returnData;
                     }
                  }
               });
            }
         }
         function GetSubAreaOptions(callback, forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (forceReload == false && possibleIrpasFilterOptionObjects.subareas != null && possibleIrpasFilterOptionObjects.subareas.length > 0) {
               if (callback != null) {
                  callback(possibleIrpasFilterOptionObjects.subareas);
               }
            }
            else {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: true,
                  data: {
                     lib: "selfserve",
                     cmd: "getAllAvailableIRPASSubAreas",
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let returnData = JSON.parse(data.availableIrpasSubAreasList);
                     possibleIrpasFilterOptionObjects.subareas.length = 0;
                     possibleIrpasFilterOptionObjects.subareas = returnData;
                     if (callback != null) {
                        callback(returnData);
                     }
                     else {
                        return returnData;
                     }
                  }
               });
            }
         }
         function GetIntervalOptions(callback, forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (forceReload == false && possibleIrpasFilterOptionObjects.intervals != null && possibleIrpasFilterOptionObjects.intervals.length > 0) {
               if (callback != null) {
                  callback(possibleIrpasFilterOptionObjects.intervals);
               }
            }
            else {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: true,
                  data: {
                     lib: "selfserve",
                     cmd: "getAllAvailableIRPASIntervals",
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let returnData = JSON.parse(data.availableIntervalList);
                     possibleIrpasFilterOptionObjects.intervals.length = 0;
                     possibleIrpasFilterOptionObjects.intervals = returnData;
                     if (callback != null) {
                        callback(returnData);
                     }
                     else {
                        return returnData;
                     }
                  }
               });
            }
         }
         /* Data Pulls END */
         /* Data Rendering START */
         function RenderAreaOptions(callback, listToRender)
         {
            if(listToRender == null)
            {
               listToRender = possibleIrpasFilterOptionObjects.areas;
            }
            $("#irpasAreaFilter", element).empty();
            $("#irpasAreaFilter", element).append($(`<option value=""></option>`));

            listToRender.forEach(function(areaItem){
               let areaOption = $(`<option value="${areaItem.Id}">${areaItem.Name}</option>`);
               $("#irpasAreaFilter", element).append(areaOption);
            });
            if(callback != null)
            {
               callback();
            }
         }
         function RenderSubAreaOptions(callback, listToRender)
         {
            if(listToRender == null)
            {
               listToRender = possibleIrpasFilterOptionObjects.subareas;
            }
            $("#irpasSubAreaFilter", element).empty();
            $("#irpasSubAreaFilter", element).append($(`<option value=""></option>`));

            listToRender.forEach(function(areaItem){
               let areaOption = $(`<option value="${areaItem.Id}">${areaItem.Name}</option>`);
               $("#irpasSubAreaFilter", element).append(areaOption);
            });
            if(callback != null)
            {
               callback();
            }
         }
         function RenderIntervalOptions(callback, listToRender)
         {
            if(listToRender == null)
            {
               listToRender = possibleIrpasFilterOptionObjects.intervals;
            }
            $("#irpasIntervalFilter", element).empty();
            $("#irpasIntervalFilter", element).append($(`<option value=""></option>`));

            listToRender.forEach(function(areaItem){
               let areaOption = $(`<option value="${areaItem.Id}">${areaItem.Name}</option>`);
               $("#irpasIntervalFilter", element).append(areaOption);
            });
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
         function ResetFilters(callback) {
            $(`#irpasAreaFilter`, element).val("");
            $(`#irpasSubAreaFilter`, element).val("");
            $(`#irpasIntervalFilter`, element).val("");
            if (callback != null) {
               callback();
            }
         }
         /* Utility Functions END */
         /* Show/Hide START */
         function HideAll() {
         }

         /* Show/Hide END */
         scope.load = function () {
            Initialize();
            LoadDirective();
         };
         ko.postbox.subscribe("IRPASFiltersChanged", function (forceLoad) {
            if (forceLoad == null) {
               forceLoad = false;
            }
            ko.postbox.publish("IRPASFiltersApplied");
            //ko.postbox.publish("IRPASManagementLoad", dataObj);
         });
         ko.postbox.subscribe("IRPASManagementInit", function (data) {
            Initialize();
         });
         ko.postbox.subscribe("IRPASManagementLoad", function (data) {
            //scope.load();
            LoadDirective();
         });
         ko.postbox.subscribe("IRPAS_AvailableEvaluationAreasLoaded", function(IrpasReferenceObject){
            possibleIrpasFilterOptionObjects.areas.length = 0;
            possibleIrpasFilterOptionObjects.areas = IrpasReferenceObject.AvailableEvaluationAreas.data;
            RenderAreaOptions();
         });
      }
   };
}]);
