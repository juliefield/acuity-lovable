angularApp.directive("ngFormAttendance", ['api', function (api) {
    return {
        templateUrl: "../applib/dev/FORMS1/FORMS1-view/attendanceform.htm?" + Date.now(), //TODO: Remove for production?
        scope: {
            dataview: "@",
            edit: "@",
            id: "@",
            recordid: "@",
            popup: "@",
            onUpdateRecord: "&" //These do nothing, but this is how I think they work (something is missing in the middle).
        },
        require: '^ngLegacyContainer',
        link: function (scope, element, attrs, legacyContainer) {

            scope.rules = [
                { text: "1st day absence", val: "", entry: false, occurrence: "1.0" },
                { text: "1st New Hire Incident", val: "", entry: false, occurrence: "1.0" },
                { text: "2nd New Hire  Incident", val: "", entry: false, occurrence: "1.0" },
                { text: "Consecutive absence up to 4 Days", val: "", entry: false, occurrence: "0.5" },
                { text: "3rd New Hire Incident", val: "", entry: false, occurrence: "1.0" },
                { text: "Addendum (ENTER POINT VALUE)", val: "Addendum", entry: true, occurrence: "0" },
                { text: "Attendance Credit (ENTER A NEGATIVE #)", val: "Attendance Credit", entry: true, occurrence: "0" },
                { text: "Attendance Exception, no points", val: "", entry: false, occurrence: "0" },
                { text: "Denies Day Off", val: "", entry: false, occurrence: "4.0" },
                { text: "FMLA", val: "", entry: false, occurrence: "0" },
                { text: "Leave Work Early, worked less than 50% of shift", val: "", entry: false, occurrence: "1.0" },
                { text: "Leave Work early, worked more than 50% of shift", val: "", entry: false, occurrence: "0.5" },
                { text: "Late for Work, less than 2 hrs", val: "", entry: false, occurrence: "0.5" },
                { text: "Late for Work, more than 2 hrs", val: "", entry: false, occurrence: "1.0" },
                { text: "Mandatory meeting or training (ENTER POINT VALUE)", val: "Mandatory meeting or training", entry: true, occurrence: "0" },
                { text: "New Hire No Call No Show", val: "", entry: false, occurrence: "1.0" },
                { text: "No call no show", val: "", entry: false, occurrence: "4.0" },
                { text: "Patterned absence", val: "", entry: false, occurrence: "2.0" },
                { text: "Peak days", val: "", entry: false, occurrence: "2.0" },
                { text: "Protected absence", val: "", entry: false, occurrence: "0" },
                { text: "Return to work", val: "", entry: false, occurrence: "0" },
                { text: "Short Call", val: "", entry: false, occurrence: "1.5" }
            ];

            scope.actions = [
                "",
                "Verbal Warning",
                "1st Written Warning",
                "Final Written Warning",
                "FMLA Approved",
                "FMLA Pending",
                "FMLA Not Covered",
                "Termination"
            ];

            for (var i in scope.rules) {
                if (scope.rules[i].val == "") scope.rules[i].val = scope.rules[i].text;
            }

            if (!a$.exists(scope.popup)) {
                $(" .form-popup", element).removeClass();
            }
            scope.HGV_LOGIC = function () {
                if (true) { //($.cookie("TP1Role") == "Admin") {


                    $(".bgr-reason-text", element).hide();
                    var comptext = scope.f["Reason"]; // $(".bgr-reason-text").html();

                    $(".bgr-reason-select", element).html("");
                    $(".bgr-reason-select", element).append('<option value="">Select Reason</option>');
                    for (var i in scope.rules) {
                        $(".bgr-reason-select", element).append('<option value="' + scope.rules[i].val + '"' + ((scope.rules[i].val == comptext) ? ' selected ' : '') + '>' + scope.rules[i].text + '</option>');
                    }

                    comptext = scope.f["ActionTaken"];
                    $("select ", $(".bgr-action", element).parent()).html("");
                    for (var i in scope.actions) {
                        $("select ", $(".bgr-action", element).parent()).append('<option value="' + scope.actions[i] + '"' + ((scope.actions[i] == comptext) ? ' selected ' : '') + '>' + scope.actions[i] + '</option>');
                    }

                    $(".bgr-reason-select", element).show().on("change", function () {
                        var compval = $(this).val();
                        $(".bgr-reason-text").html(compval);
                        scope.f["Reason"] = compval;
                        $("select ", $(".bgr-occurrence", element).parent()).attr("disabled", "disabled");
                        for (var i in scope.rules) {
                            if (scope.rules[i].val == compval) {
                                if (scope.rules[i].entry) {
                                    $("select ", $(".bgr-occurrence", element).parent()).removeAttr("disabled");
                                }
                                else {
                                    $("select ", $(".bgr-occurrence", element).parent()).val(scope.rules[i].occurrence);
                                    scope.f["Occurrence"] = scope.rules[i].occurrence;
                                }
                                break;
                            }
                        }
                    });
                    $(".bgr-reason-select").trigger("change");
                }
            }
            if (a$.exists(scope.recordid) && (scope.recordid != "")) {
                //Editing a record that belongs to my parent (ng-table-editor)
                //scope.f = Object.assign({}, scope.$parent.table.records[rec]); //Not supported by IE :(
                var rec = parseInt(scope.recordid, 10);
                scope.f = {};
                for (var k in scope.$parent.table.records[rec]) {
                    scope.f[k] = scope.$parent.table.records[rec][k];
                }
                if (true) { //($.cookie("TP1Role") == "Admin") {
                    var newform = false;
                    for (var i in scope.rules) {
                        if (scope.f["Reason"] == scope.rules[i].val) {
                            newform = true;
                            break;
                        }
                    }
                    if (scope.f["Reason"] == "") newform = true;
                    if (newform) scope.HGV_LOGIC();
                }
            } else if (a$.exists(scope.id) && (scope.id != "")) {
                //Editing an existing record by id, retrieve the record from the server.
                alert("TODO: Retrieve directly from server into form.");
            } else {
                //This is a new record, initialize it (how?)
                scope.f = {}; //TODO: Defaults?
                scope.f["User"] = legacyContainer.scope.filters.CSR; //Too much to pull from the systemfield field, I'm in a specific form!
                scope.HGV_LOGIC();
            }
            scope.dismissform = function () {
                $(element).remove();
            }
            scope.submitform = function () {
                //TODO: Write the record, communicate with the table that a record has changed/added (or change it myself).

                //TODO: I'm choosing not to delete my own scope, since I may not have created a child scope if I'm created by, say, ngTableEditor (I want to poke back into my parent).
                //You may need to revisit (creating a child scope upon creation, then here doing a scope.$destroy()
                scope.$parent.onUpdateRecord(scope.recordid, scope.f);
                $(element).remove();
            }
        }
    }
} ]);
