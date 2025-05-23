angularApp.directive("ngPrizeCatalogUserHeader", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/PrizeCatalog/view/PrizeCatalogUserHeader.htm?' + Date.now(),
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
         let currentUserTheme = "default";
         let currentUserLedgerTotal = [];
         let currentUserProfileSettings = [];         
         /* TEST DATA START */
         let availableThemes = [
            {themeId: 1, ThemeName: "Dragons", ThemeTag: "dragons"},
            // {themeId: 2, ThemeName: "Tiki Beach", ThemeTag: "tiki"},
            {themeId: 3, ThemeName: "Under the Sea", ThemeTag: "under-the-sea"},
            // {themeId: 4, ThemeName: "Cute Animals", ThemeTag: "cute-animals"},
            // {themeId: 5, ThemeName: "Gone Bananas!", ThemeTag: "bananas"},
            // {themeId: 6, ThemeName: "Gridiron", ThemeTag: "gridiron"},
            {themeId: 7, ThemeName: "Hoops", ThemeTag: "hoops"},
            // {themeId: 8, ThemeName: "Squishies", ThemeTag: "squishies"},
            // {themeId: 9, ThemeName: "Super Heros", ThemeTag: "super-heros"},
            // {themeId: 10, ThemeName: "Sweet Treats", ThemeTag: "sweet-treats"},
            // {themeId: 11, ThemeName: "Cars", ThemeTag: "flying-cars"},
            // {themeId: 12, ThemeName: "Prizes", ThemeTag: "prizes"},
            // {themeId: 13, ThemeName: "Treasure Hunt", ThemeTag: "treasure-hunt"},
            // {themeId: 14, ThemeName: "Football", ThemeTag: "gridiron"},
            // {themeId: 15, ThemeName: "Olympics", ThemeTag: "medalist"},
            // {themeId: 16, ThemeName: "Baseball", ThemeTag: "hits"},
            // {themeId: 17, ThemeName: "Tiki Beach", ThemeTag: "tiki"},
            // {themeId: 18, ThemeName: "Unicorns", ThemeTag: "unicorns"},
            // {themeId: 19, ThemeName: "Prizes", ThemeTag: "prizes"},
            // {themeId: 20, ThemeName: "Prizes", ThemeTag: "prizes"},
            // {themeId: 21, ThemeName: "Prizes", ThemeTag: "prizes"},
            // {themeId: 22, ThemeName: "Prizes", ThemeTag: "prizes"},
            // {themeId: 23, ThemeName: "Prizes", ThemeTag: "prizes"},
            // {themeId: 24, ThemeName: "Prizes", ThemeTag: "prizes"},
            // {themeId: 25, ThemeName: "Prizes", ThemeTag: "prizes"},
            
         ];
         /* TEST DATA END */
         /* Event Handling START */
         $(".btn-cancel", element).off("click").on("click", function(){
            CancelUserThemeChange(function(){
               HideChangeThemeForm();
            });
         });
         $("#btnRefresh", element).off("click").on("click", function(){
            console.log("btnRefresh clicked");
         });
         $("#changeUserCatalogTheme", element).off("click").on("click", function(){
            LoadUserThemeChangeForm(function(){
               ShowChangeThemeForm();
            });
         });
         $("#currentUserThemeChangeIcon", element).off("click").on("click", function(){
            LoadUserThemeChangeForm(function(){
               ShowChangeThemeForm();
            });
         });
         $("#btnSaveUserTheme", element).off("click").on("click", function(){
            SaveUserThemeChange(function(){
               let currentUserSettings = FindCurrentUserProfileSettingsForClient();
               currentUserTheme = currentUserSettings?.VirtualPrizeCatalogSettings?.CurrentTheme || "default";
               ko.postbox.publish("userPrizeThemeChange", currentUserTheme);
               ko.postbox.publish("prizeCatalogUserHeaderReload");
               HideChangeThemeForm();
            });
         });
         /* Event Handling END */
         scope.Initialize = function () {
            HideAll();
            LoadThemeOptions();
            LoadCurrentUserSettings();
         };         
         /* Data Loading START */
         function LoadDirective()
         {
            LoadLoggedUserInformation();
            LoadUserScoringStatusData();
         }
         function LoadCurrentUserSettings(callback)
         {
            GetLoggedUserProfileSettings();

         }
         function LoadLoggedUserInformation(callback)
         {
            GetLoggedUserInformation(function(userData){
               RenderLoggedUserInformation(function(){
                  let currentUserSettings = FindCurrentUserProfileSettingsForClient();
                  currentUserTheme = currentUserSettings?.VirtualPrizeCatalogSettings?.CurrentTheme || "default";               
                  ko.postbox.publish("userPrizeThemeChange", currentUserTheme);
               }, userData);
            });
            GetUserCurrentCredits(function(ledgerData){
               RenderUserCurrentCredits(function(){
                  console.log("Handle user loaded event across all of the prize catalog items.");
               }, ledgerData);
            });
         }
         function LoadUserScoringStatusData(callback, userId)
         {
            GetUserScoringStatusData(function(scoringData){
               RenderUserScoringStatusData(callback, scoringData, userId);
            }, userId);
         }
         function LoadThemeOptions(callback)
         {
            $("#prizeCatalogNewUserTheme", element).empty();
            $("#prizeCatalogNewUserTheme", element).append($(`<option />`, {text: "Default", value: "default"}));
            availableThemes.forEach(function(themeItem){
               $("#prizeCatalogNewUserTheme", element).append($(`<option />`, {text: themeItem.ThemeName, value: themeItem.ThemeTag}));
            });
            if(callback != null)
            {
               callback();
            }
         }
         function FindCurrentUserProfileSettingsForClient(clientId)
         {
            if(clientId == null || clientId < 0)
            {
               clientId = 0;
            }
            let returnSettings =  currentUserProfileSettings.find(i => i.Client == clientId);
            //no settings found, try to load the general/overall settings.
            if(returnSettings == null && clientId > 0) 
            {
               returnSettings = currentUserProfileSettings.find(i => i.Client == 0);
            }
            return returnSettings;

         }
         /* Data Loading END */
         /* Data Pulls START */
         function GetLoggedUserInformation(callback) {
            a$.ajax({
               type: "POST",
               service: "C#",
               async: false,
               data: {
                  lib: "selfserv",
                  cmd: "getUserProfile",
                  userid: legacyContainer.scope.TP1Username
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (data) {
                  let returnData = JSON.parse(data.userFullProfile);
                  loggedUserData = returnData;
                  if (callback != null) {
                     callback(returnData);

                  }
                  else {
                     return returnData;
                  }
               }
            });
         }
         function GetLoggedUserProfileSettings(callback)
         {
            a$.ajax({
               type: "POST",
               service: "C#",
               async: false,
               data: {
                  lib: "userprofile",
                  cmd: "getProfileSettings",
                  userid: legacyContainer.scope.TP1Username
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (data) {                  
                  let returnData = JSON.parse(data.userProfileSettings);
                  currentUserProfileSettings = returnData;
                  if (callback != null) {
                     callback(returnData);

                  }
                  else {
                     return returnData;
                  }
               }
            });
         }
         function GetUserScoringStatusData(callback, userIdToLoad)
         {
            let userScoringData = [];
            for(let i = 1; i <= 8; i++)
            {
               let scoringItem = new Object(); 
               scoringItem.scoringId = i;
               scoringItem.Name = `Scoring ${i}`;
               let itemDate = new Date();
               scoringItem.Date = itemDate.setDate(itemDate.getDate() - (i-1)) ;
               let randomNumber = Math.floor(Math.random() * 10);
               scoringItem.IsEarned = ((randomNumber % 3) != 0);

               userScoringData.push(scoringItem);
            }
            console.log("GetUserScoringStatusData()");
            if(callback != null)
            {
               callback(userScoringData);
            }
         }
         function GetUserCurrentCredits(callback)
         {
            a$.ajax({
               type: "POST",
               service: "C#",
               async: false,
               data: {
                  lib: "flex",
                  cmd: "getUserTotalVirtualPrizeCredits",
                  userid: legacyContainer.scope.TP1Username
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (data) {
                  let returnData = JSON.parse(data.userTotalLedger);
                  let curLedgerIndex = currentUserLedgerTotal.find(i => i.UserId == legacyContainer.scope.TP1Username);
                  if(curLedgerIndex < 0)
                  {
                     currentUserLedgerTotal.push(returnData);
                  }
                  else
                  {
                     currentUserLedgerTotal[curLedgerIndex] = returnData;
                  }
                  if (callback != null) {
                     callback(returnData);

                  }
                  else {
                     return returnData;
                  }
               }
            });
            //
         }
         /* Data Pulls END */
         /* Data Rendering START */
         function RenderLoggedUserInformation(callback, userDataToRender) {
            if(userDataToRender == null)
            {
               userDataToRender = loggedUserData;
            }
            let currentUserSettings = FindCurrentUserProfileSettingsForClient();            
            let userObject = userDataToRender;
            let userFullName = legacyContainer.scope.TP1Username;
            let currentUserCredits = 0;
            let userAvatarUrl = "/applib/css/images/empty_headshot.png";

            if(userObject != null)
            {
               userAvatarUrl =  userObject.AvatarImageFileName;
               if(currentUserSettings != null)
               {
                  if(currentUserSettings.AvatarFileName != null && currentUserSettings.AvatarFileName != "")
                  {
                     userAvatarUrl = `${currentUserSettings.AvatarFileLocationBaseUrl}${currentUserSettings.AvatarFileName}`;
                  }
               }
               userFullName = userObject.UserFullName;
               currentUserCredits = 0;
            }
            userAvatarUrl = Global_CleanAvatarUrl(userAvatarUrl);
            
            currentUserTheme = currentUserSettings?.VirtualPrizeCatalogSettings?.CurrentTheme || "default";

            $("#loggedUserAvatar").prop("src", `${userAvatarUrl}`);
            $("#lblLoggedUserName").text(userFullName);
            //$("#currentUserThemeChangeIcon").prop("src", `../../../../applib/css/images/themes/${currentUserTheme}/ChangeTheme.png`);
            //$("#currentUserThemeChangeIcon").prop("src", `../../../../applib/css/images/prize-catalog/${currentUserTheme}/_change-theme.png`);
            $("#currentUserThemeChangeIcon").prop("src", `/applib/css/images/prize-catalog/${currentUserTheme}/_change-theme.png`);
            //let themeBackground = `../../../../applib/css/images/themes/${currentUserTheme}/Background.jpg`;
            let themeBackground = `/applib/css/images/themes/${currentUserTheme}/Background.jpg`;
            $("#userThemeBackgroundHolder").css("background-image", "url('" + themeBackground + "')");            
            $("#lblLoggedUserCurrentCredits").text(currentUserCredits);
            if(callback != null)
            {
               callback(userDataToRender);
            }
         }
         function RenderUserScoringStatusData(callback, listToRender, userId)
         {
            if(listToRender == null)
            {
               console.log("No list  found to render.");
               return;
            }
            $("#userScoringStatusHolder").empty();
            if(listToRender.length > 0)
            {
               listToRender.forEach(function(statusItem){                  
                  let userScoringStatusItem = $(`<div class="prize-catalog-user-header-scoring-status-item" id="userScoringItem_${userId}_${statusItem.scoringId}" />`);
                  let userScoringStatusImageHolder = $(`<div class="prize-catalog-user-header-scoring-image-holder" id="userScoringImageHolder_${userId}_${statusItem.scoringId}" />`);
                  //let scoringImage = `/applib/css/images/themes/${currentUserTheme}/status-success.png`;
                  let scoringImage = `/applib/css/images/prize-catalog/${currentUserTheme}/_gain-points.png`;
                  

                  let userScoringPointsEarnedValue = "+88888";
                  let pointsEarnedClass = "earned";
                  if(statusItem.IsEarned == false)
                  {
                     //scoringImage = `/applib/css/images/themes/${currentUserTheme}/status-failure.png`;
                     scoringImage = `/applib/css/images/prize-catalog/${currentUserTheme}/_no-points.png`;
                     userScoringPointsEarnedValue = "0";
                     pointsEarnedClass = "not-earned";
                  }
                  let userScoringStatusImage = $(`<img class="prize-catalog-user-header-scoring-item-image" src="${scoringImage}" id="userScoringItemImage_${userId}_${statusItem.scoringId}" />`);
                  let userScoringDateHolder = $(`<div class="prize-catalog-user-header-scoring-date-holder" id="userScoringDateHolder_${userId}_${statusItem.scoringId}" />`);

                  let userScoringPointsEarnedHolder = $(`<div class="prize-catalog-user-header-scoring-points-holder ${pointsEarnedClass}" id="userScoringPointsHolder_${userId}_${statusItem.scoringId}" />`);
                  let userScoringPointsEarnedTextHolder = $(`<div class="prize-catalog-user-header-scoring-points-text-holder ${pointsEarnedClass}" id="userScoringPointsTextHolder_${userId}_${statusItem.scoringId}" />`);

                  userScoringPointsEarnedTextHolder.append(userScoringPointsEarnedValue);
                  userScoringPointsEarnedHolder.append(userScoringPointsEarnedTextHolder);

                  userScoringDateHolder.append(new Date(statusItem.Date).toLocaleDateString());

                  userScoringStatusImageHolder.append(userScoringStatusImage);
                  
                  userScoringStatusItem.append(userScoringStatusImageHolder);
                  userScoringStatusItem.append(userScoringDateHolder);
                  userScoringStatusItem.append(userScoringPointsEarnedHolder);

                  //userScoringStatusItem.append(statusItem.Name);

                  $("#userScoringStatusHolder").append(userScoringStatusItem);
               });
            }
            else
            {
               $("#userScoringStatusHolder").append("&nbsp;");
               console.log("NO User Scoring stats data found.");
            }
         }
         function RenderUserCurrentCredits(callback, dataToRender)
         {
            if(dataToRender == null)
            {
               dataToRender = currentUserLedgerTotal;

            }
            let userPoints = dataToRender.find(i => i.UserId == legacyContainer.scope.TP1Username);

            let currentUserPoints = 0;
            if(userPoints != null)
            {
               currentUserPoints = userPoints.UserBalance;;
            }
            $("#userCurrentCreditsLabel", element).text(currentUserPoints);
            if(callback != null)
            {
               callback();
            }
         }
         /* Data Rendering END */
         /* Form Handling START */
         function LoadUserThemeChangeForm(callback)
         {
            console.log("LoadUserThemeChangeForm() called.");
            if(callback != null)
            {
               callback();
            }
         }
         function ConfirmUserThemeChange(callback)
         {
            console.log("ConfirmUserThemeChange() called.");
            if(callback != null)
            {
               callback();
            }
         }
         function SaveUserThemeChange(callback)
         {
            let newTheme = $("#prizeCatalogNewUserTheme", element).val();
            a$.ajax({
               type: "POST",
               service: "C#",
               async: false,
               data: {
                  lib: "userprofile",
                  cmd: "updateVirtualPrizeCatalogTheme",
                  userid: legacyContainer.scope.TP1Username,
                  newtheme: newTheme,
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (data) {                  
                  GetLoggedUserProfileSettings(callback);
               }
            });
         }
         function CancelUserThemeChange(callback)
         {
            console.log("CancelUserThemeChange() called.");
            if(callback != null)
            {
               callback();
            }
         }
         /* Form Handling END */
         /* Show/Hide START */
         function HideAll()
         {
            HideChangeThemeForm();
         }
         function HideChangeThemeForm()
         {
            $("#prizeCatalogUserHeaderThemeFormHolder", element).hide();
         }
         function ShowChangeThemeForm()
         {
            $("#prizeCatalogUserHeaderThemeFormHolder", element).show();
         }
         /* Show/Hide END */
         
         scope.load = function () {
            scope.Initialize();
            LoadDirective();
         };
         scope.load();

         ko.postbox.subscribe("prizeCatalogUserHeaderReload", function () {
            scope.load();
         });
      }
   };
}]);