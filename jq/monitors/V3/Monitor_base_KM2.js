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
        CDS_ENABLED: true //If set to false via cds, you can't set it back to true (need mnt override)
    }

    if (a$.exists(window.userFunctions)) {
        if (a$.exists(userFunctions.client_setfeatures)) {
            userFunctions.client_setfeatures(csf);
            if (!csf.AGENT_ACKNOWLEDGEMENTS_ENABLED) {
                $("#lblAcknowledgementRequired").html("");  //In case monitor_imprvmnt believes otherwise.
            }
        }
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
    if (csf.AGENT_ACKNOWLEDGEMENTS_ENABLED) {
        $(".ac-acknowledge").bind("click", function () {
            //SAVE THE MONITOR as part of this process.
            acknowledgingnow = true;
            $(".ac-submit").trigger("click"); //Saves everything in place.
            return false;
        });
    }

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

            var markup_score = "0"; //Maps to Value field
            if ($(this).is("[score]")) {
                markup_score = $(this).attr("score");
            }
            var markup_awarded = "0"; //Maps to Score field
            if ($(this).is("[awarded]")) {
                markup_awarded = $(this).attr("awarded");
            }
            mans.answers.push({ friendlyname: $(this).attr("qst"), answertext: myval, score: markup_awarded, value: markup_score, version: 0 });
        });
        return mans;
    }

    //SUBMIT (Base)

    $(".ac-submit").bind("click", function () {

        var dvpassed = true;
        $(".dv-number").each(function () {
            if (isNaN($(this).val())) {
                alert("Only numbers are allowed in the field: " + $(this).attr("qst"));
                dvpassed = false;
            }
        });

        if (dvpassed) {
            try {
                if (a$.exists(window.userFunctions)) {
                    if (a$.exists(userFunctions.client_dv)) {
                        dvpassed = userFunctions.client_dv();
                    }
                }
            }
            catch (err) {
            }
        }
        $(".dv-select").each(function () {
            if (($(this).val() == null) || ($(this).val() == "")) {
                alert("Please select an item from the list: " + $(this).attr("qst"));
                dvpassed = false;
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
                $(".qst-timestamp-islive").val((d.toLocaleDateString() + " " + d.toLocaleTimeString()).replace(/\?/g, ""));
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
        //TODO: Update all javascripts of past monitors to have a client_getkpi which returns "Text:Quality".

        var data = {
            lib: "qa",
            cmd: "saveQaForm",
            formId: formid,
            sqfCode: $("#lblSqfcode").html(),
            kpi: thekpi,
            database: "C",
            examinee: $("#lblAgent").html(),
            score: $(".ac-score").html().replace("%", ""),
            value: ($(".ac-autofail").eq(0).css("display") != "none") ? "Auto Fail" : "",
            //answers: answers,
            mans: mans,
            callId: $("#lblCallid").html(),
            callDate: $("#lblCalldate").html(),
            callTime: "",
            clientDept: "",
            acknowledgement: csf.AGENT_ACKNOWLEDGEMENTS_ENABLED,
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
            }
            else {
                if ((a$.urlprefix() == "km2.") && ($("#lblMode").html() == "new")) {

                    //alert("debug:pause to see wait prompt"); return;

                    var bld = "<b>Monitor Saved</b><br/><br/>";
                    bld += '<div style="text-align:left;font-weight:normal;">';
                    bld += "Agent: <b>" + json.examinee + "</b><br />";
                    bld += "Call ID<b>: " + json.callId + "</b><br />";
                    bld += "Call Date: " + json.callDate + "<br />";
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


        if (csf.DRAFTMODE_ENABLED) { //Draft view is disabled for now.
            //If you're the agent.
            var nodraftview = false;
            if (($("#lblRole").html() == "CSR") || ($("#lblAgent").html() == $("#lblViewer").html())) {
                nodraftview = true;
            }
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


        client_action_init();
        init_control();

        if (a$.exists(window.userFunctions)) {
            if (a$.exists(userFunctions.client_postload)) {
                userFunctions.client_postload();
            }
        }

        return;
    }

    function load() {
        if (form_answers != null) {
            form_load_answers();
        }
        if ($("#lblMode").html() == "new") {
            client_load_init();
            return;
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
        if (csf.CDS_ENABLED && ((a$.urlprefix(true).indexOf("mnt") == 0) && ($.cookie("TP1Role") == "Admin"))) {
            var bodyprefix = "MONITOR.";
            $(".cds-editors").hide();
            var cssEditor = CodeMirror(document.getElementById("CDS_CSSEditor"), {
                lineNumbers: true,
                mode: "css",
                autoRefresh: true,
                extraKeys: { "Ctrl-Space": "autocomplete" },
                value: document.getElementById("CDS_CSSContent").innerHTML
            });
            $(".cds-css-editor").show();

            var htmlEditor = CodeMirror(document.getElementById("CDS_HTMLEditor"), {
                lineNumbers: true,
                mode: "text/html",
                autoRefresh: true,
                extraKeys: { "Ctrl-Space": "autocomplete" },
                value: document.getElementById("CDS_HTMLContent").innerHTML
            });
            $(".cds-html-editor").show();


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
            $(".cds-js-editor").show();

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
                if ($(".cds-editors").eq(0).css("display") == "none") {
                    $(".cds-editors").show();
                }
                else {
                    $(".cds-editors").hide();
                }
            });
            $(".cds-save").unbind().bind("click", function () {
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
                                        location.reload();
                                    }
                                }
                            }
                        }
                    }
                }
                //*********************************** End Content Management Section ************************
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
        $(".display-lblAgentClient").html($("#lblAgentClient").html());
        $(".display-lblAgentLOB").html($("#lblAgentLOB").html());
        $(".display-lblPrevScore").html($("#lblPrevScore").html());
        $(".display-lbl90Score").html($("#lbl90Score").html());

        var mgrs = $("#lblManagers").html();
        var mgrss = mgrs.split("|");
        var teamleader = $("#lblAgentTeamLeader").html();
        var groupleader = $("#lblAgentGroupLeader").html();
        var manager = $("#lblAgentManager").html();
        for (var m in mgrss) {
            var ms = mgrss[m].split("~");
            $(".combo-groupleader").append('<option ' + ((ms[0] == groupleader) ? "selected" : "") + ' value="' + ms[0] + '">' + ms[1] + "</option>");
            $(".combo-teamleader").append('<option ' + ((ms[0] == teamleader) ? "selected" : "") + ' value="' + ms[0] + '">' + ms[1] + "</option>");
            $(".combo-manager").append('<option ' + ((ms[0] == manager) ? "selected" : "") + ' value="' + ms[0] + '">' + ms[1] + "</option>");
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
            $(".ac-close").show();
        }
        else if (($("#lblRole").html() == "CSR") || ($("#lblAgent").html() == $("#lblViewer").html())) {

            $(".ac-save").hide();
            $("select").attr("disabled", "disabled");
            $("textarea").attr("disabled", "disabled");
            $(".ac-close").show();
            $(".ac-delete").hide();

            if (csf.AGENT_ACKNOWLEDGEMENTS_ENABLED) {
                if ($("#lblAcknowledgementDate").html() != "") {
                    $(".ac-show-acknowledgementreceived").show();
                }
                else if ($("#lblAcknowledgementRequired").html() == "Yes") {
                    $(".ac-show-acknowledgementrequired").show();
                    $(".ac-show-isagent").show();
                }
            }
        }
        else {
            if (csf.AGENT_ACKNOWLEDGEMENTS_ENABLED) {
                if (!AgentHasAcknowledged) {
                    $(".agent-acknowledgement").hide();
                }
                else {
                    $(".agent-acknowledgement").show();
                }
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
            if (csf.AGENT_ACKNOWLEDGEMENTS_ENABLED) {
                if (AgentHasAcknowledged) {
                    //if ($("#lblAcknowledgementDate").html() != "") {
                    $(".ac-show-acknowledgementreceived").show();
                    $(".ac-show-isnotagent").hide();
                }
                else if ($("#lblAcknowledgementRequired").html() == "Yes") {
                    $(".ac-show-acknowledgementrequired").show();
                    $(".ac-show-isnotagent").show();
                }
            }
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
    $(me).css("height", $(me)[0].scrollHeight + "px");
}

function init() {
    $("textarea").each(function () {
        if ($(this).attr("data-resizable") == "true") {
            resizeTextArea(this);
        }
    });
}

//Class rules
/*
    ui-    //Controls the appearance, will never be referenced as control.
    ac-    //These are "action" classes - referenced in javascript.
*/



