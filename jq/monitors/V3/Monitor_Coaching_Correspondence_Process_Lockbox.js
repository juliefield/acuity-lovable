$(document).ready(function () {

    //Jeff updated 2023-11-10:
    $(".mon-sys-hold").change(function () {
        if ($(this).is(":checked")) {
            $(".mon-field-reasonnotes").prop("disabled", false).addClass("dv-nonblank");
            alert("Note: This monitor is on hold until saved without the 'Place Monitor on HOLD' checkbox activated");
            // $(".mon-field-releasedate").val($("#lblNextMonday").val());
            // $(".mon-field-releasedate").removeAttr("disabled");
            $(".mon-field-releasedate").val("");
        } else {
            $(".mon-field-reasonnotes").prop("disabled", true).removeClass("dv-nonblank");
            $(".mon-field-releasedate").val($("#lblToday").val());
            $("#lblCalldate").val($("#lblToday").val());
            $(".mon-field-releasedate").prop("disabled", true);
        }
    });

    $(window).load(function () {
        $(".monitor-table, .header-table").fadeIn(2000);
    });

    var rebuttalstartvalue = "";
    var rebuttalresponsestartvalue = "";
    var rebuttalresponsesuccesschanged = false;

    var rebuttalstartvalueb = "";
    var rebuttalresponsestartvalueb = "";
    var rebuttalresponsesuccesschangedb = false;

    var rebuttalstartvaluec = "";
    var rebuttalresponsestartvaluec = "";
    var rebuttalresponsesuccesschangedc = false;
    var passed_lettertype = a$.gup("lettertype");
    // alert("debug: passed lettertype = " + passed_lettertype);

    if ((passed_lettertype).indexOf("GHP") > -1) {
        $(".radio-ghp").prop("checked", true);
        changeletteridlist(true);
    }
    if ((passed_lettertype).indexOf("NGHP") > -1) {
        // alert("passed NGHP");
        $(".radio-nghp").prop("checked", true);
        changeletteridlist(true);
    }
    if ((passed_lettertype).indexOf("CPN") > -1) {
        // alert("passed CPN");
        $(".radio-nghp").prop("checked", true);
        changeletteridlist(true);
    }
    if ((passed_lettertype).indexOf("CPLB_GHP") > -1) {
        // alert("passed GHP");
        $(".radio-ghp").prop("checked", true);
        changeletteridlist(true);
    }
    if ((passed_lettertype).indexOf("ORM") > -1) {
        // alert("passed ORM");
        $(".radio-nghp").prop("checked", true);
        changeletteridlist(true);        
    }

    if (window.location.href.indexOf("Monitor_Coaching_Internal_Review") > -1 &&
    window.location.href.indexOf("performant") > -1) {
        $('.mon-field-clientdept').val('Commercial Repayment Center');
    }

    $(".tbl-not-cplb, .show-score, .show-disp").show();
    $(".cb-cplb").bind("change", function () {
        if ($(this).prop("checked")) {
            $(".combo-lettertypes").val("N/A-CPLB");
            $(".tbl-cplb, .show-scorecplb, .show-dispcplb").show();
            $(".tbl-not-cplb, .show-score, .show-disp").hide();
        }
        else {
            $(".tbl-not-cplb, .show-score, .show-disp").show();
            $(".tbl-cplb, .show-scorecplb, .show-dispcplb").hide();
        }
    });


    if (a$.gup("lettertype") != "") {
        $(".cb-cplb").prop('checked', (a$.gup("lettertype").indexOf("CPLB") >= 0)).attr("disabled", "disabled");
        $(".cb-cplb").trigger("change");
    }


    $("#coachingCheckBox").bind("change", function () {
        if ($(this).prop("checked")) {
            $(".show-coaching").show();
        }
        else {
            $(".show-coaching").hide();
        }
    });

    $(".coaching-completed-checkbox").bind("change", function () {
        if ($(this).parent().parent().children().first().children().first().val() == "") {
            //alert("Please enter a description of the coaching before marking it as complete.");
            $(this).prop("checked", false);
        }
        if ($(this).prop("checked")) {
            var d = new Date();
            $(this).next().val((d.toLocaleDateString() + " " + d.toLocaleTimeString()).replace(/\?/g, ""));
        }
        else {
            $(this).next().val("");
        }
    });

    $(".qst-coaching-comments").bind("change", function () {
        $(".coaching-completed-checkbox").trigger("change");
    });

    $(".cheapscore").each(function () {
        if ($(this).prop("value") == "Fail") {
            $(this).parent().parent().next().children().show();
        }
        else {
            $(this).parent().parent().next().children().hide();
        }
    });

    $(".cheapscore").bind("change", function () {
        if ($(this).prop("value") == "Fail") {
            $(this).parent().parent().next().children().show();
        }
        else {
            $(this).parent().parent().next().children().hide();
        }
    });

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

        if (($("#lblRole").html() != "Quality Assurance")) {
            if (score < 100) {
                $("#coachingCheckBox").prop("checked", true).trigger("change");
            }
            else {
                $("#coachingCheckBox").prop("checked", false).trigger("change");
            }
        }

        $(".show-disp").html(disp);

        if (score <= 94) {
            $(".mon-sys-acknowledgementrequired").attr("disabled", "disabled").prop("checked", true); ;
        }
        else {
            $(".mon-sys-acknowledgementrequired").removeAttr("disabled");
        }
        checksubmit();
    });

    $(".mon-answer-cplb select").bind("change", function () {
        var scorecplb = 0;
        var dispcplb = "";
        if ($(this).val() == "Fail") {
            if ($(this).attr("af") == "Y") {
                $(this).closest("tr").css("background-color", "darkgray");
            }
        }
        else {
            $(this).closest("tr").css("background-color", "");
        }

        var allzero = false;

        $(".mon-answer-cplb select").each(function () {
            if ($(this).val() == "Pass") {
                scorecplb += parseInt($(this).attr("score"), 10);
            }
            else {
                if ($(this).attr("af") == "Y") {
                    dispcplb = "Auto Fail";
                    if ($(this).attr("score") == "0") {
                        allzero = true;
                    }
                }
            }
        });
        if (allzero) scorecplb = 0;
        if (scorecplb < 0) scorecplb = 0;
        if (dispcplb != "Auto Fail") {
            dispcplb = "" + scorecplb + "%";
        }
        $(".show-scorecplb").html(scorecplb);

        if (($("#lblRole").html() != "Quality Assurance")) {
            if (scorecplb < 100) {
                $("#coachingCheckBox").prop("checked", true).trigger("change");
            }
            else {
                $("#coachingCheckBox").prop("checked", false).trigger("change");
            }
        }

        $(".show-dispcplb").html(dispcplb);

        if (scorecplb <= 94) {
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

        $(".mon-answer-cplb select").each(function () {
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
            $(".mon-coaching").removeAttr("disabled");
        }
        else {
            $(".mon-rebuttal").removeAttr("disabled");
            //Always show? $(".mon-coaching").attr("disabled", "disabled");
        }
        if (($(".mon-field-rebuttalresponse").eq(0).val() == rebuttalresponsestartvalue) && (!rebuttalresponsesuccesschanged)) {
            $(".mon-rebuttalresponse").attr("disabled", "disabled");
        }
        else {
            $(".mon-rebuttalresponse").removeAttr("disabled");
        }

        if ($(".mon-field-rebuttal-b").eq(0).val() == rebuttalstartvalueb) {
            $(".mon-rebuttal-b").attr("disabled", "disabled");
            // $(".mon-coaching").removeAttr("disabled");
        }
        else {
            $(".mon-rebuttal-b").removeAttr("disabled");
            //Always show? $(".mon-coaching").attr("disabled", "disabled");
        }
        if (($(".mon-field-rebuttalresponse-b").eq(0).val() == rebuttalresponsestartvalueb) && (!rebuttalresponsesuccesschangedb)) {
            $(".mon-rebuttalresponse-b").attr("disabled", "disabled");
        }
        else {
            $(".mon-rebuttalresponse-b").removeAttr("disabled");
        }

        if ($(".mon-field-rebuttal-c").eq(0).val() == rebuttalstartvaluec) {
            $(".mon-rebuttal-c").attr("disabled", "disabled");
            // $(".mon-coaching").removeAttr("disabled");
        }
        else {
            $(".mon-rebuttal-c").removeAttr("disabled");
            //Always show? $(".mon-coaching").attr("disabled", "disabled");
        }
        if (($(".mon-field-rebuttalresponse-c").eq(0).val() == rebuttalresponsestartvaluec) && (!rebuttalresponsesuccesschangedc)) {
            $(".mon-rebuttalresponse-c").attr("disabled", "disabled");
        }
        else {
            $(".mon-rebuttalresponse-c").removeAttr("disabled");
        }

    }

    $(".combo-lettertypes,.combo-supervisor,.combo-teamlead,.combo-manager").bind("change", function () {
        checksubmit();
    });

    function loadtags() {
        var myindex = 0;
        $(".mon-field-trendcategory").each(function () {
            var curtag = $(this).val().replace(/\& /g, "&amp; ");
            //alert("debug: curtag=" + curtag);
            var tags = $("#lblTags").html();
            var tagssa = tags.split("|");
            var tagss = [
                "Incorrect Adjustment",
                "Case Not Worked at Case Level",
                "Incorrect/Incomplete Notes",
                "Incorrect/Incomplete Letter",
                "Incorrect/Incomplete Case Work",
                "Other"
            ];
            for (var a in tagssa) {
                var found = false;
                for (var t in tagss) {
                    if (tagss[t] == tagssa[a]) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    tagss.push(tagssa[a]);
                }
            }
            $(".combo-tags", $(this).parent()).empty();
            $(".combo-tags", $(this).parent()).append('<option value=""></option>');
            var foundtag = false;
            for (var t in tagss) {
                var sel = "";
                if (tagss[t] == curtag) {
                    sel = ' selected="selected" ';
                    foundtag = true;
                }
                $(".combo-tags", $(this).parent()).append('<option' + sel + ' value="' + tagss[t] + '">' + tagss[t] + "</option>");
            }
            if (!foundtag) {
                $(".combo-tags", $(this).parent()).append('<option selected="selected" value="' + curtag + '">' + curtag + "</option>");
            }
            myindex++;
            if (curtag != "") {
                $($(".ecodebase").children()[myindex]).show(); //Brian's method for showing.
            }

        })
        $(".new-tag").unbind().bind("click", function () {
            $(".mon-field-trendcategory", $(this).parent()).val("").show();
            $(".select-tag", $(this).parent()).show();
            $(".combo-tags", $(this).parent()).hide();
            $(".new-tag", $(this).parent()).hide();
        });
        $(".select-tag").unbind().bind("click", function () {
            $(".mon-field-trendcategory", $(this).parent()).val($(".combo-tags").val()).hide();
            $(".select-tag", $(this).parent()).hide();
            $(".combo-tags", $(this).parent()).show();
            $(".new-tag", $(this).parent()).show();
        });

        $(".combo-tags").bind("change", function () {
            $(".mon-field-trendcategory", $(this).parent()).val($(this).val());
        });
    }

    $(".mon-sys-rebuttalresponsesuccess").bind("click", function () {
        rebuttalresponsesuccesschanged = true;
        checksubmit();
    });

    $(".mon-sys-rebuttalresponsesuccess-b").bind("click", function () {
        rebuttalresponsesuccesschangedb = true;
        checksubmit();
    });

    $(".mon-sys-rebuttalresponsesuccess-c").bind("click", function () {
        rebuttalresponsesuccesschangedc = true;
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

    if ($(".combo-manager").attr("defaultoption") != null) {
        if ($("#lblMode").html() == "new") {
            $(".combo-manager").val($(".combo-manager").attr("defaultoption")).trigger("change");
        }
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

    if ($("#lblMode").html() == "new") {
        $(".combo-clientdept").val("Commercial Repayment Center").trigger("change");
    }

    $('input[name="clientdeptfield"]').keyup(function () {
        checksubmit();
    });

    $(".mon-field-rebuttal").keyup(function () {
        checksubmit();
    });
    $(".mon-field-rebuttalresponse").keyup(function () {
        checksubmit();
    });

    $(".mon-field-rebuttal-b").keyup(function () {
        checksubmit();
    });
    $(".mon-field-rebuttalresponse-b").keyup(function () {
        checksubmit();
    });

    $(".mon-field-rebuttal-c").keyup(function () {
        checksubmit();
    });
    $(".mon-field-rebuttalresponse-c").keyup(function () {
        checksubmit();
    });

    $('input[name="ghp"]').change(function () {
        changeletteridlist(true);
    });

    function changeletteridlist(manuallychanging) {
        var lt = $('input[name="ghp"]:checked').val();
        var ghps = $("#lblLetterTypes").html();
        var ghpss = ghps.split("|");
        $(".combo-lettertypes").empty();
        $(".combo-lettertypes").append('<option value="N/A-GHP">N/A-GHP-N/A-GHP</option>');

        for (var m in ghpss) {
            var ms = ghpss[m].split("~");
            if (ms[0] == lt) {
                $(".combo-lettertypes").append('<option value="' + ms[1] + '">' + ms[1] + "-" + ms[2] + "</option>");
            }
        }

        if (manuallychanging) {
            if ($("#lblMode").html() == "new") {                                
                if (false) { //2022-12-21 - all released immediately. (lt == "GHP") {
                    $(".mon-field-releasedate").val($("#lblNextMonday").val());
                    $(".new-release-message").html("").hide();
                }
                else if (lt == "NGHP") {
                    $(".combo-lettertypes").append('<option selected="selected" value="N/A-NGHP">N/A-NGHP-N/A-NGHP</option>');
                    $(".mon-field-releasedate").val($("#lblToday").val());
                    $(".new-release-message").html("* NEW: ALL monitors will be released immediately.").show();
                }
            }
            else if (($("#lblRole").html() == "Admin") || ($("#lblRole").html() == "CorpAdmin") || ($("#lblRole").html() == "Quality Assurance")) {
                alert("Notice: If you modify the letter type of an existing monitor, please check your release date manually.\n\n*) NGHP monitors are now to be released immediately.\n\n*) GHP monitors should be released on the Monday schedule, as normal.\n");
                // $(".mon-field-releasedate").removeAttr("disabled");
            }
            if ($("#lblWorkid").html() != "") {
                if (lt == "GHP") {
                    $(".combo-lettertypes").append('<option selected="selected" value="N/A-GHP">N/A-GHP-N/A-GHP</option>');
                }
                else { //if (lt == "NGHP") {
                    $(".combo-lettertypes").append('<option selected="selected" value="N/A-NGHP">N/A-NGHP-N/A-NGHP</option>');
                    $(".mon-field-releasedate").val($("#lblToday").val());
                    $(".new-release-message").html("* NEW: ALL monitors will be released immediately.").show();
                }
                if (a$.gup("lettertype").indexOf("NGHP") > -1) {
                    $(".combo-lettertypes").append('<option selected="selected" value="N/A-NGHP">N/A-NGHP-N/A-NGHP</option>');
                } else if (a$.gup("lettertype").indexOf("CPN") > -1) {
                    $(".combo-lettertypes").append('<option selected="selected" value="N/A-CPN">N/A-CPN-N/A-CPN</option>');
                } else if (a$.gup("lettertype").indexOf("CPLB_GHP") > -1) {
                    $(".combo-lettertypes").append('<option selected="selected" value="N/A-CPLB">N/A-CPLB-N/A-CPLB</option>');
                } else if (a$.gup("lettertype").indexOf("ORM") > -1) {
                    $(".combo-lettertypes").append('<option selected="selected" value="N/A-CPLB">N/A-CPLB-N/A-CPLB</option>');
                }                
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
    if ($("#lblMode").html() == "new") { //Don't reset if this is an already-saved monitor.
        if (window.location.href.indexOf("&lettertype=GHP") > -1) {
            $('.radio-ghp').prop('checked', true);
            $('input[name="ghp"]').trigger("change");
        }
        else if (window.location.href.indexOf("&lettertype=NGHP") > -1) {
            $('.radio-nghp').prop('checked', true);
            $('input[name="ghp"]').trigger("change");
        }
    }
    if ($("#lblMode").html() == "new") { //Don't reset if this is an already-saved monitor.
        if ($('.cb-cplb').prop('checked') == false) {
            if ($("input[name=ghp]:checked").val() == "GHP") {
                $('.combo-manager').val('JTrujillo2');
            } else if ($("input[name=ghp]:checked").val() == "NGHP") {
                $('.combo-manager').val('MOjeda');
            }
        } else if ($('.cb-cplb').prop('checked') == true) {
            $('.combo-manager').val('dduree');
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
                alert("Thank you for viewing/acknowledging this monitor.");
                //return_to_v1();
            }
        }
        return false;
    });

    $(".mon-submit,.mon-rebuttal,.mon-rebuttalresponse,.mon-coaching,.mon-rebuttal-b,.mon-rebuttalresponse-b,.mon-rebuttal-c,.mon-rebuttalresponse-c").bind("click", function () {
        //TODO: Gather all of your variables to be passed to saveQaForm

        if ($(".ir-question").val() == "Fail") {
            if ($(".combo-correctletter").val() == "") {
                $(".combo-correctletter").css("border-width", "2px");
                $(".combo-correctletter").css("border-color", "red");
                alert('On Fail, Inappropriate Letter selection required');
                return false;
            }
        }

        //Jeff added 2023-11-10:
        var dvpassed = true;
        $(".dv-nonblank").each(function () {
            if ($(this).is(":visible")) {
                if (($(this).val() == "")) {
                    alert($(this).attr("qst") + " cannot be left blank.");
                    $(this).parent().css("border-width", "2px"); //The parent() is specific to the ReasonNotes case.  If more dv-nonblanks are added, this will need revisited.
                    $(this).parent().css("border-color", "red");
                    $(this).parent().css("border-style", "solid");
                    dvpassed = false;
                }
            }
        });
        if (!dvpassed) return false;

        var me = this;
        $(me).hide();

        var mykpi = 84;
        var answers = [];
        var isrebuttal = $(this).hasClass("mon-rebuttal");
        var isrebuttalresponse = $(this).hasClass("mon-rebuttalresponse");

        var isrebuttalb = $(this).hasClass("mon-rebuttal-b");
        var isrebuttalresponseb = $(this).hasClass("mon-rebuttalresponse-b");

        var isrebuttalc = $(this).hasClass("mon-rebuttal-c");
        var isrebuttalresponsec = $(this).hasClass("mon-rebuttalresponse-c");

        var iscoaching = $(this).hasClass("mon-coaching");


        var rebuttalchanged = false;
        var rebuttalresponsechanged = rebuttalresponsesuccesschanged;

        var rebuttalchangedb = false;
        var rebuttalresponsechangedb = rebuttalresponsesuccesschangedb;

        var rebuttalchangedc = false;
        var rebuttalresponsechangedc = rebuttalresponsesuccesschangedc;

        $(".qst").each(function () {
            if ($(this).attr("qst").indexOf("_X") > 0) {
                myval = $(this).html().trim();
            }
            else {
                myval = $(this).val().trim();
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

            if ($(this).attr("qst") == "Rebuttal-b") {
                if ($(me).hasClass("mon-rebuttal-b")) { //Reduced error emails?
                    if ($(this).val() != rebuttalstartvalueb) {
                        rebuttalchangedb = true;
                    }
                }
            }

            if ($(this).attr("qst") == "RebuttalResponse-b") {
                if ($(me).hasClass("mon-rebuttalresponse-b")) { //Reduced error emails?
                    if ($(this).val() != rebuttalresponsestartvalueb) {
                        rebuttalresponsechangedb = true;
                    }
                }
            }

            if ($(this).attr("qst") == "Rebuttal-c") {
                if ($(me).hasClass("mon-rebuttal-c")) { //Reduced error emails?
                    if ($(this).val() != rebuttalstartvaluec) {
                        rebuttalchangedc = true;
                    }
                }
            }

            if ($(this).attr("qst") == "RebuttalResponse-c") {
                if ($(me).hasClass("mon-rebuttalresponse-c")) { //Reduced error emails?
                    if ($(this).val() != rebuttalresponsestartvaluec) {
                        rebuttalresponsechangedc = true;
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

            if ($(this).attr("qst") == "RebuttalMgr-b") {
                myval = myval.replace(/(?:\r\n|\r|\n)/g, "<br>");
            }
            if ($(this).attr("qst") == "RebuttalResponseQA-b") {
                myval = myval.replace(/(?:\r\n|\r|\n)/g, "<br>");
            }

            if (isrebuttalb) {
                if ($(this).attr("qst") == "RebuttalMgr-b") {
                    myval = $("#lblViewer").html();
                }
            }
            if (isrebuttalresponseb) {
                if ($(this).attr("qst") == "RebuttalResponseQA-b") {
                    myval = $("#lblViewer").html();
                }
            }
            if ($(this).attr("qst") == "RebuttalResponseSuccess-b") {
                if ($(this).is(":checked")) {
                    myval = "Yes";
                }
                else {
                    myval = "";
                }
            }

            if ($(this).attr("qst") == "RebuttalMgr-c") {
                myval = myval.replace(/(?:\r\n|\r|\n)/g, "<br>");
            }
            if ($(this).attr("qst") == "RebuttalResponseQA-c") {
                myval = myval.replace(/(?:\r\n|\r|\n)/g, "<br>");
            }

            if (isrebuttalc) {
                if ($(this).attr("qst") == "RebuttalMgr-c") {
                    myval = $("#lblViewer").html();
                }
            }
            if (isrebuttalresponsec) {
                if ($(this).attr("qst") == "RebuttalResponseQA-c") {
                    myval = $("#lblViewer").html();
                }
            }
            if ($(this).attr("qst") == "RebuttalResponseSuccess-c") {
                if ($(this).is(":checked")) {
                    myval = "Yes";
                }
                else {
                    myval = "";
                }
            }

            if ($(this).attr("qst") == "CPLB") {
                if ($(this).is(":checked")) {
                    myval = "CPLB";
                }
                else {
                    myval = "";
                }
            }

            //Jeff added 2023-11-10:
            if ($(this).attr("qst") == "holdBtn") {
                if ($(this).is(":checked")) {
                    myval = "hold";
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
            sqfCode: 61, //66, //Developed as 66, changed to 61.
            kpi: mykpi,
            kpiSet: [84],
            database: "C",
            examinee: $("#lblAgent").html(),
            score: $(".mon-sys-score" + ($(".cb-cplb").eq(0).prop("checked") ? "-cplb" : "")).html().replace("%", ""),
            value: ($(".mon-sys-autofail").html() == "Auto Fail") ? "Auto Fail" : "",
            answers: answers,
            callId: $("#lblCallid").html(),
            workId: $("#lblWorkid").html(), //Performant-Specific
            callDate: $("#lblCalldate").html(),
            callTime: "",
            clientDept: $(".mon-field-clientdept").eq(0).val(),
            acknowledgement: iscoaching ? "NOCHANGE" : ($(".mon-sys-acknowledgementrequired").eq(0).is(":checked") ? "Hold" : false),
            performant: {
                rebuttalchanged: rebuttalchanged || rebuttalchangedb || rebuttalchangedc,
                rebuttalresponsechanged: rebuttalresponsechanged || rebuttalresponsechangedb || rebuttalresponsechangedc
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
            window.location = "//" + a$.urlprefix(true) + "acuityapm.com/monitor/monitor.aspx?prefix=performant";
        }
        else {
            window.location = "//" + a$.urlprefix(true) + "acuityapm.com/monitor/monitor_review.aspx?prefix=performant";
        }
    }

    var allsetup = false;
    //Prosper Selects
    function PERFORMANTsetup() {
        if ($("#lblMode").html() == "new") {
            loadtags();
            $(".mon-table select").each(function () {
                $(this).val("N/A");
                $(this).trigger("change");
            });

            if (a$.gup("lettertype") == "") { //No Lettertype



            if ($("#lblWorkid").html() == "") { //no workid
                $(".combo-lettertypes").append('<option selected="selected" value="N/A-CPN">N/A-CPN-N/A-CPN</option>');
            }
                // if ($("#lblAgentGroupName").html().indexOf("NGHP") >= 0) {
                //     $(".radio-nghp").prop("checked", true);
                //     changeletteridlist(false)
                // }
                // else if ($("#lblAgentGroupName").html().indexOf("GHP") >= 0) {
                //     $(".radio-ghp").prop("checked", true);
                //     changeletteridlist(false)
                // }
                // else {
                //     $(".radio-ghp").prop("checked", true);
                //     changeletteridlist(false)
                // }
            }
            else { //Work id found
                // if ($("#lblWorkid").html().indexOf("ORM") >= 0) { //ORM found = NGHP
                //     $(".radio-nghp").prop("checked", true);
                    // $(".combo-lettertypes").append('<option selected="selected" value="N/A-CPLB">N/A-CPLB-N/A-CPLB</option>');
                    // changeletteridlist(false);
                // }


// <!---------
                if (a$.gup("lettertype").indexOf("NGHP") > -1) {
                    $(".combo-lettertypes").append('<option selected="selected" value="N/A-NGHP">N/A-NGHP-N/A-NGHP</option>');
                } else if (a$.gup("lettertype").indexOf("CPN") > -1) {
                    $(".combo-lettertypes").append('<option selected="selected" value="N/A-CPN">N/A-CPN-N/A-CPN</option>');
                } else if (a$.gup("lettertype").indexOf("CPLB_GHP") > -1) {
                    $(".combo-lettertypes").append('<option selected="selected" value="N/A-CPLB">N/A-CPLB-N/A-CPLB</option>');
                } else if (a$.gup("lettertype").indexOf("ORM") > -1) {
                    $(".combo-lettertypes").append('<option selected="selected" value="N/A-CPLB">N/A-CPLB-N/A-CPLB</option>');
                }                  
// -----------!>


                // else {
                //     $(".radio-ghp").prop("checked", true); //Default is GHP
                //     changeletteridlist(false)
                // }
            }


            
            //}
            /*
            else { //No GHP/NGHP selection made
            $(".combo-lettertypes").empty();
            $(".combo-lettertypes").append('<option value=""></option><option selected="selected" value="N/A-N/A">N/A-N/A</option>');
            }
            */


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
                        if (!qst) qst = "";
                        for (var i in json.form.answers) {
                            if ((json.form.answers[i].friendlyname == qst) || (json.form.answers[i].idquestion == qst)) { //Performant exception, qst must match on either idquestion or friendlyname
                                if (qst == "LetterID") {
                                    $(".radio-ghp").prop("checked", true);
                                    changeletteridlist(false)
                                    $(this).val(json.form.answers[i].answertext);
                                    if ($(this).val() != json.form.answers[i].answertext) {
                                        $(".radio-nghp").prop("checked", true);
                                        changeletteridlist(false)
                                        $(this).val(json.form.answers[i].answertext);
                                    }
                                }
                                else if (qst == "RebuttalResponseSuccess") {
                                    if (json.form.answers[i].answertext == "Yes") {
                                        $(".mon-sys-rebuttalresponsesuccess").prop("checked", true);
                                    }
                                }
                                else if (qst == "RebuttalResponseSuccess-b") {
                                    if (json.form.answers[i].answertext == "Yes") {
                                        $(".mon-sys-rebuttalresponsesuccess-b").prop("checked", true);
                                    }
                                }
                                else if (qst == "RebuttalResponseSuccess-c") {
                                    if (json.form.answers[i].answertext == "Yes") {
                                        $(".mon-sys-rebuttalresponsesuccess-c").prop("checked", true);
                                    }
                                }
                                else if (qst == "CPLB") {
                                    if (json.form.answers[i].answertext == "CPLB") {
                                        $(".cb-cplb").prop("checked", true).trigger("change");
                                    }
                                }
                                else if (qst == "holdBtn") {  //Jeff added 2023-11-10:
                                    if (json.form.answers[i].answertext == "hold") {
                                        $(".mon-sys-hold").prop("checked", true);
                                    }
                                    $(".mon-sys-hold").trigger("change"); //Firing the "change" event doesn't change it (the "click" event would change it).
                                }
                                else if (qst == "ReleaseDate") {
                                    if (json.form.answers[i].answertext == "") {
                                        // //TODO: Make this automatically find next Monday (in the .aspx too, or change how it works).
                                    }
                                    else {
                                        $(this).val(json.form.answers[i].answertext);
                                    }
                                    var d1 = Date.parse($(this).val());
                                    var dw = new Date($(this).val());
                                    var weekendhours = 0;
                                    var dayofweek = dw.getDay(); //const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
                                    switch (dw.getDay()) {
                                        case 0:
                                            weekendhours = 24;
                                            break;
                                        case 3:
                                        case 4:
                                        case 5:
                                        case 6:
                                            weekendhours = 48;
                                            break;
                                        default:
                                    }

                                    weekendhours += 72; //2022-11-04 - Add 2 days temporarily to help clear out those rebuttals that were caught.

                                    var d2 = new Date();
                                    if (d1 < d2.getTime()) {
                                        $(this).attr("disabled", "disabled");
                                    }

                                    d2.setTime(d2 - (((24 - 9) + 24 + 24 + weekendhours) * 60 * 60 * 1000)); //Midnight on Wednesday following the release date (backing up current date to compare).

                                    if (d1 < d2.getTime()) {
                                        $(".mon-field-rebuttal").attr("disabled", "disabled");
                                        $(".mon-field-rebuttal-b").attr("disabled", "disabled");
                                        $(".mon-field-rebuttal-c").attr("disabled", "disabled");
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

                    $(".qst-coaching-timestamp").each(function () {
                        if ($(this).val() != "") {
                            $(this).parent().children().prop("checked", true);
                            $(this).parent().children().prop("disabled", true);
                            $(this).parent().prev().children().prop("disabled", true);
                        }
                    });

                    // var qanotes = $(".mon-field-qanotes").val();
                    // if (qanotes.toLowerCase().indexOf("hold") >= 0) {
                    /* 2022-12-21 - No longer applicable
                    if ($(".mon-field-releasedate").val() != $("#lblNextMonday").val()) {
                    alert("Note: This monitor is on hold with a release date in the past.\n\nThe release date (if you were to release the monitor from hold) will be updated to: " + $("#lblNextMonday").val() + "\n\nYou can change the release date in the field below (lower right) if you want it to be released sooner.");
                    $(".mon-field-releasedate").val($("#lblNextMonday").val());
                    $(".mon-field-releasedate").removeAttr("disabled");
                    }
                    */
                    // }                    

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

                        $(".mon-rebuttal-block-b").show().removeAttr("disabled");

                        $(".mon-field-rebuttal-b").removeAttr("disabled");
                        $("#rebuttalmeb").show().removeAttr("hidden");

                        $(".mon-rebuttalresponse-block-b").show().removeAttr("disabled");
                    }

                    if ($("#rebuttalmeb").is(":visible")) {
                        if ($(".mon-field-rebuttal-b").val() == "") {
                        }
                        else {
                            rebuttalstartvalueb = $(".mon-field-rebuttal-b").val();
                        }
                    }
                    else {
                        // $(".mon-field-rebuttal-b").attr("disabled", "disabled");
                    }
                    if ($(".mon-field-rebuttal-b").val() != "") {
                        $(".mon-sys-rebuttalshow-b").show();
                        $(".mon-sys-rebuttal-stash-b").attr("disabled", "disabled");
                    }

                    if ($(".mon-field-rebuttalresponse-b").val() != "") {

                        $(".mon-rebuttal-block-c").show().removeAttr("disabled");

                        $(".mon-field-rebuttal-c").removeAttr("disabled");
                        $("#rebuttalmec").show().removeAttr("hidden");

                        $(".mon-rebuttalresponse-block-c").show().removeAttr("disabled");

                    }

                    if ($("#rebuttalresponsemeb").is(":visible")) {
                        if ($(".mon-field-rebuttalresponse-b").val() == "") {
                        }
                        else {
                            rebuttalresponsestartvalueb = $(".mon-field-rebuttalresponse-b").val();
                        }
                    }
                    else {
                        $(".mon-field-rebuttalresponse-b").attr("disabled", "disabled");
                    }
                    if ($(".mon-field-rebuttalresponse-b").val() != "") {
                        $(".mon-sys-rebuttalresponseshow-b").show();
                        $(".mon-sys-rebuttalresponse-stash-b").attr("disabled", "disabled");
                    }

                    if ($("#rebuttalmec").is(":visible")) {
                        $("#rebuttalresponsemeb").attr("disabled", "disabled");
                        if ($(".mon-field-rebuttal-c").val() == "") {
                        }
                        else {
                            rebuttalstartvaluec = $(".mon-field-rebuttal-c").val();
                        }
                    }
                    else {
                        $(".mon-field-rebuttal-c").attr("disabled", "disabled");
                    }
                    if ($(".mon-field-rebuttal-c").val() != "") {
                        $(".mon-sys-rebuttalshow-c").show();
                        $(".mon-sys-rebuttal-stash-c").attr("disabled", "disabled");
                    }
                    if ($("#rebuttalresponsemec").is(":visible")) {
                        if ($(".mon-field-rebuttalresponse-c").val() == "") {
                        }
                        else {
                            rebuttalresponsestartvaluec = $(".mon-field-rebuttalresponse-c").val();
                        }
                    }
                    else {
                        $(".mon-field-rebuttalresponse-c").attr("disabled", "disabled");
                    }
                    if ($(".mon-field-rebuttalresponse-c").val() != "") {
                        $(".mon-sys-rebuttalresponseshow-c").show();
                        $(".mon-sys-rebuttalresponse-stash-c").attr("disabled", "disabled");
                    }

                    if (($("#lblMode").html() == "new") && (($("#lblRole").html() == "Admin") || ($("#lblRole").html() == "CorpAdmin") || ($("#lblRole").html() == "Quality Assurance"))) {
                    }
                    else {
                        // $(".mon-show-nonqa").show();
                        $(".mon-show-release-date").html($("#inputReleaseDate").val());
                        //mon - show - release - date
                    }
                    allsetup = true;
                }
                loadtags();
            }

        }
        $(".mon-table tbody").css("height", (window.innerHeight - 120) + "px");
        window.addEventListener("resize", function () {
            $(".mon-table tbody").css("height", (window.innerHeight - 120) + "px");
        });
    }
    PERFORMANTsetup();
    $("#rebuttalme").hide();
    $("#rebuttalmeb").hide();
    $("#rebuttalmec").hide();
    $("#coachme").hide();
    $("#rebuttalresponseme").hide();
    $("#rebuttalresponsemeb").hide();
    $("#rebuttalresponsemec").hide();
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
        $(".mon-rebuttal-block-b").hide();
        $(".mon-rebuttalresponse-block-b").hide();
        $(".mon-rebuttal-block-c").hide();
        $(".mon-rebuttalresponse-block-c").hide();
        $(".mon-show-new").show();
        $(".mon-show-qanotes").show();
        $(".mon-sys-hold").show();
        $("#submitme").show().removeAttr("hidden");
        $("#closeme").show().removeAttr("hidden");
    }
    else if ($("#lblMode").html() == "new") {
        return_to_v1();
    }
    else if (($("#lblRole").html() == "CSR") || ($("#lblAgent").html() == $("#lblViewer").html())) {
        $("#submitme").hide();
        $("select").attr("disabled", "disabled");

        $("textarea").attr("disabled", "disabled"); //
        $(".disposition input").attr("disabled", "disabled");
        $(".mp-lt,.mp-gt").unbind("click");

        $(".mon-field-trendcategory").attr("disabled", "disabled");
        $("#closeme").show().removeAttr("hidden");
        $("#deleteme").hide();
        if ($("#lblAcknowledgementDate").html() != "") {
            $(".mon-show-acknowledgementreceived").show();
        }
        else if ($("#lblAcknowledgementRequired").html() == "Yes") {
            //AUTO-ACKNOWLEDGE
            $(".mon-acknowledge").trigger("click");
            $(".mon-show-acknowledgementreceived").show();
            /*
            $(".mon-show-acknowledgementrequired").show();
            $(".mon-show-isagent").show();
            */

        }
    }
    else if (($("#lblRole").html() != "Admin") && ($("#lblRole").html() != "CorpAdmin") && ($("#lblRole").html() != "Quality Assurance")) {
        $("#submitme").hide();
        $("select").attr("disabled", "disabled");

        $("textarea").attr("disabled", "disabled"); //
        $(".disposition input").attr("disabled", "disabled");
        $(".mp-lt,.mp-gt").unbind("click");
        $(".qst-coaching-comments").removeAttr("disabled");

        $(".mon-field-trendcategory").attr("disabled", "disabled");
        $(".mon-field-rebuttal").removeAttr("disabled");
        $("#rebuttalme").show().removeAttr("hidden");
        $("#coachme").show().removeAttr("hidden");

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
        $(".mon-field-rebuttalresponse-b").removeAttr("disabled");
        $("#rebuttalresponsemeb").show().removeAttr("hidden");
        $(".mon-field-rebuttalresponse-c").removeAttr("disabled");
        $("#rebuttalresponsemec").show().removeAttr("hidden");
        $("#submitme").attr("value", "Update");
        $("#submitme").show().removeAttr("hidden");
        $("#deleteme").show().removeAttr("hidden");
        $("#closeme").show().removeAttr("hidden");
        $(".mon-show-qanotes").show();
        $(".mon-sys-hold").show();

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

