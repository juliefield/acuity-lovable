$(document).ready(function () {
    var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
    var acknowledgingnow = false;
    var AgentHasAcknowledged = false;
    var client = $("#lblClient").html();
    var formid = $("#lblFormId").html(); //DONE: Retrieve from qafrm (sqf_code field).
    var mykpi = $("#lblKPI").html();

    var state = "Not Determined";

    var initialscore = "";

    //ATTACHMENTS ********************************

    //alert("debug: Special Auth = " + $("#lblSpecialAuth").html());

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
            /*
            var hf = document.createElement("input");
            hf.setAttribute("type", "hidden");
            hf.setAttribute("name", "downloadtype");
            hf.setAttribute("value", downloadtype);
            form.appendChild(hf);
            hf = document.createElement("input");
            hf.setAttribute("type", "hidden");
            hf.setAttribute("name", "downloadfilename");
            hf.setAttribute("value", downloadfilename);
            form.appendChild(hf);
            hf = document.createElement("input");
            hf.setAttribute("type", "hidden");
            hf.setAttribute("name", "csvBuffer");
            hf.setAttribute("value", html);
            form.appendChild(hf);
            */
            document.body.appendChild(form);
            form.submit();


            return false;
        });
    }
    //if ($("#lblViewer").html() == "jeffgack") {
    if ($("#lblMode").html() != "new") {
        $(".attachments").show();
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
                //TODO: This assumes it's a jpg, you need to call to get the actual name, something like this:
                //$(".fan-avatar").html('<IMG SRC="avatars/' + json.avatarFilename + '" />');
            });
        });
    }
    setupDownload();

    //END ATTACHMENTS **************************

    $(".mon-acknowledge").bind("click", function () {
        var foundempty = false;
        $(".agent-dispute-finding").each(function () {
            if ($(this).val().trim() == "") {
                if ($(this).is(":visible")) {
                    foundempty = true;
                    $(this).css("border", "2px solid red");
                }
            }
        });
        if (foundempty) {
            alert("You must enter comments if you dispute a finding");
            return false;
        }

        var foundchecked = false;
        var foundany = false;
        $(".dispute-finding-check").each(function () {
            if ($(this).is(":visible")) {
                foundany = true;
                if ($(this).is(":checked")) {
                    foundchecked = true;
                }
            }
        });
        if (foundany) {
            if (!foundchecked) {
                alert("If you disagree with the finding, you must select at least one finding to dispute.");
                return false;
            }
        }


        //SAVE THE MONITOR IN THE CASE OF PERFORMANT RECOVERY!!!  This is a bit different.
        acknowledgingnow = true;
        $(".mon-submit").trigger("click"); //Saves everything in place.
        return false;
    });
    $(".mon-submit").bind("click", function () {
        //Gather all of your variables to be passed to saveQaForm

        var emailtoagent = false;

        if ($(".date-editable").css("display") != "none") {
            var dm = "ERROR: Date is not in valid format, please correct before submitting the form: ";
            if (!datepass($(".mon-sys-Callid-edit").val())) {
                alert(dm + $(".mon-sys-Callid-edit").val());
                return false;
            }
            if (!datepass($(".mon-sys-Calldate-edit").val())) {
                alert(dm + $(".mon-sys-Calldate-edit").val());
                return false;
            }
        }

        if ($(".qst-islive").is(":checked")) {
            if (initialscore != $(".mon-sys-score").html()) {
                var save = confirm("WARNING!\nYou have changed the score of a released monitor.\nIf this was intentional, then proceed with saving.\nOtherwise,click 'Cancel' and make the necessary corrections.\n\nThe original score was: " + initialscore + "\nThe current score is: " + $(".mon-sys-score").html());
                if (!save) {
                    return false;
                }
            }
        }

        var mykpi = 1;
        if ($(this).attr("id") == "confirmme") {
            $(".qst-agentconfirm").prop('checked', true);
        }
        else if ($(this).attr("id") == "acknowledgeme") {
            var foundempty = false;
            $(".agent-dispute-finding").each(function () {
                if ($(this).val().trim() == "") {
                    if ($(this).is(":visible")) {
                        foundempty = true;
                        $(this).css("border", "2px solid red");
                    }
                }
            });
            if (foundempty) {
                alert("You must enter comments if you dispute a finding");
                return false;
            }
            var foundchecked = false;
            var foundany = false;
            $(".dispute-finding-check").each(function () {
                if ($(this).is(":visible")) {
                    foundany = true;
                    if ($(this).is(":checked")) {
                        foundchecked = true;
                    }
                }
            });
            if (foundany) {
                if (!foundchecked) {
                    alert("If you disagree with at least one of the findings,\nyou must select at least one finding to dispute.");
                    return false;
                }
            }

        }
        else if ($(this).attr("id") == "compliancesubmit") {
            var foundempty = false;
            $(".qst-compliance-response").each(function () {
                if ($(this).val().trim() == "") {
                    if ($(this).is(":visible")) {
                        foundempty = true;
                        $(this).css("border", "2px solid red");
                    }
                }
            });
            $(".compliance-agree").each(function () {
                var myval = $('input[name="' + $(this).attr("name") + '"]:checked').val();
                if (!a$.exists(myval)) {
                    myval = "";
                }
                if (myval == "") {
                    if ($(this).is(":visible")) {
                        foundempty = true;
                        $(this).parent().css("border", "2px solid red");
                    }
                }
            });
            if (foundempty) {
                alert("Please provide a response to each Agent/Manager Disputed Item.");
                //$(".mgr-agree").parent().css("border", "2px solid red")
                //$(".manager-dispute-finding").css("border", "2px solid red").removeAttr("disabled");
                return false;
            }
        }
        else if ($(this).attr("id") == "managersubmit1") {
            var foundempty = false;
            $(".manager-dispute-finding").each(function () {
                if ($(this).val().trim() == "") {
                    if ($(this).is(":visible")) {
                        foundempty = true;
                        $(this).css("border", "2px solid red");
                    }
                }
            });
            $(".mgr-agree").each(function () {
                var myval = $('input[name="' + $(this).attr("name") + '"]:checked').val();
                if (!a$.exists(myval)) {
                    myval = "";
                }
                if (myval == "") {
                    if ($(this).is(":visible")) {
                        foundempty = true;
                        $(this).parent().css("border", "2px solid red");
                    }
                }
            });
            if (foundempty) {
                alert("You must select Valid/Invalid and Enter Comments\nfor each agent dispute.");
                //$(".mgr-agree").parent().css("border", "2px solid red")
                //$(".manager-dispute-finding").css("border", "2px solid red").removeAttr("disabled");
                return false;
            }
        }
        else if ($(this).attr("id") == "draftme") {
            if (!$(".qst-islive").is(":checked")) {
                $(".qst-islive").prop("checked", false);
            }
        }
        else {
            if (!$(".qst-islive").is(":checked")) {
                var d = new Date();
                $(".qst-timestamp-islive").val((d.toLocaleDateString() + " " + d.toLocaleTimeString()).replace(/\?/g, ""));
                //TODO: Send Message to Agent at this time!
                emailtoagent = true;
            }
            $(".qst-islive").prop("checked", true);
        }

        $(".mon-submit,.mon-delete,.mon-close").hide(); //Hide the buttons to prevent bouncing


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

        //TODO: Make a general way to do traverse.  I need to set this up specifically based on the wrappers in the interest of time.

        $(".call").each(function () {
            var m = { sec: 35, answers: [], multiple: [] };
            $(".qst-multiple", this).each(function () {
                var sec = $(this).attr("sec");
                if (sec == "35") {
                    var myval = $(this).val()
                    if ($(this).is("input")) {
                        if ($(this).attr("type") == "checkbox") {
                            myval = ($(this).is(":checked")) ? "Yes" : "No";
                        }
                    }
                    else if ($(this).attr("type") == "radio") {
                        myval = $('input[name="' + $(this).attr("name") + '"]:checked').val();
                        if (!a$.exists(myval)) {
                            myval = "";
                        }
                    }
                    else if ($(this).is("span")) {
                        myval = $(this).html();
                    }
                    m.answers.push({ friendlyname: $(this).attr("qst"), answertext: myval, score: 0, value: '', version: 0 });
                }
            });
            $(".finding", this).each(function () {
                var mm = { sec: 37, answers: [] };
                $(".qst-multiple", this).each(function () {
                    var myval = $(this).val();
                    var vis = true; //Super Clugue
                    if ($(this).attr("type") == "checkbox") {
                        myval = ($(this).is(":checked")) ? "Yes" : "No";
                    }
                    else if ($(this).attr("type") == "radio") {
                        myval = $('input[name="' + $(this).attr("name") + '"]:checked').val();
                        if (!a$.exists(myval)) {
                            myval = "";
                        }
                        if (!$(this).is(":visible")) {
                            vis = false;
                        }

                    }
                    else if ($(this).is("span")) {
                        myval = $(this).html();
                    }
                    if (vis) {
                        mm.answers.push({ friendlyname: $(this).attr("qst"), answertext: myval, score: 0, value: '', version: 0 });
                    }
                });
                m.multiple.push(mm);
            });
            mans.multiple.push(m);
        });


        var data = {
            lib: "qa",
            cmd: "saveQaForm",
            formId: formid,
            sqfCode: $("#lblSqfcode").html(),
            kpi: mykpi,
            kpiSet: [1],
            database: "C",
            examinee: $("#lblAgent").html(),
            score: $(".mon-sys-score").html().replace("%", ""),
            value: ($(".mon-sys-autofail").eq(0).css("display") != "none") ? "Auto Fail" : "",
            //answers: answers,
            mans: mans,
            callId: $("#lblCallid").html(),
            callDate: $("#lblCalldate").html(),
            callTime: "",
            clientDept: "",
            acknowledgement: false,
            performantRecovery: {
                emailtoagent: emailtoagent
            }
        };
        if ($("#lblMode").html() != "new") {
            data.monitorId = $("#lblMonitorId").html();
        }

        if ($(".date-editable").css("display") != "none") {
            if (($(".mon-sys-Callid-edit").val() != $("#show_lblCallid").html()) ||
                ($(".mon-sys-Calldate-edit").val() != $("#show_lblCalldate").html())) {
                if (confirm("NOTE: You have changed the audit period start/end dates.\n\nOld values: " + $("#show_lblCallid").html() + " - " + $("#show_lblCalldate").html() + "\nNew values: " + $(".mon-sys-Callid-edit").val() + " - " + $(".mon-sys-Calldate-edit").val() + "\n\nPlease be sure the new values are in a valid date format.\n\nAre you sure you want to make this change?")) {
                    data.newCallId = $(".mon-sys-Callid-edit").val();
                    data.newCallDate = $(".mon-sys-Calldate-edit").val();
                }
            }

            /*
            $(".date-editable").show();
            $(".mon-sys-Callid-edit").val($("#show_lblCallid").html());
            $(".mon-sys-Calldate-edit").val($("#show_lblCalldate").html());
            */
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
        //Intercept for CSR/MGR (since we're using the same reports sometimes).
        if ((($("#lblRole").html() == "CSR") || ($("#lblAgent").html() == $("#lblViewer").html()))
            || ($("#lblAuthorized_QA").html() != "Yes")) {
            window.close();
        }

        //Correct way - with Origin
        if (a$.gup("origin") == "report") {
            window.close();
        }
        else if ($("#lblMode").html() == "new") {
            window.location = "//" + a$.urlprefix() + "acuityapm.com/monitor/monitor.aspx";
        }
        else {
            window.location = "//" + a$.urlprefix() + "acuityapm.com/monitor/monitor_review.aspx";
        }
    }

    /*
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
    */

    var allsetup = false;

    /*
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
    //Read in the answers from getqaform.
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
    */

    $(".mon-table .qst-spectrum-number").bind("change", function () {
        setscore();
    });
    $(".mon-table .qst-comments").bind("change", function () {
        //Eliminate carriage returns right here.
        $(this).val($(this).val().replace(/(?:\r\n|\r|\n)/g, " "));
    });


    var form_answers = null;

    function form_load_answers() {
        $(".delete-li").unbind().bind("click", function () {
            $(this).parent().remove();
            client_setscore();
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
                    var selme = this;
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
                                                    bld += '<option score="' + fa[j].score + '" value="' + fa[j].value + '">' + fa[j].text + '</option>';
                                                }
                                            }
                                        }
                                        $(this).empty().append(bld);
                                        $("input", $(selme).parent().parent()).each(function () {
                                            if ($(this).attr("qst") == "Subcategory") {
                                                $(this).val("");
                                            }
                                        });
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
                                $("input", $(selme).parent().parent()).each(function () {
                                    if ($(this).attr("qst") == "Subcategory") {
                                        $(this).val("");
                                    }
                                });
                            }
                        });
                    }

                    //See if IRSSelected or not.
                    var irs_selected = false;
                    $("input", $(selme).parent().parent()).each(function () {
                        if ($(this).attr("qst") == "IRSSelected") {
                            if ($(this).is(":checked")) {
                                if ($(this).val() == "Yes") {
                                    irs_selected = true;
                                }
                            }
                        }
                    });

                    //Scoring section for when PerformantCategory/PerformantSubCategoryIRSCategory/IRSSubcategory are changed.
                    if ((!irs_selected) && (($(this).attr("qst") == "PerformantCategory") || ($(this).attr("qst") == "PerformantSubcategory"))) {
                        var me = this;
                        //Check the line score.
                        var score = -1;
                        $("select option:selected", $(this).parent().parent()).each(function () {
                            if (($(this).parent().attr("qst") == "PerformantCategory") || ($(this).parent().attr("qst") == "PerformantSubcategory"))
                                if ($(this).attr("score") != null) {
                                    score = $(this).attr("score");
                                }
                        });
                        if (score >= 0) {
                            $("input", $(this).parent().parent()).each(function () {
                                if ($(this).attr("qst") == "FindingPoints") {
                                    $(this).val(score);
                                    client_setscore();
                                }
                            });
                        }
                        //Load the Category/Subcategory Inputs.
                        $("input", $(this).parent().parent()).each(function () {
                            if ($(this).attr("qst") == $(me).attr("qst").replace("Performant", "")) {
                                $(this).val($(me).val());
                            }
                        });
                        //Check the call rollup score.

                    }
                    else if ((irs_selected) && (($(this).attr("qst") == "IRSCategory") || ($(this).attr("qst") == "IRSSubcategory"))) {
                        var me = this;
                        //Check the line score.
                        var score = -1;
                        $("select option:selected", $(this).parent().parent()).each(function () {
                            if (($(this).parent().attr("qst") == "IRSCategory") || ($(this).parent().attr("qst") == "IRSSubcategory"))
                                if ($(this).attr("score") != null) {
                                    score = $(this).attr("score");
                                }
                        });
                        if (score >= 0) {
                            $("input", $(this).parent().parent()).each(function () {
                                if ($(this).attr("qst") == "FindingPoints") {
                                    $(this).val(score);
                                    client_setscore();
                                }
                            });
                        }
                        //Load the Category/Subcategory Inputs.
                        $("input", $(this).parent().parent()).each(function () {
                            if ($(this).attr("qst") == $(me).attr("qst").replace("IRS", "")) {
                                $(this).val($(me).val());
                            }
                        });
                        //Check the call rollup score.
                    }
                });
            }
        });
    }

    function client_bld_call(me) {
        var bld = '<li class="call">Client: <select class="qst-multiple" sec="35" qst="ClientName" style="width:300px;" /></select> Call Identifier: <input type="text" class="qst-multiple" sec="35" qst="CallIdentifier" value=""> / Artiva Account ID: <input type="text" class="qst-multiple" sec="35" qst="ArtivaID" value=""> / Eureka ID: <input type="text" class="qst-multiple" sec="35" qst="EurekaID" value="">';
        bld += ' - Point Total: <span class="call-points qst-multiple" sec="35" style="font-weight:bold;" class="qst-multiple" sec="35" qst="CallPoints">0</span>';
        bld += '<span class="delete-link delete-li" style="padding-left:10px;" title="Remove Call">X</span>';
        bld += '<br><ul><li class="add-link finding-add">Add Finding</li></ul></li>';
        $(me).before(bld);
        $(".finding-add").unbind().bind("click", function () {
            client_bld_finding(this);
            if (form_answers != null) {
                form_load_answers();
            }
        });

    }

    var agr = 0;
    function client_bld_finding(me) {
        var secondary = $("table", $(me).parent()).length;
        var rbld = '<tr class="finding"><td><div style="width:300px;"></div>' + ((secondary) ? "<b>Internal Category</b><br />" : "") + '<input class="qst-multiple qst-hideme" sec="37" secparent="35" qst="Category" style="width:300px;display:none;" /><input type="radio" sec="37" class="irs-selected ac-irshide" checked="checked" id="irs_selected' + agr + '" name="irs_selected' + agr + '" value="No" /><select class="qst-multiple" sec="37" secparent="35" qst="PerformantCategory" style="width:285px;" /></select><br /><b class="ac-irshide">Client Category</b><br /><input type="radio" sec="37" class="qst-multiple irs-selected ac-irshide" id="irs_selected' + agr + '" name="irs_selected' + agr + '" qst="IRSSelected" value="Yes" /><select class="qst-multiple ac-irshide" sec="37" secparent="35" qst="IRSCategory" style="width:285px;" /></select><div class="dispute-finding-select" style="' + (($("#lblSqfcode").html() == "1") ? "margin-top:5px;" : "") + '"><input class="dispute-finding-check qst-multiple" type="checkbox" qst="AgentDispute" /><span class="dispute-finding-label" style="color:darkred;">Dispute this finding</span></div><div class="dispute-finding dispute-finding-label dispute-finding-prompt" style="color:darkred;font-weight:bold;">Enter your dispute in the box provided</div><div class="dispute-finding" style="margin-top:4px;">Agent Dispute<br /><textarea class="agent-dispute-finding qst-multiple" qst="AgentRebuttal" style="height:30px;width:calc(100% - 15px);"></textarea></div></td><td>' + ((secondary) ? "<b>Internal SubCategory</b><br />" : "") + '<input class="qst-multiple" sec="37" secparent="35" qst="Subcategory" style="width:300px;display:none;" /><select class="qst-multiple" sec="37" secparent="35" qst="PerformantSubcategory" style="width:300px;"></select><br /><b class="ac-irshide">Client SubCategory</b><select class="qst-multiple ac-irshide" sec="37" secparent="35" qst="IRSSubcategory" style="width:300px;"></select><div class="dispute-finding" style="padding-top:4px;"><br /><div style="display:block;' + (($("#lblSqfcode").html() == "1") ? "margin-top:-10px;" : "") + '">Manager<span style="padding-left: 40px;">Dispute is:&nbsp; <input type="radio" sec="37" class="qst-multiple mgr-agree" id="mgr_agree' + agr + '" name="mgr_agree' + agr + '" qst="MgrAgree" value="Yes" /><label for="mgr_agree' + agr + '">Valid</label>&nbsp;<input type="radio" id="mgr_disagree' + agr + '" class="mgr-agree" name="mgr_agree' + agr + '" value="No" /><label for="mgr_disagree' + agr + '" >Invalid</label></span><br />Comments</div><div class="dispute-finding"><textarea class="manager-dispute-finding qst-multiple" qst="MgrComments" style="height:30px;width:calc(100% - 15px);"></textarea></div></td><td>' + ((secondary) ? "<b>Comments</b><br />" : "") + '<textarea style="height:30px;width:calc(100% - 15px);" class="qst-multiple" sec="37" secparent="35" qst="FindingComment" ></textarea><div class="dispute-finding" style="' + (($("#lblSqfcode").html() == "1") ? "margin-top:25px;" : "") + '">Compliance&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" sec="37" class="qst-multiple compliance-agree" id="compliance_agree' + agr + '" name="compliance_agree' + agr + '" qst="ComplianceAgree" value="Yes" /><label for="compliance_agree' + agr + '">Agree</label>&nbsp;<input type="radio" id="compliance_disagree' + agr + '" class="compliance-agree" name="compliance_agree' + agr + '" value="No" /><label for="compliance_disagree' + agr + '" >Disagree</label></span>&nbsp;&nbsp;&nbsp;<input type="checkbox" class="qst-multiple qst-dispute-removed" qst="DisputeRemoved" /> Removed<br />Response</div><div class="dispute-finding"><textarea class="qst-multiple qst-compliance-response" style="height:30px;width:calc(100% - 15px);" qst="QARebuttalResponse"></textarea></div></td><td>' + ((secondary) ? "<b>Points</b><br />" : "") + '<input style="width:70px;" type="text" class="finding-points qst-multiple" sec="37" secparent="35"  qst="FindingPoints"></td><td><span class="delete-link delete-tr" title="Remove Finding">X</span></td></tr>';
        agr += 1;
        if (secondary) {
            $("table", $(me).parent()).append(rbld);
        }
        else {
            var bld = '<li><table class="finding-table"><tbody><tr><th>Internal Category</th><th>Internal SubCategory</th><th style="width:50%">Comments</th><th style="width:70px;">Points</th><th>&nbsp;</th>';
            bld += rbld;
            bld += '<tbody></table></li>';
            $(me).before(bld);
            $("textarea").keyup(function () {
                $(this).val($(this).val().replace(/(?:\r\n|\r|\n)/g, " "));
            });
        }
        if ($("#lblSqfcode").html() != "1") {
            $(".ac-irshide").hide();
        }
        $(".delete-tr").unbind().bind("click", function () {
            var mytable = $(this).parent().parent().parent().parent();
            $(this).parent().parent().remove();
            if ($("tbody", mytable).children().length <= 1) {
                $(mytable).parent().remove(); //Get the LI as well
            }
            client_setscore();
        });
        $(".finding-points").unbind().bind("change", function () {
            client_setscore();
        });
        $(".irs-selected").unbind().bind("click", function () {
            $("select", $(this).parent().parent()).each(function () {
                if (($(this).attr("qst") == "PerformantSubcategory") || ($(this).attr("qst") == "IRSSubcategory")) {
                    $(this).trigger("change");
                }
            });
        });
        if (form_answers != null) {
            form_load_answers();
        }
    }

    function client_action_init() {
        $(".call-add").unbind().bind("click", function () {
            client_bld_call(this);
            if (form_answers != null) {
                form_load_answers();
            }
        });
        client_setscore();
        $("#findings_dispute").unbind().bind("click", function () {
            $(".dispute-finding-select").show();
            $(".dispute-finding-check").each(function () {
                $(this).trigger("change");
            });
            init_control();
            $(".mon-show-isagent").show();
        });
        $(".qst-qaaudit").unbind().bind("change", function () {
            if ($(this).is(":checked")) {
                $(".qst-qaauditshow").show();
            }
            else {
                $(".qst-qaauditshow").hide();
            }
        });
        $(".qst-qaaudit").trigger("change");

        $("#findings_agree").unbind().bind("click", function () {
            $(".dispute-finding-select").hide();
            $(".dispute-finding").hide();
            init_control();
            $(".mon-show-isagent").show();
            var d = new Date();
            if ($(".qst-timestamp-agentagreeall").val() == "") {
                $(".qst-timestamp-agentagreeall").val((d.toLocaleDateString() + " " + d.toLocaleTimeString()).replace(/\?/g, ""));
            }
        });
        $(".dispute-finding-check").unbind().bind("change", function () {
            if ($(this).prop("checked") == true) {
                $(".dispute-finding", $(this).parent().parent().parent()).show();
            }
            else {
                $(".dispute-finding", $(this).parent().parent().parent()).hide();
            }
            var d = new Date();
            if ($(".qst-timestamp-agentagreeall").val() == "") {
                $(".qst-timestamp-agentagreeall").val((d.toLocaleDateString() + " " + d.toLocaleTimeString()).replace(/\?/g, ""));
            }
        });

        $(".qst-correctiveactioncomplete").unbind().bind("change", function () {
            if ($(this).is(":checked")) {
                var d = new Date();
                $(".qst-timestamp-correctiveactioncomplete").val((d.toLocaleDateString() + " " + d.toLocaleTimeString()).replace(/\?/g, ""));
            }
            else {
                $(".qst-timestamp-correctiveactioncomplete").val("");
            }
        });
        $(".qst-agentconfirm").unbind().bind("change", function () {
            if ($(this).is(":checked")) {
                var d = new Date();
                $(".qst-timestamp-agentcorrectiveactionconfirmed").val((d.toLocaleDateString() + " " + d.toLocaleTimeString()).replace(/\?/g, ""));
            }
            else {
                $(".qst-timestamp-agentcorrectiveactionconfirmed").val("");
            }
        });

        if ($("#findings_dispute").eq(0).prop("checked") == true) {
            $("#findings_dispute").trigger("click");
        }
        $(".esc-check").unbind().bind("click", function () {
            if ($(this).is(":checked")) {
                var d = new Date();
                $(".esc-date").val((d.toLocaleDateString() + " " + d.toLocaleTimeString()).replace(/\?/g, ""));
            }
            else {
                $(".esc-date").html("");
            }
        });


        var rval = $('input[name="agent_dispute"]:checked').val();
        if (a$.exists(rval)) {
            AgentHasAcknowledged = true;
        }

        //Handle state-based displays

        //AgentAcknowledgementRequired.
        //AgentAgreeAll
        //MgrCorrectiveActionComplete
        //AgentCorrectiveActionConfirmed        


        var AUTHORIZED = true;

        var AgentAcknowledgementRequired = true;

        if (($("#lblMode").html() == "new") && ($("#lblSpecialAuth").html() == "")) {
            AUTHORIZED = false;
            alert("No authorization found to create new monitors for user: " + $.cookie("username"));
        }

        //TODO: For PCI, this may need to be handled server-side (not difficult).
        if (true) {
            if ($("#lblMonitorAuth").html() != "Yes") {
                AUTHORIZED = false;
                alert($.cookie("username") + " is not authorized to view monitors of type: " + $("#lblSqfname").html());
            }
            if ($("#lblCSRAuth").html() != "Yes") {
                AUTHORIZED = false;
                alert("Agent " + $("#lblAgentName").html() + " (" + $("#lblAgent").html() + " ) is not authorized to be evaluated with monitor: " + $("#lblSqfname").html());
            }
        }

        var nodraftview = false;

        if ($("#lblSpecialAuth").html() == "") {
            nodraftview = true;
        }

        if (nodraftview) {
            if (!$(".qst-islive").is(":checked")) {
                AUTHORIZED = false;
                alert("This monitor is in draft mode and not ready to view.\nIt may be released at a later date.");
            }
        }

        if (AUTHORIZED) {
            $(".monitor-view").show();
        }
        else {
            return_to_v1();
        }

        if (!$(".qst-correctiveactioncomplete").eq(0).is(":checked")) {
            $(".agent-confirmation").hide();
        }
        else {
            $(".qst-agentconfirm").attr("disabled", "disabled");
            $('input[name="agent_dispute"]').attr("disabled", "disabled");
            $(".mon-show-acknowledgementreceived").hide();
            if (($("#lblRole").html() == "CSR") || ($("#lblAgent").html() == $("#lblViewer").html())) {
                $("#acknowledgeme").hide();
                $(".dispute-finding-check").attr("disabled", "disabled");
                $(".agent-dispute-finding").attr("disabled", "disabled");
                if (!$(".qst-agentconfirm").eq(0).is(":checked")) {
                    $(".qst-agentconfirm").removeAttr("disabled");
                    $(".mon-show-confirm-button").show();
                }
            }
        }
        if ($(".qst-timestamp-agentagreeall").val() != "") {
            $(".timestamp-agentagreeall").show();
        }
        if ($(".qst-timestamp-correctiveactioncomplete").val() != "") {
            $(".timestamp-correctiveactioncomplete").show();
        }
        if ($(".qst-timestamp-agentcorrectiveactionconfirmed").val() != "") {
            $(".timestamp-agentcorrectiveactionconfirmed").show();
        }

        if (!$(".qst-islive").is(":checked")) {
            $(".qst-draft").show();
        }
        else {
            $(".qst-draft").hide();
            $(".qst-live-timestamp").show();
        }

        //Determine the state and set it.
        if (!$(".qst-islive").is(":checked")) {
            state = "In Draft";
        }
        else if (!$(".finding").length) {
            state = "Complete (No Findings)";
        }
        else {
            var agentagree = $('input[name="agent_dispute"]:checked').val();
            if (agentagree == null) {
                state = "Pending Agent Review";
            }
            else {
                var foundagentdispute = false;
                $(".dispute-finding-check").each(function () {
                    if ($(this).is(":visible")) {
                        if ($(this).prop("checked")) {
                            foundagentdispute = true;
                        }
                    }
                });
                if (foundagentdispute) {
                    state = "Pending Dispute Review";
                    var foundvalid = false;
                    var foundnull = false;
                    var foundinvalid = false;
                    $(".mgr-agree").each(function () {
                        if ($(this).is(":visible")) {
                            var nm = $(this).prop("name");
                            var mgragree = $('input[name="' + nm + '"]:checked').val();
                            if (mgragree == null) {
                                foundnull = true;
                            }
                            else if (mgragree == "Yes") {
                                foundvalid = true;
                            }
                            else if (mgragree == "No") {
                                foundinvalid = true;
                            }
                        }
                    });
                    if (foundnull) {
                        state = "Pending Dispute Review by Manager";
                    }
                    else if (foundvalid) {
                        var foundblank = false;
                        $(".qst-compliance-response").each(function () {
                            if ($(this).is(":visible")) {
                                if ($(this).val().trim() == "") {
                                    foundblank = true;
                                }
                            }
                        });
                        if (foundblank) {
                            state = "Pending Compliance Review";
                        }
                        else {
                            state = "Pending Corrective Action";
                        }

                    }
                    else if (foundinvalid) {
                        state = "Pending Corrective Action";
                    }
                    else {
                        state = "Invalid State 43";
                    }
                }
                if (state == "Pending Corrective Action") {
                    if ($(".qst-correctiveactioncomplete").eq(0).prop("checked")) {
                        state = "Pending Agent CAR Confirmation";
                        if ($(".qst-agentconfirm").eq(0).prop("checked")) {
                            state = "Complete";
                        }
                    }
                }
            }
        }
        $(".monitor-state").html(state);
        if ((state == "Complete (No Findings)") || (state == "Not Determined")) {
            $(".monitor-state").hide();
        }
    }

    function client_load_init(mans) {
        //TODO: Put in special loading code.
        var r1 = -1;
        var r2 = -1
        var cel, fel; //Call Element, Findings Element
        if (a$.exists(mans)) {
            if (a$.exists(mans.multiple)) {
                for (m1 in mans.multiple) {
                    if (mans.multiple[m1].r1 > r1) {
                        r1 = mans.multiple[m1].r1;
                        client_bld_call($(".call-add").eq($(".call-add").length - 1));
                        if (form_answers != null) {
                            form_load_answers();
                        }
                        cel = $(".call").eq(r1);
                    }
                    $(".qst-multiple", cel).each(function () {
                        var qst = $(this).attr("qst");
                        for (var i in mans.multiple[m1].answers) {
                            if (mans.multiple[m1].answers[i].friendlyname == qst) {
                                if ($(this).attr("type") == "checkbox") {
                                    if (mans.multiple[m1].answers[i].answertext == "Yes") {
                                        $(this).prop("checked", true);
                                    }
                                }
                                else if ($(this).attr("type") == "radio") {
                                    $('input[name="' + $(this).attr("name") + '"]').each(function () {
                                        if ($(this).val() == mans.multiple[m1].answers[i].answertext) {
                                            $(this).prop("checked", true);
                                        }
                                    });
                                }
                                else {
                                    $(this).val(mans.multiple[m1].answers[i].answertext);
                                }
                                break;
                            }
                        }
                    });
                    if (exists(mans.multiple[m1].multiple)) {
                        r2 = -1;
                        for (m2 in mans.multiple[m1].multiple) {
                            if (mans.multiple[m1].multiple[m2].r2 > r2) {
                                r2 = mans.multiple[m1].multiple[m2].r2;
                                client_bld_finding($(".finding-add").eq($(".finding-add").length - 1));
                                fel = $(".finding").last();
                                $(".qst-multiple", fel).each(function () {
                                    var qst = $(this).attr("qst");
                                    for (var i in mans.multiple[m1].multiple[m2].answers) {
                                        if (mans.multiple[m1].multiple[m2].answers[i].friendlyname == qst) {
                                            if ($(this).attr("type") == "checkbox") {
                                                if (mans.multiple[m1].multiple[m2].answers[i].answertext == "Yes") {
                                                    $(this).prop("checked", true);
                                                }
                                            }
                                            else if ($(this).attr("type") == "radio") {
                                                $('input[name="' + $(this).attr("name") + '"]').each(function () {
                                                    if ($(this).val() == mans.multiple[m1].multiple[m2].answers[i].answertext) {
                                                        $(this).prop("checked", true);
                                                    }
                                                });
                                            }
                                            else {
                                                $(this).val(mans.multiple[m1].multiple[m2].answers[i].answertext);
                                                if ($(this).prop("tagName") == "SELECT") {
                                                    $(this).trigger("change");
                                                }
                                            }
                                            break;
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
            }
        }
        client_action_init();
        init_control();
        return;
    }

    function datepass(testdate) {
        var d = new Date(testdate);
        if (isNaN(d.getTime())) {
            return false;
        }
        return true;
    }

    function load() {
        if (form_answers != null) {
            form_load_answers();
        }
        if ($("#lblMode").html() == "new") {
            //Throw out bad dates before getting started.
            var dm = "ERROR: Date is not in valid format: ";
            if (!datepass($("#lblCalldate").html())) {
                alert(dm + $("#lblCalldate").html());
                return_to_v1();
            }
            if (!datepass($("#lblCallid").html())) {
                alert(dm + $("#lblCallid").html());
                return_to_v1();
            }

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
                alert("ERROR:" + json.msg);
            }
            else {
                //Attachments first
                for (var i in json.attachments) {
                    $(".attachments-list").append('&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" class="attachment-download" atid="' + json.attachments[i].id + '">' + json.attachments[i].filename.replace(/ -/g, "&nbsp;") + '</a>');
                }
                setupDownload();

                //TODO: Load the cascading form
                $(".qst").each(function () {
                    var qst = $(this).attr("qst");
                    for (var i in json.form.mans.answers) {
                        if (json.form.mans.answers[i].friendlyname == qst) {
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
                            else {
                                $(this).val(json.form.mans.answers[i].answertext);
                            }
                            break;
                        }
                    }
                });
                client_load_init(json.form.mans); //TODO: Fake for now, put in after GetQAForm base work.
            }
        }
    }

    function init() {
        /*
        var editor = CodeMirror(document.getElementById("MonitorHTMLEditor"), {
        lineNumbers: true,
        mode: "text/html",
        extraKeys: { "Ctrl-Space": "autocomplete" },
        value: document.getElementById("MonitorCSSContent").innerHTML
        });
        */

        //Back-end populated commonly displayable
        $("#show_lblSqfname").html($("#lblSqfname").html());
        $("#show_lblCalldate").html($("#lblCalldate").html());
        $("#show_lblSupervisorName").html($("#lblSupervisorName").html());
        $("#show_lblCallid").html($("#lblCallid").html());
        $("#show_lblMonitorId").html($("#lblMonitorId").html());

        $("#show_lblAgentGroupName").html($("#lblAgentGroupName").html());
        $("#show_lblAgentLocationName").html($("#lblAgentLocationName").html());
        $("#show_lblAgentName").html($("#lblAgentName").html());
        $("#show_lblAgent").html($("#lblAgent").html());
        $("#show_lblAcknowledgementDate").html($("#lblAcknowledgementDate").html());
        $("#show_lblCurrentDate").html($("#lblCurrentDate").html());
        $("#show_lblQA").html($("#lblQA").html());
        $("#show_lblAgentTeamLeaderName").html($("#lblAgentTeamLeaderName").html());
        $("#show_lblAgentTeamLeader").html($("#lblAgentTeamLeader").html());
        $("#show_lblAgentGroupLeaderName").html($("#lblAgentGroupLeaderName").html());
        $("#show_lblAgentGroupLeader").html($("#lblAgentGroupLeader").html());
        $("#show_lblAgentManager").html($("#lblAgentManager").html());
        $("#show_lblAgentGroup").html($("#lblAgentGroup").html());
        $("#show_lblManagers").html($("#lblManagers").html());
        $("#show_lblDMs").html($("#lblDMs").html());
        $("#show_lblTMs").html($("#lblTMs").html());
        $("#show_lblAgentHireDate").html($("#lblAgentHireDate").html());
        $("#show_lblLetterTypes").html($("#lblLetterTypes").html());
        $("#show_lblClientDept").html($("#lblClientDept").html());
        $("#show_lblNextMonday").html($("#lblNextMonday").html());
        $("#show_inputReleaseDate").html($("#inputReleaseDate").html());

        $("#show_lblAgentExtension").html($("#lblAgentExtension").html());
        $("#show_lblAgentClient").html($("#lblAgentClient").html());
        $("#show_lblPrevScore").html($("#lblPrevScore").html());
        $("#show_lbl90Score").html($("#lbl90Score").html());

        var teamleader = $("#lblAgentTeamLeader").html();
        var groupleader = $("#lblAgentGroupLeader").html();
        var manager = $("#lblAgentManager").html();

        var mgrs = $("#lblManagers").html();
        var mgrss = mgrs.split("|");
        for (var m in mgrss) {
            var ms = mgrss[m].split("~");
            $(".combo-manager").append('<option ' + ((ms[0] == manager) ? "selected" : "") + ' value="' + ms[0] + '">' + ms[1] + "</option>");
        }
        mgrs = $("#lblDMs").html();
        mgrss = mgrs.split("|");
        for (var m in mgrss) {
            var ms = mgrss[m].split("~");
            $(".combo-groupleader").append('<option ' + ((ms[0] == groupleader) ? "selected" : "") + ' value="' + ms[0] + '">' + ms[1] + "</option>");
        }
        mgrs = $("#lblTMs").html();
        mgrss = mgrs.split("|");
        for (var m in mgrss) {
            var ms = mgrss[m].split("~");
            $(".combo-teamleader").append('<option ' + ((ms[0] == teamleader) ? "selected" : "") + ' value="' + ms[0] + '">' + ms[1] + "</option>");
        }

        //TODO: Load Definitions (for the dropdowns, with cascades, somehow).
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

    function client_setscore() { //TODO: Make the score work.

        $(".delete-li").unbind().bind("click", function () {
            $(this).parent().remove();
            client_setscore();
        });

        if ($(".qst-islive").is(":checked")) {
            $(".delete-li,.delete-tr,.finding-add,.call-add").hide();
        }

        var score = 0;
        var autofail = false;
        var scoreerror = false;

        $(".call").each(function () {
            var callpoints = 0;
            $(".finding-points", this).each(function () {
                var mypoints = parseFloat($(this).val());
                if (mypoints > callpoints) callpoints = mypoints;
            });
            //call-points span
            $(".call-points", this).html(callpoints);
        });
        $(".call-points").each(function () {
            var mypoints = parseFloat($(this).html());
            score += mypoints;
        });

        /*
        //Questions where a "No" value make it 60%
        var qs = ["1", "2.1", "3", "4.1", "5.1", "6.1"];

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
        */

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
            $(".mon-sys-score").html(score.toFixed(2));
        }

        //Find CLX System Ref #
        if (($(".qst-spectrum-number").eq(0).val() == "") || scoreerror) {
            $(".mon-submit").attr("disabled", "disabled");
        }
        else {
            $(".mon-submit").removeAttr("disabled");
        }


    }
    client_setscore();

    function init_control() {

        if ($("#lblMode").html() == "new") {
            $('input[name="agent_dispute"]').attr("disabled", "disabled");
            $(".manager-corrective-action").hide();
            $(".agent-acknowledgement").hide(); //?
            $(".agent-confirmation").hide(); //?
            $("#submitme").show();
            $("#closeme").show();
            $(".compliance-agree,.qst-dispute-removed").attr("disabled", "disabled");
        }
        else if (($("#lblRole").html() == "CSR") || ($("#lblAgent").html() == $("#lblViewer").html())) {
            $(".irs-selected").attr("disabled", "disabled");
            $("#submitme").hide();
            $(".manager-corrective-action").hide();
            $("select").attr("disabled", "disabled");
            $("textarea").attr("disabled", "disabled");
            $("input:text").attr("disabled", "disabled");
            $(".qst-correctiveactioncomplete").attr("disabled", "disabled");
            $(".audit-types input").attr("disabled", "disabled");
            $(".esc-check").attr("disabled", "disabled");
            $(".mgr-agree").attr("disabled", "disabled");
            $(".add-link,.delete-link").hide();
            $("#closeme").show();
            $("#deleteme").hide();
            $(".compliance-agree,.qst-dispute-removed").attr("disabled", "disabled");

            if ($(".qst-islive").is(":checked")) {
                if (AgentHasAcknowledged) {
                    //if ($("#lblAcknowledgementDate").html() != "") {
                    $(".dispute-finding-check").attr("disabled", "disabled");
                    $(".mon-show-acknowledgementreceived").show();
                    if (AgentHasAcknowledged) {
                        $('input[name="agent_dispute"]').attr("disabled", "disabled");
                    }
                    $(".manager-corrective-action").show();
                    $(".mon-show-isagent").hide();
                }
                else if ($("#lblAcknowledgementRequired").html() == "Yes") {
                    if (!$(".qst-correctiveactioncomplete").eq(0).is(":checked")) {
                        $(".agent-dispute-finding").removeAttr("disabled");
                    }
                    $(".mon-show-acknowledgementrequired").show();
                    if (AgentHasAcknowledged) {
                        $(".mon-show-isagent").show();
                    }
                    else {
                        $(".mon-show-isagent").hide();
                    }
                }
                else {
                    $(".agent-dispute-finding").removeAttr("disabled");
                }
            }
            else {
                $(".mon-show-acknowledgementreceived").hide();
                $(".mon-show-acknowledgementrequired").hide();
            }
        }
        //else if ($("#lblRole").html() == "CorpAdmin") { //Surrogate Manager
        else if (($("#lblViewer").html() == $(".combo-groupleader").val()) ||
            ($("#lblViewer").html() == $(".combo-teamleader").val())) {
            //else if ($("#lblAuthorized_QA").html() != "Yes") {
            $(".dispute-finding-check").attr("disabled", "disabled");
            $(".irs-selected").attr("disabled", "disabled");
            //$("#submitme").hide();
            $(".compliance-agree,.qst-dispute-removed").attr("disabled", "disabled");
            $(".audit-types input").attr("disabled", "disabled");
            $(".esc-check").attr("disabled", "disabled");
            $(".qst-agentconfirm").attr("disabled", "disabled");
            if (!AgentHasAcknowledged) {
                $(".agent-acknowledgement").hide();
            }
            else {
                $(".agent-acknowledgement").show();
            }
            $("#acknowledgeme").hide();

            $("select").attr("disabled", "disabled");
            $("textarea").attr("disabled", "disabled");
            $("input:text").attr("disabled", "disabled");
            $(".add-link,.delete-link").hide();
            $("#closeme").show();
            $("#deleteme").hide();
            $(".dispute-finding-check").attr("disabled", "disabled");
            if ($(".qst-islive").is(":checked")) {
                if (AgentHasAcknowledged) {
                    $(".mon-show-acknowledgementreceived").show();
                    $('input[name="agent_dispute"]').attr("disabled", "disabled");
                    $(".mon-show-isnotagent").hide();

                    var ManagerSubmittedToCompliance = true;
                    var ComplianceNeeded = false;
                    $(".manager-dispute-finding").each(function () {
                        if ($(this).is(":visible")) {
                            if ($(this).val().trim() == "") {
                                ManagerSubmittedToCompliance = false;
                            }
                            if ($(this).val().trim() == "Yes") {
                                ComplianceNeeded = true;
                            }
                        }
                    });
                    ComplianceNeeded = true; //DEBUG

                    if (!ManagerSubmittedToCompliance) {
                        $(".mon-show-ismanager1").show();
                        $("#submitme").hide();
                        //$(".mgr-agree").parent().css("border", "1px solid red")
                        $(".mgr-agree").removeAttr("disabled");
                        $(".manager-dispute-finding").css("border", "1px solid red").removeAttr("disabled");

                        $(".manager-corrective-action textarea,.manager-corrective-action input").attr("disabled", "disabled");
                    }
                    else {
                        //TODO: See if Compliance has Replied
                        var ComplianceComplete = true;
                        $(".qst-compliance-response").each(function () {
                            if ($(this).is(":visible")) {
                                if ($(this).val().trim() == "") {
                                    ComplianceComplete = false;
                                }
                            }
                        });

                        if ((!ComplianceNeeded) || ComplianceComplete) {
                            $(".manager-corrective-action textarea,.manager-corrective-action input").css("border", "1px solid red").removeAttr("disabled");
                        }
                        else {
                            if (state == "Pending Compliance Review") {
                                alert("This monitor is awaiting review/completion by Compliance");
                                $(".manager-corrective-action textarea,.manager-corrective-action input").attr("disabled", "disabled");
                            }
                            else if (state == "Pending Corrective Action") {

                                $(".qst-correctiveactioncomplete").removeAttr("disabled");
                                $("#MgrCorrectiveActionComments").removeAttr("disabled");

                            }
                        }

                    }

                }
                else {
                    $(".mon-show-acknowledgementrequired").show();
                    $(".mon-show-isnotagent").show();

                    //$(".mgr-agree").parent().css("border", "1px solid red")
                    $(".mgr-agree").attr("disabled", "disabled");
                    $(".manager-dispute-finding").attr("disabled", "disabled");

                    $(".manager-corrective-action textarea,.manager-corrective-action input").attr("disabled", "disabled");
                    $(".qst-timestamp-correctiveactioncomplete").attr("disabled", "disabled").css("border", "");

                }
                $(".qst-timestamp-correctiveactioncomplete").attr("disabled", "disabled").css("border", "");
                $(".dispute-finding-label").css("color", "black").css("font-weight", "normal"); //eye roll
            }
            else {
                $(".mon-show-acknowledgementreceived").hide();
                $(".mon-show-acknowledgementrequired").hide();
            }
            $(".dispute-finding-prompt").hide();
        }
        else {
            if ($("#lblSpecialAuth").html() == "") {
                alert("Only the CSR, TM, DM, and Authorized Auditors/Admin may view this monitor.");
                return_to_v1();
            }
            $(".dispute-finding-check").attr("disabled", "disabled");
            if (!AgentHasAcknowledged) {
                $(".agent-acknowledgement").hide();
            }
            else {
                $(".agent-acknowledgement").show();
            }
            $("#acknowledgeme").hide();
            $(".mgr-agree").attr("disabled", "disabled");
            $('input[name="agent_dispute"]').attr("disabled", "disabled");
            $(".agent-dispute-finding").attr("disabled", "disabled"); //.css("border", "1px solid red");
            $(".qst-agentconfirm").attr("disabled", "disabled");
            $(".qst-correctiveactioncomplete").attr("disabled", "disabled");

            if (!$(".qst-islive").is(":checked")) {
                $("#submitme").attr("value", "Update/Send");
            }
            else {
                $("#submitme").attr("value", "Update");
            }

            var ManagerSubmittedToCompliance = true;
            var ComplianceNeeded = false;
            $(".manager-dispute-finding").each(function () {
                if ($(this).is(":visible")) {
                    if ($(this).val().trim() == "") {
                        ManagerSubmittedToCompliance = false;
                    }
                    if ($(this).val().trim() == "Yes") {
                        ComplianceNeeded = true;
                    }
                }
            });
            ComplianceNeeded = true; //DEBUG


            var ComplianceComplete = true;
            $(".qst-compliance-response").each(function () {
                if ($(this).is(":visible")) {
                    if ($(this).val().trim() == "") {
                        ComplianceComplete = false;
                    }
                }
            });

            //alert("debug: ComplianceNeeded=" + ComplianceNeeded + ",ComplianceComplete=" + ComplianceComplete);
            if (ManagerSubmittedToCompliance && ComplianceNeeded && (!ComplianceComplete)) {
                $(".compliance-agree,.qst-dispute-removed").removeAttr("disabled");
                $(".mon-show-complianceagree").show();
                $("#submitme").hide();
                $("#deleteme").hide();
            }
            else if ((!ComplianceNeeded) || ComplianceComplete) { //Free
                $("#submitme").show();
                $("#deleteme").show();
            }
            else {
                $(".compliance-agree,.qst-dispute-removed").attr("disabled", "disabled");
                $("#submitme").show();
                $("#deleteme").show();
            }
            $(".qst-dispute-removed").unbind().bind("click", function () {
                $(".finding-points", $(this).closest("tr")).val("0.0");
                client_setscore();
            });
            $(".dispute-finding-prompt").hide();


            $("#closeme").show();
            if ($(".qst-islive").is(":checked")) {
                if (AgentHasAcknowledged) {
                    //if ($("#lblAcknowledgementDate").html() != "") {
                    $(".mon-show-acknowledgementreceived").show();
                    $(".mon-show-isnotagent").hide();
                }
                else if ($("#lblAcknowledgementRequired").html() == "Yes") {
                    $(".mon-show-acknowledgementrequired").show();
                    $(".mon-show-isnotagent").show();
                }
            }
            else {
                $(".mon-show-acknowledgementreceived").hide();
                $(".mon-show-acknowledgementrequired").hide();
            }
            $(".manager-dispute-finding,.manager-corrective-action textarea,.manager-corrective-action input").attr("disabled", "disabled"); //.css("border", "1px solid red")
            $(".dispute-finding-label").css("color", "black").css("font-weight", "normal"); //eye roll
            if ($("#lblSpecialAuth").html() == "Auditor") {
                if ((state != "Not Determined") && (state != "In Draft") && (state != "Complete (No Findings)") && (state != "Pending Agent Review")) {
                    $("#submitme").hide();
                    $("#deleteme").hide();
                    $("select").attr("disabled", "disabled");
                    $("input[type='checkbox']").attr("disabled", "disabled");
                    $("input[type='text']").attr("disabled", "disabled");
                    $("input[type='radio']").attr("disabled", "disabled");
                    $("textarea").attr("disabled", "disabled");
                }
            }
            if ($("#lblSpecialAuth").html() == "Dispute Handler") {
                $(".date-normal").hide();
                $(".date-editable").show();
                $(".mon-sys-Callid-edit").val($("#show_lblCallid").html());
                $(".mon-sys-Calldate-edit").val($("#show_lblCalldate").html());
            }
        }
        if ($(".qst-correctiveactioncomplete").eq(0).is(":checked")) {
            $(".manager-corrective-action").show();
        }
        if (!$(".qst-islive").is(":checked")) {
            $("#draftme").show();
        }
        else {
            $("#draftme").hide();
        }
        initialscore = $(".mon-sys-score").html(); //Correct when dust settles.


    }
    init_control();
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
        $(".assurance-total").html('<span style="color:darkred;">QA Pass/Fail not specified - you may submit with no QA data.</span>');
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

function exists(me) {
    return (typeof me != 'undefined');
}