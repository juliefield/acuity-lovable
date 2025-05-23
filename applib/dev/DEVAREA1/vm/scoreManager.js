angularApp.directive("ngScoreManager", ['api', '$rootScope', function(api, $rootScope) {
    return {
        templateUrl: a$.debugPrefix() + '/applib/dev/DEVAREA1/view/scoreManager.htm?' + Date.now(),
        scope: {
            assoc: "@",
            text: "@",
            details: "@",
            cid: "@",
            filters: "@",
            panel: "@",
            hidetopper: "@",
            toppertext: "@",
            continousscoringranges: "@",
            displaychart: "@"
        },
        require: '^ngLegacyContainer',
        link: function(scope, element, attrs, legacyContainer) {
            scope.ContinousScoringRanges = true;
            scope.DisplayChart = false;
            scope.ScoringTypeOption = null;
            scope.LoadId = -1;


            scope.Initialize = function() {
                scope.CurrentScoringRanges = [];
                if(attrs.continousscoringranges != null || attrs.continousScoringRanges != null || attrs.ContinousScoringRanges != null)
                {
                    if(attrs.continousscoringranges == "false" || attrs.continousScoringRanges == "false" || attrs.ContinousScoringRanges == "false")
                    {
                        scope.ContinousScoringRanges =  false;
                    }
                }
                if(attrs.displaychart != null || attrs.displayChart != null || attrs.DisplayChart != null)
                {
                    scope.DisplayChart = (attrs.displaychart == "true" || attrs.displayChart == "true" || attrs.DisplayChart == "true");
                }
                if(attrs.scoringtypeoption != null || attrs.scoringTypeOption != null || attrs.ScoringTypeOption != null)
                {
                    scope.ScoringTypeOption = attrs.scoringtypeoption || attrs.scoringTypeOption || attrs.ScoringTypeOption;
                }
                if(attrs.loadid != null || attrs.loadId != null || attrs.LoadId != null)
                {
                    scope.LoadId = attrs.loadid || attrs.loadId || attrs.LoadId;
                }
            };
    
            function LoadScoreManager()
            {
                LoadScoringRanges(function(){
                    DisplayRangesChart()
                    DisplayScoringRanges();                    
                });
            }
            function LoadScoringRanges(callback)
            {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "selfserve",
                        cmd: "getScoringRangeOptionList",
                        scoringtypeoption: scope.ScoringTypeOption,
                        loadid: scope.LoadId
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        scope.CurrentScoringRanges.length = 0;
                        var scoringRanges = $.parseJSON(data.scoringRangeOptionList);
                        if(scoringRanges != null)
                        {
                            for(var i = 0 ; i < scoringRanges.length; i++)
                            {
                                scope.CurrentScoringRanges.push(scoringRanges[i]);
                            }
                        }                        
                        if(callback != null)
                        {
                            callback();
                        }
        
                    }
                }); 
                
            }

            function DisplayRangesChart()
            {
                if(scope.DisplayChart == true)
                {
                    $(".score-manager-chart-holder", element).empty();             
                    let chartDataHolder = $("<div class=\"scoring-manager-chart-holder\" />");
                    chartDataHolder.append("Chart Information here.");
                    $(".score-manager-chart-holder", element).show();
                }
                else
                {
                    $(".score-manager-chart-holder", element).hide();
                }
            }
            function DisplayScoringRanges()
            {
                let defaultSortColumn = "Points";
                let defaultSortOrder = "ASC";
                let scoringRangePointHeaderText = "Points";
                let scoringRangeLowValueHeaderText = "Low";
                let scoringRangeHighValueHeaderText = "High";

                $(".score-manager-high-low-editor-holder", element).empty();
                let scoringRangeDataHolder = $("<div class=\"scoring-range-data-holder\" />");                
                if(scope.CurrentScoringRanges != null && scope.CurrentScoringRanges.length > 0)
                {
                    let scoringRangeHeaderRowHolder = $("<div class=\"data-header-holder\" />");
                    let scoringRangePointHeader = $("<div class=\"scoring-manager-header-item scoring-range-data-point\" />");
                    let scoringRangePointHeaderArrowHolder =$("<span id=\"scoringManagerSortArrow_Points\" />");
                    scoringRangePointHeader.append(scoringRangePointHeaderText);                    

                    if(defaultSortColumn == scoringRangePointHeaderText)
                    {
                        scoringRangePointHeaderArrowHolder.append("&nbsp; <i class=\"fad fa-sort-up\"></i>");                    
                    }
                    
                    scoringRangePointHeader.append(scoringRangePointHeaderArrowHolder);                    
                    
                    
                    $(scoringRangePointHeader, element).off("click").on("click", function(){                        
                        HandleHeaderClickSorting("Points", scoringRangeDataHolder);
                    });
                    let scoringRangeLowHeader = $("<div class=\"scoring-manager-header-item scoring-range-data-low\" />");
                    scoringRangeLowHeader.append(scoringRangeLowValueHeaderText + " Value");
                    let scoringRangeLowHeaderArrowHolder = $("<span id=\"scoringManagerSortArrow_Low\" />");

                    if(defaultSortColumn == scoringRangeLowValueHeaderText)
                    {
                        scoringRangeLowHeaderArrowHolder.append("&nbsp; <i class=\"fad fa-sort-up\"></i>");                    
                    }
                    scoringRangeLowHeader.append(scoringRangeLowHeaderArrowHolder);                    

                    $(scoringRangeLowHeader, element).off("click").on("click", function(){
                        HandleHeaderClickSorting("Low", scoringRangeDataHolder);
                    });
                    let scoringRangeHighHeader = $("<div class=\"scoring-manager-header-item scoring-range-data-high\" />");
                    scoringRangeHighHeader.append(scoringRangeHighValueHeaderText + " Value");
                    let scoringRangeHighHeaderArrowHolder = $("<span id=\"scoringManagerSortArrow_High\" />");
                    if(defaultSortColumn == scoringRangeHighValueHeaderText)
                    {
                        scoringRangeHighHeaderArrowHolder.append("&nbsp; <i class=\"fad fa-sort-up\"></i>");                    
                    }
                    scoringRangeHighHeader.append(scoringRangeHighHeaderArrowHolder);     

                    $(scoringRangeHighHeader, element).off("click").on("click", function(){
                        HandleHeaderClickSorting("High", scoringRangeDataHolder);
                    });
                    let scoringRangeButtonHeader = $("<div class=\"scoring-manager-header-item scoring-range-data-buttons\" />");
                    scoringRangeButtonHeader.append("&nbsp;");
                    let sortOrder = $("<input type=\"hidden\" id=\"scoringManagerSortOrder\" value=\"" + defaultSortOrder + "\" />");
                    let sortColumn = $("<input type=\"hidden\" id=\"scoringManagerSortColumn\" value=\"" + defaultSortColumn + "\" />");
                    scoringRangeButtonHeader.append(sortOrder)
                    scoringRangeButtonHeader.append(sortColumn)

                    scoringRangeHeaderRowHolder.append(scoringRangePointHeader);
                    scoringRangeHeaderRowHolder.append(scoringRangeLowHeader);
                    scoringRangeHeaderRowHolder.append(scoringRangeHighHeader);
                    scoringRangeHeaderRowHolder.append(scoringRangeButtonHeader);


                    scoringRangeDataHolder.append(scoringRangeHeaderRowHolder);
                    SortScoringRanges();
                    
                    BuildScoringRangeItemRows(scoringRangeDataHolder);
                }
                else
                {
                    scoringRangeDataHolder.append("No scoring ranges found.");
                }

                $(".score-manager-high-low-editor-holder", element).append(scoringRangeDataHolder);
                HideScoreRangeEditor();
            }

            function BuildScoringRangeItemRows(scoringRangeDataHolder)
            {
                $(".data-row-holder", scoringRangeDataHolder).remove();

                for(var i=0;i<scope.CurrentScoringRanges.length;i++)
                {
                    let item = scope.CurrentScoringRanges[i];
                    let nextItem = scope.CurrentScoringRanges[i+1];

                    let scoringRangeDataRowHolder = $("<div class=\"data-row-holder\" />");

                    let scoringRangePointsValueHolder = $("<div class=\"scoring-manager-data-item scoring-range-data-point\" />");
                    
                    let scoringRangePointValueLabel = $("<label id=\"scoringRowEditorPointLabel_" + item.ScoringRangeId + "\" />");
                    scoringRangePointValueLabel.append(item.ScoringPointsValue);
                    
                    let scoringRangePointValueInput = $("<input id=\"scoringRowEditorPointValue_" + item.ScoringRangeId + "\" class=\"scoring-manager-data-item-edit-range\" />");
                    scoringRangePointValueInput.val(item.ScoringPointsValue);
                    
                    scoringRangePointsValueHolder.append(scoringRangePointValueLabel);
                    scoringRangePointsValueHolder.append(scoringRangePointValueInput);
                    
                    let scoringRangeLowRangeHolder = $("<div class=\"scoring-manager-data-item scoring-range-data-low\" />");
                    
                    let scoringRangeLowRangeLabel = $("<label id=\"scoringRowEditorLowLabel_" + item.ScoringRangeId + "\" />");
                    scoringRangeLowRangeLabel.append(item.RangeLowValue);
                    let scoringRangeLowRangeInput = $("<input id=\"scoringRowEditorLowValue_" + item.ScoringRangeId + "\" class=\"scoring-manager-data-item-edit-range\" />");
                    scoringRangeLowRangeInput.val(item.RangeLowValue);
                    
                    $(scoringRangeLowRangeLabel, element).off("click").on("click", function(){     
                        ShowScoreRangeEditor(item.ScoringRangeId);
                    });
                                            
                    scoringRangeLowRangeHolder.append(scoringRangeLowRangeLabel);
                    scoringRangeLowRangeHolder.append(scoringRangeLowRangeInput);
                    
                    let scoringRangeHighRangeHolder = $("<div class=\"scoring-manager-data-item scoring-range-data-high\" />");

                    let scoringRangeHighRangeLabel = $("<label id=\"scoringRowEditorHighLabel_" + item.ScoringRangeId + "\" />");
                    let scoringRangeHighRangeInput = $("<input id=\"scoringRowEditorHighValue_" + item.ScoringRangeId + "\" class=\"scoring-manager-data-item-edit-range\" />");
                    let highValue = item.RangeHighValue ||  "";
                    
                    scoringRangeHighRangeLabel.append(highValue);
                    scoringRangeHighRangeInput.val(highValue);

                    scoringRangeHighRangeHolder.append(scoringRangeHighRangeLabel);
                    scoringRangeHighRangeHolder.append(scoringRangeHighRangeInput);

                    let scoringRangeButtonHolder = $("<div class=\"scoring-manager-data-item scoring-range-data-buttons\" />");

                    let deleteRangeButton = $("<button id=\"scoringRangeEditorDeleteButton_" + item.ScoringRangeId + "\"><i class=\"fad fa-trash\"></i></button>");
                    $(deleteRangeButton, element).off("click").on("click", function(){
                        let buttonId = this.id;
                        let idSelected = buttonId.split('_')[1];     
                        ConfirmDeleteScoringRange(idSelected, function(){
                            DeleteScoringRange(idSelected, function(){
                                LoadScoringRanges(function(){
                                    DisplayScoringRanges();
                                });
                            });
                        });
                    });
                    let cancelRangeButton = $("<button id=\"scoringRangeEditorCancelButton_" + item.ScoringRangeId + "\"><i class=\"fa fa-times\"></i></button>");;
                    $(cancelRangeButton, element).off("click").on("click", function(){
                        let buttonId = this.id;
                        let idSelected = buttonId.split('_')[1];                             
                        HideScoreRangeEditor(idSelected, function(){
                            DisplayScoringRanges();
                        });
                    });
                    let saveRangeButton = $("<button id=\"scoringRangeEditorSaveButton_" + item.ScoringRangeId + "\" ><i class=\"fad fa-save\"></i></button>");
                    $(saveRangeButton, element).off("click").on("click", function(){
                        let buttonId = this.id;
                        let idSelected = buttonId.split('_')[1];     
                        let scoringObject = GetScoringRangeObjectFromForm(idSelected);
                        ValidateScoringRangeEditorForm(scoringObject, function(){
                            SaveScoringRangeEditorForm(scoringObject, function(){
                                LoadScoringRanges(function(){
                                    DisplayScoringRanges();
                                });
                                HideScoreRangeEditor(idSelected, function(){
                                    DisplayRangesChart();
                                });
                            });
                        });
                    });

                    scoringRangeButtonHolder.append(saveRangeButton);
                    scoringRangeButtonHolder.append("&nbsp;");
                    scoringRangeButtonHolder.append(cancelRangeButton);
                    scoringRangeButtonHolder.append("&nbsp;");
                    scoringRangeButtonHolder.append(deleteRangeButton);

                    scoringRangeDataRowHolder.append(scoringRangePointsValueHolder);
                    scoringRangeDataRowHolder.append(scoringRangeLowRangeHolder);
                    scoringRangeDataRowHolder.append(scoringRangeHighRangeHolder);
                    scoringRangeDataRowHolder.append(scoringRangeButtonHolder);

                    scoringRangeDataHolder.append(scoringRangeDataRowHolder);

                }                
                BuildScoringRangeFooterRow(scoringRangeDataHolder);
                HideScoreRangeEditor();
            }

            function SortScoringRanges(sortColumn)
            {
                let sortOrder = "ASC";
                sortOrder = $("#scoringManagerSortOrder", element).val() || "ASC";
                let iconClass = "fa-sort-up";

                if(sortOrder == "DESC")
                {
                    iconClass = "fa-sort-down";
                }

                switch(sortColumn)
                {
                    case "Points":
                        if(sortOrder == "ASC")
                        {
                            scope.CurrentScoringRanges.sort((a, b) => a.ScoringPointsValue - b.ScoringPointsValue);
                        }
                        else
                        {
                            scope.CurrentScoringRanges.sort((a, b) => b.ScoringPointsValue - a.ScoringPointsValue);
                        }
                        break;
                    case "Low":
                        if(sortOrder == "ASC")
                        {
                            scope.CurrentScoringRanges.sort((a, b) => a.RangeLowValue - b.RangeLowValue);
                        }
                        else
                        {
                            scope.CurrentScoringRanges.sort((a, b) => b.RangeLowValue - a.RangeLowValue);
                        }    
                    break;
                    case "High":
                        if(sortOrder == "ASC")
                        {
                            scope.CurrentScoringRanges.sort((a, b) => a.RangeHighValue - b.RangeHighValue);
                        }
                        else
                        {
                            scope.CurrentScoringRanges.sort((a, b) => b.RangeHighValue - a.RangeHighValue);
                        }    
                        break;
                    default:
                        sortColumn = "Points";
                        scope.CurrentScoringRanges.sort((a, b) => a.ScoringPointsValue - b.ScoringPointsValue);
                        break;
                }
            
                $("span[id^='scoringManagerSortArrow_']", element).empty();
                $("#scoringManagerSortArrow_" + sortColumn, element).empty();
                $("#scoringManagerSortArrow_" + sortColumn, element).append("&nbsp;<i class=\"fad " + iconClass + "\"></i>");
            }

            function BuildScoringRangeFooterRow(scoringRangeDataHolder)
            {
                $(".data-footer-holder", scoringRangeDataHolder).empty();
                let scoringRangeFooterHolder = $("<div class=\"data-footer-holder\" />");
                let addScoringRangePointsHolder = $("<div class=\"scoring-manager-data-item-add scoring-range-data-point\" />");
                let addScoringRangePoints = $("<input id=\"scoringRowAddPointValue_0\" class=\"scoring-manager-data-item-edit-range\" />");

                addScoringRangePointsHolder.append(addScoringRangePoints);

                let addScoringRangeLowRangeHolder = $("<div class=\"scoring-manager-data-item-add scoring-range-data-low\" />");
                let addScoringRangeLowValue = $("<input id=\"scoringRowAddLowValue_0\" class=\"scoring-manager-data-item-edit-range\" />");

                addScoringRangeLowRangeHolder.append(addScoringRangeLowValue);

                let addScoringRangeHighRangeHolder = $("<div class=\"scoring-manager-data-item-add scoring-range-data-high\" />");
                let addScoringRangeHighValue = $("<input id=\"scoringRowAddHighValue_0\" class=\"scoring-manager-data-item-edit-range\"/>");

                addScoringRangeHighRangeHolder.append(addScoringRangeHighValue);

                let addScoringRangeButtonHolder = $("<div class=\"scoring-manager-data-item-add scoring-range-data-buttons\" />");

                let addScoringRangeButtonSave = $("<button id=\"scoringRangeAddButton_0\"><i class=\"fad fa-save\"></i></button>");
                
                $(addScoringRangeButtonSave, element).off("click").on("click", function(){
                    let buttonId = this.id;
                    let idSelected = buttonId.split('_')[1]; 
                    let newScoringRangeOption = CollectNewScoringRangeInformation();

                    ValidateScoringRangeEditorForm(newScoringRangeOption, function(){
                        SaveScoringRangeEditorForm(newScoringRangeOption, function(){
                            LoadScoringRanges(function(){
                                DisplayScoringRanges();
                            });
                            HideScoreRangeEditor(null, function(){
                                DisplayRangesChart();
                            });
                            ClearAddScoringRangesForm();
                        });    
                    });

                });


                addScoringRangeButtonHolder.append("&nbsp;&nbsp;");
                addScoringRangeButtonHolder.append(addScoringRangeButtonSave);
                

                scoringRangeFooterHolder.append(addScoringRangePointsHolder);
                scoringRangeFooterHolder.append(addScoringRangeLowRangeHolder);
                scoringRangeFooterHolder.append(addScoringRangeHighRangeHolder);
                scoringRangeFooterHolder.append(addScoringRangeButtonHolder);

                scoringRangeDataHolder.append(scoringRangeFooterHolder);
            }

            function HandleHeaderClickSorting(sortValue, dataHolder)
            {
                let currentSort = $("#scoringManagerSortColumn", element).val();
                
                if(currentSort == sortValue)
                {
                    if($("#scoringManagerSortOrder", element).val() == "ASC")
                    {
                        $("#scoringManagerSortOrder", element).val("DESC");
                    }
                    else
                    {
                        $("#scoringManagerSortOrder", element).val("ASC");
                    }
                }
                else
                {
                    $("#scoringManagerSortColumn", element).val(sortValue);
                    $("#scoringManagerSortOrder", element).val("ASC");
                }

                SortScoringRanges(sortValue);                    
                BuildScoringRangeItemRows(dataHolder);
            }
            function ShowScoreRangeEditor(id, callback)
            {
                if(id != null)
                {
                    $("input[id^='scoringRowEditor']", element).each(function(){                                        
                        let itemId = this.id;
                    
                        if(id != null && itemId.endsWith("_" + id))
                        {
                            $(this).show();
                            $("#" + itemId.replace("Value", "Label"), element).hide();   
                            
                        }
                    });
                    $("#scoringRangeEditorSaveButton_" + id, element).show();
                    $("#scoringRangeEditorCancelButton_" + id, element).show();
                }

                if(callback != null)
                {
                    callback();
                }
            }
            function HideScoreRangeEditor(id, callback)
            {
                $("input[id^='scoringRowEditor']", element).each(function(){                    
                    if(id == null)
                    {
                        $(this).hide();                        
                    }
                    else
                    {
                        let itemId = this.id;
                    
                        if(id != null && itemId.endsWith("_" + id))
                        {
                            $(this).hide();
                            $("#" + itemId.replace("Value", "Label"), element).show();   
                        }
                    }
                });

                if(id == null)
                {
                    $("button[id^='scoringRangeEditorSaveButton_']", element).hide();
                    $("button[id^='scoringRangeEditorCancelButton_']", element).hide();
                }
                else
                {
                    $("#scoringRangeEditorSaveButton_" + id, element).hide();
                    $("#scoringRangeEditorCancelButton_" + id, element).hide();
                }
                

                if(callback != null)
                {
                    callback();
                }
            }
            function ValidateScoringRangeEditorForm(scoringRangeObject, callback)
            {
                console.log("ValidateScoringRangeEditorForm()");
                if(callback != null)
                {
                    callback();
                }
            }
            
            function CollectNewScoringRangeInformation()
            {
                let returnObject = new Object();

                returnObject.ScoringRangeId = -1;
                returnObject.TableIdentifierId = scope.LoadId;
                returnObject.ScoringPointsValue = $("#scoringRowAddPointValue_0", element).val();
                returnObject.RangeLowValue = $("#scoringRowAddLowValue_0", element).val();
                returnObject.RangeHighValue = $("#scoringRowAddHighValue_0", element).val();
                returnObject.EntBy = legacyContainer.scope.TP1Username;
                returnObject.EntDt = new Date().toLocaleDateString("en-US");

                return returnObject;
            }
            function ClearAddScoringRangesForm()
            {
                $("#scoringRowAddPointValue_0",element).val("");
                $("#scoringRowAddLowValue_0",element).val("");
                $("#scoringRowAddHighValue_0",element).val("");
            }
            function ConfirmDeleteScoringRange(inputId, callback)
            {
                let scoringRange = scope.CurrentScoringRanges.find(i => i.ScoringRangeId == inputId);
                let scoringRangeName = "";
                if(scoringRange != null)
                {
                    scoringRangeName = "scoring range worth " + scoringRange.ScoringPointsValue + " point(s)";
                    scoringRangeName += " having a low value of " + scoringRange.RangeLowValue;     
                    if(scoringRange.RangeHighValue != null)
                    {
                        scoringRangeName += " and a high value of " + scoringRange.RangeHighValue;
                    }            
                    else
                    {
                        scoringRangeName += " and no high value";
                    }
                }

                if(confirm("You are about to delete " + scoringRangeName + ".  It can not be undone.  Press OK to proceed."))
                {
                    callback();
                }
            }
            function DeleteScoringRange(inputId, callback)
            {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "selfserve",
                        cmd: "deleteScoringRangeOption",
                        scoringtypeoption: scope.ScoringTypeOption,
                        scoringrangeid: inputId
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {                            
                        if(callback != null)
                        {
                            callback();
                        }            
                   }
                });
            }
            function SaveScoringRangeEditorForm(scoringRangeObject, callback)
            {
                if(scoringRangeObject != null)
                {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: false,
                        data: {
                            lib: "selfserve",
                            cmd: "saveScoringRangeOption",
                            scoringtypeoption: scope.ScoringTypeOption,
                            scoringrangeoption: JSON.stringify(scoringRangeObject)
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function (data) {                            
                            if(callback != null)
                            {
                                callback();
                            }            
                       }
                    });
                }
            }

            function GetScoringRangeObjectFromForm(inputId)
            {
                let inputIndex = scope.CurrentScoringRanges.findIndex(i=> i.ScoringRangeId == inputId);
                let returnObject = new Object();
                returnObject.ScoringRangeId = inputId;
                returnObject.TableIdentifierId = scope.CurrentScoringRanges[inputIndex].TableIdentifierId;
                returnObject.ScoringPointsValue = $("#scoringRowEditorPointValue_" + inputId, element).val();
                returnObject.RangeLowValue = $("#scoringRowEditorLowValue_" + inputId, element).val();
                returnObject.RangeHighValue = $("#scoringRowEditorHighValue_" + inputId, element).val();

                if(inputIndex >= 0)
                {
                    returnObject.EntBy = scope.CurrentScoringRanges[inputIndex].EntBy;
                    returnObject.EntDt = scope.CurrentScoringRanges[inputIndex].EntDt;    
                    returnObject.UpdBy = legacyContainer.scope.TP1Username;
                    returnObject.UpdDt = new Date().toLocaleDateString("en-US");
                }
                else
                {
                    returnObject.EntBy = legacyContainer.scope.TP1Username;
                    returnObject.EntDt = new Date().toLocaleDateString("en-US");
                }
                
                return returnObject;
            }

            scope.load = function() {
                scope.Initialize();
                LoadScoreManager();
                $(".score-manager-header-refresh-button", element).off("click").on("click", function(){
                    LoadScoreManager();
                });
            };
            scope.load();
        }
    };
    }]);