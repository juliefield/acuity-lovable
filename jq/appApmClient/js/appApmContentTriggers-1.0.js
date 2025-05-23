(function () {
    if (!window.jQuery) { console.log("This App requires jQuery"); return; }
    var $ = window.jQuery;

    function process(service, me, event, redrawfunction) {
        switch (service) {
            // <div class="report-click-service" service="MonitorQueue" />                    
            case "MonitorQueue":
                var userid = $(me).attr("userid");
                var entby = $(me).attr("entby");
                var callid = $(me).attr("callid");
                var workid = $(me).attr("workid");
                var lettertype = $(me).attr("lettertype");
                var monitortype = $(me).attr("monitortype");
                var original_username = $(me).attr("Original_Username");
                var original_userid = $(me).attr("Original_Userid");
                var original_date = $(me).attr("Original_Date");
                var sqfcode = $(me).attr("sqfcode");


                // 1) Check to see if the this entby (qa person) already has a queued monitor.

                // 2) If queued monitor is found, then
                //       alert that they already have a monitor queued
                //       call up the queued monitor.
                //     else
                //       save the monitor to queue via saveMonitorQue
                //       call up that monitor

                // DOING NOW:
                // check to see if the monitor (callid/userid) already exists.  If it exists, set mode to update.
                //
                // call up monitor with userid/entby/callid as passed.
                //  mode new (or update)
                //  agent  userid
                //  callid callid
                //  sup   entby
                //  viewer  entby
                //  sqfcode  61    //TODO: pass the sqfcode through the MonitorQueue Service.

                //send userid, entby, callid

                //return status (1=go ahead), guid

                a$.ajax({
                    type: "POST",
                    service: "JScript",
                    async: true,
                    data: {
                        lib: "qa",
                        cmd: "checkQueueStatus",
                        userid: (userid != null) ? userid : "",
                        entby: (entby != null) ? entby : "",  //Person logged in
                        callid: (callid != null) ? callid : "",
                        workid: (workid != null) ? workid : "",
                        lettertype: (lettertype != null) ? lettertype : "",
                        monitortype: (monitortype != null) ? monitortype : "",
                        original_username: (original_username != null) ? original_username : "",
                        original_userid: (original_userid != null) ? original_userid : "",
                        original_date: (original_date != null) ? original_date : ""
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: success_checkQueueStatus
                });
                function success_checkQueueStatus(json) {
                    if (a$.jsonerror(json)) { //Handles errors in a standard way.
                        $(me).css("border-color", "red").css("border-style", "solid");
                    }
                    else {

                        //Check status make decisions here.
                        var callprt = false;
                        if ((json.status == "NEWMONITOR") || (json.status == "MYMONITOR")) {
                            callprt = true;
                        }
                        else if (json.status == "ALREADYDONE") {
                            if (workid != null) {
                                alert("Monitor " + workid + " is already complete.");
                            }
                            else {
                                alert("Monitor " + callid + " is already complete.");
                            }
                        }
                        else if (json.status == "SOMEONEELSE") {
                            if (workid != null) {
                                alert("Monitor " + workid + " is queued for someone else.");
                            }
                            else {
                                alert("Monitor " + callid + " is queued for someone else.");
                            }
                        }
                        else if (json.status == "ALREADYWORKING") {
                            callid = json.existingcallid;
                            userid = json.existinguserid;
                            workid = json.existingworkid;
                            lettertype = json.existinglettertype;
                            monitortype = json.existingmonitortype;
                            original_username = json.existingoriginal_username;
                            original_userid = json.existingoriginal_userid;
                            original_date = json.existingoriginal_date;
                            if (workid != null) {
                                alert("Resuming work on monitor " + workid + "...");
                            }
                            else {
                                alert("Resuming work on monitor " + callid + "...");
                            }
                            callprt = true;
                        }
                        else {
                            alert("Unknown command");
                        }

                        if (!callprt) return false;

                        a$.ajax({
                            type: "POST",
                            service: "JScript",
                            async: true,
                            data: {
                                lib: "qa",
                                cmd: "setMonitorPRT",
                                userid: (userid != null) ? userid : "",
                                entby: (entby != null) ? entby : "",  //Person logged in
                                callid: (callid != null) ? callid : "",
                                workid: (workid != null) ? workid : "",
                                sqfcode: (sqfcode != null) ? sqfcode : (lettertype.indexOf("CPLB") >= 0) ? 66 : 61
                            },
                            dataType: "json",
                            cache: false,
                            error: a$.ajaxerror,
                            success: success_setMonitorPRT
                        });
                        function success_setMonitorPRT(json) {
                            if (a$.jsonerror(json)) { //Handles errors in a standard way.
                                $(me).css("border-color", "red").css("border-style", "solid");
                            }
                            else {
                                if (json.status == 1) {
                                    //alert("debug: here 1");
                                    $(".rpt-popup-1").hide();
                                    if (true) { //(lettertype.indexOf("CPLB") >= 0) {
                                        //alert("This monitor is in FINAL TESTING.\nPlease report any issues to TPO.");
                                        window.open("https://" + a$.urlprefix(true) + "acuityapmr.com/jq/monitors/V3/Monitor_Coaching_Correspondence_Process_Lockbox" + ((sqfcode=="67") ? "_v2" : "") + ".aspx?uid=" + json.guid + "&customurl=1&origin=report&lettertype=" + lettertype + "&monitortype=" + monitortype + "&prefix=" + a$.urlprefix().replace(".", "") + "&original_userid=" + original_userid + "&original_username=" + original_username + "&original_date=" + original_date);
                                    }
                                    else {
                                        window.open("https://" + a$.urlprefix(true) + "acuityapmr.com/jq/monitors/V3/Monitor_Coaching_Internal_Review.aspx?uid=" + json.guid + "&customurl=1&origin=report&lettertype=" + lettertype + "&monitortype=" + monitortype + "&prefix=" + a$.urlprefix().replace(".", "") + "&original_userid=" + original_userid + "&original_username=" + original_username + original_username + "&original_date=" + original_date);
                                    }
                                }
                            }
                        }
                    }
                }


                /*FOR LATER
                //Write record
                a$.ajax({
                type: "POST",
                service: "JScript",
                async: true,
                data: {
                lib: "qa",
                cmd: "saveMonitorQueue",
                userid: (userid != null) ? userid : "",
                entby: (entby != null) ? entby : "",  //Person logged in
                callid: (callid != null) ? callid : ""
                },
                dataType: "json",
                cache: false,
                error: a$.ajaxerror,
                success: success_saveMonitorQueue
                });
                function success_saveMonitorQueue(json) {
                if (a$.jsonerror(json)) { //Handles errors in a standard way.
                $(me).css("border-color", "red").css("border-style", "solid");
                }
                else {
                alert("debug: monitor queue entry saved");
                }
                }
                alert("debug:Accessing Monitor Queue");
                */


                return false;
            case "UpdateUserDataSubField":
            case "UpdateUserDataField":
            case "UpdateCustomDataField":
            case "DeleteRecord":
                var dataview = $(me).attr("dataview");
                var field = $(me).attr("field");

                //For UpdateUserDataField:
                var recdate = $(me).attr("recdate");
                var userid = $(me).attr("userid");

                //For UpdateCustomDataField:
                var user1 = $(me).attr("user1");
                var user2 = $(me).attr("user2");
                var user3 = $(me).attr("user3");

                if (service == "DeleteRecord") {
                    $("td", $(me).closest("tr")).each(function () {
                        $(this).css("border-color", "red").css("border-style", "solid").css("border-width", "4px");
                    });
                    if (!confirm("Delete this entry?")) {
                        $("td", $(me).closest("tr")).each(function () {
                            $(this).css("border-color", "").css("border-style", "").css("border-width", "");
                        });
                        break;
                    }
                }

                //For UpdateUserDataSubField:
                var subview = $(me).attr("subview"); //DBS:KM2_WH_ACA_DECM_DEALS_HSTRY_APP_NUMBERS
                var keys = $(me).attr("keys");
                //If DBS:
                //<var>/<root>/<sub>,<var>/<root>/<sub>
                //userid/USER_ID/USER_ID,recdate/RECDATE/RECDATE
                //If DAS:, then use the name column (not systemfield - although systemfield will indicate how to retrieve it).
                //userid/Userid/Userid,recdate/Date/Date

                //alert("debug: Ready to update the field in " + dataview);
                var fields = [];
                var myval = $(me).val();
                if ($(me).attr("type") == "checkbox") {
                    if (!$(me).is(":checked")) {
                        myval = ""; //Not checked means val = ""
                    }
                }
                else if ($(me).hasClass("rpt-subfieldlist")) {
                    var sval = "";
                    $(".rpt-subfieldentry", $(me).parent()).each(function () {
                        if (sval != "") sval += ","
                        sval += $(this).html();
                    });
                    if (sval != "") myval = sval + "," + myval;
                }
                var errorout = false;
                if ($(me).attr("numeric")=="yes") {
                    function isNumericString(str) {
                       return typeof str === 'string' && !isNaN(str) && !isNaN(parseFloat(str));
                    }
                    if (!isNumericString(myval)) errorout = true;
                }
                if (myval == "") {
                    if ($(me).attr("noblank")=="yes") errorout = true;
                }
                if (errorout) {
                    $(me).css("border-color", "red").css("border-style", "solid");
                    if ($(me).attr("redraw") == "yes") {
                        redrawfunction();
                    }
                    return false;
                }

                fields.push({ name: field, val: myval });

                if ($(me).attr("otherfields") != null) {
                    var fs = $(me).attr("otherfields").split("~");
                    for (var f in fs) {
                        var fss = fs[f].split("=");
                        fields.push({ name: fss[0], val: ((fss.length > 1) ? fss[1] : "") });
                    }
                }

                var mydebug = $(me).attr("debug");
                if (mydebug == "true") {
                    var mb = "debug: attributes received:\n\nfield=" + field + ", value=" + myval + ", dataview=" + dataview + ", field=" + field + ", recdate=" + recdate + ", userid=" + userid + ", user1=" + user1 + ", user2=" + user2 + ", user3=" + user3;
                    alert(mb);                    
                }

                a$.ajax({
                    type: "POST" /*POST*/,
                    service: "JScript",
                    async: true,
                    data: {
                        lib: "editor",
                        cmd: "savedataview",
                        dataview: dataview,
                        service: (service != null) ? service : "",
                        userid: (userid != null) ? userid : "",
                        recdate: (recdate != null) ? recdate : "",
                        user1: (user1 != null) ? user1 : "",
                        user2: (user2 != null) ? user2 : "",
                        user3: (user3 != null) ? user3 : "",
                        subview: (subview != null) ? subview : "",
                        keys: (keys != null) ? keys : "",
                        fields: fields
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: success_UpdateUserDataField
                });
                function success_UpdateUserDataField(json) {
                    if (a$.jsonerror(json)) { //Handles errors in a standard way.
                        $(me).css("border-color", "red").css("border-style", "solid");
                    }
                    else {
                        if (service == "DeleteRecord") {
                            //Remove the entire record from the report.
                            $(me).closest("tr").remove();
                            if ($(me).attr("redraw") == "yes") {
                                redrawfunction();
                            }
                        }
                        if (service == "UpdateUserDataSubField") {
                            if (!json.saved) {
                                //alert("Not saved..");
                                $(me).parent().css("border-color", "red").css("border-style", "solid");
                            }
                            else {
                                $(me).parent().css("border-color", "green").css("border-style", "solid").css("border-width", "4px");

                                $(me).attr("placeholder", "+").css("text-align", "left");
                                if ($(me).val() != "") {
                                    var vs = $(me).val().split(",");
                                    $(me).val("");
                                    $(me).attr("value", ""); //why is this necessary?
                                    if (!$(".rpt-subfieldrecord", $(me).parent()).length) { //Redrawing the list
                                        for (var vi = vs.length - 1; vi >= 0; vi--) {
                                            $(me).parent().prepend('<div class="rpt-subfieldrecord" style="position:relative;display:block;"><span class="rpt-subfieldentry">' + vs[vi] + '</span>&nbsp;&nbsp;&nbsp;&nbsp;<span title="Remove Entry" style="cursor:pointer;font-weight: bold;position:absolute;top:0px;right:0px;height:10px;width:10px;" class="rpt-subfieldremove">-</span></div>');
                                        }
                                    }
                                    else { //Adding to the bottom.
                                        $(me).before('<div class="rpt-subfieldrecord" style="position:relative;display:block;"><span class="rpt-subfieldentry">' + vs[0] + '</span>&nbsp;&nbsp;&nbsp;&nbsp;<span title="Remove Entry" style="cursor:pointer;font-weight: bold;position:absolute;top:0px;right:0px;height:10px;width:10px;" class="rpt-subfieldremove">-</span></div>');

                                    }
                                    $(".rpt-subfieldremove").unbind().bind("click", function () {
                                        $(this).prev().removeClass("rpt-subfieldentry");
                                        var myval = "";
                                        $(".rpt-subfieldentry", $(this).parent().parent()).each(function () {
                                            if (myval != "") myval += ",";
                                            myval += $(this).html();
                                        });
                                        var p = $(this).parent().parent();
                                        $(".rpt-subfieldrecord", p).remove();
                                        $(".rpt-subfieldlist", p).val(myval).trigger("change");
                                    });
                                }

                                setTimeout(function () { $(me).parent().css("border-color", "").css("border-style", "").css("border-width", ""); }, 2000);
                            }
                        }
                        else {
                            if (!json.saved) {
                                //alert("Not saved..");
                                $(me).css("border-color", "red").css("border-style", "solid");
                            }
                            else {
                                $(me).css("border-color", "green").css("border-style", "solid").css("border-width", "4px");
                                setTimeout(function () { $(me).css("border-color", "").css("border-style", "").css("border-width", ""); }, 2000);
                                if ($(me).attr("redraw") == "yes") {
                                    redrawfunction();
                                }
                            }
                        }
                    }
                }
                break;
            case "QADisplay": //duck
                var framepage = $(me).attr("framepage");
                var formid = $(me).attr("formid");
                var dataview = $(me).attr("dataview");
                var masterid = $(me).attr("masterid");
                var examinee = $(me).attr("examinee");
                var examiner = $(me).attr("examiner");

                var bld = "";
                bld += '<div class="qa-wrapper-popup qa-DisplayPopup">';
                bld += '<div class="qa-wrapper2-popup" style="height:600px;width:1200px;">';
                bld += '<a href="#Messaging" class="qa-close" style="text-decoration:none;">X</a>';
                bld += '<div class="qa-box-popup qa-box-popup_survey" style="height:550px;width:1150px;margin-top:20px;">';

                bld += '<iframe id="QAPopupIframe" src="/3/PopupQA.aspx?prefix=' + a$.urlprefix().split(".")[0] + '&framepage=' + framepage + '&formid=' + formid + '&dataview=' + dataview + '&masterid=' + masterid + '&examinee=' + examinee + '&examiner=' + examiner + '"  style="width:100%;height:100%; border:0px;" ></iframe>';

                bld += '</div></div></div>';

                $("body").append(bld);
                $(".qa-DisplayPopup").show();

                $(".qa-close").click(function () {
                    $(".qa-DisplayPopup").remove();
                });

                //Call an iframe page PopupQA
                //var tbld = '<ng-acuity-qa text="My Monitor" details="My Details" framepage="jq/monitors/V3/Subform_base_1.aspx" formid="39" dataview="' + scope.dataview + '" masterid="' + (a$.exists(scope.recordid) ? scope.f_selected.id : "") + '" examinee="' + (a$.exists(scope.userid) ? scope.userid : "") + '"></ng-acuity-qa>';
                break;
            case "SelectUser":
                var userid = $(me).attr("userid");
                if (!a$.exists(a$.WindowTop().Selected)) { //No top window, borrowing this for testing.
                    $(".report-tableeditor").remove();
                    $(me).parent().parent().after('<tr><td colspan="100" class="report-tableeditor">TableEditor Here</td></tr>');
                    //...I'm not going to do this here, will intercept in the ng-based report module.
                    return false;
                }
                else {
                    a$.WindowTop().Selected.CSR = userid;
                    if (!$(".acuity-user-profile-framebox", a$.WindowTop().document).length) {
                        var bld = "";
                        bld += '<div class="acuity-user-profile-framebox" id="ProfileFrameHolder" >';
                        //  bld += '<div class="qa-wrapper2-popup">';
                        bld += "<div class=\"agent-profile-holder\" style=\"height:100%;\">";
                        bld += '<span class="agent-profile-panel_close"><i class="fa fa-times"></i> Close Profile</span>';

                        //  bld += '<div class="qa-box-popup">';

                        // Content Section
                        //bld += '<p><iframe id="UserprofileIframe" src="../3/UserProfile.aspx?prefix=' + a$.urlprefix().split(".")[0] + '"  style="border:0px; width: 100%;  height: 100%" ></iframe>';
                        bld += '<iframe id="UserprofileIframe" src="/3/UserProfile.aspx?prefix=' + a$.urlprefix().split(".")[0] + '"  style="width:100%;height:100%; border:0px;" ></iframe>';
                        // end Content Section

                        //bld += '</div></div></div>';
                        bld += '</div></div>';
                        $("body", a$.WindowTop().document).append(bld);
                        //$(".acuity-user-profile-framebox").draggable();
                    }

                    $(".acuity-user-profile-framebox", a$.WindowTop().document).css("right", "0");

                    $(".agent-profile-panel_close", a$.WindowTop().document).off("click").on("click", function () {
                        var currentWidth = $(".acuity-user-profile-framebox", a$.WindowTop().document).width();
                        currentWidth += 25;
                        var movementWidth = (currentWidth * -1);
                        $(".acuity-user-profile-framebox", a$.WindowTop().document).css("right", movementWidth + "px");
                        return false;
                    });
                }
                break;
            case "UserMessageCheck":
                try {
                    event.stopPropagation();
                }
                catch (e) {
                };
                break;
            case "UserMessageSelectAll":
                try {
                    event.stopPropagation();
                }
                catch (e) {
                };
                $(".acuity-user-message-check", $(me).closest("table")).each(function () {
                    if ($(this).closest("tr").is(":visible")) {
                        $(this).prop("checked", $(me).is(":checked"));
                    }
                });
                break;
            case "UserMessageTo" :    
                $("#messagediv", a$.WindowTop().document).show();
                $(".heading", a$.WindowTop().document).html("Messaging");
                $('#messagetab', a$.WindowTop().document).show();
                a$.WindowTop().$('#messageslabel', a$.WindowTop().document).trigger('click');
                a$.WindowTop().$(".messages-compose input", a$.WindowTop().document).trigger("click");
                var userid = $(me).attr("userid");
                userid = userid.replace(/'/g, '');
                // var csr = $(".app-user-link", $(this).closest("td")).attr("userid");
                a$.ajax({
                    type: "GET",
                    service: "JScript",
                    async: true,
                    data: {
                        lib: "spine",
                        cmd: "getNamesFromUserids",
                        useridlist: userid
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: messageToSuccess
                });
                function messageToSuccess(json) {
                    if (a$.jsonerror(json)) {
                    }
                    else {
                        var vk = "COMBO/selCSRs/" + userid;
                        try {
                            $('#composeto option[value="' + vk + '"]', a$.WindowTop().document).attr("selected", "selected");
                            var inlist = false;
                            $("#composeto option:selected", a$.WindowTop().document).each(function () {
                                if ($(this).val() == vk) {
                                    inlist = true;
                                }
                            });
                            if (!inlist) {
                                $("#composeto", a$.WindowTop().document).append($('<option></option>').val(userid).html(json.namelist[0]).attr("selected", "selected"));
                            }
                        }
                        catch (e) {
                        }
                    }
                }
                break;
            case "UserMessageLink":
                try {
                    event.stopPropagation();
                }
                catch (e) {
                };
                var cnt = 0;
                $(".acuity-user-message-check", $(me).closest("table")).each(function () {
                    if ($(this).is(":checked")) {
                        cnt += 1;
                    }
                });
                if (cnt < 1) {
                    alert("No users selected.  Check the boxes to the right of the agent's name.");
                    return false;
                }
                $("#messagediv", a$.WindowTop().document).show();
                $(".heading", a$.WindowTop().document).html("Messaging");
                $('#messagetab', a$.WindowTop().document).show();
                a$.WindowTop().$('#messageslabel', a$.WindowTop().document).trigger('click');
                a$.WindowTop().$(".messages-compose input", a$.WindowTop().document).trigger("click");

                $(".acuity-user-message-check", $(me).closest("table")).each(function () {
                    if ($(this).is(":checked")) {
                        var csrname = $(".app-user-link", $(this).closest("td")).html();
                        csrname = csrname.toString().replace(/'/g, '');
                        var csr = $(".app-user-link", $(this).closest("td")).attr("userid");

                        if ($(this).attr("userid") != null) csr = $(this).attr("userid");
                        if ($(this).attr("username") != null) csrname = $(this).attr("username");

                        var vk = "COMBO/selCSRs/" + csr;
                        try {
                            $('#composeto option[value="' + vk + '"]', a$.WindowTop().document).attr("selected", "selected");
                            var inlist = false;
                            $("#composeto option:selected", a$.WindowTop().document).each(function () {
                                if ($(this).val() == vk) {
                                    inlist = true;
                                }
                            });
                            if (!inlist) {
                                $("#composeto", a$.WindowTop().document).append($('<option></option>').val(csr).html(csrname).attr("selected", "selected"));
                            }
                        }
                        catch (e) {
                        }
                    }
                });

                a$.WindowTop().$("#composeto", a$.WindowTop().document).trigger("liszt:updated");
                break; //duck
            case "GridUsers_SelectAll":
                $(".fan-roster-message-selectall").unbind().bind("click", function () {
                    //alert("debug:checked selectall");
                    var checked = $(this).is(":checked");
                    $(".fan-roster-message-check").each(function () {
                        $(this).prop("checked", checked);
                    });
                });
                break;
            case "GridUsers_SendMessage":
                $(".fan-roster-message-link").unbind().bind("click", function () {
                    var cnt = 0;
                    $(".fan-roster-message-check").each(function () {
                        if ($(this).is(":checked")) {
                            cnt += 1;
                        }
                    });
                    if (cnt < 1) {
                        alert("No agents selected.  Check the boxes to the right of the agent's name.");
                        return false;
                    }
                    $("#messagediv").show();
                    $(".heading").html("Messaging");
                    $('#messagetab').show();
                    $('#messageslabel').trigger('click');
                    $(".messages-compose input").trigger("click");

                    $(".fan-roster-message-check").each(function () {
                        if ($(this).is(":checked")) {
                            var csrname = $(" span", $(this).parent().parent()).eq(0).html();
                            csrname = csrname.replace(/'/g, '');
                            var csr = $(" span", $(this).parent().parent()).eq(1).html();
                            var vk = "COMBO/selCSRs/" + csr;
                            $('#composeto option[value="' + vk + '"]').attr("selected", "selected");
                            if ($("#composeto option:selected").val() != vk) {
                                $("#composeto").append($('<option></option>').val(csr).html(csrname).attr("selected", "selected"));
                            }
                        }
                    });

                    $("#composeto").trigger("liszt:updated");
                    return false;
                });
                break;
            case "LaunchReview":
                $(".reviewform-message").hide();

                var loading_modal = '<div id="loading-modal"><span>Loading</span></div>';
                $("body").append(loading_modal);

                var dev = "";

                // Check if a current review exists for the CSR
                a$.ajax({
                    type: "GET",
                    service: "JScript",
                    async: true,
                    data: {
                        lib: "spine",
                        cmd: "getMe",
                        who: "ME",
                        members: ["person", "teams", "csrs", "evaluation"]
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: mySuccessFunction
                });

                var filteredArray = "";
                function mySuccessFunction(json) {
                    $("#loading-modal").remove();

                    filteredArray = json.me.evaluation.reviews_current.filter(function (itm) {
                        return itm.agentId.indexOf(json.me.person.uid) > -1;
                    });

                    if (filteredArray.length == 1) { // IF a current review exists, create the link
                        if (a$.urlprefix().indexOf("-mnt") > 0) {
                            /*chris:*/dev = "https://" + a$.urlprefix().substring(0, a$.urlprefix().indexOf("-mnt")) + "-v3-dev-chris" + ".acuityapm.com/3/Touchpointauthentication.aspx?url=../3/Supperfmgt.aspx|" + $(me).attr("params").replace(/&/g, "~") + "^performance-review&username=" + $.cookie("TP1Username") + "&uid=" + $.cookie("uid") + "&role=" + $.cookie("TP1Role") + "&roleset=&project=1";
                        }
                        else {
                            dev = "https://" + a$.urlprefix().substring(0, a$.urlprefix().indexOf(".")) + "-v3-dev-chris" + ".acuityapmr.com/3/Touchpointauthentication.aspx?url=../3/Supperfmgt.aspx|" + $(me).attr("params").replace(/&/g, "~") + "^performance-review&username=" + $.cookie("TP1Username") + "&uid=" + $.cookie("uid") + "&role=" + $.cookie("TP1Role") + "&roleset=&project=1";
                        }
                        //$(".reviewform-dev").html(dev);
                        $("#ReviewformIframe").attr("src", dev).show();
                        $("#reviewformlabel").trigger("click");

                    } else { // ELSE show message-modal with a message that this review is no longer active.
                        $(".message-modal").remove();

                        var bld = "";
                        bld += '<div class="qa-wrapper-popup message-modal">';
                        bld += '<div class="qa-wrapper2-popup">';
                        bld += '<a href="#Messaging" class="qa-close"></a>';
                        bld += '<div class="qa-box-popup qa-box-popup_survey">';

                        // Content Section
                        bld += "<section class='form'>"
                        bld += "<p>This review is no longer active or has been marked as complete.</p>";
                        bld += "</section>";
                        // end Content Section

                        bld += '</div></div></div>';

                        $("body").append(bld);
                        $(".message-modal").show();

                        $(".qa-close").click(function () {
                            $(".message-modal").remove();
                        });
                    }
                }
                break;
            case "SidekickRating":
            case "XtremeOwnerRating":

                var deliveredby = $(me).attr("deliveredby"); //or XtremeOwner user id
                var category = $(me).attr("category");
                var journalid = $(me).attr("journalid");  //or Time Period

                var ownername = $(me).attr("ownername"); // for display
                var ownerid = $(me).attr("ownerid");
                var leagueid = $(me).attr("leagueid");
                var teamid = $(me).attr("teamid");
                var weekid = $(me).attr("weekid");

                var agentid = $.cookie("TP1Username");

                var ratingValue = "";
                var comments = "";
                var ratingType = function (num, string) {
                    if (num && string) {
                        return (i > 1) ? string + "s" : string;
                    }
                }

                // Check if the journalid already exists in the qa_resp table
                a$.ajax({
                    type: "GET",
                    service: "JScript",
                    async: true,
                    data: {
                        lib: "qa",
                        cmd: "checkForRating",
                        database: "G",
                        formId: (service == "SidekickRating") ? 12 : 315,

                        journalId: journalid,

                        ownerid: ownerid,
                        leagueid: leagueid,
                        teamid: teamid,
                        weekid: weekid
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: ratingSubmitted
                });

                function ratingSubmitted(json) {
                    $(".qa-RatingPopup").remove(); // just in case it's still in the DOM
                    // begin outer wrapper
                    var bld = "";
                    bld += '<div class="qa-wrapper-popup qa-RatingPopup">';
                    bld += '<div class="qa-wrapper2-popup">';
                    bld += '<a href="#Messaging" class="qa-close"></a>';
                    bld += '<div class="qa-box-popup qa-box-popup_survey">';


                    if (json.rating_agent) {
                        var json_agent = json.rating_agent.toString().toLowerCase();
                        var cookie_agent = $.cookie("TP1Username").toLowerCase();

                        if (json_agent === cookie_agent) {
                            // console.log(`Submitted`);
                            // This rating exists in QA_RESP, and is therefore submitted

                            bld += "<p class='align-center'>This entry has already been rated.</p>";

                        } else {
                            // console.log(`Unauthorized`);
                            // Agent variables do not match, and is therefore unauthorized

                            bld += "<p class='align-center'>You are unauthorized to rate this entry.</p>";
                        }
                    } else if (!json.rating_agent) {
                        // console.log("open");
                        // Rating has not been submitted and is still open

                        // Form Section
                        bld += "<section class='form'>"
                        //bld += "<p>Please acknowledge and rate your supervisor's most recent performance review for you.</p>";
                        if (service == "SidekickRating") {
                            bld += "<p>Please acknowledge and rate the quality of this support interaction.</p>";
                        }
                        else {
                            bld += "<p>Please Rate the effectiveness of your Xtreme Team Owner this week.  Your input is critical and anonymous, so be honest.</p>";
                        }
                        // Stars Section
                        bld += "<section class='rating-widget'>";
                        bld += "<div class='rating-stars text-center'>";
                        bld += "<ul id='stars'>";
                        var totalStarNum = 5;
                        for (i = 1; i <= totalStarNum; i++) {
                            var ratingTitle = ratingType(i, "Star")
                            bld += "<li class='star' title='" + i + " " + ratingTitle + "' data-value='" + i + "'><i class='fa'></i></li>";
                        }
                        bld += "</ul></div></section>";
                        // end Stars Section
                        bld += '<textarea id="userComments" name="userComments" rows="4" style="width: 100%; max-width: 100%; margin-bottom: 10px;" placeholder="Leave your comments here"></textarea>';
                        bld += '<button class="qa-submit qa-RatingSubmit pure-button pure-button-primary" type="button" disabled>Submit</button>';
                        bld += "</section>";
                        // end Form Section
                    }

                    // end outer wrapper
                    bld += '</div></div></div>';

                    //
                    // Functions
                    //
                    $("body").append(bld);
                    if (a$.urlprefix() == "chime.") {
                        $('#userComments').hide();
                    }
                    $(".qa-RatingPopup").show();

                    $(".qa-close").click(function () {
                        $(".qa-RatingPopup").remove();
                    });

                    var enable_submit = function () {
                        if ($(".qa-RatingSubmit").is('[disabled]')) {
                            $(".qa-RatingSubmit").removeAttr("disabled");
                        }
                    }

                    // Stars Functionality
                    /* 1. Visualizing things on Hover - See next part for action on click */
                    $('#stars li').on('mouseover', function () {
                        var onStar = parseInt($(this).data('value'), 10); // The star currently mouse on

                        // Now highlight all the stars that's not after the current hovered star
                        $(this).parent().children('li.star').each(function (e) {
                            if (e < onStar) {
                                $(this).addClass('hover');
                            }
                            else {
                                $(this).removeClass('hover');
                            }
                        });
                    }).on('mouseout', function () {
                        $(this).parent().children('li.star').each(function (e) {
                            $(this).removeClass('hover');
                        });
                    });

                    /* 2. Action to perform on click */
                    $('#stars li').on('click', function () {
                        var onStar = parseInt($(this).data('value'), 10); // The star currently selected
                        var stars = $(this).parent().children('li.star');
                        for (i = 0; i < stars.length; i++) {
                            $(stars[i]).removeClass('selected');
                        }

                        for (i = 0; i < onStar; i++) {
                            $(stars[i]).addClass('selected');
                        }

                        // Enable the submit button
                        enable_submit();

                        // Rating Value to be save to the DB
                        ratingValue = parseInt($('#stars li.selected').last().data('value'), 10);

                    });
                    // end Stars Functionality
                    //
                    // end Form
                    //

                    // Save Form

                    $(".qa-RatingSubmit").unbind().bind("click", function () {
                        /* if (service != "SidekickRating") {
                            alert("debug: not saving yet");
                            return;
                        } */
                        comments = $('#userComments').val();
                        //  console.log(`examiner: ${deliveredby} | examinee: ${agentid} | category: ${category} | journalid: ${journalid} | ratingValue: ${ratingValue} | comments: ${comments}`);

                        //TODO: For the Sidekick rating (not Xtreme Owner 315 rating), route the rating directly to the journaltest table.

                        a$.ajax({
                            type: "POST" /*POST*/,
                            service: "JScript",
                            async: true,
                            data: {
                                lib: "qa",
                                cmd: "saveQaForm",
                                database: "G",
                                examiner: deliveredby,
                                examinee: agentid,
                                formId: (service == "SidekickRating") ? 12 : 315,
                                answers: 
                                    (service == "SidekickRating") ?
                                        [
                                            {
                                                friendlyname: "DeliveredBy",
                                                answertext: deliveredby
                                            },
                                            {
                                                friendlyname: "Category",
                                                answertext: category
                                            },
                                            {
                                                friendlyname: "JournalID",
                                                answertext: journalid
                                            },
                                            {
                                                friendlyname: "Rating",
                                                answertext: ratingValue
                                            },
                                            {
                                                friendlyname: "Comments",
                                                answertext: comments
                                            }
                                        ]
                                    :   //Xtreme Form:
                                        [
                                            {
                                                friendlyname: "ownerid",
                                                answertext: ownerid
                                            },
                                            {
                                                friendlyname: "leagueid",
                                                answertext: leagueid
                                            },
                                            {
                                                friendlyname: "teamid",
                                                answertext: teamid
                                            },
                                            {
                                                friendlyname: "weekid",
                                                answertext: weekid
                                            },
                                            {
                                                friendlyname: "Rating",
                                                answertext: ratingValue
                                            },
                                            {
                                                friendlyname: "Comments",
                                                answertext: comments
                                            }
                                        ]

                            },
                            dataType: "json",
                            cache: false,
                            error: a$.ajaxerror,
                            success: mysuccessfunction
                        });
                        function mysuccessfunction(json) {
                            if (a$.jsonerror(json)) { //Handles errors in a standard way.
                                $(".qa-box-popup").prepend('<h2 class="warning">Rating did not save.</h2>');
                                // console.log(`json: ${JSON.stringify(json,null,2)}`);
                            } else {
                                $(".warning").remove();
                                // Confirmation/Thank You Section
                                var msg_confirmation = ""
                                msg_confirmation += '<section class="confirmation">';
                                msg_confirmation += '<p><span>🎉</span> Thank you for your rating of ' + ratingValue + ' ' + ratingType(ratingValue, "Star") + '</p>';
                                msg_confirmation += '</section>';
                                // end Confirmation/Thank You Section

                                $("section.form").remove();
                                $(".qa-box-popup").append(msg_confirmation);
                            }
                        }
                    });
                    // end Save Form
                    //
                    // end Functions
                    //
                }
                break;
            case "HandleSuggestion":
                HandleSuggestion(me);
                break;
            default:
        }
    }
    /* Sidekick Suggestion Handling / AI Integration Options START */
    //simple entry point
    function HandleSuggestion(buttonObject) {
        if (buttonObject != null) {
            let button = $(buttonObject);
            let buttonId = buttonObject.id;
            let buttonIdItems = buttonId.split("_");
            let buttonAction = button.attr("useraction") || buttonIdItems[0];
            let actionKey = button.attr("actionkey");
            let userId = buttonIdItems[1];
            let kpiId = buttonIdItems[2];
            switch (buttonAction.toUpperCase()) {
                case "COMPLETE":
                    if (confirm("Please confirm that this task has been completed.\n\nPress OKAY to confirm or CANCEL to ignore.")) {
                        CompleteSuggestion(actionKey);
                        // CompleteSuggestion(actionKey, null, function () {
                        //     ko.postbox.publish("RefreshReportCacheOverride", "sidekickCoachingSuggestion2");
                        //     return;
                        // });
                    }
                    break;
                case "PASS":
                    ClearSuggestionCookie();
                    if (confirm("Are you sure you want to remove this task?\n\nPress OKAY to continue or CANCEL to not pass.")) {
                        PassOnSuggestion(actionKey);
                        // PassOnSuggestion(actionKey, function () {
                        //     ko.postbox.publish("RefreshReportCacheOverride", "sidekickCoachingSuggestion2");
                        //     return;
                        // });
                    }
                    else {
                        return;
                    }
                    break;
                default:
                    SetSuggestionCookie(actionKey);
                    ActOnSuggestion(userId, kpiId, actionKey);
                    break;
            }
        }
        else {
            console.log("Unknown action clicked.");
        }
    }
    //handling of the "act" on the suggestion
    function ActOnSuggestion(userId, mqfNumber, actionKey, callback) {
        let reportConnector = $(".app-journal-link[userid='" + userId + "']");
        let currentUserIdFilterValue = GetCurrentUserFilteredSelected();
        //let currentUserIdFilterValue = "";
        if (reportConnector != null) {
            //Handle problem where you have to click 2x to get the add new record to display.
            //user has not changed that was clicked, do not need to handle the first click that sets the filter
            if (currentUserIdFilterValue != userId) {
                $(reportConnector).click();

            }
            window.setTimeout(function () {
                //check to see if the current history is visible or not.  this holds the button to add a new record.
                //if it is not visible, do the click action to make it visible
                //if it is visible, we don't need to do anything.
                let tableHolder = $("ng-table-editor[userid='" + userId + "']");
                if (tableHolder == null || (tableHolder != null && tableHolder.is(":visible") == false)) {
                    $(reportConnector).click();
                }
                window.setTimeout(function () {
                    MarkUserAction("Act", actionKey);
                    HandleNewRecordAction(userId, mqfNumber, reportConnector, actionKey);
                }, 500);
            }, 1000);
        }
        if (callback != null) {
            callback();
        }
    }
    //Handling of the "add new record button" - Automation to limit clicks
    function HandleNewRecordAction(userId, mqfNumber, userExpanderObject, actionKey, tableHolder) {
        if (tableHolder == null) {
            tableHolder = $("ng-table-editor[userid='" + userId + "']");
        }
        else {
            tableHolder = $(tableHolder);
        }
        let newRecordButton = $(".addnewrecord-btn", tableHolder);
        if (newRecordButton != null) {
            $(newRecordButton).click();
        }
    }
    //handling of the "pass" on the suggestion list.
    function PassOnSuggestion(actionKey, callback) {
        MarkUserAction("Pass", actionKey, null, callback);
    }
    //Marking an item complete.
    function CompleteSuggestion(actionKey, callback) {
        MarkUserAction("Complete", actionKey, -1, function(){
            ClearSuggestionCookie();
            if(callback != null)
            {
                callback();
            }
        });
    }
    //Ability to mark the suggestion as complete from only the journal form.
    //Database will need to validate that the journalId and the action key have the same user.
    function CompleteSuggestionFromJournalId(journalId, callback)
    {
        let actionKey = $.cookie("VM_KEY");
        MarkUserAction("Complete", actionKey, journalId, function(){
            ClearSuggestionCookie();
            if(callback != null)
            {
                callback();
            }
        });
    }
    //Mark Suggestion complete when we know all things: action key, journal ID
    function CompleteSuggestionAllKnown(actionKey, journalId, callback)
    {
        MarkUserAction("Complete", actionKey, journalId, function(){
            ClearSuggestionCookie();
            if(callback != null)
            {
                callback();
            }
        });
    }
    //get the current user selected in the filter.
    function GetCurrentUserFilteredSelected() {
        return $("#selCSRs", a$.WindowTop().document).val() || "";
    }
    //handling of the marking of an item as act/pass.
    function MarkUserAction(actionValue, actionKey, associatedJournalId, callback) {
        let actionCommand = "MarkSuggestionPassed";
        let forceRefresh = true;
        switch (actionValue.toUpperCase()) {
            case "Act".toUpperCase():
                actionCommand = "MarkSuggestionActed";
                forceRefresh = false;
                break;
            case "Complete".toUpperCase():
                if (associatedJournalId == null) {
                    associatedJournalId = -1;
                }
                actionCommand = "MarkSuggestionComplete";                
                break;
        }
        a$.ajax({
            type: "POST",
            service: "C#",
            async: false,
            data: {
                lib: "selfserve",
                cmd: actionCommand,
                actionKey: actionKey,
                journalId: associatedJournalId
            },
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: function (data) {
                if(forceRefresh == true)
                {
                    ko.postbox.publish("RefreshReportCacheOverride", "sidekickCoachingSuggestion2");
                    return;
                }
                if (callback != null) {
                    callback();
                }
            }
        });
    }
    function SetSuggestionCookie(itemValue)
    {
        ClearSuggestionCookie();
        $.cookie("VM_KEY", itemValue);
    }
    function ClearSuggestionCookie()
    {
        $.cookie("VM_KEY", null);
    }
    
    /* Sidekick Suggestion Handling / AI Integration Options END */


    function BuildRankGauge(recordCount,fields) {
        var bld = "";
        if (recordCount == 0) {
            bld = "No Rank String Found.  Example: 'Pay Rank/30/100/1'";
        }
        else {
            var rankindex = -1;
            var settingsindex = -1;
            for (var i in fields) {
                if (fields[i].name.toLowerCase() == "rank") {
                    rankindex = i;
                }
                if (fields[i].name.toLowerCase() == "settings") {
                    settingsindex = i;
                }
            }
            if (rankindex < 0) {
                bld = "'Rank' field required.";
            }
            else {
                var rs = fields[rankindex].value.split("/");
                if (rs.length < 3) {
                    bld = "Invalid Rank String";
                }
                else if (rs[1] == "") {
                    bld = "Rank Not Found";
                }
                else {
                    var leftPos = 15.0; //From left edge to start of gauge.
                    var rightPos = 255.0; //End of gauge position.

                    bld = '<div style="height:75px;text-align:center; width:100%; overflow-x:hidden; background-color:black; color:white; font-weight: normal; display:block;">';

                    bld += '<svg width="270" height="75">';

                    //From 15 to 285

                    var pc;
                    var scorelow = a$.WindowTop().SCORELOW;
                    if (!scorelow) scorelow = 0;
                    var scorebasis = a$.WindowTop().SCOREBASIS;
                    var topnum = scorebasis;
                    var percentagedisplay = "none";

                    if (settingsindex >= 0) {
                        try {
                            // 70/#1100BB/A|40/#5588EE/B|0/#88AAFF/C
                            var s = fields[settingsindex].value;
                            if (s.indexOf("'") == 0) {
                                //s = s.replace(/\'/g,"");                                
                                s = s.replace(/^'(.*)'$/, '$1');
                            }
                            if (s == "") return ""; //Empty string means no gauge.
                            if (s.indexOf("{") >= 0) {
                                var json = JSON.parse(s);
                                pc = json.scale;
                                //   { "scale": [ { "percentile": 70, "color": "#1100BB", "letter": "A" }, { "percentile": 40, "color": "#5588EE", "letter": "B"}, { "percentile": 0, "color: "#88AAFF" } ] }
                                for (var i in pc) {
                                    pc[i].threshold = (pc[i].percentile / 100.0) * (scorebasis - scorelow);
                                }
                                if (a$.exists(json.percentagedisplay)) {
                                    percentagedisplay = json.percentagedisplay;
                                }
                            }
                            else {
                                var sc = s.split("|");
                                pc = [];
                                for (var isc in sc) {
                                    var scs = sc[isc].split("/"); // example: 90/blue/+2,70/lightblue/+1,0/red/No Bonus'
                                    pc.push({
                                        threshold: (parseFloat(scs[0]) / 100.0) * (scorebasis - scorelow), //Convert to a score so the drawing routine will work.
                                        color: scs[1],
                                        letter: scs[2]
                                    });
                                }
                            }
                        }
                        catch (e) {
                            alert("Settings Error: " + e.message);
                            settingsindex = -1;
                        }
                    }

                    if (settingsindex < 0) {
                        pc = a$.WindowTop().apmPerformanceColors;
                    }


                    for (var i in pc) {
                        var xlow = (leftPos + ((rightPos - leftPos) * ((((pc[i].threshold < scorelow) ? scorelow : pc[i].threshold) - scorelow) / (scorebasis - scorelow))));
                        var xhigh = (leftPos + ((rightPos - leftPos) * ((topnum - scorelow) / (scorebasis - scorelow))));
                        bld += '<rect x="' + xlow + '" y="20" width="' + (xhigh - xlow) + '" height="20" fill="' + pc[i].color + '"  />';
                        bld += '<text x="' + (xlow + ((xhigh - xlow) / 2)) + '" y="15" font-family="Arial" fill="white" font-size="12" text-anchor="middle">' + pc[i].letter + '</text>';
                        topnum = pc[i].threshold;
                    }
                    /*
                    bld += '<rect x="15" y="20" width="90" height="20" fill="red"  />';
                    bld += '<text x="60" y="15" font-family="courier" fill="white" font-size="12" text-anchor="middle">Red</text>';
                    bld += '<rect x="105" y="20" width="90" height="20" fill="yellow"  />';
                    bld += '<rect x="195" y="20" width="90" height="20" fill="green"  />';
                    */

                    var percentage = 0.0;
                    var percentage_for_label = 0.0;
                    try {
                        //WAS:
                        //percentage_for_label = 1.0 - ((parseFloat(rs[1] - 1.0) / parseFloat(rs[2])));  //    Label/position/total/ties
                        percentage_for_gauge = 1.0 - ((parseFloat(rs[1]) / parseFloat(rs[2])));  //    Label/position/total/ties
                        if (percentagedisplay == "percentile") {
                            percentage = 1.0 - ((parseFloat(rs[1] - 1.0) / parseFloat(rs[2])));  //    Label/position/total/ties
                        }
                        else if (percentagedisplay == "top") {
                            percentage = ((parseFloat(rs[1]) / parseFloat(rs[2])));  //    Label/position/total/ties
                        }
                        else if (percentagedisplay != "none") {
                            percentagedisplay = "none";
                        }
                        if (percentage > 1.0) percentage = 1.0;
                        if (percentage < 0.0) percentage = 0.0;
                        if (percentage_for_gauge > 1.0) percentage_for_gauge = 1.0;
                        if (percentage_for_gauge < 0.0) percentage_for_gauge = 0.0;
                    }
                    catch (e) {
                    }

                    var totalWidth = 240; // Total width of the three boxes together
                    var baseWidth = 15.0; // Triangle base
                    var baseXPos = leftPos + (totalWidth * percentage_for_gauge) - (baseWidth / 2); // Subtracting half the base width to center it

                    // Calculate the points for the triangle
                    var leftBasePoint = "" + baseXPos + ",50";
                    var topPoint = "" + (baseXPos + (baseWidth / 2)) + ",30"; // The top point of the triangle, extending upwards
                    var rightBasePoint = "" + (baseXPos + baseWidth) + ",50";
                    var points = leftBasePoint + " " + topPoint + " " + rightBasePoint;

                    bld += '<polygon id="indicator" points="' + points + '" fill="white" stroke="black" />';

                    var ranktext = rs[0] + ": ";
                    if (percentagedisplay != "none") {
                        ranktext += "" + Math.floor(percentage * 100.0) + "%,";
                    }
                    ranktext += " " + rs[1] + " of " + rs[2];
                    
                    bld += '<text x="150" y="65" font-family="Arial" fill="white" font-size="14" text-anchor="middle">' + ranktext + '</text>';

                    bld += '</svg>';

                    bld += '</div>';
                    /*
                    setTimeout(function() {
                        var totalWidth = 250; // Total width of the three boxes together
                        var baseWidth = 15.0; // Triangle base
                        var baseXPos = leftPos + (totalWidth * percentage) - (baseWidth / 2); // Subtracting half the base width to center it

                        // Calculate the points for the triangle
                        var leftBasePoint = "" + baseXPos + ",50";
                        var topPoint = "" + (baseXPos + (baseWidth / 2)) + ",30"; // The top point of the triangle, extending upwards
                        var rightBasePoint = "" + (baseXPos + baseWidth) + ",50";

                        // Update the indicator's position
                        var indicator = document.getElementById("indicator");
                        indicator.setAttribute("points", leftBasePoint + " " + topPoint + " " + rightBasePoint);
                    },2000);
                    */
                }
            }
        }
        return bld;
    }

    // global variables
    window.appApmContentTriggers = {
        process: process,
        BuildRankGauge: BuildRankGauge
    };
})();
