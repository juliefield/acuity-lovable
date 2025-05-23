angularApp.directive("ngTableEditor", ['api', '$compile', '$rootScope', function (api, $compile, $rootScope) {
    return {
        templateUrl: a$.debugPrefix() + "/applib/dev/FORMS1/FORMS1-view/tableeditor.htm?" + Date.now(),
        scope: {
            dataview: "@", //can also be a view name.  Views and special scenarios are expected to be intercepted server-side.
            allow: "@",
            disallow: "@",
            headertext: "@",
            userid: "@",
            icon: "@", //Is there a navigation icon that can be clicked to open/close the table view.
            open: "@", //Yes/No should table be shown opened at startup (if icon is "No", then this is irrelevant).
            edit: "@", //none, inline, or the name of a popup form.  (edit="none" just shows a table (with display-changing potential), "inline" allows record edit inline, otherwise it's the name of a form directive for a popup).
            tablesum: "@" //Comma-separated list of columns that are to have a sum in the footer (TODO: revisit this).
            //If omitted, the default is "inline"
        },
        require: '^ngLegacyContainer',
        link: function (scope, element, attrs, legacyContainer) {
            scope.showicon = false;
            scope.popup = false;
            scope.datasystem = "unknown";
            scope.elementhold = element;
            scope.footer_tablesum = false;
            scope.ts = {};

            if ($(element).parent().parent().parent().parent().hasClass("acuity-table")) {
                if ($(element).parent().parent().parent().parent().parent().parent().parent().hasClass("rpt-panel")) {
                    //alert("debug: panel width = " + $(element).parent().parent().parent().parent().parent().parent().parent().css("width"));
                    $(".table-size-CLUGUE", element).css("max-width", $(element).parent().parent().parent().parent().parent().parent().parent().css("width"));
                }
                else {
                    //alert("debug: creating tableeditor FOUND PARENT but no panel");
                }
            }
            else {
                //alert("debug: creating tableeditor DID NOT FIND PARENT2");
            }

            //2022-10-01 - Widen the size of the Category (Reason) box.  Very specific and dangerous.
            if (a$.urlprefix() == "km2.") {
                $('head').append('<style> .journal-table td:nth-child(14) { min-width: 210px; };</style>');
            }

            if (a$.exists(scope.tablesum)) {
                if (scope.tablesum != "") {
                    scope.footer_tablesum = true;
                    var tss = scope.tablesum.split(",");
                    for (var i in tss) {
                        scope.ts[tss[i]] = "";
                    }
                }
            }
            function updatetablesum() {
                for (var key in scope.ts) {
                    var sm = 0.0;
                    for (var r in scope.table.records) {
                        var pf = parseFloat(scope.table.records[r][key])
                        if (!isNaN(pf)) {
                            sm += pf;
                        }
                    }
                    scope.ts[key] = sm;
                }
            }
            if (scope.dataview.length >= 4) {
                if (scope.dataview.substring(3, 4) == ":") {
                    scope.datasystem = scope.dataview.substring(0, 3); // DBS, DAS, CID
                }
            }
            function addblankrecord() {
                var eo = {};
                for (var f in scope.table.columns) {
                    eo[scope.table.columns[f].name] = "";
                }
                if ((scope.dataview == "DAS:JournalTEST") && (a$.urlprefix() != "NOTbgr.")) {
                    scope.table.records.unshift(eo);
                    return 0;
                }
                else {
                    scope.table.records.push(eo);
                    return scope.table.records.length - 1; //recordid
                }

            }
            scope.tableclasses = function () {
                //alert("debug: at tableclasses");
                var formclass = "";
                if (a$.exists(scope.edit) && (scope.edit != "")) {
                    formclass = "table-" + scope.edit.replace("ng-", "");
                }
                return "table-responsive " + formclass;
            }
            scope.onUpdateRecord = function (recordid, f, returnid) {
                //2024-02-23 - Get rid of especially heinous junk characters (start small).
                try {
                    for (var field in f) {
                        if (typeof f[field] == "string") {
                            f[field] = f[field].replace(/[\t\r\n\x02\x0B\x0C\u0085\u2028\u2029]+/g," ")                            
                        }
                    }
                }
                catch (e) {
                }
                if ((!a$.exists(recordid)) || (recordid == "")) {
                    recordid = addblankrecord();
                }
                for (var k in f) {
                    scope.table.records[recordid][k] = f[k];
                }
                //BGR: 1) Call to write the record (if there's an ID, then it's an update, if none then it's an add.
                if (scope.footer_tablesum) updatetablesum();

                if (!returnid) {
                    //WITHOUT A PROMISE
                    api.postJS({
                        lib: "editor",
                        cmd: "savedataview",
                        dataview: scope.dataview,
                        allow: scope.allow,
                        disallow: scope.disallow,
                        record: scope.table.records[recordid]
                    }).then(function (json) {
                        if (json.saved) {
                            scope.$apply(function () {
                                scope.table.records[recordid]["id"] = json.idsaved;
                            });
                            //alert("Record Saved");
                        }
                        else {
                            alert("Save Failed (intercept) - Please take a screen shot and send to Acuity Technical Support:\n" + json.msg);
                        }
                    });
                    return 0; //Return 0 (don't wait for record id)
                }
                else {
                    //WITH A PROMISE (construct from scratch)
                    var a = {
                        type: "POST",
                        service: "JScript",
                        async: true,
                        data: {
                            lib: "editor",
                            cmd: "savedataview",
                            dataview: scope.dataview,
                            allow: scope.allow,
                            disallow: scope.disallow,
                            record: scope.table.records[recordid]
                        },
                        dataType: "json",
                        cache: false,
                        params: ""
                    };
                    var loc = window.location.host;
                    if (loc.indexOf("localhost", 0) < 0) {
                        loc = window.location.protocol + '//' + window.location.host + "/";
                    } else {
                        loc = window.location.protocol + '//' + window.location.host;
                        loc += a$.xss(window.location.pathname).substr(0, a$.xss(window.location.pathname).indexOf(".com") + 5);
                    }
                    a.url = loc + "jshandler.ashx";
                    if (!a.data.uname) {
                        if (!a.data.auth) a.data.auth = { username: a$.xss($.cookie("username")), uid: a$.xss($.cookie("uid")) }; //was: appLib.secobj();
                    }
                    a.data.prefix = a$.urlprefix().split(".")[0];

                    return new Promise(function (resolve) {
                        a.success = function (json) {
                            a$.jsonerror(json); //Display the error if any.
                            resolve(json);
                        };
                        a.error = a$.ajaxerror;
                        $.ajax(a);
                    });
                }
            }
            if (a$.exists(scope.icon)) {
                scope.showicon = !(scope.icon.toLowerCase() == "no");
                scope.showeditor = false;
                if (a$.exists(scope.open)) {
                    scope.showeditor = !(scope.open.toLowerCase() == "no");
                }
                if (scope.showicon) {
                    if ((scope.icon.toLowerCase() != "yes") && (scope.icon.toLowerCase() != "no")) {
                        scope.icontext = scope.icon;
                    }
                }
            } else {
                scope.showeditor = true;
            }
            scope.showheader = false;
            if (a$.exists(scope.headertext)) {
                if (scope.headertext != "") {
                    scope.showheader = true;
                }
            }
            // Hardcoded to return dsc[name] in a nicer format
            scope.formatColHead = function (txt) {
                return txt === 'follow_up_date' ? 'Follow Up Date'
                : txt === 'DeliveredBy' ? 'Delivered By'
                : txt === 'DateClosed' ? 'Date Closed'
                : txt === 'goal_kpi' ? ((a$.urlprefix() == "walgreens.") ? 'PPGA' : 'Goal')
                : txt === 'Reason' ? 'Category'
                : txt === 'id' ? 'ID'
                : txt;
            }
            scope.onInputChange = function ($event) {
                if (scope.footer_tablesum) updatetablesum();
                var me = this;
                var isasync = (me.$parent.r["id"] == ""); //Adding of records requires an async call
                api.doJS({
                    lib: "editor",
                    cmd: "savedataview",
                    dataview: scope.dataview,
                    allow: scope.allow,
                    disallow: scope.disallow,
                    table: scope.table,
                    record: me.$parent.r
                }, "POST", isasync).then(function (json) {
                    if (json.saved) {
                        scope.$apply(function () {
                            me.$parent.r["id"] = json.idsaved;
                        });
                    }
                });
                var girl = 1;
            }
            scope.show = function () {
                scope.showeditor = !scope.showeditor;
            }
            //TODO: Turn this function into a broadcast to the $on that's directly beneath it.  a$.exists(scope.userid) ? scope.userid : legacyContainer.scope.filters.CSR
            scope.editrow = function (index) {
                var cl = '<' + scope.edit + ' popup dataview="' + scope.dataview + '" recordid="' + index + '" userid="' + (a$.exists(scope.userid) ? scope.userid : legacyContainer.scope.filters.CSR) + '"></' + scope.edit + '>';
                //alert("debug:1 cL=" + cl);
                var ele = $compile(cl)(scope);
                angular.element($(" .form-anchor", element)).empty().append(ele);
            }
            $rootScope.$on('formEdit', function (event, args) {
                //alert("debug: formEdit broadcast received.")
                if ($(".form-anchor-primary").length == 0) {
                    //alert("Please expand the journal table for the agent\nbefore selecing entries from the performance trend chart.");
                }
                else {
                    var rts = args.data.split(",");
                    if (rts[1] == scope.dataview) { //This tableeditor has the right records (could be multiple).
                        var cl = '<' + rts[0] + ' popup dataview="' + rts[1] + '" id="' + rts[2] + '"></' + rts[0] + '>';
                        //alert("debug:2 cL=" + cl);
                        var ele = $compile(cl)(scope);
                        if (a$.exists(ele)) {
                            angular.element($(" .form-anchor-primary", scope.elementhold)).empty().append(ele);
                        }
                    }
                }
            });
            scope.deleterow = function (index) {
                if (scope.table.records[index]["id"] == "") { //Record never modified from default (not saved).
                    scope.table.records.splice(index, 1); //Record is removed even if delete fails (will fail if no id).
                    if (scope.footer_tablesum) updatetablesum();
                }
                else {
                    var r = confirm("Are you sure you want to delete this record?");
                    if (r) {
                        api.doJS({
                            lib: "editor",
                            cmd: "deletedataview",
                            dataview: scope.dataview,
                            allow: scope.allow,
                            disallow: scope.disallow,
                            table: scope.table,
                            record: scope.table.records[index]
                        }, "POST", true).then(function (json) {
                            if (json.saved) {
                                //alert("debug: Record Deleted");
                                scope.$apply(function () {
                                    scope.table.records.splice(index, 1);
                                    if (scope.footer_tablesum) updatetablesum();
                                });
                            }
                        });
                    }
                }
            }
            scope.addrow = function (index) {
                if (a$.exists(scope.edit) && (scope.edit != "inline")) {
                    var ele = $compile('<' + scope.edit + ' popup  dataview="' + scope.dataview + '" id=""' + ((a$.exists(scope.userid) && (scope.userid != "")) ? ' userid="' + scope.userid + '"' : "") + '></' + scope.edit + '>')(scope);
                    angular.element($(" .form-anchor", element)).empty().append(ele);
                }
                else {
                    addblankrecord();
                }
            }

            //Sidekick-specific launch buttons, within the table editor (see ng-acuity-report-launch for a general version)
            scope.showlaunchbutton = function (kind) {
                return false; //Greg doesn't like the buttons, defeat for now.
                var rightplace = false;
                var aminteamtable = $(element).closest(".sidekick-teams-table").length;
                switch (kind) {
                    case 'OverallCoachingCritique':
                        rightplace = aminteamtable;
                        break;
                    case 'AgentCoachingCritique':
                    case 'AgentCoaching':
                        rightplace = !aminteamtable;
                        break;
                    default:
                        rightplace = false;
                }
                if (scope.dataview.toString().toLowerCase() != "das:journaltest") rightplace = false;
                return scope.formadd && rightplace;
            }

            scope.launchreport = function (kind) {
                //alert("debug: launch report for : " + kind);
                var cid = "";
                switch (kind) {
                    case 'OverallCoachingCritique':
                        break;
                    case 'AgentCoachingCritique':
                        cid = 'Sandbox10-Brian';
                        break;
                    case 'AgentCoaching':
                        cid = 'IQAssure-Sandbox';
                        break;
                    default:
                }
                if (cid != "") {
                    //report-frame-popup
                    if ($(".qa-reportframe").length == 0) {
                        var bld = '<div class="report-frame-popup qa-wrapper-popup qa-reportframe" style="display:block;">';
                        bld += '<div class="qa-wrapper2-popup qa-wrapper2-popup_reportframe" style="height:80%;width:80%">';
                        bld += ' <div class="qa-close"><i class="fa-fa-times" aria-hidden="true">::before</i></div>';
                        bld += '  <div class="qa-box-popup">';
                        bld += '<iframe id="ReportPopupIframe" src="../3/ng/ReportEditor/default.aspx?prefix=' + a$.urlprefix().split(".")[0] + '&panelcid=' + cid + '" style="width:100%;height:600px; border:0px;"></iframe>';
                        bld += 'Put the report iframe here open to cid: ' + cid;
                        bld += '  </div>';
                        bld += ' </div>';
                        bld += '</div>';
                        $(".content").prepend(bld);
                        $(".qa-reportframe .qa-close").bind("click", function () {
                            $(".qa-reportframe").remove();
                        });
                    }
                }
                else {
                    alert("Unrecognized Launch Kind: " + kind);
                }

                return false;
            }

            scope.save = function () {
                scope.showeditor = scope.showeditor; //So scope is visible in the debugger, for now.
                api.postJS({
                    lib: "editor",
                    cmd: "savedataview",
                    dataview: scope.dataview,
                    allow: scope.allow,
                    disallow: scope.disallow,
                    table: scope.table
                }).then(function (json) {
                    if (json.saved) {
                        alert("Table Saved");
                    }
                });
            }

            scope.nodollar = function (t) {
                if (t.charAt(0) == '$') {
                    return (t.replace('$', ''));
                }
                return t;
            }

            scope.myTextExtraction = function (node) { //Looking for the html in an anchor or the entire text.
                var a = $(" a", node);
                if (a.length > 0) {
                    return nodollar($(a).html());
                }
                else {
                    var tl = $(".report-titlelink,.bal-colorme,.bal-colored,.rpt-colorme,.rpt-colored", node);
                    if (tl.length > 0) {
                        return nodollar($(tl).html());
                    }
                    else {
                        return nodollar($(node).html());
                    }
                }
            }

            scope.loadTableEditor = function () {
                scope.formadd = false;
                scope.formedit = false;
                scope.formeditsave = true; //Special state allows showing of a form but not saving it.  Only important if formedit is true.
                scope.formdelete = false;
                api.getJS({
                    lib: "editor", //TODO: Which lib?
                    cmd: "loaddataview",
                    dataview: scope.dataview,
                    allow: scope.allow,
                    reversesort: (window.location.toString().toLowerCase().indexOf("bgr-v3-dev.") >= 0), //eye roll
                    disallow: scope.disallow,
                    CSR: a$.exists(scope.userid) ? scope.userid : legacyContainer.scope.filters.CSR
                }).then(function (json) {
                    scope.$apply(function () {
                        //CLUGUE - This row keeps disappearing in Sidekick, so show it here.
                        if (scope.dataview == "DAS:JournalTEST") {
                            if (a$.urlprefix() == "collective-solution.") {
                                json.table.columns[0].display = "Y"; //Display the ID
                            }
                            if ($(element).parent().parent().hasClass("row")) {
                                $(element).parent().parent().show();
                            }
                        }
                        scope.showtable = json.allowed;
                        if (scope.showtable) {
                            if (!a$.exists(json.table)) {
                                alert("table does not exist");
                            } else {
                                if ((scope.dataview == "DAS:JournalTEST") && (a$.urlprefix() != "NOTbgr.")) {
                                    json.table.records = json.table.records.slice().reverse();
                                }
                                scope.table = json.table;
                                if (scope.footer_tablesum) updatetablesum();
                                //Do enabling based on edit context first.
                                if (a$.exists(scope.edit)) {
                                    if ((scope.edit != "none") && (scope.edit != "inline")) {
                                        scope.formedit = true;
                                    }
                                    if (scope.edit != "none") {
                                        scope.formdelete = true;
                                        scope.formadd = true;
                                    }
                                }
                                //2023-10-09 - Permission is usually passed through the dataview, but the permission string doesn't handle subroles.
                                if ($.cookie("TP1Subrole") == "TeamLead") {
                                    scope.formadd = scope.formadd & true;
                                    scope.formedit = scope.formedit & true;
                                }
                                else {
                                    scope.formadd = scope.formadd & json.permissions.add.allowed;
                                    scope.formedit = scope.formedit & json.permissions.edit.allowed;
                                }
                                scope.formdelete = scope.formdelete & json.permissions.del.allowed;
                            }
                        }
                        //Safety - to protect Bluegreen's live journals in "demo mode".
                        if (false) { //DISABLED
                            if (window.location.toString().toLowerCase().indexOf("bgr-v3-dev.") >= 0) {
                                scope.formadd = false;
                                scope.formedit = true;
                                scope.formeditsave = false; //Don't allow saving of a form when editing.
                                scope.formdelete = false;
                            }
                        }
                    });
                });
            }

            scope.loadTableEditor();

            if (!a$.exists(scope.userid)) {
                //Unifyme
                try {
                    //TODO: Test this.  The timeout loop may be preferable if this gets false positives.
                    ko.postbox.subscribe("Filters", function (newValue) {
                        scope.loadTableEditor();
                    });
                }
                catch (e) {
                    //If pubsub isn't available (I'm getting rid of "event by cookie", so this may stop working).
                    function checkfilters() {
                        if ($.cookie("CSR") != legacyContainer.scope.filters.CSR) {
                            legacyContainer.scope.filters.CSR = $.cookie("CSR");
                            //$(scope.reportSelector).html('<h1 class="refreshing">Refreshing</h1>');
                            scope.loadTableEditor();
                        }
                        else if ($.cookie("Team") != legacyContainer.scope.filters.Team) {
                            legacyContainer.scope.filters.Team = $.cookie("Team");
                            //$(scope.reportSelector).html('<h1 class="refreshing">Refreshing</h1>');
                            scope.loadTableEditor();
                        }
                        setTimeout(checkfilters, 300);
                    }
                    checkfilters();
                };
            }


            /*
            setTimeout(function () {
            $(".acuity-tablesorter", element).tablesorter({ textExtraction: scope.myTextExtraction });
            }, 5000);
            */
        }
    }
} ]);
