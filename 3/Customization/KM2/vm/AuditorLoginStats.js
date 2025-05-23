angularApp.directive("ngAuditorLoginStats", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/3/Customization/KM2/view/AuditorLoginStats.htm?' + Date.now(),
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
         let referenceObjects = {
            UserProfiles: [],
            Projects: [],
            Locations: [],
            Teams: [],
            Groups: [],
         };
         
         /* Event Handling START */
         $(".btn-close", element).off("click").on("click", function(){
            console.log("Close button clicked.");
            HideDetailPanel();
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
            LoadAuditorLogins();
         }
         function LoadAuditorLogins(callback)
         {
            GetAuditorLogins(function(auditorLogins){
               RenderAuditorLogins(function(){
                  console.log(`RenderAuditorLogins() callback`);
                  if (callback != null) {
                     callback();
                  }
               }, auditorLogins);
            });
         }
         /* Data Loading END */
         /* Data Pulls START */
         function GetAuditorLogins(callback, forceReload)
         {
            if(forceReload == null)
            {
               forceReload = false;
            }
            let returnData = initialData;
            if (callback != null) {
               callback(returnData);
            }
         }
         function GetUserProfile(userProfileId) {
            let returnObject = null;
            a$.ajax({
               type: "POST",
               service: "C#",
               async: false,
               data: {
                  lib: "selfserv",
                  cmd: "getUserProfile",
                  userid: userProfileId,
                  deepLoad: false,
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (data) {
                  returnObject = JSON.parse(data.userFullProfile);
                  referenceObjects.UserProfiles.push(returnObject);
               }
            });
            return returnObject;
         }

         /* Data Pulls END */
         /* Data Rendering START */
         function RenderAuditorLogins(callback, dataToRender)
         {
            if(dataToRender == null)
            {
               dataToRender = initialData;
            }
            $("#auditorLoginList", element).empty();
            let auditorLoginHeaderHolder = $(`<div class="auditor-login-header-holder" />`);
            let auditorLoginDetailHolder = $(`<div class="auditor-login-detail-holder" />`);
            let auditorLoginFooterHolder = $(`<div class="auditor-login-footer-holder" />`);
            
            RenderAuditorLoginHeader(null, auditorLoginHeaderHolder);
            RenderAuditorLoginDetails(null, auditorLoginDetailHolder, dataToRender);
            RenderAuditorLoginFooter(null, auditorLoginFooterHolder);

            $("#auditorLoginList", element).append(auditorLoginHeaderHolder);
            $("#auditorLoginList", element).append(auditorLoginDetailHolder);
            $("#auditorLoginList", element).append(auditorLoginFooterHolder);
            
            if (callback != null) {
               callback();
            }
         }
         function RenderAuditorLoginHeader(callback, renderToObject){            
            let auditorLoginDataRow = $(`<div class="auditor-login-data-row header-row auditor-login-data-header" />`);
            let auditorNameHolder = $(`<div class="auditor-login-data-item-holder auditor-login-name details-header-item" />`);
            let auditorLoginCountHolder = $(`<div class="auditor-login-data-item-holder login-count details-header-item" />`);            
            auditorNameHolder.append("Auditor");
            auditorLoginCountHolder.append("#");

            auditorLoginDataRow.append(auditorNameHolder);
            auditorLoginDataRow.append(auditorLoginCountHolder);

            $(renderToObject, element).append(auditorLoginDataRow);

            if(callback != null)
            {
               callback();
            }
         }
         function RenderAuditorLoginDetails(callback, renderToObject, dataObjects){
            if(dataObjects == null)
            {
               dataObjects = initialData;
            }
            let allAdvisorsUserIdList = [];
            //get the distinct users
            dataObjects.forEach(function(item){
               if(item.UserId != null && item.UserId != "")
               {
                  if(allAdvisorsUserIdList.findIndex(u => u.UserId == item.UserId) < 0)
                  {
                     let profileObject = FindUserProfile(item.UserId);
                     let advisorData = {
                        UserId: item.UserId, 
                        UserFullName: item.UserId,
                     };
                     if(profileObject != null)
                     {
                        advisorData.UserFullName = profileObject.UserFullName;
                     }
                     //allAdvisorsUserIdList.push(item.UserId);
                     allAdvisorsUserIdList.push(advisorData);
                  }
               }
            })
            //sort the advisor List
            if(allAdvisorsUserIdList != null && allAdvisorsUserIdList.length > 0)
            {
               allAdvisorsUserIdList = allAdvisorsUserIdList.sort((a,b) =>{
                  return (a.UserFullName - b.UserFullName);
               });
            }

            allAdvisorsUserIdList.forEach(function(userIdItem){
               //let userSuccessLogins = dataObjects.filter(u => u.UserId == userIdItem && u.IsLoggedInForDay == true);
               let userSuccessLogins = dataObjects.filter(u => u.UserId == userIdItem.UserId && u.IsLoggedInForDay == true);
               //let auditorLoginDataRow = $(`<div class="auditor-login-data-row" id="userLoginRow|${userIdItem}" />`);
               let auditorLoginDataRow = $(`<div class="auditor-login-data-row" id="userLoginRow|${userIdItem.UserId}" />`);
               let auditorNameHolder = $(`<div class="auditor-login-data-item-holder auditor-login-name" />`);
               //let auditorLoginCountHolder = $(`<div class="auditor-login-data-item-holder login-count" id="userLoginCount|${userIdItem}" />`);
               let auditorLoginCountHolder = $(`<div class="auditor-login-data-item-holder login-count" id="userLoginCount|${userIdItem.UserId}" />`);
               auditorLoginDataRow.off("click").on("click", function(){
                  let rowId = this.id;
                  let userId = rowId.split("|")[1];
                  RenderLoginDetailPanel(function(){
                     ShowDetailPanel();
                  }, userId);
               });
               let userName = userIdItem.UserFullName;
               auditorNameHolder.append(userName);
               auditorLoginCountHolder.append(userSuccessLogins.length || 0);
               auditorLoginDataRow.append(auditorNameHolder);
               auditorLoginDataRow.append(auditorLoginCountHolder);
               $(renderToObject, element).append(auditorLoginDataRow);
            });

            ko.postbox.publish("ComplianceLoadComplete", "AuditorLoginStats");
            if(callback != null)
            {
               callback();
            }
         }
         function RenderAuditorLoginFooter(callback, renderToObject){
            $(renderToObject, element).append("&nbsp;");
            if(callback != null)
            {
               callback();
            }
         }
         function RenderLoginDetailPanel(callback, userId)
         {
            let dataToRender = [];
            if(userId == null || userId == "")
            {
               //TODO: Determine how to handle rendering every item.
               return;
            }
            0
            if(userId != null && userId != "")
            {
               dataToRender = initialData.filter(u => u.UserId == userId);
            }
            
            dataToRender = dataToRender.sort((a,b) => {
               if(a.RecordDate < b.RecordDate)
               {
                  return -1;
               }
               else if (a.RecordDate > b.RecordDate)
               {
                  return 1;
               }
               else
               {
                  return 0;
               }
            });

            $("#loginDetailsForLabel", element).empty();
            let userFullName = userId;
            let userObject = GetUserProfile(userId);
            if(userObject != null)
            {
               userFullName = userObject.UserFullName;
            }
            $("#loginDetailsForLabel", element).append(`for ${userFullName}`);

            $("#auditorLoginDetailInformation", element).empty();
            let notLoggedInDisplay = `<i class="fa fa-x">&nbsp;</i>`;
            let loggedInDisplay = `<i class="fa fa-check">&nbsp;</i>`;

            let loginDataHolder = $(`<div class="auditor-logins-detail-items-holder" id="loginDataHolder_${userId}" />`);
            dataToRender.forEach(function(logItem){
               let userLoginDateHolder = $(`<div class="auditor-login-detail-item auditor-login-day logged-in" />`);
               let userLoggedInDateText = $(`<div class="auditor-login-detail-item auditor-login-date-text" />`);
               userLoggedInDateText.append(new Date(logItem.RecordDate).toLocaleDateString());

               let userLoggedInStatusHolder = $(`<div class="auditor-login-detail-item auditor-login-status" />`);
               userLoggedInStatusHolder.append("✅");

               if(logItem.IsLoggedInForDay == false)
               {
                  userLoggedInStatusHolder.empty();
                  userLoggedInStatusHolder.append("❌");
                  userLoginDateHolder.removeClass("logged-in");
                  userLoginDateHolder.addClass("not-logged-in");
               }

               userLoginDateHolder.append(userLoggedInDateText);
               userLoginDateHolder.append(`<hr class="clearboth" />`);
               userLoginDateHolder.append(userLoggedInStatusHolder);

               loginDataHolder.append(userLoginDateHolder);

            });
            $("#auditorLoginDetailInformation", element).append(loginDataHolder);

            if(callback != null)
            {
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
         function FindUserProfile(userIdToLoad)
         {
            let returnObject = referenceObjects.UserProfiles.find(u => u.UserId == userIdToLoad);
            if (returnObject == null) {
               returnObject = GetUserProfile(userIdToLoad);
            }
            return returnObject;
         }
         /* Utility Functions END */
         /* Show/Hide START */
         function HideAll() {
            HideDetailPanel();
         }
         function HideDetailPanel() {
            $("#auditorLoginDetailPanel", element).hide();
         }
         function ShowDetailPanel() {
            $("#auditorLoginDetailPanel", element).show();
         }

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
            // console.log("Dashboard Load called.");
            // if (params != null) {
            //    if (params.filters != null) {
            //       //set filter information here.
            //    }
            //    if (params.data != null) {
            //       //set data to load here.
            //    }
            // }
            Initialize();
         });
         ko.postbox.subscribe("km2ComplianceDashboardLoginLoad", function(params){
            initialData.length = 0;
            if (params != null) {
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