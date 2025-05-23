/************
appApmAttrition
1.0.1 - 
************/

(function () {
    if (!window.jQuery) { alert("This App requires jQuery"); return; }
    var $ = window.jQuery;

    var needlocations = true;
    var today = formatdate(new Date());

    var bd = new Date();
    bd.setDate(bd.getDate() - 100); //100 days ago.
    var backdate = formatdate(bd);
    //var backdate = "09/02/2014";

    var at = null;

    function showagents() {
        var csr = $("#selCSRs option:selected").val();
        if ($("#StgDashboard select").val() != "Agent") {
            $(".AttritionLedger").html("The Attrition Ledger is currently only available for the Agent dashboard.");
        }
        else {
            a$.ajax({ type: "GET", service: "JScript", async: true, data: { lib: "attrition", cmd: "gettable", needlocations: needlocations, backdate: backdate, search: $("#StgAttritionSearch select").val(), attloc: $("#selAttritionLocations").val() }, params: appApmDashboard.viewparams(0, true), dataType: "json", cache: false, error: a$.ajaxerror, success: loaded });
            function loaded(json) {
                if (a$.jsonerror(json)) {
                }
                else {
                    at = json.tbl;
                    //Dump Test
                    var bldA = "";
                    var bldD = "";
                    var bldR = "";
                    for (var i in at) {
                        if ((at[i].status == 1) || (at[i].status == 7)) {
                            if (at[i].placement == "On Team") {
                                bldA += mttr(i);
                            }
                            else {
                                bldR += mttr(i);
                            }
                        }
                        else {
                            bldD += mttr(i);
                        }
                    }
                    if (bldA != "") bldA = "<h5>Active Team-Assigned Agents</h5><table>" + mthr() + bldA + "</table>";
                    if (bldD != "") bldD = "<h5>Deactivated Agents On Teams or With History Since " + backdate + "</h5><table>" + mthr() + bldD + "</table>";
                    if (bldR != "") bldR = "<h5>Active Agents with No Team Assignment (probable reassignment or promotion)</h5><table>" + mthr() + bldR + "</table>";
                    var bld = bldD + bldR + bldA;
                    $(".AttritionLedger").html(bld);
                    //Sneak the locations into the box (so I don't have to mess with the settings load).
                    if (needlocations) {
                        needlocations = false;
                        bld = "";
                        bld += optsmu(json.locations);
                        var locbld = "";
                        for (var i in json.locations) {
                            if (locbld != "") locbld += ",";
                            locbld += "" + json.locations[i].value;
                        }
                        bld += optsmu([{ value: locbld, text: "(All Locations)"}]);
                        $('#selAttritionLocations').html(bld);
                        $('#selAttritionLocations').trigger("liszt:updated");
                    }
                    bindlinks();
                    $(".atr-tl-submit").unbind().bind("click", function () {
                        var root = $(this).parent().parent();
                        var me = {};
                        me.idx = $(":first-child", $(":first-child", root)).html();
                        if (confirm("Once submitted, the disposition for " + at[me.idx].name + " will be sent to Human Resources for review.  You won't be able to modify your answers or add notes once submitted.  Continue?")) {
                            me.uid = at[me.idx].uid;
                            me.teamid = at[me.idx].teamid;
                            me.entby = $.cookie("TP1Username");
                            me.name = $(".atr-select-event", root).val();
                            me.eventdt = $(".atr-input-eventdt", root).val();
                            me.disposition = $(".atr-select-disposition", root).val();
                            me.notes = $(".atr-input-notes", root).val();
                            a$.ajax({ type: "GET", service: "JScript", async: false, data: { lib: "attrition", cmd: "saveretention", me: me }, params: appApmDashboard.viewparams(0, true), dataType: "json", cache: false, error: a$.ajaxerror, success: loaded });
                            function loaded(json) {
                                if (a$.jsonerror(json)) {
                                }
                                else {
                                    at[json.retentionidx].id = parseInt(json.retentionid);
                                    $(".atr-idx-" + json.retentionidx + " .atr-tl-submit").replaceWith("<b>Logged by " + me.entby + "</b>");
                                    $(".atr-idx-" + json.retentionidx + " .atr-select-event").replaceWith(eventtext(me.name));
                                    $(".atr-idx-" + json.retentionidx + " .atr-input-eventdt").replaceWith(me.eventdt);
                                    $(".atr-idx-" + json.retentionidx + " .atr-select-disposition").replaceWith(me.disposition);
                                    $(".atr-idx-" + json.retentionidx + " .atr-input-notes").replaceWith(me.notes);
                                    $(".atr-link-idx-" + json.retentionidx).removeClass("atr-disposition-link").addClass("atr-expand-link").html("<span>" + json.retentionidx + "</span>+");
                                    bindlinks();
                                }
                            };
                        }
                    });
                    $(".atr-hr-submit").unbind().bind("click", function () {
                        var root = $(this).parent().parent();
                        var me = {};
                        me.idx = $(":first-child", $(":first-child", root)).html();
                        me.id = at[me.idx].events[at[me.idx].events.length - 1].id;
                        me.uid = at[me.idx].uid;
                        me.teamid = at[me.idx].teamid;
                        me.entby = at[me.idx].events[at[me.idx].events.length - 1].entby;
                        me.name = $(".atr-select-event", root).val();
                        me.eventdt = $(".atr-input-eventdt", root).val();
                        me.disposition = $(".atr-select-disposition", root).val();
                        me.notes = $(".atr-input-notes", root).val();
                        me.verifynotes = $(".atr-input-verifynotes", root).val();
                        me.verifyby = $.cookie("TP1Username");
                        if ((me.disposition == "Ask HR") || (me.name == "H")) {
                            alert("Verification Process: Please edit the fields containing 'Ask HR' to the correct value.");
                        }
                        else {
                            if (confirm("Once the HR change record for " + at[me.idx].name + " has been verified, the information will be used to calculate scores for supervisors in Acuity. Continue?")) {
                                a$.ajax({ type: "GET", service: "JScript", async: false, data: { lib: "attrition", cmd: "updateretention", me: me }, params: appApmDashboard.viewparams(0, true), dataType: "json", cache: false, error: a$.ajaxerror, success: loaded });
                                function loaded(json) {
                                    if (a$.jsonerror(json)) {
                                    }
                                    else {
                                        $(".atr-idx-" + me.idx + " .atr-hr-submit").replaceWith("<b>Logged by " + me.entby + "</b>");
                                        $(".atr-idx-" + me.idx + " .atr-select-event").replaceWith(eventtext(me.name));
                                        $(".atr-idx-" + me.idx + " .atr-input-eventdt").replaceWith(me.eventdt);
                                        $(".atr-idx-" + me.idx + " .atr-select-disposition").replaceWith(me.disposition);
                                        $(".atr-idx-" + me.idx + " .atr-input-notes").replaceWith(me.notes);
                                        $(".atr-idx-" + me.idx + " .atr-input-verifynotes").replaceWith(me.verifynotes);
                                        $(".atr-link-idx-" + me.idx).removeClass("atr-verification-link").addClass("atr-expand-link").html("<span>" + me.idx + "</span>+");
                                        bindlinks();
                                    }
                                };
                            }
                        }
                    });
                }
            }
        }
    }
    //mthr (master table header row)
    function mthr() {
        var bld = "<thead><tr><th>&nbsp;</th><th>Name</th><th>Kronos</th><th>Status</th><th>Placement</th><th>Location</th><th>Team Affiliation</th></tr></thead>";
        return bld;
    }

    function pad0(n, s) {
        var ret = "";
        for (var i = 0; i < (n - s.length); i++) {
            ret += "0";
        }
        ret += s;
        return ret;
    }
    function addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }
    //mttr (master table table row)
    function mttr(idx) {
        var r = at[idx];
        var bld = '<tr class="atr-agent-line">';
        var disposition = "";
        var verified = false;
        var askfordisposition = false;
        var askforverification = false;
        if (r.events.length > 0) {
            switch (r.events[r.events.length - 1].name) {
                case "T": //Terminated
                case "R": //Change of Role
                case "A": //Reassigned (to another team)
                case "X": //Other (not used)
                case "O": //Other (not used)
                    disposition = r.events[r.events.length - 1].disposition;
                    verified = (r.events[r.events.length - 1].verifyby != "");
            }
            //ADDED 2017-08-15
            if (r.status == "2") {
                var eventdtstr = r.events[r.events.length - 1].eventdt;
                var termdtstr = r.inactivedt;
                var s_event = eventdtstr.split("/");
                var d_event = new Date(s_event[2], s_event[0] - 1, s_event[1]);
                var s_term = termdtstr.split("/");
                var d_term = new Date(s_term[2], s_term[0] - 1, s_term[1]);
                if (d_event < d_term) {
                    if (r.events[r.events.length - 1].name == "R") { //If role changed, they aren't the responsibility of the team leader anymore.
                    }
                    else if (r.events[r.events.length - 1].name == "A") { //Reassigned agent
                        disposition = "";
                        verified = "";
                    }
                    else if (r.events[r.events.length - 1].name != "T") { //Catch all for not termed.
                        disposition = "";
                        verified = "";
                    }
                    else { //Looking for Termed > Reactivated > Termed, so for cases where the inactivedt > eventdt, if the agent was termed, then give some slack to avoid recording the same termination, thinking 60 days.
                        if (addDays(d_event, 60) < d_term) {
                            disposition = "";
                            verified = "";
                        }
                    }
                }
            }

        }



        if (((r.status == "1") || (r.status == "7")) && (r.placement == "On Team")) {
            if (r.events.length > 0) {
                bld += '<td class="atr-expand-link atr-link-idx-' + idx + '"><span>' + idx + '</span>+</td>';
            }
            else {
                bld += '<td>&nbsp;</td>';
            }
        }
        else if ((disposition == "") && ($("#StgAttritionTest select").val() == "Supervisor")) { //And Team Leader
            bld += '<td class="atr-disposition-link atr-link-idx-' + idx + '"><span>' + idx + '</span>No Disposition</td>';
            askfordisposition = true;
        }
        else if ((disposition != "") && (!verified) && ($("#StgAttritionTest select").val() == "HR")) { //HR
            bld += '<td class="atr-verification-link atr-link-idx-' + idx + '"><span>' + idx + '</span>Ready to Verify</td>';
            askforverification = true;
        }
        else {
            if (disposition != "") {
                bld += '<td class="atr-expand-link atr-link-idx-' + idx + '"><span>' + idx + '</span>+</td>';
            }
            else {
                bld += '<td>&nbsp;</td>';
            }
        }
        bld += "<td>" + r.name + " (" + r.uid + ")</td>";
        bld += "<td>" + r.kronos + "</td>";
        //bld += "<td>" + r.role + "</td>";
        var s = "unk";
        switch (r.status) {
            case "1":
                s = "Active";
                break;
            case "7":
                s = "In-Training";
                break;
            case "2":
                s = "Deactivated";
                if (disposition != "") s += "(" + disposition + ")";
                break;
            default:
                s = r.status;
                break;
        }
        bld += "<td>" + s + "</td>";
        //bld += "<td>" + r.hiredt + "</td>";
        bld += "<td>" + r.placement + "</td>";
        //bld += "<td>" + r.teamid + "</td>";
        bld += "<td>" + r.location + "</td>";
        bld += "<td>" + r.teamname + "</td>";
        bld += "</tr>";
        if ((r.events.length > 0) || (askfordisposition) || (askforverification)) {
            bld += '<tr class="atr-sublog atr-idx-' + idx + '" style="display:none;"><th>&nbsp;</th><th>Event</th><th>Date</th><th>Disposition</th><th>Notes</th><th>Logged By</th><th>Verification Notes</th><th>Verified By</th>';
            bld += '</tr>';
        }
        for (var j in r.events) {
            if ((askforverification) && (j == (r.events.length - 1))) {
                break;
            }
            var e = r.events[j];
            bld += '<tr class="atr-sublog atr-idx-' + idx + '" style="display:none;""><td>&nbsp;</td>';
            bld += "<td>" + eventtext(e.name) + "</td>";
            bld += "<td>" + e.eventdt + "</td>";
            bld += "<td>" + e.disposition + "</td>";
            bld += "<td>" + e.notes + "</td>";
            bld += "<td>" + e.entby + "</td>";
            bld += "<td>" + e.verifynotes + "</td>";
            bld += "<td>" + e.verifyby + "</td>";

            bld += "</tr>";
        }
        var lr = null;
        if (askforverification) {
            lr = r.events[r.events.length - 1];
        }
        if ((askfordisposition) || (askforverification)) {
            bld += '<tr class="atr-sublog atr-idx-' + idx + '" style="display:none;"><td><span>' + idx + '</span>&nbsp;</td>';
            if ((r.status == "1") || (r.status == "7")) {
                bld += '<td><select class="atr-select-event">';
                bld += optsmu([{ value: "R", text: "Change of Role" }, { value: "A", text: "Reassigned"}], (askforverification) ? lr.name : ""); //Removed "O" "Other"
                bld += '</select></td>';
            }
            else {
                bld += '<td><select class="atr-select-event">';
                bld += optsmu([{ value: "T", text: "Terminated"}], (askforverification) ? lr.name : ""); //Removed "X" "Other"
                bld += '</select></td>';
            }
            var myday = today;
            if (askforverification) {
                myday = lr.eventdt;
            }
            else {
                if (r.inactivedt != "") myday = r.inactivedt;
            }
            bld += '<td><input class="atr-input-eventdt" type="text" value="' + myday + '"/></td><td><select class="atr-select-disposition">';
            bld += optsmu([{ value: "Involuntary", text: "Involuntary" }, { value: "Voluntary", text: "Voluntary" }, { value: "Ask HR", text: "Ask HR"}], (askforverification) ? lr.disposition : "");
            bld += '</select></td><td><input class="atr-input-notes" type="text" value="';
            if (askforverification) bld += lr.notes;
            bld += '" /></td><td>';
            if (askfordisposition) {
                bld += '<input class="atr-tl-submit" type="button" value="Submit"/>';
            }
            else {
                bld += lr.entby;
            }
            if (askforverification) {
                bld += '</td><td><input class="atr-input-verifynotes" type="text" value="' + lr.verifynotes + '" /></td><td>';
                bld += '<input class="atr-hr-submit" type="button" value="Submit"/>';
            }
            bld += '</td></tr>';
        }
        if ((r.events.length > 0) || (askfordisposition)) {
            bld += '<tr class="atr-sublog atr-idx-' + idx + '" style="display:none;""><td>&nbsp;</td></tr>'; //adding a space
        }
        return bld;
    }

    function bindlinks() {
        $(".atr-expand-link,.atr-disposition-link,.atr-verification-link").unbind().bind("click", function () {
            var idx = $(":nth-child(1)", this).html();
            if ($(".atr-idx-" + idx + ":first").css("display") == "none") {
                $(".atr-idx-" + idx).show();
            }
            else {
                $(".atr-idx-" + idx).hide();
            }
        });
    }
    function eventtext(n) {
        var name = "Unknown";
        switch (n) {
            case "T":
                name = "Terminated";
                break;
            case "R":
                name = "Change of Role";
                break;
            case "A":
                name = "Reassigned";
                break;
            case "O": //Retained Other
            case "X": //Terminated Other
                name = "Other";
                break;
            case "H":
                name = "Ask HR";
                break;
            case "N":
                name = "New Assigned Team";
            default:
                break;
        }
        return name;
    }

    //TODO: applib?
    function formatdate(d) {
        var dd = d.getDate();
        var mm = d.getMonth() + 1; //January is 0!
        var yyyy = d.getFullYear();

        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        return mm + '/' + dd + '/' + yyyy;
    }
    function optsmu(ops, def) {
        var bld = "";
        for (var i in ops) {
            bld += '<option value="' + ops[i].value + '"'
            if (exists(def)) if (def == ops[i].value) bld += ' selected="selected"';
            bld += '>' + ops[i].text + '</option>';
        }
        return bld;
    }
    function exists(me) {
        return (typeof me != 'undefined');
    }

    // global variables
    window.appApmAttrition = {
        //filter-related (could be split out at some point)
        showagents: showagents
    };
})();

