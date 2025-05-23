function nb(v) {
    return (a$.exists(v) && (v != ""));
}

angularApp.service('compliance', ['api', function (api) {

    var me = this;

    var gettinglist = false;
    var listready = false;

    this.startup = true;

    this.getLists = function (who) {
        if (!gettinglist) {
            gettinglist = true;
            return new Promise(function (resolve) {
                api.getJS({
                    lib: "qa",
                    cmd: "complianceGetUserList", //TODO: Can split out into separate calls.
                    prtuid: a$.gup("prtuid"),
                    idtype: who
                }).then(function (json) {
                    me.projectlist = json.projectlist;
                    me.userlist = json.userlist;
                    me.violations = json.violations;
                    me.FACSID = json.FACSID;
                    me.credentials = json.credentials;
                    me.startupMonitorID = json.startupMonitorID;
                    listready = true;
                    resolve(me);
                });
            });
        }
        else {
            return new Promise(function (resolve) {
                function readytest() {
                    if (!listready) {
                        setTimeout(readytest, 100);
                    }
                    else {
                        resolve(me);
                    }
                }
                readytest();
            });
        }
    }

} ]);

angularApp.directive("ngComplianceMonitor", ['compliance', 'api', function (compliance, api) {
    return {
        templateUrl:  (window.location.toString().toLowerCase().indexOf("performant") >= 0) ?
        	"../applib/html/directives/compliance/monitorPerformant.htm?" + Date.now() :
        	"../applib/html/directives/compliance/monitor.htm?" + Date.now(),
        scope: {
            who: "@"
        },
        require: '^ngLegacyContainer',
        link: function (scope, element, attrs, legacyContainer) {
            scope.isreadonly = false;
            scope.readonly = function () {
                return scope.isreadonly;
            }
            scope.credentials = [];
            scope.credentialed = function () {
                var c = false;
                var trigger = false;
                for (var i in scope.credentials) {
                    if (scope.credentials[i] == "Compliance Auditor") {
                        for (j in scope.credentials) {
                            if ((scope.credentials[i] == "self") || (scope.credentials[i] == "supervisor")) {
                                trigger = true;
                            }
                        }
                        c = true;
                    }
                    else if (scope.credentials[i] == "self") {
                        trigger = true;
                        c = true;
                    }
                    else if (scope.credentials[i] == "supervisor") {
                        trigger = true;
                        c = true;
                    }
                }
                if (c) {
                    $(".compliance-monitor-link").show();  //Tabs are outside of ng.
                }
                else {
                    $(".compliance-monitor-link").hide();  //Tabs are outside of ng.
                }
                if (trigger && compliance.startup) {
                    $("#monitortab").trigger("click"); //smh
                    compliance.startup = false;
                }
                return c;
            }

            scope.existingmonitor = function () {
                return scope.startupMonitorID != "";
            }

            lockedagent = false;

            scope.form = [];
            scope.form.push({});

            scope.queue = [];

            compliance.getLists().then(function (json) {
                scope.$apply(function () {
                    scope.projectlist = json.projectlist;
                    scope.userlist = json.userlist;
                    scope.violations = json.violations;
                    scope.FACSID = json.FACSID;
                    //TODO: Fill in records from saved data (if there's a call id/agent or if it's a review.
                    //If new record:
                    scope.records = [{ selectedCategory: 0, selectedSubcategory: 0}];
                    scope.credentials = json.credentials;
                    scope.startupMonitorID = json.startupMonitorID; //This window will always deal with only this monitor.
                    if (json.startupMonitorID != "") {
                        loadmonitor(json.startupMonitorID);
                    }
                });
            });

            function loadmonitor(id) {
                api.getJS({
                    lib: "qa",
                    cmd: "loadComplianceMonitor",
                    id: id
                }).then(function (json) {
                    scope.$apply(function () {
                        scope.form[0]["Project"] = "" + json.form["Project"];  //Do first so agent may work.
                        for (var key in json.form) {
                            if (key != "Project") {
                                scope.form[0][key] = json.form[key]; //duck
                            }
                            if (key == "CallTime") {
                                //Slam the var into the timepicker control (just as an experimental step).
                                $(".bad-ng-calltime").children().eq(1).val(scope.form[0][key]);
                            }
                        }

                        //TODO: Fix this, the problem is in dynamic-ui
                        //$(".bad-ng-calldate").val(scope.form[0].CallDate);
                        //$(".bad-ng-calltime").val(scope.form[0].CallTime);

                        scope.records = [];
                        for (var i in json.records) {
                            scope.records.push({});
                            for (var key in json.records[i]) {
                                if ((key == "selectedCategory") || (key == "selectedSubcategory")) {
                                    scope.records[i][key] = "" + json.records[i][key];
                                    if (key == "selectedCategory") {
                                        scope.changeCategory(i);
                                    }
                                }
                                else {
                                    scope.records[i][key] = json.records[i][key];
                                }
                            }
                        }
                        scope.isreadonly = true;
                        scope.inmonitor = true;

                        for (var i in scope.credentials) {
                            if (scope.credentials[i] == "Compliance Auditor") {
                                lockedagent = true;
                                scope.isreadonly = false;
                                $("#monitortab").trigger("click");
                                compliance.startup = false;
                            }
                        }
                    });
                });
            }

            scope.inmonitor = false;
            scope.monitoringnow = function () {
                return scope.inmonitor;
            }

            scope.refreshCallID = function () {

                scope.form[0].CallID = "";
                if (scope.form[0].Directory.length) {
                    scope.form[0].CallID = scope.form[0].Directory[0];
                }
                scope.form[0].CallID += "-" + (a$.exists(scope.form[0].AccountNumber) ? scope.form[0].AccountNumber : " ") + "-" + scope.FACSID;

            }

            scope.refreshqueue = function () {
                api.getJS({
                    lib: "qa",
                    cmd: "reloadQueue"
                }).then(function (json) {
                    scope.$apply(function () {
                        scope.queue = json.queue;
                    });
                });
            }

            scope.cancel = function () {
                scope.clearmonitorfields();
                lockedagent = false;
                scope.inmonitor = false;
            }

            scope.monitorqueuedagent = function () {
                scope.form[0].qid = scope.form[0].Queue;
                scope.drawfromqueue(scope.form[0].Queue);
            }

            scope.monitornewagent = function () {
                scope.inmonitor = true;
            }

            scope.monitoradhocagent = function () {
                scope.form[0].qid = 0;
                //TODO: Clear the form, hide the queue.
            }

            scope.drawfromqueue = function (qid) {
                api.getJS({
                    lib: "qa",
                    cmd: "drawFromQueue",
                    qid: qid
                }).then(function (json) {
                    scope.$apply(function () {
                        //Load all the things.
                        if (json.AlreadySelected) {
                            alert("This queue entry has been selected by another auditor, please select another entry.");
                        }
                        else {
                            for (var e in json.entry) {
                                if (e == "Agent") {
                                    for (var u in scope.userlist) {
                                        if (scope.userlist[u].user_id == json.entry.Agent) {
                                            scope.form[0].Project = "" + scope.userlist[u].projectid;
                                        }
                                    }
                                }
                                if (json.entry[e] != null) {
                                    scope.form[0][e] = json.entry[e];
                                }
                                else {
                                    scope.form[0][e] = "";
                                }
                            }
                            if (json.entry.Group == null) {
                                scope.changeAgent();
                            }
                            scope.refreshCallID();
                            scope.inmonitor = true;
                            lockedagent = true;
                        }
                        scope.refreshqueue();
                    });
                });
            }

            scope.refreshqueue();

            var currentdate = new Date();
            scope.form[0].AuditDate = (currentdate.getMonth() + 1) + "/"
                + currentdate.getDate() + "/"
                + currentdate.getFullYear() /* + " @ "
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();*/;

            scope.$on('complianceAgentMonitorNow', function (event, result) {
                scope.drawfromqueue(result.qid);
            });

            scope.$on('complianceRefreshQueue', function (event, result) {
                scope.refreshqueue();
            });

            scope.agentLocked = function () {
                return lockedagent;
            }

            scope.agentQueued = function () {
                return nb(scope.form[0].Queue);
            }
            scope.close = function () {
                document.location = "https://ces.acuityapm.com/monitor/monitor_review.aspx";
            }
            scope.clearmonitorfields = function () {
                for (var key in scope.form[0]) {
                    if ((key != "Queue") && (key != "AuditDate")) {
                        scope.form[0][key] = "";
                    }
                }
                scope.records = [];
                scope.records.push({ selectedCategory: 0, selectedSubcategory: 0 });
            }

            scope.deletemonitor = function () {
                if (scope.readonly()) {
                    return;
                }
                if (!scope.existingmonitor()) {
                    return;
                }
                var pass = confirm("Are you sure you want to permanently delete this monitor?");
                if (pass) {
                    api.getJS({
                        lib: "qa",
                        cmd: "deleteComplianceMonitor",
                        id: scope.startupMonitorID
                    }).then(function (json) {
                        scope.$apply(function () {
                            if (scope.existingmonitor()) { //Always close here for now.
                                document.location = "https://ces.acuityapm.com/monitor/monitor_review.aspx";
                            }
                            else {
                                scope.refreshqueue();
                                scope.inmonitor = false;
                                scope.clearmonitorfields();
                                lockedagent = false;
                            }
                        });
                    });
                }
            }

            scope.save = function () {
                var pass = true;
                if (!scope.vs_rowcomplete()) {
                    pass = confirm("Save this Compliance Monitor with NO VIOLATIONS?");
                }
                if (pass) {

                    //Records need cleaned up before sending.
                    var recs = [];
                    for (var i in scope.records) {
                        if ((scope.records[i].selectedCategory != "0") && (scope.records[i].selectedSubcategory != "0")) {
                            var comments = "";
                            if (a$.exists(scope.records[i].Comments)) {
                                comments = scope.records[i].Comments;
                            }
                            recs.push({ selectedCategory: scope.records[i].selectedCategory, selectedSubcategory: scope.records[i].selectedSubcategory, Comments: comments });
                        }
                    }
                    var cmd = "saveComplianceMonitor";
                    if (scope.existingmonitor()) {
                        cmd = "updateComplianceMonitor"
                    }

                    //TODO: Fix this, the problem is in dynamic-ui
                    //scope.form[0].CallDate = $(".bad-ng-calldate").val();
                    //scope.form[0].CallTime = $(".bad-ng-calltime").val();

                    api.getJS({
                        lib: "qa",
                        cmd: cmd, //TODO: Can split out into separate calls.
                        form: scope.form[0],
                        recs: recs,
                        /* records: scope.records, //TODO: Something is wrong here, causing a 404 */
                        points: scope.totalPoints(),
                        deduction: scope.totalDeduction(),
                        id: scope.startupMonitorID //Is only used on update.
                    }).then(function (json) {
                        scope.$apply(function () {
                            if (scope.existingmonitor()) { //Always close here for now.
                                document.location = "https://ces.acuityapm.com/monitor/monitor_review.aspx";
                            }
                            else {
                                scope.refreshqueue();
                                scope.inmonitor = false;
                                scope.clearmonitorfields();
                                lockedagent = false;
                            }
                        });
                    });



                    //TODO: Get someonme else from the queue?  Maybe not.
                }
            }
            scope.form[0].Complaint = "";
            scope.complaintFiled = function () {
                return scope.form[0].Complaint != "";
            }

            scope.changeAgent = function () {
                if (a$.exists(scope.userlist)) {
                    for (var u in scope.userlist) {
                        if (scope.userlist[u].user_id == scope.form[0].Agent) {
                            if (scope.userlist[u].spvr_name != "") {
                                scope.form[0].Supervisor = scope.userlist[u].spvr_user_id;
                            }
                            if (scope.userlist[u].group_name != "") {
                                scope.form[0].Group = scope.userlist[u].group_name;
                            }
                            break;
                        }
                    }
                }
            }

            var ag = [];

            scope.vs_selected = function (idx) {
                if (!a$.exists(ag[idx])) {
                    ag.push(false);
                }
                var vs = (scope.records[idx].selectedCategory != "0" && scope.records[idx].selectedSubcategory != "0" && scope.records[idx].selectedSubcategory != "noshow");
                if (vs) {
                    if (!ag[idx]) {
                        if (scope.records[idx].Comments != "") {
                            $("textarea").autogrow();
                            ag[idx] = true;
                        }
                    }
                }
                return vs;
            }

            scope.vs_complete = function () { //Returns true if all rows are complete.
                var complete = true;
                for (var i in scope.records) {
                    if (!scope.vs_selected(i)) {
                        complete = false;
                        break;
                    }
                }
                return complete;
            }

            scope.vs_readytosave = function () {
                return (nb(scope.form[0].Agent) &&
                    nb(scope.form[0].Directory) &&
                    nb(scope.form[0].AccountNumber) &&
                    nb(scope.form[0].AuditDate) &&
                    nb(scope.form[0].CallID) &&
                    nb(scope.form[0].CallDate) &&
                    nb(scope.form[0].CallTime)
                    );
            }

            scope.vs_rowcomplete = function () { //Returns true if at least one row is complete.
                var complete = false;
                for (var i in scope.records) {
                    if (scope.vs_selected(i)) {
                        complete = true;
                        break;
                    }
                }
                return complete;
            }

            scope.addrow = function () {
                scope.records.push({ selectedCategory: 0, selectedSubcategory: 0 });
            }

            scope.totalPoints = function () {
                var total = 0.0;
                for (var r in scope.records) {
                    if (scope.vs_selected(r)) {
                        if (a$.exists(scope.records[r].PointLevel)) {
                            if (scope.records[r].PointLevel > total) {
                                total = scope.records[r].PointLevel;
                            }
                        }
                    }
                }
                return total;
            }

            scope.totalDeduction = function () {
                var total = 0.0;
                for (var r in scope.records) {
                    if (scope.vs_selected(r)) {
                        if (a$.exists(scope.records[r].DeductionPercentage)) {
                            if (scope.records[r].DeductionPercentage > total) {
                                total = scope.records[r].DeductionPercentage;
                            }
                        }
                    }
                }
                return total;
            }
            function carryfields(idx) {
                if (scope.vs_selected(idx)) {
                    for (var i in scope.violations) {
                        for (var j in scope.violations[i].Subcategories) {
                            if ((scope.violations[i].id == scope.records[idx].selectedCategory) && (scope.violations[i].Subcategories[j].id == scope.records[idx].selectedSubcategory)) {
                                scope.records[idx].Reference = scope.violations[i].Subcategories[j].Reference;
                                scope.records[idx].Risk = scope.violations[i].Subcategories[j].Risk;
                                scope.records[idx].Type = scope.violations[i].Subcategories[j].Type;
                                scope.records[idx].PointLevel = scope.violations[i].Subcategories[j].PointLevel;
                                scope.records[idx].DeductionPercentage = scope.violations[i].Subcategories[j].DeductionPercentage;
                                break;
                            }
                        }
                    }
                }
            }
            scope.changeCategory = function (idx) {
                if (scope.records[idx].selectedCategory == 0) {
                    scope.records[idx].selectedSubcategory = "noshow";
                    scope.subcategories[idx] = [];
                }
                else {
                    scope.records[idx].selectedSubcategory = "0";
                    for (var i in scope.violations) {
                        if (scope.violations[i].id == scope.records[idx].selectedCategory) {
                            scope.records[idx].subcategories = scope.violations[i].Subcategories;
                            break;
                        }
                    }

                }
            }
            scope.changeSubcategory = function (idx) {
                carryfields(idx);
            }
            return; //Below is for reference.
        }
    }
} ]);

