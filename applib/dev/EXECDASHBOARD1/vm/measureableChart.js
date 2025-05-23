angularApp.directive("ngMeasureableChart", ['api', '$rootScope', function (api, $rootScope) {
    return {
        templateUrl: a$.debugPrefix() + '/applib/dev/EXECDASHBOARD1/view/measureableChart.htm?' + Date.now(),
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
        link: function (scope, element, attrs, legacyContainer) {
            var possibleMeasureableItems = [];
            var measureablesToRender = [];
            var currentSelectedMeasureableScores = [];

            var chartColors = [
                "cyan",
                "hotpink",
                "blue",
                "lime",
                "orange",
                "#AEAEAE",
                "#006600",
                "#CC0000"
            ]

            scope.Initialize = function () {
                LoadPossibleMeasureables();
                LoadDefaultColors();
                $("#chartDisplayType", element).val("Percentage");
                $("#chkIncludeLogins", element).prop("checked", false);
                $("#chkIncludeBalScore", element).prop("checked", true);
            };
            function isInvisbileColor(value) {
                let returnValue = true;
                returnValue = (
                    value.toUpperCase() == "white".toUpperCase() ||
                    value.toUpperCase() == "transparent".toUpperCase() ||
                    value.toUpperCase() == "#FFFFFF".toUpperCase()
                );
                return returnValue;
            }
            function LoadDefaultColors() {
                let perfColors = a$.WindowTop().apmPerformanceColors;
                if(perfColors != null && perfColors.length > 0)
                {
                    for(let cIndex = 0; cIndex < perfColors.length;cIndex++)
                    {
                        if(perfColors[cIndex].color != null && perfColors[cIndex].color != "")
                        {
                            chartColors[cIndex]= perfColors[cIndex].color;
                        }
                    }
                }
                else
                {
                    appLib.getConfigParameterByName("DEFAULT_COLOR_1", function (paramObject) {
                        if (paramObject != null && !isInvisbileColor(paramObject.ParamValue)) {
                            chartColors[0] = paramObject.ParamValue;
                        }
                    });
                    appLib.getConfigParameterByName("DEFAULT_COLOR_2", function (paramObject) {
                        if (paramObject != null && !isInvisbileColor(paramObject.ParamValue)) {
                            chartColors[1] = paramObject.ParamValue;
                        }
                    });
                    appLib.getConfigParameterByName("DEFAULT_COLOR_3", function (paramObject) {
                        if (paramObject != null && !isInvisbileColor(paramObject.ParamValue)) {
                            chartColors[2] = paramObject.ParamValue;
                        }
                    });
                    appLib.getConfigParameterByName("DEFAULT_COLOR_4", function (paramObject) {
                        if (paramObject != null && !isInvisbileColor(paramObject.ParamValue)) {
                            chartColors[3] = paramObject.ParamValue;
                        }
                    });
                    appLib.getConfigParameterByName("DEFAULT_COLOR_5", function (paramObject) {
                        if (paramObject != null && !isInvisbileColor(paramObject.ParamValue)) {
                            chartColors[4] = paramObject.ParamValue;
                        }
                    });
                }
                
            }
            function LoadPossibleMeasureables(forceReload, callback) {
                if (forceReload == null) {
                    forceReload = false;
                }

                if (!forceReload && possibleMeasureableItems != null && possibleMeasureableItems.length > 0) {
                    if (callback != null) {
                        callback(possibleMeasureableItems);
                    }
                    else {
                        return possibleMeasureableItems;
                    }
                }
                else {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: false,
                        data: {
                            lib: "selfserve",
                            cmd: "getAllMeasureableItems"
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function (data) {
                            let measureablesList = JSON.parse(data.measureableItemsList);
                            possibleMeasureableItems.length = 0;
                            possibleMeasureableItems = measureablesList;
                            if (callback != null) {
                                callback(measureablesList);
                            }
                        }
                    });
                }
            }
            function LoadMeasurebleLists() {
                if (possibleMeasureableItems != null && possibleMeasureableItems.length > 0) {

                    $("#measureItem1", element).empty();
                    $("#measureItem2", element).empty();
                    $("#measureItem3", element).empty();
                    $("#measureItem4", element).empty();
                    $("#measureItem5", element).empty();

                    let emptyOption = $("<option />", { text: "Select Option", value: "" });

                    $("#measureItem1", element).append(emptyOption.clone());
                    $("#measureItem2", element).append(emptyOption.clone());
                    $("#measureItem3", element).append(emptyOption.clone());
                    $("#measureItem4", element).append(emptyOption.clone());
                    $("#measureItem5", element).append(emptyOption.clone());

                    let listToRender = possibleMeasureableItems;
                    listToRender = SortMeasuresablesList(listToRender);

                    for (let cntr = 0; cntr < listToRender.length; cntr++) {
                        let item = listToRender[cntr];
                        if (item.IsStaticDisplayItem != true) {

                            let itemOption = $("<option />", { text: item.Name, value: item.MeasureableCode });
                            $("#measureItem1", element).append(itemOption.clone());
                            $("#measureItem2", element).append(itemOption.clone());
                            $("#measureItem3", element).append(itemOption.clone());
                            $("#measureItem4", element).append(itemOption.clone());
                            $("#measureItem5", element).append(itemOption.clone());
                        }
                    }

                }
            }
            function SortMeasuresablesList(listToSort, fieldToSort) {
                let sortedList = listToSort;
                switch (fieldToSort?.toLowerCase()) {
                    case "code":
                        sortedList = sortedList.sort((a, b) => a.MeasureableCode < b.MeasureableCode ? -1 : 0);
                        break;
                    default:
                        sortedList = sortedList.sort((a, b) => a.Name < b.Name ? -1 : 0);
                        break;
                }


                return sortedList;
            }
            function HandlesMeasureItemsForChart(callback) {
                measureablesToRender.length = 0;
                $("select[id^='measureItem']", element).each(function () {
                    let measureCode = $(this).val();
                    if (measureCode != null && measureCode != "") {
                        let measureItem = possibleMeasureableItems.find(item => item.MeasureableCode == measureCode);

                        if (measureItem != null) {
                            if (measureablesToRender.findIndex(i => i == measureItem.MeasureableCode) < 0) {
                                measureablesToRender.push(measureItem.MeasureableCode);
                            }
                        }
                    }
                });

                if (callback != null) {
                    callback();
                }
            }
            function RenderMeasureableChartInformation(callback) {
                let chartObject = CollectChartDataToRender();
                Highcharts.chart("measureableChartHolder", chartObject);
                if (callback != null) {
                    callback();
                }
            }
            function CollectChartDataToRender() {
                let addStaticOptions = true;
                let categoryList = [];
                let seriesData = [];
                let initialData = [];
                let chartValueDisplayType = $("#chartDisplayType", element).val();
                let numberDisplayFormat = GetNumberDisplayFormat(chartValueDisplayType);
                for (let i = 31; i > 0; i--) {
                    categoryList.push(i.toString());
                    initialData.push(null);
                }
                let seriesName = "";
                if (measureablesToRender.length == 0) {
                    LoadCurrentScoresForMeasureable();
                }
                else {
                    for (let mc = 0; mc < measureablesToRender.length; mc++) {
                        let dataItem = measureablesToRender[mc];
                        let dataOption = possibleMeasureableItems.find(i => i.MeasureableCode == dataItem);
                        if (seriesName != dataOption.Name) {
                            seriesName = dataOption.Name;
                        }

                        let chartData = new Object();
                        chartData.color = chartColors[mc];
                        chartData.name = seriesName;
                        chartData.dashStyle = "Dash";
                        chartData.data = initialData.map(a => { return { ...a } });

                        LoadCurrentScoresForMeasureable(dataOption.MeasureableCode);
                        let scoreOptions = currentSelectedMeasureableScores.filter(i => i.MeasureableItemCode == dataOption.MeasureableCode);
                        for (let so = 0; so < scoreOptions.length; so++) {
                            let scoreItem = scoreOptions[so];
                            let dataIndex = scoreItem.ItemScoreCount;
                            dataIndex = (chartData.data.length - (dataIndex + 1)); //flip the data to show most recent on right of chart
                            chartData.data[dataIndex] = GetScoreToDisplayInChart(scoreItem, chartValueDisplayType);
                        }
                        seriesData.push(chartData);
                    }
                }
                if (addStaticOptions == true) {
                    AddStaticMeasureablesToSeriesData(seriesData, initialData, chartValueDisplayType);
                }
                let chartObject = new Object();
                chartObject.chart = new Object();
                chartObject.chart.type = "line";
                chartObject.title = new Object();
                chartObject.title.text = "Measurable Comparisons";
                chartObject.series = seriesData;
                chartObject.xAxis = new Object();
                chartObject.xAxis.title = new Object();
                chartObject.xAxis.title.text = "# of days ago";
                chartObject.xAxis.categories = categoryList;
                chartObject.yAxis = new Object();
                //chartObject.yAxis.min = 0;
                //chartObject.yAxis.max = 100;
                //chartObject.yAxis.tickInterval = 25;
                chartObject.yAxis.rotation = 270;
                chartObject.yAxis.title = new Object();
                chartObject.yAxis.title.text = "";
                chartObject.legend = new Object();
                chartObject.legend.layout = "horizontal";
                chartObject.legend.align = "center";
                chartObject.legend.verticalAlign = "bottom";
                chartObject.legend.floating = false;
                chartObject.plotOptions = new Object();
                chartObject.plotOptions.series = new Object();
                chartObject.plotOptions.series.connectNulls = true;
                chartObject.plotOptions.series.dataLabels = new Object();
                chartObject.plotOptions.series.dataLabels.enabled = true;
                //TODO: Handle the displaying of the information formatting
                chartObject.plotOptions.series.dataLabels.format = numberDisplayFormat;
                chartObject.drilldown = new Object();

                return chartObject;
            }
            function AddStaticMeasureablesToSeriesData(seriesDataObject, initalDataArray, chartValueDisplayType) {
                if (chartValueDisplayType == null) {
                    chartValueDisplayType = $("#chartDisplayType", element).val();
                }

                let includeLogins = $("#chkIncludeLogins", element).is(":checked");
                let includeBalancedScore = $("#chkIncludeBalScore", element).is(":checked");
                //logins
                if (includeLogins) {
                    let loginChartData = new Object();
                    loginChartData.color = chartColors[5];
                    loginChartData.name = "Logins";
                    //loginChartData.dashStyle = "Dash";
                    loginChartData.dashStyle = "Solid";
                    loginChartData.data = initalDataArray.map(a => { return { ...a } });
                    let scoreOptions = currentSelectedMeasureableScores.filter(i => i.MeasureableItemCode.toLowerCase() == "login");
                    for (let so = 0; so < scoreOptions.length; so++) {
                        let scoreItem = scoreOptions[so];
                        let dataIndex = scoreItem.ItemScoreCount;
                        dataIndex = (loginChartData.data.length - (dataIndex + 1)); //flip the data to show most recent on right of chart
                        loginChartData.data[dataIndex] = GetScoreToDisplayInChart(scoreItem, chartValueDisplayType);
                    }
                    seriesDataObject.push(loginChartData);
                }

                //balanced score
                if (includeBalancedScore) {
                    let balanceScoreChartData = new Object();
                    balanceScoreChartData.color = chartColors[6];
                    balanceScoreChartData.name = "Balanced Score";
                    balanceScoreChartData.dashStyle = "Solid";
                    balanceScoreChartData.data = initalDataArray.map(a => { return { ...a } });

                    scoreOptions = currentSelectedMeasureableScores.filter(i => i.MeasureableItemCode.toLowerCase() == "balscore");
                    for (let so = 0; so < scoreOptions.length; so++) {
                        let scoreItem = scoreOptions[so];
                        let dataIndex = scoreItem.ItemScoreCount;
                        dataIndex = (balanceScoreChartData.data.length - (dataIndex + 1)); //flip the data to show most recent on right of chart
                        balanceScoreChartData.data[dataIndex] = GetScoreToDisplayInChart(scoreItem, chartValueDisplayType);
                    }
                    seriesDataObject.push(balanceScoreChartData);
                }


                return seriesDataObject;
            }
            function LoadCurrentScoresForMeasureable(measureableCode, callback) {
                let returnList = [];
                if (measureableCode == null || measureableCode == "") {
                    measureableCode = "balscore";
                    currentSelectedMeasureableScores.length = 0;
                }
                if (currentSelectedMeasureableScores != null && currentSelectedMeasureableScores.length > 0) {
                    returnList = currentSelectedMeasureableScores.filter(i => i.MeasureableItemCode == measureableCode);
                    if (returnList.length > 0 && callback != null) {
                        callback(returnList);
                    }
                }

                if (returnList != null && returnList.length == 0) {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: false,
                        data: {
                            lib: "selfserve",
                            cmd: "getMeasureableScoreItemsForMeasureable",
                            measureableCode: measureableCode
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function (data) {
                            var measureableScoreList = JSON.parse(data.measureableScoreList);
                            returnList = measureableScoreList;
                            for (let i = 0; i < measureableScoreList.length; i++) {
                                let item = measureableScoreList[i];
                                let idx = currentSelectedMeasureableScores.findIndex(li => li.Id == item.Id && li.MeasureableItemCode == item.MeasureableItemCode);
                                if (idx < 0) {
                                    currentSelectedMeasureableScores.push(measureableScoreList[i]);
                                }
                            }
                            if (callback != null) {
                                callback(measureableScoreList);
                            }
                            else {
                                return returnList;
                            }
                        }
                    });
                }

            }
            function GetScoreToDisplayInChart(scoringItem, displayType) {
                let returnValue = 0.00;
                if (displayType == null) {
                    displayType = "Percentage";
                }
                switch (displayType.toLowerCase()) {
                    case "score":
                        returnValue = scoringItem.ScoreValue;
                        break;
                    case "standard":
                        returnValue = scoringItem.StandardValue;
                        break;
                    default:
                        returnValue = scoringItem.ScorePercentage;
                        break;
                }
                return returnValue;
            }
            function GetNumberDisplayFormat(chartDisplayType) {
                let returnFormat = "{point.y: .2f}";
                switch (chartDisplayType.toLowerCase()) {
                    case "percentage":
                        returnFormat = "{point.y: .2f}%";
                        break;
                }
                return returnFormat;
            }
            scope.load = function () {
                scope.Initialize();
                $("select[id^='measureItem']", element).off("change").on("change", function () {
                    HandlesMeasureItemsForChart(function () {
                        RenderMeasureableChartInformation();
                    });
                });
                $("#resetChart", element).off("click").on("click", function () {
                    measureablesToRender.length = 0;
                    $("select[id^='measureItem']", element).each(function () {
                        $(this).val("");
                    });
                    RenderMeasureableChartInformation();
                });
                $("#chartDisplayType", element).off("change").on("change", function () {
                    RenderMeasureableChartInformation();
                });
                $("#refreshChart", element).off("click").on("click", function(){
                    RenderMeasureableChartInformation();
                });
                $("#chkIncludeLogins", element).off("change").on("change", function(){
                    RenderMeasureableChartInformation();
                });
                $("#chkIncludeBalScore", element).off("change").on("change", function(){
                    RenderMeasureableChartInformation();
                });
                LoadMeasurebleLists();

                $("#resetChart", element).click();
            };

            scope.load();
            
            ko.postbox.subscribe("measureableChartLoad", function () {
                scope.load();
            });
        }
    };
}]);