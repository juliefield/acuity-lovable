(function ($) {
    var bellGraph_opts = {
        chart: {
            renderTo: 'bellGraph',
            type: 'area', //'columnrange',
            //backgroundColor: '#999',
            alignTicks: false,
            marginTop: 25,
            showAxes: true
        },
        title: {
            text: ''//Distribution History'
        },
        xAxis: {
            //type: 'datetime',
            categories: [],
            lineWidth: 0,
            gridLineWidth: 0,
            minorGridLineWidth: 0,
            labels: {
                enabled: true,
                step: 5
            },
            minorTickLength: 0,
            tickLength: 0,
            title: {
                text: 'Score'
            },
            plotLines: []
        },
        yAxis: [{
            title: {
                text: 'Quantity Distribution'
            },
            gridLineColor: 'Red'
        }/* FIDDLE: */// ,{ title: { text: 'Secondary' } }
        ],
        tooltip: {
            formatter: function () {
                return this.series.name + ": " + this.y + '<br />Range:' + this.point.name;
            }
        },
        plotOptions: {
            column: {
                pointPadding: 0,
                borderWidth: 0
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
            name: 'Quantity',
            yAxis: 0,
            groupPadding: 0,
            step: 5,
            data: []
        },
        {
            type: 'spline',
            color: '#666',
            lineWidth: 0.5,
            step: 5,
            data: []
        }
        /* FIDDLE: */// ,{ name: 'Series2',yAxis: 1, data: [3,4,5,4] }
        ]
    };

    $.fn.bellGraph = function (o) {
        var fn = "init";
        if (!o) { } else {
            if (o.action) fn = o.action;
            if (o.opts) $.extend(bellGraph_opts, o.opts);
        }
        switch (fn) {
            case "init":
                var bld;
                bld = '<div class="bell-wrapper">';
                bld += '  <div class="bell-graph"><div id="bellprogress" class="progressindicator bell-progress"></div><div id="bellGraph"></div><div class="bell-stats"></div>';
                bld += '</div>';
                $(this).html(bld);
        }
        switch (fn) {
            case "init":
            case "repull":
                a$.showprogress("bellprogress");
                var databld = { lib: "query", cmd: "bell.getgraphdata", kpi: o.kpi, subkpi: o.subkpi, mesh: 27.0, bkey: appLib.perfdate("Express") };
                a$.ajax({
                    type: "GET", service: "JScript", async: true, data: databld, dataType: "json", cache: false, error: a$.ajaxerror,
                    success: loaded
                });
                function loaded(json) {
                    a$.hideprogress("bellprogress");
                    if (a$.jsonerror(json)) {
                        //test
                        json = {
                            bands: [
                                { range: [-90, -80], quantity: 16 },
                                { range: [-80, -70], quantity: 6 },
                                { range: [-70, -60], quantity: 10 },
                                { range: [-60, -50], quantity: 32 },
                                { range: [-50, -40], quantity: 70 },
                                { range: [-40, -30], quantity: 172 },
                                { range: [-30, -20], quantity: 384 },
                                { range: [-20, -10], quantity: 3361 },
                                { range: [-10, 0], quantity: 13462 },
                                { range: [0, 10], quantity: 0 },
                                { range: [10, 20], quantity: 0 },
                                { range: [20, 22.5], quantity: 8 }
                            ]
                        }
                        alert("debug:kpi=" + o.kpi);
                        alert("debug:subkpi=" + o.subkpi);
                        bellGraph_opts.xAxis.categories.length = 0;
                        bellGraph_opts.series[0].data.length = 0;
                        for (var i in json.bands) {
                            bellGraph_opts.xAxis.categories.push(json.bands[i].range[0]);
                            bellGraph_opts.series[0].data.push({ y: json.bands[i].quantity, name: "" + json.bands[i].range[0] + " > X <= " + json.bands[i].range[1] });
                        }
                        /*
                        bellGraph_opts.xAxis.categories.push("100");
                        bellGraph_opts.series[0].data.push({ y: 10, name: "100" });
                        bellGraph_opts.xAxis.categories.push("200");
                        bellGraph_opts.series[0].data.push({ y: 50, name: "200" });
                        bellGraph_opts.xAxis.categories.push("300");
                        bellGraph_opts.series[0].data.push({ y: 30, name: "300" });
                        */
                        appLib.generatechart(bellGraph_opts);
                    }
                    else {
                        bellGraph_opts.xAxis.categories.length = 0;
                        bellGraph_opts.series[0].data.length = 0;
                        bellGraph_opts.series[1].data.length = 0;
                        var vol = 0.0;
                        for (var i in json.bands) {
                            //bellGraph_opts.xAxis.categories.push(""); //json.bands[i].range[0]); //TODO: Insert a few labels only
                            //Column
                            bellGraph_opts.series[0].data.push({ label: "", x: json.bands[i].range[0], y: json.bands[i].quantity, name: "" + Math.round(json.bands[i].range[0] * 100) / 100 + " > X <= " + Math.round(json.bands[i].range[1] * 100) / 100 });
                            //bellGraph_opts.series[0].data.push({ label: "", x: json.bands[i].range[1], y: json.bands[i].quantity, name: "" + Math.round(json.bands[i].range[0] * 100) / 100 + " > X <= " + Math.round(json.bands[i].range[1] * 100) / 100 });
                            //Spline
                            //bellGraph_opts.series[1].data.push({ label: "", x: json.bands[i].range[0], y: json.bands[i].quantity, name: "" + Math.round(json.bands[i].range[0] * 100) / 100 + " > X <= " + Math.round(json.bands[i].range[1] * 100) / 100 });
                            vol += json.bands[i].quantity;
                        }
                        bellGraph_opts.xAxis.plotLines.length = 0;
                        for (var i = -3; i <= 3; i++) {
                            var w = 2;
                            var lab;
                            var val;
                            if (i != 0) {
                                w = 1;
                                lab = '' + i + 's';
                                val = json.median + (json.stdev * i);
                            }
                            else {
                                lab = "m";
                                val = json.median;
                            }
                            bellGraph_opts.xAxis.plotLines.push(
                                {
                                    value: val,
                                    width: w,
                                    color: "white",
                                    zIndex: 10,
                                    dashStyle: "Dash",
                                    label: {
                                        text: lab,
                                        rotation: 0,
                                        align: "center",
                                        x: 0,
                                        y: -5,
                                        style: { fontSize: "10px", color: "white" }
                                    }
                                }
                            );
                        };

                        $(".bell-stats").html("Median:" + Math.round(json.median * 100) / 100 + "  Stdev:" + Math.round(json.stdev * 100) / 100 + "  Volume:" + Math.round(vol * 100) / 100);

                        //debug:test
                        //bellGraph_opts.yAxis.plotBands = [];
                        //bellGraph_opts.yAxis.plotBands.push({ color: 'white', from: 100 , to: 103 });

                        appLib.generatechart(bellGraph_opts);
                    }
                }
        }
        switch (fn) {
            case "replot":
                appLib.generatechart(bellGraph_opts);
        }

    };
} (jQuery));