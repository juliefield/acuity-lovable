//SETTINGS
var XaxisHOLD = "";
var PayPeriodHOLD = "";

var mytestsetting;

var paper;

//------

var op = {
    apmClickFunction: chartclick0,
    apmShowInLegend: true,
    apmQid: 'KPIChart',
    apmTouchpointDashboardFormatting: true,
    report: {
        display: true,
        renderTo: "myreportcontainer",
        cid: "SpreadsheetDashboard", //"ScoreBrief" for companion view, can be changed.
        layout: "full", //companion to sit to left of graph (width of width), full if it replaces the graph and it gets hidden.
        width: 325 //If 0 (or not companion), then full width and hide dashboard
    },
    chart: {
        renderTo: 'mycontainer',
        defaultSeriesType: 'column',
        spacingTop: 30
    },
    title: {
        text: ''
    },
    xAxis: {
        /*
        labels: {
        rotation: 270,
        align: 'right'
        },
        */
        categories: ["Select Criteria and 'plot'"]
    },
    yAxis: [{
            //min: 0, //By removing, it allows it to go negative.
            max: 10,
            //tickInterval: 2,
            //categories: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
            title: {
                text: 'KPI Score'
            },
            labels: {
                step: 1
            }
        } /* FIDDLE: */ //,{ title: { text: 'Raw Score' } }
    ],
    tooltip: {
        useHTML: true,
        formatter: function() {
            return '<div style="z-index:1000;">' + this.series.name + '<br/>' + '<b>' + this.x + '</b><br/>' + /* 'Score: ' + (Math.round(this.point.y * 100.0) / 100.0) + '<br/>' +  'Raw Score: ' + */ this.point.name + '</div>';
        }
    },
    plotOptions: {
        column: {
            stacking: null,
            borderRadius: 8,
            borderWidth: 0
            /*,
            animation: {
            duration: 1000,
            easing: 'swing'
            }
            */
        },
        series: {
            dataLabels: {
                enabled: true,
                /* color: 'white',
                style: {
                	fontWeight: 'bold',
                	backgroundColor: '#FFA500',
                	padding: '2px'
                },
                borderColor: '#AAA', */
                useHTML: true,
                formatter: function() {
                    return (Math.round(this.y * 100.0) / 100.0);
                }
            }
        }
    },
    /* colors: ['blue'], */
    credits: {
        enabled: false
    },
    lang: {
        helpBtnTitle: 'Graph System Overview',
        tableBtnTitle: 'Show Graph as a Table'
    },
    exporting: {
        buttons: {
            helpBtn: {
                symbol: 'url(../applib/css/images/help.gif)',
                tooltip: 'here',
                _titleKey: 'helpBtnTitle',
                x: -88,
                symbolFill: '#B5C9DF',
                symbolX: 10,
                symbolY: 8,
                hoverSymbolFill: '#779ABF',
                onclick: function() {
                    window.open("../help.aspx?cid=GraphOverview");
                }
            },
            tableBtn: {
                symbol: 'url(../applib/css/images/table.gif)',
                tooltip: 'here',
                _titleKey: 'tableBtnTitle',
                x: -62,
                symbolFill: '#B5C9DF',
                symbolX: 10,
                symbolY: 10,
                hoverSymbolFill: '#779ABF',
                onclick: function() {
                    appApmDashboard.graphtotable(0);
                }
            }
            /*,

            printButton: {
            enabled: false
            }*/
        }
    },
    series: [{
        type: 'column',
        name: '(selection)',
        yAxis: 0,
        data: [0],
        showInLegend: false
    }]
};

var opsub = {
    apmClickFunction: chartclick0,
    apmShowInLegend: true,
    apmQid: 'KPIChart',
    apmTouchpointDashboardFormatting: true,
    report: {
        display: true,
        renderTo: "myreportcontainer",
        cid: "SpreadsheetDashboard", //"ScoreBrief" for companion view, can be changed.
        layout: "full", //companion to sit to left of graph (width of width), full if it replaces the graph and it gets hidden.
        width: 325 //If 0 (or not companion), then full width and hide dashboard
    },
    chart: {
        renderTo: 'mycontainersub',
        defaultSeriesType: 'column',
        spacingTop: 30,
        width: null
    },
    title: {
        text: ''
    },
    xAxis: {
        /*
        labels: {
        rotation: 270,
        align: 'right'
        },
        */
        categories: ["Select Criteria and 'plot'"]
    },
    yAxis: [{
            //min: 0, //By removing, it allows it to go negative.
            max: 10,
            //tickInterval: 2,
            //categories: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
            title: {
                text: 'SubKPI Score'
            },
            labels: {
                step: 1
            }
        } /* FIDDLE: */ //,{ title: { text: 'Raw Score' } }
    ],
    tooltip: {
        useHTML: true,
        formatter: function() {
            return '<div style="z-index:1000;">' + this.series.name + '<br/>' + '<b>' + this.x + '</b><br/>' + /* 'Score: ' + (Math.round(this.point.y * 100.0) / 100.0) + '<br/>' +  'Raw Score: ' + */ this.point.name + '</div>';
        }
    },
    plotOptions: {
        column: {
            stacking: null,
            borderRadius: 8,
            borderWidth: 0,
            width: null
            /*,
            animation: {
            duration: 1000,
            easing: 'swing'
            }
            */
        },
        series: {
            dataLabels: {
                enabled: true,
                /*color: 'white',
                style: {
                	fontWeight: 'bold',
                	backgroundColor: '#FFA500',
                	padding: '2px'
                },
                borderColor: '#AAA', */
                useHTML: true,
                formatter: function() {
                    return (Math.round(this.y * 100.0) / 100.0);
                }
            }
        }
    },
    /* colors: ['blue'], */
    credits: {
        enabled: false
    },
    lang: {
        helpBtnTitle: 'Graph System Overview',
    },
    exporting: {
        buttons: {
            helpBtn: {
                symbol: 'url(../applib/css/images/help.gif)',
                tooltip: 'here',
                _titleKey: 'helpBtnTitle',
                x: -62,
                symbolFill: '#B5C9DF',
                symbolX: 10,
                symbolY: 8,
                hoverSymbolFill: '#779ABF',
                onclick: function() {
                    window.open("../help.aspx?cid=GraphOverview");
                }
            }
            /*,

            printButton: {
            enabled: false
            }*/
        }
    },
    series: [{
        type: 'column',
        name: '(selection)',
        yAxis: 0,
        data: [0],
        showInLegend: false,
        width: null
    }]
};

var opt = {
    apmTableType: 'single', //Valid types are 'cascade', 'single'
    apmTableMax: 5,
    apmTableId: 'list1', //if tabletype is 'cascade', this is a prefix.
    apmPagerId: 'pager1',
    apmAcuityHeaderOffset: true,
    apmTouchpointDashboardFormatting: true,
    apmQid: 'KPITable',
    datatype: "local",
    height: 'auto',
    /* rowList: [10, 20, 30], */
    /*colNames: ['Inv No', 'Date', 'Client', 'Amount', 'Tax', 'Total', 'Notes'],
    colModel: [{ name: 'id', index: 'id', width: 60, sorttype: "int" },
    { name: 'invdate', index: 'invdate', width: 90, sorttype: "date", formatter: "date" },
    { name: 'name', index: 'name', width: 100, editable: true },
    { name: 'amount', index: 'amount', width: 80, align: "right", sorttype: "float", formatter: "number", editable: true },
    { name: 'tax', index: 'tax', width: 80, align: "right", sorttype: "float", editable: true },
    { name: 'total', index: 'total', width: 80, align: "right", sorttype: "float" },
    { name: 'note', index: 'note', width: 150, sortable: false }
    ],*/
    pager: "#plist48",
    viewrecords: true,
    //sortname: 'Name',
    //grouping: true,
    //groupingView: {
    //    groupField: ['Name'],
    //    groupCollapse: true
    //},
    caption: "Grouping Array Data",
    onSelectRow: function(id) {
        appApmDashboard.rowselected(id);
    }
};

var global_attritionvisible = false;
var global_attritiontestingvisible = false;
var global_oldprojecttext;

var global_currentfilter = "";
var controlopts = {
    Athreshold: 8.0,
    Bthreshold: 4.0,
    /* performanceRanges is now brought in via CDS.  Not sure we'll go this route for everything, but this does work. */
    /* performanceRanges: [
    { letter: "A", threshold: 8.0, pie: { low: 8.0, high: 10.0 }, color: "#019F01", stops: [[0, '#005B00'], [1, '#00AE00'], [2, '#00AE00']] },
    { letter: "B", threshold: 4.0, pie: { low: 4.0, high: 8.0 }, color: "#EBE40C", stops: [[0, '#AF8013'], [1, '#FEFE00'], [2, '#FEFE00']] },
    { letter: "C", threshold: -99999.0, pie: { low: 0.0, high: 4.0 }, color: "#990101", stops: [[0, '#5B0000'], [1, '#AC0000'], [2, '#AC0000']] }
    ],*/
    initfunction: function() {
        appApmDashboard.movefilters(0); //Debug: I added Location to this on 7/22/2016 to account for the case where we're doing a location check by xaxis.
        appApmDashboard.refreshboxes({
            which: 'Agency,Project,Xaxis',
            success: function() {
                var projectchanged = false;
                //alert("debug:localstorage(" + appApmDashboard.getCookiePrefix() + "-Project" + ")=" + window.localStorage.getItem(appApmDashboard.getCookiePrefix() + "-Project"));
                //$.cookie("AB-Project", "TEST");
                //alert("debug:cookietest=" + $.cookie("AB-Project"));
                if (global_oldprojecttext != "") {
                    $("#selProjects option").each(function() {
                        if ($(this).html() == global_oldprojecttext) {
                            var val = $(this).val();
                            if (val != $.cookie(appApmDashboard.getCookiePrefix() + "-Project")) {
                                $('#selProjects').val(val).trigger("liszt:updated");
                                projectchanged = true;
                            }
                        }
                    });
                }
                appApmDashboard.refreshboxes({
                    which: 'Agencyoffice,Location,Group,Team,CSR,KPI,SubKPI,Payperiod,DataSource,Trendby' + mpar,
                    success: function() {
                        appApmDashboard.finishinit({
                            exclude: 'Payperiod',
                            projectchanged: projectchanged
                        });
                        if ((a$.urlprefix() == "cox.") || (a$.urlprefix().indexOf("cox-make40") >= 0)) {
                           $("#selLocations").val("each").trigger("liszt:updated");
                        }
                        if ((a$.urlprefix() == "nex.") || (a$.urlprefix().indexOf("make") >= 0)) {
                            $('#selKPIs').val('eachlabel').trigger("liszt:updated");
                        } else {
                            $('#selKPIs').val('each').trigger("liszt:updated");
                        }

                        if (document.getElementById("rdoGrid").checked) {
                            $("#rdoGrid").trigger("click");
                        } else {
                            $("#rdoBase").trigger('click');
                        }

                        appApmDashboard.splitdates(document.getElementById('selPayperiods'), document.getElementById('spanDatefrom'), document.getElementById('spanDateto'));
                        if ($("#selProjects").val() != null) {
                            if (appApmReport.currentFilter() == ($("#StgDashboard select").val())) {
                                appApmReport.plotIntercept(0, true, false);
                            }
                            //ko.applyBindings(FanViewModel(), $(".fan-wrapper")[0]);
                            ko.postbox.publish("Role", $.cookie("TP1Role"));
                        }
                        if ($("#selCSRs").val() != "") {
                            ko.postbox.publish("CSR", $("#selCSRs").val());
                        } else if ($("#selTeams").val() != "") {
                            ko.postbox.publish("Team", $("#selTeams").val());
                        }
                        if ($("#selLocations").val() != "") {
                            ko.postbox.publish("Location", $("#selLocations").val());
                        }
                        if ((a$.urlprefix() == "chime.") || (a$.urlprefix().indexOf("chime-make40.") >= 0)) { //Set location to 1 (Morrow)
                            $("#selLocations").val("1").trigger("liszt:updated");
                            $("#locationlabel,#locationfilter").hide();
                        }
                    }
                });
            }
        }); //This will set the project to the first project.
        //appApmDashboard.refreshboxes('Project,Xaxis', appApmDashboard.refreshboxes('Location,Group,Team,CSR,KPI,SubKPI,Payperiod')); //This will set the project to the first project.
        //appApmDashboard.refreshboxes('Location,Group,Team,CSR,KPI,SubKPI,Payperiod');
    },
    pagecontrols: [{
            type: 'select',
            idtemplate: 'Agency',
            onchange: function() {
                appApmDashboard.refreshboxes({
                    which: 'Agencyoffice,Location,Group,Team,CSR,KPI,SubKPI',
                    param: function() {
                        return appApmDashboard.boxval('Agency')
                    }
                });
            },
            param: function() {
                return appApmDashboard.boxval('Agency')
            }
        },
        {
            type: 'select',
            idtemplate: 'Agencyoffice',
            onchange: function() {
                appApmDashboard.refreshboxes({
                    which: 'Location,Group,Team,CSR,KPI,SubKPI',
                    param: function() {
                        return appApmDashboard.boxval('Agencyoffice')
                    }
                });
            },
            param: function() {
                return appApmDashboard.boxval('Agencyoffice')
            }
        },
        {
            type: 'select',
            idtemplate: 'Project',
            onchange: function() {
                if (document.getElementById("rdoGrid").checked) {
                    multiChanged("selProjects");
                }
                global_oldprojecttext = $("#selProjects option:selected").text();
                $.cookie("PROJECTTEXT", global_oldprojecttext);
                appApmDashboard.refreshboxes({
                    which: 'Location,Group,Team,CSR,KPI,SubKPI,Payperiod,Trendby,DataSource',
                    success: function() {
                        appApmDashboard.setdaterangeslider($("#selTrendbys").val());
                        appApmMessaging.composecontacts();
                    }
                });
            },
            param: function() {
                return appApmDashboard.boxval('Project')
            }
        },
        {
            type: 'select',
            idtemplate: 'Location',
            onchange: function() {
                if (document.getElementById("rdoGrid").checked) {
                    multiChanged("selLocations");
                }
                appApmDashboard.refreshboxes({
                    which: (($.cookie("ApmGuatModuleLoc") != "") && ((appApmDashboard.getPrev() == $.cookie("ApmGuatModuleLoc")) || ($("#selLocations").val() == $.cookie("ApmGuatModuleLoc")))) ? 'Group,Team,CSR,DataSource,Payperiod' : 'Group,Team,CSR,DataSource',
                    success: function() {
                        appApmMessaging.composecontacts();
                    }
                });
            },
            param: function() {
                return appApmDashboard.boxval('Location')
            }
        },
        {
            type: 'select',
            idtemplate: 'Group',
            onchange: function() {
                if (document.getElementById("rdoGrid").checked) {
                    multiChanged("selGroups");
                }
                appApmDashboard.refreshboxes({
                    which: 'Team,CSR',
                    success: function() {
                        appApmMessaging.composecontacts();
                    }
                });
            },
            param: function() {
                return appApmDashboard.boxval('Group')
            }
        },
        {
            type: 'select',
            idtemplate: 'Team',
            onchange: function() {
                if (document.getElementById("rdoGrid").checked) {
                    multiChanged("selTeams");
                }
                //alert("debug: teams value = " + $("#selTeams").val());

                ko.postbox.publish("Team", $("#selTeams").val());
                appApmDashboard.refreshboxes({
                    which: 'CSR',
                    success: function() {
                        appApmMessaging.composecontacts();
                    }
                });
            },
            param: function() {
                return appApmDashboard.boxval('Team')
            },
            onrefresh: function() {
                ko.postbox.publish("Team", $("#selTeams").val());
            }
        },
        {
            type: 'select',
            idtemplate: 'CSR',
            onchange: function() {
                if (document.getElementById("rdoGrid").checked) {
                    multiChanged("selCSRs");
                }
                if ($("#selCSRs").val() == "each") {
                    $("#filtersdiv").show();
                }
                else {
                    $("#filtersdiv").hide();
                }
                ko.postbox.publish("CSR", $("#selCSRs").val());
            },
            onrefresh: function() {
                ko.postbox.publish("CSR", $("#selCSRs").val());
                switch ($("#StgDashboard select").val()) {
                    case "Program":
                    case "Financial":
                        if ($("#selCSRs").val() == "") {
                            $("#selCSRs option").each(function() {
                                if ($(this).val().toLowerCase().indexOf("plate") >= 0) {
                                    $("#selCSRs").val($(this).val()).trigger("liszt:updated");
                                }
                            });
                        }
                }
            },
            param: function() {
                return appApmDashboard.boxval('CSR')
            }
        },
        {
            type: 'select',
            idtemplate: 'Payperiod',
            onchange: function(sp) {
                appApmDashboard.splitdates(document.getElementById('selPayperiods'), document.getElementById('spanDatefrom'), document.getElementById('spanDateto'));
                if (sp) {
                    if (sp != 2) {
                        //DEBUG:PUTBACK $("#drpPayperiods").data('dateRangePicker').setDateRange($("#spanDatefrom").html(), $("#spanDateto").html());
                    }
                } else {
                    //DEBUG:PUTBACK $("#drpPayperiods").data('dateRangePicker').setDateRange($("#spanDatefrom").html(), $("#spanDateto").html());
                }
            },
            param: function() {
                return appApmDashboard.splitdateval('Payperiod')
            }
        },
        {
            type: 'select',
            idtemplate: 'KPI',
            onchange: function() {
                appApmDashboard.refreshboxes({
                    which: 'SubKPI',
                    success: function() {}
                });
            },
            onrefresh: function() {
                /*
                var sb = document.getElementById('selKPIs');
                for (var i = 0; i < sb.options.length; i++) {
                if (sb.options[i].text.indexOf('Quality') >= 0) {
                sb.options[i].selected = true; break;
                }
                }
                */
            },
            param: function() {
                return appApmDashboard.boxval('KPI')
            }
        },
        {
            type: 'select',
            idtemplate: 'SubKPI',
            onrefresh: function() {
                var ln = $("#selSubKPIs > option").length;
                if (ln <= 2) { //2 is (All) and (Each)
                    $(".subkpi-display").hide();
                    $("#selSubKPIs").html("");
                } else {
                    $(".subkpi-display").show();
                }
            },
            param: function() {
                return appApmDashboard.boxval('SubKPI')
            }
        },
        {
            type: 'select',
            idtemplate: 'Xaxis',
            param: function() {
                return appApmDashboard.boxval('Xaxis')
            }
        },
        {
            type: 'select',
            idtemplate: 'Trendby',
            onchange: function() {},
            param: function() {
                return appApmDashboard.boxval('Trendby')
            }
        },
        {
            type: 'select',
            idtemplate: 'DataSource',
            param: function() {
                return appApmDashboard.boxval('DataSource')
            }
        },
    ],
    views: [{
        chartoptions: op,
        chartoptionssub: opsub,
        tableoptions: opt,
        filters: [{
                pcid: 'Agency'
            },
            {
                pcid: 'Agencyoffice'
            },
            {
                pcid: 'Project'
            },
            {
                pcid: 'Location'
            },
            {
                pcid: 'Group'
            },
            {
                pcid: 'Team'
            },
            {
                pcid: 'CSR'
            },
            {
                pcid: 'Payperiod',
                customdate: true,
                dashboardformatting: true,
                customdatewarning: true
            },
            {
                pcid: 'KPI'
            },
            {
                pcid: 'SubKPI'
            },
            {
                pcid: 'Xaxis'
            },
            {
                pcid: 'DataSource'
            },
            {
                pcid: 'Trendby'
            }
        ]
    }],
    rank_gpaper: null,
    rank_gpaper2: null,
    varirankgauge: function(o) {
        $("#rankover").html("").show();
        if (o.paper == null) {
            o.paper = Raphael("rankover", 280, 50);
        }
        if (a$.exists(o.paper2)) {
            $("#rankover2").html("").show();
            if (o.paper2 == null) {
                o.paper2 = Raphael("rankover2", 280, 50);
            }
            o.paper2.clear();
            $("#gaugediv").css("height", "250px");
            $("#rankdiv").css("height", "120px");
        } else {
            $("#rankover2").html("").hide();
            $("#gaugediv").css("height", "200px");
            $("#rankdiv").css("height", "70px");
        }
        o.paper.clear();
        var LX = controlopts.rankopts.xoffset,
            LY = 17,
            WIDTH = controlopts.rankopts.barwidth,
            HEIGHT = 20,
            TY = 7;

        function rect(ro) {
            var rectangle = o.paper.rect(LX + (ro.segment.low * WIDTH), LY, (ro.segment.high - ro.segment.low) * WIDTH, HEIGHT);
            //rectangle.attr({ fill: "30-" + ro.color + "-" + ro.color + ":40-" + ro.color, stroke: "white", "stroke-width": 2, "stroke-opacity": 0, "fill-opacity": 1.0 });
            //With gradient:
            rectangle.attr({
                fill: "30-" + ro.stops[0][1] + "-" + ro.color + ":40-" + ro.color,
                stroke: "white",
                "stroke-width": 2,
                "stroke-opacity": 0,
                "fill-opacity": 1.0
            });
            var letter = o.paper.text(LX + (ro.segment.low * WIDTH) + (0.5 * (ro.segment.high - ro.segment.low) * WIDTH), TY, ro.letter);
            letter.attr({
                fill: "white",
                "font-size": "12"
            });
        }
        for (var i = o.ranges.length - 1; i >= 0; i--) {
            rect(o.ranges[i]);
        }

        if (a$.exists(o.paper2)) {
            var LX = controlopts.rankopts.xoffset,
                LY = 17,
                WIDTH = controlopts.rankopts.barwidth,
                HEIGHT = 20,
                TY = 7;

            function rect2(ro) {
                var rectangle = o.paper2.rect(LX + (ro.segment.low * WIDTH), LY, (ro.segment.high - ro.segment.low) * WIDTH, HEIGHT);
                //rectangle.attr({ fill: "30-" + ro.color + "-" + ro.color + ":40-" + ro.color, stroke: "white", "stroke-width": 2, "stroke-opacity": 0, "fill-opacity": 1.0 });
                //With gradient:
                rectangle.attr({
                    fill: "30-" + ro.stops[0][1] + "-" + ro.color + ":40-" + ro.color,
                    stroke: "white",
                    "stroke-width": 2,
                    "stroke-opacity": 0,
                    "fill-opacity": 1.0
                });
                var letter = o.paper2.text(LX + (ro.segment.low * WIDTH) + (0.5 * (ro.segment.high - ro.segment.low) * WIDTH), TY, ro.letter);
                letter.attr({
                    fill: "white",
                    "font-size": "12"
                });
            }
            for (var i = o.ranges2.length - 1; i >= 0; i--) {
                rect2(o.ranges2[i]);
            }
        }
        //var triangle = gpaper.path("M 25 25 l 10 10 l -20 0 l 10 -10");
        //triangle.attr("fill", "white");
    }
};

