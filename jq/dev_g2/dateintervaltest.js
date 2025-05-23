
(function () {
    if (!window.jQuery) {
        alert("This App requires jQuery");
        return;
    }
    var $ = window.jQuery;
    var firstdbf = true;

    function init() {
        $("#selProjects").html("").append('<option value="">Select Project...</option>');
        for (var p in projects) {
            $("#selProjects").append('<option value="' + projects[p].val + '">' + projects[p].name + '</option>');
        }
        $("#selProjects").change(function () {
            $("#selPayperiods").html("");
            var projectid = $(this).val();
            for (var p in project_ivs) {
                if (project_ivs[p].projectid == projectid) {
                    for (var i in project_ivs[p].intervals) {
                        for (var r in project_ivs[p].intervals[i].ranges) {
                            var bld = '<option value="' +
                                project_ivs[p].intervals[i].ranges[r].start + "," +
                                project_ivs[p].intervals[i].ranges[r].end + "," +
                                project_ivs[p].intervals[i].ivid + '">' +
                                ((r == 0) ? "Current " + project_ivs[p].intervals[i].name :
                                 ((r == 1) ? "Previous " + project_ivs[p].intervals[i].name :
                                project_ivs[p].intervals[i].name + " " + project_ivs[p].intervals[i].ranges[r].start + "-" + project_ivs[p].intervals[i].ranges[r].end)) +
                                '</option>';
                            $("#selPayperiods").append(bld);
                        }
                    }

                    //G2: Re-initialize dateIntervalPicker Intervals here.

                    //Test string
                    var ibld = "";
                    for (var i in project_ivs[p].intervals) {
                        ibld += " " + project_ivs[p].intervals[i].name;
                    }
                    $(".current-intervals").html(ibld);

                }
            }
            $("#selPayperiods").trigger("change");
        });

        $("#selPayperiods").change(function () {
            var v = $(this).val();
            var vs = v.split(",");
            if (vs.length == 3) {
                $("#spanDatefrom").html(vs[0]);
                $("#spanDateto").html(vs[1]);
            }
        });

        var id = "Payperiod";
        if (!$("#drp" + id + "s").length) {
            //$("#drp" + id + "s").remove();
            //alert("debug:my width=" + $("#sel" + id + "s").width());

            //removed: $("#sel" + id + "s").parent().css("width", $("#sel" + id + "s").width() + "px"); //Explicit width on the <dd> required.
            //removed: $("#sel" + id + "s").css("width", ($("#sel" + id + "s").width() - 20) + "px");

            //$("#sel" + id + "s_chzn").css("width", ($("#sel" + id + "s").width() - 20) + "px");
        }
        $(".app-drp").remove();
        $("#sel" + id + "s").parent().append('<span class="app-drp" style="color:blue;text-decoration:underline;" id="' + 'drp' + id + 's' + '" name="' + 'drp' + id + 's' + '">&nbsp;Pick</span>');
        var dbf = false;
        var dbleft = 0;
        var dbtop = 0;

        $(".app-drp").css("line-height", "24px");
        dbf = true;
        dbleft = 25;
        dbtop = -250;
        //}
        var drpid = "sel" + id + "s";
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
                                //change(fme, true);
                                $("#" + drpid).trigger("change");
                                anymatch = true;
                            }
                        }

                    });
                    if (!anymatch) {
                        $("#" + drpid).prepend('<option value="' + s.replace(" to ", ",") + ',0">Custom Date</option>');
                        $("#" + drpid + " option:contains('Custom Date')").attr("selected", "selected");
                        var fme = {
                            id: drpid
                        };
                        //change(fme, 2); //2 = stop propagation
                        $("#" + drpid).trigger("change");
                    }
                }
            }
        }).bind('datepicker-opened', function () {
            if (dbf) {
                if (firstdbf) {
                    //$(".date-picker-wrapper").css("left", (parseInt($(".date-picker-wrapper").css("left").split("p")[0]) + dbleft) + "px");
                    $(".date-picker-wrapper").css("left", 300 + "px");
                    //$(".date-picker-wrapper").css("top", (parseInt($(".date-picker-wrapper").css("top").split("p")[0]) + dbtop) + "px");
                    //firstdbf = false;
                }
                $(".date-picker-wrapper .month-wrapper").css("width", "425px"); //It's not wide enough, no idea why.
            }
        });

    }


    // global variables
    window.dateintervaltest = {
        init: init
    };

    var projects = [
        { name: "Project 1", val: "1" },
        { name: "Project 2", val: "2" },
        { name: "Project 3", val: "3" }
    ];

    var project_ivs = [
    {
        projectid: "1",
        intervals: [
            {
                ivid: 1,
                name: "Pay Period",
                ranges: [
                    { start: "12/1/2019", end: "12/14/2019" },
                    { start: "11/17/2019", end: "11/30/2019" },
                    { start: "11/3/2019", end: "11/16/2019" }, //Removed one here on purpose.
                    {start: "10/6/2019", end: "10/19/2019" },
                    { start: "9/22/2019", end: "10/5/2019" },
                    { start: "9/8/2019", end: "9/21/2019" },
                    { start: "8/25/2019", end: "9/7/2019" },
                    { start: "8/11/2019", end: "8/24/2019" },
                    { start: "7/28/2019", end: "8/10/2019" },
                    { start: "7/14/2019", end: "7/27/2019" },
                    { start: "6/30/2019", end: "7/13/2019" },
                    { start: "6/16/2019", end: "6/29/2019" },
                    { start: "6/2/2019", end: "6/15/2019" },
                    { start: "5/19/2019", end: "6/1/2019" },
                    { start: "5/5/2019", end: "5/18/2019" },
                    { start: "4/21/2019", end: "5/4/2019" },
                    { start: "4/7/2019", end: "4/20/2019" },
                    { start: "3/24/2019", end: "4/6/2019" },
                    { start: "3/10/2019", end: "3/23/2019" },
                    { start: "2/24/2019", end: "3/9/2019" },
                    { start: "2/10/2019", end: "2/23/2019" },
                    { start: "1/27/2019", end: "2/9/2019" },
                    { start: "1/13/2019", end: "1/26/2019" },
                    { start: "12/30/2018", end: "1/12/2019" },
                    { start: "12/16/2018", end: "12/29/2018" },
                    { start: "12/2/2018", end: "12/15/2018" },
                    { start: "11/18/2018", end: "12/1/2018" },
                    { start: "11/4/2018", end: "11/17/2018" },
                    { start: "10/21/2018", end: "11/3/2018" },
                    { start: "10/7/2018", end: "10/20/2018" },
                    { start: "9/23/2018", end: "10/6/2018" },
                    { start: "9/9/2018", end: "9/22/2018" },
                    { start: "8/26/2018", end: "9/8/2018" },
                    { start: "8/12/2018", end: "8/25/2018" },
                    { start: "7/29/2018", end: "8/11/2018" }
                ]
            },
            {
                ivid: 2,
                name: "Month",
                ranges: [
                    { start: "12/1/2019", end: "12/31/2019" },
                    { start: "11/1/2019", end: "11/30/2019" },
                    { start: "10/1/2019", end: "10/31/2019" },
                    { start: "9/1/2019", end: "9/30/2019" },
                    { start: "8/1/2019", end: "8/31/2019" },
                    { start: "7/1/2019", end: "7/31/2019" },
                    { start: "6/1/2019", end: "6/30/2019" },
                    { start: "5/1/2019", end: "5/31/2019" },
                    { start: "4/1/2019", end: "4/30/2019" },
                    { start: "3/1/2019", end: "3/31/2019" },
                    { start: "2/1/2019", end: "2/28/2019" },
                    { start: "1/1/2019", end: "1/31/2019" },
                    { start: "12/1/2018", end: "12/31/2018" },
                    { start: "11/1/2018", end: "11/30/2018" },
                    { start: "10/1/2018", end: "10/31/2018" },
                    { start: "9/1/2018", end: "9/30/2018" },
                    { start: "8/1/2018", end: "8/31/2018" },
                    { start: "7/1/2018", end: "7/31/2018" },
                    { start: "6/1/2018", end: "6/30/2018" },
                    { start: "5/1/2018", end: "5/31/2018" },
                    { start: "4/1/2018", end: "4/30/2018" },
                    { start: "3/1/2018", end: "3/31/2018" },
                    { start: "2/1/2018", end: "2/28/2018" },
                    { start: "1/1/2018", end: "1/31/2018" },
                    { start: "12/1/2017", end: "12/31/2017" },
                    { start: "11/1/2017", end: "11/30/2017" },
                    { start: "10/1/2017", end: "10/31/2017" },
                    { start: "9/1/2017", end: "9/30/2017" },
                    { start: "8/1/2017", end: "8/31/2017" },
                    { start: "7/1/2017", end: "7/31/2017" }
                ]
            },
            {
                ivid: 3,
                name: "CES Month",
                ranges: [
                    { start: "7/2/2017", end: "7/29/2017" },
                    { start: "6/4/2017", end: "7/1/2017" },
                    { start: "5/7/2017", end: "6/3/2017" },
                    { start: "3/26/2017", end: "5/6/2017" },
                    { start: "2/26/2017", end: "3/25/2017" },
                    { start: "1/29/2017", end: "2/25/2017" },
                    { start: "1/1/2017", end: "1/28/2017" },
                    { start: "12/4/2016", end: "12/31/2016" },
                    { start: "11/6/2016", end: "12/3/2016" },
                    { start: "9/25/2016", end: "11/5/2016" },
                    { start: "8/28/2016", end: "9/24/2016" },
                    { start: "7/31/2016", end: "8/27/2016" },
                    { start: "7/3/2016", end: "7/30/2016" },
                    { start: "6/5/2016", end: "7/2/2016" },
                    { start: "5/8/2016", end: "6/4/2016" },
                    { start: "3/27/2016", end: "5/7/2016" },
                    { start: "2/28/2016", end: "3/26/2016" },
                    { start: "1/31/2016", end: "2/27/2016" },
                    { start: "1/3/2016", end: "1/30/2016" },
                    { start: "12/6/2015", end: "1/2/2016" },
                    { start: "11/8/2015", end: "12/5/2015" },
                    { start: "10/11/2015", end: "11/7/2015" },
                    { start: "9/13/2015", end: "10/10/2015" },
                    { start: "8/2/2015", end: "9/12/2015" },
                    { start: "7/5/2015", end: "8/1/2015" },
                    { start: "6/7/2015", end: "7/4/2015" }
                ]
            },
            {
                ivid: 4,
                name: "Day",
                ranges: [
                    { start: "12/4/2019", end: "12/4/2019" },
                    { start: "12/3/2019", end: "12/3/2019" },
                    { start: "12/2/2019", end: "12/2/2019" },
                    { start: "12/1/2019", end: "12/1/2019" },
                    { start: "11/30/2019", end: "11/30/2019" },
                    { start: "11/29/2019", end: "11/29/2019" },
                    { start: "11/28/2019", end: "11/28/2019" },
                    { start: "11/27/2019", end: "11/27/2019" },
                    { start: "11/26/2019", end: "11/26/2019" },
                    { start: "11/25/2019", end: "11/25/2019" },
                    { start: "11/24/2019", end: "11/24/2019" },
                    { start: "11/23/2019", end: "11/23/2019" },
                    { start: "11/22/2019", end: "11/22/2019" },
                    { start: "11/21/2019", end: "11/21/2019" },
                    { start: "11/20/2019", end: "11/20/2019" },
                    { start: "11/19/2019", end: "11/19/2019" },
                    { start: "11/18/2019", end: "11/18/2019" },
                    { start: "11/17/2019", end: "11/17/2019" },
                    { start: "11/16/2019", end: "11/16/2019" },
                    { start: "11/15/2019", end: "11/15/2019" },
                    { start: "11/14/2019", end: "11/14/2019" },
                    { start: "11/13/2019", end: "11/13/2019" },
                    { start: "11/12/2019", end: "11/12/2019" },
                    { start: "11/11/2019", end: "11/11/2019" },
                    { start: "11/10/2019", end: "11/10/2019" },
                    { start: "11/9/2019", end: "11/9/2019" },
                    { start: "11/8/2019", end: "11/8/2019" }
                ]
            },
            {
                ivid: 5,
                name: "CES Quarter",
                ranges: [
                    { start: "3/26/2017", end: "7/1/2017" },
                    { start: "1/1/2017", end: "3/25/2017" },
                    { start: "9/25/2016", end: "12/31/2016" },
                    { start: "7/3/2016", end: "9/24/2016" },
                    { start: "3/27/2016", end: "7/2/2016" },
                    { start: "1/3/2016", end: "3/26/2016" },
                    { start: "10/11/2015", end: "1/2/2016" },
                    { start: "7/5/2015", end: "10/10/2015" },
                    { start: "4/12/2015", end: "7/4/2015" },
                    { start: "1/4/2015", end: "4/11/2015" },
                    { start: "9/28/2014", end: "1/3/2015" },
                    { start: "7/6/2014", end: "9/27/2014" },
                    { start: "3/30/2014", end: "7/5/2014" },
                    { start: "1/5/2014", end: "3/29/2014" },
                    { start: "9/29/2013", end: "1/4/2014" },
                    { start: "7/7/2013", end: "9/28/2013" },
                    { start: "3/31/2013", end: "7/6/2013" },
                    { start: "1/6/2013", end: "3/30/2013" }
                ]
            }
        ]
    },
    {
        projectid: "2",
        intervals: [
            {
                ivid: 2,
                name: "Month",
                ranges: [
                    { start: "12/1/2019", end: "12/31/2019" },
                    { start: "11/1/2019", end: "11/30/2019" },
                    { start: "10/1/2019", end: "10/31/2019" },
                    { start: "9/1/2019", end: "9/30/2019" },
                    { start: "8/1/2019", end: "8/31/2019" },
                    { start: "7/1/2019", end: "7/31/2019" },
                    { start: "6/1/2019", end: "6/30/2019" },
                    { start: "5/1/2019", end: "5/31/2019" },
                    { start: "4/1/2019", end: "4/30/2019" },
                    { start: "3/1/2019", end: "3/31/2019" },
                    { start: "2/1/2019", end: "2/28/2019" },
                    { start: "1/1/2019", end: "1/31/2019" },
                    { start: "12/1/2018", end: "12/31/2018" },
                    { start: "11/1/2018", end: "11/30/2018" },
                    { start: "10/1/2018", end: "10/31/2018" },
                    { start: "9/1/2018", end: "9/30/2018" },
                    { start: "8/1/2018", end: "8/31/2018" },
                    { start: "7/1/2018", end: "7/31/2018" },
                    { start: "6/1/2018", end: "6/30/2018" },
                    { start: "5/1/2018", end: "5/31/2018" },
                    { start: "4/1/2018", end: "4/30/2018" },
                    { start: "3/1/2018", end: "3/31/2018" },
                    { start: "2/1/2018", end: "2/28/2018" },
                    { start: "1/1/2018", end: "1/31/2018" },
                    { start: "12/1/2017", end: "12/31/2017" },
                    { start: "11/1/2017", end: "11/30/2017" },
                    { start: "10/1/2017", end: "10/31/2017" },
                    { start: "9/1/2017", end: "9/30/2017" },
                    { start: "8/1/2017", end: "8/31/2017" },
                    { start: "7/1/2017", end: "7/31/2017" }
                ]
            },
            {
                ivid: 4,
                name: "Day",
                ranges: [
                    { start: "12/4/2019", end: "12/4/2019" },
                    { start: "12/3/2019", end: "12/3/2019" },
                    { start: "12/2/2019", end: "12/2/2019" },
                    { start: "12/1/2019", end: "12/1/2019" },
                    { start: "11/30/2019", end: "11/30/2019" },
                    { start: "11/29/2019", end: "11/29/2019" },
                    { start: "11/28/2019", end: "11/28/2019" },
                    { start: "11/27/2019", end: "11/27/2019" },
                    { start: "11/26/2019", end: "11/26/2019" },
                    { start: "11/25/2019", end: "11/25/2019" },
                    { start: "11/24/2019", end: "11/24/2019" },
                    { start: "11/23/2019", end: "11/23/2019" },
                    { start: "11/22/2019", end: "11/22/2019" },
                    { start: "11/21/2019", end: "11/21/2019" },
                    { start: "11/20/2019", end: "11/20/2019" },
                    { start: "11/19/2019", end: "11/19/2019" },
                    { start: "11/18/2019", end: "11/18/2019" },
                    { start: "11/17/2019", end: "11/17/2019" },
                    { start: "11/16/2019", end: "11/16/2019" },
                    { start: "11/15/2019", end: "11/15/2019" },
                    { start: "11/14/2019", end: "11/14/2019" },
                    { start: "11/13/2019", end: "11/13/2019" },
                    { start: "11/12/2019", end: "11/12/2019" },
                    { start: "11/11/2019", end: "11/11/2019" },
                    { start: "11/10/2019", end: "11/10/2019" },
                    { start: "11/9/2019", end: "11/9/2019" },
                    { start: "11/8/2019", end: "11/8/2019" }
                ]
            },
            {
                ivid: 6,
                name: "Quarter",
                ranges: [
                    { start: "10/1/2019", end: "12/31/2019" },
                    { start: "7/1/2019", end: "9/30/2019" },
                    { start: "4/1/2019", end: "6/30/2019" },
                    { start: "1/1/2019", end: "3/31/2019" }
                ]
            }
        ]
    },
    {
        projectid: "3",
        intervals: [
            {
                ivid: 1,
                name: "Pay Period",
                ranges: [
                    { start: "12/1/2019", end: "12/14/2019" },
                    { start: "11/17/2019", end: "11/30/2019" },
                    { start: "11/3/2019", end: "11/16/2019" }, //Removed one here on purpose.
                    {start: "10/6/2019", end: "10/19/2019" },
                    { start: "9/22/2019", end: "10/5/2019" },
                    { start: "9/8/2019", end: "9/21/2019" },
                    { start: "8/25/2019", end: "9/7/2019" },
                    { start: "8/11/2019", end: "8/24/2019" },
                    { start: "7/28/2019", end: "8/10/2019" },
                    { start: "7/14/2019", end: "7/27/2019" },
                    { start: "6/30/2019", end: "7/13/2019" },
                    { start: "6/16/2019", end: "6/29/2019" },
                    { start: "6/2/2019", end: "6/15/2019" },
                    { start: "5/19/2019", end: "6/1/2019" },
                    { start: "5/5/2019", end: "5/18/2019" },
                    { start: "4/21/2019", end: "5/4/2019" },
                    { start: "4/7/2019", end: "4/20/2019" },
                    { start: "3/24/2019", end: "4/6/2019" },
                    { start: "3/10/2019", end: "3/23/2019" },
                    { start: "2/24/2019", end: "3/9/2019" },
                    { start: "2/10/2019", end: "2/23/2019" },
                    { start: "1/27/2019", end: "2/9/2019" },
                    { start: "1/13/2019", end: "1/26/2019" },
                    { start: "12/30/2018", end: "1/12/2019" },
                    { start: "12/16/2018", end: "12/29/2018" },
                    { start: "12/2/2018", end: "12/15/2018" },
                    { start: "11/18/2018", end: "12/1/2018" },
                    { start: "11/4/2018", end: "11/17/2018" },
                    { start: "10/21/2018", end: "11/3/2018" },
                    { start: "10/7/2018", end: "10/20/2018" },
                    { start: "9/23/2018", end: "10/6/2018" },
                    { start: "9/9/2018", end: "9/22/2018" },
                    { start: "8/26/2018", end: "9/8/2018" },
                    { start: "8/12/2018", end: "8/25/2018" },
                    { start: "7/29/2018", end: "8/11/2018" }
                ]
            },
            {
                ivid: 3,
                name: "CES Month",
                ranges: [
                    { start: "7/2/2017", end: "7/29/2017" },
                    { start: "6/4/2017", end: "7/1/2017" },
                    { start: "5/7/2017", end: "6/3/2017" },
                    { start: "3/26/2017", end: "5/6/2017" },
                    { start: "2/26/2017", end: "3/25/2017" },
                    { start: "1/29/2017", end: "2/25/2017" },
                    { start: "1/1/2017", end: "1/28/2017" },
                    { start: "12/4/2016", end: "12/31/2016" },
                    { start: "11/6/2016", end: "12/3/2016" },
                    { start: "9/25/2016", end: "11/5/2016" },
                    { start: "8/28/2016", end: "9/24/2016" },
                    { start: "7/31/2016", end: "8/27/2016" },
                    { start: "7/3/2016", end: "7/30/2016" },
                    { start: "6/5/2016", end: "7/2/2016" },
                    { start: "5/8/2016", end: "6/4/2016" },
                    { start: "3/27/2016", end: "5/7/2016" },
                    { start: "2/28/2016", end: "3/26/2016" },
                    { start: "1/31/2016", end: "2/27/2016" },
                    { start: "1/3/2016", end: "1/30/2016" },
                    { start: "12/6/2015", end: "1/2/2016" },
                    { start: "11/8/2015", end: "12/5/2015" },
                    { start: "10/11/2015", end: "11/7/2015" },
                    { start: "9/13/2015", end: "10/10/2015" },
                    { start: "8/2/2015", end: "9/12/2015" },
                    { start: "7/5/2015", end: "8/1/2015" },
                    { start: "6/7/2015", end: "7/4/2015" }
                ]
            },
            {
                ivid: 4,
                name: "Day",
                ranges: [
                    { start: "12/4/2019", end: "12/4/2019" },
                    { start: "12/3/2019", end: "12/3/2019" },
                    { start: "12/2/2019", end: "12/2/2019" },
                    { start: "12/1/2019", end: "12/1/2019" },
                    { start: "11/30/2019", end: "11/30/2019" },
                    { start: "11/29/2019", end: "11/29/2019" },
                    { start: "11/28/2019", end: "11/28/2019" },
                    { start: "11/27/2019", end: "11/27/2019" },
                    { start: "11/26/2019", end: "11/26/2019" },
                    { start: "11/25/2019", end: "11/25/2019" },
                    { start: "11/24/2019", end: "11/24/2019" },
                    { start: "11/23/2019", end: "11/23/2019" },
                    { start: "11/22/2019", end: "11/22/2019" },
                    { start: "11/21/2019", end: "11/21/2019" },
                    { start: "11/20/2019", end: "11/20/2019" },
                    { start: "11/19/2019", end: "11/19/2019" },
                    { start: "11/18/2019", end: "11/18/2019" },
                    { start: "11/17/2019", end: "11/17/2019" },
                    { start: "11/16/2019", end: "11/16/2019" },
                    { start: "11/15/2019", end: "11/15/2019" },
                    { start: "11/14/2019", end: "11/14/2019" },
                    { start: "11/13/2019", end: "11/13/2019" },
                    { start: "11/12/2019", end: "11/12/2019" },
                    { start: "11/11/2019", end: "11/11/2019" },
                    { start: "11/10/2019", end: "11/10/2019" },
                    { start: "11/9/2019", end: "11/9/2019" },
                    { start: "11/8/2019", end: "11/8/2019" }
                ]
            },
            {
                ivid: 5,
                name: "CES Quarter",
                ranges: [
                    { start: "3/26/2017", end: "7/1/2017" },
                    { start: "1/1/2017", end: "3/25/2017" },
                    { start: "9/25/2016", end: "12/31/2016" },
                    { start: "7/3/2016", end: "9/24/2016" },
                    { start: "3/27/2016", end: "7/2/2016" },
                    { start: "1/3/2016", end: "3/26/2016" },
                    { start: "10/11/2015", end: "1/2/2016" },
                    { start: "7/5/2015", end: "10/10/2015" },
                    { start: "4/12/2015", end: "7/4/2015" },
                    { start: "1/4/2015", end: "4/11/2015" },
                    { start: "9/28/2014", end: "1/3/2015" },
                    { start: "7/6/2014", end: "9/27/2014" },
                    { start: "3/30/2014", end: "7/5/2014" },
                    { start: "1/5/2014", end: "3/29/2014" },
                    { start: "9/29/2013", end: "1/4/2014" },
                    { start: "7/7/2013", end: "9/28/2013" },
                    { start: "3/31/2013", end: "7/6/2013" },
                    { start: "1/6/2013", end: "3/30/2013" }
                ]
            }
        ]
    }

    ];

})();