angularApp.directive("ngComplianceComplaint", ['compliance', 'api', '$rootScope', function (compliance, api, $rootScope) {
    return {
        templateUrl: "../applib/html/directives/compliance/complaint.htm",
        scope: {
            who: "@"
        },
        require: '^ngLegacyContainer',
        link: function (scope, element, attrs, legacyContainer) {
            scope.credentials = [];
            scope.credentialed = function () {
                var c = false;
                var trigger = false;
                for (var i in scope.credentials) {
                    if (scope.credentials[i] == "Compliance Auditor") {
                        trigger = true;
                        c = true;
                        for (j in scope.credentials) {
                            if ((scope.credentials[i] == "self") || (scope.credentials[i] == "supervisor")) {
                                trigger = false;
                            }
                        }
                    }
                }
                if (a$.gup("prtuid")!="") {
                    c = false; //No compliance system in popups, at least for now.
                }
                if (c) {
                    $(".compliance-complaint-link").show();  //Tabs are outside of ng.
                }
                else {
                    $(".compliance-complaint-link").hide();  //Tabs are outside of ng.
                }
                if (trigger && compliance.startup) {
                    $("#complainttab").trigger("click"); //smh
                    compliance.startup = false;
                }
                return c;
            }

            $(".compliance-complaint-link").hide();  //Tabs are outside of ng.

            scope.form = [];
            scope.form.push({});

            compliance.getLists().then(function (json) {
                scope.$apply(function () {
                    scope.projectlist = json.projectlist;
                    scope.userlist = json.userlist;
                    scope.violations = json.violations;
                    //TODO: Fill in records from saved data (if there's a call id/agent or if it's a review.
                    //If new record:
                    scope.records = [{ selectedCategory: 0, selectedSubcategory: 0}];
                    scope.credentials = json.credentials;
                });
            });
            scope.agentSelected = function () {
                return (nb(scope.form[0].Agent) &&
                    nb(scope.form[0].Complaint) &&
                    nb(scope.form[0].Directory) &&
                    nb(scope.form[0].AccountNumber) &&
                    nb(scope.form[0].Complaintdate)
                    );
            }

            var currentdate = new Date();
            scope.form[0].Complaintdate = (currentdate.getMonth() + 1) + "/"
                + currentdate.getDate() + "/"
                + currentdate.getFullYear() /* + " @ "
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();*/;

            scope.changeAgent = function () {
                if (a$.exists(scope.userlist)) {
                    for (var u in scope.userlist) {
                        if (scope.userlist[u].user_id == scope.form[0].Agent) {
                            if (scope.userlist[u].spvr_name != "") {
                                scope.form[0].Supervisor = scope.userlist[u].spvr_user_id;
                            }
                            if (scope.userlist[u].group_name != "") {
                                scope.form[0].Group = scope.userlist[u].group_name;
                            }
                            break;
                        }
                    }
                }
            }

            scope.queueagent = function (monitornow) {
                api.getJS({
                    lib: "qa",
                    cmd: "saveAndQueueComplaint", //TODO: Can split out into separate calls.
                    form: scope.form[0]
                }).then(function (json) {
                    scope.$apply(function () {
                        if (monitornow) {
                            $rootScope.$broadcast('complianceAgentMonitorNow', {
                                qid: json.qid
                            });
                            $("#monitortab").trigger("click"); //smh
                        }
                        else {
                            $rootScope.$broadcast('complianceRefreshQueue', {
                            });
                        }
                        for (var key in scope.form[0]) {
                            switch (key) {
                                case "Project":
                                    scope.form[0][key] = "select";
                                    break;
                                case "Complaintdate":
                                    break;
                                default:
                                    scope.form[0][key] = "";
                                    break;
                            }
                        }
                        //scope.refreshCallID();
                    });
                });
            };
        }
    }
} ]);