var mpar = "";
var settingstoggle = true;
var debug_makingsprintgame = false; //DEBUG: Make sure this is false if pushing live.

//TODO: Put this somewhere.
var m_was = {
    selProjects: {
        all: true,
        each: false,
        other: false
    },
    selLocations: {
        all: true,
        each: false,
        other: false
    },
    selGroups: {
        all: true,
        each: false,
        other: false
    },
    selTeams: {
        all: true,
        each: false,
        other: false
    },
    selCSRs: {
        all: true,
        each: false,
        other: false
    }
};

function chartclick0(event) {
    appApmDashboard.chartclick(event, 0, this);
};

function multiChanged(t) {
    if (!$("#" + t)[0].hasAttribute("multiple")) return;

    var v = $("#" + t).val();
    var changed = false;
    if (v == null) {
        v = [""];
    } else if (v[0] == "") {
        if (m_was[t].other || m_was[t].each) {
            v = [""]; //Changing to all
            m_was[t].all = true;
            m_was[t].each = false;
            m_was[t].other = false;
        } else { //Was "all" before
            if (v[1] == "each") {
                //changing to each
                v = ["each"];
                m_was[t].each = true;
                m_was[t].all = false;
            } else if (v.length > 1) {
                //changing to other
                v.splice(0, 1);
                m_was[t].other = true;
                m_was[t].all = false;
            } else {
                m_was[t].all = true;
                m_was[t].each = false;
                m_was[t].other = false;
            }
        }
    } else if (v[0] == "each") { //All is not selected, but each is.
        if (m_was[t].other || m_was[t].all) {
            v = ["each"]; //Changing to each
            m_was[t].all = false;
            m_was[t].each = true;
            m_was[t].other = false;
        } else if (v.length > 1) {
            //changing to other
            v.splice(0, 1);
            m_was[t].other = true;
            m_was[t].each = false;
        } else {
            m_was[t].all = false;
            m_was[t].each = true;
            m_was[t].other = false;
        }
    } else { //Stuff in there, but it's not all or each (so other)
        m_was[t].all = false;
        m_was[t].each = false;
        m_was[t].other = true;
    }
    if (m_was[t].each || m_was[t].other) {
        if ((v.length > 1) && (v[0] == "")) {
            v.splice(0, 1);
        }
    }
    changed = true;
    if (changed) {
        $("#" + t).val(v);
        $("#" + t).trigger("liszt:updated");
    }
}

function multiSetMultiple(t) {
    if (!$("#" + t)[0].hasAttribute("multiple")) {
        if ($("#" + t + " option").length <= 1) return;
        //alert("debug: converting to multiple2");
        //alert("debug: box length = " + $("#" + t + " option").length);
        $("#" + t).attr("multiple", "multiple");
        var v = $("#" + t).val();
        //alert("debug: v=" + v);
        m_was[t].all = false;
        m_was[t].each = false;
        m_was[t].other = false;
        if (v[0] == "") {
            m_was[t].all = true;
        } else if (v[0] == "each") {
            m_was[t].each = true;
        } else {
            m_was[t].other = true;
        }
        $("#" + t).removeClass("chzn-done");
        $("#" + t).next().remove();
        $("#" + t).data("Placeholder", "Select...").chosen();
        $("#" + t).trigger("liszt:updated");
        $("#" + t).val(v);
        //$("#" + t).chosen({ disable_search_threshold: 5 });
    }
}

function multiSetSingle(t) {
    if ($("#" + t)[0].hasAttribute("multiple")) {
        //alert("debug: converting back to single");
        var v = $("#" + t).val();
        v = v[0];
        $("#" + t).removeAttr("multiple");
        $("#" + t).removeClass("chzn-done");
        $("#" + t).next().remove();
        $("#" + t).data("Placeholder", "Select...").chosen();
        $("#" + t).trigger("liszt:updated");
        $("#" + t).val(v);
    }
}

