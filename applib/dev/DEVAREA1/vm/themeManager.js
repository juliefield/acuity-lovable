angularApp.directive("ngThemeManager", ['api', '$rootScope', function(api, $rootScope) {
    return {
        templateUrl: a$.debugPrefix() + '/applib/dev/DEVAREA1/view/themeManager.htm?' + Date.now(),
        scope: {
            assoc: "@",
            text: "@",
            details: "@",
            cid: "@",
            filters: "@",
            panel: "@",
            hidetopper: "@",
            toppertext: "@"
        },
        require: '^ngLegacyContainer',
        link: function(scope, element, attrs, legacyContainer) {
    
            var themeOptionsType = "themes";

            scope.Initialize = function() {                
                
                scope.IsDevModeOn = (legacyContainer.scope.TP1Role == "Admin");
                HideAll();
                HideUserStatus();
                scope.ThemeOptions = [];
                scope.FinshTypeOptions = [];
                scope.ThemeTypeOptions = [];
                scope.GameUnitOptions = [];                

                scope.LoadFinishTypeOptions();
                scope.LoadThemeTypeOptions();
                scope.LoadGameUnitOptions();
                scope.LoadThemeOptions();
            };
    
            scope.LoadThemeOptions = function(){                
                GetAllThemeOptions(function(data){1
                    scope.LoadScopeOptions(data, themeOptionsType, function(){
                        LoadThemeList();
                    });
                });                
            };

            scope.LoadScopeOptions = function(data, type, callback)
            {
                WriteAdminStatus("scope.LoadScopeOptions()");
                switch(type)
                {
                    case themeOptionsType:
                        var themes = $.parseJSON(data.themesList);    
                        scope.ThemeOptions.length = 0;
                        if (themes != null) {
                            for (var i = 0; i < themes.length; i++) {
                                scope.ThemeOptions.push(themes[i]);
                            }
                        }
                        break;
                }
                if(callback != null)
                {
                    callback();
                }
            }

            function LoadDataList(listTypeToLoad)
            {
                WriteAdminStatus("LoadDataList()");
                var loadAll = (listTypeToLoad.toLowerCase() == "all");
                var listToLoad = "";
                var arrayToLoad = [];

                if(listTypeToLoad == "themes" || loadAll)
                {
                    if ($(".theme-selector", element) != null) {
                        $(".theme-selector", element).empty();
                        $(".theme-selector", element).append($('<option />', { value: "", text: "" }));
                        for (var i = 0; i < scope.ThemeOptions.length; i++) {
                            var item = scope.ThemeOptions[i];
                            $(".theme-selector", element).append($('<option />', { value: item.ThemeId, text: item.Name }));
                        }
                    }
                }
                if(listTypeToLoad == "finishtypes" || loadAll)
                {
                    if ($(".theme-editor-finish-type", element) != null) {
                        $(".theme-editor-finish-type", element).empty();
                        $(".theme-editor-finish-type", element).append($('<option />', { value: "", text: "" }));
                        for (var i = 0; i < scope.FinshTypeOptions.length; i++) {
                            var item = scope.FinshTypeOptions[i];
                            $(".theme-editor-finish-type", element).append($('<option />', { value: item.FinishTypeId, text: item.FinishTypeName }));
                        }
                    }
                }
                if(listTypeToLoad == "themetypes" || loadAll)
                {
                    if ($(".theme-editor-theme-type", element) != null) {
                        $(".theme-editor-theme-type", element).empty();
                        $(".theme-editor-theme-type", element).append($('<option />', { value: "", text: "" }));
                        for (var i = 0; i < scope.ThemeTypeOptions.length; i++) {
                            var item = scope.ThemeTypeOptions[i];
                            $(".theme-editor-theme-type", element).append($('<option />', { value: item.ThemeTypeId, text: item.ThemeTypeName }));
                        }
                    }
                }
                if(listTypeToLoad == "gameunits" || loadAll)
                {
                    if ($(".theme-editor-game-unit", element) != null) {
                        $(".theme-editor-game-unit", element).empty();
                        $(".theme-editor-game-unit", element).append($('<option />', { value: "", text: "" }));
                        for (var i = 0; i < scope.GameUnitOptions.length; i++) {
                            var item = scope.GameUnitOptions[i];
                            $(".theme-editor-game-unit", element).append($('<option />', { value: item.GameUnitId, text: item.Name }));
                        }
                    }
                }
            }

            function LoadThemeList()
            {
                for (var i = 0; i < scope.ThemeOptions.length; i++) {
                    WriteThemeItem(scope.ThemeOptions[i]);
                }
            }
            function WriteThemeItem(item)
            {
                let theme = item;
                
                var themeItem = $("<div  class=\"theme-list-item-holder\">");
                var themeName = $("<div class=\"theme-list-item-name\" />");
                themeName.append(theme.Name);

                var themeType = $("<div  class=\"theme-list-item-finish-type\">");
                let finishTypeName = theme.FinishTypeId;
                if(theme.FinishTypeIdSource != null)
                {
                    finishTypeName = theme.FinishTypeIdSource.FinishTypeName;                    
                }
                themeType.append($("<label />").append(finishTypeName));
                

                var themeLeaderboardImage = $("<div class=\"theme-list-item-board-image-holder\" />");
                var image = $("<img class=\"theme-list-item-board-image\" />");
                let imgSrc = theme.ThemeBoardDisplayImageName
                
                if((imgSrc == null ||imgSrc == "") && theme.ThemeLeaderboardDisplayImageName != null && theme.ThemeLeaderboardDisplayImageName != "")
                {
                    imgSrc = theme.ThemeLeaderboardDisplayImageName;
                }
                if(imgSrc == "")
                {
                    imgSrc = "/3/ng/Agameflex/images/game-bg-default-leaderboard.jpg"
                }

                let imageSource = a$.debugPrefix() + imgSrc;
                image.prop("src", imageSource);
                
                themeLeaderboardImage.append(image)                

                var themeItemButtonHolder = $("<div class=\"theme-list-item-button-holder\">");                
                var editThemeButton = $("<input type=\"button\" value=\"Edit\" class=\"theme-list-item-button\" />");
                $(editThemeButton).off("click").on("click", function(){
                    scope.LoadThemeEditor(theme.ThemeId);
                });

                themeItemButtonHolder.append(editThemeButton);
                themeItem.append(themeLeaderboardImage);                
                themeItem.append(themeName);
                themeItem.append(themeType);
                themeItem.append(themeItemButtonHolder);

                $(".theme-list-holder", element).append(themeItem);
                
            }

            scope.LoadFinishTypeOptions = function()
            {
                GetAllFinishTypeOptions(function(data){
                    let options = $.parseJSON(data.finishTypeList);
                    scope.FinshTypeOptions.length = 0;

                    if(options != null)
                    {
                        for(var i = 0; i < options.length; i++)
                        {
                            scope.FinshTypeOptions.push(options[i]);
                        }
                    }
                    LoadDataList("finishtypes");
                });
            };

            function GetAllThemeOptions(callback)
            {
                WriteAdminStatus("GetAllThemeOptions()");                
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "flex",
                        cmd: "getThemeList"
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function(data){                        
                        if(callback != null)
                        {
                            callback(data);
                        }
                    }
                });
            }
            scope.LoadThemeTypeOptions = function()
            {
                GetAllThemeTypeOptions(function(data){
                    let options = $.parseJSON(data.themeTypesList);
                    scope.ThemeTypeOptions.length = 0;

                    if(options != null)
                    {
                        for(var i = 0; i < options.length; i++)
                        {
                            scope.ThemeTypeOptions.push(options[i]);
                        }
                    }
                    LoadDataList("themetypes");
                });
            };

            scope.LoadGameUnitOptions = function()
            {
                GetAllGameUnitOptions(function(data){
                    let options = $.parseJSON(data.gameUnitList);
                    scope.GameUnitOptions.length = 0;

                    if(options != null)
                    {
                        for(var i = 0; i < options.length; i++)
                        {
                            scope.GameUnitOptions.push(options[i]);
                        }
                    }
                    LoadDataList("gameunits");
                });
            }

            function GetAllFinishTypeOptions(callback)
            {
                WriteAdminStatus("GetAllFinishTypeOptions()");
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "flex",
                        cmd: "getFinishTypeList",
                        isdevmode:scope.IsDevModeOn
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function(data){
                        if(callback != null)
                        {
                            callback(data);
                        }
                    }
                });
            }
            function GetAllThemeTypeOptions(callback)
            {
                WriteAdminStatus("GetAllThemeTypeOptions()");
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "flex",
                        cmd: "getThemeTypeList",
                        isdevmode:scope.IsDevModeOn
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function(data){
                        if(callback != null)
                        {
                            callback(data);
                        }
                    }
                });
            }
            function GetAllGameUnitOptions(callback)
            {
                WriteAdminStatus("GetAllGameUnitOptions()");
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "flex",
                        cmd: "getGameUnitList",
                        isdevmode:scope.IsDevModeOn
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function(data){
                        if(callback != null)
                        {
                            callback(data);
                        }
                    }
                });
            }
    
            scope.LoadThemeEditor = function(idToLoad, callback){                
                scope.GetThemeById(idToLoad, function(data){
                    var themeInfo = $.parseJSON(data.themeItem);
                    if(themeInfo != null)
                    {
                        $(".theme-editor-theme-id").val(themeInfo.ThemeId);
                        $(".theme-editor-theme-name").val(themeInfo.Name);
                        $(".theme-editor-finish-type").val(themeInfo.FinishTypeId);
                        $(".theme-editor-board-spaces").val(themeInfo.ThemePositions);
                        $(".theme-editor-game-unit").val(themeInfo.GameUnitId);
                        $(".theme-editor-theme-stutus").val(themeInfo.Status);
                        $(".theme-editor-max-participants").val(themeInfo.MaxParticipantNumber);
                        $(".theme-editor-board-image").val(themeInfo.ThemeBoardDisplayImageName);
                        $(".theme-editor-leaderboard-image").val(themeInfo.ThemeLeaderboardDisplayImageName);
                        $(".theme-editor-tag-name").val(themeInfo.ThemeTagName);
                        $(".theme-editor-has-animation").prop("checked", themeInfo.HasAnimation);
                        
                        $(".theme-editor-animation-name").val(themeInfo.AnimationName);
                        $(".theme-editor-theme-type").val(themeInfo.ThemeTypeId);
                        $(".theme-editor-short-name").val(themeInfo.ShortName);
                        if(themeInfo.ThemeBoardDisplayImageName != null && themeInfo.ThemeBoardDisplayImageName != "")
                        {
                            let imageSource = a$.debugPrefix() + themeInfo.ThemeBoardDisplayImageName;
                            $(".theme-editor-board-image-preview").prop("src", imageSource);                            
                        }
                        else
                        {
                            $(".theme-editor-board-image-preview").prop("src", "");
                        }
                        if(themeInfo.ThemeLeaderboardDisplayImageName != null && themeInfo.ThemeLeaderboardDisplayImageName != "")
                        {
                            let imageSource = a$.debugPrefix() + themeInfo.ThemeLeaderboardDisplayImageName;

                            
                            $(".theme-editor-leaderboard-image-preview").prop("src", imageSource);                            
                        }
                        else
                        {
                            $(".theme-editor-leaderboard-image-preview").prop("src", "");
                        }
                        
                        $(".theme-editor-requires-scoring-basis").prop("checked", themeInfo.RequiresScoringBasis);
                        $(".theme-editor-requires-ending-point-total").prop("checked", themeInfo.RequiresEndingPointTotal);
                        $(".theme-editor-is-scoring-option-available").prop("checked", themeInfo.IsCalculateScoreOptionAvailable);  
                        $(".theme-editor-require-letter-phrase").prop("checked", themeInfo.RequiresPhraseValue);
                    }
                    ShowItem(".theme-editor-holder");

                    if(callback != null)
                    {
                        callback();
                    }    
                });
            };

            scope.GetThemeById = function(id, callback)
            {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "flex",
                        cmd: "getThemeById",
                        themeid: id
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

            scope.ClearThemeEditor = function(callback){                
                
                $(".theme-editor-theme-id").val("");
                $(".theme-editor-theme-name").val("");
                $(".theme-editor-finish-type").val("");
                $(".theme-editor-board-spaces").val("");
                $(".theme-editor-game-unit").val("");
                $(".theme-editor-theme-status").val("");
                $(".theme-editor-max-participants").val("");
                $(".theme-editor-board-image").val("");
                $(".theme-editor-leaderboard-image").val("");
                $(".theme-editor-tag-name").val("");
                $(".theme-editor-animation-name").val("");
                $(".theme-editor-theme-type").val("");
                $(".theme-editor-short-name").val("");
                $(".theme-editor-requires-scoring-basis").prop("checked", false);
                $(".theme-editor-requires-ending-point-total").prop("checked",false);
                $(".theme-editor-has-animation").prop("checked", false);
                $(".theme-editor-is-scoring-option-available").prop("checked", false);  
                $(".theme-editor-board-image-preview").prop("src", "");
                $(".theme-editor-leaderboard-image-preview").prop("src", "");
                $(".theme-editor-require-letter-phrase").prop("checked", false);

                if(callback != null)
                {
                    callback();
                }
                else{
                    HideItem(".theme-editor-holder");
                }
            };

            scope.SaveEditForm = function()
            {
                var themeObject = CollectFormDataForTheme();
                if(themeObject != null)
                {
                    scope.SaveTheme(themeObject, function(){
                        HideItem(".theme-editor-holder");
                        HideUserStatus();
                    });
                }
            };

            function CollectFormDataForTheme()
            {
                var returnObject = new Object();

                returnObject.ThemeId = parseInt($(".theme-editor-theme-id").val());
                returnObject.Name = $(".theme-editor-theme-name").val();
                returnObject.ShortName = $(".theme-editor-short-name").val();
                returnObject.FinishTypeId = parseInt($(".theme-editor-finish-type").val());
                returnObject.ThemePositions = parseInt($(".theme-editor-board-spaces").val());
                returnObject.GameUnitId = parseInt($(".theme-editor-game-unit").val());
                returnObject.Status =  $(".theme-editor-theme-stutus").val();
                returnObject.MaxParticipantNumber = parseInt($(".theme-editor-max-participants").val());
                returnObject.ThemeLeaderboardDisplayImageName = $(".theme-editor-leaderboard-image").val();
                returnObject.ThemeBoardDisplayImageName = $(".theme-editor-board-image").val();
                returnObject.ThemeTagName = $(".theme-editor-tag-name").val();
                returnObject.HasAnimation = $(".theme-editor-has-animation").is(":checked");
                returnObject.AnimationName = $(".theme-editor-animation-name").val();
                returnObject.RequiresScoringBasis = $(".theme-editor-requires-scoring-basis").is(":checked");
                returnObject.RequiresEndingPointTotal =  $(".theme-editor-requires-ending-point-total").is(":checked");
                returnObject.RequiresPhraseValue = $(".theme-editor-require-letter-phrase").is(":checked");
                returnObject.ThemeTypeId = parseInt( $(".theme-editor-theme-type").val());
                returnObject.EnterDate = new Date().toLocaleDateString("en-US");
                returnObject.EnterBy = legacyContainer.scope.TP1Username;

                returnObject.IsCalculateScoreOptionAvailable = $(".theme-editor-is-scoring-option-available").is(":checked");                
                return returnObject;
            }

            scope.SaveTheme = function(themeObject, callback){

                if (themeObject != null) {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: true,
                        data: {
                            lib: "flex",
                            cmd: "saveThemeInfo",
                            themeinfo: JSON.stringify(themeObject)
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
            };

            scope.load = function() {                
                WriteAdminStatus("scope.Load()");
                scope.Initialize();
                
                $(".theme-add-new-btn").off("click").on("click", function(){
                    WriteAdminStatus("Add a new theme");
                    scope.LoadThemeEditor();
                });
                
                $(".theme-save-btn").off("click").on("click", function(){
                    WriteUserStatus("saving Theme");
                    scope.SaveEditForm();
                });
                $(".theme-cancel-btn").off("click").on("click", function(){
                    scope.ClearThemeEditor(function(){
                        HideItem(".theme-editor-holder");
                    });
                });
                
            };
            scope.load();
        }
    };
    }]);