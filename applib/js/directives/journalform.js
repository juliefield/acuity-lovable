var compare_vals = function(a,b) {
    return a === b ? true : false;
}
angularApp.directive("ngFormList", ['api', '$log', '$filter', function (api, $log, $filter) {
    return {
        // template: '<ul><li ng-repeat="r in csrs | orderBy:\'lastnm\'">{{r.lastnm}}, {{r.firstnm}} ({{r.uid}})</li></ul>',
        templateUrl: a$.debugPrefix() + "/applib/html/directives/journal-agent.htm",
        $scope: {
            text: "@"
        },
        require: '^ngLegacyContainer',
        link: function ($scope, element, attrs, legacyContainer) {
            // Set variables from URL string  
            $scope.url = ({
                // team: a$.gup("Team")
                team: $.cookie("Team")
            });
            //
            // getME: csrs
            //
            api.getMe({
                who: "TEAM",
                Team: $scope.url.team,
                members: ["csrs"]
            }).then(function (json) {
                $scope.$evalAsync(function () {
                    if (a$.exists(json.me.csrs) && ($scope.url.team)) {
                        $scope.csrs = $filter('filter')(json.me.csrs, {
                            teamid: $scope.url.team
                        });
                    } else {
                        $scope.csrs = $filter('filter')(json.me.csrs, {
                            myteam: 'Y'
                        });
                    }
                    
                    $scope.load_journal_agent = function (csr) {
                        var g = encodeURI("https://chime-v3-dev.acuityapm.com/3/Touchpointauthentication.aspx?url=../3/JournalForm.aspx&CSR=" + csr + "&Team=" + $.cookie("Team") + "&username=" + $.cookie("TP1Username") + "&uid=" + $.cookie("uid") + "&role=" + $.cookie("TP1Role") + "&roleset=&project=1");

                        // var g = "https://chime-v3-dev-chris.acuityapm.com/3/Touchpointauthentication.aspx?url=../3/JournalForm.aspx?username=" + $.cookie("TP1Username") + "&uid=" + $.cookie("uid") + "&role=" + $.cookie("TP1Role") + "&roleset=&project=1&CSR=" + csr + "&Team=" + $.cookie("Team") + "";

                        // var g = "https://chime-v3-dev.acuityapm.com/3/Touchpointauthentication.aspx?url=../3/JournalForm.aspx|CSR=" + $.cookie("CSR") + "~Team=" + $.cookie("Team") + "&username=" + $.cookie("TP1Username") + "&uid=" + $.cookie("uid") + "&role=" + $.cookie("TP1Role") + "&roleset=&project=1";

                        window.location = g;
                    }
                });
            });
        }
    }
}]);

