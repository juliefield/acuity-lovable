//TODO: There needs to be a way to inject field definitions from tableeditor or forms or something.
//Maybe the options can be passed from the server (might be better, but just moves the point of complication).
//But, it would allow dynamic updates to the list, so that's the way to go for sure.
angularApp.directive("dynamicUi", function () {
    //Note: This relies on the data being repeated with an object named "r" - as in ng-repeat="r in table.records".
    //      Please update this if you find a more general way (this isn't bad though..).

    function addoption(val, compval) {
        var opt = '<option';
        if (val == compval) {
            opt += ' selected="selected"';
        }
        opt += ' value="' + val + '">' + val + '</option>';
        return opt;
    }

    function makeselect(opts, val) {
        var e = '<select>';
        if (val != "") {
	        var inlist = false;
  	      for (var o in opts) {
    	    	if (val == opts[o]) {
      	  		inlist = true;
        			break;
        		}
        	}
	        if (!inlist) e += addoption(val,val);
        }
        for (var o in opts) {
            e += addoption(opts[o], val);
        }
        e += "</select>";
        return e;
    }

    return {
        restrict: "A",
        scope: {
            edit: "=",
            field: "@"
        },
        link: function (scope, el, attr) {
            var col = "";
            if (a$.exists(scope.$parent.r) && a$.exists(scope.$parent.col)) { // r is defined in the ng-table-editor directive.
                col = scope.$parent.col.name;
            }
            else if (a$.exists(scope.field)) {
                col = scope.field;
            }
            else { //If field is not passed, assume that it's the name in ng-model.
                var cs = $(el).attr("ng-model").split(".");
                col = cs[cs.length - 1]; //The last part of the member.
            }
            var rec = {};
            if (a$.exists(scope.$parent.r)) { // r is defined in the ng-table-editor directive.
                rec = scope.$parent.r;
            }
            else if (a$.exists(scope.$parent.recordid)) { // recordid is a form-level indication of the record which was clicked in an ng-table-editor.
                rec[col] = scope.$parent.$parent.table.records[scope.$parent.recordid][col]; //Still pointing to new object, but col needs populated.
            }
            else {
                //TODO: We need a default mechanism for fields (currently will all r={}, col="")
            }

            function uiComboReplace(opts) {
                el.hide();
                var val = rec[col];
                el.parent().append(makeselect(opts, val));
                if (el.parent().prop("tagName").toLowerCase() == "td") {
                    $(" select", el.parent()).css("width", "100%").css("border", "none").css("text-align", "center");
                }
                el.parent().children().last().unbind().bind("change", function () {
                    rec[col] = $(this).val(); //So how do the datepicker and colorpicker things work?!?!?
                    el.val($(this).val()).trigger("change");
                    /*
                    var val = $(this).val();
                    scope.$apply(function () {
                        el.val(val);
                        el.trigger("change");
                    });
                    */
                });
            }

            function uiColorPicker() {
                if (!readonly) {
                    el.spectrum({
                        showInput: true,
                        showInitial: true,
                        preferredFormat: "rgb",
                        color: rec[col], //TODO:More specific than I like.
                        clickoutFiresChange: true,
                        palette: [
                            ["transparent"]
                        ],
                        change: function (color) {
                            if (color._originalInput.a === 0) {
                                color = "transparent";
                            } else {
                                color = color.toHexString();
                            }
                            $(this).val(color);
                        }
                    });
                } else {
                    $(el).parent().css("background-color", rec[col]);
                    $(el).css("background-color", rec[col]);
                }
            }

            function uiDatePicker(readonly) {
                if (!readonly) {
                    el.css("width", "95px");
                    el.datepicker({
                        dateFormat: 'm/d/yy'
                    });
                }
            }
            function uiTimePicker(readonly) {
                if (!readonly) {
                		/* //This appears to work, but doesn't save the value in the model.
                    el.css("width", "95px");
                    el.timepicker({
                    });
                    */
                    el.hide();
                    el.parent().append('<input style="width:95px;" value="' + (a$.exists(rec[col]) ? rec[col] : "") + '" />');
                    el.parent().children().last().timepicker({ dropdown: false }).bind("change", function () {
                        rec[col] = $(this).val(); //So how do the datepicker and colorpicker things work?!?!?
                        el.val($(this).val()).trigger("change");
                    });

                }
            }
            
            function setDefault(d) {
            	rec[col] = d;
            	el.val(d); //Don't trigger change? .trigger("change")
            }
            
            function uiHtmlDropdown() {
                var bld = '<br /><div contentEditable="true" style="text-align: left; display:none; color:white;position:relative;z-index:1000;background-color:black; border: 2px solid grey; width: auto;height: auto;">';
                bld = bld + rec[col] + '</div>';
								el.parent().css("vertical-align", "top").css("position", "relative");
                el.parent().append(bld);
                el.on("click", function () {
                    var pd = $(this).parent().children().last();
                    var isvis = $(pd).css("display") != "none";
                    pd.show();
                    if (!isvis) {
                    	pd.trigger("focus");
                    }                    
                    $(this).hide();
                });
                el.parent().children().last().on("blur",function() {
                	$(" input", $(this).parent()).show();
                	$(this).hide();
                });
                
            }

            function uiPermissionDropdown() { //TODO: Rethink this as a single control (outside the table) that appears and is populated when field is clicked.  The Spectrum color picker works this way.
                el.parent().css("vertical-align", "top").css("position", "relative");
                var val = rec[col];
                //Can I put up a directive here, or is it better to just blow it in?
                //It actually needs to get data for the client names/numbers (yuck!), but it would be silly to make this junky.
                var clients = [{
                    name: "ERS",
                    val: "26"
                }, {
                    name: "CES",
                    val: "28"
                }, {
                    name: "BGR",
                    val: "29"
                }, {
                    name: "Chime",
                    val: "42"
                }, {
                    name: "Cox",
                    val: "43"
                }];
                var roles = ["CSR", "Team Leader", "Group Leader", "Quality Assurance", "Management", "CorpAdmin", "Admin"];
                var bld = '<div style="display:none; position:absolute;left:0px;top:30px;z-index:1000; background-color:white; border: 1px solid black; width: 300px; height: 200px;">';
                bld += '<div style="text-align:left;"><b>Permissions</b></div>';
                bld += '<div><div style="float:left;margin-left:6px;text-align:left;"><b>Clients:</b><br/>';
                for (var i in clients) {
                    bld += '<input class="uipdcc-' + clients[i].val + '" type="checkbox" />&nbsp;' + clients[i].name + '<br />';
                }
                bld += '</div><div style="float:left;text-align:left;margin-left: 10px;"><b>Roles:</b><br />';
                bld += '<input type="checkbox" /> CSR<br /><input type="checkbox" /> Team Leader<br /><input type="checkbox" /> Group Leader<br /><input type="checkbox" /> Quality Assurance<br /><input type="checkbox" /> Management<br /><input type="checkbox" /> CorpAdmin<br /><input type="checkbox" /> Admin<br /></div></div><div style="clear:left;margin-top:10px;font-weight:bold;text-align:center;" class="permission-syntax"></div>'
                el.parent().append(bld);
                el.bind("blur", function () {
                    var pd = $(this).parent().children().last();
                    pd.hide();
                }).bind("click", function () {
                    var pd = $(this).parent().children().last();
                    pd.show();
                    el.unbind("keyup").bind("keyup", function () {
                        var v = $(this).val();
                        var p = "";
                        var red = false;
                        if (v.length == 0) {
                            p = "All users pass.";
                        } else {
                            var ors = v.split("|");
                            if (ors.length > 1) {
                                p = "No syntax checking for multiple sets.";
                            } else {
                                sls = ors[0].split("/");

                                var clientsok = true;
                                if (sls[0].length == 0) {
                                    //Check them all!
                                    for (var i in clients) {
                                        $(" .uipdcc-" + clients[i].val, pd).attr("selected", "selected");
                                    }
                                } else {
                                    for (var i in clients) {
                                        $(" .uipdcc-" + clients[i].val, pd).removeAttr("selected");
                                    }
                                }
                                if (sls.length == 3) {
                                    p = "Permission is valid.";
                                } else {
                                    p = "Incorrect # of slashes (should be 2)";
                                    red = true;
                                }
                            }
                        }
                        $(" .permission-syntax", $(this).parent()).css("color", red ? "Red" : "Black").html(p);
                    });
                    //$(this).hide();
                });
                //el.trigger("click");
            }
            var readonly = (a$.exists(scope.edit) && (scope.edit != "inline")); //No edit attr means inline editing.
            var defaultdisplay = rec["id"] == "";
            if (!a$.exists(scope.$parent.dataview)) {
								//TODO: This has GOT to be standardized.
                //Free fields (expected to be in a var called "form", can this be universal?              

                if (Array.isArray(scope.$parent.form)) {
                	rec = scope.$parent.f; //I don't think this was good.  TODO: research and eliminate?
                }
                else if (a$.exists(scope.$parent.form)) {
	                rec = scope.$parent.form;	
                }

                if (col.toLowerCase().indexOf("date") >= 0) {
                    uiDatePicker(readonly);
                }
                else if (col.toLowerCase().indexOf("time") >= 0) {
                    uiTimePicker(readonly);
                }
                else if (col.toLowerCase().indexOf("color") >= 0) {
                    uiColorPicker(readonly);
                }
                else {
                    alert("NG: To use dynamic-ui, the parent scope must have these members: dataview, OR it can be a free field with recognizable name.");
                }
            }
            else if (true) {
                switch (scope.$parent.dataview) {
                    case "DAS:AttendanceTEST":
                   	case "DAS:JournalTEST":
                        switch (col) {
                            case "Date":
                            case "DateClosed":
                            case "goal_date":
                            case "follow_up_date":
                                uiDatePicker(readonly);
                                break;
                            case "ArrivalTime":
                            case "DepartureTime":
                            case "NotificationTime":
                                uiTimePicker(readonly);
                                break;
                            case "Occurrence":
                                if (!readonly) {
                                    uiComboReplace(["", "0.25", "0.5", "0.75", "1.0", "2.0", "3.0", "5.0", "10.0", "15.0", "0", "-0.25", "-0.5", "-1.0", "-2.0"]);
                                }
                                break;
                            case "Reason":
                                if (scope.$parent.dataview == "DAS:JournalTEST") {
                                    if (!readonly) {
                                        if (window.location.toString().toLowerCase().indexOf("//bgr") >= 0) {
                                            uiComboReplace(["",
                                                "Call Monitors",
                                                "Coaching",
                                                "Compliment",
                                                "Escalation Issue",
                                                "General Discussion",
                                                "Home Visit",
                                                "Owner Complaint",
                                                "Pattern Coaching-Accuracy",
                                                "Pattern Coaching-Adherence",
                                                "Pattern Coaching-Attendance",
                                                "Pattern Coaching-Behavior",
                                                "Pattern Coaching-Call Handling",
                                                "Pattern Coaching-Performance Counseling",
                                                "Side by Side",
                                                "1 on 1",
                                                "Training - Coaching",
                                                "Training - Performance",
                                                "Cancels",
                                                "Script Adherence"
                                            ]);
                                        }
                                        else if (window.location.toString().toLowerCase().indexOf("//ers") >= 0) {
                                            uiComboReplace(["",
                                                "Coaching",
                                                "Recognition",
                                                "Goal-setting",
                                                "Call Monitor",
                                                "General"
                                            ]);
                                      	}
                                      	else {
                                            uiComboReplace(["",
                                                "Coaching",
                                                "Recognition",
                                                "Goal-setting",
                                                "Call Monitor",
                                                "Performance Review",
                                                "General"
                                            ]);
                                        }
                                    }
                                }
                                break;
                            case "ActionTaken":
                                if (!readonly) {
                                    uiComboReplace(["",
                                        "1st Written Warning",
                                        "2nd Written Warning",
                                        "Final Written Warning",
                                        "Attendance Pattern Coaching",
                                        "FMLA Approved",
                                        "FMLA Pending",
                                        "None",
                                        "Operations Approved Time Off",
                                        "Verbal Warning",
                                        "Bereavement Time Off",
                                        "Coaching"
                                    ]);
                                }
                                break;
                            default:
                        }
                        break;
                    case "DBS:easycom":
                        el.parent().css("text-align", "center"); //TODO: This is not well-placed.  dynamic-ui is input-level, not form level.
                        switch (col) {
                            //Date Picker Example:                 
                            //el.css("width", "95px");                                            
                            //el.datepicker({                                            
                            //dateFormat: 'yy-mm-dd'                                            
                            //});                                            
                            case "Disallow":
                                if (defaultdisplay) setDefault("//");
                            case "Allow":
                                if (!readonly) {
                                    if ($.cookie("TP1Username") == "jeffgack") { //I know, this is cheating.
                                        uiPermissionDropdown();
                                    }
                                }
                                break;
                            case "Delivery":
                                if (!readonly) {
                                    uiComboReplace(["", "Push"]);
                                }
                                break;
                            case "Position":
                            		if (defaultdisplay) setDefault("notification");
                                if (!readonly) {
                                    uiComboReplace(["topbar", "filters", "agame", "messagebar", "notification"]);
                                }
                                break;
                            case "Message":
                            		if (defaultdisplay) setDefault("<h1>Headline</h1><h2>Body Text</h2>");
                            		if (!readonly) {
                            			if ($.cookie("TP1Username") == "jeffTESTgack") { //I know, this is cheating.
                            				uiHtmlDropdown();
                            			}
                            		}
                            		//This falls through on purpose.
                            case "Notes":
                                if (readonly) {
                                    $(el).parent().html('<div style="max-height: 40px;overflow-y:auto;">' + rec[col] + '</div>');
                                    $(el).hide();
                                }
                                break;
                            case "TextColor":
                            		if (defaultdisplay) setDefault("White");
                                uiColorPicker(readonly);
                                break;                               
                            case "BackgroundColor":
                            		if (defaultdisplay) setDefault("Red");
                                uiColorPicker(readonly);
                                break;
                            default:
                        }
                        break;
                    default:
                }
            } else { //Uneditable
                el.attr("disabled", "disabled");
            }
        }
    };
});
