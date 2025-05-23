(function() {
    if (!window.jQuery) {
        alert("This App requires jQuery");
        return;
    }

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
    function getFinalParamsFromMyTable(o,me2) {
        var foundit = false;
        var finalparams = "";
            $(" tbody tr", $(" .rpt-table", $(me2.series.chart.renderTo).parent().parent())).each(function () { //MADELIVE: Added another .parent()
            if (!foundit) {
                var x = $(" td:nth-child(" + (o.idx.x + 1) + ")", this).html();
                var seriesname = $(" td:nth-child(" + (o.idx.seriesname + 1) + ")", this).html();
                if (a$.exists(me2.key)) { //bar
                    if ((x == me2.key) && (seriesname == me2.series.name)) {
                        foundit = true;
                        var me3 = $(" td:nth-child(" + (o.idx.seriesname + 1) + ")", this);
                        if ($(" thead .tbl-filterkey", $(me3).parent().parent().parent()).length) {
                            var filterkeycolidx = $(" thead .tbl-filterkey", $(me3).parent().parent().parent()).index();
                            filterkey = $(" td", $(me3).parent()).eq(filterkeycolidx).html().replace(/&amp;/gi, "&");
                        }
                        //alert("debug: filterkey = " + filterkey);
                        if ($(" thead .tbl-key", $(me3).parent().parent().parent()).length) {
                            var keycolidx = $(" thead .tbl-key", $(me3).parent().parent().parent()).index();
                            key = $(" td", $(me3).parent()).eq(keycolidx).html().replace(/&amp;/gi, "&"); ;
                        }
                        //alert("debug: key = " + key);

                        var selcolname = $(" th", $(" thead tr", $(me3).parent().parent().parent()).last()).eq($(me3).index()).html();
                        //alert("debug: selcolname=" + selcolname);                            
                        var seltblid = $(" .tbl-ident", $(me3).parent()).html();
                        //alert("debug: seltblid=" + seltblid);
                        var found = false;
                        var serieskey = "";
                        if ($(" tfoot .tbl-ident-" + seltblid, $(me3).parent().parent().parent()).length) {
                            serieskey = $(" tfoot .tbl-ident-" + seltblid, $(me3).parent().parent().parent()).html().replace(/&amp;/gi, "&"); ;
                        }
                        //alert("debug: serieskey=" + serieskey);
                        //TODO: Substitute to single, precedence is key > filterkey > serieskey
                        finalparams = "&" + serieskey;
                        finalparams = overrideparams(finalparams, filterkey);
                        finalparams = overrideparams(finalparams, key);
                        finalparams = "drillcolumn=" + selcolname + finalparams;
                    }
                }
            }
        });
        return finalparams;
    }



    function connectedChart(o) {
        /*
        o: {
            chartVar: "charttrend",
            renderTo: json.report.panel[i].chartbuilds[c].chartid,
            tableSelector: json.report.panel[i].chartbuilds[c].tblsel,
            idx: {
                seriesname: seriesnameidx,
                x: xidx,
                y: yidx,
                datalabel: datalabelidx,
                tooltip: tooltipidx
            },                                    
            onClick: myclickfunction
        }
        */
        var charts = {
            chartbar: {
                chart: {
                    renderTo: o.renderTo,
                    type: 'bar'
                },
                title: {
                    text: $(" .rpt-table-topper .rpt-title", $(o.tableSelector)).eq(0).html()
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    categories: ['Greeting'],
                    title: {
                        text: null
                    }
                },
                yAxis: {
                    min: 0,
                    max: 175, //HARDCODED FOR DEMO
                    title: {
                        text: '',
                        align: 'high'
                    },
                    labels: {
                        formatter: function() {
                            if (this.value > 100) return ""; //HARDCODED FOR DEMO
                            return this.value.toFixed(0) + '%';
                        },
                        overflow: 'justify'
                    }
                },
                tooltip: {
                    useHTML: true,
                    formatter: function() {
                        var me = this;
                        var tt = "";
                        $(" tbody tr", $(o.tableSelector)).each(function() {
                            if ($(" td:nth-child(" + (o.idx.x + 1) + ")", this).html() == me.x) { //Greeting
                                if ($(" td:nth-child(" + (o.idx.seriesname + 1) + ")", this).html() == me.series.name) { //Indianapolis //HARDCODED (should get the datalabel too).
                                    tt = me.series.name + '<br>' + '<b>' + me.y.toFixed(2) + '%' + '</b><br>' + $(" td:nth-child(" + (o.idx.tooltip + 1) + ")", this).html();
                                }
                            }
                        });
                        if (tt != "") {
                            return tt;
                        } else {
                            return '<div style="z-index:1000;">' + this.series.name + '<br/>' + '<b>' + this.y.toFixed(2) + '%' + '</b><br/></div>';
                        }

                    }
                },
                plotOptions: {
                    bar: {
                        dataLabels: {
                            enabled: false //HARDCODED FOR DEMO
                        }
                    }
                },
                legend: {
                    enabled: true,
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'top',
                    x: -10,
                    y: 80,
                    floating: true,
                    borderWidth: 1,
                    backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                    shadow: true
                },
                credits: {
                    enabled: false
                },
                series: [{
                    name: 'Indianap',
                    data: [107, 31, 635, 203, 2]
                }]
            },
            chartBarConfig1: {
                chart: {
                    renderTo: o.renderTo,
                    type: 'bar'
                },
                title: {
                    text: null //$(" .rpt-table-topper .rpt-title", $(o.tableSelector)).eq(0).html()
                },
                subtitle: {
                    text: null
                },
                xAxis: {
                    categories: [],
                    title: {
                        text: null
                    }
                },
                yAxis: {
                    min: 0,
                    max: 175, //HARDCODED FOR DEMO
                    title: {
                        text: '',
                        align: 'high'
                    },
                    labels: {
                        formatter: function() {
                            if (this.value > 100) return ""; //HARDCODED FOR DEMO
                            return this.value.toFixed(0) + '%';
                        },
                        overflow: 'justify'
                    }
                },
                tooltip: {
                    useHTML: true,
                    formatter: function() {
                        var me = this;
                        var tt = "";
                        $(" tbody tr", $(o.tableSelector)).each(function() {
                            if ($(" td:nth-child(" + (o.idx.x + 1) + ")", this).html() == me.x) { //Greeting
                                if ($(" td:nth-child(" + (o.idx.seriesname + 1) + ")", this).html() == me.series.name) { //Indianapolis //HARDCODED (should get the datalabel too).
                                    tt = me.series.name + '<br>' + '<b>' + me.y.toFixed(2) + '%' + '</b><br>' + $(" td:nth-child(" + (o.idx.tooltip + 1) + ")", this).html();
                                }
                            }
                        });
                        if (tt != "") {
                            return tt;
                        } else {
                            return '<div style="z-index:1000;">' + this.series.name + '<br/>' + '<b>' + this.y.toFixed(2) + '%' + '</b><br/></div>';
                        }

                    }
                },
                plotOptions: {
                    bar: {
                        dataLabels: {
                            enabled: false //HARDCODED FOR DEMO
                        }
                    }
                },
                legend: {
                    enabled: true,
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'top',
                    x: -10,
                    y: 80,
                    floating: true,
                    borderWidth: 1,
                    backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                    shadow: true
                },
                credits: {
                    enabled: false
                },
                exporting: {
                    enabled: false
                },
                series: [{
                    name: 'Indianap',
                    data: [107, 31, 635, 203, 2]
                }]
            },
            chartDashboardBar: {
                chart: {
                    renderTo: o.renderTo,
                    type: 'column'
                },
                title: {
                    text: null //$(" .rpt-table-topper .rpt-title", $(o.tableSelector)).eq(0).html()
                },
                subtitle: {
                    text: null
                },
                xAxis: {
                    categories: [],
                    title: {
                        text: null
                    }
                },
                yAxis: {
                    title: {
                        text: '',
                        align: 'high'
                    },
                    labels: {
                        formatter: function() {
                            return this.value;
                        },
                        overflow: 'justify'
                    }
                },
                tooltip: {
                    useHTML: true,
                    formatter: function() {
                        var me = this;
                        var tt = "";
                        if (o.idx.tooltip >= 0) {
                            $(" tbody tr", $(o.tableSelector)).each(function() {
                                if ($(" td:nth-child(" + (o.idx.x + 1) + ")", this).html() == me.x) { //Greeting
                                    if ($(" td:nth-child(" + (o.idx.seriesname + 1) + ")", this).html() == me.series.name) { //Indianapolis //HARDCODED (should get the datalabel too).
                                        tt = me.series.name + '<br>' + $(" td:nth-child(" + (o.idx.tooltip + 1) + ")", this).html();
                                    }
                                }
                            });
                            if (tt != "") {
                                return tt;
                            } else {
                                return '<div style="z-index:1000;">' + this.series.name + '<br/>' + '<b>' + this.y.toFixed(2) + '%' + '</b><br/></div>';
                            }
                        }
                        else {
                            var bld = this.series.name;
                            //Get Parameters
                            var me2 = this;
                            var finalparams = getFinalParamsFromMyTable(o,me2);
                            //alert("debug: got my parameters = " + finalparams);
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
                                params: finalparams,
                                success: loaded
                            });
                            var tooltip;

                            function loaded(json) {
                                if (a$.jsonerror(json)) { } else {
                                    tooltip = json.tooltip;
                                }
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
                },
                plotOptions: {
                    series: {
                        dataLabels: {
                            enabled: true, //TESTING
                            formatter: function() {
                                if (o.idx.datalabel >= 0) {
                                    return this.point.formy;
                                }
                                else {
                                    var bld = ""; 
                                    //Get Parameters
                                    var me2 = this;
                                    var finalparams = getFinalParamsFromMyTable(o,me2);
                                    //alert("debug: got my parameters = " + finalparams);
                                    a$.ajax({
                                        type: "GET",
                                        service: "JScript",
                                        async: false,
                                        data: {
                                            lib: "editor",
                                            cmd: "gettooltip",
                                            datalabel: true   //IMPORTANT
                                        },
                                        dataType: "json",
                                        cache: false,
                                        error: a$.ajaxerror,
                                        params: finalparams,
                                        success: loaded
                                    });
                                    var tooltip;
                                    function loaded(json) {
                                        if (a$.jsonerror(json)) { } else {
                                            tooltip = json.tooltip;
                                        }
                                    }
                                    return tooltip.raw;
                                }
                            }
                        }
                    }
                },
                legend: {
                    enabled: true,
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom',
                    x: 0,
                    y: 0,
                    borderWidth: 1,
                    backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                    shadow: true
                },
                credits: {
                    enabled: false
                },
                exporting: {
                    enabled: false
                },
                series: [{
                    name: 'Indianap',
                    data: [107, 31, 635, 203, 2]
                }]
            },
            charttrend: {
                chart: {
                    renderTo: o.renderTo,
                    type: 'line'
                },
                title: {
                    text: $(" .rpt-table-topper .rpt-title", $(o.tableSelector)).eq(0).html()
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    categories: [],
                    title: {
                        text: null
                    },
                    labels: {
                        /*
                        style: {
                            fontWeight: 'bold'
                        },
                        */
                        rotation: 315,
                        align: 'right',
                    }
                },
                yAxis: {
                    min: 0,
                    //max: 175, //HARDCODED FOR DEMO
                    title: {
                        text: '',
                        align: 'high'
                    },
                    labels: {
                        formatter: function() {
                            return this.value;
                        },
                        overflow: 'justify'
                    }
                },
                tooltip: {
                    useHTML: true,
                    formatter: function() {
                        var me = this;
                        var tt = "";
                        $(" tbody tr", $(o.tableSelector)).each(function() {
                            if ($(" td:nth-child(" + (o.idx.x + 1) + ")", this).html() == me.x) { //Greeting
                                if ($(" td:nth-child(" + (o.idx.seriesname + 1) + ")", this).html() == me.series.name) { //Indianapolis //HARDCODED (should get the datalabel too).
                                    tt = me.series.name + '<br>' + $(" td:nth-child(" + (o.idx.tooltip + 1) + ")", this).html();
                                }
                            }
                        });
                        if (tt != "") {
                            return tt;
                        } else {
                            return '<div style="z-index:1000;">' + this.series.name + '<br/>' + '<b>' + this.y.toFixed(2) + '%' + '</b><br/></div>';
                        }

                    }
                },
                plotOptions: {
                    series: {
                        dataLabels: {
                            enabled: false //HARDCODED FOR DEMO */
                        }
                    }
                },
                legend: {
                    enabled: true,
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'top',
                    x: -10,
                    y: 80,
                    floating: true,
                    borderWidth: 1,
                    backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                    shadow: true
                },
                credits: {
                    enabled: false
                },
                exporting: {
                    enabled: false
                },
                series: [{
                    name: 'Indianap',
                    data: [107, 31, 635, 203, 2]
                }]
            },
            chartTrendConfig1: {
                chart: {
                    renderTo: o.renderTo,
                    type: 'line'
                },
                title: {
                    text: null //$(" .table_topper", $(o.tableSelector)).eq(0).html().replace("Download", "")
                },
                subtitle: {
                    text: null
                },
                navigation: {
                    buttonOptions: {
                        theme: {
                            // Good old text links
                            style: {
                                color: '#039',
                                textDecoration: 'underline'
                            }
                        }
                    }
                },
                xAxis: {
                    categories: [],
                    title: {
                        text: null
                    },
                    labels: {
                        /*
                        style: {
                            fontWeight: 'bold'
                        },
                        */
                        rotation: 315,
                        align: 'right',
                    }
                },
                yAxis: {
                    //min: 0,
                    //max: 175, //HARDCODED FOR DEMO
                    title: {
                        text: '',
                        align: 'high'
                    },
                    labels: {
                        formatter: function() {
                            return this.value;
                        },
                        overflow: 'justify'
                    }
                },
                tooltip: {
                    useHTML: true,
                    formatter: function() {
                        var me = this;
                        var tt = "";
                        $(" tbody tr", $(o.tableSelector)).each(function() {
                            if ($(" td:nth-child(" + (o.idx.x + 1) + ")", this).html() == me.x) { //Greeting
                                if ($(" td:nth-child(" + (o.idx.seriesname + 1) + ")", this).html() == me.series.name) { //Indianapolis //HARDCODED (should get the datalabel too).
                                    tt = me.series.name + '<br>' + $(" td:nth-child(" + (o.idx.tooltip + 1) + ")", this).html();
                                }
                            }
                        });
                        if (tt != "") {
                            return tt;
                        } else {
                            return '<div style="z-index:1000;">' + this.series.name + '<br/>' + '<b>' + this.y.toFixed(2) + '%' + '</b><br/></div>';
                        }

                    }
                },
                plotOptions: {
                    series: {
                        dataLabels: {
                            enabled: false, //HARDCODED FOR DEMO
                            formatter: function() {
                                return this.point.formy;
                            }
                        }
                    }
                },
                legend: {
                    enabled: true,
                    align: 'center',
                    verticalAlign: 'bottom',
                    x: 0,
                    y: 0,
                    borderWidth: 1,
                    backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                    shadow: true
                },
                credits: {
                    enabled: false
                },
                exporting: {
                    enabled: false
                },
                /*
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
                                //appApmDashboard.graphtotable(0);
                                this.options.plotOptions.line.dataLabels.enabled = true;
                                this.redraw();
                            }
                        }
                    }
                },
                */
                series: [{
                    name: 'Indianap',
                    data: [107, 31, 635, 203, 2]
                }]
            },
            chartDashboardTrend: {
                chart: {
                    renderTo: o.renderTo,
                    type: 'line'
                },
                title: {
                    text: $(" .rpt-table-topper .rpt-title", $(o.tableSelector)).eq(0).html()
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    categories: [],
                    title: {
                        text: null
                    },
                    labels: {
                        /*
                        style: {
                            fontWeight: 'bold'
                        },
                        */
                        rotation: 315,
                        align: 'right',
                    }
                },
                yAxis: {
                    //min: 0,
                    //max: 175, //HARDCODED FOR DEMO
                    title: {
                        text: '',
                        align: 'high'
                    },
                    labels: {
                        formatter: function() {
                            return this.value;
                        },
                        overflow: 'justify'
                    }
                },
                tooltip: {
                    useHTML: true,
                    formatter: function() {
                        var me = this;
                        var tt = "";
                        $(" tbody tr", $(o.tableSelector)).each(function() {
                            if ($(" td:nth-child(" + (o.idx.x + 1) + ")", this).html() == me.x) { //Greeting
                                if ($(" td:nth-child(" + (o.idx.seriesname + 1) + ")", this).html() == me.series.name) { //Indianapolis //HARDCODED (should get the datalabel too).
                                    tt = me.series.name + '<br>' + $(" td:nth-child(" + (o.idx.tooltip + 1) + ")", this).html();
                                }
                            }
                        });
                        if (tt != "") {
                            return tt;
                        } else {
                            return '<div style="z-index:1000;">' + this.series.name + '<br/>' + '<b>' + this.y.toFixed(2) + '%' + '</b><br/></div>';
                        }

                    }
                },
                plotOptions: {
                    series: {
                        dataLabels: {
                            enabled: true, //HARDCODED FOR DEMO
                            formatter: function() {
                                return this.point.formy;
                            }
                        }
                    }
                },
                legend: {
                    enabled: true,
                    align: 'center',
                    verticalAlign: 'bottom',
                    x: 0,
                    y: 0,
                    borderWidth: 1,
                    backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                    shadow: true
                },
                credits: {
                    enabled: false
                },
                series: [{
                    name: 'Indianap',
                    data: [107, 31, 635, 203, 2]
                }]
            },
            chartpie: {
                chart: {
                    renderTo: o.renderTo,
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: $(" .rpt-table-topper .rpt-title", $(o.tableSelector)).eq(0).html()
                },
                tooltip: {
                    formatter: function() {
                        return this.series.name + " - " + this.point.name + " " + this.point.percentage.toFixed(2) + '%';
                    }
                },
                plotOptions: {
                    pie: {
                        point: {
                            events: {
                                click: o.onClick,
                                dblclick: o.onClick
                            }
                        }
                        /*
                        dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                        }
                        */
                    }
                },
                credits: {
                    enabled: false
                },
                series: [{
                    name: 'Observation', //Hard-Coded
                    colorByPoint: true,
                    data: [
                        /*{
                                                                    name: 'Microsoft Internet Explorer',
                                                                    y: 56.33
                                                                }, {
                                                                    name: 'Chrome',
                                                                    y: 24.03,
                                                                    sliced: true,
                                                                    selected: true
                                                                }, {
                                                                    name: 'Firefox',
                                                                    y: 10.38
                                                                }, {
                                                                    name: 'Safari',
                                                                    y: 4.77
                                                                }, {
                                                                    name: 'Opera',
                                                                    y: 0.91
                                                                }, {
                                                                    name: 'Proprietary or Undetectable',
                                                                    y: 0.2
                                                                }*/
                    ]
                }]
            },
            chartPieConfig1: {
                chart: {
                    renderTo: o.renderTo,
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: null //$(" .rpt-table-topper .rpt-title", $(o.tableSelector)).eq(0).html()
                },
                tooltip: {
                    formatter: function() {
                        return this.series.name + " - " + this.point.name + " " + this.point.percentage.toFixed(2) + '%';
                    }
                },
                plotOptions: {
                    pie: {
                        point: {
                            events: {
                                click: o.onClick,
                                dblclick: o.onClick
                            }
                        }
                        /*
                        dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                        }
                        */
                    }
                },
                credits: {
                    enabled: false
                },
                exporting: {
                    enabled: false
                },
                series: [{
                    name: 'Observation', //Hard-Coded
                    colorByPoint: true,
                    data: [
                        /*{
                                                                    name: 'Microsoft Internet Explorer',
                                                                    y: 56.33
                                                                }, {
                                                                    name: 'Chrome',
                                                                    y: 24.03,
                                                                    sliced: true,
                                                                    selected: true
                                                                }, {
                                                                    name: 'Firefox',
                                                                    y: 10.38
                                                                }, {
                                                                    name: 'Safari',
                                                                    y: 4.77
                                                                }, {
                                                                    name: 'Opera',
                                                                    y: 0.91
                                                                }, {
                                                                    name: 'Proprietary or Undetectable',
                                                                    y: 0.2
                                                                }*/
                    ]
                }]
            }
        };
        return charts[o.chartVar]; //TODO: How do I deep clone this?  I fear this will be an issue (I could be wrong).
    }

    // global variables
    window.appChartDefinitions = {
        connectedChart: connectedChart
    };

})();