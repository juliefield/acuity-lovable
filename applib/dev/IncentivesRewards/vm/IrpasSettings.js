angularApp.directive("ngIrpasSettings", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/IncentivesRewards/view/IrpasSettings.htm?' + Date.now(),
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
         let programSummaryObject = null;
         /* Event Handling START */
         /* Event Handling END */
         function Initialize() {
            HideAll();
         };
         function SetDatePickers() {
         }
         /* Data Loading START */
         function LoadDirective() {
            HideAll();
            LoadProgramSummaryData();
         }
         function LoadProgramSummaryData(callback) {
            GetProgramSummaryData(function (dataObject) {
               RenderProgramSummaryData(function () {
                  if (callback != null) {
                     callback();
                  }
               }, dataObject);
            });
         }
         /* Data Loading END */
         /* Filtered Data Pulls START */
         /* Filtered Data Pulls END */
         /* Data Pulls START */
         function GetProgramSummaryData(callback, forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }
            if(forceReload == false && programSummaryObject != null)
            {
               if (callback != null) {
                  callback(programSummaryObject);
               }
            }
            else
            {
               a$.ajax({
                  type: "GET",
                  service: "C#",
                  async: true,
                  data: {
                     lib: "selfserve",
                     cmd: "getIRPASProgramSummaryData"
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (jsonData) {
                     let returnData = JSON.parse(jsonData.programSummaryObject);
                     programSummaryObject = returnData;
                     ko.postbox.publish("IRPASProgramSummaryDataLoad", returnData);
                     if (callback != null) {
                        callback(returnData);
                     }
                  }
               });
            }
         }
         
         /* Data Pulls END */
         /* Data Rendering START */
         function RenderProgramSummaryData(callback, summaryObject) {
            if(summaryObject == null)
            {
               summaryObject = programSummaryObject;
            }
            $("#lblTotalProgramPointsAssigned",element).empty();
            $("#lblTotalProgramPointsUnclaimed",element).empty();
            $("#lblTotalProgramUnclaimedValue",element).empty();
            $("#lblYTDProgramPointsAssigned",element).empty();
            $("#lblYTDProgramPointsUnclaimed",element).empty();
            $("#lblYTDProgramUnclaimedValue",element).empty();
            
            
            let unclaimedAmount = summaryObject.TotalProgramAwardedPoints - summaryObject.TotalProgramClaimedPoints;
            let dollarValue = parseFloat(summaryObject.DollarPerPointValue) || 0;
            let unclaimedValue = (unclaimedAmount * dollarValue);
            let ytdUnclaimedAmount = summaryObject.YearToDateAwardedPoints - summaryObject.YearToDateClaimedPoints;
            let ytdUnclaimedValue = (ytdUnclaimedAmount * dollarValue);

            $("#lblTotalProgramPointsAssigned",element).append(summaryObject.TotalProgramAwardedPoints);
            $("#lblTotalProgramPointsUnclaimed",element).append(unclaimedAmount);
            $("#lblTotalProgramUnclaimedValue",element).append(unclaimedValue.toLocaleString("en-US", { style: "currency", currency: "USD",}));
            //
            $("#lblYTDProgramPointsAssigned",element).append(summaryObject.YearToDateAwardedPoints);
            $("#lblYTDProgramPointsUnclaimed",element).append(ytdUnclaimedAmount);
            $("#lblYTDProgramUnclaimedValue",element).append(ytdUnclaimedValue.toLocaleString("en-US", { style: "currency", currency: "USD",}));

            if (callback != null) {
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
         scope.load = function () {
            Initialize();
            LoadDirective();
         };

         ko.postbox.subscribe("IRPASManagementInit", function (data) {
            Initialize();
         });
         ko.postbox.subscribe("IRPASManagementLoad", function (data) {
            //scope.load();
            LoadDirective();
         });
      }
   };
}]);
