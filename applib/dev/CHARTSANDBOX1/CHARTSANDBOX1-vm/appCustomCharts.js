(function () {
    if (!window.jQuery) { console.log("This App requires jQuery"); return; }
    var $ = window.jQuery;

    function process(chart, elem) {

        // o member contains everything about the chart.
        var fields = [];
        $(".header", chart.o.tableSelector[0]).each(function () {
            fields.push({ name: $(this).html() });
        });
        var idx = 0;
        let recordCount = 0;
        $("tbody td", chart.o.tableSelector[0]).each(function () {
            if (idx < fields.length) { //There are support fields in the table
                fields[idx++].value = $(this).html();
                recordCount++;
            }
        });
        console.log(fields);
        console.log("elem:" + JSON.stringify(elem));
        
        var bld = "";
        let customChartClass = "rpt-customchart";
        switch (chart.type) {
            case "chartSidekickTouchQualityBubbles":

                var dataScopeValue = GetValueForField(fields, "DataScope", "Team");

                bld = '<div class="touchquality-box">';
                bld += '<div class="touchquality-title"><p>Touch Quality Score</p></div>';
                bld += '<div class="touchquality-scores">';
                bld += '<div class="touchquality-scores_col">';
                bld += '<div class="touchquality-scores_circle circle-teal">';
                bld += GetValueForField(fields, "TouchQualityTeam", 0);
                bld += '</div>';
                bld += 'My ' + dataScopeValue;
                bld += '</div>';
                bld += '<div class="touchquality-scores_col">';
                bld += '<div class="touchquality-scores_circle blue-gray-circle">';
                bld += GetValueForField(fields, "TouchQualityOverall", 0);
                bld += '</div>';
                bld += 'All ' + dataScopeValue;
                bld += '</div>';
                bld += '</div>';
                bld += '<div class="touchquality-stats">';
                bld += '<div class="touchquality-stats_col">';
                bld += '<span>' + GetValueForField(fields, "TotalTouchesTeam", 0) + '</span>';
                bld += 'Entries</div>';
                bld += '<div class="touchquality-stats_col">';
                bld += '<span>' + GetValueForField(fields, "TouchResponsesTeam", 0) + '</span>';
                bld += 'Ratings</div>';
                bld += '<div class="touchquality-stats_col">';
                bld += '<span>' + GetValueForField(fields, "ResponsePercentageFormattedTeam", 0) + '</span>';
                bld += 'Ratio</div></div>';
                if (a$.urlprefix() == "km2.") {
                    bld += '<div style="font-size:9.0px;color:#8b0000;margin:0;text-align:center;display:block;">Touch Quality Score does not include auto-generated Journal Entries or Performance Review. These counts are included in the Touch Count and Touch Rank.</span>';
                }
                bld += '</div>';
                break;
            case "userDashboardScoringChart":
                bld += "<div class=\"user-scores-box\">";
                bld += "<div class=\"user-dashboard-data\">";
                bld += "<div class=\"user-dashboard-data-balanced-score-holder\">";
                bld += "<div class=\"user-dashboard-balanced-score-title\">Balanced Score</div>";
                bld += "<div class=\"user-dashboard-balanced-score-value\">";
                bld += parseFloat(GetValueForField(fields, "CurrentBalancedScore", 0)).toFixed(2);
                bld += "</div>";
                bld += "</div>";
                bld += "<hr >";
                bld += "<div class=\"user-dashboard-data-relative-rank-holder\">";
                bld += "<div class=\"user-dashboard-data-team-rank-holder\">";
                bld += "<div class=\"user-dashboard-team-rank-value team-bubble-circle\">";
                bld += GetValueForField(fields, "TeamRank", 0) + " of " + GetValueForField(fields, "TeamMemberCount", 0);
                bld += "</div>";
                bld += "<div class=\"user-dashboard-team-rank-label bubble-circle-label\">Team</div>";
                bld += "</div>";
                bld += "<div class=\"user-dashboard-data-location-rank-holder\">";
                bld += "<div class=\"user-dashboard-location-rank-value location-bubble-circle\">";
                bld += GetValueForField(fields, "LocationRank", 0) + " of " + GetValueForField(fields, "LocationMemberCount", 0);
                bld += "</div>";
                bld += "<div class=\"user-dashboard-location-rank-label bubble-circle-label\">Location</div>";
                bld += "</div>";
                bld += "<div class=\"user-dashboard-data-project-rank-holder\">";
                bld += "<div class=\"user-dashboard-project-rank-value project-bubble-circle\">";
                bld += GetValueForField(fields, "ProjectRank", 0) + " of " + GetValueForField(fields, "ProjectMemberCount", 0);
                bld += "</div>";
                bld += "<div class=\"user-dashboard-project-rank-label bubble-circle-label\">Project</div>";
                bld += "</div>";
                bld += "</div>";
                bld += "</div>";
                bld += "</div>";
                break;
            case "execDashboardCurrentGeneral":
                if(recordCount == 0)
                {
                    bld += BuildNoDataFoundExecDashboardReport();
                }
                else
                {
                    bld += BuildOutExecutiveDashboardCurrentReport(fields);
                }
                
                customChartClass = "rpt-exec-dashboard-custom";
                break;
             case "genericBubbles":
                    if(recordCount ==0)
                    {
                        bld += BuildNoDataFoundGenericBubblesReport();
                    }
                    else
                    {
                        bld += BuildGenericBubblesReport(fields);
                    }
                    customChartClass = "rpt-generic-bubbles-custom";
                    break;
            case "coachingEffectivenessBubbles":
                if(recordCount ==0)
                {
                    bld += BuildNoDataFoundGenericBubblesReport();
                }
                else
                {
                    bld += BuildGenericBubblesReport(fields, "Leader Effectiveness Score");
                }
                customChartClass = "rpt-generic-bubbles-custom";
                break;
            case "rankGauge":
                bld += appApmContentTriggers.BuildRankGauge(recordCount,fields);
                break;
            default:
                alert("debug: Custom chart type not found");
        }

        $(chart.o.tableSelector.selector, elem).hide();
        //Defeat highcharts and show the chart.
        $("#" + chart.o.renderTo).html(bld).removeClass("rpt-highchart").addClass(customChartClass).show();

    }

    function GetValueForField(array, key, defaultValue) {
        for (var i = 0; i < array.length; i++) {
            if (array[i].name == key) {
                return array[i].value;
            }
        }
        return defaultValue;
    }

    function BuildOutExecutiveDashboardCurrentReport(fieldsArray)
    {
        let currentMonthInfo = GetValueForField(fieldsArray, "Current Month", "")
        let currentScore = GetValueForField(fieldsArray, "CurScore", 0);
        let previousScore = GetValueForField(fieldsArray, "PrevScore", 0);
        let changeScore = GetValueForField(fieldsArray, "Change", 0);
        let changePctScore = GetValueForField(fieldsArray, "Change %", 0);
        let changePctRaw = GetValueForField(fieldsArray, "ChangePctRaw", 0);
        if(currentScore == null)
        {
            return BuildExecutiveDashboardNoRecords();
        }
        let reportHeaderImage = GetValueForField(fieldsArray, "HeaderImage", "/applib/css/images/executive-dashboard/default-icon.png");
        let changeImage = "/applib/css/images/executive-dashboard/nochange-icon.png";

        if (changePctRaw < 0)
        {
            changeImage = "/applib/css/images/executive-dashboard/arrow-down.png";
        }
        else if (changePctRaw > 0)
        {
            changeImage = "/applib/css/images/executive-dashboard/arrow-up.png";
        }

        let returnValue = "";        
        returnValue += "<div class=\"exec-db-rpt-current-general-holder\">";                
        returnValue += "    <div class=\"exec-db-rpt-holder-background\">";
        returnValue += "        <div class=\"exec-db-rpt-header-holder\">";
        returnValue += "            <div class=\"exec-db-rpt-header-image-holder\">";
        returnValue += "                <img class=\"exec-db-rpt-header-image\" src=\"" + reportHeaderImage + "\" />";
        returnValue += "            </div>";
        returnValue += "            <div class=\"exec-db-rpt-header-text all-upper\">Current Month</div>";
        returnValue += "            <div class=\"exec-db-rpt-header-text current-month-name\">";
        returnValue += currentMonthInfo;
        returnValue += "            </div>";
        returnValue += "        </div>";
        returnValue += "        <div class=\"exec-db-rpt-stats-row-holder\">";        
        returnValue += "            <div class=\"exec-db-rpt-stats-box current-score\">";
        returnValue += "                <div class=\"current-score-value\">";
        returnValue += currentScore
        returnValue += "                </div>";
        returnValue += "                <div class=\"stats-box-label all-upper\">Current</div>";
        returnValue += "            </div>";
        returnValue += "            <div class=\"exec-db-rpt-stats-box previous-score\">";
        returnValue += "                <div class=\"previous-score-value\">";
        returnValue += previousScore
        returnValue += "                </div>";
        returnValue += "                <div class=\"stats-box-label all-upper\">Previous</div>";
        returnValue += "            </div>";
        returnValue += "            <div class=\"exec-db-rpt-stats-box change-score\">";
        returnValue += "                <div class=\"change-image-holder\">";
        returnValue += "                    <img class=\"exec-db-rpt-change-image\" src=\"" + changeImage + "\" />";
        returnValue += "                </div>";
        returnValue += "                <div class=\"change-score\">";
        returnValue += changeScore + " / " + changePctScore;
        returnValue += "                </div>";
        returnValue += "                <div class=\"stats-box-label all-upper\">Change</div>";
        returnValue += "            </div>";
        returnValue += "        </div>";
        returnValue += "    </div>";
        returnValue += "</div>";

        return returnValue;
    }
    function BuildNoDataFoundExecDashboardReport()
    {
        let noDataImage = "/applib/css/images/executive-dashboard/data-graphic.png";

        let returnValue = "";
        returnValue += "<div class=\"exec-db-rpt-current-general-holder no-data-found\">";
        returnValue += "    <div class=\"exec-db-rpt-holder-background no-data-found-background\">";
        returnValue += "        <div class=\"exec-db-rpt-no-data-found-holder\">";
        returnValue += "            <div class=\"exec-db-rpt-no-data-found-text\">";
        returnValue += "                <div class=\"no-data-found-text-line1\">No data found.</div>";
        returnValue += "                <div class=\"no-data-found-text-line2\">Check back soon.</div>";
        returnValue += "            </div>";
        returnValue += "            <div class=\"exec-db-rpt-no-data-found-image-holder\">";
        returnValue += "                <img class=\"no-data-found-image\" src=\"" + noDataImage + "\" />";
        returnValue += "            </div>";
        returnValue += "        </div>";
        returnValue += "    </div>";
        returnValue += "</div>";

        return returnValue;
    }
    function BuildNoDataFoundGenericBubblesReport()
    {
        let noDataImage = "/applib/css/images/executive-dashboard/data-graphic.png";

        let returnValue = "";
        returnValue += "<div class=\"no-data-found\">";
        returnValue += "    <div class=\"no-data-found-background\">";
        returnValue += "        <div class=\"\">";
        returnValue += "            <div class=\"\">";
        returnValue += "                <div class=\"no-data-found-text-line1\">No data found.</div>";
        returnValue += "                <div class=\"no-data-found-text-line2\">Check back soon.</div>";
        returnValue += "            </div>";
        returnValue += "            <div class=\"no-data-found-image-holder\">";
        returnValue += "                <img class=\"no-data-found-image\" src=\"" + noDataImage + "\" />";
        returnValue += "            </div>";
        returnValue += "        </div>";
        returnValue += "    </div>";
        returnValue += "</div>";
        
        return returnValue;
    }
    function BuildGenericBubblesReport(fieldsArray)
    {
        return BuildGenericBubblesReport(fieldsArray, null);
    }

    function BuildGenericBubblesReport(fieldsArray, reportTitle)
    {
        let valueFieldStartKey = "bubble_";
        let allDataFields = fieldsArray.filter(f => f.name.includes(valueFieldStartKey.toLowerCase()));
        //use this to trap some of the older reports that we want to use for general reports.
        if(allDataFields == null ||  allDataFields.length == 0)
        {
            //strip out the start/end dates and use everything else for bubble rendering.
            allDataFields = fieldsArray.filter(f => f.name.toLowerCase() != "startdate".toLowerCase() && f.name.toLowerCase() != "enddate".toLowerCase() && f.name.toLowerCase() != "scope".toLowerCase());
        }
        let startDate = GetValueForField(fieldsArray, "startdate", new Date());
        let endDate = GetValueForField(fieldsArray, "enddate", new Date());
        let reportScope = GetValueForField(fieldsArray, "scope", "");
        
        let returnValue = "";

        returnValue += "<div class=\"generic-bubble-report-holder\">";
        if(reportTitle != null && reportTitle != "")
        {
            returnValue += "<div class=\"report-title-holder\">";
            returnValue += reportTitle;
            returnValue += "</div>";
        }
        returnValue += "<div class=\"all-bubble-holder\">";
        if(allDataFields.length > 0)
        {
            for(let fIndex = 0; fIndex < allDataFields.length; fIndex++)
            {
                let fieldName = allDataFields[fIndex].name.replace(valueFieldStartKey, ""); 
                let scoreValue = allDataFields[fIndex].value;
                
                returnValue += "<div class=\"bubble-holder bubble" + fIndex + "\">";
                
                returnValue += "<div class=\"bubble\">";                
                returnValue += "<div class=\"bubble-value\">";
                if(scoreValue == null || scoreValue == "")
                {
                    returnValue += "--";   
                }
                else
                {
                    returnValue += scoreValue;
                }
                returnValue += "</div>";
                returnValue += "</div>";
                returnValue += "<div class=\"getbubble-text\">";
                if(fieldName.toLowerCase() == "AllScore".toLowerCase())
                {
                    if(reportScope != null && reportScope != "")
                    {
                        if(reportScope.substring(reportScope.length-1) != "s")
                        {
                            reportScope = reportScope + "s";
                        }
                    }
                    fieldName = "All " + reportScope;
                }
                else
                {
                    if(reportScope != null && reportScope != "")
                    {
                        returnValue += reportScope + " ";
                    }
                }
                returnValue += fieldName;
                returnValue += "</div>";
                returnValue += "</div>";
            }
        }
        returnValue += "</div>";
        // returnValue += "<div class=\"bubble-line-holder\">";
        // returnValue += "<hr />";
        // returnValue += "</div>";
        // returnValue += "<div class=\"bubble-date-holder\">";
        // returnValue += new Date(startDate).toLocaleDateString() + " - " + new Date(endDate).toLocaleDateString();
        // returnValue += "</div>";
        returnValue += "</div>";

        return returnValue;
    }

    // global variables
    window.appCustomCharts = {
        process: process
    };
})();