angularApp.directive("ngComplianceSetup", ['compliance', function (compliance) {
    return {
        templateUrl: "../applib/html/directives/compliance/setup.htm",
        scope: {
            who: "@"
        },
        require: '^ngLegacyContainer',
        link: function (scope, element, attrs, legacyContainer) {
            scope.credentials = [];
            scope.credentialed = function () {
                var c = false;
                var trigger = false;
                for (var i in scope.credentials) {
                    if (scope.credentials[i] == "Compliance Manager") {
                        trigger = true;
                        c = true;
                        for (j in scope.credentials) {
                            if ((scope.credentials[i] == "self") || (scope.credentials[i] == "supervisor")) {
                                trigger = false;
                            }
                        }
                    }
                }
                if (a$.gup("prtuid") != "") {
                    c = false; //No compliance system in popups, at least for now.
                }
                if (c) {
                    $(".compliance-setup-link").show();  //Tabs are outside of ng.
                }
                else {
                    $(".compliance-setup-link").hide();  //Tabs are outside of ng.
                }
                if (trigger && compliance.startup) {
                    $("#setuptab").trigger("click"); //smh
                    compliance.startup = false;
                }
                return c;
            }
            compliance.getLists().then(function (json) {
                scope.$apply(function () {
                    //scope.projectlist = json.projectlist;
                    //scope.userlist = json.userlist;
                    scope.violations = json.violations;
                    //scope.FACSID = json.FACSID;
                    //TODO: Fill in records from saved data (if there's a call id/agent or if it's a review.
                    //If new record:
                    //scope.records = [{ selectedCategory: 0, selectedSubcategory: 0}];
                    scope.credentials = json.credentials;
                });
            });

            scope.form = [];
            scope.form.push({});

            scope.changeCategory = function () {
                if (scope.form[0].selectedCategory == 0) {
                    scope.form[0].selectedSubcategory = "noshow";
                    scope.subcategories = [];
                }
                else {
                    scope.form[0].selectedSubcategory = "0";
                    for (var i in scope.violations) {
                        if (scope.violations[i].id == scope.form[0].selectedCategory) {
                            scope.form[0].subcategories = scope.violations[i].Subcategories;
                            break;
                        }
                    }

                }
            }
            scope.changeSubcategory = function () {
                alert("debug:display subcategory fields..");
            }

            return;
        }
    }
} ]);

