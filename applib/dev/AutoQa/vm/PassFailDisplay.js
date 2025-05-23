angularApp.directive("ngPassFailDisplay", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/AutoQa/view/PassFailDisplay.htm?' + Date.now(),
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
         /* Page Level data information START */
         let passFailDetails = [];
         /* Page Level data information END */
         /* Event Handling START */
         $("#btnRefreshPassFail", element).off("click").on("click", function(){
            LoadPassFailInformation(null, true);
         });
         /* Event Handling END */
         function Initialize() {
            $(".directive-information-loading-image", element).prop("src", `${a$.debugPrefix()}/applib/css/images/acuity-loading.gif`);
            HideAll();
            SetDatePickers();
            RenderDirectiveFooter();
         };
         function SetDatePickers() {
         }
         /* Data Loading START */
         function LoadDirective() {
            HideAll();
            LoadPassFailInformation();
         }
         function LoadPassFailInformation(callback, forceReload)
         {
            ShowLoadingMessage();
            GetPassFailInformation(function(data){
               RenderPassFailInformation(function(){
                  HideLoadingMessage();
               },data)
            },forceReload);
         }
         /* Data Loading END */
         /* Data Pulls START */
         function GetPassFailInformation(callback, forceReload) {
            if(forceReload == null)
            {
               forceReload = false;
            }
            if(forceReload == false && passFailDetails != null && passFailDetails.length > 0)
            {
               if(callback != null)
               {
                  callback(passFailDetails);
               }
               else
               {
                  return passFailDetails;
               }
            }
            else
            {
               passFailDetails.length = 0;
               let iIndex = 1
               let possibleMax = 100;
               let passValue = 0.75;
               while(iIndex <= 100)
               {
                  let _userScore = Math.floor(Math.random() * possibleMax);
                  let _isPass = (parseFloat(_userScore / possibleMax) >= passValue);
                  let _userId = `UserId_${parseInt(Math.floor(Math.random() * 20))}`;

                  passFailDetails.push(
                     {
                        Id: iIndex,
                        UserId: _userId,
                        UserScore: _userScore,
                        Possible: possibleMax,
                        IsPass: _isPass,
                     }
                  );
                  iIndex++;
               }
               $("#passFailChart", element).empty();
               if (callback != null) {
                  callback(passFailDetails);
               }
            }
         }
         /* Data Pulls END */
         /* Data Rendering START */         
         function RenderPassFailInformation(callback, dataToRender)
         {
            if(dataToRender == null)
            {
               dataToRender = passFailDetails;
            }
            //console.table(dataToRender);
            RenderPassFailChart(function() {
               if(callback != null)
               {
                  callback();
               }
            }, dataToRender);
         }
         function RenderPassFailChart(callback, dataForRendering)
         {
            let passData = {name: "Pass", y: dataForRendering.filter(i => i.IsPass == true).length,};
            let failData = {name: "Fail", y: dataForRendering.filter(i => i.IsPass == false).length,};
            Highcharts.chart(`passFailChart`, {
               chart: {
                  type: 'pie',
                  options3d: {
                      enabled: true,
                      alpha: 50,
                      beta: 0
                  }
               },
               credits: {
                  enabled: false
              },
               title: { 
                  text: "",
                  align: "center",
               },
               accessibility: {
                  point: {
                     valueSuffix: '%'
                 }
               },
               tooltip: {
                     pointFormat: `{series.name}: <b>{point.percentage:.1f}%</b>`
               },
              series: [{
               type: "pie",
               data: [
                  passData, 
                  failData,
               ]
               }]
            });
            if(callback != null)
            {
               callback();
            }
         }
         function RenderDirectiveFooter()
         {
            let startDate = null;
            let endDate = null;

            if (legacyContainer.scope.filters != null) {
               startDate = new Date(legacyContainer.scope.filters.StartDate);
               endDate = new Date(legacyContainer.scope.filters.EndDate);
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
            HideLoadingMessage();
         }
         function HideLoadingMessage() {
            $("#directiveLoading", element).hide();
         }
         function ShowLoadingMessage() {
            $("#directiveLoading", element).show();
         }
         
         /* Show/Hide END */

         scope.load = function () {            
            Initialize();
            LoadDirective();
         };
         ko.postbox.subscribe("autoQaLoad", function(dataObjects){            
            console.log(`Pass/Fail - autoQaLoad call`);
            scope.load();
         });     
         ko.postbox.subscribe("AutoQA_PassFail_Load", function () {
            scope.load();
            //ko.postbox.publish("userPrizeWidgetLoadComplete");
         });
      }
   };
}]);