$(document).ready(function () {

    var rebuttalstartvalue = "";
    var rebuttalresponsestartvalue = "";
    var rebuttalresponsesuccesschanged = false;

    $(".mon-answer select").bind("change", function () {
        var score = 0;
        var disp = "";
        if ($(this).val() == "Fail") {
            if ($(this).attr("af") == "Y") {
                $(this).closest("tr").css("background-color", "darkgray");
            }
        }
        else {
            $(this).closest("tr").css("background-color", "");
        }

        var allzero = false;

        $(".mon-answer select").each(function () {
            if ($(this).val() == "Pass") {
                score += parseInt($(this).attr("score"), 10);
            }
            else {
                if ($(this).attr("af") == "Y") {
                    disp = "Auto Fail";
                    if ($(this).attr("score") == "0") {
                        allzero = true;
                    }
                }
                else {
                    if ($(" .mp-val", $(this).parent()).length > 0) {
                        var x = $(".mp-val", $(this).parent()).eq(0).html();
                        var i = parseInt(x, 10);
                        if (i > 1) {
                            score -= parseInt($(this).attr("score"), 10) * (i - 1);
                        }
                    }
                }

            }
        });
        if (allzero) score = 0;
        if (score < 0) score = 0;
        if (disp != "Auto Fail") {
            disp = "" + score + "%";
        }
        $(".show-score").html(score);
        $(".show-disp").html(disp);

        if (score <= 94) {
            $(".mon-sys-acknowledgementrequired").attr("disabled", "disabled").prop("checked", true); ;
        }
        else {
            $(".mon-sys-acknowledgementrequired").removeAttr("disabled");
        }
        checksubmit();

    });

    function buttonsforanswers() {
        $(".mon-answer input").remove();
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
                });
                if ($(this).attr("score") == "6") {
                    $(me).parent().append('<span class="multiplier" style="display:none;"><span class="mp-lt">&lt;</span><span class="mp-val qst" qst="' + $(this).attr("qst") + '_X">1x</span><span class="mp-gt">&gt;</span></span>');
                }
                $(me).hide();
            }
        });
        $(".highlight-hover").unbind("click").bind("click", function () {
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
            if (text == "Fail") {
                $(" .multiplier", $(this).parent()).show();
            }
            else {
                $(" .multiplier", $(this).parent()).hide();
            }
        });
        $(".mon-answer select").each(function () {
            $(this).trigger("change");
        });
        $(".mp-lt,.mp-gt").bind("click", function () {
            var x = $(".mp-val", $(this).parent()).eq(0).html();
            var i = parseInt(x, 10);
            if ($(this).hasClass("mp-lt")) {
                if (i > 1) i -= 1;
            }
            else {
                i += 1;
            }
            $(".mp-val", $(this).parent()).eq(0).html("" + i + "x");

            $(" select", $(this).parent().parent()).trigger("change");
        });
    }

    function checksubmit() {
        if (($(".mon-field-clientdept").eq(0).val() == "")
                || ($(".combo-lettertypes").eq(0).val() == "")
                || ($(".combo-supervisor").eq(0).val() == "")
                || ($(".combo-teamlead").eq(0).val() == "")
                || ($(".combo-manager").eq(0).val() == "")
                ) {
            $(".mon-submit").attr("disabled", "disabled");
        }
        else {
            $(".mon-submit").removeAttr("disabled");
        }
        if ($(".mon-field-rebuttal").eq(0).val() == rebuttalstartvalue) {
            $(".mon-rebuttal").attr("disabled", "disabled");
        }
        else {
            $(".mon-rebuttal").removeAttr("disabled");
        }
        if (($(".mon-field-rebuttalresponse").eq(0).val() == rebuttalresponsestartvalue) && (!rebuttalresponsesuccesschanged)) {
            $(".mon-rebuttalresponse").attr("disabled", "disabled");
        }
        else {
            $(".mon-rebuttalresponse").removeAttr("disabled");
        }
    }

    $(".combo-lettertypes,.combo-supervisor,.combo-teamlead,.combo-manager").bind("change", function () {
        checksubmit();
    });

    $(".mon-sys-rebuttalresponsesuccess").bind("click", function () {
        rebuttalresponsesuccesschanged = true;
        checksubmit();
    });
    buttonsforanswers();

    var mgrs = $("#lblManagers").html();
    var mgrss = mgrs.split("|");
    var teamleader = $("#lblAgentTeamLeader").html();
    var groupleader = $("#lblAgentGroupLeader").html();
    var manager = $("#lblAgentManager").html();
    for (var m in mgrss) {
        var ms = mgrss[m].split("~");
        $(".combo-supervisor").append('<option ' + ((ms[0] == groupleader) ? "selected" : "") + ' value="' + ms[0] + '">' + ms[1] + "</option>");
        $(".combo-teamlead").append('<option ' + ((ms[0] == teamleader) ? "selected" : "") + ' value="' + ms[0] + '">' + ms[1] + "</option>");
        $(".combo-manager").append('<option ' + ((ms[0] == manager) ? "selected" : "") + ' value="' + ms[0] + '">' + ms[1] + "</option>");
    }

    mgrs = $("#lblClientDept").html();
    var mgrss = mgrs.split("|");
    for (var m in mgrss) {
        $(".combo-clientdept").append('<option value="' + mgrss[m] + '">' + mgrss[m] + "</option>");
    }
    $(".combo-clientdept").bind("change", function () {
        $(".mon-field-clientdept").val($(this).val());
        checksubmit();
    });


    $('input[name="clientdeptfield"]').keyup(function () {
        checksubmit();
    });

    $(".mon-field-rebuttal").keyup(function () {
        checksubmit();
    });
    $(".mon-field-rebuttalresponse").keyup(function () {
        checksubmit();
    });

    $('input[name="ghp"]').change(function () {
        changeletteridlist();
    });

    function changeletteridlist() {
        var lt = $('input[name="ghp"]:checked').val();
        var ghps = $("#lblLetterTypes").html();
        var ghpss = ghps.split("|");
        $(".combo-lettertypes").empty();
        $(".combo-lettertypes").append('<option value=""></option>');
        for (var m in ghpss) {
            var ms = ghpss[m].split("~");
            if (ms[0] == lt) {
                $(".combo-lettertypes").append('<option value="' + ms[1] + '">' + ms[1] + "-" + ms[2] + "</option>");
            }
        }
    }

    //Load all letter types into combo-correctletter
    if (true) {
        var ghps = $("#lblLetterTypes").html();
        var ghpss = ghps.split("|");
        $(".combo-correctletter").empty();
        $(".combo-correctletter").append('<option value=""></option>');
        for (var m in ghpss) {
            var ms = ghpss[m].split("~");
            $(".combo-correctletter").append('<option value="' + ms[1] + '">' + ms[1] + "-" + ms[2] + "</option>");
        }
    }

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

    $(".mon-submit,.mon-rebuttal,.mon-rebuttalresponse").bind("click", function () {
        //TODO: Gather all of your variables to be passed to saveQaForm
        var me = this;
        $(me).hide();
        var mykpi = 84;
        var answers = [];
        var isrebuttal = $(this).hasClass("mon-rebuttal");
        var isrebuttalresponse = $(this).hasClass("mon-rebuttalresponse");

        var rebuttalchanged = false;
        var rebuttalresponsechanged = rebuttalresponsesuccesschanged;

        $(".qst").each(function () {
            if ($(this).attr("qst").indexOf("_X") > 0) {
                myval = $(this).html();
            }
            else {
                myval = $(this).val();
            }

            if ($(this).attr("qst") == "Rebuttal") {
                if ($(me).hasClass("mon-rebuttal")) { //Reduced error emails?
                    if ($(this).val() != rebuttalstartvalue) {
                        rebuttalchanged = true;
                    }
                }
            }

            if ($(this).attr("qst") == "RebuttalResponse") {
                if ($(me).hasClass("mon-rebuttalresponse")) { //Reduced error emails?
                    if ($(this).val() != rebuttalresponsestartvalue) {
                        rebuttalresponsechanged = true;
                    }
                }
            }

            //What are these?
            if ($(this).attr("qst") == "RebuttalMgr") {
                myval = myval.replace(/(?:\r\n|\r|\n)/g, "<br>");
            }
            if ($(this).attr("qst") == "RebuttalResponseQA") {
                myval = myval.replace(/(?:\r\n|\r|\n)/g, "<br>");
            }

            if (isrebuttal) {
                if ($(this).attr("qst") == "RebuttalMgr") {
                    myval = $("#lblViewer").html();
                }
            }
            if (isrebuttalresponse) {
                if ($(this).attr("qst") == "RebuttalResponseQA") {
                    myval = $("#lblViewer").html();
                }
            }
            if ($(this).attr("qst") == "RebuttalResponseSuccess") {
                if ($(this).is(":checked")) {
                    myval = "Yes";
                }
                else {
                    myval = "";
                }
            }

            /*
            if ($(this).is("input")) {
            if ($(this).attr("type") == "checkbox") {
            if ($(this).is(":checked")) {
            myval = "Yes";
            if ($(this).attr("qst") == "Client-Scored") {
            mykpi = 84;
            }
            }
            else {
            myval = "No";
            }
            }
            }
            */
            answers.push({ friendlyname: $(this).attr("qst"), answertext: myval, score: 0, value: '', version: 0 });
        });
        var data = {
            lib: "qa",
            cmd: "saveQaForm",
            formId: 9,
            sqfCode: 61,
            kpi: mykpi,
            kpiSet: [84],
            database: "C",
            examinee: $("#lblAgent").html(),
            score: $(".mon-sys-score").html().replace("%", ""),
            value: ($(".mon-sys-autofail").html() == "Auto Fail") ? "Auto Fail" : "",
            answers: answers,
            callId: $("#lblCallid").html(),
            callDate: $("#lblCalldate").html(),
            callTime: "",
            clientDept: $(".mon-field-clientdept").eq(0).val(),
            acknowledgement: $(".mon-sys-acknowledgementrequired").eq(0).is(":checked") ? "Hold" : false,
            performant: {
                rebuttalchanged: rebuttalchanged,
                rebuttalresponsechanged: rebuttalresponsechanged
            }
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
                formId: 10,
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
        if (a$.gup("origin") == "report") {
            window.close();
        }
        else if ($("#lblMode").html() == "new") {
            window.location = "//performant.acuityapm.com/monitor/monitor.aspx";
        }
        else {
            window.location = "//performant.acuityapm.com/monitor/monitor_review.aspx";
        }
    }

    var allsetup = false;
    //Prosper Selects
    function PERFORMANTsetup() {
        if ($("#lblMode").html() == "new") {
            $(".mon-table select").each(function () {
                $(this).val("N/A");
                $(this).trigger("change");
            });
            if ($("#lblAgentGroupName").html().indexOf("NGHP") >= 0) {
                $(".radio-nghp").prop("checked", true);
                changeletteridlist()
            }
            else if ($("#lblAgentGroupName").html().indexOf("GHP") >= 0) {
                $(".radio-ghp").prop("checked", true);
                changeletteridlist()
            }
            allsetup = true;
        }
        else {
            //TODO: Read in the answers from getqaform.
            var data = {
                lib: "qa",
                cmd: "getQaForm",
                formId: 9,
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
                                if (qst == "LetterID") {
                                    $(".radio-ghp").prop("checked", true);
                                    changeletteridlist()
                                    $(this).val(json.form.answers[i].answertext);
                                    if ($(this).val() != json.form.answers[i].answertext) {
                                        $(".radio-nghp").prop("checked", true);
                                        changeletteridlist()
                                        $(this).val(json.form.answers[i].answertext);
                                    }
                                }
                                else if (qst == "RebuttalResponseSuccess") {
                                    if (json.form.answers[i].answertext == "Yes") {
                                        $(".mon-sys-rebuttalresponsesuccess").prop("checked", true);
                                    }
                                }
                                else if (qst == "ReleaseDate") {
                                    if (json.form.answers[i].answertext == "") {
                                        // //TODO: Make this automatically find next Monday (in the .aspx too, or change how it works).
                                    }
                                    else {
                                        $(this).val(json.form.answers[i].answertext);
                                    }
                                    var d1 = Date.parse($(this).val());
                                    var d2 = new Date();
                                    if (d1 < d2.getTime()) {
                                        $(this).attr("disabled", "disabled");
                                    }

                                    d2.setTime(d2 - (((24 - 9) + 24 + 24) * 60 * 60 * 1000)); //Midnight on Wednesday following the release date (backing up current date to compare).
                                    if (d1 < d2.getTime()) {
                                        $(".mon-field-rebuttal").attr("disabled", "disabled");
                                    }
                                    //Don't allow rebuttal if it's your own monitor.
                                }
                                else {
                                    $(this).val(json.form.answers[i].answertext);
                                    if ($(this).hasClass("cheapscore")) {
                                        $(" input", $(this).parent()).each(function () {
                                            if ($(this).val() == json.form.answers[i].answertext) {
                                                $(this).addClass("highlight");
                                            }
                                            else {
                                                $(this).removeClass("highlight");
                                            }
                                        });
                                        if (json.form.answers[i].answertext == "Fail") {
                                            $(" .multiplier", $(this).parent()).show();
                                        }
                                        for (var j in json.form.answers) {
                                            if (json.form.answers[j].friendlyname == (qst + "_X")) {
                                                $(" .mp-val", $(this).parent()).html(json.form.answers[j].answertext);
                                            }
                                        }
                                        $(this).trigger("change");
                                    }
                                }
                                break;
                            }
                        }
                    });
                    var qanotes = $(".mon-field-qanotes").val();
                    if (qanotes.toLowerCase().indexOf("hold") >= 0) {
                        if ($(".mon-field-releasedate").val() != $("#lblNextMonday").val()) {
                            alert("Note: This monitor is on hold with a release date in the past.\n\nThe release date (if you were to release the monitor from hold) will be updated to: " + $("#lblNextMonday").val() + "\n\nYou can change the release date in the field below (lower right) if you want it to be released sooner.");
                            $(".mon-field-releasedate").val($("#lblNextMonday").val());
                            $(".mon-field-releasedate").removeAttr("disabled");
                        }
                    }
                    if ($("#rebuttalme").is(":visible")) {
                        if ($(".mon-field-rebuttal").val() == "") {
                        }
                        else {
                            rebuttalstartvalue = $(".mon-field-rebuttal").val();
                        }
                    }
                    else {
                        $(".mon-field-rebuttal").attr("disabled", "disabled");
                    }
                    if ($(".mon-field-rebuttal").val() != "") {
                        $(".mon-sys-rebuttalshow").show();
                        $(".mon-sys-rebuttal-stash").attr("disabled", "disabled");
                    }
                    if ($("#rebuttalresponseme").is(":visible")) {
                        if ($(".mon-field-rebuttalresponse").val() == "") {
                        }
                        else {
                            rebuttalresponsestartvalue = $(".mon-field-rebuttalresponse").val();
                        }
                    }
                    else {
                        $(".mon-field-rebuttalresponse").attr("disabled", "disabled");
                    }
                    if ($(".mon-field-rebuttalresponse").val() != "") {
                        $(".mon-sys-rebuttalresponseshow").show();
                        $(".mon-sys-rebuttalresponse-stash").attr("disabled", "disabled");
                    }
                    allsetup = true;
                }
            }

        }
        $(".mon-table tbody").css("height", (window.innerHeight - 120) + "px");
        window.addEventListener("resize", function () {
            $(".mon-table tbody").css("height", (window.innerHeight - 120) + "px");
        });
    }
    PERFORMANTsetup();
    $("#rebuttalme").hide();
    $("#rebuttalresponseme").hide();
    $(".qst-comments").bind("change", function () {
        //Eliminate carriage returns right here.
        $(this).val($(this).val().replace(/(?:\r\n|\r|\n)/g, " "));
    });
    $("textarea").keyup(function () {
        $(this).val($(this).val().replace(/(?:\r\n|\r|\n)/g, " "));
    });

    if (($("#lblMode").html() == "new") && (($("#lblRole").html() == "Admin") || ($("#lblRole").html() == "CorpAdmin") || ($("#lblRole").html() == "Quality Assurance"))) {
        $(".mon-rebuttal-block").hide();
        $(".mon-rebuttalresponse-block").hide();
        $(".mon-show-new").show();
        $(".mon-show-qanotes").show();
        $("#submitme").show().removeAttr("hidden");
        $("#closeme").show().removeAttr("hidden");
    }
    else if ($("#lblMode").html() == "new") {
        return_to_v1();
    }
    else if (($("#lblRole").html() == "CSR") || ($("#lblAgent").html() == $("#lblViewer").html())) {
        $("#submitme").hide();
        $("select").attr("disabled", "disabled");
        $("textarea").attr("disabled", "disabled");
        $("#closeme").show().removeAttr("hidden");
        $("#deleteme").hide();
        if ($("#lblAcknowledgementDate").html() != "") {
            $(".mon-show-acknowledgementreceived").show();
        }
        else if ($("#lblAcknowledgementRequired").html() == "Yes") {
            $(".mon-show-acknowledgementrequired").show();
            $(".mon-show-isagent").show();
        }
    }
    else if (($("#lblRole").html() != "Admin") && ($("#lblRole").html() != "CorpAdmin") && ($("#lblRole").html() != "Quality Assurance")) {
        $("#submitme").hide();
        $("select").attr("disabled", "disabled");
        $("textarea").attr("disabled", "disabled");

        $(".mon-field-rebuttal").removeAttr("disabled");
        $("#rebuttalme").show().removeAttr("hidden");
        $("#closeme").show().removeAttr("hidden");
        $("#deleteme").hide();
        if ($("#lblAcknowledgementDate").html() != "") {
            $(".mon-show-acknowledgementreceived").show();
        }
        else if ($("#lblAcknowledgementRequired").html() == "Yes") {
            $(".mon-show-acknowledgementrequired").show();
            $(".mon-show-isnotagent").show();
        }

    }
    else {
        $(".mon-field-rebuttalresponse").removeAttr("disabled");
        $("#rebuttalresponseme").show().removeAttr("hidden");
        $("#submitme").attr("value", "Update");
        $("#submitme").show().removeAttr("hidden");
        $("#deleteme").show().removeAttr("hidden");
        $("#closeme").show().removeAttr("hidden");
        $(".mon-show-qanotes").show();

        if ($("#lblAcknowledgementDate").html() != "") {
            $(".mon-show-acknowledgementreceived").show();
        }
        else {
            $(".mon-show-new").show(); //Experiment

        }
        /*
        else if ($("#lblAcknowledgementRequired").html() == "Yes") {
        $(".mon-show-acknowledgementrequired").show();
        $(".mon-show-isnotagent").show();
        }
        */
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
                        /* //DEBUG: Split is throwing an error...
                        var sp = $("#txtQA" + i + "E").val().split(",");
                        for (var o in sp) {
                        $("#QA" + i + "E option[value='" + sp[o] + "']").attr("selected", "selected");
                        }
                        */
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
    $(".OLDmon-answer select").each(function () {
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

$(".OLDmon-answer select").bind("change", function () {
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
