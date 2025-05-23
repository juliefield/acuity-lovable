angularApp.directive("ngMyTeamMoves", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/TeamDashboard1/view/myTeamMoves.htm?' + Date.now(),
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
         let hasModule = false;
         let myTeamMoves = [];
         let avatarBaseUrl = window.location.protocol + "//" + window.location.hostname + "/applib/css/images/avatars/";
         let defaultAvatarUrl = window.location.protocol + "//" + window.location.hostname + "/jq/avatars/empty_headshot.png";
         let emptySeatAvatarUrl = window.location.protocol + "//" + window.location.hostname + "/applib/css/images/avatars/mrbusiness/pigavatar17.png";
         /* Event Handling START */
         /* Event Handling END */
         scope.Initialize = function () {
            HideAll();
            SetModuleAccess();
         };
         function SetModuleAccess(){
               appLib.getConfigParameterByName("MODULE_ROSTER_TEAM_MOVE_MANAGEMENT", function (param) {
                  if (param != null) {
                     hasModule = (param.ParamValue.toUpperCase() == "On".toUpperCase() || param.ParamValue.toUpperCase() == "Yes".toUpperCase());
                     HideUserMessage();
                  }
               });
         }
         /* Data Loading START */

         function LoadMyTeam(callback, forceReload, teamId) {
            if(hasModule == true)
            {
               if (forceReload == null) {
                  forceReload = false;
               }
               if(teamId == null)
               {
                  teamId = legacyContainer.scope.filters.Team;
               }
               GetMyTeamMoves(function (movesList) {
                  RenderMyTeamMoves(callback, movesList);
               }, forceReload, teamId);
            }
            else
            {
               HideModule();
            }
         }
         /* Data Loading END */
         /* Data Pulls START */
         function GetMyTeamMoves(callback, forceReload, teamId) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (myTeamMoves != null && myTeamMoves.length > 0 && forceReload == false) {
               if (callback != null) {
                  callback(myTeamMoves);
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
                     cmd: "GetMoveRequestsForTeam",
                     teamid: teamId,
                     deepLoad: true,
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let returnData = JSON.parse(data.teamUserMoveList);
                     myTeamMoves.length = 0;
                     for (let i = 0; i < returnData.length; i++) {
                        myTeamMoves.push(returnData[i]);
                     }
                     if (callback != null) {
                        callback(returnData);
                     }
                  }
               });
            }
         }         
         /* Data Pulls END */
         /* Data Rendering START */
         function RenderMyTeamMoves(callback, listToRender) {
            
            if (listToRender == null) {
               listToRender = myTeamMoves;
            }
            
            let userMoveListDataHolder = $(`<div class="user-move-list-holder" />`);
            if(listToRender != null && listToRender.length > 0)
            {
               for (let mIndex = 0; mIndex < listToRender.length; mIndex++) {
                  let teamMoveObject = listToRender[mIndex];
                  let userMoveListDataRow = $(`<div class="user-move-list-row" id="teamMoveUserMoveRow_${teamMoveObject.UserId}_${teamMoveObject.Id}" />`);
                  let moveUserNameHolder  = $(`<div style="display:inline-block;width:50%;text-align:left;" />`);
                  let userName = teamMoveObject.UserId;
                  if(teamMoveObject.UserIdSource != null)
                  {
                     userName = teamMoveObject.UserIdSource.UserFullName;
                  }
                  moveUserNameHolder.append(userName);
                  let moveDateHolder  = $(`<div style="display:inline-block;width:35%;text-align:center;" />`);
                  moveDateHolder.append(new Date(teamMoveObject.EffectiveDate).toLocaleDateString());
                  let moveTypeHolder  = $(`<div style="display:inline-block;width:10%;text-align:center;" />`);
                  let moveTypeVisual = $(`<i class="user-move-icon fa" />`);
                  if(new Date(teamMoveObject.EffectiveDate) < new Date() && teamMoveObject.IsRequestComplete == false)
                  {
                     moveTypeVisual.addClass("fa-user-ninja");                     
                     moveTypeVisual.addClass("past-request-incomplete");
                  }
                  else
                  {
                     switch(teamMoveObject.FutureMoveAction.toLowerCase())
                     {
                        case "join".toLowerCase():                        
                           moveTypeVisual.addClass("fa-user-plus");
                           break;
                        case "leave".toLowerCase():
                           moveTypeVisual.addClass("fa-user-minus");                     
                           break;
                        default:
                           moveTypeVisual.addClass("fa-user-ninja");
                           break;
                     }
   
                  }
                  moveTypeVisual.addClass(teamMoveObject.FutureMoveAction.toLowerCase());
                  userMoveListDataRow.addClass(teamMoveObject.FutureMoveAction.toLowerCase());

                  moveTypeHolder.append(moveTypeVisual);

                  userMoveListDataRow.append(moveUserNameHolder);
                  userMoveListDataRow.append(moveTypeHolder);
                  userMoveListDataRow.append(moveDateHolder);

                  userMoveListDataHolder.append(userMoveListDataRow);
               }
            }
            else
            {
               userMoveListDataHolder.append("No Team Moves for team found.");
            }

            $("#userMoveListHolder", element).empty();
            $("#userMoveListHolder", element).append(userMoveListDataHolder);

            if (callback != null) {
               callback();
            }
         }
         /* Data Rendering END */
         /* Hide/Show START */
         function HideAll() {
            HideUserMessage();
         }
         function HideModule(){
            $("#teamMovesModuleHolder", element).hide();
         }
         function HideUserMessage()
         {
            $("#teamMovesModuleUserMessaging", element).hide();
         }
         function ShowUserMessage()
         {
            $("#teamMovesModuleUserMessaging", element).show();
         }
         /* Hide/Show END */
         /* User Message Writing START */
         function WriteUserMessage(callback, message)
         {
            $("#teamMovesModuleUserMessage", element).empty();
            $("#teamMovesModuleUserMessage", element).append(message);
            ShowUserMessage();
            if(callback != null)
            {
               callback();
            }
         }
         /* User Message Writing END */
         scope.load = function () {
            console.info("myTeamMoves: scope.load()");
            scope.Initialize();
         };

         ko.postbox.subscribe("myTeamOverviewReload", function (forceReload) {
            console.info("Refresh called.");
         });
         ko.postbox.subscribe("myTeamMovesLoad", function (teamId) {
            SetModuleAccess();
            LoadMyTeam(null, true, teamId);
         });
         ko.postbox.subscribe("ResetDirective", function(){
            myTeamMoves.length = 0;
            RenderMyTeamMoves(null, null);
         });
         ko.postbox.subscribe("MarkUserInformation", function(userId){
            $(`[id^="teamMoveUserMoveRow_"]`, element).each(function(){
               $(this).removeClass("active");
            });
            $(`[id^="teamMoveUserMoveRow_${userId}_"]`, element).each(function(){               
               $(this).addClass("active");
            });
         });
      }
   };
}]);