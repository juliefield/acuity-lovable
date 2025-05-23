angularApp.directive("ngAverageQualityScore", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/AutoQa/view/AverageQualityScore.htm?' + Date.now(),
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
            LoadAverageQualityScore();
         }
         function LoadAverageQualityScore(callback)
         {
            GetAverageQualityScore(function(){
               RenderAverageQualityScore(callback);
            });
         }
         /* Data Loading END */
         /* Data Pulls START */
         function GetAverageQualityScore(callback) {
            if (callback != null) {
               callback();
            }
         }
         /* Data Pulls END */
         /* Data Rendering START */         
         function RenderAverageQualityScore(callback)
         {
            let averageQualityScore = "--";
            $("#averageQualityScore", element).empty();
            $("#averageQualityScore", element).append(averageQualityScore);
            if(callback != null)
            {
               callback();
            }
         }
         function RenderDirectiveFooter()
         {
            let startDate = null;
            let endDate = null;

            let firstDataObject = initialData[0];
            if(firstDataObject != null)
            {
               startDate = new Date(firstDataObject.StartDate);
               endDate = new Date(firstDataObject.EndDate);
            }
            $("#directiveTimeFrame", element).empty();
            if(startDate != null && endDate != null)
            {
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
         ko.postbox.subscribe("autoQaRefresh", function(dataObjects){
            initialData.length = 0;
            initialData = dataObjects;
            LoadDirective();
         });
         ko.postbox.subscribe("autoQaLoad", function(dataObjects){
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