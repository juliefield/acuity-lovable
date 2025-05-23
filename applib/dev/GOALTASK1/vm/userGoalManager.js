angularApp.directive("ngUserGoalManager", ['api', '$rootScope', function(api, $rootScope) {
    return {
        templateUrl: a$.debugPrefix() + '/applib/dev/GOALTASK1/view/userGoalManager.htm?' + Date.now(),
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
        link: function(scope, element, attrs, legacyContainer) {            
            scope.tempReferenceKey = null;
            scope.userId = null;
            if(attrs.displaylimiteddata != null || attrs.displayLimitedData != null)
            {
                scope.displayLimitedData = (attrs.displaylimiteddata == "true" || attrs.displayLimitedData == "true");
            }

            if(attrs.addonlydisplay != null || attrs.addOnlyDisplay != null)
            {
                scope.addonlyDisplay = (attrs.addonlydisplay == "true" || attrs.addOnlyDisplay == "true" || attrs.AddOnlyDisplay == "true");
            }

            if(attrs.tempreferencekey != null || attrs.tempReferenceKey != null)
            {
                scope.tempReferenceKey = (attrs.tempreferencekey || attrs.tempReferenceKey || attrs.TempReferenceKey );
            }
            if(attrs.userid != null || attrs.UserId != null || attrs.Userid != null)
            {
                scope.userId = (attrs.userid || attrs.UserId || attrs.Userid || legacyContainer.scope.filters.CSR || legacyContainer.scope.TP1Username);                
            }

            scope.Initialize = function() { 
                scope.CurrentGoalList = [];
                scope.AvailableMetrics = [];
                scope.AvailableSubKpiOptions  = [];
                scope.AvailbleGoalStatusOptions = [];

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
                HideSubKpiSelector();
                HideEditorForm();
                HideTaskCreateForm();
            }
            function SetDatePickers()
            {
                $(".user-goal-manager-editor-complete-by-date", element).datepicker();
                $(".user-goal-manager-editor-achieved-date", element).datepicker();
                $(".user-goal-manager-task-due-date", element).datepicker();
            }
            function GetAllListOptions()
            {
                LoadSubKpiOptionData();
                LoadMetricsOptionData();                
                LoadStatusOptions();              
            }
            function LoadMetricsOptionData()
            {                
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "flex",
                        cmd: "getPossibleScoringAreas",
                        userid: legacyContainer.scope.TP1Username,
                        includebalancedscore: true
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function(data){
                        scope.AvailableMetrics.length = 0;
                        var metricOptions = $.parseJSON(data.scoringAreaList);
                        if(metricOptions != null)
                        {
                            for(var i = 0 ; i < metricOptions.length; i++)
                            {
                                scope.AvailableMetrics.push(metricOptions[i]);
                            }                
    
                        }
                    }
                });
            }            
            function LoadSubKpiOptionData()
            {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "flex",
                        cmd: "getPossibleSubScoringAreas"
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function(data)
                    {
                        var subScoringMetrics = $.parseJSON(data.subScoringAreaList);
                        scope.AvailableSubKpiOptions.length = 0;
                        if (subScoringMetrics != null) {
                            for (var i = 0; i < subScoringMetrics.length; i++) {
                                scope.AvailableSubKpiOptions.push(subScoringMetrics[i]);
                            }
                        }
                    }
                });

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
                        scope.AvailbleGoalStatusOptions.length = 0;
                        var goalStatusOptions =  $.parseJSON(data.goalTaskStatusList);
                        if(goalStatusOptions != null)
                        {
                            for(var i = 0 ; i < goalStatusOptions.length; i++)
                            {
                                scope.AvailbleGoalStatusOptions.push(goalStatusOptions[i]);
                            }                
    
                        }
                    }
                });
            }
            function LoadListOptions(listToLoad)
            {
                var loadAll = (listToLoad === "all");

                listToLoad = listToLoad.toLowerCase();

                if (listToLoad == "goalmetrics" || loadAll) {
                    if ($(".user-goal-manager-editor-goal-metric", element) != null) {
                        $(".user-goal-manager-editor-goal-metric", element).empty();
                        $(".user-goal-manager-editor-goal-metric", element).append($('<option />', { value: "", text: "Select a Metric" }));
                        for (var i = 0; i < scope.AvailableMetrics.length; i++) {
                            var item = scope.AvailableMetrics[i];
                            $(".user-goal-manager-editor-goal-metric", element).append($('<option />', { value: item.MqfNumber , text: item.Text }));
                        }                        
                        $(".user-goal-manager-editor-goal-metric", element).off("change").on("change", function(){
                            $(".user-goal-manager-editor-metric-basis", element).removeAttr("disabled");
                            
                            var scoringArea = $(this).val();
                            if (scoringArea != null && scoringArea != "") {
                                LoadSubKpiOptionsList(scoringArea);
                            } else {
                                $(".user-goal-manager-editor-goal-sub-type", element).hide();
                            }

                            if(parseInt(scoringArea) == 0)
                            {
                                $(".user-goal-manager-editor-metric-basis", element).val(0);
                                $(".user-goal-manager-editor-metric-basis", element).attr("disabled", true);
                                $(".user-goal-manager-editor-metric-basis", element).change();
                            }
                            GetRecentKpiValueInformation();
                        });
                    }
                }
                if (listToLoad == "goalstatus" || loadAll) {
                    if ($(".user-goal-manager-editor-goal-status", element) != null) {
                        $(".user-goal-manager-editor-goal-status", element).empty();
                        $(".user-goal-manager-editor-goal-status", element).append($('<option />', { value: "", text: "Select a Status" }));
                        for (var i = 0; i < scope.AvailbleGoalStatusOptions.length; i++) {
                            let item = scope.AvailbleGoalStatusOptions[i];
                            $(".user-goal-manager-editor-goal-status", element).append($('<option />', { value: item.StatusCode , text: item.Name }));

                        }
                    }
                }
            }
            function GetRecentKpiValueInformation(callback)
            {
                let userId = scope.userId || legacyContainer.scope.TP1Username;
                let mqfNumber = $(".user-goal-manager-editor-goal-metric :selected", element).val();
                let subTypeId = $(".user-goal-manager-editor-goal-sub-type :selected", element).val();
                let metricBasisId = $(".user-goal-manager-editor-metric-basis :selected", element).val();
                mqfNumber = parseInt(mqfNumber);
                subTypeId = parseInt(subTypeId);
                if(metricBasisId == null || metricBasisId == "")
                {
                    metricBasisId = -1;
                }
                else{
                    metricBasisId = parseInt(metricBasisId);
                }
                if(isNaN(subTypeId))
                {
                    subTypeId = 0;
                }

                let returnValue = null;
                if(mqfNumber >= 0 && metricBasisId >= 0)
                {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: false,
                        data: {
                            lib: "userprofile",
                            cmd: "getCurrentScoreForKpi",
                            mqfnumber: mqfNumber,
                            subtypeid: subTypeId,
                            userid: userId
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function(data){
                            var scoringData = $.parseJSON(data.currentScoringInfo);
                            if(scoringData != null)
                            {
                                if(metricBasisId == 1 || metricBasisId == 0)
                                {
                                    returnValue = scoringData.ScoredValue;
                                }
                                else
                                {
                                    returnValue = scoringData.StandardValue;
                                }
                                returnValue = returnValue.toFixed(2);     
                            }
                        }
                    });
                }
                SetRecentKpiValueInformation(returnValue, function(){
                    HandlePercentageChange(callback);
                });

            }
            function SetRecentKpiValueInformation(value, callback)
            {
                $(".user-goal-manager-editor-goal-start-value", element).val(value);
                if(callback != null)
                {
                    callback();
                }
            }
            function LoadSubKpiOptionsList(parentId, callback)
            {
                let showOptions = false;
                $(".user-goal-manager-editor-goal-sub-type", element).empty();
                let selectedKpi = scope.AvailableMetrics.find(i => i.MqfNumber == parseInt(parentId));
                if(selectedKpi != null && selectedKpi.HasSubType == true)
                {
                    if(scope.AvailableSubKpiOptions.length > 0)
                    {
                        $(".user-goal-manager-editor-goal-sub-type", element).append($('<option />', { value: "", text: "Select Sub KPI" }));
                        for(var subTypeCounter = 0; subTypeCounter < scope.AvailbleGoalStatusOptions.length; subTypeCounter++)
                        {
                            var subItem = scope.AvailableSubKpiOptions[subTypeCounter];
                            if (subItem.KpiId == selectedKpi.MqfNumber) {
                                $(".user-goal-manager-editor-goal-sub-type", element).append($('<option />', { value: subItem.SubTypeId, text: subItem.SubTypeDesc }));
                                showOptions = true;
                            }           
                        }
                    }
                }
                if(showOptions == true)
                {
                    ShowSubKpiSelector();
                }
                else
                {
                    HideSubKpiSelector();
                }

                if(callback != null)
                {
                    callback();
                }
            }
            function HideSubKpiSelector()
            {
                $(".user-goal-manager-editor-goal-sub-type", element).hide();
            }
            function ShowSubKpiSelector()
            {
                $(".user-goal-manager-editor-goal-sub-type", element).show();
            }
            function HideEditorForm()
            {
                $(".user-goal-manager-editor-holder", element).hide();
            }
            function ShowEditorForm()
            {
                let editorText = "Edit Goal";

                if(parseInt($("#goalId").val()) <= 0)
                {
                    editorText = "Add Goal";
                    $(".user-goal-manager-editor-date-achieved-row", element).hide();
                }
                else
                {
                    let goal = scope.CurrentGoalList.find(x => x.UserGoalId == parseInt($("#goalId").val()));
                    if(goal != null)
                    {
                        if (goal.StatusCode == "R")
                        {
                            editorText = "Archived Goal";
                        }
                        else if(goal.StatusCode == "C")
                        {
                            editorText = "Completed Goal";
                        }
                    }
                    $(".user-goal-manager-editor-date-achieved-row", element).show();
                }
                
                $(".user-goal-manager-editor-header-label", element).text(editorText);
                $(".user-goal-manager-editor-holder", element).show();
            }
            function ClearEditorForm(callback){
                $("#goalId").val(0);
                $(".user-goal-manager-editor-goal-name", element).val("");
                $(".user-goal-manager-editor-goal-metric", element).val("");
                $(".user-goal-manager-editor-goal-sub-type", element).val("");
                $(".user-goal-manager-editor-goal-start-value", element).val("");
                $(".user-goal-manager-editor-goal-end-value", element).val("");                
                $(".user-goal-manager-editor-complete-by-date", element).val("");
                $(".user-goal-manager-editor-sidekick-id", element).val("");                
                $(".user-goal-manager-editor-goal-status", element).val("A");
                $("#createdBy").val(legacyContainer.scope.TP1Username);
                $("#createdOn").val(new Date().toLocaleDateString("en-US"));                
                $(".user-goal-manager-editor-header-label", element).text("Add Goal");
                $(".user-goal-manager-editor-metric-basis", element).removeAttr("disabled");
                $(".user-goal-manager-editor-metric-basis", element).val("");
                $(".user-goal-manager-editor-pct-increase", element).val("");
                
                $(".errorField", element).each(function(){
                    $(this).removeClass("errorField");
                });
                $(".error-information-holder", element).empty();

                EnableEditFormFields();

                if(callback != null)
                {
                    callback();
                }
            }
            function SaveEditorForm(callback)
            {
                var goalToSave = CollectFormDataForGoal();
                
                SaveGoal(goalToSave, function(){
                    HideEditorForm();
                    HandleGoalLoad();
                });

            }
            function LoadEditorForm(goalIdToLoad, callback)
            {
                let goalItem = scope.CurrentGoalList.find(x => x.UserGoalId == goalIdToLoad);
                if(goalItem  != null)                
                {
                    EnableEditFormFields();
                    $("#goalId").val(goalIdToLoad);                    
                    $(".user-goal-manager-editor-goal-name", element).val(goalItem.GoalName);
                    $(".user-goal-manager-editor-goal-metric", element).val(goalItem.GoalMqfNumber);
                    $(".user-goal-manager-editor-goal-sub-type", element).val(goalItem.GoalSubTypeId);
                    $(".user-goal-manager-editor-goal-start-value", element).val(goalItem.StartingValue);
                    $(".user-goal-manager-editor-goal-end-value", element).val(goalItem.EndingValue);
                    $(".user-goal-manager-editor-complete-by-date", element).val(new Date(goalItem.GoalAchieveByDate).toLocaleDateString("en-US"));                                        
                    $(".user-goal-manager-editor-goal-status", element).val(goalItem.StatusCode);
                    $(".user-goal-manager-editor-metric-basis", element).val(goalItem.MetricBasisId);
                    if(goalItem.GoalAchievedOnDate != null)
                    {
                        $(".user-goal-manager-editor-achieved-date", element).val(new Date(goalItem.GoalAchievedOnDate).toLocaleDateString("en-US"));
                    }
                    

                    if(goalItem.GoalMqfNumber == 0 && goalItem.MetricBasisId == 0)
                    {
                        $(".user-goal-manager-editor-metric-basis", element).attr("disabled", true);
                    }

                    let percentIncrease = 0;
                    percentIncrease = (parseFloat(((goalItem.EndingValue / goalItem.StartingValue) - 1))*100).toFixed(2); 

                    $(".user-goal-manager-editor-pct-increase", element).val(percentIncrease);

                    $("#createdBy").val(legacyContainer.scope.TP1Username);
                    $("#createdOn").val(new Date().toLocaleDateString("en-US"));    

                    if(goalItem.StatusCode == "R" || goalItem.StatusCode == "C")
                    {
                        DisableEditFormFields();
                    }
                }
                if(callback != null)
                {
                    callback();
                }
            }

            function DisableEditFormFields()
            {
                $(".user-goal-manager-editor-goal-name", element).attr("disabled", true);
                $(".user-goal-manager-editor-goal-metric", element).attr("disabled", true);
                $(".user-goal-manager-editor-goal-sub-type", element).attr("disabled", true);
                $(".user-goal-manager-editor-goal-start-value", element).attr("disabled", true);
                $(".user-goal-manager-editor-goal-end-value", element).attr("disabled", true);
                $(".user-goal-manager-editor-complete-by-date", element).attr("disabled", true);
                $(".user-goal-manager-editor-goal-status", element).attr("disabled", true);
                $(".user-goal-manager-editor-metric-basis", element).attr("disabled", true);
                $(".user-goal-manager-editor-pct-increase", element).attr("disabled", true);
                $(".user-goal-manager-editor-achieved-date", element).attr("disabled", true);

                $(".user-goal-manager-editor-button-save", element).hide();

            }
            function EnableEditFormFields()
            {
                $(".user-goal-manager-editor-goal-name", element).removeAttr("disabled");
                $(".user-goal-manager-editor-goal-metric", element).removeAttr("disabled");
                $(".user-goal-manager-editor-goal-sub-type", element).removeAttr("disabled");
                $(".user-goal-manager-editor-goal-start-value", element).removeAttr("disabled");
                $(".user-goal-manager-editor-goal-end-value", element).removeAttr("disabled");
                $(".user-goal-manager-editor-complete-by-date", element).removeAttr("disabled");
                $(".user-goal-manager-editor-goal-status", element).removeAttr("disabled");
                $(".user-goal-manager-editor-metric-basis", element).removeAttr("disabled");
                $(".user-goal-manager-editor-pct-increase", element).removeAttr("disabled");
                $(".user-goal-manager-editor-achieved-date", element).removeAttr("disabled");

                $(".user-goal-manager-editor-button-save", element).show();
            }

            function HideTaskCreateForm()
            {
                $(".user-goal-manager-create-task-holder", element).hide();
            }   
            function ShowTaskCreateForm()
            {
                $(".user-goal-manager-create-task-holder", element).show();
            }
            function ClearTaskCreateForm(callback)
            {
                $(".user-goal-manager-task-name", element).val("");
                $(".user-goal-manager-task-desc", element).val("");
                $(".user-goal-manager-task-due-date", element).val("");
                $(".user-goal-manager-create-task-form-goal-id", element).val("");
                $(".user-goal-manager-task-send-reminder", element).prop("checked", false);
                
                if(callback != null)
                {
                    callback();
                }
                
            }
            function SaveTaskCreateForm(callback)
            {
                var taskToCreate = CollectFormDataForTaskCreation();

                SaveTaskForGoal(taskToCreate, function(){
                    HideTaskCreateForm();
                    HandleGoalLoad();
                });
            }
            function LoadTaskCreateForm(goalId, callback)
            {
                let goal = scope.CurrentGoalList.find(g => g.UserGoalId == goalId);                
                let goalName = "";
                let metricName = "Unknown Metric";
                if(goal != null)
                {
                    goalName = goal.GoalName;
                    let metric = scope.AvailableMetrics.find(m => m.MqfNumber == goal.GoalMqfNumber);
                    if(metric != null)
                    {
                        metricName = metric.Text;
                    }
                    let taskName = "Task for " + goalName;
                    $(".user-goal-manager-task-name", element).val(taskName);
                    $(".user-goal-manager-task-desc", element).val("Task automatically created from a goal.  We are trying to get to " + goal.EndingValue + " by the date of " + new Date(goal.GoalAchieveByDate).toLocaleDateString("en-US") + ".");
                    $(".user-goal-manager-goal-values", element).text(goal.StartingValue + " - " + goal.EndingValue);
                    $(".user-goal-manager-goal-days-remaining", element).text(goal.DaysUntilGoalEnd + " day(s)");
                }                
                $(".user-goal-manager-metric-name", element).text(metricName);
                $(".user-goal-manager-create-task-form-goal-id", element).val(goalId);
                
                if(callback != null)
                {
                    callback();
                }
            }
            function CollectFormDataForTaskCreation()
            {
                let userId = (scope.userId || legacyContainer.scope.TP1Username);
                let returnObject = new Object();
                returnObject.UserTaskId = 0;
                returnObject.UserId = userId;
                returnObject.TaskName = $(".user-goal-manager-task-name", element).val();
                returnObject.TaskDesc = $(".user-goal-manager-task-desc", element).val();
                returnObject.TaskDueDate = new Date($(".user-goal-manager-task-due-date", element).val()).toLocaleDateString("en-US");
                returnObject.UserGoalReferenceId = parseInt($(".user-goal-manager-create-task-form-goal-id", element).val());                
                returnObject.SendReminder = $(".user-goal-manager-task-send-reminder", element).is(":checked");
                returnObject.StatusCode = "A"
                returnObject.EntDt = new Date().toLocaleDateString("en-US");
                returnObject.EntBy = legacyContainer.scope.TP1Username;

                return returnObject;
            }
            function ValidateTaskCreationForGoalData(callback)
            {
                
                $(".error-information-holder", element).empty();
                var formValid = true;
                var errorMessages = [];
                let taskName = $(".user-goal-manager-task-name", element).val();                
                let taskDueDate  = $(".user-goal-manager-task-due-date", element).val();
                // let metricBasis = $(".user-goal-manager-editor-metric-basis", element).val();
                // let metricToMeasure = $(".user-goal-manager-editor-goal-metric", element).val();
                
                if(taskName == "")
                {
                    errorMessages.push({ message: "Task Name Required", fieldclass: ".user-goal-manager-task-name", fieldid: "" });                 
                    formValid = false;
                }
                if(taskDueDate == "")
                {
                    errorMessages.push({ message: "Due Date Required", fieldclass: ".user-goal-manager-task-due-date", fieldid: "" });                 
                    formValid = false;
                }
                else
                {
                    if(new Date(taskDueDate).getTime() < new Date().getTime())
                    {
                        errorMessages.push({ message: "Due Date must be in the future", fieldclass: ".user-goal-manager-task-due-date", fieldid: "" });
                        formValid = false;
                    }
                }
                // if(metricToMeasure == "")
                // {
                //     errorMessages.push({ message: "Metric to Measure is Required", fieldclass: ".user-goal-manager-editor-goal-metric", fieldid: "" });                 
                //     formValid = false;
                // }
                // if(metricBasis == "")
                // {
                //     errorMessages.push({ message: "Metric Basis is Required", fieldclass: ".user-goal-manager-editor-metric-basis", fieldid: "" });                 
                //     formValid = false;
                // }

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
            function SaveTaskForGoal(taskObject, callback)
            {
                if(taskObject != null)
                {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: true,
                        data: {
                            lib: "userprofile",
                            cmd: "saveUserTask",
                            usertask: JSON.stringify(taskObject)
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function(data) {    
                            alert("Task Created");                                                    
                            if (callback != null) {
                                callback(data);
                            }
                        }
                    });
                }   
                
            }
            function ConfirmDeleteGoal(goalIdToDelete, callback)
            {
                let goal = scope.CurrentGoalList.find(g => g.UserGoalId == goalIdToDelete);
                if(goal != null)
                {
                    if(confirm("You are about to delete the following goal\n" + goal.GoalName + "\n\nPress OK to delete or Cancel to keep the goal."))
                    {
                        callback();
                    }
                }
                
            }
            function ConfirmArchiveGoal(goalIdToArchive, callback)
            {
                let goal = scope.CurrentGoalList.find(g => g.UserGoalId == goalIdToArchive);
                if(goal != null)
                {
                    if(confirm("You are about to archive the following goal\n" + goal.GoalName + "\n\nPress OK to continue or Cancel to cancel archiving."))
                    {
                        callback();
                    }
                }
            }
            function ConfirmCompleteGoal(goalIdToComplete, callback)
            {
                let goal = scope.CurrentGoalList.find(g => g.UserGoalId == goalIdToComplete);
                if(goal != null)
                {
                    if(confirm("You are about to complete the following goal\n" + goal.GoalName + "\n\nThis will set the complete date to today.\nPress OK to complete or Cancel to keep the goal."))
                    {
                        callback();
                    }
                }
                
            }
            function DeleteGoal(goalIdToDelete, callback)
            {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "userprofile",
                        cmd: "setUserGoalStatus",
                        usergoalid: goalIdToDelete,
                        goalstatus: "D"
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
            function CompleteGoal(goalIdToComplete, callback)
            {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "userprofile",
                        cmd: "completeUserGoal",
                        usergoalid: goalIdToComplete
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
            function SetGoalStatus(goalIdToSet, status, callback)
            {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "userprofile",
                        cmd: "setUserGoalStatus",
                        usergoalid: goalIdToSet,
                        goalstatus: status,

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
            function HandleGoalLoad()
            {
                scope.LoadUserGoals(function(){
                    DisplayUserGoals(function(){
                        scope.LoadUserGoalStats();
                    });
                });
            }
            function LoadStatsData(data)
            {
                let totalGoals = parseInt(data.totalGoals);
                let totalCompletedGoals = parseInt(data.totalGoalsCompleted);
                let archivedGoalCount = parseInt(data.totalArchivedGoals);

                $(".user-goal-manager-user-stats-total-goals", element).text(totalGoals);
                $(".user-goal-manager-user-stats-completed-goals", element).text(totalCompletedGoals);
                $(".user-goal-manager-user-stats-archived-goals", element).text(archivedGoalCount);

            }
            function MarkAllGoals()
            {
                var allGoalsHolder = ".user-goal-manager-user-goals-holder";
                var checkAllCheckboxName = "#markAllGoals";

                var checkAllCheckbox = $(checkAllCheckboxName, element);
                var allGoalCheckboxes = $("input[type='checkbox']", $(allGoalsHolder, element));
                var checkValue = (checkAllCheckbox).is(":checked");

                $(allGoalCheckboxes).each(function() {
                    $(this).prop("checked", checkValue);
                });

            }
            function DeleteSelectedGoals(callback)
            {
                let goalsToHandle = CollectSelectedGoals();
                if(goalsToHandle.length > 0)
                {
                    for(var i = 0; i < goalsToHandle.length; i++)
                    {
                        DeleteGoal(goalsToHandle[i]);                        
                    }
                    if(callback != null)
                    {
                        callback();
                    }
                }                                
            }
            function MarkSelectedGoalsComplete()
            {
                let goalsToHandle = CollectSelectedGoals();
                if(goalsToHandle.length > 0)
                {
                    for(var i = 0; i < goalsToHandle.length; i++)
                    {
                        CompleteGoal(goalsToHandle[i]);                        
                    }
                    HandleGoalLoad();
                }    
                
            }
            function CollectSelectedGoals()
            {
                var selectedGoals = [];
                var allGoalCheckboxes = $("input[type='checkbox']", $(".user-goal-manager-user-goals-holder", element));

                $(allGoalCheckboxes).each(
                    function(){
                        if($(this).is(":checked"))
                        {
                            var checkboxId = this.id;
                            let goalId = checkboxId.split('_')[1];

                            selectedGoals.push(goalId);
                        }
                    }
                );

                return selectedGoals;
            }
            function DisplayUserGoals(callback)
            {
                let limitedDataColumnsDisplayed = scope.displayLimitedData;
                let addonlyOption = scope.addonlyDisplay;

                $(".user-goal-manager-user-goals-list", element).empty();
                let goalListHolder = $("<div class=\"user-goal-manager-user-goals-holder\" />");

                let goalDataItemHeader = $("<div class=\"user-goal-manager-user-goal-row-item-header data-item-header\"/>");
                let goalCheckboxHeader = $("<div class=\"user-goal-manager-goal-selector-checkbox-holder center data-item-header\"/>");
                let goalNameItemHeader = $("<div class=\"user-goal-data-item goal-name data-item-header\" />");
                let goalStartValueHeader = $("<div class=\"user-goal-data-item goal-start-value center data-item-header\" />");
                let goalEndValueHeader = $("<div class=\"user-goal-data-item goal-end-value center data-item-header\" />");
                let goalCurrentValueHeader = $("<div class=\"user-goal-data-item goal-current-value center data-item-header\" />");
                let goalEndDateHeader = $("<div class=\"user-goal-data-item goal-end-date center data-item-header\" />");
                let goalTeamLeaderHeader = $("<div class=\"user-goal-data-item goal-team-leader data-item-header\" />");
                let goalButtonHeader = $("<div class=\"user-goal-data-item goal-button-holder center data-item-header\" />");

                let goalSelectAllCheckbox = $("<input type=\"checkbox\" id=\"markAllGoals\" class=\"user-goal-manager-select-all-checkbox\" />");
                $(goalSelectAllCheckbox).off("click").on("click", function(){
                    MarkAllGoals();
                });
                goalCheckboxHeader.append(goalSelectAllCheckbox);
                
                
                goalNameItemHeader.append("Goal");
                goalStartValueHeader.append("Start Value");
                goalEndValueHeader.append("End Value");
                goalCurrentValueHeader.append("Current Value");
                goalEndDateHeader.append("Date");
                goalTeamLeaderHeader.append("Team Leader");
                goalButtonHeader.append("Actions");
                
                goalDataItemHeader.append(goalCheckboxHeader);
                goalDataItemHeader.append(goalNameItemHeader);
                goalDataItemHeader.append(goalStartValueHeader);
                goalDataItemHeader.append(goalEndValueHeader);
                goalDataItemHeader.append(goalCurrentValueHeader);
                goalDataItemHeader.append(goalEndDateHeader);
                goalDataItemHeader.append(goalTeamLeaderHeader);
                goalDataItemHeader.append(goalButtonHeader);
                
                if(scope.CurrentGoalList != null && scope.CurrentGoalList.length > 0)
                {
                    for(var i = 0; i < scope.CurrentGoalList.length; i++)
                    {
                        let dataItem = scope.CurrentGoalList[i];
                        let dataItemCompleted = false;
                        let metricName = null;
                        if(dataItem != null)
                        {
                            dataItemCompleted = (dataItem.IsAchieved);
                            let goalDataItem = $("<div class=\"user-goal-manager-user-goal-row-item\" />");
                            let goalCheckboxItemHolder = $("<div class=\"user-goal-manager-goal-selector-checkbox-holder user-goal-data-item center\"/>");
                            let goalCheckboxItem = $("<input type=\"checkbox\" id=\"goalItem_" + dataItem.UserGoalId + "\" class=\"user-goal-manager-goal-selector-checkbox\" >");
                            let goalNameItem = $("<div class=\"user-goal-data-item goal-name\" />");
                            let goalStartValue = $("<div class=\"user-goal-data-item goal-start-value center\" />");
                            let goalEndValue = $("<div class=\"user-goal-data-item goal-end-value center\" />");
                            let goalCurrentValue = $("<div class=\"user-goal-data-item goal-current-value center\" />");
                            let goalEndDate = $("<div class=\"user-goal-data-item goal-end-date center\" />");
                            let goalTeamLeader = $("<div class=\"user-goal-data-item goal-team-leader\" />");
                            let goalButtonHolder = $("<div class=\"user-goal-data-item goal-button-holder center\" />");

                            let goalEditButtonItem = $("<button id=\"goalEdit_" + dataItem.UserGoalId + "\" ><i class=\"fad fa-edit\"></i></button>");
                            goalEditButtonItem.prop("title", "Edit " + dataItem.GoalName);
                            $(goalEditButtonItem).off("click").on("click", function(){
                                let buttonId = this.id;
                                let goalIdToEdit = buttonId.split('_')[1];
                                LoadEditorForm(goalIdToEdit, function(){
                                    ShowEditorForm();
                                });
                            });
                            
                            let goalRemoveButtonItem = $("<span class=\"divider\"></span><button class=\"button--red\" id=\"goalDelete_" + dataItem.UserGoalId + "\" ><i class=\"fad fa-trash\"></i></button>");
                            goalRemoveButtonItem.prop("title", "Delete " + dataItem.GoalName);
                            $(goalRemoveButtonItem).off("click").on("click", function(){
                                let buttonId = this.id;
                                let goalIdToDelete = buttonId.split('_')[1];
                                ConfirmDeleteGoal(goalIdToDelete, function(){
                                    DeleteGoal(goalIdToDelete, function(){                                        
                                        HandleGoalLoad();
                                    });
                                });                                
                            });
                            let goalCreateTaskButtonItem = $("<button id=\"goalCreateTask_" + dataItem.UserGoalId + "\" ><i class=\"fa fa-plus\"></i></button>");
                            goalCreateTaskButtonItem.prop("title", "Create a task for goal " + dataItem.GoalName);
                            $(goalCreateTaskButtonItem).off("click").on("click", function(){
                                let buttonId = this.id;
                                let goalIdForTask = buttonId.split('_')[1];
                                LoadTaskCreateForm(goalIdForTask, function(){
                                    ShowTaskCreateForm();
                                });
                            });

                            let goalMarkCompleteButton = $("<button class=\"button--green\" id=\"goalComplete_" + dataItem.UserGoalId + "\" ><i class=\"fas fa-check-circle\"></i></button>");
                            goalMarkCompleteButton.prop("title", "Complete " + dataItem.GoalName);
                            $(goalMarkCompleteButton).off("click").on("click", function(){
                                let buttonId = this.id;
                                let goalIdToComplete = buttonId.split('_')[1];
                                ConfirmCompleteGoal(goalIdToComplete, function(){
                                    CompleteGoal(goalIdToComplete, function(){
                                        HandleGoalLoad();
                                    });
                                });                                
                            });

                            let goalArchiveItemButton = $("<button id=\"goalArchive_" + dataItem.UserGoalId + "\" ><i class=\"fad fa-folder-download\"></i></button>");
                            goalArchiveItemButton.prop("title", "Archive " + dataItem.GoalName);
                            $(goalArchiveItemButton).off("click").on("click", function(){
                                let buttonId = this.id;
                                let goalIdToArchive = buttonId.split('_')[1];
                                ConfirmArchiveGoal(goalIdToArchive, function(){
                                    SetGoalStatus(goalIdToArchive, "R", function(){
                                        HandleGoalLoad();
                                    });
                                });
                            });

                            if(dataItem.StatusCode == "R")
                            {
                                goalRemoveButtonItem = null;
                                goalMarkCompleteButton = null;
                                goalArchiveItemButton = null;
                                goalCheckboxItem = null;   
                                goalMarkCompleteButton = null;
                                goalCreateTaskButtonItem = null;                                  
                            }
                            else if(dataItemCompleted)
                            {
                                goalCheckboxItem = null;   
                                goalMarkCompleteButton = null;
                                goalCreateTaskButtonItem = null;                                
                            }
                            else
                            {
                                goalArchiveItemButton = null;
                            }
                            
                            if (addonlyOption == true)                            
                            {

                                goalMarkCompleteButton = null;                                
                            }
                            
                            goalCheckboxItemHolder.append(goalCheckboxItem);
                            
                            
                            goalNameItem.append(dataItem.GoalName);       
                            let metric = scope.AvailableMetrics.find(m => m.MqfNumber == dataItem.GoalMqfNumber);

                            if(metric != null)
                            {
                                metricName = metric.Text;
                                if(dataItem.GoalSubTypeId != null && dataItem.GoalSubTypeId != 0)
                                {
                                    let subKpi = scope.AvailableSubKpiOptions.find(s => s.SubTypeId == dataItem.GoalSubTypeId);
                                    if(subKpi != null)
                                    {
                                        metricName = metricName + " - " + subKpi.SubTypeDesc;
                                    }
                                }
                                goalNameItem.append("<br class=\"clearfix\" />");
                                goalNameItem.append("<span class=\"user-goal-metric-name-auto-include\">(" + metricName + ")</span>");
                            }                     
                            goalStartValue.append(dataItem.StartingValue);
                            goalEndValue.append(dataItem.EndingValue);
                            if(dataItem.CurrentValue != null)
                            {
                                goalCurrentValue.append(dataItem.CurrentValue);
                            }
                            else
                            {
                                goalCurrentValue.append("--");
                            }
                            goalEndDate.append(new Date(dataItem.GoalAchieveByDate).toLocaleDateString("en-US"));
                            goalTeamLeader.append(dataItem.SupervisorUserId);
                            
                            goalButtonHolder.append(goalMarkCompleteButton);
                            goalButtonHolder.append(goalEditButtonItem);
                            goalButtonHolder.append(goalCreateTaskButtonItem);
                            goalButtonHolder.append(goalArchiveItemButton);
                            goalButtonHolder.append(goalRemoveButtonItem);
                        
                            goalDataItem.append(goalCheckboxItemHolder);
                            goalDataItem.append(goalNameItem);
                            goalDataItem.append(goalStartValue);
                            goalDataItem.append(goalEndValue);             
                            goalDataItem.append(goalCurrentValue);                            
                            goalDataItem.append(goalEndDate);                            
                            goalDataItem.append(goalTeamLeader);                            
                            goalDataItem.append(goalButtonHolder);
                        
                            if(dataItem.IsAchieved == true && dataItem.StatusCode != "R")
                            {
                                $(goalDataItem).addClass("goal-completed");
                            }
                            else if (dataItem.StatusCode == "R")
                            {
                                $(goalDataItem).removeClass("goal-completed");
                                $(goalDataItem).addClass("goal-archived");
                            }


                            $(goalListHolder).append(goalDataItem);
                        }
                    }
                    $(".user-goal-manager-button-options-holder", element).show();

                }
                else
                {
                    $(".user-goal-manager-button-options-holder", element).hide();
                    
                    let goalDataItem = $("<div class=\"no-data-found\" />");
                    goalDataItem.append("<p>No ACTIVE goals found for user.</p>");
                    $(goalListHolder).append(goalDataItem);
                }
                $(".user-goal-manager-user-goals-list", element).append(goalDataItemHeader);
                $(".user-goal-manager-user-goals-list", element).append(goalListHolder);

                if(addonlyOption == true)
                {
                    $(goalDataItemHeader).hide();
                    $(".user-goal-manager-header", element).hide();
                    $(".user-goal-manager-user-stats-holder", element).hide();                    
                    $(".user-goal-manager-button-options-holder", element).hide();
                    $(".user-goal-manager-filter-holder", element).hide();
                    $(".user-goal-manager-refresh-goal-button", element).hide();
                }
                else if(limitedDataColumnsDisplayed == true)
                {
                    $(".goal-start-value", element).hide();
                    $(".goal-end-value", element).hide();
                    $(".goal-current-value", element).hide();
                    $(".goal-team-leader", element).hide();
                }

                if(callback != null)
                {
                    callback();
                }
            }
            function CollectFormDataForGoal()
            {
                let userId = (scope.userId || legacyContainer.scope.TP1Username);
                let returnObject = new Object();
                returnObject.UserGoalId = $("#goalId").val();
                returnObject.UserId = userId;
                var mqfNumber = 0;
                if($(".user-goal-manager-editor-goal-metric", element).val() != "")      
                {
                    mqfNumber = $(".user-goal-manager-editor-goal-metric", element).val();
                }
                var subTypeId = null;
                if($(".user-goal-manager-editor-goal-sub-type", element).val() != null && 
                    $(".user-goal-manager-editor-goal-sub-type", element).val() != "")      
                {
                    subTypeId = $(".user-goal-manager-editor-goal-sub-type", element).val();
                    if(subTypeId != "" && !Number.isNaN(subTypeId))
                    {
                        subTypeId = parseInt(subTypeId);
                    }
                }
                
                returnObject.GoalMqfNumber = parseInt(mqfNumber);
                returnObject.GoalSubTypeId = subTypeId;
                returnObject.GoalName = $(".user-goal-manager-editor-goal-name", element).val();
                returnObject.GoalAchieveByDate = new Date($(".user-goal-manager-editor-complete-by-date", element).val()).toLocaleDateString("en-US");
                returnObject.MetricBasisId = parseInt($(".user-goal-manager-editor-metric-basis", element).val());
                returnObject.StartingValue = parseFloat($(".user-goal-manager-editor-goal-start-value", element).val()).toFixed(2);
                returnObject.EndingValue = parseFloat($(".user-goal-manager-editor-goal-end-value", element).val()).toFixed(2);
                returnObject.StatusCode = $(".user-goal-manager-editor-goal-status", element).val();
                returnObject.EntDt = new Date($("#createdOn").val()).toLocaleDateString("en-US");
                returnObject.EntBy = $("#createdBy").val();
                returnObject.TempReferenceKey = scope.tempReferenceKey;

                return returnObject;
            }
            function ValidateGoalForm(callback)
            {
                $(".error-information-holder", element).empty();
                var formValid = true;
                var errorMessages = [];
                var goalId = parseInt($("#goalId").val());
                var goalName = $(".user-goal-manager-editor-goal-name", element).val();                
                var startValue = $(".user-goal-manager-editor-goal-start-value", element).val();
                var endValue = $(".user-goal-manager-editor-goal-end-value", element).val();
                var completeByDate = $(".user-goal-manager-editor-complete-by-date", element).val();
                let metricBasis = $(".user-goal-manager-editor-metric-basis", element).val();
                let metricToMeasure = $(".user-goal-manager-editor-goal-metric", element).val();
                

                if (goalName == "") {
                    errorMessages.push({ message: "Goal Name Required", fieldclass: ".user-goal-manager-editor-goal-name", fieldid: "" });                 
                    formValid = false;
                }

                if(startValue == "")
                {
                    errorMessages.push({ message: "Starting Value Required", fieldclass: ".user-goal-manager-editor-goal-start-value", fieldid: "" });                 
                    formValid = false;
                }
                if(endValue == "")
                {
                    errorMessages.push({ message: "Ending Value Required", fieldclass: ".user-goal-manager-editor-goal-end-value", fieldid: "" });                 
                    formValid = false;
                }
                if(completeByDate == ""){
                    errorMessages.push({ message: "Complete By Date Required", fieldclass: ".user-goal-manager-editor-complete-by-date", fieldid: "" });                 
                    formValid = false;
                }
                else 
                {
                    if(goalId <= 0 && new Date(completeByDate).getTime() < new Date().getTime())
                    {
                        errorMessages.push({ message: "Complete By Date must be in the future", fieldclass: ".user-goal-manager-editor-complete-by-date", fieldid: "" });                 
                        formValid = false;
                    }
                }
                if(metricToMeasure == "")
                {
                    errorMessages.push({ message: "Metric to Measure is Required", fieldclass: ".user-goal-manager-editor-goal-metric", fieldid: "" });                 
                    formValid = false;
                }
                if(metricBasis == "")
                {
                    errorMessages.push({ message: "Metric Basis is Required", fieldclass: ".user-goal-manager-editor-metric-basis", fieldid: "" });                 
                    formValid = false;
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
            function SaveGoal(goalObject, callback)
            {
                if(goalObject != null)
                {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: true,
                        data: {
                            lib: "userprofile",
                            cmd: "saveUserGoal",
                            usergoal: JSON.stringify(goalObject)
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function(data) {                            
                            goalObject.UserGoalId = data.UserGoalId;                            
                            if (callback != null) {
                                callback(data);
                            }
                        }
                    });
                }
            }

            function HandlePercentageChange(callback)
            {
                let startingValue = $(".user-goal-manager-editor-goal-start-value", element).val();
                if(startingValue == null || startingValue == "") return;

                let endingValue = null;
                let changeValue = $(".user-goal-manager-editor-pct-increase", element).val();
                changeValue = parseFloat(changeValue);
                changeValue = (changeValue / 100);
                startingValue = parseFloat(startingValue);
                endingValue = startingValue;
                if(startingValue != null)
                {
                    endingValue = startingValue * (1+changeValue);                    
                }
                if(endingValue != null)
                {
                    endingValue = endingValue.toFixed(2);                
                }
                if(isNaN(endingValue))
                {
                   endingValue = ""; 
                }
                
                $(".user-goal-manager-editor-goal-end-value", element).val(endingValue);
                if(callback != null)
                {
                    callback(endingValue);
                }
                else
                {
                    return endingValue;
                }
            }

            scope.LoadUserGoals = function(callback)
            {   
                let includeCompletedGoals = $(".user-goal-manager-options-include-completed").is(":checked");
                let includeArchivedGoals = $(".user-goal-manager-options-include-archived").is(":checked");
                let onlyNewGoalsDisplayed = scope.addonlyDisplay;
                let userId = (scope.userId || legacyContainer.scope.TP1Username);

                scope.CurrentGoalList.length = 0;
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "userprofile",
                        cmd: "getUserGoals",
                        userid: userId,
                        includecompleted: includeCompletedGoals,
                        includearchived: includeArchivedGoals,
                        addonlyitems: onlyNewGoalsDisplayed,
                        tempRefKey: scope.tempReferenceKey
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function(data) {
                        var goals = JSON.parse(data.userGoalList);
                        if(goals != null && goals.length > 0)
                        {
                            for(var i = 0; i < goals.length; i++)
                            {
                                scope.CurrentGoalList.push(goals[i]);
                            }
                        }
                        if (callback != null) {
                            callback(data);
                        }    
                    }
                });
            }
            scope.LoadUserGoalStats = function(callback)
            {
                let userId = (scope.userId || legacyContainer.scope.TP1Username);
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "userprofile",
                        cmd: "getGoalStatsForUser",
                        userid: userId
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function(data) {                        
                        LoadStatsData(data);
                        if (callback != null) {
                            callback(data);
                        }
                    }
                });  
            }
            scope.load = function() {
                scope.Initialize();
                HandleGoalLoad();
                $(".user-goal-manager-add-new-goal-button", element).off("click").on("click", function(){
                    ClearEditorForm(function(){
                        ShowEditorForm();
                    });
                });
                $(".user-goal-manager-refresh-goal-button", element).off("click").on("click", function(){
                    HandleGoalLoad();
                });
                $(".user-goal-manager-editor-button-cancel", element).off("click").on("click", function(){
                    ClearEditorForm(function(){
                        HideEditorForm();
                    });
                });
                $(".close-panel-btn", element).off("click").on("click", function(){
                    ClearEditorForm(function(){
                        HideEditorForm();
                    });
                });
                $(".user-goal-manager-editor-button-save", element).off("click").on("click", function(){
                    ValidateGoalForm(function(){
                        SaveEditorForm();
                    });
                });
                $(".user-goal-manager-editor-button-cancel-task-create", element).off("click").on("click", function(){
                    ClearTaskCreateForm(function(){
                        HideTaskCreateForm();
                    });
                });
                $(".user-goal-manager-editor-button-save-task-create", element).off("click").on("click", function(){
                    ValidateTaskCreationForGoalData(function(){
                        SaveTaskCreateForm();
                    });
                });
                $(".user-goal-manager-button-remove-selected", element).off("click").on("click", function(){                    
                    if(confirm("You are about to deleted all of the items selected.\nPress OK to continue or Cancel to cancel this action."))
                    {
                        DeleteSelectedGoals(function(){
                            HandleGoalLoad();                            
                        });
                    }
                });
                $(".user-goal-manager-button-complete-selected", element).off("click").on("click", function(){
                    if(confirm("You are about to mark all of the selected items as complete.\nPress OK to continue or Cancel to cancel this action."))
                    {
                        MarkSelectedGoalsComplete(function(){
                            HandleGoalLoad();
                        });
                    }
                });
                $(".user-goal-manager-options-include-completed", element).off("change").on("change", function(){
                    HandleGoalLoad();
                });
                $(".user-goal-manager-options-include-archived", element).off("change").on("change", function(){
                    HandleGoalLoad();
                });
                $(".user-goal-manager-editor-metric-basis", element).off("change").on("change", function(){                    
                    GetRecentKpiValueInformation();
                });
                $(".user-goal-manager-editor-pct-increase", element).off("keyup").on("keyup", function(){
                    HandlePercentageChange();
                });
                $(".user-goal-manager-editor-goal-start-value", element).off("keyup").on("keyup", function(){
                    HandlePercentageChange();
                });
            };
            scope.load();
        }
    };
    }]);