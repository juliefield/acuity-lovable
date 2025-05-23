/************
appApmMessaging - Messaging App
1.2.3 - Fixed score cloning for subkpi setups
1.2.2 - Add Distribution History Chart
1.2.1 - CPH Scope Labeling (CPH first draft is included in 1.2.0)
1.2.0 - Added deactivated project recognition.
1.3.0 - Hook up model.
1.3.4 - Hook up KPI_AUX table for kpi aux components.
1.3.6 - Add model 3 as Talent Source Model
************/


(function () {
    if (!window.jQuery) { alert("This App requires jQuery"); return; }
    var $ = window.jQuery;

    var EDITING = false;

    var holdscores;

    var ad = null;
    var curscores;
    var curscoresparent;
    var dirtygadget = false;
    var gadgetpage = "";
    var plabel = "Project";
    var createwait;

    var negagentmsg = "System Alert - Your [possessive] [kpi] [scoretype] has [changetype] [score] [pointtype] [withinphrase].  Low scores can have a negative impact on performance reviews and pay.  Please review  your score and take corrective action.  If you believe this score is in error, please contact your supervisor.";
    var negsupmsg = "The [kpi] [scoretype] for [subordinate] [possessive] has [changetype] [score] [pointtype] [withinphrase].  Please review the score and, if appropriate, take corrective action.";
    var posagentmsg = "Congratulations - Your [possessive] [kpi] [scoretype] has [changetype] [score] [pointtype] [withinphrase]!  Your outstanding performance is recognized, and will have a positive impact on your performance reviews and pay potential. Keep up the good work!";
    var possupmsg = "The [kpi] [scoretype] for [subordinate] [possessive] has [changetype] [score] [pointtype] [withinphrase].  Please congratulate them for reaching this goal.";

    function initProjectAdmin(force) {
        if (!exists(force)) {
            if (ad !== null) { return; }
        }
        if (a$.urlprefix() == "ces.") {
            plabel = "Stage";
        }
        var databld = { lib: "admin", cmd: "getprojectadmin_withmodel", bkey: appLib.perfdate("Always") };
        a$.showprogress("projectadminprogress");
        a$.ajax({
            type: "GET", service: "JScript", async: true, data: databld, dataType: "json", cache: false, error: a$.ajaxerror,
            success: loaded
        });
        function loaded(json) {
            a$.hideprogress("projectadminprogress");
            if (!a$.jsonerror(json)) {
                ad = json;
                drawprojecttree();
                //$('.projectnode').qtip({ content: 'Click to Edit Project' });
                //$('.kpiadd').qtip({ content: 'Click to Add a New KPI to Project' });
                //WHAT HAPPENS IF THIS IS NOT ON? $(".companynode").trigger("click");
                $(".companynode").addClass("activenode");
                buildcompanyarea();
            }
        }
    }

    function buildcompanyarea() {
        clearfrm("company");
        var bld = '<div class="admin-org-desc"><label>Organization:</label>';
        bld += editspan({ value: ad.organization.desc, classes: 'admin-org' });
        bld += '</div>';
        bld += '<div class="admin-sectionbox"><span>Alert Configuration</span>';
        var spn;
        if (exists(ad.organization.evaluatealerts)) {
            bld += '<div class="admin-org-evaluatealerts stg-span stg-field"><label>Evaluate Alerts:</label>';
            bld += '<span id="StgEvaluateAlerts" class="stg"><select style="display:none;"><option value="On"';
            if (ad.organization.evaluatealerts == "Y") {
                bld += ' selected="selected"';
                spn = "On";
            }
            bld += '>On</option><option value="Off"';
            if (ad.organization.evaluatealerts == "N") {
                bld += ' selected="selected"';
                spn = "Off";
            }
            bld += '>Off</option></select><span style="display:none;">' + spn + '</span></span>';
            bld += '</div>';
            bld += '<div class="admin-alert-help">If alert evaluation is on, a nightly process is run to create alerts as defined in the system.  Turn this off if you do not wish for alerts to be evaluated.</div>';
        }
        if (exists(ad.organization.showalerts)) {
            bld += '<div class="admin-org-showalerts stg-span stg-field"><label>Show Alerts:</label>';
            bld += '<span id="StgShowAlerts" class="stg"><select style="display:none;"><option value="On"';
            if (ad.organization.showalerts == "Y") {
                bld += ' selected="selected"';
                spn = "On";
            }
            bld += '>On</option><option value="Off"';
            if (ad.organization.showalerts == "N") {
                bld += ' selected="selected"';
                spn = "Off";
            }
            bld += '>Off</option></select><span style="display:none;">' + spn + '</span></span>';
            bld += '</div>';
            bld += '<div class="admin-alert-help">Show alerts for alerts to be visible to agents, supervisors, and managers in the Acuity messaging system.  If this setting is "Off", then NO ALERTS (PAST OR PRESENT) will be visible in the messaging system.</div>';
        }
        bld += '</div>';
        bld += '<div class="admin-org-savecancel"><span class="admin-crumb">company</span><input type="button" class="admin-company-save" value="Save" /><input type="button" class="admin-company-cancel" value="Cancel" /></div>';
        $("#companyadminarea").html(bld);
        $(".admin-org input").unbind().bind("keyup", function () {
            var dirty = false;
            $(".admin-org input").each(function () {
                if ($(" span", $(this).parent()).html() != $(this).val()) { dirty = true; }
            });
            if (dirty) { $(".admin-org-savecancel").show(); }
            //else $(".admin-org-savecancel").hide();
        });
        $("#StgShowAlerts select,#StgEvaluateAlerts select").bind("change", function () {
            var dirty = false;
            if ($(" span", $(this).parent()).html() != $(this).val()) { dirty = true; }
            if (dirty) { $(".admin-org-savecancel").show(); }
            //else $(".admin-org-savecancel").hide();
        });
        if (exists(ad.organization.evaluatealerts)) {
            appApmSettings.init({ id: "StgEvaluateAlerts", ui: "iphoneswitch" });
            appApmSettings.init({ id: "StgShowAlerts", ui: "iphoneswitch" });
        }

        bindsavecancel("company");
        //appApmSettings.init({ id: "AdminCompanyEditing", shadow: "StgEditing", ui: "iphoneswitch" });
    }

    function buildmodelarea(m) {
        clearfrm("model");
        var bld = "";
        if (!exists(m)) {
            bld += "Note: Models are definable only at the programming level - please contact TPO.";
        }
        else {
            bld = '<h5>' + ad.model[m].name + ' Model Admin</h5>';
            bld += '<p>' + ad.model[m].desc + '</p>';
        }
        $("#modeladminarea").html(bld);
    }

    function buildprojectarea(m, p) {
        clearfrm("project");
        if (!exists(p)) {
            var found = false;
            for (var i in ad.model[m].project) {
                if (ad.model[m].project[i].id == "NEW") {
                    p = i;
                    found = true;
                    break;
                }
            }
            if (!found) {
                ad.model[m].project.push({ id: 'NEW', desc: '', status: 'A', adding: true, kpi: {} });
                p = ad.model[m].project.length - 1;
            }
        }

        var bld = '<div class="admin-project-desc"><label>' + plabel + ':</label>';
        bld += editspan({ value: ad.model[m].project[p].desc, classes: "admin-project", adding: ad.model[m].project[p].adding });
        bld += '</div>';
        bld += '<div class="admin-project-savecancel"><span class="admin-crumb">project,' + m + ',' + p + '</span><input type="button" class="admin-project-save" value="Save" /><input type="button" class="admin-project-cancel" value="Cancel" /></div>';
        if ((ad.model[m].project[p].kpi.length > 0) && (ad.model[m].project[p].id != "NEW")) {
            var totweight = 0.0;
            bld += '<div class="admin-kpilist"><h1>KPIs for this Project:</h1><table><thead><tr><td>Name</td><td>Weight</td><td>&nbsp;</td></tr></thead><tbody>';
            for (var i in ad.model[m].project[p].kpi) {
                var weight = Math.round(parseFloat(ad.model[m].project[p].kpi[i].weight) * 100) / 100;
                totweight += weight;
                bld += '<tr><td>' + ad.model[m].project[p].kpi[i].desc + '</td><td>' + weight + '</td>'
                bld += '<td><span class="admin-link admin-kpi-edit"><span class="admin-crumb">' + ad.model[m].project[p].kpi[i].id + '</span>edit</span></td>';
                bld += '</tr>';
            }
            bld += '</tbody><tfoot><tr><td>Total Weight</td><td>' + (Math.round(totweight * 100) / 100) + '</td><td>&nbsp;</td></tr></tfoot>';
            bld += '</table></div>';
        }
        var nbp = 0;
        if ((ad.model[m].bestpractices.kpi.length > 0) && (ad.model[m].project[p].id != "NEW")) {
            var totweight = 0.0;
            bld += '<div class="admin-kpilist admin-bestpractices-kpi"><h1>Recommended KPIs for this Project (' + ad.model[m].name + ' model).  Theses KPIs have NOT yet been created:</h1><table><thead><tr><td>KPI Name</td><td>Weight</td><td>&nbsp;</td></tr></thead><tbody>';
            for (var i in ad.model[m].bestpractices.kpi) {
                var found = false;
                for (var j in ad.model[m].project[p].kpi) {
                    if (ad.model[m].bestpractices.kpi[i].desc == ad.model[m].project[p].kpi[j].desc) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    var weight = Math.round(parseFloat(ad.model[m].bestpractices.kpi[i].weight) * 100) / 100;
                    totweight += weight;
                    bld += '<tr><td>' + ad.model[m].bestpractices.kpi[i].desc + '</td><td>' + weight + '</td>'
                    bld += '<td><span class="admin-link admin-kpi-create"><span class="admin-crumb">bestpractices,' + m + ',' + p + ',' + i + '</span>create</span></td>';
                    bld += '</tr>';
                    nbp += 1;
                }
            }
            bld += '</tbody><tfoot><tr><td>Total Weight</td><td>' + (Math.round(totweight * 100) / 100) + '</td>'
            bld += '<td><span class="admin-link admin-kpi-create"><span class="admin-crumb">bestpractices,' + m + ',' + p + '</span>create all</span></td>';
            bld += '</tr></tfoot>';
            bld += '</table></div>';
        }

        $("#projectadminarea").html(bld);

        if (nbp == 0) $(".admin-bestpractices-kpi").hide();

        $(".admin-kpi-edit").unbind().bind("click", function () {
            var id = parseInt($(".admin-crumb", this).html());
            editkpi(id);
        });
        $(".admin-kpi-create").unbind().bind("click", function () {
            var pss = $(".admin-crumb", this).html().split(',');
            var m, p, b = -1;
            switch (pss[0]) {
                case "bestpractices":
                    m = parseInt(pss[1]);
                    p = parseInt(pss[2]);
                    if (pss.length >= 4) {
                        b = parseInt(pss[3]);
                    }
                    break;
            }
            var msg = "Note: The system may by UNRESPONSIVE for up to 1 minute.  Click 'OK', then please wait for the screen to clear and the Admin tree (on the left) to update before continuing.";
            if (b < 0) {
                if (!confirm("Are you sure you want to create ALL of the recommended KPIs?")) return;
                alert(msg);
                clearstate();
                $('#companyadminlabel').show().trigger('click');
                for (var i in ad.model[m].bestpractices.kpi) {
                    var found = false;
                    for (var j in ad.model[m].project[p].kpi) {
                        if (ad.model[m].bestpractices.kpi[i].desc == ad.model[m].project[p].kpi[j].desc) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) createbestpracticeskpi(m, p, i);
                }
            }
            else {
                alert(msg);
                clearstate();
                $('#companyadminlabel').show().trigger('click');
                createbestpracticeskpi(m, p, b);
            }
        });

        setalertbindings("project", "projectadminarea", "Balanced Score", false, true, m, p);

        $(".admin-project input").unbind().bind("keyup", function () {
            var dirty = false;
            $(".admin-project input").each(function () {
                if ($(" span", $(this).parent()).html() != $(this).val()) dirty = true;
            });
            if (dirty) $(".admin-project-savecancel").show();
            else $(".admin-project-savecancel").hide();
        });
        bindsavecancel("project");
    }

    function singularize(txtin, num) {
        var txt = "" + txtin;
        if (num == 1) {
            if (txt[txt.length - 1] == "s") {
                txt = txt.substr(0, txt.length - 1);
            }
        }
        else {
            if (txt[txt.length - 1] != "s") {
                txt = txt + "s";
            }
        }
        return txt;
    }

    function setalertbindings(parenttype, rootid, kpiname, hasraw, haskpi, m, p, k, s) {

        bld = "";
        bld += '<div class="admin-alert"><h1>Alerts for <strong>' + kpiname + '</strong>&nbsp;<a class="help" target="_blank" href="../help.aspx?cid=Alerts" >&nbsp;&nbsp;&nbsp;</a></h1>';
        var a;
        var alerts = true;
        var display = true;
        if (!exists(k)) {
            if (!exists(ad.model[m].project[p].alert)) alerts = false;
            else a = ad.model[m].project[p].alert;
            if (ad.model[m].project[p].id == "NEW") display = false;
        }
        else if (!exists(s)) {
            if (!exists(ad.model[m].project[p].kpi[k].alert)) alerts = false;
            else a = ad.model[m].project[p].kpi[k].alert;
            if (ad.model[m].project[p].kpi[k].id == "NEW") display = false;
        }
        else {
            if (!exists(ad.model[m].project[p].kpi[k].subkpi[s].alert)) alerts = false;
            else a = ad.model[m].project[p].kpi[k].subkpi[s].alert;
            if (ad.model[m].project[p].kpi[k].subkpi[s].id == "NEW") display = false;
        }

        if (!display) return;

        if (alerts) {
            for (var i in a) {
                var idstr;

                var cph = (a[i].enhanced && exists(a[i].cph));
                if (!exists(k)) idstr = "project," + m + "," + p + "," + i;
                else if (!exists(s)) idstr = "kpi," + m + "," + p + "," + k + "," + i;
                else idstr = "subkpi," + m + "," + p + "," + k + "," + s + "," + i;
                bld += '<div class="admin-alert-listing">FOR ' + a[i].scope + 's ';
                if (exists(a[i].constraint)) {
                    bld += 'IN ' + a[i].constraint.type;
                    if (a[i].constraint.type != "Project") {
                        bld += ' "' + a[i].constraint.name + '"';
                    }
                }
                bld += ', IF <strong>' + a[i].scoretype + '</strong> <strong>' + a[i].changetype + '</strong> <strong>';
                if (cph) {
                    bld += a[i].cph.percent + "%";
                }
                else {
                    bld += a[i].score;
                }
                bld += '</strong>';
                if ((a[i].changetype == 'Decreases By') || (a[i].changetype == 'Increases By')) {
                    bld += ' ' + a[i].pointtype + ' within <strong>' + a[i].number + ' ' + a[i].interval + '</strong>';
                }
                if (cph) {
                    bld += ' OF <strong>' + a[i].cph.mark + '</strong> FOR ';
                    bld += '<strong>';
                    if (a[i].cph.splits == "") {
                        bld += "All Splits";
                    }
                    else {
                        bld += "(list of splits)";
                    }
                    bld += '</strong>';
                }
                bld += ', notify <strong>' + a[i].notify + '</strong>';
                var allowedits = false;
                if (($.cookie("TP1Role") != "Team Leader") && ($.cookie("TP1Role") != "Group Leader")) {
                    allowedits = true;
                }
                else if ((($.cookie("TP1Role") == "Team Leader") || ($.cookie("TP1Role") == "Group Leader")) && (a[i].constraint.type == "Team")) {
                    //TODO: See if this team leader is the leader of a team that can be edited.
                    //For now, just see if they're in the box (I don't truly know which team they are team leader for.
                    $("#selTeams option").each(function () {
                        try {
                            if (parseInt($(this).val()) == a[i].constraint.id) {
                                allowedits = true;
                            }
                        } catch (err) { }
                    });
                }
                else if (($.cookie("TP1Role") == "Group Leader") && (a[i].constraint.type == "Group")) {
                    //TODO: See if this group leader is the leader of a group that can be edited.
                    //For now, just see if they're in the box (I don't truly know which team they are team leader for.
                    $("#selGroups option").each(function () {
                        try {
                            if (parseInt($(this).val()) == a[i].constraint.id) {
                                allowedits = true;
                            }
                        } catch (err) { }
                    });
                }

                if (allowedits) {
                    bld += '&nbsp;<span><span class="admin-crumb">' + idstr + '</span><span class="admin-link admin-alert-edit">edit</span></span>';
                    bld += '<span><span class="admin-crumb">' + idstr + '</span><span class="admin-link admin-alert-delete">delete</span></span>';
                }
                bld += '</div>';
            }
        }
        if (kpiname == "CPH") {
            bld += '<div><span class="admin-link admin-alert-add">add standard alert</span>';
            bld += '<span class="admin-link admin-alert-add admin-alert-add-enhanced" style="margin-left: 30px;">add Calls-Per-Hour ENHANCED alert</span></div>';
        }
        else {
            bld += '<div class="admin-link admin-alert-add">add</div>';
        }


        $("#" + rootid).append(bld);

        $("#" + rootid + " .admin-alert-edit").unbind().bind("click", function () {
            var pss = $(this).parent().children().first().html().split(',');
            var myalert;
            var aindex;
            var m, p, k, s, a;
            switch (pss[0]) {
                case "project":
                    m = parseInt(pss[1]);
                    p = parseInt(pss[2]);
                    a = parseInt(pss[3]);
                    aindex = parseInt(pss[3]);
                    myalert = ad.model[m].project[p].alert[a];
                    break;
                case "kpi":
                    m = parseInt(pss[1]);
                    p = parseInt(pss[2]);
                    k = parseInt(pss[3]);
                    a = parseInt(pss[4]);
                    aindex = parseInt(pss[4]);
                    myalert = ad.model[m].project[p].kpi[k].alert[a];
                    break;
                case "subkpi":
                    m = parseInt(pss[1]);
                    p = parseInt(pss[2]);
                    k = parseInt(pss[3]);
                    s = parseInt(pss[4]);
                    a = parseInt(pss[5]);
                    aindex = parseInt(pss[4]); //BUG: Should this be a 5?
                    myalert = ad.model[m].project[p].kpi[k].subkpi[s].alert[a];
                    break;
                default:
                    alert("Error: unhandled edit");
            }
            buildalerteditor({ appendto: $(this).parent().parent(),
                alert: myalert,
                parenttype: parenttype,
                hasraw: hasraw,
                haskpi: haskpi,
                kpiname: myalert.kpi,
                m: m,
                p: p,
                k: k,
                s: s,
                enhanced: myalert.enhanced,
                aindex: aindex,
                wrapper: ['<div class="admin-alert-edit-wrapper" style="height:420px;">', '</div>'],
                savelabel: 'Save Changes'
            });
        });

        $("#" + rootid + " .admin-alert-delete").unbind().bind("click", function () {
            var pss = $(this).parent().children().first().html().split(',');
            var aindex, m, p, k, s, a;
            switch (pss[0]) {
                case "project":
                    m = parseInt(pss[1]);
                    p = parseInt(pss[2]);
                    a = parseInt(pss[3]);
                    aindex = parseInt(pss[3]);
                    if (confirm("Are you sure you wish to delete this alert?")) {
                        //TODO: Save the deletion
                        deletealert(ad.model[m].project[p].alert[a]);
                        ad.model[m].project[p].alert.splice(a, 1);
                        buildmodelarea(m);
                        buildprojectarea(m, p);
                    }
                    break;
                case "kpi":
                    m = parseInt(pss[1]);
                    p = parseInt(pss[2]);
                    k = parseInt(pss[3]);
                    a = parseInt(pss[4]);
                    aindex = parseInt(pss[4]);
                    if (confirm("Are you sure you wish to delete this alert?")) {
                        //TODO: Save the deletion
                        deletealert(ad.model[m].project[p].kpi[k].alert[a]);
                        ad.model[m].project[p].kpi[k].alert.splice(a, 1);
                        buildkpiarea(m, p, k);
                    }
                    break;
                case "subkpi":
                    m = parseInt(pss[1]);
                    p = parseInt(pss[2]);
                    k = parseInt(pss[3]);
                    s = parseInt(pss[4]);
                    a = parseInt(pss[5]);
                    aindex = parseInt(pss[4]);
                    if (confirm("Are you sure you wish to delete this alert?")) {
                        //TODO: Save the deletion
                        deletealert(ad.model[m].project[p].kpi[k].subkpi[s].alert[a]);
                        ad.model[m].project[p].kpi[k].subkpi[s].alert.splice(a, 1);
                        buildsubkpiarea(m, p, k, s);
                    }
                    break;
                default:
                    alert("Error: unhandled delete");
            }

        });

        var newalert = {
            scope: "Agent", //new 4/9/14
            scoretype: "KPI",
            changetype: "Falls Below",
            score: "4.0",
            number: "1",
            hasraw: hasraw,
            haskpi: haskpi,
            pointtype: "points",
            interval: "Days",
            cconly: "",
            ccmanagers: "",
            ccemails: "",
            notify: "Agent and Supervisor",
            agentmessage: negagentmsg,
            constraint: {
                type: "",
                id: 0,
                name: ""
            },
            supmessage: negsupmsg,
            cph: { //new 4/9/14
                percent: "90.0",
                mark: "Average AHT",
                splits: "All Call Types"
            }
        };
        $("#" + rootid + " .admin-alert-add").unbind().bind("click", function () {
            buildalerteditor({ appendto: $("#" + rootid),
                alert: newalert,
                parenttype: parenttype,
                hasraw: hasraw,
                haskpi: haskpi,
                kpiname: kpiname,
                m: m,
                p: p,
                k: k,
                s: s,
                enhanced: $(this).hasClass("admin-alert-add-enhanced"),
                //wrapper: ['<div class="admin-alert-add-wrapper"><label>Add Alert</label><br /><div class="admin-alert-add-box">', '</div></div>']
                wrapper: ['<div class="admin-alert-add-wrapper">', '</div>'],
                savelabel: 'Save New Alert'
            });
            //$(this).hide();
        });
    }

    function deletealert(a) {
        var databld = { lib: "admin", cmd: "deletealert", alertid: a.id };
        a$.showprogress("projectadminprogress", "Deleting...");
        a$.ajax({
            type: "POST", service: "JScript", async: true, data: databld, dataType: "json", cache: false, error: a$.ajaxerror,
            success: deletedalert
        });
        function deletedalert(json) {
            a$.hideprogress("projectadminprogress");
            if (a$.jsonerror(json)) {
                //default is enough
            }
        }
    }

    function buildalerteditor(o) {
        $(".admin-alertblock").remove();
        var cph = false; //Added 4/9/2014 - CPH enhanced alert
        if (o.parenttype == "kpi") {
            if (o.kpiname == "CPH") {
                if (o.enhanced) {
                    cph = true;
                }
            }
        }
        var b = '<div class="admin-alertblock">' + o.wrapper[0];
        b += 'For&nbsp;';
        b += '<select class="admin-alert-select admin-alert-scope">';
        if (ad.model[o.m].id != 2) {
            b += '<option value="Agent">Agent</option>';
        }
        if ($.cookie("TP1Role") != "Team Leader") {
            b += '<option value="Team">Team</option>';
        }
        if (($.cookie("TP1Role") != "Team Leader") && ($.cookie("TP1Role") != "Group Leader")) {
            b += '<option value="Group">Group</option><option value="Project">Project</option>';
        }
        b += '</select>';
        b += '&nbsp;in&nbsp;<select class="admin-alert-select admin-alert-constraint">';

        if (($.cookie("TP1Role") != "Team Leader") && ($.cookie("TP1Role") != "Group Leader")) {
            b += '<option value="Project">Project</option>';
        }
        if ($.cookie("TP1Role") == "Group Leader") {
            $("#selGroups option").each(function () {
                try {
                    var id = parseInt($(this).val());
                    if (!isNaN(id)) {
                        b += '<option value="Group/' + id + '"';
                        if (o.alert.constraint.type == "Group") {
                            if (o.alert.constraint.id == id) {
                                b += ' selected="selected"';
                            }
                        }
                        b += '>' + $(this).html() + '</option>';
                    }

                } catch (err) { }
            });
        }
        if (($.cookie("TP1Role") == "Team Leader") || ($.cookie("TP1Role") == "Group Leader")) {
            $("#selTeams option").each(function () {
                try {
                    var id = parseInt($(this).val());
                    if (!isNaN(id)) {
                        b += '<option value="Team/' + id + '"';
                        if (o.alert.constraint.type == "Team") {
                            if (o.alert.constraint.id == id) {
                                b += ' selected="selected"';
                            }
                        }
                        b += '>' + $(this).html() + '</option>';
                    }
                } catch (err) { }
            });
        }
        b += '</select>';
        b += '&nbsp;if&nbsp;<select class="admin-alert-select admin-alert-scoretype">';
        if (!cph) {
            if (o.haskpi) {
                b += '<option value="KPI">KPI</option>';
            }
            //05/30/2013 - Special Exception for ERS - Don't allow alerts on Raw Scores.
            if ((a$.urlprefix() != "ers.")) {
                if (o.hasraw) {
                    b += '<option value="Raw Score">Raw Score</option>';
                }
            }
        }
        else {
            b += '<option value="Raw Score">Raw Score</option>';
        }
        b += '</select>';
        // TODO: It's restricted to just "Falls Below" and "Rises Above" for now ("Increases By" and Decreases By" need some rule specs before implementation.
        b += '&nbsp;<select class="admin-alert-select admin-alert-changetype"><option selected="selected" value="Falls Below">Falls Below</option><option value="Rises Above">Rises Above</option></select>';
        //WAS: b += '&nbsp;<select class="admin-alert-select admin-alert-changetype"><option selected="selected" value="Falls Below">Falls Below</option><option selected="selected" value="Rises Above">Rises Above</option><option value="Decreases By">Decreases By</option><option value="Increases By">Increases By</option></select>';
        if (cph) {
            b += '&nbsp;<span><input type="text" class="admin-alert-text admin-alert-cph-percent" value="' + o.alert.cph.percent + '" />';
            b += '<ul class="spinner"><li><input type="button" value="&#9650;"/></li><li><input type="button" value="&#9660;"/></li></ul></span>';
            b += '%&nbsp;of&nbsp';
            b += '<select class="admin-alert-select admin-alert-cph-mark"><option value="Average AHT">Average AHT</option><option value="Lowest Optimal AHT">Lowest Optimal AHT</option><option value="Highest Optimal AHT">Highest Optimal AHT</option></select>'
            b += '%&nbsp;for&nbsp';
            //b += '<select id="ccmanagers" style="width:250px;" data-placeholder="Click Here to Select Recipients." class="admin-alert-cclist" multiple><option value=""></option></select>';
            b += '<span style="vertical-align: top;"><select id="cphsplits" style="width:300px;vertical-align:top;" data-placeholder="ALL SPLITS (Click Here to Select Subset)." class="admin-alert-cph-splits" multiple><option value=""></option></select></span>';
        }
        else {
            b += '&nbsp;<span><input type="text" class="admin-alert-text admin-alert-score" value="' + o.alert.score + '" />';
            b += '<ul class="spinner"><li><input type="button" value="&#9650;"/></li><li><input type="button" value="&#9660;"/></li></ul></span>';
        }
        b += '<span class="admin-alert-within">&nbsp;<select class="admin-alert-select admin-alert-pointtype"><option selected="selected" value="points">points</option><option value="percent">percent</option></select>&nbsp;within&nbsp;';
        b += '<span><input type="text" class="admin-alert-text admin-alert-number" value="' + o.alert.number + '" />';
        b += '<ul class="spinner"><li><input type="button" value="&#9650;"/></li><li><input type="button" value="&#9660;"/></li></ul></span>';
        b += '&nbsp;';
        //TODO: Make this pull from the intervals table.
        b += '<select class="admin-alert-select admin-alert-interval"><option selected="selected" value="Day">Day</option><option value="Pay Period">Pay Period</option><option value="Month">Month</option><option value="Quarter">Quarter</option><option value="Year">Year</option></select></span>';
        b += ', notify&nbsp;<select class="admin-alert-select admin-alert-notify"></select>'; //Save<option>Agent</option><option>Supervisor</option><option selected="selected" value="Agent and Supervisor">Agent &amp; Supervisor</option>
        b += '<div class="admin-alert-messagesline">';
        b += '<div class="admin-alert-messagediv admin-alert-messagediv-agent"><label>Message for <span class="admin-alert-messagediv-agent-label">Agent</span></label><br /><textarea class="admin-alert-messagebox admin-alert-agentmessage">' + o.alert.agentmessage + '</textarea><div class="admin-messagebox-linkfooter"><div class="admin-messagebox-resetnegative">reset(negative)</div><div class="admin-messagebox-resetpositive">reset(positive)</div><div class="admin-messagebox-preview">preview</div></div></div>';
        b += '<div class="admin-alert-messagediv admin-alert-messagediv-supervisor"><label>Message for <span class="admin-alert-messagediv-supervisor-label">Supervisor</span></label><br /><textarea class="admin-alert-messagebox admin-alert-supmessage">' + o.alert.supmessage + '</textarea><div class="admin-messagebox-linkfooter"><div class="admin-messagebox-resetnegative">reset(negative)</div><div class="admin-messagebox-resetpositive">reset(positive)</div><div class="admin-messagebox-preview">preview</div></div></div>';
        b += '<div class="admin-alert-messagediv"><div class="admin-alert-adddiv"><span class="admin-crumb">'
        if (o.parenttype == "project") {
            b += "project," + o.m + "," + o.p;
        }
        else if (o.parenttype == "kpi") {
            b += "kpi," + o.m + "," + o.p + "," + o.k;
        }
        else {
            b += "subkpi," + o.m + "," + o.p + "," + o.k + "," + o.s;
        }
        b += '</span><span class="admin-alert-ccmanager"><label>CC:</label>';
        b += '<select id="ccmanagers" style="width:250px;" data-placeholder="Click Here to Select Recipients." class="admin-alert-cclist" multiple><option value=""></option></select>';
        b += '</span><br /><label style="font-size:10px;"><br />List other email addresses, separated by commas.</label><br /><textarea id="ccemails" rows="4" cols="25" style="height:40px;" class="admin-alert-ccemaillist"></textarea><span style="font-size:4px;"><br /><br /></span><span class="admin-alert-cconly"><input type="checkbox" /><label>Send alerts to ONLY these CC\'ed users.</label></span><span style="font-size:4px;"><br /><br /></span><input class="admin-alert-button-add" type="button" value="' + o.savelabel + '" /><input class="admin-alert-button-cancel" type="button" value="cancel" /></div></div>';
        b += '</div>';
        b += o.wrapper[1] + '</div>';
        $(o.appendto).append(b);

        $('.admin-alert-cconly input').prop('checked', (o.alert.cconly == "Y"));

        $("#ccmanagers").find("optgroup").remove();
        $("#ccmanagers").find("option").remove();
        $("#ccmanagers").append($('<optgroup label="SUPERVISORS"></optgroup>'));
        var cnt;
        cnt = appApmMessaging.getsup_cnt();
        for (var i = 0; i < cnt; i++) {
            $("#ccmanagers").children().last().append($('<option></option>').val(appApmMessaging.getsup_username(i)).html(appApmMessaging.getsup_name(i)));
        }
        //load managers.
        $("#ccmanagers").append($('<optgroup label="MANAGERS and ADMINISTRATION"></optgroup>'));
        cnt = appApmMessaging.getmgr_cnt();
        for (var i = 0; i < cnt; i++) {
            $("#ccmanagers").children().last().append($('<option></option>').val(appApmMessaging.getmgr_username(i)).html(appApmMessaging.getmgr_name(i)));
        }
        var mspl = o.alert.ccmanagers.split(",");
        $("#ccmanagers option").each(function () {
            for (var i = 0; i < mspl.length; i++) {
                if ($(this).val() == mspl[i]) $(this).attr("selected", "selected");
            }
        });
        $("#ccmanagers").data("Placeholder", "Select Framework...").chosen();
        $("#ccmanagers").trigger("liszt:updated");
        $("#ccmanagers").bind("change", function () {
            //msgchecksend();
            //alert($(this).val());
        });
        $("#ccemails").val(o.alert.ccemails);

        if (cph) {
            $("#cphsplits").find("optgroup").remove();
            $("#cphsplits").find("option").remove();
            $("#cphsplits").append($('<optgroup label="SPLITS"></optgroup>'));
            for (var i in ad.model[o.m].project[o.p].kpi) {
                if (ad.model[o.m].project[o.p].kpi[i].desc == "AHT") {
                    for (var j = 0 in ad.model[o.m].project[o.p].kpi[i].subkpi) {
                        $("#cphsplits").children().last().append($('<option></option>').val(ad.model[o.m].project[o.p].kpi[i].subkpi[j].id).html(ad.model[o.m].project[o.p].kpi[i].subkpi[j].desc));
                    }
                }
            }
            //$("#cphsplits").children().last().append($('<option></option>').val("Split 1").html("Split 1"));
            var mspl = o.alert.cph.splits.split(",");
            $("#cphsplits option").each(function () {
                for (var i = 0; i < mspl.length; i++) {
                    if ($(this).val() == mspl[i]) $(this).attr("selected", "selected");
                }
            });

            $("#cphsplits").data("Placeholder", "Select Framework...").chosen();
            $("#cphsplits").trigger("liszt:updated");
            $("#cphsplits").bind("change", function () {
                //msgchecksend();
                //alert($(this).val());
            });
        }

        //save the select boxes via jquery
        $(".admin-alert-scope", $(o.appendto)).val(o.alert.scope);
        $(".admin-alert-scoretype", $(o.appendto)).val(o.alert.scoretype);
        $(".admin-alert-changetype", $(o.appendto)).val(o.alert.changetype);
        $(".admin-alert-pointtype", $(o.appendto)).val(o.alert.pointtype);
        $(".admin-alert-interval", $(o.appendto)).val(o.alert.interval);
        $(".admin-alert-notify", $(o.appendto)).val(o.alert.notify);
        if ((o.alert.changetype == "Decreases By") || (o.alert.changetype == "Increases By")) {
            $(".admin-alert-within", $(o.appendto)).show();
        }
        if (cph) {
            $(".admin-alert-cph-percent", $(o.appendto)).val(o.alert.cph.percent);
            $(".admin-alert-cph-mark", $(o.appendto)).val(o.alert.cph.mark);
        }
        $(".spinner input").unbind().bind("click", function () {
            var mynum = $(this).parent().parent().parent().children().first();
            var inc = 1.0;
            var min = -1000;
            var max = 1000;
            if ($(mynum).hasClass("admin-alert-score")) {
                inc = 0.1;
            }
            else if ($(mynum).hasClass("admin-alert-number")) {
                min = 1;
                max = 100;
            }
            if ($(this).parent().index() > 0) inc = -inc;
            var num = parseFloat($(mynum).val());
            if (num != NaN) {
                num += inc;
                num = Math.round(num * 10000) / 10000;
                if ((num <= max) && (num >= min)) {
                    $(mynum).val(num);
                    if ($(mynum).hasClass("admin-alert-number")) $(".admin-alert-number").trigger("change");
                }
            }
        });

        $(".admin-alert-number").bind("change", function () {
            var mynum = parseFloat($(this).val());
            if (mynum != NaN) {
                mynum = Math.round(mynum * 10000) / 10000;
                $(".admin-alert-interval").children().each(function () {
                    $(this).html(singularize($(this).html(), mynum));
                });

            }
        });
        $(".admin-alert-scope").bind("change", function () {
            var nhold = $(".admin-alert.notify").val();
            switch ($(this).val()) {
                case "Agent":
                    $(".admin-alert-notify").html('<option value="Agent and Supervisor">Agent &amp; Supervisor</option><option>Agent</option><option>Supervisor</option>');
                    break;
                case "Team":
                    $(".admin-alert-notify").html('<option value="Team Leader and Group Leader">Team Leader &amp; Group Leader</option><option>Team Leader</option><option>Group Leader</option>');
                    break;
                case "Group":
                    $(".admin-alert-notify").html('<option value="Group Leader">Group Leader</option>');
                    break;
                case "Project":
                    $(".admin-alert-notify").html('<option value="none">CC&#39;d Managers</option>');
                    break;
                default:
                    break;
            }
            $(".admin-alert-notify", $(o.appendto)).val(o.alert.notify);
            $(".admin-alert-notify").trigger("change");
        });

        $(".admin-alert-number").trigger("change");
        $(".admin-alert-scope").trigger("change");

        //Sort of works, I don't like the jquery-ui dependence: $('.admin-alert-number').spinner({ min: -1000, max: 1000, increment: 'fast' });

        //$(this).hide();
        $(".admin-alert-changetype").unbind().bind("change", function () {
            if (($(this).val() == "Decreases By") || ($(this).val() == "Increases By")) {
                $(".admin-alert-within", $(this).parent()).show();
            }
            else {
                $(".admin-alert-within", $(this).parent()).hide();
            }
        });
        $(".admin-alert-notify").unbind().bind("change", function () {
            var a = ".admin-alert-messagediv-agent";
            var al = a + "-label";
            var s = ".admin-alert-messagediv-supervisor"
            var sl = s + "-label";
            switch ($(this).val()) {
                case "Agent":
                    $(a).show(); $(al).html("Agent"); $(s).hide();
                    break;
                case "Supervisor":
                    $(a).hide(); $(s).show(); $(sl).html("Supervisor");
                    break;
                case "Agent and Supervisor":
                    $(a).show(); $(al).html("Agent"); $(s).show(); $(sl).html("Supervisor");
                    break;
                case "Team Leader":
                    $(a).show(); $(al).html("Team Leader"); $(s).hide();
                    break;
                case "Group Leader":
                    $(a).hide(); $(s).show(); $(sl).html("Group Leader");
                    break;
                case "Team Leader and Group Leader":
                    $(a).show(); $(al).html("Team Leader"); $(s).show(); $(sl).html("Group Leader");
                    break;
                case "none":
                    $(a).show(); $(al).html("CC&#39;d Managers (select ->)"); $(s).hide();
                    break;
                default:
                    $(a).show(); $(al).html("UNKNOWN"); $(s).show(); $(sl).html("UNKNOWN");
            }
        });
        $(".admin-alert-notify").trigger("change");
        $(".admin-messagebox-preview").unbind().bind("click", function () {
            var boxtop = $(this).parent().parent().parent().parent();
            var msg = $(".admin-alert-messagebox", $(this).parent().parent()).val();
            msg = msg.replace(/\[kpi\]/g, o.kpiname);
            msg = msg.replace(/\[scoretype\]/g, $(".admin-alert-scoretype", $(boxtop)).val());

            var possessive = "";
            switch ($(".admin-alert-scope").first().val()) {
                case "Team":
                case "Group":
                case "Project":
                    possessive = " " + $(".admin-alert-scope").first().val();
            }
            msg = msg.replace(/\[possessive\]/g, possessive);

            var changetype = "";
            var withinphrase = false;
            switch ($(".admin-alert-changetype", $(boxtop)).val()) {
                case "Falls Below":
                    changetype = "fallen below";
                    break;
                case "Rises Above":
                    changetype = "risen above";
                    break;
                case "Decreases By":
                    changetype = "decreased by";
                    withinphrase = true;
                    break;
                case "Increases By":
                    changetype = "increased by";
                    withinphrase = true;
                    break;
            }
            msg = msg.replace(/\[changetype\]/g, changetype);
            msg = msg.replace(/\[score\]/g, $(".admin-alert-score", $(boxtop)).val());
            msg = msg.replace(/\[pointtype\]/g, $(".admin-alert-pointtype", $(boxtop)).val());
            if (withinphrase) {
                msg = msg.replace(/\[withinphrase\]/g, "within " + $(".admin-alert-number", $(boxtop)).val() + " " + singularize($(".admin-alert-interval", $(boxtop)).val(), parseInt($(".admin-alert-number", $(boxtop)).val())));
            }
            else {
                msg = msg.replace(/\[withinphrase\]/g, "");
            }
            //alert(msg);
            var bld = '<p style="text-align: center;display:block;font-weight: bold;margin-bottom:50px;">Alert Preview</p><p><b>From:</b> Acuity<br /><br /><b>To:</b> ';

            var textarea = $(" textarea", $(this).parent().parent());
            var firstbox = $(textarea).parent().hasClass("admin-alert-messagediv-agent");
            /*
            if ($(textarea).parent().hasClass("admin-alert-messagediv-agent")) { 
            bld += 'Agent';
            }
            else {
            bld += 'Supervisor';
            }*/
            switch ($(".admin-alert-notify").first().val()) {
                case "Agent and Supervisor":
                    if (firstbox) {
                        bld += "Agent";
                    }
                    else {
                        bld += "Supervisor";
                    }
                    break;
                case "Team Leader and Group Leader":
                    if (firstbox) {
                        bld += "Team Leader";
                    }
                    else {
                        bld += "Group Leader";
                    }
                    break;
                case "none":
                    bld += "All CC'd Managers";
                    break;
                default:
                    bld += $(".admin-alert-notify").first().val();
            }

            bld += '<br /><br /><b>Subject:</b> System Alert Received - ' + plabel + ":" + ad.model[o.m].project[o.p].desc + '<br /><br />';
            bld += msg;
            bld += '</p>';
            bld += '<a href="#">close</a>';

            $(".message-preview").remove();
            $("body").append('<div class="message-preview">' + bld + '</div>');
            $(".message-preview").each(function () {
                $(this).css("left", (($(window).width() - $(this).width()) / 2) + "px");
            });
            $(".message-preview a").unbind().bind("click", function () {
                $(this).parent().remove();
                return false;
            });

        });

        $(".admin-messagebox-resetpositive").unbind().bind("click", function () {
            var textarea = $(" textarea", $(this).parent().parent());
            if ($(textarea).parent().hasClass("admin-alert-messagediv-agent")) {
                $(textarea).html(posagentmsg);
            }
            else {
                $(textarea).html(possupmsg);
            }
        });
        $(".admin-messagebox-resetnegative").unbind().bind("click", function () {
            var textarea = $(" textarea", $(this).parent().parent());
            if ($(textarea).parent().hasClass("admin-alert-messagediv-agent")) {
                $(textarea).html(negagentmsg);
            }
            else {
                $(textarea).html(negsupmsg);
            }
        });
        $(".admin-alert-button-add").unbind().bind("click", function () {
            var m, p, k, s;
            var pss = $(" span", $(this).parent()).html().split(',');
            switch (pss[0]) {
                case "project":
                    m = parseInt(pss[1]);
                    p = parseInt(pss[2]);
                    break;
                case "kpi":
                    m = parseInt(pss[1]);
                    p = parseInt(pss[2]);
                    k = parseInt(pss[3]);
                    break;
                case "subkpi":
                    m = parseInt(pss[1]);
                    p = parseInt(pss[2]);
                    k = parseInt(pss[3]);
                    s = parseInt(pss[4]);
                    break;
                default:
                    alert("Error: unhandled add");
            }

            var a = {};
            var boxtop = $(this).parent().parent().parent().parent();
            a.id = o.alert.id;

            a.kpi = o.kpiname; //TODO: This is unsafe.
            a.scoretype = $(".admin-alert-scoretype", $(boxtop)).val();
            a.changetype = $(".admin-alert-changetype", $(boxtop)).val();
            a.scope = $(".admin-alert-scope", $(boxtop)).val();
            a.score = $(".admin-alert-score", $(boxtop)).val();
            a.pointtype = $(".admin-alert-pointtype", $(boxtop)).val();
            a.number = $(".admin-alert-number", $(boxtop)).val();
            a.interval = $(".admin-alert-interval", $(boxtop)).val();
            a.notify = $(".admin-alert-notify", $(boxtop)).val();
            a.agentmessage = $(".admin-alert-agentmessage").html();
            a.supmessage = $(".admin-alert-supmessage").html();
            a.constraint = {};
            a.constraint.type = $(".admin-alert-constraint option:selected").html();
            if (a.constraint.type == "Project") {
                a.constraint.id = 0;
            }
            else {
                a.constraint.name = a.constraint.type;
                var sp = $(".admin-alert-constraint").val();
                var spl = sp.split("/");
                a.constraint.type = spl[0];
                a.constraint.id = parseInt(spl[1]);
            }
            a.cconly = $('.admin-alert-cconly input:checked').length > 0 ? "Y" : "N";
            a.ccmanagers = "";
            var first = true;
            $("#ccmanagers option:selected").each(function () {
                if (!first) a.ccmanagers += ",";
                first = false;
                a.ccmanagers += $(this).val();
            });
            a.ccemails = $("#ccemails").val();
            if (cph) {
                a.cph = {};
                a.cph.percent = $(".admin-alert-cph-percent", $(boxtop)).val();
                a.cph.mark = $(".admin-alert-cph-mark", $(boxtop)).val();
                a.cph.splits = "";
                a.enhanced = true;
                var first = true;
                $("#cphsplits option:selected").each(function () {
                    if (!first) a.cph.splits += ",";
                    first = false;
                    a.cph.splits += $(this).val();
                });
            }

            switch (pss[0]) {
                case "project":
                    //DONE: Save the alert
                    var databld = { lib: "admin", cmd: "updatealert", update: "project", projectid: ad.model[m].project[p].id, alert: a };
                    a$.showprogress("projectadminprogress", "Saving...");
                    a$.ajax({
                        type: "POST", service: "JScript", async: true, data: databld, dataType: "json", cache: false, error: a$.ajaxerror,
                        success: savedprojectalert
                    });
                    function savedprojectalert(json) {
                        a$.hideprogress("projectadminprogress");
                        if (a$.jsonerror(json)) {
                            $("#projectadminarea").append(json.msg);
                        }
                        else {
                            if (exists(o.aindex)) {
                                ad.model[m].project[p].alert[o.aindex] = a;
                            }
                            else {
                                if (!exists(ad.model[m].project[p].alert)) ad.model[m].project[p].alert = [];
                                a.id = json.alertid;
                                ad.model[m].project[p].alert.push(a);
                            }
                            buildmodelarea(m);
                            buildprojectarea(m, p);
                        }
                    }
                    break;
                case "kpi":
                    var databld = { lib: "admin", cmd: "updatealert", update: "kpi", projectid: ad.model[m].project[p].id, kpiid: ad.model[m].project[p].kpi[k].id, alert: a };
                    a$.showprogress("projectadminprogress", "Saving...");
                    a$.ajax({
                        type: "POST", service: "JScript", async: true, data: databld, dataType: "json", cache: false, error: a$.ajaxerror,
                        success: savedkpialert
                    });
                    function savedkpialert(json) {
                        a$.hideprogress("projectadminprogress");
                        if (a$.jsonerror(json)) {
                            $("#kpiadminarea").append(json.msg);
                        }
                        else {
                            if (exists(o.aindex)) {
                                ad.model[m].project[p].kpi[k].alert[o.aindex] = a;
                            }
                            else {
                                if (!exists(ad.model[m].project[p].kpi[k].alert)) ad.model[m].project[p].kpi[k].alert = [];
                                a.id = json.alertid;
                                ad.model[m].project[p].kpi[k].alert.push(a);
                            }
                            buildkpiarea(m, p, k);
                        }
                    }
                    break;
                case "subkpi":
                    var databld = { lib: "admin", cmd: "updatealert", update: "subkpi", projectid: ad.model[m].project[p].id, kpiid: ad.model[m].project[p].kpi[k].id, subkpiid: ad.model[m].project[p].kpi[k].subkpi[s].id, alert: a };
                    a$.showprogress("projectadminprogress", "Saving...");
                    a$.ajax({
                        type: "POST", service: "JScript", async: true, data: databld, dataType: "json", cache: false, error: a$.ajaxerror,
                        success: savedsubkpialert
                    });
                    function savedsubkpialert(json) {
                        a$.hideprogress("projectadminprogress");
                        if (a$.jsonerror(json)) {
                            $("#subkpiadminarea").append(json.msg);
                        }
                        else {
                            if (exists(o.aindex)) {
                                ad.model[m].project[p].kpi[k].subkpi[s].alert[o.aindex] = a;
                            }
                            else {
                                if (!exists(ad.model[m].project[p].kpi[k].subkpi[s].alert)) ad.model[m].project[p].kpi[k].subkpi[s].alert = [];
                                a.id = json.alertid;
                                ad.model[m].project[p].kpi[k].subkpi[s].alert.push(a);
                            }
                            buildsubkpiarea(m, p, k, s);
                        }
                    }
                    break;
                default:
            }
        });
        $(".admin-alert-button-cancel").unbind().bind("click", function () {
            $(".admin-alertblock").remove();
        });
    }

    function upstreamid(me) {
        var par = me;
        while (true) {
            par = $(par).parent();
            if (exists($(par).attr("id"))) return $(par).attr("id");
        }
    }

    function buildkpiarea(m, p, k, s) {
        clearfrm("kpi");
        //alert("debug: building kpi area: " + m + " " + p + " " + k + " " + s);
        if (ad.model[m].id > 3) {
            $("#kpiadminarea").html("<div>This model is in development, KPIs can't be added here yet.</div>");
        }
        else {
            if (!exists(k)) {
                var found = false;
                for (var i in ad.model[m].project[p].kpi) {
                    if (ad.model[m].project[p].kpi[i].id == "NEW") {
                        k = i;
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    ad.model[m].project[p].kpi.push({ id: 'NEW', desc: '', status: 'A', adding: true, scores: [], weight: 0.0 });
                    k = ad.model[m].project[p].kpi.length - 1;
                }
                curkpi = 0;
                cursubkpi = 0;
            }
            else {
                curkpi = ad.model[m].project[p].kpi[k].id;
                cursubkpi = 0;
            }

            var bld = "";
            var label = "";
            if (!ad.model[m].project[p].kpi[k].adding) label = ad.model[m].project[p].kpi[k].desc;

            bld += '<div class="admin-kpi-desc"><label>KPI:</label>';
            bld += editspan2({ frm: "kpi", ref: ad.model[m].project[p].kpi[k], member: "desc", /*value: ad.model[m].project[p].kpi[k].desc, */classes: "admin-kpi", adding: ad.model[m].project[p].kpi[k].adding });
            bld += '</div>';
            bld += '<div class="admin-kpi-project"><label>' + plabel + ':</label><span>' + ad.model[m].project[p].desc + '</span></div>';
            bld += '<div class="admin-kpi-weight"><label>Weight:</label>';
            if (ad.model[m].project[p].kpi[k].id != "NEW") {
                if (ad.model[m].project[p].kpi[k].subkpi.length == 0) {
                    bld += '<div class="admin-kpi-subkpiconvert">Convert to SubKPI</div>';
                }
            }
            bld += editspan2({ frm: "kpi", ref: ad.model[m].project[p].kpi[k], member: "weight", /*value: ad.model[m].project[p].kpi[k].weight, */classes: "admin-kpi", adding: ad.model[m].project[p].kpi[k].adding });
            bld += '&nbsp;&nbsp;&nbsp;<label>Required:</label>';
            bld += editspan2({ frm: "kpi", ref: ad.model[m].project[p].kpi[k], member: "required", /*value: ad.model[m].project[p].kpi[k].required, */classes: "admin-kpi", adding: ad.model[m].project[p].kpi[k].adding });

            bld += '</div>';

            if (ad.model[m].id == 2) {
                if (label == "Team Performance") {
                    if (!exists(ad.model[m].project[p].kpi[k].aux)) {
                        ad.model[m].project[p].kpi[k].aux = [];
                    }
                    for (var im in ad.model) {
                        if (ad.model[im].id == 1) {
                            for (var ip in ad.model[im].project) {
                                if (ad.model[im].project[ip].desc == ad.model[m].project[p].desc) {
                                    bld += '<div class="admin-kpilist admin-supweightlist"><h1>WEIGHT MAPPING:</h1><table><thead><tr><td>CSR KPI (';
                                    bld += ad.model[im].project[ip].desc + ')';
                                    bld += '</td><td>CSR Weight</td><td>Supervisor Weight</td></tr></thead><tbody>';
                                    for (var ik in ad.model[im].project[ip].kpi) {
                                        bld += "<tr><td>" + ad.model[im].project[ip].kpi[ik].desc + "</td><td>" + ad.model[im].project[ip].kpi[ik].weight + '</td><td>';
                                        var foundidx = -1;
                                        for (var i in ad.model[m].project[p].kpi[k].aux) {
                                            if (ad.model[m].project[p].kpi[k].aux[i].key == ad.model[im].project[ip].kpi[ik].desc) {
                                                foundidx = i;
                                                break;
                                            }
                                        }
                                        if (foundidx < 0) {
                                            foundidx = ad.model[m].project[p].kpi[k].aux.length;
                                            ad.model[m].project[p].kpi[k].aux.push({ key: ad.model[im].project[ip].kpi[ik].desc, weight: 0.0 });
                                        }
                                        bld += editspan2({ frm: "kpi", ref: ad.model[m].project[p].kpi[k].aux[foundidx], member: "weight", classes: "admin-kpi", adding: ad.model[m].project[p].kpi[k].adding });
                                        //<input type="text" value="' + ad.model[im].project[ip].kpi[ik].weight + '"/><span style="display:none;">' + ad.model[im].project[ip].kpi[ik].weight + '</span>'
                                        bld += '</td></tr>';
                                    }
                                    bld += "</table></div>";
                                }
                            }
                        }
                    }
                    bld += '<div class="admin-evaltype"><label>Evaluation Type:</label><select id="admineval"><option value="OneToOne">Map Weighted CSR Scores DIRECTLY to Supervisor Score</option><option value="RangeTable">Pass Weighted CSR Scores through Range Table</option></select></div>';
                }
                else if ((label == "Tool Utilization") || (label == "Attrition")) {
                    if (!exists(ad.model[m].project[p].kpi[k].aux)) {
                        for (var b in ad.model[m].bestpractices.kpi) {
                            if (ad.model[m].bestpractices.kpi[b].desc == label) {
                                ad.model[m].project[p].kpi[k].aux = {};
                                $.extend(true, ad.model[m].project[p].kpi[k].aux, ad.model[m].bestpractices.kpi[b].aux);
                            }
                        }
                    }
                    switch (label) {
                        case "Tool Utilization":
                            bld += '<div class="admin-kpilist admin-toolweightlist"><h1>Components:</h1><table><thead><tr><td>Description</td><td>Notes</td><td>Weight</td><td>Goal</td></tr>';
                            for (var i in ad.model[m].project[p].kpi[k].aux) {
                                bld += "<tr><td>" + ad.model[m].project[p].kpi[k].aux[i].desc + "</td><td>" + ad.model[m].project[p].kpi[k].aux[i].tip + "</td><td>";
                                bld += editspan2({ frm: "kpi", ref: ad.model[m].project[p].kpi[k].aux[i], member: "weight", /*value: ad.model[m].project[p].kpi[k].aux[i].weight,*/classes: "admin-kpi", adding: ad.model[m].project[p].kpi[k].adding });
                                bld += '</td><td>';
                                if (exists(ad.model[m].project[p].kpi[k].aux[i].goal)) {
                                    bld += editspan2({ frm: "kpi", ref: ad.model[m].project[p].kpi[k].aux[i], member: "goal", /*value: ad.model[m].project[p].kpi[k].aux[i].goal,*/classes: "admin-kpi", adding: ad.model[m].project[p].kpi[k].adding });
                                }
                                bld += '</tr>';
                            }
                            bld += "</table></div>";
                            bld += '<div class="admin-evaltype"><label>Final score calculated as a <b>GRADE PERCENTAGE</b>, to be scored through the following range table:</label></div>';
                            break;
                        case "Attrition":
                            bld += '<div class="admin-kpilist admin-toolweightlist"><h1>Components:</h1><table><thead><tr><td>Event</td><td>Disposition</td><td>Points</td></tr>';
                            for (var i in ad.model[m].project[p].kpi[k].aux) {
                                bld += "<tr><td>" + ad.model[m].project[p].kpi[k].aux[i].evt + "</td><td>" + ad.model[m].project[p].kpi[k].aux[i].disposition + "</td><td>";
                                bld += editspan2({ frm: "kpi", ref: ad.model[m].project[p].kpi[k].aux[i], member: "points", /*value: ad.model[m].project[p].kpi[k].aux[i].weight,*/classes: "admin-kpi", adding: ad.model[m].project[p].kpi[k].adding });
                                bld += '</td>';
                                bld += '</tr>';
                            }
                            bld += "</table></div>";
                            bld += '<div class="admin-evaltype"><label>Final score calculated as a POINT TOTAL, to be scored through the following range table:</label></div>';
                            break;
                        default:
                    }
                }
            }

            bld += '<div class="admin-scoregadget">';
            $("#scoregadget").remove();
            bld += '<div id="scoregadget">';

            curscoresparent = ad.model[m].project[p].kpi[k];
            if (!exists(curscoresparent.holdscores)) {
                ad.model[m].project[p].kpi[k].holdscores = [];
            }
            holdscores = curscoresparent.holdscores
            curscoresparent = ad.model[m].project[p].kpi[k];
            curscores = curscoresparent.scores;
            for (var i in curscores) {
                holdscores[i] = $.extend(true, [], curscores[i]);
            }
            bld += buildscoregadget(ad.model[m].project[p].kpi[k].scores);
            gadgetpage = "kpi";
            bld += '</div>';
            bld += '</div>';

            bld += '<div class="admin-kpi-savecancel"><span class="admin-crumb">kpi,' + m + ',' + p + ',' + k + '</span><input type="button" class="admin-kpi-save" value="Save" /><input type="button" class="admin-kpi-cancel" value="Cancel" /></div>';

            if (exists(ad.model[m].project[p].kpi[k].subkpi)) {
                if ((ad.model[m].project[p].kpi[k].subkpi.length > 0) && (ad.model[m].project[p].kpi[k].id != "NEW")) {
                    var totweight = 0.0;
                    bld += '<div class="admin-kpilist"><h1>SubKPIs for this KPI:</h1><table><thead><tr><td>Name</td></tr></thead><tbody>';
                    for (var i in ad.model[m].project[p].kpi[k].subkpi) {
                        bld += '<tr><td>' + ad.model[m].project[p].kpi[k].subkpi[i].desc + '</td>'
                        bld += '<td><span class="admin-link admin-subkpi-edit"><span class="admin-crumb">' + ad.model[m].project[p].kpi[k].subkpi[i].id + '</span>edit</span></td>';
                        bld += '</tr>';
                    }
                    bld += '</tbody><tfoot><tr><td></td><td></td></tr></tfoot>';
                    bld += '</table></div>';
                }
            }


            $("#kpiadminarea").html(bld);

            if ((ad.model[m].id == 2) && (label == "Team Performance")) {
                $(".admin-scoregadget").hide();
                $("#admineval").unbind("change").bind("change", function () {
                    if ($(this).val() == "OneToOne") {
                        $(".admin-scoregadget").hide();
                    }
                    else {
                        $(".admin-scoregadget").show();
                    }
                });
            }


            $(".admin-subkpi-edit").unbind().bind("click", function () {
                var id = parseInt($(".admin-crumb", this).html());
                editsubkpi(id);
            });

            var hasraw = true;
            if (!exists(ad.model[m].project[p].kpi[k].scores)) hasraw = false;
            if ((a$.urlprefix() == "ces.") || (a$.urlprefix() == "dev.") || (a$.urlprefix() == "bgr.")) {
                if (ad.model[m].project[p].kpi[k].desc == "Attendance") {
                    $("#kpiadminarea").append('<div class="AT-Admin-Placeholder"></div>');
                    appApmScoreEditing.AttendanceTrackerCategoriesWidget(".AT-Admin-Placeholder", $("#AdminEditing select").val());
                }
            }

            setalertbindings("kpi", "kpiadminarea", ad.model[m].project[p].kpi[k].desc, hasraw, true, m, p, k);

            $(".admin-kpi input").unbind().bind("keyup", function () {
                var dirty = false;
                $(".admin-kpi input").each(function () {
                    if ($(" span", $(this).parent()).html() != $(this).val()) dirty = true;
                });
                if ((gadgetpage == "kpi") && (dirtygadget)) dirty = true;
                if (exists(curscores)) {
                    if (curscores.length == 0) dirty = true;
                }
                if (dirty) $(".admin-kpi-savecancel").show();
                else $(".admin-kpi-savecancel").hide();
            });
            $(".admin-kpi-subkpiconvert").unbind().bind("click", function () {
                if (confirm("Convert to SubKPI - If you convert to a SubKPI, all range data will come from the SubKPIs and the ranges stored with the KPI become meaningless.  Are you sure you want to do this?")) {
                    buildmodelarea(m);
                    buildprojectarea(m, p);
                    buildkpiarea(m, p, k);
                    buildsubkpiarea(m, p, k);
                    $('#projectadminlabel').show();
                    $('#kpiadminlabel').show();
                    $('#subkpiadminlabel').show().trigger('click');
                }
            });

            activatescoregadget(label, ad.model[m].project[p].kpi[k].id);
            dirtygadget = false;
            showgadgetgraph();
            bindspecialeditevents();

            if (ad.model[m].project[p].kpi[k].id == "NEW") $(".admin-kpi-savecancel").show();
            else $(".admin-kpi-savecancel").hide();

            bindsavecancel("kpi");
            setediting($("#AdminEditing select").val());
        }
    }

    function buildsubkpiarea(m, p, k, s) {
        clearfrm("subkpi");
        var bld = "";
        if (!exists(s)) {
            var found = false;
            for (var i in ad.model[m].project[p].kpi[k].subkpi) {
                if (ad.model[m].project[p].kpi[k].subkpi[i].id == "NEW") {
                    s = i;
                    found = true;
                    break;
                }
            }
            if (!found) {
                ad.model[m].project[p].kpi[k].subkpi.push({ id: 'NEW', desc: '', status: 'A', adding: true, scores: [] });
                s = ad.model[m].project[p].kpi[k].subkpi.length - 1;
            }
            curkpi = 0;
            cursubkpi = 0;
        }
        else {
            curkpi = 0;
            cursubkpi = ad.model[m].project[p].kpi[k].subkpi[s].id;
        }
        bld += '<div class="admin-subkpi-desc"><label>SubKPI:</label>';
        bld += editspan({ value: ad.model[m].project[p].kpi[k].subkpi[s].desc, classes: "admin-subkpi", adding: ad.model[m].project[p].kpi[k].subkpi[s].adding });
        bld += '</div>';
        bld += '<div class="admin-subkpi-project"><label>' + plabel + ':</label><span>' + ad.model[m].project[p].desc + '</span></div>';
        bld += '<div class="admin-subkpi-kpi"><label>KPI:</label><span>' + ad.model[m].project[p].kpi[k].desc + '</span></div>';
        var label = "";
        if (!ad.model[m].project[p].kpi[k].subkpi[s].adding) {
            label = ad.model[m].project[p].kpi[k].desc + " (" + ad.model[m].project[p].kpi[k].subkpi[s].desc + ")";
        }
        bld += '<div class="admin-scoregadget">';
        $("#scoregadget").remove();
        bld += '<div id="scoregadget">';
        curscoresparent = ad.model[m].project[p].kpi[k].subkpi[s];
        if (!exists(curscoresparent.holdscores)) {
            ad.model[m].project[p].kpi[k].subkpi[s].holdscores = [];
        }
        holdscores = curscoresparent.holdscores
        curscoresparent = ad.model[m].project[p].kpi[k].subkpi[s];
        curscores = curscoresparent.scores;
        for (var i in curscores) {
            holdscores[i] = $.extend(true, [], curscores[i]);
        }
        bld += buildscoregadget(ad.model[m].project[p].kpi[k].subkpi[s].scores);
        gadgetpage = "subkpi";
        bld += '</div>';
        bld += '</div>';
        bld += '<div class="admin-subkpi-savecancel"><span class="admin-crumb">subkpi,' + m + ',' + p + ',' + k + ',' + s + '</span><input type="button" class="admin-subkpi-save" value="Save" /><input type="button" class="admin-subkpi-cancel" value="Cancel" /></div>';
        $("#subkpiadminarea").html(bld);

        setalertbindings("subkpi", "subkpiadminarea", ad.model[m].project[p].kpi[k].subkpi[s].desc, true, true, m, p, k, s);

        $(".admin-subkpi input").unbind().bind("keyup", function () {
            var dirty = false;
            $(".admin-subkpi input").each(function () {
                if ($(" span", $(this).parent()).html() != $(this).val()) dirty = true;
            });
            if ((gadgetpage == "subkpi") && (dirtygadget)) dirty = true;
            if (curscores.length == 0) dirty = true;
            if (dirty) $(".admin-subkpi-savecancel").show();
            else $(".admin-subkpi-savecancel").hide();
        });

        activatescoregadget(label, ad.model[m].project[p].kpi[k].subkpi[s].id);
        dirtygadget = false;
        showgadgetgraph();
        bindspecialeditevents();

        if (ad.model[m].project[p].kpi[k].subkpi[s].id == "NEW") $(".admin-subkpi-savecancel").show();
        else $(".admin-subkpi-savecancel").hide();
        bindsavecancel("subkpi");
        setediting($("#AdminEditing select").val());
    }

    function setediting(stg) {
        if (stg == "On") {
            if ((a$.urlprefix() == "ces.") || (a$.urlprefix() == "dev.")) {
                if ($(".admin-kpi").first().html() == "Attendance") {
                    appApmScoreEditing.AttendanceTrackerCategoriesWidget(".AT-Admin-Placeholder", $(this).val());
                }
            }
            showgadgetgraph();
        }
        else {
            if ((a$.urlprefix() == "ces.") || (a$.urlprefix() == "dev.")) {
                if ($(".admin-kpi input").first().val() == "Attendance") {
                    appApmScoreEditing.AttendanceTrackerCategoriesWidget(".AT-Admin-Placeholder", $(this).val());
                }
            }
            restoregadgetgraph();
        }
    }

    function bindspecialeditevents() {
        $("#AdminEditing select").unbind("change");
        $("#AdminEditing select").bind("change", function () {
            setediting($(this).val())
        });
    }

    function buildscoregadget(scrs) {
        if (!scrs) return "Select SubKPI to change score ranges.";

        //Order the scores from low to high (bubble is good enough).
        var cnt = 0;
        for (var i = 0; i < scrs.length - 1; i++) {
            for (var j = i + 1; j < scrs.length; j++) {
                if (scrs[i].range[0] > scrs[j].range[0]) {
                    var sh = scrs[j].score;
                    var sr0 = scrs[j].range[0];
                    var sr1 = scrs[j].range[1];
                    scrs[j].score = scrs[i].score;
                    scrs[j].range[0] = scrs[i].range[0];
                    scrs[j].range[1] = scrs[i].range[1];
                    scrs[i].score = sh;
                    scrs[i].range[0] = sr0;
                    scrs[i].range[1] = sr1;
                }
            }
        }
        //Check for gaps and overlaps.
        var biggap = 0.00011;
        var lilgap = 0.00000000011;
        var dif1 = 0.0;
        var dif2 = 0.0;
        for (var i = 0; i < scrs.length; i++) {
            scrs[i].error = "";
        }
        var iserror = false;
        for (var i = 0; i < scrs.length - 1; i++) {
            var j = i + 1;
            dif1 = Math.abs(scrs[i].range[0] - scrs[j].range[1]);
            if (cnt < 3) {
                //                alert("debug:dif1=" + dif1);
                //                alert("debug:dif2=" + dif2);
                cnt++;
            }
            dif2 = Math.abs(scrs[i].range[1] - scrs[j].range[0]);
            if ((dif1 > biggap) && (dif1 > lilgap) && (dif2 > biggap) && (dif2 > lilgap)) {
                scrs[i].error += "Gap between ranges > 0.0001.  ";
                //alert("debug: gap between " + scrs[i].score + " and " + scrs[j].score + " gaps: " + dif1 + "," + dif2);
                iserror = true;
            }
            if (scrs[i].range[0] == scrs[i].range[1]) {
                scrs[i].error += "Low and High range are equal";
                iserror = true;
            }
        }

        var bld = "";

        if (scrs) { //ad.model[m].project[p].kpi[k].scores
            var tblhead = '<thead><tr><th class="rangetable-blank"><th>';
            if (iserror) tblhead += '<span class="rangetable-error">';
            tblhead += "Score";
            if (iserror) tblhead += '</span>';
            tblhead += '</th><th>Low</th><th>High</th>';
            tblhead += '</tr></thead>';
            var tblbody = "<tbody>";
            var ctog = 0;
            for (var i = 0; i < scrs.length; i++) {
                var scr = scrs[i];
                if (i > 0) {
                    if (scrs[i - 1].score != scr.score) {
                        ctog = (ctog == 0) ? 1 : 0;
                    }
                }
                var range = scr.range;
                tblbody += '<tr class="rangetable-row-' + ctog;
                if (scrs[i].error != "") tblbody += ' rangetable-error';
                tblbody += '"><td class="rangetable-delete"></td><td';
                tblbody += '>';
                //if (scrs[i].error!="") tblbody += '<span class="rangetable-error">';
                tblbody += scr.score;
                //if (scrs[i].error != "") tblbody += '</span>';
                tblbody += "</td><td>" + range[0] + "</td><td>" + range[1] + "</td>";
                tblbody += "</tr>";
            }
            tblbody += "</tbody>"
            var tblfoot = '<thead><tr><th class="rangetable-add"></th><th><input class="rangetable-input-add" type="text" /></th><th><input class="rangetable-input-add" type="text" /></th><th><input class="rangetable-input-add" type="text" /></th></tr></thead>';


            bld += '<div class="ranges-wrapper-4">';
            bld += '<div class="ranges-wrapper-3">';
            bld += '  <div class="ranges-clone-link" style="display:none;"><p>Load<br />Ranges</p></div>';
            bld += '  <div class="ranges-clone"><p><b>To copy scores from another KPI/Subkpi</b>,<br />click on any KPI/Subkpi<br />from the tree on the left<br/>highlighted in <span class="clonable">blue</span>.</p></div>'; //
            bld += '  <div class="ranges-chart"><div id="kpichart"></div></div>';
            bld += '  <div class="ranges-wrapper-2">';
            bld += '    <div class="ranges-wrapper">';
            bld += '      <div class="ranges-header"><table class="rangetable-header">' + tblhead + "</table></div>";
            bld += '      <div class="ranges-body"><table class="rangetable-body">' + tblbody + "</table></div>";
            bld += '      <div class="ranges-footer"><table class="rangetable-footer">' + tblfoot + "</table></div>";
            bld += '    </div>';
            bld += '    <div class="rangetable-footbar">';
            if (iserror) bld += '<span class="rangetable-error">&nbsp;*&nbsp;Errors Found</span>';
            bld += '    </div>';
            bld += '  </div>';
            bld += '  <div class="bell-placeholder"></div>';
            bld += '</div>';
            bld += '</div>';
            bld += '<div style="clear:left;">&nbsp;</div>'; //need to clear left here.

        }
        return bld;
    }

    function showgadgetgraph() {
        $(".rangetable-blank,.rangetable-add,.rangetable-delete,.ranges-footer").show();
        if (!isediting()) {
            $(".ranges-footer,.rangetable-delete").hide();
        }
        $(".ranges-body td").css("cursor", "pointer");
        $(".ranges-footer th").unbind().bind("click", function () {
            if ($(this).index() == 0) { //add
                var one = 0;
                $(" input", $(this).parent()).each(function () {
                    if ($.isNumeric($(this).val())) {
                        $(this).css("border", "");
                    }
                    else {
                        if (!one) {
                            alert("Values must be numeric.");
                            $(this).focus();
                            one = true;
                        }
                        $(this).css("border", "2px solid red");
                    }
                });
                if (!one) {
                    var ns = {};
                    ns.score = parseFloat($(":nth-child(2) input", $(this).parent()).val());
                    ns.range = [];
                    ns.range[0] = parseFloat($(":nth-child(3) input", $(this).parent()).val());
                    ns.range[1] = parseFloat($(":nth-child(4) input", $(this).parent()).val());
                    $(" input", $(this).parent()).each(function () {
                        $(this).val("");
                    });
                    //Insert it into the table (doesn't matter where, it gets scraped and ordered in shapeandprepgadgetgraph
                    var tblbody = '<tr class="rangetable-row-add"><td class="rangetable-delete"></td><td>';
                    tblbody += ns.score;
                    tblbody += "</td><td>" + ns.range[0] + "</td><td>" + ns.range[1] + "</td>";
                    tblbody += "</tr>";
                    $(".rangetable-body tbody").append(tblbody);

                    dirtygadget = true;
                    shapeandprepgadgetgraph();
                    showgadgetgraph();
                }
            }
        });
        $(".ranges-body td").unbind().bind("click", function () {
            if (isediting()) {
                if ($(this).index() == 0) { //delete
                    $(this).parent().children().css("border", "5px solid red");
                    if (confirm("Are you sure you want to delete this score/range?")) {
                        $(this).parent().remove();
                        dirtygadget = true;
                        shapeandprepgadgetgraph();
                        showgadgetgraph();
                    }
                    else {
                        $(this).parent().children().css("border", "");
                    }
                }
                else {
                    if (!$(this).hasClass("rangetable-editing")) {
                        var val = $(this).html();
                        $(this).html('<input class="rangetable-input" type="text" value="' + val + '" />');
                        $(".rangetable-input").unbind().bind("blur", function () {
                            if (rangetableinputtest(this)) {
                                var val = $(this).val();
                                $(this).parent().html(val);
                                //Update the view
                                dirtygadget = true;
                                shapeandprepgadgetgraph();
                                showgadgetgraph();
                            }
                        });
                        clearediting();
                        $(this).addClass("rangetable-editing");
                    }
                }
            }
        });
    }

    function restoregadgetgraph() {
        if (!curscores) return;
        curscores.length = 0;
        for (var i in holdscores) {
            curscores[i] = $.extend(true, [], holdscores[i]);
        }
        var bld = buildscoregadget(curscores);
        $("#scoregadget").html("");
        $("#scoregadget").html(bld);
        activatescoregadget();
        dirtygadget = false;
        if ($("#AdminEditing select").val() == "On") {
            showgadgetgraph();
        }
    }

    /*I don't think this is used.
    function savesettings() {
    $(".rangetable-blank,.rangetable-add,.rangetable-delete,.ranges-footer").hide();
    $(".ranges-body td").css("cursor", "none");
    $(".ranges-body td").unbind("click");
    //DONE: SAVE THE CHANGES TO THE RANGE TABLE (probably don't need to show here).
    if (dirtygadget) {
    alert("debug:Not really saving changes...");
    dirtygadget = false;
    }
    else {
    shapeandprepgadgetgraph();
    }
    }
    */

    function clearediting() {
        $(".rangetable-editing").each(function () {
            var val = $(" input", this).val();
            //if (rangetableinputtest($(" input", this))) {
            $(this).html(val);
            $(this).removeClass("rangetable-editing");
            //}
        });
    }

    function setclonable() {

        //TODO: draggable ?  Can I make it work?  It would be so cool...
        /*
        $(".kpinode,.subkpinode").unbind("dblclick").bind("dblclick", function (event) {
        event.stopPropagation();
        alert("debug:cloning");
        });
        $(".heading,.kpinode,.subkpinode,.dragme").draggable({ revert: true, zIndex: 100, helper: 'clone' });
        */
        $(".companynode,.modelnode,.projectnode,.kpinode,.subkpinode").unbind();
        $(".kpinode,.subkpinode").addClass("clonable").bind("click", function (event) {
            event.stopPropagation();
            var pss = $(" span", $(this)).html().split(',');
            var md, pd, kd, sd = -1;

            var founddest = false;
            var foundexisting = false;
            $(".admin-kpi-cancel").each(function () {
                var pss = $(" span", $(this).parent()).html().split(',');
                var m = parseInt(pss[1]);
                var p = parseInt(pss[2]);
                var k = parseInt(pss[3]);
                if (ad.model[m].project[p].kpi[k].id == "NEW") {
                    md = m;
                    pd = p;
                    kd = k;
                    founddest = true;
                }
            });
            if (!founddest) {
                $(".admin-subkpi-cancel").each(function () {
                    var pss = $(" span", $(this).parent()).html().split(',');
                    var m = parseInt(pss[1]);
                    var p = parseInt(pss[2]);
                    var k = parseInt(pss[3]);
                    var s = parseInt(pss[4]);
                    if (ad.model[m].project[p].kpi[k].subkpi[s].id == "NEW") {
                        md = m;
                        pd = p;
                        kd = k;
                        sd = s;
                        founddest = true;
                    }
                });
            }
            if (!founddest) {
                //search for current.
                var me = $(".activenode:first").children().first();
                var id = parseInt($(me).html());
                if ($(me).parent().hasClass("kpinode")) {
                    var found = false;
                    for (var h in ad.model) {
                        md = h;
                        for (var i in ad.model[h].project) {
                            pd = i;
                            for (var i1 in ad.model[h].project[i].kpi) {
                                if (ad.model[h].project[i].kpi[i1].id == id) {
                                    kd = i1;
                                    found = true;
                                    founddest = true;
                                    foundexisting = true;
                                    break;
                                }
                            }
                            if (found) break;
                        }
                        if (found) break;
                    }
                }
                else {
                    var found = false;
                    for (var h in ad.model) {
                        md = h;
                        for (var i in ad.model[h].project) {
                            pd = i;
                            for (var i1 in ad.model[h].project[i].kpi) {
                                //if (ad.model[m].project[p].kpi[i1].id == id) {
                                for (var i2 in ad.model[h].project[i].kpi[i1].subkpi) {
                                    if (ad.model[h].project[i].kpi[i1].subkpi[i2].id == id) {
                                        kd = i1;
                                        sd = i2;
                                        found = true;
                                        founddest = true;
                                        foundexisting = true;
                                        break;
                                    }
                                }
                                if (found) break;
                            }
                            if (found) break;
                        }
                        if (found) break;
                    }
                }
            }
            var sscores = null;
            if ($(this).hasClass("kpinode")) {
                var id = parseInt($(this).children().first().html());
                var m, p, k;
                var foundsource = false;
                for (var h in ad.model) {
                    m = h;
                    for (var i in ad.model[m].project) {
                        p = i;
                        for (var i1 in ad.model[m].project[p].kpi) {
                            if (ad.model[m].project[p].kpi[i1].id == id) {
                                k = i1;
                                foundsource = true;
                                sscores = ad.model[m].project[p].kpi[k].scores;
                                break;
                            }
                        }
                        if (foundsource) break;
                    }
                    if (foundsource) break;
                }
            }
            else { //.subkpinode
                var id = parseInt($(this).children().first().html());
                var m, p, k, s;
                var foundsource = false;
                for (var h in ad.model) {
                    m = h;
                    for (var i in ad.model[m].project) {
                        p = i;
                        for (var i1 in ad.model[m].project[p].kpi) {
                            //if (ad.model[m].project[p].kpi[i1].id == id) {
                            for (var i2 in ad.model[m].project[p].kpi[i1].subkpi) {
                                if (ad.model[m].project[p].kpi[i1].subkpi[i2].id == id) {
                                    foundsource = true;
                                    k = i1;
                                    s = i2;
                                    sscores = ad.model[m].project[p].kpi[k].subkpi[s].scores;
                                    break;
                                }
                            }
                            if (foundsource) break;
                        }
                        if (foundsource) break;
                    }
                    if (foundsource) break;
                }
            }
            if ((founddest) && (sscores != null)) {
                if (sd < 0) {
                    ad.model[md].project[pd].kpi[kd].scores.length = 0;
                    for (var s in sscores) ad.model[md].project[pd].kpi[kd].scores.push(sscores[s]);
                    //buildkpiarea(pd, kd);
                    if (foundexisting) {
                        dirtygadget = true;
                        buildkpiarea(md, pd, kd);
                        $(".admin-kpi-savecancel").show();
                    }
                    else {
                        buildkpiarea(md, pd); //Will handle the "NEW" situation correctly.
                    }
                }
                else {
                    ad.model[md].project[pd].kpi[kd].subkpi[sd].scores.length = 0;
                    for (var s in sscores) ad.model[md].project[pd].kpi[kd].subkpi[sd].scores.push(sscores[s]);
                    //buildsubkpiarea(pd, kd, sd);
                    if (foundexisting) {
                        dirtygadget = true;
                        buildsubkpiarea(md, pd, kd, sd);
                        $(".admin-subkpi-savecancel").show();
                    }
                    else {
                        buildsubkpiarea(md, pd, kd);
                    }
                }
            }
        });
        //unbind kpis that have subkpis (they don't have clonable ranges)
        $(".kpinode").each(function () {
            var hassubkpi = false;
            $(" .subkpiadd", $(this).parent()).each(function () {
                hassubkpi = true;
            });
            if (hassubkpi) {
                $(this).removeClass("clonable").unbind();
            }
        });
        $(".modeladd,.projectadd,.kpiadd,.subkpiadd,.projectinactive").css("display", "none");
    }

    function activatescoregadget(label, idfornew) {
        if (!curscores) return;
        $(".rangetable-blank,.rangetable-add,.rangetable-delete").css("width", "25px").css("margin", "0").css("padding", "0").css("background-color", "white").hide();
        $(".ranges-footer").hide();
        $(".rangetable-add").css("width", "35px");
        $(".ranges-body").css("height", "350px");
        //window.chart = new Highcharts.Chart(rangeopts);

        var iserror = false;
        var isnew = false;
        if (exists(idfornew)) if (idfornew == "NEW") isnew = true;
        if (!isnew) {
            if ($(".clonable").length < 2) { //unsure why this is 1 when nothing is clonable, but it's okay.
                $(".ranges-clone").hide();
                $(".ranges-clone-link").show().unbind().bind("click", function () {
                    setclonable();
                    $(".ranges-clone-link").hide();
                    $(".ranges-clone").show();
                    dirtygadget = true;
                    $(".admin-kpi-savecancel,.admin-subkpi-savecancel").show(); //Clearly I've given up.
                });
            }
            if ($("#StgBell select").val() == "On") {
                $(".bell-placeholder:first").show().bellGraph({ kpi: curkpi, subkpi: cursubkpi });
            }
        }
        else {
            if ($("#StgBell select").val() == "On") {
                $(".bell-placeholder:first").hide();
            }
            $(".ranges-clone").show();
            $(".ranges-clone-link").hide();
            setclonable();

        }
        for (var i = 0; i < curscores.length; i++) {
            if (curscores[i].error != "") iserror = true;
            if (iserror) {
                $('.rangetable-error').qtip({ content: 'Range Errors Found<br />Check that there are no Gaps in values,<br />and that low range is &lt; high range.' });
            }
            /*
            if (iserror) {
            $(".ranges-wrapper").css("width", "auto");
            $(".ranges-header").css("width", "auto");
            }
            else {
            $(".ranges-wrapper").css("width", "");
            $(".ranges-header").css("width", "");
            }
            */
        }
        plotrangechart(curscores, iserror ? 1 : 2, label);
    }

    function shapeandprepgadgetgraph() {

        $(".admin-" + gadgetpage + "-savecancel").show();
        curscores.length = 0;
        $(".ranges-body tbody tr").each(function () {
            var lng = curscores.length;
            var val = $(":nth-child(2)", this).html();
            curscores[lng] = {};
            curscores[lng].score = parseInt(val);
            curscores[lng].range = [];
            val = $(":nth-child(3)", this).html();
            curscores[lng].range[0] = parseFloat(val);
            val = $(":nth-child(4)", this).html();
            curscores[lng].range[1] = parseFloat(val);
        });
        curscoresparent.scores_viewed = true;
        var bld = buildscoregadget(curscores);
        $("#scoregadget").html("");
        $("#scoregadget").html(bld);
        activatescoregadget();

    }

    function rangetableinputtest(me) {
        if ($.isNumeric($(me).val())) {
            $(me).removeClass("rangetable-editing");
            $(me).parent().css("border", "");
            return true;
        }
        else {
            alert("Values must be numeric.");
            $(me).parent().css("border", "2px solid red");
            $(me).focus();
            return false;
        }
    }

    function plotrangechart(scrs, charttype, label) {
        rangeopts.title.text = "Grading Curve";
        if (exists(label)) if (label != "") rangeopts.title.text += " - " + label;
        rangeopts.xAxis.categories.length = 0;
        rangeopts.series[0].data.length = 0;

        /*
        //score is x axis
        rangeopts.chart.type = 'columnrange';
        for (var i in scrs) {
        rangeopts.xAxis.categories.push(scrs[i].score);
        rangeopts.series[0].data[i] = [];
        rangeopts.series[0].data[i][0] = scrs[i].score;
        rangeopts.series[0].data[i][1] = scrs[i].score;
        }
        //For colrange:
        rangeopts.series[0].data[i] = [];
        rangeopts.series[0].data[i][0] = scrs[i].score;
        rangeopts.series[0].data[i][1] = scrs[i].score;
        */
        charttype = 2; //test
        var ln = scrs.length;
        if (ln < 3) charttype = 1;
        if (charttype == 1) {
            //Linear score order (pretty, but not as informative as first appears).
            rangeopts.chart.type = 'spline';
            for (var i in scrs) {
                rangeopts.xAxis.categories.push(scrs[i].range[0]);
                rangeopts.series[0].data.push({ y: scrs[i].score, name: "" + scrs[i].range[0] + " - " + scrs[i].range[1] });
                //For line or spline:
            }
        }
        else if (false) { //skip points not on average
            rangeopts.chart.type = 'spline';
            var low = 0.0;
            low = scrs[0].range[1] - (scrs[1].range[1] - scrs[1].range[0]);
            var high = 0.0;
            high = scrs[ln - 1].range[0] + (scrs[ln - 2].range[1] - scrs[ln - 2].range[0]);
            var step = (high - low) / 100.0;
            var p = low;
            for (var i in scrs) {
                scrs[i].average = 0.0;
                if (i == 0) scrs[i].average = low + ((scrs[i].range[1] - low) / 2.0);
                else if (i == (ln - 1)) scrs[i].average = scrs[i].range[0] + ((high - scrs[i].range[0]) / 2.0);
                else scrs[i].average = scrs[i].range[0] + ((scrs[i].range[1] - scrs[i].range[0]) / 2.0);
            }
            while (p <= high) {
                rangeopts.xAxis.categories.push(p);
                var ps = p + step;
                var found = false;
                for (var i in scrs) {
                    if ((scrs[i].average >= p) && (scrs[i].average < ps)) {
                        found = true;
                        rangeopts.series[0].data.push({ category: p, y: scrs[i].score, name: "" + scrs[i].range[0] + " - " + scrs[i].range[1] });
                        //break;
                    }
                }
                if (!found) {
                    rangeopts.series[0].data.push(null);
                }

                p = p + step;
            }
        }
        else { //skip points not on average
            rangeopts.chart.type = 'area';
            var low = 0.0;
            low = scrs[0].range[1] - (scrs[1].range[1] - scrs[1].range[0]);
            var high = 0.0;
            high = scrs[ln - 1].range[0] + (scrs[ln - 2].range[1] - scrs[ln - 2].range[0]);
            var step = (high - low) / 100.0;
            var p = low;
            while (p <= high) {
                rangeopts.xAxis.categories.push(p);
                var ps = p + step;
                var found = false;
                for (var i in scrs) {
                    if ((scrs[i].range[1] >= p) && (scrs[i].range[0] < ps)) {
                        found = true;
                        rangeopts.series[0].data.push({ category: p, y: scrs[i].score, name: "" + scrs[i].range[0] + " - " + scrs[i].range[1] });
                        //break;
                    }
                }
                if (!found) {
                    rangeopts.series[0].data.push(null);
                }

                p = p + step;
            }
        }

        appLib.generatechart(rangeopts);
    }

    function clearstate() {
        $(".companynode,.modelnode,.projectnode,.kpinode,.subkpinode").removeClass("activenode");
        //$('#companyadminlabel').hide();
        $('#modeladminlabel,#projectadminlabel,#kpiadminlabel,#subkpiadminlabel').hide();
        //$("*").qtip('enable');

    }

    function exists(me) {
        return (typeof me != 'undefined');
    }

    var rangeopts = {
        chart: {
            renderTo: 'kpichart',
            type: 'spline', //'columnrange',
            inverted: false
        },

        title: {
            text: 'Grading Scale'
        },


        xAxis: {
            type: 'datetime',
            categories: [],
            lineWidth: 0,
            minorGridLineWidth: 0,
            lineColor: 'transparent',
            labels: {
                enabled: false
            },
            minorTickLength: 0,
            tickLength: 0
        },

        yAxis: [{
            title: {
                text: 'Score'
            }
        }/* FIDDLE: */// ,{ title: { text: 'Secondary' } }
        ],

        tooltip: {
            formatter: function () {
                return this.series.name + ": " + this.y + '<br />Range:' + this.point.name;
            }
        },
        plotOptions: {
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        exporting: {
            enabled: false
        },
        series: [{
            name: 'Score',
            yAxis: 0,
            data: []
        }/* FIDDLE: */// ,{ name: 'Series2',yAxis: 1, data: [3,4,5,4] }
        ]
    };

    function isediting(o) {
        if (exists(o)) {
            if (exists(o.initstate)) {
                return o.initstate;
            }
            else if (exists(o.adding)) {
                return true;
            }
        }
        if ($("#StgEditing select").val() == "On") {
            return true;
        }
        return false;
    }

    function editspan(o) { //value, classes, override) {

        var bld = '<span class="edit-span ';
        if (o.classes) {
            bld += " " + o.classes
        }
        bld += '">';
        if (isediting(o)) {
            bld += '<input type="text" value="' + o.value + '"/><span style="display:none;">' + o.value + '</span>';
        }
        else {
            bld += o.value;
        }
        bld += '</span>';
        return bld;
    }


    function bindsavecancel(area) {
        $(".admin-" + area + "-cancel").unbind().bind("click", function () {
            var pss = $(" span", $(this).parent()).html().split(',');
            switch (pss[0]) {
                case "company":
                    buildcompanyarea();
                    break;
                case "project":
                    var m = parseInt(pss[1]);
                    var p = parseInt(pss[2]);
                    buildmodelarea(m);
                    buildprojectarea(m, p);
                    break;
                case "kpi":
                    var m = parseInt(pss[1]);
                    var p = parseInt(pss[2]);
                    var k = parseInt(pss[3]);
                    if (ad.model[m].project[p].kpi[k].id != 'NEW') {
                        restoregadgetgraph();
                    }
                    buildkpiarea(m, p, k);
                    $(".kpinode,.subkpinode").removeClass("clonable");
                    $(".modeladd,.projectadd,.kpiadd,.subkpiadd,.projectinactive").css("display", "");
                    bindprojecttree();
                    clearstate();
                    $('#companyadminlabel').show().trigger('click');
                    break;
                case "subkpi":
                    var m = parseInt(pss[1]);
                    var p = parseInt(pss[2]);
                    var k = parseInt(pss[3]);
                    var s = parseInt(pss[4]);
                    if (ad.model[m].project[p].kpi[k].subkpi[s].id != 'NEW') {
                        restoregadgetgraph();
                    }
                    buildsubkpiarea(m, p, k, s);
                    $(".kpinode,.subkpinode").removeClass("clonable");
                    $(".modeladd,.projectadd,.kpiadd,.subkpiadd,.projectinactive").css("display", "");
                    bindprojecttree();
                    clearstate();
                    $('#companyadminlabel').show().trigger('click');
                    break;
                default:
                    alert("Error: unhandled cancel");
            }
        });
        $(".admin-" + area + "-save").unbind().bind("click", function () {
            var pss = $(" span", $(this).parent()).html().split(',');
            switch (pss[0]) {
                case "company":
                    ad.organization.desc = $(".admin-org-desc input").val();
                    ad.organization.evaluatealerts = ($("#StgEvaluateAlerts select").val() == "On") ? "Y" : "N";
                    ad.organization.showalerts = ($("#StgShowAlerts select").val() == "On") ? "Y" : "N";
                    //alert("debug:ad.organization.showalerts=" + ad.organization.showalerts);
                    var databld = { lib: "admin", cmd: "updateadmin", update: "company", organization: ad.organization };
                    a$.showprogress("projectadminprogress", "Saving...");
                    a$.ajax({
                        type: "POST", service: "JScript", async: true, data: databld, dataType: "json", cache: false, error: a$.ajaxerror,
                        success: savedcompany
                    });
                    function savedcompany(json) {
                        a$.hideprogress("projectadminprogress");
                        if (a$.jsonerror(json)) {
                        }
                        else {
                            drawprojecttree();
                            buildcompanyarea();
                        }
                    }
                    break;
                case "project":
                    var m = parseInt(pss[1]);
                    var p = parseInt(pss[2]);
                    ad.model[m].project[p].desc = $(".admin-project-desc input").val();
                    ad.model[m].project[p].model_id = ad.model[m].id;
                    var databld = { lib: "admin", cmd: "updateadmin", update: "project", project: ad.model[m].project[p] };
                    a$.showprogress("projectadminprogress", "Saving...");
                    a$.ajax({
                        type: "POST", service: "JScript", async: true, data: databld, dataType: "json", cache: false, error: a$.ajaxerror,
                        success: savedproject
                    });
                    function savedproject(json) {
                        a$.hideprogress("projectadminprogress");
                        if (a$.jsonerror(json)) {
                            $("#projectadminarea").append(json.msg);
                        }
                        else {
                            //$(". node").addClass("activenode");
                            if (ad.model[m].project[p].id == "NEW") {
                                ad.model[m].project[p].id = json.projectid;
                                ad.model[m].project[p].kpi = [];
                            }
                            drawprojecttree(m, p);
                            buildmodelarea(m);
                            buildprojectarea(m, p);
                        }
                    }
                    break;
                case "kpi":
                    var m = parseInt(pss[1]);
                    var p = parseInt(pss[2]);
                    var k = parseInt(pss[3]);
                    /* editspan2 enabled:
                    ad.model[m].project[p].kpi[k].desc = $(".admin-kpi-desc input").val();
                    ad.model[m].project[p].kpi[k].weight = $(".admin-kpi-weight input").val();
                    */
                    reffrm("kpi");
                    clearfrm("kpi");

                    var khold = {};
                    $.extend(khold, ad.model[m].project[p].kpi[k]);
                    khold.subkpi = null;
                    var databld = { lib: "admin", cmd: "updateadmin", update: "kpi", projectid: ad.model[m].project[p].id, kpi: khold };
                    a$.showprogress("projectadminprogress", "Saving...");
                    a$.ajax({
                        type: "POST", service: "JScript", async: true, data: databld, dataType: "json", cache: false, error: a$.ajaxerror,
                        success: savedkpi
                    });
                    function savedkpi(json) {
                        a$.hideprogress("projectadminprogress");
                        if (a$.jsonerror(json)) {
                            $("#kpiadminarea").append(json.msg);
                        }
                        else {
                            //$(". node").addClass("activenode");
                            if (ad.model[m].project[p].kpi[k].id == "NEW") {
                                ad.model[m].project[p].kpi[k].id = json.kpiid;
                                ad.model[m].project[p].kpi[k].subkpi = [];
                            }
                            drawprojecttree(m, p, k);
                            buildkpiarea(m, p, k);
                        }
                    }
                    break;
                case "subkpi":
                    var m = parseInt(pss[1]);
                    var p = parseInt(pss[2]);
                    var k = parseInt(pss[3]);
                    var s = parseInt(pss[4]);
                    ad.model[m].project[p].kpi[k].subkpi[s].desc = $(".admin-subkpi-desc input").val();
                    var databld = { lib: "admin", cmd: "updateadmin", update: "subkpi", projectid: ad.model[m].project[p].id, kpiid: ad.model[m].project[p].kpi[k].id, subkpi: ad.model[m].project[p].kpi[k].subkpi[s] };
                    a$.showprogress("projectadminprogress", "Saving...");
                    a$.ajax({
                        type: "POST", service: "JScript", async: true, data: databld, dataType: "json", cache: false, error: a$.ajaxerror,
                        success: savedsubkpi
                    });
                    function savedsubkpi(json) {
                        a$.hideprogress("projectadminprogress");
                        if (a$.jsonerror(json)) {
                            $("#subkpiadminarea").append(json.msg);
                        }
                        else {
                            //$(". node").addClass("activenode");
                            if (ad.model[m].project[p].kpi[k].subkpi[s].id == "NEW") {
                                ad.model[m].project[p].kpi[k].subkpi[s].id = json.subkpiid;
                            }
                            ad.model[m].project[p].kpi[k].scores = null;
                            drawprojecttree(m, p, k, s);
                            buildsubkpiarea(m, p, k, s);
                        }
                    }
                    break;
                default:
                    alert("Error: unhandled cancel");
            }
        });
    }

    function activatenode(p, k, s) {
        $(".companynode").removeClass("activenode");
        $(".projectnode").removeClass("activenode");
        $(".kpinode").removeClass("activenode");
        $(".subkpinode").removeClass("activenode");
        if (!exists(p)) {
            $(".companynode").addClass("activenode");
        }
        else if (!exists(k)) {
            $("#projecttree li ul :nth-child(" + (p + 1) + ") span span").each(function () {
                if ($(this).hasClass("projectnode")) {
                    $(this).addClass("activenode");
                }
            });
        }
        else if (!exists(s)) {
            $("#projecttree li ul :nth-child(" + (p + 1) + ") ul :nth-child(" + (k + 1) + ") span span").each(function () {
                if ($(this).hasClass("kpinode")) {
                    $(this).addClass("activenode");
                }
            });
        }
    }

    function drawprojecttree(mi, pi, ki, si) {
        var bld = '<ul id="projecttree">';
        bld += '<li><span><span class="companynode">' + ad.organization.desc + '<span class="showid">' + ad.organization.id + '</span>';

        bld += /* REMOVED 10/3/14 <span class="modeladd">Add Model</span>*/'</span></span>';

        //TODO: Add loop for model
        for (var m in ad.model) {
            if (a$.urlprefix() == "cthix-program.") {
                if (ad.model[m].name == "CSR") {
                    ad.model[m].name = "Program";
                }
            }
            bld += '<ul><li><span><span class="modelnode">' + ad.model[m].name + ' Model<span class="showid">' + ad.model[m].id + '</span>';
            if (ad.model[m].id != 3) {
                bld += '<span class="projectadd">Add <span class="scaname">Project</span></span>';
            }
            bld += '</span></span>';
            if (ad.model[m].project.length > 0) bld += "<ul>";
            for (var p in ad.model[m].project) {
                if (ad.model[m].project[p].id != "NEW") {
                    bld += '<li><span><span class="projectnode';
                    if (exists(mi)) if (exists(pi)) if (!exists(ki)) if (p == pi) bld += ' activenode';
                    bld += '">' + ad.model[m].project[p].desc + '<span class="showid">' + ad.model[m].project[p].id + '</span>';
                    if (ad.model[m].project[p].status == 'A') {
                        bld += '<span class="kpiadd">Add KPI</span>';
                    }
                    else {
                        bld += '<span class="projectinactive">(Project Inactive)</span>';
                    }
                    bld += '</span></span>';
                    if (ad.model[m].project[p].kpi.length > 0) bld += "<ul>";
                    for (var k in ad.model[m].project[p].kpi) {
                        if (ad.model[m].project[p].kpi[k].id != "NEW") {
                            bld += '<li><span style="position:relative;"><span class="kpinode';
                            if (exists(ki)) if (!exists(si)) if (k == ki) bld += ' activenode';
                            bld += '">' + ad.model[m].project[p].kpi[k].desc + '<span class="showid">' + ad.model[m].project[p].kpi[k].id + '</span>';
                            if (ad.model[m].project[p].kpi[k].subkpi.length > 0) {
                                bld += '<span class="subkpiadd">Add SubKPI</span>';
                            }
                            bld += '</span></span>';
                            if (ad.model[m].project[p].kpi[k].subkpi.length > 0) bld += "<ul>";
                            for (var s in ad.model[m].project[p].kpi[k].subkpi) {
                                if (ad.model[m].project[p].kpi[k].subkpi[s].id != "NEW") {
                                    bld += '<li><span style="position:relative;"><span class="subkpinode';
                                    if (exists(si)) if (s == si) bld += ' activenode';
                                    bld += '">' + ad.model[m].project[p].kpi[k].subkpi[s].desc + '<span class="showid">' + ad.model[m].project[p].kpi[k].subkpi[s].id + '</span></span></span></li>';
                                }
                            }
                            if (ad.model[m].project[p].kpi[k].subkpi.length > 0) bld += "</ul>";
                        }
                    }
                    if (ad.model[m].project[p].kpi.length > 0) bld += "</ul>";
                    bld += '</li>';
                }
            }
            if (ad.model[m].project.length > 0) bld += "</ul>";

            bld += '</li></ul>';
        }

        bld += '</li></ul>';

        $("#projectadmin").html(bld);
        $("#projecttree").treeview();
        if ((a$.urlprefix() == "ers.") || (a$.urlprefix() == "dev.") || (a$.urlprefix() == "make.") || (a$.urlprefix() == "ec2.")) {
            $(".projectnode").click();
        }

        bindprojecttree(mi, pi, ki, si);

        if ($("#StgTooltips select").val() == "Off") {
            $('*').qtip('disable')
        }
        else {
            $('*').qtip('enable')
        }
        appApmDashboard.setClientLabels();
    }

    function bindprojecttree(mi, pi, ki, si) {

        $(".companynode").unbind().bind("click", function (event) {
            event.stopPropagation();
            clearstate();
            $(this).addClass("activenode");
            buildcompanyarea();
            $('#companyadminlabel').show().trigger('click');
        });

        $(".modelnode").unbind().bind("click", function (event) {
            event.stopPropagation();
            clearstate();
            $(this).addClass("activenode");
            var id = parseInt($(this).children().first().html());
            var m;
            for (var h in ad.model) {
                if (ad.model[h].id == id) {
                    m = h;
                    break;
                }
            }
            buildmodelarea(m);
            $('#modeladminlabel').show().trigger('click');
        });

        $('.modelnode').qtip({ content: 'Model' });

        $(".projectnode").unbind().bind("click", function (event) {
            event.stopPropagation();
            clearstate();
            $(this).addClass("activenode");
            var id = parseInt($(this).children().first().html());
            var m, p;
            for (var h in ad.model) {
                for (var i in ad.model[h].project) {
                    if (ad.model[h].project[i].id == id) {
                        m = h;
                        p = i;
                        break;
                    }
                }
            }
            buildmodelarea(m);
            buildprojectarea(m, p);
            $('#modeladminlabel').show();
            $('#projectadminlabel').show().trigger('click');
        });

        var plabel = "Project";
        if (a$.urlprefix() == "ces.") {
            plabel = "Stage";
        }
        $('.projectnode').qtip({ content: plabel });

        $(".kpinode").unbind().bind("click", function (event) {
            event.stopPropagation();
            clearstate();
            $(this).addClass("activenode");
            var id = parseInt($(this).children().first().html());
            editkpi(id);
        });
        $('.kpinode').qtip({ content: 'KPI' });

        $(".subkpinode").unbind().bind("click", function (event) {
            event.stopPropagation();
            clearstate();
            $(this).addClass("activenode");
            var id = parseInt($(this).children().first().html());
            editsubkpi(id);
        });
        $('.subkpinode').qtip({ content: 'SubKPI' });

        $(".modeladd").unbind().bind("click", function (event) {
            event.stopPropagation();
            clearstate();
            buildmodelarea();
            $('#modeladminlabel').show().trigger('click');
        });

        $(".projectadd").unbind().bind("click", function (event) {
            event.stopPropagation();
            clearstate();
            var id = parseInt($(this).parent().children().first().html());
            var m;
            for (var h in ad.model) {
                if (ad.model[h].id == id) {
                    m = h;
                    break;
                }
            }
            buildmodelarea(m);
            buildprojectarea(m);
            $("#modeladminlabel").show();
            $('#projectadminlabel').show().trigger('click');
        });

        $(".kpiadd").unbind().bind("click", function (event) {
            event.stopPropagation();
            clearstate();
            try { $("*").qtip('hide'); } catch (err) { }
            var id = parseInt($(this).parent().children().first().html());
            var m, p;
            for (var h in ad.model) {
                for (var i in ad.model[h].project) {
                    if (ad.model[h].project[i].id == id) {
                        m = h;
                        p = i;
                        break;
                    }
                }
            }
            buildmodelarea(m);
            buildprojectarea(m, p);
            buildkpiarea(m, p);
            $("#modeladminlabel").show();
            $('#projectadminlabel').show();
            $('#kpiadminlabel').show().trigger('click');
        });

        $(".subkpiadd").unbind().bind("click", function (event) {
            try { $("*").qtip('hide'); } catch (err) { }
            event.stopPropagation();
            clearstate();
            var id = parseInt($(this).parent().children().first().html());
            var m, p, k;
            var found = false;
            for (var h in ad.model) {
                m = h;
                for (var i in ad.model[h].project) {
                    p = i;
                    for (var i1 in ad.model[h].project[p].kpi) {
                        if (ad.model[h].project[p].kpi[i1].id == id) {
                            k = i1;
                            found = true;
                            break;
                        }
                    }
                    if (found) break;
                }
                if (found) break;
            }
            buildmodelarea(m);
            buildprojectarea(m, p);
            buildkpiarea(m, p, k);
            buildsubkpiarea(m, p, k);
            $("#modeladminlabel").show();
            $('#projectadminlabel').show();
            $('#kpiadminlabel').show();
            $('#subkpiadminlabel').show().trigger('click');
        });
    }

    function editkpi(id) {
        var m, p, k;
        var found = false;
        for (var h in ad.model) {
            m = h;
            for (var i in ad.model[h].project) {
                p = i;
                for (var i1 in ad.model[h].project[p].kpi) {
                    if (ad.model[h].project[p].kpi[i1].id == id) {
                        k = i1;
                        found = true;
                        break;
                    }
                }
                if (found) break;
            }
            if (found) break;
        }
        buildmodelarea(m);
        buildprojectarea(m, p);
        buildkpiarea(m, p, k);
        $('#modeladminlabel').show();
        $('#projectadminlabel').show();
        $('#subkpiadminlabel').hide();
        $('#kpiadminlabel').show().trigger('click');
    }
    function editsubkpi(id) {
        var m, p, k, s;
        var found = false;
        for (var h in ad.model) {
            m = h;
            for (var i in ad.model[h].project) {
                p = i;
                for (var i1 in ad.model[h].project[p].kpi) {
                    k = i1;
                    for (var i2 in ad.model[h].project[p].kpi[k].subkpi) {
                        if (ad.model[h].project[p].kpi[k].subkpi[i2].id == id) {
                            s = i2;
                            found = true;
                            break;
                        }
                    }
                    if (found) break;
                }
                if (found) break;
            }
            if (found) break;
        }
        buildmodelarea(m);
        buildprojectarea(m, p);
        buildkpiarea(m, p, k);
        buildsubkpiarea(m, p, k, s);
        $('#modeladminlabel').show();
        $('#projectadminlabel').show();
        $('#kpiadminlabel').show();
        $('#subkpiadminlabel').show().trigger('click');
    }
    function createbestpracticeskpi(m, p, b) {
        var k = ad.model[m].project[p].kpi.length;
        ad.model[m].project[p].kpi.push(ad.model[m].bestpractices.kpi[b]);
        ad.model[m].project[p].kpi[k].id = "NEW";
        var databld = { lib: "admin", cmd: "updateadmin", update: "kpi", projectid: ad.model[m].project[p].id, kpi: ad.model[m].project[p].kpi[k] };
        a$.showprogress("projectadminprogress", "Saving...");
        a$.ajax({
            type: "POST", service: "JScript", async: false, data: databld, dataType: "json", cache: false, error: a$.ajaxerror,
            success: savedkpi
        });
        function savedkpi(json) {
            a$.hideprogress("projectadminprogress");
            if (a$.jsonerror(json)) {
                $("#kpiadminarea").append(json.msg);
            }
            else {
                //$(". node").addClass("activenode");
                if (ad.model[m].project[p].kpi[k].id == "NEW") {
                    ad.model[m].project[p].kpi[k].id = json.kpiid;
                    ad.model[m].project[p].kpi[k].subkpi = [];
                }
                drawprojecttree(m, p, k);
                buildkpiarea(m, p, k);
            }
        }
    }

    var xref = [];

    function editspan2(o) { //value, classes, override) {
        var idx = xref.length;
        xref.push(o);
        var bld = '<span class="edit-span2 ';
        if (o.classes) {
            bld += " " + o.classes
        }
        bld += '">';
        if (isediting(o)) {
            bld += '<input type="text" value="' + o.ref[o.member] + '"/><span style="display:none;">' + o.ref[o.member] + '</span><span style="display:none;">' + idx + '</span>';
        }
        else {
            bld += o.ref[o.member];
        }
        bld += '</span>';
        return bld;
    }

    function reffrm(frm) {
        $(".edit-span2 input").each(function () {
            if ($(" span", $(this).parent()).length > 1) {
                /* ERROR: nth-of-type doesn't work in IE 8
                var idx = parseInt($(" span:nth-of-type(2)", $(this).parent()).html());
                */
                var idx;
                var cnt = 0;
                $(" span", $(this).parent()).each(function () {
                    cnt++;
                    if (cnt == 2) {
                        idx = parseInt($(this).html());
                    }
                });

                if (xref[idx].frm == frm) {
                    xref[idx].ref[xref[idx].member] = $(this).val();
                }
            }
        });
    }

    function clearfrm(frm) {
        for (var i in xref) {
            if (xref[i].frm == frm) {
                xref[i].ref = null;
            }
        }
    }



    // global variables
    window.appApmAdmin = {
        initProjectAdmin: initProjectAdmin
    };
})();