document.legacyReady = function() {

    //setTimeout(function() { //Added 11/26/2017 - allows ng directives to populate first.

    appEasycom.init();

    if ($.cookie("TP1Role") == "Admin") {
        $(".dev-allowed").show();
    }
    
    /*
    if (a$.exists(appVersus)) {
        appVersus.ready();
    }
    */

    appApmDashboard.initcontrols(controlopts);

    $("#welcomelabel").html("Proof Animation Works in Jquery (outside AngularJS)").animate({
        "margin-right": "800px"
    },{
        duration: 50000
    });




    switch (a$.urlprefix()) {
        case "ers.":
            document.title = "CEScore 3.0";
            break;
        case "chime.":
            document.title = "ChimeScore 3.0";
            break;
        default:
            document.title = "Acuity 3.0 - " + a$.urlprefix().split(".")[0].toUpperCase();
    }                            


    paper = Raphael(0, 0, 500, 70);

    $("#tabs").tabs();
    $("#hometabs").tabs();
    $("#tabsattrition").tabs();

    $(window).resize(function() {
        resizedivs();
    });

    $(':input').focus(function() {
        appApmDashboard.setPrev(this.value);
    }).change(function() {
        appApmDashboard.change(this);
        appApmDashboard.setPrev(this.value);
    });

    $.cookie("ApmGuatModuleLoc", "9");
    global_oldprojecttext = $.cookie("PROJECTTEXT");

    $('#btnPlot').click(function() {
        if (appApmReport.currentFilter() == $("#StgDashboard select").val()) {
            if (!$("#graphtab").eq(0).hasClass("ui-state-active")) {
                $('#graphlabel').trigger('click');
            }
        }
        var plottingok = true;
        if (document.getElementById("rdoTrend").checked) {
            //if (document.getElementById("rdoPayperiod").checked) a$.setOption(document.getElementById("selXaxiss"), "Payperiod");
            //else a$.setOption(document.getElementById("selXaxiss"), "Month");
            var sb = document.getElementById('selKPIs');
            for (var i = 0; i < sb.options.length; i++) {
                if (sb.options[i].selected) {
                    /*
                    if ((sb.options[i].text.indexOf('(Each)') >= 0)) {
                        alert("KPI can't be (Each) for a Trend report.");
                        plottingok = false;
                        break;
                    }
                    */
                }
            }
        }
        if (plottingok) {
            $("#" + controlopts.views[0].chartoptions.chart.renderTo + "prompt").css("display", "none");
            $("#" + controlopts.views[0].chartoptionssub.chart.renderTo + "prompt").css("display", "none");
            appApmReport.plotIntercept(0, true, false);
            document.getElementById('btnAdd').disabled = '';
            document.getElementById('btnClear').disabled = '';
        }
    });
    $('#btnAdd').click(function() {
        $('#graphlabel').trigger('click');
        appApmDashboard.plotme(0, false, false);
    });

    $('#btnClear').click(function() {
        //Note: This was broken before I added the subchart.
        clearme(controlopts.views[0].chartoptions);
        clearme(controlopts.views[0].chartoptionssub);
        if (a$.exists(op.report)) {
            $("#" + op.report.renderTo).html("");
        }

        function clearme(op) {
            $('#graphlabel').trigger('click');
            op.plotcnt = 0;
            try {
                op.series.length = 0;
            } catch (err) {
                op.series = new Array();
            };
            op.xAxis.categories.length = 0;
            op.mychart = new Highcharts.Chart(op);
            $("#" + op.chart.renderTo + "prompt").css("display", "block");
        }

        document.getElementById('btnAdd').disabled = 'disabled';
        document.getElementById('btnClear').disabled = 'disabled';
    });

    $('#rdoBase').click(function() {
        $(".report-grouping-wrapper").hide();
        $("#settingsdiv").show();

        document.getElementById('btnAdd').disabled = 'disabled';
        $("#selXaxiss").val("KPI").trigger("liszt:updated");
        if (PayPeriodHOLD != "") $("#selPayperiods").val(PayPeriodHOLD).trigger("liszt:updated");
        appApmDashboard.setSeriesType('column');
        appApmDashboard.setDataSet('KPI');
        if ((location.hash != "#ScoreEditor") && (location.hash != "#AttendanceTracker")) { //So I can keep this trigger upon filter init
            document.getElementById("kpidl").style.display = 'inline';
        }
        document.getElementById("datedl").style.display = 'inline';
        document.getElementById("trenddl").style.display = 'none';
        var sb = document.getElementById('selKPIs');
        if (sb.selectedIndex >= 0) {
            if (sb.options[sb.selectedIndex].value == "") {
                $('#selKPIs').val('each').trigger("liszt:updated");
            }
        }
    });

    $('#rdoGrid').click(function() {
        //TODO: For now, this is an exact duplicate of rdoBase click above.  It may be beneficial to make this different'.
        //$(".report-grouping-wrapper").show();
        $("#settingsdiv").hide();

        document.getElementById('btnAdd').disabled = 'disabled';
        $("#selXaxiss").val("KPI").trigger("liszt:updated");
        if (PayPeriodHOLD != "") $("#selPayperiods").val(PayPeriodHOLD).trigger("liszt:updated");
        appApmDashboard.setSeriesType('column');
        appApmDashboard.setDataSet('KPI');
        if ((location.hash != "#ScoreEditor") && (location.hash != "#AttendanceTracker")) { //So I can keep this trigger upon filter init
            document.getElementById("kpidl").style.display = 'inline';
        }
        document.getElementById("datedl").style.display = 'inline';
        document.getElementById("trenddl").style.display = 'none';
        var sb = document.getElementById('selKPIs');
        if (sb.selectedIndex >= 0) {
            if (sb.options[sb.selectedIndex].value == "") {
                $('#selKPIs').val('each').trigger("liszt:updated");
            }
        }
    });

    $("#selTrendbys").bind("change", function() {
        if ($("#selTrendbys").val() == "0") {
            $(".subkpi-display").hide();
            $("#selSubKPIs").html("");
        }
        $("#selXaxiss").val("each_" + $("#selTrendbys").val()).trigger("liszt:updated");
        //Added 3/28/2015 (clugueing in Day logging) (each_0)
        //if ($("#selXaxiss").val() != ("each_" + $("#selTrendbys").val())) {
        //    $("#selXaxiss").append('<option value="each_' + $("#selTrendbys").val() + '" selected="selected">' + $("#selTrendbys option:selected").text() + '</option>').trigger("liszt:updated");
        //}
        $("#selXaxiss").val("each_" + $("#selTrendbys").val()).trigger("liszt:updated");

        $("#selPayperiods").val("each_" + $("#selTrendbys").val()).trigger("liszt:updated");
        appApmDashboard.setdaterangeslider($("#selTrendbys").val());
    });

    $('#rdoTrend').click(function() {
        $(".home-grouping-wrapper").hide();
        $("#settingsdiv").show();
        var sb = document.getElementById('selPayperiods');
        if (sb.selectedIndex >= 0) {
            if (PayPeriodHOLD == "") PayPeriodHOLD = sb.options[sb.selectedIndex].value;
        }
        document.getElementById('btnAdd').disabled = 'disabled';
        $("#selTrendbys").trigger("change");

        document.getElementById("trenddl").style.display = 'inline';

        appApmDashboard.setSeriesType('line');
        appApmDashboard.setDataSet('KPI');
        document.getElementById("kpidl").style.display = 'inline';
        document.getElementById("datedl").style.display = 'none';

        sb = document.getElementById('selKPIs');
        if (sb.selectedIndex >= 0) {
            if (sb.options[sb.selectedIndex].value == "each") {
                $('#selKPIs').val('').trigger("liszt:updated");
            }
        }
    });

    $('#rdoPay').click(function() {
        $(".home-grouping-wrapper").hide();
        $("#settingsdiv").hide();
        $(".subkpi-display").hide();
        $("#selSubKPIs").html("");
        var sb = document.getElementById('selPayperiods');
        document.getElementById("kpidl").style.display = 'none';
        document.getElementById("datedl").style.display = 'none';
        document.getElementById("trenddl").style.display = 'none';
        appApmDashboard.setSeriesType('column');
        appApmDashboard.setDataSet('Pay');
        if (PayPeriodHOLD == "") PayPeriodHOLD = sb.options[sb.selectedIndex].value;
        a$.setOption(document.getElementById("selPayperiods"), 'each');
    });

    $('#rdoPayperiod').click(function() {
        a$.setOption(document.getElementById("selXaxiss"), "Payperiod");
        appApmDashboard.setdaterangeslider("Pay Period");
    });
    $('#rdoMonth').click(function() {
        a$.setOption(document.getElementById("selXaxiss"), "Month");
        appApmDashboard.setdaterangeslider("Month");
    });

    //Don't allow an "-import" login to access the dashboard.
    if (a$.urlprefix().indexOf("-import.") >= 0) {
        var wd = window.location.href;
        window.location = wd.replace("-import", "");
        return;
    }

    $("#helloworldtab").hide();
    //ko.applyBindings(HelloWorldViewModel({ config: "Dashboard" }), $(".helloworld-wrapper")[0]);

    if (a$.gup("dev") == "1") {
        /* //Whichever one is listed first isn't getting the subscribes (or something).
         */

        $("#treasurehunttab").show();
        ko.applyBindings(TreasureHuntViewModel({
            config: "Dashboard"
        }), $(".treasurehunt-wrapper")[0]);
    }

    appApmReport.init({});

    //Note: there are other binds on these buttons.
    $("#rdoGrid").bind("click", function() {
        if ((a$.urlprefix() == "km2.") || (a$.urlprefix().indexOf("km2-make40.") >= 0)) {
            $("#kpidl").hide();
        }
        $("#btnAdd").hide();
        $(".stg-reportgrouping-show").show();
        $(".gaugesdiv-wrapper").hide();
        //multiSetMultiple("selProjects");
        multiSetMultiple("selLocations");
        multiSetMultiple("selGroups");
        multiSetMultiple("selTeams");
        multiSetMultiple("selCSRs");
    });

    $("#rdoBase,#rdoTrend,#rdoPay").bind("click", function() {
        if ((a$.urlprefix() == "km2.") || (a$.urlprefix().indexOf("km2-make40.") >= 0)) {
            $("#kpidl").show();
        }
        $("#btnAdd").show();
        $(".stg-reportgrouping-show").hide();
        $(".gaugesdiv-wrapper").show();
        //multiSetSingle("selProjects");
        multiSetSingle("selLocations");
        multiSetSingle("selGroups");
        multiSetSingle("selTeams");
        multiSetSingle("selCSRs");
    });

    if (debug_makingsprintgame || (a$.urlprefix() == "sprintgame.")) {
        if ($.cookie("TP1ChangePassword") == "Y") {
            qa_changepassword({
                showsprintgamestart: true
            });
        } else {
            qa_sprintgamestart({});
        }
    } else {
        if (a$.urlprefix() != "km2.")        
            if ($.cookie("TP1ChangePassword") == "Y") {
                qa_changepassword({});
            }
        }
    }

    $("#changepassword_li").unbind().bind("click", function() {
        $(".qa-changepassword h1").html("Change Password");
        $(".qa-changepassword-extra").html("");
        $(".qa-changepassword-submiterror").hide();
        $(".qa-changepassword-text-current").val("").trigger("keyup");
        qa_changepassword({});
        window.appApmNavMenus.closeSide();
    });

    $("#qa_div").qa({
        action: "loginInit"
    });

    /*
							qa_1();
							$(".qa-bubble").bind("click", function () {
							$(this).hide();
							qa_2();
							});
                            */

    document.CONFIG = "Dashboard";

    if ((a$.urlprefix() == "km2.") && ($.cookie("TP1Role") == "Admin")) {
        $(".message-notifier-wrapper-km2").show();
    } else if ((a$.urlprefix() == "ces.") && (($.cookie("TP1Role") == "CorpXXXXXXAdmin") || ($.cookie("TP1Role") == "Admin") ||
            ($.cookie("TP1Username").toLowerCase() == "jangulo")
        )) {
        $(".message-notifier-wrapper-ces").show();
    } else if ((a$.urlprefix() == "ers.") && (($.cookie("TP1Role") == "CorpAdmin") || ($.cookie("TP1Role") == "Admin"))) {
        $(".message-notifier-wrapper-ers").show();
    } else if ((a$.urlprefix() == "chime.") && (($.cookie("TP1Role") == "CorpAdmin") || ($.cookie("TP1Role") == "Admin") ||
            ($.cookie("TP1Username").toLowerCase() == "shammon") ||
            ($.cookie("TP1Username").toLowerCase() == "tvalentine") ||
            ($.cookie("TP1Username").toLowerCase() == "nwalford") ||
            ($.cookie("TP1Username").toLowerCase() == "byoung") ||
            ($.cookie("TP1Username").toLowerCase() == "msalasrios")
        )) {
        $(".message-notifier-wrapper-chime").show();
    } else if (($.cookie("TP1Role") == "Admin")) {
        $(".message-notifier-wrapper-all").show();
    }

    if ((a$.urlprefix() == "chime.") || (a$.urlprefix() == "chime-make40.")) {
        if ($.cookie("TP1Role") != "CSR") {
            $("#resetpassword_li").show().unbind().bind("click", function() {
                if (($("#selCSRs").val() == "") || ($("#selCSRs").val() == "each")) {
                    alert("Please select a Consultant using the filters (on the left), then select 'Reset Consultant Password' again.");
                    window.appApmNavMenus.closeSide();
                } else {
                    var csr = $("#selCSRs").val();
                    var r = confirm("Are you sure you want to reset the password for '" + $("#selCSRs option:selected").text() + "'?\n\nPress Ok to continue.");
                    if (r == true) {
                        a$.ajax({
                            type: "GET",
                            service: "JScript",
                            async: true,
                            data: {
                                lib: "login",
                                product: "Acuity",
                                CSR: csr,
                                cmd: "resetpassword"
                            },
                            dataType: "json",
                            cache: false,
                            error: a$.ajaxerror,
                            success: attemptreset
                        });

                        function attemptreset(json) {
                            if (a$.jsonerror(json)) {} else {
                                alert("Password Reset Successful!");
                            }
                        }
                        window.appApmNavMenus.closeSide();
                    }
                }
            });
        }
    }

    //Experimental "report panel" in main dashboard.
    if ((a$.urlprefix() == "km2.") || (a$.urlprefix().indexOf("km2-make40.") >= 0)) {
        $("#myreportcontainer").show();
        //Don't hide this now.  RAY: $(".gaugesdiv-wrapper").hide();
        if ($.cookie("TP1Role") != "CSR") {
            //TODO: Disable for now: $("#presetsdl").show();
           /*  $('.headericon-graph').qtip({
                content: 'Graphs and Reports'
            }); */

            $("#selPresets").val("").qtip({
                content: 'Select a saved setup to view.'
            }).bind("change", function() {
                if ($(this).val() == "") {
                    $(".filters-presets-link").removeClass("presets-command-delete").addClass("presets-command-add");
                } else {
                    $(".filters-presets-link").removeClass("presets-command-add").addClass("presets-command-delete");
                }
                $(".presets-command-add").qtip({
                    content: 'Add a new preset view.'
                })
                $(".presets-command-delete").qtip({
                    content: 'Delete preset view.'
                })
            });
            $(".filters-presets-link").bind("click", function() {
                if ($(this).hasClass("presets-command-add")) {
                    var v = "StgDashboard=" + $("#StgDashboard select").val();
                    v += "&View=";
                    if (document.getElementById("rdoBase").checked) {
                        v += "Base";
                    } else if (document.getElementById("rdoGrid").checked) {
                        v += "Base"; //TODO: Grid view operates the same as base view for now.
                    } else if (document.getElementById("rdoTrend").checked) {
                        v += "Trend";
                    } else if (document.getElementById("rdoPay").checked) {
                        v += "Pay";
                    }
                    v += "&" + appApmDashboard.viewparams(0, false)
                    alert("debug: Add Preset with viewparams: " + v);
                    $("#selPresets").append('<option value="test add">test add</option>');
                    $("#selPresets").val("test add");
                } else {
                    if (confirm("Do you wish to permanently delete the preset named '" + $("#selPresets").val() + "'?")) {
                        //alert("debug: Delete Preset: " + $("#selPresets").val());
                        /*
                        $("#selPresets option [value='" + $("#selPresets").val() + "']").each(function() {
                            $(this).remove();
                        });
                        */
                        //$("#selPresets option").find('value="' + $("#selPresets").val() + '"]').remove();
                        //$("#selPresets").find("option").find('value="' + $("#selPresets").val() + '"]').remove();
                        //$("#selPresets").find("option").remove();
                        $("#selPresets option").each(function() {
                            if ($(this).val() == $("#selPresets").val()) {
                                $(this).remove();
                            }
                        });
                        $("#selPresets").val("");
                    }
                }
                $("#selPresets").trigger("liszt:updated");
                $("#selPresets").trigger("change");
            });
        }
    }

    appApmSettings.init({
        id: "StgReportGrouping",
        ui: "slider"
    });
    $("#StgReportGrouping select").bind("change", function() {
        appApmReport.plotIntercept(0, true, false);
    });
    eve
    appApmSettings.init({
        id: "StgView",
        ui: "slider"
    });
    appApmSettings.init({
        id: "StgViewDateType",
        ui: "slider"
    });
    $("#StgView select").bind("change", function() {
        switch ($(this).val()) {
            case "Grid":
                if ($("#StgViewDateType select").val() == "Period") {
                    document.getElementById("rdoGrid").checked = true; //TODO:  Will be rdoGrid as soon as that's installed.
                    document.getElementById("rdoBase").checked = false; //TODO:  Will be rdoGrid as soon as that's installed.
                    document.getElementById("rdoTrend").checked = false;
                    document.getElementById("rdoPay").checked = false;
                } else {
                    alert("debug: Grid view not supported in multi-date mode yet, setting to single (rdoBase)");
                    document.getElementById("rdoGrid").checked = false;
                    document.getElementById("rdoBase").checked = true;
                    document.getElementById("rdoTrend").checked = false;
                    document.getElementById("rdoPay").checked = false;
                }
                break;
            case "Chart":
                if ($("#StgViewDateType select").val() == "Period") {
                    document.getElementById("rdoGrid").checked = false;
                    document.getElementById("rdoBase").checked = true;
                    document.getElementById("rdoTrend").checked = false;
                    document.getElementById("rdoPay").checked = false;
                } else {
                    document.getElementById("rdoGrid").checked = false;
                    document.getElementById("rdoBase").checked = false;
                    document.getElementById("rdoTrend").checked = true;
                    document.getElementById("rdoPay").checked = false;
                }
                break;
            default:
                alert("debug: invalid view binding");
                break;
        }
    });
    $("#StgViewDateType select").bind("change", function() {
        switch ($(this).val()) {
            case "Period":
                if ($("#StgView select").val() == "Grid") {
                    document.getElementById("rdoGrid").checked = true;
                    document.getElementById("rdoBase").checked = false; //TODO:  Will be rdoGrid as soon as that's installed.
                    document.getElementById("rdoTrend").checked = false;
                    document.getElementById("rdoPay").checked = false;
                } else {
                    document.getElementById("rdoGrid").checked = false;
                    document.getElementById("rdoBase").checked = true;
                    document.getElementById("rdoTrend").checked = false;
                    document.getElementById("rdoPay").checked = false;
                }
                break;
            case "Multiple":
                if ($("#StgViewDateType select").val() == "Grid") {
                    alert("debug: Grid view not supported in multi-date mode yet, setting to single (rdoBase)");
                    document.getElementById("rdoGrid").checked = true;
                    document.getElementById("rdoBase").checked = false;
                    document.getElementById("rdoTrend").checked = false;
                    document.getElementById("rdoPay").checked = false;
                } else {
                    document.getElementById("rdoGrid").checked = false;
                    document.getElementById("rdoBase").checked = false;
                    document.getElementById("rdoTrend").checked = true;
                    document.getElementById("rdoPay").checked = false;
                }
                break;
            default:
                alert("debug: invalid view binding");
                break;
        }
    });

    //Apply bindings to ALL viewe models.
    //Filter Actions Plugin (can be used in Dashboard or other contexts)

    if (((a$.urlprefix() == "ers.") || (a$.urlprefix() == "km2.") || (a$.urlprefix() == "cox.") || (a$.urlprefix() == "v3.") || (a$.urlprefix().indexOf("make.") >= 0) || (a$.urlprefix().indexOf("make40.") >= 0)) && ($.cookie("TP1Role") != "CSR")) {
        ko.applyBindings(FilterAttributesViewModel({
            config: "Dashboard"
        }), $(".filters-attributes-wrapper")[0]);
    } else {
        $("#filterlabel").hide();
        $("#filtergroup").hide();
        $(".filters-attributes-link").hide();
    }

    var showagame = true;
    if ($.cookie("ApmProjectFilter") != null) {
        if (($.cookie("ApmProjectFilter") != "none") && ($.cookie("ApmProjectFilter") != "")) {
            showagame = false;
        }
    }
    /*
    if (a$.urlprefix().indexOf("km2") >= 0) {
        showagame = false; //Just to buy some time.
    }
    */

    if (a$.gup("wand") != "") {
        $(".headericon-wand").show().bind("click", function() {
            window.open('agent/default.aspx', 'Agent', 'width=600,height=400');
        });
    }

    if (showagame) {
        var dateoffset = 0;
        if (a$.gup("dateoffset") != "") {
            dateoffset = parseInt(a$.gup("dateoffset"));
        }

        var gametheme = "";
        var gametest = false;

        if ((a$.urlprefix() == "cthix.") || (a$.urlprefix().indexOf("make.") >= 0)) {
            //Returning to football for gridiron development
            gametheme = "football";
            gametest = false;
        } else if ((a$.urlprefix() == "ces.") || (a$.urlprefix() == "ers.")) {
            gametheme = "football";
            gametest = false;
        } else if (debug_makingsprintgame || (a$.urlprefix() == "sprintgame.")) {
            gametheme = "summer olympics";
            gametest = false;
        } else if ((a$.urlprefix() == "vec.") || (a$.urlprefix() == "bgr.") || (a$.urlprefix() == "bgr-test.") || (a$.urlprefix() == "bgr-make40.")) {
            gametheme = "football";
            gametest = false;
        }

        var lid = 0;

        if ((!debug_makingsprintgame) && (a$.urlprefix().indexOf("make40.") >= 0)) { //TEST: Quick switch for theme in Make40
            gametheme = "basketball";
            gametest = false;
            //lid = 2;
        }

        if ((a$.urlprefix().indexOf("chime-make40.") >= 0) || (a$.urlprefix() == "chime.")) {
            if ($.cookie("TP1Role") != "CSR") {
                gametheme = "football";
                gametest = false;
            } else {
                gametheme = "football";
                gametest = false;
            }
        }

        if ((a$.urlprefix().indexOf("km2-make40.") >= 0) || (a$.urlprefix() == "km2.")) {
            gametheme = "soccer";
            gametest = false;
        }

        if (a$.gup("gametheme") != "") {
            gametheme = a$.gup("gametheme");
            gametest = false;
        }

        if (gametheme == "summer olympics") {
            if (debug_makingsprintgame || (a$.urlprefix() == "sprintgame.")) {
                lid = 62;
            }
        }
        gametest = false;
        if (a$.gup("gametest") != "") {
            gametest = true;
        }
        var draftonly = true;
        if (gametest) {
            draftonly = false;
        }

        //For testing and building of xtreme.
        if (a$.urlprefix() == "bgr-make40.") {
            //dateoffset = 210;
            gametheme = "football";
            gametest = false;
        }
        if ((a$.urlprefix() == "make40.") || (a$.urlprefix() == "ers.") || (a$.urlprefix() == "v3.")) {
            //dateoffset = 210;
            gametheme = "football";
            gametest = false;
        }

        //gametest=true; //TEST TEST TEST
        $("#fantab").hide();
        if (gametheme != "") {
            ko.applyBindings(FanViewModel({
                test: gametest,
                testdateoffset: dateoffset,
                draftonly: draftonly,
                theme: gametheme,
                leagueid: lid,
                inplayoffs: false
            }), $(".fan-wrapper")[0]);
            $("#fantab").show();
        }

        if (gametheme == "basketball") {
            $(".headericon-agame").addClass("headericon-agame-basketball");
        } else if (gametheme == "summer olympics") {
            $(".headericon-agame").addClass("headericon-agame-medalist").css("width", "110px");
            $(".headericon-agame-gamescore").hide();
            $(".headericon-agame-gamestatus").css("color", "black").css("position", "absolute").css("top", "10px").css("left", "8px");
            $('#fantab').show();
            $('#fanlabel').trigger('click');
        } else if (gametheme == "football") {
            $(".headericon-agame").addClass("headericon-agame-football");
        } else if (gametheme == "soccer") {
            $(".headericon-agame").addClass("headericon-agame-soccerball");
        }

        $(".headericon-agame").qtip({
            content: 'A-GAME!'
        }).bind("click", function() {
            $("#fantab").show();
            $("#fanlabel").trigger("click");
        });

        $(".headericon-xtreme").qtip({
            content: 'Add Player to Xtreme Queue'
        }).bind("click", function() {
            $("#fantab").show();
            $("#fanlabel").trigger("click");
        });
    } else {
        $("#fantab").hide();
    }

    //This looks old, but is new 11/20/2015.
    $(".table-download").attr("title", "Download Table").attr("onclick", "$(this).downloadContents();return false;").html("&nbsp;&nbsp;&nbsp;");

    //TODO: Figure out how to replace the explicit bindings above with a single binding as below (I think I HAVE to if I want to employ components).
    //ko.applyBindings();

    $("#filtergroup").FilterAction({
        action: "init"
    });

    //alert("debug:HELLO!  My test setting in the dashboard = " + mytestsetting);

    /* TRAPPING - NOTE: REMOVE THIS SECTION COMPLETELY FROM THE V8/V8L versions */
    /*
    try {
        var overrideAlert = alert;
        alert = function (a) {
            if (a == "") {
                //overrideAlert("Connection Error - Please check your Internet connection\n\nand/or security appliances if on a managed network.");
                $(".err-content").html("Connection Error - Please check your Internet connection and/or security appliances if on a managed network.<br/><br/>This message may automatically disappear when your connection is restored.");
                $(".err-container").show();
            }
            else if (a.toLowerCase().indexOf(">service unavailable<") >= 0) {
                $(".err-content").html("Connection Error - Acuity cannot currently be reached.  Please do not log out, you will be re-connected automatically.<br/><br/>This message may automatically disappear when your connection is restored.");
                $(".err-container").show();
            }
            else if (a.toLowerCase().indexOf("an unhandled exception occurred") >= 0) {
                try {
                    var ts = a.split("<title>");
                    var m = ts[1].split("</title>");
                    overrideAlert("Exception: " + m[0]);
                }
                catch (e) {
                    overrideAlert("STACK DUMP: " + a);
                }
            }
            else {
                overrideAlert(a);
            }
        }
    }
    catch (e) {
    }
    */
    /* END TRAPPING */

    if ((a$.urlprefix().indexOf("make") >= 0) || (a$.urlprefix() == "ers.") || (a$.urlprefix() == "cthix.")) {
        stgRankPointsLabel = "Treasure Hunt"; //debug: for development.
    }

    $(".RankPointsLabel").html(stgRankPointsLabel);

    if ($("#ie9test").html() == "YES") {
        //alert("IE9 Detected (There are known compatibility issues).");
        //window.location = "DashboardAsyncV8L.aspx";
    }

    if ((a$.urlprefix().indexOf("make") >= 0) && ($.cookie("TP1Role") == "CSR")) {
        //window.location = "//ers.acuityapm.com";
    }

    //$.cookie("ApmInDallas","YES"); //Debug
    //$.cookie("ApmProjectFilter", "TXU EOP"); //Debug
    //$.cookie("ApmProjectFilter", ""); //Debug

    $(".chat-beep-icon").hide();
    $.fn.qtip.defaults.position.my = 'middle left';
    $.fn.qtip.defaults.position.at = 'middle right';
    $.fn.qtip.defaults.style.classes = 'ui-tooltip-rounded';

    appApmDashboard.setClientLabels();
    appApmNavMenus.init();
    //alert("debug:enter ready");
    //appApmDashboard.showprogress("comboprogress");
    //$("#nav").css("width",($(window).width() - parseInt($("#nav").css('left'))) + 'px');
    $("#loading").hide();

    $("#container").show();

    appApmDashboard.setCookiePrefix("ED"); //Operations CSR Dashboard

    //Cheat for the debugging side.
    if ($.cookie("TP1Username") == "mgranberry") {
        $.cookie("ApmInDallas", "YES");
    }

    if ($.cookie("ApmInDallas") != null)
        if ($.cookie("ApmInDallas") != "") {
            mpar = "/month";
            $("#showpay").css("display", "none");
        }
    else {
        mpar = "/payperiod";
    }

    //TODO:Disabling tooltips doesn't always work - it fails in this case for sure if you've already displayed the tooltip:
    $('#daterange').qtip({
        content: 'Slide left/right<br />to select a range of dates for the trend report.'
    });

    $('#rankdiv').qtip({
        content: 'Ranking is calculated NIGHTLY.  Scores imported today may not be included in the calculation.'
    });

    $("#cepointstab").hide();
    $("#cepointsmgrtab").hide();
    $("#attritiontab").hide();
    $("#guidetab").hide();
    if ((a$.urlprefix() == "chime.") || (a$.urlprefix() == "chime-test.") || (a$.urlprefix() == "chime-make40.")) {
        $("#guidetab").show();
        if (($.cookie("TP1Role") != "CSR")) {
            //$("#attritiontab").show();
            global_attritionvisible = true;
            global_attritiontestingvisible = true;
        }
        global_attritionvisible = true;
        global_attritiontestingvisible = true;
    } else if (((a$.urlprefix() == "ers.") || (a$.urlprefix() == "cthix.") || (a$.urlprefix().indexOf("make") >= 0) || (a$.urlprefix() == "ec2.")) && (($.cookie("ApmInDallas") == "") || ($.cookie("ApmInDallas") == null)) && (($.cookie("TP1Username") ==
            "jeffgack") || ($.cookie("TP1Username") == "syanez") || ($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin"))) {
        $("#cepointsmgrtab").show();
        appApmRankPoints.mgrinit();
        $("#attritiontab").show();
        global_attritionvisible = true;
        global_attritiontestingvisible = true;
    } else if (((a$.urlprefix() == "ers.") || (a$.urlprefix() == "cthix.") || (a$.urlprefix().indexOf("make") >= 0) || (a$.urlprefix() == "ec2.")) && ($.cookie("TP1Role") == "Management")) {
        $("#attritiontab").show();
        global_attritionvisible = true;
        global_attritiontestingvisible = true;
    } else if (((a$.urlprefix() == "ers.") || (a$.urlprefix() == "cthix.") || (a$.urlprefix().indexOf("make") >= 0) || (a$.urlprefix() == "ec2.")) && (($.cookie("TP1Role") == "Group Leader") || ($.cookie("TP1Role") == "Team Leader"))) {
        $("#attritiontab").show();
        global_attritionvisible = true;
    } else {
        $(".attrition-show").hide();
        $(".attrition-show-loc").hide();
    }
    if ((a$.urlprefix() == "cox.") || (a$.urlprefix() == "cox-test.") || (a$.urlprefix() == "cox-make40.")) {
        $("#GuideIframe").attr("src", "../applib/html/guides/cox-start-guide/index.html");
        $("#guidetab").show();
    }

    if (((a$.urlprefix() == "bgr.") || (a$.urlprefix() == "bgr-test.") || (a$.urlprefix() == "bgr-make40.")) && (($.cookie("TP1Username") == "amccord") || ($.cookie("TP1Username") == "jeffgack"))) {
        $("#cepointsmgrtab").show();
        appApmRankPoints.mgrinit();
    }

    $('.headericon-points').qtip({
        content: stgRankPointsLabel + ' Rewards! Click to open.'
    }).bind("click", function() {
        $("#cepointstab").show();
        $("#cepointslabel").trigger("click");
    });

    /*
    $('.headericon-message').qtip({
        content: 'Messages'
    }).bind("click", function() {
        window.location = "#Messaging";
    });
    */

    $('.headericon-chat').qtip({
        content: 'Chat'
    }).bind("click", function() {
        appApmMessaging.clickedchatbubble(this);
    });

    $('.headericon-graph,.leftpanel-icon-overview').qtip({
       
    }).bind("click", function() {
        window.location = "#GraphsReports";
    });

    $('.nav3-icon').qtip({
        content: 'Main Menu',
        position: {
            my: 'right center',
            at: 'left center'
        }
    });

    //$('.nav3linkhelp').qtip({ content: 'Click to be shown<br />the new location<br />of the menu.' });

    //TODO: This is a MESS and needs to be generalized.
    $('.headericon-import').qtip({
        content: 'Manual Import'
    }).bind("click", function() {
        $("#importframe").attr("src", "");
        if ((a$.urlprefix() == "ers.") || (a$.urlprefix() == "ec2.")) {
            //$("#importframe").attr("src", "//ers-import.acuityapmr.com/jq/import3.aspx");
            window.location = "//ers-import.acuityapmr.com/jq/import3.aspx";
        } else if (a$.urlprefix() == "ces.") {
            window.location = "//ces-import.acuityapmr.com/jq/import3.aspx";
        } else if (a$.urlprefix() == "chime.") {
            window.location = "//chime-import.acuityapmr.com/jq/import3.aspx";
        } else if (a$.urlprefix() == "cox.") {
            window.location = "//cox-import.acuityapmr.com/jq/import3.aspx";
        } else if (a$.urlprefix() == "bgr.") {
            window.location = "//bgr-import.acuityapmr.com/jq/import3.aspx";
        } else if (a$.urlprefix() == "bgr-test.") {
            window.location = "//bgr-test-import.acuityapmr.com/jq/import3.aspx";
        } else if (a$.urlprefix() == "vec.") {
            window.location = "//vec-import.acuityapmr.com/jq/import3.aspx";
        } else if (a$.urlprefix().indexOf("km2.DISABLE") >= 0) {
            window.location = "//km2-import.acuityapmr.com/jq/import3.aspx";
        } else if (a$.urlprefix() == "twc.") {
            window.location = "//twc-import.acuityapmr.com/jq/import3.aspx";
        } else if (a$.urlprefix() == "sprintgame.") {
            window.location = "//sprintgame-import.acuityapmr.com/jq/import3.aspx";
        } else {
            window.location = "//" + a$.urlprefix() + "acuityapmr.com/jq/import3.aspx";
            //$("#importframe").attr("src", "import3.aspx");
        }
        //window.location = "#Import";
    });

    /*
    $('.headericon-reload').qtip({
        content: 'Reload Dashboard'
    }).bind("click", function() {
        location.reload(false);
    });
    */

    $('.err-icon').qtip({
        content: 'Error (Click for details)'
    }).bind("click", function() {
        if ($(".err-container").first().is(":visible")) {
            $(".err-container").hide();
        } else {
            $(".err-container").show();
        }
    });
    $('.err-hide').bind("click", function() {
        $(".err-container").hide();
        $(".err-icon").hide();
    });
    $("#errsubmit").bind("click", function() {
        a$.submiterror($("#errinput").val());
        $(".err-container").hide();
        $(".err-icon").hide();
    });

    //Gauge thresholds (now handled with controlopts.performanceRanges setting)
    //For backward compatibility
    if ((a$.urlprefix() == "bgr.") || (a$.urlprefix() == "bgr-test.") || (a$.urlprefix() == "bgr-make40.")) {
        //alert("debug: Bluegreen performance ranges test (ignore this)");
        //controlopts.performanceRanges = [{ letter: "A", threshold: 9.0, pie: { low: 9.0, high: 10.0 }, color: "#019F01", stops: [[0, '#005B00'], [1, '#00AE00'], [2, '#00AE00']] }, { letter: "B", threshold: 7.0, pie: { low: 7.0, high: 9.0 }, color: "#EBE40C", stops: [[0, '#AF8013'], [1, '#FEFE00'], [2, '#FEFE00']] }, { letter: "C", threshold: 5.0, pie: { low: 5.0, high: 7.0 }, color: "#FF6600", stops: [[0, '#BB5500'], [1, '#FF6600'], [2, '#FF6600']] }, { letter: "D", threshold: -99999.0, pie: { low: 0.0, high: 5.0 }, color: "#990101", stops: [[0, '#5B0000'], [1, '#AC0000'], [2, '#AC0000']]}];
        controlopts.performanceRanges = [{
                letter: "A",
                threshold: 9.0,
                pie: {
                    low: 9.0,
                    high: 10.0
                },
                color: "#019F01",
                stops: [
                    [0, '#005B00'],
                    [1, '#00AE00'],
                    [2, '#00AE00']
                ]
            },
            {
                letter: "B+",
                threshold: 8.0,
                pie: {
                    low: 8.0,
                    high: 9.0
                },
                color: "#ffff99",
                textColor: "black", //MADELIVE
                stops: [
                    [0, '#ffff99'],
                    [1, '#ffff99'],
                    [2, '#ffff99']
                ]
            },
            {
                letter: "B",
                threshold: 7.0,
                pie: {
                    low: 7.0,
                    high: 8.0
                },
                color: "#ffff00",
                textColor: "black", //MADELIVE
                stops: [
                    [0, '#ffff00'],
                    [1, '#ffff00'],
                    [2, '#ffff00']
                ]
            },
            {
                letter: "C+",
                threshold: 6.0,
                pie: {
                    low: 6.0,
                    high: 7.0
                },
                color: "#ffcc00",
                textColor: "black", //MADELIVE
                stops: [
                    [0, '#ffcc00'],
                    [1, '#ffcc00'],
                    [2, '#ffcc00']
                ]
            },
            {
                letter: "C",
                threshold: 5.0,
                pie: {
                    low: 5.0,
                    high: 6.0
                },
                color: "#FF9900",
                stops: [
                    [0, '#ff9900'],
                    [1, '#ff9900'],
                    [2, '#ff9900']
                ]
            },
            {
                letter: "D",
                threshold: -99999.0,
                pie: {
                    low: 0.0,
                    high: 5.0
                },
                color: "#990101",
                stops: [
                    [0, '#5B0000'],
                    [1, '#AC0000'],
                    [2, '#AC0000']
                ]
            }
        ];
    } else if ((a$.urlprefix() == "chime.") || (a$.urlprefix() == "chime-test.") || (a$.urlprefix() == "chime-make40.")) {
        //alert("debug: Bluegreen performance ranges test (ignore this)");
        //controlopts.performanceRanges = [{ letter: "A", threshold: 9.0, pie: { low: 9.0, high: 10.0 }, color: "#019F01", stops: [[0, '#005B00'], [1, '#00AE00'], [2, '#00AE00']] }, { letter: "B", threshold: 7.0, pie: { low: 7.0, high: 9.0 }, color: "#EBE40C", stops: [[0, '#AF8013'], [1, '#FEFE00'], [2, '#FEFE00']] }, { letter: "C", threshold: 5.0, pie: { low: 5.0, high: 7.0 }, color: "#FF6600", stops: [[0, '#BB5500'], [1, '#FF6600'], [2, '#FF6600']] }, { letter: "D", threshold: -99999.0, pie: { low: 0.0, high: 5.0 }, color: "#990101", stops: [[0, '#5B0000'], [1, '#AC0000'], [2, '#AC0000']]}];
        controlopts.performanceRanges = [{
                letter: "A",
                threshold: 3.0,
                pie: {
                    low: 3.0,
                    high: 4.0
                },
                color: "#019F01",
                stops: [
                    [0, '#005B00'],
                    [1, '#00AE00'],
                    [2, '#00AE00']
                ]
            },
            {
                letter: "B",
                threshold: 2.0,
                pie: {
                    low: 2.0,
                    high: 3.0
                },
                color: "#ffff00",
                textColor: "black", //MADELIVE
                stops: [
                    [0, '#ffff00'],
                    [1, '#ffff00'],
                    [2, '#ffff00']
                ]
            },
            {
                letter: "C",
                threshold: 1.0,
                pie: {
                    low: 1.0,
                    high: 2.0
                },
                color: "#FF9900",
                stops: [
                    [0, '#ff9900'],
                    [1, '#ff9900'],
                    [2, '#ff9900']
                ]
            },
            {
                letter: "D",
                threshold: -99999.0,
                pie: {
                    low: 0.0,
                    high: 1.0
                },
                color: "#990101",
                stops: [
                    [0, '#5B0000'],
                    [1, '#AC0000'],
                    [2, '#AC0000']
                ]
            }
        ];
    } else if ((a$.urlprefix() == "cox.") || (a$.urlprefix() == "cox-test.") || (a$.urlprefix() == "cox-make40.")) {
        //alert("debug: Bluegreen performance ranges test (ignore this)");
        //controlopts.performanceRanges = [{ letter: "A", threshold: 9.0, pie: { low: 9.0, high: 10.0 }, color: "#019F01", stops: [[0, '#005B00'], [1, '#00AE00'], [2, '#00AE00']] }, { letter: "B", threshold: 7.0, pie: { low: 7.0, high: 9.0 }, color: "#EBE40C", stops: [[0, '#AF8013'], [1, '#FEFE00'], [2, '#FEFE00']] }, { letter: "C", threshold: 5.0, pie: { low: 5.0, high: 7.0 }, color: "#FF6600", stops: [[0, '#BB5500'], [1, '#FF6600'], [2, '#FF6600']] }, { letter: "D", threshold: -99999.0, pie: { low: 0.0, high: 5.0 }, color: "#990101", stops: [[0, '#5B0000'], [1, '#AC0000'], [2, '#AC0000']]}];
        controlopts.performanceRanges = [{
                letter: "A+",
                threshold: 6.0,
                pie: {
                    low: 6.0,
                    high: 7.0
                },
                color: "#00b0f0",
                stops: [
                    [0, '#00b0f0'],
                    [1, '#00b0f0'],
                    [2, '#00b0f0']
                ]
            },
            {
                letter: "A",
                threshold: 4.5,
                pie: {
                    low: 4.5,
                    high: 6.0
                },
                color: "#00b050",
                stops: [
                    [0, '#00b050'],
                    [1, '#00b050'],
                    [2, '#00b050']
                ]
            },
            {
                letter: "B",
                threshold: 3.0,
                pie: {
                    low: 3.0,
                    high: 4.5
                },
                color: "#92d050",
                stops: [
                    [0, '#92d050'],
                    [1, '#92d050'],
                    [2, '#92d050']
                ]
            },
            {
                letter: "C",
                threshold: 2.0,
                pie: {
                    low: 2.0,
                    high: 3.0
                },
                color: "#eaea04",
                textColor: "black", //MADELIVE
                stops: [
                    [0, '#eaea04'],
                    [1, '#eaea04'],
                    [2, '#eaea04']
                ]
            },
            {
                letter: "D",
                threshold: -99999.0,
                pie: {
                    low: 0.0,
                    high: 2.0
                },
                color: "#ff0000",
                stops: [
                    [0, '#ff0000'],
                    [1, '#ff0000'],
                    [2, '#ff0000']
                ]
            }
        ];
    } else if (debug_makingsprintgame || (a$.urlprefix() == "sprintgame.")) {
        //alert("debug: Bluegreen performance ranges test (ignore this)");
        //controlopts.performanceRanges = [{ letter: "A", threshold: 9.0, pie: { low: 9.0, high: 10.0 }, color: "#019F01", stops: [[0, '#005B00'], [1, '#00AE00'], [2, '#00AE00']] }, { letter: "B", threshold: 7.0, pie: { low: 7.0, high: 9.0 }, color: "#EBE40C", stops: [[0, '#AF8013'], [1, '#FEFE00'], [2, '#FEFE00']] }, { letter: "C", threshold: 5.0, pie: { low: 5.0, high: 7.0 }, color: "#FF6600", stops: [[0, '#BB5500'], [1, '#FF6600'], [2, '#FF6600']] }, { letter: "D", threshold: -99999.0, pie: { low: 0.0, high: 5.0 }, color: "#990101", stops: [[0, '#5B0000'], [1, '#AC0000'], [2, '#AC0000']]}];
        controlopts.performanceRanges = [{
            letter: "",
            threshold: -99999.0,
            pie: {
                low: 0.0,
                high: 10.0
            },
            color: "#ffff00",
            stops: [
                [0, '#937f0e'],
                [1, '#937f0e'],
                [2, '#937f0e']
            ]
        }, ];
    }

    //MADELIVE
    window.apmPerformanceColors = [];
    for (var i in controlopts.performanceRanges) {
        window.apmPerformanceColors.push({
            letter: controlopts.performanceRanges[i].letter, 
            threshold: controlopts.performanceRanges[i].threshold, 
            color: controlopts.performanceRanges[i].color,
            textColor: a$.exists(controlopts.performanceRanges[i].textColor) ? controlopts.performanceRanges[i].textColor : "#FEFEFE"
        });
    }

    window.apmPerformanceRanges = controlopts.performanceRanges; //?MADELIVE?

    $("#imageback").attr('src', '../applib/css/images/gaugeGEN.jpg');
    varigauge();

    $(".leftpanel-icons").show();
    $(".leftpanel").hide();

    try {
        resizedivs();
    } catch (err) {};

    $(".leftpanel-icon-filters,.leftpanel-icon-wrench").bind("click", function() {
         $(".leftpanel-icons").hide();
         $(".leftpanel").show();
         resizedivs();
         window.location = "#GraphsReports";
    });

    $(".leftpanel-icon-messaging").bind("click", function() {
         $(".leftpanel-icons").hide();
         $(".leftpanel").show();
         resizedivs();
         window.location = "#Messaging";
    });

    $(".leftpanel-icon-chat").bind("click", function() {
         appApmMessaging.clickedchatbubble(this);
    });

    $(".sidebar-collapse").bind("click", function() {
         $(".leftpanel-icons").show();
         $(".leftpanel").hide();
         resizedivs();
    });

    //Rank thresholds
    switch (a$.urlprefix()) {
        case "ers.":
        case "make.":
        case "cthix.":
            controlopts.rankopts = {
                xoffset: 10.0,
                barwidth: 260.0
            }
            controlopts.rankRanges = [ //COLORED Rank Ranges
                {
                    letter: "+3",
                    threshold: 0.80,
                    segment: {
                        low: 0.80,
                        high: 1.0
                    },
                    color: "#019F01",
                    stops: [
                        [0, '#005B00'],
                        [1, '#00AE00'],
                        [2, '#00AE00']
                    ]
                },
                {
                    letter: "+2",
                    threshold: 0.70,
                    segment: {
                        low: 0.70,
                        high: 0.80
                    },
                    color: "#91f977",
                    stops: [
                        [0, '#82d370'],
                        [1, '#72b763'],
                        [2, '#72b763']
                    ]
                },
                {
                    letter: "+1",
                    threshold: 0.6,
                    segment: {
                        low: 0.6,
                        high: 0.70
                    },
                    color: "#EBE40C",
                    stops: [
                        [0, '#AF8013'],
                        [1, '#FEFE00'],
                        [2, '#FEFE00']
                    ]
                },
                {
                    letter: "Base",
                    threshold: -99999.0,
                    segment: {
                        low: 0.0,
                        high: 0.6
                    },
                    color: "#FF6600",
                    stops: [
                        [0, '#d85600'],
                        [1, '#bc4800'],
                        [2, '#bc4800']
                    ]
                }
            ];
            controlopts.rankRangesLEGACY = [ //COLORED Rank Ranges, used in ERS prior to 2/1/2016.
                {
                    letter: "A+",
                    threshold: 0.95,
                    segment: {
                        low: 0.95,
                        high: 1.0
                    },
                    color: "#019F01",
                    stops: [
                        [0, '#005B00'],
                        [1, '#00AE00'],
                        [2, '#00AE00']
                    ]
                },
                {
                    letter: "A",
                    threshold: 0.80,
                    segment: {
                        low: 0.80,
                        high: 0.95
                    },
                    color: "#91f977",
                    stops: [
                        [0, '#82d370'],
                        [1, '#72b763'],
                        [2, '#72b763']
                    ]
                },
                {
                    letter: "B+",
                    threshold: 0.6,
                    segment: {
                        low: 0.6,
                        high: 0.80
                    },
                    color: "#EBE40C",
                    stops: [
                        [0, '#AF8013'],
                        [1, '#FEFE00'],
                        [2, '#FEFE00']
                    ]
                },
                {
                    letter: "B",
                    threshold: 0.1,
                    segment: {
                        low: 0.1,
                        high: 0.6
                    },
                    color: "#FF6600",
                    stops: [
                        [0, '#d85600'],
                        [1, '#bc4800'],
                        [2, '#bc4800']
                    ]
                },
                {
                    letter: "C",
                    threshold: -99999.0,
                    segment: {
                        low: 0.0,
                        high: 0.1
                    },
                    color: "#990101",
                    stops: [
                        [0, '#5B0000'],
                        [1, '#AC0000'],
                        [2, '#AC0000']
                    ]
                }
            ];
            controlopts.rankRangesGUATEMALABONUS = [ //COLORED Rank Ranges, used in ERS prior to 2/1/2016.
                {
                    letter: "B+2",
                    threshold: 0.80,
                    segment: {
                        low: 0.80,
                        high: 1.0
                    },
                    color: "#019F01",
                    stops: [
                        [0, '#005B00'],
                        [1, '#00AE00'],
                        [2, '#00AE00']
                    ]
                },
                {
                    letter: "B+1",
                    threshold: 0.70,
                    segment: {
                        low: 0.70,
                        high: 0.80
                    },
                    color: "#91f977",
                    stops: [
                        [0, '#82d370'],
                        [1, '#72b763'],
                        [2, '#72b763']
                    ]
                },
                {
                    letter: "B",
                    threshold: 0.6,
                    segment: {
                        low: 0.6,
                        high: 0.70
                    },
                    color: "#EBE40C",
                    stops: [
                        [0, '#AF8013'],
                        [1, '#FEFE00'],
                        [2, '#FEFE00']
                    ]
                },
                {
                    letter: "Non-Bonus",
                    threshold: -99999.0,
                    segment: {
                        low: 0.0,
                        high: 0.6
                    },
                    color: "#990101",
                    stops: [
                        [0, '#5B0000'],
                        [1, '#AC0000'],
                        [2, '#AC0000']
                    ]
                }
            ];
            controlopts.rankRangesNONPERFORMANCETREASUREHUNT = [{
                    letter: "A+",
                    threshold: 0.95,
                    segment: {
                        low: 0.95,
                        high: 1.0
                    },
                    color: "#221177",
                    stops: [
                        [0, '#221177'],
                        [1, '#FF6600'],
                        [2, '#FF6600']
                    ]
                }, //TODO: change color
                {
                    letter: "A",
                    threshold: 0.80,
                    segment: {
                        low: 0.80,
                        high: 0.95
                    },
                    color: "#1100BB",
                    stops: [
                        [0, '#1100BB'],
                        [1, '#00AE00'],
                        [2, '#00AE00']
                    ]
                },
                {
                    letter: "B+",
                    threshold: 0.6,
                    segment: {
                        low: 0.6,
                        high: 0.80
                    },
                    color: "#0033EE",
                    stops: [
                        [0, '#0033EE'],
                        [1, '#FEFE00'],
                        [2, '#FEFE00']
                    ]
                },
                {
                    letter: "Treasure Hunt: B",
                    threshold: 0.1,
                    segment: {
                        low: 0.1,
                        high: 0.6
                    },
                    color: "#5588EE",
                    stops: [
                        [0, '#5588EE'],
                        [1, '#FF6600'],
                        [2, '#FF6600']
                    ]
                }, //TODO: change color
                {
                    letter: "C",
                    threshold: -99999.0,
                    segment: {
                        low: 0.0,
                        high: 0.1
                    },
                    color: "#88AAFF",
                    stops: [
                        [0, '#88AAFF'],
                        [1, '#AC0000'],
                        [2, '#AC0000']
                    ]
                }
            ];
            controlopts.rankRangesNONPERFORMANCE = [{
                    letter: "A+",
                    threshold: 0.95,
                    segment: {
                        low: 0.95,
                        high: 1.0
                    },
                    color: "#221177",
                    stops: [
                        [0, '#221177'],
                        [1, '#FF6600'],
                        [2, '#FF6600']
                    ]
                }, //TODO: change color
                {
                    letter: "A",
                    threshold: 0.80,
                    segment: {
                        low: 0.80,
                        high: 0.95
                    },
                    color: "#1100BB",
                    stops: [
                        [0, '#1100BB'],
                        [1, '#00AE00'],
                        [2, '#00AE00']
                    ]
                },
                {
                    letter: "B+",
                    threshold: 0.6,
                    segment: {
                        low: 0.6,
                        high: 0.80
                    },
                    color: "#0033EE",
                    stops: [
                        [0, '#0033EE'],
                        [1, '#FEFE00'],
                        [2, '#FEFE00']
                    ]
                },
                {
                    letter: "B",
                    threshold: 0.1,
                    segment: {
                        low: 0.1,
                        high: 0.6
                    },
                    color: "#5588EE",
                    stops: [
                        [0, '#5588EE'],
                        [1, '#FF6600'],
                        [2, '#FF6600']
                    ]
                }, //TODO: change color
                {
                    letter: "C",
                    threshold: -99999.0,
                    segment: {
                        low: 0.0,
                        high: 0.1
                    },
                    color: "#88AAFF",
                    stops: [
                        [0, '#88AAFF'],
                        [1, '#AC0000'],
                        [2, '#AC0000']
                    ]
                }
            ];
            controlopts.varirankgauge({
                ranges: controlopts.rankRanges,
                paper: controlopts.rank_gpaper
            });
            break;
        case "km2.":
        case "km2-make40.":
            controlopts.rankopts = {
                xoffset: 10.0,
                barwidth: 260.0
            }
            controlopts.rankRanges = [{
                    letter: " ",
                    threshold: -99999,
                    segment: {
                        low: 0.0,
                        high: 1.0
                    },
                    color: "#5588EE",
                    stops: [
                        [0, '#5588EE'],
                        [1, '#FF6600'],
                        [2, '#FF6600']
                    ]
                }, //TODO: change color
            ];
            controlopts.varirankgauge({
                ranges: controlopts.rankRanges,
                paper: controlopts.rank_gpaper
            });
            break;
        default:
            controlopts.rankopts = {
                xoffset: 10.0,
                barwidth: 260.0
            }
            controlopts.rankRanges = [{
                    letter: "A+",
                    threshold: 0.95,
                    segment: {
                        low: 0.95,
                        high: 1.0
                    },
                    color: "#221177",
                    stops: [
                        [0, '#221177'],
                        [1, '#FF6600'],
                        [2, '#FF6600']
                    ]
                }, //TODO: change color
                {
                    letter: "A",
                    threshold: 0.80,
                    segment: {
                        low: 0.80,
                        high: 0.95
                    },
                    color: "#1100BB",
                    stops: [
                        [0, '#1100BB'],
                        [1, '#00AE00'],
                        [2, '#00AE00']
                    ]
                },
                {
                    letter: "B+",
                    threshold: 0.6,
                    segment: {
                        low: 0.6,
                        high: 0.80
                    },
                    color: "#0033EE",
                    stops: [
                        [0, '#0033EE'],
                        [1, '#FEFE00'],
                        [2, '#FEFE00']
                    ]
                },
                {
                    letter: "B",
                    threshold: 0.1,
                    segment: {
                        low: 0.1,
                        high: 0.6
                    },
                    color: "#5588EE",
                    stops: [
                        [0, '#5588EE'],
                        [1, '#FF6600'],
                        [2, '#FF6600']
                    ]
                }, //TODO: change color
                {
                    letter: "C",
                    threshold: -99999.0,
                    segment: {
                        low: 0.0,
                        high: 0.1
                    },
                    color: "#88AAFF",
                    stops: [
                        [0, '#88AAFF'],
                        [1, '#AC0000'],
                        [2, '#AC0000']
                    ]
                }
            ];
            controlopts.varirankgauge({
                ranges: controlopts.rankRanges,
                paper: controlopts.rank_gpaper
            });
            break;
    };

    Highcharts.wrap(Highcharts.Chart.prototype, 'redraw', function(proceed, animation) {
        proceed.call(this, animation);
        try {
            if (this.legend.options.floating) {
                var z = this.legend.group.element,
                    zzz = z.parentNode;
                zzz.removeChild(z);
                zzz.appendChild(z); //zindex in svg is determined by element order
            }
        } catch (e) {

        }
    });

    appApmDashboard.getdashboardsettings();
    appApmDashboard.setcontrolopts(controlopts);
    appApmReport.setDashboardFilters($("#StgDashboard select").val());

    appApmMessaging.getmessages();

    var chosenboxes = false;
    if ($.browser.msie) {
        if (($('#browserversion').html() == "isie8") || ($('#browserversion').html() == "isgtie8")) chosenboxes = true;
    } else chosenboxes = true;
    if (chosenboxes) {
        $(".chosen").data("Placeholder", "Select...").chosen();
        $(".chzn-select").chosen({
            disable_search_threshold: 5
        });
    }

    if ($.browser.msie) {
        if (($('#browserversion').html() == "isie8") || ($('#browserversion').html() == "isgtie8")) {} else {}
    }

    for (var i = 0; i < 16; i++) $("#needle" + i).rotate({
        animateTo: -2
    });
    $("#gaugescore").html("");
    $("#gaugelabel").html("");

    var settings = {
        tl: {
            radius: 20
        },
        tr: {
            radius: 20
        },
        bl: {
            radius: 20
        },
        br: {
            radius: 20
        },
        autoPad: true,
        validTags: ["div"]
    }

    appApmSettings.init({
        id: "StgAttritionSearch",
        ui: "slider"
    });
    $("#StgAttritionSearch select").bind("change", function() {
        switch ($(this).val()) {
            case "Hierarchy":
                $(".attrition-show-hi").show();
                $(".attrition-show-loc").hide();
                break;
            default:
                $(".attrition-show-hi").hide();
                $(".attrition-show-loc").show();
                break;
        }
    });
    appApmSettings.init({
        id: "StgAttritionTest",
        ui: "slider"
    });

    $("#StgAttritionTest select").bind("change", function() {
        switch ($(this).val()) {
            case "Supervisor":
                $(".attrition-show-supervisor").show();
                $(".attrition-show-hr").hide();
                appApmAttrition.showagents();
                break;
            default:
                $(".attrition-show-supervisor").hide();
                $(".attrition-show-hr").show();
                appApmAttrition.showagents();
                break;
        }
    });

    if (($.cookie("TP1Role") != "CSR")) { //($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin") || ($.cookie("TP1Username") == "jclark") || ($.cookie("TP1Username") == "bgill")) { //(($.cookie("TP1Username") == "jeffgack") || ($.cookie("TP1Username") == "dweather") || ($.cookie("TP1Username") == "guygray") || ($.cookie("TP1Username") == "llecomte")) {
        //$("#header_liActive a").html("Dashboard V2");
        //$("#header_liActive").after('<li><a target="_blank" href="'//' + a$.urlprefix() + 'acuityapm.com/default.aspx?dashboard=1">Dashboard V1</a></li>');
        if ((a$.urlprefix() == "chime.") || (a$.urlprefix() == "chime-make40.")) {
            $("#StgDashboard select option[value='Supervisor']").remove();
            $("#StgDashboard select option[value='Source']").remove();
            $("#StgDashboard select option[value='Attrition']").remove();
            $(".stgdashboard-override-hide").hide();
        } else if ((a$.urlprefix() == "ers.") || (a$.urlprefix().indexOf("make") >= 0)) {} else if (a$.urlprefix() == "cthix.") {
            $("#StgDashboard select option[value='Source']").remove();
            $("#StgDashboard select option[value='Attrition']").remove();
        } else {
            //$("#StgDashboard select option[value='Source']").remove();
            $("#StgDashboard select option[value='Attrition']").remove();
            //$(".stgdashboard-override-hide").hide();
            $("#StgDashboard").hide(); //For now just hide the whole dashboard slider if not ers. (Note: attrition-hide might mess this up in certain configurations).
        }
        if (a$.urlprefix() == "cthix.") {} else {
            if (($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin") || ($.cookie("TP1Role") == "Management") || ($.cookie("TP1Username") == "jclark") || ($.cookie("TP1Username") == "bgill")) {} else {
                //For special access to the Program/Financial Dashboard
            }
            //Just remove for everyone (except CTHIX) for now.
            $("#StgDashboard select option[value='Program']").remove();
            $("#StgDashboard select option[value='Financial']").remove();

        }

        appApmSettings.init({
            id: "StgDashboard",
            ui: "slider"
        });

        if ((a$.urlprefix() == "chime.") || (a$.urlprefix() == "chime-make40.")) {
            $("#StgDashboard").hide(); //For now just hide the whole dashboard slider if chime.
        }

        $("#spanDatefrom").bind("change", function() {
            alert("debug:spanDatefrom changed");
        });
        //$("#attritiontab").hide();

        if (a$.urlprefix() == "cthix-program.") { // CTHIX:
            appApmDashboard.setCookiePrefix("PD");
            $("#showpay").css("display", "none");
            $("#csrlabel").html("View");
        }

        $("#StgDashboard select").bind("change", function() {
            if (!$("#graphtab").eq(0).hasClass("ui-state-active")) {
                $('#graphlabel').trigger('click');
            }
            appApmReport.setDashboardFilters($(this).val());
        });
    }

    if ($.cookie("TP1Username") == "jeffgack") {
        $("#StgDeveloper").show();
        $("#experimental1").show();
    }

    appApmSettings.init({
        id: "StgNotifications",
        ui: "slider"
    });

    appApmSettings.init({
        id: "StgTooltips",
        ui: "iphoneswitch"
    });
    $("#StgTooltips select").bind("change", function() {
        if ($("#StgTooltips select").val() == "Off") {
            $('*').qtip('disable')
        } else {
            $('*').qtip('enable')
        }
    });

    if ((a$.urlprefix() == "ers.") || (a$.urlprefix() == "cthix.") || (a$.urlprefix().indexOf("make") >= 0) || (a$.urlprefix() == "ec2.")) {
        $("#StgRanking select").val("On");
        $("#StgRankCSRsBy select").val("ProjectLocation");
    }
    else if  (a$.urlprefix() == "cox.") {
		$("#StgRanking select").val("On");
		$("#StgRankCSRsBy select").val("PartnerTier");
    }

    $("#suptoolstab").hide();
    if ((a$.urlprefix() == "chime.") || (a$.urlprefix() == "chime-test.") || (a$.urlprefix() == "chime-make40.")) {
        //No tools tab.
    } else if ((a$.urlprefix() == "ers.") || (a$.urlprefix() == "cthix.") || (a$.urlprefix().indexOf("make") >= 0) || (a$.urlprefix() == "ec2.") || (a$.urlprefix() == "ces.")) {
        if ($.cookie("TP1Role") != "CSR") {
            switch ($.cookie("TP1Role")) {
                case "Team Leader":
                    $("#StgToolsLevel select").val("CSR");
                    $("#StgToolsLevel").hide();
                    break;
                case "Group Leader":
                    $("#StgToolsLevel select").val("Team");
                    $("#StgToolsLevel select option[value='Group']").remove();
                    $("#StgToolsLevel select option[value='Location']").remove();
                    break;
                default:
                    $("#StgToolsLevel select").val("Location");
                    break;
            }
            $("#StgSupTools select").val("On");
            $("#suptoolstab").show();
            //appApmSupTools.init();
        }
        //alert("debug:role cookie=" + $.cookie("TP1Role"));
        appApmSettings.init({
            id: "StgToolsLevel",
            ui: "slider"
        });
        $("#StgToolsLevel select").bind("change", function() {
            appApmSupTools.init();
        });
    }

    if (((a$.urlprefix() == "bgr.") || (a$.urlprefix() == "bgr-test.") || (a$.urlprefix() == "bgr-make40.")) && ($.cookie("TP1Username") == "amccord")) {
        $("#StgRanking select").val("On");
        $("#StgRankCSRsBy select").val("Project");
    }
    if (a$.urlprefix() == "vec.") {
        $("#StgRanking select").val("On");
        $("#StgRankCSRsBy select").val("Project");
    }
    if (a$.urlprefix() == "nex.") {
        $("#StgRanking select").val("On");
        $("#StgRankCSRsBy select").val("Location");
    }

    if ((a$.urlprefix() == "vec.") || (a$.urlprefix().indexOf("make") >= 0) || (a$.urlprefix() == "nex.")) {
        $("#StgBell select").val("On");
    }
    if ($.cookie("ApmInDallas") != null)
        if ($.cookie("ApmInDallas") != "") {
            $("#StgInTraining select").each(function() {
                $(this).val("Include");
            });
            $("#StgRanking select").val("Off");
        }
    appApmSettings.init({
        id: "StgInTraining",
        ui: "slider"
    });
    appApmSettings.init({
        id: "AttritionShowInTraining",
        shadow: "StgInTraining",
        ui: "combo"
    });
    /*
    appApmSettings.init({
        id: "ReportShowInTraining",
        shadow: "StgInTraining",
        ui: "combo"
    });
    */

    if ((a$.urlprefix() == "chime.") || (a$.urlprefix() == "chime-test.") || (a$.urlprefix() == "chime-make40.")) {
        //$("#StgInTraining").hide();
        $("#StgInTraining select").each(function() {
            $(this).val("Include");
        });
    }
    if ($.cookie("TP1Role") == "CSR") {
        $("#StgInTraining").hide();
    }

    appApmSettings.init({
        id: "StgGraphLabels",
        ui: "slider",
        textabove: "label",
        textbelow: "none"
    });
    $("#StgGraphLabels select").bind("change", function() {
        appApmDashboard.StgGraphLabels_update(0);
    });

    appApmSettings.init({
        id: "StgBarView",
        ui: "slider"
    });
    $("#StgBarView select").bind("change", function() {
        //alert("debug: StgBarView select=" + $("#StgBarView select").val());
        if ((document.getElementById("rdoBase").checked) || (document.getElementById("rdoPay").checked)) {
            appApmDashboard.StgBarView_update(0);
        }
    });

    if (a$.preview()) {
        appApmSettings.init({
            id: "StgShowSeries",
            ui: "slider"
        });
        $("#StgShowSeries select").bind("change", function() {
            if ((document.getElementById("rdoBase").checked) || (document.getElementById("rdoPay").checked)) {
                appApmDashboard.StgShowSeries_update(0);
            }
        });
    }

    appApmSettings.init({
        id: "StgFilterRefreshFrequency",
        ui: "slider"
    });
    $("#StgFilterRefreshFrequency select").bind("change", function() {
        appApmDashboard.setFilterPerfLevel($(this).val());
    });

    if (($.cookie("TP1Username") == "gsalvato")) { //Important to do before the init.
        $("#StgGraphRefreshFrequency select").val("Express");
        appApmDashboard.setDataPerfLevel("Express");
    }
    if (($.cookie("TP1Username") == "jclark") || ($.cookie("TP1Username") == "bgill")) {
        $("#StgGraphRefreshFrequency select").val("Always");
        appApmDashboard.setDataPerfLevel("Always");
    }

    appApmSettings.init({
        id: "StgGraphRefreshFrequency",
        ui: "slider"
    });
    $("#StgGraphRefreshFrequency select").bind("change", function() {
        appApmDashboard.setDataPerfLevel($(this).val());
    });

    appApmSettings.init({
        id: "StgRankCSRsBy",
        ui: "slider"
    });
    $("#StgRankCSRsBy select").bind("change", function() {
        appApmDashboard.setCSRRankingBy($(this).val());
    });

    if ((a$.urlprefix() == "ers.") || (a$.urlprefix() == "cthix.") || (a$.urlprefix().indexOf("make") >= 0) || (a$.urlprefix() == "ec2.")) {
        $("#StgRanking select").val("On");
        $("#StgRankCSRsBy select").val("ProjectLocation");
        appApmDashboard.setCSRRankingBy("ProjectLocation");
    }
    if (a$.urlprefix() == "nex.") {
        $("#StgRanking select").val("On");
        $("#StgRankCSRsBy select").val("Location");
        appApmDashboard.setCSRRankingBy("Location");
    }
    if (a$.urlprefix() == "vec.") {
        $("#StgRanking select").val("On");
        $("#StgRankCSRsBy select").val("Project");
        appApmDashboard.setCSRRankingBy("Project");
    }
    if (((a$.urlprefix() == "bgr.") || (a$.urlprefix() == "bgr-test.") || (a$.urlprefix() == "bgr-make40.")) && ($.cookie("TP1Username") == "amccord")) {
        $("#StgRanking select").val("On");
        $("#StgRankCSRsBy select").val("Project");
        appApmDashboard.setCSRRankingBy("Project");
    }

    $(".leftpanel").height(($(window).height() - 96) + 'px');

    function pad(number, length) {
        var str = '' + number;
        while (str.length < length) {
            str = '0' + str;
        }
        return str;
    }

    appApmSettings.init({
        id: "StgAdvancedTest",
        ui: "slider"
    });
    appApmSettings.init({
        id: "AdvancedNotifications",
        shadow: "StgNotifications",
        ui: "slider"
    });
    appApmSettings.init({
        id: "AdvancedNotifications2",
        shadow: "StgNotifications",
        ui: "slider"
    });
    appApmSettings.init({
        id: "AdvancedNotificationsCombo",
        shadow: "StgNotifications",
        ui: "combo"
    });
    appApmSettings.init({
        id: "AdvancedGraphLabels",
        shadow: "StgGraphLabels",
        ui: "combo"
    });

    $("#add").click(function() {
        var branches = $("<li><span class='folder'>New Sublist</span><ul>" +
            "<li><span class='file'>Item1</span></li>" +
            "<li><span class='file'>Item2</span></li></ul></li>").appendTo("#projecttree");
        $("#projecttree").treeview({
            add: branches
        });
        return false;
    });

    //Role-specific modifications
    switch ($.cookie("TP1Role")) {
        case "CSR":
            $("#monitorlink").attr("href", "//acuityapm.com/monitor/monitor_review.aspx");
            $("#import_li").hide();
            /* //Good stuff, but not what they wanted.
                                    if ((a$.urlprefix() == "chime.") || (a$.urlprefix() == "chime-test.") || (a$.urlprefix() == "chime-make40.")) {
    									$("#StgSupervisorFilters").show();
	    								$("#StgSupervisorFilters_label").show();
                                        $("#StgSupervisorFilters select > option").eq(0).html("View Your Statistics");
                                        $("#StgSupervisorFilters select > option").eq(0).attr("value","Self");
		    							appApmSettings.init({
			    							id: "StgSupervisorFilters",
				    						ui: "slider"
					    				});
						    			$("#StgSupervisorFilters select").bind("change", function() {
							    			appApmDashboard.StgSupervisorFilters_update(0);
								    	});
                                        $("#StgSupervisorFilters_label").html("Consultant Filters");
                                    }
                                    */
            break;
        case "Team Leader":
        case "Group Leader":
            if ((a$.urlprefix() == "cox.") || (a$.urlprefix().indexOf("cox-make40") >= 0)) {
            }
            else {
                $("#StgSupervisorFilters").show();
                $("#StgSupervisorFilters_label").show();
                appApmSettings.init({
                    id: "StgSupervisorFilters",
                    ui: "slider"
                });
                $("#StgSupervisorFilters select").bind("change", function() {
                    appApmDashboard.StgSupervisorFilters_update(0);
                });
            }
        default:
            break;
    }

    //New Feature Releases
    switch (a$.urlprefix()) {
        case "ers.":
        case "cthix.":
        case "ers-alpha.":
            $("#scoreeditor_li").hide();
            $("#attendancetracker_li").hide();
            if (($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin") || ($.cookie("TP1Username") == "disloan") || ($.cookie("TP1Username") == "rleal") || ($.cookie("TP1Username") == "pgromley")) {
                $(".headericon-import").show();
            } else {
                //$(".headericon-chat").hide();
            }
            $(".help").hide();
            break;
        case "chime.":
        case "chime-test.":
        case "chime-make40.":
        case "cox.":
        case "ces.":
        case "bgr.":
        case "bgr-test.":
        case "nex.":
        case "vec.":
        case "tsd.":
        case "aldi.":
        case "rcm.":
        case "make.":
        case "ob24.":
        case "km2.":
        case "km2-make40.":
        case "twc.":
        case "sprintgame.":
        case "cthix.":
            $("#scoreeditor_li").hide();
            if ($.cookie("TP1Role") == "CSR") {
                $("#attendancetracker_li").hide();
            } else {
                $("#attendancetracker_li").show();
            }
            $("#StgFilterRefreshFrequency select").val("Always");
            $("#StgGraphRefreshFrequency select").val("Always");
            appApmDashboard.setDataPerfLevel("Always"); //Shouldn't need to do this...

            if (($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin") || ($.cookie("TP1Username") == "disloan") || ($.cookie("TP1Username") == "rleal")) {
                $(".headericon-import").show();
            }
            if (a$.urlprefix() == "km2.") {
                $(".headericon-import").hide();
            }
            if ((a$.urlprefix() == "rcm.") && ($.cookie("TP1Role") == "Management")) {
                $(".headericon-import").show();
            }
            $(".help").hide();
            break;
        case "devHOLD.":
            $(".headericon-import").show();
        default:
            $("#scoreeditor_li").show();
            $("#attendancetracker_li").hide();
    }
    appApmSettings.init({
        id: "StgHireDatesFilter",
        ui: "slider"
    });

    if ((a$.urlprefix() == "chime.") || (a$.urlprefix() == "chime-test.") || (a$.urlprefix() == "chime-make40.")) {
        $("#StgHireDatesFilter").hide();
    }

    if ($.cookie("TP1Role") == "CSR") {
        $("#StgHireDatesFilter").hide();
    }

    $("#StgHireDatesFilter select").bind("change", function() {
        if ($(this).val() == "Filter On") $("#hiredatelabel,#hiredatefilter").show();
        else $("#hiredatelabel,#hiredatefilter").hide();
    });

    appApmSettings.init({
        id: "StgEditing",
        ui: "iphoneswitch"
    });
    appApmSettings.init({
        id: "StgRanking",
        ui: "iphoneswitch"
    });
    appApmSettings.init({
        id: "StgBell",
        ui: "iphoneswitch"
    });
    appApmSettings.init({
        id: "StgSupTools",
        ui: "iphoneswitch"
    });
    appApmSettings.init({
        id: "StgInjDev",
        ui: "iphoneswitch"
    });
    //$("#tabs").css("position", "relative");
    $("#tabs").append('<div class="admin-editing-wrapper stg-field"><label id="AdminEditingLabel">Editing:</label><span id="AdminEditing" class="stg"></span></div>');
    appApmSettings.init({
        id: "AdminEditing",
        shadow: "StgEditing",
        ui: "iphoneswitch"
    });

    if (($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin") || ($.cookie("TP1Role") == "Management") || ($.cookie("TP1Username") == "sfletcher")) {
        $("#scoring_li").show();
        $("#StgEditing select").val("On");
    } else if (($.cookie("TP1Role") == "Group Leader") || ($.cookie("TP1Role") == "Team Leader")) {
        $("#scoring_li").show();
        $("#StgEditing select").val("Off");
        $("#StgEditingDiv").hide();
        $("#AdminEditing,#AdminEditingLabel").hide();
    }

    if (debug_makingsprintgame || (a$.urlprefix() == "sprintgame.")) {
        if (!(($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin"))) {
            $("#scoring_li").find("*").css("color", "lightgray").css("cursor", "wait").attr("href", "#");
            $("#admin_li").find("*").css("color", "lightgray").css("cursor", "wait").attr("href", "#");
            $("#monitor_li").find("*").css("color", "lightgray").css("cursor", "wait").attr("href", "#");
            $("#reports_normal_li,#reports_restricted_li").find("*").css("color", "lightgray").css("cursor", "wait").attr("href", "#");
            $("#import_li").find("*").css("color", "lightgray").css("cursor", "wait").attr("href", "#");

            if (a$.urlprefix().indexOf("km2") >= 0) {
                $("#changepassword_li").hide();
            }
        }
    } else if (a$.urlprefix().indexOf("km2") >= 0) {
        if (!(($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin") || ($.cookie("TP1Role") == "Management") || ($.cookie("TP1Role") == "Quality Assurance"))) {
            if (!(($.cookie("TP1Role") == "Team Leader") || ($.cookie("TP1Role") == "Management") || ($.cookie("TP1Role") == "Group Leader"))) {
                $("#scoring_li").find("*").css("color", "lightgray").css("cursor", "wait").attr("href", "#");
            }
            $("#admin_li").find("*").css("color", "lightgray").css("cursor", "wait").attr("href", "#");
            $("#monitor_li").find("*").css("color", "lightgray").css("cursor", "wait").attr("href", "#");
            $("#reports_normal_li,#reports_restricted_li").find("*").css("color", "lightgray").css("cursor", "wait").attr("href", "#");
            $("#import_li").find("*").css("color", "lightgray").css("cursor", "wait").attr("href", "#");
            if (a$.urlprefix().indexOf("km2") >= 0) {
                $("#changepassword_li").hide();
            }
        }
    } else if (a$.urlprefix().indexOf("chime") >= 0) {
        //if (!(($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin") || ($.cookie("TP1Role") == "Management") || ($.cookie("TP1Role") == "Quality Assurance"))) {
        if (!(($.cookie("TP1Role") == "Team Leader") || ($.cookie("TP1Role") == "Management") || ($.cookie("TP1Role") == "Group Leader"))) {
            //$("#scoring_li").find("*").css("color", "lightgray").css("cursor", "wait").attr("href", "#");
        }
        $("#classicdashboard_li").hide().find("*").css("color", "lightgray").css("cursor", "wait").attr("href", "#");
        $("#admin_li").hide().find("*").css("color", "lightgray").css("cursor", "wait").attr("href", "#").hide();
        $("#monitor_li").hide().find("*").css("color", "lightgray").css("cursor", "wait").attr("href", "#");
        $("#reports_normal_li,#reports_restricted_li").hide().find("*").css("color", "lightgray").css("cursor", "wait").attr("href", "#");
        $("#import_li").hide().find("*").css("color", "lightgray").css("cursor", "wait").attr("href", "#");
        $("#attendancetracker_li").hide().find("*").css("color", "lightgray").css("cursor", "wait").attr("href", "#");
        /*
									if (a$.urlprefix().indexOf("chime") >= 0) {
										$("#changepassword_li").hide();
									}
                                    */
        //}
    }
    if (a$.urlprefix() == "sprintgame.") {
        $("#StgBarView select").val("Series Colors");
        $("#StgBarView").hide();
        if (!($.cookie("TP1Role") == "Admin")) {
            $("#StgEditing select").val("Off");
        }
    }

    var filteredproject = false;
    if ($.cookie("ApmProjectFilter") != null) {
        if (($.cookie("ApmProjectFilter") != "none") && ($.cookie("ApmProjectFilter") != "") && ($.cookie("ApmProjectFilter") != "ALL-READONLY")) {
            filteredproject = true;
            $("#showpay").hide();
        }
        if (($.cookie("ApmProjectFilter") != "none") && ($.cookie("ApmProjectFilter") != "")) {
            filteredproject = true;
            $("#header_ul li").each(function() {
                switch ($(this).children().first().html()) {
                    case "Dashboard":
                        break;
                    case "Reports":
                        //$(this).children().first().attr("href", '//' + a$.urlprefix() + 'acuityapmr.com/jq/TP1ReportsMenu.aspx?roleset=&project=' + $.cookie("ApmProjectFilter") + '&projectfilter=' + $.cookie("ApmProjectFilter"));
                        //break;
                    default:
                        $(this).hide();
                }
            });
            //Added 8/13/2014
            $("#admin_li,#reports_normal_li,#import_li,#scoreeditor_li,#attendancetracker_li,#scoring_li").hide();
            $("#reports_restricted_li").show();
        }
    }
    if (!filteredproject) {
        $('.headericon-chat').show();
    }

    if (a$.urlprefix() == "ces.") {
        $(".headericon-chat").hide();
    }

    $("#StgEditing select").bind("change", function() {
        var setting = $(this).val();
        $(".edit-span").each(function() {
            var hold;
            if (setting == "On") {
                hold = $(this).html();
                $(this).html('<input type="text" value="' + hold + '"/>');
            } else {
                hold = $(" input", this).val();
                $(this).html(hold);
            }
        });
        $(".stg-span").each(function() {
            if (setting == "On") {
                $(this).children().each(function() {
                    $(this).show();
                });
                $(" > span > span", this).hide();
                $(" > label > span", this).remove();
            } else {
                $(this).children().each(function() {
                    $(this).hide();
                });
                //$(" > label", this).html($(" > label", this).html() & "<span>HELLO!</span>");
                $(" > label", this).append("<span>" + $(" > span > span", this).html() + "</span>");
                $(" > label", this).show();

                //$(" > span > span", this).show();
            }
        });
    });

    $("#btnSEView").bind("click", function() {
        appApmScoreEditing.btnView("scoreeditorarea");
    });

    appApmDashboard.setClientLabels(); //Doing this again.

    // Creates canvas 320 � 200 at 10, 50

    /*
    gaugesdiv
    messagediv
    filterdiv
    settingsdiv
    */
    usehash();

    $(window).bind("hashchange", function() {
        usehash();
    });


    //},10000); //remainder of setTimeout

    /* doesn't work.
    Object.defineProperty(document.getElementById('rdoBase'),'checked', {
        set: function(x) {
            this.checked=x;
        }
    });
    */

    if ((a$.urlprefix() == "cox.") || (a$.urlprefix().indexOf("cox-make40") >= 0)) {
        if (($.cookie("TP1Role") == "Team Leader")||($.cookie("TP1Role") == "CSR")) {
            setTimeout(setsupfilter,8000);
            function setsupfilter() {
                if ($.cookie("TP1Role") == "Team Leader") {
                    $("#StgSupervisorFilters select").val("Location");
                }
                else if ($.cookie("TP1Role") == "CSR") {
                    $("#StgSupervisorFilters select").val("Team");
                }
				appApmDashboard.StgSupervisorFilters_update(0);
            }
        }
    }

}; //End of .ready ?

function animatelogo() {
    if (false) { //(true || a$.preview()) {
        paper.clear();
        if ((pageTheme == "Acuity3") || (pageTheme == "Shutterfly")) {
            var lof; //logo offset
            var red_start_rad, red_final_rad;
            var blue_rad;
            var lofnb;
            var loft;
            var yellow_start_rad, yellow_final_rad;
            if ((a$.gup("notheme") == "") && ((a$.urlprefix() == "ers.") || (a$.urlprefix() == "rcm.") /* || (a$.urlprefix() == "ces.") */ )) {
                $(".logo").css("top", "0px").css("height", "70px").css("width", "450px").css("background-repeat", "no-repeat").css("background-height", "no-repeat");
                $(".logo").css("background-image", 'url("../App_Themes/Acuity3/images/CESCORE_AcuityD.png")');
                $(".heading").css("top", "45px").css("left", "320px");
                return;
            } else if ((a$.gup("theme").toLowerCase() == "sprint") || debug_makingsprintgame || (a$.urlprefix().indexOf("sprintgame.") >= 0)) {
                $(".logo").css("top", "0px").css("height", "70px").css("width", "502px"); //.css("background-size", "91%");
                $(".logo").css("background-image", 'url("../App_Themes/Acuity3/images/Sprint_LOC_logo_jeffsMod2.png")');
                $(".app-header").removeClass("gradient-lightest");
                $(".heading").css("top", "45px").css("left", "320px").hide();
                return;
            } else if ((a$.gup("notheme") == "") && ((a$.urlprefix() == "chime.") || (a$.urlprefix() == "chime-make40."))) {
                $(".logo").css("top", "0px").css("height", "70px").css("width", "150px").css("background-repeat", "no-repeat").css("background-height", "no-repeat");
                $(".logo").css("background-image", 'url("../App_Themes/Acuity3/images/chime-header-logo.svg")');
                $(".logo").css("background-position", 'left');
                $(".logo").css("top", '5px');
                $(".heading").css("top", "45px").css("left", "320px");
                //$(".logo").prepend('<div style="font-size: 30px;position:absolute;top:32px;left:145px;">Score</div>');
                return;
            } else if (false) { //Animated Acuity Logo with CEScore
                $(".logo").css("top", "0px").css("height", "70px").css("width", "387px").css("background-repeat", "no-repeat");
                //Weirdest thing ever!!
                $(".logo").css("background-image", 'url("../App_Themes/Acuity3/images/CESCORE_AcuityC.png")');
                $(".heading").css("top", "45px").css("left", "320px");
                lof = [195, -35];
                red_start_rad = [43, 9];
                red_final_rad = [23, 9];
                blue_rad = [33, 12];
                lofnb = [10, 5];
                yellow_start_rad = [123, 93];
                yellow_final_rad = [28, 10];
                loft = [-20, 7];
            } else {
                $(".logo").css("width", "175px")
                lof = [4, -4];
                red_start_rad = [83, 18];
                red_final_rad = [43, 18];
                blue_rad = [61, 23];
                lofnb = [0, 0];
                yellow_start_rad = [153, 123];
                yellow_final_rad = [53, 23];
                loft = [0, 0];
            }

            function radialpoint(o) {
                var rad = o.angle * (Math.PI / 180.0);
                return [o.origin[0] + (o.radius * Math.cos(rad)), o.origin[1] + (o.radius * Math.sin(rad))];
            }

            function bandpath(o) {
                var so = radialpoint({
                    origin: o.origin,
                    radius: o.radii[0],
                    angle: o.sweep[0]
                });
                var eo = radialpoint({
                    origin: o.origin,
                    radius: o.radii[0],
                    angle: o.sweep[1]
                });
                var si = radialpoint({
                    origin: o.origin,
                    radius: o.radii[1],
                    angle: o.sweep[0]
                });
                var ei = radialpoint({
                    origin: o.origin,
                    radius: o.radii[1],
                    angle: o.sweep[1]
                });
                return "M " + si[0] + "," + si[1] + "L" + so[0] + "," + so[1] + " A" + o.radii[0] + "," + o.radii[0] + " 0 0 0 " + eo[0] + "," + eo[1] + " L" + ei[0] + "," + ei[1] + " A" + o.radii[1] + "," + o.radii[1] + " 0 0 1 " + si[0] + "," + si[1] +
                    "z";
            }

            function logoslice(o) {
                var slice = paper.path(bandpath(o)); //just passing the input object.
                slice.attr({
                    fill: o.color,
                    stroke: "white",
                    "stroke-width": 2,
                    "stroke-opacity": 1,
                    "fill-opacity": o.opacity
                });
                return slice;
            }
            var red = logoslice({
                origin: [0 + lof[0], 66 + lof[1]],
                radii: red_start_rad,
                color: "#D3344A",
                sweep: [240, 179],
                opacity: 1.0
            }); //red
            var redfinal = bandpath({
                origin: [219 + lof[0], 66 + lof[1]],
                radii: red_final_rad,
                color: "#D3344A",
                sweep: [240, 179],
                opacity: 1.0
            });
            red.animate({
                path: redfinal
            }, 3000, ">");

            var blue = logoslice({
                origin: [196 + lof[0] + lofnb[0], 60 + lof[1] + lofnb[1]],
                radii: blue_rad,
                color: "#0076BF",
                sweep: [71, 10],
                opacity: 1.0
            }); //blue
            var bluefinal = bandpath({
                origin: [196 + lof[0] + lofnb[0], 60 + lof[1] + lofnb[1]],
                radii: blue_rad,
                color: "#0076BF",
                sweep: [0, 297],
                opacity: 1.0
            }); //blue
            blue.animate({
                path: bluefinal
            }, 3500, ">");

            var yellow = logoslice({
                origin: [219 + lof[0], 66 + lof[1]],
                radii: yellow_start_rad,
                color: "#FAD148",
                sweep: [275, 213],
                opacity: 0.8
            }); //yellow
            var yellowfinal = bandpath({
                origin: [219 + lof[0], 66 + lof[1]],
                radii: yellow_final_rad,
                color: "#FAD148",
                sweep: [275, 213],
                opacity: 1.0
            }); //yellow
            yellow.animate({
                path: yellowfinal
            }, 5000, "bounce");

            paper.text(265 + lof[0] + loft[0], 55 + lof[1] + loft[1], "TM");
        }
    }
}

//{ letter: "A+", threshold: 0.95, segment: { low: 0.95, high: 1.0 }, color: "#FF6600", stops: [[0, '#BB5500'], [1, '#FF6600'], [2, '#FF6600']] }, //TODO: change color

function varigauge() {
    $("#gaugeover").show();
    var SCOREBASIS = 10.0;
    if ((a$.urlprefix() == "chime.") || (a$.urlprefix() == "chime-test.") || (a$.urlprefix() == "chime-make40.")) {
        SCOREBASIS = 4.0;
    }
    if ((a$.urlprefix() == "cox.") || (a$.urlprefix() == "cox-test.") || (a$.urlprefix() == "cox-make40.")) {
        SCOREBASIS = 7.0;
    }
    var gpaper = Raphael("gaugeover", 280, 200);
    var lof;
    var rad;

    lof = [141, 160];
    rad = [103, 26];

    function radialpoint(o) {
        var rad = o.angle * (Math.PI / 180.0);
        return [o.origin[0] + (o.radius * Math.cos(rad)), o.origin[1] + (o.radius * Math.sin(rad))];
    }

    function bandpath(o) {
        var so = radialpoint({
            origin: o.origin,
            radius: o.radii[0],
            angle: o.sweep[0]
        });
        var eo = radialpoint({
            origin: o.origin,
            radius: o.radii[0],
            angle: o.sweep[1]
        });
        var si = radialpoint({
            origin: o.origin,
            radius: o.radii[1],
            angle: o.sweep[0]
        });
        var ei = radialpoint({
            origin: o.origin,
            radius: o.radii[1],
            angle: o.sweep[1]
        });
        var laf = "0"; //large arc flag.
        if (a$.exists(o.largearc)) laf = "1";
        return "M " + si[0] + "," + si[1] + "L" + so[0] + "," + so[1] + " A" + o.radii[0] + "," + o.radii[0] + " 0 " + laf + " 0 " + eo[0] + "," + eo[1] + " L" + ei[0] + "," + ei[1] + " A" + o.radii[1] + "," + o.radii[1] + " 0 0 1 " + si[0] + "," + si[1] +
            "z";
    }

    function logoslice(o) {
        var slice = gpaper.path(bandpath(o)); //just passing the input object.
        slice.attr({
            fill: "30-" + o.dim + "-" + o.color + ":40-" + o.color,
            stroke: "white",
            "stroke-width": 2,
            "stroke-opacity": 0,
            "fill-opacity": o.opacity
        });
        return slice;
    }

    //TEST

    if (true) { //((a$.urlprefix() == "chime.") || (a$.urlprefix() == "chime-test.") || (a$.urlprefix() == "chime-make40.")) {
        var radnums = [120, 104];
        for (var i = 1; i <= 1; i++) {
            var color = logoslice({
                origin: lof,
                radii: radnums,
                largearc: true,
                dim: '#000000',
                color: '#000000',
                //sweep: [180.0 + ((10.0 / SCOREBASIS) * 180.0), 180.0 + ((0.0 / SCOREBASIS) * 180.0)],
                sweep: [5.0, 175.0],
                opacity: 1.0
            });
            var HighNumber = SCOREBASIS;
            for (var n = 0; n <= HighNumber; n++) {
                var letter = gpaper.text(
                    lof[0] + (radnums[1] + 9) * Math.cos((180.0 + ((n / HighNumber) * 180.0)) * (Math.PI / 180.0)),
                    lof[1] + (radnums[1] + 9) * Math.sin((180.0 + ((n / HighNumber) * 180.0)) * (Math.PI / 180.0)),
                    "" + n);
                //alert("debug:lgetter=" + n);
                letter.attr({
                    fill: "white",
                    "font-size": "11"
                });
            }

            /*
								    var final = bandpath({
									    origin: lof,
									    radii: radnums,
									    color: '#0000FF',
									    //sweep: [180.0 + ((10.0 / SCOREBASIS) * 180.0), 180.0 + ((0.0 / SCOREBASIS) * 180.0)],
									    sweep: [10.0, 180.0],
									    opacity: 1.0
								    });
								    color.animate({
									    path: final
								    }, 0, ">");
                                    */
        }
    }

    for (var i = controlopts.performanceRanges.length - 1; i >= 0; i--) {
        var color = logoslice({
            origin: lof,
            radii: rad,
            dim: controlopts.performanceRanges[i].stops[0][1],
            color: controlopts.performanceRanges[i].color,
            sweep: [180.0 + ((controlopts.performanceRanges[i].pie.high / SCOREBASIS) * 180.0), 180.0 + ((controlopts.performanceRanges[i].pie.low / SCOREBASIS) * 180.0)],
            opacity: 1.0
        });
        var final = bandpath({
            origin: lof,
            radii: rad,
            color: controlopts.performanceRanges[i].color,
            sweep: [180.0 + ((controlopts.performanceRanges[i].pie.high / SCOREBASIS) * 180.0), 180.0 + ((controlopts.performanceRanges[i].pie.low / SCOREBASIS) * 180.0)],
            opacity: 1.0
        });
        color.animate({
            path: final
        }, 0, ">");
        var letter = gpaper.text(lof[0] + ((rad[0] / 1.5) * Math.cos((180.0 + ((controlopts.performanceRanges[i].pie.low / SCOREBASIS) * 180.0) + ((((controlopts.performanceRanges[i].pie.high - controlopts.performanceRanges[i].pie.low) / SCOREBASIS) * 180.0) /
                2.0)) * (Math.PI / 180.0))),
            lof[1] + ((rad[0] / 1.5) * Math.sin((180.0 + ((controlopts.performanceRanges[i].pie.low / SCOREBASIS) * 180.0) + ((((controlopts.performanceRanges[i].pie.high - controlopts.performanceRanges[i].pie.low) / SCOREBASIS) * 180.0) / 2.0)) * (Math.PI /
                180.0))), controlopts.performanceRanges[i].letter);
        if ((a$.urlprefix() == "bgr.") || (a$.urlprefix() == "bgr-test.") || (a$.urlprefix() == "bgr-make40.") || (a$.urlprefix() == "chime.") || (a$.urlprefix() == "chime-test.") || (a$.urlprefix() == "chime-make40.")) {
            letter.attr({
                fill: "black",
                "font-size": "18"
            });
        } else {
            letter.attr({
                fill: "white",
                "font-size": "22"
            });
        }
    }
    /*
    var red = logoslice({ origin: lof, radii: rad, color: "#990101", sweep: [180.0 + ((controlopts.Bthreshold / SCOREBASIS) * 180.0), 180], opacity: 1.0 }); //red
    var redfinal = bandpath({ origin: lof, radii: rad, color: "#990101", sweep: [180.0 + ((controlopts.Bthreshold / SCOREBASIS) * 180.0), 180], opacity: 1.0 });
    red.animate({ path: redfinal }, 0, ">");
    var letterC = gpaper.text(lof[0] + ((rad[0] / 1.5) * Math.cos((180.0 + (((controlopts.Bthreshold / SCOREBASIS) * 180.0) / 2.0)) * (Math.PI / 180.0))),
            lof[1] + ((rad[0] / 1.5) * Math.sin((180.0 + (((controlopts.Bthreshold / SCOREBASIS) * 180.0) / 2.0)) * (Math.PI / 180.0))), "C");
    letterC.attr({ fill: "white", "font-size": "22"});

    var yellow = logoslice({ origin: lof, radii: rad, color: "#EBE40C", sweep: [180.0 + ((controlopts.Athreshold / SCOREBASIS) * 180.0), 180.0 + ((controlopts.Bthreshold / SCOREBASIS) * 180.0)], opacity: 1.0 }); //red
    var yellowfinal = bandpath({ origin: lof, radii: rad, color: "#EBE40C", sweep: [180.0 + ((controlopts.Athreshold / SCOREBASIS) * 180.0), 180.0 + ((controlopts.Bthreshold / SCOREBASIS) * 180.0)], opacity: 1.0 });
    yellow.animate({ path: yellowfinal }, 0, ">");
    var letterB = gpaper.text(lof[0] + ((rad[0] / 1.5) * Math.cos((180.0 + ((controlopts.Bthreshold / SCOREBASIS) * 180.0) + ((((controlopts.Athreshold - controlopts.Bthreshold) / SCOREBASIS) * 180.0) / 2.0)) * (Math.PI / 180.0))),
            lof[1] + ((rad[0] / 1.5) * Math.sin((180.0 + ((controlopts.Bthreshold / SCOREBASIS) * 180.0) + ((((controlopts.Athreshold - controlopts.Bthreshold) / SCOREBASIS) * 180.0) / 2.0)) * (Math.PI / 180.0))), "B");
    letterB.attr({ fill: "white", "font-size": "22" });
    var green = logoslice({ origin: lof, radii: rad, color: "#019F01", sweep: [0, 180.0 + ((controlopts.Athreshold / SCOREBASIS) * 180.0)], opacity: 1.0 }); //red
    var greenfinal = bandpath({ origin: lof, radii: rad, color: "#019F01", sweep: [0, 180.0 + ((controlopts.Athreshold / SCOREBASIS) * 180.0)], opacity: 1.0 });
    green.animate({ path: greenfinal }, 0, ">");
    var letterA = gpaper.text(lof[0] + ((rad[0] / 1.5) * Math.cos((180.0 + ((controlopts.Athreshold / SCOREBASIS) * 180.0) + ((((10.0 - controlopts.Athreshold) / SCOREBASIS) * 180.0) / 2.0)) * (Math.PI / 180.0))),
            lof[1] + ((rad[0] / 1.5) * Math.sin((180.0 + ((controlopts.Athreshold / SCOREBASIS) * 180.0) + ((((10.0 - controlopts.Athreshold) / SCOREBASIS) * 180.0) / 2.0)) * (Math.PI / 180.0))), "A");
    letterA.attr({ fill: "white", "font-size": "22" });
    */
}
//END SCOREBASIS 10.0

function usehash() {
    $("#gaugesdiv,#messagediv,#datasourcediv,#filterdiv,#dashboardcontroldiv,#scoreeditorcontroldiv,#settingsdiv,#scoringdiv,#companydiv,#modeldiv,#projectdiv,#kpidiv,#subkpidiv,#manualimportdiv").hide();
    $("#graphtab,#graphsubtab,#tabletab,#messagetab,#advancedsettingstab,#companytab,#modeltab,#projecttab,#kpitab,#subkpitab,#userpreferencestab,#scoreeditortab,#manualimporttab").hide();
    $(".admin-editing-wrapper").hide();    
    if ((a$.urlprefix() == "cox.") || (a$.urlprefix() == "cox-make40.")) {
        $(".settingsdiv-wrapper").hide();
    }

    switch (location.hash) {
        case "#Messaging":
            if ((a$.urlprefix().indexOf("chime-make40.") >= 0) || (a$.urlprefix() == "chime.")) {
                if ($.cookie("TP1Role") == "CSR") {
                    location.hash = "";
                    return;
                }
            }
            $("#messagediv").show();
            $(".heading").html("Messaging");
            $('#messagetab').show();
            $('#messageslabel').trigger('click');
            break;
        case "#GraphAppearance":
            $("#settingsdiv").show();
            $(".heading").html("Settings - Graphic Appearance");

                                    //MADELIVE: split view is the master.
                                    if (false) { // (!$("#graphsublabel").eq(0).is(":visible")) {
                                        $('#graphsublabel').trigger('click');
                                    }
                                    else {
									    $("#graphtab").show();
									    $('#graphlabel').trigger('click');
                                    }

            if ((a$.urlprefix() == "cox.") || (a$.urlprefix() == "cox-make40.")) {
                $(".settingsdiv-wrapper").show();
            }
            break;
        case "#Scoring":
            appApmScoreEditing.initDataSources();
            if (($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin") || ($.cookie("TP1Role") == "Management") || ($.cookie("TP1Username") == "sfletcher") || ($.cookie("TP1Role") == "Group Leader") || ($.cookie("TP1Role") ==
                    "Team Leader")) {
                $("#scoringdiv").show();
                $(".heading").html('Settings - <span class="scaname">Project</span>s &amp; Scoring');
                appApmDashboard.setClientLabels();
                $("#companytab,#modeltab,#projecttab,#kpitab,#subkpitab").show();
                $('#companyadminlabel').trigger('click');
                appApmAdmin.initProjectAdmin();
            } else {
                location.hash = '#GraphsReports';
                return;
            }
            $(".admin-editing-wrapper").show();
            break;
        case "#ScoreEditor":
            appApmScoreEditing.initDataSources();
            $("#datasourcediv,#filterdiv,#scoreeditorcontroldiv").show();
            $("#kpidl").hide();
            $("#datedl,#trenddl").show();
            $(".heading").html("Score Editor");
            $("#scoreeditortab").show();
            $("#scoreeditorlabel").html("Score Editor");
            $("#scoreeditorlabel").trigger("click");
            //$("#scoreeditorarea").html("Set data source,
            break;
        case "#Import":
            if ($("#importframe").attr("src") == "") {
                if ((a$.urlprefix() == "ers.") || (a$.urlprefix() == "ec2.")) {
                    $("#importframe").attr("src", "//ers-import.acuityapmr.com/jq/import3.aspx");
                } else {
                    $("#importframe").attr("src", "import3.aspx");
                }
            }
            //$("#manualimporttab").show();
            $("#manualimportdiv").show();
            //$("#manualimportlabel").trigger("click");
            break;
        case "#AttendanceTracker":
            appApmScoreEditing.initDataSources();
            $("#datasourcediv,#filterdiv,#scoreeditorcontroldiv").show();
            $("#selDataSources").val("Attendance");
            $("#kpidl").hide();
            $("#datedl,#trenddl").show();
            $(".heading").html("Attendance Tracker");
            $("#scoreeditortab").show();
            $("#scoreeditorlabel").html("Attendance Tracker");
            $("#scoreeditorlabel").trigger("click");
            //$("#scoreeditorarea").html("Set data source,
            appApmScoreEditing.btnView("scoreeditorarea");
            break;
        case "#Advanced":
            $("#settingsdiv").show();
            $(".heading").html("Settings - Advanced");
            $("#advancedsettingstab").show();
            $('#advancedsettingslabel').trigger('click');
            break;
        case "#UserPreferences":
            $("#settingsdiv").show();
            $(".heading").html("Settings - User Preferences");
            $("#userpreferencestab").show();
            $('#userpreferenceslabel').trigger('click');
            break;
        case "#Classic":
            $("#gaugesdiv,#messagediv,#filterdiv,#dashboardcontroldiv,#settingsdiv").show();
            if (document.getElementById("rdoGrid").checked) $("#rdoGrid").trigger("click");
            if (document.getElementById("rdoPay").checked) $("#rdoPay").trigger("click");
            if (document.getElementById("rdoBase").checked) $("#rdoBase").trigger("click");
            if (document.getElementById("rdoTrend").checked) $("#rdoTrend").trigger("click");
            $(".heading").html("Classic Dashboard");
            if ($("#graphsublabel").html() != "Split") $('#graphsubtab').show();
            if ($("#tablelabel").html() != "Table") $('#tabletab').show();

                                    //MADELIVE: split view is the master.
                                    if (false) { // (!$("#graphsublabel").eq(0).is(":visible")) {
                                        $('#graphsublabel').trigger('click');
                                    }
                                    else {
									    $("#graphtab").show();
									    $('#graphlabel').trigger('click');
                                    }
            break;
        case "#GraphsReports":
            $("#gaugesdiv,#filterdiv,#dashboardcontroldiv,#settingsdiv").show();
            if (document.getElementById("rdoGrid").checked) $("#rdoGrid").trigger("click");
            if (document.getElementById("rdoPay").checked) $("#rdoPay").trigger("click");
            if (document.getElementById("rdoBase").checked) $("#rdoBase").trigger("click");
            if (document.getElementById("rdoTrend").checked) $("#rdoTrend").trigger("click");
            $(".heading").html("Graphs and Reports");
            if ($("#graphsublabel").html() != "Split") $('#graphsubtab').show();
            if ($("#tablelabel").html() != "Table") $('#tabletab').show();

                                    //MADELIVE: split view is the master.
                                    if (false) { // (!$("#graphsublabel").eq(0).is(":visible")) {
                                        $('#graphsublabel').trigger('click');
                                    }
                                    else {
									    $("#graphtab").show();
									    $('#graphlabel').trigger('click');
                                    }

            break;        
        default:
            if ((a$.urlprefix() == "ers.") || (a$.urlprefix() == "cthix.") || (a$.urlprefix() == "ers-alpha.")) {
                //default is Classic for ERS for now.
                $("#gaugesdiv,#filterdiv,#dashboardcontroldiv,#settingsdiv").show();
                if (document.getElementById("rdoPay").checked) $("#rdoPay").trigger("click");
                if (document.getElementById("rdoGrid").checked) $("#rdoGrid").trigger("click");
                if (document.getElementById("rdoBase").checked) $("#rdoBase").trigger("click");
                if (document.getElementById("rdoTrend").checked) $("#rdoTrend").trigger("click");
                $(".heading").html("Classic Dashboard");
                if ($("#graphsublabel").html() != "Split") $('#graphsubtab').show();
                if ($("#tablelabel").html() != "Table") $('#tabletab').show();
                                        //MADELIVE: split view is the master.
                                        if (false) { // (!$("#graphsublabel").eq(0).is(":visible")) {
                                            $('#graphsublabel').trigger('click');
                                        }
                                        else {
					    				    $("#graphtab").show();
						    			    $('#graphlabel').trigger('click');
                                        }

            } else if (debug_makingsprintgame || (a$.urlprefix() == "sprintgame.")) {
                $("#gaugesdiv,#filterdiv,#dashboardcontroldiv,#settingsdiv").show();
                if (document.getElementById("rdoPay").checked) $("#rdoPay").trigger("click");
                if (document.getElementById("rdoGrid").checked) $("#rdoGrid").trigger("click");
                if (document.getElementById("rdoBase").checked) $("#rdoBase").trigger("click");
                if (document.getElementById("rdoTrend").checked) $("#rdoTrend").trigger("click");
                $(".heading").html("Graphs and Reports");
                if ($("#graphsublabel").html() != "Split") $('#graphsubtab').show();
                if ($("#tablelabel").html() != "Table") $('#tabletab').show();

                                        //MADELIVE: split view is the master.
                                        if (false) { // (!$("#graphsublabel").eq(0).is(":visible")) {
                                            $('#graphsublabel').trigger('click');
                                        }
                                        else {
									        $("#graphtab").show();
									        $('#graphlabel').trigger('click');
                                        }

                $("#graphlabel").html("Dashboard");
                $("#fanlabel").html("Game");
                $('#fantab').show();
                $('#fanlabel').trigger('click');
            } else {
                $("#gaugesdiv,#filterdiv,#dashboardcontroldiv,#settingsdiv").show();
                if (document.getElementById("rdoPay").checked) $("#rdoPay").trigger("click");
                if (document.getElementById("rdoGrid").checked) $("#rdoGrid").trigger("click");
                if (document.getElementById("rdoBase").checked) $("#rdoBase").trigger("click");
                if (document.getElementById("rdoTrend").checked) $("#rdoTrend").trigger("click");
               
                if ($("#graphsublabel").html() != "Split") $('#graphsubtab').show();
                if ($("#tablelabel").html() != "Table") $('#tabletab').show();

                                        //MADELIVE: split view is the master.
                                        if (false) { // (!$("#graphsublabel").eq(0).is(":visible")) {
                                            $('#graphsublabel').trigger('click');
                                        }
                                        else {
									        $("#graphtab").show();
									        $('#graphlabel').trigger('click');
                                        }

            }
            break;
    }

    animatelogo();
}

/*
$("#slider").bind("slidechange", function (event, ui) {
    alert("debug:slider changed");
});
*/

/*
appApmSettings.init({
    id: "ReportGrouping",
    shadow: "StgReportGrouping",
    ui: "combo"
});
*/
appApmSettings.init({
    id: "AttritionReportGrouping",
    shadow: "StgReportGrouping",
    ui: "combo"
});
appApmSettings.init({
    id: "ReportReportGrouping",
    shadow: "StgReportGrouping",
    ui: "combo"
});

//------------------

function resizedivs() {
    $(".leftpanel").height(($(window).height() - 70) + 'px'); //was 96
    $(".leftpanel-icons").height(($(window).height() - 70) + 'px'); //was 96

    var leftwidth = 300;

    if ($(".leftpanel-icons").eq(0).css("display") != "none") {
        leftwidth = 75;
    }
    $("#tabs").css("left",(leftwidth - 20) + "px");

    //$(".tabarea").height(($(window).height() - 122) + 'px').width(($(window).width() - 310) + 'px');
    $(".tabarea").height(($(window).height() - 137) + 'px').width(($(window).width() - (leftwidth + 10)) + 'px'); //Height was 172, changed to 137.
    //$(".ReportReports").height(($(window).height() - 181) + 'px').width(($(window).width() - (leftwidth + 30)) + 'px'); //Height was 172, changed to 137.
    $("#tabs").width(($(window).width() - (leftwidth - 15)) + 'px');

    $("#importframe").height(($(window).height()) + 'px').width(($(window).width() - 3) + 'px');
    if (uiInterface) uiInterface.sizebars();
    ko.postbox.publish("ResizeWindow", true);
    $(".chat-window").css("max-height", ($(window).height() - (20)) + 'px');
    $(".chat-sessions").css("max-height", ($(window).height() - (20 + 60)) + 'px');
}

//----------------------

var tabsdiv = document.getElementById("tabs");
if (tabsdiv) {
    tabsdiv.style.width = ($(window).width() - 300) + 'px';
}
var chartdiv = document.getElementById(op.chart.renderTo);
if (chartdiv) {
    chartdiv.style.width = ($(window).width() - 340) + 'px';
    chartdiv.style.height = ($(window).height() - 200) + 'px';
}
chartdiv = document.getElementById(opsub.chart.renderTo);
if (chartdiv) {
    chartdiv.style.width = ($(window).width() - 340) + 'px';
    chartdiv.style.height = ($(window).height() - 200) + 'px';
}
var pgdiv = document.getElementById('mytable1');
if (pgdiv) {
    pgdiv.style.width = ($(window).width() - 300) + 'px';
    pgdiv.style.height = ($(window).height() - 200) + 'px';
}

/*
var opts = {
lines: 12, // The number of lines to draw
length: 7, // The length of each line
width: 4, // The line thickness
radius: 10, // The radius of the inner circle
color: '#000', // #rgb or #rrggbb
speed: 1, // Rounds per second
trail: 60, // Afterglow percentage
shadow: false, // Whether to render a shadow
hwaccel: false // Whether to use hardware acceleration
};
var target = document.getElementById('comboprogress2');
var spinner = new Spinner(opts).spin(target);
alert("debug:reached the bottom");
*/

//----------------------------------

var stgRankPointsLabel;
var stgRawScoreRollups;

//-----------------------------------

function qa_1(o) {

    qa_ans["1_100"] = {};
    qa_ans["1_100"].index = -1;
    qa_ans["1_100"].correctindex = 3;
    $("#qa_div").qa({
        action: "styleListHover",
        data: {
            f: 1,
            q: 100
        }
    });

    $(".qa-w-1").show();

    $("#qa_div").qa({
        action: "setQuestion",
        data: {
            f: 1,
            q: 100
        }
    });

    $(".qa-s-1-100").unbind().bind("click", function() {
        $(".qa-s-1-100").hide();
        var bld = "";
        if (qa_ans["1_100"].index != qa_ans["1_100"].correctindex) {
            bld += "<p>The correct answer is " + (qa_ans["1_100"].correctindex + 1) + "</p>";
            bld += '<p>Your answer is <span class="qa-incorrect">incorrect</span>, your answer was ' + (qa_ans["1_100"].index + 1) + ".</p>";
            $(".qa-q-1-100 ol li").eq(qa_ans["1_100"].index).each(function() {
                $(this).css("background-color", "Red");
            });
            $(".qa-g-1").html("+0 Coins");
        } else {
            bld += "<p>Your answer is CORRECT!</p>";
            $(".qa-g-1").html("+5 Coins");
        }
        $(".qa-q-1-100 ol li").eq(qa_ans["1_100"].correctindex).each(function() {
            $(this).css("background-color", "Green").css("color", "white");
        });
        $(".qa-q-1-100 ol li").unbind();
        $(".qa-a-1-100").html(bld).show();
        $(".qa-f-1-100").show();
        $(".qa-ft-1").show();
        $("#qa_div").qa({
            action: "save",
            data: $.extend(true, {}, o, {
                f: 1
            })
        });
    });

    $(".qa-d-1").unbind().bind("click", function() {
        $(".qa-w-1").hide();
    });
}

//---------------------

function qa_2(o) {

    $(".qa-w-2 .qa-close").unbind().bind("click", function() {
        $(".qa-w-2").hide();
    });

    qa_ans["2_200"] = {};
    qa_ans["2_200"].index = -1;
    $("#qa_div").qa({
        action: "styleListHover",
        data: {
            f: 2,
            q: 200
        }
    });

    qa_ans["2_201"] = {};
    qa_ans["2_201"].index = -1
    $("#qa_div").qa({
        action: "styleListHover",
        data: {
            f: 2,
            q: 201
        }
    });

    qa_ans["2_202"] = {};
    qa_ans["2_202"].value = 7;
    $(".qa-slider-q-2-202").slider({
        value: qa_ans["2_202"].value,
        min: 1,
        max: 10,
        step: 1,
        slide: function(event, ui) {
            $(".qa-a-2-202").val(ui.value);
            $(".qa-s-2-202").prop("disabled", false).removeClass("qa-submit-disabled");

        }
    });
    $(".qa-a-2-202").val("Select a value.");

    $(".qa-w-2").show();

    $("#qa_div").qa({
        action: "setQuestion",
        data: {
            f: 2,
            q: 200
        }
    });

    $(".qa-s-2-200").unbind().bind("click", function() {
        $("#qa_div").qa({
            action: "setQuestion",
            data: {
                f: 2,
                q: 201
            }
        });
    });

    $(".qa-p-2-201").unbind().bind("click", function() {
        $("#qa_div").qa({
            action: "setQuestion",
            data: {
                f: 2,
                q: 200
            }
        });
    });
    $(".qa-s-2-201").unbind().bind("click", function() {
        $("#qa_div").qa({
            action: "setQuestion",
            data: {
                f: 2,
                q: 202
            }
        });
    });

    $(".qa-p-2-202").unbind().bind("click", function() {
        $("#qa_div").qa({
            action: "setQuestion",
            data: {
                f: 2,
                q: 201
            }
        });
    });
    $(".qa-s-2-202").unbind().bind("click", function() {
        $("#qa_div").qa({
            action: "setQuestion",
            data: {
                f: 2,
                q: 203
            }
        });

        /* TODO: This will likely have to be custom, see if there's a way to generalize it. */
        var t203 = "";
        var t204 = "";
        var t205 = "";

        function qa_2_203_validation() {
            if ((t203 != "") && (t204 != "") && (t205 != "")) {
                $(".qa-s-2-203").prop("disabled", false).removeClass("qa-submit-disabled");
            } else {
                $(".qa-s-2-203").prop("disabled", true).addClass("qa-submit-disabled");
            }
        }
        $(".qa-a-2-203").unbind().bind("change keyup paste", function() {
            t203 = $(this).val();
            qa_2_203_validation()
        });
        $(".qa-a-2-204").unbind().bind("change keyup paste", function() {
            t204 = $(this).val();
            qa_2_203_validation()
        });
        $(".qa-a-2-205").unbind().bind("change keyup paste", function() {
            t205 = $(this).val();
            qa_2_203_validation()
        });
    });

    $(".qa-p-2-203").unbind().bind("click", function() {
        $("#qa_div").qa({
            action: "setQuestion",
            data: {
                f: 2,
                q: 202
            }
        });
    });
    $(".qa-s-2-203").unbind().bind("click", function() {
        $(".qa-question").hide();
        $(".qa-g-2").html("+5 Coins");
        /* Save the answers */
        $("#qa_div").qa({
            action: "save",
            data: $.extend(true, {}, o, {
                f: 2
            })
        });
        $(".qa-d-2").unbind().bind("click", function() {
            $(".qa-w-2").hide();
        });

        $(".qa-ft-2").show();
    });
}

//-------------------------------

function qa_3(o) {

    $(".qa-w-3 .qa-close").unbind().bind("click", function() {
        $(".qa-w-3").hide();
    });

    qa_ans["3_200"] = {};
    qa_ans["3_200"].index = -1;
    $("#qa_div").qa({
        action: "styleListHover",
        data: {
            f: 3,
            q: 200
        }
    });

    qa_ans["3_201"] = {};
    qa_ans["3_201"].index = -1
    $("#qa_div").qa({
        action: "styleListHover",
        data: {
            f: 3,
            q: 201
        }
    });

    qa_ans["3_206"] = {};
    qa_ans["3_206"].index = -1
    $("#qa_div").qa({
        action: "styleListHover",
        data: {
            f: 3,
            q: 206
        }
    });

    qa_ans["3_207"] = {};
    qa_ans["3_207"].index = -1
    $("#qa_div").qa({
        action: "styleListHover",
        data: {
            f: 3,
            q: 207
        }
    });

    qa_ans["3_202"] = {};
    qa_ans["3_202"].value = 7;
    $(".qa-slider-q-3-202").slider({
        value: qa_ans["3_202"].value,
        min: 1,
        max: 10,
        step: 1,
        slide: function(event, ui) {
            $(".qa-a-3-202").val(ui.value);
            $(".qa-s-3-202").prop("disabled", false).removeClass("qa-submit-disabled");
        }
    });
    $(".qa-a-3-202").val("Select a value.");

    $(".qa-w-3").show();

    $("#qa_div").qa({
        action: "setQuestion",
        data: {
            f: 3,
            q: 200
        }
    });

    $(".qa-s-3-200").unbind().bind("click", function() {
        //Special escape for those not involved
        if (qa_ans["3_200"].index == 3) {
            $(".qa-s-3-203").trigger("click");
        } else {
            $("#qa_div").qa({
                action: "setQuestion",
                data: {
                    f: 3,
                    q: 201
                }
            });
        }
    });

    $(".qa-p-3-201").unbind().bind("click", function() {
        $("#qa_div").qa({
            action: "setQuestion",
            data: {
                f: 3,
                q: 200
            }
        });
    });
    $(".qa-s-3-201").unbind().bind("click", function() {
        $("#qa_div").qa({
            action: "setQuestion",
            data: {
                f: 3,
                q: 206
            }
        });
    });

    $(".qa-p-3-206").unbind().bind("click", function() {
        $("#qa_div").qa({
            action: "setQuestion",
            data: {
                f: 3,
                q: 201
            }
        });
    });
    $(".qa-s-3-206").unbind().bind("click", function() {
        $("#qa_div").qa({
            action: "setQuestion",
            data: {
                f: 3,
                q: 207
            }
        });
    });

    $(".qa-p-3-207").unbind().bind("click", function() {
        $("#qa_div").qa({
            action: "setQuestion",
            data: {
                f: 3,
                q: 206
            }
        });
    });
    $(".qa-s-3-207").unbind().bind("click", function() {
        $("#qa_div").qa({
            action: "setQuestion",
            data: {
                f: 3,
                q: 202
            }
        });
    });

    $(".qa-p-3-202").unbind().bind("click", function() {
        $("#qa_div").qa({
            action: "setQuestion",
            data: {
                f: 3,
                q: 207
            }
        });
    });
    $(".qa-s-3-202").unbind().bind("click", function() {
        $("#qa_div").qa({
            action: "setQuestion",
            data: {
                f: 3,
                q: 203
            }
        });

        /* TODO: This will likely have to be custom, see if there's a way to generalize it. */
        var t203 = "";
        var t204 = "";
        var t205 = "";
        var t208 = "";

        function qa_3_203_validation() {
            if ((t203 != "") && (t204 != "") && (t205 != "") && (t208 != "")) {
                $(".qa-s-3-203").prop("disabled", false).removeClass("qa-submit-disabled");
            } else {
                $(".qa-s-3-203").prop("disabled", true).addClass("qa-submit-disabled");
            }
        }
        $(".qa-a-3-203").unbind().bind("change keyup paste", function() {
            t203 = $(this).val();
            qa_3_203_validation()
        });
        $(".qa-a-3-204").unbind().bind("change keyup paste", function() {
            t204 = $(this).val();
            qa_3_203_validation()
        });
        $(".qa-a-3-205").unbind().bind("change keyup paste", function() {
            t205 = $(this).val();
            qa_3_203_validation()
        });
        $(".qa-a-3-208").unbind().bind("change keyup paste", function() {
            t208 = $(this).val();
            qa_3_203_validation()
        });
    });

    $(".qa-p-3-203").unbind().bind("click", function() {
        $("#qa_div").qa({
            action: "setQuestion",
            data: {
                f: 3,
                q: 202
            }
        });
    });
    $(".qa-s-3-203").unbind().bind("click", function() {
        $(".qa-question").hide();
        $(".qa-g-3").html("+5 Coins");
        /* Save the answers */
        $("#qa_div").qa({
            action: "save",
            data: $.extend(true, {}, o, {
                f: 3
            })
        });
        $(".qa-d-3").unbind().bind("click", function() {
            $(".qa-w-3").hide();
        });
        $(".qa-ft-3").show();
    });
}

//------------------------

function qa_changepassword_rejectionreason(txt) {
    if (txt.length < 8) {
        return ("Too Short");
    } else {
        var numfound = false;
        var letterfound = false;
        for (var i in txt) {
            if ((txt[i] >= '1') && (txt[i] <= '9')) {
                numfound = true;
            } else {
                letterfound = true; //or special character
            }
        }
        if (!numfound) {
            return ("Number Needed");
        } else if (!letterfound) {
            return ("Letter Needed");
        }
    }
    return "";
}

function qa_changepassword(o) {

    $(".qa-changepassword .qa-close").unbind().bind("click", function() {
        $(".qa-changepassword").hide();
        if (a$.exists(o.showsprintgamestart)) {
            qa_sprintgamestart();
        }
    });
    $(".qa-q-changepassword-1").show();
    $(".qa-changepassword").show();

    $(".qa-d-changepassword-1").unbind().bind("click", function() {
        alert("debug: submitting change");
        $(".qa-changepassword").hide();
    });
    $(".qa-changepassword-text-current").unbind().bind("keyup", function() {
        if ($(this).val().length >= 1) {
            $(".qa-changepassword-text-new").prop("disabled", false);
        } else {
            $(".qa-changepassword-text-new").prop("disabled", true);
            $(".qa-changepassword-text-confirm").prop("disabled", true);
            $(".qa-changepassword-strength-prompt").hide();
            $(".qa-d-changepassword-1").prop("disabled", true).addClass("qa-submit-disabled");;
        }
    });
    $(".qa-changepassword-text-new").unbind().bind("keyup", function() {
        var reason = qa_changepassword_rejectionreason($(this).val());
        $(".qa-d-changepassword-1").prop("disabled", true);
        $(".qa-changepassword-text-confirm").val("");
        if (reason == "") {
            $(".qa-changepassword-text-confirm").prop("disabled", false);
            $(".qa-changepassword-strength-prompt").show();
            $(".qa-changepassword-strength-prompt").css("color", "green");
            $(".qa-changepassword-strength-reason").html("Good!");

        } else {
            $(".qa-changepassword-text-confirm").prop("disabled", true);
            $(".qa-changepassword-strength-prompt").show();
            $(".qa-changepassword-strength-prompt").css("color", "red");
            $(".qa-changepassword-strength-reason").html(reason);
            $(".qa-d-changepassword-1").prop("disabled", true).addClass("qa-submit-disabled");;
        }
    });
    $(".qa-changepassword-text-confirm").unbind().bind("keyup", function() {
        if ($(this).val() != $(".qa-changepassword-text-new").eq(0).val()) {
            $(".qa-changepassword-match-prompt").hide();
            $("q.a-d-changepassword-1").prop("disabled", true).addClass("qa-submit-disabled");;
        } else {
            $(".qa-changepassword-match-prompt").show();
            $(".qa-d-changepassword-1").prop("disabled", false).removeClass("qa-submit-disabled");
        }
    });
    $(".qa-d-changepassword-1").unbind().bind("click", function() {
        a$.ajax({
            type: "GET",
            service: "JScript",
            async: true,
            data: {
                lib: "login",
                product: "Acuity",
                cmd: "changepassword",
                current: $(".qa-changepassword-text-current").eq(0).val(),
                change: $(".qa-changepassword-text-new").eq(0).val()
            },
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: attemptchange
        });

        function attemptchange(json) {
            if (a$.jsonerror(json)) {
                $(".qa-changepassword-submiterror").html(json.msg).show();
                $(".qa-changepassword-text-current").val("").trigger("keyup");
            } else {
                if (json.success == "Y") {
                    $(".qa-changepassword h1").html("Password Successfully Changed");
                    $(".qa-q-changepassword-1").hide();
                    var myid;

                    function closebox() {
                        $(".qa-changepassword").hide();
                        if (a$.exists(o.showsprintgamestart)) {
                            qa_sprintgamestart();
                        }
                    }
                    myid = setTimeout(closebox, 2000);

                } else {
                    $(".qa-changepassword-submiterror").html(json.reason).show();
                    $(".qa-changepassword-text-current").val("").trigger("keyup");
                }
            }
        }

    });
    /*
    "qa-changepassword-strength-prompt"
    "qa-changepassword-strength-reason"
    "qa-changepassword-text-new"
    "qa-changepassword-text-confirm"
    */
}

function qa_sprintgamestart(o) {
    //return; //Defeat the splash screen
    $(".qa-sprintgamestart .qa-close,.qa-d-sprintgamestart-1").unbind().bind("click", function() {
        $(".qa-sprintgamestart").hide();
    });
    $(".qa-q-sprintgamestart-1").show();
    $(".qa-sprintgamestart").show();
};