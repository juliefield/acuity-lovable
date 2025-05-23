angularApp.directive("ngVirtualMentorList", ['api', '$compile', '$rootScope', function (api, $compile, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/VIRTUALMENTOR1/view/virtualMentorList.htm?' + Date.now(),
      scope: {
         assoc: "@",
         text: "@",
         details: "@",
         cid: "@",
         filters: "@",
         panel: "@",
         hidetopper: "@",
         toppertext: "@",
      },
      require: '^ngLegacyContainer',
      link: function (scope, element, attrs, legacyContainer) {
         var actionListingText = [
            { code: "coach", listingType: null, text: "COACH {$usersname$} in {$kpiName$}." },
            { code: "recognize", listingType: null, text: "RECOGNIZE {$usersname$} for excellence in {$kpiName$}." },
            { code: "game", listingType: "group", text: "Add/Create a game for the the area of {$kpiName$}" },
            { code: "touch", listingType: null, text: "You have not had an interation with {$usersname$} in {$daysSinceTouch$} days." }
         ];

         const REMOVE_ALL_USERS_ID = "ALLUSERS";
         let ignoreDaysNumber = 1;
         var userOptionList = [];
         let possibleUsers = [];
         let usersLoaded = false;
         let maxScoreConfigParam = null;
         let userWeightedRank = [];
         var currentUserIgnoreList = [];
         let kpiDataList = [];
         let currentUserScoreList = [];

         scope.Initialize = function () {
            HideAll();
            SetDatePickerFields();
            LoadPossibleUsers(true, function () {
               usersLoaded = true;
               LoadMentorList(true);
            });
            LoadPossibleKpiList();
            LoadCurrentUserIgnoreList();
            appLib.getConfigParameterByName("MAX_SCORE_VALUE", function (returnParameter) {
               maxScoreConfigParam = returnParameter;
            });
            appLib.getConfigParameterByName("DEFAULT_VIRTUALMENTOR_IGNORE_DAYS", function (returnParameter) {
               if (returnParameter != null && returnParameter.ParamValue != null) {
                  ignoreDaysNumber = parseInt(returnParameter.ParamValue);
               }
            });

         };

         function SetDatePickerFields() {
            $("#taskDate", element).datepicker();
            $("#ignoreUntilDate", element).datepicker();
         }
         function GenerateSuggestionListForUser(userId, callback) {
            userOptionList.length = 0;
            WriteUserLoadingMessage("Generating the best course of actions for you.  This may take a few minutes...");
            a$.ajax({
               type: "POST",
               service: "C#",
               async: false,
               data: {
                  lib: "selfserve",
                  cmd: "generateSuggestionListForUser",
                  userid: userId
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (data) {
                  if (callback != null) {
                     callback();
                  }
               }
            });
         }
         function LoadPossibleUsers(forceReload, callback) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (possibleUsers != null && possibleUsers.length > 0 && forceReload == false) {
               if (callback != null) {
                  callback(possibleUsers);
               }
            }
            else {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: true,
                  data: {
                     lib: "selfserve",
                     cmd: "getAllProfiles",
                     deepload: false
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let userList = JSON.parse(data.allProfilesList);
                     possibleUsers.length = 0;
                     possibleUsers = userList;
                     if (callback != null) {
                        callback(userList);
                     }
                  }
               });
            }
         }
         function LoadPossibleKpiList(forceReload, callback) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (kpiDataList != null && kpiDataList.length > 0 && forceReload == false) {
               if (callback != null) {
                  callback(kpiDataList);
               }
            }
            else {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "selfserve",
                     cmd: "getAllKpis",
                     deepLoad: false,
                     includeBalancedScore: true
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let kpiList = JSON.parse(data.kpiList);
                     kpiDataList.length = 0;
                     kpiDataList = kpiList;
                     if (callback != null) {
                        callback(kpiList);
                     }
                  }
               });
            }
         }
         function LoadCurrentUserIgnoreList(forceReload, callback) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (currentUserIgnoreList != null && currentUserIgnoreList.length > 0 && forceReload == false) {
               if (callback != null) {
                  callback(currentUserIgnoreList);
               }
            }
            else {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: true,
                  data: {
                     lib: "selfserve",
                     cmd: "getVirtualMentorIgnoreList",
                     userid: legacyContainer.scope.TP1Username
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let currentIgnoreList = JSON.parse(data.currentUserIgnoreList);
                     currentUserIgnoreList.length = 0;
                     currentUserIgnoreList = currentIgnoreList;
                     if (callback != null) {
                        callback(currentIgnoreList);
                     }
                  }
               });
            }
         }
         function RemoveUserFromIgnoreList(userIdToRemove, callback) {
            //TODO: Handle the confirm message
            let confirmMessage = "Remove user from list?";

            if (userIdToRemove == REMOVE_ALL_USERS_ID) {
               confirmMessage = "You are about to clear the list.\nPress OK to continue or CANCEL to not perform this action.";
            }

            if (confirm(confirmMessage)) {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "selfserve",
                     cmd: "removeUserFromIgnoreList",
                     useridtoremove: userIdToRemove,
                     currentuserid: legacyContainer.scope.TP1Username
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function () {
                     if (callback != null) {
                        callback();
                     }
                  }
               });
            }
         }
         function GetCurrentUserKpiScoreObject(mqfNumber, subTypeId, userId) {
            let returnObject = null;
            if (currentUserScoreList != null && currentUserScoreList.length > 0) {
               returnObject = currentUserScoreList.find(s => s.MqfNumber == mqfNumber && s.UserId == userId && (s.SubTypeId == subTypeId || subTypeId == 0));
            }
            if (returnObject == null) {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "userprofile",
                     cmd: "getCurrentScoreForKpi",
                     userid: userId,
                     mqfnumber: mqfNumber,
                     subtypeid: subTypeId
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let kpiScore = JSON.parse(data.currentScoringInfo);
                     currentUserScoreList.push(kpiScore);
                     returnObject = kpiScore;
                  }
               });
            }
            return returnObject;
         }
         function LoadMentorList(forceReload, callback) {
            GetMentorList(forceReload, function (listToRender) {
               RenderMentorList(listToRender, function () {
                  HideLoader();
                  if (callback != null) {
                     callback();
                  }
               });
            });
         }
         function GetMentorList(forceReload, callback) {
            WriteUserLoadingMessage("Determining best course of actions for you...");

            if (forceReload == null) {
               forceReload = false;
            }
            if (userOptionList != null && userOptionList.length != 0 && forceReload == false) {
               if (callback != null) {
                  callback();
               }
            }
            else {

               userOptionList.length = 0;

               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: true,
                  data: {
                     lib: "selfserve",
                     cmd: "getCurrentSuggestionListForUser",
                     userid: legacyContainer.scope.TP1Username
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     var suggestionList = JSON.parse(data.suggestionList);
                     userOptionList.length = 0;
                     userOptionList = suggestionList;
                     if (callback != null) {
                        callback(userOptionList);
                     }
                  }
               });
            }
         }
         function RenderMentorList(listToRender, callback) {
            WriteUserLoadingMessage("Rendering the list for you...");

            if (listToRender == null) {
               listToRender = userOptionList;
            }
            //listToRender = SortMentorList(listToRender);

            let statListHolder = $("<div />");
            $("#virtualMentorListHolder", element).empty();
            if (listToRender != null && listToRender.length > 0) {
               let renderCount = 0;
               for (let i = 0; i < listToRender.length; i++) {
                  let listItem = listToRender[i];
                  if (listItem.Status.toLowerCase() != "Complete".toLowerCase()) {

                     let isUserOnIgnoreList = (currentUserIgnoreList.findIndex(u => u.IgnoreUserId == listItem.UserId) > -1);
                     let isCoachingAvailable = IsCoachingOptionAvailable(listItem);
                     let isRecognizeAvailable = IsRecognizeOptionAvailable(listItem);
                     if (!isUserOnIgnoreList) {
                        let id = listItem.VirtualMentorSuggestionId;
                        let listItemRow = $("<div class=\"virtual-mentor-list-row\" />");

                        let userNameHolder = $("<div class=\"virtual-mentor-list-item user-name\" />");
                        let userInput = $("<input type=\"hidden\" id=\"mentorUserItem_" + id + "\" value=\"" + listItem.UserId + "\" />");
                        let userName = listItem.UserId;
                        if (listItem.UserIdSource != null) {
                           userName = listItem.UserIdSource.UserFullName;
                        }
                        else {
                           let user = possibleUsers.find(u => u.UserId == listItem.UserId);
                           if (user != null) {
                              userName = user.UserFullName;
                           }
                        }
                        userNameHolder.append(userName);
                        userNameHolder.append(userInput);

                        let userScoringInfoHolder = $("<div class=\"virtual-mentor-list-item option-scoring-data\" />");
                        let includeBalancedScore = true;
                        RenderCurrentUserScore(listItem, userScoringInfoHolder, includeBalancedScore);
                        let mentorButtonHolder = $("<div class=\"virtual-mentor-list-item button-holder\" />");

                        let addCoachingItemButton = $("<button class=\"button btn\" id=\"addSidekick_" + id + "\">Coach</button>");
                        addCoachingItemButton.on("click", function () {
                           let buttonId = this.id;
                           let id = buttonId.split("_")[1];
                           MarkActionTaken(id, "coaching", function () {
                              ko.postbox.publish("virtualMentorListReload", true);
                           });
                        });
                        let addRecognitionItemButton = $("<button class=\"button btn\" id=\"addRecognition_" + id + "\">Recognize</button>");
                        addRecognitionItemButton.on("click", function () {
                           let buttonId = this.id;
                           let id = buttonId.split("_")[1];
                           MarkActionTaken(id, "recognizing", function(){
                              ko.postbox.publish("virtualMentorListReload", true);
                           });
                        });
                        let addUserToIgnoreList = $("<button class=\"button btn\" id=\"assUserIgnore_" + id + "\">Ignore User</button>");
                        addUserToIgnoreList.on("click", function () {
                           let buttonId = this.id;
                           let id = buttonId.split("_")[1];
                           LoadVirtualMentorIgnoreForm(id, function () {
                              ShowVirtualMentorIgnoreForm();
                           });
                        });
                        let ignoreSuggestionButton = $("<button class=\"button btn\" id=\"ignoreSuggestion_" + id + "\">Ignore</button>");
                        ignoreSuggestionButton.on("click", function () {
                           let buttonId = this.id;
                           let id = buttonId.split("_")[1];
                           ConfirmIgnoreSuggestion(id, function () {
                              MarkActionTaken(id, "ignored", function(){
                                 ko.postbox.publish("virtualMentorListReload", true);
                              });
                           });
                        });
                        if (isCoachingAvailable == true) {
                           mentorButtonHolder.append(addCoachingItemButton);
                           mentorButtonHolder.append("&nbsp;");
                        }
                        if (isRecognizeAvailable == true) {
                           mentorButtonHolder.append(addRecognitionItemButton);
                           mentorButtonHolder.append("&nbsp;");
                        }

                        mentorButtonHolder.append(ignoreSuggestionButton);

                        let suggestionKpiSection = $("<div class=\"virtual-mentor-kpi-suggestion-holder\" />");

                        let suggestedActionRow = $("<div class=\"virtual-mentor-suggestion-row\" />");
                        RenderSuggestedActionListForUser(listItem, suggestedActionRow);

                        suggestionKpiSection.append(suggestedActionRow)

                        userNameHolder.append("&nbsp;");
                        userNameHolder.append(addUserToIgnoreList);

                        listItemRow.append(userNameHolder);
                        listItemRow.append(userScoringInfoHolder);
                        listItemRow.append(mentorButtonHolder);

                        listItemRow.append(suggestionKpiSection);

                        statListHolder.append(listItemRow);
                        renderCount++;
                     }

                  }
               }
               if (renderCount == 0) {
                  statListHolder.append("No suggestions found for users that are not ignored or complete.");
               }
            }
            else {
               statListHolder.append("No options found.");
            }
            $("#virtualMentorListHolder", element).append(statListHolder);
            HideAllUserScorePanels();

            if (callback != null) {
               callback();
            }
         }
         function RenderSuggestedActionListForUser(suggestionObject, renderToObject) {
            //let id = suggestionObject.VirtualMentorSuggestionId;
            //let maxScoreValue = parseInt(maxScoreConfigParam.ParamValue);
            let suggestedActions = $("<div />");
            let suggestedActionsHeader = $("<div class=\"suggested-actions-header\" />");
            suggestedActions.append(suggestedActionsHeader);
            let suggestedIndividualAction = suggestionObject.SuggestedIndividualAction;
            let suggestedGroupAction = suggestionObject.SugggestedGroupAction;

            let actionText = "";
            if (IsTouchRequired(suggestionObject) == true) {
               actionText += GetTextForAction("touch") + "{$newline$}";
            }


            if (suggestedIndividualAction != null && suggestedIndividualAction != "") {
               actionText += GetTextForAction(suggestedIndividualAction);

               if (actionText != null && actionText != "") {
                  actionText = FormatActionText(actionText, suggestionObject, true);
                  let suggestedActionListItem = $("<div class=\"" + suggestedIndividualAction + "\" />");
                  suggestedActionListItem.append(actionText);
                  suggestedActions.append(suggestedActionListItem);
               }
            }

            $(renderToObject).append(suggestedActions);
         }
         function GetTextForAction(action) {

            let returnText = "";
            let actionOption = actionListingText.find(a => a.code.toLowerCase() == action.toLowerCase());
            if (actionOption != null) {
               returnText = actionOption.text;
            }
            else if (action != "assign") {
               returnText = "[Unknown Action: " + action + "]";
            }
            return returnText;
         }
         function FormatActionText(baseString, dataObject, includeFormattingOptions) {

            if (includeFormattingOptions == null) {
               includeFormattingOptions = true;
            }

            if (baseString == null) {
               baseString = "";
            }
            let returnString = baseString;
            let lastDays = "AT LEAST 180";
            if (dataObject.LastTouchedDate != null) {
               lastDays = GetDaysFromToday(dataObject.LastTouchedDate)
            }
            let userName = dataObject.UserId;
            if (dataObject.UserIdSource != null) {
               userName = dataObject.UserIdSource.UserFullName;
            }
            else {
               let user = possibleUsers.find(u => u.UserId == dataObject.UserId);
               if (user != null) {
                  userName = user.UserFullName;
               }
            }
            let kpiName = GetKpiNameForMqfNumber(dataObject);
            let newLine = "";
            if (includeFormattingOptions == true) {
               userName = "<span class=\"virtual-mentor-format-holder format-item user-name\">" + userName + "</span>";
               kpiName = "<span class=\"virtual-mentor-format-holder format-item kpi-name\">" + kpiName + "</span>";
               newLine = "<br />";
            }

            returnString = returnString.replaceAll("{$daysSinceTouch$}", lastDays);
            returnString = returnString.replaceAll("{$usersname$}", userName);
            returnString = returnString.replaceAll("{$username$}", userName);
            returnString = returnString.replaceAll("{$kpiName$}", kpiName);
            returnString = returnString.replaceAll("{$newline$}", newLine);

            return returnString;
         }
         function IsTouchRequired(dataObject) {
            let returnValue = false;
            if (dataObject.LastTouchedDate == null) {
               returnValue = true;
            }
            else {
               let daysSinceLastTouched = GetDaysFromToday(dataObject.LastTouchedDate);
               returnValue = (daysSinceLastTouched >= 10);
            }
            return returnValue;
         }
         function IsCoachingOptionAvailable(dataObject) {
            let returnValue = false;
            let suggestedIndividualAction = dataObject.SuggestedIndividualAction;
            let suggestedGroupAction = dataObject.SuggestedGroupAction;
            if (suggestedIndividualAction == "coach" || suggestedGroupAction == "coach") {
               returnValue = true;
            }
            return returnValue;
         }
         function IsRecognizeOptionAvailable(dataObject) {
            let returnValue = false;
            let suggestedIndividualAction = dataObject.SuggestedIndividualAction;
            let suggestedGroupAction = dataObject.SuggestedGroupAction;
            if (suggestedIndividualAction == "recognize" || suggestedGroupAction == "recognize") {
               returnValue = true;
            }
            return returnValue;
         }

         function GetKpiNameForMqfNumber(dataObject) {
            let returnValue = "Unknown KPI";
            if (dataObject != null) {
               let mqfNumber = dataObject.MqfNumber;
               let kpiObject = kpiDataList.find(k => k.MqfNumber == mqfNumber && k.Name != "");

               if (kpiObject != null) {
                  returnValue = kpiObject.Name;
               }
               else if (mqfNumber == 0 && kpObject == null) {
                  returnValue = "Balanced Score";
               }
            }

            return returnValue;
         }
         function RenderCurrentUserScore(dataObject, renderToObject, includeBalancedScore) {
            if (includeBalancedScore == null) {
               includeBalancedScore = false;
            }
            let mqfNumber = dataObject.MqfNumber;

            let kpiScoringHolder = $("<div />");
            let kpiData = GetCurrentUserKpiScoreObject(dataObject.MqfNumber, dataObject.SubTypeId, dataObject.UserId);
            let kpiName = GetKpiNameForMqfNumber(dataObject);
            let kpiScoreValue = 0;
            let kpiMaxScoreValue = 0;
            if (maxScoreConfigParam != null) {
               kpiMaxScoreValue = parseFloat(maxScoreConfigParam.ParamValue);
            }

            let kpiScorePctValue = 0;

            if (kpiData != null && kpiData.UserId != null && kpiData.Name != null) {
               kpiScoreValue = kpiData.CurrentScoreValue;
               kpiMaxScoreValue = kpiData.MaxScoreVlaue;
               kpiScorePctValue = kpiData.ScorePercentageOfMax;
            }
            //TODO: better handle stuff here.
            let kpiDataHolder = $("<div class=\"virtual-mentor-user-kpi-scoring-data-holder\" />");
            let kpiNameHolder = $("<div class=\"virtual-mentor-item-label kpi-name\" />");
            let kpiUserScoreHolder = $("<div class=\"virtual-mentor-item-data-holder user-score\" />");
            let kpiMaxScoreHolder = $("<div class=\"virtual-mentor-item-data-holder max-score\" />");
            let kpiPercentageScoreHolder = $("<div class=\"virtual-mentor-item-data-holder user-pct-score\" />");

            kpiNameHolder.append(kpiName + ":");
            kpiUserScoreHolder.append(kpiScoreValue + "/");
            kpiMaxScoreHolder.append(kpiMaxScoreValue);
            kpiPercentageScoreHolder.append(" [" + kpiScorePctValue.toLocaleString('en-US', { style: 'percent', maximumSignificantDigits: 2 }) + "]");


            kpiDataHolder.append(kpiNameHolder);
            kpiDataHolder.append(kpiUserScoreHolder);
            kpiDataHolder.append(kpiMaxScoreHolder);

            kpiDataHolder.append(kpiPercentageScoreHolder);

            kpiScoringHolder.append(kpiDataHolder);

            if (includeBalancedScore == true && mqfNumber != 0) {
               let userBalancedScore = currentUserScoreList.find(i => i.MqfNumber == 0 && i.UserId == dataObject.UserId);
               let balancedScoreValue = 0;

               if (userBalancedScore != null) {
                  balancedScoreValue = userBalancedScore.ScoreValue;
               }
               let balancedScoreHolder = $("<div class=\"virtual-mentor-user-kpi-scoring-data-holder\" />");
               let balScoreNameHolder = $("<div class=\"virtual-mentor-item-label bal-score-name\" />");
               let userBalScoreHolder = $("<div class=\"virtual-mentor-item-data-holder bal-score-user\" />");

               balScoreNameHolder.append("Balanced Score:");
               userBalScoreHolder.append(balancedScoreValue);

               balancedScoreHolder.append(balScoreNameHolder);
               balancedScoreHolder.append(userBalScoreHolder);

               kpiScoringHolder.append(balancedScoreHolder);
            }

            $(renderToObject).empty();
            $(renderToObject).append(kpiScoringHolder);

         }
         function SortMentorList(listToSort) {
            let sortedList = listToSort;

            if (userWeightedRank.length > 0 && userWeightedRank.filter(w => w.weightvalue > 0).length > 0) {

               for (let uIndex = 0; uIndex < sortedList.length; uIndex++) {
                  let userItem = sortedList[uIndex];
                  let userTotalRank = 0;
                  for (let wIndex = 0; wIndex < userWeightedRank.length; wIndex++) {
                     let weightedItem = userWeightedRank[wIndex];
                     let weightValue = parseFloat(weightedItem.weightvalue / 100);
                     let userOverallRanking = 0;
                     switch (weightedItem.calcarea) {
                        case "balscore":
                           userOverallRanking = (possibleUsers.length - userItem.BalancedScoreRank);
                           break;
                        case "lasttouch":
                           userOverallRanking = (possibleUsers.length - userItem.LastTouchedRank);
                           break;
                        case "atrisk":
                           userOverallRanking = (possibleUsers.length - userItem.AttritionRiskRank);
                           break;
                     }
                     userTotalRank += parseFloat((userOverallRanking * weightValue));
                  }
                  sortedList[uIndex].WeightedRanking = userTotalRank;
               }
               sortedList = sortedList.sort((a, b) => a.WeightedRanking > b.WeightedRanking ? -1 : 1);

            }
            else {
               sortedList = sortedList.sort((a, b) => a.LastTouchedDate < b.LastTouchedDate ? -1 : (a, b) => a.AttritionRiskRank > b.AttritionRiskRank ? 1 : (a, b) => a.BalancedScoreRank > b.BalancedScoreRank ? 1 : -1);
            }
            return sortedList;
         }
         function LoadVirtualMentorAddTaskForm(idToLoad, callback) {
            let userInput = $("#mentorUserItem_" + idToLoad, element);
            let userId = userInput.val();
            let userName = userId;
            let userObject = possibleUsers.find(u => u.UserId == userId);
            if (userObject != null) {
               userName = userObject.UserFullName;
            }
            let baseTaskMessage = "Perform task with " + userName + ".";
            let baseTaskDate = new Date().toLocaleDateString();
            $("#taskForAgent", element).val(userId);
            $("#suggestionId", element).val(idToLoad);
            $("#taskDate", element).val(baseTaskDate);
            $("#taskDesc", element).val(baseTaskMessage);

            if (callback != null) {
               callback();
            }
         }
         function LoadVirtualMentorIgnoreForm(idToLoad, callback) {
            let userInput = $("#mentorUserItem_" + idToLoad, element);
            let userId = userInput.val();
            let userName = userId;
            let userObject = possibleUsers.find(u => u.UserId == userId);
            if (userObject != null) {
               userName = userObject.UserFullName;
            }

            //TODO: Determine default number of days for ignoring information.
            let ignoreUntilDate = new Date().toLocaleDateString();
            ignoreUntilDate = new Date(AddDaysToDate(ignoreUntilDate, ignoreDaysNumber)).toLocaleDateString();

            $("#ignoreUserId", element).val(userId);
            $("#ignoreUserIdLabel", element).empty();
            $("#ignoreUserIdLabel", element).text(userName);
            $("#ignoreUntilDate", element).val(ignoreUntilDate);

            if (callback != null) {
               callback();
            }
         }
         function ConfirmVirtualMentorIgnoreForm(callback) {
            let userToIgnoreName = $("#ignoreUserId", element).val();
            if (userToIgnoreName != null && userToIgnoreName != "") {
               let user = possibleUsers.find(u => u.UserId == userToIgnoreName);
               if (user != null) {
                  userToIgnoreName = user.UserFullName;
               }
            }
            let userIgnoreDate = $("#ignoreUntilDate", element).val();
            if (userIgnoreDate != null && userIgnoreDate != "") {
               userIgnoreDate = new Date(userIgnoreDate).toLocaleDateString();
            }

            let ignoreMessage = "You are about to add \n{username}\n to the ignore list until \n{ignoreDate}.\n\nPress OK to add or CANCEL to not perform action.";
            ignoreMessage = ignoreMessage.replace("{username}", userToIgnoreName);
            ignoreMessage = ignoreMessage.replace("{ignoreDate}", userIgnoreDate);
            if (confirm(ignoreMessage)) {
               if (callback != null) {
                  callback();
               }
            }
         }
         function SaveVirtualMentorAddTaskForm(callback) {
            let taskObject = CollectTaskDataFromForm();
            let oppositeUserTask = CollectTaskDataFromFormForOtherUser();
            SaveUserTask(taskObject, function () {
               SaveUserTask(oppositeUserTask, function () {
                  let id = parseInt($("#suggestionId", element).val());
                  MarkSuggestionAction(id, "task", callback);
               });
            });
         }
         function SaveUserTask(taskObjectToSave, callback) {
            if (taskObjectToSave != null) {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "selfserve",
                     cmd: "saveUserTask",
                     usertask: JSON.stringify(taskObjectToSave)
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function () {
                     if (callback != null) {
                        callback();
                     }
                     return;
                  }
               });
            }
         }
         function CollectTaskDataFromForm() {
            let taskObject = new Object();
            let taskDueDate = $("#taskDate", element).val();
            let taskDesc = $("#taskDesc", element).val();
            let taskForUserId = $("#taskForAgent", element).val();
            let userName = taskForUserId;
            let user = possibleUsers.find(u => u.UserId == taskForUserId);
            if (user != null) {
               userName = user.UserFullName;
            }

            taskObject.UserTaskId = -1;
            taskObject.UserId = legacyContainer.scope.TP1Username;
            taskObject.TaskDueDate = new Date(taskDueDate).toLocaleDateString();
            taskObject.TaskName = "Virtual Mentor Task: " + userName;
            taskObject.TaskDesc = taskDesc;
            taskObject.IsComplete = false;
            taskObject.SendReminder = true;
            taskObject.StatusCode = "A";
            taskObject.EntDt = new Date().toLocaleDateString();
            taskObject.EntBy = legacyContainer.scope.TP1Username;

            return taskObject;

         }
         function CollectTaskDataFromFormForOtherUser() {
            let taskObject = new Object();
            let taskDueDate = $("#taskDate", element).val();
            let taskDesc = $("#taskDesc", element).val();
            let userName = legacyContainer.scope.TP1Username;
            let user = possibleUsers.find(u => u.UserId == legacyContainer.scope.TP1Username);
            if (user != null) {
               userName = user.UserFullName;
            }
            taskObject.UserTaskId = -1;
            taskObject.UserId = $("#taskForAgent", element).val();
            taskObject.TaskDueDate = new Date(taskDueDate).toLocaleDateString();
            taskObject.TaskName = "Mentoring with " + userName;
            taskObject.TaskDesc = taskDesc;
            taskObject.IsComplete = false;
            taskObject.SendReminder = true;
            taskObject.StatusCode = "A";
            taskObject.EntDt = new Date().toLocaleDateString();
            taskObject.EntBy = legacyContainer.scope.TP1Username;

            return taskObject;
         }
         function SaveVirtualMentorIgnoreForm(callback) {
            let userToAdd = $("#ignoreUserId", element).val();
            let ignoreUntilDate = new Date($("#ignoreUntilDate", element).val()).toLocaleDateString();

            let ignoreObject = new Object();
            ignoreObject.UserId = legacyContainer.scope.TP1Username;
            ignoreObject.IgnoreUserId = userToAdd;
            ignoreObject.IgnoreUntilDate = ignoreUntilDate;

            a$.ajax({
               type: "POST",
               service: "C#",
               async: true,
               data: {
                  lib: "selfserve",
                  cmd: "handleUserToIgnoreList",
                  ignoreobject: JSON.stringify(ignoreObject)
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function () {
                  currentUserIgnoreList.length = 0;
                  if (callback != null) {
                     callback();
                  }
               }
            });
         }
         function ClearVirtualMentorAddTaskForm(callback) {
            //TODO: Handle clearing of the fields.
            if (callback != null) {
               callback();
            }
         }
         function ClearVirtualMentorIgnoreForm(callback) {
            $("#ignoreUserId", element).val("");
            $("#ignoreUserIdLabel", element).empty();
            $("#ignoreUntilDate", element).val("");

            if (callback != null) {
               callback();
            }
         }
         function RenderCurrentUserIgnoreList(callback) {
            $("#virtualMentorCurrentIgnoreList", element).empty();
            let currentListDisplay = $("<div />");

            if (currentUserIgnoreList != null && currentUserIgnoreList.length > 0) {
               for (let uIndex = 0; uIndex < currentUserIgnoreList.length; uIndex++) {
                  let dataItem = currentUserIgnoreList[uIndex];
                  let ignoreUserRow = $("<div class=\"current-user-ignore-list-row-holder\" />");
                  let ignoreUserNameHolder = $("<div class=\"virtual-mentor-list-item user-name\" />");
                  let userDisplayName = dataItem.IgnoreUserId;
                  if (dataItem.IgnoreUserIdSource != null) {
                     userDisplayName = dataItem.IgnoreUserIdSource.UserFullName;
                  }
                  ignoreUserNameHolder.append(userDisplayName);

                  let ignoreUserUntilDateHolder = $("<div class=\"virtual-mentor-list-item ignore-until-date\" />");
                  let ignoreUntilDate = dataItem.IgnoreUntilDate;
                  ignoreUntilDate = new Date(ignoreUntilDate).toLocaleDateString();
                  ignoreUserUntilDateHolder.append(ignoreUntilDate);

                  let ignoreUserButtonHolder = $("<div class=\"virtual-mentor-list-item button-holder\" />");
                  let removeUserFromListButton = $("<button class=\"\" id=\"removeIgnoreUser_" + dataItem.IgnoreUserId + "\"><i class=\"fa fa-trash red\"></i></button>");
                  $(removeUserFromListButton).on("click", function () {
                     let id = this.id;
                     let buttonUserId = id.split("_")[1];
                     RemoveUserFromIgnoreList(buttonUserId, function () {
                        LoadCurrentUserIgnoreList(true, function () {
                           RenderCurrentUserIgnoreList();
                           ShowCurrentUserIgnoreList();
                        });
                     });
                  });

                  ignoreUserButtonHolder.append(removeUserFromListButton);

                  ignoreUserRow.append(ignoreUserNameHolder);
                  ignoreUserRow.append(ignoreUserUntilDateHolder);
                  ignoreUserRow.append(ignoreUserButtonHolder);

                  currentListDisplay.append(ignoreUserRow);
               }

            }
            else {
               currentListDisplay.append("No users found on the ignore list.");
            }

            $("#virtualMentorCurrentIgnoreList", element).append(currentListDisplay);
            if (callback != null) {
               callback();
            }
         }
         function ClearCurrentUserIgnoreList(callback) {
            $("#virtualMentorCurrentIgnoreList", element).empty();
            $("#virtualMentorCurrentIgnoreList", element).append("");

            if (callback != null) {
               callback();
            }
         }
         function MarkSuggestionAction(idToMark, actionsTaken, callback) {
            a$.ajax({
               type: "POST",
               service: "C#",
               async: true,
               data: {
                  lib: "selfserve",
                  cmd: "markActionToSuggestion",
                  id: idToMark,
                  actionlist: actionsTaken
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function () {
                  currentUserIgnoreList.length = 0;
                  if (callback != null) {
                     callback();
                  }
               }
            });
         }
         function MarkSuggestionIgnored(id, callback) {
            a$.ajax({
               type: "POST",
               service: "C#",
               async: true,
               data: {
                  lib: "selfserve",
                  cmd: "markActionForIgnore",
                  id: id
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function () {
                  if (callback != null) {
                     callback();
                  }
               }
            });
         }
         function MarkActionTaken(idToMark, actionTaken, callback) {
            let itemObject = userOptionList.find(i => i.VirtualMentorSuggestionId == idToMark);
            if (itemObject != null) {
               let status = "Complete";               
               itemObject.ActionTaken = actionTaken;
               itemObject.DateActionTaken = new Date();
               itemObject.Status = status;
               itemObject.StatusDate = new Date();
               if(itemObject.LastTouchedDate == null)
               {
                  itemObject.LastTouchedDate = new Date();
               }
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "selfserve",
                     cmd: "saveSuggestion",
                     suggestion: JSON.stringify(itemObject)
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function () {
                     if (callback != null) {
                        callback();
                     }
                     else {
                        return;
                     }
                  }
               });
            }
         }
         function ConfirmIgnoreSuggestion(id, callback) {
            let option = userOptionList.find(i => i.VirtualMentorSuggestionId == id);
            let suggestionAgentName = option.UserId;
            if (option.UserIdSource == null) {
               let user = possibleUsers.find(u => u.UserId == option.UserId);
               if (user != null) {
                  suggestionAgentName = user.UserFullName;
               }
            }
            else {
               suggestionAgentName = option.UserIdSource.UserFullName;
            }
            let message = "Are you sure you want to ignore the suggestion for " + suggestionAgentName + "?\nPress OK to confirm or CANCEL to not ignore.";
            if (confirm(message)) {
               if (callback != null) {
                  callback();
               }
            }
         }
         function ConfirmCompleteSuggestion(id, callback) {
            let option = userOptionList.find(i => i.VirtualMentorSuggestionId == id);
            let suggestionAgentName = option.UserId;
            if (option.UserIdSource == null) {
               let user = possibleUsers.find(u => u.UserId == option.UserId);
               if (user != null) {
                  suggestionAgentName = user.UserFullName;
               }
            }
            else {
               suggestionAgentName = option.UserIdSource.UserFullName;
            }
            let message = "Are you sure you want to complete the suggestion for " + suggestionAgentName + "?\nPress OK to confirm or CANCEL to not ignore.";

            if (confirm(message)) {
               if (callback != null) {
                  callback();
               }
            }
         }

         function HideAll() {
            HideVirtualMentorAddTaskForm();
            HideVirtualMentorIgnoreForm();
            HideCurrentUserIgnoreList();
         }
         function HideLoader() {
            $("#virtualMentorLoader", element).hide();
         }
         function ShowLoader() {
            $("#virtualMentorLoader", element).show();
         }
         function HideMentorList() {
            $("#virtualMentorListHolder", element).hide();
         }
         function ShowMentorList() {
            $("#virtualMentorListHolder", element).show();
         }
         function HideAllUserScorePanels() {
            $("[id^='scoresPanel_']", element).each(function () {
               HideUserScoresPanel(this.id);
            });
         }
         function ToggleUserScoresPanel(scorePanelId) {
            if ($("#" + scorePanelId).is(":visible") == true) {
               HideUserScoresPanel(scorePanelId);
            }
            else {
               ShowUserScoresPanel(scorePanelId);
            }
         }
         function HideUserScoresPanel(scorePanelId) {

            $("#" + scorePanelId).hide();
         }
         function ShowUserScoresPanel(scorePanelId) {
            $("#" + scorePanelId).show();
         }
         function HideVirtualMentorAddTaskForm() {
            $("#virtualMentorAddTaskForm", element).hide();
         }
         function ShowVirtualMentorAddTaskForm() {
            $("#virtualMentorAddTaskForm", element).show();
         }
         function HideVirtualMentorIgnoreForm() {
            $("#virtualMentorIgnoreForm", element).hide();
         }
         function ShowVirtualMentorIgnoreForm() {
            $("#virtualMentorIgnoreForm", element).show();
         }
         function HideCurrentUserIgnoreList() {
            $("#virtualMentorCurrentIgnoreListHolder", element).hide();
         }
         function ShowCurrentUserIgnoreList() {
            $("#virtualMentorCurrentIgnoreListHolder", element).show();
         }
         function GetDaysFromToday(dateToCompare) {

            let today = new Date();
            let diff = Date.parse(today) - Date.parse(dateToCompare);
            return Math.floor(diff / 86400000)
         }
         function AddDaysToDate(dateToUse, daysToAdd) {
            let returnDate = null;
            if (daysToAdd == null) {
               daysToAdd = 30;
            }
            else {
               daysToAdd = Number.parseInt(daysToAdd);
            }
            let date = new Date(new Date().valueOf());
            if (dateToUse != null) {
               date = new Date(new Date(dateToUse).valueOf());
            }
            date.setDate(date.getDate() + daysToAdd);
            returnDate = new Date(date);
            return returnDate;
         }
         function WriteUserLoadingMessage(messageToWrite) {
            $("#virtualMentorLoadingMessage", element).empty();
            $("#virtualMentorLoadingMessage", element).append(messageToWrite);
            ShowLoader();
         }

         scope.load = function () {
            WriteUserLoadingMessage("Loading Virtual Mentor...");
            scope.Initialize();
            $("#currentUserIgnoreListButton", element).off("click").on("click", function () {
               RenderCurrentUserIgnoreList(function () {
                  ShowCurrentUserIgnoreList();
               });
            });
            $(".btn-close", element).off("click").on("click", function () {
               ClearVirtualMentorAddTaskForm(function () {
                  HideVirtualMentorAddTaskForm();
               });
               ClearVirtualMentorIgnoreForm(function () {
                  HideVirtualMentorIgnoreForm();
               });
            });
            $(".btn-close-ignore-list", element).off("click").on("click", function () {
               ClearCurrentUserIgnoreList();
               HideCurrentUserIgnoreList();
               ko.postbox.publish("virtualMentorListReload");
            });
            $("#btnSaveAddTaskForm", element).off("click").on("click", function () {
               SaveVirtualMentorAddTaskForm(function () {
                  ClearVirtualMentorAddTaskForm();
                  HideVirtualMentorAddTaskForm();
                  ko.postbox.publish("virtualMentorListReload", true);
               });
            });
            $("#btnSaveIgnoreForm", element).off("click").on("click", function () {
               ConfirmVirtualMentorIgnoreForm(function () {
                  SaveVirtualMentorIgnoreForm(function () {
                     ClearVirtualMentorIgnoreForm();
                     HideVirtualMentorIgnoreForm();
                     LoadCurrentUserIgnoreList(true, function () {
                        ko.postbox.publish("virtualMentorListReload");
                     });
                  });
               });
            });
            $("#clearIgnoreListButton", element).off("click").on("click", function () {
               RemoveUserFromIgnoreList(REMOVE_ALL_USERS_ID, function () {
                  LoadCurrentUserIgnoreList(true, function () {
                     ko.postbox.publish("virtualMentorListReload");
                  });
                  ClearCurrentUserIgnoreList();
                  HideCurrentUserIgnoreList();
               });
            });
            $("#refreshList", element).off("click").on("click", function () {
               GenerateSuggestionListForUser(legacyContainer.scope.TP1Username, function () {
                  WriteUserLoadingMessage("Actions generation complete.  Loading the data...");
                  window.setTimeout(function () {
                     LoadMentorList(true);
                  }, 500);
               });
            });
            LoadMentorList();

         };

         ko.postbox.subscribe("virtualMentorListReload", function (forceReload) {
            HideAll();
            ShowLoader();
            if (forceReload == true) {
               userOptionList.length = 0;
            }
            LoadMentorList(forceReload);
         });

         ko.postbox.subscribe("virtualMentorListLoad", function () {

            HideAll();
            scope.load();
         });
         ko.postbox.subscribe("VirtualMentorLoadWeightedList", function (weightArray) {
            HideAll();
            ShowLoader();
            //TODO: Handle the weight array information here.
            userOptionList.length = 0;
            userWeightedRank = weightArray;
            LoadMentorList(true);
         });
      }
   };
}]);