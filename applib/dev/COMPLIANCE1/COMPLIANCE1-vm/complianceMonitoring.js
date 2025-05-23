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
                    me.clientlist = json.clientlist;
                    me.violations = json.violations;
                    me.FACSID = json.FACSID;
                    me.credentials = json.credentials;
                    me.startupMonitorID = json.startupMonitorID;
                    me.ack_requestsent_date = json.ack_requestsent_date;
                    me.ack_acknowledged_date = json.ack_acknowledged_date;
                    me.ackRequired = json.ackRequired;
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
        templateUrl: "../applib/dev/COMPLIANCE1/COMPLIANCE1-view/monitor.htm?" + Date.now(),
        scope: {
            who: "@"
        },
        require: '^ngLegacyContainer',
        link: function (scope, element, attrs, legacyContainer) {
        		scope.closetext="Close Window";
            scope.isreadonly = false;
            scope.cb={};
						scope.cb.checkHoldAcknowledgement = false;
						scope.cb.checkAcknowledgementResend = false;

						scope.setCheckHoldAcknowledgement = function() {
							var i = scope.cb.checkHoldAcknowledgement;							
						}

						scope.setCheckAcknowledgementResend = function() {
							var i = scope.cb.checkAcknowledgementResend;
						}

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
            
            //************  Heavy-handed acknowledgement request system.

						//Don't send initial acknowledgement
						//scope.cb.checkHoldAcknowledgement

            //Resend Achnowledgement:
            //scope.cb.checkAcknowledgementResend
                        
            scope.ack_requestsent = function() {
            	return scope.ack_requestsent_date != "";
            }
            
            scope.ack_acknowledged = function() {
            	return scope.ack_acknowledged_date != "";
            }
            
            //***************************

            lockedagent = false;

            scope.form = [];
            scope.form.push({});

            scope.queue = [];

            compliance.getLists().then(function (json) {
                scope.$apply(function () {
                    scope.projectlist = json.projectlist;
                    scope.userlist = json.userlist;
                    scope.clientlist = json.clientlist;
                    scope.violations = json.violations;
                    scope.FACSID = json.FACSID;
                    //TODO: Fill in records from saved data (if there's a call id/agent or if it's a review.
                    //If new record:
                    scope.records = [{ selectedCategory: 0, selectedSubcategory: 0}];
                    scope.credentials = json.credentials;
                    scope.startupMonitorID = json.startupMonitorID; //This window will always deal with only this monitor.
                    scope.ack_requestsent_date = json.ack_requestsent_date;
                    scope.ack_acknowledged_date = json.ack_acknowledged_date;
                    scope.ackRequired = json.ackRequired;
                    if (json.startupMonitorID != "") {
                        loadmonitor(json.startupMonitorID);
                        if (json.ackRequired) {
                        	scope.closetext="ACKNOWLEDGE Monitor";
                        }
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
                                scope.form[0][key] = json.form[key];
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
                                        scope.changeCategory(i, true);
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
            
            scope.clientchange = function() {
            	scope.form[0].Group = scope.form[0].clientselection;
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
                        		scope.form[0].Supervisor = "";
                            for (var e in json.entry) {
                                if (e == "Agent") {
                                    for (var u in scope.userlist) {
                                        if (scope.userlist[u].user_id == json.entry.Agent) {
                                            scope.form[0].Project = "" + scope.userlist[u].projectid;
                                            scope.form[0].Supervisor = "" + scope.userlist[u].spvr_user_id;
                                        }
                                    }
                                }
                                if (e != "Supervisor") {
                                	if (json.entry[e] != null) {
                                  	scope.form[0][e] = json.entry[e];
                                	}
                                	else {
                                  	scope.form[0][e] = "";
                                	}
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
            		if (scope.ackRequired) {
                	api.getJS({
                    lib: "qa",
                    cmd: "acknowledgeComplianceMonitor",
                    monitorid: scope.startupMonitorID
                	}).then(function (json) {
                		if (!json.success) {
                			alert("Acknowledgement failed.")
                		}
                		else {
			                document.location = "https://ces.acuityapm.com/monitor/monitor_review.aspx";
                		}
                	});
            		}
            		else {
	               document.location = "https://ces.acuityapm.com/monitor/monitor_review.aspx";            			
            		}
            }
            scope.clearmonitorfields = function () {
                for (var key in scope.form[0]) {
                    if ((key != "Queue") && (key != "AuditDate")) {
                        scope.form[0][key] = "";
                    }
                    if (key == "CallTime") {
	                    //Slam the var into the timepicker control (just as an experimental step).
                      $(".bad-ng-calltime").children().eq(1).val(scope.form[0][key]);
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
                var acknowledgement = true;
                if (!scope.existingmonitor()) {
                	if (!scope.vs_rowcomplete()) {
                    pass = confirm("Save this Compliance Monitor with NO VIOLATIONS?");
                	}
                }
                
                if (pass) {
                	var str = scope.form[0].CallTime;
                	var res = str.match(/\b((1[0-2]|0?[1-9]):([0-5][0-9]) ([AaPp][Mm]))/i);
                	if (res == null) {
                		alert("Time value must be of the format: 04:52 PM");
                		pass = false;
                	}
                }
                if (pass) {
                		if (!scope.existingmonitor()) {
                			acknowledgement = true; //default
                	  	if (scope.cb.checkHoldAcknowledgement) {
                	  		acknowledgement = false;
                	  	}
                	  	else {
                  			if (scope.totalDeduction() == 0) {
	                				if (!confirm("There were no deductions.\nDo you still want a Monitor Acknowledgement message sent to this agent?")) {
                   					acknowledgement = false;
                   				}
                   			}
                   		}
                   	}
                   	else { //Update
                   		acknowledgement = false; //default (already acknowledged)
                   		if (scope.cb.checkAcknowledgementResend) {
                   			acknowledgement = true;
                   		}
                   	}

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

                    api.postJS({
                        lib: "qa",
                        cmd: cmd, //TODO: Can split out into separate calls.
                        form: scope.form[0],
                        recs: recs,
                        /* records: scope.records, //TODO: Something is wrong here, causing a 404 */
                        points: scope.totalPoints(),
                        deduction: scope.totalDeduction(),
                        acknowledgement: acknowledgement,
                        id: scope.startupMonitorID //Is only used on update.
                    }).then(function (json) {
                        //Added to fish for a save error.
                        var myerr = false;
                        if (a$.exists(json.msg)) {
                            if (json.msg != "") {
                                alert("MONITOR NOT SAVED, PLEASE CLICK SAVE AGAIN!\nTraceback: (please send screenshot to Jeff Gack): " + json.msg);
                                myerr = true;
                            }
                        }
                        if (!myerr) {
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
                        }
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
                    nb(scope.form[0].GroupAccountNumber) &&
                    nb(scope.form[0].Supervisor) &&
                    nb(scope.form[0].CallDuration) &&
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
            function carryfields(idx, initialload) {
                if (scope.vs_selected(idx)) {
                    for (var i in scope.violations) {
                        for (var j in scope.violations[i].Subcategories) {
                            if ((scope.violations[i].id == scope.records[idx].selectedCategory) && (scope.violations[i].Subcategories[j].id == scope.records[idx].selectedSubcategory)) {
			    	                 		if (scope.violations[i].Subcategories[j].deprecated) {
				    	               			if ((!initialload) && (!scope.readonly())) {
  				    	             				alert("Warning - you are choosing a violation subcategory that has been deleted (but preserved for modificatons purposes).\nPlease choose an active violation if an appropriate one is available.");
      			    	           			}
        			    	         		}
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
            scope.changeCategory = function (idx,initialload) {
                if (scope.records[idx].selectedCategory == 0) {
                    scope.records[idx].selectedSubcategory = "noshow";
                    scope.subcategories[idx] = [];
                }
                else {
                    scope.records[idx].selectedSubcategory = "0";
                    for (var i in scope.violations) {
                        if (scope.violations[i].id == scope.records[idx].selectedCategory) {
	                     		if (scope.violations[i].deprecated) {
		                   			if ((!initialload) && (!scope.readonly())) {
  		                 				alert("Warning - you are choosing a violation category that has been deleted (but preserved for modificatons purposes).\nPlease choose an active violation if an appropriate one is available.");
      	               			}
        	             		}
                          scope.records[idx].subcategories = scope.violations[i].Subcategories;
                          break;
                        }
                    }

                }
            }
            scope.changeSubcategory = function (idx,initialload) {
                carryfields(idx,initialload);
            }
            return; //Below is for reference.
        }
    }
} ]);

angularApp.directive("ngComplianceComplaint", ['compliance', 'api', '$rootScope', function (compliance, api, $rootScope) {
    return {
        templateUrl: "../applib/dev/COMPLIANCE1/COMPLIANCE1-view/complaint.htm?" + Date.now(),
        scope: {
            who: "@"
        },
        require: '^ngLegacyContainer',
        link: function (scope, element, attrs, legacyContainer) {
            scope.credentials = [];
            scope.credentialed = function () {
                var c = false;
                var trigger = false;
                //Put out an alert if this person has no compliance-related credentials.                
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
                    scope.clientlist = json.clientlist;
                    scope.violations = json.violations;
                    //TODO: Fill in records from saved data (if there's a call id/agent or if it's a review.
                    //If new record:
                    scope.records = [{ selectedCategory: 0, selectedSubcategory: 0}];
                    scope.credentials = json.credentials;
                    
		                var complianceauditor = false;
    		            var compliancemanager = false;
        		        for (var i in scope.credentials) {
            		        if (scope.credentials[i] == "Compliance Auditor") {
                		    	complianceauditor = true;
                  			}
                  			else if (scope.credentials[i] == "Compliance Manager") {
                    			compliancemanager = true;
                    		}
                		}
                		if ((!complianceauditor) && (!compliancemanager) && (a$.gup("prtuid") == "")) {
                			$(".compliance-noaccess-message").show();
                		}
                		else {
											$(".compliance-noaccess-message").hide();
                		}
                		
                });
            });

            scope.agentSelected = function () {
                return (nb(scope.form[0].Agent) &&
                    nb(scope.form[0].Supervisor) &&
                    nb(scope.form[0].Complaint) &&
                    nb(scope.form[0].Directory) &&
                    nb(scope.form[0].AccountNumber) &&
                    nb(scope.form[0].GroupAccountNumber) &&
                    nb(scope.form[0].Complaintdate)
                    );
            }

            scope.clientchange = function() {
            	scope.form[0].Group = scope.form[0].clientselection;
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
                api.postJS({
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

angularApp.directive("ngComplianceSetup", ['compliance', 'api', function (compliance, api) {
    return {
        templateUrl: "../applib/dev/COMPLIANCE1/COMPLIANCE1-view/setup.htm?" + Date.now(),
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
                    if (scope.violations.length) {
	                    scope.form[0].selectedCategory = scope.violations[0].id;	                    
                    	scope.changeCategory();
                    }
                    //scope.FACSID = json.FACSID;
                    //TODO: Fill in records from saved data (if there's a call id/agent or if it's a review.
                    //If new record:
                    //scope.records = [{ selectedCategory: 0, selectedSubcategory: 0}];
                    scope.credentials = json.credentials;
                });
            });

            scope.form = [];
            scope.form.push({});
            scope.form[0].selectedCategoryText = "";
            scope.form[0].selectedSubcategoryText = "";

            scope.differentCategory = function(blankissame) {
            	var sct = scope.form[0].selectedCategoryText;
            	if (blankissame) {
            		if (scope.form[0].selectedCategoryText == "") {
            			return false;
            		}
            	}
            	for (var i in scope.violations) {
            		if (scope.violations[i].Category == sct) {
            			return false;
            		}
            	}
            	return true;
            }

            scope.differentSubcategory = function(blankissame) {
            	var sct = scope.form[0].selectedSubcategoryText;
            	if (blankissame) {
            		if (scope.form[0].selectedSubcategoryText == "") {
            			return false;
            		}
            	}
              for (var i in scope.violations) {
	              if (scope.violations[i].id == scope.form[0].selectedCategory) {
  		          	for (var j in scope.violations[i].Subcategories) {
      		      		if (scope.violations[i].Subcategories[j].Subcategory == sct) {
          		  			return false;
            				}
            			}
            		}
            	}
            	return true;
            }

            scope.changeCategory = function () {
                scope.form[0].selectedCategoryText = "";
                if (scope.form[0].selectedCategory == 0) {
                    scope.form[0].selectedSubcategory = "noshow";
                    scope.subcategories = [];
                }
                else {
                    scope.form[0].selectedSubcategory = "0";
		                scope.form[0].selectedSubcategoryText = "";
                    scope.changeSubcategory();
                    for (var i in scope.violations) {
                        if (scope.violations[i].id == scope.form[0].selectedCategory) {
                            scope.form[0].subcategories = scope.violations[i].Subcategories;
				                    scope.form[0].selectedCategoryText = scope.violations[i].Category;
                            break;
                        }
                    }
                }
            }
            
            scope.subfieldsvisible = false;
            scope.freshdif = true;
            scope.showsubfields = function() {
            	var dif = (scope.differentSubcategory(true));
            	if (dif && scope.freshdif) {
						  	scope.form[0].Reference = "";
                scope.form[0].Risk = "";
                scope.form[0].Type = "";
                scope.form[0].PointLevel = 0;
                scope.form[0].DeductionPercentage = 0.0;
                scope.form[0].FocusIssue = "N";
                scope.freshdif = false;                
            	}
            	return scope.subfieldsvisible || dif;
            }

            scope.changeSubcategory = function () {
              scope.form[0].selectedSubcategoryText = "";
            	scope.subfieldsvisible = false;
	            if (scope.form[0].selectedCategory != 0) {
                for (var i in scope.violations) {
   		             if (scope.violations[i].id == scope.form[0].selectedCategory) {   		               
   		               //Only allow this if all subcategories are deprecated.
   		               for (var j in scope.violations[i].Subcategories) {
   		               	 if (scope.violations[i].Subcategories[j].id == scope.form[0].selectedSubcategory) {
   		               	 	 scope.form[0].selectedSubcategoryText = scope.violations[i].Subcategories[j].Subcategory;
											   scope.form[0].Reference = scope.violations[i].Subcategories[j].Reference;
                				 scope.form[0].Risk = scope.violations[i].Subcategories[j].Risk;
                				 scope.form[0].Type = scope.violations[i].Subcategories[j].Type;
                				 scope.form[0].PointLevel = scope.violations[i].Subcategories[j].PointLevel;
                				 scope.form[0].DeductionPercentage = scope.violations[i].Subcategories[j].DeductionPercentage;
                				 scope.form[0].FocusIssue = scope.violations[i].Subcategories[j].FocusIssue;
                				 scope.freshdif = true;
                				 scope.subfieldsvisible = true;
                				 return;
                			 }
                		}
                	}
                }
              }
            }
            
            scope.addCategory = function() {
          		if (confirm("Are you sure you want to add Violation Category: '" + scope.form[0].selectedCategoryText + "'?")) {
 	    					api.getJS({
  	       				lib: "qa",
           				cmd: "complianceAddCategory", 
           				category: scope.form[0].selectedCategoryText
       					}).then(function (json) {
       						window.location.reload(false);
		            });
   	       	  }   		               	    
            	
            }
            
            scope.deleteCategory = function() {
	            if (scope.form[0].selectedCategory != 0) {
                for (var i in scope.violations) {
   		             if (scope.violations[i].id == scope.form[0].selectedCategory) {
   		               //Only allow this if all subcategories are deprecated.
   		               var alldeprecated = true;
   		               for (var j in scope.violations[i].Subcategories) {
   		               	 if (!scope.violations[i].Subcategories[j].deprecated) {
   		               		 alldeprecated = false;
   		               		 break;
   		               	 }
   		               }
 		               	 if (!alldeprecated) {
 		               	 	 alert("You must delete all Sub-Categories in a Violation Category before deleting the Violation Category.");
 		               	 }
 		               	 else {
   		               		if (confirm("Are you sure you want to delete Violation Category: '" + scope.violations[i].Category + "'?")) {
                					api.getJS({
                    				lib: "qa",
                    				cmd: "complianceDeleteCategory", 
                    				id: scope.violations[i].id
                					}).then(function (json) {
                						window.location.reload(false);
						              });
   		               	  }   		               	    
 		               	 }
   		             }
                }	            	
	            }
            }

            scope.deleteSubcategory = function() {
	            if (scope.form[0].selectedCategory != 0) {
                for (var i in scope.violations) {
   		             if (scope.violations[i].id == scope.form[0].selectedCategory) {   		               
   		               for (var j in scope.violations[i].Subcategories) {
   		               	 if (scope.violations[i].Subcategories[j].id == scope.form[0].selectedSubcategory) {
   		               	    if (confirm("Are you sure you want to delete Subcategory: '" + scope.violations[i].Subcategories[j].Subcategory + "'?")) {
                						api.getJS({
                    					lib: "qa",
                    					cmd: "complianceDeleteSubcategory", 
                    					id: scope.violations[i].Subcategories[j].id
                						}).then(function (json) {
                							window.location.reload(false);
						                });
   		               	    }   		               	    
   		               	 }
   		               }
   		             }
                }	            	
	            }
            }
            
            scope.updateSubcategory = function() {
	            if (scope.form[0].selectedCategory != 0) {
                for (var i in scope.violations) {
   		             if (scope.violations[i].id == scope.form[0].selectedCategory) {
   		               for (var j in scope.violations[i].Subcategories) {
   		               	 if (scope.violations[i].Subcategories[j].id == scope.form[0].selectedSubcategory) {
   		               	    if (confirm("Updates will replace an existing subcategory.  Are you sure you want to update Subcategory: '" + scope.violations[i].Subcategories[j].Subcategory + "'?")) {

                                        var f = {};
                                        f.selectedSubcategoryText = scope.form[0].selectedSubcategoryText;
                                        f.Reference=scope.form[0].Reference;
                                        f.Risk=scope.form[0].Risk;
                                        f.Type=scope.form[0].Type;
                                        f.PointLevel=scope.form[0].PointLevel;
                                        f.DeductionPercentage=scope.form[0].DeductionPercentage;
                                        f.FocusIssue=scope.form[0].FocusIssue;

                						api.getJS({
                    					lib: "qa",
                    					cmd: "complianceUpdateSubcategory",
															form: f,
                    					id: scope.violations[i].Subcategories[j].id
                						}).then(function (json) {
                							window.location.reload(false);
						                });
   		               	    }   		               	    
   		               	 }
   		               }
   		             }
                }	            	
	            }
            }

            scope.addSubcategory = function() {
	            if (scope.form[0].selectedCategory != 0) {
                for (var i in scope.violations) {
   		             if (scope.violations[i].id == scope.form[0].selectedCategory) {
             	       if (confirm("Are you sure you want to add the Violation Subcategory '" + scope.form[0].selectedSubcategoryText + "'?")) {
                        var f = {};
                        f.selectedSubcategoryText = scope.form[0].selectedSubcategoryText;
                        f.Reference=scope.form[0].Reference;
                        f.Risk=scope.form[0].Risk;
                        f.Type=scope.form[0].Type;
                        f.PointLevel=scope.form[0].PointLevel;
                        f.DeductionPercentage=scope.form[0].DeductionPercentage;
                        f.FocusIssue=scope.form[0].FocusIssue;
         			    api.getJS({
                    	   lib: "qa",
                    		 cmd: "complianceAddSubcategory",
                    		 idcategory: scope.violations[i].id,
												 form: f,
                			 }).then(function (json) {
                			   window.location.reload(false);
						 });
   		               }
   		             }
                }	            	
	            }
            }

            return;
        }
    }
} ]);

