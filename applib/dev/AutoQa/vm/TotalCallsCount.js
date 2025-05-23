angularApp.directive("ngTotalCallsCount", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/AutoQa/view/TotalCallsCount.htm?' + Date.now(),
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
         let callCountData = [];
         /* Event Handling START */
         /* Event Handling END */
         function Initialize() {
            HideAll();
            SetDatePickers();
            RenderDirectiveFooter();
         };
         function SetDatePickers() {
         }
         /* Data Loading START */
         function LoadDirective() {
            HideAll();
            LoadTotalCallsCount();
         }
         function LoadTotalCallsCount(callback) {
            GetTotalCallCount(function (callCountObject) {
               RenderTotalCallCount(null, callCountObject);
               RenderCallsPerDay(null, callCountObject);
               if (callback != null) {
                  callback();
               }
            });
         }
         /* Data Loading END */
         /* Data Pulls START */
         function GetTotalCallCount(callback, forceReload) {            
            if (forceReload == true || callCountData == null || callCountData.length == 0) {
               let startDate = null;
               let endDate = null;
               let projectId = null;
               let locationId = null;
               let groupId = null;
               let teamId = null;
               let userId = null;
               if (legacyContainer.scope.filters != null) {
                  startDate = legacyContainer.scope.filters.StartDate;
                  endDate = legacyContainer.scope.filters.EndDate;
                  projectId = legacyContainer.scope.filters.Project;
                  locationId = legacyContainer.scope.filters.Location;
                  groupId = legacyContainer.scope.filters.Group;
                  teamId = legacyContainer.scope.filters.Team;
                  userId = legacyContainer.scope.filters.CSR;
               }
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: true,
                  data: {
                     lib: "selfserve",
                     cmd: "getAutoQaDashboardTotalCallCount",
                     startDate: startDate,
                     endDate: endDate,
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let returnData = {
                        TotalCalls: 0,
                        StartDate: null,
                        EndDate: null,
                     }
                     if (data.totalCalls != null) {
                        returnData.TotalCalls = parseInt(data.totalCalls);
                     }
                     if (data.startDate != null) {
                        returnData.StartDate = new Date(data.startDate);
                     }
                     if (data.endDate != null) {
                        returnData.EndDate = new Date(data.endDate);
                     }
                     callCountData = returnData;
                     if (callback != null) {
                        callback(returnData);
                     }
                     else {
                        return returnData;
                     }
                  }
               });
            }
            else {
               if (callback != null) {
                  callback(callCountData);
               }
               else {
                  return callCountData;
               }
            }

         }
         /* Data Pulls END */
         /* Data Rendering START */
         function RenderTotalCallCount(callback, callCountObject) {
            let totalCallCount = "--";
            $("#totalCallsCount", element).empty();
            if (callCountObject != null && callCountObject.TotalCalls >= 0) {
               totalCallCount = callCountObject.TotalCalls;
            }
            $("#totalCallsCount", element).append(totalCallCount);
            if (callback != null) {
               callback();
            }
         }
         function RenderCallsPerDay(callback, callCountObject) {
            let callsPerDay = "--";
            $("#callsPerDay", element).empty();
            if (callCountObject != null && callCountObject.TotalCalls >= 0) {
               callsPerDay = 0;
               let totalCalls = callCountObject.TotalCalls || 0;
               let startDate = callCountObject.StartDate;
               let endDate = callCountObject.EndDate;
               let numberOfDays = 1;

               if (startDate != null && endDate != null) {
                  startDate = new Date(startDate);
                  endDate = new Date(endDate);
                  numberOfDays = parseInt(Math.round(Math.abs((endDate - startDate) / (1000 * 60 * 60 * 24))));

                  if (numberOfDays != 0) {
                     callsPerDay = parseFloat(totalCalls / numberOfDays);
                  }
               }
               callsPerDay = callsPerDay.toFixed(2);
            }
            $("#callsPerDay", element).append(callsPerDay);

            if (callback != null) {
               callback();
            }
         }
         function RenderDirectiveFooter() {
            let startDate = null;
            let endDate = null;

            if (legacyContainer.scope.filters != null) {
               startDate = new Date(legacyContainer.scope.filters.StartDate);
               endDate = new Date(legacyContainer.scope.filters.EndDate);
            }
            $("#directiveTimeFrame", element).empty();
            if (startDate != null && endDate != null) {
               $("#directiveTimeFrame", element).append(`${startDate.toLocaleDateString()} through ${endDate.toLocaleDateString()}`);
            }
         }
         /* Data Rendering END */
         /* Editor Loading START */
         /* Editor Loading END */
         /* Editor Validation & Saving START */
         // function ValidateCreateCatalogForm(callback)
         // {
         //    let formValid = true;
         //    let errorMessages = [];
         //    if(catalogName == null || catalogName == "")
         //    {
         //       errorMessages.push({ message: "Name is required", fieldclass: "", fieldid: "prizeCatalogCreateEditor_CatalogName" });
         //       formValid = false;
         //    }
         //    if (formValid) {
         //       if (callback != null) {
         //          callback();
         //       }
         //    } else {
         //       var messageString = "";
         //       if (errorMessages.length > 0) {
         //          messageString += "<i class=\"fas fa-exclamation-triangle\"></i> <strong>Correct the following errors:</strong> <ul>";
         //       }
         //       for (var m = 0; m < errorMessages.length; m++) {
         //          let item = errorMessages[m];

         //          messageString += "<li>" + item.message + "</li>";
         //          if (item.fieldclass != "") {
         //             $(item.fieldclass, element).addClass("errorField");
         //             $(item.fieldclass, element).off("blur").on("blur", function () {
         //                $(this).removeClass("errorField");
         //             });
         //          }
         //          if (item.fieldid != "") {
         //             $("#" + item.fieldid, element).addClass("errorField");
         //             $("#" + item.fieldid, element).off("blur").on("blur", function () {
         //                $(this).removeClass("errorField");
         //             });
         //          }

         //       }
         //       if (messageString != "") {
         //          messageString += "</ul>";

         //          $(".error-information-holder-create-form", element).html(messageString);
         //          $(".error-information-holder-create-form", element).show();
         //       }
         //    }
         // }
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
         ko.postbox.subscribe("autoQaRefresh", function (dataObjects) {
            initialData.length = 0;
            initialData = dataObjects;
            LoadDirective();

         });
         ko.postbox.subscribe("autoQaLoad", function (dataObjects) {
            initialData.length = 0;
            initialData = dataObjects;
            scope.load();
         });
         // ko.postbox.subscribe("userPrizeCatalogAdminLoad", function (forceLoad) {
         //    scope.load(forceLoad);
         //    ko.postbox.publish("userPrizeWidgetLoadComplete");
         // });
      }
   };
}]);