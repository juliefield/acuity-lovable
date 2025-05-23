$(document).ready(function () {
    var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
    $(".mon-acknowledge").bind("click", function () {
        var data = {
            lib: "qa",
            cmd: "acknowledgeComplianceMonitor",
            monitorid: $("#lblMonitorId").html() //Note the lower case on id
        };
        a$.ajax({
            type: "POST",
            service: "JScript",
            async: true,
            data: data,
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: monitoracknowledged
        });
        function monitoracknowledged(json) {
            if (a$.jsonerror(json)) {
                alert("ERROR:" + json.msg);
            }
            else {
                alert("Monitor Acknowledged, Thank You.");
                //return_to_v1();
            }
        }
        return false;
    });
    $(".mon-submit").bind("click", function () {
        //TODO: Gather all of your variables to be passed to saveQaForm
        var mykpi = 1;
        var answers = [];
        $(".qst").each(function () {
            myval = $(this).val()
            if ($(this).is("input")) {
                if ($(this).attr("type") == "checkbox") {
                    if ($(this).is(":checked")) {
                        myval = "Yes";
                        if ($(this).attr("qst") == "Client-Scored") {
                            //mykpi = 84; //If special KPI for Client-Scored.
                        }
                    }
                    else {
                        myval = "No";
                    }
                }
            }
            answers.push({ friendlyname: $(this).attr("qst"), answertext: myval, score: 0, value: '', version: 0 });
        });
        var data = {
            lib: "qa",
            cmd: "saveQaForm",
            formId: 11,
            sqfCode: 4,
            kpi: mykpi,
            kpiSet: [1],
            database: "C",
            examinee: $("#lblAgent").html(),
            score: $(".mon-sys-score").html().replace("%", ""),
            value: ($(".mon-sys-autofail").eq(0).css("display") != "none") ? "Auto Fail" : "",
            answers: answers,
            callId: $("#lblCallid").html(),
            callDate: $("#lblCalldate").html(),
            callTime: "",
            clientDept: "",
            acknowledgement: true //Test this soon
        };
        if ($("#lblMode").html() != "new") {
            data.monitorId = $("#lblMonitorId").html();
        }

        a$.ajax({
            type: "POST",
            service: "JScript",
            async: true,
            data: data,
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: monitorsaved
        });
        function monitorsaved(json) {
            if (a$.jsonerror(json)) {
                alert("ERROR:" + json.msg);
            }
            else {
                return_to_v1();
            }
        }
        return false;
    });

    $(".mon-close").bind("click", function () {
        return_to_v1();
        return false;
    });

    $(".mon-delete").bind("click", function () {
        if (confirm("Are you sure you want to delete this monitor?")) {
            var data = {
                lib: "qa",
                cmd: "deleteQaForm",
                formId: 11,
                monitorId: $("#lblMonitorId").html(),
                database: "C"
            };
            a$.ajax({
                type: "POST",
                service: "JScript",
                async: true,
                data: data,
                dataType: "json",
                cache: false,
                error: a$.ajaxerror,
                success: monitordeleted
            });
            function monitordeleted(json) {
                if (a$.jsonerror(json)) {
                    alert("ERROR:" + json.msg);
                }
                else {
                    return_to_v1();
                }
            }
        }
        return false;
    });

    function return_to_v1() {
        if ($("#lblMode").html() == "new") {
            window.location = "//act.acuityapm.com/monitor/monitor.aspx";
        }
        else {
            window.location = "//act.acuityapm.com/monitor/monitor_review.aspx";
        }
    }

    $(".mon-table select").bind("change", function () {
        var newval = $(this).val();
        var newcolor = "";
        $("option", this).each(function () {
            if ($(this).val() == newval) {
                //alert("color = " + $(this).css("background-color"));
                newcolor = $(this).css("background-color");
            }
        });
        if (!isIE11) {
            $(this).css("background-color", "");
            if (newcolor != "") {
                $(this).css("background-color", newcolor);
            }
        }
        if (allsetup) {
            function cascadeup(sec, qs) {
                //Force upward cascade of subsections.
                var any_no = false;
                var any_yes = false;
                $(".qst").each(function () {
                    var qst = $(this).attr("qst");
                    var qval = $(this).val();
                    var inset = false;
                    for (var i in qs) {
                        if (qst == qs[i]) {
                            inset = true;
                            //alert("debug: inset qst = " + qst + ", qval = " + qval);
                        }
                    }
                    if (inset) {
                        if (!any_no) if (qval == "No") any_no = true;
                        if (!any_yes) if (qval == "Yes") any_yes = true;
                    }
                });
                if (any_no) {
                    $(".qst-sec-" + sec).val("No");
                    if (!isIE11) {
                        $(".qst-sec-" + sec).css("background-color", "Red");
                    }
                }
                else if (any_yes) {
                    $(".qst-sec-" + sec).val("Yes");
                    if (!isIE11) {
                        $(".qst-sec-" + sec).css("background-color", "LightGreen");
                    }
                }
            }
            cascadeup("1", ["1.1", "1.2", "1.3", "1.4"]);
            cascadeup("3", ["3.1", "3.2", "3.3", "3.4"]);
            cascadeup("7", ["7.1", "7.2"]);
        }
        setscore();
    });

    var allsetup = false;

    //Prosper Selects
    function prosperselectsetup() {
        if ($("#lblMode").html() == "new") {
            $(".mon-table select").each(function () {
                $(this).val("N/A");
                $(this).trigger("change");
            });
            allsetup = true;
        }
        else {
            //TODO: Read in the answers from getqaform.
            var data = {
                lib: "qa",
                cmd: "getQaForm",
                formId: 11,
                monitorId: $("#lblMonitorId").html(),
                database: "C"
            };
            a$.ajax({
                type: "POST",
                service: "JScript",
                async: true,
                data: data,
                dataType: "json",
                cache: false,
                error: a$.ajaxerror,
                success: monitorloaded
            });
            function monitorloaded(json) {
                //alert("debug:monloaded");
                if (a$.jsonerror(json)) {
                    alert("ERROR:" + json.msg);
                }
                else {
                    $(".qst").each(function () {
                        var qst = $(this).attr("qst");
                        for (var i in json.form.answers) {
                            if (json.form.answers[i].friendlyname == qst) {
                                if (qst == "Client-Scored") {
                                    if (json.form.answers[i].answertext == "Yes") {
                                        $(this).prop("checked", true);
                                    }
                                }
                                else {
                                    $(this).val(json.form.answers[i].answertext);
                                }
                                break;
                            }
                        }
                    });
                    $(".mon-table select").each(function () {
                        $(this).trigger("change");
                    });
                    allsetup = true;
                }
            }

        }
        $(".mon-table tbody").css("height", (window.innerHeight - 120) + "px");
        window.addEventListener("resize", function () {
            $(".mon-table tbody").css("height", (window.innerHeight - 120) + "px");
        });
    }
    prosperselectsetup();

    $(".mon-table .qst-spectrum-number").bind("change", function () {
        setscore();
    });
    $(".mon-table .qst-comments").bind("change", function () {
        //Eliminate carriage returns right here.
        $(this).val($(this).val().replace(/(?:\r\n|\r|\n)/g, " "));
    });


    function setscore() { //TODO: Make the score work.

        //Questions where a "No" value make it 60%
        var qs = ["1", "2.1", "3", "4.1", "5.1", "6.1"];
        var score = 0;
        var autofail = false;
        var scoreerror = false;

        //TODO: NEW SCORING GOES HERE!

        var cats = [
                { name: "Compliance", abr: "Compliance", score: 35, nos: 0, lims: [{ nos: 0, score: 35 }, { nos: 1, score: 15 }, { nos: 999, score: 0}] },
                { name: "Policy", abr: "Policy", score: 25, nos: 0, lims: [{ nos: 0, score: 25 }, { nos: 3, score: 10 }, { nos: 999, score: 0}] },
                { name: "Negotiation", abr: "Negotiation", score: 20, nos: 0, lims: [{ nos: 0, score: 20 }, { nos: 2, score: 10 }, { nos: 999, score: 0}] },
                { name: "Customer Experience", abr: "CustEx", score: 20, nos: 0, lims: [{ nos: 0, score: 20 }, { nos: 2, score: 5 }, { nos: 999, score: 0}] }
              ];

        $(".qst").each(function () {
            if ($(this).val() == "No") {
                var qst = $(this).attr("qst");
                if (qst.indexOf("-") > 0) {
                    var cat = $("td", $(this).parent().parent()).eq(0).html();
                    for (var c in cats) {
                        if (cat == cats[c].name) {
                            cats[c].nos += 1;
                        }
                    }
                }
            }
        });
        for (var c in cats) {
            for (var l in cats[c].lims) {
                if (cats[c].nos <= cats[c].lims[l].nos) {
                    cats[c].score = cats[c].lims[l].score;
                    break;
                }
            }
            $(".qst-" + cats[c].abr + "-Score").val(cats[c].score);
            score += cats[c].score;
        }

        /*
        var is60percent = false;
        $(".qst").each(function () {
        var qst = $(this).attr("qst");
        if ($(this).val() == "No") {
        for (var i in qs) {
        if (qst == qs[i]) {
        is60percent = true;
        }
        }
        }
        });
        var scoreerror = false;
        if (is60percent) {
        score = 60.0;
        autofail = true;
        }
        else {
        var ef = $(".qst-effectiveness").eq(0).val();
        switch (ef) {
        case "Best in class":
        score = 100.0;
        break;
        case "Highly effective":
        score = 95.0;
        break;
        case "Effective":
        score = 87.0;
        break;
        case "Ineffective":
        score = 80.0;
        break;
        case "Non-Compliant":
        score = 60.0;
        break;
        default: scoreerror = true;
        }
        }
        */

        if (autofail) {
            $(".mon-sys-autofail").parent().addClass("sel-autofail");
            $(".mon-sys-autofail").show();
        }
        else {
            $(".mon-sys-autofail").parent().removeClass("sel-autofail");
            $(".mon-sys-autofail").hide();
        }

        /*
        if ($(".qst-hp-7_1").val() == "No") {
        score -= 10.0;
        }
        if ($(".qst-hp-7_2").val() == "No") {
        score -= 15.0;
        }
        */

        if (scoreerror) {
            $(".mon-sys-score").html("Incomplete");
        }
        else {
            $(".mon-sys-score").html(score + "%");
        }

        //Find CLX System Ref #
        if (($(".qst-spectrum-number").eq(0).val() == "") || scoreerror) {
            $(".mon-submit").attr("disabled", "disabled");
        }
        else {
            $(".mon-submit").removeAttr("disabled");
        }


    }
    setscore();

    if ($("#lblRole").html() == "NEW") {
        $("#submitme").show();
        $("#closeme").show();
    }
    else if ($("#lblRole").html() == "CSR") {
        $("#submitme").hide();
        $("select").attr("disabled", "disabled");
        $("textarea").attr("disabled", "disabled");
        $("#closeme").show();
        $("#deleteme").hide();
        if ($("#lblAcknowledgementDate").html() != "") {
            $(".mon-show-acknowledgementreceived").show();
        }
        else if ($("#lblAcknowledgementRequired").html() == "Yes") {
            $(".mon-show-acknowledgementrequired").show();
            $(".mon-show-isagent").show();
        }
    }
    else {
        $("#submitme").attr("value", "Update");
        $("#submitme").show();
        $("#deleteme").show();
        $("#closeme").show();
        if ($("#lblAcknowledgementDate").html() != "") {
            $(".mon-show-acknowledgementreceived").show();
        }
        else if ($("#lblAcknowledgementRequired").html() == "Yes") {
            $(".mon-show-acknowledgementrequired").show();
            $(".mon-show-isnotagent").show();
        }
    }

    function exists(me) {
        return (typeof me != 'undefined');
    }

})();

