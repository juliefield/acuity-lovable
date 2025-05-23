angularApp.directive("ngCoachingSuggestionsWidget", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/AcuityAI1/view/CoachingSuggestionsWidget.htm?' + Date.now(),
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
         let myCoachingSuggestions = [];
         let myMqfNumbers = [];
         /* Event Handling START */
         /* Event Handling END */
         scope.Initialize = function () {
            HideAll();
         };
         /* Data Loading START */
         function LoadMySuggestions(callback, forceReload, teamId)
         {
            if(forceReload == null)
            {
               forceReload = false;
            }
            if(teamId == null)
            {
               teamId = -1;
            }
            GetMySuggestions(function(suggestionList){
               RenderMySuggestions(callback, suggestionList);
            }, forceReload, teamId);

         }
         /* Data Loading END */
         /* Data Pulls START */
         function GetMySuggestions(callback, forceReload, teamId) {
            if (forceReload == null) {
               forceReload = false;
            }
            if(myCoachingSuggestions != null && myCoachingSuggestions.length > 0 && forceReload == false)
            {
               if(callback != null)
               {
                  callback(myCoachingSuggestions);
               }
            }
            else
            {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: true,
                  data: {
                     lib: "selfserve",
                     cmd: "GetCoachingSuggestionsByTeamId",
                     teamid: teamId,
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let returnData = JSON.parse(data.teamSuggestionList);
                     myCoachingSuggestions.length = 0;
                     for (let i = 0; i < returnData.length; i++) {
                        myCoachingSuggestions.push(returnData[i]);
                     }
                     if (callback != null) {
                        callback();
                     }
                  }
               });
            }

          }         
         /* Data Pulls END */
         /* Data Rendering START */
         function RenderMySuggestions(callback, listToRender)         
         {
            if(listToRender == null)
            {
               listToRender = myCoachingSuggestions;
            }
            let maxItemsToRender = 10;

            if(listToRender.length < maxItemsToRender)
            {
               maxItemsToRender = listToRender.length;
            }
            let coachingSuggestionListHolder = $(`<div class="coaching-suggestion-widget-list-holder" />`);
            if(listToRender != null && listToRender.length > 0)
            {
               for(let sIndex = 0; sIndex < maxItemsToRender; sIndex++)
               {
                  let suggestionObject = listToRender[sIndex];
                  let coachingSuggestionRow = $(`<div class="coaching-suggestion-widget-row" id="coachingSuggestionWidgetRow_${suggestionObject.ActivityOnUserId}_${suggestionObject.MqfNumber}" />`);
                  let coachingSuggestionNameHolder = $(`<div class="coaching-suggestion-widget-item coaching-suggestion-name" />`);
                  let coachingSuggestionTypeHolder = $(`<div class="coaching-suggestion-widget-item coaching-suggestion-suggestion" />`);
                  let coachingSuggestionAreaHolder = $(`<div class="coaching-suggestion-widget-item coaching-suggestion-area" />`);
                  let coachingSuggestionButtonHolder = $(`<div class="coaching-suggestion-widget-item coaching-suggestion-button-holder" />`);
                  let userDisplayName = suggestionObject.ActivityOnUserId;
                  if(suggestionObject.ActivityOnUserIdSource != null)
                  { 
                     userDisplayName = suggestionObject.ActivityOnUserIdSource.UserFullName;
                  }
                  coachingSuggestionNameHolder.append(userDisplayName);
                  let suggestionType = suggestionObject.SidekickSuggestionTypeId;
                  if(suggestionObject.SidekickSuggestionTypeIdSource != null)
                  {
                     suggestionType = suggestionObject.SidekickSuggestionTypeIdSource.SidekickSuggestionTypeName;
                  }
                  
                  coachingSuggestionTypeHolder.append(suggestionType);
   
                  //GetSuggestionAreaByMqfNumber
                  let suggestionAreaText = suggestionObject.MqfNumber;
                  let suggestionArea = GetSuggestionAreaByMqfNumber(suggestionObject.MqfNumber);
                  if(suggestionArea != null)
                  {
                     suggestionAreaText = suggestionArea.Name;
                  }
                  coachingSuggestionAreaHolder.append(suggestionAreaText);

                  let goButton = $(`<button id="coachButton_${suggestionObject.ActivityOnUserId}" class="button btn">Go</button>`);
                  goButton.on("click", function(){
                     let id = this.id;
                     let userId = id.split("_")[1];
                     alert(`No Implemented - Go to Sidekick for ${userId}`);
                  });
                  coachingSuggestionButtonHolder.append(goButton);
                  coachingSuggestionRow.append(coachingSuggestionNameHolder);
                  coachingSuggestionRow.append(coachingSuggestionTypeHolder);
                  coachingSuggestionRow.append(coachingSuggestionAreaHolder);
                  coachingSuggestionRow.append(coachingSuggestionButtonHolder);
   
   
                  coachingSuggestionListHolder.append(coachingSuggestionRow);
               }
            }
            else
            {
               coachingSuggestionListHolder.append("No Coaching Suggestions found.");
            }
            
            $("#userCoachingSuggestionListHolder", element).empty();
            $("#userCoachingSuggestionListHolder", element).append(coachingSuggestionListHolder);
            if(callback != null)
            {
               callback();               
            }
         }
         function GetSuggestionAreaByMqfNumber(mqfNumber)
         {
            let mqfIndex = myMqfNumbers.findIndex(m => m.MqfNumber == mqfNumber);

            if(mqfIndex < 0)
            {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "selfserve",
                     cmd: "getKpiByMqfNumber",
                     mqfnumber: mqfNumber,
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let returnData = JSON.parse(data.kpiObject);
                     myMqfNumbers.push(returnData);
                     mqfIndex = myMqfNumbers.findIndex(m => m.MqfNumber == mqfNumber);                     
                  }
               });
            }

            return myMqfNumbers[mqfIndex];

         }
         /* Data Rendering END */
         /* Hide/Show START */
         function HideAll() {
         }
         /* Hide/Show END */
         /* User Message Writing START */
         /* User Message Writing END */
         scope.load = function () {
            console.info("Widget scope.load()");
            scope.Initialize();            
         };         
         // ko.postbox.subscribe("myTeamOverviewReload", function (forceReload) {
         //    console.info("Refresh called.");
         // });
         ko.postbox.subscribe("myCoachingSuggestionsLoad", function (teamId) {
            LoadMySuggestions(null, true, teamId);
         });         
         ko.postbox.subscribe("ResetDirective", function(){
            myCoachingSuggestions.length = 0;
            RenderMySuggestions();
         });
         ko.postbox.subscribe("MarkUserInformation", function(userId){
            $(`[id^="coachingSuggestionWidgetRow_"]`, element).each(function(){
               $(this).removeClass("active");
            });
            $(`[id^="coachingSuggestionWidgetRow_${userId}_"]`, element).each(function(){               
               $(this).addClass("active");
            });
         });
      }
   };
}]);