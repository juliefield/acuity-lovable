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

    var directives = [];
    function getdirective(filename) {
        /* Remove now for easier development:
        if (a$.exists(directives[filename])) {
            return directives[filename];
        }
        */
        $.ajax({
            url: "../applib/html/directives/" + filename,
            async: false,
            success: gotdirective
        });
        function gotdirective(data) {
            directives[filename] = data;
        }
        //alert("debug: filename = " + filename);
        //alert("debug: got directive = " + directives[filename]);
        return directives[filename];
    }

    function getFinalParamsFromMyTable(o,me2) {
        var foundit = false;
        var finalparams = "";
        var drillkey = ""; //MADELIVENOW
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

                        //MADELIVENOW
                        if ($(" thead .tbl-drillkey", $(me3).parent().parent().parent()).length) {
                            var drillkeycolidx = $(" thead .tbl-key", $(me3).parent().parent().parent()).index();
                            drillkey = $(" td", $(me3).parent()).eq(drillkeycolidx).html().replace(/&amp;/gi, "&"); ;
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
                        finalparams = overrideparams(finalparams, drillkey); //MADELIVENOW
                        finalparams = "drillcolumn=" + selcolname + finalparams;
                    }
                }
            }
        });
        return finalparams;
    }

    function seriestitle(o) {
      var title = "Not Found..";
      try {
        if (o.idx.seriesname >= 0) {
            $(" tbody tr", $(o.tableSelector)).each(function() {
            title = $(" td:nth-child(" + (o.idx.seriesname + 1) + ")", this).html();
            });
        }
        else {
            title = "No Series Name";
          }
      }
      catch(err) {
        console.error(err);
      }
      return title;                        
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
            chartSidekickTouchQualityBubbles: {
                custom: true,
                type: "chartSidekickTouchQualityBubbles", //Pass the name as "type" to keep with Highcharts idiom.
                o: o //Just pass on the entire object.
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
            chartBarConfig2: {
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
                    max: 10, //HARDCODED FOR DEMO
                    title: {
                        text: '',
                        align: 'high'
                    },
                    labels: {
                        formatter: function() {
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
                            return '<div style="z-index:1000;">' + this.series.name + '<br/>' + '<b>' + this.y.toFixed(2) + '</b><br/></div>';
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
            chartBarConfig3: {
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
                    //max: 10, //HARDCODED FOR DEMO
                    title: {
                        text: '.',
                        align: 'right'
                    },
                    labels: {
                        formatter: function() {
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
                                    tt = me.series.name + '<br>' + '<b>' + me.y.toFixed(2) + '</b><br>' + $(" td:nth-child(" + (o.idx.tooltip + 1) + ")", this).html();
                                }
                            }
                        });
                        if (tt != "") {
                            return tt;
                        } else {
                            return '<div style="z-index:1000;">' + this.series.name + '<br/>' + '<b>' + this.y.toFixed(2) + '</b><br/></div>';
                        }

                    }
                },
                plotOptions: {
                    bar: {
                        dataLabels: {
                            enabled: false //HARDCODED FOR DEMO
                        },
	                    	grouping: false,
  	                  	shadow: false
                    },
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
                    data: [107, 31, 635, 203, 2],
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
                  }]
            },
            chartBarConfig4: {
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
                    padding: 15,
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
                            return '<div style="width:200px;white-space:normal !important;"><p>' + tt + '</p></div>';
                        } else {
                            return '<div style="z-index:1000;max-width: 400px;">' + this.series.name + '<br/>' + '<b>' + this.y.toFixed(2) + '%' + '</b><br/><br></div>';
                        }
                    },
                    positioner: function(labelWidth, labelHeight, point) {
                        var tooltipX = point.plotX - 200;
                        var tooltipY = point.plotY - 30;
                        return {
                            x: tooltipX,
                            y: tooltipY
                        };
                    }
                },
                plotOptions: {
                    series: {
                      pointWidth: 15
                    },
                    bar: {
                        dataLabels: {
                            enabled: false //HARDCODED FOR DEMO
                        }
                    }
                },
                legend: {
                    enabled: false
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
                                type: "POST", //Post required because the directive may be long.
                                service: "JScript",
                                async: false,
                                data: {
                                    lib: "editor",
                                    cmd: "gettooltip",
                                    seriesname: this.series.name, //Need this if doing a directive (must end up inside)
                                    directive: getdirective("tooltip-chartDashboardBar.htm")
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
                            //old way:
                            //return '<div style="background-color:white; border-radius: 10px; opacity: 1.0; padding: 20px; margin: -20px;">' + bld + '</div>';

                            //alert("debug: tooltip as returned: " + bld);
                            return bld;
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
              color: {
                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                stops: [
                    [0, '#003399'],
                    [1, '#3366AA']
                ]
              },
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
                    verticalAlign: 'top',
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
            chartTrendConfig2: {
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
                    layout: 'vertical',
                    align: 'center',
                    verticalAlign: 'top',
                    x: -10,
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
            chartTrendConfig3: {
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
                    layout: 'vertical',
                    align: 'center',
                    verticalAlign: 'bottom',
                    x: -10,
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
            chartcolumnpercentage: { //MAKELIVE //MADEDEV
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
                        return this.series.name + " - " + this.point.name + " " + this.point.y + " (" + this.point.percentage.toFixed(2) + '%)';
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
            chartPieConfig2: {
                chart: {
                    renderTo: o.renderTo,
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: seriestitle(o)
                },
                tooltip: {
                    useHTML: true,
                    formatter: function() {
                        return '<div style="width:200px;white-space:normal !important;"><p>' + this.series.name + "<br /><b>" + this.point.name + "</b><br />Count:" + this.point.y + "<br />" + this.point.percentage.toFixed(2) + '%</p></div>';
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
            userDashboardScoringChart: {
                custom: true,
                type: "userDashboardScoringChart", //Pass the name as "type" to keep with Highcharts idiom.
                o: o //Just pass on the entire object.
            },
            simplePieChart: {
                chart: {
                    renderTo: o.renderTo,
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    //text: $(" .rpt-table-topper .rpt-title", $(o.tableSelector)).eq(0).html()
                    text:null
                },
                tooltip: {
                    pointFormat: '<b>{point.percentage:.2f}%</b><br><b>{point.y}</b>'
                },
                plotOptions: {
                    pie: {
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.2f} %',
                            style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        }
                    }
                },
                series:[{
                    colorByPoint: true,
                    data: []
                }]
            },           
            simpleLineChart: {
                chart:{
                    renderTo: o.renderTo,
                    type: 'line',
                    zoomType: "xy",
                },
                title: {
                    //text: $(" .rpt-table-topper .rpt-title", $(o.tableSelector)).eq(0).html()
                    text:null
                },
                xAxis:{
                    categories:[]
                },
                yAxis: {
                    title:{
                        text: ''
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    floating: true,
                    enabled:true    
                },
                plotOptions: {
                    line: {
                        dataLabels:{
                            enabled: true
                        }
                    },
                    series: {
                        label:{
                            enabled: false,
                            connectorAllowed:false
                        },
                        connectNulls: true
                    }
                },
                series:[{
                    name: 'name',
                    colorByPoint: true,                    
                    data:[]
                }]
            },
            bottomXTrendChart: {
                chart:{
                    renderTo: o.renderTo,
                    type: 'line',
                    zoomType: "xy",
                },
                colors:[
                    "#660000",
                    "#990000",
                    "#AA0000",
                    "#CC0000",
                    "#FF0000"
                ],
                title: {
                    text: $(" .rpt-table-topper .rpt-title", $(o.tableSelector)).eq(0).html()
                },
                xAxis:{
                    categories:[]
                },
                yAxis: {
                    title:{
                        text: ''
                    }
                },
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom',
                    floating: false
                },
                plotOptions: {
                    line: {
                        dataLabels:{
                            enabled: true
                        }
                    },
                    series: {
                        label:{
                            enabled: false,
                            connectorAllowed:false
                        },
                        connectNulls: true
                    }
                },
                series:[{
                    name: 'name',
                    colorByPoint: true,
                    data:[]
                }]
            },
            topXTrendChart: {
                chart:{
                    renderTo: o.renderTo,
                    type: 'line',
                    zoomType: "xy",
                },
                colors:[
                    "#00FF00",
                    "#00CC00",
                    "#00AA00",
                    "#009900",
                    "#006600",
                ],
                title: {
                    text: $(" .rpt-table-topper .rpt-title", $(o.tableSelector)).eq(0).html()
                },
                xAxis:{
                    categories:[]
                },
                yAxis: {
                    title:{
                        text: ''
                    }
                },
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom',
                    floating: false
                },
                plotOptions: {
                    line: {
                        dataLabels:{
                            enabled: true
                        }
                    },
                    series: {
                        label:{
                            enabled: false,
                            connectorAllowed:false
                        },
                        connectNulls: true
                    }
                },
                series:[{
                    name: 'name',
                    colorByPoint: true,
                    data:[]
                }]
            },
            topAndBottomCombineTrendChart: {
                chart:{
                    renderTo: o.renderTo,                    
                    type: 'line',
                    zoomType: "xy",
                },
                title: {
                    //text: $(" .rpt-table-topper .rpt-title", $(o.tableSelector)).eq(0).html()
                    text:null
                },
                tooltip:{
                    useHTML: true,
                    formatter: function(){
                        let me = this;
                        let tip = "<div style=\"z-index:1000\" class=\"tool-tip-holder\">" + this.series.name + "<br /><b>" + this.y + "</b></div>";
                        if(o.idx.tooltip >= 0)                        
                        {
                            $(" tbody tr", $(o.tableSelector)).each(function() {
                                if ($(" td:nth-child(" + (o.idx.x + 1) + ")", this).html() == me.x) { //Greeting
                                    if ($(" td:nth-child(" + (o.idx.seriesname + 1) + ")", this).html() == me.series.name) { //Indianapolis //HARDCODED (should get the datalabel too).
                                        let tipText = $("td:nth-child(" + (o.idx.tooltip + 1) + ")", this).html();            
                                        tip = "<div style=\"z-index:1000\" class=\"tool-tip-holder\">" + tipText + "</div>";
                                    }
                                }
                            });
                        }
                        return tip;
                    }
                },
                xAxis:{
                    categories:[]
                },
                yAxis: {
                    title:{
                        text: ''
                    }
                },
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom',
                    floating: false
                },
                plotOptions: {
                    line: {
                        dataLabels:{
                            enabled: true
                        },
                    },
                    series: {
                        label:{
                            enabled: false,
                            connectorAllowed:false
                        },
                        connectNulls: true
                    }
                },
                series:[{
                    name: 'name',
                    colorByPoint: true,
                    data:[]
                }]
            },
            simpleBar: {
                chart:{
                    renderTo:o.renderTo,
                    type:'bar'
                },
                title:{
                    text: $(" .rpt-table-topper .rpt-title", $(o.tableSelector)).eq(0).html()
                },
                tooltip: {
                    pointFormat: '<b>{point.y}</b>'
                },
                xAxis: {
                    categories:[]
                },
                yAxis:{
                    title:''
                },
                series:[{
                    colorByPoint:true,
                    data:[]
                }]
            },
            simpleColumn: {
                chart:{
                    renderTo:o.renderTo,
                    type:'column'
                },
                title:{
                    text: null
                },
                tooltip:{
                    useHTML: true,
                    formatter: function(){
                        let me = this;
                        let tip = "<div style=\"z-index:1000\" class=\"tool-tip-holder\">" + this.series.name + "<br /><b>" + this.y + "</b></div>";
                        if(o.idx.tooltip >= 0)                        
                        {
                            $(" tbody tr", $(o.tableSelector)).each(function() {
                                if ($(" td:nth-child(" + (o.idx.x + 1) + ")", this).html() == me.x) { //Greeting
                                    if ($(" td:nth-child(" + (o.idx.seriesname + 1) + ")", this).html() == me.series.name) { //Indianapolis //HARDCODED (should get the datalabel too).
                                        let tipText = $("td:nth-child(" + (o.idx.tooltip + 1) + ")", this).html();            
                                        tip = "<div style=\"z-index:1000\" class=\"tool-tip-holder\">" + tipText + "</div>";
                                    }
                                }
                            });
                        }
                        return tip;
                    }
                },
                xAxis: {
                    categories:[]
                },
                yAxis:{
                    title:''
                },
                series:[{
                    colorByPoint:true,
                    data:[]
                }]
            },
            trendLinesMonthDates: {
                chart:{
                    renderTo: o.renderTo,
                    type: 'line',
                    zoomType: "xy",
                },
                title: { 
                    //text: $(" .rpt-table-topper .rpt-title", $(o.tableSelector)).eq(0).html()
                    text: null
                },
                tooltip:{
                    useHTML: true,
                    formatter: function(){
                        let me = this;
                        let tip = "<div style=\"z-index:1000\" class=\"tool-tip-holder\">" + this.series.name + "<br /><b>" + this.y + "</b></div>";
                        if(o.idx.tooltip >= 0)                        
                        {
                            $(" tbody tr", $(o.tableSelector)).each(function() {
                                if ($(" td:nth-child(" + (o.idx.x + 1) + ")", this).html() == me.x) { //Greeting
                                    if ($(" td:nth-child(" + (o.idx.seriesname + 1) + ")", this).html() == me.series.name) { //Indianapolis //HARDCODED (should get the datalabel too).
                                        let tipText = $("td:nth-child(" + (o.idx.tooltip + 1) + ")", this).html();            
                                        tip = "<div style=\"z-index:1000\" class=\"tool-tip-holder\">" + tipText + "</div>";
                                    }
                                }
                            });
                        }
                        return tip;
                    }
                },
                xAxis:{
                    categories:[],
                    labels:{
                        rotation: 315
                    }
                },
                yAxis: {
                    title:{
                        text: ''
                    },
                },
                legend: {
                    layout: "horizontal",
                    align: "center",
                    verticalAlign: "bottom",
                    enabled:true
                },
                plotOptions: {
                    line: {
                        dataLabels:{
                            enabled: true
                        }
                    },
                    series: {
                        label:{
                            enabled: false,
                            connectorAllowed:false
                        },
                        connectNulls: true
                    }
                },
                series:[{
                    name: 'name',
                    colorByPoint: true,
                    data:[]
                }]
            },
            trendLinesMonthDatesDateRotation: {
                chart:{
                    renderTo: o.renderTo,
                    type: 'line',
                    zoomType: "xy",
                },
                title: { 
                    //text: $(" .rpt-table-topper .rpt-title", $(o.tableSelector)).eq(0).html()
                    text: null
                },
                tooltip:{
                    useHTML: true,
                    formatter: function(){
                        let me = this;
                        let tip = "<div style=\"z-index:1000\" class=\"tool-tip-holder\">" + this.series.name + "<br /><b>" + this.y + "</b></div>";
                        if(o.idx.tooltip >= 0)                        
                        {
                            $(" tbody tr", $(o.tableSelector)).each(function() {
                                if ($(" td:nth-child(" + (o.idx.x + 1) + ")", this).html() == me.x) { //Greeting
                                    if ($(" td:nth-child(" + (o.idx.seriesname + 1) + ")", this).html() == me.series.name) { //Indianapolis //HARDCODED (should get the datalabel too).
                                        let tipText = $("td:nth-child(" + (o.idx.tooltip + 1) + ")", this).html();            
                                        tip = "<div style=\"z-index:1000\" class=\"tool-tip-holder\">" + tipText + "</div>";
                                    }
                                }
                            });
                        }
                        return tip;
                    }
                },
                xAxis:{
                    categories:[],
                    title: {
                        text: null
                    },                    
                    labels: {
                        autoRotation: -45
                    }
                },
                yAxis: {
                    title:{
                        text: ''
                    },
                    // labels: {
                    //     rotation: 45
                    // }
                },
                legend: {
                    layout: "horizontal",
                    align: "center",
                    verticalAlign: "bottom",
                    enabled:true,
                },
                plotOptions: {
                    line: {
                        dataLabels:{
                            enabled: true
                        }
                    },
                    series: {
                        label:{
                            enabled: true,
                            connectorAllowed:false
                        },
                        connectNulls: true
                    }
                },
                series:[{
                    name: 'name',
                    colorByPoint: true,
                    data:[]
                }]
            },
            genericBubbles: {
                custom:true,
                type: "genericBubbles",
                o: o
            },
            coachingEffectivenessBubbles: {
                custom:true,
                type: "coachingEffectivenessBubbles",
                o: o
            },
            execDashboardCurrent_General: {
                custom: true,
                type: "execDashboardCurrentGeneral",
                o: o 
            },
            rankGauge: {
                custom:true,
                type: "rankGauge",
                o: o
            },
            SANDBOX: { //Will be replaced.
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
                                type: "POST", //Post required because the directive may be long.
                                service: "JScript",
                                async: false,
                                data: {
                                    lib: "editor",
                                    cmd: "gettooltip",
                                    seriesname: this.series.name, //Need this if doing a directive (must end up inside)
                                    directive: getdirective("tooltip-chartDashboardBar.htm")
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
                            //old way:
                            //return '<div style="background-color:white; border-radius: 10px; opacity: 1.0; padding: 20px; margin: -20px;">' + bld + '</div>';

                            //alert("debug: tooltip as returned: " + bld);
                            return bld;
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
            }
        };
        if (!a$.exists(o.chartVar)) {
            return charts; //This is a case of referencing it.
        }
        else {
        		//old way:
            if (o.chartVar == "SANDBOX") {
                if (a$.exists(window.userFunctions)) {
                    if (a$.exists(window.userFunctions.getHighchartsDefinition)) {
                        return window.userFunctions.getHighchartsDefinition(o);
                    }
                }
            }
            return charts[o.chartVar]; //TODO: How do I deep clone this?  I fear this will be an issue (I could be wrong).
            //Depp clone experiment:
            //return JSON.parse(JSON.stringify(charts[o.chartVar]));
        }
    }

    // global variables
    window.appChartDefinitions = {
        connectedChart: connectedChart,
        getdirective: getdirective,
        getFinalParamsFromMyTable: getFinalParamsFromMyTable
    };

})();
