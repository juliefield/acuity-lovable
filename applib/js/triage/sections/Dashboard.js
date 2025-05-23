/************
appApmDashboard - Graph/Table/Gauge App
Changes for 2.1
- added success: member to refreshboxes (del will still work).
- payperiodrestrict will be ignored for now.
- each for payperiod comes from the filtercontext, not hard coded.
2.7.1 - Supervisor Dashboard addition.
2.7.5 - Changed APMProjectFilter to allow restriction to a group if there's a pipe, E.G. Early|TXU.  This is a kluge for CES.
2.7.7 - Release of CEPoints to CSRs.
2.10.0 - Add ability to calculate a kpi on the fly client-side (used for Attrition in TSE (Model 3)
2.13.0 - Added Base+ ranking.
2.14.0 - Maintenance
2.15.0 - subkpi split window.
2.15.6 - Raw scores substituted via serverTooltipLib (Restricted to KM2 initially)
************/

(function () {
    if (!window.jQuery) {
        alert("This App requires jQuery");
        return;
    }
    var $ = window.jQuery;
    var firstdbf = true;

    //private vars
    var controlopts,
        filterperflevel,
        dataperflevel,
        op, //The current (when current is known) collection of chart options.
        opt;
    var singleColors = ["#CD6607", "#B1B17B", "#405774", "#F6A03D", "#757116", "#AEBC21", "#D9DB56",
        "#4C88BE", "#129793", "#505050", "#F5D769", "#8DB87C", "#53004B", "#FEB729", "#BD2031", "#A25F08"
    ];
    var dualColors = [];
    var filterParams = "";

    var SCOREBASIS = 10;
    var BalancedWord = "Balanced";
    if ((a$.urlprefix() == "chime.") || (a$.urlprefix() == "chime-test.") || (a$.urlprefix() == "chime-make40.")) {
        SCOREBASIS = 4;
        BalancedWord = "Chime";
    }
    if ((a$.urlprefix() == "cox.") || (a$.urlprefix() == "cox-test.") || (a$.urlprefix() == "cox-make40.")) {
        SCOREBASIS = 7;
    }

    var peerevaluate = false;
    var peereval_initinstance = true;

    for (var sc in singleColors) {
        dualColors.push(singleColors[sc]);
        dualColors.push(singleColors[sc]);
    }

    var cookieprefix = "PC";

    function setCookiePrefix(val) {
        cookieprefix = val;
    }

    function getCookiePrefix(val) {
        return cookieprefix;
    }

    filterperflevel = "Express";
    dataperflevel = "Normal";
    var csrranking = "ProjectLocation";

    var suppressboxlist = "";

    function setSuppressBoxList(sbl) {
        suppressboxlist = sbl;
    }

    function getSuppressBoxList() {
        return suppressboxlist;
    }

    var specialflagslist = "";

    function setSpecialFlagsList(sfl) {
        specialflagslist = sfl;
    }

    function setDataPerfLevel(val) {
        dataperflevel = val;
    }

    function setCSRRankingBy(val) {
        csrranking = val;
    }

    function setFilterPerfLevel(val) {
        filterperflevel = val;
    }

    function hdupdate(event, ui) {
        if (dsh.hiredate) delete dsh.hiredate;
        dsh.hiredate = {
            start: dsh.hiredates[ui.values[0]],
            end: dsh.hiredates[ui.values[1]]
        };
        $("#hiredate .hd-label").html(dsh.hiredate.start + " - " + dsh.hiredate.end);
    };

    function nodollar(t) {
        if (t.charAt(0) == '$') {
            return (t.replace('$', ''));
        }
        return t;
    }

    //MADELIVE: Replace this (2).
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

    function sethiredateslider() {
        var edx = dsh.hiredates.length - 1;
        var hdrange = [0, edx];
        $("#hiredate .hd-slider").slider({
            range: true,
            min: 0,
            max: edx,
            values: hdrange,
            slide: hdupdate
        });
        hdupdate(null, {
            values: hdrange
        });
    }

    var dridx = 0;

    function drupdate(event, ui) {
        if (dsh.sliderdate) delete dsh.sliderdate;
        dsh.sliderdate = {
            start: dsh.dates[dridx].ranges[ui.values[0]].start,
            end: dsh.dates[dridx].ranges[ui.values[1]].end
        };
        $("#daterange .dr-label").html(dsh.sliderdate.start + " - " + dsh.sliderdate.end);
    };

    function setdaterangeslider(id) {
        for (var i in dsh.dates) {
            if (dsh.dates[i].id == id) {
                dridx = i;
                break;
            }
        }
        if (dsh.dates[dridx].id != id) {
            if (id == "0") {
                var found = false;
                for (var i in dsh.dates) {
                    if (dsh.dates[i].name == "LAST60DAYS") {
                        dridx = i;
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    //TODO: Load for last 90 days.
                    dridx = dsh.dates.length;
                    var ranges = [];
                    var today = new Date();
                    for (var d = -60; d <= 0; d++) {
                        var a = addDays(today, d);
                        ranges.push({
                            start: (a.getMonth() + 1) + "/" + a.getDate() + "/" + a.getFullYear(),
                            end: (a.getMonth() + 1) + "/" + a.getDate() + "/" + a.getFullYear()
                        });
                    }
                    dsh.dates.push({
                        name: "LAST60DAYS",
                        ranges: ranges
                    }); //[{ start: "03/25/2015", end: "03/25/2015" }, { start: "03/26/2015", end: "03/26/2015" }, { start: "03/27/2015", end: "03/27/2015"}]
                }
            } else {
                alert("Error: 23299 - No match found for : " + id);
            }
        }
        var edx = dsh.dates[dridx].ranges.length - 1;
        var drrange = [0, edx];
        $("#daterange .dr-slider").slider({
            range: true,
            min: 0,
            max: edx,
            values: drrange,
            slide: drupdate
        });
        drupdate(null, {
            values: drrange
        });
    }

    var dsh;

    function getdashboardsettings() {
        var databld = {
            cmd: "dashboardsettings",
            daterestriction: "No" /* , username: $.cookie("TP1Username") */
        };
        a$.ajax({
            type: "GET",
            async: true,
            data: databld,
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: loaded
        });

        function loaded(json) {
            if (a$.jsonerror(json)) { } else {
                dsh = json;
                if (dsh.dates.length > 0) setdaterangeslider(dsh.dates[0].id); //TODO: Use ORG_INTERVAL for the correct ID (don't assume 0).
                //Test
                //dsh.hiredates = ["2/2/2011","3/3/2011", "4/4/2012", "5/5/2013"];
                if (dsh.hiredates) {
                    if (dsh.hiredates.length > 0) sethiredateslider();
                }
                a$.ajax({
                    type: "GET",
                    service: "JScript",
                    async: true,
                    data: {
                        lib: "admin",
                        cmd: "dashboardsettings"
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: loaded
                });

                function loaded(json) {
                    if (a$.jsonerror(json)) { } else {
                        dsh.v2 = json; //TODO: Eventually do all dsh settings in v2 and then collapse dsh.v2 to dsh
                        //alert("debug: dsh.v2.sourceAttritScores.length = " + dsh.v2.sourceAttritScores.length);
                    }
                }
            }
        }
    }

    function change(me, dontsetcookies) {
        //alert("debug:change is being called");
        if (controlopts.pagecontrols) {
            for (var j in controlopts.pagecontrols) {
                if (controlopts.pagecontrols[j].type == 'select') {
                    if (me.id == 'sel' + controlopts.pagecontrols[j].idtemplate + 's') {
                        if (controlopts.pagecontrols[j].onchange) {
                            controlopts.pagecontrols[j].onchange(dontsetcookies);
                        }
                    }
                }
            }
            if (dontsetcookies) { } else {
                //alert("debug:setting cookies");
                var sb;
                for (var j in controlopts.pagecontrols) {
                    if (controlopts.pagecontrols[j].type == 'select') {
                        sb = document.getElementById('sel' + controlopts.pagecontrols[j].idtemplate + 's');
                        if (sb.length > 0) {
                            $.cookie(cookieprefix + "-" + controlopts.pagecontrols[j].idtemplate, sb.options[sb.selectedIndex].value, {
                                expires: 365
                            });
                            window.localStorage.setItem(cookieprefix + "-" + controlopts.pagecontrols[j].idtemplate, sb.options[sb.selectedIndex].value);
                        }
                    }
                }
            }
        }
    }

    function splitdates(me, from, to) {
        if (me && from && to) {
            var datesplit;
            //MADEDEV
            if (me.selectedIndex >= 0) {
                datesplit = me.options[me.selectedIndex].value.split(",");
            }
            else {
                datesplit = "".split(",");
            }
            if (datesplit.length > 0) {
                from.innerHTML = datesplit[0];
            }
            if (datesplit.length > 1) {
                to.innerHTML = datesplit[1];
            } else if (datesplit[0].substring(0, 4) == 'each') {
                from.innerHTML = "Each";
                to.innerHTML = "Each";
            } else if (datesplit[0] == '') {
                from.innerHTML = "All";
                to.innerHTML = "All";
            }
        }
    }

    var ininit = false;

    function setcontrolopts(opts) {
        if (opts) controlopts = opts; //use an "extend" when you make default parameters.
    }

    function initcontrols(opts) {
        if (((a$.urlprefix() == "km2.") || (a$.urlprefix() == "km2-make40.") || (a$.urlprefix() == "ers.") || (a$.urlprefix() == "make40.")) && ($.cookie("TP1Role") == "Team Leader")) {
            peerevaluate = true;
        }
        if (opts) controlopts = opts; //use an "extend" when you make default parameters.
        for (var i in controlopts.views) {
            if (controlopts.views[i].chartoptions) {
                genchart(controlopts.views[i].chartoptions);
                //WAS: controlopts.views[i].chartoptions.mychart = new Highcharts.Chart(controlopts.views[i].chartoptions);
            }
        }
        if (controlopts.initfunction) {
            ininit = true;
            controlopts.initfunction(); //The initfunction needs to call finishinit when done.
            ininit = false;
        } else {
            finishinit();
        }
    }

    function genchart(myop) {
        if (RANKTHEME) {
            if ((a$.urlprefix() == "cox.") || (a$.urlprefix() == "cox-test.") || (a$.urlprefix() == "cox-make40.") || (a$.urlprefix() == "v3.")) {
            }
            else {
                myop.yAxis[0].max = 100;
            }
            myop.yAxis[0].plotBands = [{
                color: 'Red',
                from: -0.4,
                to: 0.00
            }];
            for (var i in controlopts.rankRanges) {
                if (controlopts.rankRanges[i].threshold > 0.0) {
                    myop.yAxis[0].plotBands.push({
                        color: /* '#00246d', */Highcharts.theme.yAxis.plotBands.color,
                        from: (controlopts.rankRanges[i].threshold * 100.0) - (0.2 * (SCOREBASIS / 10.0)),
                        to: (controlopts.rankRanges[i].threshold * 100.0) + (0.2 * (SCOREBASIS / 10.0))
                    });
                }
            }
        } else {
            var tenit = true;
            //if ((a$.urlprefix() == "km2.") || (a$.urlprefix() == "km2-make40.")) {
            if ($("#StgScoreModel select").val() == "Raw") {
                if ($("#selKPIs").val() != "") {
                    tenit = false;
                }
            }
            //}
            if (tenit) {
                if ((a$.urlprefix() == "cox.") || (a$.urlprefix() == "cox-test.") || (a$.urlprefix() == "cox-make40.") || (a$.urlprefix() == "v3.")) {
                }
                else {
                    myop.yAxis[0].max = SCOREBASIS;
                }
            }
            myop.yAxis[0].plotBands = [{
                color: 'Red',
                from: -0.04,
                to: 0.00
            }];
            for (var i in controlopts.performanceRanges) {
                if (controlopts.performanceRanges[i].threshold > 0.0) {
                    myop.yAxis[0].plotBands.push({
                        color: /* '#00246d', */Highcharts.theme.yAxis.plotBands.color,
                        from: controlopts.performanceRanges[i].threshold - (0.02 * (SCOREBASIS / 10.0)),
                        to: controlopts.performanceRanges[i].threshold + (0.02 * (SCOREBASIS / 10.0))
                    });
                }
            }
        }
        appLib.generatechart(myop);
    }

    function finishinit(obj) {
        var exc = "".split(",");
        //exclude all ids passed explicitly in "exclude:"
        if (obj) {
            if (obj.exclude) {
                exc = obj.exclude.split(",");
            }
        }
        var sb, vc;
        for (var j in controlopts.pagecontrols) {

            if (controlopts.pagecontrols[j].type == 'select') {
                var excludeme = false;
                for (var e in exc) {
                    if (exc[e] == controlopts.pagecontrols[j].idtemplate) {
                        excludeme = true;
                        break;
                    }
                }
                if (!excludeme) {
                    sb = document.getElementById('sel' + controlopts.pagecontrols[j].idtemplate + 's');
                    vc = $.cookie(cookieprefix + "-" + controlopts.pagecontrols[j].idtemplate);
                    vc = window.localStorage.getItem(cookieprefix + "-" + controlopts.pagecontrols[j].idtemplate);
                    var projectchanged = false;
                    if (obj) {
                        if (exists(obj.projectchanged)) {
                            projectchanged = obj.projectchanged;
                        }
                    }
                    if (vc && (!projectchanged)) {
                        if (sb.selectedIndex >= 0) {
                            if (vc != sb.options[sb.selectedIndex].value) {
                                $('#sel' + controlopts.pagecontrols[j].idtemplate + 's').val(vc).trigger("liszt:updated");
                                change(sb, true);
                            }
                        }
                    }
                }

                //FacePlate Specific
                if ((cookieprefix == "SD") || (cookieprefix == "FD")) {
                    if (controlopts.pagecontrols[j].idtemplate == "CSR") {
                        var sbid = '#sel' + controlopts.pagecontrols[j].idtemplate + 's';
                        if ($(sbid).val() == "") {
                            $(sbid + " option").each(function () {
                                if ($(this).val().toLowerCase().indexOf("plate") >= 0) {
                                    /*
                                    alert("debug:ready to set to:" + $(this).text() + "/" + $(this).val());
                                    $(sbid).val($(this).val()).trigger("liszt:updated");
                                    change(document.getElementById('sel' + controlopts.pagecontrols[j].idtemplate + 's'), true);
                                    */
                                }
                            });

                        }
                    }
                }

                switch (cookieprefix) {
                    case "Program":
                    case "Financial":

                };

            }
        }
        //handle init_ parameters.
        var wh = window.location.href.split("?");
        if (wh.length > 1) {
            var pars = wh[1].split("&");
            for (var i in pars) {
                var par = pars[i].split("=");
                if (par.length > 1) {
                    var phrase = par[0].split("_");
                    if (phrase.length > 1) {
                        if (phrase[0] == "init") {
                            $('#sel' + phrase[1] + 's').val(par[1]).trigger("liszt:updated");
                        }
                    }
                }
            }
        }
    }

    function boxval(idt) {
        var bld = "";
        var sb = document.getElementById('sel' + idt + 's');
        if (sb.selectedIndex < 0) return "none";
        //Modified 2017-3-7: Allow for multiple selections in a box (test thoroughly).
        //was: bld += idt + "=" + sb.options[sb.selectedIndex].value;
        bld += idt + "=" + $("#sel" + idt + "s").val();
        return bld;
    }

    function splitdateval(idt) {
        var bld = "";
        var first = true;
        var sb = document.getElementById('sel' + idt + 's');
        //MADEDEV
        var mydate;
        if (sb.selectedIndex >= 0) {
            mydate = sb.options[sb.selectedIndex].value;
        }
        else {
            mydate = "";
        }
        if (mydate != '') {
            if (mydate.substring(0, 4) == 'each') {
                //alert("debug:mydate1=" + mydate);
                mydate = mydate + ',' + mydate;
                //alert("debug:mydate2=" + mydate);
            }
            //if (mydate == 'eachmonth') mydate = 'eachmonth,eachmonth';
            var datesplit = mydate.split(",");
            if (datesplit.length > 0) {
                if (!first) bld += "&";
                first = false;
                bld += "StartDate=" + datesplit[0];
            }
            if (datesplit.length > 1) {
                if (!first) bld += "&";
                first = false;
                bld += "EndDate=" + datesplit[1];
            }
        }
        return bld;
    }

    function viewparams(viewindex, eachisall) {
        var bld = "";
        var first = true;

        var supsp = suppressboxlist.split(",");

        if (controlopts.pagecontrols) {
            if (controlopts.views[viewindex].filters) {
                for (var i in controlopts.views[viewindex].filters) {
                    if (controlopts.views[viewindex].filters[i].pcid) {
                        for (var j in controlopts.pagecontrols) {
                            if (controlopts.pagecontrols[j].idtemplate == controlopts.views[viewindex].filters[i].pcid) {
                                var suppressed = false;
                                for (var s in supsp) {
                                    if (supsp[s] == controlopts.pagecontrols[j].idtemplate) {
                                        suppressed = true;
                                        break;
                                    }
                                }
                                if (controlopts.pagecontrols[j].param) {
                                    if (!first) bld += "&";
                                    first = false;
                                    if (!suppressed) {
                                        var hld = controlopts.pagecontrols[j].param();
                                        if (eachisall) {
                                            bld += hld.replace(/=each/g, "=");
                                        } else {
                                            bld += hld;
                                        }
                                    }
                                    else {
                                        bld += controlopts.pagecontrols[j].idtemplate + "="
                                    }
                                    if (exists(controlopts.views[viewindex].filters[i].ivtype)) {
                                        bld += "&ivtype=" + controlopts.views[viewindex].filters[i].ivtype;
                                    }
                                    break;
                                }
                            }
                        }
                    } else if (controlopts.views[viewindex].filters[i].param) {
                        if (!first) bld += "&";
                        first = false;
                        bld += controlopts.views[viewindex].filters[i].param();
                    }
                }
            }
        }
        //TODO: This is very much tied to the dashboard, may want to review.
        if (document.getElementById("rdoTrend") != null) {
            if (document.getElementById("rdoTrend").checked) {
                if (!first) bld += "&";
                bld += "daterange=" + dsh.sliderdate.start + "," + dsh.sliderdate.end;
            }
        }
        if (($("#StgHireDatesFilter select").val() == "Filter On") || ($("#StgDashboard select").val() == "Source") || ($("#StgDashboard select").val() == "Attrition")) {
            if (!first) bld += "&";
            bld += "hiredate=" + dsh.hiredate.start + "," + dsh.hiredate.end;
        }

        if ($("#StgRanking select").val() == "On") {
            if (!first) bld += "&";
            bld += "rank=" + csrranking;
        }
        if (filterParams != "") {
            if (!first) bld += "&";
            bld += filterParams;
        }
        //alert("debug: viewparams=" + bld);
        return bld;
    }

    function pagecontrolparams(includePayPeriods) {
        var bld = "";
        var first = true;
        if (controlopts.pagecontrols) {
            for (var j in controlopts.pagecontrols) {
                if (includePayPeriods || (controlopts.pagecontrols[j].idtemplate != 'Payperiod')) { //OPTIMIZE 8/1/2014 (remove date range from filter queries)
                    if (controlopts.pagecontrols[j].param) {
                        if (!first) bld += "&";
                        first = false;
                        bld += controlopts.pagecontrols[j].param();
                    }
                }
            }
        }
        return bld;
    }

    function pagecontrolobject() {
        var o = {};
        if (controlopts.pagecontrols) {
            for (var j in controlopts.pagecontrols) {
                if (controlopts.pagecontrols[j].param) {
                    var ppl = controlopts.pagecontrols[j].param().split('&');
                    for (var i in ppl) {
                        var spl = ppl[i].split('=');
                        o[spl[0]] = spl[1];
                    }
                }
            }
        }
        return o;
    }

    //Only retrieve filters that are in some view.
    function foundboxes(s) {
        var ret = "";
        var sp = s.split(",");
        //TODO: Cross-reference against a dashboard-level suppress list. (suppressboxlist)
        var supsp = suppressboxlist.split(",");

        for (var j in sp) {
            var spl = sp[j].split("/");
            for (var i in controlopts.views) {
                for (var k in controlopts.views[i].filters) {
                    if (spl[0] == controlopts.views[i].filters[k].pcid) {
                        //Updated 08/04/2014
                        var hidden = false;
                        for (var s in supsp) {
                            if (spl[0] == supsp[s]) {
                                hidden = true;
                            }
                        }
                        if (!hidden) {
                            if (exists(controlopts.views[i].filters[k].hidden)) hidden = controlopts.views[i].filters[k].hidden;
                            if (exists(controlopts.views[i].filters[k].init)) hidden = false; //Go ahead and fill if there is an init value.
                        }

                        if (!hidden) {
                            if (ret != "") ret += ",";
                            ret += sp[j];
                        }
                        break;
                    }
                }
            }
        }
        return ret;
    }
    var qTeamRefresh = false;

    function refreshboxes(obj) {
        //alert("deubg:at refreshboxes");
        //alert("debug: my role is: " + $.cookie("TP1Role"));
        qTeamRefresh = false;
        try {
            a$.showprogress('comboprogress');
        } catch (err) { }

        //alert("debug:Type for refreshbox:" + typeof obj);
        //alert("debug:update combofilters");
        var includePayPeriods = false;
        var fndbxs = "";
        if (typeof obj == "string") { //old code, adjust for backward compatibility
            fndbxs = foundboxes(obj);
        } else {
            fndbxs = foundboxes(obj.which);
        }
        if (fndbxs.indexOf("Evaluator") >= 0) {
            includePayPeriods = true;
        }
        if (($("#StgDashboard select").val() == "Source") || ($("#StgDashboard select").val() == "Attrition")) {
            includePayPeriods = true;
        }
        if (fndbxs == "") {
            a$.hideprogress('comboprogress');
            return; //OPTIMIZE 8/4/14, if nothing to reload, nothing to refresh.
        }

        var urlbld = "Combofilters.ashx?" + pagecontrolparams(includePayPeriods);
        if (document.getElementById("StgDashboard") != null) {
            urlbld += "&Connection=" + connectionfilter($("#StgDashboard select").val());
        }
        if (document.getElementById("StgSupervisorFilters") != null) {
            urlbld += "&suprestrict=" + suprestrict;
        }
        //if (document.getElementById("StgNoDateRestriction") != null) {
        //    if ($("#StgNoDateRestriction select").val() == "On") {
        urlbld += "&nodaterestriction=1";
        urlbld += "&isdashboard=1";
        //    }
        //}

        //TODO: Add a dashboard-level special-flags list (first case: loadperiods=Month) (specialflagslist)

        if (specialflagslist != "") {
            urlbld += "&" + specialflagslist;
        }

        if ($.cookie("TP1Boxfilter") == "on") {
            urlbld += "&username=" + $.cookie("TP1Username") + "&role=" + $.cookie("TP1Role");
        } else if ((a$.urlprefix() == "sprintgame.") || (a$.urlprefix().indexOf("make40.") >= 0)) { //2016-07-22 = Added for managers, to restrict by location //This is going in as a CLUGUE to avoid a complete visitation of the boxfilter system.
            if ($.cookie("TP1Role") == "Management") {
                urlbld += "&username=" + $.cookie("TP1Username") + "&loccheck=1";
            }
        }

        var cacheme = true; // (a$.isAndroid) ? false : true;
        var asyncme = true;
        if (typeof obj == "string") { //old code, adjust for backward compatibility
            urlbld += "&reload=" + fndbxs;
            asyncme = false;
        } else {
            urlbld += "&reload=" + fndbxs;
            if ($.cookie("ApmGuatModuleLoc") != "") { //LEAVE IN!
                urlbld += "&ApmGuatModuleLoc=" + $.cookie("ApmGuatModuleLoc");
                if (obj.which.indexOf("Payperiod") >= 0) {
                    if ((getPrev() == $.cookie("ApmGuatModuleLoc")) || ($("#selLocations").val() == $.cookie("ApmGuatModuleLoc"))) {
                        var d = new Date();
                        urlbld += "&guatcache=" + d.getTime();
                        $("#selPayperiods").empty();
                        //guat in play
                    }
                }
            }

        }
        //$("#debmon").html("out..");
        //alert("debug:sending:" + urlbld);
        if (filterperflevel == "Always") {
            cacheme = false; //Trips the browser cache with a timestamp.
        } else {
            urlbld += "&cacheme=" + filterperflevel + "&bkey=" + appLib.perfdate(filterperflevel);
        }

        //alert("debug:sending:" + urlbld);
        debugoutput(urlbld);
        cacheme = false; //debug

        $.ajax({
            type: "GET",
            url: urlbld,
            async: asyncme,
            cache: cacheme,
            dataType: "xml",
            error: function (request, textStatus, errorThrown) {
                alert('Error loading ListConfig XML Document:' + request.status + ' / ' + textStatus + ' / ' + errorThrown);
            },
            success: loadCombosFromXML
        });

        function loadCombosFromXML(xml) {
            //$("#debmon").html("..back");
            //alert("debug:back");
            var whichsplit;
            if (typeof obj == "string") {
                whichsplit = obj.split(",");
            } else {
                whichsplit = obj.which.split(",");
            }

            var myi;
            var myj;
            var csplit;
            var c;
            var PERIODRESTRICTValue = "";
            for (myi = 0; myi < whichsplit.length; myi++) {
                csplit = whichsplit[myi].split("/");
                c = csplit[0];
                for (myj = 1; myj < csplit.length; myj++) {
                    if ((csplit[myj].toLowerCase() == "month") || (csplit[myj].toLowerCase() == "payperiod")) {
                        PERIODRESTRICTValue = csplit[myj].toLowerCase();
                    }
                }
                var dbd = $("#StgDashboard select").val();
                var fil = global_currentfilter;
                loadComboFromXML(xml, c,
                    (c != 'Payperiod') && ((c != 'Project') || (((dbd == "Source") || (dbd == "Attrition") || (fil == "Agent_Attrition") || (fil == "Reports")) && (($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin") || ($.cookie("TP1Role") == "Management")))) && (c != 'Xaxis') && (c != 'DataSource') && (c != 'ACDDate') && (c != 'Trendby'), //all at top
                /*(c == 'Payperiod')*/
                    false, //all at bottom
                    ((c != 'Project') || (((dbd == "Source") || (dbd == "Attrition") || (fil == "Agent_Attrition") || (fil == "Reports")) && (($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin") || ($.cookie("TP1Role") == "Management")))) && (c != 'Payperiod') /* && (c != 'Agency') && (c != 'Agencyoffice') */ && (c != 'Xaxis') && (c != 'DataSource') && (c != 'ACDDate') && (c != 'Trendby'), //each at top
                    false, //each at bottom
                /*(c == 'Payperiod') && (PERIODRESTRICTValue != "month")*/
                    false, //eachpayperiod at bottom
                /*(c == 'Payperiod') && (PERIODRESTRICTValue != "payperiod)"*/
                    false, //eachmonth at bottom
                    (c != 'Payperiod')); //set to blank
            }
            try {
                //if (op.apmTouchpointDashboardFormatting) {
                a$.hideprogress("comboprogress");
                //}
            } catch (err) { };
            if (typeof obj != "string") {
                if (obj.del) {
                    obj.del();
                } //Don't use del anymore.
                else if (obj.success) {
                    obj.success();
                }
            }
            splitdates(document.getElementById('selPayperiods'), document.getElementById('spanDatefrom'), document.getElementById('spanDateto'));
            if (qTeamRefresh) {
                refreshboxes({
                    which: 'Team,CSR',
                    success: function () { }
                });
            } else {
                $.cookie("CombosComplete", "YES");
            }
        }
    }

    function loadComboFromXML(xml, which, allattop, allatbottom, eachattop, eachatbottom, eachpayperiodatbottom, eachmonthatbottom, settoblank) {
        var ae = true;
        if ($.cookie("TP1Boxfilter") == "on") {
            if ((which != "KPI") && (which != "SubKPI")) {
                if (($.cookie("TP1Role") == "Team Leader") && (which == "CSR")) { } else if (false) { //(peerevaluate && ($.cookie("TP1Role") == "Team Leader") && ((which == "Group") || (which == "Team"))) { //NOTE: peerevaluate
                } else if (($.cookie("TP1Role") == "Group Leader") && ((which == "CSR") || (which == "Team"))) { } else {
                    ae = false;
                }
            }
        }

        //2016-07-22 = Added for managers, to restrict by location
        //This is going in as a CLUGUE to avoid a complete visitation of the boxfilter system.
        if ((a$.urlprefix() == "sprintgame.") || (a$.urlprefix().indexOf("make40.") >= 0)) {
            if ($.cookie("TP1Role") == "Management") {
                if (which == "Location") {
                    ae = false;
                }
            }
        }

        try {
            var sb = document.getElementById('sel' + which + 's');
            var SBValue = "";
            var pj = new Array();
            var addit = true;
            if ((which == "Project") || (which == "Group")) {
                var foundpj = false;
                if ($.cookie("ApmProjectFilter") != null) {
                    if (($.cookie("ApmProjectFilter") != "none") && ($.cookie("ApmProjectFilter") != "") && ($.cookie("ApmProjectFilter") != "ALL-READONLY")) {
                        pj = $.cookie("ApmProjectFilter").split(",");
                        foundpj = true;
                    }
                }
                if (!foundpj) {
                    if ($.cookie("ApmProject") != null) {
                        if ($.cookie("ApmProject") != "none") {
                            pj = $.cookie("ApmProject").split(",");
                        }
                    } else if ($.cookie("ApmInDallas") != null) {
                        if ($.cookie("ApmInDallas") != "") {
                            pj = "Dallas,Early Out - Self Pay".split(","); //was: "Dallas,Wheaton".split(",");
                        }
                    } else {
                        pj[0] = "";
                    }
                }
            }

            $(xml).find(which + 's').each(function () {
                sb.disabled = '';
                if (sb.options.length > 0) {
                    SBValue = sb.options[sb.selectedIndex].value;
                }
                sb.options.length = 0;
                if (allattop && ae) a$.addOption(sb, "(All)", "");
                if (eachattop && ae) a$.addOption(sb, "(Each)", "each");
                $(this).find(which).each(function () {
                    if (which == "Project") {
                        if (pj.length == 0) {
                            addit = false;
                        } else if (pj[0] == "") {
                            addit = true;
                        } else {
                            addit = false;
                            for (var i in pj) {
                                if ($(this).find("desc").text() == pj[i].split("|")[0]) {
                                    addit = true;
                                    break;
                                }
                            }
                        }
                    } else if (which == "Group") {
                        if (pj.length == 0) {
                            addit = false;
                        } else if (pj[0] == "") {
                            addit = true;
                        } else {
                            addit = false;
                            for (var i in pj) {
                                var gsp = pj[i].split("|");
                                if (gsp.length < 2) {
                                    addit = true;
                                } else {
                                    if ($(this).find("desc").text() == gsp[1]) {
                                        addit = true;
                                        //In this case (there is a group match), explicitly delete the All and Each options.
                                        $("#selGroups option[value='']").remove();
                                        $("#selGroups option[value='each']").remove();
                                        qTeamRefresh = true;
                                        break;
                                    }
                                }
                            }
                        }
                    } else addit = true;

                    if (addit) {
                        if ($(this).find("key").text() == "disabled") {
                            a$.setOption(sb, "");
                            SBValue = "";
                            sb.disabled = 'disabled';
                            //alert("debug:disabling"+which);
                        } else {
                            var chimeNoInTraining = false;
                            if (which == "CSR") {
                                if ((a$.urlprefix() == "chime.") || (a$.urlprefix().indexOf("chime-make40") >= 0)) {
                                    chimeNoInTraining = true;
                                }
                            }
                            if (chimeNoInTraining) {
                                if ($(this).find("desc").text().indexOf("(In Training)") < 0) {
                                    a$.addOption(sb, $(this).find("desc").text(), $(this).find("key").text());
                                }
                                else {
                                    //a$.addOption(sb, "FLAGGED: " + $(this).find("desc").text(), $(this).find("key").text());
                                }
                            }
                            else {
                                a$.addOption(sb, $(this).find("desc").text(), $(this).find("key").text());
                            }
                        }
                    }
                });
                if (ae) {
                    if (allatbottom && ae) a$.addOption(sb, "(All)", "");
                    if (eachatbottom && ae) a$.addOption(sb, "(Each)", "each");
                } else {
                    if (sb.options != null) {
                        if (sb.options.length > 0) {
                            if ($("#StgSupervisorFilters select").val() == "Entire Project") {
                                if (!((which == "CSR") && ($.cookie("TP1Role") == "CSR"))) {
                                    if (allattop || allatbottom) a$.addOption(sb, "(All)", "");
                                    if (eachattop || eachatbottom) a$.addOption(sb, "(Each)", "each");
                                }
                            }
                        }
                    }
                }
                if (eachpayperiodatbottom) a$.addOption(sb, "(Each Pay Period)", "each");
                if (eachmonthatbottom) a$.addOption(sb, "(Each Month)", "eachmonth");

                if (which == "Trendby") {
                    a$.addOption(sb, "Daily Logs", "0");
                }
                if (peerevaluate) {
                    if (which == "CSR") {
                        if (sb.options.length <= 2) { //Counting on all or each, but no CSRs found.
                            sb.options.length = 0;
                            a$.addOption(sb, "(All)", "");
                        } else {
                            /*
                            if (peereval_initinstance) {
                            peereval_initinstance = false;
                            }
                            else {
                            $('#btnPlot').trigger("click"); //Clear if going back to your own team (where you'd be able to drill).
                            }
                            */
                            if (global_currentfilter == "Agent") {
                                $('#btnClear').trigger("click"); //Clear if going back to your own team (where you'd be able to drill).
                            }
                        }
                    }
                }
            });
            var SBInitValue = "";
            if (ininit) {
                for (var j in controlopts.views[lastViewindex].filters) {
                    if (controlopts.views[lastViewindex].filters[j].pcid == which) {
                        if (exists(controlopts.views[lastViewindex].filters[j].init)) {
                            //alert("debug:Found Init Text of: " + controlopts.views[lastViewindex].filters[j].init + " for " + which);
                            SBInitValue = controlopts.views[lastViewindex].filters[j].init;
                            break;
                        }
                    }
                }
            }
            //TODO: Set to SBInitValue as an override.
            //TODO: Set the cookie here?
            if (SBInitValue != "") SBValue = SBInitValue;

            if (settoblank || (SBValue != "")) a$.setOption(sb, SBValue);
            //look for onrefresh
            if (controlopts.pagecontrols) {
                for (var j in controlopts.pagecontrols) {
                    if (controlopts.pagecontrols[j].idtemplate == which) {
                        if (controlopts.pagecontrols[j].onrefresh) {
                            controlopts.pagecontrols[j].onrefresh();
                        }
                    }
                }
            }
            //TODO: Test
            $('#sel' + which + 's').trigger("liszt:updated");
        } catch (err) {
            //alert(err);
        }
    }

    var tableme = function (viewindex, reset) {
        if (reset) cleartables(viewindex);
        op = controlopts.views[viewindex].chartoptions;
        opt = controlopts.views[viewindex].tableoptions;
        if (!opt.tablecnt) opt.tablecnt = 0;
        maketable(viewparams(viewindex, true), "FROM_TABLEME");
    }

    function cleartable(tid) {
        $(tid).GridUnload();
    }

    function cleartables(viewindex) {
        opt = controlopts.views[viewindex].tableoptions;
        if (opt.apmTableType == 'cascade') {
            if (opt.tablecnt) {
                for (i = 1; i <= opt.tablecnt; i++) {
                    cleartable('#' + opt.apmTableId + i);
                }
            } else {
                opt.tablecnt = 0;
            }
        } else if (opt.apmTableType == 'single') {
            cleartable('#' + opt.apmTableId);
        }
    }

    var RANKTHEME = false;

    var plotme = function (viewindex, reset, supresstools) {
        var subgraph;

        if ((a$.urlprefix() == "km2.") || (a$.urlprefix() == "km2-make40.")) {
            $("#StgScoreModel select").val("Balanced");
            if (document.getElementById("rdoTrend") != null) {
                if (document.getElementById("rdoTrend").checked) {
                    $("#StgScoreModel select").val("Raw");
                }
            }
        }

        if (($("#selSubKPIs > option").length < 2) || ($("#selSubKPIs").val() == "")) {
            $('#graphsubtab').hide();
            subgraph = false;
        } else {
            subgraph = true;
            //alert("debug: Plotting Subgraph");
            $('#graphsubtab').show();
            $('#graphsublabel').trigger('click');
            //plotme_sub(viewindex, reset, supresstools); //TODO: Will be callable from the filters AND from the drilldown.  These have different ways of setting up filters.
        }
        plotme_main(viewindex, reset, supresstools, subgraph, null); //Null means use params from the filter set (otherwise they are passed)
    }

    var plotme_main = function (viewindex, reset, supresstools, subgraph, subparams) {

        var hidechart = false;

        //Experiment - Hide the Home graph when you go to a subgraph.
        if (subgraph) {
            window.graphtab = "Split"; //MADEDEV
            $('#graphsubtab').show();
            if (!$("#graphsubtab").eq(0).hasClass("ui-state-active")) {
                $('#graphsublabel').trigger('click');
            }
            $("#graphtab").hide();
        } else {
            window.graphtab = "Home"; //MADEDEV
            if (location.hash != "#Messaging") { //Added 2017-05-30 - to keep the home graph tab from showing when called from notification app.
                $("#graphtab").show();
                if (!$("#graphtab").eq(0).hasClass("ui-state-active")) {
                    $('#graphlabel').trigger('click');
                }
                $("#graphsubtab").hide();
            }
        }

        RANKTHEME = false;
        if (reset) {
            if (
                ((a$.urlprefix() == "dev.") || (a$.urlprefix() == "ers.") || (a$.urlprefix() == "make.")) &&
                ($("#selCSRs").val() != "") && ($("#selCSRs").val() != "each") &&
                $("#rdoBase").is(":checked") && ($("#StgScoreModel select").val() == "Balanced") &&
                (!(($("#selLocations").val() == "6") || ($("#selLocations").val() == "8") /* || ($("#selLocations").val() == "9") */ || ($("#selLocations").val() == "13")))) {
                var csr = $("#selCSRs option:selected").text();
                if (!(csr.indexOf("(In Training)") >= 0)) {
                    RANKTHEME = true;
                }
            }
        }

        if (supresstools) { } else {
            if ($("#StgSupTools select").val() == "On") {
                if ((a$.urlprefix() == "ers.") || (a$.urlprefix() == "make.") || (a$.urlprefix() == "ec2.")) {
                    if ($("#rdoBase").is(":checked")) {
                        if ($.cookie("TP1Role") != "CSR") {
                            appApmSupTools.init();
                        }
                    }
                }
            }
        }

        if (subgraph) {
            op = controlopts.views[viewindex].chartoptionssub;
        } else {
            op = controlopts.views[viewindex].chartoptions;
        }
        opt = controlopts.views[viewindex].tableoptions;

        var displaytype = "Base";
        if (document.getElementById("rdoTrend") != null) {
            if (document.getElementById("rdoTrend").checked) {
                displaytype = "Trend";
                op.xAxis.labels = {
                    rotation: 315,
                    align: 'right',
                    style: {
                        fontWeight: 'bold'
                    }
                };
            } else {
                delete op.xAxis.labels;
            }
        }
        if (document.getElementById("rdoPay") != null) {
            if (document.getElementById("rdoPay").checked) {
                displaytype = "Pay";
            }
        }

        if (reset) {
            if (document.getElementById("rdoGrid").checked && a$.exists(op.report)) { //TODO: There remnants are for the split report, which will be changed before implementation
                displaytype = "Grid";
                hidechart = true; //MADEDEV.  Companion chart functionality is no longer in service.
                a$.showprogress("plotprogress");
                a$.ajax({
                    type: "GET",
                    service: "JScript",
                    async: true,
                    data: {
                        lib: "editor",
                        cmd: "getreport",
                        performanceColors: window.apmPerformanceColors, //MADELIVE
                        grouping: $("#StgReportGrouping select").val(),
                        scoremodel: $("#StgReportScoreModel select").val(),
                        cid: op.report.cid,
                        dashboard: $("#StgDashboard select").val(),
                        displaytype: displaytype,
                        context: displaytype
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    params: viewparams(viewindex, false) + ((document.getElementById("StgInTraining") != null) ? "&InTraining=" + $("#StgInTraining select").val() : ""),
                    success: loaded
                });

                function loaded(json) {
                    a$.hideprogress("plotprogress");
                    if (a$.jsonerror(json)) { } else {
                        var rr = ($("#reporttab").eq(0).hasClass("ui-state-active")) ? "myreportreportcontainer" : op.report.renderTo;
                        if (json.report.show) {
                            op.report.display = true;
                            //Single panel only in Home display (for now - until the "Report" tab version is complete.)
                            if (json.report.panel.length) {
                                $("#" + rr).html(json.report.panel[0].html).show();
                            }
                            var hidechart = false;
                            //This section is duplicated in another place.
                            if ($("#" + rr).css('display') !== 'none') {
                                if (op.report.layout == "companion") {
                                    reportwidth = op.report.width;
                                } else {
                                    hidechart = true;
                                    $("#" + rr).width(($(window).width() - (325 + 25)) + 'px');
                                }
                                $("#" + rr).height(($(window).height() - 160) + 'px');
                            }
                            if (hidechart) {
                                chartdiv.style.display = "none";
                            }

                            //MADEDEV - Cosmetic fixes for old grid view, so we don't have to keep making V3 exceptions.
                            //Hide the calendar controls (they are "Reports" view only).
                            $("#" + rr + " .rpt-filter-daterange-icon").hide();
                            $("#" + rr + " .rpt-title").css("padding", "0px");

                            //TODO: Activate things in the form (it's blow & go right now).
                            $(".acuity-tablesorter").each(function () {
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
                            for (var p in json.report.panel) {
                                for (var t in json.report.panel[p].tables) {
                                    if (a$.exists(json.report.panel[p].tables[t].sort)) {
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
                                }
                            }
                            $(".acuity-download").unbind().bind("click", function () {
                                acuitytable_download("csv", $(this).parent().parent().children().eq($(this).parent().index() + 1));
                            });

                            function expandme(me, leaveopen) {
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
                                if ($(me).parent().index() == 0) { leaveopen = false; };
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
                            $(".expander").unbind().bind("click", function (e) {
                                expandme(this);
                            });
                            $(".expander").each(function () {
                                expandme(this, json.report.leaveExpanded);
                                //$(this).trigger("click");
                            });

                            /*
                            function setsort() {

                            }
                            setTimeout(setsort, 500);
                            */
                            if (location.hash == "#Messaging") {
                                $('#messageslabel').trigger('click'); // Addec 2017-05-30 - To hide the report (useful when going to messaging from the tray app).
                            }
                            if (op.chart.renderTo == "mycontainersub") { //Added: 2017-11-14 to trick back to the main display for grid view.
                                $("#graphtab").show();
                                if (!$("#graphtab").eq(0).hasClass("ui-state-active")) {
                                    $('#graphlabel').trigger('click');
                                }
                                $("#graphsubtab").hide();
                            }
                        } else {
                            if (a$.exists(op.report)) {
                                op.report.display = false;
                                $("#" + rr).html("").hide();
                            }
                        }
                    }
                }
            } else {
                if (a$.exists(op.report)) {
                    op.report.display = false;
                    var rr = ($("#reporttab").eq(0).hasClass("ui-state-active")) ? "myreportreportcontainer" : op.report.renderTo;
                    $("#" + rr).html("").hide();
                    if ((a$.urlprefix() == "km2.") || (a$.urlprefix() == "km2-make40.")) {
                        $("#" + op.chart.renderTo).html("").hide(); //For KM2, so Bar chart doesn't show up ever.
                    }
                }
            }
        } else { //If doing an "add", then this can't be displayed.
            if (document.getElementById("rdoGrid").checked && a$.exists(op.report)) {
                alert("To 'Add' results to the grid view, select multiple options in the filters (for example, select 2 or more teams).");
                return;
            }
            /*
            if (a$.exists(op.report)) {
            op.report.display = false;
            $("#" + op.report.renderTo).html("").hide();
            }
            */
        }


        if (!op.plotcnt) op.plotcnt = 0;
        if (!opt.xxref) opt.xxref = new Array();
        if (!opt.sxref) opt.sxref = new Array();

        try {
            //if (op.apmTouchpointDashboardFormatting) {
            var prdiv = document.getElementById('plotprogress');
            if (prdiv) {
                prdiv.style.top = (($(window).height() - 100) / 2) + 'px';
                prdiv.style.left = (250 + (($(window).width() - 280) / 2)) + 'px';
            }
            a$.showprogress("plotprogress");
            var chartdiv = document.getElementById(op.chart.renderTo);

            var reportwidth = 0;

            if (a$.exists(op.report)) {
                if (op.report.display) {
                    if (a$.exists(op.report.renderTo)) {
                        if ($("#" + op.report.renderTo).css('display') !== 'none') {
                            if (op.report.layout == "companion") {
                                reportwidth = op.report.width;
                            } else {
                                hidechart = true;
                                $("#" + op.report.renderTo).width(($(window).width() - (325 + 25)) + 'px');
                            }
                            $("#" + op.report.renderTo).height(($(window).height() - 160) + 'px');
                        }
                    }
                }
            }
            var leftwidth = 300;

            if ($(".leftpanel-icons").eq(0).css("display") != "none") {
                leftwidth = 75;
            }

            if (hidechart) {
                chartdiv.style.display = "none";
            } else {
                if (chartdiv) {
                    chartdiv.style.display = "inline";
                    //WAS:  chartdiv.style.width = ($(window).width() - 325) + 'px';

                    //Was last:
                    //chartdiv.style.width = ($(window).width() - ((leftwidth + 25) + reportwidth)) + 'px';
                    //chartdiv.style.height = ($(window).height() - 140) + 'px';
                    chartdiv.style.width = "800px";
                    chartdiv.style.height = "600px";

                }
            }
            var tabsdiv = document.getElementById("tabs");

            if (tabsdiv) {
                tabsdiv.style.width = ($(window).width() - (leftwidth - 12)) + 'px';
            }
            var pgdiv = document.getElementById('mytable1');
            if (pgdiv) {
                pgdiv.style.width = ($(window).width() - (leftwidth - 22)) + 'px';
                pgdiv.style.height = ($(window).height() - 200) + 'px';
            }
            //}
        } catch (err) { }

        if (reset) {
            op.plotcnt = 0;
            try {
                op.series.length = 0;
            } catch (err) {
                op.series = new Array();
            };
            op.xAxis.categories.length = 0;
        }

        if (hidechart) return;

        var qid = dataset + "Chart";
        if (op.apmQid) qid = op.apmQid;
        //var cid = "";
        //if (op.apmCid) cid = op.apmCid;
        //var urlbld = "Query.ashx?rtype=chart&cid=" + cid + "&qid=" + qid + "&" + viewparams(viewindex, false);
        var urlbld = "Query";
        var urlhld = ".ashx?rtype=chart&qid=" + qid;
        if (subparams == null) {
            urlhld += "&" + viewparams(viewindex, false);
        } else {
            urlhld += "&" + subparams;
        }
        urlhld += "&" + a$.getallparams();
        //alert("debug: plot url = " + urlhld);

        if (document.getElementById("StgInTraining") != null) {
            urlhld += "&InTraining=" + $("#StgInTraining select").val();
        }
        if (document.getElementById("StgDashboard") != null) {
            urlhld += "&Connection=" + connectionfilter($("#StgDashboard select").val());
        }
        if (document.getElementById("rdoPay").checked) { //Changed: 2017-11-07
            if ($.cookie("ApmGuatModuleLoc") != "") {
                urlhld += "&ApmGuatModuleLoc=" + $.cookie("ApmGuatModuleLoc");
            }
        }

        var myproject = $("#selProjects").val();

        urlbld += "20";
        urlbld += urlhld;
        //Dayweighting is not even used anymore (removed 11/20/2014
        //if (((myproject == "10") || (myproject == "11")) && ((cookieprefix == "PC") || (cookieprefix == "ED"))) urlbld += "&dayweight=on";

        if (a$.gup("cid") == "") {
            urlbld += "&cid=" + $("body:first").attr("id");
        }
        var cacheme = true; // (a$.isAndroid) ? false : true;
        if (dataperflevel == "Always") {
            cacheme = false; //Trips the browser cache with a timestamp.
        } else {
            urlbld += "&cacheme=" + dataperflevel + "&bkey=" + appLib.perfdate(dataperflevel);
        }
        debugoutput(urlbld);
        $.ajax({
            type: "GET",
            url: urlbld,
            async: true,
            cache: cacheme,
            dataType: "xml",
            error: function (request, textStatus, errorThrown) {
                alert('Error loading ListConfig XML Document:' + request.status + ' / ' + textStatus + ' / ' + errorThrown);
            },
            success: loadChartFromXML
        });

        var rawMax, rawMin;

        function loadChartFromXML(xml) {
            //alert("debug:back from query");

            //experiment: cleartables(viewindex);
            a$.hideprogress("comboprogress");

            if ($("#StgScoreModel select").val() == "Balanced") {
                op.colors = singleColors;
                loadChartOverlay({
                    xml: xml,
                    overlay: 0,
                    raw: false,
                    showLegend: true,
                    bothScores: false
                });
            } else if ($("#StgScoreModel select").val() == "Raw") {
                /* TODO: What features did this have? It doesn't work - so I just substituted the raw part of the overlay
                op.colors = singleColors;
                loadChartOverlay({ xml: xml, overlay: 1, raw: true, showLegend: true, bothScores: false });
                */
                op.colors = singleColors;
                loadChartOverlay({
                    xml: xml,
                    overlay: 0,
                    raw: true,
                    showLegend: true,
                    bothScores: true
                });
            } else if ($("#StgScoreModel select").val() == "Overlay") {
                op.colors = dualColors;
                loadChartOverlay({
                    xml: xml,
                    overlay: 1,
                    raw: true,
                    showLegend: true,
                    bothScores: true
                });
                loadChartOverlay({
                    xml: xml,
                    overlay: 0,
                    raw: false,
                    showLegend: false,
                    bothScores: true
                });
            }

            //alert("debug:before plot");
            genchart(op);

            //WAS: op.mychart = new Highcharts.Chart(op);
            //alert("debug:after plot");
            if ((a$.gettablabel() != "") && (a$.gettablabel() != "graphlabel") && (a$.gettablabel() != "graphsublabel")) {
                window.usehash(); //Hides the chart if it's not the current tab.
            }
            //alert("debug:back from plotting");
            try {
                //if (op.apmTouchpointDashboardFormatting) {
                a$.hideprogress("plotprogress");
                //}
            } catch (err) { }

            if (subgraph) return; //No effect on the gauge at all.


            //TODO: Add gauge population if this is an "each" call.
            if ((dataset != "Pay") && ($("#selKPIs").val() == "")) {
                //showneedles
                //Loop through and populate needle for each series.
                //alert("debug:going to load needles");
                loadNeedlesFromXML(xml, plothold);
            } else if ((dataset != "Pay") && ($("#selKPIs").val() == "each") || ($("#selKPIs").val() == "eachlabel")) {
                //alert("debug:NOT going to load needles");
                //Call with selKPIs set to all
                a$.showprogress("gaugeprogress");

                var qid = dataset + "Chart";
                if (op.apmQid) qid = op.apmQid;
                var urlbld = "Query";
                var urlhld = ".ashx?rtype=chart&qid=" + qid + "&" + viewparams(viewindex, false) + "&" + a$.getallparams();
                if (document.getElementById("StgInTraining") != null) {
                    urlhld += "&InTraining=" + $("#StgInTraining select").val();
                }
                if (document.getElementById("StgDashboard") != null) {
                    urlhld += "&Connection=" + connectionfilter($("#StgDashboard select").val());
                }
                //if (false) { //CHANGED: 2017-10-21.  Guatemala has the same scheme as domestic now. ($.cookie("ApmGuatModuleLoc") != "") {
                if (document.getElementById("rdoPay").checked) { //Changed: 2017-11-07
                    if ($.cookie("ApmGuatModuleLoc") != "") {
                        urlhld += "&ApmGuatModuleLoc=" + $.cookie("ApmGuatModuleLoc");
                    }
                }
                var myproject = $("#selProjects").val();
                urlbld += "20";
                urlbld += urlhld;
                //if (((myproject == "10") || (myproject == "11")) && ((cookieprefix == "PC") || (cookieprefix == "ED"))) urlbld += "&dayweight=on";
                if (a$.gup("cid") == "") {
                    urlbld += "&cid=" + $("body:first").attr("id");
                }
                urlbld = urlbld.replace("&KPI=eachlabel", "&KPI=");
                urlbld = urlbld.replace("&KPI=each", "&KPI=");

                var cacheme = true; // (a$.isAndroid) ? false : true;
                if (dataperflevel == "Always") {
                    cacheme = false; //Trips the browser cache with a timestamp.
                } else {
                    urlbld += "&cacheme=" + dataperflevel + "&bkey=" + appLib.perfdate(dataperflevel);
                }

                //alert("debug:queryurl=" + urlbld);
                $.ajax({
                    type: "GET",
                    url: urlbld,
                    async: true,
                    cache: cacheme,
                    dataType: "xml",
                    error: function (request, textStatus, errorThrown) {
                        alert('Error loading ListConfig XML Document:' + request.status + ' / ' + textStatus + ' / ' + errorThrown);
                    },
                    success: loadme2
                });
                //Then have it loop through to set the needle for each series.
            } else {
                for (var i = 0; i < 16; i++) $("#needle" + i).rotate({
                    animateTo: -2
                });
                $("#gaugescore").html("");
                $("#gaugelabel").html("");
                //Peg all the needles at zero.
            }

            //Set gauge visibilities and color schemes
            //if (((a$.urlprefix() == "dev.") || (a$.urlprefix() == "ers.")) && ($("#selLocations").val() == "11") && ($("#selCSRs").val() != "") && ($("#selCSRs").val() != "each") && (($("#selProjects").val() == "3") || ($("#selProjects").val() == "4"))) {
            //Still Temporary (hard-coded) but closer.
            //Decision point for display.
            if (dataset != "Pay") {
                if (((a$.urlprefix() == "dev.") || (a$.urlprefix() == "ers.") || (a$.urlprefix() == "make.")) && ($("#selCSRs").val() != "") && ($("#selCSRs").val() != "each") && (!(($("#selLocations").val() == "6") || ($("#selLocations").val() == "8") /* || ($("#selLocations").val() == "9") */ || ($("#selLocations").val() == "13")))) {
                    var csr = $("#selCSRs option:selected").text();
                    if (csr.indexOf("(In Training)") >= 0) {
                        //IN TRAINING - Show the gauge with NO COLORS, turn off the rank bars.
                        $("#gaugeover").hide();
                        $("#rankdiv").hide();
                    } else {
                        //CSR Regular - Show the gauge with no colors, turn on the rank bars WITH COLORS.
                        $("#gaugeover").hide();
                        $("#rankdiv").show();
                    }
                    $("#gaugediv").show();
                    //#gaugediv - NO COLORS
                } else if ((a$.urlprefix() == "dev.") || (a$.urlprefix() == "make.") || (a$.urlprefix() == "ers.")) {
                    //ROLLUPS - Show the gauge with colors, hide the rank bars.
                    $("#gaugediv").show();
                    $("#gaugeover").show();
                    $("#rankdiv").hide();
                    //show round gauge
                } else {
                    $("#gaugediv").show();
                }
            } else {
                hidegauge();
            }

        }
    }

    var plothold; //Note: I had to bring this out to this level because it was undefined in firefox.
    function loadme2(xml) {
        //alert("debug: I am loaded");
        loadNeedlesFromXML(xml, plothold);
        a$.hideprogress("gaugeprogress");
    }

    function loadChartOverlay(o) { //o.xml, o.overlay, o.raw, o.showLegend
        var foundresults;
        var foundanyresults;
        var foundseries;
        var found;
        var maxy = null;
        var miny = null;
        var x;
        var y;
        var xval;
        var raw;
        var fmt;
        var rank;
        var pointsbalance;
        var i;
        var s;
        var sb;
        var pj;
        var series = new Array();
        var seriesname = "unknown";
        var seriesparams = "unknown";
        sb = document.getElementById('selProjects');
        pj = sb.options[sb.selectedIndex].value;

        /*
        $(o.xml).find('CategoryInfo').each(function () {
        $(this).find('Xinfo').each(function () {
        alert("debug:xinfo name:" + $(this).find("name").text());
        });
        });
        */

        var perfview = true;
        if (document.getElementById("StgBarView") != null) {
            if ($("#StgBarView select").val() == "Series Colors") {
                perfview = false;
            }
        }
        if (((a$.urlprefix() == "dev.") || (a$.urlprefix() == "ers.")) && ($("#selCSRs").val() != "") && ($("#selCSRs").val() != "each") && (!(($("#selLocations").val() == "6") || ($("#selLocations").val() == "8") /* || ($("#selLocations").val() == "9") */ || ($("#selLocations").val() == "13")))) {
            var csr = $("#selCSRs option:selected").text();
            if (csr.indexOf("(In Training)") >= 0) {
                perfview = false;
            }
        }


        plothold = op.plotcnt;

        if (!o.raw) {
            maxy = SCOREBASIS;
            miny = 0;
        } else {
            if (op.plotcnt == 0) {
                rawMax = 0;
                rawMin = 0;
            }
            maxy = rawMax; //Always have zero in it.
            miny = rawMin;
        }

        var ispie = false;
        if (op.chart.defaultSeriesType == 'pie') {
            ispie = true;
            op.tooltip.formatter = function () {
                return '<div>' /* style="z-index:1000;">' */ + '<b>' + this.series.name + '</b><br/>' +
                    this.point.name + ': ' + this.y + ' %' + '</div>';
            };

        }

        foundanyresults = false;
        $(o.xml).find('Communication').each(function () {
            $(this).find('Alert').each(function () {
                alert($(this).find("Message").text()); //TODO: Make this a "prompt" or something (so the text can be edited).
                foundanyresults = true; //A message is a result.
            });
        });

        if (ispie) {
            var colorset = ['white', 'red', 'yellow', 'green', 'blue'];

            for (s = 0; s >= 0; s++) {
                foundseries = false;
                $(o.xml).find('Series' + s).each(function () {
                    foundseries = true;
                    if (op.plotcnt > 0) {
                        for (var p = 0; p < op.plotcnt; p++) {
                            op.series[p].dataLabels = new Object();
                            op.series[p].dataLabels.enabled = false;
                            op.series[p].size = (((p + 1) / (op.plotcnt + 1)) * 75.0) + '%';
                            //alert("debug:" + op.series[p].name + " size=" + op.series[p].size);
                            if (p > 0) {
                                //op.series[p].innerSize = (100.0 - ((1.0 / (p)) * 100.0)) + '%';
                                op.series[p].innerSize = (((p) / (op.plotcnt + 1)) * 75.0) + '%';
                                //alert("debug:" + op.series[p].name + " innersize=" + op.series[p].innerSize);
                            }
                        }
                    }
                    $(this).find('Spec').each(function () {
                        seriesname = $(this).find("Name").text();
                        seriesparams = $(this).find("Params").text();
                    });
                    opt.sxref[op.plotcnt] = new Object();
                    opt.sxref[op.plotcnt].project = pj;
                    opt.sxref[op.plotcnt].name = seriesname;
                    opt.sxref[op.plotcnt].params = seriesparams;
                    op.series[op.plotcnt] = new Object();
                    op.series[op.plotcnt].project = new Object();
                    op.series[op.plotcnt].project = pj; //will this work?  No, it didn't. TODO:
                    op.series[op.plotcnt].showInLegend = false; // op.apmShowInLegend;
                    op.series[op.plotcnt].name = seriesname;

                    op.series[op.plotcnt].point = new Object();
                    op.series[op.plotcnt].point.events = new Object();
                    if (op.apmClickFunction) {
                        op.series[op.plotcnt].point.events.click = op.apmClickFunction;
                        op.series[op.plotcnt].point.events.dblclick = op.apmClickFunction; //Added: 2016-10-11
                    }
                    op.series[op.plotcnt].data = new Array();
                    var pn = 0;
                    $(this).find('Point').each(function () {
                        x = $(this).find("x").text();
                        y = $(this).find("y").text();
                        xval = $(this).find("key").text();
                        var pnt = new Object();
                        pnt.name = x;
                        pnt.y = parseFloat(y);
                        pnt.color = colorset[pn];
                        pn += 1;
                        op.series[op.plotcnt].data.push(pnt);
                    });
                    if (op.plotcnt > 0) {
                        op.series[op.plotcnt].innerSize = (((op.plotcnt) / (op.plotcnt + 1)) * 75.0) + '%';
                        //alert("debug:"+op.series[op.plotcnt].name+" innersize="+ op.series[op.plotcnt].innerSize);
                    }
                    op.plotcnt += 1;
                });
                if (foundseries) foundanyresults = true;
                if (foundresults) foundanyresults = true;
                if (!foundseries) break;
            }
            if (!foundanyresults) {
                //alert("No Results Found (check your date range, that's the usual culprit).");
            }
        } else {
            //alert("debug:finding series");
            for (s = 0; s >= 0; s++) {
                foundseries = false;
                $(o.xml).find('Series' + s).each(function () {
                    foundseries = true;
                    var allblank = false;
                    if (!showallseries) {
                        allblank = true;
                        $(this).find('Point').each(function () {
                            var myy = $(this).find("y").text();
                            if (myy != "") {
                                allblank = false;
                                return;
                            }
                        });
                    }
                    if (!allblank) {
                        foundresults = false;
                        $(this).find('Spec').each(function () {
                            seriesname = $(this).find("Name").text();
                            seriesparams = $(this).find("Params").text();
                            //To avoid having the change the combofilter to not pass dates for the pay tokens:
                            if (op.apmQid == "PayChart") {
                                seriesparams = seriesparams.replace("&StartDate=", "");
                                seriesparams = seriesparams.replace("&EndDate=", "");
                            }

                        });
                        $(this).find('Point').each(function () {
                            foundresults = true;
                            x = $(this).find("x").text();
                            fmt = "";
                            try {
                                fmt = $(this).find("fmt").text();
                            } catch (err) { }

                            var except = false;
                            if ((a$.urlprefix() == "ers.") || (a$.urlprefix() == "make40.")) {
                                if (x.indexOf("Utilization A-GAME") >= 0) {
                                    if (($.cookie("TP1Role") != "CSR") && ($.cookie("TP1Role") != "Team Leader")) {
                                        except = true;
                                    }
                                }
                            }

                            if ((fmt.indexOf("-X") < 0) || ($("#selKPIs").val() != "each") || except) {
                                fmt = fmt.replace("-X", "");

                                found = false;
                                for (i = 0; i < op.xAxis.categories.length; i++) {
                                    if (op.xAxis.categories[i] == x) {
                                        found = true;
                                        break;
                                    }
                                }
                                if (!found) {
                                    op.xAxis.categories.push(x);
                                }
                                found = false;
                                var proj = document.getElementById('selProjects');
                                for (i = 0; i < opt.xxref.length; i++) {
                                    if ((opt.xxref[i].category == x) && (opt.xxref[i].project == pj)) {
                                        found = true;
                                    }

                                }
                                if (!found) {
                                    opt.xxref[opt.xxref.length] = new Object();
                                    opt.xxref[opt.xxref.length - 1].category = x;
                                    opt.xxref[opt.xxref.length - 1].project = pj;
                                    opt.xxref[opt.xxref.length - 1].xval = $(this).find("key").text();
                                }
                            }
                        });
                        for (i = 0; i < op.xAxis.categories.length; i++) {
                            series[i] = null;
                        }

                        var guatwarning = false;
                        if (op.apmQid == "PayChart") {
                            if ($.cookie("ApmGuatModuleLoc") != "") {
                                //if location is *, and Group/Team/CSR is *
                                function nS(val) {
                                    return ((val == "") || (val == "each"));
                                } //non-Specific
                                if (nS($("#selLocations").val())) {
                                    if (nS($("#selGroups").val()) && nS($("#selTeams").val()) && nS($("#selCSRs").val())) {
                                        $("#selLocations option").each(function () {
                                            if (!guatwarning) {
                                                //if Guatemala is in the list
                                                if ($(this).val() == $.cookie("ApmGuatModuleLoc")) {
                                                    guatwarning = true;
                                                }
                                            }
                                        });
                                    }
                                }
                            }
                        }

                        $(this).find('Point').each(function () {
                            fmt = "";
                            try {
                                fmt = $(this).find("fmt").text();
                            } catch (err) { }
                            if (fmt == "") fmt = ".2";

                            var except = false;
                            if ((a$.urlprefix() == "ers.") || (a$.urlprefix() == "make40.")) {
                                x = $(this).find("x").text(); // I need it early
                                if (x.indexOf("Utilization A-GAME") >= 0) {
                                    if (($.cookie("TP1Role") != "CSR") && ($.cookie("TP1Role") != "Team Leader")) {
                                        except = true;
                                    }
                                }
                            }

                            if ((fmt.indexOf("-X") < 0) || ($("#selKPIs").val() != "each") || except) {
                                fmt = fmt.replace("-X", "");
                                x = $(this).find("x").text();
                                y = $(this).find("y").text();
                                if (y == "") { y = "0"; }
                                var sourceAttrit = false;
                                if (($("#StgDashboard select").val() == "Source") || ($("#StgDashboard select").val() == "Attrition")) {
                                    if (x.indexOf("Attrition") >= 0) {
                                        sourceAttrit = true;
                                    }
                                }

                                raw = "";
                                var tableraw = {};
                                try {
                                    if (op.apmQid == "PayChart") {
                                        tableraw.Level = $(this).find("paylevel").text();
                                        //alert("debug:tableraw.Level=" + tableraw.Level);
                                        tableraw.Locked = $(this).find("locked").text();
                                        tableraw.Reg_Rate = $(this).find("regular_payrate").text();
                                        tableraw.Reg_Hours = $(this).find("regular_hours").text()
                                        tableraw.Reg_Subtotal = $(this).find("regular_total").text();
                                        tableraw.OT_Rate = $(this).find("overtime_payrate").text();
                                        tableraw.OT_Hours = $(this).find("overtime_hours").text();
                                        tableraw.OT_Subtotal = $(this).find("overtime_total").text();
                                        tableraw.Total = $(this).find("total_pay").text();
                                        raw = $(this).find("regular_hours").text();
                                        raw += "~" + $(this).find("regular_payrate").text();
                                        raw += "~" + $(this).find("regular_total").text();
                                        raw += "~" + $(this).find("overtime_hours").text();
                                        raw += "~" + $(this).find("overtime_payrate").text();
                                        raw += "~" + $(this).find("overtime_total").text();
                                        var rawtmp = "~" + $(this).find("Bonus").text();
                                        raw += "~" + $(this).find("total_pay").text();
                                        raw += "~" + $(this).find("locked").text();
                                        if ((a$.urlprefix() == "bgr.")) { //TODO: Test this in general, it probably can be used for any project.  To do this right, should stop passing "paylevel" as a column in the query.
                                            for (var i = 0; i < controlopts.performanceRanges.length; i++) {
                                                if (y >= controlopts.performanceRanges[i].threshold) {
                                                    raw += "~" + controlopts.performanceRanges[i].letter;
                                                    break;
                                                }
                                            }
                                        } else {
                                            raw += "~" + $(this).find("paylevel").text();
                                        }
                                        raw += "~"; //message
                                        if (guatwarning) {
                                            raw += "NOTE: Guatemala Not Included in Results";
                                        }
                                        raw += rawtmp;
                                    } else {
                                        if (sourceAttrit) {
                                            var n = parseFloat($(this).find("RAWTOTAL").text());
                                            var d = parseFloat($(this).find("UNIQUEUSRCOUNT").text());
                                            var sd = parseFloat($(this).find("NEWUSRCOUNT").text());

                                            raw = (Math.round((n / d) * 10000.0) / 100.0); //Round to 2 places and multiply by 100
                                            raw += "~" + n + "~" + d;
                                            if (false) { //8/11 - Converting this to client-side (such a shame).
                                                if (dsh.v2.sourceAttritScores.length) {
                                                    for (var s in dsh.v2.sourceAttritScores) {
                                                        var sas = dsh.v2.sourceAttritScores[s];
                                                        if ((raw >= sas.range[0]) && (raw <= sas.range[1])) {
                                                            y = sas.score;
                                                            break;
                                                        }
                                                    }
                                                }
                                            } else {
                                                raw = "" + (Math.round(parseFloat($(this).find("raw").text()) * 100.0) / 100.0);
                                                raw += "~" + n + "~" + d + "~" + sd;
                                            }
                                        } else {
                                            raw = $(this).find("raw").text();
                                        }
                                        if (raw != "") {
                                            //Moved here on 4/30/2017
                                            if (true) { //((a$.urlprefix() == "km2.") || (a$.urlprefix() == "km2-make40.") || (a$.urlprefix() == "cox.") || (a$.urlprefix() == "cox-make40.")) { // || (a$.urlprefix() == "ers.") || (a$.urlprefix() == "make40.")) {
                                                //NOTE: You could add ERS to this, but it's only necessary if dbobarvalue results are different than a standard raw rollup.
                                                if (true) { //}($("#StgScoreModel select").val() == "Raw") {
                                                    if ($("#selKPIs").val() != "") {
                                                        //Shit.  I have to go get the dbobarvalue raw score right now, or we won't have Y axis extents.
                                                        a$.ajax({
                                                            type: "GET",
                                                            service: "JScript",
                                                            async: false,
                                                            data: {
                                                                lib: "editor",
                                                                cmd: "gettooltip",
                                                                datalabel: true
                                                            },
                                                            dataType: "json",
                                                            cache: false,
                                                            error: a$.ajaxerror,
                                                            params: $(this).find("key").text() + seriesparams, //getdrillparams(0 /*viewindex */ , seriesname, x), //this.series.name, this.point.category),
                                                            success: loaded
                                                        });

                                                        function loaded(json) {
                                                            if (a$.jsonerror(json)) { } else {
                                                                raw = json.tooltip.raw;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        //Immediately return and get the corrected raw value.
                                        //This may end up replacing some of the multiple calls to Get Tooltip
                                        //Set y (which is the balanced score) based on the range table
                                        tableraw.Raw = raw;
                                    }
                                } catch (err) { }
                                rank = "";
                                try {
                                    rank = $(this).find("rank").text();
                                    if (rank != "") {
                                        //alert("Debug:rank found = " + rank);
                                    }
                                } catch (err) { }

                                //alert("debug:x=" + x + ",y=" + y + ",raw=" + raw);

                                var found = false;
                                for (i = 0; i < op.xAxis.categories.length; i++) {
                                    if (op.xAxis.categories[i] == x) {
                                        //alert("debug3:"+x);

                                        series[i] = {
                                            name: "",
                                            version: 1
                                        };
                                        //series[i].x = x;

                                        //Cheesy!  But will be a good bandage.
                                        if (!((a$.urlprefix() == "km2.") || (a$.urlprefix() == "km2-make40."))) {
                                            if ((x.indexOf("AHT ") >= 0) || (seriesname.indexOf(" AHT") >= 0)) raw = "";
                                            if ((x.indexOf("CPH/EPH ") >= 0) || (seriesname.indexOf(" CPH/EPH") >= 0)) raw = "";
                                            if ((a$.urlprefix() == "rcm.") && ((x.indexOf("Productivity ") >= 0) || (seriesname.indexOf(" Productivity") >= 0))) raw = "";
                                            //if ((a$.urlprefix() == "km2.") && ((x.indexOf("Sales Completion ") >= 0) || (seriesname.indexOf(" Sales Completion") >= 0))) raw = "";
                                            //if (((a$.urlprefix() == "km2.") || (a$.urlprefix() == "km2-make40.")) && ((x.indexOf("Sales Units ") >= 0) || (seriesname.indexOf(" Sales Units") >= 0))) raw = "";
                                        }
                                        var actuallyzero = false;
                                        if (o.raw && (raw != "")) {
                                            series[i].y = parseFloat(raw);
                                            series[i].formy = formatraw(raw, fmt);
                                            if (!isNaN(raw)) {
                                                if (miny == null) {
                                                    miny = Math.floor(raw);
                                                } else {
                                                    miny = Math.min(miny, Math.floor(raw));
                                                }
                                                if (maxy == null) {
                                                    maxy = Math.ceil(raw);
                                                } else {
                                                    maxy = Math.max(maxy, Math.ceil(raw));
                                                }
                                            }

                                        } else {
                                            var ytest = parseFloat(y);
                                            if (ytest == 0.0) {
                                                y = "0.1";
                                                actuallyzero = true;
                                            }
                                            series[i].y = parseFloat(y);
                                            if ((a$.urlprefix() == "km2.") || (a$.urlprefix() == "km2-make40.") || (a$.urlprefix() == "ers.") || (a$.urlprefix() == "make40.") || (a$.urlprefix() == "cox.") || (a$.urlprefix() == "cox-make40.")) {
                                                if (raw != "") {
                                                    series[i].formy = formatraw(raw, fmt);
                                                    series[i].rawfmt = fmt;
                                                } else {
                                                    series[i].formy = "BAL: " + (Math.round(series[i].y * 100.0) / 100.0);
                                                }
                                            }

                                            if (y < 0) miny = Math.min(miny, Math.floor(y));
                                        }
                                        if (op.apmQid == "PayChart") {
                                            series[i].name = raw;
                                        } else {
                                            if (sourceAttrit) {
                                                var rss = raw.split("~");
                                                var shc = parseInt(rss[2]) - parseInt(rss[3]);
                                                series[i].name = "<b>Raw Score: " + rss[0] + "%</b><br />Balanced Score: " + (Math.round(y * 100.0) / 100.0) + "<br /># Terminated: " + rss[1] + "<br />Starting Head Count: " + shc + "<br />New Starts: " + rss[3] + "<br />Total Head Count: " + rss[2];
                                            } else {
                                                var rs = formatraw(raw, fmt);
                                                if (rs == "NaN") { rs = ""; }
                                                if (o.bothScores) {
                                                    //if (($("#selCSRs").val() != "") || (a$.urlprefix() == "vec.")) { //Changed 2015-04-25, no raw score on rollups.
                                                    if (($("#selCSRs").val() != "") || stgRawScoreRollups) { //Changed 2015-07-31 to allow raw score rollups by client
                                                        series[i].name = "<b>Raw Score: " + rs + "</b><br />" + BalancedWord + " Score " + (Math.round(y * 100.0) / 100.0);
                                                    } else {
                                                        series[i].name = BalancedWord + " Score " + (Math.round(y * 100.0) / 100.0);
                                                    }
                                                } else {
                                                    if (o.raw) {
                                                        if (raw != "") {
                                                            if (!((a$.urlprefix() == "km2.") || (a$.urlprefix() == "km2-make40.") || (a$.urlprefix() == "cox.") || (a$.urlprefix() == "cox-make40."))) {
                                                                series[i].name = "<b>Raw Score: " + rs + "</b><br />";
                                                            } else {
                                                                series[i].name = ""; //Relying on serverTooltip to load raw score.
                                                            }
                                                        } else {
                                                            series[i].name = "<b>Drill Down for Scores</b><br />";
                                                        }
                                                        series[i].name += BalancedWord + " Score " + (Math.round(y * 100.0) / 100.0) + "<br />";
                                                    } else {
                                                        if (false) { //OLD WAY, Modified 2017-02-15.
                                                            if (($("#selCSRs").val() != "") || stgRawScoreRollups) {
                                                                if (RANKTHEME) {
                                                                    series[i].name = BalancedWord + " Score " + (Math.round(y * 100.0) / 100.0) + "<br />";
                                                                }
                                                                if ((a$.urlprefix() == "km2.") || (a$.urlprefix() == "km2-make40.") || (a$.urlprefix() == "ers.") || (a$.urlprefix() == "make40.") || (a$.urlprefix() == "cox.") || (a$.urlprefix() == "cox-make40.")) {
                                                                    if (raw != "") {
                                                                        series[i].name = BalancedWord + " Score " + Math.round(y * 100.0) / 100.0;
                                                                    } else {
                                                                        series[i].name += "Drill Down for Raw Score";
                                                                    }
                                                                } else {
                                                                    if (raw != "") {
                                                                        if (!((a$.urlprefix() == "km2.") || (a$.urlprefix() == "km2-make40.") || (a$.urlprefix() == "cox.") || (a$.urlprefix() == "cox-make40."))) {
                                                                            series[i].name += "Raw Score: " + rs;
                                                                        }
                                                                    } else {
                                                                        series[i].name += "Drill Down for Raw Score";
                                                                    }
                                                                }
                                                            } else {
                                                                series[i].name = "";
                                                            }
                                                        } else { //NEW WAY, Modified 2017-02-15
                                                            if (raw != "") {
                                                                if (!((a$.urlprefix() == "km2.") || (a$.urlprefix() == "km2-make40.") || (a$.urlprefix() == "cox.") || (a$.urlprefix() == "cox-make40."))) {
                                                                    series[i].name = "<b>Raw Score: " + rs + "</b><br />";
                                                                } else {
                                                                    series[i].name = "";
                                                                }
                                                            } else {
                                                                series[i].name = "<b>Drill Down for Scores</b><br />";
                                                            }
                                                            series[i].name += BalancedWord + " Score " + (Math.round(y * 100.0) / 100.0) + "<br />";
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        if ((a$.urlprefix() == "nex.")) {
                                            if ($("#selXaxiss").val() == "KPI") {
                                                if ($("#selCSRs").val() != "") {
                                                    if ($("#selKPIs").val() != "") {
                                                        $(o.xml).find('CategoryInfo').each(function () {
                                                            $(this).find('Xinfo').each(function () {

                                                                if ($(this).find("name").text() == x) {
                                                                    //alert("debug:found name:" + $(this).find("name").text());
                                                                    //alert("debug:x=" + x);
                                                                    series[i].name += "<br />A Range = " + $(this).find("AGoal").text() + "<br />B Range = " + $(this).find("BGoal").text();
                                                                    series[i].name += "<br />Last Update: " + $(this).find("loaddate").text()
                                                                }
                                                            });
                                                        });
                                                        //series[i].name += '<a style="padding-left: 15px;text-decoration:underline;color:blue" href="#"';

                                                        //TEST: series[i].name += ' onclick="alert(' + "'" + 'clicked it' + "'" + ');';
                                                        //series[i].name += ' onclick="appApmDashboard.infoclick(' + "'" + x + "','" + seriesname + "'" + ');';
                                                        //series[i].name += 'return false;"';

                                                        //series[i].name += '>Click for more... ' + '/category=' + x + '/seriesname=' + seriesname + '/seriesparams=' /*+ seriesparams*/ + '</a>';

                                                        //series[i].name += '<span class="infoclick">Click me right here for more...</span>';
                                                    }
                                                }
                                            }
                                        }
                                        if (actuallyzero) {
                                            series[i].name += "##ZERO##";
                                        }
                                        //if (rank != "") {
                                        series[i].name += "~" + formatrank(rank);
                                        //}
                                        if (RANKTHEME) {
                                            var rs = rank.split("/");
                                            if (parseInt(rs[2]) > 0) {
                                                var pct = 1.0 - ((parseFloat(rs[1]) - 1.0) / parseFloat(rs[2]));
                                                y = pct * 100.0;
                                                series[i].y = parseFloat(y);
                                            }
                                        }
                                        if (perfview && (!o.raw)) {
                                            if (series[i].name.indexOf("(Ranked)") > 0) {
                                                series[i].color = {
                                                    linearGradient: {
                                                        x1: 0,
                                                        y1: 0,
                                                        x2: 1,
                                                        y2: .5
                                                    },
                                                    stops: [
                                                        [0, '#30004C'],
                                                        [1, '#8E00E0'],
                                                        [2, '#8E00E0']
                                                    ]
                                                };
                                            } else {
                                                if ((a$.urlprefix() == "vec.") && (x.indexOf(" 0%") > 0)) {
                                                    series[i].color = "#505050"; //Gray out zero weighted bars.
                                                } else {
                                                    series[i].color = gradecolor(y);
                                                }
                                            }
                                        } else {
                                            if ((op.apmQid != "PayChart") && ($(this).find("paylevel").text() != "")) {
                                                alert("debug:found a ranked bar");
                                            }
                                            //DONE: Old way, make this an option:
                                            //series[i] = y;
                                            //alert("debug:op.colors[i]=" + op.colors[i]);
                                            //series[i].color = 'red';
                                        }
                                        series[i].Label = x;
                                        series[i].Score = y;
                                        if (op.apmQid != "PayChart") {
                                            if (tableraw.Raw == "") {
                                                tableraw.Raw = "N/A";
                                            }
                                        }
                                        series[i].Raw = tableraw;
                                        //alert("debug: series[i].Raw=" + series[i].Raw);
                                        //alert("debug: series[i].Raw.Level=" + series[i].Raw.Level);

                                        break;
                                    }
                                }
                            }
                        });
                        opt.sxref[op.plotcnt] = new Object();
                        opt.sxref[op.plotcnt].project = pj;
                        opt.sxref[op.plotcnt].name = seriesname;
                        opt.sxref[op.plotcnt].params = seriesparams;
                        op.series[op.plotcnt] = new Object();
                        op.series[op.plotcnt].project = new Object();
                        op.series[op.plotcnt].project = pj; //will this work?  No, it didn't. TODO:
                        op.series[op.plotcnt].showInLegend = o.showLegend;
                        //op.series[op.plotcnt].showInLegend = false; //debug
                        op.series[op.plotcnt].name = seriesname;
                        op.series[op.plotcnt].yAxis = o.overlay;
                        op.series[op.plotcnt].data = new Array();
                        op.series[op.plotcnt].data.length = 0;
                        op.series[op.plotcnt].point = new Object();
                        op.series[op.plotcnt].point.events = new Object();
                        if (op.apmClickFunction) {
                            op.series[op.plotcnt].point.events.click = op.apmClickFunction;
                            op.series[op.plotcnt].point.events.dblclick = op.apmClickFunction; //Added: 2016-10-11
                        }
                        for (i = 0; i < op.xAxis.categories.length; i++) {
                            op.series[op.plotcnt].data.push(series[i]);
                            //TODO: OLD WAY:op.series[op.plotcnt].data.push(parseFloat(series[i]));
                        }
                        op.plotcnt += 1;
                    }
                });
                if (foundresults) foundanyresults = true;
                if (!foundseries) break;
            }
            if (!foundanyresults) {
                //alert("No Results Found (check your date range, that's the usual culprit).");
            }
        }
        //alert("debug:ready to plot, plotcnt=" + op.plotcnt);

        var guatfmt = (($.cookie("ApmGuatModuleLoc") != "") && ($("#selLocations").val() == $.cookie("ApmGuatModuleLoc")));
        if (op.apmQid == "PayChart") {
            op.plotOptions.series.dataLabels.formatter = function () {
                var nm = this.point.name.split("~");
                if (guatfmt) {
                    return ("Q" + nm[6]);
                } else if ((a$.urlprefix() == "bgr.")) {
                    return (Math.round(this.y * 100.0) / 100.0);
                } else {
                    return ("$" + nm[6]);
                }
            }
            op.tooltip.formatter = function () {
                var nm = this.point.name.split("~");
                var bld = '<div>'; // style="z-index:1000;">';
                bld += this.series.name + '<br/>';
                if (nm[9] != "") bld += '<b>' + nm[9] + '</b><br/>'; //message
                if (this.x == "Current") {
                    bld += "Current Pay Period<br/>(Scores Not Finalized)";
                    bld += "<br />Balanced Score: " + Math.round(this.y * 100.0) / 100.0;
                    bld += "<br/>Current ABC ";
                } else {
                    bld += "Pay Date: " + this.x;
                    if (nm[7] == "N") {
                        bld += "<br /><b>Scores Not Finalized</b>";
                        bld += "<br />Balanced Score: " + Math.round(this.y * 100.0) / 100.0;
                        bld += "<br/>Current ABC ";
                    } else {
                        bld += "<br />Balanced Score: " + Math.round(this.y * 100.0) / 100.0;
                        bld += "<br />ABC Final ";
                    }
                }
                bld += "Score:<b>";
                if (nm.length > 8) {

                    bld += nm[8];
                } else {
                    bld += "(composite)";
                }
                bld += "</b>"; //nm[-1]

                if ((a$.urlprefix() == "bgr.")) { } else {
                    if (guatfmt) {
                        bld += "<br /><br />Bonus: Q" + Math.round(nm[10] * 100.0) / 100.0;
                        //try {
                        //    if (parseInt(this.x.split("/")[2]) <= 2013) {
                        bld += '<br /><span style="color:red;">For Information Purposes Only<br />ABC Pay is not yet in use.</span>';
                        //    }
                        //}
                        //catch (err) { }
                    } else {
                        bld += "<br /><br />Adjusted Rate: $" + Math.round(nm[1] * 100.0) / 100.0 + "/hr";
                        bld += "<br />Regular Hours: " + nm[0];
                        bld += "<br />Sub Total: $" + nm[2];
                        if (nm[4] > 0) {
                            bld += "<br /><br />Overtime Rate: $" + Math.round(nm[4] * 100.0) / 100.0 + "/hr";
                            bld += "<br />Overtime Hours: " + nm[3];
                            bld += "<br />Sub Total: $" + nm[5];
                        }
                        bld += "<br /><br />Pay Total: $" + nm[6];
                    }
                }
                bld = bld.replace(/<br \/>/g, "<br/>");
                bld = bld.replace(/<br\/><br\/>/g, "<br/>");
                bld += "</div>";
                return bld;
            }

        } else {
            //TODO: IF this is a bar chart and we're displaying multiple CSRs and KPI="" (all), then rifle through the series' and order them ascending by y.
            //Things in the move:  x (series name), y, formy, maybe more.
            //Before doing this, is there a Highcarts setting for it?  No there is not.
            //Rules for the ordering.
            //If there is more than 1 series, then if all series contain one point or less, then order them by y.
            //The scope/level is not relevant.
            //Only do this if it's a bar chart.

            if (document.getElementById("rdoBase") != null) {
                if (document.getElementById("rdoBase").checked) {
                    if (!a$.exists(op.legend)) { op.legend = {} };
                    op.legend.enabled = true;
                    if (op.series.length > 1) {
                        var fail = false;
                        for (var s in op.series) {
                            if (op.series[s].data.length > 1) {
                                fail = true;
                                break;
                            }
                        }
                        if (!fail) {
                            var sey = [];
                            var mn = -2147483647;
                            for (var s in op.series) {
                                if (op.series[s].data.length > 0) {
                                    try {
                                        sey.push([op.series[s].data[0].y, op.series[s]]); //TODO: Make sure that .y exists
                                    }
                                    catch (err) {
                                        sey.push([mn, op.series[s]]);
                                    }
                                }
                                else {
                                    sey.push([mn, op.series[s]]);
                                }
                            }
                            function sortSey(a, b) {
                                if (a[0] === b[0]) {
                                    return 0;
                                }
                                else {
                                    return (a[0] < b[0]) ? -1 : 1;
                                }
                            }
                            sey.sort(sortSey);
                            op.series = [];
                            for (var s in sey) {
                                op.series.push(sey[s][1]);
                            }
                            op.legend.enabled = (op.series.length <= 20);
                            op.plotOptions.series.dataLabels.enabled = false;
                        }
                        else {
                            op.plotOptions.series.dataLabels.enabled = true;
                            op.legend.enabled = true;
                        }
                    }
                }
            }

            op.plotOptions.series.dataLabels.formatter = function () {
                //return (Math.round(this.y * 100.0) / 100.0);
                var ribbon = false;
                var ribbonallowed = true;
                if (document.getElementById("rdoTrend") != null) {
                    if (document.getElementById("rdoTrend").checked) {
                        ribbonallowed = false;
                    }
                }
                var score;
                if (a$.exists(this.point) && ((a$.urlprefix() == "km2.") || (a$.urlprefix() == "km2-make40.") || (a$.urlprefix() == "ers.") || (a$.urlprefix() == "make40.") || (a$.urlprefix() == "cox.") || (a$.urlprefix() == "cox-make40."))) {
                    if (a$.exists(this.point.formy)) {
                        score = this.point.formy;
                        /* //No need for this now, since I'm turning right around and populating the raw.
                        if ((this.point.formy.indexOf("BAL:") < 0) && ((a$.urlprefix() == "km2.") || (a$.urlprefix() == "km2-make40."))) {
                        rawfmt = this.point.rawfmt;
                        a$.ajax({
                        type: "GET",
                        service: "JScript",
                        async: false,
                        data: {
                        lib: "editor",
                        cmd: "gettooltip",
                        datalabel: true
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        params: getdrillparams(0 , this.series.name, this.point.category),
                        success: loaded
                        });

                        function loaded(json) {
                        if (a$.jsonerror(json)) {} else {
                        //score = json.tooltip.raw;
                        score = formatraw(json.tooltip.raw, rawfmt);
                        //series[i].formy = formatraw(json.raw, fmt);
                        }
                        }
                        } else {
                        score = this.point.formy;
                        }
                        */
                    }
                } else {
                    score = (Math.round(this.y * 100.0) / 100.0);
                }
                if (exists(this.point.name)) {
                    if (this.point.name.indexOf("##ZERO##") > 0) {
                        score = (Math.round(0.0 * 100.0) / 100.0);
                    }
                }
                if (ribbonallowed) {
                    try {
                        var nm = this.point.name;
                        var i = nm.indexOf("Rank in");
                        if (i >= 0) {
                            var rn = nm.substring(i).split(",");
                            if (parseInt(rn[1]) == 1) {
                                ribbon = true;
                            }
                        }
                    } catch (err) { }
                    if (RANKTHEME) {
                        var nm = this.point.name;
                        var i = nm.indexOf("Rank in");
                        if (i >= 0) {
                            i += nm.substring(i).indexOf(":") + 2;
                            nm = nm.substring(i);
                            score = nm.split(" (")[0];
                        }
                    }
                }
                if (ribbon) {
                    var ts = '<div style="position:relative;overflow:visible;">' + score + '<div style="position:absolute;top: 20px;right:0px;"><img src="../applib/css/images/blue-ribbons.gif" style="width:40px;"></img></div></div>';
                    return (ts);
                } else {
                    return (score);
                }
            }
            op.plotOptions.series.dataLabels.useHTML = true;
            op.tooltip.formatter = function () {
                var nm = this.point.name.replace("##ZERO##", "").split("~");
                if (nm.length > 1) {
                    if (nm[1] != "") {
                        nm = nm[0] + '<br/><b>' + nm[1] + '</b>';
                    } else {
                        nm = nm[0];
                    }
                }
                nm = nm.replace("<br /><br/>", "<br/>"); //Don't ask.  The string sub method is going away soon.

                trend = false;
                pay = false;
                if (document.getElementById("rdoTrend") != null) {
                    if (document.getElementById("rdoTrend").checked) {
                        trend = true;
                    }
                }
                if (document.getElementById("rdoPay") != null) {
                    if (document.getElementById("rdoPay").checked) {
                        pay = true;
                    }
                }

                if (pay) { //(this.series.version == 1) { //This DOESN'T WORK!  version is undefined, only name survives.
                    //NOTE: pay views never get here, there's a different tooltip.formatter for it.
                    return this.series.name + '<br/>' + '<b>' + this.x + '</b><br/>' + /* 'Score: ' + (Math.round(this.point.y * 100.0) / 100.0) + '<br/>' +  'Raw Score: ' + */nm;
                } else {
                    //alert("debug: params=" + getdrillparams(0 /*viewindex */, this.series.name, this.point.category));
                    a$.ajax({
                        type: "GET",
                        service: "JScript",
                        async: false,
                        data: {
                            lib: "editor",
                            cmd: "gettooltip"
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        params: getdrillparams(0 /*viewindex */, this.series.name, this.point.category),
                        success: loaded
                    });
                    var tooltip;

                    function loaded(json) {
                        if (a$.jsonerror(json)) { } else {
                            tooltip = json.tooltip;
                        }
                    }

                    var bld = ""; // '<div zIndex="9999" style="z-index: 9999;display:block;">TEST';
                    if (trend) {
                        var ns = this.series.name.split("- ");
                        var kpiname = "";
                        if (ns.length > 1) {
                            kpiname = ns[ns.length - 1];
                        }
                        bld += this.series.name + '<br/>' + '<b>' + this.x + '</b><br/>';
                        if (kpiname == "All") {
                            bld += nm.replace("<b>Raw Score: </b><br />", "");
                        }
                        else {
                            bld += nm.replace("Raw Score", kpiname);
                        }
                        //return bld;
                        //return this.series.name + '<br/>' + '<b>' + this.x + '</b><br/>' + /* 'Score: ' + (Math.round(this.point.y * 100.0) / 100.0) + '<br/>' +  'Raw Score: ' + */nm;
                    } else { //Bar
                        var xs = this.x.split(" ");
                        var kpiname = xs[0];
                        for (var i = 1; i < xs.length - 1; i++) kpiname += " " + xs[i];
                        var wt = xs[xs.length - 1];
                        var wtlabel = "<br />KPI Weight";
                        if (wt != "") {
                            if (wt.substring(0, 1) == "(") {
                                wtlabel = "<br />Count";
                                wt = wt.replace("(", "").replace(")", "");
                            }
                        }
                        bld += this.series.name + '<br/>';
                        if (kpiname == "All") {
                            bld += nm.replace("<b>Raw Score: </b><br />", "");
                        }
                        else {
                            bld += nm.replace("Raw Score", kpiname);
                        }
                        if (bld.indexOf("Rank in") >= 0) {
                            bld = bld.replace("Rank in", wtlabel + ": " + wt + "<br /><b>Rank in");
                        } else {
                            bld += "<b>" + wtlabel + ": " + wt + "</b>";
                        }
                        //return bld;
                        //return this.series.name + '<br/>' + '<b>' + this.x + '</b><br/>' + /* 'Score: ' + (Math.round(this.point.y * 100.0) / 100.0) + '<br/>' +  'Raw Score: ' + */nm;
                    }

                    switch (tooltip.placement) {
                        case "P":
                            bld = tooltip.html + bld;
                            break;
                        case "A":
                            bld += tooltip.html;
                            break;
                        case "R":
                            bld = tooltip.html;
                            break;
                        default:
                            break;
                    }
                    //bld += '</div>';
                    return '<div style="background-color:white; border-radius: 10px; opacity: 1.0; padding: 20px; margin: -20px;">' + bld + '</div>';

                }

            }
        }

        if ((a$.urlprefix() == "cox.") || (a$.urlprefix() == "cox-test.") || (a$.urlprefix() == "cox-make40.") || (a$.urlprefix() == "v3.")) {
        }
        else {
            if (maxy != null) op.yAxis[o.overlay].max = maxy;
            if (miny != null) op.yAxis[o.overlay].min = miny;
        }
        if (o.raw) {
            rawMax = maxy;
            rawMin = miny;
        }
    }

    //end of loadchartoverlay

    var suprestrict = "Y";

    function StgSupervisorFilters_update(viewindex) {
        if (document.getElementById("StgSupervisorFilters") != null) {
            if ($("#StgSupervisorFilters select").val() == "Entire Project") {
                suprestrict = "N";
            } else if ($("#StgSupervisorFilters select").val() == "Location") {
                suprestrict = "L";
            } else if ($("#StgSupervisorFilters select").val() == "Team") {
                suprestrict = "T";
            } else {
                suprestrict = "Y";
            }
            if ($("#StgDashboard select").val() == "Agent") {
                initcontrols(false);
            }
        }
    }

    function StgReportScoreModel_update(viewindex) {
        plotme(viewindex, true, false);
    }

    function StgScoreModel_update(viewindex) {
        op = controlopts.views[viewindex].chartoptions;
        if (document.getElementById("StgScoreModel") != null) {
            if ($("#StgScoreModel select").val() == "Balanced") {
                if ((a$.urlprefix() == "cox.") || (a$.urlprefix() == "cox-test.") || (a$.urlprefix() == "cox-make40.") || (a$.urlprefix() == "v3.")) {
                    if (a$.exists(op.yAxis[0].max)) { delete op.yAxis[0].max; }
                    if (a$.exists(op.yAxis[0].min)) { delete op.yAxis[0].min; }
                }
                else {
                    op.yAxis[0].max = SCOREBASIS;
                    op.yAxis[0].min = 0;
                }
                op.yAxis[0].title.text = "KPI Score";
                op.yAxis.length = 1;
                //op.yAxis[ovr].labels.step = 1;
            } else
            /* if ($("#StgScoreModel select").val() == "Raw") {
            op.yAxis[0].max = SCOREBASIS;
            op.yAxis[0].min = 0;
            op.yAxis[0].title.text = "Raw Score";
            op.yAxis.length = 1;
            //op.yAxis[ovr].labels.step = 10;
            }
            else if ($("#StgScoreModel select").val() == "Overlay") */
            {
                if ((a$.urlprefix() == "cox.") || (a$.urlprefix() == "cox-test.") || (a$.urlprefix() == "cox-make40.") || (a$.urlprefix() == "v3.")) {
                    if (a$.exists(op.yAxis[0].max)) { delete op.yAxis[0].max; }
                    if (a$.exists(op.yAxis[0].min)) { delete op.yAxis[0].min; }
                }
                else {
                    op.yAxis[0].max = SCOREBASIS;
                    op.yAxis[0].min = 0;
                }
                op.yAxis[0].title.text = "KPI";
                op.yAxis.length = 1;
                op.yAxis[1] = {
                    title: {
                        text: 'Raw'
                    }
                }
                //op.yAxis[ovr].labels.step = 10;
            }
            plotme(viewindex, true, false); //TODO: This will wipe out all but the last plot (custom series adds won't be displayed).
            genchart(op);
            //WAS: op.mychart = new Highcharts.Chart(op);
        }
    }

    var showallseries = true;

    function StgShowSeries_update(viewindex) {
        op = controlopts.views[viewindex].chartoptions;
        if (document.getElementById("StgShowSeries") != null) {
            if ($("#StgShowSeries select").val() == "Non-Zero Series") {
                showallseries = false;
            } else {
                showallseries = true;
            }
            plotme(viewindex, true, false); //TODO: This will wipe out all but the last plot (custom series adds won't be displayed).
            genchart(op);
            //WAS: op.mychart = new Highcharts.Chart(op);
        }
    }


    function StgGraphLabels_update(viewindex) {
        op = controlopts.views[viewindex].chartoptions;
        var labelson = true;
        if (document.getElementById("StgGraphLabels") != null) {
            if ($("#StgGraphLabels select").val() == "Off") {
                labelson = false;
            }
        }
        if (labelson) {
            op.plotOptions.series.dataLabels.enabled = true;
            op.tooltip.formatter = function () {
                return '<div>' /* style="z-index:1000;">' */ + this.series.name + '<br/>' + '<b>' + this.x + '</b><br/>' + /* 'Score: ' + (Math.round(this.point.y * 100.0) / 100.0) + '<br/>' +  'Raw Score: ' + */this.point.name + '</div>';
            };
        } else {
            op.plotOptions.series.dataLabels.enabled = false;
            op.tooltip.formatter = function () {
                return '<div>' /* style="z-index:1000;">' */ + this.series.name + '<br/>' + '<b>' + this.x + '</b><br/>' + 'KPI Score: ' + (Math.round(this.point.y * 100.0) / 100.0) + '<br/>' + this.point.name + '</div>';
            };
        }
        genchart(op);
        //WAS: op.mychart = new Highcharts.Chart(op);
    }

    function StgBarView_update(viewindex) {
        op = controlopts.views[viewindex].chartoptions;
        var perfview = true;
        if (document.getElementById("StgBarView") != null) {
            if ($("#StgBarView select").val() == "Series Colors") {
                perfview = false;
            }
        }
        for (p = 0; p < op.plotcnt; p++) {
            for (s = 0; s < op.series[p].data.length; s++) {
                try {
                    if (perfview) {
                        op.series[p].data[s].color = gradecolor(op.series[p].data[s].y);
                    } else {
                        op.series[p].data[s].color = null;
                    }
                } catch (err) { }
            }
        }
        genchart(op);
        //WAS: op.mychart = new Highcharts.Chart(op);
    }

    function perfcolor(y) {
        for (var i = 0; i < controlopts.performanceRanges.length; i++) {
            if (y >= controlopts.performanceRanges[i].threshold) {
                return {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 1,
                        y2: .5
                    },
                    stops: controlopts.performanceRanges[i].stops
                }
            }
        }
    }

    function gradecolor(y) {
        /*
        if (y < controlopts.Bthreshold) {
        return {
        linearGradient: { x1: 0, y1: 0, x2: 1, y2: .5 },
        stops: [
        [0, '#5B0000'],
        [1, '#AC0000'],
        [2, '#AC0000']
        ]
        }; //'red'
        }
        else if (y < controlopts.Athreshold) {
        return {
        linearGradient: { x1: 0, y1: 0, x2: 1, y2: .5 },
        stops: [
        [0, '#AF8013'],
        [1, '#FEFE00'],
        [2, '#FEFE00']
        ]
        }; //'yellow'
        }
        else {
        return {
        linearGradient: { x1: 0, y1: 0, x2: 1, y2: .5 },
        stops: [
        [0, '#005B00'],
        [1, '#00AE00'],
        [2, '#00AE00']
        ]
        }; //'green'
        }
        */
        if (RANKTHEME) {
            y = y / 100.0;
            for (var i = 0; i < controlopts.rankRanges.length; i++) {
                if (y >= controlopts.rankRanges[i].threshold) {
                    return {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 1,
                            y2: .5
                        },
                        stops: controlopts.rankRanges[i].stops
                    }
                }
            }
        } else {
            return perfcolor(y);
        }
    }


    function loadNeedlesFromXML(xml, plothold) {
        /*
        alert("debug:bypass");
        try {
        //if (op.apmTouchpointDashboardFormatting) {
        a$.hideprogress("plotprogress");
        //}
        }
        catch (err) { }
        return;
        */

        var foundresults;
        var foundanyresults;
        var foundseries;
        var found;
        var x;
        var y;
        var i;
        var s;
        var sb;
        var pj;
        var series = new Array();
        var seriesname = "unknown";
        var seriesparams = "unknown";
        sb = document.getElementById('selProjects');
        pj = sb.options[sb.selectedIndex].value;

        var ispie = false;

        foundanyresults = false;
        $(xml).find('Communication').each(function () {
            $(this).find('Alert').each(function () {
                alert($(this).find("Message").text()); //TODO: Make this a "prompt" or something (so the text can be edited).
                foundanyresults = true; //A message is a result.
            });
        });

        if (true) {
            $("#needlerank").html("");
            $("#rankdiv").hide();
            showgauge();
            $(".headericon-points").hide();
            for (s = 0; s >= 0; s++) {
                foundseries = false;
                $(xml).find('Series' + s).each(function () {
                    foundseries = true;
                    var allblank = false;
                    if (!showallseries) {
                        allblank = true;
                        $(this).find('Point').each(function () {
                            var myy = $(this).find("y").text();
                            if (myy != "") {
                                allblank = false;
                                return;
                            }
                        });
                    }
                    if (!allblank) {

                        foundresults = false;
                        $(this).find('Spec').each(function () {
                            seriesname = $(this).find("Name").text();
                            seriesparams = $(this).find("Params").text();
                        });
                        $(this).find('Point').each(function () {
                            foundresults = true;
                            x = $(this).find("x").text();
                            y = $(this).find("y").text();
                            var rank = "";
                            try {
                                rank = $(this).find("rank").text();
                                pointsbalance = $(this).find("pointsbalance").text();
                                //alert("debug:pointsbalance = " + pointsbalance);
                                var spvr = $(this).find("spvr_user_id").text();
                                //TODO: Release for all logins
                                //if (($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin")) {
                                if (pointsbalance != "") {
                                    if (spvr != "") {
                                        appApmRankPoints.supinit(spvr, pointsbalance);
                                    } else {
                                        appApmRankPoints.csrinit(pointsbalance);
                                    }
                                } else {
                                    $("#cepointstab").hide();
                                }
                                //}
                                //if (rank != "") {

                                //if ((a$.urlprefix() != "dev.") && (a$.urlprefix() != "ers.")) { // - 5/3/2015 - Consolidate this logic to section where gaugediv is displayed/hidden
                                if (s == 0) { //only 1 rank shown for now
                                    //alert("Debug:rank found found for needle = " + rank);
                                    var rnk = formatrank(rank);
                                    $("#needlerank").html(rnk);
                                    if (rank == "") {
                                        $("#rankdiv").hide();
                                    } else {
                                        if ($.cookie("ApmGuatModuleLoc") != "") { //LEAVE!
                                            if ($("#selLocations").val() == $.cookie("ApmGuatModuleLoc")) {
                                                controlopts.varirankgauge({
                                                    //ranges: controlopts.rankRangesLEGACY, //CHANGED: 2017-10-21, Guatemala changed bonus to be based on ranking (NONPERFORMACE changed to LEGACY)
                                                    ranges: controlopts.rankRangesNONPERFORMANCETREASUREHUNT,
                                                    paper: controlopts.rank_gpaper,
                                                    ranges2: controlopts.rankRangesGUATEMALABONUS, //CHANGED: 2017-10-21, Guatemala changed bonus to be based on ranking (NONPERFORMACE changed to LEGACY)
                                                    paper2: controlopts.rank_gpaper2
                                                });
                                                $("#rankdiv").show();
                                            } else {
                                                var legacy = false;
                                                var ed = $("#selPayperiods").val().split(",")[1];
                                                var dp = ed.split("/");
                                                if (dp.length == 3) {
                                                    var td = new Date(dp[2] + '-' + dp[0] + '-' + dp[1]);
                                                    var cd = new Date("2016-03-01"); //DONE: Change to 2016-03-01 when done testing (actual enddate for ERS is 2/27/2016)
                                                    if (td < cd) legacy = true;
                                                }
                                                if (legacy) {
                                                    controlopts.varirankgauge({
                                                        ranges: controlopts.rankRangesLEGACY,
                                                        paper: controlopts.rank_gpaper
                                                    });
                                                } else {
                                                    controlopts.varirankgauge({
                                                        ranges: controlopts.rankRanges,
                                                        paper: controlopts.rank_gpaper
                                                    });
                                                }
                                                $("#rankdiv").show();
                                            }
                                        } else {
                                            controlopts.varirankgauge({
                                                ranges: controlopts.rankRanges,
                                                paper: controlopts.rank_gpaper
                                            });
                                            $("#rankdiv").show();
                                        }
                                    }
                                } else {
                                    $("#rankdiv").hide();
                                }
                                //}
                            } catch (err) { }

                            $("#needle" + plothold).rotate({
                                animateTo: 180 * (y / SCOREBASIS)
                            });
                            if (plothold == 0) {
                                $("#gaugescore").html(Math.round(y * 100.0) / 100.0);
                                $("#gaugelabel").html(((a$.urlprefix() == "chime.") || (a$.urlprefix().indexOf("chime-make40") >= 0)) ? "Chime Score" : "Balanced Score");
                            } else {
                                $("#gaugescore").html("");
                                $("#gaugelabel").html(((a$.urlprefix() == "chime.") || (a$.urlprefix().indexOf("chime-make40") >= 0)) ? "Chime Scores" : "Balanced Score");
                                $("#rankdiv").hide();
                            }


                        });
                        plothold += 1;
                        /*
                        opt.sxref[op.plotcnt] = new Object();
                        opt.sxref[op.plotcnt].project = pj;
                        opt.sxref[op.plotcnt].name = seriesname;
                        opt.sxref[op.plotcnt].params = seriesparams;
                        op.series[op.plotcnt] = new Object();
                        op.series[op.plotcnt].project = new Object();
                        op.series[op.plotcnt].project = pj; //will this work?  No, it didn't. TODO:
                        op.series[op.plotcnt].showInLegend = op.apmShowInLegend;
                        //op.series[op.plotcnt].showInLegend = false; //debug
                        op.series[op.plotcnt].name = seriesname;
                        op.series[op.plotcnt].data = new Array();
                        op.series[op.plotcnt].data.length = 0;
                        op.series[op.plotcnt].point = new Object();
                        op.series[op.plotcnt].point.events = new Object();
                        if (op.apmClickFunction) {
                        op.series[op.plotcnt].point.events.click = op.apmClickFunction;
                        }
                        for (i = 0; i < op.xAxis.categories.length; i++) {
                        op.series[op.plotcnt].data.push(series[i]);
                        //TODO: OLD WAY:op.series[op.plotcnt].data.push(parseFloat(series[i]));
                        }
                        op.plotcnt += 1;
                        */
                    }
                });
                if (foundresults) foundanyresults = true;
                if (!foundseries) break;
            }
            if (!foundanyresults) {
                //alert("No Results Found (check your date range, that's the usual culprit).");
            }
            for (var i = plothold; i < 16; i++) $("#needle" + i).rotate({
                animateTo: -2
            });
        }
        //op.mychart = new Highcharts.Chart(op);
        try {
            //if (op.apmTouchpointDashboardFormatting) {
            a$.hideprogress("plotprogress");
            //}
        } catch (err) { }
    }


    function chartclick(event, viewindex, me) {
        maketable(getdrillparams(viewindex, me.series.name, me.category), "FROM_DRILL");
    }

    function getdrillparams(viewindex, myname, mycategory) {
        if (peerevaluate) {
            if (false) { //MADELIVE - Added 4/4/2018 - Turned this off, as it's really not preventing the drilldown and is causing a bad experience in Cox.
                if (($("#selGroups").val() == "") || ($("#selGroups").val() == "each") || ($("#selTeams").val() == "") || ($("#selTeams").val() == "each") || ($("#selCSRs option").length <= 1)) {
                    alert("Drill-downs to CSR data is only available for your own team.\nNote: Make sure the Group and Team filters are not set to (All) or (Each)");
                    return;
                }
            }
        }
        if (controlopts.views[viewindex].tableoptions) {
            opt = controlopts.views[viewindex].tableoptions;
        } else alert("You have an apmClickFunction, but no tableoptions.  How weird.");

        var i;
        var pj = "not found";
        var params = "not found";
        var xval = "not found";
        var name = "not found";
        for (i = 0; i < opt.sxref.length; i++) {
            if (opt.sxref[i].name == myname) {
                pj = opt.sxref[i].project;
                params = opt.sxref[i].params;
                name = opt.sxref[i].name;
                break;
            }
        }
        //alert("debug:xxref length=" + opt.xxref.length);
        //alert("debug:pj=" + pj);
        //alert("debug:me.category=" + me.category);
        for (i = 0; i < opt.xxref.length; i++) {
            //alert("debug:opt.xxref[" + i + "].category=" + opt.xxref[i].category);
            //alert("debug:opt.xxref[" + i + "].project=" + opt.xxref[i].project);
            if ((opt.xxref[i].category == mycategory) && (opt.xxref[i].project == pj)) {
                xval = opt.xxref[i].xval;
                //alert("debug:xval=" + xval);
                break;
            }
        }
        //alert("debug:me.series.name=" + me.series.name);
        //alert("debug:me.category=" + me.category);
        //alert("debug:xval+params=" + xval + params);
        //MADELIVE
        //return xval + params;
        return overrideparams(params, xval);
    }

    function infoclick(seriesname, category) {
        //Note: This is totally based on chartclick, make modifications there then mirror them here.
        opt = controlopts.views[0].tableoptions;

        var i;
        var pj = "not found";
        var params = "not found";
        var xval = "not found";
        var name = "not found";
        for (i = 0; i < opt.sxref.length; i++) {
            if (opt.sxref[i].name == seriesname) {
                pj = opt.sxref[i].project;
                params = opt.sxref[i].params;
                name = opt.sxref[i].name;
                break;
            }
        }
        //alert("debug:xxref length=" + opt.xxref.length);
        //alert("debug:pj=" + pj);
        //alert("debug:me.category=" + me.category);
        for (i = 0; i < opt.xxref.length; i++) {
            //alert("debug:opt.xxref[" + i + "].category=" + opt.xxref[i].category);
            //alert("debug:opt.xxref[" + i + "].project=" + opt.xxref[i].project);
            if ((opt.xxref[i].category == category) && (opt.xxref[i].project == pj)) {
                xval = opt.xxref[i].xval;
                //alert("debug:xval=" + xval);
                break
            }
        }
        alert("debug:seriesname=" + seriesname);
        alert("debug:category=" + category);
        alert("debug:xval+params=" + xval + params);
        alert("debug:GET INFO!");
        //maketable(xval + params);
    }

    function graphtotable(viewindex) {
        if (controlopts.views[viewindex].tableoptions) {
            op = controlopts.views[viewindex].chartoptions;
            opt = controlopts.views[viewindex].tableoptions;
        } else alert("You have an apmClickFunction, but no tableoptions.  How weird.");
        /*
        opt.data = [
        { Series: 'series1', Label: 'label1', Score: 'score1', Raw: 'raw1' },
        { Series: 'series2', Label: 'label2', Score: 'score2', Raw: 'raw2' }
        ];
        */
        opt.data = [];
        //alert("debug:Qid=" + op.apmQid);
        //KPIChart
        //
        opt.caption = 'from';
        if (op.apmQid == "PayChart") {
            opt.caption += ' Pay Graph';

            opt.colNames = ['Series', 'Label', 'Score', 'Level', 'Locked', 'Reg_Rate', 'Reg_Hours', 'Reg_Subtotal', 'OT_Rate', 'OT_Hours', 'OT_Subtotal', 'Total'];
            opt.colModel = [{
                name: 'Series',
                index: 'Series',
                width: 100
            },
                {
                    name: 'Label',
                    index: 'Label',
                    width: 100
                },
                {
                    name: 'Score',
                    index: 'Score',
                    width: 100
                },
                {
                    name: 'Level',
                    index: 'Level',
                    width: 100
                },
                {
                    name: 'Locked',
                    index: 'Locked',
                    width: 100
                },
                {
                    name: 'Reg_Rate',
                    index: 'Reg_Rate',
                    width: 100
                },
                {
                    name: 'Reg_Hours',
                    index: 'Reg_Hours',
                    width: 100
                },
                {
                    name: 'Reg_Subtotal',
                    index: 'Reg_Subtotal',
                    width: 100
                },
                {
                    name: 'OT_Rate',
                    index: 'OT_Rate',
                    width: 100
                },
                {
                    name: 'OT_Hours',
                    index: 'OT_Hours',
                    width: 100
                },
                {
                    name: 'OT_Subtotal',
                    index: 'OT_Subtotal',
                    width: 100
                },
                {
                    name: 'Total',
                    index: 'Total',
                    width: 100
                }
            ]
        } else {
            opt.caption += ' Base/Trend Graph';
            opt.colNames = ['Series', 'Label', 'Score', 'Raw'];
            opt.colModel = [{
                name: 'Series',
                index: 'Series',
                width: 100
            },
                {
                    name: 'Label',
                    index: 'Label',
                    width: 100
                },
                {
                    name: 'Score',
                    index: 'Score',
                    width: 100,
                    sorttype: "float",
                    formatter: "number"
                },
                {
                    name: 'Raw',
                    index: 'Raw',
                    width: 100,
                    sorttype: "float",
                    formatter: "number"
                }

            ];
        }
        try {
            if (op.apmTouchpointDashboardFormatting) {
                var tl = document.getElementById('tablelabel');
                tl.innerHTML = "Table - " + opt.caption;
            }
        } catch (err) { }
        for (var i in op.series) {
            for (var j in op.series[i].data) {
                //opt.data.push({ Series: op.series[i].name, Label: op.series[i].data[j].x, Score: op.series[i].data[j].y, Raw: op.series[i].data[j].name });
                try {
                    if (op.apmQid == "PayChart") {
                        opt.data.push({
                            Series: op.series[i].name,
                            Label: op.series[i].data[j].Label,
                            Score: op.series[i].data[j].Score,
                            Level: op.series[i].data[j].Raw.Level,
                            Locked: op.series[i].data[j].Raw.Locked,
                            Reg_Rate: op.series[i].data[j].Raw.Reg_Rate,
                            Reg_Hours: op.series[i].data[j].Raw.Reg_Hours,
                            Reg_Subtotal: op.series[i].data[j].Raw.Reg_Subtotal,
                            OT_Rate: op.series[i].data[j].Raw.OT_Rate,
                            OT_Hours: op.series[i].data[j].Raw.OT_Hours,
                            OT_Subtotal: op.series[i].data[j].Raw.OT_Subtotal,
                            Total: op.series[i].data[j].Raw.Total
                        });
                    } else {
                        opt.data.push({
                            Series: op.series[i].name,
                            Label: op.series[i].data[j].Label,
                            Score: op.series[i].data[j].Score,
                            Raw: op.series[i].data[j].Raw.Raw
                        });
                    }
                } catch (err) { }
            }
        }

        rendertable(opt, "", {}, null, null);
    }

    function maketable(params, source) {
        var dvcode = "";
        try {
            //if (op.apmTouchpointDashboardFormatting) {
            a$.showprogress("plotprogress");
            //}
        } catch (err) { }
        var qid = dataset + "Table";
        if (opt.apmQid) qid = opt.apmQid;
        //var cid = "";
        //if (opt.apmCid) cid = opt.apmCid;
        //var urlbld = "Query.ashx?rtype=table&cid=" + cid + "&qid=" + qid + "&" + params;
        var urlbld = "Query";
        var urlhld = ".ashx?rtype=table&qid=" + qid + "&" + params + "&" + a$.getallparams();
        if (document.getElementById("StgInTraining") != null) {
            if (urlhld.indexOf("&InTraining=") < 0) urlhld += "&InTraining=" + $("#StgInTraining select").val();
        }
        if (document.getElementById("StgDashboard") != null) {
            if (urlhld.indexOf("&Connection=") < 0) urlhld += "&Connection=" + connectionfilter($("#StgDashboard select").val());
        }
        //if (false) {
        if (document.getElementById("rdoPay")) { //MADEDEV
            if (document.getElementById("rdoPay").checked) { //Changed: 2017-11-07
                if ($.cookie("ApmGuatModuleLoc") != "") {
                    urlhld += "&ApmGuatModuleLoc=" + $.cookie("ApmGuatModuleLoc");
                }
            }
        }
        var myproject = $("#selProjects").val();
        urlbld += "20";
        urlbld += urlhld;
        //if (((myproject == "10") || (myproject == "11")) && ((cookieprefix == "PC") || (cookieprefix == "ED"))) urlbld += "&dayweight=on";
        //alert("debug: urlbld=" + urlbld);
        if (a$.gup("cid") == "") {
            urlbld += "&cid=" + $("body:first").attr("id");
        }

        var cacheme = true; // (a$.isAndroid) ? false : true;
        if (dataperflevel == "Always") {
            cacheme = false; //Trips the browser cache with a timestamp.
        } else {
            urlbld += "&cacheme=" + dataperflevel + "&bkey=" + appLib.perfdate(dataperflevel);
        }

        //alert("debug:urlbld=" + urlbld);
        debugoutput(urlbld);

        $.ajax({
            type: "GET",
            url: urlbld,
            async: true,
            dataType: "xml",
            cache: cacheme,
            timeout: 20 * 60 * 1000, //20 minutes
            error: function (request, textStatus, errorThrown) {
                if (request.status == 504) {
                    alert("The web page timed out before the table build was ready.\nThe table IS still being built on the server, please wait a few minutes and try again.\nSome reports take up to 20 minutes to complete.");
                } else {
                    alert('Error loading table:' + request.status + ' / ' + textStatus + ' / ' + errorThrown);
                }
            },
            success: loadTableFromXML
        });

        function loadTableFromXML(xml) {
            var foundresults;
            var foundanyresults;
            var foundseries;
            var found;
            var x;
            var y;
            var i;
            var s;
            var n;
            var sb;
            var tbl = new Array();
            var hasrawformatting = false;
            var hasallpercentageformatting = false;
            var hassinglepercentageformatting = false; // .2%, number doesn't need multiplied (chime).

            var series = new Array();
            var seriesname = "unknown";
            var schemanames = new Array();
            var v;
            foundanyresults = false;
            $(xml).find('Communication').each(function () {
                $(this).find('Alert').each(function () {
                    alert($(this).find("Message").text()); //TODO: Make this a prompt or something.
                    foundanyresults = true; //A message is a result.
                });
            });
            for (s = 0; s >= 0; s++) { //There is only one series for now, but keeping for future possibilities.
                foundseries = false;
                $(xml).find('Series' + s).each(function () {
                    foundresults = false;
                    foundseries = true;
                    $(this).find('Spec').each(function () {
                        seriesname = $(this).find("Name").text();
                        dvcode = $(this).find("DVCode").text();
                    });
                    var testformatting = false;
                    $(this).find('Schema').each(function () {
                        var nm = $(this).find("Name").text();
                        if (nm == "fmt") testformatting = true;
                        schemanames.push(nm);
                    });
                    if (testformatting) {
                        var testnonpercent = false;
                        $(this).find('Point').each(function () {
                            var f = $(this).find("fmt").text();
                            f = f.replace("-X", "");
                            if (f != "") {
                                hasrawformatting = true;
                            }
                            /* if (f.indexOf("%") < 0) { //WAS: */
                            if (f.indexOf("%%") < 0) {
                                testnonpercent = true;
                            }
                            if (f.indexOf("%") >= 0) {
                                hassinglepercentageformatting = true;
                            }

                        });
                        if (hasrawformatting) {
                            if (!testnonpercent) {
                                hasallpercentageformatting = true;
                                hasrawformatting = false;
                            }
                        }
                    }
                    opt.colNames = new Array();
                    opt.colModel = new Array();
                    for (n = 0; n < schemanames.length; n++) {
                        opt.colNames.push(schemanames[n]);
                        opt.colModel[n] = new Object();
                        opt.colModel[n].name = new Object();
                        opt.colModel[n].name = schemanames[n];
                        if ((opt.colModel[n].name == "UserId") || (opt.colModel[n].name == "KPInum") || (opt.colModel[n].name == "SUBKPInum") || (opt.colModel[n].name == "fmt")) {
                            opt.colModel[n].hidden = true;
                        } else if (opt.colModel[n].name == "Score") {
                            opt.colModel[n].sorttype = "float";
                            opt.colModel[n].formatter = "number";
                            opt.colModel[n].align = "center";
                        } else if (opt.colModel[n].name == "Count") {
                            opt.colModel[n].sorttype = "integer";
                            opt.colModel[n].formatter = "integer";
                            opt.colModel[n].align = "center";
                        } else if (opt.colModel[n].name == "Calls") {
                            opt.colModel[n].sorttype = "integer";
                            opt.colModel[n].formatter = "integer";
                            opt.colModel[n].align = "center";
                        } else if (opt.colModel[n].name == "Raw") {
                            if (hasallpercentageformatting) {
                                opt.colModel[n].sorttype = "currency";
                                opt.colModel[n].formatter = "currency";
                                opt.colModel[n].formatoptions = {
                                    suffix: '%'
                                };
                                opt.colModel[n].align = "center";
                            } else if (hassinglepercentageformatting) {
                                opt.colModel[n].sorttype = "currency";
                                //opt.colModel[n].formatter = "number";
                                /* opt.colModel[n].formatoptions = {
                                suffix: '%'
                                }; */
                                opt.colModel[n].align = "center";
                            } else if (!hasrawformatting) {
                                opt.colModel[n].sorttype = "float";
                                opt.colModel[n].formatter = "number";
                                opt.colModel[n].align = "center";
                            }
                        }
                        //TODO: Add date sorting
                        //if (opt.colModel[n].name == "Date") {
                        //    opt.colModel[n].sorttype = "date";
                        //    opt.colModel[n].formatter = "date";
                        //}

                        opt.colModel[n].index = new Object();
                        opt.colModel[n].index = schemanames[n];
                        opt.colModel[n].width = 100;
                    }

                    $(this).find('Point').each(function () {
                        foundresults = true;
                        tbl[tbl.length] = new Object();
                        for (n = 0; n < schemanames.length; n++) {
                            //alert("debug searchfor:" + schemanames[n].replace(/ /ig, "_x0020_"));
                            v = $(this).find(schemanames[n].replace(/ /ig, "_x0020_")).text();
                            if (hasrawformatting) {
                                if (schemanames[n] == "Raw") {
                                    v = formatraw(v, $(this).find("fmt").text());
                                    v = v.replace("-X", "")
                                }
                            }
                            if (hasallpercentageformatting) {
                                if (schemanames[n] == "Raw") {
                                    v = parseFloat(v) * 100.0;
                                }
                            }
                            tbl[tbl.length - 1][schemanames[n]] = new Object();
                            tbl[tbl.length - 1][schemanames[n]] = v;
                        }
                    });
                    //opt.data = new Object();
                    opt.data = tbl;
                    opt.caption = seriesname;
                    try {
                        if (op.apmTouchpointDashboardFormatting) {
                            var tl = document.getElementById('tablelabel');
                            tl.innerHTML = "Table - " + seriesname;
                        }
                    } catch (err) { }

                    //TODO: Generalize Grouping, but note that not all Xaxis fields are in the table.
                    //sb = document.getElementById('selXaxiss');
                    //opt.sortname = sb.options[sb.selectedIndex].value;
                    //opt.groupingView.groupField[0] = sb.options[sb.selectedIndex].value;
                    //For Now:
                    /* //REMOVE THIS FOR NOW.
                    opt.sortname = "KPI";
                    opt.groupingView.groupField[0] = "KPI";
                    */
                    //                alert("debug opt:" + opt.groupingView.groupField[0]);
                });
                if (foundresults) foundanyresults = true;
                if (!foundseries) break;
            }
            if (!foundanyresults) {
                //alert("No Table Results Found (check your date range, that's the usual culprit).");
            }

            //alert("debug: got params and table: DVCode: " + dvcode + ", Params:" + params + ", table:" + tbl);
            rendertable(opt, dvcode, params, source, schemanames);
        }
    }

    function drillsubkpi(params, source, schemanames) {
        if (source == "FROM_DRILL") {
            var splitdrill = false;
            for (var n in schemanames) {
                if (schemanames[n] == "Split") {
                    splitdrill = true;
                    break;
                }
            }
            if (splitdrill) {
                var drillme = false;
                var ps = params.split("&");
                //If SubKPI exists, and is blank - then we drill to the split menu.
                for (var p in ps) {
                    pss = ps[p].split("=");
                    if ((pss[0] == "SubKPI") && (pss[1] == "")) {
                        drillme = true;
                        break;
                    }
                }
                if (drillme) {
                    $('#graphsubtab').show();
                    $('#graphsublabel').trigger('click');
                    //alert("debug: Drill to Subkpi Graph with params: " + params);
                    var myparams = params;
                    plotme_main(0, true, false, true, myparams.replace("SubKPI=", "SubKPI=each"));
                }
            }
        }
    }

    function rendertable(opt, dvcode, params, source, schemanames) {
        if (opt.apmTableType) {
            var tid;
            if (opt.apmTableType == 'cascade') {
                if (opt.tablecnt >= opt.apmTableMax) opt.tablecnt = 0;
                if (opt.apmTableId) { }
                opt.tablecnt += 1;
                tid = '#' + opt.apmTableId + opt.tablecnt;
                if (opt.apmPagerId) {
                    opt.pager = '#' + opt.apmPagerId + opt.tablecnt;
                    //opt.toolbar = [true, "top"];
                }
            } else {
                tid = '#' + opt.apmTableId;
                if (opt.apmPagerId) {
                    opt.pager = '#' + opt.apmPagerId;
                    //opt.toolbar = [true, "top"];
                }
            }
            if (1) { //
                $(tid).GridUnload();
                //alert("debug:window.height=" + $(window).height());
                var offset = $(tid).offset();
                //alert("debug:offset.top=" + offset.top);
                var offadd = 0;

                if (opt.apmAcuityHeaderOffset) offadd = 80;
                opt.height = ($(window).height() - (offset.top + offadd));
                if (opt.apmAcuityHeaderOffset) offadd = 10;
                opt.width = ($(window).width() - (offset.left + offadd));

                try {
                    if (opt.apmTouchpointDashboardFormatting) {
                        //opt.height = $(window).height() - 350;
                        //opt.height = $(tid).parent().height() / 2;
                        //delete opt.height;
                        opt.height = 'auto';
                        opt.width = $(window).width() - 350;
                    }
                } catch (err) { }

                //alert("debug:opt.width=" + opt.width);
                delete opt.rowNum;
                opt.rowNum = 10;

                $(tid).jqGrid(opt);
                $("#rowdv_show").hide();
                $("#serverside_rowdv").html("");
                $("#datasourcetables_row").html("");
                $("#tabledv_show").hide();
                $("#clientside_tabledv").html("");
                $("#serverside_tabledv").html("");
                $("#datasourcetables_table").html("");

                $("#tablemessage").hide();
                $('#tabletab').show();
                $('#tablelabel').trigger('click');

                if (opt.apmPagerId) {
                    $(tid).jqGrid('navGrid', opt.pager, {
                        edit: false,
                        add: false,
                        del: false,
                        refresh: false
                    });
                    $(tid).jqGrid('navButtonAdd', opt.pager, {
                        caption: "CSV",
                        title: "Download Comma-Delimited File (.CSV)",
                        buttonicon: "ui-icon-arrowthick-1-s",
                        position: "last",
                        onClickButton: function () {
                            jqgrid_download("csv", tid);
                        }
                    });
                    $(tid).jqGrid('navButtonAdd', opt.pager, {
                        caption: "||.TXT",
                        title: "Download Double-Pipe-Delimited Text File (.TXT)",
                        buttonicon: "ui-icon-arrowthick-1-s",
                        position: "last",
                        onClickButton: function () {
                            jqgrid_download("doublepipe");
                        }
                    });
                    //$('#t_' + opt.apmTableId).append("<input type='button' value='Download' />");
                    //TODO:  Select the best toolbar option.
                    //TODO:  Install a "Group By" box.
                }

                //var oc = '$(' + tid + ').GridUnload();return false;';
                var oc = 'appApmClient.cleartable("' + tid + '");return false;';
                var temp = $("<a href='#' onclick='" + oc + "' style='right: 16px;'/>")
                    .addClass('ui-jqgrid-titlebar-close HeaderButton')
                    .hover(
                        function () {
                            $(this).addClass('ui-state-hover');
                        },
                        function () {
                            $(this).removeClass('ui-state-hover');
                        }
                    ).append("<span class='ui-icon ui-icon-circle-close'></span>");
                $('.ui-jqgrid-title').before(temp);
                //$('.ui-jqgrid-titlebar-close').remove();
                try {
                    if (op.apmTouchpointDashboardFormatting) {
                        $(".ui-jqgrid-titlebar").hide();
                    }
                } catch (err) { }

                appDVProcessing.tabledv("#clientside_tabledv", opt.data, dvcode);
                a$.showprogress("plotprogress");

                a$.ajax({
                    type: "GET",
                    service: "JScript",
                    async: true,
                    data: {
                        lib: "editor",
                        cmd: "getrawdata",
                        paramstring: params,
                        project: $("#selProjects").val()
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: loaded
                });

                function loaded(json) {
                    if (a$.jsonerror(json)) { } else {
                        if (exists(json.dv) && exists(json.dv.needUsers)) {
                            //TODO: Optimize this.  Will be really slow.
                            var users = [];
                            for (var i in opt.data) {
                                var found = false;
                                for (var j in users) {
                                    if (opt.data[i].UserId == users[j]) {
                                        found = true;
                                        break;
                                    }
                                }
                                if (!found) {
                                    users.push(opt.data[i].UserId);
                                }
                            }
                            a$.showprogress("plotprogress");

                            a$.ajax({
                                type: "POST",
                                service: "JScript",
                                async: true,
                                data: {
                                    lib: "editor",
                                    cmd: "getrawdata",
                                    users: users,
                                    paramstring: params,
                                    project: $("#selProjects").val()
                                },
                                dataType: "json",
                                cache: false,
                                error: a$.ajaxerror,
                                success: loadedusersend
                            });

                            function loadedusersend(json) {
                                if (a$.jsonerror(json)) { } else {
                                    displayTableSource(json);
                                    drillsubkpi(params, source, schemanames);
                                    a$.hideprogress("plotprogress");


                                }
                            }
                        } else {
                            displayTableSource(json);
                            drillsubkpi(params, source, schemanames);
                            a$.hideprogress("plotprogress");
                        }
                    }
                }


                //TODO:  Pull all relevant raw data sources.
                //Make list of KPIs (by name (not id) and project)
                //Cross-reference with data source structures to get:
                //  vertical filetypes.
                //


            }
        } else alert("Table options need some work");
        try {
            //if (op.apmTouchpointDashboardFormatting) {
            a$.hideprogress("plotprogress");
            //}
        } catch (err) { }
    }

    function displayTableSource(json) {
        if (exists(json.dv)) {
            if ((json.dv.text != "") || (json.table.length > 0)) {
                $("#tabledv_show").show();
                $("#serverside_tabledv").html(json.dv.text);
            } else {
                $("#serverside_tabledv").html("");
            }
            if (json.table.length > 0) {
                $("#datasourcetables_table").html('<div class="table-datasourceslabel">Table Data Sources</div>');
            } else {
                $("#datasourcetables_table").html("");
            }
            var cnt = 0;
            for (var t in json.table) {
                var optbl = {
                    datatype: "local",
                    height: 'auto',
                    /* rowList: [10, 20, 30], */
                    /*
                    colNames: ['Inv No', 'Date', 'Client', 'Amount', 'Tax', 'Total', 'Notes'],
                    colModel: [{ name: 'id', index: 'id', width: 60, sorttype: "int" },
                    { name: 'invdate', index: 'invdate', width: 90, sorttype: "date", formatter: "date" },
                    { name: 'name', index: 'name', width: 100, editable: true },
                    { name: 'amount', index: 'amount', width: 80, align: "right", sorttype: "float", formatter: "number", editable: true },
                    { name: 'tax', index: 'tax', width: 80, align: "right", sorttype: "float", editable: true },
                    { name: 'total', index: 'total', width: 80, align: "right", sorttype: "float" },
                    { name: 'note', index: 'note', width: 150, sortable: false }
                    ],
                    */
                    /*data: [{ id: "testid", invdate: "1999-01-01", name: "testname", amount: 1.04, tax: "testtax", total: "testtotal", note: "test note" }
                    ],*/
                    pager: "#dsplist" + cnt,
                    viewrecords: true
                    //sortname: 'Name',
                    //grouping: true,
                    //groupingView: {
                    //    groupField: ['Name'],
                    //    groupCollapse: true
                    //},
                    //caption: "Grouping Array Data",
                    //onSelectRow: function (id) { appApmDashboard.rowselected(id); }
                };
                optbl.colNames = json.table[t].colNames;
                optbl.colModel = json.table[t].colModel;
                optbl.data = json.table[t].data;

                $("#datasourcetables_table").append('<div class="table-label">' + json.table[t].name + '</div><table id="dslist' + cnt + '"></table><div id="dsplist' + cnt + '"></div>');
                $("#dslist" + cnt).jqGrid(optbl);
                cnt += 1;
            }
        }
    }

    function rowselected(recordnum) {
        var index = recordnum - 1;
        //Need:  Date, KPI# (or name I guess), user id
        var rd = jQuery('#' + opt.apmTableId).jqGrid('getRowData');
        //alert(appLib.dumpObj(dataFromTheRow, "DUMP", "", 0));
        //alert("debug:rd.UserId=" + rd[index].UserId);
        //alert("debug:rd.Date=" + rd[index].Date);
        //alert("debug:rd.KPInum=" + rd[index].KPInum);
        //alert("debug:rd.SUBKPInum=" + rd[index].SUBKPInum);
        a$.showprogress("plotprogress");

        a$.ajax({
            type: "GET",
            service: "JScript",
            async: true,
            data: {
                lib: "editor",
                cmd: "getrawdata",
                row: rd[index],
                project: $("#selProjects").val()
            },
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: loaded
        });

        function loaded(json) {
            a$.hideprogress("plotprogress");
            if (a$.jsonerror(json)) { } else {
                var cnt = 0;
                if ((json.dv.text != "") || (json.table.length > 0)) {
                    $("#rowdv_show").show();
                    $("#serverside_rowdv").html(json.dv.text);
                } else {
                    $("#rowdv_show").hide();
                    $("#serverside_rowdv").html("");
                }
                if (json.table.length > 0) {
                    $("#datasourcetables_row").html('<div class="table-datasourceslabel">Record Data Sources</div>');
                } else {
                    $("#datasourcetables_row").html("");
                }
                for (var t in json.table) {
                    var optbl = {
                        datatype: "local",
                        height: 'auto',
                        autowidth: true,
                        /* rowList: [10, 20, 30], */
                        /*
                        colNames: ['Inv No', 'Date', 'Client', 'Amount', 'Tax', 'Total', 'Notes'],
                        colModel: [{ name: 'id', index: 'id', width: 60, sorttype: "int" },
                        { name: 'invdate', index: 'invdate', width: 90, sorttype: "date", formatter: "date" },
                        { name: 'name', index: 'name', width: 100, editable: true },
                        { name: 'amount', index: 'amount', width: 80, align: "right", sorttype: "float", formatter: "number", editable: true },
                        { name: 'tax', index: 'tax', width: 80, align: "right", sorttype: "float", editable: true },
                        { name: 'total', index: 'total', width: 80, align: "right", sorttype: "float" },
                        { name: 'note', index: 'note', width: 150, sortable: false }
                        ],
                        */
                        /*data: [{ id: "testid", invdate: "1999-01-01", name: "testname", amount: 1.04, tax: "testtax", total: "testtotal", note: "test note" }
                        ],*/
                        pager: "#dsplist" + cnt,
                        viewrecords: true
                        //sortname: 'Name',
                        //grouping: true,
                        //groupingView: {
                        //    groupField: ['Name'],
                        //    groupCollapse: true
                        //},
                        //caption: "Grouping Array Data",
                        //onSelectRow: function (id) { appApmDashboard.rowselected(id); }
                    };
                    optbl.colNames = json.table[t].colNames;
                    optbl.colModel = json.table[t].colModel;
                    optbl.data = json.table[t].data;

                    $("#datasourcetables_row").append('<div class="table-label">' + json.table[t].name + '</div><table id="dslist' + cnt + '"></table><div id="dsplist' + cnt + '"></div>');
                    $("#dslist" + cnt).jqGrid(optbl);
                    cnt += 1;
                }
            }
        }
    }

    function download_OLD(downloadtype) {
        var mya = new Array();
        mya = $('#' + opt.apmTableId).getDataIDs(); // Get All IDs
        var data = $('#' + opt.apmTableId).getRowData(mya[0]); // Get First row to get the labels
        var colNames = new Array();
        var ii = 0;
        for (var i in data) {
            colNames[ii++] = i;
        } // capture col names
        var html = "";
        var first = true;
        for (i = 0; i < colNames.length; i++) {
            if (!first) html += "\t";
            html += colNames[i];
            first = false;
        }
        html = html + "\n"; // output each row with end of line
        for (i = 0; i < mya.length; i++) {
            data = $('#' + opt.apmTableId).getRowData(mya[i]); // get each row
            first = true;
            for (j = 0; j < colNames.length; j++) {
                if (!first) html += "\t";
                html += data[colNames[j]]; // output each column as tab delimited
                first = false;
            }
            html = html + "\n"; // output each row with end of line
        }
        //Try this instead of:
        var form = document.createElement("form");
        form.setAttribute("method", "POST");
        form.setAttribute("action", "DownloadGrid.ashx");
        form.setAttribute("target", "_blank");
        var hf = document.createElement("input");
        hf.setAttribute("type", "hidden");
        hf.setAttribute("name", "downloadtype");
        hf.setAttribute("value", downloadtype);
        form.appendChild(hf);
        hf = document.createElement("input");
        hf.setAttribute("type", "hidden");
        hf.setAttribute("name", "downloadfilename");
        hf.setAttribute("value", "myfile");
        form.appendChild(hf);
        hf = document.createElement("input");
        hf.setAttribute("type", "hidden");
        hf.setAttribute("name", "csvBuffer");
        hf.setAttribute("value", html);
        form.appendChild(hf);
        document.body.appendChild(form);
        form.submit();
        //This:
        /*
        document.forms[0].method = 'POST';
        document.forms[0].action = 'DownloadGrid.ashx';  // send it to server which will open this contents in excel file
        document.forms[0].target = '_blank';
        document.forms[0].downloadtype.value = downloadtype;
        document.forms[0].downloadfilename.value = "myfile";
        document.forms[0].csvBuffer.value = html;
        document.forms[0].submit();
        <input type="hidden" name="csvBuffer" value="" />
        <input type="hidden" name="downloadtype" value="" />
        <input type="hidden" name="downloadfilename" value="" />
        */
    }

    //NOTE: This is specific to tables created by the dashboard.  I have copied this into ApmReport and improved it (it belongs there, not here).
    //This is still in used for the dashboard though.
    function jqgrid_download(downloadtype, tid) {
        var mya = new Array();
        mya = $('#' + opt.apmTableId).getDataIDs(); // Get All IDs
        var data = $('#' + opt.apmTableId).getRowData(mya[0]); // Get First row to get the labels
        var colNames = new Array();
        var ii = 0;
        for (var i in data) {
            colNames[ii++] = i;
        } // capture col names
        var html = "";
        var first = true;
        for (i = 0; i < colNames.length; i++) {
            if (!first) html += "\t";
            html += colNames[i];
            first = false;
        }
        html = html + "\n"; // output each row with end of line
        for (i = 0; i < opt.data.length; i++) {
            data = opt.data[i];
            first = true;
            for (j = 0; j < colNames.length; j++) {
                if (!first) html += "\t";
                html += data[colNames[j]].replace(/[\n\r\t]/g, " "); // output each column as tab delimited MADEDEV
                first = false;
            }
            html = html + "\n"; // output each row with end of line
        }
        //Try this instead of:
        var form = document.createElement("form");
        form.setAttribute("method", "POST");
        form.setAttribute("action", "DownloadGrid.ashx");
        form.setAttribute("target", "_blank");
        var hf = document.createElement("input");
        hf.setAttribute("type", "hidden");
        hf.setAttribute("name", "downloadtype");
        hf.setAttribute("value", downloadtype);
        form.appendChild(hf);
        hf = document.createElement("input");
        hf.setAttribute("type", "hidden");
        hf.setAttribute("name", "downloadfilename");
        hf.setAttribute("value", "myfile");
        form.appendChild(hf);
        hf = document.createElement("input");
        hf.setAttribute("type", "hidden");
        hf.setAttribute("name", "csvBuffer");
        hf.setAttribute("value", html);
        form.appendChild(hf);
        document.body.appendChild(form);
        form.submit();
    } //tid

    //CHANGE: 2018-10-03 - Allow a title to be passed.
    function acuitytable_download(downloadtype, sel, title) {
        var mya = new Array();
        mya = $(sel).getDataIDs(); // Get All IDs
        var data = $(sel).getRowData(mya[0]); // Get First row to get the labels

        var html = "";
        var first = true;
        var foundsomething = false;
        for (var i = -1; i <= 0; i++) {
            first = true;
            //$("thead tr:nth-child(" + ($("thead tr", sel).length + i) + ") th", sel).each(function () {
            $("thead tr:nth-child(" + ($("tr", $("thead", sel).eq(0)).length + i) + ") th", sel).each(function () {
                if (($(this).is(":visible")) && ($(this).css('display') !== 'none')) {
                    if (!first) html += "\t";
                    first = false;
                    if ($(this).css('color') == 'rgb(255, 255, 255)') {
                        html += " ";
                    }
                    else {
                        var mte = $(this).clone().children().remove().end().text();
                        mte = mte.replace(/&nbsp;/gi, "");
                        if (mte.charCodeAt(0) == 160) mte = "";
                        if (mte == "") { //Maybe it's an anchor.
                            if ($(" a", this).length > 0) {
                                mte = $(" a", this).html();
                            }
                        }
                        if (mte != "") {
                            foundsomething = true;
                            if (mte.indexOf(",") >= 0) {
                                mte = '"' + mte + '"';
                            }
                            html += mte;
                        }
                        else {
                            html += " ";
                        }
                    }
                }
            });
            html = html + "\n";
        }
        //alert("debug:header=" + html);
        //$("tbody tr", sel).each(function () {
        $(">tr", $("tbody", sel).eq(0)).each(function () {
            first = true;
            $("td", this).each(function () {
                if (($(this).is(":visible")) && ($(this).css('display') !== 'none')) {
                    if (!first) html += "\t";
                    first = false;
                    if ($(this).css('color') == 'rgb(255, 255, 255)') {
                        html += " ";
                    }
                    else {
                        var mte = $(this).clone().children().remove().end().text();
                        mte = mte.replace(/&nbsp;/gi, "");
                        if (mte.charCodeAt(0) == 160) mte = "";
                        if (mte == "") { //Maybe it's an anchor.
                            if ($(" a", this).length > 0) {
                                mte = $(" a", this).html();
                            }
                            else if ($(" .report-titlelink", this).length > 0) { //MADELIVE
                                mte = $(" .report-titlelink", this).html();
                            }
                        }
                        if (mte != "") {
                            foundsomething = true;
                            if (mte.indexOf(",") >= 0) {
                                mte = '"' + mte + '"';
                            }
                            html += mte;
                        }
                        else {
                            html += " ";
                        }
                    }
                }
            });
            html = html + "\n";
        });

        var downloadfilename = "myfile";
        if (title) {
            if (title == "") title = "Untitled";
            title = title.replace(/\//g, ".").replace(/ /g, "").replace(/'/g, "");
            downloadfilename = title;
        }

        //Try this instead of:
        var form = document.createElement("form");
        form.setAttribute("method", "POST");
        form.setAttribute("action", "DownloadGrid.ashx");
        form.setAttribute("target", "_blank");
        var hf = document.createElement("input");
        hf.setAttribute("type", "hidden");
        hf.setAttribute("name", "downloadtype");
        hf.setAttribute("value", downloadtype);
        form.appendChild(hf);
        hf = document.createElement("input");
        hf.setAttribute("type", "hidden");
        hf.setAttribute("name", "downloadfilename");
        hf.setAttribute("value", "myfile");
        form.appendChild(hf);
        hf = document.createElement("input");
        hf.setAttribute("type", "hidden");
        hf.setAttribute("name", "csvBuffer");
        hf.setAttribute("value", html);
        form.appendChild(hf);
        document.body.appendChild(form);
        form.submit();
    } //tid

    function setSeriesType(mytype) {
        for (var i in controlopts.views) {
            controlopts.views[i].chartoptions.chart.defaultSeriesType = mytype;
            controlopts.views[i].chartoptionssub.chart.defaultSeriesType = mytype;
        }
    }

    var dataset = "KPI";

    function setDataSet(mydataset) {
        dataset = mydataset;
        for (var i in controlopts.views) {
            controlopts.views[i].chartoptions.apmQid = dataset + "Chart";
            controlopts.views[i].tableoptions.apmQid = dataset + "Table";
        }
    }

    // examples
    var EXAMPLEdefaultOptions = {
        chartxy: {
            renderTo: 'containersmother',
            anotherthing: 'to add',
            defaultSeriesType: 'column'
        }
    }

    var lastViewindex = 0;

    function movefilters(viewindex) {
        var vi = 0;
        var i;
        var colcnt = 10;
        if (viewindex) {
            vi = viewindex;
            lastViewindex = vi;
        }
        var colyinc = 25.0;
        var colxinc = 300.0;
        var coly = [];
        for (i = 0; i < colcnt; i++) coly[i] = 0;
        for (var j in controlopts.views[vi].filters) {
            var id;
            if (controlopts.views[vi].filters[j].pcid) id = controlopts.views[vi].filters[j].pcid;
            else id = controlopts.views[vi].filters[j].id;
            var d = document.getElementById("div" + id)
            if (d) {
                if (controlopts.views[vi].filters[j].populate) {
                    var sb = document.getElementById('sel' + id + 's');
                    //populate:[{text:'ACE',val:'3',selected:true}]
                    var pu = controlopts.views[vi].filters[j].populate;
                    sb.options.length = 0;
                    for (var k in pu) {
                        a$.addOption(sb, pu[k].text, pu[k].val);
                        if (pu.selected) a$.setOption(sb, pu[k].val);
                    }
                    //alert("debug: Attempting to populate val=" + $("#sel" + id + "s").val());
                }
                if (controlopts.views[vi].filters[j].hidden) {
                    d.style.display = 'none';
                } else {
                    d.style.display = 'inline';
                    if (controlopts.views[vi].filters[j].col) {
                        d.style.position = 'absolute';
                        d.style.left = (colxinc * (controlopts.views[vi].filters[j].col - 1)) + "px";
                        d.style.top = coly[controlopts.views[vi].filters[j].col - 1] + "px";
                        var r = 1;
                        if (controlopts.views[vi].filters[j].rows) r = controlopts.views[vi].filters[j].rows;
                        coly[controlopts.views[vi].filters[j].col - 1] += r * colyinc;
                    }
                }
            }
            if (controlopts.views[vi].filters[j].customdate) {
                //alert("debug: got to customdate");
                // 10/13/2015 - Date Range Picker
                //Hide the select box
                if (true) {
                    //$("#sel" + id + "s").hide();
                    if (!$("#drp" + id + "s").length) {
                        //$("#drp" + id + "s").remove();
                        //alert("debug:my width=" + $("#sel" + id + "s").width());
                        $("#sel" + id + "s").parent().css("width", $("#sel" + id + "s").width() + "px"); //Explicit width on the <dd> required.
                        $("#sel" + id + "s").css("width", ($("#sel" + id + "s").width() - 20) + "px");
                        //$("#sel" + id + "s_chzn").css("width", ($("#sel" + id + "s").width() - 20) + "px");
                    }
                    $(".app-drp").remove();
                    $("#sel" + id + "s").parent().append('<span class="app-drp" id="' + 'drp' + id + 's' + '" name="' + 'drp' + id + 's' + '">&nbsp;</span>');
                    var dbf = false;
                    var dbleft = 0;
                    var dbtop = 0;
                    //if (controlopts.views[vi].filters[j].dashboardformatting) {
                    $(".app-drp").css("line-height", "24px");
                    dbf = true;
                    dbleft = 25;
                    dbtop = -250;
                    //}
                    var drpid = "sel" + id + "s";
                    /* DEBUG:PUTBACK
                    $("#drp" + id + "s").dateRangePicker({
                    format: 'M/D/YYYY',
                    //autoClose: true,
                    getValue: function () {
                    //alert("debug: getting:" + drpid + ":" + $("#" + drpid).val());
                    var g = $("#" + drpid).val();
                    g = g.replace(",", " to ");
                    return g;
                    },
                    setValue: function (s) {
                    //alert("debug: got value = " + s);
                    //See if the date being passed equals the currently selected date.  If so, then no change.
                    var c = $("#" + drpid).val();
                    cs = c.split(",");
                    c = cs[0] + " to " + cs[1]; //Done verbosely in case there's a trailing comma defining the iv type).
                    //alert("debug: got value = " + s);
                    //alert("debug: comparing to = " + c);
                    $("#" + drpid + " option:contains('Custom Date')").remove();
                    if (s != c) {
                    //If not still pointing to myself, still go through and see if ANY standard date matches my date.
                    var anymatch = false;
                    $("#" + drpid).children().each(function () {
                    if (!anymatch) {
                    var c = $(this).val();
                    cs = c.split(",");
                    c = cs[0] + " to " + cs[1]; //Done verbosely in case there's a trailing comma defining the iv type).
                    if (s == c) {
                    $(this).attr("selected", "selected");
                    var fme = {
                    id: drpid
                    };
                    change(fme, true);
                    $("#" + drpid).trigger("liszt:updated");
                    anymatch = true;
                    }
                    }

                    });
                    if (!anymatch) {
                    $("#" + drpid).prepend('<option value="' + s.replace(" to ", ",") + '">Custom Date</option>');
                    $("#" + drpid + " option:contains('Custom Date')").attr("selected", "selected");
                    var fme = {
                    id: drpid
                    };
                    change(fme, 2); //2 = stop propagation
                    $("#" + drpid).trigger("liszt:updated");
                    }
                    }
                    }
                    }).bind('datepicker-opened', function () {
                    if (dbf) {
                    if (firstdbf) {
                    $(".date-picker-wrapper").css("left", (parseInt($(".date-picker-wrapper").css("left").split("p")[0]) + dbleft) + "px");
                    $(".date-picker-wrapper").css("top", (parseInt($(".date-picker-wrapper").css("top").split("p")[0]) + dbtop) + "px");
                    firstdbf = false;
                    }
                    }
                    });
                    */
                }
            }

        }
        var maxcoly = 0;
        for (i in coly)
            if (coly[i] > maxcoly) maxcoly = coly[i];
        if (document.getElementById("divMenu")) {
            document.getElementById("divMenu").style.height = (maxcoly + colyinc) + "px";
        }
    }

    function hidegauge() {
        $("#gaugediv").animate({
            height: "22px"
        }, 3000);
        $("#gaugecollapse").removeClass("icon-minus").addClass("icon-plus");
        $("#gaugescore").html("Gauge Not Applicable");
        $("#gaugescore").css("color", "gray");
        $("#rankdiv").hide();
    }

    function showgauge() {
        $("#gaugediv").animate({
            height: "200px"
        }, 1500);
        $("#gaugecollapse").removeClass("icon-plus").addClass("icon-minus");
        $("#gaugescore").css("color", "white");
    }


    function debugoutput(out) {
        if (window.location.host.indexOf("localhost") >= 0) {
            try {
                $("#debugwindow").html("http://" + window.location.host + a$.xss(window.location.pathname).substr(0, a$.xss(window.location.pathname).lastIndexOf("/")) + "/" + out);
                //alert("debug:Calling: queryurl=" + out);
            } catch (err) { }

        }
    }

    function setClientLabels() {
        if ((a$.urlprefix() == "ces.") || (a$.urlprefix().indexOf("ces-make40") >= 0)) {
            $(".scaname").html("Stage");
            $(".grpname").html("Client");
        }
        if ((a$.urlprefix() == "cox.") || (a$.urlprefix().indexOf("cox-make40") >= 0) || (a$.urlprefix() == "v3.")) {
            $(".locname").html("Partner");
            $(".grpname").html("Location"); // really?
            csrranking = "PartnerTier";
            delete controlopts.views[0].chartoptionssub.yAxis[0].min;
            delete controlopts.views[0].chartoptionssub.yAxis[0].max;
            delete controlopts.views[0].chartoptions.yAxis[0].min;
            delete controlopts.views[0].chartoptions.yAxis[0].max;
        }
        if ((a$.urlprefix() == "sprintgame.")) {
            $(".locname").html("Partner");
        }
        if ((a$.urlprefix() == "chime.") || (a$.urlprefix().indexOf("chime-make40") >= 0)) {
            $(".csrname").html("Consultant");
            //$(".teamname").html("Manager");
            $(".plotname").html("Search");
            $(".balancedname").html("Chime Score");
            $("#btnPlot").val("Search");
            //TODO: Using a slider value for control, so must just replace the label.
            $(".sup-stgtoolslevel > .stg-steps > span").eq(0).html("Consultant");
            $(".sup-stgtoolslevel > select > option").eq(0).html("Consultant Level");
            //$(".sup-stgtoolslevel > .stg-steps > span").eq(1).html("Manager");
            //$(".sup-stgtoolslevel > select > option").eq(1).html("Manager Level");
            $("#StgScoreModel .stg-steps > span").eq(0).html("Chime");
            $("#StgScoreModel select > option").eq(0).html("Show Chime Score");
            $("#StgReportScoreModel .stg-steps > span").eq(0).html("Chime");
            $("#StgReportScoreModel select > option").eq(0).html("Chime Score");
            $("#ReportScoreModel select > option").eq(0).html("Chime Score");
            $(".app-header").removeClass("gradient-lightest");

            $(".report-show-wrapper label").html("Report Type:");

            $(".report-label-intraining").html("View:");
            $("#ReportShowInTraining select > option").eq(0).html("Training");
            $("#ReportShowInTraining select > option").eq(1).html("Combined");
            $("#ReportShowInTraining select > option").eq(2).html("Production");
            $("#AttritionShowInTraining select > option").eq(0).html("Training");
            $("#AttritionShowInTraining select > option").eq(1).html("Combined");
            $("#AttritionShowInTraining select > option").eq(2).html("Production");

            /*
            Highcharts.theme.chart.backgroundColor.stops[0][1] = "white";
            Highcharts.theme.chart.backgroundColor.stops[1][1] = "white";
            Highcharts.theme.chart.backgroundColor.stops[2][1] = "white";
            Highcharts.theme.title.style.color = "black";
            Highcharts.theme.subtitle.style.color = "black";
            Highcharts.theme.xAxis.labels.style.color = "black";
            Highcharts.theme.xAxis.title.style.color = "black";
            Highcharts.theme.yAxis.labels.style.color = "black";
            Highcharts.theme.yAxis.title.style.color = "black";
            Highcharts.theme.legend.itemStyle.color = "black";
            */

            highchartsOptions = Highcharts.setOptions(Highcharts.theme);


        }
    }

    function formatraw(raw, fmt) {
        var rs = "";
        if ((!exists(fmt)) || (fmt == "")) {
            rs = (Math.round(parseFloat(raw) * 100.0) / 100.0);
            rs = a$.addCommas(rs);
        } else {
            if (fmt == "hh:mm:ss") {
                var hours = parseInt(raw / 3600) % 24;
                var minutes = parseInt(raw / 60) % 60;
                var seconds = raw % 60;
                rs = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
            } else {
                if (fmt.indexOf("$") >= 0) {
                    rs = "$";
                }
                if (fmt.indexOf(".") >= 0) {
                    rs += parseFloat(raw).toFixed(parseInt(fmt.substring(fmt.indexOf(".") + 1)));
                } else {
                    rs += (Math.round(parseFloat(raw) * 100.0) / 100.0);
                }
                if (fmt.indexOf("%%") >= 0) {
                    rs = makePercentStr(rs);
                } else if (fmt.indexOf("%") >= 0) {
                    rs += "%";
                }
                rs = a$.addCommas(rs);
            }
        }
        return rs;
    }

    function makePercentStr(num) {
        var numStr = num + "";
        // if no decimal point, add .00 on end
        if (numStr.indexOf(".") == -1) {
            numStr += ".00";
        } else {
            // make sure there's at least two chars after decimal point
            while (!numStr.match(/\.../)) {
                numStr += "0";
            }
        }
        numStr = numStr.replace(/\.(..)/, "$1.")
            .replace(/^0+/, "") // trim leading zeroes
            .replace(/\.$/, "") // trim trailing decimals
            .replace(/^$/, "0") // if empty, add back a single 0
            +
            "%";
        if (numStr == ".0%") numStr = "0%";
        return numStr;
    }

    var prevData = "";

    function getPrev() {
        return prevData;
    }

    function setPrev(value) {
        prevData = value;
    }

    function exists(me) {
        return (typeof me != 'undefined');
    }

    function formatrank(rank) {
        var ret = "";

        $(".teamrank").hide();

        if ($("#StgRanking select").val() == "On") {
            //TODO: Insert team-specific ranking box here.
            var team = $("#selTeams").val();
            if ((team != "") && (team.indexOf(",") < 0) && (team != "each")) {
                a$.ajax({
                    type: "GET",
                    service: "JScript",
                    async: true,
                    data: {
                        lib: "pay",
                        cmd: "getteamrank",
                        Team: team,
                        RankDate: $("#selPayperiods").val().split(",")[1]
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (json) {
                        var bld = "Team Score: " + json.score.toFixed(2);
                        if (json.rank != "") {
                            var rs = json.rank.split("/");
                            bld += ", Rank: " + rs[1] + " of " + rs[2];
                        }
                        $(".teamrank").html(bld).show();
                    }
                });
            }
            var csr = $("#selCSRs").val();
            $("#rankpin1").css("left", "-100px");
            $("#rankpin2").css("left", "-100px");

            if (csr == "") {
                ret = "";
            } else {
                if (rank == "") {
                    ret = "Insufficient data to compute " + csrranking.toLowerCase() + " rank.";
                    ret = ""; //Changed 5/3/2015.  I think this is unnecessary information.
                    //if (false) {
                    if (document.getElementById("rdoPay").checked) { //Changed: 2017-11-07
                        if ($.cookie("ApmGuatModuleLoc") != "") {
                            if ($("#selLocations").val() == $.cookie("ApmGuatModuleLoc")) {
                                ret = "";
                            }
                        }
                    }
                } else {
                    var rs = rank.split("/");
                    var pt = "";
                    if (parseInt(rs[2]) > 0) {
                        var pct = 1.0 - ((parseFloat(rs[1]) - 1.0) / parseFloat(rs[2]));
                        //Move the rank pin here (a bit strange, but will work for now).
                        //$("#rankpin1").css("left", (controlopts.rankopts.xoffset - 10) + "px"); //0 Calibration
                        //$("#rankpin1").css("left", ((controlopts.rankopts.xoffset - 10) + controlopts.rankopts.barwidth) + "px"); //100 Calibration
                        $("#rankpin1").css("left", ((controlopts.rankopts.xoffset - 10) + (controlopts.rankopts.barwidth * pct)) + "px");
                        $("#rankpin2").css("left", ((controlopts.rankopts.xoffset - 10) + (controlopts.rankopts.barwidth * pct)) + "px");
                        /*
                        controlopts.rankopts = {
                        xoffset: 10,
                        barwidth: 260
                        }
                        */


                        pt = Math.round(pct * 100.0) + "%, ";
                    }
                    var ret = "Rank in " + rs[0] + ": " + pt + rs[1] + " of " + rs[2];
                    if (rs[3] != "1") {
                        //Suppressed for Greg: ret += " ( " + rs[3] + "-way tie )"
                    }
                }
            }
        }
        return ret; //debug
    }

    function connectionfilter(str) {
        if (str == "Agent") {
            return "Operations&Model=1";
        } else if (str == "Supervisor") {
            return "Operations&Model=2";
        } else if ((str == "Source") || (str == "Attrition")) {
            return "Operations&Model=3";
        }
        return str;
    }

    function addDays(date, days) {
        var result = new Date(date);
        result.setDate(date.getDate() + days);
        return result;
    }

    //MADELIVE
    //TODO: Move this and all like it to applib (placed here to maintain v2/v3 compatibility.
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



    // global variables
    window.appApmDashboard = {
        //filter-related (could be split out at some point)
        change: change, //jquery change (all maps to 1 function)
        refreshboxes: refreshboxes,
        infoclick: infoclick,
        setcontrolopts: setcontrolopts,
        initcontrols: initcontrols,
        finishinit: finishinit,
        splitdates: splitdates,
        boxval: boxval,
        splitdateval: splitdateval,
        movefilters: movefilters,
        setFilterPerfLevel: setFilterPerfLevel,
        filterperflevel: filterperflevel,
        setdaterangeslider: setdaterangeslider,
        //pagecontrolparams: pagecontrolparams, //Local only?  Changed 8/1/2014
        pagecontrolobject: pagecontrolobject,
        //chart/table-related
        plotme: plotme,
        chartclick: chartclick,
        setSeriesType: setSeriesType,
        setDataSet: setDataSet,
        setCookiePrefix: setCookiePrefix,
        getCookiePrefix: getCookiePrefix,
        cleartables: cleartables,
        cleartable: cleartable,
        tableme: tableme,
        StgBarView_update: StgBarView_update,
        StgGraphLabels_update: StgGraphLabels_update,
        StgScoreModel_update: StgScoreModel_update,
        StgReportScoreModel_update: StgScoreModel_update,
        StgShowSeries_update: StgShowSeries_update,
        StgSupervisorFilters_update: StgSupervisorFilters_update,
        setDataPerfLevel: setDataPerfLevel,
        getdashboardsettings: getdashboardsettings,
        setClientLabels: setClientLabels,
        dsh: dsh,
        graphtotable: graphtotable,
        jqgrid_download: jqgrid_download,
        rowselected: rowselected,
        getPrev: getPrev,
        setPrev: setPrev,
        setCSRRankingBy: setCSRRankingBy,
        viewparams: viewparams,
        perfcolor: perfcolor,
        setSuppressBoxList: setSuppressBoxList,
        getSuppressBoxList: getSuppressBoxList,
        setSpecialFlagsList: setSpecialFlagsList,
        acuitytable_download: acuitytable_download
    };

    //First subscribable (even though this isn't a viewmodel yet).
    ko.postbox.subscribe("PLOT_FROM_TOOLS", function (o) {
        plotme(0, true, true);
    });

    ko.postbox.subscribe("FILTER_PARAMS", function (newValue) {
        filterParams = newValue;
    });

    function IsObject(obj) {
        return obj ? true : false;
    }
})();