angularApp.directive("ngFormJournal", ['api', '$log', '$filter', '$compile', function (api, $log, $filter, $compile) {
    return {
        templateUrl:
            (window.location.toString().toLowerCase().indexOf("bgr-v3.") >= 0) ?
                a$.debugPrefix() + "/applib/dev/FORMS1/FORMS1-view/journalformBGR.htm?" + Date.now() :
                a$.debugPrefix() + "/applib/dev/FORMS1/FORMS1-view/journalform.htm?" + Date.now()
        , //TODO: Remove date for production?
        scope: {
            dataview: "@",
            edit: "@",
            id: "@",
            recordid: "@",
            userid: "@",
            popup: "@",
            multiuser: "@",
            onUpdateRecord: "&" //These do nothing, but this is how I think they work (something is missing in the middle).
        },
        require: '^ngLegacyContainer',
        link: function (scope, element, attrs, legacyContainer) {
            scope.reasons = [];
            scope.current_reason = {};
            scope.freeform = ($(scope.$parent.elementhold).prop("tagName") != "NG-TABLE-EDITOR");

            $(".clugue-date-floating").click(function() {
                $("#ui-datepicker-div").hide();
            });
            $(".clugue-date-floating").on("focus", function() {
                $("#ui-datepicker-div").hide();
            });
            if (!a$.exists(scope.popup)) {
                $(" .form-popup", element).removeClass();
            }

            if (scope.multiuser == "true") {
                //alert("debug: in form, multiuser is true");
                scope.multiuserlabel="Multi User ";
            }

            function GetUserFullName(returnType)
            {
                if(returnType == null)
                {
                    returnType = "LastFirst";
                }
                let returnValue = legacyContainer.scope.TP1Username || a$.cookie("username");
                let currentUserName = legacyContainer.scope.TP1Username || a$.cookie("username");
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "userprofile",
                        cmd: "getUserData",
                        userid: currentUserName
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (jsonData) {
                        let userProfile = JSON.parse(jsonData.userobject);
                        if(userProfile != null)
                        {
                            switch(returnType)
                            {
                                case "FirstLast":
                                    returnValue = userProfile.FirstName + ' ' + userProfile.LastName;
                                    break;
                                default:
                                    returnValue =  userProfile.LastName + ', ' + userProfile.FirstName;
                                    break;
                            }    
                        }
                        try {
                            scope.f["DeliveredBy"] = returnValue;
                        } catch (e) {
                        }
                    }
                });

                //return returnValue;
            }


            if (a$.urlprefix() == "collective-solution.") {
                $(".hack-DetailsIssues-Label").html("Areas of Opportunity");
                $(".hack-ResolutionFollowup-Label").html("Coaching Action Plan (SMART)");
                $(".full-textbox").hide();
                $(".cs-smart").show();
                $(".hack-AreasOfSuccess-Show").show();
                $(".hack-SalesforceCaseNumber-Show").show(); //Contact Information
                $(".hack-CoachingType-Show").show();
                $(".hack-Behavior-Show").show();
                $("textarea").prop('required',true);
                //$(".hack-CoachingParentID-Show").show();
            }
            if (a$.urlprefix() == "km2.") {
                $(".hack-DetailsIssues-Label").html("Coaching Notes - Including Agreed Actions (Line Manager)");
                $(".hack-ResolutionFollowup-Label").html("Coaching Feedback (Team Member)");
            }
            if (a$.urlprefix() == "walgreens.") {
                $(".hack-SetGoal-Label").html("Areas of Opportunity");
                $(".hack-Goal-Label").html("PPGA");
            }
            if ((a$.urlprefix() == "chime.") || (a$.urlprefix() == "km2.")) {
                $(".hack-Chime-ShowPII").show();
            }
            if (a$.exists(scope.userid)) {
                if (scope.userid.toString().toLowerCase() == $.cookie("username").toString().toLowerCase()) {
                    $("input",element).attr("disabled","disabled");
                    //alert("debug:readonly form 434");
                    //
                    if ( (a$.urlprefix(true).indexOf("mnt") == 0) || (a$.urlprefix(true).indexOf("alpha") == 0) ) {
                        if ((a$.urlprefix() == "collective-solution.")||(a$.urlprefix() == "ultracx.")) {
                            scope.onlyhuddle = true;
                        }
                        else {
                            scope.readonly = true;
                        }
                    }
                    else {
                        if (a$.urlprefix() == "ultracx.") {
                            scope.onlyhuddle = true;
                        }
                        else {
                            scope.readonly = true;
                        }
                    }
                }
            }

            scope.showcal = function (val) {
                if (val == "Yes") $(".cal-wrapper").show();
                else $(".cal-wrapper").hide();
            }

            $(".ac-cal").on("click", function() {
                //If there's insufficient data to create a calendar entry, intercept it here.
                //alert("test: follow-up date = " + scope.f_selected.follow_up_date);
                if (scope.f_selected.follow_up_date == "") {
                    $("#follow_up_date", element).css("border","3px solid red");
                    alert("Please provide a follow-up date");
                    return false;
                }
                a$.showCalendarMenu(
                    this,           //Element for position.
                    function() {    //Callback for values
                        return {
                            title: scope.f_selected.Reason + ' Review',
                            //location: 'The Bar, New York, NY',
                            description: scope.f_selected.DetailsIssues,
                            start: new Date(scope.f_selected.follow_up_date),
                            // end: new Date(scope.f_selected.follow_up_date),
                            duration: {
                                days: 1
                            }
                    }                    
                },
                $(this).offset().top,$(this).offset().left);
            });

            if ((a$.urlprefix() == "km2.") || (a$.urlprefix() == "collective-solution.") || (a$.urlprefix(true).indexOf("mnt") == 0)) {
                $(".printicon", element).bind("click", function() {
                    window.print();
                    return false;
                });
            }
            else {
                $(".printicon", element).hide();
            }

            $(".clugue-date-floating", element).bind("click", function () {
                //This clugue assumes the body tag has an id of Body1.
                //It did NOT work any other way.
                //$log.log("debug: scrolly7=" + $("#Body1").scrollTop());
                //$log.log("debug: clicked date field, top=" + $(this).offset().top + ", scrolltop=" + ($(this).offset().top - $("#Body1").scrollTop()) + ", left=" + $(this).offset().left);
                //$log.log("debug: 2 ui date picker top=" + $("#ui-datepicker-div").eq(0).css("top") + ", left=" + $("#ui-datepicker-div").eq(0).css("left"));
                if ($("#Body1").length > 0) {
                    if (($(this).attr("ng-model") == "f_selected.DateClosed") ||
            		   ($(this).attr("ng-model") == "f_selected.goal_date") ||
            		   ($(this).attr("ng-model") == "f_selected.follow_up_date")) {
                        $("#ui-datepicker-div").eq(0).css("top", (($(this).offset().top - $("#Body1").scrollTop()) - 215) + "px");
                    }
                    else {
                        $("#ui-datepicker-div").eq(0).css("top", (($(this).offset().top - $("#Body1").scrollTop()) + 30) + "px");
                    }
                }
            });

            //if (window.location.toString().toLowerCase().indexOf("-mnt") >= 0 || window.location.toString().toLowerCase().indexOf("-dev") >= 0) {

            //TODO: Move all of this into dynamicui (in prep for creating sidekick_reasons).
            if (($.cookie("TP1Role") == "Admin") && ((a$.urlprefix() == "veyo.") || (a$.urlprefix() == "mtm."))) {
                scope.journal_reason = ["Coaching", "Recognition", "Call Monitor", "General", "Performance Review"];
            }
            else if (a$.gup("demo") == "1") { //Passing demo as a parameter for -mnt sites.
                scope.journal_reason = ["Side-by-Side_NEVER_USE", "Coaching", "Recognition", "Call Monitor"/*,"Goal-setting","Performance Review" */];
            } else {
                scope.journal_reason = ["Coaching", "Recognition", "Call Monitor", "General"/*,"Goal-setting","Performance Review" */];
            }

            /*
            //Remove "Performance Review" from the live pilot for now.
            if (window.location.toString().toLowerCase().indexOf("//ers") >= 0) {
            scope.journal_reason.pop(); //Removes last entry (Performance Review)
            }
            */

            if (scope.freeform) {
                scope.recordid = -1; //This shouldn't be necessary, I should bypass all uses for recordid if freeform.
            }
            else {
                if (a$.exists(scope.id) && (scope.id != "")) {
                    if (a$.exists(scope.$parent.table.records)) {
                        var found = false;
                        for (var r in scope.$parent.table.records) {
                            if (scope.$parent.table.records[r].id == scope.id) {
                                scope.recordid = r;
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            $log.log("Record not found.");
                        }
                    }
                    else {
                        //Editing an existing record by id, retrieve the record from the server.
                        $log.log("TODO: Retrieve directly from server into form.");

                    }
                }
            }

            scope.doit = function () {

            scope.newJournalFlag = false;
            if (a$.exists(scope.recordid) && (scope.recordid != "")) {
                //Editing a record that belongs to my parent (ng-table-editor)
                //scope.f = Object.assign({}, scope.$parent.table.records[rec]); //Not supported by IE :(
                if (!scope.freeform) { //If freeform, this info was retrieve from the server.
                    var rec = parseInt(scope.recordid, 10);
                    scope.f = {};
                    for (var k in scope.$parent.table.records[rec]) {
                        scope.f[k] = scope.$parent.table.records[rec][k];
                    }
                }
                //For Greg's Demo - not getting here and need to cut and run.
                if (a$.exists(scope.f["Reason"])) {
                    $("select", $(".clugue-for-reason").parent()).val(scope.f["Reason"]);
                }
                //2021-09-20 - If the reason code isn't in the list, then add it, select it, disable the field.
                if (a$.exists(scope.f["Reason"])) {                    
                    var foundreason = false;
                    for (var r in scope.journal_reason) {
                        if (scope.journal_reason[r] == scope.f["Reason"]) {
                            foundreason = true;
                            break;
                        }
                    }
                    if (!foundreason) {
                        var holdname = scope.f["Reason"];

                        //UPDATE FIX 2022-01-04 - This fixes the general case of reason codes which aren't in the original set (keeps from changing reason upon update as well).
                        scope.journal_reason = [];
                        scope.journal_reason.push(holdname);

                        //2022-01-04 - This odd timeout seems to be necessary for the KM2 scenario "MonitorLink" scenario.
                        if ((a$.urlprefix() == "km2.") && (
                            (holdname == "AUTO Coaching-QA Scorecard")
                            || (holdname == "AUTO Coaching-Compliance Audit")
                            || (holdname == "AUTO Coaching-QA Scorecard-CA")
                            || (holdname == "AUTO Coaching-Compliance Audit-CA")
                        )) {
                            setTimeout(function () {
                                $("select", $(".clugue-for-reason").parent()).html('<option style="color:red;" value="' + scope.f["Reason"] + '" selected="selected">' + scope.f["Reason"] + '</option>');
                                $("select", $(".clugue-for-reason").parent()).val(holdname);
                            }, 500);
                        }
                    }

                }

                scope.israted = false; //This info is only retrieved for collective-solution.

                if (true) { //(a$.urlprefix == "ers.") {
                    if (a$.exists(scope.f["AreasOfSuccess"])) {
                      $(".contentEditable-AreasOfSuccess").html(scope.f["AreasOfSuccess"]);
                    }
                    if (a$.exists(scope.f["DetailsIssues"])) {
                      $(".contentEditable-DetailsIssues").html(scope.f["DetailsIssues"]);
                    }
                    if (a$.exists(scope.f["ResolutionFollowup"])) {
                      $(".contentEditable-ResolutionFollowup").html(scope.f["ResolutionFollowup"]);
                    }
                }

                //populating Collectve Solution SMART fields
                if (a$.urlprefix() == "collective-solution.") {
                    if (a$.exists(scope.f["ResolutionFollowup"])) {
                        if (scope.f["ResolutionFollowup"].indexOf("|M|") > 0) {
                            // console.log(scope.f["ResolutionFollowup"]);
                            var regex = /[|][SMART][|]/;
                            var smartArr = scope.f["ResolutionFollowup"].split(regex);
                            // console.log(smartArr);
                            $(".cs-smart__s").val(smartArr[1]);
                            $(".cs-smart__m").val(smartArr[2]);
                            $(".cs-smart__a").val(smartArr[3]);
                            $(".cs-smart__r").val(smartArr[4]);
                            $(".cs-smart__t").val(smartArr[5]); 
                        }
                        else {
                            $(".cs-smart__s").val(scope.f["ResolutionFollowup"]); //Entries prior to SMART system get entire resfollowup in the S member.
                        }
                    }

                    // select count(*) as tot from qa_resp qr1 where qr1.idquestion=396 and qr1.client=59 and answertext='160458'; --dis is it
                    a$.ajax({
                      type: "GET",
                      service: "JScript",
                      async: true,
                      data: {
                        lib: "spine",
                        cmd: "IsJournalRated",
                        journalid: scope.f.id
                      },
                      dataType: "json",
                      cache: false,
                      error: a$.ajaxerror,
                      success: function(json) {
                        if (a$.jsonerror(json)) { } else {
                          if (json.israted) {
                            scope.$apply(function () {
                              scope.israted = true;
                              scope.readonly = true;
                              scope.form_disabled = true;
                              $("select",element).attr("disabled","disabled");
                              $("textarea",element).attr("disabled","disabled");
                              $('input[type="text"]').attr("disabled","disabled");
                              $(".jg-notify-agent-wrapper").remove();
                              $(".jg-israted").show();
                              $(".ce-div").attr("contentEditable","false");

                            });
                          }
                        }
                      }
                    });
                }
            }
            else {
                //This is a new record, initialize it (how?)
                scope.newJournalFlag = true;
                scope.f = {}; //TODO: Defaults?
                scope.f["User"] = a$.exists(scope.userid) ? scope.userid : legacyContainer.scope.filters.CSR; //Too much to pull from the systemfield field, I'm in a specific form!
                /*scope.f["DeliveredBy"] = */GetUserFullName();

                $(".clugue-for-reason").hide();
                $(".reason-loading").show();

            }

            if (true) { //(a$.urlprefix == "ers.") {
               $(".hack-AreasOfSuccess").hide();
               $(".contentEditable-AreasOfSuccess").unbind("input").bind("input", function() {
                   $(".hack-AreasOfSuccess").val($(this).html()).trigger("change");
               });

               $(".hack-DetailsIssues").hide();
               $(".contentEditable-DetailsIssues").unbind("input").bind("input", function() {
                   $(".hack-DetailsIssues").val($(this).html()).trigger("change");
               });

               $(".hack-ResolutionFollowup").hide();
               $(".contentEditable-ResolutionFollowup").unbind("input").bind("input", function() {
                   $(".hack-ResolutionFollowup").val($(this).html()).trigger("change");
               });
            }

            //COLSOL field hacks
            if (a$.urlprefix() == "collective-solution.") {
                if (scope.newJournalFlag) {
                    $(".hack-RecordID-Show").hide();
                }
                else {
                    $(".hack-RecordID-Show").show();
                    /*
                    if (a$.exists(scope.f["CoachingType"])) {
                        $(".hack-CoachingType-Show select").bind("change", function() {
                            if ($(this).val() == "Follow-Up") {
                                $(".hack-CoachingParentID-Show").show();
                            }
                            else {
                                $(".hack-CoachingParentID-Show").hide();
                                $(".hack-CoachingParentID-Show input").val("");                           
                            }
                        });
                        $(".hack-CoachingType-Show select").trigger("change");
                    }
                    */

                }
                $(".clugue-for-reason").on('change', function() {
                    if ($(this).val() == 'Recognition'){
                        $(".hack-DetailsIssues-Label").hide();
                        $(".hack-DetailsIssues-Label").siblings().hide();
                        $(".hack-ResolutionFollowup-Label").hide();
                        $(".hack-ResolutionFollowup-Label").siblings().hide();
                    } else {
                        $(".hack-DetailsIssues-Label").show();
                        $(".hack-DetailsIssues-Label").siblings().show();
                        $(".hack-DetailsIssues").hide(); //Always hidden now, the ce_ div should still show.
                        $(".hack-ResolutionFollowup-Label").show();
                        $(".hack-ResolutionFollowup-Label").siblings().show();
                        $(".full-textbox").hide();
                    }
                });
            }

            //
            // getMe: Agent KPIs
            //
            scope.concatKPI = function (kpi, subkpi) {
                return subkpi ? kpi + " - " + subkpi : kpi;
            }
            scope.convertKPI = function (idx) {
                var kpi = scope.agent_kpis[idx].kpiname;
                var subkpi = scope.agent_kpis[idx].subkpiname;
                return scope.concatKPI(kpi, subkpi);
            }

            scope.get_agent_kpis_loaded = false;


            scope.bgrskip0 = scope.newJournalFlag ? 0 : 1;
            if ((a$.urlprefix() == "bgr.")&&(scope.newJournalFlag)) { //Attempt to load the form with categories prior to the KPIs coming back.
                $("#kpis-loading").hide(); //Try hiding the spinner while retrieving the KPIs (because it takes a long time)
                    scope.kpis_loaded = true;
            }

            scope.get_agent_kpis = function () {
                api.getJS({
                    who: "ME",
                    lib: "spine",
                    cmd: "getMe",
                    agentid: a$.exists(scope.userid) ? scope.userid : legacyContainer.scope.filters.CSR,
                    members: ["kpisAgent"],
                    lookback: 30,
                    bgrskip0: scope.bgrskip0
                }).then(function (json) {
                    scope.$evalAsync(function () {
                        if (!a$.exists(json.me.kpisAgent)) { //2020-12-14 - Gracefully handle failure to retrieve KPIs
                            json.me.kpisAgent = [];
                            $("#kpis-loading").hide();
                        }
                        if (a$.exists(json.me.kpisAgent)) {
                            if (a$.urlprefix() != "bgr.") scope.kpis_loaded = false;
                            scope.agent_kpis = angular.copy(json.me.kpisAgent);
                            if ((scope.bgrskip0 == 0) || (!scope.newJournalFlag)) {
                                scope.agent_id = a$.exists(scope.userid) ? scope.userid : legacyContainer.scope.filters.CSR;
                                scope.myname = "Agent";
                                try {
                                    scope.myname = $(".tbl-serieslink", $(scope.$parent.elementhold).parent().parent().prev()).html();
                                    scope.myname = scope.myname.replace(/\*/g, "");
                                } catch (e) { }
                                try {
                                    scope.myname = $(".app-user-link", $(scope.$parent.elementhold).parent().parent().prev()).html();
                                    scope.myname = scope.myname.replace(/\*/g, "");
                                } catch (e) { }
                                scope.f_selected = angular.copy(scope.f);
                                if (scope.onlyhuddle) {
                                    if ((scope.f_selected.Reason == "Huddle Template") || (typeof scope.f_selected.Reason == "undefined") || (typeof scope.f_selected.Reason == "")) {
                                        //alert("Select Huddle Template Only");
                                    }
                                    else {
                                        //alert("debug: Reason='" + scope.f_selected.Reason + "', Set to readonly");
                                        scope.readonly = true;
                                    }
                                }
                            }

                                // KPI Hack - UPDATED 2023-07-24
                            var kpi_splice = function (i, cur_name) {
                                var there = false;
                                for (var myi in scope.agent_kpis) {
                                    if (cur_name == scope.agent_kpis[myi].kpiname) {
                                        there = true;
                                    }
                                }
                                if (!there) {
                                    scope.agent_kpis.splice(i, 0,
                                        {
                                            "kpiname": cur_name,
                                            "subkpiname": "",
                                            "weight": 0,
                                            "kpi_score": 0,
                                            "kpi_raw_score": 0
                                        }
                                    );
                                }
                            }

                            scope.showcal(scope.f_selected.follow_up);

                            var kpi_match = false;

                            // scope.agent_kpis.forEach(function(v1,i1){
                            for (i = scope.agent_kpis.length - 1; i > 0; i--) {
                                var i_next = i - 1;
                                var next_name = scope.agent_kpis[i_next].kpiname;
                                var cur_name = scope.agent_kpis[i].kpiname;
                                var subkpi_name = scope.agent_kpis[i].subkpiname;

                                if (i > 0) {
                                    kpi_match = compare_vals(next_name, cur_name);
                                }

                                if (subkpi_name && !kpi_match) {
                                    kpi_splice(i, cur_name);
                                }
                                if (scope.agent_kpis[0].subkpiname) {
                                    kpi_splice(0, cur_name);
                                }
                            };

                            // Sort before applying index id
                            scope.agent_kpis.sort(function (a, b) {
                                var textA = a.kpiname.toUpperCase();
                                var textB = b.kpiname.toUpperCase();
                                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                            });

                            scope.agent_kpis.forEach(function (item, index) {
                                var kpi_label = scope.concatKPI(item.kpiname, item.subkpiname);
                                scope.agent_kpis[index].label = kpi_label;
                                scope.agent_kpis[index].id = index;
                            });
                            agent_kpis_temp = $filter('filter')(scope.agent_kpis, {
                                label: scope.f_selected.goal_kpi
                            })[0];

                            scope.f_selected.goal_kpi = scope.f_selected.goal_kpi ? ((typeof agent_kpis_temp != "undefined") ? agent_kpis_temp.id : "") : "";
                            // end KPI Hack

                            if ((scope.bgrskip0 == 0)|| (!scope.newJournalFlag)) {

                                scope.showcal(scope.f_selected.follow_up);

                                scope.goal_score_flag = true;
                                if (scope.f_selected.goal_kpi != "") {
                                    scope.goal_score_flag = false;
                                }

                                // Polyfill padStart for IE11
                                // https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
                                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
                                if (!String.prototype.padStart) {
                                    String.prototype.padStart = function padStart(targetLength, padString) {
                                        targetLength = targetLength >> 0; //truncate if number, or convert non-number to 0;
                                        padString = String(padString !== undefined ? padString : ' ');
                                        if (this.length >= targetLength) {
                                            return String(this);
                                        } else {
                                            targetLength = targetLength - this.length;
                                            if (targetLength > padString.length) {
                                                padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
                                            }
                                            return padString.slice(0, targetLength) + String(this);
                                        }
                                    };
                                }
                                // end Polyfill padStart for IE11

                                var today = new Date();
                                var dd = String(today.getDate()).padStart(2, '0');
                                var mm = String(today.getMonth() + 1).padStart(2, '0');
                                var yyyy = today.getFullYear();
                                today = mm + '/' + dd + '/' + yyyy;
                                scope.f_selected.Date = scope.f_selected.Date ? scope.f_selected.Date : today;

                                scope.f_selected.goal_date = scope.f_selected.goal_date ? scope.f_selected.goal_date : today;

                                scope.f_selected.follow_up = scope.f_selected.follow_up ? scope.f_selected.follow_up : "No";

                                scope.f_selected.follow_up_date = scope.f_selected.follow_up_date ? scope.f_selected.follow_up_date : today;

                                scope.get_agent_kpis_loaded = true;
                                scope.kpis_loaded = json.me.kpis_loaded;
                                $("#kpis-loading").hide();
                                scope.loadCustomForm();
                            }
                            if ((true) && ((a$.urlprefix() == "bgr.") && (scope.bgrskip0 == 0))) {
                                scope.bgrskip0 = 1;
                                scope.get_agent_kpis();
                            }
                        }
                    });
                });
            }
            scope.get_agent_kpis();

            scope.get_goal_kpi = function (val) {
                scope.goal_score_flag = false;
                selected_kpis = scope.agent_kpis[val];
                scope.selected_goal_score ? scope.get_goal_score(scope.selected_goal_score) : scope.get_goal_score();
            }

            scope.get_goal_score = function (val) {

                scope.selected_goal_score = val;
                // if (!scope.f_selected.goal_from_x) {
                switch (val) {
                    case "kpi_score":
                        scope.f_selected.goal_from_x = selected_kpis.kpi_score;
                        break;

                    case "kpi_raw_score":
                        if (!a$.exists(selected_kpis.kpi_raw_score)) {
                            scope.f_selected.goal_from_x = 0;
                        }
                        else {
                            scope.f_selected.goal_from_x = selected_kpis.kpi_raw_score.toFixed(2);
                        }
                        break;

                    default:
                        scope.f_selected.goal_from_x = "0";
                        break;
                }
                // }
            }
            scope.form_disabled = true;
            //Get reasons here?  All remaining inside a .then

            //Test
            scope.journal_reason = [];

            api.postJS({
                lib: "spine",
                cmd: "loadSidekickReasons"
            }).then(function (json) {
                scope.reasons = json.reasons;
                scope.journal_reason = [];
                var selfjournal = (scope.userid.toString().toLowerCase() == $.cookie("username").toString().toLowerCase());
                var iscsr = true;
                try {
                    iscsr = (scope.userid.toString().toLowerCase() == legacyContainer.scope.filters.CSR.toString().toLowerCase())
                }
                catch (e) {}
                for (var i in scope.reasons) {
                    if (
                        (((!selfjournal) || (!scope.newJournalFlag)) && (scope.reasons[i].OfferNew == "Yes"))
                        || //(((selfjournal) || ($.cookie("TP1Role") == "Admin")) && (scope.reasons[i].OfferSelf == "Yes"))
                          ((!iscsr) && (scope.reasons[i].OfferSelf == "Yes"))
                     /* 2022-05-20 remove special treatement of Public Recognition:
                     || ((scope.reasons[i].SidekickReasonName == "Public Recognition") && ($.cookie("TP1Role") == "Admin"))
                            || ((scope.reasons[i].SidekickReasonName == "Public Recognition") && (a$.urlprefix(true).indexOf("mnt") == 0)) */
                    )
                    {
                        if (!((scope.reasons[i].SidekickReasonName == "Public Recognition") && (a$.urlprefix(true) == "km2."))) { //Don't show on km2 yet.
                            scope.journal_reason.push(scope.reasons[i].SidekickReasonName);
                       }
                    }
                }
                $(".clugue-for-reason").show();
                $(".reason-loading").hide();
            scope.$watchCollection('[f_selected.Reason,f_selected.Date,f_selected.DeliveredBy,f_selected.follow_up,f_selected.follow_up_date,f_selected.AreasOfSuccess,f_selected.DetailsIssues]', function (newval, oldval) {
                for (var i in scope.reasons) {
                    if (scope.reasons[i].SidekickReasonName == scope.f_selected.Reason) {
                        scope.current_reason = scope.reasons[i];
                        scope.loadCustomForm(); //DEBUG: Does this help?
                        break;
                    }
                }

                if (a$.urlprefix() == "collective-solution.") {
                    if (scope.f_selected.Reason == "Behavioral") {
                        $(".hack-BehavioralInstances-Show").show();
                    }
                    else {
                        $(".hack-BehavioralInstances-Show").hide();
                    }
                }
                if (scope.onlyhuddle) {
                    if ((scope.f_selected.Reason == "Huddle Template") || (typeof scope.f_selected.Reason == "undefined") || (typeof scope.f_selected.Reason == "")) {                        
                    }
                    else {
                        scope.readonly = true;
                              $("select",element).attr("disabled","disabled");
                              $("textarea",element).attr("disabled","disabled");
                              $('input[type="text"]').attr("disabled","disabled");
                              $(".jg-notify-agent-wrapper").remove();
                              $(".jg-israted").show();
                              $(".ce-div").attr("contentEditable","false");

                    }
                }

                //"Coaching" selection guidance.
                try {
                if (scope.newJournalFlag) {
                    if ((scope.f_selected.Reason == "Coaching")
                    || (scope.f_selected.Reason == "Recognition")
                    || (scope.f_selected.Reason == "Call Monitor")
                    || (scope.f_selected.Reason == "General")
                    )
                     {
                        if ((a$.urlprefix() == "km2.")||(a$.urlprefix() == "chime.")) {
                            var cbld = "";
                            for (var i in scope.reasons) {
                                if (scope.reasons[i].SidekickReasonName.indexOf("Coaching ") == 0) {
                                    cbld += "\n" + scope.reasons[i].SidekickReasonName;
                                }
                            }
                            alert("For new journal entries, please select a more descriptive 'Coaching' category.  Examples:\n" + cbld);
                            scope.f_selected.Reason = ""; //Does this work?
                        }

                    }
                }
                } catch(e) {};

                var dvcheck = true;
                if (a$.exists(scope.current_reason)) {
                    if (a$.exists(scope.current_reason.QAFormId) && (scope.current_reason.QAFormId != 0)) {
                        dvcheck = false;
                    }
                }
                
                if ((a$.urlprefix() == "collective-solution.") && dvcheck) {
                    if (scope.f_selected.Reason && scope.f_selected.Date && scope.f_selected.AreasOfSuccess && scope.f_selected.DetailsIssues && (scope.f_selected.DeliveredBy || scope.current_reason.DisplayDeliveredBy == "No")) {
                        scope.form_disabled = false;
                        if (scope.readonly) scope.form_disabled = true;
                    }
                    //Recognition reaon with hidden required fields
                    if (scope.f_selected.Reason == "Recognition") {
                        if (scope.f_selected.Reason && scope.f_selected.Date && scope.f_selected.AreasOfSuccess && (scope.f_selected.DeliveredBy || scope.current_reason.DisplayDeliveredBy == "No")) {
                            scope.form_disabled = false;
                            if (scope.readonly) scope.form_disabled = true;
                        }
                    }

                }   
                else {
                    if (scope.f_selected.Reason && scope.f_selected.Date && (scope.f_selected.DeliveredBy || scope.current_reason.DisplayDeliveredBy == "No")) {
                        scope.form_disabled = false;
                        if (scope.readonly) scope.form_disabled = true;

                    } else {
                        scope.form_disabled = true;
                    }
                }
                // if Follow Up is chosen, but the corresponding date is not
                if (scope.current_reason.DisplayFollowup) {
                    if (scope.f_selected.follow_up === 'Yes' && ((!scope.f_selected.follow_up_date) || (scope.f_selected.follow_up_date === ''))) {
                        scope.form_disabled = true;
                    }
                }
                if (scope.readonly) {
                    $("select",element).attr("disabled","disabled");
                    $("textarea",element).attr("disabled","disabled");
                }
            });
            });


            // used for the ng-pattern of the goal values to only accept whole numbers and decimals
            // this regex also allows for decimal numbers without a leading zero
            scope.only_numbers = /^(?:(?:0|[1-9][0-9]*)(?:\.[0-9]*)?|\.[0-9]+)$/;

            scope.$watchCollection('[f_selected.goal_from_x, goal_increase]', function (newval, oldval) {
                if (scope.f_selected.goal_from_x && scope.goal_increase) {
                    num_current = Number(scope.f_selected.goal_from_x);
                    num_increase = Number(scope.goal_increase);
                    num_percent = Number(num_increase / 100);
                    num_goal = (Number((num_percent * num_current) + num_current)).toFixed(2);
                    scope.f_selected.goal_to_x = num_goal;
                }
            });
            //
            // end getMe: Agent KPIs
            //

            scope.record_saved = false;

            scope.usingCustomFormReasonID = 0;

            scope.loadCustomForm = function () {
                if (scope.reasons.length == 0) {
                    scope.usingCustomFormReasonID = 0;
                    $(".custom-form-placeholder").html("");

                    setTimeout(function() { scope.$apply(function () { scope.loadCustomForm() }); }, 1000);
                    //return false;
                }
                else {
                if (a$.exists(scope.current_reason)) {
                    if (a$.exists(scope.current_reason.QASubformPage) && (scope.current_reason.QASubformPage != "")) {
                        //alert("debug: custom render point");
                        if (scope.usingCustomFormReasonID != scope.current_reason.SidekickReasonId) {
                            scope.usingCustomFormReasonID = scope.current_reason.SidekickReasonId;
                            var girl = 1;
                            if ((!a$.exists(scope.f_selected.tempRefId)) || (scope.f_selected.tempRefId == null)) {
                                scope.f_selected.tempRefId = a$.guid();
                            }
                            var tbld = '<ng-acuity-qa text="My Monitor" details="My Details" framepage="' + scope.current_reason.QASubformPage + '" formid="' + scope.current_reason.QAFormId + '" dataview="' + scope.dataview + '" masterid="' + (a$.exists(scope.recordid) ? scope.f_selected.id : "") + '" entdt="' + (a$.exists(scope.recordid) ? scope.f_selected.Date : "") + '" parentmasterid="' + scope.f_selected.Parent_ID + '" temprefid="' + scope.f_selected.tempRefId + '" examiner="' + $.cookie("TP1Username") + '" examinee="' + (a$.exists(scope.userid) ? scope.userid : "") + '"></ng-acuity-qa>';
                            var ele = $compile(tbld)(scope);
                            angular.element($(" .custom-form-placeholder", element)).empty().append(ele);
                        }
                    }
                    else {
                        scope.usingCustomFormReasonID = 0;
                        $(".custom-form-placeholder").html("");
                    }
                    if (scope.newJournalFlag && (scope.current_reason.AskForRating == "Yes")) {
                        $(".jg-notify-agent-wrapper", element).show();
                        $(".jg-notify-agent", element).prop("checked", true);
                    }
                    else if (scope.current_reason.AskForRating == "Yes") {
                        $(".jg-notify-agent-wrapper", element).show();
                        $(".jg-notify-agent", element).prop("checked", false);
                        $(".jg-notify-agent-label", element).html("Re-Notify Agent");
                    }
                    else {
                        $(".jg-notify-agent-wrapper", element).hide();
                    }


                    //Check for Agent Reading
                    if (a$.urlprefix() == "collective-solution.") {
                        if (!scope.newJournalFlag) {
                            if (a$.exists(scope.f_selected.id) && a$.exists(scope.f_selected.User) && (scope.f_selected.ViewedByExaminee != 1)) {
                                if ($.cookie("TP1Username").toString().toLowerCase() == scope.f_selected.User.toString().toLowerCase()) {
                                    scope.f_selected.ViewedByExaminee = 1; //TODO: This can be read in via DAS (issues with nulls need addressed)
                                    a$.ajax({
                                        type: "GET",
                                        service: "JScript",
                                        async: true,
                                        data: {
                                            lib: "spine",
                                            cmd: "SetViewedByExaminee",
                                            journalid: scope.f_selected.id
                                        },
                                        dataType: "json",
                                        cache: false,
                                        error: a$.ajaxerror,
                                        success: function(json) {
                                            if (a$.jsonerror(json)) { } else {
                                            }
                                        }
                                    });
                                }
                            }
                            var developme = 1;
                        }
                    }

                    if (scope.current_reason.AllowAttachments != "Yes") {
                        $(".jg-attachments").html("");
                    }
                    else {
                        var bld = "";
                        if ( (a$.urlprefix() == "collective-solution.") || (a$.urlprefix() == "ers.") || (a$.urlprefix() == "walgreens.") || (a$.urlprefix() == "ultracx.")   /* && ($.cookie("TP1Role") == "Admin") */) {
                            bld += '<div style="display:block;text-align: right;line-height:30px;">';
                            bld += '<span class="attachments-list"></span>';
                            bld += '<input id="msgFileUpload" name="msgFileUpload" type="file" accept=".doc,.docx,.xls,.xlsx,.pdf" style="display:none;">';
                            bld += '<input type="button"';
                            if ($.cookie("TP1Role") == "CSR") {
                                bld += ' disabled="disabled"';
                            }
                            bld += ' value="Attach File..." onclick="document.getElementById(';
                            bld += "'msgFileUpload'";
                            bld += ').click();return false;" style="margin-left: 30px;">';
                            bld += '</div>';
                            $(".jg-attachments").html(bld);
                            if ((!a$.exists(scope.f_selected.tempRefId)) || (scope.f_selected.tempRefId == null)  || (scope.f_selected.tempRefId == "")) {
                                scope.f_selected.tempRefId = a$.guid();
                            }
                            function setupDownload() {
                                $(".sidekick-attachment-download").unbind().bind("click", function () {
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

                            $("#msgFileUpload").val("").unbind().bind('change', function () {

                                var data = new FormData();

                                var files = $("#msgFileUpload").get(0).files;

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
                                //DONE: How do I save the attachment and connect it to my message body?  Setting it to 1 while testing the existing code.
                                //New column in qa_attachment: keyguid, use your local guid for this (remove it once connected to idmaster).
                                var url = loc + "jshandler.ashx?username=" + a$.xss($.cookie("username")) + "&uid=" + a$.xss($.cookie("uid")) + "&lib=qa&cmd=saveAttachment&keyguid=" + scope.f_selected.tempRefId + "&filename=" + fn + "&database=C";
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
                                    $(".attachments-list").append('&nbsp;&nbsp;  <a href="#" class="sidekick-attachment-download" atid="' + json.id + '">' + fn + '</a>');
                                    setupDownload();
                                });
                            });
                            if (a$.exists(scope.f_selected.id) && (scope.f_selected.id != "")) {
                                //drug
                                    a$.ajax({
                                        type: "GET",
                                        service: "JScript",
                                        async: true,
                                        data: {
                                            lib: "qa",
                                            cmd: "getAttachmentList",
                                            masterId: scope.f_selected.id
                                        },
                                        dataType: "json",
                                        cache: false,
                                        error: a$.ajaxerror,
                                        success: function(json) {
                                            if (a$.jsonerror(json)) { } else {
                                                for (var aii in json.attachments) {
                                                    $(".attachments-list").append('&nbsp;&nbsp; <a href="#" class="sidekick-attachment-download" atid="' + json.attachments[aii].id  + '">' + json.attachments[aii].filename.replace(/ -/g, "&nbsp;") + '</a>');
                                                }
                                                setupDownload();
                                            }
                                        }
                                    });
                                }
                            }                        
                        }
                    }
                }
                }
                scope.$watchCollection('[f_selected.Reason]', function (newval, oldval) {
                    if (a$.exists(scope.f_selected)) {
                        if (a$.exists(scope.f_selected.Reason)) {
                            $(".reason-wrapper", element).eq(0).attr("class", "").addClass("reason-wrapper").addClass("reason-" + scope.f_selected.Reason.replace(/[\s\-\/\(\)]/g, ""));
                            //load recognition with hidden fields
                            if (a$.urlprefix() == "collective-solution.") { 
                                if (scope.f_selected.Reason == "Recognition") {
                                    $(".hack-DetailsIssues-Label").hide();
                                    $(".hack-DetailsIssues-Label").siblings().hide();
                                    $(".hack-ResolutionFollowup-Label").hide();
                                    $(".hack-ResolutionFollowup-Label").siblings().hide();
                                }
                            }
                        }
                    }
                    scope.loadCustomForm();
                });

                scope.dismissform = function () {
                    //drug reconcile attachments
                    if ((a$.urlprefix() == "ers.") || (a$.urlprefix() == "collective-solution.") || (a$.urlprefix() == "walgreens.") || (a$.urlprefix() == "ultracx.")) {
                        if (a$.exists(scope.f_selected.id) && (scope.f_selected.id != "")
                            && a$.exists(scope.f_selected.tempRefId)
                            && (scope.f_selected.tempRefId != null)
                            && (scope.f_selected.tempRefId != "")
                            )
                        {
                            a$.ajax({
                                type: "GET",
                                service: "JScript",
                                async: true,
                                data: {
                                    lib: "qa",
                                    cmd: "reconcileAttachments",
                                    masterId: scope.f_selected.id,
                                    keyguid: scope.f_selected.tempRefId
                                },
                                dataType: "json",
                                cache: false,
                                error: a$.ajaxerror,
                                success: function(json) {
                                    if (a$.jsonerror(json)) { } else {
                                    }
                                }
                            });
                        }
                    }
                    $(element).remove();
                }

            scope.$watchCollection('[f_selected.follow_up]', function (newval, oldval) {
                if (scope.f_selected.follow_up === "No") {
                    scope.f_selected.follow_up_date = "";
                }
            });

            function triggerQaSubmit(formid, userid, masterid) {
                window['QASubmit_' + formid + "_" + userid] = masterid;
                try {
                    if (!scope.freeform) scope.$parent.table.records[0].id = "" + masterid;
                } catch (err) {
                }

                var saveconfirmed = false;
                var savetimeout = false;

                $(".subform-save-confirmation").html("Confirming Subform Save.....").show();
                $(".form-popup_dismiss").hide();

                var loops = 0;
                function subformsavecheck() {
                    if (window['QASaveConfirmed_' + formid + "_" + userid] == "YES") {
                        $(".subform-save-confirmation").html("Subform save confirmed.").show();
                        $(".form-popup_dismiss").show();
                    }
                    else if (loops > 30) {
                        $(".subform-save-confirmation").html("Subform save could NOT be confirmed.").show();
                        $(".form-popup_dismiss").show();
                    }
                    else {
                        loops +=1;
                        setTimeout(subformsavecheck,1000);
                    }                    
                }
                subformsavecheck();
                //$compile(scope.$parent.elementhold.contents())(scope);
            }

            scope.submitform = function () {
                //alert("debug: intercept submit returning true"); return true;
                //alert("debug: intercept submit returning false"); return false; //<<<< returning false negates the submit.
                if (a$.urlprefix() == "collective-solution.") { 
                    //loop attempt on one class
                    var dvpassed = true;
                    $(".cs-required-field").each(function(){
                        //bypass hidden fields that are required
                      if ($(this).is(":visible") & $(this).css('display') != 'none') {
                        $(this).css("border", "");
                        if($(this).val().toString().trim() == "") {
                            $(this).css("border", "2px solid red");
                            dvpassed = false;
                        }
                      }
                    });
                    if (!dvpassed) {
                        alert("Please enter required fields.");
                        return false;
                    }
                }

                if (scope.f_selected.goal_kpi != null) {
                    if (scope.f_selected.goal_kpi !== "") {
                        scope.f_selected.goal_kpi = scope.agent_kpis[scope.f_selected.goal_kpi].label;
                    }
                }
                if (true) {
                    
                    if (a$.urlprefix() == "collective-solution.") { 
                        scope.f_selected.ResolutionFollowup = "|S|" + $('.cs-smart__s').val() + "|M|" + $('.cs-smart__m').val() + "|A|" + $('.cs-smart__a').val() + "|R|" + $('.cs-smart__r').val() + "|T|" + $('.cs-smart__t').val();
                        }
                        // console.log(scope.f_selected.ResolutionFollowup);
                    scope.f = angular.copy(scope.f_selected);
                    scope.record_saved = true; //If not set before this falls through, the submit doesn't close the dialog.

                    if (a$.exists(scope.current_reason)) {
                      if (a$.exists(scope.current_reason.QAFormId) && (scope.current_reason.QAFormId != 0)) {
                        $(".subform-save-confirmation").html("Please wait for save confirmation.....").show();
                        $(".form-popup_dismiss").hide();
                      }
                    }


                    if (/* scope.newJournalFlag && */(scope.current_reason.AskForRating == "Yes") && $(".jg-notify-agent", element).is(":checked")) { //(scope.newJournalFlag && (scope.f.Reason != "General")) {
                        scope.doNewSave = function(json) {
                            //ERROR HAPPENING HERE 2023-03-28 - json undefined.
                            var myid = json.idsaved; //So it'll work in the mean time.
                            //TODO: Review this, there must be a better way. 2023-02-23, I think this needs to be below as well.
                            if (!scope.freeform) {
                                if (a$.urlprefix() != "bgr.") {
                                    scope.$parent.table.records[0].id = myid; //Reverse order now
                                }
                                else {
                                    scope.$parent.table.records[scope.$parent.table.records.length - 1].id = myid;
                                }
                            }

                            //$log.log(`myid: ${myid}`);
                            if (a$.exists(scope.current_reason)) {
                                if (a$.exists(scope.current_reason.QAFormId) && (scope.current_reason.QAFormId != 0)) {
                                    triggerQaSubmit(scope.current_reason.QAFormId, scope.userid, myid);
                                }
                            }

                            // Build body content with Journal details
                            var msg_body = "";
                            msg_body += '<p>A journal entry for coaching, recognition, or support has been submitted on ' + scope.f.Date + '. Please acknowledge and rate the experience.</p>';
                            var delby = scope.f.DeliveredBy;
                            try {
                                if (delby.split(", ").length == 2) {
                                    delby = delby.split(", ")[1] + " " + delby.split(", ")[0];
                                }
                            }
                            catch (e) {
                            }
                            msg_body += '<b>Submitted By:</b> ' + delby + '<br/>';
                            msg_body += '<b>Reason:</b> ' + scope.f.Reason + '<br/><br />';
                            if (a$.urlprefix() == "collective-solution.") {
                                try {
                                    msg_body += 'Areas of Success: ' + scope.f.AreasOfSuccess.replace(/[\t\r\n\x0B\x0C\u0085\u2028\u2029]+/g," ").replace(/\\/g, "/") + '<br/>';
                                } catch (e) { }
                                try {
                                    msg_body += 'Areas of Opportunity: ' + scope.f.DetailsIssues.replace(/[\t\r\n\x0B\x0C\u0085\u2028\u2029]+/g," ").replace(/\\/g, "/") + '<br/>';
                                } catch (e) { }
                                try {
                                    msg_body += 'Coaching Action Plan (SMART): ' + scope.f.ResolutionFollowup.replace(/[\t\r\n\x0B\x0C\u0085\u2028\u2029]+/g," ").replace(/\\/g, "/") + '<br/>';
                                } catch (e) { }
                                try {
                                    msg_body += 'Journal ID: ' + myid + '<br/>';
                                } catch (e) { }
                            }
                            else if (a$.urlprefix() == "km2.") {
                                try {
                                    msg_body += '<b>Coaching Notes - Including Agreed Actions (Line Manager):</b> ' + scope.f.DetailsIssues.replace(/[\t\r\n\x0B\x0C\u0085\u2028\u2029]+/g," ").replace(/\\/g, "/") + '<br/>';
                                } catch (e) { }
                                try {
                                    msg_body += '<b>Coaching Feedback (Team Member):</b> ' + scope.f.ResolutionFollowup.replace(/[\t\r\n\x0B\x0C\u0085\u2028\u2029]+/g," ").replace(/\\/g, "/") + '<br/>';
                                } catch (e) { }
                            }
                            else {
                                try {
                                    msg_body += '<b>Details/Issues:</b> ' + scope.f.DetailsIssues.replace(/[\t\r\n\x0B\x0C\u0085\u2028\u2029]+/g," ").replace(/\\/g, "/") + '<br/>';
                                } catch (e) { }
                                try {
                                    msg_body += '<b>Resolution/Follow-up:</b> ' + scope.f.ResolutionFollowup.replace(/[\t\r\n\x0B\x0C\u0085\u2028\u2029]+/g," ").replace(/\\/g, "/") + '<br/>';
                                } catch (e) { }
                            }
                            if (scope.f.goal_kpi && scope.f.goal_score && scope.f.goal_from_x && scope.f.goal_to_x) {

                                if (scope.f.goal_score === 'kpi_raw_score') {
                                    goalScore = "Standard";
                                } else {
                                    goalScore = "Scored"
                                }

                                msg_body += 'KPI ' + ((a$.urlprefix() == "walgreens.") ? '' : 'Goal') + ': ' + scope.f.goal_kpi + ' | ';
                                msg_body += 'Basis: ' + goalScore + ' | ';
                                msg_body += 'Current: ' + scope.f.goal_from_x + ' | ';
                                msg_body += 'New ' + ((a$.urlprefix() == "walgreens.") ? 'PPGA' : 'Goal') + ': ' + scope.f.goal_to_x;
                            }

                            msg_body += '<p><span class="message-service" service="SidekickRating" deliveredby="' + $.cookie("username") + '" category="journal" journalid="' + myid + '">Please Acknowledge and Rate Your Recent Support Experience</span></p>';
                            // end Build Body

                            // Rating Message
                            api.postJS({
                                lib: "qa",
                                cmd: "send_message_test",
                                messageto: scope.agent_id,
                                subject: (scope.newJournalFlag ? "" : "RE:") + "Please Acknowledge and Rate Your Journal Entry",
                                body: msg_body
                            }).then(function (json) {
                                if (true) {
                                    $log.log('Journal Acknowledgement and Rating Sent to ' + scope.agent_id + ".");
                                }
                            });
                            // end Rating Message
                            $log.log("Journal Form Record Saved (with rating message)");
                        }
                        if (!scope.freeform) {
                            scope.$parent.onUpdateRecord(scope.recordid, scope.f, true).then(function (json) {
                                scope.doNewSave(json);
                            });
                        }
                        else {
                            alert("debug: freeform (new) save is not yet complete");
                        }
                    }
                    else {
                        scope.doUpdateSave = function(json) {
                            //ERROR HAPPENING HERE 2023-03-28 - json undefined.
                            var myid = json.idsaved; //So it'll work in the mean time.
                            //Here is where the new ID needs to be added to the table record (not above).
                            if (a$.urlprefix() != "bgr.") {
                                scope.$parent.table.records[0].id = myid; //Reverse order now
                            }
                            else {
                                scope.$parent.table.records[scope.$parent.table.records.length - 1].id = myid;
                            }

                            if (a$.exists(scope.current_reason)) {
                                if (a$.exists(scope.current_reason.QAFormId) && (scope.current_reason.QAFormId != 0)) {
                                    triggerQaSubmit(scope.current_reason.QAFormId, scope.userid, myid);
                                }
                            }
                            $log.log("Journal Form Record Saved (no rating message)");
                        }
                        if (!scope.freeform) {
                            scope.$parent.onUpdateRecord(scope.recordid, scope.f, true).then(function (json) {
                                scope.doUpdateSave(json);
                            });
                        }
                        else {
                            alert("debug: freeform (update) save is not yet complete");
                        }
                    }
                }

            }

            } //End of doit function

            if ((!scope.freeform) || (!a$.exists(scope.id)) || (scope.id == ""))  {
                //TODO: In this case, I still need for the field to exist in scope.f
                //Try first to only add Reason (which is pre-processed) and see if the ng model fills in the rest (is actually good for something).
                scope.f = {};
                scope.f["Reason"] = ""; //Existence is necessary.
                scope.f["User"] = a$.exists(scope.userid) ? scope.userid : legacyContainer.scope.filters.CSR; //Too much to pull from the systemfield field, I'm in a specific form!
                if ((!a$.exists(scope.id)) || (scope.id == "")) {
                    /*scope.f["DeliveredBy"] = */GetUserFullName(); //this is now async
                }
                scope.doit();
 
            }
            else {
                //Before filling out the form, read in the form data (was formerly in the $parent)

                a$.ajax({
                    type: "POST",
                    service: "JScript",
                    async: true,
                    data: {
                        lib: "editor",
                        cmd: "loaddataview",
                        dataview: scope.dataview,
                        allow: scope.allow,
                        reversesort: (window.location.toString().toLowerCase().indexOf("bgr-v3-dev.") >= 0), //eye roll
                        disallow: scope.disallow,
                        CSR: a$.exists(scope.userid) ? scope.userid : legacyContainer.scope.filters.CSR
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (json) {
                        //Will return all IDs for the agent (TODO: Make it so you can pass an id to loaddataview).
                        if (a$.jsonerror(json)) {
                            if (json.errormessage) {
                                alert("ERROR:" + json.msg);
                            }
                        }
                        else {
                            //debugger;
                            var found = false;
                            for (var i in json.table.records) {
                                if (json.table.records[i].id == scope.id) {
                                    scope.f = {};
                                    for (var key in json.table.records[i]) {
                                        scope.f[key] = json.table.records[i][key];
                                    }
                                    scope.$apply(function () {
                                        found = true;
                                        scope.doit();
                                    });
                                }
                            }
                            if (!found) {
                                alert("ID " + scope.id + " not found for user " + (a$.exists(scope.userid) ? scope.userid : legacyContainer.scope.filters.CSR));
                            }
                            scope.id = "";
                            scope.$apply(function () {
                                scope.doit();
                            });
                        }
                    }
                });

                /*
                scope.f = {};
                for (var k in scope.$parent.table.records[rec]) {
                    scope.f[k] = scope.$parent.table.records[rec][k];
                }
                */                
            }

        }
    }
} ]);

angularApp.directive('datepicker', function () {
    return function (scope, element, attrs) {
        element.datepicker({
            inline: true,
            dateFormat: 'm/d/yy'
        });
    }
});