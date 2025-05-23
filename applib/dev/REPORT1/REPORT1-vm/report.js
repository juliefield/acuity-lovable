//Deprecating (actually RETIRING) this method of editing.
angularApp.directive("ngAcuityPageAi", [function () {
    return {
    	templateUrl: '/applib/dev/REPORT1/REPORT1-view/prompteditor.htm?r=24', //For DEBUGGING/Styling
        scope: {
            prompts: "@",
            usage: "@" // monitor, cid, form
        },
        link: function (scope, element, attrs, legacyContainer) {

        if (true && (/* csf.CDS_ENABLED && */ ((a$.urlprefix(true).indexOf("mnt") == 0)) || ($.cookie("TP1Role") == "Admin") || (a$.urlprefix() == "da."))) {

            var gencds = false; //OLD way.
            var aidif = { prePrompt: false, monitorDefPrompt: false, postPrompt: false, scriptGuidance: false }; //RC
            var prompts = "prePrompt,monitorDefPrompt,postPrompt,scriptGuidance"; //RC

            //General prompts from aiPromptAnchor
            if ($("#aiPromptAnchor").length) {
                gencds = true; //NEW way
                aidif = {};
                prompts = $("#aiPromptAnchor").html();
                var ps = prompts.split(",");
                for (var ips in ps) {
                    aidif[ps[ips].split("|")[0]] = false;
                }
            }

            //DONE: Build the new markup generally
            if (gencds) {
                $(".gencds-anchor").html("");
                var bld = "";
                var ps = prompts.split(",");
                for (var ips in ps) {
                    bld += '<div class="cdsprompt-' + ps[ips].split("|")[0] + '-editor cdsprompt-editor" style="display:none;">';
                    bld += '  <h5>';
                    bld += ((ps[ips].split("|").length > 1) ? ps[ips].split("|")[1] : ps[ips]);
                    bld += '    <span class="ac-' + ps[ips].split("|")[0] + '-updated">(updated)</span><span class="ac-cdsprompt-hideshow"></span>';
                    bld += '  </h5>';
                    bld += '  <div class="ac-cds" id="CDSPROMPT_' + ps[ips].split("|")[0] + 'Editor"></div>';
                    bld += '</div>';
                }
                $(".gencds-anchor").html(bld);
                /*
                <div class="cdsprompt-css-editor" style="display:none;">
                <h5>Pre-Prompt <span class="ac-prePrompt-updated">(updated)</span><span class="ac-cdsprompt-hideshow"></span>
                <!-- <span class="ac-cdsprompt-left">&lt;</span> <span class="ac-cdsprompt-date" cid="CDSPROMPT_prePromptEditor"></span> <span class="ac-cdsprompt-right" >&gt;</span> -->
                </h5>
                <div class="ac-cds" id="CDSPROMPT_prePromptEditor"></div>
                </div>
                */

            }

            for (var key in aidif) {
                $(".ac-" + key + "-updated").hide();
                if ($("#lblAI_" + key).html() != $("#CDSPROMPT_" + key + "Content").html()) {
                    $(".ac-" + key + "-updated").show().html("(UPDATED)").css("margin-right", "10px");
                    aidif[key] = true;
                }
            }



            var promptprefix = "PROMPTS.";
            var promptbody = promptprefix;
            var oktoload = false;
            if (scope.usage == "report") {
                promptbody+= a$.gup("panelcid");
                oktoload = true;
            }
            else if (scope.usage == "monitor") {
                promptbody += $("#lblClient").html() + "." + $("#lblSqfcode").html();
                oktoload = true;
            }
            else {
                alert('No usage found for ng-acuity-page-ai (example: usage="monitor")');
                promptbody+= "NoUsageFound";
            }

            var voicefilefound = false;
            if (scope.usage == "monitor") {
                if ( $("#lblAI_voicefilename").length && ($("#lblAI_voicefilename").html() != "")) {
                    $(".ai-voice-message").html("Voice File: " + $("#lblAI_voicefilename").html());
                    $(".ac-ai-voice-upload").val("Change");
                    voicefilefound = true;
                }
                else {
                    $(".ai-voice-message").html("");
                    $(".ac-ai-voice-upload").val("Upload Voice File");
                    $(".ai-process-show").hide();
                }
                $(".ai-voice").show();
            }

            if (oktoload) {
                a$.ajax({
                    type: "POST",
                    service: "JScript",
                    async: true,
                    data: {
                        lib: "spine",
                        cmd: "aiProcessInit",
                        usage: scope.usage
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: ngProcessInit
                });

                function ngProcessInit(json) {
                    if (a$.jsonerror(json)) { } else {
                        scope.processes = json.processes;

                        $(".ai-process-select").html("");

                        $(".ai-step-single").remove(); //get rid of the mockups.

                        var bld = '<option value="">Select Process</option>';
                        for (var p in scope.processes) {
                            bld += '<option value="' + p + '">' + scope.processes[p].process_desc + '</option>';
                        }
                        $(".ai-process-select").html(bld);
                        $(".ai-process-select").on("change", function() {

                            var aiprev = (a$.gup("aiprev") == "") ? 0 : parseInt(a$.gup("aiprev"), 10);
                            $(".ai-step").hide();
                            $(".cdsprompt-editor").show();
                             $(".cdsprompt-save").show();
                            var p = $(this).val();
                            if (p == "") {
                                $(".ai-steps").hide();
                            }
                            else {
                                $(".ai-steps").show();
                                //Build the overview
                                bld = "";
                                for (var s in scope.processes[p].steps) {
                                    bld += "<tr>" + 
                                        '<td class="ac-table-step-select" style="cursor:pointer;" s="' + s + '">' + scope.processes[p].steps[s].step_desc + "</td>" +
                                        "<td>" + "01/01/2000" + "</td>" + 
                                        '<td>' + '<input type="button" value="' + scope.processes[p].steps[s].step_label + '" class="ac-ai-run" process="' + p + '" step="' + s + '" />' + '</td>' +
                                        '</tr>';
                                }
                                var alllab = "";
                                var scnt = 0;
                                for (var s in scope.processes[p].steps) {
                                    alllab += ((alllab!="") ? ",":"") + scope.processes[p].steps[s].step_label;
                                    scnt +=1;
                                }
                                if (scnt > 1) {
                                    alllab = "Run All (" + alllab + ")";
                                    bld += '<tr><td colspan="3">' + '<input type="button" value="' + alllab + '" class="ac-ai-run ai-run-all" process="' + p + '" step="' + s + '" />' + '</td></tr>';
                                }

                                $(".ai-steps-overview tbody").html(bld);

                                bld = '<option value="all" selected="selected">Overview</options>';
                                for (var s in scope.processes[p].steps) {
                                    bld += '<option value="' + s + '">' + scope.processes[p].steps[s].step_desc + '</option>';
                                }
                                $(".ai-steps-select").html(bld);

                                //If "this monitor" is a new monitor, that settings section should not be shown
                                //DONE: Generalize the datafield display (see ac-showtranscription below, and should be based on the flow variable.
                                //When datafield is voicefilename, it should say "Listen to Voice File"
                                //See results (transcriptiondev)


                                //TODO: Where do the settings for the current monitor come from?  stg
                                //It has to be in the action log.
                                //The process is also from the action log (stored with each action)
                                //

                                //TODO: The stg for each provider should be pulled from the new table ai_provider_default, not from ai_process.
                                //ai_provider_default needs a client default and a global default capabilities (client=0).

                                //TODO: Pass the list of providers.
                                var provbld = "";
                                //TODO: Load in the settings

                                bld = "";
                                for (var s in scope.processes[p].steps) {
                                    bld += '<div class="ai-step-single ai-step ai-step-' + s + '" step="' + scope.processes[p].steps[s].step + '" style="display:none;">' +
                                        '<div class="ai-step-subdiv">' +
                                          '<div class="ai-step-label">' + scope.processes[p].steps[s].step_desc + '</div>' +
                                          '<div class="ai-step-flow">' + scope.processes[p].steps[s].flow + '</div>' +
                                          '<div class="ai-setting-block">' +
                                            '<div class="ai-setting-block-label">Default</div>' +
                                            '<div class="ai-setting-provider">Provider: <select disabled="disabled"><option value="' + scope.processes[p].steps[s].provider + '">' + scope.processes[p].steps[s].provider + '</option></select></div>' +
                                            '<textarea class="ai-stg-editor ai-stg-default" disabled="disabled">' + scope.processes[p].steps[s].stg + '</textarea>' +
                                            '<input type="button" value="Update Default Settings" class="ac-ai-settings-default" step="' + scope.processes[p].steps[s].step + '" />' +
                                          '</div>' +

                                          '<div class="ai-setting-block">' +
                                            '<div class="ai-setting-block-label">Re-Run</div>' +
                                            '<div class="ai-setting-provider">Provider: <select><option value="' + scope.processes[p].steps[s].provider + '">' + scope.processes[p].steps[s].provider + '</option></select></div>' +
                                            '<textarea class="ai-stg-editor ai-stg-rerun"></textarea>' +
                                            '<div class="ac-showfullprompt ai-datafield-link" datafield="Full Prompt" p="' + p + '" s="' + s + '">Show Full Prompt</div>' +
                                            '<input type="button" value="' + scope.processes[p].steps[s].step_label + '" class="ac-ai-run" step="' + scope.processes[p].steps[s].step + '" />' +
                                          '</div>';

                                    if ($("#lblAI_ID").length) {
                                        bld +=
                                          '<div class="ai-setting-block">' +
                                            '<div class="ai-setting-block-label">This ' + scope.usage.charAt(0).toUpperCase() + scope.usage.slice(1)  + '</div>' +
                                            '<div class="ai-setting-provider">Provider: <select disabled="disabled"><option value="' + scope.processes[p].steps[s].provider + '">' + scope.processes[p].steps[s].provider + '</option></select></div>' +
                                            '<textarea class="ai-stg-editor ai-stg-current" disabled="disabled"></textarea>';

//date here
                                        if ($("#lblAI_entdt").length) {
                                            bld += '<div class="ai-nav-div"><span class="ac-ai-prev"><</span><span class="ai-nav-date">' + $("#lblAI_entdt").html() + '</span><span class="ac-ai-next">></span></div>';
                                        }

                                        bld += '<div class="ai-tokens-div">Tokens: (Used: <span class="ai-tokens-used">123</span>, $/M: <span class="ai-tokens-cost""">10</span>)</div>';
                                        //    '<div class="ac-showtranscription ai-datafield-link">Show Current Transcription</div>' +
                                        var fs = scope.processes[p].steps[s].flow.toString().split("->");
                                        var fss = fs[0].split("+");
                                        for (var f in fss) {
                                            if (fss[f].indexOf("[") == 0) {
                                                var datafield = fss[f].replace("[","").replace("]","");
                                                if (datafield == "voicefilename") {
                                                    bld += '<audio controls class="ai-audio-link"><source src="' + "TODO:VoiceFilePathHere" + '" type="audio/mpeg" />Audio Not Supported</audio>';
                                                }
                                                else {
                                                    bld += '<div class="ac-show' + datafield + ' ai-datafield-link" datafield="' + datafield + '">Show ' + datafield.charAt(0).toUpperCase() + datafield.slice(1) + '</div>';
                                                }
                                            }
                                        }
                                        if (fs.length > 1) {
                                            var datafield = fs[1].replace("[","").replace("]","");
                                            bld += '<div class="ac-show' + datafield + ' ai-datafield-link" datafield="' + datafield + '">Show Results (' + datafield.charAt(0).toUpperCase() + datafield.slice(1) + ')</div>';
                                        }
                                        bld += '</div>';
                                    }
                                    bld +=
                                         '</div>' +
                                    '</div>';

//                                        "DEBUG: Build Step " + scope.processes[p].steps[s].step + " (" + scope.processes[p].steps[s].step_desc + ") Here!" +
//                                        "</div>";
                                }
                                $(".ai-steps-wrapper").html(bld);

                                if (aiprev == 0) $(".ac-ai-next").hide();
                                try {
                                    if ((aiprev + 1) >= parseInt($("#lblAI_totalCount").html(), 10)) {
                                        $(".ac-ai-prev").hide();
                                    }
                                }
                                catch (e) { alert("debug:nav error:"); }

                                function reloadAI(pg) {
                                    var loc = window.location.toString();
                                    if (loc.indexOf("&aiprev=") > 0) {
                                        loc = loc.substr(0, loc.indexOf("&aiprev="));
                                    }
                                    loc += "&aiprev=" + pg;
                                    window.location = loc;
                                }
                                $(".ac-ai-prev").on("click", function () {
                                    reloadAI(aiprev + 1);
                                });
                                $(".ac-ai-next").on("click", function () {
                                    reloadAI(aiprev - 1);
                                });

                                $(".ai-steps-select").on("change", function() {
                                    var val = $(this).val();
                                    $(".ai-step").hide();
                                    var p = $(".ai-process-select").val();
                                    $(".cdsprompt-editor").hide();
                                    $(".cdsprompt-save").hide();
                                    for (var s in scope.processes[p].steps) {
                                        if ((val == "all") || (s == val)) {
                                            var flow = scope.processes[p].steps[s].flow;
                                            var fs = flow.split("->");
                                            var fss = fs[0].split("+");
                                            for (var f in fss) {
                                                if (fss[f].indexOf("[") != 0) {
                                                    $(".cdsprompt-" + fss[f] + "-editor").show();
                                                    $(".cdsprompt-save").show();
                                                }
                                            }
                                        }
                                    }
                                    $(".ai-step-" + val).show();
                                });
                                $(".ac-table-step-select").on("click", function() {
                                    $(".ai-steps-select").val($(this).attr("s")).trigger("change");
                                });

                                $(".ai-steps-overview").show();
                                $(".ai-steps-select").trigger("change");
                            }
                            
                        });

                        $(".ai-process-select").val("0").trigger("change");

                        $(".ai-datafield-link").on("click", function () {
                            var fieldval = $("#lblAI_" + $(this).attr("datafield")).html();
                            var jbld = $(this).attr("datafield") + ":\n";
                            try {
                                if ($(this).attr("datafield") == "Full Prompt") {
                                    var fs = scope.processes[$(this).attr("p")].steps[$(this).attr("s")].flow.toString().split("->");
                                    var fss = fs[0].split("+");
                                    for (var f in fss) {
                                        if (fss[f].indexOf("[") == 0) {
                                            var datafield = fss[f].replace("[","").replace("]","");
                                            if (datafield == "voicefilename") {
                                                jbld += "Voice File: " + $("#lblAI_voicefilename").html() + "\n\n";
                                            }
                                            else {
                                                jbld += $("#lblAI_" + datafield).html() + "\n\n";
                                            }
                                        }
                                        else {
                                            jbld += document.getElementById("CDSPROMPT_" + fss[f] + "Content").innerHTML + "\n\n";
                                        }
                                    }
                                }
                                else {
                                    var pjson = JSON.parse(fieldval);
                                    jbld += JSON.stringify(pjson, null, 2);
                                }
                            }
                            catch (e) {
                                jbld += fieldval;
                            }
                            $(".datafield-dialog").show().html('<div class="datafield-dialog-close">X</div><textarea style="border 1px solid gray;margin-top:20px;height:600px;width:90vw;">' + jbld + "</textarea>");
                            $(".datafield-dialog-close").on("click", function() {
                                $(".datafield-dialog").hide();
                            });
                        });

                        /*
                        if (scope.usage == "monitor") {
                            $(".ai-stg-current",".ai-step-1").text('{ "model": "whisper-1",\n "temperature": 0.8, "response_format": "verbose_json", "timestamp_granularities": "segment"}');
                            $(".ai-stg-rerun",".ai-step-1").text('{ "model": "whisper-1",\n "temperature": 0.8, "response_format": "verbose_json", "timestamp_granularities": "segment"}');
                            $(".ai-stg-default",".ai-step-1").text('{ "model": "whisper-1",\n "temperature": 0.8, "response_format": "verbose_json", "timestamp_granularities": "segment"}');
                            $(".ai-stg-current",".ai-step-2").text('{ "model": "gpt-4o", "max_tokens": 4096, "temperature": 0.0 }');
                            $(".ai-stg-rerun",".ai-step-2").text('{ "model": "gpt-4o", "max_tokens": 4096, "temperature": 0.0 }');
                            $(".ai-stg-default",".ai-step-2").text('{ "model": "gpt-4o", "max_tokens": 4096, "temperature": 0.0 }');
                            $(".ai-stg-current",".ai-step-3").text('{ "model": "gpt-4o", "max_tokens": 4096, "temperature": 0.0 }');
                            $(".ai-stg-rerun",".ai-step-3").text('{ "model": "gpt-4o", "max_tokens": 4096, "temperature": 0.0 }');
                            $(".ai-stg-default",".ai-step-3").text('{ "model": "gpt-4o", "max_tokens": 4096, "temperature": 0.0 }');
                        }

                        */

                    }
                }
            }



            //For Reference:
            if (scope.usage == "NOTmonitor") { //Old way (will be replaced when process flow is implemented?  Should that be here in this directive?
                $(".cdsprompt-editors", element).append('<br /><br /><input type="button" class="ac-ai-regenerate" value="Regenerate AI Evaluation.." /><span style="margin-left:20px;">Note: Any changes to the prompt must be SAVED before regenerating.</span>');
                $(".ac-ai-regenerate").css("cursor","pointer").on("click", function () {
                    $(this).attr("disabled", "disabled").val("Regenerating... The monitor will refresh when complete.");
                    $.post(
                        "https://aitest.acuityapmr.com/request",
                        {
                            prefix: a$.urlprefix().split(".")[0],
                            aiId: $("#lblAI_ID").html(),

                            promptbody: promptbody,

                            //DEBUG: Testing the saving of prompts (bypassing ai_process).
                            //flow: "prePrompt+monitorDef+[Diarization]+postPrompt+scriptGuidance->[returnText]",


                            usage: scope.usage,
                            process: "Whisper>DiarizeLLM>LLM",        //Based on ai_process_default convention.
                            steps: "3", //Could be "1,2,3" or "all"   //Step 3 is "Regenerate"
                            promptbody: promptbody,
                            //Sent if overriding default provider/settings (updating of default settings is a separate call).
                            //Override is only available if you're choosing a single step.
                            overrideStg: {
                                model: "gpt-4o",
                                temperature: 0.0,
                                max_tokens: 4096
                            },
                            overrideProvider: "OpenAI",


                             //These won't be passed, but will be filled in based on the process & step when server-side.
                            cmd: "",
                            queryType: "MONITOR_REDO_FROM_PROMPTS",
                            aiService: {
                                model: "gpt-4o",
                                temperature: 0.0,
                                max_tokens: 4096
                            }
                        },
                        function (data, status) { //is there some kind of error handling available here?
                            location.reload();
                        }
                    );
                });
            }

            $(".cdsprompt-editors").hide();

            var genEditors = {};

            if (gencds) {
                var ps = prompts.split(",");
                for (var ips in ps) {
                    var pr = ps[ips].split("|")[0];
                    if (!aidif[pr]) {
                        genEditors[pr] = CodeMirror(document.getElementById("CDSPROMPT_" + pr + "Editor"), {
                            lineNumbers: true,
                            mode: "text/html",
                            autoRefresh: true,
                            extraKeys: { "Ctrl-Space": "autocomplete" },
                            value: document.getElementById("CDSPROMPT_" + pr + "Content").innerHTML
                        });
                    }
                    else {
                        genEditors[pr] = CodeMirror.MergeView(document.getElementById("CDSPROMPT_" + pr + "Editor"), {
                            lineNumbers: true,
                            mode: "text/html",
                            autoRefresh: true,
                            extraKeys: { "Ctrl-Space": "autocomplete" },
                            value: document.getElementById("CDSPROMPT_" + pr + "Content").innerHTML,
                            orig: $("#lblAI_" + pr).html()
                        });
                    }
                    $(".cdsprompt-" + pr + "-editor").show();
                }

            }

            $(".ac-cdsprompt-hideshow").unbind().bind("click", function () {
                if ($(this).html() == "show") {
                    $(".ac-cds", $(this).parent().parent()).show();
                    $(this).html("hide");
                }
                else {
                    $(".ac-cds", $(this).parent().parent()).hide();
                    $(this).html("show");
                }
            });
            $(".ac-cdsprompt-hideshow").html("hide").each(function () { $(this).trigger("click"); });

            $(".cdsprompt-fiddle").show().unbind().bind("click", function () {
                if (false) { //($("#lblMode").html() != "new") {
                    alert("Please edit fiddles in a 'New' form, not in an existing monitor.");
                }
                else {
                    if ($(".cdsprompt-editors").eq(0).css("display") == "none") {
                        $(".cdsprompt-editors").show();
                    }
                    else {
                        $(".cdsprompt-editors").hide();
                    }
                }
            });
            $(".cdsprompt-save").unbind().bind("click", function () {
                var passedtests = true;
                //Add "failsafes" to be sure the content isn't outside of the block.
                /*
                if (htmlEditor.getValue().indexOf('id="lblSupervisor"') > 0) {
                alert("ERROR: Your HTML content is reaching outside of the content area.\n\nThis can be caused by malformed HTML tags\n(a missing closing </div>, for example).\n\nPlease review the html content and remove the excess content.\nIf you need assistance, please contact Jeff Gack.");
                passedtests = false;
                }
                */
                if (passedtests) {
                    if (gencds) {
                        var ps = prompts.split(",");
                        for (var ips in ps) {
                            var pr = ps[ips].split("|")[0];
                            var data = {
                                lib: "qa",
                                cmd: "saveCDS",
                                bodyid: promptbody, //TODO: May differ based on the usage (directive)/
                                projectnumber: "AI_PROMPTS",
                                tagid: "CDSPROMPT_" + pr + "Content",
                                content: aidif[pr] ? genEditors[pr].editor().getValue() : genEditors[pr].getValue()
                            };
                            a$.ajax({
                                type: "POST",
                                service: "JScript",
                                async: false, //NOT ASYNC
                                data: data,
                                dataType: "json",
                                cache: false,
                                error: a$.ajaxerror
                            });
                        }
                        if (a$.gup("prompthistory") == "") {
                            location.reload();
                        }
                        else {
                            return_to_v1(); //Don't risk prompthistory remaining as a parameter.
                        }
                    }
                }
            });
                //*********************************** End Prompt Management Section ************************
        }
        }
    }
} ]);

angularApp.directive("ngAcuityReportEditor", [function () {
    return {
    		//templateUrl: '/applib/dev/REPORT1/REPORT1-view/editor.htm', //For DEBUGGING/Styling
        template: '<div class="modal1-base" id="ngReportsEditor" style="display:none;z-index:99998;">' +
                '<div class="dev-display-reports-controls">' +
                '	<label>cid:</label><span class="dev-display-reports-cid"></span>' +
              	'</div>' +
                '<div class="dev-display-reports">' +
                '    Developer Panels' +
                '</div>' +
                '<div class="dev-display-reports-controls">' +
                '    <input type="button" class="dev-display-reports-test" value="Test" />' +
                '    <input type="button" class="dev-display-reports-save" value="Save" />' +
                '     <label> Usage:</label><select class="dev-display-reports-usage"></select>' +
                '     <label> Render As:</label><select class="dev-display-reports-render"></select>' +
                '     <label> Params:</label><input style="width:300px" class="dev-display-reports-params" />' +
                '</div>' +
								'</div>',        
			  scope: {
            text: "@"
        },
        link: function (scope, element, attrs, legacyContainer) {
        }
    }
} ]);
//Using innerhtml in a directive is complex (using transclude).
//I need a quick solution, so just putting a few cases into templates.
//The broadcast machinery should behave similarly.
angularApp.directive("ngAcuityFilterButtonToggle", ['api', '$rootScope', function (api,$rootScope) {
    return {
    	  template: '<button ng-class="isactive(1)" ng-click="setactive(1)">{{text1}}</button>' +
    	  					'<button ng-class="isactive(2)" ng-click="setactive(2)">{{text2}}</button>',
        scope: {
        	assoc: "@",
            text1: "@",
            params1: "@",
            text2: "@",
            params2: "@"
        },
        link: function (scope, element, attrs, legacyContainer) {
                	
        	scope.num = 1;
        	
        	scope.isactive = function(num) {
        		if (scope.num == num) {
        			return "active";
        		}
        		else {
        			return "";
        		}
        	}

        	scope.setactive = function (num) {
        		//alert("debug: broadcast params" + num + ": " + scope["params" + num]);
        		scope.num = num;
            $rootScope.$broadcast('paramsOverride', {
            	assoc: scope.assoc,
            	params: scope["params" + num]
            });

          }        
      	}
    }
} ]);


angularApp.directive("ngAcuityReportTitle", ['api', '$rootScope', function (api,$rootScope) {
    return {
    	  template: '<div class="prt-title" style="display:none;text-align: center; font-size: 18px; padding: 5px;"></div>',
        scope: {
       	    assoc: "@",
            override: "@"
        },
        require: '^ngLegacyContainer',
        link: function (scope, element, attrs, legacyContainer) {
          var title = $("#lblTitle").html();
          if (scope.override) {
            if (scope.override != "") {
                title = scope.override;
            }
          }
          if ((title != null) && (title != "")) {
              $(".prt-title",element).html(title).show();
              if (window.self == window.top) {
                $(document).attr("title",title);                
              }
          }

      	}
    }
} ]);


angularApp.directive("ngAcuityReportFilter", ['api', '$rootScope', function (api,$rootScope) {
    return {
    	  template: '<span class="rpt-filter"></span>',
        scope: {
       	    assoc: "@",
            filtername: "@",
            filtertype: "@",
            prompt: "@",
            options: "@",
            requiresubmit: "@",
            hideforroles: "@"
        },
        require: '^ngLegacyContainer',
        link: function (scope, element, attrs, legacyContainer) {

          if (!legacyContainer.scope.CustomFilters) {
            legacyContainer.scope.CustomFilters = [];
          }

          if ($.cookie("TP1Subrole") != "TeamLead") { //Teamleads get a pass from the hideforroles attribute.
              if (scope.hideforroles && (scope.hideforroles != "")) {
                  var rs = scope.hideforroles.toString().split(",");
                  for (var r in rs) {
                      if ($.cookie("TP1Role").toString().toLowerCase() == rs[r].toString().toLowerCase()) {
                          return false;
                      }
                  }
              }
          }

          if (scope.filtertype == "input") {
            $(".rpt-filter",element).html((scope.prompt?scope.prompt + ":&nbsp;":"") + '<input class="thefilter" type="text">');
            legacyContainer.scope.CustomFilters.push({ name: scope.filtername, type: scope.filtertype, value: "" });
            $(".rpt-filter input",element).bind("change", function() {
                for (var f in legacyContainer.scope.CustomFilters) {
                    if (legacyContainer.scope.CustomFilters[f].name == scope.filtername) {
                        legacyContainer.scope.CustomFilters[f].value = $(this).val();
                    }
                }
            });
          }
          else if (scope.filtertype == "select") {
            if (!scope.options) {
              $(".rpt-filter",element).html("No 'options' attribute found for filtertype 'select'.  Example: options=\"sel1,sel2\".");
            }
            else {
                var obld = "";
                var osp = scope.options.toString().split(",");
                for (var ospi in osp) {
                    var osps = osp[ospi].split("|");
                    obld += '<option value="' + osps[0] + '">' + ((osps.length > 1) ? osps[1] : osps[0]) + '</option>';
                }
                $(".rpt-filter",element).html((scope.prompt?scope.prompt + ":&nbsp;":"") + '<select class="thefilter">' + obld + '</select>');
                legacyContainer.scope.CustomFilters.push({ name: scope.filtername, type: scope.filtertype, value: "" });
                $(".rpt-filter select",element).bind("change", function() {
                    for (var f in legacyContainer.scope.CustomFilters) {
                        if (legacyContainer.scope.CustomFilters[f].name == scope.filtername) {
                            legacyContainer.scope.CustomFilters[f].value = $(this).val();
                        }
                    }
                    if (scope.requiresubmit != "true") {
                      ko.postbox.publish("ReportSubmitClicked", scope.assoc);
                    }   
                });
            }
          }
          else {
            $(".rpt-filter",element).html("Invalid Filter Type");
          }


      	}
    }
} ]);

angularApp.directive("ngAcuityReportSubmit", ['api', '$rootScope', function (api,$rootScope) {
    return {
    	  template: '<input class="rpt-submit" type="button" value="Submit" />',
        scope: {
       	    assoc: "@"
        },
        require: '^ngLegacyContainer',
        link: function (scope, element, attrs, legacyContainer) {
          $(".rpt-submit",element).bind("click", function() {
            ko.postbox.publish("ReportSubmitClicked", scope.assoc);
            return false;
          });

      	}
    }
} ]);

angularApp.directive("ngAcuityReportLaunch", ['api', '$rootScope', function (api,$rootScope) {
    return {
    	  template: '<input class="rpt-launch" type="button" value="Launch2" />',
        scope: {
       	    cid: "@",
            label: "@",
            frame: "@",
            formid: "@"
        },
        require: '^ngLegacyContainer',
        link: function (scope, element, attrs, legacyContainer) {
          $(".rpt-launch",element).val(scope.label ? scope.label : "Launch").bind("click", function() {
            if (scope.frame == "Form") {
                if ($(".qa-reportframe").length == 0) { 
                    var bld = '<div class="report-frame-popup qa-wrapper-popup qa-reportframe" style="display:block;">'; 
                    bld += '<div class="qa-wrapper2-popup qa-wrapper2-popup_reportframe" style="height:80%;width:80%">'; 
                    bld += ' <div class="qa-close"><i class="fa-fa-times" aria-hidden="true">::before</i></div>'; 
                    bld += '  <div class="qa-box-popup">';
                    //TODO: Generalize (semi-hardcoded)
                    bld += '<iframe id="FormIframe" src="../jq/monitors/V3/Form_base_1_multi.aspx?prefix=' + a$.urlprefix().split(".")[0] + '&formid=' + scope.formid + '&masterid=' + '" style="width:100%;height:600px; border:0px;"></iframe>';
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
                alert("debug: launch report with cid=" + scope.cid + " (a popup?)");
            }
            //ko.postbox.publish("ReportSubmitClicked", scope.assoc);
            return false;
          });
      	}
    }
} ]);

  

angularApp.directive("ngAcuityReportSearch", ['api', '$rootScope', function (api,$rootScope) {
    return {
    	  template: '<input class="rpt-searchbox" type="text" value="" placeholder="Search Report" />',
        scope: {
       	    assoc: "@"
        },
        require: '^ngLegacyContainer',
        link: function (scope, element, attrs, legacyContainer) {
          scope.savedfilter = "";
          $(".rpt-searchbox",element).unbind().on("input",function() {
              //alert("debug: filter=" + $(this).val());
              var f = $(this).val();
              if (f != scope.savedfilter) {
                scope.savedFilter = f;
                ko.postbox.publish("SearchChange", f);
              }
          }); 
      	}
    }
} ]);

angularApp.directive("ngAcuityReportRefresh", ['api', '$rootScope', function (api,$rootScope) {
    return {
    	  template: '<div class="rpt-refresh">&nbsp;</div>',
        scope: {
            assoc: "@",
            hideforroles: "@"
        },
        require: '^ngLegacyContainer',
        link: function (scope, element, attrs, legacyContainer) {

          if ($.cookie("TP1Subrole") != "TeamLead") { //Teamleads get a pass from the hideforroles attribute.
              if (scope.hideforroles && (scope.hideforroles != "")) {
                  var rs = scope.hideforroles.toString().split(",");
                  for (var r in rs) {
                      if ($.cookie("TP1Role").toString().toLowerCase() == rs[r].toString().toLowerCase()) {
                          $(element).html("");
                          return false;
                      }
                  }
              }
          }

          scope.minutes = 0.0;
          $(".rpt-refresh",element).attr("title","Click to refresh report.");
          ko.postbox.subscribe("RefreshReportCachestamp", function (o) {
            if ((o.assoc == scope.assoc) || (!scope.assoc)) {
                scope.minutes = (o.cache.ageSeconds / 60.0);
                function addminute() {
                    $(".rpt-refresh",element).attr("title","Report Age: " + scope.minutes.toFixed(1) + " minute" + ((scope.minutes != 1.0)?"s":"") + ".  Click to refresh.");
                    scope.minutes += 0.1;
                    scope.mytimeout = setTimeout(addminute,6000);
                }
                clearTimeout(scope.mytimeout);
                addminute();
            }            
          });

          $(".rpt-refresh",element).unbind().on("click",function() {
              //alert("debug: refresh report");
              ko.postbox.publish("RefreshReportCacheOverride", scope.assoc);
          });
      	}
    }
} ]);

angularApp.directive("ngAcuitySidekickHide", ['api', '$rootScope', function (api,$rootScope) {
    return {
    	  template: '<span></span>',
        scope: {
       	    assoc: "@"
        },
        require: '^ngLegacyContainer',
        link: function (scope, element, attrs, legacyContainer) {
            scope.hidden = false;
            if (true) { //2023-01-14 - Sidekick for Managers enabled for everyone.  ((a$.urlprefix() == "collective-solution.")||(a$.urlprefix() == "km2.")) {
                try {
                    if (
                        ($.cookie("TP1Username").toLowerCase() == legacyContainer.scope.filters.CSR.toLowerCase())
                        && ($.cookie("TP1Subrole") != "TeamLead")
                    ) { //If you ARE the CSR on startup, then don't respond to filter changes.
                       $(".sidekick-top-panel,.sidekick-agent-panel,.sidekick-bottom-panel").hide();
                    }
                    else {
                        function showhidepanels() {
                            if ((legacyContainer.scope.filters.Team == "each")
                            || (legacyContainer.scope.filters.Team.indexOf(",") > 0)
                            || (legacyContainer.scope.filters.Team == ""))
                            {
                                //$(".sidekick-top-panel,.sidekick-agent-panel,.sidekick-bottom-panel").hide(); //Old way
                                $(".sidekick-top-panel").show(); //2023-08-09 - Showing Top panels for EVERY case except if you're the CSR.
                                $(".sidekick-agent-panel,.sidekick-bottom-panel").hide(); //2023-08-09 - Still hide the agent and bottom panels.
                                /* if (!scope.hidden) {
                                    alert("debug:Hiding Sidekick Panels");
                                    scope.hidden = true;
                                } */
                            }
                            else {
                                $(".report-touchcount").show(); //Getting hidden for some reason...
                                $(".sidekick-top-panel,.sidekick-agent-panel,.sidekick-bottom-panel").show();
                                $(".report-touchcount").show(); //Getting hidden for some reason...
                                /* if (scope.hidden) {
                                    alert("debug:Showing Sidekick Panels");
                                    scope.hidden = false;
                                } */
                            }
                        }
                        ko.postbox.subscribe("Filters", function (newValue) {
                          showhidepanels();
                        });
                        showhidepanels();
                    }
                }
                catch (e) {
                }
            }
      	}
    }
} ]);


angularApp.directive("ngAcuityFilterSelect", ['api', '$rootScope', function (api,$rootScope) {
    return {
    	  template: '<select ng-model="selectedFilter" ng-change="changeSelect()"><option ng-repeat="x in sels" value="{{x.val}}">{{x.name}}</option></select>',
        scope: {
        	  assoc: "@",
            action: "@",
            default: "@",
            lookback: "@"
        },
        require: '^ngLegacyContainer',
        link: function (scope, element, attrs, legacyContainer) {
          if (!a$.exists(legacyContainer.scope.filters)) legacyContainer.scope.filters = {};
          scope.SavedCSR = legacyContainer.scope.filters.CSR;
          scope.setFilterSelect = function() {
        	if (scope.action == "KPI_SUBKPI") {
                scope.$apply(function () {
            		scope.sels = [
            			{ name: "Balanced",
            				val: "KPI=&SubKPI="
        	    		}
        		    ];
        		    if (a$.exists(scope.default)) {
        			    scope.selectedFilter = scope.default;
            		}
            		if (!a$.exists(scope.lookback)) {
            			scope.lookback = 90;
        	    	}
                });

                a$.ajax({
                    type: "POST",
                    service: "JScript",
                    async: true,
                    data: {
                        lib: "spine",
                        cmd: "getMe",
                        who: "CSR",
                        CSR: legacyContainer.scope.filters.CSR,
                        members: ["KPI_SUBKPI"],
                        lookback: scope.lookback,
                    },
                    dataType: "json",
                    cache: false,
                    error: testerr, //a$.ajaxerror,
                    success: ngFilterSelectUpdate
                });
                function testerr(json) {
                    var d=1;
                    d=2;
                }
                function ngFilterSelectUpdate(json) {
                    if (a$.jsonerror(json)) { } else {
                        if (a$.exists(json.me)) {
                     	    if (a$.exists(json.me.sels)) {
                                scope.$apply(function () {
                		            scope.sels = scope.sels.concat(json.me.sels);
                                });
                                //CLUGUE to get rid of a starting element.
                                $("select",element).val("KPI=");
                            }
               	            else {
               		            //alert("debug: KPI_SUBKPI failed to return a result.")
               	            }
                        }
                    }
                }
/*
            api.getMe({
                who: "CSR",
                members: ["KPI_SUBKPI"],
                lookback: scope.lookback
            }).then(function (json) {
                if (a$.exists(json.me)) {
             	    if (a$.exists(json.me.sels)) {
                        scope.$apply(function () {
                		    scope.sels = scope.sels.concat(json.me.sels);
                        });
                    }
               	    else {
               		    alert("debug: KPI_SUBKPI failed to return a result.")
               	    }                    
                 }                
            });
*/
        	}            
          }
        	
        	scope.changeSelect = function() {
            $rootScope.$broadcast('paramsOverride', {
            	assoc: scope.assoc,
            	params: scope.selectedFilter
            });
        	}

            try {
                ko.postbox.subscribe("Filters", function (newValue) {
                    if (scope.SavedCSR != legacyContainer.scope.filters.CSR) {
                        scope.SavedCSR = legacyContainer.scope.filters.CSR;
                        scope.setFilterSelect();
                    }
                });
            }
            catch (e) {
            }
            scope.setFilterSelect();
        	
      	}
    }
} ]);

//Using innerhtml in a directive is complex (using transclude).
//I need a quick solution, so just putting a few cases into templates.
//The broadcast machinery should behave similarly.
/*
angularApp.directive("ngAcuityReportBarSelect",	function() {
	return({
		compile: function compile( tElement, tAttributes ) {},
		priority: 1500.1,
		restrict: "A"
	});
});
*/

angularApp.directive("ngAcuityReportBarSelect", ['api', '$compile', '$rootScope', function (api,$compile,$rootScope) {
    return {
    	  /* template: '<button ng-class="isactive(1)" ng-click="setactive(1)">{{text1}}</button>' +
    	  					'<button ng-class="isactive(2)" ng-click="setactive(2)">{{text2}}</button>',
    	  */
    	  compile: function( tElement, tAttributes ) {
    	  	var htmlContent = tElement.html();
    	  	tElement.html("");
    	  	return function postLink(scope, elem, attrs) {

                function showit() {
                    //scope.$apply(function () {
        	  		  var $html = $('<div />',{ html:htmlContent });
        	  		  elem.append( $compile( $html.html() )(scope) );

		    		  $("button",elem).bind("click",function() {
			    	    //alert("debug:clicked");
				    	var par = $(this).attr("params");
					    if (a$.exists(par)) {
	   			        scope.$apply(function () {
		            	    $rootScope.$broadcast('paramsOverride', {
        		        		assoc: scope.assoc,
            		    		params: par
                		    });	   			    	
	   		    	      });
	   			          $("button",elem).each(function() {
	   			        	if ($(this).hasClass("active")) {
	   			    	      $(this).removeClass("active");
	   			    	    }
	   			        });
	   			        $(this).addClass("active");
					  }
			        //});
                  });
                }						

                var acp = "";
                if (scope.allowconfigparam != null) {
                    if (scope.allowconfigparam.split("=").length > 1) {
                        acp=scope.allowconfigparam;
                    }
                }                
                
                if (acp == "") {
                    showit();
                }
                else {
                  a$.getConfigParameterByName(acp.split("=")[0],function(val) {
                    if (a$.exists(val.ParamValue)) {
                      if (val.ParamValue == acp.split("=")[1]) {
                          showit();
                      }                    
                    }
                  });
                }
    	  	}
    	  },
        scope: {
        	  assoc: "@",
              allowconfigparam: "@"
        }
    }
} ]);

angularApp.directive("ngAcuityReportSelectSelect", ['api', '$compile', '$rootScope', function (api,$compile,$rootScope) {
    return {
    	  /* template: '<button ng-class="isactive(1)" ng-click="setactive(1)">{{text1}}</button>' +
    	  					'<button ng-class="isactive(2)" ng-click="setactive(2)">{{text2}}</button>',
    	  */
    	  compile: function( tElement, tAttributes ) {
    	  	var htmlContent = tElement.html();
    	  	tElement.html("");
    	  	return function postLink(scope, elem, attrs) {
    	  		var $html = $('<div />',{ html:htmlContent});
    	  	    elem.append( $compile( $html.html() )(scope) );
				$("select",elem).bind("change",function() {
					//alert("debug:clicked");
					var par = $(this).val();
					if (a$.exists(par)) {
	   			    	scope.$apply(function () {
		            	    $rootScope.$broadcast('paramsOverride', {
    		        		    assoc: scope.assoc,
        		    		    params: par
            			    });	   			    	
	   			    	});
    	  	        }
                });
            }
    	  },
        scope: {
        	  assoc: "@"
        }
    }
} ]);


/*
 '<div class="modal1-base" id="ngReportsEditor" style="display:none;z-index:99998;">' +
                '<div class="dev-display-reports-controls">' +
                '	<label>cid:</label><span class="dev-display-reports-cid"></span>' +
              	'</div>' +
                '<div class="dev-display-reports">' +
                '    Developer Panels' +
                '</div>' +
                '<div class="dev-display-reports-controls">' +
                '    <input type="button" class="dev-display-reports-test" value="Test" />' +
                '    <input type="button" class="dev-display-reports-save" value="Save" />' +
                '     <label> Usage:</label><select class="dev-display-reports-usage"></select>' +
                '     <label> Render As:</label><select class="dev-display-reports-render"></select>' +
                '</div>' +
								'</div>',        
                                */

                                //<!-- ng-bind-html="reporthtml()" -->  removed from ThisReport markup.

angularApp.directive("ngAcuityReport", ['api', '$compile', '$rootScope', function (api, $compile, $rootScope) {
    return {
        //templateUrl: "report.htm?" + Date.now(), //FOR DEBUGGING/Styling
        template: '<div class="report-wrapper">' +
										'<div class="dev-bug dev-bug-collapsed" ng-show="devshowing()"></div>' +
										'<div class="dev-bug-verbose" style="display:none;">' +
                '<div class="dev-display-reports-controls">' +
                '	<label>cid:</label><span class="dev-display-reports-cid"></span>' +
              	'</div>' +
                '<div class="dev-display-reports">' +
                '    Developer Panels' +
                '</div>' +
                '<div class="dev-display-reports-controls">' +
                '    <input type="button" class="dev-display-reports-test" value="Test Query" />' +
                '    <input type="button" class="dev-display-reports-save" value="Save Query" />' +
                '    &nbsp;<input type="checkbox" class="dev-display-client-specific" value="On" /> Client-Specific' +
                '     &nbsp;&nbsp;<label> Usage:</label><select class="dev-display-reports-usage"></select>' +
                '    <input type="button" class="dev-display-format" value="Format SQL" />' +
                '    <label> Render As:</label><select class="dev-display-reports-render"></select>' +
                '     <label> Params:</label><input style="width:300px" class="dev-display-reports-params" />' +
                '</div>' +
                '<div class="dev-display-chartdefs">' +
                '    Chart Definition Panel' +
                '</div>' +
                                        '</div>' +
                                        '<div class="progressindicator" style="z-index:10; position:absolute; top: 50%; left: 50%;display:none;">Loading...</div>' +
  									'<div class="ThisReport"></div>' +
										'</div>' +
										'<div class="modal1-shadow" ng-show="detailsshowing()">' +
    								'<div class="modal1-base">' +
        							'{{detailstext}}' +
        							'<div class="link report-details-link" ng-click="showdetails(false)">hide details</div>' +
    								'</div>' +
									'</div>',
        scope: {
            name: "@",
            assoc: "@",
            text: "@",
            details: "@",
            cid: "@",
            mntcid: "@",
            manualfilters: "@", //Rely on filters passed in cookies (don't read the filters).
            filters: "@",
            panel: "@",
            hidetopper: "@",
            hidetopheader: "@",
            treeview: "@",
            treedepth: "@",
            servercacheminutes: "@",
            browsercacheminutes: "@",
            toppertext: "@", //In Topper (black line at top)
            headertext: "@", //In header (first th element, assumes it isn't used for subkpis, etc).
            noscroll: "@",
            scopehighlight: "@",
            scopeselect: "@",
            extendkludge: "@",
            reportclass: "@",
            requiresearch: "@",
            noresize: "@",
            waitforsubmit: "@",
            csrselfcheck: "@",
            dashboard: "@",
            islive: "@",
            allowprefix: "@", //Only relevant if islive="false"
            hideforroles: "@",
            killdrill: "@",
            fixheader: "@", //Temporary, perhaps
            allowconfigparam: "@",
            qsttable: "@",
            qstreadonly: "@",
            userpopup: "@",
            waitforvisible: "@", //ID of click element for testing for visible required.  TODO: Can this somehow test for visibility independently?
            expander: "@", //force expander if "true" (Expander isn't always applied to charts).
            showdatepicker: "@",
            suppressjournallink: "@",
            huddle: "@"   // recent or history
        },
        require: '^ngLegacyContainer',
        link: function (scope, element, attrs, legacyContainer) {

            scope.beenvisible = false;


          function showit() {
            if (!a$.exists(legacyContainer.scope.filters)) legacyContainer.scope.filters = {};
            //DONE: Horrible place to put this, but I'm going to leave it here.
            if (!exists(window.apmChartOptions)) {
                window.apmChartOptions = {};
                window.apmCharts = {};
            }
            if (scope.servercacheminutes == "") {
                scope.servercacheminutes = "0";
            }
            scope.currentUid = "";
            scope.donewaiting = true;
            scope.savedfilter = "";

            if (scope.islive && (scope.islive == "false")) {
                var processme = false;
                if (scope.allowprefix && (scope.allowprefix != "")) {
                    var ps = scope.allowprefix.toString().split(",");
                    for (var p in ps) {
                        if (a$.urlprefix().split(".")[0] == ps[p]) {
                            processme = true;
                            //alert("debug: affirmatively allowing prefix " + ps[p]);
                            break;
                        }
                    }
                }
                if ((!processme) && (a$.urlprefix(true).indexOf("mnt") != 0) && (a$.urlprefix(true).indexOf("alpha") != 0)) {
                    //alert("debug: scope.islive = false for cid=" + scope.cid);
                    return false;
                }
            }

            if ($.cookie("TP1Subrole") != "TeamLead") { //Teamleads get a pass from the hideforroles attribute.
                if (scope.hideforroles && (scope.hideforroles != "")) {
                    var rs = scope.hideforroles.toString().split(",");
                    for (var r in rs) {
                        if ($.cookie("TP1Role").toString().toLowerCase() == rs[r].toString().toLowerCase()) {
                            return false;
                        }
                    }
                }
            }

            if (true) { //($.cookie("TP1Username") == "jgardner") {
                if (!scope.beenvisible) {
                    if (scope.waitforvisible && (scope.waitforvisible != "")) {
                        var vis = false;
                        if ($(scope.reportSelector).is(":visible")) {
                            vis = true;
                        }
                        else if (scope.waitforvisible == "#openbox-button, #journaldetailsbox") {
                            if ($("i","#openbox-button").hasClass("fa-minus")) {
                                vis = true; //Already OPEN
                            }
                        }

                        if (vis) { //$(scope.reportSelector).is(":visible")) {
                            console.log("debug:" + scope.cid + " is visible");
                            scope.beenvisible = true;
                        }
                        else {
                            console.log("debug:" + scope.cid + " is NOT visible");
                            $(scope.waitforvisible).bind("click", function() {
                                
                                var vis = true;
                                var hotgen = false;
                                if (scope.waitforvisible == "#openbox-button, #journaldetailsbox") {
                                    if ($("i","#openbox-button").hasClass("fa-plus")) {
                                        vis = true; //OPENING it now.
                                    }
                                }
                                else {
                                    hotgen = true;
                                    scope.beenvisible = false;
                                }
                                console.log("debug:click:" + scope.cid + " visible:" + vis);
                                if (vis || hotgen) {
                                    if (!scope.beenvisible) {
                                        console.log("debug:click:now generating: " + scope.cid);
                                        scope.beenvisible = true;
                                        showit();
                                    }
                                }
                                return false;
                            });
                            return false;
                        }
                    }
                }
            }
            scope.beenvisible = true;

            if (!a$.exists(window.nextid)) {
                window.nextid = 100;
            }
            /*
                if ($.cookie("TP1Username") == "jeffgack") {
                    ko.postbox.subscribe("MessageReceived", function (json) {
                        alert("debug: Message Received, id=" + json.idmsg);
                    });
                    ko.postbox.subscribe("MessageRead", function (json) {
                        alert("debug: Message Read, id=" + json.idmsg);
                    });
                    ko.postbox.subscribe("ActiveTabClicked", function (json) {
                        alert("debug: Active Tab Change, text=" + json.tabtext);
                    });
                }
            */
            
            $(window).resize(function() {
            	//alert("debug: ng-acuity-report resizing");
                if (scope.donewaiting) {
                    scope.donewaiting = false;
                    if (scope.noresize != "true") {
                        setTimeout(function() {
                            scope.donewaiting = true;
                            scope.getreport();
                        }, 1000);
                    }
                }
            });

            scope.checkfilters = function () {
                if ($.cookie("CSR") != legacyContainer.scope.filters.CSR) {
                    legacyContainer.scope.filters.CSR = $.cookie("CSR");
                    $(scope.reportSelector).html('<h1 class="refreshing">Refreshing</h1>');
                    scope.getreport();
                }
                else if ($.cookie("Team") != legacyContainer.scope.filters.Team) {
                    legacyContainer.scope.filters.Team = $.cookie("Team");
                    $(scope.reportSelector).html('<h1 class="refreshing">Refreshing</h1>');
                    scope.getreport();
                }
                setTimeout(scope.checkfilters, 300);
            }
         
            //CHANGE: 2018-10-03 - Allow a title to be passed.
            function acuitytable_download(downloadtype, sel, title) {
                /* CHANGE: 2021-02-10 - This is obsolete
                var mya = new Array();
                mya = $(sel).getDataIDs(); // Get All IDs
                var data = $(sel).getRowData(mya[0]); // Get First row to get the labels
                */

                var html = "";
                var first = true;
                var foundsomething = false;
                for (var i = -1; i <= 0; i++) {
                    first = true;
                    //$("thead tr:nth-child(" + ($("thead tr", sel).length + i) + ") th", sel).each(function () {
                    $("thead tr:nth-child(" + ($("tr", $("thead", sel).eq(0)).length + i) + ") th", sel).each(function () {
                        if (($(this).is(":visible")) && ($(this).css('display') !== 'none')) {
                            if (!first) html += "\t";
                            first = false;
                            if ($(this).css('color') == 'rgb(255, 255, 255)') {
                                html += " ";
                            }
                            else {
                                var mte = $(this).clone().children().remove().end().text();
                                mte = mte.replace(/&nbsp;/gi, "");
                                if (mte.charCodeAt(0) == 160) mte = "";
                                if (mte == "") { //Maybe it's an anchor.
                                    if ($(" a", this).length > 0) {
                                        mte = $(" a", this).html();
                                    }
                                    else if ($(" .report-titlelink", this).length > 0) { //MADELIVE
                                        mte = $(" .report-titlelink", this).html();
                                    }
                                    else if ($(" div", this).length > 0) {
                                        mte = $(" div", this).html();
                                    }
                                }
                                if (mte != "") {
                                    foundsomething = true;
                                    if (mte.indexOf(",") >= 0) {
                                        mte = '"' + mte + '"';
                                    }
                                    html += mte;
                                }
                                else {
                                    html += " ";
                                }
                            }
                        }
                    });
                    html = html + "\n";
                }
                //alert("debug:header=" + html);
                //$("tbody tr", sel).each(function () {
                $(">tr", $("tbody", sel).eq(0)).each(function () {
                    first = true;
                    if ($(this).css("display") != "none") { //MAKEDEV - Don't output hidden rows
                        $("td", this).each(function () {
                            if (($(this).is(":visible")) && ($(this).css('display') !== 'none')) {
                                if (!first) html += "\t";
                                first = false;
                                if ($(this).css('color') == 'rgb(255, 255, 255)') {
                                    html += " ";
                                }
                                else {
                                    var mte = $(this).clone().children().remove().end().text();
                                    mte = mte.replace(/&nbsp;/gi, "");
                                    if (mte.charCodeAt(0) == 160) mte = "";
                                    if (mte == "") { //Maybe it's an anchor.
                                        if ($(" a", this).length > 0) {
                                            mte = $(" a", this).html();
                                        }
                                        else if ($(" .report-titlelink,.app-user-link,.rpt-colored,.td-tooltip", this).length > 0) { //MADELIVE
                                            mte = $(" .report-titlelink,.app-user-link,.rpt-colored,.td-tooltip", this).html();
                                        }
                                        else if ($(" input", this).length > 0) { //MAKEDEV
                                            if ($(" input", this).attr("type") == "checkbox") {
                                                if ($(" input", this).is(":checked")) {
                                                    mte = "X";
                                                }
                                                else {
                                                    mte = "";
                                                }
                                            }
                                            else {
                                                mte = $(" input", this).val();
                                            }
                                        }
                                    }
                                    if (mte != "") {
                                        foundsomething = true;
                                        if (mte.indexOf(",") >= 0) {
                                            //2022-11-09 - Substitute double quotes for single quotes.
                                            if (mte.indexOf('"') >= 0) {
                                                mte = mte.replace(/\"/g,"'");
                                            }
                                            mte = '"' + mte + '"';
                                        }
                                        html += mte;
                                    }
                                    else {
                                        html += " ";
                                    }
                                }
                            }
                        });
                        html = html + "\n";
                    }

                });

                var downloadfilename = "myfile";
                if (title) {
                    if (title == "") title = "Untitled";
                    title = title.replace(/\//g, ".").replace(/ /g, "").replace(/'/g, "");
                    downloadfilename = title;
                }
                //Try this instead of:
                var form = document.createElement("form");
                form.setAttribute("method", "POST");
                form.setAttribute("action", "/jq/DownloadGrid.ashx");
                form.setAttribute("target", "_blank");
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
                document.body.appendChild(form);
                form.submit();
            } //tid data mya

            if (a$.exists(scope.filters)) {
                scope.filters = scope.filters.replace(/~/g,"&");
                if (scope.filters == "URL") { //TODO: This needs revisited, it's a security issue.
                    var fs = window.location.href.split("?");
                    scope.filters = "";

                    //alert("debug: scope.filters=" + scope.filters);
                    //TODO: Pull out scope.cid, it gets passed separately.  It would be good to eliminate it from the string too.
                    var fss = fs[1].split("&");
                    for (var i in fss) {
                        var fsss = fss[i].split("=");
                        if (fsss[0] == "cid") {
                            scope.cid = fsss[1];
                        }
                        else {
                            if (scope.filters != "") {
                                scope.filters += "&";
                            }
                            scope.filters += fss[i];
                        }
                    }
                    scope.filtersURL = scope.filters;
                    //alert("debug: scope.cid=" + scope.cid);
                    //alert("debug: scope.filters=" + scope.filters);
                }
            }
            else {
                scope.filters = "";
            }

            if (!a$.exists(scope.assoc)) {
                scope.assoc = scope.cid;
            }
            else if (scope.assoc == "") {
                scope.assoc = scope.cid;
            }

            //Added 2019-05-23 - Place the cid into the filters so it can be overridden
            //scope.filters = "cid=" + scope.assoc + "&" + scope.filters;
            //

            scope.report = "";
            scope.element = element;
            scope.reportSelector = $(".ThisReport", scope.element);

            var rclass = false;
            if (a$.exists(scope.reportclass)) {
                if (scope.reportclass != "") {
                    var rcs = scope.reportclass.split(" ");
                    for (var r in rcs) {
                        $(scope.reportSelector).addClass(rcs[r]);
                        rclass = true;
                    }
                }
            }
            if (!rclass) {
                $(scope.reportSelector).css("height","inherit");  //The old way
            }

            scope.chartvar = "";

            scope.reporthtml = function () {
                return scope.report;
            }

            scope.showprogress = function () {
                try {
                    $(".progressindicator", scope.element).show();
                    $(".progressindicator", scope.element).spin("large", "#EF4521");
                }
                catch (e) { };
            }
            scope.hideprogress = function () {
                try {
                    $(".progressindicator", scope.element).hide();
                    $(".progressindicator", scope.element).spin(false);
                }
                catch (e) { };
            }


            $rootScope.$on('paramsOverride', function (event, args) {
                if (scope.assoc == args.assoc) {
                    //alert("debug: params received by report " + scope.assoc + ", applying params: " + args.params);
                    //alert("debug: filters WAS: " + scope.filters);
                    scope.filters = scope.overrideparams(scope.filters, args.params);
                    //alert("debug: filters CHANGED TO: " + scope.filters);
                    scope.showprogress();
                    scope.getreport();
                    //TODO: Override the params and re-send!
                }
            });
            
            //Clugue
            $rootScope.$on('formEdit', function (event, args) {
                //alert("debug: formEdit broadcast received.")
                //If there are NO APPROPRIATE TABLEEDITORs, then it's your job to display the form regardless.
                if (scope.cid == "SpreadsheetDashboard_UI") {
                    var numanchors = $(".form-anchor-primary").length; //Could be wrong if multiple tableeditors.
                    if (numanchors == 0) {
                        alert("Please expand the journal table for the agent\nbefore selecing entries from the performance trend chart.");
                        /*
                        var rts = args.data.split(",");
                        var cl = '<' + rts[0] + ' popup dataview="' + rts[1] + '" id="' + rts[2] + '"></' + rts[0] + '>';
                        var ele = $compile(cl)(scope);
                        if ($(".form-anchor-fallback").length == 0) {
                        $("body").append('<div class="form-anchor form-anchor-fallback"><div>');
                        angular.element(" .form-anchor-fallback").empty().append(ele);                    
                        */
                    }
                }
            });

            //In the future, the text & details could be pulled from a database by ID or something.
            scope.notetext = scope.text;
            scope.detailstext = (typeof scope.details == "undefined") ? "No details text" : scope.details;


            //Details - Modal
            scope.detailsvisible = false;
            scope.detailsshowing = function () {
                return scope.detailsvisible;
            }
            scope.devshowing = function () {
                return (
                    ((window.self != window.top) && ((a$.urlprefix(true).indexOf("mnt") == 0) /* || ($.cookie("TP1Role") == "Admin") */))
                    ||
                    ((window.self === window.top) && ((a$.gup("fiddle") != "") || (a$.gup("fiddles") != "")) && ((a$.urlprefix(true).indexOf("mnt") == 0) /* || ($.cookie("TP1Role") == "Admin") */ ))
                ); //((a$.gup("dev") != "") && (($.cookie("TP1Username") == "jeffgack") || ($.cookie("TP1Username") == "dweather")  || ($.cookie("TP1Username") == "cjarboe") || (document.URL.toLowerCase().indexOf("-v3-dev-") > 0)));
            }
            scope.showdetails = function (show) {
                scope.detailsvisible = show;
            }

            $(".dev-bug", scope.element).bind("click", function () {
                if ($(this).hasClass("dev-bug-collapsed")) {
                    $(this).removeClass("dev-bug-collapsed").addClass("dev-bug-expanded");
                    $(".dev-bug-verbose",scope.element).show();
                    scope.$apply(function () {
                        scope.setDevmode();
                    });
                }
                else {
                    $(this).addClass("dev-bug-collapsed").removeClass("dev-bug-expanded");
                    $(".dev-bug-verbose",scope.element).hide();
                }
            });

            scope.setDevmode = function () {
                //TODO: You must turn off the dev mode for all other ng-acuity-report controls!
                scope.devmode = true;
                scope.getreport();
                /*
                if (scope.devmode) {
                    if ($("#ngReportsEditor").css("display") != "none") {
                        alert("Another report directive is already in Dev Mode");
                        scope.devmode = false;
                    }
                    else {
                        $("#ngReportsEditor").show().draggable();
                        scope.getreport();
                    }
                }
                else {
                    $("#ngReportsEditor").hide();
                    scope.getreport();
                }
                */
            }

            if (!scope.filters) {
                scope.filters = "StartDate=12/1/2018&EndDate=12/31/2018";
            }

            //MADELIVE: Moved this out of clicked_drill_td MADELIVE
            scope.overrideparams = function (par, ov) {
                if(ov != null)
                {
                    var sp = ov.split("&");
                    for (var i in sp) {
                        spsp = sp[i].split("=");

                        if (par.indexOf("&" + spsp[0] + "=") >= 0) {
                            var rep = "&" + spsp[0] + "=";
                            var re = new RegExp(rep, "g");
                            par = par.replace(re, "&" + spsp[0] + "_OVERRIDDEN=");
                        }
                    }
                    if (ov != "") {
                        par = par + "&" + ov;
                    }
                }               

                return par;
            }

            //MADEDEV
            //TODO: offerExternalDelivery should be available for any report regardless of CID or presence of rpt_selection.
            scope.externalDelivery="N";
            if (a$.exists(scope.cid)) {
                if (scope.cid.indexOf("?") > 0) { 
                    var cs = scope.cid.split("?");
                    scope.cid = cs[0];
                    var ps = cs[1].split("&");
                    for (var p in ps) {
                        var pss = ps[p].split("=");
                        if (pss[0] == "offerExternalDelivery") {
                            if (pss[1] == "Y") {
                                if (confirm("This report can be sent directly to your email instead of displaying it on the screen.\nChoose OK to send this report to your email, Cancel to display in the browser.")) {
                                    scope.externalDelivery = "Y";
                                }
                            }
                            if (pss[1] == "S") {
                                alert("debug: Offering External Delivery if size is over a certain amount (in dev).");
                            }
                        }
                    }
                }
            }

            if (scope.waitforsubmit != "true") scope.showprogress();

            scope.getreport = function (defeatcache) {
                /*
                //2022-03-23 - The "GET" appears to be failing, so replace this with an a$.ajax (with POST) as a work-around attempt.
                api.doJS({
                    lib: "editor",
                    cmd: "getreport",
                    performanceColors: a$.WindowTop().apmPerformanceColors, //TODO: Get from V3
                    devmode: scope.devmode, //document.getElementById("ReportDeveloperMode").checked,                
                    grouping: "Combined", //$("#StgReportGrouping select").val()
                    //Changed 2019-05-23: IF I ELIMINATE IT HERE, IS IT PICKED UP AS A PARAM? cid: scope.cid,
                    cid: scope.cid,
                    externalDelivery: scope.externalDelivery, //MADEDEV
                    dashboard: "Agent", //$("#StgDashboard select").val()
                    displaytype: "Grid",
                    context: "Grid",
                    rootbuild: true //MADEDEVNOW
                },
        			"GET", //2022-02-15 - Why was this a "GET"?  When I set it to "POST" I get credentials errors.
                           //Note this is the ONLY "getreport" where I use doJS instead of a$.ajax
        			false, //notasync = false - means - async: true
                //"Agency=&Agencyoffice=&Project=1&Location=1&Group=&StartDate=10/1/2018&EndDate=10/31/2018&KPI=each&none&Xaxis=KPI&DataSource=177&Trendby=2&rank=PartnerTier"
                gatheredParams()
                //TODO: params needs to reconcile with scope.filters
        			).then(function (json) {
        			    if (a$.exists(json.msg)) {
        			        if (json.msg != "") {
        			            if (document.URL.toLowerCase().indexOf("-v3-dev-") > 0) {
        			                alert("Developer Debug: " + json.msg);
        			            }
        			        }
        			    }
        			    scope.$apply(function () {
        			        scope.ngWrappedLoadedReport(json);
        			        //scope.report = json.report.panel[0].html; //DEBUG TEST
        			    });
                        try {                            
                            ko.postbox.publish("ngAcuityReportComplete", scope.cid);
                        }
                        catch (e) { };
        			});
                */
//
                    //alert("debug: servercacheminutes=" + scope.servercacheminutes);
                    
                    //alert("debug1a: filter status:" + $("#loader_filters", legacyContainer.scope.ARF.document).html());
                    //alert("debug1a: cid: " + scope.cid);
                    try {
                       if (window.location != legacyContainer.scope.ARF.location) {
                            if ($("#loader_filters", legacyContainer.scope.ARF.document).html() != "CONFIRMED") return;
                        }
                    }
                    catch (e) { };

            //2022-08-31 - Don't override the CSR with "" if you ARE the CSR in the filters.  You should only see yourself
            if (scope.csrselfcheck == "true") {
                if (
                    ($.cookie("TP1Username").toLowerCase() == legacyContainer.scope.filters.CSR.toLowerCase())
                    && ($.cookie("TP1Subrole") != "TeamLead")
                ) {
                    scope.filters = scope.filters.replace("~CSR=~","~CSR=" + $.cookie("TP1Username").toString().toLowerCase() + "~");
                    scope.filters = scope.filters.replace("&CSR=&","&CSR=" + $.cookie("TP1Username").toString().toLowerCase() + "&"); //Depends on when it's called, I guess.
                }
            }


                    a$.ajax({
                        type: (scope.browsercacheminutes) ? "GET" : "POST", //Oh God...
                        service: "JScript",
                        async: true,
                        data: {
                            lib: "editor",
                            cmd: "getreport",
                            performanceColors: a$.WindowTop().apmPerformanceColors, //MADELIVE
                            devmode: scope.devmode,
                            servercache_minutes: scope.servercacheminutes,
                            defeatcache: (defeatcache == true),
                            grouping: "Combined", //$("#StgReportGrouping select").val(),
                            //Changed 2019-05-23: IF I ELIMINATE IT HERE, IS IT PICKED UP AS A PARAM? cid: scope.cid,
                            cid: ((a$.urlprefix(true).indexOf("mnt") == 0) && a$.exists(scope.mntcid) && (scope.mntcid != "")) ? scope.mntcid : scope.cid,
                            externalDelivery: scope.externalDelivery, //MADEDEV
                            dashboard: (!scope.dashboard) ? "Agent" : ((scope.dashboard == "select") ? legacyContainer.scope.filters.dashboard : scope.dashboard),
                            displaytype: "Grid",
                            context: "Grid",
                            rootbuild: true //MADEDEVNOW
                        },
                        dataType: "json",
                        cache: false,
                        browsercache_minutes: (scope.browsercacheminutes) ? parseInt(scope.browsercacheminutes,10) : 0,
                        error: a$.ajaxerror,
                        params: gatheredParams(), //appApmDashboard.viewparams(0, false) + ((document.getElementById("StgInTraining") != null) ? "&InTraining=" + $("#StgInTraining select").val() : ""),
                        success: function (json) {
                            scope.ngWrappedLoadedReport(json);
                            try {                            
                                ko.postbox.publish("ngAcuityReportComplete", scope.cid);
                            }
                            catch (e) { };
                        }

                    });


            }

            //TODO: This can be removed, I think.  We're always getting colors now from a$.WindowTop().apmPerformanceColors
            /*
            if (!a$.exists(window.apmPerformanceColors)) {
                api.getClient({
                    who: "ME",
                    members: ["colors"]
                }).then(function (json) {
                    scope.$apply(function () {
                        // Score Colors
                        if (json.client) {
                            if (json.client.colors) {
                                window.apmPerformanceColors = json.client.colors;
                            }
                        }
                        if (scope.waitforsubmit != "true") {
                            scope.getreport();
                        }
                    });
                });
            }
            else {
                if (scope.waitforsubmit != "true") {
                    scope.getreport();
                }
            }
            */
            if (scope.waitforsubmit != "true") {
                scope.getreport();
            }

            function gatheredParams() {
                var gp;

                if (a$.exists(scope.filters)) {
                    scope.filters = scope.filters.replace(/~/g,"&");
                }
                if (scope.filters == "URL") {
                    if (a$.exists(scope.filtersURL)) {
                        scope.filters = scope.filtersURL;
                    }
                    else {
                        alert("debug: scope lost");
                    }
                }
                //Unifyme
                //This section allows for a url parameter override (should probably be removed when all iframes have been converted to key off the filters).

                //CSR={CSR}
                //Team={Team}

                //TODO: Might need to convert this to a PRT mechanism.  Is the parameter approach safe at all if we're passing reports around?  Even through the IFrame should be avoided.

                var mykpi= legacyContainer.scope.filters.KPI;
                var mysubkpi = legacyContainer.scope.filters.SubKPI;
                var mycsr= legacyContainer.scope.filters.CSR;
                var myteam = legacyContainer.scope.filters.Team;
                var mygroup = legacyContainer.scope.filters.Group;
                var mylocation = legacyContainer.scope.filters.Location;
                var myproject = legacyContainer.scope.filters.Project;
                var mystartdate = legacyContainer.scope.filters.StartDate;
                var myenddate = legacyContainer.scope.filters.EndDate;
                var myqualityform = legacyContainer.scope.filters.Qualityform;
                var myintraining = legacyContainer.scope.filters.InTraining;
                var myfilterbuild = "";
                try {
                    myfilterbuild = legacyContainer.scope.filters.Filterbuild.toString().replace(/&amp;/g,"&");
                }
                catch (e) {
                }

                var mycid= legacyContainer.scope.filters.cid;
                var myscorecard= legacyContainer.scope.filters.scorecard; //toppertext here
                //var myGPdashboard = legacyContainer.scope.filters.dashboard; //2022-12-28: GPdashboard instead of dashboard since this isn't a candidate for drill-passing but still needs compared.

                //if (false) { //TEST:  Does Sidekick still work if I don't allow these passings?  Yes it does.
                //2023-09-07: Allow url filters if this is an iframe.
                if ((window.location != a$.WindowTop().location) || (a$.urlprefix(true).indexOf("mnt") == 0)) { //2022-06-20 - Harden the passing of params on URL.  I need some live testing.
                    if ((mykpi == null)||(mykpi == "")) mykpi = a$.gup("KPI");
                    if ((mysubkpi == null)||(mysubkpi == "")) mysubkpi = a$.gup("SubKPI");
                    if ((mycsr == null)||(mycsr == "")) mycsr = a$.gup("CSR");
                    if ((myteam == null)||(myteam == "")) myteam = a$.gup("Team");
                    if ((mygroup == null)||(mygroup == "")) mygroup = a$.gup("Group");
                    if ((mylocation == null)||(mylocation == "")) mylocation = a$.gup("Location");
                    if ((myproject == null)||(myproject == "")) myproject = a$.gup("Project");
                    if ((mystartdate == null)||(mystartdate == "")) mystartdate = a$.gup("StartDate");
                    if ((myenddate == null)||(myenddate == "")) myenddate = a$.gup("EndDate");
                    if ((myqualityform == null)||(myqualityform == "")) myqualityform = a$.gup("Qualityform");
                    if ((myintraining == null)||(myintraining == "")) myintraining = a$.gup("InTraining");
                    if ((myfilterbuild == null)||(myfilterbuild == "")) myfilterbuild = a$.gup("Filterbuild");
                    if ((mycid == null)||(mycid == "")) mycid = a$.gup("cid");
                }

                
                if ((scope.huddle == "recent") || (scope.huddle == "history")) {
                    //alert("debug: got here, huddle=" + scope.huddle);
                    //alert("debug: entdt=" + a$.gup("entdt"));
                    var sd = new Date();
                    var ed = new Date();
                    if (a$.gup("entdt") != "") {
                        sd = new Date(a$.gup("entdt"));
                        ed = new Date(a$.gup("entdt"));
                    }
                    //alert("debug: 2");
                    var dayoffset = 0;
                    if (a$.urlprefix() == "ultracx.") {
                        dayoffset = 1;
                    }
                    if (scope.huddle == "recent") {

                        //sd.setDate(sd.getDate() - (14 + dayoffset)); //2 week
                        sd.setDate(sd.getDate() - (7 + dayoffset)); //1 week

                        mystartdate= sd.toLocaleDateString('en-US');
                        ed.setDate(ed.getDate() - (1 + dayoffset));                        
                        myenddate= ed.toLocaleDateString('en-US');
                    }
                    else if (scope.huddle == "history") {

                        //sd.setDate(sd.getDate() - (28 + dayoffset)); //2 week
                        sd.setDate(sd.getDate() - (14 + dayoffset)); //1 week

                        mystartdate= sd.toLocaleDateString('en-US');

                        //ed.setDate(ed.getDate() - (15 + dayoffset)); //2 week
                        ed.setDate(ed.getDate() - (8 + dayoffset)); //1 week

                        myenddate= ed.toLocaleDateString('en-US');
                    }
                }

                if (mycid == null) mycid = "";

                //2022-04-21 - Extract the parameters that may be needed by serverreportlib
                var cidparams = ""
                if (mycid.indexOf("?") > 0) {
                    var cidparams = mycid.split("?")[1];
                }
                mycid = mycid.split("?")[0]; //For the purpose of filter substitution, you don't want the odd parameters included.

                gp = scope.filters.replace(/{subkpi}/ig, mysubkpi).replace(/{kpi}/ig, mykpi).replace(/{csr}/ig, mycsr).replace(/{team}/ig, myteam).replace(/{group}/ig, mygroup).replace(/{location}/ig, mylocation).replace(/{project}/ig, myproject).replace(/{startdate}/ig, mystartdate).replace(/{enddate}/ig, myenddate).replace(/{cid}/ig, mycid).replace(/{scorecard}/ig, myscorecard).replace(/{qualityform}/ig, myqualityform).replace(/{intraining}/ig, myintraining).replace(/filterbuild={filterbuild}/ig, myfilterbuild);
                if (cidparams != "") gp += "&" + cidparams;

                //2022-12-28
                //gp += "&gpdashboard=" + myGPdashboard;

                //Handle {Date-Month-Start-6}
                var gs = gp.split("&");
                for (var s in gs) {
                	var gss = gs[s].split("=");
                	if (gss.length == 2) {
                        //TODO: ADdd a possible (but not required) comma separator (for the case of daterange={Date,Month,Start,-3},{Date,Month,End,0}
                        //var gsss = gss.split(","); //..not so easy since comma is within the {}'s too.  Proper parsing is a worthy skill.

                        //Handle the case of multiple 
                        //&daterange=10/01/2019,01/31/2020&StartDate={Date,Month,Start,0}&EndDate={Date,Month,End,0}
                        //daterange=10/01/2019,01/31/2020
                        //StartDate={Date,Month,Start,0}
                        //daterange={Date,Month,Start,0},{Date,Month,End,0}

                        gss[1] = gss[1].replace("},{","}|{");  //Replace , with | for the daterange case.

                        var rplp = gss[1].split("|");
                        for (var rplpi in rplp) {
                            rpl = rplp[rplpi];                       
                    		if (rpl.length > 0) {
                    			if ((rpl[0]=="{")&&(rpl[rpl.length-1]=="}")) {
                    				var p=rpl.substring(1,rpl.length-1);
                    				var ok = false;
                    				var ps = p.split(",");
                	    			if (ps[0] == "Date") {
                                        if (ps.length >= 4) {
                			    			var rn = new Date();
                                            if (ps.length >= 5) {
                                               var timestamp = Date.parse(ps[4]);
                                               rn = new Date(timestamp);
                                            }
	                			    		if (ps[1] == "Month") {
 	              					    		rn.setMonth(rn.getMonth() + parseInt(ps[3],10));
  	              						        if (ps[2] == "Start") {
  	              							        p = "" + (rn.getMonth()+1) + "/1/" + rn.getFullYear();
  	              							        ok = true;
      	          						        }
  	              						        else if (ps[2] == "End") {
      	              							    var ld = new Date(rn.getFullYear(),rn.getMonth()+1,0);
  	              							        p = "" + (ld.getMonth()+1) + "/" + ld.getDate()  + "/" + ld.getFullYear();
  	              							        ok = true;
          	          						    }
                    						}
                                            else if (ps[1] == "Week_ChimeElite") { //TODO: Generalize for IVID with day offset, including the case of date spans.
                                                function chimeelite_date(SorE) {
                                                    var today = new Date();
                                                    var delay = 3; //# days to delay week update.
                                                    var testday = new Date();
                                                    testday.setDate(today.getDate() - delay);
                                                    //10/20 - 10/11 - 10/17
                                                    //10/21 - 10/18 - 10/24

	                                                var weekanchor = new Date('9/27/2020'); //Some date in the past
                                                    while (true) {
  	                                                    weekanchor.setDate(weekanchor.getDate() + 7);
                                                        if (testday < weekanchor) break;
                                                    }  
                                                    var startdate = weekanchor;
                                                    startdate.setDate(weekanchor.getDate() - 7);
                                                    function mmddyyyy(date) {
                                                        return ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1)))
                                                            + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate()))
                                                            + '/' + date.getFullYear();
                                                    }
	                                                var enddate = new Date(startdate);
                                                    enddate.setDate(enddate.getDate() + 6);
                                                    if (SorE == "S") return mmddyyyy(startdate);
                                                    return mmddyyyy(enddate);
                                                }
                                                if (ps[2] == "Start") {
                                                    p = chimeelite_date("S");
                                                    ok = true;
                                                }
  	              			    			    else if (ps[2] == "End") {
                                                    p = chimeelite_date("E");
                                                    ok = true;
                                                }                                            
                                            }
    	                					else if (ps[1] == "Year") {              						
                                            }
                                            else if (ps[1] != null && (ps[1].toLowerCase() == "day" || ps[1].toLowerCase() == "days"))
                                            {
                                                if (ps[2] == "Start") 
                                                {
                                                    rn.setDate(rn.getDate() + parseInt(ps[3],10));
                                                    p = "" + (rn.getMonth()+1) + "/" + rn.getDate() + "/" + rn.getFullYear();
                                                    ok = true;
                                                }
                                                else if (ps[2] == "End") {
                                                    var ld = new Date();
                                                    p = "" + (ld.getMonth()+1) + "/" + ld.getDate()  + "/" + ld.getFullYear();
                                                    ok = true;
                                                }
                                            }
                    					}
                    				}
                    				if (!ok) {
	                    				alert("Unrecognized param value: " + p);
                		    		}
                			    	else {
                				    	//alert("debug: substituting " + rpl + " with " + p);
                					    var regex = new RegExp(rpl, "g");
                    					gp = gp.replace(regex, p);
                    				}
                    			}
                    		}
                        }
                	}
                }
                if (legacyContainer.scope.CustomFilters) {
                    for (var f in legacyContainer.scope.CustomFilters) {
                        gp += "&CF_" + legacyContainer.scope.CustomFilters[f].name + "=" + legacyContainer.scope.CustomFilters[f].value;
                    }
                }
                if (scope.showdatepicker) gp += "&showdatepicker=" + ((scope.showdatepicker == "true") ? 1 : 0);

                //alert("debug: gp = " + gp);

                return gp;
            }

            scope.SavedGatheredParams = gatheredParams();
            scope.SavedDashboard = legacyContainer.scope.filters.dashboard;

            function customBarColors(chart) {
                if (scope.chartvar == "chartBarConfig3") {
                    try {
                        chart.series[chart.series.length - 1].data[0].color = '#00b0f0';
                        chart.series[chart.series.length - 1].data[1].color = '#2dc630';
                        chart.series[chart.series.length - 1].data[2].color = '#ff9000';

                    }
                    catch (e) { };
                }
            }
            function setLegendDisplay(chart, maximized) {
                if (a$.exists(chart.legend)) {
                    if (maximized) {
                        chart.legend.enabled = true;
                    }
                    else {
                        if ((scope.chartvar != "chartTrendConfig2") && (scope.chartvar != "chartTrendConfig3")) { //Exceptions
                            chart.legend.enabled = false;
                        }
                    }
                }
            }

            function exists(me) {
                return (typeof me != 'undefined');
            }

            function nodollar(t) {
                if (t.charAt(0) == '$') {
                    return (t.replace('$', '').replace(',', '')); //MADEDEV
                }
                return t;
            }

            var myTextExtraction = function (node) { //Looking for the html in an anchor or the entire text.
                var a = $(" a", node);
                if (a.length > 0) {
                    return nodollar($(a).html());
                }
                else {
                    var tl = $(".app-user-link,.report-titlelink,.bal-colorme,.bal-colored,.rpt-colorme,.rpt-colored", node);
                    if (tl.length > 0) {
                        return nodollar($(tl).html());
                    }
                    else {
                        return nodollar($(node).html());
                    }
                }
            }

            ko.postbox.subscribe("TargetReport", function (newjson) {
                var sent = false;
                if (a$.exists(newjson.report.targetname)) {
                    if (newjson.report.targetname != "") {
                        if (newjson.report.targetname == scope.name) {
                            //alert("debug: Received at targetname: " + newjson.report.targetname);
                            newjson.report.targetname = ""; //To avoid recursion
                            newjson.report.target = ""; //To avoid recursion
                            scope.ngWrappedLoadedReport(newjson);
                            sent = true;
                        }
                    }
                }
                else if (a$.exists(newjson.report.target)) {
                    if (newjson.report.target != "") {
                        if (newjson.report.target == scope.cid) {
                            //alert("debug: Received at target: " + newjson.report.target);
                            newjson.report.targetname = ""; //To avoid recursion
                            newjson.report.target = ""; //To avoid recursion
                            scope.ngWrappedLoadedReport(newjson);
                            sent = true;
                        }
                    }
                }
            });

            scope.ngWrappedLoadedReport = function(json) {
                var previous_usage = "";
                var previous_renderid = "";
                scope.hideprogress();
                if (a$.jsonerror(json)) { } else {
                    if (a$.exists(json.report.targetname)) {
                        if (json.report.targetname != "") {
                            //alert("Debug: Send to target name: " + json.report.targetname);
                            ko.postbox.publish("TargetReport", json);
                            return;
                        }
                    }
                    if (a$.exists(json.report.target)) {
                        if (json.report.target != "") {
                            //alert("Debug: Send to target: " + json.report.target);
                            ko.postbox.publish("TargetReport", json);
                            return;
                        }
                    }
                    if (a$.exists(window.userFunctions)) {
                        if (a$.exists(userFunctions.reportDisplay)) {
                            userFunctions.reportDisplay({
                                name: scope.name,
                                cid: scope.cid,
                                error: json.report.error || (json.report.panel[0].html.indexOf("SQL Error") > 0),
                                show: json.report.show
                            });
                        }
                    }
                    else {
                        //alert("debug: userFunctions does not exist");
                    }
                    
                    if (json.report.show) {

                        if (json.report.cache) {
                            console.log("cid:" + scope.cid);
                            console.log(json.report.cache);
                            ko.postbox.publish("RefreshReportCachestamp", { assoc: scope.assoc, cache: json.report.cache }); //TEST:  TODO: move this to be published by the report upon completion.
                        }

                        $(".dev-display-reports,.dev-display-reports-controls,.dev-display-chartdefs", scope.element).hide();
                        if (a$.exists(json.report.editor)) {
                            if (a$.exists(json.report.editor.tagid)) {
                                if (json.report.editor.tagid == "TableSQL") {
                                    previous_usage = "MacroWrap";
                                }
                                else if (json.report.editor.tagid == "TableSQL-OuterApply") {
                                    previous_usage = "OuterApply";
                                }
                                else if (json.report.editor.tagid == "TableSQL-OuterApplyWrapper") {
                                    previous_usage = "OuterApplyWrapper";
                                }
                                else if (json.report.editor.tagid == "TableSQL-NoWrapper") {
                                    previous_usage = "NoWrapper";
                                }
                            }
                            if (a$.exists(json.report.editor.renderid)) {
                                previous_renderid = json.report.editor.renderid;
                            }
                            else {
                                previous_renderid = "Table";
                            }
                            if (a$.exists(json.report.editor.query)) {
                                if (a$.exists(json.report.editor.clientspecific)) {
                                    if (json.report.editor.clientspecific) {
                                        $(".dev-display-client-specific", scope.element).prop("checked",true).attr("disabled", "disabled");
                                    }
                                }
                                $(".dev-display-reports", scope.element).html('<div class="reportsEditor" id="re-' + (window.nextid++) + '"></div>').show();
                                $(".dev-display-chartdefs", scope.element).html('<div><br />Custom Chart For: ' + json.report.editor.cid + '</div><div class="chartdefsEditor" id="re-' + (window.nextid++) + '"></div>').show();
                                $(".dev-display-reports-controls", scope.element).show();
                                $(".dev-display-reports-cid", scope.element).html("" + json.report.editor.cid);
                                $(".dev-display-reports-usage", scope.element).html('<option value="MacroWrap"' + ((previous_usage == "MacroWrap") ? ' selected="selected" ' : '') + '>Macro Wrapper</option>');
                                $(".dev-display-reports-usage", scope.element).append('<option value="OuterApply"' + ((previous_usage == "OuterApply") ? ' selected="selected" ' : '') + '>Outer Apply</option>');
                                $(".dev-display-reports-usage", scope.element).append('<option value="OuterApplyWrapper"' + ((previous_usage == "OuterApplyWrapper") ? ' selected="selected" ' : '') + '>Outer Apply Wrapper</option>');
                                $(".dev-display-reports-usage", scope.element).append('<option value="NoWrapper"' + ((previous_usage == "NoWrapper") ? ' selected="selected" ' : '') + '>No Wrapper</option>');
                                for (var i in json.report.editor.queryused) {
                                    $(".dev-display-reports-usage", scope.element).append('<option value="' + i + '">Pass ' + i + '</option>');
                                }
                                $(".dev-display-reports-usage", scope.element).unbind().bind("change", function () {
                                    var val = $(this).val();
                                    var leaving = false;
                                    if ((val == "MacroWrap") || (val == "OuterApply") || (val == "OuterApplyWrapper") || (val == "NoWrapper")) {
                                        if ((previous_usage == "MacroWrap") || (previous_usage == "OuterApply") || (previous_usage == "OuterApplyWrapper") || (previous_usage == "NoWrapper")) {
                                            leaving = true;
                                        }
                                    }
                                    previous_usage = val;
                                    if (leaving) return;

                                    scope.reportsEditor.setValue("Formatting...");
                                    if ((val == "MacroWrap") || (val == "OuterApply") || (val == "OuterApplyWrapper") || (val == "NoWrapper")) {
                                        /*
                                        a$.beautify("sql", json.report.editor.query).then(function (data) {
                                            window.reportsEditor.setValue(data);
                                        });
                                        */
                                        scope.reportsEditor.setValue(json.report.editor.query);
                                        //$(".dev-display-reports-test").prop('disabled',macros);
                                        //$(".dev-display-reports-save").prop('disabled',macros);
                                        $(".dev-display-reports-test,.dev-display-reports-save", scope.element).show();
                                    }
                                    else {
                                        /*
                                        a$.beautify("sql", json.report.editor.queryused[parseInt(val, 10)].query).then(function (data) {
                                           window.reportsEditor.setValue(data);
                                        });
                                        */
                                        scope.reportsEditor.setValue(json.report.editor.queryused[parseInt(val, 10)].query);
                                        $(".dev-display-reports-test,.dev-display-reports-save", scope.element).hide();
                                    }
                                });

                                $(".dev-display-reports-render", scope.element).html('<option value="Table"' + ((previous_renderid.split("?")[0] == "Table") ? ' selected="selected" ' : '') + '>Table</option>' + '<option value="Custom Chart"' + ((previous_renderid.split("?")[0] == "Custom Chart") ? ' selected="selected" ' : '') + '>Custom Chart</option>'  );
                                $(".dev-display-reports-render", scope.element).append('<option value="UL"' + ((previous_renderid.split("?")[0] == "UL") ? ' selected="selected" ' : '') + '>UL</option>');
                                var charts = appChartDefinitions.connectedChart({});
                                for (var key in charts) {
                                    $(".dev-display-reports-render", scope.element).append('<option value="' + key + '"' + ((previous_renderid.split("?")[0] == key) ? ' selected="selected" ' : '') + '>' + key + '</option>');
                                }
                                $(".dev-display-reports-params").val(((previous_renderid.indexOf("?") > 0) ? previous_renderid.split("?")[1] : ""));

                                $(".dev-display-reports-render", scope.element).unbind().bind("change", function () {
                                    previous_renderid = $(this).val() + (($(".dev-display-reports-params").val() != "") ? "?" + $(".dev-display-reports-params").val() : "");
                                    if (previous_renderid.split("?")[0] == "Custom Chart") {
                                        $(".dev-display-chartdefs", scope.element).show();
                                    }
                                    else {
                                        $(".dev-display-chartdefs", scope.element).hide();
                                    }
                                });
                                $(".dev-display-reports-render", scope.element).trigger("change");

                                $(".dev-display-format", scope.element).bind("click", function() {
                                    a$.beautify("sql", scope.reportsEditor.getValue()).then(function (data) {
                                           scope.reportsEditor.setValue(data);
                                    });
                                });

                                $(".dev-display-reports-test,.dev-display-reports-save", scope.element).prop('disabled', false).unbind().bind("click", function () {
                                    var sql = scope.reportsEditor.getValue();
                                    //a$.showprogress("plotprogress");
                                    //alert("debug:saving sql = " + sql);

                                    if ($(".dev-display-client-specific", scope.element).is(":checked")) {
                                        //alert("debug: save query client-specific");
                                    }
                                    scope.showprogress();

                                    //sql = sql.Replace(Convert.ToChar(160).ToString()," ").Replace(Convert.ToChar(19).ToString()," ").replace(/[\r\n]/g," ").replace(/  /g," ");
                                    
                                    a$.ajax({
                                        type: "POST",
                                        service: "JScript",
                                        async: true,
                                        data: {
                                            lib: "editor",
                                            cmd: "getreport",
                                            performanceColors: a$.WindowTop().apmPerformanceColors, //MADELIVE
                                            devmode: scope.devmode,
                                            grouping: "Combined", //$("#StgReportGrouping select").val(),
                                            testmode: true,
                                            savequery: $(this).hasClass("dev-display-reports-save"),
                                            saveclientspecific: $(".dev-display-client-specific", scope.element).is(":checked"),
                                            usage: $(".dev-display-reports-usage", scope.element).eq(0).val(),
                                            renderid: $(".dev-display-reports-render", scope.element).eq(0).val() + (($(".dev-display-reports-params").val() != "") ? "?" + $(".dev-display-reports-params").val() : ""),
                                            cid: ((a$.urlprefix(true).indexOf("mnt") == 0) && a$.exists(scope.mntcid) && (scope.mntcid != "")) ? scope.mntcid : scope.cid,
                                            sql: sql,
                                            dashboard: (!scope.dashboard) ? "Agent" : ((scope.dashboard == "select") ? legacyContainer.scope.filters.dashboard : scope.dashboard),
                                            displaytype: "grid", //displaytype,
                                            context: "grid" //displaytype
                                        },
                                        dataType: "json",
                                        cache: false,
                                        error: a$.ajaxerror,
                                        params: gatheredParams(), //appApmDashboard.viewparams(0, false) + ((document.getElementById("StgInTraining") != null) ? "&InTraining=" + $("#StgInTraining select").val() : ""),
                                        success: scope.ngWrappedLoadedReport
                                    });
                                    if ($(".dev-display-client-specific", scope.element).is(":checked")) {
                                        $(".dev-display-client-specific", scope.element).prop("checked",true).attr("disabled", "disabled"); //Don't wait for it to turn around.
                                    }
                                });
                                /*
                                window.reportsEditor = ace.edit("reportsEditor");
                                window.reportsEditor.setTheme("ace/theme/monokai");
                                window.reportsEditor.getSession().setMode("ace/mode/sql");
                                a$.beautify("sql", json.report.editor.query).then(function (data) {
                                    window.reportsEditor.setValue(data);
                                });
                                */
                                //scope.reportsEditor = CodeMirror($(".reportsEditor", scope.element).eq(0)/*document.getElementById("CDS_CSSEditor")*/, {
                                scope.reportsEditor = CodeMirror(document.getElementById($(".reportsEditor",scope.element).attr("id")), {
                                    lineNumbers: true,
                                    mode: "sql",
                                    autoRefresh: true,
                                    extraKeys: { "Ctrl-Space": "autocomplete" },
                                    value: json.report.editor.query
                                });
                                scope.chartdefsEditor = CodeMirror(document.getElementById($(".chartdefsEditor",scope.element).attr("id")), {
                                    lineNumbers: true,
                                    mode: "javascript",
                                    autoRefresh: true,
                                    extraKeys: { "Ctrl-Space": "autocomplete" },
                                    value: '{ mychartdef : "here"; }' //json.report.editor.query
                                });
                            }
                        }
                        //Single panel
                        for (var i in json.report.panel) {
                            var preservepanel = false; //MADELIVE (probably this entire loop)
                            var is = "";
                            var panelfill = false; //MADELIVE MADEDEV
                            //$((is != "") ? is : sel).html(json.report.panel[i].html).show();
                            if (exists(json.report.panel[i].injectSelector)) {
                                if (json.report.panel[i].injectSelector != "") {
                                    is = $(json.report.panel[i].injectSelector, scope.reportSelector);
                                    if (json.report.panel[i].panelFill) panelfill = true;
                                }
                            }
                            if ((is == "") && (i == 0)) {
                                $(scope.reportSelector).html(json.report.panel[i].html).show();
                                if (scope.hidetopper == "true") { //Added 2020-09-16
                                    $(".rpt-chart-topper,.rpt-title,.rpt-table-topper,.rpt-toggle,.rpt-max-link", scope.reportSelector).hide();
                                }
                                if (scope.hidetopheader == "true") {
                                    $(".acuity-table__top-th", scope.reportSelector).hide();
                                }
                                //Added: 2022-02-23 - toppertext hasn't been implemented before!
                                if (scope.toppertext != "") {
                                    $(".rpt-title",scope.reportSelector).html(scope.toppertext);
                                }
                                if (scope.headertext != "") {
                                    $("thead th",scope.reportSelector).eq(0).html(scope.headertext);
                                }
                                //Added: 2019-09-18 - Jam in a record count for performant (as a test). MADEDEV
                                //if ((a$.urlprefix() == "performant.") || (a$.urlprefix() == "performant-mnt.")) {
                                try {
                                    $(".rpt-title",scope.reportSelector).html($(".rpt-title",sel).html() + '<span style="padding-left: 30px;font-size:9px;">Record Count: ' + $("tbody tr",sel).length + '</span>');
                                }
                                catch (e) {
                                }
                                if (scope.qsttable != null) {
                                    var ri=0;
                                    var ci = 0;
                                    $("thead tr", scope.reportSelector).each(function() {
                                        ci = 0;
                                        $("th", this).each(function() {
                                            $(this).html('<span qsttable="' + scope.qsttable + '" row="' + ri + '" col="' + ci + '">' + $(this).html() + '</span>');
                                            ci += 1;
                                        });
                                        ri +=1;                                        
                                    });
                                    $("tbody tr", scope.reportSelector).each(function() {
                                        ci = 0;
                                        $("td", this).each(function() {
                                            if (ci == 0) {
                                                $(this).html('<span qsttable="' + scope.qsttable + '" row="' + ri + '" col="' + ci + '">' + $(this).html() + '</span>');
                                            }
                                            else {
                                                $(this).html('<input class="qstchange-' + scope.qsttable + '" type="text" style="text-align: center;width: 50px" qsttable="' + scope.qsttable + '" row="' + ri + '" col="' + ci + '" value="' + $(this).html() + '" />');
                                            }
                                            ci += 1;
                                        });
                                        ri +=1;
                                    });
                                    $(".qstchange-" + scope.qsttable).unbind().bind("change",function() {
                                        //alert("value changed to: " + $(this).val() );
                                    });

                                    
                                    //$("td",scope.reportSelector).css("color","orange"); //test for contact.
                                }
                                if ((scope.treeview == "true") || (scope.treeview == "counts")) {
                                    var cols = [];
                                    var maxidx = -1;

                                    $("th", $(" table thead",scope.reportSelector).children().eq(1)).each(function() {
                                        cols.push({ name: $(this).html(), idx: $(this).index(), lastval: "" });
                                        maxidx = $(this).index();
                                    });
                                    //alert("debug:maxidx natural=" + maxidx);
                                    if (scope.treedepth) {
                                        maxidx = parseInt(scope.treedepth,10);
                                    }
                                    //alert("debug:maxidx augmented=" + maxidx);
                                    var bld="";
                                    var tpm = '<div class="tree-pm" style="display:inline-block; text-align:center;width:20px; padding: 1px 0px 0px 1px;border: 1px solid black;font-weight:bold;font-size:16px;vertical-align:middle;cursor:pointer;margin:3px;margin-right:6px;">-</div>';
                                    var tru = '<div class="tree-rollup" style="display:none;position:absolute;top:3px;right:50px;"></div>';
                                    var treedrillkeyfound = false;

                                    var tct = '<div class="tree-count" style="position:absolute;top:3px;right:0px;'; 
                                    if ($(" table .tbl-dk", scope.reportSelector).length > 0) { //For now, assume the drilling is on the tree-count column.
                                        treedrillkeyfound = true;
                                    }
                                    if (treedrillkeyfound) {
                                        tct += 'cursor:pointer;';
                                    }
                                    tct += '"'; //note: closing div left off and closing > off.

                                    bld = '<div class="rpt-treeview">';
                                    if (false) { //($.cookie("TP1Username") != "jeffgack") { //Too clunky and the iterators screw up recursion possibilities and require too much testing.
                                        $(" table tbody tr", scope.reportSelector).find("td:eq(0)").each(function() {
                                            //Assume the position in cols is the idx (makes the code nicer).
                                            if (cols[0].lastval != $(this).html()) {
                                                cols[0].lastval = $(this).html();
                                                bld += '<ul><li level="0">' + ((maxidx > 1)?tpm:"") + cols[0].lastval + ((maxidx != 1) ? tru : tct + ' tablerow="' + $(this).parent().index() + '">' + $(this).next().html() + "</div>");  // + "right:" + ((maxidx - 0) * 40) + 'px;"></div>';
                                                $(" table tbody tr", scope.reportSelector).find("td:eq(1)").each(function() {
                                                    if ($(this).prev().html() == cols[0].lastval) {
                                                        if (cols[1].lastval != $(this).html()) {
                                                            cols[1].lastval = $(this).html();
                                                            bld += '<ul><li level="1">' + ((maxidx > 2)?tpm:"") + cols[1].lastval + ((maxidx != 2) ? tru : tct + ' tablerow="' + $(this).parent().index() + '">' + $(this).next().html() + "</div>");
                                                            $(" table tbody tr", scope.reportSelector).find("td:eq(2)").each(function() {
                                                                if (($(this).prev().prev().html() == cols[0].lastval) && ($(this).prev().html() == cols[1].lastval)) {
                                                                    if (cols[2].lastval != $(this).html()) {
                                                                        cols[2].lastval = $(this).html();
                                                                        bld += '<ul><li level="2">' + ((maxidx > 3)?tpm:"") + cols[2].lastval + ((maxidx != 3) ? tru : tct + ' tablerow="' + $(this).parent().index() + '">' + $(this).next().html() + "</div>");
                                                                        if (maxidx > 3) {
                                                                            $(" table tbody tr", scope.reportSelector).find("td:eq(3)").each(function() {
                                                                                if (($(this).prev().prev().prev().html() == cols[0].lastval) && ($(this).prev().prev().html() == cols[1].lastval) && ($(this).prev().html() == cols[2].lastval)) {
                                                                                    if (cols[3].lastval != $(this).html()) {
                                                                                        cols[3].lastval = $(this).html();
                                                                                        bld += '<ul><li level="3">' + ((maxidx > 4)?tpm:"") + cols[3].lastval + ((maxidx != 4) ? tru : tct + ' tablerow="' + $(this).parent().index() + '">' + $(this).next().html() + "</div>") ;

                                                                                        bld += "</li>";
                                                                                        //DONE: additional levels here
                                                                                        if (maxidx > 4) {
                                                                                            $(" table tbody tr", scope.reportSelector).find("td:eq(4)").each(function() {
                                                                                                if (($(this).prev().prev().prev().prev().html() == cols[0].lastval) && ($(this).prev().prev().prev().html() == cols[1].lastval) && ($(this).prev().prev().html() == cols[2].lastval) && ($(this).prev().html() == cols[3].lastval)) {
                                                                                                    if (cols[4].lastval != $(this).html()) {
                                                                                                        cols[4].lastval = $(this).html();
                                                                                                        bld += '<ul><li level="4">'  + ((maxidx > 5)?tpm:"") + cols[4].lastval + ((maxidx != 5) ? tru : tct + ' tablerow="' + $(this).parent().index() + '">' + $(this).next().html() + "</div>") ;
                                                                                                        bld += "</li>";
                                                                                                        //TODO: additional levels here
                                                                                                        //
                                                                                                        bld += "</li></ul>";
                                                                                                    }
                                                                                                }
                                                                                            });
                                                                                        }
                                                                                        //
                                                                                        bld += "</li></ul>";
                                                                                    }
                                                                                }
                                                                            });
                                                                        }
                                                                        bld += "</li></ul>";
                                                                    }
                                                                }
                                                            });
                                                            bld += "</li></ul>";
                                                        }
                                                    }
                                                });
                                                bld += "</li></ul>";
                                            }
                                        });
                                    }
                                    else { //TODO: Rewrite it.
                                        var tt = [];
                                        var rowcnt = 0;
                                        var colcnt;
                                        $(" table tbody tr", scope.reportSelector).each(function() {
                                            tt[rowcnt] = [];
                                            colcnt = 0;
                                            $("td",this).each(function() {
                                                if ($(this).index() <= maxidx) {
                                                    tt[rowcnt][colcnt] = $(this).html();
                                                }
                                                colcnt++;                                                
                                            });
                                            rowcnt++;
                                        });
                                        tt[rowcnt] = [];  //Empty line at the bottom to force list closing.
                                        for (var j=0;j<colcnt;j++) {
                                            tt[rowcnt][j] = "";
                                        }
                                        rowcnt++;
                                        var lvl = 0;
                                        for (var r= 0; r < rowcnt; r++) {
                                            var pops = 0;
                                            if (r > 0) {
                                                for (c = lvl; c>=0; c--) {
                                                    if (c < maxidx) {
                                                        if (tt[r-1][c] != tt[r][c]) {
                                                            pops = 1 + (lvl - c);
                                                        }                                                    
                                                    }
                                                }
                                            }
                                            for (var j=1;j<pops;j++) {
                                                bld += "</li></ul>";
                                                lvl--;
                                                if (lvl < 0) alert("debug: lvl<0");
                                            }
                                            while (lvl < maxidx) {
                                                if (r != (rowcnt -1)) {
                                                    bld += '<ul><li level="' + lvl + '">' + ((maxidx > (lvl+1))?tpm:"") + tt[r][lvl] + ((maxidx != (lvl+1)) ? tru : tct + ' tablerow="' + r + '">' + tt[r][lvl+1] + "</div>");  // + "right:" + ((maxidx - 0) * 40) + 'px;"></div>';
                                                    lvl++;
                                                }
                                                else {
                                                    break;
                                                }
                                            }
                                            
                                        }
                                    }
                                    bld += '</div><div><br /><div class="rpt-tree-show-table rpt-tree-table-hidden" style="cursor:pointer;display:inline-block;text-align:right;padding-left:20px;text-decoration:underline;">Show Table</div>';
                                    bld += '&nbsp;&nbsp;<div class="rpt-tree-cascade /*rpt-tree-cascade-off*/" style="cursor:pointer;display:block;text-align:right;padding-right:50px;text-decoration:underline;">format:unique</div><br /></div>';
                                    $(scope.reportSelector).prepend(bld);

                                    if (treedrillkeyfound) {
                                        $(".tree-count",scope.reportSelector).bind("click", function() {
                                            $(" table tbody",scope.reportSelector).find("tr:eq(" + $(this).attr("tablerow") + ")").find("td:eq(" + maxidx + ")").trigger("click");
                                        });
                                    }

                                    $(".tree-pm",scope.reportSelector).bind("click",function() {
                                        if ($(this).html() == "-") {
                                            $(" > ul",$(this).parent()).hide();
                                            var tc = 0;
                                            $(" .tree-count",$(this).parent()).each(function() {
                                                tc += parseInt($(this).html(),10);
                                            });
                                            $(" > .tree-rollup",$(this).parent()).html("" + tc).show();
                                            $(this).html("+");
                                        }
                                        else {
                                            $(" > ul",$(this).parent()).show();
                                            if ($(".rpt-tree-cascade",scope.reportSelector).hasClass("rpt-tree-cascade-off")) {
                                                $(" > .tree-rollup",$(this).parent()).html("").hide();
                                            }
                                            $(this).html("-");
                                        }
                                        
                                    });
                                    $(".tree-pm",scope.reportSelector).each(function() {
                                        $(this).trigger("click");
                                    });
                                    $(".tree-pm",scope.reportSelector).eq(0).trigger("click"); //Open the first level.

                                    $(".rpt-global",scope.reportSelector).hide();
                                    $(".rpt-tree-show-table",scope.reportSelector).unbind().bind("click", function() {
                                        if ($(this).hasClass("rpt-tree-table-hidden")) {
                                            $(this).html("Hide Table");
                                            $(this).removeClass("rpt-tree-table-hidden");
                                            $(".rpt-global",scope.reportSelector).show();
                                        }
                                        else {
                                            $(this).addClass("rpt-tree-table-hidden");
                                            $(this).html("Show Table");                                            
                                            $(".rpt-global",scope.reportSelector).hide();
                                        }
                                    });


                                    //Start with the cascade.
                                    $(".rpt-treeview li",scope.reportSelector).each(function() {
                                        $(".tree-rollup,.tree-count",this).css("right",((4 - parseInt($(this).attr("level"),10)) * 40) + "px");
                                    });

                                    $(".rpt-tree-cascade",scope.reportSelector).unbind().bind("click", function() {
                                        if ($(this).hasClass("rpt-tree-cascade-off")) {
                                            $(this).html("unique");
                                            $(this).removeClass("rpt-tree-cascade-off");
                                            $(".rpt-treeview li",scope.reportSelector).each(function() {
                                                $(".tree-rollup,.tree-count",this).css("right",((4 - parseInt($(this).attr("level"),10)) * 40) + "px");
                                            });
                                            $(".tree-rollup,.tree-count").show();
                                        }
                                        else {
                                            $(this).html("cascade");
                                            $(this).addClass("rpt-tree-cascade-off");
                                            $(".rpt-treeview li",scope.reportSelector).each(function() {
                                                $(".tree-rollup,.tree-count",this).css("right","50px").show();
                                            });
                                        }

                                    });
                                }

                            }
                            else if (is != "") {
                                var aborttip = false;
                                if (typeof is == "string") {
                                    if (is.indexOf(".tbl-mytip") >= 0) {
                                        if (json.overrideUid != scope.currentUid) {
                                            aborttip = true;
                                        }
                                    }
                                }
                                else if (a$.exists(is.selector)) {
                                    if (is.selector.indexOf(".tbl-mytip") >= 0) {
                                        if (json.overrideUid != scope.currentUid) {
                                            aborttip = true;
                                        }
                                    }
                                }
                                if (aborttip) {
                                    $(".tbl-mytip", scope.reportSelector).html("").hide();
                                }
                                //TODO: See if you can do a resize here. //MADELIVE
                                if (exists(json.report.panel[i].preservePanel)) {
                                    if (json.report.panel[i].preservePanel) {
                                        preservepanel = true;
                                    }
                                }
                                if (!preservepanel) {
                                    if (!aborttip) {
                                        $(is).html(json.report.panel[i].html).show();

                                        //MADENEWLIVE MADEDEVNOW
                                        if (json.report.panel[i].popup) {
                                            var mypopup = $(is).closest(".rpt-popup-" + json.report.panel[i].popup);

                                            if (scope.cid.toString().indexOf("SpreadsheetDashboard") == 0) {
                                                $(mypopup).css("top", ($(mypopup).closest(".report-wrapper").scrollTop() + 125) + "px");
                                                $(mypopup).css("left", "100px");
                                                $(mypopup).show();
                                            }
                                            else {
                                                $(mypopup).css("top", ($(mypopup).closest(".report-wrapper").scrollTop() + 155) + "px");
                                                $(mypopup).show().draggable();
                                            }
                                            //alert("debug: move panel if not visible 4");
                                        }
                                    }

                                }
                                if (exists(json.report.panel[i].resizePanelHtml)) {

                                }
                            }
                            else {
                                $(scope.reportSelector).append(json.report.panel[i].html).show();
                            }

                            //Any column with Controls in them would have been injected by now
                            if (scope.fixheader == "true") {
                                a$.fixTableHeaders(scope.reportSelector);
                            }
                            $("th", scope.reportSelector).each(function() {
                                
                                var myn=0;
                                while ($(this).html().indexOf("{CONTROL-") >= 0) {
                                    if ($(this).html().indexOf("}") < 0) break;
                                    var cwhole = $(this).html().substring($(this).html().indexOf("{CONTROL-"),$(this).html().indexOf("}")+1);
                                    var cws;
                                    if (cwhole.indexOf("{CONTROL-USERMESSAGE-SELECTALL") >= 0) {
                                        cws = cwhole.split(",");
                                        cwstyle = "";
                                        if (cws.length > 1) {
                                            cwstyle = cws[1].replace("}","");
                                        }
                                        $(this).html($(this).html().replace(cwhole,'<input class="report-click-service acuity-user-message-selectall" service="UserMessageSelectAll" style="z-index:999999;' + cwstyle + '" type="checkbox">'));
                                    }
                                    else if (cwhole.indexOf("{CONTROL-USERMESSAGE-LINK") >= 0) {
                                        cws = cwhole.split(",");
                                        cwstyle = "";
                                        if (cws.length > 1) {
                                            cwstyle = cws[1].replace("}","");
                                        }
                                        $(this).html($(this).html().replace(cwhole,'<a title="Send message to select users." style="' + cwstyle + '"><img class="report-click-service acuity-user-message-link" service="UserMessageLink" src="/applib/css/images/YPS__email_mail_letter_envelope_postal-128.png" height="16" style="padding-left:10px;margin-right:10px;cursor:pointer;" /></a>'));
                                    }
                                    else {
                                        alert("Unrecognized Control Service: " + cwhole);
                                    }

                                    $(this).html($(this).html().replace(cwhole,"r" + myn));
                                    myn+=1;
                                }
                            });

                            //MADELIVE MADEDEV
                            if (exists(json.report.panel[i].loadPanel)) {
                                $(".progresspanel").spin("large", "#EF4521");
                                var fp = scope.overrideparams(gatheredParams()/*appApmDashboard.viewparams(0, false)*/, json.report.panel[i].loadPanel.params);
                                //In this case, you WANT to override the filter's cid.
                                fp = scope.overrideparams("what=1&" + fp,"cid=" + json.report.panel[i].loadPanel.cid);
                                a$.ajax({
                                    type: "POST",
                                    service: "JScript",
                                    async: true,
                                    data: {
                                        lib: "editor",
                                        cmd: "getreport",
                                        performanceColors: a$.WindowTop().apmPerformanceColors, //MADELIVE
                                        grouping: "Combined", //$("#StgReportGrouping select").val(),
                                        scoremodel: "Balanced", //This is a TEST (first time scoremodel passed here is 7/1/2020)
                                        cid: json.report.panel[i].loadPanel.cid,
                                        injectSelector: json.report.panel[i].loadPanel.sel,
                                        dashboard: (!scope.dashboard) ? "Agent" : ((scope.dashboard == "select") ? legacyContainer.scope.filters.dashboard : scope.dashboard),
                                        displaytype: "grid", //displaytype,
                                        context: "grid" //displaytype
                                    },
                                    dataType: "json",
                                    cache: false,
                                    error: a$.ajaxerror,
                                    params: fp
                                        + ((document.getElementById("StgInTraining") != null) ? "&InTraining=" + $("#StgInTraining select").val() : "")
                                        + ((document.getElementById("StgAgentStatus") != null) ? "&AgentStatus=" + $("#StgAgentStatus select").val() : "")
                                        + ((document.getElementById("StgScorecard") != null) ? "&scorecard=" + $("#StgScorecard select").val() : ""),
                                    success: scope.ngWrappedLoadedReport
                                });

                                //alert("debug: loading panel into: " + json.report.panel[i].loadPanel.sel);
                            }
                            else { //This is a VERY long else. MADELIVE

                                var p = i;
                                if (!preservepanel) {
                                    for (var t in json.report.panel[p].tables) {
                                        $(json.report.panel[p].tables[t].sel + " .expander", scope.reportSelector).unbind().bind("click", function (e) {
                                            expandme(this);
                                        });
                                        //MADEDEV
                                        if ((t+1) == json.report.panel[p].tables.length) { //Just do this once, right?
                                            if (exists(json.report.panel[p].injectSelector)) {
                                                $(json.report.panel[p].injectSelector + " .expander", scope.reportSelector).each(function () {
                                                    expandme(this, json.report.panel[p].tables[t].expandIndexes, true);
                                                });
                                            }
                                            else {
                                                $(json.report.panel[p].tables[t].sel + " .expander", scope.reportSelector).each(function () {
                                                    expandme(this, json.report.panel[p].tables[t].expandIndexes, true);
                                                    //$(this).trigger("click");
                                                });
                                            }
                                        }
                                        if (a$.exists(json.report.panel[p].tables[t].sort)) {
                                            if ($(json.report.panel[p].tables[t].sel + " .acuity-tablesorter>thead>tr", scope.reportSelector).length > 1) {
                                                $(" th",$(json.report.panel[p].tables[t].sel + " .acuity-tablesorter>thead>tr", scope.reportSelector).first()).each(function() {
                                                    $(this).addClass("{sorter: false}");
                                                });
                                            }
                                            $(json.report.panel[p].tables[t].sel + " .acuity-tablesorter", scope.reportSelector).each(function () {
                                                //alert("debug:adding sort to table4");
                                                $(this).tablesorter({ textExtraction: myTextExtraction }).bind("sortStart", function(e, t) {
                                                    $(".report-tableeditor", scope.reportSelector).parent().remove(); //Get the TR
                                                    $(".app-journal-link", scope.reportSelector).html("+");
                                                }); //The "Rank" may be in various columns, so not save to sort by column
                                                //alert("debug:window.apmPerformanceColors=" + window.apmPerformanceColors);


                                                var foundsubfield = false;
                                                $(".rpt-subfieldlist", this).each(function() {
                                                    foundsubfield = true;
                                                    if ($(this).prop("tagName") != "INPUT") {
                                                        $(this).html($(this).html().replace(/,/g,'<br />'));
                                                    }
                                                    else {
                                                        $(this).attr("placeholder","+").css("text-align","left");
                                                        if ($(this).val() != "") {
                                                            var vs = $(this).val().split(",");
                                                            $(this).val("");
                                                            $(this).attr("value",""); //why is this necessary?
                                                            for (var vi = vs.length - 1;vi >= 0; vi--) {
                                                                $(this).parent().prepend('<div class="rpt-subfieldrecord" style="position:relative;display:block;"><span class="rpt-subfieldentry">' + vs[vi] + '</span>&nbsp;&nbsp;&nbsp;&nbsp;<span title="Remove Entry" style="cursor:pointer;font-weight: bold;position:absolute;top:0px;right:0px;height:10px;width:10px;" class="rpt-subfieldremove">-</span></div>');
                                                            }
                                                        }
                                                    }
                                                });
                                                if (foundsubfield) {
                                                    $(".rpt-subfieldremove").unbind().bind("click", function() {
                                                        $(this).prev().removeClass("rpt-subfieldentry");
                                                        var myval = "";
                                                        $(".rpt-subfieldentry",$(this).parent().parent()).each(function() {
                                                            if (myval != "") myval += ",";
                                                            myval += $(this).html();
                                                        });
                                                        var p = $(this).parent().parent();
                                                        $(".rpt-subfieldrecord", p).remove();
                                                        $(".rpt-subfieldlist", p).val(myval).trigger("change");
                                                    });
                                                }

                                                $(".bal-colorme", this).each(function () {
                                                    var vc = parseFloat($(this).html());
                                                    var color = "white";
                                                    var textColor = "black";
                                                    for (var ci in a$.WindowTop().apmPerformanceColors) {
                                                        if (vc >= a$.WindowTop().apmPerformanceColors[ci].threshold) {
                                                            color = a$.WindowTop().apmPerformanceColors[ci].color;
                                                            textColor = a$.exists(a$.WindowTop().apmPerformanceColors[ci].textColor) ? a$.WindowTop().apmPerformanceColors[ci].textColor : "#FEFEFE";
                                                            break;
                                                        }
                                                    }
                                                    $(this).removeClass("bal-colorme").addClass("bal-colored").css("color", textColor).css("font-weight", "bold");
                                                    $(this).parent().css("background-color", color);
                                                });
                                                $(".rpt-colorme", this).each(function () {
                                                    var color = "white";
                                                    var textColor = "black";
                                                    if ($(this).attr("color")) {
                                                        color = $(this).attr("color");
                                                    }
                                                    if ($(this).attr("textcolor")) {
                                                        textColor = $(this).attr("textcolor");
                                                    }
                                                    $(this).removeClass("rpt-colorme").addClass("rpt-colored").css("color", textColor).css("font-weight", "bold");
                                                    $(this).parent().css("background-color", color);
                                                });
                                                //Remove the sort references from all but the last line in the header.
                                                var lasti = $(" thead", this).children().length - 1;
                                                var idx = 0;
                                                $(" thead tr", this).each(function () {
                                                    $(" th", this).each(function () {
                                                        if (idx < lasti) {
                                                            $(this).removeClass("header").removeClass("headerSortUp").removeClass("headerSortDown");
                                                        }
                                                    });
                                                    idx++;
                                                });
                                            });
                                            for (var s in json.report.panel[p].tables[t].sort) {
                                                //alert("debug: sorting3 column=" + json.report.panel[p].tables[t].sort[s].column + ", direction=" + json.report.panel[p].tables[t].sort[s].direction);
                                                $(" .header", json.report.panel[p].tables[t].sel).each(function () {
                                                    if ($(this).html() == json.report.panel[p].tables[t].sort[s].column) {
                                                        if (json.report.panel[p].tables[t].sort[s].direction == "desc") {
                                                            $(this).trigger("click");
                                                            $(this).trigger("click");
                                                        }
                                                        else {
                                                            $(this).trigger("click");
                                                        }
                                                        //alert("debug: found column, index = " + $(this).index());
                                                    }
                                                });
                                            }
                                        }


                                        //DEV: TODO: Experimenting with table drilling (needed for Sidekick)
                                        if (scope.panel == "sk_assist_table") {
                                            $(".rpt-table tbody tr", scope.reportSelector).each(function () {
                                                $(this).children(":first").css("cursor", "pointer").css("color", "blue").css("text-decoration", "underline").unbind().bind("click", function () {
                                                    var filterkeyidx = 0;
                                                    $("thead tr", $(this).parent().parent().parent()).eq(1).children().each(function () {
                                                        if ($(this).html() == "filterkey") {
                                                            filterkeyidx = $(this).index();
                                                            //alert("debug: filterkeyidx =" + filterkeyidx);
                                                        }
                                                    });
                                                    $rootScope.$broadcast('scheduleOneOnOne', {
                                                        filterkey: $(this).parent().children().eq(filterkeyidx).html(),
                                                        filtername: $(this).parent().children().eq(0).html()
                                                    });
                                                })
                                            });
                                        }
                                        else {
                                            //MADE2DEV2
                                            //$($("tbody td", json.report.panel[p].tables[t].sel), scope.reportSelector).unbind(); //Clear it up
                                        }


                                        var tabletooltipfound = false;
                                        $("thead .tbl-tabletooltip", json.report.panel[p].tables[t].sel).each(function () {
                                            tabletooltipfound = true;
                                        });
                                        $("thead .tbl-ttt", json.report.panel[p].tables[t].sel).each(function () {
                                            tabletooltipfound = true;
                                        });
                                        var drillkeyfound = false;
                                        var servicekeyfound = false; //MADEDEV
                                        $("thead .tbl-drillkey", json.report.panel[p].tables[t].sel).each(function () {
                                            drillkeyfound = true;
                                        });
                                        $("thead .tbl-dk", json.report.panel[p].tables[t].sel).each(function () {
                                            drillkeyfound = true;
                                        });
                                        //2023-12-07 - Drill keyed cells now get the "moreinfo" class (do I want this general?)
                                        if (drillkeyfound /* && (a$.urlprefix(true).indexOf("mnt") == 0) */) {
                                            //alert("debug: drill key found 5");
                                            $(" th", $(" thead tr", scope.reportSelector).last()).each(function() {
                                                var moreinfo = false;
                                                $("td.tbl-dk-" + $(this).html().toString().replace(/[ ,(,),+]/g, "-"), scope.reportSelector).each(function () {
                                                    moreinfo = true;
                                                });
                                                if (moreinfo) {
                                                    var myindex = $(this).index();
                                                    $(" tbody tr", scope.reportSelector).each(function() {
                                                        //alert("debug: adding class moreinfo to: " + $(" td",this).eq(myindex).html());
                                                        if (($(" td",this).eq(myindex).html()!="") && ($(" td",this).eq(myindex).html()!="-1000")) {
                                                            $(" td",this).eq(myindex).addClass("moreinfo");
                                                        }
                                                    });
                                                }                                                
                                            });
                                        }

                                        $("thead .tbl-sk", json.report.panel[p].tables[t].sel).each(function() { //MADEDEV
                                            servicekeyfound = true;
                                        });

                                        $(".td-tooltip", scope.reportSelector).bind("mouseenter mouseleave", function(event) {
                                            if (event.type=="mouseleave") {
                                                scope.currentUid = a$.guid();
                                                $(".tbl-mytip", scope.reportSelector).hide();
                                                return false;
                                            }
                                            var bld = $(this).html();
                                                if (bld != "") {
                                                    var left = event.pageX + 0; //duck 50
                                                    var top = event.pageY - 20;
                                                    if ((top + 300) >= window.innerHeight) top -= 300;
                                                    if ((left + 275) >= window.innerWidth) left -= 400;
                                                    if (false) { //(bld.indexOf("GET:") == 0) {
                                                        if ($(this).html() != "-1000") {
                                                            $('.tbl-mytip', scope.reportSelector).html("").css({top: top,left: left}).show();
                                                            clicked_drill_td(this,false,true);
                                                        }
                                                        else {
                                                            $('.tbl-mytip', scope.reportSelector).hide(); 
                                                        }
                                                    }
                                                    else {
                                                        $('.tbl-mytip', scope.reportSelector).html(bld).css({ top: top, left: left }).show();
                                                    }
                                                }
                                                else {
                                                    $('.tbl-mytip', scope.reportSelector).hide();
                                                    var g=1;
                                                }
                                        });

                                        if (tabletooltipfound || drillkeyfound || servicekeyfound) {
                                            //Sick of qtip.
                                            $(".tbl-mytip", scope.reportSelector).remove();
                                            $(scope.reportSelector).append('<div class="tbl-mytip" style="position:fixed;opacity:0.8;display:none;z-index:9999;">My Tool Tip</div>');
                                            //MADEDEV (add .report-titlelink selector)
                                            $(json.report.panel[p].tables[t].sel + " tbody td"/*TEMPREMOVE: ,tbody td .report-titlelink"*/, scope.reportSelector).bind("mouseenter mouseleave", function (event) {
                                                if (event.type=="mouseleave") {
                                                    scope.currentUid = a$.guid();
                                                    // ducktest3 $(".tbl-mytip", scope.reportSelector).hide();
                                                    return false;
                                                }
                                                var bld = "";
                                                scope.currentUid = a$.guid();
                                                var selcolname = $(" th", $(" thead tr", $(this).parent().parent().parent()).last()).eq($(this).index()).html(); //MADEDEV
                                                if (selcolname != null) {
                                                    if (selcolname.toString().indexOf("report-titlelink") > 0) {
                                                        selcolname = $(".report-titlelink",$(" th", $(" thead tr", $(this).parent().parent().parent()).last()).eq($(this).index())).html(); //MADEDEV
                                                    }
                                                }
                                                //MADEDEV
                                                var tsel = null;
                                                if (selcolname != null) {
                                                    $(".tbl-ttt-" + selcolname.replace(/ /g, "-"), $(this).parent()).each(function () {
                                                        bld = $(this).html();
                                                        tsel = this;
                                                    });
                                                }
                                                if (bld == "") {
                                                    $(".tbl-tabletooltip", $(this).parent()).each(function () {
                                                        bld = $(this).html();
                                                        tsel = this;
                                                    });
                                                }
                                                if (bld != "") {
                                                    var left = event.pageX + 0; //duck 50
                                                    var top = event.pageY - 20;
                                                    if ((top + 300) >= window.innerHeight) top -= 300;
                                                    if ((left + 275) >= window.innerWidth) left -= 400;
                                                    if (bld.indexOf("GET:") == 0) {
                                                        if ($(this).html() != "-1000") {
                                                            $('.tbl-mytip', scope.reportSelector).html("").css({top: top,left: left}).show();
                                                            clicked_drill_td(this,false,true);
                                                        }
                                                        else {
                                                            $('.tbl-mytip', scope.reportSelector).hide(); 
                                                        }
                                                    }
                                                    else {
                                                        $('.tbl-mytip', scope.reportSelector).html(bld).css({ top: top, left: left }).show();
                                                    }
                                                }
                                                else {
                                                    $('.tbl-mytip', scope.reportSelector).hide();
                                                }
                                                var pointer = false;
                                                //MADEDEV
                                                if (selcolname != null) {
                                                    $(".tbl-dk-" + selcolname.replace(/[ ,(,),+]/g, "-"), $(this).parent()).each(function () {
                                                        //bld = $(this).html();
                                                        pointer = true;
                                                    });
                                                }
                                                if (!pointer) {
                                                    $(".tbl-drillkey", $(this).parent()).each(function () {
                                                        //bld = $(this).html();
                                                        pointer = true;
                                                    });
                                                }
                                                if (pointer) {
                                                    $(this).css("cursor", "pointer");
                                                }
                                                else {
                                                    $(this).css("cursor", "");
                                                }

                                            });

                                        }

                                        if (a$.exists(scope.suppressjournallink) && (scope.suppressjournallink == "TeamLead") && ($.cookie("TP1Subrole") == "TeamLead")) {
                                            $(".app-journal-link", scope.reportSelector).remove();
                                        }

                                        //MADEDEV
                                        $(".report-input-service",scope.reportSelector).unbind().bind("change",function(event) {
                                            var myservice = $(this).attr("service");
                                            appApmContentTriggers.process(myservice, this, event, function() {
                                                scope.getreport(true); //Redraw function.
                                            }); 
                                            //TODO: This needs tested in a V3 context.
                                            /*
                                            scope.apply(function () {
                                                var cl = '<ng-table-editor style="overflow:auto;background:transparent;" dataview="DAS:JournalTEST" edit="ng-form-journal" headertext="Journal" tablesum="Occurrence" class="addrecord-table" allow="/jeffgack,dweather,gsalvato/" disallow="//CSR"></ng-table-editor>';
                                                //alert("debug:1 cL=" + cl);
                                                var ele = $compile(cl)(scope);
                                                angular.element(scope.reportSelector).empty().append(ele);
                                            });
                                            */
                                        });
                                        //MADEDEV
                                        function selectScope(me) {
                                            if (! $(me).parent().hasClass("rpt-scope-highlight")) {
                                                var userid=$(".report-click-service",$(me).parent()).eq(0).attr("userid");
                                                var notcsr=$(".report-click-service",$(me).parent()).eq(0).attr("notcsr");
                                                if (notcsr != "true") {
                                                    //alert("debug: change filter to userid=" + userid);
                                                    $("#selCSRs", a$.WindowTop().document).val(userid);
                                                    a$.WindowTop().$("#selCSRs", a$.WindowTop().document).trigger("liszt:updated");
                                                }
                                            }
                                        }
                                        if (scope.scopeselect) {
                                            $("td",scope.reportSelector).bind("click", function() {
                                                selectScope(this);
                                            });
                                        }

                                        $(".report-click-service",scope.reportSelector).unbind().bind("click",function(event) {
                                            if ((scope.scopeselect) && ($(this).closest("td").length > 0)) {
                                                if ($(this).parent().hasClass("rpt-scope-highlight")) {
                                                    event.stopPropagation();
                                                }
                                                else if ($(this).is(":checkbox")) {
                                                    event.stopPropagation(); //Checkboxes aren't used for selection
                                                }
                                                else {
                                                    if ($(this).attr("notcsr") != "true") {
                                                        event.stopPropagation(); //2023-11-13 - Service always trumps a drill.
                                                        selectScope(this);  // WAS: return true; //Keep propagating
                                                        event.stopPropagation(); //2023-11-13 - Service always trumps a drill.
                                                    }
                                                }
                                            }
                                            var myservice = $(this).attr("service");
                                            var bypass = false;
                                            if (myservice == "EditJournalRecord") {                                                
                                                //attr journalid (if absent, this is a new journal record)
                                                //attr userid (must be present)
                                                //TODO: Decouple the $parent stuff in journalform.js in the even there is no TableEditor parent.
                                                //TODO: Add a "readonly" attribute that can be passed, for the case when the permission isn't passed via $parent.formeditsave
                                                if (($(this).attr("userid") == null)||($(this).attr("userid") == "")) {
                                                    alert("userid attribute not found");
                                                }
                                                else {
                                                    var me2 = this;
                                                    scope.$apply(function () {
                                                        var ele = $compile('<ng-form-journal popup dataview="DAS:JournalTEST" id="' + $(me2).attr("journalid") + '" userid="' + $(me2).attr("userid") + '"></ng-form-journal>')(scope);
                                                        angular.element($(" .form-anchor-report")).empty().append(ele); //TODO: Search for this and if not present, prepend it inside the <ng-legacy-container> tag.
                                                    });
                                                }
                                                bypass = true;
                                            }
                                            else if (myservice == "CreateMultiJournal") {
                                                alert("debug: TODO: Install multi-journal behavior for freed journal form.");

                                                //if (window.self === window.top) { //NOT In an iframe (so
                                                //FAIL: This is clearly no longer dependent on being inside a report, so move the CreateMultiJournal service out to the ContentTriggers code.
                                                //NOPE: Don't rely on .form-anchor-page, instead search for an ng-legacy-container and prepend it in. - On second thought, no.
                                                //NOPE: In the event no ng-legacy-container is found, display an alert (You can't pop up a journal if there's no ng-legacy-container (and therefore no TPO Angular).

                                                scope.$apply(function () {
                                                    var ele = $compile('<ng-form-journal popup dataview="DAS:JournalTEST" id="" multiuser="true" userid="cheryl.bullen"></ng-form-journal>')(scope);
                                                    angular.element($(" .form-anchor-journal")).empty().append(ele); //TODO: Search for this and if not present, prepend it inside the <ng-legacy-container> tag.
                                                });
                                                bypass = true;
                                            }
                                            else if (myservice == "SelectJournals") {
                                                //if (window.self === window.top) { //NOT In an iframe (so
                                                //NOTE: This won't work if there's no angular available.
                                                $(".report-tableeditor").parent().remove(); //Get the TR
                                                if ($(this).html() == "-") {
                                                    $(this).html("+");
                                                    return;
                                                }
                                                else {
                                                    $(".app-journal-link",$(this).parent().parent().parent()).html("+");
                                                    $(this).html("-");
                                                }

                                                $(this).parent().parent().after('<tr><td colspan="100" class="report-tableeditor">TableEditor Here 2</td></tr>');
                                                var me = this;
                                                scope.$apply(function () {
                                                    //TODO: Should be ..Selected.CSR (tableeditor needs upgraded - or perhaps CSR needs to be passable as an attribute).                                                        
                                                    //var tbld = '<ng-table-editor style="overflow:auto;background:transparent;" dataview="DAS:JournalTEST" userid="' + $(me).attr("userid") + '" edit="ng-form-journal" headertext="Journal" tablesum="Occurrence" class="addrecord-table" allow="/jeffgack,dweather,gsalvato/" disallow="//CSR"></ng-table-editor>';
                                                    var tbld = '<ng-table-editor style="overflow:auto;background:transparent;" dataview="DAS:JournalTEST" userid="' + $(me).attr("userid") + '" edit="ng-form-journal" headertext="Journal" tablesum="Occurrence" class="addrecord-table" allow="/jeffgack,dweather,gsalvato/" disallow=""></ng-table-editor>';
                                                    var ele = $compile(tbld)(scope);
                                                    angular.element($(" .report-tableeditor", element)).empty().append(ele);
                                                });
                                                bypass = true;
                                            }
                                            if (!bypass) {
                                                appApmContentTriggers.process(myservice, this, event, function() {
                                                    scope.getreport(true); //Redraw function.
                                                });
                                            }
                                        }); //this me



                                        //MADELIVE MADEDEV
                                        if ($(" .tbl-serieslink", json.report.panel[p].tables[t].sel).length > 0) {
                                            function setstrokewidth(me, width) {
                                                var match = $(" .tbl-serieslink", $(me).parent()).html();
                                                var matchlength = 0;
                                                if (match.indexOf("*") >= 0) {
                                                    match = match.substring(0, match.indexOf("*"));
                                                    matchlength = match.length;
                                                }

                                                for (var chart in window.apmCharts) {
                                                    if (a$.exists(window.apmCharts[chart].series)) {
                                                        for (var s in window.apmCharts[chart].series) {
                                                            if (!a$.exists(window.apmCharts[chart].series[s].name)) {
                                                                break;
                                                            }
                                                            var matches = matchlength ? (window.apmCharts[chart].series[s].name.substring(0, matchlength) == match) : (window.apmCharts[chart].series[s].name == match);
                                                            if (matches) {
                                                                window.apmCharts[chart].series[s].graph.attr('stroke-width', "" + width);
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            $(" td", $("tbody .tbl-serieslink", json.report.panel[p].tables[t].sel).parent()).unbind("mouseover mouseout").bind("mouseover", function () {
                                                //alert("debug: over series: " + $(" .tbl-serieslink",$(this).parent()).html());
                                                setstrokewidth(this, "10");
                                            }).bind("mouseout", function () {
                                                setstrokewidth(this, "2");
                                            });
                                        }

                                    }
                                }
                                $(".acuity-download", $((is != "") ? is : scope.reportSelector)).unbind().bind("click", function () {
                                    acuitytable_download("csv", $(this).parent().parent().children().eq($(this).parent().index() + 1),$(".rpt-title",$(this).parent()).html());
                                });

                                $(".rpt-filter-startdate,.rpt-filter-enddate").datepicker(); //MADELIVE:
                                var CLICKEDPICKER = false;
                                $(".rpt-filter-daterange", scope.reportSelector).unbind().bind("click", function () {
                                    CLICKEDPICKER = true;
                                }).bind("change", function () {
                                    //clicked_drill_td(this, true);
                                    var selfilters = $(this).closest(".rpt-filters", scope.reportSelector);
                                    var filterkey = "";
                                    if ($(" .rpt-filter-startdate", selfilters).eq(0).hasClass("rpt-datetype-interval")) {
                                        filterkey = "StartDate=" + $(" .rpt-filter-startdate", selfilters).eq(0).val() + '&EndDate=' + $(" .rpt-filter-enddate", selfilters).eq(0).val();
                                    }
                                    else { //daterange
                                        filterkey = "daterange=" + $(" .rpt-filter-startdate", selfilters).eq(0).val() + ',' + $(" .rpt-filter-enddate", selfilters).eq(0).val();
                                    }
	   			                    scope.$apply(function () {
		            	                $rootScope.$broadcast('paramsOverride', {
        		        		            assoc: scope.assoc,
            		    		            params: filterkey
                		                });	   			    	
     		    	                });

                                });
                                $(".rpt-filter-daterange-icon").unbind().bind("click", function () {
                                    var dr = $(" .rpt-filter-daterange", this);
                                    if ($(dr).is(":visible")) {
                                        if (!CLICKEDPICKER) {
                                            $(dr).hide();
                                        }
                                    }
                                    else {
                                        $(dr).show();
                                    }
                                    CLICKEDPICKER = false;
                                });

                                if ((is == "") || panelfill) { //MADELIVE (added panelfill). MADEDEV
                                    //MADENEWLIVE
                                    $(".rpt-panel-popup", scope.reportSelector).append('<div class="rpt-close" title="Close Panel"></div><div class="rpt-max-link rpt-max-link-plus" title="Maximize Panel"></div>');
                                    $(".rpt-close", scope.reportSelector).unbind().bind("click", function () {
                                        $(this).parent().hide();
                                    });
                                    if (panelfill) { //Note: Panelfill may not persist in report.js, watch for it.
                                        $(".rpt-panel", scope.reportSelector).append(((scope.userpopup=="true")?'<div class="rpt-close rpt-user-close" title="Close Panel"></div>':'') + '<div class="rpt-max-link rpt-max-link-plus" title="Maximize Panel"></div>'); //MADELIVE: add title.
                                    }
                                    else {
                                        $(".rpt-table-topper,.rpt-chart-topper", scope.reportSelector).append(((scope.userpopup=="true")?'<div class="rpt-close rpt-user-close" title="Close Panel"></div>':'') + '<div class="rpt-max-link rpt-max-link-plus" title="Maximize Panel"></div>'); //MADELIVE: add title.
                                    }
                                    if (scope.userpopup=="true") {
                                        $(".rpt-close", scope.reportSelector).unbind().bind("click", function () {
                                            //$(this).parent().parent().hide();
                                            $(this).closest(".ui-draggable").hide();
                                        });
                                    }
                                    $(".rpt-max-link", scope.reportSelector).unbind().bind("click", function () {
                                        //alert("debug: clicked maximize");
                                        var maximized = false;
                                        if (panelfill) {
                                            if ($(this).parent().hasClass("rpt-panel-maximized")) {
                                                $(this).parent().removeClass("rpt-panel-maximized");
                                                $(this).attr("title", "Maximize Panel"); //MADELIVE:
                                                $(this).html(""); //Maximize
                                                $(this).removeClass("rpt-max-link-minus").addClass("rpt-max-link-plus");
		                                        //FIX:
    		                                    $(".rpt-panel", scope.reportSelector).each(function() {
        	                                        if (!$(this).hasClass("rpt-panel-popup")) {
          	                                            $(this).show();
            	                                    }
              		                            });
                                            }
                                            else {
                                                maximized = true;
                                                $(this).parent().addClass("rpt-panel-maximized");
                                                $(this).attr("title", "Restore Panel"); //MADELIVE:
                                                $(this).html(""); //Restore
                                                $(this).addClass("rpt-max-link-minus").removeClass("rpt-max-link-plus");
                                                //FIX:
                                        		$(".rpt-panel", scope.reportSelector).each(function() {
                                            	    if (!$(this).hasClass("rpt-panel-popup")) {
                                                        $(this).hide();
                                            	    }
                                        		});
                                                $(this).parent().show();
                                            }
                                            $(" .rpt-highchart", $(this).parent()).each(function () { //MADELIVE: change rpt-chart to rpt-highchart
                                                if (a$.exists(window.apmCharts[$(this).attr("id")])) {
                                                    window.apmCharts[$(this).attr("id")].destroy();
                                                }
                                                setLegendDisplay(window.apmChartOptions[$(this).attr("id")], maximized);
                                                window.apmCharts[$(this).attr("id")] = new Highcharts.Chart(window.apmChartOptions[$(this).attr("id")]);
                                            });
                                            //$(window).resize();
                                        }
                                        else { //The report is the entire panel (or a popup without panelfill), so do a Supermax
                                            var selex = ".report-wrapper";
                                            if ($(this).parent().hasClass("rpt-panel-popup")) {
                                                //Find the correct popup class.
                                                for (var sp = 1; sp < 10; sp ++) {
                                                    if ($(this).parent().hasClass("rpt-popup-" + sp)) {
                                                        selex = ".rpt-popup-" + sp;
                                                        break;
                                                    }
                                                }
                                            }
                                            if ($(selex,scope.element).hasClass("rpt-panel-supermaximized")) {
                                                $(selex,scope.element).removeClass("rpt-panel-supermaximized");
                                                $(this).attr("title", "Maximize Panel"); //MADELIVE:
                                                $(this).html(""); //Maximize
                                                $(this).removeClass("rpt-max-link-minus").addClass("rpt-max-link-plus");
		                                        //FIX:
    		                                    $(".rpt-panel", scope.reportSelector).each(function() {
        	                                        if (!$(this).hasClass("rpt-panel-popup")) {
          	                                            $(this).show();
            	                                    }
              		                            });
                                            }
                                            else {
                                                maximized = true;
                                                $(selex,scope.element).addClass("rpt-panel-supermaximized");
                                                $(this).attr("title", "Restore Panel"); //MADELIVE:
                                                $(this).html(""); //Restore
                                                $(this).addClass("rpt-max-link-minus").removeClass("rpt-max-link-plus");
                                                //FIX:  I don't think this is needed here, watch popups though.
                                                /*
                                        		$(".rpt-panel", scope.reportSelector).each(function() {
                                            	    if (!$(this).hasClass("rpt-panel-popup")) {
                                                        $(this).hide();
                                            	    }
                                        		});
                                                */
                                                $(this).parent().show();
                                            }
                                            $(" .rpt-highchart", scope.element).each(function () { //MADELIVE: change rpt-chart to rpt-highchart
                                                if (a$.exists(window.apmCharts[$(this).attr("id")])) {
                                                    window.apmCharts[$(this).attr("id")].destroy();
                                                }
                                                setLegendDisplay(window.apmChartOptions[$(this).attr("id")], maximized);
                                                window.apmCharts[$(this).attr("id")] = new Highcharts.Chart(window.apmChartOptions[$(this).attr("id")]);
                                            });
                                            //$(window).resize();
                                            
                                        }
                                    });
                                }

                                //MADELIVE: New section for the intervals.
                                $(".rpt-filter-interval", $((is != "") ? is : scope.reportSelector)).unbind().bind("click", function () {
                                    if ($(this).hasClass("rpt-filter-interval-active")) return;
                                    var backstop = $(this).attr("apm-backstop");
                                    if (backstop != null) {
                                        var bs = backstop.split("_");
                                        if (bs.length == 2) {
                                            var sel = $(this).closest(".rpt-filters");
                                            var dt = $(".rpt-filter-enddate", sel).eq(0).val();
                                            var endparts = dt.split('/');
                                            var myenddate = new Date(endparts[2], endparts[0] - 1, endparts[1]);
                                            var n = parseInt(bs[1], 10);
                                            if (bs[0] == "Y") {
                                                myenddate.setFullYear(myenddate.getFullYear() - n);
                                            }
                                            else if (bs[0] == "M") {
                                                if ((myenddate.getMonth() - n) < 0) {
                                                    myenddate.setMonth((myenddate.getMonth() + 12) - n);
                                                    myenddate.setFullYear(myenddate.getFullYear() - 1);
                                                }
                                                else {
                                                    myenddate.setMonth(myenddate.getMonth() - n);
                                                }
                                            }
                                            else {
                                                alert("Note: unknown date backstop");
                                            }
                                            var safeday = 28;
                                            switch (myenddate.getMonth() + 1) {
                                                case 9: //Sep
                                                case 4: //Apr
                                                case 6:
                                                case 11:
                                                    safeday = 30;
                                                    break;
                                                case 2:
                                                    safeday = 28;
                                                    break;
                                                default:
                                                    safeday = 31;
                                                    break;
                                            }
                                            if (myenddate.getDate() < safeday) {
                                                safeday = myenddate.getDate();
                                            }
                                            $(".rpt-filter-startdate", sel).eq(0).val("" + (myenddate.getMonth() + 1) + "/" + safeday + "/" + (myenddate.getFullYear()));
                                        }
                                    }
                                    //alert("debug:backstop=" + backstop);
                                    $(" .rpt-filter-interval-active", $(this).parent()).each(function () {
                                        $(this).removeClass("rpt-filter-interval-active");
                                    });
                                    $(this).addClass("rpt-filter-interval-active");
                                    clicked_drill_td(this, true);
                                    //TODO: Check "Linked" attribute and fire all of these in all panels if set.
                                });

                                function clicked_drill_td(me, wholepanel,tooltip) {
                                    var finalparams = "";
                                    var filterkey = "";
                                    var key = "";
                                    var drillkey = ""; //MADELIVENOW2
                                    var servicekey = ""; //MADEDEV
                                    if (scope.killdrill == "true") return;
                                    if (wholepanel) {
                                        var selfilters = $(me).closest(".rpt-filters");
                                        finalparams = $(" .rpt-filter-params", selfilters).html().replace(/\&amp;/g, "&");
                                        $(" .rpt-filter-interval-active", selfilters).each(function () {
                                            filterkey = $(" .rpt-filter-param", this).html().replace(/\&amp;/g, "&");
                                            finalparams = scope.overrideparams(finalparams, filterkey);
                                        });
                                        //TEST: Get the daterange (if present) and form a parameter/

                                        //MADELIVE:
                                        if ($(" .rpt-filter-startdate", selfilters).eq(0).hasClass("rpt-datetype-interval")) {
                                            filterkey = "StartDate=" + $(" .rpt-filter-startdate", selfilters).eq(0).val() + '&EndDate=' + $(" .rpt-filter-enddate", selfilters).eq(0).val();
                                        }
                                        else { //daterange
                                            filterkey = "daterange=" + $(" .rpt-filter-startdate", selfilters).eq(0).val() + ',' + $(" .rpt-filter-enddate", selfilters).eq(0).val();
                                        }
                                        finalparams = scope.overrideparams(finalparams, filterkey);

                                    }
                                    else {
                                        if ($(" thead .tbl-filterkey", $(me).parent().parent().parent()).length) {
                                            var filterkeycolidx = $(" thead .tbl-filterkey", $(me).parent().parent().parent()).index();
                                            filterkey = $(" td", $(me).parent()).eq(filterkeycolidx).html().replace(/&amp;/gi, "&");
                                        }
                                        //alert("debug: filterkey = " + filterkey);
                                        if ($(" thead .tbl-key", $(me).parent().parent().parent()).length) {
                                            var keycolidx = $(" thead .tbl-key", $(me).parent().parent().parent()).index();
                                            key = $(" td", $(me).parent()).eq(keycolidx).html().replace(/&amp;/gi, "&"); ;
                                        }
                                        //alert("debug: key = " + key);

                                        //MADE2DEV2
                                        //WAS: var selcolname = $(" th", $(" thead tr", $(me).parent().parent().parent()).last()).eq($(me).index()).html();
                                        //WAS 2:
                                        //var selcolname = $(" th", $(" thead tr", $(me).parent().parent().parent()).last()).eq($(me).index()).html(); //MADEDEV
                                        //IS:
                                        var selcolname = "";
                                        if ($("tr",$("thead",$(me).closest("table"))).length > 2) {
                                            selcolname = $("th",$("tr",$("thead",$(me).closest("table"))).eq(1)).eq($(me).index()).html();
                                        }
                                        else {
                                            selcolname = $("th",$("tr",$("thead",$(me).closest("table"))).last()).eq($(me).index()).html();
                                        }

                                        if (selcolname.toString().indexOf("report-titlelink") > 0) {
                                            selcolname = $(".report-titlelink",$(" th", $(" thead tr", $(me).parent().parent().parent()).last()).eq($(me).index())).html(); //MADEDEV
                                        }
                                        //alert("debug: selcolname=" + selcolname);                            

                                        //MADE2DEV2
                                        //REMOVE:
                                        /*
                                        if ($(" thead .tbl-drillkey", $(me).parent().parent().parent()).length) {
                                        var drillkeycolidx = $(" thead .tbl-drillkey", $(me).parent().parent().parent()).index();
                                        drillkey = $(" td", $(me).parent()).eq(drillkeycolidx).html().replace(/&amp;/gi, "&"); ;
                                        }
                                        */
                                        //IS:
                                        drillkey = "";
                                        //MADEDEV
                                        if (tooltip) {
                                            if (selcolname != null) {
                                                $(".tbl-ttt-" + selcolname.replace(/[ ,(,),+]/g,'-'),$(me).parent()).each(function() {
                                                    drillkey = $(this).html();
                                                });
                                            }
                                            if (drillkey == "") {
                                                $(".tbl-tabletooltip",$(me).parent()).each(function() {
                                                    drillkey = $(this).html();
                                                });
                                            }
                                            drillkey = drillkey.replace("GET:","");
                                        }
                                        else {
                                            if (selcolname != null) {
                                                $(".tbl-dk-" + selcolname.replace(/[ ,(,),+]/g,'-'),$(me).parent()).each(function() {
                                                    drillkey = $(this).html();
                                                });
                                            }
                                            if (drillkey == "") {
                                                $(".tbl-drillkey",$(me).parent()).each(function() {
                                                    drillkey = $(this).html();
                                                });
                                            }
                                        }
                                        drillkey = drillkey.replace(/&amp;/g, "&");
                                        //alert("debug: drillkey = " + drillkey);

                                        servicekey = "";
                                        //MADEDEV
                                        if (selcolname != null) {
                                            $(".tbl-sk-" + selcolname.replace(/ /g,"-"),$(me).parent()).each(function() {
                                                servicekey = $(this).html();
                                            });
                                        }
                                        servicekey = servicekey.replace(/&amp;/g,"&");
                                        //if (servicekey != "") alert("debug: servicekey = " + servicekey);

                                        var seltblid = $(" .tbl-ident", $(me).parent()).html();
                                        //alert("debug: seltblid=" + seltblid);

                                        var found = false;
                                        var serieskey = "";
                                        if ($(" tfoot .tbl-ident-" + seltblid, $(me).parent().parent().parent()).length) {
                                            serieskey = $(" tfoot .tbl-ident-" + seltblid, $(me).parent().parent().parent()).html().replace(/&amp;/gi, "&"); ;
                                        }
                                        //alert("debug: serieskey=" + serieskey);
                                        //DONE: Substitute to single, precedence is key > filterkey > serieskey
                                        finalparams = "&" + serieskey;

                                        finalparams = scope.overrideparams(finalparams, filterkey);
                                        finalparams = scope.overrideparams(finalparams, key);
                                        finalparams = scope.overrideparams(finalparams, drillkey); //MADELIVENOW2
                                        
                                        if ((filterkey.toString().indexOf("=") < 0)
                                            && (key.toString().indexOf("=") < 0)
                                            && (drillkey.toString().indexOf("=") < 0)
                                        ) return; //2023-11-13 - Require some key change (this may be a problem, needs testing).

                                        finalparams = "drillcolumn=" + selcolname + finalparams;
                                        if (finalparams.indexOf("cid=") < 0) {
                                            finalparams = "cid=" + scope.cid + "&" + finalparams;
                                        }
                                    }
                                    if ($.cookie("TP1Username") == "jeffgack") {
                                        alert("debug: finalparams = " + finalparams);
                                    }

                                    a$.showprogress("plotprogress");

                                    //Look for a broadcast
                                    var bs = finalparams.split("&");
                                    for (var b in bs) {
                                        var bss = bs[b].split("=");
                                        if (bss[0] == "BROADCAST") {
                                            //alert("debug: preparing to broadcast: " + bss[1]);
                                            var bsss = bss[1].split("/");
                                            $rootScope.$broadcast(bsss[0], {
                                                data: bsss[1]
                                            });

                                        }
                                    }

                                    if (finalparams.indexOf("cid=") >= 0) { //Don't even call if no cid found.
                                        scope.showprogress();
                                        if (servicekey != "") { //MADEDEV
                                            var ss = servicekey.split("&");
                                            var service = "";
                                            var data = {};
                                            for (var s in ss) {
                                                var sse = ss[s].split("=");
                                                if (sse[0] == "service") {
                                                    switch (sse[1]) {
                                                        case "SendAcknowledgementRequest":
                                                            data.lib = "qa";
                                                            data.cmd=sse[1];
                                                            break;
                                                        case "EditField": //experimental
                                                            //DAS/filetype/date/user/field/val
                                                            //PAY/date/user/field/val
                                                            //
                                                            break;
                                                        default:
                                                            //alert("Unrecognized Service");
                                                            return; //LEAVE!
                                                    }
                                                }
                                                else {
                                                    data[sse[0]] = sse[1];
                                                }
                                            }
                                            //alert("debug: handling service: " + servicekey);
                                            a$.ajax({
                                                type: "GET",
                                                service: "JScript",
                                                async: true,
                                                data: data,
                                                dataType: "json",
                                                cache: false,
                                                error: a$.ajaxerror,
                                                success: servicedone
                                            });
                                            function servicedone(json) {
                                                a$.hideprogress("plotprogress");
                                                if (a$.jsonerror(json)) { } else {
                                                    if (json.saved) {
                                                        $(me).html("Request Sent (test)");
                                                    }
                                                    else {
                                                        $(me).html("ERROR: No email address or monitor deleted.");
                                                    }
                                                }
                                            }
                                        }
                                        else {
                                            //if (tooltip && once) return; //Debug
                                            //if (tooltip) once +=1;
                                            a$.ajax({
                                                type: "POST",
                                                service: "JScript",
                                                async: true,
                                                data: {
                                                    lib: "editor",
                                                    cmd: "getreport",
                                                    performanceColors: a$.WindowTop().apmPerformanceColors, //MADELIVE
                                                    devmode: a$.exists(scope.devmode) ? scope.devmode : false, //document.getElementById("ReportDeveloperMode").checked,
                                                    grouping: "Combined", //$("#StgReportGrouping select").val(),
                                                    //cid: cid, //For drills, this is passed in the serieskey, or key.
                                                    dashboard: (!scope.dashboard) ? "Agent" : ((scope.dashboard == "select") ? legacyContainer.scope.filters.dashboard : scope.dashboard),
                                                    displaytype: "Grid", //displaytype,
                                                    context: "Grid", //displaytype
                                                    overrideUid: scope.currentUid
                                                },
                                                dataType: "json",
                                                cache: false,
                                                error: a$.ajaxerror,
                                                params: finalparams
                                                    + ((document.getElementById("StgInTraining") != null) ? "&InTraining=" + $("#StgInTraining select").val() : "")
                                                    + ((document.getElementById("StgAgentStatus") != null) ? "&AgentStatus=" + $("#StgAgentStatus select").val() : "")
                                                    + ((document.getElementById("StgScorecard") != null) ? "&scorecard=" + $("#StgScorecard select").val() : ""),
                                                success: scope.ngWrappedLoadedReport
                                            });
                                        }
                                    }
                                }

                                //MADELIVE: new function:
                                function changed_filter(me) {
                                    //Find the associated table to get params from.
                                    var serieskey = "";
                                    if ($(" tfoot .tbl-ident-" + seltblid, $(me).parent().parent().parent()).length) {
                                        serieskey = $(" tfoot .tbl-ident-" + seltblid, $(me).parent().parent().parent()).html().replace(/&amp;/gi, "&"); ;
                                    }
                                }

                                if (exists(json.report.panel[i].chartbuilds)) {
                                    for (var c in json.report.panel[i].chartbuilds) {
                                        //MADELIVE:
                                        //Place the name of the table into the chart report title (better to do this client-side).
                                        $(".rpt-chart-topper .rpt-title", $("#" + json.report.panel[i].chartbuilds[c].chartid).parent()).html($(" .rpt-table-topper .rpt-title", $(json.report.panel[i].chartbuilds[c].tblsel, scope.reportSelector)).eq(0).html());

                                        if (json.report.panel[i].chartbuilds[c].chartvar == "UL") {
                                            $(".rpt-toggle-table",scope.reportSelector).remove();
                                            $(".rpt-table",scope.reportSelector).hide(); //Still need this
                                            $(".rpt-chart-topper",scope.reportSelector).remove();
                                            $(".rpt-chart",scope.reportSelector).addClass("rpt-" + json.report.panel[i].chartbuilds[c].chartvar).removeClass("rpt-chart");
                                            $(json.report.panel[i].chartbuilds[c].tblsel, scope.reportSelector).hide();
                                            $("#" + json.report.panel[i].chartbuilds[c].chartid, scope.reportSelector).show(); //MADELIVE: added another parent() below
                                            var bld = "<ul>";
                                            var tsel = $(".rpt-table table",scope.reportSelector).eq(0);
                                            $("tbody tr",tsel).each(function() {
                                                bld += "<li>";
                                                $("td",this).each(function() {
                                                    if ($(this).attr("class") == null) {
                                                        bld += '<div class="li-';
                                                        bld += $("th",$("thead tr",tsel).eq(1)).eq($(this).index()).html();
                                                        bld += '">' + $(this).html() + '</div>';
                                                    }
                                                });
                                                bld += "</li>";
                                            });
                                            bld += "</ul>";
                                            $("#" + json.report.panel[i].chartbuilds[c].chartid, scope.reportSelector).html(bld);

                                        }
                                        else {
                                            if (scope.expander=="true") {
                                                $(".rpt-chart-topper .rpt-title", $("#" + json.report.panel[i].chartbuilds[c].chartid).parent()).append('<div class="rpt-max-link rpt-max-link-plus" style="right:40px;" title="Maximize Panel"></div>'); //MADELIVE: add title.

                                                $(".rpt-max-link", scope.reportSelector).unbind().bind("click", function () {
                                                    //alert("debug: clicked maximize");
                                                    var maximized = false;
                                                    var selex = ".report-wrapper";
                                                    if ($(selex,scope.element).hasClass("rpt-panel-supermaximized")) {
                                                        $(selex,scope.element).removeClass("rpt-panel-supermaximized");
                                                        $(this).attr("title", "Maximize Panel"); //MADELIVE:
                                                        $(this).html(""); //Maximize
                                                        $(this).removeClass("rpt-max-link-minus").addClass("rpt-max-link-plus");
		                                                //FIX:
    		                                            $(".rpt-panel", scope.reportSelector).each(function() {
        	                                                if (!$(this).hasClass("rpt-panel-popup")) {
          	                                                    $(this).show();
            	                                            }
              		                                    });
                                                    }
                                                    else {
                                                        maximized = true;
                                                        $(selex,scope.element).addClass("rpt-panel-supermaximized");
                                                        $(this).attr("title", "Restore Panel"); //MADELIVE:
                                                        $(this).html(""); //Restore
                                                        $(this).addClass("rpt-max-link-minus").removeClass("rpt-max-link-plus");
                                                        $(this).parent().show();
                                                    }
                                                    $(" .rpt-highchart", scope.element).each(function () { //MADELIVE: change rpt-chart to rpt-highchart
                                                        if (a$.exists(window.apmCharts[$(this).attr("id")])) {
                                                            window.apmCharts[$(this).attr("id")].destroy();
                                                        }
                                                        setLegendDisplay(window.apmChartOptions[$(this).attr("id")], maximized);
                                                        window.apmCharts[$(this).attr("id")] = new Highcharts.Chart(window.apmChartOptions[$(this).attr("id")]);
                                                    });
                                                    //$(window).resize();
                                            
                                                });
                                            }

                                            $(json.report.panel[i].chartbuilds[c].tblsel, scope.reportSelector).hide();
                                            $("#" + json.report.panel[i].chartbuilds[c].chartid).show(); //MADELIVE: added another parent() below
                                            $(" .rpt-toggle", $("#" + json.report.panel[i].chartbuilds[c].chartid).parent().parent()).unbind().bind("click", function () {
                                                if ($(" .rpt-table", $(this).parent()).is(":visible")) {
                                                    $(this).removeClass("rpt-toggle-chart").addClass("rpt-toggle-table");
                                                    $(" .rpt-table", $(this).parent()).hide();
                                                    $(" .rpt-chart", $(this).parent()).show();
                                                }
                                                else {
                                                    $(this).removeClass("rpt-toggle-table").addClass("rpt-toggle-chart");
                                                    $(" .rpt-table", $(this).parent()).show();
                                                    $(" .rpt-chart", $(this).parent()).hide();
                                                }
                                            });

                                            var seriesnameidx = 0; //Always the first column, assuming standard table.
                                            var xidx = -1;
                                            var yidx = -1;
                                            var ytargetidx = -1;
                                            var datalabelidx = -1;
                                            var tooltipidx = -1;
                                            var seqidx = -1;
                                            $(" th", $(" thead tr", $(json.report.panel[i].chartbuilds[c].tblsel, scope.reportSelector)).last()).each(function () {
                                                if ($(this).html() == "x") {
                                                    xidx = $(this).index();
                                                }
                                                if ($(this).html() == "seq") {
                                                    seqidx = $(this).index();
                                                }
                                                if ($(this).html() == "y") {
                                                    yidx = $(this).index();
                                                }
                                                if ($(this).html() == "y-target") {
                                                    ytargetidx = $(this).index();
                                                }
                                                if ($(this).html() == "datalabel") {
                                                    datalabelidx = $(this).index();
                                                }
                                                if ($(this).html() == "tooltip") {
                                                    tooltipidx = $(this).index();
                                                }
                                            });

                                            scope.chartvar = json.report.panel[i].chartbuilds[c].chartvar;
                                            var chart = appChartDefinitions.connectedChart({
                                                chartVar: json.report.panel[i].chartbuilds[c].chartvar,
                                                renderTo: json.report.panel[i].chartbuilds[c].chartid,
                                                tableSelector: $(json.report.panel[i].chartbuilds[c].tblsel, scope.reportSelector),
                                                idx: {
                                                    seriesname: seriesnameidx,
                                                    x: xidx,
                                                    y: yidx,
                                                    seq: seqidx,
                                                    datalabel: datalabelidx,
                                                    tooltip: tooltipidx
                                                },
                                                onClick: myclickfunction
                                            });

                                            function myclickfunction(e) {
                                                //alert("debug: click fired");
                                                var i = 1;
                                                var xidx = -1;
                                                var seriesnameidx = 0; //Always
                                                var me = this;
                                                $(" th", $(" thead tr", $($(" .rpt-table", $(me.series.chart.renderTo).parent().parent()))).last()).each(function () { //MADELIVE: Added another .parent()
                                                    if ($(this).html() == "x") {
                                                        xidx = $(this).index();
                                                    }
                                                });
                                                var foundit = false;
                                                $(" tbody tr", $(" .rpt-table", $(me.series.chart.renderTo).parent().parent())).each(function () { //MADELIVE: Added another .parent()
                                                    if (!foundit) {
                                                        var x = $(" td:nth-child(" + (xidx + 1) + ")", this).html();
                                                        var seriesname = $(" td:nth-child(" + (seriesnameidx + 1) + ")", this).html();
                                                        if (exists(me.category)) { //bar
                                                            if ((x == me.category) && (seriesname == me.series.name)) {
                                                                foundit = true;
                                                                clicked_drill_td($(" td:nth-child(" + (seriesnameidx + 1) + ")", this), false);
                                                            }
                                                        }
                                                        else { //pie
                                                            if (x == me.name) {
                                                                foundit = true;
                                                                clicked_drill_td($(" td:nth-child(" + (seriesnameidx + 1) + ")", this), false);
                                                            }
                                                        }
                                                    }
                                                });

                                                //this.category = x = xidx
                                                //this.series.name = series anme = seriesnameidx
                                                //find, then get key and filterkey, then call a common function. 
                                            }

                                            if (!chart.customLoad) { //Bypass all loading if customLoad is true
                                                //alert("debug:xidx=" + xidx);
                                                if (exists(chart.xAxis)) {
                                                    if (seqidx >= 0) { //Use the sequence field to order the x axes BEFORE populating..
                                                        var seq = [];
                                                        var seqx = [];
                                                        $(" tbody tr td:nth-child(" + (seqidx + 1) + ")", $(json.report.panel[i].chartbuilds[c].tblsel, scope.reportSelector)).each(function () {
                                                            var s = parseInt($(this).html(), 10);
                                                            if (seq.indexOf(s) === -1) {
                                                                seq.push(s);
                                                                var x = $(" td:nth-child(" + (xidx + 1) + ")", $(this).parent()).html();
                                                                seqx.push([s, x]);
                                                            }
                                                        });
                                                        function sortSeqx(a, b) {
                                                            if (a[0] === b[0]) {
                                                                return 0;
                                                            }
                                                            else {
                                                                return (a[0] < b[0]) ? -1 : 1;
                                                            }
                                                        }
                                                        seqx.sort(sortSeqx);
                                                        for (var s in seqx) {
                                                            chart.xAxis.categories.push(seqx[s][1]);
                                                        }
                                                    }
                                                    else {
                                                        $(" tbody tr td:nth-child(" + (xidx + 1) + ")", $(json.report.panel[i].chartbuilds[c].tblsel, scope.reportSelector)).each(function () {
                                                            var x = $(this).html();
                                                            chart.xAxis.categories.indexOf(x) === -1 ? chart.xAxis.categories.push(x) : "";
                                                        });
                                                    }
                                                    chart.series = [];
                                                    $(" tbody tr td:nth-child(" + (seriesnameidx + 1) + ")", $(json.report.panel[i].chartbuilds[c].tblsel, scope.reportSelector)).each(function () {
                                                        var nm = $(this).html();
                                                        var found = false;
                                                        for (var n in chart.series) {
                                                            if (chart.series[n].name == nm) {
                                                                found = true;
                                                                break;
                                                            }
                                                        }
                                                        if (!found) {
                                                            if (ytargetidx != -1) {
                                                                chart.series.push({ istarget: true, name: nm + " Target", data: [], point: { events: { click: myclickfunction, dblclick: myclickfunction}} });
                                                            }
                                                            chart.series.push({ istarget: false, name: nm, data: [], point: { events: { click: myclickfunction, dblclick: myclickfunction}} });
                                                        }
                                                    });

                                                    for (var s in chart.series) {
                                                        if (!chart.series[s].istarget) {
                                                            for (var x in chart.xAxis.categories) {
                                                                var found = false;
                                                                $(" tbody tr", $(json.report.panel[i].chartbuilds[c].tblsel, scope.reportSelector)).each(function () {
                                                                    if (!found) {
                                                                        if ($(" td:nth-child(" + (xidx + 1) + ")", this).html() == chart.xAxis.categories[x]) { //Greeting
                                                                            if ($(" td:nth-child(" + (seriesnameidx + 1) + ")", this).html() == chart.series[s].name) { //Indianapolis
                                                                                var ytext = $(" td:nth-child(" + (yidx + 1) + ")", this).html();
                                                                                if (ytext != "-1000") {
                                                                                    chart.series[s].data.push({
                                                                                        Label: chart.xAxis.categories[x],
                                                                                        y: parseFloat(ytext),
                                                                                        formy: $(" td:nth-child(" + (datalabelidx + 1) + ")", this).html()
                                                                                    });
                                                                                    found = true;
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                });
                                                                if (!found) {
                                                                    chart.series[s].data.push(null);
                                                                }
                                                                chart.series[s].pointPadding = 0.1;
                                                            }
                                                        }
                                                    }

                                                    if (ytargetidx != -1) {
                                                        for (var s in chart.series) {
                                                            if (chart.series[s].istarget) {
                                                                for (var x in chart.xAxis.categories) {
                                                                    var found = false;
                                                                    $(" tbody tr", $(json.report.panel[i].chartbuilds[c].tblsel, scope.reportSelector)).each(function () {
                                                                        if (!found) {
                                                                            if ($(" td:nth-child(" + (xidx + 1) + ")", this).html() == chart.xAxis.categories[x]) { //Greeting
                                                                                if (($(" td:nth-child(" + (seriesnameidx + 1) + ")", this).html() + " Target") == chart.series[s].name) { //Indianapolis                                                                                
                                                                                    var ytext = $(" td:nth-child(" + (ytargetidx + 1) + ")", this).html();
                                                                                    if (ytext != "-1000") {
                                                                                        chart.series[s].data.push({
                                                                                            Label: chart.xAxis.categories[x],
                                                                                            y: parseFloat(ytext),
                                                                                            formy: $(" td:nth-child(" + (datalabelidx + 1) + ")", this).html(),
                                                                                            color: "lightgray"
                                                                                        });
                                                                                        found = true;
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    });
                                                                    if (!found) {
                                                                        chart.series[s].data.push(null);
                                                                    }
                                                                    chart.series[s].pointPadding = 0.0;
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                                else if (!chart.custom) { //pie
                                                    $(" tbody tr", $(json.report.panel[i].chartbuilds[c].tblsel, scope.reportSelector)).each(function () {
                                                        var seriesname = $(" td:nth-child(" + (seriesnameidx + 1) + ")", this).html();
                                                        var x = $(" td:nth-child(" + (xidx + 1) + ")", this).html();
                                                        var y = $(" td:nth-child(" + (yidx + 1) + ")", this).html();
                                                        chart.series[0].name = seriesname;
                                                        chart.series[0].data.push({ name: x, y: parseFloat(y), point: { events: { click: myclickfunction, dblclick: myclickfunction}} });
                                                    });
                                                }
                                                else { //Custom Chart, traversal of the table is handled in appCustomCharts
                                                }
                                            }
                                            if (!chart.custom) {
                                                //traverse the x column in tblsel
                                                customBarColors(chart);
                                                setLegendDisplay(chart, false);
                                                window.apmChartOptions[chart.chart.renderTo] = chart;
                                                window.apmCharts[chart.chart.renderTo] = new Highcharts.Chart(chart);
                                            }
                                            else {
                                                window.appCustomCharts.process(chart,scope.reportSelector);
                                            }
                                        }
                                    }
                                }
                            } //MADELIVE - Matching the else from near var p=i; (wow).
                            if (scope.hidetopper == "true") {
                                $(".rpt-chart-topper,.rpt-title,.rpt-table-topper,.rpt-toggle,.rpt-max-link", scope.reportSelector).hide();
                            }
                            if (scope.hidetopheader == "true") {
                                $(".acuity-table__top-th", scope.reportSelector).hide();
                            }

                            ko.postbox.subscribe("SearchChange", function (f) {
                                if (f != scope.savedfilter) {
                                    if (f.length != (scope.savedfilter.length + 1)) { //unhide
                                        $("tbody tr", scope.reportSelector).show();
                                    }
                                    var fs = f.split(" ");
                                    for (var i in fs) {
                                        $("tbody tr",scope.reportSelector).each(function() {
                                            var mytr = this;
                                            var trshow = false;
                                            $("td",mytr).each(function() {
                                                if (!trshow) {
                                                    if ($(this).html().indexOf(fs[i]) >= 0) {
                                                        trshow = true;
                                                    }
                                                }
                                            });
                                            if (!trshow) {
                                                $(mytr).hide();                                                
                                            }
                                        });
                                    }
                                }
                                scope.savedfilter = f;
                            });


                            if (json.report.formparams) {
                                try {
                                    var jfs = json.report.formparams.split("&");
                                    for (var jfi in jfs) {
                                        var jfss = jfs[jfi].split("=");
                                        switch (jfss[0]) {
                                            case "Icon":
                                                var p = JSON.parse(jfss[1]);
                                                p.class= p.prompt.replace(/ /g,"").replace(/\./g,"").replace(/\,/g,""); //TODO: regex
                                                //TODO: Move this placement to server-side:
                                                $(((a$.exists(p.popup))?".rpt-popup-" + p.popup:"") + " .rpt-title", scope.reportSelector).append('<span class="' + p.class + '" style="background-color:white;color:black;padding:5px;border-radius:12px;cursor:pointer;margin-left:20px;margin-right:10px;">' + p.prompt + '</span>');
                                                $("." + p.class, scope.reportSelector).unbind().bind("click", function() {
                                                    if (typeof window.userFunctions[p.userFunction] === "function") {
                                                        window.userFunctions[p.userFunction](p);
                                                    }
                                                    else {
                                                        alert("userFunction " + p.userFunction + " not found.");
                                                    }
                                                });
                                                /*

                                                switch (p.action) {
                                                    case "NEW":
                                                        //TODO: Limit it to the form rendered on this pass.
                                                        alert("debug: ADD Icon setup");
                                                        $(".rpt-title", scope.reportSelector).prepend('<span class="add-icon" style="cursor:pointer;margin-left:10px;margin-right:10px;">ADD RECORD</span>');                                                        
                                                        $(".add-icon", scope.reportSelector).unbind().bind("click", function() {                                                            
                                                            alert("debug:add icon clicked");
                                                            if (typeof window.userFunctions[p.func] === "function") {
                                                                window.userFunctions[p.func](p);
                                                            }
                                                        });
                                                    break;
                                                default:
                                                    alert("Icon Action " + p.action + " not recognized");
                                                */
                                                break;
                                            default:
                                                alert("Param '" + jfss[0] + "' not recognized.");
                                        }
                                    }
                                }
                                catch (e) {
                                    alert("parse/exec error: " + json.report.formparams);
                                }
                            }


                            if (scope.scopehighlight == "true") {
                                $(".rpt-scope-highlight", scope.reportSelector).removeClass("rpt-scope-highlight");
                                if ((legacyContainer.scope.filters.CSR != "")&&(legacyContainer.scope.filters.CSR != "each")) {
                                    $(".app-user-link", scope.reportSelector).each(function () {
                                        if ($(this).attr("userid") == legacyContainer.scope.filters.CSR) {
                                            $(this).parent().parent().addClass("rpt-scope-highlight");
                                            $(this).parent().addClass("rpt-scope-highlight");
                                        }
                                    });
                                }
                            }

                        }

                        if ($(" .rpt-panel", scope.reportSelector).length > 0) {
                            //MADE2DEV2 - If there are non-popup panels.
                            var nonpopup = false;
                            $(" .rpt-panel", scope.reportSelector).each(function () {
                                if (!$(this).hasClass("rpt-panel-popup")) {
                                    nonpopup = true;
                                }
                            });
                            if (nonpopup) {
                                $(scope.reportSelector).parent().css("overflow", "hidden"); //No scroll bars if using panels.
                            }
                            else {
                                if (scope.noscroll == "true") {
                                    $(scope.reportSelector).parent().css("overflow", "hidden");
                                }
                                else {
                                    $(scope.reportSelector).parent().css("overflow", "auto");
                                }
                            }
                        }
                        else {
                            $(scope.reportSelector).parent().css("overflow", "hidden"); //No scroll EVER on an ng-acuity-report (would be controlled externally, no?)
                            //$(sel).parent().css("overflow", "scroll");
                        }
                        //Activate things in the form (it's blow & go right now).

                        //get this called for all  instances of getreport
                        //MADE2DEV2 - Took out the unbind() - $(".tbl-drill tbody td").unbind().bind("click", function (e) {
                        //MADEDEV (add .report-titlelink selector)
                        //BUG: If there's a GRIDCID, this is causing Sidekick's agent table to reload to only the team leader due to CSR=<empty>
                        //This may be fixed with some of the other code changes (line 2378 approx)
                        $(".tbl-drill tbody td,.tbl-drill tbody td .report-titlelink", scope.reportSelector).unbind("click").bind("click", function (e) {
                            clicked_drill_td(this);
                        });

                        /*
                        function setsort() {

                        }
                        setTimeout(setsort, 500);
                        */
                        if (a$.exists(window.userFunctions)) {
                            if (a$.exists(userFunctions.reportPostload)) {
                                userFunctions.reportPostload({
                                    name: scope.name,
                                    cid: scope.cid,
                                    error: json.report.error || (json.report.panel[0].html.indexOf("SQL Error") > 0),
                                    show: json.report.show
                                });
                            }
                        }
                    } else {
                        //a$.jsonerror({ errormessage: true, msg: "Report not found (in 'getreport')." });
                    }
                }
            }

            function expandme(me, eis, leaveclosed) { //eis = expandIndexes
                var ec = $(" .expander-info", $(me).parent()).eq(0).html();
                ecss = ec.split("/");
                var ecs = [];
                ecs[0] = parseInt(ecss[0], 10);
                ecs[1] = parseInt(ecss[1], 10);
                //Find yourself and determine how many columns are before you.
                var mythi = $(me).parent().index();
                var cnt = 0;
                var tr = $(me).parent().parent();
                $(tr).children().each(function () {
                    if ($(this).index() < mythi) {
                        //If there's an expander colspan indicator.
                        if ($(" .expander-info", this).length > 0) {
                            var ecss2 = $(" .expander-info", this).eq(0).html().split("/");
                            cnt += parseInt(ecss2[0], 10);
                        } else if (typeof $(this).attr("colspan") != "undefined") {
                            cnt += parseInt($(this).attr("colspan"), 10);
                        } else {
                            cnt += 1;
                        }
                    }
                });
                //alert("debug: " + cnt + " columns found before this.");
                var hide;
                var leaveopen = false;
                var curidx = $(me).parent().index();
                if (a$.exists(eis)) {
                    for (var i in eis) {
                        if (eis[i] == curidx) {
                            leaveopen = true;
                        }
                    }
                }
                //if ($(me).parent().index() == 0) { leaveopen = false; };
                if ((!leaveclosed) && (leaveopen || $(me).hasClass("expander-expand"))) {
                    //alert("debug:expand to " + ecs[0] + " columns");
                    hide = false;
                    $(me).removeClass("expander-expand").addClass("expander-collapse");
                    $(me).parent().attr("colspan", ecss[0]);
                } else {
                    //alert("debug:collapse to " + ecs[1] + " columns");
                    hide = true;
                    $(me).removeClass("expander-collapse").addClass("expander-expand");
                    $(me).parent().attr("colspan", ecss[1]);
                }
                var thead = tr.parent();
                var tbody = $(" tbody", $(thead).parent()).eq(0);
                $(" > tr", thead).each(function () {
                    if ($(this).index() > $(tr).index()) { //This is a tr in thead which is lower than the row with the expander
                        var idx = 0;
                        $(this).children().each(function () {
                            if ((idx >= (cnt + ecs[1])) && (idx < (cnt + ecs[0]))) {
                                if (hide) $(this).hide();
                                else $(this).show();
                            }
                            if (typeof $(this).attr("colspan") != "undefined") {
                                idx += parseInt($(this).attr("colspan"), 10);
                            } else {
                                idx += 1;
                            }
                        });
                    }
                });
                $(" > tr", tbody).each(function () {
                    if (true) { //  DO FOR ALL ROWS //from above:$(this).index() > $(tr).index()) { //This is a tr in thead which is lower than the row with the expander
                        var idx = 0;
                        $(this).children().each(function () {
                            if ((idx >= (cnt + ecs[1])) && (idx < (cnt + ecs[0]))) {
                                if (hide) $(this).hide();
                                else $(this).show();
                            }
                            if (typeof $(this).attr("colspan") != "undefined") {
                                idx += parseInt($(this).attr("colspan"), 10);
                            } else {
                                idx += 1;
                            }
                        });
                    }
                });

            }

            //Unifyme
            if (scope.manualfilters != "true") {
                try {
                    //NATHAN
                    /*
                    ko.postbox.subscribe("Signal", function(so) {
                        alert("debug: Signal received: route:" + so.route + ", info:" + so.info + ", datestamp:" + so.datestamp);
                    });
                    */

                    //TODO: Test this.  The timeout loop may be preferable if this gets false positives.
                    //Note: SearchClicked polls the "Search" button in the parent frame.
                    ko.postbox.subscribe("SearchClicked", function (newValue) {
                        if (scope.requiresearch == "true") {
                            $(scope.reportSelector).html('<p class="refreshing">Loading...</p>');
                            scope.getreport();
                        }
                    });
                    ko.postbox.subscribe("ReportSubmitClicked", function (assoc) {
                        if ((assoc == scope.assoc) || (!assoc)) {
                            $(scope.reportSelector).html('<p class="refreshing">Loading...</p>');
                            scope.getreport(true); //true = defeat cache
                        }
                    });
                    ko.postbox.subscribe("RefreshReportCacheOverride", function (assoc) {
                        if ((assoc == scope.assoc) || (!assoc)) {
                            $(scope.reportSelector).html('<p class="refreshing">Loading...</p>');
                            scope.getreport(true); //true = defeat cache
                        }
                    });
                    ko.postbox.subscribe("Filters", function (newValue) {

                        var testgp = gatheredParams();  //For comparison (if anything changed)

                        //2022-12-28 - Only trigger report change if dashboard change is relevant (select)
                        var dashboardchange = false;
                        if (scope.dashboard == "select") {
                            if (scope.SavedDashboard != legacyContainer.scope.filters.dashboard) {
                                dashboardchange = true;                               
                            }                           
                        }                       

                        if ((testgp != scope.SavedGatheredParams) || (dashboardchange)) {
                            if (scope.cid == "SpreadsheetDashboard_UI") {
                                var g = 1;
                                //alert("debug: refreshing ttm 12 month");
                            }
                            scope.SavedGatheredParams = testgp;
                            scope.SavedDashboard = legacyContainer.scope.filters.dashboard;
                            if (scope.requiresearch != "true") {
                                var vis = true;
                                if (true) { //($.cookie("TP1Username") == "jgardner") {
                                    if (scope.waitforvisible && (scope.waitforvisible != "")) {
                                        vis = false;
                                        if ($(scope.reportSelector).is(":visible")) {
                                            vis = true;
                                        }
                                        else if (scope.waitforvisible == "#openbox-button, #journaldetailsbox") {
                                            if ($("i","#openbox-button").hasClass("fa-minus")) {
                                                vis = true;
                                            }
                                        }
                                        else if ($(scope.waitforvisible).hasClass("tab-active")) {
                                            vis = true;
                                        }
                                    }
                                }
                                if (vis) {
                                    $(scope.reportSelector).html('<p class="refreshing">Loading...</p>');
                                    scope.getreport();
                                }
                            }
                            if (false) { //(scope.extendkludge == "true") {                
                                //scope.maxheight = 350;
                                setTimeout(function() {
                                    $(".report-touchrank").css("max-height","390px"); //Double kludge
                                }, 1000);
                            }
                        }
                        else if (scope.scopehighlight == "true") {
                            //2023-11-13 - See if I'm already on the agent.
                            var alreadythere = false;
                        $(".app-user-link", scope.reportSelector).each(function () {
                                if ($(this).attr("userid") == legacyContainer.scope.filters.CSR) {
                                    alreadythere = true;
                                }                                
                            });
                            if (!alreadythere) {
                                $(".rpt-scope-highlight", scope.reportSelector).removeClass("rpt-scope-highlight");

                                $(".report-tableeditor", scope.reportSelector).parent().remove(); //Get the TR
                                $(".app-journal-link", scope.reportSelector).html("+");

                                if ((legacyContainer.scope.filters.CSR != "")&&(legacyContainer.scope.filters.CSR != "each")) {
                                    $(".app-user-link", scope.reportSelector).each(function () {
                                        if ($(this).attr("userid") == legacyContainer.scope.filters.CSR) {
                                            $(this).parent().parent().addClass("rpt-scope-highlight");
                                            //$(scope.reportSelector).scrollTop($(this).parent().parent().position());
                                            $(this).parent().addClass("rpt-scope-highlight");
                                        }
                                    });
                                }
                            }
                        }
                    });
                }
                catch (e) {
                    scope.manualfilters = "true"; //Fallback
                };
            }
            if (scope.manualfilters == "true") {
                //If pubsub isn't available (I'm getting rid of "event by cookie", so this may stop working).
                legacyContainer.scope.filters = { CSR: "", Team: "" };
                scope.checkfilters();
            }
        }

                var acp = "";
                if (scope.allowconfigparam != null) {
                    if (scope.allowconfigparam.split("=").length > 1) {
                        acp=scope.allowconfigparam;
                    }
                }                
                
                if (acp == "") {
                    showit();
                }
                else {
                  a$.getConfigParameterByName(acp.split("=")[0],function(val) {
                    if (a$.exists(val.ParamValue)) {
                      if (val.ParamValue == acp.split("=")[1]) {
                          showit();
                      }                    
                    }
                  });
                }

        }
    }
} ]);
