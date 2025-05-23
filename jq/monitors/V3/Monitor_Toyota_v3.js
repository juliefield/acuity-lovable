$(document).ready(function () {

    var FORM_ID = 27;
    var SQF_CODE = 8;

    $(".mon-clear-select").bind("click", function () {
        $("select option:selected", $(this).parent()).removeAttr("selected");
        return false;
    });

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
            formId: FORM_ID,
            sqfCode: SQF_CODE,
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
                formId: FORM_ID,
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
                formId: FORM_ID,
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
                                else if ($(this).attr("multiple") == "multiple") {
                                    var me = this;
                                    $.each(json.form.answers[i].answertext.split(","), function (i, e) {
                                        $("option[value='" + e + "']", me).prop("selected", true);
                                    });
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

    $(".mon-table .qst").bind("change", function () {
        setscore();
    });

    function setscore() { //TODO: Make the score work.

        //Questions where a "No" value make it 60%
        var qs = [
            { qst: "2a", points: 0 },
            { qst: "2b", points: 0 },
            { qst: "2c", points: 0 },
            { qst: "3a", points: 0 },
            { qst: "3b", points: 20 },
            { qst: "4a", points: 5 },
            { qst: "4b", points: 5 },
            { qst: "4c", points: 5 },
            { qst: "4d", points: 5 },
            { qst: "5a", points: 5 },
            { qst: "5b", points: 5 },
            { qst: "5c", points: 5 },
            { qst: "6a", points: 15 },
            { qst: "6b", points: 15 },
            { qst: "7a", points: 5 },
            { qst: "7b", points: 9 }
        ];

        var qsval = [];

        $(".qst").each(function () {
            var qst = $(this).attr("qst");
            for (var q in qs) {
                if (qs[q].qst == qst) {
                    qsval[qst] = $(this).val();
                }
            }
        });

        var score = 0;
        var autofail = false;
        var scoreerror = false;

        if (qsval["2b"] == "No") {
            score -= 20;
        }
        if (qsval["2c"] == "No") {
            autofail = true;
        }
        if (/* (qsval["2a"] == "Yes") && */(qsval["2b"] == "Yes") && (qsval["2c"] == "Yes")) {
            score += 1;
        }


        if (qsval["3b"] == "No") {
            //score -= 20;
        }

        //For normal Yes, FYI, and N/A entries
        for (var q in qs) {
            if (qs[q].points > 0) {
                if ((qsval[qs[q].qst] == "Yes") || (qsval[qs[q].qst] == "FYI") || (qsval[qs[q].qst] == "N/A")) {
                    score += qs[q].points;
                }
            }
        }

        if (autofail) {
            $(".mon-sys-autofail").parent().addClass("sel-autofail");
            $(".mon-sys-autofail").show();
            score = 0; //Toyota-specific rule.
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
        if (scoreerror
            || ($(".qst-account-number").eq(0).val() == "")
            || ($(".qst-calldirection").eq(0).val() == "")
            || ($(".qst-language").eq(0).val() == "")
            ) {
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

    //////////////////////// Editing (Experimental)
    var editme = false;
    var addtext = "--Add--";
    var removetext = "--Remove--";
    var carrotwidth = 24;
    function set_edit() {
        if (editme) {
            $(".editinject").remove();
        }
        $(".editable").each(function () {
            if (editme) {
                if ($(this).prop("tagName") == "SELECT") {
                    if (addtext != "") $(this).append('<option class="editinject" value="' + addtext + '">' + addtext + '</option>');
                    if (removetext != "") $(this).append('<option class="editinject" value="' + removetext + '">' + removetext + '</option>');
                    var inputadd = "";
                    if ($(this).attr("multiple") == "multiple") {
                        inputadd = '<input type="text" value="' + $(this).val() + '" class="editinject" style="position:absolute;top:0px;left:0px;height: 12px; width: ' + ($(this).width() - carrotwidth) + 'px;" />';
                    }
                    else {
                        inputadd = '<input type="text" value="' + $(this).val() + '" class="editinject" style="position:absolute;top:0px;left:0px;height: ' + ($(this).height() - 4) + 'px; width: ' + ($(this).width() - carrotwidth) + 'px;" />';
                    }
                    $(this).parent().css("position", "relative").append(inputadd);
                }
                else {
                    $(this).attr("contenteditable", "true");
                }
            }
            else {
                if ($(this).prop("tagName") == "SELECT") {
                }
                else {
                    $(this).removeAttr("contenteditable");
                }
            }
        });
        if (editme) {
            $(".editshow").show();
            $("select.editable").each(function () {
                $(this).attr("previousVal", $(this).val());
                var me = this;
                $("input.editinject", $(this).parent()).each(function () {
                    $(this).val($(me).val());
                });
            });
            $("input.editinject").unbind().bind("keyup", function () {
                var me = this;
                var isel = $("select", $(this).parent());
                if ($(isel).attr("previousVal") == addtext) {
                    $(isel).append('<option selected="selected" value="' + $(me).val() + '">' + $(me).val() + '</option>');
                    $(isel).attr("previousVal", $(me).val());
                    $("option.editinject", isel).each(function () {
                        $(this).remove();
                    });
                    if (addtext != "") $(isel).append('<option class="editinject" value="' + addtext + '">' + addtext + '</option>');
                    if (removetext != "") $(isel).append('<option class="editinject" value="' + removetext + '">' + removetext + '</option>');
                }
                else {
                    $("option:selected", $(isel)).each(function () {
                        if ($(isel).attr("previousVal") == $(this).val()) {
                            $(this).val($(me).val());
                            $(this).text($(me).val());
                            $(isel).attr("previousVal", $(me).val());
                        }
                    });
                }
                $(me).width(($(isel).width() - carrotwidth) + "px");
            });
        }
        else $(".editshow").hide();
    };
    $("select.editable").bind("focus", function () {
        $(this).attr("previousVal", $(this).val());
    }).bind("change", function () {
        var me = this;
        if ((removetext != "") && ($(me).val() == removetext)) {
            $(me).val($(me).attr("previousVal"));
            $("option:selected", me).each(function () {
                $(this).remove();
            });
            $(me).val(addtext);
            $(me).trigger("change");
            return;
        }
        //alert("debug:Previous=" + $(this).attr("previousVal") + ", current=" + $(this).val());
        $("input.editinject", $(me).parent()).each(function () {
            if ($(me).val() == addtext) {
                $(this).val("");
            } else {
                $(this).val($(me).val());
            }
        });

        $(this).attr("previousVal", $(this).val());
    });
    if (a$.gup("edit") == "1") {
        editme = true;
        set_edit();
    }
    $(".editme").bind("click", function () {
        editme = $(this).prop("checked");
        set_edit();
    });

    function exists(me) {
        return (typeof me != 'undefined');
    }

});

