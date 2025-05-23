angularApp.directive("ngAgameFlexScoringAreaManager", ['api', '$rootScope', function (api, $rootScope) {
    return {
        templateUrl: a$.debugPrefix() + '/applib/dev/AGAMEFLEX1/view/agameflexScoringAreaManager.htm?' + Date.now(),
        scope: {
            assoc: "@",
            text: "@",
            details: "@",
            cid: "@",
            filters: "@",
            panel: "@",
            hidetopper: "@",
            toppertext: "@",
            includeheader: "@"
        },
        require: '^ngLegacyContainer',
        link: function (scope, element, attrs, legacyContainer) {
            
            function Initialize() {
                scope.ManualScoringAreas = [];

                HideEntryForm();
                scope.HideUserStatus();
                LoadManualScoringAreaData();
            };

            scope.ShowUserStatus = function (displayForTiming) {
                var currentDisplayStatus = $(".flex-game-user-status", element).css("display");

                if (displayForTiming == null) {
                    displayForTiming = 60000 //1 minute is default for displaying data. 
                }

                if (currentDisplayStatus == "none") {
                    $(".flex-game-user-status", element).show();
                    window.setTimeout(function () {
                        scope.HideUserStatus();
                    }, displayForTiming);
                }
            };
            scope.HideUserStatus = function () {
                var currentDisplayStatus = $(".flex-game-user-status", element).css("display");
                if (currentDisplayStatus != "none") {
                    $(".flex-game-user-status", element).hide();
                }
            };
            scope.WriteUserStatus = function (message, displayForTiming, callback) {
                scope.HideUserStatus();
                $(".flex-game-user-status", element).html(message);
                scope.ShowUserStatus(displayForTiming);
                if (callback != null) {
                    callback();
                }
            };

            function HideEntryForm() {
                $(".flex-manual-entry-form-editor-holder", element).hide();
            }
            function ShowEntryFrom() {
                $(".flex-manual-entry-form-editor-holder", element).show();
            }
            function LoadManualScoringAreaData() {
                scope.WriteUserStatus("Loading scoring area manager...");
                GetManualScoringAreas(function(){
                    RenderManualScoringAreas();                    
                });
            }
            function GetManualScoringAreas(callback){
                scope.WriteUserStatus("Getting avaialble scoring areas...");
                let manualScoringOptions = [];

                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "flex",
                        cmd: "getPossibleManualScoringAreas"
                    },
                    dataType: "json",
                    cache: false,
                    error: function (response) {
                        a$.ajaxerror(response);
                    },
                    success: function (data) {
                        manualScoringOptions = $.parseJSON(data.manualScoringAreas);
                        scope.ManualScoringAreas.length = 0;
                        for(let i = 0; i < manualScoringOptions.length;i++){
                            scope.ManualScoringAreas.push(manualScoringOptions[i]);
                        }
                        if (callback != null) {
                            callback();
                        }
                    }
                });
            }

            function RenderManualScoringAreas(dataToDisplay, callback){
                let manualScoringAreaHolder = $("<div class=\"manual-scoring-area-list-holder\" />");
                let manualScoringAreaHeader = $("<div class=\"manual-scoring-area-list-header\" />");
                let scoringAreaNameHeader = $("<div class=\"manual-scoring-entry-list-header-column manual-scoring-area-list-item-name\" />");
                scoringAreaNameHeader.append("Name");
                let scoringAreaStatusHeader = $("<div class=\"manual-scoring-entry-list-header-column manual-scoring-area-list-item-status\" />");
                scoringAreaStatusHeader.append("Status");
                let scoringAreaButtonHeader = $("<div class=\"manual-scoring-entry-list-header-column manual-scoring-area-list-item-button-holder\" />");
                scoringAreaButtonHeader.append("&nbsp;");

                manualScoringAreaHeader.append(scoringAreaNameHeader);
                manualScoringAreaHeader.append(scoringAreaStatusHeader);
                manualScoringAreaHeader.append(scoringAreaButtonHeader);

                if(dataToDisplay == null)
                {
                    dataToDisplay = scope.ManualScoringAreas;
                }

                for(let i = 0; i < dataToDisplay.length; i++)
                {
                    let item = dataToDisplay[i];
                    let itemHolder = $("<div class=\"manual-scoring-area-list-row-holder\" />");
                    
                    let scoringAreaNameHolder = $("<div class=\"manual-scoring-area-list-item-name\" />");
                    scoringAreaNameHolder.append("<strong>" + item.KpiName + "</strong>");
                    let statusHolder = $("<div class=\"manual-scoring-area-list-item-status\"/>");
                    let statusName = "Active";
                    if(item.IsActive == false)
                    {
                        statusName = "Inactive";
                        statusHolder.addClass("inactive-status");

                    }
                    statusHolder.append(statusName);
                    let buttonHolder = $("<div class=\"manual-scoring-area-list-item-button-holder\" />");
                    if(item.Client != 0)
                    {
                        let editButton = $("<button id=\"editManualScoringArea_" + item.Id + "\" class=\"manual-scoring-area-list-item-button\"><i class=\"fa fa-edit\"></i></button>");
                        $(editButton, element).off("click").on("click", function(){
                            let buttonId = this.id;
                            let id = buttonId.split('_')[1];                            
                            LoadManualScoringAreaEntryForm(id, function(){
                                ShowEntryFrom();
                            });
                        });
                        buttonHolder.append(editButton);
                    }
                    else
                    {
                        buttonHolder.append("Pre-defined Area (not editable)");
                    }
                    
                    itemHolder.append(scoringAreaNameHolder);
                    itemHolder.append(statusHolder);
                    itemHolder.append(buttonHolder);

                    manualScoringAreaHolder.append(itemHolder);
                }

                $(".flex-manual-entry-manager-list", element).empty();
                $(".flex-manual-entry-manager-list", element).append(manualScoringAreaHeader);
                $(".flex-manual-entry-manager-list", element).append(manualScoringAreaHolder);

                scope.HideUserStatus();
                if(callback != null)
                {
                    callback();
                }
            }
            function ClearManualScoringAreaEntryForm(callback)
            {
                $("#flex-manual-entry-scoring-area-id", element).val("-1");
                $(".flex-manual-entry-scoring-area-edit-name", element).val("");
                $(".flex-manual-entry-scoring-area-is-active", element).prop("checked",true);
                if(callback != null)
                {
                    callback();
                }
            }
            function LoadManualScoringAreaEntryForm(id, callback)
            {
                let scoringArea = scope.ManualScoringAreas.find(a => a.Id == id);                
                if(scoringArea != null)
                {
                    $("#flex-manual-entry-scoring-area-id", element).val(scoringArea.Id);
                    $(".flex-manual-entry-scoring-area-edit-name", element).val(scoringArea.KpiName);
                    $(".flex-manual-entry-scoring-area-is-active", element).prop("checked", scoringArea.IsActive);                    
                }
                if(callback != null)
                {
                    callback();
                }
                
            }
            function SaveManualAreaEntryFrom(callback)
            {
                let manualScoringArea = new Object();
                manualScoringArea.Id = $("#flex-manual-entry-scoring-area-id", element).val();
                manualScoringArea.Client = -1; //TODO: Get current client ID from where within UI?  Back end will handle -1
                manualScoringArea.KpiName = $(".flex-manual-entry-scoring-area-edit-name", element).val();
                manualScoringArea.KpiWeight = 1.0000; //TODO: change once weights implemented
                manualScoringArea.IsActive = $(".flex-manual-entry-scoring-area-is-active", element).is(":checked");
                
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "flex",
                        cmd: "saveManualScoringArea",
                        manualscoringarea: JSON.stringify(manualScoringArea)
                    },
                    dataType: "json",
                    cache: false,
                    error: function (response) {
                        a$.ajaxerror(response);
                    },
                    success: function (data) { 
                        let id = data.manualScoringAreaId;
                        ClearManualScoringAreaEntryForm();
                        if (callback != null) {
                            callback();
                        }
                    }
                });
            }
            scope.load = function () {
                Initialize();
                
                $(".flex-manual-entry-add-new", element).off("click").on("click", function(){
                    ClearManualScoringAreaEntryForm(function(){
                        ShowEntryFrom();
                    });
                });
                $(".flex-manual-entry-editor-button-cancel", element).off("click").on("click", function(){
                    ClearManualScoringAreaEntryForm(function(){
                        HideEntryForm();
                    });
                });
                $(".flex-manual-entry-btn-return-game-list", element).off("click").on("click", function() {                    
                    var prefixInfo = a$.gup("prefix");
                    var hrefLocation = "default.aspx";
                    if (prefixInfo != null && prefixInfo != "") {
                        hrefLocation += "?prefix=" + prefixInfo;
                    }

                    document.location.href = hrefLocation;
                });
                $(".flex-manual-entry-scoring-area-edit-form-btn-save", element).off("click").on("click", function(){
                    SaveManualAreaEntryFrom(function(){
                        HideEntryForm();
                        LoadManualScoringAreaData();
                    });
                });                                
                $(".flex-manual-entry-scoring-area-is-active", element).off("click").on("click", function(){
                    let isActive = $(this).prop("checked");
                    let displayName = "Active";
                    if(!isActive)
                    {
                        displayName = "Inactive";
                    }                   
                    $(".edit-item-status-displayname", element).text(displayName);
                });
 
            };
            scope.load();
        }

    };
}]);