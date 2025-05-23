(function() {
    if (!window.jQuery) {
        alert("This App requires jQuery");
        return;
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
            chartcolumnpercentage: { //MADELIVE //MADEDEV
                chart: {
                    renderTo: o.renderTo,
                    type: 'column'
                },
                title: {
                    text: null  //$(" .rpt-table-topper .rpt-title", $(o.tableSelector)).eq(0).html()
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
                    title: {
                        text: 'Percentage'
                    }
                },
                tooltip: {
                    //pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
                    shared: true,
                    //?  useHTML: true,
                    formatter: function() {
                        var me = this;
                        var tt = "";
                        /* //There's no series.name in a shared tooltip.
                        $(" tbody tr", $(o.tableSelector)).each(function() {
                            if ($(" td:nth-child(" + (o.idx.x + 1) + ")", this).html() == me.x) { //Greeting
                                if ($(" td:nth-child(" + (o.idx.seriesname + 1) + ")", this).html() == me.series.name) { //Indianapolis //HARDCODED (should get the datalabel too).
                                    tt = me.series.name + '<br>' + '<b>' + me.y.toFixed(2) + '%' + '</b><br>' + $(" td:nth-child(" + (o.idx.tooltip + 1) + ")", this).html();
                                }
                            }
                        });
                        */
                        if (tt != "") {
                            return tt;
                        } else {
                            var bld = "";
                            for (var i in me.points) {
                                if (bld != "") {
                                    bld += "<br />";
                                }
                                bld += '<span style="color:' + me.points[i].series.color + '">' + me.points[i].series.name + '</span>: <b>' + me.points[i].y + '</b> (' + me.points[i].percentage.toFixed(0) + '%)';
                            }
                            return bld;
                        }

                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'percent',
                        dataLabels: {
                            enabled: false
                        }
                    }
                },
                /*
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
                */
                credits: {
                    enabled: false
                },
                series: []
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
            }
        };
        return charts[o.chartVar]; //TODO: How do I deep clone this?  I fear this will be an issue (I could be wrong).
    }

    // global variables
    window.appChartDefinitions = {
        connectedChart: connectedChart
    };

})();