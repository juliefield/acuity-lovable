(function () {
    if (!window.jQuery) {
        alert("This App requires jQuery");
        return;
    }
    var $ = window.jQuery;

    var FIRSTPASS = true;
    function chartclick0(event) {
        appApmDashboard.chartclick(event, 0, this);
    };

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
                text: 'KPI Score'
            },
            labels: {
                step: 1
            }
        } /* FIDDLE: */ //,{ title: { text: 'Raw Score' } }
							],
        tooltip: {
            useHTML: true,
            formatter: function () {
                return '<div style="z-index:1000;">' + this.series.name + '<br/>' + '<b>' + this.x + '</b><br/>' + /* 'Score: ' + (Math.round(this.point.y * 100.0) / 100.0) + '<br/>' +  'Raw Score: ' + */this.point.name + '</div>';
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
                    /* color: 'white',
                    style: {
                    fontWeight: 'bold',
                    backgroundColor: '#FFA500',
                    padding: '2px'
                    },
                    borderColor: '#AAA', */
                    useHTML: true,
                    formatter: function () {
                        return (Math.round(this.y * 100.0) / 100.0);
                    }
                }
            },
            responsive: {
                rules: [{
                    condition: {
                        /* maxWidth: 500 */
                    },
                    chartOptions: {
                        legend: {
                            align: 'center',
                            verticalAlign: 'bottom',
                            layout: 'horizontal'
                        }
                    }
                }]
            }
        },
        /* colors: ['blue'], */
        credits: {
            enabled: false
        },
        lang: {
            /* helpBtnTitle: 'Graph System Overview', */
            tableBtnTitle: 'Show Graph as a Table'
        },
        exporting: {
            buttons: {
                /*
                helpBtn: {
                symbol: 'url(appApmClient/themes/default/images/help.gif)',
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
                */
                tableBtn: {
                    symbol: 'url(appApmClient/themes/default/images/table.gif)',
                    tooltip: 'here',
                    _titleKey: 'tableBtnTitle',
                    x: -62,
                    symbolFill: '#B5C9DF',
                    symbolX: 10,
                    symbolY: 10,
                    hoverSymbolFill: '#779ABF',
                    onclick: function () {
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
            formatter: function () {
                return '<div style="z-index:1000;">' + this.series.name + '<br/>' + '<b>' + this.x + '</b><br/>' + /* 'Score: ' + (Math.round(this.point.y * 100.0) / 100.0) + '<br/>' +  'Raw Score: ' + */this.point.name + '</div>';
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
                    formatter: function () {
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
            /*helpBtnTitle: 'Graph System Overview',*/
        },
        exporting: {
            buttons: {
                /*
                helpBtn: {
                symbol: 'url(appApmClient/themes/default/images/help.gif)',
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
                */
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
        onSelectRow: function (id) {
            appApmDashboard.rowselected(id);
        }
    };

    $(':input').focus(function () {
        appApmDashboard.setPrev(this.value);
    }).change(function () {
        appApmDashboard.change(this);
        appApmDashboard.setPrev(this.value);
    });

    $.cookie("ApmGuatModuleLoc", "9");
    var global_attritionvisible = false;
    var global_attritiontestingvisible = false;
    var global_oldprojecttext = $.cookie("PROJECTTEXT");
    if ((global_oldprojecttext == "(All)") || (global_oldprojecttext == "(Each)")) {
        global_oldprojecttext = "XXX";
        $.cookie(appApmDashboard.getCookiePrefix() + "-Project", "XXX")
    }
    var global_currentfilter = "";
    controlopts = {
        Athreshold: 8.0,
        Bthreshold: 4.0,
        /* performanceRanges is now brought in via CDS.  Not sure we'll go this route for everything, but this does work. */
        /* performanceRanges: [
        { letter: "A", threshold: 8.0, pie: { low: 8.0, high: 10.0 }, color: "#019F01", stops: [[0, '#005B00'], [1, '#00AE00'], [2, '#00AE00']] },
        { letter: "B", threshold: 4.0, pie: { low: 4.0, high: 8.0 }, color: "#EBE40C", stops: [[0, '#AF8013'], [1, '#FEFE00'], [2, '#FEFE00']] },
        { letter: "C", threshold: -99999.0, pie: { low: 0.0, high: 4.0 }, color: "#990101", stops: [[0, '#5B0000'], [1, '#AC0000'], [2, '#AC0000']] }
        ],*/
        initfunction: function () {
            appApmDashboard.movefilters(0); //Debug: I added Location to this on 7/22/2016 to account for the case where we're doing a location check by xaxis.
            appApmDashboard.refreshboxes({
                which: 'Agency,Project,Xaxis',
                success: function () {
                    var projectchanged = false;
                    //alert("debug:localstorage(" + appApmDashboard.getCookiePrefix() + "-Project" + ")=" + window.localStorage.getItem(appApmDashboard.getCookiePrefix() + "-Project"));
                    //$.cookie("AB-Project", "TEST");
                    //alert("debug:cookietest=" + $.cookie("AB-Project"));
                    if (global_oldprojecttext != "") {
                        $("#selProjects option").each(function () {
                            if ($(this).html() == global_oldprojecttext) {
                                var val = $(this).val();
                                if (val != $.cookie(appApmDashboard.getCookiePrefix() + "-Project")) {
                                    $('#selProjects').val(val).trigger("liszt:updated");
                                    //alert("debug: projectfiltersready");
                                    projectchanged = true;
                                }
                            }
                        });
                    }
                    appApmDashboard.refreshboxes({
                        which: 'Agencyoffice,Location,Group,Team,CSR,KPI,SubKPI,Payperiod,DataSource,Qualityform,Trendby' + mpar,
                        success: function () {
                            appApmDashboard.finishinit({
                                exclude: 'Payperiod',
                                projectchanged: projectchanged
                            });

                            if ((a$.urlprefix() == "nex.") || (a$.urlprefix().indexOf("make") >= 0)) {
                                $('#selKPIs').val('eachlabel').trigger("liszt:updated");
                            } else {
                                $('#selKPIs').val('each').trigger("liszt:updated");
                            }

                            if ((a$.urlprefix() == "cox.") || (a$.urlprefix().indexOf("cox-mnt") >= 0)) {
                                if (true) { //(FIRSTPASS) {
                                    FIRSTPASS = false;
                                    $("#selProjects").val("each").trigger("liszt:updated");
                                    $("#selLocations").val("each").trigger("liszt:updated");
                                    if ($.cookie("TP1Role") == "Team Leader") {
                                        $("#selCSRs").val("each").trigger("liszt:updated");
                                        $("#filtersdiv").show();
                                        $("#selKPIs").val("").trigger("liszt:updated");
                                    }
                                }
                                if (($.cookie("TP1Role") == "Team Leader") || ($.cookie("TP1Role") == "CSR")) {
                                    //$.cookie("CoxSkipWhen2","0");
                                    //alert("debug: skip 2c");
                                }
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
                            ko.postbox.publish("JournalCSR", $("#selCSRs").val());
                            ko.postbox.publish("JournalTeam", $("#selTeams").val());
                            if ($("#selCSRs").val() != "") {
                                ko.postbox.publish("CSR", $("#selCSRs").val());
                                window.Selected.CSR = "";
                            } else if ($("#selTeams").val() != "") {
                                ko.postbox.publish("Team", $("#selTeams").val());
                            }
                            if ($("#selLocations").val() != "") {
                                ko.postbox.publish("Location", $("#selLocations").val());
                            }
                            if ((a$.urlprefix() == "chime.") || (a$.urlprefix().indexOf("chime-make40.") >= 0) || (a$.urlprefix() == "chime-mnt.")) { //Set location to 1 (Morrow)
                                if (false) {
                                    $("#selLocations").val("1").trigger("liszt:updated");
                                    $("#locationlabel,#locationfilter").hide();
                                }
                            }
                            //alert("debug: filtersready");
                            window.CoxFiltersReady = true; // "cox."
                            if ((window.reportuid) && (window.reportuid != "")) {
                                loadcustomreport();
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
            onchange: function () {
                appApmDashboard.refreshboxes({
                    which: 'Agencyoffice,Location,Group,Team,CSR,KPI,SubKPI',
                    param: function () {
                        return appApmDashboard.boxval('Agency')
                    }
                });
            },
            param: function () {
                return appApmDashboard.boxval('Agency')
            }
        },
								{
								    type: 'select',
								    idtemplate: 'Agencyoffice',
								    onchange: function () {
								        appApmDashboard.refreshboxes({
								            which: 'Location,Group,Team,CSR,KPI,SubKPI',
								            param: function () {
								                return appApmDashboard.boxval('Agencyoffice')
								            }
								        });
								    },
								    param: function () {
								        return appApmDashboard.boxval('Agencyoffice')
								    }
								},
								{
								    type: 'select',
								    idtemplate: 'Project',
								    onchange: function () {
								        if ((document.getElementById("rdoGrid").checked) || (a$.gup("oldfilters") != "Y")) {
								            multiChanged("selProjects");
								        }

								        global_oldprojecttext = $("#selProjects option:selected").text();
								        $.cookie("PROJECTTEXT", global_oldprojecttext);
								        appApmDashboard.refreshboxes({
								            which: 'Location,Group,Team,CSR,KPI,SubKPI,Payperiod,Trendby,DataSource,Qualityform',
								            success: function () {
								                //Double-pump project changes (test first on Cox, where it's needed right away).
								                if (a$.urlprefix() == "cox.") {
								                    appApmDashboard.refreshboxes({
								                        which: 'Location,Group,Team,CSR,KPI,SubKPI,Payperiod,Trendby,DataSource,Qualityform',
								                        success: function () {
								                            appApmDashboard.setdaterangeslider($("#selTrendbys").val());
								                            appApmMessaging.composecontacts();
								                        }
								                    });
								                }
								                else {
								                    appApmDashboard.setdaterangeslider($("#selTrendbys").val());
								                    appApmMessaging.composecontacts();
								                }
								                if (window.reportload_state == "PROJECTLOADED") {
								                    var vs = window.reportload_viewparams.split("&");
								                    for (var i in vs) {
								                        vss = vs[i].split("=");

								                        /* Method 1, since Project is set, presume the rest of the boxes contain your filters */
								                        switch (vss[0]) {
								                            case "Location":
								                            case "Group":
								                            case "Team":
								                            case "CSR":
								                            case "KPI":
								                            case "SubKPI":
								                            case "Trendby":
								                            case "DataSource":
								                            case "Payperiod":
								                            case "Qualityform":
								                                //Agency=&Agencyoffice=&Project=29&Location=9&Group=47&Team=523&CSR=silviacalel&StartDate=1/1/2022&EndDate=1/31/2022&StartDate2=3/1/2022&EndDate2=3/31/2022&KPI=each&none&Xaxis=KPI&DataSource=17&Trendby=
								                                $("#sel" + vss[0] + "s").val(vss[1]);
								                                $("#sel" + vss[0] + "s").trigger("liszt:updated");
								                                window.reportuid = "";
								                                $(".btnPlot").trigger("click");
								                                break;
								                            default:
								                                break;
								                        }

								                        /* Method 2, cascade the changes down (may be necessary)
								                        if (vss[0] == "Location") {
								                        $("#selLocations").val(vss[1]);
								                        $('#selLocations').trigger("liszt:updated");
								                        sb = document.getElementById('selLocations');
								                        appApmDashboard.change(sb, true);
								                        break; //Only interested in Location
								                        }
								                        */
								                    }
								                    //Moved it to here:
								                    window.reportload_state = "FINALCLICK";
								                    $(".btnPlot").trigger("click");
								                    setTimeout(function () {
								                        window.reportload_state = "COMPLETE";
								                    }, 0);

								                }
								            }
								        });
								    },
								    param: function () {
								        return appApmDashboard.boxval('Project')
								    }
								},
								{
								    type: 'select',
								    idtemplate: 'Location',
								    onchange: function () {
								        if ((document.getElementById("rdoGrid").checked) || (a$.gup("oldfilters") != "Y")) {
								            multiChanged("selLocations");
								        }
								        appApmDashboard.refreshboxes({
								            which: ((a$.urlprefix().indexOf("bgr") >= 0) ? 'Group,Team,CSR,DataSource,Payperiod'
                                            : (($.cookie("ApmGuatModuleLoc") != "") && ((appApmDashboard.getPrev() == $.cookie("ApmGuatModuleLoc")) || ($("#selLocations").val() == $.cookie("ApmGuatModuleLoc"))))
                                            ? 'Group,Team,CSR,DataSource,Payperiod' : 'Group,Team,CSR,DataSource'),
								            success: function () {
								                appApmMessaging.composecontacts();
								            }
								        });
								    },
								    param: function () {
								        return appApmDashboard.boxval('Location')
								    }
								},
								{
								    type: 'select',
								    idtemplate: 'Group',
								    onchange: function () {
								        if ((document.getElementById("rdoGrid").checked) || (a$.gup("oldfilters") != "Y")) {
								            multiChanged("selGroups");
								        }
								        $("#selTeams option").remove();  //Empty this box to play better with FilterContext (otherwise I need to call Team and CSR separately). 
								        ko.postbox.publish("Team", "");
								        appApmDashboard.refreshboxes({
								            which: 'Team,CSR',
								            success: function () {
								                appApmMessaging.composecontacts();
								            }
								        });
								    },
								    param: function () {
								        return appApmDashboard.boxval('Group')
								    }
								},
								{
								    type: 'select',
								    idtemplate: 'Team',
								    onchange: function () {
								        if ((document.getElementById("rdoGrid").checked) || (a$.gup("oldfilters") != "Y")) {
								            multiChanged("selTeams");
								        }
								        //alert("debug: teams value = " + $("#selTeams").val());
								        ko.postbox.publish("JournalTeam", $("#selTeams").val());
								        ko.postbox.publish("Team", $("#selTeams").val());
								        appApmDashboard.refreshboxes({
								            which: 'CSR',
								            success: function () {
								                appApmMessaging.composecontacts();
								            }
								        });
								    },
								    param: function () {
								        return appApmDashboard.boxval('Team')
								    },
								    onrefresh: function () {
								        ko.postbox.publish("JournalTeam", $("#selTeams").val());
								        ko.postbox.publish("Team", $("#selTeams").val());
								    }
								},
								{
								    type: 'select',
								    idtemplate: 'CSR',
								    onchange: function () {
								        if ((document.getElementById("rdoGrid").checked) || (a$.gup("oldfilters") != "Y")) {
								            multiChanged("selCSRs");
								        }
								        if ($("#selCSRs").val() == "each") {
								            $("#filtersdiv").show();
								        }
								        else if (($("#selCSRs").val() == "") && ((a$.urlprefix() == "ers-mnt.") || (a$.urlprefix() == "ers."))) {
								            $("#filtersdiv").show();
								        }
								        else {
								            //No more hiding: $("#filtersdiv").hide();
								        }
								        ko.postbox.publish("JournalCSR", $("#selCSRs").val());
								        ko.postbox.publish("CSR", $("#selCSRs").val());
								        window.Selected.CSR = "";
								    },
								    onrefresh: function () {
								        ko.postbox.publish("JournalCSR", $("#selCSRs").val());
								        ko.postbox.publish("CSR", $("#selCSRs").val());
								        window.Selected.CSR = "";
								        switch ($("#StgDashboard select").val()) {
								            case "Program":
								            case "Financial":
								                if ($("#selCSRs").val() == "") {
								                    $("#selCSRs option").each(function () {
								                        if ($(this).val().toLowerCase().indexOf("plate") >= 0) {
								                            $("#selCSRs").val($(this).val()).trigger("liszt:updated");
								                        }
								                    });
								                }
								        }
								    },
								    param: function () {
								        return appApmDashboard.boxval('CSR')
								    }
								},
								{
								    type: 'select',
								    idtemplate: 'Payperiod',
								    onchange: function (sp) {
								        appApmDashboard.splitdates(document.getElementById('selPayperiods'), document.getElementById('spanDatefrom'), document.getElementById('spanDateto'));
								        if (sp) {
								            if (sp != 2) {
								                $("#drpPayperiods").data('dateRangePicker').setDateRange($("#spanDatefrom").html(), $("#spanDateto").html());
								            }
								        } else {
								            $("#drpPayperiods").data('dateRangePicker').setDateRange($("#spanDatefrom").html(), $("#spanDateto").html());
								        }
								        $("#selPayperiods").trigger("liszt:updated"); //new
								    },
								    param: function () {
								        return appApmDashboard.splitdateval('Payperiod')
								    }
								},
								{
								    type: 'select',
								    idtemplate: 'Payperiod2',
								    onchange: function (sp) {
								        appApmDashboard.splitdates(document.getElementById('selPayperiod2s'), document.getElementById('spanDatefrom2'), document.getElementById('spanDateto2'));
								        if (sp) {
								            if (sp != 2) {
								                $("#drpPayperiod2s").data('dateRangePicker').setDateRange($("#spanDatefrom2").html(), $("#spanDateto2").html());
								            }
								        } else {
								            $("#drpPayperiod2s").data('dateRangePicker').setDateRange($("#spanDatefrom2").html(), $("#spanDateto2").html());
								        }
								        $("#selPayperiod2s").trigger("liszt:updated"); //new
								    },
								    param: function () {
								        return appApmDashboard.splitdateval('Payperiod2')
								    }
								},
								{
								    type: 'select',
								    idtemplate: 'KPI',
								    onchange: function () {
								        appApmDashboard.refreshboxes({
								            which: 'SubKPI',
								            success: function () { }
								        });
								    },
								    onrefresh: function () {
								        /*
								        var sb = document.getElementById('selKPIs');
								        for (var i = 0; i < sb.options.length; i++) {
								        if (sb.options[i].text.indexOf('Quality') >= 0) {
								        sb.options[i].selected = true; break;
								        }
								        }
								        */
								    },
								    param: function () {
								        return appApmDashboard.boxval('KPI')
								    }
								},
								{
								    type: 'select',
								    idtemplate: 'SubKPI',
								    onrefresh: function () {
								        var ln = $("#selSubKPIs > option").length;
								        if (ln <= 2) { //2 is (All) and (Each)
								            $(".subkpi-display").hide();
								            $("#selSubKPIs").html("");
								        } else {
								            $(".subkpi-display").show();
								        }
								    },
								    param: function () {
								        return appApmDashboard.boxval('SubKPI')
								    }
								},
								{
								    type: 'select',
								    idtemplate: 'Xaxis',
								    param: function () {
								        return appApmDashboard.boxval('Xaxis')
								    }
								},
								{
								    type: 'select',
								    idtemplate: 'Trendby',
								    onchange: function () { },
								    param: function () {
								        return appApmDashboard.boxval('Trendby')
								    }
								},
								{
								    type: 'select',
								    idtemplate: 'DataSource',
								    param: function () {
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
									    pcid: 'Payperiod2',
									    customdate: true,
									    dashboardformatting: true,
									    customdatewarning: true
									},
									{
									    pcid: 'Hiredate',
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
									},
									{
									    pcid: 'Qualityform'
									}
								]
        }],
        rank_gpaper: null,
        rank_gpaper2: null,
        rank2_gpaper: null,
        rank2_gpaper2: null,
        varirankgauge: function (o, gn) {
            $("#rank" + gn + "over").html("").show();
            if (o.paper == null) {
                o.paper = Raphael("rank" + gn + "over", 280, 50);
            }
            if (a$.exists(o.paper2)) {
                $("#rank" + gn + "over2").html("").show();
                if (o.paper2 == null) {
                    o.paper2 = Raphael("rank" + gn + "over2", 280, 50);
                }
                o.paper2.clear();
                $("#gaugediv1,#gaugediv2").css("height", "250px");
                $("#rankdiv1,#rankdiv2").css("height", "120px");
            }
            else {
                $("#rank" + gn + "over2").html("").hide();
                $("#gaugediv1,#gaugediv2").css("height", "200px");
                $("#rankdiv1,#rankdiv2").css("height", "70px");
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



    function multiChanged(t) {
        if (!$("#" + t)[0].hasAttribute("multiple")) return;

        var v = $("#" + t).val();
        var changed = false;
        var hasall = false;
        var haseach = false;
        for (var i in v) {
            if (v[i] == "") {
                hasall = true;
            }
            else if (v[i] == "each") {
                haseach = true;
            }
        }
        if (v == null) {
            $(".search-choice", $("#" + t).next()).remove();
            v = [""];
            $("#" + t).val(v).trigger("change");
            return;
        } else if (hasall) {
            if (m_was[t].other || m_was[t].each) {
                //Changing to all
                for (i = v.length - 1; i >= 0; i--) {
                    if (v[i] != "") {
                        v.splice(i, 1);
                    }
                }
                m_was[t].all = true;
                m_was[t].each = false;
                m_was[t].other = false;
            } else { //Was "all" before
                if (haseach) {
                    //changing to each
                    for (i = v.length - 1; i >= 0; i--) {
                        if (v[i] != "each") {
                            v.splice(i, 1);
                        }
                    }
                    m_was[t].each = true;
                    m_was[t].all = false;
                } else if (v.length > 1) {
                    //changing to other  
                    //v.splice(0, 1); //Splice out all?
                    for (i = v.length - 1; i >= 0; i--) {
                        if (v[i] == "") {
                            v.splice(i, 1);
                        }
                    }
                    m_was[t].other = true;
                    m_was[t].all = false;
                } else {
                    m_was[t].all = true;
                    m_was[t].each = false;
                    m_was[t].other = false;
                }
            }
        } else if (haseach) { //All is not selected, but each is.
            if (m_was[t].other || m_was[t].all) {
                //Changing to each
                for (i = v.length - 1; i >= 0; i--) {
                    if (v[i] != "each") {
                        v.splice(i, 1);
                    }
                }
                m_was[t].all = false;
                m_was[t].each = true;
                m_was[t].other = false;
            } else if (v.length > 1) {
                //changing to other
                //v.splice(0, 1); //Splice out each?
                for (i = v.length - 1; i >= 0; i--) {
                    if (v[i] == "each") {
                        v.splice(i, 1);
                    }
                }
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
        /* TODO: Revisit this
        if (m_was[t].each || m_was[t].other) {
        if ((v.length > 1) && (v[0] == "")) {
        v.splice(0, 1);
        }
        }
        */
        changed = true;
        if (changed) {
            $("#" + t).val(v);
            $("#" + t).trigger("liszt:updated");
        }
    }

    function multiSetMultiple(t) {
        if (!$("#" + t)[0].hasAttribute("multiple")) {
            if ($("#" + t + " option").length <= 1) return;
            //2024-03-10 - If there's no all or each in the list, then don't allow multiple to be set.
            var aoe = false;
            $("#" + t + " option").each(function () {
                if (($(this).attr("value") == "") || ($(this).attr("value") == "each")) aoe = true;
            });
            if (!aoe) return; //May need to call set single, not sure.

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

    window.CoxFiltersReady = false;
    window.CoxReportlistReady = false;
    $(document).ready(function () {

        if (a$.gup("inframe") != "") {
            $("#AcuityApp").addClass("Acuity-Inframe");
        }

        //$(".auth-display").show();
        //$(".auth-token-show").html($.cookie("uid"));


        //Prevent form submission on any enter entry.
        $(document).ready(function () {
            $(window).keydown(function (event) {
                if ((event.keyCode == 13) && $(event.target).is('input')) {
                    if (true) { //Try turning this off. $(event.target).hasClass("chat-inputline")) {
                        $(event.target).trigger("change");
                    }
                    else {
                        event.preventDefault();
                    }
                    return false;
                }
            });
        });

        var remel = false;

        handler = function (e) {
            console.log("MAIN2 click - " + e.target.closest("li"));
        }
        function keepclick() {
            /*
            if (remel) document.removeEventListener("click", handler, false);
            document.addEventListener("click", handler, false);
            remel = true;
            */

            $("li,a,span").unbind("click").bind("click", function () {
                var tc = $(this).closest("li");
                if (!tc) tc = $(this).closest("a");
                if (!tc) tc = $(this).closest("span");
                if (!tc) tc = $(this).closest("div");
                if (tc) {
                    console.log("MAIN click - " + $(tc).prop("outerHTML"));
                }
                else {
                    console.log("MAIN click (nf) - " + $(this).prop("outerHTML"));
                }
            });

            setTimeout(keepclick, 100);
        }
        //keepclick();

        //var bypassclick = window.onclick;
        function keepclick2() {
            window.onclick = function (e) {
                console.log("Click Intercept"); // " = " + JSON.stringify(e));
                //bypassclick();
            }
            setTimeout(keepclick2, 500);
        }
        //keepclick2();

        /*
        $('*').on('change click dblclick select submit', function (e) {
        if (e.target != null) {
        var t = "";
        if (typeof e.target == "object") {
        //t = JSON.stringify(e.target).substring(0, 200);
        t = $(e.target).prop("outerHTML").substring(0, 200);
        }
        else {
        t = e.target;
        }
        console.log("Global Intercept - type=" + e.type + ", target=" + t);
        }
        });
        */

        //SPLASH EXPERIMENT
        $(".splash").hide();

        if (a$.urlprefix(true).indexOf("mnt") == 0) {
            $("#sandboxtab").show();
           // $(".launcher-menu").hide();
        }
        else {
            $("#SandboxIframe").remove();
        }

        if ((a$.urlprefix(true).indexOf("mnt") == 0) || (a$.urlprefix() == "cox.")) {
            $("#overviewtab").show(); //Overview on, or used by all roles.
        }
        else if (($.cookie("TP1Role") == "Admin")
            || ($.cookie("TP1Role") == "CorpAdmin")
            || ((a$.urlprefix() == "nspc.") && ($.cookie("TP1Role") != "CSR"))
            || ((a$.urlprefix() == "ultracx.") && ($.cookie("TP1Role") != "CSR"))
        ) {
            $("#overviewtab").show(); //Overview on for EVERYONE at Admin & CorpAdmin roles.
        }
        else {
            $("#OverviewIframe").remove();
            $('#overviewlabel').remove();
        }

        a$.ajax({
            type: "GET",
            service: "JScript",
            async: true,
            data: {
                lib: "spine",
                cmd: "ipfound",
                type: "demo"
            },
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: function (json) {
                if (a$.jsonerror(json)) {
                }
                else {
                    if ((json.ipfound == "Yes")
                        || (a$.gup("sud") != "")
                        || (a$.urlprefix(true).indexOf("mnt") == 0)
                        || (a$.urlprefix() == "collective-solution.")
                        || (a$.urlprefix() == "walgreens.")
                        || (a$.urlprefix() == "cox.")
                        || (a$.urlprefix() == "da.")
                        || (a$.urlprefix() == "ultracx.")
                        || ((a$.urlprefix() == "chime.") && (($.cookie("TP1Username").toLowerCase() != "dboleware") && ($.cookie("TP1Username").toLowerCase() != "jdrapkin") && ($.cookie("TP1Username").toLowerCase() != "kwade") && ($.cookie("TP1Username").toLowerCase() != "charris-huguley") && ($.cookie("TP1Username").toLowerCase() != "wgoodwine") && ($.cookie("TP1Username").toLowerCase() != "jhall002") && ($.cookie("TP1Username").toLowerCase() != "tmatthews003") && ($.cookie("TP1Username").toLowerCase() != "sholman") && ($.cookie("TP1Username").toLowerCase() != "emullins")))
                        || (a$.urlprefix() == "nspc.")
                        || (a$.urlprefix() == "km2.")
                        || (a$.urlprefix() == "test-km2.")
                        || (a$.urlprefix() == "ers.")
                        || (a$.urlprefix(true).indexOf("mnt") == 0)
                        || (a$.urlprefix(true).indexOf("alpha") == 0)
                    ) {
                        /* || ((a$.urlprefix() == "veyo.") &&
                        (($.cookie("TP1Role") == "Admin")
                        || ($.cookie("TP1Role") == "Team Leader")
                        || ($.cookie("TP1Role") == "CSR")
                        )
                        ) */

                        $("#userdashboardtab").show();
                        if (!(((a$.urlprefix() == "walgreens.") || (a$.urlprefix() == "da.") || (a$.urlprefix() == "ultracx.") || ((a$.urlprefix() == "chime.") && (($.cookie("TP1Username").toLowerCase() != "dboleware") && ($.cookie("TP1Username").toLowerCase() != "jdrapkin") && ($.cookie("TP1Username").toLowerCase() != "kwade") && ($.cookie("TP1Username").toLowerCase() != "charris-huguley") && ($.cookie("TP1Username").toLowerCase() != "wgoodwine") && ($.cookie("TP1Username").toLowerCase() != "jhall002") && ($.cookie("TP1Username").toLowerCase() != "tmatthews003") && ($.cookie("TP1Username").toLowerCase() != "sholman") && ($.cookie("TP1Username").toLowerCase() != "emullins"))) || (a$.urlprefix() == "nspc.") || (a$.urlprefix() == "km2.") || (a$.urlprefix() == "test-km2.") || (a$.urlprefix() == "ers.") || (a$.urlprefix(true).indexOf("mnt") == 0) || (a$.urlprefix(true).indexOf("alpha") == 0)) && ($.cookie("TP1Role") == "Team Leader"))) {
                            $("#UserdashboardIframe").attr("src", "../3/ng/UserDashboard/default.aspx?prefix=" + a$.urlprefix().split(".")[0]);
                        }
                    }
                }
            }
        });

        window.Selected = {};
        appEasycom.init(); //MADELIVE

        //if ((a$.urlprefix() == "walgreens.") && ($.cookie("TP1Role") == "CSR")) { //No need to wait at all, I don't think (userdashboard doesn't care about filters).
        //    $('#userdashboardlabel').trigger('click'); //CHANGED
        //}
        if ((a$.urlprefix() == "performant.") || (a$.urlprefix() == "performant-recovery.") || (a$.urlprefix() == "cox.") || (a$.urlprefix() == "walgreens.") || (a$.urlprefix() == "da.") || ((a$.urlprefix() == "chime.") && (($.cookie("TP1Username").toLowerCase() != "dboleware") && ($.cookie("TP1Username").toLowerCase() != "jdrapkin") && ($.cookie("TP1Username").toLowerCase() != "kwade") && ($.cookie("TP1Username").toLowerCase() != "charris-huguley") && ($.cookie("TP1Username").toLowerCase() != "wgoodwine") && ($.cookie("TP1Username").toLowerCase() != "jhall002") && ($.cookie("TP1Username").toLowerCase() != "tmatthews003") && ($.cookie("TP1Username").toLowerCase() != "sholman") && ($.cookie("TP1Username").toLowerCase() != "emullins"))) || (a$.urlprefix() == "nspc.") || (a$.urlprefix() == "km2.") || (a$.urlprefix() == "test-km2.") || (a$.urlprefix() == "ers.") //TEMP || (a$.urlprefix(true).indexOf("mnt") == 0)
        ) {
            if ((a$.urlprefix() == "performant.")
            || (a$.urlprefix() == "performant-recovery.")
            || ((a$.urlprefix() == "cox.") && ($.cookie("TP1Role") == "Team Leader") || ($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin"))
            || ((a$.urlprefix() == "walgreens.") /* && ($.cookie("TP1Role") == "CSR") */)
            || (a$.urlprefix() == "da.")
            || (a$.urlprefix() == "ultracx.")
            || ((a$.urlprefix() == "chime.") && (($.cookie("TP1Username").toLowerCase() != "dboleware") && ($.cookie("TP1Username").toLowerCase() != "jdrapkin") && ($.cookie("TP1Username").toLowerCase() != "kwade") && ($.cookie("TP1Username").toLowerCase() != "charris-huguley") && ($.cookie("TP1Username").toLowerCase() != "wgoodwine") && ($.cookie("TP1Username").toLowerCase() != "jhall002") && ($.cookie("TP1Username").toLowerCase() != "tmatthews003") && ($.cookie("TP1Username").toLowerCase() != "sholman") && ($.cookie("TP1Username").toLowerCase() != "emullins")))
            || (a$.urlprefix() == "nspc.")
            || (a$.urlprefix() == "km2.")
            || (a$.urlprefix() == "test-km2.")
            || (a$.urlprefix() == "ers.") //duck
            || (a$.urlprefix(true).indexOf("mnt") == 0)
            || (a$.urlprefix(true).indexOf("alpha") == 0)
            ) {
                //if (($.cookie("TP1Role") == "Admin")) {
                if ((a$.urlprefix() == "performant.") || (a$.urlprefix() == "performant-recovery.")) {
                    setTimeout(switchtabs, 6000);
                }
                else {
                    $(".qa-coxexecutive").show();
                    setTimeout(switchtabs, 100);  //WHY WAIT LONGER?
                }
                function switchtabs() {
                    if (window.CoxFiltersReady && window.CoxReportlistReady) {
                        //NO LONGER FILTER UPDATES on Tab Switch: window.CoxFiltersReady = false;
                        if (false) { //DOING BELOW NOW ((a$.urlprefix() == "cox.") && ($.cookie("TP1Role") == "Team Leader")) {
                            //Don't click until CoxFiltersReady is ready.
                            $('#journalformlabel').trigger('click'); //Nav to sidekick
                            $(".qa-coxexecutive").hide();
                        }
                        else {
                            //$('#overviewlabel').trigger('click');
                            setTimeout(coxclickplot, 100);
                            function coxclickplot() {
                                if (window.CoxFiltersReady) {
                                    if (((a$.urlprefix() == "walgreens.") || (a$.urlprefix() == "ultracx.") || (a$.urlprefix() == "da.") || ((a$.urlprefix() == "chime.") && (($.cookie("TP1Username").toLowerCase() != "dboleware") && ($.cookie("TP1Username").toLowerCase() != "jdrapkin") && ($.cookie("TP1Username").toLowerCase() != "kwade") && ($.cookie("TP1Username").toLowerCase() != "charris-huguley") && ($.cookie("TP1Username").toLowerCase() != "wgoodwine") && ($.cookie("TP1Username").toLowerCase() != "jhall002") && ($.cookie("TP1Username").toLowerCase() != "tmatthews003") && ($.cookie("TP1Username").toLowerCase() != "sholman") && ($.cookie("TP1Username").toLowerCase() != "emullins"))) || (a$.urlprefix() == "nspc.") || (a$.urlprefix() == "km2.") || (a$.urlprefix() == "test-km2.") || (a$.urlprefix() == "ers.") || (a$.urlprefix(true).indexOf("mnt") == 0) || (a$.urlprefix(true).indexOf("alpha") == 0)) && ($.cookie("TP1Role") != "Team Leader")) {
                                        $('#userdashboardlabel').trigger('click');
                                    }
                                    else {
                                        if ($.cookie("TP1Role") == "Team Leader") {
                                            if (a$.urlprefix() != "performant.") {
                                                $('#journalformlabel').trigger('click'); //Nav to sidekick
                                            }
                                        }
                                        else {
                                            $('#overviewlabel').trigger('click'); //CHANGED
                                        }
                                    }
                                    $(".qa-coxexecutive").hide();
                                    /*
                                    //NEED? $(".btnPlot").trigger('click');
                                    if ($.cookie("TP1Username").toLowerCase() == "jocrXXXaven") {
                                    alert("debug: A-Game Test - please dismiss and ignore this message.");
                                    }
                                    function coxfinalnavigate() {
                                    //NEED? ko.postbox.publish("CoxEmergencyNavigation", true);
                                    $(".qa-coxexecutive").hide();
                                    }
                                    setTimeout(coxfinalnavigate, 1000);
                                    */
                                }
                                else {
                                    setTimeout(coxclickplot, 100);
                                }
                            }
                        }
                    }
                    else {
                        setTimeout(switchtabs, 100);
                    }
                }
            }
        }

        switch (a$.urlprefix()) {
            case "ers.":
                document.title = "Acuity 2.0 - TSI";
                break;
            /*
            case "chime.":
            document.title = "ChimeScore 2.0";
            break;
            */ 
            default:
                document.title = "Acuity 2.0 - " + a$.urlprefix().split(".")[0].toUpperCase();
        }

        //Don't allow an "-import" login to access the dashboard.
        if (a$.urlprefix().indexOf("-import.") >= 0) {
            var wd = window.location.href;
            window.location = wd.replace("-import", "");
            return;
        }

        if (a$.gup("dev") == "1") {
            /* //Whichever one is listed first isn't getting the subscribes (or something).
            */
            $("#helloworldtab").show();
            ko.applyBindings(HelloWorldViewModel({ config: "Dashboard" }), $(".helloworld-wrapper")[0]);

            $("#treasurehunttab").show();
            ko.applyBindings(TreasureHuntViewModel({ config: "Dashboard" }), $(".treasurehunt-wrapper")[0]);
        }

        appApmReport.init({});

        $(".acuity-print").bind("click", function () {
            //alert("debug:printing reports section..");
            appApmReport.printReport($(".ReportReports").eq(0));
        });
        $(".acuity-print-grid").bind("click", function () {
            alert("debug:printing reports from grid section..");
            appApmReport.printReport($("#myreportcontainer"));
        });

        appApmSettings.init({
            id: "StgFilterType",
            ui: "combo"
        });

        if ((a$.urlprefix() == "bgr.") || (a$.urlprefix() == "cox.")) {
            $("#StgFilterType select").val("Singular");
        }
        else {
            $("#StgFilterType").hide();
        }

        $("#StgFilterType select").bind("change", function () {
            if ($(this).val() == "Singular") {
                //multiSetSingle("selProjects");
                multiSetSingle("selLocations");
                multiSetSingle("selGroups");
                multiSetSingle("selTeams");
                multiSetSingle("selCSRs");
            }
            else if ($(this).val() == "Multiple") {
                //multiSetMultiple("selProjects");
                multiSetMultiple("selLocations");
                multiSetMultiple("selGroups");
                multiSetMultiple("selTeams");
                multiSetMultiple("selCSRs");
            }
        });


        if ((a$.gup("oldfilters") != "Y") && ($("#StgFilterType select").val() == "Multiple")) {
            setTimeout(function () {
                //multiSetMultiple("selProjects");
                multiSetMultiple("selLocations");
                multiSetMultiple("selGroups");
                multiSetMultiple("selTeams");
                multiSetMultiple("selCSRs");
            }, 5000);
        }

        //Note: there are other binds on these buttons.
        $("#rdoGrid").bind("click", function () {
            $(".home-print-wrapper").show();
            if ((a$.urlprefix() == "km2.") || (a$.urlprefix().indexOf("test-km2.") >= 0)) {
                $("#kpidl").hide();
            }
            $("#btnAdd,#btnClear").hide();
            $(".stg-reportgrouping-show").show();
            $(".gaugesdiv-wrapper").hide();

            if (a$.gup("oldfilters") != "Y") return;

            if ($("#StgFilterType select").val() == "Singular") return;

            //multiSetMultiple("selProjects");
            multiSetMultiple("selLocations");
            multiSetMultiple("selGroups");
            multiSetMultiple("selTeams");
            multiSetMultiple("selCSRs");
        });

        $("#rdoBase,#rdoTrend,#rdoPay").bind("click", function () {
            $(".home-print-wrapper").hide();
            if ((a$.urlprefix() == "km2.") || (a$.urlprefix().indexOf("test-km2.") >= 0)) {
                $("#kpidl").show();
            }
            $("#btnAdd,#btnClear").show();
            $(".stg-reportgrouping-show").hide();

            if (a$.urlprefix() == "NOTwalgreens.") {
                $(".gaugesdiv-wrapper").css("height", "35px");
                $(".gaugesdiv-wrapper").css("overflow-y", "hidden");
            }
            $(".gaugesdiv-wrapper").show();

            if (a$.gup("oldfilters") != "Y") return;

            if ($("#StgFilterType select").val() == "Multiple") return;

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
            if ($.cookie("TP1ChangePassword") == "Y") {
                qa_changepassword({});
            }
        }

        if (a$.urlprefix() == "km2.") {
            $("#changepassword_li").hide();
        }
        else {
            $("#changepassword_li").unbind().bind("click", function () {
                $(".qa-changepassword h1").html("Change Password");
                $(".qa-changepassword-extra").html("");
                $(".qa-changepassword-submiterror").hide();
                $(".qa-changepassword-text-current").val("").trigger("keyup");
                qa_changepassword({});
                window.appApmNavMenus.closeSide();
            });
        }

        if (($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin")) {
        }
        else if ((a$.urlprefix() == "walgreens.") && ($.cookie("TP1Role") != "CSR")) {
        }
        else {
            $("#newadmin_li").hide();
        }

        if ((a$.urlprefix(true).indexOf("mnt") == 0) && ($.cookie("TP1Role") == "Admin")) {
            $("#clintwerx_li").show();
        }

        if (($.cookie("TP1Role") == "Admin")
            || (a$.urlprefix().toString().toLowerCase() == "ultracx.")
            || ((a$.urlprefix().toString().toLowerCase() == "walgreens.") &&
                (($.cookie("TP1Role") == "CorpAdmin")
                 || ($.cookie("TP1Role") == "Management")
                )
            )                
            || ((a$.urlprefix().toString().toLowerCase() == "da.")
                && (($.cookie("TP1Username").toLowerCase() == "u025533")
                    || ($.cookie("TP1Username").toLowerCase() == "u067719")
                    || ($.cookie("TP1Username").toLowerCase() == "u087723")
                    || ($.cookie("TP1Username").toLowerCase() == "u682739")
                    || ($.cookie("TP1Username").toLowerCase() == "u885766")
                    || ($.cookie("TP1Username").toLowerCase() == "u938707")
                )
            )
        ) {
            $("#qmdashboard_li").show();
            $("#autoqa_li").show();
            $("#performance_li").show();
        }

        if ((a$.urlprefix() == "km2.") && (($.cookie("TP1Role") == "Admin")
           || ($.cookie("TP1Username").toLowerCase() == "lisa.thompson")
           || ($.cookie("TP1Username").toLowerCase() == "micah.humphrey")
           || ($.cookie("TP1Username").toLowerCase() == "michele.ward")
        )) {
            /*
            var myframe = $("#Km2complianceIframe").eq(0);
            if ($(myframe).attr("src") == "") {
                $(myframe).attr("src", a$.debugPrefix() + "/3/customization/KM2/KM2ComplianceDashboard.aspx?prefix=" + a$.urlprefix().split(".")[0]);
            }
            */
            $("#km2compliancetab").show();
        }

        $("#newadmin_li").css("color", "lightgray").css("cursor", "wait");

        $("#newadmin_li").css("color", "black").css("cursor", "pointer"); //TODO: Restrictions?

        $("#newadmin_li").unbind().bind("click", function () {
            //alert("debug: clicked new admin");
            var myframe = $("#AdminIframe").eq(0);
            if ($(myframe).attr("src") == "") {
                $(myframe).attr("src", a$.debugPrefix() + "/3/ng/AcuityAdmin/default.aspx?prefix=" + a$.urlprefix().split(".")[0]);
            }
            $("#admintab").show();
            $("#adminlabel").trigger("click");
            window.appApmNavMenus.closeSide();
        });

        $("#clintwerx_li").unbind().bind("click", function () {
            //alert("debug: clicked new admin");
            var myframe = $("#ClintwerxIframe").eq(0);
            if ($(myframe).attr("src") == "") {
                //$(myframe).attr("src", a$.debugPrefix() + "/3/ng/MyTeamView/default.aspx?prefix=" + a$.urlprefix().split(".")[0]);                
                $(myframe).attr("src", a$.debugPrefix() + "/3/ng/IncentivesRewards/default.aspx?prefix=" + a$.urlprefix().split(".")[0]);
            }
            $("#clintwerxtab").show();
            $("#clintwerxlabel").trigger("click");
            window.appApmNavMenus.closeSide();
        });

        $("#performance_li").unbind().bind("click", function () {
            //alert("debug: clicked new admin");
            var myframe = $("#PerformanceIframe").eq(0);
            if ($(myframe).attr("src") == "") {
                //$(myframe).attr("src", a$.debugPrefix() + "/3/ng/MyTeamView/default.aspx?prefix=" + a$.urlprefix().split(".")[0]);
                $(myframe).attr("src", a$.debugPrefix() + "/3/ng/UsageViewer/default.aspx?prefix=" + a$.urlprefix().split(".")[0]);
            }
            $("#performancetab").show();
            $("#performancelabel").trigger("click");
            window.appApmNavMenus.closeSide();
        });

        $("#qmdashboard_li").unbind().bind("click", function () {
            //alert("debug: clicked new admin");
            var myframe = $("#QmdashboardIframe").eq(0);
            if ($(myframe).attr("src") == "") {
                //$(myframe).attr("src", a$.debugPrefix() + "/3/ng/MyTeamView/default.aspx?prefix=" + a$.urlprefix().split(".")[0]);
                $(myframe).attr("src", a$.debugPrefix() + "/3/ng/AutoQa/default.aspx?prefix=" + a$.urlprefix().split(".")[0]);
            }
            $("#qmdashboardtab").show();
            $("#qmdashboardlabel").trigger("click");
            window.appApmNavMenus.closeSide();
        });

        $("#autoqa_li").unbind().bind("click", function () {
            //alert("debug: clicked new admin");
            var myframe = $("#AutoqaIframe").eq(0);
            if ($(myframe).attr("src") == "") {
                $(myframe).attr("src", a$.debugPrefix() + "/3/ng/AiServe/default.aspx?aidev=" + a$.gup("aidev") + "&prefix=" + a$.urlprefix().split(".")[0]);
            }
            $("#autoqatab").show();
            $("#autoqalabel").trigger("click");
            window.appApmNavMenus.closeSide();
        });

        setTimeout(
            function () {
                $("#qa_div").qa({
                    action: "loginInit"
                });
            }
        , 10000);

        /*
        qa_1();
        $(".qa-bubble").bind("click", function () {
        $(this).hide();
        qa_2();
        });
        */


        document.CONFIG = "Dashboard";

        if ((a$.urlprefix() == "km2.") && (($.cookie("TP1Role") == "Admin")
            || ($.cookie("TP1Username").toLowerCase() == "kristely.meza")
            || ($.cookie("TP1Username").toLowerCase() == "sara.euceda")
            || ($.cookie("TP1Username").toLowerCase() == "carrison.mayers")
            || ($.cookie("TP1Username").toLowerCase() == "isamar.carvajal")
            || ($.cookie("TP1Username").toLowerCase() == "jose.verhelst")
            || ($.cookie("TP1Username").toLowerCase() == "josselyn.boquin")
            || ($.cookie("TP1Username").toLowerCase() == "karina.cabral")
            || ($.cookie("TP1Username").toLowerCase() == "milene.herman")
            || ($.cookie("TP1Username").toLowerCase() == "nigel.thomas")
            )) {
            $(".message-notifier-wrapper-km2").show();
            $(".beacon-launch-wrapper").show();
        }
        else if (((a$.urlprefix() == "ces.") || (a$.urlprefix() == "ces-demo.")) && (($.cookie("TP1Role") == "CorpXXXXXXAdmin") || ($.cookie("TP1Role") == "Admin")
                             || ($.cookie("TP1Username").toLowerCase() == "jangulo")
                            )) {
            $(".message-notifier-wrapper-ces").show();
        }
        else if ((a$.urlprefix() == "ers.") && (($.cookie("TP1Role") == "CorpAdmin") || ($.cookie("TP1Role") == "Admin"))) {
            $(".message-notifier-wrapper-ers").show();
        }
        else if ((a$.urlprefix() == "chime.") && (($.cookie("TP1Role") == "CorpAdmin") || ($.cookie("TP1Role") == "Admin")
                             || ($.cookie("TP1Username").toLowerCase() == "shammon")
                             || ($.cookie("TP1Username").toLowerCase() == "tvalentine")
                             || ($.cookie("TP1Username").toLowerCase() == "nwalford")
                             || ($.cookie("TP1Username").toLowerCase() == "byoung")
                             || ($.cookie("TP1Username").toLowerCase() == "msalasrios")
                            )) {
            $(".message-notifier-wrapper-chime").show();
        }
        else if (($.cookie("TP1Role") == "Admin")) {
            $(".message-notifier-wrapper-all").show();
        }

        //MAKEDEV
        if (true) { //((a$.urlprefix() == "ers.") || ((a$.urlprefix() == "ces.") || (a$.urlprefix() == "ces-demo.")) || (a$.urlprefix() == "chime.") || (a$.urlprefix() == "chime-make40.") || (a$.urlprefix() == "chime-mnt.") || (a$.urlprefix() == "cox.") || (a$.urlprefix() == "performant.") || (a$.urlprefix() == "frost-arnett.")) {
            if ($.cookie("TP1Role") != "CSR") {
                var csrword = "Consultant";
                if (!((a$.urlprefix() == "chime.") || (a$.urlprefix() == "chime-make40.") || (a$.urlprefix() == "chime-mnt."))) {
                    csrword = "CSR";
                    $("#resetpassword_li").html("Reset " + csrword + " Password");
                }
                if ((a$.urlprefix() == "performant.") || (a$.urlprefix() == "performant-mnt.")) {
                    csrword = "Case Worker";
                }
                var showpwr = true;
                if ((a$.urlprefix() == "collective-solution.") && (($.cookie("TP1Role") != "Management") && ($.cookie("TP1Role") != "CorpAdmin") && ($.cookie("TP1Role") != "Admin"))) {
                    showpwr = false;
                }

                if (a$.urlprefix() == "km2.") {
                    $("#resetpassword_li").hide();
                }
                else if (showpwr) {
                    $("#resetpassword_li").show().unbind().bind("click", function () {
                        if (($("#selCSRs").val() == "") || ($("#selCSRs").val() == "each")) {
                            alert("Please select a " + csrword + " using the filters (on the left), then select 'Reset " + csrword + " Password' again.");
                            window.appApmNavMenus.closeSide();
                        }
                        else {
                            var csr = $("#selCSRs").val();
                            var prompt = "Are you sure you want to reset the password for '" + $("#selCSRs option:selected").text() + "'?\n\n";
                            if (!((a$.urlprefix() == "chime.") || (a$.urlprefix() == "chime-make40.") || (a$.urlprefix() == "chime-mnt."))) {
                                prompt += "Password will be reset to: P@ssw0rd\n\n";
                            }
                            prompt += "Press Ok to continue.";
                            var r = confirm(prompt);
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
                                    if (a$.jsonerror(json)) {
                                    }
                                    else {
                                        alert("Password Reset Successful!");
                                    }
                                }
                                window.appApmNavMenus.closeSide();
                            }
                        }
                    });
                }
            }
        }
        $(".report-filter-wrapper").qtip({
            content: "New Feature!<br /><br />Filters will find all matches in all tables below.<br />Filters are case-sensitive.<br />Multiple filters are allowed,<br />separated by spaces.<br /><br />Filters persist when you change or refresh the report (delete the text to clear)."
        });
        //Experimental "report panel" in main dashboard.
        if ((a$.urlprefix() == "km2.") || (a$.urlprefix().indexOf("test-km2.") >= 0)) {
            $("#myreportcontainer").show();
            //Don't hide this now.  RAY: $(".gaugesdiv-wrapper").hide();
            if ($.cookie("TP1Role") != "CSR") {
                //TODO: Disable for now: $("#presetsdl").show();


                $("#selPresets").val("").qtip({
                    content: 'Select a saved setup to view.'
                }).bind("change", function () {
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
                $(".filters-presets-link").bind("click", function () {
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
                            $("#selPresets option").each(function () {
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
            ui: "combo"
        });
        $("#StgReportGrouping select").bind("change", function () {
            appApmReport.plotIntercept(0, true, false);
        });

        appApmSettings.init({
            id: "StgView",
            ui: "combo"
        });
        appApmSettings.init({
            id: "StgViewDateType",
            ui: "combo"
        });
        $("#StgView select").bind("change", function () {
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
        $("#StgViewDateType select").bind("change", function () {
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

        if (true) { //($.cookie("TP1Role") != "CSR") {
            ko.applyBindings(FilterAttributesViewModel({
                config: "Dashboard",
                readonly: ($.cookie("TP1Role") == "CSR")
            }), $(".filters-attributes-wrapper")[0]);
            $("#filtersdiv").show(); //ALWAYS show now
        } else {
            $("#filterlabel").hide();
            $("#filtergroup").hide();
            $(".filters-attributes-link").hide();
        }

        var showagame = true;
        if ($.cookie("ApmProjectFilter") != null) {
            if (($.cookie("ApmProjectFilter") != "none") && ($.cookie("ApmProjectFilter") != "")) {
                if (false) { //2024-01-24 disallowed.  (a$.urlprefix() != "da.") { //restricted agents on DA are allowed to see A-GAME.
                    showagame = false;
                }
            }
        }
        /*
        if (a$.urlprefix().indexOf("km2") >= 0) {
        showagame = false; //Just to buy some time.
        }
        */

        if (a$.gup("wand") != "") {
            $(".headericon-wand").show().bind("click", function () {
                window.open('agent/default.aspx', 'Agent', 'width=600,height=400')
            });
        }

        if (true) { //((a$.urlprefix() == "chime.")) {
            $("#profile_li").show().bind("click", function () {
                $('#fanlabel').trigger('click');
                ko.postbox.publish("Fan_PlayerSetup", "Yeah");
            });
        }

        if ((a$.urlprefix() == "chime.") && ($.cookie("TP1Role") != "CSR")) {
            $("#lbtab").show();
            $("#LeaderboardIframe").attr("src", "../3/Leaderboardv0.aspx?prefix=" + a$.urlprefix().split(".")[0]);
        }
        else {
            $("#lbtab").hide();
        }

        /*
        if (a$.urlprefix() == "chime.") {
        showagame = false;
        }
        */

        if (showagame) {
            var dateoffset = 0;
            if (a$.gup("dateoffset") != "") {
                dateoffset = parseInt(a$.gup("dateoffset"));
            }

            var gametheme = "";
            var gametest = false;

            if ((a$.urlprefix() == "cthix.") || (a$.urlprefix() == "ers.")) {
                //Returning to football for gridiron development
                gametheme = "football";
                gametest = false;
            } else if ((a$.urlprefix() == "da.")) {
                gametheme = "basketball";
                gametest = false;
            } else if (debug_makingsprintgame || (a$.urlprefix() == "sprintgame.")) {
                gametheme = "summer olympics";
                gametest = false;
            } else if ((a$.urlprefix() == "vec.")) {
                gametheme = "football";
                gametest = false;
            }

            var lid = 0;

            if ((!debug_makingsprintgame) && (a$.urlprefix().indexOf("make40.") >= 0)) { //TEST: Quick switch for theme in Make40
                gametheme = "basketball";
                gametest = false;
                //lid = 2;
            }


            if ((a$.urlprefix().indexOf("chime-make40.") >= 0) || (a$.urlprefix() == "chime.") || (a$.urlprefix() == "chime-mnt.")) {
                if ($.cookie("TP1Role") != "CSR") {
                    gametheme = "basketball";
                    gametest = false;
                }
                else {
                    gametheme = "basketball";
                    gametest = false;
                }
            }

            if ((a$.urlprefix().indexOf("km2-make40.") >= 0) || (a$.urlprefix() == "km2.")) {
                gametheme = "soccer";
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
                gametheme = "tiki";
                gametest = false;
            }
            if ((a$.urlprefix() == "make40.") || (a$.urlprefix() == "ers.")) {
                //dateoffset = 210;
                gametheme = "football";
                gametest = false;
            }

            //Ok, everything's football unless cox or bgr or CES
            gametheme = "football";

            if ((a$.urlprefix() == "da.")) {
                gametheme = "basketball";
                gametest = false;
            }

            if ((a$.urlprefix() == "cox.") || (a$.urlprefix() == "cox-test.") || (a$.urlprefix() == "cox-mnt.") || (a$.urlprefix() == "cox-mnt-julie.")) {
                if (true) { //(($.cookie("TP1Role") == "Admin")||($.cookie("TP1Role") == "CorpAdmin")||($.cookie("TP1Role") == "Management")) {
                    gametheme = "football";
                    gametest = false;
                }
            }


            if ((a$.urlprefix() == "bgr.") || (a$.urlprefix() == "bgr-mnt.") || (a$.urlprefix() == "bgr-test.") || (a$.urlprefix() == "bgr-make40.")) {
                gametheme = "tiki";
                gametest = false;
            }
            if ((a$.urlprefix() == "frost-arnett.") || (a$.urlprefix() == "frost-arnett-mnt.") || (a$.urlprefix() == "ers-mnt-julie.")) {
                gametheme = "tiki";
                gametest = false;
            }
            if ((a$.urlprefix() == "veyo.") || (a$.urlprefix() == "mtm.")) {
                gametheme = "basketball";
                //dateoffset = -52;
                gametest = false;
            }

            if ((a$.urlprefix() == "united.") || (a$.urlprefix() == "united2.")) {
                gametheme = "football";
                //dateoffset = -52;
                gametest = false;
            }


            if (a$.urlprefix().toString().toLowerCase() == "ultracx.") {
                gametheme = "unicorn";
                gametest = false;
            }

            if (a$.urlprefix() == "walgreens.") {
                gametheme = "basketball";
                //dateoffset = -52;
                gametest = false;
            }

            //..unless overridden
            if (a$.gup("gametheme") != "") {
                gametheme = a$.gup("gametheme");
                if ((gametheme == "tiki") || (gametheme == "dragons")) {
                    gametest = true;
                }
            }

            //gametheme = "tiki";
            // "ces."

            //gametest=true; //TEST TEST TEST
            $("#fantab").hide();
            if (false) { //(a$.urlprefix() == "chime.") { //SPLASH EXP 3
                gametheme = "";
                $("#fantab").show();
            }
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
            }).bind("click", function () {
                $("#fantab").show();
                $("#fanlabel").trigger("click");
            });

            $(".headericon-xtreme").qtip({
                content: 'Add Player to Xtreme Queue'
            }).bind("click", function () {
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
            action: "init",
            shownot: (a$.urlprefix() == "ers.")
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
        else if ((a$.urlprefix() == "united.") || (a$.urlprefix() == "united2.")) {
            stgRankPointsLabel = "CCC"; //debug: for development.
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
        /*
        $('#daterange').qtip({
        content: 'Slide left/right<br />to select a range of dates for the trend report.'
        });
        */

        $('#rankdiv1,#rankdiv2').qtip({
            content: 'Ranking is calculated NIGHTLY.  Scores imported today may not be included in the calculation.'
        });

        if (true) { //($.cookie("TP1Username") == "jeffgack") {
            var sBrowser, sUsrAg = navigator.userAgent;

            // The order matters here, and this may report false positives for unlisted browsers.

            if (sUsrAg.indexOf("Firefox") > -1) {
                sBrowser = "Mozilla Firefox";
                // "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0"
            } else if (sUsrAg.indexOf("SamsungBrowser") > -1) {
                sBrowser = "Samsung Internet";
                // "Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G955F Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/9.4 Chrome/67.0.3396.87 Mobile Safari/537.36
            } else if (sUsrAg.indexOf("Opera") > -1 || sUsrAg.indexOf("OPR") > -1) {
                sBrowser = "Opera";
                // "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 OPR/57.0.3098.106"
            } else if (sUsrAg.indexOf("Trident") > -1) {
                sBrowser = "Microsoft Internet Explorer";
                // "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; Zoom 3.6.0; wbx 1.0.0; rv:11.0) like Gecko"
            } else if (sUsrAg.indexOf("Edge") > -1) {
                sBrowser = "Microsoft Edge";
                // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299"
            } else if (sUsrAg.indexOf("Chrome") > -1) {
                sBrowser = "Google Chrome or Chromium";
                // "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/66.0.3359.181 Chrome/66.0.3359.181 Safari/537.36"
            } else if (sUsrAg.indexOf("Safari") > -1) {
                sBrowser = "Apple Safari";
                // "Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/604.1 980x1306"
            } else {
                sBrowser = "unknown";
            }
            a$.ajax({
                type: "GET",
                service: "JScript",
                async: true,
                data: {
                    lib: "admin",
                    cmd: "browser",
                    browser: sBrowser
                },
                dataType: "json",
                cache: false,
                error: a$.ajaxerror,
                success: browsersaved
            });
            function browsersaved(json) {
                if (a$.jsonerror(json)) {
                }
                else {
                    //alert("debug: saved");
                }
            };
        }

        $("#cepointstab").hide();
        $("#cepointsmgrtab").hide();
        $("#attritiontab").hide();
        $("#guidetab").hide();
        if (false) { //2024-06-05 - Moving this section to ApmReport for lag-loading.
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

        $("#guidetab").show();

        /* old way (replaced by general).
        if ((a$.urlprefix() == "cox.") || (a$.urlprefix() == "cox-mnt.")) {
        $("#GuideIframe").attr("src", "../applib/html/guides/cox-start-guide/index.htmlatest=80-");
        $("#guidetab").show();
        }
        if ((a$.urlprefix() == "chime.") || (a$.urlprefix() == "chime-mnt.")) {
        $("#GuideIframe").attr("src", "../applib/html/guides/chime-start-guide/index.htmlatest=80-");
        $("#guidetab").show();
        }
        if ((a$.urlprefix() == "frost-arnett.") || (a$.urlprefix() == "frost-arnett-mnt.")) {
        $("#GuideIframe").attr("src", "../applib/html/guides/frost-arnett-start-guide/index.html?a8");
        $("#guidetab").show();
        }
        if ((a$.urlprefix() == "veyo.") || (a$.urlprefix() == "veyo-test.") || (a$.urlprefix() == "veyo-mnt.")) {
        $("#GuideIframe").attr("src", "../applib/html/guides/veyo-start-guide/index.html?a6");
        $("#guidetab").show();
        }
        if ((a$.urlprefix() == "NOTbgr.") || (a$.urlprefix() == "bgr-test.") || (a$.urlprefix() == "bgr-mnt.")) {
        $("#GuideIframe").attr("src", "../applib/html/guides/bgr-start-guide/index.html?a6");
        $("#guidetab").show();
        }
        if ((a$.urlprefix() == "ers.") || (a$.urlprefix() == "ers-mnt.")) {
        $("#GuideIframe").attr("src", "../applib/html/guides/ers-start-guide/index.htmlatest=80-");
        $("#guidetab").show();
        }
        if ($.cookie("TP1Role") == "CSR") {
        $("#guidetab").hide();
        }
        */

        //if (((a$.urlprefix() == "cox.") || (a$.urlprefix() == "ers.")) && (($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin"))) {
        if ((($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin"))
                                || ((a$.urlprefix() == "cox.") && (($.cookie("TP1Username").toLowerCase() == "bcrane") || ($.cookie("TP1Username").toLowerCase() == "tebrooks") || ($.cookie("TP1Username").toLowerCase() == "mlangloi")))
                                || ((a$.urlprefix() == "ces.") && (($.cookie("TP1Username").toLowerCase() == "kmuir")))
                                ) {
            $(".easycom-editor a").attr("href", "https://" + a$.urlprefix().split(".")[0] + "-v3-dev.acuityapm.com/applib/dev/LOGIN1/LOGIN1-view/loginNew.aspx?url=/3/Easycom.aspx");
            $(".easycom-editor").show();
        }

        //MAKEDEV
        if ((((a$.urlprefix() == "ces.")
                                || (a$.urlprefix() == "ces-demo.")
                                || (a$.urlprefix() == "act.")
                                ) || (a$.urlprefix() == "ces-v3-shell."))) {
            // && (($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Username").toLowerCase() == "cisaacson"))) {
            a$.ajax({
                type: "GET",
                service: "JScript",
                async: true,
                data: {
                    lib: "qa",
                    cmd: "complianceShowIframe"
                },
                dataType: "json",
                cache: false,
                error: a$.ajaxerror,
                success: checkcomplianceiframe
            });
            function checkcomplianceiframe(json) {
                if (false) { //(a$.jsonerror(json)) {
                }
                else {
                    if (json.iframeAllowed) {
                        //Old way (with tab and iframe)
                        //$("#complianceformtab").show();
                        //$("#ComplianceformIframe").attr("src", "https://ces-v3" + ((a$.urlprefix() == "ces-v3-shell.") ? "-dev" : "") + ".acuityapm.com/3/Touchpointauthentication.aspx?url=../3/ComplianceFormCES.aspx&username=" + $.cookie("TP1Username") + "&uid=" + $.cookie("uid") + "&role=" + $.cookie("TP1Role") + "&roleset=&project=1&CSR=").show();
                        //New way (with list)
                        $(".compliance-system a").attr("href", "https://" + a$.urlprefix().split(".")[0] + "-v3.acuityapm.com/applib/dev/LOGIN1/LOGIN1-view/loginNew.aspx?url=/3/ComplianceFormCES.aspx?origin=v2");
                        $(".compliance-system").show();
                    }
                }
            }
        }

        if (((a$.urlprefix() == "bgr.") || (a$.urlprefix() == "bgr-test.") || (a$.urlprefix() == "bgr-v3-shell."))/* && (($.cookie("TP1Role") != "CSR")) */) {
            $("#attendanceformtab").show();
            var mycsr = "";
            ko.postbox.subscribe("CSR", function (newValue) {
                if (newValue != mycsr) {
                    if ((newValue == "") || (newValue == "each")) {
                        $("#AttendanceformIframe").hide();
                        $(".attendanceform-message").show();
                    }
                    else {
                        $(".attendanceform-message").hide();
                        mycsr = newValue;
                        if (true) { //($.cookie("TP1Username").toLowerCase() == "jeffgack") { 
                            $("#AttendanceformIframe").removeAttr("sandbox").attr("src", "https://bgr-v3-frozen" + ((a$.urlprefix() == "bgr-v3-shell.") ? "-dev" : "") + ".acuityapmr.com/3/Touchpointauthentication.aspx?url=../3/AttendanceFormBGR.aspx&username=" + $.cookie("TP1Username") + "&uid=" + $.cookie("uid") + "&role=" + $.cookie("TP1Role") + "&roleset=&project=1&CSR=" + mycsr).show();
                        }
                        else {
                            $("#AttendanceformIframe").removeAttr("sandbox").attr("src", "https://bgr-v3" + ((a$.urlprefix() == "bgr-v3-shell.") ? "-dev" : "") + ".acuityapm.com/3/Touchpointauthentication.aspx?url=../3/AttendanceFormBGR.aspx&username=" + $.cookie("TP1Username") + "&uid=" + $.cookie("uid") + "&role=" + $.cookie("TP1Role") + "&roleset=&project=1&CSR=" + mycsr).show();
                        }
                    }
                }
            });
        }

        if (false) { //(a$.urlprefix() == "bgr.") && (a$.gup("sidekick") != "1")) { //If Bluegreen
            $("#journalformtab").show();
            var mycsr2 = "badval";
            ko.postbox.subscribe("CSR", function (newValue) {
                if (newValue != mycsr2) {
                    if ((newValue == "") || (newValue == "each")) {
                        $("#JournalformIframe").hide();
                        $(".journalform-message").show();
                    }
                    else {
                        $(".journalform-message").hide();
                        mycsr2 = newValue;
                        $("#JournalformIframe").removeAttr("sandbox").attr("src", "https://bgr-v3-frozen" + ((a$.urlprefix() == "bgr-v3-shell.") ? "-dev" : "") + ".acuityapmr.com/3/Touchpointauthentication.aspx?url=../3/JournalFormBGR.aspx&username=" + $.cookie("TP1Username") + "&uid=" + $.cookie("uid") + "&role=" + $.cookie("TP1Role") + "&roleset=&project=1&CSR=" + mycsr2).show();
                    }
                }
            });
        }
        else if (false) { //(a$.urlprefix().indexOf("chime-mnt") >= 0) {
            $("#journalformtab").show();
            $(".journalform-message").hide();
            var mycsr2 = "badval";
            var myteam2 = "badval";
            ko.postbox.subscribe("JournalCSR", function (newValue) {
                //alert("debug: changed CSR");
                if (newValue == "each") newValue = "";
                if (newValue != mycsr2) {
                    mycsr2 = newValue;
                    callJournalFrame();
                }
            });
            ko.postbox.subscribe("JournalTeam", function (newValue) {
                //alert("debug: changed CSR");
                if (newValue == "each") newValue = "";
                if (newValue != myteam2) {
                    myteam2 = newValue;
                    callJournalFrame();
                }
            });
            function callJournalFrame() {
                //LIVE MODE
                //$("#JournalformIframe").attr("src", "https://" + a$.urlprefix().substring(0, a$.urlprefix().indexOf("-")) + "-v3-dev.acuityapm.com/3/Touchpointauthentication.aspx?url=../3/JournalForm.aspx|dev=1&username=" + $.cookie("TP1Username") + "&uid=" + $.cookie("uid") + "&role=" + $.cookie("TP1Role") + "&roleset=&project=1&CSR=" + mycsr2 + "&Team=" + $("#selTeams").val()).show();
                //Chris dev mode
                var dev = "https://chime-v3-dev-chris.acuityapm.com/3/Touchpointauthentication.aspx?url=../3/JournalForm.aspx|dev=1&username=" + $.cookie("TP1Username") + "&uid=" + $.cookie("uid") + "&role=" + $.cookie("TP1Role") + "&roleset=&project=1&CSR=" + mycsr2 + "&Team=" + myteam2;
                $(".journalform-dev").html(dev);
                $("#JournalformIframe").attr("src", dev).show();
            }
        }
        else if (false) { //((a$.urlprefix().indexOf("-mnt") > 0) && (a$.urlprefix() != "veyo-mnt-clint.")) {
            $("#journalformtab").show();
            var mycsr2 = "";
            ko.postbox.subscribe("CSR", function (newValue) {
                if (newValue != mycsr2) {
                    if ((newValue == "") || (newValue == "each")) {
                        $("#JournalformIframe").hide();
                        $(".journalform-message").show();
                    }
                    else {
                        $(".journalform-message").hide();
                        mycsr2 = newValue;
                        var dev = "https://" + a$.urlprefix().substring(0, a$.urlprefix().indexOf("-mnt")) + "-v3-dev-chris.acuityapm.com/3/Touchpointauthentication.aspx?url=../3/JournalForm.aspx" + ((($.cookie("TP1Username").toLowerCase() == "jeffgack") || ($.cookie("TP1Username").toLowerCase() == "dweather") || ($.cookie("TP1Username").toLowerCase() == "ckraft") || ($.cookie("TP1Username").toLowerCase() == "cjarboe")) ? "|dev=1" : "|nodev=0") + "~demo=1&username=" + $.cookie("TP1Username") + "&uid=" + $.cookie("uid") + "&role=" + $.cookie("TP1Role") + "&roleset=&project=1&CSR=" + mycsr2 + "&Team=" + $("#selTeams").val();
                        if (a$.urlprefix().indexOf("-julie") > 0) {
                            dev = dev.replace(a$.urlprefix().substring(0, a$.urlprefix().indexOf("-mnt")) + "-v3-dev-chris.acuityapm", a$.urlprefix() + "acuityapmr");
                        }
                        $(".journalform-dev").html(dev);
                        $("#JournalformIframe").attr("src", dev).show();
                    }
                }
            });
        }
        else if (a$.urlprefix() == "performant.") {
            $("#journalformtab").hide();
            $("#JournalformIframe").attr("src", "").hide();
        }
        else if ((($.cookie("TP1Role") != "CSR") || ($.cookie("TP1Subrole") == "TeamLead") || (a$.urlprefix() == "da.") || (a$.urlprefix() == "collective-solution.") || (a$.urlprefix() == "ers.") || (a$.urlprefix() == "ultracx.") || (a$.urlprefix() == "walgreens."))) { //Live site.
            $("#journalformlabel").html("Sidekick");
            $("#journalformtab").show();

            //Defeat all subscribes here.
            var defeat = (a$.gup("defeat") != "");
            if ((a$.urlprefix() == "walgreens.") && ($.cookie("TP1Role") == "Team Leader")) defeat = true; //Sidekick brought up without subscribes.
            if (defeat) {
                $(".journalform-message").hide();
                var portback = "../3/JournalForm.aspx?prefix=" + a$.urlprefix().split(".")[0] + ((($.cookie("TP1Username").toLowerCase() == "jeffgack") || ($.cookie("TP1Username").toLowerCase() == "dweather") || ($.cookie("TP1Username").toLowerCase() == "ckraft") || ($.cookie("TP1Username").toLowerCase() == "cjarboe")) ? "&dev=1" : "&nodev=0");
                if (true) { //(a$.urlprefix(true).indexOf("mnt") == 0) {
                    portback = "../3/JournalFormTeam.aspx?prefix=" + a$.urlprefix().split(".")[0] + ((($.cookie("TP1Username").toLowerCase() == "jeffgack") || ($.cookie("TP1Username").toLowerCase() == "dweather") || ($.cookie("TP1Username").toLowerCase() == "ckraft") || ($.cookie("TP1Username").toLowerCase() == "cjarboe")) ? "&dev=1" : "&nodev=0");
                }
                $("#JournalformIframe").attr("src", portback).show();
            }

            if (!defeat) {
                var myteam2 = "";
                ko.postbox.subscribe("Team", function (newValue) {
                    if (newValue != myteam2) {
                        if ((newValue == "") || (newValue == "each")) {
                            //$("#JournalformIframe").hide();
                            //$(".journalform-message").show();
                        }
                        else {
                            $.cookie("Team", $("#selTeams").val());
                            $.cookie("CSR", $("#selCSRs").val());
                            $(".journalform-message").hide();
                            if (!window.sidekickAlreadyCalled) {
                                var portback = "../3/JournalForm.aspx?prefix=" + a$.urlprefix().split(".")[0] + ((($.cookie("TP1Username").toLowerCase() == "jeffgack") || ($.cookie("TP1Username").toLowerCase() == "dweather") || ($.cookie("TP1Username").toLowerCase() == "ckraft") || ($.cookie("TP1Username").toLowerCase() == "cjarboe")) ? "&dev=1" : "&nodev=0");
                                if (true) { //(a$.urlprefix(true).indexOf("mnt") == 0) {
                                    portback = "../3/JournalFormTeam.aspx?prefix=" + a$.urlprefix().split(".")[0] + ((($.cookie("TP1Username").toLowerCase() == "jeffgack") || ($.cookie("TP1Username").toLowerCase() == "dweather") || ($.cookie("TP1Username").toLowerCase() == "ckraft") || ($.cookie("TP1Username").toLowerCase() == "cjarboe")) ? "&dev=1" : "&nodev=0");
                                }

                                $("#JournalformIframe").attr("src", portback).show();
                                window.sidekickAlreadyCalled = true;
                            }
                        }
                    }
                });

                var mycsr2 = "";
                ko.postbox.subscribe("CSR", function (newValue) {
                    if (newValue != mycsr2) {
                        if ((newValue == "") || (newValue == "each")) {
                            //$("#JournalformIframe").hide();
                            //$(".journalform-message").show();
                        }
                        else {
                            $(".journalform-message").hide();
                            mycsr2 = newValue;
                            /*
                            var portback = "https://" + a$.urlprefix().substring(0, a$.urlprefix().indexOf(".")) + "-v3-dev.acuityapm.com/3/Touchpointauthentication.aspx?url=../3/JournalForm.aspx" + ((($.cookie("TP1Username").toLowerCase() == "jeffgack") || ($.cookie("TP1Username").toLowerCase() == "dweather") || ($.cookie("TP1Username").toLowerCase() == "ckraft") || ($.cookie("TP1Username").toLowerCase() == "cjarboe")) ? "|dev=1" : "|nodev=0") + "&username=" + $.cookie("TP1Username") + "&uid=" + $.cookie("uid") + "&role=" + $.cookie("TP1Role") + "&roleset=&project=1&CSR=" + mycsr2 + "&Team=" + $("#selTeams").val();
                            if (a$.urlprefix() == "ces.") {
                            portback = portback.replace("ces-v3-dev.acuityapm", "ces.acuityapmr"); //V2 Test
                            }
                            if (a$.urlprefix() == "ers.") {
                            portback = portback.replace("ers-v3-dev.acuityapm", "ers.acuityapmr"); //V2 Test
                            }
                            if (a$.urlprefix() == "veyo.") {
                            portback = portback.replace("veyo-v3-dev.acuityapm", "veyo.acuityapmr"); //V2 Test
                            }
                            if (a$.urlprefix() == "veyo-mnt-clint.") {
                            portback = portback.replace("veyo-mnt-clint-v3-dev.acuityapm", "veyo-mnt-clint.acuityapmr"); //V2 Test
                            }
                            */
                            //WORKING BUT GOES TO THE LIVE PRIVATE SITE: var portback = "https://" + a$.urlprefix() + "acuityapmr.com/3/Touchpointauthentication.aspx?url=../3/JournalForm.aspx" + ((($.cookie("TP1Username").toLowerCase() == "jeffgack") || ($.cookie("TP1Username").toLowerCase() == "dweather") || ($.cookie("TP1Username").toLowerCase() == "ckraft") || ($.cookie("TP1Username").toLowerCase() == "cjarboe")) ? "|dev=1" : "|nodev=0") + "&username=" + $.cookie("TP1Username") + "&uid=" + $.cookie("uid") + "&role=" + $.cookie("TP1Role") + "&roleset=&project=1&CSR=" + mycsr2 + "&Team=" + $("#selTeams").val();
                            //REVERT IF BETTER TO TRY AUTHENTICATION IN THE IFRAME: var portback = "../3/Touchpointauthentication.aspx?prefix=" + a$.urlprefix().split(".")[0] + "&url=../3/JournalForm.aspx" + ((($.cookie("TP1Username").toLowerCase() == "jeffgack") || ($.cookie("TP1Username").toLowerCase() == "dweather") || ($.cookie("TP1Username").toLowerCase() == "ckraft") || ($.cookie("TP1Username").toLowerCase() == "cjarboe")) ? "|dev=1" : "|nodev=0") + "&username=" + $.cookie("TP1Username") + "&uid=" + $.cookie("uid") + "&role=" + $.cookie("TP1Role") + "&roleset=&project=1&CSR=" + mycsr2 + "&Team=" + $("#selTeams").val();
                            //Attempt to go directly to sidekick without authentication (will try to pull down existing authentication from the parent frame).

                            //Step 1 - Set the primary cookies and see if they show up in the iframe.
                            //Do this in a subscriber-less and filter (cookieprefix) independent way.
                            $.cookie("Team", $("#selTeams").val());
                            $.cookie("CSR", $("#selCSRs").val());
                            $(".journalform-message").hide();
                            if (!window.sidekickAlreadyCalled) {
                                var portback = "../3/JournalForm.aspx?prefix=" + a$.urlprefix().split(".")[0] + ((($.cookie("TP1Username").toLowerCase() == "jeffgack") || ($.cookie("TP1Username").toLowerCase() == "dweather") || ($.cookie("TP1Username").toLowerCase() == "ckraft") || ($.cookie("TP1Username").toLowerCase() == "cjarboe")) ? "&dev=1" : "&nodev=0");
                                if (($.cookie("TP1Subrole") == "TeamLead") || (a$.urlprefix() == "collective-solution.") || (a$.urlprefix() == "ers.") || (a$.urlprefix() == "ultracx.") || (a$.urlprefix() == "walgreens.")) { //Sidekick for CSRs
                                    portback = "../3/JournalFormTeam.aspx?prefix=" + a$.urlprefix().split(".")[0] + ((($.cookie("TP1Username").toLowerCase() == "jeffgack") || ($.cookie("TP1Username").toLowerCase() == "dweather") || ($.cookie("TP1Username").toLowerCase() == "ckraft") || ($.cookie("TP1Username").toLowerCase() == "cjarboe")) ? "&dev=1" : "&nodev=0");
                                }

                                $("#JournalformIframe").attr("src", portback).show();

                                window.sidekickAlreadyCalled = true;
                            }

                        }
                    }
                });
            }
        }

        if ((a$.urlprefix() == "chime-mnt.") || (a$.urlprefix() == "cox-mnt.")) {
            $("#reviewformtab").show();
            var myteam = "";
            var mycsr3 = "";
            var myhash = "";

            /*
            if ($.cookie("TP1Role") == "CSR") {
            myhash = "^self-evaluation";
            }
            else {
            myhash = "^performance-review";
            }
            */
            myhash = "^performance-review";

            function callSupPerf() {
                if ((myteam == "") || (myteam == "each") /* || (mycsr == "each") */) {
                    $(".reviewform-message").show();
                    $("#ReviewformIframe").hide();
                }
                else {
                    if (mycsr3 == "each") mycsr3 = "";
                    $(".reviewform-message").hide();
                    /*chris:*/dev = "https://" + a$.urlprefix().substring(0, a$.urlprefix().indexOf("-mnt")) + "-v3-dev-chris" + ".acuityapm.com/3/Touchpointauthentication.aspx?url=../3/Supperfmgt.aspx|CSR=" + mycsr3 + "~Team=" + myteam + myhash + "&username=" + $.cookie("TP1Username") + "&uid=" + $.cookie("uid") + "&role=" + $.cookie("TP1Role") + "&roleset=&project=1";
                    $(".reviewform-dev").html(dev);
                    $("#ReviewformIframe").attr("src", dev).show();
                }
            }
            ko.postbox.subscribe("JournalCSR", function (newValue) {
                //alert("debug: CSR changed to: " + newValue);
                if (newValue != mycsr3) {
                    mycsr3 = newValue;
                    callSupPerf();
                }
            });
            ko.postbox.subscribe("Team", function (newValue) {
                if (newValue != myteam) {
                    myteam = newValue;
                    callSupPerf();
                }
            });
        }

        if ((a$.urlprefix() == "cox.")) { //Live Review

            $("#StgScorecard select").val("2"); //2021 Scorecard is default now.

            appApmSettings.init({
                id: "StgScorecard",
                ui: "combo"
            });
            $("#StgScorecard select").bind("change", function () {
                appApmDashboard.refreshboxes({
                    which: 'KPI,SubKPI',
                    param: function () {
                        return "scorecard=" + $("#StgScorecard select").val();
                    }
                });
            });
            $("#StgScorecard").show();

            $("#reviewformtab").show();
            var myteam = "";
            var mycsr = "";
            var myhash = "";

            if ($.cookie("TP1Role") == "CSR") {
                myhash = "^self-evaluation";
            }
            else {
                myhash = "^performance-review";
            }

            function callSupPerf() {
                if ((myteam == "") || (myteam == "each") /* || (mycsr == "each") */) {
                    $(".reviewform-message").show();
                    $("#ReviewformIframe").hide();
                }
                else {
                    if (mycsr == "each") mycsr = "";
                    $(".reviewform-message").hide();
                    /*chris:*/dev = "https://" + a$.urlprefix().substring(0, a$.urlprefix().indexOf(".")) + "-v3-dev-chris" + ".acuityapmr.com/3/Touchpointauthentication.aspx?url=../3/Supperfmgt.aspx|CSR=" + mycsr + "~Team=" + myteam + myhash + "&username=" + $.cookie("TP1Username") + "&uid=" + $.cookie("uid") + "&role=" + $.cookie("TP1Role") + "&roleset=&project=1";
                    //$(".reviewform-dev").html(dev);
                    $("#ReviewformIframe").removeAttr("sandbox").attr("src", dev).show();
                }
            }
            ko.postbox.subscribe("CSR", function (newValue) {
                if (newValue != mycsr) {
                    mycsr = newValue;
                    callSupPerf();
                }
            });
            ko.postbox.subscribe("Team", function (newValue) {
                if (newValue != myteam) {
                    myteam = newValue;
                    callSupPerf();
                }
            });
        }

        if (((a$.urlprefix() == "bgr.") || (a$.urlprefix() == "bgr-test.") || (a$.urlprefix() == "bgr-make40.")) && (($.cookie("TP1Username") == "amccord") || ($.cookie("TP1Username") == "jeffgack"))) {
            $("#cepointsmgrtab").show();
            appApmRankPoints.mgrinit();
        }

        $('.headericon-points').qtip({
            content: stgRankPointsLabel + ' Rewards! Click to open.'
        }).bind("click", function () {
            $("#cepointstab").show();
            $("#cepointslabel").trigger("click");
        });

        $('.headericon-message').qtip({
            content: 'Messages'
        }).bind("click", function () {
            $('#messageslabel').trigger('click');
            window.location = "#Messaging";
        });

        if (/*  (a$.urlprefix(true).indexOf("mnt") == 0) || (a$.urlprefix() == "km2.") ||  */(a$.urlprefix() == "compliance-demo.")) {
            $('.headericon-chat').qtip({
                content: 'Chat / Meet'
            }).bind("click", function () {
                appApmMessaging.clickedchatbubble(this);
            });
        }
        else {
            $('.headericon-chat').css("background-image", "url(/App_Themes/Acuity3/images/chat-icon.png)");
            $('.headericon-chat').qtip({
                content: 'Chat'
            }).bind("click", function () {
                appApmMessaging.clickedchatbubble(this);
            });
        }

        $('.headericon-graph').bind("click", function () {
            /*
            if ($("#graphsublabel").eq(0).is(":visible")) {
            $('#graphsublabel').trigger('click');
            }
            else {
            $("#graphtab").show();
            $('#graphlabel').trigger('click');
            }
            if (window.location == "#GraphsReports") {
            $("#graphtab").show();
            $('#graphlabel').trigger('click');
            }
            */
            window.location = "#GraphsReports";
        });

        $('.support-icon').qtip({
            content: 'Acuity Support'
        }).bind("click", function () {
            $(".rightpanel").addClass('active');
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
        }).bind("click", function () {
            $("#importframe").attr("src", "");
            if ((a$.urlprefix() == "ers.") || (a$.urlprefix() == "ec2.")) {
                //$("#importframe").attr("src", "//ers-import.acuityapmr.com/jq/import3.aspx");
                window.location = "//ers-import.acuityapmr.com/jq/import3.aspx";
            } else if (a$.urlprefix() == "ces.") {
                window.location = "//ces-import.acuityapmr.com/jq/import3.aspx";
            } else if (a$.urlprefix() == "ces-demo.") {
                window.location = "//ces-demo-import.acuityapmr.com/jq/import3.aspx";
            } else if (a$.urlprefix() == "chime.") {
                window.location = "//chime-import.acuityapmr.com/jq/import3.aspx";
            } else if (a$.urlprefix() == "cox.") {
                window.location = "//cox-import.acuityapmr.com/jq/import3.aspx";
            } else if ((a$.urlprefix() == "veyo.") || (a$.urlprefix() == "mtm.")) {
                window.location = "//veyo-import.acuityapmr.com/jq/import3.aspx";
            } else if (a$.urlprefix() == "frost-arnett.") {
                window.location = "//frost-arnett-import.acuityapmr.com/jq/import3.aspx";
            } else if (a$.urlprefix() == "act.") {
                window.location = "//act-import.acuityapmr.com/jq/import3.aspx";
            } else if (a$.urlprefix() == "united.") {
                window.location = "//united-import.acuityapmr.com/jq/import3.aspx";
            } else if (a$.urlprefix() == "collective-solution.") {
                window.location = "//collective-solution-import.acuityapmr.com/jq/import3.aspx";
            } else if (a$.urlprefix() == "performant.") {
                window.location = "//performant-import.acuityapmr.com/jq/import3.aspx";
            } else if (a$.urlprefix() == "rcm.") {
                window.location = "//rcm-import.acuityapmr.com/jq/import3.aspx";
            } else if (a$.urlprefix() == "performant-healthcare.") {
                window.location = "//performant-healthcare-import.acuityapmr.com/jq/import3.aspx";
            } else if (a$.urlprefix() == "bgr.") {
                window.location = "//bgr-import.acuityapmr.com/jq/import3.aspx";
            } else if (a$.urlprefix() == "bgr-test.") {
                window.location = "//bgr-test-import.acuityapmr.com/jq/import3.aspx";
            } else if (a$.urlprefix() == "vec.") {
                window.location = "//vec-import.acuityapmr.com/jq/import3.aspx";
            } else if (a$.urlprefix().indexOf("km2") >= 0) {
                //Disable for now: window.location = "//km2-import.acuityapmr.com/jq/import3.aspx";
            } else if (a$.urlprefix() == "sunpro.") {
                window.location = "//sunpro-import.acuityapmr.com/jq/import3.aspx";
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

        $('.headericon-reload').qtip({
            content: 'Reload Dashboard'
        }).bind("click", function () {
            location.reload(false);
        });

        $('.logo-reload').qtip({

        }).bind("click", function () {
            window.location = "#GraphsReports";
        });



        $('.err-icon').qtip({
            content: 'Error (Click for details)'
        }).bind("click", function () {
            if ($(".err-container").first().is(":visible")) {
                $(".err-container").hide();
            } else {
                $(".err-container").show();
            }
        });
        $('.err-hide').bind("click", function () {
            $(".err-container").hide();
            $(".err-icon").hide();
        });
        $("#errsubmit").bind("click", function () {
            a$.submiterror($("#errinput").val());
            $(".err-container").hide();
            $(".err-icon").hide();
        });

        //Gauge thresholds (now handled with controlopts.performanceRanges setting)
        //For backward compatibility
        if ((a$.urlprefix() == "km2.") || (a$.urlprefix() == "test-km2.")) {
            controlopts.performanceRanges = [{
                letter: "4",
                threshold: 105.0,
                pie: {
                    low: 105.0,
                    high: 150.0
                },
                color: "#0D66FF",
                stops: [
											[0, '#0D66FF'],
											[1, '#0D66FF'],
											[2, '#0D66FF']
										]
            },
									{
									    letter: " ",
									    threshold: 100.0,
									    pie: {
									        low: 100.0,
									        high: 105.0
									    },
									    color: "#039F03",
									    textColor: "black", //MADELIVE
									    stops: [
											[0, '#039F03'],
											[1, '#039F03'],
											[2, '#039F03']
										]
									},
									{
									    letter: " ",
									    threshold: 90.0,
									    pie: {
									        low: 90.0,
									        high: 100.0
									    },
									    color: "#FF9900",
									    stops: [
											[0, '#ff9900'],
											[1, '#ff9900'],
											[2, '#ff9900']
										]
									},
									{
									    letter: "1",
									    threshold: -99999.0,
									    pie: {
									        low: 0.0,
									        high: 90.0
									    },
									    color: "#990202",
									    stops: [
											[0, '#990202'],
											[1, '#990202'],
											[2, '#990202']
										]
									}
								];
        }
        else if ((a$.urlprefix() == "bgr.") || (a$.urlprefix() == "bgr-test.") || (a$.urlprefix() == "bgr-make40.")) {
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
											[0, '#019F01'],
											[1, '#019F01'],
											[2, '#019F01']
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
											[0, '#990101'],
											[1, '#990101'],
											[2, '#990101']
										]
									}
								];
        } else if ((a$.urlprefix() == "chime.")) {
            //alert("debug: Bluegreen performance ranges test (ignore this)");
            //controlopts.performanceRanges = [{ letter: "A", threshold: 9.0, pie: { low: 9.0, high: 10.0 }, color: "#019F01", stops: [[0, '#005B00'], [1, '#00AE00'], [2, '#00AE00']] }, { letter: "B", threshold: 7.0, pie: { low: 7.0, high: 9.0 }, color: "#EBE40C", stops: [[0, '#AF8013'], [1, '#FEFE00'], [2, '#FEFE00']] }, { letter: "C", threshold: 5.0, pie: { low: 5.0, high: 7.0 }, color: "#FF6600", stops: [[0, '#BB5500'], [1, '#FF6600'], [2, '#FF6600']] }, { letter: "D", threshold: -99999.0, pie: { low: 0.0, high: 5.0 }, color: "#990101", stops: [[0, '#5B0000'], [1, '#AC0000'], [2, '#AC0000']]}];
            controlopts.performanceRanges = [{
                letter: "A",
                threshold: 8.0,
                pie: {
                    low: 8.0,
                    high: 10.0
                },
                color: "#019F01",
                stops: [
											[0, '#019F01'],
											[1, '#019F01'],
											[2, '#019F01']
										]
            },
									{
									    letter: "B",
									    threshold: 5.0,
									    pie: {
									        low: 5.0,
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
									    letter: "C",
									    threshold: 2.0,
									    pie: {
									        low: 2.0,
									        high: 5.0
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
									        high: 2.0
									    },
									    color: "#990101",
									    stops: [
											[0, '#990101'],
											[1, '#990101'],
											[2, '#990101']
										]
									}
								];
        } else if ((a$.urlprefix() == "walgreens.")) {
            //alert("debug: Bluegreen performance ranges test (ignore this)");
            //controlopts.performanceRanges = [{ letter: "A", threshold: 9.0, pie: { low: 9.0, high: 10.0 }, color: "#019F01", stops: [[0, '#005B00'], [1, '#00AE00'], [2, '#00AE00']] }, { letter: "B", threshold: 7.0, pie: { low: 7.0, high: 9.0 }, color: "#EBE40C", stops: [[0, '#AF8013'], [1, '#FEFE00'], [2, '#FEFE00']] }, { letter: "C", threshold: 5.0, pie: { low: 5.0, high: 7.0 }, color: "#FF6600", stops: [[0, '#BB5500'], [1, '#FF6600'], [2, '#FF6600']] }, { letter: "D", threshold: -99999.0, pie: { low: 0.0, high: 5.0 }, color: "#990101", stops: [[0, '#5B0000'], [1, '#AC0000'], [2, '#AC0000']]}];
            controlopts.performanceRanges = [
                    {
                        letter: " ",
                        threshold: 1.0,
                        pie: {
                            low: 1.0,
                            high: 3.0
                        },
                        color: "#323365",
                        stops: [
                                                    [0, '#323365'],
                                                    [1, '#323365'],
                                                    [2, '#323365']
                                                ]
                    },
                    {
                        letter: " ",
                        threshold: 0.0,
                        pie: {
                            low: 0.0,
                            high: 1.0
                        },
                        color: "#467BE0",
                        stops: [
                                                    [0, '#467BE0'],
                                                    [1, '#467BE0'],
                                                    [2, '#467BE0']
                                                ]
                    },
                    {
                        letter: " ",
                        threshold: -1.0,
                        pie: {
                            low: -1.0,
                            high: 0.0
                        },
                        color: "#7FABFF",
                        textColor: "black",
                        stops: [
                                                    [0, '#7FABFF'],
                                                    [1, '#7FABFF'],
                                                    [2, '#7FABFF']
                                                ]
                    },
                    {
                        letter: " ",
                        threshold: -3.0,
                        pie: {
                            low: -3.0,
                            high: -1.0
                        },
                        color: "#CDE9FF",
                        textColor: "black",
                        stops: [
											[0, '#CDE9FF'],
											[1, '#CDE9FF'],
											[2, '#CDE9FF']
										]
                    }
					    ];
        } else if ((a$.urlprefix() == "cox.") || (a$.urlprefix() == "cox-test.") || (a$.urlprefix() == "cox-mnt.")) {
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
        }
        else if ((a$.urlprefix() == "sunpro.")) {
            //alert("debug: Bluegreen performance ranges test (ignore this)");
            //controlopts.performanceRanges = [{ letter: "A", threshold: 9.0, pie: { low: 9.0, high: 10.0 }, color: "#019F01", stops: [[0, '#005B00'], [1, '#00AE00'], [2, '#00AE00']] }, { letter: "B", threshold: 7.0, pie: { low: 7.0, high: 9.0 }, color: "#EBE40C", stops: [[0, '#AF8013'], [1, '#FEFE00'], [2, '#FEFE00']] }, { letter: "C", threshold: 5.0, pie: { low: 5.0, high: 7.0 }, color: "#FF6600", stops: [[0, '#BB5500'], [1, '#FF6600'], [2, '#FF6600']] }, { letter: "D", threshold: -99999.0, pie: { low: 0.0, high: 5.0 }, color: "#990101", stops: [[0, '#5B0000'], [1, '#AC0000'], [2, '#AC0000']]}];
            controlopts.performanceRanges = [{
                letter: "WC",
                threshold: 6.0,
                pie: {
                    low: 6.0,
                    high: 7.0
                },
                color: "darkblue",
                stops: [
											[0, 'darkblue'],
											[1, 'darkblue'],
											[2, 'darkblue']
										]
            },
                                    {
                                        letter: "E",
                                        threshold: 5.0,
                                        pie: {
                                            low: 5.0,
                                            high: 6.0
                                        },
                                        color: "#00b0f0",
                                        stops: [
											[0, '#00b0f0'],
											[1, '#00b0f0'],
											[2, '#00b0f0']
										]
                                    },
									{
									    letter: "Gt",
									    threshold: 4.0,
									    pie: {
									        low: 4.0,
									        high: 5.0
									    },
									    color: "#00b050",
									    stops: [
											[0, '#00b050'],
											[1, '#00b050'],
											[2, '#00b050']
										]
									},
									{
									    letter: "Gd",
									    threshold: 3.0,
									    pie: {
									        low: 3.0,
									        high: 4.0
									    },
									    color: "lightgreen",
									    textColor: "black", //MADELIVE
									    stops: [
											[0, 'lightgreen'],
											[1, 'lightgreen'],
											[2, 'lightgreen']
										]
									},
									{
									    letter: "F",
									    threshold: 2.0,
									    pie: {
									        low: 2.0,
									        high: 3.0
									    },
									    color: "#DDDD00",
									    textColor: "black", //MADELIVE
									    stops: [
											[0, '#DDDD00'],
											[1, '#DDDD00'],
											[2, '#DDDD00']
										]
									},
									{
									    letter: "I",
									    threshold: 1.0,
									    pie: {
									        low: 1.0,
									        high: 2.0
									    },
									    color: "#ff8888",
									    stops: [
											[0, '#ff8888'],
											[1, '#ff8888'],
											[2, '#ff8888']
										]
									},
									{
									    letter: "II",
									    threshold: -99999.0,
									    pie: {
									        low: 0.0,
									        high: 1.0
									    },
									    color: "#ff0000",
									    stops: [
											[0, '#ff0000'],
											[1, '#ff0000'],
											[2, '#ff0000']
										]
									}
								];
        }
        else if ((a$.urlprefix() == "frost-arnett.") || (a$.urlprefix() == "frost-arnett-mnt.")) {
            //alert("debug: Bluegreen performance ranges test (ignore this)");
            //controlopts.performanceRanges = [{ letter: "A", threshold: 9.0, pie: { low: 9.0, high: 10.0 }, color: "#019F01", stops: [[0, '#005B00'], [1, '#00AE00'], [2, '#00AE00']] }, { letter: "B", threshold: 7.0, pie: { low: 7.0, high: 9.0 }, color: "#EBE40C", stops: [[0, '#AF8013'], [1, '#FEFE00'], [2, '#FEFE00']] }, { letter: "C", threshold: 5.0, pie: { low: 5.0, high: 7.0 }, color: "#FF6600", stops: [[0, '#BB5500'], [1, '#FF6600'], [2, '#FF6600']] }, { letter: "D", threshold: -99999.0, pie: { low: 0.0, high: 5.0 }, color: "#990101", stops: [[0, '#5B0000'], [1, '#AC0000'], [2, '#AC0000']]}];
            controlopts.performanceRanges = [{
                letter: "A",
                threshold: 4.0,
                pie: {
                    low: 4.0,
                    high: 5.0
                },
                color: "#00b0f0",
                stops: [
											[0, '#00b0f0'],
											[1, '#00b0f0'],
											[2, '#00b0f0']
										]
            },
                                    {
                                        letter: "B",
                                        threshold: 3.0,
                                        pie: {
                                            low: 3.0,
                                            high: 4.0
                                        },
                                        color: "#00b050",
                                        stops: [
											[0, '#00b050'],
											[1, '#00b050'],
											[2, '#00b050']
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
        } else if ((a$.urlprefix() == "united.") || (a$.urlprefix() == "united-mnt.") || (a$.urlprefix() == "united2.")) {
            //alert("debug: Bluegreen performance ranges test (ignore this)");
            //controlopts.performanceRanges = [{ letter: "A", threshold: 9.0, pie: { low: 9.0, high: 10.0 }, color: "#019F01", stops: [[0, '#005B00'], [1, '#00AE00'], [2, '#00AE00']] }, { letter: "B", threshold: 7.0, pie: { low: 7.0, high: 9.0 }, color: "#EBE40C", stops: [[0, '#AF8013'], [1, '#FEFE00'], [2, '#FEFE00']] }, { letter: "C", threshold: 5.0, pie: { low: 5.0, high: 7.0 }, color: "#FF6600", stops: [[0, '#BB5500'], [1, '#FF6600'], [2, '#FF6600']] }, { letter: "D", threshold: -99999.0, pie: { low: 0.0, high: 5.0 }, color: "#990101", stops: [[0, '#5B0000'], [1, '#AC0000'], [2, '#AC0000']]}];
            //United before changes: controlopts.performanceRanges = [{ letter: "A", threshold: 4.0, pie: { low: 4.0, high: 5.0 }, color: "#6DB985", textColor: "black", stops: [[0, "#6DB985"], [1, "#6DB985"], [2, "#6DB985"]] }, { letter: "B", threshold: 3.0, pie: { low: 3.0, high: 4.0 }, color: "#B9CBE3", textColor: "black", stops: [[0, "#B9CBE3"], [1, "#B9CBE3"], [2, "#B9CBE3"]] }, { letter: "C", threshold: 2.0, pie: { low: 2.0, high: 3.0 }, color: "#C2C2C2", textColor: "black", stops: [[0, "#C2C2C2"], [1, "#C2C2C2"], [2, "#C2C2C2"]] }, { letter: "D", threshold: 1.0, pie: { low: 1.0, high: 2.0 }, color: "#F6E570", textColor: "black", stops: [[0, "#F6E570"], [1, "#F6E570"], [2, "#F6E570"]] }, { letter: "E", threshold: -99999.0, pie: { low: 0.0, high: 1.0 }, color: "#FF6868", textColor: "black", stops: [[0, "#FF6868"], [1, "#FF6868"], [2, "#FF6868"]]}];
            controlopts.performanceRanges = [{ letter: "A", threshold: 99.9999, pie: { low: 99.9999, high: 110.0 }, color: "#6DB985", textColor: "black", stops: [[0, "#6DB985"], [1, "#6DB985"], [2, "#6DB985"]] }, { letter: "B", threshold: 90.0, pie: { low: 90.0, high: 99.9999 }, color: "#B9CBE3", textColor: "black", stops: [[0, "#B9CBE3"], [1, "#B9CBE3"], [2, "#B9CBE3"]] }, { letter: "C", threshold: 80.0, pie: { low: 80.0, high: 90.0 }, color: "#C2C2C2", textColor: "black", stops: [[0, "#C2C2C2"], [1, "#C2C2C2"], [2, "#C2C2C2"]] }, { letter: "D", threshold: 70.0, pie: { low: 70.0, high: 80.0 }, color: "#F6E570", textColor: "black", stops: [[0, "#F6E570"], [1, "#F6E570"], [2, "#F6E570"]] }, { letter: "E", threshold: -99999.0, pie: { low: 0.0, high: 70.0 }, color: "#FF6868", textColor: "black", stops: [[0, "#FF6868"], [1, "#FF6868"], [2, "#FF6868"]]}];
        } else if ((a$.urlprefix() == "collective-solution.")) {
            controlopts.performanceRanges = [{ letter: "A", threshold: 80.0, pie: { low: 80.0, high: 100.0 }, color: "#019F01", stops: [[0, "#005B00"], [1, "#00AE00"], [2, "#00AE00"]] }, { letter: "B", threshold: 40.0, pie: { low: 40.0, high: 80.0 }, color: "#ffff00", textColor: "black", stops: [[0, "#ffff00"], [1, "#ffff00"], [2, "#ffff00"]] }, { letter: "C", threshold: -99999.0, pie: { low: 0.0, high: 40.0 }, color: "#990101", stops: [[0, "#5B0000"], [1, "#AC0000"], [2, "#AC0000"]]}];
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
            }];
        }

        for (var i in controlopts.performanceRanges) {
            if (controlopts.performanceRanges[i].letter == "B") {
                controlopts.Bthreshold = controlopts.performanceRanges[i].threshold;
                break;
            }
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

        $("#imageback").attr('src', 'appApmClient/themes/default/images/gaugeGEN.jpg');
        varigauge(1);
        varigauge(2);

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
												[0, '#019F01'],
												[1, '#019F01'],
												[2, '#019F01']
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
												[0, '#91f977'],
												[1, '#91f977'],
												[2, '#91f977']
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
												[0, '#EBE40C'],
												[1, '#EBE40C'],
												[2, '#EBE40C']
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
												[0, '#FF6600'],
												[1, '#FF6600'],
												[2, '#FF6600']
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
												[0, '#019F01'],
												[1, '#019F01'],
												[2, '#019F01']
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
												[0, '#91f977'],
												[1, '#91f977'],
												[2, '#91f977']
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
												[0, '#EBE40C'],
												[1, '#EBE40C'],
												[2, '#EBE40C']
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
												[0, '#FF6600'],
												[1, '#FF6600'],
												[2, '#FF6600']
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
												[0, '#990101'],
												[1, '#990101'],
												[2, '#990101']
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
												[0, '#019F01'],
												[1, '#019F01'],
												[2, '#019F01']
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
												[0, '#91f977'],
												[1, '#91f977'],
												[2, '#91f977']
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
												[0, '#EBE40C'],
												[1, '#EBE40C'],
												[2, '#EBE40C']
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
												[0, '#990101'],
												[1, '#990101'],
												[2, '#990101']
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
                }, 1);
                controlopts.varirankgauge({
                    ranges: controlopts.rankRanges,
                    paper: controlopts.rank2_gpaper
                }, 2);
                break;
            case "km2.":
            case "km2-make40.":
            case "cox.":
            case "cox-mnt.":
            case "cox-test.":
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
                }, 1);
                controlopts.varirankgauge({
                    ranges: controlopts.rankRanges,
                    paper: controlopts.rank2_gpaper
                }, 2);
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
                }, 1);
                controlopts.varirankgauge({
                    ranges: controlopts.rankRanges,
                    paper: controlopts.rank2_gpaper
                }, 2);
                break;
        };

        Highcharts.wrap(Highcharts.Chart.prototype, 'redraw', function (proceed, animation) {
            proceed.call(this, animation);
            try {
                if (this.legend.options.floating) {
                    var z = this.legend.group.element, zzz = z.parentNode;
                    zzz.removeChild(z);
                    zzz.appendChild(z); //zindex in svg is determined by element order
                }
            } catch (e) {

            }
        });
        /*
        Highcharts.theme.yAxis.plotBands = [{ color: 'white', from: -0.04, to: 0.00}];
        for (var i in controlopts.performanceRanges) {
        if (controlopts.performanceRanges[i].threshold > 0.0) {
        Highcharts.theme.yAxis.plotBands.push({ color: 'white', from: controlopts.performanceRanges[i].threshold - 0.02, to: controlopts.performanceRanges[i].threshold + 0.02 });
        }
        }
        Highcharts.setOptions(Highcharts.theme);


        //MODAL DIALOG TEST
        /*
        $('#daterange').qtip(
        {
        content: {
        title: {
        text: 'Modal qTip',
        button: 'Close'
        },
        text: 'Heres an example of a rather bizarre use for qTip... a tooltip as a <b>modal dialog</b>! <br /><br />' +
        'Much like the <a href="//onehackoranother.com/projects/jquery/boxy/">Boxy</a> plugin, ' +
        'but if you\'re already using tooltips on your page... <i>why not utilise qTip<i> as a modal dailog instead?'
        },
        position: {
        target: $(document.body), // Position it via the document body...
        corner: 'center' // ...at the center of the viewport
        },
        show: {
        when: 'click', // Show it on click
        solo: true // And hide all other tooltips
        },
        hide: false,
        style: {
        width: { max: 350 },
        padding: '14px',
        border: {
        width: 9,
        radius: 9,
        color: '#666666'
        },
        name: 'light'
        },
        api: {
        beforeShow: function()
        {
        // Fade in the modal "blanket" using the defined show speed
        //$('#qtip-blanket').fadeIn(this.options.show.effect.length);
        },
        beforeHide: function()
        {
        // Fade out the modal "blanket" using the defined hide speed
        //$('#qtip-blanket').fadeOut(this.options.hide.effect.length);
        }
        }
        });
        */
        /*
        // Create the modal backdrop on document load so all modal tooltips can use it
        $('<div id="qtip-blanket">')
        .css({
        position: 'absolute',
        top: $(document).scrollTop(), // Use document scrollTop so it's on-screen even if the window is scrolled
        left: 0,
        height: $(document).height(), // Span the full document height...
        width: '100%', // ...and full width

        opacity: 0.7, // Make it slightly transparent
        backgroundColor: 'black',
        zIndex: 5000  // Make sure the zIndex is below 6000 to keep it below tooltips!
        })
        .appendTo(document.body) // Append to the document body
        .hide(); // Hide it initially
        });
        */
        //END MODAL DIALOG TEST

        appApmDashboard.getdashboardsettings();
        appApmDashboard.setcontrolopts(controlopts);
        appApmReport.setDashboardFilters($("#StgDashboard select").val());

        /*
        if (($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin") || ($.cookie("TP1Username") == "yjohnso") || ($.cookie("TP1Username") == "shood") || ($.cookie("TP1Username") == "asanders")) {
        appApmMessaging.getmessages();
        }
        else {
        appApmDashboard.getusersettingsOLD();
        $(".messages-compose").each(function () { $(this).css("display", "none"); });
        }
        */
        appApmMessaging.getmessages();

        //document.getElementById('btnAdd').disabled = 'disabled';
        //document.getElementById('btnClear').disabled = 'disabled';

        //$("#mycontainer").draggable();
        //$("#set div").draggable({ stack: "#set div" });

        var chosenboxes = false;
        if ($.browser.msie) {
            if (($('#browserversion').html() == "isie8") || ($('#browserversion').html() == "isgtie8")) chosenboxes = true;
        } else chosenboxes = true;
        if (chosenboxes) {
            $(".chosen").data("Placeholder", "Select...").chosen();
            //$(".chzn-search").hide();
            /*
            $(".chzn-container").bind("mouseover", function () {
            alert("debug:here");
            alert($(this).attr("id"));
            //alert("debug:spanDatefrom changed");
            });
            */
            $(".chzn-select").chosen({
                disable_search_threshold: 5
            });
        }

        if ($.browser.msie) {
            if (($('#browserversion').html() == "isie8") || ($('#browserversion').html() == "isgtie8")) { } else {
                //IE7 or below
                //alert("debug:IE 7 or below");
                /*
                $(".leftpanel").css("overflow-x", "scroll");
                $(".leftpanel").css("width", "300px");
                $("#tabs").css("left", "300px");
                */
            }
        }

        for (var i = 0; i < 16; i++) $("#needle" + i).rotate({
            animateTo: -2
        });
        $("#gaugescore1,#gaugescore2").html("");
        $("#gaugelabel1,#gaugelabel2").html("");

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
            ui: "combo"
        });
        $("#StgAttritionSearch select").bind("change", function () {
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
            ui: "combo"
        });

        $("#StgAttritionTest select").bind("change", function () {
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
            if (((a$.urlprefix() == "chime.") || (a$.urlprefix() == "chime-make40.") || (a$.urlprefix() == "chime-mnt.")) && (($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin"))) {
                //$("#StgDashboard select option[value='Supervisor']").remove();
                $("#StgDashboard select option[value='Source']").remove();
                $("#StgDashboard select option[value='Attrition']").remove();
                //$(".stgdashboard-override-hide").hide();
            }
            else if ((a$.urlprefix() == "chime.") || (a$.urlprefix() == "chime-make40.") || (a$.urlprefix() == "chime-mnt.")) {
                //$("#StgDashboard select option[value='Supervisor']").remove();
                $("#StgDashboard select option[value='Source']").remove();
                $("#StgDashboard select option[value='Attrition']").remove();
                //$(".stgdashboard-override-hide").hide();
            }
            else if ((a$.urlprefix() == "ers.") || (a$.urlprefix().indexOf("make") >= 0)) {
                $("#StgDashboard select option[value='Supervisor']").remove();
                $("#StgDashboard select option[value='Source']").remove();
                $(".stgdashboard-override-hide").hide();
            }
            else if ((a$.urlprefix() == "da.")) {
                //$("#StgDashboard select option[value='Supervisor']").remove();
                $("#StgDashboard select option[value='Source']").remove();
                $("#StgDashboard select option[value='Attrition']").remove();
            }
            else if (((a$.urlprefix() == "collective-solution.")) && ((a$.urlprefix(true).indexOf("mnt") == 0) || (window.location.host.indexOf("localhost") >= 0))) { //MNT/Debug ONLY for now.
                //$("#StgDashboard select option[value='Supervisor']").remove();
                $("#StgDashboard select option[value='Source']").remove();
                $("#StgDashboard select option[value='Attrition']").remove();
            }
            else if (a$.urlprefix() == "km2.") {
                $("#StgDashboard select option[value='Supervisor']").remove();
                $("#StgDashboard select option[value='Source']").remove();
                $("#StgDashboard select option[value='Attrition']").remove();
                $(".stgdashboard-override-hide").hide();
                $("#StgDashboard").hide(); //For now just hide the whole dashboard slider if not ers. (Note: attrition-hide might mess this up in certain configurations).
            }
            else {
                $("#StgDashboard select option[value='Source']").remove();
                $("#StgDashboard select option[value='Attrition']").remove();
                $(".stgdashboard-override-hide").hide();
                $("#StgDashboard").hide(); //For now just hide the whole dashboard slider if not ers. (Note: attrition-hide might mess this up in certain configurations).
            }
            if (a$.urlprefix() == "cthix.") { } else {
                if (($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin") || ($.cookie("TP1Role") == "Management") || ($.cookie("TP1Username") == "jclark") || ($.cookie("TP1Username") == "bgill")) { } else {
                    //For special access to the Program/Financial Dashboard
                }
                //Just remove for everyone (except CTHIX) for now.
                $("#StgDashboard select option[value='Program']").remove();
                $("#StgDashboard select option[value='Financial']").remove();

            }

            if (true) { //a$.urlprefix(true).indexOf("mnt") != 0) {

                if (true) { //$.cookie("TP1Role") != "Admin") { //(a$.urlprefix() != "collective-solution.") && (a$.urlprefix() != "km2.")) {
                    $("#StgDashboard select option[value='Sidekick']").remove();
                }
            }
            /*
            if (a$.urlprefix(true).indexOf("mnt") == 0) {
            $(".stgdashboard-override-hide").show();
            $("#StgDashboard").show(); //For now just hide the whole dashboard slider if not ers. (Note: attrition-hide might mess this up in certain configurations).
            }
            */

            appApmSettings.init({
                id: "StgDashboard",
                ui: "slider"
            });

            if (a$.urlprefix(true).indexOf("mnt") != 0) {
                if ((a$.urlprefix() == "chime.") || (a$.urlprefix() == "chime-make40.") || (a$.urlprefix() == "chime-mnt.")) {
                    $("#StgDashboard").hide(); //For now just hide the whole dashboard slider if chime.
                }
            }

            $("#spanDatefrom").bind("change", function () {
                alert("debug:spanDatefrom changed");
            });
            //$("#attritiontab").hide();

            if (a$.urlprefix() == "cthix-program.") { // CTHIX:
                appApmDashboard.setCookiePrefix("PD");
                $("#showpay").css("display", "none");
                $("#csrlabel").html("View");
            }


            var stgDashboardPrevious = "";
            $("#StgDashboard select").bind("focus", function () {
                stgDashboardPrevious = $(this).val();
            }).bind("change", function () {
                if (($(this).val() == "Supervisor") || (stgDashboardPrevious == "Supervisor")) {
                    if (!$("#graphtab").eq(0).hasClass("ui-state-active")) {
                        $('#graphlabel').trigger('click');
                    }
                    appApmReport.setDashboardFilters($(this).val());
                }
                stgDashboardPrevious = $(this).val();
            });

        }

        if ($.cookie("TP1Username") == "jeffgack") {
            $("#StgDeveloper").show();
            $("#experimental1").show();
        }

        appApmSettings.init({
            id: "StgNotifications",
            ui: "combo"
        });

        appApmSettings.init({
            id: "StgTooltips",
            ui: "iphoneswitch"
        });
        $("#StgTooltips select").bind("change", function () {
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
        else if (a$.urlprefix() == "cox.") {
            $("#StgRanking select").val("On");
            $("#StgRankCSRsBy select").val("PartnerTier");
        }

        $("#suptoolstab").hide();
        if ((a$.urlprefix() == "chime.") || (a$.urlprefix() == "chime-test.") || (a$.urlprefix() == "chime-make40.") || (a$.urlprefix() == "chime-mnt.")) {
            //No tools tab.
        } else if ((a$.urlprefix() == "ers.") || (a$.urlprefix() == "cthix.") || (a$.urlprefix().indexOf("make") >= 0) || (a$.urlprefix() == "ec2.") || ((a$.urlprefix() == "ces.") || (a$.urlprefix() == "ces-demo."))) {
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
                //$("#suptoolstab").show();
                //appApmSupTools.init();
            }
            //alert("debug:role cookie=" + $.cookie("TP1Role"));
            appApmSettings.init({
                id: "StgToolsLevel",
                ui: "slider"
            });
            $("#StgToolsLevel select").bind("change", function () {
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
                $("#StgInTraining select").each(function () {
                    $(this).val("Include");
                });
                $("#StgRanking select").val("Off");
            }
        appApmSettings.init({
            id: "StgInTraining",
            ui: "combo"
        });
        appApmSettings.init({
            id: "StgAgentStatus",
            ui: "combo"
        });
        if (a$.urlprefix() != "bgr_NOT_RELEASED_YET.") {
            $("#StgAgentStatus").hide();  //Will be "PASS"
        }
        appApmSettings.init({
            id: "AttritionShowInTraining",
            shadow: "StgInTraining",
            ui: "combo"
        });
        appApmSettings.init({
            id: "ReportShowInTraining",
            shadow: "StgInTraining",
            ui: "combo"
        });

        if (a$.urlprefix() == "chime.") {
            //$("#StgInTraining").hide();
            $("#StgInTraining select").each(function () {
                $(this).val("Include");
            });
        }
        if ($.cookie("TP1Role") == "CSR") {
            $("#StgInTraining").hide();
        }

        appApmSettings.init({
            id: "StgGraphLabels",
            ui: "combo",
            textabove: "label",
            textbelow: "none"
        });
        $("#StgGraphLabels select").bind("change", function () {
            appApmDashboard.StgGraphLabels_update(0);
        });



        if (a$.urlprefix() == "da.") {
            $("#StgDisplayScreen select").html('<option value="" selected="selected">All</option><option value="1">HMSV - Outbound (OB)</option><option value="2">HMSV - Inbound (IB)</option><option value="4">OHS - Core/Stim/Retn (CR)</option><option value="5">OHS - Sales (SL)</option><option value="6">Hilton HVC (HVC)</option><option value="7">Hilton HGV (HGV)</option><option value="3">Other</option>');
        }
        else if (a$.urlprefix() == "bgr.") {
            //The default markup is for bgr.
        }

        appApmSettings.init({
            id: "StgDisplayScreen",
            ui: "combo"
        });

        if ((a$.urlprefix() == "bgr.") || (a$.urlprefix() == "da.")) {
            $("#StgDisplayScreen").show();

            /* Require Submit
            $("#StgDisplayScreen select").bind("change", function () {
            //alert("debug: StgBarView select=" + $("#StgBarView select").val());
            if ((document.getElementById("rdoBase").checked)) {
            appApmDashboard.StgBarView_update(0);
            }
            });
            */
        }

        appApmSettings.init({
            id: "StgBarView",
            ui: "combo"
        });
        $("#StgBarView select").bind("change", function () {
            //alert("debug: StgBarView select=" + $("#StgBarView select").val());
            if ((document.getElementById("rdoBase").checked) || (document.getElementById("rdoPay").checked)) {
                appApmDashboard.StgBarView_update(0);
            }
        });

        if (a$.preview()) {
            appApmSettings.init({
                id: "StgShowSeries",
                ui: "combo"
            });
            $("#StgShowSeries select").bind("change", function () {
                if ((document.getElementById("rdoBase").checked) || (document.getElementById("rdoPay").checked)) {
                    appApmDashboard.StgShowSeries_update(0);
                }
            });
        }


        appApmSettings.init({
            id: "StgFilterRefreshFrequency",
            ui: "slider"
        });
        $("#StgFilterRefreshFrequency select").bind("change", function () {
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
        $("#StgGraphRefreshFrequency select").bind("change", function () {
            appApmDashboard.setDataPerfLevel($(this).val());
        });

        appApmSettings.init({
            id: "StgRankCSRsBy",
            ui: "slider"
        });
        $("#StgRankCSRsBy select").bind("change", function () {
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

        $("#add").click(function () {
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
                if ((a$.urlprefix() == "cox.")) {
                }
                else if ((a$.urlprefix() == "bgr.") && ($.cookie("ApmProject") != "Sales and Marketing")) {
                }
                else if (a$.urlprefix() == "walgreens.") {
                }
                else {
                    $("#StgSupervisorFilters").show();
                    $("#StgSupervisorFilters_label").show();
                    appApmSettings.init({
                        id: "StgSupervisorFilters",
                        ui: "slider"
                    });
                    $("#StgSupervisorFilters select").bind("change", function () {
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
            case "chime-mnt.":
            case "cox.":
            case "ces.":
            case "ces-demo.":
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
            case "sunpro.":
            case "twc.":
            case "sprintgame.":
            case "cthix.":
            case "veyo.":
            case "mtm.":
            case "frost-arnett.":
            case "act.":
            case "performant.":
            case "performant-healthcare.":
            case "united.":
            case "united2.":
            case "collective-solution.":
                $("#scoreeditor_li").hide();
                if ($.cookie("TP1Role") == "CSR") {
                    $("#attendancetracker_li").hide();
                } else {
                    $("#attendancetracker_li").show();
                }
                $("#StgFilterRefreshFrequency select").val("Always");
                $("#StgGraphRefreshFrequency select").val("Always");
                appApmDashboard.setDataPerfLevel("Always"); //Shouldn't need to do this...

                if (($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin") || ((a$.urlprefix() == "chime.") && (($.cookie("TP1Username") == "mjobe") || ($.cookie("TP1Username").toLowerCase() == "tlyle")))) {
                    $(".headericon-import").show();
                }
                if (a$.urlprefix() == "km2.") {
                    $(".headericon-import").hide(); //Disable for now
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
            ui: "combo"
        });

        if ((a$.urlprefix() == "chime.") || (a$.urlprefix() == "chime-test.") || (a$.urlprefix() == "chime-make40.") || (a$.urlprefix() == "chime-mnt.")) {
            $("#StgHireDatesFilter").hide();
        }

        if ($.cookie("TP1Role") == "CSR") {
            $("#StgHireDatesFilter").hide();
        }

        $("#StgHireDatesFilter select").bind("change", function () {
            if ($(this).val() == "Filter On") {
                //$("#hiredatelabel,#hiredatefilter").show();
                $("#newhiredatesdl").show();
            }
            else {
                //$("#hiredatelabel,#hiredatefilter").hide();
                $("#newhiredatesdl").hide();
            }
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

        if (($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin") || ($.cookie("TP1Role") == "Management") || ($.cookie("TP1Username") == "sfletcher")
            || (((a$.urlprefix() == "veyo.") || (a$.urlprefix() == "mtm.")) && (($.cookie("TP1Username") == "krohrbeck") || ($.cookie("TP1Username") == "CButler002") || ($.cookie("TP1Username") == "cbutler") || ($.cookie("TP1Username") == "aponyicsanyi")))
        ) {
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
        }
        else if (a$.urlprefix().indexOf("chime") >= 0) {
            //if (!(($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin") || ($.cookie("TP1Role") == "Management") || ($.cookie("TP1Role") == "Quality Assurance"))) {
            if (!(($.cookie("TP1Role") == "Team Leader") || ($.cookie("TP1Role") == "Management") || ($.cookie("TP1Role") == "Group Leader"))) {
                //$("#scoring_li").find("*").css("color", "lightgray").css("cursor", "wait").attr("href", "#");
            }
            $("#classicdashboard_li").hide().find("*").css("color", "lightgray").css("cursor", "wait").attr("href", "#");
            //$("#admin_li").hide().find("*").css("color", "lightgray").css("cursor", "wait").attr("href", "#").hide();
            //$("#monitor_li").hide().find("*").css("color", "lightgray").css("cursor", "wait").attr("href", "#");
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
                $("#header_ul li").each(function () {
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

        if (filteredproject && (a$.urlprefix() == "km2.")) {
            $("#monitor_li").hide();
            $("#reports_restricted_li").hide();
            $("#admin_li").hide();
        }

        if (filteredproject && (a$.urlprefix() == "da.")) {
            //$(".nav3-icon").hide();
            $(".nav3 ul li").hide();
            $("#monitor_li").show();
        }

        if ((a$.urlprefix() == "da.")) {
            $("#manualimport_li").remove();
        }


        //Hide almost everything, especially for the pilot.
        if (a$.urlprefix() == "walgreens.") {
            $("#classicdashboard_li").hide();
            if (a$.urlprefix(true).indexOf("mnt") != 0) {
                $("#monitor_li").hide();
            }
            $("#reports_normal_li").hide();
            $("#reports_restricted_li").hide();
            if ($.cookie("TP1Role") != "Admin") {
                $("#admin_li").hide();
            }
            $("#import_li").hide();
            $("#scoreeditor_li").hide();
            //$("#newadmin_li").hide();
            $("#graphappearance_li").hide();
            $("#userpreferences_li").hide();
            $("#scoring_li").hide();
            $("#advancedsettings_li").hide();
            $("#manualimport_li").hide();
            $("#chatbox_li").hide();
            //$(".easycom-editor").hide();
        }

        if (a$.urlprefix() == "performant.") {
            $("#reports_normal_li").hide();
            $("#reports_restricted_li").hide();
            $(".easycom-editor").hide();
            $("#scoring_li").hide();

            if (($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin")) {
                $("#scoring_li").show();
            }
            if (!(($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin") /* //2025-03-17: || ($.cookie("TP1Role") == "Quality Assurance") */)) {
                $("#monitor_li").remove();
                //2025-03-17:
                $("#admin_li").remove();
            }
            if (($.cookie("TP1Role") == "Team Leader") || ($.cookie("TP1Role") == "CSR")) {
                $("#admin_li").remove(); //Experimental "remove", safe place for it.
            }
        }

        if (a$.urlprefix() == "bgr.") {
            if ($.cookie("TP1Role") == "CSR") {
                if (a$.urlprefix(true).indexOf("mnt") != 0) {
                    $("#monitor_li").remove();
                }
            }
        }

        if (a$.urlprefix() == "performant-recovery.") {
            $("#reports_normal_li").hide();
            $("#reports_restricted_li").hide();
            $(".easycom-editor").hide();
            $("#scoring_li").hide();

            if (($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin")) {
                $("#scoring_li").show();
            }
            if ((($.cookie("TP1Role") == "CSR") || ($.cookie("TP1Role") == "Team Leader") || ($.cookie("TP1Role") == "Group Leader"))) {
                //TEMPORARY REMOVAL: $("#monitor_li").hide();
                $("#admin_li").hide();
            }
        }

        if ((a$.urlprefix() == "ces.") || (a$.urlprefix() == "ces-demo.")) {
            $(".headericon-chat").hide();
        }

        $("#StgEditing select").bind("change", function () {
            var setting = $(this).val();
            $(".edit-span").each(function () {
                var hold;
                if (setting == "On") {
                    hold = $(this).html();
                    $(this).html('<input type="text" value="' + hold + '"/>');
                } else {
                    hold = $(" input", this).val();
                    $(this).html(hold);
                }
            });
            $(".stg-span").each(function () {
                if (setting == "On") {
                    $(this).children().each(function () {
                        $(this).show();
                    });
                    $(" > span > span", this).hide();
                    $(" > label > span", this).remove();
                } else {
                    $(this).children().each(function () {
                        $(this).hide();
                    });
                    //$(" > label", this).html($(" > label", this).html() & "<span>HELLO!</span>");
                    $(" > label", this).append("<span>" + $(" > span > span", this).html() + "</span>");
                    $(" > label", this).show();

                    //$(" > span > span", this).show();
                }
            });
        });

        $("#btnSEView").bind("click", function () {
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
        try {
            resizedivs();
        } catch (err) { };

        $(window).bind("hashchange", function () {
            usehash();
        });

        if (true) { //MAKEDEV (this is now NOT defeated).
            if ((a$.urlprefix() == "cox.") || (a$.urlprefix().indexOf("cox-mnt") >= 0)) {
                if (($.cookie("TP1Role") == "Team Leader") || ($.cookie("TP1Role") == "CSR")) {
                    setTimeout(setsupfilter, 5000);
                    function setsupfilter() {
                        if ($.cookie("TP1Role") == "Team Leader") {
                            $("#StgSupervisorFilters select").val("Location"); //TODO: change to "Entire Project"
                            $.cookie("DefaultTeam", $("#selTeams").val());

                        }
                        else if ($.cookie("TP1Role") == "CSR") {
                            $("#StgSupervisorFilters select").val("Team");
                        }
                        appApmDashboard.StgSupervisorFilters_update(0);
                        if ($.cookie("TP1Role") == "CSR") {
                            if (a$.gup("test") == "1") {
                                setTimeout(fantabover, 3000);
                                function fantabover() {
                                    $('#fanlabel').trigger('click');
                                    ko.postbox.publish("FanSetGamelessPlayerHome", true);
                                }
                            }
                        }
                    }
                }
            }
        }
        //To force iFrame refresh, publish yourself if you're a CSR (problem with the Review tab)
        if ($.cookie("TP1Role") == "CSR") {
            ko.postbox.publish("JournalCSR", $.cookie("TP1Username"));
            ko.postbox.publish("CSR", $.cookie("TP1Username"));
            window.Selected.CSR = "";
        }

        var interval = setInterval(function () {
            if (document.readyState === 'complete') {
                clearInterval(interval);
                $(".splash").hide();
            }
        }, 100);

        //End of ready .ready?

    });

    var paper = Raphael(0, 0, 500, 70);

    function animatelogo() {
        if (true || a$.preview()) {
            paper.clear();
            if ((pageTheme == "Acuity3") || (pageTheme == "Shutterfly")) {
                var lof; //logo offset
                var red_start_rad, red_final_rad;
                var blue_rad;
                var lofnb;
                var loft;
                var yellow_start_rad, yellow_final_rad;
                if ((a$.gup("notheme") == "") && ((a$.urlprefix() == "ers.") || (a$.urlprefix() == "NOTers-mnt.") || (a$.urlprefix() == "rcm.") || (a$.gup("theme") == "CEScore") /* || ((a$.urlprefix() == "ces.") || (a$.urlprefix() == "ces-demo.")) */)) {
                    $(".logo").css("top", "13px").css("margin-left", "10px").css("height", "70px").css("width", "450px").css("background-repeat", "no-repeat").css("background-height", "no-repeat");
                    //$(".logo").css("background-image", 'url("../App_Themes/Acuity3/images/CESCORE_AcuityD.png")');
                    $(".logo").css("background-image", 'url("../App_Themes/Acuity3/images/tsi-logo.png")');
                    $(".heading").css("top", "30px").css("left", "170px");
                    $(".logo-reload").hide();
                    return;
                } else if ((a$.gup("notheme") == "") && ((a$.urlprefix() == "walgreens."))) {
                    $(".logo").css("top", "15px").css("height", "70px").css("width", "450px").css("background-repeat", "no-repeat").css("background-height", "no-repeat");
                    $(".logo").css("background-image", 'url("../App_Themes/Acuity3/images/walgreens-toplogo-red.png")');
                    $(".heading").css("top", "45px").css("left", "320px");
                    $(".logo-reload").hide();
                    return;
                } else if ((a$.gup("notheme") == "") && ((a$.urlprefix() == "km2."))) {
                    $(".logo").css("top", "15px").css("height", "70px").css("left", "65px").css("width", "450px").css("background-repeat", "no-repeat").css("background-height", "no-repeat");
                    $(".logo").css("background-image", 'url("../App_Themes/Acuity3/images/km2-color.png")');
                    $(".heading").css("top", "30px").css("left", "320px");
                    $(".logo-reload").hide();
                    return;
                } else if ((a$.gup("notheme") == "") && ((a$.urlprefix() == "test-km2."))) {
                    $(".logo").css("top", "15px").css("height", "70px").css("width", "450px").css("background-repeat", "no-repeat").css("background-height", "no-repeat");
                    $(".logo").css("color", "red").css("font-size", "30px");
                    $(".logo").html("KM2 Test Environment");
                    $(".heading").css("top", "45px").css("left", "320px");
                    $(".logo-reload").hide();
                    return;
                } else if ((a$.gup("theme").toLowerCase() == "sprint") || debug_makingsprintgame || (a$.urlprefix().indexOf("sprintgame.") >= 0)) {
                    $(".logo").css("top", "0px").css("height", "70px").css("width", "502px"); //.css("background-size", "91%");
                    $(".logo").css("background-image", 'url("../App_Themes/Acuity3/images/Sprint_LOC_logo_jeffsMod2.png")');
                    $(".app-header").removeClass("gradient-lightest");
                    $(".heading").css("top", "45px").css("left", "320px").hide();
                    $(".logo-reload").hide();
                    return;
                }
                else if ((a$.gup("notheme") == "") && (a$.urlprefix() == "ces-demo.")) {
                    $(".logo").css("top", "0px").css("height", "70px").css("width", "450px").css("background-repeat", "no-repeat").css("background-height", "no-repeat");
                    $(".logo").css("background-image", 'url("../App_Themes/Acuity3/images/CES/CURRENTDEMO.png")');
                    $(".logo").css("background-size", "contain");
                    $(".logo-reload").hide(); //Sorry Julie :?
                    $(".heading").css("top", "45px").css("left", "320px");
                    return;
                }
                else if ((a$.gup("notheme") == "") && ((a$.urlprefix() == "united.") || (a$.urlprefix() == "united2."))) {
                    $(".logo").css("top", "0px").css("height", "70px").css("width", "450px").css("background-repeat", "no-repeat").css("background-height", "no-repeat");
                    $(".logo").css("background-image", 'url("../App_Themes/Acuity3/images/united-logo-white.png")');
                    $(".logo").css("background-size", "contain");
                    $(".logo-reload").hide(); //Sorry Julie :?
                    $(".heading").css("top", "45px").css("left", "320px");
                    return;
                }
                else if ((a$.gup("notheme") == "") && ((a$.urlprefix() == "NOTchime.") || (a$.urlprefix() == "NOTchime-make40.") || (a$.urlprefix() == "NOTchime-mnt."))) {
                    $(".logo").css("top", "-3px").css("left", "82px").css("height", "70px").css("width", "150px").css("background-repeat", "no-repeat").css("background-height", "no-repeat");
                    $(".logo").css("background-image", 'url("../App_Themes/Acuity3/images/chime-header-logo.svg")');
                    $(".logo").css("background-position", 'left');
                    $(".logo").css("top", '-3px');
                    $(".heading").css("top", "25px").css("left", "230px");
                    $(".logo-reload").hide(); //Sorry Julie :?
                    //$(".logo").prepend('<div style="font-size: 30px;position:absolute;top:32px;left:145px;">Score</div>');
                    return;
                }
                /*  KM2 THEME (NOT YET) :
                else if ((a$.gup("notheme") == "") && ((a$.urlprefix() == "km2.") )) {
                $(".logo").css("top", "5px").css("left","80px").css("height", "70px").css("width", "450px").css("background-repeat", "no-repeat").css("background-height", "no-repeat");
                $(".logo").css("background-image", 'url("../App_Themes/Acuity3/images/KM2-Solutions-H-Logo-New-KM2.png")');
                $(".logo").css("background-size", "contain");
                $(".logo-reload").hide(); //Sorry Julie :?
                //$(".heading").css("top", "45px").css("left", "500px");

                return;
                }
                */
                else if (false) { //Animated Acuity Logo with CEScore
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
                    $(".logo").css("width", "175px");
                    lof = [4, -4];
                    red_start_rad = [83, 18];
                    red_final_rad = [43, 18];
                    blue_rad = [61, 23];
                    lofnb = [0, 0];
                    yellow_start_rad = [153, 123];
                    yellow_final_rad = [53, 23];
                    loft = [0, 0];
                }

            }
        }

    }

    //{ letter: "A+", threshold: 0.95, segment: { low: 0.95, high: 1.0 }, color: "#FF6600", stops: [[0, '#BB5500'], [1, '#FF6600'], [2, '#FF6600']] }, //TODO: change color


    function varigauge(gn) {
        var SWEEP_OFFSET = 0.0;
        var SWEEP_RATIO = 1.0;

        $("#gaugeover" + gn).show();
        var SCOREBASIS = 10.0;
        if ((a$.urlprefix() == "km2.") || (a$.urlprefix() == "test-km2.")) {
            SCOREBASIS = 150.0;
        }
        if ((a$.urlprefix() == "chime.")) {
            SCOREBASIS = 10.0;
        }
        if ((a$.urlprefix() == "cox.") || (a$.urlprefix() == "cox-test.") || (a$.urlprefix() == "cox-mnt.")) {
            SCOREBASIS = 7.0;
        }
        if ((a$.urlprefix() == "sunpro.")) {
            SCOREBASIS = 7.0;
        }
        if ((a$.urlprefix() == "frost-arnett.") || (a$.urlprefix() == "frost-arnett-mnt.")) {
            SCOREBASIS = 5.0;
        }
        if ((a$.urlprefix() == "united.") || (a$.urlprefix() == "united-mnt.") || (a$.urlprefix() == "united2.")) {
            SCOREBASIS = 110.0;
        }
        if ((a$.urlprefix() == "collective-solution.")) {
            SCOREBASIS = 100.0;
        }
        if ((a$.urlprefix() == "walgreens.")) {
            SCOREBASIS = 3.0;
            SWEEP_RATIO = 0.5;
            SWEEP_OFFSET = -270.0;
        }
        var gpaper = Raphael("gaugeover" + gn, 280, 200);
        var lof;
        var rad;

        lof = [141, 160];
        rad = [103, 26];

        function radialpoint(o) {
            var duck2 = 1;
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
                var LowNumber = 0;
                if (a$.urlprefix() == "walgreens.") {
                    LowNumber = -3;
                }

                if ((a$.urlprefix() == "united.") || (a$.urlprefix() == "united-mnt.") || (a$.urlprefix() == "united2.")) {
                    //Some #s
                    var nset = [0, 70, 80, 90, 100];
                    for (var n = 0; n < nset.length; n++) {
                        var letter = gpaper.text(
                                            lof[0] + (radnums[1] + 9) * Math.cos((180.0 + ((nset[n] / HighNumber) * 180.0)) * (Math.PI / 180.0)),
                                            lof[1] + (radnums[1] + 9) * Math.sin((180.0 + ((nset[n] / HighNumber) * 180.0)) * (Math.PI / 180.0)),
                                                "" + nset[n]);
                        //alert("debug:lgetter=" + n);
                        letter.attr({
                            fill: "white",
                            "font-size": "11"
                        });
                    }
                }
                else if ((a$.urlprefix() == "collective-solution.")) {
                    //Some #s
                    var nset = [0, 40, 80, 100];
                    for (var n = 0; n < nset.length; n++) {
                        var letter = gpaper.text(
                                            lof[0] + (radnums[1] + 9) * Math.cos((180.0 + ((nset[n] / HighNumber) * 180.0)) * (Math.PI / 180.0)),
                                            lof[1] + (radnums[1] + 9) * Math.sin((180.0 + ((nset[n] / HighNumber) * 180.0)) * (Math.PI / 180.0)),
                                                "" + nset[n]);
                        //alert("debug:lgetter=" + n);
                        letter.attr({
                            fill: "white",
                            "font-size": "11"
                        });
                    }
                }
                else if ((a$.urlprefix() == "km2.") || (a$.urlprefix() == "test-km2.")) {
                    //Some #s
                    var nset = [0, 90, 100, 105];
                    for (var n = 0; n < nset.length; n++) {
                        var letter = gpaper.text(
                                            lof[0] + (radnums[1] + 9) * Math.cos((180.0 + ((nset[n] / HighNumber) * 180.0)) * (Math.PI / 180.0)),
                                            lof[1] + (radnums[1] + 9) * Math.sin((180.0 + ((nset[n] / HighNumber) * 180.0)) * (Math.PI / 180.0)),
                                                "" + nset[n]);
                        //alert("debug:lgetter=" + n);
                        letter.attr({
                            fill: "white",
                            "font-size": "9"
                        });
                    }
                }
                else {  //Every #
                    var duck = 1;
                    for (var n = LowNumber; n <= HighNumber; n++) {
                        var letter = gpaper.text(
                                            lof[0] + (radnums[1] + 9) * Math.cos((SWEEP_OFFSET + 180.0 + (SWEEP_RATIO * (n / HighNumber) * 180.0)) * (Math.PI / 180.0)),
                                            lof[1] + (radnums[1] + 9) * Math.sin((SWEEP_OFFSET + 180.0 + (SWEEP_RATIO * (n / HighNumber) * 180.0)) * (Math.PI / 180.0)),
                                                "" + n);
                        //alert("debug:lgetter=" + n);
                        letter.attr({
                            fill: "white",
                            "font-size": "11"
                        });
                    }
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
                sweep: [SWEEP_OFFSET + 180.0 + ((SWEEP_RATIO * controlopts.performanceRanges[i].pie.high / SCOREBASIS) * 180.0), SWEEP_OFFSET + 180.0 + ((SWEEP_RATIO * controlopts.performanceRanges[i].pie.low / SCOREBASIS) * 180.0)],
                opacity: 1.0
            });
            var final = bandpath({
                origin: lof,
                radii: rad,
                color: controlopts.performanceRanges[i].color,
                sweep: [SWEEP_OFFSET + 180.0 + ((SWEEP_RATIO * controlopts.performanceRanges[i].pie.high / SCOREBASIS) * 180.0), SWEEP_OFFSET + 180.0 + ((SWEEP_RATIO * controlopts.performanceRanges[i].pie.low / SCOREBASIS) * 180.0)],
                opacity: 1.0
            });
            color.animate({
                path: final
            }, 0, ">");
            var letter = gpaper.text(lof[0] + ((rad[0] / 1.5) * Math.cos((SWEEP_OFFSET + 180.0 + ((SWEEP_RATIO * controlopts.performanceRanges[i].pie.low / SCOREBASIS) * 180.0) + (((SWEEP_RATIO * (controlopts.performanceRanges[i].pie.high - controlopts.performanceRanges[i].pie.low) / SCOREBASIS) * 180.0) /
										2.0)) * (Math.PI / 180.0))),
									lof[1] + ((rad[0] / 1.5) * Math.sin((SWEEP_OFFSET + 180.0 + ((SWEEP_RATIO * controlopts.performanceRanges[i].pie.low / SCOREBASIS) * 180.0) + (((SWEEP_RATIO * (controlopts.performanceRanges[i].pie.high - controlopts.performanceRanges[i].pie.low) / SCOREBASIS) * 180.0) / 2.0)) * (Math.PI /
										180.0))), controlopts.performanceRanges[i].letter);
            if ((a$.urlprefix() == "bgr.") || (a$.urlprefix() == "bgr-test.") || (a$.urlprefix() == "bgr-make40.") || (a$.urlprefix() == "chime.") || (a$.urlprefix() == "chime-test.") || (a$.urlprefix() == "chime-make40.") || (a$.urlprefix() == "chime-mnt.")) {
                letter.attr({
                    fill: "black",
                    "font-size": "18"
                });
            } else if ((a$.urlprefix() == "united.") || (a$.urlprefix() == "united-mnt.") || (a$.urlprefix() == "united2.")) {
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
        if ($.cookie("TP1Username") == "jeffNOTNOWgack") {
            if (!a$.exists(window.graphtab)) {
                alert("debug: window.graphtab does not exist");
            }
            else {
                alert("debug: window.graphtab = " + window.graphtab);
            }
            /*
            if ($("#graphsublabel").eq(0).is(":visible")) {
            alert("debug: split tab is visible");
            }
            else {
            alert("debug: split tab is NOT visible");
            }
            */
        }

        $("#gaugesdiv1,#gaugesdiv2,#messagediv,#datasourcediv,#filterdiv,#dashboardcontroldiv,#scoreeditorcontroldiv,#settingsdiv,#scoringdiv,#companydiv,#modeldiv,#projectdiv,#kpidiv,#subkpidiv,#manualimportdiv").hide();
        $("#graphtab,#graphsubtab,#tabletab,#messagetab,#advancedsettingstab,#companytab,#modeltab,#projecttab,#kpitab,#subkpitab,#userpreferencestab,#scoreeditortab,#manualimporttab").hide();

        //These things should now ALWAYS be showing:

        $("#filterdiv,#messagediv").show();
        $("#graphtab").show();

        $(".admin-editing-wrapper").hide();
        if ((a$.urlprefix() == "cox.") || (a$.urlprefix() == "cox-mnt.")) {
            $(".settingsdiv-wrapper").hide();
        }

        switch (location.hash) {
            case "#MessagingNav":
                window.location = "#Messaging";
                break;
            case "#Messaging":
                //if ((a$.urlprefix().indexOf("chime-make40.") >= 0) || (a$.urlprefix() == "chime.") /* || (a$.urlprefix() == "chime-mnt.") */) {
                //    if ($.cookie("TP1Role") == "CSR") {
                //        location.hash = "";
                //        return;
                //    }
                //}

                /*
                //MADELIVE: split view is the master.
                if ($("#graphsublabel").eq(0).is(":visible")) {
                if ($.cookie("TP1Username") == "jeffgack") {
                alert("debug: split is registering as visible");
                }
                $('#graphsublabel').trigger('click');
                }
                else {
                if ($.cookie("TP1Username") == "jeffgack") {
                alert("debug: showing graphtab");
                }
                $("#graphtab").show();
                $('#graphlabel').trigger('click');
                }
                */
                $("#messagediv").show();
                $(".heading").html("Messaging");
                $('#messagetab').show();
                $('#messageslabel').trigger('click');
                break;
            case "#GraphAppearance":
                $("#settingsdiv").show();
                $(".heading").html("Settings - Graphic Appearance");

                //MADELIVE: split view is the master.
                if ($("#graphsublabel").eq(0).is(":visible")) {
                    $('#graphsublabel').trigger('click');
                }
                else {
                    $("#graphtab").show();
                    $('#graphlabel').trigger('click');
                }

                if ((a$.urlprefix() == "cox.") || (a$.urlprefix() == "cox-mnt.")) {
                    $(".settingsdiv-wrapper").show();
                }
                break;
            case "#Scoring":
                appApmScoreEditing.initDataSources();
                if (($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin") || ($.cookie("TP1Role") == "Management") || ($.cookie("TP1Username") == "sfletcher") || ($.cookie("TP1Role") == "Group Leader") || ($.cookie("TP1Role") ==
											"Team Leader")
                    || (((a$.urlprefix() == "veyo.") || (a$.urlprefix() == "mtm.")) && (($.cookie("TP1Username") == "krohrbeck") || ($.cookie("TP1Username") == "CButler002") || ($.cookie("TP1Username") == "cbutler") || ($.cookie("TP1Username") == "aponyicsanyi")))
                ) {
                    $("#scoringdiv").show();
                    $(".heading").html('Settings - <span class="scaname">Project</span>s &amp; Scoring');
                    appApmDashboard.setClientLabels();
                    $("#messagetab").show(); //To keep all tabs to the right of the filter box.
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
                $("#gaugesdiv1,#gaugesdiv2,#messagediv,#filterdiv,#dashboardcontroldiv,#settingsdiv").show();
                if (document.getElementById("rdoGrid").checked) $("#rdoGrid").trigger("click");
                if (document.getElementById("rdoPay").checked) $("#rdoPay").trigger("click");
                if (document.getElementById("rdoBase").checked) $("#rdoBase").trigger("click");
                if (document.getElementById("rdoTrend").checked) $("#rdoTrend").trigger("click");
                $(".heading").html("Classic Dashboard");
                if ($("#graphsublabel").html() != "Split") $('#graphsubtab').show();
                if ($("#tablelabel").html() != "Table") $('#tabletab').show();

                //MADELIVE: split view is the master.
                if ($("#graphsublabel").eq(0).is(":visible")) {
                    $('#graphsublabel').trigger('click');
                }
                else {
                    $("#graphtab").show();
                    $('#graphlabel').trigger('click');
                }
                break;
            case "#GraphsReports":
                $("#gaugesdiv1,#gaugesdiv2,#filterdiv,#dashboardcontroldiv,#settingsdiv").show();
                if (document.getElementById("rdoGrid").checked) $("#rdoGrid").trigger("click");
                if (document.getElementById("rdoPay").checked) $("#rdoPay").trigger("click");
                if (document.getElementById("rdoBase").checked) $("#rdoBase").trigger("click");
                if (document.getElementById("rdoTrend").checked) $("#rdoTrend").trigger("click");

                if ($("#graphsublabel").html() != "Split") $('#graphsubtab').show();
                if ($("#tablelabel").html() != "Table") $('#tabletab').show();

                //MADELIVE: split view is the master.
                if ($("#graphsublabel").eq(0).is(":visible")) {
                    $('#graphsublabel').trigger('click');
                }
                else {
                    $("#graphtab").show();
                    $('#graphlabel').trigger('click');
                }

                break;
            case "#Report":
                if ((window.reportuid) && (window.reportuid != "")) {
                    try {
                        window.reportclickintercept = "Yes";
                        loadcustomreport();
                    }
                    catch (e) {
                        alert("Init Controls Failure");
                    }
                }
                break;
            default:
                if (false) { //((a$.urlprefix() == "ers.") || (a$.urlprefix() == "cthix.") || (a$.urlprefix() == "ers-alpha.")) {
                    //default is Classic for ERS for now.
                    $("#gaugesdiv1,#gaugesdiv2,#filterdiv,#dashboardcontroldiv,#settingsdiv").show();
                    if (document.getElementById("rdoPay").checked) $("#rdoPay").trigger("click");
                    if (document.getElementById("rdoGrid").checked) $("#rdoGrid").trigger("click");
                    if (document.getElementById("rdoBase").checked) $("#rdoBase").trigger("click");
                    if (document.getElementById("rdoTrend").checked) $("#rdoTrend").trigger("click");
                    $(".heading").html("Classic Dashboard");
                    if ($("#graphsublabel").html() != "Split") $('#graphsubtab').show();
                    if ($("#tablelabel").html() != "Table") $('#tabletab').show();
                    //MADELIVE: split view is the master.
                    if ($("#graphsublabel").eq(0).is(":visible")) {
                        $('#graphsublabel').trigger('click');
                    }
                    else {
                        $("#graphtab").show();
                        $('#graphlabel').trigger('click');
                    }
                } else if (debug_makingsprintgame || (a$.urlprefix() == "sprintgame.")) {
                    $("#gaugesdiv1,#gaugesdiv2,#filterdiv,#dashboardcontroldiv,#settingsdiv").show();
                    if (document.getElementById("rdoPay").checked) $("#rdoPay").trigger("click");
                    if (document.getElementById("rdoGrid").checked) $("#rdoGrid").trigger("click");
                    if (document.getElementById("rdoBase").checked) $("#rdoBase").trigger("click");
                    if (document.getElementById("rdoTrend").checked) $("#rdoTrend").trigger("click");

                    if ($("#graphsublabel").html() != "Split") $('#graphsubtab').show();
                    if ($("#tablelabel").html() != "Table") $('#tabletab').show();

                    //MADELIVE: split view is the master.
                    if ($("#graphsublabel").eq(0).is(":visible")) {
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

                    if (a$.urlprefix() == "NOTwalgreens.") {
                        $(".gaugesdiv-wrapper").hide();
                    }

                    $("#gaugesdiv1,#gaugesdiv2,#filterdiv,#dashboardcontroldiv,#settingsdiv").show();
                    if (document.getElementById("rdoPay").checked) $("#rdoPay").trigger("click");
                    if (document.getElementById("rdoGrid").checked) $("#rdoGrid").trigger("click");
                    if (document.getElementById("rdoBase").checked) $("#rdoBase").trigger("click");
                    if (document.getElementById("rdoTrend").checked) $("#rdoTrend").trigger("click");

                    if ($("#graphsublabel").html() != "Split") $('#graphsubtab').show();
                    if ($("#tablelabel").html() != "Table") $('#tabletab').show();

                    //MADELIVE: split view is the master.
                    if ($("#graphsublabel").eq(0).is(":visible")) {
                        $('#graphsublabel').trigger('click');
                    }
                    else {
                        $("#graphtab").show();
                        $('#graphlabel').trigger('click');
                    }


                }


                try {
                    if (location.hash.indexOf("#Report_") == 0) {
                        window.reportuid = location.hash.substring(8);
                        window.location = "#Report";
                        //$("#reporttab").show();
                        //$("#reportlabel").trigger("click");
                        //alert("debug: Load report " + reportuid);
                    }
                }
                catch (e) {
                    alert("debug: report error " + e);
                }




                break;
        }
        $("#dashboardcontroldiv").show(); //Try always showing this.
        animatelogo();
    }

    /*
    $("#slider").bind("slidechange", function (event, ui) {
    alert("debug:slider changed");
    });
    */

    $('.btnPlot').click(function () {
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

    $('#btnAdd').click(function () {
        //$('#graphlabel').trigger('click'); //Removed 2022-06-24
        appApmDashboard.plotme(0, false, false);
    });

    $('#btnClear').click(function () {
        //Note: This was broken before I added the subchart.
        clearme(controlopts.views[0].chartoptions);
        clearme(controlopts.views[0].chartoptionssub);
        if (a$.exists(op.report)) {
            $("#" + op.report.renderTo).html("");
        }

        function clearme(op) {
            // $('#graphlabel').trigger('click'); //Clear is only shown on the home tab, so you should already be there.  If that changes, I still don't want to force you here.
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


    appApmSettings.init({
        id: "ReportGrouping",
        shadow: "StgReportGrouping",
        ui: "combo"
    });
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

    var XaxisHOLD = "";
    var PayPeriodHOLD = "";
    $('#rdoBase').click(function () {
        $(".report-grouping-wrapper").hide();
        $("#settingsdiv").show();

        //TEMP REMOVAL 2020-07-30: document.getElementById('btnAdd').disabled = 'disabled';
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
            else if (($("#selCSRs").val() == "each") && ($("#selKPIs").val() == "each")) {
                $('#selKPIs').val('').trigger("liszt:updated");
            }
        }
        if (((a$.urlprefix() == "cox.") || (a$.urlprefix().indexOf("cox-mnt") >= 0)) && ($.cookie("TP1Role") == "Team Leader")) {
            $("#selKPIs").val("").trigger("liszt:updated");
        }
    });

    $('#rdoGrid').click(function () {
        //TODO: For now, this is an exact duplicate of rdoBase click above.  It may be beneficial to make this different'.
        //$(".report-grouping-wrapper").show();
        $("#settingsdiv").hide();

        //document.getElementById('btnAdd').disabled = 'disabled';
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

    $("#selTrendbys").bind("change", function () {
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

    $('#rdoTrend').click(function () {
        $(".home-grouping-wrapper").hide();
        $("#settingsdiv").show();
        var sb = document.getElementById('selPayperiods');
        if (sb.selectedIndex >= 0) {
            if (PayPeriodHOLD == "") PayPeriodHOLD = sb.options[sb.selectedIndex].value;
        }
        //TEMP DISABLED 2020-07-30: document.getElementById('btnAdd').disabled = 'disabled';
        $("#selTrendbys").trigger("change");

        document.getElementById("trenddl").style.display = 'inline';
        /*
        var myperset = "each";
        if (mpar == "/month") {
        myperset = "eachmonth";
        $('#rdoMonth').click();
        //document.getElementById("trenddl").style.display = 'none';
        }
        else if (mpar == "/payperiod") {
        mperset = "each";
        $("#rdoPayperiod").click();
        //document.getElementById("trenddl").style.display = 'none';
        }
        a$.setOption(document.getElementById("selPayperiods"), myperset);
        */


        appApmDashboard.setSeriesType('line');
        appApmDashboard.setDataSet('KPI');
        document.getElementById("kpidl").style.display = 'inline';
        document.getElementById("datedl").style.display = 'none';
        /*
        if ($('#rdoMonth').attr('checked')) {
        a$.setOption(document.getElementById("selXaxiss"), "Month");
        }
        else if ($('#rdoMonth').attr('checked')) {
        a$.setOption(document.getElementById("selXaxiss"), "Payperiod");
        }
        */

        sb = document.getElementById('selKPIs');
        if (sb.selectedIndex >= 0) {
            if (sb.options[sb.selectedIndex].value == "each") {
                $('#selKPIs').val('').trigger("liszt:updated");
            }
        }
    });

    $('#rdoPay').click(function () {
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


    $('#rdoPayperiod').click(function () {
        a$.setOption(document.getElementById("selXaxiss"), "Payperiod");
        appApmDashboard.setdaterangeslider("Pay Period");
    });
    $('#rdoMonth').click(function () {
        a$.setOption(document.getElementById("selXaxiss"), "Month");
        appApmDashboard.setdaterangeslider("Month");
    });

    $(window).resize(function () {
        resizedivs();
    });

    function resizedivs() {
        $(".leftpanel").height(($(window).height() - 70) + 'px'); //was 96
        //$(".tabarea").height(($(window).height() - 122) + 'px').width(($(window).width() - 310) + 'px');
        $(".tabarea").each(function () {
            if ($(this).hasClass("sidebar-indent")) {
                $(this).height(($(window).height() - 137) + 'px').width(($(window).width() - 330) + 'px'); //Height was 172, changed to 137.
            }
            else {
                $(this).height(($(window).height() - 137) + 'px').width(($(window).width()) + 'px'); //Height was 172, changed to 137.
            }
        });

        $(".ReportReports").height(($(window).height() - (181 + 160)) + 'px').width(($(window).width() - 330) + 'px'); //Height was 172, changed to 137.
        $("#importframe").height(($(window).height()) + 'px').width(($(window).width() - 3) + 'px');
        $("#tabs").width(($(window).width() - 285) + 'px');
        if (uiInterface) uiInterface.sizebars();
        ko.postbox.publish("ResizeWindow", true);
        $(".chat-window").css("max-height", ($(window).height() - (20)) + 'px');
        $(".chat-sessions").css("max-height", ($(window).height() - (20 + 60)) + 'px');
        try {
            $("#SandboxIframe").height(($(window).height() - 230) + 'px');
        } catch (err) { }
        try {
            $("#ReportSandboxIframe").height(($(window).height() - 230) + 'px');
        } catch (err) { }
        try {
            $("#OverviewIframe").height(($(window).height() - 130) + 'px');
        } catch (err) { }

        redrawhome();

    }

    //SPLASH EXP 2
    if (a$.urlprefix() == "chime.") {
        //$(".leftpanel").addClass("active");
    }

    var filters_one_time = true;
    $(".leftpanel-close,.filters-tab,.stats-tab").bind("click", function () {
        if (filters_one_time) {
            // $(".leftpanel").addClass("active"); //SPLASH EXP 3
            filters_one_time = false;
        }
        setTimeout(function () {
            redrawhome();
        }, 500);
    });

    function loadcustomreport() {
        a$.ajax({
            type: "GET",
            service: "JScript",
            async: true,
            data: {
                lib: "spine",
                cmd: "loadreport",
                reportuid: window.reportuid
            },
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: function (json) {
                if (a$.jsonerror(json)) { } else {
                    for (var p in json.prt) {
                        switch (json.prt[p].field) {
                            case "panelcid":
                                $(".ReportReportList").val(json.prt[p].val);
                                if ($(".ReportReportList").val() != json.prt[p].val) {
                                    //TODO: If cid params change, this won't find a match.
                                    //Do a second-chance rifle if val not found.
                                    alert("Report match was not found");
                                    window.reportuid = "";
                                }
                                break;
                            case "viewparams":
                                window.reportload_viewparams = json.prt[p].val; //Needed later.
                                var vs = window.reportload_viewparams.split("&");
                                for (var i in vs) {
                                    vss = vs[i].split("=");
                                    if (window.reportload_state != "PROJECTLOADED") {
                                        //Get Project first
                                        if (vss[0] == "Project") {
                                            var sameproject = false;
                                            if ($("#selProjects").val() == vss[1]) sameproject = true;
                                            $("#selProjects").val(vss[1]);
                                            if ($("#selProjects").val() != vss[1]) {
                                                alert("Project match for report not found");
                                            }
                                            else {
                                                $.cookie(appApmDashboard.getCookiePrefix() + "-Project", $("#selProjects").val());
                                                $('#selProjects').trigger("liszt:updated");
                                                if (false) { //always loading again now.  (sameproject) { //No need to load again
                                                    window.reportuid = "";
                                                }
                                                else {
                                                    //alert("debug: load again...");
                                                    window.reportload_state = "PROJECTLOADED";
                                                    //Old way, I wonder if we get back...
                                                    sb = document.getElementById('selProjects');
                                                    appApmDashboard.change(sb, true);
                                                    //window.reportuid = ""; //TODO: call initcontrols again, don't set this blank here.
                                                }
                                                break;
                                            }
                                        }
                                    }
                                }
                                break;
                            case "title":
                                break;
                            default:
                                break;
                        }
                        //alert("debug: field=" + json.prt[p].field + ", val=" + json.prt[p].val);
                    }
                    $("#reporttab").show();
                    $("#reportlabel").trigger("click");
                }
            }
        });
    }

    function redrawhome() {
        if (a$.exists(window.lastchart)) {
            var chartdiv = document.getElementById(window.lastchart.chart.renderTo);
            chartdiv.style.width = ($(window).width() - (325)) + 'px';
            chartdiv.style.height = ($(window).height() - 140) + 'px';
            appLib.generatechart(window.lastchart);
        }
    }

    $(function () {
        $("#tabs").tabs();
        $("#tabsattrition").tabs();
    });

    if ((a$.urlprefix(true).indexOf("mnt") == 0) || ($.cookie("TP1Role") != "CSR")) {
        $(".launch-meeting").show().bind("click", function () {
            if (($(".dropdown-content").css("display") == "") || ($(".dropdown-content").css("display") == "none")) {
                $(".dropdown-content").show();
            }
            else {
                $(".dropdown-content").hide();
            }
            return false;
        }); //test
        $(".dropdown-content a").unbind().bind("click", function () {
            if ($(this).attr("href") != "https://www.google.com") {
                $(".dropdown-content").hide();
                window.open($(this).attr("href"), '_blank');
            }
            return false;
        })
        $(".dropdown-content").bind("mouseleave", function () {
            $(".dropdown-content").hide();
        }); ;

    }


    var tabsdiv = document.getElementById("tabs");
    if (tabsdiv) {
        tabsdiv.style.width = ($(window).width() - 0) + 'px';
    }
    var chartdiv = document.getElementById(op.chart.renderTo);
    if (chartdiv) {
        chartdiv.style.width = ($(window).width() - 0) + 'px';
        chartdiv.style.height = ($(window).height() - 200) + 'px';
    }
    chartdiv = document.getElementById(opsub.chart.renderTo);
    if (chartdiv) {
        chartdiv.style.width = ($(window).width() - 0) + 'px';
        chartdiv.style.height = ($(window).height() - 200) + 'px';
    }
    var pgdiv = document.getElementById('mytable1');
    if (pgdiv) {
        pgdiv.style.width = ($(window).width() - 50) + 'px';
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


    function debug() { };
    // global variables
    window.appApmMain = {
        debug: debug
    };

    function IsObject(obj) {
        return obj ? true : false;
    }
})();
