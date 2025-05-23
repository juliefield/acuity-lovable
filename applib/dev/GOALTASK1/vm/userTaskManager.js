angularApp.directive("ngUserTaskManager", ['api', '$rootScope', function(api, $rootScope) {

    return {
        templateUrl: a$.debugPrefix() + '/applib/dev/GOALTASK1/view/userTaskManager.htm?' + Date.now(),
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
            userId: "@",
            popupEditor: "@"
        },
        require: '^ngLegacyContainer',
        link: function(scope, element, attrs, legacyContainer) {
            scope.tempReferenceKey = null;
            scope.userId = null;
            if(attrs.displaylimiteddata != null || attrs.displayLimitedData != null)
            {
                scope.displayLimitedData = (attrs.displaylimiteddata == "true" || attrs.displayLimitedData == "true");
            }
            if(attrs.addonlydisplay != null || attrs.addOnlyDisplay != null || attrs.AddOnlyDisplay != null)
            {
                scope.addonlyDisplay = (attrs.addonlydisplay == "true" || attrs.addOnlyDisplay == "true" || attrs.AddOnlyDisplay == "true");
            }
            if(attrs.tempreferencekey != null || attrs.tempReferenceKey != null || attrs.TempReferenceKey != null)
            {
                scope.tempReferenceKey = ( attrs.tempreferencekey || attrs.tempReferenceKey || attrs.TempReferenceKey);
            }
            if(attrs.userid != null || attrs.UserId != null || attrs.Userid != null)
            {
                scope.userId = (attrs.userid || attrs.UserId || attrs.Userid || legacyContainer.scope.filters.CSR || legacyContainer.scope.TP1Username);                
            }
            if(attrs.popupeditor != null || attrs.popupEditor != null)
            {
                scope.popupEditor = (attrs.popupEditor == "true" || attrs.popupeditor == "true");
            }
            
            scope.Initialize = function() {    
                if (scope.userId == null || scope.userId == "")
                {
                    scope.userId = a$.gup("examinee");
                }            
                scope.CurrentTaskList = [];                
                scope.AvailbleTaskStatusOptions = [];
                scope.AvailableGoalsOptions = [];

                HideAll();
                SetDatePickers();
                GetAllListOptions();
                LoadListOptions("all");

                if(scope.tempReferenceKey == null)
                {
                    scope.tempReferenceKey = a$.guid();
                }
            };
            
            function HideAll()
            {
                HideEditorForm();
            }
            function SetDatePickers()
            {
                $(".user-task-manager-editor-due-date", element).datepicker();
                $(".user-task-manager-editor-date-complete", element).datepicker();
            }
            function GetAllListOptions()
            {
                LoadStatusOptions();
                LoadGoalOptions();                
            }
            function LoadStatusOptions()
            {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "userprofile",
                        cmd: "getGoalTaskStatusOptions"
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function(data){
                        scope.AvailbleTaskStatusOptions.length = 0;
                        var taskStatusOptions =  $.parseJSON(data.goalTaskStatusList);
                        if(taskStatusOptions != null)
                        {
                            for(var i = 0 ; i < taskStatusOptions.length; i++)
                            {
                                scope.AvailbleTaskStatusOptions.push(taskStatusOptions[i]);
                            }                    
                        }
                    }
                });
            }
            function LoadGoalOptions()
            {
            
                let userId = (scope.userId || legacyContainer.scope.TP1Username);

                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "userprofile",
                        cmd: "getUserGoals",
                        userid: userId,
                        includecompleted: "false"
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function(data){
                        scope.AvailableGoalsOptions.length = 0;                        
                        var goalOptions =  $.parseJSON(data.userGoalList);
                        if(goalOptions != null)
                        {
                            for(var i = 0 ; i < goalOptions.length; i++)
                            {
                                scope.AvailableGoalsOptions.push(goalOptions[i]);
                            }
                        }
                        LoadListOptions("goals");
                    }
                });
            }
            function LoadListOptions(listToLoad)
            {
                var loadAll = (listToLoad === "all");

                listToLoad = listToLoad.toLowerCase();
                if (listToLoad == "taskstatus" || loadAll) {
                    if ($(".user-task-manager-editor-task-status", element) != null) {
                        $(".user-task-manager-editor-task-status", element).empty();
                        $(".user-task-manager-editor-task-status", element).append($('<option />', { value: "", text: "Select a Status" }));
                        for (var i = 0; i < scope.AvailbleTaskStatusOptions.length; i++) {
                            let item = scope.AvailbleTaskStatusOptions[i];
                            $(".user-task-manager-editor-task-status", element).append($('<option />', { value: item.StatusCode , text: item.Name }));
                        }
                    }
                }
                if (listToLoad == "goals" || loadAll) {
                    if ($(".user-task-manager-editor-goal-assigned", element) != null) {
                        $(".user-task-manager-editor-goal-assigned", element).empty();
                        $(".user-task-manager-editor-goal-assigned", element).append($('<option />', { value: "", text: "Select a Goal" }));
                        for (var i = 0; i < scope.AvailableGoalsOptions.length; i++) {
                            let item = scope.AvailableGoalsOptions[i];                            
                            if(item.StatusCode.toUpperCase() === "A")
                            {
                                $(".user-task-manager-editor-goal-assigned", element).append($('<option />', { value: item.UserGoalId , text: item.Name }));
                        }
                            
                        }
                    }
                }
            }
            function HideEditorForm()
            {
                $(".user-task-manager-editor-holder", element).hide();
            }
            function ShowEditorForm()
            {
                let editorText = "Edit Task";                
                if(parseInt($("#taskId").val()) <= 0)
                {
                    editorText = "Add Task";
                    $(".user-task-manager-editor-date-complete-row", element).hide();
                }
                else
                {
                    $(".user-task-manager-editor-date-complete-row", element).show();
                }
                
                //TODO: Determine how to handle the popup editor.

                $(".user-task-manager-editor-header-label", element).text(editorText);
                $(".user-task-manager-editor-holder", element).show();

                return false;
                
            }
            function ClearEditorForm(callback){
                $("#taskId").val(0);
                $(".user-task-manager-editor-task-name", element).val("");
                $(".user-task-manager-editor-task-desc", element).val("");
                $(".user-task-manager-editor-due-date", element).val("");
                $(".user-task-manager-editor-goal-assigned", element).val("");
                $(".user-task-manager-editor-date-complete", element).val("");
                $(".user-task-manager-editor-task-status", element).val("A");
                $("#createdBy").val(legacyContainer.scope.TP1Username);
                $("#createdOn").val(new Date().toLocaleDateString("en-US"));                
                $(".user-task-manager-editor-header-label", element).text("Add Task");
                $(".user-task-manager-editor-send-reminder", element).prop("checked", false);

                
                $(".errorField", element).each(function(){
                    $(this).removeClass("errorField");
                });
                $(".error-information-holder", element).empty();

                if(callback != null)
                {
                    callback();
                }
            }
            function SaveEditorForm(callback)
            {   
                var taskToSave = CollectFormDataForTask();                
                SaveTask(taskToSave, function(id){
                    HideEditorForm();
                    HandleTaskLoad();
                });

            }
            function LoadEditorForm(taskIdToLoad, callback)
            {
                let taskItem = scope.CurrentTaskList.find(x => x.UserTaskId == taskIdToLoad);
                if(taskItem  != null)
                {
                    $("#taskId").val(taskIdToLoad);                    


                    $(".user-task-manager-editor-task-name", element).val(taskItem.TaskName);
                    $(".user-task-manager-editor-task-desc", element).val(taskItem.TaskDesc);
                    $(".user-task-manager-editor-due-date", element).val(new Date(taskItem.TaskDueDate).toLocaleDateString("en-US"));
                    $(".user-task-manager-editor-goal-assigned", element).val(taskItem.UserGoalReferenceId);
                    $(".user-task-manager-editor-task-status", element).val(taskItem.StatusCode);
                    $(".user-task-manager-editor-date-complete", element).val(taskItem.CompleteDate);
                    $(".user-task-manager-editor-send-reminder", element).prop("checked", taskItem.SendReminder);

                    $("#createdBy").val(legacyContainer.scope.TP1Username);
                    $("#createdOn").val(new Date().toLocaleDateString("en-US"));    
                }
                if(callback != null)
                {
                    callback();
                }
            }
            function ConfirmDeleteTask(taskIdToDelete, callback)
            {
                let task = scope.CurrentTaskList.find(g => g.UserTaskId == taskIdToDelete);
                if(task != null)
                {
                    if(confirm("You are about to delete the following task\n" + task.TaskName + "\n\nPress OK to delete or Cancel to keep the task."))
                    {
                        callback();
                    }
                }
                
            }
            function DeleteTask(taskIdToDelete, callback)
            {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "userprofile",
                        cmd: "setUserTaskStatus",
                        usertaskid: taskIdToDelete,
                        taskstatus: "D"
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function(data) {                        
                        if (callback != null) {
                            callback(data);
                        }
                    }
                });
            }
            function ConfirmCompleteTask(taskIdToComplete, callback)
            {
                let task = scope.CurrentTaskList.find(g => g.UserTaskId == taskIdToComplete);
                if(task != null)
                {
                    if(confirm("You are about to complete the following task\n" + task.TaskName + "\n\nThis will set the complete date to today.\nPress OK to complete or Cancel to keep the task."))
                    {
                        callback();
                    }
                }
                
            }
            function ConfirmArchiveTask(taskIdToArchive, callback)
            {
                let task = scope.CurrentTaskList.find(g => g.UserTaskId == taskIdToArchive);
                if(task != null)
                {
                    if(confirm("You are about to archive the following task\n" + task.TaskName + "\n\nPress OK to continue or Cancel to cancel archiving."))
                    {
                        callback();
                    }
                }                
            }
            function CompleteTask(taskIdToComplete, callback)
            {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        //lib: "userprofile",
                        lib: "selfserve",
                        cmd: "completeUserTask",
                        usertaskid: taskIdToComplete
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function(data) {                        
                        if (callback != null) {
                            callback(data);
                        }
                    }
                });
            }
            function SetTaskStatus(taskIdToSet, status, callback)
            {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "userprofile",
                        cmd: "setUserTaskStatus",
                        usertaskid: taskIdToSet,
                        taskstatus: status

                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function(data) {                        
                        if (callback != null) {
                            callback(data);
                        }
                    }
                });
            }
            function HandleTaskLoad()
            {
                
                scope.LoadUserTasks(function(){
                    DisplayUserTasks(function(){
                        scope.LoadUserTaskStats();
                    });
                });
            }
            scope.LoadUserTasks = function(callback)
            {   
                let includeCompletedTasks = $(".user-task-mansger-options-include-completed", element).is(":checked");
                let includeArchivedTasks = $(".user-task-mansger-options-include-archived", element).is(":checked");
                let onlyNewTasksDisplayed = scope.addonlyDisplay;
                let userId =(scope.userId || legacyContainer.scope.TP1Username);
                scope.CurrentTaskList.length = 0;
                
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        //lib: "userprofile",
                        lib: "selfserve",
                        cmd: "getUserTasks",
                        userid: userId,
                        includecompleted: includeCompletedTasks,
                        includearchived: includeArchivedTasks,
                        addonlyitems: onlyNewTasksDisplayed,
                        tempRefKey: scope.tempReferenceKey
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function(data) {
                        var tasks = $.parseJSON(data.userTaskList);
                        if(tasks != null && tasks.length > 0)
                        {
                            for(var i = 0; i < tasks.length; i++)
                            {
                                scope.CurrentTaskList.push(tasks[i]);
                            }
                        }
                        if (callback != null) {
                            callback(data);
                        }
                    }
                });
            }
            scope.LoadUserTaskStats = function(callback)
            {
                // a$.ajax({
                //     type: "POST",
                //     service: "C#",
                //     async: false,
                //     data: {
                //         lib: "userprofile",
                //         cmd: "getTaskStatsForUser",
                //         userid: legacyContainer.scope.TP1Username
                //     },
                //     dataType: "json",
                //     cache: false,
                //     error: a$.ajaxerror,
                //     success: function(data) {                        
                //         LoadStatsData(data);
                //         if (callback != null) {
                //             callback(data);
                //         }
                //     }
                // });  
            }
            function LoadStatsData(data)
            {
                // let totalTasks = parseInt(data.totalTasks);
                // let totalCompletedTasks = parseInt(data.totalTasksCompleted);

                // $(".user-task-manager-user-stats-total-tasks", element).text(totalTasks);
                // $(".user-task-manager-user-stats-completed-tasks", element).text(totalCompletedTasks);

            }
            function MarkAllTasks()
            {
                var allTasksHolder = ".user-task-manager-user-tasks-holder";
                var checkAllCheckboxName = "#markAllTasks";

                var checkAllCheckbox = $(checkAllCheckboxName, element);
                var allTaskCheckboxes = $("input[type='checkbox']", $(allTasksHolder, element));
                var checkValue = (checkAllCheckbox).is(":checked");

                $(allTaskCheckboxes).each(function() {
                    $(this).prop("checked", checkValue);
                });

            }
            function DeleteSelectedTasks(callback)
            {
                let tasksToHandle = CollectSelectedTasks();
                if(tasksToHandle.length > 0)
                {
                    for(var i = 0; i < tasksToHandle.length; i++)
                    {
                        DeleteTask(tasksToHandle[i]);                        
                    }
                    if(callback != null)
                    {
                        callback();
                    }
                }                                
            }
            function MarkSelectedTasksComplete()
            {
                let tasksToHandle = CollectSelectedTasks();
                if(tasksToHandle.length > 0)
                {
                    for(var i = 0; i < tasksToHandle.length; i++)
                    {
                        CompleteTask(tasksToHandle[i]);                        
                    }
                    HandleTaskLoad();
                }    
                
            }
            function CollectSelectedTasks()
            {
                var selectedTasks = [];
                var allTaskCheckboxes = $("input[type='checkbox']", $(".user-task-manager-user-tasks-holder", element));

                $(allTaskCheckboxes).each(
                    function(){
                        if($(this).is(":checked"))
                        {
                            var checkboxId = this.id;
                            let taskId = checkboxId.split('_')[1];

                            selectedTasks.push(taskId);
                        }
                    }
                );

                return selectedTasks;
            }
            function DisplayUserTasks(callback)
            {
                let limitedDataColumnsDisplayed = scope.displayLimitedData;
                let addonlyOption = scope.addonlyDisplay;
                
                 $(".user-task-manager-user-tasks-list", element).empty();
                 let taskListHolder = $("<div class=\"user-task-manager-user-tasks-holder\" />");

                let taskDataItemHeader = $("<div class=\"user-task-manager-user-task-row-item-header data-item-header\"/>");
                let taskCheckboxHeader = $("<div class=\"user-task-manager-task-selector-checkbox-holder center data-item-header\"/>");
                let taskNameItemHeader = $("<div class=\"user-task-data-item task-name data-item-header\" />");
                let taskDueDateHeader = $("<div class=\"user-task-data-item task-end-value data-item-header\" />");
                let taskGoalAssignedHeader = $("<div class=\"uer-task-data-item goal-assigned data-item-header\" />");
                let taskButtonHeader = $("<div class=\"user-task-data-item task-button-holder data-item-header\" />");
                let taskSelectAllCheckbox = $("<input type=\"checkbox\" id=\"markAllTasks\" class=\"user-task-manager-select-all-checkbox\" />");

                $(taskSelectAllCheckbox).off("click").on("click", function(){
                    MarkAllTasks();
                });
                
                //taskCheckboxHeader.append("&nbsp;");
                taskCheckboxHeader.append(taskSelectAllCheckbox);
                taskNameItemHeader.append("Task");
                taskDueDateHeader.append("Due Date");
                taskGoalAssignedHeader.append("Goal");
                taskButtonHeader.append("Actions");
                

                taskDataItemHeader.append(taskCheckboxHeader);
                taskDataItemHeader.append(taskDueDateHeader);
                taskDataItemHeader.append(taskNameItemHeader);                
                taskDataItemHeader.append(taskGoalAssignedHeader);
                taskDataItemHeader.append(taskButtonHeader);
                
                // let taskSelectAllHolder = $("<div class=\"user-task-manager-user-task-row-item-sub-header\"/>");
                // let taskSelectAllCheckboxHolder = $("<div class=\"user-task-manager-task-selector-checkbox-holder user-task-data-item center\"/>");
                // let taskSelectAllCheckbox = $("<input type=\"checkbox\" id=\"markAllTasks\" class=\"user-task-manager-select-all-checkbox\" />");
                // let taskSelectAllLabel = $("<div class=\"user-task-data-item task-name\" />");

                
                // taskSelectAllLabel.append("Select All");

                // taskSelectAllCheckboxHolder.append(taskSelectAllCheckbox);
                // taskSelectAllHolder.append(taskSelectAllCheckboxHolder);
                // taskSelectAllHolder.append(taskSelectAllLabel);

                if(scope.CurrentTaskList != null && scope.CurrentTaskList.length > 0)
                {
                    for(var i = 0; i < scope.CurrentTaskList.length; i++)
                    {
                        let dataItem = scope.CurrentTaskList[i];
                        let dataItemCompleted = false;
                        if(dataItem != null)
                        {
                            let taskCheckboxSpacerItem = $("<div class=\"user-task-manager-task-selector-checkbox-spacer user-task-data-item center\"/>");
                            taskCheckboxSpacerItem.append("");
                
                            dataItemCompleted = (dataItem.IsComplete);
                            let taskDataRowItem = $("<div class=\"user-task-manager-user-task-row-item-holder\" />");
                            let taskDataItem = $("<div class=\"user-task-manager-user-task-row-item\" />");
                            let taskCheckboxItemHolder = $("<div class=\"user-task-manager-task-selector-checkbox-holder user-task-data-item center\"/>");
                            let taskCheckboxItem = $("<input type=\"checkbox\" id=\"taskItem_" + dataItem.UserTaskId + "\" class=\"user-task-manager-task-selector-checkbox\" >");
                            let taskNameItem = $("<div class=\"user-task-data-item task-name\" />");
                            let taskDueDate = $("<div class=\"user-task-data-item task-due-date \" />");
                            let taskGoalAssignedItem = $("<div class=\"uer-task-data-item goal-assigned\" />");

                            let taskButtonHolder = $("<div class=\"user-task-data-item task-button-holder\" />");
                            let taskDescItemHolder = $("<div class=\"user-task-manager-task-desc-holder\" />");
                            let taskDescItem = $("<div class=\"user-task-manager-task-desc\" />");
                            
                            let taskEditButtonItem = $("<button id=\"taskEdit_" + dataItem.UserTaskId + "\" ><i class=\"fad fa-edit\"></i></button>");
                            taskEditButtonItem.prop("title", "Edit " + dataItem.TaskName);
                            $(taskEditButtonItem).off("click").on("click", function(){
                                let buttonId = this.id;
                                let taskIdToEdit = buttonId.split('_')[1];
                                LoadEditorForm(taskIdToEdit, function(){
                                    ShowEditorForm();
                                });
                            });
                            
                            let taskRemoveButtonItem = $("<span class=\"divider\"></span><button class=\"button--red\" id=\"taskDelete_" + dataItem.UserTaskId + "\" ><i class=\"fad fa-trash\"></i></button>");
                            taskRemoveButtonItem.prop("title", "Delete " + dataItem.TaskName);
                            $(taskRemoveButtonItem).off("click").on("click", function(){
                                let buttonId = this.id;
                                let taskIdToDelete = buttonId.split('_')[1];
                                ConfirmDeleteTask(taskIdToDelete, function(){
                                    DeleteTask(taskIdToDelete, function(){                                        
                                        HandleTaskLoad();
                                    });
                                });                                
                            });
                            
                            let taskMarkCompleteButton = $("<button class=\"button--green\" id=\"taskComplete_" + dataItem.UserTaskId + "\" ><i class=\"fas fa-check-circle\"></i></button>");
                            taskMarkCompleteButton.prop("title", "Complete " + dataItem.TaskName);
                            $(taskMarkCompleteButton).off("click").on("click", function(){
                                let buttonId = this.id;
                                let taskIdToComplete = buttonId.split('_')[1];
                                ConfirmCompleteTask(taskIdToComplete, function(){
                                    CompleteTask(taskIdToComplete, function(){
                                        HandleTaskLoad();
                                    });
                                });                                
                            });

                            let taskArchiveItemButton = $("<button id=\"taskArchive_" + dataItem.UserTaskId + "\" ><i class=\"fad fa-folder-download\"></i></button>");
                            taskArchiveItemButton.prop("title", "Archive " + dataItem.TaskName);
                            $(taskArchiveItemButton).off("click").on("click", function(){
                                let buttonId = this.id;
                                let taskIdToArchive = buttonId.split('_')[1];
                                ConfirmArchiveTask(taskIdToArchive, function(){
                                    SetTaskStatus(taskIdToArchive, "R", function(){
                                        HandleTaskLoad();
                                    });
                                });
                            });

                            if(dataItem.StatusCode == "R")
                            {
                                taskEditButtonItem = null;
                                taskRemoveButtonItem = null;
                                taskMarkCompleteButton = null;
                                taskArchiveItemButton = null;
                                taskCheckboxItem = null;
                            }
                            else if (dataItemCompleted)
                            {
                                taskCheckboxItem = null;   
                                taskMarkCompleteButton = null;
                                taskEditButtonItem = null;
                            }                            
                            else
                            {
                                taskArchiveItemButton = null;
                            }

                            if(addonlyOption == true)
                            {
                                taskMarkCompleteButton = null;
                            }

                            taskCheckboxItemHolder.append(taskCheckboxItem);
                            
                            taskNameItem.append(dataItem.TaskName);                            
                            taskDueDate.append(new Date(dataItem.TaskDueDate).toLocaleDateString("en-US"));
                            let goalName = "&nbsp;";
                            if(dataItem.UserGoalReferenceId != null && dataItem.UserGoalReferenceId != 0)
                            {
                                let goal = scope.AvailableGoalsOptions.find(g => g.UserGoalId == dataItem.UserGoalReferenceId);
                                if (goal != null)
                                {
                                    goalName = goal.Name;
                                }
                                else
                                {
                                    goalName = "&nbsp;";
                                }
                            }
                            else
                            {
                                goalName = "&nbsp;";
                            }                            
                            taskGoalAssignedItem.append(goalName);

                            taskButtonHolder.append(taskMarkCompleteButton);
                            taskButtonHolder.append(taskEditButtonItem);
                            taskButtonHolder.append(taskArchiveItemButton);
                            taskButtonHolder.append(taskRemoveButtonItem);
                            
                            taskDescItem.append(dataItem.TaskDesc);

                            taskDescItemHolder.append(taskCheckboxSpacerItem);
                            taskDescItemHolder.append(taskDescItem);

                            taskDataItem.append(taskCheckboxItemHolder);
                            taskDataItem.append(taskDueDate);                            
                            taskDataItem.append(taskNameItem);
                            taskDataItem.append(taskGoalAssignedItem);
                            taskDataItem.append(taskButtonHolder);


                            taskDataRowItem.append(taskDataItem);
                            taskDataRowItem.append("<br>");
                            taskDataRowItem.append(taskDescItemHolder);

                            if(dataItem.IsComplete == true && dataItem.StatusCode != "R")
                            {
                                $(taskDataRowItem).addClass("task-completed");
                            }
                            else if (dataItem.StatusCode == "R")
                            {
                                $(taskDataRowItem).removeClass("task-completed");
                                $(taskDataRowItem).addClass("task-archived");                            
                            }

                            
                            $(taskListHolder).append(taskDataRowItem);
                            if(limitedDataColumnsDisplayed)
                            {
                                $(taskGoalAssignedHeader).hide();
                                $(taskGoalAssignedItem).hide();

                                $(taskEditButtonItem).hide();
                            }
                        }
                    }
                       
                    $(".user-task-manager-button-options-holder", element).show();
                }
                else
                {
                    $(".user-task-manager-button-options-holder", element).hide();
                    
                    let taskDataItem = $("<div class=\"no-data-found\" />");
                    taskDataItem.append("<p>No ACTIVE tasks found for user.</p>");
                    $(taskListHolder).append(taskDataItem);
                }
                $(".user-task-manager-user-tasks-list", element).append(taskDataItemHeader);
                //$(".user-task-manager-user-tasks-list", element).append(taskSelectAllHolder);
                $(".user-task-manager-user-tasks-list", element).append(taskListHolder);

                if(addonlyOption == true)
                {
                    $(taskDataItemHeader).hide();
                    $(".user-task-manager-header", element).hide();
                    $(".user-task-manager-user-stats-holder", element).hide();
                    $(".user-task-manager-button-options-holder", element).hide();
                    $(".user-task-manager-filter-holder", element).hide();
                    $(".user-task-manager-refresh-task-button", element).hide();
                }

                if(callback != null)
                {
                    callback();
                }
            }
            function CollectFormDataForTask()
            {
                let userId = (scope.userId || legacyContainer.scope.TP1Username);
                let returnObject = new Object();
                returnObject.UserTaskId = $("#taskId").val();
                returnObject.UserId = userId;
                returnObject.TaskName = $(".user-task-manager-editor-task-name", element).val();
                returnObject.TaskDesc = $(".user-task-manager-editor-task-desc", element).val();
                returnObject.TaskDueDate = new Date($(".user-task-manager-editor-due-date", element).val()).toLocaleDateString("en-US");
                let goalAssigned = $(".user-task-manager-editor-goal-assigned", element).val();
                
                if(goalAssigned == "" || isNaN(goalAssigned))
                {
                    returnObject.UserGoalReferenceId = null;
                }
                else
                {
                    returnObject.UserGoalReferenceId = parseFloat(goalAssigned);
                }

                returnObject.CompleteDate = $(".user-task-manager-editor-date-complete", element).val();
                returnObject.StatusCode = $(".user-task-manager-editor-task-status", element).val();
                returnObject.SendReminder = $(".user-task-manager-editor-send-reminder", element).is(":checked");
                let enterDate = $("#createdOn", element).val();
                if(enterDate == null || enterDate == "")
                {
                    enterDate = new Date();
                }
                returnObject.EntDt = new Date(enterDate).toLocaleDateString("en-US");
                returnObject.EntBy = $("#createdBy",element).val() || legacyContainer.scope.TP1Username;
                returnObject.TempReferenceKey = scope.tempReferenceKey;
                
                return returnObject;
            }
            function ValidateTaskForm(callback)
            {
                $(".error-information-holder", element).empty();
                var formValid = true;
                var errorMessages = [];
                var taskId = parseInt($("#taskId").val());
                var taskName = $(".user-task-manager-editor-task-name", element).val();                
                let taskDesc = $(".user-task-manger-editor-task-desc", element).val();

                var taskDueDate = $(".user-task-manager-editor-due-date", element).val();

                if (taskName == "") {
                    errorMessages.push({ message: "Task Name Required", fieldclass: ".user-task-manager-editor-task-name", fieldid: "" });                 
                    formValid = false;
                }
                if(taskDueDate == ""){
                    errorMessages.push({ message: "Due Date Required", fieldclass: ".user-task-manager-editor-due-date", fieldid: "" });                 
                    formValid = false;
                }
                else 
                {
                    if(taskId <= 0 && new Date(taskDueDate).getTime() < new Date().getTime())
                    {
                        errorMessages.push({ message: "Due Date must be in the future", fieldclass: ".user-task-manager-editor-due-date", fieldid: "" });                 
                        formValid = false;
                    }
                }
                if(taskDesc != null && taskDesc != "")
                {
                    if(taskDesc.length > 1000)
                    {
                        errorMessages.push({ message: "Task Description is too long.  Please limit to less than 1000 characters.", fieldclass: ".user-task-manager-editor-task-desc", fieldid: "" });                 
                        formValid = false;
                    }
                }

                if(formValid)
                {
                    if(callback != null)
                    {
                        callback();
                    }
                }
                else 
                {
                    var messageString = "";
                    if (errorMessages.length > 0) {
                        messageString += "<i class=\"fas fa-exclamation-triangle\"></i> <strong>Correct the following errors:</strong> <ul>";
                    }
                    for (var m = 0; m < errorMessages.length; m++) {
                        let item = errorMessages[m];

                        messageString += "<li>" + item.message + "</li>";
                        if (item.fieldclass != "") {
                            $(item.fieldclass, element).addClass("errorField");
                            $(item.fieldclass, element).off("blur").on("blur", function() {
                                $(this).removeClass("errorField");
                            });
                        }
                    }
                    if (messageString != "") {
                        messageString += "</ul>";

                        $(".error-information-holder", element).html(messageString);
                        $(".error-information-holder", element).show();
                    }
                }
            }
            function SaveTask(taskObject, callback)
            {
                
                if(taskObject != null)
                {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: true,
                        data: {
                            //lib: "userprofile",
                            lib:"selfserve",
                            cmd: "saveUserTask",
                            usertask: JSON.stringify(taskObject)
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function(data) {                            
                            taskObject.UserTaskId = data.UserTaskId;                            
                            
                            if (callback != null) {
                                callback(data);
                            }
                        }
                    });
                }
            }

            scope.load = function() {
                scope.Initialize();
                HandleTaskLoad();

                $(".user-task-manager-add-new-task-button", element).off("click").on("click", function(){
                    ClearEditorForm(function(){
                        LoadGoalOptions();
                        ShowEditorForm();
                    });
                });
                $(".user-task-manager-refresh-task-button", element).off("click").on("click", function(){
                    HandleTaskLoad();
                });
                $(".user-task-manager-editor-button-cancel", element).off("click").on("click", function(){
                    ClearEditorForm(function(){
                        HideEditorForm();
                    });
                });
                $(".close-panel-btn", element).off("click").on("click", function(){
                    ClearEditorForm(function(){
                        HideEditorForm();
                    });
                });
                $(".user-task-manager-editor-button-save", element).off("click").on("click", function(){
                    ValidateTaskForm(function(){
                        SaveEditorForm();
                    });
                });
                
                $(".user-task-manager-button-remove-selected", element).off("click").on("click", function(){                    
                    if(confirm("You are about to deleted all of the items selected.\nPress OK to continue or Cancel to cancel this action."))
                    {
                        DeleteSelectedTasks(function(){
                            HandleTaskLoad();                            
                        });
                    }
                });
                $(".user-task-manager-button-complete-selected", element).off("click").on("click", function(){
                    if(confirm("You are about to mark all of the selected items as complete.\nPress OK to continue or Cancel to cancel this action."))
                    {
                        MarkSelectedTasksComplete(function(){
                            HandleTaskLoad();
                        });
                    }
                });
                $(".user-task-mansger-options-include-completed", element).off("change").on("change", function(){
                    HandleTaskLoad();
                });
                $(".user-task-mansger-options-include-archived", element).off("change").on("change", function(){
                    HandleTaskLoad();
                });

            };
            scope.load();

            ko.postbox.subscribe("userTaskManagerLoad", function(){
                scope.load();
            });
            ko.postbox.subscribe("userTaskManagerReload", function(){
                scope.load();
            });
        }
    };
    }]);