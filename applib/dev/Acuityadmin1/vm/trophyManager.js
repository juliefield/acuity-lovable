angularApp.directive("ngTrophyManager", ['api', '$rootScope', function (api, $rootScope) {
    return {
        templateUrl: a$.debugPrefix() + '/applib/dev/ACUITYADMIN1/view/trophyManager.htm?' + Date.now(),
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
            /* Global Variables START */
            var baseImageUrl = "/applib/css/images/trophy/";
            var availableClients = [];
            var possibleTrophies = [];
            var possibleThemes = [];
            var possibleRanks = [
                { name: "Rank 1", value: 1},
                { name: "Rank 2", value: 2},
                { name: "Rank 3", value: 3},
            ];
            var possiblePositions = [];
            /* Global Variables END */

            /* Events Handling START */
            $(".show-editor", element).off("click").on("click", function(){
                ShowEditorForm();
            });
            $("#btnSave", element).off("click").on("click", function(){
                console.log("btnSave clicked");
            });
            $(".btn-close", element).off("click").on("click", function(){
                ClearEditorForm(function(){
                    HideEditorForm();
                });
            });
            $("#trophyEditorTrophyTheme", element).off("change").on("change", function(){
                LoadPossiblePositionsForTheme(function(){
                    ConstructTrophyData();
                }, null);
            });
            $("#trophyEditorTrophyRank", element).off("change").on("change", function(){
                ConstructTrophyData();
            });
            $("#trophyEditorTrophyPosition", element).off("change").on("change", function(){
                ConstructTrophyData();
            });
            /* Events Handling END */
            scope.Initialize = function () {
                HideAll();
                SetDatePickers();
                LoadAvailableClients();
                LoadPossibleThemes();
                LoadPossiblePositions();
                LoadDropdownOptions();
            };        
            function SetDatePickers() {
                $("#trophyEditorTrophyAwardStartDate", element).datepicker();
                $("#trophyEditorTrophyAwardEndDate", element).datepicker();
            }
            function LoadAvailableClients(callback, forceReload){
                if(forceReload == null)
                {
                    forceReload = false;
                }
                if(availableClients != null && availableClients.length > 0 && forceReload == false)
                {
                    callback(availableClients);
                }
                else
                {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: false,
                        data: {
                            lib: "selfserve",
                            cmd: "getAllClients",
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function (data) {
                            let returnData = JSON.parse(data.acuityClientsList);
                            availableClients.length = 0;
                            for (let i = 0; i < returnData.length; i++) {
                                availableClients.push(returnData[i]);
                            }
                            if (callback != null) {
                                callback(availableClients);
                            }
                        }
                    });
                }
            }
            /* Data Loading START */
            function LoadPossibleThemes(callback, forceReload)
            {
                if(forceReload == null)
                {
                forceReload = false;
                }

                if(possibleThemes != null && possibleThemes.length > 0 && forceReload == false)
                {
                    if(callback != null)
                    {
                        callback(possibleThemes);
                    }
                    return possibleThemes;
                }
                else
                {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: false,
                        data: {
                            lib: "flex",
                            cmd: "getAGameThemeList",
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function (data) {
                            let returnData = JSON.parse(data.aGameThemeList);
                            possibleThemes.length = 0;
                            for (let i = 0; i < returnData.length; i++) {
                                possibleThemes.push(returnData[i]);
                            }
                            if (callback != null) {
                                callback(possibleThemes);
                            }
                        }
                    });
                }
            }
            function LoadPossiblePositions(callback, forceReload)
            {
                if(forceReload == null)
                {
                forceReload = false;
                }

                if(possiblePositions != null && possiblePositions.length > 0 && forceReload == false)
                {
                    if(callback != null)
                    {
                        callback(possiblePositions);
                    }
                    return possiblePositions;
                }
                else
                {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: false,
                        data: {
                            lib: "flex",
                            cmd: "getAllAGameDefaultPositions",
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function (data) {
                            let returnData = JSON.parse(data.defaultPositionsList);
                            possiblePositions.length = 0;
                            for (let i = 0; i < returnData.length; i++) {
                                possiblePositions.push(returnData[i]);
                            }
                            let overallWinner = new Object();
                            overallWinner.ThemeId = -1;
                            overallWinner.Id = -9999;
                            overallWinner.PositionName = "League Overall";
                            overallWinner.Name = overallWinner.PositionName;

                    possiblePositions.push(overallWinner);
                    if (callback != null) {
                        callback(possiblePositions);
                    }
                        }
                    });
                }
            }
            function LoadPossiblePositionsForTheme(callback, themeId)
            {
                if(themeId == null)
                {
                    let selectedTheme = $("#trophyEditorTrophyTheme", element).val();
                    let themeObject = possibleThemes.find(t => t.ThemeTag == selectedTheme);
                    if(themeObject != null)
                    {
                        themeId = themeObject.Id;
                    }
                }
                let themePositions = possiblePositions.filter(t => t.ThemeId == themeId || t.ThemeId < 0);
                $("#trophyEditorTrophyPosition", element).empty();
                $("#trophyEditorTrophyPosition", element).append($("<option />", {text:"Select Position", value:""}));

                    $(themePositions).each(function(){
                        $("#trophyEditorTrophyPosition", element).append($("<option />", {text: this.Name, value: this.Id }));
                    });
                if(callback != null)
                {
                    callback();
                }
            }
            function LoadDropdownOptions(loadType)
            {
                if(loadType == null || loadType == "")
                {
                    loadType = "ALL";
                }
                let loadAll = (loadType.toLowerCase() == "all");
                if(loadAll || loadType.toLowerCase() == "client")
                {
                    $("#trophyEditorClient", element).empty();
                    $("#trophyEditorClient", element).append($("<option />", {text:"Global", value:"0"}));

                    $(availableClients).each(function(){
                        $("#trophyEditorClient", element).append($("<option />", {text:this.Name, value:this.ClientNumber}));                        
                    });
                }


                if(loadAll || loadType.toLowerCase() == "theme")
                {
                    $("#trophyEditorTrophyTheme", element).empty();
                    $("#trophyEditorTrophyTheme", element).append($("<option />", {text:"Select Theme", value:""}));
                    $(possibleThemes).each(function(){
                        $("#trophyEditorTrophyTheme", element).append($("<option />", {text:this.Name, value:this.ThemeTag.toLowerCase()}));                        
                    });
                }
                if(loadAll || loadType.toLowerCase() == "positions")
                {
                    $("#trophyEditorTrophyPosition", element).empty();
                    $("#trophyEditorTrophyPosition", element).append($("<option />", {text:"Select Position", value:""}));

                    $(possiblePositions).each(function(){                    
                        $("#trophyEditorTrophyPosition", element).append($("<option />", {text: this.Name, value: this.Id }));
                    });
                }
                if(loadAll || loadType.toLowerCase() == "rank")
                {
                    $("#trophyEditorTrophyRank", element).empty();
                    $("#trophyEditorTrophyRank", element).append($("<option />", {text:"Select Rank", value:""}));

                    $(possibleRanks).each(function(){
                        $("#trophyEditorTrophyRank", element).append($("<option />", {text:this.name, value:this.value}));
                    });
                }
            }
            function LoadTrophies()
            {
                GetTrophies(function(trophyList){
                    RenderTrophies(null, trophyList);
                });
            }
            /* Data Loading END */
            /* Page Procedures START */
            function GetTrophies(callback, forceReload)
            {
                if(forceReload == null)
                {
                    forceReload = false;
                }
                if(possibleTrophies != null && possibleTrophies.length > 0 && forceReload == false)
                {
                    if(callback != null)
                    {
                        callback(possibleTrophies);
                    }
                    return possibleTrophies;
                }
                else
                {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: false,
                        data: {
                            lib: "selfserve",
                            cmd: "getAllAvailableTrophies",
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function (data) {
                            let returnData = JSON.parse(data.trophiesList);
                            possibleTrophies.length = 0;
                            for (let i = 0; i < returnData.length; i++) {
                                possibleTrophies.push(returnData[i]);
                            }
                            if (callback != null) {
                                callback(possibleTrophies);
                            }
                        }
                    });
                }
            }
            function RenderTrophies(callback, listToRender)
            {
                if(listToRender == null)
                {
                    listToRender = possibleTrophies;
                }

                let trophyHolder = $("<div class=\"trophy-list-data-holder\" />");
                if(listToRender != null && listToRender.length > 0)
                {
                    for(let tIndex = 0; tIndex < listToRender.length; tIndex++)
                    {
                        let trophyItem = listToRender[tIndex];
                        let trophyAwardKey = trophyItem.TrophyAwardKey;

                        let theme = "general";
                        let position = "unknown";
                        let rank = 0;
                        if(trophyAwardKey != null)
                        {
                            let keySplit = trophyAwardKey.split("_");
                            theme = keySplit[0];
                            position = keySplit[1];
                            rank = keySplit[2];
                        }
                        let currentItemThemeObject = possibleThemes.find(i => i.ThemeTag.toLowerCase() == theme.toLowerCase());
                        
                        let trophyRowHolder = $("<div class=\"trophy-item-data-row-holder\" />");
                        let trophyDataHolder = $("<div class=\"trophy-item-all-data-holder\" />");
                        let trophyDataColumn1 = $("<div class=\"trophy-item-data-holder column1of4\" />");
                        let trophyDataColumn2 = $("<div class=\"trophy-item-data-holder column234of4\" />");

                        let trophyBackgroundHolder = $("<div class=\"trophy-item-background-holder\" />");
                        trophyBackgroundHolder.append("&nbsp;");

                        if(currentItemThemeObject != null)
                        {
                            $(trophyBackgroundHolder).css("background", "url('" + currentItemThemeObject.ThemeBackgroundImage + "')");

                        }
                        let trophyImageHolder = $("<div class=\"trophy-inline-item-holder trophy-image\" />");
                        let trophyImage = $("<img class=\"trophy-manager-trophy-image\" src=\"" + baseImageUrl + trophyItem.ImageUrl + "\" />");
                        trophyImageHolder.append(trophyImage);

                        

                        let trophyIdHolder = $("<div class=\"trophy-id\" />");
                        let trophyId = trophyItem.Id;

                        trophyIdHolder.append(trophyId);

                        let trophyClientHolder = $("<div class=\"\" />");
                        let clientName = "Global";
                        if(trophyItem.Client != 0)
                        {
                            clientName = trophyItem.Client;
                        }
                        trophyClientHolder.append(clientName);

                        let trophyNameHolder = $("<div class=\"trophy-name\" />");
                        trophyNameHolder.append(trophyItem.Name);

                        let trophyStatusHolder = $("<div class=\"\" />");
                        let trophyStatusName = "Active";
                        if(trophyItem.IsActive == false)
                        {
                            trophyStatusName = "Inactive";
                        }
                        trophyStatusHolder.append(trophyStatusName);

                        let trophyStartEndDateHolder = $("<div class=\"\" />");
                        let trophyStartEndDate = "";
                        if(trophyItem.TrophyAwardStartDate != null)
                        {
                            trophyStartEndDate = new Date(trophyItem.TrophyAwardStartDate).toLocaleDateString();
                        }
                        if(trophyItem.TrophyAwardEndDate != null)
                        {
                            trophyStartEndDate += " - " + new Date(trophyItem.TrophyAwardEndDate).toLocaleDateString();
                        }

                        trophyStartEndDateHolder.append(trophyStartEndDate);

                        let trophyButtonHolder = $("<div class=\"\" />");
                        let editButton = $("<button id=\"btnEditTrophy_" + trophyItem.Id + "\"><i class=\"fa fa-edit\"></i></button>");
                        editButton.off("click").on("click", function(){
                            let buttonId = this.id;
                            let trophyId = buttonId.split("_")[1];
                            LoadEditorForm(function(){
                                ShowEditorForm();
                            }, trophyId);
                            
                        });
                        trophyButtonHolder.append(editButton);
                        
                        trophyDataColumn1.append(trophyImageHolder);
                        trophyDataColumn1.append(trophyButtonHolder);
                        
                        trophyDataColumn2.append(trophyIdHolder);
                        trophyDataColumn2.append(trophyClientHolder);
                        trophyDataColumn2.append(trophyNameHolder);
                        trophyDataColumn2.append(trophyStatusHolder);
                        trophyDataColumn2.append(trophyStartEndDateHolder);

                        trophyDataHolder.append(trophyDataColumn1);
                        trophyDataHolder.append(trophyDataColumn2);

                        trophyBackgroundHolder.append(trophyDataHolder);

                        trophyRowHolder.append(trophyBackgroundHolder);

                        trophyHolder.append(trophyRowHolder);
                    }
                }
                else
                {
                    trophyHolder.append("No Trophies found");
                }

                $("#currentTrophyList", element).empty();
                $("#currentTrophyList", element).append(trophyHolder);

                if(callback != null)
                {
                    callback();
                }
            }
            function ConstructTrophyData()
            {
                let selectedTheme = $("#trophyEditorTrophyTheme", element).val();
                let selectedPosition = $("#trophyEditorTrophyPosition", element).val();
                let selectedRank = $("#trophyEditorTrophyRank", element).val();
                let themeObject = possibleThemes.find(t => t.ThemeTag == selectedTheme);
                let positionObject = possiblePositions.find(t => t.PositionId == selectedPosition);
                let rankObject = possibleRanks.find(r => r.value == selectedRank);
                let trophyAwardKey = "";
                let trophyFullName = "";

                if(themeObject != null && positionObject != null && rankObject != null)
                {
                    trophyAwardKey = ("{theme}_{position}_{rank}").replace("{theme}", selectedTheme).replace("{position}", positionObject.Name.replace(" ", "")).replace("{rank}", rankObject.value);
                    trophyFullName = ("{themeName} - {positionName} - {rankName}").replace("{themeName}", themeObject.Name).replace("{positionName}", positionObject.Name).replace("{rankName}", rankObject.name);
                }
                
                if(trophyAwardKey != null && trophyAwardKey != "")
                {
                    $("#trophyEditorTrophyAwardKey", element).val(trophyAwardKey);
                }
                if(trophyFullName != null && trophyFullName != "")
                {
                    $("#trophyEditorTrophyFullName", element).val(trophyFullName);
                }
            }
            function ClearEditorForm(callback)
            {
                $("#trophyEditorTrophyId", element).val("-1");
                $("#trophyEditorClient", element).val("0");
                $("#trophyEditorTrophyFullName", element).val("");
                $("#trophyEditorTrophyDesc", element).val("");
                $("#trophyEditorDisplayName", element).val("");
                $("#trophyEditorIsActive", element).prop("checked", false);
                $("#trophyEditorTrophyAwardStartDate", element).val("");
                $("#trophyEditorTrophyAwardEndDate", element).val("");
                $("#trophyEditorTrophyTheme", element).val("");
                $("#trophyEditorTrophyPosition", element).val("");
                $("#trophyEditorTrophyRank", element).val("");
                $("#trophyEditorTrophyAwardKey", element).val("");
                $("#trophyEditorImageUrl", element).val("");

                if(callback != null)
                {
                    callback();
                }

            }
            function LoadEditorForm(callback, idToLoad)
            {
                let trophyObject = possibleTrophies.find(t => t.TrophyId == idToLoad);
                if(trophyObject != null)
                {
                    $("#trophyEditorTrophyId", element).val(trophyObject.TrophyId);
                    $("#trophyEditorClient", element).val(trophyObject.Client);
                    $("#trophyEditorTrophyFullName", element).val(trophyObject.TrophyName);
                    $("#trophyEditorTrophyDesc", element).val(trophyObject.TrophyDesc);
                    $("#trophyEditorDisplayName", element).val(trophyObject.DisplayName);
                    $("#trophyEditorIsActive", element).prop("checked", trophyObject.IsActive);
                    if(trophyObject.TrophyAwardStartDate != null)
                    {
                        $("#trophyEditorTrophyAwardStartDate", element).val(new Date(trophyObject.TrophyAwardStartDate).toLocaleDateString());
                    }
                    if(trophyObject.TrophyAwardEndDate != null)
                    {
                        $("#trophyEditorTrophyAwardEndDate", element).val(new Date(trophyObject.TrophyAwardEndDate).toLocaleDateString());
                    }
                    let awardKey = trophyObject.TrophyAwardKey;
                    if(awardKey != null && awardKey != "")
                    {
                        let awardKeyArray = awardKey.split("_");
                        $("#trophyEditorTrophyTheme", element).val(awardKeyArray[0].toLowerCase());
                        let positionObject = possiblePositions.find(p => p.Name.toLowerCase().replace(" ", "") == awardKeyArray[1].toLowerCase());
                        if(positionObject != null)
                        {
                            $("#trophyEditorTrophyPosition", element).val(positionObject.PositionId);
                        }

                        $("#trophyEditorTrophyRank", element).val(awardKeyArray[2]);
                        $("#trophyEditorTrophyAwardKey", element).val(awardKey);
                    }
                    if(trophyObject.ImageUrl != null && trophyObject.ImageUrl != "")
                    {
                        $("#trophyEditorTrophyImage", element).prop("src", baseImageUrl + trophyObject.ImageUrl); 
                    }
                    $("#trophyEditorImageUrl", element).val(trophyObject.ImageUrl);
                }


                if(callback != null)
                {
                    callback();
                }
            }

            /* Page Procedures END */
            /* Hide/Show START */
            function HideAll() {
                HideEditorForm();            }
            function HideEditorForm()
            {
                $("#trophyEditorFormHolder", element).hide();                
            }
            function ShowEditorForm()
            {
                $("#trophyEditorFormHolder", element).show();                
            }
            /* Hide/Show END */
            scope.load = function () {
                scope.Initialize();
                LoadTrophies();
            };
            scope.load(); //TODO: Remove once we get the event handlers in place.
        }
    };
}]);

