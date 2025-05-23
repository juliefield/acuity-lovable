angularApp.directive("ngUserGoalsAndTasks", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/USERDASHBOARD1/view/userGoalsAndTasks.htm?' + Date.now(),
      scope: {
         assoc: "@",
         text: "@",
         details: "@",
         cid: "@",
         filters: "@",
         panel: "@",
         hidetopper: "@",
         toppertext: "@",
         itemtype: "@"
      },
      require: '^ngLegacyContainer',
      link: function (scope, element, attrs, legacyContainer) {

         var userId = legacyContainer.scope.TP1Username;
         var gUserTasks = [];
         var gUserGoals = [];
         var gUsers = [];
         var gItemType = (attrs.itemtype || attrs.itemType);
         var gUserKpiScores = [];
         var isLoading = false;

         function Initalize() {
            gUsers.length = 0;
         }

         function GetMyItemsToRender(isAsyncCall, callback)
         {
            if(isLoading == false)
            {
               isLoading = true;
               let itemCommand = "getUserTasks";
               if(gItemType == "goals"|| gItemType == "goal")
               {
                  itemCommand = "getUserGoals";

               }
               if(isAsyncCall == null)
               {
                  isAsyncCall = true;
               }
               a$.ajax({
                  type: "GET",
                  service: "C#",
                  async: isAsyncCall,
                  data: {
                     lib:"userprofile",
                     cmd: itemCommand,
                     userid: userId,
                     includecompleted: true
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function(jsonData){
                     if(jsonData.errormessage != null && jsonData.errormessage == "true")
                     {
                        a$.jsonerror(jsonData);
                        return;
                     }
                     else
                     {
                        isLoading = false;
                        if(gItemType == "goals" || gItemType == "goal")
                        {
                           gUserGoals.length = 0;
                           let goals = $.parseJSON(jsonData.userGoalList);
                           goals = goals.filter(g => g.IsAchieved == false || (g.GoalAchievedOnDate != null && new Date(g.GoalAchievedOnDate).toLocaleDateString() == new Date().toLocaleDateString()));
                           SortGoalTaskList(goals, gItemType);

                           if(goals != null && goals.length > 0)
                           {
                              for(var i = 0; i < goals.length; i++)
                              {
                                 gUserGoals.push(goals[i]);
                              }
                           }
                        }
                        else
                        {
                           gUserTasks.length = 0;
                           let tasks = $.parseJSON(jsonData.userTaskList);
                           tasks = tasks.filter(t => t.IsComplete == false || new Date(t.CompleteDate).toLocaleDateString() == new Date().toLocaleDateString());
                           SortGoalTaskList(tasks, gItemType);

                           if(tasks != null && tasks.length > 0)
                           {
                              for(var i = 0; i < tasks.length; i++)
                              {
                                 gUserTasks.push(tasks[i]);
                              }
                           }
                        }
                        if(callback != null)
                        {
                           callback();
                        }
                        else
                        {
                           return userMessages;
                        }
                     }
                  }
               });

            }
         }
         function SortGoalTaskList(arrayToSort, sortType)
         {
            if(sortType == null)
            {
               sortType = "tasks";
            }
            sortType = sortType.toLowerCase();
            if(sortType == "tasks" || sortType == "task")
            {
               //TODO: Handle the various sort options for each type of data we can use here.
               arrayToSort.sort(function(a,b){
                  if(a.TaskDueDate != null && a.TaskDueDate < b.TaskDueDate)
                  {
                     return 1;
                  }
                  if(a.TaskDueDate != null && a.TaskDueDate > b.TaskDueDate)
                  {
                     return -1;
                  }
                  return 0;
               });
            }
            else if(sortType == "goals" || sortType == "goal")
            {
               arrayToSort.sort(function(a,b){
                  if(a.GoalDueDate != null && a.GoalDueDate < b.GoalDueDate)
                  {
                     return 1;
                  }
                  if(a.GoalDueDate != null && a.GoalDueDate > b.GoalDueDate)
                  {
                     return -1;
                  }
                  return 0;
               });
            }

         }
         function HandleItemStatsAndGauge()
         {
            if(gItemType.toLowerCase() == "task" || gItemType.toLowerCase() == "tasks")
            {
               let tasksCompleted = 0;
               let tasksDue = 0;
               let tasksOverdue = 0;
               let tasksTotal = 0;
               let percentComplete = 0;
               if(gUserTasks != null)
               {
                  tasksTotal = gUserTasks.length || 0;
                  tasksCompleted = gUserTasks.filter(t => t.IsComplete == true).length || 0;
                  tasksDue = gUserTasks.filter(t => t.IsComplete == false).length || 0;
                  tasksOverdue = gUserTasks.filter(t => t.IsComplete == false && new Date(t.TaskDueDate) < new Date()).length || 0;
               }

               $(".tasks-complete", element).text(tasksCompleted);
               $(".tasks-due", element).text(tasksDue);
               $(".tasks-over-due", element).text(tasksOverdue);
               if(tasksTotal != 0)
               {
                  percentComplete = parseInt((tasksCompleted / tasksTotal)* 100);
               }

               $("#taskGauge", element).data("text", percentComplete + "%");
               $("#taskGauge", element).data("percent", percentComplete);
               $("#taskGauge", element).data("label", tasksCompleted + "/" + tasksTotal + " Tasks");
               $("#taskGauge", element).empty();
               $("#taskGauge",element).gaugeMeter();
            }

            if(gItemType.toLowerCase() == "goal" || gItemType.toLowerCase() == "goals")
            {
               let goalsCompleted = 0;
               let goalsDue = 0;
               let goalsOverdue = 0;
               let goalsTotal = 0;
               let percentComplete = 0;

               if(gUserGoals != null)
               {
                  goalsTotal = gUserGoals.length || 0;
                  goalsCompleted = gUserGoals.filter(t => t.IsAchieved == true).length || 0;
                  goalsDue = gUserGoals.filter(t => t.IsAchieved == false).length || 0;
                  goalsOverdue = gUserGoals.filter(t => t.IsAchieved == false && new Date(t.GoalAchieveByDate) < new Date()).length || 0;
               }

               $(".goals-complete", element).text(goalsCompleted);
               $(".goals-due", element).text(goalsDue);
               $(".goals-over-due", element).text(goalsOverdue);
               if(goalsTotal != 0)
               {
                  percentComplete = parseInt((goalsCompleted / goalsTotal)* 100);
               }
               $("#goalGauge", element).data("text", percentComplete + "%");
               $("#goalGauge", element).data("percent", percentComplete);
               $("#goalGauge", element).data("label", goalsCompleted + "/" + goalsTotal + " Goals");
               $("#goalGauge", element).empty();
               $("#goalGauge",element).gaugeMeter();

            }
         }

         function RenderMyItems()
         {
            HideTasksContainer();
            HideGoalsContainer();
            if(gItemType == "goals")
            {
               RenderMyGoals();
               ShowGoalsContainer();
            }
            else if(gItemType == "tasks")
            {
               RenderMyTasks();
               ShowTasksContainer();
            }
         }

         function HideTasksContainer()
         {
            $(".tasks-container", element).hide();
         }
         function ShowTasksContainer()
         {
            $(".tasks-container", element).show();
         }
         function HideGoalsContainer()
         {
            $(".goals-container", element).hide();
         }
         function ShowGoalsContainer()
         {
            $(".goals-container", element).show();
         }
         function RenderMyGoals()
         {
            $("#userGoalList", element).empty();
            if(gUserGoals != null && gUserGoals.length > 0)
            {
               for(let goalsCounter =0; goalsCounter < gUserGoals.length; goalsCounter++)
               {
                  let item = gUserGoals[goalsCounter];
                  let goalDueDate ="";
                  let goalId = item.UserGoalId;
                  let isComplete = item.IsAchieved || false;

                  if(item.GoalAchieveByDate != null)
                  {
                     goalDueDate = new Date(item.GoalAchieveByDate).toLocaleDateString();
                  }
                  else
                  {
                     goalDueDate = "N/A";
                  }

                  let goalItemHolder = $("<li/>");
                  let goalItemDetails = $("<div class=\"goaltask-copy\"/>");


                  let goalItemCheckboxHolder = $("<div class=\"goaltask-checkbox\"/>");
                  let goalItemCheckbox = $("<input type=\"checkbox\" id=\"goalItem_" + goalId + "\"/>");

                  $(goalItemCheckbox).off("change").on("change", function(){
                     let itemId = this.id;
                     let id = itemId.split('_')[1];
                     HandleCheckboxItem(id, "goals", function(){
                        HandleLoads(true);
                     });
                  });
                  let goalItemCheckmarkSpan = $("<span class=\"goaltask-checkmark\" id=\"goalcheckmark_" + goalId + "\" />");

                  goalItemCheckboxHolder.append(goalItemCheckbox);
                  goalItemCheckboxHolder.append(goalItemCheckmarkSpan);

                  let goalItemDescription = $("<div class=\"goaltask-description\"/>");
                  goalItemDescription.append("<h2>" + item.GoalName + "</h2>");
                  let goalAreaName = item.GoalMqfNumber;
                  let currentKpiScore = GetKpiScoringInformation(item.GoalMqfNumber, item.GoalSubTypeId);

                  if(item.GoalMqfNumber == 0)
                  {
                     goalAreaName = "Balanced Score";
                  }
                  else if(item.GoalMqfNumber == 999999)
                  {
                     goalAreaName = "Custom Scoring";
                  }
                  else if(currentKpiScore != null)
                  {
                     goalAreaName = currentKpiScore.KpiName;
                     if(currentKpiScore.SubTypeName != null && currentKpiScore.SubTypeName != "")
                     {
                        goalAreaName += " " + currentKpiScore.SubTypeName;
                     }
                  }

                  let goalMessage = "Change value in area of <i>" + goalAreaName + "</i> from <strong>" + item.StartingValue + "</strong> to <strong>" + item.EndingValue + "</strong> ";
                  let defaultCurrentValue = 0;
                  if(item.CurrentValue == null || item.CurrentValue == "")
                  {
                     //TODO: Determine when to use scored vs standard value
                     if(currentKpiScore != null && currentKpiScore.ScoredValue != null)
                     {
                        defaultCurrentValue = currentKpiScore.ScoredValue;
                     }

                  }
                  let goalCurrentValue = item.CurrentValue || defaultCurrentValue || 0;
                  goalMessage += "Current value is: <strong>" + goalCurrentValue + "</strong>";

                  goalItemDescription.append("<p>" + goalMessage + "</p>");

                  let goalItemSuperHolder = $("<div class=\"goaltask-super\"/>");
                  goalItemSuperHolder.append("<p><strong>DUE:" + goalDueDate + "</strong></p>");

                  let goalItemSuperAvatarHolder = $("<div class=\"goaltask-super_avatar\"/>");

                  let avatarCircle = $("<div class=\"avatar-circle\" />");
                  let assignedBy = item.EntBy;
                  let userAvatar = a$.debugPrefix() + "/jq/avatars/empty_headshot.png";
                  let goalUserProfile = GetUserForItem(assignedBy);
                  if(goalUserProfile != null)
                  {
                     if(goalUserProfile.AvatarImageFile != null && goalUserProfile.AvatarImageFile != "")
                     {
                        userAvatar = a$.debugPrefix() + "/jq/avatars/" + goalUserProfile.AvatarImageFile;
                     }
                     assignedBy = goalUserProfile.FullName;
                  }
                  else
                  {
                     if(isSystemUser(assignedBy));
                     {
                        assignedBy = "System";
                     }
                  }
                  let supervisorAvatarImage = $("<img src=\"" + userAvatar + "\" alt=\"" + assignedBy + "\" />");

                  avatarCircle.append(supervisorAvatarImage);

                  goalItemSuperAvatarHolder.append(avatarCircle);

                  let supervisorInfoName = $("<p class=\"goaltask-super_assign\" />");
                  supervisorInfoName.append("Assigned by<br>");
                  supervisorInfoName.append(assignedBy);

                  goalItemSuperHolder.append(goalItemSuperAvatarHolder);
                  goalItemSuperHolder.append(supervisorInfoName);

                  goalItemHolder.append(goalItemDetails);
                  goalItemHolder.append(goalItemCheckboxHolder);
                  goalItemHolder.append(goalItemDescription);
                  goalItemHolder.append(goalItemSuperHolder);

                  if(isComplete == true)
                  {
                     $(goalItemHolder).addClass("completed");
                     $(goalItemCheckbox).prop("checked", isComplete);
                  }


                  $("#userGoalList", element).append(goalItemHolder);
               }
            }
            else
            {
               $("#userGoalList", element).append("<div class=\"empty-state goals\"><p>Sorry, No Goals Found to Display.</p></div>");
               let createItemsButton = $("<button />");
               createItemsButton.text("Add A Goal »");
               $(createItemsButton).on("click", function(){
                  $("#ManageMyGoals", element).click();
               });
               $(".empty-state", element).append(createItemsButton);
            }
         }

         function RenderMyTasks()
         {
            $("#userTaskList", element).empty();
            if(gUserTasks != null && gUserTasks.length > 0)
            {
               for(let tasksCounter =0; tasksCounter < gUserTasks.length; tasksCounter++)
               {
                  let item = gUserTasks[tasksCounter];
                  let taskDueDate ="";
                  let taskId = item.UserTaskId;
                  let isComplete = item.IsComplete || false;

                  if(item.TaskDueDate != null)
                  {
                     taskDueDate = new Date(item.TaskDueDate).toLocaleDateString();
                  }

                  let taskItemHolder = $("<li/>");
                  let taskItemDetails = $("<div class=\"goaltask-copy\"/>");


                  let taskItemCheckboxHolder = $("<div class=\"goaltask-checkbox\"/>");
                  let taskItemCheckbox = $("<input type=\"checkbox\" id=\"taskItem_" + taskId + "\"/>");

                  $(taskItemCheckbox).off("change").on("change", function(){
                     let itemId = this.id;
                     let id = itemId.split('_')[1];
                     HandleCheckboxItem(id, "tasks", function(){
                        HandleLoads(true);
                     });
                  });
                  let taskItemCheckmarkSpan = $("<span class=\"goaltask-checkmark\" id=\"taskcheckmark_" + taskId + "\" />");

                  taskItemCheckboxHolder.append(taskItemCheckbox);
                  taskItemCheckboxHolder.append(taskItemCheckmarkSpan);

                  let taskItemDescription = $("<div class=\"goaltask-description\"/>");
                  taskItemDescription.append("<h2>" + item.TaskName + "</h2>");
                  taskItemDescription.append("<p>" + item.TaskDesc + "</p>");

                  let taskItemSuperHolder = $("<div class=\"goaltask-super\"/>");
                  taskItemSuperHolder.append("<p><strong>DUE:" + taskDueDate + "</strong></p>");

                  let taskItemSuperAvatarHolder = $("<div class=\"goaltask-super_avatar\"/>");

                  let avatarCircle = $("<div class=\"avatar-circle\" />");
                  let assignedBy = item.EntBy;
                  let userAvatar = a$.debugPrefix() + "/jq/avatars/empty_headshot.png";
                  let taskUserProfile = GetUserForItem(assignedBy);
                  if(taskUserProfile != null)
                  {
                     if(taskUserProfile.AvatarImageFile != null && taskUserProfile.AvatarImageFile != "")
                     {
                        userAvatar = a$.debugPrefix() + "/jq/avatars/" + taskUserProfile.AvatarImageFile;
                     }
                     assignedBy = taskUserProfile.FullName;
                  }
                  else
                  {
                     if(isSystemUser(assignedBy));
                     {
                        assignedBy = "System";
                     }
                  }

                  let supervisorAvatarImage = $("<img src=\"" + userAvatar + "\" alt=\"" + assignedBy + "\" />");

                  avatarCircle.append(supervisorAvatarImage);

                  taskItemSuperAvatarHolder.append(avatarCircle);

                  let supervisorInfoName = $("<p class=\"goaltask-super_assign\" />");
                  supervisorInfoName.append("Assigned by<br>");
                  supervisorInfoName.append(assignedBy);

                  taskItemSuperHolder.append(taskItemSuperAvatarHolder);
                  taskItemSuperHolder.append(supervisorInfoName);

                  taskItemHolder.append(taskItemDetails);
                  taskItemHolder.append(taskItemCheckboxHolder);
                  taskItemHolder.append(taskItemDescription);
                  taskItemHolder.append(taskItemSuperHolder);

                  if(isComplete == true)
                  {
                     $(taskItemHolder).addClass("completed");
                     $(taskItemCheckbox).prop("checked", isComplete);
                  }


                  $("#userTaskList", element).append(taskItemHolder);
               }
            }
            else
            {
               $("#userTaskList", element).append("<div class=\"empty-state tasks\"><p>Sorry, No Tasks Found to Display.</p></div>");
               let createItemsButton = $("<button />");
               createItemsButton.text("Add A Task »");
               $(createItemsButton).on("click", function(){
                  $("#ManageMyTasks", element).click();
               });
               $(".empty-state", element).append(createItemsButton);
            }

         }

         function GetUserForItem(userId)
         {
            let returnUser = null;
            if(isSystemUser(userId))
            {
               return null;
            }
            if(gUsers != null && gUsers.length > 0)
            {
               returnUser = gUsers.find(u => u?.UserId == userId);
            }

            if(returnUser == null)
            {
               a$.ajax({
                  type: "GET",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "userprofile",
                     cmd: "getUserData",
                     userid: userId
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function(jsonData){
                     if(jsonData.errormessage != null && jsonData.errormessage == "true")
                     {
                        a$.jsonerror(jsonData);
                        return;
                     }
                     else
                     {
                        returnUser = jsonData.userinfo;
                        gUsers.push(returnUser);

                     }
                  }
               });
            }

            return returnUser;
         }
         function GetKpiScoringInformation(mqfNumber, subTypeId)
         {
            let returnKpiScore = null;
            if(returnKpiScore != null && returnKpiScore.length > 0)
            {
               returnKpiScore = gUserKpiScores.find(k => k.mqfNumber == mqfNumber);
            }
            if(returnKpiScore == null)
            {
               a$.ajax({
                  type: "GET",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "userprofile",
                     cmd: "getCurrentScoreForKpi",
                     mqfnumber: mqfNumber,
                     subtypeid: subTypeId
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function(jsonData){
                     if(jsonData.errormessage != null && jsonData.errormessage == "true")
                     {
                        a$.jsonerror(jsonData);
                        return;
                     }
                     else
                     {
                        returnKpiScore = jsonData.currentScoringInfo;
                        gUserKpiScores.push(returnKpiScore);

                     }
                  }
               });
            }

            return returnKpiScore;
         }

         function HandleCheckboxItem(id, itemType, callback)
         {
            if(itemType != null)
            {
               itemType = itemType.toLowerCase();
            }
            let command = null;
            let itemStatus = "A";

            if(itemType == "task" || itemType == "tasks")
            {
               let item = gUserTasks.find(i => i.UserTaskId == id);
               command = "completeUserTask";
               if(item != null && item.IsComplete == true)
               {
                  command = "setUserTaskStatus";
                  itemStatus = "A";
               }
            }
            else if(itemType == "goal" || itemType == "goals")
            {

               let item = gUserGoals.find(i => i.UserGoalId == id);
               command = "completeUserGoal";
               if(item != null && item.IsAchieved == true)
               {
                  command = "setUserGoalStatus";
                  itemStatus = "A";
               }
            }
            if(command != null)
            {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                      lib: "userprofile",
                      cmd: command,
                      usertaskid: id,
                      usergoalid: id,
                      taskstatus: itemStatus,
                      goalstatus: itemStatus
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function(data) {
                     if(data.errormessage != null && data.errormessage == "true")
                     {
                        a$.jsonerror(data);
                        return;
                     }
                     else
                     {
                        if (callback != null) {
                           callback(data);
                       }
                     }
                  }
               });
            }
            else
            {
               if(callback != null)
               {
                  callback();
               }
               else
               {
                  return null;
               }
            }
         }
         function HandleLoads(isAsync)
         {
            //LoadEvents();
            return GetMyItemsToRender(isAsync, function(){
               HandleItemStatsAndGauge();
               RenderMyItems();
            });
         }

         function HandleManagementLink(areaToGoTo)
         {
            if(areaToGoTo == null)
            {
               areaToGoTo = "tasks";
            }
            var prefixInfo = a$.gup("prefix");
            //var hrefLocation = a$.debugPrefix() + "/3/ng/User" + areaToGoTo + "/default.aspx";
            var hrefLocation = a$.debugPrefix() + "/3/ng/GoalTaskManager/default.aspx?area=" + areaToGoTo;
            if (prefixInfo != null && prefixInfo != "") {
                hrefLocation += "&prefix=" + prefixInfo;
            }
            return hrefLocation;
         }
         function LoadEvents()
         {
            $("#ManageMyTasks", element).off("click").on("click", function(){
               let link = HandleManagementLink("tasks");
               document.location.href = link;
            });
            $("#ManageMyGoals", element).off("click").on("click", function(){
               let link = HandleManagementLink("goals");
               document.location.href = link;
            });

            $("#refreshTasks", element).off("click").on("click", function(){
               ko.postbox.publish("UserGoalTaskLoad", "tasks");
               //HandleLoads(true);
            });
            $("#refreshGoals", element).off("click").on("click", function(){
               ko.postbox.publish("UserGoalTaskLoad", "goals");
               //HandleLoads(true);
            });

         }
         function isSystemUser(userId)
         {
            let systemUsers = ["readerWriter", "reportsOnly"];

            let systemUserIndex = systemUsers.findIndex(t => t.toLowerCase() == userId.toLowerCase());

            return (systemUserIndex >= 0);
         }
         scope.load = function (callback) {
            console.log("Directive: UserGoalsAndTasks Load()");
            Initalize();
            LoadEvents();
            HandleLoads(false);
            //LoadEvents();
         }

         ko.postbox.subscribe("UserGoalTaskLoad", function(itemType){
            LoadEvents();
            gItemType = itemType;
            HandleLoads(true);
         });

      }
   }
}]);
