//Base 3
$(document).ready(function () {
    var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
    var acknowledgingnow = false;
    var AgentHasAcknowledged = false;
    var client = $("#lblClient").html();
    var formid = $("#lblFormId").html(); //DONE: Retrieve from qafrm (sqf_code field).
    var mykpi = $("#lblKPI").html();
    var IncomingSupCoachingComplete = "";
    var CreateSidekickEntry = false;

    //Client-side features (csf)
    var csf = {
        AGENT_ACKNOWLEDGEMENTS_ENABLED: true, //Default this to ON.
        DRAFTMODE_ENABLED: false,
        ATTACHMENTS_ENABLED: false,
        ALERTS_ENABLED: false,
        SEND_ALERTS_IF_ENABLED: true,
        NO_KPI: false,
        CDS_ENABLED: true, //If set to false via cds, you can't set it back to true (need mnt override)
        KM2_COMPLIANCE_LOCKOUT: false,
        EXTRA_SCORE_ARRAY: [], //{ class: "ac-scorebottomtotal", kpi: 12 }
        RUN_POSTLOAD: false //For flow monitors, postload is disabled be default and postload_flow is called instead.
    }


    var masterform = false; //Special rules for us auto do not use.
    var htmlflowbuild = false; //Built oddly, so it requires some control vars.
    var htmlflowEditor;

    //HRFLOW - Do markup substitution
    if ($("#lblSqfcode").html() != "48") {
        //alert("debug:substituting markup...");
        if ($(".qst-live-timestamp").length < 1) {
            alert("FLOWSUB ERROR: qst-live-timestamp not found");
        }
        else {
            $(".qst-live-timestamp").each(function () {
                if (!$(this).parents(".cds-html-flow-content").length) {
                    $(this).parent().remove();
                }
            });
            if ($(".agent-review").length < 1) {
                alert("FLOWSUB ERROR: agent-review not found");
            }
            else {
                $(".agent-review").each(function () {
                    if (!$(this).parents(".cds-html-flow-content").length) {
                        $(this).remove();
                    }
                });
                if ($(".sup-coaching").length < 1) {
                    alert("FLOWSUB ERROR: sup-coaching not found");
                }
                else {
                    $(".sup-coaching").each(function () {
                        if (!$(this).parents(".cds-html-flow-content").length) {
                            $(this).remove();
                        }
                    });
                    if ($(".qa-acknowledgement").length < 1) {
                        alert("FLOWSUB ERROR: qa-acknowledgement not found");
                    }
                    else {
                        $(".qa-acknowledgement").each(function () {
                            if (!$(this).parents(".cds-html-flow-content").length) {
                                $(this).remove();
                            }
                        });
                        if ($(".supervisor-acknowledgement").length < 1) {
                            alert("FLOWSUB ERROR: supervisor-acknowledgement not found");
                        }
                        else {
                            $(".supervisor-acknowledgement").each(function () {
                                if (!$(this).parents(".cds-html-flow-content").length) {
                                    $(this).addClass("new-HR-flow");
                                    $(".new-HR-flow").removeClass("supervisor-acknowledgement");
                                }
                            });
                        }
                    }
                }
            }
        }
        if ($(".new-HR-flow").length != 1) {
            alert("HR Flow Initiation Error");
        }
        else {
            $(".new-HR-flow").attr("style", "");
            $(".new-HR-flow").attr("note", "DO NOT EDIT CONTENT HERE");
            $(".new-HR-flow").html($(".cds-html-flow-content").html());
            $(".cds-html-flow-content").html("");
        }
    }
    else {
        masterform = true;
        csf.RUN_POSTLOAD = true;

        alert("Please don't use or test with this monitor, it is for reference only");
        $(".cds-html-flow-content").html("");
        if (a$.exists(window.userFunctionsFLOW)) {
            if (a$.exists(userFunctionsFLOW.client_dv)) {
                userFunctionsFLOW.client_dv = function () { return true; };
            }
            if (a$.exists(userFunctionsFLOW.client_postload)) {
                userFunctionsFLOW.client_postload = function () { return false; };
            }
        }
    }
    //End markup substitution
    var alertComments = "";
    var alertSelect = "";

    //2021-08-06: Change from using .ac-alert-comments to #alertcomment if there is no ac-alert-comments
    var commentselector = ".ac-alert-comments";
    if ($(commentselector).length == 0) {
        commentselector = "#alertcomment";
    }

    /*  ..bad idea
    if (a$.urlprefix() == "km2.") {
    var mytestviewer = $("#lblViewer").html();
    var mytestrole = $("#lblRole").html();
    if (($.cookie("TP1Username") == null) || ($.cookie("TP1Username") == "")) {
    //            alert("You are about to be redirected to a KM2 login screen.\n\nPlease log in first (once per day is sufficient), then click the link in your email again.\n\nIf you receive this message and you didn't click an email link,\nplease send a screenshot to Jeff at jgack@touchpointone.com");
    //            window.location = "http://acuity.km2solutions.net?redirected=1"
    //            return;
    var testing1 = 1;
    }
    }
    */

    if (a$.exists(window.userFunctions)) {
        if (a$.exists(userFunctions.client_setfeatures)) {
            userFunctions.client_setfeatures(csf);
            if (!csf.AGENT_ACKNOWLEDGEMENTS_ENABLED) {
                $("#lblAcknowledgementRequired").html("");  //In case monitor_imprvmnt believes otherwise.
            }
        }
    }
    if (!csf.ALERTS_ENABLED) {
        $(".alert-row").hide();
    }
    else {
        $(".alert-row").show();
    }

    function alertR(msg) {
        alert(msg.replace(/<br \/>/g, "\n"));
    }

    //ATTACHMENTS ********************************

    function setupDownload() {
        $(".attachment-download").unbind().bind("click", function () {
            //alert("debug: download id " + $(this).attr("atid"));

            var loc = window.location.host;
            if (loc.indexOf("localhost", 0) < 0) {
                loc = window.location.protocol + '//' + window.location.host + "/";
            } else {
                loc = window.location.protocol + '//' + window.location.host;
                loc += a$.xss(window.location.pathname).substr(0, a$.xss(window.location.pathname).indexOf(".com") + 5);
            }

            var form = document.createElement("form");
            form.setAttribute("method", "POST");
            var url = loc + "jshandler.ashx?username=" + a$.xss($.cookie("username")) + "&uid=" + a$.xss($.cookie("uid")) + "&lib=qa&cmd=getAttachment&atid=" + $(this).attr("atid") + "&database=C";
            form.setAttribute("action", url);
            form.setAttribute("target", "_blank");
            document.body.appendChild(form);
            form.submit();

            return false;
        });
    }

    //if ($("#lblViewer").html() == "jeffgack") {
    if ($("#lblMode").html() != "new") {
        if (csf.ATTACHMENTS_ENABLED) {
            $(".attachments").show();  //TODO: Attachments need to be universal.
        }
        $("#fileUpload").val("").unbind().bind('change', function () {

            var data = new FormData();

            var files = $("#fileUpload").get(0).files;

            // Add the uploaded image content to the form data collection
            if (files.length > 0) {
                data.append("UploadedImage", files[0]);
            }

            //Special .ajax requirements when sending a document.
            var loc = window.location.host;
            if (loc.indexOf("localhost", 0) < 0) {
                loc = window.location.protocol + '//' + window.location.host + "/";
            } else {
                loc = window.location.protocol + '//' + window.location.host;
                loc += a$.xss(window.location.pathname).substr(0, a$.xss(window.location.pathname).indexOf(".com") + 5);
            }
            var fn = $(this).val();
            if (fn.indexOf("fakepath\\") >= 0) {
                fn = fn.substring(fn.indexOf("fakepath\\") + 9);
            }
            var url = loc + "jshandler.ashx?username=" + a$.xss($.cookie("username")) + "&uid=" + a$.xss($.cookie("uid")) + "&lib=qa&cmd=saveAttachment&monitor_id=" + $("#lblMonitorId").html() + "&filename=" + fn + "&database=C";

            var uploadRequest = $.ajax({
                type: "POST",
                url: url,
                contentType: false,
                processData: false,
                data: data,
                error: function (xhr, status, error) {
                    alert(xhr.responseText);
                }
            });
            uploadRequest.done(function (xhr, textStatus) {
                var json = JSON.parse(xhr);
                $(".attachments-list").append('  <a href="#" class="attachment-download" atid="' + json.id + '">' + fn + '</a>');
                setupDownload();
            });
        });
    }
    setupDownload();

    //END ATTACHMENTS **************************


    //ACKNOWLEDGEMENT (Base)
    $(".ac-acknowledge").bind("click", function () {
        //SAVE THE MONITOR as part of this process.
        acknowledgingnow = true;
        $(".ac-submit").trigger("click"); //Saves everything in place.
        return false;
    });

    function harvestQuestions() {
        var mans = { answers: [], multiple: [] };
        $(".qst").each(function () {
            var myval = $(this).val();
            if (typeof myval === "string") {
                myval = myval.replace(/(?:\r\n|\r|\n)/g, '|');
                myval = myval.replace(/\t/g, ' ');
                myval = myval.replace(/\\/g, ' ESCAPE ');
                //TODO: See about eliminating all non-printable characters.
                myval = myval.replace(/[^ -~]+/g, "*");

            }
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
                    if ((a$.urlprefix() == "km2.") && (IncomingSupCoachingComplete != "Yes")) {
                        if ($(this).attr("qst") == "SupCoachingComplete") {
                            if (myval == "Yes") {
                                CreateSidekickEntry = true;
                                //alert("debug: creating sidekick entry");
                            }
                        }
                    }
                    //DEBUG:
                    //alert("debug:createsidekickentry as a test");
                    //CreateSidekickEntry = true;
                }
                else if ($(this).attr("type") == "radio") {
                    myval = $('input[name="' + $(this).attr("name") + '"]:checked').val();
                    if (!a$.exists(myval)) {
                        myval = "";
                    }
                }

            }
            else if ($(this).is("span")) {
                myval = $(this).html();
            }

            if (a$.urlprefix() == "km2.") {
                switch ($(this).attr("qst").toString().toLowerCase()) {
                    case "account#":
                    case "acct#":
                    case "acctnum":
                        if ($("#lblMode").html() == "new") {
                            myval = "691" + myval;
                        }
                        else if (myval.substr(0, 3).toString() != "691") {
                            myval = "691" + myval;
                        }
                    default:
                }
            }

            mans.answers.push({ friendlyname: $(this).attr("qst"), answertext: myval, score: 0, value: '', version: 0 });
        });
        return mans;
    }

    //SUBMIT (Base)

    $(".ac-submit").bind("click", function () {

        if (a$.urlprefix(true).indexOf("mnt") == 0) {
            if (a$.gup("state") != "") {
                alert("Please don't save a test state.");
                return false;
            }
        }
        var dvpassed = true;
        $(".dv-number").each(function () {
            if (isNaN($(this).val())) {
                alert("Only numbers are allowed in the field: " + $(this).attr("qst"));
                dvpassed = false;
            }
        });
        $(".dv-select").each(function () {
            if ($(this).is(":visible")) {
                if ($(this).attr("disabled") != "disabled") {
                    if (($(this).val() == null) || ($(this).val() == "")) {
                        alert("Please select an item from the list: " + $(this).attr("qst"));
                        dvpassed = false;
                    }
                }
            }
        });
        $(".dv-nonblank").each(function () {
            if ($(this).is(":visible")) {
                if (($(this).val() == "")) {
                    alert($(this).attr("qst") + " cannot be left blank.");
                    $(this).css("border-width", "2px");
                    $(this).css("border-color", "red");
                    dvpassed = false;
                }
            }
        });
        $(".dv-nonblank").each(function () {
            if ($(this).is(":visible")) {
                if (($(this).val() == "")) {
                    alert($(this).attr("qst") + " cannot be left blank.");
                    $(this).css("border-width", "2px");
                    $(this).css("border-color", "red");
                    dvpassed = false;
                }
            }
        });

        if (dvpassed) {
            try {
                if (a$.exists(window.userFunctions)) {
                    if (a$.exists(userFunctions.client_dv)) {
                        dvpassed = userFunctions.client_dv();
                    }
                }
                if (dvpassed) {
                    if (a$.exists(window.userFunctionsFLOW)) {
                        if (a$.exists(userFunctionsFLOW.client_dv)) {
                            dvpassed = userFunctionsFLOW.client_dv();
                        }
                    }
                }
            }
            catch (err) {
            }
        }

        $(".dv-mmss,.dv-hhmmss").each(function () {
            if ($(this).is(":visible")) {
                var mmssbad = false;
                if ($(this).val() == null) {
                    mmssbad = true;
                }
                else if (!$(this).val().match(/^([0-1]?\d|2[0-3])(?::([0-5]?\d))?(?::([0-5]?\d))$/)) {
                    mmssbad = true;
                }
                if (mmssbad) {
                    alert("Please enter a value in MM:SS format");
                    $(this).css("border-width", "2px");
                    $(this).css("border-color", "red");
                    dvpassed = false;
                }
            }
        });
        $(".dv-date").each(function () {
            if ($(this).is(":visible")) {
                var mmssbad = false;
                if ($(this).val() == null) {
                    mmssbad = true;
                }
                else if (!$(this).val().match(/^(?:(?:(?:0?[13578]|1[02])(\/|-|\.)31)\1|(?:(?:0?[1,3-9]|1[0-2])(\/|-|\.)(?:29|30)\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:0?2(\/|-|\.)29\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:(?:0?[1-9])|(?:1[0-2]))(\/|-|\.)(?:0?[1-9]|1\d|2[0-8])\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/)) {
                    mmssbad = true;
                }
                if (mmssbad) {
                    alert("Please enter a date value in MM//DD/YYYY format");
                    $(this).css("border-width", "2px");
                    $(this).css("border-color", "red");
                    dvpassed = false;
                }
            }
        });



        if (!dvpassed) return false;

        //Prohibit re-submission.
        $(".ac-submit,.ac-delete,.ac-draft,.ac-close").hide();
        $(".ac-close").parent().append("Please wait...");

        if ((a$.urlprefix() == "km2.") && ($("#lblMode").html() == "new")) {
            var bld = '<div style="z-index:1000000;font-size:16px;font-weight:bold;position:fixed;top: 50%;left: 50%;height:320px;width:400px;margin-top:-160px;margin-left:-200px;border: 4px solid red;background-color:white;text-align:center;">';
            bld += '  <div class="save-confirmation" style="margin:30px;display:block;">';
            bld += "Please Wait<br />for save confirmation..";
            bld += '<div style="margin-top:10px;font-weight:normal;color:red;font-weight:bold;font-size:13px;">If monitors take more than 30 seconds to save,<br />please report it to your manager.</div>';
            bld += "  </div>";
            bld += "</div>";
            $("body").prepend(bld);
        }

        //Gather all of your variables to be passed to saveQaForm
        if ($(this).hasClass("ac-draft")) {
            if (!$(".ac-islive").is(":checked")) {
                $(".ac-islive").prop("checked", false);
            }
        }
        else {
            if (!$(".ac-islive").is(":checked")) {
                var d = new Date();
                $(".qst-timestamp-islive").val("~TIMESTAMP~");  //(d.toLocaleDateString() + " " + d.toLocaleTimeString()).replace(/\?/g, ""));
            }
            $(".ac-islive").prop("checked", true);
        }

        var mans = harvestQuestions();

        /*

        //Assemble multi-sections and their children.
        mans = {
        answers: [], //1-to-1 answers regardless of section (no Multiple attribute).
        multiple: [ //Regular situation with 1 to many
        {sec: 35, answers: [] },
        { sec: 35, answers: [] }
        ],
        multiple: [ //Cascading 1 to many
        {
        sec: 35,
        answers: [],
        multiple: [
        { sec: 37, answers: [] },
        { sec: 37, answers: [] }
        ]
        }
        ]
        };
        */

        //DONE: Make a general way to do traverse.  I need to set this up specifically based on the wrappers in the interest of time.


        var thekpi = mykpi; //The kpi_id from monitor_sqfcode (this SHOULD be the default).
        thekpi = "Text:Quality"; //Should be specified in userFunctions, BUT is the default in the interim.
        if (a$.gup("sup") == "true") {
            thekpi = "Text:Supervisor QA";
        }
        if (a$.exists(window.userFunctions)) {
            if (a$.exists(userFunctions.client_getkpi)) {
                thekpi = userFunctions.client_getkpi();
            }
        }
        if (csf.NO_KPI) {
            thekpi = "none";
        }

        //TODO: Update all javascripts of past monitors to have a client_getkpi which returns "Text:Quality".


        var alerts = { comments: "", list: [] };
        if (csf.ALERTS_ENABLED) {
            if (csf.SEND_ALERTS_IF_ENABLED) {
                if ((alertComments != $(commentselector).val()) || (JSON.stringify(alertSelect) != JSON.stringify($(".ac-alert").val()))) { //Send out alerts only if they have changed.
                    alerts.comments = $(commentselector).val();
                    if ($(".ac-islive").is(":checked")) {
                        if ($(".ac-alert").val() != "") {
                            //TODO: Be sure alerts haven't been sent before (or whatever the rule is).
                            $(".ac-alert option:selected").each(function () {
                                alerts.list.push({ distro: $(this).attr("distro"), value: $(this).attr("value") });
                            });
                        }
                    }
                }
            }
        }

        if (false) { //Example
            csf.EXTRA_SCORE_ARRAY = [
                { selector: ".ac-scorebottomtotal", kpi: 12 },
                { selector: ".ac-scorelefttotal", kpi: 10 },
                { selector: ".ac-scorerighttotal", kpi: 11 }
            ];
        }

        if (csf.EXTRA_SCORE_ARRAY.length) {
            for (var s in csf.EXTRA_SCORE_ARRAY) {
                if (!csf.EXTRA_SCORE_ARRAY[s].val) {
                    csf.EXTRA_SCORE_ARRAY[s].score = $(csf.EXTRA_SCORE_ARRAY[s].selector).html();
                }
                else {
                    csf.EXTRA_SCORE_ARRAY[s].score = $(csf.EXTRA_SCORE_ARRAY[s].selector).val();
                }
            }
        }

        //2021-07-29: Remove acknowledgement request from Calibration Monitors

        if (a$.gup("sup") == "true") {
            csf.AGENT_ACKNOWLEDGEMENTS_ENABLED = false;
            csf.ALERTS_ENABLED = false;
            csf.EXTRA_SCORE_ARRAY = [];
        }

        var data = {
            lib: "qa",
            cmd: "saveQaForm",
            formId: formid,
            sqfCode: $("#lblSqfcode").html(),
            kpi: thekpi,
            database: "C",
            examinee: $("#lblAgent").html(),
            score: $(".ac-score").html().replace("%", ""),
            extrascores: csf.EXTRA_SCORE_ARRAY,
            value: ($(".ac-autofail").eq(0).css("display") != "none") ? "Auto Fail" : "",
            //answers: answers,
            mans: mans,
            callId: $("#lblCallid").html(),
            callDate: $("#lblCalldate").html(),
            callTime: "",
            clientDept: "",
            acknowledgement: csf.AGENT_ACKNOWLEDGEMENTS_ENABLED,
            alerts: csf.ALERTS_ENABLED ? alerts : "",
            createsidekickentry: CreateSidekickEntry

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
                alertR("ERROR:" + json.msg);
                client_action_init(); //Show the buttons again.
            }
            else {
                if ((a$.urlprefix() == "km2.") && ($("#lblMode").html() == "new")) {

                    //alert("debug:pause to see wait prompt"); return;

                    var bld = "<b>Monitor Saved</b><br/><br/>";
                    bld += '<div style="text-align:left;font-weight:normal;">';
                    bld += "Agent: <b>" + json.examinee + "</b><br />";
                    bld += "Call ID<b>: " + json.callId + "</b><br />";
                    bld += "Call Date: " + json.callDate + "<br />";
                    var d = new Date();
                    try {
                        bld += "Save Time (local): " + d.toLocaleString() + "<br />";
                    }
                    catch (e) {
                        bld += "Save Time (local): Not Captured <br />";
                    }
                    bld += "Monitor ID: <b>" + json.monitorId + "</b><br />";
                    bld += "</div>";
                    //bld += "<br />Monitor ID: " + json.monitorId;
                    bld += '<div style="margin-top:10px;font-weight:normal;color:red;font-weight:bold;font-size:13px;">If the Name and Call ID don\'t match your form,<br />or if you don\'t see a Monitor ID above,<br />please STOP inputting monitors<br />and report it to your manager.</div>';
                    bld += '<br /><input type="button" class="confirm-save" value="Confirm Save"/>';
                    $(".save-confirmation").html(bld);
                    $(".confirm-save").bind("click", function () {
                        //alert("debug:save confirmation clicked"); return;
                        return_to_v1();
                    });
                }
                else {
                    if (!acknowledgingnow) {
                        return_to_v1();
                    }
                    else {
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
                                alertR("ERROR:" + json.msg);
                            }
                            else {
                                alert("Monitor Acknowledged, Thank You.");
                                return_to_v1();
                            }
                        }
                    }
                }
            }
        }
        return false;
    });

    $(".ac-close").bind("click", function () {
        return_to_v1();
        return false;
    });

    $(".ac-delete").bind("click", function () {
        if (a$.urlprefix(true).indexOf("mnt") == 0) {
            if (a$.gup("state") != "") {
                alert("Please don't delete a test state.");
                return false;
            }
        }

        function finishdeletion(deletereason) {
            if (a$.exists(window.userFunctions)) {
                if (a$.exists(userFunctions.client_getkpi)) {
                    if ((a$.urlprefix() == "ers.") || (a$.urlprefix() == "ces.") || (a$.urlprefix() == "act.") || (a$.urlprefix() == "rcm.")) {
                        if (userFunctions.client_getkpi() == "Text:Core QA") {
                            //Note - only going for EXISTENCE of this array so all found KPIs will be removed.
                            csf.EXTRA_SCORE_ARRAY = [{ kpi: 0, score: 0}];
                        }
                    }
                }
            }
            var data = {
                lib: "qa",
                cmd: "deleteQaForm",
                deletereason: deletereason,
                formId: formid,
                extrascores: csf.EXTRA_SCORE_ARRAY, //Passed to signal to remove multiple kpis.
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
                    alertR("ERROR:" + json.msg);

                }
                else {
                    return_to_v1();
                }
            }
        }

        if (a$.urlprefix() == "km2.") {
            var bld = '<div class="delete-confirmation-wrapper" style="z-index:1000000;font-size:16px;font-weight:bold;position:fixed;top: 50%;left: 50%;height:320px;width:400px;margin-top:-160px;margin-left:-200px;border: 4px solid red;background-color:white;text-align:center;">';
            bld += '  <div class="delete-confirmation" style="margin:30px;display:block;">';
            bld += "Delete this Monitor?";
            bld += '<div style="margin-top:10px;font-weight:normal;font-weight:bold;font-size:13px;">Please provide a reason below:</div>';
            bld += '<textarea style="margin:10px;width:250px;height:50px;" class="delete-reason"></textarea><br /><input type="button" class="delete-confirm" style="background-color:lightgray;" value="Delete" />&nbsp;&nbsp;<input type="button" class="delete-cancel" value="Cancel" />';
            bld += '<div class="delete-dv" style="text-align: center; font-size:11px; color:red;margin-top:20px;"></div>';
            bld += "  </div>";
            bld += "</div>";

            $("body").append(bld);
            $(".delete-reason").unbind().bind("keyup", function () {
                if ($(this).val().length > 3) {
                    $(".delete-confirm").css("background-color", ""); //.attr("disabled", "");
                }
                else {
                    $(".delete-confirm").css("background-color", "lightgray"); //.attr("disabled", "disabled");
                }
            });
            $(".delete-cancel").unbind().bind("click", function () {
                $(".delete-confirmation-wrapper").remove();
                return false;
            });
            $(".delete-confirm").unbind().bind("click", function () {
                if ($(".delete-reason").val().length <= 3) {
                    $(".delete-dv").html("Deletion reason must contain at least 4 characters");
                }
                else if ($(".delete-reason").val().length > 190) {
                    $(".delete-dv").html("Deletion reason must contain less than 200 characters");
                }
                else {
                    finishdeletion($(".delete-reason").val());
                }
                return false;
            });
        }
        else {
            if (confirm("Are you sure you want to delete this monitor?")) {
                finishdeletion();
            }
        }
        return false;
    });

    function return_to_v1() {
        //Correct way - with Origin
        if (a$.gup("origin") == "report") {
            window.close();
        }
        else if ((a$.urlprefix() == "km2.") && ($("#lblAgent").html() == $("#lblViewer").html())) {
            window.close(); //Agents are not allowed in the back end.
        }
        else if ($("#lblMode").html() == "new") {
            window.location = "//" + a$.urlprefix(true) + "acuityapm.com/monitor/monitor.aspx?prefix=" + a$.urlprefix().split(".")[0];
        }
        else {
            window.location = "//" + a$.urlprefix(true) + "acuityapm.com/monitor/monitor_review.aspx?prefix=" + a$.urlprefix().split(".")[0];
        }
    }


    $(".ac-comments").bind("change", function () {
        //Eliminate carriage returns right here.
        $(this).val($(this).val().replace(/(?:\r\n|\r|\n)/g, " "));
        $(this).val($(this).val().replace(/\\/g, " ESCAPE "));
    });


    var form_answers = null;

    function form_load_answers() {
        $(".delete-li").unbind().bind("click", function () {
            $(this).parent().remove();

            setscore();

        });
        var fa = form_answers;
        $("select").each(function () {
            qst = $(this).attr("qst");
            if (!$("option", this).length) { //Not loaded, do initial load.
                bld = '<option value="">..</option>';
                for (var i in fa) {
                    if (fa[i].qst == qst) {
                        if (fa[i].parentQst == "") {
                            bld += '<option score="' + fa[i].score + '" value="' + fa[i].value + '">' + fa[i].text + '</option>';
                        }
                    }
                }
                $(this).append(bld);
                $(this).val("");
                $(this).bind("change", function () {
                    var myqst = $(this).attr("qst");
                    var myans = $(this).val();
                    var mychildqst = "";
                    var foundchild = false;
                    var foundchildtrigger = false;
                    for (var i in fa) {
                        if (fa[i].parentQst == myqst) {
                            foundchild = true;
                            mychildqst = fa[i].qst;
                            if (fa[i].parentAnswer == myans) {
                                foundchildtrigger = true;
                                $("select", $(this).parent().parent()).each(function () {
                                    if ($(this).attr("qst") == mychildqst) {
                                        bld = '<option value="">..</option>';
                                        for (var j in fa) {
                                            if (fa[j].parentQst == myqst) {
                                                if (fa[j].parentAnswer == myans) {
                                                    bld += '<option score="' + fa[i].score + '" value="' + fa[j].value + '">' + fa[j].text + '</option>';
                                                }
                                            }
                                        }
                                        $(this).empty().append(bld);
                                    }
                                });
                                break;
                            }
                        }
                    }
                    if (foundchild && (!foundchildtrigger)) {
                        $("select", $(this).parent().parent()).each(function () {
                            if ($(this).attr("qst") == mychildqst) {
                                bld = '<option value="">..</option>';
                                $(this).empty().append(bld);
                            }
                        });
                    }
                    if (($(this).attr("qst") == "Category") || ($(this).attr("qst") == "Subcategory")) {
                        //Check the line score.
                        var score = -1;
                        $("select option:selected", $(this).parent().parent()).each(function () {
                            if ($(this).attr("score") != null) {
                                score = $(this).attr("score");
                            }
                        });
                        if (score >= 0) {
                            $("input", $(this).parent().parent()).each(function () {
                                if ($(this).attr("qst") == "FindingPoints") {
                                    $(this).val(score);
                                    setscore();
                                }
                            });
                        }
                        //Check the call rollup score.
                    }
                });
            }
        });
    }


    function client_action_init() {

        //If you're the agent.
        var AgentAcknowledgementRequired = true;
        var nodraftview = false;
        if (($("#lblRole").html() == "CSR") || ($("#lblAgent").html() == $("#lblViewer").html())) {
            nodraftview = true;
            if (AgentAcknowledgementRequired) {

            }
        }

        if (csf.DRAFTMODE_ENABLED) { //Draft view is disabled for now.
            if (nodraftview) {
                if (!$(".ac-islive").is(":checked")) {
                    alert("This monitor is in draft mode and not ready to view.\nIt may be released at a later date.");
                    return_to_v1();
                }
                else {
                    $(".ac-view").show();
                }
            }
            else {
                $(".ac-view").show();
            }

            if (!$(".ac-islive").is(":checked")) {
                $(".ac-draft").show();
            }
            else {
                $(".ac-draft").hide();
            }
        }
        else {
            $(".ac-draft").hide();
            $(".ac-view").show();
        }
    }

    function client_load_init(mans) {
        //CUSTOM: Special loading code, including the loading of multiples.
        buttonsforanswers();
        //CUSTOM: Alert behavior
        if (csf.ALERTS_ENABLED) {
            alertComments = $(commentselector).val();
            alertSelect = $(".ac-alert").val();
        }

        client_action_init();
        init_control();

        if (a$.exists(window.userFunctions)) {
            if (csf.RUN_POSTLOAD) {
                if (a$.exists(userFunctions.client_postload)) {
                    userFunctions.client_postload();
                }
            }
        }
        if (a$.exists(window.userFunctionsFLOW)) {
            if (a$.exists(userFunctionsFLOW.client_postload)) {
                userFunctionsFLOW.client_postload();
            }
        }
        if ((a$.urlprefix(true).indexOf("mnt") == 0) && ((a$.gup("harvest") == "debug") || (a$.gup("harvest") == "save"))) {
            harvestquestiontext();
        }

        return;
    }

    function harvestquestiontext() {
        var abort = false;
        var hqs = [];
        var cnt = 0;
        $(".qst").each(function () {
            if (!abort) {
                var friendlyname = $(this).attr("qst");
                var questiontext = "";
                if ($(this).parent().prop("tagName").toLowerCase() == "dd") {
                    if ($(this).parent().prev().prop("tagName").toLowerCase() == "dt") {
                        questiontext = $(this).parent().prev().html();
                    }
                }
                else if ($(this).parent().prop("tagName").toLowerCase() == "th") {
                    if ($(this).parent().prev().prop("tagName").toLowerCase() == "th") {
                        questiontext = $(this).parent().prev().html();
                    }
                }
                else if ($(this).parent().prop("tagName").toLowerCase() == "td") {
                    try {
                        //if ($(this).parent().prev().prev().prop("tagName").toLowerCase() == "td") { //2 hops.  TODO: Generalize with TDHOP
                        //    questiontext = $(this).parent().prev().prev().html(); //TODO:
                        if ($(this).parent().prev().prop("tagName").toLowerCase() == "td") { //2 hops.  TODO: Generalize with TDHOP
                            questiontext = $(this).parent().prev().html(); //TODO:
                        }
                    }
                    catch (e) { }
                }
                if (questiontext == "") {
                    var foundit = false;
                    $(".qlab").each(function () {
                        if (!foundit) {
                            if ($(this).attr("qlab") != null) {
                                if (friendlyname == $(this).attr("qlab")) {
                                    questiontext = $(this).html();
                                    //alert("debug: qlab match for qst " + friendlyname + " = " + questiontext);
                                    foundit = true;
                                }
                            }
                        }
                    });
                }
                //if (a$.gup("harvest") == "debug") {
                if (questiontext == "") {
                    if (!confirm("harvest test: qst:" + friendlyname + ", text: " + questiontext)) abort = true; //only IsLive found for first test!
                }
                //}
                hqs.push({ friendlyname: friendlyname, text: questiontext });
                cnt += 1;
            }
        });
        if (!abort) {
            alert("" + cnt + " questions found.");
        }
        if (!abort && (a$.gup("harvest") == "save")) {
            if (confirm("Save text records for " + cnt + " found QSTs?")) {
                var data = {
                    lib: "qa",
                    cmd: "harvestQuestionText",
                    formId: formid,
                    hqs: hqs,
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
                    success: harvested
                });
                function harvested(json) {
                    //alert("debug:monloaded");
                    if (a$.jsonerror(json)) {
                        alertR("ERROR:" + json.msg);
                    }
                    else {
                        alert("Question Text Harvested");
                    }
                }
            }
        }
    }

    function load() {
        if (form_answers != null) {
            form_load_answers();
        }
        //TODO: Decide if I'm going to make an untethered score for the qstcats or have New and other both wait on a separate call to retrieve the qstcats.
        var data2 = {
            lib: "qa",
            cmd: "getQaClientQuestionCategoryNames",
            formId: formid
        };
        a$.ajax({
            type: "POST",
            service: "JScript",
            async: true,
            data: data2,
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: gotcats
        });
        function gotcats(json) {
            if (json.cats) {
                for (var c in json.cats) {
                    $(".qst").each(function () {
                        var qst = $(this).attr("qst");
                        if (json.cats[c].friendlyname == qst) {
                            $(this).attr("qstcat", json.cats[c].ClientQuestionCategoryName);
                        }
                    });
                }
                setscore();
            }
        }
        if ($("#lblMode").html() == "new") {
            if (csf.KM2_COMPLIANCE_LOCKOUT) {
                if ($("#lblComplianceAllowed").html() != "Yes") {
                    alert("Compliance monitor access is restricted.");
                    return_to_v1();
                }
            }
            client_load_init();
            return;
        }

        if ($("#lblAgentTest").html() == "Yes") { //Logic for this is all server-side.
            if ($("#lblAgentLockout").html() == "Yes") {
                //2022-10-27 - No warning here: alert("Monitor access is restricted.");
                return_to_v1();
            }
        }

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
                alertR("ERROR:" + json.msg);
            }
            else {
                if (!a$.exists(json.form.mans)) { //For backward compatibility
                    json.form.mans = { answers: json.form.answers, multiple: [] };
                }
                //Attachments first
                for (var i in json.attachments) {
                    $(".attachments-list").append('&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" class="attachment-download" atid="' + json.attachments[i].id + '">' + json.attachments[i].filename.replace(/ -/g, "&nbsp;") + '</a>');
                }
                setupDownload();

                var qstnf = [];

                //DONE: Load the cascading form
                $(".qst").each(function () {
                    var qst = $(this).attr("qst");
                    var nf = true;
                    for (var i in json.form.mans.answers) {
                        if (json.form.mans.answers[i].friendlyname == qst) {
                            nf = false;
                            if ($(this).attr("type") == "checkbox") {
                                if (json.form.mans.answers[i].answertext == "Yes") {
                                    $(this).prop("checked", true);
                                }
                                if (a$.urlprefix() == "km2.") {
                                    if (qst == "SupCoachingComplete") {
                                        IncomingSupCoachingComplete = json.form.mans.answers[i].answertext;
                                    }
                                }
                            }
                            else if ($(this).attr("type") == "radio") {
                                $('input[name="' + $(this).attr("name") + '"]').each(function () {
                                    if ($(this).val() == json.form.mans.answers[i].answertext) {
                                        $(this).prop("checked", true);
                                    }
                                });
                            }
                            else if ($(this).attr("multiple") == "multiple") {
                                var me = this;
                                $.each(json.form.mans.answers[i].answertext.split(","), function (i, e) {
                                    $("option[value='" + e + "']", me).prop("selected", true);
                                });
                            }
                            else {
                                if (typeof json.form.mans.answers[i].answertext === "string") json.form.mans.answers[i].answertext = json.form.mans.answers[i].answertext.replace(/\|/g, "\n")
                                $(this).val(json.form.mans.answers[i].answertext);
                            }
                            break;
                        }
                    }
                    if (nf) {
                        qstnf.push(qst);
                    }
                });

                if ($("#lblRole").html() == "Admin") {
                    if (qstnf.length) {
                        $(".ui-setup-orphan-qsts").show();
                        var oql = "";
                        for (var q in qstnf) {
                            oql += qstnf[q] + "&nbsp; "
                        }
                        $(".ui-orphan-qst-list").html(oql);
                        $(".ui-setup-form").show();
                    }
                }

                client_load_init(json.form.mans); //TODO: Fake for now, put in after GetQAForm base work.
            }
        }
    }

    function init() {
        //*********************************** Content Management Section ************************
        if (csf.CDS_ENABLED && ((a$.urlprefix(true).indexOf("mnt") == 0) /* && ($.cookie("TP1Role") == "Admin") */)) {
            var bodyprefix = "MONITOR.";
            $(".cds-editors").hide();
            var cssEditor = CodeMirror(document.getElementById("CDS_CSSEditor"), {
                lineNumbers: true,
                mode: "css",
                autoRefresh: true,
                extraKeys: { "Ctrl-Space": "autocomplete" },
                value: document.getElementById("CDS_CSSContent").innerHTML
            });
            //2023-02-13 REMOVED: $(".cds-css-editor").show();

            var htmlEditor = CodeMirror(document.getElementById("CDS_HTMLEditor"), {
                lineNumbers: true,
                mode: "text/html",
                autoRefresh: true,
                extraKeys: { "Ctrl-Space": "autocomplete" },
                value: document.getElementById("CDS_HTMLContent").innerHTML
            });
            //2023-02-13 REMOVED: $(".cds-html-editor").show();


            function leftright(me, mylist, myidx) {
                function arrows() {
                    $(".ac-cds-date", me).html(mylist[myidx]);
                    if (myidx <= 0) {
                        $(".ac-cds-right", me).css("color", "#F0F0F0");
                    }
                    else {
                        $(".ac-cds-right", me).css("color", "black");
                    }
                    if (myidx >= (mylist.length - 1)) {
                        $(".ac-cds-left", me).css("color", "#F0F0F0");
                    }
                    else {
                        $(".ac-cds-left", me).css("color", "black");
                    }
                }
                $(".ac-cds-left", me).unbind().bind("click", function () {
                    myidx += 1;
                    if (myidx >= mylist.length) myidx = mylist.length - 1;
                    arrows();
                });
                $(".ac-cds-right", me).unbind().bind("click", function () {
                    myidx -= 1;
                    if (myidx < 0) myidx = 0;
                    arrows();
                });
                $(".ac-cds-right", me).trigger("click");
            }

            var htmlList = [
                "2020-06-08 15:59:07.000 (Current)",
                "2020-06-08 15:53:43.000",
                "2020-06-08 15:23:45.000",
                "2020-06-08 15:23:05.000"
            ];
            var htmlIdx = 1;
            leftright($(".cds-html-editor").eq(0), htmlList, htmlIdx);

            var cssList = [
                "last",
                "Next",
                "2020-06-08 15:23:45.000",
                "First"
            ];
            var cssIdx = 1;
            leftright($(".cds-css-editor").eq(0), cssList, cssIdx);

            var jsEditor = CodeMirror(document.getElementById("CDS_JSEditor"), {
                lineNumbers: true,
                mode: "javascript",
                autoRefresh: true,
                extraKeys: { "Ctrl-Space": "autocomplete" },
                value: document.getElementById("CDS_JSContent").innerHTML
            });
            //2023-02-13 REMOVED: $(".cds-js-editor").show();

            $(".cds-save").hide();

            htmlflowbuild = false;
            /*
            $("#CDS_HTMLFLOWContent").html($(".new-HR-flow").html());
            var htmlflowEditor = CodeMirror(document.getElementById("CDS_HTMLFLOWEditor"), {
            lineNumbers: true,
            mode: "text/html",
            autoRefresh: true,
            extraKeys: { "Ctrl-Space": "autocomplete" },
            value: document.getElementById("CDS_HTMLFLOWContent").innerHTML
            });
            $(".cds-htmlflow-editor").show();
            */

            var cssflowEditor = CodeMirror(document.getElementById("CDS_CSSFLOWEditor"), {
                lineNumbers: true,
                mode: "css",
                autoRefresh: true,
                extraKeys: { "Ctrl-Space": "autocomplete" },
                value: document.getElementById("CDS_CSSFLOWContent").innerHTML
            });
            $(".cds-cssflow-editor").show();

            var jsflowEditor = CodeMirror(document.getElementById("CDS_JSFLOWEditor"), {
                lineNumbers: true,
                mode: "javascript",
                autoRefresh: true,
                extraKeys: { "Ctrl-Space": "autocomplete" },
                value: document.getElementById("CDS_JSFLOWContent").innerHTML
            });
            $(".cds-jsflow-editor").show();

            $(".ac-cds-hideshow").unbind().bind("click", function () {
                if ($(this).html() == "show") {
                    $(".ac-cds", $(this).parent().parent()).show();
                    $(this).html("hide");
                }
                else {
                    $(".ac-cds", $(this).parent().parent()).hide();
                    $(this).html("show");
                }
            });
            $(".ac-cds-hideshow").html("hide").each(function () { $(this).trigger("click"); });

            $(".cds-fiddle").show().unbind().bind("click", function () {
                if ($("#lblMode").html() != "new") {
                    alert("Please edit fiddles in a 'New' form, not in an existing monitor.");
                }
                else {
                    if (!masterform) {
                        if (!htmlflowbuild) {
                            $("#CDS_HTMLFLOWContent").html($(".new-HR-flow").html());
                            htmlflowEditor = CodeMirror(document.getElementById("CDS_HTMLFLOWEditor"), {
                                lineNumbers: true,
                                mode: "text/html",
                                autoRefresh: true,
                                extraKeys: { "Ctrl-Space": "autocomplete" },
                                value: document.getElementById("CDS_HTMLFLOWContent").innerHTML
                            });
                            $(".cds-htmlflow-editor").show();
                            htmlflowbuild = true;
                        }
                    }

                    if ($(".cds-editors").eq(0).css("display") == "none") {
                        $(".cds-editors").show();
                        if (masterform) {
                            $(".cds-cssflow-editor").hide();
                            $(".cds-jsflow-editor").hide();
                            $(".cds-htmlflow-editor").hide();
                            $(".cds-save-flow").hide();
                        }
                    }
                    else {
                        $(".cds-editors").hide();
                    }
                }
            });
            $(".cds-save").unbind().bind("click", function () {

                //2023-02-13 - Disabled:
                alert("NON-FLOW content saves on FLOW monitors has been disabled.\nPlease change the url from '3F' to '3' to make the edits.");
                return false;

                var passedtests = true;
                //Add "failsafes" to be sure the content isn't outside of the block.
                if (htmlEditor.getValue().indexOf('id="lblSupervisor"') > 0) {
                    alert("ERROR: Your HTML content is reaching outside of the content area.\n\nThis can be caused by malformed HTML tags\n(a missing closing </div>, for example).\n\nPlease review the html content and remove the excess content.\nIf you need assistance, please contact Jeff Gack.");
                    passedtests = false;
                }
                if (passedtests) {
                    var data = {
                        lib: "qa",
                        cmd: "saveCDS",
                        bodyid: bodyprefix + $("#lblClient").html() + "." + $("#lblSqfcode").html(),
                        tagid: "CDS_HTMLContent",
                        content: htmlEditor.getValue()
                    };
                    a$.ajax({
                        type: "POST",
                        service: "JScript",
                        async: true,
                        data: data,
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: htmlsaved
                    });
                    function htmlsaved(json) {
                        if (a$.jsonerror(json)) {
                            alertR("ERROR:" + json.msg);
                        }
                        else {
                            var data = {
                                lib: "qa",
                                cmd: "saveCDS",
                                bodyid: bodyprefix + $("#lblClient").html() + "." + $("#lblSqfcode").html(),
                                tagid: "CDS_CSSContent",
                                content: cssEditor.getValue()
                            };
                            a$.ajax({
                                type: "POST",
                                service: "JScript",
                                async: true,
                                data: data,
                                dataType: "json",
                                cache: false,
                                error: a$.ajaxerror,
                                success: csssaved
                            });
                            function csssaved(json) {
                                if (a$.jsonerror(json)) {
                                    alertR("ERROR:" + json.msg);
                                }
                                else {
                                    var data = {
                                        lib: "qa",
                                        cmd: "saveCDS",
                                        bodyid: bodyprefix + $("#lblClient").html() + "." + $("#lblSqfcode").html(),
                                        tagid: "CDS_JSContent",
                                        content: jsEditor.getValue()
                                    };
                                    a$.ajax({
                                        type: "POST",
                                        service: "JScript",
                                        async: true,
                                        data: data,
                                        dataType: "json",
                                        cache: false,
                                        error: a$.ajaxerror,
                                        success: jssaved
                                    });
                                    function jssaved(json) {
                                        if (a$.jsonerror(json)) {
                                            alertR("ERROR:" + json.msg);
                                        }
                                        else {
                                            if (a$.gup("rollback") == "") {
                                                location.reload();
                                            }
                                            else {
                                                return_to_v1(); //Don't risk rollback remaining as a parameter.
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                //*********************************** End Content Management Section ************************
                return false;
            });
            $(".cds-save-flow").unbind().bind("click", function () {
                var passedtests = true;
                if (masterform) {
                    alert("Not allowed to save the flow sections from the master form");
                }
                //Add "failsafes" to be sure the content isn't outside of the block.
                /*
                if (htmlEditor.getValue().indexOf('id="lblSupervisor"') > 0) {
                alert("ERROR: Your HTML content is reaching outside of the content area.\n\nThis can be caused by malformed HTML tags\n(a missing closing </div>, for example).\n\nPlease review the html content and remove the excess content.\nIf you need assistance, please contact Jeff Gack.");
                passedtests = false;
                }
                */
                if (passedtests) {
                    var data = {
                        lib: "qa",
                        cmd: "saveCDS",
                        bodyid: bodyprefix + $("#lblClient").html(),
                        tagid: "CDS_HTMLFLOWContent",
                        content: htmlflowEditor.getValue()
                    };
                    a$.ajax({
                        type: "POST",
                        service: "JScript",
                        async: true,
                        data: data,
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: htmlflowsaved
                    });
                    function htmlflowsaved(json) {
                        if (a$.jsonerror(json)) {
                            alertR("ERROR:" + json.msg);
                        }
                        else {
                            var data = {
                                lib: "qa",
                                cmd: "saveCDS",
                                bodyid: bodyprefix + $("#lblClient").html(),
                                tagid: "CDS_JSFLOWContent",
                                content: jsflowEditor.getValue()
                            };
                            a$.ajax({
                                type: "POST",
                                service: "JScript",
                                async: true,
                                data: data,
                                dataType: "json",
                                cache: false,
                                error: a$.ajaxerror,
                                success: jsflowsaved
                            });
                            function jsflowsaved(json) {
                                if (a$.jsonerror(json)) {
                                    alertR("ERROR:" + json.msg);
                                }
                                else {
                                    var data = {
                                        lib: "qa",
                                        cmd: "saveCDS",
                                        bodyid: bodyprefix + $("#lblClient").html(),
                                        tagid: "CDS_CSSFLOWContent",
                                        content: cssflowEditor.getValue()
                                    };
                                    a$.ajax({
                                        type: "POST",
                                        service: "JScript",
                                        async: true,
                                        data: data,
                                        dataType: "json",
                                        cache: false,
                                        error: a$.ajaxerror,
                                        success: cssflowsaved
                                    });
                                    function cssflowsaved(json) {
                                        if (a$.jsonerror(json)) {
                                            alertR("ERROR:" + json.msg);
                                        }
                                        else {
                                            if (a$.gup("rollback") == "") {
                                                location.reload();
                                            }
                                            else {
                                                return_to_v1(); //Don't risk rollback remaining as a parameter.
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                //*********************************** End FLOW Content Management Section ************************
                return false;
            });

        }


        //Back-end populated commonly displayable
        $(".display-lblSqfname").html($("#lblSqfname").html());
        $(".display-lblCalldate").html($("#lblCalldate").html());
        $(".display-lblMonitordate").html($("#lblMonitordate").html());
        $(".display-lblSupervisorName").html($("#lblSupervisorName").html());
        $(".display-lblCallid").html($("#lblCallid").html());
        $(".display-lblMonitorId").html($("#lblMonitorId").html());

        $(".display-lblAgentGroupName").html($("#lblAgentGroupName").html());
        $(".display-lblAgentLocationName").html($("#lblAgentLocationName").html());
        $(".display-lblAgentName").html($("#lblAgentName").html());
        $(".display-lblAgent").html($("#lblAgent").html());
        $(".display-lblAgentRole").html($("#lblAgentRole").html());
        $(".display-lblAgentTitle").html($("#lblAgentTitle").html());
        $(".display-lblAcknowledgementDate").html($("#lblAcknowledgementDate").html());
        $(".display-lblCurrentDate").html($("#lblCurrentDate").html());
        $(".display-lblQA").html($("#lblQA").html());
        $(".display-lblAgentTeamLeaderName").html($("#lblAgentTeamLeaderName").html());
        $(".display-lblAgentTeamLeader").html($("#lblAgentTeamLeader").html());
        $(".display-lblAgentGroupLeaderName").html($("#lblAgentGroupLeaderName").html());
        $(".display-lblAgentGroupLeader").html($("#lblAgentGroupLeader").html());
        $(".display-lblAgentManager").html($("#lblAgentManager").html());
        $(".display-lblAgentGroup").html($("#lblAgentGroup").html());
        $(".display-lblManagers").html($("#lblManagers").html());
        $(".display-lblAgentHireDate").html($("#lblAgentHireDate").html());
        $(".display-lblLetterTypes").html($("#lblLetterTypes").html());
        $(".display-lblClientDept").html($("#lblClientDept").html());
        $(".display-lblNextMonday").html($("#lblNextMonday").html());
        $(".display-inputReleaseDate").html($("#inputReleaseDate").html());

        $(".display-lblAgentExtension").html($("#lblAgentExtension").html());
        $(".display-lblAgentCenter").html($("#lblAgentCenter").html());
        $(".display-lblAgentEMP_ID").html($("#lblAgentEMP_ID").html());
        $(".display-lblAgentClient").html($("#lblAgentClient").html());
        $(".display-lblAgentLOB").html($("#lblAgentLOB").html());
        $(".display-lblPrevScore").html($("#lblPrevScore").html());
        $(".display-lbl90Score").html($("#lbl90Score").html());

        var mgrs = $("#lblManagers").html();
        var mgrss = mgrs.split("|");
        var teamleader = $("#lblAgentTeamLeader").html();
        var groupleader = $("#lblAgentGroupLeader").html();
        var manager = $("#lblAgentManager").html();

        //ADDED 2021-07-16 - If "New" then remove all except blank.
        if ($("#lblMode").html() == "new") {
            $(".combo-groupleader").html('<option value=""></option>');
            $(".combo-teamleader").html('<option value=""></option>');
            $(".combo-manager").html('<option value=""></option>');
        }

        for (var m in mgrss) {
            var ms = mgrss[m].split("~");
            $(".combo-groupleader").append('<option ' + ((ms[0] == groupleader) ? "selected" : "") + ' value="' + ms[0] + '">' + ms[1] + "</option>");
            $(".combo-teamleader").append('<option ' + ((ms[0] == teamleader) ? "selected" : "") + ' value="' + ms[0] + '">' + ms[1] + "</option>");
            $(".combo-manager").append('<option ' + ((ms[0] == manager) ? "selected" : "") + ' value="' + ms[0] + '">' + ms[1] + "</option>");
        }

        if (a$.urlprefix() == "performant-healthcare.") {
            var dmgrs = $("#lblDocAuditors").html();
            var dmgrss = dmgrs.split("|");
            if ($("#lblMode").html() == "new") {
                $(".combo-docauditor").html('<option value=""></option>');
            }
            for (var m in dmgrss) {
                var ms = dmgrss[m].split("~");
                $(".combo-docauditor").append('<option ' /* + ((ms[0] == manager) ? "selected" : "") */ + ' value="' + ms[0] + '">' + ms[1] + "</option>");
            }
        }

        //ADDED 2021-09-16 cds for clientdept
        if ($("#lblMode").html() == "new") {
            //$(".combo-clientdept").html('<option value=""></option>');
        }
        var cdeps = $("#lblClientDept").html();
        var cdepss = cdeps.split("|");
        for (var m in cdepss) {
            $(".combo-clientdept").append('<option value="' + cdepss[m] + '">' + cdepss[m] + "</option>");
        }

        //DONE: Load Definitions (for the dropdowns, with cascades, somehow).
        var data = {
            lib: "qa",
            cmd: "getQaAnswers",
            formId: formid
        };
        a$.ajax({
            type: "POST",
            service: "JScript",
            async: true,
            data: data,
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: monitordefsloaded
        });
        function monitordefsloaded(json) {
            form_answers = json.answers;
            load();
        }
    }
    init();

    setscore();

    function init_control() {

        if ($("#lblMode").html() == "new") {
            $(".agent-acknowledgement").hide(); //?
            $(".agent-confirmation").hide(); //?
            $(".ac-save").show();
            $(".ac-delete").hide();
            $(".ac-close").show();
        }
        else if (($("#lblRole").html() == "CSR") || ($("#lblAgent").html() == $("#lblViewer").html())) {

            $(".ac-save").hide();
            $("select").attr("disabled", "disabled");
            $(".ac-bfa input").attr("disabled", "disabled"); //Disabling the select box isn't enough.
            $(".ui-bfa-highlight-hover").unbind();
            $("input[type=text]").attr("disabled", "disabled");
            $("textarea").attr("disabled", "disabled");

            //TODO: Make qst-agent-coaching-comments exception part of a state-based setting, controled via csf.
            $(".qst-agent-coaching-comments").removeAttr("disabled");
            if ($(".agent-review").length) {
                if ($(".agent-review").css("display") != "none") {
                    $(".ac-save").show();
                }
            }

            $(".ac-close").show();
            $(".ac-delete").hide();
            if ($("#lblAcknowledgementDate").html() != "") {
                $(".ac-show-acknowledgementreceived").show();
            }
            else if ($("#lblAcknowledgementRequired").html() == "Yes") {
                $(".ac-show-acknowledgementrequired").show();
                $(".ac-show-isagent").show();
            }
        }
        else {
            if (!AgentHasAcknowledged) {
                $(".agent-acknowledgement").hide();
            }
            else {
                $(".agent-acknowledgement").show();
            }

            if ($("#lblAcknowledgementDate").html() != "") {
                $(".ac-show-acknowledgementreceived").show();
                $(".ac-show-isnotagent").hide();
            }
            else if ($("#lblAcknowledgementRequired").html() == "Yes") {
                $(".ac-show-acknowledgementrequired").show();
                $(".ac-show-isnotagent").show();
            }

            if (!$(".ac-islive").is(":checked")) {
                $(".ac-save").attr("value", "Update/Send");
            }
            else {
                $(".ac-save").attr("value", "Update");
            }

            $(".ac-save").show();
            $(".ac-delete").show();
            $(".ac-close").show();
        }
        //alert("debug: MonitorComplete=" + $("#lblMonitorComplete").html());
        if ($("#lblMonitorComplete").html() == "Y") {
            $(".ac-save").remove();  //Can't show it if it's gone :)
            $(".ac-delete").remove();
            $(".ac-close").show();
        }
        if (csf.DRAFTMODE_ENABLED) {
            if (!$(".ac-islive").is(":checked")) {
                $(".ac-draft").show();
            }
            else {
                $(".ac-draft").hide();
            }
        }
        //alert("debug:client=" + client);
        //alert("debug:formid=" + formid);
        if (formid == "0") {
            $(".ui-setup-form-new").show();
            $(".ui-setup-form").show();
            $(".ac-draft").hide();
        }

        $(".ac-setup-form").unbind().bind("click", function () {
            //DONE: Harvest the questions in the form (so they can be set up).
            //TODO: Add section handling (for starters, all questions go into 1 section).
            var mans = harvestQuestions(); //Current answers aren't relevant, but will be sent for clarity
            var data = {
                lib: "qa",
                cmd: "setupQaForm",
                formId: formid,  //If "0", then create a new form, otherwise just add new questions.
                mans: mans,
                database: "C",
                clean: true,  //IF true, then remove existing questions/sections before starting (will create new qst and sec ids, which may not be good if reports depend on them).
                sqfCode: $("#lblSqfcode").html(),
                sqfName: $("#lblSqfname").html()
            };
            a$.ajax({
                type: "POST",
                service: "JScript",
                async: true,
                data: data,
                dataType: "json",
                cache: false,
                error: a$.ajaxerror,
                success: formhasbeensetup
            });
            function formhasbeensetup(json) {
                if (a$.jsonerror(json)) {
                    alertR("ERROR:" + json.msg);
                }
                else {
                    if (!a$.exists(json.formId)) {
                        alert("Setup failed, contact TPO tech services (Jeff Gackenheimer).");
                    }
                    else {
                        //Do an "Update" (or submit) here instead of reload to create db records of the new fields.
                        //location.reload();

                        //This causes an error on a linked server (too fast?)
                        //$(".ac-submit").trigger("click"); //Saves everything in place.
                        return_to_v1();
                    }
                }
            }
            return false;
        });

        $(".ac-required").unbind().bind("change", function () {
            setscore();
        });

        testing();

    }
    init_control();

    //UI Control options (driven by class).

    //Buttons for answers.
    function buttonsforanswers() {
        $(".ac-bfa").each(function () {
            //if (!$(this).parent().hasClass("ac-special")) {
            var me = this;
            $(" option", this).each(function () {
                if ($(this).val() != "") {
                    var bld = '<input type="button" value="' + $(this).text() + '" class="ui-bfa-highlight-hover';
                    if ($(me).val() == $(this).val()) {
                        bld += ' ui-bfa-highlight';
                    }
                    bld += '">';
                    $(me).parent().append(bld);
                }
            })
            $(me).hide();
            //}
        }).unbind().bind("change", function () {
            setscore();
        }); ;
        $(".ui-bfa-highlight-hover").bind("click", function () {
            var text = $(this).val();
            var sel = $(" select", $(this).parent());
            $(" option", sel).each(function () {
                if (text == $(this).text()) {
                    $(sel).val($(this).val())
                }
            });
            $(sel).trigger("change");
            $(".ui-bfa-highlight-hover", $(this).parent()).removeClass("ui-bfa-highlight");
            $(this).addClass("ui-bfa-highlight");
        });
        setscore();
    }

    function default_setscore() {
        var score = 0;
        var autofail = false;
        var scoreerror = false;

        //TODO: Establish default based on scoring.
        score = 100;
        scoreerror = false;

        if (score < 0) score = 0;

        if (autofail) {
            $(".ac-autofail").parent().addClass("sel-autofail");
            $(".ac-autofail").show();
        }
        else {
            $(".ac-autofail").parent().removeClass("sel-autofail");
            $(".ac-autofail").hide();
        }

        if (scoreerror) {
            $(".ac-score").html("Incomplete");
        }
        else {
            $(".ac-score").html(score);
        }

        //CUSTOM: Put in your form validations.

        $(".ac-required").each(function () {
            if ($(this).val().trim() == "") {
                scoreerror = true;
            }
        });


        if (scoreerror) {
            $(".ac-submit").attr("disabled", "disabled");
        }
        else {
            $(".ac-submit").removeAttr("disabled");
        }

    }

    function setscore() {
        var calldefault = true;
        if (a$.exists(window.userFunctions)) {
            if (a$.exists(userFunctions.client_setscore)) {
                userFunctions.client_setscore();
                calldefault = false;
            }
        }
        if (calldefault) default_setscore();
    }

    function testing() {
        //$(".attachments").show(); //Not available universally yet (need qa_attachments table, and would prefer to wait until the "attach to new monitor" issue is resolved.

        /*
        $(".ac-show-acknowledgementrequired").show();
        //$(".ac-show-isagent").show();
        $(".ac-show-isnotagent").show();
        */
        /*
        $(".ac-show-acknowledgementreceived").show();
        $(".display-lblAcknowledgementDate").html("test date");
        */
        //$(".ui-setup-form").show();
    }

});

function exists(me) {
    return (typeof me != 'undefined');
}

function printFunction() {
    window.print();
}
/*
function resizeTextarea(id) {
    var a = document.getElementById(id);
    a.style.height = 'auto';
    a.style.height = a.scrollHeight + 'px';
}

function init() {
    var a = document.getElementsByTagName('textarea');
    for (var i = 0, inb = a.length; i < inb; i++) {
        if (a[i].getAttribute('data-resizable') == 'true')
            resizeTextarea(a[i].id);
    }
}
*/
function resizeTextarea(me) {
    if (!me) me = $(this);
    $(me).css("height", "auto");
    try {
        $(me).css("height", $(me)[0].scrollHeight + "px");
    }
    catch (e) { }
}

function init() {
    $("textarea").each(function () {
        if ($(this).attr("data-resizable") == "true") {
            resizeTextArea(this);
        }
    });
}

function qstsel(qst) {
    var sel = null;
    $(".qst").each(function () {
        if ($(this).attr("qst") == qst) {
            sel = this;
        }
    });
    return sel;
}

function mup(v) {
    if (a$.urlprefix(true).indexOf("mnt") == 0) {
        return a$.gup(v);
    }
    else {
        return "";
    }
}


//Class rules
/*
    ui-    //Controls the appearance, will never be referenced as control.
    ac-    //These are "action" classes - referenced in javascript.
*/



