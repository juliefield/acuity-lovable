(function () {

//Base 4
$(document).ready(function () {
    var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
    var acknowledgingnow = false;
    var AgentHasAcknowledged = false;

    // qaid dataview recordid userid prefix

    //alert("debug: masterid=" + a$.gup("masterid"));

    var client = $("#lblClient").html();
    var masterid = $("#lblMasterId").html();
    var formid = $("#lblFormId").html(); //Retrieved via the master id on back end.
    var examinee = $("#lblAgent").html();    
    var examiner = $("#lblSupervisor").html();    

    $.cookie("CSR",examinee); //Will communicate with CDS-managed controls (I'm in my own iframe).  TODO: Is this fully general?

    $("#lblViewer").html($.cookie("TP1Username"));

    window.parent['QASubmit_' + formid + "_" + examinee] = "";

    var submitted = false;
    function checksubmit() {
        if (!submitted) {
            if (window.parent['QASubmit_' + formid + "_" + examinee] != "") {
                submitted = true;
                masterid = window.parent['QASubmit_' + formid + "_" + examinee];
                $("#lblMasterId").html(masterid); //So post_submit can pick it up.
                //alert("debug: Submitting! - masterid = " + masterid);
                processSubmit();
            }
        }
        setTimeout(checksubmit, 500);
    }
    checksubmit();    

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
            mans.answers.push({ friendlyname: $(this).attr("qst"), answertext: myval, score: 0, value: '', version: 0 });
        });
        return mans;
    }

    //SUBMIT (Base)
    if (false) { //just saving here, this goes in the cds code.
        var mylink = '<span class="message-service" service="QADisplay" framepage="" formid="' + $("#lblFormId").html() + '"  dataview="DAS:JournalTEST" masterid="' + $("#lblMasterId").html() +'" examinee="' + $("#lblAgent").html() + '" examiner="' + a$.gup("examiner") + '">Performance Review</span>';
        var data = {
            lib: "qa",
            cmd: "createTask",
            tasktype: "sidekick-subform-acknowledgement",
            examinee: $("#lblAgent").html(),
            subject: "Performance Review Acknowledgement Required",
            message: "You have a performance review pending, please review and acknowledge using the link below:<br /><br />" + mylink,
            SidekickReferenceId: $("#lblMasterId").html(),
            TaskDesc: "Review/Acknowledge Performance Review"
        };

        a$.ajax({
            type: "POST",
            service: "JScript",
            async: true,
            data: data,
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: acksaved
        });
        function acksaved(json) {
            if (a$.jsonerror(json)) {
                alert("ERROR:" + json.msg);
            }
            else {
                if (!a$.exists(json.alreadythere)) {
                    if (json.saved) {
                        alert("debug:message saved/sent");
                    }
                }
            }
        }
    }
    function processSubmit() {
        var mans = harvestQuestions();

        //DONE: Make a general way to do traverse.  I need to set this up specifically based on the wrappers in the interest of time.

        var thekpi = "0";

        var data = {
            lib: "qa",
            cmd: "saveQaForm",
            formid: formid,
            masterId: masterid,
            database: "C",
            examinee: $("#lblAgent").html(),
            score: (($(".ac-score").html() != null) ? $(".ac-score").html().replace("%", "") : "0"),
            value: (($(".ac-autofail").html() != null) ? (($(".ac-autofail").eq(0).css("display") != "none") ? "Auto Fail" : "") : ""),
            //answers: answers,
            mans: mans,
            acknowledgement: csf.AGENT_ACKNOWLEDGEMENTS_ENABLED
        };
        if ($("#lblMode").html() != "new") {
            data.masterId = masterid;
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
                if (!acknowledgingnow) {
                    //ko.postbox.publish("nativeSaveComplete", true);
                    if (a$.exists(window.userFunctions)) {
                        if (a$.exists(userFunctions.client_postsubmit)) {
                            userFunctions.client_postsubmit();
                        }
                    }
                    $(".qa-close").trigger("click");
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
                            alert("ERROR:" + json.msg);
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

    $(".ac-submit").bind("click", function () {
        //Gather all of your variables to be passed to saveQaForm
        //masterid = 999; //DEBUG

        if ($(this).hasClass("ac-draft")) {
            if (!$(".ac-islive").is(":checked")) {
                $(".ac-islive").prop("checked", false);
            }
        }
        else {
            $(".ac-islive").prop("checked", true);
        }
        processSubmit();
        return false;
    });


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
        if (a$.exists(window.userFunctions)) {
            if (a$.exists(userFunctions.client_postload)) {
                userFunctions.client_postload();
            }
        }
        client_action_init();
        init_control();
        return;
    }

    function load(publishcompletion) {
        if (form_answers != null) {
            form_load_answers();
        }


        //$(".display-MonitorLink").attr("href","https://" + a$.urlprefix() + "acuityapm.com/monitor/monitor_review.aspx?id=" + json.form.monitorId);
        $(".display-MonitorLink").bind("click", function() {
            /*
            if ($("#lblMode").html() == "new") {
                alert("TODO: PRT Link to NEW monitor");
            }
            else {
                alert("TODO: PRT Link to monitor id:" + $("#lblMonitorId").html());
            }
            */
            //alert("debug:formid=" + formid);
            //alert("debug:masterid=" + masterid);

            a$.ajax({
                type: "POST",
                service: "JScript",
                async: true,
                data: {
                    lib: "qa",
                    cmd: "setMonitorPRT",
                    userid: examinee,
                    entby: examiner,
                    formid: formid,
                    masterid: masterid
                },
                dataType: "json",
                cache: false,
                error: a$.ajaxerror,
                success: success_setMonitorPRT
            });
            function success_setMonitorPRT(json) {
                if (a$.jsonerror(json)) {
                    alert("Error: " + json.msg);
                }
                else {
                if (json.status == 1) {
                    window.open("https://" + a$.urlprefix(true) + "acuityapmr.com/jq/monitors/V3/Monitor_Base_3NG.aspx?uid=" + json.guid + "&customurl=1&origin=report&prefix=" + a$.urlprefix().replace(".", ""));
                }
                $(".rpt-dismiss",window.parent.document).trigger("click");
            }
            return false;
        }

/*
    var client = $("#lblClient").html();
    var masterid = $("#lblMasterId").html();
    var formid = $("#lblFormId").html(); //Retrieved via the master id on back end.
    var examinee = $("#lblAgent").html();    
    var examiner = $("#lblSupervisor").html();
*/

        });


        if ($("#lblMode").html() == "new") {
            if (a$.urlprefix(true).indexOf("mnt") == 0) {
                var data = {
                    lib: "qa",
                    cmd: "getQaFormOutline",
                    formId: formid,
                    database: "C",
                };
                a$.ajax({
                    type: "POST",
                    service: "JScript",
                    async: true,
                    data: data,
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: monitordefloaded
                });
                function monitordefloaded(json) {
                    if (a$.jsonerror(json)) {
                        alert("ERROR:" + json.msg);
                    }
                    else {
                        var qstnf = [];
                        $(".qst").each(function () {
                            var qst = $(this).attr("qst");
                            var nf = true;
                            for (var i in json.form_outline) {
                                if (json.form_outline[i].qst_friendlyname == qst) {
                                    nf = false;
                                }
                            };
                            if (nf) {
                                qstnf.push(qst);
                            }
                        });
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
                }
            }
            client_load_init();
            if (publishcompletion) {
                ko.postbox.publish("nativeLoadComplete", true);
            }
            return;
        }

        var data = {
            lib: "qa",
            cmd: "getQaForm",
            formId: formid,
            masterId: masterid,
            database: "C",
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
                //alert("debug: monitor id retrieved = " + json.form.monitorId);
                $(".display-PctScore").html(json.form.pct_score);
                $(".display-MonitorName").html(json.form.sqf_name);
                $(".display-CallId").html(json.form.call_id);
                $(".display-CallDate").html(json.form.call_date);
                $(".display-CallTime").html(json.form.call_time);
                $(".display-MonitorEntdt").html(json.form.entdt);
                $(".display-MonitorEntby").html(json.form.entby);
                $(".display-MonitorId").html(json.form.monitorId);

                $("#lblMonitorId").html(json.form.monitorId);
                $(".display-lblMonitorId").html($("#lblMonitorId").html());

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

                if (a$.urlprefix(true).indexOf("mnt") == 0) {
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
                if (publishcompletion) {
                    ko.postbox.publish("nativeLoadComplete", true);
                }
            }
        }
    }

    function init() {
        //*********************************** Content Management Section ************************
        //TODO: When blow-in works, remove this section if user is not a CDS editor
        if (csf.CDS_ENABLED && (a$.urlprefix(true).indexOf("mnt") == 0)) {


            $(".cds-edit-save").unbind().bind("click", function () {
                removeeditbuttons();
                var data = {
                    lib: "qa",
                    cmd: "saveCDS",
                    bodyid: bodyid,
                    tagid: "CDS_HTMLContent",
                    content: $("#CDS_HTMLContent").html()
                };
                a$.ajax({
                    type: "POST",
                    service: "JScript",
                    async: true,
                    data: data,
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: htmleditsaved
                });
                function htmleditsaved(json) {
                    if (a$.jsonerror(json)) {
                        alert("ERROR:" + json.msg);
                    }
                    else {
                        alert("success");

                    }
                }
                window.location.href = window.location.href.replace("&editmode=true", "");
                $(".cds-edit-save").hide();
                //DISABLE FOR NOW: $(".cds-edit").show();
                return false;
            });

            $(".cds-edit").unbind().bind("click", function () {
                window.location.href = window.location.href + "&editmode=true";
                return false;
            });

            var bodyid = $("#lblBodyId").html(); //TODO: Put this in monitor_base_3 and 4, it's better.
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
                    $(".form-popup", window.parent.document).css("width","100% !important"); //Specific to subforms
                    $(".cds-editors").show();
                }
                else {
                    $(".cds-editors").hide();
                    $(".form-popup", window.parent.document).css("width","");  //Specific to subforms
                }
            });
            $(".cds-save").unbind().bind("click", function () {
                var data = {
                    lib: "qa",
                    cmd: "saveCDS",
                    bodyid: bodyid,
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
                        alert("ERROR:" + json.msg);
                    }
                    else {
                        var data = {
                            lib: "qa",
                            cmd: "saveCDS",
                            bodyid: bodyid,
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
                                alert("ERROR:" + json.msg);
                            }
                            else {
                                var data = {
                                    lib: "qa",
                                    cmd: "saveCDS",
                                    bodyid: bodyid,
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
                                        alert("ERROR:" + json.msg);
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

        function generatenewsection() {
            var dl = document.createElement("DL");
            var dd = document.createElement("DD");
            var q = generatenewquestion();
            dl.setAttribute("class", "ui-section-questions ed-section");
            $(dl).append('<dt>New Section</dt>');
            $(dd).append(q);
            $(dl).append(dd);
            $('<input class="cds-edit-stag" placeholder="Section tag (optional)" value=""></input>').insertBefore(dd);
            $(dl).append('<br class="cds-edit-misc"><button class="cds-edit-add-section"> + </button>');
            $(dl).append('<button class="cds-edit-remove-section"> - </button>');
            return dl;
        }

        function generatenewquestion() {
            var dl = document.createElement("DL");
            $(dl).attr("class", "ed-question");
            $(dl).append('<dt>New Question</dt>');
            $(dl).append('<dd><select class="qst ac-bfa" customqname="" score=""><option selected="selected" value="Yes">Yes</option><option value="No">No</option><option value="N/A">N/A</option></select></dd>');
            $(dl).append('<label class="cds-edit-misc">Question name: </label><input class="cds-edit-qname" placeholder="(optional)" value="1"></input>');
            $(dl).append('<br class="cds-edit-misc"><label class="cds-edit-misc">Score: </label><input class="cds-edit-score" placeholder="(must be a number)" value=""></input>');
            $(dl).append('<br class="cds-edit-misc"><button class="cds-edit-add-question"> + </button>');
            $(dl).append('<button class="cds-edit-remove-question"> - </button>');
            return dl;
        }

        function generateadditionalquestion(original) {
            var dl = document.createElement("DL");
            $(dl).attr("class", "ed-question");
            $(dl).append('<dt>New Question</dt>');
            $(dl).append(selectbox(original));
            $(dl).append('<label class="cds-edit-misc">Question name: </label><input class="cds-edit-qname" placeholder="(optional, cannot be a number)" value=""></input>');
            $(dl).append('<br class="cds-edit-misc"><label class="cds-edit-misc">Score: </label>' + scoreinput(original));
            $(dl).append('<br><button class="cds-edit-add-question"> + </button>');
            $(dl).append('<button class="cds-edit-remove-question"> - </button>');
            return dl;
        }

        function findavailablesectionnumber() {
            var sections = $(".ed-section");
            for (var i = 0, stags = []; i < sections.length; i++) {
                var section = sections[i];
                stags.push($(section).attr("sectiontag"));
            }
            for (var i = 0, available = 1; i < stags.length; i++) {
                var stag = stags[i];
                if (stag == "S" + available) {
                    available++;
                    i = -1;
                }
            }
            return "S" + available;
        }

        function findavailablequestionnumber(section) {
            var qsts = $(section).children().find(".qst");
            for (var i = 0, qnames = []; i < qsts.length; i++) {
                var qst = qsts[i];
                qnames.push($(qst).attr("customqname"));
            }
            for (var i = 0, available = 1; i < qnames.length; i++) {
                var qname = qnames[i];
                if (qname == available) {
                    available++;
                    i = -1;
                }
            }
            return available;
        }

        function bindeditbuttons() {
            $(".cds-edit-add-question").unbind().bind("click", function () {
                var q = generateadditionalquestion($(this).parent());
                $(q).insertAfter($($(this).parent()));
                $(q).find(".cds-edit-qname").attr("value", findavailablequestionnumber($(q).parent()));
                updateattributes();
                bindeditbuttons();
                return false;
            });

            $(".cds-edit-remove-question").unbind().bind("click", function () {
                this.parentNode.remove();
                bindeditbuttons();
                checkquestiondupes();
                return false;
            });

            $(".cds-edit-add-section").unbind().bind("click", function () {
                var s = generatenewsection($(this).parentNode);
                $(s).insertAfter($(this.parentNode));
                $(s).attr("sectiontag", findavailablesectionnumber());
                $(s).find(".cds-edit-stag").attr("value", $(s).attr("sectiontag"));
                updateattributes();
                bindeditbuttons();
                return false;
            });

            $(".cds-edit-remove-section").unbind().bind("click", function () {
                this.parentNode.remove();
                bindeditbuttons();
                checksectiondupes();
                return false;
            });

            $(".cds-edit-stag").unbind().bind("change focusout", function () {
                setstagonsection(this);
                return false;
            });

            $(".cds-edit-stag").bind("keyup", function (e) {
                var keyCode = e.keyCode || e.which;
                if (keyCode === 13) {
                    e.preventDefault();
                    return false;
                }
                if ($(this).attr("value") != "") {
                    setstagonsection(this);
                }
                return false;
            });

            $(".cds-edit-qname").unbind().bind("change focusout", function () {
                setqnameonquestion(this);
                return false;
            });

            $(".cds-edit-qname").bind("keyup", function (e) {
                var keyCode = e.keyCode || e.which;
                if (keyCode === 13) {
                    e.preventDefault();
                    return false;
                }
                if ($(this).attr("value") != "") {
                    setqnameonquestion(this);
                }
                else {
                    updateqnamelabel(this)
                }
                return false;
            });

            $(".cds-edit-score").unbind().bind("change", function () {
                setscoreonquestion(this);
                return false;
            });

            $(".cds-edit-score").bind("keyup", function (e) {
                var keyCode = e.keyCode || e.which;
                if (keyCode === 13) {
                    e.preventDefault();
                }
                setscoreonquestion(this);
                return false;
            });

            $(".cds-edit-qname").each(function (index) {
                setqnameonquestion(this);
            });
        }

        function setstagonsection(input) {
            if ($(input).val() == "") {
                $(input.parentNode).attr("sectiontag", $(input).val());
                $(input).attr("value", findavailablesectionnumber());
            }
            $(input.parentNode).attr("sectiontag", $(input).val());
            $(input).attr("value", findavailablesectionnumber());
            $(".cds-edit-qname").each(function (index) {
                setqnameonquestion(this);
            });
            updateattributes();
            var stagdupes = checksectiondupes();
            var qstdupes = checkquestiondupes();
            if (stagdupes || qstdupes) {
                $(".ac-setup-form").prop("disabled", true);
            }
            else {
                $(".ac-setup-form").prop("disabled", false);
            }
        }

        function updateqnamelabel(input) {
            $(input).prev().text("Question name: (" + $($(input.parentNode).find(".qst")).attr("qst") + ") ");
        }

        function setqnameonquestion(input) {
            if ($(input).val() == "") {
                $($(input.parentNode).find(".qst")).attr("customqname", $(input).val());
                $(input).attr("value", findavailablequestionnumber($(input.parentNode.parentNode)));
            }
            $($(input.parentNode).find(".qst")).attr("customqname", $(input).val());
            updateattributes();
            updateqnamelabel(input);
            var stagdupes = checksectiondupes();
            var qstdupes = checkquestiondupes();
            if (stagdupes || qstdupes) {
                $(".ac-setup-form").prop("disabled", true);
            }
            else {
                $(".ac-setup-form").prop("disabled", false);
            }
        }

        function setscoreonquestion(input) {
            if (isNaN(Number($(input).val()))) {
                $(input).attr("value", "");
            }
            $($(input.parentNode).find(".qst")).attr("score", $(input).val());
            updateattributes();
        }

        function updateattributes() {
            $(".ed-section").each(function (index) {
                input = $(this).find($(".cds-edit-stag"))[0];
                $(input).attr("value", $(this).attr("sectiontag"));
            });
            $(".ed-question").each(function (index) {
                qst = $(this).find($(".qst"))[0];
                $(qst).attr("qst", $(this).parent().parent().attr("sectiontag") + "-" + ($(qst).attr("customqname")));
            });
        }

        function checkquestiondupes() {
            var hasDupes = false;
            var dupelist = [];
            var questions = [];
            var qsts = [];
            $(".ed-question").each(function (index) {
                question = $(this).find($(".qst"))[0];
                questions.push(question);
                qsts.push($(question).attr("qst"));
            });
            for (var i = 0; i < qsts.length; i++) {
                qst = qsts[i];
                counter = 0;
                for (var j = 0; j < qsts.length; j++) {
                    dupecheck = qsts[j];
                    if (dupecheck == qst) {
                        counter++;
                    }
                }
                if (counter > 1) {
                    $($(questions[i]).parent().parent().find($(".cds-edit-qname"))[0]).css("border", "1px solid red");
                    if (!dupelist.includes(qst)) {
                        dupelist.push(qst);
                    }
                    hasDupes = true;
                }
                else {
                    $($(questions[i]).parent().parent().find($(".cds-edit-qname"))[0]).removeAttr("style");
                }
            }
            updateqstdupeui(dupelist);
            return hasDupes;
        }

        function checksectiondupes() {
            var hasDupes = false;
            var dupelist = [];
            var sections = [];
            var stags = [];
            $(".ed-section").each(function (index) {
                section = $(this);
                sections.push(section);
                stags.push($(section).attr("sectiontag"));
            });
            for (var i = 0; i < stags.length; i++) {
                stag = stags[i];
                counter = 0;
                for (var j = 0; j < stags.length; j++) {
                    dupecheck = stags[j];
                    if (dupecheck == stag) {
                        counter++;
                    }
                }
                if (counter > 1) {
                    $($(sections[i]).find($(".cds-edit-stag"))[0]).css("border", "1px solid red");
                    if (!dupelist.includes(stag)) {
                        dupelist.push(stag);
                    }
                    hasDupes = true;
                }
                else {
                    $($(sections[i]).find($(".cds-edit-stag"))[0]).removeAttr("style");
                }
            }
            updatestagdupeui(dupelist);
            return hasDupes;
        }

        function updateqstdupeui(dupelist) {
            if (dupelist.length == 0) {
                $(".ui-setup-duplicate-qsts").hide();
            }
            else {
                $(".ui-setup-duplicate-qsts").show();
                var dupetext = "";
                for (var i = 0; i < dupelist.length; i++) {
                    var dupe = dupelist[i];
                    if (i != dupelist.length - 1) {
                        dupetext += dupe + ", ";
                    }
                    else {
                        dupetext += dupe;
                    }
                }
                $(".ui-duplicate-qst-list").text(dupetext);
            }
        }

        function updatestagdupeui(dupelist) {
            if (dupelist.length == 0) {
                $(".ui-setup-duplicate-stags").hide();
            }
            else {
                $(".ui-setup-duplicate-stags").show();
                var dupetext = "";
                for (var i = 0; i < dupelist.length; i++) {
                    var dupe = dupelist[i];
                    if (i != dupelist.length - 1) {
                        dupetext += dupe + ", ";
                    }
                    else {
                        dupetext += dupe;
                    }
                }
                $(".ui-duplicate-stag-list").text(dupetext);
            }
        }

        function addeditbuttons() {
            $(".ed-section").each(function (sectionindex) {
                var dd = $(this).children()[1];
                $(staginput(this)).insertBefore(dd);
                $(this).append('<br class="cds-edit-misc"><button class="cds-edit-add-section"> + </button>');
                $(this).append('<button class="cds-edit-remove-section"> - </button>');
                $(".ed-question").each(function (questionindex) {
                    $(this).append(qnameinput(this));
                    $(this).append('<br class="cds-edit-misc"><label class="cds-edit-misc">Score: </label>' + scoreinput(this));
                    $(this).append('<br class="cds-edit-misc"><button class="cds-edit-add-question"> + </button>');
                    $(this).append('<button class="cds-edit-remove-question"> - </button>');
                });
            });
            updateattributes();
            bindeditbuttons();
        }

        function removeeditbuttons() {
            $(".cds-edit-stag").remove();
            $(".cds-edit-qname").remove();
            $(".cds-edit-score").remove();
            $(".cds-edit-add-section").remove();
            $(".cds-edit-remove-section").remove();
            $(".cds-edit-add-question").remove();
            $(".cds-edit-remove-question").remove();
            $(".cds-edit-misc").remove();
        }

        function staginput(section) {
            return '<input class="cds-edit-stag" placeholder="Section tag (optional, cannot be a number)" value="' + $(section).attr("sectiontag") + '"></input>';
        }

        function selectbox(question) {
            return '<dd><select class="qst ac-bfa" customqname="" score="' + $(question).find(".qst").attr("score") + '"><option selected="selected" value="Yes">Yes</option><option value="No">No</option><option value="N/A">N/A</option></select></dd>';
        }

        function qnameinput(question) {
            return '<label class="cds-edit-misc>Question name: </label><input class="cds-edit-qname" placeholder="(optional, cannot be a number)" value="' + $(question).find(".qst").attr("customqname") + '"></input>';
        }

        function scoreinput(question) {
            return '<input class="cds-edit-score" placeholder="(must be a number)" value="' + $(question).find(".qst").attr("score") + '"></input>';
        }

        if (a$.gup("editmode") == "true") {
            //Don't call client_load_init.
            $(".cds-edit-save").show();
            addeditbuttons();
            $(".cds-edit-qname").each(function (index) {
                setqnameonquestion(this);
            });
            $(".cds-edit").hide();
            $("#CDS_HTMLContent").attr("contenteditable", "true");
            $(".ac-view").show();
        }
        else {
            $(".cds-edit-save").hide();
            //DISABLE FOR NOW: $(".cds-edit").show();
            $("#CDS_HTMLContent").attr("contenteditable", "false");
            //Back-end populated commonly displayable
            $(".display-lblSqfname").html($("#lblSqfname").html());
            $(".display-lblCalldate").html($("#lblCalldate").html());
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
            $(".display-lblAgentClient").html($("#lblAgentClient").html());
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

            if (!$(".ac-islive").is(":checked")) {
                $(".ac-save").attr("value", "Update/Send");
            }
            else {
                $(".ac-save").attr("value", "Update");
            }

            $(".ac-save").show();
            $(".ac-delete").show();
            $(".ac-close").show();
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
                    alert("ERROR:" + json.msg);
                }
                else {
                    if (!a$.exists(json.formId)) {
                        alert("Setup failed, contact TPO tech services (Jeff Gackenheimer).");
                    }
                    else {
                        //Do an "Update" (or submit) here instead of reload to create db records of the new fields.
                        //location.reload();
                        $(".ac-submit").trigger("click"); //Saves everything in place.
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
        });
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

    ko.postbox.subscribe("nativeCallLoad", function() {
        load(true);
    });

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

function resize_init() {
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

})();





