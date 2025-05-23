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
var FIRSTPASS = true;
var FIRSTPASSFILTERS = true;
var savedfilter = ""; //MAKEFILTER
var once = 0;
var currentUid = "";
var global_attritiontestingvisible = false; //?

(function () {
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
            return (t.replace('$', '').replace(',', '')); //MADEDEV
        }
        return t;
    }

    function rdoclick(myrdo) {
        if (a$.gup("oldfilters") != "Y") {
            if (!document.getElementById(myrdo).checked) {
                $("#" + myrdo).trigger("click");
            }
        }
        else {
            document.getElementById(myrdo).checked = true;
        }
    }

    //MADELIVE: Replace this.
    var myTextExtraction = function (node) { //Looking for the html in an anchor or the entire text.
        var a = $(" a", node);
        if (a.length > 0) {
            return nodollar($(a).html());
        }
        else {
            var tl = $(".report-titlelink,.bal-colorme,.bal-colored,.rpt-colorme,.rpt-colored", node);
            if (tl.length > 0) {
                return nodollar($(tl).html());
            }
            else {
                return nodollar($(node).html());
            }
        }
    }

    function printReport(sel) {
        /*
        var mywindow = window.open('', 'PRINT', 'height=1000,width=1000');  //var mywindow = window.open('', 'PRINT', 'height=400,width=600');

        mywindow.document.write('<html><head><title>' + document.title + '</title>');
        mywindow.document.write('</head><body >');
        mywindow.document.write('<h1>' + document.title + '</h1>');
        mywindow.document.write($(sel).html());
        mywindow.document.write('</body></html>');

        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10

        mywindow.print();
        mywindow.close();
        */
        window.print();
        return true;
    }

    function showReport(cid, sel, displaytype, hidetransfer) {
        //TODO: Should displaytype be sent to getreport, or returned?
        //It's currently sent, but may want to change this.

        appApmDashboard.bubblerank(true);

        //MADEDEV
        var externalDelivery="N";
        if (cid.indexOf("?") > 0) { 
            var cs = cid.split("?");
            cid = cs[0];
            var ps = cs[1].split("&");
            for (var p in ps) {
                var pss = ps[p].split("=");
                if (pss[0] == "offerExternalDelivery") {
                    if (pss[1] == "Y") {
                        if (confirm("This report can be sent directly to your email instead of displaying it on the screen.\nChoose OK to send this report to your email, Cancel to display in the browser.")) {
                            externalDelivery = "Y";
                        }
                    }
                    if (pss[1] == "S") {
                        alert("debug: Offering External Delivery if size is over a certain amount (in dev).");
                    }
                }
            }
        }

        //alert("debug1b: filter status:" + $("#loader_filters").html());
        if ($("#loader_filters").html() != "CONFIRMED") return; //Insufficient for partial loadings
        //alert("debug: csr text = " + $("#selCSRs option:selected").text());
        //2022-06-06 - Special preventions while searching for loading issue.
        if ($("#selProjects option:selected").text() == "..loading") return;
        if ($("#selLocations option:selected").text() == "..loading") return;
        if ($("#selGroups option:selected").text() == "..loading") return;
        if ($("#selTeams option:selected").text() == "..loading") return;
        if ($("#selCSRs option:selected").text() == "..loading") return;
        
        //Dlambert troubleshooting
        if (a$.urlprefix() == "performant.") {            
            try {
                if ($("#selProjects").val() == "") return;
                var tp = $("#selPayperiods").val();
                var tps = tp.split(",");
                if ((tps[2] == "1") && (a$.urlprefix() == "performant.")) return; //duck
            } catch (err) { }
        }

        a$.showprogress("plotprogress");

        a$.ajax({
            type: "POST",
            service: "JScript",
            async: true,
            data: {
                lib: "editor",
                cmd: "getreport",
                performanceColors: window.apmPerformanceColors, //MADELIVE
                grouping: $("#StgReportGrouping select").val(),
                scoremodel: $("#StgReportScoreModelID select").val(),
                cid: cid,
                externalDelivery: externalDelivery, //MADEDEV
                dashboard: $("#StgDashboard select").val(),
                displaytype: displaytype,
                context: displaytype,
                rootbuild: true //MADEDEVNOW2
            },
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            params: appApmDashboard.viewparams(0, false)
                    + ((document.getElementById("StgInTraining") != null) ? "&InTraining=" + $("#StgInTraining select").val() : "")
                    + ((document.getElementById("StgAgentStatus") != null) ? "&AgentStatus=" + $("#StgAgentStatus select").val() : "")
                    + ((document.getElementById("StgScorecard") != null) ? "&scorecard=" + $("#StgScorecard select").val() : "")
                    + ((document.getElementById("selQualityforms") != null) ? "&Qualityform=" + $("#selQualityforms").val() : "")
            ,
            success: loadedReport //MADELIVE
        });
        //TODO: first parameter of viewparams is viewindex, and it's always 0.
        //Does this have meaning going forward?

        function loadedReport(json) {
            savedfilter = ""; //MAKEFILTER - The filter value isn't changed, and this will cause the filter to fire.
            a$.hideprogress("plotprogress");
            if (a$.jsonerror(json)) { } else {
                if (json.report.show) {
                    //Single panel
                    for (var i in json.report.panel) {
                        var preservepanel = false; //MADELIVE (probably this entire loop)
                        var is = "";
                        var panelfill = false; //MADELIVE MADEDEV
                        //$((is != "") ? is : sel).html(json.report.panel[i].html).show();
                        if (exists(json.report.panel[i].injectSelector)) {
                            if (json.report.panel[i].injectSelector != "") {
                                is = json.report.panel[i].injectSelector;
                                if (json.report.panel[i].panelFill) panelfill = true;
                            }
                        }
                        if ((is == "") && (i == 0)) {
                            $(sel).html(json.report.panel[i].html);
                            if (!hidetransfer) {
                                $(sel).show();
                            }
                            //Added: 2019-09-18 - Jam in a record count for performant (as a test). MADEDEV
                            if ((a$.urlprefix() == "performant.") || (a$.urlprefix() == "performant-mnt.")) {
                                $(".rpt-title",sel).html($(".rpt-title",sel).html() + '<span style="padding-left: 30px;font-size:9px;">Record Count: ' + $("tbody tr",sel).length + '</span>');
                            }
                        }
                        else if (is != "") {
                            var aborttip = false;
                            if (is == ".tbl-mytip") {
                                if (json.overrideUid != currentUid) {
                                    $('.tbl-mytip',sel).html("").hide();
                                    aborttip = true;
                                }
                            }
                            //TODO: See if you can do a resize here. //MADELIVE
                            if (exists(json.report.panel[i].preservePanel)) {
                                if (json.report.panel[i].preservePanel) {
                                    preservepanel = true;
                                }
                            }
                            if (!preservepanel) {
                                if (!aborttip) {
                                    $(is).html(json.report.panel[i].html).show();
                                    if (is == ".tbl-mytip") {
                                        //If you ever SUCCESSFULLY show a tooltip, assume that all title links should be disabled in the current grid.
                                        $(".report-titlelink", sel).each(function() {
                                            $(this).removeAttr("title")
                                        });
                                    }
                                    //Added: 2019-09-18 - Jam in a record count for performant (as a test). MADEDEV
                                    if ((a$.urlprefix() == "performant.") || (a$.urlprefix() == "performant-mnt.")) {
                                        $(".rpt-title",is).html($(".rpt-title",is).html() + '<span style="padding-left: 30px;font-size:9px;">Record Count: ' + $("tbody tr",is).length + '</span>');
                                    }
                                    //MADENEWLIVE MADEDEVNOW2
		                            if (json.report.panel[i].popup) {
    		                          	$(is).closest(".rpt-popup-" + json.report.panel[i].popup).show().draggable();
	    	                        }
                                }
                            }
                            if (exists(json.report.panel[i].resizePanelHtml)) {
                                
                            }
                        }
                        else {
                            $(sel).append(json.report.panel[i].html).show();
                        }

                        //For V2 only, hide the calendar control for ERS FOR NOW.
                        
                        if (false) { //(a$.urlprefix() == "ers.") { //(is == "") {
                            $(" .rpt-filter-daterange-icon",sel).hide();
                        }

                        //MADELIVE MADEDEV
                        if (exists(json.report.panel[i].loadPanel)) {
                            $(".progresspanel").spin("large","#EF4521");
                            var fp = overrideparams(appApmDashboard.viewparams(0, false),json.report.panel[i].loadPanel.params);
                            a$.ajax({
                                type: "POST",
                                service: "JScript",
                                async: true,
                                data: {
                                    lib: "editor",
                                    cmd: "getreport",
                                    performanceColors: window.apmPerformanceColors, //MADELIVE
                                    grouping: $("#StgReportGrouping select").val(),
                                    scoremodel: $("#StgReportScoreModelID select").val(),
                                    cid: json.report.panel[i].loadPanel.cid,
                                    injectSelector:  json.report.panel[i].loadPanel.sel,
                                    dashboard: $("#StgDashboard select").val(),
                                    displaytype: displaytype,
                                    context: displaytype
                                },
                                dataType: "json",
                                cache: false,
                                error: a$.ajaxerror,
                                params: fp
                                    + ((document.getElementById("StgInTraining") != null) ? "&InTraining=" + $("#StgInTraining select").val() : "")
                                    + ((document.getElementById("StgAgentStatus") != null) ? "&AgentStatus=" + $("#StgAgentStatus select").val() : "")
                                    + ((document.getElementById("StgScorecard") != null) ? "&scorecard=" + $("#StgScorecard select").val() : "")
                                    + ((document.getElementById("selQualityforms") != null) ? "&Qualityform=" + $("#selQualityforms").val() : "")
                                    ,
                                success: loadedReport
                            });

                            //alert("debug: loading panel into: " + json.report.panel[i].loadPanel.sel);
                        }
                        else { //This is a VERY long else. MADELIVE
                            var p = i;
                            if (!preservepanel) {
                                for (var t in json.report.panel[p].tables) {
                                    $(".expander", json.report.panel[p].tables[t].sel).unbind().bind("click", function (e) {
                                        expandme(this);
                                    });
                                    //MADEDEV
                                    if ((t+1) == json.report.panel[p].tables.length) { //Just do this once, right?
                                        if (exists(json.report.panel[p].injectSelector)) {
                                            $(".expander", json.report.panel[p].injectSelector).each(function () {
                                                expandme(this, json.report.panel[p].tables[t].expandIndexes);
                                            });
                                        }
                                        else {
                                            $(".expander", json.report.panel[p].tables[t].sel).each(function () {
                                                expandme(this, json.report.panel[p].tables[t].expandIndexes);
                                            });
                                        }
                                    }
                                
                                    if (a$.exists(json.report.panel[p].tables[t].sort)) {
                                        if ($(" .acuity-tablesorter>thead>tr", json.report.panel[p].tables[t].sel).length > 1) {
                                            $(" th",$(" .acuity-tablesorter>thead>tr", json.report.panel[p].tables[t].sel).first()).each(function() {
                                                $(this).addClass("{sorter: false}");
                                            });
                                        }
                                        $(".acuity-tablesorter", json.report.panel[p].tables[t].sel).each(function () {
                                            $(this).tablesorter({ textExtraction: myTextExtraction });
                                            //alert("debug:adding sort to table4");

                                            var foundsubfield = false;
                                            $(".rpt-subfieldlist", this).each(function() {
                                                foundsubfield = true;
                                                if ($(this).prop("tagName") != "INPUT") {
                                                    $(this).html($(this).html().replace(/,/g,'<br />'));
                                                }
                                                else {
                                                    $(this).attr("placeholder","+").css("text-align","left");
                                                    if ($(this).val() != "") {
                                                        var vs = $(this).val().split(",");
                                                        $(this).val("");
                                                        $(this).attr("value",""); //why is this necessary?
                                                        for (var vi = vs.length - 1;vi >= 0; vi--) {
                                                            $(this).parent().prepend('<div class="rpt-subfieldrecord" style="position:relative;display:block;"><span class="rpt-subfieldentry">' + vs[vi] + '</span>&nbsp;&nbsp;&nbsp;&nbsp;<span title="Remove Entry" style="cursor:pointer;font-weight: bold;position:absolute;top:0px;right:0px;height:10px;width:10px;" class="rpt-subfieldremove">-</span></div>');
                                                        }
                                                    }
                                                }
                                            });
                                            if (foundsubfield) {
                                                $(".rpt-subfieldremove").unbind().bind("click", function() {
                                                    $(this).prev().removeClass("rpt-subfieldentry");
                                                    var myval = "";
                                                    $(".rpt-subfieldentry",$(this).parent().parent()).each(function() {
                                                        if (myval != "") myval += ",";
                                                        myval += $(this).html();
                                                    });
                                                    var p = $(this).parent().parent();
                                                    $(".rpt-subfieldrecord", p).remove();
                                                    $(".rpt-subfieldlist", p).val(myval).trigger("change");
                                                });
                                            }

                                            $(".bal-colorme", this).each(function () {
                                                var vc;
                                                if ($(this).attr("bal")) {
                                                    vc = parseFloat($(this).attr("bal"));
                                                }
                                                else {
                                                    vc = parseFloat($(this).html());
                                                }
                                                var color = "white";
                                                var textColor = "black";
                                                for (var ci in window.apmPerformanceColors) {
                                                    if (vc >= window.apmPerformanceColors[ci].threshold) {
                                                        color = window.apmPerformanceColors[ci].color;
                                                        textColor = a$.exists(window.apmPerformanceColors[ci].textColor) ? window.apmPerformanceColors[ci].textColor : "#FEFEFE";
                                                        break;
                                                    }
                                                }
                                                $(this).removeClass("bal-colorme").addClass("bal-colored").css("color", textColor).css("font-weight", "bold");
                                                $(this).parent().css("background-color", color);
                                            });
                                            $(".rpt-colorme", this).each(function () {
                                                var color = "white";
                                                var textColor = "black";
                                                if ($(this).attr("color")) {
                                                    color = $(this).attr("color");
                                                }
                                                if ($(this).attr("textcolor")) {
                                                    textColor = $(this).attr("textcolor");
                                                }
                                                $(this).removeClass("rpt-colorme").addClass("rpt-colored").css("color", textColor).css("font-weight", "bold");
                                                $(this).parent().css("background-color", color);
                                            });
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

                                    //MADE2DEV2
                                    $("tbody td", json.report.panel[p].tables[t].sel).unbind(); //Clear it up
                                    var tabletooltipfound = false;
                                    $("thead .tbl-tabletooltip", json.report.panel[p].tables[t].sel).each(function() {
                                        tabletooltipfound = true;
                                    });
                                    $("thead .tbl-ttt", json.report.panel[p].tables[t].sel).each(function() {
                                        tabletooltipfound = true;
                                    });
                                    var drillkeyfound = false;
                                    var servicekeyfound = false; //MADEDEV
                                    $("thead .tbl-drillkey", json.report.panel[p].tables[t].sel).each(function() {
                                        drillkeyfound = true;
                                    });
                                    $("thead .tbl-dk", json.report.panel[p].tables[t].sel).each(function() {
                                        drillkeyfound = true;
                                    });
                                    $("thead .tbl-sk", json.report.panel[p].tables[t].sel).each(function() { //MADEDEV
                                        servicekeyfound = true;
                                    });
                                    if (tabletooltipfound || drillkeyfound || servicekeyfound) { //MADEDEV
                                        //Sick of qtip.
                                        $(".tbl-mytip",sel).remove();
                                        $(sel).append('<div class="tbl-mytip" style="position:fixed;opacity:0.8;display:none;z-index:9999;">My Tool Tip</div>');
                                        //MADEDEV (add .report-titlelink selector)
                                        $("tbody td"/*TEMPREMOVE:,tbody td .report-titlelink"*/, json.report.panel[p].tables[t].sel).unbind().bind("mouseenter", function(event) {
                                            var bld = "";
                                            currentUid = a$.guid();
                                            var selcolname = $(" th", $(" thead tr", $(this).parent().parent().parent()).last()).eq($(this).index()).html(); //MADEDEV
                                            if (selcolname.indexOf("report-titlelink") > 0) {
                                                selcolname = $(".report-titlelink",$(" th", $(" thead tr", $(this).parent().parent().parent()).last()).eq($(this).index())).html(); //MADEDEV
                                            }
                                            //MADEDEV
                                            var tsel = null;
                                            if (selcolname != null) {
                                                $(".tbl-ttt-" + selcolname.replace(/ /g,"-"),$(this).parent()).each(function() {
                                                    bld = $(this).html();
                                                    tsel = this;
                                                });
                                            }
                                            if (bld == "") {
                                                $(".tbl-tabletooltip",$(this).parent()).each(function() {
                                                    bld = $(this).html();
                                                    tsel = this;
                                                });
                                            }
                                            if (bld != "") {
                                                var left = event.pageX + 50;
                                                var top = event.pageY - 20;
                                                if ((top + 300) >= window.innerHeight) top -= 300;
                                                if ((left + 275) >= window.innerWidth) left -= 400;
                                                if (bld.indexOf("GET:") == 0) {
                                                    if ($(this).html() != "-1000") {
                                                        $('.tbl-mytip',sel).html("").css({top: top,left: left}).show();
                                                        clicked_drill_td(this,false,true);
                                                    }
                                                    else {
                                                        $('.tbl-mytip',sel).hide();
                                                    }
                                                }
                                                else {
                                                    $('.tbl-mytip',sel).html(bld).css({top: top,left: left}).show();
                                                }
                                            }
                                            else {
                                                $('.tbl-mytip',sel).hide();
                                            }
                                            var pointer = false;
                                            //MADEDEV
                                            if (selcolname != null) {
                                                $(".tbl-dk-" + selcolname.replace(/[ ,(,),+]/g,"-"),$(this).parent()).each(function() {
                                                    //bld = $(this).html();
                                                    pointer = true;
                                                });
                                            }
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
                                        }).bind("mouseout mouseleave", function() {
                                            currentUid = a$.guid();
                                            $(".tbl-mytip",sel).hide();
                                        });                                            
                                    }

                                    //MADEDEV
                                    $(".report-input-service",sel).unbind().bind("change",function(event) {
                                        var myservice = $(this).attr("service");
                                        appApmContentTriggers.process(myservice, this, event);
                                    });
                                    //MADEDEV  MAKELIVE
                                    $(".report-click-service",sel).unbind().bind("click",function(event) {
                                        var myservice = $(this).attr("service");
                                        appApmContentTriggers.process(myservice, this, event);
                                    });
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
                                var title = $(".rpt-title", $(this).parent()).html();
                                var cid = $(this).attr("download-cid");
                                if (a$.exists(cid)) {
                                    if (cid != "") {
                                        title = cid + '-' + title;
                                    }
                                }
                                appApmDashboard.acuitytable_download("csv", $(this).parent().parent().children().eq($(this).parent().index() + 1),title);
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
                                        $(this).removeClass("rpt-max-link-minus").addClass("rpt-max-link-plus");
                                        //FIX:
                                        $(".rpt-panel").each(function() {
                                            if (!$(this).hasClass("rpt-panel-popup")) {
                                                $(this).show();
                                            }
                                        });
                                    }
                                    else {
                                        maximized = true;
                                        $(this).parent().addClass("rpt-panel-maximized");
                                        $(this).attr("title","Restore Panel"); //MADELIVE:
                                        $(this).html(""); //Restore
                                        $(this).addClass("rpt-max-link-minus").removeClass("rpt-max-link-plus")
                                        //FIX:
                                        $(".rpt-panel").each(function() {
                                            if (!$(this).hasClass("rpt-panel-popup")) {
                                                $(this).hide();
                                            }
                                        });
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
                                
                            //MADELIVE: New section for the intervals. //MADELIVE - unbind click only. 
                            $(".rpt-filter-interval", $((is != "") ? is : sel)).unbind("click").bind("click", function () {
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
                            
                            function clicked_drill_td(me,wholepanel,tooltip) {
                                var finalparams = "";
                                var filterkey = "";
                                var key = "";
                                var drillkey = "";  //MADELIVENOW
                                var servicekey = ""; //MADEDEV
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

                                    //MADELIVENOW

                                    //MADE2DEV2
                                    //WAS: var selcolname = $(" th", $(" thead tr", $(me).parent().parent().parent()).last()).eq($(me).index()).html();
                                    //IS:
                                    var selcolname = $(" th", $(" thead tr", $(me).parent().parent().parent()).last()).eq($(me).index()).html(); //MADEDEV
                                    if (selcolname.indexOf("report-titlelink") > 0) {
                                        selcolname = $(".report-titlelink",$(" th", $(" thead tr", $(me).parent().parent().parent()).last()).eq($(me).index())).html(); //MADEDEV
                                    }

                                    //alert("debug: selcolname=" + selcolname);                            

                                    //MADE2DEV2
                                    //REMOVE:
                                    /*
                                    if ($(" thead .tbl-drillkey", $(me).parent().parent().parent()).length) {
                                        var drillkeycolidx = $(" thead .tbl-drillkey", $(me).parent().parent().parent()).index();
                                        drillkey = $(" td", $(me).parent()).eq(drillkeycolidx).html().replace(/&amp;/gi, "&"); ;
                                    }
                                    */
                                    //IS:
                                    drillkey = "";
                                    //MADEDEV
                                    if (tooltip) {
                                        if (selcolname != null) {
                                            $(".tbl-ttt-" + selcolname.replace(/[ ,(,),+]/g,'-'),$(me).parent()).each(function() {
                                                drillkey = $(this).html();
                                            });
                                        }
                                        if (drillkey == "") {
                                            $(".tbl-tabletooltip",$(me).parent()).each(function() {
                                                drillkey = $(this).html();
                                            });
                                        }
                                        drillkey = drillkey.replace("GET:","");
                                    }
                                    else {
                                        if (selcolname != null) {
                                            $(".tbl-dk-" + selcolname.replace(/[ ,(,),+]/g,'-'),$(me).parent()).each(function() {
                                                drillkey = $(this).html();
                                            });
                                        }
                                        if (drillkey == "") {
                                            $(".tbl-drillkey",$(me).parent()).each(function() {
                                                drillkey = $(this).html();
                                            });
                                        }
                                    }
                                    drillkey = drillkey.replace(/&amp;/g,"&");
                                    //alert("debug: drillkey = " + drillkey);

                                    servicekey = "";
                                    //MADEDEV
                                    if (selcolname != null) {
                                        $(".tbl-sk-" + selcolname.replace(/ /g,"-"),$(me).parent()).each(function() {
                                            servicekey = $(this).html();
                                        });
                                    }
                                    servicekey = servicekey.replace(/&amp;/g,"&");
                                    //if (servicekey != "") alert("debug: servicekey = " + servicekey);
    
                                    var seltblid = $(" .tbl-ident", $(me).parent()).html();
                                    //alert("debug: seltblid=" + seltblid);

                                    var found = false;
                                    var serieskey = "";
                                    if ($(" tfoot .tbl-ident-" + seltblid, $(me).parent().parent().parent()).length) {
                                        serieskey = $(" tfoot .tbl-ident-" + seltblid, $(me).parent().parent().parent()).html().replace(/&amp;/gi, "&"); ;
                                    }
                                    //alert("debug: serieskey=" + serieskey);
                                    //TODO: Substitute to single, precedence is key > filterkey > serieskey
                                    finalparams = "&" + serieskey;
                                    finalparams = overrideparams(finalparams, filterkey);
                                    finalparams = overrideparams(finalparams, key);
                                    finalparams = overrideparams(finalparams, drillkey); //MADELIVENOW
                                    finalparams = "drillcolumn=" + selcolname + finalparams;
                                }
                                if (($.cookie("TP1Username") == "jeffgack")&&(!tooltip)) {
                                    alert("debug: finalparams = " + finalparams);
                                }

                                a$.showprogress("plotprogress");
                                if (servicekey != "") { //MADEDEV
                                    var ss = servicekey.split("&");
                                    var service = "";
                                    var data = {};
                                    for (var s in ss) {
                                        var sse = ss[s].split("=");
                                        if (sse[0] == "service") {
                                            switch (sse[1]) {
                                                case "SendAcknowledgementRequest":
                                                    data.lib = "qa";
                                                    data.cmd=sse[1];
                                                    break;
                                                case "EditField": //experimental
                                                    //DAS/filetype/date/user/field/val
                                                    //PAY/date/user/field/val
                                                    //

                                                    break;
                                                default:
                                                    //alert("Unrecognized Service");
                                                    return; //LEAVE!
                                            }
                                        }
                                        else {
                                            data[sse[0]] = sse[1];
                                        }
                                    }
                                    //alert("debug: handling service: " + servicekey);
                                    a$.ajax({
                                        type: "GET",
                                        service: "JScript",
                                        async: true,
                                        data: data,
                                        dataType: "json",
                                        cache: false,
                                        error: a$.ajaxerror,
                                        success: servicedone
                                    });
                                    function servicedone(json) {
                                        a$.hideprogress("plotprogress");
                                        if (a$.jsonerror(json)) { } else {
                                            if (json.saved) {
                                                $(me).html("Request Sent (test)");
                                            }
                                            else {
                                                $(me).html("ERROR: No email address or monitor deleted.");
                                            }
                                        }
                                    }
                                }
                                else {
                                    //if (tooltip && once) return; //Debug
                                    //if (tooltip) once +=1;
                                    a$.ajax({
                                        type: "POST",
                                        service: "JScript",
                                        async: true,
                                        data: {
                                            lib: "editor",
                                            cmd: "getreport",
                                            performanceColors: window.apmPerformanceColors, //MADELIVE
                                            devmode: false, /* V2 - no devmode: document.getElementById("ReportDeveloperMode").checked, */
                                            grouping: $("#StgReportGrouping select").val(),
                                            scoremodel: $("#StgReportScoreModelID select").val(),
                                            //cid: cid, //For drills, this is passed in the serieskey, or key.
                                            dashboard: $("#StgDashboard select").val(),
                                            displaytype: displaytype,
                                            context: displaytype,
                                            overrideUid: currentUid
                                        },
                                        dataType: "json",
                                        cache: false,
                                        error: a$.ajaxerror,
                                        params: finalparams
                                            + ((document.getElementById("StgInTraining") != null) ? "&InTraining=" + $("#StgInTraining select").val() : "")
                                            + ((document.getElementById("StgAgentStatus") != null) ? "&AgentStatus=" + $("#StgAgentStatus select").val() : "")
                                            + ((document.getElementById("StgScorecard") != null) ? "&scorecard=" + $("#StgScorecard select").val() : "")
                                            + ((document.getElementById("selQualityforms") != null) ? "&Qualityform=" + $("#selQualityforms").val() : "")
                                            ,
                                        success: loadedReport
                                    });
                                }
                            }
    
                            //MADELIVE: new function
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
                                            $(" .rpt-table", $(this).parent()).hide();
                                            $(" .rpt-chart", $(this).parent()).show();
                                        }
                                        else {
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
                                                        clicked_drill_td($(" td:nth-child(" + (seriesnameidx + 1) + ")", this));
                                                    }
                                                }
                                                else { //pie
                                                    if (x == me.name) {
                                                        foundit = true;
                                                        clicked_drill_td($(" td:nth-child(" + (seriesnameidx + 1) + ")", this));
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

                        //MAKEFILTER - Apply Filter
                        if (sel == ".ReportReports") {
                            $(".report-filter-global").unbind().on("input",function() {
                                //alert("debug: filter=" + $(this).val());
                                var f = $(this).val();
                                if (f != savedfilter) {
                                    if (f.length != (savedfilter.length + 1)) { //unhide
                                        $("tbody tr",sel).show();
                                    }
                                    var fs = f.split(" ");
                                    for (var i in fs) {
                                        $("tbody tr",sel).each(function() {
                                            var mytr = this;
                                            var trshow = false;
                                            $("td",mytr).each(function() {
                                                if (!trshow) {
                                                    if ($(this).html().indexOf(fs[i]) >= 0) {
                                                        trshow = true;
                                                    }
                                                }
                                            });
                                            if (!trshow) {
                                                $(mytr).hide();                                                
                                            }
                                        });
                                    }
                                }
                                savedfilter = f;
                            });
                            $(".report-filter-global").trigger("input");
                        }

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
                        //MADE2DEV2 - If there are non-popup panels.
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
                            $(sel).parent().css("overflow", "auto");
                        }
                    }
                    else {
                        $(sel).parent().css("overflow", "auto");
                    }
                    //TODO: Activate things in the form (it's blow & go right now).

                    //TODO: get this called for all  instances of getreport
                    //MADE2DEV2 - Took out the unbind() - $(".tbl-drill tbody td").unbind().bind("click", function (e) {
                    //MADEDEV (add .report-titlelink selector)
                    $(".tbl-drill tbody td,.tbl-drill tbody td .report-titlelink",sel).unbind("click").bind("click", function (e) {                    
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
            expandcnt = (ecs[0] - ecs[1]); //MAKELIVE MADEDEV
        } else {
            //alert("debug:collapse to " + ecs[1] + " columns");
            hide = true;
            $(me).removeClass("expander-collapse").addClass("expander-expand");
            $(me).parent().attr("colspan", ecss[1]);
            expandcnt = (ecs[1] - ecs[0]); //MAKELIVE MADEDEV
        }

        //MAKELIVE MADEDEV
        //If there's a category header, find the right colspan and subtract columns.
        if ($(me).parent().parent().index() > 0) {
            var mecnt = 0;
            $(me).parent().addClass("MeFinder");
            var adding = true;
            $(me).parent().parent().children().each(function () {
                if (adding) {
                    if ($(this).hasClass("MeFinder")) {
                        mecnt += 1;
                        $(this).removeClass("MeFinder");
                        adding = false;
                    }
                    else {
                        mecnt += parseInt($(this).attr("colspan"), 10);
                    }
                }
            });
            adding = true;
            var addcnt = 0;
            $("tr:first", $(me).parent().parent().parent()).children().each(function () {
                if (adding) {
                    addcnt += parseInt($(this).attr("colspan"), 10);
                    if (addcnt >= mecnt) {
                        $(this).attr("colspan", parseInt($(this).attr("colspan"), 10) + expandcnt);
                        adding = false;
                    }
                }
            });
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

                $("#poller_activetab").html($(this).html());

                $("#StgScoreModel_Filter").hide(); //MADEDEV
                if (Array.isArray($("#selLocations").val())) {
                    var ar = $("#selLocations").val();
                    if ((ar[0] == "") && (ar[1] == "each")) {
                        $("#selLocations").val([]).val("each");
                    }
                }
                if ($(this).attr("id") == "graphlabel") {
                    /*
                    if ($("#selKPIs").val() == "each") {
                        $("#selKPIs").val("").trigger("liszt:updated"); //All THIS CHANGES IT IN THE WRONG PLACES, I NEED A DIFFERENT METHOD.
                        $("#selKPIs").trigger("change");
                    }
                    */
                    if ($.cookie("TP1Username") == "jeffgack") {
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
                        //Already on the management link since it's the only 1 here now.
                        //$(".attrition-reports-link").trigger("click");
                        $(".attrition-management-link").trigger("click");
                    }
                }
                else if ($(this).attr("id") == "reportlabel") {
                    $(".attrition-hide").show();
                    $(".attrition-show").hide();
                    $(".attrition-show-hi").show();
                    $(".attrition-show-loc").hide();
                    $("#gaugesdiv1,#gaugesdiv2").hide();
                    if (current_filter != "Reports") {
                        appApmDashboard.setAddBoxList($("#ReportReportList select option[value='" + $("#ReportReportList select").val() + "']").attr("add_list"));
                        appApmDashboard.setSuppressBoxList($("#ReportReportList select option[value='" + $("#ReportReportList select").val() + "']").attr("suppress_list"));
                        setSuppressMenuList($("#ReportReportList select option[value='" + $("#ReportReportList select").val() + "']").attr("suppress_menus"));
                        setDashboardFilters("Reports");
                    }

                    var myframe = $("#ReportSandboxIframe").eq(0);
                    if (a$.urlprefix(true).indexOf("mnt") == 0) {
                        if ($(myframe).attr("src") == "") {
                            $(myframe).attr("src", a$.debugPrefix() + "/3/ng/ReportEditor/default.aspx?prefix=" + a$.urlprefix().split(".")[0] + "&panelcid=" + $("#ReportReportList select").val().split("?")[0]);
                        }
                    }
                    /*
                    if ((a$.urlprefix() == "performant.") || (a$.urlprefix() == "performant-mnt.")) {
                        //show left filters panel
                        window.location = "#GraphsReports";
                        setTimeout(function() {
                            $('#reportlabel').trigger('click');
                        }
                        , 3000);
                    }
                    */
                    //TODO: Customize filters for the selected report.
                    //alert("debug:customize filters for the selected report");
                }
                else if ($(this).attr("id") == "sandboxlabel") {
                    var myframe = $("#SandboxIframe").eq(0);
                    if ($(myframe).attr("src") == "") {
                        $(myframe).attr("src", a$.debugPrefix() + "/3/ng/ReportEditor/default.aspx?prefix=" + a$.urlprefix().split(".")[0] + "&panelcid=" + $("#ReportReportList select").val().split("?")[0]);
                    }
                }
                else if ($(this).attr("id") == "journalformlabel") {
                    var myframe = $("#JournalformIframe").eq(0);
                    if ($(myframe).attr("src") == "") {
                        $(".journalform-message").hide();
                        $("#JournalformIframe").attr("src", "../3/JournalFormTeam.aspx?prefix=" + a$.urlprefix().split(".")[0] + ((($.cookie("TP1Username").toLowerCase() == "jeffgack") || ($.cookie("TP1Username").toLowerCase() == "dweather") || ($.cookie("TP1Username").toLowerCase() == "ckraft") || ($.cookie("TP1Username").toLowerCase() == "cjarboe")) ? "&dev=1" : "&nodev=0")).show();
                    }
                }
                else if ($(this).attr("id") == "userdashboardlabel") {
                    var myframe = $("#UserdashboardIframe").eq(0);
                    if ($(myframe).attr("src") == "") {
                        $("#UserdashboardIframe").attr("src", "../3/ng/UserDashboard/default.aspx?prefix=" + a$.urlprefix().split(".")[0]);
                    }
                }
                else if ($(this).attr("id") == "km2compliancelabel") {
                    var myframe = $("#Km2complianceIframe").eq(0);
                    if ($(myframe).attr("src") == "") {
                        $(myframe).attr("src", a$.debugPrefix() + "/3/customization/KM2/KM2ComplianceDashboard.aspx?prefix=" + a$.urlprefix().split(".")[0]);
                    }
                }
                else if ($(this).attr("id") == "overviewlabel") {
                    var myframe = $("#OverviewIframe").eq(0);
                    if ($(myframe).attr("src") == "") {
                        $(myframe).attr("src", a$.debugPrefix() + "/3/ng/ReportEditor/default.aspx?prefix=" + a$.urlprefix().split(".")[0] + "&panelcid=overview&nocidreload=true");
                    }
                }
                else if ($(this).attr("id") == "guidelabel") {
                    var myframe = $("#GuideGeneralIframe").eq(0);
                    if ($(myframe).attr("src") == "") {
                        var special_guide = false;

                        if ((a$.urlprefix() == "chime.")) {
                            if (($.cookie("TP1Role") != "CSR")) {
                                //$("#attritiontab").show();
                                global_attritionvisible = true;
                                global_attritiontestingvisible = true;
                            }
                            global_attritionvisible = true;
                            global_attritiontestingvisible = true;
                        } else if (((a$.urlprefix() == "ers.") || (a$.urlprefix() == "cthix.") || (a$.urlprefix().indexOf("make") >= 0) || (a$.urlprefix() == "ec2.")) && (($.cookie("ApmInDallas") == "") || ($.cookie("ApmInDallas") == null)) && (($.cookie("TP1Username") ==
									"jeffgack") || ($.cookie("TP1Username") == "syanez") || ($.cookie("TP1Username") == "mark.vander") || ($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin"))) {
                            $("#cepointsmgrtab").show();
                            appApmRankPoints.mgrinit();
                            //$("#attritiontab").show();
                            //global_attritionvisible = true;
                            //global_attritiontestingvisible = true;
                        } else if (((a$.urlprefix() == "ers.") || (a$.urlprefix() == "cthix.") || (a$.urlprefix().indexOf("make") >= 0) || (a$.urlprefix() == "ec2.")) && ($.cookie("TP1Role") == "Management")) {
                            //$("#attritiontab").show();
                            //global_attritionvisible = true;
                            //global_attritiontestingvisible = true;
                        } else if (((a$.urlprefix() == "ers.") || (a$.urlprefix() == "cthix.") || (a$.urlprefix().indexOf("make") >= 0) || (a$.urlprefix() == "ec2.")) && (($.cookie("TP1Role") == "Group Leader") || ($.cookie("TP1Role") == "Team Leader"))) {
                            //$("#attritiontab").show();
                            //global_attritionvisible = true;
                        } else {
                            $(".attrition-show").hide();
                            $(".attrition-show-loc").hide();
                        }
                        if ((a$.urlprefix() == "performant.")) { //Role-based guides for performant
                            /*
                            if (($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin") || ($.cookie("TP1Role") == "Quality Assurance")) {
                            $("#GuideIframe").attr("src", "../applib/html/guides/start-guide/performant-guideQA.html");
                            }
                            else {
                            $("#GuideIframe").attr("src", "../applib/html/guides/start-guide/performant-guide-supervisorQA.html?test=81");
                            }
                            */
                            $("#GuideIframe").attr("src", "https://guidestpo.wpengine.com/acuity-user-guide-performant/?prefix=" + a$.urlprefix().substring(0, a$.urlprefix().indexOf(".")));
                            special_guide = true;
                        }
                        else if ((a$.urlprefix() == "performant-recovery.")) { //Role-based guides for performant
                            if (($.cookie("TP1Role") == "CSR")) {
                                $("#GuideIframe").attr("src", "../applib/html/guides/start-guide/performant-recovery-agents-guide.html");
                            }
                            else if (($.cookie("TP1Role") == "Team Leader") || ($.cookie("TP1Role") == "Group Leader")) {
                                $("#GuideIframe").attr("src", "../applib/html/guides/start-guide/performant-recovery-managers-guide.html");
                            }
                            else {
                                $("#GuideIframe").attr("src", "../applib/html/guides/start-guide/performant-recovery-compliance-guide.html");
                            }
                            special_guide = true;
                        }
                        else if ((a$.urlprefix() == "chime.")) { //Role-based guides for chime
                            /*
                            if (($.cookie("TP1Role") == "CSR")) {
                            $("#GuideIframe").attr("src", "../applib/html/guides/start-guide/chime-guide.html?prefix=" + a$.urlprefix().substring(0, a$.urlprefix().indexOf(".")));
                            }
                            else {
                            $("#GuideIframe").attr("src", "../applib/html/guides/start-guide/chime-guide-supervisor.html?r=4&prefix=" + a$.urlprefix().substring(0, a$.urlprefix().indexOf(".")));
                            }
                            */
                            $("#GuideIframe").attr("src", "https://guides.touchpointone.com/user-guide-chime/?prefix=" + a$.urlprefix().substring(0, a$.urlprefix().indexOf(".")));
                            special_guide = true;
                        }
                        else if ((a$.urlprefix() == "nspc.")) {
                            $("#GuideIframe").attr("src", "https://guidestpo.wpengine.com/user-guide-nspc/?prefix=" + a$.urlprefix().substring(0, a$.urlprefix().indexOf(".")));
                            special_guide = true;
                        }
                        else if ((a$.urlprefix() == "walgreens.")) {
                            $("#GuideIframe").attr("src", "https://guidestpo.wpengine.com/user-guide-walgreens/?prefix=" + a$.urlprefix().substring(0, a$.urlprefix().indexOf(".")));
                            special_guide = true;
                        }
                        else if ((a$.urlprefix() == "collective-solution.")) {
                            $("#GuideIframe").attr("src", "https://guides.touchpointone.com/acuity-user-guide-collective-solution/?prefix=" + a$.urlprefix().substring(0, a$.urlprefix().indexOf(".")));
                            special_guide = true;
                        }
                        else if (((a$.urlprefix() == "veyo.") || (a$.urlprefix() == "mtm.")) && ($.cookie("TP1Role") != "CSR")) { //Supervisor guide is the only difference
                            $("#GuideIframe").attr("src", "../applib/html/guides/start-guide/veyo-supervisor-guide.html?r=4&prefix=" + a$.urlprefix().substring(0, a$.urlprefix().indexOf(".")));
                            special_guide = true;
                        }
                        else if ((a$.urlprefix() == "performant-healthcare.")) {
                            //$("#GuideIframe").attr("src", "../applib/html/guides/start-guide/performant-healthcare-guide.html?prefix=" + a$.urlprefix().substring(0, a$.urlprefix().indexOf(".")));
                            $("#GuideIframe").attr("src", "https://guidestpo.wpengine.com/user-guide-performant-healthcare/?prefix=" + a$.urlprefix().substring(0, a$.urlprefix().indexOf(".")));
                            special_guide = true;
                        }
                        else if ((a$.urlprefix() == "km2.")) {
                            /*
                            $("#GuideIframe").attr("src", "../applib/html/guides/start-guide/km2-supervisor-guide.html?prefix=" + a$.urlprefix().substring(0, a$.urlprefix().indexOf(".")));
                            */
                            $("#GuideIframe").attr("src", "https://guides.touchpointone.com/user-guide-km2/?prefix=" + a$.urlprefix().substring(0, a$.urlprefix().indexOf(".")));
                            special_guide = true;
                        }
                        else { //General start guide
                            /*
                            if ($.cookie("TP1Role") == "CSR") {
                            $("#GuideIframe").attr("src", "https://" + a$.urlprefix() + "acuityapmr.com/applib/html/guides/start-guide/index.html?atest=2&prefix=" + a$.urlprefix().substring(0, a$.urlprefix().indexOf(".")));
                            }
                            else {
                            $("#GuideIframe").attr("src", "https://" + a$.urlprefix() + "acuityapmr.com/applib/html/guides/start-guide/index-supervisor.html?atest=2&prefix=" + a$.urlprefix().substring(0, a$.urlprefix().indexOf(".")));
                            }
                            */
                        }

                        //General Guide in Separate Frame
                        $("#GuideGeneralIframe").attr("src", "https://guides.touchpointone.com/acuity-user-guide/?prefix=" + a$.urlprefix().substring(0, a$.urlprefix().indexOf(".")));
                        if (!special_guide) { //Only display the general guide.
                            $("#GuideIframe").hide();
                        }
                        else {
                            $(".guide-nav").html('<span class="guide-client" style="cursor:pointer;">Client Guide</span>&nbsp;&nbsp;&nbsp;<span class="guide-general" style="cursor:pointer;">General Guide</span>');
                            $(".guide-client").unbind().bind("click", function () {
                                $("#GuideIframe").show();
                                $("#GuideGeneralIframe").hide();
                                $(".guide-client").css("font-weight", "bold");
                                $(".guide-general").css("font-weight", "");
                            });
                            $(".guide-general").unbind().bind("click", function () {
                                $("#GuideIframe").hide();
                                $("#GuideGeneralIframe").show();
                                $(".guide-client").css("font-weight", "");
                                $(".guide-general").css("font-weight", "bold");
                            });
                            $(".guide-client").trigger("click");
                        }
                    }

                }
                else {
                    //if ($(this).attr("id") == "graphlabel") {
                    if (($(this).attr("id") == "graphlabel") || ($(this).attr("id") == "graphsublabel")) { //MADEDEV

                        //MADEDEV
                        if (a$.urlprefix() == "cox.") {
                            $("#StgScoreModel_Filter").show();
                        }

                        $(".attrition-hide").show();
                        $(".attrition-show").hide();
                        $(".attrition-show-hi").show();
                        $(".attrition-show-loc").hide();
                        $("#gaugesdiv1,#gaugesdiv2").show();
                        if (current_filter != $("#StgDashboard select").val()) {
                            setDashboardFilters($("#StgDashboard select").val());
                        }
                        rdoclick("rdoBase");
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


        if ((a$.urlprefix() == "cox.") || (a$.urlprefix() == "cox-NOTmake40.")) { //
            if (($.cookie("TP1Role") != "CSR") && ($.cookie("TP1Role") != "Team Leader")) {
                $("#StgScoreModel select").val("Raw");
                $("#StgReportScoreModelID select").val("Raw");
            }
        }

        appApmSettings.init({
            id: "StgScoreModel",
            ui: "combo"
        });
        $("#StgScoreModel select").bind("change", function () {
            appApmDashboard.StgScoreModel_update(0);
        });
        appApmSettings.init({
            id: "StgReportScoreModelID",
            ui: "combo"
        });

        //MADEDEV
        if (a$.urlprefix() == "cox.") {
            appApmSettings.init({
                id: "StgScoreModel_Filter",
                shadow: "StgScoreModel",
                ui: "combo"
            });
        }
        else {
            $("#StgScoreModel_Filter").hide();
        }

        /*
        if ((a$.urlprefix() == "km2.") || (a$.urlprefix().indexOf("km2-make40.") >= 0)) {
            $("#StgScoreModel").hide();
        }
        */

        a$.ajax({
            type: "GET",
            service: "JScript",
            async: true,
            data: {
                lib: "editor",
                cmd: "getreportlist",
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
                        case "Home":
                            $(".date-display2").hide();
                            $(".qualityform-display").hide();
                            $("#StgReportScoreModelID select option").each(function () { $(this).remove(); });
                            for (var g in json.reportlist.tablist[t].group) {
                                if (json.reportlist.tablist[t].group[g].name != "") {
                                    $("#StgReportScoreModelID select").append('<option value="' + json.reportlist.tablist[t].group[g].name + '">GROUP:' + json.reportlist.tablist[t].group[g].desc + '</option>');
                                }
                                for (var i in json.reportlist.tablist[t].group[g].item) {
                                    if ((json.reportlist.tablist[t].group[g].item[i].devOnly != "Y") || (a$.urlprefix(true).indexOf("mnt") == 0)) {
                                        var selstr = "";
                                        if (json.reportlist.tablist[t].group[g].item[i].selected == "Y") {
                                            selstr = ' selected="selected"'
                                        }
                                        $("#StgReportScoreModelID select").append('<option value="' + json.reportlist.tablist[t].group[g].item[i].name + '"' + selstr + '>' + json.reportlist.tablist[t].group[g].item[i].desc + '</option>');
                                    }
                                }
                            }
                            $("#StgReportScoreModelID").hide();

                            if ((a$.urlprefix() == "cox.") || (a$.urlprefix() == "cox-NOTmake40.")) { //
                                if (($.cookie("TP1Role") != "CSR") && ($.cookie("TP1Role") != "Team Leader")) {
                                    $("#StgReportScoreModelID select").val("Raw");
                                }
                            }

                            $("#StgReportScoreModelID select").bind("change", function () {
                                if ($("#reporttab").eq(0).hasClass("ui-state-active")) {
                                  //Don't fire on change if on the report tab.
                                }
                                else {
                                    appApmDashboard.StgReportScoreModel_update(0);
                                }
                            });
                            appApmSettings.init({
                                id: "HomeReportList", //WAS: ReportScoreModel
                                shadow: "StgReportScoreModelID",
                                ui: "combo"
                            });
                            break;
                        case "Report":
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
                                    if ((json.reportlist.tablist[t].group[g].item[i].devOnly != "Y") || (a$.urlprefix(true).indexOf("mnt") == 0)) {
                                        var selstr = "";
                                        if (json.reportlist.tablist[t].group[g].item[i].selected == "Y") {
                                            selstr = ' selected="selected"'
                                        }
                                        //MAKEFILTER - add offerExternalDelivery parameter to name (aka cid)
                                        var nameadd = "?offerExternalDelivery=" + json.reportlist.tablist[t].group[g].item[i].offerExternalDelivery;
                                        nameadd += "&restrictKPIs=" + json.reportlist.tablist[t].group[g].item[i].restrictKPIs;
                                        nameadd += "&restrictSubKPIs=" + json.reportlist.tablist[t].group[g].item[i].restrictSubKPIs;
                                        nameadd += "&hideAllForFilters=" + json.reportlist.tablist[t].group[g].item[i].hideAllForFilters;
                                        nameadd += "&hideEachForFilters=" + json.reportlist.tablist[t].group[g].item[i].hideEachForFilters;
                                        if (json.reportlist.tablist[t].group[g].name == "") {
                                            $("#ReportReportList select").append('<option value="' + json.reportlist.tablist[t].group[g].item[i].name + nameadd + '"' + selstr + ' add_list="' + json.reportlist.tablist[t].group[g].item[i].addFilters + '" suppress_list="' + json.reportlist.tablist[t].group[g].item[i].suppressFilters + '" suppress_menus="' + json.reportlist.tablist[t].group[g].item[i].suppressMenus + '"'  + '" cds_override="' + json.reportlist.tablist[t].group[g].item[i].CDS_Override + '">' + json.reportlist.tablist[t].group[g].item[i].desc + '</option>');
                                        }
                                        else {
                                            $("#ReportReportList select").children().last().append('<option value="' + json.reportlist.tablist[t].group[g].item[i].name + nameadd + '"' + selstr + ' add_list="' + json.reportlist.tablist[t].group[g].item[i].addFilters + '" suppress_list="' + json.reportlist.tablist[t].group[g].item[i].suppressFilters + '" suppress_menus="' + json.reportlist.tablist[t].group[g].item[i].suppressMenus + '"' + '" cds_override="' + json.reportlist.tablist[t].group[g].item[i].CDS_Override + '">' + json.reportlist.tablist[t].group[g].item[i].desc + '</option>');
                                        }
                                    }
                                }
                            }
                            if (json.reportlist.tablist[t].group.length == 0) {
                                $("#reporttab").hide();
                            }
                            else {
                                showReport($("#ReportReportList select").val(), ".ReportReports", "Grid");
                            }

                            //Report Favorites

                            if (a$.urlprefix(true).indexOf("mnt") == 0) {
                                a$.ajax({
                                    type: "GET",
                                    service: "JScript",
                                    async: true,
                                    data: {
                                        lib: "editor",
                                        cmd: "getreportfavorites",
                                        role: $.cookie("TP1Role")
                                    },
                                    dataType: "json",
                                    cache: false,
                                    error: a$.ajaxerror,
                                    success: StgFavoritesLoaded
                                });
                                function StgFavoritesLoaded(json) {
                                    if (a$.jsonerror(json)) { } else {
                                        for (var i in json.favorites) {
                                            $("#ReportReportFavorites select").append('<option value="' + json.favorites[i].uid + '">' + json.favorites[i].title + '</option>');
                                        }
                                    }
                                }

                                $("#ReportReportListToggle").show().html("Favorites");
                                $("#ReportReportSave").show();
                                $("#ReportReportListToggle").unbind().bind("click", function() {
                                    if ($(this).html() == "Favorites") {
                                        $("#ReportReportSave").hide();
                                        $("#ReportReportShare").show();
                                        $("#ReportReportRemove").show();
                                        $("#ReportReportFavorites").show();
                                        $("#ReportReportListLabel").html("Select Favorite:");
                                        $("#ReportReportList").hide();
                                        $(this).html("Reports");
                                    }
                                    else {
                                        $("#ReportReportSave").show();
                                        $("#ReportReportShare").hide();
                                        $("#ReportReportRemove").hide();
                                        $("#ReportReportList").show();
                                        $("#ReportReportListLabel").html("Select Report:");
                                        $("#ReportReportFavorites").hide();
                                        $(this).html("Favorites");
                                    }
                                });
                                $("#ReportReportRemove").unbind().bind("click", function() {
                                    if ($("#ReportReportFavorites select").val() != "") {
                                        var txt = $("#ReportReportFavorites select option:selected").text();
                                        if (confirm("Are you sure you want to remove '" + txt + "'?")) {
                                            //alert("debug:removing");
                                            var savethis = $('option:selected', $("#ReportReportFavorites select"))
                                            a$.ajax({
                                                type: "GET",
                                                service: "JScript",
                                                async: true,
                                                data: {
                                                    lib: "spine",
                                                    cmd: "removeprt",
                                                    page: "report",
                                                    guid: $("#ReportReportFavorites select").val(),
                                                    role: $.cookie("TP1Role")
                                                },
                                                dataType: "json",
                                                cache: false,
                                                error: a$.ajaxerror,
                                                success: function(json) {
                                                    if (a$.jsonerror(json)) { } else {
                                                        $(savethis).remove();
                                                        alert("'" + txt + "' removed.");
                                                    }
                                                }
                                            });
                                        }
                                    }
                                });

                                $("#ReportReportSave").unbind().bind("click", function() {
                			        $(".qa-savereport .qa-close").unbind().bind("click", function () {
		    	                        $(".qa-savereport").hide();
			                        });
                                    $(".qa-savereport .qa-done").unbind().bind("click", function() {
                                        var title = $(".qa-savereport-title").val();
                                        $(".qa-savereport").hide();

                                        a$.ajax({
                                            type: "POST",
                                            service: "JScript",
                                            async: true,
                                            data: {
                                                lib: "spine",
                                                cmd: "savereport",
                                                title: title,
                                                performanceColors: window.apmPerformanceColors, //MADELIVE
                                                grouping: $("#StgReportGrouping select").val(),
                                                scoremodel: $("#StgReportScoreModelID select").val(),
                                                cid: $("#ReportReportList select").val(),
                                                //externalDelivery: externalDelivery, //MADEDEV
                                                dashboard: $("#StgDashboard select").val(),
                                                displaytype: "Grid", //It's always Grid now, I think.
                                                context: "Grid",
                                                params: appApmDashboard.viewparams(0, false)  //params are passed as data here (instead of being interpreted).
                                                    + ((document.getElementById("StgInTraining") != null) ? "&InTraining=" + $("#StgInTraining select").val() : "")
                                                    + ((document.getElementById("StgAgentStatus") != null) ? "&AgentStatus=" + $("#StgAgentStatus select").val() : "")
                                                    + ((document.getElementById("StgScorecard") != null) ? "&scorecard=" + $("#StgScorecard select").val() : "")
                                                    + ((document.getElementById("selQualityforms") != null) ? "&Qualityform=" + $("#selQualityforms").val() : "")
                                                    + ((document.getElementById("selPayperiods") != null) ? "&Payperiod=" + $("#selPayperiods").val() : "")
                                                    //+ "&cid=" + $("#ReportReportList select").val()
                                                ,
                                                rootbuild: true //MADEDEVNOW2
                                            },
                                            dataType: "json",
                                            cache: false,
                                            error: a$.ajaxerror,
                                            success: function(json) {
                                                if (a$.jsonerror(json)) { } else {
                                                    //TODODO: This is what you call for "share".
                                                    //window.open("//" + a$.urlprefix(true) + "acuityapmr.com/3/ng/ReportEditor/Default.aspx?uid=" + json.uid + "&prefix=" + a$.urlprefix().split(".")[0])
                                                    $("#ReportReportFavorites select").append('<option selected="selected" value="' + json.uid + '">' + title + '</option>');
                                                    if ($("#ReportReportListToggle").html() == "Favorites") {
                                                        $("#ReportReportListToggle").trigger("click");
                                                    }
                                                    //duck
                                                }
                                            }
                                        });
                                    });
                                    $(".qa-savereport-title").val($("#ReportReportList select").val().split("?")[0]);
	    		                    $(".qa-savereport").show();                             
                                });
                                $("#ReportReportShare").unbind().bind("click", function() {                                
                                    window.open("//" + a$.urlprefix(true) + "acuityapmr.com/3/ng/ReportEditor/Default.aspx?uid=" + $("#ReportReportFavorites select").val() + "&prefix=" + a$.urlprefix().split(".")[0])
                                });
                            }
                            else {
                                $("#ReportReportList select").css("max-width","100%");
                            }

                            $("#ReportReportList select").unbind().bind("change", function () {
                                appApmDashboard.setAddBoxList($("#ReportReportList select option[value='" + $("#ReportReportList select").val() + "']").attr("add_list"));
                                appApmDashboard.setSuppressBoxList($("#ReportReportList select option[value='" + $("#ReportReportList select").val() + "']").attr("suppress_list"));
                                setSuppressMenuList($("#ReportReportList select option[value='" + $("#ReportReportList select").val() + "']").attr("suppress_menus"));
                                if (a$.urlprefix() == "chime.") { //MAKEFILTER
                                    $("#selPayperiods option").each(function () {
                                        if ($(this).html() == "Current Week") {
                                            var rep = $("#ReportReportList select").val();
                                            if ((rep == "WeeklyPayIncreaseAdmin")||(rep == "WeeklyPayIncreaseSPVR")||(rep == "WeeklyPayIncreaseCSR")||(rep == "ADPTransferFile")) {
                                                if ($("#selPayperiods").val().indexOf("Week") < 0) {
                                                    $("#selPayperiods").val($(this).val());
                                                }
                                            }
                                        }
                                    });
                                }
                                setDashboardFilters("Reports", $("#ReportReportList select").val()); //MAKEFILTER

                                var myframe = $("#ReportSandboxIframe").eq(0);
                                if ($("#ReportReportList select option[value='" + $("#ReportReportList select").val() + "']").attr("cds_override") == "Y") { //duck
                                    if ( ($(myframe).attr("src") == "") || ($(myframe).attr("src").toString().indexOf("Quiz") > 0) ) {
                                        $(myframe).attr("src", a$.debugPrefix() + "/3/ng/ReportEditor/default.aspx?prefix=" + a$.urlprefix().split(".")[0] + "&panelcid=" + $("#ReportReportList select").val().split("?")[0]);
                                    }
                                    $(".ReportReports").hide();
                                    $(".ReportSandbox").show();

                                    $("#SearchLabel").hide();
                                    $(".report-filter-global").hide();
                                    $(".report-search-top").css("padding-bottom","4px");
                                    $("#ReportShowInTraining").parent().hide();
                                    $("#ReportReportScoreModel").parent().hide();
                                }
                                else if ($("#ReportReportList select option[value='" + $("#ReportReportList select").val() + "']").attr("cds_override") == "Q") { //duck
                                    if ( ($(myframe).attr("src") == "") || ($(myframe).attr("src").toString().indexOf("Quiz") < 0) ) {
                                        $(myframe).attr("src", a$.debugPrefix() + "/3/ng/ReportEditor/defaultQuiz.aspx?prefix=" + a$.urlprefix().split(".")[0] + "&panelcid=" + $("#ReportReportList select").val().split("?")[0]);
                                    }
                                    $(".ReportReports").hide();
                                    $(".ReportSandbox").show();

                                    $("#SearchLabel").hide();
                                    $(".report-filter-global").hide();
                                    $(".report-search-top").css("padding-bottom","4px");
                                    $("#ReportShowInTraining").parent().hide();
                                    $("#ReportReportScoreModel").parent().hide();
                                }
                                else if ($("#ReportReportList select option[value='" + $("#ReportReportList select").val() + "']").attr("cds_override") == "RS") { //duck
                                    $(myframe).attr("src","");
                                    $(".ReportReports").show(); //To show correct prompt.
                                    $(".ReportSandbox").hide();

                                    $("#SearchLabel").hide();
                                    $(".report-filter-global").hide();
                                    $(".report-search-top").css("padding-bottom","4px");
                                    $("#ReportShowInTraining").parent().hide();
                                    $("#ReportReportScoreModel").parent().hide();

                                }
                                else {
                                    $(myframe).attr("src","");
                                    $(".ReportReports").show();
                                    $(".ReportSandbox").hide();

                                    $("#SearchLabel").show();
                                    $(".report-filter-global").show();
                                    $(".report-search-top").removeAttr("style");
                                    $("#ReportShowInTraining").parent().show();
                                    $("#ReportReportScoreModel").parent().show();

                                }

                                //Experiment
                                /*
                                if ((a$.urlprefix() == "performant.") || (a$.urlprefix() == "performant-mnt.")) {
                                    $(".btnPlot").trigger('click');
                                }
                                */
                            });
                            appApmSettings.init({
                                id: "ReportReportList",
                                ui: "combo"
                            });
                            appApmSettings.init({
                                id: "SandboxReportList",
                                shadow: "ReportReportList",
                                ui: "combo"
                            });
                            appApmSettings.init({
                                id: "ReportReportScoreModel",
                                shadow: "StgReportScoreModelID",
                                ui: "combo"
                            });
                            break;
                        default:
                            alert("debug:unrecognized tab = " + json.reportlist.tablist[t].name);
                    }
                }
            }
            window.CoxReportlistReady = true; //"Cox."
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

    function setDashboardFilters(filter,mods) {
        var changingscorecards = false;  //Set if changing from Agent to SSC (for example), but not when changing tabs.
        if (filter != current_filter) {
            if ((filter == "Agent") || (filter == "Supervisor") || (filter == "Source") || (filter == "Program") || (filter == "Sidekick")) {
                if ((current_filter == "Agent") || (current_filter == "Supervisor") || (current_filter == "Source") || (current_filter == "Program") || (current_filter == "Sidekick")) {
                    changingscorecards = true;
                }
            }
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
                    (((a$.urlprefix() == "cox.") || (a$.urlprefix().indexOf("cox-NOTmake40") >= 0)) && 
                    ($.cookie("TP1Role") != "CSR") && ($.cookie("TP1Role") != "Team Leader") )   ) {
                    $("#rdoPay,#rdoPayLabel").hide();
                    if (FIRSTPASS) {
                        FIRSTPASS = false;
                        rdoclick("rdoBase");
                    }
                    else {
                        //SAFETY EMERGENCY - STUDY THIS, IT'S CAUSING A DUMP: document.getElementById("rdoTrend").checked = true;
                        document.getElementById("rdoTrend").checked = true; //My gut says to do this, in case it's getting stuck on grid.
                        //I think it's due to the slow speed of refresh when combined with the timing.
                        //It works intermittently.
                    }
                }
                else if ((a$.urlprefix() == "ces.")) {
                    $("#rdoPay,#rdoPayLabel").hide();
                    rdoclick("rdoBase");
                } else if ((a$.urlprefix() == "chime.")) {
                    $("#rdoPay,#rdoPayLabel").hide();
                    rdoclick("rdoBase");
                } else if (a$.urlprefix() == "performant-recovery.") {
                    $("#rdoPay,#rdoPayLabel").hide();
                    rdoclick("rdoBase");
                } else if (a$.urlprefix() == "bgr.") {
                    $("#rdoPay,#rdoPayLabel").hide();
                    rdoclick("rdoBase");
                } else if (a$.urlprefix() == "da.") {
                    $("#rdoPay,#rdoPayLabel").hide();
                    rdoclick("rdoBase");
                } else if (a$.urlprefix() == "ultracx.") {
                    $("#rdoPay,#rdoPayLabel").hide();
                    rdoclick("rdoBase");
                } else if ((a$.urlprefix() == "cox.")) {
                    $("#rdoPay,#rdoPayLabel").hide();
                    rdoclick("rdoBase");
                } else if ((a$.urlprefix() == "collective-solution.")) {
                    $("#rdoPay,#rdoPayLabel").hide();
                    rdoclick("rdoBase");
                }
                else {
                    $("#rdoPay,#rdoPayLabel").show();
                    rdoclick("rdoBase");
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
                if (
                  (a$.urlprefix() == "frost-arnett.") || (a$.urlprefix().indexOf("frost-arnett-mnt") >= 0)
                  || (a$.urlprefix().indexOf("united") >= 0)
                  || (a$.urlprefix().indexOf("performant-recovery") >= 0)
                  || (a$.urlprefix().indexOf("sunpro") >= 0)
                  || (a$.urlprefix().indexOf("walgreens") >= 0)
                  || (a$.urlprefix().indexOf("nspc") >= 0)
                  || (a$.urlprefix().indexOf("ers") >= 0)
                ) {
                    $("#showpay").css("display", "none");
                }
                else {
                    $("#showpay").css("display", "inline");
                }

                if ((a$.urlprefix() == "chime.") || (a$.urlprefix().indexOf("chime-make40") >= 0)) {
                    $("#csrlabel").html("Consultant");
                }
                else if ((a$.urlprefix() == "performant.") || (a$.urlprefix().indexOf("performant-mnt.") >= 0)) {
                    $("#csrlabel").html("Case Worker");
                }
                else if (a$.urlprefix() == "walgreens.") {
                    $("#csrlabel").html("TM");
                }
                else if (a$.urlprefix() == "performant-healthcare.") {
                    $("#csrlabel").html("Clerk");
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
                $("#gaugesdiv1,#gaugesdiv2").show();
                $(".attrition-show").hide();
                $(".attrition-show-hi").show();
                $(".attrition-show-loc").hide();


                if ((a$.urlprefix() == "chime.") || (a$.urlprefix().indexOf("chime-make40.") >= 0)) { //Set location to 1 (Morrow
                    if (false) {
                      $("#selLocations").val("1").trigger("liszt:updated");
                      $("#locationlabel,#locationfilter").hide();
                    }


                }

                if (false) { //(a$.urlprefix() == "ers.") {
                    $("#attritiontab,#attritiondiv").show(); //Changed 2018-12-05 - Expose since Attrition tab is used for management.
                }
                break; //I don't think this was here (could be wrong), did I break it?
            case "Reports":
                //The reports DRIVE the filters in this case.  appApmDashboard.setSuppressBoxList(""); //TODO: Special filters will apply based on reports, I'm sure.
                appApmDashboard.setSpecialFlagsList("");

                $(".kpi-display").show();
                $(".date-display").show();

                $(".attrition-hide").show();
                $(".attrition-show").hide();
                $(".attrition-show-hi").show();
                $(".attrition-show-loc").hide();
                $("#gaugesdiv1,#gaugesdiv2").hide();

                $("#rdoBase,#rdoBaseLabel").hide();
                $("#rdoTrend,#rdoTrendLabel").hide();
                $("#rdoPay,#rdoPayLabel").hide();
                $("#rdoGrid,#rdoGridLabel").show();
                rdoclick("rdoGrid");

                if ((a$.urlprefix() == "chime.") || (a$.urlprefix().indexOf("chime-make40") >= 0)) {
                    $("#csrlabel").html("Consultant");
                }
                else if ((a$.urlprefix() == "performant.") || (a$.urlprefix().indexOf("performant-mnt.") >= 0)) {
                    $("#csrlabel").html("Case Worker");
                }
                else if (a$.urlprefix() == "walgreens.") {
                    $("#csrlabel").html("TM");
                }
                else if (a$.urlprefix() == "performant-healthcare.") {
                    $("#csrlabel").html("Clerk");
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

                if (a$.gup("oldfilters") != "Y") filteredproject = true;

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
                            
                            if (a$.urlprefix() == "cox.") { //MAKEFILTER
                                $("#selPayperiods option").each(function () {
                                    if ($(this).html() == "Current Month") {
                                        $("#selPayperiods").val($(this).val());
                                    }
                                });
                            }
                                                    
                        }

                    }
                }

                if (mods) { //hide or restrict vars from rpt_selection //MAKEFILTER
                    if (mods.indexOf("?") > 0) { 
                        var cs = mods.split("?");
                        //cid = cs[0];
                        var ps = cs[1].split("&");
                        var mysubkpis = "";
                        for (var p in ps) {
                            var pss = ps[p].split("=");
                            if (pss[0] == "restrictKPIs") {
                                if (pss[1] != "") {
                                  //alert("debug: restrictKPIs to: " + pss[1] + " (in dev)");
                                  var mykpis = pss[1];
                                  setTimeout(function() { //In lieu of Surgery or Promises (which will be present in the filter directive).
                                    $("#selKPIs option").each(function() {
                                        var ks = mykpis;
                                        var kss = ks.split(",");
                                        var found = false;
                                        for (var k in kss) {
                                            if (kss[k] == $(this).val()) {
                                                found = true;
                                                break;
                                            }
                                        }
                                        if (!found) {
                                            $(this).remove();
                                        }
                                    });
                                    $("#selKPIs").trigger("liszt:updated");
                                    if (mysubkpis != "") {
                                        $("#selKPIs").trigger("change");
                                        setTimeout(function() {

                                            $("#selSubKPIs option").each(function() {
                                                var ks = mysubkpis;
                                                var kss = ks.split(",");
                                                var found = false;
                                                for (var k in kss) {
                                                    if (kss[k] == $(this).val()) {
                                                        found = true;
                                                        break;
                                                    }
                                                }
                                                if (!found) {
                                                    $(this).remove();
                                                }
                                            });
                                            $("#selSubKPIs").trigger("liszt:updated");
                                        }, 1500);
                                        //$(".subkpi-display").show();
                                        //alert("debug: ready to set subkpis to: " + mysubkpis);
                                    }
                                  }, 2000);
                                }
                            }
                            else if (pss[0] == "restrictSubKPIs") {
                                mysubkpis = pss[1];
                            }
                        }
                    }
                }

                if ((a$.urlprefix() == "chime.") || (a$.urlprefix().indexOf("chime-make40.") >= 0)) { //Set location to 1 (Morrow)
                    if (false) {
                        $("#selLocations").val("1").trigger("liszt:updated");
                        $("#locationlabel,#locationfilter").hide();
                    }
                }

                //DONE: Add filters if they are in the add list.
                var ab = appApmDashboard.getAddBoxList();
                var sa = "".split(",");
                if (a$.exists(ab)) {
                    sa = ab.split(",");
                }
                //Hide them all by default.
                $(".date-display2").hide();
                $(".qualityform-display").hide();
                for (var s in sa) {
                    switch (sa[s]) {
                        case "Payperiod2":
                           $(".date-display2").show();
                           break;
                        case "Qualityform":
                           $(".qualityform-display").show();
                           break;
                    }
                }

                //DONE: Suppress filters if they are in the suppress list.
                var ssa = appApmDashboard.getSuppressBoxList();
                var ss = "".split(",");
                if (a$.exists(ssa)) {
                    ss = ssa.split(",");
                }
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
                $("#gaugesdiv1,#gaugesdiv2").hide();

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
                        if (a$.urlprefix() == "cox.") { //MAKEFILTER
                            $("#selPayperiods option").each(function () {
                                if ($(this).html() == "Current Month") {
                                    $("#selPayperiods").val($(this).val());
                                }
                            });
                        }
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
                $("#csrfilter,#filtersdiv,#hiredatelabel,#hiredatefilter,#newhiredatesdl").hide();
                $("#agencylabel,#agencyfilter,#agencyofficelabel,#agencyofficefilter").hide();
                $("#attritiontab,#attritiondiv").hide(); //Changed 2018-12-05 - Attrition is now always a report.
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
                //$("#hiredatelabel,#hiredatefilter").show();
                $("#newhiredatesdl").show();

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
        if (FIRSTPASSFILTERS || changingscorecards) { //}((filter != "AttritionManagement") /* && (filter != "Agent_Attrition") */ ) {
            if (a$.gup("oldfilters") != "Y") {
                FIRSTPASSFILTERS = false;
            }
            appApmDashboard.initcontrols();
        }
    }

    function plotIntercept(viewindex, reset, supresstools) {
        
        $("#Plotstamp").html(Date.now());
        switch (current_filter) {
            case "Agent_Attrition":
                showReport("AttritionGrid", ".AttritionReports", "Grid");
                break;
            case "Reports":
                if (((window.reportclickintercept != "Yes") || (window.reportload_state == "COMPLETE")) && ($("#ReportReportFavorites").css("display") != "none") && (location.hash.indexOf("#Report_") != 0)) {
                    if (window.reportload_state == "COMPLETE") {
                        window.reportclickintercept = "";
                        window.reportload_state = "";
                    }
                    window.location = "//" + a$.urlprefix(true) + "acuityapmr.com/jq/dashboardasync.aspx?prefix=" + a$.urlprefix().split(".")[0] + "#Report_" + $("#ReportReportFavorites select").val();
                }
                else if ($("#ReportReportList select").val() != "") {
                    if (window.reportload_state == "PROJECTLOADED") break;
                    //alert("debug: 4suppress list = " + $("#ReportReportList select option[value='" + $("#ReportReportList select").val() + "']").attr("suppress_list"));
                    appApmDashboard.setAddBoxList($("#ReportReportList select option[value='" + $("#ReportReportList select").val() + "']").attr("add_list"));
                    appApmDashboard.setSuppressBoxList($("#ReportReportList select option[value='" + $("#ReportReportList select").val() + "']").attr("suppress_list"));
                    setSuppressMenuList($("#ReportReportList select option[value='" + $("#ReportReportList select").val() + "']").attr("suppress_menus"));
                    /*
                    if (a$.urlprefix() == "chime.") { //MAKEFILTER
                        $("#selPayperiods option").each(function () {
                            if ($(this).html() == "Current Week") {
                                $("#selPayperiods").val($(this).val());
                            }
                        });
                    }
                    */
                    //duck
                    if ($("#ReportReportList select option[value='" + $("#ReportReportList select").val() + "']").attr("cds_override") == "") {
                        showReport($("#ReportReportList select").val(), ".ReportReports", "Grid");
                    }
                    else if ($("#ReportReportList select option[value='" + $("#ReportReportList select").val() + "']").attr("cds_override") == "RS") { //duck
                        var myframe = $("#ReportSandboxIframe").eq(0);
                        if ($(myframe).attr("src") == "") {
                            $(myframe).attr("src", a$.debugPrefix() + "/3/ng/ReportEditor/default.aspx?prefix=" + a$.urlprefix().split(".")[0] + "&panelcid=" + $("#ReportReportList select").val().split("?")[0]);
                        }
                        $(".ReportReports").hide();
                        $(".ReportSandbox").show();

                        $("#SearchLabel").hide();
                        $(".report-filter-global").hide();
                        $(".report-search-top").css("padding-bottom","4px");

                        $("#ReportShowInTraining").parent().hide();
                        $("#ReportReportScoreModel").parent().hide();
                    }
                    if (window.reportload_state == "FINALCLICK") {
                        $("#ReportReportList select").trigger("change");
                    }
                }
                else {
                    alert("debug:No report selected, not sure how we want to route this");
                }               

                break;
            default:
                if (document.getElementById("rdoGrid").checked) { //Grid Plot Redirect
                    $("#reporttab").show();
                    $("#reportlabel").trigger("click");
                    //$('#ReportReportList select option[text="Grid"]').attr("selected", "selected");
                    $('#ReportReportList select option').each(function() {
                        if ($(this).html() == "Grid") {
                            $('#ReportReportList select').val($(this).attr("value"));
                        }
                    });
                    appApmDashboard.setAddBoxList($("#ReportReportList select option[value='" + $("#ReportReportList select").val() + "']").attr("add_list"));
                    appApmDashboard.setSuppressBoxList($("#ReportReportList select option[value='" + $("#ReportReportList select").val() + "']").attr("suppress_list"));
                    setSuppressMenuList($("#ReportReportList select option[value='" + $("#ReportReportList select").val() + "']").attr("suppress_menus"));
                    showReport($("#ReportReportList select").val(), ".ReportReports", "Grid", true);
                    $(".ReportReports").hide();
                    function plotdelay() {
                        $(".ReportReports").html("").show();
                        $(".btnPlot").trigger('click');
                    }
                    setTimeout(plotdelay, 1000);
                }
                else {
                    appApmDashboard.plotme(viewindex, reset, supresstools);
                }
                break;
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
        $(".report-intraining-wrapper,.report-grouping-wrapper,.report-show-wrapper,.report-filter-wrapper").show();
        $("#tabs-report .tabarea").css("max-width","1400px");
        var ls = "".split(",");
        if (a$.exists(lst)) {
            ls = lst.split(",");
        }
        for (var l in ls) {
            switch (ls[l]) {
                case "nomargin":
                    $("#tabs-report .tabarea").css("max-width","10000px");
                    break;
                case "intraining":
                    $(".report-intraining-wrapper").hide();
                    break;
                case "grouping":
                    $(".report-grouping-wrapper").hide();
                    break;
                case "show":
                    $(".report-show-wrapper").hide();
                    break;
                case "filter":
                    $(".report-filter-wrapper").hide();
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
        plotIntercept: plotIntercept,
        printReport: printReport
    };

})();
