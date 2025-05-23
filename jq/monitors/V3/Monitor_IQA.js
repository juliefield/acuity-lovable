$(document).ready(function () {
    var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
    var client = $("#lblClient").html();
    var formid = $("#lblFormId").html(); //DONE: Retrieve from qafrm (sqf_code field).
    var mykpi = $("#lblKPI").html();

    $(".display-lblSqfname").html($("#lblSqfname").html());

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

        var mykpistr = "Text:Quality";
        if ($("#lblSqfcode").html() == "77") {
            mykpistr = "Text:Supervisor QA";  //2020-07-29 - Changed from "0", so should be recording now.
        }

        var data = {
            lib: "qa",
            cmd: "saveQaForm",
            formId: formid,
            sqfCode: $("#lblSqfcode").html(),
            kpi: mykpistr,
            //kpi: 0,  //0 means don't record it.  Non-existence means use the default.  You can also pass it (mykpi).
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
                formId: formid,
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
            window.location = "//" + a$.urlprefix() + "acuityapm.com/monitor/monitor.aspx";
        }
        else {
            window.location = "//" + a$.urlprefix() + "acuityapm.com/monitor/monitor_review.aspx";
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
                        if (!any_no) if (qval == "No (High Risk)") any_no = true;
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
                formId: formid,
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
                    $(".qst-senttocompliance").trigger("change");
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


    mgrs = $("#lblClientDept").html();
    var mgrss = mgrs.split("|");
    for (var m in mgrss) {
        $(".combo-clientdept").append('<option value="' + mgrss[m] + '">' + mgrss[m] + "</option>");
    }

    function enablesubmit() {
        var submitok = true;
        if ($(".qst-spectrum-number").eq(0).val() == "") submitok = false;
        if ($(".qst-reasontograde").eq(0).val() == "") submitok = false;
        if ($(".qst-calltype").eq(0).val() == "") submitok = false;
        if ($(".qst-objection").eq(0).val() == "") submitok = false;
        if ($(".qst-comments").val() == "") submitok = false;

        if (!submitok) {
            $(".mon-submit").attr("disabled", "disabled");
        }
        else {
            $(".mon-submit").removeAttr("disabled");
        }
    }

    $(".qst-comments").keyup(function () {
        enablesubmit();
    });

    function setscore() { //TODO: Make the score work.

        $(".qst-senttocompliance").bind("change", function () {
            if ($(this).is(":checked")) {
                $(".qst-senttocompliance-label").css("font-weight", "bold");
                $(this).parent().css("background-color", "red").css("color", "white");
            }
            else {
                $(".qst-senttocompliance-label").css("font-weight", "normal");
                $(this).parent().css("background-color", "white").css("color", "black");
            }
        });
        $(".qst-senttocompliance").trigger("change");

        //Questions where a "No" value make it 60%
        var qs = ["1", "2.1", "3", "4.1", "5.1", "6.1"];
        var score = 0;
        var autofail = false;
        var scoreerror = false;

        //TODO: NEW SCORING GOES HERE!

        var cats = [
                { name: "Compliance", abr: "Compliance", score: 20, nos: 0, lims: [{ nos: 0, score: 20 }, { nos: 999, score: 0}] },
                { name: "Policy", abr: "Policy", score: 20, nos: 0, lims: [{ nos: 0, score: 20 }, { nos: 999, score: 0}] },
                { name: "Negotiation", abr: "Negotiation", score: 20, nos: 0, lims: [{ nos: 0, score: 20 }, { nos: 999, score: 0}] },
                { name: "Client Specifics", abr: "ClientSpecifics", score: 20, nos: 0, lims: [{ nos: 0, score: 20 }, { nos: 999, score: 0}] },
                { name: "Customer Experience", abr: "CustEx", score: 20, nos: 0, lims: [{ nos: 0, score: 20 }, { nos: 1, score: 10 }, { nos: 2, score: 10 }, { nos: 999, score: 0}] }
              ];

        $(".qst").each(function () {
            if (($(this).val() == "No")||($(this).val() == "No (High Risk)")) {
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
        /*
        qst-reasontograde
        qst-calltype
        qst-objection

        */

        enablesubmit();


    }
    setscore();

    if ($("#lblRole").html() == "NEW") {
        $("#submitme").show();
        $("#closeme").show();
    }
    else if (($("#lblRole").html() == "CSR") || ($("#lblAgent").html() == $("#lblViewer").html())) {
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

    //////////////////////// END OF PROSPER, Move all useful items above this line.

    //                  <select class="error-category" id="QAC1"><option value=""></option><option value="Qualifications">Qualifications</option><option value="Accomodations">Accomodations</option><option value="Incentives">Incentives</option><option value="Tour">Tour</option><option value="Unapproved Purchase">Unapproved Purchase</option><option value="Updating Concierge">Updating Concierge</option><option value="Payment Details">Payment Details</option><option value="Agent Performance">Agent Performance</option></select>
    //                  <div class="error-anchor error-anchor-QAC1"></div>

    $(".error-category").bind("change", function () {
        var opts;
        switch ($(this).val()) {
            case "Qualifications":
                opts = ["Bankruptcy", "Spouse Significant Other", "2 Forms ID", "Sole/Shared Ownership", "30/90 Days", "15-Month", "Good Standing", "Group Travel", "Age 25", "Income", "FICO", "CC/Debit"];
                break;
            case "Accomodations":
                opts = ["Arrival date not booked", "Length of Stay", "Based on Availability", "Incidentals", "Incorrect Tax", "Cxl Policy", "Unit Error"];
                break;
            case "Incentives":
                opts = ["Dining Dough", "Activity Menu", "ML38", "Mastercard", "2 or more gifts given", "Gift not confirmed", "Extension", "Free Nights", "Free Upgrade", "Cruise"];
                break;
            case "Tour":
                opts = ["Length of Presentation", "Choose Time", "Presentation Detail"];
                break;
            case "Unapproved Purchase":
                opts = ["Not on Deed", "Transferring Package", "Unauthorized State"];
                break;
            case "Updating Concierge":
                opts = ["Customer Info", "# of guests", "Account #", "Comments", "Tenn Tour Line"];
                break;
            case "Payment Details":
                opts = ["Using Anothers Card", "Incorrect Charge", "Incorrect CC Verification"];
                break;
            case "Agent Performance":
                opts = ["Disposition", "Request to CXL/Refund", "Call Recording Statement", "False Claims", "Another Account", "Incorrect Offer", "Pitch vs. Offer", "Checklist Error", "Missing Genie"];
                break;
            default:
                opts = ["(No Errors Found)"];
                break;
        }
        var blow = "";
        if ($(this).val() != "") {
            blow = '<select multiple class="error-category-error" id="' + $(this).attr("id").substr(0, 3) + "E" + '">';
            for (var i in opts) {
                blow += '<option value="' + opts[i] + '">' + opts[i] + "</option>";
            }
            blow += "</select>";
        }
        $(".error-anchor-" + $(this).attr("id")).html(blow);
    });
    $("NOT.mon-submitANYMORE").bind("click", function () {
        $("#txtTotal").val($("#montotal").html());
        $("#txtAssuranceTotal").val($("#assurancetotal").html()); //new
        $("#txtTotalPoints").val($("#montotalpoints").html());
        $("#txtTotalPossible").val($("#montotalpossible").html());
        $("#txtSuccessRate").val($("#monsuccessrate").html());
        $("#txtComments").val($("#Comments").val());

        for (var i = 1; i <= 19; i++) {
            $("#txtQ" + i).val($("#Q" + i).val());
            $("#txtQ" + i + "text").val($("#Q" + i + " option:selected").text());
            $("#txtQ" + i + "Comments").val($("#Q" + i + "Comments").val());
        }

        for (var i = 1; i <= 3; i++) {
            $("#txtQA" + i + "C").val($("#QA" + i + "C").val());
            $("#txtQA" + i + "Ctext").val($("#QA" + i + "Ctext").val());
            $("#txtQA" + i + "E").val($("#QA" + i + "E").val());
            $("#txtQA" + i + "Etext").val($("#QA" + i + "Etext").val());
            $("#txtQA" + i + "Comments").val($("#QA" + i + "Comments").val());
        }
        for (var i = 4; i <= 9; i++) {
            $("#txtQA" + i).val($("#QA" + i).val());
            $("#txtQA" + i + "Comments").val($("#QA" + i + "Comments").val());
        }

        $("#txtCalllength_HH").val($("#inpCalllength_HH").val());
        $("#txtCalllength_MM").val($("#inpCalllength_MM").val());
        $("#txtCalllength_SS").val($("#inpCalllength_SS").val());
        $("#txtSitelocation").val($("#selSitelocation").val());
        $("#txtJurisdiction").val($("#selJurisdiction").val());
        $("#txtCalltype").val($("#selCalltype").val());
        $("#txtCategory_collections").val($("#selCategory_collections").val());
        $("#txtCategory_move").val($("#selCategory_move").val());
        $("#txtLanguage").val($("#selLanguage").val());
        $("#txtEligible").val($("#selEligible").val());
        $("#txtValidtransfer").val($("#selValidtransfer").val());

        $("#txtReviewType").val($("#selReviewType").val());
        $("#txtCallpartyType").val($("#selCallpartyType").val());
        $("#txtOnlineGuidance").val($("#selOnlineGuidance").val());
        $("#txtReviewName").val($("#inpReviewName").val());

    });

    function buttonsforanswers() {
        $(".mon-answer select").each(function () {
            if (!$(this).parent().hasClass("mon-answer-special")) {
                var me = this;
                $(" option", this).each(function () {
                    if ($(this).val() != "") {
                        var bld = '<input type="button" value="' + $(this).text() + '" class="highlight-hover';
                        if ($(me).val() == $(this).val()) {
                            bld += ' highlight';
                        }
                        bld += '">';
                        $(me).parent().append(bld);
                    }
                })
                $(me).hide();
            }
        });
    }
    buttonsforanswers();

    var opts = ["BCT - Busy Can't Talk",
"BK - Booked",
"BSY - Busy Signal",
"Call Back -- General",
"Call Back -- Revenue",
"CB - Callback",
"CS - Customer Service",
"DNA - Date Not Available",
"DNC - Do Not Call",
"Dropped Call",
"IBB -- Inbound Line Booked",
"IBQ -- Inbound Line Questions",
"LC - Lost Connection",
"LM - Left Message",
"Manual OB -- Booked",
"NA -- Not Answered",
"NDM - No Dates in Mind",
"NI - Not Interested",
"NIS -- Not In Service",
"NQ - Not Qualified",
"NT - No Tone",
"PB - Previously Booked",
"PT - Previously Traveled",
"QHU - Quick Hang Up",
"RC - Recommend",
"RD - Refund",
"RQ - Request",
"SC - Spanish Caller",
"Unable to Hear Audio",
"VF - Verify Fail",
"VM - Voicemail",
"VS - Verified Sale",
"WN - Wrong Number"
];
    var blow = '<option value=""></option>';
    for (var i in opts) {
        blow += '<option value="' + opts[i] + '">' + opts[i] + "</option>";
    }
    $("#QA6").html(blow);

    var colors = ["#eeeeee", "#dddddd"];
    var tgl = 0;
    $(".mon-content ol li").each(function () {
        $(this).css("background", colors[tgl]);
        if (!tgl) tgl = 1; else tgl = 0;
    });

    $("#Comments").val($("#txtComments").val());
    $("#Comments").autogrow();

    for (var i = 1; i <= 24; i++) {
        $("#Q" + i).val($("#txtQ" + i).val());
        $("#Q" + i + "Comments").val($("#txtQ" + i + "Comments").val());
        $("#Q" + i + "Comments").autogrow();
    }
    for (var i = 1; i <= 24; i++) {
        if ($("#Q" + i).val() == "") {
            $("#Q" + i + " option[value='N/A']").attr('selected', 'selected')
        }
        else {
            if ($("#txtQ" + i + "text").val() != "") {
                $("#Q" + i + ' option:contains("' + $("#txtQ" + i + "text").val() + '")').attr('selected', 'selected');
            }
        }
    }
    for (var i = 1; i <= 3; i++) {
        $("#QA" + i + "C").val($("#txtQA" + i + "C").val());

        if ($("#txtQA" + i + "C").val() != "") {

            $("#QA" + i + "C").trigger("change");
            setTimeout(function () {
                for (var i = 1; i <= 3; i++) {
                    if ($("#txtQA" + i + "E").val() != "") {
                        var sp = $("#txtQA" + i + "E").val().split(",");
                        for (var o in sp) {
                            $("#QA" + i + "E option[value='" + sp[o] + "']").attr("selected", "selected");
                        }
                    }

                }
            }, 100);
        }
        //TODO: Put in the QA#E multi-selects.

        $("#QA" + i + "Comments").val($("#txtQA" + i + "Comments").val());
        $("#QA" + i + "Comments").autogrow();
    }
    for (var i = 4; i <= 9; i++) {
        $("#QA" + i).val($("#txtQA" + i).val());
        $("#QA" + i + "Comments").val($("#txtQA" + i + "Comments").val());
        $("#QA" + i + "Comments").autogrow();
    }

    //Buttons for answers.
    function buttonsforanswers() {
        $(".mon-answer select").each(function () {
            if (!$(this).parent().hasClass("mon-answer-special")) {
                var me = this;
                $(" option", this).each(function () {
                    if ($(this).val() != "") {
                        var bld = '<input type="button" value="' + $(this).text() + '" class="highlight-hover';
                        if ($(me).val() == $(this).val()) {
                            bld += ' highlight';
                        }
                        bld += '">';
                        $(me).parent().append(bld);
                    }
                })
                $(me).hide();
            }
        });
    }
    buttonsforanswers();

    $(".highlight-hover").bind("click", function () {
        var text = $(this).val();
        var sel = $(" select", $(this).parent());
        $(" option", sel).each(function () {
            if (text == $(this).text()) {
                $(sel).val($(this).val())
            }
        });
        $(sel).trigger("change");
        $(".highlight-hover", $(this).parent()).removeClass("highlight");
        $(this).addClass("highlight");

    });

    $(".sel_time").keypress(function (e) {
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            //display error message
            $("#errmsg").html("Digits Only").show().fadeOut("slow");
            return false;
        }
    });

    $("#Address").val($("#txtAddress").val());

    $(".mon-answer select").each(function () {
        $(this).trigger("change");
    });

    setCategory($(".select-call-type select").val());
});

function testblanks(me) {
    var asstot = -1;
    var tot = 0;
    var possible = 0;
    var p;
    var v;
    var blanksfound = false;
    if (me != null) {
        p = $(me).parent();
        v = $(me).val();
        if (v == "") {
            v = "&nbsp;"
        }
        else {
            if (isNaN(v)) {
                v = "&nbsp;"
            }
        }
        $("span", p).html(v);
    }
    $(".mon-answer select").each(function () {
        if (!$(this).hasClass("mon-answer-special")) {
            var val = $(this).val()
            if (val != "") {
                if (!isNaN(val)) {
                    if ($(this).attr("id") == "QA4") {
                        asstot = parseInt(val, 10);
                    }
                    else {
                        tot += parseInt(val, 10);
                        possible += 1;
                    }
                }
            }
            else {
                //blanksfound = true;
            }
        }
    });
    blanksfound = (possible == 0) || ($("#selReviewType").val() == "") || ($("#selCallpartyType").val() == "") || ($("#selOnlineGuidance").val() == "") /* || (asstot < 0) */;
    if ($("#lblAgent").html() == "") blanksfound = true;
    /*
    if (!blanksfound) {
    $(".mon-submit").removeAttr("disabled");
    }
    else {
    $(".mon-submit").attr("disabled", "disabled");
    }
    */
    if (asstot < 0) {
        $(".assurance-total").html('<span style="color:red;">QA Pass/Fail not specified - you may submit with no QA data.</span>');
    }
    else {
        $(".assurance-total").html(asstot);
    }
    $(".mon-total").html(tot + "/" + possible);
    var sr = "";
    if (possible == 0) {
        sr = "100%";
    }
    else {
        sr = ((tot / possible) * 100).toFixed() + '%';
    }
    $(".mon-total-points").html(tot);
    $(".mon-total-possible").html(possible);
    $(".mon-success-rate").html(sr);
}
/*
$("#submitme").bind("click", function() {
if (asstot < 0) {
return confirm("Pass/Fail is not selected.\nSubmit Monitor with no Quality Assurance?");
}
return true;
})
*/

$(".mon-answer select").bind("change", function () {
    testblanks(this);
});
$("#selReviewType").bind("change", function () {
    testblanks(this);
});
$("#selCallpartyType").bind("change", function () {
    testblanks(this);
});
$("#selOnlineGuidance").bind("change", function () {
    testblanks(this);
});

function setCategory(cat) {
    if (cat == "Collections") {
        $("#selCategory_collections").show();
        $("#selCategory_move").hide();
    }
    else {
        $("#selCategory_collections").hide();
        $("#selCategory_move").show();
    }
}

$(".select-call-type select").bind("change", function () {
    setCategory($(this).val());
});

function exists(me) {
    return (typeof me != 'undefined');
}
