/************
appApmReport - Report UI Binding module

This module combines these dashboard components into a configrable reporting interface:

CID
    Button  Combo   Menu
Viewport
    Tab Attrition   Report  Home
    Div
Type
    Highchart's Chart
    Grid (new interface which is in the dashboard - should probably be moved).
    Custom Chart?
Filters
    Dashboard (as in model)
    Custom filter sets (like Attition)
    Page (to be compatible with the CDS system)

************/

window.apmChartOptions = {};
window.apmCharts = {};
window.reportsEditor = null;
var FIRSTPASS = true;

var previous_usage = "";

(function () {

    //breakOn(document.getElementById('rdoBase').checked,'checked');

    if (!window.jQuery) {
        alert("This App requires jQuery");
        return;
    }
    var $ = window.jQuery;
    var firsttimeongrid = true;
    var firsttime_attritiontab = true;
    var firsttime_reporttab = true;
    var current_filter = "Agent";

    function nodollar(t) {
        if (t.charAt(0) == '$') {
            return (t.replace('$', ''));
        }
        return t;
    }

    //MADELIVE: Replace this.
    var myTextExtraction = function (node) { //Looking for the html in an anchor or the entire text.
        var a = $(" a", node);
        if (a.length > 0) {
            return nodollar($(a).html());
        }
        else {
            var tl = $(" .report-titlelink", node);
            if (tl.length > 0) {
                return nodollar($(tl).html());
            }
            else {
                return nodollar($(node).html());
            }
        }
    }

    function showReport(cid, sel, displaytype) {
        //TODO: Should displaytype be sent to getreport, or returned?
        //It's currently sent, but may want to change this.
        a$.showprogress("plotprogress");
        a$.ajax({
            type: "GET",
            service: "JScript",
            async: true,
            data: {
                lib: "editor",
                cmd: "getreport",
                performanceColors: window.apmPerformanceColors, //MADELIVE
                devmode: document.getElementById("ReportDeveloperMode").checked,
                grouping: $("#StgReportGrouping select").val(),
                cid: cid,
                dashboard: $("#StgDashboard select").val(),
                displaytype: displaytype,
                context: displaytype,
                rootbuild: true //MADEDEVNOW
            },
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            params: appApmDashboard.viewparams(0, false) + ((document.getElementById("StgInTraining") != null) ? "&InTraining=" + $("#StgInTraining select").val() : ""),
            success: loadedReport
        });
        //TODO: first parameter of viewparams is viewindex, and it's always 0.
        //Does this have meaning going forward?

        function loadedReport(json) {
            a$.hideprogress("plotprogress");
            if (a$.jsonerror(json)) { } else {
                if (json.report.show) {
                    $(".dev-display-reports,.dev-display-reports-controls").hide();
                    if (a$.exists(json.report.editor)) {
                        if (a$.exists(json.report.editor.tagid)) {
                            if (json.report.editor.tagid == "TableSQL") {
                                previous_usage = "MacroWrap";
                            }
                            else if (json.report.editor.tagid == "TableSQL-OuterApply") {
                                previous_usage = "OuterApply";
                            }
                            else if (json.report.editor.tagid == "TableSQL-OuterApplyWrapper") {
                                previous_usage = "OuterApplyWrapper";
                            }
                        }
                        if (a$.exists(json.report.editor.query)) {
                            $(".dev-display-reports").html('<div id="reportsEditor">Formatting...</div>').show();
                            $(".dev-display-reports-controls").show();
                            $(".dev-display-reports-usage").html('<option value="MacroWrap"' + ((previous_usage=="MacroWrap")? ' selected="selected" ':'') + '>Macro Wrapper</option>');
                            $(".dev-display-reports-usage").append('<option value="OuterApply"' + ((previous_usage=="OuterApply")? ' selected="selected" ':'') + '>Outer Apply</option>');
                            $(".dev-display-reports-usage").append('<option value="OuterApplyWrapper"' + ((previous_usage=="OuterApplyWrapper")? ' selected="selected" ':'') + '>Outer Apply Wrapper</option>');
                            for (var i in json.report.editor.queryused) {
                                $(".dev-display-reports-usage").append('<option value="' + i + '">Pass ' + i + '</option>');
                            }
                            $(".dev-display-reports-usage").unbind().bind("change", function() {
                                var val = $(this).val();
                                var leaving = false;
                                if ((val == "MacroWrap") || (val == "OuterApply") || (val == "OuterApplyWrapper")) {
                                    if ((previous_usage == "MacroWrap") || (previous_usage == "OuterApply") || (previous_usage == "OuterApplyWrapper")) {
                                        leaving = true;
                                    }
                                }
                                previous_usage = val;
                                if (leaving) return;

                                window.reportsEditor.setValue("Formatting...");
                                if ((val == "MacroWrap") || (val == "OuterApply") || (val == "OuterApplyWrapper")) {
                                    a$.beautify("sql",json.report.editor.query).then(function(data) {
                                        window.reportsEditor.setValue(data);
                                    });
                                    //$(".dev-display-reports-test").prop('disabled',macros);
                                    //$(".dev-display-reports-save").prop('disabled',macros);
                                    $(".dev-display-reports-test,.dev-display-reports-save").show();
                                }
                                else {
                                    a$.beautify("sql",json.report.editor.queryused[parseInt(val,10)].query).then(function(data) {
                                        window.reportsEditor.setValue(data);
                                    });
                                    $(".dev-display-reports-test,.dev-display-reports-save").hide();
                                }
                            });

                            $(".dev-display-reports-test,.dev-display-reports-save").prop('disabled',false).unbind().bind("click", function() {
                                var sql = window.reportsEditor.getValue();
                                a$.showprogress("plotprogress");
                                //sql = sql.Replace(Convert.ToChar(160).ToString()," ").Replace(Convert.ToChar(19).ToString()," ").replace(/[\r\n]/g," ").replace(/  /g," ");
                                a$.ajax({
                                    type: "POST",
                                    service: "JScript",
                                    async: true,
                                    data: {
                                        lib: "editor",
                                        cmd: "getreport",
                                        performanceColors: window.apmPerformanceColors, //MADELIVE
                                        devmode: true,
                                        grouping: $("#StgReportGrouping select").val(),
                                        testmode: true,
                                        savequery: $(this).hasClass("dev-display-reports-save"),
                                        usage: $(".dev-display-reports-usage").eq(0).val(),
                                        cid: cid,
                                        sql: sql,
                                        dashboard: $("#StgDashboard select").val(),
                                        displaytype: displaytype,
                                        context: displaytype
                                    },
                                    dataType: "json",
                                    cache: false,
                                    error: a$.ajaxerror,
                                    params: appApmDashboard.viewparams(0, false) + ((document.getElementById("StgInTraining") != null) ? "&InTraining=" + $("#StgInTraining select").val() : ""),
                                    success: loadedReport
                                });
                            });
                            window.reportsEditor = ace.edit("reportsEditor");
                            window.reportsEditor.setTheme("ace/theme/monokai");
                            window.reportsEditor.getSession().setMode("ace/mode/sql");
                            a$.beautify("sql",json.report.editor.query).then(function(data) {
                                window.reportsEditor.setValue(data);
                            });
                        }
                    }
                    //Single panel
                    for (var i in json.report.panel) {
                        var preservepanel = false; //MADELIVE (probably this entire loop)
                        var is = "";
                        var panelfill = false; //MAKELIVE MADEDEV
                        //$((is != "") ? is : sel).html(json.report.panel[i].html).show();
                        if (exists(json.report.panel[i].injectSelector)) {
                            is = json.report.panel[i].injectSelector;
                            if (json.report.panel[i].panelFill) panelfill = true;
                        }
                        if ((is == "") && (i == 0)) {
                            $(sel).html(json.report.panel[i].html).show();
                        }
                        else if (is != "") {
                            //TODO: See if you can do a resize here. //MADELIVE
                            if (exists(json.report.panel[i].preservePanel)) {
                                if (json.report.panel[i].preservePanel) {
                                    preservepanel = true;
                                }
                            }
                            if (!preservepanel) {
                                $(is).html(json.report.panel[i].html).show();

                                //MADENEWLIVE MADEDEVNOW
		                        if (json.report.panel[i].popup) {
		                          	$(is).closest(".rpt-popup-" + json.report.panel[i].popup).show().draggable(); //$(".rpt-panel-popup" + json.report.panel[i].popup,$(is).parent().parent()).show().draggable();
		                        }
                            }
                            if (exists(json.report.panel[i].resizePanelHtml)) {
                                
                            }
                        }
                        else {
                            $(sel).append(json.report.panel[i].html).show();
                        }
                        //MAKELIVE MADEDEV
                        if (exists(json.report.panel[i].loadPanel)) {
                            $(".progresspanel").spin("large","#EF4521");
                            var fp = overrideparams(appApmDashboard.viewparams(0, false),json.report.panel[i].loadPanel.params);
                            a$.ajax({
                                type: "GET",
                                service: "JScript",
                                async: true,
                                data: {
                                    lib: "editor",
                                    cmd: "getreport",
                                    performanceColors: window.apmPerformanceColors, //MADELIVE
                                    grouping: $("#StgReportGrouping select").val(),
                                    cid: json.report.panel[i].loadPanel.cid,
                                    injectSelector:  json.report.panel[i].loadPanel.sel,
                                    dashboard: $("#StgDashboard select").val(),
                                    displaytype: displaytype,
                                    context: displaytype
                                },
                                dataType: "json",
                                cache: false,
                                error: a$.ajaxerror,
                                params: fp + ((document.getElementById("StgInTraining") != null) ? "&InTraining=" + $("#StgInTraining select").val() : ""),
                                success: loadedReport
                            });

                            //alert("debug: loading panel into: " + json.report.panel[i].loadPanel.sel);
                        }
                        else { //This is a VERY long else. MAKELIVE duck

                            var p = i;
                            if (!preservepanel) {
                                for (var t in json.report.panel[p].tables) {
                                    $(".expander", json.report.panel[p].tables[t].sel).unbind().bind("click", function (e) {
                                        expandme(this);
                                    });
                                    $(".expander", json.report.panel[p].tables[t].sel).each(function () {
                                        expandme(this, json.report.panel[p].tables[t].expandIndexes);
                                        //$(this).trigger("click");
                                    });
                                    if (a$.exists(json.report.panel[p].tables[t].sort)) {
                                        $(".acuity-tablesorter", json.report.panel[p].tables[t].sel).each(function () {
                                            //alert("debug:adding sort to table4");
                                            $(this).tablesorter({ textExtraction: myTextExtraction }); //The "Rank" may be in various columns, so not save to sort by column
                                            //Remove the sort references from all but the last line in the header.
                                            var lasti = $(" thead", this).children().length - 1;
                                            var idx = 0;
                                            $(" thead tr", this).each(function () {
                                                $(" th", this).each(function () {
                                                    if (idx < lasti) {
                                                        $(this).removeClass("header").removeClass("headerSortUp").removeClass("headerSortDown");
                                                    }
                                                });
                                                idx++;
                                            });
                                        });
                                        for (var s in json.report.panel[p].tables[t].sort) {
                                            //alert("debug: sorting3 column=" + json.report.panel[p].tables[t].sort[s].column + ", direction=" + json.report.panel[p].tables[t].sort[s].direction);
                                            $(" .header", json.report.panel[p].tables[t].sel).each(function () {
                                                if ($(this).html() == json.report.panel[p].tables[t].sort[s].column) {
                                                    if (json.report.panel[p].tables[t].sort[s].direction == "desc") {
                                                        $(this).trigger("click");
                                                        $(this).trigger("click");
                                                    }
                                                    else {
                                                        $(this).trigger("click");
                                                    }
                                                    //alert("debug: found column, index = " + $(this).index());
                                                }
                                            });
                                        }
                                    }

                                    //MADEDEV2
                                    $("tbody td", json.report.panel[p].tables[t].sel).unbind(); //Clear it up
                                    var tabletooltipfound = false;
                                    $("thead .tbl-tabletooltip", json.report.panel[p].tables[t].sel).each(function() {
                                        tabletooltipfound = true;
                                    });
                                    $("thead .tbl-ttt", json.report.panel[p].tables[t].sel).each(function() {
                                        tabletooltipfound = true;
                                    });
                                    var drillkeyfound = false;
                                    $("thead .tbl-drillkey", json.report.panel[p].tables[t].sel).each(function() {
                                        drillkeyfound = true;
                                    });
                                    $("thead .tbl-dk", json.report.panel[p].tables[t].sel).each(function() {
                                        drillkeyfound = true;
                                    });
                                    if (tabletooltipfound || drillkeyfound) {
                                        //Sick of qtip.
                                        $(".tbl-mytip",sel).remove();
                                        $(sel).append('<div class="tbl-mytip" style="position:fixed;display:none;z-index:9999;">My Tool Tip</div>');
                                        $("tbody td", json.report.panel[p].tables[t].sel).bind("mousemove", function(event) {
                                            var bld = "";
                                            var selcolname = $(" th", $(" thead tr", $(this).parent().parent().parent()).eq(1)).eq($(this).index()).html();
                                            $(".tbl-ttt-" + selcolname.replace(/ /g,"-"),$(this).parent()).each(function() {
                                                bld = $(this).html();
                                            });
                                            if (bld == "") {
                                                $(".tbl-tabletooltip",$(this).parent()).each(function() {
                                                    bld = $(this).html();
                                                });
                                            }
                                            if (bld != "") {
                                                var left = event.pageX + 50;
                                                var top = event.pageY - 20;
                                                $('.tbl-mytip',sel).html(bld).css({top: top,left: left}).show();
                                            }
                                            else {
                                                $('.tbl-mytip',sel).hide();
                                            }
                                            var pointer = false;
                                            $(".tbl-dk-" + selcolname.replace(/ /g,"-"),$(this).parent()).each(function() {
                                                //bld = $(this).html();
                                                pointer = true;
                                            });
                                            if (!pointer) {
                                                $(".tbl-drillkey",$(this).parent()).each(function() {
                                                    //bld = $(this).html();
                                                    pointer = true;
                                                });
                                            }
                                            if (pointer) {
                                                $(this).css("cursor","pointer");
                                            }
                                            else {
                                                $(this).css("cursor","");
                                            }
                                        }).bind("mouseout", function() {
                                            $(".tbl-mytip",sel).hide();
                                        });

                                    }
                                
                                    //MADELIVE MADEDEV
                                    if ($(" .tbl-serieslink",json.report.panel[p].tables[t].sel).length > 0) {
                                        function setstrokewidth(me,width) {
                                            var match = $(" .tbl-serieslink",$(me).parent()).html();
                                            var matchlength = 0;
                                            if (match.indexOf("*") >= 0) {
                                                match = match.substring(0,match.indexOf("*"));
                                                matchlength = match.length;
                                            }

                                            for (var chart in window.apmCharts) {
                                                if (a$.exists(window.apmCharts[chart].series)) {
                                                    for (var s in window.apmCharts[chart].series) {
                                                        if (!a$.exists(window.apmCharts[chart].series[s].name)) {
                                                            break;
                                                        }
                                                        var matches = matchlength ? (window.apmCharts[chart].series[s].name.substring(0,matchlength) == match) : (window.apmCharts[chart].series[s].name == match);
                                                        if (matches) {
                                                            window.apmCharts[chart].series[s].graph.attr('stroke-width',"" + width);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        $(" td",$("tbody .tbl-serieslink",json.report.panel[p].tables[t].sel).parent()).unbind("mouseover mouseout").bind("mouseover", function() {
                                            //alert("debug: over series: " + $(" .tbl-serieslink",$(this).parent()).html());
                                            setstrokewidth(this,"10");
                                        }).bind("mouseout", function() {
                                            setstrokewidth(this,"2");
                                        });
                                    }

                                }
                            }
                            $(".acuity-download", $((is != "") ? is : sel)).unbind().bind("click", function () {
                                appApmDashboard.acuitytable_download("csv", $(this).parent().parent().children().eq($(this).parent().index() + 1));
                            });

                            $(".rpt-filter-startdate,.rpt-filter-enddate").datepicker(); //MADELIVE:
                            var CLICKEDPICKER = false;
                            $(".rpt-filter-daterange").unbind().bind("click", function() {
                                CLICKEDPICKER = true;
                            }).bind("change", function() {
                                clicked_drill_td(this,true);
                            });
                            $(".rpt-filter-daterange-icon").unbind().bind("click",function() {
                                var dr = $(" .rpt-filter-daterange",this);
                                if ($(dr).is(":visible")) {
                                    if (!CLICKEDPICKER) {
                                        $(dr).hide();
                                    }
                                }
                                else {
                                    $(dr).show();
                                }
                                CLICKEDPICKER = false;
                            });

                            if ((is == "") || panelfill) { //MADELIVE (added panelfill). MADEDEV
								//MADENEWLIVE
		                        $(".rpt-panel-popup", sel).append('<div class="rpt-close" title="Close Panel"></div>');
	                            $(".rpt-close", sel).unbind().bind("click", function() {
	                                $(this).parent().hide();		                            		
	                            });

                                $(".rpt-panel", sel).append('<div class="rpt-max-link rpt-max-link-plus" title="Maximize Panel"></div>'); //MADELIVE: add title.
                                $(".rpt-max-link", sel).unbind().bind("click", function () {
                                    //alert("debug: clicked maximize");
                                    var maximized = false;
                                    if ($(this).parent().hasClass("rpt-panel-maximized")) {
                                        $(this).parent().removeClass("rpt-panel-maximized");
                                        $(this).attr("title","Maximize Panel"); //MADELIVE:
                                        $(this).html(""); //Maximize
                                        $(this).removeClass("rpt-max-link-minus").addClass("rpt-max-link-plus")
                                        $(".rpt-panel").show();
                                    }
                                    else {
                                        maximized = true;
                                        $(this).parent().addClass("rpt-panel-maximized");
                                        $(this).attr("title","Restore Panel"); //MADELIVE:
                                        $(this).html(""); //Restore
                                        $(this).addClass("rpt-max-link-minus").removeClass("rpt-max-link-plus")
                                        $(".rpt-panel").hide();
                                        $(this).parent().show();
                                    }
                                    $(" .rpt-highchart", $(this).parent()).each(function () { //MADELIVE: change rpt-chart to rpt-highchart
                                        if (a$.exists(window.apmCharts[$(this).attr("id")])) {
                                            window.apmCharts[$(this).attr("id")].destroy();
                                        }
                                        setLegendDisplay(window.apmChartOptions[$(this).attr("id")],maximized);
                                        window.apmCharts[$(this).attr("id")] = new Highcharts.Chart(window.apmChartOptions[$(this).attr("id")]);
                                    });
                                    //$(window).resize();
                                });
                            }

                            //MADELIVE: New section for the intervals.
                            $(".rpt-filter-interval", $((is != "") ? is : sel)).unbind().bind("click", function () {
                                if ($(this).hasClass("rpt-filter-interval-active")) return;
                                var backstop = $(this).attr("apm-backstop");
                                if (backstop != null) {
                                    var bs = backstop.split("_");
                                    if (bs.length == 2) {
                                        var sel = $(this).closest(".rpt-filters");
                                        var dt = $(".rpt-filter-enddate",sel).eq(0).val();
                                        var endparts = dt.split('/');
                                        var myenddate = new Date(endparts[2],endparts[0]-1,endparts[1]);
                                        var n = parseInt(bs[1],10);
                                        if (bs[0] == "Y") {
                                            myenddate.setFullYear(myenddate.getFullYear() - n);
                                        }
                                        else if (bs[0] == "M") {
                                            if ((myenddate.getMonth() - n) < 0) {
                                                myenddate.setMonth((myenddate.getMonth() + 12) - n);
                                                myenddate.setFullYear(myenddate.getFullYear() - 1);
                                            }
                                            else {
                                                myenddate.setMonth(myenddate.getMonth() - n);
                                            }
                                        }
                                        else {
                                            alert("Note: unknown date backstop");
                                        }
                                        var safeday = 28;
                                        switch (myenddate.getMonth()+1) {
                                            case 9: //Sep
                                            case 4: //Apr
                                            case 6: 
                                            case 11:
                                                safeday = 30;
                                                break;
                                            case 2:
                                                safeday = 28;
                                                break;
                                            default:
                                                safeday = 31;
                                                break;
                                        }
                                        if (myenddate.getDate() < safeday) {
                                            safeday = myenddate.getDate();
                                        }
                                        $(".rpt-filter-startdate",sel).eq(0).val("" + (myenddate.getMonth()+1) + "/" + safeday + "/" + (myenddate.getFullYear()));
                                    }
                                }
                                //alert("debug:backstop=" + backstop);
                                $(" .rpt-filter-interval-active",$(this).parent()).each(function() {
                                    $(this).removeClass("rpt-filter-interval-active");
                                });
                                $(this).addClass("rpt-filter-interval-active");
                                clicked_drill_td(this,true);
                                //TODO: Check "Linked" attribute and fire all of these in all panels if set.
                            });
                            
                            function clicked_drill_td(me,wholepanel) {
                                var finalparams = "";
                                var filterkey = "";
                                var key = "";
                                var drillkey = ""; //MADELIVENOW2
                                if (wholepanel) {
                                    var selfilters = $(me).closest(".rpt-filters");
                                    finalparams = $(" .rpt-filter-params", selfilters).html().replace(/\&amp;/g,"&");
                                    $(" .rpt-filter-interval-active",selfilters).each(function() {
                                        filterkey = $(" .rpt-filter-param",this).html().replace(/\&amp;/g,"&");
                                        finalparams = overrideparams(finalparams, filterkey);
                                    });
                                    //TEST: Get the daterange (if present) and form a parameter/

                                    //MADELIVE:
                                    if ($(" .rpt-filter-startdate",selfilters).eq(0).hasClass("rpt-datetype-interval")) {
                                        filterkey = "StartDate=" + $(" .rpt-filter-startdate",selfilters).eq(0).val() + '&EndDate=' + $(" .rpt-filter-enddate",selfilters).eq(0).val();
                                    }
                                    else { //daterange
                                        filterkey = "daterange=" + $(" .rpt-filter-startdate",selfilters).eq(0).val() + ',' + $(" .rpt-filter-enddate",selfilters).eq(0).val();
                                    }
                                    finalparams = overrideparams(finalparams, filterkey);

                                }
                                else {                                
                                    if ($(" thead .tbl-filterkey", $(me).parent().parent().parent()).length) {
                                        var filterkeycolidx = $(" thead .tbl-filterkey", $(me).parent().parent().parent()).index();
                                        filterkey = $(" td", $(me).parent()).eq(filterkeycolidx).html().replace(/&amp;/gi, "&");
                                    }
                                    //alert("debug: filterkey = " + filterkey);
                                    if ($(" thead .tbl-key", $(me).parent().parent().parent()).length) {
                                        var keycolidx = $(" thead .tbl-key", $(me).parent().parent().parent()).index();
                                        key = $(" td", $(me).parent()).eq(keycolidx).html().replace(/&amp;/gi, "&"); ;
                                    }
                                    //alert("debug: key = " + key);

                                    //MADEDEV2
                                    //WAS: var selcolname = $(" th", $(" thead tr", $(me).parent().parent().parent()).last()).eq($(me).index()).html();
                                    //IS:
                                    var selcolname = $(" th", $(" thead tr", $(me).parent().parent().parent()).eq(1)).eq($(me).index()).html();
                                    //alert("debug: selcolname=" + selcolname);                            

                                    //MADEDEV2
                                    //REMOVE:
                                    /*
                                    if ($(" thead .tbl-drillkey", $(me).parent().parent().parent()).length) {
                                        var drillkeycolidx = $(" thead .tbl-drillkey", $(me).parent().parent().parent()).index();
                                        drillkey = $(" td", $(me).parent()).eq(drillkeycolidx).html().replace(/&amp;/gi, "&"); ;
                                    }
                                    */
                                    //IS:
                                    drillkey = "";
                                    $(".tbl-dk-" + selcolname.replace(/ /g,"-"),$(me).parent()).each(function() {
                                        drillkey = $(this).html();
                                    });
                                    if (drillkey == "") {
                                        $(".tbl-drillkey",$(me).parent()).each(function() {
                                            drillkey = $(this).html();
                                        });
                                    }
                                    drillkey = drillkey.replace(/&amp;/g,"&");
                                    //alert("debug: drillkey = " + drillkey);

                                    var seltblid = $(" .tbl-ident", $(me).parent()).html();
                                    //alert("debug: seltblid=" + seltblid);

                                    var found = false;
                                    var serieskey = "";
                                    if ($(" tfoot .tbl-ident-" + seltblid, $(me).parent().parent().parent()).length) {
                                        serieskey = $(" tfoot .tbl-ident-" + seltblid, $(me).parent().parent().parent()).html().replace(/&amp;/gi, "&"); ;
                                    }
                                    //alert("debug: serieskey=" + serieskey);
                                    //TODO: Substitute to single, precedence is drillkey > key > filterkey > serieskey
                                    finalparams = "&" + serieskey;
                                    finalparams = overrideparams(finalparams, filterkey);
                                    finalparams = overrideparams(finalparams, key);
                                    finalparams = overrideparams(finalparams, drillkey); //MADELIVENOW2
                                    finalparams = "drillcolumn=" + selcolname + finalparams;
                                }
                                if ($.cookie("TP1Username") == "jeffgack") {
                                    alert("debug: finalparams = " + finalparams);
                                }

                                a$.showprogress("plotprogress");
                                a$.ajax({
                                    type: "GET",
                                    service: "JScript",
                                    async: true,
                                    data: {
                                        lib: "editor",
                                        cmd: "getreport",
                                        performanceColors: window.apmPerformanceColors, //MADELIVE
                                        devmode: document.getElementById("ReportDeveloperMode").checked,
                                        grouping: $("#StgReportGrouping select").val(),
                                        //cid: cid, //For drills, this is passed in the serieskey, or key.
                                        dashboard: $("#StgDashboard select").val(),
                                        displaytype: displaytype,
                                        context: displaytype
                                    },
                                    dataType: "json",
                                    cache: false,
                                    error: a$.ajaxerror,
                                    params: finalparams + ((document.getElementById("StgInTraining") != null) ? "&InTraining=" + $("#StgInTraining select").val() : ""),
                                    success: loadedReport
                                });
                            }

                            //MADELIVE: new function:
                            function changed_filter(me) {
                                //Find the associated table to get params from.
                                var serieskey = "";
                                if ($(" tfoot .tbl-ident-" + seltblid, $(me).parent().parent().parent()).length) {
                                    serieskey = $(" tfoot .tbl-ident-" + seltblid, $(me).parent().parent().parent()).html().replace(/&amp;/gi, "&"); ;
                                }
                            }

                            if (exists(json.report.panel[i].chartbuilds)) {
                                for (var c in json.report.panel[i].chartbuilds) {
                                    //MADELIVE:
                                    //Place the name of the table into the chart report title (better to do this client-side).
                                    $(".rpt-chart-topper .rpt-title", $("#" + json.report.panel[i].chartbuilds[c].chartid).parent()).html($(" .rpt-table-topper .rpt-title", $(json.report.panel[i].chartbuilds[c].tblsel)).eq(0).html());

                                    $(json.report.panel[i].chartbuilds[c].tblsel).hide();
                                    $("#" + json.report.panel[i].chartbuilds[c].chartid).show(); //MADELIVE: added another parent() below
                                    $(" .rpt-toggle", $("#" + json.report.panel[i].chartbuilds[c].chartid).parent().parent()).unbind().bind("click", function () {
                                        if ($(" .rpt-table", $(this).parent()).is(":visible")) {
                                            $(this).removeClass("rpt-toggle-chart").addClass("rpt-toggle-table");
                                            $(" .rpt-table", $(this).parent()).hide();
                                            $(" .rpt-chart", $(this).parent()).show();                                       
                                        }
                                        else {
                                            $(this).removeClass("rpt-toggle-table").addClass("rpt-toggle-chart");
                                            $(" .rpt-table", $(this).parent()).show();
                                            $(" .rpt-chart", $(this).parent()).hide();
                                        }
                                    });

                                    var seriesnameidx = 0; //Always the first column, assuming standard table.
                                    var xidx = -1;
                                    var yidx = -1;
                                    var datalabelidx = -1;
                                    var tooltipidx = -1;
                                    var seqidx = -1;
                                    $(" th", $(" thead tr", $(json.report.panel[i].chartbuilds[c].tblsel)).last()).each(function () {
                                        if ($(this).html() == "x") {
                                            xidx = $(this).index();
                                        }
                                        if ($(this).html() == "seq") {
                                            seqidx = $(this).index();
                                        }
                                        if ($(this).html() == "y") {
                                            yidx = $(this).index();
                                        }
                                        if ($(this).html() == "datalabel") {
                                            datalabelidx = $(this).index();
                                        }
                                        if ($(this).html() == "tooltip") {
                                            tooltipidx = $(this).index();
                                        }
                                    });

                                    var chart = appChartDefinitions.connectedChart({
                                        chartVar: json.report.panel[i].chartbuilds[c].chartvar,
                                        renderTo: json.report.panel[i].chartbuilds[c].chartid,
                                        tableSelector: json.report.panel[i].chartbuilds[c].tblsel,
                                        idx: {
                                            seriesname: seriesnameidx,
                                            x: xidx,
                                            y: yidx,
                                            seq: seqidx,
                                            datalabel: datalabelidx,
                                            tooltip: tooltipidx
                                        },
                                        onClick: myclickfunction
                                    });

                                    function myclickfunction(e) {
                                        //alert("debug: click fired");
                                        var i = 1;
                                        var xidx = -1;
                                        var seriesnameidx = 0; //Always
                                        var me = this;
                                        $(" th", $(" thead tr", $($(" .rpt-table", $(me.series.chart.renderTo).parent().parent()))).last()).each(function () { //MADELIVE: Added another .parent()
                                            if ($(this).html() == "x") {
                                                xidx = $(this).index();
                                            }
                                        });
                                        var foundit = false;
                                        $(" tbody tr", $(" .rpt-table", $(me.series.chart.renderTo).parent().parent())).each(function () { //MADELIVE: Added another .parent()
                                            if (!foundit) {
                                                var x = $(" td:nth-child(" + (xidx + 1) + ")", this).html();
                                                var seriesname = $(" td:nth-child(" + (seriesnameidx + 1) + ")", this).html();
                                                if (exists(me.category)) { //bar
                                                    if ((x == me.category) && (seriesname == me.series.name)) {
                                                        foundit = true;
                                                        clicked_drill_td($(" td:nth-child(" + (seriesnameidx + 1) + ")", this),false);
                                                    }
                                                }
                                                else { //pie
                                                    if (x == me.name) {
                                                        foundit = true;
                                                        clicked_drill_td($(" td:nth-child(" + (seriesnameidx + 1) + ")", this),false);
                                                    }
                                                }
                                            }
                                        });

                                        //this.category = x = xidx
                                        //this.series.name = series anme = seriesnameidx
                                        //find, then get key and filterkey, then call a common function. 
                                    }

                                    //alert("debug:xidx=" + xidx);
                                    if (exists(chart.xAxis)) {
                                        if (seqidx >= 0) { //Use the sequence field to order the x axes BEFORE populating..
                                            var seq = [];
                                            var seqx = [];
                                            $(" tbody tr td:nth-child(" + (seqidx + 1) + ")", $(json.report.panel[i].chartbuilds[c].tblsel)).each(function () {
                                                var s = parseInt($(this).html(),10);
                                                if (seq.indexOf(s) === -1) {
                                                    seq.push(s);
                                                    var x = $(" td:nth-child(" + (xidx + 1) + ")",$(this).parent()).html();
                                                    seqx.push([s,x]);
                                                }
                                            });
                                            function sortSeqx(a,b) {
                                                if (a[0] === b[0]) {
                                                    return 0;
                                                }
                                                else {
                                                    return (a[0] < b[0]) ? -1 : 1;
                                                }
                                            }
                                            seqx.sort(sortSeqx);
                                            for (var s in seqx) {
                                                chart.xAxis.categories.push(seqx[s][1]);
                                            }
                                        }
                                        else {
                                            $(" tbody tr td:nth-child(" + (xidx + 1) + ")", $(json.report.panel[i].chartbuilds[c].tblsel)).each(function () {
                                                var x = $(this).html();
                                                chart.xAxis.categories.indexOf(x) === -1 ? chart.xAxis.categories.push(x) : "";
                                            });
                                        }
                                        chart.series = [];
                                        $(" tbody tr td:nth-child(" + (seriesnameidx + 1) + ")", $(json.report.panel[i].chartbuilds[c].tblsel)).each(function () {
                                            var nm = $(this).html();
                                            var found = false;
                                            for (var n in chart.series) {
                                                if (chart.series[n].name == nm) {
                                                    found = true;
                                                    break;
                                                }
                                            }
                                            if (!found) {
                                                chart.series.push({ name: nm, data: [], point: { events: { click: myclickfunction, dblclick: myclickfunction}} });
                                            }
                                        });
                                        for (var s in chart.series) {
                                            for (var x in chart.xAxis.categories) {
                                                var found = false;
                                                $(" tbody tr", $(json.report.panel[i].chartbuilds[c].tblsel)).each(function () {
                                                    if (!found) {
                                                        if ($(" td:nth-child(" + (xidx + 1) + ")", this).html() == chart.xAxis.categories[x]) { //Greeting
                                                            if ($(" td:nth-child(" + (seriesnameidx + 1) + ")", this).html() == chart.series[s].name) { //Indianapolis
                                                                var ytext = $(" td:nth-child(" + (yidx + 1) + ")", this).html();
                                                                if (ytext != "-1000") {
                                                                    chart.series[s].data.push({
                                                                        Label: chart.xAxis.categories[x],
                                                                        y: parseFloat(ytext),
                                                                        formy: $(" td:nth-child(" + (datalabelidx + 1) + ")", this).html()
                                                                    });
                                                                    found = true;
                                                                }
                                                            }
                                                        }
                                                    }
                                                });
                                                if (!found) {
                                                    chart.series[s].data.push(null);
                                                }
                                            }
                                        }
                                    }
                                    else { //pie
                                        $(" tbody tr", $(json.report.panel[i].chartbuilds[c].tblsel)).each(function () {
                                            var seriesname = $(" td:nth-child(" + (seriesnameidx + 1) + ")", this).html();
                                            var x = $(" td:nth-child(" + (xidx + 1) + ")", this).html();
                                            var y = $(" td:nth-child(" + (yidx + 1) + ")", this).html();
                                            chart.series[0].name = seriesname;
                                            chart.series[0].data.push({ name: x, y: parseFloat(y), point: { events: { click: myclickfunction, dblclick: myclickfunction}} });
                                        });
                                    }

                                    //traverse the x column in tblsel
                                    setLegendDisplay(chart,false);
                                    window.apmChartOptions[chart.chart.renderTo] = chart;
                                    window.apmCharts[chart.chart.renderTo] = new Highcharts.Chart(chart);
                                }
                            }
                        } //MADELIVE - Matching the else from near var p=i; (wow).

                    }

                    //MADELIVE: Moved this out of clicked_drill_td MADELIVE
                    function overrideparams(par, ov) {
                        var sp = ov.split("&");
                        for (var i in sp) {
                            spsp = sp[i].split("=");
                            if (par.indexOf("&" + spsp[0] + "=") >= 0) {
                                var rep = "&" + spsp[0] + "=";
                                var re = new RegExp(rep, "g");
                                par = par.replace(re, "&" + spsp[0] + "_OVERRIDDEN=");
                            }
                        }
                        if (ov != "") {
                           par = par + "&" + ov;
                        }
                        return par;
                    }

                    if ($(" .rpt-panel", sel).length > 0) {
                        //MADEDEV2 - If there are non-popup panels.
                        var nonpopup = false;
                        $(" .rpt-panel", sel).each(function() {
                            if (!$(this).hasClass("rpt-panel-popup")) {
                                nonpopup = true;
                            }
                        });
                        if (nonpopup) {
                            $(sel).parent().css("overflow", "hidden"); //No scroll bars if using panels.
                        }
                        else {
                            $(sel).parent().css("overflow", "scroll");
                        }
                    }
                    else {
                        $(sel).parent().css("overflow", "scroll");
                    }
                    //TODO: Activate things in the form (it's blow & go right now).

                    //TODO: get this called for all  instances of getreport
                    //MADEDEV2 - Took out the unbind() - $(".tbl-drill tbody td").unbind().bind("click", function (e) {
                    $(".tbl-drill tbody td").bind("click", function (e) {                    
                        clicked_drill_td(this);
                    });

                    /*
                    function setsort() {

                    }
                    setTimeout(setsort, 500);
                    */
                } else {
                    //a$.jsonerror({ errormessage: true, msg: "Report not found (in 'getreport')." });
                }
            }
        }
    }

    function expandme(me, eis) { //eis = expandIndexes
        var ec = $(" .expander-info", $(me).parent()).eq(0).html();
        ecss = ec.split("/");
        var ecs = [];
        ecs[0] = parseInt(ecss[0], 10);
        ecs[1] = parseInt(ecss[1], 10);
        //Find yourself and determine how many columns are before you.
        var mythi = $(me).parent().index();
        var cnt = 0;
        var tr = $(me).parent().parent();
        $(tr).children().each(function () {
            if ($(this).index() < mythi) {
                //If there's an expander colspan indicator.
                if ($(" .expander-info", this).length > 0) {
                    var ecss2 = $(" .expander-info", this).eq(0).html().split("/");
                    cnt += parseInt(ecss2[0], 10);
                } else if (typeof $(this).attr("colspan") != "undefined") {
                    cnt += parseInt($(this).attr("colspan"), 10);
                } else {
                    cnt += 1;
                }
            }
        });
        //alert("debug: " + cnt + " columns found before this.");
        var hide;
        var leaveopen = false;
        var curidx = $(me).parent().index();
        if (a$.exists(eis)) {
            for (var i in eis) {
                if (eis[i] == curidx) {
                    leaveopen = true;
                }
            }
        }
        //if ($(me).parent().index() == 0) { leaveopen = false; };
        if (leaveopen || $(me).hasClass("expander-expand")) {
            //alert("debug:expand to " + ecs[0] + " columns");
            hide = false;
            $(me).removeClass("expander-expand").addClass("expander-collapse");
            $(me).parent().attr("colspan", ecss[0]);
        } else {
            //alert("debug:collapse to " + ecs[1] + " columns");
            hide = true;
            $(me).removeClass("expander-collapse").addClass("expander-expand");
            $(me).parent().attr("colspan", ecss[1]);
        }
        var thead = tr.parent();
        var tbody = $(" tbody", $(thead).parent()).eq(0);
        $(" tr", thead).each(function () {
            if ($(this).index() > $(tr).index()) { //This is a tr in thead which is lower than the row with the expander
                var idx = 0;
                $(this).children().each(function () {
                    if ((idx >= (cnt + ecs[1])) && (idx < (cnt + ecs[0]))) {
                        if (hide) $(this).hide();
                        else $(this).show();
                    }
                    if (typeof $(this).attr("colspan") != "undefined") {
                        idx += parseInt($(this).attr("colspan"), 10);
                    } else {
                        idx += 1;
                    }
                });
            }
        });
        $(" tr", tbody).each(function () {
            if (true) { //  DO FOR ALL ROWS //from above:$(this).index() > $(tr).index()) { //This is a tr in thead which is lower than the row with the expander
                var idx = 0;
                $(this).children().each(function () {
                    if ((idx >= (cnt + ecs[1])) && (idx < (cnt + ecs[0]))) {
                        if (hide) $(this).hide();
                        else $(this).show();
                    }
                    if (typeof $(this).attr("colspan") != "undefined") {
                        idx += parseInt($(this).attr("colspan"), 10);
                    } else {
                        idx += 1;
                    }
                });
            }
        });

    }

    function init(o) {

        $(".rpt-max-panelset").unbind().bind("click", function() {
                                //alert("debug: clicked maximize");
                                var maximized = false;
                                var ppp = $(this).parent().parent(); //smh
                                if ($(ppp).hasClass("home-covering")) {
                                    $(ppp).removeClass("home-covering").addClass("home-inset");
                                }
                                else {
                                    maximized = true;
                                    $(ppp).addClass("home-covering").removeClass("home-inset");
                                }
                                $(" .rpt-highchart", ppp).each(function () { //MADELIVE: change rpt-chart to rpt-highchart
                                    if (a$.exists(window.apmCharts[$(this).attr("id")])) {
                                        window.apmCharts[$(this).attr("id")].destroy();
                                    }
                                    setLegendDisplay(window.apmChartOptions[$(this).attr("id")],maximized);
                                    window.apmCharts[$(this).attr("id")] = new Highcharts.Chart(window.apmChartOptions[$(this).attr("id")]);
                                });
                                //$(window).resize();

        });

        $(".attrition-management-link").bind("click", function () {
            $(".AttritionLedger-wrapper").show();
            $(".AttritionReports-wrapper").hide();
            setDashboardFilters("AttritionManagement");
            appApmAttrition.showagents();
            return false;
        });

        $(".attrition-reports-link").bind("click", function () {
            $(".AttritionLedger-wrapper").hide();
            $(".AttritionReports-wrapper").show();
            setDashboardFilters("Agent_Attrition");
            showReport("AttritionGrid", ".AttritionReports", "Grid");
            return false;
        });

        //The filter configuration needs set
        $(".tablabel").bind("click", function () {
            if (true) { //(global_attritionvisible) {
                //CLUGUE to keep all & each from both being in the Location field.  This is probably an issue for multiple fields, but...
                //TODO: Find the place where they are set.
                $("#StgScoreModel_Filter").hide(); //MADEDEV
                if (Array.isArray($("#selLocations").val())) {
                    var ar = $("#selLocations").val();
                    if ((ar[0] == "") && (ar[1] == "each")) {
                        $("#selLocations").val([]).val("each");
                    }
                }
                if ($(this).attr("id") == "attritionlabel") {
                    if (firsttime_attritiontab || $(".attrition-management-link").eq(0).hasClass("ui-state-active")) {
                        firsttime_attritiontab = false;
                        if ((a$.urlprefix() == "chime.") || (a$.urlprefix().indexOf("chime-make40.") >= 0)) {
                            $(".attrition-reports-link").trigger("click");
                            $("#tabsattrition").hide();
                        }
                        else {
                            $(".attrition-management-link").trigger("click");
                        }
                    } else {
                        $(".attrition-reports-link").trigger("click");
                    }
                }
                else if ($(this).attr("id") == "reportlabel") {
                    $(".attrition-hide").show();
                    $(".attrition-show").hide();
                    $(".attrition-show-hi").show();
                    $(".attrition-show-loc").hide();
                    $("#gaugesdiv").hide();
                    if (current_filter != "Reports") {
                        appApmDashboard.setSuppressBoxList($("#ReportReportList select option[value='" + $("#ReportReportList select").val() + "']").attr("suppress_list"));
                        setSuppressMenuList($("#ReportReportList select option[value='" + $("#ReportReportList select").val() + "']").attr("suppress_menus"));
                        setDashboardFilters("Reports");
                    }
                    //TODO: Customize filters for the selected report.
                    //alert("debug:customize filters for the selected report");
                }
                else {
                    if (($(this).attr("id") == "graphlabel") || ($(this).attr("id") == "graphsublabel")) { //MADEDEV

                        //MADEDEV
                        if (a$.urlprefix() == "cox.") {
                            $("#StgScoreModel_Filter").show();
                        }

                        $(".attrition-hide").show();
                        $(".attrition-show").hide();
                        $(".attrition-show-hi").show();
                        $(".attrition-show-loc").hide();
                        $("#gaugesdiv").show();
                        if (current_filter != $("#StgDashboard select").val()) {
                            setDashboardFilters($("#StgDashboard select").val());
                        }
                    }
                    if ($(this).attr("id") == "cepointsmgrlabel") {
                        /*
                        if ($("#selLocations").val() == "9") {
                        alert("Notice: This ledger is for Non-Guatemala agents.  Guatemala will have their own ledger.");
                        }
                        */
                    }
                }
            }
            a$.settablabel($(this).attr("id"));
        });

        appApmSettings.init({
            id: "StgScoreModel",
            ui: "slider"
        });
        $("#StgScoreModel select").bind("change", function () {
            appApmDashboard.StgScoreModel_update(0);
        });
        appApmSettings.init({
            id: "StgReportScoreModel",
            ui: "slider"
        });

        //MADEDEV
        if (a$.urlprefix() == "cox.") {
            appApmSettings.init({
                id: "StgScoreModel_Filter",
                shadow: "StgScoreModel",
                ui: "slider"
            });
        }
        else {
            $("#StgScoreModel_Filter").hide();
        }

        if ((a$.urlprefix() == "km2.") || (a$.urlprefix().indexOf("km2-make40.") >= 0)) {
            $("#StgScoreModel").hide();
        }

        a$.ajax({
            type: "GET",
            service: "JScript",
            async: true,
            data: {
                lib: "editor",
                cmd: "getreportlist",
                devmode: document.getElementById("ReportDeveloperMode").checked,
                tablist: ["Home", "Report"],
                dashboard: "CSR",
                role: $.cookie("TP1Role")
            },
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: StgScoreModelLoaded
        });
        function StgScoreModelLoaded(json) {
            if (a$.jsonerror(json)) { } else {
                for (var t in json.reportlist.tablist) {
                    switch (json.reportlist.tablist[t].name) {
                        case "Home_NEVERCALL":
                            $("#StgReportScoreModel select option").each(function () { $(this).remove(); });
                            for (var g in json.reportlist.tablist[t].group) {
                                if (json.reportlist.tablist[t].group[g].name != "") {
                                    $("#StgReportScoreModel select").append('<option value="' + json.reportlist.tablist[t].group[g].name + '">GROUP:' + json.reportlist.tablist[t].group[g].desc + '</option>');
                                }
                                for (var i in json.reportlist.tablist[t].group[g].item) {
                                    var selstr = "";
                                    if (json.reportlist.tablist[t].group[g].item[i].selected == "Y") {
                                        selstr = ' selected="selected"'
                                    }
                                    $("#StgReportScoreModel select").append('<option value="' + json.reportlist.tablist[t].group[g].item[i].name + '"' + selstr + '>' + json.reportlist.tablist[t].group[g].item[i].desc + '</option>');
                                }
                            }
                            $("#StgReportScoreModel").hide();

                            if ((a$.urlprefix() == "cox.") || (a$.urlprefix() == "cox-make40.")) { //4
                                if (($.cookie("TP1Role") != "CSR") && ($.cookie("TP1Role") != "Team Leader")) {
                                    $("#StgReportScoreModel select").val("Raw");
                                }
                            }

                            $("#StgReportScoreModel select").bind("change", function () {
                                appApmDashboard.StgReportScoreModel_update(0);
                            });
                            appApmSettings.init({
                                id: "HomeReportList", //WAS: ReportScoreModel
                                shadow: "StgReportScoreModel",
                                ui: "combo"
                            });
                            break;
                        case "Report":
                        default:  //ALWAYSCALL
                            /*
                            $("#composeto").append($('<optgroup label="SUPERVISORS"></optgroup>'));
                            if (msg.contacts.supervisors) {
                            for (var i in msg.contacts.supervisors) {
                            $("#composeto").children().last().append($('<option></option>').val(msg.contacts.supervisors[i].username).html(msg.contacts.supervisors[i].name.replace(/'/g, '')));
                            }
                            }
                            */
                            $("#ReportReportList select").children().each(function () { $(this).remove(); });
                            for (var g in json.reportlist.tablist[t].group) {
                                if (json.reportlist.tablist[t].group[g].name != "") {
                                    $("#ReportReportList select").append('<optgroup label="' + json.reportlist.tablist[t].group[g].name + '"></optgroup>');
                                }
                                for (var i in json.reportlist.tablist[t].group[g].item) {
                                    var selstr = "";
                                    if (json.reportlist.tablist[t].group[g].item[i].selected == "Y") {
                                        selstr = ' selected="selected"'
                                    }
                                    if (json.reportlist.tablist[t].group[g].name == "") {
                                        $("#ReportReportList select").append('<option value="' + json.reportlist.tablist[t].group[g].item[i].name + '"' + selstr + ' suppress_list="' + json.reportlist.tablist[t].group[g].item[i].suppressFilters + '" suppress_menus="' + json.reportlist.tablist[t].group[g].item[i].suppressMenus + '">' + json.reportlist.tablist[t].group[g].item[i].desc + '</option>');
                                    }
                                    else {
                                        $("#ReportReportList select").children().last().append('<option value="' + json.reportlist.tablist[t].group[g].item[i].name + '"' + selstr + ' suppress_list="' + json.reportlist.tablist[t].group[g].item[i].suppressFilters + '" suppress_menus="' + json.reportlist.tablist[t].group[g].item[i].suppressMenus + '">' + json.reportlist.tablist[t].group[g].item[i].desc + '</option>');
                                    }
                                }
                            }
                            if (json.reportlist.tablist[t].group.length == 0) {
                                $("#reporttab").hide();
                            }
                            else {
                                showReport($("#ReportReportList select").val(), ".ReportReports", "Grid");
                            }
                            $("#ReportReportList select").unbind().bind("change", function () {
                                $(".dev-display-reports-controls,.dev-display-reports").hide();
                                $("#ReportDeveloperMode").prop("checked", false);
                                appApmDashboard.setSuppressBoxList($("#ReportReportList select option[value='" + $("#ReportReportList select").val() + "']").attr("suppress_list"));
                                setSuppressMenuList($("#ReportReportList select option[value='" + $("#ReportReportList select").val() + "']").attr("suppress_menus"));
                                setDashboardFilters("Reports");
                            });
                            break;
                        /*
                        default:
                            alert("debug:unrecognized tab = " + json.reportlist.tablist[t].name);
                        */
                    }
                }
            }
            appApmDashboard.setClientLabels();
        }

    }

    function debugoutput(out) {
        if (window.location.host.indexOf("localhost") >= 0) {
            try {
                $("#debugwindow").html("http://" + window.location.host + a$.xss(window.location.pathname).substr(0, a$.xss(window.location.pathname).lastIndexOf("/")) + "/" + out);
                //alert("debug:Calling: queryurl=" + out);
            } catch (err) { }

        }
    }

    var bp = breakOn(document, 'cookie', false, function (v) {
        var debug = 1;
    });

    function setDashboardFilters(filter) {
        if (filter != current_filter) {
            //alert("debug: switching from " + current_filter + " to " + filter);
        }
        current_filter = filter;
        global_currentfilter = current_filter; //TODO: This is ridiculous of course.
        switch (filter) {
            case "Agent":
                appApmDashboard.setSuppressBoxList("");
                appApmDashboard.setSpecialFlagsList("");

                //New Grid/Base combinations initiative (Using old way for now for everyone).
                $(".kpi-display").show();
                $(".date-display").show();
                $(".dashboard-legacy-view-buttons").show();
                $(".dashboard-views-v2").hide();

                $("#rdoBase,#rdoBaseLabel").show();
                $("#rdoTrend,#rdoTrendLabel").show();

                if ((a$.urlprefix() == "km2.") || (a$.urlprefix().indexOf("km2-make40.") >= 0) ||
                    (((a$.urlprefix() == "cox.") || (a$.urlprefix() == "v3.") || (a$.urlprefix().indexOf("cox-make40") >= 0)) &&
                    ($.cookie("TP1Role") != "CSR") && ($.cookie("TP1Role") != "Team Leader"))) {
                    $("#rdoPay,#rdoPayLabel").hide();
                    if (FIRSTPASS) {
                        FIRSTPASS = false;
                        document.getElementById("rdoBase").checked = true;
                    }
                    else {
                        document.getElementById("rdoTrend").checked = true;
                    }
                }
                else if ((a$.urlprefix() == "ces.") || (a$.urlprefix().indexOf("ces-make40.") >= 0)) {
                    $("#rdoPay,#rdoPayLabel").hide();
                    document.getElementById("rdoBase").checked = true;
                } else if ((a$.urlprefix() == "chime.") || (a$.urlprefix().indexOf("chime-make40") >= 0)) {
                    $("#rdoPay,#rdoPayLabel").hide();
                    document.getElementById("rdoBase").checked = true;
                } else if ((a$.urlprefix() == "cox.") || (a$.urlprefix().indexOf("cox-make40") >= 0)) {
                    $("#rdoPay,#rdoPayLabel").hide();
                    document.getElementById("rdoBase").checked = true;
                }
                else {
                    $("#rdoPay,#rdoPayLabel").show();
                    document.getElementById("rdoBase").checked = true;
                }
                $("#rdoGrid,#rdoGridLabel").show(); //Showing GRID label everywhere now.

                /* --Remove if all checks out above:
                if ((a$.urlprefix() == "ers.") || (a$.urlprefix().indexOf("make40") >= 0)) {
                //$("#rdoGrid,#rdoGridLabel").hide();
                //$("#rdoGrid,#rdoGridLabel").show(); //debug temp
                document.getElementById("rdoBase").checked = true;
                } else if ((a$.urlprefix() == "bgr.") || (a$.urlprefix().indexOf("bgr-make40") >= 0)) {
                //$("#rdoGrid,#rdoGridLabel").hide();
                } else if ((a$.urlprefix() == "chime.") || (a$.urlprefix().indexOf("chime-make40") >= 0)) {
                $("#rdoPay,#rdoPayLabel").hide();
                //$("#rdoGrid,#rdoGridLabel").show();
                document.getElementById("rdoBase").checked = true;
                } else {
                $("#rdoPay,#rdoPayLabel").hide();
                //$("#rdoGrid,#rdoGridLabel").hide();
                }
                */

                appApmDashboard.setCookiePrefix("ED");
                $("#showpay").css("display", "inline");
                if ((a$.urlprefix() == "chime.") || (a$.urlprefix().indexOf("chime-make40") >= 0)) {
                    $("#csrlabel").html("Consultant");
                }
                else {
                    $("#csrlabel").html("CSR");
                }
                $("#csrlabel").show();
                $("#csrfilter,#filtersdiv").show();
                $("#grouplabel,#groupfilter,#teamlabel,#teamfilter").show();
                $("#projectlabel,#projectfilter,#locationlabel,#locationfilter").show();
                $("#agencylabel,#agencyfilter,#agencyofficelabel,#agencyofficefilter").hide();
                if ($.cookie("ApmInDallas") != null)
                    if ($.cookie("ApmInDallas") != "") $("#showpay").css("display", "none");
                $("#StgHireDatesFilter select").trigger("change");

                //TODO: Remove All and Each from Project.

                $(".attrition-hide").show();
                $("#gaugesdiv").show();
                $(".attrition-show").hide();
                $(".attrition-show-hi").show();
                $(".attrition-show-loc").hide();

                if ((a$.urlprefix() == "chime.") || (a$.urlprefix().indexOf("chime-make40.") >= 0)) { //Set location to 1 (Morrow)
                    $("#selLocations").val("1").trigger("liszt:updated");
                    $("#locationlabel,#locationfilter").hide();
                }

                break;
            case "Reports":
                //The reports DRIVE the filters in this case.  appApmDashboard.setSuppressBoxList(""); //TODO: Special filters will apply based on reports, I'm sure.
                appApmDashboard.setSpecialFlagsList("");

                $(".kpi-display").show();
                $(".date-display").show();

                $(".attrition-hide").show();
                $(".attrition-show").hide();
                $(".attrition-show-hi").show();
                $(".attrition-show-loc").hide();
                $("#gaugesdiv").hide();

                $("#rdoBase,#rdoBaseLabel").hide();
                $("#rdoTrend,#rdoTrendLabel").hide();
                $("#rdoPay,#rdoPayLabel").hide();
                $("#rdoGrid,#rdoGridLabel").show();
                document.getElementById("rdoGrid").checked = true;

                if ((a$.urlprefix() == "chime.") || (a$.urlprefix().indexOf("chime-make40") >= 0)) {
                    $("#csrlabel").html("Consultant");
                }
                else {
                    $("#csrlabel").html("CSR");
                }
                $("#csrlabel").show();
                $("#csrfilter,#filtersdiv").show();
                $("#grouplabel,#groupfilter,#teamlabel,#teamfilter").show();
                $("#projectlabel,#projectfilter,#locationlabel,#locationfilter").show();
                $("#agencylabel,#agencyfilter,#agencyofficelabel,#agencyofficefilter").hide();
                $("#StgHireDatesFilter select").trigger("change");

                //DONE: If not already there, add an (All) and (Each) to the project.
                //UNLESS THE user is restricted.

                var filteredproject = false;
                if ($.cookie("ApmProjectFilter") != null) {
                    if (($.cookie("ApmProjectFilter") != "none") && ($.cookie("ApmProjectFilter") != "") && ($.cookie("ApmProjectFilter") != "ALL-READONLY")) {
                        filteredproject = true;
                    }
                }
                if (!filteredproject) {
                    if (($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin") || ($.cookie("TP1Role") == "Management") || ($.cookie("TP1Role") == "Quality Assurance") || ($.cookie("TP1Role") == "Team Leader")) {

                        if ((a$.urlprefix() == "cox.") && ($.cookie("TP1Role") == "Team Leader")) { //MADEDEV
                        }
                        else {

                            if ($("#selProjects").find('option[value=""]').length == 0) {
                                $("#selProjects").append('<option value="">(All)</option>');
                                $("#selProjects").append('<option value="each">(Each)</option>');
                                $("#selProjects").trigger("liszt:updated");
                            }

                            //TODO:  This is overkill (resetting all filters whenever you come back), but there's a bug that's loading both "All" and "Each" somewhere.
                            //Set up defaults (TODO: should be done via CDS in the future)
                            $("#selProjects option:selected").prop("selected",false);
                            $("#selProjects").val("");
                            $("#selLocations option:selected").prop("selected",false);
                            $("#selLocations").val("");
                            $("#selGroups option:selected").prop("selected",false);
                            $("#selGroups").val("");
                            $("#selTeams option:selected").prop("selected",false);
                            $("#selTeams").val("");
                            $("#selCSRs option:selected").prop("selected",false);
                            $("#selCSRs").val("");

                            $("#selPayperiods option").each(function () {
                                if ($(this).html() == "Current Month") {
                                    $("#selPayperiods").val($(this).val());
                                }
                            });
                                                    
                        }
                    }
                }

                if ((a$.urlprefix() == "chime.") || (a$.urlprefix().indexOf("chime-make40.") >= 0)) { //Set location to 1 (Morrow)
                    $("#selLocations").val("1").trigger("liszt:updated");
                    $("#locationlabel,#locationfilter").hide();
                }

                //TODO: Suppress filters if they are in the suppress list.
                var ss = appApmDashboard.getSuppressBoxList().split(",");
                for (var s in ss) {
                    switch (ss[s]) {
                        case "CSR":
                            $("#csrlabel").hide();
                            $("#csrfilter,#filtersdiv").hide();
                            break;
                        case "Team":
                            $("#teamlabel,#teamfilter").hide();
                            break;
                        case "Group":
                            $("#grouplabel,#groupfilter").hide();
                            break;
                        case "Location":
                            $("#locationlabel,#locationfilter").hide();
                            break;
                        case "Project":
                            $("#projectlabel,#projectfilter").hide();
                            break;
                        case "KPI":
                            $(".kpi-display").hide();
                            break;
                        case "SubKPI":
                            $(".subkpi-display").hide();
                            break;
                        case "Payperiod":
                            $(".date-display").hide();
                            break;
                    }
                }
                break;
            case "Agent_Attrition":
                appApmDashboard.setSuppressBoxList("CSR");
                appApmDashboard.setSpecialFlagsList("loadperiods=Month");

                $(".kpi-display").hide();
                $(".date-display").show();
                $(".attrition-hide").show();
                $(".attrition-show").hide();
                $(".attrition-show-hi").show();
                $(".attrition-show-loc").hide();
                $("#gaugesdiv").hide();

                $("#rdoBase,#rdoBaseLabel").hide();
                $("#rdoTrend,#rdoTrendLabel").hide();
                $("#rdoPay,#rdoPayLabel").hide();
                $("#rdoGrid,#rdoGridLabel").show();
                document.getElementById("rdoGrid").checked = true;

                appApmDashboard.setCookiePrefix("ED");
                $("#csrlabel").html("");
                $("#csrlabel").hide();
                $("#csrfilter,#filtersdiv").hide();
                $("#grouplabel,#groupfilter,#teamlabel,#teamfilter").show();
                $("#projectlabel,#projectfilter,#locationlabel,#locationfilter").show();
                if ((a$.urlprefix() == "chime.") || (a$.urlprefix().indexOf("chime-make40.") >= 0)) {
                }
                else {
                    $("#agencylabel,#agencyfilter").show();
                }
                $("#StgHireDatesFilter select").trigger("change");

                //DONE: If not already there, add an (All) and (Each) to the project.
                //UNLESS THE user is restricted.


                var filteredproject = false;
                if ($.cookie("ApmProjectFilter") != null) {
                    if (($.cookie("ApmProjectFilter") != "none") && ($.cookie("ApmProjectFilter") != "") && ($.cookie("ApmProjectFilter") != "ALL-READONLY")) {
                        filteredproject = true;
                    }
                }
                if (!filteredproject) {
                    if (($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin") || ($.cookie("TP1Role") == "Management") || ($.cookie("TP1Role") == "Quality Assurance") || ($.cookie("TP1Role") == "Team Leader")) {
                        if ($("#selProjects").find('option[value=""]').length == 0) {
                            $("#selProjects").append('<option value="">(All)</option>');
                            $("#selProjects").append('<option value="each">(Each)</option>');
                            $("#selProjects").trigger("liszt:updated");
                            //TODO: NOTE: This is really handled in appApmDashboard (look for global_currentfilter)
                            //Set up defaults (TODO: should be done via CDS in the future)
                            $("#selProjects").val("");
                            $("#selLocations").val("each");
                            $("#selGroups").val("");
                            $("#selTeams").val("");
                            $("#selCSRs").val("");
                        }
                        $("#selPayperiods option").each(function () {
                            if ($(this).html() == "Current Month") {
                                $("#selPayperiods").val($(this).val());
                            }
                        });
                    }
                }
                break;

            case "Supervisor":
                appApmDashboard.setSuppressBoxList("");
                appApmDashboard.setSpecialFlagsList("");

                $(".kpi-display").show();
                $(".date-display").show();
                $("#rdoBase,#rdoBaseLabel").show();
                $("#rdoTrend,#rdoTrendLabel").show();
                $("#rdoPay,#rdoPayLabel").hide();
                $("#rdoGrid,#rdoGridLabel").show(); //MADELIVE

                //TODO: Remove All and Each from Project.

                $(".subkpi-display").hide();
                $("#selSubKPIs").html("");
                appApmDashboard.setCookiePrefix("TD");
                $("#csrlabel").html("");
                $("#csrlabel").hide();
                $("#csrfilter,#filtersdiv,#hiredatelabel,#hiredatefilter").hide();
                $("#agencylabel,#agencyfilter,#agencyofficelabel,#agencyofficefilter").hide();
                $("#attritiontab,#attritiondiv").show();
                $("#grouplabel,#groupfilter,#teamlabel,#teamfilter").show();
                $("#projectlabel,#projectfilter,#locationlabel,#locationfilter").show();
                $("#StgHireDatesFilter select").trigger("change");

                document.getElementById("rdoBase").checked = true;
                break;
            case "Source":
            case "Attrition":
                /*
                if ((a$.urlprefix() == "ers.") || (a$.urlprefix().indexOf("make40") >= 0)) {
                $("#rdoGrid,#rdoGridLabel").show();
                document.getElementById("rdoGrid").checked = true;
                $("#rdoGrid").trigger("click");
                if (firsttimeongrid) {
                appApmDashboard.plotme(0, true, false);
                firsttimeongrid = false;
                }
                }
                */
                appApmDashboard.setSuppressBoxList("");
                appApmDashboard.setSpecialFlagsList("");

                $(".kpi-display").show();
                $(".date-display").show();
                $("#rdoBase,#rdoBaseLabel").show();
                $("#rdoTrend,#rdoTrendLabel").show();
                $("#rdoPay,#rdoPayLabel").hide();
                $("#rdoGrid,#rdoGridLabel").hide();

                $(".subkpi-display").hide();
                $("#selSubKPIs").html("");
                appApmDashboard.setCookiePrefix("SD");
                $("#showpay").css("display", "none");
                $("#csrlabel").html("Agent");
                $("#csrlabel").show();
                $("#csrfilter,#filtersdiv").show();
                $("#grouplabel,#groupfilter,#teamlabel,#teamfilter").hide();
                $("#projectlabel,#projectfilter,#locationlabel,#locationfilter").show();
                if ((a$.urlprefix() == "chime.") || (a$.urlprefix().indexOf("chime-make40.") >= 0)) {
                }
                else {
                    $("#agencylabel,#agencyfilter").show();
                }
                $("#hiredatelabel,#hiredatefilter").show();

                document.getElementById("rdoBase").checked = true; //TODO: check on whatever was set before, provided it's an allowed radio button.

                break;
            case "AttritionManagement":
                if (location.hash != "#Scoring") {
                    /*
                    if (false) { //($("#StgDashboard select").val() != "Agent") {
                    //Had to discontinue because the filters aren't updated (for viewparams) before attrition/gettable is called.
                    //They'll have to receive the message and manually send it back.  No big deal.
                    $("#StgDashboard select").val("Agent");
                    $("#StgDashboard .ui-slider-handle").css("left","0%"); //Really bad.  4/20/2017 First time ever dynamically moving a slider (need a better way).
                    setDashboardFilters("Agent_Attrition");
                    //alert("debug:testing changing of dashboard slider 9");
                    }
                    */
                    $(".kpi-display").hide();
                    $(".date-display").show();
                    $(".attrition-hide").hide();
                    $(".attrition-show").show();
                    $("#StgAttritionSearch select").trigger("change");
                    $("#StgAttritionTest select").trigger("change");
                    $("#agencylabel,#agencyfilter,#agencyofficelabel,#agencyofficefilter").hide();
                    if (global_attritiontestingvisible) {
                        $(".attrition-show-testing").show();
                    } else {
                        $(".attrition-show-testing").hide();
                    }
                }
                $("#selPayperiods option").each(function () {
                    if ($(this).html() == "Current Pay Period") {
                        $("#selPayperiods").val($(this).val());
                    }
                });

                document.getElementById("rdoBase").checked = true; //In case it was grid.
                break;
            case "AttritionReports":
                if (location.hash != "#Scoring") {
                    $(".kpi-display").hide();
                    $(".date-display").show();
                    $(".attrition-hide").show();
                    $(".attrition-show").hide();
                    $(".attrition-show-hi").show();
                    $(".attrition-show-loc").hide();
                    $("#agencylabel,#agencyfilter,#agencyofficelabel,#agencyofficefilter").hide();
                    $("#attritiontab,#attritiondiv").show();
                    $("#grouplabel,#groupfilter,#teamlabel,#teamfilter").show();
                    $("#projectlabel,#projectfilter,#locationlabel,#locationfilter").show();
                }
                break;
            case "Program":
                $(".subkpi-display").hide();
                $("#selSubKPIs").html("");
                //alert("Program/Financial Views are currently being migrated."); $("#StgDashboard select").val("Agent"); break;
                appApmDashboard.setCookiePrefix("PD");
                $("#showpay").css("display", "none");
                $("#csrlabel").html("View");
                break;
            case "Financial":
                $(".subkpi-display").hide();
                $("#selSubKPIs").html("");
                alert("Program/Financial Views are currently being migrated.");
                $("#StgDashboard select").val("Agent");
                break;
                appApmDashboard.setCookiePrefix("FD");
                $("#showpay").css("display", "none");
                $("#csrlabel").html("View");
                break;
        };
        if (true) { //}((filter != "AttritionManagement") /* && (filter != "Agent_Attrition") */ ) {
            appApmDashboard.initcontrols();
        }
    }

    function plotIntercept(viewindex, reset, supresstools) {
        switch (current_filter) {
            case "Agent_Attrition":
                showReport("AttritionGrid", ".AttritionReports", "Grid");
                break;
            case "Reports":
            default: //ALWAYS CALL
                if ($("#ReportReportList select").val() != "") {
                    //alert("debug: 4suppress list = " + $("#ReportReportList select option[value='" + $("#ReportReportList select").val() + "']").attr("suppress_list"));
                    appApmDashboard.setSuppressBoxList($("#ReportReportList select option[value='" + $("#ReportReportList select").val() + "']").attr("suppress_list"));
                    setSuppressMenuList($("#ReportReportList select option[value='" + $("#ReportReportList select").val() + "']").attr("suppress_menus"));
                    showReport($("#ReportReportList select").val(), ".ReportReports", "Grid");
                }
                else {
                    alert("debug:No report selected, not sure how we want to route this");
                }
                break;
            /* //NEVER CALL
            default:
                appApmDashboard.plotme(viewindex, reset, supresstools);
                break;
            */
        }
    }


    function currentFilter() {
        return current_filter;
    }


    function exists(me) {
        return (typeof me != 'undefined');
    }

    function IsObject(obj) {
        return obj ? true : false;
    }

    function setSuppressMenuList(lst) {
        $(".report-intraining-wrapper,.report-grouping-wrapper,.report-show-wrapper").show();
        var ls = lst.split(",");
        for (var l in ls) {
            switch (ls[l]) {
                case "intraining":
                    $(".report-intraining-wrapper").hide();
                    break;
                case "grouping":
                    $(".report-grouping-wrapper").hide();
                    break;
                case "show":
                    $(".report-show-wrapper").hide();
                    break;
            }
        }
        //alert("debug: suppressing menu items: " + lst);
    }

    function setLegendDisplay(chart,maximized) {
        if (a$.exists(chart.legend)) {
            if (maximized) {
                chart.legend.enabled = true;
            }
            else {
                chart.legend.enabled = false;
            }
        }
    }

    // global variables
    window.appApmReport = {
        init: init,
        setDashboardFilters: setDashboardFilters,
        currentFilter: currentFilter,
        plotIntercept: plotIntercept
    };

})();
