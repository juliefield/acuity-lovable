angularApp.directive("ngAgameRosterTimer", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/AGAMELEAGUES1/view/aGameRosterTimer.htm?' + Date.now(),
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
         let displayUserInformation = true;
         let isUserTeamOwner = false;
         let rosterLockDateTime = null
         let animationIntervalId = -1;
         let daysMs = (24*60*60*1000);
         let hoursMs = (60*60*1000);
         let minutesMs = (60*1000);
         let themeTag = null;
         let themeSelected = null;
         let baseThemeLogo = a$.debugPrefix() + "/applib/css/images/agame-countdown-icon.png";
         let baseBackgroundUrl = a$.debugPrefix() + "/3/ng/AgameFlex/images/game-bg-default-leaderboard.jpg";
         let defaultAvatarUrl = a$.debugPrefix() + "/applib/css/images/empty_headshot.png";
         let currentUserProfile = null;
         let divisionIdList = [];
         let currentOwnersUserIdList = []
         HideAll();
         /* Directive control events section START */
         $("#lnkSetRoster", element).off("click").on("click", function () {
            ko.postbox.publish("SetNavigation", { type: "AGameSetRoster"});
         });
         $("#lnkPlaceWager", element).off("click").on("click", function () {
            ko.postbox.publish("SetNavigation", { type: "WagerBook"});
         });
         /* Directive control events section END */
         scope.Initialize = function () {
            HideAll();
            isUserTeamOwner = DetermineUserTeamOwner();
            LoadBlankTimings();
            GetDivisionIdList();
            LoadThemeInformation();
         };
         /*Listing Load End*/
         /* Load Information START */
         function DetermineUserTeamOwner(forceReload)
         {
            let isTeamOwner = false;

            if (forceReload == null) {
               forceReload = false;
            }
            if (currentOwnersUserIdList != null && forceReload == false) {
               isTeamOwner = (currentOwnersUserIdList.findIndex(u => u == legacyContainer.scope.TP1Username) >= 0);
            }
            else {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "flex",
                     cmd: "getCurrentOwnersList",
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let returnData = JSON.parse(data.ownerUserIdList);
                     currentOwnersUserIdList = returnData;
                     isTeamOwner = (currentOwnersUserIdList.findIndex(u => u == legacyContainer.scope.TP1Username) >= 0);
                  }
               });
            }
            return isTeamOwner;
         }
         function LoadBlankTimings()
         {
            $("#daysRemaining", element).empty();
            $("#hoursRemaining", element).empty();
            $("#minutesRemaining", element).empty();
            $("#secondsRemaining", element).empty();
            $("#daysRemaining", element).append(`--`);
            $("#hoursRemaining", element).append(`--`);
            $("#minutesRemaining", element).append(`--`);
            $("#secondsRemaining", element).append(`--`);
         }
         function LoadDirective(callback)
         {
            if(displayUserInformation == true)
            {
               LoadUserProfile();
               ShowUserInformationHolder();
            }
            ShowTimerHolder();
            LoadRosterLockInformation(function(){
               AnimateTimer();
            });

            if(callback != null)
            {
               callback();
            }
         }
         function LoadUserProfile(callback)
         {
            GetUserProfile(function(userProfile){
               RenderUserProfile(null, userProfile);
            });
         }
         function LoadRosterLockInformation(callback)
         {
            GetRosterLockInformation(function(){
               RenderRosterLockInformation(callback);
            });
         }
         function LoadThemeInformation(callback)
         {
            GetThemeInformation(function(themeData){
               SetThemeInformation(callback, themeData);
            });
         }
         /* Load Information END */
         /* Get Information START */
         function GetUserProfile(callback, forceReload)
         {
            if (forceReload == null) {
               forceReload = false;
            }
            if (currentUserProfile != null && forceReload == false) {
               if (callback != null) {
                  callback(currentUserProfile);
               }
               return;
            }
            else {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "selfserve",
                     cmd: "getUserProfile",
                     userid: legacyContainer.scope.TP1Username
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let returnData = JSON.parse(data.userFullProfile);
                     currentUserProfile = returnData;
                     if (callback != null) {
                        callback(returnData);
                     }
                  }
               });
            }
         }
         function GetDivisionIdList(callback, forceReload)
         {
            if(forceReload == null)
            {
               forceReload = false;
            }
            if(divisionIdList != null && divisionIdList.length > 0 && forceReload == false)
            {
               if(callback != null)
               {
                  callback(divisionIdList);
               }
            }
            else
            {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "flex",
                     cmd: "getDivisionIdsByUserId",
                     userId: legacyContainer.scope.TP1Username,
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let returnData = JSON.parse(data.userDivisionIdsList);
                     divisionIdList.length = 0;
                     for (let i = 0; i < returnData.length; i++) {
                        divisionIdList.push(returnData[i]);
                     }
                     if (callback != null) {
                        callback(returnData);
                     }
                  }
               });

            }
         }
         function GetRosterLockInformation(callback)
         {

            let divisionId = -1;
            if(divisionIdList != null && divisionIdList.length > 0)
            {
               divisionId = divisionIdList[divisionIdList.length - 1] || -1;
            }
            if(divisionId > 0)
            {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "flex",
                     cmd: "getRosterLockDate",
                     dateToLoad: new Date().toLocaleDateString(),
                     divisionId: divisionId
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let returnData = data.rosterLockDate;
                     if(returnData != null)
                     {
                        let tmpDate = new Date(data.rosterLockDate);
                        rosterLockDateTime = new Date(tmpDate.getFullYear(), tmpDate.getMonth(), tmpDate.getDate(), 17, 0, 0);
                     }
                     if (callback != null) {
                        callback();
                     }
                  }
               });
            }
         }
         function GetThemeInformation(callback)
         {
            themeSelected = null;
            themeTag = "";
            console.info("GetThemeInformation()");
            if(callback != null)
            {
               callback();
            }
         }
         /* Get Information END */
         /* Render Information START */
         function SetThemeInformation(callback, themeData)
         {
            if(themeData == null)
            {
               themeData = themeSelected;
            }
            console.info("SetThemeInformation()");
            $("#agameRosterTimer_GameLogo", element).prop("src", baseThemeLogo);
            //themTag = themeData.ThemeTag;
            if(callback != null)
            {
               callback();
            }
         }
         function RenderUserProfile(callback, userProfile)
         {
            if(userProfile == null)
            {
               userProfile = currentUserProfile;
            }
            let userDisplayName = legacyContainer.scope.TP1Username;
            if(userProfile != null)
            {
               userDisplayName = userProfile.UserFullName;
            }

            $("#lblLoggedUserFullName", element).text(userDisplayName);
            //TODO: Determine other things that need to be rendered from the user profile.
         }
         function RenderRosterLockInformation(callback)
         {
            if(rosterLockDateTime == null)
            {
               console.log("roster lock date not set.");
               return;
            }

            $("#rosterCloseDateTime", element).empty();
            $("#rosterCloseDateTime", element).append(`${new Date(rosterLockDateTime).toLocaleDateString()} @ ${new Date(rosterLockDateTime).toLocaleTimeString()}`);

            if(rosterLockDateTime.valueOf() <  new Date().valueOf())
            {
               $("#rosterLockLabel", element).empty();
               $("#rosterLockLabel", element).append(`Rosters Locked on `);
               HideLinks();
               $("#itemLockStatus", element).removeClass("fa-lock-open");
               $("#itemLockStatus", element).addClass("fa-lock");
            }
            if(callback != null)
            {
               callback();
            }
         }
         /* Render Information END */
         /* Write Information START */
         function WriteUserMessage(callback, messageText)
         {
            $("#userInformationMessage", element).empty();
            $("#userInformationMessage", element).append(messageText);
         }

         function AnimateTimer()
         {
            if(rosterLockDateTime == null)
            {
               console.log("roster lock date not set.  Unable to start animation.");
               return;
            }

            animationIntervalId = window.setInterval(function(){
               let timeDiff = rosterLockDateTime.valueOf() - new Date().valueOf();
               if(timeDiff > 0)
               {
                  $("#daysRemaining", element).empty();
                  $("#hoursRemaining", element).empty();
                  $("#minutesRemaining", element).empty();
                  $("#secondsRemaining", element).empty();

                  let days = 0;
                  let hours = 0;
                  let minutes = 0;
                  let seconds = 0;
                  if(timeDiff >= daysMs)
                  {
                     days = Math.floor(timeDiff / daysMs);
                  }
                  timeDiff -= (days * daysMs);
                  if(timeDiff >= hoursMs)
                  {
                     hours = Math.floor(timeDiff / hoursMs);
                  }
                  timeDiff -= (hours * hoursMs);
                  if(timeDiff >= minutesMs)
                  {
                     minutes = Math.floor(timeDiff / minutesMs);
                  }
                  timeDiff -= (minutes * minutesMs);
                  if(timeDiff >= 1000)
                  {
                     seconds = Math.floor(timeDiff / 1000);
                  }
                  timeDiff -= (seconds * 1000);

                  $("#daysRemaining", element).append(`${days.toString().padStart(2, "0")}`);
                  $("#hoursRemaining", element).append(`${hours.toString().padStart(2, "0")}`);
                  $("#minutesRemaining", element).append(`${minutes.toString().padStart(2, "0")}`);
                  $("#secondsRemaining", element).append(`${seconds.toString().padStart(2, "0")}`);
                  ShowLinks();
               }
               else
               {
                  RenderRosterLockInformation();
               }
            }, 1000);
         }
         function StopTimerAnimation()
         {
            window.clearInterval(animationIntervalId);
         }
         /* Write Information END */
         /*Show/Hide/Collapse/Toggle*/
         function HideAll() {
            HideUserMessage();
            HideUserInformationHolder();
            HideTimerHolder();
            HideLinks();

         }
         function HideTimerHolder()
         {
            $("#aGameRosterTimerDisplayHolder", element).hide();
            $("#agameRosterTimer_TimerHolder", element).hide();
         }
         function ShowTimerHolder()
         {
            $("#aGameRosterTimerDisplayHolder", element).show();
            $("#agameRosterTimer_TimerHolder", element).show();
         }
         function HideUserInformationHolder()
         {
            $("#agameRosterTimer_UserInfoHolder", element).hide();
         }
         function ShowUserInformationHolder()
         {
            $("#agameRosterTimer_UserInfoHolder", element).show();
         }
         function HideLinks()
         {
            $("#agameRosterTimer_LinksHolder", element).hide();
         }
         function ShowLinks()
         {
            $("#agameRosterTimer_LinksHolder", element).show();
         }
         function HideUserMessage()
         {
            $("#userInformationMessage", element).hide();
         }
         function ShowUserMessage()
         {
            $("#userInformationMessage", element).show();
         }
         /*Show/Hide/Collapse/Toggle End*/
         scope.load = function () {
            console.log("Directive: AGameRosterTimer Load()");
            scope.Initialize();
            if(isUserTeamOwner == false)
            {
               HideTimerHolder();
               HideUserInformationHolder();
            }
            else
            {
               LoadDirective();
            }
         };
         //scope.load();

         ko.postbox.subscribe("aGameTimerLoad", function () {
            scope.load();
         });
      //    ko.postbox.subscribe("Signal", function(so) {
      //       console.info("Signal Handling.");
      //   });
      }
   };
}]);
