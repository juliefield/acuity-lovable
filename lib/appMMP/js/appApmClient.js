/************
appApmClient - The AJAX-enabled Super-App for Acuity APM for displaying charts/graphs/tables.
************/
(function () {
    if (!window.jQuery) { alert("This App requires jQuery"); return; }
    var $ = window.jQuery;

    //private vars
    var controlopts,
    op, //The current (when current is known) collection of chart options.
    opt; //The current (wcik) collection of table options.

    function change(me, dontsetcookies) {
        //alert("debug:change is being called");
        if (controlopts.pagecontrols) {
            for (var j in controlopts.pagecontrols) {
                if (controlopts.pagecontrols[j].type == 'select') {
                    if (me.id == 'sel' + controlopts.pagecontrols[j].idtemplate + 's') {
                        if (controlopts.pagecontrols[j].onchange) {
                            controlopts.pagecontrols[j].onchange();
                        }
                    }
                }
            }
            if (dontsetcookies) { }
            else {
                //alert("debug:setting cookies");
                var sb;
                for (var j in controlopts.pagecontrols) {
                    if (controlopts.pagecontrols[j].type == 'select') {
                        sb = document.getElementById('sel' + controlopts.pagecontrols[j].idtemplate + 's');
                        $.cookie("PC-" + controlopts.pagecontrols[j].idtemplate, sb.options[sb.selectedIndex].value);
                    }
                }
            }
        }
    }

    function splitdates(me, from, to) {
        if (me && from && to) {
            var datesplit = me.options[me.selectedIndex].value.split(",");
            if (datesplit.length > 0) {
                from.innerHTML = datesplit[0];
            }
            if (datesplit.length > 1) {
                to.innerHTML = datesplit[1];
            }
            else if (datesplit[0] == 'each') {
                from.innerHTML = "Each";
                to.innerHTML = "Each";
            }
            else if (datesplit[0] == '') {
                from.innerHTML = "All";
                to.innerHTML = "All";
            }
        }
    }

    function initcontrols(opts) {
        controlopts = opts; //use an "extend" when you make default parameters.
        for (var i in controlopts.views) {
            if (controlopts.views[i].chartoptions) {
                controlopts.views[i].chartoptions.mychart = new Highcharts.Chart(controlopts.views[i].chartoptions);
            }
        }
        if (controlopts.initfunction) {
            controlopts.initfunction();
        }
        var sb, vc;
        for (var j in controlopts.pagecontrols) {
            if (controlopts.pagecontrols[j].type == 'select') {
                sb = document.getElementById('sel' + controlopts.pagecontrols[j].idtemplate + 's');
                vc = $.cookie("PC-" + controlopts.pagecontrols[j].idtemplate);
                if (vc) {
                    //alert("debug:Cookie: PC-" + controlopts.pagecontrols[j].idtemplate + "=" + vc);
                    if (vc != sb.options[sb.selectedIndex].value) {
                        //alert("debug:setting option");
                        appLib.setOption(sb, vc);
                        change(sb, true);
                    }
                }
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
                            sb = document.getElementById('sel' + phrase[1] + 's');
                            if (sb) {
                                appLib.setOption(sb, par[1]);
                            }
                        }
                    }
                }
            }
        }

    }

    function boxval(idt) {
        var bld = "";
        var sb = document.getElementById('sel' + idt + 's');
        bld += idt + "=" + sb.options[sb.selectedIndex].value;
        return bld;
    }

    function splitdateval(idt) {
        var bld = "";
        var first = true;
        var sb = document.getElementById('sel' + idt + 's');
        var mydate = sb.options[sb.selectedIndex].value;
        if (mydate != '') {
            if (mydate == 'each') mydate = 'each,each';
            if (mydate == 'eachmonth') mydate = 'eachmonth,eachmonth';
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
        if (controlopts.pagecontrols) {
            if (controlopts.views[viewindex].filters) {
                for (var i in controlopts.views[viewindex].filters) {
                    if (controlopts.views[viewindex].filters[i].pcid) {
                        for (var j in controlopts.pagecontrols) {
                            if (controlopts.pagecontrols[j].idtemplate == controlopts.views[viewindex].filters[i].pcid) {
                                if (controlopts.pagecontrols[j].param) {
                                    if (!first) bld += "&";
                                    first = false;
                                    var hld = controlopts.pagecontrols[j].param();
                                    if (eachisall) {
                                        bld += hld.replace(/=each/g, "=");
                                    }
                                    else {
                                        bld += hld;
                                    }
                                    break;
                                }

                            }
                        }
                    }
                    else if (controlopts.views[viewindex].filters[i].param) {
                        if (!first) bld += "&";
                        first = false;
                        bld += controlopts.views[viewindex].filters[i].param();
                    }
                }
            }
        }
        return bld;
    }

    function pagecontrolparams() {
        var bld = "";
        var first = true;
        if (controlopts.pagecontrols) {
            for (var j in controlopts.pagecontrols) {
                if (controlopts.pagecontrols[j].param) {
                    if (!first) bld += "&";
                    first = false;
                    bld += controlopts.pagecontrols[j].param();
                }
            }
        }
        return bld;
    }

    var WHICHValue = "";

    function refreshboxes(which) {
        WHICHValue = which;
        var urlbld = "Combofilters.ashx?" + pagecontrolparams();
        urlbld += "&reload=" + which;
        $.ajax({
            type: "GET",
            url: urlbld,
            async: false,
            dataType: "xml",
            cache: true,
            error: function (request, textStatus, errorThrown) {
                alert('Error loading ListConfig XML Document:' + request.status + ' / ' + textStatus + ' / ' + errorThrown);
            },
            success: loadCombosFromXML
        });
        splitdates(document.getElementById('selPayperiods'), document.getElementById('spanDatefrom'), document.getElementById('spanDateto'));
    }

    function loadCombosFromXML(xml) {
        var whichsplit = WHICHValue.split(",");
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
            loadComboFromXML(xml, c,
                (c != 'Payperiod') && (c != 'Project') && (c != 'Xaxis') && (c != 'ACDDate'), //all at top
                (c == 'Payperiod'),          //all at bottom
                (c != 'Project') && (c != 'Payperiod') && (c != 'Xaxis') && (c != 'ACDDate'),          //each at top
                false, //each at bottom
                (c == 'Payperiod') && (PERIODRESTRICTValue != "month"), //eachpayperiod at bottom
                (c == 'Payperiod') && (PERIODRESTRICTValue != "payperiod"), //eachmonth at bottom
                (c != 'Payperiod')); //set to blank
        }
    }

    function loadComboFromXML(xml, which, allattop, allatbottom, eachattop, eachatbottom, eachpayperiodatbottom, eachmonthatbottom, settoblank) {
        try {
            var sb = document.getElementById('sel' + which + 's');
            var SBValue = "";
            $(xml).find(which + 's').each(function () {
                sb.disabled = '';
                if (sb.options.length > 0) {
                    SBValue = sb.options[sb.selectedIndex].value;
                }
                sb.options.length = 0;
                if (allattop) appLib.addOption(sb, "(All)", "");
                if (eachattop) appLib.addOption(sb, "(Each)", "each");
                $(this).find(which).each(function () {
                    //alert("debug:box:"+which+" key:"+$(this).find("key").text());
                    if ($(this).find("key").text() == "disabled") {
                        appLib.setOption(sb, "");
                        SBValue = "";
                        sb.disabled = 'disabled';
                        //alert("debug:disabling"+which);
                    }
                    else {
                        appLib.addOption(sb, $(this).find("desc").text(), $(this).find("key").text());
                    }
                });
                if (allatbottom) appLib.addOption(sb, "(All)", "");
                if (eachatbottom) appLib.addOption(sb, "(Each)", "each");
                if (eachpayperiodatbottom) appLib.addOption(sb, "(Each Pay Period)", "each");
                if (eachmonthatbottom) appLib.addOption(sb, "(Each Month)", "eachmonth");
            });
            if (settoblank || (SBValue != "")) appLib.setOption(sb, SBValue);
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
        }
        catch (err) {
            alert(err);
        }
    }

    var tableme = function (viewindex, reset) {
        if (reset) cleartables(viewindex);
        op = controlopts.views[viewindex].chartoptions;
        opt = controlopts.views[viewindex].tableoptions;
        if (!opt.tablecnt) opt.tablecnt = 0;
        maketable(viewparams(viewindex, true));
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
            }
            else {
                opt.tablecnt = 0;
            }
        }
        else if (opt.apmTableType == 'single') {
            cleartable('#' + opt.apmTableId);
        }
    }

    var plotme = function (viewindex, reset) {
        op = controlopts.views[viewindex].chartoptions;
        opt = controlopts.views[viewindex].tableoptions;

        if (!op.plotcnt) op.plotcnt = 0;
        if (!opt.xxref) opt.xxref = new Array();
        if (!opt.sxref) opt.sxref = new Array();

        if (reset) {
            op.plotcnt = 0;
            try {
                op.series.length = 0;
            }
            catch (err) {
                op.series = new Array();
            };
            op.xAxis.categories.length = 0;
        }
        var qid = "KPIChart";
        if (op.apmQid) qid = op.apmQid;
        //var cid = "";
        //if (op.apmCid) cid = op.apmCid;
        //var urlbld = "Query.ashx?rtype=chart&cid=" + cid + "&qid=" + qid + "&" + viewparams(viewindex, false);
        var urlbld = "Query.ashx?rtype=chart&qid=" + qid + "&" + viewparams(viewindex, false) + "&" + appLib.getallparams();
        if (appLib.gup("cid") == "") {
            urlbld += "&cid=" + $("body:first").attr("id");
        }
        //alert("debug:queryurl="+urlbld);
        $.ajax({
            type: "GET",
            url: urlbld,
            async: false,
            dataType: "xml",
            cache: false,  //make true for live site
            error: function (request, textStatus, errorThrown) {
                alert('Error loading ListConfig XML Document:' + request.status + ' / ' + textStatus + ' / ' + errorThrown);
            },
            success: loadChartFromXML
        });
        var i;
        cleartables(viewindex);

        function loadChartFromXML(xml) {
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
            if (op.chart.defaultSeriesType == 'pie') {
                ispie = true;
                op.tooltip.formatter = function () {
                    return '<b>' + this.series.name + '</b><br/>' +
								this.point.name + ': ' + this.y + ' %';
                };

            }

            foundanyresults = false;
            $(xml).find('Communication').each(function () {
                $(this).find('Alert').each(function () {
                    alert($(this).find("Message").text()); //TODO: Make this a "prompt" or something (so the text can be edited).
                    foundanyresults = true; //A message is a result.
                });
            });

            if (ispie) {
                var colorset = ['white', 'red', 'yellow', 'green', 'blue'];

                for (s = 0; s >= 0; s++) {
                    foundseries = false;
                    $(xml).find('Series' + s).each(function () {
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
                        }
                        op.series[op.plotcnt].data = new Array();
                        var pn = 0;
                        $(this).find('Point').each(function () {
                            x = $(this).find("x").text();
                            y = $(this).find("y").text();
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
                    alert("No Results Found (check your date range, that's the usual culprit).");
                }
            }
            else {
                for (s = 0; s >= 0; s++) {
                    foundseries = false;
                    $(xml).find('Series' + s).each(function () {
                        foundresults = false;
                        foundseries = true;
                        $(this).find('Spec').each(function () {
                            seriesname = $(this).find("Name").text();
                            seriesparams = $(this).find("Params").text();
                        });
                        $(this).find('Point').each(function () {
                            foundresults = true;
                            x = $(this).find("x").text();
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
                        });
                        for (i = 0; i < op.xAxis.categories.length; i++) {
                            series[i] = 0;
                        }
                        $(this).find('Point').each(function () {
                            x = $(this).find("x").text();
                            y = $(this).find("y").text();
                            var found = false;
                            for (i = 0; i < op.xAxis.categories.length; i++) {
                                if (op.xAxis.categories[i] == x) {
                                    series[i] = y;
                                    break;
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
                            op.series[op.plotcnt].data.push(parseFloat(series[i]));
                        }
                        op.plotcnt += 1;
                    });
                    if (foundresults) foundanyresults = true;
                    if (!foundseries) break;
                }
                if (!foundanyresults) {
                    alert("No Results Found (check your date range, that's the usual culprit).");
                }
            }
        }
        op.mychart = new Highcharts.Chart(op);
    }

    function chartclick(event, viewindex, me) {
        if (controlopts.views[viewindex].tableoptions) {
            opt = controlopts.views[viewindex].tableoptions;
        }
        else alert("You have an apmClickFunction, but no tableoptions.  How weird.");

        var i;
        var pj = "not found";
        var params = "not found";
        var xval = "not found";
        var name = "not found";
        for (i = 0; i < opt.sxref.length; i++) {
            if (opt.sxref[i].name == me.series.name) {
                pj = opt.sxref[i].project;
                params = opt.sxref[i].params;
                name = opt.sxref[i].name;
                break;
            }
        }
        for (i = 0; i < opt.xxref.length; i++) {
            if ((opt.xxref[i].category == me.category) && (opt.xxref[i].project == pj)) {
                xval = opt.xxref[i].xval;
                break
            }
        }
        maketable(xval + params);
    }

    function maketable(params) {
        var qid = "KPITable";
        if (opt.apmQid) qid = opt.apmQid;
        //var cid = "";
        //if (opt.apmCid) cid = opt.apmCid;
        //var urlbld = "Query.ashx?rtype=table&cid=" + cid + "&qid=" + qid + "&" + params;
        var urlbld = "Query.ashx?rtype=table&qid=" + qid + "&" + params + "&" + appLib.getallparams();
        if (appLib.gup("cid") == "") {
            urlbld += "&cid=" + $("body:first").attr("id");
        }
        //alert("debug:urlbld=" + urlbld);
        $.ajax({
            type: "GET",
            url: urlbld,
            async: false,
            dataType: "xml",
            timeout: 20 * 60 * 1000, //20 minutes
            cache: false,  //make true for live site
            error: function (request, textStatus, errorThrown) {
                if (request.status == 504) {
                    alert("The web page timed out before the table build was ready.\nThe table IS still being built on the server, please wait a few minutes and try again.\nSome reports take up to 20 minutes to complete.");
                }
                else {
                    alert('Error loading table:' + request.status + ' / ' + textStatus + ' / ' + errorThrown);
                }
            },
            success: loadTableFromXML
        });
    }

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
                });
                $(this).find('Schema').each(function () {
                    schemanames.push($(this).find("Name").text());
                    //alert("debug:found schema");
                });
                opt.colNames = new Array();
                opt.colModel = new Array();
                for (n = 0; n < schemanames.length; n++) {
                    opt.colNames.push(schemanames[n]);
                    opt.colModel[n] = new Object();
                    opt.colModel[n].name = new Object();
                    opt.colModel[n].name = schemanames[n];
                    opt.colModel[n].index = new Object();
                    opt.colModel[n].index = schemanames[n];
                    opt.colModel[n].width = 100;
                }

                $(this).find('Point').each(function () {
                    foundresults = true;
                    tbl[tbl.length] = new Object();
                    for (n = 0; n < schemanames.length; n++) {
                        v = $(this).find(schemanames[n]).text();
                        tbl[tbl.length - 1][schemanames[n]] = new Object();
                        tbl[tbl.length - 1][schemanames[n]] = v;
                    }
                });
                //opt.data = new Object();
                opt.data = tbl;
                opt.caption = seriesname;
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
            alert("No Table Results Found (check your date range, that's the usual culprit).");
        }
        if (opt.apmTableType) {
            var tid;
            if (opt.apmTableType == 'cascade') {
                if (opt.tablecnt >= opt.apmTableMax) opt.tablecnt = 0;
                if (opt.apmTableId) {
                }
                opt.tablecnt += 1;
                tid = '#' + opt.apmTableId + opt.tablecnt;
                if (opt.apmPagerId) {
                    opt.pager = '#' + opt.apmPagerId + opt.tablecnt;
                    //opt.toolbar = [true, "top"];
                }
            }
            else {
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
                //alert("debug:opt.width=" + opt.width);
                delete opt.rowNum;

                $(tid).jqGrid(opt);
                if (opt.apmPagerId) {
                    //alert("debug:getting here, opt.pager=" + opt.pager);
                    $(tid).jqGrid('navGrid', opt.pager, { edit: false, add: false, del: false, refresh: false });
                    $(tid).jqGrid('navButtonAdd', opt.pager, {
                        caption: "CSV",
                        title: "Download Comma-Delimited File (.CSV)",
                        buttonicon: "ui-icon-arrowthick-1-s",
                        position: "last",
                        onClickButton: function () {
                            appApmClient.download("csv", tid);
                        }
                    });
                    $(tid).jqGrid('navButtonAdd', opt.pager, {
                        caption: "||.TXT",
                        title: "Download Double-Pipe-Delimited Text File (.TXT)",
                        buttonicon: "ui-icon-arrowthick-1-s",
                        position: "last",
                        onClickButton: function () {
                            appApmClient.download("doublepipe");
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
                    function () { $(this).addClass('ui-state-hover'); },
                    function () { $(this).removeClass('ui-state-hover'); }
                    ).append("<span class='ui-icon ui-icon-circle-close'></span>");
                $('.ui-jqgrid-title').before(temp);
                //$('.ui-jqgrid-titlebar-close').remove();
            }
        }
        else alert("Table options need some work");
    }

    function download_OLD(downloadtype) {

        var mya = new Array();
        mya = $('#' + opt.apmTableId).getDataIDs();  // Get All IDs
        var data = $('#' + opt.apmTableId).getRowData(mya[0]);     // Get First row to get the labels
        var colNames = new Array();
        var ii = 0;
        for (var i in data) { colNames[ii++] = i; }    // capture col names
        var html = "";
        var first = true;
        for (i = 0; i < colNames.length; i++) {
            if (!first) html += "\t";
            html += colNames[i];
            first = false;
        }
        html = html + "\n";  // output each row with end of line
        for (i = 0; i < mya.length; i++) {
            data = $('#' + opt.apmTableId).getRowData(mya[i]); // get each row
            first = true;
            for (j = 0; j < colNames.length; j++) {
                if (!first) html += "\t";
                html += data[colNames[j]]; // output each column as tab delimited
                first = false;
            }
            html = html + "\n";  // output each row with end of line
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

    function download(downloadtype, tid) {
        var mya = new Array();
        mya = $('#' + opt.apmTableId).getDataIDs();  // Get All IDs
        var data = $('#' + opt.apmTableId).getRowData(mya[0]);     // Get First row to get the labels
        var colNames = new Array();
        var ii = 0;
        for (var i in data) { colNames[ii++] = i; }    // capture col names
        var html = "";
        var first = true;
        for (i = 0; i < colNames.length; i++) {
            if (!first) html += "\t";
            html += colNames[i];
            first = false;
        }
        html = html + "\n";  // output each row with end of line
        for (i = 0; i < opt.data.length; i++) {
            data = opt.data[i];
            first = true;
            for (j = 0; j < colNames.length; j++) {
                if (!first) html += "\t";
                html += data[colNames[j]]; // output each column as tab delimited
                first = false;
            }
            html = html + "\n";  // output each row with end of line
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
    }

    function setSeriesType(mytype) {
        for (var i in controlopts.views) {
            controlopts.views[i].chartoptions.chart.defaultSeriesType = mytype;
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

    function movefilters(viewindex) {
        var vi = 0;
        var i;
        var colcnt = 10;
        if (viewindex) vi = viewindex;
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
                if (controlopts.views[vi].filters[j].hidden) {
                    d.style.display = 'none';
                }
                else {
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
        }
        var maxcoly = 0;
        for (i in coly) if (coly[i] > maxcoly) maxcoly = coly[i];
        if (document.getElementById("divMenu")) {
            document.getElementById("divMenu").style.height = (maxcoly + colyinc) + "px";
        }
    }

    function ExampleOfExtend(options) {
        alert("we are in the extend example function");
        var opts = $.extend({}, EXAMPLEdefaultOptions, options);
        alert(dumpObj(opts, "DUMP", "", 0));
    }

    // utilities
    function dumpObj(obj, name, indent, depth) { if (depth > 20) { return indent + name + ": <Maximum Depth Reached>\n"; } if (typeof obj == "object") { var child = null; var output = indent + name + "\n"; indent += "  "; for (var item in obj) { try { child = obj[item]; } catch (e) { child = "<Unable to Evaluate>"; } if (typeof child == "object") { output += dumpObj(child, item, indent, depth + 1); } else { output += indent + item + ": " + child + "\n"; } } return output; } else { return obj; } }

    // global variables
    window.appApmClient = {
        change: change, //jquery change (all maps to 1 function)
        refreshboxes: refreshboxes,
        initcontrols: initcontrols,
        splitdates: splitdates,
        boxval: boxval,
        splitdateval: splitdateval,
        plotme: plotme,
        chartclick: chartclick,
        setSeriesType: setSeriesType,
        cleartables: cleartables,
        cleartable: cleartable,
        tableme: tableme,
        movefilters: movefilters,
        ExampleOfExtend: ExampleOfExtend,
        download: download
    };
    function IsObject(obj) {
        return obj ? true : false;
    }
})();